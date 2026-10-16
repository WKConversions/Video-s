// Scene C (12.0–22.95 s): Filter by skills, experience, and qualifications to find the right match. Discover candidate
// profiles, unlock contact details, and connect directly with potential hires. See ../../../plan/storyboard.md.
// Explanation motion: each filter scans the grid, the non-matches drop out and the rest reflow (the counter falls),
// the match rises, its card grows into the profile, a credit coin flies into the lock that springs open (the blur
// dissolves), and a red line connects employer and candidate with the message travelling along it. Ends in a red iris.
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  ARRIVE, Avatar, C, CANDIDATES, CARD, Cand, CandidateCard, Chip, DASH, DEPART, Dashboard, Dot, FONT, Ico, Link, MOVE, POP, Pill, RedIris, SNAP, Say, clamp01, f, mix,
} from "../shared";

type Ease = (t: number) => number;
const kf = (g: number, a: number, d: number, e: Ease = ARRIVE) => e(clamp01((g - a) / Math.max(1, d)));
const ACC: Ease = (t) => t * t;

/* ---------- beats (frames) ---------- */
const F0 = 366;
const F_FILTER = f("w:filter"), F_SKILLS = f("w:skills"), F_EXP = f("w:experience"), F_QUAL = f("w:qualifications");
const F_FIND = f("w:find"), F_RIGHT = f("w:right"), F_MATCH = f("w:match");
const F_DISC = f("w:discover"), F_CAND = f("w:candidate"), F_PROF = f("w:profiles");
const F_UNLOCK = f("w:unlock");
const F_AND2 = f("w:and2"), F_CONNECT = f("w:connect"), F_DIRECTLY = f("w:directly"), F_WITH2 = f("w:with2"), F_HIRES = f("w:hires");
const F_HIT = F_UNLOCK + 18;             // the coin reaches the lock
const F_IRIS = 674, F_END = 686;

/* ---------- the results grid (the B→C hand-off geometry) ---------- */
const W = 290, GAP = 24, CH = 149;   // the measured height of a w-290 CandidateCard (matches scene B at the join)
const RX = DASH.x + DASH.rail + 32, RY = DASH.y + DASH.bar + 72;   // results area, screen coords
const slot = (i: number) => ({ x: (i % 4) * (W + GAP), y: Math.floor(i / 4) * (CH + GAP) });

// a few more anonymised profiles from the pool (example data): they flow in on the skills filter, and the experience
// and qualification filters remove them again
const EXTRA: Cand[] = [
  { id: "2733", role: "Marketing Graduate", field: "Marketing", skills: ["Social media", "Spanish"], exp: 5, edu: "Master", lang: "EN · ES", city: "Madrid", name: "", initials: "" },
  { id: "1596", role: "Media Graduate", field: "Media", skills: ["Social media", "Video"], exp: 2, edu: "Diploma", lang: "EN · NL", city: "Utrecht", name: "", initials: "" },
  { id: "4127", role: "Marketing Graduate", field: "Marketing", skills: ["SEO", "Spanish"], exp: 6, edu: "Bachelor", lang: "EN · ES", city: "Valencia", name: "", initials: "" },
];
const POOL: Record<string, Cand> = Object.fromEntries([...CANDIDATES, ...EXTRA].map((c) => [c.id, c]));
const START = CANDIDATES.slice(0, 8).map((c) => c.id);
const STAGES: { at: number; list: string[]; count: number }[] = [
  { at: F0, list: START, count: 1248 },
  { at: F_SKILLS, list: ["2481", "3125", "3367", "2733", "2678", "1596", "4127"], count: 312 },
  { at: F_EXP, list: ["2481", "3125", "3367", "2678", "1596"], count: 86 },
  { at: F_QUAL, list: ["2481", "3125", "3367", "2678"], count: 12 },
];
const ALL = Array.from(new Set(STAGES.flatMap((s) => s.list)));
const MATCH: Record<string, number> = { "2481": 98, "3125": 91, "3367": 87, "2678": 84 };

