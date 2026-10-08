import type { ReactNode } from "react";

/**
 * Section label: IBM Plex Mono, uppercase, tracked, led by a short copper rule (the brand's
 * "coating layer" line). Copper on light surfaces, lighter copper on anthracite (set by the
 * surface, see brand.css). `diamond` is accepted for older call sites and ignored: the rule
 * replaces it everywhere.
 */
export function Eyebrow({ children, tone = "copper", className = "" }: { children: ReactNode; diamond?: boolean; tone?: "copper" | "light" | "muted"; className?: string }) {
  return (
    <span className={`st-eyebrow ${tone === "light" ? "st-eyebrow--light" : tone === "muted" ? "st-eyebrow--muted" : ""} ${className}`}>
      {children}
    </span>
  );
}
