"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";

/** Footer logo strip: constant linear marquee (Figma duplicates the run and masks the edges). Paused off-screen. */
export function useFooterMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      // the closing circle ends 56px below the CTA buttons: measure once per layout, expose as --orb-end
      const cta = el.querySelector<HTMLElement>("[data-footer-cta]");
      const setOrbEnd = () => { if (!cta) return; const end = cta.getBoundingClientRect().bottom - el.getBoundingClientRect().top + 56; el.style.setProperty("--orb-end", `${Math.round(end)}px`); };
      setOrbEnd();
      const ro = new ResizeObserver(setOrbEnd); ro.observe(el);
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motionOk, () => {
        const track = el.querySelector<HTMLElement>("[data-marquee]")!;
        const run = track.firstElementChild as HTMLElement;
        const loop = gsap.to(track, { x: () => -run.offsetWidth, duration: () => run.offsetWidth / 40, ease: "none", repeat: -1, paused: true });
        const st = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? loop.play() : loop.pause()) });
        return () => { st.kill(); loop.kill(); gsap.set(track, { clearProps: "transform" }); };
      });
      return () => { ro.disconnect(); mm.revert(); };
    },
    { scope: root },
  );
}
