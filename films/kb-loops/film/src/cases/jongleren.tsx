// jongleren: "Stop juggling the intake" (../cases/jongleren.md).
// JongLeren's intake card (red JL monogram + wordmark, red stopwatch, four empty dashed rows) with two navy hands above it
// juggling four icon balls (call, notes, CRM, "?" eligibility) in a shower. The "?" is thrown wild, turns red halfway up
// and falls past the card; the K.B tile pops up, catches it, flips it to a cyan check and tosses it into row 1, then docks
// on the card's corner. The other balls are plucked from the air and SPLAT into their rows (flourish: a cyan comet with a
// ghost trail that squashes flat and spreads into the row bar). Hands fold away, the stopwatch shrinks to a short cyan arc,
// "~40h saved per month". The rows gather back into balls that spring up into the juggle: the opening again.
import React from "react";
import { Img, staticFile } from "remotion";
import { Frame, useT, seg, cyc, pop, popOut, clamp01, lerp, INOUT, SOFT } from "../loop";
import { C, KBTile, SHADOW } from "../kb";

// ---------- layout ----------
const CX0 = 410, CW = 540, CY0 = 540, CH = 392, HEAD = 84; // the intake card
const ROWY = [676, 748, 820, 892], ICX = 470, BAR_L = 436, BAR_R = 924, BAR_H = 58;
const XL = 500, XR = 850, YH = 470; // the juggling hands (ball centre at the catch)
const BR = 38; // ball radius
const P = 1.25, HIGH = 280, TH = 0.75 * P, TP = 0.25 * P, PASS_H = HIGH / 9;
const G = (8 * HIGH) / (TH * TH); // the juggle's gravity (px/s²)
const CATCH = { x: 330, y: 790 }; // where the K.B tile catches the dropped "?"
const TILE0 = { x: 330, y: 884, s: 112 }, TILE1 = { x: 960, y: 548, s: 84 };
const TX = 1120; // text column
const STAGE = 1.08; // the whole stage is drawn at this scale around (680, 540)
const WARN = C.warn;

// ---------- timing ----------
const WILD = { at: 1.25, catch: 2.4, flip: 2.6, toss: 3.05 }; // the "?" ball
const KB = { in: 2.0, hop: 3.3, out: 9.3 };
const HANDS = { out: 5.15, in: 7.5 };
const CLOCK = { short: 5.75, long: 8.05 };
const TXT = { probOut: 3.15, solIn: 3.45, solOut: 6.35, resIn: 6.55, resOut: 8.6, probIn: 9.0 };

type Kind = "q" | "phone" | "doc" | "crm";
type Spec = { kind: Kind; phi: number; row: number; t0: number; tl: number; ta: number; t1: number; label: string };
// t0: plucked from the juggle, tl: splat into its row, ta: springs back up, t1: back in the juggle (at u 0.26-0.36)
const SPECS: Spec[] = [
  { kind: "q", phi: 0, row: 0, t0: WILD.toss, tl: 3.6, ta: 8.65, t1: 9.2, label: "Eligible" },
  { kind: "phone", phi: 0.25, row: 1, t0: 3.95, tl: 4.5, ta: 8.3, t1: 8.85, label: "Transcript" },
  { kind: "doc", phi: 0.75, row: 2, t0: 4.55, tl: 5.1, ta: 8.95, t1: 9.5, label: "Candidate PDF" },
  { kind: "crm", phi: 0.5, row: 3, t0: 5.05, tl: 5.6, ta: 7.9, t1: 8.45, label: "CRM updated" },
];

