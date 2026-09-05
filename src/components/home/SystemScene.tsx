"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FixedStage } from "@/components/ui/FixedStage";
import { RoleBriefStateOne } from "./RoleBriefCard";
import { SystemDiagram } from "./SystemDiagram";
import { useSystemSceneMotion } from "@/lib/motion/scenes/useSystemSceneMotion";
import { BrLg } from "@/components/ui/BrLg";

export const SYSTEM_STATES = [
  { eyebrow: "01 — Surface read", title: ["Generalist recruitment", "sees a job title."], body: "A CV. A LinkedIn headline. A role brief written from outside the plant." },
  { eyebrow: "02 — Cross-section", title: ["Zoom into the", "system underneath."], body: "Coating process. Chemistry. Substrate. Equipment. Compliance. Sector. Production context." },
  { eyebrow: "03 — Specialist read", title: ["We see the system", "behind it."], body: "That is why briefs are sharper, shortlists smaller, and hires that last." },
];

/**
 * Figma sections 35:144 / 36:336 / 36:350 — three states of ONE pinned scene.
 * Left column: copy states cross-fade. Right stage (720 × 620): role brief → zoomed
 * layer system (scale 2) → settled system with annotations.
 */
export function SystemScene() {
  const root = useRef<HTMLDivElement>(null);
  useSystemSceneMotion(root);
  return (
    <section ref={root} className="st-section st-system" data-scene="system" aria-label="How Surface Talent reads a role">
      <div className="st-system__pin">
        <div className="st-system__frame">
          <div className="st-system__copy">
            {SYSTEM_STATES.map((s, i) => (
              <div key={s.eyebrow} className="st-system__state" data-copy-state={i} aria-hidden={i !== 0}>
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="st-h2" style={{ color: "var(--text-inverse)", marginTop: 20 }}>{s.title[0]}<BrLg />{s.title[1]}</h2>
                <p className="st-body-lg" style={{ color: "var(--text-hero)", opacity: 0.8, marginTop: 20, maxWidth: 420 }}>{s.body}</p>
              </div>
            ))}
          </div>
          <div className="st-system__stage-col">
            <FixedStage w={720} h={620} className="st-system__stage">
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(50% 50% at 50% 50%, #0d2233 0%, #171c20 100%)", overflow: "hidden" }}>
                <div data-diagram-wrap style={{ position: "absolute", inset: 0, opacity: 0 }}>
                  <div style={{ position: "absolute", left: 0, top: 391, width: 720, height: 229, background: "linear-gradient(180deg, rgba(23,28,32,0) 0%, #171c20 100%)" }} />
                  <SystemDiagram />
                </div>
                <RoleBriefStateOne />
              </div>
            </FixedStage>
          </div>
        </div>
      </div>
      <div className="st-system__static" aria-hidden="true">
        {/* Natural-flow fallback (mobile / reduced motion): the three states as panels */}
      </div>
    </section>
  );
}
