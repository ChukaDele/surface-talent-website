import { expect, test } from "@playwright/test";

/**
 * Invariant guards for the homepage motion architecture (cheaper and more durable than
 * pixel snapshots — see responsive-motion-systems §12).
 */
test.describe("homepage", () => {
  test("renders every section with no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Recruitment built around");
    await expect(page.locator("[data-static-portrait-preview]")).toHaveCount(1);
    await expect(page.locator("[data-static-teaser]")).toHaveCount(0);
    await expect(page.locator("[data-static-layer][data-front]")).toHaveCount(1);
    await expect(page.locator("[data-static-portrait-preview] video")).toHaveCount(0);
    for (const scene of ["hero", "system", "why", "dna", "floor", "problem", "how", "stake", "footer"]) {
      await expect(page.locator(`[data-scene='${scene}']`)).toHaveCount(1);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("pinned narratives exist only in the desktop-enhanced mode", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    const spacers = await page.locator(".pin-spacer").count();
    const reduced = testInfo.project.name === "reduced-motion";
    const desktop = testInfo.project.name === "desktop-1440";
    if (desktop) expect(spacers).toBeGreaterThanOrEqual(4);
    if (reduced || testInfo.project.name === "mobile" || testInfo.project.name === "tablet" || testInfo.project.name === "short-desktop") expect(spacers).toBe(0);
  });

  test("at most one pinned scene owns the viewport at any scroll position", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "pins only exist on desktop");
    await page.goto("/");
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < total; y += 300) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(60);
      const pinned = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".pin-spacer > *")].filter((el) => getComputedStyle(el).position === "fixed").length);
      expect(pinned, `scroll ${y}`).toBeLessThanOrEqual(1);
    }
  });

  test("scroll to the end and back leaves no stranded pinned element", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= total; y += 900) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(40); }
    for (let y = total; y >= 0; y -= 900) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(40); }
    await page.evaluate(() => window.scrollTo(0, 0)); // the stepped loop can stop short of 0 depending on page height
    await page.waitForTimeout(400);
    // The static hero does not pin. Every other pinned scene must have released at the top.
    const fixedAtTop = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".pin-spacer > *")].filter((el) => getComputedStyle(el).position === "fixed").length);
    expect(fixedAtTop).toBe(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("counter, decorative LinkedIn mark and buttons keep their intended semantics", async ({ page }) => {
    await page.goto("/");
    const linkedin = page.locator("[data-linkedin]");
    await expect(linkedin).toHaveAttribute("aria-hidden", "true");
    await expect(linkedin.locator("a,button,input,select,textarea")).toHaveCount(0);
    const styles = await linkedin.evaluate((el) => ({ position: getComputedStyle(el).position, pointerEvents: getComputedStyle(el).pointerEvents }));
    expect(styles.position).toBe("absolute");
    expect(styles.pointerEvents).toBe("none");
    await linkedin.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);
    await expect(page.locator(".st-dna__years .sr-only")).toHaveText(/20\+ years/);
    const count = page.locator("[data-count]");
    await expect(count).toHaveText("20+", { timeout: 4000 });
    const cta = page.getByRole("link", { name: "Brief us on a role" }).first();
    await cta.focus();
    await expect(cta).toBeFocused();
  });
});
