/**
 * "Zoom into the system" diagram — Figma sections 36:336 (state 2, scale 2) and
 * 36:350 (state 3, rest). Verified: every state-3 node equals the state-2 node scaled
 * by 0.5 about the point (-203, -81.6) in the 720×620 "Frame 10" coordinate space.
 * Geometry below is the REST (state 3) layout; slab paths are in their state-2
 * local units and scale through the SVG viewBox.
 */
export const DIAGRAM_STAGE = { w: 720, h: 620 };
export const DIAGRAM_ZOOM_ORIGIN = { x: -203, y: -81.6 };

export type Slab = {
  key: string;
  label: string;
  /** rest-state position and size inside the 720×620 stage */
  x: number; y: number; w: number; h: number;
  /** path viewBox size (state-2 local units) */
  vw: number; vh: number;
  paths: { d: string; fill: string }[];
  plate: { x: number; y: number; copper?: boolean };
};

export const SLABS: Slab[] = [
  { key: "process", label: "COATING PROCESS", x: -166, y: 136.4, w: 432.5, h: 157, vw: 865, vh: 314,
    paths: [ { d: "M406 0 L0 234.404 L0 314 L406 79.5958 L406 0 Z", fill: "#653f1c" }, { d: "M406 79.5958 L0 314 L496 314 L865 80 L406 79.5958 Z", fill: "#4a2e14" } ],
    plate: { x: 37.13, y: 137.13, copper: true } },
  { key: "chemistry", label: "CHEMISTRY", x: -135, y: 188.4, w: 432.5, h: 157.25, vw: 865, vh: 314.5,
    paths: [ { d: "M405.5 0 L0 234.904 L0 314.5 L405.5 82.5 L405.5 0 Z", fill: "#243442" }, { d: "M405.5 82.5 L0 314.5 L496 314.5 L865 82.5 L405.5 82.5 Z", fill: "#091b28" }, { d: "M405.5 0 L405.5 82.5 L865 82.5 L865 0 L405.5 0 Z", fill: "#243442" } ],
    plate: { x: 69, y: 189.4 } },
  { key: "substrate", label: "SUBSTRATE", x: -98, y: 240.4, w: 432.5, h: 157, vw: 865, vh: 314,
    paths: [ { d: "M406 0 L0 234.404 L0 314 L406 79.5958 L406 0 Z", fill: "#243442" }, { d: "M406 79.5958 L0 314 L496 314 L865 80 L406 79.5958 Z", fill: "#091b28" } ],
    plate: { x: 106, y: 241.4 } },
  { key: "equipment", label: "EQUIPMENT", x: -101, y: 292.4, w: 472.5, h: 177, vw: 945, vh: 354,
    paths: [ { d: "M486 0 L0 274.404 L0 354 L486 79.5958 L486 0 Z", fill: "#243442" }, { d: "M486 79.5958 L0 354 L496 354 L945 80 L486 79.5958 Z", fill: "#091b28" } ],
    plate: { x: 143, y: 293.4 } },
  { key: "compliance", label: "COMPLIANCE", x: -104, y: 344.4, w: 512.5, h: 197, vw: 1025, vh: 394,
    paths: [ { d: "M566 0 L0 314.404 L0 394 L566 79.5958 L566 0 Z", fill: "#243442" }, { d: "M566 79.5958 L0 394 L496 394 L1025 80 L566 79.5958 Z", fill: "#091b28" } ],
    plate: { x: 180, y: 345.4 } },
  { key: "sector", label: "SECTOR", x: -107, y: 396.4, w: 552.5, h: 219, vw: 1105, vh: 438,
    paths: [ { d: "M646 0 L0 358.404 L0 438 L646 79.5958 L646 0 Z", fill: "#243442" }, { d: "M646 79.5958 L0 438 L496 438 L1105 80 L646 79.5958 Z", fill: "#091b28" } ],
    plate: { x: 217, y: 397.4 } },
  { key: "production", label: "PRODUCTION CONTEXT", x: -60, y: 448.4, w: 542.5, h: 212, vw: 1085, vh: 424,
    paths: [ { d: "M626 0 L0 344.404 L0 424 L626 79.5958 L626 0 Z", fill: "#243442" }, { d: "M626 79.5958 L0 424 L496 424 L1085 80 L626 79.5958 Z", fill: "#091b28" } ],
    plate: { x: 254, y: 449.4 } },
];

/** Label plate (Figma "Vector 1"): 228.75 × 38.75 at rest, two bands + 1.25px outside stroke white@20%. */
export const PLATE = { w: 228.75, h: 38.75, split: 29.375, stroke: 1.25, copper: ["#b87333", "#815024"], dark: ["#3a4550", "#293038"] };

/** Annotations: dashed bracket connector (18.5 × 35.5 at rest) + mono text 15px, tracking 0.5. */
export const ANNOTATIONS = [
  { x: 278.5, y: 138.4, text: "anodising / plating / HVOF" },
  { x: 306, y: 192.4, text: "bath specs · cycle times" },
  { x: 345, y: 243.4, text: "aluminium · steel · specialty" },
  { x: 384, y: 294.4, text: "rack · barrel · VACUUM" },
  { x: 423, y: 345.4, text: "NADCAP · AS9100 · ISO" },
  { x: 456, y: 400.4, text: "aerospace · defence" },
];

/** Final annotation: connector rotated -90° (32.5 × 214.5 box at 477.5, 494.4) + text at 335.5, 517.15. */
export const FINAL_ANNOTATION = { connector: { x: 477.5, y: 494.4, w: 32.5, h: 214.5 }, text: { x: 335.5, y: 517.15, value: "yield · throughput · cost" } };
