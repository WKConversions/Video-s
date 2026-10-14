// Segment 2, shot A (frames 147–218): "Explain. / Engage. / Convert." beside the WKC Studio scene editor. The cursor drags a
// keyframe pinwheel onto the canvas, it pops into a blue "Explainer scene" card that collapses into a pipeline node, the
// cursor whips a loop and the editor tilts into 3D. Every transform is the reference's measured per-frame table (seg2.md §2).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Pointer } from "./kit";
import { C, F, EASE, clamp01, lerp } from "./lib";
import { WKC_PATH, WKC_VIEW } from "./mark";
import { A0, CAM_S, CAM_TX, CAM_TY, P_TX, P_TY, P_S, P_RX, P_RY, P_RZ, A_EXPLAIN, A_ENGAGE, A_CONVERT, CUR } from "./seg2_data";
import { Pinwheel, at, ink, kf } from "./seg2_ink";

// ---------- type ----------
const FS = 163; // cap height 118.5 px like the reference (Inter Tight cap = 0.7275 em)
const TR = -0.05 * FS;
const WORDS: { t: string; w: number; base: number }[] = [
  { t: "Explain.", w: 800, base: 264 },
  { t: "Engage.", w: 500, base: 448.5 },
  { t: "Convert.", w: 500, base: 631.5 },
];
const INK_LEFT = 70.5;

// ---------- the editor panel (world space = screen space at camera s = 1, frame 185) ----------
const PX = 635.6, PY = 67.5, PW = 1800, PH = 1323, PR = 21; // perimeter ≈ 6210 px → a 27-frame lap at 230 px/frame
const SIDE = 960;
const NAV = ["Home", "Brief", "Storyboard", "Design", "Animate", "Sound", "Review", "Render", "Export", "Clients"];
const TABS: [string, IconKind][] = [["Scene Editor", "pen"], ["Timeline", "clock"], ["Storyboard", "grid"], ["Render Queue", "list"]];
const ROWS: [string, IconKind | null][] = [
  ["Projects", "folder"], ["Assets", "layers"],
  ["Brief", null], ["Script & VO", null], ["Storyboard", null], ["Style frames", null], ["Brand kit", null], ["Footage", null], ["Music & SFX", null],
  ["Upload", "upload"], ["Animate", "play"], ["Keyframes", "diamond"], ["Easing", "curve"], ["Transitions", "swap"], ["Render", "film"], ["Formats", "frames"], ["Export", "export"],
];
type IconKind = "pen" | "clock" | "grid" | "list" | "folder" | "layers" | "upload" | "play" | "diamond" | "curve" | "swap" | "film" | "frames" | "export" | "doc" | "wave" | "palette" | "sliders";
const NODES: { x: number; y: number; t: string; s: string; icon: IconKind }[] = [
  { x: 1012, y: 255, t: "Product brief", s: "What needs explaining?", icon: "doc" },
  { x: 1440, y: 253, t: "Script & VO", s: "30 s story, word-timed", icon: "wave" },
  { x: 1868, y: 255, t: "Style frames", s: "On-brand in WKC blue", icon: "palette" },
  { x: 1012, y: 450, t: "Storyboard", s: "12 frames, shot by shot", icon: "grid" },
  { x: 1440, y: 450, t: "Animate", s: "Keyframes & easing curves", icon: "diamond" },
  { x: 1868, y: 450, t: "Render", s: "16:9 · 1:1 · 9:16", icon: "film" },
];
const NODE_G = { x: 1012, y: 645, t: "Explainer scene", s: "Send to timeline" };

