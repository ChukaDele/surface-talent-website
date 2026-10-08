"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";
import { pinAcquired, pinReleased } from "@/lib/motion/pinRegistry";

/**
 * What's at Stake — begins at the loose Container state (generalist card upright at the stage
 * origin, Surface Talent card 396px below, unrotated) and scrubs to the final frame: the ST
 * card travels up over the generalist card, which recedes to (-32.85, 24.4) rotated 6°.
 * All values are the Figma coordinates of the two states; the pin length (480px) is the card's travel.
 */
export function useStakeMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktopEnhanced, () => {
        const pin = el.querySelector<HTMLElement>(".st-stake__pin")!;
        const gen = el.querySelector<HTMLElement>("[data-stake-generalist]")!;
        const st = el.querySelector<HTMLElement>("[data-stake-st]")!;
        // initial (Container 95:62404): generalist at (0, 0) rot 0; ST 396px below the generalist's top
        gsap.set(gen, { x: 32.85, y: -24.4, rotation: 0 });
        gsap.set(st, { y: 396 + 24.4 - 25 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin, start: "top top", end: () => "+=" + 480, pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
            onToggle: (self) => (self.isActive ? pinAcquired("stake") : pinReleased("stake")),
          },
        });
        tl.to(st, { y: 0, duration: 1, ease: "power1.inOut" }, 0)
          .to(gen, { x: 0, y: 0, rotation: -6, duration: 0.9, ease: "power1.inOut" }, 0.1);
        return () => { tl.scrollTrigger?.kill(); pinReleased("stake"); tl.kill(); gsap.set([gen, st], { clearProps: "transform" }); };
      });
      mm.add(`(max-width: 1023px), ${MOTION_QUERIES.reduced}`, () => {
        // static: final arrangement from CSS
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
