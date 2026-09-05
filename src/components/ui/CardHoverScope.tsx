"use client";

import { useRef, type ReactNode } from "react";
import { useCardHover } from "@/lib/motion/useCardHover";

/** Wraps a server-rendered grid and applies the shared restrained card hover to `selector`. */
export function CardHoverScope({ selector, children, className }: { selector: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useCardHover(ref, selector);
  return <div ref={ref} className={className} style={{ display: "contents" }}>{children}</div>;
}
