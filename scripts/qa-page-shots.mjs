/**
 * Route QA capture: screenshots a route at a viewport, every viewport-height of scroll (after
 * letting pinned scenes settle), plus a full-page capture. Usage:
 *   node scripts/qa-page-shots.mjs <baseUrl> <route> <outDir> [--vw=1440] [--vh=900] [--reduced]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const [,, base = "http://localhost:3400", route = "/", out = "design-dump/qa-route"] = process.argv;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? Number(a.split("=")[1]) : d; };
const VW = arg("vw", 1440), VH = arg("vh", 900), reduced = process.argv.includes("--reduced");
mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1, reducedMotion: reduced ? "reduce" : "no-preference" });
const errors = []; page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); }); page.on("pageerror", (e) => errors.push("pageerror " + e.message));
await page.goto(base + route, { waitUntil: "load" }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const slug = route.replace(/\//g, "") || "home";
let i = 0;
for (let y = 0; y < total; y += Math.round(VH * 0.75)) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(450);
  await page.screenshot({ path: `${out}/${slug}-${String(i++).padStart(2, "0")}-y${y}.png` });
}
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/${slug}-full.png`, fullPage: true });
const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
console.log(JSON.stringify({ route, VW, VH, total, shots: i, overflowX, errors: errors.filter((e) => !/404/.test(e)) }));
await b.close();
