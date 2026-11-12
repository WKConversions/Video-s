// h2o-water-coolers: "Downhill to the door" (../cases/h2o-water-coolers.md).
// A diagonal cascade: five channel tiles (top-left) shower messages onto a crooked pile beside a grey order sheet where a
// caret types one slow order; one message bounces off and drops away red. The K.B tile lands on the sheet, which turns
// into a Chatwoot inbox; the channels dock in its rail, the pile stretches into rows, a cyan AI line stamps each row with
// a 19 L bottle chip, the chips hop onto the route map (bottom-right). The tangled route string twangs taut (flourish),
// the van marker runs the loop, "~2 hours / saved per day" takes over the H2O card (top-right). Then everything unwinds
// back to the opening.
import React from "react";
import { Img, staticFile, Easing } from "remotion";
import { Frame, useT, seg, cyc, pop, popOut, clamp01, lerp, INOUT, OUT } from "../loop";
import { C, KBTile, ToolTile, SHADOW } from "../kb";

// ---------- brand ----------
const H2O = { sky: "#A0E2FF", skyDeep: "#7FD3F7", blue: "#005CBF", ink: "#0F172B" };
const IMG = (f: string) => staticFile("cases/h2o-water-coolers/" + f);

// ---------- clocks ----------
// TA: the message group (all messages are gone between 9.3 and 9.7 s), TB: everything else (all at rest round 1.0 s).
const TA = (t: number) => (t < 9.5 ? t + 10 : t);
const TB = (t: number) => (t < 1 ? t + 10 : t);
const fl = (t: number, ph: number, a = 6, p = 5) => a * Math.cos(2 * Math.PI * (t / p + ph));
const pulse = (t: number, at: number, dur: number) => { const u = clamp01((t - at) / dur); return Math.pow(Math.sin(Math.PI * u), 2); };

// ---------- layout ----------
const CARD = { x: 580, y: 286, w: 580, h: 450 }, HEAD = 64;
const MAP = { x: 1196, y: 530, w: 574, h: 442 }, MHEAD = 64;
const CLI = { x: 1236, y: 112, w: 534, h: 370 };
const TX = { x: 152, y: 808 };
const CH = [{ x: 226, y: 200 }, { x: 358, y: 166 }, { x: 490, y: 194 }, { x: 622, y: 162 }, { x: 754, y: 190 }];
const TILE = 104, BADGE = 50;
const ROWX = CARD.x + 92, ROWW = 470, ROWH = 62;
const rowTopL = (r: number) => HEAD + 12 + r * 72; // card-local
const RAIL_X = CARD.x + 43;
const PS = [{ x: 466, y: 600, r: -5 }, { x: 452, y: 550, r: 4 }, { x: 474, y: 500, r: -3 }, { x: 458, y: 450, r: 6 }];
const BW = 188, BH = 60;

