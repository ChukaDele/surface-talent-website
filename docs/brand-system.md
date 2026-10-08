# Surface Talent — website brand system (October 2026)

Source: *Surface Talent – Brand and Launch Pack* (§2 Brand identity brief). Tokens live in
`src/app/globals.css`; shared components in `src/styles/brand.css` (`st-brand` layer) and
`src/components/site/{PageHero,Blocks,Logo}.tsx`.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--anthracite` | #1C1F22 | Dark surfaces, ink |
| `--chalk` | #F5F5F2 | Page heroes and alternate sections |
| `--nickel` | #C0C5C9 | Hairlines, muted text on dark |
| `--copper` | #B87333 | Rules, marks, logo, illustration coating layer |
| `--steel` | #3A4A5C | Secondary text on light, line drawings, hero depth |
| `--signal` | #C0392B | **Only** the Live job tag and error states |

Contrast-safe derivatives (WCAG AA for small text):

| Token | Hex | Use | Ratio |
|---|---|---|---|
| `--copper-action` | #9C622B | Button fill, white label | 5.0:1 |
| `--copper-text` | #9C622B | Copper labels on white/chalk | 4.6–5.0:1 |
| `--copper-on-dark` | #C98A4E | Copper labels on anthracite | 5.7:1 |
| `--text-2` (steel) | #3A4A5C | Secondary text on chalk | 8.3:1 |
| `--text-3` | #5B6670 | Captions, meta on chalk | 5.4:1 |
| nickel on anthracite | #C0C5C9 | Secondary text on dark | 9.5:1 |
| `--rule` | #DADDDF | Hairline on light | decorative |

## Surfaces

Three only: white, chalk, anthracite. Inner-page heroes are chalk; sections alternate; the footer
is always anthracite. No gradients except the faint steel-blue lift behind the homepage headline.

## Type

| Class | Face | Size / leading | Tracking |
|---|---|---|---|
| `.st-h1` | Inter Tight 500 | 64 / 1.04 (hero 84) | −0.032em |
| `.st-h2` | Inter Tight 500 | 44 / 1.08 | −0.028em |
| `.st-h3` | Inter Tight 500 | 30 / 1.15 | −0.022em |
| `.st-h4` | Inter Tight 500 | 21 / 1.3 | −0.016em |
| `.st-body-lg` / `.st-body` | Inter | 18 / 16 | −0.014 / −0.011em |
| `.st-eyebrow`, kickers | IBM Plex Mono 500 | 11–12, uppercase | 0.14em |

Every eyebrow is led by a 24px copper rule (the brand's "coating layer" line). No diamonds.

## Components

- **PageHero** — every inner page: chalk, left-aligned eyebrow / headline / lede / actions, hairline
  close; optional right-hand `aside` (candidate form, discipline drawing).
- **Section / SectionHead** — `tone` white | chalk | dark; heading `stack` or `split` (lede right).
- **RuleGrid** — the one grid for roles, pillars and challenges: hairline table, no boxes.
- **Steps** — numbered columns on a single top rule.
- **Pair** — two panels split by a hairline (retained vs contingent, register vs browse).
- **Buttons** — 44px, 2px radius. Primary is copper on every surface; secondary is an outline
  (anthracite on light, nickel on dark) that fills on hover.
- **Logo** — inline SVG lockup drawn to the master logo's geometry; tank and SURFACE take
  `currentColor`, TALENT and the bath are copper.
- **Illustration** — one family only: the discipline line drawings, in steel with copper coating.

## Rules

- Never write a raw colour in a component; add a token.
- Left-aligned on every breakpoint. Nothing is centred.
- Signal red appears for the Live tag and errors, nowhere else.
