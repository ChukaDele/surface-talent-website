# Legacy site → v2 URL map

Audited 2026-09-02 against the live legacy site (static HTML on Cloudflare Pages, served from the
Surface Talent Cloudflare zone). Every legacy page has a destination; nothing is dropped.

## Inventory

The legacy site has ten real pages. All of them already serve on clean URLs, and the `.html`
forms 308-redirect to those clean URLs at the edge.

| Legacy URL | v2 URL | Status |
| --- | --- | --- |
| `/` | `/` | rebuilt |
| `/candidates` | `/candidates` | rebuilt |
| `/clients` | `/clients` | rebuilt |
| `/disciplines` | `/disciplines` | rebuilt, plus five new detail pages |
| `/jobs` | `/jobs` | rebuilt |
| `/about` | `/about` | rebuilt |
| `/contact` | `/contact` | rebuilt |
| `/privacy` | `/privacy` | content migrated |
| `/cookies` | `/cookies` | content migrated |
| `/modern-slavery` | `/modern-slavery` | content migrated |

Because the paths are identical, no cross-URL redirects are needed for the cutover. The v2 site
additionally 301s `/index.html` and `/:page.html` to the clean URLs, so any external backlink
still pointing at a `.html` address keeps resolving after the Pages project is replaced.

## New URLs with no legacy equivalent

`/terms`, `/accessibility`, `/privacy-requests`, `/candidate-privacy`, `/responsible-ai`, and
`/disciplines/electroplating|anodising|powder-coating|heat-treatment|thermal-spray`.

On the legacy site these paths return the homepage with a 200, which is a soft 404. The v2 site
returns either the real page or a genuine 404, so this is an improvement rather than a regression.

## Defects in the legacy site that v2 fixes

- **No `robots.txt` and no `sitemap.xml`.** Both paths return the homepage HTML with a 200.
  v2 serves generated `robots.txt` and `sitemap.xml`.
- **Soft 404s.** Every unknown path returns the homepage with a 200, which lets search engines
  index unlimited duplicate URLs. v2 returns real 404s.
- **A live Airtable credential in client-side JavaScript.** See `docs/launch/owner-actions.md`.

## Post-cutover checks

1. `curl -sI https://surfacetalent.co.uk/candidates.html` returns 301/308 to `/candidates`.
2. `https://surfacetalent.co.uk/robots.txt` allows crawling and names the sitemap.
3. `https://surfacetalent.co.uk/sitemap.xml` lists the public routes only.
4. No page carries `noindex` and no canonical points at a staging hostname.
5. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
