import { expect, test } from "@playwright/test";

/** Regression guards for the QA repair pass (2026-09-02). */
test.describe("homepage regressions", () => {
  test("testimonials all render in the light base state; hover/focus turns navy", async ({ page }, testInfo) => {
    await page.goto("/");
    const cards = page.locator("[data-testimonial]");
    await expect(cards).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      const bg = await cards.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bg, `card ${i} base background`).toBe("rgb(239, 247, 254)");
    }
    if (testInfo.project.name === "desktop-1440") {
      await cards.nth(1).scrollIntoViewIfNeeded();
      await cards.nth(0).focus();
      await page.keyboard.press("Tab"); // keyboard focus → :focus-visible → active state
      await page.waitForTimeout(500);
      const bg = await cards.nth(1).evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bg).toBe("rgb(19, 30, 39)");
    }
  });

  test("tapping a testimonial on touch does not leave it stuck in the hover state", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "tablet" && testInfo.project.name !== "mobile");
    await page.goto("/");
    const card = page.locator("[data-testimonial]").nth(1);
    await card.scrollIntoViewIfNeeded();
    await card.tap();
    await page.waitForTimeout(600);
    expect(await card.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(239, 247, 254)");
  });




  test("footer fits the canonical desktop viewport without an internal scrollbar", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const { height, scrollH, clientH } = await page.locator(".st-footer").evaluate((el) => ({ height: el.getBoundingClientRect().height, scrollH: el.scrollHeight, clientH: el.clientHeight }));
    expect(height).toBeLessThanOrEqual(900 + 1);
    expect(scrollH).toBeLessThanOrEqual(clientH + 1);
  });

});
