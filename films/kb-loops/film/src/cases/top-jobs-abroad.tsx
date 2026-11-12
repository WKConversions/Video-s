// top-jobs-abroad: "Beyond the founders' circle" (../cases/top-jobs-abroad.md).
// A white hub disc is the founders' world: two navy founder avatars (gold heads), the Top Jobs Abroad logo on a name pill
// on its rim, three task chips (candidates, clients, operations) racing round them inside a tight navy ring. Outside,
// three dashed slots wait; gold pings go off in them unanswered, and a reach line from the founders hits the ring and
// recoils. The K.B tile lands on the ring at 3 o'clock and the ring opens round it like a gate. Flourish, "the budding":
// gooey buds bulge out of the tile, stretch on a thinning neck that pinches into droplets and leaves a dotted cyan link,
// and land as the navy icon circles of three white relationship cards (Employers, Suppliers, Partners) that inflate out
// of them. The chips calm down, gold opportunity dots run the links into the founders, each card gets a gold badge while
// "3" counts up. The cards fold back into buds that are sucked back into the tile, the ring closes, the tile pops off:
// the opening again.
import React from "react";
import { Img, staticFile } from "remotion";
import { Frame, useT, seg, cyc, pop, popOut, clamp01, lerp, INOUT, OUT, SOFT } from "../loop";
import { C, KBTile, SHADOW } from "../kb";

const TJA = { navy: "#001F5B", gold: "#C8A84B", pale: "#E8EDF5" }; // topjobsabroad.com CSS
const TAU = Math.PI * 2;

// ---------- layout ----------
const HUB = { x: 610, y: 640, r: 230 };
const FD = { x: 610, y: 652 }; // the founders' centre (two avatars)
const AV = 54, AVR = 46; // avatar offset from FD, radius
const ORB = { rx: 136, ry: 124, r: 30 }; // the task chips' orbit round the founders
const TILE = { x: HUB.x + HUB.r, y: HUB.y, s: 116 };
const CW = 330, CH = 112, IR = 36; // relationship card; its icon circle radius
type Kind = "building" | "box" | "link";
const NODES: { x: number; y: number; label: string; kind: Kind }[] = [
  { x: 1250, y: 405, label: "Employers", kind: "building" },
  { x: 1395, y: 640, label: "Suppliers", kind: "box" },
  { x: 1250, y: 875, label: "Partners", kind: "link" },
];
const GOO = { x: 700, y: 290, w: 840, h: 700 }; // the goo filter's region
const STAGE = 1.1, ORIGIN = "970px 640px"; // the whole picture (not the text) is drawn at this scale

// ---------- timing (s) ----------
const TXT = { probOut: 2.8, solIn: 3.4, solOut: 5.5, resIn: 5.95, resOut: 8.05, probIn: 9.1 };
const KB = { in: 2.9, out: 9.25 };
const GAP = { open: 3.15, close: 9.05 };
const BUD = [3.5, 4.12, 4.74], BD = 0.8; // a bud leaves the tile (lands ~0.42 s later, fully settled at BD)
const RET = [8.0, 8.16, 8.32], FOLD = 0.3, BACK = 0.55; // the card folds into its bud, then the bud is drawn back
const BADGE = [5.95, 6.15, 6.35];
const OPP = [{ k: 0, at: 6.45 }, { k: 1, at: 6.7 }, { k: 2, at: 6.95 }, { k: 1, at: 7.2 }, { k: 0, at: 7.4 }, { k: 2, at: 7.6 }], OPPD = 0.8; // gold opportunity dots: card → tile → founders
const PINGS = [{ k: 2, at: 9.7 }, { k: 1, at: 1.0 }, { k: 0, at: 2.2 }];
const REACH = [{ k: 0, at: 0.4 }, { k: 2, at: 1.6 }];

