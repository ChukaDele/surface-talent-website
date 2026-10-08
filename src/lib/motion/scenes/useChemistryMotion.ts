"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { MOTION_QUERIES } from "@/lib/motion/motionModes";

/**
 * Bath chemistry card — the six hex readings move like molecules in a bath: each is tethered to
 * its home by a soft spring, wanders under gentle Brownian noise, and is pushed away by a smooth
 * short-range repulsion before it can visually overlap a neighbour (collision radius = hex size +
 * margin). Velocity damping keeps everything slow and settled; a boundary spring keeps the cluster
 * inside the card. Pointer proximity adds a small local push, a click a mild radial nudge.
 * The integrator only runs while the card is on screen.
 */
type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };
const RADIUS = 78; // px — two hexes closer than this are pushed apart
const HOME_K = 6; // spring toward the resting position
const REPEL_K = 900; // strength of the soft repulsion
const DAMP = 4.5; // s⁻¹ exponential velocity damping
const NOISE = 38; // Brownian acceleration amplitude
const WANDER = 9; // max px away from home before the boundary spring firms up

export function useChemistryMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.motionOk, () => {
        const stage = el.querySelector<HTMLElement>("[data-chemistry]");
        if (!stage) return;
        const mols = gsap.utils.toArray<HTMLElement>("[data-mol]", stage);
        const ps: P[] = mols.map((m) => ({ hx: m.offsetLeft + m.offsetWidth / 2, hy: m.offsetTop + m.offsetHeight / 2, x: 0, y: 0, vx: 0, vy: 0 }));
        const pointer = { x: NaN, y: NaN, active: false };
        const setters = mols.map((m) => ({ x: gsap.quickSetter(m, "x", "px"), y: gsap.quickSetter(m, "y", "px") }));
        const tick = (_t: number, dtMs: number) => {
          const dt = Math.min(dtMs / 1000, 0.033);
          for (let i = 0; i < ps.length; i++) {
            const a = ps[i];
            // spring home (firmer beyond WANDER) + Brownian drift
            const d = Math.hypot(a.x, a.y);
            const k = HOME_K * (d > WANDER ? 1 + (d - WANDER) * 0.35 : 1);
            let ax = -k * a.x + (Math.random() - 0.5) * NOISE;
            let ay = -k * a.y + (Math.random() - 0.5) * NOISE;
            // soft repulsion from neighbours before visual overlap
            for (let j = 0; j < ps.length; j++) {
              if (j === i) continue;
              const b = ps[j];
              const dx = a.hx + a.x - (b.hx + b.x), dy = a.hy + a.y - (b.hy + b.y);
              const dist = Math.hypot(dx, dy) || 0.001;
              if (dist < RADIUS) { const f = (REPEL_K * (RADIUS - dist)) / RADIUS / dist; ax += dx * f; ay += dy * f; }
            }
            // small local push away from a nearby pointer
            if (pointer.active) {
              const dx = a.hx + a.x - pointer.x, dy = a.hy + a.y - pointer.y; const dist = Math.hypot(dx, dy) || 0.001;
              if (dist < 110) { const f = (260 * (110 - dist)) / 110 / dist; ax += dx * f; ay += dy * f; }
            }
            const damp = Math.exp(-DAMP * dt);
            a.vx = (a.vx + ax * dt) * damp; a.vy = (a.vy + ay * dt) * damp;
            a.x += a.vx * dt; a.y += a.vy * dt;
            setters[i].x(a.x); setters[i].y(a.y);
          }
        };
        const st = ScrollTrigger.create({ trigger: stage, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)) });
        const card = stage.closest<HTMLElement>(".st-floor__card") ?? stage;
        const onMove = (e: PointerEvent) => { const r = stage.getBoundingClientRect(); pointer.x = (e.clientX - r.left) / (r.width / stage.offsetWidth); pointer.y = (e.clientY - r.top) / (r.height / stage.offsetHeight); pointer.active = true; };
        const onLeave = () => { pointer.active = false; };
        const onDown = () => { ps.forEach((p) => { const dx = p.hx - stage.offsetWidth / 2, dy = p.hy - stage.offsetHeight / 2; const d = Math.hypot(dx, dy) || 1; p.vx += (dx / d) * 26; p.vy += (dy / d) * 26; }); };
        card.addEventListener("pointermove", onMove); card.addEventListener("pointerleave", onLeave); card.addEventListener("pointerdown", onDown);
        return () => {
          st.kill(); gsap.ticker.remove(tick);
          card.removeEventListener("pointermove", onMove); card.removeEventListener("pointerleave", onLeave); card.removeEventListener("pointerdown", onDown);
          gsap.set(mols, { clearProps: "transform" });
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
