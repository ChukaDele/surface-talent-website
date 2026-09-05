/**
 * Surface Talent — Website forms webhook (v2)
 * ============================================================================
 * Receives JSON POSTs from the Cloudflare Worker (surface-talent-staging /
 * production), writes one row per submission to the Surface Talent Google Sheet,
 * uploads any CV to Drive and emails the team.
 *
 * Spreadsheet (default): 1ZXwzpKUnsLUMjdH4Wh4O7eHNe7M7tJDd8B9C4TX2HoY
 *
 * Write order per submission:
 *   duplicate check (_Raw) → Drive upload (if cv) → _Raw → page tab → email → _Audit
 *   (email runs before the _Audit row so the audit can record the email result;
 *    an email failure never fails the submission).
 *
 * Tabs (created on first run if missing, rows mapped by HEADER NAME):
 *   Candidate Submissions   form_type candidate_registration
 *   Client Enquiries        form_type contact_hiring
 *   Contact Enquiries       form_type contact_career_move | contact_general
 *   _Raw (hidden)           every normalised field, one column each
 *   _Audit (hidden)         technical result log
 *
 * ----------------------------------------------------------------------------
 * DEPLOY (owner)
 * ----------------------------------------------------------------------------
 *  1. script.google.com → New project (standalone, not bound to a sheet).
 *     Name it "Surface Talent Website Forms".
 *  2. Replace the default Code.gs with this file. Project Settings → tick
 *     "Show appsscript.json manifest file" and replace it with appsscript.json.
 *  3. Project Settings → Script properties:
 *       WEBHOOK_SECRET      required — must equal the Worker's SUBMISSION_SECRET
 *       SPREADSHEET_ID      optional — defaults to the ID above
 *       NOTIFY_TO           optional additional recipient — hello@surfacetalent.co.uk is always included
 *       NOTIFY_CC           optional additional recipient — tech@surfacetalent.co.uk is always included
 *       CV_FOLDER_ID        optional — Drive folder for CVs; if absent the script
 *                                      find-or-creates "Surface Talent — Website CVs"
 *                                      in the account's My Drive
 *  4. (Recommended) Select setupWorkbook in the editor toolbar → Run. Accept the
 *     Sheets / Drive / Mail permission prompt. This creates the tabs and CV folder.
 *  5. Deploy → New deployment → Web app
 *       Execute as:      Me
 *       Who has access:  Anyone   (auth is the shared secret, not Google sign-in)
 *  6. Copy the Web app URL ending in /exec → Worker secret APPS_SCRIPT_URL.
 *     Re-deploying code later: Deploy → Manage deployments → edit → New version.
 *
 * Auth: ?secret=<WEBHOOK_SECRET> query param or X-ST-Secret header. Apps Script
 * sometimes drops custom headers, so the Worker should always send the query param.
 * Apps Script always answers HTTP 200; the real status is `status` in the JSON.
 * ============================================================================
 */

var VERSION = "2.0.0";
var TIMEZONE = "Europe/London";
var DEFAULT_SPREADSHEET_ID = "1LHpc84lx5C3PyS3RpLQ63zsFE9FcUwfoIznLtJhuDQ8";
var DEFAULT_NOTIFY_TO = "hello@surfacetalent.co.uk";
var DEFAULT_NOTIFY_CC = "tech@surfacetalent.co.uk";
var CV_ROOT_FOLDER_NAME = "Surface Talent — Website CVs";
var MAX_CV_BYTES = 10 * 1024 * 1024;

