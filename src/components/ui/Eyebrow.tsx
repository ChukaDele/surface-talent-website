import type { ReactNode } from "react";

/** Figma eyebrow: Geist Mono 12/16, tracking 2px, uppercase, copper — optional 14px diamond. */
export function Eyebrow({ children, diamond = false, tone = "copper", className = "" }: { children: ReactNode; diamond?: boolean; tone?: "copper" | "light" | "muted"; className?: string }) {
  return (
    <span className={`st-eyebrow ${tone === "light" ? "st-eyebrow--light" : tone === "muted" ? "st-eyebrow--muted" : ""} ${className}`}>
      {diamond ? <img className="st-eyebrow__diamond" src="/assets/svg/eyebrow-diamond.svg" alt="" width={14} height={14} /> : null}
      {children}
    </span>
  );
}
