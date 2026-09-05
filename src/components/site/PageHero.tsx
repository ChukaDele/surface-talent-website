import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * White page hero (Figma Frame 153 on Clients/Contact/About/Jobs): eyebrow, Coolvetica 64 title,
 * 16/165% body, optional actions. Header overlays the top 55px.
 */
export function PageHero({ eyebrow, title, body, actions, align = "center", orb, className = "", children, titleId = "page-title", bodyWidth }: {
  eyebrow: ReactNode; title: ReactNode; body?: ReactNode; actions?: ReactNode; align?: "center" | "left"; orb?: "contact" | "candidates";
  className?: string; children?: ReactNode; titleId?: string; bodyWidth?: number;
}) {
  return (
    <section className={`st-page-hero ${align === "left" ? "st-page-hero--left" : ""} ${className}`} aria-labelledby={titleId}>
      {orb ? <div className={`st-orb st-orb--${orb}`} aria-hidden="true" /> : null}
      <div className="st-page-hero__copy">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 id={titleId} className="st-h1">{title}</h1>
        {body ? <p className="st-body" style={bodyWidth ? { maxWidth: bodyWidth } : undefined}>{body}</p> : null}
        {actions ? <div className="st-btn-row">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
