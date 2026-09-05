"use client";

import type { ReactNode } from "react";
import { BookingModal } from "@/components/ui/BookingModal";
import { ArrowRight } from "@/components/ui/icons";
import { usePressable } from "@/lib/motion/usePressable";

/** Booking CTA in the site's button language (same hover/press behaviour); opens the on-site dialog. */
export function BookCallButton({ children, variant = "secondary", tone = "copper", arrow = variant === "primary", className = "" }: {
  children: ReactNode; variant?: "primary" | "secondary"; tone?: "copper" | "light"; arrow?: boolean; className?: string;
}) {
  const { attach, handlers } = usePressable<HTMLAnchorElement>();
  return (
    <BookingModal className={`st-btn st-btn--${variant} st-btn--${tone} ${className}`} triggerRef={attach} triggerHandlers={handlers}>
      <span className="st-btn__label">{children}</span>
      {arrow ? <span className="st-btn__icon" aria-hidden="true"><ArrowRight /></span> : null}
    </BookingModal>
  );
}
