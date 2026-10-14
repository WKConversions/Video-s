// Segment 5, shot 1 (frames 530-578): the 3D "Export" pill, the glossy cursor's tumbling fly-in, click and half-turn
// exit, the stadium ripple rings with their speed streaks, the halo shockwave and the colour swirl (spec/seg5.md §2).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, clamp01, lerp } from "./lib";
import { Pointer } from "./kit";
import { Field, ZoomBlur, tab } from "./seg5_util";
import { BG1_STATIC, BG1_SWIRL } from "./seg5_data";

// ---- button (T1): face 758 x 275 at scale 1 (aspect 2.76), centre y 541 ----
const FW = 758, FH = 275;
/** [frame, true centre x, scale, rotateY] fitted (perspective 1600) to the reference face's per-frame bbox (T1) */
const BTN: number[][] = [
  [530, 966, 0.494, 39.5], [531, 966, 0.634, 32], [532, 966, 0.714, 27.2], [533, 966, 0.758, 24], [534, 965.5, 0.798, 21.8], [535, 965.5, 0.831, 19.6],
  [536, 965.5, 0.865, 17.9], [537, 965.5, 0.884, 16.3], [538, 965.5, 0.906, 14.8], [539, 965, 0.919, 13.4], [540, 964.5, 0.938, 12.2], [541, 964, 0.946, 11],
  [542, 963.5, 0.958, 9.9], [543, 963, 0.968, 8.8], [544, 962, 0.974, 7.6], [545, 961, 0.98, 6.4], [546, 959.5, 0.984, 5], [547, 958, 0.987, 3.7],
  [548, 957, 0.99, 2.6], [549, 957, 0.99, 2.3], [550, 957, 0.989, 2], [551, 957, 0.98, 1.5], [552, 956.5, 0.957, 1], [553, 957, 0.981, 0.5], [554, 957, 0.996, 0],
  [555, 957, 1.008, 0], [556, 957, 1.013, 0], [557, 957, 1.021, 0], [559, 957.5, 1.022, 0], [560, 958, 1.026, 0], [562, 958, 1.025, 0],
  [563, 958, 1.024, 0], [564, 958, 1.021, 0], [565, 958, 1.017, 0], [566, 959, 1.011, 0], [567, 959, 1.005, 0], [568, 959, 0.995, 0], [569, 959, 0.991, 0],
  [570, 960, 0.982, 0], [571, 960, 0.97, 0], [572, 960, 0.955, 0], [573, 960, 0.939, 0], [574, 960, 0.922, 0], [575, 960, 0.898, 0], [576, 960, 0.867, 0],
  [577, 960, 0.826, 0], [578, 960, 0.757, 0],
];
const DEPTH = 100;

const Button: React.FC<{ g: number }> = ({ g }) => {
  const [cx, s, ry] = tab(g, BTN);
  const rx = (ry / 42) * 6;
  const layers = [];
  for (let d = DEPTH; d >= 1; d -= 2) {
    const back = d === DEPTH;
    layers.push(
      <div key={d} style={{ position: "absolute", inset: 0, borderRadius: FH / 2, background: "#F2F7FE", transform: `translateZ(${-d}px)`,
        boxShadow: back ? `0 0 0 1.5px ${C.blueText}` : undefined }} />,
    );
  }
  return (
    <div style={{ position: "absolute", left: cx - FW / 2, top: 541 - FH / 2, width: FW, height: FH, transformStyle: "preserve-3d",
      transform: `perspective(1600px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${s})` }}>
      {layers}
      <div style={{ position: "absolute", inset: 0, borderRadius: FH / 2, background: "linear-gradient(180deg, #4A95EC 0%, #3A86E2 100%)", transform: "translateZ(0.5px)",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 121, lineHeight: 1, color: C.white, letterSpacing: 0, whiteSpace: "nowrap" }}>Export</div>
      </div>
    </div>
  );
};

