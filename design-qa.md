# Hero H micro-video QA

Status: PASSED

## Scope held

The approved `HeroPortraitLoop` composition remains unchanged: one dominant environmental portrait,
three narrow queued portraits, the same four portrait identities and ordering, the same responsive
geometry, and the same 3.2 second hold plus 0.9 second shutter transition. No role-family copy was
added. Commercial remains in a business setting; operations and technical subjects remain in their
approved industrial settings.

Only the portrait media layer changed. Each AVIF poster now has a persistent, silent micro-video
element with WebM first and MP4 fallback sources. The four video elements stay mounted while the
queue changes position and size, so a shutter transition does not restart playback.

## Media output

- Four VP9 WebM files and four H.264 MP4 fallbacks.
- Every file is 810x1080, 24 fps, approximately 8.21 seconds, and contains no audio stream.
- WebM transfer set: 487,450 bytes (approximately 476 KiB). MP4 fallback set: 667,991 bytes
  (approximately 652 KiB).
- Motion is a restrained, seamless camera move derived from each approved portrait. It does not
  synthesize a new person, expression, body movement, or environment.
- Active playback rate: `1`. Teaser playback rate: `0.35`.
- SHA-256 checksums and portrait provenance are recorded in
  `public/assets/media/hero/portraits/SOURCE.txt`.

## Deterministic checks

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with all 29 static pages generated.
- `npm run test:e2e`: 192 passed, 108 intentionally skipped by the existing browser-project matrix,
  0 failed.
- `npm run qa:shots -- http://127.0.0.1:3102 /private/tmp/surface-hero-portrait-qa/microvideo-qa-shots --full --vw=1440 --vh=900`:
  passed and captured every homepage section.
- FFprobe confirmed VP9/H.264 codec, 810x1080 dimensions, 24 fps duration, and no audio stream for
  all eight output files.
- WebM first-to-last-frame PSNR was approximately 44.59 to 46.38 dB across the four videos, providing
  a visually continuous media loop.

## Browser evidence

The owner requested local verification and prohibited deployment or remote changes. The site was
served on `127.0.0.1` only and tested through the Codex in-app browser at 100% browser zoom.

- Network cold reload: exactly four video requests, one unique WebM per portrait. Each returned
  `206 video/webm`; no duplicate request and no MP4 fallback request occurred in Chromium.
- Persistent playback: all four `currentTime` values advanced through shutter expansion and
  collapse. A queue-position change did not remount, reload, seek, or restart a video.
- Full rotation: `0 -> 1 -> 2 -> 3 -> 0` completed seamlessly. The dominant portrait stayed in the
  left-most slot in every state.
- Playback hierarchy: one active video ran at `1x`; the three teaser videos ran at `0.35x`.
- Offscreen lifecycle: all four videos paused after the hero left the viewport, their time values
  remained identical through a 1.1 second offscreen sample, and they resumed without seeking.
- Hidden-document lifecycle: a deterministic `document.hidden` plus `visibilitychange` browser
  check paused all four videos, held their times through a 0.9 second sample, and resumed them without
  seeking when visibility returned.
- Reduced motion: zero WebM or MP4 requests; four AVIF posters visible; video elements hidden,
  paused, at time `0`, and at ready state `0`; no autoplay; portrait `0` remained active after 4.2
  seconds; the cinematic technical handoff stayed disabled.
- Long-run network and memory sample: after 33 seconds and two complete portrait rotations, no
  repeated media request occurred. Active state returned to `0`. JavaScript used heap increased by
  431,304 bytes while total heap fell by 4,194,304 bytes. Node, document, frame, layout-object,
  listener, resource, and array-buffer counts all had zero delta. Forced garbage collection was not
  available in the controlled browser, so this is a bounded sample rather than a leak proof.
- Final console inspection: zero errors and zero warnings.
- Role-family copy locator: zero matches.

## Responsive evidence

Every viewport retained one dominant portrait, three visible teasers, a ready/playing media layer,
the active portrait in the left-most slot, and zero horizontal overflow.

| Viewport | Media region | Active width | Teaser width |
| --- | --- | ---: | ---: |
| 1440x900 | 704x612 | 483 px | 64 px |
| 1280x800 | 616x544 | 423 px | 56 px |
| 1024x768 | 475x540 | 347 px | 39 px |
| 768x1024 | 420x620 | 306 px | 34 px |
| 430x932 | 390x516 | 284 px | 32 px |
| 390x844 | 350x468 | 254 px | 28 px |

## Visual artifacts

