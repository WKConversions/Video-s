// Segment B (5-10 s, frames 300-599): what the agents do.
//  4  5.00-6.38  the activity panel: the H1 card grows a navy "tnoa ~ agent activity" bar (Live pill, typed title);
//                four task rows drop in over the bar like frosted iOS notifications, each pushing the others down;
//                status pills pop, times tick up; the camera follows the stack and the panel keeps turning in 3D.
//  5  6.38-8.03  card expand: the amber "Human review" row lifts and grows into its own card (App Store expand); its
//                icon becomes the agent node, a vetted engineer slides in and joins it like liquid (metaball), a
//                review ring sweeps, chips and a check pop, and "A vetted engineer stays accountable." bounces in.
//  6  8.03-10.0  push with momentum (speed-matched) into a bento of the three numbers rolling like odometers (ring,
//                streaming status pills, stopwatch); the blue 96.8% tile lifts, tilts and floods the frame into H2Blue
//                while its number zooms through the camera.
// Hand-offs: H1Card as is 5.00-5.25, then the panel grows out of it; H2Blue as is 9.75-10.00.
import React from "react";
import { B, SANS, MONO, SHADOW, clamp, mix, ease, inout, spring, bounce, BounceWords, H1, H1Card, H2Blue } from "../kit";

// ---------- helpers ----------
type Key = [number, number];
// a smooth keyframe track (cubic Hermite, Catmull-Rom tangents, at rest at both ends): continuous speed, no stops
const track = (keys: Key[]) => (t: number) => {
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1];
  if (t >= keys[n - 1][0]) return keys[n - 1][1];
  let i = 0;
  while (t > keys[i + 1][0]) i++;
  const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
  const h = t1 - t0, u = (t - t0) / h, u2 = u * u, u3 = u2 * u;
  const sl = (a: number, b: number) => (keys[b][1] - keys[a][1]) / (keys[b][0] - keys[a][0]);
  const m0 = i === 0 ? 0 : sl(i - 1, i + 1), m1 = i + 1 === n - 1 ? 0 : sl(i, i + 2);
  return (2 * u3 - 3 * u2 + 1) * v0 + (u3 - 2 * u2 + u) * h * m0 + (-2 * u3 + 3 * u2) * v1 + (u3 - u2) * h * m1;
};
// a damped spring that starts displaced by x0 and moving at v0 (px/s), returns the displacement (speed-matched entries)
const springFrom = (x0: number, v0: number, tau: number, response = 0.6, damping = 0.78) => {
  if (tau <= 0) return x0;
  const w = (2 * Math.PI) / response, z = damping, wd = w * Math.sqrt(1 - z * z);
  return Math.exp(-z * w * tau) * (x0 * Math.cos(wd * tau) + ((v0 + z * w * x0) / wd) * Math.sin(wd * tau));
};
const fmt = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${s}s`);
const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, ...extra });

// ---------- icons (SVG, so no font fallbacks) ----------
type IconName = "lead" | "support" | "invoice" | "proposal" | "person" | "check" | "warn";
const Icon: React.FC<{ name: IconName; size: number; color: string; bg?: string }> = ({ name, size, color, bg = "#fff" }) => {
  const st = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
      {name === "lead" && <path d="M13.2 2.5 5 13.6h6.3l-1 7.9 8.3-11.2h-6.3z" fill={color} stroke={color} strokeWidth={1.2} strokeLinejoin="round" />}
      {name === "support" && <><path d="M4.5 4.5h15a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H10l-4.5 3.6v-3.6h-1a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2z" {...st} /><path d="M8 10.8h.01M12 10.8h.01M16 10.8h.01" {...st} strokeWidth={2.8} /></>}
      {name === "invoice" && <><path d="M6 2.8h12v18.4l-3-2-3 2-3-2-3 2z" {...st} /><path d="M9 7.5h6M9 11h6M9 14.5h3.5" {...st} /></>}
      {name === "proposal" && <><path d="M14 2.8H7a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.8z" {...st} /><path d="M14 2.8v5h5M8.8 12.5h6.4M8.8 16.3h4.2" {...st} /></>}
      {name === "person" && <><circle cx={12} cy={8.2} r={4.3} fill={color} /><path d="M3.6 21.4c0-4.8 3.8-8.1 8.4-8.1s8.4 3.3 8.4 8.1z" fill={color} /></>}
      {name === "check" && <path d="M5 12.6l4.4 4.4L19 7.4" {...st} strokeWidth={2.8} />}
      {name === "warn" && <><path d="M12 3.2 22.2 20.6H1.8z" fill={color} stroke={color} strokeWidth={1.6} strokeLinejoin="round" /><path d="M12 9.6v4.8" stroke={bg} strokeWidth={2.2} strokeLinecap="round" /><circle cx={12} cy={17.3} r={1.25} fill={bg} /></>}
    </svg>
  );
};

// ---------- shot 4/5 geometry (stage = the H1 card's box, 1200 x 680 at 360,200) ----------
const ROW_X = 36, ROW_W = 1128, ROW_H = 114, ROW_TOP = 130, ROW_STEP = 128, BAR_H = 96;
type Row = { title: string; agent: string; status: string; ok: boolean; secs: number; icon: IconName; at: number };
const ROWS: Row[] = [
  { title: "Qualify inbound lead — ACME Roofing", agent: "Lead Response", status: "Routed to sales", ok: true, secs: 38, icon: "lead", at: 5.42 },
  { title: "Ticket #4812 — billing question", agent: "Support Triage", status: "Resolved", ok: true, secs: 72, icon: "support", at: 5.64 },
  { title: "Invoice #2207 — 14 days overdue", agent: "Collections", status: "Reminder sent", ok: true, secs: 22, icon: "invoice", at: 5.86 },
  { title: "Proposal draft — discovery call", agent: "Proposals", status: "Human review", ok: false, secs: 243, icon: "proposal", at: 6.08 },
];
const AMBER_BG = "#FFF9E9";   // 10% amber over white
// frosted glass without backdrop-filter (which mis-clips inside the 3D stage): where a dropping row is over the navy
// bar, its fill is the bar seen through frosted white; below the bar edge it is the row's own white
const FROST = "rgb(132, 138, 148)";
const frost = (edge: number, base: string, s = 1) => {
  if (edge <= -16) return base;
  const top = edge - BAR_H / s;   // the card's top edge: above it the row is over the light background
  return `linear-gradient(to bottom, #EDF0F5 0px, #EDF0F5 ${top - 10}px, ${FROST} ${top + 10}px, ${FROST} ${edge - 12}px, ${base} ${edge + 12}px, ${base} 100%)`;
};
const rowState = (i: number, t: number) => {
  let slot = 0;
  for (let j = i + 1; j < ROWS.length; j++) slot += spring(t, ROWS[j].at, 0.44, 0.66);
  const e = spring(t, ROWS[i].at, 0.5, 0.66);
  return { y: ROW_TOP + slot * ROW_STEP - (1 - e) * 240, e, sc: 0.9 + 0.1 * e };
};
const pillPop = (t: number, r: Row) => bounce(t, r.at + 0.16, 0.42);
const secsAt = (t: number, r: Row) => Math.round(r.secs * ease((t - r.at - 0.06) / 0.62));

