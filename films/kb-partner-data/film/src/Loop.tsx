// K.B blog + social loop: "Still Chasing Partners for Data by Email? How to Replace the Excel Spreadsheet".
// 12 s seamless loop, 1080 x 1080, 30 fps, no audio. Glassmorphism on a soft light gradient: nine frosted tiles full of
// spreadsheets and emails (the chase), stacked into one clean form (the portal), out comes one overview.
// Every value is a pure function of the frame; at 12 s the picture is back to frame 0 (jitter periods divide 12 s).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";

export const FPS = 30, DUR = 360, SIZE = 1080;
const C = { bg: "#F4F8FC", bg2: "#EAF5FF", navy: "#172B44", sub: "#66768A", blue: "#99CDFC", red: "#E5484D" };
const F = "Manrope, sans-serif";
const TAU = Math.PI * 2;
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const E = (t: number, a: number, b: number) => ease(clamp((t - a) / (b - a)));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
/** a slight springy settle: only for the tiles stacking into the card */
const backOut = (x: number) => { const c1 = 1.3, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

// ---------------------------------------------------------------- font
let fontReady = false;
const useFont = () => {
  const [ok, setOk] = useState(fontReady);
  const [h] = useState<number | null>(() => (fontReady ? null : delayRender("font")));
  useEffect(() => {
    if (fontReady) { setOk(true); return; }
    const face = new FontFace("Manrope", `url(${staticFile("fonts/manrope-var.ttf")})`, { weight: "200 800" });
    face.load().then((f) => { document.fonts.add(f); return Promise.all([600, 700, 800].map((w) => document.fonts.load(`${w} 40px Manrope`))); })
      .then(() => { fontReady = true; setOk(true); });
  }, []);
  useEffect(() => { if (ok && h !== null) continueRender(h); }, [ok, h]);
  return ok;
};

// ---------------------------------------------------------------- icons (their own colours)
const Excel: React.FC = () => (
  <svg width={100} height={100} viewBox="0 0 100 100">
    <rect x={34} y={10} width={58} height={80} rx={8} fill="#185C37" />
    <path d="M42 10h42a8 8 0 0 1 8 8v12H34V18a8 8 0 0 1 8-8z" fill="#33C481" />
    <rect x={34} y={30} width={58} height={20} fill="#21A366" />
    <rect x={34} y={50} width={58} height={20} fill="#107C41" />
    <rect x={63} y={10} width={1.5} height={80} fill="#fff" opacity={0.18} />
    <rect x={8} y={26} width={48} height={48} rx={7} fill="#107C41" />
    <path d="M20 37l24 26M44 37L20 63" stroke="#fff" strokeWidth={7} strokeLinecap="square" />
  </svg>
);
const Gmail: React.FC = () => (
  <svg width={100} height={100} viewBox="0 0 100 100">
    <g transform="translate(-7.5,-8.75) scale(1.25)">
      <path d="M18 40v22a4 4 0 0 0 4 4h7V44.5z" fill="#4285F4" />
      <path d="M74 40v22a4 4 0 0 1-4 4h-7V44.5z" fill="#34A853" />
      <path d="M18 33.5a5 5 0 0 1 8-4l20 15 20-15a5 5 0 0 1 8 4v6.5L63 48.5V41l-17 12.8L29 41v7.5L18 40z" fill="#EA4335" />
      <path d="M63 41l11-8.5V40L63 48.5z" fill="#FBBC04" />
      <path d="M18 33.5V40l11 8.5V41z" fill="#C5221F" />
    </g>
  </svg>
);
const Plane: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 64 64" style={{ display: "block" }}>
    <path d="M4 30L60 6 44 58 30 38z" fill={C.navy} />
    <path d="M60 6L30 38l-4 16 10-11" fill="#2C4666" />
  </svg>
);

