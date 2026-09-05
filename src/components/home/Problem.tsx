"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FixedStage } from "@/components/ui/FixedStage";
import { Defect01Illustration, Defect02Illustration, Defect03Illustration } from "./mocks/DefectCards";
import { useProblemMotion } from "@/lib/motion/scenes/useProblemMotion";

const DEFECTS = [
  { n: "Defect 01", title: "CVs that fail on the line", body: "Candidates who look right on paper but can't read a bath spec or hold a technical conversation with your process team.", Illus: Defect01Illustration },
  { n: "Defect 02", title: "Roles that stay open too long", body: "Every week unfilled, your line runs below capacity. Generalist agencies take months to understand what you briefed on day one.", Illus: Defect02Illustration },
  { n: "Defect 03", title: "Hires that don't last", body: "A poor fit in a critical seat. Six months gone before you're hiring for the same role again.", Illus: Defect03Illustration },
];

/** Figma Container 53:1946 (Defect 01) + loose Frame 29 (Defect 02) + Frame 66 (Defect 03): one progressive card stack. */
export function Problem() {
  const root = useRef<HTMLElement>(null);
  useProblemMotion(root);
  return (
    <section ref={root} className="st-section st-problem" data-scene="problem" aria-labelledby="problem-title">
      <div className="st-problem__pin">
        <div className="st-inner st-problem__inner">
          <div className="st-problem__copy">
            <Eyebrow>The problem</Eyebrow>
            <h2 id="problem-title" className="st-h2 st-problem__title">
              <span style={{ color: "var(--grey-400)" }}>Surface engineering</span><br />
              <span style={{ color: "var(--ink-soft)" }}>is a technical trade.</span><br />
              <span style={{ color: "var(--primary-500)" }}>We speak it fluently.</span>
            </h2>
            <p className="st-body st-problem__lede">Three failure modes generalist hiring keeps writing into the plant.</p>
          </div>
          <div className="st-problem__stack">
            {DEFECTS.map((d, i) => (
              <FixedStage key={d.n} w={600} h={620} className="st-problem__card" style={{ position: i === 0 ? "relative" : "absolute" }}>
                <div data-defect={i} className="st-problem__cardbody" style={{ position: "absolute", inset: 0, background: "var(--stack-light)", boxShadow: "inset 0 0 0 1px var(--stack-light-line)", overflow: "hidden" }}>
                  <div className="st-problem__cardhead" style={{ position: "absolute", left: 57, top: 33, width: 486 }}>
                    <Eyebrow>{d.n}</Eyebrow>
                    <h3 className="st-h3" style={{ color: "#000", marginTop: 10 }}>{d.title}</h3>
                    <p className="st-body" style={{ marginTop: 10, maxWidth: 420, color: "var(--ink)", opacity: 0.8 }}>{d.body}</p>
                  </div>
                  <d.Illus />
                </div>
              </FixedStage>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
