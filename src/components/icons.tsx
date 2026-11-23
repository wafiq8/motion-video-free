import React from 'react';
import {C} from '../theme';

// Ilustrasi vektor datar dari kode (tanpa file gambar, tanpa AI)

export const Kursi: React.FC<{size?: number; color?: string}> = ({size = 300, color = C.teal}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="52" y="20" width="96" height="92" rx="16" fill={color} />
    <rect x="62" y="30" width="76" height="72" rx="10" fill={C.bg} opacity="0.25" />
    <rect x="40" y="104" width="120" height="30" rx="10" fill={color} />
    <rect x="30" y="80" width="18" height="54" rx="8" fill={color} />
    <rect x="152" y="80" width="18" height="54" rx="8" fill={color} />
    <rect x="52" y="134" width="14" height="52" rx="5" fill={color} />
    <rect x="134" y="134" width="14" height="52" rx="5" fill={color} />
  </svg>
);

/** Amplop putih; open 0..1 membuka tutup, letter 0..1 menarik surat keluar */
export const Amplop: React.FC<{w?: number; open: number; letter: number}> = ({w = 620, open, letter}) => {
  const flapY = 60 + (1 - open) * 0; // engsel di y=60
  const flipScale = 1 - 2 * open; // 1 → -1
  return (
    <svg width={w} height={w * 0.95} viewBox="0 0 400 380" style={{overflow: 'visible'}}>
      {/* surat */}
      <g transform={`translate(0, ${-letter * 150})`}>
        <rect x="70" y="100" width="260" height="210" rx="8" fill="#F3F6FC" />
        <rect x="100" y="135" width="200" height="14" rx="7" fill={C.line} />
        <rect x="100" y="165" width="160" height="14" rx="7" fill={C.line} />
        <rect x="100" y="205" width="90" height="34" rx="8" fill={C.accent} />
        <rect x="210" y="205" width="90" height="34" rx="8" fill={C.teal} />
      </g>
      {/* badan amplop */}
      <path d="M40 140 L360 140 L360 340 L40 340 Z" fill="#FFFFFF" />
      <path d="M40 340 L200 230 L360 340 Z" fill="#E4E9F4" />
      <path d="M40 140 L200 260 L360 140" fill="none" stroke="#D3DAEA" strokeWidth="3" />
      {/* tutup */}
      <g transform={`translate(0, 140) scale(1, ${flipScale}) translate(0, -140)`}>
        <path d="M40 140 L200 260 L360 140 Z" fill={open > 0.5 ? '#DDE3F0' : '#F6F8FC'} stroke="#D3DAEA" strokeWidth="3" />
      </g>
      <circle cx="200" cy={flapY + 180} r="0" />
    </svg>
  );
};

export const Pin: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.accent}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
    <path d="M50 126 C50 126 10 78 10 48 A40 40 0 0 1 90 48 C90 78 50 126 50 126 Z" fill={color} />
    <circle cx="50" cy="48" r="16" fill={C.bg} />
  </svg>
);

