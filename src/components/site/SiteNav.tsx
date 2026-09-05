"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { NAV } from "@/lib/site/nav";

/**
 * Primary nav with the current-route state from Figma (Candidates/About frames): a 14px copper
 * diamond sits 8px before the current label. `aria-current="page"` carries the semantics; the
 * diamond is decorative. Distinct from hover (colour only) and focus (ring).
 * Below 1024px (no Figma state) the same list sits behind a real <button> "Menu" toggle so the
 * routes stay reachable by keyboard, touch and automated agents.
 */
export function SiteNav() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    // hold the page still behind the open panel: without this the content scrolls under the
    // links and reads through them
    const y = window.scrollY;
    const { body } = document;
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, y);
    };
  }, [open]);
  return (
    <>
      <button type="button" className="st-header__menu" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span className={`st-header__menu-icon ${open ? "is-open" : ""}`} aria-hidden="true"><span /><span /></span>
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      <nav id={id} className={`st-header__nav ${open ? "is-open" : ""}`} aria-label="Primary">
        {NAV.map((n) => {
          const current = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <Link key={n.href} href={n.href} prefetch={false} aria-current={current ? "page" : undefined} onClick={() => setOpen(false)}>
              {current ? <img className="st-header__current" src="/assets/svg/eyebrow-diamond.svg" alt="" width={14} height={14} /> : null}
              <span>{n.label}</span>
            </Link>
          );
        })}
        <Link href="/contact" prefetch={false} className="st-header__nav-contact" aria-current={pathname.startsWith("/contact") ? "page" : undefined} onClick={() => setOpen(false)}>Contact</Link>
      </nav>
    </>
  );
}
