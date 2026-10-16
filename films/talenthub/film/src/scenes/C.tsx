// Scene C (s2 → s3): Filter by skills, experience, and qualifications to find the right match. Discover candidate
// profiles, unlock contact details, and connect directly with potential hires. See ../../../plan/storyboard.md and
// ../../../plan/v2-jongleren-nl.md.
// Explanation motion: each filter scans the grid, the non-matches drop out and the rest reflow (the counter falls);
// the 4th filter, "Verified partner · JongLeren", removes the cards without the JongLeren badge, so every remaining
// match is a JongLeren alumnus. The match rises, its card grows into the profile, where the JongLeren internship sits
// in the experience and the VERIFIED PARTNER seal stamps onto the profile (the hero JongLeren moment). A credit coin
// flies into the lock that springs open (the blur dissolves), and a red line connects employer and candidate with the
// message travelling along it. Ends in a red iris. Every time is a label (English and Dutch voice-overs).
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  ARRIVE, Avatar, C, CANDIDATES, CARD, Cand, CandidateCard, Chip, DASH, DEPART, Dashboard, Dot, FONT, Ico, JLBadge, JLMark, Link, MOVE, POP, PartnerSeal, Pill, RedIris, SNAP, Say,
  clamp01, f, mix, roleTx, skillTx, tx,
} from "../shared";

type Ease = (t: number) => number;
const kf = (g: number, a: number, d: number, e: Ease = ARRIVE) => e(clamp01((g - a) / Math.max(1, d)));
const ACC: Ease = (t) => t * t;

/* ---------- beats (frames, all from the voice-over's labels) ---------- */
const F0 = f("s2");
const F_FILTER = f("w:filter"), F_SKILLS = f("w:skills"), F_EXP = f("w:experience"), F_QUAL = f("w:qualifications");
const F_JL = f("w:qualifications+0.35");  // the verified-partner filter switches on right after the qualifications
const F_FIND = f("w:find"), F_RIGHT = f("w:right"), F_MATCH = f("w:match");
const F_DISC = f("w:discover"), F_CAND = f("w:candidate"), F_PROF = f("w:profiles");
const F_UNLOCK = f("w:unlock");
const F_AND2 = f("w:and2"), F_CONNECT = f("w:connect"), F_DIRECTLY = f("w:directly"), F_WITH2 = f("w:with2"), F_HIRES = f("w:hires");
const F_HIT = F_UNLOCK + 18;               // the coin reaches the lock
const F_SEAL = F_PROF + 4, F_STAMP = F_SEAL + 7;   // the partner seal drops, and presses onto the profile
const F_BTN = Math.min(F_PROF + 12, F_UNLOCK - 14);
const F_TOCONNECT = Math.min(F_HIT + 18, F_AND2 - 10);
const F_IRIS = f("s3") - 7, F_END = f("s3") + 5;   // the iris covers the frame by s3+3; C draws nothing after s3+5

/* ---------- the results grid (the B→C hand-off geometry) ---------- */
const W = 290, GAP = 24, CH = 149;   // the measured height of a w-290 CandidateCard (matches scene B at the join)
const RX = DASH.x + DASH.rail + 32, RY = DASH.y + DASH.bar + 72;   // results area, screen coords
const slot = (i: number) => ({ x: (i % 4) * (W + GAP), y: Math.floor(i / 4) * (CH + GAP) });

// a few more anonymised profiles from the pool (example data): they flow in on the skills filter; the experience and
// qualification filters remove two, and the verified-partner filter the two without JongLeren internship experience
const EXTRA: Cand[] = [
  { id: "2733", role: "Marketing Graduate", field: "Marketing", skills: ["Social media", "Spanish"], exp: 5, edu: "Master", lang: "EN · ES", city: "Madrid", name: "", initials: "" },
  { id: "1596", role: "Marketing Graduate", field: "Marketing", skills: ["Social media", "Video"], exp: 2, edu: "Bachelor", lang: "EN · NL", city: "Utrecht", name: "", initials: "" },
  { id: "3810", role: "Marketing Graduate", field: "Marketing", skills: ["Social media", "English"], exp: 1, edu: "Bachelor", lang: "EN · NL", city: "Leiden", name: "", initials: "" },
  { id: "4127", role: "Marketing Graduate", field: "Marketing", skills: ["SEO", "Spanish"], exp: 3, edu: "Diploma", lang: "EN · ES", city: "Valencia", name: "", initials: "" },
];
const POOL: Record<string, Cand> = Object.fromEntries([...CANDIDATES, ...EXTRA].map((c) => [c.id, c]));
const START = CANDIDATES.slice(0, 8).map((c) => c.id);
// pos = the grid slot of each listed card (default: in list order). Cards that stay never cross: on the skills filter
// the arrivals take the emptied slots; the last four keep their 2 × 2 block and open up into the large cards.
type Stage = { at: number; list: string[]; count: number; pos?: number[] };
const STAGES: Stage[] = [
  { at: F0, list: START, count: 1248 },
  { at: F_SKILLS, list: ["2481", "2733", "3125", "1596", "3810", "4127", "2678", "3367"], count: 312 },
  { at: F_EXP, list: ["2481", "3125", "1596", "3810", "4127", "2678", "3367"], count: 86 },
  { at: F_QUAL, list: ["2481", "3125", "1596", "3810", "2678", "3367"], count: 31 },
  { at: F_JL, list: ["2481", "3125", "2678", "3367"], count: 12, pos: [0, 1, 4, 5] },
];
const NS = STAGES.length;
const posOf = (st: Stage, i: number) => (st.pos ? st.pos[i] : i);
const ALL = Array.from(new Set(STAGES.flatMap((s) => s.list))).sort((a, b) => (a === "2481" ? 1 : 0) - (b === "2481" ? 1 : 0));
const MATCH: Record<string, number> = { "2481": 98, "3125": 91, "2678": 87, "3367": 84 };

