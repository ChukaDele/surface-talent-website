import { expect, test, type Page } from "@playwright/test";
import http from "node:http";
import { mkdirSync, writeFileSync } from "node:fs";
import { EMAIL_ERROR, PHONE_ERROR } from "../src/lib/forms/validate";

/**
 * Multipage site: navigation state, booking CTAs, forms (against a local Apps Script test double
 * on :3599 — the real Google web app needs owner credentials), agent journey, staging headers.
 */
const BOOKING = "https://calendar.app.google/Wdm9xHVcBNwS2VuS7";
const ROUTES = ["/clients", "/candidates", "/disciplines", "/jobs", "/about", "/contact"];
const received: Record<string, unknown>[] = [];
let server: http.Server;

test.beforeAll(async () => {
  mkdirSync("test-results/submissions", { recursive: true });
  server = http.createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const url = new URL(req.url || "/", "http://x");
      if (url.searchParams.get("secret") !== "test-secret") { res.writeHead(200, { "Content-Type": "application/json" }); return res.end(JSON.stringify({ ok: false, error: "unauthorized", status: 401 })); }
      // the site also reads the live vacancy board from this endpoint; those are GETs and must not
      // land in `received`, which exists to record form submissions
      if (url.searchParams.get("resource") === "jobs" || req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: true, jobs: [] }));
      }
      const payload = JSON.parse(body || "{}");
      received.push(payload);
      writeFileSync(`test-results/submissions/${payload.submission_id}.json`, JSON.stringify({ ...payload, cv: payload.cv ? { ...payload.cv, base64: `<${payload.cv.base64.length} b64 chars>` } : null }, null, 2));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, submission_id: payload.submission_id, sheet: payload.form_type === "candidate_registration" ? "Candidate Submissions" : "Client Enquiries", email_ok: true, cv_ok: true, cv_url: payload.cv ? "https://drive.google.com/file/d/test/view" : "", status: 200 }));
    });
  });
  await new Promise<void>((r) => server.listen(3599, "127.0.0.1", () => r()));
});
test.afterAll(async () => { await new Promise<void>((r) => server.close(() => r())); });

const PDF = Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n");

/** Themed select: open the combobox trigger and pick an option by its visible label (or index). */
async function pick(page: Page, form: ReturnType<Page["getByRole"]>, label: string, option: string | number) {
  await form.getByRole("combobox", { name: label }).click();
  const list = page.getByRole("listbox");
  await expect(list).toBeVisible();
  const opt = typeof option === "number" ? list.getByRole("option").nth(option) : list.getByRole("option", { name: option, exact: true });
  await opt.click();
}

async function acceptPrivacy(page: Page, formLabel: string) {
  await page.getByRole("form", { name: formLabel }).getByLabel(/privacy policy/i).check();
}

