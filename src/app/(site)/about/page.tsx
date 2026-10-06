import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/site/PageHero";
import { EmcSequence } from "@/components/pages/about/EmcSequence";
import "@/styles/pages/about.css";
import { BrLg } from "@/components/ui/BrLg";

export const metadata: Metadata = {
  title: "Surface Engineering Executive Search — Surface Talent",
  description: "Founded inside the sector, not adjacent to it. Sister company of EMC Surface Technologies, running retained director-level search across UK finishing.",
  alternates: { canonical: `${SITE_ORIGIN}/about` },
  openGraph: { title: "Surface Engineering Executive Search — Surface Talent", description: "Founded inside the sector, not adjacent to it. Sister company of EMC Surface Technologies, running retained director-level search across UK finishing.", url: `${SITE_ORIGIN}/about` },
};

const LEADERS = [
  { title: "Managing Director", body: "Full profit & loss leadership of a single site or business unit." },
  { title: "Operations Director", body: "Multi-site operations, production and LEAN transformation." },
  { title: "Technical Director", body: "Process, chemistry, quality standards and NPD leadership." },
  { title: "Commercial / Sales Director", body: "Strategy, pipeline, pricing, key accounts and team build." },
  { title: "Quality Director", body: "NADCAP, AS9100, ISO, audit and technical assurance leadership." },
  { title: "GM / Business Unit Lead", body: "General management of a site, division or specialist business." },
];

/** Figma About 2036:240. */
export default function AboutPage() {
  return (
    <div className="st-page">
      <PageHero className="st-abhero" eyebrow="About" title={<>Built by operators.<BrLg />Run by recruiters who know the trade.</>} body="Surface Talent was founded to fix a real problem: the surface engineering sector is underserved by generalist recruitment. Good people slip through. Good businesses hire the wrong fit. Productivity and retention suffer." bodyWidth={620} />
      <EmcSequence />
      <section className="st-band" aria-labelledby="lead-title">
        <div className="st-inner st-band__inner st-ablead">
          <div className="st-heading st-heading--center">
            <Eyebrow diamond>Leadership appointments</Eyebrow>
            <h2 id="lead-title" className="st-h2">Director-level search, woven through.</h2>
            <p className="st-body st-band__lede">Senior hiring runs through everything we do. Where boards, owners and shareholders need a confidential, retained process, we handle it end to end.</p>
          </div>
          <div className="st-grid3 st-grid3--dark">
            {LEADERS.map((l) => (
              <article key={l.title} className="st-grid3__card" style={{ minHeight: 155 }}>
                <div className="st-grid3__text">
                  <h3 className="st-h4">{l.title}</h3>
                  <p className="st-body">{l.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="st-ablead__approach">
            <p className="st-body">Our approach: thorough brief, discreet market mapping, direct approaches, a shortlist of two to three credible operators, close involvement through offer, onboarding and first 90 days. Retained and measured on the hire that stays.</p>
            <Button href="/contact#brief" tone="light">Start a retained search</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
