"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FixedStage } from "@/components/ui/FixedStage";
import { CellsIllustration, ChemistryIllustration, PlantOpsIllustration, StandardsIllustration } from "./mocks/PlantFloorCards";
import { useInsiderDnaMotion } from "@/lib/motion/scenes/useInsiderDnaMotion";
import { usePlantFloorMotion } from "@/lib/motion/scenes/usePlantFloorMotion";
import { useChemistryMotion } from "@/lib/motion/scenes/useChemistryMotion";
import { useCardHover } from "@/lib/motion/useCardHover";

const PILLARS = [
  { title: "Operator instinct", body: "A brief read by someone who's run the line. We spot what's missing before hiring mistakes." },
  { title: "Technical fluency", body: "Chemistry kit standards assessed as an operator would, not from job description." },
  { title: "Sector network", body: "Built across the IMF and SEA over 20 years. Not bought. Not rented." },
];

const FLOOR_CARDS = [
  { title: "Bath chemistry", body: "We can tell when a CV won't survive a conversation with your process team.", Illus: ChemistryIllustration },
  { title: "Coating cells", body: "We know what “good” looks like on the line — throughput, yield, scrap and downtime.", Illus: CellsIllustration },
  { title: "Standards & QA", body: "NADCAP, AS9100, ISO — briefs and screening that match the compliance reality.", Illus: StandardsIllustration },
  { title: "Plant operations", body: "Rack, barrel, shift patterns, maintenance — roles framed the way operators think.", Illus: PlantOpsIllustration },
];

/** Figma Frame 148 (115:99375): Insider DNA (top) + "What we know from the plant floor" (bottom). */
export function InsiderDna() {
  const root = useRef<HTMLElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  useInsiderDnaMotion(root);
  usePlantFloorMotion(floor);
  useChemistryMotion(floor);
  useCardHover(floor, ".st-floor__card");
  return (
    <section ref={root} className="st-section st-dna" data-scene="dna" aria-labelledby="dna-title">
      <div className="st-inner st-dna__top">
        <div className="st-dna__headwrap">
          <div className="st-dna__head">
            <Eyebrow diamond>Insider DNA</Eyebrow>
            <h2 id="dna-title" className="st-h2 st-dna__title">We didn&apos;t learn<br />the industry<br />from Linkedin.</h2>
            <p className="st-body st-dna__lede">We have owned and operated surface finishing plants, so we know what a good hire looks like from the inside.</p>
          </div>
          <div className="st-dna__linkedin" data-linkedin aria-hidden="true">
            <span className="st-dna__rope" data-linkedin-rope aria-hidden="true" />
            <img src="/assets/svg/linkedin.svg" alt="" width={70} height={69} data-linkedin-logo />
          </div>
        </div>
        <div className="st-dna__years" data-years>
          <div className="st-dna__count" aria-hidden="true"><span data-count>20+</span></div>
          <span className="sr-only">20+ years of experience operating</span>
          <span className="st-dna__hand" aria-hidden="true">Years of experience<br />operating:</span>
        </div>
        <div className="st-dna__pillars">
          {PILLARS.map((p) => (
            <div key={p.title} className="st-dna__pillar">
              <h3 className="st-h4">{p.title}</h3>
              <p className="st-body-sm">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="st-dna__partner">
          <span className="st-dna__partner-label">Partner with</span>
          <img src="/assets/img/partner-logo.png" alt="EMC Surface Technologies" width={144} height={48} />
        </div>
      </div>

      <div ref={floor} className="st-floor" data-scene="floor" aria-labelledby="floor-title">
        <div className="st-floor__pin">
          <div className="st-inner st-floor__inner">
            <Eyebrow diamond><span id="floor-title">What we know from the plant floor</span></Eyebrow>
            <div className="st-floor__viewport" data-floor-viewport>
              <div className="st-floor__row" data-floor-row>
                {FLOOR_CARDS.map((c) => (
                  <article key={c.title} className="st-floor__card">
                    <FixedStage w={460} h={160} className="st-floor__illus"><c.Illus /></FixedStage>
                    <div className="st-floor__text">
                      <h3 className="st-h3">{c.title}</h3>
                      <p className="st-body">{c.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
