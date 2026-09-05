import * as THREE from "three";

/**
 * Geometry shared by the three hero scenes, derived from the Figma specimen (Group 1, 35:284).
 * The SVG slabs are a parallel projection of square plates: a diamond 233 wide means a plate side of
 * 233/√2 = 164.8, and a diamond height of 128 gives a camera elevation of ~33.3° at 45° azimuth.
 * One world unit is one CSS pixel at zoom 1, so an orthographic scene at rest matches the artwork.
 */
export const SIDE = 164.8;
export const ELEV = THREE.MathUtils.degToRad(33.3);
export const AZ = THREE.MathUtils.degToRad(45);
export const COS_EL = Math.cos(ELEV);

/** Figma slab tops (px from the top of the group) and their thickness class. */
export const LAYERS: { top: number; thick: boolean }[] = [
  { top: 0, thick: false }, { top: 15, thick: false },
  { top: 90.02, thick: false }, { top: 105.02, thick: false },
  { top: 180.04, thick: false }, { top: 195.04, thick: false },
  { top: 270.72, thick: true }, { top: 320.73, thick: true },
];
export const STACK_PX = 320.73 + 158;

/** The five named layers, each pinned to the plate that carries its label in Figma. */
export const LABELS: { text: string; layer: number }[] = [
  { text: "Experience", layer: 1 },
  { text: "Tolerance", layer: 3 },
  { text: "Chemistry", layer: 5 },
  { text: "Process", layer: 6 },
  { text: "Substrate raw", layer: 7 },
];

export const plateY = (i: number) => -LAYERS[i].top / COS_EL;
export const plateThickness = (i: number) => (LAYERS[i].thick ? 36 : 12);

/** Camera position for an orbit at the given elevation/azimuth around a target. */
export function orbit(el: number, az: number, dist: number, target: THREE.Vector3, out = new THREE.Vector3()) {
  return out.set(Math.cos(el) * Math.sin(az) * dist, Math.sin(el) * dist, Math.cos(el) * Math.cos(az) * dist).add(target);
}

/** Edge + face materials in the hero's line-art language (white lines, 5% translucent faces). */
export function makeMaterials() {
  const edge = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  const face = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, depthWrite: false });
  return { edge, face };
}
