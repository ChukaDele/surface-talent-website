"use client";

import { useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { hasFinePointer, prefersReducedMotion } from "./motionModes";

/**
 * Tactile press feedback for buttons (Emil / apple-design):
 *  - respond on pointer-down, not on release;
 *  - very slight compression (scale 0.97) with a quick ease-out;
 *  - a short, non-bouncy return on release, reading from the live value so an
 *    interrupted press never jumps;
 *  - the arrow icon travels up-right on hover on fine pointers only.
 * Native Web Animations owns the transient state; React owns nothing here.
 * Microinteractions do not load the unrelated scroll-scene runtime.
 */
export function usePressable<T extends HTMLElement>() {
  const elRef = useRef<T | null>(null);

  const animations = useRef(new Map<HTMLElement, Animation>());
  useEffect(() => { const running = animations.current; return () => { running.forEach((a) => a.cancel()); running.clear(); }; }, []);

  const animate = useCallback((el: HTMLElement, transform: string, duration: number) => {
    const from = getComputedStyle(el).transform;
    animations.current.get(el)?.cancel();
    animations.current.set(el, el.animate([{ transform: from }, { transform }], { duration, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", fill: "forwards" }));
  }, []);

  const attach = useCallback((el: T | null) => { elRef.current = el; }, []);

  const press = useCallback(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) return;
    animate(el, "translateY(0px) scale(0.985)", 120);
    const icon = el.querySelector<HTMLElement>(".st-btn__icon");
    if (icon) animate(icon, "translate(1px, 0px)", 120);
  }, [animate]);

  const release = useCallback(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) return;
    const hovering = el.matches(":hover") && hasFinePointer();
    animate(el, `translateY(${hovering ? -1.5 : 0}px) scale(1)`, 200);
    const icon = el.querySelector<HTMLElement>(".st-btn__icon");
    if (icon) animate(icon, `translate(${hovering ? 3 : 0}px, ${hovering ? -2 : 0}px)`, 200);
  }, [animate]);

  /** Hover: the whole control lifts 1.5px and the arrow travels forward/up so the pointer state is unmistakable. */
  const hover = useCallback((on: boolean) => {
    const el = elRef.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    animate(el, `translateY(${on ? -1.5 : 0}px) scale(1)`, 200);
    const icon = el.querySelector<HTMLElement>(".st-btn__icon");
    if (icon) animate(icon, `translate(${on ? 3 : 0}px, ${on ? -1.5 : 0}px)`, 220);
  }, [animate]);

  const onKeyDown = useCallback((e: ReactKeyboardEvent) => { if (e.key === "Enter" || e.key === " ") press(); }, [press]);
  const onKeyUp = useCallback((e: ReactKeyboardEvent) => { if (e.key === "Enter" || e.key === " ") release(); }, [release]);
  const onPointerLeave = useCallback(() => { release(); hover(false); }, [release, hover]);
  const onPointerEnter = useCallback(() => hover(true), [hover]);

  return { attach, handlers: { onPointerDown: press, onPointerUp: release, onPointerCancel: release, onPointerLeave, onPointerEnter, onKeyDown, onKeyUp, onBlur: release } };
}
