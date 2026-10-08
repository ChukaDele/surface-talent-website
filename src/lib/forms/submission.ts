import { FORM_TYPES, cvExtension, validateCv, validateEmail, validateFields, validatePhone, type FormType } from "./validate";

/** Server-side submission pipeline shared by the route handler and tests. */

export type SubmitResult =
  | { ok: true; id: string; sheet?: string; cv_ok?: boolean; email_ok?: boolean; duplicate?: boolean }
  | { ok: false; error: string; field?: string; message?: string; status: number };

export type Persistence = { forward: (payload: Record<string, unknown>) => Promise<{ ok: boolean; status: number; body: Record<string, unknown> }> };

export function newSubmissionId(now = new Date()): string {
  const d = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rnd = crypto.getRandomValues(new Uint8Array(4));
  return `ST-${d}-${Array.from(rnd, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

const LIST_FIELDS = ["employment_types", "preferred_locations"];
const TEXT_FIELDS = [
  "enquiry_type", "name", "email", "phone", "company", "current_title", "current_employer", "location", "postcode", "target_role", "discipline",
  "years_experience", "salary_expectation", "notice_period", "availability", "right_to_work", "linkedin_url", "hires_count", "hiring_timeline",
  "target_start", "message", "source_page", "source_url", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid",
];

function str(v: FormDataEntryValue | null, max = 2000): string { return typeof v === "string" ? v.trim().slice(0, max) : ""; }

/** In-memory guards (per isolate): rate limit by IP and idempotency by client key. Cloudflare Workers keep this per-isolate; good enough to stop double-clicks and casual floods without a datastore. */
const recent = new Map<string, { at: number; result: SubmitResult }>();
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, now = Date.now(), limit = 20, windowMs = 10 * 60 * 1000): boolean {
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(ip, arr);
  return arr.length > limit;
}
export function rememberResult(key: string, result: SubmitResult) { recent.set(key, { at: Date.now(), result }); if (recent.size > 500) { const oldest = [...recent.entries()].sort((a, b) => a[1].at - b[1].at)[0]; recent.delete(oldest[0]); } }
export function recalled(key: string): SubmitResult | undefined { const r = recent.get(key); return r && Date.now() - r.at < 15 * 60 * 1000 ? r.result : undefined; }

async function ipHash(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("st:" + ip));
  return Array.from(new Uint8Array(buf).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function processSubmission(form: FormData, ctx: { ip: string; userAgent: string; environment: string; persistence: Persistence | null }): Promise<SubmitResult> {
  // 1. bot guards: honeypot + minimum fill time
  if (str(form.get("website_url")) || str(form.get("_gotcha"))) return { ok: true, id: "ignored" };
  const started = Number(form.get("_form_started") || 0);
  if (started && Date.now() - started < 1500) return { ok: true, id: "ignored" };

  const formType = str(form.get("form_type")) as FormType;
  if (!FORM_TYPES.includes(formType)) return { ok: false, error: "invalid_form_type", status: 400, message: "This form isn't recognised. Reload the page and try again." };

  // 2. field validation (same rules as the client)
  const fields: Record<string, string> = {};
  for (const k of TEXT_FIELDS) fields[k] = str(form.get(k), k === "message" ? 4000 : 500);
  fields.privacy_consent = str(form.get("privacy_consent"));
  const errors = validateFields(formType, fields);
  const cvFile = form.get("cv");
  const cvMeta = cvFile && typeof cvFile === "object" ? { name: cvFile.name, size: cvFile.size, type: cvFile.type } : null;
  const cvCheck = validateCv(cvMeta);
  if (!cvCheck.ok) errors.cv = cvCheck.message;
  const firstField = Object.keys(errors)[0];
  if (firstField) return { ok: false, error: "validation", field: firstField, message: errors[firstField], status: 400 };

  const email = validateEmail(fields.email);
  const phone = fields.phone ? validatePhone(fields.phone) : null;
  const lists: Record<string, string[]> = {};
  for (const k of LIST_FIELDS) lists[k] = form.getAll(k).flatMap((v) => String(v).split("|")).map((v) => v.trim()).filter(Boolean).slice(0, 12);

  // 3. server-generated id; 4. idempotency
  const clientKey = str(form.get("_client_key"), 80);
  const dedupeKey = clientKey ? `${clientKey}:${email.ok ? email.value : ""}` : "";
  const prior = dedupeKey ? recalled(dedupeKey) : undefined;
  if (prior && prior.ok) return { ...prior, duplicate: true };
  const id = newSubmissionId();

  let cv: Record<string, unknown> | null = null;
  if (cvFile && typeof cvFile === "object" && cvFile.size > 0) {
    const ext = cvExtension(cvFile.name, cvFile.type)!;
    const bytes = new Uint8Array(await cvFile.arrayBuffer());
    let bin = ""; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    const MIME: Record<string, string> = { pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
    cv = { filename: cvFile.name.replace(/[^\w.\- ]+/g, "-").slice(0, 120), mime: MIME[ext], ext, base64: btoa(bin) };
  }

  const payload: Record<string, unknown> = {
    submission_id: id, submitted_at_iso: new Date().toISOString(), environment: ctx.environment, form_type: formType,
    ...fields, email: email.ok ? email.value : fields.email,
    phone_e164: phone && phone.ok ? phone.e164 : "", phone_country: phone && phone.ok ? phone.country : "", phone_display: phone && phone.ok ? phone.display : fields.phone,
    // The authorised Apps Script deployment still normalises the original plural/legacy keys.
    // Keep the current form field names above, and send these aliases so page tabs retain the
    // role, location and discipline values instead of silently dropping them.
    intent: fields.enquiry_type,
    current_role: fields.current_title,
    current_location: fields.location,
    role: fields.target_role,
    disciplines: fields.discipline ? [fields.discipline] : [],
    functions: fields.target_function ? [fields.target_function] : [],
    locations: lists.preferred_locations,
    seniority: fields.years_experience,
    salary: fields.salary_expectation,
    timeline: fields.hiring_timeline || fields.notice_period,
    ...lists, privacy_consent: true, user_agent_family: ctx.userAgent.slice(0, 120), ip_hash: await ipHash(ctx.ip), cv,
  };
  delete payload.phone;

  // 5. persist (the record must land before we report success)
  if (!ctx.persistence) return { ok: false, error: "submit_unavailable", status: 503, message: "Submissions aren't switched on for this environment yet. Email hello@surfacetalent.co.uk and we'll pick it up." };
  let up: { ok: boolean; status: number; body: Record<string, unknown> };
  try { up = await ctx.persistence.forward(payload); }
  catch (err) { console.error("[submit] upstream unreachable", id, String(err)); return { ok: false, error: "upstream_unreachable", status: 502, message: "We couldn't save that just now. Your details are still in the form — try again in a moment." }; }
  if (!up.ok || up.body.ok === false) {
    console.error("[submit] upstream failed", id, up.status, JSON.stringify(up.body).slice(0, 300));
    return { ok: false, error: String(up.body.error || "upstream_failed"), status: 502, message: "We couldn't save that just now. Your details are still in the form — try again in a moment." };
  }
  const result: SubmitResult = { ok: true, id: String(up.body.submission_id || id), sheet: up.body.sheet as string | undefined, cv_ok: up.body.cv_ok !== false, email_ok: up.body.email_ok !== false };
  if (dedupeKey) rememberResult(dedupeKey, result);
  if (result.email_ok === false) console.warn("[submit] saved but notification failed", result.id);
  return result;
}

/** Apps Script web-app adapter (the authorised Google integration inherited from the legacy site). */
export function appsScriptPersistence(url: string, secret: string): Persistence {
  return {
    async forward(payload) {
      const target = new URL(url); target.searchParams.set("secret", secret);
      const res = await fetch(target.toString(), { method: "POST", headers: { "Content-Type": "application/json", "X-ST-Secret": secret }, body: JSON.stringify(payload), redirect: "follow" });
      const text = await res.text();
      let body: Record<string, unknown> = {};
      try { body = JSON.parse(text); } catch { body = { ok: false, error: "upstream_invalid", detail: text.slice(0, 200) }; }
      return { ok: res.ok, status: res.status, body };
    },
  };
}
