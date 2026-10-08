import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BookCallButton } from "@/components/ui/BookCallButton";

/** Clients hero (October 2026): typographic only. The animated candidate gallery was retired. */
export function ClientsHero() {
  return (
    <section className="st-chero st-chero--quiet" aria-labelledby="page-title">
      <div className="st-chero__copy">
        <Eyebrow>For clients</Eyebrow>
        <h1 id="page-title" className="st-h1">Hire people who can actually run the process.</h1>
        <p className="st-body">A plant manager who understands bath chemistry. A quality lead who can hold a NADCAP audit. A commercial director who can open tier-one aerospace accounts. We find them because we have hired them ourselves.</p>
        <div className="st-btn-row">
          <Button href="/contact#brief">Brief us on a role</Button>
          <BookCallButton variant="secondary" tone="copper">Book a call</BookCallButton>
        </div>
      </div>
    </section>
  );
}
