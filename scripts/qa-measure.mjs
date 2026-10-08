import { chromium } from "@playwright/test";
const [,, base = "http://localhost:3501", vw = "1440", vh = "900"] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +vw, height: +vh } });
await p.goto(base, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const pins = [...document.querySelectorAll(".pin-spacer")].map(s => { const el = s.firstElementChild; return { cls: el.className.split(" ")[0], pinH: Math.round(el.getBoundingClientRect().height), spacerH: Math.round(s.getBoundingClientRect().height), runway: Math.round(s.getBoundingClientRect().height - window.innerHeight) }; });
  const f = document.querySelector(".st-footer"); const cs = getComputedStyle(f);
  const why = document.querySelector(".st-why__pin"); const head = document.querySelector("[data-why-head]"); const box = document.querySelector("[data-why-stagebox]");
  return { pins, footer: { h: Math.round(f.getBoundingClientRect().height), scrollH: f.scrollHeight, clientH: f.clientHeight, overflowY: cs.overflowY }, why: { pinH: why.offsetHeight, headH: head.offsetHeight, boxH: box.offsetHeight, boxW: box.offsetWidth }, docH: document.body.scrollHeight, overflowX: document.documentElement.scrollWidth > window.innerWidth };
});
console.log(JSON.stringify(r, null, 1)); await b.close();
