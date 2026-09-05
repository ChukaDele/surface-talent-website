"use client";

import { ScrollTrigger } from "./gsap";

/**
 * The single debounced geometry coordinator for the page.
 *
 * Browser zoom does not reliably fire window `resize`, so `visualViewport`
 * is treated as a first-class signal alongside window resize, orientation
 * change and font loading. On fire it asks ScrollTrigger to re-measure every
 * trigger (all triggers use function-based start/end + invalidateOnRefresh,
 * so this is the only refresh path the scenes need).
 */
let listeners = 0;
let timer: number | undefined;
let teardown: (() => void) | undefined;

function schedule() {
  if (timer !== undefined) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    timer = undefined;
    ScrollTrigger.refresh();
  }, 120);
}

export function attachGeometryCoordinator(): () => void {
  if (typeof window === "undefined") return () => {};
  listeners += 1;
  if (listeners === 1) {
    const vv = window.visualViewport;
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    vv?.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});
    teardown = () => {
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      vv?.removeEventListener("resize", schedule);
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
  }
  return () => {
    listeners -= 1;
    if (listeners === 0) {
      teardown?.();
      teardown = undefined;
    }
  };
}

/** Public refresh hook for scenes whose content geometry changed (images loaded, fonts swapped). */
export function requestGeometryRefresh() {
  if (typeof window === "undefined") return;
  schedule();
}
