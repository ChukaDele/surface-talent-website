import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/home/Hero";
import { SystemScene } from "@/components/home/SystemScene";
import { PageMotion } from "@/components/home/PageMotion";
import "@/styles/home.css";
import "@/styles/hero.css";
import "@/styles/system.css";
import { HERO_VARIANTS, type HeroVariant } from "@/components/home/hero/variants";

export const metadata: Metadata = { title: "Hero variant — Surface Talent (internal)", robots: { index: false, follow: false } };
export const dynamicParams = false;
export function generateStaticParams() { return HERO_VARIANTS.map((v) => ({ variant: v.id })); }

/**
 * One hero variant in its real context: the homepage hero plus the section it hands off to, so the
 * explanatory loop, responsive composition and scroll exit can all be judged. Staging only.
 */
export default async function HeroVariantPage({ params }: { params: Promise<{ variant: string }> }) {
  if (process.env.SITE_ENV === "production") notFound();
  const { variant } = await params;
  if (!HERO_VARIANTS.some((v) => v.id === variant)) notFound();
  return (
    <>
      <Header />
      <main id="main">
        <Hero variant={variant as HeroVariant} />
        <SystemScene />
      </main>
      <nav aria-label="Hero comparison" className="st-hero-lab-switcher">
        {HERO_VARIANTS.map((item) => (
          item.id === variant
            ? <span key={item.id} aria-current="page">{item.name}</span>
            : <Link key={item.id} href={`/design-lab/hero/${item.id}`} prefetch={false}>{item.name}</Link>
        ))}
        <Link href="/design-lab/hero" prefetch={false} style={{ color: "var(--primary-300)" }}>index</Link>
      </nav>
      <PageMotion />
    </>
  );
}
