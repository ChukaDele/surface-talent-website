/** Motion evidence for a route: slow scroll down and back up, recorded as WebM. node scripts/qa-route-video.mjs <base> <route> <outDir> [--hover=<selector>] */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const [,, base, route = "/", out = "design-dump/qa-video-route"] = process.argv;
const hover = process.argv.find((a) => a.startsWith("--hover="))?.split("=")[1];
mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } } });
const page = await ctx.newPage(); await page.goto(base + route, { waitUntil: "load" }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1200);
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (let y = 0; y <= total; y += 24) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(16); }
await page.waitForTimeout(600);
for (let y = total; y >= 0; y -= 36) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(12); }
if (hover) { const cards = page.locator(hover); const n = Math.min(await cards.count(), 4); for (let i = 0; i < n; i++) { await cards.nth(i).scrollIntoViewIfNeeded(); await cards.nth(i).hover(); await page.waitForTimeout(700); } await page.mouse.move(5, 5); await page.waitForTimeout(600); }
const v = page.video(); await ctx.close(); const slug = route.replace(/\//g, "") || "home"; await v?.saveAs(`${out}/${slug}-motion.webm`); await b.close(); console.log("saved", `${out}/${slug}-motion.webm`);
