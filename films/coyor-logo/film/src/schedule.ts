// Karl (18 Nov): 5 s in total; fast animation 0-1 s, then the logo for 4 s.
export const FPS = 60, TOTAL = 300, M0 = 2, M1 = 56, SLAM = 56;
export const hash = (n: number) => { let x = (n * 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489917) >>> 0; x ^= x >>> 16; return (x >>> 0) / 4294967296; };
export type Kind = 'huge' | 'tiny' | 'mid' | 'inv' | 'outline' | 'grid' | 'slice' | 'rgb' | 'streak' | 'strobe' | 'bigoff';
// Karl (5 s version): animation 1 s, logo 4 s. Montage order = deterministic shuffled rounds of all kinds, no kind twice within 4 states.
const ALL: Kind[] = ['huge', 'mid', 'tiny', 'inv', 'outline', 'grid', 'bigoff', 'streak', 'strobe'];
const GLITCH_AT: Record<number, Kind> = {11: 'slice', 27: 'rgb'};   // glitch kinds only twice
export type St = { i: number; start: number; dur: number; kind: Kind };
const order = (n: number): Kind[] => {
  const seq: Kind[] = [];
  let round = 0;
  while (seq.length < n) {
    for (let tries = 0; ; tries++) {
      const a = ALL.map((k, j) => ({k, r: hash(round * 101 + j * 7 + tries * 1009 + 3)})).sort((x, y) => x.r - y.r).map((x) => x.k);
      const ok = a.every((k, j) => { const prev = [...seq, ...a.slice(0, j)].slice(-3); return !prev.includes(k); });
      if (ok) { seq.push(...a); break; }
    }
    round++;
  }
  return seq;
};
export const states: St[] = (() => {
  const out: St[] = []; let t = M0, i = 0; const seq = order(60);
  while (t < M1) {
    let kind = GLITCH_AT[i] ?? seq[i];
    let dur = kind === 'strobe' ? 2 : (hash(i + 77) < 0.22 ? 2 : 1);
    if (t + dur > M1) dur = M1 - t;
    out.push({ i, start: t, dur, kind }); t += dur; i++;
  }
  return out;
})();
