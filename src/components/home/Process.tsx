import { Button } from "@/components/ui/Button";
import { Section, SectionHead, Steps } from "@/components/site/Blocks";

const STEPS = [
  { title: "Brief", body: "A proper technical brief, on site where it helps. We agree what good looks like for this hire and put it in writing before anything else happens." },
  { title: "Map", body: "Process, chemistry, kit, standards and commercial context, mapped before we search. We know who the credible people are and where they are." },
  { title: "Approach", body: "Direct, personal approaches to a named shortlist. No job-board spray, no shared databases, no speculative CVs." },
  { title: "Assess", body: "Two to three people you would hire, screened technically and commercially by someone who has run the process." },
  { title: "Place and stay", body: "Offer, resignation and onboarding handled with care. We stay accountable after the start date, not just until the invoice." },
];

/** Homepage section 5: the search process, five steps. */
export function Process() {
  return (
    <Section tone="white" labelledBy="process-title" className="st-section st-process">
      <SectionHead
        layout="split"
        eyebrow="How we work"
        titleId="process-title"
        title="From brief to hire, without the noise."
        actions={<Button href="/contact#brief">Brief us on a role</Button>}
      />
      <Steps items={STEPS} />
    </Section>
  );
}