const Pill: React.FC<{ ok: boolean; text: string; font: number; h: number; width?: number }> = ({ ok, text, font, h, width }) => (
  <div style={{ height: h, width, padding: width ? 0 : `0 ${h * 0.38}px`, borderRadius: h / 2, display: "flex", alignItems: "center", justifyContent: "center", gap: h * 0.18, boxSizing: "border-box",
    background: ok ? "rgba(52,211,153,0.18)" : "rgba(251,191,36,0.26)", color: ok ? B.greenInk : B.amberInk, fontFamily: SANS, fontWeight: 600, fontSize: font, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
    <Icon name={ok ? "check" : "warn"} size={font * 0.95} color={ok ? B.greenInk : B.amberInk} bg={AMBER_BG} />{text}
  </div>
);

// one task row in the panel (rows 0-2; the amber row lives in the expand layer)
const PanelRow: React.FC<{ r: Row; i: number; t: number }> = ({ r, i, t }) => {
  const { y, e, sc } = rowState(i, t);
  const dim = spring(t, 6.34, 0.5, 0.9);   // the others recede when the amber row opens
  const pp = pillPop(t, r);
  const s = sc * (1 - 0.05 * dim);
  const barEdge = (BAR_H - (y + dim * 40 + (ROW_H * (1 - s)) / 2)) / s;   // the bar's lower edge, in row coords
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: ROW_W, height: ROW_H, transformOrigin: "50% 50%", transform: `translate(${ROW_X}px, ${y + dim * 40}px) scale(${s})`,
      opacity: clamp(e * 4) * (1 - 0.55 * dim), borderRadius: 24, background: frost(barEdge, "#F8FAFD", s), boxShadow: `inset 0 0 0 1.5px ${B.line}, 0 26px 44px -24px rgba(11,18,32,${0.45 * clamp(1 - e)})`, fontFamily: SANS }}>
      <div style={abs(24, 23, { width: 68, height: 68, borderRadius: 18, background: "rgba(37,99,235,0.10)", display: "flex", alignItems: "center", justifyContent: "center" })}><Icon name={r.icon} size={36} color={B.blue} /></div>
      <div style={abs(114, 20, { fontSize: 29, lineHeight: 1.2, fontWeight: 600, color: B.navy, letterSpacing: "-0.01em", whiteSpace: "nowrap" })}>{r.title}</div>
      <div style={abs(114, 62, { fontSize: 26, lineHeight: 1.2, fontWeight: 500, color: B.muted, whiteSpace: "nowrap" })}>{r.agent}</div>
      <div style={abs(ROW_W - 156 - 360, 33, { width: 360, display: "flex", justifyContent: "flex-end" })}>
        <div style={{ transform: `scale(${0.3 + 0.7 * pp})`, opacity: clamp(pp * 3), transformOrigin: "70% 50%" }}><Pill ok={r.ok} text={r.status} font={26} h={48} /></div>
      </div>
      <div style={abs(ROW_W - 26 - 112, 39, { width: 112, textAlign: "right", fontSize: 30, lineHeight: 1.2, fontWeight: 700, color: B.navy, fontVariantNumeric: "tabular-nums", opacity: clamp((t - r.at - 0.04) * 8) })}>{fmt(secsAt(t, r))}</div>
    </div>
  );
};

