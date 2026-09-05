"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";
import { pinAcquired, pinReleased } from "@/lib/motion/pinRegistry";

/**
 * Why Specialists — ONE pinned stage (heading + card stack), one scrubbed timeline:
 *   entries: cards 02, 03, 04 travel up from below the viewport into their slots (100px apart,
 *            so previous eyebrow + title stay visible); the card beneath settles to 0.985.
 *   morph:   card 04's background (#111f2b) expands from the card's own rectangle to cover the
 *            viewport while stack + heading fade; the next scene shares that colour, so the pin
 *            release is invisible. Pin length = 3 entries × 0.6vh + morph 0.6vh — each entry is
 *            real travel (a card crossing the viewport), nothing idles.
 */
export function useWhySpecialistMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktopEnhanced, () => {
        const pin = el.querySelector<HTMLElement>(".st-why__pin")!;
        const head = el.querySelector<HTMLElement>("[data-why-head]")!;
        const box = el.querySelector<HTMLElement>("[data-why-stagebox]")!;
        const stage = el.querySelector<HTMLElement>("[data-why-stage]")!;
        const slots = gsap.utils.toArray<HTMLElement>("[data-why-slot]", el);
        const morph = el.querySelector<HTMLElement>("[data-why-morph]")!;
        const stageW = 960, stageH = stage.offsetHeight;

        // fit the authored stage into the room under the heading (never wider than 960)
        const fit = () => {
          const room = pin.clientHeight - head.offsetHeight - 40 - 100; // gap + paddings
          const s = Math.min(1, room / stageH, (pin.clientWidth - 112) / stageW);
          // size the layout box (not just the transform) so the pinned stage never exceeds 100svh
          box.style.width = `${stageW * s}px`;
          box.style.height = `${stageH * s}px`;
          stage.style.transform = `scale(${s})`;
          return s;
        };
        fit();

        // travel budget (timeline units of 1 = one card entry = 0.5vh of scroll):
        // 3 entries + 0.5 dwell on the landed 04 Match card + 1.0 morph; the morph completes exactly
        // at pin release so the next (same-colour) section's heading enters immediately afterwards.
        const entryDist = () => window.innerHeight * 0.5;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin, start: "top top", end: () => "+=" + entryDist() * 4.5,
            pin: true, scrub: 0.4, anticipatePin: 1, invalidateOnRefresh: true,
            onRefreshInit: fit,
            onToggle: (self) => (self.isActive ? pinAcquired("why") : pinReleased("why")),
          },
        });
        // start state: cards 2..4 below the viewport
        slots.slice(1).forEach((s) => gsap.set(s, { y: () => window.innerHeight * 1.2 }));
        slots.slice(1).forEach((s, i) => {
          tl.to(s, { y: 0, duration: 1, ease: "power1.out" }, i)
            .to(slots[i], { scale: 0.985, transformOrigin: "50% 0%", duration: 0.6 }, i + 0.3);
        });
        // morph: card 04's rectangle → viewport. The start rect is a timeline-owned .set (function-based,
        // re-evaluated on refresh) computed from layout, not from a live getBoundingClientRect on the
        // moving slot — so scrubbing back past 3.5 restores the hidden state and the stack rebuilds
        // 04 → 03 → 02 → 01 with no stray dark surface.
        const scaleNow = () => box.offsetWidth / stageW;
        const rect = () => { const b = box.getBoundingClientRect(), pr = pin.getBoundingClientRect(); const sc = scaleNow(); return { x: b.left - pr.left, y: b.top - pr.top + 3 * 100 * sc, w: 960 * sc, h: 480 * sc }; };
        tl.set(morph, { autoAlpha: 1, x: () => rect().x, y: () => rect().y, width: () => rect().w, height: () => rect().h, backgroundColor: "#111f2b" }, 3.5)
          .to(morph, { x: 0, y: 0, width: () => pin.clientWidth, height: () => pin.clientHeight, backgroundColor: "#131e27", duration: 1.0, ease: "power2.inOut" }, 3.5)
          .to([head, box], { autoAlpha: 0, duration: 0.5 }, 3.65);

        return () => {
          tl.scrollTrigger?.kill(); pinReleased("why"); tl.kill();
          gsap.set([slots, morph, head, box], { clearProps: "transform,opacity,visibility,width,height,backgroundColor" });
          box.style.width = ""; stage.style.transform = "";
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
