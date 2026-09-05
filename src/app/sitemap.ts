import type { MetadataRoute } from "next";
import manifest from "@/content/legal/manifest.json";
import { DISCIPLINE_PAGES } from "@/lib/site/disciplinePages";
import { SITE_ORIGIN } from "@/lib/site/nav";

/** Canonical production sitemap. Internal tools (/hero-loop, /design-lab) and API routes are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) =>
    ({ url: `${SITE_ORIGIN}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page("/", 1, "weekly"),
    page("/clients", 0.9, "monthly"),
    page("/candidates", 0.9, "monthly"),
    page("/jobs", 0.9, "daily"),
    page("/disciplines", 0.8, "monthly"),
    ...DISCIPLINE_PAGES.map((d) => page(`/disciplines/${d.slug}`, 0.7, "monthly")),
    page("/about", 0.6, "yearly"),
    page("/contact", 0.7, "yearly"),
    ...(manifest as { slug: string }[]).map((l) => page(`/${l.slug}`, 0.2, "yearly")),
  ];
}
