// Segment 1, shot E (film f98–146): "Motion | that makes it click" between two glowing 3D rings.
// Reference: "Build | AI agents in minutes" (spec/seg1.md §3E, §4E, Appendix B). The rings swing to face the camera,
// "Motion" is revealed by a caret sweep while it straightens from a tilt, slides left with motion blur, the words step
// through colour states on the beat, then the camera pans left (rings + text) and "Motion" smears into the hard cut.
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, clamp01, lerp } from "./lib";
import { spline } from "./logo";
import { colorAt, glyphs, mix, rgba } from "./seg1_util";

/** rings per frame (Appendix B): f, A cx, cy, rx, ry, angle, B cx, cy, rx, ry, angle (SVG/OpenCV convention) */
const RINGS: number[][] = [
  [98, 768, 614, 241, 408, 159, 1204, 444, 367, 477, 159],
  [99, 780, 619, 313, 460, 156, 1196, 426, 431, 526, 153],
  [100, 786, 620, 349, 491, 155, 1199, 429, 457, 534, 156],
  [101, 795, 619, 383, 515, 154, 1194, 429, 480, 544, 156],
  [102, 805, 618, 413, 535, 153, 1188, 431, 500, 553, 156],
  [103, 815, 615, 441, 552, 152, 1179, 433, 516, 561, 156],
  [104, 826, 612, 467, 567, 152, 1170, 436, 531, 568, 155],
  [105, 836, 608, 490, 579, 151, 1159, 440, 544, 574, 154],
  [106, 847, 604, 510, 590, 150, 1148, 443, 556, 582, 154],
  [107, 857, 600, 527, 599, 150, 1138, 447, 567, 588, 153],
  [108, 868, 595, 543, 605, 149, 1126, 451, 577, 594, 154],
  [109, 879, 590, 555, 609, 148, 1114, 454, 588, 604, 151],
  [110, 890, 584, 564, 611, 148, 1101, 458, 598, 614, 151],
  [111, 904, 576, 569, 608, 147, 1090, 466, 611, 622, 152],
  [112, 920, 566, 566, 599, 146, 1068, 463, 627, 650, 144],
  [113, 937, 555, 558, 583, 144, 1056, 472, 648, 667, 144],
  [114, 947, 550, 555, 572, 151, 1043, 481, 668, 685, 144],
  [115, 956, 543, 549, 566, 144, 1031, 490, 688, 703, 139],
  [116, 960, 540, 548, 563, 143, 1024, 494, 701, 715, 139],
  [117, 962, 538, 549, 560, 142, 1016, 498, 714, 727, 139],
  [118, 964, 537, 548, 558, 142, 1009, 502, 727, 738, 151],
  [119, 965, 536, 548, 557, 140, 1004, 505, 735, 745, 151],
  [120, 966, 535, 548, 555, 141, 998, 507, 743, 752, 142],
  [121, 966, 534, 548, 554, 141, 995, 509, 748, 757, 142],
  [122, 966, 534, 548, 553, 140, 991, 510, 753, 762, 133],
  [123, 966, 534, 548, 552, 139, 987, 512, 758, 765, 133],
  [124, 966, 534, 548, 551, 134, 984, 515, 763, 768, 133],
  [125, 965, 534, 548, 550, 134, 981, 517, 768, 772, 133],
  [126, 965, 534, 548, 550, 128, 977, 519, 773, 775, 159],
  [127, 964, 534, 547, 549, 126, 975, 520, 775, 777, 159],
  [128, 964, 534, 547, 549, 125, 973, 521, 777, 780, 159],
  [129, 964, 534, 547, 549, 122, 971, 522, 779, 783, 159],
  [130, 963, 534, 548, 549, 122, 969, 523, 782, 785, 109],
  [131, 963, 535, 548, 549, 122, 967, 524, 783, 788, 109],
  [132, 962, 535, 549, 549, 114, 966, 525, 785, 791, 109],
  [133, 961, 535, 549, 549, 102, 964, 526, 787, 794, 109],
  [134, 961, 535, 550, 550, 90, 963, 527, 789, 797, 99],
  [135, 960, 535, 551, 551, 69, 960, 528, 793, 800, 99],
  [136, 958, 536, 552, 552, 70, 957, 528, 797, 803, 99],
  [137, 956, 536, 553, 554, 75, 954, 529, 801, 807, 99],
  [138, 953, 536, 555, 555, 75, 951, 530, 804, 810, 90],
  [139, 949, 536, 556, 557, 54, 946, 530, 807, 814, 90],
  [140, 943, 536, 558, 559, 77, 941, 530, 810, 818, 98],
  [141, 936, 536, 561, 561, 62, 931, 530, 817, 823, 98],
  [142, 927, 536, 563, 563, 85, 922, 530, 824, 829, 98],
  [143, 916, 536, 566, 566, 156, 912, 530, 831, 834, 50],
  [144, 903, 536, 568, 568, 107, 892, 531, 837, 840, 50],
  [145, 884, 536, 571, 571, 87, 871, 531, 843, 845, 50],
  [146, 856, 536, 574, 575, 104, 850, 531, 849, 851, 77]

];
/** ring geometry at a frame: the measured fits with a light 3-tap smoothing (the fits carry ±2–6 px noise) */
const ringAt = (f: number, k: 0 | 1) => {
  const i = Math.min(RINGS.length - 1, Math.max(0, Math.round(f) - 98)), o = 1 + 5 * k;
  const row = (j: number) => RINGS[Math.min(RINGS.length - 1, Math.max(0, j))];
  const w = i <= 1 || i >= RINGS.length - 1 ? [0, 1, 0] : [0.25, 0.5, 0.25];
  const v = [0, 1, 2, 3].map((q) => w[0] * row(i - 1)[o + q] + w[1] * row(i)[o + q] + w[2] * row(i + 1)[o + q]);
  return { cx: v[0], cy: v[1], rx: v[2], ry: v[3], ang: row(i)[o + 4] };
};
/** lit arcs, measured along the fitted ellipses (screen angle, 0° = 3 o'clock, clockwise +):
 *  [frame, start, peak, end, level] — level 170 = a white-hot peak. Parts beyond the frame edge are simply clipped. */
