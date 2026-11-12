// Abroad Internships: "The week drains into K.B" (../cases/abroad-internships.md).
// Problem: one centred planner card, Abroad Internships' working week (their logo, a stack of 7 team avatars, M–F),
// crammed with 21 manual task blocks in their colours (follow-ups indigo, payments orange, outreach lilac, CRM sand)
// that keep landing until the last four pile crooked on top. K.B steps in: the tile drops into the middle of the week,
// shoves the blocks aside and opens a ring of 21 grey dots. Solution: in a clockwise radar sweep every block takes off and
// spirals into the tile; each landing lights one dot (21 automations). Result: the empty week fills with a cyan wash of
// free time, the tile glides left and "~30h saved per week" settles beside it. Return: the figure folds away, the tile
// pops out and the tasks land again. Flourish ("flight-path vortex"): each block squashes, rounds into a ball in its ink
// colour and whips into the tile as a tapered swoosh with a chevron head (the arc arrow of the Abroad Internships logo),
// leaving a dashed airline-route trail that drains in after it. Seamless: block landings at the end of the loop are
// evaluated at t + 10 at the start (wrap).
import React from "react";
import { Easing, Img, staticFile } from "remotion";
import { Frame, useT, pop, popOut, seg, cyc, clamp01, lerp, INOUT, OUT, SOFT } from "../loop";
import { C, KBTile } from "../kb";

