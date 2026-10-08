/** Percentage ring used across the Figma candidate mockups: grey track + coloured arc + label. */
export function Ring({ size, pct, color, track = "#cccccc", stroke, fontSize, text }: { size: number; pct: number; color: string; track?: string; stroke: number; fontSize: number; text: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", transform: "rotate(-90deg)" }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={`${(pct / 100) * c} ${c}`} />
      </svg>
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", fontWeight: 600, fontSize, letterSpacing: "-0.01em", color, opacity: 0.8 }}>{text}</span>
    </div>
  );
}
