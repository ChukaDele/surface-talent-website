/**
 * Visual-QA capture: renders the homepage at the Figma reference viewport (1440 wide) and saves
 * screenshots per section plus scroll-progress frames for the pinned scenes.
 * Usage: node scripts/qa-shots.mjs [baseUrl] [outDir] [--full] [--vw=1440] [--vh=900] [--reduced]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:3400";
const out = process.argv[3] || "design-dump/qa";
const full = process.argv.includes("--full");
const vwArg = process.argv.find((a) => a.startsWith("--vw="));
const VW = vwArg ? Number(vwArg.split("=")[1]) : 1440;
const vhArg = process.argv.find((a) => a.startsWith("--vh="));
const VH = vhArg ? Number(vhArg.split("=")[1]) : VW < 700 ? 844 : 900;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const reduced = process.argv.includes("--reduced");
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1, reducedMotion: reduced ? "reduce" : "no-preference" });
await page.goto(base, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

const tops = await page.evaluate(() => {
  const q = (s) => document.querySelector(s);
  const top = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);
  return {
    hero: 0,
    system: top(q("[data-scene='system']")),
    systemEnd: top(q("[data-scene='system']")) + q("[data-scene='system']").offsetHeight,
    why: top(q("[data-scene='why']")),
    whyEnd: top(q("[data-scene='why']")) + q("[data-scene='why']").offsetHeight,
    dna: top(q("[data-scene='dna']")),
    floor: top(q("[data-scene='floor']")),
    floorEnd: top(q("[data-scene='floor']")) + q("[data-scene='floor']").offsetHeight,
    problem: top(q("[data-scene='problem']")),
    problemEnd: top(q("[data-scene='problem']")) + q("[data-scene='problem']").offsetHeight,
    clients: top(q(".st-clients")),
    how: top(q("[data-scene='how']")),
    howEnd: top(q("[data-scene='how']")) + q("[data-scene='how']").offsetHeight,
    disc: top(q(".st-disc")),
    fn: top(q(".st-fn")),
    stake: top(q("[data-scene='stake']")),
    stakeEnd: top(q("[data-scene='stake']")) + q("[data-scene='stake']").offsetHeight,
    footer: top(q(".st-footer")),
    height: document.body.scrollHeight,
  };
});
console.log(JSON.stringify(tops));

async function shot(name, y) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log("shot", name, y);
}

await shot("00-hero", 0);
await shot("00-hero-dissolve-50", 410);
await shot("01-system-p00", tops.system);
const sysRun = tops.systemEnd - tops.system - 900;
for (const p of [0.15, 0.3, 0.42, 0.55, 0.7, 0.85, 1]) await shot(`01-system-p${String(Math.round(p * 100)).padStart(2, "0")}`, Math.round(tops.system + sysRun * p));
await shot("04-why-top", tops.why);
const whyRun = tops.whyEnd - tops.why - 900;
for (const p of [0.25, 0.5, 0.75, 1]) await shot(`04-why-p${Math.round(p * 100)}`, Math.round(tops.why + whyRun * p));
await shot("05-dna-top", tops.dna);
await shot("05-dna-years", tops.dna + 400);
await shot("05-dna-pillars", tops.dna + 900);
const floorRun = tops.floorEnd - tops.floor - 900;
for (const p of [0, 0.5, 1]) await shot(`05-floor-p${Math.round(p * 100)}`, Math.round(tops.floor + floorRun * p));
const probRun = tops.problemEnd - tops.problem - 900;
for (const p of [0, 0.3, 0.6, 1]) await shot(`06-problem-p${Math.round(p * 100)}`, Math.round(tops.problem + probRun * p));
await shot("07-clients", tops.clients);
const howRun = tops.howEnd - tops.how - 900;
for (const p of [0, 0.25, 0.5, 0.75, 1]) await shot(`08-how-p${Math.round(p * 100)}`, Math.round(tops.how + howRun * p));
await shot("09-disc", tops.disc);
await shot("09-disc-2", tops.disc + 700);
await shot("10-fn", tops.fn);
const stakeRun = tops.stakeEnd - tops.stake - 900;
for (const p of [0, 0.5, 1]) await shot(`11-stake-p${Math.round(p * 100)}`, Math.round(tops.stake + stakeRun * p));
await shot("12-footer", tops.footer);
await shot("12-footer-2", tops.footer + 700);
if (full) { await page.screenshot({ path: `${out}/full.png`, fullPage: true }); }
await browser.close();
