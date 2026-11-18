// Karl (18 Nov): 4 s in total; the animation is done by 1.7 s (faster, fewer repeats, the glitch only now and then), then just the logo.
export const FPS = 60, TOTAL = 240, M0 = 3, M1 = 88, SLAM = 88;
export const hash = (n: number) => { let x = (n * 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489917) >>> 0; x ^= x >>> 16; return (x >>> 0) / 4294967296; };
export type Kind = 'huge' | 'tiny' | 'mid' | 'inv' | 'outline' | 'grid' | 'slice' | 'rgb' | 'streak' | 'strobe' | 'bigoff';
const KINDS: Kind[] = ['huge', 'mid', 'tiny', 'inv', 'outline', 'grid', 'bigoff', 'streak', 'huge', 'inv', 'mid', 'tiny', 'outline', 'bigoff'];
const GLITCH_AT = new Set([9, 24, 38]);   // the slice / RGB glitch only three times, not constantly
export type St = { i: number; start: number; dur: number; kind: Kind };
export const states: St[] = (() => {
  const out: St[] = []; let t = M0, i = 0, prev = '';
  while (t < M1) {
    const p = (t - M0) / (M1 - M0);
    let dur = p < 0.35 ? 2 : (hash(i + 77) < 0.3 ? 2 : 1);   // 1-2 frames a state: very fast
    if (t + dur > M1) dur = M1 - t;
    let kind: Kind = GLITCH_AT.has(i) ? (i === 24 ? 'rgb' : 'slice') : KINDS[Math.floor(hash(i * 3 + 1) * KINDS.length)];
    if (kind === prev || (out.length > 1 && kind === out[out.length - 2].kind)) kind = KINDS[(KINDS.indexOf(kind) + 5) % KINDS.length];
    prev = kind; out.push({ i, start: t, dur, kind }); t += dur; i++;
  }
  return out;
})();
