import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHead } from "@/components/site/Blocks";
import { fetchLiveJobs } from "@/lib/jobs/source";

export const metadata: Metadata = {
  title: "Live Metal Finishing Jobs — Surface Talent",
  description: "Live permanent, contract and interim vacancies across UK metal finishing — plating, anodising, powder coating, heat treatment and surface treatment.",
  alternates: { canonical: `${SITE_ORIGIN}/jobs` },
  openGraph: { title: "Live Metal Finishing Jobs — Surface Talent", description: "Live permanent, contract and interim vacancies across UK metal finishing — plating, anodising, powder coating, heat treatment and surface treatment.", url: `${SITE_ORIGIN}/jobs` },
};
export const dynamic = "force-dynamic";

/** Jobs (October 2026 brand pass): a ruled list; signal red is used here and only here, for the Live tag. */
export default async function JobsPage() {
  const { jobs } = await fetchLiveJobs();
  return (
    <div className="st-page">
      <PageHero eyebrow="Live roles" title="Current vacancies." body="Live roles across UK surface engineering and metal finishing. Permanent, contract and interim." />
      <Section tone="white" label="Vacancies">
        {jobs.length === 0 ? (
          <div className="st-jobs__empty" data-jobs-empty>
            <div>
              <h2 className="st-h3">No vacancies right now</h2>
              <p className="st-body-lg">Nothing is live at the moment. Register your details and we&rsquo;ll come to you when a role fits.</p>
            </div>
            <Button href="/candidates">Register your CV</Button>
          </div>
        ) : (
          <ul className="st-jobs__list">
            {jobs.map((j) => (
              <li key={j.id} className="st-jobs__job">
                <div className="st-jobs__main">
                  <span className="st-live"><span className="st-live__dot" aria-hidden="true" />Live</span>
                  <h2 className="st-h4">{j.title}</h2>
                  {j.subtitle ? <p className="st-body">{j.subtitle}</p> : null}
                  <p className="st-jobs__meta">{[j.discipline, j.location, j.type, j.salary].filter(Boolean).map((m) => <span key={m}>{m}</span>)}</p>
                </div>
                <Button href={`/contact?role=${encodeURIComponent(j.title)}#brief`}>Apply</Button>
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section tone="chalk" labelledBy="register-title">
        <SectionHead
          layout="split"
          eyebrow="Nothing here for you?"
          titleId="register-title"
          title="Register your CV and we’ll come to you."
          lede="New roles land every week. Tell us what you’re looking for and we’ll get in touch when the right one comes in."
          actions={<Button href="/candidates#register" variant="secondary">Register your CV</Button>}
        />
      </Section>
    </div>
  );
}