/** Allowed CV types: extension → accepted MIME types (first is canonical). */
var CV_TYPES = {
  pdf: ["application/pdf", "application/x-pdf"],
  doc: ["application/msword", "application/vnd.ms-word"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};

var SHEET_CANDIDATES = "Candidate Submissions";
var SHEET_CLIENTS = "Client Enquiries";
var SHEET_CONTACT = "Contact Enquiries";
var SHEET_RAW = "_Raw";
var SHEET_AUDIT = "_Audit";
var SHEET_JOBS = "Live Jobs";
var SHEET_HELP = "How to use this";

/**
 * The workbook mirrors the website. One tab per page that can send something in, named the way the
 * page is named in the navigation, so anyone can find where a message came from without being told.
 * Every submission is also written to the page tab it came from, alongside its form tab.
 */
var SHEET_PAGE_HOME = "Home";
var SHEET_PAGE_CLIENTS = "Clients";
var SHEET_PAGE_CANDIDATES = "Candidates";
var SHEET_PAGE_JOBS = "Jobs";
var SHEET_PAGE_DISCIPLINES = "Disciplines";
var SHEET_PAGE_ABOUT = "About";
var SHEET_PAGE_CONTACT = "Contact";

var PAGE_TABS = [
  SHEET_PAGE_HOME, SHEET_PAGE_CLIENTS, SHEET_PAGE_CANDIDATES, SHEET_PAGE_JOBS,
  SHEET_PAGE_DISCIPLINES, SHEET_PAGE_ABOUT, SHEET_PAGE_CONTACT,
];

/** One shape for every page tab, so the workbook reads the same wherever you land. */
var PAGE_HEADERS = [
  "Received", "Submission ID", "Type", "Name", "Email", "Phone", "Company / Current Role",
  "Role / Interest", "Discipline", "Location", "Message", "CV / Document", "Source Page",
  "Status", "Owner", "Next Follow-up", "Notes",
];

/** The site's own type face, applied to the whole workbook. */
var WORKBOOK_FONT = "Mulish";

/**
 * The vacancy board. This is the one tab anyone edits by hand: set Status to Live and the role
 * appears on surfacetalent.co.uk/jobs within five minutes. Set it to anything else and it comes
 * straight off. Column order is the reading order of a job card on the site.
 */
var JOBS_HEADERS = [
  "Status", "Reference", "Title", "Subtitle", "Discipline", "Function", "Seniority",
  "Employment Type", "Location", "Salary", "Hook", "Posted", "Closes", "Internal Notes",
];

var JOBS_STATUS = ["Live", "Draft", "On hold", "Filled", "Closed"];
var JOBS_TYPE = ["Permanent", "Contract", "Interim", "Temporary"];
var JOBS_SENIORITY = ["Operative", "Technician", "Engineer", "Supervisor", "Manager", "Head of", "Director"];
var SUBMISSION_STATUS = ["New", "In progress", "Contacted", "Shortlisted", "Placed", "Closed", "Archived"];

var CANDIDATE_HEADERS = [
  "Submission ID", "Submitted At", "Form Type", "Full Name", "Email", "Phone", "Location",
  "Postcode", "Current Role", "Current Employer", "Target Role", "Discipline", "Experience",
  "Employment Type", "Salary / Rate", "Notice Period", "Availability", "Work Authorisation",
  "Preferred Locations", "LinkedIn", "Message", "CV / Document", "Consent", "Source Page",
  "UTM Source", "UTM Medium", "UTM Campaign", "Environment", "Status", "Internal Notes",
];

var CLIENT_HEADERS = [
  "Submission ID", "Submitted At", "Form Type", "Full Name", "Company", "Email", "Phone",
  "Enquiry Type", "Discipline", "Hiring Requirement", "Hiring Volume", "Location",
  "Employment Type", "Hiring Timeline", "Target Start", "Message", "Consent", "Source Page",
  "UTM Source", "UTM Medium", "UTM Campaign", "Environment", "Status", "Internal Notes",
];

var CONTACT_HEADERS = [
  "Submission ID", "Submitted At", "Form Type", "Enquiry Type", "Full Name", "Company", "Email",
  "Phone", "Discipline", "Current Role", "Message", "CV / Document", "Consent", "Source Page",
  "UTM Source", "UTM Medium", "UTM Campaign", "Environment", "Status", "Internal Notes",
];

/** _Raw uses the normalised record keys as headers, one column per field. */
var RAW_HEADERS = [
  "submission_id", "received_at_iso", "submitted_at_iso", "submitted_at_local", "environment",
  "form_type", "target_sheet", "status", "enquiry_type", "name", "email", "phone_e164",
  "phone_country", "phone_display", "company", "current_title", "current_employer", "location",
  "postcode", "target_role", "discipline", "years_experience", "employment_types",
  "salary_expectation", "notice_period", "availability", "right_to_work", "preferred_locations",
  "linkedin_url", "hires_count", "hiring_timeline", "target_start", "message", "privacy_consent",
  "source_page", "source_url", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term",
  "utm_content", "gclid", "user_agent_family", "ip_hash", "cv_filename", "cv_drive_name", "cv_url",
  "cv_error",
];

var AUDIT_HEADERS = [
  "Timestamp", "Submission ID", "Event", "Form Type", "Target Sheet", "Sheet Write",
  "Drive Upload", "Email Notification", "Error Code", "Error Summary", "Environment",
];

var DEFAULT_COLUMN_WIDTH = 130;
var COLUMN_WIDTHS = {
  "Submission ID": 175, "Submitted At": 150, "Form Type": 160, "Enquiry Type": 150,
  "Full Name": 170, "Company": 170, "Email": 220, "Phone": 140, "Location": 150, "Postcode": 100,
  "Current Role": 170, "Current Employer": 170, "Target Role": 170, "Discipline": 150,
  "Experience": 110, "Employment Type": 160, "Salary / Rate": 130, "Notice Period": 120,
  "Availability": 130, "Work Authorisation": 150, "Preferred Locations": 180, "LinkedIn": 200,
  "Message": 400, "CV / Document": 280, "Consent": 80, "Source Page": 140, "UTM Source": 110,
  "UTM Medium": 110, "UTM Campaign": 140, "Environment": 100, "Status": 90, "Internal Notes": 260,
  "Hiring Requirement": 220, "Hiring Volume": 110, "Hiring Timeline": 130, "Target Start": 120,
};
var WRAP_HEADERS = { Message: true };

var FORM_LABELS = {
  candidate_registration: "Candidate registration",
  contact_hiring: "Hiring enquiry",
  contact_career_move: "Career move enquiry",
  contact_general: "General enquiry",
};

var DEFAULT_ENQUIRY_TYPES = {
  candidate_registration: "Candidate registration",
  contact_hiring: "I'm hiring",
  contact_career_move: "I'm considering a move",
  contact_general: "General enquiry",
};

/** Cache: sheetName → { sheet, headers, indexByName } (one Apps Script execution). */
var HEADER_CACHE_ = {};

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

function doGet(e) {
  var params = (e && e.parameter) || {};
  if (String(params.resource || "") === "jobs") return jobsOut_(params);
  return jsonOut_(
    { ok: true, service: "Surface Talent website forms", version: VERSION, time: new Date().toISOString() },
    200
  );
}

/**
 * Live vacancies for the website. Reads the 'Live Jobs' tab and returns every row whose Status is
 * Live, in sheet order. The secret is required so this is not a public scrape target, and because
 * the site calls it server side there is nowhere for the secret to leak.
 */
function jobsOut_(params) {
  var cfg = config_();
  if (!cfg.secret || String(params.secret || "") !== cfg.secret) {
    return jsonOut_({ ok: false, error: "unauthorized" }, 401);
  }
  try {
    var sheet = resolveJobsSheet_(SpreadsheetApp.openById(cfg.spreadsheetId));
    if (!sheet) return jsonOut_({ ok: true, jobs: [] }, 200);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow < 2 || lastCol < 1) return jsonOut_({ ok: true, jobs: [] }, 200);

    // read by header name, never by fixed position: someone will reorder these columns one day
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    var idx = {};
    for (var h = 0; h < headers.length; h++) idx[String(headers[h]).trim()] = h;
    if (idx.Title === undefined || idx.Status === undefined) return jsonOut_({ ok: true, jobs: [] }, 200);

    var jobs = [];
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      if (String(row[idx.Status] || "").trim().toLowerCase() !== "live") continue;
      var title = String(row[idx.Title] || "").trim();
      if (!title) continue; // a row with no title is a half-written draft, not a vacancy
      var ref = String(row[idx.Reference] || "").trim();
      jobs.push({
        id: ref || "row-" + (r + 2),
        title: title,
        subtitle: cell_(row[idx.Subtitle]),
        discipline: cell_(row[idx.Discipline]),
        func: cell_(row[idx.Function]),
        seniority: cell_(row[idx.Seniority]),
        type: cell_(row[idx["Employment Type"]]),
        location: cell_(row[idx.Location]),
        salary: cell_(row[idx.Salary]),
        hook: cell_(row[idx.Hook]),
        posted: dateCell_(row[idx.Posted]),
      });
    }
    return jsonOut_({ ok: true, jobs: jobs, count: jobs.length }, 200);
  } catch (err) {
    return jsonOut_({ ok: false, error: "jobs_unavailable", detail: msg_(err) }, 500);
  }
}

/**
 * The vacancy board. Prefers the tab named "Live Jobs"; falls back to the first tab whose header
 * row carries both Status and Title, so a workbook created from a CSV import still works before
 * anyone has run setupWorkbook.
 */
