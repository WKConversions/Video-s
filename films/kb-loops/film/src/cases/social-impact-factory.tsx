// social-impact-factory: "The trail becomes the bridge" (../cases/social-impact-factory.md).
// SIF's AQQO booking card (left) and its new Pipedrive CRM (right) sit apart with a broken dotted link; bookings bounce off
// the break. The K.B tile drops into the gap at the top of the arch, the first booking smears across as a tapered cyan
// comet and its wet trail thins into the cable itself (flourish). Bookings ride the cable and morph into CRM fields;
// "100%" grows out of the K.B tile under the arch, framed by SIF's yellow brackets. The cable snaps at the apex, recoils
// into the stubs, fresh empty contacts scroll in: the opening again.
import React from "react";
import { Img, staticFile, Easing } from "remotion";
import { Frame, useT, seg, cyc, pop, popOut, clamp01, lerp, SOFT } from "../loop";
import { C, KBTile, ToolTile, SHADOW } from "../kb";

// ---------- layout ----------
const LX = 166, RX = 1214, CY = 366, CW = 540, CH = 536, HEAD = 112, ROW = 103;
const ROW0 = CY + HEAD + 6; // slot 0 (rows sit 12 px below the header, 12 px apart: no neighbour peeks in)
const PORT_Y = ROW0 + ROW / 2; // the cable meets both cards at row 0's height
const APEX_Y = 388, TILE = 124;
const FY = 676; // the result figure, under the arch
const SIF = { ground: "#3B3B39", yellow: "#E9B938", yellowSoft: "#FBF0CF" };
const AQQO_GREEN = { soft: "#D9F7E7", ink: "#0A7F47" };
const CYAN_TRAIL = C.cyan;

// ---------- timing ----------
const N_CHIPS = 8;
const DEP = (k: number) => (k === 0 ? 3.3 : 4.25 + (k - 1) * 0.55); // a booking leaves AQQO
const ARR = (k: number) => (k === 0 ? 4.68 : DEP(k) + 1.35); // it lands in its Pipedrive field
const SHIFT_AT = (k: number) => (k === 0 ? 3.5 : DEP(k) + 0.08);
const COMET = { lift: 3.3, morph: 3.5, go: 3.72, hit: 4.45 };
const KB_IN = 2.55, KB_OUT = 9.15;
const flight = Easing.bezier(0.32, 0, 0.18, 1); // comet: quick launch, soft landing
// the wet trail: a point of the trail is as wide as the time since the comet passed it allows (28 px fresh, 7 px dry at 1.6 s)
const DRY = 1.6, wetW = (age: number) => 7 + 21 * Math.max(0, Math.exp(-age / 0.32) - Math.exp(-DRY / 0.32)) / (1 - Math.exp(-DRY / 0.32));
const AGES = [0, 0.025, 0.05, 0.08, 0.12, 0.17, 0.23, 0.3, 0.39, 0.5, 0.64, 0.82, 1.05, 1.32, DRY];
const ride = Easing.bezier(0.55, 0, 0.35, 1);
const pulse = (t: number, at: number, dur: number) => { const u = clamp01((t - at) / dur); return Math.pow(Math.sin(Math.PI * u), 2); };
// cos: at the seam the cards are at the turn of their float (no pixel-snap step there)
const floatY = (t: number, ph: number) => 9 * Math.cos(2 * Math.PI * (t / 5 + ph)) + 0.25;
// problem: each side tries to reach the other and falls into the gap (even: a booking from AQQO, odd: a contact from Pipedrive)
const ATTEMPTS = [0.0, 0.5, 1.0, 1.5];
const PW = 170, PH = 60; // a travelling pill

