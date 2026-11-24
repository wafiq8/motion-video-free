// Geometri & gerak murni (tanpa React) untuk OutroBasabasiLaut — dipakai komposisi DAN skrip QC.
// Koreografi v2: matahari muncul → kapal masuk → matahari berubah jadi 2 layar → wordmark dari kiri →
// CTA naik ke dalam laut → layar berkedip lalu "mata senyum".
import {spring} from 'remotion';
import contours from './sail-contours.ts';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const prog = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));

// ---- Timing ----
export const T = {
  layersIn: [0, 6, 12],
  sunRise: [20, 45],
  shipIn: 35, // berhenti ±75
  stretch: [82, 99], // matahari meregang
  morph: 99, // membelah → jadi 2 layar → turun (spring)
  click: 110, // layar klik tegak → swap ke PNG asli
  calm: [95, 125],
  text: [115, 147],
  sway: 140,
  cta: 150, // tiba ±170
  blink: [172, 176, 178, 183], // tutup 4, tahan 2, buka 5
  smile: 183,
};

// ---- Tata letak lockup horizontal (koordinat lockup 2625px → layar) ----
export const LOCK_S = 0.54;
const LOCK = {x0: 456, x1: 2159, y0: 944, y1: 1680};
export const LOCK_LEFT = W / 2 - ((LOCK.x1 - LOCK.x0) * LOCK_S) / 2; // ≈80
export const SINK = 3; // lambung "duduk" 3px di air
export const BACK_BASE = 1120; // permukaan lapis belakang (= garis air kapal)
export const LOCK_TOP = BACK_BASE + SINK - (LOCK.y1 - LOCK.y0) * LOCK_S;
export const lockToScreen = (lx: number, ly: number) => ({x: LOCK_LEFT + (lx - LOCK.x0) * LOCK_S, y: LOCK_TOP + (ly - LOCK.y0) * LOCK_S});

// ---- Ikon (koordinat logo-icon 2625px) ----
export const ICON_BBOX = {x0: 857, y0: 768, x1: 1767, y1: 1855};
export const ICON_TO_LOCK = 616 / 910; // logo-icon → ukuran ikon di logo-lockup (diukur: 0,677)
export const SHIP_S = LOCK_S * ICON_TO_LOCK;
export const HULL_BOTTOM = {x: 1230, y: 1855}; // titik terendah lambung = titik kontak air
const ICON_LOCK_X0 = 456, ICON_LOCK_Y0 = 944; // bbox ikon di lockup
export const iconRest = (px: number, py: number) => lockToScreen(ICON_LOCK_X0 + (px - ICON_BBOX.x0) * ICON_TO_LOCK, ICON_LOCK_Y0 + (py - ICON_BBOX.y0) * ICON_TO_LOCK);
export const SHIP_X_FINAL = iconRest(HULL_BOTTOM.x, HULL_BOTTOM.y).x;
export const ICON_RIGHT = iconRest(ICON_BBOX.x1, 0).x;

// ---- Ombak (laut penuh, tidak menyusut) ----
export type Layer = {color: string; base: number; A0: number; A1: number; lambda: number; omega: number; phi: number};
export const LAYERS: Layer[] = [
  {color: '#BDE9FB', base: BACK_BASE, A0: 20, A1: 5, lambda: 520, omega: 0.045, phi: 0.4},
  {color: '#3EB5EF', base: BACK_BASE + 72, A0: 24, A1: 6, lambda: 640, omega: 0.07, phi: 2.1},
  {color: '#1E9BDC', base: BACK_BASE + 136, A0: 26, A1: 7, lambda: 780, omega: 0.1, phi: 4.0},
];
export const BACK = 0, FRONT = 2;
export const calmP = (f: number) => easeInOut(prog(f, T.calm[0], T.calm[1]));
export const layerRise = (i: number, f: number) => 900 * (1 - spring({frame: f - T.layersIn[i], fps: FPS, config: {damping: 14, stiffness: 70, mass: 1}}));
export const waveY = (i: number, x: number, f: number) => {
  const L = LAYERS[i];
  const k = (2 * Math.PI) / L.lambda;
  const amp = lerp(L.A0, L.A1, calmP(f));
  return L.base + layerRise(i, f) + (amp * (Math.sin(k * x - L.omega * f + L.phi) + 0.35 * Math.sin(2.1 * k * x + 0.6 * L.omega * f + L.phi + 1.3))) / 1.35;
};
const waveSlope = (i: number, x: number, f: number) => (waveY(i, x + 1, f) - waveY(i, x - 1, f)) / 2;

// ---- Kapal ----
const SHIP_X_START = -330;
export const shipX = (f: number) => lerp(SHIP_X_START, SHIP_X_FINAL, spring({frame: f - T.shipIn, fps: FPS, config: {damping: 14, stiffness: 30, mass: 1}}));
export type Pose = {x: number; y: number; rot: number};
export const shipPose = (f: number, freeze = false): Pose => {
  const x = shipX(f);
  if (freeze) return {x: SHIP_X_FINAL, y: BACK_BASE + SINK, rot: 0};
  const y = waveY(BACK, x, f) + SINK; // dasar lambung menempel permukaan laut (lapis paling atas)
  const slopeDeg = (Math.atan(waveSlope(BACK, x, f)) * 180) / Math.PI;
  const swayAmp = spring({frame: f - T.sway, fps: FPS, config: {damping: 14, stiffness: 60}});
  const sway = 1.2 * swayAmp * Math.sin((2 * Math.PI * (f - T.sway)) / FPS);
  return {x, y, rot: 0.3 * slopeDeg + sway};
};
// titik logo-icon → layar menurut pose kapal (poros = dasar lambung)
export const iconToScreen = (px: number, py: number, p: Pose) => {
  const dx = (px - HULL_BOTTOM.x) * SHIP_S, dy = (py - HULL_BOTTOM.y) * SHIP_S;
  const a = (p.rot * Math.PI) / 180;
  return {x: p.x + dx * Math.cos(a) - dy * Math.sin(a), y: p.y + dx * Math.sin(a) + dy * Math.cos(a)};
};

