"use client";

import { useGSAP } from "@/lib/motion/gsap";
import { gsap } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";

/**
 * Site-wide restrained card hover: a 2px lift on fine pointers, reversed on leave.
 * Pass a selector for the cards inside `scope`. No scale, tilt or drop shadow.
 */
export function useCardHover(scope: React.RefObject<HTMLElement | null>, selector: string) {
  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_QUERIES.motionOk} and ${MOTION_QUERIES.finePointer}`, () => {
        const cards = gsap.utils.toArray<HTMLElement>(selector, el);
        const handlers = cards.map((card) => {
          const on = () => gsap.to(card, { y: -2, duration: 0.22, ease: "power2.out", overwrite: "auto" });
          const off = () => gsap.to(card, { y: 0, duration: 0.24, ease: "power2.out", overwrite: "auto" });
          card.addEventListener("pointerenter", on); card.addEventListener("pointerleave", off);
          return { card, on, off };
        });
        return () => handlers.forEach(({ card, on, off }) => { card.removeEventListener("pointerenter", on); card.removeEventListener("pointerleave", off); gsap.set(card, { clearProps: "transform" }); });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
