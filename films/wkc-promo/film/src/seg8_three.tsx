// Segment 8, shot 1 (1002-1058): the "3" in its converging blue rings, "Formats for your / website and socials" typed
// to land on the 1032 impact, and the three frame formats (16:9, 1:1, 9:16) riding the echo rings onto the main ring.
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { F, clamp01, lerp } from "./lib";
import { tw } from "./kit";
import { ChromAb, Ground, hex, mix, smooth, tab, tv } from "./seg8_util";

// ---- measured tables (spec seg8 §4A/4B, Table A; 1080p) ----
/** layer scale s(n) */
const S_TAB: [number, number][] = [
  [1002, 2.6], [1003, 2.16], [1004, 1.92], [1005, 1.788], [1006, 1.668], [1007, 1.576], [1008, 1.504], [1009, 1.444], [1010, 1.396],
  [1011, 1.352], [1012, 1.316], [1013, 1.284], [1014, 1.256], [1015, 1.232], [1016, 1.208], [1017, 1.188], [1018, 1.172], [1019, 1.156],
  [1020, 1.14], [1021, 1.124], [1022, 1.116], [1023, 1.104], [1024, 1.096], [1025, 1.084], [1026, 1.076], [1027, 1.068], [1028, 1.06],
  [1029, 1.056], [1030, 1.048], [1031, 1.044], [1032, 1.04], [1033, 1.036], [1034, 1.028], [1035, 1.024], [1036, 1.02], [1037, 1.016],
  [1038, 1.012], [1039, 1.004], [1040, 1.0], [1041, 0.996], [1042, 0.988], [1043, 0.98], [1044, 0.972], [1045, 0.964], [1046, 0.956],
  [1047, 0.948], [1048, 0.94], [1049, 0.932], [1050, 0.916], [1051, 0.904], [1052, 0.892], [1053, 0.876], [1054, 0.856], [1055, 0.832],
  [1056, 0.808], [1057, 0.772], [1058, 0.732],
];
export const sAt = (n: number) => tv(n, S_TAB);
/** centre y of the "3" glyph box */
const TY_TAB: [number, number][] = [
  [1005, 514], [1006, 498], [1007, 487], [1008, 482], [1009, 475], [1010, 470], [1011, 467], [1012, 464], [1013, 460], [1014, 459],
  [1015, 457], [1016, 455], [1019, 451], [1022, 448], [1025, 445], [1028, 444], [1030, 442], [1043, 442.5], [1045, 445], [1048, 447],
  [1050, 449], [1052, 451.5], [1054, 455], [1055, 457], [1056, 459], [1057, 463], [1058, 466],
];
/** ring centre y (measured 401 at 1020 from the top/bottom crossings) */
const RY_TAB: [number, number][] = [
  [1002, 400.5], [1022, 400.5], [1032, 403], [1044, 403], [1045, 405.5], [1046, 406.5], [1047, 408], [1048, 410], [1049, 411], [1050, 412],
  [1051, 414], [1052, 416.5], [1053, 418.5], [1054, 422], [1055, 425], [1056, 429], [1057, 434], [1058, 441],
];
/** ring b/a */
const RB_TAB: [number, number][] = [[1002, 0.52], [1022, 0.52], [1025, 0.535], [1031, 0.535], [1032, 0.515]];
/** layer exit opacity */
const OP_TAB: [number, number][] = [[1053, 1], [1054, 0.88], [1055, 0.75], [1056, 0.59], [1057, 0.45], [1058, 0.32]];
/** subtitle: line-1 box top y and subtitle scale (measured; 1005-1009 from the reference strips) */
const SUB_TAB: number[][] = [
  [1005, 1110, 1.96], [1006, 1050, 1.9], [1007, 997, 1.82], [1008, 967, 1.75], [1009, 930, 1.64], [1010, 900, 1.55], [1011, 877, 1.48],
  [1012, 857, 1.43], [1014, 828, 1.34], [1016, 804, 1.29], [1018, 785, 1.23], [1020, 770, 1.19], [1022, 758, 1.16], [1024, 747, 1.13],
  [1026, 738, 1.1], [1028, 731, 1.08], [1030, 725, 1.07], [1032, 720, 1.05], [1040, 705, 1.0], [1050, 687, 0.91], [1054, 676, 0.85],
  [1056, 669, 0.8], [1058, 657, 0.73],
];
/**
 * Brightness of the main ring around its circumference, measured every 15 deg of the ellipse parameter (0 = right end,
 * 90 = front/bottom, 180 = left end, 270 = top): 0 = invisible, 1 = white hot-spot. Lit from the front-left, dark on the right.
 */
