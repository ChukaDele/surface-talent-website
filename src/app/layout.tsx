import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, IBM_Plex_Mono, Gochi_Hand } from "next/font/google";
import "./globals.css";
import { SITE_ORIGIN } from "@/lib/site/nav";
import { JsonLd, organizationLd, websiteLd } from "@/lib/site/structuredData";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400"], display: "swap" });
const gochi = Gochi_Hand({ variable: "--font-gochi", subsets: ["latin"], weight: ["400"], display: "swap" });

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
    <html lang="en-GB" className={`${geist.variable} ${geistMono.variable} ${plexMono.variable} ${gochi.variable}`}>
      <head>
        <link rel="preload" href="/fonts/coolvetica-local-qa.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <JsonLd data={[organizationLd, websiteLd]} />
      </head>
      <body>{children}</body>
    </html>
  );
}
