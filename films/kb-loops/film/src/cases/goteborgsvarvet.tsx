// Göteborgsvarvet: "Every lane to one finish" (../cases/goteborgsvarvet.md).
// Problem: four scattered Excel files (travel, food, materials, other emissions) while a follow-up envelope hops between
// them and drops red badges. K.B steps in: the tile arrives, the files line up in a start grid, the tile grows into a GV
// dashboard card. Solution: each file squashes into a pill and smears down its lane as a GV-coloured stripe with a white
// inline (the GV logo's letter style), laps the donut over the segments already filled and settles as its own quarter.
// Result: 100% successful submissions, a glint runs one victory lap. Return: the card folds into the tile and the files
// burst back out to their scattered spots. Seamless: the end-of-loop arrivals are evaluated at t + 10 at the start.
import React from "react";
import { Img, staticFile } from "remotion";
import { Frame, useT, pop, popOut, seg, clamp01, lerp, INOUT, OUT, SOFT } from "../loop";
import { C, KBTile, SHADOW } from "../kb";

const GV = { blue: "#134F97", red: "#AB1C46", sky: "#59CBE8", orange: "#FF8F1C" };
const CAT = [GV.blue, GV.red, GV.orange, GV.sky];
const TILE = { x: 960, y: 540, s: 150 };
const CARD = { x: 1398, y: 590, w: 600, h: 708 };
const RING = { x: 1398, y: 600, r: 190, w: 40 };
const FW = 180, FH = 220, FS = 1.3, GS = 0.62, PILL = 162;
const SCAT = [
  { x: 480, y: 610, r: -7, ph: 0 },
  { x: 880, y: 785, r: 5, ph: 0.3 },
  { x: 1262, y: 445, r: -4, ph: 0.55 },
  { x: 1540, y: 738, r: 8, ph: 0.8 },
];
const GRID = (i: number) => ({ x: 250, y: 375 + 150 * i, r: 0, s: GS });
const S = [3.85, 4.45, 5.05, 5.65];
const DUR = (i: number) => 1.0 + 0.05 * i;
const LAND = (i: number) => S[i] + 0.12 + DUR(i);
const TAU = Math.PI * 2;
const bump = (t: number, at: number, dur: number) => Math.sin(Math.PI * clamp01((t - at) / dur)) ** 2;
const wrap = (t: number) => (t < 5 ? t + 10 : t); // end-of-loop arrivals continue into the start
const hex = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const mix = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, j) => Math.round(lerp(v, B[j], clamp01(k)))).join(",")})`;
};
type Pose = { x: number; y: number; r: number; s: number };
const lp = (a: Pose, b: Pose, k: number): Pose => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), r: lerp(a.r, b.r, k), s: lerp(a.s, b.s, k) });

// ---------- lanes: start grid → converging S → one finish straight → clockwise round the ring ----------
type Lane = { d: string; L: number; rail: number; seg: number };
const LANES: Lane[] = [0, 1, 2, 3].map((i) => {
  const y = 375 + 150 * i, pts: [number, number][] = [];
  for (let x = 250 - (PILL - RING.w) / 2; x < 760; x += 8) pts.push([x, y]);
  const top = RING.y - RING.r;
  const P = [[760, y], [945, y], [945, top], [1130, top]];
  for (let k = 0; k <= 48; k++) {
    const u = k / 48, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3;
    pts.push([a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0], a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1]]);
  }
  for (let x = 1138; x < RING.x; x += 8) pts.push([x, top]);
  const railEnd = pts.length;
  for (let k = 0; k <= 45 * (i + 1); k++) {
    const th = ((-90 + 2 * k) * Math.PI) / 180;
    pts.push([RING.x + RING.r * Math.cos(th), RING.y + RING.r * Math.sin(th)]);
  }
  const cum = [0];
  for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
  const L = cum[cum.length - 1];
  return { d: "M" + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L"), L, rail: cum[railEnd - 1], seg: L - cum[railEnd + 45 * i] };
});
const RING_D = `M${RING.x},${RING.y - RING.r}A${RING.r},${RING.r} 0 1 1 ${RING.x},${RING.y + RING.r}A${RING.r},${RING.r} 0 1 1 ${RING.x},${RING.y - RING.r}`;
const BIG = 9999;

// ---------- pieces ----------
const Icon: React.FC<{ i: number }> = ({ i }) => {
  const st = { fill: "none", stroke: "#fff", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (i === 0) return <path transform="rotate(45)" fill="#fff" d="M0,-12C1.6,-12 2.2,-10.4 2.2,-9V-3.2L11,2V5L2.2,2.6V8L5,10.4V12.4L0,11L-5,12.4V10.4L-2.2,8V2.6L-11,5V2L-2.2,-3.2V-9C-2.2,-10.4 -1.6,-12 0,-12Z" />;
  if (i === 1) return <g {...st}><path d="M-5,-11V11M-8.5,-11V-4.5Q-8.5,-1 -5,-1Q-1.5,-1 -1.5,-4.5V-11" /><path d="M5.5,11V-11Q10,-7 10,-1.5L5.5,-0.5" /></g>;
  if (i === 2) return <g {...st}><path d="M0,-11L10,-6V6L0,11L-10,6V-6Z" /><path d="M-10,-6L0,-1L10,-6M0,-1V11" /></g>;
  return <path fill="#fff" d="M-9,7H8.5A5.5,5.5 0 0 0 8.5,-4A7.5,7.5 0 0 0 -5.5,-5A6,6 0 0 0 -9,7Z" />;
};

const Sheet: React.FC<{ i: number }> = ({ i }) => (
  <svg width={FW} height={FH} viewBox={`0 0 ${FW} ${FH}`} style={{ position: "absolute", left: 0, top: 0 }}>
    <path d="M146,0V25Q146,34 155,34H180Z" fill="#E2E8F0" />
    <circle cx={40} cy={42} r={22} fill={CAT[i]} />
    <g transform="translate(40 42) scale(0.92)"><Icon i={i} /></g>
    <rect x={74} y={32} width={62} height={9} rx={4.5} fill="#D5DCE5" />
    <rect x={74} y={48} width={40} height={8} rx={4} fill="#E8ECF2" />
    <rect x={18} y={84} width={144} height={28} fill={CAT[i]} opacity={0.14} />
    <rect x={18 + ((74 + i * 29) % 3) * 48} y={140} width={48} height={28} fill={C.warnSoft} />
    {[0, 1, 2, 3, 4].map((r) => <line key={"h" + r} x1={18} x2={162} y1={84 + r * 28} y2={84 + r * 28} stroke="#E2E8F0" strokeWidth={1.5} />)}
    {[0, 1, 2, 3].map((c) => <line key={"v" + c} x1={18 + c * 48} x2={18 + c * 48} y1={84} y2={196} stroke="#E2E8F0" strokeWidth={1.5} />)}
    {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => {
      const w = 14 + ((r * 7 + c * 11 + i * 5) % 4) * 6;
      return <rect key={r + "-" + c} x={24 + c * 48} y={94 + r * 28} width={w} height={7} rx={3.5} fill={r === 0 ? CAT[i] : r === 2 && c === (74 + i * 29) % 3 ? C.warn : "#C9D2DC"} opacity={r === 0 ? 0.55 : 1} />;
    }))}
  </svg>
);

const File: React.FC<{ i: number; p: Pose; q?: number; badge?: number }> = ({ i, p, q = 0, badge = 0 }) => {
  const w = lerp(FW * p.s, PILL, q), h = lerp(FH * p.s, RING.w, q), ear = 34 * p.s * (1 - q);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, width: 0, height: 0, transform: `rotate(${p.r}deg)` }}>
      <div style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, filter: "drop-shadow(0 14px 18px rgba(41,58,81,0.22))" }}>
        <div style={{ position: "absolute", inset: 0, background: mix("#FFFFFF", CAT[i], q), borderRadius: lerp(14 * p.s, RING.w / 2, q),
          clipPath: `polygon(0 0, ${w - ear}px 0, ${w}px ${ear}px, ${w}px ${h}px, 0 ${h}px)`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: FW, height: FH, transform: `scale(${p.s})`, transformOrigin: "0 0", opacity: clamp01(1 - q * 1.8) }}>
            <Sheet i={i} />
          </div>
        </div>
      </div>
      {badge > 0.001 && (
        <svg width={40} height={40} viewBox="-20 -20 40 40" style={{ position: "absolute", left: (FW / 2 - 8) * p.s - 20, top: (-FH / 2 + 46) * p.s - 20, transform: `scale(${badge * p.s})`, overflow: "visible" }}>
          <circle r={16} fill={C.warn} stroke="#fff" strokeWidth={3} />
          <path d="M0,-8V2" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" />
          <circle cy={7.5} r={2.1} fill="#fff" />
        </svg>
      )}
    </div>
  );
};

const Envelope: React.FC<{ x: number; y: number; s: number; r: number }> = ({ x, y, s, r }) => (
  <svg width={92} height={66} viewBox="0 0 92 66" style={{ position: "absolute", left: x - 46, top: y - 33, transform: `rotate(${r}deg) scale(${s})`, overflow: "visible",
    filter: "drop-shadow(0 10px 12px rgba(41,58,81,0.25))" }}>
    <rect x={3} y={5} width={84} height={58} rx={9} fill="#fff" stroke={C.navy} strokeWidth={3} />
    <path d="M9,12L45,38L81,12" fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={84} cy={7} r={9} fill={C.warn} stroke="#fff" strokeWidth={2.5} />
  </svg>
);

const Headline: React.FC<{ t: number; at: number; out: number; bar: string; children: React.ReactNode }> = ({ t, at, out, bar, children }) => {
  const a = pop(t, at, { dur: 0.55, over: 0.05 }), o = popOut(t, out, { dur: 0.4, over: 0.03 });
  if (a <= 0.001 || o <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 170, top: 116, opacity: clamp01(a) * clamp01(o), transform: `translateY(${(1 - a) * 46 + (1 - o) * -24}px)` }}>
      <div style={{ fontSize: 78, fontWeight: 700, color: C.navy, letterSpacing: "-0.015em", lineHeight: 1.1, whiteSpace: "nowrap" }}>{children}</div>
      <div style={{ marginTop: 16, marginLeft: 3, width: 76 * clamp01(a) * clamp01(o), height: 9, borderRadius: 5, background: bar }} />
    </div>
  );
};

// ---------- the loop ----------
export const Loop: React.FC = () => {
  const t = useT();

  // scattered pose of each file: slow periodic drift (periods 2.5 / 5 s), a nudge when the envelope lands on it
  const scat = (i: number): Pose => {
    const c = SCAT[i], land = i * 0.625;
    return { x: c.x + 14 * Math.sin(TAU * (t / 2.5 + c.ph)), y: c.y + 16 * Math.sin(TAU * (t / 5 + c.ph)) + 12 * bump(t, land, 0.42),
      r: c.r + 3 * Math.sin(TAU * (t / 5 + c.ph + 0.25)) + 3 * bump(t, land + 0.04, 0.4), s: FS };
  };
  const tilePose: Pose = { x: TILE.x, y: TILE.y, r: 0, s: 0.25 };
  const arrive = (i: number) => pop(wrap(t), 9.1 + 0.06 * i, { dur: 0.55, over: 0.05 });

  // envelope (manual follow-ups): hops f0 → f1 → f2 → f3 → f0 every 0.625 s with a dotted trail; flies into the K.B
  // tile; comes back out of it at the end
  const spot = (k: number) => { const p = scat(k % 4); return { x: p.x + 44, y: p.y - 60 }; };
  const c4 = ((t / 2.5) % 1) * 4, hk = Math.floor(c4), hf = c4 - hk, hu = INOUT(hf);
  const A = spot(hk), B = spot(hk + 1), ARC = 160;
  const at = (u: number) => ({ x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u) - ARC * Math.sin(Math.PI * u) });
  const hop = { ...at(hu), r: Math.sign(B.x - A.x) * 10 * Math.sin(Math.PI * hu) };
  let env = { ...hop, s: 1 }, trailOp = 0;
  if (t < 5) {
    const kA = seg(t, 1.95, 2.45, INOUT), kE = pop(t + 10, 9.3, { dur: 0.45, over: 0.06 });
    env = { x: lerp(hop.x, TILE.x, kA), y: lerp(hop.y, TILE.y, kA), r: hop.r * (1 - kA), s: kE * popOut(t, 2.22, { dur: 0.26, over: 0.06 }) };
    trailOp = 1 - seg(t, 1.9, 2.15);
  } else {
    const kE = pop(t, 9.3, { dur: 0.45, over: 0.06 });
    env = { x: lerp(TILE.x, hop.x, kE), y: lerp(TILE.y, hop.y, kE), r: hop.r * kE, s: kE };
    trailOp = seg(t, 9.55, 9.8);
  }
  const uT = INOUT(clamp01((hf - 0.3) / 0.7));
  const trail = Array.from({ length: 17 }, (_, k) => at(lerp(uT, hu, k / 16)));

  // K.B tile → dashboard card (white disc reveal) → glides to the centre → folds back into the K.B tile
  const tileIn = t < 5 ? pop(t, 2.05, { dur: 0.45, over: 0.06 }) : 1;
  const tileOut = popOut(t, 9.32, { dur: 0.45, over: 0.05 });
  const G = pop(t, 2.72, { dur: 1.0, over: 0.03 }) - pop(t, 8.66, { dur: 0.62, over: 0.03 });
  const landBump = [0, 1, 2, 3].reduce((a, i) => a + bump(t, LAND(i) - 0.15, 0.45), 0);
  const kG = INOUT(seg(t, 6.85, 7.85)), hs = 1 + 0.05 * kG + 0.012 * landBump;
  const off = { x: (TILE.x - CARD.x) * kG, y: (TILE.y - CARD.y) * kG };
  const card = { x: lerp(TILE.x, CARD.x + off.x, G), y: lerp(TILE.y, CARD.y + off.y, G), w: lerp(TILE.s, CARD.w, G), h: lerp(TILE.s, CARD.h, G) };
  const cardS = Math.max(0, tileIn * tileOut) * (1 + (hs - 1) * clamp01(G));
  const disc = INOUT(seg(t, 2.86, 3.5)) - INOUT(seg(t, 8.92, 9.2));
  const kbLetters = clamp01(1 - seg(t, 2.8, 2.98) + seg(t, 9.05, 9.22));
  const outK = popOut(t, 8.52, { dur: 0.36, over: 0.04 });
  const inK = (j: number) => pop(t, 3.3 + 0.08 * j, { dur: 0.45, over: 0.05 });
  const content = (j: number) => clamp01(inK(j)) * clamp01(outK);

  // lanes, stripes, counter
  const railsA = 1 - seg(t, 6.95, 7.5);
  const heads = LANES.map((Ln, i) => (t < S[i] ? 0 : lerp(PILL - RING.w, Ln.L, pop(t, S[i], { dur: 0.8 * DUR(i), over: 0.02 }))));
  const tails = LANES.map((Ln, i) => (Ln.L - Ln.seg) * SOFT(clamp01((t - S[i] - 0.12) / DUR(i))));
  const ghosts = LANES.map((Ln, i) => (Ln.L - Ln.seg) * SOFT(clamp01((t - S[i] - 0.24) / DUR(i))));
  const filled = LANES.reduce((a, _, i) => a + seg(t, S[i] + 0.62 * DUR(i), LAND(i), OUT), 0);
  const pct = Math.round(25 * filled);
  const ringScale = lerp(0.82, 1, clamp01(inK(2))) * lerp(0.6, 1, clamp01(outK));
  const ringOp = clamp01(Math.min(inK(2), outK));
  const halo = seg(t, 6.9, 7.7, OUT);
  const glint = seg(t, 7.8, 8.6, INOUT);
  const check = seg(t, 7.55, 7.9, OUT);
  const stage: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${CARD.x}px ${CARD.y}px`,
    transform: `translate(${off.x}px, ${off.y}px) scale(${hs})` };

  return (
    <Frame>
      {/* rails under everything */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {LANES.map((Ln, i) => {
          const draw = seg(t, 3.2 + 0.07 * i, 3.85 + 0.07 * i, OUT);
          if (draw <= 0 || railsA <= 0) return null;
          return (
            <g key={i} opacity={railsA}>
              <path d={Ln.d} fill="none" stroke="#DCE3EB" strokeWidth={4} strokeLinecap="round" strokeDasharray={`${Ln.rail * draw} ${BIG}`} />
              {t >= S[i] && <path d={Ln.d} fill="none" stroke={CAT[i]} strokeOpacity={0.32} strokeWidth={8} strokeLinecap="round" strokeDasharray={`${Math.min(heads[i], Ln.rail)} ${BIG}`} />}
            </g>
          );
        })}
        {trailOp > 0.001 && env.s > 0.001 && (
          <path d={"M" + trail.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("L")} fill="none" stroke={C.navy} strokeOpacity={0.4 * trailOp}
            strokeWidth={4} strokeLinecap="round" strokeDasharray="0.1 13" />
        )}
      </svg>

      {/* files */}
      {[0, 1, 2, 3].map((i) => {
        if (t < 5) {
          const base = lp(tilePose, scat(i), arrive(i));
          const g = pop(t, 2.4 + 0.08 * i, { dur: 0.6, over: 0.04 });
          const q = seg(t, S[i] - 0.22, S[i], INOUT);
          const gp = GRID(i), bob = 6 * Math.sin(TAU * (t / 1.25 + i / 4)) * (1 - q) * clamp01(g);
          const p = lp(base, { ...gp, y: gp.y + bob }, g);
          const badge = pop(t, i * 0.625 + 0.08, { dur: 0.35, over: 0.08 }) * popOut(t, 2.28 + 0.04 * i, { dur: 0.25, over: 0.05 });
          return t < S[i] ? <File key={i} i={i} p={p} q={q} badge={Math.max(0, badge)} /> : null;
        }
        if (t < 8) return null;
        const k = arrive(i);
        return k > 0.001 ? <File key={i} i={i} p={lp(tilePose, scat(i), k)} /> : null;
      })}

      {/* envelope */}
      {env.s > 0.001 && <Envelope x={env.x} y={env.y} s={env.s * 1.3} r={env.r} />}

      {/* K.B tile ⇄ dashboard card */}
      {cardS > 0.001 && (
        <div style={{ position: "absolute", left: card.x - card.w / 2, top: card.y - card.h / 2, width: card.w, height: card.h, transform: `scale(${cardS})`,
          borderRadius: lerp(12, 26, clamp01(G)), background: `linear-gradient(90deg, ${C.kbL}, ${C.kbR})`, boxShadow: SHADOW.card, overflow: "hidden" }}>
          {kbLetters > 0.001 && (
            <div style={{ position: "absolute", left: card.w / 2 - TILE.s / 2, top: card.h / 2 - TILE.s / 2, opacity: kbLetters }}>
              <KBTile size={TILE.s} shadow="" radius={0} dot={1 + 0.7 * bump(t, 2.3, 0.42)} />
            </div>
          )}
          {disc > 0.001 && <div style={{ position: "absolute", inset: 0, background: C.white, clipPath: `circle(${disc * (Math.hypot(card.w, card.h) / 2 + 4)}px at 50% 50%)` }} />}
        </div>
      )}

      {/* card content, ring, stripes, counter (frame coordinates of the open card; the stage glides with the card) */}
      <div style={stage}>
        {content(0) > 0.001 && (
          <>
            <Img src={staticFile("cases/goteborgsvarvet/goteborgsvarvet-logo.png")} style={{ position: "absolute", left: 1140, top: 268, height: 50,
              opacity: content(0), transform: `translateY(${(1 - clamp01(inK(0))) * 16}px)` }} />
            <div style={{ position: "absolute", left: 1140, top: 344, width: 520, height: 2, background: "#EEF1F5", opacity: content(1) }} />
            <div style={{ position: "absolute", left: 1470, top: 286, width: 104, height: 14, borderRadius: 7, background: "#E8ECF2", opacity: content(1),
              transform: `scaleX(${clamp01(inK(1))})`, transformOrigin: "0 50%" }} />
            <div style={{ position: "absolute", left: 1470, top: 308, width: 64, height: 10, borderRadius: 5, background: "#F0F3F7", opacity: content(1) }} />
          </>
        )}
        {content(1) > 0.001 && (
          <svg width={60} height={60} viewBox="-30 -30 60 60" style={{ position: "absolute", left: 1640 - 30, top: 294 - 30, overflow: "visible", opacity: content(1),
            transform: `scale(${clamp01(inK(1)) * (1 + 0.18 * bump(t, 7.5, 0.45))})` }}>
            <circle r={22} fill={mix("#E8ECF2", C.cyan, check)} />
            <path d="M-9,0.5L-3,6.5L9.5,-6" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
              strokeDasharray={`${check} 2`} opacity={check > 0.01 ? 1 : 0} />
          </svg>
        )}
        {content(3) > 0.001 && (
          <div style={{ position: "absolute", left: CARD.x - 300, width: 600, top: 852, textAlign: "center", fontSize: 30, fontWeight: 600, color: C.muted,
            opacity: content(3), transform: `translateY(${(1 - clamp01(inK(3))) * 18}px)` }}>successful submissions</div>
        )}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g opacity={ringOp} transform={`translate(${RING.x} ${RING.y}) scale(${ringScale}) translate(${-RING.x} ${-RING.y})`}>
            {ringOp > 0.001 && <circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke="#EBECF4" strokeWidth={RING.w} />}
            {halo > 0 && halo < 1 && <circle cx={RING.x} cy={RING.y} r={RING.r + 26 + 64 * halo} fill="none" stroke={C.cyan} strokeWidth={9 * (1 - halo) + 1} opacity={0.75 * (1 - halo)} />}
          </g>
          <g opacity={clamp01(outK)} transform={`translate(${RING.x} ${RING.y}) scale(${lerp(0.6, 1, clamp01(outK))}) translate(${-RING.x} ${-RING.y})`}>
            {LANES.map((Ln, i) => {
              if (t < S[i]) return null;
              const vis = Math.max(1, heads[i] - tails[i]), gvis = Math.max(1, heads[i] - ghosts[i]);
              const w = RING.w * (1 + 0.16 * bump(t, LAND(i) - 0.18, 0.42));
              const gop = 0.22 * (1 - seg(t, LAND(i) - 0.1, LAND(i) + 0.2));
              const inl = seg(t, S[i], S[i] + 0.12);
              return (
                <g key={i} fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {gop > 0.001 && <path d={Ln.d} stroke={CAT[i]} strokeOpacity={gop} strokeWidth={w * 0.7} strokeDasharray={`${gvis} ${BIG}`} strokeDashoffset={-ghosts[i]} />}
                  <path d={Ln.d} stroke={CAT[i]} strokeWidth={w} strokeDasharray={`${vis} ${BIG}`} strokeDashoffset={-tails[i]} />
                  <path d={Ln.d} stroke="#fff" strokeOpacity={inl} strokeWidth={5.5} strokeDasharray={`${Math.max(1, vis - 4)} ${BIG}`} strokeDashoffset={-tails[i] - 2} />
                </g>
              );
            })}
            {glint > 0 && glint < 1 && (
              <path d={RING_D} fill="none" stroke="#fff" strokeOpacity={0.6 * Math.sin(Math.PI * glint)} strokeWidth={RING.w - 12} strokeLinecap="round"
                strokeDasharray={`110 ${BIG}`} strokeDashoffset={-(TAU * RING.r - 110) * glint} />
            )}
          </g>
        </svg>
        {ringOp > 0.001 && (
          <div style={{ position: "absolute", left: RING.x - 200, width: 400, top: RING.y - 58, textAlign: "center", color: C.navy, fontWeight: 800, lineHeight: 1,
            fontVariantNumeric: "tabular-nums", opacity: ringOp, transform: `scale(${ringScale * (1 + 0.09 * bump(t, LAND(3) - 0.12, 0.5))})` }}>
            <span style={{ fontSize: 106, letterSpacing: "-0.03em" }}>{pct}</span><span style={{ fontSize: 56, marginLeft: 4 }}>%</span>
          </div>
        )}
      </div>

      {/* headlines */}
      <Headline t={t} at={0.25} out={2.35} bar={C.warn}>Scattered Excel files</Headline>
      <Headline t={t} at={3.4} out={7.0} bar={C.cyan}>One CO<span style={{ fontSize: "0.6em", verticalAlign: "-0.18em" }}>2</span> portal</Headline>
    </Frame>
  );
};