/** a 24-unit outline icon centred on (cx, cy), size px */
const Icon: React.FC<{ k: IconKind; cx: number; cy: number; size: number; color: string; sw?: number }> = ({ k, cx, cy, size, color, sw = 1.8 }) => {
  const p = { fill: "none", stroke: color, strokeWidth: (sw * 24) / size, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const body: Record<IconKind, React.ReactNode> = {
    pen: <><path d="M4 20 L8 19 L19 8 L16 5 L5 16 Z" {...p} /><path d="M14 7 L17 10" {...p} /></>,
    clock: <><circle cx={12} cy={12} r={8.5} {...p} /><path d="M12 7 V12 L15 14" {...p} /></>,
    grid: <><rect x={4} y={4} width={7} height={7} rx={1.5} {...p} /><rect x={13} y={4} width={7} height={7} rx={1.5} {...p} /><rect x={4} y={13} width={7} height={7} rx={1.5} {...p} /><rect x={13} y={13} width={7} height={7} rx={1.5} {...p} /></>,
    list: <><rect x={4} y={5} width={16} height={14} rx={2} {...p} /><path d="M8 10 H16 M8 14 H13" {...p} /></>,
    folder: <path d="M3.5 7 V18 a1.5 1.5 0 0 0 1.5 1.5 H19 a1.5 1.5 0 0 0 1.5 -1.5 V9.5 a1.5 1.5 0 0 0 -1.5 -1.5 H11.5 L9.5 5.5 H5 a1.5 1.5 0 0 0 -1.5 1.5 Z" {...p} />,
    layers: <><path d="M12 4 L21 8.5 L12 13 L3 8.5 Z" {...p} /><path d="M3 12.5 L12 17 L21 12.5" {...p} /><path d="M3 16 L12 20.5 L21 16" {...p} /></>,
    upload: <><path d="M7 17.5 H6 a4 4 0 0 1 -0.5 -8 a6 6 0 0 1 11.5 -1.5 a4.5 4.5 0 0 1 1 9.5 H17" {...p} /><path d="M12 20 V12 M9 14.5 L12 11.5 L15 14.5" {...p} /></>,
    play: <><rect x={3.5} y={4.5} width={17} height={15} rx={2.5} {...p} /><path d="M10 9 L15 12 L10 15 Z" {...p} /></>,
    diamond: <><path d="M12 3.5 L20.5 12 L12 20.5 L3.5 12 Z" {...p} /><path d="M12 8 L16 12 L12 16 L8 12 Z" {...p} /></>,
    curve: <><path d="M4 19 C10 19 12 5 20 5" {...p} /><circle cx={4} cy={19} r={1.6} {...p} /><circle cx={20} cy={5} r={1.6} {...p} /></>,
    swap: <><path d="M4 8 H18 M15 5 L18 8 L15 11" {...p} /><path d="M20 16 H6 M9 13 L6 16 L9 19" {...p} /></>,
    film: <><rect x={3.5} y={5} width={17} height={14} rx={2} {...p} /><path d="M7.5 5 V19 M16.5 5 V19 M3.5 9.5 H7.5 M3.5 14.5 H7.5 M16.5 9.5 H20.5 M16.5 14.5 H20.5" {...p} /></>,
    frames: <><rect x={3} y={7} width={11} height={7} rx={1.2} {...p} /><rect x={15.5} y={5} width={5.5} height={10} rx={1.2} {...p} /><rect x={7} y={15.5} width={6} height={6} rx={1.2} {...p} /></>,
    export: <><path d="M12 14 V3.5 M8 7.5 L12 3.5 L16 7.5" {...p} /><path d="M5 12 V19 a1.5 1.5 0 0 0 1.5 1.5 H17.5 a1.5 1.5 0 0 0 1.5 -1.5 V12" {...p} /></>,
    doc: <><path d="M6 3.5 H14 L19 8.5 V20.5 H6 Z" {...p} /><path d="M14 3.5 V8.5 H19 M9 12.5 H16 M9 16.5 H14" {...p} /></>,
    wave: <path d="M3 12 H5 M7 8 V16 M10 5 V19 M13 9 V15 M16 6.5 V17.5 M19 10 V14 M21 12 H21.5" {...p} />,
    palette: <><path d="M12 3.5 a8.5 8.5 0 1 0 0 17 c1.5 0 2 -1 1.5 -2.2 c-0.6 -1.3 0.2 -2.8 1.8 -2.8 H18 a2.5 2.5 0 0 0 2.5 -2.5 C20.5 7 16.7 3.5 12 3.5 Z" {...p} /><circle cx={8} cy={10.5} r={1.2} {...p} /><circle cx={12} cy={7.5} r={1.2} {...p} /><circle cx={16} cy={10} r={1.2} {...p} /></>,
    sliders: <><path d="M5 7 H19 M5 12 H19 M5 17 H19" {...p} /><circle cx={9} cy={7} r={2} fill="#fff" {...{ stroke: p.stroke, strokeWidth: p.strokeWidth }} /><circle cx={15} cy={12} r={2} fill="#fff" {...{ stroke: p.stroke, strokeWidth: p.strokeWidth }} /><circle cx={11} cy={17} r={2} fill="#fff" {...{ stroke: p.stroke, strokeWidth: p.strokeWidth }} /></>,
  };
  return <g transform={`translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})`}>{body[k]}</g>;
};

/** text placed by its ink-left edge and baseline */
const T: React.FC<{ x: number; y: number; s: string; size: number; w: number; fill: string; family?: string; track?: number; opacity?: number }> =
  ({ x, y, s, size, w, fill, family = F.ui, track = 0, opacity = 1 }) => (
    <text x={x + ink(s, w, size, family, track).l} y={y} fontFamily={family} fontWeight={w} fontSize={size} letterSpacing={track} fill={fill} opacity={opacity}>{s}</text>
  );

const Node: React.FC<{ x: number; y: number; t: string; s: string; icon?: IconKind; pin?: boolean }> = ({ x, y, t, s, icon, pin }) => (
  <g>
    <rect x={x} y={y} width={358} height={126} rx={11} fill="#FDFDFE" stroke="#ECEEF2" strokeWidth={1} filter="url(#s2-node-sh)" />
    {pin ? <g transform={`translate(${x + 34} ${y + 35})`}><Pinwheel size={25} glow={false} /></g> : icon && <Icon k={icon} cx={x + 34} cy={y + 35} size={25} color={C.blue} sw={2} />}
    <T x={x + 59} y={y + 42} s={t} size={20.5} w={600} fill="#22272E" />
    <Icon k="sliders" cx={x + 324} cy={y + 34} size={22} color="#5A6170" sw={1.7} />
    <rect x={x + 21} y={y + 63} width={321} height={1} fill="#E8EAEE" />
    <T x={x + 21} y={y + 102} s={s} size={20.5} w={400} fill="#B4B9C1" />
  </g>
);

const ArrowR: React.FC<{ x0: number; x1: number; y: number }> = ({ x0, x1, y }) => (
  <g><path d={`M${x0} ${y} H${x1 - 7}`} stroke={C.blue} strokeWidth={2.6} strokeLinecap="round" /><path d={`M${x1 - 9} ${y - 6} L${x1} ${y} L${x1 - 9} ${y + 6} Z`} fill={C.blue} /></g>
);
const ArrowD: React.FC<{ x: number; y0: number; y1: number; p?: number }> = ({ x, y0, y1, p = 1 }) => {
  const ye = lerp(y0, y1, p);
  return (
    <g>
      <path d={`M${x} ${y0} V${Math.max(y0 + 0.5, Math.min(ye, y1 - 7))}`} stroke={C.blue} strokeWidth={2.6} strokeLinecap="round" />
      {p > 0.6 && <path d={`M${x - 6} ${ye - 9} L${x} ${ye} L${x + 6} ${ye - 9} Z`} fill={C.blue} opacity={clamp01((p - 0.6) / 0.4)} />}
    </g>
  );
};

/** rounded-rect outline as a path starting at the top-left corner and running clockwise */
const RIM = (() => {
  const x0 = PX, y0 = PY, x1 = PX + PW, y1 = PY + PH, r = PR;
  return `M${x0 + r} ${y0} H${x1 - r} A${r} ${r} 0 0 1 ${x1} ${y0 + r} V${y1 - r} A${r} ${r} 0 0 1 ${x1 - r} ${y1} H${x0 + r} A${r} ${r} 0 0 1 ${x0} ${y1 - r} V${y0 + r} A${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
})();

const Panel: React.FC<{ g: number }> = ({ g }) => {
  // travelling rim light: an 18/27 dash moving one lap per 27 frames; its trailing end passes the top-left corner at 159, 186, 213
  const off = 159 - g;
  const navX: number[] = [];
  let nx = 1011;
  for (const s of NAV) { navX.push(nx); nx += ink(s, 400, 20.5, F.ui).l + ink(s, 400, 20.5, F.ui).r + 33.5; }
  const tabX: { x: number; ix: number }[] = [];
  let tx = 1021;
  for (const [s] of TABS) { const w = ink(s, 500, 20.5, F.ui).l + ink(s, 500, 20.5, F.ui).r; tabX.push({ x: tx, ix: tx + w + 22 }); tx += w + 12 + 20 + 33; }
  const wordW = ink("WKConversions", 700, 1, F.head, -0.02).r + ink("WKConversions", 700, 1, F.head, -0.02).l;
  const wordSize = Math.min(30, 160 / wordW);
  const dg = kf(g, [[199, 0.04], [200, 0.33], [201, 0.62], [202, 0.7], [203, 1]]);
  // the lit dash with soft ends: four stacked dashes, each a little shorter and centred on the same span
  const lit = (stroke: string, op: number, sw: number, filter?: string) => [0, 1, 2, 3].map((k) => (
    <path key={`${stroke}${k}`} d={RIM} fill="none" pathLength={27} strokeDasharray={`${18 - 0.6 * k} ${9 + 0.6 * k}`} strokeDashoffset={off - 0.3 * k}
      stroke={stroke} strokeOpacity={op / 4} strokeWidth={sw} style={filter ? { filter } : undefined} />
  ));
  return (
    <svg width={PW} height={PH} viewBox={`${PX} ${PY} ${PW} ${PH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <clipPath id="s2-panel-clip"><path d={RIM} /></clipPath>
        <filter id="s2-node-sh" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx={0} dy={4} stdDeviation={7} floodColor="#0B1D33" floodOpacity={0.06} /></filter>
      </defs>
      <g clipPath="url(#s2-panel-clip)">
        <rect x={PX} y={PY} width={PW} height={PH} fill="#F5F6F9" />
        <rect x={PX} y={PY} width={SIDE - PX} height={PH} fill="#0A0F19" />
        <rect x={SIDE} y={PY} width={PW} height={159 - PY} fill="#FCFCFD" />
        <rect x={SIDE} y={159} width={PW} height={60} fill="#FEFEFE" />
        <rect x={SIDE} y={159} width={PW} height={1} fill="#EEF0F3" />
        <rect x={SIDE} y={218.5} width={PW} height={1} fill="#ECEEF2" />
        {/* sidebar */}
        <path d={WKC_PATH} fill="#FFFFFF" transform={`translate(661 ${110 - (60 / WKC_VIEW.w) * WKC_VIEW.h / 2}) scale(${60 / WKC_VIEW.w})`} />
        <T x={729} y={110 + 0.3638 * wordSize} s="WKConversions" size={wordSize} w={700} fill="#FFFFFF" family={F.head} track={-0.02 * wordSize} />
        <T x={677} y={193} s="Library" size={16.5} w={500} fill="#4B5361" />
        {ROWS.map(([s, ic], i) => {
          const cy = 234 + 53.7 * i;
          return (
            <g key={s}>
              {ic && <path d={`M${678} ${cy - 4.5} L${682.5} ${cy} L${678} ${cy + 4.5}`} fill="none" stroke="#3A4250" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />}
              {ic && <Icon k={ic} cx={710} cy={cy} size={21} color="#AEB5C0" sw={1.7} />}
              <T x={735} y={cy + 7.4} s={s} size={20} w={500} fill="#AEB5C0" />
            </g>
          );
        })}
        {/* top nav + tabs */}
        {NAV.map((s, i) => <T key={s} x={navX[i]} y={123} s={s} size={20.5} w={400} fill="#3A3F47" />)}
        {TABS.map(([s, ic], i) => (
          <g key={s}>
            <T x={tabX[i].x} y={202.5} s={s} size={20.5} w={500} fill={i === 0 ? "#151A22" : "#2E343D"} />
            <Icon k={ic} cx={tabX[i].ix} cy={196} size={21} color="#4A515C" sw={1.6} />
          </g>
        ))}
        <rect x={1011} y={216} width={tabX[0].ix + 12 - 1011} height={2.4} fill={C.blueText} />
        {/* canvas: the production pipeline */}
        {NODES.map((n) => <Node key={n.t} {...n} />)}
        <ArrowR x0={1388} x1={1422} y={318} /><ArrowR x0={1815} x1={1849} y={318} />
        <ArrowR x0={1388} x1={1422} y={513} /><ArrowR x0={1815} x1={1849} y={513} />
        <ArrowD x={1191} y0={400} y1={432} />
        {g >= 198 && <Node {...NODE_G} pin />}
        {g >= 199 && <ArrowD x={1191} y0={595} y1={627} p={dg} />}
      </g>
      {/* glowing rim and its travelling light */}
      <path d={RIM} fill="none" stroke="#B4C9E4" strokeWidth={3.4} />
      {lit("#3F8CE8", 0.47, 44, "blur(14px)")}
      {lit("#7DB8FF", 0.66, 13, "blur(4px)")}
      {lit("#DCEBFF", 1.6, 3.8)}
    </svg>
  );
};

// ---------- cursor: the reference's measured tip + wing vertices, mapped onto the shared Pointer by an affine ----------
type V = [number, number];
const curFrames = (() => {
  // per frame: tip T, and wing vectors u, v (relative to T) ordered so that the map keeps orientation (det > 0)
  const raw = CUR.map((r) => {
    const T: V = [r[0], r[1]];
    let a: V = [r[2] - r[0], r[3] - r[1]], b: V = [r[4] - r[0], r[5] - r[1]];
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 4) { // edge-on: give the sliver a little width
      const L = Math.hypot(a[0], a[1]), px = -a[1] / L, py = a[0] / L;
      b = [a[0] - px * 8, a[1] - py * 8]; a = [a[0] + px * 8, a[1] + py * 8];
    }
    if (a[0] * b[1] - a[1] * b[0] < 0) [a, b] = [b, a];
    const m: V = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const h = Math.atan2(-m[1], -m[0]);
    return { T, a, b, h };
  });
  // unwrap the heading
  for (let i = 1; i < raw.length; i++) { while (raw[i].h - raw[i - 1].h > Math.PI) raw[i].h -= 2 * Math.PI; while (raw[i].h - raw[i - 1].h < -Math.PI) raw[i].h += 2 * Math.PI; }
  const rot = (p: V, t: number): V => [p[0] * Math.cos(t) - p[1] * Math.sin(t), p[0] * Math.sin(t) + p[1] * Math.cos(t)];
  const loc = raw.map((r) => ({ a: rot(r.a, -r.h), b: rot(r.b, -r.h) }));
  const keep = (f: number) => (f >= 193 && f <= 204) || (f >= 208 && f <= 213);
  return raw.map((r, i) => {
    const f = A0 + i;
    let h = r.h, a = loc[i].a, b = loc[i].b;
    if (!keep(f) && i > 0 && i < raw.length - 1 && !keep(f - 1) && !keep(f + 1)) {
      h = (raw[i - 1].h + 2 * r.h + raw[i + 1].h) / 4;
      const sm = (k: "a" | "b"): V => [(loc[i - 1][k][0] + 2 * loc[i][k][0] + loc[i + 1][k][0]) / 4, (loc[i - 1][k][1] + 2 * loc[i][k][1] + loc[i + 1][k][1]) / 4];
      a = sm("a"); b = sm("b");
    }
    const u = rot(a, h), v = rot(b, h);
    // Pointer local: tip (0,0), wings (100,40) and (40,100)
    const c1: V = [(100 * u[0] - 40 * v[0]) / 8400, (100 * u[1] - 40 * v[1]) / 8400];
    const c2: V = [(100 * v[0] - 40 * u[0]) / 8400, (100 * v[1] - 40 * u[1]) / 8400];
    return { T: r.T, m: [c1[0], c1[1], c2[0], c2[1], r.T[0], r.T[1]], h };
  });
})();

const Cursor: React.FC<{ g: number }> = ({ g }) => {
  const c = curFrames[Math.max(0, Math.min(curFrames.length - 1, g - A0))];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformOrigin: "0 0", transform: `matrix(${c.m.map((v) => v.toFixed(5)).join(",")})`,
      filter: "drop-shadow(0 0 7px rgba(141,192,255,0.5))" }}>
      <Pointer x={0} y={0} h={100} />
    </div>
  );
};