const ARCS: { ring: 0 | 1; k: number[][] }[] = [
  { ring: 0, k: [[98, 197, 209, 220, 102], [100, 184, 197, 211, 99], [102, 171, 190, 210, 126], [104, 162, 184, 209, 166], [106, 156, 179, 207, 180], [108, 150, 174, 203, 182], [110, 145, 170, 199, 180], [112, 142, 166, 195, 179], [116, 138, 159, 187, 172], [120, 128, 150, 179, 171], [124, 119, 143, 172, 171], [128, 112, 135, 165, 170], [132, 104, 127, 158, 171], [136, 99, 120, 149, 170], [140, 92, 112, 141, 170], [142, 88, 108, 137, 168], [144, 84, 104, 132, 165], [146, 78, 98, 126, 160]] },
  { ring: 0, k: [[98, 312, 358, 389, 178], [100, 308, 350, 381, 140], [102, 301, 340, 374, 162], [104, 297, 333, 367, 168], [106, 292, 328, 361, 167], [108, 289, 323, 354, 165], [110, 285, 318, 348, 165], [112, 283, 314, 343, 164], [114, 281, 311, 339, 164], [116, 278, 307, 334, 164], [118, 275, 303, 330, 166], [120, 271, 299, 325, 166], [122, 268, 295, 319, 166], [124, 265, 291, 316, 166], [126, 262, 288, 312, 168], [128, 259, 285, 309, 165], [130, 256, 281, 306, 160], [134, 249, 274, 298, 155], [138, 242, 266, 290, 150], [140, 238, 262, 287, 150], [142, 234, 258, 284, 150], [144, 230, 254, 281, 150], [146, 227, 251, 278, 150]] },
  { ring: 1, k: [[98, 110, 124, 144, 138], [100, 110, 125, 147, 149], [102, 109, 127, 149, 158], [104, 108, 128, 153, 167], [106, 109, 130, 154, 173], [108, 110, 132, 156, 173], [110, 110, 132, 157, 173], [112, 111, 133, 161, 171], [116, 113, 135, 161, 165], [120, 118, 140, 168, 165], [124, 122, 144, 172, 166], [128, 124, 146, 176, 167], [130, 127, 149, 179, 168], [134, 131, 153, 184, 169], [138, 135, 157, 187, 168], [140, 137, 159, 189, 165], [143, 140, 162, 190, 154], [146, 143, 165, 180, 127]] },
  { ring: 1, k: [[127, 312, 320, 321, 0], [131, 312, 320, 323, 55], [134, 312, 320, 329, 65], [137, 312, 320, 331, 72], [140, 312, 320, 334, 90], [142, 312, 320, 335, 105], [146, 312, 320, 334, 110]] },
];
const arcAt = (f: number, k: number[][]) => {
  if (f < k[0][0]) return null;
  let i = 1;
  while (i < k.length - 1 && f > k[i][0]) i++;
  const a = k[i - 1], b = k[i], t = clamp01((f - a[0]) / (b[0] - a[0]));
  return [1, 2, 3, 4].map((j) => lerp(a[j], b[j], t));
};
const BLUE = "#3F8CE8", HOT = "#F8FBFF";
/** brightness along an arc: a hot core (±6°) on a long linear-ish tail to the arc's ends */
const prof = (a: number, s: number, p: number, e: number) => {
  const d = a - p, W = Math.max(1, d < 0 ? p - s : e - p), u = Math.abs(d) / W;
  return u >= 1 ? 0 : 0.5 * Math.exp(-((d / 6) ** 2)) + 0.5 * Math.pow(1 - u, 0.8);
};
const pt = (r: { cx: number; cy: number; rx: number; ry: number; ang: number }, a: number) => {
  const A = (a * Math.PI) / 180, phi = ((a - r.ang) * Math.PI) / 180;
  const rr = 1 / Math.sqrt((Math.cos(phi) / r.rx) ** 2 + (Math.sin(phi) / r.ry) ** 2);
  return [r.cx + rr * Math.cos(A), r.cy + rr * Math.sin(A)];
};

