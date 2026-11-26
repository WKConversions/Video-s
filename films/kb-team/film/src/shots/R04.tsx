// Package R04 (reference f265-f384; cut f295), rebuilt from the measured reference.
//   I f265-f294  the prompt box RESTS (only the typing and the pointer move); the pointer sits at the send button's lower
//                right corner, moves onto the button on f284-f288 and clicks on f288
//   J f295-f311  three black glyphs (4 frames each), then two tool tiles in the centre (f307, f311)
//   K f312-f335  a wall of tool tiles appears around the centre tile (f312-f318), the card pops on f318 and fills up,
//                the wall shrinks away and fades (f327-f333), the cyan dots pop and leave
//   L f336-f384  the card alone: its three rows are carousels that swap on f343, f351, f360, f367; on f375 the card
//                turns into a wireframe with the cut-out tools, then a dotted grid opens (f380, f382)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Pkg, Sfx } from "../types";
import { Hand } from "../hand";
import { C, F, Msg, abs, clamp, ease, kf, refN, rs, typed, useFonts } from "../kit";

const F0 = 265;
const at = (n: number) => rs(n - F0);
const GROUND = "#EEEEEE";
const INKY = "#16202E";

// ================================================================ I: the message and the click
const TEXT = "Can you help us automate our follow-ups and keep the CRM up to date?";
const CPS = 16, T0 = -(TEXT.length - 12) / CPS;                         // the last 12 characters are typed in the shot (done by f284)
const REST = { x: 1490, y: 688 };                                       // the arrow's tip: the lower right corner of the send button
const TARGET = { x: 1462, y: 632 };                                     // on the button, where the click lands
const CLICK = at(288);                                                  // the fingertip is deepest on f288
const HS = 115, PX = -6, PY = -46;
const clampF = (v: number) => Math.max(0, Math.min(1, v));
const I: React.FC<{ t: number }> = ({ t }) => {
  const n = refN(t, F0);
  const press = clampF(kf(n, [[287, 0], [288, 1], [290, 1], [292, 0.55], [294, 0.25]]));
  const KX: [number, number][] = [[265, REST.x + 5], [272, REST.x], [276, REST.x - 3], [281, REST.x - 3], [283.5, REST.x - 3], [288, TARGET.x]];
  const KY: [number, number][] = [[265, REST.y], [270, REST.y], [276, REST.y - 3], [280, REST.y], [283.5, REST.y + 2], [288, TARGET.y]];
  const x = kf(n, KX), y = kf(n, KY);
  const vx = (kf(n + 0.5, KX) - kf(n - 0.5, KX)) * 24, vy = (kf(n + 0.5, KY) - kf(n - 0.5, KY)) * 24;
  const lean = (v: number) => Math.max(-20, Math.min(20, v / 65));
  return (
    <AbsoluteFill style={{ background: C.ui }}>
      <Msg x={405} y={400} w={1110} text={typed(TEXT, t, T0, CPS)} press={press} />
      <Hand x={x + PX * press} y={y + PY * press} size={HS} tiltY={lean(vx) - 10 * press} tiltX={-lean(vy) * 0.6 - 40 * press} rot={Math.max(-10, Math.min(10, vx / 120 + vy / 280)) - 9 * press} press={press} />
    </AbsoluteFill>
  );
};