// ---------- the arch ----------
type Pt = { x: number; y: number };
const bez = (a: Pt, b: Pt, c: Pt, d: Pt, s: number): Pt => {
  const m = 1 - s;
  return { x: m * m * m * a.x + 3 * m * m * s * b.x + 3 * m * s * s * c.x + s * s * s * d.x, y: m * m * m * a.y + 3 * m * m * s * b.y + 3 * m * s * s * c.y + s * s * s * d.y };
};
const makeArch = (fL: number, fR: number) => {
  const p0 = { x: LX + CW, y: PORT_Y + fL }, p3 = { x: RX, y: PORT_Y + fR }, ay = APEX_Y + (fL + fR) / 2, a = { x: 960, y: ay };
  const S: [Pt, Pt, Pt, Pt][] = [[p0, { x: p0.x + 130, y: p0.y }, { x: 830, y: ay }, a], [a, { x: 1090, y: ay }, { x: p3.x - 130, y: p3.y }, p3]];
  const pts: Pt[] = [];
  const N = 90;
  S.forEach((s, j) => { for (let i = j ? 1 : 0; i <= N; i++) pts.push(bez(s[0], s[1], s[2], s[3], i / N)); });
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const L = cum[cum.length - 1];
  const idx = (u: number): [number, number] => {
    const tg = clamp01(u) * L;
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cum[mid] <= tg) lo = mid; else hi = mid; }
    return [lo, (tg - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo])];
  };
  const at = (u: number) => {
    const [i, f] = idx(u), p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], pp = pts[Math.max(0, i - 1)];
    const ang = i + 1 < pts.length ? Math.atan2(q.y - p.y, q.x - p.x) : Math.atan2(p.y - pp.y, p.x - pp.x);
    return { x: lerp(p.x, q.x, f), y: lerp(p.y, q.y, f), ang };
  };
  const sub = (u0: number, u1: number) => {
    u0 = clamp01(u0); u1 = clamp01(u1);
    if (u1 - u0 < 1e-4) return "";
    const s0 = at(u0), s1 = at(u1), [i0] = idx(u0), [i1] = idx(u1);
    let d = `M${s0.x.toFixed(1)},${s0.y.toFixed(1)}`;
    for (let i = i0 + 1; i <= i1; i++) d += `L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
    return d + `L${s1.x.toFixed(1)},${s1.y.toFixed(1)}`;
  };
  return { at, sub, L, p0, p3 };
};

// ---------- glyphs ----------
type Glyph = "meet" | "desk" | "card" | "event" | "link" | "person";
const GlyphSvg: React.FC<{ g: Glyph; size: number; color?: string }> = ({ g, size, color = C.navy }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    {g === "meet" && (<><circle cx={9} cy={8.5} r={3} /><circle cx={16.5} cy={9.5} r={2.4} /><path d="M3 19c0-3.2 2.8-5.2 6-5.2s6 2 6 5.2" /><path d="M15 14.2c3 0 6 1.6 6 4.8" /></>)}
    {g === "desk" && (<><rect x={4} y={5} width={16} height={10.5} rx={1.6} /><path d="M2 19h20" /></>)}
    {g === "card" && (<><rect x={3} y={6} width={18} height={12.5} rx={2.2} /><path d="M3 10.2h18" /><path d="M7 15h4" /></>)}
    {g === "event" && (<><rect x={4} y={5.5} width={16} height={14.5} rx={2.2} /><path d="M4 10.2h16" /><path d="M8.5 3.5v4" /><path d="M15.5 3.5v4" /><circle cx={12} cy={15} r={1.2} fill={color} /></>)}
    {g === "link" && (<><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></>)}
    {g === "person" && (<><circle cx={12} cy={8.5} r={3.6} /><path d="M5 20c0-3.8 3.1-6.2 7-6.2s7 2.4 7 6.2" /></>)}
  </svg>
);
// the four kinds of booking the case page names
const CATS: { label: string; soft: string; g: Glyph }[] = [
  { label: "Meeting room", soft: SIF.yellowSoft, g: "meet" },
  { label: "Coworking", soft: C.cyanSoft, g: "desk" },
  { label: "Membership", soft: "#E4E8EF", g: "card" },
  { label: "Event", soft: AQQO_GREEN.soft, g: "event" },
];
const AVATAR = [C.cyanSoft, SIF.yellowSoft, "#E4E8EF", AQQO_GREEN.soft];
const Disc: React.FC<{ soft: string; g: Glyph; size: number }> = ({ soft, g, size }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <GlyphSvg g={g} size={size * 0.56} />
  </div>
);

// ---------- a booking: a full AQQO row that can morph into a travelling pill ----------
const RW = CW - 28, RH = ROW - 12;
const Booking: React.FC<{ cat: number; cx: number; cy: number; w: number; h: number; full: number; rot?: number; sx?: number; lift?: number; tint?: number; op?: number }> = ({ cat, cx, cy, w, h, full, rot = 0, sx = 1, lift = 0, tint = 0, op = 1 }) => {
  const c = CATS[cat % 4], disc = Math.min(58, h - 14);
  const bg = tint > 0 ? `rgba(56,200,255,${tint})` : C.white;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: Math.min(h / 2, lerp(14, h / 2, 1 - full)), opacity: op,
      background: C.white, overflow: "hidden", boxShadow: lift > 0 ? `0 ${10 + 14 * lift}px ${24 + 26 * lift}px -12px rgba(41,58,81,${0.28 + 0.18 * lift})` : "0 6px 16px -10px rgba(41,58,81,0.25)",
      transform: `rotate(${rot}rad) scaleX(${sx}) scale(${1 + 0.03 * lift})`, display: "flex", alignItems: "center", padding: `0 ${lerp(7, 16, full)}px`, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", inset: 0, background: bg }} />
      <div style={{ position: "relative", opacity: 1 - tint }}><Disc soft={c.soft} g={c.g} size={disc} /></div>
      <div style={{ position: "relative", marginLeft: 16, flex: 1, minWidth: 0, opacity: clamp01(full * 1.6 - 0.6) * (1 - tint), whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 27, fontWeight: 700, color: C.ink, lineHeight: 1 }}>{c.label}</div>
        <div style={{ marginTop: 12, width: 130, height: 10, borderRadius: 5, background: C.line }} />
      </div>
      <div style={{ position: "relative", opacity: clamp01(full * 1.6 - 0.6) * (1 - tint), padding: "9px 17px", borderRadius: 999, background: AQQO_GREEN.soft, color: AQQO_GREEN.ink, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>Booked</div>
      {/* the pill's own data bars, once the row has folded */}
      <div style={{ position: "absolute", left: disc + 18, top: h / 2 - 9, opacity: clamp01(1 - full * 2.2) * (1 - tint) }}>
        <div style={{ width: 54, height: 7, borderRadius: 4, background: C.navy, opacity: 0.75 }} />
        <div style={{ marginTop: 5, width: 36, height: 6, borderRadius: 3, background: C.line }} />
      </div>
    </div>
  );
};

// ---------- a Pipedrive contact row ----------
const FIELD_W = 130, FIELD_H = 52;
const FIELD_X = [RX + 214, RX + 366]; // left edges, relative to the frame
const Field: React.FC<{ x: number; y: number; fill: number; g: Glyph; soft: string; q: number }> = ({ x, y, fill, g, soft, q }) => (
  <div style={{ position: "absolute", left: x, top: y - FIELD_H / 2, width: FIELD_W, height: FIELD_H }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 13, border: "2.5px dashed #C3CCD8", boxSizing: "border-box", opacity: 1 - clamp01(fill * 1.4),
      display: "flex", alignItems: "center", justifyContent: "center", color: "#A7B2C0", fontSize: 24, fontWeight: 800 }}>
      <span style={{ display: "inline-block", transform: `scale(${1 + 0.35 * q})` }}>?</span>
    </div>
    {fill > 0.001 && (
      <div style={{ position: "absolute", inset: 0, borderRadius: 13, background: soft, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        opacity: clamp01(fill * 1.8), transform: `scale(${0.55 + 0.45 * fill})` }}>
        <GlyphSvg g={g} size={27} />
        <svg width={22} height={22} viewBox="0 0 20 20"><circle cx={10} cy={10} r={10} fill={C.ok} /><path d="M5.6 10.3l3 2.9 5.6-6" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    )}
  </div>
);

export const Loop: React.FC = () => {
  const t = useT();
  const tt = t < 5 ? t + 10 : t; // unwrapped clock for what crosses the seam
  const fL = floatY(t, 0), fR = floatY(t, 0.5);
  const arch = makeArch(fL, fR);
  const apex = arch.at(0.5);

  // AQQO list: each departure moves the rows up one slot (8 departures, 4 kinds: the list ends as it began)
  let shiftA = 0;
  for (let k = 0; k < N_CHIPS; k++) shiftA += pop(t, SHIFT_AT(k), { dur: 0.45, over: 0.04 });
  // Pipedrive list: fresh, empty contacts scroll in at the end (4 rows, 4 avatar tints: the list ends as it began)
  const shiftP = t < 5 ? pop(tt, 9.0, { dur: 0.62, over: 0.03 }) * 4 - 4 : pop(t, 9.0, { dur: 0.62, over: 0.03 }) * 4;

  // the K.B tile
  const kbIn = pop(t, KB_IN, { dur: 0.6, over: 0.06 }) * popOut(t, KB_OUT, { dur: 0.45 });
  const gulp = pulse(t, 4.0, 0.32);
  const kbDot = 1 + 0.9 * pulse(t, 3.1, 0.4) + 0.9 * gulp + 0.7 * pulse(t, 7.0, 0.4);
  const makeIn = pop(t, 4.12, { dur: 0.5, over: 0.08 }) * popOut(t, 9.02, { dur: 0.35 });

  // text
  const problem = pop(tt, 9.35, { dur: 0.6, over: 0.04 }) * popOut(tt, 12.35, { dur: 0.45 });
  const solution = pop(t, 4.5, { dur: 0.6, over: 0.04 }) * popOut(t, 6.85, { dur: 0.45 });
  const fig = pop(t, 7.1, { dur: 0.7, over: 0.05 }) * popOut(t, 8.9, { dur: 0.45 });
  const figN = Math.round(100 * seg(t, 7.12, 7.55, Easing.out(Easing.cubic)));   // lands on 100 at 7.55: readable 1.35 s before the exit
  const figLabel = pop(t, 7.35, { dur: 0.55, over: 0.04 }) * popOut(t, 8.78, { dur: 0.4 });

  // ---------- the cable and the comet (SVG) ----------
  const svg: React.ReactNode[] = [];
  // the broken link of the opening: two dotted stubs
  // once the K.B tile has landed, both stubs reach up into it (still dotted: the comet makes it real)
  const stubOp = t < 6.5 ? 1 - seg(t, 3.75, 4.3) : seg(t, 9.38, 9.92);
  const reach = t < 6.5 ? 0.13 * pop(t, 2.95, { dur: 0.45, over: 0.05 }) : 0;
  if (stubOp > 0.001) {
    for (const [a, b] of [[0, 0.36 + reach], [0.64 - reach, 1]]) {
      svg.push(<path key={`stub${a}`} d={arch.sub(a, b)} stroke="#B9C3CF" strokeWidth={5} strokeDasharray="0.1 14" strokeLinecap="round" fill="none" opacity={stubOp} />);
      const e = arch.at(a === 0 ? b : a);
      svg.push(<circle key={`cap${a}`} cx={e.x} cy={e.y} r={7} fill="#B9C3CF" opacity={stubOp} />);
    }
  }
  // the missing link at the top of the arch: two link halves rocking apart (the K.B tile lands in its place)
  const brk = t < 6.5 ? (t < 5 ? pop(tt, 9.5, { dur: 0.5, over: 0.06 }) * popOut(tt, 12.4, { dur: 0.3 }) : 0) : pop(t, 9.5, { dur: 0.5, over: 0.06 });
  if (brk > 0.001) {
    const shake = ATTEMPTS.reduce((s, a) => s + pulse(t, a + 0.56, 0.3), 0);
    const g = 9 + 4 * Math.sin(2 * Math.PI * t / 2) + 6 * shake;
    svg.push(<g key="brk" transform={`translate(${apex.x} ${apex.y}) scale(${brk}) rotate(${-38 + 10 * shake})`} opacity={clamp01(brk * 1.5)}>
      <rect x={-g - 38} y={-11} width={38} height={22} rx={11} stroke="#A9B4C2" strokeWidth={6} fill="none" />
      <rect x={g} y={-11} width={38} height={22} rx={11} stroke="#A9B4C2" strokeWidth={6} fill="none" />
    </g>);
  }
  // comet
  const cu = (tm: number) => seg(tm, COMET.go, COMET.hit, flight);
  const cometOn = t >= COMET.go && t < COMET.hit + 0.02;
  const cableW = 7;
  const cableOp = 1 - seg(t, 9.5, 9.96);
  if (t >= COMET.go && t < 9.97) {
    const head = cu(t);
    const glow = (d: string, w: number, key: string, op: number) => <path key={key} d={d} stroke={CYAN_TRAIL} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={op} />;
    if (t < COMET.hit + DRY) {
      // the smear: the comet's trail is laid wet and dries, from the tail forward, into the cable
      const dry = cu(t - DRY);
      if (dry > 0) { svg.push(glow(arch.sub(0, dry), cableW * 2.6, "halo", 0.14)); svg.push(glow(arch.sub(0, dry), cableW, "trail", 1)); }
      for (let j = AGES.length - 2; j >= 0; j--) {
        const a = cu(t - AGES[j + 1]), b = cu(t - AGES[j]);
        if (b - a < 1e-4) continue;
        const w = wetW((AGES[j] + AGES[j + 1]) / 2);
        svg.push(glow(arch.sub(a, b), w * 2.4, `wh${j}`, 0.14));
        svg.push(glow(arch.sub(a, b), w, `w${j}`, 1));
      }
    } else if (t < KB_OUT + 0.05) {
      svg.push(glow(arch.sub(0, 1), cableW * 2.6, "halo", 0.14));
      svg.push(glow(arch.sub(0, 1), cableW, "trail", 1));
    } else {
      // the snap: the cable splits at the apex and recoils into the stubs
      const rk = pop(t, KB_OUT + 0.05, { dur: 0.5, over: 0.08 });
      const uL = 0.5 - 0.14 * rk, uR = 0.5 + 0.14 * rk;
      svg.push(glow(arch.sub(0, uL), cableW * 2.6, "haloL", 0.14 * cableOp));
      svg.push(glow(arch.sub(uR, 1), cableW * 2.6, "haloR", 0.14 * cableOp));
      svg.push(glow(arch.sub(0, uL), cableW, "trailL", cableOp));
      svg.push(glow(arch.sub(uR, 1), cableW, "trailR", cableOp));
    }
    if (cometOn) {
      // the smear: a tapered comet whose length is its speed
      svg.push(glow(arch.sub(cu(t - 0.03), head), 40, "c0", 1));
      const hp = arch.at(head);
      svg.push(<circle key="core" cx={hp.x} cy={hp.y} r={9} fill="#FFFFFF" opacity={0.9} />);
    }
    // the data flowing along the cable once it is laid
    const shimmer = seg(t, 4.5, 5.0) * (1 - seg(t, 9.05, 9.25));
    if (shimmer > 0.001) svg.push(<path key="shim" d={arch.sub(0, 1)} stroke="#FFFFFF" strokeWidth={3} strokeDasharray="16 72" strokeDashoffset={-cyc(t, 1) * 88} strokeLinecap="round" fill="none" opacity={0.75 * shimmer} />);
  }
  // problem: bookings try to cross and hit the break
  const bumps: React.ReactNode[] = [];
  ATTEMPTS.forEach((a, i) => {
    if (t < a || t > a + 1.5) return;
    const right = i % 2 === 1, dir = right ? -1 : 1;
    const go = 0.235 * seg(t, a + 0.08, a + 0.62, SOFT) - 0.04 * pulse(t, a + 0.56, 0.34);
    const p = arch.at(right ? 1 - go : go);
    const fall = seg(t, a + 0.88, a + 1.45, Easing.in(Easing.quad));
    const s = pop(t, a, { dur: 0.3, over: 0.08 });
    const rot = (right ? p.ang : p.ang) * 0.5 - dir * 0.9 * fall;
    if (s > 0.001 && fall < 1) bumps.push(<div key={`att${i}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${-dir * 30 * fall}px, ${170 * fall}px) scale(${s * (1 - 0.35 * fall)})`, transformOrigin: `${p.x}px ${p.y}px`, opacity: 1 - seg(t, a + 1.15, a + 1.45) }}>
      {right ? (
        <div style={{ position: "absolute", left: p.x - PW / 2, top: p.y - PH / 2, width: PW, height: PH, borderRadius: PH / 2, background: C.white, boxShadow: "0 10px 22px -12px rgba(41,58,81,0.35)",
          transform: `rotate(${rot}rad)`, display: "flex", alignItems: "center", padding: "0 8px", boxSizing: "border-box" }}>
          <Disc soft={AVATAR[(i >> 1) % 4]} g="person" size={40} />
          <div style={{ marginLeft: 12 }}><div style={{ width: 62, height: 8, borderRadius: 4, background: "#C9D1DC" }} /><div style={{ marginTop: 6, width: 40, height: 7, borderRadius: 4, background: C.line }} /></div>
        </div>
      ) : <Booking cat={i >> 1} cx={p.x} cy={p.y} w={PW} h={PH} full={0} rot={rot} op={1} />}
    </div>);
    const ring = seg(t, a + 0.56, a + 1.12, Easing.out(Easing.cubic));
    if (ring > 0 && ring < 1) {
      const e = arch.at(right ? 0.64 : 0.36);
      svg.push(<circle key={`warn${i}`} cx={e.x} cy={e.y} r={10 + 30 * ring} stroke={C.warn} strokeWidth={3} fill="none" opacity={0.75 * (1 - ring)} />);
    }
  });
  // the comet lands: a splash ring at the Pipedrive port
  const splash = seg(t, COMET.hit - 0.04, COMET.hit + 0.5, Easing.out(Easing.cubic));
  if (splash > 0 && splash < 1) svg.push(<circle key="splash" cx={arch.p3.x} cy={arch.p3.y} r={16 + 50 * splash} stroke={C.cyan} strokeWidth={5 * (1 - splash) + 1} fill="none" opacity={0.7 * (1 - splash)} />);
  // K.B steps in: a soft cyan ring
  const ringK = seg(t, KB_IN + 0.15, KB_IN + 0.85, Easing.out(Easing.cubic));
  if (ringK > 0 && ringK < 1) svg.push(<circle key="kbring" cx={apex.x} cy={apex.y} r={70 + 90 * ringK} stroke={C.cyan} strokeWidth={4} fill="none" opacity={0.6 * (1 - ringK)} />);

  // ---------- chips: bookings that leave AQQO and land in Pipedrive ----------
  const chips: React.ReactNode[] = [];
  const slotY = (slot: number, f: number) => ROW0 + slot * ROW + ROW / 2 + f;
  const rowCx = LX + CW / 2;
  for (let k = 0; k < N_CHIPS; k++) {
    const d = DEP(k), arr = ARR(k);
    if (t < d || t > arr + 0.1) continue;
    const row = k >> 1, fieldIdx = k & 1;
    const target = { x: FIELD_X[fieldIdx] + FIELD_W / 2, y: slotY(row - shiftP, fR) };
    const fadeOut = 1 - seg(t, arr - 0.06, arr + 0.06);
    if (k === 0) {
      if (t < COMET.go) {
        // lift, then fold into a cyan capsule at the port
        const lift = pop(t, COMET.lift, { dur: 0.25, over: 0.06 });
        const m = seg(t, COMET.morph, COMET.go, SOFT);
        const squash = pulse(t, COMET.morph - 0.06, 0.2);
        const cx = lerp(rowCx, arch.p0.x + 6, m) - 14 * squash, cy = lerp(slotY(0, fL), arch.p0.y, m);
        chips.push(<Booking key="c0" cat={0} cx={cx} cy={cy} w={lerp(RW, 64, m)} h={lerp(RH, 38, m)} full={1 - m} lift={lift * (1 - m)} tint={seg(t, COMET.morph + 0.05, COMET.go, SOFT)} sx={1 - 0.08 * squash} />);
      } else if (t >= COMET.hit) {
        // land: the capsule unfolds into the first field
        const h = seg(t, COMET.hit, arr, SOFT);
        const cx = lerp(arch.p3.x, target.x, h), cy = lerp(arch.p3.y, target.y, h) - 26 * Math.sin(Math.PI * h);
        chips.push(<Booking key="c0" cat={0} cx={cx} cy={cy} w={lerp(64, FIELD_W, h)} h={lerp(38, FIELD_H, h)} full={0} tint={1 - h} op={fadeOut} />);
      }
      continue;
    }
    let cx: number, cy: number, w = PW, h = PH, full = 0, rot = 0, sx = 1;
    if (t < d + 0.3) {
      const m = seg(t, d, d + 0.3, SOFT);
      cx = lerp(rowCx, arch.p0.x, m); cy = lerp(slotY(0, fL), arch.p0.y, m); w = lerp(RW, PW, m); h = lerp(RH, PH, m); full = 1 - m;
    } else if (t < d + 1.1) {
      const u = seg(t, d + 0.3, d + 1.1, ride), u2 = seg(t - 1 / 60, d + 0.3, d + 1.1, ride);
      const p = arch.at(u), speed = (u - u2) * arch.L; // px per frame
      cx = p.x; cy = p.y; rot = p.ang * 0.55; sx = 1 + Math.min(0.28, speed / 60);
      // a short cyan smear behind each pill
      if (speed > 1) svg.push(<path key={`sm${k}`} d={arch.sub(Math.max(0, u - 0.09), u)} stroke={C.cyan} strokeWidth={14} strokeLinecap="round" fill="none" opacity={Math.min(0.55, speed / 40)} />);
    } else {
      const m = seg(t, d + 1.1, arr, SOFT);
      cx = lerp(arch.p3.x, target.x, m); cy = lerp(arch.p3.y, target.y, m) - 22 * Math.sin(Math.PI * m); w = lerp(PW, FIELD_W, m); h = lerp(PH, FIELD_H, m);
    }
    chips.push(<Booking key={`c${k}`} cat={k} cx={cx} cy={cy} w={w} h={h} full={full} rot={rot} sx={sx} op={fadeOut} />);
  }

  // ---------- cards ----------
  const aqqoRows: React.ReactNode[] = [];
  for (let i = Math.max(0, Math.floor(shiftA) - 1); i < Math.floor(shiftA) + 6; i++) {
    if (i < N_CHIPS && t >= DEP(i)) continue; // already left as a chip
    const y = (i - shiftA) * ROW + 12;
    aqqoRows.push(<div key={`a${i}`} style={{ position: "absolute", left: 14, top: y }}><div style={{ position: "relative", width: RW, height: RH }}><Booking cat={i} cx={RW / 2} cy={RH / 2} w={RW} h={RH} full={1} /></div></div>);
  }
  const pdRows: React.ReactNode[] = [];
  for (let r = Math.max(0, Math.floor(shiftP) - 1); r < Math.floor(shiftP) + 6; r++) {
    const y = (r - shiftP) * ROW + 12;
    const fields = [0, 1].map((f) => {
      const k = r * 2 + f, has = r < 4;
      const fill = has && t >= ARR(k) - 0.06 ? pop(t, ARR(k) - 0.06, { dur: 0.4, over: 0.08 }) : 0;
      const q = r < 4 && t < 3.5 ? ATTEMPTS.reduce((s, a, i) => s + (i % 2 ? 0 : pulse(t, a + 0.6 + 0.05 * k, 0.32)), 0) : 0;
      return <Field key={f} x={FIELD_X[f] - RX} y={RH / 2} fill={fill} g={f === 0 ? CATS[k % 4].g : "link"} soft={f === 0 ? CATS[k % 4].soft : C.cyanSoft} q={q} />;
    });
    pdRows.push(<div key={`p${r}`} style={{ position: "absolute", left: 0, top: y, width: CW, height: RH }}>
      <div style={{ position: "absolute", left: 14, top: 0, width: RW, height: RH, borderRadius: 14, background: C.white, boxShadow: "0 6px 16px -10px rgba(41,58,81,0.25)" }} />
      <div style={{ position: "absolute", left: 30, top: RH / 2 - 27 }}><Disc soft={AVATAR[r % 4]} g="person" size={54} /></div>
      <div style={{ position: "absolute", left: 100, top: RH / 2 - 15, width: 92, height: 12, borderRadius: 6, background: "#D5DCE5" }} />
      <div style={{ position: "absolute", left: 100, top: RH / 2 + 6, width: 62, height: 10, borderRadius: 5, background: C.line }} />
      {fields}
    </div>);
  }
  const badgeA = 1 + 0.08 * [0, 1, 2, 3, 4, 5, 6, 7].reduce((s, k) => s + pulse(t, DEP(k), 0.3), 0);
  const badgeP = 1 + 0.08 * [0, 1, 2, 3, 4, 5, 6, 7].reduce((s, k) => s + pulse(t, ARR(k) - 0.28, 0.3), 0);

  const card = (x: number, f: number, head: React.ReactNode, rows: React.ReactNode[]) => (
    <div style={{ position: "absolute", left: x, top: CY + f, width: CW, height: CH, borderRadius: 22, background: "#F2F5F8", boxShadow: SHADOW.card, overflow: "hidden" }}>
      {head}
      <div style={{ position: "absolute", left: 0, top: HEAD, width: CW, height: CH - HEAD, overflow: "hidden" }}>{rows}</div>
    </div>
  );
  const aqqoHead = (
    <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: HEAD, background: SIF.ground, display: "flex", alignItems: "center", padding: "0 22px", boxSizing: "border-box" }}>
      <Img src={staticFile("cases/social-impact-factory/sif-logo.jpg")} style={{ height: 90, width: 90 * 1169 / 1249, display: "block" }} />
      <div style={{ marginLeft: 22, color: C.white, fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em" }}>Reservations</div>
    </div>
  );
  const pdHead = (
    <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: HEAD, background: C.white, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 26px 0 96px", boxSizing: "border-box" }}>
      <div style={{ color: C.navy, fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em" }}>Contacts</div>
      <div style={{ marginLeft: "auto", width: 128, height: 36, borderRadius: 18, background: C.paleCool, border: `1px solid ${C.line}` }} />
    </div>
  );

  const line = (k: number, text: string) => k > 0.001 && (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 100, display: "flex", justifyContent: "center", alignItems: "center",
      opacity: clamp01(k * 1.6), transform: `translateY(${(1 - k) * 26}px) scale(${0.93 + 0.07 * k})`, fontSize: 72, fontWeight: 800, color: C.navy, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>{text}</div>
  );

  // result: 100% grows down out of the K.B tile, SIF's yellow brackets close around it
  const figY = lerp(apex.y, FY, fig), figS = lerp(0.3, 1, fig);
  const brackets = [0, 1, 2, 3].map((i) => {
    const k = pop(t, 7.4 + 0.06 * i, { dur: 0.5, over: 0.07 }) * popOut(t, 8.74, { dur: 0.35 });
    if (k < 0.001) return null;
    const sxn = i % 2 ? 1 : -1, syn = i < 2 ? -1 : 1, bx = 960 + sxn * (216 + 40 * (1 - k)), by = FY + syn * (76 + 26 * (1 - k)), arm = 46;
    return <path key={i} d={`M${bx - sxn * arm},${by}L${bx},${by}L${bx},${by - syn * arm}`} stroke={SIF.yellow} strokeWidth={10} strokeLinecap="square" fill="none" opacity={clamp01(k * 2)} />;
  });

  return (
    <Frame>
      {card(LX, fL, aqqoHead, aqqoRows)}
      {card(RX, fR, pdHead, pdRows)}
      <div style={{ position: "absolute", left: LX + CW - 50, top: CY + fL - 44, transform: `scale(${badgeA})` }}><ToolTile tool="aqqo" size={94} /></div>
      <div style={{ position: "absolute", left: RX - 44, top: CY + fR - 44, transform: `scale(${badgeP})` }}><ToolTile tool="pipedrive" size={94} /></div>

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{svg}{brackets}</svg>

      {fig > 0.001 && (
        <div style={{ position: "absolute", left: 960 - 400, top: figY - 90, width: 800, height: 180, display: "flex", justifyContent: "center", alignItems: "center",
          transform: `scale(${figS})`, opacity: clamp01(fig * 2.2), fontSize: 128, fontWeight: 800, color: C.navy, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{figN}%</div>
      )}
      {figLabel > 0.001 && (
        <div style={{ position: "absolute", left: 960 - 400, top: FY + 100, width: 800, textAlign: "center", fontSize: 30, fontWeight: 600, color: C.muted,
          opacity: clamp01(figLabel * 1.6), transform: `translateY(${(1 - figLabel) * 18}px)` }}>automated synchronization</div>
      )}

      {kbIn > 0.001 && (
        <div style={{ position: "absolute", left: apex.x - TILE / 2, top: apex.y - TILE / 2 - 90 * (1 - Math.min(1, kbIn)), width: TILE, height: TILE,
          transform: `scale(${kbIn * (1 + 0.07 * gulp)}, ${kbIn * (1 - 0.06 * gulp)})` }}>
          <KBTile size={TILE} dot={kbDot} />
          {makeIn > 0.001 && <div style={{ position: "absolute", left: TILE - 30, top: TILE - 34, padding: 4, borderRadius: 16, background: C.white, boxShadow: SHADOW.soft, transform: `scale(${makeIn})` }}><ToolTile tool="make" size={60} shadow={false} /></div>}
        </div>
      )}

      {bumps}
      {chips}
      {line(problem, "Booking and CRM apart")}
      {line(solution, "Bookings flow into CRM")}
    </Frame>
  );
};
