import { ALL } from '../src/Film'; import { PKGS, DUR_FRAMES, FPS } from '../src/timeline';
const sfx = ALL.flatMap((p, i) => (p.sfx || []).map((e) => ({ ...e, t: +(e.t + PKGS[i].f0 / 24).toFixed(3), pkg: p.id })));
(globalThis as any).__OUT = { dur: DUR_FRAMES / FPS, sfx: sfx.sort((a, b) => a.t - b.t) };