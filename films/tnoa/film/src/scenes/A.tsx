// Segment A (0-5 s): the hook and the network.
//  1  0.00-1.42  "Deploy AI agents / that deliver." builds letter by letter; the full stop drops, bounces, lands,
//                and its impact ripples through the words.
//  2  1.42-3.20  the full stop inhales, grows into the TNOA hub and blasts the words away; twelve agents spring out
//                on two rings in 3D (the disc tilts and turns), pulses run the spokes, six name chips pop,
//                "Production-Ready AI Agents" builds, green checks pop on four agents.
//  3  3.20-5.00  the camera dives at "Lead response", it is tapped and opens like an iPhone app into H1Card while
//                the rest of the network scatters out of frame (the last agent leaves on the last frame).
// Everything is a pure function of t (global seconds). Positions are transforms only.
import React from "react";
import { AbsoluteFill } from "remotion";
import { B, SANS, SHADOW, clamp, mix, ease, inout, spring, bounce, H1, H1Card } from "../kit";

const TAU = Math.PI * 2;
const sstep = (a: number, b: number, x: number) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };

// ---------------------------------------------------------------- timeline (s)
const T_L2 = 0.4;      // "that deliver" starts
const T_DROP = 0.84;   // the full stop starts to fall
const T_HUB = 1.42;    // the full stop blasts the words away and becomes the hub
const T_NODE = 1.47;   // agents spring out
const T_CHIP = 2.0;    // name chips
const T_TITLE = 2.4;   // "Production-Ready AI Agents"
const T_BADGE = 2.76;  // green checks
const T_PUSH = 3.2;    // camera dives at Lead response
const T_TAP = 3.53;    // the icon is pressed
const OPEN = 3.66;     // the icon opens into the card (blue splash), the network settles into orbit around it
const T_LABEL = 3.84;  // "Lead response" on the splash
const T_IRIS = 4.22;   // the white app blooms out of the splash
const T_FLY = 4.36;    // agents start to fly out (the last leaves on the segment's last frame)
const T_SET = 4.45;    // the card's size is final; its 3D turn eases in until the hand-off

// ---------------------------------------------------------------- shot 1 layout
const S1 = 150;
const L1 = "Deploy AI agents";
const L2 = "that deliver";
const L1_TOP = 370;
const LH = S1 * 1.05;
const L2_TOP = L1_TOP + LH;
const W1 = 1044;                 // measured ink width of line 1 (for the blast directions only)
const X2R = 1293;                // right edge of "that deliver" (its line box): line + full stop centred
const W2 = 705;                  // its measured ink width
// each letter's offset in its line and the line widths (DM Sans 700, 150 px, -0.035em; measured in Chrome)
const OX1 = [0, 97, 175, 261, 290, 369, 450, 475, 570, 599, 624, 700, 779, 857, 937, 986], LW1 = 1053;
const OX2 = [0, 49, 130, 206, 255, 279, 366, 444, 472, 504, 579, 657], LW2 = 705;
const BASE2 = L2_TOP + 130;      // baseline of line 2 (measured)
const DOT = 30;                  // the full stop
const DOT_X = X2R + 12 + DOT / 2;
const DOT_Y = BASE2 - DOT / 2;

// the headline's own camera: a pull-back that is already moving on the first frame, a 3D turn and a sideways track
// that keep going at a steady rate through the fall, and, as the full stop drops, a push in toward it (the full stop
// stays put while the words grow away from it)
const headCam = (t: number) => {
  const u = ease((t + 0.3) / 1.75), w = (t + 0.3) / 1.72;
  const g0 = mix(1.58, 1.0, u), x = Math.max(0, t - 0.8), z = 1 + 0.26 * (x / 0.62) * (x / 0.62);
  return { g: g0 * z, ry: mix(19, -11, w), gy: mix(96, 0, u) + mix(26, -26, w), dx: mix(120, -120, w), tx: (DOT_X - 960) * g0 * (1 - z), ty: (DOT_Y - 540) * g0 * (1 - z) };
};
// a point of the headline layer -> screen (CSS: perspective(2200) rotateY translate scale about 960,540)
const headMap = (t: number, X: number, Y: number) => {
  const { g, ry, gy, dx, tx, ty } = headCam(t), th = (ry * Math.PI) / 180;
  const x = (X - 960) * g + tx + dx, y = (Y - 540) * g + gy + ty;
  const k = 2200 / (2200 + x * Math.sin(th));
  return { x: 960 + x * Math.cos(th) * k, y: 540 + y * k, k: k * g };
};

