/**
 * Captures each hero variant at several points in its idle loop, plus a pointer-parallax frame and a
 * scroll-handoff frame, and records JS transfer size and frame timing for the comparison.
 * Usage: node scripts/qa-hero-variants.mjs [base] [outDir]
 */
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const [,, base = "http://localhost:3400", out = "design-dump/hero-variants"] = process.argv;
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const report = [];
for (const v of ["a", "b", "c"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  let js = 0, media = 0;
  const errors = [];
  page.on("response", async (r) => {
    const t = r.request().resourceType();
    try { const len = Number((await r.allHeaders())["content-length"] || 0); if (t === "script") js += len; if (t === "media" || t === "image") media += len; } catch {}
  });
  page.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) errors.push(m.text().slice(0, 160)); });
  page.on("pageerror", (e) => errors.push("pageerror " + e.message.slice(0, 160)));
  await page.goto(`${base}/design-lab/hero/${v}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "nextjs-portal,[data-nextjs-toast]{display:none!important}" });
  await page.waitForFunction(() => !!document.querySelector("canvas"), null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const clip = { x: 0, y: 0, width: 1440, height: 900 };
  for (const [name, wait] of [["idle-0", 0], ["idle-1", 3000], ["idle-2", 3000], ["idle-3", 3500]]) {
    if (wait) await page.waitForTimeout(wait);
    await page.screenshot({ path: `${out}/hero-${v}-${name}.png`, clip });
  }
  // pointer parallax
  await page.mouse.move(1200, 300); await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/hero-${v}-pointer.png`, clip });
  // frame timing over 3s of animation
  const fps = await page.evaluate(() => new Promise((res) => {
    let n = 0; const t0 = performance.now();
    const tick = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(tick); else res(Math.round((n / (performance.now() - t0)) * 1000)); };
    requestAnimationFrame(tick);
  }));
  // scroll handoff
  await page.evaluate(() => window.scrollTo(0, Math.round(window.innerHeight * 0.55))); await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/hero-${v}-handoff.png`, clip });
  const canvasBg = await page.evaluate(() => { const c = document.querySelector("canvas"); return c ? getComputedStyle(c).backgroundColor : "none"; });
  report.push({ variant: v, jsKB: Math.round(js / 1024), mediaKB: Math.round(media / 1024), fps, canvasBg, errors });
  console.log(JSON.stringify(report.at(-1)));
  await ctx.close();
}
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
await b.close();
