# Design reference — homepage

Figma file: `Surface Talent (Copy)` · key `UEi5kOOH84s4Vb2VXo5dZK` · page "Design".
Renders of every Figma section used for QA live in `design-dump/refs/` (git-ignored; regenerate via
the plugin API when the design changes). Structural dump: `design-dump/bundle.json` and
`design-dump/outline-*.txt`.

## Node map

| Site section | Component | Figma node(s) | Classification |
|---|---|---|---|
| Header + Hero | `Hero`, `Header`, `HeroSpecimenStatic` | `35:228` (Hero 1440×820), nav `35:229` | canonical |
| Zoom into the system | `SystemScene`, `SystemDiagram`, `RoleBriefCard` | `35:144` (01 — Surface read), `36:336` (02 — Cross-section), `36:350` (03 — Specialist read) | **interaction states of one pinned scene** — state 3 is state 2 scaled 0.5 about (−203, −81.6) |
| Why specialist stack | `WhySpecialist` | `39:791` (Container 1440×2402, cards `40:910`, `45:924`, `45:935`, `48:1184`) | canonical, sticky stack |
| Insider DNA | `InsiderDna` | `115:99375` → `53:1547` (counter `116:99382`, LinkedIn `116:99421`, pillars `116:99413`, partner `53:1608`) | canonical |
| Plan to floor / What we know | `InsiderDna` (`.st-floor`) | `115:99231` + loose **Frame 45** `53:1767` | Frame 45 = the same four-card row further along the horizontal travel — not a new section |
| The problem | `Problem` | `53:1946` (Defect 01) + loose **Frame 29** `53:2135` (Defect 02) + **Frame 66** `57:17326` (Defect 03) | one progressive card stack |
| What our clients say | `Testimonials` | `57:17364` | canonical |
| How it works | `HowItWorks` | `57:26165` + loose **Frame 91** `116:99442` | Frame 91 = the full 2260px row (5 steps) — the horizontal sequence, not a new section |
| Where we work | `Disciplines` | `58:30981` | canonical |
| What we recruit | `Functions` | `69:48498` | canonical |
| What's at stake | `Stake` | `95:57950` (final) + loose **Container** `95:62404` (initial, vertical) | initial → final states of one interaction |
| Closing CTA + footer | `Footer` | `69:48765` | canonical |
| — | — | `2027:20831`, `2013:18920`, `2013:18833`, `2027:20646` (light hero variants), `2013:18684` (profile cards), Clients/Candidates/… frames | **excluded** — other pages / explorations |

Components: Primary Button `2011:14`, Secondary Button `2012:8` (state colours in `home.css`).
Tokens: variables collection "Colors" (Primary/Secondary/Neutral ramps) → `globals.css`.
Text styles: Geist body 18/16/14/12, Coolvetica H1 64 / H2 48 / H3 32 / H4 24, Geist Mono eyebrows 12/16 tracking 2 uppercase.

## Multipage node map (2026-09-02)

| Route | Canonical frame | States / related | Excluded |
|---|---|---|---|
| `/clients` | 2010:2 Clients 1440×5020 | 2027:20831 Hero = scroll START state (cards in a bowl) → resolved strip in 2010:2 | — |
| `/candidates` | 2027:20100 1440×3991 | active-nav diamond; Input field 2027:20946 | — |
| `/contact` | 2032:21127 1440×2954 | dark form card; three cream cards | — |
| `/about` | 2036:240 1440×3565 | 2048:1475/1483/1488/1493/1516 = keyframes of the EMC scroll sequence | — |
| `/disciplines` | 2036:521 1440×5745 (grid 2050:190) | 2051:190 Variation 1 = hover/focus treatment | 2050:352 single-column variant, 2051:490 split-screen exploration |
| `/jobs` | 2048:1072 1440×2557 | empty state is the approved default | — |

Shared: header 55px with the current-route diamond (`aria-current="page"`), footer = homepage closing
block. Page renders and text outlines live in `design-dump/pages/` (gitignored; see `NOTES.md` there).

## Assets

