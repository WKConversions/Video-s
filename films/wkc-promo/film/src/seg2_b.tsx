// Segment 2, shot B (frames 219–286): pastel WKC-blue gradient, "Or" with a dot leader typing out while the line pans
// left, a whip-cut along the leader into "just look incredible." with sparkles, the 3D sticker wobble and squeeze, and the
// next shot's glass brief pill zooming in around the line. Tracks are the reference's measurements (seg2.md §3).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Grain } from "./kit";
import { C, F } from "./lib";
import { SPARK, at, charX, ink, kf } from "./seg2_ink";

const FS = 152.5; // cap 111 px
const TR = -0.05 * FS;
const BASE = 594.5; // baseline at s = 1 (cap centre on y 539)
const CY = 539;
const PITCH = 40.35;
const DOT_R = 10.75, DOT_Y = 583; // leader dots: 21.5 px, centre y 583 at s = 1
const LINE = "just look incredible.";
const INK = C.ink;

// B1 (219..244): measured line scale, O-left ink edge and dots typed
const B1_S = [1.39, 1.3, 1.24, 1.22, 1.19, 1.17, 1.15, 1.13, 1.11, 1.1, 1.087, 1.078, 1.067, 1.058, 1.051, 1.043, 1.036, 1.03, 1.025, 1.02, 1.017, 1.013, 1.01, 1.006, 1.002, 1.0];
const B1_OL = [828, 843, 850, 854, 856, 858, 858, 856, 854, 850, 844, 838, 831, 822, 812, 800, 784, 768, 750, 729, 705, 676, 642, 602, 550, 482];
const B1_N = [0, 0, 1, 2, 3, 3, 4, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 20, 21, 23, 24, 26, 27, 28, 30, 31];
// B2 (245..264): the reference's ink-left of the word after the leader (decelerating pan)
const L_REF = [752.2, 708.4, 686.5, 670.3, 656.3, 645.3, 634.3, 625.3, 617.3, 609.3, 602.3, 596.3, 590.3, 584.3, 579.3, 575.3, 571.3, 566.3, 563.3, 559.3];
const REF_CENTRE_264 = 958.3; // (559.3 + 1357) / 2
const TYPED: Record<number, number> = { 248: 1, 249: 4, 250: 7, 251: 9, 252: 13, 253: 16 };
const mFirst = (g: number) => (g <= 245 ? 11 : g === 246 ? 7 : g === 247 ? 2 : 0);
const mMax = (g: number) => (g < 262 ? 999 : g === 262 ? 9 : g === 263 ? 4 : g === 264 ? 1 : -1);

// B3 per-glyph wobble pattern (rotation deg, y px, width) — "just look" leans and squeezes, "incredible." stays widest
const WOB: [number, number, number][] = [
  [-7, 4, 0.82], [4, 7, 0.84], [6, -2, 0.84], [5, 3, 0.86], [0, 0, 1],
  [-5, -4, 0.86], [4, 5, 0.86], [-4, -3, 0.88], [6, 2, 0.86], [0, 0, 1],
  [-3, -7, 1], [5, 3, 0.97], [-6, 1, 0.97], [4, -4, 0.98], [-3, 5, 0.97], [7, -3, 0.97], [-4, -7, 1], [3, 4, 0.98], [-5, -2, 1], [6, 4, 0.97], [0, -1, 1],
];

const Spark: React.FC<{ x: number; y: number; size: number; rot?: number; seed?: boolean }> = ({ x, y, size: sz, rot = 0, seed }) => {
  const size = seed ? sz : sz * 1.22;
  return (
  seed ? <circle cx={x} cy={y} r={size} fill="#FFFFFF" filter="url(#s2-spark)" /> :
    <g filter="url(#s2-spark)"><path d={SPARK} transform={`translate(${x} ${y}) rotate(${rot}) scale(${size / 2})`} fill="#FFFFFF" /></g>);
};

const stadium = (cx: number, cy: number, w: number, h: number) => {
  const r = h / 2, x0 = cx - w / 2 + r, x1 = cx + w / 2 - r;
  return `M${x0} ${cy - r} H${x1} A${r} ${r} 0 0 1 ${x1} ${cy + r} H${x0} A${r} ${r} 0 0 1 ${x0} ${cy - r} Z`;
};

