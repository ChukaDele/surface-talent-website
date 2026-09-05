"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";

const BASE = { bg: "#eff7fe", text: "#1f1f1f", stat: "#293038", rule: "#e1e3e5" };
const ACTIVE = { bg: "#131e27", text: "#ffffff", stat: "#ffffff", rule: "#3a4550" };

/**
 * Testimonial cards: base light state; hover / focus-visible animates into the Figma navy card
 * (background, text, stat and rule colours) with a 2px lift and no drop shadow. Pointer leave
 * / blur reverses through the same tween. Touch: a tap toggles via focus, nothing sticks.
 */
export function useTestimonialHover(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-testimonial]", el);
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motionOk, () => {
        const timelines = cards.map((card) => {
          const tl = gsap.timeline({ paused: true, defaults: { duration: 0.32, ease: "power2.out" } });
          tl.to(card, { backgroundColor: ACTIVE.bg, y: -2 }, 0)
            .to(card.querySelectorAll("[data-t-text]"), { color: ACTIVE.text }, 0)
            .to(card.querySelector("[data-t-stat]"), { color: ACTIVE.stat }, 0)
            .to(card.querySelector("[data-t-rule]"), { borderTopColor: ACTIVE.rule }, 0);
          // touch has no hover: a tap must not leave the card stuck in the navy state
          const on = (e: Event) => { if ((e as PointerEvent).pointerType === "touch") return; tl.play(); };
          const off = () => tl.reverse();
          // keyboard equivalent only: a tap or click also focuses the card, which must not latch the state
          const onFocus = () => { if (card.matches(":focus-visible")) tl.play(); };
          card.addEventListener("pointerenter", on);
          card.addEventListener("pointerleave", off);
          card.addEventListener("focus", onFocus);
          card.addEventListener("blur", off);
          return { tl, on, off, onFocus, card };
        });
        return () => {
          timelines.forEach(({ tl, on, off, onFocus, card }) => {
            card.removeEventListener("pointerenter", on); card.removeEventListener("pointerleave", off);
            card.removeEventListener("focus", onFocus); card.removeEventListener("blur", off);
            tl.kill();
            gsap.set([card, ...card.querySelectorAll("[data-t-text],[data-t-stat],[data-t-rule]")], { clearProps: "backgroundColor,color,borderTopColor,transform" });
          });
        };
      });
      mm.add(MOTION_QUERIES.reduced, () => {
        // Reduced motion: instant state swap via class, no tween
        const on = (e: Event) => { if ((e as PointerEvent).pointerType === "touch") return; (e.currentTarget as HTMLElement).classList.add("is-active"); };
        const onFocus = (e: Event) => { const c = e.currentTarget as HTMLElement; if (c.matches(":focus-visible")) c.classList.add("is-active"); };
        const off = (e: Event) => (e.currentTarget as HTMLElement).classList.remove("is-active");
        cards.forEach((c) => { c.addEventListener("pointerenter", on); c.addEventListener("pointerleave", off); c.addEventListener("focus", onFocus); c.addEventListener("blur", off); });
        return () => cards.forEach((c) => { c.removeEventListener("pointerenter", on); c.removeEventListener("pointerleave", off); c.removeEventListener("focus", onFocus); c.removeEventListener("blur", off); });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  void BASE;
}
