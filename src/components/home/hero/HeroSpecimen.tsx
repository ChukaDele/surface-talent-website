"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Specimen } from "../Specimen";
import { PlateHero } from "./PlateHero";
import { SectionDrawing } from "./SectionDrawing";
import { HeroPortraitLoop } from "./HeroPortraitLoop";
import { VideoPlate } from "./VideoPlate";
import { DEFAULT_HERO_VARIANT, type HeroVariant } from "./variants";
import { A2SvgSpecimen } from "./A2SvgSpecimen";
import { A2_CALLOUTS, A2_MESSAGE } from "./a2Model";

/** three.js and the scenes are a separate chunk, fetched only once we know we will render them. */
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const query = (q: string) => (typeof window === "undefined" ? false : window.matchMedia(q).matches);
const canRender = () => {
  if (query("(prefers-reduced-motion: reduce)")) return false;
  if (query("(max-width: 767px)")) return false; // phones keep the static specimen
  const c = document.createElement("canvas");
  return !!(c.getContext("webgl2") || c.getContext("webgl"));
};
const subscribe = (cb: () => void) => {
  const a = window.matchMedia("(prefers-reduced-motion: reduce)"), b = window.matchMedia("(max-width: 767px)");
  a.addEventListener("change", cb); b.addEventListener("change", cb);
  return () => { a.removeEventListener("change", cb); b.removeEventListener("change", cb); };
};

/**
 * Hero artwork slot. The Figma SVG specimen is the server-rendered content — it is the LCP-safe
 * composition, the reduced-motion state, the no-WebGL state and the phone state. Where a live scene
 * is appropriate it is loaded lazily and cross-faded in on top, on a transparent canvas so there is
 * no second background behind it.
 */
export function HeroSpecimen({ variant }: { variant?: HeroVariant }) {
  const scene = variant ?? DEFAULT_HERO_VARIANT;
  // d, e and f are flat: an SVG drawing or a treated photograph, so they never touch the canvas
  // and render the same on the server, on a phone and under reduced motion.
  const flat = scene === "d" || scene === "e" || scene === "f" || scene === "g" || scene === "h";
  const eligible = useSyncExternalStore(subscribe, canRender, () => false);
  const [live, setLive] = useState(false);
  const [mount, setMount] = useState(false);
  // wait for first paint before pulling in the three.js chunk, so the hero's LCP is the copy + SVG
  useEffect(() => {
    if (!eligible || flat) return;
    const id = window.requestIdleCallback ? window.requestIdleCallback(() => setMount(true), { timeout: 1200 }) : window.setTimeout(() => setMount(true), 300);
    return () => { if (window.cancelIdleCallback) window.cancelIdleCallback(id as number); else window.clearTimeout(id as number); };
  }, [eligible, flat]);
  if (flat) {
    return (
      <div data-hero-specimen className={`st-hero__specimen st-hero__specimen--flat st-hero__specimen--${scene}`}>
        {scene === "h" ? <HeroPortraitLoop /> : scene === "g" ? <VideoPlate /> : scene === "f" ? <PlateHero /> : <SectionDrawing mode={scene === "e" ? "build" : "static"} />}
      </div>
    );
  }
  if (scene === "a2-svg") {
    return <div data-hero-specimen className="st-hero__specimen st-hero__specimen--a2"><A2Meaning /><A2SvgSpecimen /></div>;
  }
  if (scene === "a2-three") {
    return (
      <div data-hero-specimen className="st-hero__specimen st-hero__specimen--a2">
        <A2Meaning />
        <div className="st-hero__specimen-svg" style={{ opacity: live ? 0 : 1 }} aria-hidden="true"><A2SvgSpecimen /></div>
        {mount ? <HeroScene variant={scene} onReady={() => setLive(true)} /> : null}
      </div>
    );
  }
  return (
    <div data-hero-specimen className="st-hero__specimen">
      <div className="st-hero__specimen-svg" style={{ opacity: live ? 0 : 1 }} aria-hidden="true"><Specimen /></div>
      {mount ? <HeroScene variant={scene} onReady={() => setLive(true)} /> : null}
    </div>
  );
}

function A2Meaning() {
  return (
    <p className="sr-only">
      {A2_MESSAGE} From the visible surface through the role system: {A2_CALLOUTS.map(({ label, role }) => `${label}: ${role}`).join("; ")}.
    </p>
  );
}
