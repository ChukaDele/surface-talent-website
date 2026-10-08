import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Design assets are exact-size SVG/PNG exports positioned at Figma coordinates; next/image's
      // optimisation pipeline would rewrite their intrinsic sizing and add layout indirection.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Playwright HTML report bundles its own minified trace viewer
    "playwright-report/**",
    "test-results/**",
    // build output and QA dumps
    ".open-next/**",
    ".wrangler/**",
    "design-dump/**",
  ]),
]);

export default eslintConfig;
