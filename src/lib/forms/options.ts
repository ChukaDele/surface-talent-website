/** Option sets shared by the candidate and contact forms. Disciplines mirror the Disciplines page. */
export const DISCIPLINES = [
  "Electroplating and electrolytic processes", "Anodising and conversion coatings", "Powder coating and industrial coatings", "Heat treatment",
  "Thermal spray and hardfacing", "PVD, CVD and advanced deposition", "Electroless plating", "Galvanising", "Metal polishing and finishing",
  "Industrial cleaning and pre-treatment", "Blasting and shot peening", "PCB and electronics finishing", "Weld overlay and cladding", "Plating on plastics",
  "Leadership and commercial", "Other / not sure",
].map((d) => ({ value: d, label: d }));

export const EMPLOYMENT_TYPES = [
  { value: "Permanent", label: "Permanent" }, { value: "Contract", label: "Contract" }, { value: "Interim", label: "Interim" },
];
export const AVAILABILITY = [
  { value: "Available now", label: "Available now" }, { value: "1 month notice", label: "1 month notice" }, { value: "3 months notice", label: "3 months notice" }, { value: "Just exploring", label: "Just exploring" },
];
export const RIGHT_TO_WORK = [
  { value: "Yes - UK right to work", label: "Yes, I have the right to work in the UK" }, { value: "Needs sponsorship", label: "I'd need visa sponsorship" }, { value: "Prefer to discuss", label: "Prefer to discuss" },
];
export const EXPERIENCE = [
  { value: "0-2 years", label: "0–2 years" }, { value: "3-5 years", label: "3–5 years" }, { value: "6-10 years", label: "6–10 years" }, { value: "10+ years", label: "10+ years" },
];
export const ENQUIRY_TYPES = [
  { value: "hiring", label: "I'm hiring" }, { value: "career_move", label: "I'm considering a move" }, { value: "general", label: "General enquiry" },
];
export const HIRES = [
  { value: "1", label: "One role" }, { value: "2-3", label: "Two or three roles" }, { value: "4+", label: "Four or more" }, { value: "Ongoing", label: "Ongoing / volume" },
];
export const TIMELINES = [
  { value: "Urgent - this month", label: "Urgent, this month" }, { value: "Next 1-3 months", label: "Next one to three months" }, { value: "Planning ahead", label: "Planning ahead" },
];
export const HIRE_EMPLOYMENT = [
  { value: "Permanent", label: "Permanent" }, { value: "Contract", label: "Contract" }, { value: "Interim", label: "Interim" }, { value: "Not sure yet", label: "Not sure yet" },
];
