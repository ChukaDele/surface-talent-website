/** Testimonial hover/focus evidence: hovers the middle card and screenshots the active state, then checks release. */
import { chromium } from "@playwright/test";
const [,, base = "http://localhost:3501", out = "design-dump/after-1440"] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready);
const card = p.locator("[data-testimonial]").nth(1);
await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
const bg = (el) => getComputedStyle(el).backgroundColor;
console.log("before", await card.evaluate(bg));
await card.hover(); await p.waitForTimeout(500);
console.log("hover", await card.evaluate(bg));
await p.screenshot({ path: `${out}/07-clients-hover.png` });
await p.mouse.move(10, 10); await p.waitForTimeout(500);
console.log("after", await card.evaluate(bg));
await p.keyboard.press("Tab"); await card.focus(); await p.waitForTimeout(500);
console.log("focus", await card.evaluate(bg));
await b.close();