// ---------------------------------------------------------------- layout
const TS = 272, GAP = 26, G0 = (SIZE - (3 * TS + 2 * GAP)) / 2;
const tileC = (i: number) => ({ x: G0 + TS / 2 + (i % 3) * (TS + GAP), y: G0 + TS / 2 + Math.floor(i / 3) * (TS + GAP) });
const CARD = { x: 540, w: 680, h: 350 };
const cardY = (t: number) => mix(480, 318, E(t, 7.75, 8.3));
const SLOT_Y = 480 - 350 / 2 + 33;                                    // the slot while the icons drop (card still centred)
/** the funnel above the slot: the icons swirl in a narrowing ellipse */
const swirl = (j: number, t: number) => { const a = TAU * 0.55 * (t - 5.0) + (j * TAU) / 9, r = 280 - 160 * E(t, 5.3, 7.8); return { x: 540 + r * Math.cos(a), y: 175 + 0.24 * r * Math.sin(a), s: 0.8 + 0.1 * Math.sin(a), front: Math.sin(a) > 0 }; };
const KIND = (i: number) => (i % 2 === 0 ? "x" : "g");                // Excel on the even tiles, Gmail on the odd ones
const MISSING: Record<number, number> = { 1: 1.75, 5: 2.55, 6: 3.35 };  // tile -> when it goes grey and empty
const BADGES = [{ tile: 0, text: "Reminder", at: 0.3 }, { tile: 4, text: "Final_v3", at: 0.45 }, { tile: 8, text: "Reminder", at: 0.6 }, { tile: 2, text: "Final_v3", at: 0.75 }];
const STOPS = [{ tile: 3, at: 2.1 }, { tile: 7, at: 2.9 }, { tile: 2, at: 3.7 }];   // the paper plane lands here
const EXTRA: Record<number, number> = { 3: 2.15, 7: 2.95, 2: 3.75 };               // a new envelope appears instead of an answer
// the nine icons that go through the portal, in their order on the hover row: [tile, extra?]
const PORTAL: [number, boolean][] = [[0, false], [2, false], [2, true], [3, false], [3, true], [4, false], [7, false], [7, true], [8, false]];
const glass = (o = 0.76): React.CSSProperties => ({ background: `rgba(255,255,255,${o})`, backdropFilter: "blur(18px) saturate(140%)", border: "1.5px solid rgba(255,255,255,.9)", boxShadow: "0 18px 40px rgba(23,43,68,.10), 0 2px 6px rgba(23,43,68,.05)", boxSizing: "border-box" });

/** where a tile's icon sits (tile-relative) */
const iconHome = (tile: number, extra: boolean) => {
  const c = tileC(tile), two = EXTRA[tile] !== undefined;
  return extra ? { x: c.x + 58, y: c.y + 36, s: 0.95 } : { x: c.x + (two ? -34 : 0), y: c.y - 10, s: 1.4 };
};
/** the agitated jitter of the icons in the chase */
const jit = (t: number, i: number, J: number) => ({
  x: J * (2.4 * Math.sin((TAU * t) / 0.25 + i * 1.7) + 1.4 * Math.sin((TAU * t) / 0.4 + i)),
  y: J * (2.0 * Math.sin((TAU * t) / 0.2 + i * 2.3) + 1.2 * Math.sin((TAU * t) / 0.6 + i * 0.7)),
  r: J * 3.0 * Math.sin((TAU * t) / 0.3 + i * 1.3),
});
const qb = (a: { x: number; y: number }, b: { x: number; y: number }, lift: number, p: number) => {
  const cx = (a.x + b.x) / 2, cy = Math.min(a.y, b.y) - lift, q = 1 - p;
  return { x: q * q * a.x + 2 * q * p * cx + p * p * b.x, y: q * q * a.y + 2 * q * p * cy + p * p * b.y, dx: 2 * q * (cx - a.x) + 2 * p * (b.x - cx), dy: 2 * q * (cy - a.y) + 2 * p * (b.y - cy) };
};

