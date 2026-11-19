// Evaluates the film's packages in node (esbuild + a remotion shim) and prints JSON: every sound event in FILM seconds.
//   node tools/events.mjs        (used by sound/make_cues.py)
import * as esbuild from 'esbuild'; import path from 'path'; import { fileURLToPath } from 'url'; import fs from 'fs'; import { createRequire } from 'module';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = path.join(ROOT, 'tools/.ev-entry.ts');
fs.writeFileSync(entry, `import { ALL } from '../src/Film'; import { PKGS, DUR_FRAMES, FPS } from '../src/timeline';
const sfx = ALL.flatMap((p, i) => (p.sfx || []).map((e) => ({ ...e, t: +(e.t + PKGS[i].f0 / 24).toFixed(3), pkg: p.id })));
(globalThis as any).__OUT = { dur: DUR_FRAMES / FPS, sfx: sfx.sort((a, b) => a.t - b.t) };`);
const out = await esbuild.build({ entryPoints: [entry], bundle: true, write: false, format: 'cjs', platform: 'node', logLevel: 'error',
  alias: { remotion: path.join(ROOT, 'tools/remotion-shim.cjs') }, external: ['react'], loader: { '.json': 'json' } });
const f = path.join(ROOT, 'tools/.ev-out.cjs'); fs.writeFileSync(f, out.outputFiles[0].text);
const warn = console.warn; console.warn = () => {};
createRequire(import.meta.url)(f); console.warn = warn;
console.log(JSON.stringify(globalThis.__OUT));