const Rings: React.FC<{ f: number }> = ({ f }) => {
  const R = [ringAt(f, 0), ringAt(f, 1)];
  // each lit arc: a polyline along its ellipse, coloured by a gradient along its chord (monotone for arcs < 180°)
  const arcs: { d: string; x1: number; y1: number; x2: number; y2: number; stops: { o: number; c: string; a: number; I: number }[] }[] = [];
  for (const arc of ARCS) {
    const v = arcAt(f, arc.k);
    if (!v) continue;
    const [s, p, e, lv] = v, L = Math.min(1, lv / 170);
    if (L < 0.01 || e - s < 1) continue;
    const r = R[arc.ring], n = Math.max(2, Math.ceil(e - s));
    const pts = Array.from({ length: n + 1 }, (_, i) => pt(r, s + ((e - s) * i) / n));
    const [x1, y1] = pts[0], [x2, y2] = pts[n], dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy || 1;
    const stops = pts.filter((_, i) => i % 2 === 0 || i === n).map(([x, y], j, arr) => {
      const a = s + ((e - s) * Math.min(n, j * 2)) / n, I = L * prof(a, s, p, e);
      return { o: clamp01(((x - x1) * dx + (y - y1) * dy) / l2), c: I < 0.5 ? BLUE : mix(BLUE, HOT, (I - 0.5) / 0.5), a: Math.min(1, I / 0.5), I };
    });
    arcs.push({ d: "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L"), x1, y1, x2, y2, stops });
  }
  const outline = "#0B121B";
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <filter id="s1-rv" x={-400} y={-400} width={2720} height={1880} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation={100} /></filter>
        <filter id="s1-rw" x={-300} y={-300} width={2520} height={1680} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation={36} /></filter>
        <filter id="s1-rg" x={-100} y={-100} width={2120} height={1280} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation={3.2} /></filter>
        <filter id="s1-rc" x={-100} y={-100} width={2120} height={1280} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation={0.55} /></filter>
        {arcs.map((q, i) => (
          <React.Fragment key={i}>
            <linearGradient id={`s1-a${i}`} gradientUnits="userSpaceOnUse" x1={q.x1} y1={q.y1} x2={q.x2} y2={q.y2}>
              {q.stops.map((t, j) => <stop key={j} offset={t.o} stopColor={t.c} stopOpacity={t.a} />)}
            </linearGradient>
            <linearGradient id={`s1-b${i}`} gradientUnits="userSpaceOnUse" x1={q.x1} y1={q.y1} x2={q.x2} y2={q.y2}>
              {q.stops.map((t, j) => <stop key={j} offset={t.o} stopColor={BLUE} stopOpacity={Math.min(1, t.I * 1.4)} />)}
            </linearGradient>
          </React.Fragment>
        ))}
      </defs>
      {R.map((r, i) => (
        <ellipse key={i} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} transform={`rotate(${r.ang} ${r.cx} ${r.cy})`} fill="none" stroke={outline} strokeWidth={2} />
      ))}
      <g style={{ mixBlendMode: "screen" }} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g filter="url(#s1-rv)">{arcs.map((q, i) => <path key={i} d={q.d} stroke={`url(#s1-b${i})`} strokeWidth={200} strokeOpacity={0.24} />)}</g>
        <g filter="url(#s1-rw)">{arcs.map((q, i) => <path key={i} d={q.d} stroke={`url(#s1-b${i})`} strokeWidth={60} strokeOpacity={0.3} />)}</g>
        <g filter="url(#s1-rg)">{arcs.map((q, i) => <path key={i} d={q.d} stroke={`url(#s1-a${i})`} strokeWidth={7} strokeOpacity={0.55} />)}</g>
        <g filter="url(#s1-rc)">{arcs.map((q, i) => <path key={i} d={q.d} stroke={`url(#s1-a${i})`} strokeWidth={2.6} />)}</g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// The text group ("Build" group in Appendix B): centre (ink-box centre of the bold word), scale, rotation
