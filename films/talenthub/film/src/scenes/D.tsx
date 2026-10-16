// Scene D (s3 → s4): For graduates… For employers and recruiters… See ../../../plan/storyboard.md and
// ../../../plan/v2-jongleren-nl.md. Every time is label-relative, so the Dutch voice-over retimes it.
// Graduates: the red field closes into a dot that grows into a gateway; the profile completes, its internship verified
// by JongLeren; the door opens onto a turning globe and opportunities abroad fly out of it on curved paths; one is
// applied to and a plane flies the route through the gateway. Underneath runs the graduate's path: internship in Spain
// (JongLeren, done) → Talent Hub → career abroad. Employers: two client types post vacancies into the platform, a scan
// sweeps the anonymised pool, the matches light up carrying the JongLeren mark and land ranked, each one's "JongLeren
// verified" badge popping on as it lands; a red iris from the top match (a JongLeren alumna) hands off to E.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ARRIVE, Avatar, C, CANDIDATES, CARD, Chip, DEPART, FONT, Ico, JLBadge, JLMark, JOBS, MOVE, POP, Pill, RedIris, Say, THMark, clamp01, f, k, mix, roleTx, skillTx, tx } from "../shared";

type Pt = [number, number];
type Ease = (x: number) => number;
const lin: Ease = (x) => x;
const qb = (a: Pt, c: Pt, b: Pt, t: number): Pt => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
const cb = (p: Pt[], t: number): Pt => {
  const u = 1 - t;
  return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0], u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
};
const fr = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1e-6, b - a)); // linear progress between two (label-derived) frames
// a move of `dur` seconds starting at frame `at` (a frame computed from labels)
const kf = (g: number, at: number, dur: number, ease: Ease = ARRIVE) => ease(clamp01((g - at) / Math.max(1, dur * 30)));
const bump = (g: number, at: number, len = 6) => { const t = (g - at) / len; return t > 0 && t < 1 ? Math.sin(t * Math.PI) : 0; };

/* ---------- the scene's beats, all from labels ---------- */
// The employers' scan beat (sweep speeds up → matches light → land ranked) is nominally 1.9 s before the hand-off; it
// starts on "smarter", or earlier when the voice leaves less room (Dutch: "wordt talent vinden eenvoudiger").
const SCAN_LEN = Math.round(1.9 * 30);
const TM = (() => {
  const s3 = f("s3"), s4 = f("s4"), for3 = f("w:for3");
  // "Apply" is pressed just before "opportunities", once the first opportunity has landed in the list
  const press = Math.max(f("w:opportunities2") - 8, f("w:gateway+0.14") + 21);
  const applied = press + 4;
  const route0 = applied + 2, route1 = Math.min(applied + 37, f("w:for3-0.55"));
  const e0 = f("w:employers+0.1");
  const scan = Math.min(f("w:smarter"), s4 - SCAN_LEN);
  const rec = f("w:recruiters");
  return { s3, s4, for3, open: f("w:for2-0.12"), press, applied, route0, route1, e0, scan, post: [rec + 1, rec + 14] };
})();

// The ripple motif as soft waves: thick rose-red rings travelling out from a source (the gateway, the scan).
const Waves: React.FC<{ g: number; x: number; y: number; from: number; to: number; every: number; life: number; r0: number; r1: number; a: number; band: number }> = ({ g, x, y, from, to, every, life, r0, r1, a, band }) => {
  const out: React.ReactNode[] = [];
  for (let born = from; born <= to; born += every) {
    const t = (g - born) / life;
    if (t <= 0 || t >= 1) continue;
    const r = r0 + (r1 - r0) * t, R = r + band, al = a * (1 - 0.55 * t) * clamp01(t * 6);
    out.push(<div key={born} style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%",
      background: `radial-gradient(circle at 50% 50%, rgba(207,20,30,0) ${Math.max(0, r - band)}px, rgba(207,20,30,${al.toFixed(3)}) ${r}px, rgba(207,20,30,0) ${R}px)` }} />);
  }
  return <>{out}</>;
};

/* ======================= graduates ======================= */
const DX = 1010, DY = 615, DW = 340, DH = 480, DTOP = DY - DH / 2; // the gateway
const ARCH = `M 0 ${DH} L 0 ${DW / 2} A ${DW / 2} ${DW / 2} 0 0 1 ${DW} ${DW / 2} L ${DW} ${DH} Z`;
const VP: Pt = [DX, DTOP + 300]; // the horizon point inside the door, where opportunities come from
const JX = 1270, JW = 560, JH = 96, JY = (i: number) => 290 + i * 116;
const JOB_IDX = [0, 1, 3, 4, 2];
const FLAGS: Record<string, string[]> = { Spain: [C.red, C.gold, C.red], Germany: [C.ink, C.red, C.gold], Ireland: [C.green, C.white, C.gold], Portugal: [C.green, C.red],
  Spanje: [C.red, C.gold, C.red], Duitsland: [C.ink, C.red, C.gold], Ierland: [C.green, C.white, C.gold] };
