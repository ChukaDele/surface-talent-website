/* Surface Talent — Pass 2 motion architecture
   GSAP · ScrollTrigger · Lenis
   Signature: hero layers · system pin · stack · pipeline · close
   ─────────────────────────────────────────────────────────── */

import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/ScrollTrigger/+esm";
import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm";

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = window.matchMedia("(pointer: coarse)").matches;

/* ── Smooth scroll ─────────────────────────────────────────── */
function initLenis() {
  if (reduce) return null;
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
  return lenis;
}

/* ── Nav ───────────────────────────────────────────────────── */
function initNav() {
  const nav = document.querySelector("[data-nav]");
  const menu = document.querySelector("[data-menu]");
  const links = document.querySelector(".nav__links");
  if (!nav) return;

  ScrollTrigger.create({
    start: 40,
    onUpdate(self) {
      nav.classList.toggle("is-solid", self.scroll() > 40);
    },
  });

  // Dark nav over bath sections
  document.querySelectorAll(".system, .operator, .pipeline, .close, .consequence").forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top top+=48",
      end: "bottom top+=48",
      onEnter: () => nav.classList.add("is-dark"),
      onEnterBack: () => nav.classList.add("is-dark"),
      onLeave: () => nav.classList.remove("is-dark"),
      onLeaveBack: () => nav.classList.remove("is-dark"),
    });
  });

  menu?.addEventListener("click", () => links?.classList.toggle("open"));
}

/* ── Cursor + magnetic ─────────────────────────────────────── */
function initCursor() {
  if (reduce || coarse) return;

  const el = document.createElement("div");
  el.className = "st-cursor";
  el.innerHTML = `<span class="st-cursor__dot"></span><span class="st-cursor__ring"></span>`;
  document.body.appendChild(el);
  document.body.classList.add("has-st-cursor");

  const dot = el.querySelector(".st-cursor__dot");
  const ring = el.querySelector(".st-cursor__ring");
  const pos = { x: 0, y: 0 };
  const ringPos = { x: 0, y: 0 };

  window.addEventListener(
    "pointermove",
    (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.set(dot, { x: pos.x, y: pos.y });
    },
    { passive: true }
  );

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  });

  document.querySelectorAll("a, button, .btn, [data-magnetic]").forEach((node) => {
    node.addEventListener("pointerenter", () => el.classList.add("is-hot"));
    node.addEventListener("pointerleave", () => el.classList.remove("is-hot"));
  });
}

function initMagnetic() {
  if (reduce || coarse) return;
  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const s = Number(btn.getAttribute("data-magnetic") || 14);
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: ((e.clientX - (r.left + r.width / 2)) / r.width) * s,
        y: ((e.clientY - (r.top + r.height / 2)) / r.height) * s,
        duration: 0.3,
        ease: "power3.out",
      });
    });
    btn.addEventListener("pointerleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.45)" });
    });
  });
}

/* ── HERO: looping specimen (GIF-like) + type entrance ─────── */
function initHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const lines = [...hero.querySelectorAll("[data-hero-line] .hero__line-inner")];
  const layers = [...hero.querySelectorAll(".specimen-layer")];
  const coats = layers.slice(1);
  const marks = hero.querySelector(".specimen-marks");
  const ghost = hero.querySelector(".specimen-ghost");
  const specimen = hero.querySelector("[data-specimen]");
  const scrollHint = hero.querySelector(".hero__scroll span");

  if (scrollHint) scrollHint.textContent = "Scroll to continue";

  if (!reduce && lines.length) {
    gsap.from(lines, {
      yPercent: 115,
      duration: 1.15,
      stagger: 0.08,
      ease: "power4.out",
      delay: 0.15,
    });
  }

  // Substrate always present
  gsap.set(layers[0], { y: 0, opacity: 1 });

  if (reduce) {
    gsap.set(layers, { y: 0, opacity: 1 });
    if (marks) gsap.set(marks, { opacity: 0.7 });
    if (ghost) gsap.set(ghost, { opacity: 0 });
    return;
  }

  gsap.set(coats, { y: (i) => -56 - i * 28, opacity: 0 });
  if (marks) gsap.set(marks, { opacity: 0 });
  if (ghost) gsap.set(ghost, { opacity: 0.3 });

  // Ambient float on the whole specimen
  if (specimen) {
    gsap.to(specimen, {
      y: -10,
      duration: 2.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }

  // Loop: assemble → hold → dissolve → repeat
  const loop = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.35,
    defaults: { ease: "power2.out" },
  });

  coats.forEach((layer, i) => {
    loop.to(
      layer,
      { y: 0, opacity: 1, duration: 0.55 },
      0.15 + i * 0.22
    );
  });
  if (ghost) loop.to(ghost, { opacity: 0, duration: 0.4 }, 0.2);
  if (marks) loop.to(marks, { opacity: 0.75, duration: 0.4 }, 0.85);

  loop.to({}, { duration: 1.4 }); // hold finished state

  loop.addLabel("dissolve");
  if (marks) loop.to(marks, { opacity: 0, duration: 0.35 }, "dissolve");
  coats
    .slice()
    .reverse()
    .forEach((layer, i) => {
      loop.to(
        layer,
        {
          y: -56 - (coats.length - 1 - i) * 28,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        },
        `dissolve+=${0.08 + i * 0.12}`
      );
    });
  if (ghost) loop.to(ghost, { opacity: 0.3, duration: 0.4 }, "dissolve+=0.15");

  loop.to({}, { duration: 0.5 }); // brief raw pause
}