const Pill: React.FC<{ g: number }> = ({ g }) => {
  if (g < 276) return null;
  const h = kf(g, [[276, 688], [277, 682], [278, 660], [279, 630], [280, 598], [281, 561], [282, 519], [283, 471], [284, 420], [285, 363], [286, 294]]);
  const w = 5.35 * h, cx = 958, cy = 535, r = h / 2;
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const band = kf(g, [[282, 0], [283, 0.3], [284, 0.8], [285, 1]]);
  const ins = 0.27 * h, insY = 0.042 * h;
  const grad = (id: string, st: [number, number][]) => (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x0} x2={x1} y1={0} y2={0}>
      {st.map(([o, a], i) => <stop key={i} offset={o} stopColor="#F4F9FF" stopOpacity={a} />)}
    </linearGradient>
  );
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        {grad("s2-pill-top", [[0, 0], [0.18, 0], [0.2, 0.9], [0.285, 0.9], [0.3, 0.12], [0.53, 0.12], [0.55, 0.9], [0.69, 0.9], [0.71, 0], [1, 0]])}
        {grad("s2-pill-bot", [[0, 0], [0.27, 0], [0.29, 0.35], [0.51, 0.35], [0.53, 0.9], [0.66, 0.9], [0.68, 0.1], [0.76, 0.1], [0.775, 0.7], [0.81, 0.7], [0.83, 0], [1, 0]])}
      </defs>
      {band > 0 && (
        <g opacity={band}>
          <path d={stadium(cx, cy, w, h)} fill="#FFFFFF" fillOpacity={0.05} />
          <path d={`${stadium(cx, cy, w, h)} ${stadium(cx, cy, w - 2 * ins, h - 2 * insY)}`} fillRule="evenodd" fill="#3F8CE8" fillOpacity={0.16} style={{ filter: "blur(2px)" }} />
          <path d={stadium(cx, cy, w - 2 * ins, h - 2 * insY)} fill="none" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={2.5} style={{ filter: "blur(1.5px)" }} />
          <path d={stadium(cx, cy, w, h)} fill="none" stroke="#8EC3FF" strokeOpacity={0.6} strokeWidth={14} style={{ filter: "blur(7px)" }} />
          <path d={stadium(cx, cy, w, h)} fill="none" stroke="#3F8CE8" strokeOpacity={0.6} strokeWidth={5} style={{ filter: "blur(1.5px)" }} />
        </g>
      )}
      <g fill="none" strokeWidth={3.5} strokeLinecap="round" style={{ filter: "blur(2.5px)" }}>
        <path d={`M${x0 + r} ${cy - r} H${x1 - r}`} stroke="url(#s2-pill-top)" opacity={kf(g, [[277, 0], [278, 1]])} />
        <path d={`M${x0 + r} ${cy + r} H${x1 - r}`} stroke="url(#s2-pill-bot)" opacity={kf(g, [[276, 0.6], [277, 1]])} />
        <path d={`M${x1 - r} ${cy - r} A${r} ${r} 0 0 1 ${x1 - r} ${cy + r} M${x0 + r} ${cy + r} A${r} ${r} 0 0 1 ${x0 + r} ${cy - r}`} stroke="#F4F9FF" strokeOpacity={0.5} />
      </g>
    </svg>
  );
};