const ROUTE: Pt[] = [[600, 470], [820, 700], [1150, 160], [JX + 48, JY(0) + JH / 2]];
const PX = 120, PY = 330, PW = 470;
const GOUT = "w:for3-0.4"; // the graduates' side leaves as "For employers" begins

const Globe: React.FC<{ g: number; cx: number; cy: number; r: number }> = ({ g, cx, cy, r }) => {
  const dots: React.ReactNode[] = [];
  const rot = g * 1.6;
  for (let la = -75; la <= 75; la += 12.5) {
    for (let lo = 0; lo < 360; lo += 12) {
      const phi = (la * Math.PI) / 180, lam = ((lo + rot) * Math.PI) / 180;
      const z = Math.cos(phi) * Math.cos(lam);
      if (z < 0) continue;
      const x = cx + r * Math.cos(phi) * Math.sin(lam), y = cy - r * Math.sin(phi);
      const hot = (lo === 0 && la === 37.5) || (lo === 348 && la === 50) || (lo === 12 && la === 50) || (lo === 0 && la === 50);
      dots.push(<circle key={`${la}-${lo}`} cx={x} cy={y} r={hot ? 7 : 2.4 + 2 * z} fill={C.red} opacity={hot ? 1 : 0.25 + 0.7 * z} />);
    }
  }
  return <>{dots}</>;
};

const Door: React.FC<{ g: number }> = ({ g }) => {
  const grow = k(g, "w:for2+0.25", 0.7, MOVE), open = k(g, "w:gateway-0.06", 0.6, MOVE), out = k(g, GOUT, 0.4, DEPART);
  if (grow <= 0 || out >= 1) return null;
  const hz = 360; // horizon inside the door
  const lines = Array.from({ length: 7 }, (_, i) => { const t = ((i / 7 + g * 0.035) % 1); return hz + Math.pow(t, 2.2) * (DH - hz); });
  return (
    <div style={{ position: "absolute", left: DX - DW / 2, top: DTOP, width: DW, height: DH, transform: `scale(${mix(0.1, 1, grow) * (1 - 0.25 * out)})`, transformOrigin: `${DW / 2}px ${DY - DTOP}px`, opacity: 1 - out }}>
      {/* the light that spills out of the open door */}
      <div style={{ position: "absolute", left: DW / 2 - 470, top: DH / 2 - 470, width: 940, height: 940, borderRadius: "50%", opacity: open,
        transform: `scale(${0.5 + 0.5 * open + 0.03 * Math.sin(g / 6)})`, background: `radial-gradient(circle, rgba(252,230,231,1) 0%, rgba(252,230,231,0.85) 35%, rgba(252,230,231,0) 70%)` }} />
      {/* through the doorway: a horizon, a turning globe, the ground rushing in */}
      <div style={{ position: "absolute", inset: 0, clipPath: `path('${ARCH}')`, background: `linear-gradient(180deg, ${C.rose} 0%, #FFF4F2 55%, ${C.white} 75%)` }}>
        <svg width={DW} height={DH} style={{ position: "absolute", inset: 0 }}>
          <circle cx={DW / 2} cy={hz - 150} r={132} fill="none" stroke={C.red} strokeOpacity={0.3} strokeWidth={2.5} />
          <Globe g={g} cx={DW / 2} cy={hz - 150} r={128} />
          <rect x={0} y={hz} width={DW} height={DH - hz} fill={C.ivory} />
          <path d={`M 0 ${hz} H ${DW}`} stroke={C.red} strokeWidth={3} />
          {[-1.6, -0.8, 0, 0.8, 1.6].map((s) => <path key={s} d={`M ${DW / 2} ${hz} L ${DW / 2 + s * 260} ${DH}`} stroke={C.red} strokeOpacity={0.25} strokeWidth={2} />)}
          {lines.map((y, i) => <path key={i} d={`M 0 ${y} H ${DW}`} stroke={C.red} strokeOpacity={0.1 + 0.3 * ((y - hz) / (DH - hz))} strokeWidth={2} />)}
        </svg>
      </div>
      {/* the door leaf, swinging open on its left hinge */}
      <div style={{ position: "absolute", inset: 0, transform: `perspective(1300px) rotateY(${-78 * open}deg)`, transformOrigin: "0% 50%", opacity: open > 0.97 ? 0 : 1 }}>
        <div style={{ position: "absolute", inset: 0, clipPath: `path('${ARCH}')`, background: open > 0.01 ? C.redDeep : C.red }}>
          <div style={{ position: "absolute", inset: 0, background: C.red, opacity: 1 - open * 0.6 }} />
          <svg width={DW} height={DH} style={{ position: "absolute", inset: 0 }}>
            <path d={`M 40 ${DH - 40} L 40 ${DW / 2 + 10} A ${DW / 2 - 40} ${DW / 2 - 40} 0 0 1 ${DW - 40} ${DW / 2 + 10} L ${DW - 40} ${DH - 40} Z`} fill="none" stroke={C.white} strokeOpacity={0.35} strokeWidth={4} />
            <circle cx={DW - 70} cy={DH * 0.58} r={13} fill={C.white} />
          </svg>
        </div>
      </div>
      {/* the frame (jamb) stays: the gateway */}
      <svg width={DW + 40} height={DH + 40} style={{ position: "absolute", left: -20, top: -20, overflow: "visible" }}>
        <path d={`M 20 ${DH + 20} L 20 ${DW / 2 + 20} A ${DW / 2} ${DW / 2} 0 0 1 ${DW + 20} ${DW / 2 + 20} L ${DW + 20} ${DH + 20}`} fill="none" stroke={C.red} strokeWidth={16} strokeLinecap="round" />
        <path d={`M -60 ${DH + 20} H ${DW + 100}`} stroke={C.ink} strokeOpacity={0.12} strokeWidth={4} strokeLinecap="round" />
      </svg>
    </div>
  );
};

