import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LegalToc } from "@/components/pages/legal/LegalToc";
import manifest from "@/content/legal/manifest.json";
import { SITE_ORIGIN } from "@/lib/site/nav";
import "@/styles/pages/legal.css";

/**
 * Legal pages at clean canonical paths (/privacy, /cookies, /modern-slavery, …). Content is the
 * legacy Surface Talent legal markup, migrated verbatim; only internal links were re-pointed.
 * Static routes take precedence over this dynamic segment, and `dynamicParams = false` means any
 * other path 404s rather than rendering an empty legal shell.
 */
type Entry = { slug: string; title: string; description: string; eyebrow: string; updated: string };
const ENTRIES = manifest as Entry[];

export const dynamicParams = false;
export function generateStaticParams() { return ENTRIES.map((e) => ({ legal: e.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ legal: string }> }): Promise<Metadata> {
  const { legal } = await params; const e = ENTRIES.find((x) => x.slug === legal);
  if (!e) return {};
  return { title: `${e.title} — Surface Talent`, description: e.description, alternates: { canonical: `${SITE_ORIGIN}/${e.slug}` } };
}

/** Section headings for the on-this-page navigation, read out of the migrated markup. */
function headings(html: string) {
  const out: { id: string; text: string }[] = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const text = m[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
    const id = text.toLowerCase().replace(/^\d+\.\s*/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (text) out.push({ id, text });
  }
  return out;
}

export default async function LegalPage({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  const entry = ENTRIES.find((e) => e.slug === legal);
  if (!entry) notFound();
  const raw = await readFile(path.join(process.cwd(), "src/content/legal", `${legal}.html`), "utf8");
  const toc = headings(raw);
  // give every H2 the id the TOC links to
  let i = 0;
  const body = raw.replace(/<h2([^>]*)>/g, (m0, attrs) => (i < toc.length ? `<h2${attrs} id="${toc[i++].id}">` : m0));
  return (
    <div className="st-page st-legal">
      <header className="st-legal__hero">
        <div className="st-inner st-legal__head">
          <Eyebrow>{entry.eyebrow}</Eyebrow>
          <h1 className="st-h1">{entry.title}</h1>
          {entry.updated ? <p className="st-body-sm st-legal__updated">{entry.updated}</p> : null}
        </div>
      </header>
      <div className="st-inner st-legal__layout">
        <LegalToc items={toc} />
        <div className="st-legal__body" dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
}
