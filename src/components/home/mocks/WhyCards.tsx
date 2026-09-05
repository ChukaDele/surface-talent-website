import { Ring } from "./Ring";

const ink = "var(--ink)";

/** Card 01 illustration — two profile cards + acquisition-manager cursor (Figma Group 54). */
export function ProcessIllustration() {
  const card = (left: number, top: number, rot: number, header: string, avatar: string, name: string, role: string, icons: string) => (
    <div style={{ position: "absolute", left, top, width: 290, height: 203.25, transform: `rotate(${-rot}deg)`, transformOrigin: "0 0", background: "#fff", boxShadow: "0 0 0 1.25px #e9e9e9", borderRadius: 7.5, overflow: "hidden", boxSizing: "border-box" }}>
      <img src={header} alt="" width={290} height={55} style={{ position: "absolute", left: 0, top: 0, width: 290, height: 55, display: "block" }} />
      <div style={{ position: "absolute", left: 15, top: 38, display: "flex", flexDirection: "column", gap: 11.25 }}>
        <img src={avatar} alt="" width={44} height={44} style={{ width: 44, height: 44, borderRadius: 22, display: "block" }} />
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 16, lineHeight: "26px", letterSpacing: "-0.02em", color: ink, opacity: 0.8, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, lineHeight: "18px", letterSpacing: "-0.01em", color: ink, opacity: 0.8, whiteSpace: "nowrap" }}>{role}</div>
        </div>
      </div>
      <img src={icons} alt="" width={140} height={40} style={{ position: "absolute", left: 15, top: 147.25, width: 140, height: 40, display: "block" }} />
    </div>
  );
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: 960, height: 480, pointerEvents: "none" }}>
      {card(416.02, 180.7, 2.31, "/assets/img/card-header-a.png", "/assets/img/avatar-112_94732.png", "Timothy Kinson", "Quality Assurance Engineer", "/assets/svg/frame138.svg")}
      {card(647.88, 255.27, 0, "/assets/img/card-header-b.png", "/assets/img/avatar-113_99177.png", "Evelyn Harper", "Software Testing Specialist", "/assets/svg/frame138.svg")}
      <img src="/assets/svg/marker30.svg" alt="" width={29.5} height={28.25} style={{ position: "absolute", left: 550.75, top: 355.52, width: 29.5, height: 28.25 }} />
      <div data-why-tag style={{ position: "absolute", left: 570, top: 373.4, height: 38, padding: "6px 11px", borderRadius: 20, background: "var(--primary-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 16, lineHeight: "26px", letterSpacing: "-0.02em", whiteSpace: "nowrap", boxSizing: "border-box" }}>S.T Acquisition Mgr.</div>
    </div>
  );
}

function MiniPerson({ left, top, avatar, name, role, pct, color, arc, textColor }: { left: number; top: number; avatar: string; name: string; role: string; pct: number; color: string; arc: string; textColor: string }) {
  return (
    <div style={{ position: "absolute", left, top, width: 231.75, height: 49, background: "#fff", borderRadius: 6, boxShadow: "0 0 0 1px #e9e9e9", boxSizing: "border-box", padding: 7.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <img src={avatar} alt="" width={33} height={33} style={{ width: 33, height: 33, borderRadius: 16.5, display: "block" }} />
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, lineHeight: "20px", letterSpacing: "-0.02em", color: ink, opacity: 0.8, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 9, lineHeight: "14px", letterSpacing: "-0.01em", color: ink, opacity: 0.8, whiteSpace: "nowrap" }}>{role}</div>
        </div>
      </div>
      <Ring size={33} pct={pct} color={arc} stroke={2.25} fontSize={9} text={`${pct}%`} />
      <span className="sr-only">{textColor}{color}</span>
    </div>
  );
}