// ---------- helpers ----------
const hump = (x: number) => (x <= 0 || x >= 1 ? 0 : Math.sin(Math.PI * x));
const since = (t: number, at: number) => (((t - at) % 10) + 10) % 10; // cyclic time since a moment
const iconAt = (k: number, t: number) => ({ x: NODES[k].x - CW / 2 + 56, y: NODES[k].y + 7 * Math.sin(TAU * (t / 5 + k / 3)) });

// the chips race while the founders are alone and calm down once K.B is in (busy: 1 → 0 → 1)
const busy = (t: number) => 1 - seg(t, 3.3, 4.8, INOUT) + seg(t, 8.8, 9.9, INOUT);
const STEPS = 6000;
const TURNS: number[] = (() => {
  const dt = 10 / STEPS;
  let mb = 0;
  for (let i = 0; i < STEPS; i++) mb += busy((i + 0.5) * dt) / STEPS;
  const out = [0];
  let a = 0;
  for (let i = 0; i < STEPS; i++) { a += (0.2 + 0.24 * (busy((i + 0.5) * dt) - mb)) * dt; out.push(a); }
  return out; // exactly 2 turns over the loop
})();
const turns = (t: number) => {
  const x = (since(t, 0) / 10) * STEPS, i = Math.min(STEPS - 1, Math.floor(x));
  return lerp(TURNS[i], TURNS[i + 1], x - i);
};

// the bud's own clock: 0 → BD on the way out, parked at BD, BD → 0 on the way back; null when it is inside the tile
const budTau = (k: number, t: number): number | null => {
  const a = BUD[k], r0 = RET[k] + FOLD;
  if (t < a || t >= r0 + BACK) return null;
  if (t < r0) return Math.min(BD, t - a);
  return BD * (1 - (t - r0) / BACK);
};
const travel = (tau: number) => pop(tau, 0.08, { dur: 0.36, over: 0.06 });
const budGeom = (k: number, t: number, tau: number) => {
  const P1 = iconAt(k, t), dx = P1.x - TILE.x, dy = P1.y - TILE.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const e = seg(tau, 0, 0.14, OUT), p = travel(tau);
  const d = lerp(lerp(8, 52, e), L, p);
  const v = (Math.abs(travel(tau + 0.01) - travel(tau - 0.01)) / 0.02) * L;
  const st = clamp01(v / 2200);
  const r = (IR + 3) * lerp(0.35, 1, e);
  const bud = { x: TILE.x + ux * d, y: TILE.y + uy * d, rx: r * (1 + 0.38 * st), ry: r * (1 - 0.2 * st), ang: (Math.atan2(uy, ux) * 180) / Math.PI };
  const neck: { x: number; y: number; r: number }[] = [];
  if (tau > 0.02) {
    const N = 20;
    for (let i = 0; i < N; i++) {
      const f = (i + 1) / (N + 1), w = Math.abs(f - 0.5);
      const nf = 1 - seg(tau, 0.13 + 0.34 * w, 0.3 + 0.34 * w, SOFT);
      const rr = lerp(24, 20, f) * nf;
      const dd = lerp(36, d, f);
      if (rr > 0.5) neck.push({ x: TILE.x + ux * dd, y: TILE.y + uy * dd, r: rr });
    }
  }
  return { bud, neck, d, ux, uy, link: seg(tau, 0.22, 0.5, SOFT), swell: hump(tau / 0.34) };
};
const cardK = (k: number, t: number) => pop(t, BUD[k] + 0.4, { dur: 0.42, over: 0.07 }) * popOut(t, RET[k], { dur: FOLD, over: 0.05 });

