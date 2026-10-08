"use client";

import { useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { gsap } from "./gsap";
import { hasFinePointer, prefersReducedMotion } from "./motionModes";

/**
 * Tactile press feedback for buttons (Emil / apple-design):
 *  - respond on pointer-down, not on release;
 *  - very slight compression (scale 0.97) with a quick ease-out;
 *  - a short, non-bouncy return on release, reading from the live value so an
 *    interrupted press never jumps;
 *  - the arrow icon travels up-right on hover on fine pointers only.
 * GSAP owns the transient state; React owns nothing here.
 */
export function usePressable<T extends HTMLElement>() {
  const elRef = useRef<T | null>(null);

  useEffect(() => () => { if (elRef.current) gsap.killTweensOf(elRef.current); }, []);

  const attach = useCallback((el: T | null) => { elRef.current = el; }, []);

  const press = useCallback(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.to(el, { scale: 0.985, y: 0, duration: 0.12, ease: "power2.out", overwrite: "auto" });
    const icon = el.querySelector<HTMLElement>(".st-btn__icon");
    if (icon) gsap.to(icon, { x: 1, y: 0, duration: 0.12, ease: "power2.out", overwrite: "auto" });
  }, []);

  const release = useCallback(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) return;
    const hovering = el.matches(":hover") && hasFinePointer();
    gsap.to(el, { scale: 1, y: hovering ? -1.5 : 0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    const icon = el.querySelector<HTMLElement>(".st-btn__icon");
    if (icon) gsap.to(icon, { x: hovering ? 3 : 0, y: hovering ? -2 : 0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
  }, []);

  /** Hover: the whole control lifts 1.5px and the arrow travels forward/up so the pointer state is unmistakable. */
  const hover = useCallback((on: boolean) => {
    const el = elRef.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    gsap.to(el, { y: on ? -1.5 : 0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    const icon = el.querySelector<HTMLElement>(".st-btn__icon");
    if (icon) gsap.to(icon, { x: on ? 3 : 0, y: on ? -1.5 : 0, duration: 0.22, ease: "power2.out", overwrite: "auto" });
  }, []);

  const onKeyDown = useCallback((e: ReactKeyboardEvent) => { if (e.key === "Enter" || e.key === " ") press(); }, [press]);
  const onKeyUp = useCallback((e: ReactKeyboardEvent) => { if (e.key === "Enter" || e.key === " ") release(); }, [release]);
  const onPointerLeave = useCallback(() => { release(); hover(false); }, [release, hover]);
  const onPointerEnter = useCallback(() => hover(true), [hover]);

  return { attach, handlers: { onPointerDown: press, onPointerUp: release, onPointerCancel: release, onPointerLeave, onPointerEnter, onKeyDown, onKeyUp, onBlur: release } };
}
