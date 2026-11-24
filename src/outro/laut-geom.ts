// Geometri & gerak murni (tanpa React) untuk OutroBasabasiLaut — dipakai komposisi DAN skrip QC.
import {spring} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const prog = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));

// ---- Timing ----
export const T = {
  layersIn: [0, 10, 20], // belakang, tengah, depan
  sunRise: [30, 75],
  shipIn: 75,
  sailL: 104, // klik tegak ±112
  sailR: 114, // klik tegak ±122
  shift: [118, 140], // grup kapal+matahari naik, dasar laut terangkat
  seaBottom: [118, 136],
  calm: [118, 156], // amplitudo mengecil
  basa: 134,
  basi: 142,
  stagger: 2,
  trip: 148,
  sway: 150,
  cta1: 156,
  cta2: 160,
};

// ---- Ombak ----
export type Layer = {color: string; base0: number; base1: number; A0: number; A1: number; lambda: number; omega: number; phi: number};
export const LAYERS: Layer[] = [
  {color: '#BDE9FB', base0: 1300, base1: 828, A0: 20, A1: 3, lambda: 460, omega: 0.045, phi: 0.4},
  {color: '#3EB5EF', base0: 1342, base1: 854, A0: 24, A1: 3.5, lambda: 600, omega: 0.07, phi: 2.1},
  {color: '#1E9BDC', base0: 1386, base1: 882, A0: 26, A1: 4, lambda: 760, omega: 0.1, phi: 4.0},
];
export const FRONT = 2;
export const SEA_BOTTOM_FINAL = 964;

export const shiftP = (f: number) => easeInOut(prog(f, T.shift[0], T.shift[1]));
export const calmP = (f: number) => easeInOut(prog(f, T.calm[0], T.calm[1]));
export const seaBottom = (f: number) => lerp(H + 40, SEA_BOTTOM_FINAL, easeInOut(prog(f, T.seaBottom[0], T.seaBottom[1])));

export const layerRise = (i: number, f: number) => 780 * (1 - spring({frame: f - T.layersIn[i], fps: FPS, config: {damping: 14, stiffness: 70, mass: 1}}));

export const waveY = (i: number, x: number, f: number) => {
  const L = LAYERS[i];
  const k = (2 * Math.PI) / L.lambda;
  const amp = lerp(L.A0, L.A1, calmP(f));
  const base = lerp(L.base0, L.base1, shiftP(f)) + layerRise(i, f);
  return base + (amp * (Math.sin(k * x - L.omega * f + L.phi) + 0.35 * Math.sin(2.1 * k * x + 0.6 * L.omega * f + L.phi + 1.3))) / 1.35;
};
export const waveSlope = (i: number, x: number, f: number) => (waveY(i, x + 1, f) - waveY(i, x - 1, f)) / 2;

// ---- Matahari ----
export const SUN_R = 88;
const SUN_PERCH = 814; // pusat matahari saat bertengger (sebelum geser naik)
const SUN_HIDDEN = LAYERS[0].base0 + SUN_R + 60; // seluruhnya di balik lapis belakang
export const sunY = (f: number) => lerp(SUN_HIDDEN, SUN_PERCH, easeOutCubic(prog(f, T.sunRise[0], T.sunRise[1]))) - (LAYERS[FRONT].base0 - LAYERS[FRONT].base1) * shiftP(f);
export const sunGlow = (f: number) => lerp(0, 0.22, easeOutCubic(prog(f, T.sunRise[0], T.sunRise[1] + 10)));

// ---- Kapal (koordinat sumber logo-icon 2625px) ----
export const ICON_BBOX = {x0: 857, y0: 768, x1: 1767, y1: 1855};
export const HULL_BOTTOM = {x: 1230, y: 1855}; // titik terendah lambung = titik kontak dengan air
export const LOCK_S = 0.55; // skala lockup di layar (proporsi ikon:wordmark sama dengan file lockup)
export const ICON_TO_LOCK = 616 / 910; // logo-icon → ukuran ikon di logo-lockup (diukur: 0,677)
export const SHIP_S = LOCK_S * ICON_TO_LOCK;
const SINK = 4; // lambung sedikit "duduk" di air (px layar)
const SHIP_X_FINAL = W / 2 - ((ICON_BBOX.x0 + ICON_BBOX.x1) / 2 - HULL_BOTTOM.x) * SHIP_S; // ikon tepat di tengah
const SHIP_X_START = -260;

export const shipX = (f: number) => {
  const s = spring({frame: f - T.shipIn, fps: FPS, config: {damping: 14, stiffness: 38, mass: 1}});
  return lerp(SHIP_X_START, SHIP_X_FINAL, s);
};
export const shipPose = (f: number, freeze = false) => {
  const x = shipX(f);
  const y = waveY(FRONT, x, f) + SINK; // dasar lambung menempel permukaan lapis depan
  const slopeDeg = (Math.atan(waveSlope(FRONT, x, f)) * 180) / Math.PI;
  const swayAmp = spring({frame: f - T.sway, fps: FPS, config: {damping: 14, stiffness: 60}});
  const sway = 1.2 * swayAmp * Math.sin((2 * Math.PI * (f - T.sway)) / FPS);
  return {x, y, rot: freeze ? 0 : 0.3 * slopeDeg + sway};
};

// ---- Wordmark (koordinat lockup 2625px) ----
export const WORD_BBOX = {x0: 1236, y0: 954, x1: 2165, y1: 1618};
export const WORD_TOP = 1012;
export const WORD_LEFT = W / 2 - ((WORD_BBOX.x1 - WORD_BBOX.x0) * LOCK_S) / 2;
export const CTA_TOP = WORD_TOP + (WORD_BBOX.y1 - WORD_BBOX.y0) * LOCK_S + 44;