const along = (pts: { x: number; y: number }[], s: number) => {
  const ls = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y)), tot = ls.reduce((a, b) => a + b, 0);
  let d = s * tot;
  for (let i = 0; i < ls.length; i++) {
    if (d <= ls[i] || i === ls.length - 1) { const f = clamp01(d / ls[i]); return { x: lerp(pts[i].x, pts[i + 1].x, f), y: lerp(pts[i].y, pts[i + 1].y, f) }; }
    d -= ls[i];
  }
  return pts[pts.length - 1];
};
// where a ray from the founders meets the ring
const ringHit = (ux: number, uy: number, R: number) => {
  const ox = FD.x - HUB.x, oy = FD.y - HUB.y, b = ox * ux + oy * uy, c = ox * ox + oy * oy - R * R;
  return -b + Math.sqrt(b * b - c);
};
const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`;
};

// ---------- icons ----------
const ChipIcon: React.FC<{ i: number }> = ({ i }) => {
  const s = { fill: "none", stroke: TJA.navy, strokeWidth: 3.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (i === 0) return <g {...s}><circle cx={0} cy={-6} r={5.5} /><path d="M -10 11 C -10 2, 10 2, 10 11" /></g>; // candidates
  if (i === 1) return <g {...s}><rect x={-11} y={-5} width={22} height={15} rx={3} /><path d="M -4.5 -5 V -9 H 4.5 V -5 M -11 2 H 11" /></g>; // clients
  return <g {...s}><circle r={9} strokeWidth={5.5} strokeDasharray="3.53 3.53" /><circle r={5.5} /></g>; // operations
};
const CardIcon: React.FC<{ kind: Kind }> = ({ kind }) => {
  const s = { fill: "none", stroke: "#FFFFFF", strokeWidth: 3.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "building")
    return <g {...s}><rect x={-10} y={-14} width={20} height={28} rx={2} /><path d="M -4.5 -8 H -3.5 M 3.5 -8 H 4.5 M -4.5 -2 H -3.5 M 3.5 -2 H 4.5 M -2.5 14 V 7 H 2.5 V 14" /></g>;
  if (kind === "box") return <g {...s}><path d="M -13 -6 L 0 -13 L 13 -6 L 13 9 L 0 15 L -13 9 Z M -13 -6 L 0 1 L 13 -6 M 0 1 V 15" /></g>;
  return <g {...s}><circle cx={-6} r={9.5} /><circle cx={6} r={9.5} /></g>;
};

// ---------- text ----------
const Words: React.FC<{ text: string; t: number; tin: number; tout: number }> = ({ text, t, tin, tout }) => {
  const ws = text.split(" ");
  return (
    <div style={{ position: "absolute", left: 0, width: 1920, top: 150, textAlign: "center", fontSize: 76, fontWeight: 800, color: C.navy, letterSpacing: "-0.015em", lineHeight: 1.1, whiteSpace: "nowrap" }}>
      {ws.map((w, i) => {
        const a = pop(t, tin + i * 0.07, { dur: 0.5, over: 0.06 }), o = popOut(t, tout + i * 0.05, { dur: 0.38, over: 0.04 });
        if (a <= 0 || o <= 0) return <span key={i} style={{ display: "inline-block", opacity: 0, marginRight: i < ws.length - 1 ? "0.26em" : 0 }}>{w}</span>;
        return (
          <span key={i} style={{ display: "inline-block", marginRight: i < ws.length - 1 ? "0.26em" : 0, opacity: clamp01(a * 1.6) * clamp01(o),
            transform: `translateY(${(1 - a) * 50 - (1 - Math.min(1, o)) * 36}px)` }}>{w}</span>
        );
      })}
    </div>
  );
};

const Figure: React.FC<{ t: number }> = ({ t }) => {
  const fa = pop(t, TXT.resIn, { dur: 0.5, over: 0.06 }), fo = popOut(t, TXT.resOut, { dur: 0.42, over: 0.04 });
  if (fa <= 0 || fo <= 0) return null;
  const roll = pop(t, BADGE[1] - 0.03, { dur: 0.26, over: 0.1 }) + pop(t, BADGE[2] - 0.03, { dur: 0.26, over: 0.1 });
  const la = pop(t, TXT.resIn + 0.12, { dur: 0.5, over: 0.05 }), lb = pop(t, TXT.resIn + 0.22, { dur: 0.5, over: 0.05 });
  const out = (d: number) => clamp01(popOut(t, TXT.resOut + d, { dur: 0.38, over: 0.04 }));
  const DH = 200;
  return (
    <div style={{ position: "absolute", left: 0, width: 1920, top: 100, height: DH, display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
      <div style={{ height: DH, overflow: "hidden", opacity: clamp01(fa * 1.6) * out(0), transform: `translateY(${(1 - fa) * 60 - (1 - out(0)) * 40}px)` }}>
        <div style={{ transform: `translateY(${-roll * DH}px)`, fontSize: 214, fontWeight: 800, color: C.navy, lineHeight: `${DH}px`, letterSpacing: "-0.03em", textAlign: "center" }}>
          {["1", "2", "3"].map((n) => <div key={n} style={{ height: DH }}>{n}</div>)}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: C.navy, letterSpacing: "-0.01em", opacity: clamp01(la * 1.5) * out(0.05), transform: `translateX(${(1 - la) * -26}px) translateY(${(1 - out(0.05)) * -30}px)` }}>new relationship types</div>
        <div style={{ fontSize: 36, fontWeight: 600, color: C.muted, opacity: clamp01(lb * 1.5) * out(0.1), transform: `translateX(${(1 - lb) * -26}px) translateY(${(1 - out(0.1)) * -30}px)` }}>in 2 months</div>
      </div>
    </div>
  );
};

// ---------- the loop ----------
export const Loop: React.FC = () => {
  const t = useT();
  const tt = t < 5 ? t + 10 : t; // the problem line spans the seam
  const b = busy(t);

  // the K.B tile
  const kIn = pop(t, KB.in, { dur: 0.5, over: 0.06 }), kOut = popOut(t, KB.out, { dur: 0.45, over: 0.05 });
  const kbOn = kIn * kOut;
  const buds = [0, 1, 2].map((k) => { const tau = budTau(k, t); return tau === null ? null : budGeom(k, t, tau); });
  const swell = buds.reduce((a, g) => a + (g ? g.swell : 0), 0);
  const breath = 0.03 * (1 - b) * Math.sin(TAU * cyc(t, 1.25)); // the tile breathes while the network runs
  const tileS = TILE.s * lerp(0.55, 1, kIn) * kOut * (1 + 0.07 * swell + breath);
  const tileY = TILE.y - (1 - kIn) * 150;

  // the ring: wobbles while the founders are swamped, kicks at each blocked reach, opens round the tile
  let kick = 0;
  for (const r of REACH) kick += 5 * hump((t - r.at - 0.24) / 0.32);
  const R = HUB.r + 2.5 * b * Math.sin(TAU * cyc(t, 0.625)) + kick;
  const gapK = pop(t, GAP.open, { dur: 0.45, over: 0.05 }) * popOut(t, GAP.close, { dur: 0.45, over: 0.02 });
  const gap = (26 * Math.PI / 180) * Math.max(0, gapK);
  const ringD = gap > 0.002 ? arcPath(HUB.x, HUB.y, R, gap, TAU - gap) : "";

  const th = turns(t) * TAU;
  const fdRipple = OPP.map((o) => t - o.at - OPPD).filter((d) => d >= 0 && d < 0.75);
  const nod = OPP.reduce((a, o) => a + hump((t - o.at - OPPD) / 0.4), 0);
  const thru = OPP.reduce((a, o) => a + hump((t - o.at - 0.28) / 0.3), 0); // a dot passing under the tile
  const kbPulse = t - KB.in - 0.3;

  return (
    <Frame>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${STAGE})`, transformOrigin: ORIGIN }}>
      {/* ghost slots, pings and the dotted links */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {NODES.map((n, k) => {
          const ic = iconAt(k, t), g = 1 - clamp01(cardK(k, t) * 2);
          const pg = PINGS.filter((p) => p.k === k).map((p) => since(t, p.at)).find((d) => d < 0.85);
          const glow = pg === undefined ? 0 : hump(pg / 0.85);
          const col = glow > 0 ? `rgba(200,168,75,${0.35 + 0.65 * glow})` : "#B4BFCD";
          return (
            <g key={k}>
              {g > 0.01 && (
                <g opacity={g}>
                  <rect x={ic.x - 56} y={ic.y - CH / 2} width={CW} height={CH} rx={20} fill="rgba(255,255,255,0.45)" stroke={col} strokeWidth={3} strokeDasharray="10 9" />
                  <circle cx={ic.x} cy={ic.y} r={IR} fill="none" stroke={col} strokeWidth={3} strokeDasharray="7 7" />
                  <path d={`M ${ic.x - 10} ${ic.y} H ${ic.x + 10} M ${ic.x} ${ic.y - 10} V ${ic.y + 10}`} stroke={col} strokeWidth={3.4} strokeLinecap="round" />
                  <rect x={ic.x + 56} y={ic.y - 14} width={150} height={12} rx={6} fill="#E3E8EF" />
                  <rect x={ic.x + 56} y={ic.y + 10} width={96} height={10} rx={5} fill="#ECEFF4" />
                </g>
              )}
              {pg !== undefined && <circle cx={ic.x} cy={ic.y} r={IR + 80 * OUT(clamp01(pg / 0.85))} fill="none" stroke={TJA.gold} strokeWidth={4} opacity={0.9 * (1 - pg / 0.85)} />}
            </g>
          );
        })}
        {buds.map((g, k) => g && g.link > 0.01 && (
          <line key={k} x1={TILE.x} y1={TILE.y} x2={TILE.x + g.ux * g.d} y2={TILE.y + g.uy * g.d} stroke={C.cyan} strokeWidth={8} strokeLinecap="round"
            strokeDasharray="0 24" strokeDashoffset={-24 * cyc(t, 0.625)} opacity={g.link} />
        ))}
      </svg>

      {/* the founders' hub */}
      <div style={{ position: "absolute", left: HUB.x - HUB.r, top: HUB.y - HUB.r, width: HUB.r * 2, height: HUB.r * 2, borderRadius: "50%", background: C.white, boxShadow: SHADOW.card }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="tjaAv"><circle r={AVR} /></clipPath>
          <filter id="tjaChip" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx={0} dy={6} stdDeviation={6} floodColor={C.navy} floodOpacity={0.22} /></filter>
        </defs>
        <ellipse cx={FD.x} cy={FD.y} rx={ORB.rx} ry={ORB.ry} fill="none" stroke={TJA.pale} strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" />
        {ringD ? <path d={ringD} fill="none" stroke={TJA.navy} strokeWidth={6} strokeLinecap="round" /> : <circle cx={HUB.x} cy={HUB.y} r={R} fill="none" stroke={TJA.navy} strokeWidth={6} />}
        {/* blocked reaches: a dotted line shoots out, hits the ring, recoils */}
        {REACH.map((r, i) => {
          const d = t - r.at;
          if (d < 0 || d > 0.9) return null;
          const ic = iconAt(r.k, t), dx = ic.x - FD.x, dy = ic.y - FD.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
          const s0 = 70, sHit = ringHit(ux, uy, HUB.r - 14);
          const grow = d < 0.24 ? Math.pow(d / 0.24, 1.6) : clamp01(1 - pop(d, 0.24, { dur: 0.4, over: 0.06 }));
          const s = lerp(s0, sHit, grow), fade = 1 - seg(d, 0.62, 0.9);
          const ha = Math.atan2(FD.y + uy * sHit - HUB.y, FD.x + ux * sHit - HUB.x), fl = 1 - seg(d, 0.24, 0.7);
          return (
            <g key={i} opacity={fade}>
              <line x1={FD.x + ux * s0} y1={FD.y + uy * s0} x2={FD.x + ux * s} y2={FD.y + uy * s} stroke={TJA.navy} strokeWidth={6} strokeLinecap="round" strokeDasharray="0 13" />
              <circle cx={FD.x + ux * s} cy={FD.y + uy * s} r={10} fill={TJA.gold} stroke="#FFFFFF" strokeWidth={3} />
              {d > 0.22 && <path d={arcPath(HUB.x, HUB.y, R, ha - 0.22, ha + 0.22)} fill="none" stroke={C.warn} strokeWidth={8} strokeLinecap="round" opacity={fl} />}
            </g>
          );
        })}
        {/* the founders */}
        {fdRipple.map((d, i) => <circle key={i} cx={FD.x} cy={FD.y} r={70 + 90 * OUT(d / 0.75)} fill="none" stroke={TJA.gold} strokeWidth={4} opacity={0.85 * (1 - d / 0.75)} />)}
        {[-1, 1].map((sd, i) => {
          const jig = 3 * b * Math.sin(TAU * (cyc(t, 0.5) + i * 0.5)), sc = 1 + 0.06 * nod;
          return (
            <g key={i} transform={`translate(${FD.x + sd * AV} ${FD.y + jig}) scale(${sc})`}>
              <circle r={AVR + 5} fill="#FFFFFF" filter="url(#tjaChip)" />
              <circle r={AVR} fill={TJA.navy} />
              <g clipPath="url(#tjaAv)" fill={TJA.gold}><circle cy={-10} r={14} /><path d="M -26 34 C -26 8, 26 8, 26 34 Z" /></g>
            </g>
          );
        })}
        {/* the task chips (motion trails while racing) */}
        {[0, 1, 2].map((i) => {
          const a = th + (i * TAU) / 3;
          const pos = (aa: number) => ({ x: FD.x + ORB.rx * Math.cos(aa), y: FD.y + ORB.ry * Math.sin(aa) });
          const p = pos(a);
          return (
            <g key={i}>
              {[0.32, 0.18].map((k, j) => { const q = pos(a - (j + 1) * 0.13 * b); return <circle key={j} cx={q.x} cy={q.y} r={ORB.r * (0.92 - j * 0.1)} fill={TJA.navy} opacity={k * b * 0.5} />; })}
              <g transform={`translate(${p.x} ${p.y})`}>
                <circle r={ORB.r} fill="#FFFFFF" filter="url(#tjaChip)" />
                <ChipIcon i={i} />
              </g>
            </g>
          );
        })}
      </svg>
      {/* Top Jobs Abroad's name pill on the rim */}
      <div style={{ position: "absolute", left: HUB.x - 128, top: HUB.y - R - 33, width: 256, height: 66, borderRadius: 33, background: C.white, boxShadow: SHADOW.soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("cases/top-jobs-abroad/tja-logo-navy.png")} style={{ width: 192 }} />
      </div>

      {/* the budding (goo) under the tile */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="tjaGoo" filterUnits="userSpaceOnUse" x={GOO.x} y={GOO.y} width={GOO.w} height={GOO.h}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={10} />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
          </filter>
        </defs>
        {kbOn > 0.01 && (
          <g filter="url(#tjaGoo)" fill={C.kb}>
            <rect x={TILE.x - tileS * 0.47} y={tileY - tileS * 0.47} width={tileS * 0.94} height={tileS * 0.94} rx={tileS * 0.12} />
            {buds.map((g, k) => g && (
              <g key={k}>
                {g.neck.map((n, i) => <circle key={i} cx={n.x} cy={n.y} r={n.r} />)}
                <ellipse cx={0} cy={0} rx={g.bud.rx} ry={g.bud.ry} transform={`translate(${g.bud.x} ${g.bud.y}) rotate(${g.bud.ang})`} />
              </g>
            ))}
          </g>
        )}
        {/* the K.B arrival pulse and the gold opportunity dots */}
        {kbPulse > 0 && kbPulse < 0.8 && <circle cx={TILE.x} cy={TILE.y} r={70 + 110 * OUT(kbPulse / 0.8)} fill="none" stroke={C.cyan} strokeWidth={5} opacity={0.9 * (1 - kbPulse / 0.8)} />}
        {OPP.map((o, i) => {
          const d = t - o.at;
          if (d < 0 || d > OPPD + 0.1) return null;
          const path = [iconAt(o.k, t), { x: TILE.x, y: TILE.y }, FD];
          return (
            <g key={i}>
              {[4, 3, 2, 1, 0].map((j) => {
                const u = clamp01((d - j * 0.025) / OPPD), p = along(path, INOUT(u));
                if (u <= 0 || u >= 1) return null;
                return <circle key={j} cx={p.x} cy={p.y} r={12 - j * 1.6} fill={TJA.gold} stroke={j ? "none" : "#FFFFFF"} strokeWidth={3} opacity={j ? 0.5 - j * 0.09 : 1} />;
              })}
            </g>
          );
        })}
      </svg>

      {/* the K.B tile */}
      {kbOn > 0.01 && (
        <div style={{ position: "absolute", left: TILE.x - tileS / 2, top: tileY - tileS / 2, opacity: clamp01(kIn * 2) * clamp01(kOut * 1.5) }}>
          <KBTile size={tileS} dot={1 + 0.7 * swell + 0.6 * thru} />
        </div>
      )}

      {/* the relationship cards: they inflate out of the landed bud */}
      {NODES.map((n, k) => {
        const kk = cardK(k, t);
        if (kk <= 0.001) return null;
        const ic = iconAt(k, t), pad = lerp(IR, 56, kk), w = lerp(IR * 2, CW, kk), h = lerp(IR * 2, CH, kk);
        const gl = pop(t, BUD[k] + 0.45, { dur: 0.35, over: 0.08 }) * popOut(t, RET[k], { dur: 0.2 });
        const lab = clamp01((kk - 0.45) / 0.45);
        const bk = pop(t, BADGE[k], { dur: 0.35, over: 0.1 }) * popOut(t, RET[k] - 0.06, { dur: 0.2 });
        const bump = 1 + OPP.reduce((a, o) => a + (o.k === k ? 0.05 * hump((t - o.at) / 0.3) : 0), 0);
        return (
          <div key={k} style={{ position: "absolute", left: ic.x - pad, top: ic.y - (h / 2), width: w, height: h, borderRadius: lerp(IR, 20, kk), background: C.white,
            boxShadow: kk > 0.3 ? SHADOW.card : undefined, transform: `scale(${bump})`, transformOrigin: `${pad}px ${h / 2}px` }}>
            <svg width={IR * 2} height={IR * 2} style={{ position: "absolute", left: pad - IR, top: h / 2 - IR, overflow: "visible" }}>
              <circle cx={IR} cy={IR} r={IR} fill={C.kb} />
              {gl > 0.01 && <g transform={`translate(${IR} ${IR}) scale(${gl})`}><CardIcon kind={n.kind} /></g>}
            </svg>
            {lab > 0 && (
              <div style={{ position: "absolute", left: 112, top: h / 2 - 30, opacity: lab, transform: `translateX(${(1 - lab) * -16}px)` }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.navy, letterSpacing: "-0.01em", lineHeight: "40px", whiteSpace: "nowrap" }}>{n.label}</div>
                <div style={{ marginTop: 8, width: 48 * clamp01((kk - 0.6) / 0.4), height: 6, borderRadius: 3, background: TJA.gold }} />
              </div>
            )}
            {bk > 0.01 && (
              <svg width={48} height={48} style={{ position: "absolute", left: w - 30, top: -18, overflow: "visible" }}>
                <g transform={`translate(24 24) scale(${bk})`}>
                  <circle r={22} fill={TJA.gold} stroke="#FFFFFF" strokeWidth={4} />
                  <path d="M -9 0 L -3 6 L 9 -6" fill="none" stroke="#FFFFFF" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            )}
          </div>
        );
      })}

      </div>
      {/* text: problem → solution → figure */}
      <Words text="No time for new business" t={tt} tin={TXT.probIn} tout={TXT.probOut + 10} />
      <Words text="Growth beyond the founders" t={t} tin={TXT.solIn} tout={TXT.solOut} />
      <Figure t={t} />
    </Frame>
  );
};
