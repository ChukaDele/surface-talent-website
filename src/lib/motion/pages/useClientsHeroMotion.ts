"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";
import { pinAcquired, pinReleased } from "@/lib/motion/pinRegistry";
import { PROFILES } from "@/components/pages/clients/clientsData";

/**
 * Clients hero: the Figma HERO frame (2027:20831) is the STARTING composition — eight profile
 * cards spread in a wide bowl around the copy — and the Clients frame (2010:2) is the RESOLVED
 * state, a single row of cards at y 527. Scrolling drives one scrubbed timeline: each card travels
 * its own path (outer cards fall further and arrive last, inner cards rise a little and settle
 * first), with a touch of depth (scale/rotation) that flattens as the row locks. The side fades
 * dissolve as the row forms. The hero is pinned for the travel distance and releases immediately.
 * Fully reversible (scrub). Below desktop / reduced motion: resolved row, no pin.
 */
export function useClientsHeroMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktopEnhanced, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-profile]", el);
        const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]", el);
        const copy = el.querySelector<HTMLElement>("[data-hero-copy]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el, start: "top top", end: () => "+=" + Math.round(window.innerHeight * 0.9), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
            onToggle: (self) => (self.isActive ? pinAcquired("clients-hero") : pinReleased("clients-hero")),
          },
        });
        cards.forEach((card, i) => {
          const p = PROFILES[i];
          const dist = Math.hypot(p.end.x - p.start.x, p.end.y - p.start.y);
          const outer = Math.abs(i - 3.5) / 3.5; // 0 centre … 1 edge
          const depth = 1 + outer * 0.06; // outer cards sit slightly "closer" at the start
          const rot = (i < 4 ? -1 : 1) * outer * 3;
          gsap.set(card, { x: p.start.x, y: p.start.y, scale: depth, rotation: rot, transformOrigin: "50% 50%" });
          // coordinated independence: every card resolves in the same window but with its own start
          // offset and easing, so the row "clicks" together rather than sliding as one block
          const startAt = 0.05 + (1 - outer) * 0.12;
          const dur = 0.72 + Math.min(dist / 700, 0.2);
          tl.to(card, { x: p.end.x, y: p.end.y, scale: 1, rotation: 0, duration: dur, ease: outer > 0.6 ? "power2.inOut" : "power1.inOut" }, startAt);
        });
        tl.to(fades, { autoAlpha: 0, duration: 0.5 }, 0.45);
        if (copy) tl.to(copy, { y: -12, duration: 1 }, 0);
        return () => {
          tl.scrollTrigger?.kill(); pinReleased("clients-hero"); tl.kill();
          gsap.set([cards, fades, copy].flat().filter(Boolean) as Element[], { clearProps: "transform,opacity,visibility" });
        };
      });
      mm.add(`(max-width: 1023px), (min-width: 1024px) and (max-height: 699px), ${MOTION_QUERIES.reduced}`, () => {
        // resolved composition via CSS; nothing to animate
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
