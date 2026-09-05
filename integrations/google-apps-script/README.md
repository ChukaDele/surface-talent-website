# Surface Talent — Google Apps Script forms backend (v2)

Cloudflare Worker (`surface-talent-staging` / production) → **this Apps Script web app** → Google Sheet + Drive CV folder + email notification.

This replaces the legacy sheet used by the old site. Files in this directory:

| File | Purpose |
|------|---------|
| `Code.gs` | The whole webhook: auth, idempotency, sheet writes, Drive upload, email, audit |
| `appsscript.json` | Manifest: `Europe/London`, V8, OAuth scopes (Sheets, Drive, send mail), web-app access |
| `README.md` | This file |

Resources:

| Resource | Value |
|----------|-------|
| Spreadsheet | `1ZXwzpKUnsLUMjdH4Wh4O7eHNe7M7tJDd8B9C4TX2HoY` (override with Script Property `SPREADSHEET_ID`) |
| CV folder | Script Property `CV_FOLDER_ID`, or auto-created `My Drive / Surface Talent — Website CVs / <YYYY>` |
| Notify | Every notification includes `hello@surfacetalent.co.uk` and CCs `tech@surfacetalent.co.uk`; `NOTIFY_TO` / `NOTIFY_CC` may add owner-approved recipients |

## 1. Deploy (owner)

1. Sign in to Google as the account that owns the spreadsheet and should own the CVs. Open <https://script.google.com> → **New project**. This is a standalone script — do not create it from inside the spreadsheet. Name it **Surface Talent Website Forms**.
2. In the editor, delete the default contents of `Code.gs` and paste this directory's `Code.gs`.
3. **Project Settings** (gear icon) → tick **Show "appsscript.json" manifest file in editor** → open `appsscript.json` in the editor and replace it with this directory's `appsscript.json`. Save.
4. **Project Settings → Script properties → Add script property**, one per row:

   | Property | Value |
   |----------|-------|
   | `WEBHOOK_SECRET` | Long random string (e.g. `openssl rand -hex 32`). **Must equal the Worker's `SUBMISSION_SECRET`.** |
   | `SPREADSHEET_ID` | `1ZXwzpKUnsLUMjdH4Wh4O7eHNe7M7tJDd8B9C4TX2HoY` (optional; this is the default) |
   | `NOTIFY_TO` | Additional owner-approved recipient(s), comma-separated (optional) |
   | `NOTIFY_CC` | Additional owner-approved CC recipient(s), comma-separated (optional) |
   | `CV_FOLDER_ID` | Drive folder ID for CVs (optional; omit to auto-create `Surface Talent — Website CVs`) |

5. Recommended: in the editor toolbar pick the function **`setupWorkbook`** → **Run**. Accept the permission prompt (Sheets, Drive, send mail — "Advanced → Go to Surface Talent Website Forms (unsafe)" is expected for an unverified personal script). This creates the five tabs and the CV folder, so the first real submission does not pay that cost. The spreadsheet's original empty `Sheet1` is left alone; delete it by hand if you like.
6. **Deploy → New deployment** → gear → type **Web app**:
   - Description: `v2 initial`
   - Execute as: **Me**
   - Who has access: **Anyone** (authentication is the shared secret, not Google sign-in)
   - **Deploy**, then copy the **Web app URL** ending in `/exec`.
7. Health check: open the `/exec` URL in a browser → `{"ok":true,"service":"Surface Talent website forms","version":"2.0.0",...}`.
8. Later code changes: paste the new `Code.gs`, then **Deploy → Manage deployments → pencil → Version: New version → Deploy**. The `/exec` URL stays the same. (A plain save without a new version does not change the live web app.)

## 2. Cloudflare Worker secrets

The Worker needs two secrets. Run from the Worker's directory (where its `wrangler.toml` lives):

```bash
# Paste the /exec URL from step 6 when prompted
wrangler secret put APPS_SCRIPT_URL --name surface-talent-staging

# Paste exactly the same value as the Apps Script property WEBHOOK_SECRET
wrangler secret put SUBMISSION_SECRET --name surface-talent-staging
```

Repeat for the production Worker name when it exists. The Worker must send the secret as `?secret=<SUBMISSION_SECRET>` on the Apps Script URL (Apps Script does not reliably pass custom headers; `X-ST-Secret` is accepted as a fallback only). Never expose the secret or the Apps Script URL to the browser.

## 3. Test directly against Apps Script

Synthetic candidate registration in `staging` with a tiny valid PDF attached. Replace the two variables.