// The graduate's profile: it completes item by item; the internship line is JongLeren's, and as it checks, the
// "JongLeren verified" badge stamps onto the card's corner (the same badge the candidate cards carry).
const Profile: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "w:graduates2", 0.6, ARRIVE), out = k(g, GOUT, 0.4, DEPART);
  if (a <= 0 || out >= 1) return null;
  const pct = k(g, "w:graduates2+0.23", 1.25, MOVE);
  const items = [tx("Skills & languages", "Vaardigheden & talen"), tx("Internship via JongLeren", "Stage via JongLeren"), tx("Education", "Opleiding")];
  const badge = k(g, "w:graduates2+0.9", 0.45, POP);
  return (
    <div style={{ position: "absolute", left: PX, top: PY, width: PW, ...CARD, padding: 28, boxSizing: "border-box", opacity: a * (1 - out),
      transform: `translate(${-out * 220}px, ${(1 - a) * 50}px) scale(${0.9 + 0.1 * a})`, transformOrigin: "0% 0%", filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      {badge > 0 && <div style={{ position: "absolute", right: 22, top: -17, transform: `scale(${0.7 + 0.3 * badge})`, transformOrigin: "100% 50%", opacity: clamp01(badge * 2) }}><JLBadge size={17} /></div>}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative" }}>
          <Avatar size={96} initials="SV" unlocked={1} ring={C.white} />
          <div style={{ position: "absolute", right: -6, bottom: -4, width: 40, height: 40, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${POP(k(g, "w:graduates2+0.18", 0.4, lin))})` }}><Ico n="cap" s={26} c={C.white} w={2.6} /></div>
        </div>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 31, color: C.ink }}>Sofia de Vries</div>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 22, color: C.gray, marginTop: 4 }}>{roleTx("Marketing Graduate")}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.ink }}>
        <span>{tx("Profile complete", "Profiel compleet")}</span><span style={{ color: C.red, fontWeight: 900 }}>{Math.round(pct * 100)}%</span>
      </div>
      <div style={{ height: 12, borderRadius: 6, background: C.cloud, marginTop: 10, overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", borderRadius: 6, background: C.red }} />
      </div>
      <div style={{ marginTop: 18 }}>
        {items.map((t, i) => {
          const on = fr(pct, (i + 0.6) / 3.2, (i + 0.9) / 3.2), jl = i === 1;
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, height: 40, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: on > 0.5 ? C.ink : C.light }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: on > 0.5 ? (jl ? C.white : C.red) : C.white, boxShadow: on > 0.5 ? (jl ? `inset 0 0 0 2px ${C.red}` : undefined) : `inset 0 0 0 2px ${C.line}`,
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", transform: `scale(${1 + 0.25 * Math.sin(on * Math.PI)})` }}>
                {on > 0.5 && (jl ? <JLMark h={22} /> : <Ico n="check" s={20} c={C.white} w={3.4} />)}
              </div>{t}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {["Social media", "Spanish", "SEO"].map((t, i) => { const p = k(g, `w:graduates2+${(0.33 + i * 0.13).toFixed(2)}`, 0.5, ARRIVE); return <Chip key={t} text={skillTx(t)} size={18} style={{ opacity: clamp01(p * 3), transform: `translate(${(1 - p) * (520 - i * 60)}px, ${(1 - p) * (380 + i * 90)}px) rotate(${(1 - p) * 30}deg) scale(${1 + 0.4 * (1 - p)})` }} />; })}
      </div>
      <div style={{ marginTop: 18, transform: `scale(${k(g, "w:its+0.05", 0.4, POP)})`, transformOrigin: "0% 50%" }}>
        <Pill text={tx("Open to work abroad", "Open voor werk in het buitenland")} icon="globe" size={tx(21, 19)} filled />
      </div>
    </div>
  );
};

// The graduate's path, under the three columns: internship in Spain (JongLeren, already done) → Talent Hub (the door)
// → a career abroad. The red thread draws from step to step with the voice.
const SLY = 950, NX = [PX + PW / 2, DX, JX + JW / 2];
const Path: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "w:graduates2+0.3", 0.6), out = k(g, GOUT, 0.4, DEPART);
  if (a <= 0 || out >= 1) return null;
  const pop = [0, 1, 2].map((i) => k(g, `w:graduates2+${(0.3 + 0.14 * i).toFixed(2)}`, 0.5, POP));
  const c1 = k(g, "w:graduates2+0.7", 0.4, POP);
  const l12 = k(g, "w:its", 0.55, MOVE), n2 = k(g, "w:its+0.45", 0.4, POP);
  const l23 = MOVE(fr(g, f("w:opportunities2"), f("w:abroad"))), n3 = k(g, "w:abroad", 0.4, POP);
  const seg = (x0: number, x1: number, p: number) => p > 0 && (
    <>
      <div style={{ position: "absolute", left: x0, top: SLY - 3, width: (x1 - x0) * p, height: 6, borderRadius: 3, background: C.red }} />
      {p < 1 && <div style={{ position: "absolute", left: x0 + (x1 - x0) * p - 10, top: SLY - 10, width: 20, height: 20, borderRadius: "50%", background: C.red, boxShadow: `0 0 0 6px rgba(207,20,30,0.18)` }} />}
    </>
  );
  const check = (p: number) => p > 0 && (
    <div style={{ position: "absolute", right: -8, top: -8, width: 26, height: 26, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 0 0 3px ${C.white}`, transform: `scale(${p})` }}><Ico n="check" s={17} c={C.white} w={3.6} /></div>
  );
  const node = (i: number, lit: number, inner: React.ReactNode, done: number, fill = false) => (
    <div style={{ position: "absolute", left: NX[i] - 32, top: SLY - 32, width: 64, height: 64, borderRadius: "50%", background: fill && lit > 0.5 ? C.red : C.white,
      boxShadow: `0 0 0 ${lit > 0.5 ? 3 : 2}px ${lit > 0.5 ? C.red : C.line}, 0 14px 30px -14px rgba(25,27,32,0.35)`, display: "flex", alignItems: "center", justifyContent: "center",
      transform: `scale(${pop[i] * (1 + 0.18 * Math.sin(clamp01(lit) * Math.PI))})` }}>
      {inner}{check(done)}
    </div>
  );
  const label = (i: number, lit: boolean, content: React.ReactNode) => (
    <div style={{ position: "absolute", left: NX[i] - 260, top: SLY + 44, width: 520, textAlign: "center", fontFamily: FONT, fontWeight: lit ? 900 : 700, fontSize: 23,
      color: lit ? C.ink : C.gray, opacity: clamp01(pop[i] * 1.5), transform: `translateY(${(1 - Math.min(1, pop[i])) * 14}px)`, whiteSpace: "nowrap" }}>{content}</div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${out * 30}px)`, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
      <div style={{ position: "absolute", left: NX[0], top: SLY - 2, width: (NX[2] - NX[0]) * a, height: 4, borderRadius: 2, background: C.line }} />
      {seg(NX[0], NX[1], l12)}
      {seg(NX[1], NX[2], l23)}
      {node(0, 1, <JLMark h={44} />, c1)}
      {node(1, n2, <THMark size={38} />, 0)}
      {node(2, n3, <Ico n="plane" s={32} c={n3 > 0.5 ? C.white : C.red} w={2.4} fill={n3 > 0.5 ? C.white : "none"} />, n3, true)}
      {label(0, true, <>{tx("Internship in Spain", "Stage in Spanje")} · <span style={{ color: C.red }}>JongLeren</span></>)}
      {label(1, n2 > 0.5, <span style={{ color: n2 > 0.5 ? C.red : undefined }}>Talent Hub</span>)}
      {label(2, n3 > 0.5, tx("Career abroad", "Carrière in het buitenland"))}
    </div>
  );
};

const JobCard: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const j = JOBS[JOB_IDX[i]];
  const t = k(g, `w:gateway+${(0.14 + i * 0.1).toFixed(2)}`, 0.55, lin);
  if (t <= 0) return null;
  const out = k(g, `w:for3-${(0.4 - i * 0.03).toFixed(2)}`, 0.4, DEPART);
  if (out >= 1) return null;
  const slot: Pt = [JX + JW / 2, JY(i) + JH / 2];
  const ctrl: Pt = [VP[0] + 230, Math.min(VP[1], slot[1]) - 260 + i * 40];
  const [x, y] = qb(VP, ctrl, slot, MOVE(t));
  const s = mix(0.12, 1, ARRIVE(t)) * (1 - 0.3 * out);
  const applied = i === 0 && g >= TM.applied;
  const press = i === 0 ? bump(g, TM.press, 7) : 0;
  const flag = FLAGS[j.country] || [C.red];
  const ring = i === 0 ? kf(g, TM.press, 0.3) : 0;
  const ox = out * (420 + i * 40), oy = -out * (160 - i * 50);
  return (
    <div style={{ position: "absolute", left: x - JW / 2 + ox, top: y - JH / 2 + oy, width: JW, height: JH, ...CARD, borderRadius: 22, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box",
      transform: `scale(${s}) rotate(${(1 - MOVE(t)) * -16}deg)`, opacity: clamp01(t * 5) * (1 - out),
      boxShadow: ring > 0 ? `0 0 0 ${3 * ring}px ${applied ? C.green : C.red}, 0 26px 56px -26px rgba(25,27,32,0.30)` : CARD.boxShadow }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.rose, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n="pin" s={32} c={C.red} w={2.6} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 23, color: C.ink, whiteSpace: "nowrap" }}>{j.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.gray }}>
          <span style={{ display: "flex", gap: 3 }}>{flag.map((c, n) => <span key={n} style={{ width: 11, height: 11, borderRadius: "50%", background: c, boxShadow: `0 0 0 1px ${C.line}` }} />)}</span>
          {j.city}, {j.country}
        </div>
      </div>
      <div style={{ minWidth: 128, height: 46, padding: "0 16px", boxSizing: "border-box", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: FONT, fontWeight: 700, fontSize: tx(20, 18), flex: "none", whiteSpace: "nowrap",
        background: applied ? C.greenTint : C.white, color: applied ? C.green : C.red, boxShadow: `inset 0 0 0 2px ${applied ? C.green : C.red}`, transform: `scale(${1 - 0.1 * press + (applied ? 0.12 * bump(g, TM.applied, 8) : 0)})` }}>
        {applied && <Ico n="check" s={22} c={C.green} w={3.2} />}{applied ? tx("Applied", "Gesolliciteerd") : tx("Apply", "Solliciteer")}
      </div>
    </div>
  );
};

// more opportunities keep coming through the gateway: small pins flying from the horizon into the list
const Stream: React.FC<{ g: number }> = ({ g }) => {
  const out: React.ReactNode[] = [];
  for (let n = 0; n < 40; n++) {
    const born = TM.applied - 1 + n * 1.5, life = 20;
    const t = (g - born) / life;
    if (t <= 0 || t >= 1 || born > TM.for3 - 16) continue;
    const i = (n * 3) % 5;
    const end: Pt = [JX + 48, JY(i) + JH / 2];
    const ctrl: Pt = [VP[0] + 120 + (n % 4) * 40, Math.min(VP[1], end[1]) - 160 - (n % 3) * 50];
    const [x, y] = qb(VP, ctrl, end, MOVE(t));
    const s = mix(0.4, 1.1, t);
    out.push(<div key={n} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: "50%", background: n % 3 ? C.red : C.white, boxShadow: n % 3 ? undefined : `inset 0 0 0 3px ${C.red}`,
      opacity: Math.sin(t * Math.PI), transform: `scale(${s})`, display: "flex", alignItems: "center", justifyContent: "center" }}>{n % 3 ? <Ico n="pin" s={20} c={C.white} w={3} /> : null}</div>);
  }
  return <>{out}</>;
};

const Route: React.FC<{ g: number }> = ({ g }) => {
  const p = MOVE(fr(g, TM.route0, TM.route1)), out = k(g, GOUT, 0.35, DEPART);
  if (g <= TM.route0 || out >= 1) return null;
  const N = 90, pts: Pt[] = [];
  for (let n = 0; n <= N * p; n++) pts.push(cb(ROUTE, n / N));
  const tip = cb(ROUTE, p), back = cb(ROUTE, Math.max(0, p - 0.01));
  const ang = (Math.atan2(tip[1] - back[1], tip[0] - back[0]) * 180) / Math.PI + 25;
  const land = kf(g, TM.route1, 0.6, lin);
  const flying = p < 0.995;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {pts.length > 1 && <path d={`M ${pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ")}`} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="14 14" strokeLinecap="round" />}
        <circle cx={ROUTE[0][0]} cy={ROUTE[0][1]} r={11} fill={C.red} />
        {land > 0 && [0, 0.33].map((d) => { const q = clamp01(land - d); return q > 0 && q < 1 ? <circle key={d} cx={ROUTE[3][0]} cy={ROUTE[3][1]} r={30 + 90 * q} fill="none" stroke={C.red} strokeWidth={4} opacity={1 - q} /> : null; })}
      </svg>
      {flying && <div style={{ position: "absolute", left: tip[0] - 30, top: tip[1] - 30, width: 60, height: 60, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `rotate(${ang}deg) scale(${0.6 + 0.4 * Math.sin(p * Math.PI) + 0.4})`, boxShadow: "0 12px 26px -10px rgba(207,20,30,0.6)" }}><Ico n="plane" s={34} c={C.white} w={2.4} fill={C.white} /></div>}
    </div>
  );
};