type CardState = { x: number; y: number; o: number; sc: number; rot: number; verdict: number; w?: number } | null;
// the last few matches step forward: the grid opens up into 2 × 2 larger cards
const W2 = 606, CH2 = CH * W2 / W;
const slot2 = (i: number) => ({ x: (i % 2) * (W2 + GAP), y: Math.floor(i / 2) * (CH2 + GAP) });
const growAt = (g: number) => kf(g, f("w:qualifications") + 10, 24, MOVE);
const cardState = (id: string, g: number): CardState => {
  let st: CardState = null;
  for (let n = 0; n < STAGES.length; n++) {
    const { at, list } = STAGES[n];
    const prev = n > 0 ? STAGES[n - 1].list : [];
    const i = list.indexOf(id), was = prev.indexOf(id);
    if (n === 0) { if (i >= 0) st = { ...slot(i), o: 1, sc: 1, rot: 0, verdict: 0 }; continue; }
    if (was >= 0 && i >= 0 && st) {                     // stays: reflows into its new place
      const p = kf(g, at + 15 + i * 1.5, 16, MOVE), s = slot(i);
      const cur: NonNullable<CardState> = st;
      st = { ...cur, x: mix(cur.x, s.x, p), y: mix(cur.y, s.y, p) };
    } else if (was >= 0 && i < 0 && st) {               // a non-match: flagged, then it drops out of the grid
      const j = prev.filter((x) => !list.includes(x)).indexOf(id);
      const v = kf(g, at + 3 + j * 2, 5), d = kf(g, at + 8 + j * 2.5, 16, DEPART);
      if (d >= 1) return null;
      return { x: st.x, y: st.y + d * 170, o: 1 - d, sc: 1 - 0.22 * d, rot: (j % 2 ? 9 : -7) * d, verdict: v };
    } else if (was < 0 && i >= 0) {                     // a new match flows in from the pool below
      const j = list.filter((x) => !prev.includes(x)).indexOf(id);
      const p = kf(g, at + 17 + j * 3, 18);
      if (g < at + 17 + j * 3) return null;
      const s = slot(i);
      st = { x: s.x, y: s.y + (1 - p) * 300, o: clamp01(p * 1.6), sc: 0.9 + 0.1 * p, rot: 0, verdict: 0 };
    }
    if (g < at) break;
  }
  const fi = STAGES[STAGES.length - 1].list.indexOf(id);
  if (st && fi >= 0) {
    const p = growAt(g), s2 = slot2(fi);
    st = { ...st, x: mix(st.x, s2.x, p), y: mix(st.y, s2.y, p), w: mix(W, W2, p) };
  }
  return st;
};
const countAt = (g: number) => {
  let c = STAGES[0].count;
  for (let n = 1; n < STAGES.length; n++) c = mix(c, STAGES[n].count, kf(g, STAGES[n].at + 6, 18, MOVE));
  return Math.round(c);
};

/* ---------- the pool: one dot per candidate (1,248), thinned by each filter ---------- */
const NDOT = 1248, DCOL = 64, DSX = 1236 / DCOL, DSY = 15, DY0 = 396;
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const RANK: number[] = (() => { const o = Array.from({ length: NDOT }, (_, i) => i).sort((a, b) => hash(a) - hash(b)); const r = new Array(NDOT); o.forEach((i, j) => (r[i] = j)); return r; })();
const KEEP = [NDOT, 312, 86, 12];
const packed = (n: number, i: number) => {             // where dot i sits after stage n (survivors close ranks, centred)
  const cnt = KEEP[n];
  let j = i;
  if (n > 0) { j = 0; for (let q = 0; q < i; q++) if (RANK[q] < cnt) j++; }
  const row = Math.floor(j / DCOL), inRow = Math.min(DCOL, cnt - row * DCOL);
  return { x: (j % DCOL) * DSX + ((DCOL - inRow) * DSX) / 2 + DSX / 2, y: DY0 + row * DSY };
};
const PACK: { x: number; y: number }[][] = [0, 1, 2, 3].map((n) => Array.from({ length: NDOT }, (_, i) => packed(n, i)));
const Pool: React.FC<{ g: number }> = ({ g }) => {
  if (g <= F0) return null;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < NDOT; i++) {
    const p0 = PACK[0][i];
    const born = kf(g, F0 + 1 + (p0.x / 1236) * 10 + ((p0.y - DY0) / 300) * 5, 10);
    if (born <= 0) continue;
    let x = p0.x, y = p0.y + (1 - born) * 140, o = born, red = 0, r = 4.6;
    let gone = false;
    for (let n = 1; n <= 3; n++) {
      const at = STAGES[n].at;
      if (RANK[i] < KEEP[n]) {
        red = Math.max(red, kf(g, at + 4, 8) * (0.45 + 0.18 * n));
        if (n < 3) { const q = kf(g, at + 14 + (x / 1236) * 6, 18, MOVE); x = mix(x, PACK[n][i].x, q); y = mix(y, PACK[n][i].y, q); }
        else {                                               // the last dozen fly up into the four matches
          const card = slot(RANK[i] % 4), q = kf(g, at + 14 + (RANK[i] % 3) * 2, 14, MOVE);
          x = mix(x, card.x + W / 2, q); y = mix(y, card.y + CH / 2 - 40 * Math.sin(Math.PI * q), q); o *= 1 - kf(g, at + 24, 6); r *= 1 + q;
        }
      } else if (RANK[i] < KEEP[n - 1]) {                 // filtered out: falls away as the scan passes
        const d = kf(g, at - 1 + (x / 1236) * 11, 14, DEPART);
        y += d * 110; o *= 1 - d; r *= 1 - 0.4 * d;
        if (d >= 1) gone = true;
        break;
      }
    }
    if (gone || o <= 0.01) continue;
    out.push(<circle key={i} cx={x} cy={y} r={r} fill={red > 0 ? C.red : C.light} opacity={o * (red > 0 ? red : 0.75)} />);
  }
  return <svg width={1236} height={720} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{out}</svg>;
};

