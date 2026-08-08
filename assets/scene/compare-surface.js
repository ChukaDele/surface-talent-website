/* Surface Talent — Consequence dual-surface (Three.js)
   Left: porous/defect generalist slab. Right: refined copper finish.
   Scroll morphs roughness / separation; pointer tips the balance.
   ─────────────────────────────────────────────────────────── */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);

function makeNoiseCanvas() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 90 + Math.random() * 90;
    img.data[i] = v;
    img.data[i + 1] = v * 0.92;
    img.data[i + 2] = v * 0.85;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

export function createCompareSurface(host, { reduceMotion = false } = {}) {
  if (!host) return null;

  const width = () => host.clientWidth || 640;
  const height = () => Math.max(host.clientHeight || 280, 220);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width(), height());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, width() / height(), 0.1, 40);
  camera.position.set(0, 0.35, 6.2);

  scene.add(new THREE.AmbientLight(0xe8e4dc, 0.45));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(2, 4, 5);
  scene.add(key);
  const copper = new THREE.PointLight(0xb87333, 18, 14, 2);
  copper.position.set(2.2, 0.8, 2.5);
  scene.add(copper);
  const cool = new THREE.PointLight(0x8a939c, 10, 12, 2);
  cool.position.set(-2.4, -0.4, 2);
  scene.add(cool);

  const noise = makeNoiseCanvas();
  const root = new THREE.Group();
  root.rotation.x = -0.55;
  scene.add(root);

  // Fail slab — rough, mottled
  const failMat = new THREE.MeshStandardMaterial({
    color: 0x3a424c,
    metalness: 0.35,
    roughness: 0.92,
    bumpMap: noise,
    bumpScale: 0.08,
  });
  const fail = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 1.7), failMat);
  fail.position.set(-1.55, 0, 0);
  root.add(fail);

  // Pitting spheres on fail surface
  const pits = [];
  for (let i = 0; i < 14; i++) {
    const pit = new THREE.Mesh(
      new THREE.SphereGeometry(0.04 + Math.random() * 0.05, 8, 8),
      new THREE.MeshStandardMaterial({
        color: 0xb33a2b,
        metalness: 0.2,
        roughness: 0.7,
        transparent: true,
        opacity: 0.85,
      })
    );
    pit.position.set(
      -1.55 + (Math.random() - 0.5) * 1.8,
      0.14,
      (Math.random() - 0.5) * 1.2
    );
    root.add(pit);
    pits.push(pit);
  }

  // Pass stack — refined layers
  const passColors = [0x1c2229, 0x5a4634, 0xb87333, 0xd4a574];
  const passLayers = passColors.map((color, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color,
      metalness: i < 1 ? 0.5 : 0.95,
      roughness: i < 1 ? 0.4 : 0.14,
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.7), mat);
    mesh.position.set(1.55, -0.18 + i * 0.13, 0);
    mesh.userData.baseY = mesh.position.y;
    root.add(mesh);
    return mesh;
  });

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const state = { refine: 0, visible: true, disposed: false };

  function onPointer(e) {
    const rect = host.getBoundingClientRect();
    pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }
  window.addEventListener("pointermove", onPointer, { passive: true });

  let scrub = null;
  if (!reduceMotion) {
    scrub = ScrollTrigger.create({
      trigger: host.closest("section") || host,
      start: "top 75%",
      end: "center 35%",
      scrub: 0.6,
      onUpdate(self) {
        state.refine = self.progress;
      },
    });
  } else {
    state.refine = 1;
  }

  function resize() {
    const w = width();
    const h = height();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);

  const io = new IntersectionObserver(
    ([entry]) => {
      state.visible = entry.isIntersecting;
    },
    { threshold: 0.08 }
  );
  io.observe(host);

  const clock = new THREE.Clock();

  function tick() {
    if (state.disposed) return;
    requestAnimationFrame(tick);
    if (!state.visible) return;

    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.07;
    pointer.y += (pointer.ty - pointer.y) * 0.07;

    root.rotation.y = pointer.x * 0.18;
    root.rotation.x = -0.55 + pointer.y * 0.08;

    fail.position.y = Math.sin(t * 0.9) * 0.03;
    failMat.roughness = 0.95 - state.refine * 0.15;
    failMat.opacity = 1;
    fail.scale.setScalar(1 - state.refine * 0.04);

    pits.forEach((pit, i) => {
      pit.material.opacity = Math.max(0.05, 0.9 - state.refine * 1.1);
      pit.position.y = 0.14 + Math.sin(t * 1.4 + i) * 0.01;
      pit.scale.setScalar(1 - state.refine * 0.6);
    });

    passLayers.forEach((mesh, i) => {
      const float = reduceMotion ? 0 : Math.sin(t * 0.7 + i * 0.8) * 0.025;
      const lift = state.refine * i * 0.06;
      mesh.position.y = mesh.userData.baseY + lift + float;
      mesh.material.roughness = THREE.MathUtils.lerp(0.45, 0.12, state.refine);
    });

    copper.intensity = 12 + state.refine * 14 + Math.sin(t) * 2;
    renderer.render(scene, camera);
  }

  resize();
  tick();

  if (!reduceMotion) {
    gsap.from(fail.position, { x: -3.2, duration: 1.2, ease: "power3.out" });
    passLayers.forEach((mesh, i) => {
      gsap.from(mesh.position, {
        x: 3.2,
        duration: 1.2,
        delay: 0.08 * i,
        ease: "power3.out",
      });
    });
  }

  return {
    dispose() {
      state.disposed = true;
      scrub?.kill();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      host.innerHTML = "";
    },
  };
}