// ================================================================ the tool tiles
type TD = { img: string; bg?: string; fill?: boolean; pad?: number };
const TI: Record<string, TD> = {
  pipedrive: { img: "pipedrive", bg: C.ink }, makecom: { img: "makecom-removebg-preview", bg: "#FFFFFF", pad: 0.22 }, odoo: { img: "odoo-1", bg: "#FFFFFF", pad: 0.16 },
  vite: { img: "vite-removebg-preview", bg: "#FFFFFF", pad: 0.2 }, supabase: { img: "supabase", bg: "#FFFFFF", pad: 0.22 }, n8n: { img: "n8n-logo2", bg: "#FFFFFF", pad: 0.1 },
  apollo: { img: "apollo-io", fill: true }, claude: { img: "claude-removebg-preview", bg: "#FFFFFF", pad: 0.2 }, gyg: { img: "getyourguide", fill: true },
  resend: { img: "resend", bg: C.ink, pad: 0.14 }, pg: { img: "postgresql", bg: "#FFFFFF", pad: 0.2 }, zen: { img: "zenchef-app-b2b", fill: true },
  ts: { img: "typescript", fill: true }, dd: { img: "datadog-1", fill: true }, tan: { img: "tanstack", bg: "#FFFFFF", pad: 0.1 },
};
/** a tool tile: `ph` makes it a "photo": a coloured backdrop with the tool's logo card standing on it, as the reference's product photos */
const Tl: React.FC<{ k: string; w: number; h: number; r?: number; ph?: string; style?: React.CSSProperties }> = ({ k, w, h, r = 8, ph, style }) => {
  const d = TI[k], p = d.pad ?? 0;
  const q = ph && d.fill ? 0.16 : p;
  const logo = (ww: number, hh: number) => <Img src={staticFile(`tools/${d.img}.png`)} style={abs(ww * q, hh * q, ww * (1 - 2 * q), hh * (1 - 2 * q), { objectFit: d.fill && !ph ? "cover" : "contain" })} />;
  if (ph) {
    const s = Math.min(w, h) * 0.62;
    return (
      <div style={{ position: "relative", width: w, height: h, borderRadius: r, overflow: "hidden", background: ph, flex: "none", ...style }}>
        <div style={abs((w - s) / 2, (h - s) / 2, s, s, { borderRadius: s * 0.2, overflow: "hidden", background: d.fill ? "#fff" : d.bg, boxShadow: "0 6px 16px rgba(20,28,40,.22)" })}>{logo(s, s)}</div>
      </div>
    );
  }
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: r, overflow: "hidden", background: d.fill ? "#fff" : d.bg, flex: "none", ...style }}>{logo(w, h)}</div>
  );
};
const perf = (_w: number, _h: number): React.CSSProperties => ({ boxShadow: "0 0 0 2px rgba(255,255,255,.55), 0 0 0 3px rgba(22,32,46,.10)" });

// ================================================================ the centre tile (J, K): shrinks a little with every swap
const CENTRE: [number, number, string, number, number, string][] = [[307, 311, "pipedrive", 254, 232, "#9FB2D6"], [311, 315, "supabase", 231, 228, "#CDB79A"], [315, 318, "makecom", 220, 214, "#8C9BB4"]];

