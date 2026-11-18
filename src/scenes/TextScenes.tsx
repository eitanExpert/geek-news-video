import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeIn, pop } from '../components/anim';
import { FONT_DISPLAY, FONT_UI } from '../theme';
import { BrollScene as BrollProps, OutroScene as OutroProps, QuoteScene as QuoteProps } from '../types';

// Footage-led scene: just a location-style tag; the footage and captions carry it
export const BrollScene: React.FC<{ scene: BrollProps; accent: string }> = ({ scene, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 4, 220, 18);
  if (!scene.tag) return null;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 200, left: 56, display: 'flex', alignItems: 'stretch', transform: `translateX(${interpolate(p, [0, 1], [-800, 0])}px)` }}>
        <div style={{ width: 14, background: accent }} />
        <div style={{ background: 'rgba(0,0,0,0.7)', padding: '14px 28px', fontFamily: FONT_UI, fontWeight: 900, fontSize: 44, color: '#fff', textTransform: 'uppercase', letterSpacing: 2 }}>{scene.tag}</div>
      </div>
    </AbsoluteFill>
  );
};

// Quote: big quote mark draws in, words appear one by one, source tag slides in
export const QuoteScene: React.FC<{ scene: QuoteProps; accent: string; durationInFrames: number }> = ({ scene, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = scene.text.split(/\s+/).filter(Boolean);
  const per = Math.max(1, Math.floor((durationInFrames * 0.55) / Math.max(1, words.length)));
  const mark = pop(frame, fps, 0, 200, 14);
  const src = pop(frame, fps, 6 + words.length * per, 220, 16);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 170, left: 70, fontFamily: FONT_DISPLAY, fontSize: 380, lineHeight: 1, color: accent, transform: `scale(${mark}) rotate(${interpolate(mark, [0, 1], [-30, 0])}deg)`, opacity: 0.9 }}>“</div>
      <div style={{ position: 'absolute', top: 400, left: 90, right: 90, fontFamily: FONT_UI, fontWeight: 800, fontSize: words.length > 18 ? 58 : 70, lineHeight: 1.2, color: '#fff' }}>
        {words.map((w, i) => (
          <span key={i} style={{ opacity: interpolate(frame, [4 + i * per, 7 + i * per], [0.12, 1], clamp) }}>{w} </span>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 980, right: 90, fontFamily: FONT_UI, fontWeight: 900, fontSize: 38, color: '#0A0A0A', background: accent, padding: '10px 24px', transform: `translateX(${interpolate(src, [0, 1], [600, 0])}px)` }}>— {scene.source}</div>
    </AbsoluteFill>
  );
};

// Closing: the question pops word by word, follow button pulses
export const OutroScene: React.FC<{ scene: OutroProps; accent: string; brand: string; sourceLine?: string }> = ({ scene, accent, brand, sourceLine }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = scene.question.toUpperCase().split(/\s+/).filter(Boolean);
  const btnAt = 6 + words.length * 4 + 6;
  const btn = pop(frame, fps, btnAt, 240, 12);
  const pulse = 1 + 0.04 * Math.sin((frame - btnAt) / 4) * (frame > btnAt + 10 ? 1 : 0);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 260, left: 70, right: 70, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 24px' }}>
        {words.map((w, i) => {
          const p = pop(frame, fps, 4 + i * 4, 300, 14);
          return (
            <span key={i} style={{ fontFamily: FONT_DISPLAY, fontSize: words.length > 6 ? 118 : 140, lineHeight: 1.05, color: w.endsWith('?') ? accent : '#fff', transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: frame >= 4 + i * 4 ? 1 : 0, display: 'inline-block' }}>
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${btn * pulse})`, fontFamily: FONT_UI, fontWeight: 900, fontSize: 44, color: '#0A0A0A', background: accent, padding: '22px 48px', borderRadius: 999, boxShadow: `0 0 50px ${accent}99` }}>
          {(scene.cta || `Follow ${brand} for daily geek news`).toUpperCase()}
        </div>
      </div>
      {sourceLine ? (
        <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center', fontFamily: FONT_UI, fontWeight: 600, fontSize: 28, color: 'rgba(255,255,255,0.6)', opacity: easeIn(frame, btnAt, 10) }}>{sourceLine}</div>
      ) : null}
    </AbsoluteFill>
  );
};