type CardState = { x: number; y: number; o: number; sc: number; rot: number; verdict: number; w?: number } | null;
// the last few matches step forward: the grid opens up into 2 × 2 larger cards
const W2 = 606, CH2 = CH * W2 / W;
const slot2 = (i: number) => ({ x: (i % 2) * (W2 + GAP), y: Math.floor(i / 2) * (CH2 + GAP) });
const growAt = (g: number) => kf(g, F_JL + 14, 24, MOVE);
const cardState = (id: string, g: number): CardState => {
  let st: CardState = null;
  for (let n = 0; n < NS; n++) {
    const { at, list } = STAGES[n];
    const prev = n > 0 ? STAGES[n - 1].list : [];
    const i = list.indexOf(id), was = prev.indexOf(id);
    if (n === 0) { if (i >= 0) st = { ...slot(posOf(STAGES[n], i)), o: 1, sc: 1, rot: 0, verdict: 0 }; continue; }
    if (was >= 0 && i >= 0 && st) {                     // stays: reflows into its new place
      const p = kf(g, at + 15 + i * 1.5, 16, MOVE), s = slot(posOf(STAGES[n], i));
      const cur: NonNullable<CardState> = st;
      st = { ...cur, x: mix(cur.x, s.x, p), y: mix(cur.y, s.y, p) };
    } else if (was >= 0 && i < 0 && st) {               // a non-match: flagged, then it drops out of the grid
      const j = prev.filter((x) => !list.includes(x)).indexOf(id);
      const t0 = n === NS - 1 ? at + 2 + (st.x / 1236) * 5 : at + 3 + j * 2;   // the verified-partner scan flags as it passes
      const v = kf(g, t0, 5), d = kf(g, t0 + 5 + j * 0.5, 16, DEPART);
      if (d >= 1) return null;
      return { x: st.x, y: st.y + d * 170, o: st.o * (1 - d), sc: st.sc * (1 - 0.22 * d), rot: (j % 2 ? 9 : -7) * d, verdict: v };
    } else if (was < 0 && i >= 0) {                     // a new match flows in from the pool below
      const j = list.filter((x) => !prev.includes(x)).indexOf(id);
      const p = kf(g, at + 14 + j * 2.5, 16);
      if (g < at + 14 + j * 2.5) return null;
      const s = slot(posOf(STAGES[n], i));
      st = { x: s.x, y: s.y + (1 - p) * 300, o: clamp01(p * 1.6), sc: 0.9 + 0.1 * p, rot: 0, verdict: 0 };
    }
    if (g < at) break;
  }
  const fi = STAGES[NS - 1].list.indexOf(id);
  if (st && fi >= 0) {
    const p = growAt(g), s2 = slot2(fi);
    st = { ...st, x: mix(st.x, s2.x, p), y: mix(st.y, s2.y, p), w: mix(W, W2, p) };
  }
  return st;
};
const countAt = (g: number) => {
  let c = STAGES[0].count;
  for (let n = 1; n < NS; n++) c = mix(c, STAGES[n].count, kf(g, STAGES[n].at + 6, 18, MOVE));
  return Math.round(c);
};

