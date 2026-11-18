import { Easing, interpolate, spring } from 'remotion';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// 0 -> 1 over [from, from + len] frames with a strong ease-out
export const easeIn = (frame: number, from: number, len: number) =>
  interpolate(frame, [from, from + len], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

// Snappy spring that settles quickly (good for "slam" and "pop" entrances)
export const pop = (frame: number, fps: number, delay = 0, stiffness = 220, damping = 14) =>
  spring({ frame: frame - delay, fps, config: { stiffness, damping, mass: 0.6 } });

// Soft spring for larger moves
export const glide = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { stiffness: 120, damping: 20, mass: 1 } });

// Deterministic pseudo-random in [0, 1) from a number seed
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Small camera shake that decays after `at`
export const shake = (frame: number, at: number, strength = 14, len = 9) => {
  const t = frame - at;
  if (t < 0 || t > len) return { x: 0, y: 0 };
  const k = 1 - t / len;
  return { x: (rand(at * 7 + t) - 0.5) * 2 * strength * k, y: (rand(at * 13 + t) - 0.5) * 2 * strength * k };
};
