import confetti from "canvas-confetti";

/**
 * Premium celebratory confetti sequence for token deployment and milestone achievements.
 */
export function fireDeploymentConfetti() {
  if (typeof window === "undefined") return;

  // Sound/Vibration haptic if supported
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate([100, 50, 100]);
    } catch (_) {}
  }

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
    disableForReducedMotion: true,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // 1. Center burst with multiple colors and shapes
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ["#eab308", "#f59e0b", "#10b981", "#3b82f6", "#ffffff"],
  });

  fire(0.2, {
    spread: 60,
    colors: ["#fbbf24", "#eab308", "#22c55e", "#06b6d4"],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#ffffff"],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ["#eab308", "#22c55e", "#38bdf8"],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ["#fbbf24", "#a855f7", "#3b82f6"],
  });

  // 2. Dual cannon side bursts after 250ms
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.75 },
      colors: ["#eab308", "#10b981", "#ffffff", "#3b82f6"],
      zIndex: 9999,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.75 },
      colors: ["#eab308", "#10b981", "#ffffff", "#3b82f6"],
      zIndex: 9999,
    });
  }, 250);

  // 3. Second golden wave after 600ms
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 90,
      spread: 100,
      origin: { x: 0.5, y: 0.65 },
      colors: ["#eab308", "#fef08a", "#fbbf24", "#22c55e"],
      zIndex: 9999,
      scalar: 1.1,
    });
  }, 600);
}

export default fireDeploymentConfetti;