// ---------- the juggle (a shower: high arc right → left, quick low pass left → right) ----------
type V = { x: number; y: number; vx: number; vy: number };
const shower = (u: number): V => {
  if (u < 0.75) {
    const s = u / 0.75;
    return { x: XR + (XL - XR) * s, y: YH - 4 * HIGH * s * (1 - s), vx: (XL - XR) / TH, vy: (-4 * HIGH * (1 - 2 * s)) / TH };
  }
  const s = (u - 0.75) / 0.25;
  return { x: XL + (XR - XL) * s, y: YH - 4 * PASS_H * s * (1 - s), vx: (XR - XL) / TP, vy: (-4 * PASS_H * (1 - 2 * s)) / TP };
};
const HW = 0.09; // a catch/throw lasts ±HW of the cycle: the hand gives way and the ball sinks with it
const catchDip = (u: number) => {
  let d = 0;
  for (const c of [0, 0.75]) {
    const x = ((u - c + 1.5) % 1) - 0.5;
    if (Math.abs(x) < HW) d += Math.cos((Math.PI * x) / (2 * HW)) ** 2;
  }
  return d;
};
const DIP = 10;
const juggle = (t: number, phi: number): V => {
  const u = cyc(t, P, phi), v = shower(u);
  return { ...v, y: v.y + DIP * catchDip(u) };
};
// constant-acceleration paths (never loop): leave p0 with its velocity and land on p1 after d; or start at p0 and arrive at
// p1 with p1's velocity after d (so a ball rejoins the juggle mid-flight without a kink)
const leave = (p0: V, p1: { x: number; y: number }, d: number, s: number) => {
  const ax = (2 * (p1.x - p0.x - p0.vx * d)) / (d * d), ay = (2 * (p1.y - p0.y - p0.vy * d)) / (d * d);
  return { x: p0.x + p0.vx * s + 0.5 * ax * s * s, y: p0.y + p0.vy * s + 0.5 * ay * s * s };
};
const arrive = (p0: { x: number; y: number }, p1: V, d: number, s: number) => {
  const r = d - s, ax = (2 * (p0.x - p1.x + p1.vx * d)) / (d * d), ay = (2 * (p0.y - p1.y + p1.vy * d)) / (d * d);
  return { x: p1.x - p1.vx * r + 0.5 * ax * r * r, y: p1.y - p1.vy * r + 0.5 * ay * r * r };
};
const ballistic = (a: { x: number; y: number }, b: { x: number; y: number }, d: number, s: number) => {
  const vx = (b.x - a.x) / d, vy = (b.y - a.y - 0.5 * G * d * d) / d;
  return { x: a.x + vx * s, y: a.y + vy * s + 0.5 * G * s * s };
};
// the K.B tile: pops up under the falling "?", dips when it catches, hops to the card's top-right corner
const tileDip = (t: number) => { const s = t - WILD.catch; return s <= 0 ? 0 : 22 * Math.exp(-8 * s) * Math.sin(14 * s); };
const tileState = (t: number) => {
  const k = pop(t, KB.hop, { dur: 0.55, over: 0.04 });
  const c = { x: 600, y: 500 };
  const m = 1 - k;
  const x = m * m * TILE0.x + 2 * k * m * c.x + k * k * TILE1.x, y = m * m * TILE0.y + 2 * k * m * c.y + k * k * TILE1.y;
  const appear = pop(t, KB.in, { dur: 0.5, over: 0.06 }), gone = t < 5 ? 1 : popOut(t, KB.out, { dur: 0.45, over: 0.06 });
  return { x, y: y + tileDip(t) + (1 - appear) * 70, s: lerp(TILE0.s, TILE1.s, clamp01(k)), sc: appear * gone, rot: 9 * Math.sin(Math.PI * clamp01(k)) };
};

