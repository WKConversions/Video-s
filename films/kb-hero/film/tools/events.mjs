// Evaluates the film's scenes in node (esbuild + a remotion shim) and prints JSON: every sound event in film seconds, the
// scene list, the hand's glide plan (compressed / tight glides flagged) and the share of the film the hand is on screen.
//   node tools/events.mjs            JSON for sound/make_cues.py
//   node tools/events.mjs --hand     a readable hand report
import * as esbuild from 'esbuild'; import path from 'path'; import { fileURLToPath } from 'url'; import fs from 'fs'; import { createRequire } from 'module';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = path.join(ROOT, 'tools/.ev-entry.ts');
fs.writeFileSync(entry, `import { GROUPS, SESSIONS, sessionKeys, handNow, HAND_SIZE } from '../src/Film'; import { SCENES, DUR } from '../src/timeline'; import { handPlan } from '../src/hand';
const sfx = SCENES.flatMap((s) => (GROUPS[s.group].sfx[s.id] || []).map((e) => ({ ...e, t: +(e.t + s.start).toFixed(3), scene: s.id })));
const plan = SESSIONS.flatMap((ss) => { const keys = sessionKeys(ss); return keys.length > 1 ? handPlan(keys, HAND_SIZE).segs.map((s) => ({ ...s, click: !!keys[s.i].click, session: ss.scenes.join('+') })) : []; });
let on = 0; const N = Math.round(DUR * 60); const runs = []; let cur = null;
for (let f = 0; f < N; f++) { const hn = handNow(f / 60); const vis = !!hn && hn.h.x > -60 && hn.h.x < 1980 && hn.h.y > -150 && hn.h.y < 1100;
  if (vis) { on++; if (!cur) cur = [f / 60, f / 60]; else cur[1] = f / 60; } else if (cur) { runs.push(cur); cur = null; } }
if (cur) runs.push(cur);
(globalThis as any).__OUT = { dur: DUR, scenes: SCENES, sfx, plan, handShare: +(on / N).toFixed(3), runs };`);
const out = await esbuild.build({ entryPoints: [entry], bundle: true, write: false, format: 'cjs', platform: 'node', logLevel: 'error',
  alias: { remotion: path.join(ROOT, 'tools/remotion-shim.cjs') }, external: ['react'], loader: { '.json': 'json' } });
const f = path.join(ROOT, 'tools/.ev-out.cjs'); fs.writeFileSync(f, out.outputFiles[0].text);
const warn = console.warn; console.warn = () => {};
createRequire(import.meta.url)(f); console.warn = warn;
const o = globalThis.__OUT;
if (process.argv.includes('--hand')) {
  for (const s of o.plan) console.log(`${s.session} key ${s.i} at ${s.at.toFixed(2)}: glide ${s.s.toFixed(2)}-${s.e.toFixed(2)} (${(s.e - s.s).toFixed(2)} s, needs ${s.want.toFixed(2)}) ${Math.round(s.dist)} px, rest ${s.rest.toFixed(2)}${s.compressed ? '  COMPRESSED' : ''}${s.click && s.rest < 0.2 ? '  TIGHT' : ''}`);
  console.log('on screen:', o.runs.map(([a, b]) => a.toFixed(2) + '-' + b.toFixed(2)).join(', '), '=', (100 * o.handShare).toFixed(1) + '% of the film');
} else console.log(JSON.stringify(o));
