/** Hero scene identity — a plain module so server components can read it too. */
export type HeroVariant = "a" | "b" | "d" | "e" | "f" | "g" | "h" | "h-static" | "a2-svg" | "a2-three";

/**
 * Hero H is the approved homepage direction: one dominant portrait loop with no teaser tiles.
 * The former shutter loop remains an explicit internal comparison variant.
 */
export const DEFAULT_HERO_VARIANT: HeroVariant = "h-static";

/** The production direction: a portrait-led field with a simple timed crossfade. */
export const RECOMMENDED_HERO_VARIANT: HeroVariant = "h-static";

export const HERO_VARIANTS: { id: HeroVariant; name: string; note: string }[] = [
  { id: "a2-svg", name: "A2 · SVG / GSAP", note: "Approved engineered layers, explained with one precise separation axis. GSAP owns the complete → inspect → complete loop and the restrained recruitment callouts." },
  { id: "a2-three", name: "A2 · minimal Three.js", note: "The identical sequence and timing in a fixed orthographic view. Real depth is the only variable: no pointer response, orbit, drift or theatrical lighting." },
  { id: "h", name: "H · portrait shutters", note: "One dominant person and three queued editorial portraits, rotating in one calm GSAP-owned loop." },
];
