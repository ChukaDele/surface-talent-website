"use client";

import Link from "next/link";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DISCIPLINES_PAGE } from "./disciplinesData";
import * as Icons from "./icons";
import { useDisciplineHover } from "@/lib/motion/pages/useDisciplineHover";

const ICON: Record<string, (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element> = { disc01: Icons.Disc01, disc02: Icons.Disc02, disc03: Icons.Disc03, disc04: Icons.Disc04, disc05: Icons.Disc05, disc06: Icons.Disc06, disc07: Icons.Disc07, disc08: Icons.Disc08, disc09: Icons.Disc09, disc10: Icons.Disc10, disc11: Icons.Disc11, disc12: Icons.Disc12, disc13: Icons.Disc13, disc14: Icons.Disc14 };

/** Figma Container 2050:190 — two disciplines per row, 664 × 480 cards; Variation 1 (2051:190) on hover/focus. */
export function DisciplineGrid() {
  const root = useRef<HTMLDivElement>(null);
  useDisciplineHover(root);
  return (
    <div ref={root} className="st-dgrid" role="list">
      {DISCIPLINES_PAGE.map((d) => {
        const Icon = d.icon ? ICON[d.icon] : null;
        const slug = d.page;
        return (
          <article key={d.n} className="st-dcard" data-disc-card role="listitem" tabIndex={0} aria-labelledby={`disc-${d.n}`}>
            <div className="st-dcard__art" aria-hidden="true">{Icon ? <Icon className="st-dcard__icon" data-disc-icon /> : null}</div>
            <div className="st-dcard__text">
              <Eyebrow>{d.n} · {d.kicker}</Eyebrow>
              <h2 id={`disc-${d.n}`} className="st-h3" data-disc-title>{d.title}</h2>
              {d.body.map((b) => <p key={b.slice(0, 24)} className="st-body" data-disc-body>{b}</p>)}
              {slug ? <Link className="st-dcard__more" href={`/disciplines/${slug}`} prefetch={false} data-disc-body>Recruitment in {d.title.toLowerCase()} <span aria-hidden="true">→</span></Link> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
