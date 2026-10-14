// The WKConversions lockup and the end card, shared by segment 1 (opening thumbnail + logo reveal) and segment 8 (finale).
//
//   <WkcLogo t={...} x y s transform />   the lockup: the wkc brush monogram in the reference icon's place and the
//                                         "WKConversions" wordmark (WK heavy, Conversions light) in the "NeuralSeek" box.
//   <EndCard />                           the settled end card (lockup + glowing "Let's talk" pill + wkconversions.com),
//                                         with props for every part's entrance so the finale can animate it.
//
// Geometry is in lockup-local px at s = 1 (= the end-card size, measured from the reference at 1080p), origin = the
// lockup centre. The reference wordmark's cap top is at y −48 and its baseline at y +64.5.
import React from "react";
import { measureText } from "@remotion/layout-utils";
import { F, clamp01, lerp } from "./lib";
import { WKC_PATH, WKC_VIEW } from "./mark";

/** Monotone cubic (Fritsch–Carlson) interpolation through [x, y] keys; clamps outside the keys. */
export const spline = (x: number, k: [number, number][]) => {
  const n = k.length;
  if (x <= k[0][0]) return k[0][1];
  if (x >= k[n - 1][0]) return k[n - 1][1];
  let i = 0;
  while (x > k[i + 1][0]) i++;
  const h = (j: number) => k[j + 1][0] - k[j][0], d = (j: number) => (k[j + 1][1] - k[j][1]) / h(j);
  const m = (j: number) => {
    if (j === 0) return d(0);
    if (j === n - 1) return d(n - 2);
    const a = d(j - 1), b = d(j);
    if (a * b <= 0) return 0;
    const w1 = 2 * h(j) + h(j - 1), w2 = h(j) + 2 * h(j - 1);
    return (w1 + w2) / (w1 / a + w2 / b);
  };
  const t = (x - k[i][0]) / h(i), t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * k[i][1] + (t3 - 2 * t2 + t) * h(i) * m(i) + (-2 * t3 + 3 * t2) * k[i + 1][1] + (t3 - t2) * h(i) * m(i + 1);
};

// ---------------------------------------------------------------------------------------------------------------
// Lockup layout (local px, s = 1)
export const LOGO = {
  /** wkc mark box: x −555…−287 (268 × 124), vertically centred on the reference cap centre (y +8) */
  mark: { x: -555, w: 268, cy: 8 },
  /** wordmark baseline and type: "WK" Inter Tight 800, "Conversions" Inter Tight 300, both 116 px */
  base: 64.5,
  size: 116,
  wk: { left: -252.75, weight: 800, track: -0.05, color: "#FFFFFF" },
  conv: { left: -53.75, right: 555.25, weight: 300, color: "#F7F7F8" },
};
const MARK_H = (LOGO.mark.w * WKC_VIEW.h) / WKC_VIEW.w; // 124.0
/** ink left side bearings at 116 px (W and C), measured from the rendered font */
const LSB_W = 0.6, LSB_C = 6.4;
/** tracking (em) that makes "Conversions" (300) fill its ink box exactly (609 px; one word with "WK": no word gap, the lockup centred) */
const CONV_TRACK = -0.0075;

/** clock value at which the reveal is complete (everything at rest) */
export const LOGO_SETTLED = 60;

