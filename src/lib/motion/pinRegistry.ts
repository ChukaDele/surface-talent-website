"use client";

/**
 * Development-only guard: exactly one authored pinned scene may own the
 * viewport at a time. Each pinned scene registers itself while pinned and
 * unregisters on release; if two are active together the doctrine was
 * violated somewhere and we log loudly instead of silently overlapping.
 */
const active = new Set<string>();

export function pinAcquired(sceneId: string) {
  if (process.env.NODE_ENV === "production") return;
  active.add(sceneId);
  // Adjacent scenes toggle within the same ScrollTrigger update batch (release of one, acquire of
  // the next) in either order, so judge the set after the batch has settled.
  queueMicrotask(() => {
    if (active.size > 1) {
      console.error(
        `[motion] two pinned scenes own the viewport simultaneously: ${[...active].join(", ")}`,
      );
    }
  });
}

export function pinReleased(sceneId: string) {
  if (process.env.NODE_ENV === "production") return;
  active.delete(sceneId);
}
