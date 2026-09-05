"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FixedStage } from "@/components/ui/FixedStage";
import { AssessIllustration, BriefIllustration, PlaceIllustration, SearchIllustration, UnderstandIllustration } from "./mocks/HowCards";
import { useHowItWorksMotion } from "@/lib/motion/scenes/useHowItWorksMotion";
import { BrLg } from "@/components/ui/BrLg";

const STEPS = [
  { title: "Discover", body: "A proper technical brief. On-site where it helps. We learn what good looks like for this hire.", Illus: BriefIllustration },
  { title: "Understand", body: "Process, chemistry, kit, standards and commercial context — mapped before we search.", Illus: UnderstandIllustration },
  { title: "Search", body: "Market mapped. Shortlist approached personally. No job-board spray. No shared databases.", Illus: SearchIllustration },
  { title: "Assess", body: "Two to three you'd hire. Screened technically and commercially.", Illus: AssessIllustration },
  { title: "Place", body: "Structured aftercare through onboarding and beyond. We stay accountable after the start date.", Illus: PlaceIllustration },
];

/** Figma Container 57:26165 + loose Frame 91 (116:99442, the full-width row). Horizontal, scroll-driven, one active step at a time. */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  useHowItWorksMotion(root);
  return (
    <section ref={root} className="st-section st-how" data-scene="how" aria-labelledby="how-title">
      <div className="st-how__pin">
        <div className="st-inner st-how__inner">
          <div className="st-how__head">
            <Eyebrow diamond>How it works</Eyebrow>
            <h2 id="how-title" className="st-h2" style={{ color: "var(--text-inverse)", marginTop: 20 }}>How we get from<BrLg />job title to hire.</h2>
          </div>
          <div className="st-how__viewport" data-how-viewport>
            <div className="st-how__track" data-how-track>
              <div className="st-how__cards">
                {STEPS.map((s, i) => (
                  <div key={s.title} className="st-how__card" data-how-card={i}>
                    <FixedStage w={420} h={320}><s.Illus /></FixedStage>
                    <div className="st-how__glitter" aria-hidden="true" />
                  </div>
                ))}
              </div>
              <div className="st-how__line" aria-hidden="true">
                <div className="st-how__rail" />
                {STEPS.map((s, i) => <span key={s.title} className="st-how__diamond" data-how-diamond={i} style={{ left: i * 460 }} />)}
              </div>
              <ol className="st-how__titles">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="st-how__step" data-how-step={i}>
                    <h3 className="st-h3">{s.title}</h3>
                    <p className="st-body">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
