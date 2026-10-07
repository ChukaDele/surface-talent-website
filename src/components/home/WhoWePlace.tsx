import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

const ROLES = [
  ["Leadership", "Managing, operations and technical directors", "Confidential, board-level search for owners and investors. Succession, turnaround and growth appointments."],
  ["Plant and operations", "Plant managers, production and shift leadership", "The people who own throughput, yield, safety and cost on the line."],
  ["Process and technical", "Process engineers, chemists, technical managers", "Bath chemistry, cycle times, fixturing, pre-treatment and specification."],
  ["Quality and compliance", "Quality managers and NADCAP / AS9100 leads", "Audit-ready quality leadership for aerospace, defence and regulated supply chains."],
  ["Commercial", "Sales directors, BD and key account leadership", "People who understand the process well enough to sell it into tier-one accounts."],
  ["Maintenance and control", "Engineering managers, electrical and controls", "Keeping plant, rectifiers, ovens and automation running."],
];

/** Homepage section 4 (October 2026): the roles we take on, senior and critical first. */
export function WhoWePlace() {
  return (
    <section className="st-section st-place" aria-labelledby="place-title">
      <div className="st-inner st-place__inner">
        <div className="st-place__head">
          <Eyebrow>Who we place</Eyebrow>
          <h2 id="place-title" className="st-h2">The appointments a finishing business cannot afford to get wrong.</h2>
          <p className="st-body-lg">Across electroplating, anodising, powder and paint, heat treatment, thermal spray and pre-treatment. Permanent, interim and retained.</p>
        </div>
        <div className="st-place__grid">
          {ROLES.map(([lane, title, body]) => (
            <article key={lane} className="st-place__cell">
              <span className="st-mono">{lane}</span>
              <h3 className="st-h4">{title}</h3>
              <p className="st-body-sm">{body}</p>
            </article>
          ))}
        </div>
        <div className="st-place__foot">
          <p className="st-body">We are not a volume agency and do not try to be. We take on a small number of searches at a time, so each one gets the attention it needs.</p>
          <Button href="/disciplines" variant="secondary">Disciplines we cover</Button>
        </div>
      </div>
    </section>
  );
}
