import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

const ITEMS = [
  { n: "01 · Wet process", title: "Electroplating", body: "Rack, barrel, decorative and functional plating. Aerospace, defence, automotive, precision engineering.", svg: "disc01" },
  { n: "02 · Aluminium and multi-metal", title: "Anodising", body: "Sulphuric, chromic, hard and architectural. Chromate, phosphate and passivation for aluminium and multi-metal.", svg: "disc02" },
  { n: "03 · Organic finishing", title: "Powder and paint", body: "Architectural, industrial and high-performance coatings. Qualicoat, GSB and specialist contract finishers.", svg: "disc03" },
  { n: "04 · Thermal processing", title: "Heat treatment", body: "Case hardening, carburising, nitriding, vacuum and induction. Commercial and captive in-house facilities.", svg: "disc04" },
  { n: "05 · Advanced coating", title: "Thermal spray and deposition", body: "HVOF, plasma, arc, flame spray, PVD and CVD. Wear, corrosion and dimensional work for aerospace, energy and oil and gas.", svg: "disc05" },
  { n: "06 · Preparation", title: "Blasting and pre-treatment", body: "Shot, grit and bead blasting, shot peening, and the chemical pre-treatment lines behind every coating process.", svg: "disc06" },
];

/** Figma Container 58:30981 — "Across the surface engineering sector." six discipline cards. */
export function Disciplines() {
  return (
    <section className="st-section st-disc" aria-labelledby="disc-title">
      <div className="st-inner st-disc__inner">
        <div className="st-heading st-heading--center">
          <Eyebrow>Where we work</Eyebrow>
          <h2 id="disc-title" className="st-h2" style={{ color: "var(--ink-soft)" }}>Across the surface engineering sector.</h2>
          <Button href="/disciplines" tone="copper">See all disciplines</Button>
        </div>
                <div className="st-grid3">
          {ITEMS.map((d) => (
            <article key={d.title} className="st-grid3__card st-disc__card">
              <img className="st-disc__illus" src={`/assets/svg/${d.svg}.svg`} alt="" width={362.67} height={160} />
              <div className="st-grid3__text">
                <Eyebrow>{d.n}</Eyebrow>
                <h3 className="st-h3" style={{ color: "#000" }}>{d.title}</h3>
                <p className="st-body">{d.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