// ---- cursor (T2): centroid track, true scale, rotateY (tumble in, half-turn out) ----
/** [frame, centroid x, centroid y, scale, rotateY deg, blur px] */
const CUR: number[][] = [
  [530, 1105, 387, 0.37, 180, 2.5], [531, 1175, 430, 0.5, 222, 2], [532, 1212, 453, 0.6, 262, 0.5], [533, 1217, 496, 0.64, 272, 0],
  [534, 1218, 534, 0.68, 283, 0], [535, 1213, 566, 0.72, 297, 0], [536, 1201, 584, 0.75, 308, 0], [537, 1189, 598, 0.77, 320, 0],
  [538, 1184, 601, 0.79, 327, 0], [539, 1176, 614, 0.81, 334, 0], [540, 1159, 630, 0.85, 344, 0], [541, 1146, 638, 0.89, 351, 0],
  [542, 1132, 641, 0.92, 355, 0], [543, 1118, 640, 0.95, 357.5, 0], [544, 1108, 637, 0.98, 359, 0], [545, 1102, 632, 1, 360, 0],
  [546, 1100, 627, 1, 360, 0], [547, 1103, 624, 1, 360, 0], [548, 1109, 628, 0.97, 360, 0], [549, 1111, 634, 0.91, 360, 0],
  [550, 1109, 639, 0.85, 360, 0], [551, 1110, 644, 0.9, 360, 0], [552, 1114, 642, 0.96, 362, 0], [553, 1125, 632, 0.99, 370, 0],
  [554, 1144, 617, 1, 382, 0], [555, 1174, 600, 1, 395, 0], [556, 1213, 580, 1, 408, 0], [557, 1257, 559, 1, 420, 0],
  [558, 1301, 541, 1, 431, 0], [559, 1346, 527, 1, 440, 0], [560, 1389, 513, 1, 448, 0], [561, 1430, 497, 1, 455, 0],
  [562, 1468, 482, 1, 470, 0], [563, 1502, 466, 1, 485, 0], [564, 1532, 451, 1, 500, 0], [565, 1560, 437, 1, 510, 0],
  [566, 1584, 423, 1, 520, 0], [567, 1604, 411, 1, 528, 0], [568, 1620, 400, 1, 535, 0], [569, 1632, 392, 1, 540, 0],
  [570, 1637, 388, 1, 540, 0], [571, 1641, 384, 1, 540, 0], [572, 1647, 383, 1, 540, 0], [573, 1653, 384, 1, 540, 0],
  [574, 1655, 384, 0.98, 540, 0], [575, 1648, 382, 0.955, 540, 0], [576, 1634, 381, 0.92, 540, 0], [577, 1609, 382, 0.865, 540, 0],
  [578, 1560, 386, 0.76, 540, 0],
];
/** extra in-plane lean while it tumbles in edge-on (the reference leans it like a backslash) */
const LEAN: number[][] = [[530, 0], [531, 8], [532, 18], [533, 20], [534, 20], [535, 16], [536, 12], [537, 8], [538, 5], [540, 2], [542, 0]];
// the shared Pointer (tip at 0,0, 100 units) mapped onto the reference's arrow (tip, right wing, bottom wing at frame 546)
const M = "matrix(1.5095, 0.0857, -0.1238, 1.6357, 0, 0)";
const CEN = [50, 63]; // centroid of the dark body relative to the tip, px at scale 1
const CDEPTH = 18;

const Cursor: React.FC<{ g: number }> = ({ g }) => {
  const [x, y, s, ry, blur] = tab(g, CUR);
  const body = (z: number, key: string, full: boolean) => (
    <div key={key} style={{ position: "absolute", left: 0, top: 0, transform: `translateZ(${z}px) translate(${-CEN[0]}px, ${-CEN[1]}px) ${M}`, transformOrigin: "0 0" }}>
      {full ? <Pointer x={0} y={0} h={100} blur={blur} /> : (
        <svg width={100} height={100} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M0 0 L100 40 L54 54 L40 100 Z" fill="#11131C" stroke="#11131C" strokeWidth={2.2} strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
  const mids = [];
  for (let k = 1; k < 40; k++) mids.push(body(CDEPTH / 2 - (CDEPTH * k) / 40, `m${k}`, false));
  const rz = -16 * (1 - Math.cos((ry * Math.PI) / 180)) / 2; // the mirrored pose stands its long edge upright
  const [lean] = tab(g, LEAN);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transformOrigin: "0 0",
      transform: `translate(${x}px, ${y}px) perspective(1400px) rotateZ(${rz + lean}deg) rotateY(${ry}deg) scale(${s})` }}>
      {body(-CDEPTH / 2, "back", true)}
      {mids}
      {body(CDEPTH / 2, "front", true)}
    </div>
  );
};

