import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import layout from '../../public/outro/layout.json';
import {
  CTA_TOP, H, HULL_BOTTOM, LAYERS, LOCK_S, SHIP_S, SUN_R, T, W, WORD_BBOX, WORD_LEFT, WORD_TOP,
  seaBottom, shipPose, sunGlow, sunY, waveY,
} from './laut-geom';

const ORANGE = '#F19901';

export type OutroLautProps = {ctaTitle: string; ctaSub: string; muted?: boolean; qcFreeze?: boolean};
export const outroLautDefaults: OutroLautProps = {ctaTitle: 'Open Trip Labuan Bajo', ctaSub: 'WA 0895-6341-57789', muted: false, qcFreeze: false};

const STEP = 12;
const wavePath = (i: number, f: number, bottom: number) => {
  let d = `M ${-20} ${bottom} L ${-20} ${waveY(i, -20, f).toFixed(1)}`;
  for (let x = -20 + STEP; x <= W + 20; x += STEP) d += ` L ${x} ${waveY(i, x, f).toFixed(1)}`;
  return d + ` L ${W + 20} ${bottom} Z`;
};

// Bagian ikon dari logo-icon (koordinat sumber 2625px)
const Part: React.FC<{src: string; v: {x: number; y: number; w: number; h: number}; style?: React.CSSProperties}> = ({src, v, style}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', left: v.x, top: v.y, width: v.w, height: v.h, ...style}} />
);

// Garis pisah putih tipis di sekeliling lambung: lambung #3EB5EF sama dengan ombak lapis tengah,
// tanpa ini siluet lambung melebur ke laut. Satuan = px sumber (×0,37 di layar → ±3px).
const KNOCKOUT = [
  [8, 0], [-8, 0], [0, 8], [0, -8],
].map(([x, y]) => `drop-shadow(${x}px ${y}px 0 #FFFFFF)`).join(' ');

const Letter: React.FC<{file: string; k: keyof typeof layout.word; start: number}> = ({file, k, start}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < start) return null;
  const v = layout.word[k];
  const s = spring({frame: frame - start, fps, config: {damping: 13, stiffness: 170, mass: 0.7}});
  const blur = interpolate(s, [0, 1], [14, 0], {extrapolateRight: 'clamp'});
  return (
    <Part
      src={`outro/${file}.png`}
      v={v}
      style={{
        opacity: interpolate(s, [0, 1], [0.25, 1], {extrapolateRight: 'clamp'}),
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [0.86, 1])})`,
        transformOrigin: '50% 100%',
      }}
    />
  );
};

export const OutroBasabasiLaut: React.FC<OutroLautProps> = ({ctaTitle, ctaSub, muted = false, qcFreeze = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Matahari (gerak linear/ease-out — tidak memantul)
  const sy = sunY(frame);
  const glow = sunGlow(frame);

  // Kapal
  const pose = shipPose(frame, qcFreeze);
  const sail = (start: number) => {
    const s = spring({frame: frame - start, fps, config: {damping: 12, stiffness: 100, mass: 0.75}}); // ≥0,99 di +8 frame
    return {on: frame >= start, rot: -78 * (1 - s), sc: interpolate(s, [0, 1], [0.35, 1])};
  };
  const sL = sail(T.sailL);
  const sR = sail(T.sailR);
  const P = layout.icon_parts;

  // Trip
  const st = spring({frame: frame - T.trip, fps, config: {damping: 13, stiffness: 150, mass: 0.8}});

  const cta = (start: number) => {
    const s = spring({frame: frame - start, fps, config: {damping: 12, stiffness: 180, mass: 0.7}});
    return {
      opacity: frame < start ? 0 : interpolate(s, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}),
      transform: `translateY(${8 * (1 - s)}px) scale(${interpolate(s, [0, 1], [0.82, 1])})`,
    };
  };

  const bottom = seaBottom(frame);
  return (
    <AbsoluteFill style={{backgroundColor: '#FFFFFF', overflow: 'hidden'}}>
      {/* Matahari + glow, di belakang semua lapis ombak */}
      {frame >= T.sunRise[0] && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <defs>
            <radialGradient id="sunGlow">
              <stop offset="0%" stopColor={ORANGE} stopOpacity={glow} />
              <stop offset="45%" stopColor={ORANGE} stopOpacity={glow * 0.45} />
              <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={W / 2} cy={sy} r={SUN_R * 2.8} fill="url(#sunGlow)" />
          <circle cx={W / 2} cy={sy} r={SUN_R} fill={ORANGE} />
        </svg>
      )}
      {/* Ombak 3 lapis (parallax); kapal digambar sesudahnya → lambung duduk DI ATAS permukaan lapis depan */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {LAYERS.map((L, i) => <path key={i} d={wavePath(i, frame, bottom)} fill={L.color} />)}
      </svg>
      {/* Kapal: poros = titik terendah lambung, ditaruh di permukaan lapis depan */}
      {frame >= T.shipIn && (
        <div
          style={{
            position: 'absolute', left: 0, top: 0, width: 2625, height: 2625, transformOrigin: '0 0',
            transform: `translate(${pose.x}px, ${pose.y}px) rotate(${pose.rot}deg) scale(${SHIP_S}) translate(${-HULL_BOTTOM.x}px, ${-HULL_BOTTOM.y}px)`,
          }}
        >
          {sL.on && <Part src="outro/sail-left.png" v={P.sailL} style={{transformOrigin: `${869 - P.sailL.x}px ${1431 - P.sailL.y}px`, transform: `rotate(${sL.rot}deg) scale(${sL.sc})`}} />}
          {sR.on && <Part src="outro/sail-right.png" v={P.sailR} style={{transformOrigin: `${1274 - P.sailR.x}px ${1431 - P.sailR.y}px`, transform: `rotate(${sR.rot}deg) scale(${sR.sc})`}} />}
          <Part src="outro/hull.png" v={P.hull} style={{filter: KNOCKOUT}} />
        </div>
      )}
      {/* Wordmark (susunan & proporsi dari file lockup) */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 2625, height: 2625, transformOrigin: '0 0', transform: `translate(${WORD_LEFT - WORD_BBOX.x0 * LOCK_S}px, ${WORD_TOP - WORD_BBOX.y0 * LOCK_S}px) scale(${LOCK_S})`}}>
        {[0, 1, 2, 3].map((i) => <Letter key={`a${i}`} file={`basa-${i}`} k={`basa${i}` as keyof typeof layout.word} start={T.basa + i * T.stagger} />)}
        {[0, 1, 2, 3].map((i) => <Letter key={`i${i}`} file={`basi-${i}`} k={`basi${i}` as keyof typeof layout.word} start={T.basi + i * T.stagger} />)}
        {frame >= T.trip && (
          <Part src="outro/trip.png" v={layout.word.trip} style={{transform: `translateX(${100 * (1 - st)}px)`, opacity: interpolate(st, [0, 0.35], [0, 1], {extrapolateRight: 'clamp'})}} />
        )}
      </div>
      {/* CTA (props) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: CTA_TOP, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, fontFamily: 'InterOutro'}}>
        <div style={{...cta(T.cta1), color: '#000000', fontWeight: 800, fontSize: 56, letterSpacing: -0.5}}>{ctaTitle}</div>
        <div style={{...cta(T.cta2), color: '#000000', backgroundColor: ORANGE, fontWeight: 800, fontSize: 44, padding: '13px 34px', borderRadius: 999, letterSpacing: 0.5}}>{ctaSub}</div>
      </div>
      {!muted && <Audio src={staticFile('outro/sfx-outro-laut.wav')} />}
    </AbsoluteFill>
  );
};
