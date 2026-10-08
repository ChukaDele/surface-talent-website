import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DISCIPLINES_PAGE } from "./disciplinesData";
import * as Icons from "./icons";

const ICON: Record<string, (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element> = { disc01: Icons.Disc01, disc02: Icons.Disc02, disc03: Icons.Disc03, disc04: Icons.Disc04, disc05: Icons.Disc05, disc06: Icons.Disc06, disc07: Icons.Disc07, disc08: Icons.Disc08, disc09: Icons.Disc09, disc10: Icons.Disc10, disc11: Icons.Disc11, disc12: Icons.Disc12, disc13: Icons.Disc13, disc14: Icons.Disc14 };

/**
 * Fourteen disciplines, two per row on a hairline grid. Each carries its technical line drawing in
 * steel blue with a copper coating layer — the site's one illustration family.
 */
export function DisciplineGrid() {
  return (
    <div className="st-dgrid" role="list">
      {DISCIPLINES_PAGE.map((d) => {
        const Icon = d.icon ? ICON[d.icon] : null;
        const slug = d.page;
        return (
          <article key={d.n} className="st-dcard" role="listitem" aria-labelledby={`disc-${d.n}`}>
            <div className="st-dcard__art" aria-hidden="true">{Icon ? <Icon className="st-dcard__icon" /> : null}</div>
            <div className="st-dcard__text">
              <Eyebrow>{d.n} · {d.kicker}</Eyebrow>
              <h2 id={`disc-${d.n}`} className="st-h3">{d.title}</h2>
              {d.body.map((b) => <p key={b.slice(0, 24)} className="st-body">{b}</p>)}
              {slug ? <Link className="st-tlink st-dcard__more" href={`/disciplines/${slug}`} prefetch={false}>Recruitment in {d.title.toLowerCase()} <span aria-hidden="true">→</span></Link> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
