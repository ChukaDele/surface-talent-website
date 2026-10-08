/**
 * Motion evidence: records a slow scroll through the homepage (and the LinkedIn click impulse)
 * as WebM video plus a contact sheet of frames for the pinned scenes.
 * Usage: node scripts/qa-video.mjs [baseUrl] [outDir] [--reduced]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3400";
const out = process.argv[3] || "design-dump/qa-video";
const reduced = process.argv.includes("--reduced");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } }, reducedMotion: reduced ? "reduce" : "no-preference" });
const page = await context.newPage();
await page.goto(base, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2500); // hero loop
const total = await page.evaluate(() => document.body.scrollHeight - innerHeight);
// slow scroll down in steps of 40px per ~16ms ≈ 2400 px/s… use 30px steps at 20ms for a readable pace
for (let y = 0; y <= total; y += 30) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(18); }
await page.waitForTimeout(1200);
// scroll back up fast to prove reversal, then down to the DNA section for the LinkedIn impulse
for (let y = total; y >= 0; y -= 120) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(12); }
await page.waitForTimeout(600);
const dna = await page.evaluate(() => { const el = document.querySelector("[data-scene='dna']"); return el.getBoundingClientRect().top + scrollY; });
await page.evaluate((yy) => window.scrollTo(0, yy), dna - 60);
await page.waitForTimeout(2600);
const link = page.locator("[data-linkedin]");
for (let i = 0; i < 3; i++) { await link.dispatchEvent("pointerdown", { clientX: 900, clientY: 300 }); await page.waitForTimeout(700); }
await page.waitForTimeout(2500);
const video = page.video();
await context.close();
if (video) await video.saveAs(`${out}/homepage-motion${reduced ? "-reduced" : ""}.webm`);
await browser.close();
console.log("video saved in", out);