const Cursor: React.FC<{ g: number }> = ({ g }) => {
  const a = kf(g, TM.press - 12, 0.45, MOVE), gone = kf(g, TM.press + 11, 0.3);
  if (g < TM.press - 13 || gone >= 1) return null;
  const x = mix(1700, 1752, a), y = mix(700, 346, a), s = 1 - 0.15 * bump(g, TM.press, 7);
  return (
    <svg width={40} height={44} style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, opacity: clamp01(a * 4) * (1 - gone), overflow: "visible" }}>
      <path d="M2 2 L2 34 L10 26 L16 39 L22 36 L16 24 L27 24 Z" fill={C.ink} stroke={C.white} strokeWidth={2.5} strokeLinejoin="round" />
    </svg>
  );
};

/* ======================= employers & recruiters ======================= */
const RX = 1010, RY = 625, RR = 250;
const CL = [
  { y: 300, icon: "users", title: tx("Agency recruiter", "Recruitmentbureau"), sub: tx("Recruits for its clients", "Werft voor zijn klanten"), at: "w:employers+0.05", post: TM.post[0], job: JOBS[0] },
  { y: 500, icon: "building", title: tx("Direct employer", "Directe werkgever"), sub: tx("Hires for its own team", "Werft voor het eigen team"), at: "w:and3-0.14", post: TM.post[1], job: JOBS[3] },
];
// the sweep turns steadily while the pool gathers, then faster from the scan beat
const sweepA = (g: number) => (g < TM.scan ? 12 * (g - TM.e0) : 12 * (TM.scan - TM.e0) + 14 * (g - TM.scan));
const ORB = 0.35;
const orbit = (phi0: number, g: number) => phi0 + ORB * (g - TM.e0);
// four matches (all JongLeren alumni; the top one is Sofia), lit as the sweep passes them (L); each flies to its ranked
// row right after, and its "JongLeren verified" badge pops on as it lands; the rest of the pool dims
const MATCH = [
  { c: CANDIDATES[0], m: 98, r: 205, dl: 8 }, { c: CANDIDATES[7], m: 94, r: 190, dl: 20 },
  { c: CANDIDATES[9], m: 91, r: 215, dl: 2 }, { c: CANDIDATES[1], m: 87, r: 168, dl: 14 },
].map((d) => { const L = TM.scan + d.dl, fly = L + 6; return { ...d, L, fly, land: fly + 11, phi0: sweepA(L) - ORB * (L - TM.e0) }; });
const POOL = [[267, 185], [349, 228], [71, 185], [153, 228], [190, 130], [250, 238], [55, 238], [150, 135], [350, 140]];
const PNX = 1300, PNY = 300, PNW = 510, ROWH = 108, ROWY = (i: number) => PNY + 96 + i * 120;
const SLOT = (i: number): Pt => [PNX + 20 + 74, ROWY(i) + ROWH / 2];
const polar = (phi: number, r: number): Pt => [RX + r * Math.sin((phi * Math.PI) / 180), RY - r * Math.cos((phi * Math.PI) / 180)];

