import { expect, test, type Page } from "@playwright/test";

/** Launch pass: anchor targeting, sticky nav surface, booking dialog, contact actions, legal TOC, SEO baseline. */
const BOOKING = "https://calendar.app.google/Wdm9xHVcBNwS2VuS7";

async function navHeight(page: Page) {
  return page.evaluate(() => Math.round(document.querySelector("header")!.getBoundingClientRect().height));
}

test.describe("anchors and sticky nav", () => {
  test("Fill the form lands with the section heading visible below the nav", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("link", { name: /fill in the form/i }).click();
    await expect(page).toHaveURL(/#brief$/);
    await page.waitForTimeout(900);
    const h = await navHeight(page);
    const box = await page.locator("#brief-title").boundingBox();
    expect(box, "section heading is on screen").toBeTruthy();
    expect(box!.y, "heading sits below the sticky nav").toBeGreaterThan(h - 4);
    expect(box!.y, "heading is near the top, not scrolled past").toBeLessThan(h + 260);
    // the eyebrow above the heading is visible too, so the section reads with its context
    const eyebrow = await page.locator("#brief .st-eyebrow").first().boundingBox();
    expect(eyebrow!.y).toBeGreaterThan(h - 4);
    await expect(page.getByRole("form", { name: "Send a brief" })).toBeVisible();
  });

  test("a direct #brief page load lands in the same place", async ({ page }) => {
    await page.goto("/contact#brief");
    await page.waitForTimeout(900);
    const h = await navHeight(page);
    const box = await page.locator("#brief-title").boundingBox();
    expect(box!.y).toBeGreaterThan(h - 4);
    expect(box!.y).toBeLessThan(h + 260);
  });

  test("the returned sticky nav is an opaque surface, so the logo marquee cannot read through it", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "reduced-motion");
    await page.goto("/");
    for (const y of [200, 320, 440, 560]) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(80); }
    for (const y of [520, 460]) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(90); }
    const header = page.getByRole("banner");
    await expect(header).toHaveClass(/is-scrolled/);
    const style = await header.evaluate((el) => { const cs = getComputedStyle(el); return { bg: cs.backgroundColor, blur: cs.backdropFilter, z: cs.zIndex }; });
    const alpha = Number(style.bg.match(/[\d.]+\)$/)?.[0].replace(")", "") ?? "1");
    expect(alpha, "nav surface is near-opaque").toBeGreaterThanOrEqual(0.9);
    expect(style.blur).toContain("blur");
    expect(Number(style.z)).toBeGreaterThanOrEqual(40);
  });
});

test.describe("booking, email and phone", () => {
  test("Book a call opens an accessible on-site dialog with the Google embed and a fallback", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "reduced-motion");
    await page.goto("/contact");
    const trigger = page.getByRole("link", { name: /book a call/i }).first();
    await expect(trigger).toHaveAttribute("href", BOOKING); // still a real link without JS
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(/book a call/i);
    const frame = dialog.locator("iframe");
    await expect(frame).toHaveAttribute("src", /calendar\.google\.com\/calendar\/appointments\/schedules\/.+gv=true/);
    await expect(dialog.getByRole("link", { name: /open booking page/i })).toHaveAttribute("href", BOOKING);
    await expect(dialog.getByRole("button", { name: /close/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused(); // focus returns to the trigger
  });

  test("email and phone are real actions with the canonical details", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("link", { name: /hello@surfacetalent\.co\.uk/ }).first()).toHaveAttribute("href", "mailto:hello@surfacetalent.co.uk");
    await expect(page.getByRole("link", { name: /\+44 7798 673 654/ }).first()).toHaveAttribute("href", "tel:+447798673654");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: /hello@surfacetalent\.co\.uk/ })).toHaveAttribute("href", "mailto:hello@surfacetalent.co.uk");
    await expect(footer.getByRole("link", { name: /\+44 7798 673 654/ })).toHaveAttribute("href", "tel:+447798673654");
  });
});