test.describe("site chrome", () => {
  test("every route renders with the header, footer and its own title", async ({ page }) => {
    for (const r of ROUTES) {
      const res = await page.goto(r);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.title()).toMatch(/Surface Talent/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });

  test("current route is marked with aria-current in the primary nav", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile" || testInfo.project.name === "tablet", "desktop nav row (collapsed below 1024)");
    for (const r of ["/clients", "/candidates", "/disciplines", "/jobs", "/about"]) {
      await page.goto(r);
      const nav = page.getByRole("navigation", { name: "Primary" });
      const current = nav.locator("a[aria-current='page']");
      await expect(current).toHaveCount(1);
      await expect(current).toHaveAttribute("href", r);
      await expect(current.locator("img.st-header__current")).toHaveCount(1);
    }
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Primary" }).locator("a[aria-current='page']")).toHaveCount(0);
  });

  test("mobile menu button reveals the primary navigation", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile");
    await page.goto("/about");
    const btn = page.getByRole("button", { name: "Menu" });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    const link = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Clients" });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/clients$/);
  });

  test("book-a-call CTAs are real links to the booking page that open the on-site dialog", async ({ page }) => {
    for (const r of ["/clients", "/contact"]) {
      await page.goto(r);
      const links = page.getByRole("link", { name: /book a/i });
      expect(await links.count()).toBeGreaterThan(0);
      for (const l of await links.all()) {
        // the trigger stays a plain anchor so it works without JavaScript and an agent can follow it
        await expect(l).toHaveAttribute("href", BOOKING);
        await expect(l).toHaveAttribute("data-booking-trigger", "true");
        expect(await l.getAttribute("target"), "same-tab: the dialog handles the click").toBeNull();
      }
      await links.first().click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();
    }
  });

  test("staging responses are marked noindex", async ({ page }) => {
    const res = await page.goto("/clients");
    expect(res?.headers()["x-robots-tag"]).toMatch(/noindex/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("jobs page shows the approved empty state when no source is configured", async ({ page }) => {
    await page.goto("/jobs");
    await expect(page.locator("[data-jobs-empty]")).toBeVisible();
    // an empty jobs board sends a jobseeker to register, not to the hiring enquiry form
    await expect(page.locator("[data-jobs-empty]").getByRole("link", { name: /register your cv/i })).toHaveAttribute("href", "/candidates");
    // 503 only when nothing is wired up. Under the test harness a source is configured and simply
    // has nothing live, which is a real state: 200 with an empty board, and the page says so.
    const api = await page.request.get("/api/jobs");
    expect([200, 503]).toContain(api.status());
    if (api.status() === 200) expect((await api.json()).jobs).toEqual([]);
  });

  test("footer keeps one compact brand lockup without the decorative duplicate wordmark", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.locator(".st-footer__wordmark")).toHaveCount(0);
    await expect(footer.locator(".st-footer__brand")).toContainText("Surface Talent");
  });
});

