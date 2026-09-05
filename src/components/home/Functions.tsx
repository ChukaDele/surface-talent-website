import { Eyebrow } from "@/components/ui/Eyebrow";
import { BrLg } from "@/components/ui/BrLg";

const ITEMS = [
  ["FN-01", "Leadership and directors", "MDs, GMs, ops and technical directors"],
  ["FN-02", "Operations and production", "Throughput, yield, safety and cost"],
  ["FN-03", "Process and technical", "Chemistry, cycle times, fixturing"],
  ["FN-04", "Maintenance and control", "Mechanical, electrical, PLC"],
  ["FN-05", "Quality and compliance", "ISO, NADCAP, AS9100"],
  ["FN-06", "Commercial and growth", "Sales, BD, key accounts"],
];

/** Figma Container 69:48498 — "From process floor to boardroom" six function lanes. */
export function Functions() {
  return (
    <section className="st-section st-fn" aria-labelledby="fn-title">
      <div className="st-inner st-disc__inner">
        <div className="st-heading st-heading--center" style={{ width: 467 }}>
          <Eyebrow>What we recruit</Eyebrow>
          <h2 id="fn-title" className="st-h2" style={{ color: "var(--ink-soft)" }}>From process<BrLg />floor to boardroom</h2>
          <p className="st-body" style={{ opacity: 0.8, textAlign: "center" }}>Six function lanes — from the line to the board — across UK surface engineering.</p>
        </div>
                <div className="st-grid3">
          {ITEMS.map(([n, title, body]) => (
            <article key={n} className="st-grid3__card st-fn__card">
              <div className="st-grid3__text">
                <Eyebrow>{n}</Eyebrow>
                <h3 className="st-h4" style={{ color: "#000" }}>{title}</h3>
                <p className="st-body">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
