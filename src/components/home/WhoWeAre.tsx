import { Eyebrow } from "@/components/ui/Eyebrow";

const PILLARS = [
  { title: "Operator instinct", body: "Every brief is read by someone who has run a finishing plant. We see what is missing before it becomes a hiring mistake." },
  { title: "Technical fluency", body: "Chemistry, kit, standards and economics, assessed the way an operator would. Not lifted from a job description." },
  { title: "Sector network", body: "Built across the IMF and the Surface Engineering Association, plant by plant. Not bought. Not rented." },
];

/** Homepage section 3 (October 2026): the operator lineage, stated plainly. */
export function WhoWeAre() {
  return (
    <section className="st-section st-dna st-dna--quiet" aria-labelledby="dna-title">
      <div className="st-inner st-dna__top">
        <div className="st-dna__headwrap">
          <div className="st-dna__head">
            <Eyebrow diamond>Who we are</Eyebrow>
            <h2 id="dna-title" className="st-h2 st-dna__title">Founded inside the sector, not next to it.</h2>
            <p className="st-body st-dna__lede">Surface Talent was founded by people who own and run UK surface finishing plants. We know what a good hire looks like from the inside, because we have made them, and lived with the ones that were wrong.</p>
          </div>
        </div>
        <div className="st-dna__pillars">
          {PILLARS.map((p) => (
            <div key={p.title} className="st-dna__pillar">
              <h3 className="st-h4">{p.title}</h3>
              <p className="st-body-sm">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
