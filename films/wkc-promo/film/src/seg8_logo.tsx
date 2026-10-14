// Segment 8's end-card lockup: logo.tsx's WkcLogo with one clock per part (mark write-on, mark slide, "WK" bloom,
// "Conversions" reveal), so the finale can follow the reference end card's own timing (the opening's reveal tables run
// all parts off one clock). The drawing code and tables are copied verbatim from src/logo.tsx (logo.tsx md5 f527dffe);
// at rest it draws exactly what WkcLogo draws, and the finale switches to the real EndCard once everything has settled.
import React from "react";
import { measureText } from "@remotion/layout-utils";
import { F, clamp01 } from "./lib";
import { WKC_PATH, WKC_VIEW } from "./mark";
import { LOGO, spline } from "./logo";

const MARK_H = (LOGO.mark.w * WKC_VIEW.h) / WKC_VIEW.w; // 124.0
/** ink left side bearings at 116 px (W and C), measured from the rendered font */
const LSB_W = 0.6, LSB_C = 6.4;
/** tracking (em) that makes "Conversions" (300) fill its ink box exactly (609 px; one word with "WK": no word gap, the lockup centred) */
const CONV_TRACK = -0.0075;

// The reveal tables (logo.tsx), keyed on the opening clock f.
/** visible fraction of the handwriting path (the reference icon's stroke draw-on) */
const WRITE: [number, number][] = [[45, 0], [46, 0.05], [47, 0.25], [48, 0.35], [49, 0.45], [50, 0.5], [51, 0.55], [52, 0.62], [53, 0.68], [54, 0.72], [55, 0.76], [56, 0.8], [57, 0.83], [58, 0.86], [59, 0.89], [60, 0.91], [61, 0.93], [62, 0.94], [63, 0.96], [64, 0.97], [65, 0.98], [66, 0.99], [67, 1]];
/** mark brightness (starts as a dark blue, like the reference's dark teal icon) */
const BRIGHT: [number, number][] = [[46, 0.22], [47, 0.3], [49, 0.46], [51, 0.62], [53, 0.76], [55, 0.89], [57, 0.95], [59, 1]];
/** "WK" bloom: sigma (screen px) and gain; and the text core blur (screen px) */
const BLOOM_S: [number, number][] = [[46, 48], [53, 48], [55, 38], [57, 30], [58, 24], [60, 18], [62, 12], [65, 9], [68, 6], [69, 5]];
const BLOOM_G: [number, number][] = [[46, 1], [51, 1], [53, 0.95], [54, 0.88], [55, 0.66], [57, 0.54], [58, 0.4], [60, 0.3], [62, 0.24], [64, 0.18], [66, 0.11], [68, 0.05], [69, 0]];
const CORE: [number, number][] = [[46, 3], [47, 2.8], [49, 2.2], [51, 1.6], [57, 1.4], [59, 0.8], [66, 0.5], [69, 0]];
/** letter settle (CCW+ degrees, px): W takes the reference N's, K takes u's rotation, offset and the l's grow */
const W_ROT: [number, number][] = [[46, -8], [47, -6], [48, -4.2], [49, -3.2], [50, -2.6], [51, -2], [52, -1.4], [55, -0.9], [59, 0]];
const K_ROT: [number, number][] = [[46, 7], [47, 5], [48, 3.2], [49, 2.4], [51, 1.9], [52, 1.4], [55, 0.9], [59, 0]];
const K_DY: [number, number][] = [[46, 10], [48, 8], [50, 5], [52, 3.3], [55, 1.8], [60, 1.4], [66, 0.5], [68, 0]];
const K_GROW: [number, number][] = [[46, 0.45], [48, 0.46], [50, 0.55], [52, 0.64], [54, 0.71], [56, 0.81], [58, 0.84], [60, 0.87], [62, 0.91], [64, 0.93], [66, 0.95], [68, 0.99], [69, 1]];
/** opacity of a letter whose 50 % point is at f50 (a soft logistic ramp over ~13 frames each side) */
const letterOp = (f: number, f50: number) => {
  const L = (x: number) => 1 / (1 + Math.exp(-x / 3));
  return clamp01((L(f - f50) - L(-13)) / (L(13) - L(-13)));
};

