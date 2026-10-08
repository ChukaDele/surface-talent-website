# Surface Talent Website - Operations Handover

This is the operational handover for the live Surface Talent website. It is written for a
maintainer and for an AI coding assistant that may be given this file before it edits the site.
Read this file together with AGENTS.md and CLAUDE.md before changing source.

## Current release

- Live site: <https://surfacetalent.co.uk/>
- WWW site: <https://www.surfacetalent.co.uk/>
- Hosting: Cloudflare Workers via Next.js/OpenNext
- Production Worker: surface-talent-website
- Production Worker version: 2bf9ef23-4f4a-42ec-8f18-8c56e5ba316b (2026-09-08)
- Source branch: codex/footer-shadow-removal-20260905
- Source commit: b28cf75a4181b55c0aede0cc2a05a3c5b7d1caf2
- Source commit message: fix: make footer spacing content-driven

The deployed patch changed only the footer spacing and responsive layout:

- src/components/home/Footer.tsx
- src/styles/footer.css
- src/styles/mobile.css

The authoritative local checkout used for this release was
/Users/chukwuka/Documents/ChatGPT/Surface Talent Website. That checkout currently has no Git
remote configured. The Drive ZIP is a clean source snapshot, not a replacement for a private,
version-controlled origin. Establish a private GitHub origin before ongoing collaborative edits.
Do not use the old public ChukaDele/surface-talent-website repository as an implementation base.

## Source-of-truth order

Use this order when files disagree:

1. The exact commit and deployed Worker identified above.
2. AGENTS.md and CLAUDE.md for repository safety and delivery rules.
3. wrangler.jsonc, package.json, and the source code for current deployment and runtime truth.
4. docs/design-reference.md for the approved visual composition and known deviations.
5. integrations/google-apps-script/Code.gs and appsscript.json for the active Apps Script
   contract.
6. README.md and integrations/google-apps-script/README.md for commands and explanations,
   checking them against the files above before acting.

Some repository notes are historical or stale. In particular, the README still describes the
older staging-first deployment state and the Apps Script README contains an older spreadsheet ID.
The active workbook ID below and the deployed Worker details in this file are the current values.
RECOVERY-METADATA.md describes an earlier recovery snapshot and must not be used as the current
release identity.

The product design files named in the top-level instructions
(02_SURFACE_TALENT_DESIGN.md, 03_MOTION_AND_INTERACTIONS.md, 04_COMPONENT_RULES.md,
07_MARKETING_WEBSITE_STRATEGY.md) are not present in this checkout. Do not invent their
contents. Use docs/design-reference.md and the existing components as the available visual
reference, and flag the missing files before a design change.

## Stack and routes

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- GSAP 3 and ScrollTrigger are the only scroll engine. Do not add a second pin or sticky system.
- Cloudflare OpenNext deployment through wrangler.jsonc
- Playwright end-to-end and visual QA in e2e/ and scripts/
- Public routes: /, /clients, /candidates, /contact, /about, /disciplines, /jobs
- Internal non-indexed design routes are under /design-lab/; they are not production content.
- Forms post to /api/submit.
- Live jobs API is /api/jobs.

The approved homepage uses the static Hero H direction that is already in the production commit.
Do not restore the exploded illustration, portrait video, portrait shutter carousel, image-shake
pseudo-video, equal portrait tiles, or another hero concept without a new written brief.

## Google resources and access

The operational Google resources are:

- Live workbook: <https://docs.google.com/spreadsheets/d/1LHpc84lx5C3PyS3RpLQ63zsFE9FcUwfoIznLtJhuDQ8/edit>
  - Spreadsheet ID: 1LHpc84lx5C3PyS3RpLQ63zsFE9FcUwfoIznLtJhuDQ8
- Apps Script project settings: <https://script.google.com/u/2/home/projects/12aY5gA5UUspbJvI8FPp0euWhVNJM3DLgrtEUAhIDtFjy0gto93jFTK58/settings>
  - Project ID: 12aY5gA5UUspbJvI8FPp0euWhVNJM3DLgrtEUAhIDtFjy0gto93jFTK58
- Handover folder: <https://drive.google.com/drive/u/2/folders/1aHxCgL3DAgjYJDlxhG44-OKXuBl0oydp>

The workbook and Apps Script project are separate Google resources. As of 2026-09-08,
hello@surfacetalent.co.uk has Editor access to both the live workbook and the Apps Script project,
and Viewer access to the handover files. The recipient must sign in to Google with that account and
confirm that both resources open before making a change. Do not send passwords, MFA codes, script
properties or secret values in chat or in this file. Cloudflare access is a separate permission and
is not granted by Google sharing.

