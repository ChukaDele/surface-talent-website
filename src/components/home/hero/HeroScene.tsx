"use client";

import { HeroCanvas } from "./HeroCanvas";
import { CrossSectionScene } from "./scenes/CrossSectionScene";
import { StackScene } from "./scenes/StackScene";
import { A2ThreeScene } from "./scenes/A2ThreeScene";
import type { HeroVariant } from "./variants";

/** Lazy entry point: one transparent canvas, one of the three scenes inside it. */
export default function HeroScene({ variant = "a", onReady, exact }: { variant?: HeroVariant; onReady?: () => void; exact?: boolean }) {
  return (
    <HeroCanvas onReady={onReady} exact={exact}>
      {variant === "a2-three" ? <A2ThreeScene /> : variant === "b" ? <CrossSectionScene /> : <StackScene />}
    </HeroCanvas>
  );
}
