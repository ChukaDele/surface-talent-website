"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";

/**
 * Disciplines — Variation 1 (2051:190) as the hover/focus state: the cream card turns to the dark
 * treatment (#242424 surface, 1px copper line, white title, #e5e7eb body, white line-art) with a
 * 2px lift and a 4px icon rise, reversed on leave/blur. One paused timeline per card, GSAP owns the
 * colours. Touch never needs it (content is always visible); reduced motion swaps state instantly.
 */
const DARK = { bg: "#242424", line: "#b87333", title: "#ffffff", body: "#e5e7eb", icon: "#ffffff", iconFill: "#242424" };
const LIGHT = { bg: "#fbf8f5", line: "#e6ceb8", title: "#000000", body: "#1f1f1f", icon: "#000000", iconFill: "#fbf8f5" };

export function useDisciplineHover(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-disc-card]", el);
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motionOk, () => {
        const items = cards.map((card) => {
          const icon = card.querySelector<HTMLElement>("[data-disc-icon]");
          const tl = gsap.timeline({ paused: true, defaults: { duration: 0.32, ease: "power2.out" } });
          tl.to(card, { backgroundColor: DARK.bg, boxShadow: `inset 0 0 0 1px ${DARK.line}`, y: -2 }, 0)
            .to(card.querySelectorAll("[data-disc-title]"), { color: DARK.title }, 0)
            .to(card.querySelectorAll("[data-disc-body]"), { color: DARK.body }, 0);
          if (icon) {
            tl.to(icon, { color: DARK.icon, y: -4, "--disc-fill": DARK.iconFill, "--disc-fill-hi": "#2e2e2e" } as gsap.TweenVars, 0);
            // the drawing's single moving part (data-anim on a <g>), ≤ 1 s, settles; reversed with the card
            const part = icon.querySelector<SVGGElement>("[data-anim]");
            const kind = part?.dataset.anim;
            if (part && kind === "coat") tl.fromTo(part, { x: -6, opacity: 0.2 }, { x: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 0.05);
            if (part && kind === "travel") tl.fromTo(part, { x: -5 }, { x: 0, duration: 0.8, ease: "power2.out" }, 0.05);
            if (part && kind === "particles") tl.fromTo(part.children, { y: -5, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.06 }, 0.05);
            if (part && kind === "heat") tl.fromTo(part, { y: 3, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.9, ease: "sine.out" }, 0.05);
            if (part && kind === "reveal") {
              const paths = Array.from(part.querySelectorAll<SVGPathElement>("path"));
              paths.forEach((pth) => { const len = pth.getTotalLength ? pth.getTotalLength() : 200; pth.style.strokeDasharray = `${len}`; });
              tl.fromTo(paths, { strokeDashoffset: (i, el) => Number((el as SVGPathElement).style.strokeDasharray) || 200 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }, 0.05);
            }
          }
          // entry runs at speed 1 (the drawing's part settles in ≤ 1 s); leaving reverses at double speed
          const on = (e: Event) => { if ((e as PointerEvent).pointerType === "touch") return; tl.timeScale(1).play(); };
          const off = () => tl.timeScale(2).reverse();
          const onFocus = () => { if (card.matches(":focus-visible")) tl.timeScale(1).play(); };
          card.addEventListener("pointerenter", on); card.addEventListener("pointerleave", off); card.addEventListener("focus", onFocus); card.addEventListener("blur", off);
          return { card, tl, on, off, onFocus, icon };
        });
        return () => items.forEach(({ card, tl, on, off, onFocus, icon }) => {
          card.removeEventListener("pointerenter", on); card.removeEventListener("pointerleave", off); card.removeEventListener("focus", onFocus); card.removeEventListener("blur", off);
          tl.kill();
          gsap.set([card, ...card.querySelectorAll("[data-disc-title],[data-disc-body],[data-anim],[data-anim] *"), icon].filter(Boolean) as Element[], { clearProps: "backgroundColor,boxShadow,transform,color,opacity,strokeDashoffset,--disc-fill,--disc-fill-hi" });
        });
      });
      mm.add(MOTION_QUERIES.reduced, () => {
        const on = (e: Event) => { if ((e as PointerEvent).pointerType === "touch") return; (e.currentTarget as HTMLElement).classList.add("is-active"); };
        const onFocus = (e: Event) => { const c = e.currentTarget as HTMLElement; if (c.matches(":focus-visible")) c.classList.add("is-active"); };
        const off = (e: Event) => (e.currentTarget as HTMLElement).classList.remove("is-active");
        cards.forEach((c) => { c.addEventListener("pointerenter", on); c.addEventListener("pointerleave", off); c.addEventListener("focus", onFocus); c.addEventListener("blur", off); });
        return () => cards.forEach((c) => { c.removeEventListener("pointerenter", on); c.removeEventListener("pointerleave", off); c.removeEventListener("focus", onFocus); c.removeEventListener("blur", off); c.classList.remove("is-active"); });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
export const DISC_LIGHT = LIGHT;
