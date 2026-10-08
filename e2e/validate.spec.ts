import { expect, test } from "@playwright/test";
import { validateEmail, validatePhone, validateCv, validateFields } from "../src/lib/forms/validate";
import { appsScriptPersistence, processSubmission, newSubmissionId } from "../src/lib/forms/submission";

test.describe("validation library", () => {
  test("email accepts real-world addresses and rejects malformed ones", () => {
    for (const ok of ["a@b.co", "first.last+tag@sub.example.co.uk", "o'neil@example.com", "x_y@example.museum"]) expect(validateEmail(ok).ok, ok).toBe(true);
    for (const bad of ["plain", "a@b", "a@b.", ".a@b.co", "a..b@b.co", "a@-b.co", "a@b.c0", "", "a@b.co ".repeat(40)]) expect(validateEmail(bad).ok, bad).toBe(false);
    expect((validateEmail(" Foo@Example.COM ") as { value: string }).value).toBe("foo@example.com");
  });
  test("phone parses UK and international numbers via libphonenumber", () => {
    const uk = validatePhone("07123 456789"); expect(uk.ok && uk.e164).toBe("+447123456789");
    const intl = validatePhone("+1 415 555 2671"); expect(intl.ok && intl.country).toBe("US");
    const dbl0 = validatePhone("0044 7123 456789"); expect(dbl0.ok && dbl0.e164).toBe("+447123456789");
    for (const bad of ["0770", "12345", "+44 1", "hello"]) expect(validatePhone(bad).ok, bad).toBe(false);
  });
  test("cv rules", () => {
    expect(validateCv(null).ok).toBe(true);
    expect(validateCv({ name: "cv.pdf", size: 1000, type: "application/pdf" }).ok).toBe(true);
    expect(validateCv({ name: "cv.exe", size: 1000, type: "application/octet-stream" }).ok).toBe(false);
    expect(validateCv({ name: "cv.pdf", size: 11 * 1024 * 1024, type: "application/pdf" }).ok).toBe(false);
  });
  test("per-form field rules", () => {
    expect(Object.keys(validateFields("contact_hiring", { name: "A B", email: "a@b.co", privacy_consent: "on" }))).toEqual(expect.arrayContaining(["company", "target_role", "phone"]));
    expect(validateFields("candidate_registration", { name: "A B", email: "a@b.co", privacy_consent: "on", discipline: "X" })).toEqual({});
  });
  test("submission id shape and unconfigured persistence → 503 boundary", async () => {
    expect(newSubmissionId()).toMatch(/^ST-\d{8}-[0-9a-f]{8}$/);
    const fd = new FormData();
    for (const [k, v] of Object.entries({ form_type: "contact_general", name: "Test", email: "t@example.com", message: "hi", privacy_consent: "on", _form_started: String(Date.now() - 5000) })) fd.set(k, v);
    const r = await processSubmission(fd, { ip: "127.0.0.1", userAgent: "test", environment: "staging", persistence: null });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(503);
    const forwarded: Record<string, unknown>[] = [];
    const ok = await processSubmission(fd, { ip: "127.0.0.1", userAgent: "test", environment: "staging", persistence: { forward: async (p) => { forwarded.push(p); return { ok: true, status: 200, body: { ok: true, submission_id: p.submission_id } }; } } });
    expect(ok.ok).toBe(true);
    expect(forwarded[0].environment).toBe("staging");
    expect(forwarded[0].phone).toBeUndefined();
  });
  test("submission requires explicit upstream success and preserves unknown outcomes", async () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries({ form_type: "contact_general", name: "Synthetic Test", email: "test@example.com", message: "Synthetic fixture", privacy_consent: "on" })) fd.set(k, v);
    const ctx = { ip: "test", userAgent: "test", environment: "staging" };
    const missing = await processSubmission(fd, { ...ctx, persistence: { forward: async () => ({ ok: true, status: 200, body: {} }) } });
    expect(missing.ok).toBe(false);
    const unknown = await processSubmission(fd, { ...ctx, persistence: { forward: async () => ({ ok: true, status: 200, body: { ok: true } }) } });
    expect(unknown.ok && unknown.cv_ok).toBeUndefined();
    expect(unknown.ok && unknown.email_ok).toBeUndefined();
    expect(unknown.ok && unknown.audit_ok).toBeUndefined();
    const partial = await processSubmission(fd, { ...ctx, persistence: { forward: async () => ({ ok: true, status: 200, body: { ok: true, audit_ok: false, email_ok: true, cv_ok: true } }) } });
    expect(partial.ok).toBe(true);
    expect(partial.ok && partial.audit_ok).toBe(false);
    fd.set("message", "x".repeat(4001));
    let forwarded = false;
    const oversized = await processSubmission(fd, { ...ctx, persistence: { forward: async () => { forwarded = true; return { ok: true, status: 200, body: { ok: true } }; } } });
    expect(oversized.ok).toBe(false);
    expect(forwarded).toBe(false);
  });
  test("a submission faster than the bot guard never reports a saved receipt", async () => {
    const fd = new FormData();
    fd.set("_form_started", String(Date.now()));
    let forwarded = false;
    const result = await processSubmission(fd, { ip: "test", userAgent: "test", environment: "staging", persistence: { forward: async () => { forwarded = true; return { ok: true, status: 200, body: { ok: true } }; } } });
    expect(result.ok).toBe(false);
    if (!result.ok) { expect(result.error).toBe("minimum_fill_time"); expect(result.status).toBe(400); }
    expect(forwarded).toBe(false);
  });
});

