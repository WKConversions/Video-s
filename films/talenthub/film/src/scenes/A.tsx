// Scene A (0–3.4 s): Looking for qualified talent? Meet Talent Hub. See ../../../plan/storyboard.md.
// The scattered talent out there swirls on the right while a search types and a red lens sweeps the cloud; on "Meet"
// the lens drops to the centre as a red dot, the talent streams into it, and the dot grows into the red field where
// the white "th" builds; the field then contracts back into the mark, which lands red, size 150, at (960, 540).
import React from "react";
import { AbsoluteFill } from "remotion";
import { ARRIVE, Avatar, C, CARD, FONT, Ico, MOVE, POP, Say, THMark, clamp01, f, k, mix, tx, typed } from "../shared";
import { TH } from "../thpaths";

const rnd = (i: number, s: number) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const HUB = { x: 960, y: 540 };
const SW = { x: tx(1530, 1600), y: 548 };            // the swirl's centre, right of the statement (the Dutch line is longer)
const RMAX = Math.hypot(960, 540) + 4;
// all on the voice's words, so the Dutch build retimes with its voice-over (EN frames in brackets)
const CONV = f("w:meet") - 5;                         // the talent starts streaming in just before "Meet" (55)
const DISC = f("w:meet") + 6;                         // the dot grows into the field from here (66)
const BUILD = Math.min(f("w:talent2"), DISC + 12), END = f("s1"), BUILT = END - 8;   // the mark builds on "Talent Hub", contracts, lands on s1 (66, 85, 93)
const QUERY = tx("qualified talent", "gekwalificeerd talent");

const PEOPLE = Array.from({ length: 58 }, (_, i) => {
  const depth = rnd(i, 1);
  return { r: 70 + Math.sqrt(rnd(i, 2)) * 300, a0: rnd(i, 3) * Math.PI * 2, w: 0.03 + 0.018 * rnd(i, 4), s: 36 + depth * 54, o: 0.6 + depth * 0.4,
    wob: 20 + rnd(i, 5) * 34, wf: 0.06 + rnd(i, 6) * 0.06, wp: rnd(i, 7) * 6.28, delay: rnd(i, 8) * 6, pop: rnd(i, 9) * 14 - 8 };
});
const SPECKS = Array.from({ length: 34 }, (_, i) => ({ r: 40 + rnd(i, 11) * 360, a0: rnd(i, 12) * 6.28, w: 0.03 + 0.02 * rnd(i, 13), s: 8 + rnd(i, 14) * 8, delay: rnd(i, 15) * 5 }));

// where a piece of the swirl is at frame g (before it streams into the hub)
const swirl = (g: number, r: number, a0: number, w: number, wob = 20, wf = 0.06, wp = 0) => {
  const a = a0 + w * g * Math.min(1.35, Math.max(0.8, Math.sqrt(230 / r)));
  const rr = r + wob * Math.sin(g * wf + wp);
  return { x: SW.x + rr * Math.cos(a), y: SW.y + rr * Math.sin(a) * 1.12 };
};
// the stream into the hub: a spiral about the hub, c 0..1
const stream = (p: { x: number; y: number }, c: number) => {
  const dx = p.x - HUB.x, dy = p.y - HUB.y;
  const rho = Math.hypot(dx, dy) * (1 - c), al = Math.atan2(dy, dx) + c * 1.3;
  return { x: HUB.x + rho * Math.cos(al), y: HUB.y + rho * Math.sin(al) };
};
const convK = (g: number, delay: number) => MOVE(clamp01((g - CONV - delay) / 11));

// the red search lens: sweeps a figure-eight over the cloud, then drops to the hub and fills into the red dot
const lens = (g: number) => {
  const t = clamp01((g - 6) / (CONV - 5)), ph = mix(-2.3, 1.7, (1 - Math.cos(t * Math.PI)) / 2);
  const sweep = { x: SW.x + 250 * Math.sin(ph), y: SW.y + 210 * Math.sin(2 * ph) };
  const m = MOVE(clamp01((g - CONV - 1) / 8));
  return { x: mix(sweep.x, HUB.x, m), y: mix(sweep.y, HUB.y, m), r: mix(84, 28, m), fill: m, handle: 1 - m, s: POP(clamp01((g - 4) / 9)) };
};