test.describe("legal pages", () => {
  test("clean URLs serve the migrated content and /legal/* redirects to them", async ({ page, request }) => {
    for (const slug of ["privacy", "cookies", "modern-slavery", "terms", "accessibility", "privacy-requests", "candidate-privacy", "responsible-ai"]) {
      const res = await request.get(`/${slug}`);
      expect(res.status(), slug).toBe(200);
    }
    const redirect = await request.get("/legal/privacy", { maxRedirects: 0 });
    expect([301, 308]).toContain(redirect.status());
    expect(redirect.headers()["location"]).toContain("/privacy");
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy policy");
    await expect(page.getByRole("link", { name: /privacy policy/i }).first()).toBeVisible;
  });

  test("desktop shows a sticky on-this-page nav that tracks the active section", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/privacy");
    const toc = page.locator(".st-toc--desktop");
    await expect(toc).toBeVisible();
    const links = toc.getByRole("link");
    expect(await links.count()).toBeGreaterThan(4);
    const target = links.nth(3);
    const label = (await target.textContent())!.trim();
    await target.click();
    await page.waitForTimeout(900);
    const h = await navHeight(page);
    const heading = page.locator(".st-legal__body h2").filter({ hasText: label }).first();
    const box = await heading.boundingBox();
    expect(box!.y, "section heading clears the sticky nav").toBeGreaterThan(h - 4);
    expect(box!.y).toBeLessThan(h + 200);
    await expect.poll(() => toc.locator('a[aria-current="true"]').textContent()).toContain(label);
    expect(await toc.evaluate((el) => getComputedStyle(el).position)).toBe("sticky");
  });

  test("mobile shows a collapsible section list instead of a side column", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile");
    await page.goto("/privacy");
    await expect(page.locator(".st-toc--desktop")).toBeHidden();
    const details = page.locator(".st-toc--mobile");
    await expect(details).toBeVisible();
    await details.getByRole("group").or(details.locator("summary")).first().click();
    await expect(details.getByRole("link").first()).toBeVisible();
  });

  test("the consent link points at the local privacy page, not the legacy site", async ({ page }) => {
    await page.goto("/candidates");
    const link = page.getByRole("form", { name: "Register with Surface Talent" }).getByRole("link", { name: /privacy policy/i });
    await expect(link).toHaveAttribute("href", "/privacy");
  });
});

test.describe("SEO baseline", () => {
  test("staging stays noindex in robots and headers", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const body = await robots.text();
    expect(body).toMatch(/User-Agent: \*/i);
    expect(body).toMatch(/Disallow: \//);
    const page = await request.get("/");
    expect(page.headers()["x-robots-tag"]).toMatch(/noindex/);
  });

  test("sitemap lists the canonical production URLs and no internal tools", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    for (const path of ["/", "/clients", "/candidates", "/jobs", "/disciplines", "/about", "/contact", "/privacy", "/disciplines/electroplating"]) {
      expect(xml, path).toContain(`https://surfacetalent.co.uk${path === "/" ? "/" : path}`);
    }
    expect(xml).not.toContain("/design-lab");
    expect(xml).not.toContain("/hero-loop");
    expect(xml).not.toContain("workers.dev");
    expect(xml).not.toContain("/disciplines/pre-treatment");
  });

  test("every indexable route has a unique title, description and canonical", async ({ page }) => {
    const seen = new Map<string, string>();
    for (const route of ["/", "/clients", "/candidates", "/contact", "/about", "/disciplines", "/jobs", "/privacy", "/disciplines/electroplating", "/disciplines/heat-treatment"]) {
      await page.goto(route);
      const title = await page.title();
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(title.length, route).toBeGreaterThan(10);
      expect(title.length, route).toBeLessThanOrEqual(70);
      expect(desc, route).toBeTruthy();
      expect(desc!.length, route).toBeLessThanOrEqual(165);
      expect(canonical, route).toContain("https://surfacetalent.co.uk");
      expect(seen.has(title), `title reused on ${route} and ${seen.get(title)}`).toBe(false);
      seen.set(title, route);
      expect(await page.locator("h1").count(), `${route} has exactly one h1`).toBe(1);
    }
  });

  test("organisation and website structured data is present and valid JSON", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    const parsed = blocks.flatMap((b) => { const v = JSON.parse(b); return Array.isArray(v) ? v : [v]; });
    const types = parsed.flatMap((p) => (Array.isArray(p["@type"]) ? p["@type"] : [p["@type"]]));
    expect(types).toEqual(expect.arrayContaining(["Organization", "EmploymentAgency", "WebSite"]));
    await page.goto("/disciplines/electroplating");
    const crumbs = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((b) => JSON.parse(b));
    expect(crumbs.some((c) => c["@type"] === "BreadcrumbList" && c.itemListElement.length === 3)).toBe(true);
  });

  test("the retired hero exploration routes are removed", async ({ request }) => {
    for (const path of ["/design-lab/hero", "/design-lab/hero/h", "/hero-loop"]) {
      expect((await request.get(path)).status(), path).toBe(404);
    }
  });

  test("the approved static hero remains available for review", async ({ page }, testInfo) => {
    await page.goto("/design-lab/hero/h-static");
    await expect(page.getByRole("heading", { name: "Recruitment built around Surface Engineering" })).toBeVisible();
    await expect(page.locator('[data-hero-static="true"]')).toBeVisible();
    await expect(page.locator("[data-static-portrait-preview] [data-static-layer]")).toHaveCount(
      testInfo.project.name === "reduced-motion" ? 1 : 2,
    );
    await expect(page.locator("[data-static-portrait-preview] video")).toHaveCount(0);
  });

  test("the production homepage keeps the static hero free of video media requests", async ({ page }) => {
    const videoRequests: string[] = [];
    page.on("request", (request) => {
      if (/\.(webm|mp4)(\?|$)/.test(request.url())) videoRequests.push(request.url());
    });
    await page.goto("/");
    await expect(page.locator('[data-hero-static="true"]')).toBeVisible();
    await expect(page.locator('[data-hero-static="true"] video')).toHaveCount(0);
    expect(videoRequests).toHaveLength(0);
  });
});

