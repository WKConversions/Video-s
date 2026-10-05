// The engine's loop: the site's own figure-8 ("One loop, run every weekday"), path data from clearscaler.com's loop
// diagram (viewBox 136 358 752 308, centred on 512,512). It starts at the crossing, runs up and round the left lobe
// (BE SEEN), back through the crossing, then round the right lobe (BE CHOSEN). Sampled by arc length so a dot can
// travel it at an even speed: pointAt(u) for u in 0..1 of the whole loop.
type P = [number, number];
const SEGS: [P, P, P, P][] = [
  [[512, 512], [449.7, 444.9], [383.3, 374.6], [289.2, 374.6]],
  [[289.2, 374.6], [210.4, 374.6], [151.8, 439.2], [151.8, 512]],
  [[151.8, 512], [151.8, 584.8], [210.4, 649.4], [289.2, 649.4]],
  [[289.2, 649.4], [383.3, 649.4], [449.7, 579.1], [512, 512]],
  [[512, 512], [574.3, 444.9], [640.7, 374.6], [734.8, 374.6]],
  [[734.8, 374.6], [813.6, 374.6], [872.2, 439.2], [872.2, 512]],
  [[872.2, 512], [872.2, 584.8], [813.6, 649.4], [734.8, 649.4]],
  [[734.8, 649.4], [640.7, 649.4], [574.3, 579.1], [512, 512]],
];
export const LOOP_D = "M512 512C449.7 444.9 383.3 374.6 289.2 374.6C210.4 374.6 151.8 439.2 151.8 512C151.8 584.8 210.4 649.4 289.2 649.4C383.3 649.4 449.7 579.1 512 512C574.3 444.9 640.7 374.6 734.8 374.6C813.6 374.6 872.2 439.2 872.2 512C872.2 584.8 813.6 649.4 734.8 649.4C640.7 649.4 574.3 579.1 512 512Z";
export const LOOP_BOX = { x: 136, y: 358, w: 752, h: 308, cx: 512, cy: 512 };

const bez = (s: [P, P, P, P], t: number): P => {
  const m = 1 - t;
  return [
    m * m * m * s[0][0] + 3 * m * m * t * s[1][0] + 3 * m * t * t * s[2][0] + t * t * t * s[3][0],
    m * m * m * s[0][1] + 3 * m * m * t * s[1][1] + 3 * m * t * t * s[2][1] + t * t * t * s[3][1],
  ];
};
const N = 160;
const PTS: P[] = [];
const LEN: number[] = [0];
for (const s of SEGS) for (let i = PTS.length ? 1 : 0; i <= N; i++) PTS.push(bez(s, i / N));
for (let i = 1; i < PTS.length; i++) LEN.push(LEN[i - 1] + Math.hypot(PTS[i][0] - PTS[i - 1][0], PTS[i][1] - PTS[i - 1][1]));
export const LOOP_LENGTH = LEN[LEN.length - 1];

/** Point and direction (radians) at share u of the loop's length (wraps). */
export const pointAt = (u: number): { x: number; y: number; a: number } => {
  const w = ((u % 1) + 1) % 1, d = w * LOOP_LENGTH;
  let lo = 0, hi = LEN.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (LEN[mid] <= d) lo = mid; else hi = mid; }
  const k = (d - LEN[lo]) / Math.max(1e-6, LEN[hi] - LEN[lo]);
  const x = PTS[lo][0] + (PTS[hi][0] - PTS[lo][0]) * k, y = PTS[lo][1] + (PTS[hi][1] - PTS[lo][1]) * k;
  return { x, y, a: Math.atan2(PTS[hi][1] - PTS[lo][1], PTS[hi][0] - PTS[lo][0]) };
};
/** Share of the loop's length at which each lobe point sits, for placing stops (measured once, by search). */
export const uNear = (x: number, y: number) => {
  let best = 0, bd = Infinity;
  for (let i = 0; i < PTS.length; i++) { const dd = (PTS[i][0] - x) ** 2 + (PTS[i][1] - y) ** 2; if (dd < bd) { bd = dd; best = i; } }
  return LEN[best] / LOOP_LENGTH;
};
