import { Section, SectionHead, RuleGrid } from "@/components/site/Blocks";

const PILLARS = [
  { title: "Operator instinct", body: "Every brief is read by someone who has run a finishing plant. We see what is missing before it becomes a hiring mistake." },
  { title: "Technical fluency", body: "Chemistry, kit, standards and economics, assessed the way an operator would. Not lifted from a job description." },
  { title: "Sector network", body: "We already know the credible people in each discipline, so a search starts from a shortlist, not a job advert." },
];

/** Homepage section 3: the operator lineage, stated plainly. */
export function WhoWeAre() {
  return (
    <Section tone="dark" labelledBy="dna-title" className="st-section st-dna st-dna--quiet">
      <SectionHead
        layout="split"
        eyebrow="Who we are"
        titleId="dna-title"
        title="Founded inside the sector, not next to it."
        lede="Surface Talent was founded by people who own and run UK surface finishing plants. We know what a good hire looks like from the inside, because we have made them, and lived with the ones that were wrong."
      />
      <RuleGrid items={PILLARS.map((p, i) => ({ kicker: String(i + 1).padStart(2, "0"), ...p }))} />
    </Section>
  );
}
