import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeIn, glide, pop } from '../components/anim';
import { FONT_DISPLAY, FONT_UI } from '../theme';
import { PhoneScene as Props } from '../types';

const W = 580; // screen width
const H = 1040; // screen height

// A generic (unbranded) phone that walks through a feature: tap "more" -> menu slides up -> tap an item -> edit mode
export const PhoneScene: React.FC<{ scene: Props; accent: string; durationInFrames: number }> = ({ scene, accent, durationInFrames: D }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = glide(frame, fps, 0);
  const tilt = interpolate(enter, [0, 1], [-38, -12]) + Math.sin(frame / 25) * 3;
  const y = interpolate(enter, [0, 1], [700, 0]);

  const menu = (scene.menu && scene.menu.length ? scene.menu : ['Share', scene.select, 'Delete']).slice(0, 5);
  const selIdx = Math.max(0, menu.findIndex((m) => m.toLowerCase() === scene.select.toLowerCase()));
  const tTap1 = Math.round(Math.max(14, D * 0.18));
  const tMenu = tTap1 + 5;
  const tTap2 = Math.round(Math.max(tMenu + 14, D * 0.48));
  const tEdit = tTap2 + 8;

  // finger position (screen coords)
  const dots = { x: W - 50, y: 92 };
  const itemY = (i: number) => H - (menu.length - i) * 96 - 40;
  const target = { x: W / 2, y: itemY(selIdx) + 40 };
  const start = { x: W * 0.55, y: H + 140 };
  const toDots = easeIn(frame, tTap1 - 12, 11);
  const toItem = easeIn(frame, tTap2 - 12, 11);
  const fx = interpolate(toItem, [0, 1], [interpolate(toDots, [0, 1], [start.x, dots.x]), target.x]);
  const fy = interpolate(toItem, [0, 1], [interpolate(toDots, [0, 1], [start.y, dots.y]), target.y]);
  const fingerOut = easeIn(frame, tEdit + 4, 8);
  const press = (at: number) => interpolate(frame, [at, at + 3, at + 7], [1, 0.8, 1], clamp);
  const fingerScale = press(tTap1) * press(tTap2);
  const ripple = (at: number) => {
    const p = interpolate(frame, [at, at + 14], [0, 1], clamp);
    return { s: 0.2 + p * 2.2, o: frame >= at ? 0.7 * (1 - p) : 0 };
  };
  const r1 = ripple(tTap1);
  const r2 = ripple(tTap2);

  const menuIn = frame >= tMenu ? glide(frame, fps, tMenu) : 0;
  const menuOut = easeIn(frame, tEdit, 8);
  const sheetY = interpolate(menuIn, [0, 1], [H, 0]) + menuOut * H;
  const selectFlash = interpolate(frame, [tTap2, tTap2 + 4, tTap2 + 14], [0, 1, 0.85], clamp);
  const edit = frame >= tEdit ? pop(frame, fps, tEdit, 200, 16) : 0;
  const draw = easeIn(frame, tEdit + 6, 22);
  const pill = frame >= tEdit + 4 ? pop(frame, fps, tEdit + 4, 260, 13) : 0;

  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <div
        style={{
          position: 'absolute',
          left: (1080 - W - 40) / 2,
          top: 170,
          width: W + 40,
          height: H + 40,
          borderRadius: 78,
          background: 'linear-gradient(145deg,#3a3a46,#111118)',
          boxShadow: `0 60px 120px rgba(0,0,0,0.7), 0 0 0 3px #55556a, 0 0 90px ${accent}44`,
          transform: `translateY(${y}px) rotateY(${tilt}deg) rotateX(6deg)`,
          transformStyle: 'preserve-3d',
          padding: 20,
        }}
      >
        <div style={{ position: 'relative', width: W, height: H, borderRadius: 60, overflow: 'hidden', background: '#000' }}>
          {/* the "post": an abstract illustrated photo */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${accent} 0%, #7B2BFF 55%, #12002e 100%)` }} />
          <div style={{ position: 'absolute', left: 300, top: 260, width: 150, height: 150, borderRadius: 150, background: '#FFF3B0', boxShadow: '0 0 80px #FFF3B0' }} />
          <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
            <polygon points={`0,${H} 0,640 160,520 300,660 420,560 ${W},640 ${W},${H}`} fill="#1a0b3b" opacity={0.85} />
            <polygon points={`0,${H} 0,740 140,660 260,760 380,690 ${W},770 ${W},${H}`} fill="#0b0420" />
          </svg>
          {/* story chrome */}
          <div style={{ position: 'absolute', top: 30, left: 24, right: 24, display: 'flex', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.35)', overflow: 'hidden' }}>
                <div style={{ width: i === 0 ? '100%' : i === 1 ? `${Math.min(100, (frame / D) * 140)}%` : '0%', height: '100%', background: '#fff' }} />
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', top: 60, left: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: 54, background: '#fff', border: `4px solid ${accent}` }} />
            <div style={{ width: 150, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.85)' }} />
          </div>
          <div style={{ position: 'absolute', top: dots.y - 14, left: dots.x - 30, width: 60, height: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: 11, background: '#fff' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 30, left: 24, right: 24, height: 64, borderRadius: 40, border: '2px solid rgba(255,255,255,0.6)' }} />

          {/* edit mode: toolbar + a doodle being drawn */}
          <div style={{ position: 'absolute', top: 140, right: 22, display: 'flex', flexDirection: 'column', gap: 18, opacity: edit, transform: `translateX(${interpolate(edit, [0, 1], [90, 0])}px)` }}>
            {['Aa', '♫', '★', '✎'].map((g, i) => (
              <div key={i} style={{ width: 72, height: 72, borderRadius: 72, background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.8)', color: '#fff', fontFamily: FONT_UI, fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {g}
              </div>
            ))}
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
            <path d="M70 470 C 140 380, 210 560, 280 460 S 400 380, 420 500" fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - draw)} />
          </svg>

          {/* bottom sheet menu */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: frame >= tMenu ? Math.min(menuIn, 1 - menuOut) : 0 }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, transform: `translateY(${sheetY}px)`, background: '#1c1c24', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 22, paddingBottom: 40 }}>
            <div style={{ width: 80, height: 8, borderRadius: 8, background: '#555', margin: '0 auto 18px' }} />
            {menu.map((m, i) => {
              const sel = i === selIdx;
              return (
                <div
                  key={i}
                  style={{
                    height: 96,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 40px',
                    fontFamily: FONT_UI,
                    fontWeight: 800,
                    fontSize: 36,
                    color: sel && selectFlash > 0.5 ? '#0A0A0A' : m.toLowerCase().includes('delete') ? '#FF5A6E' : '#fff',
                    background: sel ? `rgba(${hexToRgb(accent)},${selectFlash})` : 'transparent',
                  }}
                >
                  {m}
                </div>
              );
            })}
          </div>

          {/* touch indicator */}
          <div style={{ position: 'absolute', left: fx - 45, top: fy - 45, width: 90, height: 90, borderRadius: 90, border: '4px solid #fff', background: 'rgba(255,255,255,0.35)', transform: `scale(${fingerScale})`, opacity: 1 - fingerOut }} />
          {[r1, r2].map((r, i) => (
            <div key={i} style={{ position: 'absolute', left: (i === 0 ? dots.x : target.x) - 45, top: (i === 0 ? dots.y : target.y) - 45, width: 90, height: 90, borderRadius: 90, border: `6px solid ${accent}`, transform: `scale(${r.s})`, opacity: r.o }} />
          ))}
        </div>
      </div>

      {/* result pill */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${pill}) rotate(${interpolate(pill, [0, 1], [-12, -4])}deg)`,
          opacity: pill > 0 ? 1 : 0,
        }}
      >
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 96, color: '#0A0A0A', background: accent, padding: '6px 40px', borderRadius: 24, boxShadow: `0 20px 60px ${accent}88`, textTransform: 'uppercase', transform: `translateY(${interpolate(frame, [tEdit, tEdit + 60], [0, -10], { ...clamp, easing: Easing.inOut(Easing.sin) })}px)` }}>
          {scene.result || scene.select}
        </div>
      </div>
    </AbsoluteFill>
  );
};

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