Exact Figma exports in `public/assets/svg` (icons, discipline illustrations, network lines, wordmark)
and `public/assets/img` (logos, avatars, stamps, card headers, accreditation
marks at 2×; grunge stamps at 2–3×). The zoom-diagram slabs are rebuilt from Figma vector geometry
(`src/data/systemDiagram.ts`) because exports of those layers are clipped by their parent frame.
The "Assess" illustration (Frame 92) is rebuilt in DOM from its node geometry because its export
rendered blank.

## Known deviations (2026-09-02)

1. **Coolvetica** — the licensed webfont is not in the repo. Fallback: locally installed Coolvetica
   (git-ignored QA copy) + `--heading-tracking: -0.03em` to hold Figma's line wraps. Owner action:
   add `public/fonts/coolvetica-rg.woff2` and set the token to 0.
2. **`standard-img8` (third accreditation mark)** exported as an empty image from Figma; the slot
   renders blank until the source image is re-exported from a healthy fill.
3. **LinkedIn grounding** — the original suspended decorative rope treatment is restored. The mark
   is intentionally not a link, focus target or pointer target; it is decorative and motion-owned by
   the existing pendulum helper.
4. **Hex-cell hatch lines / calendar grid** — Figma's gradient-stroke hairlines are reproduced with
   repeating gradients (same positions/opacity), not exported paths.
5. **Why-specialist stage** — one pinned 100svh stage holds the heading and the card stack; the
   960×780 authored stack (4 cards, 100px peeks) is scaled to the room under the heading (≈0.79 at
   1440×900, 0.61 at 1280×720) so nothing is ever clipped. Travel is derived: 3 card entries at
   0.5vh each, a 0.35vh dwell on the landed 04 Match card, then a 0.6vh morph in which the card's
   rectangle grows to the viewport and becomes the Insider DNA background (`#131e27`), so there is
   no seam or top-edge section change. Figma has no stacked state.
6. **Responsive** — Figma has desktop frames only. Below 1024px: natural flow, horizontal scenes
   become swipe rows with scroll-snap, stacks become vertical cards, stake shows the final state.
   Between 1024 and 1440 the 1440 composition centres with fluid gutters.
7. **"20+" noise** — Figma's NOISE layer effect is approximated with an SVG turbulence mask.
8. **Mobile header** — no mobile nav exists in Figma; below 1024px the link row is hidden and the brand + "Brief us" CTA remain (a menu is a follow-up once other pages exist).
9. **Marquee** — the footer logo strip scrolls continuously (Figma shows a static masked strip).
10. **Hero media** — the old A2/WebGL and portrait-video experiments are retired. The homepage and
    the non-indexed `/design-lab/hero/h-static` review route use the approved static portrait
    composition. It has no canvas, video request, page-scroll choreography or competing scene
    controller. Reduced motion keeps the first portrait still and disables the crossfade.
11. **Testimonials hover state** — Figma shows the middle card dark; that is interpreted as the
    active state. All three cards are light by default; hover / keyboard focus animates a card to
    navy with a 2px lift and no outer shadow (GSAP, reversed on leave). Touch taps do not trigger it.
12. **Footer + final CTA within 100svh** — at desktop the footer is a flex column sized to the
    viewport (title `clamp(40px, 6vh, 64px)` and vh-based gaps). Below 1024px or under 760px tall it
    flows naturally. Nothing is clipped and there is no internal scroll; the compact footer brand
    lockup is the only Surface Talent mark in the footer.
13. **Short desktops (< 700px tall at ≥ 1024px)** — no scene pins; Why, Problem and System render
    their natural-flow layouts (same as reduced motion), capped at their authored widths.
14. **Console** — the retired WebGL scene is no longer part of the bundle. The only known asset
    exception remains the missing licensed Coolvetica file (see 1).
15. **Multipage pass (2026-09-02)** — Clients hero: Figma start frame → resolved strip is one scrubbed,
    pinned timeline (0.9vh travel); cards keep their Figma coordinates in a centred 1440 stage.
    Candidates "A proper process" uses four distinct isometric illustrations (Figma repeated one
    placeholder); Clients "critical hires" / "volume and speed" use production illustrations
    (`public/assets/illustrations/`, generated in-house to the Figma line language). About EMC
    section: the five Container keyframes became a pinned three-beat sequence. Disciplines: two per
    row from 2036:521; Variation 1 is the hover/focus state (cards are focusable so keyboard users
    reach it). Mobile header: Menu button (Figma has no mobile nav). Forms: Figma fields kept, with
    a "More about you" disclosure (candidates) and conditional hiring/career-move fields (contact).
    Footer on the new pages is the homepage footer verbatim (Figma repeats it on every frame).
