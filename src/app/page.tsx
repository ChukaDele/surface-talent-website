import { Header } from "@/components/site/Header";
import { HeroPremium } from "@/components/home/HeroPremium";
import { WhyGeneralists } from "@/components/home/WhyGeneralists";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { WhoWePlace } from "@/components/home/WhoWePlace";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/home/Footer";
import { PageMotion } from "@/components/home/PageMotion";
import "@/styles/home.css";
import "@/styles/dna.css";
import "@/styles/premium.css";
import "@/styles/clients.css";
import "@/styles/footer.css";
import "@/styles/mobile.css";

export default function HomePage() {
  return (
    <>
      {/* first focusable element on the page */}
      <a className="st-skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <HeroPremium />
        <WhyGeneralists />
        <WhoWeAre />
        <WhoWePlace />
        <Process />
        <Testimonials />
      </main>
      <Footer />
      <PageMotion />
    </>
  );
}