// the full stop's fall: gravity from above the frame, two bounces with squash
const FALL = 0.3, H0 = DOT_Y + 70, G = (2 * H0) / (FALL * FALL);
const V1 = G * FALL, U1 = V1 * 0.3, TB1 = (2 * U1) / G, U2 = U1 * 0.3, TB2 = (2 * U2) / G;
const LAND1 = T_DROP + FALL, LAND2 = LAND1 + TB1, LAND3 = LAND2 + TB2;
const dotFall = (t: number) => {
  // height above the resting point (px) and vertical speed (px/s, + = down)
  if (t < T_DROP) return { h: H0 + 400, v: 0 };
  if (t < LAND1) { const x = t - T_DROP; return { h: H0 - 0.5 * G * x * x, v: G * x }; }
  if (t < LAND2) { const x = t - LAND1; return { h: U1 * x - 0.5 * G * x * x, v: -U1 + G * x }; }
  if (t < LAND3) { const x = t - LAND2; return { h: U2 * x - 0.5 * G * x * x, v: -U2 + G * x }; }
  return { h: 0, v: 0 };
};
const squash = (t: number) => {
  const hit = (t0: number, a: number) => { const x = t - t0; return x <= 0 ? 0 : a * Math.exp(-13 * x) * Math.cos((TAU * x) / 0.17); };
  return hit(LAND1, 0.5) + hit(LAND2, 0.22) + hit(LAND3, 0.08);
};

// ---------------------------------------------------------------- the network (3D)
const NX = 960, NY = 508;        // network centre once settled
const R_IN = 225, R_OUT = 400;
const PD = 1600;                 // perspective distance
const SPIN = 1.05;               // the disc's steady turn (rad/s)
const Z_SLOW = 0.08;             // the camera's slow push through shot 2
const N_IN = 100, N_OUT = 140;   // icon sizes: inner (navy, unnamed), outer (blue, named)

// the disc's turn: a whirl as the agents spring out, a steady turn, and faster again as it orbits the open card
const spin = (t: number) => { const x = Math.max(0, t - 1.4), y = Math.max(0, t - OPEN); return SPIN * x + 0.85 * (1 - Math.exp(-x / 0.33)) + 0.3 * y * y; };
const tilt = (t: number) => mix(0.16, 1.05, spring(t, 1.5, 1.1, 0.82)) + 0.05 * Math.sin(1.7 * (t - 1.4));
const yaw = (t: number) => mix(-0.34, 0.03, inout((t - 1.4) / 1.9)) + 0.045 * Math.sin(2.1 * (t - 1.4));
// the lead agent reaches the front of the disc as the icon opens
const LEAD_A = Math.PI / 2 - spin(OPEN) - 0.06;

type Agent = { key: string; name?: string; ring: 0 | 1; a: number; at: number; badge?: number };
const NAMED: [string, string][] = [["lead", "Lead response"], ["support", "Support triage"], ["voice", "Voice agents"], ["invoice", "Invoicing"], ["proposal", "Proposals"], ["schedule", "Scheduling"]];
const OTHERS = ["data", "report", "content", "email", "ads", "seo"];
const BADGE_ORDER: Record<number, number> = { 1: 0, 3: 1, 5: 2, 4: 3 };
const AGENTS: Agent[] = [
  ...NAMED.map(([key, name], k) => ({ key, name, ring: 1 as const, a: LEAD_A + (k * TAU) / 6, at: T_NODE + 0.12 + k * 0.04, badge: BADGE_ORDER[k] })),
  ...OTHERS.map((key, k) => ({ key, ring: 0 as const, a: LEAD_A + TAU / 12 + (k * TAU) / 6, at: T_NODE + k * 0.035 })),
];
const radius = (ag: Agent) => (ag.ring ? R_OUT : R_IN);
const grow = (t: number, ag: Agent) => spring(t, ag.at, 0.55, 0.58);

const Z_ORBIT = 1.55;           // the network's scale while it orbits the open card
const hubQ = (t: number) => spring(t, T_HUB + 0.03, 0.72, 0.8);
const hubPos = (t: number) => { const d = headMap(t, DOT_X, DOT_Y), q = hubQ(t); return { x: mix(d.x, NX, q), y: mix(d.y, NY, q) }; };

type Cam = { cx: number; cy: number; s: number; ct: number; st: number; cb: number; sb: number; Fx: number; Fy: number; Ax: number; Ay: number; Z: number };
// a point on the disc (x0, y0, already spun) -> screen, with its perspective scale k and depth z
const P = (c: Cam, x0: number, y0: number) => {
  const y1 = y0 * c.ct, z1 = -y0 * c.st;
  const x2 = x0 * c.cb + z1 * c.sb, z2 = -x0 * c.sb + z1 * c.cb;
  const k = PD / (PD + z2);
  const px = c.cx + x2 * k, py = c.cy + y1 * k;
  return { x: c.Ax + (px - c.Fx) * c.Z, y: c.Ay + (py - c.Fy) * c.Z, k: k * c.Z, z: z2 };
};
const polar = (r: number, a: number, s: number) => [r * Math.cos(a + s), r * Math.sin(a + s)] as const;