function resolveJobsSheet_(ss) {
  var named = ss.getSheetByName(SHEET_JOBS);
  if (named) return named;
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var cols = sheet.getLastColumn();
    if (cols < 2 || sheet.getLastRow() < 1) continue;
    var header = sheet.getRange(1, 1, 1, cols).getValues()[0].map(function (h) { return String(h).trim(); });
    if (header.indexOf("Title") !== -1 && header.indexOf("Status") !== -1) return sheet;
  }
  return null;
}

/** Which page of the website did this come from? Falls back to the form's natural home. */
function resolvePageTab_(record) {
  var page = String(record.source_page || "").toLowerCase();
  if (page.indexOf("/clients") !== -1) return SHEET_PAGE_CLIENTS;
  if (page.indexOf("/candidates") !== -1) return SHEET_PAGE_CANDIDATES;
  if (page.indexOf("/jobs") !== -1) return SHEET_PAGE_JOBS;
  if (page.indexOf("/disciplines") !== -1) return SHEET_PAGE_DISCIPLINES;
  if (page.indexOf("/about") !== -1) return SHEET_PAGE_ABOUT;
  if (page.indexOf("/contact") !== -1) return SHEET_PAGE_CONTACT;
  if (page === "/" || page === "") return SHEET_PAGE_HOME;
  return SHEET_PAGE_CONTACT;
}

/** One row shape for every page tab, whatever form produced it. */
function pageTabValues_(r) {
  return {
    "Received": r.submitted_at,
    "Submission ID": r.submission_id,
    "Type": r.form_type,
    "Name": r.full_name || r.name,
    "Email": r.email,
    "Phone": r.phone_e164 || r.phone,
    "Company / Current Role": r.company || r.current_role,
    "Role / Interest": r.target_role || r.role,
    "Discipline": r.discipline,
    "Location": r.location,
    "Message": r.message,
    "CV / Document": r.cv_url,
    "Source Page": r.source_page,
    "Status": "New",
  };
}

function cell_(v) {
  var out = v === null || v === undefined ? "" : String(v).trim();
  return out || undefined;
}

function dateCell_(v) {
  if (!v) return undefined;
  if (Object.prototype.toString.call(v) === "[object Date]") return Utilities.formatDate(v, "Etc/UTC", "yyyy-MM-dd");
  return String(v).trim() || undefined;
}