```bash
APPS_SCRIPT_URL="https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec"
SECRET="paste-WEBHOOK_SECRET-here"

SUBMISSION_ID="ST-$(date -u +%Y%m%d)-$(openssl rand -hex 4)"
CV_B64=$(printf '%%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%%%EOF\n' | base64 | tr -d '\n')

curl -sS -L -X POST "$APPS_SCRIPT_URL?secret=$SECRET" \
  -H "Content-Type: application/json" \
  --data @- <<EOF
{
  "submission_id": "$SUBMISSION_ID",
  "submitted_at_iso": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment": "staging",
  "form_type": "candidate_registration",
  "enquiry_type": "Candidate registration",
  "name": "Test Candidate",
  "email": "test.candidate@example.com",
  "phone_e164": "+447700900123",
  "phone_country": "GB",
  "phone_display": "07700 900123",
  "company": "",
  "current_title": "Senior Process Engineer",
  "current_employer": "Example Coatings Ltd",
  "location": "Birmingham",
  "postcode": "B1 1AA",
  "target_role": "Technical Manager",
  "discipline": "Electroplating",
  "years_experience": "8-12 years",
  "employment_types": ["Permanent", "Contract"],
  "salary_expectation": "£65,000",
  "notice_period": "1 month",
  "availability": "Immediately",
  "right_to_work": "UK citizen",
  "preferred_locations": ["West Midlands", "Remote"],
  "linkedin_url": "https://www.linkedin.com/in/test-candidate",
  "hires_count": "",
  "hiring_timeline": "",
  "target_start": "",
  "message": "Synthetic staging test — safe to ignore.",
  "privacy_consent": true,
  "source_page": "/register",
  "source_url": "https://staging.surfacetalent.com/register?utm_source=test",
  "referrer": "https://www.google.com/",
  "utm_source": "test",
  "utm_medium": "curl",
  "utm_campaign": "apps-script-smoke",
  "utm_term": "",
  "utm_content": "",
  "gclid": "",
  "user_agent_family": "curl",
  "ip_hash": "0000000000000000",
  "cv": { "filename": "test-cv.pdf", "mime": "application/pdf", "ext": "pdf", "base64": "$CV_B64" }
}
EOF
echo
```

`-L` matters: Apps Script answers a POST with a 302 to `script.googleusercontent.com`, and the JSON comes back from that redirect.

Expected response:

```json
{"ok":true,"submission_id":"ST-20260902-1a2b3c4d","sheet":"Candidate Submissions","sheet_id":123456789,"row":2,"environment":"staging","email_ok":true,"cv_ok":true,"cv_url":"https://drive.google.com/file/d/…/view?usp=drivesdk","status":200}
```

What to check:

- **Sheet → `Candidate Submissions`**: one new row, `Environment = staging`, `Status = Test`, `CV / Document` is a clickable link labelled `2026-09-02__ST-20260902-1a2b3c4d__Test-Candidate__CV.pdf`, `Employment Type = Permanent | Contract`, phone kept as `+447700900123`.
- **Sheet → View → Hidden sheets**: `_Raw` has one row with every field; `_Audit` has `Event = submission_ok`, `Sheet Write = ok`, `Drive Upload = ok`, `Email Notification = ok`.
- **Drive**: `My Drive / Surface Talent — Website CVs / 2026 / 2026-09-02__ST-…__Test-Candidate__CV.pdf` (or inside `CV_FOLDER_ID / 2026` if that property is set). Sharing is the private default.
- **Inbox** `hello@surfacetalent.co.uk`, CC `tech@surfacetalent.co.uk`: subject `[STAGING] [Surface Talent] New candidate registration — Test Candidate`, plain-text body with the details, Drive link and an `Open in sheet` link that lands on the `Candidate Submissions` tab. Production uses the same two required recipients without the `[STAGING]` prefix. Reply-to is the candidate's address.
- **Idempotency**: run the exact same `curl` again (same `SUBMISSION_ID`) → `{"ok":true,"duplicate":true,…}`, no new rows anywhere except one `_Audit` line with `Event = submission_duplicate`, no second email, no second Drive file.
- **Auth**: change `SECRET` to anything else → `{"ok":false,"error":"unauthorized","status":401}`.

For a client enquiry, send `"form_type": "contact_hiring"` with `company`, `target_role`, `hires_count`, `hiring_timeline`, `target_start` and `"cv": null` → row in `Client Enquiries`. For `contact_career_move` / `contact_general` → row in `Contact Enquiries`.

## 4. Tab schemas

Rows are mapped by **header name** (row 1 of each tab), not by column position, so columns can be reordered in the sheet. Renaming a header silently drops that field from the visible tab (it stays in `_Raw`). Tabs are created with a frozen, bold, grey header row on first run if missing.

