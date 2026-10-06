"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "On this page" navigation for the legal documents. Desktop: a sticky column beside the content,
 * with the active section tracked by IntersectionObserver. Mobile: a collapsible <details> block at
 * the top of the page. Anchors are ordinary in-page links, so they work without JavaScript and the
 * global `scroll-margin-top` keeps each heading clear of the sticky nav.
 */
/** the sticky nav covers the top of the viewport, so a heading parked beneath it is the active one */
function navOffset() {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"));
  return Number.isFinite(v) ? v + 24 : 79;
}

export function LegalToc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!items.length) return;
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: `-${navOffset()}px 0px -60% 0px`, threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);
  if (!items.length) return null;
  const list = (
    <ol className="st-toc__list">
      {items.map((i) => (
        <li key={i.id}>
          <a href={`#${i.id}`} className="st-toc__link" aria-current={active === i.id ? "true" : undefined}>{i.text.replace(/^\d+\.\s*/, "")}</a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <nav ref={nav} className="st-toc st-toc--desktop" aria-label="On this page">
        <p className="st-toc__label">On this page</p>
        {list}
      </nav>
      <details className="st-toc st-toc--mobile">
        <summary className="st-toc__summary">On this page<span className="st-toc__count">{items.length}</span></summary>
        <nav aria-label="On this page">{list}</nav>
      </details>
    </>
  );
}
