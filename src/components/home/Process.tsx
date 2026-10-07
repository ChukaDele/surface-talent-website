import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

const STEPS = [
  { title: "Brief", body: "A proper technical brief, on site where it helps. We agree what good looks like for this hire and put it in writing before anything else happens." },
  { title: "Map", body: "Process, chemistry, kit, standards and commercial context, mapped before we search. We know who the credible people are and where they are." },
  { title: "Approach", body: "Direct, personal approaches to a named shortlist. No job-board spray, no shared databases, no speculative CVs." },
  { title: "Assess", body: "Two to three people you would hire, screened technically and commercially by someone who has run the process." },
  { title: "Place and stay", body: "Offer, resignation and onboarding handled with care. We stay accountable after the start date, not just until the invoice." },
];

/** Homepage section 5 (October 2026): the search process, five steps, no illustrations. */
export function Process() {
  return (
    <section className="st-section st-process" aria-labelledby="process-title">
      <div className="st-inner st-process__inner">
        <div className="st-process__head">
          <Eyebrow>How we work</Eyebrow>
          <h2 id="process-title" className="st-h2">From brief to hire, without the noise.</h2>
        </div>
        <ol className="st-process__steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="st-process__step">
              <span className="st-process__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="st-h4">{s.title}</h3>
              <p className="st-body-sm">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="st-process__foot">
          <Button href="/contact#brief">Brief us on a role</Button>
        </div>
      </div>
    </section>
  );
}
