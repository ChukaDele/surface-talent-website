"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FixedStage } from "@/components/ui/FixedStage";
import { ContextIllustration, MatchIllustration, NetworkIllustration, ProcessIllustration } from "./mocks/WhyCards";
import { useWhySpecialistMotion } from "@/lib/motion/scenes/useWhySpecialistMotion";

export const WHY_CARD = { w: 960, h: 480, peek: 100 }; // peek = 33 pad + 16 eyebrow + 10 gap + 38 title + 3

const CARDS = [
  { n: "01 - the process", title: "Understand the process", body: "We recruit with the eye of someone who has managed the line — not just read about it.", dark: false, Illus: ProcessIllustration },
  { n: "02 - THE NETWORK", title: "Know the people", body: "Connected across the IMF and the Surface Engineering Association. UK-wide reach into every process lane.", dark: true, Illus: NetworkIllustration },
  { n: "03 - CONTEXT", title: "Assess the context", body: "Chemistry, kit, standards, economics. Briefs are sharper. Screening is tighter. Shortlists are smaller and better.", dark: false, Illus: ContextIllustration },
  { n: "04 - MATCH", title: "Make the match", body: "Two to three candidates you'd hire. Screened technically and commercially. We stay accountable after the start date.", dark: true, Illus: MatchIllustration },
];

/**
 * Figma Container 39:791 — one pinned narrative stage: the heading stays visible while the four
 * 960 × 480 cards stack beneath it (each new card seats 100px lower so previous eyebrow + title
 * remain legible). Card 04 then morphs into the next section's background.
 */
export function WhySpecialist() {
  const root = useRef<HTMLElement>(null);
  useWhySpecialistMotion(root);
  const stageH = WHY_CARD.h + WHY_CARD.peek * (CARDS.length - 1);
  return (
    <section ref={root} className="st-section st-why" data-scene="why" aria-labelledby="why-title">
      <div className="st-why__pin">
        <div className="st-why__head" data-why-head>
          <Eyebrow diamond>Why specialist</Eyebrow>
          <h2 id="why-title" className="st-h2" style={{ color: "#000" }}>The right layer changes everything.</h2>
        </div>
        <div className="st-why__stagebox" data-why-stagebox style={{ aspectRatio: `${WHY_CARD.w} / ${stageH}` }}>
          <div className="st-why__stage" data-why-stage style={{ width: WHY_CARD.w, height: stageH }}>
            {CARDS.map((c, i) => (
              <div key={c.n} className="st-why__slot" data-why-slot={i} style={{ top: i * WHY_CARD.peek, zIndex: i + 1 }}>
                <FixedStage w={WHY_CARD.w} h={WHY_CARD.h} className={`st-why__card ${c.dark ? "st-why__card--dark" : ""}`}>
                  <div data-why-card={i} style={{ position: "absolute", inset: 0 }}>
                    <div className="st-why__cardhead">
                      <span className="st-eyebrow">{c.n}</span>
                      <h3 className="st-h3" style={{ color: c.dark ? "#fff" : "#000", marginTop: 10 }}>{c.title}</h3>
                      <p className="st-body" style={{ marginTop: 10, maxWidth: 420, opacity: 0.8, color: c.dark ? "var(--text-inverse)" : "var(--ink)" }}>{c.body}</p>
                    </div>
                    <c.Illus />
                  </div>
                </FixedStage>
              </div>
            ))}
          </div>
        </div>
        <div className="st-why__morph" data-why-morph aria-hidden="true" />
      </div>
    </section>
  );
}