// ---------- the dropped card (screen space, measured rects) ----------
const GROW: [number, number, number, number][] = [
  [1034, 644, 168, 99], [1012, 622, 280, 150], [998, 608, 378, 189], [984, 597, 462, 219], [976, 590, 528, 242], [970, 585, 584, 258],
  [966, 580, 628, 273], [962, 578, 668, 284], [958, 576, 699, 292], [956, 574, 726, 298], [954, 574, 747, 304], [952, 573, 766, 309],
  [951, 573, 783, 312], [950, 573, 796, 315], [948, 573, 808, 318], [946, 573, 820, 320], [946, 573, 826, 321], [946, 573, 830, 321],
];
const SHRINK_W = [830, 824, 812, 792, 765, 724, 666, 579, 465, 399]; // 188..197, uniform scale about (1010, 711)
const PAY_X = [1082, 1079, 1077, 1075, 1070, 1067, 1065, 1061, 1057, 1055, 1053, 1051, 1050, 1048, 1047, 1047, 1046, 1044, 1043, 1043]; // 168..187
const PAY_Y = [677, 677, 675, 672, 671, 672, 673, 675, 676, 676, 676, 676, 676, 675, 675, 675, 675, 675, 675, 675];

const Card: React.FC<{ g: number }> = ({ g }) => {
  if (g < 169 || g > 197) return null;
  if (g === 169) return <div style={{ position: "absolute", left: 1060, top: 690, width: 150, height: 90, borderRadius: "50%", background: "rgba(63,140,232,0.35)", filter: "blur(18px)" }} />;
  let x: number, y: number, w: number, h: number, k = 1;
  if (g <= 187) [x, y, w, h] = GROW[g - 170];
  else { [x, y, w, h] = [946, 573, 830, 321]; k = SHRINK_W[g - 188] / 830; }
  const tOp = kf(g, [[173, 0], [174, 0.25], [175, 0.4], [176, 0.55], [177, 0.7], [178, 0.8], [179, 0.9], [180, 1]]);
  const tDx = kf(g, [[174, 45], [175, 42], [176, 33], [177, 28], [178, 24], [179, 19], [180, 14], [181, 12], [182, 9], [183, 5], [184, 3], [185, 1.5], [186, 0]]);
  const sOp = kf(g, [[176, 0], [177, 0.15], [178, 0.35], [179, 0.5], [180, 0.65], [181, 0.8], [182, 0.9], [183, 1]]);
  const sDx = kf(g, [[177, 48], [178, 44], [179, 36], [180, 30], [181, 23], [182, 17], [183, 11], [184, 6], [185, 2], [186, 0]]);
  const half = kf(g, [[177, 0], [178, 43], [179, 115], [180, 175], [181, 250], [182, 261], [183, 276], [184, 300], [185, 318], [186, 330]]);
  const icOp = kf(g, [[180, 0], [181, 0.3], [182, 0.55], [183, 0.8], [184, 1]]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, background: "linear-gradient(160deg, #4A95EC 0%, #3F8CE8 55%, #3684E2 100%)",
      boxShadow: "18px 51px 45px rgba(63,140,232,0.24)", overflow: "hidden", transformOrigin: `${1010 - x}px ${711 - y}px`, transform: `scale(${k})` }}>
      <svg width={830} height={321} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <text x={160.5 + tDx + ink("Explainer scene", 600, 41, F.ui).l} y={115.5} fontFamily={F.ui} fontWeight={600} fontSize={41} fill="#F4F8FF" opacity={tOp}>Explainer scene</text>
        {half > 0 && <rect x={429 - half} y={163.5} width={2 * half} height={3} fill="#FFFFFF" opacity={0.85} />}
        <text x={85.5 + sDx + ink("Drop in your product story", 400, 36, F.ui).l} y={229.5} fontFamily={F.ui} fontWeight={400} fontSize={36} fill="#FFFFFF" opacity={0.8 * sOp}>Drop in your product story</text>
        <g opacity={0.32 * icOp}><Icon k="diamond" cx={750} cy={102} size={46} color="#FFFFFF" sw={1.8} /></g>
      </svg>
    </div>
  );
};

