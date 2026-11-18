import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_UI } from '../theme';
import { Word } from '../types';
import { clamp } from './anim';

type Page = { words: Word[]; start: number; end: number };

// Group words into short "pages" of up to 3 words, breaking on pauses and sentence ends
const toPages = (words: Word[]): Page[] => {
  const pages: Page[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) pages.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (cur.length && (cur.length >= 3 || (prev && w.start - prev.end > 0.35))) flush();
    cur.push(w);
    if (/[.!?,:;]$/.test(w.text)) flush();
  });
  flush();
  // Hold each page until the next one starts (no flicker in short gaps)
  return pages.map((p, i) => ({ ...p, end: i + 1 < pages.length ? Math.min(pages[i + 1].start, p.end + 0.6) : p.end + 0.6 }));
};

export const Captions: React.FC<{ words: Word[]; accent: string; top?: number }> = ({ words, accent, top = 1290 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pages = useMemo(() => toPages(words), [words]);
  const page = pages.find((p) => t >= p.start - 0.05 && t < p.end);
  if (!page) return null;
  const pageFrame = frame - Math.round((page.start - 0.05) * fps);
  const enter = spring({ frame: pageFrame, fps, config: { stiffness: 260, damping: 18, mass: 0.5 } });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top,
          left: 60,
          right: 60,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px 30px',
          transform: `scale(${interpolate(enter, [0, 1], [0.7, 1])}) translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
          opacity: interpolate(enter, [0, 0.4], [0, 1], clamp),
        }}
      >
        {page.words.map((w, i) => {
          const active = t >= w.start - 0.03 && t < w.end + 0.05;
          const spoken = t >= w.start - 0.03;
          const wf = frame - Math.round(w.start * fps);
          const bump = active ? spring({ frame: wf, fps, config: { stiffness: 400, damping: 16, mass: 0.4 } }) : 0;
          const s = active ? interpolate(bump, [0, 1], [1.0, 1.1]) : 1;
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT_UI,
                fontWeight: 900,
                fontSize: 84,
                lineHeight: 1.05,
                textTransform: 'uppercase',
                color: active ? '#0A0A0A' : '#FFFFFF',
                background: active ? accent : 'transparent',
                padding: '2px 14px',
                borderRadius: 14,
                transform: `scale(${s}) rotate(${active ? -2 : 0}deg)`,
                opacity: spoken ? 1 : 0.55,
                WebkitTextStroke: active ? '0px' : '3px #000',
                paintOrder: 'stroke fill',
                textShadow: active ? 'none' : '0 6px 18px rgba(0,0,0,0.85)',
                boxShadow: active ? `0 10px 30px ${accent}66` : 'none',
              }}
            >
              {w.text.replace(/[,;:]$/, '')}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
