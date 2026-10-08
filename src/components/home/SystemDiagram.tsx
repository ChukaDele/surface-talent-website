import { ANNOTATIONS, DIAGRAM_STAGE, FINAL_ANNOTATION, PLATE, SLABS } from "@/data/systemDiagram";

/** Dashed bracket connector — Figma "Vector 10" (18.5 × 35.5 at rest; scales with the stage). */
function Connector({ w = 18.5, h = 35.5 }: { w?: number; h?: number }) {
  const s = w / 18.5;
  return (
    <svg width={w} height={h} viewBox="0 0 18.5 35.5" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path d="M0 0H10M0 35.5H10" stroke="#fff" strokeWidth={0.5 / s} strokeDasharray="1.67 0.83" />
      <path d="M10 0V35.5" stroke="#fff" strokeWidth={0.5 / s} strokeDasharray="2.22 2.22" />
      <path d="M10 17.75H18.5" stroke="#fff" strokeWidth={0.5 / s} strokeDasharray="2.125 2.125" />
    </svg>
  );
}

/**
 * The zoom-into-the-system diagram at its rest (state 3) scale inside a 720 × 620 stage.
 * The scene animates the wrapper `[data-diagram]` (scale 2 → 1 about DIAGRAM_ZOOM_ORIGIN)
 * and fades `[data-annotation]` nodes in for the final state.
 */
export function SystemDiagram() {
  return (
    <div data-diagram style={{ position: "absolute", left: 0, top: 0, width: DIAGRAM_STAGE.w, height: DIAGRAM_STAGE.h, transformOrigin: "-203px -81.6px", willChange: "transform" }} aria-hidden="true">
      {SLABS.map((s) => (
        <div key={s.key} data-slab-group={s.key} style={{ position: "absolute", left: 0, top: 0 }}>
          <svg style={{ position: "absolute", left: s.x, top: s.y }} width={s.w} height={s.h} viewBox={`0 0 ${s.vw} ${s.vh}`} fill="none">
            {s.paths.map((p, i) => <path key={i} d={p.d} fill={p.fill} />)}
          </svg>
          <div
            data-plate={s.key}
            style={{ position: "absolute", left: s.plate.x, top: s.plate.y, width: PLATE.w, height: PLATE.h, boxSizing: "border-box", boxShadow: "0 0 0 1.25px rgba(255,255,255,0.2)",
              background: `linear-gradient(180deg, ${(s.plate.copper ? PLATE.copper : PLATE.dark)[0]} 0 ${PLATE.split}px, ${(s.plate.copper ? PLATE.copper : PLATE.dark)[1]} ${PLATE.split}px 100%)` }}
          >
            <span style={{ position: "absolute", left: 12.5, top: 5, fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 15, lineHeight: "20px", letterSpacing: 2.5, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap" }}>{s.label}</span>
          </div>
        </div>
      ))}
      {ANNOTATIONS.map((a) => (
        <div key={a.text} data-annotation style={{ position: "absolute", left: a.x, top: a.y, display: "flex", alignItems: "center", gap: 5, height: 35.5 }}>
          <Connector />
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 15, lineHeight: "20px", letterSpacing: 0.5, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", textTransform: "uppercase" }}>{a.text}</span>
        </div>
      ))}
      {/* Figma "Vector 10" 32.5 × 214.5, rotation −90° about its top-left → CSS rotate(90deg); mid tail sits at 174.75 of 214.5 */}
      <svg data-annotation width={FINAL_ANNOTATION.connector.w} height={FINAL_ANNOTATION.connector.h} viewBox="0 0 32.5 214.5" fill="none" aria-hidden="true"
        style={{ position: "absolute", left: FINAL_ANNOTATION.connector.x, top: FINAL_ANNOTATION.connector.y, transformOrigin: "0 0", transform: "rotate(90deg)", overflow: "visible" }}>
        <path d="M0 0H10M0 214.5H10" stroke="#fff" strokeWidth={0.5} strokeDasharray="1.67 0.83" />
        <path d="M10 0V214.5" stroke="#fff" strokeWidth={0.5} strokeDasharray="3.97 3.97" />
        <path d="M10 174.75H32.5" stroke="#fff" strokeWidth={0.5} strokeDasharray="1.875 3.75" />
      </svg>
      <span data-annotation style={{ position: "absolute", left: FINAL_ANNOTATION.text.x, top: FINAL_ANNOTATION.text.y, fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 15, lineHeight: "20px", letterSpacing: 0.5, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", textTransform: "uppercase" }}>{FINAL_ANNOTATION.text.value}</span>
    </div>
  );
}
