// Segment 8, shot 2 (1059-1152): "Built for" + the statement track. One group zooms out about (936, 530); the track
// whip-switches on the reference's smear frames (shutter-blurred), and "More Conversions" closes it with the gradient
// wipe, three sparkles and the white bloom that the end card cuts out of.
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, clamp01, lerp } from "./lib";
import { ChromAb, Ground, ShutterBlur, ink, mix, tv } from "./seg8_util";
import { RingGhost } from "./seg8_three";

/** group scale (spec §4C): 1.182 at 1059, 1.0 at 1080, 0.722 at 1152 */
export const S = (n: number) => 1.0014 - 0.00392 * (n - 1080) + 0.091 * Math.exp(-(n - 1059) / 4.44);
const AX = 936, AY = 530;

const ITEMS = ["Your SaaS Product", "E-commerce Brands", "Your Website Hero", "Advertising", "Marketing"];
const FINAL = "More Conversions";
const TRK = -0.05; // brand tracking (em)
const WSP = 0.1; // extra word spacing (em): the brand tracking closes the spaces up too much at this size
const ITEM_FS = 106 / 0.727; // cap 106 px at S = 1
const MAXW = 1020; // widest reference item (Governed AI 1018)
const CX = 972; // centre item centre x (group px)
const BASE = 655; // item baseline (group px)
const GY = 610; // ghosts scale about the x-height band centre
const GAP = 210; // centre item edge -> ghost inner edge
const GHOST = { sc: 0.75, op: 0.085, blur: 3.75 };

/** ink width of a line of Inter Tight 800 at the brand tracking (the last letter's trailing tracking removed) */
const inkOf = (t: string, fs: number) => ink(t, fs, 800, F.head, TRK * fs, WSP * fs);
const inkW = (t: string, fs: number) => { const k = inkOf(t, fs); return k.r - k.l; };
const fitFs = (t: string, fs0: number, maxW: number) => Math.min(fs0, (fs0 * maxW) / inkW(t, fs0));

/** switches: [frame k, type]: "start" = the move begins inside frame k's shutter, "end" = it lands inside it */
const SWITCHES: [number, "start" | "end"][] = [[1075, "start"], [1087, "end"], [1103, "end"], [1116, "start"]];
/**
 * Each switch as a move in film time. The shutter (180 deg) exposes [k - 0.5, k] of frame k, so:
 * "end" at k: the slide mostly happens in the dark half [k - 1, k - 0.5] and eases out inside frame k's exposure
 *   (quad ease-out over [k - 1, k - 0.1]: ~20 % of the slot left at k - 0.5, so the incoming item reads ~40 % bright with a
 *   short trail to the right, as measured);
 * "start" at k: the slide begins inside frame k's exposure (quad ease-in over [k - 0.3, k + 0.5]: ~14 % gone at k, a
 *   120-240 px trail to the left of a still-bright item) and finishes in the dark, so frame k + 1 is sharp.
 */
const MOVES = SWITCHES.map(([k, type]) => (type === "end" ? { a: k - 1, b: k - 0.1, e: (u: number) => 1 - (1 - u) * (1 - u) } : { a: k - 0.3, b: k + 0.5, e: (u: number) => u * u }));
/** continuous index of the centred item at film time t */
const pAt = (t: number) => MOVES.reduce((p, m) => p + m.e(clamp01((t - m.a) / (m.b - m.a))), 0);
/** Marketing's ease-in slide to the left before the dissolve (group px; measured 968, 962, 945, 917 at 1122-1125) */
const slideAt = (t: number) => -tv(t, [[1122, 0], [1123, 7], [1124, 28], [1125, 61], [1126, 104]]);

type St = { x: number; sc: number; op: number; blur: number };
const layout = (c: number, W: number[]): Record<number, St> => {
  const L: Record<number, St> = {};
  const N = ITEMS.length;
  if (c < 0 || c >= N) return L;
  L[c] = { x: CX, sc: 1, op: 1, blur: 0 };
  if (c + 1 < N) L[c + 1] = { x: CX + W[c] / 2 + GAP + (GHOST.sc * W[c + 1]) / 2, ...GHOST };
  if (c + 2 < N) L[c + 2] = { x: L[c + 1].x + (GHOST.sc * W[c + 1]) / 2 + GAP + (GHOST.sc * W[c + 2]) / 2, sc: GHOST.sc, op: 0, blur: GHOST.blur };
  if (c - 1 >= 0) L[c - 1] = { x: CX - W[c] / 2 - GAP - (GHOST.sc * W[c - 1]) / 2, ...GHOST };
  if (c - 2 >= 0) L[c - 2] = { x: L[c - 1].x - (GHOST.sc * W[c - 1]) / 2 - GAP - (GHOST.sc * W[c - 2]) / 2, sc: GHOST.sc, op: 0, blur: GHOST.blur };
  return L;
};