/* ---------- the camera: a slow push toward each beat's focus (pull back as the profile opens and folds) ---------- */
const CAM: [number, number, number, number, Ease][] = [
  [F0, 1, 1110, 560, (t) => t], [466, 1.1, 1110, 560, (t) => t], [506, 1.15, 795, 429, MOVE], [526, 1, 960, 590, (t) => t],
  [F_AND2, 1.18, 1150, 600, MOVE], [630, 1, 960, 600, MOVE], [640, 1.1, 800, 610, MOVE], [660, 1.18, 1180, 600, (t) => t], [F_END, 1.24, 1300, 580, (t) => t],
];
const camAt = (g: number) => {
  for (let i = 0; i < CAM.length - 1; i++) {
    const [a, z0, x0, y0, e] = CAM[i], [b, z1, x1, y1] = CAM[i + 1];
    if (g <= b) { const t = e(clamp01((g - a) / (b - a))); return { z: mix(z0, z1, t), fx: mix(x0, x1, t), fy: mix(y0, y1, t) }; }
  }
  const l = CAM[CAM.length - 1]; return { z: l[1], fx: l[2], fy: l[3] };
};

/* ---------- the profile panel ---------- */
const PNL = { x: 300, y: 210, w: 1320, h: 760 };
const SOF = { x: 1190, y: 600, w: 480, h: 170 };
const EMP = { x: 250, y: 600, w: 480, h: 170 };
const LOCK = { x: PNL.x + 700 + 282, y: PNL.y + 262 + 196 };   // the lock's centre on screen
const COIN0 = { x: 1598, y: 159 };                                  // the credits counter's coin
const qb = (a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }, t: number) =>
  ({ x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y });

// hidden data: the locked contact details show only as shifting, unreadable characters
const GLY = "abcdefghijklmnopqrstuvwxyz0123456789";
const scramble = (t: string, g: number, k: number) => t.split("").map((ch, i) => (ch === " " || ch === "@" || ch === "." || ch === "+" ? ch : GLY[Math.floor(hash(g * 3.1 + i * 7.7 + k * 13) * GLY.length)])).join("");
const Label: React.FC<{ t: string; x: number; y: number; o: number }> = ({ t, x, y, o }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 22, letterSpacing: "0.1em", color: C.gray }}>{t}</div>
);
const rise = (o: number, d = 18): React.CSSProperties => ({ opacity: clamp01(o * 1.4), transform: `translateY(${(1 - o) * d}px)` });

const LockGlyph: React.FC<{ s: number; open: number }> = ({ s, open }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={C.red} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", overflow: "visible" }}>
    <g transform={`translate(0 ${-6 * open}) rotate(${-38 * open} 16 21)`}><path d="M16 21 V15 a8 8 0 0 1 16 0 V21" /></g>
    <rect x="11" y="21" width="26" height="19" rx="4" fill={C.red} />
    <circle cx="24" cy="29.5" r="2.6" fill={C.white} stroke="none" />
  </svg>
);

