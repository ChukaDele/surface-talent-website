"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { usePressable } from "@/lib/motion/usePressable";

type Tone = "light" | "copper";
type Variant = "primary" | "secondary";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** `light` = white primary / white outline (dark sections). `copper` = brand copper (light sections). */
  tone?: Tone;
  arrow?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "children" | "className">;

/**
 * Figma: Primary Button (2011:14) / Secondary Button (2012:8) and the inline `Link` frames.
 * 34px tall, 12px Geist Medium, padding 8/12, radius 5, gap 4, 16px arrow.
 * States from the component set: Default → Hover (#975e2a) → Pressing (#7d4e23);
 * secondary Hover 8% tint, Pressed 16% tint.
 */
export function Button({ href, children, variant = "primary", tone = "copper", arrow = variant === "primary", className = "", ...rest }: ButtonProps) {
  const { attach, handlers } = usePressable<HTMLAnchorElement>();
  const external = /^https?:/.test(href);
  return (
    <Link
      href={href}
      prefetch={false}
      ref={attach}
      {...handlers}
      className={`st-btn st-btn--${variant} st-btn--${tone} ${className}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    >
      <span className="st-btn__label">{children}</span>
      {arrow ? (
        <span className="st-btn__icon" aria-hidden="true">
          <ArrowRight />
        </span>
      ) : null}
    </Link>
  );
}