const TITLE = "tnoa ~ agent activity";
const TitleBar: React.FC<{ t: number }> = ({ t }) => {
  const bar = spring(t, 5.25, 0.5, 0.8);
  const typed = Math.floor(clamp((t - 5.3) / 0.34) * TITLE.length);
  const live = bounce(t, 5.36, 0.45);
  const pulse = ((t - 5.36) / 0.9) % 1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: BAR_H, borderRadius: "40px 40px 0 0", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -40, width: 1200, height: BAR_H + 40, background: B.navy, transform: `translateY(${(bar - 1) * (BAR_H + 4)}px)` }}>
        {[0, 1, 2].map((k) => { const d = bounce(t, 5.28 + k * 0.04, 0.4); return <div key={k} style={abs(36 + k * 30, 40 + 40, { width: 16, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.26)", transform: `translate(${36 + k * 30}px, ${80}px) scale(${d})` })} />; })}
        <div style={abs(150, 40 + 28, { fontFamily: MONO, fontSize: 30, lineHeight: "40px", color: B.white, whiteSpace: "pre" })}>
          {TITLE.slice(0, typed)}<span style={{ display: "inline-block", width: 14, height: 30, marginLeft: 3, verticalAlign: "-4px", background: B.sky, opacity: t < 5.8 && Math.floor(t * 7) % 2 === 0 ? 1 : 0 }} />
        </div>
        <div style={abs(1200 - 40 - 132, 40 + 24, { width: 132, height: 48, borderRadius: 24, background: "rgba(52,211,153,0.16)", boxShadow: "inset 0 0 0 1.5px rgba(52,211,153,0.45)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          transform: `translate(${1200 - 40 - 132}px, ${64}px) scale(${live})`, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: B.green })}>
          <div style={{ position: "relative", width: 14, height: 14 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 7, background: B.green, transform: `scale(${1 + 1.6 * Math.max(0, pulse)})`, opacity: t > 5.36 ? 0.5 * (1 - pulse) : 0 }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: 7, background: B.green }} />
          </div>Live
        </div>
      </div>
    </div>
  );
};

// ---------- shot 5: the amber row that becomes the review card ----------
const EX = -108, EY = -56, EW = 1416, EH = 792, M = 60;            // the expanded card in stage coords (x1.2 on screen)
const BX = EX - M, BY = EY - M, BW = EW + 2 * M, BH = EH + 2 * M;  // its static box (room to overshoot)
const NODE = 210, PAIR_Y = 420, AX = 475, EXX = 725;               // agent and engineer centres when joined
const PILL_W = 244, PILL_K = 30 / 26;
// a tighter version of the kit shadow for the big card: a crisper edge that holds up under compression while it drifts
const CARD_SHADOW = "0 2px 6px rgba(11,18,32,0.07), 0 28px 56px -26px rgba(11,18,32,0.34)";                               // the amber pill (row size) and its card scale

// metaball bridge between two circles (Varun Vachhar's construction): the liquid join
const metaball = (r1: number, r2: number, c1: [number, number], c2: [number, number], v = 0.5, handle = 2.4) => {
  const d = Math.hypot(c2[0] - c1[0], c2[1] - c1[1]);
  if (d > r1 + r2 * 2.5 || d <= Math.abs(r1 - r2)) return "";
  let u1 = 0, u2 = 0;
  if (d < r1 + r2) {
    u1 = Math.acos((r1 * r1 + d * d - r2 * r2) / (2 * r1 * d));
    u2 = Math.acos((r2 * r2 + d * d - r1 * r1) / (2 * r2 * d));
  }
  const ang = Math.atan2(c2[1] - c1[1], c2[0] - c1[0]);
  const spread = Math.acos((r1 - r2) / d);
  const a1 = ang + u1 + (spread - u1) * v, a2 = ang - u1 - (spread - u1) * v;
  const a3 = ang + Math.PI - u2 - (Math.PI - u2 - spread) * v, a4 = ang - Math.PI + u2 + (Math.PI - u2 - spread) * v;
  const P = (c: [number, number], a: number, r: number): [number, number] => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  const p1 = P(c1, a1, r1), p2 = P(c1, a2, r1), p3 = P(c2, a3, r2), p4 = P(c2, a4, r2);
  const dd = Math.min(v * handle, Math.hypot(p1[0] - p3[0], p1[1] - p3[1]) / (r1 + r2)) * Math.min(1, (d * 2) / (r1 + r2));
  const H = Math.PI / 2;
  const h1 = P(p1, a1 - H, r1 * dd), h2 = P(p2, a2 + H, r1 * dd), h3 = P(p3, a3 + H, r2 * dd), h4 = P(p4, a4 - H, r2 * dd);
  const f = (p: [number, number]) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  return `M ${f(p1)} C ${f(h1)} ${f(h3)} ${f(p3)} A ${r2} ${r2} 0 ${d > r1 ? 1 : 0} 0 ${f(p4)} C ${f(h4)} ${f(h2)} ${f(p2)} Z`;
};

const Chip: React.FC<{ text: string; dot?: string }> = ({ text, dot }) => (
  <div style={{ height: 56, padding: "0 24px", borderRadius: 28, background: B.white, boxShadow: `inset 0 0 0 1.5px ${B.line}, 0 10px 24px -14px rgba(11,18,32,0.35)`, display: "flex", alignItems: "center", gap: 10,
    fontFamily: SANS, fontWeight: 600, fontSize: 28, color: B.navy, whiteSpace: "nowrap" }}>
    {dot && <div style={{ width: 12, height: 12, borderRadius: 6, background: dot }} />}{text}
  </div>
);

const ReviewCard: React.FC<{ t: number }> = ({ t }) => {
  const r = ROWS[3];
  const rs0 = rowState(3, t);
  const lift = spring(t, 6.21, 0.42, 0.6);
  const rs = rs0.sc * (1 + 0.04 * lift);
  const rect0 = { x: 600 - (ROW_W * rs) / 2, y: rs0.y + ROW_H / 2 - (ROW_H * rs) / 2, w: ROW_W * rs, h: ROW_H * rs, r: 24 * rs };
  const p = spring(t, 6.38, 0.62, 0.8);
  const rect = { x: mix(rect0.x, EX, p), y: mix(rect0.y, EY, p), w: mix(rect0.w, EW, p), h: mix(rect0.h, EH, p), r: mix(rect0.r, 48, p) };
  const top = rect.y;
  const clip = `inset(${top - BY}px ${BX + BW - rect.x - rect.w}px ${BY + BH - rect.y - rect.h}px ${rect.x - BX}px round ${rect.r}px)`;
  const RX = (lx: number) => rect0.x + lx * rs, RY = (ly: number) => rect0.y + ly * rs;
  const L = (x: number, y: number, s: number, extra: React.CSSProperties = {}): React.CSSProperties =>
    ({ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${x - BX}px, ${y - BY}px) scale(${s})`, ...extra });
  const opacity = clamp(rs0.e * 4);
  // phase C: the top content leaves, the pair rises, the line bounces in
  const q = spring(t, 7.06, 0.5, 0.82), q2 = spring(t, 7.1, 0.62, 0.74);
  const up = -110 * q;
  const x0 = EX + 72;
  // the elements' morphs (the pill rises first, then slides, so it never crosses the title)
  const pT = spring(t, 6.38, 0.52, 0.8), pS = spring(t, 6.41, 0.52, 0.8), pPy = spring(t, 6.34, 0.44, 0.8), pPx = spring(t, 6.4, 0.54, 0.8), pM = spring(t, 6.38, 0.52, 0.8);
  const pop = pillPop(t, r);
  const pillS0 = (rs / PILL_K) * (0.3 + 0.7 * pop);
  const pW = PILL_W * PILL_K, pH = 48 * PILL_K;
  const pillX0 = RX(ROW_W - 156 - PILL_W) + (pW * (rs / PILL_K) - pW * pillS0) * 0.7, pillY0 = RY(33) + (pH * (rs / PILL_K) - pH * pillS0) / 2;
  // the icon -> agent node
  const pi = spring(t, 6.4, 0.62, 0.74);
  const bob = Math.sin((t - 6.74) * 3.4) * 9 * clamp((t - 6.74) * 2);
  const pairDY = -230 * q2 + bob;
  const nS = mix((68 / NODE) * rs, 1, pi);
  const nX = mix(RX(24), AX - NODE / 2, pi), nY = mix(RY(23), PAIR_Y - NODE / 2, pi) + pairDY * pi;
  const nRad = mix((18 * NODE) / 68, NODE / 2, pi);
  // the engineer slides in and docks
  const ee = spring(t, 6.66, 0.55, 0.7);
  const eCX = mix(1600, EXX, ee), eCY = PAIR_Y + pairDY;
  const aC: [number, number] = [nX + (NODE * nS) / 2, nY + (NODE * nS) / 2], eC: [number, number] = [eCX, eCY];
  const bridgeOn = clamp((pi - 0.85) / 0.15) * clamp((340 - (eCX - aC[0])) / 50);
  const path = bridgeOn > 0 ? metaball((NODE * nS) / 2, NODE / 2, aC, eC, 0.5) : "";
  const lab1 = bounce(t, 6.82, 0.45), lab2 = bounce(t, 6.98, 0.45), badge = bounce(t, 7.04, 0.45);
  const ring = clamp((t - 6.78) / 0.5);
  const secs = secsAt(t, r);
  return (
    <>
      {/* shadow (scaled with the card) */}
      <div style={{ position: "absolute", left: EX, top: EY, width: EW, height: EH, borderRadius: 48, boxShadow: CARD_SHADOW, transformOrigin: "0 0", opacity: clamp(lift * 0.8 + p + 0.6 * (1 - clamp(rs0.e))) * opacity,
        transform: `translate(${rect.x - EX}px, ${rect.y - EY}px) scale(${rect.w / EW}, ${rect.h / EH})` }} />
      <div style={{ position: "absolute", left: BX, top: BY, width: BW, height: BH, clipPath: clip, opacity, background: p > 0 ? `rgb(255, ${Math.round(mix(249, 255, p))}, ${Math.round(mix(233, 255, p))})` : frost(BAR_H - BY, AMBER_BG), fontFamily: SANS }}>
        {/* top content: pill, title, agent, time */}
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${up}px)`, opacity: 1 - clamp(q * 1.7) }}>
          <div style={L(mix(pillX0, x0, pPx), mix(pillY0, EY + 60, pPy), mix(pillS0, 1, pPx))}><Pill ok={false} text={r.status} font={30} h={pH} width={pW} /></div>
          <div style={L(mix(RX(114), x0, pT), mix(RY(20), EY + 140, pT), mix((29 / 58) * rs, 1, pT), { fontSize: 58, lineHeight: 1.2, fontWeight: 700, color: B.navy, letterSpacing: "-0.025em", whiteSpace: "nowrap" })}>{r.title}</div>
          <div style={L(mix(RX(114), x0, pS), mix(RY(62), EY + 216, pS), mix((26 / 32) * rs, 1, pS), { fontSize: 32, lineHeight: 1.2, fontWeight: 500, color: B.muted, whiteSpace: "nowrap" })}>{r.agent}</div>
          <div style={L(mix(RX(ROW_W - 26 - 112), EX + EW - 72 - 150 * 1.5, pM), mix(RY(39), EY + 50, pM), mix(0.75 * rs, 1.5, pM), { width: 150, textAlign: "right", fontSize: 40, lineHeight: 1.2, fontWeight: 700, color: B.navy, fontVariantNumeric: "tabular-nums", opacity: clamp((t - r.at - 0.04) * 8) })}>{fmt(secs)}</div>
        </div>
        {/* the bridge (liquid join) */}
        {path && (
          <svg width={BW} height={BH} viewBox={`${BX} ${BY} ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0, opacity: bridgeOn }}>
            <defs><linearGradient id="bridgeG" x1={aC[0]} x2={eC[0]} y1={0} y2={0} gradientUnits="userSpaceOnUse"><stop offset="0.3" stopColor={B.blue} /><stop offset="0.7" stopColor={B.navy} /></linearGradient></defs>
            <path d={path} fill="url(#bridgeG)" />
          </svg>
        )}
        {/* agent node (was the row icon) */}
        <div style={L(nX, nY, nS, { width: NODE, height: NODE, borderRadius: nRad, overflow: "hidden", boxShadow: `0 30px 60px -24px rgba(37,99,235,${0.55 * pi})` })}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(37,99,235,0.10)", opacity: 1 - pi }} />
          <div style={{ position: "absolute", inset: 0, background: B.blue, opacity: pi }} />
          <div style={{ position: "absolute", left: 50, top: 50, opacity: 1 - pi }}><Icon name="proposal" size={110} color={B.blue} /></div>
          <div style={{ position: "absolute", left: 50, top: 50, opacity: pi }}><Icon name="proposal" size={110} color={B.white} /></div>
        </div>
        {/* the vetted engineer (a review ring sweeps around the avatar as it docks) */}
        <div style={L(eCX - NODE / 2, eCY - NODE / 2, 1, { width: NODE, height: NODE, borderRadius: NODE / 2, background: B.navy, boxShadow: "0 30px 60px -24px rgba(11,18,32,0.6)" })}>
          <div style={{ position: "absolute", left: 43, top: 36 }}><Icon name="person" size={124} color={B.white} /></div>
          <svg width={NODE + 40} height={NODE + 40} viewBox="-125 -125 250 250" style={{ position: "absolute", left: -20, top: -20, overflow: "visible" }}>
            <circle r={117} fill="none" stroke={B.green} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 117}`} strokeDashoffset={2 * Math.PI * 117 * (1 - ease(ring))} transform="rotate(-90)" opacity={ring > 0 ? 1 - clamp((t - 7.45) * 3) : 0} />
          </svg>
          <div style={{ position: "absolute", right: 8, bottom: 10, width: 42, height: 42, borderRadius: 21, background: B.green, boxShadow: `0 0 0 6px ${B.white}` }} />
        </div>
        {/* badge on the join */}
        <div style={L((aC[0] + eC[0]) / 2 - 44 * badge, PAIR_Y + pairDY - 44 * badge, badge, { width: 88, height: 88, borderRadius: 44, background: B.white, boxShadow: "0 14px 30px -12px rgba(11,18,32,0.45)", display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp(badge * 3) })}>
          <Icon name="check" size={52} color={B.greenInk} />
        </div>
        {/* labels */}
        <div style={L(AX - 200 * lab1, PAIR_Y + 160 + pairDY - 28 * lab1, lab1, { width: 400, display: "flex", justifyContent: "center", opacity: clamp(lab1 * 3) })}><Chip text="AI agent" dot={B.blue} /></div>
        <div style={L(EXX - 200 * lab2, PAIR_Y + 160 + pairDY - 28 * lab2, lab2, { width: 400, display: "flex", justifyContent: "center", opacity: clamp(lab2 * 3) })}><Chip text="Vetted engineer" dot={B.green} /></div>
        {/* the line */}
        {t > 7.08 && <BounceWords t={t} at={7.1} text="A vetted engineer" cx={600 - BX} y={396 - BY} size={102} stagger={0.018} />}
        {t > 7.2 && <BounceWords t={t} at={7.22} text="stays accountable." cx={600 - BX} y={503 - BY} size={102} stagger={0.018} accentFrom={6} />}
      </div>
      {/* hairline */}
      <svg width={BW} height={BH} viewBox={`${BX} ${BY} ${BW} ${BH}`} style={{ position: "absolute", left: BX, top: BY, opacity, overflow: "visible" }}>
        <rect x={rect.x + 0.75} y={top + 0.75} width={rect.w - 1.5} height={rect.h - (top - rect.y) - 1.5} rx={rect.r} fill="none"
          stroke={p < 0.5 ? "rgba(251,191,36,0.6)" : B.line} strokeOpacity={p < 0.5 ? 1 - p * 2 : (p - 0.5) * 2} strokeWidth={1.5} />
      </svg>
    </>
  );
};

// ---------- the stage (shots 4-5) ----------
const S_RY = track([[5.0, 6], [5.25, 3], [5.75, -5], [6.25, -9], [6.75, -3], [7.15, 5], [7.65, -4], [8.05, 1], [8.4, -3]]);
const S_RX = track([[5.0, 4], [5.25, 2], [5.75, -3], [6.25, 3.5], [6.75, 1], [7.15, -3], [7.65, 2], [8.05, -1], [8.4, 4]]);
const S_TX = track([[5.25, 0], [5.75, 20], [6.25, -40], [6.8, 0], [8.05, 0]]);
const S_TY = track([[5.0, -60], [5.25, 0], [5.62, 130], [6.0, 110], [6.4, 20], [6.8, 0], [7.15, 30], [7.8, -60], [8.4, -300]]);
const S_S = track([[5.0, 0.86], [5.25, 1], [5.6, 1.24], [6.0, 1.3], [6.35, 1.2], [6.75, 1.18], [7.15, 1.31], [7.6, 1.21], [8.05, 1.27], [8.4, 1.32]]);
const stageTransform = (t: number) => {
  const k = ease((t - 5.25) / 0.4);
  const hry = Math.sin((t - H1) * 2.4) * 5, hrx = Math.cos((t - H1) * 2) * 3, hty = Math.sin((t - H1) * 3) * 10;
  const ry = mix(hry, S_RY(t), k); let rx = mix(hrx, S_RX(t), k), ty = mix(hty, S_TY(t), k), s = mix(1, S_S(t), k);
  const tx = S_TX(t) * k;
  const x = clamp((t - 8.03) / 0.32), push = x * x * x;
  ty -= 1350 * push; rx += 12 * push; s *= 1 - 0.05 * push;
  return `perspective(1800px) rotateY(${ry}deg) rotateX(${rx}deg) translateY(${ty}px) translateX(${tx}px) scale(${s})`;
};

const Stage: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 680, transform: stageTransform(t) }}>
    {/* a hair of 2D rotation makes Chrome draw text and box edges unsnapped inside the 3D layer (no stepping) */}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 680, transform: "rotate(0.03deg)" }}>
      {t < 7.0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 680, borderRadius: 40, background: B.white, boxShadow: `inset 0 0 0 1.5px rgba(226,232,241,${clamp((t - 5.25) / 0.2)}), ${SHADOW}` }} />}
      {t < 7.0 && <TitleBar t={t} />}
      {/* the rows drop in over the bar like notifications and push the others down */}
      {t < 7.0 && ROWS.slice(0, 3).map((r, i) => (t > r.at - 0.02 ? <PanelRow key={i} r={r} i={i} t={t} /> : null))}
      {t > ROWS[3].at - 0.02 && <ReviewCard t={t} />}
    </div>
  </div>
);