/** the handwriting centre-lines (mark units) the write-on mask follows: w (into the k stem), k arm, k leg, c */
const STROKES: [number, number][][] = [
  [[22, 368], [55, 325], [80, 285], [97, 248], [112, 205], [125, 155], [133, 130], [140, 122], [143, 140], [143, 200], [143, 260], [142, 320], [141, 380], [141, 433], [170, 380], [195, 335], [215, 300], [232, 262], [250, 225], [262, 200], [270, 192], [280, 215], [290, 262], [300, 300], [310, 345], [325, 385], [343, 400], [360, 395], [378, 355], [395, 310], [405, 270], [415, 220], [425, 150], [430, 90], [432, 32]],
  [[438, 264], [480, 225], [560, 151], [630, 86]],
  [[438, 266], [465, 285], [550, 345], [580, 372], [645, 435]],
  [[912, 175], [860, 160], [800, 165], [730, 190], [685, 220], [650, 250], [625, 280], [620, 310], [630, 345], [660, 375], [700, 400], [750, 412], [800, 412], [850, 405], [900, 387], [950, 365], [982, 347]],
];
const LEN = STROKES.map((s) => s.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - s[i - 1][0], p[1] - s[i - 1][1]) : 0), 0));
const TOTAL = LEN.reduce((a, b) => a + b, 0);
const BRUSH = 88; // mask stroke width (mark units): covers the 58-unit brush including its junctions

const wcache: Record<string, number> = {};
const width = (text: string, weight: number) => {
  const key = `${text}|${weight}`;
  if (!(key in wcache)) wcache[key] = measureText({ text, fontFamily: F.head, fontSize: LOGO.size, fontWeight: String(weight) }).width;
  return wcache[key];
};
/** x of each glyph's origin for a string set with tracking (em), relative to the first glyph's origin */
const glyphX = (text: string, weight: number, track: number) =>
  text.split("").map((_, i) => (i ? width(text.slice(0, i), weight) : 0) + i * track * LOGO.size);


export type PartsProps = {
  /** opening-reveal clock values (f = t + 46 in logo.tsx) for each part */
  fMark: number; fWk: number; fConv: number;
  /** mark offset to the left (px) and "Conversions" offset to the right (px) */
  markOff: number; convOff: number;
  /** extra mark brightness factor (1 = as the tables) */
  brightK?: number;
  x?: number; y?: number; s?: number; transform?: string; opacity?: number; bloom?: string; id?: string;
};