const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; z?: number; children: React.ReactNode; clip?: number }> = ({ x, y, s = 1, r = 0, o = 1, z = 10, children, clip }) =>
  o <= 0.002 ? null : (
    <div style={{ position: "absolute", left: 0, top: 0, zIndex: z, opacity: o, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(4)})`, willChange: "transform", clipPath: clip !== undefined ? `inset(-200px -200px ${clip.toFixed(1)}px -200px)` : undefined }}>
      <div style={{ transform: "translate(-50%, -50%)" }}>{children}</div>
    </div>
  );

// ---------------------------------------------------------------- the loop
export const Loop: React.FC = () => {
  const ok = useFont();
  const t = useCurrentFrame() / FPS;
  if (!ok) return <AbsoluteFill style={{ background: C.bg }} />;
  const parts: React.ReactNode[] = [];
  const J = (1 - E(t, 4.4, 4.7)) + E(t, 11.5, 11.9) * E(t, 4.4, 4.7);   // the jitter calms when the portal opens, returns with the grid

  // ---- the nine tiles
  for (let i = 0; i < 9; i++) {
    const c = tileC(i), d = 0.04 * [4, 3, 4, 3, 0, 3, 4, 3, 4][i];
    const pin = E(t, 4.5 + d, 5.2 + d), pout = E(t, 11.0 + d, 11.7 + d), p = pin * (1 - pout);
    const o = 1 - E(t, 5.0, 5.35) * (1 - E(t, 11.0, 11.3));
    const grey = MISSING[i] !== undefined ? E(t, MISSING[i], MISSING[i] + 0.3) * (1 - E(t, 11.4, 11.8)) : 0;
    parts.push(
      <At key={`t${i}`} x={mix(c.x, CARD.x, p)} y={mix(c.y, pout > 0 ? cardY(t) : 480, p)} s={mix(1, 0.62, p)} o={o} z={5}>
        <div style={{ width: TS, height: TS, borderRadius: 28, ...glass(0.72), position: "relative" }}>
          {grey > 0.002 && <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "rgba(214,223,233,.85)", opacity: grey }} />}
        </div>
      </At>
    );
    if (MISSING[i] !== undefined) {
      const mp = E(t, MISSING[i] + 0.15, MISSING[i] + 0.45) * (1 - E(t, 4.45, 4.75));
      parts.push(
        <At key={`m${i}`} x={c.x} y={c.y + 6 + 20 * (1 - mp)} o={mp} z={8}>
          <div style={{ padding: "8px 18px", borderRadius: 20, background: "rgba(255,255,255,.75)", border: "1.5px solid rgba(102,118,138,.35)", color: C.sub, fontFamily: F, fontSize: 25, fontWeight: 700 }}>Missing</div>
        </At>
      );
    }
  }

  // ---- the icons that vanish from the empty tiles
  for (const k of Object.keys(MISSING)) {
    const i = Number(k), h = iconHome(i, false), jt = jit(t, i, J);
    const o = (1 - E(t, MISSING[i], MISSING[i] + 0.3)) + E(t, 11.4, 11.7) * E(t, MISSING[i], MISSING[i] + 0.3);
    const drop = E(t, MISSING[i], MISSING[i] + 0.3) * (1 - E(t, 11.4, 11.7));
    parts.push(<At key={`v${i}`} x={h.x + jt.x} y={h.y + jt.y + 30 * drop} r={jt.r} s={h.s * (1 - 0.2 * drop)} o={o} z={12}>{KIND(i) === "x" ? <Excel /> : <Gmail />}</At>);
  }

  // ---- the nine icons that go through the portal
  PORTAL.forEach(([tile, extra], j) => {
    const home = iconHome(tile, extra), jt = jit(t, j + 3, J);
    const lift = E(t, 4.5 + 0.05 * j, 5.3 + 0.05 * j), tDrop = 6.0 + 0.2 * j, drop = E(t, tDrop, tDrop + 0.42);
    const back = E(t, 11.35 + 0.04 * j, 11.65 + 0.04 * j);
    // extra envelopes only exist from their landing on, and leave with the portal
    const born = extra ? E(t, EXTRA[tile], EXTRA[tile] + 0.3) : 1;
    let x: number, y: number, s: number, o: number, clip: number | undefined;
    if (t < 4.5 + 0.05 * j) { x = home.x + jt.x; y = home.y + jt.y + (extra ? 20 * (1 - born) : 0); s = home.s; o = born; }
    else if (t < tDrop) { const w = swirl(j, t), q = qb(home, w, 60, lift); x = q.x; y = q.y; s = mix(home.s, w.s, lift); o = 1; }
    else if (t < 11.35) { const w = swirl(j, tDrop); x = mix(w.x, 540, drop); y = mix(w.y, SLOT_Y + 52, drop); s = mix(w.s, 0.6, drop); o = 1 - E(t, tDrop + 0.3, tDrop + 0.42); clip = Math.max(0, y + 50 * s - SLOT_Y); }
    else { x = home.x + jt.x; y = home.y + jt.y - 24 * (1 - back); s = home.s; o = extra ? 0 : back; }
    parts.push(<At key={`p${j}`} x={x} y={y} r={t < 4.5 + 0.05 * j || t >= 11.35 ? jt.r : 0} s={s} o={o} z={t < 4.5 + 0.05 * j ? 14 : t < tDrop ? (swirl(j, t).front ? 24 : 19) : 22} clip={clip !== undefined ? clip / s : undefined}>{KIND(tile) === "x" && !extra ? <Excel /> : <Gmail />}</At>);
  });

  // ---- the red reminder badges
  BADGES.forEach(({ tile, text, at }, k) => {
    const c = tileC(tile), p = E(t, at, at + 0.25), o = p * (1 - E(t, 4.35, 4.6));
    const bump = 1 + 0.1 * Math.sin(Math.PI * clamp((t - at - 0.2) / 0.25));
    parts.push(
      <At key={`b${k}`} x={c.x + 62} y={c.y - TS / 2 + 42 + 16 * (1 - p)} s={bump} o={o} z={16}>
        <div style={{ padding: "8px 16px", borderRadius: 18, background: C.red, color: "#fff", fontFamily: F, fontSize: 24, fontWeight: 700, boxShadow: "0 6px 14px rgba(229,72,77,.28)", whiteSpace: "nowrap" }}>{text}</div>
      </At>
    );
  });

  // ---- the paper plane: lands on three tiles; a trail follows it
  const legs = [{ a: { x: -90, y: 660 }, at0: 1.5, at1: 2.1 }, ...STOPS.map((s, k) => ({ a: STOPS[k] ? tileC(s.tile) : { x: 0, y: 0 }, at0: s.at + 0.15, at1: k < 2 ? STOPS[k + 1].at : 4.45 }))];
  const ends = [...STOPS.map((s) => tileC(s.tile)), { x: 1200, y: -40 }].map((p, k) => (k < 3 ? { x: p.x + 40, y: p.y - 58 } : p));
  const starts = [{ x: -90, y: 660 }, ...ends.slice(0, 3)];
  const trails: React.ReactNode[] = [];
  let plane: React.ReactNode = null;
  legs.forEach((lg, k) => {
    const a = starts[k], b = ends[k], dur = lg.at1 - lg.at0;
    const p = E(t, lg.at0, lg.at1), path = `M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 150} ${b.x} ${b.y}`;
    const fade = 1 - E(t, lg.at1, lg.at1 + 0.4);
    if (t > lg.at0 && fade > 0.002) trails.push(<path key={k} d={path} fill="none" stroke={C.sub} strokeOpacity={0.45 * fade} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="0.012 0.018" pathLength={1} strokeDashoffset={0} style={{ strokeDasharray: `${(p * 1).toFixed(4)} 2` }} />);
    if (t >= lg.at0 && t < lg.at1 + (k < 3 ? 0.15 : 0)) {
      const q = qb(a, b, 150, p), ang = (Math.atan2(q.dy, q.dx) * 180) / Math.PI + 20;
      const landed = t >= lg.at1, dip = landed ? Math.sin(Math.PI * clamp((t - lg.at1) / 0.15)) * 6 : 0;
      plane = <At key="plane" x={q.x} y={q.y + dip} r={landed ? 0 : ang} z={30} o={k === 0 ? E(t, 1.5, 1.7) : 1}><Plane /></At>;
    }
    void dur;
  });
  if (trails.length) parts.push(<svg key="trails" width={SIZE} height={SIZE} style={{ position: "absolute", left: 0, top: 0, zIndex: 9 }}>{trails}</svg>);
  if (plane) parts.push(plane);

  // ---- the portal: one frosted card with a clean form
  const cIn = clamp((t - 5.0) / 0.6), cs = t < 5.0 ? 0 : t < 5.6 ? backOut(cIn) : 1, cOut = E(t, 11.0, 11.4);
  const cO = E(t, 4.95, 5.25) * (1 - cOut);
  const float = 5 * Math.sin((TAU * t) / 3);
  const field = E(t, 5.55, 5.95), pills = [0, 1, 2].map((k) => E(t, 5.9 + 0.1 * k, 6.3 + 0.1 * k));
  parts.push(
    <At key="card" x={CARD.x} y={cardY(t) + float} s={mix(0.82, 1, cs) * (1 - 0.08 * cOut)} o={cO} z={20}>
      <div style={{ width: CARD.w, height: CARD.h, borderRadius: 34, ...glass(0.8), position: "relative", fontFamily: F }}>
        <div style={{ position: "absolute", left: CARD.w / 2 - 160, top: 25, width: 320, height: 16, borderRadius: 8, background: "rgba(23,43,68,.10)", boxShadow: "inset 0 2px 4px rgba(23,43,68,.18)" }} />
        <div style={{ opacity: field, transform: `translate3d(0, ${((1 - field) * 20).toFixed(2)}px, 0)` }}>
          <div style={{ position: "absolute", left: 48, top: 72, width: 190, height: 13, borderRadius: 6.5, background: C.navy, opacity: 0.55 }} />
          {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 48, top: 104 + r * 66, width: CARD.w - 96, height: 50, borderRadius: 14, background: "rgba(255,255,255,.7)", border: "1.5px solid rgba(102,118,138,.22)", boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 18, top: 18, width: [210, 150][r], height: 11, borderRadius: 5.5, background: C.sub, opacity: 0.35 }} />
          </div>)}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 254, display: "flex", justifyContent: "center", gap: 16 }}>
          {["Travel", "Food", "Materials"].map((s, k) => (
            <div key={s} style={{ opacity: pills[k], transform: `translate3d(0, ${((1 - pills[k]) * 24).toFixed(2)}px, 0)`, padding: "10px 24px", borderRadius: 26, background: C.blue, color: C.navy, fontSize: 27, fontWeight: 600 }}>{s}</div>
          ))}
        </div>
      </div>
    </At>
  );

  // ---- one overview: partner rows with checks, and the counter
  for (let k = 0; k < 4; k++) {
    const rin = E(t, 8.1 + 0.3 * k, 8.6 + 0.3 * k), rout = E(t, 10.85 + 0.05 * k, 11.15 + 0.05 * k), ro = rin * (1 - rout);
    const ck = E(t, 8.6 + 0.45 * k, 8.9 + 0.45 * k) * (1 - E(t, 10.7, 10.95));
    parts.push(
      <At key={`r${k}`} x={540 + 60 * (1 - rin)} y={570 + k * 80} o={ro} z={18}>
        <div style={{ width: 600, height: 64, borderRadius: 20, ...glass(0.78), position: "relative" }}>
          <div style={{ position: "absolute", left: 14, top: 11, width: 40, height: 40, borderRadius: 20, background: "#E3ECF5" }}>
            <svg width={40} height={40} viewBox="0 0 40 40"><circle cx={20} cy={16} r={6.5} fill={C.navy} opacity={0.45} /><path d="M9 33c1.5-6 6-9 11-9s9.5 3 11 9" fill={C.navy} opacity={0.45} /></svg>
          </div>
          <div style={{ position: "absolute", left: 70, top: 17, width: [170, 140, 190, 120][k], height: 12, borderRadius: 6, background: C.navy, opacity: 0.5 }} />
          <div style={{ position: "absolute", left: 70, top: 37, width: [110, 150, 90, 130][k], height: 9, borderRadius: 4.5, background: C.sub, opacity: 0.3 }} />
          {[0, 1, 2].map((m) => <div key={m} style={{ position: "absolute", left: 300 + m * 64, top: 26, width: 46, height: 12, borderRadius: 6, background: C.sub, opacity: 0.18 }} />)}
          {ck > 0.002 && <div style={{ position: "absolute", right: 14, top: 12, width: 40, height: 40, borderRadius: 20, background: C.blue, opacity: ck, transform: `scale(${mix(0.4, 1, ck).toFixed(4)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={24} height={24} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - E(t, 8.7 + 0.45 * k, 8.95 + 0.45 * k)} /></svg>
          </div>}
        </div>
      </At>
    );
  }
  const cnt = E(t, 8.15, 8.45) * (1 - E(t, 10.85, 11.15)), v = Math.round(100 * E(t, 8.4, 10.25));
  parts.push(
    <At key="cnt" x={540} y={916 + 24 * (1 - E(t, 8.15, 8.45))} o={cnt} z={18}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontFamily: F }}>
        <div style={{ color: C.navy, fontSize: 56, fontWeight: 800, letterSpacing: -0.8, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{v}% submitted</div>
        <div style={{ width: 380, height: 10, borderRadius: 5, background: "rgba(102,118,138,.16)", overflow: "hidden" }}>
          <div style={{ width: 380, height: 10, borderRadius: 5, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${(v / 100).toFixed(4)})` }} />
        </div>
      </div>
    </At>
  );

  const wm = E(t, 10.45, 10.75) * (1 - E(t, 11.25, 11.55));
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bg2} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -180, top: -120, width: 760, height: 760, borderRadius: 380, background: "radial-gradient(closest-side, rgba(153,205,252,.38), rgba(153,205,252,0))" }} />
      <div style={{ position: "absolute", left: 520, top: 480, width: 820, height: 820, borderRadius: 410, background: "radial-gradient(closest-side, rgba(170,200,245,.34), rgba(170,200,245,0))" }} />
      <div style={{ position: "absolute", left: 600, top: -160, width: 560, height: 560, borderRadius: 280, background: "radial-gradient(closest-side, rgba(214,232,255,.7), rgba(214,232,255,0))" }} />
      {parts}
      {wm > 0.002 && <Img src={staticFile("logo/kb-wordmark-navy.svg")} style={{ position: "absolute", right: 40, bottom: 34, height: 26, opacity: wm, zIndex: 40 }} />}
    </AbsoluteFill>
  );
};
