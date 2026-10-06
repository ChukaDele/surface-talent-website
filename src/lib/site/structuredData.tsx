import { CONTACT_EMAIL, CONTACT_PHONE_E164, SITE_ORIGIN } from "./nav";

/**
 * Truthful JSON-LD only. Surface Talent is a UK employment agency for surface engineering, a sister
 * company of the EMC Surface Technologies group. No review, rating or aggregate markup (none is
 * verifiable), and JobPosting is emitted per real vacancy detail page, never on the listing.
 */
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "EmploymentAgency"],
  "@id": `${SITE_ORIGIN}/#organization`,
  name: "Surface Talent",
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/assets/svg/brand-mark.svg`,
  image: `${SITE_ORIGIN}/assets/media/og-default.jpg`,
  description:
    "Specialist recruitment for the UK surface engineering and metal finishing sector: electroplating, anodising, powder coating, heat treatment, thermal spray and related processes.",
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE_E164,
  areaServed: { "@type": "Country", name: "United Kingdom" },
  parentOrganization: { "@type": "Organization", name: "EMC Surface Technologies" },
  knowsAbout: [
    "Electroplating", "Anodising", "Powder coating", "Heat treatment", "Thermal spray",
    "PVD and CVD coatings", "Electroless plating", "Galvanising", "Metal finishing", "Surface engineering recruitment",
  ],
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: CONTACT_EMAIL, telephone: CONTACT_PHONE_E164, areaServed: "GB", availableLanguage: "English" }],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  url: SITE_ORIGIN,
  name: "Surface Talent",
  publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  inLanguage: "en-GB",
};

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: `${SITE_ORIGIN}${t.path}` })),
  };
}

/** Inline <script type="application/ld+json"> — Next keeps this out of the React tree. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
