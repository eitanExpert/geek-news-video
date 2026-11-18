import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_UI } from '../theme';
import { clamp } from './anim';

// Vignette + film grain on top of everything for a filmic finish
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.09, mixBlendMode: 'overlay' }}>
        <filter id={'grain' + seed}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// Thin progress bar + channel bug at the top
export const TopBar: React.FC<{ brand: string; accent: string }> = ({ brand, accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const dot = 0.5 + 0.5 * Math.sin(frame / 4);
  const enter = interpolate(frame, [0, 12], [-120, 0], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, height: 10, width: `${p * 100}%`, background: accent, boxShadow: `0 0 20px ${accent}` }} />
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 56,
          transform: `translateX(${enter}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 22px 10px 18px',
          background: 'rgba(0,0,0,0.55)',
          border: '2px solid rgba(255,255,255,0.18)',
          borderRadius: 999,
          fontFamily: FONT_UI,
          fontWeight: 900,
          fontSize: 30,
          letterSpacing: 2,
          color: '#fff',
        }}
      >
        <div style={{ width: 16, height: 16, borderRadius: 16, background: '#FF2E63', opacity: 0.4 + dot * 0.6, boxShadow: '0 0 14px #FF2E63' }} />
        {brand}
      </div>
    </AbsoluteFill>
  );
};