const camAt = (t: number): Cam => {
  const h = hubPos(t), s = spin(t), al = tilt(t), be = yaw(t);
  const base: Cam = { cx: h.x, cy: h.y, s, ct: Math.cos(al), st: Math.sin(al), cb: Math.cos(be), sb: Math.sin(be), Fx: 0, Fy: 0, Ax: 0, Ay: 0, Z: 1 };
  // the camera: a slow push through shot 2, then a dive at the lead agent, then on through the opening
  const e = inout((t - T_PUSH) / 0.5), o = inout((t - OPEN) / 0.62), lead = AGENTS[0];
  if (o > 0) { const al2 = al - 0.16 * o, be2 = be * (1 - o); base.ct = Math.cos(al2); base.st = Math.sin(al2); base.cb = Math.cos(be2); base.sb = Math.sin(be2); }
  const [lx, ly] = polar(R_OUT * grow(t, lead), lead.a, s);
  const lp = P(base, lx, ly);
  const z1 = Math.log(1 + Z_SLOW * ease((t - 1.6) / 1.6)) + Math.log(1.6) * e;
  const lnZ = mix(z1, Math.log(Z_ORBIT), o);
  return { ...base, Fx: mix(mix(h.x, lp.x, e), h.x, o), Fy: mix(mix(h.y, lp.y, e), h.y, o), Ax: mix(mix(h.x, 960, e), 960, o), Ay: mix(mix(h.y, 590, e), 545, o), Z: Math.exp(lnZ) };
};

// the scatter: one after another the agents fly straight out from the card, growing toward the camera; each one is
// timed to be fully out of frame 0.3 s after it starts, the last on the segment's last frame
const FLY_V = 300;                                    // px/s at launch
const flyGrow = (x: number) => 1 + 1.4 * x;
const FLIGHT = 0.3;
const restAt = (ag: Agent, t: number) => { const c = camAt(t); const [x0, y0] = polar(radius(ag) * grow(t, ag), ag.a, c.s); return P(c, x0, y0); };
const FLY_ORDER = [3, 9, 6, 1, 11, 4, 8, 2, 10, 5, 7];    // round the clock, alternating rings
const SCATTER = AGENTS.map((ag, i) => {
  const r = Math.max(0, FLY_ORDER.indexOf(i));
  const t0 = mix(T_FLY, H1 - FLIGHT, r / (FLY_ORDER.length - 1)), t1 = t0 + FLIGHT;
  const q0 = restAt(ag, t0), dx = q0.x - 960, dy = q0.y - 540, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
  const q = restAt(ag, t1), half = ((ag.ring ? N_OUT : N_IN) / 2) * q.k * flyGrow(FLIGHT) * 1.42;
  const cands: number[] = [];
  if (ux > 1e-3) cands.push((1920 + half - q.x) / ux); if (ux < -1e-3) cands.push((-half - q.x) / ux);
  if (uy > 1e-3) cands.push((1080 + half - q.y) / uy); if (uy < -1e-3) cands.push((-half - q.y) / uy);
  const need = Math.max(0, Math.min(...cands.filter((c) => c > 0)));
  return { t0, ux, uy, a: Math.max(2000, (need - FLY_V * FLIGHT) / (FLIGHT * FLIGHT)) };
});

// ---------------------------------------------------------------- glyphs (24-unit line icons, drawn white)
const ICON: Record<string, React.ReactNode> = {
  lead: <><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" /><path d="M19 8v6M16 11h6" /></>,
  support: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8M8 13h5" /></>,
  voice: <path d="M2 10v3M6 6v11M10 3v18M14 8v7M18 5v13M22 10v3" />,
  invoice: <><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M15 8h-4.5a1.75 1.75 0 0 0 0 3.5h3a1.75 1.75 0 0 1 0 3.5H9M12 6.5v10" /></>,
  proposal: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8" /></>,
  schedule: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M8 14h2M14 14h2M8 18h2" /></>,
  data: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" /></>,
  report: <path d="M3 3v16a2 2 0 0 0 2 2h16M18 17V9M13 17V5M8 17v-3" />,
  content: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  email: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  ads: <><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
  seo: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
};
const Glyph: React.FC<{ k: string; size: number; color?: string; sw?: number }> = ({ k, size, color = B.white, sw = 2 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>{ICON[k]}</svg>
);

const BLUE_GRAD = `linear-gradient(180deg, ${B.sky} 0%, ${B.blue} 100%)`;
const NAVY_GRAD = `linear-gradient(180deg, #1F2A40 0%, ${B.navy} 100%)`;

// ---------------------------------------------------------------- the opening card (lead icon -> H1Card)
// A static 1200 x 680 box at H1Card's place, scaled (non-uniformly) down to the icon; elliptical radii keep its
// corners round at every size. With m = 1, w = 1200, h = 680, centre (960, 540) it is H1Card exactly.
// While it changes size it stays a 2D transform: a box-shadow on a scaling 3D layer is re-rastered in steps (shake).
// iris > 0 opens a white circle of that radius (px on screen) out of the blue, from the card's centre.
const CardMorph: React.FC<{ t: number; cx: number; cy: number; w: number; h: number; r: number; blue: number; m: number; z: number; iris?: number }> = ({ t, cx, cy, w, h, r, blue, m, z, iris = 0 }) => {
  const sx = w / 1200, sy = h / 680;
  const turn = m > 0 ? `perspective(1800px) rotateY(${Math.sin((t - H1) * 2.4) * 5 * m}deg) rotateX(${Math.cos((t - H1) * 2) * 3 * m}deg) translateY(${Math.sin((t - H1) * 3) * 10 * m}px) ` : "";
  const tr = `${turn}translate(${cx - 960}px, ${cy - 540}px) scale(${sx}, ${sy})`;
  return (
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 680, borderRadius: `${r / sx}px / ${r / sy}px`, background: B.white, boxShadow: SHADOW, overflow: "hidden", transform: tr, zIndex: z }}>
      {blue > 0.001 && <div style={{ position: "absolute", inset: 0, background: BLUE_GRAD, opacity: blue }} />}
      {blue > 0.001 && iris > 0 && <div style={{ position: "absolute", left: 550, top: 290, width: 100, height: 100, borderRadius: 50, background: B.white, transform: `scale(${iris / 50 / sx}, ${iris / 50 / sy})` }} />}
    </div>
  );
};