// ---- ripple rings (T3) and their top-run speed streaks (measured per frame on the reference) ----
const RING_CX = 959, RING_CY = 541;
const BIRTH = [550.0, 552.9, 555.6, 558.4];
const HH: number[][] = [ // [frame, A, B, C, D] half-heights; 0 = not born
  [550, 141, 0, 0, 0], [551, 163, 0, 0, 0], [552, 181, 0, 0, 0], [553, 196, 148, 0, 0], [554, 211, 169, 0, 0], [555, 226, 184, 0, 0],
  [556, 238, 199, 155, 0], [557, 253, 214, 173, 0], [558, 266, 227, 188, 0], [559, 281, 242, 202, 160], [560, 295, 254, 217, 176],
  [561, 308, 269, 230, 191], [562, 322, 283, 244, 205], [563, 338, 298, 256, 218], [564, 352, 311, 271, 232], [565, 366, 325, 284, 245],
  [566, 379, 337, 296, 258], [567, 393, 350, 308, 270], [568, 405, 363, 321, 283], [569, 417, 376, 333, 295], [570, 429, 388, 344, 306],
  [571, 440, 399, 355, 316], [572, 449, 407, 365, 326], [573, 457, 415, 374, 335], [574, 463, 422, 381, 343], [575, 466, 425, 385, 348],
  [576, 463, 424, 385, 349], [577, 455, 419, 379, 344], [578, 431, 395, 359, 332],
];
const hhOf = (g: number, k: number) => {
  const b = BIRTH[k];
  if (g < b) return 0;
  const first = HH.find((r) => r[k + 1] > 0 && r[0] >= b + 0.5)!;
  if (g <= first[0]) return lerp(141, first[k + 1], (g - b) / (first[0] - b));
  return tab(g, HH.filter((r) => r[k + 1] > 0))[k];
};
/** right-hand top segment [frame, x0, x1] (sweeps right and dies) and the long left streak [frame, x0, x1] */
const SEG_R: number[][][] = [
  [[551, 760, 1290], [552, 811, 1305], [553, 817, 1341], [554, 824, 1349], [555, 853, 1392], [556, 868, 1428], [557, 915, 1452], [558, 976, 1480], [559, 1026, 1515],
    [560, 1103, 1551], [561, 1164, 1567], [562, 1250, 1584], [563, 1370, 1617], [564, 1511, 1636], [565, 1584, 1680], [566, 1690, 1700]],
  [[553, 700, 1260], [554, 772, 1288], [555, 811, 1321], [556, 792, 1354], [557, 807, 1370], [558, 836, 1400], [559, 899, 1441], [560, 929, 1456], [561, 981, 1493],
    [562, 1039, 1515], [563, 1114, 1546], [564, 1191, 1563], [565, 1277, 1599], [566, 1367, 1629], [567, 1478, 1655], [568, 1572, 1680], [569, 1690, 1700]],
  [[556, 720, 1280], [557, 785, 1302], [558, 775, 1335], [559, 782, 1358], [560, 813, 1389], [561, 841, 1414], [562, 899, 1443], [563, 952, 1464], [564, 1000, 1492],
    [565, 1058, 1525], [566, 1131, 1549], [567, 1209, 1574], [568, 1294, 1598], [569, 1384, 1625], [570, 1476, 1651], [571, 1571, 1671], [572, 1680, 1690]],
  [[559, 666, 1278], [560, 755, 1310], [561, 778, 1346], [562, 782, 1369], [563, 818, 1394], [564, 861, 1422], [565, 909, 1445], [566, 959, 1470], [567, 1009, 1495],
    [568, 1075, 1520], [569, 1153, 1544], [570, 1233, 1569], [571, 1308, 1593], [572, 1397, 1608], [573, 1479, 1635], [574, 1575, 1644], [575, 1650, 1660]],
];
const SEG_L: number[][][] = [
  [[560, 330, 335], [561, 315, 365], [562, 289, 639], [563, 259, 765], [564, 233, 829], [565, 200, 932], [566, 178, 1031], [567, 148, 1119], [568, 120, 1218], [569, 98, 1330],
    [570, 75, 1450], [571, 52, 1568], [572, 35, 1678], [573, 27, 1718], [574, 23, 1775], [575, 24, 1823], [576, 25, 1864], [577, 49, 1844], [578, 104, 1799]],
  [[562, 350, 355], [563, 339, 382], [564, 319, 630], [565, 290, 710], [566, 261, 788], [567, 235, 879], [568, 210, 960], [569, 184, 1064], [570, 160, 1149],
    [571, 140, 1260], [572, 121, 1365], [573, 103, 1465], [574, 95, 1567], [575, 79, 1682], [576, 85, 1775], [577, 111, 1749], [578, 139, 1757]],
  [[565, 370, 380], [566, 348, 611], [567, 324, 660], [568, 297, 741], [569, 271, 816], [570, 248, 909], [571, 223, 983], [572, 204, 1079], [573, 188, 1179],
    [574, 176, 1273], [575, 167, 1364], [576, 161, 1453], [577, 169, 1547], [578, 200, 1585]],
  [[566, 430, 440], [567, 409, 483], [568, 381, 557], [569, 355, 624], [570, 335, 693], [571, 313, 782], [572, 291, 836], [573, 267, 936], [574, 252, 1012],
    [575, 246, 1103], [576, 239, 1184], [577, 248, 1270], [578, 270, 1321]],
];
const segAt = (g: number, rows: number[][]): [number, number, number] | null => {
  if (g < rows[0][0] || g > rows[rows.length - 1][0]) return null;
  const [x0, x1] = tab(g, rows);
  const age = g - rows[0][0], left = rows[rows.length - 1][0] - g;
  return [x0, x1, clamp01(age / 1.5) * clamp01(left / 1.5)];
};

