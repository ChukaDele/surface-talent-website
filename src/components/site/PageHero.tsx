import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Inner-page hero (October 2026 brand pass). One layout for every page below the homepage:
 * chalk surface, left-aligned eyebrow, headline, lede and actions on the page grid, closed by a
 * hairline. An optional `aside` sits in the right-hand column (the candidate form, a discipline
 * drawing). `children` render full-width under the copy.
 */
export function PageHero({ eyebrow, title, body, actions, aside, className = "", children, titleId = "page-title", crumbs }: {
  eyebrow: ReactNode; title: ReactNode; body?: ReactNode; actions?: ReactNode; aside?: ReactNode;
  className?: string; children?: ReactNode; titleId?: string; crumbs?: ReactNode;
}) {
  return (
    <section className={`st-phead ${aside ? "st-phead--split" : ""} ${className}`} aria-labelledby={titleId}>
      <div className="st-wrap st-phead__inner">
        <div className="st-phead__copy">
          {crumbs}
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 id={titleId} className="st-h1 st-phead__title">{title}</h1>
          {body ? <div className="st-body-lg st-phead__lede">{body}</div> : null}
          {actions ? <div className="st-btn-row st-phead__actions">{actions}</div> : null}
        </div>
        {aside ? <div className="st-phead__aside">{aside}</div> : null}
      </div>
      {children ? <div className="st-wrap st-phead__extra">{children}</div> : null}
    </section>
  );
}
