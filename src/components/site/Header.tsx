"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { SiteNav } from "@/components/site/SiteNav";
import { useHeaderAutoHide } from "@/lib/motion/useHeaderAutoHide";

/**
 * Figma "Header - NAV" (35:229 and the per-page copies): 55px, padding 10/56, blur 12.
 * `tone="dark"` sits over the dark homepage hero (white brand, light links);
 * `tone="light"` is the white-hero variant used by every other page (#000 brand, #3a3a3a links).
 */
export function Header({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const ref = useRef<HTMLElement>(null);
  useHeaderAutoHide(ref);
  return (
    <header ref={ref} className={`st-header ${tone === "light" ? "st-header--light" : ""}`}>
      <Link href="/" prefetch={false} className="st-header__brand" aria-label="Surface Talent home">
        <img src="/assets/svg/brand-mark.svg" alt="" width={28} height={20} />
        <span>Surface Talent</span>
      </Link>
      <div className="st-header__right">
        <SiteNav />
        <Button href="/contact" tone={tone === "light" ? "copper" : "light"}>Brief us</Button>
      </div>
    </header>
  );
}
