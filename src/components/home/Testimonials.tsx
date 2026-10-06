"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTestimonialHover } from "@/lib/motion/scenes/useTestimonialHover";
import { BrLg } from "@/components/ui/BrLg";

const ITEMS = [
  { stat: "65%", label: "Reduction in plating line", quote: "We needed someone who could walk onto our plating line and hold their own from day one. Surface Talent understood the brief before we'd finished explaining it. The shortlist was tight, technically screened, and we hired within three weeks.", name: "Alan Pennington", role: "Managing Director, Karas Plating", avatar: "/assets/img/avatar-57_26072.png" },
  { stat: "100%", label: "Reduction in plating line", quote: "We'd been let down by generalist agencies sending candidates who couldn't tell an anodising line from a paint booth. Surface Talent knew exactly what we needed and the person they placed hit the ground running.", name: "Peter Watts", role: "Managing Director, United Anodisers", avatar: "/assets/img/avatar-57_26085.png" },
  { stat: "24", label: "Weeks of hire time", quote: "We needed a salesperson who understood our products and the sectors we sell into. Surface Talent mapped the market and brought us strong candidates with relevant product and sector knowledge inside a fortnight.", name: "Barry Shaws", role: "Quality Manager, RDM Engineering", avatar: "/assets/img/avatar-57_26097.png" },
];

/**
 * Figma Container 57:17364. All cards render in the light base state; the navy card in the
 * design is the INTERACTION state — reached on hover / keyboard focus (QA decision 2026-09-02).
 */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  useTestimonialHover(root);
  return (
    <section ref={root} className="st-section st-clients" aria-labelledby="clients-title">
      <div className="st-inner st-clients__inner">
        <SectionHeading eyebrow="What our clients say" title={<span id="clients-title">Operators who briefed us.<BrLg />Results they measured.</span>} wide />
        <div className="st-clients__row">
          {ITEMS.map((t) => (
            <figure key={t.name} className="st-clients__card" data-testimonial tabIndex={0}>
              <div className="st-h2 st-clients__metric" data-t-stat>{t.stat}</div>
              <span className="st-eyebrow st-clients__label">{t.label}</span>
              <blockquote className="st-body st-clients__quote" data-t-text>{t.quote}</blockquote>
              <hr className="st-clients__rule" data-t-rule />
              <figcaption className="st-clients__author">
                <img src={t.avatar} alt="" width={41} height={41} />
                <div><div className="st-body" data-t-text>{t.name}</div><div className="st-body" data-t-text>{t.role}</div></div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
