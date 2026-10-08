import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Shared building blocks for the inner pages (October 2026 brand pass). Three surfaces only —
 * white, chalk and anthracite — and one grammar: eyebrow, headline, hairline rules, no boxes.
 */

type Tone = "white" | "chalk" | "dark";

export function Section({ tone = "white", id, labelledBy, label, className = "", children }: {
  tone?: Tone; id?: string; labelledBy?: string; label?: string; className?: string; children: ReactNode;
}) {
  return (
    <section id={id} className={`st-sec st-sec--${tone} ${className}`} aria-labelledby={labelledBy} aria-label={label}>
      <div className="st-wrap st-sec__inner">{children}</div>
    </section>
  );
}

/** Section heading. `split` puts the lede beside the headline on desktop; `stack` keeps it under. */
export function SectionHead({ eyebrow, title, titleId, lede, layout = "stack", actions }: {
  eyebrow: ReactNode; title: ReactNode; titleId?: string; lede?: ReactNode; layout?: "stack" | "split"; actions?: ReactNode;
}) {
  return (
    <header className={`st-shead st-shead--${layout}`}>
      <div className="st-shead__main">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={titleId} className="st-h2 st-shead__title">{title}</h2>
      </div>
      {lede || actions ? (
        <div className="st-shead__side">
          {lede ? <div className="st-body-lg st-shead__lede">{lede}</div> : null}
          {actions ? <div className="st-btn-row">{actions}</div> : null}
        </div>
      ) : null}
    </header>
  );
}

export type RuleItem = { kicker?: ReactNode; title: ReactNode; body?: ReactNode; extra?: ReactNode };

/** Hairline table of items: the one grid used for roles, pillars and challenges site-wide. */
export function RuleGrid({ items, cols = 3, headingLevel = 3, className = "" }: { items: RuleItem[]; cols?: 2 | 3 | 4; headingLevel?: 2 | 3; className?: string }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className={`st-rgrid st-rgrid--${cols} ${className}`}>
      {items.map((it, i) => (
        <article key={i} className="st-rgrid__cell">
          {it.kicker ? <span className="st-rgrid__kicker">{it.kicker}</span> : null}
          <H className="st-h4 st-rgrid__title">{it.title}</H>
          {it.body ? <p className="st-body st-rgrid__body">{it.body}</p> : null}
          {it.extra}
        </article>
      ))}
    </div>
  );
}

/** Numbered steps on a single top rule (matches the homepage "How we work"). */
export function Steps({ items, className = "" }: { items: { title: ReactNode; body: ReactNode; label?: ReactNode }[]; className?: string }) {
  return (
    <ol className={`st-steps st-steps--${items.length} ${className}`}>
      {items.map((s, i) => (
        <li key={i} className="st-steps__item">
          <span className="st-steps__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}{s.label ? <> · {s.label}</> : null}</span>
          <h3 className="st-h4">{s.title}</h3>
          <p className="st-body">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Two-up panel pair separated by a hairline (retained vs contingent, register vs browse). */
export function Pair({ items }: { items: { eyebrow: ReactNode; title: ReactNode; body: ReactNode; action: ReactNode; id?: string }[] }) {
  return (
    <div className="st-pair">
      {items.map((p, i) => (
        <div key={i} className="st-pair__panel">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <h2 id={p.id} className="st-h3">{p.title}</h2>
          <p className="st-body st-pair__body">{p.body}</p>
          <div className="st-pair__action">{p.action}</div>
        </div>
      ))}
    </div>
  );
}
