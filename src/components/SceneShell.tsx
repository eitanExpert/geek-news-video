import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { clamp, rand } from './anim';

export type Entrance = 'zoom' | 'whip' | 'glitch' | 'drop';
export const ENTRANCES: Entrance[] = ['zoom', 'whip', 'glitch', 'zoom', 'drop', 'whip'];

// Wraps a whole scene and gives it an energetic entrance (the "cut" between scenes)
export const SceneShell: React.FC<{ entrance: Entrance; seed: number; children: React.ReactNode }> = ({ entrance, seed, children }) => {
  const frame = useCurrentFrame();
  const out = Easing.out(Easing.cubic);
  let transform = '';
  let filter = '';
  if (entrance === 'zoom') {
    const s = interpolate(frame, [0, 9], [1.35, 1], { ...clamp, easing: out });
    const b = interpolate(frame, [0, 7], [16, 0], clamp);
    transform = `scale(${s})`;
    filter = `blur(${b}px)`;
  } else if (entrance === 'whip') {
    const dir = seed % 2 === 0 ? 1 : -1;
    const x = interpolate(frame, [0, 8], [110 * dir, 0], { ...clamp, easing: out });
    const sk = interpolate(frame, [0, 8], [-14 * dir, 0], clamp);
    const b = interpolate(frame, [0, 6], [22, 0], clamp);
    transform = `translateX(${x}%) skewX(${sk}deg)`;
    filter = `blur(${b}px)`;
  } else if (entrance === 'drop') {
    const y = interpolate(frame, [0, 10], [-100, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
    transform = `translateY(${y}%)`;
  } else if (entrance === 'glitch') {
    if (frame < 8) {
      const k = 1 - frame / 8;
      const jx = (rand(seed * 31 + frame) - 0.5) * 60 * k;
      transform = `translateX(${jx}px) scale(${1 + 0.06 * k})`;
      const o = Math.round(14 * k);
      filter = `drop-shadow(${o}px 0 0 rgba(255,46,99,0.9)) drop-shadow(${-o}px 0 0 rgba(0,229,255,0.9)) contrast(${1 + 0.4 * k})`;
    }
  }
  return <AbsoluteFill style={{ transform, filter, overflow: 'hidden' }}>{children}</AbsoluteFill>;
};

// Bright flash on every cut
export const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 1, 5], [0.0, 0.5, 0], clamp);
  return <AbsoluteFill style={{ background: '#fff', opacity: o, mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};
