import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HERO_VARIANTS } from "@/components/home/hero/variants";
import "@/styles/home.css";

export const metadata: Metadata = { title: "Hero design lab — Surface Talent (internal)", robots: { index: false, follow: false } };


/** Internal comparison page for the hero scenes and the picture-first H preview. Staging only — 404s in a production build. */
export default function HeroLab() {
  if (process.env.SITE_ENV === "production") notFound();
  return (
    <main style={{ minHeight: "100svh", background: "#0d2233", color: "#fff", padding: "72px 56px" }}>
      <p className="st-eyebrow">Internal · not indexed</p>
      <h1 className="st-h2" style={{ color: "#fff", marginTop: 12, maxWidth: 760 }}>Hero A2 — illustration comparison</h1>
      <p className="st-body" style={{ color: "var(--text-muted-dark)", marginTop: 16, maxWidth: 640 }}>
        Controlled routes in the actual hero context. A2 SVG and A2 Three use the same approved
        specimen, sequence and message; H remains available as a legacy film comparison. The static H
        composition is the production homepage source of truth.
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: "40px 0 0", display: "grid", gap: 20, maxWidth: 760 }}>
        {HERO_VARIANTS.map((v) => (
          <li key={v.id} style={{ padding: 24, background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}>
            <Link href={`/design-lab/hero/${v.id}`} prefetch={false} className="st-h4" style={{ color: "#fff", textDecoration: "none" }}>
              {v.name}
            </Link>
            <p className="st-body-sm" style={{ color: "var(--text-inverse)", opacity: 0.8, marginTop: 8, maxWidth: 620 }}>{v.note}</p>
          </li>
        ))}
        <li style={{ padding: 24, background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}>
          <Link href="/design-lab/hero/h-static" prefetch={false} className="st-h4" style={{ color: "#fff", textDecoration: "none" }}>
            H · static production composition
          </Link>
          <p className="st-body-sm" style={{ color: "var(--text-inverse)", opacity: 0.8, marginTop: 8, maxWidth: 620 }}>
            One dominant full-bleed portrait loop with a fixed copy lockup. No teaser tiles, video or hero choreography.
          </p>
        </li>
      </ul>
    </main>
  );
}
