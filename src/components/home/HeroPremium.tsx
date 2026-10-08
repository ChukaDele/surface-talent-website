import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Homepage hero (October 2026). Typographic only: one headline, one positioning line, two CTAs and
 * the client row. Client logos are each company's own artwork with the background keyed out to
 * transparency, so they sit on anthracite (or any surface) without a box.
 * `data-hero-static` keeps the legacy hero scroll handoff (useHeroMotion) inert.
 */
const CLIENTS = [
  { name: "Karas Plating", src: "/assets/img/clients/karas.webp", width: 381, height: 104, h: 30 },
  { name: "RDM Engineering", src: "/assets/img/clients/rdm.webp", width: 177, height: 132, h: 40 },
  { name: "United Anodisers", src: "/assets/img/clients/united-anodisers.webp", width: 283, height: 104, h: 34 },
  { name: "SurfacePrep", src: "/assets/img/clients/surfaceprep.webp", width: 414, height: 104, h: 28 },
];

export function HeroPremium() {
  return (
    <section className="st-section st-phero" data-scene="hero" data-hero-static="true" aria-labelledby="hero-title">
      <div className="st-wrap st-phero__inner">
        <div className="st-phero__copy">
          <Eyebrow className="st-phero__eyebrow">Executive and technical search</Eyebrow>
          <h1 id="hero-title" className="st-h1 st-phero__title" data-hero-title>Recruitment built around Surface Engineering</h1>
          <p className="st-body-lg st-phero__lede">
            Technical, managerial and leadership appointments for plating, anodising and surface technology businesses.
          </p>
          <div className="st-btn-row st-phero__ctas" data-hero-ctas>
            <Button href="/contact#brief" tone="light">Brief us on a role</Button>
            <Button href="/candidates" tone="light" variant="secondary">Register in confidence</Button>
          </div>
        </div>
        <div className="st-phero__clients" data-hero-logos aria-label="Clients">
          <span className="st-phero__clients-label">Trusted by operators</span>
          <ul className="st-phero__logos">
            {CLIENTS.map((c) => (
              <li key={c.name} className="st-phero__logo">
                <img src={c.src} alt={c.name} width={c.width} height={c.height} style={{ height: c.h }} loading="eager" decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