// ---------------------------------------------------------------- shot 1: the headline
const Headline: React.FC<{ t: number }> = ({ t }) => {
  const { g, ry, gy, dx: cdx, tx, ty } = headCam(t);
  const blast = (lx: number, ly: number) => {
    const dx = lx - DOT_X, dy = ly - DOT_Y, d = Math.hypot(dx, dy) || 1;
    const x = t - T_HUB - 0.03 - d / 7000;
    if (x <= 0) return "";
    const ux = (dx / d) * 0.7, uy = -1, n = Math.hypot(ux, uy);
    const s = 1400 * x + 5600 * x * x;
    return `translate(${(ux / n) * s}px, ${(uy / n) * s}px) rotate(${(ux / n) * (40 * x + 260 * x * x)}deg) scale(${1 + 0.5 * x})`;
  };
  // the impact of the full stop ripples through the words as a hop (nearest letters first)
  const hop = (dist: number, amp: number) => {
    const one = (t0: number, a: number) => { const x = (t - t0 - dist * 0.017) / 0.24; return x <= 0 || x >= 1 ? 0 : a * Math.sin(Math.PI * x) * (1 - 0.35 * x); };
    return (one(LAND1, 34) + one(LAND2, 12)) * amp;
  };
  // a light glint sweeps along each line once it has built (left to right, slanted), as on an Apple hero title
  const glint = (ox: number, LW: number, gx: number, base: string, mid: string, core: string, bw: number) => ({
    color: "transparent", WebkitBackgroundClip: "text", backgroundClip: "text", backgroundSize: `${LW}px 100%`, backgroundPosition: `${-ox}px 0`, backgroundRepeat: "no-repeat",
    backgroundImage: `linear-gradient(105deg, ${base} 0px, ${base} ${gx - bw}px, ${mid} ${gx - bw * 0.4}px, ${core} ${gx}px, ${mid} ${gx + bw * 0.4}px, ${base} ${gx + bw}px, ${base} ${LW}px)`,
  } as React.CSSProperties);
  const letter = (ch: string, i: number, at: number, dist: number, amp: number, lx: number, ly: number, look: React.CSSProperties) => {
    const p = spring(t, at, 0.52, 0.56);
    const tr = `${blast(lx, ly)} translateY(${(1 - p) * S1 * 1.3 - hop(dist, amp)}px) perspective(700px) rotateX(${(1 - p) * -58}deg) scale(${0.4 + 0.6 * p})`;
    return <span key={i} style={{ display: "inline-block", transform: tr, transformOrigin: "50% 80%", opacity: clamp(p * 3.2), ...look }}>{ch}</span>;
  };
  const g1 = mix(-260, LW1 + 260, (t - 0.5) / 0.9), g2 = mix(-240, LW2 + 240, (t - 0.74) / 0.72);
  const look1 = (i: number) => (g1 > -250 && g1 < LW1 + 250 ? glint(OX1[i], LW1, g1, B.navy, B.blue, B.sky, 210) : { color: B.navy });
  const look2 = (i: number) => (g2 > -230 && g2 < LW2 + 230 ? glint(OX2[i], LW2, g2, B.blue, B.sky, B.sky, 190) : { color: B.blue });
  const line1 = L1.split("").map((ch, i) => letter(ch, i, -0.14 + i * 0.028, L1.length - i + 2, 0.45, 960 - W1 / 2 + ((i + 0.5) * W1) / L1.length, L1_TOP + 80, look1(i)));
  const line2 = L2.split("").map((ch, i) => letter(ch, i, T_L2 + i * 0.03, L2.length - 1 - i, 1, X2R - W2 + ((i + 0.5) * W2) / L2.length, L2_TOP + 80, look2(i)));
  // line 1 builds alone at the centre, then "that deliver" pushes it up into place
  const l1y = (LH / 2) * (1 - spring(t, T_L2 - 0.04, 0.55, 0.68));
  // each line tracks in sideways while its letters build (line 1 from the right, line 2 from the left)
  const l1x = 300 * (1 - ease((t + 0.14) / 1.1)), l2x = -240 * (1 - ease((t - T_L2 + 0.02) / 0.68));
  const text: React.CSSProperties = { position: "absolute", top: 0, display: "flex", fontFamily: SANS, fontWeight: 700, fontSize: S1, letterSpacing: "-0.035em", lineHeight: 1.05, whiteSpace: "pre" };
  return (
    <AbsoluteFill style={{ transformOrigin: "960px 540px", transform: `perspective(2200px) rotateY(${ry}deg) translate(${tx + cdx}px, ${gy + ty}px) scale(${g})` }}>
      <div style={{ ...text, left: 0, width: 1920, justifyContent: "center", transform: `translate(${l1x}px, ${L1_TOP + l1y}px)` }}>{line1}</div>
      <div style={{ ...text, left: 0, width: X2R, justifyContent: "flex-end", transform: `translate(${l2x}px, ${L2_TOP}px)` }}>{line2}</div>
    </AbsoluteFill>
  );
};