const hop = (s: number) => Math.sin(Math.PI * clamp01(s / 0.42)) ** 2; // the row icons' little wave
type BS = { x: number; y: number; mode: "juggle" | "wild" | "tile" | "pull" | "row" | "back" };
const ballAt = (t: number, b: Spec): BS => {
  const row = { x: ICX, y: ROWY[b.row] };
  if (b.kind === "q") {
    if (t >= WILD.at && t < WILD.catch) return { ...ballistic({ x: XR, y: YH + DIP }, CATCH, WILD.catch - WILD.at, t - WILD.at), mode: "wild" };
    if (t >= WILD.catch && t < WILD.toss) return { x: CATCH.x, y: CATCH.y + tileDip(t), mode: "tile" };
    if (t >= WILD.toss && t < b.tl) return { ...ballistic({ x: CATCH.x, y: CATCH.y + tileDip(WILD.toss) }, row, b.tl - WILD.toss, t - WILD.toss), mode: "pull" };
  } else if (t >= b.t0 && t < b.tl) return { ...leave(juggle(b.t0, b.phi), row, b.tl - b.t0, t - b.t0), mode: "pull" };
  if (t >= b.tl && t < b.ta) return { x: row.x, y: row.y - 8 * (hop(t - 6.0 - b.row * 0.11) + hop(t - 7.25 - b.row * 0.11)), mode: "row" };
  if (t >= b.ta && t < b.t1) return { ...arrive(row, juggle(b.t1, b.phi), b.t1 - b.ta, t - b.ta), mode: "back" };
  const j = juggle(t, b.phi);
  return { x: j.x, y: j.y, mode: "juggle" };
};
const juggling = (t: number, b: Spec) => {
  const m = ballAt(t, b).mode;
  return m === "juggle" || (b.kind === "q" && t >= WILD.at && t < WILD.at + HW * P); // the wild throw still leaves the hand
};

