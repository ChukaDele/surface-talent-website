const barGrad = "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 100%)";

/** Step 1 — technical brief: stacked documents (Figma Frame 89). Motion: `[data-brief-line]` trace on activation. */
export function BriefIllustration() {
  const bar = (x: number, y: number, w: number) => <div data-brief-line style={{ position: "absolute", left: x, top: y, width: w, height: 21.6, borderRadius: 7.2, background: barGrad, opacity: 0.2 }} />;
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 175, top: 53.4, width: 144, height: 194.74, borderRadius: 16, background: "#283340", boxShadow: "inset 0 0 0 0.8px rgba(255,255,255,0.15)", transform: "rotate(9.37deg)", transformOrigin: "0 0" }} />
      <div style={{ position: "absolute", left: 110.24, top: 86.95, width: 144, height: 194.74, borderRadius: 16, background: "#283340", boxShadow: "inset 0 0 0 0.8px rgba(255,255,255,0.15)", transform: "rotate(-10.09deg)", transformOrigin: "0 0", opacity: 0.6 }} />
      <div data-brief-doc style={{ position: "absolute", left: 133.15, top: 62.78, width: 162, height: 200.7, transform: "rotate(-2.23deg)", transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#131e27", boxShadow: "inset 0 0 0 0.9px rgba(255,255,255,0.15)" }} />
        {bar(18.73, 61.18, 86.4)}{bar(19.85, 89.96, 126)}{bar(20.97, 118.74, 126)}{bar(22.09, 147.52, 72.47)}
        <span style={{ position: "absolute", left: 44.85, top: 13.22, fontFamily: "var(--font-body)", fontSize: 12, lineHeight: "18px", letterSpacing: "-0.01em", color: "#fff", whiteSpace: "nowrap" }}>Technical brief</span>
      </div>
    </div>
  );
}

function Tag({ label, on, w }: { label: string; on?: boolean; w?: number }) {
  return (
    <div data-tag={on ? "on" : "off"} style={{ width: w, flex: w ? "none" : 1, height: 28.6, borderRadius: 5.4, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", background: on ? "rgba(58,195,40,0.1)" : "rgba(255,255,255,0.04)", boxShadow: on ? "inset 0 0 0 0.9px rgba(58,195,40,0.7)" : "inset 0 0 0 0.9px rgba(255,255,255,0.11)", fontFamily: "var(--font-body)", fontSize: 10.8, lineHeight: "16px", letterSpacing: "-0.01em", color: "var(--text-inverse)" }}>
      <span style={{ opacity: 0.8 }}>{label}</span>
    </div>
  );
}

/** Step 2 — understand: process / standards tags (Figma Frame 90). */
export function UnderstandIllustration() {
  const label = { fontFamily: "var(--font-mono)", fontSize: 10.8, lineHeight: "14.4px", letterSpacing: 1.8, color: "var(--primary-500)", textTransform: "uppercase" as const };
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 123.66, top: 157.53, width: 175.68, height: 107.14, borderRadius: 10.37, background: "#283340", boxShadow: "inset 0 0 0 0.52px rgba(255,255,255,0.15)", opacity: 0.7 }} />
      <div style={{ position: "absolute", left: 101.7, top: 118.14, width: 219.6, height: 133.92, borderRadius: 12.96, background: "#283340", boxShadow: "inset 0 0 0 0.65px rgba(255,255,255,0.15)" }} />
      <div style={{ position: "absolute", left: 74.25, top: 74.4, width: 274.5, height: 167.4, borderRadius: 16.2, background: "#131e27", boxShadow: "inset 0 0 0 0.81px rgba(255,255,255,0.15)" }} />
      <div style={{ position: "absolute", left: 96.54, top: 96, width: 224.31, display: "flex", flexDirection: "column", gap: 8.1 }}>
        <div style={label}>Process</div>
        <div style={{ display: "flex", gap: 8.1 }}><Tag label="Electroplating" on w={108} /><Tag label="Anodising" w={108} /></div>
      </div>
      <div style={{ position: "absolute", left: 96.54, top: 159, width: 224.31, display: "flex", flexDirection: "column", gap: 8.1 }}>
        <div style={label}>Standards</div>
        <div style={{ display: "flex", gap: 8.1 }}><Tag label="NADCAP" on /><Tag label="AS9100" /><Tag label="ISO" /></div>
      </div>
    </div>
  );
}