// the full stop: falls, bounces with squash, inhales, then grows into the TNOA hub at the network's centre
const Hub: React.FC<{ t: number; c: Cam | null }> = ({ t, c }) => {
  if (t < T_DROP) return null;
  const f = dotFall(t), sq = squash(t);
  const stretch = t < LAND3 ? Math.min(0.55, Math.abs(f.v) / 7000) : 0;
  const inhale = sstep(1.32, T_HUB, t) * (1 - sstep(T_HUB, T_HUB + 0.08, t));
  const gr = spring(t, T_HUB, 0.56, 0.6);
  let x: number, y: number, size: number, z = 0;
  if (!c) { const m = headMap(t, DOT_X, DOT_Y - f.h); x = m.x; y = m.y; size = DOT * m.k; }
  else {
    const p = P(c, 0, 0), m = headMap(t, DOT_X, DOT_Y);
    x = p.x; y = p.y; z = p.z; size = mix(DOT * m.k, 150, gr) * c.Z;
  }
  size *= 1 - 0.28 * inhale;
  const label = clamp((gr - 0.55) * 3);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 150, height: 150, zIndex: 2000 - Math.round(z), transform: `translate(${x - 75}px, ${y - 75}px) scale(${size / 150})` }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 100%", transform: `scale(${1 + sq * 0.9 - stretch * 0.35}, ${1 - sq + stretch})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 75, background: `radial-gradient(circle at 50% 28%, #3B82F6 0%, ${B.blue} 62%)`, boxShadow: `0 18px 40px -14px rgba(37,99,235,${0.25 + 0.45 * gr})` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 38, letterSpacing: "-0.035em", color: B.white, opacity: label, transform: `scale(${0.7 + 0.3 * label})` }}>TNOA</div>
      </div>
    </div>
  );
};

// a green check badge that pops on an agent
const Badge: React.FC<{ t: number; at: number; N: number }> = ({ t, at, N }) => {
  const p = bounce(t, at, 0.42);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: N - 34, top: -16, width: 50, height: 50, borderRadius: 25, background: B.green, border: "4px solid #FFFFFF", boxShadow: "0 6px 14px -4px rgba(4,120,87,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})` }}>
      <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    </div>
  );
};

// ---------------------------------------------------------------- shots 2-3: the network
type Pt = { ag: Agent; p: number; x0: number; y0: number; s: { x: number; y: number; k: number; z: number } };
const agentPts = (t: number, c: Cam): Pt[] => AGENTS.map((ag, i) => {
  const p = grow(t, ag);
  const [x0, y0] = polar(radius(ag) * p, ag.a, c.s);
  const s = P(c, x0, y0);
  // each agent floats on its own phase until the camera dives
  s.y += 10 * s.k * Math.sin(TAU * 1.05 * t + i * 1.9) * clamp(p) * (1 - sstep(T_PUSH, T_PUSH + 0.3, t));
  return { ag, p, x0, y0, s };
});

