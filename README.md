# Surface Talent — website (v2)

The new Surface Talent marketing website, rebuilt from the approved Figma design
(`Surface Talent (Copy)`, file key `UEi5kOOH84s4Vb2VXo5dZK`, homepage frame `35:219`).
This repository is separate from the legacy static site and from the product application.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (tokens live in `src/app/globals.css`)
- GSAP 3 + ScrollTrigger (`@gsap/react` for lifecycle) — the only scroll engine on the page
- Playwright for browser tests and visual QA

## Commands

```bash
npm run dev            # dev server (port 3400 via .claude/launch.json, or default 3000)
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm run build          # production build
npm run test:e2e       # build + Playwright invariant tests (desktop, short-desktop, tablet, mobile, reduced-motion)
npm run qa:shots       # section + scroll-progress screenshots at 1440 (scripts/qa-shots.mjs, --vw=390 for mobile)
npm run qa:perf        # scroll frame-time probe
npm run qa:video       # WebM motion evidence (add --reduced for the reduced-motion run)
```

## QA scripts

All run against a production server (`npm run build && npx next start -p 3501`):

- `node scripts/qa-shots.mjs http://localhost:3501 design-dump/after-1440 --full [--vw=1536 --vh=864] [--reduced]` — per-section and scroll-progress screenshots.
- `node scripts/qa-video.mjs http://localhost:3501 design-dump/after-video` — slow top-to-bottom and reverse scroll recording.
- `node scripts/qa-measure.mjs http://localhost:3501 1440 900` — pinned-element heights, runway per scene, footer bounds, Why stage fit, horizontal overflow.
- `node scripts/qa-footer-measure.mjs`, `scripts/qa-hover.mjs`, `scripts/qa-console.mjs`, `scripts/qa-perf.mjs` — footer child heights, testimonial hover/focus colours, console + failed requests during a full scroll, frame timing.
- `npx playwright test` — invariants in `e2e/homepage.spec.ts` and the regression guards in `e2e/regressions.spec.ts` (desktop-1440, short-desktop, tablet, mobile, reduced-motion).

## Architecture

- `src/app/page.tsx` composes the homepage from scene components in `src/components/home/`.
- Each interaction-heavy scene owns its markup **and** a motion hook in `src/lib/motion/scenes/`
  (`useSystemSceneMotion`, `useWhySpecialistMotion`, `usePlantFloorMotion`, `useProblemMotion`,
  `useHowItWorksMotion`, `useStakeMotion`, `useInsiderDnaMotion`, `useChemistryMotion`, `useFooterMotion`,
  `useHeroMotion`). GSAP owns transient animation state; React owns nothing animation-related.
- `src/lib/motion/gsap.ts` registers plugins once; `geometryCoordinator.ts` is the single debounced
  refresh path (window/visualViewport resize, orientation, fonts); `pinRegistry.ts` asserts in dev
  that two pinned scenes never own the viewport at once; `motionModes.ts` holds the matchMedia
  conditions (desktop-enhanced needs ≥1024 wide, ≥700 tall and no reduced-motion preference).
- `src/components/ui/FixedStage.tsx` renders a composition at its Figma pixel size and scales it
  to its container, so illustration geometry stays exact at every width.
- Design reference data: `src/data/heroSpecimen.ts`, `src/data/systemDiagram.ts`,
  `src/data/imageManifest.json`. Exact Figma exports live in `public/assets/`.

## Fonts

Headings use **Coolvetica**. Drop the licensed webfont at `public/fonts/coolvetica-rg.woff2`
and set `--heading-tracking` in `globals.css` to `0`. Until then the page falls back to a
locally installed Coolvetica (a QA-only copy is git-ignored) with a tracking compensation so
Figma's line breaks hold. Geist, Geist Mono, IBM Plex Mono and Gochi Hand load via `next/font`.

## Hero H

The homepage hero uses the approved Hero H composition: one original editorial portrait fills the
page-level field behind the navigation and copy, and the desktop/tablet field crossfades through the
four approved portraits on a calm 4.5-second hold with a 720ms transition. The copy and CTAs stay
fixed, and there are no teaser tiles or portrait videos. Reduced motion holds the opening portrait;
phone-sized layouts use an intentional image-free navy lockup. The former shutter loop remains only at
`/design-lab/hero/h` for internal comparison. Assets live in `public/assets/media/hero/portraits/`;
`SOURCE.txt` records their provenance.

## Routes

`/` (homepage, protected baseline), `/clients`, `/candidates`, `/contact`, `/about`, `/disciplines`,
`/jobs`. Non-home routes share `src/app/(site)/layout.tsx` (light header + footer). Forms post to
`/api/submit` (see `integrations/google-apps-script/README.md` for the Google backend and secrets).
Jobs read Airtable through `src/lib/jobs/source.ts` when `AIRTABLE_TOKEN`/`AIRTABLE_BASE_ID` exist,
otherwise the approved empty state renders.

## Staging deployment (Cloudflare Workers via OpenNext)

```bash
npm run build:staging     # SITE_ENV=staging → X-Robots-Tag: noindex on every response
npm run preview:staging   # local Worker preview
npm run deploy:staging    # deploys the Worker `surface-talent-staging` (wrangler.jsonc)
```

Secrets (owner): `npx wrangler secret put APPS_SCRIPT_URL --name surface-talent-staging`, same for
`SUBMISSION_SECRET`, optionally `AIRTABLE_TOKEN` / `AIRTABLE_BASE_ID`. Production is a separate,
later task; this config never touches the live domain.

## Deploying

Static-friendly Next.js app. Deployment target is not configured in this repo yet — the legacy
site's Cloudflare Pages project is documented in the old repository; do not deploy over it
without an explicit decision.

## Owner actions (staging acceptance)

1. **Forms backend** — deploy `integrations/google-apps-script/Code.gs` as a Web app (steps in that
   folder's README), then set the Worker secrets:
   `npx wrangler secret put APPS_SCRIPT_URL --name surface-talent-staging` and
   `npx wrangler secret put SUBMISSION_SECRET --name surface-talent-staging`. Until then `/api/submit`
   answers 503 and the forms show a recoverable "not switched on yet" message.
2. **Live jobs** — optional: `AIRTABLE_TOKEN` / `AIRTABLE_BASE_ID` secrets on the Worker (same Airtable
   base as the legacy site) turn the Jobs empty state into the live list.
3. **Coolvetica** — place the licensed `coolvetica-rg.woff2` in `public/fonts/`, move it to the front
   of the `@font-face` `src` list in `src/app/globals.css`, update the preload in `src/app/layout.tsx`,
   and set `--heading-tracking` to 0.