function doPost(e) {
  var cfg = config_();

  var provided = extractSecret_(e);
  if (!cfg.secret || String(provided) !== cfg.secret) {
    return jsonOut_({ ok: false, error: "unauthorized" }, 401);
  }

  var body = parseBody_(e);
  if (!body || typeof body !== "object") {
    return jsonOut_({ ok: false, error: "invalid_payload" }, 400);
  }

  var targetSheet = resolveTargetSheet_(body.form_type);
  if (!targetSheet) {
    return jsonOut_({ ok: false, error: "invalid_form_type" }, 400);
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (lockErr) {
    return jsonOut_({ ok: false, error: "busy" }, 429);
  }

  try {
    return handleSubmission_(body, targetSheet, cfg);
  } catch (err) {
    return jsonOut_({ ok: false, error: "server_error", detail: msg_(err) }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Run once from the editor after pasting the code: creates the tabs and the CV
 * folder and triggers the OAuth consent for Sheets, Drive and Mail.
 */
function setupWorkbook() {
  var cfg = config_();
  var ss = SpreadsheetApp.openById(cfg.spreadsheetId);
  ensureWorkbook_(ss);
  var folder = resolveCvFolder_(cfg, new Date());
  Logger.log("Workbook ready: " + ss.getUrl());
  Logger.log("CV folder ready: " + folder.getUrl());
}

// ---------------------------------------------------------------------------
// Submission pipeline
// ---------------------------------------------------------------------------

function handleSubmission_(body, targetSheet, cfg) {
  var record = normalizeRecord_(body, targetSheet);

  var ss;
  try {
    ss = SpreadsheetApp.openById(cfg.spreadsheetId);
    ensureWorkbook_(ss);
  } catch (openErr) {
    return jsonOut_(
      { ok: false, error: "sheet_write_failed", detail: "open_failed: " + msg_(openErr), submission_id: record.submission_id },
      502
    );
  }

  // Idempotency: the Worker generates submission_id and may retry.
  if (isDuplicate_(ss, record.submission_id)) {
    audit_(ss, record, {
      event: "submission_duplicate",
      sheetWrite: "skipped",
      drive: "skipped",
      email: "skipped",
      errorCode: "duplicate",
      errorSummary: "submission_id already present in _Raw",
    });
    return jsonOut_(
      { ok: true, duplicate: true, submission_id: record.submission_id, sheet: targetSheet, environment: record.environment },
      200
    );
  }

  var cvOk = true;
  var cvError = "";
  var driveState = "none";
  if (body.cv && body.cv.base64) {
    try {
      var uploaded = uploadCv_(body.cv, record, cfg);
      record.cv_url = uploaded.url;
      record.cv_drive_name = uploaded.name;
      driveState = "ok";
    } catch (cvErr) {
      cvOk = false;
      cvError = msg_(cvErr);
      record.cv_error = cvError;
      driveState = "failed";
    }
  }

  try {
    appendByHeaders_(ss, SHEET_RAW, RAW_HEADERS, rawValues_(record));
  } catch (rawErr) {
    var rawDetail = "raw_failed: " + msg_(rawErr);
    audit_(ss, record, {
      event: "submission_failed",
      sheetWrite: "failed",
      drive: driveState,
      email: "skipped",
      errorCode: "sheet_write_failed",
      errorSummary: rawDetail,
    });
    return jsonOut_(
      { ok: false, error: "sheet_write_failed", detail: rawDetail, submission_id: record.submission_id, cv_ok: cvOk, cv_url: record.cv_url },
      502
    );
  }

  var pageRow;
  try {
    pageRow = appendByHeaders_(ss, targetSheet, headersFor_(targetSheet), pageValues_(targetSheet, record));
    // and a second copy on the tab for the page it came from, so the workbook mirrors the site
    var pageTab = resolvePageTab_(record);
    if (pageTab) {
      try { appendByHeaders_(ss, pageTab, PAGE_HEADERS, pageTabValues_(record)); }
      catch (mirrorErr) { /* the form tab is the record of truth; a mirror failure must not fail the submission */ }
    }
  } catch (pageErr) {
    var pageDetail = "page_failed: " + msg_(pageErr);
    audit_(ss, record, {
      event: "submission_failed",
      sheetWrite: "failed",
      drive: driveState,
      email: "skipped",
      errorCode: "sheet_write_failed",
      errorSummary: pageDetail,
    });
    return jsonOut_(
      { ok: false, error: "sheet_write_failed", detail: pageDetail, submission_id: record.submission_id, cv_ok: cvOk, cv_url: record.cv_url },
      502
    );
  }

  var sheetId = ss.getSheetByName(targetSheet).getSheetId();

  var emailOk = true;
  var emailError = "";
  try {
    sendNotification_(record, cfg, sheetId);
  } catch (mailErr) {
    emailOk = false;
    emailError = msg_(mailErr);
  }

  var problems = [];
  if (!cvOk) problems.push("cv_upload_failed: " + cvError);
  if (!emailOk) problems.push("email_failed: " + emailError);

  audit_(ss, record, {
    event: problems.length ? "submission_partial" : "submission_ok",
    sheetWrite: "ok",
    drive: driveState,
    email: emailOk ? "ok" : "failed",
    errorCode: !cvOk && !emailOk ? "cv_upload_failed,email_failed" : !cvOk ? "cv_upload_failed" : !emailOk ? "email_failed" : "",
    errorSummary: problems.join(" | "),
  });

  return jsonOut_(
    {
      ok: true,
      submission_id: record.submission_id,
      sheet: targetSheet,
      sheet_id: sheetId,
      row: pageRow,
      environment: record.environment,
      email_ok: emailOk,
      cv_ok: cvOk,
      cv_url: record.cv_url,
    },
    200
  );
}

// ---------------------------------------------------------------------------
// Request helpers
// ---------------------------------------------------------------------------

function config_() {
  var p = PropertiesService.getScriptProperties();
  return {
    secret: String(p.getProperty("WEBHOOK_SECRET") || ""),
    spreadsheetId: String(p.getProperty("SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID),
    notifyTo: String(p.getProperty("NOTIFY_TO") || ""),
    notifyCc: String(p.getProperty("NOTIFY_CC") || p.getProperty("NOTIFY_CC_STAGING") || ""),
    cvFolderId: String(p.getProperty("CV_FOLDER_ID") || ""),
  };
}

function extractSecret_(e) {
  if (!e) return "";
  if (e.parameter && e.parameter.secret) return e.parameter.secret;
  try {
    if (e.headers) {
      return e.headers["X-ST-Secret"] || e.headers["x-st-secret"] || e.headers["X-St-Secret"] || "";
    }
  } catch (ignore) {}
  return "";
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return null;
  var type = String(e.postData.type || "").toLowerCase();
  var contents = e.postData.contents;
  if (type.indexOf("application/json") !== -1 || contents.charAt(0) === "{") {
    try {
      return JSON.parse(contents);
    } catch (parseErr) {
      return null;
    }
  }
  return null;
}

/** Allowlisted routing — the client never chooses a sheet name. */
function resolveTargetSheet_(formType) {
  var type = String(formType || "");
  if (type === "candidate_registration") return SHEET_CANDIDATES;
  if (type === "contact_hiring") return SHEET_CLIENTS;
  if (type === "contact_career_move" || type === "contact_general") return SHEET_CONTACT;
  return "";
}

function headersFor_(sheetName) {
  if (sheetName === SHEET_CANDIDATES) return CANDIDATE_HEADERS;
  if (sheetName === SHEET_CLIENTS) return CLIENT_HEADERS;
  if (sheetName === SHEET_CONTACT) return CONTACT_HEADERS;
  if (sheetName === SHEET_RAW) return RAW_HEADERS;
  if (sheetName === SHEET_AUDIT) return AUDIT_HEADERS;
  return [];
}

// ---------------------------------------------------------------------------
// Normalisation
// ---------------------------------------------------------------------------

function normalizeRecord_(body, targetSheet) {
  var received = new Date();
  var submitted = parseIso_(body.submitted_at_iso) || received;
  var environment = str_(body.environment).toLowerCase() === "staging" ? "staging" : "production";
  var formType = str_(body.form_type);
  var submissionId = str_(body.submission_id).replace(/[^\x20-\x7E]/g, "").slice(0, 80) || generateSubmissionId_(submitted);
  var cv = body.cv && typeof body.cv === "object" ? body.cv : null;

  return {
    submission_id: submissionId,
    submitted_at: submitted,
    received_at_iso: received.toISOString(),
    submitted_at_iso: submitted.toISOString(),
    submitted_at_local: Utilities.formatDate(submitted, TIMEZONE, "yyyy-MM-dd HH:mm:ss"),
    environment: environment,
    form_type: formType,
    form_label: FORM_LABELS[formType] || formType,
    target_sheet: targetSheet,
    status: environment === "staging" ? "Test" : "New",
    enquiry_type: str_(body.enquiry_type) || DEFAULT_ENQUIRY_TYPES[formType] || "",
    name: str_(body.name),
    email: str_(body.email),
    phone_e164: phoneText_(body.phone_e164),
    phone_country: str_(body.phone_country),
    phone_display: str_(body.phone_display),
    company: str_(body.company),
    current_title: str_(body.current_title),
    current_employer: str_(body.current_employer),
    location: str_(body.location),
    postcode: str_(body.postcode),
    target_role: str_(body.target_role),
    discipline: joinList_(body.discipline),
    years_experience: str_(body.years_experience),
    employment_types: joinList_(body.employment_types),
    salary_expectation: str_(body.salary_expectation),
    notice_period: str_(body.notice_period),
    availability: str_(body.availability),
    right_to_work: str_(body.right_to_work),
    preferred_locations: joinList_(body.preferred_locations),
    linkedin_url: str_(body.linkedin_url),
    hires_count: str_(body.hires_count),
    hiring_timeline: str_(body.hiring_timeline),
    target_start: str_(body.target_start),
    message: str_(body.message),
    privacy_consent: bool_(body.privacy_consent) ? "Yes" : "No",
    source_page: str_(body.source_page),
    source_url: str_(body.source_url),
    referrer: str_(body.referrer),
    utm_source: str_(body.utm_source),
    utm_medium: str_(body.utm_medium),
    utm_campaign: str_(body.utm_campaign),
    utm_term: str_(body.utm_term),
    utm_content: str_(body.utm_content),
    gclid: str_(body.gclid),
    user_agent_family: str_(body.user_agent_family),
    ip_hash: str_(body.ip_hash),
    cv_filename: cv ? str_(cv.filename) : "",
    cv_drive_name: "",
    cv_url: "",
    cv_error: "",
  };
}

function generateSubmissionId_(date) {
  return (
    "ST-" +
    Utilities.formatDate(date, "UTC", "yyyyMMdd") +
    "-" +
    Utilities.getUuid().replace(/-/g, "").slice(0, 8)
  );
}

function parseIso_(value) {
  if (!value) return null;
  var d = new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
}

function str_(value) {
  if (value == null) return "";
  if (typeof value === "object") return joinList_(value);
  return String(value).trim();
}

function bool_(value) {
  if (value === true) return true;
  var v = String(value == null ? "" : value).toLowerCase().trim();
  return v === "true" || v === "yes" || v === "on" || v === "1";
}

function joinList_(value) {
  if (value == null || value === "") return "";
  if (Object.prototype.toString.call(value) !== "[object Array]") {
    var s = String(value).trim();
    if (s.charAt(0) === "[") {
      try {
        var parsed = JSON.parse(s);
        if (Object.prototype.toString.call(parsed) === "[object Array]") return joinList_(parsed);
      } catch (ignore) {}
    }
    return s;
  }
  var out = [];
  for (var i = 0; i < value.length; i++) {
    if (value[i] == null || typeof value[i] === "object") continue;
    var item = String(value[i]).trim();
    if (item) out.push(item);
  }
  return out.join(" | ");
}

function phoneText_(value) {
  var v = String(value == null ? "" : value).trim();
  if (!v) return "";
  if (v.charAt(0) !== "+" && /^\d{8,15}$/.test(v)) v = "+" + v;
  return v;
}

// ---------------------------------------------------------------------------
// Row values by header name
// ---------------------------------------------------------------------------

function rawValues_(r) {
  var out = {};
  for (var i = 0; i < RAW_HEADERS.length; i++) {
    var key = RAW_HEADERS[i];
    var v = r[key];
    out[key] = v == null ? "" : v instanceof Date ? v.toISOString() : String(v);
  }
  return out;
}

function pageValues_(sheetName, r) {
  var phone = r.phone_e164 || r.phone_display;
  var common = {
    "Submission ID": r.submission_id,
    "Submitted At": r.submitted_at_local,
    "Form Type": r.form_type,
    "Full Name": r.name,
    Email: r.email,
    Phone: phone,
    Message: r.message,
    Consent: r.privacy_consent,
    "Source Page": r.source_page,
    "UTM Source": r.utm_source,
    "UTM Medium": r.utm_medium,
    "UTM Campaign": r.utm_campaign,
    Environment: r.environment,
    Status: r.status,
    "Internal Notes": "",
  };

  if (sheetName === SHEET_CANDIDATES) {
    common.Location = r.location;
    common.Postcode = r.postcode;
    common["Current Role"] = r.current_title;
    common["Current Employer"] = r.current_employer;
    common["Target Role"] = r.target_role;
    common.Discipline = r.discipline;
    common.Experience = r.years_experience;
    common["Employment Type"] = r.employment_types;
    common["Salary / Rate"] = r.salary_expectation;
    common["Notice Period"] = r.notice_period;
    common.Availability = r.availability;
    common["Work Authorisation"] = r.right_to_work;
    common["Preferred Locations"] = r.preferred_locations;
    common.LinkedIn = r.linkedin_url;
    common["CV / Document"] = cvCell_(r);
  } else if (sheetName === SHEET_CLIENTS) {
    common.Company = r.company;
    common["Enquiry Type"] = r.enquiry_type;
    common.Discipline = r.discipline;
    common["Hiring Requirement"] = r.target_role;
    common["Hiring Volume"] = r.hires_count;
    common.Location = r.location;
    common["Employment Type"] = r.employment_types;
    common["Hiring Timeline"] = r.hiring_timeline;
    common["Target Start"] = r.target_start;
  } else if (sheetName === SHEET_CONTACT) {
    common["Enquiry Type"] = r.enquiry_type;
    common.Company = r.company;
    common.Discipline = r.discipline;
    common["Current Role"] = r.current_title;
    common["CV / Document"] = cvCell_(r);
  }

  return common;
}

/** Clickable Drive link, or a short failure note so the team knows a CV was attempted. */
function cvCell_(r) {
  if (r.cv_url) return { formula: hyperlinkFormula_(r.cv_url, r.cv_drive_name || "CV") };
  if (r.cv_error) return "Upload failed: " + r.cv_error;
  return "";
}

function hyperlinkFormula_(url, label) {
  var esc = function (s) {
    return String(s).replace(/"/g, '""');
  };
  return '=HYPERLINK("' + esc(url) + '","' + esc(label) + '")';
}

// ---------------------------------------------------------------------------
// Sheet access
// ---------------------------------------------------------------------------

function ensureWorkbook_(ss) {
  // Visible tabs first — a spreadsheet must always keep at least one visible sheet.
  ensureSheet_(ss, SHEET_HELP, ["Surface Talent website workbook"], false);
  var imported = resolveJobsSheet_(ss);
  if (imported && imported.getName() !== SHEET_JOBS) imported.setName(SHEET_JOBS);
  ensureSheet_(ss, SHEET_JOBS, JOBS_HEADERS, false);
  for (var t = 0; t < PAGE_TABS.length; t++) ensureSheet_(ss, PAGE_TABS[t], PAGE_HEADERS, false);
  ensureSheet_(ss, SHEET_CANDIDATES, CANDIDATE_HEADERS, false);
  ensureSheet_(ss, SHEET_CLIENTS, CLIENT_HEADERS, false);
  ensureSheet_(ss, SHEET_CONTACT, CONTACT_HEADERS, false);
  ensureSheet_(ss, SHEET_RAW, RAW_HEADERS, true);
  ensureSheet_(ss, SHEET_AUDIT, AUDIT_HEADERS, true);
  orderTabs_(ss);
  writeHelpSheet_(ss);
  formatWorkbook_(ss);
}

/**
 * Idempotent styling pass. `ensureSheet_` only styles a tab the first time it is created, so this
 * exists to bring an existing workbook up to the same standard and to be re-run after any manual
 * edit. Safe to run as often as you like: it never touches row content.
 */
function formatWorkbook() {
  var cfg = config_();
  formatWorkbook_(SpreadsheetApp.openById(cfg.spreadsheetId));
}

function formatWorkbook_(ss) {
  applyFont_(ss);
  var submissionTabs = [SHEET_CANDIDATES, SHEET_CLIENTS, SHEET_CONTACT].concat(PAGE_TABS);
  for (var i = 0; i < submissionTabs.length; i++) {
    var sheet = ss.getSheetByName(submissionTabs[i]);
    if (sheet) styleSubmissionSheet_(sheet);
  }
  var jobs = resolveJobsSheet_(ss);
  if (jobs) {
    if (jobs.getName() !== SHEET_JOBS) jobs.setName(SHEET_JOBS); // adopt a CSV-imported board
    styleJobsSheet_(jobs);
  }
}

/** Mulish across every cell of every tab, so the workbook reads like the website. */
function applyFont_(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).setFontFamily(WORKBOOK_FONT);
  }
}

/** Instructions first, then the board, then the pages in navigation order, then the raw tabs. */
function orderTabs_(ss) {
  var order = [SHEET_HELP, SHEET_JOBS].concat(PAGE_TABS).concat([SHEET_CANDIDATES, SHEET_CLIENTS, SHEET_CONTACT, SHEET_RAW, SHEET_AUDIT]);
  for (var i = 0; i < order.length; i++) {
    var sheet = ss.getSheetByName(order[i]);
    if (!sheet) continue;
    ss.setActiveSheet(sheet);
    ss.moveActiveSheet(i + 1);
  }
  var help = ss.getSheetByName(SHEET_HELP);
  if (help) ss.setActiveSheet(help);
}

function styleHeader_(sheet, colour) {
  var cols = Math.max(1, sheet.getLastColumn());
  var header = sheet.getRange(1, 1, 1, cols);
  header.setFontWeight("bold").setFontColor("#FFFFFF").setBackground(colour)
    .setVerticalAlignment("middle").setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);
}

function styleSubmissionSheet_(sheet) {
  styleHeader_(sheet, PAGE_TABS.indexOf(sheet.getName()) === -1 ? "#0D2233" : "#193E5A");
  var cols = Math.max(1, sheet.getLastColumn());
  var rows = Math.max(2, sheet.getMaxRows());
  var headers = sheet.getRange(1, 1, 1, cols).getValues()[0];

  // readable dates, clickable documents, one obvious status column
  var at = headers.indexOf("Submitted At") + 1;
  if (at < 1) at = headers.indexOf("Received") + 1;
  if (at > 0) sheet.getRange(2, at, rows - 1, 1).setNumberFormat("yyyy-mm-dd hh:mm");
  var cv = headers.indexOf("CV / Document") + 1;
  if (cv > 0) sheet.setColumnWidth(cv, 220);
  var status = headers.indexOf("Status") + 1;
  if (status > 0) {
    sheet.getRange(2, status, rows - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(SUBMISSION_STATUS, true).setAllowInvalid(false).build()
    );
    sheet.setColumnWidth(status, 130);
  }
  sheet.getRange(1, 1, rows, cols).setVerticalAlignment("top");
  if (sheet.getFrozenColumns() < 1) sheet.setFrozenColumns(1);
  applyBanding_(sheet, cols, rows);
}

function styleJobsSheet_(sheet) {
  styleHeader_(sheet, "#B87333");
  var rows = Math.max(2, sheet.getMaxRows());
  var col = function (name) { return JOBS_HEADERS.indexOf(name) + 1; };

  dropdown_(sheet, col("Status"), rows, JOBS_STATUS);
  dropdown_(sheet, col("Employment Type"), rows, JOBS_TYPE);
  dropdown_(sheet, col("Seniority"), rows, JOBS_SENIORITY);
  sheet.getRange(2, col("Posted"), rows - 1, 1).setNumberFormat("yyyy-mm-dd");
  sheet.getRange(2, col("Closes"), rows - 1, 1).setNumberFormat("yyyy-mm-dd");

  var widths = { Status: 110, Reference: 110, Title: 260, Subtitle: 260, Hook: 320, "Internal Notes": 260 };
  for (var i = 0; i < JOBS_HEADERS.length; i++) sheet.setColumnWidth(i + 1, widths[JOBS_HEADERS[i]] || 150);

  // a Live row is the one that is public, so make that unmistakable at a glance
  var range = sheet.getRange(2, 1, rows - 1, JOBS_HEADERS.length);
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A2="Live"').setBackground("#EAF7EC").setRanges([range]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"",$A2<>"Live")').setBackground("#F5F5F5").setFontColor("#7A7A7A").setRanges([range]).build(),
  ]);
  sheet.setFrozenColumns(3);
}

function dropdown_(sheet, column, rows, values) {
  if (column < 1) return;
  sheet.getRange(2, column, rows - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build()
  );
}

function applyBanding_(sheet, cols, rows) {
  var existing = sheet.getBandings();
  for (var i = 0; i < existing.length; i++) existing[i].remove();
  sheet.getRange(1, 1, rows, cols).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
}

/** Plain-English instructions, written into the workbook so they travel with it. */
function writeHelpSheet_(ss) {
  var sheet = ss.getSheetByName(SHEET_HELP);
  if (!sheet) return;
  sheet.clear();
  var lines = [
    ["Surface Talent website workbook"],
    [""],
    ["This one spreadsheet drives the vacancies on the website and collects everything the site's forms send in."],
    [""],
    ["TO POST A VACANCY"],
    ["1. Open the 'Live Jobs' tab."],
    ["2. Add a row. Title is the only field the site insists on; everything else is optional and simply shows if filled."],
    ["3. Set Status to 'Live'. The role appears on surfacetalent.co.uk/jobs within five minutes."],
    ["4. To take it down, change Status to Filled, Closed or On hold. Do not delete the row: keeping it is your record."],
    ["Green rows are live on the site right now. Grey rows are not."],
    [""],
    ["WHERE SUBMISSIONS LAND"],
    ["The workbook mirrors the website. Every message is written twice: once to the tab for the page"],
    ["it came from (Home, Clients, Candidates, Jobs, Disciplines, About, Contact) and once to the tab"],
    ["for the kind of form it was (Candidate Submissions, Client Enquiries, Contact Enquiries)."],
    ["Use the page tabs to see what a page is producing. Use the form tabs to work a pipeline."],
    ["Each row carries a Submission ID. Quote it in any reply so the thread can be traced."],
    [""],
    ["WHERE THE CVs ARE"],
    ["Every uploaded CV goes to Drive, into a dated folder under 'Surface Talent — Website CVs'."],
    ["The 'CV / Document' column on Candidate Submissions is a direct link to that file. Click it."],
    [""],
    ["EMAIL ALERTS"],
    ["Every submission emails the address in NOTIFY_TO (Extensions > Apps Script > Project Settings > Script Properties)."],
    ["Change that property to change who is told. No code edit needed."],
    [""],
    ["THE _Raw AND _Audit TABS"],
    ["Hidden on purpose. _Raw is the untouched payload, _Audit is the delivery log. Leave both alone; they are what"],
    ["makes it possible to prove what a candidate actually sent and when."],
    [""],
    ["RESTYLING"],
    ["If the formatting ever gets messy, run Extensions > Apps Script > formatWorkbook. It restyles every tab and"],
    ["never touches your rows."],
  ];
  sheet.getRange(1, 1, lines.length, 1).setValues(lines);
  sheet.getRange(1, 1).setFontSize(16).setFontWeight("bold");
  // headings are found by content, so adding a line to the copy above cannot mis-colour them
  var headings = [];
  for (var h = 0; h < lines.length; h++) {
    var text = String(lines[h][0] || "");
    if (text && text === text.toUpperCase() && text.length > 3) headings.push(h + 1);
  }
  for (var i = 0; i < headings.length; i++) sheet.getRange(headings[i], 1).setFontWeight("bold").setFontColor("#B87333");
  sheet.setColumnWidth(1, 900);
  sheet.setHiddenGridlines(true);
}

function ensureSheet_(ss, name, headers, hidden) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name, ss.getNumSheets());

  var hasHeader = sheet.getLastRow() > 0 && String(sheet.getRange(1, 1).getValue() || "").trim() !== "";
  if (!hasHeader) {
    if (sheet.getMaxColumns() < headers.length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
    }
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight("bold").setBackground("#F1F3F4").setVerticalAlignment("middle");
    sheet.setFrozenRows(1);
    if (!hidden) {
      for (var i = 0; i < headers.length; i++) {
        sheet.setColumnWidth(i + 1, COLUMN_WIDTHS[headers[i]] || DEFAULT_COLUMN_WIDTH);
        if (WRAP_HEADERS[headers[i]]) {
          sheet.getRange(1, i + 1, sheet.getMaxRows(), 1).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
        }
      }
    }
  }

  if (hidden && !sheet.isSheetHidden()) sheet.hideSheet();
}