// Abroad Internships (abroad-internships.com CSS + stamps): indigo, orange, pastel lilac and sand; stamp pink and yellow.
const AI = { indigo: "#020155", orange: "#FF9956", lilac: "#EFD9FA", sand: "#F4DAA6", pink: "#EFADDB", yellow: "#FBD45B" };
// task types: follow-ups, payment confirmations, company outreach, CRM updates
const FILL = [AI.indigo, AI.orange, AI.lilac, AI.sand];
const INK = [AI.indigo, AI.orange, AI.pink, "#F2C14E"];
const ICONC = ["#FFFFFF", "#FFFFFF", AI.indigo, AI.indigo];
const AVA = ["#FFB099", "#64B3B5", "#85B068", "#FBD45B", "#EFADDB", "#E1BC85", "#FC6F42"];
const TAU = Math.PI * 2;
const wrap = (t: number) => (t < 7 ? t + 10 : t);
const bump = (t: number, at: number, dur: number) => Math.sin(Math.PI * clamp01((t - at) / dur)) ** 2;
const hex = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const mix = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, j) => Math.round(lerp(v, B[j], clamp01(k)))).join(",")})`;
};

// ---------- planner geometry ----------
const CARD = { x: 250, y: 214, w: 1420, h: 752 };
const BODY = { x: 278, y: 350, w: 1364, h: 596 };
const COLW = BODY.w / 5, ROWH = BODY.h / 4, BW = 248;
const HUB0 = { x: 960, y: BODY.y + BODY.h / 2 };
const HUB1X = 660;
type Blk = { x: number; y: number; w: number; h: number; r: number; type: number; big: boolean; over: boolean; drop: number };
const slot = (c: number, r: number, span: number, type: number) => ({
  x: BODY.x + COLW * (c + 0.5), y: BODY.y + ROWH * (r + span / 2), w: BW, h: ROWH * span - 24, r: 0, type, big: span > 1, over: false,
});
const GRID = [
  slot(0, 0, 1, 0), slot(0, 1, 2, 1), slot(0, 3, 1, 2),
  slot(1, 0, 1, 3), slot(1, 1, 1, 0), slot(1, 2, 1, 1), slot(1, 3, 1, 3),
  slot(2, 0, 2, 1), slot(2, 2, 1, 3), slot(2, 3, 1, 0),
  slot(3, 0, 1, 2), slot(3, 1, 1, 1), slot(3, 2, 2, 0),
  slot(4, 0, 1, 1), slot(4, 1, 1, 3), slot(4, 2, 1, 0), slot(4, 3, 1, 2),
];
// landing order: far right first, the column under the departing tile after it has gone, pale blocks last (calm seam)
const ORDER = [13, 15, 11, 16, 10, 14, 12, 8, 7, 9, 0, 5, 1, 4, 2, 6, 3];
const OVER = [
  { x: BODY.x + COLW * 1.5 + 22, y: BODY.y + ROWH * 2 - 8, r: -7, type: 1 },
  { x: BODY.x + COLW * 3.5 - 16, y: BODY.y + ROWH * 1 + 4, r: 6, type: 0 },
  { x: BODY.x + COLW * 4.5 - 22, y: BODY.y + ROWH * 2.55, r: -5, type: 2 },
  { x: BODY.x + COLW * 0.5 + 18, y: BODY.y + ROWH * 0.95, r: 8, type: 3 },
];
// the flood: a little sparser at both ends (g' = 1.25 → 0.75 → 1.25), pale blocks last so the seam stays calm
const flood = (x: number) => x + 0.04 * Math.sin(TAU * x);
const BLOCKS: Blk[] = [
  ...GRID.map((g, i) => ({ ...g, drop: 8.38 + 1.3 * flood(ORDER.indexOf(i) / 16) })),
  ...OVER.map((o, i) => ({ ...o, w: BW, h: ROWH - 24, big: false, over: true, drop: 10.4 + i * 0.4 })),
];
// launch order: a clockwise radar sweep round the hub, starting at 12 o'clock
const ang = (b: Blk) => (((Math.atan2(b.y - HUB0.y, b.x - HUB0.x) + Math.PI / 2) % TAU) + TAU) % TAU;
const SWEEP = BLOCKS.map((b, i) => ({ i, a: ang(b) })).sort((p, q) => p.a - q.a).map((p) => p.i);
const L0 = 3.05, LSPAN = 2.1, FLY = 0.9, LAG = 0.17, SW = 0.95 * Math.PI, EY = 0.55;
// the sweep speeds up: launches sparse at first, denser later
const lk = (k: number) => { const x = k / 20; return L0 + LSPAN * x * (1.35 - 0.35 * x); };
const launch = (i: number) => lk(SWEEP.indexOf(i));
const FE = Easing.bezier(0.55, 0, 0.3, 1);
const N = 21;
const ARRIVE = (k: number) => lk(k) + FLY;

// hub position (the tile glides left for the result)
const hubAt = (t: number) => ({ x: lerp(HUB0.x, HUB1X, seg(t, 5.95, 6.8, INOUT)), y: HUB0.y });
// K.B arrival shove: blocks near the centre are pushed outward
const shove = (b: Blk, t: number) => {
  const dx = b.x - HUB0.x, dy = b.y - HUB0.y, d = Math.max(1, Math.hypot(dx, dy));
  const amt = 50 * Math.exp(-((d / 330) ** 2)) * pop(t, 2.42 + d / 4000, { dur: 0.5, over: 0.08 });
  return { x: (dx / d) * amt, y: (dy / d) * amt };
};
// a block's flight: spiral from its launch spot into the hub (u in 0..1)
const flightPos = (b: Blk, u: number, t: number) => {
  const sh = shove(b, launch(BLOCKS.indexOf(b)));
  // the spiral runs in ellipse-normalised space (vertical radius × EY) so every path stays inside the card
  const sx = b.x + sh.x - HUB0.x, sy = (b.y + sh.y - HUB0.y) / EY;
  const r0 = Math.hypot(sx, sy), a0 = Math.atan2(sy, sx), s = FE(clamp01(u));
  const r = r0 * Math.pow(1 - s, 0.85), a = a0 + SW * s, H = hubAt(t);
  return { x: H.x + r * Math.cos(a), y: H.y + r * Math.sin(a) * EY, s };
};

// ---------- small pieces ----------
const Icon: React.FC<{ type: number; color: string; size: number }> = ({ type, color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {type === 0 && (<><rect x="3" y="5.5" width="18" height="13" rx="2.2" /><path d="M3.5 7 12 13l8.5-6" /></>)}
    {type === 1 && (<><rect x="2.5" y="5.5" width="19" height="13" rx="2.2" /><path d="M2.5 10h19" /><path d="M6 15h4" /></>)}
    {type === 2 && (<><path d="M4 20.5V6.5l7-3v17" /><path d="M11 9.5h8.5v11" /><path d="M2.5 20.5h19" /><path d="M7 9v.01M7 12.5v.01M7 16v.01M15 13v.01M15 16.5v.01" /></>)}
    {type === 3 && (<><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" /><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13" /><path d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" /></>)}
  </svg>
);

const Person: React.FC<{ color: string }> = ({ color }) => (
  <svg width={42} height={42} viewBox="-21 -21 42 42" style={{ display: "block" }}>
    <circle r={19.5} fill={color} stroke="#FFFFFF" strokeWidth={3} />
    <circle cy={-4.5} r={6.2} fill="#FFFFFF" />
    <path d="M-10.5 12.5c1.4-5.4 5.4-8.4 10.5-8.4s9.1 3 10.5 8.4" fill="#FFFFFF" />
  </svg>
);

const Line: React.FC<{ text: string; t: number; tin: number; tout: number }> = ({ text, t, tin, tout }) => {
  const k = pop(t, tin, { dur: 0.55, over: 0.04 }), o = popOut(t, tout, { dur: 0.42, over: 0.02 });
  if (k <= 0 || o <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center", fontSize: 58, fontWeight: 700, color: C.navy,
      letterSpacing: "-0.01em", lineHeight: 1.1, opacity: clamp01(k * 1.6) * clamp01(o),
      transform: `translateY(${(1 - k) * 26 - (1 - o) * 18}px) scale(${0.97 + 0.03 * Math.min(k, 1)})` }}>{text}</div>
  );
};

// smear polygon along the flight: positions over the last LAG of u, tapered to the tail
const smearPath = (b: Blk, u: number, t: number) => {
  const u1 = Math.min(u, 1), u0 = Math.max(0, u - LAG);
  if (u1 - u0 < 0.004) return null;
  const M = 22, P = Array.from({ length: M + 1 }, (_, j) => flightPos(b, lerp(u0, u1, j / M), t));
  const head = flightPos(b, u1, t), wh = lerp(30, 13, head.s);
  const L: string[] = [], R: string[] = [];
  P.forEach((p, j) => {
    const a = P[Math.max(0, j - 1)], c = P[Math.min(M, j + 1)];
    const tx = c.x - a.x, ty = c.y - a.y, tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl;
    const w = (wh / 2) * Math.pow(j / M, 0.75);
    L.push(`${(p.x + nx * w).toFixed(1)},${(p.y + ny * w).toFixed(1)}`);
    R.unshift(`${(p.x - nx * w).toFixed(1)},${(p.y - ny * w).toFixed(1)}`);
  });
  const a = P[M - 1], dx = head.x - a.x, dy = head.y - a.y, dl = Math.hypot(dx, dy) || 1;
  return { d: `M${L.join(" L")} L${R.join(" L")} Z`, head, wh, dir: { x: dx / dl, y: dy / dl } };
};

const routePath = (b: Blk, u: number, t: number) => {
  const ut = Math.max(0, (u - 0.5) / 0.95), u1 = Math.min(u, 1);
  if (u1 - ut < 0.01) return null;
  const M = 34, P = Array.from({ length: M + 1 }, (_, j) => flightPos(b, lerp(ut, u1, j / M), t));
  return "M" + P.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L");
};

// ---------- the loop ----------
export const Loop: React.FC = () => {
  const t = useT(), tt = wrap(t);
  const drift = 4 * Math.cos((TAU * t) / 5); // slow drifts sit at their turning point at the seam
  const H = hubAt(t);

  // tile, ring, wash, figure
  const tileIn = pop(t, 2.4, { dur: 0.55, over: 0.06 }) * popOut(t, 8.55, { dur: 0.45, over: 0.04 });
  let absorb = 0;
  for (let k = 0; k < N; k++) absorb += bump(t, ARRIVE(k) - 0.05, 0.24);
  const tileS = tileIn * (1 + 0.03 * Math.min(1, absorb));
  const ringRot = 0.22 * (t - 2.6);
  const ringOut = popOut(t, 8.42, { dur: 0.4, over: 0.04 });
  const runPulse = seg(t, 5.9, 6.6) * (1 - seg(t, 8.2, 8.55));
  const washR = 1150 * seg(t, 5.9, 6.95, SOFT) * (1 - seg(t, 8.35, 9.05, SOFT));
  const wave = seg(t, 2.45, 3.25, OUT);
  const figIn = pop(t, 6.45, { dur: 0.6, over: 0.05 }), labIn = pop(t, 6.65, { dur: 0.55, over: 0.05 });
  const figOut = popOut(t, 8.22, { dur: 0.4, over: 0.03 });
  const busy = 1 - seg(t, 4.2, 5.0) + seg(t, 9.2, 9.9);
  const calm = seg(t, 4.5, 5.5) - seg(t, 9.0, 9.8);

  // block states
  const states = BLOCKS.map((b, i) => {
    const L = launch(i), u = (t - L) / FLY;
    const k = pop(tt, b.drop, { dur: 0.46, over: b.over ? 0.09 : 0.06 });
    const landed = tt >= b.drop && !(t >= 2 && t < 7 && u > (b.big ? 0.5 : 0.34));
    return { b, i, L, u, k, landed, flying: t < 7 && u > -0.2 && u < 1 + LAG + 0.6 };
  });

  const renderBlock = (st: (typeof states)[number]) => {
    const { b, u, k } = st;
    if (!st.landed || k <= 0) return null;
    const ph = Math.sin(b.x * 0.013 + b.y * 0.021) * 0.5;
    const wob = (b.over ? 2.2 : 0.7) * Math.cos((TAU * t) / 2.5 + ph);
    const bob = 2.4 * Math.cos((TAU * t) / 5 + ph);
    let x = b.x, y = b.y + bob, w = b.w, h = b.h, rad = 16, rot = b.r * Math.min(1, k) + wob, sx = 1, sy = 1, op = 1, iconOp = 1;
    let fill = FILL[b.type];
    // landing
    const dropY = b.over ? -150 : -48;
    y += dropY * (1 - k);
    if (b.over) rot += -14 * (1 - k);
    const sc = (b.over ? 0.82 : 0.86) + (b.over ? 0.18 : 0.14) * k;
    op = clamp01(k * 2.2);
    // shove + launch
    if (t >= 2 && t < 7) {
      const sh = shove(b, Math.min(t, st.L));
      x += sh.x; y += sh.y;
      const sq = seg(t, st.L - 0.2, st.L, SOFT);
      if (u > 0) {
        const mu = b.big ? 0.44 : 0.28, m = seg(u, 0, mu, SOFT), p = flightPos(b, u, t);
        x = p.x; y = p.y;
        w = lerp(b.w, 30, m); h = lerp(b.h, 30, m); rad = lerp(16, 15, m); rot = lerp(rot, 0, m);
        iconOp = 1 - seg(u, 0, 0.12); fill = mix(FILL[b.type], INK[b.type], m) as string;
        op = 1 - seg(u, mu - 0.02, mu + 0.06);
        sx = 1 + 0.06 * sq * (1 - m); sy = 1 - 0.09 * sq * (1 - m);
      } else { sx = 1 + 0.06 * sq; sy = 1 - 0.09 * sq; y += 5 * sq; }
    }
    const dark = b.type < 2, bar = dark ? "rgba(255,255,255,0.55)" : "rgba(2,1,85,0.20)";
    return (
      <div key={b.x + "_" + b.y} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: rad, background: fill,
        opacity: op, transform: `rotate(${rot}deg) scale(${sc * sx}, ${sc * sy})`,
        boxShadow: b.over ? "0 18px 30px -14px rgba(2,1,85,0.45)" : "0 10px 22px -14px rgba(2,1,85,0.40)",
        display: "flex", alignItems: b.big ? "flex-start" : "center", padding: b.big ? "26px 0 0 22px" : "0 0 0 22px", boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ opacity: iconOp, display: "flex", alignItems: b.big ? "flex-start" : "center", gap: 18 }}>
          <Icon type={b.type} color={ICONC[b.type]} size={40} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ width: 128, height: 11, borderRadius: 6, background: bar }} />
            <div style={{ width: 82, height: 11, borderRadius: 6, background: bar }} />
            {b.big && <div style={{ width: 108, height: 11, borderRadius: 6, background: bar, marginTop: 18 }} />}
            {b.big && <div style={{ width: 64, height: 11, borderRadius: 6, background: bar }} />}
          </div>
        </div>
      </div>
    );
  };

  const statics = states.filter((s) => !(s.flying && s.u > 0));
  const fliers = states.filter((s) => s.flying && s.u > 0);
  const sortedStatics = [...statics.filter((s) => !s.b.over), ...statics.filter((s) => s.b.over)];

  return (
    <Frame>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${drift}px)` }}>
        {/* planner card */}
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 26, background: C.white,
          boxShadow: "0 40px 90px -40px rgba(41,58,81,0.40), 0 10px 24px -12px rgba(41,58,81,0.16)" }} />
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y + 84, width: CARD.w, height: 1.5, background: "#ECEEF3" }} />
        <Img src={staticFile("cases/abroad-internships/ai-logo.svg")} style={{ position: "absolute", left: 290, top: CARD.y + 42 - 23, height: 46 }} />
        {AVA.map((c, i) => {
          const amp = lerp(1, 0.2, calm), by = -3.2 * amp * Math.max(0, Math.sin(TAU * (t / 1.25 - i / 7)));
          const x = 1300 + i * 30, y = CARD.y + 42;
          return (
            <div key={i} style={{ position: "absolute", left: x - 21, top: y - 21 + by, width: 42, height: 42 }}>
              <Person color={c} />
              {busy > 0.01 && (
                <svg width={58} height={58} viewBox="-29 -29 58 58" style={{ position: "absolute", left: -8, top: -8, opacity: clamp01(busy) * 0.9,
                  transform: `rotate(${360 * cyc(t, 1.25, i / 7)}deg)` }}>
                  <path d="M0 -25 A25 25 0 0 1 21.65 -12.5" fill="none" stroke={AI.orange} strokeWidth={3.2} strokeLinecap="round" />
                </svg>
              )}
            </div>
          );
        })}
        {/* day labels and column rules */}
        {["M", "T", "W", "T", "F"].map((d, c) => (
          <div key={c} style={{ position: "absolute", left: BODY.x + COLW * c, width: COLW, top: CARD.y + 98, textAlign: "center", fontSize: 21,
            fontWeight: 600, color: "#8A90A2", letterSpacing: "0.08em" }}>{d}</div>
        ))}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <clipPath id="ai-body"><rect x={CARD.x + 12} y={CARD.y + 86} width={CARD.w - 24} height={CARD.h - 98} rx={18} /></clipPath>
          </defs>
          {[1, 2, 3, 4].map((c) => (
            <line key={c} x1={BODY.x + COLW * c} x2={BODY.x + COLW * c} y1={CARD.y + 96} y2={CARD.y + CARD.h - 20} stroke="#F0F1F5" strokeWidth={1.5} />
          ))}
          {washR > 1 && <circle cx={H.x} cy={H.y} r={washR} fill={C.cyanSoft} opacity={0.8} clipPath="url(#ai-body)" />}
          {GRID.map((g, i) => (
            <rect key={i} x={g.x - g.w / 2 + 3} y={g.y - g.h / 2 + 3} width={g.w - 6} height={g.h - 6} rx={14} fill="none" stroke="#DCE0E8" strokeWidth={2} strokeDasharray="8 9" />
          ))}
        </svg>

        {/* blocks */}
        {sortedStatics.map(renderBlock)}
        {fliers.map(renderBlock)}

        {/* flight-path vortex: dashed routes and swooshes */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {states.filter((s) => s.flying && s.u > 0).map((s) => {
            const d = routePath(s.b, s.u, t);
            const fade = 1 - seg(s.u, 1.25, 1.45);
            return d ? <path key={"r" + s.i} d={d} fill="none" stroke={INK[s.b.type]} strokeWidth={3.4} strokeDasharray="10 12" strokeLinecap="round" opacity={0.6 * fade} /> : null;
          })}
          {states.filter((s) => s.flying && s.u > 0.1).map((s) => {
            const sm = smearPath(s.b, s.u, t);
            if (!sm) return null;
            const col = INK[s.b.type], o = seg(s.u, 0.1, 0.27) * (1 - seg(s.u, 0.97, 1.0));
            const { head, wh, dir } = sm, nx = -dir.y, ny = dir.x, cl = wh / 2 + 5, sz = 8 + wh * 0.25;
            const chev = s.u < 0.97 ? `M${head.x + dir.x * cl - dir.x * sz + nx * sz},${head.y + dir.y * cl - dir.y * sz + ny * sz} L${head.x + dir.x * cl},${head.y + dir.y * cl} L${head.x + dir.x * cl - dir.x * sz - nx * sz},${head.y + dir.y * cl - dir.y * sz - ny * sz}` : null;
            return (
              <g key={"s" + s.i} opacity={o}>
                <path d={sm.d} fill={col} />
                {s.u < 1 && <circle cx={head.x} cy={head.y} r={wh / 2} fill={col} />}
                {chev && <path d={chev} fill="none" stroke={s.b.type === 3 ? "#E0A93A" : col} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" opacity={seg(s.u, 0.2, 0.32)} />}
              </g>
            );
          })}
          {/* K.B arrival wave and the ring of 21 automations */}
          {wave > 0 && wave < 1 && <circle cx={H.x} cy={H.y} r={84 + 230 * wave} fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.7 * (1 - wave)} />}
          {runPulse > 0.01 && (() => {
            const a0 = -Math.PI / 2 + TAU * cyc(t, 2) + ringRot, a1 = a0 - 1.1, R = 150;
            return <path d={`M${H.x + R * Math.cos(a1)},${H.y + R * Math.sin(a1)} A${R} ${R} 0 0 1 ${H.x + R * Math.cos(a0)},${H.y + R * Math.sin(a0)}`}
              fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" opacity={0.85 * runPulse} />;
          })()}
          {Array.from({ length: N }, (_, i) => {
            const kin = pop(t, 2.62 + i * 0.016, { dur: 0.42, over: 0.12 }) * ringOut;
            if (kin <= 0.001) return null;
            const lit = pop(t, ARRIVE(i) - 0.04, { dur: 0.32, over: 0.25 });
            const a = -Math.PI / 2 + (i / N) * TAU + ringRot;
            const pd = Math.abs(((a - (-Math.PI / 2 + TAU * cyc(t, 2) + ringRot)) % TAU + TAU + Math.PI) % TAU - Math.PI);
            const pulse = runPulse * Math.exp(-((pd / 0.45) ** 2));
            const r = 6.6 * kin * (1 + 0.5 * bump(t, ARRIVE(i) - 0.04, 0.4) + 0.4 * pulse);
            return <circle key={i} cx={H.x + 130 * Math.cos(a)} cy={H.y + 130 * Math.sin(a)} r={Math.max(0, r)} fill={mix("#D3D7E0", C.cyan, lit)} />;
          })}
        </svg>
        {tileS > 0.001 && (
          <div style={{ position: "absolute", left: H.x - 75, top: H.y - 75, width: 150, height: 150, transform: `scale(${tileS})` }}>
            <KBTile size={150} dot={1 + 0.35 * Math.min(1, absorb) + 0.15 * runPulse * Math.sin((TAU * t) / 2) ** 2} />
          </div>
        )}
        {/* Barcelona stamp tucked on the card corner */}
        <Img src={staticFile("cases/abroad-internships/stamp-barcelona.svg")} style={{ position: "absolute", left: 1652 - 78, top: 222 - 61, width: 156,
          transform: `rotate(${9 + 1.6 * Math.cos((TAU * t) / 5)}deg)`, filter: "drop-shadow(0 8px 12px rgba(41,58,81,0.22))" }} />

        {/* result */}
        {figIn > 0 && figOut > 0.001 && (
          <div style={{ position: "absolute", left: 868, top: HUB0.y - 142, opacity: clamp01(figIn * 1.6) * clamp01(figOut),
            transform: `translateX(${(1 - figIn) * 46}px) translateY(${-(1 - figOut) * 14}px) scale(${(0.96 + 0.04 * Math.min(1, figIn)) * (1 + 0.04 * seg(t, 6.7, 8.6, INOUT))})`, transformOrigin: "0% 50%" }}>
            <div style={{ fontSize: 212, fontWeight: 800, color: C.navy, lineHeight: 1, letterSpacing: "-0.03em" }}>~30h</div>
            <div style={{ fontSize: 48, fontWeight: 600, color: C.muted, marginTop: 10, marginLeft: 8, opacity: clamp01(labIn * 1.6),
              transform: `translateY(${(1 - labIn) * 18}px)` }}>saved per week</div>
          </div>
        )}
      </div>

      <Line text="7 people, manual work" t={tt} tin={9.25} tout={12.75} />
      <Line text="21 automations" t={t} tin={3.35} tout={6.2} />
    </Frame>
  );
};
