import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHead } from "@/components/site/Blocks";
import { DisciplineGrid } from "@/components/pages/disciplines/DisciplineGrid";
import "@/styles/pages/disciplines.css";

export const metadata: Metadata = {
  title: "Surface Finishing Recruitment — Surface Talent",
  description: "Fourteen finishing disciplines recruited individually — electroplating, anodising, galvanising, thermal spray, PVD, electroless nickel and more.",
  alternates: { canonical: `${SITE_ORIGIN}/disciplines` },
  openGraph: { title: "Surface Finishing Recruitment — Surface Talent", description: "Fourteen finishing disciplines recruited individually — electroplating, anodising, galvanising, thermal spray, PVD, electroless nickel and more.", url: `${SITE_ORIGIN}/disciplines` },
};

/** Disciplines (October 2026 brand pass). */
export default function DisciplinesPage() {
  return (
    <div className="st-page">
      <PageHero
        className="st-dhero"
        eyebrow="Where we specialise"
        title="The full breadth of surface engineering. Known individually, not generically."
        body="Each discipline has its own chemistry, kit, standards, hazards and talent pool. We recruit across all of them because the sector needs a partner who speaks the language."
      />
      <Section tone="white" label="Disciplines">
        <DisciplineGrid />
      </Section>
      <Section tone="dark" labelledBy="lane-title">
        <SectionHead
          layout="split"
          eyebrow="Across every lane"
          titleId="lane-title"
          title="The same operational and commercial spine."
          lede="Whatever the discipline, every surface engineering business needs the same functional capabilities: process engineering, quality, EHS, continuous improvement, maintenance and controls, and commercial. We recruit into all of them, at every level from graduate to director."
          actions={<><Button href="/clients#recruit" tone="light">See what we recruit</Button><Button href="/contact#brief" tone="light" variant="secondary">Brief us on a role</Button></>}
        />
      </Section>
    </div>
  );
}
