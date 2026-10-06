import { Button } from "@/components/ui/Button";
import { HeroSpecimenDynamic } from "./hero/HeroSpecimenDynamic";
import { HeroSpecimenStatic } from "./hero/HeroSpecimenStatic";
import { DEFAULT_HERO_VARIANT, type HeroVariant } from "./hero/variants";

const LOGOS = [
  { name: "Karas Plating", src: "/assets/img/footer-logo-karas.png", w: 88, h: 20.97 },
  { name: "RDM Engineering", src: "/assets/img/footer-logo-rdm.png", w: 30.17, h: 26.38 },
  { name: "United Anodisers", src: "/assets/img/footer-logo-ua.png", w: 72.97, h: 26.38 },
];

/** Figma "Hero" (35:228), bg #0d2233. The homepage defaults to the approved portrait loop;
 * the design lab can still select the legacy comparison scenes explicitly. */
export function Hero({ variant }: { variant?: HeroVariant } = {}) {
  const scene = variant ?? DEFAULT_HERO_VARIANT;
  const staticPreview = scene === "h-static";
  return (
    <section className={`st-section st-hero${staticPreview ? " st-hero--static-preview" : ""}`} data-scene="hero" data-hero-static={staticPreview ? "true" : undefined} aria-labelledby="hero-title">
      <div className="st-hero__fade" aria-hidden="true" />
      <div className="st-inner st-hero__inner">
        <div className="st-hero__row">
          <div className="st-hero__copy">
            <h1 id="hero-title" className="st-h1 st-hero__title" data-hero-title>Recruitment built around Surface Engineering</h1>
            <div className="st-btn-row st-hero__ctas" data-hero-ctas>
              <Button href="/contact" tone="light">Brief us on a role</Button>
              <Button href="/candidates" tone="light" variant="secondary">Join our talent pool</Button>
            </div>
          </div>
          {scene === "h-static" ? <HeroSpecimenStatic /> : <HeroSpecimenDynamic variant={scene} />}
        </div>
        <div className="st-hero__logos" data-hero-logos aria-label="Trusted by operators">
          <div className="st-hero__logo st-hero__logo--label"><span>Trusted by operators</span></div>
          {/* The static production composition keeps this as one compact baseline. The legacy
              loop variant still uses the same markup for its internal comparison route. */}
          <div className="st-hero__logos-track">
            {LOGOS.map((l, i) => (
              <div key={l.name} className={`st-hero__logo st-hero__logo--${i}`}>
                <img src={l.src} alt="" width={l.w} height={l.h} style={{ width: l.w, height: l.h }} />
                <span>{l.name}</span>
              </div>
            ))}
            {!staticPreview && (
              <div className="st-hero__logos-dup" aria-hidden="true">
                {LOGOS.map((l, i) => (
                  <div key={l.name} className={`st-hero__logo st-hero__logo--${i}`}>
                    <img src={l.src} alt="" width={l.w} height={l.h} style={{ width: l.w, height: l.h }} />
                    <span>{l.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
