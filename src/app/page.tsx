import { Header } from "@/components/site/Header";
import { Hero } from "@/components/home/Hero";
import { SystemScene } from "@/components/home/SystemScene";
import { WhySpecialist } from "@/components/home/WhySpecialist";
import { InsiderDna } from "@/components/home/InsiderDna";
import { Problem } from "@/components/home/Problem";
import { Testimonials } from "@/components/home/Testimonials";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Disciplines } from "@/components/home/Disciplines";
import { Functions } from "@/components/home/Functions";
import { Stake } from "@/components/home/Stake";
import { Footer } from "@/components/home/Footer";
import { PageMotion } from "@/components/home/PageMotion";
import "@/styles/home.css";
import "@/styles/hero.css";
import "@/styles/system.css";
import "@/styles/why.css";
import "@/styles/dna.css";
import "@/styles/problem.css";
import "@/styles/clients.css";
import "@/styles/how.css";
import "@/styles/grids.css";
import "@/styles/stake.css";
import "@/styles/footer.css";
import "@/styles/mobile.css";

export default function HomePage() {
  return (
    <>
      {/* first focusable element on the page: the homepage is 20 screens on a phone */}
      <a className="st-skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        {/* The approved h-static composition is the production homepage hero. */}
        <Hero />
        <SystemScene />
        <WhySpecialist />
        <InsiderDna />
        <Problem />
        <Testimonials />
        <HowItWorks />
        <Disciplines />
        <Functions />
        <Stake />
      </main>
      <Footer />
      <PageMotion />
    </>
  );
}
