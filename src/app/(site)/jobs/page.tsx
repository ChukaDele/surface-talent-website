import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/site/PageHero";
import { fetchLiveJobs } from "@/lib/jobs/source";
import "@/styles/pages/jobs.css";

export const metadata: Metadata = {
  title: "Live Metal Finishing Jobs — Surface Talent",
  description: "Live permanent, contract and interim vacancies across UK metal finishing — plating, anodising, powder coating, heat treatment and surface treatment.",
  alternates: { canonical: `${SITE_ORIGIN}/jobs` },
  openGraph: { title: "Live Metal Finishing Jobs — Surface Talent", description: "Live permanent, contract and interim vacancies across UK metal finishing — plating, anodising, powder coating, heat treatment and surface treatment.", url: `${SITE_ORIGIN}/jobs` },
};
export const dynamic = "force-dynamic";

/** Figma Jobs 2048:1072 — empty state is the approved default until the Airtable source is configured. */
export default async function JobsPage() {
  const { jobs } = await fetchLiveJobs();
  return (
    <div className="st-page">
      <PageHero eyebrow="Live roles" title="Current vacancies." body="Live roles across UK surface engineering and metal finishing. Permanent, contract and interim." bodyWidth={420} />
      <section className="st-block" aria-label="Vacancies">
        <div className="st-inner st-block__inner" style={{ paddingTop: 0 }}>
          {jobs.length === 0 ? (
            <article className="st-card st-jobs__empty" data-jobs-empty>
              <div className="st-card__icon"><img src="/assets/svg/jobs-icon-empty.svg" alt="" width={80} height={64} /></div>
              <div className="st-card__text">
                <h2 className="st-h4">No vacancies right now</h2>
                <p className="st-body">Nothing is live at the moment. Register your details and we&rsquo;ll come to you when a role fits.</p>
              </div>
              <Button href="/candidates">Register your CV</Button>
            </article>
          ) : (
            <ul className="st-jobs__list">
              {jobs.map((j) => (
                <li key={j.id} className="st-card st-jobs__job">
                  <div className="st-card__text">
                    <h2 className="st-h4">{j.title}</h2>
                    {j.subtitle ? <p className="st-body">{j.subtitle}</p> : null}
                    <p className="st-body-sm st-jobs__meta">{[j.discipline, j.location, j.type, j.salary].filter(Boolean).map((m) => <span key={m}>{m}</span>)}</p>
                  </div>
                  <Button href={`/contact?role=${encodeURIComponent(j.title)}#brief`}>Apply</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <section className="st-band" aria-labelledby="register-title">
        <div className="st-inner st-band__inner">
          <div className="st-heading st-heading--center">
            <Eyebrow diamond>Nothing here for you?</Eyebrow>
            <h2 id="register-title" className="st-h2">Register your CV and we’ll come to you.</h2>
            <p className="st-body st-band__lede">New roles land every week. Tell us what you’re looking for and we’ll get in touch when the right one comes in.</p>
          </div>
          <Button href="/candidates#register" tone="light">Register your CV</Button>
        </div>
      </section>
    </div>
  );
}