### Workbook tabs

The Apps Script creates and maintains these tabs in the live workbook:

- How to use this - plain-English operating notes written by writeHelpSheet.
- Live Jobs - the only tab used to publish vacancies.
- Home, Clients, Candidates, Jobs, Disciplines, About, Contact - page mirrors for submissions.
- Candidate Submissions, Client Enquiries, Contact Enquiries - form-specific records.
- _Raw and _Audit - hidden technical records. Do not delete, rename or manually rewrite them.

Run setupWorkbook once after installing or replacing the Apps Script. Run formatWorkbook after
an approved formatting repair. Both operations are intended to be idempotent. The script maps
rows by header name, not by column position, but headers must not be renamed casually.

### Publishing a job

Open the Live Jobs tab and add or edit one row. The current headers are:

Status, Reference, Title, Subtitle, Discipline, Function, Seniority, Employment Type, Location,
Salary, Hook, Posted, Closes, Internal Notes.

The Status dropdown values are Live, Draft, On hold, Filled and Closed. A row is public only when
Status is exactly Live and Title is non-empty. To remove a role from the site, change the status to
On hold, Filled, Closed or Draft; keep the row as the record instead of deleting it. The website
reads live rows in sheet order.

The sheet-backed source is revalidated by the server every five minutes. /api/jobs also carries
a short public cache of up to 60 seconds. In normal operation a status change appears within five
minutes without a code change or website deployment. A hard reload can still be needed if a browser
has its own cached page.

Important current behaviour:

- If both AIRTABLE_TOKEN and AIRTABLE_BASE_ID exist on the Worker, Airtable wins for jobs. If
  they are absent, the Worker calls the Apps Script jobs endpoint. Do not configure both sources
  unless the precedence is intentional.
- The current Apps Script jobs response returns title, subtitle, discipline, function, seniority,
  employment type, location, salary, hook and posted date. Closes is stored and formatted in the
  workbook but is not currently returned to the website.
- The current jobs card displays title, subtitle, discipline, location, employment type and salary.
  It does not currently display hook, seniority, posted date or closing date.
- With neither source configured, the website renders the approved empty state. /api/jobs returns
  a configuration error rather than inventing vacancies.

### Forms, CVs and notifications

The production flow is:

~~~text
website form -> Cloudflare Worker /api/submit -> Apps Script web app -> Google Sheet + Drive CV folder + email
~~~

Candidate CVs are uploaded to a dated folder under Surface Talent - Website CVs. The visible
CV / Document cell is a Drive hyperlink. Submissions also write to _Raw and _Audit and mirror
to the page tab. Required notification recipients are hello@surfacetalent.co.uk and
tech@surfacetalent.co.uk. The Apps Script uses a script lock and the Worker supplies a generated
submission ID for idempotency. Retry a failed request with the same submission ID; do not create a
second record by changing the ID.

The Apps Script properties are owner-controlled:

- WEBHOOK_SECRET - required by the Apps Script and must equal the Worker SUBMISSION_SECRET.
- SPREADSHEET_ID - set this to 1LHpc84lx5C3PyS3RpLQ63zsFE9FcUwfoIznLtJhuDQ8 for the live workbook.
- NOTIFY_TO and NOTIFY_CC - optional additional, owner-approved recipients.
- CV_FOLDER_ID - optional Drive destination for uploaded CVs.

The Worker secrets are also owner-controlled:

- APPS_SCRIPT_URL - the Apps Script /exec URL.
- SUBMISSION_SECRET - the same value as Apps Script WEBHOOK_SECRET.
- Optional AIRTABLE_TOKEN, AIRTABLE_BASE_ID and AIRTABLE_TABLE for the legacy/alternate jobs
  source.

Never put these values in source, a commit, a screenshot, a prompt, or this Markdown file. The
Apps Script web app is deployed as Execute as: Me with anonymous access, because the shared
secret is the authentication boundary. After changing Apps Script code, deploy a new version from
Deploy -> Manage deployments; saving the editor alone does not update /exec.

## Cloudflare deployment

The two Worker names are deliberately separate:

- Staging: surface-talent-staging; deploy with npm run deploy:staging; staging must remain
  noindex and must not receive the live domain.
- Production: surface-talent-website; deploy with npm run deploy:production; routes are
  surfacetalent.co.uk and www.surfacetalent.co.uk.

The production zone is in the Cloudflare account that holds surfacetalent.co.uk (account ID
7d906c42ff7b64c0435b6d4c449fe77a). Authenticate the CLI as the account owner before deploying.
Do not use a different Cloudflare account, the old Pages project, or the old Bredge login. Set
production secrets explicitly with the production environment before the first deployment:

~~~bash
npx wrangler secret put APPS_SCRIPT_URL --env production
npx wrangler secret put SUBMISSION_SECRET --env production
npm run deploy:production
~~~

Use npm run deploy:staging only for a staging release. Do not deploy a production change from an
unreviewed working tree. Record the exact commit and Worker version after deployment, then verify
both hostnames, /jobs, /api/jobs, forms, and the browser console.

## Git and release workflow

Before any edit:

~~~bash
git status --short --branch
git rev-parse HEAD
git log --oneline -8
git diff --check
~~~

Create a short-lived codex/ branch from the exact current release. Keep unrelated working-tree
changes, especially .playwright-cli/, untouched. Never force-push, rebase onto or merge the old
public repository. Establish a private remote and protect its main branch before collaborative
development. Do not put .env*, Cloudflare credentials, Google credentials, CVs, browser state,
build output or test artifacts in Git.

The minimum release validation is:

~~~bash
npm ci
npm run lint
npm run typecheck
npm run build:production
npm run test:e2e:only
npm run qa:shots
npm run qa:perf
~~~

Use npm run build for the standard Next build and npm run build:staging plus
npm run preview:staging for local staging validation. Run the relevant responsive and
reduced-motion projects when changing layout or motion. Keep the one GSAP scroll engine and use
function-based ScrollTrigger boundaries, invalidateOnRefresh: true, gsap.matchMedia() and clean
teardown.

## Copy-ready Claude brief

Give the following rules to any Claude or other coding assistant before it edits this source:

~~~text
You are maintaining the Surface Talent website. Confirm the repository root, current branch and
exact HEAD before editing. Read AGENTS.md, CLAUDE.md, README.md and docs/design-reference.md.
Treat the current production commit and Worker listed in HANDOVER.md as the baseline. Do not use
the old public GitHub repository as a base. Preserve unrelated working-tree changes. Never open,
print, copy, commit or expose .env*, Apps Script properties, Cloudflare secrets, CVs or
credentials. Keep secrets server-side. The live jobs board is the Live Jobs tab of the named
workbook; a row appears only when Status is Live and Title is present. The site normally updates
within five minutes, and no code deploy is needed for a job status change. Do not rename workbook
headers or hidden audit tabs. Do not change Apps Script, workbook schemas, integrations,
production routes, global branding, forms or the approved static Hero H unless the task explicitly
includes them. Keep one GSAP ScrollTrigger system and preserve reduced-motion behaviour. Before
shipping source changes, run lint, typecheck, production build, the relevant Playwright tests,
visual QA and performance checks. Deploy only the reviewed commit to the correct Cloudflare Worker
after explicit release approval. Verify the live hostnames and API responses after deployment.
Stop and report a concrete blocker instead of guessing when a resource, credential, design source
or permission is missing.
~~~

## Known risks and owner actions

- This checkout has no configured Git remote. Create a private origin and grant the maintainer
  access before expecting normal pull requests or rollback from GitHub.
- The top-level design documents named in AGENTS.md are missing from this snapshot. Obtain the
  current product design source before making a new visual interpretation.
- The existing Drive Handover folder has broad link access configured as “Anyone on the Internet
  with the link can edit”. That setting was not changed during this handover. Tighten it separately
  if the folder should be private.
- The two known end-to-end failures in the closeout run are stale Hero H assertions that expect the
  superseded animated portrait behaviour. They conflict with the approved static hero and should be
  updated only as part of an explicitly scoped test maintenance change.
- RECOVERY-METADATA.md and parts of README.md describe older release states. Verify current
  Worker, commit and workbook identifiers before every production action.
- Cloudflare account access, Google workbook access and Apps Script editor access are separate
  permissions. Google workbook and Apps Script Editor access is confirmed for
  hello@surfacetalent.co.uk. Cloudflare access still needs to be granted separately by the account
  owner. Do not share a password or service secret to bridge them. Grant the maintainer the
  narrowest account role that supports the approved workflow.

## Package integrity

The uploaded ZIP is approximately 10.9 MB and excludes Git metadata, .env*, node_modules, build
output, browser state, screenshots, logs and credentials. The current SHA-256 is recorded in the
adjacent `Surface-Talent-Website-Production-Handover-2026-09-08.sha256` file. Keep that checksum
file beside the ZIP when copying or re-uploading the package.

This file is the maintained operational guide for this handover. If it becomes stale, update the
source document and re-share the replacement before asking an AI assistant to make release changes.