// name chips. Each chip is a fixed-size box (its label's measured width in DM Sans 600 34 px, plus padding, dot and
// hairline) placed against its icon on the side that points AWAY from the hub on screen: sideways at the left and
// right of the disc, below at the front, above at the back; it slides round the icon's corner in between. The box is
// then kept inside a 64 px safe margin of the frame.
const CHIP_FS = 32, CHIP_H = 64, CHIP_PL = 22, CHIP_PR = 28, CHIP_DOT = 13, CHIP_GAP = 12;
const CHIP_TEXT = [219.5, 215.8, 193.7, 133.9, 146.5, 167.4].map((w) => (w * CHIP_FS) / 34);   // measured at 34 px
const CHIP_W = CHIP_TEXT.map((w) => Math.ceil(w + CHIP_PL + CHIP_DOT + CHIP_GAP + CHIP_PR + 3 + 4));
const SAFE = 64;
// a hair of 3D so that Chrome composites the chip instead of snapping its label to whole pixels as it drifts
const CHIP_3D = " perspective(2000px) rotateX(0.01deg)";
type ChipBox = { i: number; x: number; y: number; S: number; w: number; h: number; fold: number; on: boolean };   // fold: 0 shown .. 0.8 gone
const chipLayout = (t: number, c: Cam, pts: Pt[], keepIn = true): ChipBox[] => {
  const hub = P(c, 0, 0);
  return pts.slice(0, 6).map((q, i) => {
    const pop = bounce(t, T_CHIP + i * 0.085, 0.46);
    const fold = i === 0 ? spring(t, T_TAP - 0.08, 0.26, 1) : spring(t, T_PUSH + 0.025 * i, 0.3, 1);
    const s = pop * (1 - 0.6 * fold);
    const k = q.s.k * clamp(q.p * 1.15), S = k * s, w = CHIP_W[i], h = CHIP_H;
    // outward from the hub, leaning sideways (a wide label reads best beside its icon)
    const ex = q.s.x - hub.x, ey = q.s.y - hub.y, th = Math.tanh(ex / 150), vy = Math.tanh(ey / 30) * (1 - Math.abs(th)) * 1.6;
    const n = Math.hypot(th, vy) || 1, dx = th / n, dy = vy / n;
    // the smallest step along (dx, dy) that clears the icon's square by the gap on one axis
    const half = (N_OUT / 2) * k, gap = 16 * k;
    const tx = Math.abs(dx) > 1e-4 ? (half + (w * S) / 2 + gap) / Math.abs(dx) : 1e9;
    const ty = Math.abs(dy) > 1e-4 ? (half + (h * S) / 2 + gap) / Math.abs(dy) : 1e9;
    const d = Math.min(tx, ty);
    let x = q.s.x + dx * d - (w * S) / 2, y = q.s.y + dy * d - (h * S) / 2;
    // kept inside the safe margin while it is on show; as it folds away in the dive it may leave with the network
    if (keepIn) {
      const kx = Math.min(Math.max(x, SAFE), 1920 - SAFE - w * S), ky = Math.min(Math.max(y, SAFE), 1080 - SAFE - h * S), hold = 1 - clamp(fold * 1.6);
      x = mix(x, kx, hold); y = mix(y, ky, hold);
    }
    return { i, x, y, S, w, h, fold, on: fold < 0.8 && s > 0.002 };
  });
};

