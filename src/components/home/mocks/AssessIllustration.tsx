/**
 * Step 4 — assess: three tilted candidate cards with verdict badges (Figma Frame 92 → Group 47).
 * Built from the node geometry (Figma rotates counter-clockwise about the top-left origin).
 */
const grad = "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 100%)";
type Card = { rect: [number, number, number]; avatar: [number, number, number]; bars: [number, number, number][]; badge: [number, number, "ok" | "no"] };
const CARDS: Card[] = [
  { rect: [257.08, 73.68, -6.98], avatar: [271.85, 86.79, -9.21], bars: [[261.41, 140.51, 69.12], [258.61, 163.38, 100.8], [255.81, 186.25, 100.8]], badge: [351, 101, "ok"] },
  { rect: [44.42, 91.87, 8.85], avatar: [62.21, 100.46, 6.62], bars: [[66.82, 154.98, 69.12], [70.37, 177.74, 100.8], [73.91, 200.51, 100.8]], badge: [144, 88, "no"] },
  { rect: [145.1, 111.36, -0.74], avatar: [157.85, 125.35, 0], bars: [[156.15, 180.04, 69.12], [157.05, 203.06, 100.8], [157.95, 226.09, 100.8]], badge: [239, 126, "ok"] },
];
const rot = (r: number) => ({ transform: `rotate(${-r}deg)`, transformOrigin: "0 0" as const });

function Badge({ kind }: { kind: "ok" | "no" }) {
  return (
    <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {kind === "ok" ? (
        <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true"><circle cx="7.5" cy="7.5" r="7.5" fill="#3ac328" /><path d="M4.3 7.8l2.1 2.1 4.3-4.9" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg width="17.5" height="17.5" viewBox="0 0 17.5 17.5" aria-hidden="true"><circle cx="8.75" cy="8.75" r="8.75" fill="#da1f1f" /><path d="M5.4 5.4l6.7 6.7M12.1 5.4l-6.7 6.7" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" /></svg>
      )}
    </div>
  );
}

export function AssessIllustration() {
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
      {CARDS.map((c, i) => (
        <div key={i}>
          <div style={{ position: "absolute", left: c.rect[0], top: c.rect[1], width: 129.6, height: 152.96, borderRadius: 14.4, background: "#131e27", boxShadow: "inset 0 0 0 0.72px rgba(255,255,255,0.15)", ...rot(c.rect[2]) }} />
          <div style={{ position: "absolute", left: c.avatar[0], top: c.avatar[1], width: 44.8, height: 44.8, borderRadius: 11.2, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", ...rot(c.avatar[2]) }}>
            <svg width="25.6" height="25.6" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id={`ug${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0.5" /></linearGradient></defs><path fill={`url(#ug${i})`} d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8.4 9.6c.6-4.2 4.1-7.1 8.4-7.1s7.8 2.9 8.4 7.1c.1.8-.5 1.4-1.3 1.4H4.9c-.8 0-1.4-.6-1.3-1.4Z" /></svg>
          </div>
          {c.bars.map(([x, y, w], k) => <div key={k} style={{ position: "absolute", left: x, top: y, width: w, height: 17.28, borderRadius: 5.76, background: grad, opacity: 0.2, ...rot(c.rect[2] === -0.74 ? 2.23 : c.rect[2]) }} />)}
          <div style={{ position: "absolute", left: c.badge[0], top: c.badge[1] }}><Badge kind={c.badge[2]} /></div>
        </div>
      ))}
    </div>
  );
}