function getSheetMeta_(ss, sheetName, fallbackHeaders) {
  if (HEADER_CACHE_[sheetName]) return HEADER_CACHE_[sheetName];

  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Missing sheet: " + sheetName);

  var headers = [];
  var lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    var raw = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    for (var i = 0; i < raw.length; i++) headers.push(String(raw[i] || "").trim());
    while (headers.length && !headers[headers.length - 1]) headers.pop();
  }
  if (!headers.length) {
    sheet.getRange(1, 1, 1, fallbackHeaders.length).setValues([fallbackHeaders]);
    headers = fallbackHeaders.slice();
  }

  var indexByName = {};
  for (var j = 0; j < headers.length; j++) {
    if (!headers[j]) continue;
    indexByName[headers[j]] = j;
    indexByName[headers[j].toLowerCase()] = j;
  }

  HEADER_CACHE_[sheetName] = { sheet: sheet, headers: headers, indexByName: indexByName };
  return HEADER_CACHE_[sheetName];
}

/**
 * Appends one row mapped by header name. Every cell is written as plain text
 * (leading "+" on phones survives, and user text starting with "=" can never
 * become a formula); values of the form { formula: "=..." } are set as formulas.
 * Returns the 1-based row number written.
 */
function appendByHeaders_(ss, sheetName, fallbackHeaders, valuesByHeader) {
  var meta = getSheetMeta_(ss, sheetName, fallbackHeaders);
  var row = [];
  var formulas = [];

  for (var i = 0; i < meta.headers.length; i++) {
    var key = meta.headers[i];
    var val = key ? valuesByHeader[key] : null;
    if (val == null && key) val = valuesByHeader[key.toLowerCase()];
    if (val == null) val = "";
    if (Object.prototype.toString.call(val) === "[object Array]") {
      val = joinList_(val);
    } else if (val && typeof val === "object") {
      if (val.formula) formulas.push({ col: i + 1, formula: val.formula });
      val = "";
    }
    row.push(String(val));
  }

  var sheet = meta.sheet;
  var nextRow = sheet.getLastRow() + 1;
  var rowRange = sheet.getRange(nextRow, 1, 1, row.length);
  rowRange.setNumberFormat("@");
  rowRange.setValues([row]);
  for (var f = 0; f < formulas.length; f++) {
    sheet.getRange(nextRow, formulas[f].col).setNumberFormat("General").setFormula(formulas[f].formula);
  }
  return nextRow;
}

