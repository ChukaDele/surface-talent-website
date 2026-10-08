/**
 * Lighthouse runner: node scripts/qa-lighthouse.mjs <baseUrl> <outDir> [--runs=3] [--routes=/,/clients] [--mobile-only|--desktop-only]
 * Uses Playwright's Chromium; reports median scores per route/form factor and writes JSON + a summary.
 */
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
const [,, base, out = "design-dump/lighthouse"] = process.argv;
if (!base || new URL(base).protocol !== "https:") throw new Error("Supply the remote HTTPS website URL.");
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split("=")[1] : d; };
const runs = Number(arg("runs", 3)); const routes = arg("routes", "/,/clients,/candidates,/contact").split(",");
const forms = process.argv.includes("--mobile-only") ? ["mobile"] : process.argv.includes("--desktop-only") ? ["desktop"] : ["desktop", "mobile"];
if (existsSync(`${out}/summary.json`)) throw new Error("Use a new output directory to preserve previous reports.");
mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME_PATH || execSync("node -e \"console.log(require('@playwright/test').chromium.executablePath())\"").toString().trim();
const chrome = await launch({ chromePath, chromeFlags: ["--headless=new"] });
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const summary = [];
try {
for (const route of routes) for (const form of forms) {
  const scores = { performance: [], accessibility: [], "best-practices": [], seo: [], "agentic-browsing": [] }; const cwv = [];
  for (let i = 0; i < runs; i++) {
    // desktop uses Lighthouse's own desktop preset (desktop throttling + 1350×940); mobile uses the default mobile preset
    const flags = { port: chrome.port, output: ["json", "html"], logLevel: "error" };
    const r = form === "desktop" ? await lighthouse(base + route, flags, desktopConfig) : await lighthouse(base + route, flags);
    const lhr = r.lhr;
    for (const k of Object.keys(scores)) scores[k].push(Math.round((lhr.categories[k]?.score ?? 0) * 100));
    cwv.push({ lcp: lhr.audits["largest-contentful-paint"].numericValue, cls: lhr.audits["cumulative-layout-shift"].numericValue, tbt: lhr.audits["total-blocking-time"].numericValue, si: lhr.audits["speed-index"].numericValue, fcp: lhr.audits["first-contentful-paint"].numericValue });
    const reportName = `${out}/${route.replace(/\//g, "-").replace(/^-/, "") || "home"}-${form}-run-${i + 1}`;
    if (existsSync(`${reportName}.json`) || existsSync(`${reportName}.html`)) throw new Error("Refusing to overwrite a retained report.");
    writeFileSync(`${reportName}.json`, r.report[0]);
    writeFileSync(`${reportName}.html`, r.report[1]);
  }
  const row = { route, form, perf: median(scores.performance), a11y: median(scores.accessibility), bp: median(scores["best-practices"]), seo: median(scores.seo), agentic: median(scores["agentic-browsing"]), scoreRuns: scores, perfRuns: scores.performance, lcp: Math.round(median(cwv.map((c) => c.lcp))), cls: +median(cwv.map((c) => c.cls)).toFixed(3), tbt: Math.round(median(cwv.map((c) => c.tbt))), si: Math.round(median(cwv.map((c) => c.si))) };
  summary.push(row); writeFileSync(`${out}/summary.json`, JSON.stringify(summary, null, 2)); console.log(JSON.stringify(row));
}
writeFileSync(`${out}/summary.json`, JSON.stringify(summary, null, 2));
} finally { await chrome.kill(); }