16. **Discipline icons** — only lanes 01–05 and 11 have icons in Figma; the others render without
    artwork (as designed).
17. **Contrast (documented, not changed)** — Figma's copper (`#b87333`) primary buttons carry white
    12px labels at 3.8:1 and copper eyebrows on white sit at 3.7:1; both are the brand system and are
    left as designed (Lighthouse accessibility still ≥ 96). Form-only text that Figma does not specify
    (hints, disclosure, privacy link, select placeholder) uses darker tokens to pass AA.
18. **Homepage image aspect ratios** — five homepage mock images are placed at Figma sizes that differ
    slightly from their intrinsic ratio (Lighthouse best-practices note); intentional, unchanged.
19. **Lighthouse SEO on staging** — `is-crawlable` fails by design (staging is `noindex`); production
    technical SEO is a later task.
20. **Correction pass (2026-09-02, evening)** — Footer circle is clipped to end 56px under the CTA
    buttons with a soft fade. Buttons: hover = clear colour step, a quick
    left-to-right fill, restrained lift and up-right arrow travel with no shadow; press compresses.
    Nav and footer links: copper accent line from the left on
    hover; header is fixed and direction-aware (hides after 56px of accumulated downward scroll,
    returns after 18px upward, never while the menu is open or focused). Testimonials use a shared
    subgrid so metric / label / body / rule / author rows align. Homepage "Where we work" and "What we
    recruit", Clients recruit grid and Candidates roles grid are static (informational). Why
    Specialists: morph start is a timeline-owned set (reversible), runway 4.5 units, DNA heading enters
    on arrival. Bath chemistry: soft-body particle sim (spring home, soft repulsion, damping,
    Brownian drift). About: EMC lockup rebuilt from the cropped mark + typeset wordmark (the export
    carried a white-on-white wordmark). Forms: Radix-based themed select; the bright "I'm hiring"
    treatment is hover/focus/open only. Legal: eight legacy pages migrated verbatim under `/legal/*`.
    Disciplines: full 14-icon set with one `data-anim` moving part per drawing (≤ 1 s on hover/focus).
21. **Hero H static production direction (2026-09-03)** — H is the homepage default. One original
    environmental portrait fills the hero behind the fixed navigation, headline and calls to action.
    Desktop and tablet widths crossfade through the four approved portrait images with a 4.5-second
    hold and a 720ms transition. A single navy scrim preserves copy contrast without a smoky top/bottom
    feather, and every image keeps its calibrated crop. There are no teaser tiles, role labels,
    captions, portrait videos, WebGL scenes or moving copy. Reduced motion holds the opening portrait.
    Phone-sized layouts intentionally use an image-free navy lockup. The old `/design-lab/hero/h`, A2
    and `/hero-loop` experiments were removed in the 2026-09-08 cleanup.

22. **Site finishing pass and Hero H housekeeping (2026-09-03)** — Client profile imagery keeps its
    material detail without a CSS blur filter; the bottom scrim remains a restrained readability layer.
    Buttons use a crisp border and a left-to-right colour sweep on hover, with no button shadow, and
    the arrow travels up and right. Press states stay short and controlled. Card hover uses a 2px lift
    without an outer shadow. The LinkedIn mark in Insider DNA uses the original suspended decorative
    treatment without a hyperlink, pointer target or accessible action. Contact and clients page hero
    transitions use the following section's own top padding instead of an empty spacer block.
    `/design-lab/hero/h-static` remains the internal, non-indexed source-of-truth preview for the
    production hero: one dominant full-bleed portrait crossfade, the clean navy scrim and the compact
    footer-style trusted-by row. The homepage has no teaser queue, and its phone layout has no hero
    photography or trust row.

23. **Hero cleanup (2026-09-08)** — Retired A2 illustration, Three.js, portrait-shutter and generated
    video routes, source modules, scripts and derivative media were removed. The approved static
    portrait assets remain the only Hero H media. The preview route is intentionally retained for
    visual review and is excluded from the sitemap and robots indexing.
