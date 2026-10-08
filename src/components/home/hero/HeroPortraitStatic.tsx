"use client";

import { useEffect, useRef, useState } from "react";

const HOLD_MS = 4500;
const TRANSITION_MS = 720;
const EMPTY_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const PORTRAITS = [
  { id: "plant-leader", position: "54% 14%" },
  { id: "process-engineer", position: "50% 10%" },
  { id: "commercial-leader", position: "50% 8%" },
  { id: "operations-manager", position: "58% 4%" },
] as const;

function PortraitImage({ id, position, loading, fetchPriority }: {
  id: string;
  position: string;
  loading: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}) {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={`/assets/media/hero/portraits/${id}.avif`} type="image/avif" />
      <source media="(min-width: 768px)" srcSet={`/assets/media/hero/portraits/${id}.webp`} type="image/webp" />
      <img
        src={EMPTY_PIXEL}
        alt=""
        width={1086}
        height={1448}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        style={{ objectPosition: position }}
      />
    </picture>
  );
}

/**
 * Production Hero H artwork. Two image layers own the one simple portrait loop: the incoming
 * portrait is already in the DOM before the restrained crossfade, while the copy and layout never
 * move. The first portrait remains the reduced-motion and phone-safe source of truth.
 */
export function HeroPortraitStatic() {
  const root = useRef<HTMLDivElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [paused, setPaused] = useState(true);
  const [slots, setSlots] = useState<[number, number]>([0, 1]);
  const [front, setFront] = useState<0 | 1>(0);
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionState = () => {
      if (reduce.matches) {
        setSlots([0, 1]);
        setFront(0);
        setStep(0);
        setTransitioning(false);
      }
      setMotionAllowed(!reduce.matches);
      setPaused(reduce.matches || document.hidden);
    };
    const visibility = () => setPaused(reduce.matches || document.hidden);
    const observer = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting || reduce.matches || document.hidden), { threshold: 0.05 });

    applyMotionState();
    if (root.current) observer.observe(root.current);
    reduce.addEventListener("change", applyMotionState);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      reduce.removeEventListener("change", applyMotionState);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  // Hold the current image, then reveal the already-mounted next image. A timeout, rather than a
  // competing interval, lets visibility/offscreen changes cancel the cycle without drift.
  useEffect(() => {
    if (!motionAllowed || paused || transitioning) return;
    const back: 0 | 1 = front === 0 ? 1 : 0;
    const timer = window.setTimeout(() => {
      setFront(back);
      setTransitioning(true);
    }, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [front, motionAllowed, paused, step, transitioning]);

  // This is separate from the hold effect so its cleanup cannot cancel the post-fade slot update
  // when `front` changes, which would leave the loop stuck on its second portrait.
  useEffect(() => {
    if (!transitioning) return;
    const oldFront: 0 | 1 = front === 0 ? 1 : 0;
    const nextStep = (step + 1) % PORTRAITS.length;
    const followingStep = (nextStep + 1) % PORTRAITS.length;
    const timer = window.setTimeout(() => {
      setSlots((current) => {
        const copy: [number, number] = [current[0], current[1]];
        copy[oldFront] = followingStep;
        return copy;
      });
      setStep(nextStep);
      setTransitioning(false);
    }, TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [front, step, transitioning]);

  const activePortrait = slots[front];
  return (
    <div
      ref={root}
      className="st-static-portrait"
      data-static-portrait-preview
      data-hero-portrait-index={activePortrait}
      data-hero-portrait-hold-ms={HOLD_MS}
      data-hero-portrait-transition-ms={TRANSITION_MS}
      role="img"
      aria-label="Portrait-led recruitment hero"
    >
      <div className="st-static-portrait__background" data-static-main aria-hidden="true">
        {(motionAllowed ? ([0, 1] as const) : ([0] as const)).map((slot) => {
          const portrait = PORTRAITS[slots[slot]];
          return (
            <div
              key={slot}
              className="st-static-portrait__layer"
              data-static-layer={slot}
              data-front={slot === front ? "" : undefined}
            >
              <PortraitImage
                id={portrait.id}
                position={portrait.position}
                loading={slot === 0 ? "eager" : "lazy"}
                fetchPriority={slot === 0 ? "high" : "auto"}
              />
            </div>
          );
        })}
      </div>
      <div className="st-static-portrait__scrim" aria-hidden="true" />
    </div>
  );
}
