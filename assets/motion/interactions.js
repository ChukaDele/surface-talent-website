/* Surface Talent — interaction layer
   Magnetic CTAs, custom cursor, antigravity floaters, word reveals.
   ─────────────────────────────────────────────────────────── */

import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.7/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);

export function initCursor(reduceMotion) {
  if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;

  const cursor = document.createElement("div");
  cursor.className = "st-cursor";
  cursor.innerHTML = `<span class="st-cursor__dot"></span><span class="st-cursor__ring"></span>`;
  document.body.appendChild(cursor);
  document.body.classList.add("has-st-cursor");

  const dot = cursor.querySelector(".st-cursor__dot");
  const ring = cursor.querySelector(".st-cursor__ring");
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };

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
    ringPos.x += (pos.x - ringPos.x) * 0.18;
    ringPos.y += (pos.y - ringPos.y) * 0.18;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  });

  document.querySelectorAll("a, button, .btn, [data-magnetic]").forEach((el) => {
    el.addEventListener("pointerenter", () => cursor.classList.add("is-hot"));
    el.addEventListener("pointerleave", () => cursor.classList.remove("is-hot"));
  });
}

export function initMagneticButtons(reduceMotion) {
  if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const strength = Number(btn.getAttribute("data-magnetic") || 18);

    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(btn, {
        x: (x / r.width) * strength,
        y: (y / r.height) * strength,
        duration: 0.35,
        ease: "power3.out",
      });
    });

    btn.addEventListener("pointerleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.45)" });
    });

    btn.addEventListener("pointerdown", () => {
      gsap.to(btn, { scale: 0.97, duration: 0.12 });
    });
    btn.addEventListener("pointerup", () => {
      gsap.to(btn, { scale: 1, duration: 0.25, ease: "power2.out" });
    });
  });
}

export function initAntigravityFloat(reduceMotion) {
  const nodes = [...document.querySelectorAll("[data-float]")];
  if (!nodes.length || reduceMotion) return;

  nodes.forEach((el, i) => {
    const amp = Number(el.getAttribute("data-float") || 12);
    gsap.to(el, {
      y: `-=${amp}`,
      duration: 2.4 + (i % 4) * 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: i * 0.12,
    });
    gsap.to(el, {
      rotation: i % 2 === 0 ? 3 : -3,
      duration: 3.2 + (i % 3) * 0.4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  });
}

export function initTextSplits(reduceMotion) {
  const titles = document.querySelectorAll("[data-split]");
  if (!titles.length || reduceMotion) return;

  titles.forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text
      .split(" ")
      .map((word) => `<span class="split-word"><span>${word}</span></span>`)
      .join(" ");

    gsap.from(el.querySelectorAll(".split-word > span"), {
      yPercent: 110,
      duration: 1.05,
      ease: "power4.out",
      stagger: 0.055,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    });
  });
}
