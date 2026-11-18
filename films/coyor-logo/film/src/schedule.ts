export const FPS = 60, TOTAL = 180, M0 = 6, M1 = 114, SLAM = 114;
export const hash = (n: number) => { let x = (n * 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489917) >>> 0; x ^= x >>> 16; return (x >>> 0) / 4294967296; };
export type Kind = 'huge' | 'tiny' | 'mid' | 'inv' | 'outline' | 'grid' | 'slice' | 'rgb' | 'streak' | 'strobe' | 'bigoff';
const KINDS: Kind[] = ['huge', 'mid', 'tiny', 'slice', 'inv', 'grid', 'rgb', 'outline', 'streak', 'bigoff', 'huge', 'strobe', 'slice', 'mid', 'inv', 'rgb'];
export type St = { i: number; start: number; dur: number; kind: Kind };
export const states: St[] = (() => {
  const out: St[] = []; let t = M0, i = 0, prev = '';
  while (t < M1) {
    const p = (t - M0) / (M1 - M0);
    let dur = Math.max(1, Math.round(4 - 3.2 * p + (hash(i + 77) - 0.5) * 1.2));
    if (t + dur > M1) dur = M1 - t;
    let kind = KINDS[Math.floor(hash(i * 3 + 1) * KINDS.length)];
    if (kind === prev) kind = KINDS[(KINDS.indexOf(kind) + 5) % KINDS.length];
    prev = kind; out.push({ i, start: t, dur, kind }); t += dur; i++;
  }
  return out;
})();
