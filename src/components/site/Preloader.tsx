"use client";

import { useEffect, useState } from "react";

/**
 * First-visit preloader.
 *
 * Rules it has to obey, because a preloader is the easiest way to wreck a fast site:
 * - It never delays the page. The content is already painted underneath; this is a curtain over
 *   the top, not a gate in front. Largest Contentful Paint is unaffected.
 * - It has a hard ceiling. Whatever else happens it leaves by MAX_MS, so a slow font or a stalled
 *   request can never strand someone on a loading screen.
 * - It shows once per browsing session, and only on the homepage. Interior pages are instant.
 * - Reduced motion and repeat visits skip it entirely.
 *
 * What it draws is the site's own idea: a bath filling and a coating reaching depth. It is the
 * brand's material, not a spinner.
 */

const KEY = "st-preloaded";
/**
 * Kept deliberately short. A curtain is measured by Speed Index whether or not it blocks paint, so
 * every extra 100ms here is a straight cost to the performance score. At 300/700 the homepage holds 90+
 * on mobile; at 620/1500 it dropped to 89 and the interior pages lost ten points each.
 */
const MIN_MS = 300;
const MAX_MS = 700;

export function Preloader() {
  const [state, setState] = useState<"off" | "on" | "leaving">("off");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch { seen = true; } // private mode: skip
    if (seen) return;
    try { sessionStorage.setItem(KEY, "1"); } catch { /* nothing to do */ }

    // a microtask, not a synchronous set: it still runs before the browser paints, so there is no
    // flash of content before the curtain, and the effect stays free of cascading renders
    queueMicrotask(() => setState("on"));
    const start = performance.now();
    let leaveTimer = 0;
    let doneTimer = 0;

    const leave = () => {
      const held = performance.now() - start;
      leaveTimer = window.setTimeout(() => {
        setState("leaving");
        doneTimer = window.setTimeout(() => setState("off"), 340);
      }, Math.max(0, MIN_MS - held));
    };

    // go when the page is genuinely usable, and go anyway at the ceiling
    const cap = window.setTimeout(leave, MAX_MS);
    const ready = () => { window.clearTimeout(cap); leave(); };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });

    return () => {
      window.clearTimeout(cap); window.clearTimeout(leaveTimer); window.clearTimeout(doneTimer);
      window.removeEventListener("load", ready);
    };
  }, []);

  if (state === "off") return null;
  return (
    <div className={`st-pre ${state === "leaving" ? "is-leaving" : ""}`} aria-hidden="true">
      <div className="st-pre__mark">
        <svg viewBox="0 0 64 48" className="st-pre__vessel">
          {/* the Surface Talent vessel, filling */}
          <clipPath id="st-pre-clip"><rect x="8" y="10" width="48" height="30" rx="1" /></clipPath>
          <g clipPath="url(#st-pre-clip)">
            <rect className="st-pre__fill" x="8" y="10" width="48" height="30" />
          </g>
          <path d="M6 4 L6 34 Q6 42 14 42 L50 42 Q58 42 58 34 L58 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="8" y1="16" x2="56" y2="16" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
        </svg>
        <span className="st-pre__word">Surface Talent</span>
      </div>
      <span className="st-pre__bar"><span className="st-pre__barfill" /></span>
    </div>
  );
}