export const ShotB: React.FC<{ g: number }> = ({ g }) => {
  // ---- metrics ----
  const om = ink("Or", 800, FS, F.head);
  const lm = ink(LINE, 700, FS, F.head, TR);
  const W = lm.l + lm.r;
  const xs = charX(LINE, 700, FS, F.head, TR);
  const shift = REF_CENTRE_264 - W / 2 - 559.3;

  // ---- ring ----
  const ringA = kf(g, [[225, 0], [226, 0.3], [228, 1], [244, 1], [244.5, 0], [251, 0], [252, 0.25], [256, 1], [280, 1], [286, 0]]);
  const rk = g < 245 ? [[226, 1014, 450, 686, 570], [230, 1014, 450, 686, 570], [234, 983, 528, 596, 507], [240, 855, 548, 653, 525], [244, 693, 558, 648, 525]]
    : [[252, 978, 533, 911, 510], [256, 978, 533, 911, 510], [260, 992, 522, 820, 520], [266, 972, 540, 900, 520], [272, 990, 540, 920, 520], [278, 936, 540, 830, 520], [286, 936, 540, 830, 520]];
  const ring = [1, 2, 3, 4].map((c) => kf(g, rk.map((r) => [r[0], r[c]] as [number, number])));

  // ---- the line ----
  let line: React.ReactNode;
  let rightShift = 0; // where our line's right end sits relative to the reference's (for the sparkles)
  let sxg = 1;
  if (g < 245) {
    const s = at(B1_S, 219, g), ol = at(B1_OL, 219, g), n = at(B1_N, 219, g);
    const d0 = 193; // first dot centre from the O's left ink edge (reference)
    const dots: React.ReactNode[] = [];
    for (let k = 0; k < n; k++) dots.push(<circle key={k} cx={d0 + PITCH * k} cy={DOT_Y} r={DOT_R} />);
    line = (
      <g transform={`translate(${ol} ${CY}) scale(${s}) translate(0 ${-CY})`} fontFamily={F.head} fontSize={FS} fill={INK}>
        <text x={om.l} y={BASE} fontWeight={800}>Or</text>
        <g fontWeight={800}>{dots}</g>
      </g>
    );
  } else {
    const L = (g <= 264 ? at(L_REF, 245, g) : L_REF[19]) + shift;
    const nT = g < 248 ? 0 : (TYPED[g] ?? 21);
    const mm = mMax(g);
    const dots: React.ReactNode[] = [];
    for (let m = mFirst(g); m <= mm; m++) {
      const u = -15.75 - PITCH * m;
      if (L + u < -40) break;
      dots.push(<circle key={m} cx={u} cy={DOT_Y} r={DOT_R} />);
    }
    // B3: 3D sticker type, wobble, squeeze and tilt
    const b3 = g >= 265;
    const amp = b3 ? 1.25 * kf(g, [[265, 0.25], [268, 0.6], [272, 0.85], [278, 1]]) * (1 + 0.18 * Math.sin((g - 265) * 0.7)) : 0;
    sxg = kf(g, [[264, 1], [265, 1.025], [266, 1.045], [268, 1.051], [271, 1.018], [274, 0.975], [277, 0.926], [280, 0.872], [283, 0.8], [286, 0.683]]);
    const syg = kf(g, [[264, 1], [266, 1.03], [268, 1.035], [271, 1.03], [274, 1.02], [277, 0.99], [280, 0.95], [283, 0.92], [286, 0.88]]);
    const tilt = kf(g, [[265, 0], [270, -1], [276, -2], [280, -3]]);
    const dlx = kf(g, [[264, 0], [266, 4], [268, 5], [271, 8.5], [274, 10], [277, 10.5], [280, 10], [283, 8.5], [286, 3.5]]);
    const ex = kf(g, [[264, 0], [265, 3], [266, 4.5], [270, 7.5], [276, 9], [282, 12]]);
    const ey = kf(g, [[264, 0], [265, 2], [266, 3], [270, 3], [276, 4.5]]);
    const lc = W / 2; // line centre in line coordinates (origin = ink-left)
    const glyph = (i: number, back: boolean) => {
      const ch = LINE[i];
      if (ch === " ") return null;
      const x = lm.l + xs[i];
      const adv = ink(ch, 700, FS, F.head).w;
      const cx = x + adv / 2;
      const [wr, wy, wn] = WOB[i];
      const nx = 1 - (1 - wn) * Math.min(1, amp);
      const ox = back ? (ex / 300) * (cx - lc) : 0, oy = back ? ey : 0;
      return (
        <text key={`${back ? "b" : "f"}${i}`} x={x} y={BASE}
          transform={b3 ? `translate(${ox} ${oy + wy * amp}) rotate(${wr * amp} ${cx} ${CY}) translate(${cx} 0) scale(${nx} 1) translate(${-cx} 0)` : undefined}
          fill={back ? "#13294A" : INK} stroke={b3 ? "#FFFFFF" : "none"} strokeWidth={back ? 3 : 5.5} strokeLinejoin="round" paintOrder="stroke">{ch}</text>
      );
    };
    const idx = Array.from({ length: nT }, (_, i) => i);
    line = (
      <g transform={`translate(${L + dlx} 0) translate(${lc} 555) rotate(${tilt}) scale(${sxg} ${syg}) translate(${-lc} -555)`} fontFamily={F.head} fontSize={FS}>
        <g fontWeight={800} fill={INK}>{dots}</g>
        <g fontWeight={700}>
          {b3 && idx.map((i) => glyph(i, true))}
          {idx.map((i) => glyph(i, false))}
        </g>
      </g>
    );
    rightShift = (W - 797.7) / 2;
  }

  // ---- sparkles (reference positions, moved with the end of our longer line) ----
  const sp: React.ReactNode[] = [];
  if (g >= 253) {
    const dx = rightShift * sxg;
    const tw = (ph: number) => 1 + 0.12 * Math.sin(g * 1.25 + ph);
    const s1x = kf(g, [[253, 1403], [254, 1416], [256, 1422], [258, 1416], [262, 1400], [266, 1419], [270, 1436], [274, 1418], [278, 1391], [282, 1353], [286, 1290]]) + dx;
    const s1y = kf(g, [[253, 468], [254, 492], [256, 486], [258, 485], [262, 480], [266, 476], [270, 459], [274, 453], [278, 447], [282, 450], [286, 470]]);
    const s1s = kf(g, [[254, 24], [255, 35], [256, 42], [258, 42], [262, 45], [266, 45], [270, 48], [278, 48], [282, 45], [286, 40]]);
    if (g === 253) sp.push(<Spark key="seed" x={s1x} y={s1y} size={6} seed />);
    else sp.push(<Spark key="s1" x={s1x} y={s1y} size={s1s * tw(0)} rot={6 * Math.sin(g * 0.5)} />);
    if (g >= 256) {
      const x = kf(g, [[256, 1443], [258, 1449], [262, 1440], [266, 1476], [270, 1512], [274, 1499], [278, 1472], [282, 1431], [286, 1344]]) + dx;
      const y = kf(g, [[256, 503], [258, 495], [262, 492], [266, 483], [270, 462], [274, 449], [278, 441], [282, 438], [286, 450]]);
      const s = kf(g, [[256, 10], [258, 18], [262, 24], [282, 24], [286, 20]]);
      sp.push(<Spark key="s3" x={x} y={y} size={s * tw(2.1)} rot={-5 * Math.sin(g * 0.6)} />);
    }
    if (g >= 260) {
      const x = kf(g, [[260, 1425], [262, 1427], [266, 1458], [270, 1485], [274, 1470], [278, 1440], [282, 1401], [286, 1319]]) + dx;
      const y = kf(g, [[260, 460], [262, 455], [266, 437], [270, 405], [274, 387], [278, 378], [282, 378], [286, 401]]);
      const s = kf(g, [[260, 12], [261, 21], [262, 27], [266, 27], [270, 30], [278, 30], [282, 27], [286, 24]]);
      sp.push(<Spark key="s2" x={x} y={y} size={s * tw(4.2)} rot={5 * Math.sin(g * 0.45)} />);
    }
  }

  const lift = kf(g, [[266, 0], [280, 0.22]]);
  return (
    <AbsoluteFill style={{ background: "#CFE0F3", overflow: "hidden" }}>
      <Img src={staticFile("seg2/pastel.png")} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />
      {lift > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 620px at 180px 120px, rgba(246,250,255,${lift}), rgba(246,250,255,0) 100%)` }} />}
      {ringA > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: ringA }}>
          <defs>
            <linearGradient id="s2-ring" gradientUnits="userSpaceOnUse" x1={ring[0] - ring[2]} x2={ring[0] + ring[2]} y1={0} y2={0}>
              <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.2} /><stop offset="0.2" stopColor="#FFFFFF" stopOpacity={0.13} />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.1} /><stop offset="0.8" stopColor="#FFFFFF" stopOpacity={0.26} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={0.42} />
            </linearGradient>
          </defs>
          <ellipse cx={ring[0]} cy={ring[1]} rx={ring[2]} ry={ring[3]} fill="none" stroke="url(#s2-ring)" strokeWidth={120} style={{ filter: "blur(26px)" }} />
        </svg>
      )}
      <Grain opacity={0.1} seed={3} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <filter id="s2-spark" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={8} result="b" />
            <feFlood floodColor="#FFFFFF" floodOpacity={1} /><feComposite in2="b" operator="in" result="glow" />
            <feGaussianBlur in="SourceAlpha" stdDeviation={3} result="b2" />
            <feFlood floodColor="#E2F0FF" floodOpacity={1} /><feComposite in2="b2" operator="in" result="fringe" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={1.4} result="w" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="fringe" /><feMergeNode in="w" /></feMerge>
          </filter>
        </defs>
        {line}
        {sp}
      </svg>
      <Pill g={g} />
    </AbsoluteFill>
  );
};
