import { expect, test } from "@playwright/test";

const routes = ["/", "/about", "/clients", "/candidates", "/disciplines", "/disciplines/electroplating", "/jobs", "/contact", "/terms"];

test("public pages render without overflow, broken assets or runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/submit", async (route) => {
    errors.push("Release QA attempted a form submission");
    await route.abort();
  });
  for (const path of routes) {
    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status(), path).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    const geometry = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      broken: [...document.images].filter((image) => image.complete && !image.naturalWidth).map((image) => image.getAttribute("src")),
    }));
    expect(geometry.overflow, path).toBeLessThanOrEqual(1);
    expect(geometry.broken, path).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("mobile navigation opens and returns to normal page scrolling", async ({ page }, testInfo) => {
  test.skip(!["mobile", "tablet"].includes(testInfo.project.name));
  await page.goto("/about");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.getByRole("button", { name: "Close", exact: true })).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Clients", exact: true }).click();
  await expect(page).toHaveURL(/\/clients$/);
  await expect(page.getByRole("button", { name: "Menu", exact: true })).toHaveAttribute("aria-expanded", "false");
  expect(await page.evaluate(() => getComputedStyle(document.body).position)).not.toBe("fixed");
});

test("contact and registration controls remain labelled without submitting", async ({ page }) => {
  for (const [path, name] of [["/contact", "Send a brief"], ["/candidates", "Register with Surface Talent"]]) {
    await page.goto(path);
    const form = page.getByRole("form", { name });
    await expect(form).toBeVisible();
    await expect(form.getByLabel(/email/i).first()).toBeVisible();
    await expect(form.getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy");
    await expect(form.getByRole("button", { name: /send|register/i }).last()).toBeVisible();
  }
});

test("job application query selects the career form and preserves the vacancy", async ({ page }) => {
  await page.goto("/contact?enquiry=career_move&role=Synthetic%20Test%20Role#brief");
  await expect(page.locator('input[name="form_type"]')).toHaveValue("contact_career_move");
  await expect(page.locator('input[name="target_role"]')).toHaveValue("Synthetic Test Role");
  await page.getByRole("combobox", { name: "What brings you here?" }).click();
  await page.getByRole("option", { name: "General enquiry", exact: true }).click();
  await expect(page.locator('input[name="form_type"]')).toHaveValue("contact_general");
});

test("indexing matches the environment and internal previews stay private", async ({ request }) => {
  const production = process.env.RELEASE_ENV === "production";
  const response = await request.get("/");
  const robots = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(robots.status()).toBe(200);
  if (production) {
    expect(response.headers()["x-robots-tag"] || "").not.toMatch(/noindex/);
    expect(await robots.text()).not.toMatch(/^Disallow:\s*\/$/m);
    expect((await request.get("/design-lab/hero/h-static")).status()).toBe(404);
  } else {
    expect(response.headers()["x-robots-tag"]).toMatch(/noindex/);
    expect(await robots.text()).toMatch(/^Disallow:\s*\/$/m);
  }
  expect((await request.get("/not-a-real-page-release-check")).status()).toBe(404);
});
