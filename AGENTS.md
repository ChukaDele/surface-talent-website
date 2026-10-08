# Agent instructions — Surface Talent website (v2)

Read before changing anything:

1. `README.md` — commands, architecture, fonts.
2. `docs/design-reference.md` — Figma node map, state-frame classification, and every known
   deviation from the design. Update it when you change a section.
3. The Surface Talent product repository's design docs (`docs/02_SURFACE_TALENT_DESIGN.md`,
   `03_MOTION_AND_INTERACTIONS.md`, `04_COMPONENT_RULES.md`, `07_MARKETING_WEBSITE_STRATEGY.md`)
   remain the design-DNA source; this site must share its typography, tokens and restraint.

Rules:

- Figma is the visual truth. Never redraw an exported asset by hand; re-export it.
- One scroll engine (GSAP ScrollTrigger). No second sticky/pin system, no autoplay narratives.
- Function-based `start`/`end`, `invalidateOnRefresh: true`, `gsap.matchMedia()` for every mode,
  and clean teardown (`clearProps` only the animated properties — never `"all"`, it wipes React
  inline styles).
- Figma `rotation` is counter-clockwise about the node's top-left origin: in CSS use
  `transform-origin: 0 0; rotate(-r)` at the node's `x, y`.
- Every rendered change gets `npm run lint`, `npm run typecheck`, `npm run build`,
  `npm run test:e2e` and a `npm run qa:shots` comparison against `design-dump/refs/`
  (the Figma renders; regenerate them from Figma if the design changes).
- Public routes in scope: `/`, `/clients`, `/candidates`, `/contact`, `/about`, `/disciplines`, `/jobs`
  (multipage brief of 2026-09-02). Do not add further routes without an explicit brief. The homepage
  is a protected baseline: shared-component changes must keep it visually and behaviourally intact
  (run the homepage e2e projects after touching header, footer, buttons, tokens or motion infra).
- Forms post to `/api/submit` and persist through the Google Apps Script web app in
  `integrations/google-apps-script/` (secrets `APPS_SCRIPT_URL`, `SUBMISSION_SECRET`). Never expose
  Google credentials client-side; never fake a working integration.
- Staging deploys to the Cloudflare Worker `surface-talent-staging` via `npm run deploy:staging`
  (OpenNext). Never deploy to the production domain / `surface-talent-website` Pages project from
  this repo without an explicit production brief.