/** Step 3 — search: shortlist cards with hire-rate rings (Figma Frame 91). */
export function SearchIllustration() {
  const mini = (x: number, pct: string) => (
    <div style={{ position: "absolute", left: x, top: 115.12, width: 105.3, height: 130.46, borderRadius: 11.7, background: "#131e27", boxShadow: "inset 0 0 0 0.585px rgba(255,255,255,0.15)" }}>
      {[[56.16, 12.62], [81.9, 31.34], [81.9, 50.06], [47.1, 68.78]].map(([w, y], i) => <div key={i} style={{ position: "absolute", left: 12.44, top: y, width: w, height: 14.04, borderRadius: 4.68, background: barGrad, opacity: 0.2 }} />)}
      <img src="/assets/svg/orangeShape.svg" alt="" style={{ position: "absolute", left: 12.44, top: 97.45, width: 42.82, height: 22.18 }} />
      <div data-hire-ring style={{ position: "absolute", left: 66.81, top: 91.17, width: 24.96, height: 24.96, transform: "rotate(6.83deg)", transformOrigin: "0 0" }}>
        <svg width="24.96" height="24.96" viewBox="0 0 24.96 24.96" style={{ display: "block", transform: "rotate(-90deg)" }}><circle cx="12.48" cy="12.48" r="11.63" stroke="rgba(255,255,255,0.2)" strokeWidth="1.7" fill="none" /><circle cx="12.48" cy="12.48" r="11.63" stroke="#1fc313" strokeWidth="1.7" fill="none" strokeDasharray={`${(parseInt(pct) / 100) * 73.07} 73.07`} /></svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 6.8, color: "#1fc313" }}>{pct}</span>
      </div>
    </div>
  );
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
      {mini(41, "92%")}
      <div style={{ position: "absolute", left: 159, top: 115.12, width: 105.3, height: 130.46, borderRadius: 11.7, background: "#283340", boxShadow: "inset 0 0 0 0.585px rgba(255,255,255,0.15)" }} />
      {mini(277, "86%")}
      <div style={{ position: "absolute", left: 135.5, top: 83, height: 40, padding: "10px 12px", borderRadius: 100, background: "#2c363e", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 7 }}>
        <img src="/assets/svg/search.svg" alt="" width={16} height={16} />
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, lineHeight: "18px", letterSpacing: "-0.01em", color: "var(--text-inverse)", opacity: 0.8, whiteSpace: "nowrap" }}>Coatings Engineer</span>
      </div>
    </div>
  );
}

export { AssessIllustration } from "./AssessIllustration";

/** Step 5 — place: aftercare calendar (Figma Frame 93). */
export function PlaceIllustration() {
  const dayStyle = { fontFamily: "var(--font-mono)", fontSize: 12.115, lineHeight: "16px", letterSpacing: "0.02em", color: "#fff", opacity: 0.7 } as const;
  const item = (x: number, y: number, w: number, dot: string, text: string) => (
    <div data-cal-item style={{ position: "absolute", left: x, top: y, width: w, height: 31, borderRadius: 3.59, background: "#384a58", boxShadow: "inset 0 0 0 0.9px rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 6, padding: "6px 7px", boxSizing: "border-box" }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: dot, flex: "none" }} /><span style={{ ...dayStyle, opacity: 1, whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -36, top: 49, width: 493, height: 28, background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={dayStyle}>AUGUST</span></div>
      <div style={{ position: "absolute", left: -36, top: 77, width: 493, height: 27, background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 10px", boxSizing: "border-box" }}>
        {["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"].map((d) => <span key={d} style={dayStyle}>{d}</span>)}
      </div>
      <div style={{ position: "absolute", left: -36, top: 104, width: 493, height: 188, background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", left: 10, top: 103.4, width: 400, height: 188.6, opacity: 0.3, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 1px, transparent 1px 43px)" }} />
      {item(89, 117, 182, "#2dc41b", "Onboarding check-ins")}
      {item(166, 154, 159, "#e25420", "Maintenance Call")}
      {item(110, 218, 159, "#c742f8", "Maintenance Call")}
      <div style={{ position: "absolute", left: 0, top: 0, width: 100, height: 323, background: "linear-gradient(90deg, #1c2730 0%, rgba(28,39,48,0) 100%)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, width: 100, height: 323, background: "linear-gradient(270deg, #1c2730 0%, rgba(28,39,48,0) 100%)" }} />
    </div>
  );
}
