"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";
import { pinAcquired, pinReleased } from "@/lib/motion/pinRegistry";

/**
 * About → "A sister company of the EMC Surface Technologies group." The five Figma Containers
 * (2048:1475/1483/1488/1493/1516) are keyframes of one scroll sequence: the logo alone → heading
 * arriving as the logo shrinks and fades → heading alone → paragraph arriving as the heading
 * recedes → paragraph alone. One pinned stage, one scrubbed timeline, each beat glides up ~120px
 * with a long ease so the copy is readable while it moves; travel = 2 handoffs × 0.7vh + dwell.
 * Reversible; natural flow below desktop / reduced motion (all three beats stacked).
 */
export function useAboutEmcMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktopEnhanced, () => {
        const pin = el.querySelector<HTMLElement>(".st-emc__pin")!;
        const [b1, b2, b3] = gsap.utils.toArray<HTMLElement>("[data-emc-beat]", el);
        const step = () => Math.round(window.innerHeight * 0.7);
        gsap.set([b2, b3], { autoAlpha: 0, y: 120 });
        gsap.set(b1, { autoAlpha: 1, y: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: pin, start: "top top", end: () => "+=" + (step() * 2 + Math.round(window.innerHeight * 0.35)), pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
            onToggle: (self) => (self.isActive ? pinAcquired("about-emc") : pinReleased("about-emc")),
          },
        });
        // beat 1 → 2 (keyframe 2: logo small & faint at top, heading arriving)
        tl.to(b1, { y: -140, scale: 0.5, autoAlpha: 0.2, transformOrigin: "50% 0%", duration: 1 }, 0)
          .to(b1, { autoAlpha: 0, duration: 0.3 }, 0.9)
          .to(b2, { y: 0, autoAlpha: 1, duration: 1 }, 0.15)
          // dwell on the heading (keyframe 3), then 2 → 3 (keyframe 4: heading small at top, paragraph arriving)
          .to(b2, { y: -160, scale: 0.5, autoAlpha: 0.2, transformOrigin: "50% 0%", duration: 1 }, 1.5)
          .to(b2, { autoAlpha: 0, duration: 0.3 }, 2.4)
          .to(b3, { y: 0, autoAlpha: 1, duration: 1 }, 1.65)
          .to({}, { duration: 0.35 }); // dwell on the paragraph (keyframe 5) before release
        return () => { tl.scrollTrigger?.kill(); pinReleased("about-emc"); tl.kill(); gsap.set([b1, b2, b3], { clearProps: "transform,opacity,visibility" }); };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