const Client: React.FC<{ g: number; d: (typeof CL)[number] }> = ({ g, d }) => {
  const a = k(g, d.at, 0.55, ARRIVE);
  if (a <= 0) return null;
  const press = bump(g, d.post - 3, 7), done = g >= d.post + 4;
  return (
    <div style={{ position: "absolute", left: 120, top: d.y, width: 470, ...CARD, padding: "24px 26px", boxSizing: "border-box", display: "flex", gap: 20, opacity: a,
      transform: `translateY(${(1 - a) * 40}px) scale(${0.92 + 0.08 * a})`, transformOrigin: "0% 50%" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.rose, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n={d.icon} s={40} c={C.red} w={2.6} /></div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: C.ink }}>{d.title}</div>
        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 20, color: C.gray, marginTop: 2 }}>{d.sub}</div>
        <div style={{ marginTop: 14, transform: `scale(${1 - 0.1 * press})`, transformOrigin: "0% 50%" }}>
          <Pill text={done ? tx("Vacancy posted", "Vacature geplaatst") : tx("Post vacancy", "Vacature plaatsen")} icon={done ? "check" : "plus"} size={19} filled={!done} />
        </div>
      </div>
    </div>
  );
};

const Vacancy: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const d = CL[i];
  const t = kf(g, d.post + 1, 0.6, lin);
  if (t <= 0) return null;
  const from: Pt = [120 + 26 + 72 + 20 + 90, d.y + 128];
  const to: Pt = [RX, RY - 44 + i * 88];
  const [x, y] = qb(from, [mix(from[0], to[0], 0.5), Math.min(from[1], to[1]) - 230], to, MOVE(t));
  const s = mix(0.45, 1, ARRIVE(t));
  const live = kf(g, TM.scan - 2, 0.3);
  return (
    <div style={{ position: "absolute", left: x - 140, top: y - 38, width: 280, height: 76, ...CARD, borderRadius: 18, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", boxSizing: "border-box",
      transform: `scale(${s}) rotate(${(1 - MOVE(t)) * 12}deg)`, opacity: clamp01(t * 5), boxShadow: `0 0 0 ${2.5 * live}px ${C.red}, ${CARD.boxShadow}`, zIndex: 3 }}>
      <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.rose, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n="briefcase" s={26} c={C.red} w={2.6} /></div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 21, color: C.ink, whiteSpace: "nowrap" }}>{d.job.title}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.gray }}>{tx("Vacancy", "Vacature")} · {d.job.city}</div>
      </div>
    </div>
  );
};

