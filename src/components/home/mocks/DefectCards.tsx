const ink = "var(--ink)";

function Bars({ widths, h = 24, r = 8, gap = 8 }: { widths: number[]; h?: number; r?: number; gap?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {widths.map((w, i) => <div key={i} style={{ width: w, height: h, borderRadius: r, background: "#d9d9d9" }} />)}
    </div>
  );
}

/** CV card used twice in Defect 01 (Figma Frame 41 / Frame 40): 463.5 wide, radius 16, 2px #e9e9e9. */
function CvCard({ left, top, rot, avatar, name, role, bars, stamp }: { left: number; top: number; rot: number; avatar?: string; name: string; role: string; bars: number[]; stamp?: boolean }) {
  const label = { fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 18, lineHeight: "27px", letterSpacing: "-0.01em", color: ink, opacity: 0.6 } as const;
  return (
    <div style={{ position: "absolute", left, top, width: 463.5, transform: `rotate(${-rot}deg)`, transformOrigin: "0 0", background: "#fff", borderRadius: 16, boxShadow: "0 0 0 2px #e9e9e9", boxSizing: "border-box", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {avatar ? <img src={avatar} alt="" width={66} height={66} style={{ width: 66, height: 66, borderRadius: 33, display: "block" }} /> : <div style={{ width: 66, height: 66, borderRadius: 33, background: "#c4c4c4" }} />}
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 24, lineHeight: "40px", letterSpacing: "-0.02em", color: ink, opacity: 0.8, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: "27px", letterSpacing: "-0.01em", color: ink, opacity: 0.8, whiteSpace: "nowrap" }}>{role}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><div style={label}>Summary Profile</div><Bars widths={bars} /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><div style={label}>Work Experience</div><div style={{ height: 120 }} /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><div style={label}>Professional Qualifications</div><div style={{ height: 120 }} /></div>
      {stamp ? <img src="/assets/img/stamp-s06-group.png" alt="" style={{ position: "absolute", left: 233, top: 212, width: 190.66, height: 187.19 }} /> : null}
    </div>
  );
}

/** Defect 01 illustration (inside the 600 × 620 card). */
export function Defect01Illustration() {
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <CvCard left={76.77} top={268.8} rot={6.62} name="Thomas Atkinson" role="Quality Assurance Coordinator" bars={[415.5, 279.72]} />
      <CvCard left={203.17} top={207.09} rot={-1.06} avatar="/assets/img/avatar-56_8634.png" name="Avery Collins" role="Quality Assurance Coordinator" bars={[415.5, 279.72, 330.76]} stamp />
      <div style={{ position: "absolute", left: 19.93, top: 375.26, width: 150, height: 150 }}>
        <img src="/assets/img/stamp-rejected.png" alt="" style={{ position: "absolute", left: 15.59, top: 0, width: 135.31, height: 135.31, transform: "rotate(6.62deg)", transformOrigin: "0 0" }} />
      </div>
    </div>
  );
}

/** Defect 02 illustration — stale job posting (Figma Group 35 in Frame 29 / 53:2135). */
export function Defect02Illustration() {
  const meta = { fontFamily: "var(--font-body)", fontSize: 19.2, lineHeight: "32px", letterSpacing: "-0.02em", color: ink, opacity: 0.8 } as const;
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 125.11, top: 281.67, width: 556.2, height: 379.89, borderRadius: 19.2, background: "#fff" }} />
      <div style={{ position: "absolute", left: 100.62, top: 217.28, width: 556.2, height: 379.89, borderRadius: 19.2, background: "#e4e4e4", opacity: 0.5 }} />
      <div style={{ position: "absolute", left: 76, top: 235, width: 556.2, height: 379.89, borderRadius: 19.2, background: "#fff", boxShadow: "0 0 0 1.5px #e9e9e9", boxSizing: "border-box", padding: "33.6px 28.8px", display: "flex", flexDirection: "column", gap: 21.6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4.8 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 21.6, lineHeight: "32px", letterSpacing: "-0.01em", color: ink, opacity: 0.8 }}>Job posting</span>
          <span style={{ background: "#f6e6b8", borderRadius: 4.8, padding: "6px 7.2px", fontFamily: "var(--font-body)", fontSize: 14.4, lineHeight: "14px", letterSpacing: "-0.01em", color: "#7c5d00", opacity: 0.8 }}>3 months ago</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7.2 }}>
          <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 38.4, lineHeight: "50px", letterSpacing: "-0.02em", color: ink }}>Process Engineer</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9.6 }}>
            <span style={meta}>Surface finishing</span><span style={{ width: 4.8, height: 4.8, borderRadius: 2.4, background: ink }} />
            <span style={meta}>Surface finishing</span><span style={{ width: 4.8, height: 4.8, borderRadius: 2.4, background: ink }} />
            <span style={meta}>£200k/yr</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9.6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 21.6, lineHeight: "32px", letterSpacing: "-0.01em", color: ink }}>
            <span style={{ opacity: 0.6 }}>Total Applications</span><span>2 applications</span>
          </div>
          <Bars widths={[498.6, 335.67, 396.91]} h={28.8} r={9.6} gap={9.6} />
        </div>
      </div>
    </div>
  );
}

