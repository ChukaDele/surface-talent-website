"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { heroState } from "@/lib/motion/heroState";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";

/**
 * Hero → system handoff (centre-weighted). The hero is a 100svh stage pinned WITHOUT pin
 * spacing for exactly one viewport of scroll, so the system stage slides up over it while the
 * hero transforms underneath: copy lifts and fades, the 3D surface dollies toward the camera,
 * its layers part and dissolve (heroState.progress 0 → 1), the logo strip fades. Both stages
 * share the same dark surface, so the visual handoff happens through the middle of the viewport
 * with no hard top-edge boundary and no idle space beneath.
 *
 * The WebGL frame loop stops when the hero leaves the viewport (heroState.active).
 */
export function useHeroMotion() {
  useGSAP(() => {
    const hero = document.querySelector<HTMLElement>("[data-scene='hero']");
    if (!hero) return;
    // The production h-static hero is deliberately inert. Its full-bleed image and copy stay
    // readable while the next section owns its own single pinned system handoff.
    if (hero.dataset.heroStatic === "true") return;
    const mm = gsap.matchMedia();

    const visibility = ScrollTrigger.create({ trigger: hero, start: "top bottom", end: "bottom top", onToggle: (st) => { heroState.active = st.isActive; } });

    mm.add(MOTION_QUERIES.desktopEnhanced, () => {
      const progress = { p: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero, start: "top top", end: () => "+=" + window.innerHeight, pin: true, pinSpacing: false, scrub: true, invalidateOnRefresh: true,
          onUpdate: (self) => { heroState.progress = self.progress; },
          onLeave: () => { heroState.progress = 1; }, onEnterBack: (self) => { heroState.progress = self.progress; },
        },
      });
      tl.to("[data-hero-title]", { y: -70, autoAlpha: 0, duration: 0.5 }, 0)
        .to("[data-hero-ctas]", { y: -50, autoAlpha: 0, duration: 0.45 }, 0.05)
        .to("[data-hero-logos]", { autoAlpha: 0, duration: 0.35 }, 0.05)
        .to("[data-hero-specimen]", { y: -60, scale: 1.18, transformOrigin: "50% 50%", duration: 1, ease: "power1.in" }, 0);
      const heroMedia = hero.querySelector<HTMLElement>("[data-hero-media]");
      const heroSection = hero.querySelector<HTMLElement>("[data-hero-section]");
      if (heroMedia && heroSection) {
        tl.to(heroMedia, { autoAlpha: 0, duration: 0.3 }, 0.16)
          .to(heroSection, { autoAlpha: 1, y: 0, duration: 0.34 }, 0.44)
          .to("[data-hero-specimen]", { autoAlpha: 0, duration: 0.18 }, 0.82);
      } else {
        tl.to("[data-hero-specimen]", { autoAlpha: 0, duration: 0.35 }, 0.65);
      }
      tl.to(progress, { p: 1, duration: 1 }, 0);
      return () => {
        tl.scrollTrigger?.kill(); tl.kill(); heroState.progress = 0;
        gsap.set(["[data-hero-title]", "[data-hero-ctas]", "[data-hero-logos]", "[data-hero-specimen]"], { clearProps: "transform,opacity,visibility" });
        if (heroMedia && heroSection) gsap.set([heroMedia, heroSection], { clearProps: "transform,opacity,visibility" });
      };
    });

    mm.add(`(max-width: 1023px), ${MOTION_QUERIES.reduced}`, () => {
      // Natural flow; the SVG specimen stays static. Nothing to animate.
    });

    return () => { visibility.kill(); mm.revert(); };
  });
}