// The reveal tables, measured on the reference's opening logo shot; keyed on f = t + 46 (t = 0 is the first frame).
const F0 = 46;
/** visible fraction of the handwriting path (the reference icon's stroke draw-on) */
const WRITE: [number, number][] = [[45, 0], [46, 0.05], [47, 0.25], [48, 0.35], [49, 0.45], [50, 0.5], [51, 0.55], [52, 0.62], [53, 0.68], [54, 0.72], [55, 0.76], [56, 0.8], [57, 0.83], [58, 0.86], [59, 0.89], [60, 0.91], [61, 0.93], [62, 0.94], [63, 0.96], [64, 0.97], [65, 0.98], [66, 0.99], [67, 1]];
/** mark brightness (starts as a dark blue, like the reference's dark teal icon) */
const BRIGHT: [number, number][] = [[46, 0.22], [47, 0.3], [49, 0.46], [51, 0.62], [53, 0.76], [55, 0.89], [57, 0.95], [59, 1]];
/** extra offset of the mark to the LEFT (px, s = 1), easing in toward the wordmark */
const MARK_OFF: [number, number][] = [[46, 52], [49, 52], [54, 46.5], [60, 39.5], [65, 34], [70, 27], [72, 21.5], [74, 15.5], [76, 12], [78, 10], [80, 7.6], [84, 4.6], [90, 0]];
/** "WK" bloom: sigma (screen px) and gain; and the text core blur (screen px) */
const BLOOM_S: [number, number][] = [[46, 48], [53, 48], [55, 38], [57, 30], [58, 24], [60, 18], [62, 12], [65, 9], [68, 6], [69, 5]];
const BLOOM_G: [number, number][] = [[46, 1], [51, 1], [53, 0.95], [54, 0.88], [55, 0.66], [57, 0.54], [58, 0.4], [60, 0.3], [62, 0.24], [64, 0.18], [66, 0.11], [68, 0.05], [69, 0]];
const CORE: [number, number][] = [[46, 3], [47, 2.8], [49, 2.2], [51, 1.6], [57, 1.4], [59, 0.8], [66, 0.5], [69, 0]];
/** letter settle (CCW+ degrees, px): W takes the reference N's, K takes u's rotation, offset and the l's grow */
const W_ROT: [number, number][] = [[46, -8], [47, -6], [48, -4.2], [49, -3.2], [50, -2.6], [51, -2], [52, -1.4], [55, -0.9], [59, 0]];
const K_ROT: [number, number][] = [[46, 7], [47, 5], [48, 3.2], [49, 2.4], [51, 1.9], [52, 1.4], [55, 0.9], [59, 0]];
const K_DY: [number, number][] = [[46, 10], [48, 8], [50, 5], [52, 3.3], [55, 1.8], [60, 1.4], [66, 0.5], [68, 0]];
const K_GROW: [number, number][] = [[46, 0.45], [48, 0.46], [50, 0.55], [52, 0.64], [54, 0.71], [56, 0.81], [58, 0.84], [60, 0.87], [62, 0.91], [64, 0.93], [66, 0.95], [68, 0.99], [69, 1]];
/** "Conversions" slides left to close the gap (px, s = 1) */
const CONV_OFF: [number, number][] = [[46, 35], [53, 35], [55, 33], [58, 31], [60, 30], [62, 29], [65, 27], [68, 24], [70, 20], [72, 13.6], [74, 7], [76, 3.3], [78, 0.9], [79, 0]];
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

export type WkcLogoProps = {
  /** reveal clock in frames: 0 = first frame of the reveal (the opening's film f46); >= LOGO_SETTLED = at rest.
   *  Default: at rest. Negative: nothing drawn yet. */
  t?: number;
  /** screen position of the lockup centre (default: the end card's, 966 × 412) */
  x?: number;
  y?: number;
  /** lockup scale (1 = end-card size) */
  s?: number;
  /** extra CSS transform between the translate and the scale, e.g. "perspective(1350px) rotateY(4deg)" */
  transform?: string;
  opacity?: number;
  /** colour of the reveal bloom on "WK" (default WKC soft #E6F0FD) */
  bloom?: string;
  /** unique id prefix for the SVG defs when two lockups are on screen at once */
  id?: string;
};

/**
 * The WKConversions lockup. Positioned absolutely (top-left of its parent = screen origin); everything inside is drawn
 * in lockup-local px around (0, 0). During the reveal (t < LOGO_SETTLED) the mark writes itself on, "WK" blooms and
 * settles, and "Conversions" fades in letter by letter while sliding left, on the reference's frames.
 */