const Network: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  const out = sstep(T_FLY - 0.04, T_FLY + 0.24, t);  // lines and rings leave as the agents fly out
  const lineA = clamp((t - T_NODE) / 0.25) * (1 - out);
  const pts = agentPts(t, c);
  const hub = P(c, 0, 0);
  const ring = (r: number) => Array.from({ length: 73 }, (_, i) => { const a = (i / 72) * TAU; const q = P(c, r * Math.cos(a), r * Math.sin(a)); return `${q.x.toFixed(2)},${q.y.toFixed(2)}`; }).join(" ");
  const ringP = spring(t, T_NODE - 0.02, 0.7, 0.75);
  const svg: React.ReactNode[] = [];
  if (out < 1) {
    svg.push(<polyline key="ri" points={ring(R_IN * ringP)} fill="none" stroke={B.navy} strokeOpacity={0.1 * lineA} strokeWidth={2 * c.Z} />);
    svg.push(<polyline key="ro" points={ring(R_OUT * ringP)} fill="none" stroke={B.navy} strokeOpacity={0.1 * lineA} strokeWidth={2 * c.Z} />);
    // ripples travel out over the disc from the hub
    if (t > 1.5) [0, 1, 2, 3].forEach((j) => {
      const u = ((t - 1.5) * 0.9 + j / 4) % 1;
      svg.push(<polyline key={"rp" + j} points={ring(120 + 540 * u)} fill="none" stroke={B.sky} strokeOpacity={0.42 * (1 - u) * clamp((t - 1.5) / 0.3) * (1 - out)} strokeWidth={5 * c.Z} />);
    });
    pts.forEach((q, i) => svg.push(<line key={"s" + i} x1={hub.x} y1={hub.y} x2={q.s.x} y2={q.s.y} stroke={B.blue} strokeOpacity={(q.ag.ring ? 0.3 : 0.22) * lineA} strokeWidth={(q.ag.ring ? 3 : 2.5) * c.Z} />));
    if (t > 1.85) {
      const pa = clamp((t - 1.85) / 0.2) * (1 - out);
      pts.forEach((q, i) => {
        const ph = ((t - 1.85) * 1.2 + i * 0.37) % 1, s = P(c, q.x0 * ph, q.y0 * ph), f = Math.sin(Math.PI * ph);
        svg.push(<circle key={"g" + i} cx={s.x} cy={s.y} r={22 * s.k} fill={B.sky} opacity={0.24 * pa * f} />);
        svg.push(<circle key={"d" + i} cx={s.x} cy={s.y} r={9 * s.k} fill={B.sky} opacity={pa * f} />);
      });
    }
  }

  // agents, depth-sorted; the lead agent is drawn by CardMorph so that it can open
  const nodes = pts.map((q, i) => {
    if (i === 0) return null;
    const N = q.ag.ring ? N_OUT : N_IN;
    let { x, y } = q.s, k = q.s.k * clamp(q.p * 1.15), rot = 0;
    const v = SCATTER[i], fx = t - v.t0;
    if (fx > 0) {
      // scatter: fly out from the opening card, growing toward the camera
      const s = FLY_V * fx + v.a * fx * fx;
      x += v.ux * s; y += v.uy * s; k *= flyGrow(fx); rot = v.ux * (25 * fx + 40 * fx * fx);
    }
    const half = (N / 2) * k * 1.45;
    if (x < -half || x > 1920 + half || y < -half || y > 1080 + half) return null;
    return (
      <div key={q.ag.key} style={{ position: "absolute", left: 0, top: 0, width: N, height: N, borderRadius: N * 0.27, background: q.ag.ring ? BLUE_GRAD : NAVY_GRAD, zIndex: 2000 - Math.round(q.s.z),
        boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.28), 0 18px 30px -14px rgba(11,18,32,0.5)", transform: `translate(${x - N / 2}px, ${y - N / 2}px) rotate(${rot}deg) scale(${k})`,
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Glyph k={q.ag.key} size={N * 0.46} />
        {q.ag.badge !== undefined && <Badge t={t} at={T_BADGE + q.ag.badge * 0.1} N={N} />}
      </div>
    );
  });

  // name chips beside the six named agents (see chipLayout)
  const chips = chipLayout(t, c, pts).map((b) => {
    if (!b.on) return null;
    return (
      <div key={"c" + b.i} style={{ position: "absolute", left: 0, top: 0, width: b.w, height: b.h, zIndex: 3000 - Math.round(pts[b.i].s.z), transformOrigin: "0 0",
        opacity: clamp(1 - b.fold / 0.8), transform: `translate(${b.x}px, ${b.y}px) scale(${b.S})${CHIP_3D}` }}>
        <div style={{ boxSizing: "border-box", display: "flex", alignItems: "center", gap: CHIP_GAP, width: b.w, height: b.h, padding: `0 ${CHIP_PR}px 0 ${CHIP_PL}px`, borderRadius: b.h / 2, background: B.white, border: `1.5px solid ${B.line}`,
          boxShadow: "0 1px 2px rgba(11,18,32,0.06), 0 14px 30px -12px rgba(11,18,32,0.35)", fontFamily: SANS, fontWeight: 600, fontSize: CHIP_FS, letterSpacing: "-0.015em", color: B.navy, whiteSpace: "nowrap" }}>
          <div style={{ width: CHIP_DOT, height: CHIP_DOT, borderRadius: CHIP_DOT / 2, flexShrink: 0, background: B.green, boxShadow: "0 0 0 5px rgba(52,211,153,0.22)" }} />
          {NAMED[b.i][1]}
        </div>
      </div>
    );
  });

  // the lead agent (the icon that opens) and its tap
  const L = pts[0];
  const press = 1 - 0.13 * sstep(T_TAP, T_TAP + 0.07, t) + 0.13 * spring(t, T_TAP + 0.08, 0.36, 0.55);
  const S0 = N_OUT * L.s.k * clamp(L.p * 1.15);
  let lead: React.ReactNode = null;
  if (t < OPEN) {
    const size = S0 * press, zi = 2000 - Math.round(L.s.z);
    lead = (
      <>
        <CardMorph t={t} cx={L.s.x} cy={L.s.y} w={size} h={size} r={size * 0.27} blue={1} m={0} z={zi} />
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: zi + 1, transform: `translate(${L.s.x - 26}px, ${L.s.y - 26}px) scale(${(size * 0.46) / 52})` }}><Glyph k="lead" size={52} /></div>
      </>
    );
  }
  let tap: React.ReactNode = null;
  if (t > T_TAP + 0.06 && t < T_TAP + 0.36) {
    const u = (t - T_TAP - 0.06) / 0.3, r = S0 * (0.62 + 0.75 * ease(u));
    tap = <div style={{ position: "absolute", left: 0, top: 0, width: 200, height: 200, borderRadius: 100, border: `5px solid ${B.sky}`, opacity: 0.8 * (1 - u) * (1 - u), zIndex: 5002, transform: `translate(${L.s.x - 100}px, ${L.s.y - 100}px) scale(${r / 100})` }} />;
  }

  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}>{svg}</svg>
      {nodes}{lead}{chips}{tap}
    </>
  );
};

