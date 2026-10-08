/* eslint-disable react-hooks/immutability -- React Three Fiber's useFrame loop mutates Three.js objects (camera, materials, groups) imperatively by design; nothing here mutates React state. */
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { heroState } from "@/lib/motion/heroState";

/**
 * The hero specimen rebuilt in three dimensions from the Figma artwork (Group 1, 35:284).
 * The SVG slabs are parallel projections of square plates: diamond width 233 → plate side
 * 233/√2 = 164.8; a diamond height of 128 → camera elevation ≈ 33.3° at 45° azimuth. Thin slabs
 * are 12 units thick, thick ones 36; layer spacing follows the Figma tops (÷ cos elevation).
 * An orthographic camera at zoom 1 makes one world unit one CSS pixel, so at rest the render
 * matches the Figma composition.
 *
 * Loop: plates breathe apart and settle with different periods (seamless sines), an edge-light
 * scans down the stack, the camera drifts a couple of degrees and leans toward the pointer.
 * Scroll (heroState.progress): the camera dollies in, the plates separate and dissolve — the
 * viewer passes through the surface into the system scene beneath.
 */
const SIDE = 164.8;
const ELEV = THREE.MathUtils.degToRad(33.3);
const AZ = THREE.MathUtils.degToRad(45);
const COS_EL = Math.cos(ELEV);

// Figma slab tops (px, relative) → world Y (up is +), and thickness class
const LAYERS: { top: number; thick: boolean }[] = [
  { top: 0, thick: false }, { top: 15, thick: false },
  { top: 90.02, thick: false }, { top: 105.02, thick: false },
  { top: 180.04, thick: false }, { top: 195.04, thick: false },
  { top: 270.72, thick: true }, { top: 320.73, thick: true },
];
const STACK_PX = 320.73 + 158; // total projected height of the stack
const LABELS: { text: string; layer: number }[] = [
  { text: "EXPERIENCE", layer: 1 }, { text: "TOLERANCE", layer: 3 }, { text: "CHEMISTRY", layer: 5 }, { text: "PROCESS", layer: 6 }, { text: "SUBSTRATE RAW", layer: 7 },
];

function plateY(i: number) { return -LAYERS[i].top / COS_EL; }
function plateT(i: number) { return LAYERS[i].thick ? 36 : 12; }

/** Loop period in seconds. Every oscillation completes an integer number of cycles in T, so a
 *  render of exactly T seconds is a seamless loop (see scripts/hero-loop-render.mjs). */
export const LOOP_T = 8;
const W = (2 * Math.PI) / LOOP_T;
/** 0 → 1 → 0 over one loop: the stack separates, holds apart, recombines. */
const spreadAt = (t: number) => (1 - Math.cos(W * t)) / 2;
const now = (clock: THREE.Clock) => (heroState.time !== null ? heroState.time : clock.elapsedTime);

function Rig() {
  const { camera } = useThree();
  // centre the stack in the 542 slot (Figma Group 1 spans y 31.7 → 510 → centre 271)
  const target = useRef(new THREE.Vector3(0, -STACK_PX / (2 * COS_EL) + 80, 0));
  const lean = useRef({ x: 0, y: 0 });
  useFrame((state) => {
    const t = now(state.clock);
    const p = heroState.progress;
    lean.current.x += (heroState.pointerX - lean.current.x) * 0.06;
    lean.current.y += (heroState.pointerY - lean.current.y) * 0.06;
    const az = AZ + THREE.MathUtils.degToRad(Math.sin(W * t) * 3 + lean.current.x * 3);
    const el = ELEV + THREE.MathUtils.degToRad(Math.sin(W * t) * -1.2 - lean.current.y * 1.5);
    const dist = 2000;
    camera.position.set(Math.cos(el) * Math.sin(az) * dist, Math.sin(el) * dist, Math.cos(el) * Math.cos(az) * dist).add(target.current);
    camera.lookAt(target.current);
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom = 1 + p * 1.6; // dolly in as we travel through the surface
    cam.updateProjectionMatrix();
  });
  return null;
}