// ---------- channels ----------
const CHAN = [
  { bg: "#25D366", dot: "#25D366" },
  { bg: H2O.blue, dot: H2O.blue },
  { bg: "#FF8A00", dot: "#FF8A00" },
  { bg: "linear-gradient(45deg,#0099FF 0%,#7B4BFF 55%,#FF5C87 100%)", dot: "#7B4BFF" },
  { bg: "radial-gradient(circle at 28% 108%,#FDD86A 0%,#FA7E1E 30%,#D62976 58%,#962FBF 78%,#4F5BD5 100%)", dot: "#D62976" },
];
const Glyph: React.FC<{ i: number; s: number }> = ({ i, s }) => {
  const st = { fill: "none", stroke: "#fff", strokeWidth: 2.8, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" style={{ display: "block" }}>
      {i === 0 && <>
        <path d="M20 7.5a12.5 12.5 0 0 0-10.8 18.8L7.5 32.5l6.4-1.7A12.5 12.5 0 1 0 20 7.5z" {...st} />
        <path d="M15.4 13.9c.4-.8 1-.9 1.4-.8l.9.1c.3 0 .6.2.7.5l1.1 2.7c.1.3 0 .7-.2.9l-.9 1c-.2.2-.2.5-.1.7.9 1.6 2.1 2.8 3.7 3.7.2.1.5.1.7-.1l1-.9c.3-.3.6-.3.9-.2l2.7 1.1c.3.1.5.4.5.7v.9c0 .5-.1 1-.8 1.4-1 .6-2.2.8-3.5.4-3.9-1.3-6.9-4.3-8.2-8.2-.4-1.3-.3-2.5.1-3.4z" fill="#fff" />
      </>}
      {i === 1 && <>
        <rect x="6" y="8" width="25" height="19" rx="3.5" {...st} />
        <path d="M6 13.8h25" {...st} />
        <path d="M23.5 20h10a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2h-4.6l-4.1 3v-3h-1.3a2 2 0 0 1-2-2V22a2 2 0 0 1 2-2z" fill="#fff" />
      </>}
      {i === 2 && <>
        <rect x="7" y="11" width="26" height="18" rx="3" {...st} />
        <path d="M8.5 13.2L20 21.6l11.5-8.4" {...st} />
      </>}
      {i === 3 && <>
        <path d="M20 7C12.8 7 7 12.4 7 19.2c0 3.8 1.8 7.2 4.7 9.4V33l4.3-2.4c1.3.4 2.6.5 4 .5 7.2 0 13-5.4 13-12.2S27.2 7 20 7z" fill="#fff" />
        <path d="M12.5 22.6l5.3-5.7 3 2.9 5.4-2.9-5.3 5.7-3-2.9z" fill="#7B4BFF" />
      </>}
      {i === 4 && <>
        <rect x="8" y="8" width="24" height="24" rx="7" {...st} />
        <circle cx="20" cy="20" r="5.6" {...st} />
        <circle cx="26.7" cy="13.3" r="1.8" fill="#fff" />
      </>}
    </svg>
  );
};
const ChanTile: React.FC<{ i: number; s: number; x: number; y: number; sc?: number }> = ({ i, s, x, y, sc = 1 }) => (
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: s * 0.26, background: CHAN[i].bg,
    boxShadow: SHADOW.tile, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sc})` }}>
    <Glyph i={i} s={s * 0.7} />
  </div>
);

// ---------- small glyphs ----------
const Bottle: React.FC<{ s: number; c: string; rib?: string }> = ({ s, c, rib = "rgba(255,255,255,0.6)" }) => (
  <svg width={s * 0.77} height={s} viewBox="0 0 20 26" style={{ display: "block" }}>
    <rect x="6.5" y="0" width="7" height="3" rx="1.2" fill={c} />
    <rect x="8" y="2.5" width="4" height="3.5" fill={c} />
    <rect x="2" y="5.5" width="16" height="20" rx="4.5" fill={c} />
    <path d="M3.6 12.5h12.8M3.6 18.5h12.8" stroke={rib} strokeWidth="1.6" />
  </svg>
);
const Check: React.FC<{ s: number; sc: number; style?: React.CSSProperties }> = ({ s, sc, style }) => (
  <div style={{ width: s, height: s, borderRadius: s, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center",
    transform: `scale(${Math.max(0, sc)})`, boxShadow: "0 4px 10px -4px rgba(41,58,81,0.45)", ...style }}>
    <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 12 12"><path d="M2.4 6.3l2.4 2.3 4.8-5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);
const Chatwoot: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" style={{ display: "block" }}>
    <circle cx="8" cy="8" r="8" fill="#2781F6" />
    <path d="M11.4172 11.4172H7.70831C5.66383 11.4172 4 9.75328 4 7.70828C4 5.66394 5.66383 4 7.70835 4C9.75339 4 11.4172 5.66394 11.4172 7.70828V11.4172Z" fill="#fff" />
  </svg>
);
const Van: React.FC<{ w: number }> = ({ w }) => <Img src={IMG("h2o-delivery.svg")} style={{ display: "block", width: w, height: w * 30.85 / 57 }} />;

// ---------- the route (map-local coordinates) ----------
type Pt = { x: number; y: number };
const D: Pt = { x: 88, y: 322 };
const PINS: Pt[] = [{ x: 140, y: 196 }, { x: 266, y: 146 }, { x: 402, y: 166 }, { x: 500, y: 256 }, { x: 390, y: 322 }];
const cr = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, s: number): Pt => {
  const s2 = s * s, s3 = s2 * s;
  const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3);
  return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) };
};
const N = 200;
const build = (knots: Pt[], closed: boolean) => {
  const n = knots.length, segs = closed ? n : n - 1, raw: Pt[] = [], kIdx: number[] = [];
  const get = (i: number) => (closed ? knots[((i % n) + n) % n] : knots[Math.max(0, Math.min(n - 1, i))]);
  for (let i = 0; i < segs; i++) { kIdx.push(raw.length); for (let j = 0; j < 60; j++) raw.push(cr(get(i - 1), get(i), get(i + 1), get(i + 2), j / 60)); }
  raw.push(closed ? knots[0] : knots[n - 1]); kIdx.push(raw.length - 1);
  const cum = [0];
  for (let i = 1; i < raw.length; i++) cum.push(cum[i - 1] + Math.hypot(raw[i].x - raw[i - 1].x, raw[i].y - raw[i - 1].y));
  const L = cum[cum.length - 1], kLen = kIdx.map((i) => cum[i]);
  const pts: Pt[] = [], segI: number[] = [], segF: number[] = [];
  let j = 0;
  for (let k = 0; k <= N; k++) {
    const target = (k / N) * L;
    while (j < cum.length - 2 && cum[j + 1] < target) j++;
    const f = (target - cum[j]) / Math.max(1e-6, cum[j + 1] - cum[j]);
    pts.push({ x: lerp(raw[j].x, raw[j + 1].x, f), y: lerp(raw[j].y, raw[j + 1].y, f) });
    let s = 0;
    while (s < kLen.length - 2 && kLen[s + 1] < target) s++;
    segI.push(s); segF.push(clamp01((target - kLen[s]) / Math.max(1e-6, kLen[s + 1] - kLen[s])));
  }
  const nrm = pts.map((p, k) => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(N, k + 1)], dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    return { x: -dy / l, y: dx / l };
  });
  const segLen = kLen.slice(1).map((v, i) => v - kLen[i]);
  return { pts, nrm, segI, segF, segLen, L, kLen };
};
const TAUT = build([D, ...PINS], true);
const TANGLE = build([D, { x: 248, y: 276 }, PINS[2], { x: 316, y: 300 }, PINS[0], { x: 216, y: 118 }, PINS[3], { x: 258, y: 306 },
  PINS[1], { x: 470, y: 158 }, PINS[4], { x: 206, y: 234 }, D], false);
const TW = 6.1; // the twang
const VAN0 = 6.45, VAN1 = 8.7;
const vanU = (tb: number) => seg(tb, VAN0, VAN1, INOUT);
const solve = (f: (x: number) => number, target: number, a: number, b: number) => { for (let x = a; x <= b; x += 1 / 600) if (f(x) >= target) return x; return b; };
const PASS = PINS.map((_, i) => solve(vanU, TAUT.kLen[i + 1] / TAUT.L, VAN0, VAN1));
const stringK = (tb: number) => (tb < 8.5 ? pop(tb, TW, { dur: 0.3, over: 0.1 }) : 1 - seg(tb, 8.95, 9.65, INOUT));
const stringPts = (t: number): Pt[] => {
  const tb = TB(t), k = stringK(tb), kc = clamp01(k), tau = tb - TW - 0.12;
  const A = tb < 8.5 && tau > 0 ? 15 * Math.exp(-tau / 0.24) * Math.sin(2 * Math.PI * 5.5 * tau) * clamp01(tau / 0.08) : 0;
  return TAUT.pts.map((p, i) => {
    const q = TANGLE.pts[i], n = TAUT.nrm[i], s = TAUT.segI[i], f = TAUT.segF[i];
    const vib = A * Math.sin(Math.PI * f) * (s % 2 ? 1 : -1) * Math.min(1.4, TAUT.segLen[s] / 150);
    const slack = (1 - kc) * 3.2 * Math.sin(2 * Math.PI * (t / 2.5) + i * 0.19);
    return { x: lerp(q.x, p.x, k) + n.x * (vib + slack), y: lerp(q.y, p.y, k) + n.y * (vib + slack) };
  });
};
const toD = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("");
const atU = (u: number): Pt => {
  const x = clamp01(u) * N, i = Math.min(N - 1, Math.floor(x)), f = x - i, a = TAUT.pts[i], b = TAUT.pts[i + 1];
  return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f) };
};

// ---------- the message timeline (TA) ----------
const SPAWN = [10.1, 10.55, 11.0, 11.45, 11.9];
const SLOT = [0, 1, 2, 3, 3], ROWOF = [0, 1, 2, -1, 3];
const ROWIN = (r: number) => 13.0 + 0.12 * r;
const NEWROW = 13.72; // the missed channel sends again, straight into row 4
const SCAN0 = 13.95, SCAN1 = 14.95;
const scanY = (ta: number) => lerp(rowTopL(0) - 10, rowTopL(4) + ROWH + 10, seg(ta, SCAN0, SCAN1, INOUT));
const CAP = [0, 1, 2, 3, 4].map((r) => solve(scanY, rowTopL(r) + ROWH / 2, SCAN0, SCAN1));
const DEP = (r: number) => 14.98 + 0.11 * r, HOP = 0.6;
const LAND = (r: number) => DEP(r) + HOP - 10; // in TB
const ROWOUT = (r: number) => 18.8 + 0.06 * r;

// A message: a chat bubble (g = 0) that stretches into an inbox row (g = 1).
const Msg: React.FC<{ cx: number; cy: number; w: number; h: number; rot: number; sc: number; op: number; ch: number; g: number; red: number; cap: number; chk: number; flash: number }> =
  ({ cx, cy, w, h, rot, sc, op, ch, g, red, cap, chk, flash }) => {
    const dot = red > 0 ? C.warn : CHAN[ch].dot, av = lerp(24, 34, g);
    const bg = red > 0 ? `rgba(253,231,231,${red})` : flash > 0 ? `rgba(215,243,255,${flash})` : "transparent";
    return (
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: lerp(18, 12, g), background: C.white,
        boxShadow: g < 1 ? `0 ${lerp(16, 4, g)}px ${lerp(30, 10, g)}px -12px rgba(41,58,81,${lerp(0.42, 0.18, g)})` : "0 4px 10px -6px rgba(41,58,81,0.18)",
        transform: `rotate(${rot}deg) scale(${sc})`, opacity: op, overflow: "visible" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: lerp(18, 12, g), background: bg }} />
        {/* bubble tail */}
        <svg width="18" height="12" viewBox="0 0 18 12" style={{ position: "absolute", left: 16, bottom: -9, opacity: 1 - g }}>
          <path d="M0 0h18L3 12z" fill={red > 0 ? `rgb(${lerp(255, 253, red)},${lerp(255, 231, red)},${lerp(255, 231, red)})` : C.white} />
        </svg>
        <div style={{ position: "absolute", left: 14, top: h / 2 - av / 2, width: av, height: av, borderRadius: av, background: dot }} />
        <div style={{ position: "absolute", left: 14 + av + 12, top: h / 2 - 12, width: lerp(76, 170, g), height: 10, borderRadius: 5, background: red > 0 ? "#F3B7B9" : "#C9D3DF" }} />
        <div style={{ position: "absolute", left: 14 + av + 12, top: h / 2 + 4, width: lerp(50, 226, g), height: 9, borderRadius: 4, background: red > 0 ? "#F8D3D4" : "#E2E8F0" }} />
        {/* the order: a 19 L bottle, captured into a blue chip with a check */}
        <div style={{ position: "absolute", right: lerp(12, 50, g), top: h / 2 - 19, width: 38, height: 38, borderRadius: 11,
          background: `rgba(0,92,191,${clamp01(cap)})`, transform: `scale(${1 + 0.12 * Math.sin(Math.PI * clamp01(cap))})`,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bottle s={lerp(27, 25, g)} c={red > 0 ? C.warn : cap > 0.5 ? C.white : H2O.blue} rib={cap > 0.5 ? "rgba(0,92,191,0.55)" : "rgba(255,255,255,0.6)"} />
        </div>
        <Check s={27} sc={chk} style={{ position: "absolute", right: 13, top: h / 2 - 13.5, opacity: g }} />
      </div>
    );
  };

// Big text: each line rises in out of a mask with a small settle, and lifts away.
const Lines: React.FC<{ lines: string[]; tb: number; inAt: number; outAt: number; size?: number }> = ({ lines, tb, inAt, outAt, size = 66 }) => {
  const wrap = inAt > outAt, mid = (inAt + outAt) / 2, entering = wrap ? tb >= mid : tb < mid;
  return (
    <div style={{ position: "absolute", left: TX.x, top: TX.y }}>
      {lines.map((s, i) => {
        let y = 0, op = 1;
        if (entering) { const p = pop(tb, inAt + 0.1 * i, { dur: 0.5, over: 0.04 }); y = 64 * (1 - p); op = clamp01(p * 1.6); }
        else { const o = popOut(tb, outAt + 0.06 * i, { dur: 0.4 }); y = -52 * (1 - o); op = clamp01(o); }
        return (
          <div key={i} style={{ height: size * 1.16, overflow: "hidden" }}>
            <div style={{ fontSize: size, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em", lineHeight: 1.16, whiteSpace: "nowrap",
              transform: `translateY(${y}px)`, opacity: op }}>{s}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Loop: React.FC = () => {
  const t = useT(), ta = TA(t), tb = TB(t);
  const cardF = fl(t, 0, 8), mapF = fl(t, 0.33, 8), cliF = fl(t, 0.66, 8);

  // ---- sheet ↔ inbox ----
  const mI = tb < 6 ? pop(tb, 2.62, { dur: 0.5, over: 0.03 }) : 1 - seg(tb, 9.15, 9.7, INOUT);
  const mIc = clamp01(mI);
  const tau = tb >= 6 ? tb - 9.6 : tb + 0.4; // typing clock (problem phase only)
  const chars = Math.max(0, Math.floor(tau / 0.11));
  const typed = [Math.min(11, chars) * 11, Math.max(0, Math.min(14, chars - 11)) * 11, Math.max(0, chars - 25) * 11];
  const clock = tb < 6 ? popOut(tb, 2.45, { dur: 0.35 }) : pop(tb, 9.55, { dur: 0.45, over: 0.1 });
  const cardPunch = 1 - 0.018 * pulse(t, 2.78, 0.4);

  // ---- channels ----
  const dockK = (i: number) => (tb < 7 ? pop(tb, 2.95 + 0.1 * i, { dur: 0.55, over: 0.05 }) : 1 - pop(tb, 8.95 + 0.08 * i, { dur: 0.6, over: 0.05 }));
  const bob = (i: number) => 8 * Math.cos(2 * Math.PI * (t / 2.5 + i * 0.21));
  const RAIL = [0, 1, 2, 4, 3]; // channel → rail slot (rows: WhatsApp, widget, email, Instagram, then Messenger's retry)
  const railY = (slot: number) => CARD.y + rowTopL(slot) + ROWH / 2 + cardF;
  const chanPos = (i: number) => {
    const k = dockK(i), kc = clamp01(k), hx = CH[i].x, hy = CH[i].y + bob(i) * (1 - kc);
    return { x: lerp(hx, RAIL_X, k), y: lerp(hy, railY(RAIL[i]), k) - 60 * Math.sin(Math.PI * kc), s: lerp(TILE, BADGE, kc) };
  };

  // ---- messages ----
  const msgs: React.ReactNode[] = [];
  const rowC = (r: number) => ({ x: ROWX + ROWW / 2, y: CARD.y + rowTopL(r) + ROWH / 2 + cardF });
  const chipC = (r: number) => ({ x: ROWX + ROWW - 50 - 19, y: rowC(r).y });
  const capOf = (r: number) => pop(ta, CAP[r], { dur: 0.35, over: 0.12 });
  const chkOf = (r: number) => pop(ta, CAP[r] + 0.08, { dur: 0.35, over: 0.12 });
  for (let k = 0; k < 5; k++) {
    const S = SPAWN[k];
    if (ta < S) continue;
    const home = { x: CH[k].x, y: CH[k].y + bob(k) }, ps = PS[SLOT[k]];
    const sc0 = 0.3 + 0.7 * pop(ta, S, { dur: 0.32, over: 0.08 });
    if (k === 3) { // the missed order: it hits the pile, turns red and drops away
      const f = seg(ta, S, S + 0.55, Easing.bezier(0.35, 0, 0.75, 0.8));
      const s = Math.max(0, ta - (S + 0.55));
      const x = lerp(home.x, ps.x, f) - 120 * s, y = lerp(home.y, ps.y - 18, f) - 70 * Math.sin(Math.PI * f) - 160 * s + 560 * s * s;
      const op = 1 - seg(ta, S + 0.8, S + 1.3);
      if (op <= 0) continue;
      msgs.push(<Msg key={k} cx={x} cy={y} w={BW} h={BH} rot={ps.r * f - 70 * s} sc={sc0 * (1 - 0.25 * seg(ta, S + 0.6, S + 1.3))} op={op} ch={k} g={0}
        red={seg(ta, S + 0.5, S + 0.68)} cap={0} chk={0} flash={0} />);
      continue;
    }
    const f = pop(ta, S, { dur: 0.55, over: 0.06 }), fc = clamp01(f);
    const bx = lerp(home.x, ps.x, f), by = lerp(home.y, ps.y, f) - 70 * Math.sin(Math.PI * fc);
    const land = pulse(ta, S + 0.5, 0.3);
    const r = ROWOF[k], g = pop(ta, ROWIN(r), { dur: 0.55, over: 0.04 }), gc = clamp01(g), rc = rowC(r);
    const out = popOut(ta, ROWOUT(r), { dur: 0.4 });
    if (out <= 0) continue;
    msgs.push(<Msg key={k} cx={lerp(bx, rc.x, g)} cy={lerp(by, rc.y, g) - 30 * Math.sin(Math.PI * gc)} w={lerp(BW, ROWW, g)} h={lerp(BH, ROWH, gc)}
      rot={lerp(ps.r * fc + 1.8 * fc * Math.sin(2 * Math.PI * (t / 2.5 + k * 0.3)), 0, gc)} sc={sc0 * (1 - 0.05 * land) * lerp(0.92, 1, out)} op={clamp01(out)} ch={k} g={gc} red={0}
      cap={capOf(r)} chk={chkOf(r)} flash={pulse(ta, CAP[r] - 0.05, 0.45) * 0.9} />);
  }
  { // row 4: the missed channel's message, now caught by the inbox
    const e = pop(ta, NEWROW, { dur: 0.55, over: 0.04 }), ec = clamp01(e), out = popOut(ta, ROWOUT(4), { dur: 0.4 });
    if (ta >= NEWROW && out > 0) {
      const l = lerp(RAIL_X - 20, ROWX, e), rr = lerp(RAIL_X + 20, ROWX + ROWW, e), y = lerp(railY(4), rowC(4).y, e);
      msgs.push(<Msg key="new" cx={(l + rr) / 2} cy={y} w={Math.max(40, rr - l)} h={lerp(40, ROWH, ec)} rot={0} sc={lerp(0.92, 1, out)} op={clamp01(ec * 2) * clamp01(out)}
        ch={3} g={1} red={0} cap={capOf(4)} chk={chkOf(4)} flash={pulse(ta, CAP[4] - 0.05, 0.45) * 0.9} />);
    }
  }

  // ---- chips hop to the map ----
  const pinHead = (i: number) => ({ x: MAP.x + PINS[i].x, y: MAP.y + PINS[i].y - 36 + mapF });
  const chips: React.ReactNode[] = [];
  for (let r = 0; r < 5; r++) {
    const d = DEP(r);
    if (ta < d || ta > d + HOP) continue;
    const s = seg(ta, d, d + HOP, Easing.bezier(0.45, 0, 0.25, 1)), a = chipC(r), b = pinHead(r);
    const x = lerp(a.x, b.x, s), y = lerp(a.y, b.y, s) - 110 * Math.sin(Math.PI * s), sz = lerp(38, 30, s);
    chips.push(<div key={r} style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: sz * 0.3, background: H2O.blue,
      boxShadow: SHADOW.tile, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${-14 * Math.sin(Math.PI * s)}deg)` }}>
      <Bottle s={sz * 0.64} c={C.white} rib="rgba(0,92,191,0.55)" /></div>);
  }

  // ---- map ----
  const fillOf = (i: number) => (tb < 8.5 ? pop(tb, LAND(i), { dur: 0.4, over: 0.1 }) : popOut(tb, 8.92 + 0.06 * i, { dur: 0.35 }));
  const tickOf = (i: number) => (tb < 8.5 ? pop(tb, PASS[i], { dur: 0.35, over: 0.12 }) : popOut(tb, 8.86 + 0.06 * i, { dur: 0.3 }));
  const kS = stringK(tb), kSc = clamp01(kS);
  const sp = stringPts(t);
  const ghosts: React.ReactNode[] = [];
  if (tb > TW && tb < TW + 0.9) {
    const env = 1 - seg(tb, TW + 0.35, TW + 0.9);
    for (let j = 7; j >= 1; j--) {
      const tg = t - 0.03 * j;
      if (TB(tg) < TW) continue;
      ghosts.push(<path key={j} d={toD(stringPts(tg))} fill="none" stroke={C.cyan} strokeWidth={7 - 0.6 * j} strokeLinecap="round" strokeLinejoin="round"
        opacity={0.42 * (1 - j / 8) * env} />);
    }
  }
  const strokeCol = kSc > 0.5 ? C.cyan : "#A9B4C2";
  const flowOn = tb < 8.5 ? seg(tb, TW + 0.3, TW + 0.7) : 1 - seg(tb, 8.8, 9.05);
  const vu = vanU(tb), vp = atU(vu), vanHop = pulse(tb, VAN0, 0.35) + pulse(tb, VAN1 - 0.15, 0.35);
  const spring = tb < 8 ? pop(tb, 5.85, { dur: 0.45, over: 0.08 }) : popOut(tb, 8.95, { dur: 0.35 });
  const seaY = (x: number) => 374 + 9 * Math.sin(2 * Math.PI * (x / 270 - t / 10)) + 4 * Math.sin(2 * Math.PI * (x / 130 + t / 5));
  let sea = `M0,${seaY(0).toFixed(1)}`;
  for (let x = 8; x <= MAP.w; x += 8) sea += `L${x},${seaY(x).toFixed(1)}`;
  sea += `L${MAP.w},${MAP.h}L0,${MAP.h}Z`;

  // ---- H2O card ----
  const fig = tb < 8 ? pop(tb, 7.18, { dur: 0.5, over: 0.05 }) : popOut(tb, 8.9, { dur: 0.4 });
  const figL = tb < 8 ? pop(tb, 7.3, { dur: 0.5, over: 0.05 }) : popOut(tb, 8.95, { dur: 0.4 });
  const frag = tb < 8 ? popOut(tb, 6.95, { dur: 0.35 }) : pop(tb, 9.15, { dur: 0.5, over: 0.05 });
  const ill = tb < 8 ? pop(tb, 7.0, { dur: 0.55, over: 0.04 }) : 1 - pop(tb, 9.0, { dur: 0.6, over: 0.04 });
  const slosh = clamp01(fig) * clamp01(figL);
  const cwY = (x: number) => 300 - 26 * slosh + 10 * Math.sin(2 * Math.PI * (x / 300 + t / 10)) + 3 * Math.sin(2 * Math.PI * (x / 120 - t / 5)) + 9 * slosh * Math.sin(2 * Math.PI * (x / 210 - t / 1.25));
  let cw = `M0,${cwY(0).toFixed(1)}`;
  for (let x = 10; x <= CLI.w; x += 10) cw += `L${x},${cwY(x).toFixed(1)}`;
  cw += `L${CLI.w},${CLI.h}L0,${CLI.h}Z`;

  // ---- K.B ----
  const kbIn = pop(t, 2.4, { dur: 0.5, over: 0.06 }), kbOut = popOut(t, 9.3, { dur: 0.45 });
  const kbVis = t < 6 ? kbIn : kbOut;
  const ring = seg(t, 2.78, 3.4, OUT);

  // ---- AI scan ----
  const scanOp = seg(ta, SCAN0 - 0.1, SCAN0 + 0.05) * (1 - seg(ta, SCAN1 - 0.05, SCAN1 + 0.15));
  const sy = CARD.y + scanY(ta) + cardF;

  return (
    <Frame>
      {/* H2O site card (top-right): the client's own look; it carries the figure */}
      <div style={{ position: "absolute", left: CLI.x, top: CLI.y + cliF, width: CLI.w, height: CLI.h, borderRadius: 22, background: H2O.sky, overflow: "hidden", boxShadow: SHADOW.card }}>
        <svg width={CLI.w} height={CLI.h} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={cw} fill="#FFFFFF" />
          <circle cx={120} cy={340 + 3 * Math.sin(2 * Math.PI * t / 2.5)} r={13} fill={H2O.sky} />
          <circle cx={448} cy={258 + 4 * Math.cos(2 * Math.PI * t / 5)} r={9} fill="#C4EDFF" />
        </svg>
        <Img src={IMG("h2o-logo.png")} style={{ position: "absolute", left: 28, top: 26, height: 34 }} />
        <div style={{ position: "absolute", left: 28, top: 100, transformOrigin: "0 50%", transform: `scale(${Math.max(0, frag)})`, opacity: clamp01(frag) }}>
          <div style={{ width: 214, height: 16, borderRadius: 8, background: H2O.ink, opacity: 0.85 }} />
          <div style={{ width: 160, height: 16, borderRadius: 8, background: H2O.ink, opacity: 0.85, marginTop: 12 }} />
          <div style={{ width: 196, height: 8, borderRadius: 4, background: "#3E6C8C", opacity: 0.45, marginTop: 18 }} />
          <div style={{ width: 136, height: 38, borderRadius: 19, background: H2O.blue, marginTop: 22, boxShadow: "0 8px 16px -10px rgba(0,92,191,0.8)" }} />
        </div>
        <Img src={IMG("h2o-illustration.png")} style={{ position: "absolute", left: 270, top: 56, width: 244, height: 244,
          transformOrigin: "100% 100%", transform: `translate(${lerp(0, 0, ill)}px, ${lerp(0, 4, ill)}px) scale(${lerp(1, 0.5, ill)})` }} />
        <div style={{ position: "absolute", left: 26, top: 86, transformOrigin: "10% 70%", transform: `scale(${Math.max(0, lerp(0.6, 1, fig))})`, opacity: clamp01(fig * 1.5) }}>
          <div style={{ fontSize: 96, fontWeight: 800, color: H2O.ink, letterSpacing: "-0.03em", lineHeight: 1.1, whiteSpace: "nowrap" }}>~2 hours</div>
        </div>
        <div style={{ position: "absolute", left: 30, top: 204, transform: `translateY(${24 * (1 - figL)}px)`, opacity: clamp01(figL * 1.5),
          fontSize: 36, fontWeight: 700, color: H2O.ink, whiteSpace: "nowrap" }}>saved per day</div>
      </div>

      {/* route map (bottom-right) */}
      <div style={{ position: "absolute", left: MAP.x, top: MAP.y + mapF, width: MAP.w, height: MAP.h, borderRadius: 22, background: C.white, boxShadow: SHADOW.card, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: MHEAD, width: MAP.w, height: MAP.h - MHEAD, background: "#F3F6FA" }} />
        <svg width={MAP.w} height={MAP.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M-10,262 C126,230 210,304 346,262 S546,210 590,240" fill="none" stroke="#E6ECF2" strokeWidth={10} />
          <path d="M168,60 C200,158 158,252 220,366" fill="none" stroke="#E6ECF2" strokeWidth={8} />
          <path d={sea} fill={H2O.sky} />
          <circle cx={310} cy={410 + 3 * Math.sin(2 * Math.PI * t / 2.5)} r={8} fill="#C4EDFF" />
          <circle cx={492} cy={404 + 3 * Math.cos(2 * Math.PI * t / 5)} r={12} fill="#C4EDFF" />
          {ghosts}
          {[...PINS.map((p, i) => ({ p, at: PASS[i] })), { p: D, at: VAN0 + 0.05 }, { p: D, at: VAN1 - 0.1 }].flatMap(({ p, at }, i) => [0, 0.22].map((d) => {
            const u = seg(tb, at + d, at + d + 0.95, OUT);
            return u > 0 && u < 1 ? <ellipse key={`${i}-${d}`} cx={p.x} cy={p.y} rx={10 + 48 * u} ry={(10 + 48 * u) * 0.42} fill="none" stroke={C.cyan} strokeWidth={3.5 * (1 - u) + 0.5} opacity={0.8 * (1 - u)} /> : null;
          }))}
          <path d={toD(sp)} fill="none" stroke={strokeCol} strokeWidth={lerp(3.5, 6, kSc)} strokeLinecap="round" strokeLinejoin="round" />
          {flowOn > 0 && <path d={toD(sp)} fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="6 22"
            strokeDashoffset={-TAUT.L * cyc(t, 2.5)} opacity={flowOn} />}
        </svg>
        <div style={{ position: "absolute", left: 0, top: 0, width: MAP.w, height: MHEAD, borderBottom: `1px solid ${C.line}`, background: C.white }}>
          <svg width="30" height="30" viewBox="0 0 30 30" style={{ position: "absolute", left: 22, top: 17 }}>
            <circle cx="7" cy="23" r="4" fill={C.navy} /><circle cx="23" cy="7" r="4" fill={C.navy} />
            <path d="M7 23C7 12 23 18 23 7" fill="none" stroke={C.navy} strokeWidth="2.4" strokeDasharray="3 3" />
          </svg>
          <div style={{ position: "absolute", left: 64, top: 22, width: 118, height: 10, borderRadius: 5, background: "#C9D3DF" }} />
          <div style={{ position: "absolute", left: 64, top: 38, width: 74, height: 7, borderRadius: 4, background: "#E2E8F0" }} />
          <div style={{ position: "absolute", right: 14, top: 10, transform: `scale(${Math.max(0, spring)})` }}><ToolTile tool="spring" size={44} /></div>
        </div>
        {/* depot: the H2O mark */}
        <div style={{ position: "absolute", left: D.x - 26, top: D.y - 92, width: 52, height: 52, borderRadius: 14, background: C.white, boxShadow: SHADOW.soft,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={IMG("h2o-icon.png")} style={{ width: 40, height: 40, objectFit: "contain" }} />
        </div>
        {PINS.map((p, i) => {
          const fi = fillOf(i), tk = tickOf(i);
          return (
            <div key={i} style={{ position: "absolute", left: p.x - 20, top: p.y - 52, width: 40, height: 52, transform: "scale(1.14)", transformOrigin: "50% 100%" }}>
              <svg width="40" height="52" viewBox="0 0 40 52" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <path d="M20 51C20 51 4.5 32 4.5 20a15.5 15.5 0 0 1 31 0C35.5 32 20 51 20 51z" fill={C.white} stroke="#A9B4C2" strokeWidth={2.5} />
                <circle cx="20" cy="20" r="4.5" fill="#C9D3DF" />
                <g transform={`translate(20 20) scale(${Math.max(0, fi)}) translate(-20 -20)`}>
                  <path d="M20 51C20 51 4.5 32 4.5 20a15.5 15.5 0 0 1 31 0C35.5 32 20 51 20 51z" fill={H2O.blue} stroke={H2O.blue} strokeWidth={2.5} />
                </g>
              </svg>
              <div style={{ position: "absolute", left: 12, top: 9, transform: `scale(${Math.max(0, fi)})` }}><Bottle s={21} c={C.white} rib="rgba(0,92,191,0.55)" /></div>
              <Check s={20} sc={tk} style={{ position: "absolute", left: 26, top: -6 }} />
            </div>
          );
        })}
        {/* the van marker */}
        <div style={{ position: "absolute", left: vp.x - 30, top: vp.y - 30 - 6 * vanHop, width: 60, height: 60, borderRadius: 30, background: C.white,
          boxShadow: "0 10px 22px -10px rgba(41,58,81,0.55)", border: `2px solid ${kSc > 0.5 ? C.cyan : "#D5DCE5"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Van w={40} />
        </div>
      </div>

      {/* order sheet → Chatwoot inbox (centre) */}
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y + cardF, width: CARD.w, height: CARD.h, borderRadius: 20, background: C.white, boxShadow: SHADOW.card,
        overflow: "hidden", transform: `scale(${cardPunch})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: HEAD, background: mIc > 0.5 ? C.white : "#EEF1F5", borderBottom: `1px solid ${C.line}` }} />
        {/* sheet */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-60 * mI}px)`, opacity: clamp01(1 - mI * 1.4) }}>
          <svg width="26" height="26" viewBox="0 0 26 26" style={{ position: "absolute", left: 24, top: 19 }}>
            {[0, 1, 2].map((a) => [0, 1, 2].map((b) => <rect key={`${a}${b}`} x={a * 9} y={b * 9} width="7.5" height="7.5" rx="1.5" fill={b === 0 ? "#7F8EA3" : "#B7C2D0"} />))}
          </svg>
          <div style={{ position: "absolute", left: 64, top: 26, width: 130, height: 11, borderRadius: 6, background: "#B7C2D0" }} />
          <div style={{ position: "absolute", right: 72, top: 15, width: 34, height: 34, borderRadius: 17, background: C.warn, transform: `scale(${Math.max(0, clock)})`,
            boxShadow: "0 6px 14px -6px rgba(229,72,77,0.7)" }}>
            <svg width="34" height="34" viewBox="0 0 34 34">
              <circle cx="17" cy="17" r="10.5" fill="none" stroke="#fff" strokeWidth="2.4" />
              <path d={`M17 17L${17 + 7 * Math.sin(2 * Math.PI * cyc(t, 1.25))} ${17 - 7 * Math.cos(2 * Math.PI * cyc(t, 1.25))}`} stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M17 17V12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
          <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={0} x2={CARD.w} y1={HEAD + 62 * i} y2={HEAD + 62 * i} stroke={C.line} strokeWidth={1.5} />)}
            <line x1={182} x2={182} y1={HEAD} y2={CARD.h} stroke={C.line} strokeWidth={1.5} />
            <line x1={386} x2={386} y1={HEAD} y2={CARD.h} stroke={C.line} strokeWidth={1.5} />
            {[[112, 150, 100], [94, 168, 124]].map((r, ri) => r.map((w, ci) => <rect key={`${ri}${ci}`} x={[24, 206, 410][ci]} y={HEAD + 62 * ri + 25} width={w} height={13} rx={6.5} fill="#CFD8E3" />))}
            <rect x={0} y={HEAD + 124} width={CARD.w} height={62} fill="#F4F8FC" />
            {typed.map((w, ci) => (w > 0 ? <rect key={ci} x={[24, 206, 410][ci]} y={HEAD + 124 + 25} width={w} height={13} rx={6.5} fill="#9FB0C4" /> : null))}
            {(() => {
              const ci = chars < 11 ? 0 : chars < 25 ? 1 : 2, cx = [24, 206, 410][ci] + typed[ci] + 4;
              return <rect x={cx} y={HEAD + 124 + 18} width={2.8} height={27} fill={C.navy} opacity={cyc(t, 0.6) < 0.55 ? 1 : 0} />;
            })()}
          </svg>
        </div>
        {/* inbox */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${60 * (1 - mI)}px)`, opacity: clamp01(mI * 1.4) }}>
          <div style={{ position: "absolute", left: 22, top: 14 }}><Chatwoot s={36} /></div>
          <div style={{ position: "absolute", left: 70, top: 20, width: 112, height: 11, borderRadius: 6, background: "#C9D3DF" }} />
          <div style={{ position: "absolute", left: 70, top: 38, width: 66, height: 7, borderRadius: 4, background: "#E2E8F0" }} />
          <div style={{ position: "absolute", left: 0, top: HEAD, width: 86, height: CARD.h - HEAD, background: C.paleCool, borderRight: `1px solid ${C.line}` }} />
          <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0 }}>
            {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={43} cy={rowTopL(i) + ROWH / 2} r={24} fill="none" stroke="#C9D3DF" strokeWidth={2} strokeDasharray="4 4" />)}
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={ROWX - CARD.x} y={rowTopL(i)} width={ROWW} height={ROWH} rx={13} fill="#F7F9FC" />)}
          </svg>
        </div>
      </div>

      {/* AI scan line */}
      {scanOp > 0 && <>
        <div style={{ position: "absolute", left: ROWX - 6, top: sy - 3, width: ROWW + 12, height: 6, borderRadius: 3, background: C.cyan, opacity: scanOp,
          boxShadow: `0 0 18px 4px rgba(56,200,255,0.55)` }} />
        <div style={{ position: "absolute", left: ROWX + ROWW + 2, top: sy - 17, width: 34, height: 34, borderRadius: 17, background: C.navy, opacity: scanOp,
          display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${90 * seg(ta, SCAN0, SCAN1, INOUT)}deg)` }}>
          <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 1.5C10.8 7 13 9.2 18.5 10 13 10.8 10.8 13 10 18.5 9.2 13 7 10.8 1.5 10 7 9.2 9.2 7 10 1.5z" fill={C.cyan} /></svg>
        </div>
      </>}

      {msgs}

      {/* channel tiles */}
      {[0, 1, 2, 3, 4].map((i) => {
        const p = chanPos(i), emit = pulse(ta, SPAWN[i], 0.32) + (i === 3 ? pulse(ta, NEWROW - 0.04, 0.3) : 0);
        return <ChanTile key={i} i={i} s={p.s} x={p.x} y={p.y} sc={1 + 0.1 * emit} />;
      })}

      {chips}

      {/* K.B steps in */}
      {kbVis > 0.001 && <>
        {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: 1154 - (50 + 96 * ring), top: 294 + cardF - (50 + 96 * ring), width: 2 * (50 + 96 * ring), height: 2 * (50 + 96 * ring),
          borderRadius: "50%", border: `${lerp(6, 1, ring)}px solid ${C.cyan}`, opacity: 0.75 * (1 - ring) }} />}
        <div style={{ position: "absolute", left: 1154 - 46, top: 294 + cardF - 46 - (t < 6 ? 170 * (1 - kbIn) : 0), opacity: t < 6 ? clamp01(kbIn * 3) : 1,
          transform: `scale(${t < 6 ? 1 : Math.max(0, kbOut)})` }}>
          <KBTile size={92} dot={1 + 0.18 * Math.max(0, Math.sin(2 * Math.PI * t / 2.5))} />
        </div>
      </>}

      {/* words */}
      <div style={{ position: "absolute", left: TX.x, top: TX.y - 26, width: 64 * clamp01(tb < 6 ? popOut(tb, 2.5, { dur: 0.35 }) + pop(tb, 3.05, { dur: 0.45, over: 0.05 }) : popOut(tb, 6.95, { dur: 0.35 }) + pop(tb, 9.3, { dur: 0.45, over: 0.05 })),
        height: 8, borderRadius: 4, background: C.cyan }} />
      <Lines lines={["Orders entered", "by hand"]} tb={tb} inAt={9.3} outAt={2.45} size={70} />
      <Lines lines={["One inbox.", "AI captures orders."]} tb={tb} inAt={3.05} outAt={6.9} size={70} />
    </Frame>
  );
};