- Responsive matrix: `/private/tmp/surface-hero-portrait-qa/microvideo-responsive-matrix.png`
- Desktop frame: `/private/tmp/surface-hero-portrait-qa/microvideo-desktop-1440.png`
- Reduced-motion frame: `/private/tmp/surface-hero-portrait-qa/microvideo-reduced-1440.png`
- Full homepage capture set: `/private/tmp/surface-hero-portrait-qa/microvideo-qa-shots/`

## Closure

No Git remote, preview, deployment, production route, or unrelated homepage section was changed.
The temporary local server is stopped at task close. Major remains at the project policy's `observe`
trust level with external writes disabled.

# Historical pre-exception finishing QA record (superseded below)

Status: superseded by the owner-approved local-browser acceptance record below

## Scope held

This pass is limited to the requested clients-page polish and the static Hero H comparison preview.
The homepage Hero H portrait loop, its four identities, timing, queue geometry and silent loop media
remain unchanged. The new comparison route is `/design-lab/hero/h-static`; it is non-indexed and
picture-first, with one dominant environmental portrait, three right-hand teaser strips, a clean navy
scrim, the existing headline and CTAs, and no role-family copy. It has no video, autoplay, looping,
Three.js scene or page-scroll choreography.

## Phase 1 changes

- Client profile photos no longer use CSS blur; the existing bottom scrim remains a restrained
  readability layer.
- Buttons no longer use shadows. Hover uses a quick left-to-right colour sweep, clean border/colour
  change and a small up-right arrow travel. Press feedback is controlled and non-bouncy.
- Card hover keeps a 2px lift without an outer shadow.
- The LinkedIn mark is now a grounded, in-flow labelled link with a keyboard-sized target.
- Contact and clients hero transitions use the following section's own top padding instead of an
  empty spacer block.

## Deterministic validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; Next generated 30 static pages, including `/design-lab/hero/h-static`.
- `git diff --check`: passed.
- Built static HTML contains one `data-static-main` portrait and three `data-static-teaser`
  portraits, AVIF/WebP sources, headline, CTAs and trusted-by content, with no video element.
- Source scan finds no stale LinkedIn rope/pendulum or contact spacer references.
- Existing homepage H loop media and motion components were not modified by the static preview work.

## Browser evidence

Browser verification is intentionally pending. A read-only connectivity check from the authorized
shell reached the existing server in this worktree with `HTTP 200`; the visible in-app browser is
currently pointed at `http://127.0.0.1:3102/`, but the active repository policy rejects loopback
targets for application preview and QA. The earlier local-browser exception was scoped to the A2
design-lab QA and does not cover this finishing task. No responsive screenshots, hover observations,
reduced-motion runtime observations or performance claims are recorded here until the owner grants
a current exception or supplies an authorized Cloudflare preview URL.

## Historical remaining risk

The static Hero H route is a comparison preview, not a replacement for the homepage H loop. This
historical record was written before the owner-approved local-browser exception. No remote,
deployment or production route was changed.

# Surface site finishing QA — current owner-approved acceptance — 2026-09-03

Status: BROWSER QA PASSED — APPROVE STATIC HERO (comparison preview only)

## Scope held

This pass stayed within the clients-page polish and static Hero H comparison preview. The homepage
Hero H loop remains the live homepage concept with the same four identities, queue order, 3.2 second
hold, 0.9 second shutter transition, persistent video elements and silent WebM-first media. The new
`/design-lab/hero/h-static` route is non-indexed and picture-first. It has one dominant environmental
portrait, three right-hand teaser strips, the existing headline, CTAs and trusted-by content. It has
no video, autoplay, looping, Three.js scene or page-scroll choreography.

## Phase 1 changes and evidence-backed refinement

- Client profile photos render without CSS blur. Their restrained bottom scrim remains for metadata
  contrast. Browser inspection reported `filter: none` on the visible portraits.
- Buttons have no box shadow. The primary sweep moved from a partial `matrix(0.934, 0, 0, 1, 0, 0)`
  at 70 ms to `matrix(1, 0, 0, 1, 0, 0)` after 330 ms. The focus state uses a 2 px copper outline.
- Card hover keeps the existing small lift without an outer shadow.
- The LinkedIn mark is an in-flow labelled link with a 54.6 px keyboard-sized target.
- Contact and clients hero transitions use the following section's own top padding instead of an empty
  spacer block.
- At or below 767 px, the static specimen remains visible alongside the shared mobile layout. The
  previous hide rule only enabled the live loop variant, so the static comparison was absent on
  compact screens until this pass.
- Browser captures found the static teaser rail crossing the second CTA at 390/430 widths. The rail
  now sits at `bottom: 2%` on compact screens. The measured teaser top is 411.4 px and the CTA bottom
  is 403.8 px at 390 px, leaving a clear gap. These two compact-screen fixes were the only visual
  refinements made in this pass.

