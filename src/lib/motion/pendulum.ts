"use client";

import { gsap } from "./gsap";

/**
 * Small damped pendulum used by the decorative LinkedIn mark. The rope and logo stay mounted,
 * read their live dimensions, and stop completely when the section leaves the viewport.
 */
export function createPendulum({
  swing,
  rope,
  logo,
  restAngle,
  ropeLength,
}: {
  swing: HTMLElement;
  rope: HTMLElement;
  logo: HTMLElement;
  restAngle: number;
  ropeLength: number;
}) {
  const gravity = 9.81 * 140;
  const length = ropeLength + logo.offsetHeight / 2;
  let theta = 0;
  let omega = 0;
  let dropY = -length;
  let dropVelocity = 0;
  let dropping = false;
  let active = false;
  const damping = 0.55;

  const apply = () => {
    gsap.set(swing, { rotation: restAngle + (theta * 180) / Math.PI, y: dropY });
    const stretch = (dropY + length) / length;
    gsap.set(rope, { scaleY: Math.max(0.001, stretch) });
  };

  const stop = () => {
    if (active) {
      active = false;
      gsap.ticker.remove(tick);
    }
  };

  const tick = (_time: number, delta: number) => {
    const h = Math.min(delta / 1000, 1 / 30);
    if (dropping) {
      dropVelocity += gravity * h;
      dropY += dropVelocity * h;
      if (dropY >= 0) {
        const stiffness = 220;
        const springDamping = 12;
        const acceleration = -stiffness * dropY - springDamping * dropVelocity;
        dropVelocity += acceleration * h;
        dropY += dropVelocity * h;
        if (Math.abs(dropY) < 0.3 && Math.abs(dropVelocity) < 4) {
          dropY = 0;
          dropVelocity = 0;
          dropping = false;
        }
      }
    }
    const alpha = -(gravity / length) * Math.sin(theta) - damping * omega;
    omega += alpha * h;
    theta += omega * h;
    if (!dropping && Math.abs(theta) < 0.0015 && Math.abs(omega) < 0.002) {
      theta = 0;
      omega = 0;
      apply();
      stop();
      return;
    }
    apply();
  };

  const start = () => {
    if (!active) {
      active = true;
      gsap.ticker.add(tick);
    }
  };

  return {
    drop() {
      dropping = true;
      dropY = -length;
      dropVelocity = 0;
      theta = 0.42 * (Math.random() > 0.5 ? 1 : -1);
      omega = 0;
      apply();
      start();
    },
    sleep() {
      stop();
      theta = 0;
      omega = 0;
      dropping = false;
      dropY = 0;
      dropVelocity = 0;
      apply();
    },
    destroy() {
      stop();
    },
  };
}
