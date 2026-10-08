import type { Metadata } from "next";
import { SITE_ORIGIN } from "./nav";

/** Complete nested metadata without rewriting the approved page title or description. */
export function completePageMetadata(page: Metadata): Metadata {
  return {
    ...page,
    openGraph: {
      type: "website", siteName: "Surface Talent", locale: "en_GB",
      title: page.title as string, description: page.description || undefined,
      url: String(page.alternates?.canonical || SITE_ORIGIN),
      images: [{ url: "/assets/media/og-default.jpg", width: 1200, height: 630, alt: "Surface Talent — specialist recruitment for UK surface engineering" }],
      ...page.openGraph,
    },
    twitter: {
      card: "summary_large_image", title: page.title as string,
      description: page.description || undefined, images: ["/assets/media/og-default.jpg"],
    },
  };
}
