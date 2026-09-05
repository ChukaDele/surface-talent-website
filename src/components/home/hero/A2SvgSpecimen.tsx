"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/motion/gsap";
import { SPECIMEN_FRAME, SPECIMEN_LAYERS } from "@/data/heroSpecimen";
import { A2_CALLOUTS, A2_TIMING } from "./a2Model";

/** Option A2, using only the approved Figma slab exports. One GSAP timeline owns every moving part. */
export function A2SvgSpecimen() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layers = gsap.utils.toArray<HTMLElement>("[data-a2-layer]", root.current);
    const callouts = gsap.utils.toArray<HTMLElement>("[data-a2-callout]", root.current);
    const surfaceY = 228;
    const collapsed = layers.map((layer) => surfaceY - Number(layer.dataset.top));
    const exploded = layers.map((_, index) => (index - 3.5) * 8);

    if (reduced) {
      gsap.set(layers, { y: (i) => exploded[i] });
      gsap.set(callouts, { autoAlpha: 1, x: 0, "--leader-scale": 1 });
      return () => gsap.set([...layers, ...callouts], { clearProps: "transform,opacity,visibility,--leader-scale" });
    }

    gsap.set(layers, { y: (i) => collapsed[i] });
    gsap.set(callouts, { autoAlpha: 0, x: -8, "--leader-scale": 0 });
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });
    tl.to(layers, { y: (i) => exploded[i], duration: A2_TIMING.separationEnd - A2_TIMING.completeHoldEnd }, A2_TIMING.completeHoldEnd)
      .to(callouts, { autoAlpha: 1, x: 0, "--leader-scale": 1, duration: A2_TIMING.labelsInEnd - A2_TIMING.labelsInStart }, A2_TIMING.labelsInStart)
      .to(callouts, { autoAlpha: 0, x: -8, "--leader-scale": 0, duration: A2_TIMING.labelsOutEnd - A2_TIMING.inspectionEnd }, A2_TIMING.inspectionEnd)
      .to(layers, { y: (i) => collapsed[i], duration: A2_TIMING.reassemblyEnd - A2_TIMING.reassemblyStart }, A2_TIMING.reassemblyStart)
      .to({}, { duration: A2_TIMING.total - A2_TIMING.reassemblyEnd });
    return () => {
      tl.kill();
      gsap.set([...layers, ...callouts], { clearProps: "transform,opacity,visibility,--leader-scale" });
    };
  }, { scope: root });

  return (
    <div ref={root} className="st-a2" style={{ aspectRatio: `${SPECIMEN_FRAME.w} / ${SPECIMEN_FRAME.h}` }} data-a2-svg aria-hidden="true">
      <p className="st-a2__surface">The surface</p>
      <div className="st-a2__stack" aria-hidden="true">
        {SPECIMEN_LAYERS.map((layer) => (
          <img key={layer.id} data-a2-layer data-top={layer.y} src={layer.variant === "thick" ? "/assets/svg/specimen-slab-thick.svg" : "/assets/svg/specimen-slab-thin.svg"} alt="" width={layer.w} height={layer.h} style={{ left: layer.x, top: layer.y }} />
        ))}
      </div>
      <div className="st-a2__callouts">
        {A2_CALLOUTS.map((item) => <p key={item.label} data-a2-callout style={{ ["--callout-row" as string]: item.layer }}><span>{item.label}</span>{item.role}</p>)}
      </div>
      <p className="st-a2__caption"><span>Generalists see the finish.</span> We recruit through the full system.</p>
    </div>
  );
}
