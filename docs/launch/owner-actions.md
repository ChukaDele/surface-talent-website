# Owner-controlled actions

Everything here needs an account, credential or business decision that this repository and the
credentials available to it cannot supply. Nothing below is blocked on further engineering.

## 1. Rotate the exposed Airtable credential — urgent, do this first

The **live legacy site** ships an Airtable personal access token in client-side JavaScript on its
homepage, next to the base id, inside an inline `<script>` that queries the Jobs table. Anyone who
views source has full API access to that base with the token's permissions.

- Token prefix: redacted (the base and table are recorded only to identify the affected legacy integration).
- Action: revoke that token in Airtable, issue a replacement, and never place it in page source.
- The v2 site already keeps Airtable server-side: `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` are
  Worker secrets read only in server code, so the replacement token is not exposed by v2.

This exposure exists today, independently of the relaunch. Rotating the token is worth doing
immediately rather than waiting for the cutover.

## 2. Production deployment access

The production Worker is already serving the Surface Talent site. Future releases must use the
Surface Talent Cloudflare account and the production environment in `wrangler.jsonc`.

- `surfacetalent.co.uk` is on Cloudflare nameservers `dora.ns.cloudflare.com` and
  `jose.ns.cloudflare.com`.
- The zone lives in **Chris@emccapital.uk's Account**, id `7d906c42ff7b64c0435b6d4c449fe77a`,
  which the `tech@surfacetalent.co.uk` Cloudflare login can reach. That is the production target.
- A Wrangler session authenticated to another Cloudflare account must be re-authenticated before a
  production deploy. Confirm the account and route lookup before publishing.

For a future production release, from a shell authenticated to the Surface Talent account:

```bash
npx wrangler login && npx wrangler secret put APPS_SCRIPT_URL --env production && npx wrangler secret put SUBMISSION_SECRET --env production && npm run deploy:production
```

`wrangler.jsonc` already defines `env.production` as the Worker `surface-talent-website` with
custom-domain routes for `surfacetalent.co.uk` and `www.surfacetalent.co.uk`. Deploying it from
any other account fails on the route lookup instead of publishing to the wrong place.

## 3. Cloudflare bot management on the production zone

The application serves identical full HTML to `Googlebot`, `Bingbot`, `OAI-SearchBot` and
`PerplexityBot`, and does not block CSS or JS. What cannot be verified from here is the zone's own
bot settings. On the Surface Talent zone, confirm:

- Bot Fight Mode is **off** (it challenges verified crawlers).
- No WAF or rate-limiting rule challenges verified bots or the `/sitemap.xml` and `/robots.txt`
  paths.
- Managed Challenge is not applied to the whole zone.

Do not disable security zone-wide. Verified-bot allowances are the correct instrument.

## 4. Search engine registration

- Google Search Console: verify `https://surfacetalent.co.uk`, submit `/sitemap.xml`, request
  indexing for the homepage and the five discipline pages.
- Bing Webmaster Tools: same, and import from Search Console once verified.

## 5. AI training crawlers — a business decision

`robots.txt` allows every crawler that is not explicitly listed, which includes `GPTBot`,
`ClaudeBot`, `Google-Extended` and `CCBot`. Search-discovery crawlers such as `OAI-SearchBot` are
listed and allowed deliberately, because blocking them removes the site from AI search answers.
Training crawlers are a separate decision. If Surface Talent wants to allow discovery but not
training, add a disallow group for the training agents in `src/app/robots.ts`.

## 6. Content and business decisions found in the mobile journey reviews

These need facts or a business decision. Nothing here was changed, because inventing the answer
would put a false claim on the site.

- **Google booking is set to New York time.** The embedded appointment schedule shows
  "(GMT-04:00) Eastern Time – New York". A UK client booking 9am would get a 2pm call. Set the
  appointment schedule's timezone to Europe/London in Google Calendar. This is the single
  highest-cost defect in the whole journey.
- **Booking is 30 minutes, not 20.** The embed offers "30 min appointments". The site's own copy
  no longer claims a duration, so there is no longer a visible contradiction, but decide which is
  right and set both to match.
- **Two homepage testimonial statistics look wrong.** Cards one and two carry different numbers
  (65% and 100%) under the identical caption "Reduction in plating line", and 100% reduction of a
  plating line is not a claim anyone means. Card three reads "24 / Weeks of hire time" while its
  own quote says the shortlist arrived "inside a fortnight". Supply the real figures and captions.
- **The Clients page shows stock photography as named, available candidates.** Eight cards give a
  name, a job title and an "Available for hire" badge over what is clearly stock imagery. Decide
  whether to use real consented photographs, or to present these as illustrative.
- **No company details in the footer.** There is no copyright line, company registration number or
  registered address. For a UK limited company that is both a credibility gap and a disclosure gap.
- **Form fields are placeholder-only.** Every label is present for screen readers but visually
  hidden, so once a field is filled a sighted user on a phone cannot see what it was, and nothing
  marks which fields are required. Both journey reviews raised this. Changing it alters the
  Figma-approved form design, so it is left as a recommendation.
- **The hiring enquiry form requires a phone number.** A director sending a speculative brief may
  bounce off that. Consider making it optional.

## 7. Still outstanding from earlier sessions

- Licensed Coolvetica webfont at `public/fonts/coolvetica-rg.woff2`, then set `--heading-tracking`
  to 0. A git-ignored Apple-bundled copy is used for local QA only.
- The third accreditation mark re-exported from Figma; its image fill exported empty.
- `APPS_SCRIPT_URL` and `SUBMISSION_SECRET` on staging, without which forms return 503.

## 8. Workbook setup

- **Hero media.** The approved production hero uses the four licensed portrait stills in
  `public/assets/media/hero/portraits/`. Retired video, Three.js and illustration experiments are
  intentionally not shipped and should not be reintroduced without a new design brief.
- **The website workbook.** A new spreadsheet has been created at
  https://docs.google.com/spreadsheets/d/1LHpc84lx5C3PyS3RpLQ63zsFE9FcUwfoIznLtJhuDQ8/edit
  with the Live Jobs board ready to use. Paste `integrations/google-apps-script/Code.gs` into
  Extensions > Apps Script on that file, run `setupWorkbook` once to add the submission tabs, the
  instructions tab and the formatting, then deploy it as a web app and put its URL into the
  `APPS_SCRIPT_URL` secret. The sheet id previously hardcoded in the script
  (`1ZXwzpKUnsLUMjdH4Wh4O7eHNe7M7tJDd8B9C4TX2HoY`) is not reachable from this account.
