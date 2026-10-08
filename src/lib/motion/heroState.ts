/**
 * Shared, mutable hero state read by the WebGL frame loop and written by GSAP / pointer handlers.
 * Kept outside React so no render happens per frame.
 */
export const heroState = {
  /** 0 = resting hero, 1 = fully travelled through the surface (driven by ScrollTrigger scrub) */
  progress: 0,
  /** pointer position in −1..1 relative to the hero (lerped inside the frame loop) */
  pointerX: 0,
  pointerY: 0,
  /** whether the hero is on screen — off screen the canvas stops rendering */
  active: true,
  reduced: false,
  /** render tool: when not null the scene renders this exact time instead of the live clock */
  time: null as number | null,
  invalidate: null as (() => void) | null,
  /** index of the layer nearest the pointer (-1 = none); labels and edges respond to it */
  activeLayer: -1,
};
