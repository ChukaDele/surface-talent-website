/* Surface Talent — Hero surface scene (Three.js)
   Metallic coating slabs that float (antigravity), respond to pointer,
   and scrub-separate on scroll into a "fit for purpose" stack.
   ─────────────────────────────────────────────────────────── */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);

const LAYER_COLORS = [
  0x1c2229, // substrate
  0x3a4550, // pre-treat
  0x8f5a28, // build
  0xb87333, // copper finish
  0xd4a574, // bright finish
];

export function createHeroSurface(canvasHost, { reduceMotion = false } = {}) {
  if (!canvasHost) return null;

  const width = () => canvasHost.clientWidth || window.innerWidth;
  const height = () => canvasHost.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width(), height());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  canvasHost.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, width() / height(), 0.1, 80);
  camera.position.set(0.4, 0.85, 6.4);

  const ambient = new THREE.AmbientLight(0xf3f1eb, 0.7);
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(4.5, 6, 3);
  const fill = new THREE.DirectionalLight(0xc8d0d8, 0.55);
  fill.position.set(-4, 2, 2);
  const copper = new THREE.PointLight(0xb87333, 40, 20, 2);
  copper.position.set(-1.2, 1.6, 3.5);
  const rim = new THREE.PointLight(0xffffff, 16, 16, 2);
  rim.position.set(3.5, -0.6, -1.5);
  scene.add(ambient, key, fill, copper, rim);

  const group = new THREE.Group();
  group.rotation.x = -0.48;
  group.rotation.y = 0.62;
  group.position.set(0.85, 0.05, 0);
  scene.add(group);

  const layers = LAYER_COLORS.map((color, i) => {
    const geo = new THREE.BoxGeometry(4.8, 0.2, 3.2);
    const mat = new THREE.MeshStandardMaterial({
      color,
      metalness: i < 2 ? 0.45 : 0.78,
      roughness: i < 2 ? 0.42 : 0.22,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = i * 0.28 - 0.55;
    mesh.userData.baseY = mesh.position.y;
    mesh.userData.index = i;
    group.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: i >= 2 ? 0xe8c39a : 0x9aa3ac,
        transparent: true,
        opacity: 0.55,
      })
    );
    mesh.add(line);
    return mesh;
  });

  // Thin callout ring floating above stack
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.012, 8, 64),
    new THREE.MeshBasicMaterial({
      color: 0xb87333,
      transparent: true,
      opacity: 0.55,
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(1.6, 1.05, 0.4);
  group.add(ring);

  const floaters = [];
  const floaterGeo = new THREE.SphereGeometry(0.032, 12, 12);
  for (let i = 0; i < 22; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: i % 3 === 0 ? 0xb87333 : 0xc0c5c9,
      metalness: 0.7,
      roughness: 0.28,
    });
    const m = new THREE.Mesh(floaterGeo, mat);
    m.position.set(
      (Math.random() - 0.5) * 6.8,
      (Math.random() - 0.5) * 3.4,
      (Math.random() - 0.5) * 4.2
    );
    m.userData.base = m.position.clone();
    m.userData.phase = Math.random() * Math.PI * 2;
    m.userData.amp = 0.14 + Math.random() * 0.28;
    m.userData.speed = 0.35 + Math.random() * 0.75;
    scene.add(m);
    floaters.push(m);
  }

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 9),
    new THREE.MeshStandardMaterial({
      color: 0xede9e0,
      metalness: 0.04,
      roughness: 0.95,
      transparent: true,
      opacity: 0.4,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.55;
  scene.add(ground);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const state = {
    separate: 0,
    spin: 0,
    visible: true,
    disposed: false,
  };

  function onPointer(e) {
    const rect = canvasHost.getBoundingClientRect();
    pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  window.addEventListener("pointermove", onPointer, { passive: true });

  let scrubTrigger = null;
  if (!reduceMotion) {
    scrubTrigger = ScrollTrigger.create({
      trigger: canvasHost.closest("section") || canvasHost,
      start: "top top",
      end: "bottom top",
      scrub: 0.65,
      onUpdate(self) {
        state.separate = self.progress;
        state.spin = self.progress * 0.4;
      },
    });
  } else {
    state.separate = 0.35;
  }

  const clock = new THREE.Clock();

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
    { threshold: 0.05 }
  );
  io.observe(canvasHost);

  function tick() {
    if (state.disposed) return;
    requestAnimationFrame(tick);
    if (!state.visible) return;

    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    group.rotation.y = 0.62 + pointer.x * 0.32 + state.spin;
    group.rotation.x = -0.48 + pointer.y * 0.14;
    group.position.x = 0.85 + pointer.x * 0.28;
    group.position.y = 0.05 + pointer.y * 0.14;

    layers.forEach((mesh, i) => {
      const mid = (layers.length - 1) / 2;
      const dir = i - mid;
      const lift = state.separate * dir * 0.62;
      const floatY = reduceMotion ? 0 : Math.sin(t * 0.65 + i * 0.9) * 0.045;
      mesh.position.y = mesh.userData.baseY + lift + floatY;
      mesh.rotation.z = pointer.x * 0.035 * (i % 2 === 0 ? 1 : -1);
    });

    ring.rotation.z = t * 0.25;
    ring.material.opacity = 0.35 + Math.sin(t * 1.2) * 0.15;

    floaters.forEach((m) => {
      const { phase, amp, speed, base } = m.userData;
      m.position.x = base.x + Math.cos(t * speed * 0.55 + phase) * amp * 0.55;
      m.position.y = base.y + Math.sin(t * speed + phase) * amp;
      m.position.z = base.z + Math.sin(t * speed * 0.4 + phase) * amp * 0.35;
    });

    copper.intensity = 24 + Math.sin(t * 0.8) * 5;
    renderer.render(scene, camera);
  }

  resize();
  requestAnimationFrame(resize);
  tick();

  if (!reduceMotion) {
    layers.forEach((mesh, i) => {
      const mid = (layers.length - 1) / 2;
      gsap.from(mesh.position, {
        y: mesh.userData.baseY + (i - mid) * 1.05,
        duration: 1.75,
        delay: 0.12 + i * 0.09,
        ease: "power3.out",
      });
    });
    gsap.from(group.rotation, {
      y: 1.55,
      duration: 2.15,
      ease: "power3.out",
    });
    gsap.from(ring.scale, {
      x: 0.2,
      y: 0.2,
      z: 0.2,
      duration: 1.4,
      delay: 0.5,
      ease: "back.out(1.6)",
    });
  }

  return {
    dispose() {
      state.disposed = true;
      scrubTrigger?.kill();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      canvasHost.innerHTML = "";
    },
  };
}
