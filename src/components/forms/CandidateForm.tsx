"use client";

import Link from "next/link";
import { useState } from "react";
import { BotGuards, Checkbox, CheckboxGroup, FileField, SelectField, TextArea, TextField } from "./fields";
import { SubmitButton } from "./SubmitButton";
import { useSubmission } from "./useSubmission";
import { AVAILABILITY, DISCIPLINES, EMPLOYMENT_TYPES, EXPERIENCE, RIGHT_TO_WORK } from "@/lib/forms/options";

/**
 * Candidates registration (Figma Frame 167, 520 × 485). Figma fields kept verbatim; the operational
 * extras (location, availability, experience, employment preference, right to work, salary, LinkedIn)
 * sit behind a single "More about you" disclosure so the first view stays as light as the design.
 */
export function CandidateForm() {
  const { state, errors, message, submissionId, onSubmit, clearError, busy } = useSubmission("candidate_registration");
  const [more, setMore] = useState(false);
  const [cvName, setCvName] = useState("");
  if (state === "success") {
    return (
      <div className="st-form st-form--done" role="status" aria-live="polite">
        <p className="st-eyebrow">Registered</p>
        <h3 className="st-h4">Thanks — we’ve got it.</h3>
        <p className="st-body">We’ll come back to you within 24 hours. Your reference is <strong>{submissionId}</strong>.</p>
      </div>
    );
  }
  return (
    <form className="st-form" id="register" aria-label="Register with Surface Talent" onSubmit={onSubmit} noValidate aria-describedby="register-status" onChange={(e) => { const t = e.target as unknown as { name?: string }; if (t.name) clearError(t.name); }}>
      <input type="hidden" name="form_type" value="candidate_registration" />
      <BotGuards />
      <div className="st-form__row">
        <TextField label="Full name" name="name" autoComplete="name" required error={errors.name} />
        <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" required error={errors.email} />
      </div>
      <div className="st-form__row">
        <TextField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} />
        <TextField label="Current role and employer" name="current_title" autoComplete="organization-title" error={errors.current_title} />
      </div>
      <SelectField label="Discipline / area of interest" name="discipline" required options={DISCIPLINES} error={errors.discipline} />
      <TextArea label="What are you looking for in your next role?" name="message" rows={3} error={errors.message} />
      <FileField name="cv" label={<>Upload your CV<br />(optional)</>} error={errors.cv} fileName={cvName} onChange={(f) => setCvName(f ? f.name : "")} hint="PDF or Word, up to 10 MB." />
      <button type="button" className="st-form__more" aria-expanded={more} aria-controls="register-more" onClick={() => setMore((m) => !m)}>
        {more ? "Fewer details" : "More about you (optional)"}
      </button>
      <div id="register-more" className="st-form__group" hidden={!more}>
        <div className="st-form__row">
          <TextField label="Location (town or postcode)" name="location" autoComplete="address-level2" />
          <SelectField label="Availability" name="availability" options={AVAILABILITY} />
        </div>
        <div className="st-form__row">
          <SelectField label="Years in the sector" name="years_experience" options={EXPERIENCE} />
          <SelectField label="Right to work" name="right_to_work" options={RIGHT_TO_WORK} />
        </div>
        <CheckboxGroup legend="Employment preference" name="employment_types" options={EMPLOYMENT_TYPES} />
        <div className="st-form__row">
          <TextField label="Salary or rate expectation" name="salary_expectation" inputMode="text" />
          <TextField label="LinkedIn URL" name="linkedin_url" type="url" autoComplete="url" error={errors.linkedin_url} />
        </div>
      </div>
      <Checkbox name="privacy_consent" label="I agree to the privacy policy." required error={errors.privacy_consent}>
        I agree to the <Link href="/privacy" prefetch={false} className="st-link">privacy policy</Link>.
      </Checkbox>
      <SubmitButton busy={busy} className="st-btn--block">{state === "uploading" ? "Uploading CV" : state === "submitting" ? "Sending" : "Register"}</SubmitButton>
      <p id="register-status" className={`st-form__status ${state === "error" ? "st-form__status--error" : ""}`} role="status" aria-live="polite">{message}</p>
    </form>
  );
}
