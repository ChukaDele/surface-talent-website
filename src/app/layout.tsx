import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/brand.css";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { JsonLd, organizationLd, websiteLd } from "@/lib/site/structuredData";

// Brand typography (Brand and Launch Pack): Inter Tight headlines, Inter body, IBM Plex Mono for
// labels, codes and figures. Self-hosted OFL files so builds need no network and every visitor
// sees the same faces (the previous Coolvetica heading face was never shipped as a webfont).
const interTight = localFont({ src: "../fonts/InterTight-Variable.woff2", variable: "--font-inter-tight", weight: "100 900", display: "swap" });
const inter = localFont({ src: "../fonts/Inter-Variable.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
const plexMono = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  preload: false,
  display: "swap",
});

const isStaging = process.env.SITE_ENV !== "production";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: "Surface Engineering Recruitment — Surface Talent", template: "%s" },
  description:
    "Specialist recruitment for UK surface engineering and metal finishing. Permanent, contract and interim roles from process engineer to managing director.",
  alternates: { canonical: "/" },
  applicationName: "Surface Talent",
  authors: [{ name: "Surface Talent" }],
  openGraph: {
    type: "website", siteName: "Surface Talent", locale: "en_GB", url: SITE_ORIGIN,
    title: "Surface Engineering Recruitment — Surface Talent",
    description: "Specialist recruitment for UK surface engineering and metal finishing. Permanent, contract and interim roles from process engineer to managing director.",
    images: [{ url: "/assets/media/og-default.jpg", width: 1200, height: 630, alt: "Surface Talent — specialist recruitment for UK surface engineering" }],
  },
  twitter: { card: "summary_large_image", title: "Surface Engineering Recruitment — Surface Talent", description: "Specialist recruitment for UK surface engineering and metal finishing. Permanent, contract and interim roles from process engineer to managing director.", images: ["/assets/media/og-default.jpg"] },
  icons: {
    icon: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  // staging/preview builds are never indexed; production omits this and relies on robots.ts
  robots: isStaging ? { index: false, follow: false, nocache: true } : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${interTight.variable} ${inter.variable} ${plexMono.variable}`}>
      <head>
        <JsonLd data={[organizationLd, websiteLd]} />
      </head>
      <body>{children}</body>
    </html>
  );
}