/* ── SYSTEM: pinned generalist → depth ─────────────────────── */
function initSystem() {
  const section = document.querySelector("[data-system]");
  const pin = document.querySelector("[data-system-pin]");
  if (!section || !pin) return;

  const phase = pin.querySelector("[data-system-phase]");
  const title = pin.querySelector("[data-system-title]");
  const body = pin.querySelector("[data-system-body]");
  const job = pin.querySelector("[data-job-card]");
  const layers = [...pin.querySelectorAll("[data-depth='layer']")];

  const copy = [
    {
      phase: "01 — Surface read",
      title: "Generalist recruitment<br>sees a job title.",
      body: "A CV. A LinkedIn headline. A role brief written from outside the plant.",
    },
    {
      phase: "02 — Cross-section",
      title: "Zoom into the<br>system underneath.",
      body: "Coating process. Chemistry. Substrate. Equipment. Compliance. Sector. Production context.",
    },
    {
      phase: "03 — Specialist read",
      title: "We see the system<br>behind it.",
      body: "That is why briefs are sharper, shortlists smaller, and hires that last.",
    },
  ];

  function setCopy(i) {
    const c = copy[Math.min(i, copy.length - 1)];
    if (phase) phase.textContent = c.phase;
    if (title) title.innerHTML = c.title;
    if (body) body.textContent = c.body;
  }

  if (reduce) {
    layers.forEach((l) => (l.style.opacity = "1"));
    setCopy(2);
    if (job) job.style.opacity = "0";
    return;
  }

  gsap.set(layers, { opacity: 0, y: 24 });

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=220%",
    pin: pin,
    scrub: 0.6,
    anticipatePin: 1,
    onUpdate(self) {
      const p = self.progress;
      // 0–0.2: job card dominant
      // 0.2–0.75: layers reveal
      // 0.75–1: final copy
      if (p < 0.22) setCopy(0);
      else if (p < 0.72) setCopy(1);
      else setCopy(2);

      if (job) {
        gsap.set(job, {
          opacity: Math.max(0, 1 - p * 2.2),
          scale: 1 - p * 0.15,
          y: -p * 40,
        });
      }

      layers.forEach((layer, i) => {
        const start = 0.18 + i * 0.08;
        const local = gsap.utils.clamp(0, 1, (p - start) / 0.12);
        gsap.set(layer, { opacity: local, y: (1 - local) * 24 });
      });
    },
  });
}

/* ── STACK: scale previous cards as next pins ──────────────── */
function initStack() {
  const cards = [...document.querySelectorAll("[data-stack-card]")];
  if (!cards.length || reduce) return;

  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;

    gsap.fromTo(
      card,
      { scale: 1, filter: "brightness(1)" },
      {
        scale: 0.97 - i * 0.01,
        filter: "brightness(0.94)",
        ease: "none",
        scrollTrigger: {
          trigger: next,
          start: "top 62%",
          end: () => `top ${72 + i * 12}px`,
          scrub: 0.45,
        },
      }
    );
  });

  initStackIllos();
}

