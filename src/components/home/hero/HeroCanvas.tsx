"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { heroState } from "@/lib/motion/heroState";

/**
 * Shared hero canvas. Transparent (alpha, clear alpha 0) so the scene sits directly on the hero
 * surface with no canvas rectangle; DPR clamped to 1.75; the render loop is switched off entirely
 * while the hero is off screen or when the tab is hidden. Pointer position feeds heroState for the
 * scenes' parallax. Everything three.js is loaded lazily by the caller.
 */
export function HeroCanvas({ children, onReady, exact = false }: { children: ReactNode; onReady?: () => void; exact?: boolean }) {
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { setVisible(e.isIntersecting); heroState.active = e.isIntersecting; }, { threshold: 0.01 });
    io.observe(el);
    const onVis = () => setVisible(document.visibilityState === "visible" && heroState.active);
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  useEffect(() => {
    const host = wrap.current?.closest<HTMLElement>("[data-scene='hero'], [data-hero-frame]");
    if (!host) return;
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      heroState.pointerX = ((e.clientX - r.left) / r.width) * 2 - 1;
      heroState.pointerY = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => { heroState.pointerX = 0; heroState.pointerY = 0; };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => { host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); };
  }, []);

  return (
    <div ref={wrap} className="st-hero__canvas" data-hero-canvas>
      <Canvas
        orthographic
        camera={{ zoom: 1, near: 1, far: 6000, position: [1000, 900, 1000] }}
        dpr={exact ? [2, 2] : [1, 1.75]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power", stencil: false, depth: true }}
        style={{ position: "absolute", inset: 0, background: "transparent" }}
        onCreated={({ gl }) => { gl.setClearAlpha(0); onReady?.(); }}
      >
        {children}
      </Canvas>
    </div>
  );
}
