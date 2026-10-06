"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useFooterMotion } from "@/lib/motion/scenes/useFooterMotion";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/site/nav";
import { BrLg } from "@/components/ui/BrLg";

const LOGOS = [
  { name: "Karas Plating", src: "/assets/img/footer-logo-karas.png", w: 88, h: 20.97, cw: 233.59 },
  { name: "RDM Engineering", src: "/assets/img/footer-logo-rdm.png", w: 30.17, h: 26.38, cw: 189.76 },
  { name: "United Anodisers", src: "/assets/img/footer-logo-ua.png", w: 72.97, h: 26.38, cw: 239.56 },
];
const EXPLORE = [["Clients", "/clients"], ["Candidates", "/candidates"], ["Jobs", "/jobs"], ["Disciplines", "/disciplines"], ["About", "/about"], ["Contact", "/contact"]];
const LEGAL = [["Privacy", "/privacy"], ["Candidate privacy", "/candidate-privacy"], ["Privacy requests", "/privacy-requests"], ["Cookies", "/cookies"], ["Terms", "/terms"], ["Accessibility", "/accessibility"], ["Modern slavery", "/modern-slavery"], ["Responsible AI", "/responsible-ai"]];
const CTAS = [
  { label: "Clients", text: "Retained or contingent. Permanent, contract or interim.", cta: "Start a search", href: "/clients" },
  { label: "Candidates", text: "Confidential. Every conversation with someone who knows the sector.", cta: "Submit your CV", href: "/candidates" },
  { label: "Live roles", text: "See open vacancies across UK surface engineering.", cta: "Browse jobs", href: "/jobs" },
];

/** Figma "Hero" 69:48765 — closing CTA + footer. */
export function Footer() {
  const root = useRef<HTMLElement>(null);
  useFooterMotion(root);
  const strip = [...LOGOS, ...LOGOS];
  return (
    <footer ref={root} className="st-footer" data-scene="footer">
      <div className="st-footer__orbclip" aria-hidden="true"><div className="st-footer__orb" /></div>
      <div className="st-footer__clients" aria-label="Clients we work with">
        <span className="st-footer__trusted">Trusted by operators</span>
        <div className="st-footer__marquee-mask">
          <div className="st-footer__marquee" data-marquee>
            {[0, 1].map((rep) => (
              <div key={rep} className="st-footer__marquee-run" aria-hidden={rep === 1}>
                {strip.map((l, i) => (
                  <div key={i} className="st-footer__logo" style={{ width: l.cw }}>
                    <img src={l.src} alt="" style={{ width: l.w, height: l.h }} /><span>{l.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="st-inner st-footer__inner">
        <div className="st-footer__cta" data-footer-cta>
          <span className="st-eyebrow st-eyebrow--light">The finished surface</span>
          <h2 className="st-h1 st-footer__title"><span style={{ color: "rgba(255,255,255,0.4)" }}>Find the person<BrLg />who changes</span><BrLg />the surface.</h2>
          <div className="st-btn-row">
            <Button href="/contact" tone="light">Brief us on a role</Button>
            <Button href="/candidates" tone="light" variant="secondary">Join our talent pool</Button>
          </div>
        </div>
        <div className="st-footer__cols">
          <div className="st-footer__brand">
            <img src="/assets/svg/footer-logo.svg" alt="" width={38.18} height={28} />
            <div>
              <div className="st-body" style={{ color: "#fff" }}>Surface Talent</div>
              <p className="st-body-xs" style={{ color: "#fff", opacity: 0.7, marginTop: 4, maxWidth: 271.82, fontSize: 12, lineHeight: "18px", letterSpacing: "-0.01em" }}>Specialist recruitment for the UK surface engineering and metal finishing sector. A sister company of the EMC Surface Technologies group.</p>
              <div className="st-footer__contact">
                <a className="st-contact-link" href={`mailto:${CONTACT_EMAIL}`}><span>{CONTACT_EMAIL}</span></a>
                <a className="st-contact-link" href={`tel:${CONTACT_PHONE_E164}`}><span>{CONTACT_PHONE_DISPLAY}</span></a>
              </div>
            </div>
          </div>
          <nav className="st-footer__explore" aria-label="Explore">
            <span className="st-footer__label">Explore</span>
            <ul>{EXPLORE.map(([l, h]) => <li key={h}><Link href={h} prefetch={false}>{l}</Link></li>)}</ul>
          </nav>
          <div className="st-footer__ctas">
            {CTAS.map((c) => (
              <div key={c.label} className="st-footer__ctablock">
                <div>
                  <span className="st-footer__label">{c.label}</span>
                  <p className="st-body-sm" style={{ color: "var(--text-inverse)", maxWidth: 240, marginTop: 6 }}>{c.text}</p>
                </div>
                <Button href={c.href} tone="light" variant="secondary">{c.cta}</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <nav className="st-footer__legal" aria-label="Legal">
        {LEGAL.map(([l, h]) => <Link key={h} href={h} prefetch={false}>{l}</Link>)}
      </nav>
      <div className="st-footer__base" aria-hidden="true" />
    </footer>
  );
}
