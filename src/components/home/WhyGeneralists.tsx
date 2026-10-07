import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

const FAILURES = [
  {
    title: "They read the job title, not the process.",
    body: "A generalist sees “Plant Manager” or “Process Engineer”. They do not see the bath chemistry, the pre-treatment line, the NADCAP audit or the aerospace customer behind it. So the brief is wrong before the search starts.",
  },
  {
    title: "They cannot test what matters.",
    body: "A CV that looks right on paper can fall apart in the first technical conversation with your process team. Without someone who has run a line, that is found out at interview, or six months into the job.",
  },
  {
    title: "They search where everyone searches.",
    body: "The best people in UK finishing are rarely on job boards. They are running plants, and they move when someone they trust approaches them directly with the right role.",
  },
  {
    title: "The cost lands on you.",
    body: "Months with the seat empty. A line below capacity. A critical hire who leaves inside a year. For a senior or technical role, a cheap search is the expensive option.",
  },
];

/** Homepage section 2 (October 2026): one quiet argument for specialist search, no illustrations. */
export function WhyGeneralists() {
  return (
    <section className="st-section st-whyfail" aria-labelledby="whyfail-title">
      <div className="st-inner st-whyfail__inner">
        <div className="st-whyfail__head">
          <Eyebrow>Why specialist search</Eyebrow>
          <h2 id="whyfail-title" className="st-h2">Surface engineering is a technical trade. Most recruiters cannot speak it.</h2>
          <p className="st-body st-whyfail__lede">Generalist agencies fill most roles adequately. Senior and critical appointments in a finishing business are not most roles.</p>
        </div>
        <div>
          <ol className="st-whyfail__list">
            {FAILURES.map((f, i) => (
              <li key={f.title} className="st-whyfail__item">
                <span className="st-whyfail__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="st-h4">{f.title}</h3>
                  <p className="st-body">{f.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="st-whyfail__close">
            <p className="st-body-lg">We brief with operators, screen technically, and approach the market directly. Shortlists are short because they are right.</p>
            <Button href="/clients">How we work with clients</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
