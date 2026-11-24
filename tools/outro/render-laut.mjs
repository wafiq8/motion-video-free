// Pakai: node tools/outro/render-laut.mjs stills [f1,f2,..] [qc] | video
// Props CTA bisa ditimpa: CTA_TITLE="..." CTA_SUB="..." OUT=nama-file node tools/outro/render-laut.mjs video
import {bundle} from '@remotion/bundler';
import {renderStill, renderMedia, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const [mode = 'stills', framesArg = '20,60,100,140,180', qc] = process.argv.slice(2);
const id = 'OutroBasabasiLaut';
const props = {ctaTitle: process.env.CTA_TITLE ?? 'Open Trip Labuan Bajo', ctaSub: process.env.CTA_SUB ?? 'WA 0895-6341-57789'};
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
fs.mkdirSync('out/laut', {recursive: true});
if (mode === 'stills') {
  const inputProps = {...props, muted: true, qcFreeze: qc === 'qc'};
  const composition = await selectComposition({serveUrl, id, inputProps});
  for (const f of framesArg.split(',').map(Number)) {
    await renderStill({serveUrl, composition, frame: f, inputProps, output: `out/laut/${qc === 'qc' ? 'qc-' : ''}f${String(f).padStart(3, '0')}.png`, imageFormat: 'png'});
  }
  console.log('stills ok');
} else {
  const inputProps = {...props, muted: false};
  const composition = await selectComposition({serveUrl, id, inputProps});
  const name = process.env.OUT ?? 'outro-basabasi-laut';
  const common = {serveUrl, composition, codec: 'h264', inputProps, concurrency: os.cpus().length, crf: 18, pixelFormat: 'yuv420p', imageFormat: 'png', audioCodec: 'aac'};
  const outs = [[`hasil/${name}.mp4`, 1], [`hasil/${name}-preview.mp4`, 0.5]];
  for (const [o, scale] of outs) {
    await renderMedia({...common, scale, outputLocation: o});
    // potong padding AAC → durasi tepat 6,500 dtk; video di-copy tanpa encode ulang
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', o, '-t', '6.5', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', o + '.tmp.mp4']);
    fs.renameSync(o + '.tmp.mp4', o);
    console.log('render', o);
  }
}