/** Card 02 illustration — network of candidates → Surface Talent hub → IMF (Figma Frame 34 / Group 25). */
export function NetworkIllustration() {
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", left: 57, top: 169, width: 846, height: 278, overflow: "hidden", pointerEvents: "none" }}>
      <img src="/assets/svg/netLine12.svg" alt="" style={{ position: "absolute", left: 482, top: 45.93, width: 176.5, height: 84.54 }} />
      <img src="/assets/svg/netLine11.svg" alt="" style={{ position: "absolute", left: 506.5, top: 155, width: 145.39, height: 70.35 }} />
      <img src="/assets/svg/netLine13.svg" alt="" style={{ position: "absolute", left: 563, top: 141, width: 82.5, height: 1 }} />
      <img src="/assets/svg/netLine14.svg" alt="" style={{ position: "absolute", left: 673, top: 141, width: 82.5, height: 1 }} />
      <div data-net-hub style={{ position: "absolute", left: 631, top: 119, width: 40, height: 40, borderRadius: 20, background: "#815024", boxShadow: "inset 0 0 0 1px #9c622b, 0 0 0 1px #653f1c", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src="/assets/svg/networkIcon.svg" alt="" width={40} height={40} style={{ width: 40, height: 40, display: "block" }} />
      </div>
      <MiniPerson left={269} top={29} avatar="/assets/img/avatar-48_1034.png" name="Timothy Kinson" role="Quality Assurance Engineer" pct={68} color="#c6880d" arc="#d1a03d" textColor="#c6880d" />
      <MiniPerson left={333} top={115} avatar="/assets/img/avatar-48_1044.png" name="Evelyn Harper" role="Software Testing Specialist" pct={96} color="#15a036" arc="#15a036" textColor="#15a036" />
      <MiniPerson left={283} top={201} avatar="/assets/img/avatar-48_1054.png" name="Liam Foster" role="Product Designer" pct={20} color="#da3f2b" arc="#e15746" textColor="#da3f2b" />
      <div style={{ position: "absolute", left: 754, top: 105.4, width: 72, height: 72, borderRadius: 36, background: "#fff", boxShadow: "inset 0 0 0 1px #15a036", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/assets/img/avatar-48_1065.png" alt="" width={61} height={61} style={{ width: 61, height: 61, display: "block" }} />
      </div>
    </div>
  );
}

/** Card 03 illustration — context assessment card with MAPPED stamp + pipeline stats (Figma Group 55). */
export function ContextIllustration() {
  const rows: [string, number, string][] = [["Chemistry", 84, "#29af39"], ["Kit and equipment", 91, "#29af39"], ["Standards", 68, "#d19d3d"], ["Economics", 76, "#8cca11"]];
  const arc: Record<string, string> = { "#29af39": "#3dd14e", "#d19d3d": "#d19d3d", "#8cca11": "#8cca11" };
  const stats: [string, string, string][] = [["Applications", "520", "#adadad"], ["Selected", "12", "#58b84c"], ["Screened Out", "8", "#ff8c00"], ["Shortlisted", "4", "#0090ff"]];
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: 960, height: 480, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 523, top: 170.4, width: 301.27, height: 239.21, background: "#fff", borderRadius: 10.4, boxShadow: "0 0 0 1.3px #e9e9e9", boxSizing: "border-box", padding: "18.2px 15.6px", display: "flex", flexDirection: "column", gap: 11.7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11.7 }}>
          <img src="/assets/svg/frame140.svg" alt="" width={42.9} height={42.9} style={{ width: 42.9, height: 42.9, display: "block", borderRadius: 6.5 }} />
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13, lineHeight: "21px", letterSpacing: "-0.02em", color: ink, opacity: 0.8 }}>Process Engineer - Brief</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11.7, lineHeight: "18px", letterSpacing: "-0.01em", color: ink, opacity: 0.8 }}>Context Assessment</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5.2 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 9.1, lineHeight: "13px", letterSpacing: 1.3, color: "var(--primary-500)", textTransform: "uppercase" }}>Evaluation summary</div>
          {rows.map(([label, pct, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 28.6 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: "20px", letterSpacing: "-0.01em", color: ink }}>{label}</span>
              <Ring size={28.6} pct={pct} color={arc[color]} stroke={1.95} fontSize={7.8} text={`${pct}%`} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 252.65, top: -13.16, width: 61.96, height: 60.84 }}>
          <img src="/assets/svg/stampOutline.svg" alt="" style={{ position: "absolute", left: 0, top: 0, width: 61.96, height: 60.84 }} />
          <img src="/assets/img/stamp-mapped-grunge.png" alt="" style={{ position: "absolute", left: 1.39, top: 4.85, width: 59.19, height: 51.11 }} />
          <span style={{ position: "absolute", left: 18.25, top: 17.13, width: 32, textAlign: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14.3, lineHeight: "24px", color: "#fff", transform: "rotate(9.77deg)", transformOrigin: "0 0" }}>MAPPED</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 581, top: 391.4, width: 337, height: 58, background: "#fff", borderRadius: 6, boxShadow: "0 0 0 0.75px #e9e9e9, 0 1.5px 7.5px rgba(204,204,204,0.35), 0 0 18px rgba(184,115,51,0.05)", boxSizing: "border-box", padding: "10.5px 9px", display: "flex", justifyContent: "space-between" }}>
        {stats.map(([label, value, color]) => (
          <div key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 4.5, fontFamily: "var(--font-body)", fontSize: 10.125, lineHeight: "15px", letterSpacing: "-0.01em", color: ink, opacity: 0.8 }}>
              <span style={{ width: 9, height: 9, background: color, display: "inline-block" }} />{label}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13.5, lineHeight: "22px", letterSpacing: "-0.02em", color: ink, opacity: 0.8 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvalCard({ left, top, rot, avatar, name, role, evaluators, summary, opacity = 1, stamp = false }: { left: number; top: number; rot: number; avatar: string; name: string; role: string; evaluators: [string, string, number, string][]; summary: string; opacity?: number; stamp?: boolean }) {
  return (
    <div style={{ position: "absolute", left, top, width: 231.75, height: 210, transform: `rotate(${-rot}deg)`, transformOrigin: "0 0", background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px #e9e9e9", boxSizing: "border-box", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 9, opacity }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <img src={avatar} alt="" width={33} height={33} style={{ width: 33, height: 33, borderRadius: 16.5, display: "block" }} />
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, lineHeight: "20px", letterSpacing: "-0.02em", color: ink, opacity: 0.8, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 9, lineHeight: "14px", letterSpacing: "-0.01em", color: ink, opacity: 0.8, whiteSpace: "nowrap" }}>{role}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 9, lineHeight: "14px", letterSpacing: "-0.01em", color: ink, opacity: 0.6 }}>Evaluation Summary</div>
        {evaluators.map(([av, n, pct, color]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <img src={av} alt="" width={20} height={20} style={{ width: 20, height: 20, borderRadius: 10, boxShadow: "inset 0 0 0 1px #b273ff", display: "block" }} />
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, lineHeight: "16px", letterSpacing: "-0.02em", color: ink, opacity: 0.8 }}>{n}</span>
            </div>
            <Ring size={24} pct={pct} color={color} stroke={1.64} fontSize={6.55} text={`${pct}%`} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 9, lineHeight: "14px", letterSpacing: "-0.01em", color: ink, opacity: 0.6 }}>Summary Profile</div>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 9, lineHeight: "14px", letterSpacing: "-0.01em", color: ink, opacity: 0.8, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{summary}</p>
      </div>
      {stamp ? <img src="/assets/img/stamp-hired.png" alt="" style={{ position: "absolute", left: 41.25, top: 60, width: 150, height: 90 }} /> : null}
    </div>
  );
}

