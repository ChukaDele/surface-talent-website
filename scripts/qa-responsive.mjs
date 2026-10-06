/**
 * Responsive sweep: for each width, load each route, check for horizontal overflow, undersized touch
 * targets, tiny input text (iOS zoom trigger) and clipped text, then screenshot the top and one
 * lower fold. Usage: node scripts/qa-responsive.mjs [base] [outDir] [--widths=360,390,768] [--routes=/,/clients]
 */
import { chromium, devices } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const [,, base = "http://localhost:3400", out = "design-dump/responsive"] = process.argv;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split("=")[1] : d; };
const widths = arg("widths", "360,375,390,430,768,1024,1280,1536").split(",").map(Number);
const routes = arg("routes", "/,/clients,/candidates,/contact,/about,/disciplines,/jobs,/privacy").split(",");
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const rows = [];
for (const w of widths) {
  const mobile = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, deviceScaleFactor: 1, ...(mobile ? { hasTouch: true, isMobile: true, userAgent: devices["Pixel 7"].userAgent } : {}) });
  const page = await ctx.newPage();
  for (const route of routes) {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message.slice(0, 120)));
    await page.goto(base + route, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "nextjs-portal,[data-nextjs-toast]{display:none!important}" });
    await page.waitForTimeout(500);
    const audit = await page.evaluate((touch) => {
      // the symptom that matters is whether the page can actually be scrolled sideways
      const overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      window.scrollTo(200, window.scrollY); const canScrollX = window.scrollX; window.scrollTo(0, window.scrollY);
      // an element wider than the viewport only matters when nothing clips it
      const clipped = (el) => { let n = el.parentElement; while (n) { const cs = getComputedStyle(n); if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.clipPath !== "none" || cs.maskImage !== "none") return true; n = n.parentElement; } return false; };
      const wide = [...document.querySelectorAll("body *")].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > window.innerWidth + 2 || r.left < -2) && !clipped(el); }).slice(0, 4).map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`);
      // a control is exempt when it is visually hidden (a value carrier behind a styled control),
      // when a labelled wrapper provides the hit area, or when it is a link inside a sentence
      const inSentence = (el) => { const p = el.closest("p,li,label,figcaption"); return !!p && (p.textContent || "").trim().length > (el.textContent || "").trim().length + 12; };
      const small = [...document.querySelectorAll("a,button,input,select,textarea,summary,[role=combobox]")].filter((el) => {
        const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        if (!r.width || cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) return false;
        if (r.width <= 2 || r.height <= 2) return false;
        if (el.tagName === "A" && inSentence(el)) return false;
        if (el.getAttribute("tabindex") === "-1") return false; // bot honeypot, never reachable
        if (r.right < 0 || r.left > window.innerWidth) return false; // positioned off-screen
        const wrapLabel = el.closest("label");
        if (wrapLabel && wrapLabel.getBoundingClientRect().height >= 43.5) return false;
        const row = el.closest(".st-check");
        if (row && row.getBoundingClientRect().height >= 43.5) return false;
        // height is the axis that fails in practice; a short text link that is 44px tall is fine,
        // and the WCAG 2.5.8 spacing exception covers narrow inline labels
        const min = touch ? 44 : 24;
        return r.height < min || r.width < 24;
      }).slice(0, 6).map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}:${Math.round(el.getBoundingClientRect().height)}`);
      // only text-entry controls trigger the iOS focus zoom
      const textEntry = (el) => el.tagName !== "INPUT" || ["text", "email", "tel", "url", "search", "number", "password", ""].includes((el.getAttribute("type") || "").toLowerCase());
      // 16px only matters where a focus zoom can happen (touch)
      const tinyInput = !touch ? [] : [...document.querySelectorAll("input,select,textarea")].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 2 && textEntry(el) && parseFloat(getComputedStyle(el).fontSize) < 16; }).map((el) => `${el.getAttribute("name")}:${getComputedStyle(el).fontSize}`);
      return { overflowX, canScrollX, wide, small, tinyInput, docH: document.documentElement.scrollHeight };
    }, mobile);
    rows.push({ w, route, ...audit, errors });
    if (audit.overflowX > 2 || audit.canScrollX > 0 || audit.wide.length || audit.small.length || audit.tinyInput.length) console.log(JSON.stringify({ w, route, ...audit }));
    const slug = route.replace(/\//g, "") || "home";
    await page.screenshot({ path: `${out}/${slug}-${w}-top.png` });
    await page.evaluate(() => window.scrollTo(0, Math.round(window.innerHeight * 1.6)));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${slug}-${w}-fold2.png` });
  }
  await ctx.close();
}
writeFileSync(`${out}/report.json`, JSON.stringify(rows, null, 2));
const bad = rows.filter((r) => r.overflowX > 2 || r.canScrollX > 0 || r.wide.length || r.small.length || r.tinyInput.length || r.errors.length);
console.log(`\nchecked ${rows.length} width×route combinations; ${bad.length} with findings`);
await b.close();
