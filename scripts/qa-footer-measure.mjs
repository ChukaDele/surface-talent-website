import { chromium } from "@playwright/test";
const [,, base = "http://localhost:3501", vw = "1440", vh = "900"] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +vw, height: +vh } });
await p.goto(base, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
console.log(JSON.stringify(await p.evaluate(() => {
  const f = document.querySelector(".st-footer");
  const walk = (el, d) => [...el.children].flatMap(c => { const r = c.getBoundingClientRect(); const cs = getComputedStyle(c); return [{ d, cls: c.className.toString().split(" ")[0], h: Math.round(r.height), pt: cs.paddingTop, pb: cs.paddingBottom, mt: cs.marginTop, gap: cs.rowGap }, ...(d < 2 ? walk(c, d + 1) : [])]; });
  return walk(f, 0);
})));
await b.close();