const HIRES: [string, string, string, string][] = [
  ["/assets/img/avatar-111_81478.png", "James Patterson", "Operations Eng.", "Fired"],
  ["/assets/img/avatar-111_81491.png", "Sarah Lee", "Corrosions Eng.", "Active"],
  ["/assets/img/avatar-111_81504.png", "Michael Chen", "Plating Engineer", "On Leave"],
  ["/assets/img/avatar-111_81517.png", "Emily Johnson", "Head of Eng.", "Hired"],
  ["/assets/img/avatar-111_81530.png", "Jackson Neverson", "Head of Coatings", "Fired"],
  ["/assets/img/avatar-111_81551.png", "Lila Chen", "Senior Developer", "Fired"],
  ["/assets/img/avatar-111_81564.png", "Marcus Ito", "Marketing Specialist", "On Leave*"],
];
const PILL: Record<string, [string, string]> = { Fired: ["#ffebeb", "#8e0a0a"], Active: ["#f4ebff", "#4c0a8e"], "On Leave": ["#fff2e6", "#a35105"], Hired: ["#defee7", "#107807"], "On Leave*": ["#ffebeb", "#8e0a0a"] };

/** Defect 03 illustration — recent-hires table (Figma Frame 66 / 57:17326). */
export function Defect03Illustration() {
  const cell = { boxShadow: "inset 0 0 0 0.5px #d9d9d9", boxSizing: "border-box" as const, height: 42, display: "flex", alignItems: "center", padding: "8px 10px", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: "26px", letterSpacing: "-0.02em", color: ink, opacity: 0.8, whiteSpace: "nowrap" as const, flex: "none" as const };
  const widths = [44, 220, 161, 96, 161];
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 125.11, top: 281.67, width: 556.2, height: 379.89, borderRadius: 19.2, background: "#fff" }} />
      <div style={{ position: "absolute", left: 100.62, top: 217.28, width: 556.2, height: 379.89, borderRadius: 19.2, background: "#e4e4e4", opacity: 0.5 }} />
      <div style={{ position: "absolute", left: 76, top: 235, width: 556, height: 439, borderRadius: 19.2, background: "#fff", boxShadow: "0 0 0 1.5px #e9e9e9", boxSizing: "border-box", padding: "33.6px 28.8px", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 21.6, lineHeight: "32px", letterSpacing: "-0.01em", color: ink, opacity: 0.8 }}>Recent hires</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            {["No", "Full name", "Role", "Status", "Role"].map((h, i) => (
              <div key={i} style={{ ...cell, width: widths[i], background: "#f0f0f0", borderTopLeftRadius: i === 0 ? 12 : 0, justifyContent: i === 0 ? "center" : "flex-start" }}>{h}</div>
            ))}
          </div>
          {HIRES.map(([av, name, role, status], r) => (
            <div key={name} style={{ display: "flex", background: "#fff" }}>
              <div style={{ ...cell, width: widths[0], justifyContent: "center" }}>{r + 1}</div>
              <div style={{ ...cell, width: widths[1], gap: 8 }}><img src={av} alt="" width={26} height={26} style={{ width: 26, height: 26, borderRadius: 13 }} />{name}</div>
              <div style={{ ...cell, width: widths[2] }}>{role}</div>
              <div style={{ ...cell, width: widths[3], padding: "9px 10px" }}>
                <span style={{ background: PILL[status][0], color: PILL[status][1], borderRadius: 5, padding: "6px 8px", fontSize: 12, lineHeight: "12px", letterSpacing: "-0.02em", opacity: 0.8 }}>{status.replace("*", "")}</span>
              </div>
              <div style={{ ...cell, width: widths[4] }}>Role</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
