/**
 * Renders the homepage hero loop from the Three.js specimen scene, frame by frame, then encodes
 * WebM (VP9) + MP4 (H.264) + poster. Deterministic: the page exposes __heroSeek(t).
 * Usage: node scripts/hero-loop-render.mjs [devBase] [fps]   (dev server must be running)
 */
import { chromium } from "@playwright/test";
import { execSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import sharp from "sharp";
const [,, base = "http://localhost:3400", fpsArg = "30"] = process.argv;
const FPS = Number(fpsArg), T = 8, N = FPS * T;
const frames = "design-dump/hero-loop/frames"; rmSync("design-dump/hero-loop", { recursive: true, force: true }); mkdirSync(frames, { recursive: true });
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await b.newPage({ viewport: { width: 402, height: 542 }, deviceScaleFactor: 2 });
await page.goto(base + "/hero-loop", { waitUntil: "load" });
await page.waitForFunction(() => window.__heroReady === true, null, { timeout: 60000 });
await page.evaluate(() => document.fonts.ready); await page.addStyleTag({ content: "nextjs-portal, [data-nextjs-toast], #__next-build-watcher { display: none !important; }" }); await page.waitForTimeout(500);
const clip = { x: 0, y: 0, width: 401, height: 542 };
for (let f = 0; f < N; f++) {
  await page.evaluate((t) => window.__heroSeek(t), f / FPS);
  await page.screenshot({ path: `${frames}/f${String(f).padStart(4, "0")}.png`, clip, omitBackground: false });
  if (f % 60 === 0) console.log("frame", f, "/", N);
}
await b.close();
const out = "public/assets/media"; mkdirSync(out, { recursive: true });
// 802×1084 (2× the slot). yuv420p needs even dimensions → scale to 802:1084.
const vf = "scale=802:1084:flags=lanczos";
execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${frames}/f%04d.png -vf "${vf}" -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -pix_fmt yuv420p -an ${out}/hero-loop.webm`);
execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${frames}/f%04d.png -vf "${vf}" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -an ${out}/hero-loop.mp4`);
await sharp(`${frames}/f0000.png`).resize(802, 1084).webp({ quality: 82 }).toFile(`${out}/hero-poster.webp`);
await sharp(`${frames}/f0000.png`).resize(802, 1084).jpeg({ quality: 82 }).toFile(`${out}/hero-poster.jpg`);
// contact sheet: first / quarter / half / three-quarter / last frame
const picks = [0, Math.round(N / 4), Math.round(N / 2), Math.round((3 * N) / 4), N - 1];
const tiles = await Promise.all(picks.map((i) => sharp(`${frames}/f${String(i).padStart(4, "0")}.png`).resize(401, 542).toBuffer()));
await sharp({ create: { width: 401 * 5 + 40, height: 542, channels: 3, background: "#0d2233" } }).composite(tiles.map((input, i) => ({ input, left: i * 411, top: 0 }))).png().toFile("design-dump/hero-loop/contact-sheet.png");
writeFileSync("design-dump/hero-loop/frames.json", JSON.stringify({ fps: FPS, seconds: T, frames: N, picks }));
console.log(execSync(`ls -la ${out}`).toString());