/* ---------- the pool: one dot per candidate (1,248), thinned by each filter ---------- */
const NDOT = 1248, DCOL = 64, DSX = 1236 / DCOL, DSY = 15, DY0 = 396;
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const RANK: number[] = (() => { const o = Array.from({ length: NDOT }, (_, i) => i).sort((a, b) => hash(a) - hash(b)); const r = new Array(NDOT); o.forEach((i, j) => (r[i] = j)); return r; })();
const KEEP = STAGES.map((s) => s.count);
const packed = (n: number, i: number) => {             // where dot i sits after stage n (survivors close ranks, centred)
  const cnt = KEEP[n];
  let j = i;
  if (n > 0) { j = 0; for (let q = 0; q < i; q++) if (RANK[q] < cnt) j++; }
  const row = Math.floor(j / DCOL), inRow = Math.min(DCOL, cnt - row * DCOL);
  return { x: (j % DCOL) * DSX + ((DCOL - inRow) * DSX) / 2 + DSX / 2, y: DY0 + row * DSY };
};
const PACK: { x: number; y: number }[][] = STAGES.map((_, n) => Array.from({ length: NDOT }, (_, i) => packed(n, i)));
// the centre of final match k (0..3) as the four open up into the large cards
const matchCentre = (k: number, g: number) => {
  const a = slot(STAGES[NS - 1].pos![k]), b = slot2(k), p = growAt(g);
  return { x: mix(a.x + W / 2, b.x + W2 / 2, p), y: mix(a.y + CH / 2, b.y + CH2 / 2, p) };
};
const Pool: React.FC<{ g: number }> = ({ g }) => {
  if (g <= F0) return null;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < NDOT; i++) {
    const p0 = PACK[0][i];
    const born = kf(g, F0 + 1 + (p0.x / 1236) * 10 + ((p0.y - DY0) / 300) * 5, 10);
    if (born <= 0) continue;
    let x = p0.x, y = p0.y + (1 - born) * 140, o = born, red = 0, r = 4.6;
    let gone = false;
    for (let n = 1; n < NS; n++) {
      const at = STAGES[n].at;
      if (RANK[i] < KEEP[n]) {
        red = Math.max(red, kf(g, at + 4, 8) * (0.45 + 0.13 * n));
        if (n < NS - 1) { const q = kf(g, at + 14 + (x / 1236) * 6, 18, MOVE); x = mix(x, PACK[n][i].x, q); y = mix(y, PACK[n][i].y, q); }
        else {                                               // the last dozen fly up into the four matches
          const card = matchCentre(RANK[i] % 4, g), q = kf(g, at + 14 + (RANK[i] % 3) * 2, 14, MOVE);
          x = mix(x, card.x, q); y = mix(y, card.y - 40 * Math.sin(Math.PI * q), q); o *= 1 - kf(g, at + 24, 6); r *= 1 + q;
        }
      } else if (RANK[i] < KEEP[n - 1]) {                 // filtered out: falls away as the scan passes
        const d = kf(g, at - 1 + (x / 1236) * 11, 14, DEPART);
        y += d * 110; o *= 1 - d; r *= 1 - 0.4 * d;
        if (d >= 1) gone = true;
        break;
      }
    }
    if (gone || o <= 0.01) continue;
    out.push(<circle key={i} cx={x} cy={y} r={r} fill={red > 0 ? C.red : C.light} opacity={o * (red > 0 ? Math.min(1, red) : 0.75)} />);
  }
  return <svg width={1236} height={720} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{out}</svg>;
};

/* ---------- the camera: a slow push toward each beat's focus (pull back as the profile opens and folds) ---------- */
const CAM: [number, number, number, number, Ease][] = [
  [F0, 1, 1110, 560, (t) => t], [F_FIND - 2, 1.1, 1110, 560, (t) => t], [F_DISC - 6, 1.15, 795, 429, MOVE], [F_DISC + 14, 1, 960, 590, (t) => t],
  [F_AND2, 1.18, 1150, 600, MOVE], [F_WITH2 - 10, 1, 960, 600, MOVE], [F_WITH2, 1.1, 800, 610, MOVE], [F_HIRES + 3, 1.18, 1180, 600, (t) => t], [F_END, 1.24, 1300, 580, (t) => t],
];
const camAt = (g: number) => {
  for (let i = 0; i < CAM.length - 1; i++) {
    const [a, z0, x0, y0, e] = CAM[i], [b, z1, x1, y1] = CAM[i + 1];
    if (g <= b) { const t = e(clamp01((g - a) / Math.max(1, b - a))); return { z: mix(z0, z1, t), fx: mix(x0, x1, t), fy: mix(y0, y1, t) }; }
  }
  const l = CAM[CAM.length - 1]; return { z: l[1], fx: l[2], fy: l[3] };
};

/* ---------- the profile panel ---------- */
const PNL = { x: 300, y: 210, w: 1320, h: 760 };
const SOF = { x: 1190, y: 600, w: 480, h: 170 };
const EMP = { x: 250, y: 600, w: 480, h: 170 };
const LOCK = { x: PNL.x + 700 + 282, y: PNL.y + 262 + 196 };   // the lock's centre on screen
const COIN0 = { x: 1598, y: 159 };                                  // the credits counter's coin
const SEAL = { cx: 1172, cy: 114, d: 184 };                         // the partner seal on the profile (panel coords)
const qb = (a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }, t: number) =>
  ({ x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y });

