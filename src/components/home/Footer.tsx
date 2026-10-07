import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/site/Logo";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164, CONTACT_WHATSAPP_URL } from "@/lib/site/nav";

const EXPLORE = [["Clients", "/clients"], ["Candidates", "/candidates"], ["Disciplines", "/disciplines"], ["Jobs", "/jobs"], ["About", "/about"], ["Contact", "/contact"]];
const ROUTES = [
  ["Send a role brief", "/contact#brief"],
  ["Register your CV", "/candidates#register"],
  ["Browse live roles", "/jobs"],
];
const LEGAL = [["Privacy", "/privacy"], ["Candidate privacy", "/candidate-privacy"], ["Privacy requests", "/privacy-requests"], ["Cookies", "/cookies"], ["Terms", "/terms"], ["Accessibility", "/accessibility"], ["Modern slavery", "/modern-slavery"], ["Responsible AI", "/responsible-ai"]];

/**
 * Closing CTA + footer (October 2026 brand pass): anthracite, on the page grid, hairline rules.
 * The decorative orb and boxed CTA blocks are gone.
 */
export function Footer() {
  return (
    <footer className="st-footer" data-scene="footer">
      <div className="st-wrap st-foot__cta" data-footer-cta>
        <div className="st-foot__cta-head">
          <span className="st-eyebrow">Start a conversation</span>
          <h2 className="st-h2 st-foot__title">Make the hire you won’t have to make twice.</h2>
        </div>
        <div className="st-foot__cta-side">
          <p className="st-body-lg">Hiring for a senior or critical role, or quietly open to the right move. Every conversation is confidential.</p>
          <div className="st-btn-row">
            <Button href="/contact#brief" tone="light">Brief us on a role</Button>
            <Button href="/candidates" tone="light" variant="secondary">Register in confidence</Button>
          </div>
        </div>
      </div>

      <div className="st-wrap st-foot__cols">
        <div className="st-footer__brand st-foot__brand">
          <Link href="/" prefetch={false} className="st-foot__logo" aria-label="Surface Talent home"><Logo /></Link>
          <p className="st-body-sm">Specialist recruitment for the UK surface engineering and metal finishing sector. Founded by people who own and run UK finishing plants.</p>
        </div>
        <nav className="st-foot__col" aria-label="Explore">
          <span className="st-foot__label">Explore</span>
          <ul>{EXPLORE.map(([l, h]) => <li key={h}><Link href={h} prefetch={false}>{l}</Link></li>)}</ul>
        </nav>
        <nav className="st-foot__col" aria-label="Get started">
          <span className="st-foot__label">Get started</span>
          <ul>{ROUTES.map(([l, h]) => <li key={l}><Link href={h} prefetch={false}>{l}</Link></li>)}</ul>
        </nav>
        <div className="st-foot__col st-foot__contact">
          <span className="st-foot__label">Contact</span>
          <ul>
            <li><a className="st-contact-link" href={`mailto:${CONTACT_EMAIL}`}><span>{CONTACT_EMAIL}</span></a></li>
            <li><a className="st-contact-link" href={`tel:${CONTACT_PHONE_E164}`}><span>{CONTACT_PHONE_DISPLAY}</span></a></li>
            <li><a className="st-contact-link" href={CONTACT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><span className="sr-only"> (opens WhatsApp)</span></a></li>
          </ul>
          <address className="st-foot__address">67C King Street<br />Knutsford WA16 6DX</address>
        </div>
      </div>

      <div className="st-wrap st-foot__base">
        <p className="st-foot__reg">© 2026 Surface Talent Ltd. Registered in England and Wales, no. 17497267. Registered office: 67C King Street, Knutsford WA16 6DX.</p>
        <nav className="st-footer__legal st-foot__legal" aria-label="Legal">
          {LEGAL.map(([l, h]) => <Link key={h} href={h} prefetch={false}>{l}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
