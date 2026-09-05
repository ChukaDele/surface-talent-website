"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { heroState } from "@/lib/motion/heroState";
import "@/styles/home.css";

const Specimen3D = dynamic(() => import("@/components/home/hero/Specimen3D").then((m) => m.Specimen3D), { ssr: false });

declare global { interface Window { __heroSeek?: (t: number) => Promise<void>; __heroReady?: boolean } }

/** 401.14 × 541.86 specimen slot on the hero background; the render script seeks time deterministically. */
export function HeroLoopStage() {
  useEffect(() => {
    heroState.time = 0; heroState.active = true; heroState.progress = 0;
    window.__heroSeek = (t: number) => new Promise((resolve) => {
      heroState.time = t; heroState.invalidate?.();
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    return () => { heroState.time = null; };
  }, []);
  return (
    <div style={{ background: "#0d2233", width: 401.14, height: 541.86, position: "relative", overflow: "hidden", margin: 0 }} data-hero-stage>
      <Specimen3D exact onReady={() => { window.__heroReady = true; }} />
    </div>
  );
}
