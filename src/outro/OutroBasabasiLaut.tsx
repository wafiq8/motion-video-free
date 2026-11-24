import React from 'react';
import {AbsoluteFill, Audio, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import layout from '../../public/outro/layout.json';
import {
  CTA_TOP, H, HULL_BOTTOM, LAYERS, LOCK_LEFT, LOCK_S, LOCK_TOP, SAILS, SHIP_S, SUN, T, TEXT_CLIP_X, W,
  blink, ctaDY, morphPaths, shipPose, stretchP, sunGlow, sunY, textDX, waveY,
} from './laut-geom';

const ORANGE = '#F19901';

export type OutroLautProps = {ctaTitle: string; ctaSub: string; muted?: boolean; qcFreeze?: boolean};
export const outroLautDefaults: OutroLautProps = {ctaTitle: 'Open Trip Labuan Bajo', ctaSub: 'WA 0895-6341-57789', muted: false, qcFreeze: false};

const STEP = 12;
const wavePath = (i: number, f: number) => {
  let d = `M -20 ${H + 20} L -20 ${waveY(i, -20, f).toFixed(1)}`;
  for (let x = -20 + STEP; x <= W + 20; x += STEP) d += ` L ${x} ${waveY(i, x, f).toFixed(1)}`;
  return d + ` L ${W + 20} ${H + 20} Z`;
};

const Part: React.FC<{src: string; v: {x: number; y: number; w: number; h: number}; style?: React.CSSProperties}> = ({src, v, style}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', left: v.x, top: v.y, width: v.w, height: v.h, ...style}} />
);

export const OutroBasabasiLaut: React.FC<OutroLautProps> = ({ctaTitle, ctaSub, muted = false, qcFreeze = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pose = shipPose(frame, qcFreeze);
  const P = layout.icon_parts;

  // 1) Matahari (naik ease-out, tidak memantul) — 3) lalu meregang & berubah jadi 2 layar
  const sunPhase = frame < T.stretch[0] ? 'sun' : frame < T.click ? 'morph' : 'sails';
  const glow = sunGlow(frame);
  const sy = sunY(frame);

  // klik: denyut kecil seluruh ikon saat swap ke PNG asli (spring damping 12)
  const kb = spring({frame: frame - T.click, fps, config: {damping: 12, stiffness: 260, mass: 0.6}});
  const pop = frame >= T.click ? 1 + 0.16 * kb * (1 - kb) : 1;

  // 6) kedip + mata senyum (jangkar di pangkal layar)
  const bl = blink(frame);
  const sailStyle = (k: 'sailL' | 'sailR', side: 1 | -1): React.CSSProperties => {
    const b = SAILS[k].base; const v = P[k];
    return {transformOrigin: `${b[0] - v.x}px ${b[1] - v.y}px`, transform: `rotate(${side * bl.tilt}deg) scaleY(${bl.sy})`};
  };

  return (
    <AbsoluteFill style={{backgroundColor: '#FFFFFF', overflow: 'hidden'}}>
      {/* Glow + matahari (di belakang ombak saat terbit) */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor={ORANGE} stopOpacity={glow} />
            <stop offset="45%" stopColor={ORANGE} stopOpacity={glow * 0.45} />
            <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
          </radialGradient>
        </defs>
        {glow > 0.001 && <circle cx={SUN.x} cy={sunPhase === 'sun' ? sy : SUN.y} r={SUN.r * 2.6} fill="url(#sunGlow)" />}
        {frame >= T.sunRise[0] && sunPhase === 'sun' && <circle cx={SUN.x} cy={sy} r={SUN.r} fill={ORANGE} />}
      </svg>
      {/* Laut 3 lapis penuh (parallax) */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {LAYERS.map((L, i) => <path key={i} d={wavePath(i, frame)} fill={L.color} />)}
      </svg>
      {/* Kapal: poros = titik terendah lambung, di permukaan laut */}
      {frame >= T.shipIn && (
        <div
          style={{
            position: 'absolute', left: 0, top: 0, width: 2625, height: 2625, transformOrigin: '0 0',
            transform: `translate(${pose.x}px, ${pose.y}px) rotate(${pose.rot}deg) scale(${SHIP_S * pop}) translate(${-HULL_BOTTOM.x}px, ${-HULL_BOTTOM.y}px)`,
          }}
        >
          <Part src="outro/hull.png" v={P.hull} />
          {sunPhase === 'sails' && (
            <>
              <Part src="outro/sail-left.png" v={P.sailL} style={sailStyle('sailL', 1)} />
              <Part src="outro/sail-right.png" v={P.sailR} style={sailStyle('sailR', -1)} />
            </>
          )}
        </div>
      )}
      {/* Morph matahari → 2 layar (warna sama, satu benda berubah bentuk) */}
      {sunPhase === 'morph' && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          {stretchP(frame) < 0.001 && frame < T.morph ? (
            <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill={ORANGE} />
          ) : (
            morphPaths(frame, pose).map((d, i) => <path key={i} d={d} fill={ORANGE} />)
          )}
        </svg>
      )}
      {/* 4) Wordmark: satu blok meluncur dari kiri, muncul dari garis di antara ikon & teks */}
      <div style={{position: 'absolute', left: TEXT_CLIP_X, top: 0, width: W - TEXT_CLIP_X, height: H, overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute', left: 0, top: 0, width: 2625, height: 2625, transformOrigin: '0 0',
            transform: `translate(${LOCK_LEFT - 456 * LOCK_S - TEXT_CLIP_X + textDX(frame)}px, ${LOCK_TOP - 944 * LOCK_S}px) scale(${LOCK_S})`,
          }}
        >
          {([0, 1, 2, 3] as const).map((i) => <Part key={`a${i}`} src={`outro/basa-${i}.png`} v={layout.word[`basa${i}`]} />)}
          {([0, 1, 2, 3] as const).map((i) => <Part key={`i${i}`} src={`outro/basi-${i}.png`} v={layout.word[`basi${i}`]} />)}
          <Part src="outro/trip.png" v={layout.word.trip} />
        </div>
      </div>
      {/* 5) CTA naik dari bawah, berhenti DI DALAM laut (lapis depan), selalu di atas semua lapis ombak */}
      <div style={{position: 'absolute', left: 0, right: 0, top: CTA_TOP + ctaDY(frame), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, fontFamily: 'InterOutro'}}>
        <div style={{color: '#FFFFFF', fontWeight: 800, fontSize: 56, letterSpacing: -0.5, textShadow: '0 2px 8px rgba(0,40,70,0.35)'}}>{ctaTitle}</div>
        <div style={{color: '#000000', backgroundColor: ORANGE, fontWeight: 800, fontSize: 44, padding: '13px 34px', borderRadius: 999, letterSpacing: 0.5}}>{ctaSub}</div>
      </div>
      {!muted && <Audio src={staticFile('outro/sfx-outro-laut.wav')} />}
    </AbsoluteFill>
  );
};