/* ── STACK illustrations: GIF-like loops ───────────────────── */
function initStackIllos() {
  if (reduce) return;

  // 01 Process — layers assemble then reset (label rides with each bar)
  const process = document.querySelector('[data-illo="process"]');
  if (process) {
    const bars = [...process.querySelectorAll(".illo-bar")];
    const marks = process.querySelector(".illo-marks");
    const origins = ["210px 300px", "210px 230px", "210px 160px", "210px 100px"];
    gsap.set(bars, (i) => ({ scaleY: 0, transformOrigin: origins[i] }));
    gsap.set(marks, { opacity: 0 });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.45 });
    bars.forEach((bar, i) => {
      tl.to(bar, { scaleY: 1, duration: 0.45, ease: "power2.out" }, i * 0.18);
    });
    tl.to(marks, { opacity: 1, duration: 0.35 }, "-=0.1");
    tl.to({}, { duration: 1.2 });
    tl.to(marks, { opacity: 0, duration: 0.25 });
    tl.to(bars, { scaleY: 0, duration: 0.35, stagger: 0.06, ease: "power2.in" });
  }

  // 02 Network — pulse core + nodes
  const network = document.querySelector('[data-illo="network"]');
  if (network) {
    const core = network.querySelector(".illo-core");
    const ring = network.querySelector(".illo-ring");
    const nodes = [...network.querySelectorAll(".illo-node")];
    const links = network.querySelector(".illo-links");
    gsap.to(core, {
      scale: 1.18,
      transformOrigin: "210px 175px",
      duration: 1.1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    gsap.to(ring, {
      scale: 1.08,
      opacity: 0.45,
      transformOrigin: "210px 175px",
      duration: 1.4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    nodes.forEach((node, i) => {
      gsap.to(node, {
        y: i % 2 === 0 ? -8 : 8,
        duration: 1.6 + i * 0.15,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: i * 0.12,
      });
    });
    if (links) {
      gsap.to(links, {
        opacity: 0.25,
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }

  // 03 Context — SPEC → FIT → GO rise loop (highlighted bars)
  const context = document.querySelector('[data-illo="context"]');
  if (context) {
    const cols = [...context.querySelectorAll(".illo-col")];
    const guides = context.querySelector(".illo-guides");
    gsap.set(cols, { scaleY: 0.15, transformOrigin: "50% 100%", opacity: 0.35 });
    gsap.set(guides, { opacity: 0 });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    cols.forEach((col, i) => {
      tl.to(
        col,
        { scaleY: 1, opacity: 1, duration: 0.55, ease: "power2.out" },
        i * 0.28
      );
    });
    tl.to(guides, { opacity: 0.7, duration: 0.3 }, "-=0.2");
    tl.to({}, { duration: 1.15 });
    tl.to(guides, { opacity: 0, duration: 0.25 });
    tl.to(cols, {
      scaleY: 0.15,
      opacity: 0.35,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.in",
    });
  }

  // 04 Match — path draw + placed pulse
  const match = document.querySelector('[data-illo="match"]');
  if (match) {
    const path = match.querySelector(".illo-path");
    const placed = match.querySelector(".illo-placed");
    const label = match.querySelector(".illo-label");
    if (path) {
      const len = path.getTotalLength?.() || 600;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set([placed, label], { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
      tl.to(path, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" });
      tl.to([placed, label], { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, "-=0.2");
      tl.to(placed, {
        scale: 1.25,
        duration: 0.55,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      });
      tl.to({}, { duration: 0.7 });
      tl.to([placed, label], { opacity: 0, scale: 0.6, duration: 0.3 });
      tl.to(path, { strokeDashoffset: len, duration: 0.5, ease: "power2.in" });
    }
  }
}

/* ── Plant hotspots (legacy removed) ───────────────────────── */
function initPlant() {}

/* ── Defects reveal ────────────────────────────────────────── */
function initDefects() {
  if (reduce) return;
  const rows = [...document.querySelectorAll("[data-defect]")];
  rows.forEach((row, i) => {
    gsap.from(row, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      delay: i * 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 88%" },
    });
  });
}

/* ── Proof (static rail — no pin) ──────────────────────────── */
function initProof() {
  /* Proof is a compact horizontal rail; no scroll pin. */
}

/* ── Pipeline — left copy / right meaningful diagrams ──────── */
function initPipeline() {
  const section = document.querySelector("[data-pipeline]");
  if (!section) return;

  const title = section.querySelector("[data-pipe-title]");
  const copy = section.querySelector("[data-pipe-copy]");
  const index = section.querySelector("[data-pipe-index]");
  const steps = [...section.querySelectorAll("[data-pipe-steps] li")];
  const diagrams = [...section.querySelectorAll("[data-pipe-diagram]")];

  const stages = [
    {
      title: "Discover",
      copy: "A proper technical brief. On-site where it helps. We learn what good looks like for this hire.",
    },
    {
      title: "Understand",
      copy: "Process, chemistry, kit, standards and commercial context — mapped before we search.",
    },
    {
      title: "Search",
      copy: "Market mapped. Shortlist approached personally. No job-board spray. No shared databases.",
    },
    {
      title: "Assess",
      copy: "Two to three you'd hire. Screened technically and commercially.",
    },
    {
      title: "Place",
      copy: "Structured aftercare through onboarding and beyond. We stay accountable after the start date.",
    },
  ];

  let current = -1;

  function setStage(i) {
    if (i === current) return;
    current = i;
    const s = stages[i];
    if (title) title.textContent = s.title;
    if (copy) copy.textContent = s.copy;
    if (index) {
      index.textContent = `${String(i + 1).padStart(2, "0")} / ${String(stages.length).padStart(2, "0")}`;
    }
    steps.forEach((el, idx) => el.classList.toggle("is-on", idx === i));
    diagrams.forEach((el, idx) => el.classList.toggle("is-on", idx === i));
  }

  setStage(0);
  const panels = [...section.querySelectorAll("[data-pipe-panel]")];
  steps.forEach((el, idx) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      const target = panels[idx];
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 8;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      setStage(idx);
    });
  });

  if (reduce) {
    setStage(stages.length - 1);
    return;
  }

  const mobile = window.matchMedia("(max-width: 860px)");
  if (mobile.matches) return;

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.45,
    onUpdate(self) {
      const i = Math.min(
        stages.length - 1,
        Math.floor(self.progress * stages.length)
      );
      setStage(i);
    },
  });
}

/* ── Material library ──────────────────────────────────────── */
function initMaterials() {
  const items = [...document.querySelectorAll("[data-material]")];
  const detail = document.querySelector("[data-material-detail]");
  if (!items.length || !detail) return;

  const copy = [
    {
      tag: "01 · Wet process",
      title: "Electroplating",
      body: "Rack, barrel, decorative and functional plating. Aerospace, defence, automotive, precision engineering.",
    },
    {
      tag: "02 · Aluminium and multi-metal",
      title: "Anodising",
      body: "Sulphuric, chromic, hard and architectural. Chromate, phosphate and passivation for aluminium and multi-metal.",
    },
    {
      tag: "03 · Organic finishing",
      title: "Powder and paint",
      body: "Architectural, industrial and high-performance coatings. Qualicoat, GSB and specialist contract finishers.",
    },
    {
      tag: "04 · Thermal processing",
      title: "Heat treatment",
      body: "Case hardening, carburising, nitriding, vacuum and induction. Commercial and captive in-house facilities.",
    },
    {
      tag: "05 · Advanced coating",
      title: "Thermal spray and deposition",
      body: "HVOF, plasma, arc, flame spray, PVD and CVD. Wear, corrosion and dimensional work for aerospace, energy and oil and gas.",
    },
    {
      tag: "06 · Preparation",
      title: "Blasting and pre-treatment",
      body: "Shot, grit and bead blasting, shot peening, and the chemical pre-treatment lines behind every coating process.",
    },
  ];

  const tag = detail.querySelector("[data-md-tag]");
  const title = detail.querySelector("[data-md-title]");
  const body = detail.querySelector("[data-md-body]");

  function select(i) {
    items.forEach((el, idx) => el.classList.toggle("is-on", idx === i));
    const c = copy[i];
    if (tag) tag.textContent = c.tag;
    if (title) title.textContent = c.title;
    if (body) body.textContent = c.body;
  }

  items.forEach((el) => {
    el.addEventListener("click", () => select(Number(el.dataset.material)));
    el.addEventListener("pointerenter", () => {
      if (!coarse) select(Number(el.dataset.material));
    });
  });
}

/* ── Close specimen float ──────────────────────────────────── */
function initClose() {
  if (reduce) return;
  const specimen = document.querySelector("[data-close-specimen]");
  if (!specimen) return;

  gsap.to(specimen, {
    y: -18,
    duration: 3.2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  gsap.from(specimen, {
    scale: 0.85,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: { trigger: "[data-close]", start: "top 70%" },
  });
}

/* ── Live roles tag ────────────────────────────────────────── */
function initLiveTag() {
  const tag = document.getElementById("live-tag");
  if (!tag) return;
  fetch("/api/jobs")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      const n = Array.isArray(data?.records)
        ? data.records.length
        : Array.isArray(data)
          ? data.length
          : 0;
      if (n > 0) tag.textContent = `${n} live ${n === 1 ? "role" : "roles"}`;
    })
    .catch(() => {});
}

/* ── Years count-up (EMC since 2004) ───────────────────────── */
function initCountUp() {
  const nodes = [...document.querySelectorAll("[data-count-up]")];
  if (!nodes.length) return;

  nodes.forEach((el) => {
    const fromYear = Number(el.getAttribute("data-count-from") || 2004);
    const target = Math.max(0, new Date().getFullYear() - fromYear);
    const valueEl = el.querySelector("[data-count-value]");
    if (!valueEl) return;

    if (reduce) {
      valueEl.textContent = String(target);
      return;
    }

    const state = { n: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter() {
        gsap.to(state, {
          n: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate() {
            valueEl.textContent = String(Math.round(state.n));
          },
        });
      },
    });
  });
}

/* ── Boot ──────────────────────────────────────────────────── */
initLenis();
initNav();
initCursor();
initMagnetic();
initHero();
initSystem();
initStack();
initPlant();
initDefects();
initProof();
initPipeline();
initMaterials();
initClose();
initLiveTag();
initCountUp();
