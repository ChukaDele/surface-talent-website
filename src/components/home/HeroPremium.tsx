import { Button } from "@/components/ui/Button";

/**
 * Production homepage hero (October 2026 reposition). Typographic only: no portrait, no plant
 * imagery. One headline, one positioning line, two CTAs, and a quiet single-colour client row.
 * `data-hero-static` keeps the legacy hero scroll handoff (useHeroMotion) inert.
 */
/**
 * Client logos: each company's own artwork, taken from its website in October 2026 and rendered
 * on the hero navy (#0d2233). Karas and SurfacePrep are the dark-background versions they publish.
 * Replace a file in /assets/img/clients/ to update one; keep the navy background.
 */
const CLIENTS = [
  { name: "Karas Plating", src: "/assets/img/clients/karas.png", h: 30 },
  { name: "RDM Engineering", src: "/assets/img/clients/rdm.png", h: 42 },
  { name: "United Anodisers", src: "/assets/img/clients/united-anodisers.png", h: 38 },
  { name: "SurfacePrep", src: "/assets/img/clients/surfaceprep.png", h: 30 },
];

export function HeroPremium() {
  return (
    <section className="st-section st-phero" data-scene="hero" data-hero-static="true" aria-labelledby="hero-title">
      <div className="st-inner st-phero__inner">
        <div className="st-phero__copy">
          <p className="st-phero__eyebrow">Executive and technical search · UK surface engineering</p>
          <h1 id="hero-title" className="st-h1 st-phero__title" data-hero-title>Recruitment built around Surface Engineering</h1>
          <p className="st-body-lg st-phero__lede">
            Senior and critical appointments for plating, anodising, coating and heat treatment businesses.
            Run by people who own and operate finishing plants, for owners who cannot afford to get the hire wrong.
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
                <img src={c.src} alt={c.name} style={{ height: c.h }} loading="eager" decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