// ---------- shot 6: the bento ----------
const TA = { x: 140, y: 160, w: 790, h: 780 }, TB = { x: 970, y: 160, w: 810, h: 370 }, TC = { x: 970, y: 570, w: 810, h: 370 };
const V_IN = -12000;   // matches the outgoing stage's speed (px/s)
const tileDY = (t: number, at: number) => springFrom(1180, V_IN, t - at, 0.6, 0.78);
const FADE_V = "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)";

// odometer: each digit spins through whole turns, overshoots a little and settles exactly
const rollIdx = (t: number, t0: number, total: number, D = 0.62) => {
  const x = clamp((t - t0) / D);
  return total * (1 - Math.pow(1 - x, 4)) + 0.3 * Math.sin(Math.PI * clamp((x - 0.5) / 0.5));
};
// Proportional digits: each column is as wide as its final digit (a hidden copy sets the width), so the settled
// number reads like normal text; the tracking is a negative margin so no glyph is clipped by its column.
const Odo: React.FC<{ text: string; t: number; at: number; size: number; color: string; stagger?: number; layer?: boolean }> = ({ text, t, at, size, color, stagger = 0.04, layer = true }) => {
  const H = Math.round(size * 1.16);
  let di = 0;
  return (
    <div style={{ display: "flex", fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: `${H}px`, height: H, color, whiteSpace: "pre" }}>
      {text.split("").map((ch, i) => {
        if (!/\d/.test(ch)) return <span key={i} style={{ display: "inline-block", marginRight: "-0.02em" }}>{ch === " " ? "\u00A0" : ch}</span>;
        const k = di++;
        const total = (1 + (k % 3)) * 10 + Number(ch);
        const idx = rollIdx(t, at + k * stagger, total);
        const base = Math.floor(idx);
        return (
          <span key={i} style={{ display: "inline-block", position: "relative", height: H, overflow: "hidden", marginRight: "-0.02em", WebkitMaskImage: FADE_V, maskImage: FADE_V }}>
            <span style={{ visibility: "hidden" }}>{ch}</span>
            {[-1, 0, 1, 2].map((o) => { const d = base + o; return d < 0 ? null : <span key={d} style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(d - idx) * H}px)`, willChange: layer ? "transform" : undefined }}>{d % 10}</span>; })}
          </span>
        );
      })}
    </div>
  );
};

const STATUS_TICKER: [string, boolean][] = [["Routed to sales", true], ["Resolved", true], ["Reminder sent", true]];
const G_X = track([[8.3, 9], [8.8, 1], [9.3, -6]]), G_Y = track([[8.3, -8], [8.8, 0], [9.3, 8]]);
const G_S = track([[8.3, 0.93], [9.3, 1.04]]), G_TY = track([[8.3, 30], [9.3, -24]]);

const Bento: React.FC<{ t: number }> = ({ t }) => {
  // the flood (9.22-9.70): the blue tile opens to the whole frame; its content zooms through until 9.75
  const f = inout((t - 9.18) / 0.52);
  const gk = 1 - f;
  const group = `perspective(2400px) rotateX(${G_X(t) * gk}deg) rotateY(${G_Y(t) * gk}deg) translateY(${G_TY(t) * gk}px) scale(${mix(1, G_S(t), gk)})`;
  const dA = tileDY(t, 8.19), dB = tileDY(t, 8.24), dC = tileDY(t, 8.29), dCap = tileDY(t, 8.17);
  const lift = spring(t, 9.0, 0.45, 0.55);
  const away = inout((t - 9.04) / 0.5);
  const sA = mix(1 + 0.04 * lift, 1, f);
  const inset = { t: mix(TA.y, -12, f), r: mix(1920 - TA.x - TA.w, -12, f), b: mix(1080 - TA.y - TA.h, -12, f), l: mix(TA.x, -12, f) };
  const acx = TA.x + TA.w / 2, acy = TA.y + TA.h / 2;
  const tileT = (d: number, cx: number, cy: number, extra = "") => ({ transformOrigin: `${cx}px ${cy}px`, transform: `perspective(1600px) translateY(${d}px) rotateX(${d * 0.012}deg) ${extra}` });
  const ring = 0.968 * ease((t - 8.3) / 0.75);
  const C = 2 * Math.PI * 105;
  const lA = bounce(t, 8.62, 0.5), lB = bounce(t, 8.74, 0.5), lC = bounce(t, 8.86, 0.5), chk = bounce(t, 8.96, 0.45);
  const tilt = spring(t, 9.0, 0.5, 0.7) * gk;
  const z = inout((t - 9.16) / 0.59);
  const contentOut: React.CSSProperties = { opacity: 1 - clamp((t - 9.34) / 0.41), transformOrigin: `${TA.x + 300}px ${TA.y + 560}px`, transform: `translate(${(960 - TA.x - 300) * z}px, ${(540 - TA.y - 560) * z}px) scale(${1 + 2.4 * z})` };
  const tick = (t - 8.25) * 200;
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: group }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: `rotate(${0.03 * gk}deg)` }}>
      {/* caption */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 160, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateY(${dCap}px)`, opacity: 1 - away,
        fontFamily: MONO, fontSize: 32, color: B.muted }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: B.green, boxShadow: "0 0 0 6px rgba(52,211,153,0.2)" }} />tnoa ~ agent activity
      </div>
      {/* tile B: 312 leads, with the routed leads streaming past */}
      <div style={{ position: "absolute", left: TB.x, top: TB.y, width: TB.w, height: TB.h, borderRadius: 44, background: B.white, boxShadow: `inset 0 0 0 1.5px ${B.line}, ${SHADOW}`, overflow: "hidden",
        ...tileT(dB, TB.w / 2, TB.h / 2, `translateX(${away * 520}px) scale(${1 - 0.12 * away})`) }}>
        <div style={abs(56, 46)}><Odo text="312" t={t} at={8.26} size={170} color={B.navy} /></div>
        <div style={abs(62, 262, { fontFamily: SANS, fontWeight: 500, fontSize: 34, color: B.muted, opacity: clamp(lB * 2), transform: `translate(62px, ${262 + (1 - lB) * 30}px)` })}>Leads handled today</div>
        <div style={{ position: "absolute", left: 470, top: 22, width: 310, height: 326, overflow: "hidden",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)" }}>
          {Array.from({ length: 8 }, (_, i) => {
            const y = ((i * 66 - tick) % 528 + 528) % 528 - 66;
            const [s, ok] = STATUS_TICKER[i % 3];
            return <div key={i} style={{ position: "absolute", right: 0, top: 0, transform: `translateY(${y}px)`, willChange: "transform" }}><Pill ok={ok} text={s} font={26} h={50} /></div>;
          })}
        </div>
      </div>
      {/* tile C: 2m 41s, with a stopwatch */}
      <div style={{ position: "absolute", left: TC.x, top: TC.y, width: TC.w, height: TC.h, borderRadius: 44, background: B.white, boxShadow: `inset 0 0 0 1.5px ${B.line}, ${SHADOW}`, overflow: "hidden",
        ...tileT(dC, TC.w / 2, TC.h / 2, `translateX(${away * 580}px) scale(${1 - 0.12 * away})`) }}>
        <div style={abs(56, 62)}><Odo text="2m 41s" t={t} at={8.31} size={136} color={B.navy} /></div>
        <div style={abs(62, 262, { fontFamily: SANS, fontWeight: 500, fontSize: 34, color: B.muted, opacity: clamp(lC * 2), transform: `translate(62px, ${262 + (1 - lC) * 30}px)` })}>Avg. response time</div>
        <svg width={200} height={220} viewBox="-100 -118 200 220" style={{ position: "absolute", left: 582, top: 78, overflow: "visible" }}>
          <rect x={-15} y={-117} width={30} height={20} rx={7} fill={B.navy} />
          <circle r={84} fill="none" stroke={B.line} strokeWidth={12} />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-60} x2={0} y2={-70} stroke={B.light} strokeWidth={5} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
          <circle r={84} fill="none" stroke={B.blue} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 84}`} strokeDashoffset={2 * Math.PI * 84 * (1 - 0.894 * ease((t - 8.5) / 0.9))} transform="rotate(-90)" />
          <line x1={0} y1={12} x2={0} y2={-60} stroke={B.navy} strokeWidth={7} strokeLinecap="round" transform={`rotate(${(t - 8.4) * 320})`} />
          <circle r={10} fill={B.navy} />
        </svg>
      </div>
      {/* tile A: 96.8% (a full-frame blue box clipped to the tile; it floods the frame) */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${inset.t}px ${inset.r}px ${inset.b}px ${inset.l}px round ${mix(48, 0, f)}px)`,
        ...tileT(dA * gk, acx, acy, `rotateY(${-9 * tilt}deg) scale(${sA})`) }}>
        <H2Blue t={t} />
        <div style={{ position: "absolute", inset: 0, ...contentOut }}>
          <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ position: "absolute", left: TA.x + 60, top: TA.y + 60 }}>
            <circle r={105} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={26} />
            <circle r={105} fill="none" stroke={B.white} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${C}`} strokeDashoffset={C * (1 - ring)} transform="rotate(-90)" />
          </svg>
          <div style={{ position: "absolute", left: TA.x + 60 + 130 - 40, top: TA.y + 60 + 130 - 40, transform: `scale(${chk})`, opacity: clamp(chk * 3) }}><Icon name="check" size={80} color={B.white} /></div>
          <div style={abs(TA.x + 56, TA.y + 420)}><Odo text="96.8%" t={t} at={8.21} size={210} color={B.white} layer={false} /></div>
          <div style={abs(TA.x + 64, TA.y + 680, { fontFamily: SANS, fontWeight: 500, fontSize: 38, color: "rgba(255,255,255,0.88)", opacity: clamp(lA * 2), transform: `translate(${TA.x + 64}px, ${TA.y + 680 + (1 - lA) * 30}px)` })}>Resolved without escalation</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export const SegB: React.FC<{ t: number }> = ({ t }) => {
  if (t < 5.25) return <H1Card t={t} />;          // hand-off H1, as is
  if (t >= 9.75) return <H2Blue t={t} />;         // hand-off H2, as is
  return (
    <>
      {t < 8.42 && <Stage t={t} />}
      {t > 8.15 && <Bento t={t} />}
    </>
  );
};
