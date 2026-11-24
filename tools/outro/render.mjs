// Pakai: node tools/outro/render.mjs stills | video
import {bundle} from '@remotion/bundler';
import {renderStill, renderMedia, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const mode = process.argv[2] ?? 'stills';
const frames = (process.argv[3] ?? '12,28,50,70,85').split(',').map(Number);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const id = 'OutroBasabasi';
fs.mkdirSync('out/outro', {recursive: true});
if (mode === 'stills') {
  const composition = await selectComposition({serveUrl, id, inputProps: {muted: true}});
  for (const f of frames) {
    await renderStill({serveUrl, composition, frame: f, inputProps: {muted: true}, output: `out/outro/f${String(f).padStart(2, '0')}.png`, imageFormat: 'png'});
    console.log('still', f);
  }
} else {
  const composition = await selectComposition({serveUrl, id, inputProps: {muted: false}});
  const common = {serveUrl, composition, codec: 'h264', inputProps: {muted: false}, concurrency: os.cpus().length, crf: 18, pixelFormat: 'yuv420p', audioCodec: 'aac', imageFormat: 'png'};
  await renderMedia({...common, outputLocation: 'hasil/outro-basabasi-trip.mp4'});
  console.log('full done');
  await renderMedia({...common, scale: 0.5, outputLocation: 'hasil/outro-basabasi-trip-preview.mp4'});
  console.log('preview done');
}
// Potong audio tepat 3,000 dtk (AAC menambah padding ±50 ms); video di-copy tanpa encode ulang
if (mode !== 'stills') {
  const {execFileSync} = await import('node:child_process');
  for (const f of ['hasil/outro-basabasi-trip.mp4', 'hasil/outro-basabasi-trip-preview.mp4']) {
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', f, '-t', '3', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f + '.tmp.mp4']);
    fs.renameSync(f + '.tmp.mp4', f);
  }
  console.log('trim audio 3.0s');
}