const Radar: React.FC<{ g: number }> = ({ g }) => {
  const b = kf(g, TM.e0, 0.7, ARRIVE);
  if (b <= 0) return null;
  const A = sweepA(g), fast = kf(g, TM.scan - 2, 0.3);
  const pulses = [0, 1, 2].map((n) => { const t = (((g - TM.scan + n * 9) / 27) % 1 + 1) % 1; return g >= TM.scan ? t : -1; });
  return (
    <div style={{ position: "absolute", left: RX - RR, top: RY - RR, width: 2 * RR, height: 2 * RR, transform: `scale(${mix(0.6, 1, b)})`, opacity: b }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.white, boxShadow: "0 0 0 1px rgba(25,27,32,0.05), 0 30px 70px -30px rgba(25,27,32,0.30)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${A - 100}deg, rgba(207,20,30,0) 0deg, rgba(207,20,30,${0.34 + 0.08 * fast}) 100deg, rgba(207,20,30,0) 100deg)` }} />
      <svg width={2 * RR} height={2 * RR} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {[85, 165, 245].map((r, n) => <circle key={r} cx={RR} cy={RR} r={r} fill="none" stroke={C.red} strokeOpacity={0.22} strokeWidth={2} strokeDasharray={n === 2 ? undefined : "6 10"} transform={`rotate(${(n % 2 ? -1 : 1) * g * 0.8} ${RR} ${RR})`} />)}
        <path d={`M ${RR} 6 V ${2 * RR - 6} M 6 ${RR} H ${2 * RR - 6}`} stroke={C.ink} strokeOpacity={0.06} strokeWidth={2} />
        {pulses.map((t, n) => t >= 0 ? <circle key={n} cx={RR} cy={RR} r={120 + 140 * t} fill="none" stroke={C.red} strokeWidth={4} opacity={0.5 * (1 - t)} /> : null)}
      </svg>
    </div>
  );
};

// a small JongLeren mark on a matched avatar: the scan picks out verified candidates
const JLDot: React.FC<{ size: number; p: number }> = ({ size, p }) => (
  <div style={{ position: "absolute", right: -size * 0.12, bottom: -size * 0.08, width: size * 0.5, height: size * 0.5, borderRadius: "50%", background: C.white, boxShadow: `0 0 0 2px ${C.red}`,
    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", transform: `scale(${p})` }}><JLMark h={size * 0.4} /></div>
);

const Pool: React.FC<{ g: number }> = ({ g }) => {
  const b = kf(g, TM.e0, 0.7, ARRIVE);
  if (b <= 0) return null;
  const sc = mix(0.6, 1, b);
  const at = (p: Pt): Pt => [RX + (p[0] - RX) * sc, RY + (p[1] - RY) * sc];
  const nodes: React.ReactNode[] = [];
  POOL.forEach(([phi0, r], i) => {
    const fin = kf(g, TM.e0 + i * 1.5, 0.6, ARRIVE);
    const [x, y] = at(polar(orbit(phi0, g) - 70 * (1 - fin), mix(620, r, fin)));
    const pop = clamp01(fin * 3), dim = kf(g, TM.scan + 2 + i * 1.5, 0.35);
    nodes.push(<Avatar key={`p${i}`} size={50} ring={C.white} style={{ position: "absolute", left: x - 25, top: y - 25, transform: `scale(${pop})`, opacity: 1 - 0.65 * dim }} />);
  });
  MATCH.forEach((d, i) => {
    const fly = kf(g, d.fly, 0.37, lin);
    const lit = clamp01((g - d.L) / 6), fin = kf(g, TM.e0 + (i * 2 + 1) * 1.5, 0.6, ARRIVE), pop = clamp01(fin * 3);
    const start = at(polar(orbit(d.phi0, Math.min(g, d.fly)) - 70 * (1 - fin), mix(620, d.r, fin)));
    const end = SLOT(i);
    const [x, y] = fly > 0 ? qb(start, [mix(start[0], end[0], 0.5), Math.min(start[1], end[1]) - 140], end, MOVE(fly)) : start;
    const size = mix(50, 56, fly);
    nodes.push(
      <div key={`m${i}`} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, zIndex: 5 }}>
        <div style={{ position: "relative", transform: `scale(${pop * (1 + 0.35 * Math.sin(lit * Math.PI))})` }}>
          <Avatar size={size} ring={lit > 0 ? C.red : C.white} />
          {d.c.jl && lit > 0 && <JLDot size={size} p={POP(lit)} />}
        </div>
        {lit > 0 && fly < 1 && <div style={{ position: "absolute", left: size - 6, top: -18, fontFamily: FONT, fontWeight: 900, fontSize: 20, color: C.white, background: C.red, borderRadius: 999, padding: "3px 10px",
          transform: `scale(${POP(lit) * (1 - fly)})`, transformOrigin: "0% 100%", whiteSpace: "nowrap" }}>{d.m}%</div>}
      </div>,
    );
  });
  return <>{nodes}</>;
};

const Ranked: React.FC<{ g: number }> = ({ g }) => {
  const a = kf(g, TM.scan - 9, 0.5, ARRIVE);
  if (a <= 0) return null;
  const topAt = Math.max(f("w:talent3"), MATCH[0].land + 3);
  return (
    <div style={{ position: "absolute", left: PNX, top: PNY, width: PNW, height: 590, ...CARD, boxSizing: "border-box", opacity: a, transform: `translateY(${(1 - a) * 40}px) scale(${0.94 + 0.06 * a})` }}>
      <div style={{ position: "absolute", left: 26, top: 24, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: C.ink }}><Ico n="star" s={30} c={C.red} w={2.6} />{tx("Top matches", "Beste matches")}</div>
      <div style={{ position: "absolute", right: 26, top: 30, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.gray }}>{tx("Ranked by fit", "Gesorteerd op match")}</div>
      {MATCH.map((d, i) => {
        const r = kf(g, d.land, 0.3, ARRIVE), cnt = kf(g, d.land, 0.35, MOVE), bd = kf(g, d.land + 1, 0.35, POP);
        const top = i === 0 ? kf(g, topAt, 0.3) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: 20, top: ROWY(i) - PNY, width: PNW - 40, height: ROWH, borderRadius: 18, boxSizing: "border-box",
            background: r > 0 ? (i === 0 ? C.rose : C.ivory) : C.white, boxShadow: r > 0 ? (top > 0 ? `inset 0 0 0 ${3 * top}px ${C.red}` : undefined) : `inset 0 0 0 2px ${C.cloud}` }}>
            <div style={{ position: "absolute", left: 14, top: 35, width: 34, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: i === 0 ? C.red : C.gray, opacity: r }}>{i + 1}</div>
            <div style={{ position: "absolute", left: 124, top: 13, opacity: r, transform: `translateX(${(1 - r) * 20}px)` }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.ink, whiteSpace: "nowrap" }}>{tx("Candidate", "Kandidaat")} #{d.c.id}</div>
              <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 18, color: C.gray, marginTop: 1, whiteSpace: "nowrap" }}>{roleTx(d.c.role)}</div>
              {d.c.jl && <div style={{ marginTop: 7, transform: `scale(${bd})`, transformOrigin: "0% 50%", opacity: clamp01(bd * 3) }}><JLBadge size={14} /></div>}
            </div>
            <div style={{ position: "absolute", right: 18, top: 33, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.red, opacity: r, transform: `scale(${0.7 + 0.3 * POP(r)})` }}>{Math.round(d.m * cnt)}%</div>
          </div>
        );
      })}
    </div>
  );
};

