"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";
import { createPendulum } from "@/lib/motion/pendulum";

/**
 * Insider DNA
 *  - "20+" counts 0 → 20+ on entry with an eased, playful progression. It re-arms only after
 *    the whole activation zone has been left (onLeave / onLeaveBack), so oscillating around a
 *    single threshold cannot retrigger it.
 *  - The LinkedIn logo hangs from a rope: on entry it drops under gravity to the rope's length,
 *    overshoots, swings and damps. It is decorative only and has no pointer or keyboard action.
 */
export function useInsiderDnaMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERIES.motionOk, () => {
        const countEl = el.querySelector<HTMLElement>("[data-count]")!;
        const yearsZone = el.querySelector<HTMLElement>("[data-years]")!;
        const swing = el.querySelector<HTMLElement>("[data-linkedin]")!;
        const logo = el.querySelector<HTMLElement>("[data-linkedin-logo]")!;
        const rope = el.querySelector<HTMLElement>("[data-linkedin-rope]")!;
        // ---- counter
        const counter = { v: 0 };
        let armed = true;
        const render = () => { countEl.textContent = counter.v >= 20 ? "20+" : String(Math.round(counter.v)); };
        const play = () => {
          gsap.killTweensOf(counter);
          counter.v = 0; render();
          gsap.to(counter, { v: 20, duration: 1.4, ease: "power3.out", onUpdate: render, onComplete: render });
        };
        const countTrigger = ScrollTrigger.create({
          trigger: yearsZone, start: "top 80%", end: "bottom 20%",
          onEnter: () => { if (armed) { play(); armed = false; } },
          onEnterBack: () => { if (armed) { play(); armed = false; } },
          onLeave: () => { armed = true; },
          onLeaveBack: () => { armed = true; },
        });

        const pend = createPendulum({ swing, rope, logo, restAngle: 0, ropeLength: 44 });
        let pendArmed = true;
        const pendTrigger = ScrollTrigger.create({
          trigger: el.querySelector(".st-dna__headwrap")!, start: "top 75%", end: "bottom 15%",
          onEnter: () => { if (pendArmed) { pend.drop(); pendArmed = false; } },
          onEnterBack: () => { if (pendArmed) { pend.drop(); pendArmed = false; } },
          onLeave: () => { pendArmed = true; pend.sleep(); },
          onLeaveBack: () => { pendArmed = true; pend.sleep(); },
        });

        return () => {
          countTrigger.kill(); pendTrigger.kill(); pend.destroy();
          gsap.killTweensOf(counter); countEl.textContent = "20+";
          gsap.set([countEl, swing, rope, logo], { clearProps: "transform,opacity,visibility,height" });
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );
}