// ---------- icons (Feather-style strokes, 24 px grid) ----------
const Icon: React.FC<{ kind: Kind | "check"; color: string; size: number }> = ({ kind, color, size }) => {
  const sw = 2.3;
  const common = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const g = (() => {
    switch (kind) {
      case "phone":
        return <path {...common} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />;
      case "doc":
        return (<g {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8M10 9H8" /></g>);
      case "crm":
        return (<g {...common}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></g>);
      case "check":
        return <path {...common} strokeWidth={3} d="M20 6 9 17l-5-5" />;
      default:
        return <text x="12" y="19.5" textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={20} fill={color}>?</text>;
    }
  })();
  return <g transform={`scale(${size / 24}) translate(-12 -12)`}>{g}</g>;
};

// ---------- one ball ----------
const speedOf = (t: number, b: Spec) => {
  const dt = 1 / 240, a = ballAt(t - dt, b), c = ballAt(t + dt, b);
  if (a.mode !== c.mode && (a.mode === "row" || c.mode === "row" || a.mode === "tile" || c.mode === "tile")) return { vx: 0, vy: 0 };
  return { vx: (c.x - a.x) / (2 * dt), vy: (c.y - a.y) / (2 * dt) };
};
const Ball: React.FC<{ t: number; b: Spec }> = ({ t, b }) => {
  const s = ballAt(t, b), v = speedOf(t, b), sp = Math.hypot(v.vx, v.vy);
  // stretch along the velocity: gentle in the juggle, a comet when plucked
  const plucked = b.kind === "q" ? seg(t, WILD.toss, WILD.toss + 0.15) * (t < b.tl + 0.05 ? 1 : 0) : (t >= b.t0 && t < b.tl ? seg(t, b.t0, b.t0 + 0.15) : 0);
  const back = t >= b.ta && t < b.t1 ? 1 - seg(t, b.t1 - 0.2, b.t1) : 0;
  const f = 0.28 + 0.4 * Math.max(plucked, back * 0.7);
  const k = Math.min(1, sp / 2600) * f;
  let along = 1 + k, across = 1 / Math.sqrt(1 + k);
  // impacts: the splat into the row, the catch on the K.B tile
  const imp = (at: number, amp: number) => { const q = t - at; return q < 0 ? 0 : amp * Math.exp(-9 * q) * Math.cos(16 * q); };
  const sq = imp(b.tl, 0.55) + (b.kind === "q" ? imp(WILD.catch, 0.3) : 0);
  // radius: full ball in the air, the row's icon circle while it sits in its row
  const r = BR - 16 * (pop(t, b.tl + 0.04, { dur: 0.35, over: 0.06 }) - pop(t, b.ta - 0.32, { dur: 0.3, over: 0.06 }));
  // colours: the "?" turns red halfway up the wild throw, flips to a cyan check on the K.B tile, back to "?" before it springs up
  let fill: string = C.white, ink: string = C.navy, icon: Kind | "check" = b.kind, flipX = 1;
  if (b.kind === "q") {
    const red = seg(t, 1.7, 1.9) * (t < WILD.flip + 0.15 ? 1 : 0);
    const f1 = clamp01((t - WILD.flip) / 0.3), f2 = clamp01((t - (b.ta - 0.45)) / 0.3);
    const checked = (f1 >= 0.5 && t < b.ta - 0.45) || (t >= b.ta - 0.45 && f2 < 0.5);
    flipX = t < b.ta - 1 ? Math.abs(Math.cos(Math.PI * f1)) : Math.abs(Math.cos(Math.PI * f2));
    if (checked) { fill = C.cyan; ink = C.white; icon = "check"; }
    else if (red > 0) { fill = mix(C.white, WARN, red); ink = red > 0.5 ? C.white : C.navy; }
  }
  const ang = (Math.atan2(v.vy, v.vx) * 180) / Math.PI;
  const u = cyc(t, P, b.phi);
  const sw = s.mode === "juggle" ? 1 : s.mode === "pull" && b.kind !== "q" ? 1 - seg(t, b.t0, b.t0 + 0.3) : s.mode === "back" ? seg(t, b.ta, b.t1) : 0;
  const spin = 16 * Math.sin(2 * Math.PI * u) * sw + (s.mode === "wild" ? 360 * seg(t, WILD.at, WILD.catch, SOFT) + 12 * Math.sin(40 * t) * seg(t, 1.7, 1.9) * (1 - seg(t, 2.1, 2.3)) : 0);
  const rim = plucked * (1 - seg(t, b.tl, b.tl + 0.3)) + back * 0.8;
  return (
    <g transform={`translate(${s.x.toFixed(2)} ${s.y.toFixed(2)})`}>
      <g transform={`rotate(${ang}) scale(${(along * (1 + sq)).toFixed(4)} ${(across * (1 - sq * 0.6)).toFixed(4)}) rotate(${-ang})`}>
        {rim > 0.01 && <circle r={r + 5} fill="none" stroke={C.cyan} strokeWidth={4} opacity={rim} />}
        <g transform={`scale(${flipX.toFixed(4)} 1)`}>
          <circle r={r} fill={fill} style={{ filter: "drop-shadow(0 8px 10px rgba(41,58,81,0.22))" }} />
          {fill === C.white && <circle r={r - 0.75} fill="none" stroke={C.line} strokeWidth={1.5} />}
          <g transform={`rotate(${spin})`}><Icon kind={icon} color={ink} size={r * 0.92} /></g>
        </g>
      </g>
    </g>
  );
};
// the comet's ghost trail (cyan) while a ball is plucked into its row or springs back out of it
const Trail: React.FC<{ t: number; b: Spec }> = ({ t, b }) => {
  const start = b.kind === "q" ? WILD.toss : b.t0;
  const wins: [number, number, number][] = [[start, b.tl + 0.2, 1], [b.ta, b.t1 + 0.18, 0.55]];
  const out: React.ReactNode[] = [];
  for (const [a, e, op] of wins) {
    if (t < a || t > e) continue;
    for (let i = 12; i >= 1; i--) {
      const tt = Math.max(a, t - i * 0.016);
      const p = ballAt(tt, b);
      out.push(<circle key={`${a}-${i}`} cx={p.x} cy={p.y} r={BR * (1 - i / 15)} fill={C.cyan} opacity={op * 0.42 * (1 - i / 13)} />);
    }
  }
  return <>{out}</>;
};

// ---------- helpers ----------
const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp01(k))).toString(16).padStart(2, "0")).join("");
};
const vis = (t: number, inAt: number, outAt: number, o = { din: 0.55, dout: 0.42 }) =>
  inAt > outAt ? (t >= inAt ? pop(t, inAt, { dur: o.din, over: 0.04 }) : popOut(t, outAt, { dur: o.dout, over: 0.04 }))
    : t < inAt ? 0 : t < outAt ? pop(t, inAt, { dur: o.din, over: 0.04 }) : popOut(t, outAt, { dur: o.dout, over: 0.04 });

