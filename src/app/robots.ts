import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site/nav";

/**
 * Production allows every legitimate crawler (including AI *search* agents such as OAI-SearchBot,
 * PerplexityBot and Bingbot — discovery, not training) and points at the sitemap. Assets stay
 * crawlable so pages render for the bots. Staging/preview disallows everything; the noindex header
 * in next.config.ts is the belt-and-braces guard there.
 *
 * Training-use policy is a separate business decision from search discovery: GPTBot and friends are
 * not given a special allowance or a block here, so they inherit the default `*` rule. Change that
 * only on an explicit owner decision.
 */
export default function robots(): MetadataRoute.Robots {
  const staging = process.env.SITE_ENV !== "production";
  if (staging) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/hero-loop", "/design-lab"] },
      { userAgent: ["OAI-SearchBot", "Bingbot", "Googlebot", "PerplexityBot", "DuckDuckBot", "Applebot"], allow: "/", disallow: ["/api/", "/hero-loop", "/design-lab"] },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
