/* eslint-disable react-hooks/immutability -- render-loop updates are the Three.js animation owner. */
"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { LAYERS, SIDE, makeMaterials, plateThickness } from "../heroGeometry";
import { A2_CALLOUTS, a2StateAtTime } from "../a2Model";

/** The A2 control experiment: fixed camera and light; only true Z separation differs from SVG. */
export function A2ThreeScene() {
  const { camera, size } = useThree();
  const plates = useRef<(THREE.Group | null)[]>([]);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const mats = useMemo(() => LAYERS.map(() => makeMaterials()), []);
  const geos = useMemo(() => LAYERS.map((_, i) => {
    const box = new THREE.BoxGeometry(SIDE, plateThickness(i), SIDE);
    return { box, edges: new THREE.EdgesGeometry(box) };
  }), []);

  useLayoutEffect(() => {
    camera.position.set(1050, 820, 1050);
    camera.lookAt(0, -180, 0);
    return () => {
      geos.forEach(({ box, edges }) => { box.dispose(); edges.dispose(); });
      mats.forEach(({ edge, face }) => { edge.dispose(); face.dispose(); });
    };
  }, [camera, geos, mats]);

  useFrame(({ clock }) => {
    const { openness, labels: labelOpacity } = a2StateAtTime(clock.elapsedTime);
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom = Math.min(0.82, size.width / 570);
    cam.updateProjectionMatrix();
    plates.current.forEach((plate, index) => {
      if (!plate) return;
      plate.position.y = -175 + (index - 3.5) * 52 * openness;
    });
    labels.current.forEach((label) => { if (label) label.style.opacity = String(labelOpacity); });
  });

  return (
    <group>
      {LAYERS.map((_, index) => {
        const callout = A2_CALLOUTS.find((item) => item.layer === index);
        return (
          <group key={index} ref={(node) => { plates.current[index] = node; }} position={[0, -175, 0]}>
            <mesh geometry={geos[index].box} material={mats[index].face} />
            <lineSegments geometry={geos[index].edges} material={mats[index].edge} />
            {callout ? <Html position={[130, 0, 0]} center><span ref={(node) => { labels.current[index] = node; }} className="st-a2-three__label"><b>{callout.label}</b>{callout.role}</span></Html> : null}
          </group>
        );
      })}
    </group>
  );
}
