import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, pop, shake } from '../components/anim';
import { FONT_DISPLAY, FONT_UI } from '../theme';
import { HookScene as Props } from '../types';

// Opening title: kicker tag slides in, then each word slams onto the screen with a camera shake
export const HookScene: React.FC<{ scene: Props; accent: string }> = ({ scene, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = scene.title.toUpperCase().split(/\s+/).filter(Boolean);
  const stagger = Math.max(3, Math.min(6, Math.floor(28 / Math.max(1, words.length))));
  const firstSlam = 6;
  let sx = 0;
  let sy = 0;
  words.forEach((_, i) => {
    const s = shake(frame, firstSlam + i * stagger, 10, 7);
    sx += s.x;
    sy += s.y;
  });
  const kick = pop(frame, fps, 0, 200, 16);
  const size = words.join(' ').length > 26 ? 150 : 180;
  const breathe = 1 + 0.015 * Math.sin(frame / 10);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translate(${sx}px, ${sy}px)` }}>
      <div style={{ position: 'absolute', top: 420, width: 960, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {scene.kicker ? (
          <div
            style={{
              fontFamily: FONT_UI,
              fontWeight: 900,
              fontSize: 40,
              letterSpacing: 6,
              color: '#0A0A0A',
              background: accent,
              padding: '10px 26px',
              marginBottom: 34,
              transform: `translateX(${interpolate(kick, [0, 1], [-700, 0])}px) skewX(-10deg)`,
              boxShadow: `0 0 40px ${accent}88`,
            }}
          >
            {scene.kicker.toUpperCase()}
          </div>
        ) : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 26px', transform: `scale(${breathe})` }}>
          {words.map((w, i) => {
            const at = firstSlam + i * stagger;
            const p = pop(frame, fps, at, 320, 15);
            const visible = frame >= at;
            const scale = interpolate(p, [0, 1], [2.6, 1]);
            const blur = interpolate(frame - at, [0, 5], [18, 0], clamp);
            const isAccent = i === words.length - 1 || /\d/.test(w);
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: size,
                  lineHeight: 1.02,
                  color: isAccent ? accent : '#fff',
                  opacity: visible ? interpolate(p, [0, 0.3], [0, 1], clamp) : 0,
                  transform: `scale(${scale})`,
                  filter: `blur(${blur}px)`,
                  textShadow: `0 10px 0 rgba(0,0,0,0.35), 0 0 60px ${isAccent ? accent + '88' : 'rgba(0,0,0,0.6)'}`,
                  display: 'inline-block',
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
