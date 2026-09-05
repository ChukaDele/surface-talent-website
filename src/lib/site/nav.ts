/** Primary navigation — one source for header, footer and route metadata. */
export const NAV = [
  { label: "Clients", href: "/clients" },
  { label: "Candidates", href: "/candidates" },
  { label: "Disciplines", href: "/disciplines" },
  { label: "Jobs", href: "/jobs" },
  { label: "About", href: "/about" },
] as const;

/**
 * Booking: the owner's Google Calendar appointment schedule. `BOOKING_URL` is the short link (used
 * as the href of every booking CTA, so it still works without JavaScript and an agent can follow
 * it); `BOOKING_EMBED_URL` is the same schedule in Google's supported website-embed form (`gv=true`),
 * which the on-site modal loads in an iframe.
 */
export const BOOKING_URL = "https://calendar.app.google/Wdm9xHVcBNwS2VuS7";
export const BOOKING_EMBED_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3slVgLYRCjR45g5mJP1cmLSQIq6BE9QD9RtC4uhzlG955Wf4RWxtFw3PB32NNVi2-9D5StrUkq?gv=true";

/** Canonical contact details (source: the Surface Talent site's own contact and legal pages). */
export const CONTACT_EMAIL = "hello@surfacetalent.co.uk";
export const CONTACT_PHONE_DISPLAY = "+44 7798 673 654";
export const CONTACT_PHONE_E164 = "+447798673654";

/** Canonical production origin — used for canonical URLs, sitemap and structured data. */
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://surfacetalent.co.uk";