function isDuplicate_(ss, submissionId) {
  var meta = getSheetMeta_(ss, SHEET_RAW, RAW_HEADERS);
  var col = meta.indexByName["submission_id"];
  if (col == null) return false;
  var lastRow = meta.sheet.getLastRow();
  if (lastRow < 2) return false;
  var hit = meta.sheet
    .getRange(2, col + 1, lastRow - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .matchCase(true)
    .findNext();
  return !!hit;
}

// ---------------------------------------------------------------------------
// Drive
// ---------------------------------------------------------------------------

function uploadCv_(cv, record, cfg) {
  var ext = String(cv.ext || extFromName_(cv.filename)).toLowerCase().replace(/^\./, "");
  var allowedMimes = CV_TYPES[ext];
  if (!allowedMimes) throw new Error("cv_type_not_allowed: ." + (ext || "?"));

  var mime = String(cv.mime || "").toLowerCase().split(";")[0].trim();
  if (allowedMimes.indexOf(mime) === -1) throw new Error("cv_mime_not_allowed: " + (mime || "missing"));

  var b64 = String(cv.base64 || "");
  var comma = b64.indexOf(",");
  if (b64.slice(0, 5) === "data:" && comma !== -1) b64 = b64.slice(comma + 1);
  var bytes;
  try {
    bytes = Utilities.base64Decode(b64);
  } catch (decodeErr) {
    bytes = Utilities.base64DecodeWebSafe(b64);
  }
  if (!bytes || !bytes.length) throw new Error("cv_empty");
  if (bytes.length > MAX_CV_BYTES) throw new Error("cv_too_large: " + bytes.length + " bytes");

  var name = buildCvName_(record, ext);
  var folder = resolveCvFolder_(cfg, record.submitted_at);
  var file = folder.createFile(Utilities.newBlob(bytes, allowedMimes[0], name));
  // Sharing stays at the Drive default (private to the account) — never set anyone-with-link.
  return { url: file.getUrl(), name: name, id: file.getId() };
}

function extFromName_(filename) {
  var m = /\.([A-Za-z0-9]+)$/.exec(String(filename || ""));
  return m ? m[1] : "";
}

/** YYYY-MM-DD__<SUBMISSION-ID>__<Candidate-Name>__CV.<ext> */
function buildCvName_(record, ext) {
  var date = Utilities.formatDate(record.submitted_at, TIMEZONE, "yyyy-MM-dd");
  return date + "__" + fileSafe_(record.submission_id, "submission") + "__" + fileSafe_(record.name, "Candidate") + "__CV." + ext;
}

function fileSafe_(value, fallback) {
  var s = String(value || "")
    .replace(/[^A-Za-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return s || fallback;
}

function resolveCvFolder_(cfg, date) {
  var root = cfg.cvFolderId
    ? DriveApp.getFolderById(cfg.cvFolderId)
    : findOrCreateFolder_(DriveApp.getRootFolder(), CV_ROOT_FOLDER_NAME);
  return findOrCreateFolder_(root, Utilities.formatDate(date, TIMEZONE, "yyyy"));
}

function findOrCreateFolder_(parent, name) {
  var it = parent.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return parent.createFolder(name);
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

function sendNotification_(record, cfg, sheetId) {
  var staging = record.environment === "staging";
  var to = uniqueRecipients_([cfg.notifyTo, DEFAULT_NOTIFY_TO]);
  var cc = uniqueRecipients_([cfg.notifyCc, DEFAULT_NOTIFY_CC]).filter(function (address) {
    return to.indexOf(address) === -1;
  });
  var options = {
    to: to.join(","),
    subject: (staging ? "[STAGING] " : "") + buildSubject_(record),
    body: buildEmailLines_(record, cfg, sheetId).join("\n"),
    name: "Surface Talent Website",
  };
  if (cc.length) options.cc = cc.join(",");
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(record.email)) options.replyTo = record.email;
  MailApp.sendEmail(options);
}

function uniqueRecipients_(values) {
  var seen = {};
  var result = [];
  values.forEach(function (value) {
    String(value || "").split(",").map(function (address) { return address.trim().toLowerCase(); }).filter(Boolean).forEach(function (address) {
      if (!seen[address] && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) {
        seen[address] = true;
        result.push(address);
      }
    });
  });
  return result;
}

function buildSubject_(r) {
  var name = r.name || "Unknown";
  if (r.form_type === "candidate_registration") return "[Surface Talent] New candidate registration — " + name;
  if (r.form_type === "contact_hiring") {
    return "[Surface Talent] New hiring enquiry — " + (r.company || name) + (r.target_role ? " — " + r.target_role : "");
  }
  if (r.form_type === "contact_career_move") return "[Surface Talent] Career move enquiry — " + name;
  return "[Surface Talent] General enquiry — " + name;
}

function buildEmailLines_(r, cfg, sheetId) {
  var lines = [
    "Surface Talent website — " + r.form_label + (r.environment === "staging" ? " (STAGING TEST)" : ""),
    "",
    "Submission ID: " + r.submission_id,
    "Submitted:     " + r.submitted_at_local + " (" + TIMEZONE + ")",
    "Environment:   " + r.environment,
    "Sheet tab:     " + r.target_sheet,
    "",
    "Name:    " + (r.name || "—"),
  ];
  if (r.company) lines.push("Company: " + r.company);
  lines.push("Email:   " + (r.email || "—"));
  lines.push("Phone:   " + (r.phone_e164 || r.phone_display || "—"));
  lines.push("");

  var answers = importantAnswers_(r);
  if (answers.length) {
    lines.push("Details");
    for (var i = 0; i < answers.length; i++) lines.push("  " + answers[i][0] + ": " + answers[i][1]);
    lines.push("");
  }

  lines.push("Message:");
  lines.push(r.message || "(none)");
  lines.push("");
  lines.push("Source page: " + (r.source_page || "—"));
  if (r.cv_url) lines.push("CV (Drive): " + r.cv_url);
  else if (r.cv_error) lines.push("CV: upload failed — " + r.cv_error);
  lines.push("Open in sheet: https://docs.google.com/spreadsheets/d/" + cfg.spreadsheetId + "/edit#gid=" + sheetId);
  return lines;
}

/** The answers worth reading in the inbox, per form; empty values are skipped. */
function importantAnswers_(r) {
  var pairs;
  if (r.form_type === "candidate_registration") {
    pairs = [
      ["Current role", r.current_title],
      ["Current employer", r.current_employer],
      ["Location", r.location + (r.postcode ? " (" + r.postcode + ")" : "")],
      ["Target role", r.target_role],
      ["Discipline", r.discipline],
      ["Experience", r.years_experience],
      ["Employment type", r.employment_types],
      ["Salary / rate", r.salary_expectation],
      ["Notice period", r.notice_period],
      ["Availability", r.availability],
      ["Work authorisation", r.right_to_work],
      ["Preferred locations", r.preferred_locations],
      ["LinkedIn", r.linkedin_url],
    ];
  } else if (r.form_type === "contact_hiring") {
    pairs = [
      ["Enquiry type", r.enquiry_type],
      ["Discipline", r.discipline],
      ["Hiring requirement", r.target_role],
      ["Hiring volume", r.hires_count],
      ["Location", r.location],
      ["Employment type", r.employment_types],
      ["Hiring timeline", r.hiring_timeline],
      ["Target start", r.target_start],
    ];
  } else {
    pairs = [
      ["Enquiry type", r.enquiry_type],
      ["Discipline", r.discipline],
      ["Current role", r.current_title],
    ];
  }
  var out = [];
  for (var i = 0; i < pairs.length; i++) {
    if (String(pairs[i][1] || "").trim()) out.push(pairs[i]);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Audit + response
// ---------------------------------------------------------------------------

function audit_(ss, record, result) {
  try {
    appendByHeaders_(ss, SHEET_AUDIT, AUDIT_HEADERS, {
      Timestamp: Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss"),
      "Submission ID": record.submission_id,
      Event: result.event,
      "Form Type": record.form_type,
      "Target Sheet": record.target_sheet,
      "Sheet Write": result.sheetWrite,
      "Drive Upload": result.drive,
      "Email Notification": result.email,
      "Error Code": result.errorCode || "",
      "Error Summary": result.errorSummary || "",
      Environment: record.environment,
    });
  } catch (ignore) {
    // The audit log must never take a submission down with it.
  }
}

function msg_(err) {
  var s = err && err.message ? err.message : String(err);
  return s.slice(0, 300);
}

/** Apps Script always answers HTTP 200 — the real status travels in the JSON. */
function jsonOut_(obj, status) {
  obj.status = status || 200;
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