// "Production-Ready AI Agents" over the network; flies up as the camera dives
const Title: React.FC<{ t: number }> = ({ t }) => {
  if (t < T_TITLE - 0.05) return null;
  const x = Math.max(0, t - T_PUSH), dy = -(500 * x + 4200 * x * x);
  if (dy < -500) return null;
  const text = "Production-Ready AI Agents";
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 300, zIndex: 4000, transform: `translateY(${dy}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 64, width: 1920, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 92, letterSpacing: "-0.035em", lineHeight: 1.05, whiteSpace: "pre" }}>
        {text.split("").map((ch, i) => {
          const p = spring(t, T_TITLE + i * 0.016, 0.5, 0.58);
          return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * 44}px) perspective(600px) rotateX(${(1 - p) * -70}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 80%", opacity: clamp(p * 2.4), color: i >= 17 ? B.blue : B.navy }}>{ch}</span>;
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the opening: icon -> blue splash -> white app (H1Card)
const C_OPEN = camAt(OPEN);
const LEAD_OPEN = (() => {
  const L = AGENTS[0], p = grow(OPEN, L);
  const [lx, ly] = polar(R_OUT * p, L.a, C_OPEN.s);
  const s = P(C_OPEN, lx, ly);
  const press = 1 - 0.13 + 0.13 * spring(OPEN, T_TAP + 0.08, 0.36, 0.55);
  return { x: s.x, y: s.y, S: N_OUT * s.k * clamp(p * 1.15) * press };
})();
const IRIS_MAX = 720;   // covers the card from its centre (half diagonal 690)
const Opening: React.FC<{ t: number }> = ({ t }) => {
  if (t < OPEN) return null;
  const { x: x0, y: y0, S: S0 } = LEAD_OPEN;
  const set = sstep(T_SET - 0.28, T_SET, t);                       // size and place are final from T_SET
  const p = mix(spring(t, OPEN, 0.8, 0.56), 1, set), q = mix(spring(t, OPEN, 0.6, 0.86), 1, set);
  const w = mix(S0, 1200, p), h = mix(S0, 680, p), r = mix(S0 * 0.27, 40, clamp(p));
  const m = sstep(T_SET - 0.02, H1 - 0.25, t);                     // then the card's 3D turn eases in
  const cx = mix(x0, 960, q), cy = mix(y0, 540, q);
  const ip = clamp((t - T_IRIS) / 0.34), iris = IRIS_MAX * (1 - Math.pow(1 - ip, 2.4));
  // the splash: the glyph grows from the icon's size, "Lead response" pops under it; both lift off as the white opens
  const gsz = mix(S0 * 0.46, 170, clamp(p)), lift = ease((t - T_IRIS + 0.06) / 0.3), fade = 1 - clamp((t - T_IRIS + 0.06) / 0.16);
  const lab = bounce(t, T_LABEL, 0.45);
  const gy = cy - mix(0, 46, clamp(p)) * lab;
  return (
    <>
      <CardMorph t={t} cx={cx} cy={cy} w={w} h={h} r={r} blue={ip < 1 ? 1 : 0} m={m} z={5000} iris={iris} />
      {fade > 0 && <>
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 5001, opacity: fade, transform: `translate(${cx - 26}px, ${gy - 26 - 40 * lift}px) scale(${(gsz / 52) * (1 + 0.5 * lift)})` }}><Glyph k="lead" size={52} sw={1.8} /></div>
        {lab > 0.001 && <div style={{ position: "absolute", left: 0, top: 0, zIndex: 5001, opacity: fade * clamp(lab * 2), transformOrigin: "0 0",
          transform: `translate(${cx}px, ${cy + 96 * clamp(p) - 30 * lift}px) scale(${lab * (1 + 0.3 * lift)}) translate(-50%, -50%)`, fontFamily: SANS, fontWeight: 600, fontSize: 50, letterSpacing: "-0.02em", color: B.white, whiteSpace: "nowrap" }}>Lead response</div>}
      </>}
    </>
  );
};

// geometry for the layout checker (scratch script; not used by the film)
export const __geoA = { camAt, agentPts, chipLayout, AGENTS, N_IN, N_OUT, T_HUB, P, SCATTER, flyGrow };

export const SegA: React.FC<{ t: number }> = ({ t }) => {
  const c = t >= T_HUB ? camAt(t) : null;
  return (
    <AbsoluteFill>
      {t < T_HUB + 0.6 && <Headline t={t} />}
      {c && <Network t={t} c={c} />}
      {t < T_SET && <Hub t={t} c={c} />}
      {c && <Title t={t} />}
      {t < H1 - 0.25 ? <Opening t={t} /> : <div style={{ position: "absolute", inset: 0, zIndex: 5000 }}><H1Card t={t} /></div>}
    </AbsoluteFill>
  );
};
