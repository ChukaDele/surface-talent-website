import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Blocks";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164, CONTACT_WHATSAPP_URL, SITE_ORIGIN } from "@/lib/site/nav";

export const metadata: Metadata = {
  title: "Contact Surface Talent",
  description: "Book a call, send a role brief, or email and phone us directly. Hiring or exploring a move, every conversation stays confidential.",
  alternates: { canonical: `${SITE_ORIGIN}/contact` },
  openGraph: { title: "Contact Surface Talent", description: "Book a call, send a role brief, or email and phone us directly. Hiring or exploring a move, every conversation stays confidential.", url: `${SITE_ORIGIN}/contact` },
};

/** Contact (October 2026 brand pass): three routes on one hairline row, then the brief form. */
export default function ContactPage() {
  return (
    <div className="st-page">
      <PageHero eyebrow="Contact" title="Talk to us." body="Hiring, exploring a move, or want a confidential view on the market? Three ways to reach us. Pick whichever suits." className="st-cohero">
        <div className="st-rgrid st-rgrid--3 st-routes">
          <article className="st-rgrid__cell">
            <span className="st-rgrid__kicker">01</span>
            <h2 className="st-h4 st-rgrid__title">Book a call</h2>
            <p className="st-body st-rgrid__body">Pick a slot. We’ll talk through the role or the market. No obligation.</p>
            <div className="st-routes__action"><BookCallButton variant="primary">Book a call</BookCallButton></div>
          </article>
          <article className="st-rgrid__cell">
            <span className="st-rgrid__kicker">02</span>
            <h2 className="st-h4 st-rgrid__title">Send a brief</h2>
            <p className="st-body st-rgrid__body">Tell us the role, location, timeline. We come back within 24 hours.</p>
            <div className="st-routes__action"><Button href="#brief" variant="secondary">Fill in the form</Button></div>
          </article>
          <article className="st-rgrid__cell">
            <span className="st-rgrid__kicker">03</span>
            <h2 className="st-h4 st-rgrid__title">Email, phone or WhatsApp</h2>
            <ul className="st-routes__list">
              <li><a className="st-contact-link" href={`mailto:${CONTACT_EMAIL}`}><span>{CONTACT_EMAIL}</span></a></li>
              <li><a className="st-contact-link" href={`tel:${CONTACT_PHONE_E164}`}><span>{CONTACT_PHONE_DISPLAY}</span></a></li>
              <li><a className="st-contact-link" href={CONTACT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><span>WhatsApp us</span><span className="sr-only"> (opens WhatsApp)</span></a></li>
            </ul>
          </article>
        </div>
      </PageHero>

      <Section tone="white" id="brief" labelledBy="brief-title" className="st-band--anchor">
        <div className="st-twocol">
          <div className="st-shead__main st-cobrief__head">
            <Eyebrow>Send a brief</Eyebrow>
            <h2 id="brief-title" className="st-h2">Tell us what you need.</h2>
            <p className="st-body-lg st-shead__lede">For clients: role, location, timeline. For candidates: the kind of move you’re exploring. Everything is confidential.</p>
            <dl className="st-cobrief__facts">
              <div><dt>Response</dt><dd>Within 24 hours</dd></div>
              <div><dt>Confidentiality</dt><dd>Nothing shared without your say-so</dd></div>
              <div><dt>Registered office</dt><dd>67C King Street, Knutsford WA16 6DX</dd></div>
            </dl>
          </div>
          <div className="st-formcard"><ContactForm /></div>
        </div>
      </Section>
    </div>
  );
}