const PROF: number[][] = [
  [1008, 0, 0, 0.05, 0.13, 0.21, 0.34, 0.48, 0.91, 0.69, 0.39, 0.17, 0.09, 0.06, 0.04, 0.06, 0.07, 0.06, 0.06, 0.12, 0.18, 0.12, 0.1, 0.04, 0],
  [1014, 0, 0, 0, 0.11, 0.21, 0.35, 0.53, 0.95, 0.82, 0.42, 0.28, 0.19, 0.15, 0.15, 0.18, 0.24, 0.3, 0.58, 0.77, 0.3, 0.01, 0, 0, 0],
  [1020, 0, 0, 0, 0.06, 0.14, 0.29, 0.5, 0.96, 0.78, 0.42, 0.34, 0.27, 0.2, 0.21, 0.22, 0.31, 0.43, 0.73, 1, 0.63, 0.3, 0.15, 0.04, 0],
  [1026, 0, 0, 0.01, 0.05, 0.09, 0.1, 0.33, 0.91, 0.92, 0.4, 0.34, 0.2, 0.19, 0.19, 0.23, 0.31, 0.44, 0.89, 0.96, 0.77, 0.41, 0.22, 0.1, 0.02],
  [1031, 0.01, 0.01, 0.04, 0.12, 0.19, 0.28, 0.35, 0.64, 0.46, 0.27, 0.24, 0.15, 0.15, 0.18, 0.25, 0.4, 0.45, 0.96, 0.96, 0.9, 0.41, 0.28, 0.15, 0.04],
  [1034, 0.03, 0.07, 0.07, 0.17, 0.26, 0.4, 0.51, 0.9, 0.55, 0.18, 0, 0, 0.03, 0.06, 0.11, 0.24, 0.32, 0.64, 0.91, 0.6, 0.37, 0.23, 0.15, 0.07],
  [1040, 0.03, 0.06, 0.08, 0.19, 0.3, 0.41, 0.56, 0.98, 0.81, 0.37, 0.2, 0.14, 0.04, 0.02, 0, 0, 0.01, 0.31, 0.69, 0.46, 0.28, 0.18, 0.08, 0.02],
  [1046, 0, 0, 0, 0.14, 0.27, 0.42, 0.59, 1, 0.88, 0.5, 0.38, 0.23, 0.16, 0.15, 0.15, 0.15, 0.2, 0.26, 0.21, 0.02, 0.04, 0.05, 0, 0],
  [1050, 0, 0, 0, 0.15, 0.3, 0.38, 0.54, 1, 0.88, 0.52, 0.3, 0.22, 0.18, 0.14, 0.17, 0.22, 0.32, 0.53, 0.53, 0.15, 0, 0, 0, 0],
  [1055, 0, 0, 0, 0.05, 0.12, 0.3, 0.54, 0.95, 0.81, 0.47, 0.4, 0.24, 0.17, 0.17, 0.18, 0.31, 0.33, 0.56, 0.7, 0.38, 0.09, 0, 0, 0],
];

/** main ring semi-major */
const aMain = (n: number) => 454.5 * sAt(n);
/** the second ring that contracts onto the main ring; echo k (2..5) = R(n - 2(k-2)) (measured: 575/606/646/698 at 1020) */
const R = (n: number) => sAt(Math.max(1002, n)) * (454.5 + 306 * Math.exp(-0.1245 * (n - 1005)));
/** big outer sweep ring (screen px), from 1035 */
const E_TAB: [number, number][] = [[1034, 900], [1035, 955], [1036, 1007], [1037, 1055], [1038, 1100], [1039, 1124], [1040, 1157], [1041, 1172], [1042, 1196], [1045, 1200], [1058, 1208]];
const E_STR: [number, number][] = [[1049, 1], [1050, 0.66], [1051, 0.57], [1052, 0.51], [1053, 0.45], [1054, 0.42], [1055, 0.41], [1056, 0.42], [1057, 0.37], [1058, 0.38]];

