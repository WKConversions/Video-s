// Segment 7: the light-streak ring behind the four rapid lines (911-961), one continuous element.
import React from "react";
import { clamp01, keys, lerp } from "./lib";
import { seqv } from "./seg7_util";

// measured ellipse fits per frame, 911..953 (spec T2; centres lightly smoothed where the trails split)
const CX = [919, 967, 959, 952, 947, 942, 941, 942, 941, 942, 942, 945, 948, 949, 952, 955, 959, 962, 965, 970, 973, 978, 980, 978, 975, 970, 964, 955, 940, 925, 915, 914, 914, 913, 913, 912, 908, 900, 890, 882, 878, 880, 890];
const CY = [586, 559, 564, 568, 572, 574, 575, 575, 574, 573, 571, 568, 564, 561, 557, 553, 549, 545, 541, 536, 533, 530, 532, 536, 541, 545, 548, 552, 556, 559, 561, 561, 553, 544, 536, 534, 533, 533, 531, 528, 524, 516, 506];
const RX = [661, 896, 903, 904, 908, 910, 916, 921, 923, 926, 930, 932, 934, 934, 935, 938, 938, 939, 937, 939, 938, 945, 950, 945, 940, 935];
const RY = [34, 96, 125, 152, 176, 198, 218, 235, 250, 263, 274, 284, 292, 298, 303, 307, 310, 312, 312, 312, 311, 306, 298, 295, 290, 290, 289, 288, 290, 292, 293, 293, 285, 276, 263, 257, 250, 243, 236, 228, 221, 214, 206];
const ROT = [-3.2, -5.3, -7.0, -8.6, -10.1, -11.5, -12.8, -14.1, -15.1, -16.1, -17.0, -17.7, -18.3, -18.9, -19.3, -19.6, -19.9, -20.0, -20.1, -20.1, -20.0, -19.9, -19.9, -19.8, -19.3, -18.9, -18.7, -18.6, -18.4, -18.4, -18.7, -19.0, -19.0, -19.0, -19.3, -19.5, -19.4, -19.4, -19.6, -20.2, -20.8, -21.0, -20.7];
// hot-spot brightness (0..1 of the peak)
const HOT: [number, number][] = [[910, 0.45], [911, 0.67], [912, 0.81], [913, 0.89], [914, 0.94], [926, 1], [933, 0.97], [937, 0.86], [940, 0.66], [945, 0.58], [955, 0.58], [959, 0.5], [961, 0.42]];

type Trail = { dr: number; drot: number; op: number; hot: number; grp: 1 | 2 };
const TRAILS: Trail[] = [
  { dr: 0, drot: 0, op: 1, hot: 0, grp: 1 },
  { dr: 0.1, drot: 1.8, op: 0.72, hot: 60, grp: 1 },
  { dr: -0.09, drot: -1.6, op: 0.68, hot: -50, grp: 1 },
  { dr: 0.15, drot: 2.6, op: 0.55, hot: 110, grp: 2 },
  { dr: -0.14, drot: -2.4, op: 0.5, hot: -100, grp: 2 },
  { dr: 0.05, drot: -0.8, op: 0.5, hot: 25, grp: 2 },
];

/** colour stops along the arc (u = x / rx in the ring's own frame): a dim blue pedestal brighter on the left, a narrow
 *  hot spot at h (white core, light blue shoulders); everything left of `cut` fades out */
const PED: [number, number][] = [[-0.86, 0], [-0.7, 0.14], [-0.5, 0.32], [-0.3, 0.42], [0.1, 0.3], [0.3, 0.17], [0.5, 0.09], [0.7, 0.03], [0.84, 0]];
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(lerp(v, b[i], t)));
const BLUE = [63, 140, 232], LIGHT = [141, 192, 255], WHITE = [246, 250, 255], DEEP = [27, 79, 184];
const stops = (h: number, cut: number) => {
  const out: [number, string, number][] = [];
  for (let u = -0.86; u <= 0.861; u += 0.02) {
    const ped = keys(u, PED), hot = Math.exp(-0.5 * Math.pow((u - h) / 0.11, 2));
    const base = mix(DEEP, BLUE, clamp01(ped / 0.3));
    const c = hot < 0.5 ? mix(base, LIGHT, hot / 0.5) : mix(LIGHT, WHITE, (hot - 0.5) / 0.5);
    out.push([u, `rgb(${c.join(",")})`, Math.max(ped / 0.42 * 0.5, hot) * clamp01((u - cut) / 0.16)]);
  }
  return out;
};