test.describe("responsive", () => {
  test("no route can be scrolled sideways at this viewport", async ({ page }) => {
    for (const route of ["/", "/clients", "/candidates", "/contact", "/about", "/disciplines", "/jobs", "/privacy", "/disciplines/anodising"]) {
      await page.goto(route);
      await page.waitForTimeout(300);
      const res = await page.evaluate(() => { window.scrollTo(200, 0); const x = window.scrollX; window.scrollTo(0, 0); return { x, over: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
      expect(res.x, `${route} scrolls sideways`).toBe(0);
      expect(res.over, `${route} overflows`).toBeLessThanOrEqual(2);
    }
  });

  test("form controls are touch sized and never trigger a focus zoom", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile" && testInfo.project.name !== "tablet");
    await page.goto("/candidates");
    const inputs = page.locator(".st-form input[type='text']:not([tabindex='-1']), .st-form input[type='email'], .st-form input[type='tel'], .st-form textarea");
    for (const el of await inputs.all()) {
      const m = await el.evaluate((n) => ({ fs: parseFloat(getComputedStyle(n).fontSize), h: n.getBoundingClientRect().height }));
      expect(m.fs, "16px avoids the iOS focus zoom").toBeGreaterThanOrEqual(16);
      expect(m.h).toBeGreaterThanOrEqual(44);
    }
    await expect(page.getByRole("form", { name: "Register with Surface Talent" }).getByRole("button", { name: "Register" })).toHaveJSProperty("offsetHeight", 48);
  });

  test("the Hero H uses an image-free mobile lockup and a full-bleed tablet field", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile" && testInfo.project.name !== "tablet");
    await page.goto("/");
    const portrait = page.locator("[data-static-portrait-preview]");
    if (testInfo.project.name === "mobile") {
      await expect(portrait).toBeHidden();
      await expect(page.locator("[data-hero-logos]")).toBeHidden();
      await expect(page.locator("[data-hero-ctas]")).toBeVisible();
      const copy = await page.locator(".st-hero--static-preview .st-hero__copy").evaluate((el) => {
        const cs = getComputedStyle(el);
        return { position: cs.position, textAlign: cs.textAlign, width: el.getBoundingClientRect().width };
      });
      expect(copy.position).toBe("relative");
      expect(copy.textAlign).toBe("center");
      expect(copy.width).toBeLessThanOrEqual(360);
    } else {
      await expect(portrait).toBeVisible();
      await expect(portrait.locator("[data-static-main] img").first()).toBeVisible();
      await expect(portrait.locator("[data-static-teaser]")).toHaveCount(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
});
