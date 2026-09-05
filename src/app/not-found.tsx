import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/home/Footer";
import { OffSpecPlate } from "@/components/site/OffSpecPlate";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import "@/styles/home.css";
import "@/styles/grids.css";
import "@/styles/footer.css";
import "@/styles/site.css";
import "@/styles/pages/error.css";
import "@/styles/mobile.css";

export const metadata: Metadata = {
  title: "Page not found — Surface Talent",
  description: "That page is not here. The live roles, the register and the contact routes are.",
  robots: { index: false, follow: true },
};

/** 404. Same voice as the rest of the site: name the fault, then get on with it. */
export default function NotFound() {
  return (
    <>
      <a className="st-skip" href="#main">Skip to content</a>
      <Header tone="dark" />
      <main id="main" className="st-err">
        <div className="st-err__inner">
          <div className="st-err__copy">
            <Eyebrow tone="muted">Error 404</Eyebrow>
            <h1 className="st-h1">This one failed inspection.</h1>
            <p className="st-body-lg">
              The page you asked for is not on the line. It may have moved, or the link may have been
              typed from memory. Nothing is broken at your end.
            </p>
            <div className="st-btn-row">
              <Button href="/" tone="light">Back to the start</Button>
              <Button href="/jobs" variant="secondary">See live roles</Button>
            </div>
            <div className="st-err__links">
              <Link href="/candidates" prefetch={false}>Register your CV</Link>
              <Link href="/clients" prefetch={false}>Brief us on a role</Link>
              <Link href="/disciplines" prefetch={false}>Disciplines</Link>
              <Link href="/contact" prefetch={false}>Contact</Link>
            </div>
          </div>
          <OffSpecPlate code="404" />
        </div>
      </main>
      <Footer />
    </>
  );
}
