import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CandidateForm } from "@/components/forms/CandidateForm";
import "@/styles/pages/candidates.css";
import { BrLg } from "@/components/ui/BrLg";

export const metadata: Metadata = {
  title: "Surface Engineering Jobs and Careers — Surface Talent",
  description: "Roles across electroplating, anodising, powder coating, heat treatment and thermal spray. Confidential, and your CV goes nowhere without your say-so.",
  alternates: { canonical: `${SITE_ORIGIN}/candidates` },
  openGraph: { title: "Surface Engineering Jobs and Careers — Surface Talent", description: "Roles across electroplating, anodising, powder coating, heat treatment and thermal spray. Confidential, and your CV goes nowhere without your say-so.", url: `${SITE_ORIGIN}/candidates` },
};

const PROCESS = [
  { n: "01", title: "Real conversation", body: "About your experience, what you actually want next, and what you’re worth.", art: "/assets/illustrations/process-01-conversation.svg" },
  { n: "02", title: "Honest feedback", body: "On fit, salary, progression and market conditions. No games.", art: "/assets/illustrations/process-02-feedback.svg" },
  { n: "03", title: "Direct access", body: "To decision-makers at the hiring business. No gatekeeping.", art: "/assets/illustrations/process-03-access.svg" },
  { n: "04", title: "Week-12 support", body: "Through notice, offer, onboarding and the first 90 days.", art: "/assets/illustrations/process-04-support.svg" },
];
const ROLES = [
  { title: "Process and production", body: "Engineers, team leaders, shift managers, production managers." },
  { title: "Quality and technical", body: "Quality engineers, QA managers, technical directors, chemists." },
  { title: "EHS and compliance", body: "EHS advisors, SHEQ managers, environmental and regulatory leads." },
  { title: "Continuous improvement", body: "LEAN practitioners, CI managers, operational excellence leads." },
  { title: "Maintenance and controls", body: "Maintenance engineers, E&I techs, controls and automation specialists." },
  { title: "Commercial and leadership", body: "BDMs, sales managers, sales directors, GMs, operations and managing directors." },
];

/** Figma Candidates 2027:20100. */
export default function CandidatesPage() {
  return (
    <div className="st-page">
      <section className="st-cahero" aria-labelledby="page-title">
        <div className="st-orb st-cahero__orb" aria-hidden="true" />
        <div className="st-cahero__inner">
          <div className="st-cahero__copy">
            <Eyebrow>For candidates</Eyebrow>
            <h1 id="page-title" className="st-h1">Your next role in<BrLg />surface engineering.</h1>
            <p className="st-body">Tell us what you’re looking for. Every conversation is confidential, with someone who knows the sector. We’ll come back to you within 24 hours.</p>
            <div className="st-btn-row"><Button href="/jobs" variant="secondary">See live jobs</Button></div>
          </div>
          <div className="st-cahero__card" data-register-card>
            <h2 className="sr-only">Register with Surface Talent</h2>
            <CandidateForm />
          </div>
        </div>
      </section>

      <section className="st-block st-block--cream" aria-labelledby="diff-title">
        <div className="st-inner st-cadiff">
          <div className="st-cadiff__head">
            <Eyebrow diamond>The difference</Eyebrow>
            <h2 id="diff-title" className="st-h2">Recruiters who know the sector.</h2>
          </div>
          <div className="st-cadiff__copy">
            <p className="st-body">Most agencies can’t tell a rectifier from a rinse tank. We can. That means we ask the right questions, represent your experience properly, and match you to businesses where you’ll actually want to stay.</p>
            <p className="st-body">We cover permanent, contract and interim roles from process engineer up to managing director. Every conversation is confidential. We never send your CV anywhere without your say-so.</p>
          </div>
        </div>
      </section>

      <section className="st-band" aria-labelledby="process-title">
        <div className="st-inner st-band__inner">
          <div className="st-heading st-heading--center">
            <Eyebrow diamond>What you get</Eyebrow>
            <h2 id="process-title" className="st-h2">A proper process. Not a CV blast.</h2>
          </div>
          <ol className="st-caproc">
            {PROCESS.map((p) => (
              <li key={p.n} className="st-caproc__item">
                <img className="st-caproc__art" src={p.art} alt="" width={300} height={160} loading="lazy" />
                <Eyebrow className="st-caproc__n" tone="light">{p.n}</Eyebrow>
                <h3 className="st-h4">{p.title}</h3>
                <p className="st-body">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="st-block" aria-labelledby="roles-title">
        <div className="st-inner st-block__inner st-block__inner--tight">
          <div className="st-heading st-heading--center st-heading--520">
            <Eyebrow diamond>Who we place</Eyebrow>
            <h2 id="roles-title" className="st-h2" style={{ color: "var(--ink-soft)" }}>The roles we work on.</h2>
          </div>
                      <div className="st-grid3">
              {ROLES.map((r) => (
                <article key={r.title} className="st-grid3__card" style={{ minHeight: 156 }}>
                  <div className="st-grid3__text">
                    <h3 className="st-grid3__title">{r.title}</h3>
                    <p className="st-body">{r.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
      </section>

      <section className="st-split" aria-label="Register or browse roles">
        <div className="st-split__panel st-split__panel--lined" style={{ minHeight: 394 }}>
          <div className="st-split__copy">
            <Eyebrow>Ready?</Eyebrow>
            <h2 className="st-h2">Register now.</h2>
            <p className="st-body">Fill in the form above. Confidential. 24-hour response.</p>
          </div>
          <div className="st-split__cta"><Button href="#register">Fill the form</Button></div>
          <div className="st-split__art st-split__art--cands" aria-hidden="true"><img src="/assets/illustrations/process-01-conversation-light.svg" alt="" /></div>
        </div>
        <div className="st-split__panel st-split__panel--lined" style={{ minHeight: 394 }}>
          <div className="st-split__copy">
            <Eyebrow>Browse</Eyebrow>
            <h2 className="st-h2">See live roles.</h2>
            <p className="st-body">Current vacancies across UK surface engineering and metal finishing.</p>
          </div>
          <div className="st-split__cta"><Button href="/jobs">See live jobs</Button></div>
        </div>
      </section>
    </div>
  );
}