const Panel: React.FC<{ g: number }> = ({ g }) => {
  const c = CANDIDATES[0];
  const unl = kf(g, F_HIT + 6, 12);                       // avatar, title
  const nameSwap = kf(g, F_HIT + 8, 10);
  const head = kf(g, F_DISC + 8, 14), pill = kf(g, F_DISC + 18, 10, POP), div = kf(g, F_CAND + 2, 18, MOVE);
  const skills = ["Social media", "Spanish", "SEO", "Content"];
  const exp = [["Social media assistant", "2023 – 2025 · 2 yrs"], ["Marketing intern", "2022 – 2023 · 6 months"]];
  const tl = kf(g, F_PROF - 2, 16, MOVE);
  const box = kf(g, F_CAND + 6, 14);
  const lockIn = kf(g, F_PROF, 10, POP);
  const hit = kf(g, F_HIT, 5, SNAP) * (1 - kf(g, F_HIT + 5, 8));
  const open = kf(g, F_HIT + 1, 9, POP);
  const lockOut = kf(g, F_HIT + 14, 10, MOVE);
  const btn = kf(g, F_PROF + 8, 10, POP);
  const press = kf(g, F_UNLOCK - 4, 4, SNAP) * (1 - kf(g, F_UNLOCK, 6)) + kf(g, F_AND2 - 3, 3, SNAP) * (1 - kf(g, F_AND2, 5));
  const toConnect = kf(g, F_HIT + 18, 8);
  const ok = kf(g, F_HIT + 10, 10, POP);
  const rows: [string, string][] = [["user", c.name], ["mail", "sofia.devries@example.com"], ["phone", "+34 612 345 678"]];
  const shimmer = ((g - F_CAND) % 26) / 26;
  return (
    <>
      {/* header: avatar, who (anonymised until unlocked), match */}
      <div style={{ position: "absolute", left: 56, top: 50, ...rise(head) }}>
        <Avatar size={140} initials={c.initials} unlocked={unl} ring={unl > 0.5 ? C.rose : undefined} />
      </div>
      <div style={{ position: "absolute", left: 228, top: 62, height: 64, width: 560, ...rise(head) }}>
        <div style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, whiteSpace: "nowrap", opacity: 1 - nameSwap, filter: nameSwap > 0 ? `blur(${nameSwap * 8}px)` : undefined }}>Candidate #{c.id}</div>
        <div style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, whiteSpace: "nowrap", opacity: nameSwap, filter: nameSwap < 1 ? `blur(${(1 - nameSwap) * 8}px)` : undefined }}>{c.name}</div>
      </div>
      <div style={{ position: "absolute", left: 228, top: 132, fontFamily: FONT, fontWeight: 400, fontSize: 28, color: C.gray, whiteSpace: "nowrap", ...rise(head) }}>{c.role} · {c.city}, Spain</div>
      <div style={{ position: "absolute", right: 56, top: 82, transform: `scale(${pill})`, transformOrigin: "100% 50%", opacity: clamp01(pill * 2) }}><Pill text="98% match" icon="star" size={26} /></div>
      <div style={{ position: "absolute", left: 56, top: 228, height: 2, width: (PNL.w - 112) * div, background: C.line }} />

      {/* left column: skills, experience, education, languages */}
      <Label t="SKILLS" x={56} y={258} o={kf(g, F_CAND, 10)} />
      <div style={{ position: "absolute", left: 56, top: 296, width: 600, display: "flex", flexWrap: "wrap", gap: 10 }}>
        {skills.map((t, i) => { const p = kf(g, F_CAND + 3 + i * 3, 10, POP); return <Chip key={t} text={t} size={24} on={i < 2 ? 1 : 0} style={{ transform: `scale(${p})`, opacity: clamp01(p * 2) }} />; })}
      </div>
      <Label t="EXPERIENCE" x={56} y={372} o={kf(g, F_PROF - 6, 10)} />
      <div style={{ position: "absolute", left: 67, top: 418, width: 3, height: 74 * tl, background: C.red, borderRadius: 2 }} />
      {exp.map(([a, b], i) => {
        const p = kf(g, F_PROF + i * 6, 12);
        return (
          <div key={a} style={{ position: "absolute", left: 56, top: 406 + i * 74, display: "flex", gap: 20, ...rise(p, 12) }}>
            <div style={{ width: 25, height: 25, borderRadius: "50%", background: C.white, boxShadow: `inset 0 0 0 5px ${C.red}`, flex: "none", marginTop: 3 }} />
            <div><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.ink }}>{a}</div><div style={{ fontFamily: FONT, fontSize: 22, color: C.gray }}>{b}</div></div>
          </div>
        );
      })}
      <Label t="EDUCATION" x={56} y={572} o={kf(g, F_PROF + 10, 10)} />
      <div style={{ position: "absolute", left: 56, top: 608, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.ink, ...rise(kf(g, F_PROF + 12, 12), 12) }}>
        <Ico n="cap" s={34} c={C.red} />Bachelor's degree · Marketing
      </div>
      <Label t="LANGUAGES" x={56} y={666} o={kf(g, F_PROF + 14, 10)} />
      <div style={{ position: "absolute", left: 56, top: 700, display: "flex", gap: 10 }}>
        {["English", "Spanish", "Dutch"].map((t, i) => { const p = kf(g, F_PROF + 16 + i * 3, 10, POP); return <Chip key={t} text={t} size={22} style={{ transform: `scale(${p})`, opacity: clamp01(p * 2) }} />; })}
      </div>

      {/* right column: the locked contact section and the unlock action */}
      <div style={{ position: "absolute", left: 700, top: 262, width: 564, height: 330, borderRadius: 24, background: C.ivory, boxShadow: `inset 0 0 0 2px ${C.line}`, overflow: "hidden", ...rise(box, 24) }}>
        <div style={{ position: "absolute", left: 32, top: 28, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: C.ink }}>
          <Ico n={open > 0.5 ? "unlock" : "lock"} s={30} c={C.red} w={2.8} />Contact details
        </div>
        <div style={{ position: "absolute", right: 28, top: 26, transform: `scale(${ok})`, opacity: clamp01(ok * 2), display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 999, background: C.greenTint, color: C.green, fontFamily: FONT, fontWeight: 700, fontSize: 22 }}>
          <Ico n="check" s={22} c={C.green} w={3.2} />Unlocked
        </div>
        {rows.map(([ic, t], i) => {
          const b = 1 - kf(g, F_HIT + 4 + i * 4, 16, MOVE), p = kf(g, F_CAND + 10 + i * 3, 12);
          return (
            <div key={ic} style={{ position: "absolute", left: 32, top: 96 + i * 72, display: "flex", alignItems: "center", gap: 18, ...rise(p, 10) }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: C.rose, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={ic} s={26} c={C.red} /></div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.ink, filter: b > 0.01 ? `blur(${b * 6}px)` : undefined, opacity: 1 - b * 0.35 }}>{b > 0.55 ? scramble(t, g, i) : t}</div>
            </div>
          );
        })}
        {g < F_HIT + 8 && <div style={{ position: "absolute", top: 80, bottom: 0, left: -200 + shimmer * 900, width: 160, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))", transform: "skewX(-18deg)" }} />}
      </div>
      {/* the reveal: a rose wave runs out from the opened lock across the whole profile */}
      {g >= F_HIT + 2 && g < F_HIT + 22 && (() => {
        const w = kf(g, F_HIT + 2, 18, MOVE), R0 = 1500 * w;
        return <div style={{ position: "absolute", left: LOCK.x - PNL.x - R0, top: LOCK.y - PNL.y - R0, width: 2 * R0, height: 2 * R0, borderRadius: "50%", mixBlendMode: "multiply",
          background: `radial-gradient(circle, rgba(252,230,231,0) 55%, ${C.rose} 80%, rgba(252,230,231,0) 100%)`, opacity: 1 - kf(g, F_HIT + 14, 8) }} />;
      })()}
      {/* the lock over the blurred details: it springs open when the credit lands, then clears away */}
      {lockOut < 1 && (
        <div style={{ position: "absolute", left: LOCK.x - PNL.x - 62, top: LOCK.y - PNL.y - 62, width: 124, height: 124, borderRadius: "50%", background: C.white,
          boxShadow: "0 18px 40px -16px rgba(25,27,32,0.35)", display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${lockIn * (1 + 0.16 * hit) * (1 - lockOut * 0.6)}) rotate(${Math.sin((g - F_HIT) * 1.3) * 8 * hit}deg)`, opacity: 1 - lockOut }}>
          <LockGlyph s={70} open={open} />
        </div>
      )}
      {g >= F_HIT && g < F_HIT + 14 && Array.from({ length: 10 }, (_, i) => {
        const p = kf(g, F_HIT, 12), a = (i / 10) * Math.PI * 2, r0 = 76 + p * 40, r1 = 76 + p * 90;
        return <div key={i} style={{ position: "absolute", left: LOCK.x - PNL.x + Math.cos(a) * r0, top: LOCK.y - PNL.y + Math.sin(a) * r0, width: r1 - r0, height: 5, borderRadius: 3, background: C.red, opacity: 1 - p, transformOrigin: "0 50%", transform: `rotate(${a}rad)` }} />;
      })}
      {/* the action: unlock with one credit, then connect */}
      <div style={{ position: "absolute", left: 700, top: 622, width: 564, height: 86, borderRadius: 999, background: C.red, boxShadow: "0 18px 36px -16px rgba(207,20,30,0.6)",
        transform: `scale(${btn * (1 - 0.06 * press)})`, opacity: clamp01(btn * 2), overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.white, opacity: 1 - toConnect, transform: `translateY(${-toConnect * 30}px)` }}>
          <Ico n="unlock" s={32} c={C.white} w={2.8} />Unlock profile · 1 credit
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.white, opacity: toConnect, transform: `translateY(${(1 - toConnect) * 30}px)` }}>
          <Ico n="send" s={30} c={C.white} w={2.8} />Connect
        </div>
      </div>
    </>
  );
};

const PersonCard: React.FC<{ who: "emp" | "sof"; g: number }> = ({ who }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 24, padding: "0 30px" }}>
    {who === "sof" ? <Avatar size={110} initials="SV" unlocked={1} /> : (
      <div style={{ width: 110, height: 110, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n="building" s={58} c={C.white} w={2.6} /></div>
    )}
    <div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.ink, whiteSpace: "nowrap" }}>{who === "sof" ? "Sofia de Vries" : "Employer"}</div>
      <div style={{ fontFamily: FONT, fontSize: 24, color: C.gray, whiteSpace: "nowrap" }}>{who === "sof" ? "Marketing Graduate" : "Your hiring team"}</div>
    </div>
  </div>
);

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g < F0 || g > F_END) return null;

  /* the dashboard: sharp through the filtering, recedes behind the profile, fades for the connection */
  const recede = kf(g, F_DISC - 2, 20, MOVE);
  const gone = kf(g, F_AND2 - 3, 11, MOVE);
  const filters: [number, number, number] = [g >= F_SKILLS ? 1 : 0, g >= F_EXP ? 1 : 0, g >= F_QUAL ? 1 : 0];
  const credits = g >= F_UNLOCK + 6 ? 9 : 10;
  const dim = kf(g, F_MATCH, 12), sink = kf(g, F_MATCH, 26, MOVE);
  const hi = kf(g, F_RIGHT, 8, POP);

  const scans = [F_FILTER, F_SKILLS, F_EXP, F_QUAL].map((a, i) => ({ p: kf(g, i === 0 ? a : a - 2, i === 0 ? 14 : 11, MOVE), on: g >= (i === 0 ? a : a - 2) }));

  const grid = (
    <>
      {ALL.map((id) => {
        const s = cardState(id, g);
        if (!s) return null;
        if (id === "2481" && g >= F_DISC - 2) return null;      // the match leaves the grid as the profile
        const m = MATCH[id];
        const fi = STAGES[3].list.indexOf(id);
        const showM = m !== undefined && g >= F_FIND + fi * 3;
        const mv = showM ? Math.round(mix(60, m, kf(g, F_FIND + fi * 3, 12))) : undefined;
        const isMatch = id === "2481";
        const d = isMatch ? 0 : dim;
        return (
          <div key={id} style={{ position: "absolute", left: s.x, top: s.y, opacity: s.o * (1 - 0.55 * d), transform: `scale(${s.sc * (isMatch ? 1 + 0.05 * hi : 1 - 0.12 * sink)}) rotate(${s.rot}deg)`, transformOrigin: "50% 50%" }}>
            <CandidateCard c={POOL[id]} w={s.w ?? W} match={mv} hi={isMatch ? hi : 0} />
            {s.verdict > 0 && (
              <div style={{ position: "absolute", inset: 0, borderRadius: 19, background: `rgba(240,240,239,${0.7 * s.verdict})` }}>
                <div style={{ position: "absolute", right: 14, top: 14, width: 40, height: 40, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${POP(s.verdict)})` }}><Ico n="x" s={24} c={C.white} w={3.4} /></div>
              </div>
            )}
          </div>
        );
      })}
      <Pool g={g} />
      {/* the filter's scan across the grid */}
      {scans.map((sc, i) => sc.on && sc.p < 1 && (
        <div key={i} style={{ position: "absolute", left: -220 + sc.p * 1480, top: -16, width: 220, height: CH * 2 + GAP + 32, background: "linear-gradient(90deg, rgba(252,230,231,0), rgba(252,230,231,0.85))", borderRight: `4px solid ${C.red}` }} />
      ))}
    </>
  );

  // the counter's drop, as a red delta floating off it
  const deltas = [1, 2, 3].map((n) => ({ t: STAGES[n].count - STAGES[n - 1].count, p: kf(g, STAGES[n].at + 6, 22) }));

  // the rail lights up: a red edge runs down it; each filter group pulses as it switches on
  const rail = kf(g, F_FILTER, 14, MOVE);
  const groups = [{ at: F_SKILLS, y: 268, h: 120 }, { at: F_EXP, y: 394, h: 82 }, { at: F_QUAL, y: 481, h: 82 }];

  // match ripples around the chosen card
  const rip = g >= F_MATCH && g < F_DISC + 4 ? [0, 1, 2].map((i) => ((g - F_MATCH + i * 9) % 27) / 27) : [];

  /* the profile: the card grows out of the grid into the panel; later it folds into Sofia's contact card */
  const grow = kf(g, F_DISC - 2, 18, MOVE);
  const fold = kf(g, F_AND2 + 1, 16, SNAP);
  const card0 = { x: RX, y: RY, w: W2 * 1.05, h: CH2 * 1.05 };
  let px = mix(card0.x - W2 * 0.025, PNL.x, grow), py = mix(card0.y - CH2 * 0.025, PNL.y, grow), pw = mix(card0.w, PNL.w, grow), ph = mix(card0.h, PNL.h, grow);
  px = mix(px, SOF.x, fold); py = mix(py, SOF.y, fold); pw = mix(pw, SOF.w, fold); ph = mix(ph, SOF.h, fold);
  const panelOn = g >= F_DISC - 2;

  /* credits counter (kept sharp above the receded dashboard) and the coin */
  const lift = kf(g, F_UNLOCK - 6, 6) * (1 - kf(g, F_UNLOCK + 14, 10));
  const roll = kf(g, F_UNLOCK + 2, 8, MOVE);
  const coinP = kf(g, F_UNLOCK, 18, MOVE);
  const coinOn = g >= F_UNLOCK && g < F_HIT + 1;

  /* the connection */
  const emp = kf(g, F_CONNECT + 4, 14, POP);
  const lineP = kf(g, F_DIRECTLY, 16, MOVE);
  const a = { x: EMP.x + EMP.w, y: EMP.y + EMP.h / 2 }, b = { x: SOF.x, y: SOF.y + SOF.h / 2 };
  const BEND = -0.2, ctl = { x: (a.x + b.x) / 2 - (b.y - a.y) * BEND, y: (a.y + b.y) / 2 + (b.x - a.x) * BEND };
  const bub0 = { x: EMP.x + EMP.w / 2, y: 545 }, bubC = { x: 960, y: 420 }, bub1 = { x: SOF.x + SOF.w / 2, y: 545 };
  const bubIn = kf(g, F_WITH2 - 8, 8, POP);
  const travel = kf(g, F_WITH2, 20, MOVE);
  const bp = qb(bub0, bubC, bub1, travel);
  const land = kf(g, F_WITH2 + 20, 6, SNAP) * (1 - kf(g, F_WITH2 + 26, 8));
  const pulse = qb(a, ctl, b, travel);
  const reply = kf(g, F_HIRES + 6, 10, POP);
  const iris = kf(g, F_IRIS, F_END - 2 - F_IRIS, ACC);
  const sofBeat = kf(g, F_WITH2 + 19, 4, SNAP) * (1 - kf(g, F_WITH2 + 23, 8));

  const cam = camAt(g);
  const scr = (x: number, y: number) => ({ x: cam.fx + (x - cam.fx) * cam.z, y: cam.fy + (y - cam.fy) * cam.z });
  const irisAt = scr(bub1.x, bub1.y);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${cam.fx}px ${cam.fy}px`, transform: `scale(${cam.z})` }}>
      {gone < 1 && (
        <Dashboard count={countAt(g)} credits={credits} filters={filters} o={(1 - 0.5 * recede) * (1 - gone)}
          style={recede > 0 ? { filter: `blur(${(recede * 6 + gone * 4).toFixed(2)}px)` } : undefined}>
          {grid}
        </Dashboard>
      )}

      {/* the connection's ground: a soft rose field grows from where the line will run */}
      {g >= F_AND2 + 4 && (() => {
        const r = 1500 * kf(g, F_AND2 + 4, 26, MOVE);
        return <div style={{ position: "absolute", left: 960 - r, top: 685 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: C.rose }} />;
      })()}
      {/* rail and counter details (sharp layer over the dashboard, only while it is in focus) */}
      {recede < 0.5 && (
        <>
          <div style={{ position: "absolute", left: DASH.x + DASH.rail - 3, top: DASH.y + DASH.bar, width: 4, height: (DASH.h - DASH.bar - 30) * rail, background: C.red, borderRadius: 2, opacity: 1 - recede * 2 }} />
          {groups.map((gr, i) => {
            const p = kf(g, gr.at, 16);
            if (p <= 0 || p >= 1) return null;
            return <div key={i} style={{ position: "absolute", left: DASH.x + 14 - 10 * p, top: gr.y - 10 * p, width: DASH.rail - 28 + 20 * p, height: gr.h + 20 * p, borderRadius: 18, boxShadow: `0 0 0 3px rgba(207,20,30,${1 - p})` }} />;
          })}
          {deltas.map((d, i) => d.p > 0 && d.p < 1 && (
            <div key={i} style={{ position: "absolute", left: RX + 232, top: DASH.y + DASH.bar + 22 - d.p * 18, opacity: 1 - d.p, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: C.red }}>−{Math.abs(d.t).toLocaleString("en-US")}</div>
          ))}
          {rip.map((r, i) => (
            <div key={i} style={{ position: "absolute", left: RX - W2 * 0.025 - r * 34, top: RY - CH2 * 0.025 - r * 34, width: W2 * 1.05 + r * 68, height: CH2 * 1.05 + r * 68, borderRadius: 20 + r * 40, boxShadow: `0 0 0 3px rgba(207,20,30,${0.55 * (1 - r)})`, opacity: 1 - recede * 2 }} />
          ))}
          {g >= F_MATCH - 2 && (
            <div style={{ position: "absolute", right: 1920 - (RX + W2 * 1.025 - 26), top: RY - 30, transform: `scale(${kf(g, F_MATCH - 2, 10, POP)})`, transformOrigin: "100% 50%", opacity: 1 - recede * 2 }}>
              <Pill text="98% match" icon="star" size={24} filled />
            </div>
          )}
        </>
      )}

      {/* the profile panel */}
      {panelOn && (
        <div style={{ position: "absolute", left: px, top: py, width: pw, height: ph, ...CARD, borderRadius: mix(mix(20, 34, grow), 26, fold), overflow: "hidden",
          boxShadow: `0 0 0 ${3 * (1 - grow)}px ${C.red}, 0 40px 90px -30px rgba(25,27,32,0.38)`, transform: `scale(${1 + 0.03 * sofBeat})` }}>
          {grow < 0.4 && <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - grow / 0.4 }}><CandidateCard c={CANDIDATES[0]} w={W2 * 1.05} match={98} /></div>}
          {fold < 0.5 && <div style={{ position: "absolute", left: 0, top: 0, width: PNL.w, height: PNL.h, opacity: 1 - fold * 2 }}><Panel g={g} /></div>}
          {fold > 0.4 && <div style={{ position: "absolute", inset: 0, opacity: (fold - 0.4) / 0.6 }}><PersonCard who="sof" g={g} /></div>}
        </div>
      )}

      {/* the credits counter, sharp, and the coin it spends */}
      {recede > 0 && gone < 1 && (
        <div style={{ position: "absolute", right: 1920 - (DASH.x + DASH.w - 30), top: DASH.y + 17, height: 44, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderRadius: 999,
          background: C.rose, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.ink, opacity: recede * (1 - gone), transform: `scale(${1 + 0.14 * lift})`, transformOrigin: "100% 50%",
          boxShadow: lift > 0 ? `0 0 0 ${3 * lift}px ${C.red}, 0 12px 26px -10px rgba(207,20,30,0.5)` : undefined }}>
          <Ico n="coin" s={24} c={C.red} />
          <span style={{ position: "relative", display: "inline-block", width: 24, height: 26, overflow: "hidden" }}>
            <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: -roll * 26 }}>10</span>
            <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: (1 - roll) * 26, color: C.red }}>9</span>
          </span>
          credits
        </div>
      )}
      {coinOn && [6, 5, 4, 3, 2, 1, 0].map((j) => {
        const t = clamp01(coinP - j * 0.045);
        const p = qb(COIN0, { x: 1560, y: 30 }, LOCK, t);
        const s = 1 + 0.5 * Math.sin(Math.PI * t);
        return (
          <div key={j} style={{ position: "absolute", left: p.x - 30, top: p.y - 30, width: 60, height: 60, borderRadius: "50%", background: C.red, opacity: j ? 0.18 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s * (j ? 0.85 : 1)})`, boxShadow: j ? undefined : "0 10px 24px -8px rgba(207,20,30,0.6)" }}>
            {!j && <Ico n="coin" s={40} c={C.white} w={2.8} />}
          </div>
        );
      })}

      {/* connect directly: employer ↔ Sofia, the line and the message on it */}
      {g >= F_CONNECT && (
        <>
          <div style={{ position: "absolute", left: EMP.x, top: EMP.y, width: EMP.w, height: EMP.h, ...CARD, transform: `scale(${emp})`, opacity: clamp01(emp * 2), transformOrigin: "100% 50%" }}>
            <PersonCard who="emp" g={g} />
          </div>
          <Link x1={a.x} y1={a.y} x2={b.x} y2={b.y} p={lineP} bend={BEND} width={5} />
          {lineP > 0 && <Dot x={a.x} y={a.y} r={10 * kf(g, F_DIRECTLY, 6, POP)} />}
          {lineP > 0 && <Dot x={b.x} y={b.y} r={10 * kf(g, F_DIRECTLY + 14, 6, POP)} />}
          {travel > 0 && travel < 1 && <Dot x={pulse.x} y={pulse.y} r={16} style={{ boxShadow: `0 0 0 8px rgba(207,20,30,0.18)` }} />}
          {bubIn > 0 && (
            <div style={{ position: "absolute", left: bp.x, top: bp.y, transform: `translate(-50%, -50%) scale(${bubIn * (1 + 0.06 * land)})`, opacity: clamp01(bubIn * 2),
              background: C.red, color: C.white, borderRadius: "30px 30px 30px 8px", padding: "16px 28px", fontFamily: FONT, fontWeight: 700, fontSize: 36, whiteSpace: "nowrap",
              boxShadow: "0 18px 36px -16px rgba(207,20,30,0.6)", display: "flex", alignItems: "center", gap: 12 }}>
              <Ico n="chat" s={30} c={C.white} w={2.6} />Hi Sofia — we'd love to talk!
            </div>
          )}
          {reply > 0 && (
            <div style={{ position: "absolute", left: SOF.x + 40, top: SOF.y + SOF.h + 22, transform: `scale(${reply})`, transformOrigin: "10% 0", opacity: clamp01(reply * 2),
              background: C.white, borderRadius: "8px 30px 30px 30px", padding: "14px 26px", fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.ink, whiteSpace: "nowrap",
              boxShadow: "0 0 0 1px rgba(25,27,32,0.06), 0 18px 36px -18px rgba(25,27,32,0.35)", display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar size={40} initials="SV" unlocked={1} />Sounds great — let's talk!
            </div>
          )}
        </>
      )}

      </div>
      {g >= F_CONNECT && <Say g={g} y={150} size={112} words={[{ t: "Connect", at: "w:connect" }, { t: "directly.", at: "w:directly", red: true }]} />}
      <RedIris x={irisAt.x} y={irisAt.y} p={iris} />
    </AbsoluteFill>
  );
};
