import { NextResponse } from "next/server";
import { fetchLiveJobs } from "@/lib/jobs/source";

export const dynamic = "force-dynamic";

/**
 * GET /api/jobs — the live vacancy board.
 *
 * 503 when no source is configured at all, so the difference between "we have no vacancies" and
 * "the board is not wired up" is never hidden. 200 with an empty list when a source is configured
 * and genuinely has nothing live, which is a real state and not an error.
 */
export async function GET() {
  const r = await fetchLiveJobs();
  if (!r.configured) return NextResponse.json({ error: "jobs_unavailable", message: "Jobs source is not configured." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ jobs: r.jobs, source: r.source, error: r.error }, { headers: { "Cache-Control": "public, max-age=60" } });
}
