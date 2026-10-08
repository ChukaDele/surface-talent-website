"use client";

import { useEffect, type RefObject } from "react";

/**
 * Direction-aware header: visible at the top; hides after a meaningful accumulated downward
 * scroll (dead zone so touchpad jitter never flickers it); returns promptly on upward scroll;
 * never hides while the mobile menu is open or focus is inside the header. Adds `is-scrolled`
 * once the page has moved so the fixed bar gains a legible surface over content.
 */
export function useHeaderAutoHide(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const HIDE_AFTER = 56, SHOW_AFTER = 18, TOP_ZONE = 96;
    // publish the live nav height so anchor targets (scroll-margin-top) always clear the sticky bar
    const publishHeight = () => document.documentElement.style.setProperty("--nav-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    publishHeight();
    const heightRo = new ResizeObserver(publishHeight); heightRo.observe(el);
    let last = window.scrollY, acc = 0, hidden = false, raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - last; last = y;
      const locked = el.contains(document.activeElement) || !!el.querySelector('[aria-expanded="true"]');
      el.classList.toggle("is-scrolled", y > 24);
      if (y < TOP_ZONE || locked) { if (hidden) { hidden = false; el.classList.remove("is-hidden"); } acc = 0; return; }
      acc = Math.sign(delta) === Math.sign(acc) ? acc + delta : delta;
      if (!hidden && acc > HIDE_AFTER) { hidden = true; el.classList.add("is-hidden"); acc = 0; }
      else if (hidden && acc < -SHOW_AFTER) { hidden = false; el.classList.remove("is-hidden"); acc = 0; }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const onFocusIn = () => { if (hidden) { hidden = false; el.classList.remove("is-hidden"); acc = 0; } };
    window.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("focusin", onFocusIn);
    apply();
    return () => { window.removeEventListener("scroll", onScroll); el.removeEventListener("focusin", onFocusIn); heightRo.disconnect(); if (raf) cancelAnimationFrame(raf); el.classList.remove("is-hidden", "is-scrolled"); };
  }, [ref]);
}
