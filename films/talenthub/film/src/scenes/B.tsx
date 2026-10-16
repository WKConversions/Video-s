// Scene B (2.9–12.4 s): "The platform connecting graduates with international career opportunities. Browse a database
// of qualified candidates, all in one intuitive dashboard." See ../../../plan/storyboard.md.
// 1) the network: the th hub node; graduates pop in on the left, a dotted Europe map lights up pin by pin on the right,
//    job cards pop by the pins, and red links draw graduate → hub → pin with pulses running along them.
// 2) the database: everything pours into the hub, which opens into a grid of anonymised candidate cards flowing out
//    of it; a counter runs to 1,248 and each card gets a check on "qualified".
// 3) the dashboard: the cards gather and snap into the dashboard window as it assembles around them (the hub becomes
//    its logo, the counter lands), then settle into the exact B→C hand-off state at frame 366.
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  ARRIVE, Avatar, C, CANDIDATES, CARD, Cand, CandidateCard, Chip, DASH, Dashboard, DEPART, FONT, Ico, JOBS, Link, MOVE, POP, Pill, SNAP, Say,
  THMark, clamp01, f, mix,
} from "../shared";

type Ease = (t: number) => number;
const kf = (g: number, a: number, d: number, e: Ease = ARRIVE) => e(clamp01((g - a) / d));
const LIN: Ease = (t) => t;
const OUTC: Ease = (t) => 1 - Math.pow(1 - t, 2.4);
const OUTQ: Ease = (t) => 1 - Math.pow(1 - t, 1.4);
const THR = 596 / 764;

/* ---------- beats (frames) ---------- */
const START = 93, END = f("s2"); // 93 = the A→B hand-off, 366 = the B→C hand-off
const CONN = f("w:connecting"), GRAD = f("w:graduates"), INTL = f("w:international"), CAREER = f("w:career");
const BROWSE = f("w:browse"), DB = f("w:database"), QUAL = f("w:qualified2"), ALL = f("w:all"), ONE = f("w:one");
const PIN0 = INTL + 1;           // pins light one by one from here
const OPEN = 240;                // the hub opens into cards
const SWITCH = 335;              // the assembled window becomes the shared Dashboard itself
const SETTLE = 328;              // the window grows to its hand-off geometry, landing on END

/* ---------- the network ---------- */
const HX = 960, HY = 540;
const GR: [number, number][] = [[300, 262], [412, 382], [300, 502], [412, 622], [300, 742], [412, 862]];
const MX = (lon: number) => 1150 + (lon + 11) * 18.8;
const MY = (lat: number) => 200 + (60 - lat) * 28;
const CITIES = [
  { n: "Dublin", lon: -6.26, lat: 53.35, job: 3, left: true, ax: 1262, ay: 262 },
  { n: "Amsterdam", lon: 4.9, lat: 52.37, job: 5, left: false, ax: 1300, ay: 282 },
  { n: "Berlin", lon: 13.4, lat: 52.52, job: 1, left: false, ax: 1470, ay: 448 },
  { n: "Barcelona", lon: 2.17, lat: 41.39, job: 4, left: false, ax: 1424, ay: 636 },
  { n: "Madrid", lon: -3.7, lat: 40.42, job: 0, left: false, ax: 1300, ay: 790 },
  { n: "Lisbon", lon: -9.14, lat: 38.72, job: 2, left: true, ax: 1146, ay: 832 },
].map((c) => ({ ...c, x: MX(c.lon), y: MY(c.lat) }));
const gradAt = (i: number) => GRAD + i * 3;
const gLinkAt = (i: number) => GRAD + 2 + i * 4;
const pinAt = (i: number) => PIN0 + i * 5;
const pLinkAt = (i: number) => PIN0 + 3 + i * 6;
const jobAt = (i: number) => CAREER + i * 4;
const collapseAt = (i: number) => BROWSE - 2 + i * 1.6;

