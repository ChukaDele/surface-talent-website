"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";
import { pinAcquired, pinReleased } from "@/lib/motion/pinRegistry";

/**
 * How It Works — pinned; vertical scroll drives the 2260px track left → right by the measured
 * overflow. One step is primary at a time: it gets the gold treatment (copper diamond, copper
 * rim + a slow travelling glint) and its local microinteraction plays; the others sit blurred
 * and dimmed (per the loose Frame 91 state). Active index derives from progress, so the state
 * is deterministic in both directions.
 */
export function useHowItWorksMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktopEnhanced, () => {
        const pin = el.querySelector<HTMLElement>(".st-how__pin")!;
        const viewport = el.querySelector<HTMLElement>("[data-how-viewport]")!;
        const track = el.querySelector<HTMLElement>("[data-how-track]")!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-how-card]", el);
        const steps = gsap.utils.toArray<HTMLElement>("[data-how-step]", el);
        const diamonds = gsap.utils.toArray<HTMLElement>("[data-how-diamond]", el);
        const glitters = cards.map((c) => c.querySelector<HTMLElement>(".st-how__glitter")!);
        const n = cards.length;
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        let active = -1;
        const locals: (gsap.core.Tween | gsap.core.Timeline | null)[] = cards.map(() => null);
        const localFor = (i: number) => {
          const card = cards[i];
          switch (i) {
            case 0: return gsap.fromTo(card.querySelectorAll("[data-brief-line]"), { scaleX: 0.3, transformOrigin: "0 50%" }, { scaleX: 1, duration: 0.7, stagger: 0.12, ease: "power2.out" });
            case 1: return gsap.fromTo(card.querySelectorAll("[data-tag='on']"), { boxShadow: "inset 0 0 0 0.9px rgba(255,255,255,0.11)", background: "rgba(255,255,255,0.04)" }, { boxShadow: "inset 0 0 0 0.9px rgba(58,195,40,0.7)", background: "rgba(58,195,40,0.1)", duration: 0.5, stagger: 0.18, ease: "power2.out" });
            case 2: return gsap.fromTo(card.querySelectorAll("[data-hire-ring] circle:last-of-type"), { strokeDasharray: "0 73.07" }, { strokeDasharray: (idx, target) => (target as SVGCircleElement).getAttribute("data-final") || (idx === 0 ? "67.2 73.07" : "62.8 73.07"), duration: 0.9, ease: "power2.out", stagger: 0.15 });
            case 4: return gsap.fromTo(card.querySelectorAll("[data-cal-item]"), { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.12, ease: "power2.out" });
            default: return null;
          }
        };
        const setActive = (i: number) => {
          if (i === active) return;
          const prev = active; active = i;
          cards.forEach((c, k) => gsap.to(c, { filter: k === i ? "blur(0px)" : "blur(2px)", opacity: k === i ? 1 : 0.55, duration: 0.45, ease: "power2.out", overwrite: "auto" }));
          steps.forEach((s, k) => gsap.to(s, { filter: k === i ? "blur(0px)" : "blur(2px)", opacity: k === i ? 1 : 0.45, duration: 0.45, ease: "power2.out", overwrite: "auto" }));
          diamonds.forEach((d, k) => d.setAttribute("data-active", String(k === i)));
          glitters.forEach((g, k) => gsap.to(g, { opacity: k === i ? 1 : 0, duration: 0.4, overwrite: "auto" }));
          if (prev >= 0) { locals[prev]?.pause(0); }
          locals[i]?.kill();
          locals[i] = localFor(i);
        };

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin, start: "top top", end: () => "+=" + distance(), pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
            onToggle: (self) => (self.isActive ? pinAcquired("how") : pinReleased("how")),
            onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n + 0.0001))),
          },
        });
        setActive(0);
        return () => {
          tween.scrollTrigger?.kill(); pinReleased("how"); tween.kill();
          locals.forEach((l) => l?.kill());
          gsap.set([track, cards, steps, glitters], { clearProps: "transform,filter,opacity" });
          diamonds.forEach((d) => d.removeAttribute("data-active"));
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
