import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/site/PageHero";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164, SITE_ORIGIN } from "@/lib/site/nav";
import "@/styles/pages/contact.css";

export const metadata: Metadata = {
  title: "Contact Surface Talent",
  description: "Book a call, send a role brief, or email and phone us directly. Hiring or exploring a move, every conversation stays confidential.",
  alternates: { canonical: `${SITE_ORIGIN}/contact` },
  openGraph: { title: "Contact Surface Talent", description: "Book a call, send a role brief, or email and phone us directly. Hiring or exploring a move, every conversation stays confidential.", url: `${SITE_ORIGIN}/contact` },
};

/** Figma Contact 2032:21127. */
export default function ContactPage() {
  return (
    <div className="st-page">
      <PageHero eyebrow="Contact" title="Talk to us." body="Hiring, exploring a move, or want a confidential view on the market? Three ways to reach us. Pick whichever suits." orb="contact" bodyWidth={420} className="st-cohero">
        <div className="st-cohero__cards">
          <article className="st-card st-card--between">
            <div className="st-card__icon"><img src="/assets/svg/contact-icon-call.svg" alt="" width={77} height={64} /></div>
            <div className="st-card__text">
              <h2 className="st-h4">Book a call</h2>
              <p className="st-body">Pick a slot. We’ll talk through the role or the market. No obligation.</p>
              <BookCallButton variant="primary" className="st-btn--block">Book a call</BookCallButton>
            </div>
          </article>
          <article className="st-card st-card--between">
            <div className="st-card__icon"><img src="/assets/svg/contact-icon-brief.svg" alt="" width={67} height={64} /></div>
            <div className="st-card__text">
              <h2 className="st-h4">Send a brief</h2>
              <p className="st-body">Tell us the role, location, timeline. We come back within 24 hours.</p>
              <Button href="#brief" className="st-btn--block">Fill in the form</Button>
            </div>
          </article>
          <article className="st-card st-card--between">
            <div className="st-card__icon"><img src="/assets/svg/contact-icon-phone.svg" alt="" width={88} height={64} /></div>
            <div className="st-card__text">
              <h2 className="st-h4">Email or phone</h2>
              <p className="st-body st-cocontact">
                <a className="st-contact-link" href={`mailto:${CONTACT_EMAIL}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" fill="none" stroke="currentColor" /><path d="M2 4.5l6 4 6-4" fill="none" stroke="currentColor" /></svg>
                  <span>{CONTACT_EMAIL}</span>
                </a>
                <a className="st-contact-link" href={`tel:${CONTACT_PHONE_E164}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2.5h2.2l1.1 2.7-1.5 1.1a7.5 7.5 0 0 0 3.9 3.9l1.1-1.5 2.7 1.1V12a1.5 1.5 0 0 1-1.6 1.5A10.5 10.5 0 0 1 2.5 4.1 1.5 1.5 0 0 1 3 2.5Z" fill="none" stroke="currentColor" /></svg>
                  <span>{CONTACT_PHONE_DISPLAY}</span>
                </a>
              </p>
            </div>
          </article>
        </div>
      </PageHero>

      <section id="brief" className="st-band st-band--anchor" aria-labelledby="brief-title">
        <div className="st-inner st-band__inner">
          <div className="st-heading st-heading--center">
            <Eyebrow diamond>What you get</Eyebrow>
            <h2 id="brief-title" className="st-h2">Tell us what you need.</h2>
            <p className="st-body st-band__lede">For clients: role, location, timeline. For candidates: the kind of move you’re exploring. Everything is confidential.</p>
          </div>
          <div className="st-coform"><ContactForm /></div>
        </div>
      </section>
    </div>
  );
}
