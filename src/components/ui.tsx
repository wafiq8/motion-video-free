import React from 'react';
import {Easing, Img, interpolate, staticFile} from 'remotion';
import {fitText, measureText} from '@remotion/layout-utils';
import {C, FONT, MAX_TEXT_W} from '../theme';

// ---------- animasi deterministik (semua dari t = detik absolut) ----------
export const prog = (t: number, at: number, dur = 0.35) =>
  interpolate(t, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
export const popScale = (t: number, at: number, dur = 0.4) =>
  interpolate(t, [at, at + dur * 0.6, at + dur], [0.6, 1.08, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});

export const Appear: React.FC<{t: number; at: number; dy?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({t, at, dy = 40, style, children}) => {
  const p = prog(t, at);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>;
};
export const Pop: React.FC<{t: number; at: number; style?: React.CSSProperties; children: React.ReactNode}> = ({t, at, style, children}) => (
  <div style={{opacity: prog(t, at, 0.2), transform: `scale(${t < at ? 0.6 : popScale(t, at)})`, ...style}}>{children}</div>
);

// ---------- teks terukur (anti-kepotong) ----------
export type Seg = {text: string; accent?: boolean | 'teal'};
export const fitSize = (lines: string[], weight: number, max: number, width = MAX_TEXT_W, letterSpacing = 0) => {
  let size = max;
  for (const l of lines) {
    const f = fitText({text: l, withinWidth: width, fontFamily: FONT, fontWeight: weight, letterSpacing: `${letterSpacing}em`});
    size = Math.min(size, f.fontSize);
  }
  return Math.floor(size);
};
export const textW = (text: string, size: number, weight: number, letterSpacing = 0) =>
  measureText({text, fontFamily: FONT, fontSize: size, fontWeight: weight, letterSpacing: `${letterSpacing}em`}).width;

/** Headline: baris eksplisit, ukuran = min(maks, hasil fit). Maks SATU segmen beraksen. */
export const Headline: React.FC<{lines: Seg[][]; max: number; weight?: number; min?: number; width?: number; align?: 'center' | 'left'; lineHeight?: number}> = ({lines, max, weight = 900, min = 44, width = MAX_TEXT_W, align = 'center', lineHeight = 1.08}) => {
  const raw = lines.map((l) => l.map((s) => s.text).join(''));
  const size = fitSize(raw, weight, max, width);
  if (size < min) throw new Error(`Headline di bawah lantai keterbacaan: "${raw.join(' / ')}" → ${size}px`);
  return (
    <div style={{width, textAlign: align, fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight, color: C.white, whiteSpace: 'pre', textShadow: '0 4px 18px rgba(0,0,0,0.45)'}}>
      {lines.map((l, i) => (
        <div key={i}>
          {l.map((s, j) => (
            <span key={j} style={{color: s.accent === 'teal' ? C.teal : s.accent ? C.accent : C.white}}>{s.text}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

// ---------- elemen tetap ----------
export const TopicPill: React.FC<{label: string}> = ({label}) => (
  <div style={{position: 'absolute', top: 262, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
    <div style={{border: `3px solid rgba(255,255,255,0.85)`, borderRadius: 999, padding: '12px 34px', fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: '0.22em', color: C.white, background: 'rgba(10,22,48,0.35)'}}>
      {label}
    </div>
  </div>
);

export const Sitasi: React.FC<{text: string; opacity?: number}> = ({text, opacity = 1}) => {
  const size = Math.min(26, fitSize([text], 600, 26));
  return (
    <div style={{position: 'absolute', top: 1408, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: size, color: C.dim, opacity, textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>
      {text}
    </div>
  );
};

export const Chip: React.FC<{text: string; color?: string; style?: React.CSSProperties}> = ({text, color = C.teal, style}) => (
  <div style={{display: 'inline-block', border: `2px solid ${color}`, color, borderRadius: 10, padding: '8px 18px', fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: '0.12em', background: 'rgba(10,22,48,0.7)', ...style}}>
    {text}
  </div>
);

export const FotoKredit: React.FC<{text: string; bawah?: boolean}> = ({text, bawah}) => (
  <div style={{whiteSpace: 'nowrap', fontSize: Math.min(22, fitSize([text], 600, 22, bawah ? 972 : 680)), position: 'absolute', ...(bawah ? {top: 1366, left: 54, right: 54, maxWidth: 'none', textAlign: 'center', background: 'transparent'} : {top: 350, right: 54}), fontFamily: FONT, fontWeight: 600, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.45)', padding: '6px 12px', borderRadius: 8, maxWidth: 700, textAlign: 'right', ...(bawah ? {maxWidth: 'none', textAlign: 'center', background: 'transparent', padding: 0, color: 'rgba(147,166,204,0.95)'} : {})}}>
    {text}
  </div>
);

/** Foto selalu ber-Ken Burns: zoom lambat 1.00 → 1.10 sepanjang rentang [a, b] detik (v3.3) */
export const Foto: React.FC<{src: string; t: number; a: number; b: number; style?: React.CSSProperties; pos?: string; origin?: string}> = ({src, t, a, b, style, pos = 'center', origin = '50% 35%'}) => {
  const k = interpolate(t, [a, b], [1.0, 1.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{width: '100%', height: '100%', overflow: 'hidden'}}>
      <Img src={staticFile(`foto/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${k})`, transformOrigin: origin, ...style}} />
    </div>
  );
};

/** Foto lingkaran untuk kartu tokoh (aturan foto tokoh v3.3) */
export const FotoBulat: React.FC<{src: string; size: number; t: number; a: number; b: number; pos?: string; ring?: string}> = ({src, size, t, a, b, pos = '50% 25%', ring = C.white}) => (
  <div style={{width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: `${Math.max(4, size * 0.025)}px solid ${ring}`, boxShadow: '0 10px 30px rgba(0,0,0,0.4)', flexShrink: 0}}>
    <Foto src={src} t={t} a={a} b={b} pos={pos} />
  </div>
);

// ---------- tanda vonis ----------
export const Cross: React.FC<{size?: number; color?: string; p?: number}> = ({size = 120, color = C.accent, p = 1}) => {
  const L = 2 * Math.SQRT2 * 40;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <line x1="22" y1="22" x2="78" y2="78" stroke={color} strokeWidth="14" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - Math.min(1, p * 2))} />
      <line x1="78" y1="22" x2="22" y2="78" stroke={color} strokeWidth="14" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - Math.max(0, p * 2 - 1))} />
    </svg>
  );
};
export const Check: React.FC<{size?: number; color?: string; p?: number}> = ({size = 120, color = C.teal, p = 1}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <polyline points="18,54 42,76 84,26" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={110} strokeDashoffset={110 * (1 - p)} />
  </svg>
);
