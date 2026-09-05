/** Hover/focus evidence for any card selector: node scripts/qa-hover-state.mjs <base> <route> <selector> <index> <outPng> */
import { chromium } from "@playwright/test";
const [,, base, route, selector, idx = "0", out = "design-dump/hover.png"] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base + route, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready);
const card = p.locator(selector).nth(Number(idx));
await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
const bg = () => card.evaluate((el) => getComputedStyle(el).backgroundColor);
console.log("before", await bg());
await card.hover(); await p.waitForTimeout(600); console.log("hover", await bg());
await p.screenshot({ path: out });
await p.mouse.move(5, 5); await p.waitForTimeout(600); console.log("after", await bg());
await p.keyboard.press("Tab"); await card.focus(); await p.waitForTimeout(500); console.log("focus(programmatic)", await bg());
await b.close();
