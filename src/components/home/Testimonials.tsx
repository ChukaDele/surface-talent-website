import { Section, SectionHead } from "@/components/site/Blocks";

const ITEMS = [
  { stat: "3", label: "Weeks from brief to hire", quote: "We needed someone who could walk onto our plating line and hold their own from day one. Surface Talent understood the brief before we’d finished explaining it. The shortlist was tight, technically screened, and we hired within three weeks.", name: "Alan Pennington", role: "Managing Director, Karas Plating" },
  { stat: "2", label: "Weeks to a strong shortlist", quote: "We needed a salesperson who understood our products and the sectors we sell into. Surface Talent mapped the market and brought us strong candidates with relevant product and sector knowledge inside a fortnight.", name: "Barry Shaw", role: "Quality Manager, RDM Engineering" },
];

/** Homepage proof: two client statements on white cards over chalk, rows aligned by subgrid. */
export function Testimonials() {
  return (
    <Section tone="chalk" labelledBy="clients-title" className="st-section st-clients">
      <SectionHead layout="split" eyebrow="What our clients say" titleId="clients-title" title="Operators who briefed us. Results they measured." />
      <div className="st-clients__row" data-items={ITEMS.length}>
        {ITEMS.map((t) => (
          <figure key={t.name} className="st-clients__card" data-testimonial>
            <div className="st-clients__metric" data-t-stat>{t.stat}</div>
            <span className="st-eyebrow st-clients__label">{t.label}</span>
            <blockquote className="st-body-lg st-clients__quote" data-t-text>“{t.quote}”</blockquote>
            <hr className="st-clients__rule" data-t-rule />
            <figcaption className="st-clients__author st-clients__author--text">
              <div className="st-body" data-t-text>{t.name}</div><div className="st-body-sm" data-t-text>{t.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