// a rough Europe (lon, lat) for the dotted map
const LANDS: [number, number][][] = [
  [[-5.6, 36.0], [-6.3, 36.8], [-7.4, 37.2], [-8.9, 37.0], [-8.8, 38.2], [-9.5, 38.8], [-9.0, 39.8], [-8.8, 41.2], [-8.9, 42.1], [-9.3, 43.0], [-8.2, 43.7], [-6.0, 43.6],
    [-3.8, 43.5], [-1.8, 43.4], [-1.4, 44.6], [-1.2, 46.0], [-2.2, 47.1], [-4.5, 47.9], [-4.7, 48.6], [-3.0, 48.8], [-1.6, 48.7], [-1.4, 49.7], [0.2, 49.5], [1.6, 50.2],
    [1.6, 50.9], [3.0, 51.3], [4.2, 51.7], [4.6, 52.5], [4.8, 53.1], [6.8, 53.4], [8.6, 53.9], [8.6, 55.4], [8.1, 56.6], [8.6, 57.1], [10.6, 57.7], [10.4, 56.6], [10.9, 56.4],
    [10.2, 55.6], [9.8, 55.0], [10.9, 54.4], [12.5, 54.4], [14.2, 53.9], [16.5, 54.5], [18.6, 54.7], [19.9, 54.4], [21.1, 55.7], [21.0, 56.8], [21.6, 57.4], [23.5, 57.1],
    [24.4, 58.4], [23.5, 59.2], [26.0, 59.6], [28.0, 59.5], [30.0, 59.9], [30.5, 60.5], [34, 60.5], [34, 46.5], [30.8, 46.5], [29.6, 45.3], [28.7, 44.3], [28.0, 43.0],
    [28.0, 41.9], [29.0, 41.2], [26.4, 40.7], [24.5, 40.9], [23.7, 40.2], [22.9, 40.6], [22.6, 40.0], [23.4, 39.2], [22.9, 38.5], [24.0, 38.2], [23.1, 37.5], [22.7, 36.5],
    [22.1, 37.0], [21.1, 37.0], [21.7, 38.3], [20.7, 39.1], [20.0, 39.7], [19.4, 40.3], [19.5, 41.8], [18.5, 42.5], [16.9, 43.4], [15.2, 44.3], [15.0, 45.2], [13.6, 45.1],
    [13.7, 45.7], [12.3, 45.4], [12.4, 44.4], [13.6, 43.5], [14.7, 42.1], [16.1, 41.9], [17.2, 40.9], [18.5, 40.2], [18.3, 39.8], [17.0, 40.5], [16.5, 39.7], [17.2, 39.0],
    [16.5, 38.4], [15.7, 37.9], [15.7, 38.7], [16.2, 39.5], [15.6, 40.1], [14.8, 40.6], [14.0, 40.9], [13.0, 41.3], [12.2, 41.7], [11.2, 42.4], [10.5, 43.0], [10.2, 43.9],
    [8.8, 44.4], [7.6, 43.8], [6.6, 43.1], [5.0, 43.4], [4.0, 43.5], [3.1, 43.1], [3.2, 42.0], [2.5, 41.4], [1.0, 41.0], [0.7, 40.5], [-0.3, 39.5], [0.2, 38.8], [-0.7, 37.6],
    [-1.7, 37.4], [-2.1, 36.7], [-4.4, 36.7], [-5.1, 36.4]],
  [[5.0, 58.8], [5.6, 58.1], [7.0, 58.0], [8.1, 58.1], [9.6, 59.0], [10.5, 59.3], [11.1, 59.0], [11.7, 58.0], [12.6, 56.4], [12.9, 55.4], [14.2, 55.4], [14.6, 56.0],
    [16.0, 56.2], [16.6, 57.3], [16.7, 58.4], [18.0, 59.0], [19.0, 59.8], [19, 61], [5, 61]],
  [[-5.7, 50.0], [-4.2, 50.4], [-3.0, 50.7], [-1.0, 50.8], [1.0, 51.0], [1.4, 51.4], [0.8, 51.8], [1.7, 52.6], [0.3, 53.0], [0.1, 53.6], [-0.4, 54.5], [-1.3, 54.9],
    [-1.6, 55.6], [-2.6, 56.1], [-1.8, 57.6], [-3.1, 58.6], [-5.0, 58.6], [-5.7, 57.6], [-5.6, 56.4], [-6.2, 56.2], [-5.4, 55.5], [-4.8, 54.8], [-3.4, 54.9], [-3.0, 54.2],
    [-3.0, 53.4], [-4.5, 53.4], [-4.1, 52.8], [-4.2, 52.2], [-5.2, 51.8], [-3.3, 51.4], [-4.5, 51.1]],
  [[-6.0, 52.2], [-6.0, 53.0], [-6.2, 53.9], [-5.6, 54.6], [-6.2, 55.2], [-7.4, 55.3], [-8.3, 55.2], [-8.6, 54.6], [-10.1, 54.2], [-9.9, 53.4], [-10.3, 52.1], [-9.8, 51.5],
    [-8.4, 51.6], [-7.0, 52.1]],
  [[12.4, 38.1], [13.4, 38.2], [15.6, 38.3], [15.1, 37.3], [15.1, 36.7], [14.3, 37.0], [12.5, 37.6]],
  [[8.4, 39.0], [9.6, 39.2], [9.8, 40.6], [9.2, 41.3], [8.2, 40.9], [8.4, 40.0]],
  [[8.6, 41.4], [9.4, 41.4], [9.5, 42.9], [8.7, 42.6]],
];
const inside = (px: number, py: number, poly: [number, number][]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const DOTS: { x: number; y: number; d: number; ef: number }[] = (() => {
  const out: { x: number; y: number; d: number; ef: number }[] = [];
  for (let row = 0, y = 206; y <= 872; y += 15, row++)
    for (let x = 1104 + (row % 2) * 7.5; x <= 1860; x += 15) {
      const lon = (x - 1150) / 18.8 - 11, lat = 60 - (y - 200) / 28;
      if (LANDS.some((p) => inside(lon, lat, p))) out.push({ x, y, d: Math.hypot(x - HX, y - HY), ef: clamp01((1866 - x) / 150) * clamp01((y - 196) / 60) });
    }
  return out;
})();
// a point on the Link's quadratic curve (same control point as shared Link)
const qpt = (x1: number, y1: number, x2: number, y2: number, bend: number, t: number): [number, number] => {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend, u = 1 - t;
  return [u * u * x1 + 2 * u * t * mx + t * t * x2, u * u * y1 + 2 * u * t * my + t * t * y2];
};
const GB = 0.1, PB = -0.08;
// a dotted guide whose dots march along it (x1 → x2): a connection about to be made
const March: React.FC<{ x1: number; y1: number; x2: number; y2: number; bend: number; p: number; g: number }> = ({ x1, y1, x2, y2, bend, p, g }) => {
  if (p <= 0.003) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={C.light} strokeWidth={7} strokeLinecap="round" strokeDasharray="1 16" strokeDashoffset={-g * 5.5} opacity={p} />
    </svg>
  );
};