// ---------- a row of the intake card ----------
const Row: React.FC<{ t: number; b: Spec }> = ({ t, b }) => {
  const y = ROWY[b.row];
  const spread = pop(t, b.tl + 0.02, { dur: 0.42, over: 0.05 }) * (t < b.ta - 0.4 ? 1 : 1 - seg(t, b.ta - 0.4, b.ta - 0.02, INOUT));
  const on = t >= b.tl && t < b.ta;
  const w = lerp(2 * BR, BAR_R - BAR_L, spread), h = lerp(2 * BR, BAR_H, clamp01(spread));
  const lab = on ? pop(t, b.tl + 0.18, { dur: 0.45, over: 0.05 }) * popOut(t, b.ta - 0.55, { dur: 0.3 }) : 0;
  const tick = on && b.kind !== "q" ? pop(t, b.tl + 0.32, { dur: 0.4, over: 0.08 }) * popOut(t, b.ta - 0.6, { dur: 0.3 }) : 0;
  const ripple = clamp01((t - b.tl) / 0.45);
  const MISS_AT = [-1, 0.35, 0.75, 1.15][b.row];
  const miss = MISS_AT < 0 || t >= b.tl ? 0 : pop(t, MISS_AT, { dur: 0.4, over: 0.08 }) * popOut(t, b.tl - 0.3, { dur: 0.25 });
  const x0 = ICX - BR + (BR - (ICX - BAR_L)) * clamp01(spread);
  return (
    <g>
      {/* the empty slot */}
      <rect x={BAR_L} y={y - BAR_H / 2} width={BAR_R - BAR_L} height={BAR_H} rx={14} fill="none" stroke="#CBD5E1" strokeWidth={1.6} strokeDasharray="7 7" />
      <circle cx={ICX} cy={y} r={20} fill={C.paleCool} />
      {/* missing info: a red badge pops on the empty row in the problem phase, leaves just before the row fills */}
      {miss > 0.001 && <g transform={`translate(${BAR_R - 34} ${y}) scale(${miss.toFixed(4)})`}><circle r={11} fill={WARN} /><rect x={-1.6} y={-6} width={3.2} height={7} rx={1.6} fill={C.white} /><circle cy={4.6} r={1.8} fill={C.white} /></g>}
      {on && spread > 0.001 && <rect x={x0} y={y - h / 2} width={w} height={h} rx={Math.min(h / 2, 14 + (1 - clamp01(spread)) * 30)} fill={C.cyanSoft} />}
      {on && ripple > 0 && ripple < 1 && <circle cx={ICX} cy={y} r={BR + 52 * ripple} fill="none" stroke={C.cyan} strokeWidth={3 * (1 - ripple)} opacity={0.6 * (1 - ripple)} />}
      {lab > 0.001 && (
        <g transform={`translate(${(510 + (1 - lab) * -18).toFixed(2)} ${y + 8})`} opacity={clamp01(lab)}>
          <text fontFamily="Montserrat" fontWeight={700} fontSize={23} fill={C.navy}>{b.label}</text>
          {b.kind === "phone" && Array.from({ length: 9 }, (_, i) => {
            const hh = 8 + 14 * Math.abs(Math.sin(2 * Math.PI * (cyc(t, 1.25) + i * 0.13)));
            return <rect key={i} x={160 + i * 11} y={-8 - hh / 2} width={6} height={hh} rx={3} fill={C.cyan} />;
          })}
          {b.kind === "doc" && <rect x={196} y={-14} width={90} height={10} rx={5} fill="#C9D3DF" />}
          {b.kind === "crm" && <rect x={176} y={-14} width={110} height={10} rx={5} fill="#C9D3DF" />}
          {b.kind === "q" && <rect x={128} y={-14} width={150} height={10} rx={5} fill="#C9D3DF" />}
        </g>
      )}
      {tick > 0.001 && (
        <g transform={`translate(${BAR_R - 34} ${y}) scale(${(tick * (1 + 0.18 * (hop(t - 6.12 - b.row * 0.11) + hop(t - 7.37 - b.row * 0.11)))).toFixed(4)})`}>
          <circle r={15} fill={C.cyan} />
          <Icon kind="check" color={C.white} size={18} />
        </g>
      )}
    </g>
  );
};