const Rings: React.FC<{ g: number }> = ({ g }) => {
  const cyanT = clamp01((g - 562) / 6);
  const glow = `rgb(${Math.round(lerp(230, 170, cyanT))}, ${Math.round(lerp(240, 220, cyanT))}, ${Math.round(lerp(253, 252, cyanT))})`;
  const parts: React.ReactNode[] = [], defs: React.ReactNode[] = [];
  const cw = lerp(4.5, 13, clamp01((g - 558) / 16)), gw = cw + lerp(8, 18, clamp01((g - 562) / 12));
  const stroke = (d: string, a: number, key: string, paint = "#FFFFFF") => a > 0.01 && (
    <g key={key}>
      <path d={d} fill="none" stroke={paint === "#FFFFFF" ? glow : paint} strokeWidth={gw} strokeOpacity={a * 0.55} filter="url(#s5rglow)" />
      <path d={d} fill="none" stroke={paint} strokeWidth={cw} strokeOpacity={a} filter="url(#s5rsoft)" />
    </g>
  );
  const fadeGrad = (id: string, x0: number, x1: number, fin: number, fout: number) => {
    const len = Math.max(1, x1 - x0);
    defs.push(
      <linearGradient key={id} id={id} gradientUnits="userSpaceOnUse" x1={x0} y1={0} x2={x1} y2={0}>
        <stop offset={0} stopColor="#fff" stopOpacity={fin > 0 ? 0 : 1} /><stop offset={Math.min(0.45, fin / len)} stopColor="#fff" stopOpacity={1} />
        <stop offset={1 - Math.min(0.45, fout / len)} stopColor="#fff" stopOpacity={1} /><stop offset={1} stopColor="#fff" stopOpacity={0} />
      </linearGradient>,
    );
    return `url(#${id})`;
  };
  for (let k = 0; k < 4; k++) {
    const hh = hhOf(g, k);
    if (hh <= 0) continue;
    const age = g - BIRTH[k], fade = clamp01(age / 2);
    const L = hh * 1.76, x0 = RING_CX - L, x1 = RING_CX + L, yt = RING_CY - hh, yb = RING_CY + hh;
    const lStart = SEG_L[k][0][0], arcOn = clamp01((g - lStart + 1) / 6);
    const aBot = fade * lerp(0.5, 0.8, clamp01(age / 12));
    const aL = fade * arcOn * (k === 3 ? 0.6 : 0.85), aR = aL * 0.45;
    parts.push(stroke(`M${x0} ${yb} H${x1}`, aBot, `b${k}`));
    parts.push(stroke(`M${x0} ${yb} A${hh} ${hh} 0 0 1 ${x0} ${yt}`, aL, `l${k}`));
    parts.push(stroke(`M${x1} ${yt} A${hh} ${hh} 0 0 1 ${x1} ${yb}`, aR, `r${k}`));
    // the long streak: the top run continuing out of the left arc, its head at the measured x1
    const sl = g >= lStart ? tab(g, SEG_L[k])[1] : 0;
    if (sl > x0 + 2) parts.push(stroke(`M${x0 - 1} ${yt} H${sl}`, fade * arcOn * 0.95, `t${k}`, fadeGrad(`s5gl${k}`, x0 - 1, sl, 0, 80)));
    // the short segment sweeping right over the button and dying at the right end
    const sr = segAt(g, SEG_R[k]);
    if (sr && sr[1] - sr[0] > 2) parts.push(stroke(`M${sr[0]} ${yt} H${sr[1]}`, sr[2] * fade * 0.62, `u${k}`, fadeGrad(`s5gr${k}`, sr[0], sr[1], 60, 60)));
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <filter id="s5rglow" filterUnits="userSpaceOnUse" x={-400} y={-400} width={2720} height={1880}><feGaussianBlur stdDeviation={5} /></filter>
        <filter id="s5rsoft" filterUnits="userSpaceOnUse" x={-400} y={-400} width={2720} height={1880}><feGaussianBlur stdDeviation={1.2} /></filter>
        {defs}
      </defs>
      {parts}
    </svg>
  );
};

