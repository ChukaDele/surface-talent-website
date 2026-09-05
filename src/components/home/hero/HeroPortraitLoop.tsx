"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { SectionDrawing } from "./SectionDrawing";

const HOLD_SECONDS = 3.2;
const TRANSITION_SECONDS = 0.9;
const ACTIVE_PLAYBACK_RATE = 1;
const TEASER_PLAYBACK_RATE = 0.35;
const QUEUES = [
  [0, 1, 2, 3],
  [1, 2, 3, 0],
  [2, 3, 0, 1],
  [3, 0, 1, 2],
  [0, 1, 2, 3],
] as const;

const PORTRAITS = [
  { id: "plant-leader", context: "technical-leadership", position: "50% 42%" },
  { id: "process-engineer", context: "engineering", position: "48% 46%" },
  { id: "commercial-leader", context: "commercial", position: "50% 38%" },
  { id: "operations-manager", context: "operations", position: "54% 42%" },
] as const;

/**
 * Hero H — one dominant editorial portrait with three queued shutter previews.
 *
 * GSAP owns the 16.4 second loop. The page-level hero timeline owns the later portrait-to-section
 * scroll handoff, so the two motion systems never compete for the viewport.
 */
export function HeroPortraitLoop() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!root.current) return;
    const rootElement = root.current;
    const panels = gsap.utils.toArray<HTMLElement>("[data-portrait-panel]", rootElement);
    const visuals = gsap.utils.toArray<HTMLElement>("[data-portrait-visual]", rootElement);
    const videos = gsap.utils.toArray<HTMLVideoElement>("[data-portrait-video]", rootElement);
    const media = rootElement.querySelector<HTMLElement>("[data-portrait-media]");
    if (
      panels.length !== PORTRAITS.length
      || visuals.length !== PORTRAITS.length
      || videos.length !== PORTRAITS.length
      || !media
    ) return;

    const mm = gsap.matchMedia();
    const setActive = (active: number) => {
      root.current?.setAttribute("data-active-portrait", String(active));
      panels.forEach((panel, index) => panel.toggleAttribute("data-active", index === active));
    };

    const frameFor = (queue: readonly number[], panelIndex: number) => {
      const gap = media.clientWidth < 500 ? 4 : Math.min(10, Math.max(5, window.innerWidth * 0.0065));
      const contentWidth = media.clientWidth - gap * 3;
      const activeRatio = media.clientWidth < 500 ? 0.75 : 0.715;
      const activeWidth = contentWidth * activeRatio;
      const teaserWidth = (contentWidth - activeWidth) / 3;
      const slot = queue.indexOf(panelIndex);
      return {
        left: slot === 0 ? 0 : activeWidth + gap + (slot - 1) * (teaserWidth + gap),
        width: slot === 0 ? activeWidth : teaserWidth,
      };
    };

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let isIntersecting = true;
      let isFrozen = false;

      const syncPlayback = () => {
        const shouldPlay = isIntersecting && !document.hidden && !isFrozen;
        const active = Number(root.current?.getAttribute("data-active-portrait") ?? 0);

        root.current?.setAttribute("data-media-state", shouldPlay ? "playing" : "paused");
        timeline.paused(!shouldPlay);
        videos.forEach((video, index) => {
          const rate = index === active ? ACTIVE_PLAYBACK_RATE : TEASER_PLAYBACK_RATE;
          video.defaultPlaybackRate = rate;
          video.playbackRate = rate;

          if (!shouldPlay) {
            video.pause();
            return;
          }

          if (!video.hasAttribute("data-load-requested")) {
            video.setAttribute("data-load-requested", "");
            video.load();
          }
          void video.play().catch(() => {
            // The poster remains visible if a browser declines muted inline playback.
          });
        });
      };

      setActive(0);
      gsap.set(panels, {
        left: (index) => frameFor(QUEUES[0], index).left,
        width: (index) => frameFor(QUEUES[0], index).width,
      });
      gsap.set(visuals, { scale: (index) => (index === 0 ? 1.015 : 1.085) });

      const timeline = gsap.timeline({ repeat: -1, invalidateOnRepeat: true });
      for (let step = 1; step < QUEUES.length; step += 1) {
        const queue = QUEUES[step];
        const next = queue[0];
        timeline
          .to({}, { duration: HOLD_SECONDS })
          .call(() => {
            setActive(next);
            syncPlayback();
          })
          .to(panels, {
            left: (index) => frameFor(queue, index).left,
            width: (index) => frameFor(queue, index).width,
            duration: TRANSITION_SECONDS,
            ease: "power3.inOut",
          }, "<")
          .to(visuals, {
            scale: (index) => (index === next ? 1.015 : 1.085),
            duration: TRANSITION_SECONDS,
            ease: "power2.inOut",
          }, "<");
      }

      const observer = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
        syncPlayback();
      }, { threshold: 0.05 });
      const handleFreeze = () => {
        isFrozen = true;
        syncPlayback();
      };
      const handleResume = () => {
        isFrozen = false;
        syncPlayback();
      };
      observer.observe(rootElement);
      document.addEventListener("visibilitychange", syncPlayback);
      document.addEventListener("freeze", handleFreeze);
      document.addEventListener("resume", handleResume);
      syncPlayback();

      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", syncPlayback);
        document.removeEventListener("freeze", handleFreeze);
        document.removeEventListener("resume", handleResume);
        timeline.kill();
        videos.forEach((video) => {
          video.pause();
          video.playbackRate = 1;
        });
        gsap.set(panels, { clearProps: "left,width" });
        gsap.set(visuals, { clearProps: "transform" });
        root.current?.setAttribute("data-media-state", "paused");
        setActive(0);
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setActive(0);
      root.current?.setAttribute("data-media-state", "paused");
      videos.forEach((video) => video.pause());
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <div className="st-portrait-handoff" ref={root} data-active-portrait="0" data-media-state="paused">
      <div
        className="st-portrait-loop"
        data-portrait-media
        data-hero-media
        data-hold-ms={HOLD_SECONDS * 1000}
        data-transition-ms={TRANSITION_SECONDS * 1000}
        data-cycle-ms={Math.round((HOLD_SECONDS + TRANSITION_SECONDS) * PORTRAITS.length * 1000)}
        role="img"
        aria-label="A diverse group of surface engineering specialists and commercial leaders in technical and business settings"
      >
        {PORTRAITS.map((portrait, index) => (
          <figure
            className="st-portrait-loop__panel"
            data-portrait-panel
            data-active={index === 0 ? "" : undefined}
            data-context={portrait.context}
            key={portrait.id}
          >
            <div className="st-portrait-loop__visual" data-portrait-visual>
              <picture>
                <source srcSet={`/assets/media/hero/portraits/${portrait.id}.avif`} type="image/avif" />
                <img
                  className="st-portrait-loop__image"
                  data-portrait-image
                  src={`/assets/media/hero/portraits/${portrait.id}.webp`}
                  alt=""
                  width={1086}
                  height={1448}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  style={{ objectPosition: portrait.position }}
                />
              </picture>
              <video
                className="st-portrait-loop__video"
                data-portrait-video={portrait.id}
                muted
                loop
                playsInline
                preload="none"
                poster={`/assets/media/hero/portraits/${portrait.id}.avif`}
                aria-hidden="true"
                tabIndex={-1}
                onCanPlay={(event) => event.currentTarget.setAttribute("data-ready", "")}
                style={{ objectPosition: portrait.position }}
              >
                <source src={`/assets/media/hero/portraits/${portrait.id}.webm`} type="video/webm" />
                <source src={`/assets/media/hero/portraits/${portrait.id}.mp4`} type="video/mp4" />
              </video>
            </div>
          </figure>
        ))}
      </div>
      <div className="st-portrait-handoff__section" data-hero-section aria-hidden="true">
        <SectionDrawing mode="static" />
      </div>
    </div>
  );
}
