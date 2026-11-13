// Fast previewer for the Wicflow film (no Remotion): bundles src/film.js with esbuild and draws frames in Chromium.
//   node tools/frames.mjs sheet <t0> <t1> <n> <out.png> [--hand]   n frames evenly from t0 to t1 (inclusive), a contact
//                                                                    sheet of 480 px tiles, 4 per row; prints the times
//   node tools/frames.mjs clip <t0> <t1> <out.mp4> [fps=60] [--hand] a 960x540 clip (feed it to: python3 tools/flow.py out.mp4)
//   node tools/frames.mjs png <t> <out.png> [--hand]                one full-size 1920x1080 frame
// --hand draws pink rings where the 3D hand's targets are (the real hand is only drawn by Remotion).
import * as esbuild from 'esbuild';
import fs from 'fs'; import path from 'path'; import os from 'os'; import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)(path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright'));
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.join(HERE, '..');
const args = process.argv.slice(2), hand = args.includes('--hand'), pos = args.filter((a) => !a.startsWith('--'));
const [cmd] = pos;
const js = (await esbuild.build({ entryPoints: [path.join(ROOT, 'src/film.js')], bundle: true, write: false, format: 'iife', globalName: 'FILM', logLevel: 'error' })).outputFiles[0].text;
const fonts = path.join(ROOT, 'public/fonts'), u = (f) => 'file://' + path.join(fonts, f);
const full = cmd === 'png', VW = full ? 1920 : 960, VH = full ? 1080 : 540;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'WF Headline';src:url(${u('stack-sans-headline.woff2')}) format('woff2');font-weight:200 700}
@font-face{font-family:'WF Inter';src:url(${u('inter.woff2')}) format('woff2');font-weight:100 900}
@font-face{font-family:'WF Mono';src:url(${u('fragment-mono.woff2')}) format('woff2');font-weight:400}
@font-face{font-family:'WF Mark';src:url(${u('manrope-latin-7.woff2')}) format('woff2');font-weight:800}
html,body{margin:0;background:#0B1220;overflow:hidden}#stage svg{display:block;width:${VW}px;height:${VH}px}</style></head>
<body><div id="stage"></div></body></html>`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wff-'));
fs.writeFileSync(path.join(tmp, 'p.html'), html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: VW, height: VH } });
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
await page.goto('file://' + path.join(tmp, 'p.html'));
await page.addScriptTag({ content: js });
await page.evaluate(async (mark) => {
  FILM.K.ASSET.mark = mark;
  await Promise.all(['500 96px "WF Headline"', '400 40px "WF Inter"', '600 40px "WF Inter"', '400 40px "WF Mono"', '800 40px "WF Mark"'].map((f) => document.fonts.load(f, 'Aa€’–·äö')));
  const img = new Image(); img.src = mark; await img.decode().catch(() => {});
}, 'file://' + path.join(ROOT, 'public/img/wicflow-mark.png'));
const shot = async (t, file, type = 'jpeg') => {
  const err = await page.evaluate(({ t, hand }) => {
    try { document.getElementById('stage').innerHTML = FILM.frameSvg(t, { debugHand: hand }); return null; } catch (e) { return String(e.stack || e); }
  }, { t, hand });
  if (err) { console.error(`ERROR at ${t.toFixed(3)}s: ${err}`); process.exitCode = 1; }
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.screenshot({ path: file, type, ...(type === 'jpeg' ? { quality: 85 } : {}) });
};
if (cmd === 'png') {
  await shot(+pos[1], pos[2], 'png'); console.log(pos[2]);
} else if (cmd === 'sheet') {
  const [t0, t1, n, out] = [+pos[1], +pos[2], +pos[3], pos[4]];
  const ts = Array.from({ length: n }, (_, i) => (n === 1 ? t0 : t0 + ((t1 - t0) * i) / (n - 1)));
  for (let i = 0; i < n; i++) await shot(ts[i], path.join(tmp, `f${String(i).padStart(3, '0')}.jpg`));
  const cols = Math.min(4, n), rows = Math.ceil(n / cols);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '1', '-i', path.join(tmp, 'f%03d.jpg'), '-vf', `scale=480:270,pad=484:274:2:2:#ffffff,tile=${cols}x${rows}:color=#ffffff`, '-frames:v', '1', out]);
  console.log(out); ts.forEach((t, i) => console.log(`  [r${Math.floor(i / cols) + 1} c${(i % cols) + 1}] ${t.toFixed(2)} s`));
} else if (cmd === 'clip') {
  const [t0, t1, out] = [+pos[1], +pos[2], pos[3]], fps = +(pos[4] || 60);
  const n = Math.round((t1 - t0) * fps);
  for (let i = 0; i < n; i++) await shot(t0 + i / fps, path.join(tmp, `c${String(i).padStart(5, '0')}.jpg`));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(fps), '-i', path.join(tmp, 'c%05d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', out]);
  console.log(out, n, 'frames');
} else { console.error('usage: sheet|clip|png (see the header)'); process.exitCode = 2; }
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
