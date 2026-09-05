/**
 * Scroll-performance probe: scrolls the homepage at a steady pace while sampling
 * requestAnimationFrame deltas, then reports frame-time distribution and long tasks.
 * Usage: node scripts/qa-perf.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
const base = process.argv[2] || "http://localhost:3400";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const result = await page.evaluate(async () => {
  const deltas = [];
  const longTasks = [];
  const po = new PerformanceObserver((list) => list.getEntries().forEach((e) => longTasks.push(Math.round(e.duration))));
  try { po.observe({ type: "longtask", buffered: true }); } catch {}
  let last = performance.now();
  let running = true;
  const loop = (t) => { deltas.push(t - last); last = t; if (running) requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  const total = document.body.scrollHeight - innerHeight;
  const start = performance.now();
  const duration = 24000; // ~24s for the whole page ≈ a deliberate read
  await new Promise((res) => {
    const step = () => { const p = Math.min(1, (performance.now() - start) / duration); window.scrollTo(0, total * p); if (p < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
  running = false;
  po.disconnect();
  const d = deltas.slice(5).sort((a, b) => a - b);
  const pct = (q) => d[Math.floor(d.length * q)];
  return { frames: d.length, p50: pct(0.5).toFixed(1), p95: pct(0.95).toFixed(1), p99: pct(0.99).toFixed(1), max: d[d.length - 1].toFixed(1), over33ms: d.filter((x) => x > 33).length, longTasks: longTasks.length, longTaskMax: Math.max(0, ...longTasks) };
});
console.log(JSON.stringify(result));
await browser.close();
