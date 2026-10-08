"use client";

import { useEffect } from "react";
import { OffSpecPlate } from "@/components/site/OffSpecPlate";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CONTACT_EMAIL } from "@/lib/site/nav";
import "@/styles/home.css";
import "@/styles/site.css";
import "@/styles/pages/error.css";
import "@/styles/mobile.css";

/**
 * The unexpected-failure page. Deliberately self-contained: if something broke badly enough to get
 * here, this page must not depend on the header, the footer or the motion system to render.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[surface-talent] unhandled error", error); }, [error]);
  return (
    <main className="st-err">
      <div className="st-err__inner">
        <div className="st-err__copy">
          <Eyebrow tone="muted">Error 500</Eyebrow>
          <h1 className="st-h1">Something went wrong at our end.</h1>
          <p className="st-body-lg">
            Not your doing. Try again, and if it keeps happening tell us what you were doing and we
            will fix it.
          </p>
          <div className="st-btn-row">
            <button type="button" className="st-btn st-btn--primary" onClick={reset}><span className="st-btn__label">Try again</span></button>
            <a className="st-btn st-btn--secondary" href={`mailto:${CONTACT_EMAIL}`}><span className="st-btn__label">Email us</span></a>
          </div>
          {error.digest ? <p className="st-body-sm" style={{ opacity: 0.6 }}>Reference {error.digest}</p> : null}
        </div>
        <OffSpecPlate code="500" />
      </div>
    </main>
  );
}