const markAt = (size: number, color: string, key?: string, p = 1) => {
  const h = (size * TH.h) / TH.w;
  return <div key={key} style={{ position: "absolute", left: HUB.x - size / 2, top: HUB.y - h / 2 }}><THMark size={size} color={color} p={p} /></div>;
};

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(0) || g > END) return null;
  // hand-off frame: exactly the red mark, size 150, centred
  if (g === END) return <AbsoluteFill>{markAt(150, C.red)}</AbsoluteFill>;

  const L = lens(g);
  const fieldIn = ARRIVE(clamp01((g - DISC) / 10));
  const contract = MOVE(clamp01((g - BUILT) / (END - BUILT)));
  const close = MOVE(clamp01((g - BUILT) / (END - 2 - BUILT)));         // the field is back inside the mark 2 frames early
  const R = g < DISC ? 0 : contract > 0 ? mix(RMAX, 0, close) : mix(28, RMAX, fieldIn);
  const out = k(g, "w:meet-0.1", 0.4);
  const fieldOn = g >= DISC;

  // the statement and the search field
  const fieldInK = ARRIVE(clamp01((g + 3) / 12));
  const q = typed(g, "w:qualified-0.14", QUERY, 17);
  const typing = q.length > 0 && q.length < QUERY.length;
  const caret = typing || Math.floor(g / 8) % 2 === 0;

  // the people in the swirl (and their streaks as they stream in)
  const people = PEOPLE.map((p, i) => {
    const c = convK(g, p.delay);
    const base = swirl(g, p.r, p.a0, p.w, p.wob, p.wf, p.wp);
    const pos = stream(base, c);
    const prev = stream(swirl(g - 2.5, p.r, p.a0, p.w, p.wob, p.wf, p.wp), convK(g - 2.5, p.delay));
    const d = Math.hypot(pos.x - L.x, pos.y - L.y);
    const mag = c > 0 ? 0 : clamp01(1 - d / (L.r + 30)) * L.s * (1 - out);
    const pop = POP(clamp01((g - p.pop) / 10));
    const s = p.s * pop * (1 + 0.32 * mag) * (1 - 0.8 * c);
    const o = p.o * (1 - clamp01((c - 0.82) / 0.18));
    return { i, pos, prev, c, s, o, mag, depth: p.s };
  }).sort((a, b) => a.depth - b.depth);

  return (
    <AbsoluteFill>
      {/* the statement: left, two lines, "talent?" red */}
      <Say g={g} y={262} size={tx(116, 100)} out="w:meet-0.1" words={tx([{ t: "Looking", at: "w:looking" }, { t: "for", at: "w:for" }], [{ t: "Op", at: "w:nl_op" }, { t: "zoek", at: "w:nl_zoek" }, { t: "naar", at: "w:nl_naar" }])} />
      <Say g={g} y={tx(392, 374)} size={tx(116, 100)} out="w:meet-0.1" words={tx([{ t: "qualified", at: "w:qualified" }, { t: "talent?", at: "w:talent", red: true }], [{ t: "gekwalificeerd", at: "w:nl_gekwalificeerd" }, { t: "talent?", at: "w:nl_talent", red: true }])} />

      {/* the search field types the query */}
      {out < 1 && (
        <div style={{ position: "absolute", left: 120, top: 612, width: 800, height: 104, ...CARD, borderRadius: 999, display: "flex", alignItems: "center", gap: 22, padding: "0 36px", boxSizing: "border-box",
          opacity: fieldInK * (1 - out), transform: `translateY(${(1 - fieldInK) * 40 - out * 26}px)`, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
          <Ico n="search" s={46} c={C.red} w={3} />
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            {q || <span style={{ color: C.light, fontWeight: 400 }}>{tx("Search candidates", "Zoek kandidaten")}</span>}
          </div>
          {q && <div style={{ width: 4, height: 50, borderRadius: 2, background: C.red, marginLeft: -16, opacity: caret ? 1 : 0 }} />}
        </div>
      )}

      {/* the scattered talent: small specks and anonymous avatars swirling on the right */}
      {g < DISC + 4 && (
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
          {SPECKS.map((p, i) => {
            const c = convK(g, p.delay);
            const pos = stream(swirl(g, p.r, p.a0, p.w), c);
            const pop = POP(clamp01((g + 4 - (i % 12)) / 10));
            return <circle key={i} cx={pos.x} cy={pos.y} r={(p.s / 2) * pop * (1 - 0.6 * c)} fill={c > 0.3 ? C.red : "#CFCBC7"} opacity={0.8 * (1 - clamp01((c - 0.85) / 0.15))} />;
          })}
          {people.map((p) => p.c > 0.02 && p.o > 0 && (
            <line key={p.i} x1={p.prev.x} y1={p.prev.y} x2={p.pos.x} y2={p.pos.y} stroke={C.red} strokeOpacity={0.35 * p.c} strokeWidth={Math.max(2, p.s * 0.45)} strokeLinecap="round" />
          ))}
        </svg>
      )}
      {g < DISC + 4 && people.map((p) => p.o > 0 && p.s > 1 && (
        <div key={p.i} style={{ position: "absolute", left: p.pos.x - p.s / 2, top: p.pos.y - p.s / 2, width: p.s, height: p.s, opacity: p.o }}>
          <Avatar size={p.s} ring={p.mag > 0.15 ? C.rose : undefined} style={{ boxShadow: p.mag > 0.15 ? `0 0 0 ${p.s * 0.07}px rgba(207,20,30,${0.5 * p.mag})` : "0 0 0 2px #DCD8D4, 0 6px 14px -8px rgba(25,27,32,0.35)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.red, opacity: clamp01(p.c * 1.6) }} />
        </div>
      ))}

      {/* the red lens: sweeps, then becomes the hub's red dot */}
      {g < DISC + 2 && L.s > 0 && (
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
          <g transform={`translate(${L.x} ${L.y}) scale(${L.s})`}>
            <line x1={L.r * 0.74} y1={L.r * 0.74} x2={L.r * (0.74 + 0.62 * L.handle)} y2={L.r * (0.74 + 0.62 * L.handle)} stroke={C.red} strokeWidth={16} strokeLinecap="round" opacity={L.handle > 0.05 ? 1 : 0} />
            <circle r={L.r} fill={C.red} fillOpacity={0.06 + 0.94 * L.fill} stroke={C.red} strokeWidth={10 * (1 - L.fill) + 0.01} />
          </g>
        </svg>
      )}

      {/* the red field grows from the dot; the white mark builds on it; the field contracts back into the mark */}
      {fieldOn && (
        <>
          {contract > 0 && markAt(mix(432, 150, contract), C.red, "red")}
          {(contract === 0 || R > 60) && <AbsoluteFill style={{ clipPath: `circle(${Math.max(0, R)}px at ${HUB.x}px ${HUB.y}px)` }}>
            <div style={{ position: "absolute", inset: 0, background: C.red }} />
            {Array.from({ length: 5 }, (_, j) => {
              const r = 210 + (((g - DISC) * 14 + j * 200) % 1000);
              return <div key={j} style={{ position: "absolute", left: HUB.x - r, top: HUB.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `6px solid rgba(255,255,255,${0.2 * (1 - 0.6 * (r - 210) / 1000)})` }} />;
            })}
            {[BUILD + 1, BUILD + 6, BUILD + 11].map((b, j) => {
              const t = clamp01((g - b) / 14);
              if (t <= 0 || t >= 1) return null;
              const r = 260 + ARRIVE(t) * 520;
              return <div key={`b${j}`} style={{ position: "absolute", left: HUB.x - r, top: HUB.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${10 * (1 - t) + 2}px solid rgba(255,255,255,${0.35 * (1 - t)})` }} />;
            })}
            {g >= BUILD && markAt(contract > 0 ? mix(432, 150, contract) : mix(400, 432, clamp01((g - BUILD) / (BUILT - BUILD))), C.white, "white", clamp01((g - BUILD) / (BUILT - BUILD - 1)))}
          </AbsoluteFill>}
        </>
      )}
    </AbsoluteFill>
  );
};
