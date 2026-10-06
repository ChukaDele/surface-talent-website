import dynamic from "next/dynamic";
import type { HeroVariant } from "./variants";

/**
 * Comparison-only hero scenes are split from the production static path. The comparison route
 * still server-renders its selected scene, but the homepage does not ship this client selector or
 * its optional WebGL dependency when it renders Hero H static.
 */
const HeroSpecimen = dynamic(() => import("./HeroSpecimen").then((module) => module.HeroSpecimen), { ssr: true });

export function HeroSpecimenDynamic({ variant }: { variant: HeroVariant }) {
  return <HeroSpecimen variant={variant} />;
}
