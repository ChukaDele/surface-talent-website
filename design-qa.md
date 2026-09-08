# Surface site design QA

## Current direction

Hero H uses the approved static portrait composition on the production homepage and on the
non-indexed `/design-lab/hero/h-static` review route. The hero keeps one dominant portrait, a clean
navy scrim, the existing headline and calls to action, and the compact trusted-by row. It does not
use portrait video, autoplay, a WebGL canvas, teaser tiles, role labels or a page-scroll hero
controller.

The four approved portrait stills remain in `public/assets/media/hero/portraits/` as AVIF and WebP
sources, with calibrated crops and thumbnail fallbacks. Their provenance is recorded in
`public/assets/media/hero/portraits/SOURCE.txt`.

Reduced-motion behavior is static: the first portrait is shown, no crossfade starts, and no media
video or autoplay path exists. Compact layouts keep the copy and dominant portrait readable without
horizontal overflow. The old exploration routes (`/design-lab/hero`, `/design-lab/hero/h` and
`/hero-loop`) and their source, scripts and derivative media were removed on 2026-09-08.

## Required validation for this cleanup

Run these commands from the repository root after source changes:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`
- `npm run qa:shots`
- `git diff --check`

Browser review must cover 1440×900, 1280×800, 1024×768, 768×1024, 430×932 and 390×844. Check the
face crop, headline contrast, portrait balance, CTA hierarchy, trusted-by alignment, reduced motion,
zero horizontal overflow, zero accidental shadows and zero video requests.

## Historical note

Earlier QA records described a portrait micro-video loop and A2 illustration/WebGL comparison. Those
records were superseded by the approved static direction and are not evidence for the current build.
The repository keeps only this current record so future edits do not accidentally restore retired
hero elements.
