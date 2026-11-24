import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import layout from '../../public/outro/layout.json';

// Warna resmi (sampling file logo)
export const ORANGE = '#F19901';
export const BLUE = '#3EB5EF';

// ---- Tata letak (koordinat kanvas lockup asli 2625px) ----
const LB = {x0: 456, x1: 2159, y0: 944, y1: 1680}; // bbox lockup utuh
export const LOCK_SCALE = 880 / (LB.x1 - LB.x0); // lebar lockup di layar = 880px
export const LOCK_CX = 540; // tengah lockup di layar
export const LOCK_CY = 830;
// poros goyang: dasar lambung
const ICB = layout.lockup_icon_bbox; // [x0,y0,x1,y1]
const ISB = layout.icon_src_bbox;
const ICON_S = (ICB[2] - ICB[0]) / (ISB[2] - ISB[0]); // skala ikon file → lockup
export const PIVOT = {x: (ICB[0] + ICB[2]) / 2, y: ICB[3]};

const iconPart = (k: 'hull' | 'sailL' | 'sailR') => {
  const v = layout.icon_parts[k];
  return {x: ICB[0] + (v.x - ISB[0]) * ICON_S, y: ICB[1] + (v.y - ISB[1]) * ICON_S, w: v.w * ICON_S, h: v.h * ICON_S};
};

// ---- Timing (frame) ----
export const T = {
  hullIn: 0,
  sailL: 16,
  sailR: 24,
  basa: 34,
  basi: 42,
  trip: 50,
  stagger: 2,
  sway: 58,
  cta1: 75,
  cta2: 78,
};

const Part: React.FC<{src: string; x: number; y: number; w: number; h: number; style?: React.CSSProperties}> = ({src, x, y, w, h, style}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}} />
);

const Letter: React.FC<{file: string; k: keyof typeof layout.word; start: number}> = ({file, k, start}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = layout.word[k];
  if (frame < start) return null;
  const s = spring({frame: frame - start, fps, config: {damping: 13, stiffness: 170, mass: 0.7}});
  const op = interpolate(s, [0, 1], [0.25, 1], {extrapolateRight: 'clamp'});
  const blur = interpolate(s, [0, 1], [14, 0], {extrapolateRight: 'clamp'});
  const sc = interpolate(s, [0, 1], [0.86, 1]);
  const dy = interpolate(s, [0, 1], [40, 0]);
  return (
    <Part
      src={`outro/${file}.png`}
      {...v}
      style={{opacity: op, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, transform: `translateY(${dy}px) scale(${sc})`, transformOrigin: '50% 100%'}}
    />
  );
};