// ================================================================ the wall around it (K)
type Pc = { k?: string; ph?: string; x: number; y: number; w: number; h: number; rot?: number; f: number; o?: number; ghost?: boolean };
const WALL: Pc[] = [
  { x: 1732, y: 200, w: 200, h: 500, f: 312, o: 0.2, ghost: true }, { x: 1352, y: 608, w: 192, h: 194, k: "supabase", ph: "#D8A9AE", f: 312, o: 0.5 },
  { x: 230, y: 0, w: 640, h: 360, f: 314, o: 0.22, ghost: true }, { x: 452, y: 342, w: 234, h: 180, k: "n8n", ph: "#C9C9CC", f: 314 },
  { x: 448, y: -24, w: 198, h: 200, k: "tan", ph: "#9C9C9F", f: 316 }, { x: 1542, y: 802, w: 282, h: 282, k: "apollo", ph: "#EFE8BF", f: 316 }, { x: 1582, y: 608, w: 84, h: 104, k: "pg", ph: "#DACBB7", f: 316 },
  { x: 440, y: 790, w: 540, h: 300, f: 316, o: 0.3, ghost: true },
  { x: 40, y: 176, w: 206, h: 250, k: "pipedrive", ph: "#5B2A38", f: 317 }, { x: 1454, y: 200, w: 212, h: 232, k: "gyg", ph: "#EFCBC6", f: 317 }, { x: 1454, y: -30, w: 212, h: 172, k: "resend", ph: "#8C8379", f: 317 },
  { x: 248, y: -30, w: 200, h: 220, k: "ts", ph: "#C9DAEE", f: 318 }, { x: 172, y: 626, w: 250, h: 430, k: "vite", ph: "#E9AFC0", rot: -5, f: 318 },
  { x: 1152, y: 0, w: 280, h: 392, f: 318, o: 0.22, ghost: true }, { x: 1836, y: 806, w: 120, h: 280, k: "dd", ph: "#D9CFE6", f: 318 },
];
const Wall: React.FC<{ n: number }> = ({ n }) => {
  const sc = 1 - 0.07 * ease.inOut(clamp((n - 326) / 8)), fade = 1 - clamp((n - 328.5) / 4.5);
  if (fade <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${sc.toFixed(4)})`, opacity: fade, willChange: "transform" }}>
      {WALL.map((p, i) => {
        const a = ease.out(clamp((n - p.f + 0.5) / 3));
        if (a <= 0) return null;
        const cx = p.x + p.w / 2 - 960, cy = p.y + p.h / 2 - 540, d = 0.07 * (1 - a);
        const o = (p.o ?? 1) * clamp(a * 2);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(${(-cx * d).toFixed(2)}px, ${(-cy * d).toFixed(2)}px, 0)`, opacity: o, willChange: "transform" }}>
            {p.ghost
              ? <div style={abs(p.x, p.y, p.w, p.h, { background: "#DADAD8", borderRadius: 6, filter: "blur(5px)" })} />
              : <div style={abs(p.x, p.y, p.w, p.h, { transform: `rotate(${p.rot ?? 0}deg)`, boxShadow: "0 8px 24px rgba(23,43,68,.12)", borderRadius: 8, filter: p.o && p.o < 0.9 ? "blur(1.5px)" : undefined })}><Tl k={p.k!} w={p.w} h={p.h} ph={p.ph} style={perf(p.w, p.h)} /></div>}
          </div>
        );
      })}
    </div>
  );
};

// ================================================================ the cyan dots (K)
// [x, y (centres), pops on frame, leaves on frame]
const DOTS: [number, number, number, number][] = [[190, 166, 320, 332], [132, 134, 321, 333], [429, 613, 322, 335.3], [131, 950, 323, 334.5], [1408, 836, 325, 335.5], [1549, 668, 326, 332]];

