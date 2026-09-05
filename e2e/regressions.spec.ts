import { expect, test } from "@playwright/test";

/** Regression guards for the QA repair pass (2026-09-02). */
test.describe("homepage regressions", () => {
  test("testimonials all render in the light base state; hover/focus turns navy", async ({ page }, testInfo) => {
    await page.goto("/");
    const cards = page.locator("[data-testimonial]");
    await expect(cards).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
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

  test("problem stack has three defect cards whose surfaces never darken", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const cards = page.locator("[data-defect]");
    await expect(cards).toHaveCount(3);
    const pin = page.locator(".st-problem__pin");
    const top = await pin.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    for (const dy of [0, 300, 620, 900, 1240]) {
      await page.evaluate((y) => window.scrollTo(0, y), top + dy);
      await page.waitForTimeout(350);
      for (let i = 0; i < 3; i++) {
        const { filter, opacity, bg } = await cards.nth(i).evaluate((el) => ({ filter: getComputedStyle(el).filter, opacity: getComputedStyle(el).opacity, bg: getComputedStyle(el).backgroundColor }));
        expect(filter, `card ${i} filter at +${dy}`).toBe("none");
        expect(Number(opacity)).toBe(1);
        expect(bg).toBe("rgb(251, 248, 245)");
      }
      // no card may protrude below the pinned stage into the next section
      const overflow = await page.evaluate(() => {
        const pinEl = document.querySelector(".st-problem__pin")!.getBoundingClientRect();
        return [...document.querySelectorAll("[data-defect]")].filter((c) => { const r = c.getBoundingClientRect(); return r.top < pinEl.bottom && r.bottom > pinEl.bottom + 2 && getComputedStyle(c.closest(".st-problem__pin")!).overflow !== "clip"; }).length;
      });
      expect(overflow).toBe(0);
    }
  });

  test("why-specialist heading lives inside the pinned stage and stays visible while stacking", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    await expect(page.locator(".st-why__pin [data-why-head]")).toHaveCount(1);
    const top = await page.locator(".st-why__pin").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    for (const dy of [200, 700, 1300]) {
      await page.evaluate((y) => window.scrollTo(0, y), top + dy);
      await page.waitForTimeout(350);
      const { visible, headBottom, firstCardTop } = await page.evaluate(() => {
        const head = document.querySelector("[data-why-head]")!;
        const cs = getComputedStyle(head);
        const hr = head.getBoundingClientRect();
        const slot = document.querySelector("[data-why-slot='0']")!.getBoundingClientRect();
        return { visible: cs.opacity !== "0" && cs.visibility !== "hidden" && hr.top >= 0, headBottom: hr.bottom, firstCardTop: slot.top };
      });
      expect(visible, `heading visible at +${dy}`).toBe(true);
      expect(firstCardTop).toBeGreaterThanOrEqual(headBottom - 1);
    }
  });

  test("pinned stages own the viewport: no pinned element taller than the viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440" && testInfo.project.name !== "short-desktop");
    await page.goto("/");
    const tooTall = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".pin-spacer > *")].filter((el) => el.getBoundingClientRect().height > window.innerHeight + 1).map((el) => el.className));
    expect(tooTall).toEqual([]);
  });

  test("footer fits the canonical desktop viewport without an internal scrollbar", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const { height, scrollH, clientH } = await page.locator(".st-footer").evaluate((el) => ({ height: el.getBoundingClientRect().height, scrollH: el.scrollHeight, clientH: el.clientHeight }));
    expect(height).toBeLessThanOrEqual(900 + 1);
    expect(scrollH).toBeLessThanOrEqual(clientH + 1);
  });

  test("no dead scroll: total pin runway matches travel budgets", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    await page.waitForTimeout(400);
    const spacers = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".pin-spacer")].map((s) => ({ scene: (s.querySelector("[data-scene]") as HTMLElement | null)?.dataset.scene ?? s.firstElementChild?.className.split(" ")[0], runway: Math.round(s.getBoundingClientRect().height - window.innerHeight) })));
    for (const s of spacers) expect(s.runway, `${s.scene} runway`).toBeLessThanOrEqual(window_budget(s.scene));
    function window_budget(scene?: string) { return scene?.includes("why") ? 2.5 * 900 : 2 * 900; }
  });
});
