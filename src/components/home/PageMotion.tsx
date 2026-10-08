"use client";

import { useEffect } from "react";
import { attachGeometryCoordinator } from "@/lib/motion/geometryCoordinator";
import { useHeroMotion } from "@/lib/motion/scenes/useHeroMotion";

/**
 * Page-level motion coordinator: owns the single geometry/refresh coordinator and the
 * hero scene (which lives in a server component). It does not reach into other scenes;
 * each scene owns its own lifecycle via its hook.
 */
export function PageMotion() {
  useEffect(() => attachGeometryCoordinator(), []);
  useHeroMotion();
  return null;
}