/* ---------- the database grid and the dashboard geometry ---------- */
const CW = 290, CH = 149;                  // the dashboard card (w 290) and its height
const DBS = 236 / CW;                      // database cards are the same card at 236 px
const DBX = 202, DBY = 290, DBC = 256, DBR = 138;
const SI = 0.86, DYI = 50;                 // the window while it assembles (smaller, lower; room for the caption)
const HEAD = { x: 237, y: 190, s: 70 };
const BARM = { x: 960 + (56 - 800) * SI, y: 550 + DYI + (39 - 430) * SI, s: 52 * SI };
const CNT0 = { x: 296, y: 159, fs: 52 }, CNT1 = { x: 960 + (DASH.rail + 32 - 800) * SI, y: 550 + DYI + (DASH.bar + 22 - 430) * SI, fs: 26 * SI };
const CHOSEN: Record<number, number> = { 1: 0, 4: 1, 8: 2, 11: 3, 19: 4, 22: 5, 25: 6, 28: 7 }; // database slot → CANDIDATES index
const SLOTS = Array.from({ length: 30 }, (_, j) => {
  const col = j % 6, row = Math.floor(j / 6);
  return { j, x: DBX + col * DBC, y: DBY + row * DBR, cx: DBX + col * DBC + (CW * DBS) / 2, cy: DBY + row * DBR + (CH * DBS) / 2 };
});
const RANK: number[] = (() => {
  const order = SLOTS.map((s) => s.j).sort((a, b) => Math.hypot(SLOTS[a].cx - HEAD.x, SLOTS[a].cy - HEAD.y) - Math.hypot(SLOTS[b].cx - HEAD.x, SLOTS[b].cy - HEAD.y));
  const r: number[] = [];
  order.forEach((j, i) => (r[j] = i));
  return r;
})();
const FILL_IDX: Record<number, number> = {};
SLOTS.filter((s) => CHOSEN[s.j] === undefined).forEach((s, m) => (FILL_IDX[s.j] = m));
const cardData = (j: number): Cand => {
  if (CHOSEN[j] !== undefined) return CANDIDATES[CHOSEN[j]];
  const m = FILL_IDX[j], b = CANDIDATES[(m * 5 + 8) % 12];
  return { ...b, id: String(1100 + ((m * 613 + 271) % 8800)) };
};
const winAt = (g: number) => { const st = OUTQ(clamp01((g - SETTLE) / (END - SETTLE))); return { s: mix(SI, 1, st), dy: mix(DYI, 0, st) }; };
const dsSlot = (i: number, g: number) => { const { s, dy } = winAt(g); return { x: 960 + (DASH.rail + 32 + (i % 4) * (CW + 24) - 800) * s, y: 550 + dy + (DASH.bar + 72 + Math.floor(i / 4) * (CH + 24) - 430) * s, s }; };
const launchAt = (j: number) => OPEN + 4 + RANK[j] * 1.95;

