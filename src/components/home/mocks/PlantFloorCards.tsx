const mono = { fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: "16px", letterSpacing: "0.02em", whiteSpace: "nowrap" as const };

/** Bath chemistry — six hex "molecules" with live readings (Figma Group 28). Motion drifts `[data-mol]`. */
export function ChemistryIllustration() {
  const hex = (src: string, x: number, y: number, label: string, value: string, lx: number, ly: number, red = false, key: string) => (
    <div key={key} data-mol style={{ position: "absolute", left: x, top: y, width: 72, height: 64, willChange: "transform" }}>
      <img src={src} alt="" width={72} height={64} style={{ position: "absolute", left: 0, top: 0, width: 72, height: 64 }} />
      <div style={{ position: "absolute", left: lx - x, top: ly - y, width: 30, height: 34, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ ...mono, color: red ? "#ff8a8a" : "#fff" }}>{label}</span>
        <span style={{ ...mono, color: red ? "#f64b4b" : "var(--ok)" }}>{value}</span>
      </div>
    </div>
  );
  return (
    <div className="st-mock" data-chemistry style={{ position: "absolute", left: 0, top: 0, width: 460, height: 160 }} aria-hidden="true">
      {hex("/assets/svg/hex16.svg", 69, 32.4, "TEMP", "54°C", 90, 48.4, false, "a")}
      {hex("/assets/svg/hex17.svg", 124.08, 64.4, "CYCLE", "6.5m", 145, 80.4, false, "b")}
      {hex("/assets/svg/hex18.svg", 180.08, 32.4, "pH", "4.2", 200, 51.4, false, "c")}
      {hex("/assets/svg/hex19.svg", 236.08, 0.4, "CURR.", "2.1A", 255, 17.4, false, "d")}
      {hex("/assets/svg/hex20red.svg", 236, 64.4, "CONC.", "18%", 257, 79.4, true, "e")}
      {hex("/assets/svg/hex21.svg", 320, 96.4, "PPM", "12", 341, 111.4, false, "f")}
    </div>
  );
}

/** Coating cells — four KPI columns (Figma Group 31). */
export function CellsIllustration() {
  const cols: [string, string][] = [["165", "units/hr"], ["98", "yield (%)"], ["21", "scrap (%)"], ["1-2m", "downtime"]];
  return (
    <div className="st-mock" style={{ position: "absolute", left: 42, top: 37.38, display: "flex", gap: 28 }} aria-hidden="true">
      {cols.map(([v, l]) => (
        <div key={l} style={{ width: 73.13, display: "flex", flexDirection: "column", alignItems: "center", gap: 11.25 }}>
          <div data-kpi style={{ fontFamily: "var(--font-heading)", fontSize: 36, lineHeight: "43px", color: "var(--text-inverse)", opacity: 0.8 }}>{v}</div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6.75 }}>
            <div style={{ height: 6.75, background: "#d9d9d9" }} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13.5, lineHeight: "18px", letterSpacing: "0.02em", color: "#fff", textAlign: "center", whiteSpace: "nowrap" }}>{l}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Standards & QA — accreditation marks (Figma image 6/7/8). */
export function StandardsIllustration() {
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: 460, height: 160 }}>
      <img src="/assets/img/standard-img6.png" alt="" style={{ position: "absolute", left: 0, top: 10.4, width: 139, height: 140 }} />
      <img src="/assets/img/standard-img7.png" alt="" style={{ position: "absolute", left: 161, top: 10.4, width: 139, height: 140 }} />
      <img src="/assets/img/standard-img8.png" alt="" style={{ position: "absolute", left: 322, top: 10.4, width: 139, height: 140 }} />
    </div>
  );
}

/** Plant operations — August maintenance calendar (Figma Frames 81/82/83/70). */
export function PlantOpsIllustration({ fade = "#1c2730" }: { fade?: string }) {
  const days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "24"];
  const dayStyle = { fontFamily: "var(--font-mono)", fontSize: 12.115, lineHeight: "16px", letterSpacing: "0.02em", color: "#fff", opacity: 0.7 } as const;
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: 460, height: 160, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -16, top: 0, width: 493, height: 28, background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={dayStyle}>AUGUST</span>
      </div>
      <div style={{ position: "absolute", left: -16, top: 28, width: 493, height: 27, background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 16, padding: "5px 10px", boxSizing: "border-box", marginLeft: -70 }}>
        {days.map((d) => <span key={d} style={dayStyle}>{d}</span>)}
      </div>
      <div style={{ position: "absolute", left: -16, top: 55, width: 493, height: 130, background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", left: 30, top: 54.4, width: 401, height: 119, opacity: 0.3, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 50px), linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,0))", backgroundBlendMode: "multiply", WebkitMaskImage: "linear-gradient(180deg, #000, transparent)", maskImage: "linear-gradient(180deg, #000, transparent)" }} />
      <div data-maint style={{ position: "absolute", left: 118, top: 88.97, width: 257, display: "flex", flexDirection: "column", gap: 7.18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, height: 18 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M18 1.83c-.78 0-1.56.3-2.12.88L14 4.59l-1.29-1.3L11.3 4.7l1.29 1.29L2 16.59V21h4.41L16.99 10.4l1.29 1.29 1.41-1.41-1.29-1.29 1.88-1.88c1.17-1.17 1.17-3.07 0-4.24-.58-.58-1.36-.88-2.13-.88zM5.59 19H4v-1.59l10.59-10.6 1.59 1.59L5.59 19z" /></svg>
          <span style={{ ...dayStyle, opacity: 1 }}>Maintenance Window</span>
        </div>
        <div style={{ position: "relative", width: 257, height: 16, borderRadius: 3.59, background: "#384a58", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 150, top: 0, width: 66.4, height: "100%", background: "#69313b", borderRadius: 3.59 }} />
        </div>
      </div>
      <span style={{ position: "absolute", left: 286.82, top: 133.85, ...dayStyle, opacity: 1 }}>Core</span>
      <div style={{ position: "absolute", left: 0, top: 0, width: 100, height: 160, background: `linear-gradient(90deg, ${fade} 0%, rgba(28,39,48,0) 100%)` }} />
      <div style={{ position: "absolute", right: 0, top: 0, width: 100, height: 160, background: `linear-gradient(270deg, ${fade} 0%, rgba(28,39,48,0) 100%)` }} />
    </div>
  );
}