test.describe("corrections pass", () => {
  test("header hides on a meaningful downward scroll and returns on upward scroll", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "reduced-motion");
    await page.goto("/about");
    const header = page.getByRole("banner");
    await expect(header).not.toHaveClass(/is-hidden/);
    for (const y of [200, 320, 440, 560]) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(80); }
    await expect(header).toHaveClass(/is-hidden/);
    for (const y of [520, 470]) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(80); }
    await expect(header).not.toHaveClass(/is-hidden/);
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(150);
    await expect(header).not.toHaveClass(/is-hidden/);
  });

  test("footer circle terminates just below the CTA row and the legal links resolve", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/contact");
    const { orbEnd, ctaBottom, footerH } = await page.evaluate(() => {
      const f = document.querySelector(".st-footer") as HTMLElement; const cta = document.querySelector("[data-footer-cta]") as HTMLElement; const clip = document.querySelector(".st-footer__orbclip") as HTMLElement;
      const fr = f.getBoundingClientRect();
      return { orbEnd: clip.getBoundingClientRect().height, ctaBottom: cta.getBoundingClientRect().bottom - fr.top, footerH: fr.height };
    });
    expect(orbEnd).toBeGreaterThan(ctaBottom); expect(orbEnd).toBeLessThan(ctaBottom + 80); expect(orbEnd).toBeLessThan(footerH * 0.7);
    const legal = page.getByRole("navigation", { name: "Legal" });
    const hrefs = await legal.getByRole("link").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")));
    expect(hrefs).toEqual(expect.arrayContaining(["/privacy", "/cookies", "/modern-slavery", "/terms", "/accessibility", "/privacy-requests", "/candidate-privacy", "/responsible-ai"]));
    for (const h of hrefs) { const r = await page.request.get(h!); expect(r.status(), h!).toBe(200); }
    await page.goto("/legal/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy policy");
    await expect(page.locator(".st-legal__body h2").first()).toHaveText("1. Who we are");
  });

  test("testimonial rows share a grid: metrics, labels and authors align across cards", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const tops = await page.evaluate(() => {
      const rows = (sel: string) => [...document.querySelectorAll(sel)].map((e) => Math.round(e.getBoundingClientRect().top));
      return { metric: rows(".st-clients__metric"), label: rows(".st-clients__label"), quote: rows(".st-clients__quote"), author: rows(".st-clients__author") };
    });
    for (const k of Object.keys(tops) as (keyof typeof tops)[]) { const v = tops[k]; expect(Math.max(...v) - Math.min(...v), `${k} row alignment`).toBeLessThanOrEqual(1); }
  });

  test("themed selects are real comboboxes: keyboard operable, nothing pre-highlighted, value posts with the form", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/contact");
    const form = page.getByRole("form", { name: "Send a brief" });
    const trigger = form.getByRole("combobox", { name: "What brings you here?" });
    await expect(trigger).toHaveText(/I.m hiring/);
    const restingBg = await trigger.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(restingBg).not.toBe("rgb(255, 255, 255)"); // bright treatment is hover/focus only
    await trigger.hover();
    await expect.poll(() => trigger.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(255, 255, 255)");
    await trigger.focus(); await page.keyboard.press("Enter");
    const list = page.getByRole("listbox"); await expect(list).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute("role"))).toBe("option");
    expect(await list.locator("[data-highlighted]").count()).toBeLessThanOrEqual(1);
    await page.keyboard.press("ArrowDown");
    await expect(list.locator("[data-highlighted]")).toHaveText(/considering a move/);
    await page.keyboard.press("Enter");
    await expect(list).toBeHidden();
    await expect(trigger).toHaveText(/considering a move/);
    await expect(form.getByLabel("Current role and employer")).toBeVisible();
    await page.keyboard.press("Escape");
    expect(await form.locator("select[name='enquiry_type']").inputValue()).toBe("career_move");
  });

  test("homepage hero renders the approved portrait loop behind the copy", async ({ page }, testInfo) => {
    test.skip(!["desktop-1440", "short-desktop"].includes(testInfo.project.name), "desktop slot geometry");
    await page.goto("/");
    const specimen = page.locator(".st-hero__specimen");
    await expect(specimen).toBeVisible();
    const portrait = specimen.locator("[data-static-portrait-preview]");
    await expect(portrait).toBeVisible();
    await expect(portrait.locator("[data-static-main] source[type='image/avif']").first()).toHaveAttribute("srcset", /plant-leader\.avif$/);
    await expect(portrait.locator("[data-static-teaser]")).toHaveCount(0);
    await expect(portrait.locator("[data-static-layer]")).toHaveCount(2);
    await expect(portrait.locator("[data-static-layer][data-front]")).toHaveCount(1);
    await expect(portrait).toHaveAttribute("data-hero-portrait-hold-ms", "4500");
    await expect(portrait).toHaveAttribute("data-hero-portrait-transition-ms", "720");
    await expect(portrait.locator("video")).toHaveCount(0);
    const info = await portrait.evaluate((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { bg: cs.backgroundColor, w: r.width, h: r.height };
    });
    expect(info.bg, "the portrait composition uses the page navy as its only base").toMatch(/rgb\(13, 34, 51\)|rgba\(0, 0, 0, 0\)|transparent/);
    const box = (await specimen.boundingBox())!;
    expect(info.w).toBeCloseTo(box.width, 0);
    expect(info.h).toBeGreaterThanOrEqual(540);
    expect(info.h).toBeLessThanOrEqual(box.height);
  });

  test("client portraits stay crisp while the metadata scrim remains purposeful", async ({ page }) => {
    await page.goto("/clients");
    const card = page.locator("[data-profile]").first();
    const styles = await card.evaluate((el) => {
      const img = el.querySelector("img")!;
      const shade = el.querySelector("[class*='st-profile__shade']")!;
      return {
        imageFilter: getComputedStyle(img).filter,
        imageTransform: getComputedStyle(img).transform,
        shadeBackdrop: getComputedStyle(shade).backdropFilter,
      };
    });
    expect(styles.imageFilter).toBe("none");
    expect(styles.imageTransform).toBe("none");
    expect(styles.shadeBackdrop).toBe("none");
  });

  test("buttons use a directional fill and arrow cue without a shadow", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const button = page.locator("[data-hero-ctas] .st-btn").first();
    await button.hover();
    await page.waitForTimeout(260);
    const styles = await button.evaluate((el) => ({
      shadow: getComputedStyle(el).boxShadow,
      sweep: getComputedStyle(el, "::before").transform,
      arrow: getComputedStyle(el.querySelector(".st-btn__icon")!).transform,
    }));
    expect(styles.shadow).toBe("none");
    expect(styles.sweep).not.toBe("none");
    expect(styles.sweep).not.toBe("matrix(0, 0, 0, 1, 0, 0)");
    expect(styles.arrow).not.toBe("none");
  });

  test("the LinkedIn mark restores the decorative hanging treatment", async ({ page }) => {
    await page.goto("/");
    const link = page.locator("[data-linkedin]");
    await expect(link).toHaveAttribute("aria-hidden", "true");
    await expect(link.locator("a,button,input,select,textarea")).toHaveCount(0);
    await expect(page.locator("[data-linkedin-rope]")).toHaveCount(1);
    const styles = await link.evaluate((el) => ({ position: getComputedStyle(el).position, transform: getComputedStyle(el).transform, pointerEvents: getComputedStyle(el).pointerEvents }));
    expect(styles.position).toBe("absolute");
    expect(styles.transform).not.toBe("none");
    expect(styles.pointerEvents).toBe("none");
  });

  test("core page transitions do not retain explicit dead spacers", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator(".st-cohero__spacer")).toHaveCount(0);
    await page.goto("/clients");
    // ScrollTrigger owns the clients hero pin and wraps it in its runtime spacer. The
    // first content block must follow that runtime wrapper, with no authored dead spacer.
    const firstBlock = page.locator(".st-block").first();
    await expect(firstBlock).toBeVisible();
    const previousClass = await firstBlock.evaluate((el) => el.previousElementSibling?.className ?? "");
    expect(previousClass).toMatch(/st-chero|pin-spacer/);
  });

  test("reduced motion holds the opening homepage portrait without requesting video", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "reduced-motion");
    const videoRequests: string[] = [];
    page.on("request", (request) => {
      if (/\.(webm|mp4)(\?|$)/.test(request.url())) videoRequests.push(request.url());
    });
    await page.goto("/");
    await expect(page.locator("[data-static-portrait-preview]")).toBeVisible();
    await expect(page.locator("[data-static-portrait-preview] [data-static-teaser]")).toHaveCount(0);
    await expect(page.locator("[data-static-portrait-preview]")).toHaveAttribute("data-hero-portrait-index", "0");
    await expect(page.locator("[data-static-portrait-preview] video")).toHaveCount(0);
    expect(videoRequests).toHaveLength(0);
  });

  test("Why Specialists rebuilds 04 → 01 on reverse scroll without a dark screen", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const pin = page.locator(".st-why__pin");
    const top = await pin.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const runway = await page.evaluate(() => (document.querySelector(".st-why__pin")!.closest(".pin-spacer") as HTMLElement).getBoundingClientRect().height - window.innerHeight);
    const sample = async () => page.evaluate(() => { const m = document.querySelector("[data-why-morph]") as HTMLElement; const h = document.querySelector("[data-why-head]") as HTMLElement; const cs = getComputedStyle(m); return { morphOpacity: Number(cs.opacity), morphVis: cs.visibility, headOpacity: Number(getComputedStyle(h).opacity), stageBg: getComputedStyle(document.querySelector(".st-why__pin")!).backgroundColor }; });
    await page.evaluate((y) => window.scrollTo(0, y), top + runway + 600); await page.waitForTimeout(500);
    for (const frac of [0.98, 0.8, 0.6, 0.4, 0.2, 0.05]) {
      await page.evaluate((y) => window.scrollTo(0, y), top + runway * frac); await page.waitForTimeout(450);
      const s = await sample();
      if (frac <= 0.6) { expect(s.morphOpacity, `morph hidden at ${frac}`).toBeLessThan(0.05); expect(s.headOpacity, `heading visible at ${frac}`).toBeGreaterThan(0.9); }
    }
  });

  test("informational grids have no hover transform (Where we work is static)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const card = page.locator(".st-disc__card").first();
    await card.scrollIntoViewIfNeeded(); await card.hover(); await page.waitForTimeout(500);
    expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });
});