// the hub mark: centre stage, then the database header, then the dashboard's logo
const markAt = (g: number) => {
  const a = kf(g, 243, 16, MOVE), b = kf(g, 308, 16, MOVE);
  const pulse = 1 + 0.1 * Math.sin(Math.PI * clamp01((g - (OPEN - 2)) / 8));
  return { x: mix(mix(HX, HEAD.x, a), BARM.x, b), y: mix(mix(HY, HEAD.y, a), BARM.y, b), s: mix(mix(150 * pulse, HEAD.s, a), BARM.s, b) };
};

/* ---------- pieces ---------- */
const PinG: React.FC<{ x: number; y: number; p: number; o?: number }> = ({ x, y, p, o = 1 }) => (
  <svg width={40} height={50} viewBox="0 0 40 50" style={{ position: "absolute", left: x - 20, top: y - 49, transform: `scale(${p})`, transformOrigin: "50% 100%", opacity: o, overflow: "visible" }}>
    <path d="M20 49 C20 49 37 31 37 18 a17 17 0 0 0 -34 0 C3 31 20 49 20 49 Z" fill={C.red} />
    <circle cx="20" cy="18" r="6.5" fill={C.white} />
  </svg>
);
const JobCard: React.FC<{ title: string; city: string; country: string }> = ({ title, city, country }) => (
  <div style={{ ...CARD, borderRadius: 18, display: "flex", alignItems: "center", gap: 12, padding: "11px 22px 11px 11px", whiteSpace: "nowrap" }}>
    <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.rose, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="briefcase" s={24} c={C.red} /></div>
    <div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.ink, lineHeight: 1.15 }}>{title}</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.gray, display: "flex", alignItems: "center", gap: 5, lineHeight: 1.2 }}><Ico n="pin" s={18} c={C.red} />{city}, {country}</div>
    </div>
  </div>
);
const Badge: React.FC<{ p: number }> = ({ p }) => p <= 0 ? null : (
  <div style={{ position: "absolute", left: CW - 26, top: -14, width: 40, height: 40, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 0 0 4px ${C.white}`, transform: `scale(${p})` }}><Ico n="check" s={26} c={C.white} w={3.4} /></div>
);

/* ---------- 1: the network ---------- */
const Network: React.FC<{ g: number }> = ({ g }) => {
  const disc = kf(g, START + 1, 16) * (1 - kf(g, 244, 10, MOVE));
  const discPulse = 1 + 0.08 * Math.sin(Math.PI * clamp01((g - (OPEN - 2)) / 8));
  const guide = kf(g, CONN, 10) * (1 - kf(g, BROWSE - 6, 8));
  const tag = kf(g, GRAD, 12) * (1 - kf(g, BROWSE - 6, 10)), tag2 = kf(g, CAREER, 14);
  const gpos = (i: number): [number, number] => { const e = kf(g, collapseAt(i), 14, MOVE); return [mix(GR[i][0], HX, e), mix(GR[i][1], HY, e)]; };
  const pinE = (i: number) => kf(g, collapseAt(i) + 3, 14, MOVE);
  const flows = { grads: [] as React.ReactNode[], pings: [] as React.ReactNode[] };
  GR.forEach((_, i) => {
    const S = gLinkAt(i) + 5, P = 6;
    if (g < S) return;
    const [gx, gy] = gpos(i), pe = pinE(i), px = mix(CITIES[i].x, HX, pe), py = mix(CITIES[i].y, HY, pe);
    for (let q = Math.max(0, Math.floor((g - S - 52) / P)); S + q * P <= g && S + q * P < BROWSE - 4; q++) {
      const age = g - (S + q * P);
      if (age < 20) {
        const t = age / 20, [x, y] = qpt(gx, gy, HX, HY, GB, t), sc = Math.min(1, t / 0.15) * (t > 0.75 ? 1 - ((t - 0.75) / 0.25) * 0.6 : 1);
        flows.grads.push(<div key={`f${i}-${q}`} style={{ position: "absolute", left: x - 28, top: y - 28, transform: `scale(${sc})` }}><Avatar size={56} ring={C.rose} /></div>);
      } else if (age < 36 && S + q * P + 20 >= pLinkAt(i) + 8) {
        const t = (age - 20) / 16, [x, y] = qpt(HX, HY, px, py, PB, t);
        flows.pings.push(<circle key={`p${i}-${q}`} cx={x} cy={y} r={13 * Math.min(1, t / 0.2 + 0.3)} fill={C.red} stroke={C.white} strokeWidth={4} />);
      } else if (age >= 36 && age < 52 && S + q * P + 20 >= pLinkAt(i) + 8 && pe <= 0) {
        const t = (age - 36) / 16; // the ping lands: a ring at the pin
        flows.pings.push(<circle key={`r${i}-${q}`} cx={px} cy={py} r={14 + t * 40} fill="none" stroke={C.red} strokeWidth={3} opacity={0.6 * (1 - t)} />);
      }
    }
  });
  const rings = [];
  for (let t0 = START + 4; t0 < BROWSE + 4; t0 += 12) {
    const age = g - t0, r = 118 + age * 8;
    if (age >= 0 && age < 36) rings.push(<div key={t0} style={{ position: "absolute", left: HX - r, top: HY - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `4px solid rgba(207,20,30,${0.36 * (1 - age / 36)})` }} />);
  }
  { // the hub opening: one bigger ring
    const age = g - OPEN;
    if (age >= 0 && age < 22) { const r = 100 + age * 16; rings.push(<div key="open" style={{ position: "absolute", left: HX - r, top: HY - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `6px solid rgba(207,20,30,${0.6 * (1 - age / 22)})` }} />); }
  }
  return (
    <>
      {/* the dotted map: sweeps in, waves light up from each pin, then pours into the hub */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {DOTS.map((d, i) => {
          const rev = kf(g, INTL - 8 + ((d.d - 150) / 800) * 16, 15);
          if (rev <= 0) return null;
          let w = 0;
          CITIES.forEach((c, ci) => {
            const age0 = g - pinAt(ci);
            if (age0 < 0) return;
            const dd = Math.hypot(d.x - c.x, d.y - c.y), age = (age0 + ci * 9) % 28, amp = age0 < 28 ? 1 : 0.85;
            w = Math.max(w, amp * Math.exp(-(((dd - 10 - age * 10) / 20) ** 2)) * (1 - age / 28));
            if (dd < 44) w = Math.max(w, 0.8 * clamp01(age0 / 8));
          });
          const e = kf(g, BROWSE - 1 + (d.d / 900) * 10, 13, DEPART);
          if (e >= 1) return null;
          const x = mix(mix(HX, d.x, rev), HX, e), y = mix(mix(HY, d.y, rev), HY, e), red = w > 0.3 || e > 0.03 || rev < 0.8;
          return <circle key={i} cx={x} cy={y} r={(3 + 3.4 * w) * (1 - 0.3 * e)} fill={red ? C.red : C.light} opacity={(red ? 1 : 0.6) * Math.max(d.ef, e, 1 - rev) * (1 - clamp01((e - 0.8) / 0.2))} />;
        })}
      </svg>
      {rings}
      {/* the connections to be made, then the red links graduate → hub → pin */}
      {GR.map(([x, y], i) => <March key={`gg${i}`} g={g} x1={x} y1={y} x2={HX} y2={HY} p={guide * (1 - kf(g, gLinkAt(i), 10))} bend={GB} />)}
      {CITIES.map((c, i) => <March key={`pg${i}`} g={g} x1={HX} y1={HY} x2={c.x} y2={c.y} p={guide * (1 - kf(g, pLinkAt(i), 10))} bend={PB} />)}
      {GR.map((_, i) => {
        const [x, y] = gpos(i), e = kf(g, collapseAt(i), 14, MOVE);
        return e >= 1 ? null : <Link key={`gl${i}`} x1={x} y1={y} x2={HX} y2={HY} p={kf(g, gLinkAt(i), 11, MOVE)} bend={GB} width={4} />;
      })}
      {CITIES.map((c, i) => <Link key={`pl${i}`} x1={HX} y1={HY} x2={c.x} y2={c.y} p={kf(g, pLinkAt(i), 11, MOVE) * (1 - pinE(i))} bend={PB} width={4} />)}
      {/* the flow: graduates travel along their link into the hub; a red ping carries on to the pin abroad */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {flows.pings}
      </svg>
      {flows.grads}
      {/* pins and their job cards */}
      {CITIES.map((c, i) => {
        const p = kf(g, pinAt(i), 10, POP), e = pinE(i);
        if (p <= 0 || e >= 1) return null;
        const age = g - pinAt(i), r = 12 + age * 2.2;
        return (
          <React.Fragment key={c.n}>
            {age < 26 && <div style={{ position: "absolute", left: c.x - r, top: c.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `3px solid rgba(207,20,30,${0.7 * (1 - age / 26)})` }} />}
            <PinG x={mix(c.x, HX, e)} y={mix(c.y, HY, e)} p={p * (1 - 0.7 * e)} o={1 - clamp01((e - 0.7) / 0.3)} />
          </React.Fragment>
        );
      })}
      {CITIES.map((c, i) => {
        const p = kf(g, jobAt(i), 11, POP), e = kf(g, collapseAt(i) + 1, 13, MOVE);
        if (p <= 0 || e >= 1) return null;
        const j = JOBS[c.job];
        return (
          <div key={`job${i}`} style={{ position: "absolute", left: c.ax, top: c.ay, opacity: Math.min(1, p * 2) * (1 - clamp01((e - 0.6) / 0.4)),
            transform: `translate(${(c.left ? -100 : 0)}%, 0) translate(${(HX - c.ax) * e}px, ${(HY - c.ay) * e}px) scale(${(0.6 + 0.4 * p) * (1 - 0.8 * e)})`, transformOrigin: c.left ? "100% 100%" : "0% 100%" }}>
            <JobCard title={j.title} city={j.city} country={j.country} />
          </div>
        );
      })}
      {/* graduates */}
      {GR.map((_, i) => {
        const p = kf(g, gradAt(i), 12, POP), e = kf(g, collapseAt(i), 14, MOVE);
        if (p <= 0 || e >= 1) return null;
        const [x, y] = gpos(i);
        return (
          <div key={`gr${i}`} style={{ position: "absolute", left: x - 46, top: y - 46, width: 92, height: 92, transform: `scale(${p * (1 - 0.75 * e)})`, opacity: 1 - clamp01((e - 0.7) / 0.3) }}>
            <Avatar size={92} ring={C.rose} />
            <div style={{ position: "absolute", right: -10, bottom: -6, width: 38, height: 38, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px ${C.white}` }}>
              <Ico n="cap" s={24} c={C.white} w={2.6} />
            </div>
          </div>
        );
      })}
      {/* the hub node */}
      {disc > 0 && <div style={{ position: "absolute", left: HX - 112, top: HY - 112, width: 224, height: 224, borderRadius: "50%", background: C.white,
        boxShadow: `0 0 0 10px ${C.rose}, 0 30px 60px -24px rgba(25,27,32,0.30)`, transform: `scale(${disc * discPulse})` }} />}
      {/* the small caption tag */}
      {tag > 0 && (
        <div style={{ position: "absolute", left: 120, top: 72, display: "flex", alignItems: "center", padding: "12px 24px", borderRadius: 999, background: C.white, opacity: tag,
          transform: `translateY(${(1 - tag) * 16}px)`, boxShadow: "0 0 0 1px rgba(25,27,32,0.06), 0 14px 30px -16px rgba(25,27,32,0.30)", fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.ink, whiteSpace: "nowrap" }}>
          <Ico n="cap" s={28} c={C.red} /><span style={{ marginLeft: 10 }}>Graduates</span>
          <div style={{ display: "flex", alignItems: "center", overflow: "hidden", maxWidth: 280 * tag2, opacity: tag2 }}>
            <span style={{ margin: "0 12px", display: "flex" }}><Ico n="arrow" s={26} c={C.red} w={2.8} /></span>
            <Ico n="globe" s={26} c={C.red} /><span style={{ marginLeft: 10 }}>Careers abroad</span>
          </div>
        </div>
      )}
    </>
  );
};

