import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, getInputProps} from 'remotion';
import tl from '../docs/timeline.json';
import words from '../docs/words.json';
import {C, FONT, TOPIC} from './theme';
import {Sitasi, TopicPill, textW} from './components/ui';
import {SCENES} from './scenes';

const FPS = 30;
const fontsLoaded = (async () => {
  const faces = [500, 700, 800, 900].map(
    (w) => new FontFace(FONT, `url(${staticFile(`fonts/inter-latin-${w}-normal.woff2`)}) format('woff2')`, {weight: String(w)}),
  );
  await Promise.all(faces.map((f) => f.load()));
  faces.forEach((f) => document.fonts.add(f));
})();

type Word = {text: string; start_s: number; end_s: number; sentence: number};
type Page = {words: Word[]; start: number; end: number};

const CAP_SIZE = 66;
const CAP_W = 600; // tebal
const CAP_MAX_W = 940;
const BOX_PAD = 18;
const GAP = 18;

function buildPages(ws: Word[]): Page[] {
  const pages: Page[] = [];
  let cur: Word[] = [];
  const width = (arr: Word[]) => arr.reduce((a, w) => a + textW(w.text, CAP_SIZE, 800) + 2 * BOX_PAD, 0) + GAP * (arr.length - 1);
  for (const w of ws) {
    const sameSentence = cur.length === 0 || cur[0].sentence === w.sentence;
    const trial = [...cur, w];
    if (cur.length && (!sameSentence || cur.length >= 3 || width(trial) > CAP_MAX_W || /[.,:?!]$/.test(cur[cur.length - 1].text))) {
      pages.push({words: cur, start: cur[0].start_s, end: 0});
      cur = [w];
    } else cur = trial;
  }
  if (cur.length) pages.push({words: cur, start: cur[0].start_s, end: 0});
  for (let i = 0; i < pages.length; i++) {
    const last = pages[i].words[pages[i].words.length - 1];
    pages[i].end = i < pages.length - 1 ? Math.min(pages[i + 1].start, last.end_s + 0.6) : last.end_s + 0.6;
    if (width(pages[i].words) > CAP_MAX_W) throw new Error('Caption kepotong: ' + pages[i].words.map((w) => w.text).join(' '));
  }
  return pages;
}

const Caption: React.FC<{t: number; pages: Page[]}> = ({t, pages}) => {
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  return (
    <div style={{position: 'absolute', top: 1470, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: GAP}}>
      {page.words.map((w, i) => {
        const next = page.words[i + 1];
        const active = t >= w.start_s && (next ? t < next.start_s : true);
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT, fontWeight: 800, fontSize: CAP_SIZE, color: C.white, padding: `4px ${BOX_PAD}px`, borderRadius: 12,
              background: active ? C.accent : 'transparent', textShadow: active ? 'none' : '0 3px 10px rgba(0,0,0,0.9)', lineHeight: 1.2,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    fontsLoaded.then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);
  const pages = useMemo(() => (ready ? buildPages(words as Word[]) : []), [ready]);
  const muted = Boolean((getInputProps() as {muted?: boolean}).muted);
  if (!ready) return <AbsoluteFill style={{background: C.bg}} />;

  const sc = tl.scenes.find((s) => t >= s.start_s && t < s.end_s) ?? tl.scenes[tl.scenes.length - 1];
  const Scene = SCENES[sc.id - 1];
  // fade hitam ±0,1 detik di setiap batas scene
  let black = 0;
  for (const s of tl.scenes.slice(1)) {
    const d = Math.abs(t - s.start_s);
    if (d < 0.1) black = Math.max(black, 0.85 * (1 - d / 0.1));
  }
  const endFade = interpolate(t, [tl.total_duration_s - 0.6, tl.total_duration_s - 0.05], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${C.bg2} 0%, ${C.bg} 70%)`}} />
      <Scene.Comp t={t} />
      {/* scrim bawah untuk caption & sitasi */}
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,22,48,0) 68%, rgba(10,22,48,0.85) 76%, rgba(10,22,48,0.85) 100%)'}} />
      <TopicPill label={TOPIC} />
      <Sitasi text={Scene.sitasi} />
      <Caption t={t} pages={pages} />
      <AbsoluteFill style={{background: '#000', opacity: Math.max(black, endFade)}} />
      {!muted && <Audio src={staticFile('narasi.mp3')} />}
    </AbsoluteFill>
  );
};