## Deterministic validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `SITE_ENV=staging npm run build`: passed; Next generated 30 pages, including
  `/design-lab/hero/h-static`.
- `git diff --check`: passed.
- Built static HTML contains one `data-static-main` portrait and three `data-static-teaser` portraits,
  AVIF/WebP sources, headline, CTAs and trusted-by content, with no video element.
- Source scan finds no stale LinkedIn rope/pendulum or contact spacer references.
- The focused in-app browser pass found no console errors or warnings on the homepage or static route.

## Browser evidence

The owner-approved local exception was used only for this pass. The staging build was served on
`127.0.0.1:3102` and inspected in the Codex in-app browser at the requested viewports.

### Static Hero H responsive matrix

The browser backend reports a 0.8 CSS-pixel viewport scale. Requested dimensions are listed first;
the measured browser dimensions are in parentheses.

| Requested viewport | Measured browser viewport | Static main | Teasers | Overflow | Videos |
| --- | --- | --- | ---: | --- | ---: |
| 1440x900 (1152x720) | 1152x720 | 1152x720 | 3 x 59.9 px | none | 0 |
| 1280x800 (1024x640) | 1024x640 | 1024x640 | 3 x 53.2 px | none | 0 |
| 1024x768 (819x614) | 819x614 | 420x748 | 3 x 57.3 px | none | 0 |
| 768x1024 (614x819) | 614x819 | 622x888 | 3 x 48 px | none | 0 |
| 430x932 (344x745) | 344x745 | 352x748 | 3 x 34.4 px | none | 0 |
| 390x844 (312x675) | 312x675 | 320x748 | 3 x 34 px | none | 0 |

All six static frames keep the copy readable, preserve the dominant portrait and show all three
teaser strips. The phone captures intentionally use a taller natural-flow hero rather than forcing a
desktop cinematic transition into a narrow viewport.

### Homepage Hero H media

- Cold navigation requested exactly one AVIF poster and one WebM per portrait. All four WebM responses
  returned `206 video/webm`; no MP4 fallback or failed request occurred.
- A further 17 second sample completed more than one rotation and requested zero additional media
  resources. Current times continued advancing and the active queue reached portrait `3` during the
  sample.
- The persistent panels rotated `0 -> 1 -> 2 -> 3 -> 0`. The active panel stayed in the left-most
  slot. Active playback ran at `1x`; teasers ran at `0.35x`.
- At scroll position 1900, the hero was fully outside the viewport and all four videos were paused.
  Returning to the top resumed all four without seeking.
- A CDP Performance sample over eight scroll moves recorded 102 layouts, 201 style recalculations,
  0.228 s total task duration and a 1.23 MB bounded heap increase, with zero console errors or
  warnings. This is a focused sample, not a leak proof.

### Reduced motion

With `prefers-reduced-motion: reduce` emulated, the homepage held portrait `0`, set media state to
`paused`, hid and paused all four videos at time `0`, kept the strongest AVIF poster visible, and hid
the cinematic handoff section. Copy and CTAs remained visible. The captured static preview likewise
contains no video element and no autoplay path.

### Supporting compositions

The clients capture shows crisp imagery and readable metadata before and during a card lift. The
section transition captures show the system's cross-section arriving before the following “Why
specialist” section, without a blank spacer. The LinkedIn capture shows the labelled link in flow above
the years-of-experience composition, rather than as an unattached floating mark.

## Visual artifacts

All current captures are in `/private/tmp/surface-site-polish-visual/`:

- `hero-static-1440x900.jpg`, `hero-static-1280x800.jpg`, `hero-static-1024x768.jpg`,
  `hero-static-768x1024.jpg`, `hero-static-430x932.jpg`, `hero-static-390x844.jpg`
- `button-default-1440.jpg`, `button-hover-mid-1440.jpg`, `button-hover-complete-1440.jpg`,
  `button-focus-1440.jpg`
- `clients-1440.jpg`, `clients-hover-1440.jpg`
- `homepage-top-1440.jpg`, `homepage-transition-520-1440.jpg`, `homepage-transition-1160-1440.jpg`,
  `homepage-transition-1850-1440.jpg`, `homepage-transition-2350-1440.jpg`
- `linkedin-1440.jpg`, `hero-loop-reduced-1440.jpg`

## Closure

No Git remote, push, deployment, production route, production configuration or unrelated homepage
section was changed. The static route remains a comparison preview and does not replace `/`. The
temporary local server and browser tabs are closed at task close. Major remains at `observe` with
external writes disabled.
