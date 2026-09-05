"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";
import { pinAcquired, pinReleased } from "@/lib/motion/pinRegistry";

/**
 * "What we know from the plant floor" — Figma section 115:99231 plus loose Frame 45 (53:1767),
 * which is the same four-card row seen further along. Vertical scroll pins the stage and drives
 * the row left → right; the travel distance is measured from the row (row width − viewport width),
 * never hard-coded, and the pin length equals that travel exactly — the pin releases the moment
 * the last card is in view. Narrow screens: native horizontal scroll with snap (see CSS).
 */
export function usePlantFloorMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktopEnhanced, () => {
        const pin = el.querySelector<HTMLElement>(".st-floor__pin")!;
        const viewport = el.querySelector<HTMLElement>("[data-floor-viewport]")!;
        const row = el.querySelector<HTMLElement>("[data-floor-row]")!;
        const distance = () => Math.max(0, row.scrollWidth - viewport.clientWidth);
        const tween = gsap.to(row, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => (self.isActive ? pinAcquired("floor") : pinReleased("floor")),
          },
        });
        return () => { tween.scrollTrigger?.kill(); pinReleased("floor"); tween.kill(); gsap.set(row, { clearProps: "transform,opacity,visibility,height" }); };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