const stateAt = (t: number, W: number[]) => {
  const p = pAt(t), c = Math.floor(p + 1e-9), f = p - c;
  const A = layout(c, W), B = layout(c + 1, W), slide = slideAt(t);
  return ITEMS.map((_, j) => {
    const a = A[j] ?? B[j], b = B[j] ?? A[j];
    if (!a || !b) return null;
    const st: St = f < 1e-6 ? a : { x: lerp(a.x, b.x, f), sc: lerp(a.sc, b.sc, f), op: lerp(a.op, b.op, f), blur: lerp(a.blur, b.blur, f) };
    return { ...st, x: st.x + slide };
  });
};

/** the track at film time t; dt = the shutter sample spacing (each sample is smeared over its own share of the move) */
const Track: React.FC<{ t: number; dt: number; fs: number[]; W: number[]; fade?: number }> = ({ t, dt, fs, W, fade = 1 }) => {
  const now = stateAt(t, W), next = dt > 0 ? stateAt(t + dt, W) : now;
  const id = `s8mb${Math.round(t * 1000)}`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        {now.map((st, j) => {
          if (!st) return null;
          const nx = next[j]?.x ?? st.x, sx = Math.abs(nx - st.x) * 0.5 / Math.max(0.3, st.sc);
          return (
            <filter key={j} id={`${id}-${j}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={`${Math.sqrt(sx * sx + st.blur * st.blur) / Math.max(0.3, st.sc)} ${st.blur / Math.max(0.3, st.sc)}`} />
            </filter>
          );
        })}
      </defs>
      {ITEMS.map((txt, j) => {
        const st = now[j];
        if (!st || st.op < 0.002) return null;
        const nx = next[j]?.x ?? st.x, blurred = st.blur > 0.05 || Math.abs(nx - st.x) > 0.5;
        return (
          <g key={j} transform={`translate(${st.x} ${GY}) scale(${st.sc})`} opacity={st.op * fade}>
            <text x={-(inkOf(txt, fs[j]).l + inkOf(txt, fs[j]).r) / 2} y={BASE - GY} fontFamily={F.head} fontWeight={800} fontSize={fs[j]} letterSpacing={TRK * fs[j]}
              wordSpacing={WSP * fs[j]} fill="#F7F7F8" filter={blurred ? `url(#${id}-${j})` : undefined}>{txt}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ---- final item ----
const FIN_FS0 = 122 / 0.727; // measured x1.10 item (cap 122 at S = 1)
const FIN_CX = 909; // text centre (group px): the reference's text + sparkles composition
const REF_FIN_W = 857; // the reference's final text width (group px)
/** reveal: brightness across the text (u = 0 left edge .. 1 right edge), fitted to the reference 1127-1147 */
const reveal = (n: number, u: number) => clamp01(0.75 + 0.034 * (n - 1127) - (0.62 - 0.012 * (n - 1127)) * u);
const BLOOM: [number, number][] = [[1144, 0], [1145, 0.05], [1146, 0.1], [1147, 0.25], [1148, 0.45], [1149, 0.65], [1150, 0.8], [1151, 0.9], [1152, 1]];

/** a 4-point concave sparkle, w tip to tip */
const Star: React.FC<{ x: number; y: number; w: number; color: string; rot?: number }> = ({ x, y, w, color, rot = 0 }) => {
  if (w <= 0.5) return null;
  const r = w / 2, k = 0.26 * r;
  const d = `M0 ${-r} Q${k} ${-k} ${r} 0 Q${k} ${k} 0 ${r} Q${-k} ${k} ${-r} 0 Q${-k} ${-k} 0 ${-r}Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={d} fill={color} filter="url(#s8-starglow)" opacity={0.9} transform="scale(1.25)" />
      <path d={d} fill={color} />
    </g>
  );
};
const STARS = {
  A: { size: [[1126.4, 0], [1127, 25], [1128, 46], [1129, 61], [1130, 72], [1131, 75], [1132, 77], [1133, 73], [1134, 70], [1135, 68], [1136, 66], [1137, 64], [1138, 63], [1148, 63], [1150, 61], [1152, 59]] as [number, number][],
    x: [[1127, 1360], [1134, 1335], [1140, 1313], [1152, 1290]] as [number, number][], y: [[1127, 555], [1152, 546]] as [number, number][], c0: "#3F8CE8", c1: "#8DC0FF" },
  C: { size: [[1128.4, 0], [1129, 5], [1130, 14], [1131, 21], [1132, 24], [1133, 27], [1134, 29], [1136, 30], [1140, 27], [1146, 26], [1152, 25]] as [number, number][],
    x: [[1129, 1398], [1152, 1365]] as [number, number][], y: [[1129, 532], [1152, 520]] as [number, number][], c0: "#1266C9", c1: "#5AA2F0" },
  B: { size: [[1131.4, 0], [1132, 11], [1133, 22], [1134, 32], [1135, 39], [1136, 44], [1138, 45], [1140, 43], [1144, 37], [1148, 36], [1152, 37]] as [number, number][],
    x: [[1132, 1364], [1152, 1335]] as [number, number][], y: [[1132, 492], [1152, 492]] as [number, number][], c0: "#7FB4F2", c1: "#CFE2FA" },
};

const Final: React.FC<{ n: number; op?: number }> = ({ n, op = 1 }) => {
  const fs = fitFs(FINAL, FIN_FS0, MAXW);
  const k = inkOf(FINAL, fs), W = k.r - k.l, x0 = FIN_CX - W / 2 - k.l;
  const stops = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const bloom = tv(n, BLOOM);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }}>
      <defs>
        <linearGradient id="s8-fin" gradientUnits="userSpaceOnUse" x1={x0 + k.l} y1="0" x2={x0 + k.r} y2="0">
          {stops.map((u) => <stop key={u} offset={u} stopColor="#F7F7F8" stopOpacity={Math.max(0.1, reveal(n, u))} />)}
        </linearGradient>
        <filter id="s8-bloom" x="-30%" y="-120%" width="160%" height="340%">
          <feGaussianBlur stdDeviation="24" /><feComponentTransfer><feFuncA type="linear" slope="1.9" /></feComponentTransfer>
        </filter>
        <filter id="s8-bloom3" x="-40%" y="-200%" width="180%" height="500%">
          <feGaussianBlur stdDeviation="62" /><feComponentTransfer><feFuncA type="linear" slope="3.2" /></feComponentTransfer>
        </filter>
        <filter id="s8-bloom2" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="8" /><feComponentTransfer><feFuncA type="linear" slope="1.2" /></feComponentTransfer>
        </filter>
      </defs>
      {bloom > 0 && (
        <g opacity={bloom}>
          <text x={x0} y={BASE} fontFamily={F.head} fontWeight={800} fontSize={fs} letterSpacing={TRK * fs} wordSpacing={WSP * fs} fill="#DCE8F8" filter="url(#s8-bloom3)" opacity={0.75}>{FINAL}</text>
          <text x={x0} y={BASE} fontFamily={F.head} fontWeight={800} fontSize={fs} letterSpacing={TRK * fs} wordSpacing={WSP * fs} fill="#E6F0FD" filter="url(#s8-bloom)">{FINAL}</text>
          <text x={x0} y={BASE} fontFamily={F.head} fontWeight={800} fontSize={fs} letterSpacing={TRK * fs} wordSpacing={WSP * fs} fill="#FFFFFF" filter="url(#s8-bloom2)" opacity={0.4}>{FINAL}</text>
        </g>
      )}
      <text x={x0} y={BASE} fontFamily={F.head} fontWeight={800} fontSize={fs} letterSpacing={TRK * fs} wordSpacing={WSP * fs} fill="url(#s8-fin)">{FINAL}</text>
    </svg>
  );
};
/** sparkles in screen space (measured), shifted right by the extra half-width of our longer line */
const Sparkles: React.FC<{ n: number; dx: number }> = ({ n, dx }) => {
  const glow = tv(n, [[1148, 0], [1152, 1]]);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs><filter id="s8-starglow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" /></filter></defs>
      {(["C", "B", "A"] as const).map((k) => {
        const s = STARS[k];
        const rot = k === "A" ? tv(n, [[1127, -10], [1132, 0]]) : 0;
        return <Star key={k} x={tv(n, s.x) + dx} y={tv(n, s.y)} w={tv(n, s.size)} color={mix(s.c0, s.c1, glow)} rot={rot} />;
      })}
    </svg>
  );
};

/** "Built for": Inter Tight 800, cap 83; the reference's ink box is x 737-1201 (Built 737-1000, for 1035-1201), baseline 432 at S = 1 */
const BF_FS = 83 / 0.727;
const BuiltFor: React.FC = () => {
  // widen the brand tracking until the ink matches the reference's 464 px
  const k0 = ink("Built for", BF_FS, 800, F.head, TRK * BF_FS);
  const lp = TRK * BF_FS + (464 - (k0.r - k0.l)) / 8;
  const k = ink("Built for", BF_FS, 800, F.head, lp);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <text x={969 - (k.l + k.r) / 2} y={432} fontFamily={F.head} fontWeight={800} fontSize={BF_FS} letterSpacing={lp} fill="#F7F7F8">Built for</text>
    </svg>
  );
};

const SAMPLES = 16;
export const Carousel: React.FC<{ g: number }> = ({ g }) => {
  const n = g;
  const fs = ITEMS.map((t) => fitFs(t, ITEM_FS, MAXW));
  const W = ITEMS.map((t, i) => inkW(t, fs[i]));
  // a frame needs the shutter only if a move overlaps its half-frame exposure [n - 0.5, n]
  const moving = MOVES.some((m) => m.b > n - 0.5 && m.a < n) || (n >= 1123 && n <= 1126);
  const times = moving ? Array.from({ length: SAMPLES }, (_, i) => n - 0.5 + (0.5 * (i + 0.5)) / SAMPLES) : [n];
  // 1126: Marketing (smeared, still ~85 %) dissolves into the first, still dark frame of the final line
  const finalOp = n >= 1127 ? 1 : n === 1126 ? 0.35 : 0;
  const trackFade = n >= 1127 ? 0 : n === 1126 ? 0.85 : 1;
  const sc = S(n);
  if (n === 1080 || n === 1141) console.log("S8", n, JSON.stringify({ fs: fs.map((v) => +v.toFixed(1)), W: W.map((v) => +v.toFixed(1)), fin: [+fitFs(FINAL, FIN_FS0, MAXW).toFixed(1), +inkW(FINAL, fitFs(FINAL, FIN_FS0, MAXW)).toFixed(1)] }));
  const fsF = fitFs(FINAL, FIN_FS0, MAXW);
  const dx = ((inkW(FINAL, fsF) - REF_FIN_W) / 2) * sc;
  const scene = (
    <AbsoluteFill>
      <Ground glow={0.35} haze={0.8} />
      {n < 1067 && <RingGhost op={tv(n, [[1059, 0.05], [1066, 0]])} />}
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${AX}px ${AY}px` }}>
        <BuiltFor />
        {trackFade > 0 && <ShutterBlur times={times} render={(t) => <Track t={t} dt={moving ? 0.5 / SAMPLES : 0} fs={fs} W={W} fade={trackFade} />} />}
        {finalOp > 0 && <Final n={Math.max(1127, n)} op={finalOp} />}
      </AbsoluteFill>
      {n >= 1149 && (
        // the flash building toward the cut: a wide soft light around the line
        <div style={{ position: "absolute", left: 905 - 760, top: 590 - 300, width: 1520, height: 600, borderRadius: "50%", opacity: tv(n, [[1149, 0.12], [1150, 0.3], [1151, 0.55], [1152, 0.85]]),
          background: "radial-gradient(closest-side, rgba(214,228,246,0.62) 0%, rgba(214,228,246,0.3) 45%, rgba(214,228,246,0) 100%)" }} />
      )}
      {n >= 1127 && <Sparkles n={n} dx={dx} />}
    </AbsoluteFill>
  );
  return <ChromAb on={n < 1064}>{scene}</ChromAb>;
};
