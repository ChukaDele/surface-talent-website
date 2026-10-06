"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { PROFILES } from "./clientsData";
import { ProfileCard } from "./ProfileCard";
import { useClientsHeroMotion } from "@/lib/motion/pages/useClientsHeroMotion";

/** Figma Hero 2027:20831 (start) → Clients 2010:2 hero (resolved). 1440 × 887 stage, copy column 680 at y 115. */
export function ClientsHero() {
  const root = useRef<HTMLElement>(null);
  useClientsHeroMotion(root);
  return (
    <section ref={root} className="st-chero" data-scene="clients-hero" aria-labelledby="page-title">
      <div className="st-chero__copy" data-hero-copy>
        <Eyebrow>For clients</Eyebrow>
        <h1 id="page-title" className="st-h1">Hire people who can actually run the process.</h1>
        <p className="st-body">You need a plant manager who understands bath chemistry, a quality lead who can hold a NADCAP audit, or a commercial director who can open tier-one aerospace accounts. We find those people because we know exactly what good looks like in this sector.</p>
        <div className="st-btn-row">
          <Button href="/contact#brief">Brief us on a role</Button>
          <BookCallButton variant="secondary" tone="copper">Book a call</BookCallButton>
        </div>
      </div>
      <div className="st-chero__clip" aria-hidden="false">
      <div className="st-chero__stage">
        <ul className="st-chero__cards" aria-label="People available for hire">
          {PROFILES.map((p, i) => (
            <li key={p.key} className="st-chero__slot">
              <ProfileCard p={p} index={i} style={{ "--x": `${p.end.x}px`, "--y": `${p.end.y}px` } as React.CSSProperties} />
            </li>
          ))}
          {/* second run: only rendered as a strip on phones, where the gallery loops on its own */}
          <li className="st-chero__dup" aria-hidden="true">
            {PROFILES.map((p, i) => (
              <ProfileCard key={`dup-${p.key}`} p={p} index={i} decorative style={{ "--x": `${p.end.x}px`, "--y": `${p.end.y}px` } as React.CSSProperties} />
            ))}
          </li>
        </ul>
      </div>
        <div className="st-chero__fade st-chero__fade--l" data-hero-fade aria-hidden="true" />
        <div className="st-chero__fade st-chero__fade--r" data-hero-fade aria-hidden="true" />
      </div>
    </section>
  );
}
