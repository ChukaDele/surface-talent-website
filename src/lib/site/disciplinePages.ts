/**
 * Discipline landing pages. Each one exists because the process has its own chemistry, kit,
 * standards, talent pool AND its own search demand — the content is Surface Talent's own sector
 * knowledge, written to be useful to an employer or a candidate first.
 *
 * Deliberately NOT built: industrial cleaning and pre-treatment. The keyword research
 * (docs/seo/keyword-research.md §5) found it is buyer-side process jargon with no candidate search
 * behind it — the queries resolve to shot blasting operative work, which sits outside the
 * engineer-to-director positioning. It stays on the /disciplines overview instead of becoming a
 * page with nothing to answer.
 */
export type DisciplinePage = {
  slug: string;
  /** matches the icon key in src/components/pages/disciplines/icons.tsx */
  icon: string;
  title: string;
  h1: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  process: { heading: string; body: string[] };
  roles: { title: string; body: string }[];
  standards: string[];
  challenges: { title: string; body: string }[];
  related: string[];
};

export const DISCIPLINE_PAGES: DisciplinePage[] = [
  {
    slug: "electroplating",
    icon: "disc01",
    title: "Electroplating",
    h1: "Electroplating recruitment",
    eyebrow: "01 · Electroplating and aqueous electrolytic processes",
    metaTitle: "Electroplating Jobs and Recruitment — Surface Talent",
    metaDescription: "Zinc, nickel, hard chrome, precious metals — rack and barrel. We recruit platers, process chemists, line supervisors and plating managers UK-wide.",
    intro: [
      "Electroplating is the widest lane in UK surface engineering and the one where a generalist shortlist goes wrong fastest. A zinc barrel line, a decorative nickel-chrome rack shop and a hard chrome facility running hydraulic rods share a name and very little else.",
      "We recruit across all of them, because we can tell the difference in a conversation rather than after a failed probation.",
    ],
    process: {
      heading: "What the work actually involves",
      body: [
        "Zinc, zinc-nickel, nickel, copper, tin, silver, gold and alloy deposits, laid down on rack or in barrel. Hard chrome on hydraulic rods, print rollers, landing gear components and precision shafts, usually with grinding and dimensional control either side of the plating cell.",
        "The people who run these lines think in current density, throwing power, bath make-up, brightener additions, rectifier condition, jig design, rinse-water balance and effluent limits. Cycle time and first-pass yield are decided long before the part reaches the tank.",
        "Sector context matters as much as process. Aerospace and defence plating carries approval regimes and paperwork that a general industrial jobbing shop never touches; automotive volumes bring throughput and PPAP pressure a specialist aerospace shop would find alien.",
      ],
    },
    roles: [
      { title: "Process engineers and plating chemists", body: "Bath control, deposit specification, troubleshooting adhesion, blistering and thickness distribution, and taking new work from sample to production." },
      { title: "Line supervisors and team leaders", body: "Running the shift: loading strategy, jig availability, rectifier and pump condition, rework decisions and getting the day's tonnage out to specification." },
      { title: "Quality managers and auditors", body: "Thickness and adhesion testing, salt spray programmes, customer concessions, approvals maintenance and audit readiness." },
      { title: "Operations and plant leadership", body: "Multi-line responsibility, capital planning, effluent and permitting, capacity and margin across a plating business." },
      { title: "Technical sales and business development", body: "Commercial people who can quote a plating job properly because they understand jig counts, cycle times and the real cost of rework." },
    ],
    standards: ["NADCAP chemical processing", "AS9100", "ISO 9001", "IATF 16949", "ISO 14001 and environmental permitting", "REACH and hexavalent chromium substitution", "Def Stan and customer-specific approvals"],
    challenges: [
      { title: "Chrome substitution changes the skill profile", body: "Shops moving off hexavalent chemistry need people who have actually run trivalent or alternative deposits at production volume, not just read about them." },
      { title: "The knowledge sits with a small number of people", body: "Plating expertise is concentrated in operators and chemists who have been in the sector for decades. Replacing one is a market-mapping exercise, not an advert." },
      { title: "Approvals travel with the plant, not the CV", body: "A quality lead who held a NADCAP approval at a competitor is a different proposition from someone who supported one. We check which it is." },
    ],
    related: ["anodising", "thermal-spray"],
  },
  {
    slug: "anodising",
    icon: "disc02",
    title: "Anodising",
    h1: "Anodising and conversion coating recruitment",
    eyebrow: "02 · Aluminium and multi-metal",
    metaTitle: "Anodising Jobs and Recruitment — Surface Talent",
    metaDescription: "Sulphuric, chromic, hard and architectural anodising. We recruit line technicians, quality leads and plant managers for UK anodisers and finishers.",
    intro: [
      "Anodising looks like one process and behaves like four. Architectural work lives or dies on colour consistency and Qualanod paperwork; hard anodising is a dimensional discipline; aerospace anodising is an approvals discipline; conversion coating is chemistry that has to keep pace with regulation.",
      "We recruit for anodisers who need someone who already knows which of those businesses they are in.",
    ],
    process: {
      heading: "What the work actually involves",
      body: [
        "Sulphuric, chromic, hard and architectural anodising, with dyeing, sealing and the etch and desmut stages in front of them. Chromate and trivalent conversion coatings, phosphating and passivation across aluminium and multi-metal work.",
        "Day to day this is racking strategy, current ramp, bath temperature and free-acid control, seal quality, colour matching between batches, and the constant argument between coating thickness and dimensional tolerance on machined parts.",
        "Regulatory pressure is the defining feature of the last decade. Moving customers off hexavalent chromate onto trivalent alternatives without losing salt-spray performance is a real technical project, and the people who have delivered it are in demand.",
      ],
    },
    roles: [
      { title: "Anodising process engineers", body: "Bath chemistry, cycle development, seal quality, colour control, and qualifying new alloys and geometries into an existing line." },
      { title: "Production and line managers", body: "Throughput across etch, anodise, colour and seal, with the jig and rack planning that decides whether the day runs." },
      { title: "Quality and technical leads", body: "Qualanod and Qualicoat compliance, aerospace approvals, coating thickness and seal testing, customer concessions and audit response." },
      { title: "Laboratory and chemistry specialists", body: "Analysis, titrations, bath maintenance schedules and the trivalent conversion work that regulation keeps pushing forward." },
      { title: "Commercial and account management", body: "Estimating and specification work for architectural, aerospace and general industrial customers." },
    ],
    standards: ["Qualanod", "Qualicoat", "BS EN ISO 7599", "AS9100 and NADCAP chemical processing", "ISO 9001", "REACH authorisation for chromates"],
    challenges: [
      { title: "Architectural and aerospace are different markets", body: "Guarantee periods, colour tolerance and inspection culture differ sharply. A strong architectural quality lead is not automatically an aerospace quality lead." },
      { title: "Trivalent conversion experience is scarce", body: "Genuine production experience of trivalent systems, rather than trial work, is the single most requested capability we are briefed on in this lane." },
      { title: "Seal failures are expensive and political", body: "Businesses want someone who has diagnosed a seal problem under commercial pressure, not someone who will start learning on their customers." },
    ],
    related: ["electroplating", "powder-coating", "pre-treatment"],
  },
  {
    slug: "powder-coating",
    icon: "disc03",
    title: "Powder coating",
    h1: "Powder coating and industrial coatings recruitment",
    eyebrow: "03 · Powder coating, wet paint and industrial coatings",
    metaTitle: "Powder Coating Jobs and Recruitment — Surface Talent",
    metaDescription: "Architectural and industrial powder coating to Qualicoat and BS EN standards. We recruit supervisors, quality leads, production and plant managers.",
    intro: [
      "Powder coating businesses fail on two things: pre-treatment they did not control, and first-pass yield they never measured. The hires that fix both are production and quality people who have run a line themselves.",
      "We recruit across architectural coaters working to Qualicoat, high-performance industrial coaters, and contract finishers combining powder with wet paint systems.",
    ],
    process: {
      heading: "What the work actually involves",
      body: [
        "Pre-treatment, application and cure. In practice that means chemical or mechanical preparation, powder or wet application by manual and automatic guns, oven profiling, film build control, and colour and gloss matching against a standard the customer will hold you to.",
        "The commercial reality is throughput per line hour against reject rate. Fast colour changes, powder reclaim, hook and jig design, oven loading and the discipline to stop the line rather than coat over a pre-treatment failure are what separate profitable coaters from busy ones.",
        "Architectural work adds Qualicoat and BS EN standards, guarantee periods and approved-applicator status. Industrial and high-performance work adds specification reading, multi-coat systems and substrate variety.",
      ],
    },
    roles: [
      { title: "Production and plant managers", body: "Line throughput, labour planning, colour change strategy, oven and booth performance, and reject reduction." },
      { title: "Quality leads and technical managers", body: "Film build, adhesion and cure verification, Qualicoat compliance, approved-applicator maintenance and customer complaint resolution." },
      { title: "Applicators and line supervisors", body: "Skilled spray and automatic-line people who understand faraday cage effects, reclaim and consistent finish across complex geometry." },
      { title: "Business development managers", body: "Commercial hires who can read a coating specification and quote work that is actually profitable." },
      { title: "Directors and general managers", body: "Site and group leadership across architectural, industrial and coating equipment businesses." },
    ],
    standards: ["Qualicoat", "BS EN 12206 and BS EN 13438", "ISO 12944 for protective coatings", "ISO 9001", "Approved applicator schemes for major powder houses"],
    challenges: [
      { title: "Pre-treatment ownership is often nobody's job", body: "Coating defects usually start upstream. Businesses need someone whose remit explicitly covers the pre-treatment line, not just the booth." },
      { title: "Colour and gloss disputes need technical authority", body: "The right quality hire can hold a position with a customer on measurement rather than opinion." },
      { title: "Volume coaters and specification coaters need different people", body: "One optimises changeovers; the other reads specifications. We brief for the one you actually are." },
    ],
    related: ["anodising", "electroplating"],
  },
  {
    slug: "heat-treatment",
    icon: "disc04",
    title: "Heat treatment",
    h1: "Heat treatment recruitment",
    eyebrow: "04 · Heat treatment and thermochemical diffusion",
    metaTitle: "Heat Treatment Jobs and Recruitment — Surface Talent",
    metaDescription: "Carburising, nitriding, vacuum, atmosphere and induction. We recruit metallurgists, furnace managers, process engineers and quality professionals.",
    intro: [
      "Heat treatment is a metallurgy business wearing a production business's clothes. The people who run it well can read a micrograph and a capacity plan in the same afternoon.",
      "We recruit for commercial heat treaters and for captive in-house facilities inside aerospace, automotive, energy and precision engineering groups.",
    ],
    process: {
      heading: "What the work actually involves",
      body: [
        "Case hardening and carburising, nitriding and ferritic nitrocarburising, vacuum and atmosphere hardening, induction hardening, solution treatment and ageing, stress relieving and tempering.",
        "The controlling variables are furnace atmosphere and carbon potential, load design and thermocouple placement, quench severity and distortion, and the sheer thermal inertia of a plant where a mistake is discovered hours later.",
        "Verification is metallurgical: hardness traverses, case depth, microstructure, retained austenite and distortion measurement. AMS 2750 pyrometry compliance sits over the whole operation in aerospace work and is a genuine specialism in its own right.",
      ],
    },
    roles: [
      { title: "Metallurgists and materials engineers", body: "Specification interpretation, failure investigation, cycle development and the metallurgical case behind a customer conversation." },
      { title: "Process and furnace engineers", body: "Cycle optimisation, atmosphere and carbon potential control, load design, distortion reduction and furnace commissioning." },
      { title: "Furnace and production managers", body: "Load scheduling across mixed customer work, energy cost, maintenance planning and on-time delivery." },
      { title: "Quality professionals and pyrometry specialists", body: "AMS 2750 compliance, TUS and SAT programmes, NADCAP audit ownership and laboratory oversight." },
      { title: "Commercial and site leadership", body: "General management of commercial heat treatment sites, plus capital and capacity decisions." },
    ],
    standards: ["AMS 2750 pyrometry", "NADCAP heat treating", "AS9100", "CQI-9 for automotive", "ISO 9001", "Customer-specific approvals for aerospace primes"],
    challenges: [
      { title: "Pyrometry competence is the bottleneck", body: "Plenty of candidates have worked near AMS 2750. Far fewer have owned a TUS programme and passed an audit on it." },
      { title: "Distortion problems are cross-functional", body: "Solving them needs someone credible with the customer's design engineers as well as with the shop floor." },
      { title: "Captive and commercial cultures differ", body: "Moving from an in-house facility to a multi-customer commercial heat treater is a real adjustment, and worth testing at shortlist stage." },
    ],
    related: ["thermal-spray", "electroplating", "pre-treatment"],
  },
  {
    slug: "thermal-spray",
    icon: "disc05",
    title: "Thermal spray",
    h1: "Thermal spray and hardfacing recruitment",
    eyebrow: "05 · Thermal spray and hardfacing",
    metaTitle: "Thermal Spray and HVOF Jobs — Surface Talent",
    metaDescription: "HVOF, plasma, arc and flame spray for aerospace, gas turbine and energy. We recruit coating engineers, operators and commercial leads across the UK.",
    intro: [
      "Thermal spray is a small, technical talent pool where reputations are known. It is also the lane where the wrong hire is most visible, because coating quality is measured under a microscope and paid for in aerospace parts.",
      "We recruit for specialist sprayers, in-house coating facilities and equipment and powder suppliers.",
    ],
    process: {
      heading: "What the work actually involves",
      body: [
        "HVOF, plasma, arc and flame spray, plus weld-based hardfacing. Applications run from wear and corrosion protection to dimensional restoration of high-value components in aerospace, power generation, oil and gas and heavy industry.",
        "The craft is in the parameters and the preparation: grit blast profile, standoff and traverse, powder chemistry and particle size, gun condition, masking, and the grinding or finishing that follows. Coating quality is judged on porosity, oxide content, bond strength and microhardness from a sectioned coupon.",
        "Almost all serious work sits inside an approval regime, and robot programming has become a standard expectation rather than a specialism.",
      ],
    },
    roles: [
      { title: "Coating and process engineers", body: "Parameter development, coupon qualification, fixturing and robot programming, and taking a new coating from trial to approved production." },
      { title: "HVOF and plasma operators", body: "Skilled spray operators who understand preparation, gun condition and consistency across a batch." },
      { title: "Development chemists and materials specialists", body: "Powder and wire selection, coating characterisation and failure analysis." },
      { title: "Quality and approvals leads", body: "NADCAP coatings, customer approvals, metallurgical laboratory oversight and audit ownership." },
      { title: "Commercial and technical sales", body: "People who can qualify an application and price restoration work realistically." },
    ],
    standards: ["NADCAP coatings", "AS9100", "ISO 9001", "Customer approvals from aerospace and energy primes", "ISO 14917 terminology and process classification"],
    challenges: [
      { title: "The pool is small and everyone knows everyone", body: "Direct, discreet approaches are the only sensible route. Advertising this lane mostly produces noise." },
      { title: "Approval-bearing experience is the differentiator", body: "Spray hours are common; qualifying a coating under a customer approval is not." },
      { title: "Robotics has raised the entry bar", body: "Manual-only operators need a development plan, and businesses should decide up front whether they will fund one." },
    ],
    related: ["heat-treatment", "electroplating", "pre-treatment"],
  },
];

export const DISCIPLINE_SLUGS = DISCIPLINE_PAGES.map((d) => d.slug);
