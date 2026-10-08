# Surface Talent — website (v2)

The Surface Talent marketing website supplied in Chris's October 7, 2026 export.
The October release uses the Brand and Launch Pack palette and typography, a static premium
hero, and restrained page transitions. `docs/brand-system.md` and the supplied export screenshots
are the current visual reference. The earlier Figma implementation remains in Git history.

The release joins the legacy GitHub `main` history, the existing v2 history, and the export's
18 original commits without rewriting any of them. It remains separate from the product application.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (tokens live in `src/app/globals.css`)
- GSAP 3 + ScrollTrigger (`@gsap/react` for lifecycle) — the only scroll engine on the page
- Playwright for browser tests and visual QA

## Commands and remote QA

```bash
npm ci
npm run lint
npm run typecheck
npm run build:staging
npm run deploy:staging
RELEASE_BASE_URL=https://surface-talent-staging.<subdomain>.workers.dev npm run test:e2e:only -- --config=playwright.release.config.ts
npm run qa:shots -- https://surface-talent-staging.<subdomain>.workers.dev design-dump/qa --full
```

Use GitHub and a Cloudflare preview before browser QA. Do not start a local application server.
`playwright.release.config.ts` targets remote HTTPS deployments and does not launch a server.
It tests desktop, short desktop, tablet, mobile and reduced motion. It excludes historical design
experiments and the local Apps Script test double, which writes submissions. Release checks inspect
forms without submitting enquiries. Set `RELEASE_ENV=production` for production checks.

Acquire the appropriate Major build/browser leases and run `major web preflight` before browser QA.
The general historical Playwright configuration and motion scripts are retained for reference;
the remote release configuration and `qa:shots` are the current launch entry points.

## Architecture

`src/app/page.tsx` composes `HeroPremium`, `WhyGeneralists`, `WhoWeAre`, `WhoWePlace`, `Process`
and `Testimonials`, with the shared header and footer. `PageMotion` owns the remaining page
transitions. The public homepage does not mount the former pinned illustration narrative.
Older scene components and design experiments are retained in this export. Internal design-lab
routes return 404 in production. Public components use the tokens in `src/app/globals.css` and
the brand rules in `docs/brand-system.md`.

## Fonts

Brand typography from the Brand and Launch Pack: **Inter Tight** (headlines), **Inter** (body) and
**IBM Plex Mono** (labels, codes, figures). All three are SIL OFL and self-hosted from `src/fonts/`
through `next/font/local`, so builds need no network and every visitor sees the same faces.
Coolvetica is retired (it was never shipped as a webfont, so visitors were seeing fallbacks).
See `docs/brand-system.md` for the full palette, type scale and component rules.

## Visual reference

`docs/design-reference.md` records the October export as the current reference and preserves the
historical Figma map. The homepage is typographic and static. Portrait loops, mock interface
illustrations and the former scroll narrative are absent from its public composition.

## Routes

`/` (homepage, protected baseline), `/clients`, `/candidates`, `/contact`, `/about`, `/disciplines`,
`/jobs`. Non-home routes share `src/app/(site)/layout.tsx` (light header + footer). Forms post to
`/api/submit` (see `integrations/google-apps-script/README.md` for the Google backend and secrets).
Jobs read Airtable through `src/lib/jobs/source.ts` when `AIRTABLE_TOKEN`/`AIRTABLE_BASE_ID` exist,
otherwise the approved empty state renders.

## Cloudflare deployment

OpenNext deploys a Next.js Worker, including `/api/submit` and `/api/jobs`.
Top-level `wrangler.jsonc` targets `surface-talent-staging`. `env.production` targets
`surface-talent-website` in Chris's account (`7d906c42ff7b64c0435b6d4c449fe77a`) and the existing
`surfacetalent.co.uk` and `www.surfacetalent.co.uk` custom domains.

```bash
npm run build:staging
npm run deploy:staging
# Only with an explicit production brief, after remote staging QA and promotion through main:
npm run build:production
npm run deploy:production
```

Build with the matching `SITE_ENV`: staging must be `noindex`, while production must be indexable.
Worker secrets remain provider-managed. Never commit their values or replace them during a visual
release: `APPS_SCRIPT_URL`, `SUBMISSION_SECRET`, `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`.
The forms persist through the Google Apps Script integration. Jobs read Airtable when configured.
Check `/api/jobs` directly because the public empty state also appears when the upstream is unavailable.

## History and rollback

The October integration commit has three parents: the prior GitHub main, the current website v2,
and the supplied export. Merge this release normally; do not squash or rebase it.
Rollback tags preserve the previous website and main tips:
`archive/website-before-chris-20261008` and `archive/main-before-chris-20261008`.
Record the previous production Worker version before deployment so runtime rollback does not depend
on rebuilding an old source checkout.
