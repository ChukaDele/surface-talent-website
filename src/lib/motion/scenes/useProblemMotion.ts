"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";
import { pinAcquired, pinReleased } from "@/lib/motion/pinRegistry";

/**
 * Problem — one state machine on one scrubbed timeline:
 *   STATE 0 Defect 01 · STATE 1 Defect 02 seats over 01 · STATE 2 Defect 03 seats over 01+02 · release.
 * Incoming cards move by TRANSFORM and z-order only; the card beneath settles to scale .96.
 * No filter, opacity or colour tween touches a card surface (that is what turned them grey).
 * Pin length = two card heights of travel (the geometry of two cards crossing the stage).
 */
export function useProblemMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktopEnhanced, () => {
        const pin = el.querySelector<HTMLElement>(".st-problem__pin")!;
        const stages = gsap.utils.toArray<HTMLElement>("[data-defect]", el).map((c) => c.closest<HTMLElement>(".st-stage")!);
        const cardH = () => stages[0].offsetHeight;
        gsap.set(stages[1], { y: () => window.innerHeight, zIndex: 2 });
        gsap.set(stages[2], { y: () => window.innerHeight, zIndex: 3 });
        gsap.set(stages[0], { zIndex: 1 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin, start: "top top", end: () => "+=" + cardH() * 2, pin: true, scrub: 0.4, anticipatePin: 1, invalidateOnRefresh: true,
            onToggle: (self) => (self.isActive ? pinAcquired("problem") : pinReleased("problem")),
          },
        });
        tl.to(stages[1], { y: 0, duration: 1, ease: "power1.out" }, 0)
          .to(stages[0], { scale: 0.96, transformOrigin: "50% 0%", duration: 0.6 }, 0.3)
          .to(stages[2], { y: 0, duration: 1, ease: "power1.out" }, 1)
          .to(stages[1], { scale: 0.96, transformOrigin: "50% 0%", duration: 0.6 }, 1.3);
        return () => { tl.scrollTrigger?.kill(); pinReleased("problem"); tl.kill(); gsap.set(stages, { clearProps: "transform,zIndex" }); };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
