import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Cloudflare Workers adapter for the Next.js build (staging Worker `surface-talent-staging`).
 * Prerendered dynamic routes (the /legal/[slug] pages) are served from the build-time cache shipped
 * as static assets — read-only, no KV/R2 needed; nothing on this site uses on-demand revalidation.
 */
export default defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache });
