import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Media } from '../types';
import { rand } from './anim';

// Animated "tech" backdrop: drifting colour glows, a perspective grid rushing toward the viewer and floating particles
export const Backdrop: React.FC<{ accent: string; seed: number }> = ({ accent, seed }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;
  const g1x = 30 + Math.sin(t * 0.7 + seed) * 22;
  const g1y = 25 + Math.cos(t * 0.5 + seed) * 12;
  const g2x = 70 + Math.cos(t * 0.6 + seed * 2) * 20;
  const g2y = 75 + Math.sin(t * 0.8 + seed) * 10;
  const gridShift = (frame * 6) % 120;
  const lines = [];
  for (let i = 0; i < 14; i++) {
    const y = height * 0.62 + Math.pow((i * 120 + gridShift) / 1680, 2) * height * 0.6;
    lines.push(<line key={'h' + i} x1={0} x2={width} y1={y} y2={y} stroke={accent} strokeOpacity={0.18 + i * 0.012} strokeWidth={2} />);
  }
  for (let i = -8; i <= 8; i++) {
    lines.push(
      <line key={'v' + i} x1={width / 2 + i * 40} y1={height * 0.62} x2={width / 2 + i * 260} y2={height} stroke={accent} strokeOpacity={0.16} strokeWidth={2} />,
    );
  }
  const particles = [];
  for (let i = 0; i < 28; i++) {
    const px = rand(seed * 100 + i) * width;
    const speed = 0.4 + rand(seed * 50 + i) * 1.4;
    const py = (height - ((frame * speed * 3 + rand(i + seed) * height) % height));
    const size = 2 + rand(i * 3 + seed) * 5;
    particles.push(
      <div key={i} style={{ position: 'absolute', left: px, top: py, width: size, height: size, borderRadius: size, background: accent, opacity: 0.25 + rand(i * 9) * 0.5, boxShadow: `0 0 ${size * 4}px ${accent}` }} />,
    );
  }
  const variant = seed % 4;
  return (
    <AbsoluteFill style={{ background: '#06060B', overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${g1x}% ${g1y}%, ${accent}55 0%, transparent 45%), radial-gradient(circle at ${g2x}% ${g2y}%, #4B2BFF55 0%, transparent 50%)` }} />
      {variant === 1 ? (
        // rotating light rays from behind the content
        <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${frame * 0.6}deg at 50% 38%, ${accent}22 0deg 7deg, transparent 7deg 20deg)`, maskImage: 'radial-gradient(circle at 50% 38%, #000 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at 50% 38%, #000 0%, transparent 70%)' }} />
      ) : variant === 2 ? (
        // drifting halftone dots
        <AbsoluteFill style={{ backgroundImage: `radial-gradient(${accent}55 3px, transparent 3.5px)`, backgroundSize: '36px 36px', backgroundPosition: `${frame * 1.2}px ${frame * 0.8}px`, maskImage: 'linear-gradient(160deg, #000 0%, transparent 65%)', WebkitMaskImage: 'linear-gradient(160deg, #000 0%, transparent 65%)' }} />
      ) : variant === 3 ? (
        // diagonal speed stripes
        <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(-55deg, ${accent}1f 0px, ${accent}1f 26px, transparent 26px, transparent 90px)`, backgroundPosition: `${frame * 5}px 0px`, maskImage: 'linear-gradient(180deg, transparent 0%, #000 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 40%, transparent 100%)' }} />
      ) : (
        <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
          {lines}
        </svg>
      )}
      {particles}
    </AbsoluteFill>
  );
};

// Full-screen footage or photo with a slow push-in, darkened for text legibility
export const MediaLayer: React.FC<{ media: Media; accent: string; durationInFrames: number; seed: number }> = ({ media, accent, durationInFrames, seed }) => {
  const frame = useCurrentFrame();
  const p = frame / Math.max(1, durationInFrames);
  const scale = interpolate(p, [0, 1], [1.08, 1.2]);
  const dir = seed % 2 === 0 ? 1 : -1;
  const x = interpolate(p, [0, 1], [0, 30 * dir]);
  const style: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${x}px)`, filter: 'saturate(1.25) contrast(1.1)' };
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      {media.kind === 'video' ? <OffthreadVideo src={media.src} muted style={style} /> : <Img src={media.src} style={style} />}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.75) 100%)` }} />
      <AbsoluteFill style={{ background: accent, mixBlendMode: 'soft-light', opacity: 0.25 }} />
      {media.credit ? (
        <div style={{ position: 'absolute', right: 28, bottom: 24, fontFamily: 'Arial, sans-serif', fontSize: 20, color: 'rgba(255,255,255,0.6)' }}>{media.credit}</div>
      ) : null}
    </AbsoluteFill>
  );
};