// ---- Matahari: bertengger tepat di area calon layar ----
const SAILS_C = iconRest((869 + 1678) / 2, (768 + 1431) / 2);
export const SUN = {x: SAILS_C.x, y: SAILS_C.y - 60, r: 92}; // dinaikkan agar ujung lambung yang lewat tak menyentuhnya
const SUN_HIDDEN = BACK_BASE + SUN.r + 50;
export const sunY = (f: number) => lerp(SUN_HIDDEN, SUN.y, easeOutCubic(prog(f, T.sunRise[0], T.sunRise[1])));
export const sunGlow = (f: number) => lerp(0, 0.22, easeOutCubic(prog(f, T.sunRise[0], T.sunRise[1] + 10))) * (1 - easeInOut(prog(f, 84, 104)));

// ---- Morph matahari → 2 layar ----
type Contour = {centroid: number[]; pts: number[][]; base: number[]};
export const SAILS = contours as unknown as {sailL: Contour; sailR: Contour};
const N = SAILS.sailL.pts.length;
// titik tepi setengah-lingkaran (kiri/kanan, tumpang 2px di tengah agar tak ada garis sambungan) pada sudut yang sama dengan titik kontur layar
const halfDisk = (side: -1 | 1) => {
  const cx0 = SUN.x + side * ((4 * SUN.r) / (3 * Math.PI)), cy0 = SUN.y;
  const inside = (x: number, y: number) => (x - SUN.x) ** 2 + (y - SUN.y) ** 2 <= SUN.r ** 2 && side * (x - SUN.x) >= -2;
  return {c: [cx0, cy0], pts: Array.from({length: N}, (_, i) => {
    const th = -Math.PI / 2 + (2 * Math.PI * i) / N;
    let r = 0;
    while (inside(cx0 + Math.cos(th) * (r + 0.5), cy0 + Math.sin(th) * (r + 0.5))) r += 0.5;
    return [cx0 + Math.cos(th) * r, cy0 + Math.sin(th) * r];
  })};
};
const HALF = {L: halfDisk(-1), R: halfDisk(1)};
export const stretchP = (f: number) => easeInOut(prog(f, T.stretch[0], T.stretch[1]));
export const morphS = (f: number) => spring({frame: f - T.morph, fps: FPS, config: {damping: 14, stiffness: 120, mass: 0.5}});
export const morphPaths = (f: number, p: Pose) => {
  const st = stretchP(f); const sx = 1 + 0.28 * st, sy = 1 - 0.14 * st; // meregang
  const m = Math.min(1, morphS(f));
  return (['L', 'R'] as const).map((k) => {
    const half = HALF[k]; const sail = k === 'L' ? SAILS.sailL : SAILS.sailR; const side = k === 'L' ? -1 : 1;
    const base = iconToScreen(sail.base[0], sail.base[1], p);
    const tilt = ((side * 18 * (1 - m)) * Math.PI) / 180; // miring keluar → klik tegak
    const spread = side * 34 * Math.sin(Math.PI * m); // membelah ke samping sebelum turun
    const pts = half.pts.map(([hx, hy], i) => {
      const a = {x: SUN.x + (hx - SUN.x) * sx, y: SUN.y + (hy - SUN.y) * sy};
      const b = iconToScreen(sail.pts[i][0], sail.pts[i][1], p);
      let x = lerp(a.x, b.x, m) + spread, y = lerp(a.y, b.y, m);
      const dx = x - base.x, dy = y - base.y; // putar terhadap pangkal layar
      x = base.x + dx * Math.cos(tilt) - dy * Math.sin(tilt); y = base.y + dx * Math.sin(tilt) + dy * Math.cos(tilt);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return 'M ' + pts.join(' L ') + ' Z';
  });
};

// ---- Kedip & mata senyum (pada PNG layar asli, jangkar di pangkal) ----
export const blink = (f: number) => {
  const [a, b, c, d] = T.blink;
  let sy = 1;
  if (f >= a && f < b) sy = lerp(1, 0.1, easeInCubic(prog(f, a, b)));
  else if (f >= b && f < c) sy = 0.1;
  else if (f >= c && f < d) sy = lerp(0.1, 1, easeOutCubic(prog(f, c, d)));
  const s = spring({frame: f - T.smile, fps: FPS, config: {damping: 13, stiffness: 120, mass: 0.8}});
  return {sy: f >= T.smile ? lerp(1, 0.55, s) : sy, tilt: f >= T.smile ? 6 * s : 0};
};

// ---- Wordmark & CTA ----
export const WORD = {x0: 1236, y0: 954, x1: 2165, y1: 1618};
export const TEXT_CLIP_X = (ICON_RIGHT + lockToScreen(WORD.x0, 0).x) / 2; // garis munculnya teks (di antara ikon & teks)
export const textDX = (f: number) => -560 * (1 - easeOutCubic(prog(f, T.text[0], T.text[1])));
export const CTA_TOP = LAYERS[FRONT].base + 62; // di dalam lapis depan (paling gelap), di bawah lembah ombak
export const ctaDY = (f: number) => 600 * (1 - spring({frame: f - T.cta, fps: FPS, config: {damping: 14, stiffness: 60, mass: 1}}));