// the seal's stamp: it drops from above (larger, tilted, lifted shadow), presses in, and settles with a small rebound
const stampAt = (g: number) => {
  const drop = kf(g, F_SEAL, F_STAMP - F_SEAL, ACC);
  if (g < F_STAMP) return { s: mix(1.55, 1, drop), rot: mix(-17, -8, drop), o: clamp01(drop * 3), lift: 1 - drop, press: 0 };
  const u = g - F_STAMP;
  return { s: 1 - 0.085 * Math.exp(-u / 3) * Math.cos(u * 0.8), rot: -8 + 1.6 * Math.exp(-u / 3) * Math.sin(u * 0.8), o: 1, lift: 0, press: Math.exp(-u / 2.2) };
};

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

// the "98% match" pill under the avatar (on the grid card, then on the profile)
const MatchPill: React.FC<{ size: number }> = ({ size }) => <Pill text={tx("98% match", "98% match")} icon="star" size={size} filled />;

const Panel: React.FC<{ g: number }> = ({ g }) => {
  const c = CANDIDATES[0];
  const unl = kf(g, F_HIT + 6, 12);                       // avatar, title
  const nameSwap = kf(g, F_HIT + 8, 10);
  const head = kf(g, F_DISC + 8, 14), pill = kf(g, F_DISC + 18, 10, POP), div = kf(g, F_CAND + 2, 18, MOVE);
  const skills = ["Social media", "Spanish", "SEO", "Content"];
  const tl = kf(g, F_PROF - 2, 16, MOVE);
  const box = kf(g, F_CAND + 6, 14);
  const lockIn = kf(g, F_PROF, 10, POP);
  const hit = kf(g, F_HIT, 5, SNAP) * (1 - kf(g, F_HIT + 5, 8));
  const open = kf(g, F_HIT + 1, 9, POP);
  const lockOut = kf(g, F_HIT + 14, 10, MOVE);
  const btn = kf(g, F_BTN, 10, POP);
  const press = kf(g, F_UNLOCK - 4, 4, SNAP) * (1 - kf(g, F_UNLOCK, 6)) + kf(g, F_AND2 - 3, 3, SNAP) * (1 - kf(g, F_AND2, 5));
  const toConnect = kf(g, F_TOCONNECT, 8);
  const ok = kf(g, F_HIT + 10, 10, POP);
  const rows: [string, string][] = [["user", c.name], ["mail", "sofia.devries@example.com"], ["phone", "+34 612 345 678"]];
  const shimmer = ((g - F_CAND) % 26) / 26;
  // the JongLeren internship in the experience: lit and badged as the seal lands
  const jlRow = kf(g, F_PROF + 5, 12);
  const lit = kf(g, F_STAMP, 12, MOVE);
  const badge = kf(g, F_STAMP + 1, 10, POP);
  const cap = kf(g, F_STAMP + 3, 14);
  return (
    <>
      {/* header: avatar (with the match), who (anonymised until unlocked); the partner seal stamps top right */}
      <div style={{ position: "absolute", left: 56, top: 50, ...rise(head) }}>
        <Avatar size={140} initials={c.initials} unlocked={unl} ring={unl > 0.5 ? C.rose : undefined} />
      </div>
      <div style={{ position: "absolute", left: 126, top: 190, transform: `translate(-50%, -50%) scale(${pill})`, opacity: clamp01(pill * 2) }}><MatchPill size={21} /></div>
      <div style={{ position: "absolute", left: 228, top: 62, height: 64, width: 560, ...rise(head) }}>
        <div style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, whiteSpace: "nowrap", opacity: 1 - nameSwap, filter: nameSwap > 0 ? `blur(${nameSwap * 8}px)` : undefined }}>{tx("Candidate", "Kandidaat")} #{c.id}</div>
        <div style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, whiteSpace: "nowrap", opacity: nameSwap, filter: nameSwap < 1 ? `blur(${(1 - nameSwap) * 8}px)` : undefined }}>{c.name}</div>
      </div>
      <div style={{ position: "absolute", left: 228, top: 132, fontFamily: FONT, fontWeight: 400, fontSize: 28, color: C.gray, whiteSpace: "nowrap", ...rise(head) }}>{roleTx(c.role)} · {c.city}</div>
      {/* the seal's caption: what the stamp means */}
      <div style={{ position: "absolute", right: PNL.w - (SEAL.cx - SEAL.d / 2 - 26), top: SEAL.cy - 36, textAlign: "right", fontFamily: FONT, whiteSpace: "nowrap", ...rise(cap, 14) }}>
        <div style={{ fontWeight: 900, fontSize: 27, color: C.ink, lineHeight: 1.15 }}>{tx("Internship experience", "Stage-ervaring")}</div>
        <div style={{ fontWeight: 700, fontSize: 24, color: C.red, lineHeight: 1.3 }}>{tx("verified by JongLeren", "geverifieerd door JongLeren")}</div>
      </div>
      <div style={{ position: "absolute", left: 56, top: 228, height: 2, width: (PNL.w - 112) * div, background: C.line }} />

      {/* left column: skills, experience (with the JongLeren internship), education, languages */}
      <Label t={tx("SKILLS", "VAARDIGHEDEN")} x={56} y={258} o={kf(g, F_CAND, 10)} />
      <div style={{ position: "absolute", left: 56, top: 296, width: 600, display: "flex", flexWrap: "wrap", gap: 10 }}>
        {skills.map((t, i) => { const p = kf(g, F_CAND + 3 + i * 3, 10, POP); return <Chip key={t} text={skillTx(t)} size={24} on={i < 2 ? 1 : 0} style={{ transform: `scale(${p})`, opacity: clamp01(p * 2) }} />; })}
      </div>
      <Label t={tx("EXPERIENCE", "WERKERVARING")} x={56} y={372} o={kf(g, F_PROF - 6, 10)} />
      {/* the internship row's highlight, wiped in by the stamp */}
      <div style={{ position: "absolute", left: 38, top: 468, width: 620 * lit, height: 84, borderRadius: 18, background: C.ivory, boxShadow: `inset 0 0 0 2px ${C.rose}`, opacity: clamp01(lit * 3) }} />
      <div style={{ position: "absolute", left: 67, top: 418, width: 3, height: 74 * tl, background: C.red, borderRadius: 2 }} />
      <div style={{ position: "absolute", left: 56, top: 406, display: "flex", gap: 20, ...rise(kf(g, F_PROF, 12), 12) }}>
        <div style={{ width: 25, height: 25, borderRadius: "50%", background: C.white, boxShadow: `inset 0 0 0 5px ${C.red}`, flex: "none", marginTop: 3 }} />
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.ink }}>{tx("Social media assistant", "Social media-assistent")}</div>
          <div style={{ fontFamily: FONT, fontSize: 22, color: C.gray }}>{tx("2023 – 2025 · 2 yrs", "2023 – 2025 · 2 jaar")}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 51, top: 478, width: 35, height: 35, borderRadius: "50%", background: C.white, boxShadow: `inset 0 0 0 3px ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${0.6 + 0.4 * POP(jlRow)})`, opacity: clamp01(jlRow * 2) }}>
        <JLMark h={25} />
      </div>
      <div style={{ position: "absolute", left: 101, top: 480, ...rise(jlRow, 12) }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.ink, whiteSpace: "nowrap" }}>{tx("Marketing internship · JongLeren, Málaga", "Marketingstage · JongLeren, Málaga")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 2, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: FONT, fontSize: 22, color: C.gray }}>{tx("2022 – 2023 · 6 months", "2022 – 2023 · 6 maanden")}</span>
          <JLBadge size={17} style={{ transform: `scale(${badge})`, transformOrigin: "0 50%", opacity: clamp01(badge * 2) }} />
        </div>
      </div>
      <Label t={tx("EDUCATION", "OPLEIDING")} x={56} y={572} o={kf(g, F_PROF + 10, 10)} />
      <div style={{ position: "absolute", left: 56, top: 608, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.ink, ...rise(kf(g, F_PROF + 12, 12), 12) }}>
        <Ico n="cap" s={34} c={C.red} />{tx("Bachelor's degree · Marketing", "Bachelor · Marketing")}
      </div>
      <Label t={tx("LANGUAGES", "TALEN")} x={56} y={666} o={kf(g, F_PROF + 14, 10)} />
      <div style={{ position: "absolute", left: 56, top: 700, display: "flex", gap: 10 }}>
        {tx(["English", "Spanish", "Dutch"], ["Engels", "Spaans", "Nederlands"]).map((t, i) => { const p = kf(g, F_PROF + 16 + i * 3, 10, POP); return <Chip key={t} text={t} size={22} style={{ transform: `scale(${p})`, opacity: clamp01(p * 2) }} />; })}
      </div>

      {/* right column: the locked contact section and the unlock action */}
      <div style={{ position: "absolute", left: 700, top: 262, width: 564, height: 330, borderRadius: 24, background: C.ivory, boxShadow: `inset 0 0 0 2px ${C.line}`, overflow: "hidden", ...rise(box, 24) }}>
        <div style={{ position: "absolute", left: 32, top: 28, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: C.ink }}>
          <Ico n={open > 0.5 ? "unlock" : "lock"} s={30} c={C.red} w={2.8} />{tx("Contact details", "Contactgegevens")}
        </div>
        <div style={{ position: "absolute", right: 28, top: 26, transform: `scale(${ok})`, opacity: clamp01(ok * 2), display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 999, background: C.greenTint, color: C.green, fontFamily: FONT, fontWeight: 700, fontSize: 22 }}>
          <Ico n="check" s={22} c={C.green} w={3.2} />{tx("Unlocked", "Ontgrendeld")}
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
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.white, whiteSpace: "nowrap", opacity: 1 - toConnect, transform: `translateY(${-toConnect * 30}px)` }}>
          <Ico n="unlock" s={32} c={C.white} w={2.8} />{tx("Unlock profile · 1 credit", "Profiel ontgrendelen · 1 credit")}
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.white, opacity: toConnect, transform: `translateY(${(1 - toConnect) * 30}px)` }}>
          <Ico n="send" s={30} c={C.white} w={2.8} />{tx("Connect", "Contact opnemen")}
        </div>
      </div>
    </>
  );
};