| Tab | Visible | Receives | Columns |
|-----|---------|----------|---------|
| `Candidate Submissions` | yes | `candidate_registration` | Submission ID, Submitted At, Form Type, Full Name, Email, Phone, Location, Postcode, Current Role, Current Employer, Target Role, Discipline, Experience, Employment Type, Salary / Rate, Notice Period, Availability, Work Authorisation, Preferred Locations, LinkedIn, Message, CV / Document, Consent, Source Page, UTM Source, UTM Medium, UTM Campaign, Environment, Status, Internal Notes |
| `Client Enquiries` | yes | `contact_hiring` | Submission ID, Submitted At, Form Type, Full Name, Company, Email, Phone, Enquiry Type, Discipline, Hiring Requirement, Hiring Volume, Location, Employment Type, Hiring Timeline, Target Start, Message, Consent, Source Page, UTM Source, UTM Medium, UTM Campaign, Environment, Status, Internal Notes |
| `Contact Enquiries` | yes | `contact_career_move`, `contact_general` | Submission ID, Submitted At, Form Type, Enquiry Type, Full Name, Company, Email, Phone, Discipline, Current Role, Message, CV / Document, Consent, Source Page, UTM Source, UTM Medium, UTM Campaign, Environment, Status, Internal Notes |
| `_Raw` | hidden | every submission | One column per normalised field, headed by the field key: submission_id, received_at_iso, submitted_at_iso, submitted_at_local, environment, form_type, target_sheet, status, enquiry_type, name, email, phone_e164, phone_country, phone_display, company, current_title, current_employer, location, postcode, target_role, discipline, years_experience, employment_types, salary_expectation, notice_period, availability, right_to_work, preferred_locations, linkedin_url, hires_count, hiring_timeline, target_start, message, privacy_consent, source_page, source_url, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, user_agent_family, ip_hash, cv_filename, cv_drive_name, cv_url, cv_error |
| `_Audit` | hidden | every request that reached the sheet | Timestamp, Submission ID, Event, Form Type, Target Sheet, Sheet Write, Drive Upload, Email Notification, Error Code, Error Summary, Environment |

Field mapping worth knowing: `current_title → Current Role`, `target_role → Target Role` (candidates) / `Hiring Requirement` (clients), `hires_count → Hiring Volume`, `years_experience → Experience`, `salary_expectation → Salary / Rate`, `right_to_work → Work Authorisation`, arrays are joined with ` | `, `privacy_consent → Yes/No`.

## Behaviour reference

- **Auth**: `?secret=` query param or `X-ST-Secret` header must equal Script Property `WEBHOOK_SECRET`. Checked before the lock is taken.
- **Idempotency**: `submission_id` from the Worker is the key. If it already exists in `_Raw` the request is a no-op returning `duplicate: true`. If omitted, the script generates `ST-YYYYMMDD-xxxxxxxx`.
- **Environment**: `environment: "staging"` → `Environment = staging`, `Status = Test`, subject prefixed `[STAGING] `. Anything else is treated as `production` (`Status = New`). Both required team recipients are used in either environment.
- **Write order**: duplicate check → Drive upload (if `cv`) → `_Raw` → page tab → email → `_Audit`. Email runs before the audit row so the audit records the email result; email failure never fails the submission (`email_ok: false`).
- **CV rules**: max 10 MB decoded; extension must be `pdf`, `doc` or `docx` and `mime` must match (`application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`). A CV that fails validation or upload does **not** block the row: the submission is still written with `cv_ok: false`, the `CV / Document` cell reads `Upload failed: <reason>`, and `_Audit` records `Drive Upload = failed`. Files keep Drive's private default sharing.
- **Cells** are written as plain text (phones keep their `+`; user text starting with `=` can never become a formula). Only `CV / Document` is a formula: `=HYPERLINK("<drive url>","<drive filename>")`.
- **Concurrency**: `LockService` script lock, 30 s wait → `{"ok":false,"error":"busy","status":429}`.
- **Responses** (HTTP is always 200; read `status` in the JSON):

  | `status` | `error` | Meaning |
  |---------|---------|---------|
  | 200 | — | Written. `ok, submission_id, sheet, sheet_id, row, environment, email_ok, cv_ok, cv_url` |
  | 200 | — | `duplicate: true` — already stored, nothing written |
  | 400 | `invalid_payload` / `invalid_form_type` | Not JSON, or `form_type` not one of the four |
  | 401 | `unauthorized` | Secret missing or wrong |
  | 429 | `busy` | Could not take the script lock in 30 s — the Worker should retry with the same `submission_id` |
  | 502 | `sheet_write_failed` | Spreadsheet open or row write failed; `detail` says which step. Safe to retry with the same `submission_id` |
  | 500 | `server_error` | Unexpected exception; `detail` has the message |
