export const FPS = 30;

export function speedMultiplier(speed?: "slow" | "normal" | "fast") {
  if (speed === "slow") return 1.25;
  if (speed === "fast") return 0.75;
  return 1;
}