/** Card 04 illustration — three evaluation cards, one stamped HIRED (Figma Group 26). */
export function MatchIllustration() {
  return (
    <div className="st-mock" aria-hidden="true" style={{ position: "absolute", left: 57, top: 169, width: 846, height: 278, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 512, top: 74.04, width: 231.75, height: 210, transform: "rotate(-9.85deg)", transformOrigin: "0 0", background: "#fff", borderRadius: 8, boxShadow: "0 0 0 1px #e9e9e9", opacity: 0.3 }} />
      <EvalCard left={555.25} top={17.67} rot={0} avatar="/assets/img/avatar-53_1474.png" name="Elias Marston" role="Product Quality Specialist"
        evaluators={[["/assets/img/avatar-53_1485.png", "Lena Whitaker", 84, "#3dd14e"], ["/assets/img/avatar-53_1495.png", "Derek Caldwell", 100, "#149a0b"]]}
        summary="Manage daily operations of the coating process — including bath chemistry, cycle durations, and process settings — ensuring all outputs meet quality standards. You'll resolve line issues promptly, oversee everything from raw material to final product, and make decisions that maintain high throughput without sacrificing quality." />
      <EvalCard left={614.79} top={110.73} rot={-4.59} avatar="/assets/img/avatar-53_1505.png" name="Avery Collins" role="Quality Assurance Coordinator" stamp
        evaluators={[["/assets/img/avatar-53_1516.png", "Jordan Hayes", 84, "#3dd14e"], ["/assets/img/avatar-53_1526.png", "Morgan Blake", 92, "#149a0b"]]}
        summary="Oversee the coating process daily, managing bath chemistry, cycle times, and settings to ensure top-quality results. Quickly address any line issues, supervise materials from start to finish, and make decisions that keep production efficient without compromising standards." />
    </div>
  );
}
