import { expect, test } from "@playwright/test";
import { validateEmail, validatePhone, validateCv, validateFields } from "../src/lib/forms/validate";
import { processSubmission, newSubmissionId } from "../src/lib/forms/submission";

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
});
