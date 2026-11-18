import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeIn, glide, pop } from '../components/anim';
import { COLORS, FONT_DISPLAY, FONT_UI } from '../theme';
import { ListScene as ListProps, VersusScene as VersusProps } from '../types';

const Cross: React.FC<{ size: number; p: number }> = ({ size, p }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill={COLORS.hot} />
    <path d="M32 32 L68 68 M68 32 L32 68" stroke="#fff" strokeWidth={12} strokeLinecap="round" strokeDasharray={60} strokeDashoffset={60 * (1 - p)} />
  </svg>
);
const Check: React.FC<{ size: number; p: number; color?: string }> = ({ size, p, color = COLORS.green }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill={color} />
    <path d="M28 52 L44 68 L74 34" fill="none" stroke="#0A0A0A" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - p)} />
  </svg>
);

// Old way vs new way: two panels slam in from both sides, the losing side gets crossed out
export const VersusScene: React.FC<{ scene: VersusProps; accent: string; durationInFrames: number }> = ({ scene, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const winner = scene.winner || 'right';
  const lIn = glide(frame, fps, 0);
  const rIn = glide(frame, fps, Math.round(durationInFrames * 0.3));
  const strike = easeIn(frame, 10, 10);
  const mark = easeIn(frame, Math.round(durationInFrames * 0.3) + 8, 10);
  const vs = pop(frame, fps, Math.round(durationInFrames * 0.3) - 2, 320, 12);
  const panel = (side: 'left' | 'right', data: { title: string; sub?: string }, p: number) => {
    const good = side === winner;
    const lose = !good;
    return (
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: side === 'left' ? 260 : 760,
          height: 440,
          borderRadius: 36,
          background: good ? `linear-gradient(135deg, ${accent}33, rgba(10,10,20,0.85))` : 'linear-gradient(135deg, rgba(255,46,99,0.25), rgba(10,10,20,0.85))',
          border: `4px solid ${good ? accent : 'rgba(255,46,99,0.7)'}`,
          transform: `translateX(${interpolate(p, [0, 1], [side === 'left' ? -1100 : 1100, 0])}px) rotate(${side === 'left' ? -2 : 2}deg) scale(${good ? 1 + 0.03 * mark : 1 - 0.04 * strike})`,
          display: 'flex',
          alignItems: 'center',
          gap: 36,
          padding: '0 50px',
          boxShadow: good ? `0 0 60px ${accent}55` : 'none',
          filter: lose && p > 0.9 ? `grayscale(${0.7 * (side === 'left' ? strike : mark)})` : 'none',
        }}
      >
        {good ? <Check size={170} p={mark} color={accent} /> : <Cross size={170} p={side === 'left' ? strike : mark} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 900, fontSize: 40, letterSpacing: 6, color: good ? accent : COLORS.hot }}>{good ? 'NOW' : 'BEFORE'}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: data.title.length > 14 ? 96 : 120, lineHeight: 1.02, color: '#fff', textTransform: 'uppercase', textDecoration: 'none' }}>{data.title}</div>
          {data.sub ? <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 44, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>{data.sub}</div> : null}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      {panel('left', scene.left, lIn)}
      {panel('right', scene.right, rIn)}
      <div style={{ position: 'absolute', left: 540 - 85, top: 730 - 85, width: 170, height: 170, borderRadius: 170, background: '#0A0A0A', border: `6px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 80, color: accent, transform: `scale(${vs}) rotate(${interpolate(vs, [0, 1], [-180, 0])}deg)`, zIndex: 3 }}>VS</div>
    </AbsoluteFill>
  );
};

// Items pop in one by one as cards (chips) or as a checklist
export const ListScene: React.FC<{ scene: ListProps; accent: string; durationInFrames: number }> = ({ scene, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = scene.items.slice(0, 6);
  const gap = Math.max(4, Math.min(12, Math.floor((durationInFrames * 0.6) / Math.max(1, items.length))));
  const title = pop(frame, fps, 0, 220, 16);
  const checks = scene.style === 'checks';
  return (
    <AbsoluteFill>
      {scene.title ? (
        <div style={{ position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', fontFamily: FONT_DISPLAY, fontSize: 110, color: '#fff', textTransform: 'uppercase', transform: `scale(${title})`, textShadow: `0 0 50px ${accent}66` }}>
          {scene.title}
        </div>
      ) : null}
      <div style={{ position: 'absolute', top: scene.title ? 420 : 300, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 28 }}>
        {items.map((it, i) => {
          const at = 4 + i * gap;
          const p = pop(frame, fps, at, 260, 15);
          const dir = i % 2 ? 1 : -1;
          const tick = easeIn(frame, at + 3, 8);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                padding: '28px 40px',
                borderRadius: 28,
                background: COLORS.panel,
                border: `3px solid ${i === items.length - 1 ? accent : 'rgba(255,255,255,0.15)'}`,
                transform: `translateX(${interpolate(p, [0, 1], [900 * dir, 0])}px) rotate(${interpolate(p, [0, 1], [8 * dir, dir * -1])}deg)`,
                opacity: frame >= at ? 1 : 0,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              {checks ? (
                <Check size={92} p={tick} color={accent} />
              ) : (
                <div style={{ width: 92, height: 92, borderRadius: 24, background: accent, color: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 64 }}>{i + 1}</div>
              )}
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: it.length > 18 ? 76 : 100, color: '#fff', textTransform: 'uppercase', lineHeight: 1.05 }}>{it}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const fadeOnly = (frame: number) => interpolate(frame, [0, 6], [0, 1], clamp);