export const WkcLogo: React.FC<WkcLogoProps> = ({ t = 1e6, x = 966, y = 412, s = 1, transform = "", opacity = 1, bloom = "#E6F0FD", id = "wkl" }) => {
  if (t < 0) return null;
  const f = t + F0;
  const L = LOGO;
  // mark
  const write = spline(f, WRITE), bright = spline(f, BRIGHT), mOff = spline(f, MARK_OFF);
  const mk = L.mark.w / WKC_VIEW.w; // mark units -> px
  const mx = L.mark.x - mOff, my = L.mark.cy - MARK_H / 2;
  let rest = write * TOTAL;
  const dash = LEN.map((len) => { const v = Math.min(len, Math.max(0, rest)); rest -= len; return v; });
  // WK
  const bs = spline(f, BLOOM_S) / s, bg = spline(f, BLOOM_G), core = spline(f, CORE) / s;
  const wx = glyphX("WK", L.wk.weight, L.wk.track), w0 = L.wk.left - LSB_W;
  const wW = width("W", L.wk.weight), wK = width("K", L.wk.weight);
  const capMid = L.base - 0.364 * L.size; // centre of the caps
  const wRot = spline(f, W_ROT), kRot = spline(f, K_ROT), kDy = spline(f, K_DY), kGrow = spline(f, K_GROW);
  // Conversions
  const word = "Conversions";
  const cx = glyphX(word, L.conv.weight, CONV_TRACK), c0 = L.conv.left - LSB_C + spline(f, CONV_OFF);
  const ops = word.split("").map((_, i) => letterOp(f, 51.5 + i * 1.75));
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

// ---------------------------------------------------------------------------------------------------------------
// End card (reference f1211–1215 = film f0–4): background, lockup at (966, 412), the glowing pill, the url.
const PILL = { x0: 725, x1: 1245, top: 549.5, bot: 696.5 }; // edge-light rows of the reference pill
const PILL_LABEL = { text: "Let's talk", cx: 980.5, base: 642, size: 62, weight: 700, track: -0.01 };
const URL = { text: "wkconversions.com", cx: 981.5, base: 760, size: 31, weight: 600 };

export type EndCardProps = {
  /** lockup reveal clock (see WkcLogo.t); default at rest */
  logoT?: number;
  /** extra props for the lockup (position/scale/opacity overrides) */
  logo?: Partial<WkcLogoProps>;
  /** pill visibility 0..1 (opacity of the pill, its label and its edge lights); default 1 */
  pill?: number;
  /** gaussian blur on the pill in px (entrance softness); default 0 */
  pillBlur?: number;
  /** 0..1 strength of the pill's two edge light streaks (they grow out from their hot centres); default 1 */
  glow?: number;
  /** 0..1 fraction of "wkconversions.com" typed, left to right, at the final glyph positions; default 1 */
  url?: number;
  /** 0..1 brightness of the whole card (1 = as settled, 0 = black), for the fade-out; default 1 */
  dim?: number;
  /** draw the card's own background; default true */
  bg?: boolean;
};

/** One of the pill's edge lights: a white-hot core on a long blue streak along a horizontal edge, with a soft halo. */
const EdgeLight: React.FC<{ y: number; x0: number; x1: number; hot: number; k: number; id: string }> = ({ y, x0, x1, hot, k, id }) => {
  if (k <= 0) return null;
  const a = lerp(hot, x0, k), b = lerp(hot, x1, k), p = (v: number) => clamp01((v - a) / Math.max(1, b - a));
  const stops = [
    [0, "#3F8CE8", 0], [p(lerp(a, hot, 0.3)), "#3F8CE8", 0.75], [p(lerp(a, hot, 0.72)), "#6FA9F0", 1], [p(hot - 22), "#E6F0FD", 1],
    [p(hot), "#FFFFFF", 1], [p(hot + 22), "#E6F0FD", 1], [p(lerp(hot, b, 0.3)), "#8DC0FF", 1], [p(lerp(hot, b, 0.7)), "#3F8CE8", 0.8], [1, "#3F8CE8", 0],
  ] as [number, string, number][];
  const box = { x: a - 60, y: y - 60, width: b - a + 120, height: 120 };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-l`} gradientUnits="userSpaceOnUse" x1={a} y1={0} x2={b} y2={0}>
          {stops.map(([o, c, op], i) => <stop key={i} offset={o} stopColor={c} stopOpacity={op} />)}
        </linearGradient>
        <filter id={`${id}-b`} {...box} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id={`${id}-c`} {...box} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="1.5" /></filter>
      </defs>
      <line x1={a} x2={b} y1={y} y2={y} stroke={`url(#${id}-l)`} strokeWidth={16} filter={`url(#${id}-b)`} opacity={0.55} />
      <line x1={a} x2={b} y1={y} y2={y} stroke={`url(#${id}-l)`} strokeWidth={4.5} filter={`url(#${id}-c)`} />
      <ellipse cx={hot} cy={y} rx={55 * k} ry={3.2} fill="#FFFFFF" opacity={0.9} filter={`url(#${id}-c)`} />
    </g>
  );
};

/** The WKC end card, settled by default (film f0–4 use it as the thumbnail; segment 8 animates it with the props). */
export const EndCard: React.FC<EndCardProps> = ({ logoT, logo, pill = 1, pillBlur = 0, glow = 1, url = 1, dim = 1, bg = true }) => {
  const r = (PILL.bot - PILL.top) / 2, n = Math.round(clamp01(url) * URL.text.length);
  const urlX = URL.cx - measureText({ text: URL.text, fontFamily: F.ui, fontSize: URL.size, fontWeight: String(URL.weight) }).width / 2;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", filter: dim < 1 ? `brightness(${dim})` : undefined }}>
      {bg && (
        <div style={{ position: "absolute", inset: 0, background: [
          "radial-gradient(ellipse 560px 300px at 975px 615px, rgba(21,33,47,0.9) 0%, rgba(21,33,47,0) 100%)",
          "radial-gradient(ellipse 900px 480px at 1000px 1080px, #131C28 0%, rgba(19,28,40,0.6) 50%, rgba(19,28,40,0) 100%)",
          "linear-gradient(90deg, #0E141B 0%, #0E141B 25%, #0C131B 55%, #0A0F16 100%)",
        ].join(", ") }} />
      )}
      <WkcLogo t={logoT} {...logo} id="ec" />
      {pill > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: pill, filter: pillBlur > 0 ? `blur(${pillBlur}px)` : undefined }}>
          <defs>
            <linearGradient id="ec-rim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3F8CE8" stopOpacity={0.45} /><stop offset="0.1" stopColor="#3F8CE8" stopOpacity={0.12} /><stop offset="0.22" stopColor="#3F8CE8" stopOpacity={0} />
              <stop offset="0.78" stopColor="#3F8CE8" stopOpacity={0} /><stop offset="0.9" stopColor="#3F8CE8" stopOpacity={0.12} /><stop offset="1" stopColor="#3F8CE8" stopOpacity={0.4} />
            </linearGradient>
            <filter id="ec-rb" x={600} y={450} width={800} height={350} filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="2.2" /></filter>
          </defs>
          <rect x={PILL.x0} y={PILL.top} width={PILL.x1 - PILL.x0} height={2 * r} rx={r} fill="none" stroke="url(#ec-rim)" strokeWidth={2.5} filter="url(#ec-rb)" />
          <EdgeLight y={PILL.top} x0={830} x1={1195} hot={968} k={glow} id="ec-t" />
          <EdgeLight y={PILL.bot} x0={728} x1={1165} hot={940} k={glow} id="ec-u" />
          <text x={PILL_LABEL.cx} y={PILL_LABEL.base} textAnchor="middle" fontFamily={F.head} fontWeight={PILL_LABEL.weight} fontSize={PILL_LABEL.size}
            letterSpacing={`${PILL_LABEL.track}em`} fill="#F7F7F8">{PILL_LABEL.text}</text>
        </svg>
      )}
      {n > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <text x={urlX} y={URL.base} fontFamily={F.ui} fontWeight={URL.weight} fontSize={URL.size} fill="#F7F7F8">
            {URL.text.slice(0, n)}
          </text>
        </svg>
      )}
    </div>
  );
};