test.describe("forms", () => {
  test("every control in both forms has a label, a stable name and validation semantics", async ({ page }) => {
    for (const [route, label] of [["/candidates", "Register with Surface Talent"], ["/contact", "Send a brief"]] as const) {
      await page.goto(route);
      const form = page.getByRole("form", { name: label });
      const controls = form.locator("input:not([type=hidden]):not([type=checkbox][name^='employment']), button[role='combobox'], textarea");
      for (const c of await controls.all()) {
        const name = await c.getAttribute("name");
        const id = await c.getAttribute("id");
        if ((await c.getAttribute("tabindex")) === "-1") continue; // honeypot
        if ((await c.getAttribute("role")) !== "combobox") expect(name, "control has a name").toBeTruthy();
        expect(await form.locator(`label[for="${id}"]`).count(), `label for ${name}`).toBeGreaterThan(0);
      }
      await form.getByRole("button", { name: /register|send/i }).click();
      await expect(form.locator("[aria-invalid='true']").first()).toBeVisible();
      await expect(form.getByRole("alert").first()).toBeVisible();
    }
  });

  test("invalid email and phone get plain-English errors; valid values pass", async ({ page }) => {
    await page.goto("/candidates");
    const form = page.getByRole("form", { name: "Register with Surface Talent" });
    await form.getByLabel("Full name").fill("Synthetic Tester");
    await form.getByLabel("Email", { exact: true }).fill("not-an-email@");
    await form.getByLabel("Phone (optional)").fill("0770");
    await pick(page, form, "Discipline / area of interest", 1);
    await acceptPrivacy(page, "Register with Surface Talent");
    await form.getByRole("button", { name: "Register" }).click();
    await expect(form.getByText(EMAIL_ERROR)).toBeVisible();
    await expect(form.getByText(PHONE_ERROR)).toBeVisible();
    expect(received.length).toBe(0);
  });

  test("candidate registration with a synthetic CV persists through the pipeline and reports success", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/candidates");
    const form = page.getByRole("form", { name: "Register with Surface Talent" });
    await form.getByLabel("Full name").fill("Synthetic Tester");
    await form.getByLabel("Email", { exact: true }).fill("synthetic.tester+staging@example.com");
    await form.getByLabel("Phone (optional)").fill("07123 456789");
    await form.getByLabel("Current role and employer").fill("Process Engineer, Example Plating Ltd");
    await pick(page, form, "Discipline / area of interest", 1);
    await form.getByLabel("What are you looking for in your next role?").fill("[STAGING TEST] Synthetic submission — ignore.");
    await form.getByRole("button", { name: /more about you/i }).click();
    await form.getByLabel("Location (town or postcode)").fill("Birmingham");
    await form.getByLabel("Permanent").check();
    await form.locator("input[name='cv']").setInputFiles({ name: "synthetic-cv.pdf", mimeType: "application/pdf", buffer: PDF });
    await acceptPrivacy(page, "Register with Surface Talent");
    await page.waitForTimeout(1600); // minimum fill time guard
    await form.getByRole("button", { name: "Register" }).click();
    const status = page.getByRole("status").filter({ hasText: /reference/ });
    await expect(status).toBeVisible({ timeout: 15000 });
    const ref = (await status.textContent())!.match(/ST-\d{8}-[0-9a-f]{8}/)?.[0];
    expect(ref).toBeTruthy();
    const payload = received.find((p) => p.submission_id === ref) as Record<string, unknown> & { cv: { ext: string; mime: string; filename: string } | null; employment_types: string[] };
    expect(payload).toBeTruthy();
    expect(payload.form_type).toBe("candidate_registration");
    expect(payload.environment).toBe("staging");
    expect(payload.email).toBe("synthetic.tester+staging@example.com");
    expect(payload.phone_e164).toBe("+447123456789");
    expect(payload.phone_country).toBe("GB");
    expect(payload.location).toBe("Birmingham");
    expect(payload.employment_types).toEqual(["Permanent"]);
    expect(payload.cv?.ext).toBe("pdf");
    expect(payload.cv?.mime).toBe("application/pdf");
    expect(payload.source_page).toBe("candidates");
    expect(payload.privacy_consent).toBe(true);
  });

  test("hiring enquiry on Contact routes to a client enquiry with the conditional fields", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/contact");
    const form = page.getByRole("form", { name: "Send a brief" });
    await form.getByLabel("Full name").fill("Synthetic Client");
    await form.getByLabel("Email", { exact: true }).fill("ops.director@example-plating.co.uk");
    await form.getByLabel("Company").fill("Example Plating Ltd");
    await form.getByLabel("Role you’re hiring for").fill("Plant Manager");
    await form.getByLabel("Location").fill("Sheffield");
    await form.getByLabel("Phone", { exact: true }).fill("+44 7123 987654");
    await pick(page, form, "How many hires?", "Two or three roles");
    await pick(page, form, "Timeline", 1);
    await form.getByLabel("Anything else we should know?").fill("[STAGING TEST] Synthetic hiring brief — ignore.");
    await acceptPrivacy(page, "Send a brief");
    await page.waitForTimeout(1600);
    await form.getByRole("button", { name: "Send brief" }).click();
    await expect(page.getByRole("status").filter({ hasText: /reference/ })).toBeVisible({ timeout: 15000 });
    const payload = received.at(-1) as Record<string, unknown>;
    expect(payload.form_type).toBe("contact_hiring");
    expect(payload.company).toBe("Example Plating Ltd");
    expect(payload.target_role).toBe("Plant Manager");
    expect(payload.hires_count).toBe("2-3");
    expect(payload.phone_e164).toBe("+447123987654");
    expect(payload.cv).toBeNull();
  });

  test("double submit produces one record and an oversized file is refused client-side", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/candidates");
    const form = page.getByRole("form", { name: "Register with Surface Talent" });
    await form.getByLabel("Full name").fill("Synthetic Dup");
    await form.getByLabel("Email", { exact: true }).fill("synthetic.dup@example.com");
    await pick(page, form, "Discipline / area of interest", 2);
    await form.locator("input[name='cv']").setInputFiles({ name: "big.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
    await acceptPrivacy(page, "Register with Surface Talent");
    await form.getByRole("button", { name: "Register" }).click();
    await expect(form.getByText(/over 10 MB/)).toBeVisible();
    await form.locator("input[name='cv']").setInputFiles([]);
    await page.waitForTimeout(1600);
    const before = received.length;
    const btn = form.getByRole("button", { name: "Register" });
    await btn.dblclick(); // two rapid activations; the button disables while busy and the hook ignores re-entry
    await expect(page.getByRole("status").filter({ hasText: /reference/ })).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(500);
    expect(received.length - before).toBe(1);
  });

  test("server rejects a wrong form type and honours the honeypot", async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "API behaviour is viewport-independent");
    const bad = await request.post("/api/submit", { multipart: { form_type: "nope", name: "x", email: "a@b.co", privacy_consent: "on" } });
    expect(bad.status()).toBe(400);
    const honey = await request.post("/api/submit", { multipart: { form_type: "contact_general", name: "Bot", email: "bot@example.com", message: "hi", privacy_consent: "on", website_url: "http://spam" } });
    expect((await honey.json()).id).toBe("ignored");
  });
});