// ---- ring drawing (canvas: an ellipse stroked with a conic gradient that follows the measured brightness) ----
/** level -> colour along WKC's blues: deep blue, brand blue, light blue, white */
const RAMP: [number, string][] = [[0, "#1B4FB8"], [0.22, "#2C6AD0"], [0.45, "#5AA2F0"], [0.7, "#A9CFF8"], [0.88, "#E6F0FD"], [1, "#FFFFFF"]];
const rampRGBA = (L: number, alpha = 1) => {
  const l = clamp01(L);
  let i = 1;
  while (i < RAMP.length - 1 && l > RAMP[i][0]) i++;
  const [l0, c0] = RAMP[i - 1], [l1, c1] = RAMP[i];
  const t = clamp01((l - l0) / (l1 - l0)), A = hex(c0), B = hex(c1);
  const a = clamp01(l / 0.14) * alpha;
  return `rgba(${A.map((v, k) => Math.round(lerp(v, B[k], t))).join(",")},${a.toFixed(3)})`;
};
const lvl = (p: number[], deg: number) => {
  const u = ((((deg % 360) + 360) % 360) / 15), i = Math.floor(u), f = u - i, w = (1 - Math.cos(Math.PI * f)) / 2;
  return lerp(p[i % 24], p[(i + 1) % 24], w);
};
type El = { cx: number; cy: number; a: number; b: number };
/** conic gradient for an ellipse: the brightness profile at parameter angles, placed at the matching screen angles */
const conic = (ctx: CanvasRenderingContext2D, e: El, f: (deg: number) => string) => {
  const gr = ctx.createConicGradient(0, e.cx, e.cy);
  for (let d = 0; d <= 360; d += 5) {
    const t = (d * Math.PI) / 180;
    let ph = Math.atan2(e.b * Math.sin(t), e.a * Math.cos(t));
    if (ph < 0) ph += 2 * Math.PI;
    if (d === 360) ph = 2 * Math.PI;
    gr.addColorStop(Math.min(1, ph / (2 * Math.PI)), f(d));
  }
  return gr;
};
const strokeEl = (ctx: CanvasRenderingContext2D, e: El, style: string | CanvasGradient, w: number, blur = 0, alpha = 1) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (blur > 0) ctx.filter = `blur(${blur}px)`;
  ctx.strokeStyle = style;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.ellipse(e.cx, e.cy, Math.max(1, e.a), Math.max(1, e.b), 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
};

const drawRings = (ctx: CanvasRenderingContext2D, n: number) => {
  ctx.clearRect(0, 0, 1920, 1080);
  const s = sAt(n), cx = 960, cy = tv(n, RY_TAB), ratio = tv(n, RB_TAB), p = tab(n, PROF), am = aMain(n);
  ctx.globalCompositeOperation = "lighter";
  if (n < 1032) {
    // phase 1: main ring + 4 echoes contracting onto it, with a blue haze in the band between them
    const as = [am, R(n), R(n - 2), R(n - 4), R(n - 6)];
    const outer: El = { cx, cy, a: as[4], b: as[4] * ratio }, inner: El = { cx, cy, a: am, b: am * ratio };
    ctx.save();
    ctx.filter = `blur(${10 * s}px)`;
    ctx.fillStyle = conic(ctx, outer, (d) => rampRGBA(0.22, 0.42 * Math.pow(lvl(p, d), 0.6)));
    ctx.beginPath();
    ctx.ellipse(outer.cx, outer.cy, outer.a, outer.b, 0, 0, Math.PI * 2);
    ctx.ellipse(inner.cx, inner.cy, inner.a, inner.b, 0, 0, Math.PI * 2, true);
    ctx.fill("evenodd");
    ctx.restore();
    as.forEach((a, k) => {
      const e: El = { cx, cy, a, b: a * ratio }, st = Math.pow(0.95, k);
      const g = conic(ctx, e, (d) => rampRGBA(lvl(p, d) * st));
      strokeEl(ctx, e, conic(ctx, e, (d) => rampRGBA(Math.min(0.6, lvl(p, d)) * st)), 12 * s, 6 * s, 0.55);
      strokeEl(ctx, e, g, 4.2 * s);
    });
  } else {
    // phase 2 (impact 1032): one thin rim, faint ripples, the big sweep ring with two echoes at the bottom
    const e: El = { cx, cy, a: am, b: am * ratio };
    [720, 845, 910].forEach((ra) => {
      const r: El = { cx, cy, a: ra * s, b: ra * s * ratio };
      strokeEl(ctx, r, conic(ctx, r, (d) => rampRGBA(0.2, 0.55 * clamp01(lvl(p, d) * 3 + 0.25))), 3 * s, 1.5);
    });
    const est = tv(n, E_STR);
    [0, 2, 4].forEach((lag, i) => {
      if (n - lag < 1034) return;
      const a = tv(n - lag, E_TAB), r: El = { cx, cy, a, b: a * ratio };
      const soft = smooth(1042, 1049, n);
      const sp = (d: number) => clamp01(lvl(PROF[7].slice(1), d) * 1.1);
      const k = est * Math.pow(0.82, i);
      strokeEl(ctx, r, conic(ctx, r, (d) => rampRGBA(sp(d) * (0.55 + 0.25 * soft) * k)), lerp(3.2, 14, soft), lerp(0.6, 7, soft));
      strokeEl(ctx, r, conic(ctx, r, (d) => rampRGBA(sp(d) * 0.45 * k)), 14, 6, 0.6);
    });
    strokeEl(ctx, e, conic(ctx, e, (d) => rampRGBA(Math.min(0.55, lvl(p, d)))), 9 * s, 5 * s, 0.6);
    strokeEl(ctx, e, conic(ctx, e, (d) => rampRGBA(lvl(p, d))), 3 * s);
  }
};

