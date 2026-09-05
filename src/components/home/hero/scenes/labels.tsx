"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { heroState } from "@/lib/motion/heroState";

/**
 * A layer label in the Figma language (Geist Mono 12, 2px tracking, rotated -29.05°). It rides with
 * its plate, fades out as the scroll handoff begins, and brightens when its layer is the active one.
 */
export function LayerLabel({ text, y, index, activeOnly = false }: { text: string; y: number; index: number; activeOnly?: boolean }) {
  const span = useRef<HTMLSpanElement>(null);
  useFrame(() => {
    const el = span.current;
    if (!el) return;
    const exit = Math.max(0, 1 - heroState.progress * 5);
    const active = heroState.activeLayer === index;
    // in build sequences only the layer being worked on is labelled, so labels never collide
    el.style.opacity = String(exit * (activeOnly ? (active ? 1 : 0) : active ? 1 : 0.62));
    el.style.letterSpacing = active ? "2.6px" : "2px";
  });
  return (
    <Html position={[88, y, 0]} center zIndexRange={[6, 0]} style={{ pointerEvents: "none" }}>
      <span
        ref={span}
        data-hero-label
        style={{ display: "block", transform: "rotate(-29.05deg)", transformOrigin: "50% 50%", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: "16px", letterSpacing: 2, color: "#fff", whiteSpace: "nowrap", textTransform: "uppercase", transition: "letter-spacing 240ms ease" }}
      >
        {text}
      </span>
    </Html>
  );
}
