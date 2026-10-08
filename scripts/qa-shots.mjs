/** Capture the October 2026 homepage from a remote deployment. */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv[2];
if (!base) throw new Error("Provide the verified HTTPS Cloudflare preview or production URL.");
const target = new URL(base);
if (target.protocol !== "https:" || !(/\.(workers|pages)\.dev$/.test(target.hostname) || ["surfacetalent.co.uk", "www.surfacetalent.co.uk"].includes(target.hostname))) throw new Error("Remote release URL required.");
const out = process.argv[3] || "design-dump/qa";
const numberArg = (key, fallback) => Number(process.argv.find((value) => value.startsWith(`${key}=`))?.split("=")[1] || fallback);
const width = numberArg("--vw", 1440);
const height = numberArg("--vh", width < 700 ? 844 : 900);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: process.argv.includes("--reduced") ? "reduce" : "no-preference" });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const sections = [".st-phero", ".st-whyfail", ".st-dna", ".st-place", ".st-process", ".st-clients", ".st-footer"];
  for (const [index, selector] of sections.entries()) {
    const section = page.locator(selector);
    if (await section.count() !== 1) throw new Error(`Expected one ${selector}`);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await section.screenshot({ path: `${out}/${String(index).padStart(2, "0")}-${selector.slice(4)}.png` });
  }
  if (process.argv.includes("--full")) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/full.png`, fullPage: true });
  }
  console.log(JSON.stringify({ base, width, height, out, sections: sections.length }));
} finally {
  await browser.close();
}
