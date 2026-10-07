import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { CandidateForm } from "@/components/forms/CandidateForm";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHead, RuleGrid, Steps, Pair } from "@/components/site/Blocks";

export const metadata: Metadata = {
  title: "Surface Engineering Jobs and Careers — Surface Talent",
  description: "Roles across electroplating, anodising, powder coating, heat treatment and thermal spray. Confidential, and your CV goes nowhere without your say-so.",
  alternates: { canonical: `${SITE_ORIGIN}/candidates` },
  openGraph: { title: "Surface Engineering Jobs and Careers — Surface Talent", description: "Roles across electroplating, anodising, powder coating, heat treatment and thermal spray. Confidential, and your CV goes nowhere without your say-so.", url: `${SITE_ORIGIN}/candidates` },
};

const PROCESS = [
  { title: "Real conversation", body: "About your experience, what you actually want next, and what you’re worth." },
  { title: "Honest feedback", body: "On fit, salary, progression and market conditions. No games." },
  { title: "Direct access", body: "To decision-makers at the hiring business. No gatekeeping." },
  { title: "Week-12 support", body: "Through notice, offer, onboarding and the first 90 days." },
];
const ROLES = [
  { title: "Process and production", body: "Engineers, team leaders, shift managers, production managers." },
  { title: "Quality and technical", body: "Quality engineers, QA managers, technical directors, chemists." },
  { title: "EHS and compliance", body: "EHS advisors, SHEQ managers, environmental and regulatory leads." },
  { title: "Continuous improvement", body: "LEAN practitioners, CI managers, operational excellence leads." },
  { title: "Maintenance and controls", body: "Maintenance engineers, E&I techs, controls and automation specialists." },
  { title: "Commercial and leadership", body: "BDMs, sales managers, sales directors, GMs, operations and managing directors." },
];

/** Candidates (October 2026 brand pass). */
export default function CandidatesPage() {
  return (
    <div className="st-page">
      <PageHero
        className="st-cahero"
        eyebrow="For candidates"
        title="Your next role in surface engineering."
        body="Tell us what you’re looking for. Every conversation is confidential, with someone who knows the sector. We’ll come back to you within 24 hours."
        actions={<Button href="/jobs" variant="secondary">See live jobs</Button>}
        aside={
          <div className="st-formcard" data-register-card>
            <div className="st-formcard__head">
              <h2 className="st-h4">Register in confidence</h2>
              <p className="st-body-sm">Your CV goes nowhere without your say-so.</p>
            </div>
            <CandidateForm />
          </div>
        }
      />

      <Section tone="white" labelledBy="diff-title">
        <SectionHead
          layout="split"
          eyebrow="The difference"
          titleId="diff-title"
          title="Recruiters who know the sector."
          lede={<><p>Most agencies can’t tell a rectifier from a rinse tank. We can. That means we ask the right questions, represent your experience properly, and match you to businesses where you’ll actually want to stay.</p><p>We cover permanent, contract and interim roles from process engineer up to managing director. Every conversation is confidential. We never send your CV anywhere without your say-so.</p></>}
        />
      </Section>

      <Section tone="dark" labelledBy="process-title">
        <SectionHead layout="split" eyebrow="What you get" titleId="process-title" title="A proper process. Not a CV blast." />
        <Steps items={PROCESS} />
      </Section>

      <Section tone="chalk" labelledBy="roles-title">
        <SectionHead layout="split" eyebrow="Who we place" titleId="roles-title" title="The roles we work on." lede="Permanent, contract and interim, from process engineer to managing director." />
        <RuleGrid items={ROLES} />
      </Section>

      <Section tone="white" label="Register or browse roles">
        <Pair
          items={[
            { eyebrow: "Ready?", title: "Register now.", body: "Fill in the form above. Confidential. 24-hour response.", action: <Button href="#register">Fill the form</Button> },
            { eyebrow: "Browse", title: "See live roles.", body: "Current vacancies across UK surface engineering and metal finishing.", action: <Button href="/jobs" variant="secondary">See live jobs</Button> },
          ]}
        />
      </Section>
    </div>
  );
}