export const Ring: React.FC<{ g: number }> = ({ g }) => {
  if (g < 911 || g > 961) return null;
  // geometry: measured to 953, then the bundle retracts and shrinks (954-961)
  let cx = seqv(g, 911, CX), cy = seqv(g, 911, CY), rx = seqv(g, 911, RX), ry = seqv(g, 911, RY), rot = seqv(g, 911, ROT);
  let cut = -2;
  if (g > 953) {
    // the bundle retracts toward the line and trims from the left (954-961)
    cx = keys(g, [[953, 890], [956, 915], [958, 930], [961, 950]]);
    cy = keys(g, [[953, 506], [956, 508], [958, 512], [961, 515]]);
    rx = keys(g, [[953, 935], [956, 920], [958, 880], [959, 840], [960, 800], [961, 760]]);
    ry = keys(g, [[953, 206], [956, 186], [958, 170], [959, 162], [960, 154], [961, 145]]);
    rot = keys(g, [[953, -20.7], [956, -18], [958, -16.5], [961, -15]]);
    cut = keys(g, [[953, -1.2], [956, -1.0], [958, -0.9], [959, -0.8], [960, -0.7], [961, -0.62]]);
  }
  const I = keys(g, HOT);
  const s1 = clamp01((g - 932) / 2.5), s2 = clamp01((g - 941) / 2.5);
  const arcs: React.ReactNode[] = [];
  const defs: React.ReactNode[] = [];
  TRAILS.forEach((t, j) => {
    const sp = t.grp === 1 ? (j === 0 ? 1 : s1) : s2;
    if (sp <= 0) return;
    const ryj = ry * (1 + t.dr * sp), rotj = rot + t.drot * sp, op0 = (j === 0 ? 1 : t.op * sp) * I;
    // lower arc (hot right of centre) and upper arc (hot left of centre)
    for (const [k, th0, th1, hot] of [["lo", 0.14, 0.86, keys(g, [[938, -0.1], [943, 0.05]]) + t.hot / rx], ["up", 1.14, 1.86, -0.12 + t.hot / rx]] as [string, number, number, number][]) {
      const id = `s7r-${j}-${k}`;
      const op = op0 * (k === "up" ? keys(g, [[940, 1], [948, 0.8]]) : 1);
      const pts: string[] = [];
      for (let q = 0; q <= 64; q++) {
        const th = Math.PI * lerp(th0, th1, q / 64);
        pts.push(`${(rx * Math.cos(th)).toFixed(1)},${(ryj * Math.sin(th)).toFixed(1)}`);
      }
      defs.push(
        <linearGradient key={id} id={id} gradientUnits="userSpaceOnUse" x1={-rx} y1={0} x2={rx} y2={0}>
          {stops(hot, k === "lo" ? cut : cut + 0.1).map(([o, c, a], n) => <stop key={n} offset={clamp01((o + 1) / 2)} stopColor={c} stopOpacity={a} />)}
        </linearGradient>,
      );
      const d = `M${pts.join(" L")}`;
      arcs.push(
        <g key={id} transform={`translate(${cx} ${cy}) rotate(${rotj})`} opacity={op}>
          <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={18} opacity={0.16} filter="url(#s7r-wide)" />
          <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={8} opacity={0.6} filter="url(#s7r-glow)" />
          <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={2.6} />
        </g>,
      );
    }
  });
  // the faint dark outline just outside the left tip
  const dark = g <= 943 ? (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`} opacity={0.4 * clamp01((g - 912) / 3) * clamp01((943 - g) / 2)}>
      <defs>
        <linearGradient id="s7r-dark" gradientUnits="userSpaceOnUse" x1={-rx} y1={0} x2={rx} y2={0}>
          <stop offset="0" stopColor="#000" stopOpacity={1} /><stop offset="0.07" stopColor="#000" stopOpacity={0.8} /><stop offset="0.14" stopColor="#000" stopOpacity={0} />
          <stop offset="0.9" stopColor="#000" stopOpacity={0} /><stop offset="0.97" stopColor="#000" stopOpacity={g > 931 && g < 942 ? 0.8 : 0} />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={rx * 1.0} ry={ry * 1.06} fill="none" stroke="url(#s7r-dark)" strokeWidth={3} filter="url(#s7r-soft)" />
    </g>
  ) : null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <filter id="s7r-wide" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
        <filter id="s7r-glow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3.2" /></filter>
        <filter id="s7r-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="1.5" /></filter>
        {defs}
      </defs>
      {dark}
      {arcs}
    </svg>
  );
};