test.describe("Google response adapter", () => {
  const endpoint = "https://script.google.com/macros/s/SYNTHETIC/exec";
  const secret = "SYNTHETIC-SECRET-NOT-A-CREDENTIAL";
  async function scenario(responses: Response[]) {
    const original = globalThis.fetch;
    const calls: Request[] = [];
    globalThis.fetch = async (input, init) => {
      calls.push(new Request(input, init));
      const response = responses.shift();
      if (!response) throw new Error("Unexpected extra provider request");
      return response;
    };
    try { return { result: await appsScriptPersistence(endpoint, secret).forward({ form_type: "contact_hiring" }), calls }; }
    finally { globalThis.fetch = original; }
  }
  test("reads the Google response without forwarding credentials or replaying the submission", async () => {
    for (const status of [302, 303]) {
      const { result, calls } = await scenario([
        new Response(null, { status, headers: { location: `https://script.googleusercontent.com/macros/echo?user_content_key=SYNTHETIC&secret=${secret}` } }),
        Response.json({ ok: true, submission_id: "SYNTHETIC-ID" }),
      ]);
      expect(result.body.ok).toBe(true); expect(calls).toHaveLength(2);
      expect(calls[0].method).toBe("POST"); expect(calls[0].headers.get("X-ST-Secret")).toBe(secret);
      expect(calls[1].method).toBe("GET"); expect(await calls[1].text()).toBe("");
      expect(calls[1].headers.has("X-ST-Secret")).toBe(false); expect(calls[1].headers.has("Content-Type")).toBe(false);
      expect(new URL(calls[1].url).searchParams.has("secret")).toBe(false);
      expect(new URL(calls[1].url).searchParams.get("user_content_key")).toBe("SYNTHETIC");
      expect(calls[0].signal.aborted).toBe(false); expect(calls[1].cache).toBe("no-store");
    }
  });
  test("rejects untrusted redirect destinations before making another request", async () => {
    for (const location of ["http://script.googleusercontent.com/", "https://example.com/", "https://script.googleusercontent.com.example.com/", "https://user:pass@script.googleusercontent.com/", "https://script.googleusercontent.com:8443/"]) {
      const { result, calls } = await scenario([new Response(null, { status: 302, headers: { location } })]);
      expect(result.ok).toBe(false); expect(result.body.error).toBe("upstream_redirect"); expect(calls).toHaveLength(1);
    }
  });
  test("does not replay POST-preserving redirects and bounds response redirect loops", async () => {
    for (const status of [307, 308]) {
      const { result, calls } = await scenario([new Response(null, { status, headers: { location: "https://script.googleusercontent.com/macros/echo" } })]);
      expect(result.ok).toBe(false); expect(calls).toHaveLength(1);
    }
    const { result, calls } = await scenario(Array.from({ length: 4 }, () => new Response(null, { status: 302, headers: { location: "https://script.googleusercontent.com/macros/echo" } })));
    expect(result.ok).toBe(false); expect(calls).toHaveLength(4);
    expect(calls.filter(r => r.method === "POST")).toHaveLength(1);
  });
  test("rejects malformed and non-object responses without exposing provider content", async () => {
    for (const text of ["<html>Sorry, unable to open the file</html>", "null", "[]", "true", "not json", '{"ok":true,"service":"Surface Talent submissions"}']) {
      const { result, calls } = await scenario([new Response(text)]);
      expect(result.body).toEqual({ ok: false, error: "upstream_invalid" }); expect(calls).toHaveLength(1);
    }
    const { result, calls } = await scenario([new Response('\uFEFF{"ok":true,"submission_id":"SYNTHETIC-ID"}')]);
    expect(result.body.ok).toBe(true);
    expect(calls).toHaveLength(1);
  });
  test("re-reads a transient Google response failure without submitting another enquiry", async () => {
    const redirect = () => new Response(null, { status: 302, headers: { location: "https://script.googleusercontent.com/macros/echo?user_content_key=SYNTHETIC" } });
    const receipt = () => Response.json({ ok: true, submission_id: "SYNTHETIC-ID" });
    for (const temporary of [new Response("Page not found", { status: 404 }), new Response("Unavailable", { status: 503 }), new Response("<html>Sorry, unable to open the file</html>")]) {
      const { result, calls } = await scenario([redirect(), temporary, receipt()]);
      expect(result.body.ok).toBe(true); expect(calls).toHaveLength(3);
      expect(calls.map(c => c.method)).toEqual(["POST", "GET", "GET"]);
      expect(calls[1].url).toBe(calls[2].url);
      expect(calls[2].headers.has("X-ST-Secret")).toBe(false);
    }
    const { result, calls } = await scenario([redirect(), ...Array.from({ length: 3 }, () => new Response("Page not found", { status: 404 }))]);
    expect(result.ok).toBe(false); expect(result.body.error).toBe("upstream_invalid");
    expect(calls.map(c => c.method)).toEqual(["POST", "GET", "GET", "GET"]);
    const recovered = await scenario([redirect(), new Response("Page not found", { status: 404 }), redirect(), receipt()]);
    expect(recovered.result.body.ok).toBe(true);
    expect(recovered.calls.map(c => c.method)).toEqual(["POST", "GET", "GET", "GET"]);
    const hostile = await scenario([redirect(), new Response("Page not found", { status: 404 }), new Response(null, { status: 302, headers: { location: "https://example.com/" } })]);
    expect(hostile.result.ok).toBe(false); expect(hostile.calls).toHaveLength(3);
    const applicationError = await scenario([redirect(), Response.json({ ok: false, error: "file you have requested does not exist" }, { status: 503 })]);
    expect(applicationError.result.body.ok).toBe(false); expect(applicationError.calls).toHaveLength(2);
  });
});
