"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import * as RadixSelect from "@radix-ui/react-select";

/**
 * Form primitives matching the Figma "Input field" component (2027:20946): 42/43px tall, 1px
 * #e4e4e4 (light) or 0.5px #7a7a7a (on dark), radius 4, padding 10/14, Geist 14 placeholder
 * #9a9a9a. Every control has a real <label> (visually the placeholder carries the prompt, the
 * label is kept for assistive tech and agents), a stable name, autocomplete where it applies,
 * and machine-readable validation via aria-invalid + aria-describedby.
 */
type Base = { label: string; name: string; error?: string; hint?: string; required?: boolean; className?: string; visibleLabel?: boolean };

function Wrap({ label, name, error, hint, className = "", visibleLabel = false, children }: Base & { children: ReactNode }) {
  return (
    <div className={`st-field ${error ? "st-field--error" : ""} ${className}`}>
      <label htmlFor={name} className={visibleLabel ? "st-field__label" : "sr-only"}>{label}</label>
      {children}
      {hint && !error ? <p id={`${name}-hint`} className="st-field__hint">{hint}</p> : null}
      {error ? <p id={`${name}-error`} className="st-field__error" role="alert">{error}</p> : null}
    </div>
  );
}

const describe = (name: string, error?: string, hint?: string) => [error ? `${name}-error` : null, hint && !error ? `${name}-hint` : null].filter(Boolean).join(" ") || undefined;

export function TextField({ label, name, error, hint, required, className, visibleLabel, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap label={label} name={name} error={error} hint={hint} required={required} className={className} visibleLabel={visibleLabel}>
      <input id={name} name={name} className="st-input" required={required} aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={describe(name, error, hint)} placeholder={rest.placeholder ?? label} {...rest} />
    </Wrap>
  );
}

export function TextArea({ label, name, error, hint, required, className, visibleLabel, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap label={label} name={name} error={error} hint={hint} required={required} className={className} visibleLabel={visibleLabel}>
      <textarea id={name} name={name} className="st-input st-input--area" required={required} aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={describe(name, error, hint)} placeholder={rest.placeholder ?? label} rows={rest.rows ?? 3} {...rest} />
    </Wrap>
  );
}

/**
 * Themed select on Radix Select: a real combobox button (keyboard: arrows, Enter, Escape, Tab,
 * type-ahead; screen-reader name from the <label for>), a styled listbox that follows the form's
 * light/dark palette, and a hidden native <select name> so the value travels with the form.
 * Highlighted (hover / arrow-key) and selected states are distinct; nothing is pre-highlighted.
 */
export function SelectField({ label, name, error, hint, required, className, visibleLabel, options, placeholder, value, defaultValue, onValueChange, dark }: Base & { options: { value: string; label: string }[]; placeholder?: string; value?: string; defaultValue?: string; onValueChange?: (v: string) => void; dark?: boolean }) {
  return (
    <Wrap label={label} name={name} error={error} hint={hint} required={required} className={className} visibleLabel={visibleLabel}>
      <RadixSelect.Root name={name} required={required} value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
        <RadixSelect.Trigger id={name} className="st-input st-input--select" aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={describe(name, error, hint)}>
          <RadixSelect.Value placeholder={placeholder ?? label} />
          <RadixSelect.Icon className="st-select__chev" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className={`st-select__menu ${dark ? "st-select__menu--dark" : ""}`} position="popper" sideOffset={6} collisionPadding={12}>
            <RadixSelect.Viewport className="st-select__viewport">
              {options.map((o) => (
                <RadixSelect.Item key={o.value} value={o.value} className="st-select__item">
                  <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="st-select__tick" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </Wrap>
  );
}

export function Checkbox({ label, name, error, required, children }: { label: string; name: string; error?: string; required?: boolean; children?: ReactNode }) {
  return (
    <div className={`st-check ${error ? "st-field--error" : ""}`}>
      <input id={name} name={name} type="checkbox" className="st-check__box" required={required} aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : undefined} />
      <label htmlFor={name} className="st-check__label">{children ?? label}</label>
      {error ? <p id={`${name}-error`} className="st-field__error" role="alert">{error}</p> : null}
    </div>
  );
}

export function CheckboxGroup({ legend, name, options }: { legend: string; name: string; options: { value: string; label: string }[] }) {
  return (
    <fieldset className="st-checkgroup">
      <legend className="st-field__label">{legend}</legend>
      <div className="st-checkgroup__row">
        {options.map((o) => (
          <label key={o.value} className="st-chip"><input type="checkbox" name={name} value={o.value} /><span>{o.label}</span></label>
        ))}
      </div>
    </fieldset>
  );
}

/** Figma upload tile: 64×64 icon box + "Upload your CV (optional)". Native file input stays in the tab order. */
export function FileField({ label, name, error, hint, accept = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", onChange, fileName }: { label: ReactNode; name: string; error?: string; hint?: string; accept?: string; onChange?: (f: File | null) => void; fileName?: string }) {
  return (
    <div className={`st-file ${error ? "st-field--error" : ""}`}>
      <label htmlFor={name} className="st-file__tile">
        <span className="st-file__icon" aria-hidden="true"><img src="/assets/svg/cands-icon-upload.svg" alt="" width={64} height={64} /></span>
        <span className="st-file__text">{fileName ? <strong>{fileName}</strong> : label}</span>
        <input id={name} name={name} type="file" className="st-file__input" accept={accept} aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined} onChange={(e) => onChange?.(e.currentTarget.files?.[0] ?? null)} />
      </label>
      {hint && !error ? <p id={`${name}-hint`} className="st-field__hint">{hint}</p> : null}
      {error ? <p id={`${name}-error`} className="st-field__error" role="alert">{error}</p> : null}
    </div>
  );
}

/** Honeypot + timing fields for bot filtering (never shown, excluded from a11y tree). */
export function BotGuards() {
  return (
    <div className="st-hp" aria-hidden="true">
      <label htmlFor="website_url">Website</label>
      <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
