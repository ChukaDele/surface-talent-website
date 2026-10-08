import { expect, test } from "@playwright/test";

/** Regression guards for the QA repair pass (2026-09-02). */
test.describe("homepage regressions", () => {
  test("testimonials render as static white cards on the brand palette", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("[data-testimonial]");
    await expect(cards).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      expect(await cards.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor), `card ${i}`).toBe("rgb(255, 255, 255)");
    }
    // quotes are content, not controls: nothing in them takes focus or changes on hover
    await expect(cards.first()).not.toHaveAttribute("tabindex", /.*/);
  });

  test("footer fits the canonical desktop viewport without an internal scrollbar", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const { height, scrollH, clientH } = await page.locator(".st-footer").evaluate((el) => ({ height: el.getBoundingClientRect().height, scrollH: el.scrollHeight, clientH: el.clientHeight }));
    expect(height).toBeLessThanOrEqual(900 + 1);
    expect(scrollH).toBeLessThanOrEqual(clientH + 1);
  });

});
