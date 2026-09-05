"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";
import { pinAcquired, pinReleased } from "@/lib/motion/pinRegistry";

/**
 * Pinned three-state camera scene on a 100svh stage. Runway = 1.4 viewport heights (two state
 * transitions of ~0.6vh each plus short holds — no idle scroll):
 *  0.00–0.30  state 1: role brief (surface) — copy 01
 *  0.30–0.42  clean travel: brief scales out and fully dissolves before the system enters
 *  0.42–0.66  state 2: the zoomed cross-section holds under copy 02
 *  0.66–0.90  camera pulls back: scale 2 → 1 about the Figma zoom origin — copy 03
 *  0.90–1.00  annotations settle in
 * Scroll-scrubbed, so reversing is exact. Reduced motion / narrow: static panels.
 */
export function useSystemSceneMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERIES.desktopEnhanced, () => {
        const pin = el.querySelector<HTMLElement>(".st-system__pin")!;
        const copies = gsap.utils.toArray<HTMLElement>("[data-copy-state]", el);
        const stateOne = el.querySelector<HTMLElement>("[data-state-one]")!;
        const roleCard = el.querySelector<HTMLElement>("[data-role-card]")!;
        const diagramWrap = el.querySelector<HTMLElement>("[data-diagram-wrap]")!;
        const diagram = el.querySelector<HTMLElement>("[data-diagram]")!;
        const annotations = gsap.utils.toArray<HTMLElement>("[data-annotation]", el);

        gsap.set(copies, { autoAlpha: 0, y: 24 });
        gsap.set(copies[0], { autoAlpha: 1, y: 0 });
        gsap.set(diagramWrap, { autoAlpha: 0 });
        gsap.set(diagram, { scale: 2 });
        gsap.set(annotations, { autoAlpha: 0, x: -12 });
        gsap.set(roleCard, { transformOrigin: "50% 50%" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + window.innerHeight * 1.4,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => (self.isActive ? pinAcquired("system") : pinReleased("system")),
          },
        });

        // copy 01 → clean surface transition → copy 02 / cross-section hold
        // The card and its backing surfaces are fully gone before the diagram enters. This keeps
        // the photograph/brief from competing with the readable technical labels below.
        tl.to(copies[0], { autoAlpha: 0, y: -24, duration: 0.08 }, 0.24)
          .to(roleCard, { scale: 2.6, autoAlpha: 0, duration: 0.16, ease: "power2.in" }, 0.25)
          .to(stateOne, { autoAlpha: 0, duration: 0.1 }, 0.3)
          .to(copies[1], { autoAlpha: 1, y: 0, duration: 0.1 }, 0.4)
          .to(diagramWrap, { autoAlpha: 1, duration: 0.1 }, 0.42)
          // copy 02 → copy 03 and the camera pulls back to the settled system
          .to(copies[1], { autoAlpha: 0, y: -24, duration: 0.08 }, 0.66)
          .to(copies[2], { autoAlpha: 1, y: 0, duration: 0.1 }, 0.72)
          .to(diagram, { scale: 1, duration: 0.24, ease: "power1.inOut" }, 0.68)
          .to(annotations, { autoAlpha: 1, x: 0, duration: 0.1, stagger: 0.012 }, 0.9);

        return () => {
          tl.scrollTrigger?.kill(); pinReleased("system");
          tl.kill();
          gsap.set([copies, stateOne, roleCard, diagramWrap, diagram, annotations], { clearProps: "transform,opacity,visibility,height" });
        };
      });

      mm.add(`(max-width: 1023px), ${MOTION_QUERIES.reduced}`, () => {
        // Static: show the settled system and copy 03 alongside the brief card above (see CSS).
        const el2 = root.current!;
        gsap.set(el2.querySelector("[data-diagram-wrap]"), { autoAlpha: 1 });
        gsap.set(el2.querySelector("[data-diagram]"), { scale: 1 });
        gsap.set(el2.querySelector("[data-state-one]"), { autoAlpha: 0 });
        gsap.set(el2.querySelectorAll("[data-annotation]"), { autoAlpha: 1 });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  void ScrollTrigger;
}
