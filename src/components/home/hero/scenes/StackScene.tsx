/* eslint-disable react-hooks/immutability -- useFrame mutates three.js objects imperatively by design. */
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroState } from "@/lib/motion/heroState";
import { AZ, COS_EL, ELEV, LABELS, LAYERS, SIDE, STACK_PX, makeMaterials, orbit, plateThickness, plateY } from "../heroGeometry";
import { LayerLabel } from "./labels";

/**
 * HERO A — exploded engineering stack.
 *
 * The Figma line-art layers become real planes at true Z separation. Each plate drifts on its own
 * period in all three axes with a little roll, so the group never reads as synchronised bobbing.
 * Over one long cycle the assembly expands, holds open long enough to show the relationships,
 * aligns, compresses toward a finished surface, then separates again — with no visible restart.
 * The pointer moves the camera a couple of degrees; the plate nearest the pointer eases forward and
 * its neighbours give way slightly. On scroll the camera pushes up through the top surface.
 */
const CYCLE = 15;
const W = (2 * Math.PI) / CYCLE;
/** 0 → open → 0 across the cycle, with a dwell at each end (raised cosine, squared for the hold). */
const openness = (t: number) => Math.pow((1 - Math.cos(W * t)) / 2, 0.72);

export function StackScene() {
  const { camera, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const plates = useRef<(THREE.Group | null)[]>([]);
  const mats = useMemo(() => LAYERS.map(() => makeMaterials()), []);
  const geos = useMemo(
    () => LAYERS.map((_, i) => {
      const box = new THREE.BoxGeometry(SIDE, plateThickness(i), SIDE);
      return { box, edges: new THREE.EdgesGeometry(box) };
    }),
    [],
  );
  const target = useMemo(() => new THREE.Vector3(0, -STACK_PX / (2 * COS_EL) + 60, 0), []);
  const lean = useRef({ x: 0, y: 0 });
  const camPos = useMemo(() => new THREE.Vector3(), []);

  useLayoutEffect(() => () => {
    geos.forEach((g) => { g.box.dispose(); g.edges.dispose(); });
    mats.forEach((m) => { m.edge.dispose(); m.face.dispose(); });
  }, [geos, mats]);

  useFrame((state) => {
    const t = heroState.time ?? state.clock.elapsedTime;
    const p = heroState.progress;
    const open = openness(t);

    // camera: fixed axonometric view with a small pointer lean, dollying in on scroll
    lean.current.x += (heroState.pointerX - lean.current.x) * 0.05;
    lean.current.y += (heroState.pointerY - lean.current.y) * 0.05;
    const az = AZ + THREE.MathUtils.degToRad(lean.current.x * 4 + Math.sin(W * t) * 1.6);
    const el = ELEV + THREE.MathUtils.degToRad(-lean.current.y * 2.4 + Math.sin(W * t * 2) * 0.6 - p * 26);
    camera.position.copy(orbit(el, az, 2200, target, camPos));
    camera.lookAt(target);
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom = Math.min(0.9, size.width / 560) * (1 + p * 1.5);
    cam.updateProjectionMatrix();

    // which layer is under the pointer, in stack order from the top
    const wanted = heroState.pointerX === 0 && heroState.pointerY === 0
      ? -1
      : Math.round(THREE.MathUtils.clamp((heroState.pointerY + 1) / 2, 0, 1) * (LAYERS.length - 1));
    heroState.activeLayer = wanted;

    for (let i = 0; i < LAYERS.length; i++) {
      const g = plates.current[i];
      if (!g) continue;
      const depth = i - (LAYERS.length - 1) / 2; // symmetric about the stack centre
      // independent drift: three different periods per plate so nothing moves in lockstep
      const dy = Math.sin(t * (0.31 + i * 0.041) + i * 1.7) * 2.6;
      const dx = Math.cos(t * (0.23 + i * 0.033) + i * 0.9) * 2.2;
      const dz = Math.sin(t * (0.27 + i * 0.029) + i * 2.3) * 2.2;
      const separation = open * depth * -19;
      const near = wanted === i ? 1 : wanted >= 0 && Math.abs(wanted - i) === 1 ? -0.35 : 0;
      g.position.y = plateY(i) + dy + separation + p * p * (LAYERS.length - i) * 42;
      g.position.x = dx + open * (i % 2 ? 5 : -5) + near * 16;
      g.position.z = dz - near * 16;
      g.rotation.y = THREE.MathUtils.degToRad(Math.sin(t * 0.19 + i) * 0.7 + open * (i % 2 ? 1.1 : -1.1));
      const m = mats[i];
      const focus = wanted === i ? 1 : 0.62;
      m.edge.opacity = (0.34 + focus * 0.5) * (1 - p);
      m.face.opacity = (0.035 + open * 0.05 + (wanted === i ? 0.05 : 0)) * (1 - p);
    }
    if (group.current) group.current.visible = p < 0.98;
  });

  return (
    <group ref={group}>
      {LAYERS.map((_, i) => {
        const label = LABELS.find((l) => l.layer === i);
        return (
          <group key={i} ref={(el) => { plates.current[i] = el; }} position={[0, plateY(i), 0]}>
            <mesh geometry={geos[i].box} material={mats[i].face} />
            <lineSegments geometry={geos[i].edges} material={mats[i].edge} />
            {label ? <LayerLabel text={label.text} y={-plateThickness(i) / 2 - 10} index={i} /> : null}
          </group>
        );
      })}
    </group>
  );
}
