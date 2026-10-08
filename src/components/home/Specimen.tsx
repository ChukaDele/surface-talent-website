import { SPECIMEN_FRAME, SPECIMEN_LABELS, SPECIMEN_LAYERS } from "@/data/heroSpecimen";

/**
 * Hero specimen — Figma "Shadow" (35:283) 401.14 × 541.86 with Group 1 (8 hex slabs)
 * and five rotated mono labels. Rendered at Figma coordinates; the hero scene animates
 * `[data-slab]` and `[data-slab-label]` nodes.
 */
export function Specimen() {
  return (
    <div className="st-specimen" style={{ position: "relative", width: SPECIMEN_FRAME.w, height: SPECIMEN_FRAME.h, filter: "drop-shadow(0 28px 25px rgba(20,23,28,0.22))" }} aria-hidden="true">
      {SPECIMEN_LAYERS.map((l, i) => (
        <img
          key={l.id}
          data-slab={i}
          src={l.variant === "thick" ? "/assets/svg/specimen-slab-thick.svg" : "/assets/svg/specimen-slab-thin.svg"}
          alt=""
          width={l.w}
          height={l.h}
          style={{ position: "absolute", left: l.x, top: l.y, width: l.w, height: l.h, willChange: "transform, opacity" }}
        />
      ))}
      {SPECIMEN_LABELS.map((t) => (
        <span
          key={t.text}
          data-slab-label
          className="st-specimen__label"
          style={{
            position: "absolute", left: t.x, top: t.y, width: t.w, height: 16,             fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: "16px", letterSpacing: 2, color: "#fff", textAlign: t.align as "center" | "left", whiteSpace: "nowrap", textTransform: "uppercase",
          }}
        >
          {t.text}
        </span>
      ))}
    </div>
  );
}
