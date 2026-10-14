// Segment 1 (film f0–146, 0–4.9 s), rebuilt frame for frame from spec/seg1.md:
//   f0–4    the settled end card as a thumbnail (EndCard from ./logo)          → hard cut
//   f5      pure black                                                          → hard cut
//   f6–45   "Meet": fade up from black under an expanding light, letters fade in one by one while the word rises and
//           shrinks, then a cool bloom and a full-frame mosaic (2→32 px blocks)  → hard cut inside the bloom
//   f46–97  logo reveal: the WKConversions lockup pulls back (dolly), the wkc mark writes itself on, "WK" blooms and
//           settles, "Conversions" wipes in and closes the gap, a light streak draws under it; then a slow 3D orbit and an
//           accelerating pull-back into the cut
//   f98–146 "Motion | that makes it click" between two glowing 3D rings (./seg1_motion)  → hard cut at 146→147
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, clamp01, lerp } from "./lib";
import { EndCard, WkcLogo, spline } from "./logo";
import { MotionShot } from "./seg1_motion";
import { colorAt, glyphs, rgba, wk } from "./seg1_util";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [0, 147];

// =================================================================================================================
// Shot C: "Meet" (f6–45)
const MEET = { size: 249, capR: 0.73, track: 0.0445, lsbM: 0.0402, rsbT: 0.0112, color: "#F7F7F8" };
/** measured letter opacity M / e / e / t per frame (normalised peak, includes the fade from black), f6…f33 */
const MEET_OP: Record<number, number[]> = {
  6: [0.02, 0, 0, 0], 7: [0.06, 0.01, 0.01, 0], 8: [0.11, 0.0, 0.0, 0.01], 9: [0.18, 0.02, 0.01, 0.01], 10: [0.29, 0.1, 0.01, 0],
  11: [0.35, 0.16, 0.01, 0], 12: [0.42, 0.23, 0.01, 0], 13: [0.48, 0.31, 0.01, 0.01], 14: [0.56, 0.39, 0.01, 0.01], 15: [0.61, 0.46, 0.12, 0.01],
  16: [0.67, 0.54, 0.22, 0.01], 17: [0.76, 0.62, 0.33, 0.01], 18: [0.81, 0.69, 0.44, 0.01], 19: [0.89, 0.8, 0.53, 0.01], 20: [0.93, 0.85, 0.62, 0.11],
  21: [0.99, 0.93, 0.72, 0.26], 22: [1, 1, 0.82, 0.39], 23: [1, 1, 0.86, 0.49], 24: [1, 1, 0.9, 0.59], 25: [1, 1, 0.94, 0.67],
  26: [1, 1, 0.97, 0.73], 27: [1, 1, 0.99, 0.79], 28: [1, 1, 1, 0.85], 29: [1, 1, 1, 0.9], 30: [1, 1, 1, 0.93], 31: [1, 1, 1, 0.97], 32: [1, 1, 1, 0.98],
};
const MEET_START = [5, 9.5, 14.5, 19];
/** entry blur σ (screen px) as a function of frames since the letter's start (measured on the M) */
const ENTRY_BLUR: [number, number][] = [[0, 3], [4, 3], [5, 2.8], [6, 1.8], [7, 1.6], [11, 1.6], [12, 1.4], [13, 1.4], [14, 1.3], [15, 1.2], [16, 1.2], [17, 1], [19, 1], [20, 0.9], [21, 0.8], [22, 0.7], [23, 0.6], [24, 0.4], [25, 0]];
const lin = (x: number, k: [number, number][]) => {
  if (x <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (x <= k[i][0]) return lerp(k[i - 1][1], k[i][1], (x - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
  return k[k.length - 1][1];
};
/** exit bloom (σ px, gain), text core blur and mosaic block size per frame */
const BLOOM: Record<number, [number, number]> = { 37: [75, 0.03], 38: [18, 0.12], 39: [18, 0.26], 40: [24, 0.44], 41: [38, 0.66], 42: [60, 0.94], 43: [75, 1.34], 44: [75, 1.75], 45: [75, 2.4] };
const EXIT_BLUR: Record<number, number> = { 40: 0.75, 41: 0.75, 42: 1.0, 43: 1.2, 44: 1.5, 45: 1.5 };
const MOSAIC: Record<number, number> = { 41: 2, 42: 4, 43: 8, 44: 16, 45: 32 };
/** background: radial light centred (968, 537); stops [radius px, reference colour] per keyframe (mapped to WKC blue) */
const MEET_BG: [number, [number, string][]][] = [
  [6, [[0, "#030207"], [240, "#030206"], [360, "#020205"], [480, "#020204"], [600, "#020204"], [1150, "#010102"]]],
  [7, [[0, "#07050C"], [240, "#06050A"], [370, "#050409"], [410, "#030305"], [600, "#030205"], [1150, "#020203"]]],
  [8, [[0, "#080812"], [240, "#07080C"], [330, "#06070B"], [390, "#05060A"], [600, "#05060A"], [1150, "#05060A"]]],
  [9, [[0, "#0C0B1A"], [240, "#090814"], [330, "#08080F"], [450, "#07080C"], [600, "#06060A"], [1150, "#05060A"]]],
  [10, [[0, "#0F0E1D"], [240, "#0C0C18"], [360, "#0A0B14"], [480, "#090913"], [600, "#07080E"], [1150, "#07090E"]]],
  [12, [[0, "#0F0E1E"], [240, "#0C0C19"], [360, "#0B0B15"], [480, "#0A0A15"], [600, "#090812"], [1150, "#07090E"]]],
  [14, [[0, "#100F20"], [240, "#0C0C18"], [360, "#0C0B17"], [480, "#0A0A15"], [600, "#090913"], [1150, "#07090E"]]],
  [16, [[0, "#100F22"], [240, "#0D0C18"], [360, "#0C0B17"], [480, "#0B0B15"], [600, "#0C0B18"], [1150, "#080912"]]],
  [18, [[0, "#110F22"], [240, "#0F0D22"], [360, "#0D0C1A"], [480, "#0C0C18"], [600, "#0C0B18"], [1150, "#090913"]]],
  [20, [[0, "#110F22"], [240, "#0F0D22"], [360, "#0D0C1A"], [480, "#0C0C18"], [600, "#0C0B18"], [1150, "#0A0A14"]]],
  [23, [[0, "#121023"], [240, "#0F0D22"], [360, "#0E0D1D"], [480, "#0C0C18"], [600, "#0C0C19"], [1150, "#0D0C16"]]],
  [32, [[0, "#121023"], [240, "#0F0D22"], [360, "#0E0D1D"], [480, "#0C0C18"], [600, "#0C0C19"], [1150, "#0D0C16"]]],
  [41, [[0, "#121023"], [240, "#0F0D22"], [360, "#0E0D1D"], [480, "#0C0C18"], [600, "#0C0B18"], [1150, "#0B0B15"]]],
];
const meetBg = (f: number) => {
  let i = 1;
  while (i < MEET_BG.length - 1 && f > MEET_BG[i][0]) i++;
  const [fa, A] = MEET_BG[i - 1], [fb, B] = MEET_BG[i], t = clamp01((f - fa) / (fb - fa));
  const stops = A.map(([r, c], j) => `${colorAt(t, [[0, wk(c)], [1, wk(B[j][1])]])} ${lerp(r, B[j][0], t).toFixed(1)}px`);
  return `radial-gradient(circle at 968px 537px, ${stops.join(", ")})`;
};

/** Full-frame mosaic: average (pre-blur) then sample one point per b×b block on a grid anchored at (0, 0). */
const MosaicDefs: React.FC<{ b: number; id: string }> = ({ b, id }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id={id} x={0} y={0} width={1920} height={1080} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={b * 0.22} edgeMode="duplicate" result="avg" />
        <feFlood x={b / 2} y={b / 2} width={1} height={1} floodColor="#fff" result="dot" />
        <feComposite in="dot" in2="dot" operator="over" x={0} y={0} width={b} height={b} result="cell" />
        <feTile in="cell" x={0} y={0} width={1920} height={1080} result="grid" />
        <feComposite in="avg" in2="grid" operator="in" result="pts" />
        <feMorphology in="pts" operator="dilate" radius={b / 2} />
      </filter>
    </defs>
  </svg>
);

const MeetShot: React.FC<{ f: number }> = ({ f }) => {
  const S = MEET.size, capFull = MEET.capR * S;
  const cap = 181.0 - 32.3 * Math.pow((f - 5) / 41, 3);
  const mid = 622.7 - 82.6 * (1 - Math.pow(1 - (f - 5) / 44.9, 3));
  const k = cap / capFull;
  const { xs } = glyphs("Meet", F.head, S, 800, MEET.track);
  const tAdv = glyphs("t", F.head, S, 800).total;
  const inkL = xs[0] + MEET.lsbM * S, inkR = xs[3] + tAdv - MEET.rsbT * S, x0 = -(inkL + inkR) / 2;
  const op = MEET_OP[Math.min(32, Math.max(6, Math.round(f)))] ?? [1, 1, 1, 1];
  const ops = f >= 33 ? [1, 1, 1, 1] : op;
  const bl = BLOOM[f], core = EXIT_BLUR[f] ?? 0, mos = MOSAIC[f];
  const blur = MEET_START.map((s0) => lin(f - s0, ENTRY_BLUR));
  return (
    <>
      {mos ? <MosaicDefs b={mos} id="s1-mos" /> : null}
      <AbsoluteFill style={{ filter: mos ? "url(#s1-mos)" : undefined }}>
        <AbsoluteFill style={{ background: meetBg(f) }} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs>
            {blur.map((b, i) => b > 0.05 && <filter key={i} id={`s1-mb${i}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={b / k} /></filter>)}
            <filter id="s1-mg" x={-1200} y={-900} width={2400} height={1800} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation={core / k} result="core" />
              <feGaussianBlur in="core" stdDeviation={55 / k} result="ha" />
              <feFlood floodColor="#3F8CE8" floodOpacity={0.2} />
              <feComposite in2="ha" operator="in" result="halo" />
              <feGaussianBlur in="core" stdDeviation={(bl ? bl[0] : 1) / k} result="ba" />
              <feFlood floodColor="#E6F0FD" />
              <feComposite in2="ba" operator="in" result="bc" />
              <feComponentTransfer in="bc" result="bloom"><feFuncA type="linear" slope={bl ? bl[1] : 0} /></feComponentTransfer>
              <feMerge><feMergeNode in="halo" /><feMergeNode in="core" /><feMergeNode in="bloom" /></feMerge>
            </filter>
          </defs>
          <g transform={`translate(960 ${mid}) scale(${k})`} filter="url(#s1-mg)">
            {"Meet".split("").map((ch, i) => ops[i] > 0.003 && (
              <text key={i} x={x0 + xs[i]} y={capFull / 2} fontFamily={F.head} fontWeight={800} fontSize={S} fill={MEET.color} opacity={ops[i]}
                filter={blur[i] > 0.05 ? `url(#s1-mb${i})` : undefined}>{ch}</text>
            ))}
          </g>
        </svg>
      </AbsoluteFill>
    </>
  );
};

// =================================================================================================================
// Shot D: logo reveal (f46–97)
/** dolly scale: a hyperbolic pull-back, then the measured accelerating exit */
const S_EXIT = [1.0005, 0.9967, 0.9903, 0.9818, 0.9656, 0.9378, 0.88];
const dolly = (f: number) => (f <= 90 ? 0.9329 + 0.9932 / Math.pow(1 + (f - 44.29) / 3.877, 1.0375) : S_EXIT[Math.min(6, Math.round(f) - 91)]);
const ROTZ: [number, number][] = [[46, 0], [69, 0], [70, 0.19], [71, 0.4], [72, 0.63], [73, 0.84], [74, 1.03], [75, 1.2], [76, 1.37], [77, 1.54], [78, 1.69], [79, 1.83], [80, 1.97], [81, 2.1], [82, 2.22], [83, 2.34], [84, 2.46], [85, 2.56], [86, 2.66], [87, 2.75], [88, 2.84], [89, 2.92], [90, 2.99], [91, 3.06], [92, 3.11], [93, 3.13], [94, 3.11], [95, 3.1], [97, 3.1]];
const ROTY: [number, number][] = [[46, 0], [69, 0], [72, 1], [76, 2.5], [80, 4], [84, 5.5], [88, 7], [91, 8], [92, 9], [93, 10], [94, 11.5], [95, 13], [96, 15], [97, 17]];
const GCX: [number, number][] = [[46, 968.4], [48, 968.2], [50, 967.8], [52, 967.5], [54, 967.2], [56, 967.1], [58, 966.9], [60, 966.75], [64, 966.6], [68, 966.5], [72, 966.2], [76, 966.0], [80, 965.65], [84, 965.4], [88, 965.2], [92, 965.0], [94, 964.8], [96, 964.6], [97, 964.6]];
const GCY: [number, number][] = [[46, 522.6], [48, 523.3], [50, 524.6], [52, 525.4], [54, 526.0], [56, 526.5], [58, 527.1], [60, 527.3], [80, 527.1], [88, 527.3], [90, 527.6], [92, 528.2], [94, 529.0], [95, 529.5], [96, 530.4], [97, 531.3]];
/** spotlight background keyframes (reference colours): centre, mid, outer, left base, right base */
const LOGO_BG: [number, string, string, string, string, string][] = [
  [46, "#1A1535", "#15112C", "#100E22", "#0F0D1A", "#0A0C18"],
  [52, "#1C1638", "#16122E", "#110F24", "#100E1B", "#0B0D18"],
  [60, "#262049", "#1D1641", "#16112E", "#14111F", "#0B0F18"],
  [72, "#21194C", "#1C153F", "#15112C", "#14101F", "#0B0E17"],
  [84, "#21194D", "#1C1640", "#131027", "#100E1C", "#0A0C16"],
  [90, "#21194C", "#1C1641", "#131026", "#0F0D1A", "#090C15"],
  [97, "#20184A", "#1B1640", "#0E0D1D", "#08090F", "#06090E"],
];
const logoBg = (f: number) => {
  const col = (j: number) => wk(colorAt(f, LOGO_BG.map((r) => [r[0], r[j]] as [number, string])));
  const k = clamp01((f - 88) / 9), rx = lerp(1000, 760, k * k), ry = lerp(700, 600, k * k);
  return [
    `radial-gradient(ellipse ${rx}px ${ry}px at 960px 630px, ${col(1)} 0%, ${col(2)} 36%, ${rgba(col(3), 1)} 70%, ${rgba(col(3), 0)} 100%)`,
    `linear-gradient(90deg, ${col(4)} 0%, ${col(4)} 30%, ${col(5)} 100%)`,
  ].join(", ");
};

/** light streak polyline per frame (Appendix L, smoothed): f, y at x=900, slope, tail x, head x, left corner x, left dx/dy,
 *  left visible-to y, right corner x, right dx/dy, right visible-up-to y (−1 = none) */
const STREAK: number[][] = [
  [48, 665.1, 0.0, 37.0, 462.0, -1, -1, -1, -1, -1, -1],
  [49, 664.2, 0.0, 31.0, 550.0, -1, -1, -1, -1, -1, -1],
  [50, 663.6, 0.0, 40.0, 646.0, -1, -1, -1, -1, -1, -1],
  [51, 663.1, 0.0, 66.0, 726.0, 75, -0.863, 762.0, -1, -1, -1],
  [52, 662.0, 0.0, 85.0, 808.0, 95, -0.863, 774.0, -1, -1, -1],
  [53, 661.0, 0.0, 108.0, 892.0, 113.0, -0.863, 796.3, -1, -1, -1],
  [54, 660.3, 0.0, 127.0, 966.0, 130.8, -0.864, 817.7, -1, -1, -1],
  [55, 659.7, 0.0, 145.0, 1036.0, 147.4, -0.863, 835.7, -1, -1, -1],
  [56, 659.4, 0.0, 156.0, 1099.0, 162.8, -0.86, 850.3, -1, -1, -1],
  [57, 659.1, 0.0, 168.0, 1155.0, 174.2, -0.857, 863.3, -1, -1, -1],
  [58, 658.8, 0.0, 184.0, 1215.0, 183.4, -0.86, 874.7, -1, -1, -1],
  [59, 658.4, 0.0, 187.0, 1273.0, 193.8, -0.86, 887.7, -1, -1, -1],
  [60, 658.2, 0.0, 198.0, 1333.0, 202.6, -0.859, 897.7, -1, -1, -1],
  [61, 658.1, 0.0, 205.0, 1372.0, 209.0, -0.856, 906.7, -1, -1, -1],
  [62, 657.9, 0.0, 217.0, 1423.0, 216.8, -0.851, 913.7, -1, -1, -1],
  [63, 657.8, 0.0, 220.0, 1464.0, 223.6, -0.852, 919.3, -1, -1, -1],
  [64, 657.7, 0.0, 226.0, 1527.0, 228.4, -0.857, 925.3, -1, -1, -1],
  [65, 657.4, 0.0, 232.0, 1590.0, 233.2, -0.852, 929.3, -1, -1, -1],
  [66, 657.5, 0.0, 237.0, 1599.0, 238.0, -0.849, 931.3, -1, -1, -1],
  [67, 657.4, 0.0, 243.0, 1608.0, 242.4, -0.848, 934.0, -1, -1, -1],
  [68, 657.4, 0.0, 249.0, 1609.0, 246.8, -0.848, 931.0, -1, -1, -1],
  [69, 657.3, 0.0, 249.0, 1599.0, 251.2, -0.844, 924.3, 1598.3, -0.669, 546.5],
  [70, 657.7, -0.0055, 250.0, 1600.0, 253.2, -0.842, 917.3, 1597.0, -0.658, 535.7],
  [71, 658.2, -0.009, 256.0, 1591.0, 256.0, -0.84, 911.7, 1594.0, -0.659, 508.7],
  [72, 658.3, -0.0128, 253.0, 1591.0, 259.4, -0.844, 911.3, 1589.6, -0.653, 471.0],
  [73, 658.6, -0.0166, 256.0, 1582.0, 262.4, -0.848, 900.3, 1585.2, -0.647, 429.0],
  [74, 658.8, -0.0203, 265.0, 1579.0, 265.0, -0.847, 888.3, 1582.0, -0.636, 402.7],
  [75, 658.9, -0.0238, 261.0, 1579.0, 268.0, -0.845, 861.7, 1578.2, -0.632, 391.7],
  [76, 658.9, -0.0275, 267.0, 1572.0, 270.0, -0.85, 832.7, 1576.0, -0.62, 382.7],
  [77, 659.1, -0.0307, 265.0, 1578.0, 270.8, -0.853, 797.7, 1573.0, -0.613, 378.0],
  [78, 659.2, -0.0339, 265.0, 1576.0, 271.3, -0.853, 782.0, 1571.4, -0.601, 368.0],
  [79, 659.2, -0.037, 279.0, 1569.0, -1, -1, -1, 1569.4, -0.592, 364.0],
  [80, 659.4, -0.0396, 291.0, 1570.0, -1, -1, -1, 1566.6, -0.588, 358.0],
  [81, 659.6, -0.042, 345.0, 1567.0, -1, -1, -1, 1564.4, -0.582, 358.0],
  [82, 659.8, -0.0449, 393.0, 1563.0, -1, -1, -1, 1562.6, -0.576, 356.7],
  [83, 660.0, -0.047, 466.0, 1563.0, -1, -1, -1, 1559.8, -0.573, 349.3],
  [84, 660.2, -0.0492, 525.0, 1563.0, -1, -1, -1, 1557.4, -0.569, 340.3],
  [85, 660.5, -0.0514, 582.0, 1558.0, -1, -1, -1, 1555.4, -0.562, 349.3],
  [86, 660.6, -0.0529, 639.0, 1555.0, -1, -1, -1, 1553.0, -0.556, 357.3],
  [87, 660.9, -0.0546, 696.0, 1552.0, -1, -1, -1, 1551.0, -0.547, 367.0],
  [88, 661.0, -0.0565, 754.0, 1549.0, -1, -1, -1, 1548.2, -0.543, 366.3],
  [89, 661.1, -0.0583, 822.0, 1549.0, -1, -1, -1, 1545.4, -0.535, 368.3],
  [90, 661.1, -0.0601, 886.0, 1548.0, -1, -1, -1, 1542.2, -0.526, 369.3],
  [91, 661.1, -0.0621, 948.0, 1542.0, -1, -1, -1, 1540, -0.511, 369],
  [92, 661.0, -0.064, 1011.0, 1539.0, -1, -1, -1, 1534, -0.509, 379],
  [93, 660.3, -0.0645, 1074.0, 1531.0, -1, -1, -1, 1530, -0.479, 396],
  [94, 658.8, -0.0636, 1138.0, 1524.0, -1, -1, -1, 1520, -0.462, 438],
  [95, 657.2, -0.0647, 1191.0, 1512.0, -1, -1, -1, 1507, -0.434, 472],
  [96, 653.6, -0.0612, 1249.0, 1491.0, -1, -1, -1, 1486, -0.395, 484],
  [97, 648.1, -0.0486, 1285.0, 1450.0, -1, -1, -1, 1444, -0.338, 504],
];
const STREAK_I: [number, number][] = [[48, 0.22], [50, 0.32], [55, 0.56], [60, 0.7], [66, 0.85], [72, 1], [88, 1], [91, 0.82], [94, 0.48], [97, 0.32]];
/** top edge (y at x = 1800) of the faint lit panel right of the streak's upper-right edge */
const PANEL_TOP: [number, number][] = [[82, 520], [84, 368], [88, 248], [92, 150], [95, 143], [97, 140]];

const Streak: React.FC<{ f: number }> = ({ f }) => {
  const r = STREAK[Math.round(f) - 48];
  if (!r) return null;
  const [, y9, sl, xf, xt, lcx, ldx, lvy, rcx, rdx, rvy] = r;
  const hy = (x: number) => y9 + sl * (x - 900);
  const I = spline(f, STREAK_I);
  const hasL = lcx >= 0, hasR = rcx >= 0;
  const hx0 = hasL ? lcx : xf, hx1 = hasR ? rcx : xt;
  const lines: { d: string; grad: string }[] = [];
  if (hasL) { const y1 = lvy, x1 = lcx + ldx * (y1 - hy(lcx)); lines.push({ d: `M${x1},${y1} L${lcx},${hy(lcx)}`, grad: "s1-sl" }); }
  lines.push({ d: `M${hx0},${hy(hx0)} L${hx1},${hy(hx1)}`, grad: "s1-sh" });
  let ext = "";
  if (hasR) {
    const cy = hy(rcx), x1 = rcx + rdx * (rvy - cy);
    lines.push({ d: `M${rcx},${cy} L${x1},${rvy}`, grad: "s1-sr" });
    if (f >= 74) { const yt = -20, xt2 = rcx + rdx * (yt - cy); ext = `M${x1},${rvy} L${xt2},${yt}`; }
  }
  const rc = hasR ? [rcx, hy(rcx)] : [0, 0];
  const panelK = clamp01((f - 81) / 5);
  const ptop = spline(f, PANEL_TOP);
  // diamonds: keyframe flashes when the head passes the corners
  const dia = [[51, hasL ? lcx : 75, hasL ? hy(lcx) : 663], [69, rc[0] || 1598, rc[1] || 657]].map(([f0, x, y]) => ({ x, y, o: f >= f0 && f < f0 + 9 ? 1 - (f - f0) / 8 : 0 }));
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="s1-sh" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={1920} y2={0}>
          <stop offset={0} stopColor="#3F8CE8" stopOpacity={0.6} /><stop offset={0.21} stopColor="#4A90E6" stopOpacity={0.72} /><stop offset={0.36} stopColor="#96B4D9" stopOpacity={0.9} />
          <stop offset={0.51} stopColor="#E6F0FD" /><stop offset={0.56} stopColor="#E6F0FD" /><stop offset={0.68} stopColor="#8FB2DC" stopOpacity={0.85} /><stop offset={0.78} stopColor="#3F8CE8" stopOpacity={0.7} /><stop offset={1} stopColor="#3F8CE8" stopOpacity={0.6} />
        </linearGradient>
        <linearGradient id="s1-sl" gradientUnits="userSpaceOnUse" x1={0} y1={hasL ? hy(lcx) : 660} x2={0} y2={hasL ? lvy : 900}>
          <stop offset={0} stopColor="#3F8CE8" stopOpacity={1} /><stop offset={1} stopColor="#3F8CE8" stopOpacity={0.55} />
        </linearGradient>
        <linearGradient id="s1-sr" gradientUnits="userSpaceOnUse" x1={0} y1={rc[1]} x2={0} y2={hasR ? rvy : 0}>
          <stop offset={0} stopColor="#5E9BE6" stopOpacity={1} /><stop offset={0.7} stopColor="#3F8CE8" stopOpacity={0.75} /><stop offset={1} stopColor="#3F8CE8" stopOpacity={0.15} />
        </linearGradient>
        <linearGradient id="s1-se" gradientUnits="userSpaceOnUse" x1={0} y1={hasR ? rvy : 400} x2={0} y2={hasR ? Math.max(0, rvy - 260) : 0}>
          <stop offset={0} stopColor="#3F8CE8" stopOpacity={0.3} /><stop offset={1} stopColor="#3F8CE8" stopOpacity={0} />
        </linearGradient>
        <filter id="s1-sg" x={-50} y={-50} width={2020} height={1180} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation={3} /></filter>
        <filter id="s1-sc" x={-50} y={-50} width={2020} height={1180} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation={1.1} /></filter>
        <filter id="s1-pb" x={-200} y={-200} width={2400} height={1500} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation={8} /></filter>
      </defs>
      {hasR && panelK > 0 && (
        <path d={`M${rcx},${rc[1]} L${rcx + rdx * (ptop - rc[1])},${ptop} L1990,${ptop - 8} L1990,${hy(1990)} Z`} fill="#3F8CE8" opacity={0.035 * panelK} filter="url(#s1-pb)" />
      )}
      {ext && <path d={ext} stroke="url(#s1-se)" strokeWidth={2} opacity={0.5 * I} fill="none" filter="url(#s1-sc)" />}
      <g opacity={I} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {lines.map((l, i) => <path key={`g${i}`} d={l.d} stroke={`url(#${l.grad})`} strokeWidth={9} opacity={0.3} filter="url(#s1-sg)" />)}
        {lines.map((l, i) => <path key={`c${i}`} d={l.d} stroke={`url(#${l.grad})`} strokeWidth={4} filter="url(#s1-sc)" />)}
      </g>
      {dia.map((d, i) => d.o > 0 && (
        <rect key={i} x={d.x - 5} y={d.y - 5} width={10} height={10} fill="#E6F0FD" opacity={d.o} transform={`rotate(45 ${d.x} ${d.y})`} filter="url(#s1-sc)" />
      ))}
    </svg>
  );
};

const LogoShot: React.FC<{ f: number }> = ({ f }) => {
  const s = dolly(f), rz = spline(f, ROTZ), ry = spline(f, ROTY);
  return (
    <AbsoluteFill style={{ background: logoBg(f) }}>
      <Streak f={f} />
      <WkcLogo t={f - 46} x={spline(f, GCX)} y={spline(f, GCY)} s={s} id="s1l"
        transform={`perspective(1350px) rotateZ(${-rz}deg) rotateY(${ry}deg)`} />
    </AbsoluteFill>
  );
};

// =================================================================================================================
export const Seg1: React.FC<{ g: number }> = ({ g }) => {
  const f = Math.round(g);
  if (f <= 4) return <EndCard />;
  if (f === 5) return <AbsoluteFill style={{ background: "#000000" }} />;
  if (f <= 45) return <MeetShot f={f} />;
  if (f <= 97) return <LogoShot f={f} />;
  return <MotionShot f={f} />;
};
