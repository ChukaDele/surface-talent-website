import { Button } from "@/components/ui/Button";
import { HeroSpecimenStatic } from "./hero/HeroSpecimenStatic";

const LOGOS = [
  { name: "Karas Plating", src: "/assets/img/footer-logo-karas.png", w: 88, h: 20.97 },
  { name: "RDM Engineering", src: "/assets/img/footer-logo-rdm.png", w: 30.17, h: 26.38 },
  { name: "United Anodisers", src: "/assets/img/footer-logo-ua.png", w: 72.97, h: 26.38 },
];

/** Figma "Hero" (35:228), bg #0d2233. The approved static portrait composition is the only
 * production hero. The non-indexed preview route renders this same component for review. */
export function Hero() {
  return (
    <section className="st-section st-hero st-hero--static-preview" data-scene="hero" data-hero-static="true" aria-labelledby="hero-title">
      <div className="st-inner st-hero__inner">
        <div className="st-hero__row">
          <div className="st-hero__copy">
            <h1 id="hero-title" className="st-h1 st-hero__title" data-hero-title>Recruitment built around Surface Engineering</h1>
            <div className="st-btn-row st-hero__ctas" data-hero-ctas>
              <Button href="/contact" tone="light">Brief us on a role</Button>
              <Button href="/candidates" tone="light" variant="secondary">Join our talent pool</Button>
            </div>
          </div>
          <HeroSpecimenStatic />
        </div>
        <div className="st-hero__logos" data-hero-logos aria-label="Trusted by operators">
          <div className="st-hero__logo st-hero__logo--label"><span>Trusted by operators</span></div>
          <div className="st-hero__logos-track">
            {LOGOS.map((l, i) => (
              <div key={l.name} className={`st-hero__logo st-hero__logo--${i}`}>
                <img src={l.src} alt="" width={l.w} height={l.h} style={{ width: l.w, height: l.h }} />
                <span>{l.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
