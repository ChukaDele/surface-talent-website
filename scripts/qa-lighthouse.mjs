/**
 * Lighthouse runner: node scripts/qa-lighthouse.mjs <baseUrl> <outDir> [--runs=3] [--routes=/,/clients] [--mobile-only|--desktop-only]
 * Uses Playwright's Chromium; reports median scores per route/form factor and writes JSON + a summary.
 */
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import { mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
const [,, base = "http://localhost:3500", out = "design-dump/lighthouse"] = process.argv;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split("=")[1] : d; };
const runs = Number(arg("runs", 3)); const routes = arg("routes", "/,/clients,/candidates,/contact").split(",");
const forms = process.argv.includes("--mobile-only") ? ["mobile"] : process.argv.includes("--desktop-only") ? ["desktop"] : ["desktop", "mobile"];
mkdirSync(out, { recursive: true });
const chromePath = execSync("node -e \"console.log(require('@playwright/test').chromium.executablePath())\"").toString().trim();
const chrome = await launch({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"] });
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const summary = [];
for (const route of routes) for (const form of forms) {
  const scores = { performance: [], accessibility: [], "best-practices": [], seo: [] }; const cwv = [];
  for (let i = 0; i < runs; i++) {
    // desktop uses Lighthouse's own desktop preset (desktop throttling + 1350×940); mobile uses the default mobile preset
    const flags = { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] };
    const r = form === "desktop" ? await lighthouse(base + route, flags, desktopConfig) : await lighthouse(base + route, flags);
    const lhr = r.lhr;
    for (const k of Object.keys(scores)) scores[k].push(Math.round((lhr.categories[k]?.score ?? 0) * 100));
    cwv.push({ lcp: lhr.audits["largest-contentful-paint"].numericValue, cls: lhr.audits["cumulative-layout-shift"].numericValue, tbt: lhr.audits["total-blocking-time"].numericValue, si: lhr.audits["speed-index"].numericValue, fcp: lhr.audits["first-contentful-paint"].numericValue });
    if (i === runs - 1) writeFileSync(`${out}/${route.replace(/\//g, "") || "home"}-${form}.json`, r.report);
  }
  const row = { route, form, perf: median(scores.performance), a11y: median(scores.accessibility), bp: median(scores["best-practices"]), seo: median(scores.seo), perfRuns: scores.performance, lcp: Math.round(median(cwv.map((c) => c.lcp))), cls: +median(cwv.map((c) => c.cls)).toFixed(3), tbt: Math.round(median(cwv.map((c) => c.tbt))), si: Math.round(median(cwv.map((c) => c.si))) };
  summary.push(row); console.log(JSON.stringify(row));
}
writeFileSync(`${out}/summary.json`, JSON.stringify(summary, null, 2));
await chrome.kill();