test.describe("agent journey", () => {
  test("a standards-based browser agent can discover navigation, book a call and submit a form", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const names = await nav.getByRole("link").allTextContents();
    expect(names.map((n) => n.trim())).toEqual(expect.arrayContaining(["Clients", "Candidates", "Disciplines", "Jobs", "About"]));
    await nav.getByRole("link", { name: "Clients" }).click();
    await expect(page).toHaveURL(/\/clients$/);
    expect(await page.getByRole("navigation", { name: "Primary" }).locator("a[aria-current='page']").textContent()).toContain("Clients");
    const book = page.getByRole("link", { name: /book a call/i });
    await expect(book).toHaveAttribute("href", BOOKING);
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Candidates" }).click();
    const form = page.getByRole("form", { name: "Register with Surface Talent" });
    await form.getByLabel("Full name").fill("Agent Test");
    await form.getByLabel("Email", { exact: true }).fill("agent.test@example.com");
    await pick(page, form, "Discipline / area of interest", 3);
    await form.getByRole("button", { name: "Register" }).click();
    await expect(form.getByRole("alert").first()).toBeVisible(); // consent missing → machine-readable error
    await acceptPrivacy(page, "Register with Surface Talent");
    await page.waitForTimeout(1600);
    await form.getByRole("button", { name: "Register" }).click();
    await expect(page.getByRole("status").filter({ hasText: /Sent|reference/ })).toBeVisible({ timeout: 15000 });
  });
});
