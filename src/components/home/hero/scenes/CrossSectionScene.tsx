/* eslint-disable react-hooks/immutability -- useFrame mutates three.js objects imperatively by design. */
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroState } from "@/lib/motion/heroState";
import { AZ, LABELS, SIDE, orbit } from "../heroGeometry";
import { LayerLabel } from "./labels";

/**
 * HERO B — material cross-section.
 *
 * Instead of five presentation plates this is one engineered surface seen in section: a thick
 * substrate carrying thin process, chemistry and tolerance layers, with a quadrant cut away so the
 * build-up is visible from the side. A coating front sweeps across the substrate laying each layer
 * down in turn (scaled from one edge, so it reads as deposition rather than fading in), the cut
 * faces catch an edge light as it passes, and once the surface is finished the section opens to
 * expose the layers before closing again.
 */
const CYCLE = 16;
const W = (2 * Math.PI) / CYCLE;
/** Layer stack from the substrate up: thickness and the label it carries. */
const BUILD = [
  { t: 52, label: "Substrate raw" },
  { t: 16, label: "Process" },
  { t: 14, label: "Chemistry" },
  { t: 12, label: "Tolerance" },
  { t: 10, label: "Experience" },
];
/** vertical air between layers so the section reads as a stack rather than a solid block */
const GAP = 9;
const HALF = SIDE / 2;

export function CrossSectionScene() {
  const { camera, size } = useThree();
  const layers = useRef<(THREE.Group | null)[]>([]);
  const scan = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(0, 62, 0), []);
  const lean = useRef({ x: 0, y: 0 });
  const camPos = useMemo(() => new THREE.Vector3(), []);

  // a quadrant is removed from every layer, so the section is a three-quarter L in plan
  const built = useMemo(() => {
    let y = 0;
    return BUILD.map((b) => {
      const shape = new THREE.Shape();
      shape.moveTo(-HALF, -HALF); shape.lineTo(HALF, -HALF); shape.lineTo(HALF, 0); shape.lineTo(0, 0); shape.lineTo(0, HALF); shape.lineTo(-HALF, HALF); shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: b.t, bevelEnabled: false });
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, b.t, 0);
      const edges = new THREE.EdgesGeometry(geo, 20);
      const face = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, depthWrite: false, side: THREE.DoubleSide });
      const edge = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
      const entry = { geo, edges, face, edge, base: y, thickness: b.t, label: b.label };
      y += b.t + GAP;
      return entry;
    });
  }, []);

  useLayoutEffect(() => () => built.forEach((b) => { b.geo.dispose(); b.edges.dispose(); b.face.dispose(); b.edge.dispose(); }), [built]);

  useFrame((state) => {
    const t = heroState.time ?? state.clock.elapsedTime;
    const p = heroState.progress;
    const phase = (t % CYCLE) / CYCLE; // 0 → build, 0.45 → finished, 0.6 → open, 0.9 → close

    lean.current.x += (heroState.pointerX - lean.current.x) * 0.05;
    lean.current.y += (heroState.pointerY - lean.current.y) * 0.05;
    // lower elevation than the stack: this variant is read from the side, like a section drawing
    const az = AZ + THREE.MathUtils.degToRad(lean.current.x * 5 + Math.sin(W * t) * 2);
    const el = THREE.MathUtils.degToRad(26) + THREE.MathUtils.degToRad(-lean.current.y * 2.6 + Math.sin(W * t * 1.5) * 1.1 - p * 22);
    camera.position.copy(orbit(el, az, 2200, target, camPos));
    camera.lookAt(target);
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom = Math.min(0.95, size.width / 520) * (1 + p * 1.4);
    cam.updateProjectionMatrix();

    const open = Math.max(0, Math.sin((phase - 0.5) * Math.PI * 2)) * (phase > 0.5 ? 1 : 0);
    heroState.activeLayer = -1;

    built.forEach((b, i) => {
      const g = layers.current[i];
      if (!g) return;
      // deposition: each coating layer grows across the substrate in sequence
      const start = 0.06 + i * 0.075;
      const grow = i === 0 ? 1 : THREE.MathUtils.clamp((phase - start) / 0.11, 0, 1);
      const eased = grow * grow * (3 - 2 * grow);
      g.scale.set(i === 0 ? 1 : Math.max(0.001, eased), 1, 1);
      g.position.x = i === 0 ? 0 : -HALF * (1 - eased);
      g.position.y = b.base + open * i * 30 + p * p * (built.length - i) * 40;
      b.edge.opacity = (0.3 + eased * 0.55) * (1 - p);
      b.face.opacity = (0.03 + eased * 0.05 + open * 0.03) * (1 - p);
      if (grow > 0.02 && grow < 0.98) heroState.activeLayer = i;
    });
    // once every layer is down, label the finished surface until the next pass begins
    if (heroState.activeLayer === -1) heroState.activeLayer = phase > 0.45 ? built.length - 1 : 0;

    // the coating front: a thin bright line travelling across the surface while a layer builds
    if (scan.current) {
      const idx = built.findIndex((_, i) => i > 0 && phase > 0.06 + i * 0.075 && phase < 0.17 + i * 0.075);
      const b = built[idx > 0 ? idx : 1];
      const local = idx > 0 ? THREE.MathUtils.clamp((phase - (0.06 + idx * 0.075)) / 0.11, 0, 1) : 0;
      scan.current.visible = idx > 0 && p < 0.4;
      scan.current.position.set(-HALF + local * SIDE, b.base + b.thickness / 2, 0);
    }
  });

  return (
    <group>
      {built.map((b, i) => {
        const label = LABELS.find((l) => l.text === b.label);
        return (
          <group key={b.label} ref={(el) => { layers.current[i] = el; }} position={[0, b.base, 0]}>
            <mesh geometry={b.geo} material={b.face} />
            <lineSegments geometry={b.edges} material={b.edge} />
            {label ? <LayerLabel text={b.label} y={b.thickness + 10} index={i} activeOnly /> : null}
          </group>
        );
      })}
      <group ref={scan}>
        <mesh>
          <boxGeometry args={[2.2, 26, SIDE]} />
          <meshBasicMaterial color={0xd97c25} transparent opacity={0.72} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
