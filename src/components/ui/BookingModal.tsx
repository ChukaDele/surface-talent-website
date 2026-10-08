"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactNode } from "react";
import { BOOKING_EMBED_URL, BOOKING_URL } from "@/lib/site/nav";

/**
 * On-site booking dialog: Google's supported appointment-schedule website embed (`gv=true`) inside a
 * Surface Talent dialog. Radix Dialog supplies the semantics — accessible name, focus trap, Escape,
 * focus return to the trigger, body scroll lock. The trigger stays a real <a> pointing at the
 * booking page, so the CTA works without JavaScript and a browser agent can follow it; the click is
 * intercepted only when the modal can actually open (primary click, no modifier keys). If the embed
 * fails to load, an "Open booking page" fallback link is shown.
 */
export function BookingModal({ children, className, triggerRef, triggerHandlers }: {
  children: ReactNode; className?: string;
  /** lets the caller attach the shared button press/hover behaviour to the real trigger element */
  triggerRef?: (el: HTMLAnchorElement | null) => void; triggerHandlers?: Record<string, unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loaded" | "failed">("idle");
  const loaded = state === "loaded";
  const failed = state === "failed";

  useEffect(() => {
    if (!open) return;
    // if Google has not painted within 8s treat it as blocked and offer the external page
    const t = window.setTimeout(() => setState((s) => (s === "loaded" ? s : "failed")), 8000);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setState("idle"); }}>
      <Dialog.Trigger asChild>
        <a
          href={BOOKING_URL}
          className={className}
          ref={triggerRef}
          {...triggerHandlers}
          data-booking-trigger
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // let people open it in a new tab
            e.preventDefault();
            setOpen(true);
          }}
        >
          {children}
        </a>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="st-modal__overlay" />
        <Dialog.Content className="st-modal">
          <div className="st-modal__head">
            <div>
              <Dialog.Title className="st-h4 st-modal__title">Book a call</Dialog.Title>
              <Dialog.Description className="st-body-sm st-modal__desc">Pick a slot that suits you. We&rsquo;ll talk through the role or the market. No obligation.</Dialog.Description>
            </div>
            <Dialog.Close className="st-modal__close" aria-label="Close booking dialog">
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </Dialog.Close>
          </div>
          <div className="st-modal__body">
            {!loaded && !failed ? <p className="st-modal__status" role="status">Loading available times&hellip;</p> : null}
            <iframe
              src={BOOKING_EMBED_URL}
              title="Surface Talent appointment booking"
              className="st-modal__frame"
              onLoad={() => setState("loaded")}
              onError={() => setState("failed")}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="st-modal__foot">
            Trouble loading? <a href={BOOKING_URL} target="_blank" rel="noreferrer noopener" className="st-link">Open booking page</a>
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