function Plate({ i, edgeMat, faceMat }: { i: number; edgeMat: THREE.LineBasicMaterial; faceMat: THREE.MeshBasicMaterial }) {
  const group = useRef<THREE.Group>(null);
  const t = plateT(i);
  const geo = useMemo(() => new THREE.BoxGeometry(SIDE, t, SIDE), [t]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const myEdge = useMemo(() => edgeMat.clone(), [edgeMat]);
  const myFace = useMemo(() => faceMat.clone(), [faceMat]);
  useFrame((state) => {
    const g = group.current; if (!g) return;
    const time = now(state.clock);
    const p = heroState.progress;
    // construction loop: layers part (each by its depth in the stack), drift a touch sideways so
    // the relationship between them reads, then recombine — all periodic in LOOP_T
    const sp = spreadAt(time);
    const separate = sp * (3.5 - i) * 8; // symmetric about the stack centre so nothing leaves the slot
    const breathe = Math.sin(W * time * (i % 2 ? 2 : 1) + i * 0.8) * 2;
    const drift = sp * (i % 2 ? 1 : -1) * 6;
    const spread = p * p * (7 - i) * 46; // scroll: travelling through the surface
    g.position.y = plateY(i) + breathe + separate + spread;
    g.position.x = drift;
    g.position.z = -drift;
    // edge light scanning down the stack twice per loop
    const scan = (Math.sin(W * 2 * time - i * 0.55) + 1) / 2;
    myEdge.opacity = (0.55 + scan * 0.4) * (1 - p);
    myFace.opacity = (0.05 + scan * 0.05) * (1 - p);
  });
  const label = LABELS.find((l) => l.layer === i);
  return (
    <group ref={group} position={[0, plateY(i), 0]}>
      <mesh geometry={geo} material={myFace} />
      <lineSegments geometry={edges} material={myEdge} />
      {label ? <PlateLabel text={label.text} y={-t / 2 - 10} /> : null}
    </group>
  );
}

function PlateLabel({ text, y }: { text: string; y: number }) {
  const span = useRef<HTMLSpanElement>(null);
  useFrame(() => { if (span.current) span.current.style.opacity = String(Math.max(0, 1 - heroState.progress * 5) * 0.9); });
  return (
    <Html position={[SIDE / 2 + 4, y, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
      <span ref={span} data-slab-label3d style={{ display: "block", transform: "rotate(-29.05deg)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: "16px", letterSpacing: 2, color: "#fff", whiteSpace: "nowrap", textTransform: "uppercase", opacity: 0.9 }}>{text}</span>
    </Html>
  );
}

function Scene() {
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }), []);
  const faceMat = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, depthWrite: false }), []);
  return (
    <>
      <Rig />
      {LAYERS.map((_, i) => <Plate key={i} i={i} edgeMat={edgeMat} faceMat={faceMat} />)}
    </>
  );
}

/** Render loop gate: only render while the hero is on screen; a single frame under reduced motion. */
function FrameGate() {
  const { invalidate } = useThree();
  useFrame(() => { if (heroState.active && !heroState.reduced && heroState.time === null) invalidate(); });
  useEffect(() => { heroState.invalidate = invalidate; return () => { heroState.invalidate = null; }; }, [invalidate]);
  return null;
}

export function Specimen3D({ onReady, exact = false }: { onReady?: () => void; exact?: boolean }) {
  const [ready, setReady] = useState(false);
  return (
    <Canvas
      orthographic
      camera={{ zoom: 1, near: 1, far: 5000, position: [1000, 900, 1000] }}
      dpr={exact ? [2, 2] : [1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      // oversize the canvas around the 401×542 slot so the scroll dolly has room to grow without hard clipping
      style={exact ? { position: "absolute", inset: 0 } : { position: "absolute", left: "-60%", top: "-30%", width: "220%", height: "160%", opacity: ready ? 1 : 0, transition: "opacity 400ms ease", pointerEvents: "none" }}
      onCreated={({ gl, invalidate }) => { gl.setClearAlpha(0); setReady(true); onReady?.(); invalidate(); }}
    >
      <FrameGate />
      <Scene />
    </Canvas>
  );
}
