import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FixedStage } from "@/components/ui/FixedStage";
import { ClientsHero } from "@/components/pages/clients/ClientsHero";
import { DIFFERENCE, RECRUIT, STEPS } from "@/components/pages/clients/clientsData";
import { BriefIllustration, SearchIllustration, AssessIllustration, PlaceIllustration } from "@/components/home/mocks/HowCards";
import "@/styles/how.css";
import "@/styles/pages/clients.css";
import { BrLg } from "@/components/ui/BrLg";

export const metadata: Metadata = {
  title: "Metal Finishing Recruitment Agency — Surface Talent",
  description: "Hiring plant managers, process engineers or quality leads for a plating, coating or heat treatment operation? Send a brief; we reply within 24 hours.",
  alternates: { canonical: `${SITE_ORIGIN}/clients` },
  openGraph: { title: "Metal Finishing Recruitment Agency — Surface Talent", description: "Hiring plant managers, process engineers or quality leads for a plating, coating or heat treatment operation? Send a brief; we reply within 24 hours.", url: `${SITE_ORIGIN}/clients` },
};

const STEP_ART = [BriefIllustration, SearchIllustration, AssessIllustration, PlaceIllustration];

/** Figma Clients frame 2010:2 (canonical) + Hero 2027:20831 (start state). */
export default function ClientsPage() {
  return (
    <div className="st-page">
      <ClientsHero />

      <section className="st-block" aria-labelledby="diff-title">
        <div className="st-inner st-block__inner">
          <div className="st-heading st-heading--center st-heading--520">
            <Eyebrow>Our difference</Eyebrow>
            <h2 id="diff-title" className="st-h2" style={{ color: "#000" }}>Command of the sector. Not adjacent to it.</h2>
          </div>
          <div className="st-cards3">
            {DIFFERENCE.map((d) => (
              <article key={d.title} className="st-card st-card--between" style={{ minHeight: 300 }}>
                <div className="st-card__icon"><img src={d.icon} alt="" width={d.iconW} height={64} /></div>
                <div className="st-card__text">
                  <h3 className="st-h4">{d.title}</h3>
                  <p className="st-body">{d.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="st-band" aria-labelledby="steps-title">
        <div className="st-inner st-band__inner">
          <div className="st-heading st-heading--center">
            <Eyebrow>How we work</Eyebrow>
            <h2 id="steps-title" className="st-h2">Four steps. No surprises.</h2>
          </div>
          <ol className="st-csteps" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {STEPS.map((s, i) => {
              const Art = STEP_ART[i];
              return (
                <li key={s.title} className="st-cstep">
                  <div className="st-cstep__art"><FixedStage w={420} h={320}><Art /></FixedStage></div>
                  <Eyebrow className="st-cstep__n" tone="light">{s.n}</Eyebrow>
                  <h3 className="st-h4">{s.title}</h3>
                  <p className="st-body">{s.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="st-block" id="recruit" aria-labelledby="recruit-title">
        <div className="st-inner st-block__inner st-block__inner--tight">
          <div className="st-crecruit__head">
            <Eyebrow>What we recruit</Eyebrow>
            <h2 id="recruit-title" className="st-h2">The full operational and commercial spine.</h2>
            <Button href="/about">Read about us</Button>
          </div>
                      <div className="st-grid3">
              {RECRUIT.map((r) => (
                <article key={r.title} className="st-grid3__card" style={{ minHeight: 190 }}>
                  <div className="st-grid3__text">
                    <h3 className="st-grid3__title">{r.title}</h3>
                    <p className="st-body">{r.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
      </section>

      <section className="st-split" aria-label="Retained and contingent search">
        <div className="st-split__panel">
          <div className="st-split__copy">
            <Eyebrow>Retained search</Eyebrow>
            <h2 className="st-h2">For critical hires.</h2>
            <p className="st-body">Director-level and critical technical appointments.<BrLg />Retained, confidential, thorough.</p>
          </div>
          <div className="st-split__cta"><Button href="/contact#brief">Start a retained search</Button></div>
          <div className="st-split__art st-split__art--clients" aria-hidden="true"><img src="/assets/illustrations/critical-hires.svg" alt="" /></div>
        </div>
        <div className="st-split__panel">
          <div className="st-split__copy">
            <Eyebrow>Contingent</Eyebrow>
            <h2 className="st-h2">For volume and speed.</h2>
            <p className="st-body">Process, plant and functional hiring at pace.<BrLg />Permanent, contract or interim.</p>
          </div>
          <div className="st-split__cta"><Button href="/contact#brief">Brief us on a role</Button></div>
          <div className="st-split__art st-split__art--clients" aria-hidden="true"><img src="/assets/illustrations/volume-speed.svg" alt="" /></div>
        </div>
      </section>
    </div>
  );
}
