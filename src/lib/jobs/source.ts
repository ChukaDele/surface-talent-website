/**
 * Live jobs boundary.
 *
 * The board a person edits is the "Live Jobs" tab of the Surface Talent website workbook, read
 * through the same Apps Script web app the forms post to. Someone adds a row, sets Status to Live,
 * and the role is on the site within the revalidate window. No code deploy, no developer.
 *
 * Airtable remains supported for the legacy estate: if AIRTABLE_TOKEN and AIRTABLE_BASE_ID are set
 * they win, so nothing breaks while the two run side by side. With neither source configured the
 * Jobs page renders the approved empty state. This module never invents vacancies.
 */
export type Job = { id: string; title: string; subtitle?: string; discipline?: string; func?: string; seniority?: string; type?: string; location?: string; salary?: string; hook?: string; posted?: string };

export type JobsResult = { configured: boolean; jobs: Job[]; source?: "sheet" | "airtable"; error?: string };

const PUBLIC_FIELDS = ["Title", "Subtitle", "Status", "Discipline", "Function", "Seniority", "Type", "Location", "Salary", "Hook"];

/** Five minutes: fast enough that posting a role feels immediate, slow enough to stay off the quota. */
const REVALIDATE = 300;

export async function fetchLiveJobs(): Promise<JobsResult> {
  const airtable = await fetchFromAirtable();
  if (airtable) return airtable;
  const sheet = await fetchFromSheet();
  if (sheet) return sheet;
  return { configured: false, jobs: [] };
}

async function fetchFromSheet(): Promise<JobsResult | null> {
  const url = process.env.APPS_SCRIPT_URL, secret = process.env.SUBMISSION_SECRET;
  if (!url || !secret) return null;
  try {
    const endpoint = `${url}${url.includes("?") ? "&" : "?"}resource=jobs&secret=${encodeURIComponent(secret)}`;
    const res = await fetch(endpoint, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return { configured: true, jobs: [], source: "sheet", error: `sheet_${res.status}` };
    const data = (await res.json()) as { ok?: boolean; jobs?: Job[] };
    if (!data.ok || !Array.isArray(data.jobs)) return { configured: true, jobs: [], source: "sheet", error: "sheet_payload" };
    return { configured: true, source: "sheet", jobs: data.jobs.filter((j) => j && typeof j.title === "string" && j.title.trim()) };
  } catch (err) {
    console.error("[jobs] sheet fetch failed", String(err));
    return { configured: true, jobs: [], source: "sheet", error: "sheet_unreachable" };
  }
}

async function fetchFromAirtable(): Promise<JobsResult | null> {
  const token = process.env.AIRTABLE_TOKEN, baseId = process.env.AIRTABLE_BASE_ID, table = process.env.AIRTABLE_TABLE || "Jobs";
  if (!token || !baseId) return null;
  try {
    const params = new URLSearchParams({ pageSize: "100", filterByFormula: "{Status}='Live'" });
    PUBLIC_FIELDS.forEach((f) => params.append("fields[]", f));
    const res = await fetch(`https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(table)}?${params}`, { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: REVALIDATE } });
    if (!res.ok) return { configured: true, jobs: [], source: "airtable", error: `airtable_${res.status}` };
    const data = (await res.json()) as { records?: { id: string; fields: Record<string, string> }[] };
    return { configured: true, source: "airtable", jobs: (data.records || []).map((r) => ({ id: r.id, title: r.fields.Title, subtitle: r.fields.Subtitle, discipline: r.fields.Discipline, func: r.fields.Function, seniority: r.fields.Seniority, type: r.fields.Type, location: r.fields.Location, salary: r.fields.Salary, hook: r.fields.Hook })).filter((j) => j.title) };
  } catch (err) {
    console.error("[jobs] airtable fetch failed", String(err));
    return { configured: true, jobs: [], source: "airtable", error: "airtable_unreachable" };
  }
}
