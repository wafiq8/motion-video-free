// Pakai: node tools/render.mjs stills | scenes [scale] [ids...]
import {bundle} from '@remotion/bundler';
import {renderStill, renderMedia, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const tl = JSON.parse(fs.readFileSync('docs/timeline.json', 'utf8'));
const [mode = 'stills', scaleArg = '1', ...ids] = process.argv.slice(2);
const scale = Number(scaleArg);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const inputProps = {muted: true};
const composition = await selectComposition({serveUrl, id: 'Berita', inputProps});
const want = (id) => ids.length === 0 || ids.includes(String(id));
if (mode === 'stills') {
  fs.mkdirSync('out/stills', {recursive: true});
  for (const s of tl.scenes.filter((s) => want(s.id))) {
    const a = Math.round(s.start_s * 30), b = Math.round(s.end_s * 30) - 1;
    const frames = [a + 6, Math.round((a + b) / 2), b - 4];
    for (const [k, f] of frames.entries()) {
      await renderStill({serveUrl, composition, frame: f, inputProps, output: `out/stills/s${String(s.id).padStart(2, '0')}-${'abc'[k]}.jpg`, imageFormat: 'jpeg', scale});
    }
    console.log('still scene', s.id);
  }
} else {
  fs.mkdirSync('out/scenes', {recursive: true});
  const t0 = Date.now();
  for (const s of tl.scenes.filter((s) => want(s.id))) {
    const a = Math.round(s.start_s * 30), b = Math.round(s.end_s * 30) - 1;
    await renderMedia({serveUrl, composition, codec: 'h264', inputProps, muted: true, frameRange: [a, b], scale, concurrency: os.cpus().length, crf: 18, pixelFormat: 'yuv420p', outputLocation: `out/scenes/scene-${s.id}.mp4`});
    console.log('scene', s.id, 'frames', a, b, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
}
