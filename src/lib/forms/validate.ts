import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

/**
 * Shared, dependency-light validation used by the client (inline feedback) and the server
 * (authoritative). Copy follows the Surface Talent voice: plain, specific, no blame.
 */

export const EMAIL_ERROR = "That email doesn't look quite right. Check it and try again.";
export const PHONE_ERROR = "That number doesn't look complete. Check the country code and try again.";

/**
 * Real-world email check: RFC 5322-ish local part, a domain with at least one dot and a
 * letter-only TLD of 2+ chars, length limits (64 local / 254 total), no leading/trailing or
 * double dots. Deliberately accepts plus-addressing, hyphens and long TLDs. Syntax only — this
 * does not prove the mailbox exists.
 */
export function validateEmail(raw: string): { ok: true; value: string } | { ok: false; message: string } {
  const value = raw.trim().toLowerCase();
  if (!value) return { ok: false, message: "Add your email so we can reply." };
  if (value.length > 254) return { ok: false, message: EMAIL_ERROR };
  const at = value.lastIndexOf("@");
  if (at <= 0 || at === value.length - 1) return { ok: false, message: EMAIL_ERROR };
  const local = value.slice(0, at), domain = value.slice(at + 1);
  if (local.length > 64 || /^\.|\.$|\.\./.test(local) || !/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local)) return { ok: false, message: EMAIL_ERROR };
  const labels = domain.split(".");
  if (labels.length < 2 || labels.some((l) => !l || l.length > 63 || !/^[a-z0-9-]+$/.test(l) || /^-|-$/.test(l))) return { ok: false, message: EMAIL_ERROR };
  if (!/^[a-z]{2,63}$/.test(labels[labels.length - 1])) return { ok: false, message: EMAIL_ERROR };
  return { ok: true, value };
}

/**
 * Phone parsing/validity via Google's libphonenumber (libphonenumber-js). UK default region;
 * a leading + or 00 switches country. Returns E.164 plus display form. Validity ≠ ownership.
 */
export function validatePhone(raw: string, defaultCountry: CountryCode = "GB"): { ok: true; e164: string; country: string; display: string } | { ok: false; message: string } {
  let value = raw.trim();
  if (!value) return { ok: false, message: PHONE_ERROR };
  if (value.startsWith("00")) value = "+" + value.slice(2);
  const parsed = parsePhoneNumberFromString(value, defaultCountry);
  if (!parsed || !parsed.isValid()) return { ok: false, message: PHONE_ERROR };
  return { ok: true, e164: parsed.number, country: parsed.country || defaultCountry, display: parsed.formatInternational() };
}

export const CV_MAX_BYTES = 10 * 1024 * 1024;
export const CV_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};
export function cvExtension(name: string, mime: string): string | null {
  const byMime = CV_TYPES[mime];
  const lower = name.toLowerCase();
  const byName = lower.endsWith(".pdf") ? "pdf" : lower.endsWith(".docx") ? "docx" : lower.endsWith(".doc") ? "doc" : null;
  const ext = byMime || byName;
  if (!ext || (byName && byMime && byName !== byMime)) return null;
  return ext;
}
export function validateCv(file: { name: string; size: number; type: string } | null): { ok: true; ext: string | null } | { ok: false; message: string } {
  if (!file || file.size === 0) return { ok: true, ext: null };
  if (file.size > CV_MAX_BYTES) return { ok: false, message: "That file is over 10 MB. Send a smaller PDF or Word document." };
  const ext = cvExtension(file.name, file.type);
  if (!ext) return { ok: false, message: "We can take a PDF or Word document (.pdf, .doc, .docx)." };
  return { ok: true, ext };
}

export type FormType = "candidate_registration" | "contact_hiring" | "contact_career_move" | "contact_general";
export const FORM_TYPES: FormType[] = ["candidate_registration", "contact_hiring", "contact_career_move", "contact_general"];

export type FieldErrors = Record<string, string>;

/** Field-level rules for each form. Server and client run the same function. */
export function validateFields(formType: FormType, f: Record<string, string>): FieldErrors {
  const e: FieldErrors = {};
  const name = (f.name || "").trim();
  if (name.length < 2) e.name = "Add your name.";
  if (name.length > 120) e.name = "That name is too long.";
  const email = validateEmail(f.email || "");
  if (!email.ok) e.email = email.message;
  if ((f.phone || "").trim()) { const p = validatePhone(f.phone); if (!p.ok) e.phone = p.message; }
  if (!["on", "true", "1", "yes"].includes(String(f.privacy_consent || ""))) e.privacy_consent = "Tick the box so we can hold your details.";
  if ((f.message || "").length > 4000) e.message = "Keep the message under 4,000 characters.";
  if ((f.linkedin_url || "").trim() && !/^(https?:\/\/)?([a-z0-9-]+\.)*linkedin\.com\/.+/i.test(f.linkedin_url.trim())) e.linkedin_url = "That doesn't look like a LinkedIn URL.";
  if (formType === "contact_hiring") {
    if (!(f.company || "").trim()) e.company = "Add your company so we know who we're talking to.";
    if (!(f.target_role || "").trim()) e.target_role = "Tell us the role you're hiring for.";
    if (!(f.phone || "").trim()) e.phone = "Add a number so we can call you back.";
  }
  if (formType === "candidate_registration") {
    if (!(f.discipline || "").trim()) e.discipline = "Pick the discipline closest to your work.";
  }
  if (formType === "contact_general" && !(f.message || "").trim()) e.message = "Tell us what you'd like to talk about.";
  return e;
}