/* ---------- 2 + 3: the database cards, then the dashboard ---------- */
const Cards: React.FC<{ g: number }> = ({ g }) => {
  const fillers: React.ReactNode[] = [], chosen: React.ReactNode[] = [];
  SLOTS.forEach((sl) => {
    const j = sl.j, L = launchAt(j);
    if (g < L) return;
    const a = kf(g, L, 20, OUTC), src = markAt(L), rot = (1 - a) * (j % 2 ? 14 : -14);
    const sc0 = mix(0.15, DBS, a);
    const dx = sl.cx - src.x, dy = sl.cy - src.y, len = Math.hypot(dx, dy) || 1, arc = 70 * Math.sin(Math.PI * a) * (j % 2 ? 1 : -1);
    const cx = mix(src.x, sl.cx, a) - (dy / len) * arc, cy = mix(src.y, sl.cy, a) + (dx / len) * arc;
    let x = cx - (CW / 2) * sc0, y = cy - (CH / 2) * sc0, s = sc0, o = clamp01(a * 4);
    const ci = CHOSEN[j];
    const badge = kf(g, Math.max(L + 18, QUAL + RANK[j] * 0.7), 9, POP) * (1 - kf(g, ALL + 4, 8, MOVE));
    if (ci !== undefined) {
      const b = kf(g, ONE + ci * 1.2, 14, SNAP), t = dsSlot(ci, g), lift = Math.sin(Math.PI * kf(g, ALL, 26, LIN)) * 0.04;
      x = mix(x, t.x, b); y = mix(y, t.y, b); s = mix(s, t.s, b) * (1 + lift);
      if (g >= SWITCH) return;
      chosen.push(<div key={j} style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${rot}deg)`, transformOrigin: "0 0", opacity: o }}><CandidateCard c={cardData(j)} w={CW} /><Badge p={badge} /></div>);
    } else {
      const m = FILL_IDX[j], b = kf(g, ALL + m * 0.45, 15, MOVE), t = dsSlot(m % 8, g), off = 9 * (1 + Math.floor(m / 8));
      x = mix(x, t.x + off, b); y = mix(y, t.y + off, b); s = mix(s, t.s * 0.97, b); o *= 1 - kf(g, 318, 12, MOVE);
      if (o <= 0.003) return;
      fillers.push(<div key={j} style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${rot}deg)`, transformOrigin: "0 0", opacity: o }}><CandidateCard c={cardData(j)} w={CW} /><Badge p={badge} /></div>);
    }
  });
  return <>{fillers}{chosen}</>;
};

