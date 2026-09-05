import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BookCallButton } from "@/components/ui/BookCallButton";
import * as Icons from "@/components/pages/disciplines/icons";
import { DISCIPLINE_PAGES } from "@/lib/site/disciplinePages";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { JsonLd, breadcrumbLd } from "@/lib/site/structuredData";
import "@/styles/pages/disciplines.css";
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
      <nav className="st-inner st-crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/" prefetch={false}>Home</Link></li>
          <li><Link href="/disciplines" prefetch={false}>Disciplines</Link></li>
          <li aria-current="page">{d.title}</li>
        </ol>
      </nav>

      <header className="st-inner st-ddetail__hero">
        <div className="st-ddetail__herocopy">
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <h1 className="st-h1">{d.h1}</h1>
          {d.intro.map((p) => <p key={p.slice(0, 24)} className="st-body-lg">{p}</p>)}
          <div className="st-btn-row">
            <Button href="/contact#brief">Brief us on a role</Button>
            <BookCallButton variant="secondary">Book a call</BookCallButton>
          </div>
        </div>
        {Icon ? <div className="st-ddetail__art" aria-hidden="true"><Icon className="st-ddetail__icon" /></div> : null}
      </header>

      <section className="st-block st-block--cream" aria-labelledby="process-h">
        <div className="st-inner st-ddetail__two">
          <h2 id="process-h" className="st-h2">{d.process.heading}</h2>
          <div className="st-ddetail__prose">{d.process.body.map((p) => <p key={p.slice(0, 24)} className="st-body">{p}</p>)}</div>
        </div>
      </section>

      <section className="st-block" aria-labelledby="roles-h">
        <div className="st-inner st-block__inner st-block__inner--tight">
          <div className="st-heading st-heading--center st-heading--520">
            <Eyebrow diamond>Who we place</Eyebrow>
            <h2 id="roles-h" className="st-h2" style={{ color: "var(--ink-soft)" }}>Roles we recruit in {d.title.toLowerCase()}</h2>
          </div>
          <div className="st-grid3">
            {d.roles.map((r) => (
              <article key={r.title} className="st-grid3__card" style={{ minHeight: 170 }}>
                <div className="st-grid3__text">
                  <h3 className="st-grid3__title">{r.title}</h3>
                  <p className="st-body">{r.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="st-band" aria-labelledby="challenges-h">
        <div className="st-inner st-band__inner">
          <div className="st-heading st-heading--center">
            <Eyebrow diamond>What makes this hard</Eyebrow>
            <h2 id="challenges-h" className="st-h2">Hiring challenges in this lane</h2>
          </div>
          <div className="st-grid3 st-grid3--dark">
            {d.challenges.map((c) => (
              <article key={c.title} className="st-grid3__card" style={{ minHeight: 170 }}>
                <div className="st-grid3__text">
                  <h3 className="st-h4">{c.title}</h3>
                  <p className="st-body">{c.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="st-ddetail__standards">
            <h3 className="st-eyebrow st-eyebrow--light">Standards and approvals we screen against</h3>
            <ul>{d.standards.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="st-block" aria-labelledby="next-h">
        <div className="st-inner st-ddetail__next">
          <div>
            <Eyebrow diamond>Where next</Eyebrow>
            <h2 id="next-h" className="st-h2" style={{ color: "var(--ink-soft)" }}>Related disciplines</h2>
            <ul className="st-ddetail__related">
              {related.map((r) => <li key={r.slug}><Link href={`/disciplines/${r.slug}`} prefetch={false}>{r.title}</Link></li>)}
              <li><Link href="/disciplines" prefetch={false}>All 14 disciplines</Link></li>
            </ul>
          </div>
          <div className="st-ddetail__actions">
            <p className="st-body">Hiring in {d.title.toLowerCase()}? Send us the role and we will come back within 24 hours. Looking for your next move? Register and we will call when the right one lands.</p>
            <div className="st-btn-row">
              <Button href="/contact#brief">Brief us on a role</Button>
              <Button href="/candidates#register" variant="secondary">Register your CV</Button>
              <Button href="/jobs" variant="secondary">See live roles</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
