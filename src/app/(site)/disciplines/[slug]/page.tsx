import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHead, RuleGrid } from "@/components/site/Blocks";
import { BookCallButton } from "@/components/ui/BookCallButton";
import * as Icons from "@/components/pages/disciplines/icons";
import { DISCIPLINE_PAGES } from "@/lib/site/disciplinePages";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { JsonLd, breadcrumbLd } from "@/lib/site/structuredData";
import "@/styles/pages/discipline-detail.css";

/** Per-discipline landing pages (process, roles, standards, hiring challenges, related lanes). */
export const dynamicParams = false;
export function generateStaticParams() { return DISCIPLINE_PAGES.map((d) => ({ slug: d.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const d = DISCIPLINE_PAGES.find((x) => x.slug === slug);
  if (!d) return {};
  return {
    title: d.metaTitle,
    description: d.metaDescription,
    alternates: { canonical: `${SITE_ORIGIN}/disciplines/${d.slug}` },
    openGraph: { title: d.metaTitle, description: d.metaDescription, url: `${SITE_ORIGIN}/disciplines/${d.slug}` },
  };
}

/** Explicit slug → illustration map (declared at module scope, never built during render). */
const ICON_BY_SLUG: Record<string, (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  electroplating: Icons.Disc01,
  anodising: Icons.Disc02,
  "powder-coating": Icons.Disc03,
  "heat-treatment": Icons.Disc04,
  "thermal-spray": Icons.Disc05,
};

export default async function DisciplineDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DISCIPLINE_PAGES.find((x) => x.slug === slug);
  if (!d) notFound();
  const Icon = ICON_BY_SLUG[d.slug];
  const related = d.related.map((r) => DISCIPLINE_PAGES.find((x) => x.slug === r)).filter(Boolean) as typeof DISCIPLINE_PAGES;
  return (
    <div className="st-page st-ddetail">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Disciplines", path: "/disciplines" }, { name: d.title, path: `/disciplines/${d.slug}` }])} />
      <PageHero
        eyebrow={d.eyebrow}
        title={d.h1}
        body={<>{d.intro.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</>}
        actions={<><Button href="/contact#brief">Brief us on a role</Button><BookCallButton variant="secondary">Book a call</BookCallButton></>}
        aside={Icon ? <div className="st-ddetail__art" aria-hidden="true"><Icon className="st-ddetail__icon" /></div> : undefined}
        crumbs={
          <nav aria-label="Breadcrumb">
            <ol className="st-crumbs-inline">
              <li><Link href="/" prefetch={false}>Home</Link></li>
              <li><Link href="/disciplines" prefetch={false}>Disciplines</Link></li>
              <li aria-current="page">{d.title}</li>
            </ol>
          </nav>
        }
      />

      <Section tone="white" labelledBy="process-h">
        <div className="st-twocol">
          <div className="st-shead__main">
            <Eyebrow>The work</Eyebrow>
            <h2 id="process-h" className="st-h2">{d.process.heading}</h2>
          </div>
          <div className="st-prose st-prose--lead">{d.process.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
        </div>
      </Section>

      <Section tone="chalk" labelledBy="roles-h">
        <SectionHead layout="split" eyebrow="Who we place" titleId="roles-h" title={`Roles we recruit in ${d.title.toLowerCase()}`} />
        <RuleGrid items={d.roles} />
      </Section>

      <Section tone="dark" labelledBy="challenges-h">
        <SectionHead layout="split" eyebrow="What makes this hard" titleId="challenges-h" title="Hiring challenges in this lane" />
        <RuleGrid items={d.challenges} />
        <div className="st-standards">
          <h3 className="st-eyebrow">Standards and approvals we screen against</h3>
          <ul>{d.standards.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </Section>

      <Section tone="white" labelledBy="next-h">
        <div className="st-twocol">
          <div className="st-shead__main">
            <Eyebrow>Where next</Eyebrow>
            <h2 id="next-h" className="st-h2">Hiring in {d.title.toLowerCase()}?</h2>
            <p className="st-body-lg st-shead__lede">Send us the role and we will come back within 24 hours. Looking for your next move? Register and we will call when the right one lands.</p>
            <div className="st-btn-row">
              <Button href="/contact#brief">Brief us on a role</Button>
              <Button href="/candidates#register" variant="secondary">Register your CV</Button>
            </div>
          </div>
          <div>
            <span className="st-rgrid__kicker st-related__label">Related disciplines</span>
            <ul className="st-related">
              {related.map((r) => <li key={r.slug}><Link href={`/disciplines/${r.slug}`} prefetch={false}>{r.title}</Link></li>)}
              <li><Link href="/disciplines" prefetch={false}>All 14 disciplines</Link></li>
              <li><Link href="/jobs" prefetch={false}>See live roles</Link></li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}