export const WkcLogoParts: React.FC<PartsProps> = ({ fMark, fWk, fConv, markOff, convOff, brightK = 1, x = 966, y = 412, s = 1, transform = "", opacity = 1, bloom = "#E6F0FD", id = "s8l" }) => {
  const L = LOGO;
  // mark
  const write = spline(fMark, WRITE), bright = spline(fMark, BRIGHT) * brightK, mOff = markOff;
  const mk = L.mark.w / WKC_VIEW.w; // mark units -> px
  const mx = L.mark.x - mOff, my = L.mark.cy - MARK_H / 2;
  let rest = write * TOTAL;
  const dash = LEN.map((len) => { const v = Math.min(len, Math.max(0, rest)); rest -= len; return v; });
  // WK
  const bs = spline(fWk, BLOOM_S) / s, bg = spline(fWk, BLOOM_G), core = spline(fWk, CORE) / s;
  const wx = glyphX("WK", L.wk.weight, L.wk.track), w0 = L.wk.left - LSB_W;
  const wW = width("W", L.wk.weight), wK = width("K", L.wk.weight);
  const capMid = L.base - 0.364 * L.size; // centre of the caps
  const wRot = spline(fWk, W_ROT), kRot = spline(fWk, K_ROT), kDy = spline(fWk, K_DY), kGrow = spline(fWk, K_GROW);
  // Conversions
  const word = "Conversions";
  const cx = glyphX(word, L.conv.weight, CONV_TRACK), c0 = L.conv.left - LSB_C + convOff;
  const ops = word.split("").map((_, i) => letterOp(fConv, 51.5 + i * 1.75));
  const font = (weight: number): React.SVGProps<SVGTextElement> => ({ fontFamily: F.head, fontWeight: weight, fontSize: L.size });
  const bloomOn = bg > 0.001;
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity, transformOrigin: "0 0",
      transform: `translate(${x}px, ${y}px) ${transform} scale(${s})` }}>
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1={24.9} y1={-43} x2={974.1} y2={505.4}>
          <stop offset="0" stopColor="#9CCBF8" /><stop offset="0.55" stopColor="#3F8CE8" /><stop offset="1" stopColor="#1F5FC4" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-100} y={-100} width={1200} height={700}>
          {STROKES.map((st, i) => dash[i] > 0.01 && (
            <polyline key={i} points={st.map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeWidth={BRUSH} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={`${dash[i]} ${TOTAL * 2}`} />
          ))}
        </mask>
        <filter id={`${id}-mf`} x="-20%" y="-30%" width="140%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation={9 / mk} result="a" />
          <feFlood floodColor="#3F8CE8" floodOpacity={0.4} />
          <feComposite in2="a" operator="in" result="glow" />
          <feComponentTransfer in="SourceGraphic" result="src">
            <feFuncR type="linear" slope={bright} /><feFuncG type="linear" slope={bright} /><feFuncB type="linear" slope={bright} />
          </feComponentTransfer>
          <feMerge><feMergeNode in="glow" /><feMergeNode in="src" /></feMerge>
        </filter>
        {bloomOn || core > 0.01 ? (
          <filter id={`${id}-wb`} x={-900} y={-700} width={1800} height={1400} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation={Math.max(0.01, bs)} result="b" />
            <feGaussianBlur in="SourceAlpha" stdDeviation={Math.max(0.01, bs * 2.4)} result="b2" />
            <feFlood floodColor={bloom} result="fl" />
            <feComposite in="fl" in2="b" operator="in" result="c" />
            <feComposite in="fl" in2="b2" operator="in" result="c2" />
            <feComponentTransfer in="c" result="d"><feFuncA type="linear" slope={bloomOn ? bg * 1.3 : 0} /></feComponentTransfer>
            <feComponentTransfer in="c2" result="d2"><feFuncA type="linear" slope={bloomOn ? bg * 2.2 : 0} /></feComponentTransfer>
            <feGaussianBlur in="SourceGraphic" stdDeviation={Math.max(0, core)} result="s" />
            <feMerge><feMergeNode in="d2" /><feMergeNode in="d" /><feMergeNode in="s" /></feMerge>
          </filter>
        ) : null}
        {bloomOn && <filter id={`${id}-fw`} x={-1100} y={-800} width={2200} height={1600} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation={bs * 3.2} /></filter>}
        {ops.map((o, i) => o < 0.9 && <filter key={i} id={`${id}-c${i}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={(4.5 * clamp01((0.9 - o) / 0.8)) / s} /></filter>)}
      </defs>
      {/* the wkc mark, written on by its brush path */}
      <g transform={`translate(${mx} ${my}) scale(${mk})`} filter={`url(#${id}-mf)`}>
        <path d={WKC_PATH} fill={`url(#${id}-g)`} mask={write < 1 ? `url(#${id}-m)` : undefined} />
      </g>
      {/* the reveal flash: a very soft light over the reference's bold-word footprint, behind the type */}
      {bloomOn && <rect x={-340} y={-70} width={500} height={150} rx={75} fill={bloom} opacity={0.32 * bg} filter={`url(#${id}-fw)`} />}
      {/* WK (heavy): blooms and settles */}
      <g filter={bloomOn || core > 0.01 ? `url(#${id}-wb)` : undefined}>
        <text {...font(L.wk.weight)} fill={L.wk.color} x={w0 + wx[0]} y={L.base}
          transform={`rotate(${-wRot} ${w0 + wx[0] + wW / 2} ${capMid})`}>W</text>
        <text {...font(L.wk.weight)} fill={L.wk.color} x={w0 + wx[1]} y={L.base}
          transform={`translate(0 ${kDy}) translate(0 ${L.base}) scale(1 ${kGrow}) translate(0 ${-L.base}) rotate(${-kRot} ${w0 + wx[1] + wK / 2} ${capMid})`}>K</text>
      </g>
      {/* Conversions (light): letter-by-letter fade + blur wipe, sliding left */}
      {word.split("").map((ch, i) => ops[i] > 0.002 && (
        <text key={i} {...font(L.conv.weight)} fill={L.conv.color} x={c0 + cx[i]} y={L.base} opacity={ops[i]}
          filter={ops[i] < 0.9 ? `url(#${id}-c${i})` : undefined}>{ch}</text>
      ))}
    </svg>
  );
};
