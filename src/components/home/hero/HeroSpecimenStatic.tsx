import { HeroPortraitStatic } from "./HeroPortraitStatic";

/**
 * Production Hero H specimen. Keeping this path outside the comparison client component avoids
 * hydrating the legacy scene selector and its WebGL imports on the homepage.
 */
export function HeroSpecimenStatic() {
  return (
    <div data-hero-specimen className="st-hero__specimen st-hero__specimen--flat st-hero__specimen--h-static">
      <HeroPortraitStatic />
    </div>
  );
}
