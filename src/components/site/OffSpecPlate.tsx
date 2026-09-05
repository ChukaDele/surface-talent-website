"use client";

/**
 * The illustration for the error pages: a coated panel that failed inspection.
 *
 * It is the same section language as the rest of the site, turned into a joke an operator would
 * get. A plate travels the line, the coating goes down unevenly, the inspection sweep passes over
 * it and the stamp lands: OFF SPEC. Nobody died, it just needs running again — which is exactly
 * the tone a 404 wants.
 *
 * Everything moves in CSS so there is no JavaScript cost on a page nobody meant to land on, and
 * the whole thing settles into a readable composed state under reduced motion.
 */
export function OffSpecPlate({ code = "404" }: { code?: string }) {
  return (
    <svg className="st-offspec" viewBox="0 0 460 300" role="img" aria-label={`Error ${code}. A coated panel that failed inspection.`}>
      <defs>
        <pattern id="st-offspec-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,0.26)" strokeWidth="1" />
        </pattern>
        <clipPath id="st-offspec-clip">
          <rect x="70" y="150" width="240" height="34" />
        </clipPath>
      </defs>

      {/* the line the plate is travelling on */}
      <line className="st-offspec__rail" x1="20" y1="212" x2="440" y2="212" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i} className="st-offspec__roller" style={{ animationDelay: `${i * -0.18}s`, transformOrigin: `${44 + i * 62}px 220px` }}>
          <circle cx={44 + i * 62} cy="220" r="7" />
          <line x1={44 + i * 62} y1="213" x2={44 + i * 62} y2="220" />
        </g>
      ))}

      {/* the panel: substrate with an uneven deposit on top */}
      <g className="st-offspec__plate">
        <rect x="70" y="184" width="240" height="22" fill="url(#st-offspec-hatch)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
        <g clipPath="url(#st-offspec-clip)">
          <path className="st-offspec__coat" d="M70 184 C 110 152, 140 178, 176 160 C 214 141, 246 180, 280 164 C 296 156, 304 168, 310 162 L310 184 Z" />
        </g>
        <rect x="70" y="150" width="240" height="56" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" strokeDasharray="3 4" />
      </g>

      {/* inspection head sweeping the panel */}
      <g className="st-offspec__probe">
        <line x1="0" y1="118" x2="0" y2="150" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <rect x="-13" y="100" width="26" height="20" rx="3" fill="#0d2233" stroke="var(--primary-500)" strokeWidth="1.2" />
        <circle cx="0" cy="152" r="2.6" fill="var(--primary-500)" />
      </g>

      {/* the verdict */}
      <g className="st-offspec__stamp">
        <rect x="-64" y="-19" width="128" height="38" rx="4" fill="none" stroke="#d15b4a" strokeWidth="2" />
        <text x="0" y="6" className="st-offspec__stampText">OFF SPEC</text>
      </g>

      <text className="st-offspec__code" x="20" y="52">{code}</text>
      <text className="st-offspec__tag" x="20" y="74">BATCH REJECTED AT INSPECTION</text>
    </svg>
  );
}
