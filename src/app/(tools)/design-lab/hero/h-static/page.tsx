import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/home/Hero";
import "@/styles/home.css";
import "@/styles/hero.css";
import "@/styles/mobile.css";

export const metadata: Metadata = {
  title: "Hero H static picture preview — Surface Talent (internal)",
  robots: { index: false, follow: false },
};

/** Picture-first Hero H review route. It intentionally omits PageMotion and SystemScene. */
export default function StaticHeroPreviewPage() {
  if (process.env.SITE_ENV === "production") notFound();
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}
