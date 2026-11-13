// Checks the 3D hand's keys for the whole film: every glide's time against what it needs (compressed / tight clicks),
// and the share of the film the hand is on screen (Karl: 30-50%).   node tools/handcheck.mjs
import * as esbuild from 'esbuild'; import path from 'path'; import { fileURLToPath } from 'url'; import fs from 'fs'; import os from 'os';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = path.join(os.tmpdir(), 'hc-entry.ts');
fs.writeFileSync(entry, `import { handPlan, handAt } from '${ROOT}/src/hand.tsx'; import { handKeys } from '${ROOT}/src/film.js'; import { FPS, FRAMES_TOTAL } from '${ROOT}/src/timeline.js';
const keys = handKeys(); const SIZE = 170;
const { segs } = handPlan(keys, SIZE);
for (const s of segs) console.log(\`key \${s.i} at \${s.at.toFixed(2)}: glide \${s.s.toFixed(2)}-\${s.e.toFixed(2)} (\${(s.e - s.s).toFixed(2)} s, needs \${s.want.toFixed(2)}) \${Math.round(s.dist)} px, rest \${s.rest.toFixed(2)}\${s.compressed ? '  COMPRESSED' : ''}\${keys[s.i].click && s.rest < 0.2 ? '  TIGHT' : ''}\`);
let on = 0, runs = [], cur = null;
for (let f = 0; f < FRAMES_TOTAL; f++) { const h = handAt(f / FPS * 30, keys, { size: SIZE }); const vis = h.x > -SIZE * 0.6 && h.x < 1920 + SIZE * 0.4 && h.y > -SIZE * 0.2 && h.y < 1080 + SIZE * 0.1;
  if (vis) { on++; if (!cur) cur = [f / FPS, f / FPS]; else cur[1] = f / FPS; } else if (cur) { runs.push(cur); cur = null; } }
if (cur) runs.push(cur);
console.log('on screen:', runs.map(([a, b]) => a.toFixed(2) + '-' + b.toFixed(2)).join(', '), '=', (100 * on / FRAMES_TOTAL).toFixed(1) + '% of the film');`);
const out = await esbuild.build({ entryPoints: [entry], bundle: true, write: false, format: 'cjs', platform: 'node', logLevel: 'error',
  alias: { remotion: path.join(ROOT, 'tools/remotion-shim.cjs') }, external: ['react'], loader: { '.json': 'json' } });
fs.mkdirSync(path.join(ROOT, 'out/dev'), { recursive: true }); const f = path.join(ROOT, 'tools/.hc-out.cjs'); fs.writeFileSync(f, out.outputFiles[0].text);
process.chdir(ROOT); (await import('module')).createRequire(import.meta.url)(f);
