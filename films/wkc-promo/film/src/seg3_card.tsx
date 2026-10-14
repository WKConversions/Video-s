// Segment 3, the morph (333–341) and shot C (342–386): the input field becomes the 3D glass WKC project-brief card,
// mapped onto the reference's measured corners with a matrix3d homography (spec/seg3.md §4–§5, §10.3), plus the
// out-of-focus ghosts behind it (§5.5) and small shared helpers.
import React from "react";
import { C, F, clamp01, lerp } from "./lib";
import { WkcMark } from "./kit";
import { CORNERS } from "./seg3_data";

// ---------------------------------------------------------------------------------------------------------------- helpers
/** piecewise-linear keyframes, clamped */
export const kf = (g: number, k: [number, number][]) => {
  if (g <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (g <= k[i][0]) return lerp(k[i - 1][1], k[i][1], (g - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
  return k[k.length - 1][1];
};
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** mix two #rrggbb colours */
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp01(t)))).join(",")})`;
};
export const stadium = (cx: number, cy: number, w: number, h: number) => {
  const r = h / 2, x0 = cx - w / 2 + r, x1 = cx + w / 2 - r;
  return `M${x0} ${cy - r} H${x1} A${r} ${r} 0 0 1 ${x1} ${cy + r} H${x0} A${r} ${r} 0 0 1 ${x0} ${cy - r} Z`;
};

let ctx: CanvasRenderingContext2D | null = null;
const inkCache = new Map<string, { l: number; w: number }>();
/** ink-left offset and advance of a string (browser metrics) */
const ink = (text: string, weight: number, size: number, family: string, track: number) => {
  const key = `${text}|${weight}|${size}|${family}|${track}`;
  const hit = inkCache.get(key);
  if (hit) return hit;
  if (!ctx) ctx = document.createElement("canvas").getContext("2d");
  const c = ctx as CanvasRenderingContext2D;
  c.font = `${weight} ${size}px "${family}"`;
  (c as unknown as { letterSpacing: string }).letterSpacing = `${track}px`;
  const m = c.measureText(text);
  const v = { l: m.actualBoundingBoxLeft, w: m.width };
  inkCache.set(key, v);
  return v;
};

/** a typed line: the first n characters, left ink edge at x, baseline at base; opacity(i) per glyph */
export const TypedText: React.FC<{ text: string; n: number; x: number; base: number; size: number; weight: number; color: string;
  opacity: (i: number) => number; style?: React.CSSProperties; track?: number }> = ({ text, n, x, base, size, weight, color, opacity, style, track = -0.01 }) => {
  if (n <= 0) return null;
  const origin = x + ink(text[0], weight, size, F.ui, 0).l;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>
      <text x={origin} y={base} fontFamily={F.ui} fontWeight={weight} fontSize={size} fill={color} style={{ letterSpacing: `${track}em`, fontKerning: "normal" }}>
        {text.slice(0, n).split("").map((ch, i) => <tspan key={i} fillOpacity={opacity(i)}>{ch}</tspan>)}
      </text>
    </svg>
  );
};

// ------------------------------------------------------------------------------------------------------------ homography
type Quad = [number, number][]; // TL TR BR BL
const CW = 873, CH = 315;
/** the 3x3 projective map from the flat 873 x 315 card onto a screen quad, as a CSS matrix3d */
const matrix3d = (q: Quad) => {
  const src = [[0, 0], [CW, 0], [CW, CH], [0, CH]];
  const A: number[][] = [];
  for (let k = 0; k < 4; k++) {
    const [u, v] = src[k], [x, y] = q[k];
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x, x]);
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y, y]);
  }
  for (let i = 0; i < 8; i++) {
    let p = i;
    for (let r = i + 1; r < 8; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    [A[i], A[p]] = [A[p], A[i]];
    for (let r = 0; r < 8; r++) if (r !== i) { const f = A[r][i] / A[i][i]; for (let c = i; c < 9; c++) A[r][c] -= f * A[i][c]; }
  }
  const h = A.map((row, i) => row[8] / row[i]);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
};
const tableQuad = (g: number): Quad => {
  const r = CORNERS[Math.max(0, Math.min(CORNERS.length - 1, Math.round(g) - 342))];
  return [[r[1], r[2]], [r[3], r[4]], [r[5], r[6]], [r[7], r[8]]];
};
/** the morph boxes (§4): L, R, T, B, corner radius on screen */
const BOX: Record<number, [number, number, number, number, number]> = {
  337: [435, 1524, 478, 623, 50], 338: [477, 1507, 449, 649, 35], 339: [487, 1505, 435, 657, 30], 340: [510, 1502, 424, 668, 28], 341: [522, 1500, 415, 673, 28],
};
/** a flat quad whose width fills the box and whose centre sits on the box centre */
const boxQuad = (b: [number, number, number, number, number]): Quad => {
  const s = (b[1] - b[0]) / CW, cy = (b[2] + b[3]) / 2, t = cy - (CH / 2) * s;
  return [[b[0], t], [b[1], t], [b[1], t + CH * s], [b[0], t + CH * s]];
};
const lerpQuad = (a: Quad, b: Quad, t: number): Quad => a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]) as Quad;
/** content quad, the visible outline in flat coordinates (top, bottom, radius) per frame */
const pose = (g: number): { q: Quad; top: number; bot: number; rad: number } => {
  if (g >= 342) {
    const k = Math.round(g) - 342;
    const TOP = [38, 28, 24, 18, 15, 11, 9, 9, 6, 4, 2], BOT = [288, 294, 298, 301, 303, 305, 308, 309, 312, 315, 315];
    return { q: tableQuad(g), top: TOP[Math.min(k, 10)], bot: BOT[Math.min(k, 10)], rad: 28 };
  }
  const b = BOX[Math.max(337, Math.round(g))];
  if (g <= 339) {
    const q = boxQuad(b), s = (b[1] - b[0]) / CW;
    return { q, top: (b[2] - q[0][1]) / s, bot: (b[3] - q[0][1]) / s, rad: b[4] / s };
  }
  // 340–341: the tilt starts; blend the flat 339 quad toward the measured 342 pose, outline fitted to the box
  const t = g <= 340 ? 1 / 3 : 2 / 3;
  const q = lerpQuad(boxQuad(BOX[339]), tableQuad(342), t);
  const sy = (q[3][1] - q[0][1]) / CH;
  const yTop = (q[0][1] + q[1][1]) / 2;
  return { q, top: (b[2] - yTop) / sy, bot: (b[3] - yTop) / sy, rad: 26 };
};

// ---------------------------------------------------------------------------------------------------------- card content
const L1 = "Describe your product, feature or launch,";
const L2 = "or attach a script or deck";
const CHARS = [7, 15, 23, 29, 33, 41, 45, 50, 54, 58, 62, 64, 66, 67]; // typed characters at 341..354
const charsAt = (g: number) => (g < 341 ? 0 : CHARS[Math.min(CHARS.length - 1, Math.round(g) - 341)]);
const appearAt = (i: number) => 341 + CHARS.findIndex((c) => c > i);

/** the 4-point WKC sparkle, unit radius */
const SPARK = "M0,-1 Q0.18,-0.18 1,0 Q0.18,0.18 0,1 Q-0.18,0.18 -1,0 Q-0.18,-0.18 0,-1 Z";

const Paperclip: React.FC = () => (
  <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <g transform="translate(57.5 97) rotate(-10) scale(2.05) translate(-12 -12)" fill="none" stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </g>
  </svg>
);

/** the two round icon buttons: format (16:9 / 9:16 frames) and film clapper */
const IconButtons: React.FC<{ g: number }> = ({ g }) => {
  const bg = kf(g, [[365, 1], [380, 0]]), gl = kf(g, [[365, 1], [382, 0.5]]);
  const btn = (cx: number, glyph: React.ReactNode) => (
    <g transform={`translate(${cx} 231)`}>
      <circle r={19} fill="#FFFFFF" fillOpacity={0.6 * bg} stroke="#FFFFFF" strokeOpacity={0.95 * bg} strokeWidth={1.5} />
      <g opacity={gl} fill="none" stroke={C.ink} strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round">{glyph}</g>
    </g>
  );
  return (
    <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {btn(467, <><rect x={-9} y={-5.5} width={13} height={8} rx={1.6} /><rect x={1.5} y={-7.5} width={7} height={13.5} rx={1.6} fill="#FFFFFF" fillOpacity={0.85} /></>)}
      {btn(517, <><rect x={-8} y={-2.5} width={16} height={10} rx={1.5} /><path d="M-8 -2.5 L-7.2 -7.6 L8.6 -5.2 L8 -2.5" /><path d="M-3.4 -6.9 L-1.6 -3 M1.6 -6.2 L3.4 -2.6" /></>)}
    </svg>
  );
};

const LABEL = "Build storyboard";
const ActionPill: React.FC<{ g: number }> = ({ g }) => {
  const pop = kf(g, [[338, 0.45], [339, 0.62], [340, 0.75], [341, 0.82], [342, 0.87], [343, 0.9], [344, 0.92], [345, 0.945], [346, 0.965], [347, 0.98], [348, 0.995], [349, 1]]);
  const press = kf(g, [[358, 1], [359, 0.97], [360, 0.9], [361, 0.9], [362, 0.925], [363, 0.953], [364, 0.967], [365, 0.981], [366, 0.99], [367, 1]]);
  const hov = kf(g, [[360, 0], [361, 0.2], [364, 0.6], [367, 0.87], [369, 1]]);
  const cx = kf(g, [[338, 604], [339, 622], [340, 639], [341, 652], [342, 664], [360, 664], [372, 652], [384, 652], [385, 640], [386, 624]]), s = pop * press * kf(g, [[366, 1], [370, 1.035]]);
  const fs = 19, lw = ink(LABEL, 600, fs, F.ui, 0).w, gap = 7, sp = 6.5;
  const x0 = -(lw + gap + 2 * sp) / 2;
  return (
    <div style={{ position: "absolute", left: cx - 107.5, top: 230 - 29, width: 215, height: 58, borderRadius: 29, background: mix(C.blueText, C.blue, hov),
      transform: `scale(${s})`, boxShadow: "0 2px 6px rgba(18,60,130,0.18)" }}>
      <svg width={215} height={58} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <text x={107.5 + x0} y={29 + 6.8} fontFamily={F.ui} fontWeight={600} fontSize={fs} fill="#FFFFFF">{LABEL}</text>
        <path d={SPARK} transform={`translate(${107.5 + x0 + lw + gap + sp} ${29 - 0.5}) scale(${sp})`} fill="#FFFFFF" />
        <path d={SPARK} transform={`translate(${107.5 + x0 + lw + gap + 2 * sp + 1} ${29 - 6}) scale(2.6)`} fill="#FFFFFF" />
      </svg>
    </div>
  );
};

const Content: React.FC<{ g: number; rest: number }> = ({ g, rest }) => {
  const n = charsAt(g);
  const glyph = (i: number) => kf(g - appearAt(i), [[0, 0.4], [1, 0.7], [2, 0.9], [3, 1]]);
  const n1 = Math.min(n, L1.length), n2 = Math.max(0, n - L1.length);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: rest }}><Paperclip /></div>
      <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <TypedLine text={L1} n={n1} x={112} base={86.5} opacity={glyph} />
        <TypedLine text={L2} n={n2} x={112} base={131} opacity={(i) => glyph(i + L1.length)} />
      </svg>
      <div style={{ position: "absolute", inset: 0, opacity: rest }}><IconButtons g={g} /></div>
      <ActionPill g={g} />
    </>
  );
};
const TypedLine: React.FC<{ text: string; n: number; x: number; base: number; opacity: (i: number) => number }> = ({ text, n, x, base, opacity }) => {
  if (n <= 0) return null;
  return (
    <text x={x + ink(text[0], 600, 33, F.ui, 0).l} y={base} fontFamily={F.ui} fontWeight={600} fontSize={33} fill={C.ink} style={{ letterSpacing: "-0.01em" }}>
      {text.slice(0, n).split("").map((ch, i) => <tspan key={i} fillOpacity={opacity(i)}>{ch}</tspan>)}
    </text>
  );
};


/** the card's rim in flat space: a deep-blue line strongest on the left and bottom, fading to the right; the top edge is dark
 *  while the outline settles and turns to a light highlight by 360; the right edge is soft */
const RIM_C = "#3A62C8";
const Rim: React.FC<{ x0: number; x1: number; top: number; bot: number; rad: number; op: number; dark: number }> = ({ x0, x1, top, bot, rad, op, dark }) => {
  const r = rad, u = `M${x0} ${top + r} V${bot - r} A${r} ${r} 0 0 0 ${x0 + r} ${bot} H${x1 - r} A${r} ${r} 0 0 0 ${x1} ${bot - r} V${top + r}`;
  const cap = `M${x0} ${top + r} A${r} ${r} 0 0 1 ${x0 + r} ${top} H${x1 - r} A${r} ${r} 0 0 1 ${x1} ${top + r}`;
  return (
    <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }}>
      <defs>
        <linearGradient id="s3-rim" gradientUnits="userSpaceOnUse" x1={0} x2={CW} y1={0} y2={0}>
          <stop offset={0} stopColor={RIM_C} stopOpacity={0.9} /><stop offset={0.5} stopColor={RIM_C} stopOpacity={0.4} /><stop offset={1} stopColor={RIM_C} stopOpacity={0.06} />
        </linearGradient>
        <linearGradient id="s3-rim-top" gradientUnits="userSpaceOnUse" x1={0} x2={CW} y1={0} y2={0}>
          <stop offset={0} stopColor={RIM_C} stopOpacity={0.9} /><stop offset={0.6} stopColor={RIM_C} stopOpacity={0.75} /><stop offset={1} stopColor={RIM_C} stopOpacity={0.35} />
        </linearGradient>
      </defs>
      <path d={u} fill="none" stroke="url(#s3-rim)" strokeWidth={3} />
      <path d={cap} fill="none" stroke="url(#s3-rim-top)" strokeWidth={2.5} opacity={dark} />
      <path d={cap} fill="none" stroke="#FFFFFF" strokeOpacity={0.75 * (1 - dark)} strokeWidth={1.5} transform="translate(0 2)" />
      <path d={`M${x1} ${top + r} V${bot - r}`} fill="none" stroke="#DCE6FA" strokeOpacity={0.5} strokeWidth={7} style={{ filter: "blur(3px)" }} />
    </svg>
  );
};

// ------------------------------------------------------------------------------------------------------------------ card
export const Card: React.FC<{ g: number }> = ({ g }) => {
  if (g < 337 || g > 386) return null;
  const p = pose(g), q = p.q, rad = p.rad;
  const e = kf(g, [[352, 0], [366, 3], [376, 5.5], [382, 9], [384, 9], [385, 6], [386, 2]]);
  const eb = kf(g, [[352, 0], [366, 3.5], [376, 6.3], [382, 10.4], [384, 10.4], [385, 10], [386, 9]]);
  const x0 = -e, x1 = CW + e, top = p.top - e, bot = p.bot + eb;
  const content = kf(g, [[337, 0], [338, 0.1], [339, 0.2], [340, 0.35], [341, 0.5], [342, 0.6], [344, 0.8], [347, 1]]);
  const rest = kf(g, [[338, 0.15], [339, 0.4], [340, 0.85], [341, 1]]); // paperclip and icons trail the pill
  const cBlur = kf(g, [[338, 3], [339, 3], [340, 2], [341, 1], [342, 0]]);
  const rim = kf(g, [[338, 0], [339, 0.2], [340, 0.42], [341, 0.65], [342, 0.9], [343, 1]]);
  const field = kf(g, [[337, 1], [341, 0]]); // the input field's look fading into the card's
  const oBlur = kf(g, [[336, 1.5], [339, 1.5], [341, 0.5], [342, 0]]);
  const smear = kf(g, [[382, 0], [383, 3], [384, 4], [385, 8], [386, 11]]);
  const blob = kf(g, [[340, 0], [341, 1]]);
  const H = bot - top;
  const DOF = "linear-gradient(90deg, #000 0px, #000 560px, transparent 690px)";
  const DOF_INV = "linear-gradient(90deg, transparent 560px, #000 690px)";
  return (
    <div style={{ position: "absolute", inset: 0, filter: smear ? `url(#s3-smear-${Math.round(smear)})` : undefined }}>
      {smear > 0 && (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={`s3-smear-${Math.round(smear)}`} x="0" y="0" width="1" height="1">
            <feConvolveMatrix order={`${Math.round(smear) + 1} 1`} kernelMatrix={Array(Math.round(smear) + 1).fill(1).map((v, i, a) => (i === 0 || i === a.length - 1 ? 2.2 : 1)).join(" ")} edgeMode="none" preserveAlpha="false" />
          </filter>
        </svg>
      )}
      <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, transformOrigin: "0 0", transform: matrix3d(q) }}>
        {/* glass body: shadow, fill and rim */}
        <div style={{ position: "absolute", left: x0, top, width: x1 - x0, height: H, borderRadius: rad, filter: oBlur ? `blur(${oBlur}px)` : undefined,
          boxShadow: `12px 18px 60px rgba(18,60,130,${0.12 * rim})`,
          background: `linear-gradient(180deg, rgba(255,255,255,${0.1 * (1 - field)}) 0%, rgba(255,255,255,0) 35%), linear-gradient(90deg, rgba(246,250,255,${lerp(0.22, 0.5, field)}) 0%, rgba(246,250,255,${lerp(0.18, 0.36, field)}) 60%, rgba(246,250,255,${lerp(0.15, 0.26, field)}) 100%)` }} />
        <div style={{ position: "absolute", left: x0, top, width: x1 - x0, height: H, borderRadius: rad, boxSizing: "border-box", filter: oBlur ? `blur(${oBlur}px)` : undefined,
          border: `1.5px solid rgba(5,15,25,${0.1 * field})` }} />
        <Rim x0={x0} x1={x1} top={top} bot={bot} rad={rad} op={rim} dark={0.85} />
        {/* the out-of-focus chip inside the card (top right) */}
        <div style={{ position: "absolute", left: 548, top: 6, width: 254, height: 50, borderRadius: 25, background: "rgba(63,140,232,0.22)", filter: "blur(14px)", opacity: blob }} />
        {/* content: sharp on the left, softer on the right (depth of field) */}
        <div style={{ position: "absolute", inset: 0, opacity: content, filter: cBlur ? `blur(${cBlur}px)` : undefined }}>
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: DOF, maskImage: DOF }}><Content g={g} rest={rest} /></div>
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: DOF_INV, maskImage: DOF_INV, filter: "blur(1.6px)" }}><Content g={g} rest={rest} /></div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------- ghosts
/** behind the card: a defocused WKC monogram chip, and the blurred edge of a storyboard frame entering from the top */
export const Ghosts: React.FC<{ g: number }> = ({ g }) => {
  if (g < 340) return null;
  const cx = kf(g, [[341, 1364], [356, 1360], [366, 1336], [376, 1315], [382, 1274], [384, 1262], [385, 1217], [386, 1181]]);
  const cy = kf(g, [[341, 154], [356, 155], [366, 163], [376, 171], [382, 187], [384, 203], [385, 219], [386, 236]]);
  const w = kf(g, [[342, 124], [366, 118], [376, 110], [382, 95], [386, 74]]);
  const chip = kf(g, [[340, 0], [342, 1]]);
  // storyboard frame edge: bottom-left corner (x, y) and its visible length
  const bx = kf(g, [[364, 735], [366, 746], [376, 771], [382, 828], [384, 868], [385, 885], [386, 909]]);
  const by = kf(g, [[364, -20], [366, 24], [376, 40], [382, 89], [384, 114], [385, 130], [386, 154]]);
  const bl = kf(g, [[366, 330], [376, 420], [386, 330]]);
  return (
    <>
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - w * 0.16, opacity: 0.32 * chip, filter: "blur(7px)" }}>
        <WkcMark w={w * 0.7} fill={C.glowDeep} />
        <div style={{ position: "absolute", left: w * 0.8, top: w * 0.1, width: w * 0.16, height: w * 0.16, borderRadius: "50%", background: C.glowDeep }} />
      </div>
      {g >= 364 && (
        <div style={{ position: "absolute", left: bx, top: by - 420, width: bl, height: 420, background: C.glowDeep, opacity: 0.16, filter: "blur(9px)",
          transformOrigin: "0 100%", transform: "rotate(-12deg) skewX(-10deg)", borderRadius: 18 }} />
      )}
    </>
  );
};