const RingLayer: React.FC<{ n: number; blur: number }> = ({ n, blur }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (ctx) drawRings(ctx, n);
  }, [n]);
  return <canvas ref={ref} width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: blur > 0 ? `blur(${blur}px)` : undefined }} />;
};

// ---- the three formats riding the rings: 16:9 on the left end, 1:1 at the top, 9:16 on the right end ----
const FORMATS = [
  { label: "16:9", w: 160, h: 90, th: Math.PI, lag: 0, t0: 1012 },
  { label: "1:1", w: 96, h: 96, th: -Math.PI / 2, lag: 2, t0: 1014 },
  { label: "9:16", w: 60, h: 107, th: 0, lag: 4, t0: 1016 },
];
const Formats: React.FC<{ n: number; cx: number; cy: number; ratio: number }> = ({ n, cx, cy, ratio }) => {
  const s = sAt(n), am = aMain(n);
  const flash = n >= 1032 ? Math.exp(-(n - 1032) / 3) : 0;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs><filter id="s8-fglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter></defs>
      {FORMATS.map((f) => {
        const pop = clamp01((n - f.t0 + 1) / 4);
        if (pop <= 0) return null;
        const conv = 1 - smooth(1025, 1032, n);
        const a = am + (R(n - f.lag) - am) * conv;
        const x = cx + a * Math.cos(f.th), y = cy + a * ratio * Math.sin(f.th);
        const k = s * (0.7 + 0.3 * (1 - Math.pow(1 - pop, 3)));
        const w = f.w * k, h = f.h * k, rr = 12 * k;
        const op = 1 - Math.pow(1 - pop, 2);
        const stroke = mix("#8DC0FF", "#FFFFFF", flash * 0.8);
        return (
          <g key={f.label} opacity={op}>
            <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={rr} fill="none" stroke="#3F8CE8" strokeWidth={8 * k} filter="url(#s8-fglow)" opacity={0.55 + 0.45 * flash} />
            <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={rr} fill="#07111E" fillOpacity={0.9} stroke={stroke} strokeWidth={3 * k} />
            <text x={x} y={y + 8 * k} textAnchor="middle" fontFamily={F.ui} fontWeight={600} fontSize={22 * k} fill="#CFE2FA">{f.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ---- subtitle typing ----
const L1 = "Formats for your", L2 = "website and socials";
/** frame each character appears (a space carries the next letter's frame) */
const T1 = [1004, 1004, 1005, 1005, 1006, 1006, 1007, 1007, 1007, 1008, 1009, 1010, 1010, 1011, 1012, 1013];
const T2 = [1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1022, 1023, 1024, 1025, 1025, 1027, 1028, 1029, 1030, 1031, 1032];
const SUB_FS = 57 / 0.727; // Inter cap height 0.727 em -> cap 57 px at subtitle scale 1

/** one typed line in subtitle-layer px: centred on x 0, alphabetic baseline at y */
const SubLine: React.FC<{ text: string; times: number[]; n: number; y: number; half: number }> = ({ text, times, n, y, half }) => {
  // each word sits +100 px right of its slot when it appears and settles exponentially; the shifts add up along the line
  const words: { w: string; i0: number; t: number }[] = [];
  let i = 0;
  for (const w of text.split(" ")) { words.push({ w, i0: i, t: times[i] }); i += w.length + 1; }
  const full = tw(text, SUB_FS, 600, F.ui);
  const space = tw("a b", SUB_FS, 600, F.ui) - tw("ab", SUB_FS, 600, F.ui);
  let x = -full / 2, extra = 0;
  return (
    <>
      {words.map((wd) => {
        const started = n >= wd.t;
        if (started) extra += 100 * Math.pow(0.5, (n - wd.t) / half);
        const wx = x + extra;
        x += tw(wd.w, SUB_FS, 600, F.ui) + space;
        if (!started) return null;
        return (
          <text key={wd.i0} x={wx} y={y} fontFamily={F.ui} fontWeight={600} fontSize={SUB_FS}>
            {wd.w.split("").map((ch, j) => {
              const t = times[wd.i0 + j];
              const k = clamp01((n - t + 1) / 4);
              return <tspan key={j} fill={mix("#8A8E96", "#F7F7F8", k)} fillOpacity={n >= t ? 1 : 0}>{ch}</tspan>;
            })}
          </text>
        );
      })}
    </>
  );
};

const Subtitle: React.FC<{ n: number; op: number }> = ({ n, op }) => {
  const [top, sc] = tab(n, SUB_TAB);
  const blur = n < 1010 ? 6 : n < 1013 ? 4.5 : n < 1015 ? 2 : 0;
  // measured box top -> line-1 baseline 63 px below it, line 2 a further 102 px (layer px at scale 1), scaled about x 960
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op, filter: blur ? `blur(${blur}px)` : undefined }}>
      <g transform={`translate(960 ${top}) scale(${sc})`}>
        <SubLine text={L1} times={T1} n={n} y={63} half={3.6} />
        <SubLine text={L2} times={T2} n={n} y={165} half={2.6} />
      </g>
    </svg>
  );
};

const THREE_FS = 188 / 0.727; // Inter Tight figure height = cap height 0.727 em

export const ThreeShot: React.FC<{ g: number }> = ({ g }) => {
  const n = g;
  const s = sAt(n);
  const cx = 960, cy = tv(n, RY_TAB), ratio = tv(n, RB_TAB);
  const exitOp = tv(n, OP_TAB);
  const layerIn = tv(n, [[1002, 0.6], [1003, 0.85], [1004, 1]]);
  const ringBlur = tv(n, [[1002, 7], [1003, 5], [1004, 3.5], [1005, 2.5], [1006, 1.5], [1008, 0]]);
  // the previous shot's gain (segment 7 fades its own layer): our ground comes up additively underneath
  const g7 = tv(n, [[1002, 1], [1003, 0.84], [1004, 0.65], [1005, 0.48], [1006, 0.31], [1007, 0.16], [1008, 0.07], [1009, 0.02], [1010, 0]]);
  const dark = tv(n, [[1001, 0], [1002, 0.5], [1003, 1], [1004, 1], [1005, 0.7], [1006, 0.35], [1007, 0.1], [1008, 0]]);
  const phase2 = n >= 1032;

  // "3": opacity / blur entrance, centre (962, y), cap 188*s
  const tOp = n < 1005 ? 0 : tv(n, [[1005, 0.44], [1006, 0.62], [1007, 0.81], [1008, 1]]) * exitOp;
  const tBlur = tv(n, [[1005, 10.5], [1006, 9], [1007, 7.5], [1008, 7.5], [1009, 6], [1010, 6], [1011, 4.5], [1012, 4.5], [1013, 3], [1014, 2.25], [1015, 1.5], [1016, 0]]);
  const ty = tv(n, TY_TAB);

  const scene = (
    <AbsoluteFill>
      {n < 1009 ? (
        <>
          <AbsoluteFill style={{ opacity: dark, background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)" }} />
          <AbsoluteFill style={{ mixBlendMode: "plus-lighter", opacity: 1 - g7 }}><Ground corner={1} /></AbsoluteFill>
        </>
      ) : (
        <Ground corner={1} />
      )}
      <AbsoluteFill style={{ opacity: layerIn * exitOp }}>
        <RingLayer n={n} blur={ringBlur} />
        <Formats n={n} cx={cx} cy={cy} ratio={ratio} />
      </AbsoluteFill>
      {n >= 1005 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: tOp, filter: tBlur > 0 ? `blur(${tBlur}px)` : undefined }}>
          <defs>
            <linearGradient id="s8-three" gradientUnits="userSpaceOnUse" x1="0" y1={ty - 94 * s} x2="0" y2={ty + 94 * s}>
              <stop offset="0" stopColor="#F7F7F8" /><stop offset="0.55" stopColor="#EEF1F5" /><stop offset="0.8" stopColor="#C3CCD7" /><stop offset="1" stopColor="#9AA6B4" />
            </linearGradient>
          </defs>
          <text x={962} y={ty + 94 * s} textAnchor="middle" fontFamily={F.head} fontWeight={800} fontSize={THREE_FS * s} fill="url(#s8-three)">3</text>
        </svg>
      )}
      {n >= 1005 && <Subtitle n={n} op={exitOp} />}
    </AbsoluteFill>
  );
  return <ChromAb on={phase2}>{scene}</ChromAb>;
};
