import type { Profile } from "./ProfileCard";

/** Figma Clients hero start state (2027:20831) → resolved strip (2010:2 Frame 152). Coordinates in the 1440-wide hero frame, y from frame top (nav included). */
export const PROFILES: (Profile & { start: { x: number; y: number }; end: { x: number; y: number } })[] = [
  { key: "omar", name: "Omar Bator", role: "Furnace Technician", src: "/assets/img/people/omar.jpg", start: { x: -186, y: 91 }, end: { x: -296, y: 527 } },
  { key: "zain", name: "Zain George", role: "Paint Line Technician", src: "/assets/img/people/zain.jpg", start: { x: -40, y: 407 }, end: { x: -40, y: 527 } },
  { key: "kaylynn_e", name: "Kaylynn E. Bothman", role: "Plating Line Operator", src: "/assets/img/people/kaylynn_e.jpg", start: { x: 216, y: 527 }, end: { x: 216, y: 527 } },
  { key: "lincoln", name: "Lincoln Lubin", role: "Electroplating Technician", src: "/assets/img/people/lincoln.jpg", start: { x: 472, y: 607 }, end: { x: 472, y: 527 } },
  { key: "emery", name: "Emery George", role: "Process Chemist (Plating)", src: "/assets/img/people/emery.jpg", start: { x: 728, y: 607 }, end: { x: 728, y: 527 } },
  { key: "corey", name: "Corey Saris", role: "HVOF Operator", src: "/assets/img/people/corey.jpg", start: { x: 984, y: 527 }, end: { x: 984, y: 527 } },
  { key: "kaylynn_eb", name: "Kaylynn Ekstrom Bothman", role: "Pre-Treatment Line Technician", src: "/assets/img/people/kaylynn_eb.jpg", start: { x: 1240, y: 407 }, end: { x: 1240, y: 527 } },
  { key: "jakob", name: "Jakob Calzoni", role: "Plant Manager — Surface Finishing", src: "/assets/img/people/jakob.jpg", start: { x: 1386, y: 91 }, end: { x: 1496, y: 527 } },
];

export const DIFFERENCE = [
  { icon: "/assets/svg/clients-icon-operator.svg", iconW: 79, title: "Operator instinct", body: "A sister company of EMC Surface Technologies, a UK group that runs finishing plants. We recruit with an operator’s perspective." },
  { icon: "/assets/svg/clients-icon-fluency.svg", iconW: 81, title: "Technical fluency", body: "We know the chemistry, the kit, the standards and the economics. Briefs are sharper. Screening is tighter. Shortlists are smaller and better." },
  { icon: "/assets/svg/clients-icon-scope.svg", iconW: 88, title: "Full scope", body: "Permanent, contract and interim. Process and plant roles through to director-level appointments. Retained where the role warrants it." },
];

export const STEPS = [
  { n: "01 · Brief", title: "Technical brief", body: "Half a day on-site where it helps. We see the line, meet the team, understand the real role." },
  { n: "02 · Search", title: "Targeted search", body: "We map the market and approach the shortlist directly. Discreet. No job-board spray." },
  { n: "03 · Shortlist", title: "Two to three", body: "Candidates we’d stand behind. Not twenty half-fits." },
  { n: "04 · After", title: "Post-placement", body: "We stay close through offer, onboarding and first 90 days. Rebate protection backs the shortlist." },
];

export const RECRUIT = [
  { title: "Process and production engineering", body: "Cycle times, bath control, fixturing, yield, throughput." },
  { title: "Quality, CI and technical assurance", body: "NADCAP, AS9100, ISO 9001. LEAN, Six Sigma and OEE-driven plant improvement. Quality leads, auditors and CI managers." },
  { title: "EHS and compliance", body: "EHS advisors, SHEQ managers, environmental and regulatory leads." },
  { title: "Maintenance, reliability and controls", body: "Mechanical, electrical, PLC, SCADA, automation." },
  { title: "Technical sales and business development", body: "Commercial hires who hold technical conversations and close orders." },
  { title: "Leadership and directors", body: "MDs, GMs, ops and technical directors. Retained or contingent, handled with discretion." },
];
