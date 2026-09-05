"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero option D and E — a coating cross-section drawn the way an engineer would draw one.
 *
 * Straight-on orthographic elevation: substrate at the bottom with section hatching, then the
 * process layers stacked on it, each pulled out to a mono callout. There is no perspective, no
 * lighting model and nothing pretending to be a photograph of an object, which is what made the
 * isometric attempts read as clip art. The second half of the drawing is the point: every layer is
 * named for the seat that owns it, so the image says what the surface is made of and who Surface
 * Talent puts on the line to make it.
 *
 * `mode="build"` deposits the layers in sequence and draws each leader line in as its layer lands.
 * `mode="static"` is the reduced-motion and server-rendered state: the finished section.
 */

type Layer = { id: string; label: string; spec: string; role: string; h: number; fill: string; stroke: string };

/**
 * Depths are proportional, not to scale: a real topcoat beside a real substrate would vanish. Each
 * band is also tall enough to hold its own three-line callout, so no annotation can collide with
 * its neighbour at any width.
 */
const LAYERS: Layer[] = [
  { id: "topcoat", label: "Topcoat", spec: "Seal / passivate", role: "Quality lead", h: 56, fill: "rgba(184,115,51,0.30)", stroke: "var(--primary-500)" },
  { id: "deposit", label: "Deposit", spec: "Anodise · plate · spray", role: "Process engineer", h: 72, fill: "rgba(255,255,255,0.10)", stroke: "rgba(255,255,255,0.62)" },
  { id: "pretreat", label: "Pre-treatment", spec: "Degrease · etch · desmut", role: "Line supervisor", h: 60, fill: "rgba(255,255,255,0.06)", stroke: "rgba(255,255,255,0.42)" },
  { id: "substrate", label: "Substrate", spec: "Alloy · steel · casting", role: "Plant manager", h: 108, fill: "transparent", stroke: "rgba(255,255,255,0.55)" },
];

/** Laid out top-down in the drawing, so the substrate sits on the baseline and the coating on it. */
function layout() {
  let y = TOP;
  return LAYERS.map((l) => { const box = { ...l, y }; y += l.h + GAP; return box; });
}

const W = 462;
const PLATE_X = 16;
const PLATE_W = 196;
const TOP = 84;
const GAP = 8;
const TOTAL_H = TOP + LAYERS.reduce((a, l) => a + l.h + GAP, 0) + 96;

export function SectionDrawing({ mode = "build" }: { mode?: "build" | "static" }) {
  const [shown, setShown] = useState(mode === "static" ? LAYERS.length : 0);
  const root = useRef<SVGSVGElement>(null);
  const placed = layout();
  const bottom = placed[placed.length - 1].y + placed[placed.length - 1].h;

  // deposit from the substrate up, the order a real line runs in, then hold the finished section
  useEffect(() => {
    if (mode !== "build") return;
    const el = root.current;
    if (!el) return;
    let timer = 0;
    let step = 0;
    let running = false;
    const tick = () => {
      step = step >= LAYERS.length ? 0 : step + 1;
      setShown(step);
      timer = window.setTimeout(tick, step === LAYERS.length ? 4200 : 900);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; tick(); }
      else if (!e.isIntersecting && running) { running = false; window.clearTimeout(timer); }
    }, { threshold: 0.05 });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, [mode]);

  const visibleFromBottom = (i: number) => mode === "static" || shown >= LAYERS.length - i;

  return (
    <svg
      ref={root}
      className="st-section-drawing"
      viewBox={`0 0 ${W} ${TOTAL_H}`}
      role="img"
      aria-label="Cross-section of an engineered surface. Topcoat, deposit, pre-treatment and substrate, each labelled with the role Surface Talent places on it."
    >
      <defs>
        <pattern id="st-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,0.30)" strokeWidth="1" />
        </pattern>
      </defs>

      <text className="st-section-drawing__title" x={PLATE_X} y="28">SECTION A–A</text>
      <text className="st-section-drawing__sub" x={PLATE_X} y="48">Engineered surface · who owns each layer</text>
      <line x1={PLATE_X} y1="62" x2={W - 16} y2="62" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

      {placed.map((l, i) => {
        const on = visibleFromBottom(i);
        const isSubstrate = l.id === "substrate";
        const midY = l.y + l.h / 2;
        return (
          <g key={l.id} className="st-section-drawing__layer" data-on={on ? "" : undefined} style={{ transitionDelay: `${i * 40}ms` }}>
            <rect
              x={PLATE_X}
              y={l.y}
              width={PLATE_W}
              height={l.h}
              fill={isSubstrate ? "url(#st-hatch)" : l.fill}
              stroke={l.stroke}
              strokeWidth={isSubstrate ? 1.4 : 1.1}
            />
            {/* leader line out to the callout, the way a drawing annotates a feature */}
            <line x1={PLATE_X + PLATE_W} y1={midY} x2={PLATE_X + PLATE_W + 30} y2={midY} stroke="rgba(255,255,255,0.34)" strokeWidth="1" />
            <circle cx={PLATE_X + PLATE_W} cy={midY} r="2.2" fill={l.stroke} />
            <text className="st-section-drawing__label" x={PLATE_X + PLATE_W + 40} y={midY - 12}>{l.label}</text>
            <text className="st-section-drawing__spec" x={PLATE_X + PLATE_W + 40} y={midY + 4}>{l.spec}</text>
            <text className="st-section-drawing__role" x={PLATE_X + PLATE_W + 40} y={midY + 22}>{l.role}</text>
          </g>
        );
      })}

      {/* overall depth dimension down the left edge */}
      <g className="st-section-drawing__dim">
        <line x1={PLATE_X - 9} y1={TOP} x2={PLATE_X - 9} y2={bottom} stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
        <line x1={PLATE_X - 13} y1={TOP} x2={PLATE_X - 5} y2={TOP} stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
        <line x1={PLATE_X - 13} y1={bottom} x2={PLATE_X - 5} y2={bottom} stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
      </g>

      <text className="st-section-drawing__foot" x={PLATE_X} y={TOTAL_H - 40}>Four seats. One finished surface.</text>
      <text className="st-section-drawing__sub" x={PLATE_X} y={TOTAL_H - 20}>Surface Talent recruits every one of them.</text>
    </svg>
  );
}
