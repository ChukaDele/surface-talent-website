import { NextResponse } from "next/server";
import { appsScriptPersistence, processSubmission, rateLimited } from "@/lib/forms/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/submit — multipart form submissions (candidate registration, contact / hiring
 * enquiries). Validates server-side, generates the Submission ID, guards against bots and
 * duplicates, then persists via the Google Apps Script web app (Sheets + Drive + email).
 * Secrets stay server-side: APPS_SCRIPT_URL, SUBMISSION_SECRET. SITE_ENV marks staging rows.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate_limited", message: "Too many attempts from this connection. Try again in a few minutes." }, { status: 429, headers: { "Retry-After": "600" } });
  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json({ ok: false, error: "invalid_body", message: "That didn't send properly. Reload and try again." }, { status: 400 }); }
  const url = process.env.APPS_SCRIPT_URL, secret = process.env.SUBMISSION_SECRET;
  const persistence = url && secret ? appsScriptPersistence(url, secret) : null;
  const result = await processSubmission(form, { ip, userAgent: req.headers.get("user-agent") || "", environment: process.env.SITE_ENV === "production" ? "production" : "staging", persistence });
  if (!result.ok) { const { status, ...body } = result; return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
