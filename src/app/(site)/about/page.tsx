import { completePageMetadata } from "@/lib/site/metadata";
import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHead, RuleGrid, Steps } from "@/components/site/Blocks";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = completePageMetadata({
  title: "Surface Engineering Executive Search — Surface Talent",
  description: "Founded inside the sector, not adjacent to it, by people who own and run UK finishing plants. Director-level and technical search across UK finishing.",
  alternates: { canonical: `${SITE_ORIGIN}/about` },
  openGraph: { title: "Surface Engineering Executive Search — Surface Talent", description: "Founded inside the sector, not adjacent to it, by people who own and run UK finishing plants. Director-level and technical search across UK finishing.", url: `${SITE_ORIGIN}/about` },
});

const ORIGIN = [
  "The people behind Surface Talent own and run UK surface finishing plants across anodising, electroplating and related processes.",
  "That gives us technical fluency, operator instinct and a network most recruiters don’t have access to.",
  "We recruit permanent, contract and interim placements across the UK. We’re not a volume agency and we don’t try to be.",
];

const LEADERS = [
  { title: "Managing Director", body: "Full profit & loss leadership of a single site or business unit." },
  { title: "Operations Director", body: "Multi-site operations, production and LEAN transformation." },
  { title: "Technical Director", body: "Process, chemistry, quality standards and NPD leadership." },
  { title: "Commercial / Sales Director", body: "Strategy, pipeline, pricing, key accounts and team build." },
  { title: "Quality Director", body: "NADCAP, AS9100, ISO, audit and technical assurance leadership." },
  { title: "GM / Business Unit Lead", body: "General management of a site, division or specialist business." },
];

const APPROACH = [
  { title: "Brief", body: "A thorough brief, agreed in writing before anything else happens." },
  { title: "Map", body: "Discreet market mapping across the plants and suppliers that matter." },
  { title: "Approach", body: "Direct approaches and a shortlist of two to three credible operators." },
  { title: "Stay close", body: "Close involvement through offer, onboarding and the first 90 days." },
];

/** About (October 2026 brand pass): static, typographic; the pinned scroll sequence is retired. */
export default function AboutPage() {
  return (
    <div className="st-page">
      <PageHero
        eyebrow="About"
        title="Built by operators. Run by recruiters who know the trade."
        body="Surface Talent was founded to fix a real problem: the surface engineering sector is underserved by generalist recruitment. Good people slip through. Good businesses hire the wrong fit. Productivity and retention suffer."
        actions={<><Button href="/contact#brief">Brief us on a role</Button><Button href="/clients" variant="secondary">How we work with clients</Button></>}
      />

      <Section tone="white" labelledBy="origin-title">
        <div className="st-twocol">
          <div className="st-shead__main">
            <Eyebrow>Owner operators · UK finishing plants</Eyebrow>
            <h2 id="origin-title" className="st-h2">Founded by people who own and run UK finishing plants.</h2>
          </div>
          <div className="st-prose st-prose--lead">
            {ORIGIN.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
          </div>
        </div>
      </Section>

      <Section tone="dark" labelledBy="lead-title">
        <SectionHead
          layout="split"
          eyebrow="Leadership appointments"
          titleId="lead-title"
          title="Director-level search, woven through."
          lede="Senior hiring runs through everything we do. Where boards, owners and shareholders need a confidential, retained process, we handle it end to end."
        />
        <RuleGrid items={LEADERS} />
      </Section>

      <Section tone="chalk" labelledBy="approach-title">
        <SectionHead
          layout="split"
          eyebrow="Our approach"
          titleId="approach-title"
          title="Retained, and measured on the hire that stays."
          lede="A shortlist of two to three people you would hire, assessed by someone who has run the process."
          actions={<Button href="/contact#brief">Start a retained search</Button>}
        />
        <Steps items={APPROACH} />
      </Section>
    </div>
  );
}