const Payload: React.FC<{ g: number }> = ({ g }) => {
  if (g >= 198) return null;
  let x: number, y: number, sc = 1, r = 0;
  if (g < 168) {
    const c = curFrames[g - A0];
    x = c.T[0] + 6; y = c.T[1] - 6;
    r = (c.h * 180) / Math.PI * 0.35;
  } else if (g <= 187) {
    x = PAY_X[g - 168]; y = PAY_Y[g - 168];
    sc = kf(g, [[172, 1], [174, 1.15], [176, 1.42], [178, 1.42], [181, 1.14], [185, 1]]);
    r = 300 * EASE(clamp01((g - 172) / 13));
  } else {
    const k = SHRINK_W[g - 188] / 830;
    x = 1010 + k * (1043 - 1010); y = 711 + k * (675 - 711); sc = k; r = 300;
  }
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${y}) rotate(${r}) scale(${sc})`}><Pinwheel size={64} /></g>
    </svg>
  );
};

// ---------- neon lines (corners of a huge chamfered frame, world space) ----------
const Neon: React.FC<{ g: number }> = ({ g }) => {
  const a1 = kf(g, [[168, 0], [170, 0.35], [173, 0.78], [176, 1]]);
  const a2 = kf(g, [[197, 0], [198, 0.45], [200, 1]]);
  const lines: [string, number][] = [["M-700 963 L0 981 L120 984 L168 986 L568 1486", a1], ["M1501 -557 L1808 -37.5 L2098.5 -65.5 L2700 -123.5", a2]];
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {lines.map(([d, a], i) => a > 0 && (
        <g key={i} opacity={a} fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={d} stroke="#3F8CE8" strokeOpacity={0.45} strokeWidth={26} style={{ filter: "blur(10px)" }} />
          <path d={d} stroke="#5A9EF0" strokeOpacity={0.7} strokeWidth={9} style={{ filter: "blur(3px)" }} />
          <path d={d} stroke="#9CCBFF" strokeWidth={3.6} />
        </g>
      ))}
    </svg>
  );
};

// ---------- the text column ----------
const Words: React.FC<{ g: number }> = ({ g }) => {
  const al = [at(A_EXPLAIN, A0, g), at(A_ENGAGE, A0, g), at(A_CONVERT, A0, g)];
  const mean = al[0];
  const d = g <= 167 ? clamp01((1 - mean) / 0.2) : 0;
  const lo = clamp01(mean - 0.13 * d), hi = clamp01(mean + 0.05 * d);
  const dx = [g <= 147 ? -7 : 0, g === 149 ? -15 : g === 150 ? -3 : 0, g === 151 ? -12 : g === 152 ? -2 : 0];
  const sc0 = g <= 147 ? 1.01 : 1;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="s2-explain" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#FFFFFF" stopOpacity={lo} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={hi} /></linearGradient>
      </defs>
      {WORDS.map((wd, i) => {
        if (al[i] <= 0) return null;
        const m = ink(wd.t, wd.w, FS, F.head, TR);
        const fill = i === 0 && g <= 167 ? "url(#s2-explain)" : "#FFFFFF";
        return (
          <g key={wd.t} transform={`translate(${INK_LEFT + dx[i]} ${wd.base}) scale(${i === 0 ? sc0 : 1})`}>
            <text x={m.l} y={0} fontFamily={F.head} fontWeight={wd.w} fontSize={FS} letterSpacing={TR} fill={fill} fillOpacity={i === 0 && g <= 167 ? 1 : al[i]}>{wd.t}</text>
          </g>
        );
      })}
    </svg>
  );
};

export const ShotA: React.FC<{ g: number }> = ({ g }) => {
  const s = at(CAM_S, A0, g), tx = at(CAM_TX, A0, g), ty = at(CAM_TY, A0, g);
  const cam = `translate(${tx}px, ${ty}px) scale(${s})`;
  const ramp = clamp01((g - 150) / 35);
  const bg = `rgb(${lerp(5, 8, ramp)}, ${lerp(12, 17, ramp)}, ${lerp(22, 30, ramp)})`;
  const pt = `translate(${at(P_TX, A0, g)}px, ${at(P_TY, A0, g)}px) scale(${at(P_S, A0, g)}) rotateX(${at(P_RX, A0, g)}deg) rotateY(${at(P_RY, A0, g)}deg) rotateZ(${at(P_RZ, A0, g)}deg)`;
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 760px 640px at 0px 1080px, rgba(22,52,104,${0.42 * ramp + 0.12}), rgba(22,52,104,0) 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 820px 720px at 260px 560px, rgba(14,34,68,${0.32 * ramp}), rgba(14,34,68,0) 100%)` }} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: cam }}><Neon g={g} /></div>
      <div style={{ position: "absolute", inset: 0, perspective: "3300px", perspectiveOrigin: "960px 540px" }}>
        <div style={{ position: "absolute", left: PX, top: PY, width: PW, height: PH, transformOrigin: `${960 - PX}px ${540 - PY}px`, transform: pt }}>
          <Panel g={g} />
        </div>
      </div>
      <Card g={g} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: cam }}><Words g={g} /></div>
      <Payload g={g} />
      <Cursor g={g} />
    </AbsoluteFill>
  );
};
