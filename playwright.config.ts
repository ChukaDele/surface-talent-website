import { defineConfig, devices } from "@playwright/test";

const PORT = 3500;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  webServer: {
    // staging-like env: noindex headers on, form pipeline pointed at the local Apps Script test double (e2e/site.spec.ts)
    command: `SITE_ENV=staging APPS_SCRIPT_URL=http://127.0.0.1:3599/exec SUBMISSION_SECRET=test-secret npm run start -- --port ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "short-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 640 } } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    {
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: "reduce" } },
    },
  ],
});
