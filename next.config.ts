import type { NextConfig } from "next";

/**
 * SITE_ENV=staging marks preview/staging builds: every response carries X-Robots-Tag: noindex and
 * the robots metadata says the same, so the staging Worker is never indexed. Production builds
 * (SITE_ENV=production) do not set this — the production SEO system is a later task.
 */
const isStaging = process.env.SITE_ENV !== "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // the interim /legal/* paths published on staging now live at clean canonical roots
    return [
      { source: "/legal/:slug", destination: "/:slug", permanent: true },
      { source: "/legal", destination: "/privacy", permanent: false },
      // the site this replaces served the same pages at clean URLs and 308'd the .html forms.
      // Keep that behaviour so any external link to a .html page still resolves after cutover.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:page.html", destination: "/:page", permanent: true },
    ];
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:path*", headers: isStaging ? [...security, { key: "X-Robots-Tag", value: "noindex, nofollow" }] : security },
      { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
