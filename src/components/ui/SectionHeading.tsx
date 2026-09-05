import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({ eyebrow, diamond, title, align = "center", tone = "dark", wide = false, children, className = "" }: {
  eyebrow: ReactNode; diamond?: boolean; title: ReactNode; align?: "center" | "left"; tone?: "dark" | "light" | "ink"; wide?: boolean; children?: ReactNode; className?: string;
}) {
  const color = tone === "light" ? "var(--text-inverse)" : tone === "ink" ? "#000000" : "var(--ink-soft)";
  return (
    <div className={`st-heading ${align === "center" ? "st-heading--center" : ""} ${wide ? "st-heading--wide" : ""} ${className}`}>
      <Eyebrow diamond={diamond}>{eyebrow}</Eyebrow>
      <h2 className="st-h2" style={{ color }}>{title}</h2>
      {children}
    </div>
  );
}
