/**
 * Capability breakpoints for the homepage motion system.
 *
 * Design modes are distinct designs, not one design squeezed until it breaks:
 *  - DESKTOP_ENHANCED: full pinned / scrubbed narratives.
 *  - SHORT_DESKTOP:    wide but not tall enough to show a full active card, so
 *                      pinned scenes fall back to natural flow with reveals.
 *  - TABLET / MOBILE:  natural flow, simplified stacks, no horizontal pinning.
 *  - REDUCED_MOTION:   static or minimal, complete content still readable.
 *
 * Used as gsap.matchMedia() conditions so setup and teardown are owned by GSAP.
 */
export const MOTION_QUERIES = {
  reduced: "(prefers-reduced-motion: reduce)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  desktopEnhanced:
    "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
  shortDesktop:
    "(min-width: 1024px) and (max-height: 699px) and (prefers-reduced-motion: no-preference)",
  tablet:
    "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOTION_QUERIES.reduced).matches;
}

export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOTION_QUERIES.finePointer).matches;
}