export const OutroBasabasi: React.FC<{muted?: boolean}> = ({muted = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Beat 1 — lambung meluncur di lintasan melengkung dari kiri bawah, ayunan rotasi mereda
  const ph = spring({frame: frame - T.hullIn, fps, config: {damping: 13, stiffness: 60, mass: 1}}); // ≥0,98 di frame 16, diam ±18
  const hullX = -1700 * (1 - ph);
  const hullY = 1100 * Math.pow(Math.max(0, 1 - ph), 2); // lintasan melengkung (datar saat mendarat, seperti meluncur di air)
  // ayunan ombak: spring massa besar (damping 12) → +6° saat meluncur, -2° setelah berhenti, lalu mereda
  const rock = spring({frame: frame - T.hullIn, fps, config: {damping: 12, stiffness: 120, mass: 3}});
  const hullRot = 6 * (1 - rock);
  const hull = iconPart('hull');

  // Beat 2 — dua layar jatuh tegak, stagger (tanda tangan outro)
  const sail = (start: number) => {
    const fall = spring({frame: frame - start, fps, config: {damping: 12, stiffness: 100, mass: 0.75}}); // mendarat +8 frame
    const upright = spring({frame: frame - start - 2, fps, config: {damping: 12, stiffness: 160, mass: 0.6}});
    return {
      visible: frame >= start,
      y: -1900 * (1 - fall),
      rot: -16 * (1 - upright),
      sy: interpolate(fall, [0.95, 1, 1.05], [1, 1, 0.95], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    };
  };
  const sL = sail(T.sailL);
  const sR = sail(T.sailR);
  const pL = iconPart('sailL');
  const pR = iconPart('sailR');

  // Trip vertikal meluncur dari kanan ke sisi kanan "Basi"
  const st = spring({frame: frame - T.trip, fps, config: {damping: 13, stiffness: 150, mass: 0.8}});
  const trip = layout.word.trip;

  // Beat 4 — goyang halus (±1,2°, periode ±1 dtk) poros dasar lambung; amplitudo masuk via spring
  const swayAmp = spring({frame: frame - T.sway, fps, config: {damping: 14, stiffness: 60}});
  const sway = 1.2 * swayAmp * Math.sin((2 * Math.PI * (frame - T.sway)) / fps);

  // Latar: gradasi radial biru 6% yang bergerak amat lambat
  const gx = 50 + 6 * Math.sin((frame / 90) * Math.PI * 1.2);
  const gy = 44 + 4 * Math.cos((frame / 90) * Math.PI);
  const gr = 58 + 6 * Math.sin((frame / 90) * Math.PI);

  // Beat 5 — CTA: pop kecil + naik 8px, tanpa fade out
  const cta = (start: number) => {
    const s = spring({frame: frame - start, fps, config: {damping: 12, stiffness: 180, mass: 0.7}});
    return {opacity: frame < start ? 0 : interpolate(s, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}), transform: `translateY(${8 * (1 - s)}px) scale(${interpolate(s, [0, 1], [0.82, 1])})`};
  };

  const lockupW = LB.x1 - LB.x0;
  const lockupH = LB.y1 - LB.y0;
  return (
    <AbsoluteFill style={{backgroundColor: '#000000', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(62,181,239,0.06) 0%, rgba(62,181,239,0.035) ${gr * 0.45}%, rgba(62,181,239,0) ${gr}%)`}} />
      {/* Kanvas lockup (koordinat 2625px) diskalakan & ditaruh di layar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 2625,
          height: 2625,
          transformOrigin: '0 0',
          transform: `translate(${LOCK_CX - (LB.x0 + lockupW / 2) * LOCK_SCALE}px, ${LOCK_CY - (LB.y0 + lockupH / 2) * LOCK_SCALE}px) scale(${LOCK_SCALE})`,
        }}
      >
        <div style={{position: 'absolute', inset: 0, transformOrigin: `${PIVOT.x}px ${PIVOT.y}px`, transform: `rotate(${sway}deg)`}}>
          <Part src="outro/hull.png" {...hull} style={{transformOrigin: '50% 100%', transform: `translate(${hullX}px, ${hullY}px) rotate(${hullRot}deg)`}} />
          {sL.visible && <Part src="outro/sail-left.png" {...pL} style={{transformOrigin: '30% 100%', transform: `translateY(${sL.y}px) rotate(${sL.rot}deg) scaleY(${sL.sy})`}} />}
          {sR.visible && <Part src="outro/sail-right.png" {...pR} style={{transformOrigin: '30% 100%', transform: `translateY(${sR.y}px) rotate(${sR.rot}deg) scaleY(${sR.sy})`}} />}
          {[0, 1, 2, 3].map((i) => (
            <Letter key={`a${i}`} file={`basa-${i}`} k={`basa${i}` as keyof typeof layout.word} start={T.basa + i * T.stagger} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <Letter key={`i${i}`} file={`basi-${i}`} k={`basi${i}` as keyof typeof layout.word} start={T.basi + i * T.stagger} />
          ))}
          {frame >= T.trip && (
            <Part
              src="outro/trip.png"
              {...trip}
              style={{transform: `translateX(${100 * (1 - st)}px)`, opacity: interpolate(st, [0, 0.35], [0, 1], {extrapolateRight: 'clamp'})}}
            />
          )}
        </div>
      </div>
      {/* CTA */}
      <div style={{position: 'absolute', left: 0, right: 0, top: LOCK_CY + 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, fontFamily: 'InterOutro'}}>
        <div style={{...cta(T.cta1), color: '#FFFFFF', fontWeight: 800, fontSize: 58, letterSpacing: -0.5}}>Open Trip Labuan Bajo</div>
        <div
          style={{
            ...cta(T.cta2),
            color: '#000000',
            backgroundColor: ORANGE,
            fontWeight: 800,
            fontSize: 46,
            padding: '14px 34px',
            borderRadius: 999,
            letterSpacing: 0.5,
          }}
        >
          WA 0895-6341-57789
        </div>
      </div>
      {!muted && <Audio src={staticFile('outro/sfx-outro.wav')} />}
    </AbsoluteFill>
  );
};
