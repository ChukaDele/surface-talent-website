"use client";

import { useEffect } from "react";
import { attachGeometryCoordinator } from "@/lib/motion/geometryCoordinator";

/**
 * Page-level motion coordinator. Each interactive scene owns its own GSAP lifecycle; the
 * approved portrait hero is deliberately static and has no page-scroll controller.
 */
export function PageMotion() {
  useEffect(() => attachGeometryCoordinator(), []);
  return null;
}
