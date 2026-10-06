/** Console audit: loads the page, scrolls to the bottom and back, and reports console errors/warnings (excluding 404 resource noise, which is reported separately). */
import { chromium } from "@playwright/test";
const [,, base = "http://localhost:3501"] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const msgs = []; const failed = [];
p.on("console", (m) => { if (["error", "warning"].includes(m.type())) msgs.push(`${m.type()}: ${m.text()}`); });
p.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
p.on("pageerror", (e) => msgs.push(`pageerror: ${e.message}`));
await p.goto(base, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
const total = await p.evaluate(() => document.body.scrollHeight - innerHeight);
for (let y = 0; y <= total; y += 120) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(25); }
for (let y = total; y >= 0; y -= 120) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(25); }
await p.waitForTimeout(500);
console.log("console messages:", msgs.length); msgs.forEach((m) => console.log(" ", m.slice(0, 300)));
console.log("failed requests:", failed.length); failed.forEach((m) => console.log(" ", m));
await b.close();
