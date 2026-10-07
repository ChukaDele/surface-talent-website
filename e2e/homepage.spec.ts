import { expect, test } from "@playwright/test";

/**
 * Invariant guards for the October 2026 homepage: a static typographic hero and five quiet
 * sections. No pinned scenes remain on this route.
 */
test.describe("homepage", () => {
  test("renders every section with no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Recruitment built around");
    await expect(page.locator("[data-static-portrait-preview]")).toHaveCount(0);
    await expect(page.locator("[data-hero-static='true'] img, [data-hero-static='true'] video, [data-hero-static='true'] picture")).toHaveCount(4);
    for (const sel of [".st-phero", ".st-whyfail", ".st-dna", ".st-place", ".st-process", ".st-clients", ".st-footer"]) {
      await expect(page.locator(sel)).toHaveCount(1);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("no pinned scenes on the homepage in any mode", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
  });

  test("hero shows the client row and no retired artwork", async ({ page }) => {
    await page.goto("/");
    const logos = page.locator("[data-hero-logos]");
    await expect(logos).toBeVisible();
    await expect(logos.locator("img")).toHaveCount(4);
    await expect(logos.getByRole("img", { name: "SurfacePrep" })).toHaveCount(1);
    await expect(page.locator("[data-linkedin], [data-count], [data-defect], .st-dna__partner")).toHaveCount(0);
    await expect(page.getByText(/\$|£200k/)).toHaveCount(0);
    const cta = page.getByRole("link", { name: "Brief us on a role" }).first();
    await cta.focus();
    await expect(cta).toBeFocused();
  });

  test("testimonials carry no photographs and name only current contacts", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("[data-testimonial]");
    await expect(cards).toHaveCount(2);
    await expect(cards.locator("img")).toHaveCount(0);
    await expect(page.getByText("Barry Shaw", { exact: true })).toBeVisible();
    await expect(page.getByText(/Peter Watts/)).toHaveCount(0);
  });
});