const GX: [number, number][] = [[98, 896], [100, 895], [104, 896], [108, 897], [109, 890], [110, 881], [111, 866], [112, 844], [113, 809], [114, 758], [115, 704], [116, 660], [117, 626], [118, 600], [119, 579], [120, 561], [121, 548], [122, 536], [124, 516], [126, 501], [128, 490], [130, 483], [133, 476], [135, 472], [136, 470], [137, 467], [138, 464], [139, 459], [140, 454], [141, 447], [142, 438], [143, 427], [144, 412.5], [145, 392.5], [146, 362]];
const GY: [number, number][] = [[98, 559.5], [100, 559.5], [102, 557], [104, 556], [106, 554.3], [108, 553], [110, 550.5], [112, 549.2], [116, 548], [120, 546], [124, 543.2], [128, 540], [132, 537.7], [136, 536], [140, 535], [146, 534]];
const GS: [number, number][] = [[98, 0.66], [100, 0.68], [101, 0.7], [102, 0.72], [103, 0.745], [104, 0.77], [105, 0.795], [106, 0.82], [107, 0.84], [108, 0.855], [109, 0.868], [110, 0.88], [111, 0.89], [112, 0.902], [113, 0.913], [114, 0.922], [115, 0.93], [117, 0.945], [120, 0.962], [123, 0.977], [126, 0.99], [129, 1]];
const GR: [number, number][] = [[98, -12.3], [99, -12.3], [100, -12], [101, -10], [102, -8], [103, -6.7], [104, -5.9], [105, -5.3], [107, -4.5], [109, -3.6], [111, -2.9], [113, -2.2], [115, -1.7], [117, -1.3], [119, -1], [121, -0.7], [123, -0.4], [126, 0]];
/** caret sweep progress f98…f110 */
const SWEEP: [number, number][] = [[98, 0], [99, 0.02], [100, 0.32], [101, 0.49], [102, 0.63], [103, 0.73], [104, 0.8], [105, 0.85], [106, 0.9], [107, 0.94], [108, 0.96], [109, 0.99], [110, 1]];
/** horizontal smear (px, screen): the slide (group) and the exit (bold word only) */
const SLIDE_BLUR: Record<number, number> = { 111: 5.4, 112: 9.2, 113: 13.5, 114: 14.4, 115: 13.9, 116: 13.5 };
const EXIT_BLUR: Record<number, number> = { 141: 0.9, 142: 1.9, 143: 3.6, 144: 5.3, 145: 8.1, 146: 16.9 };
/** "Motion" letter fades (the reference's B/u/i/l/d timings; n one frame after o) */
const LETTER_OP: [number, number][][] = [
  [[97, 0.35], [98, 0.35], [99, 0.57], [100, 0.66], [101, 0.81], [102, 0.93], [103, 1]],
  [[97, 0.24], [98, 0.24], [99, 0.3], [100, 0.6], [101, 0.85], [102, 1]],
  [[99, 0], [100, 0.23], [101, 0.43], [102, 0.6], [103, 0.74], [104, 1]],
  [[100, 0], [101, 0.15], [102, 0.43], [103, 0.53], [104, 0.69], [105, 0.86], [106, 0.97], [107, 1]],
  [[104, 0], [105, 0.7], [106, 0.81], [107, 0.98], [108, 1]],
  [[105, 0], [106, 0.7], [107, 0.9], [108, 1]],
];
const lin = (x: number, k: [number, number][]) => {
  if (x <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (x <= k[i][0]) return lerp(k[i - 1][1], k[i][1], (x - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
  return k[k.length - 1][1];
};
const BOLD = { text: "Motion", size: 113, track: -0.05, lsb: 5, ink: 337, left: -156, base: 48.75, color: "#F7F7F8" };
const LINE = { size: 91, base: 35.25, gap: 36, afterCaret: 69 };
/** the words, their ink left side bearing and ink width at 91 px (Inter 400) */
const WORDS = [
  { text: "that", lsb: 0, ink: 162 },
  { text: "makes", lsb: 7, ink: 268 },
  { text: "it", lsb: 6, ink: 43 },
  { text: "click", lsb: 5, ink: 191 },
];
const WHITE = "#F7F7F8";
/** colour and opacity of each word per frame (WKC adaptation of the reference's beat-stepped states) */
const wordState = (i: number, f: number): [string, number] => {
  if (i === 0) {
    if (f < 116) return [WHITE, 0];
    if (f < 122) return [mix("#5B8FD0", "#7BB6F5", Math.pow((f - 116) / 5, 2)), 1];
    if (f < 127) return ["#9DB0C6", 1];
    if (f < 133) return ["#CAD3DD", 1];
    return [WHITE, 1];
  }
  if (i === 1) {
    if (f < 118) return [WHITE, 0];
    if (f < 122) return [WHITE, lerp(0.12, 0.3, (f - 118) / 3)];
    if (f < 127) return ["#7BB6F5", 1];
    if (f < 133) return ["#CAD3DD", 1];
    return [WHITE, 1];
  }
  if (i === 2) {
    if (f < 122) return [WHITE, 0];
    if (f < 127) return [WHITE, lerp(0.15, 0.35, (f - 122) / 4)];
    if (f < 131) return ["#3F8CE8", 1];
    if (f < 132) return ["#A9C7EE", 1];
    if (f < 133) return ["#CAD3DD", 1];
    return [WHITE, 1];
  }
  if (f < 122) return [WHITE, 0];
  if (f < 133) return [WHITE, lerp(0.15, 0.55, (f - 122) / 10)];
  if (f < 139) return ["#A9CDF7", 1];
  return ["#F0F4F8", 1];
};

/** background (WKC colours): base and a broad central lift, fading up from the dark logo shot */
const BG_BASE: [number, string][] = [[98, "#080B0F"], [101, "#0B0F17"], [104, "#0E151E"], [110, "#101A27"], [130, "#111C2A"], [146, "#111B28"]];
const BG_SPOT: [number, string][] = [[98, "#172C45"], [101, "#182A3D"], [104, "#172739"], [110, "#14223A"], [130, "#132136"], [146, "#122034"]];

export const MotionShot: React.FC<{ f: number }> = ({ f }) => {
  const cx = spline(f, GX), cy = spline(f, GY), s = spline(f, GS), rz = spline(f, GR);
  const { xs } = glyphs(BOLD.text, F.head, BOLD.size, 800, BOLD.track);
  const x0 = BOLD.left - BOLD.lsb;
  const caretF = BOLD.left + BOLD.ink + 37.5;
  const caretX = lerp(-10.5, caretF, spline(f, SWEEP));
  // word ink lefts, laid out from the caret
  const lefts: number[] = [];
  WORDS.forEach((w, i) => lefts.push(i ? lefts[i - 1] + WORDS[i - 1].ink + LINE.gap : caretF + LINE.afterCaret));
  const slide = SLIDE_BLUR[f] ?? 0, exit = EXIT_BLUR[f] ?? 0;
  const base = colorAt(f, BG_BASE), spot = colorAt(f, BG_SPOT);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 1150px 800px at 960px 600px, ${spot} 0%, ${rgba(spot, 0.45)} 55%, ${rgba(base, 0)} 100%), ${base}` }}>
      <Rings f={f} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="s1-caret" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6FA9F0" /><stop offset="0.45" stopColor="#3F8CE8" stopOpacity={0.85} /><stop offset="0.75" stopColor="#3F8CE8" stopOpacity={0} />
          </linearGradient>
          <filter id="s1-cg" x="-800%" y="-10%" width="1700%" height="120%"><feGaussianBlur in="SourceGraphic" stdDeviation={2} result="g" />
            <feComponentTransfer in="g" result="g2"><feFuncA type="linear" slope={0.4} /></feComponentTransfer>
            <feMerge><feMergeNode in="g2" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          {slide > 0 && <filter id="s1-hs" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${slide / 2.56 / s} 0`} /></filter>}
          {exit > 0 && <filter id="s1-he" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${exit / 2.56 / s} 0`} /></filter>}
        </defs>
        <g transform={`translate(${cx} ${cy}) rotate(${-rz}) scale(${s})`}>
          <g filter={slide > 0 ? "url(#s1-hs)" : undefined}>
            <g filter={exit > 0 ? "url(#s1-he)" : undefined}>
              {BOLD.text.split("").map((ch, i) => {
                const o = lin(f, LETTER_OP[i]);
                return o > 0.003 && <text key={i} x={x0 + xs[i]} y={BOLD.base} fontFamily={F.head} fontWeight={800} fontSize={BOLD.size} fill={BOLD.color} opacity={o}>{ch}</text>;
              })}
            </g>
            <rect x={caretX - 1} y={-87.75} width={2} height={180} fill="url(#s1-caret)" filter="url(#s1-cg)" />
          </g>
          {WORDS.map((w, i) => {
            const [c, o] = wordState(i, f);
            return o > 0.003 && <text key={w.text} x={lefts[i] - w.lsb} y={LINE.base} fontFamily={F.ui} fontWeight={400} fontSize={LINE.size} fill={c} opacity={o}>{w.text}</text>;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
