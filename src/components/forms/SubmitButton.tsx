"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { usePressable } from "@/lib/motion/usePressable";

/** Real <button type="submit"> with the site button language (press compression, icon nudge). */
export function SubmitButton({ children, busy, tone = "copper", className = "" }: { children: ReactNode; busy?: boolean; tone?: "copper" | "light"; className?: string }) {
  const { attach, handlers } = usePressable<HTMLButtonElement>();
  return (
    <button ref={attach} {...handlers} type="submit" className={`st-btn st-btn--primary st-btn--${tone} st-btn--submit ${className}`} aria-busy={busy || undefined} disabled={busy}>
      <span className="st-btn__label">{children}</span>
      <span className="st-btn__icon" aria-hidden="true">{busy ? <span className="st-spinner" /> : <ArrowRight />}</span>
    </button>
  );
}
