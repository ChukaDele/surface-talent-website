/**
 * Hero specimen (Figma "Group 1" 35:284 inside "Shadow" 35:283, 401.14 × 541.86).
 * Group bounds: x 78.99, y 31.69, w 232.71, h 478.37. Layers listed bottom → top in
 * Figma z-order; positions are relative to the Shadow frame.
 * Labels (Geist Mono 12/16, tracking 2px, rotated 29.05°) also relative to Shadow.
 */
export const SPECIMEN_FRAME = { w: 401.14, h: 541.86 };

export const SPECIMEN_LAYERS = [
  { id: "35:285", variant: "thick", x: 86.0, y: 352.42, w: 232.71, h: 157.72 },
  { id: "35:286", variant: "thin", x: 79.32, y: 46.69, w: 232.71, h: 137.72 },
  { id: "35:287", variant: "thin", x: 81.28, y: 136.71, w: 232.71, h: 137.72 },
  { id: "35:288", variant: "thin", x: 83.25, y: 226.73, w: 232.71, h: 137.72 },
  { id: "35:289", variant: "thin", x: 78.99, y: 31.69, w: 232.71, h: 137.72 },
  { id: "35:290", variant: "thin", x: 80.96, y: 121.71, w: 232.71, h: 137.72 },
  { id: "35:291", variant: "thin", x: 82.92, y: 211.73, w: 232.71, h: 137.72 },
  { id: "35:292", variant: "thick", x: 84.9, y: 302.41, w: 232.71, h: 157.72 },
] as const;

export const SPECIMEN_LABELS = [
  { text: "SUBSTRATE RAW", x: 212.07, y: 484.34, w: 118, align: "center" },
  { text: "PROCESS", x: 210.96, y: 433.33, w: 63, align: "left" },
  { text: "CHEMISTRY", x: 190.21, y: 321.97, w: 81, align: "center" },
  { text: "TOLERANCE", x: 188.2, y: 229.95, w: 81, align: "center" },
  { text: "EXPERIENCE", x: 181.82, y: 140.35, w: 90, align: "center" },
] as const;

export const SPECIMEN_LABEL_ROTATION = 29.05;
