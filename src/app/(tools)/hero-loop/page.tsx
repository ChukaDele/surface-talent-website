import { notFound } from "next/navigation";
import { HeroLoopStage } from "./HeroLoopStage";

/** Dev-only render stage for the hero loop video (scripts/hero-loop-render.mjs). 404 in production builds. */
export default function HeroLoopPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <HeroLoopStage />;
}