// ---- halo shockwave behind the button (536-562): a soft ring, its bright lobe travelling counter-clockwise ----
const HALO_PHI: number[][] = [[536, 134], [537, 112], [538, 90], [540, 46], [542, 2], [544, -42], [546, -86], [548, -130], [550, -136], [552, -140], [556, -142]];
const Halo: React.FC<{ g: number }> = ({ g }) => {
  if (g < 535.5 || g > 562) return null;
  const env = clamp01((g - 535.5) / 2) * (1 - clamp01((g - 556) / 6));
  const [phi] = tab(g, HALO_PHI);
  const lobe = Array.from({ length: 25 }, (_, i) => {
    const a = i * 15, d = ((a - 90 - phi) * Math.PI) / 180; // conic 0deg = up; phi 0 = right (screen angles, y down)
    const v = 0.22 + 0.78 * Math.pow((1 + Math.cos(d)) / 2, 0.8);
    return `rgba(0,0,0,${v.toFixed(3)}) ${a}deg`;
  }).join(", ");
  const ring = "radial-gradient(circle at 852px 518px, rgba(255,255,255,0) 430px, rgba(255,255,255,0.006) 450px, rgba(255,255,255,0.016) 465px, rgba(255,255,255,0.040) 480px, rgba(255,255,255,0.086) 495px, rgba(255,255,255,0.162) 510px, rgba(255,255,255,0.266) 525px, rgba(255,255,255,0.377) 540px, rgba(255,255,255,0.466) 555px, rgba(255,255,255,0.500) 570px, rgba(255,255,255,0.466) 585px, rgba(255,255,255,0.377) 600px, rgba(255,255,255,0.266) 615px, rgba(255,255,255,0.162) 630px, rgba(255,255,255,0.086) 645px, rgba(255,255,255,0.040) 660px, rgba(255,255,255,0.016) 675px, rgba(255,255,255,0.006) 690px, rgba(255,255,255,0) 720px)";
  const mask = `conic-gradient(from 0deg at 852px 518px, ${lobe})`;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: env * 0.6, background: "radial-gradient(circle at 852px 518px, rgba(20,40,90,0.035) 0px, rgba(20,40,90,0.035) 470px, rgba(20,40,90,0) 530px)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: env, background: ring, maskImage: mask, WebkitMaskImage: mask }} />
    </>
  );
};

export const Shot1: React.FC<{ g: number }> = ({ g }) => {
  const sw = g >= 554 ? Math.min(24, Math.floor(g - 554)) : -1;
  const blur = g >= 576.5 ? lerp(0.006, 0.014, clamp01(g - 577)) : 0;
  return (
    <AbsoluteFill style={{ background: "#D9E9FC", overflow: "hidden" }}>
      {sw < 0 ? <Field a={BG1_STATIC} /> : <Field a={BG1_SWIRL[sw]} b={BG1_SWIRL[Math.min(24, sw + 1)]} t={g - 554 - sw} />}
      <Halo g={g} />
      <ZoomBlur amt={blur} n={6} render={() => (
        <>
          <Rings g={g} />
          <ZoomBlur amt={g < 531.5 ? 0.06 : 0} n={6} cx={952} cy={541} render={() => <Button g={g} />} />
          <Cursor g={g} />
        </>
      )} />
    </AbsoluteFill>
  );
};
