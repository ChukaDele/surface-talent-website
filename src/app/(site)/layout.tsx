import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/home/Footer";
import "@/styles/home.css";
import "@/styles/grids.css";
import "@/styles/footer.css";
import "@/styles/site.css";
import "@/styles/forms.css";
import "@/styles/mobile.css";

/**
 * Shared chrome for every public page other than the homepage: light header over a white page
 * hero, the page content, and the closing "finished surface" CTA + footer (Figma repeats the
 * homepage footer block on every page frame).
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* first focusable element on the page: the homepage is 20 screens on a phone */}
      <a className="st-skip" href="#main">Skip to content</a>
      <Header tone="light" />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