// ---------- the stopwatch in the card header: a long red arc (70 min) that shrinks to a short cyan one ----------
const Stopwatch: React.FC<{ t: number }> = ({ t }) => {
  const k = seg(t, CLOCK.short, CLOCK.short + 0.6, INOUT) - seg(t, CLOCK.long, CLOCK.long + 0.6, INOUT);
  const len = lerp(0.88, 0.32, k), col = mix(WARN, C.cyan, k), r = 19, circ = 2 * Math.PI * r;
  const hand = 360 * cyc(t, 2.5);
  return (
    <g transform="translate(866 582)">
      <rect x={-4} y={-r - 10} width={8} height={6} rx={2} fill={C.navy} />
      <circle r={r} fill="none" stroke={C.line} strokeWidth={5} />
      <circle r={r} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${(len * circ).toFixed(2)} ${circ.toFixed(2)}`} transform="rotate(-90)" />
      <line x1={0} y1={0} x2={0} y2={-r + 7} stroke={C.navy} strokeWidth={3} strokeLinecap="round" transform={`rotate(${hand})`} />
      <circle r={3} fill={C.navy} />
    </g>
  );
};

// ---------- the hands ----------
const Hands: React.FC<{ t: number }> = ({ t }) => {
  const sc = t < 6.5 ? popOut(t, HANDS.out, { dur: 0.4, over: 0.06 }) : pop(t, HANDS.in, { dur: 0.5, over: 0.06 });
  if (sc <= 0.001) return null;
  let dL = 0, dR = 0;
  for (const b of SPECS) {
    if (!juggling(t, b)) continue;
    const u = cyc(t, P, b.phi), xL = ((u - 0.75 + 1.5) % 1) - 0.5, xR = ((u + 1.5) % 1) - 0.5;
    if (Math.abs(xL) < HW) dL += Math.cos((Math.PI * xL) / (2 * HW)) ** 2;
    if (Math.abs(xR) < HW) dR += Math.cos((Math.PI * xR) / (2 * HW)) ** 2;
  }
  // the left hand lunges for the wild "?" and misses
  const lunge = seg(t, 1.95, 2.25, SOFT) * (1 - seg(t, 2.35, 2.85, SOFT));
  const hand = (x: number, d: number, dx: number, dy: number) => (
    <g transform={`translate(${x + dx} ${YH + BR + 10 + DIP * d + dy}) scale(${sc.toFixed(4)})`}>
      <rect x={-44} y={-9} width={88} height={18} rx={9} fill={C.navy} />
    </g>
  );
  return <>{hand(XL, dL, -40 * lunge, -22 * lunge)}{hand(XR, dR, 0, 0)}</>;
};

// ---------- text ----------
const Line: React.FC<{ v: number; y: number; size: number; weight?: number; color?: string; children: React.ReactNode }> = ({ v, y, size, weight = 800, color = C.navy, children }) => {
  if (v <= 0.001) return null; // (settled lines snap to 0: a 0.04 px offset re-rasterises the text at the loop seam)
  return (
    <div style={{ position: "absolute", left: TX, top: y, fontSize: size, fontWeight: weight, color, lineHeight: 1, letterSpacing: "-0.02em", whiteSpace: "nowrap",
      opacity: clamp01(v * 1.4), transform: `translateY(${(Math.abs(1 - v) < 0.02 ? 0 : (1 - v) * 38).toFixed(2)}px)`, fontVariantNumeric: "tabular-nums" }}>{children}</div>
  );
};

export const Loop: React.FC = () => {
  const t = useT();
  const drift = 6 * Math.cos((2 * Math.PI * t) / 5);
  // while the rows are full the stage leans in a little and back (smooth, no bounce)
  const zoom = 1 + 0.05 * Math.sin(Math.PI * clamp01((t - 5.2) / 3.6)) ** 2;
  const tile = tileState(t);
  const docked = clamp01(pop(t, KB.hop, { dur: 0.55 }));
  const dot = 1 + 0.35 * docked * Math.max(0, Math.sin(2 * Math.PI * cyc(t, 1.25))) ** 4;
  // text visibilities (staggered lines)
  const prob = (d: number) => vis(t, TXT.probIn + d, TXT.probOut + d * 0.5);
  const sol = (d: number) => vis(t, TXT.solIn + d, TXT.solOut + d * 0.5);
  const res = (d: number) => vis(t, TXT.resIn + d, TXT.resOut + d * 0.5);
  const count = Math.round(40 * seg(t, TXT.resIn, TXT.resIn + 0.6, (x) => 1 - Math.pow(1 - x, 3)));
  // the cyan pill over the text: a small smear between states (stretches, then settles at the next width)
  const pillW = (() => {
    const base = t < TXT.probOut ? 84 : t < TXT.solOut ? lerp(84, 132, seg(t, TXT.probOut, TXT.solIn + 0.3)) : t < TXT.resOut ? lerp(132, 60, seg(t, TXT.solOut, TXT.resIn + 0.3)) : lerp(60, 84, seg(t, TXT.resOut, TXT.probIn + 0.3));
    const smear = [TXT.probOut, TXT.solOut, TXT.resOut].reduce((a, at) => a + 110 * Math.sin(Math.PI * clamp01((t - at) / 0.75)) ** 2, 0);
    return base + smear;
  })();
  const pillY = lerp(404, 360, seg(t, TXT.solOut, TXT.resIn + 0.3) - seg(t, TXT.resOut, TXT.probIn + 0.3));
  const shimmer = seg(t, 7.0, 7.7, INOUT);
  return (
    <Frame>
      {/* ---------- stage ---------- */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${drift.toFixed(2)}px) scale(${zoom.toFixed(5)})`, transformOrigin: "680px 560px" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${STAGE})`, transformOrigin: "680px 540px" }}>
        {/* the intake card */}
        <div style={{ position: "absolute", left: CX0, top: CY0, width: CW, height: CH, borderRadius: 22, background: C.white, boxShadow: SHADOW.card, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: HEAD, height: 1.5, background: C.line }} />
          <Img src={staticFile("cases/jongleren/jongleren-mark.png")} style={{ position: "absolute", left: 24, top: 16, height: 52 }} />
          <Img src={staticFile("cases/jongleren/jongleren-wordmark.png")} style={{ position: "absolute", left: 76, top: 31, height: 23 }} />
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {SPECS.map((b) => <Row key={b.kind} t={t} b={b} />)}
          <Stopwatch t={t} />
          <Hands t={t} />
        </svg>
        {/* the shimmer runs over the rows (they are drawn above the card): a second pass on top */}
        {shimmer > 0 && shimmer < 1 && (
          <div style={{ position: "absolute", left: CX0, top: CY0 + HEAD, width: CW, height: CH - HEAD, overflow: "hidden", borderRadius: "0 0 22px 22px" }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, width: 160, left: lerp(-200, CW + 40, shimmer), background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.6), rgba(255,255,255,0))" }} />
          </div>
        )}
        {/* the K.B tile */}
        {tile.sc > 0.001 && (
          <div style={{ position: "absolute", left: tile.x - tile.s / 2, top: tile.y - tile.s / 2, width: tile.s, height: tile.s, transform: `scale(${tile.sc.toFixed(4)}) rotate(${tile.rot.toFixed(2)}deg)` }}>
            <KBTile size={tile.s} dot={dot} />
          </div>
        )}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {SPECS.map((b) => <Trail key={b.kind} t={t} b={b} />)}
          {SPECS.map((b) => <Ball key={b.kind} t={t} b={b} />)}
        </svg>
      </div>

      </div>
      {/* ---------- text column ---------- */}
      <div style={{ position: "absolute", left: TX, top: pillY, width: pillW, height: 12, borderRadius: 6, background: C.cyan }} />
      <Line v={prob(0)} y={445} size={98}>70-minute</Line>
      <Line v={prob(0.08)} y={549} size={98}>intakes</Line>
      <Line v={sol(0)} y={445} size={98}>Automated</Line>
      <Line v={sol(0.08)} y={549} size={98}>intake</Line>
      <Line v={res(0)} y={396} size={224}>~{count}h</Line>
      <Line v={res(0.1)} y={630} size={46} weight={600} color={C.muted}>saved per month</Line>
    </Frame>
  );
};