// ================================================================ the card (K, L)
const CW = 384, CH = 738, CX = 768, CY = 171, MID = 190;
const ROWS: { items: string[]; ph: string[]; ar: number; gap: number; label: string[] }[] = [
  { items: ["pipedrive", "makecom", "claude", "vite"], ph: ["#2E3138", "#8C9BB4", "#5E6B4A", "#E4B9C4"], ar: 1.03, gap: 48, label: ["NEW LEAD", "01"] },
  { items: ["supabase", "n8n", "apollo", "claude"], ph: ["#BCD2E8", "#8E8F93", "#E4DAC3", "#B9B0A4"], ar: 0.9, gap: 48, label: ["FOLLOW-UP", "02"] },
  { items: ["gyg", "resend", "pg", "zen"], ph: ["#C9473F", "#6B655E", "#CDBB9E", "#A8A8AC"], ar: 1.09, gap: 84, label: ["CRM UPDATED", "03"] },
];
const ic = (children: React.ReactNode, s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={INKY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
const sw = (a: number, b: number, u: number) => ease.inOut(clamp((u - a) / (b - a)));
const Card: React.FC<{ n: number }> = ({ n }) => {
  const scale = kf(n, [[331, 1.03], [332, 1.0]]);
  const R1 = kf(n, [[318, 274], [321, 270], [324, 218], [327, 160], [329, 140], [331, 138], [343, 135], [345, 149]]);
  const R3 = n < 343 ? R1 + 396 : 531;
  const R2b = n < 343 ? R1 + 198 : kf(n, [[343, 333], [345, 350]]);
  const hh = [R2b - R1, R3 - R2b, 101];
  const tops = [R1, R2b, R3];
  const pos = [
    1 + sw(0, 1, (n - 343) / 2), 2 - sw(0, 1, (n - 349.5) / 3.5) - sw(0, 1, (n - 360) / 3), 1 + sw(0, 1, (n - 367) / 3),
  ];
  const slideIn = [1 - sw(0, 1, (n - 329.5) / 2.5), 1 - sw(0, 1, (n - 330.5) / 2.5), 1 - sw(0, 1, (n - 331.5) / 2.5)];
  const rowOn = [318, 321, 327.5];
  const showText2 = n >= 323, showMeta = n >= 327;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${scale.toFixed(4)})`, transformOrigin: "960px 540px", willChange: "transform" }}>
      <div style={abs(CX, CY, CW, CH, { background: "#fff", borderRadius: 34, overflow: "hidden", boxShadow: "0 18px 50px rgba(23,43,68,.10)" })}>
        <div style={abs(22, 20, 14, 18)}>{ic(<path d="M15 5l-7 7 7 7" />, 18)}</div>
        {showText2 && <div style={abs(62, 20, 200, 18, { fontSize: 13, fontWeight: 600, letterSpacing: 0.2, color: INKY, lineHeight: "18px" })}>AUTOMATION</div>}
        {showText2 && <div style={abs(308, 17, 22, 22)}>{ic(<><path d="M6 17h12l-1.5-2V11a4.5 4.5 0 0 0-9 0v4z" /><path d="M10 20h4" /></>, 19)}</div>}
        {showMeta && <div style={abs(341, 17, 22, 22)}>{ic(<><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>, 19)}</div>}
        <div style={abs(24, 72, 330, 64, { fontSize: 24, fontWeight: 500, letterSpacing: -0.3, lineHeight: "30px", color: INKY, whiteSpace: "nowrap" })}>FOLLOW-UPS{showText2 && <><br />RUN BY ITSELF</>}</div>
        {ROWS.map((row, ri) => {
          if (n < rowOn[ri] - 0.01) return null;
          const h = hh[ri], w = h * row.ar, pitch = w + row.gap;
          const showPeek = n >= [329.5, 330.5, 331.5][ri];
          return (
            <React.Fragment key={ri}>
              {showMeta && <div style={abs(18, tops[ri] - 2, 100, 30, { fontSize: 11.5, fontWeight: 700, lineHeight: "13px", color: INKY, letterSpacing: 0.1 })}>{row.label[0]}<br />{row.label[1]}</div>}
              {row.items.map((k, j) => {
                const rel = j - pos[ri];
                if (!showPeek && Math.abs(j - Math.round(pos[ri])) > 0 && ri < 3) return null;
                const peekOff = (rel < 0 ? -1 : 1) * 70 * slideIn[ri] * (Math.abs(rel) > 0.9 ? 1 : 0);
                const cx = MID + rel * pitch + peekOff;
                if (cx + w / 2 < -4 || cx - w / 2 > CW + 4) return null;
                return <div key={j} style={abs(cx - w / 2, tops[ri], w, h)}><Tl k={k} w={w} h={h} r={4} ph={row.ph[j]} /></div>;
              })}
            </React.Fragment>
          );
        })}
        <div style={abs(12, 676, 48, 48, { borderRadius: 24, background: "#DCDCDC" })}><div style={abs(0, 0, 48, 48)}>{ic(<path d="M12 4v16M4 12h16" />, 48)}</div></div>
        {n >= 323 && <div style={abs(71, 676, 48, 48, { borderRadius: 10, background: "#DCDCDC" })}><div style={abs(12, 12, 24, 24)}>{ic(<><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></>, 24)}</div></div>}
        {n >= 327 && (
          <div style={abs(129, 672, 237, 54, { borderRadius: 27, background: "#DCDCDC" })}>
            {n >= 328 && <div style={abs(6, 8, 38, 38, { borderRadius: 19, background: "#fff" })}><div style={abs(9, 9, 20, 20)}>{ic(<><rect x="6" y="11" width="12" height="8" rx="2" /><path d="M9 11V8a3 3 0 0 1 6 0" /></>, 20)}</div></div>}
            {n >= 328 && <div style={abs(58, 0, 170, 54, { fontSize: 19, fontWeight: 500, color: INKY, lineHeight: "54px", letterSpacing: -0.2, whiteSpace: "nowrap" })}>{n >= 344 ? "→ TEAM NOTIFIED" : "→"}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ================================================================ the wireframe (L, from f375)
const DOT = "1.5px dotted #A3A3A3";
const WIRE_L = 752, WIRE_R = 1176, WIRE_T = 154, WIRE_B = 926;
const Wire: React.FC<{ n: number }> = ({ n }) => {
  const stroke = "#9C9C9C";
  const label = (y: number, a: string, b: string) => <div style={abs(784, y, 120, 30, { fontSize: 11.5, fontWeight: 700, lineHeight: "13px", color: INKY })}>{a}<br />{b}</div>;
  return (
    <AbsoluteFill>
      <div style={abs(WIRE_L, WIRE_T, WIRE_R - WIRE_L, WIRE_B - WIRE_T, { border: DOT, boxSizing: "border-box", borderRadius: 2, opacity: n >= 382 ? 0 : 1 })} />
      {n >= 380 && n < 382 && <div style={abs(324, 150, 1278, 778, { border: DOT, boxSizing: "border-box" })} />}
      {n >= 382 && [311, 747, 1180, 1614].map((x) => <div key={x} style={abs(x - 1, 0, 0, 1080, { borderLeft: DOT })} />)}
      {n >= 382 && [142, 936].map((y) => <div key={y} style={abs(0, y - 1, 1920, 0, { borderTop: DOT })} />)}
      <div style={abs(WIRE_L + 36, 197, 44, 44, { borderRadius: 22, border: `1.5px solid ${stroke}`, boxSizing: "border-box" })} />
      <div style={abs(906, 197, 118, 44, { borderRadius: 22, border: `1.5px solid ${stroke}`, boxSizing: "border-box" })} />
      <div style={abs(1096, 197, 44, 44, { borderRadius: 22, border: `1.5px solid ${stroke}`, boxSizing: "border-box" })} />
      {label(300, "NEW LEAD", "01")}{label(488, "FOLLOW-UP", "02")}{label(700, "CRM UPDATED", "03")}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 563px", transform: `scale(${kf(n, [[375, 1], [379, 0.985], [382, 0.87], [383, 0.91]]).toFixed(4)}, ${kf(n, [[375, 1], [379, 1.025], [382, 0.983], [383, 1.068]]).toFixed(4)})`, willChange: "transform" }}>
        <div style={abs(810, 263, 300, 300)}><Tl k="claude" w={300} h={300} r={0} style={{ background: "transparent" }} /></div>
        <div style={abs(790, 440, 340, 340)}><Tl k="supabase" w={340} h={340} r={0} style={{ background: "transparent" }} /></div>
        <div style={abs(875, 668, 170, 170)}><Tl k="pg" w={170} h={170} r={0} style={{ background: "transparent" }} /></div>
      </div>
      <div style={abs(788, 846, 350, 42, { borderRadius: 21, border: `1.5px solid ${stroke}`, boxSizing: "border-box" })} />
    </AbsoluteFill>
  );
};

// ================================================================ the three black glyphs (J), heavy like the reference's
const Gl: React.FC<{ k: number; s: number }> = ({ k, s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="#262626" stroke="none">
    {k === 0 && <g><path d="M22 12 C46 22 58 36 58 48 C58 62 44 78 22 88" fill="none" stroke="#262626" strokeWidth="21" strokeLinejoin="round" /><rect x="64" y="72" width="30" height="17" rx="4" /></g>}
    {k === 1 && <g><rect x="38" y="6" width="25" height="90" rx="5" /><rect x="6" y="30" width="90" height="26" rx="5" /><path d="M24 96 L32 62 L44 62 L50 80 L56 62 L68 62 L76 96 L64 96 L58 78 L56 96 L44 96 L42 78 L36 96 Z" /><rect x="44" y="37" width="12" height="12" fill={GROUND} /></g>}
    {k === 2 && <g fill="none" stroke="#262626" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"><g><path d="M8 52 V92 H48" /><path d="M10 90 L40 60" /></g><g transform="rotate(180 50 50)"><path d="M8 52 V92 H48" /><path d="M10 90 L40 60" /></g></g>}
  </svg>
);

// ================================================================ J, K, L
const JKL: React.FC<{ t: number }> = ({ t }) => {
  const n = refN(t, F0);
  if (n >= 375) return <AbsoluteFill style={{ background: GROUND, fontFamily: F }}><Wire n={n} /></AbsoluteFill>;
  const gl = n < 299 ? 0 : n < 303 ? 1 : 2;                              // the three glyphs
  const ctr = CENTRE.find(([a, b]) => n >= a && n < b);
  return (
    <AbsoluteFill style={{ background: GROUND, fontFamily: F }}>
      {n < 307 && (() => {
        const S = [420, 339, 300][gl], c = [[52.5, 50.5], [51, 51], [50, 50]][gl];
        const sc = gl === 0 ? 1 : gl === 1 ? kf(n, [[299, 1.02], [300.5, 1]]) : kf(n, [[303, 1.0], [304, 0.9], [306, 0.91]]);
        const dx = gl === 0 ? kf(n, [[295, 8], [297, 0]]) : 0;
        return <div style={abs(960 - c[0] * S / 100 + dx, 540 - c[1] * S / 100, S, S, { transform: `scale(${sc.toFixed(4)})`, transformOrigin: `${c[0]}% ${c[1]}%` })}><Gl k={gl} s={S} /></div>;
      })()}
      {n >= 312 && <Wall n={n} />}
      {ctr && <div style={abs(960 - ctr[3] / 2, 540 - ctr[4] / 2, ctr[3], ctr[4], { boxShadow: "0 10px 30px rgba(23,43,68,.14)", borderRadius: 8, transform: `scale(${kf(n, [[ctr[0], 1.014], [ctr[0] + 2, 1]]).toFixed(4)})` })}><Tl k={ctr[2]} w={ctr[3]} h={ctr[4]} ph={ctr[5]} /></div>}
      {n >= 318 && <Card n={n} />}
      {DOTS.map(([x, y, a, b], i) => {
        const s = ease.out(clamp((n - a + 0.5) / 3)) * (1 - ease.in(clamp((n - b) / 1.4)));
        return s > 0.01 && n >= a - 0.5 ? <div key={i} style={abs(x - 23, y - 23, 46, 46, { borderRadius: 23, background: C.cyan, transform: `scale(${s.toFixed(3)})`, willChange: "transform" })} /> : null;
      })}
    </AbsoluteFill>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.ui }} />;
  return t < at(295) ? <I t={t} /> : <JKL t={t} />;
};
const sfx: Sfx[] = [
  { t: 0, kind: "type", note: "0.8 the end of the message" },
  { t: CLICK, kind: "click", note: "send (f288)" },
  { t: at(295), kind: "tick", note: "glyph 1" }, { t: at(299), kind: "tick", note: "glyph 2" }, { t: at(303), kind: "tick", note: "glyph 3" },
  { t: at(307), kind: "pop", note: "first tool tile" }, { t: at(311), kind: "pop", note: "second tool tile" },
  { t: at(313.5), kind: "swish", note: "the wall of tools appears" },
  { t: at(318), kind: "pop", note: "the card pops" },
  { t: at(327), kind: "swish", note: "the wall shrinks away" },
  { t: at(343), kind: "slide", note: "row 1 swaps" }, { t: at(350), kind: "slide", note: "row 2 swaps" },
  { t: at(360), kind: "slide", note: "row 2 swaps again" }, { t: at(367), kind: "slide", note: "row 3 swaps" },
  { t: at(375), kind: "thud", note: "the card turns into a wireframe" }, { t: at(380), kind: "swish", note: "the grid opens" },
];
export const PKG: Pkg = { id: "R04", Comp, sfx };
