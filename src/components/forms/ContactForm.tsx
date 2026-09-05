"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BotGuards, Checkbox, FileField, SelectField, TextArea, TextField } from "./fields";
import { SubmitButton } from "./SubmitButton";
import { useSubmission } from "./useSubmission";
import { DISCIPLINES, ENQUIRY_TYPES, HIRES, HIRE_EMPLOYMENT, TIMELINES } from "@/lib/forms/options";
import type { FormType } from "@/lib/forms/validate";

const TYPE_MAP: Record<string, FormType> = { hiring: "contact_hiring", career_move: "contact_career_move", general: "contact_general" };

/**
 * Contact enquiry (Figma Frame 167 on the dark band, 620 wide). The enquiry-type select drives the
 * form type and reveals only the fields that matter: hiring → company, phone, role, volume, timeline;
 * career move → current role + optional CV; general → message.
 */
export function ContactForm() {
  const [kind, setKind] = useState<string>("hiring");
  const formType = TYPE_MAP[kind];
  const { state, errors, message, submissionId, onSubmit, clearError, busy } = useSubmission(formType);
  const [cvName, setCvName] = useState("");
  // Jobs "Apply" links arrive as /contact?role=<title>#brief — prefill the role (uncontrolled input, no state)
  useEffect(() => {
    const role = new URLSearchParams(window.location.search).get("role");
    if (!role) return;
    const el = document.querySelector<HTMLInputElement>("#brief-form input[name='target_role']");
    if (el && !el.value) el.value = role.slice(0, 200);
  }, [kind]);
  if (state === "success") {
    return (
      <div className="st-form st-form--dark st-form--done" role="status" aria-live="polite">
        <p className="st-eyebrow">Received</p>
        <h3 className="st-h4">Thanks — we’ve got it.</h3>
        <p className="st-body">We’ll come back within 24 hours. Your reference is <strong>{submissionId}</strong>.</p>
      </div>
    );
  }
  return (
    <form className="st-form st-form--dark" id="brief-form" aria-label="Send a brief" onSubmit={onSubmit} noValidate aria-describedby="brief-status" onChange={(e) => { const t = e.target as unknown as { name?: string }; if (t.name) clearError(t.name); }}>
      <input type="hidden" name="form_type" value={formType} />
      <BotGuards />
      <div className="st-form__row">
        <TextField label="Full name" name="name" autoComplete="name" required error={errors.name} />
        <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" required error={errors.email} />
      </div>
      <div className="st-form__row">
        {kind === "hiring"
          ? <TextField label="Company" name="company" autoComplete="organization" required error={errors.company} placeholder="Company" />
          : <TextField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} />}
        <SelectField dark label="What brings you here?" name="enquiry_type" options={ENQUIRY_TYPES} value={kind} onValueChange={setKind} required />
      </div>
      {kind === "hiring" ? (
        <>
          <div className="st-form__row">
            <TextField label="Role you’re hiring for" name="target_role" required error={errors.target_role} placeholder="Role / discipline" />
            <TextField label="Location" name="location" autoComplete="address-level2" placeholder="Location" />
          </div>
          <div className="st-form__row">
            <TextField label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required error={errors.phone} placeholder="Phone" />
            <SelectField dark label="Discipline" name="discipline" options={DISCIPLINES} />
          </div>
          <div className="st-form__row">
            <SelectField dark label="How many hires?" name="hires_count" options={HIRES} />
            <SelectField dark label="Timeline" name="hiring_timeline" options={TIMELINES} />
          </div>
          <SelectField dark label="Employment type" name="employment_types" options={HIRE_EMPLOYMENT} />
        </>
      ) : kind === "career_move" ? (
        <>
          <div className="st-form__row">
            <TextField label="Current role and employer" name="current_title" autoComplete="organization-title" placeholder="Current role and employer" />
            <SelectField dark label="Discipline" name="discipline" options={DISCIPLINES} />
          </div>
          <FileField name="cv" label={<>Attach your CV<br />(optional)</>} error={errors.cv} fileName={cvName} onChange={(f) => setCvName(f ? f.name : "")} hint="PDF or Word, up to 10 MB." />
        </>
      ) : null}
      <TextArea label={kind === "general" ? "What would you like to talk about?" : "Anything else we should know?"} name="message" rows={3} required={kind === "general"} error={errors.message} />
      <Checkbox name="privacy_consent" label="I agree to the privacy policy." required error={errors.privacy_consent}>
        I agree to the <Link href="/privacy" prefetch={false} className="st-link">privacy policy</Link>.
      </Checkbox>
      <SubmitButton busy={busy} tone="light" className="st-btn--block">{busy ? (state === "uploading" ? "Uploading CV" : "Sending") : kind === "hiring" ? "Send brief" : "Send"}</SubmitButton>
      <p id="brief-status" className={`st-form__status ${state === "error" ? "st-form__status--error" : ""}`} role="status" aria-live="polite">{message}</p>
    </form>
  );
}
