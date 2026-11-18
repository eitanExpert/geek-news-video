import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeIn, pop } from '../components/anim';
import { FONT_DISPLAY } from '../theme';
import { KineticScene as Props } from '../types';

// Lines rise out of masks one after another; highlighted words get a colour block that wipes in behind them
export const KineticScene: React.FC<{ scene: Props; accent: string; durationInFrames: number }> = ({ scene, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = scene.lines.slice(0, 4).map((l) => l.toUpperCase());
  const hl = new Set((scene.highlight || []).map((h) => h.toUpperCase()));
  const gap = Math.max(5, Math.min(12, Math.floor((durationInFrames * 0.45) / Math.max(1, lines.length))));
  const drift = interpolate(frame, [0, durationInFrames], [0, -40]);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 300, left: 70, right: 70, transform: `translateY(${drift}px) rotate(-3deg)` }}>
        {lines.map((line, i) => {
          const at = 3 + i * gap;
          const p = pop(frame, fps, at, 240, 18);
          const y = interpolate(p, [0, 1], [130, 0]);
          const isHl = hl.has(line) || [...hl].some((h) => line.includes(h));
          const wipe = easeIn(frame, at + 4, 8);
          const size = line.length > 14 ? 120 : line.length > 9 ? 150 : 190;
          return (
            <div key={i} style={{ overflow: 'hidden', marginBottom: 6, display: 'flex', justifyContent: i % 2 ? 'flex-end' : 'flex-start' }}>
              <div style={{ position: 'relative', transform: `translateY(${y}%)`, padding: '0 18px' }}>
                {isHl ? (
                  <div style={{ position: 'absolute', left: 0, top: '12%', bottom: '8%', width: `${wipe * 100}%`, background: accent, zIndex: 0 }} />
                ) : null}
                <span
                  style={{
                    position: 'relative',
                    fontFamily: FONT_DISPLAY,
                    fontSize: size,
                    lineHeight: 1.04,
                    color: isHl && wipe > 0.5 ? '#0A0A0A' : '#fff',
                    opacity: interpolate(frame - at, [0, 3], [0, 1], clamp),
                    textShadow: isHl ? 'none' : '0 8px 30px rgba(0,0,0,0.7)',
                  }}
                >
                  {line}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
