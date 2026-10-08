/**
 * Surface Talent lockup, drawn to the geometry of the master logo
 * (OUTPUTS/Logo Files/surface-talent-logo-horizontal.png): the plating-tank mark, SURFACE over
 * TALENT, tracked out to the master's measures. The tank outline and SURFACE take `currentColor`
 * so one component works on chalk and on anthracite; TALENT and the bath stay oxide copper and the
 * meniscus line is brushed nickel.
 */
export function Logo({ className = "", title = "Surface Talent" }: { className?: string; title?: string }) {
  return (
    <svg className={`st-logo ${className}`} viewBox="0 0 160 33" role="img" aria-label={title} focusable="false">
      <path d="M1.2 4 V24.2 Q1.2 29.6 6.6 29.6 H30.2 Q35.6 29.6 35.6 24.2 V4" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <rect x="4.2" y="10.6" width="28.4" height="14.6" rx="1" fill="var(--copper)" />
      <line x1="4.2" y1="10.3" x2="32.6" y2="10.3" stroke="var(--nickel)" strokeWidth="1" />
      <text x="48.3" y="14.4" textLength="110" lengthAdjust="spacing" fill="currentColor" className="st-logo__word" style={{ fontSize: 19.8 }}>SURFACE</text>
      <text x="48.1" y="31.9" textLength="79" lengthAdjust="spacing" fill="var(--copper)" className="st-logo__word" style={{ fontSize: 15.9 }}>TALENT</text>
    </svg>
  );
}
