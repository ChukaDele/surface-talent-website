import { Button } from "@/components/ui/Button";

/** Figma "Frame 15" (38:438) 396 × 389 role-brief card + backing rectangles, inside the 720 × 620 stage. */
export function RoleBriefStateOne() {
  return (
    <div data-state-one style={{ position: "absolute", inset: 0 }} aria-hidden="true">
      <div style={{ position: "absolute", left: 217, top: 223, width: 533, height: 533, borderRadius: 32, background: "#171c20", boxShadow: "inset 0 0 0 1px #293038", opacity: 0.6 }} />
      <div style={{ position: "absolute", left: 477, top: 256, width: 289, height: 31, background: "#d9d9d9", opacity: 0.1 }} />
      <div style={{ position: "absolute", left: 414, top: 296, width: 289, height: 31, background: "#d9d9d9", opacity: 0.1, borderRadius: 11 }} />
      <div style={{ position: "absolute", left: 381, top: 338, width: 289, height: 31, background: "#d9d9d9", opacity: 0.1, borderRadius: 11 }} />
      <div data-role-card style={{ position: "absolute", left: 150, top: 141, width: 396, height: 389, boxSizing: "border-box", padding: 20, borderRadius: 12, background: "var(--system-card)", boxShadow: "inset 0 0 0 1px #293038", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 14, lineHeight: "18px", letterSpacing: 2, opacity: 0.8 }}>ROLE BRIEF</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="st-body" style={{ color: "var(--primary-500)", opacity: 0.8 }}>Posted 12 mins ago</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 32, lineHeight: "42px", letterSpacing: "-0.02em" }}>Process Engineer</div>
                <div className="st-body" style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.8 }}>
                  <span>Surface finishing</span><span style={{ width: 4, height: 4, borderRadius: 2, background: "#fff", display: "inline-block" }} />
                  <span>Surface finishing</span><span style={{ width: 4, height: 4, borderRadius: 2, background: "#fff", display: "inline-block" }} />
                  <span>$200k/yr</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}>
              <div className="st-body" style={{ fontWeight: 500, opacity: 0.8 }}>Role description</div>
              <p className="st-body" style={{ lineHeight: "24px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                Own the day-to-day running of the coating line — bath chemistry, cycle times, and process parameters — while keeping output within spec. You&apos;ll troubleshoot line issues in real time, work from substrate through to finished part, and make the calls that keep throughput up without compromising quality.
              </p>
            </div>
          </div>
        </div>
        <div><Button href="/jobs" tone="light" tabIndex={-1} aria-hidden="true">Apply for this role</Button></div>
      </div>
    </div>
  );
}
