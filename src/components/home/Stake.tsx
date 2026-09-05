"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FixedStage } from "@/components/ui/FixedStage";
import { useStakeMotion } from "@/lib/motion/scenes/useStakeMotion";

const GENERALIST = ["CVs from candidates who've never seen a plating line", "Many weeks of interviews that lead nowhere", "A hire who leaves inside six months", "The role open again. The line under capacity. Again."];
const ST = ["A  brief taken by someone who knows the process", "Two to three candidates screened technically and commercially", "A hire who understands the job from week one", "A recruiter who stays accountable after the start date"];

/** Figma Container 95:57950 (final) + loose Container 95:62404 (initial, vertical). */
export function Stake() {
  const root = useRef<HTMLElement>(null);
  useStakeMotion(root);
  return (
    <section ref={root} className="st-section st-stake" data-scene="stake" aria-labelledby="stake-title">
      <div className="st-stake__pin">
        <div className="st-inner st-stake__inner">
          <div className="st-heading st-heading--center">
            <Eyebrow diamond>What&apos;s at stake</Eyebrow>
            <h2 id="stake-title" className="st-h2" style={{ color: "var(--ink-soft)" }}>Same brief.<br />Opposite outcomes.</h2>
            <div className="st-btn-row">
              <Button href="/contact" tone="copper">Brief us on a role</Button>
              <Button href="/candidates" tone="copper" variant="secondary">Join our talent pool</Button>
            </div>
          </div>
          <FixedStage w={463.5} h={356} className="st-stake__stage">
            <div data-stake-generalist className="st-stake__card st-stake__card--generalist">
              <Eyebrow>Generalist route</Eyebrow>
              <div className="st-stake__body">
                <h3 className="st-h3" style={{ color: "var(--ink)", width: 295.5 }}>Going through the generalist route causes you;</h3>
                <ul className="st-stake__list">
                  {GENERALIST.map((t) => <li key={t}><span className="st-stake__bar" style={{ background: "#d9d9d9" }} /><span className="st-body" style={{ color: "var(--ink)" }}>{t}</span></li>)}
                </ul>
              </div>
              <img src="/assets/img/stamp-rejected.png" alt="" className="st-stake__stamp-rejected" />
            </div>
            <div data-stake-st className="st-stake__card st-stake__card--st">
              <Eyebrow tone="light">SURFACE TALENT route</Eyebrow>
              <div className="st-stake__body">
                <h3 className="st-h3" style={{ color: "#fff", width: 295.5 }}>Fit for purpose.</h3>
                <ul className="st-stake__list">
                  {ST.map((t) => <li key={t}><span className="st-stake__bar" style={{ background: "#fff" }} /><span className="st-body" style={{ color: "#fff" }}>{t}</span></li>)}
                </ul>
              </div>
              <img src="/assets/img/stamp-approved.png" alt="" className="st-stake__stamp-approved" />
            </div>
          </FixedStage>
        </div>
      </div>
    </section>
  );
}