/* ======================= the scene ======================= */
export const SceneD: React.FC<{ g: number }> = ({ g }) => {
  // hand-offs: a full red field from s3+2 (C's iris), opening from "w:for2-0.12"; out by a red iris from the top
  // match covering by s4+5; nothing after s4+7
  if (g < TM.s3 + 2 || g > TM.s4 + 7) return null;
  const irisOpen = kf(g, TM.open, 0.45, ARRIVE);
  const grads = g < TM.for3 + 2, emps = g >= TM.for3 - 6;
  const endIris = MOVE(fr(g, TM.s4 - 7, TM.s4 + 5));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {grads && (
        <div style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
          <Waves g={g} x={DX} y={DY} from={TM.open + 10} to={TM.for3 - 14} every={10} life={44} r0={150} r1={1000} a={0.085} band={34} />
          <Door g={g} />
          <Path g={g} />
          <Profile g={g} />
          <Route g={g} />
          <Stream g={g} />
          {[4, 3, 2, 1, 0].map((i) => <JobCard key={i} g={g} i={i} />)}
          <Cursor g={g} />
          <Say g={g} x={120} y={110} size={110} out={GOUT}
            words={tx([{ t: "For", at: "w:for2" }, { t: "graduates", at: "w:graduates2", red: true }], [{ t: "Voor", at: "w:nl_voor" }, { t: "afgestudeerden", at: "w:nl_afgestudeerden2", red: true }])} />
        </div>
      )}
      {emps && (
        <div style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
          <Say g={g} x={120} y={110} size={tx(100, 96)}
            words={tx([{ t: "For", at: "w:for3" }, { t: "employers", at: "w:employers" }, { t: "&", at: "w:and3" }, { t: "recruiters", at: "w:recruiters", red: true }],
              [{ t: "Voor", at: "w:nl_voor2" }, { t: "werkgevers", at: "w:nl_werkgevers" }, { t: "&", at: "w:nl_en3" }, { t: "recruiters", at: "w:nl_recruiters", red: true }])} />
          <Waves g={g} x={RX} y={RY} from={TM.for3 - 1} to={TM.s4 - 11} every={12} life={40} r0={240} r1={950} a={0.085} band={34} />
          <Radar g={g} />
          {CL.map((d) => <Client key={d.title} g={g} d={d} />)}
          <Ranked g={g} />
          <Pool g={g} />
          <Vacancy g={g} i={0} />
          <Vacancy g={g} i={1} />
        </div>
      )}
      {/* the hand-off in: C's red field closes into the gateway's dot */}
      {g < TM.open + 17 && <RedIris x={DX} y={DY} p={g < TM.open ? 1 : mix(0.88, 0.02, irisOpen)} />}
      {/* the hand-off out: a red iris from the top match */}
      {endIris > 0 && <RedIris x={SLOT(0)[0]} y={SLOT(0)[1]} p={endIris} />}
    </AbsoluteFill>
  );
};