// The dashboard window while it assembles: the shared Dashboard's markup, with its parts animated in.
const DashShell: React.FC<{ s: number; dy: number; panel: number; bar: number; rail: number; logo: boolean; counter: boolean }> = ({ s, dy, panel, bar, rail, logo, counter }) => {
  const { x, w, h } = DASH, y = DASH.y + dy;
  const groups: [string, string, string[]][] = [["Skills", "sliders", ["Spanish", "Marketing", "Social media"]], ["Experience", "briefcase", ["1–3 years"]], ["Qualifications", "cap", ["Bachelor's degree"]]];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: panel, transform: `scale(${s * mix(0.94, 1, panel)})`, transformOrigin: "50% 50%", ...CARD, borderRadius: 30, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: DASH.bar, display: "flex", alignItems: "center", gap: 22, padding: "0 30px", boxSizing: "border-box", borderBottom: `1px solid ${C.line}`,
        transform: `translateY(${-(1 - bar) * (DASH.bar + 4)}px)` }}>
        <THMark size={52} style={{ opacity: logo ? 1 : 0 }} />
        <div style={{ flex: 1, height: 46, borderRadius: 999, background: C.cloud, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", fontFamily: FONT, fontSize: 20, color: C.gray }}><Ico n="search" s={22} c={C.gray} />Search candidates</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.ink, background: C.rose, borderRadius: 999, padding: "10px 18px" }}><Ico n="coin" s={24} c={C.red} />10 credits</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: DASH.bar, width: DASH.rail, bottom: 0, background: C.ivory, borderRight: `1px solid ${C.line}`, padding: "26px 24px", boxSizing: "border-box",
        transform: `translateX(${-(1 - rail) * (DASH.rail + 4)}px)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, color: C.ink, display: "flex", alignItems: "center", gap: 10 }}><Ico n="filter" s={24} c={C.red} />Filters</div>
        {groups.map(([name, icon, chips]) => (
          <div key={name} style={{ marginTop: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.gray }}><Ico n={icon} s={20} c={C.gray} />{name}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>{chips.map((t) => <Chip key={t} text={t} size={16} on={0} />)}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: DASH.rail + 32, top: DASH.bar + 22, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: C.ink, opacity: counter ? 1 : 0 }}>
        {(1248).toLocaleString("en-US")} <span style={{ fontWeight: 400, color: C.gray }}>candidates</span>
      </div>
    </div>
  );
};

export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g < START || g > END) return null;
  const m = markAt(g);
  // the window: assembles small and low (caption room), then grows to the hand-off geometry, landing on END
  const { s, dy } = winAt(g);
  // the counter: header → the dashboard's counter
  const cf = kf(g, 300, 14, MOVE), cn = Math.round(1248 * kf(g, OPEN + 2, 58, MOVE)), co = kf(g, 257, 10);
  const headPill = kf(g, DB, 10) * (1 - kf(g, ALL, 8));
  return (
    <AbsoluteFill>
      {g < 252 && <Network g={g} />}
      {/* the hub keeps pumping while the cards flow out of it */}
      {g >= 256 && g < 304 && [0, 1, 2, 3, 4].map((n) => {
        const age = (g - 256 + n * 10) % 50, r = 44 + age * 5;
        return <div key={n} style={{ position: "absolute", left: HEAD.x - r, top: HEAD.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `3px solid rgba(207,20,30,${0.32 * (1 - age / 50) * (1 - kf(g, 294, 10))})` }} />;
      })}
      {g >= 300 && g < SWITCH && <DashShell s={s} dy={dy} panel={kf(g, 300, 16)} bar={kf(g, 314, 13, SNAP)} rail={kf(g, 316, 14, SNAP)} logo={g >= 324} counter={g >= 314} />}
      {g >= SWITCH && (
        <Dashboard y={DASH.y + dy} s={s} count={1248} credits={10} filters={[0, 0, 0]}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>{CANDIDATES.slice(0, 8).map((c) => <CandidateCard key={c.id} c={c} w={CW} />)}</div>
        </Dashboard>
      )}
      {g >= OPEN && g < SWITCH && <Cards g={g} />}
      {headPill > 0 && <div style={{ position: "absolute", right: 202, top: 165, opacity: headPill, transform: `translateY(${(1 - headPill) * 14}px)` }}><Pill text="Candidate database" icon="grid" size={24} /></div>}
      {co > 0 && g < 314 && (
        <div style={{ position: "absolute", left: mix(CNT0.x, CNT1.x, cf), top: mix(CNT0.y, CNT1.y, cf), fontFamily: FONT, fontWeight: 900, fontSize: mix(CNT0.fs, CNT1.fs, cf), color: C.ink, whiteSpace: "nowrap", opacity: co }}>
          {cn.toLocaleString("en-US")} <span style={{ fontWeight: 400, color: C.gray }}>candidates</span>
        </div>
      )}
      {g < 324 && <div style={{ position: "absolute", left: m.x - m.s / 2, top: m.y - (m.s * THR) / 2 }}><THMark size={m.s} /></div>}
      <Say g={g} x={DASH.x} y={28} size={72} out="w:dashboard+0.4"
        words={[{ t: "All", at: "w:intuitive" }, { t: "in", at: "w:intuitive+0.07" }, { t: "one", at: "w:intuitive+0.14" }, { t: "dashboard.", at: "w:dashboard", red: true }]} />
    </AbsoluteFill>
  );
};
