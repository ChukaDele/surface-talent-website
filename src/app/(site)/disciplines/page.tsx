import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/site/PageHero";
import { DisciplineGrid } from "@/components/pages/disciplines/DisciplineGrid";
import "@/styles/pages/disciplines.css";
import { BrLg } from "@/components/ui/BrLg";

export const metadata: Metadata = {
  title: "Surface Finishing Recruitment — Surface Talent",
  description: "Fourteen finishing disciplines recruited individually — electroplating, anodising, galvanising, thermal spray, PVD, electroless nickel and more.",
  alternates: { canonical: `${SITE_ORIGIN}/disciplines` },
  openGraph: { title: "Surface Finishing Recruitment — Surface Talent", description: "Fourteen finishing disciplines recruited individually — electroplating, anodising, galvanising, thermal spray, PVD, electroless nickel and more.", url: `${SITE_ORIGIN}/disciplines` },
};

/** Figma Disciplines 2036:521 (canonical two-per-row grid). */
export default function DisciplinesPage() {
  return (
    <div className="st-page">
      <PageHero className="st-dhero" eyebrow="Where we specialise" title={<>The full breadth of <em>surface engineering.</em><BrLg />Known <em>individually,</em> not generically.</>} body="Each discipline has its own chemistry, kit, standards, hazards and talent pool. We recruit across all of them because the sector needs a partner who speaks the language." bodyWidth={520} />
      <section className="st-block" aria-label="Disciplines">
        <div className="st-inner st-block__inner" style={{ paddingTop: 20 }}>
          <DisciplineGrid />
        </div>
      </section>
      <section className="st-band" aria-labelledby="lane-title">
        <div className="st-inner st-dlane">
          <div className="st-dlane__head">
            <Eyebrow diamond>Across every lane</Eyebrow>
            <h2 id="lane-title" className="st-h2">The same operational and commercial spine.</h2>
          </div>
          <div className="st-dlane__copy">
            <p className="st-body">Whatever the discipline, every surface engineering business needs the same functional capabilities: process engineering, quality, EHS, continuous improvement, maintenance and controls, and commercial. We recruit into all of them, at every level from graduate to director.</p>
            <div className="st-btn-row">
              <Button href="/clients#recruit" tone="light">See what we recruit</Button>
              <Button href="/contact#brief" tone="light" variant="secondary">Brief us on a role</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
