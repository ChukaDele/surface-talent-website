"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { validateFields, validateCv, type FieldErrors, type FormType } from "@/lib/forms/validate";

export type SubmitState = "idle" | "submitting" | "uploading" | "success" | "error";

/**
 * Form state machine: idle → (client validation) → submitting/uploading → success | error.
 * Field values stay in the DOM (uncontrolled inputs) so a recoverable failure never erases what
 * the visitor typed. Progress is announced through an aria-live status region in the form.
 */
export function useSubmission(formType: FormType) {
  const [state, setState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>("");
  const [submissionId, setSubmissionId] = useState<string>("");
  const started = useRef<number>(0);
  const clientKey = useRef<string>("");
  useEffect(() => { started.current = Date.now(); clientKey.current = crypto.randomUUID(); }, []);

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting" || state === "uploading") return;
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const fields: Record<string, string> = {};
    fd.forEach((v, k) => { if (typeof v === "string") fields[k] = v; });
    const errs = validateFields(formType, fields);
    const cv = fd.get("cv");
    const cvCheck = validateCv(cv && typeof cv === "object" ? { name: cv.name, size: cv.size, type: cv.type } : null);
    if (!cvCheck.ok) errs.cv = cvCheck.message;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      setState("error"); setMessage("Check the highlighted fields and try again.");
      formEl.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    fd.set("form_type", formType);
    fd.set("_form_started", String(started.current));
    fd.set("_client_key", clientKey.current);
    fd.set("source_page", window.location.pathname.replace(/^\//, "") || "home");
    fd.set("source_url", window.location.href);
    fd.set("referrer", document.referrer);
    const params = new URLSearchParams(window.location.search);
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]) if (params.get(k)) fd.set(k, params.get(k)!);
    const hasFile = cv && typeof cv === "object" && cv.size > 0;
    setState(hasFile ? "uploading" : "submitting"); setMessage(hasFile ? "Uploading your CV…" : "Sending…");
    try {
      const res = await fetch("/api/submit", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSubmissionId(data.id); setState("success"); setMessage("Sent. We'll come back to you within 24 hours.");
        clientKey.current = crypto.randomUUID();
      } else {
        if (data.field) setErrors({ [data.field]: data.message || "Check this field." });
        setState("error"); setMessage(data.message || "Something went wrong sending that. Your details are still here — try again.");
        if (data.field) formEl.querySelector<HTMLElement>(`[name="${data.field}"]`)?.focus();
      }
    } catch {
      setState("error"); setMessage("We couldn't reach the server. Check your connection — your details are still here.");
    }
  }, [formType, state]);

  const clearError = useCallback((name: string) => setErrors((e) => { if (!e[name]) return e; const n = { ...e }; delete n[name]; return n; }), []);
  return { state, errors, message, submissionId, onSubmit, clearError, busy: state === "submitting" || state === "uploading" };
}