export const Jam: React.FC<{size?: number; h: number; m: number}> = ({size = 140, h, m}) => {
  const ma = (m / 60) * 360;
  const ha = ((h % 12) / 12) * 360 + (m / 60) * 30;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke={C.white} strokeWidth="8" />
      <line x1="50" y1="50" x2="50" y2="24" stroke={C.white} strokeWidth="8" strokeLinecap="round" transform={`rotate(${ha} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="14" stroke={C.accent} strokeWidth="6" strokeLinecap="round" transform={`rotate(${ma} 50 50)`} />
      <circle cx="50" cy="50" r="6" fill={C.white} />
    </svg>
  );
};

export const Surat: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 80 100">
    <path d="M6 4 H56 L74 22 V96 H6 Z" fill="#F3F6FC" />
    <path d="M56 4 V22 H74" fill="#D3DAEA" />
    <rect x="16" y="34" width="46" height="7" rx="3" fill={C.line} />
    <rect x="16" y="50" width="36" height="7" rx="3" fill={C.line} />
    <rect x="16" y="66" width="22" height="12" rx="3" fill={C.accent} />
    <rect x="42" y="66" width="22" height="12" rx="3" fill={C.teal} />
  </svg>
);

/** Gedung parlemen bergaya kubah kembar (ilustrasi, bukan replika) */
export const GedungParlemen: React.FC<{w?: number; color?: string}> = ({w = 360, color = C.teal}) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 240 120">
    <path d="M30 70 Q75 10 120 70 Z" fill={color} />
    <path d="M120 70 Q165 10 210 70 Z" fill={color} opacity="0.85" />
    <rect x="20" y="70" width="200" height="12" fill={C.white} />
    {Array.from({length: 9}).map((_, i) => (
      <rect key={i} x={28 + i * 23} y="82" width="8" height="26" fill={C.white} opacity="0.9" />
    ))}
    <rect x="12" y="108" width="216" height="10" fill={C.white} />
  </svg>
);

/** Siluet datar sederhana, wajah kosong */
export const Siluet: React.FC<{size?: number; color?: string}> = ({size = 160, color = C.dim}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="34" r="20" fill={color} />
    <path d="M14 96 C14 66 30 58 50 58 C70 58 86 66 86 96 Z" fill={color} />
  </svg>
);

export const Kalender: React.FC<{w?: number; hari: string; tgl: string; bulan: string; color?: string; dim?: boolean}> = ({w = 300, hari, tgl, bulan, color = C.accent, dim}) => (
  <div style={{width: w, borderRadius: 24, overflow: 'hidden', background: C.white, opacity: dim ? 0.55 : 1, boxShadow: '0 12px 30px rgba(0,0,0,0.35)', fontFamily: 'Inter', textAlign: 'center'}}>
    <div style={{background: color, color: C.white, fontWeight: 800, fontSize: w * 0.12, padding: `${w * 0.04}px 0`, letterSpacing: '0.1em'}}>{hari}</div>
    <div style={{color: C.bg, fontWeight: 900, fontSize: w * 0.42, lineHeight: 1.05}}>{tgl}</div>
    <div style={{color: C.bg, fontWeight: 800, fontSize: w * 0.11, paddingBottom: w * 0.05, letterSpacing: '0.08em'}}>{bulan}</div>
  </div>
);

// ---------- ikon kasus makar (vektor datar dari kode) ----------
/** Lencana polisi generik (perisai + bintang) — bukan replika lambang resmi */
export const Lencana: React.FC<{size?: number; color?: string}> = ({size = 300, color = C.teal}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 200 230">
    <path d="M100 8 L180 38 C180 120 150 180 100 222 C50 180 20 120 20 38 Z" fill={color} />
    <path d="M100 30 L160 52 C160 116 138 162 100 196 C62 162 40 116 40 52 Z" fill={C.bg} opacity="0.28" />
    <path d="M100 62 L112 96 L148 96 L119 117 L130 152 L100 131 L70 152 L81 117 L52 96 L88 96 Z" fill={C.white} />
  </svg>
);
export const Dokumen: React.FC<{size?: number; band?: string}> = ({size = 120, band = C.accent}) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 80 100">
    <path d="M6 4 H56 L74 22 V96 H6 Z" fill="#F3F6FC" />
    <path d="M56 4 V22 H74" fill="#D3DAEA" />
    <rect x="6" y="10" width="40" height="12" fill={band} />
    <rect x="16" y="36" width="46" height="6" rx="3" fill={C.line} />
    <rect x="16" y="50" width="40" height="6" rx="3" fill={C.line} />
    <rect x="16" y="64" width="46" height="6" rx="3" fill={C.line} />
    <rect x="16" y="78" width="28" height="6" rx="3" fill={C.line} />
  </svg>
);
/** Headset sadap + gelombang sinyal; wave 0..1 */
export const Sadap: React.FC<{size?: number; wave?: number}> = ({size = 140, wave = 0}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M18 58 V48 A32 32 0 0 1 82 48 V58" fill="none" stroke={C.white} strokeWidth="8" strokeLinecap="round" />
    <rect x="10" y="54" width="18" height="30" rx="7" fill={C.teal} />
    <rect x="72" y="54" width="18" height="30" rx="7" fill={C.teal} />
    {[0, 1, 2].map((i) => {
      const k = (wave + i / 3) % 1;
      return <circle key={i} cx="50" cy="50" r={6 + k * 40} fill="none" stroke={C.accent} strokeWidth="3" opacity={(1 - k) * 0.8} />;
    })}
  </svg>
);
export const Bendera: React.FC<{size?: number}> = ({size = 140}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="16" y="8" width="6" height="88" rx="3" fill={C.white} />
    <path d="M22 12 H86 L76 30 L86 48 H22 Z" fill={C.accent} />
  </svg>
);
export const Palu: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.white}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g transform="rotate(-35 50 50)">
      <rect x="26" y="20" width="48" height="22" rx="6" fill={color} />
      <rect x="46" y="40" width="8" height="46" rx="4" fill={color} />
    </g>
    <rect x="14" y="84" width="56" height="10" rx="4" fill={color} opacity="0.8" />
  </svg>
);
export const Jeruji: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.white}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="8" fill="none" stroke={color} strokeWidth="7" />
    {[30, 50, 70].map((x) => <rect key={x} x={x - 3} y="10" width="6" height="80" fill={color} />)}
  </svg>
);
export const Uang: React.FC<{size?: number}> = ({size = 140}) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 160 100">
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${i * 8}, ${i * -8})`}>
        <rect x="10" y="30" width="130" height="64" rx="8" fill={C.teal} stroke={C.bg} strokeWidth="3" />
        <circle cx="75" cy="62" r="16" fill="none" stroke={C.white} strokeWidth="5" />
      </g>
    ))}
  </svg>
);
export const Timbangan: React.FC<{size?: number; tilt?: number}> = ({size = 160, tilt = 0}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="47" y="14" width="6" height="72" fill={C.white} />
    <rect x="30" y="84" width="40" height="8" rx="3" fill={C.white} />
    <g transform={`rotate(${tilt} 50 20)`}>
      <rect x="12" y="18" width="76" height="5" rx="2" fill={C.white} />
      <path d="M8 50 L20 22 L32 50 Z" fill="none" stroke={C.teal} strokeWidth="3" />
      <path d="M4 50 H36 A16 10 0 0 1 4 50 Z" fill={C.teal} />
      <path d="M68 50 L80 22 L92 50 Z" fill="none" stroke={C.teal} strokeWidth="3" />
      <path d="M64 50 H96 A16 10 0 0 1 64 50 Z" fill={C.teal} />
    </g>
  </svg>
);
