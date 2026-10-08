import { completePageMetadata } from "@/lib/site/metadata";
import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHead, RuleGrid, Steps, Pair } from "@/components/site/Blocks";
import { DIFFERENCE, RECRUIT, STEPS } from "@/components/pages/clients/clientsData";

export const metadata: Metadata = completePageMetadata({
  title: "Metal Finishing Recruitment Agency — Surface Talent",
  description: "Senior and critical hires for plating, anodising, coating and heat treatment businesses, run by people who own finishing plants. Brief us today.",
  alternates: { canonical: `${SITE_ORIGIN}/clients` },
  openGraph: { title: "Metal Finishing Recruitment Agency — Surface Talent", description: "Senior and critical hires for plating, anodising, coating and heat treatment businesses, run by people who own finishing plants. Brief us today.", url: `${SITE_ORIGIN}/clients` },
});

/** Clients (October 2026 brand pass): typographic, hairline grammar; mock UI and line-art retired. */
export default function ClientsPage() {
  return (
    <div className="st-page">
      <PageHero
        className="st-chero"
        eyebrow="For clients"
        title="Hire people who can actually run the process."
        body="A plant manager who understands bath chemistry. A quality lead who can hold a NADCAP audit. A commercial director who can open tier-one aerospace accounts. We find them because we have hired them ourselves."
        actions={<><Button href="/contact#brief">Brief us on a role</Button><BookCallButton variant="secondary" tone="copper">Book a call</BookCallButton></>}
      />

      <Section tone="white" labelledBy="diff-title" className="st-block">
        <SectionHead layout="split" eyebrow="Our difference" titleId="diff-title" title="Command of the sector. Not adjacent to it." />
        <RuleGrid items={DIFFERENCE.map((d, i) => ({ kicker: String(i + 1).padStart(2, "0"), title: d.title, body: d.body }))} />
      </Section>

      <Section tone="dark" labelledBy="steps-title">
        <SectionHead layout="split" eyebrow="How we work" titleId="steps-title" title="Four steps. No surprises." lede="A replacement guarantee backs every shortlist." />
        <Steps items={STEPS.map((s) => ({ label: s.n.split(" · ")[1], title: s.title, body: s.body }))} />
      </Section>

      <Section tone="chalk" id="recruit" labelledBy="recruit-title">
        <SectionHead layout="split" eyebrow="What we recruit" titleId="recruit-title" title="The full operational and commercial spine." lede="Every finishing business needs the same functions, whatever the process. We recruit into all of them." actions={<Button href="/about" variant="secondary">Read about us</Button>} />
        <RuleGrid items={RECRUIT} />
      </Section>

      <Section tone="white" label="Retained and contingent search">
        <Pair
          items={[
            { eyebrow: "Retained search", title: "For critical hires.", body: "Director-level and critical technical appointments. Retained, confidential, thorough.", action: <Button href="/contact#brief">Start a retained search</Button> },
            { eyebrow: "Contingent", title: "For critical roles at pace.", body: "Plant, process and functional leadership when the seat is already empty. Permanent, contract or interim.", action: <Button href="/contact#brief" variant="secondary">Brief us on a role</Button> },
          ]}
        />
      </Section>
    </div>
  );
}
