import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.RELEASE_BASE_URL;
if (!baseURL) throw new Error("Set RELEASE_BASE_URL to the verified Cloudflare preview or production URL.");
const target = new URL(baseURL);
if (target.protocol !== "https:" || !(/\.(workers|pages)\.dev$/.test(target.hostname) || ["surfacetalent.co.uk", "www.surfacetalent.co.uk"].includes(target.hostname))) {
  throw new Error("Release QA requires the Cloudflare preview or existing production domain.");
}
const production = process.env.RELEASE_ENV === "production";

export default defineConfig({
  testDir: "./e2e",
  // site.spec.ts uses a local Apps Script double and writes submissions. Keep it isolated.
  testMatch: production
    ? ["homepage.spec.ts", "regressions.spec.ts", "release.spec.ts", "validate.spec.ts"]
    : ["homepage.spec.ts", "regressions.spec.ts", "release.spec.ts", "validate.spec.ts", "launch.spec.ts"],
  grepInvert: /hero design lab|Hero H preview|A2 comparison|Hero H uses|Hero H reduced motion|Hero H completes/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"], ["json", { outputFile: "test-results/release-results.json" }]],
  use: { baseURL, channel: process.env.RELEASE_BROWSER_CHANNEL === "chrome" ? "chrome" : undefined, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "short-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
    { name: "reduced-motion", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: "reduce" } } },
  ],
});
