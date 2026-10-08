"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hero option G — the photographic direction, moving.
 *
 * Footage beside the headline, never behind it, with no frame around it: no border, no corner
 * marks, no grid. It sits in the hero the way a photograph sits on a page.
 *
 * It has to read as one continuous piece rather than a slideshow, so two video layers are stacked
 * and cross-faded. The incoming clip is already playing before it becomes visible, which is what
 * removes the cut. The order is deliberate too: one person at the start as the human anchor, then
 * hands and material. A parade of different faces is what makes stock footage look like stock
 * footage, so there is only one face in the sequence.
 *
 * Discipline, because video in a hero is the easiest way to ruin a fast page:
 * - The poster paints first, so Largest Contentful Paint is an image, not a download.
 * - `preload="metadata"` on the layer that is not showing: bytes arrive when a clip is next.
 * - Playback stops when the plate leaves the viewport and when the tab is hidden.
 * - Reduced motion never plays anything. It shows the still and the caption, which is complete.
 *
 * The footage is licensed from Coverr: free commercial use, no attribution required, model
 * releases held by Coverr for the people shown. It is not Surface Talent's own candidates and no
 * caption claims that it is. See public/assets/media/hero/LICENCE.txt.
 */

type Clip = { id: string; note: string };

/**
 * One industrial world, in order. The factory is the setting for every beat, which is what keeps
 * it from reading as a recruitment-agency montage. It opens and closes on the material so the loop
 * is invisible, and there is exactly one identifiable face in the whole sequence.
 *
 * Two beats are still to be shot or licensed: people discussing a part on the production floor,
 * and a senior leader walking the line with an operations lead. Adding them here is all that is
 * required; the component plays whatever it is given. See docs/launch/owner-actions.md.
 */
const CLIPS: Clip[] = [
  { id: "beat-01", note: "macro across a finished surface" },
  { id: "beat-02", note: "coating applied to a component" },
  { id: "beat-03", note: "the surface taken back" },
  { id: "beat-04", note: "operator at the bench" },
  { id: "beat-05", note: "macro return, closing the loop" },
];

const SRC = (id: string) => `/assets/media/hero/${id}`;
/** Each beat holds about two and a half seconds, so the whole film runs a little over twelve. */
const HOLD_MS = 2500;
/** Short. A long dissolve puts two moving subjects on screen at once and reads as a double exposure. */
const FADE_MS = 400;

export function VideoPlate() {
  // slots[0] and slots[1] are the two stacked layers; `front` says which one is visible
  const [slots, setSlots] = useState<[number, number]>([0, 1]);
  const [front, setFront] = useState<0 | 1>(0);
  const [reduced, setReduced] = useState(true);
  const frame = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLVideoElement | null)[]>([null, null]);
  const onScreen = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /** Only the visible layer plays, and only while there is a point in playing it. */
  const sync = useCallback(() => {
    layers.current.forEach((v, i) => {
      if (!v) return;
      if (i === front && onScreen.current && !document.hidden) void v.play().catch(() => {});
      else v.pause();
    });
  }, [front]);

  useEffect(() => {
    const el = frame.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([e]) => { onScreen.current = e.isIntersecting; sync(); }, { threshold: 0.15 });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [reduced, sync]);

  // Hold, then start the hidden layer playing and fade across to it.
  useEffect(() => {
    if (reduced || CLIPS.length < 2) return;
    const back: 0 | 1 = front === 0 ? 1 : 0;
    const t = window.setTimeout(() => {
      const v = layers.current[back];
      if (v) { v.currentTime = 0; void v.play().catch(() => {}); }
      setFront(back);
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [front, reduced]);

  // Once the fade has finished, load the next clip into the layer that is now hidden. This is a
  // separate effect on purpose: scheduling it inside the one above meant its own cleanup cancelled
  // it the instant `front` changed, so the sequence never got past the second clip.
  useEffect(() => {
    if (reduced || CLIPS.length < 2) return;
    const hidden: 0 | 1 = front === 0 ? 1 : 0;
    const t = window.setTimeout(() => {
      setSlots((s) => {
        const copy: [number, number] = [s[0], s[1]];
        copy[hidden] = (s[front] + 1) % CLIPS.length;
        return copy;
      });
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [front, reduced]);

  return (
    <figure className="st-plate st-plate--video">
      <div className="st-plate__frame" ref={frame}>
        {reduced ? (
          <img className="st-plate__img" src={`${SRC(CLIPS[0].id)}.jpg`} alt="" width={600} height={800} decoding="async" />
        ) : (
          ([0, 1] as const).map((slot) => {
            const c = CLIPS[slots[slot]];
            return (
              <video
                key={`${slot}-${c.id}`}
                ref={(el) => { layers.current[slot] = el; }}
                className="st-plate__img st-plate__video"
                data-front={slot === front ? "" : undefined}
                poster={`${SRC(c.id)}.jpg`}
                muted
                loop
                playsInline
                preload={slot === front ? "auto" : "metadata"}
                aria-hidden="true"
              >
                <source src={`${SRC(c.id)}.webm`} type="video/webm" />
                <source src={`${SRC(c.id)}.mp4`} type="video/mp4" />
              </video>
            );
          })
        )}
        <div className="st-plate__wash" aria-hidden="true" />
      </div>
    </figure>
  );
}
