import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeIn, pop, shake } from '../components/anim';
import { FONT_DISPLAY, FONT_UI } from '../theme';
import { CountdownScene as CountdownProps, StatScene as StatProps } from '../types';

// Big number that counts up, with shock rings and a label underneath
export const StatScene: React.FC<{ scene: StatProps; accent: string; durationInFrames: number }> = ({ scene, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countLen = Math.min(30, Math.round(durationInFrames * 0.45));
  const p = interpolate(frame, [4, 4 + countLen], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
  const dec = scene.decimals ?? (Number.isInteger(scene.value) ? 0 : 1);
  const val = (scene.value * p).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const land = 4 + countLen;
  const punch = pop(frame, fps, land, 380, 12);
  const s = frame >= land ? interpolate(punch, [0, 1], [1.25, 1]) : interpolate(p, [0, 1], [0.6, 1]);
  const sh = shake(frame, land, 16, 8);
  const label = pop(frame, fps, land + 3, 220, 16);
  const text = `${scene.prefix || ''}${val}${scene.suffix || ''}`;
  const size = text.length > 7 ? 230 : text.length > 4 ? 300 : 380;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {[0, 1, 2].map((i) => {
        const rp = interpolate(frame - land - i * 5, [0, 26], [0, 1], clamp);
        return (
          <div key={i} style={{ position: 'absolute', left: 540 - 300, top: 600 - 300, width: 600, height: 600, borderRadius: 600, border: `8px solid ${accent}`, transform: `scale(${0.3 + rp * 1.4})`, opacity: frame >= land + i * 5 ? 0.7 * (1 - rp) : 0 }} />
        );
      })}
      <div style={{ position: 'absolute', top: 420, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: size, lineHeight: 1, color: accent, transform: `scale(${s})`, textShadow: `0 0 80px ${accent}99, 0 14px 0 rgba(0,0,0,0.4)` }}>{text}</div>
        <div style={{ marginTop: 30, fontFamily: FONT_UI, fontWeight: 900, fontSize: 56, color: '#fff', textTransform: 'uppercase', letterSpacing: 2, opacity: label, transform: `translateY(${interpolate(label, [0, 1], [40, 0])}px)`, padding: '0 80px' }}>
          {scene.label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const fmt = (sec: number) => {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// Ring timer that winds down fast (time-lapse) with ticking digits
export const CountdownScene: React.FC<{ scene: CountdownProps; accent: string; durationInFrames: number }> = ({ scene, accent, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = pop(frame, fps, 0, 180, 16);
  const run = interpolate(frame, [8, durationInFrames - 4], [0, 0.85], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const remaining = scene.seconds * (1 - run);
  const R = 300;
  const C = 2 * Math.PI * R;
  const tick = Math.floor(frame / 3) % 2 === 0 ? 1 : 0.985;
  const label = pop(frame, fps, 8, 220, 16);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 540 - 360, top: 300, width: 720, height: 720, transform: `scale(${interpolate(enter, [0, 1], [0.4, 1]) * tick}) rotate(${interpolate(enter, [0, 1], [-90, 0])}deg)` }}>
        <svg width={720} height={720}>
          <circle cx={360} cy={360} r={R} stroke="rgba(255,255,255,0.12)" strokeWidth={44} fill="rgba(0,0,0,0.45)" />
          <circle cx={360} cy={360} r={R} stroke={accent} strokeWidth={44} fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * run} transform="rotate(-90 360 360)" style={{ filter: `drop-shadow(0 0 24px ${accent})` }} />
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            const r1 = R - 50;
            const r2 = i % 5 === 0 ? R - 80 : R - 64;
            return <line key={i} x1={360 + Math.cos(a) * r1} y1={360 + Math.sin(a) * r1} x2={360 + Math.cos(a) * r2} y2={360 + Math.sin(a) * r2} stroke="rgba(255,255,255,0.5)" strokeWidth={i % 5 === 0 ? 5 : 2} />;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 200, color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>{fmt(remaining)}</div>
      </div>
      <div style={{ position: 'absolute', top: 1080, left: 0, right: 0, textAlign: 'center', fontFamily: FONT_UI, fontWeight: 900, fontSize: 54, color: accent, textTransform: 'uppercase', letterSpacing: 3, opacity: label, transform: `translateY(${interpolate(label, [0, 1], [30, 0])}px)` }}>
        {scene.label}
      </div>
    </AbsoluteFill>
  );
};

export const usePulse = (frame: number) => easeIn(frame, 0, 10);
