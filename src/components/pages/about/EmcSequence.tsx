"use client";

import { useRef } from "react";
import { useAboutEmcMotion } from "@/lib/motion/pages/useAboutEmcMotion";
import { BrLg } from "@/components/ui/BrLg";

const PARAS = [
  "We’re a sister company of the EMC Surface Technologies group, a UK operating group that owns and runs surface finishing plants across anodising, electroplating, hard chrome and related processes.",
  "That gives us technical fluency, operator instinct and a network most recruiters don’t have access to.",
  "We recruit permanent, contract and interim placements across the UK. We’re not a volume agency and we don’t try to be.",
];

/** Figma Container 2036:275 + the five keyframe Containers (2048:1475…1516). */
export function EmcSequence() {
  const root = useRef<HTMLElement>(null);
  useAboutEmcMotion(root);
  return (
    <section ref={root} className="st-emc" data-scene="about-emc" aria-labelledby="emc-title">
      <div className="st-emc__pin">
        <div className="st-emc__stage">
          <div className="st-emc__beat" data-emc-beat="1">
            <div className="st-emc__lockup" role="img" aria-label="EMC Surface Technologies">
              <img className="st-emc__mark" src="/assets/img/emc-mark.png" alt="" width={132} height={62} />
              <span className="st-emc__divider" aria-hidden="true" />
              <span className="st-emc__wordmark" aria-hidden="true">Surface<BrLg />Technologies</span>
            </div>
          </div>
          <div className="st-emc__beat" data-emc-beat="2">
            <h2 id="emc-title" className="st-h2 st-emc__title">A sister company of the<BrLg />EMC Surface Technologies group.</h2>
          </div>
          <div className="st-emc__beat" data-emc-beat="3">
            <div className="st-emc__copy">
              {PARAS.map((p) => <p key={p.slice(0, 20)} className="st-body-lg">{p}</p>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
