"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * A pixel-exact composition authored at Figma size (w × h) that scales uniformly
 * to fill the width of its box. Uses a ResizeObserver + transform: scale so every
 * child keeps its Figma coordinates. Motion code can animate children freely.
 */
export function FixedStage({ w, h, children, className = "", style, innerRef }: { w: number; h: number; children: ReactNode; className?: string; style?: CSSProperties; innerRef?: (el: HTMLDivElement | null) => void }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const o = outer.current, i = inner.current;
    if (!o || !i) return;
    const apply = () => { i.style.transform = `scale(${o.clientWidth / w})`; };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(o);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={outer} className={`st-stage ${className}`} style={{ aspectRatio: `${w} / ${h}`, ...style }}>
      <div ref={(el) => { inner.current = el; innerRef?.(el); }} className="st-stage__inner" style={{ width: w, height: h }}>
        {children}
      </div>
    </div>
  );
}
