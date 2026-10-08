/* eslint-disable react-hooks/immutability -- useFrame mutates three.js objects imperatively by design. */
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroState } from "@/lib/motion/heroState";
import { AZ, COS_EL, ELEV, LABELS, LAYERS, SIDE, STACK_PX, makeMaterials, orbit, plateThickness, plateY } from "../heroGeometry";
import { LayerLabel } from "./labels";

/**
 * HERO C — system orbit / inspection.
 *
 * The same layers, but the viewer gets a controlled inspection orbit: the camera swings through a
 * restrained ±7° of azimuth and ±3° of elevation, so depth reads as depth rather than as vertical
 * movement. Every few seconds a technical probe plane travels down through the stack; as it crosses
 * a layer, that layer's edges brighten, its label becomes prominent and the plate eases a few pixels
 * out of line, exactly as if it were being measured. Pointer input nudges the orbit. Scroll carries
 * the camera down through the system rather than translating the objects.
 */
const CYCLE = 13;
const W = (2 * Math.PI) / CYCLE;
const PROBE_EVERY = 6.5;

export function OrbitScene() {
  const { camera, size } = useThree();
  const plates = useRef<(THREE.Group | null)[]>([]);
  const probe = useRef<THREE.Group>(null);
  const mats = useMemo(() => LAYERS.map(() => makeMaterials()), []);
  const geos = useMemo(
    () => LAYERS.map((_, i) => {
      const box = new THREE.BoxGeometry(SIDE, plateThickness(i), SIDE);
      return { box, edges: new THREE.EdgesGeometry(box) };
    }),
    [],
  );
  const probeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xd97c25, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide }), []);
  const target = useMemo(() => new THREE.Vector3(0, -STACK_PX / (2 * COS_EL) + 60, 0), []);
  const lean = useRef({ x: 0, y: 0 });
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const top = plateY(0), bottom = plateY(LAYERS.length - 1);

  useLayoutEffect(() => () => {
    geos.forEach((g) => { g.box.dispose(); g.edges.dispose(); });
    mats.forEach((m) => { m.edge.dispose(); m.face.dispose(); });
    probeMat.dispose();
  }, [geos, mats, probeMat]);

  useFrame((state) => {
    const t = heroState.time ?? state.clock.elapsedTime;
    const p = heroState.progress;

    lean.current.x += (heroState.pointerX - lean.current.x) * 0.045;
    lean.current.y += (heroState.pointerY - lean.current.y) * 0.045;
    const az = AZ + THREE.MathUtils.degToRad(Math.sin(W * t) * 7 + lean.current.x * 5);
    const el = ELEV + THREE.MathUtils.degToRad(Math.sin(W * t * 0.5) * 3 - lean.current.y * 2.5 - p * 30);
    camera.position.copy(orbit(el, az, 2200, target, camPos));
    camera.lookAt(target);
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom = Math.min(0.9, size.width / 560) * (1 + p * 1.55);
    cam.updateProjectionMatrix();

    // probe sweep: down through the stack, then a pause before the next pass
    const cyclePos = (t % PROBE_EVERY) / PROBE_EVERY;
    const sweeping = cyclePos < 0.62 && p < 0.5;
    const probeY = top + (bottom - top) * THREE.MathUtils.clamp(cyclePos / 0.62, 0, 1);
    if (probe.current) {
      probe.current.visible = sweeping;
      probe.current.position.y = probeY;
      probeMat.opacity = sweeping ? 0.3 * Math.sin(THREE.MathUtils.clamp(cyclePos / 0.62, 0, 1) * Math.PI) : 0;
    }

    let active = -1;
    for (let i = 0; i < LAYERS.length; i++) {
      const g = plates.current[i];
      if (!g) continue;
      const y0 = plateY(i);
      const scanned = sweeping ? Math.max(0, 1 - Math.abs(y0 - probeY) / 46) : 0;
      if (scanned > 0.55) active = i;
      const pointerNear = heroState.pointerX !== 0 && Math.abs(THREE.MathUtils.clamp((heroState.pointerY + 1) / 2, 0, 1) * (LAYERS.length - 1) - i) < 0.6 ? 1 : 0;
      const lift = scanned * 10 + pointerNear * 8;
      g.position.y = y0 + Math.sin(t * (0.24 + i * 0.02) + i) * 1.2 + p * p * (LAYERS.length - i) * 40;
      g.position.x = lift * 0.7;
      g.position.z = -lift * 0.7;
      const m = mats[i];
      m.edge.opacity = (0.32 + scanned * 0.6 + pointerNear * 0.2) * (1 - p);
      m.face.opacity = (0.035 + scanned * 0.09) * (1 - p);
    }
    heroState.activeLayer = active >= 0 ? active : -1;
  });

  return (
    <group>
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
      <group ref={probe}>
        <mesh material={probeMat}>
          <boxGeometry args={[SIDE * 1.28, 1.5, SIDE * 1.28]} />
        </mesh>
      </group>
    </group>
  );
}