// the stamp itself, drawn over the panel (not clipped by it): rose ring burst, lifted shadow, the seal
const Stamp: React.FC<{ g: number }> = ({ g }) => {
  if (g < F_SEAL) return null;
  const st = stampAt(g);
  const burst = (dl: number) => {
    const q = kf(g, F_STAMP + dl, 14, ARRIVE);
    if (g < F_STAMP + dl || q >= 1) return null;
    const r = SEAL.d / 2 + 6 + q * (60 + dl * 6);
    return <div key={dl} style={{ position: "absolute", left: SEAL.cx - r, top: SEAL.cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", boxShadow: `inset 0 0 0 ${10 * (1 - q) + 1.5}px rgba(207,20,30,${0.42 * (1 - q)})` }} />;
  };
  const wash = kf(g, F_STAMP, 16);
  return (
    <>
      {g >= F_STAMP && wash < 1 && <div style={{ position: "absolute", left: SEAL.cx - (SEAL.d / 2 + 40 * wash), top: SEAL.cy - (SEAL.d / 2 + 40 * wash), width: SEAL.d + 80 * wash, height: SEAL.d + 80 * wash, borderRadius: "50%", background: C.rose, opacity: 0.9 * (1 - wash) }} />}
      {burst(0)}{burst(4)}
      <div style={{ position: "absolute", left: SEAL.cx - SEAL.d / 2, top: SEAL.cy - SEAL.d / 2, width: SEAL.d, height: SEAL.d, opacity: st.o,
        transform: `translateY(${-26 * st.lift}px) scale(${st.s}) rotate(${st.rot}deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `0 ${8 + 34 * st.lift}px ${12 + 30 * st.lift}px -${6 + 8 * st.lift}px rgba(25,27,32,${0.28 - 0.1 * st.lift})` }} />
        <PartnerSeal size={SEAL.d} />
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
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.ink, whiteSpace: "nowrap" }}>{who === "sof" ? "Sofia de Vries" : tx("Employer", "Werkgever")}</div>
      <div style={{ fontFamily: FONT, fontSize: 24, color: C.gray, whiteSpace: "nowrap" }}>{who === "sof" ? roleTx("Marketing Graduate") : tx("Your hiring team", "Jouw recruitmentteam")}</div>
    </div>
  </div>
);

// the rail's verified-partner chip (screen coords, inside the default dashboard)
const JLCHIP = { x: 186, y: 612, w: 122, h: 31, mx: 202 };

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g < F0 || g > F_END) return null;

  /* the dashboard: sharp through the filtering, recedes behind the profile, fades for the connection */
  const recede = kf(g, F_DISC - 2, 20, MOVE);
  const gone = kf(g, F_AND2 - 3, 11, MOVE);
  const filters: [number, number, number, number] = [g >= F_SKILLS ? 1 : 0, g >= F_EXP ? 1 : 0, g >= F_QUAL ? 1 : 0, g >= F_JL ? 1 : 0];
  const credits = g >= F_UNLOCK + 6 ? 9 : 10;
  const dim = kf(g, F_MATCH, 12), sink = kf(g, F_MATCH, 26, MOVE);
  const hi = kf(g, F_RIGHT, 8, POP);
  const pillP = kf(g, F_MATCH - 2, 10, POP);

  const scans = [F_FILTER, F_SKILLS - 2, F_EXP - 2, F_QUAL - 2, F_JL - 1].map((a, i) => ({ p: kf(g, a, i === 0 ? 14 : 11, MOVE), on: g >= a, jl: i === 4 }));

  const grid = (
    <>
      {ALL.map((id) => {
        const s = cardState(id, g);
        if (!s) return null;
        if (id === "2481" && g >= F_DISC - 2) return null;      // the match leaves the grid as the profile
        const m = MATCH[id];
        const fi = STAGES[NS - 1].list.indexOf(id);
        const showM = m !== undefined && g >= F_FIND + fi * 3;
        const mv = showM ? Math.round(mix(60, m, kf(g, F_FIND + fi * 3, 12))) : undefined;
        const isMatch = id === "2481";
        const d = isMatch ? 0 : dim;
        // the verified-partner scan: each JongLeren badge it passes answers with a pulse
        const bump = POP(kf(g, F_JL + 1 + (s.x / 1236) * 8, 5)) * (1 - kf(g, F_JL + 6 + (s.x / 1236) * 8, 9));
        const cw = s.w ?? W, cs = cw / 300;
        return (
          <div key={id} style={{ position: "absolute", left: s.x, top: s.y, opacity: s.o * (1 - 0.55 * d), transform: `scale(${s.sc * (isMatch ? 1 + 0.05 * hi : 1 - 0.12 * sink)}) rotate(${s.rot}deg)`, transformOrigin: "50% 50%" }}>
            <CandidateCard c={POOL[id]} w={cw} match={mv} hi={isMatch ? hi : 0} verified={1 + 1.1 * bump} />
            {isMatch && pillP > 0 && (
              <div style={{ position: "absolute", left: 41 * cs, top: 70 * cs, transform: `translate(-50%, -50%) scale(${pillP})`, opacity: clamp01(pillP * 2) }}><MatchPill size={8.6 * cs} /></div>
            )}
            {s.verdict > 0 && (
              <div style={{ position: "absolute", inset: 0, borderRadius: 19, background: `rgba(240,240,239,${0.7 * s.verdict})` }}>
                <div style={{ position: "absolute", right: 14, top: 14, width: 40, height: 40, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${POP(s.verdict)})` }}><Ico n="x" s={24} c={C.white} w={3.4} /></div>
              </div>
            )}
          </div>
        );
      })}
      <Pool g={g} />
      {/* the filter's scan across the grid (kept inside the results area; the verified-partner scan carries the JongLeren mark) */}
      <div style={{ position: "absolute", left: -14, top: -30, width: 1264, height: CH * 2 + GAP + 110, overflow: "hidden" }}>
        {scans.map((sc, i) => sc.on && sc.p < 1 && (
          <div key={i} style={{ position: "absolute", left: 14 - 220 + sc.p * 1480, top: 14, width: 220, height: CH * 2 + GAP + 32, background: "linear-gradient(90deg, rgba(252,230,231,0), rgba(252,230,231,0.85))", borderRight: `4px solid ${C.red}` }}>
            {sc.jl && (
              <div style={{ position: "absolute", right: -26, bottom: -24, width: 48, height: 48, borderRadius: "50%", background: C.white, boxShadow: `inset 0 0 0 3px ${C.red}, 0 8px 18px -8px rgba(207,20,30,0.6)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <JLMark h={34} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  // the counter's drop, as a red delta floating off it
  const deltas = STAGES.slice(1).map((st, n) => ({ t: st.count - STAGES[n].count, p: kf(g, st.at + 6, 22) }));

  // the rail lights up: a red edge runs down it; each filter group pulses as it switches on
  const rail = kf(g, F_FILTER, 14, MOVE);
  const groups = [{ at: F_SKILLS, y: 268, h: 120 }, { at: F_EXP, y: 394, h: 82 }, { at: F_QUAL, y: 481, h: 82 }, { at: F_JL, y: 568, h: 82 }];
  // the verified-partner chip's own cause: its JongLeren mark pops and a rose ring runs out of the chip
  const jlPop = kf(g, F_JL - 4, 9, POP) * (1 - kf(g, F_JL + 5, 8));
  const jlRing = kf(g, F_JL - 2, 16);

  // match ripples around the chosen card
  const rip = g >= F_MATCH && g < F_DISC + 4 ? [0, 1, 2].map((i) => ((g - F_MATCH + i * 9) % 27) / 27) : [];

  /* the profile: the card grows out of the grid into the panel; later it folds into Sofia's contact card */
  const grow = kf(g, F_DISC - 2, 18, MOVE);
  const fold = kf(g, F_AND2 + 1, 16, SNAP);
  const card0 = { x: RX, y: RY, w: W2 * 1.05, h: CH2 * 1.05 };
  let px = mix(card0.x - W2 * 0.025, PNL.x, grow), py = mix(card0.y - CH2 * 0.025, PNL.y, grow), pw = mix(card0.w, PNL.w, grow), ph = mix(card0.h, PNL.h, grow);
  px = mix(px, SOF.x, fold); py = mix(py, SOF.y, fold); pw = mix(pw, SOF.w, fold); ph = mix(ph, SOF.h, fold);
  const panelOn = g >= F_DISC - 2;
  const thump = g >= F_STAMP ? stampAt(g).press : 0;          // the stamp presses the profile in a little

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
  const panelBox: React.CSSProperties = { position: "absolute", left: px, top: py, width: pw, height: ph, transform: `scale(${(1 + 0.03 * sofBeat) * (1 - 0.006 * thump)})` };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${cam.fx}px ${cam.fy}px`, transform: `scale(${cam.z}) translateY(${2.5 * thump}px)` }}>
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
          {jlRing > 0 && jlRing < 1 && (
            <div style={{ position: "absolute", left: JLCHIP.x - 14 * jlRing, top: JLCHIP.y - 14 * jlRing, width: JLCHIP.w + 28 * jlRing, height: JLCHIP.h + 28 * jlRing, borderRadius: 999, background: `rgba(252,230,231,${0.8 * (1 - jlRing)})`, boxShadow: `0 0 0 3px rgba(207,20,30,${0.9 * (1 - jlRing)})` }} />
          )}
          {jlPop > 0.01 && (
            <div style={{ position: "absolute", left: JLCHIP.mx - 12, top: JLCHIP.y + JLCHIP.h / 2 - 12, width: 24, height: 24, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${1 + 0.6 * jlPop})`, boxShadow: `0 0 0 ${2 * jlPop}px ${C.red}, 0 6px 14px -6px rgba(207,20,30,${0.6 * jlPop})` }}>
              <JLMark h={20} />
            </div>
          )}
          {deltas.map((d, i) => d.p > 0 && d.p < 1 && (
            <div key={i} style={{ position: "absolute", left: RX + 232, top: DASH.y + DASH.bar + 22 - d.p * 18, opacity: 1 - d.p, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: C.red }}>−{Math.abs(d.t).toLocaleString(tx("en-US", "nl-NL"))}</div>
          ))}
          {rip.map((r, i) => (
            <div key={i} style={{ position: "absolute", left: RX - W2 * 0.025 - r * 34, top: RY - CH2 * 0.025 - r * 34, width: W2 * 1.05 + r * 68, height: CH2 * 1.05 + r * 68, borderRadius: 20 + r * 40, boxShadow: `0 0 0 3px rgba(207,20,30,${0.55 * (1 - r)})`, opacity: 1 - recede * 2 }} />
          ))}
        </>
      )}

      {/* the profile panel */}
      {panelOn && (
        <div style={{ ...panelBox, ...CARD, borderRadius: mix(mix(20, 34, grow), 26, fold), overflow: "hidden",
          boxShadow: `0 0 0 ${3 * (1 - grow)}px ${C.red}, 0 40px 90px -30px rgba(25,27,32,0.38)` }}>
          {fold < 0.5 && <div style={{ position: "absolute", left: 0, top: 0, width: PNL.w, height: PNL.h, opacity: 1 - fold * 2 }}><Panel g={g} /></div>}
          {fold > 0.4 && <div style={{ position: "absolute", inset: 0, opacity: (fold - 0.4) / 0.6 }}><PersonCard who="sof" g={g} /></div>}
        </div>
      )}
      {/* over the panel, unclipped: the grid card as it hands over (its badge sits on its top edge), and the seal */}
      {panelOn && (grow < 0.4 || fold < 0.5) && (
        <div style={panelBox}>
          {grow < 0.4 && (
            <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - grow / 0.4 }}>
              <CandidateCard c={CANDIDATES[0]} w={W2 * 1.05} match={98} verified={1} />
              <div style={{ position: "absolute", left: 41 * W2 * 1.05 / 300, top: 70 * W2 * 1.05 / 300, transform: "translate(-50%, -50%)" }}><MatchPill size={8.6 * W2 * 1.05 / 300} /></div>
            </div>
          )}
          {fold < 0.5 && <div style={{ position: "absolute", left: 0, top: 0, width: PNL.w, height: PNL.h, opacity: 1 - fold * 2 }}><Stamp g={g} /></div>}
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
          {tx("credits", "credits")}
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
              background: C.red, color: C.white, borderRadius: "30px 30px 30px 8px", padding: "16px 28px", fontFamily: FONT, fontWeight: 700, fontSize: tx(36, 32), whiteSpace: "nowrap",
              boxShadow: "0 18px 36px -16px rgba(207,20,30,0.6)", display: "flex", alignItems: "center", gap: 12 }}>
              <Ico n="chat" s={30} c={C.white} w={2.6} />{tx("Hi Sofia — we'd love to talk!", "Hoi Sofia, we maken graag kennis!")}
            </div>
          )}
          {reply > 0 && (
            <div style={{ position: "absolute", left: SOF.x + 40, top: SOF.y + SOF.h + 22, transform: `scale(${reply})`, transformOrigin: "10% 0", opacity: clamp01(reply * 2),
              background: C.white, borderRadius: "8px 30px 30px 30px", padding: "14px 26px", fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.ink, whiteSpace: "nowrap",
              boxShadow: "0 0 0 1px rgba(25,27,32,0.06), 0 18px 36px -18px rgba(25,27,32,0.35)", display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar size={40} initials="SV" unlocked={1} />{tx("Sounds great — let's talk!", "Klinkt goed, graag!")}
            </div>
          )}
        </>
      )}

      </div>
      {g >= F_CONNECT && <Say g={g} y={150} size={112} words={tx(
        [{ t: "Connect", at: "w:connect" }, { t: "directly.", at: "w:directly", red: true }],
        [{ t: "Direct", at: "w:nl_direct" }, { t: "in", at: "w:nl_in2" }, { t: "contact.", at: "w:nl_contact", red: true }],
      )} />}
      <RedIris x={irisAt.x} y={irisAt.y} p={iris} />
    </AbsoluteFill>
  );
};
