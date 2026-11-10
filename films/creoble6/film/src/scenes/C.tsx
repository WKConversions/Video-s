// Scene C (h2 37.92 s → end 65.18 s): the rows turn green, "Fast pris.", the three pills, the support chat, and the
// outro after the reference: the clicked button becomes the dot, the dot flies on a trail, rides after the words,
// becomes the logo mark, the wordmark slides out and the URL types below (plan/contract.md, C1–C11).
// One world, one camera. Every shot is "look at a target from a distance" (shotCam), so the subject stays centred
// while the camera orbits and dollies; type sits on planes at the camera's own depth (natural size, in focus).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage3D, Plane, cam, project, Cam } from "../cam";
import { Kinetic, TYPE, measure, useFonts, KItem } from "../type";
import { Dots, dotsAt, RING, BOX_C, Icon, assemble } from "../dots";
import { HostingCard, CARD, Cursor, cursorAt, Handoff2, camH2, H2_CARD, HANDOFF_HALF } from "../ui";
import { k, f, typed, press, Ico, Wordmark, C, OUT, INOUT, LIN, SANS, SHADOW, SHADOW_BIG, clamp01, mix } from "../shared";

// motion blur: only around the fast moves (each ≤ 0.8 s)
export const BLUR: [number, number][] = [
  [39.6, 40.35],    // pull back from the rows to "Fast pris."
  [46.35, 47.1],    // the truck from the pills to "Brug for hjælp?"
  [49.75, 50.5],    // pull back from the chat to "Ingen kø."
  [51.85, 52.35],   // the fly-in to the send button
  [52.55, 53.3],    // the dot's flight and the dots assembling
  [56.6, 57.15],    // the smallest dot flies down to the line
  [59.5, 60.12],    // the dot flies back up to the mark
];

/* ---------- the world ---------- */
type V3 = [number, number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const cardPt = (lx: number, ly: number): V3 => [H2_CARD.x + lx * Math.cos(rad(3)), H2_CARD.y + ly, H2_CARD.z + lx * Math.sin(rad(3))];
const CARD_C: V3 = [H2_CARD.x, H2_CARD.y, H2_CARD.z];
const P: V3 = [-700, -620, 2000];          // the type plane in front of the card; the pills
const Q: V3 = [2800, 0, 1300];       // the chat; later the outro's plane (O)
const Q2: V3 = [2100, -620, 3400];      // the type plane in front of the chat
const PANEL = { w: 820, h: 640 };
const SEND = { x: 728, y: 548, s: 64 };                                  // the send button in the panel
const B_O = { x: SEND.x + SEND.s / 2 - PANEL.w / 2, y: SEND.y + SEND.s / 2 - PANEL.h / 2 };   // its centre, from the panel's centre
const B: V3 = [Q[0] + B_O.x, Q[1] + B_O.y, Q[2]];

/* ---------- the camera ---------- */
type Shot = { at: number; t: V3; d: number; ry?: number; rx?: number; ap?: number; fo?: V3; ease?: (t: number) => number };
type Pose = { t: V3; d: number; ry: number; rx: number; ap: number; fo: V3 };
const pose = (s: Shot): Pose => ({ t: s.t, d: s.d, ry: s.ry ?? 0, rx: s.rx ?? 0, ap: s.ap ?? 18, fo: s.fo ?? s.t });
const mixV = (a: V3, b: V3, q: number): V3 => [mix(a[0], b[0], q), mix(a[1], b[1], q), mix(a[2], b[2], q)];
const mixPose = (a: Pose, b: Pose, q: number): Pose => ({ t: mixV(a.t, b.t, q), d: mix(a.d, b.d, q), ry: mix(a.ry, b.ry, q), rx: mix(a.rx, b.rx, q), ap: mix(a.ap, b.ap, q), fo: mixV(a.fo, b.fo, q) });
// the target sits on the optical axis, d px beyond the natural-size distance (d < 0 = closer: scale 1600 / (1600 + d))
const shotCam = (s: Pose): Cam => {
  const a = rad(s.ry), b = rad(s.rx);
  const c = cam({ x: s.t[0] - s.d * Math.cos(b) * Math.sin(a), y: s.t[1] - s.d * Math.sin(b), z: s.t[2] + s.d * Math.cos(b) * Math.cos(a), rx: s.rx, ry: s.ry, ap: s.ap });
  c.focus = project(c, { x: s.fo[0], y: s.fo[1], z: s.fo[2] }).dist;
  return c;
};
const sc = (scale: number) => 1600 / scale - 1600;   // the distance for an on-screen scale
const SHOTS: Shot[] = [
  // C1: the rows, close (the card's rows fill the frame; the title and the price go soft)
  { at: 38.95, t: cardPt(6, -24), d: sc(1.9), ry: 6, rx: 3, ap: 14, fo: CARD_C },
  { at: 39.5, t: cardPt(14, 44), d: sc(2.0), ry: 4.5, rx: 2, ap: 14, fo: CARD_C, ease: LIN },
  // C2: back to the type plane; the card recedes, soft
  { at: 40.37, t: P, d: 0, ry: 3, ap: 24 },
  { at: 42.05, t: P, d: -50, ry: -1, ap: 24, ease: LIN },
  // C3: the pills; a slow orbit and push
  { at: 42.8, t: P, d: -10, ry: -8, ap: 22 },
  { at: 46.3, t: P, d: sc(1.06), ry: 8, ap: 22, ease: LIN },
  // C4: truck to the support world
  { at: 47.1, t: Q, d: 0, ry: -3, ap: 16 },
  { at: 47.95, t: Q, d: -40, ry: -1, ap: 16, ease: LIN },
  // C5: the chat panel opens; push toward the reply (the panel stays inside SAFE)
  { at: 48.8, t: [Q[0], Q[1] + 6, Q[2]], d: sc(1.24), ry: 3, rx: 1, ap: 16, fo: Q },
  { at: 49.65, t: [Q[0], Q[1] + 6, Q[2]], d: sc(1.3), ry: -1.5, rx: 1, ap: 16, fo: Q, ease: LIN },
  // C6: back to the type plane in front of it
  { at: 50.67, t: Q2, d: 0, ry: -3, ap: 24 },
  { at: 51.8, t: Q2, d: -50, ry: 0.5, ap: 24, ease: LIN },
  // C7: to the send button (extreme close-up), then out to the logo
  { at: 52.3, t: [B[0] - 62, B[1] - 8, B[2]], d: sc(3.1), ry: 6, rx: 3, ap: 16, fo: Q },
  { at: 52.6, t: [B[0] - 60, B[1] - 8, B[2]], d: sc(3.2), ry: 5, rx: 2.5, ap: 16, fo: Q, ease: LIN },
  { at: 53.2, t: Q, d: 0, ry: 0, rx: 0, ap: 14 },
  // C8: the wordmark slides out
  { at: 54.14, t: Q, d: -25, ry: -2, ap: 14, ease: LIN },
  // C9: the lockup rises, the line below; then a slow dolly in
  { at: 54.85, t: Q, d: 20, ry: -1, ap: 14 },
  { at: 56.7, t: Q, d: -20, ry: 1.5, ap: 14, ease: LIN },
  // C10: the line with the dot
  { at: 57.3, t: Q, d: 50, ry: -2, ap: 14 },
  { at: 59.6, t: Q, d: 0, ry: 2, ap: 14, ease: LIN },
  // C11: the final lockup; a slow dolly to the end
  { at: 60.5, t: [Q[0], Q[1] + 6, Q[2]], d: 30, ry: 1.5, ap: 14 },
  { at: 65.4, t: [Q[0], Q[1] + 6, Q[2]], d: -45, ry: -2, ap: 14, ease: LIN },
];
const shotAt = (t: number): Pose => {
  if (t <= SHOTS[0].at) return pose(SHOTS[0]);
  for (let i = 1; i < SHOTS.length; i++) {
    if (t <= SHOTS[i].at) return mixPose(pose(SHOTS[i - 1]), pose(SHOTS[i]), (SHOTS[i].ease ?? INOUT)(clamp01((t - SHOTS[i - 1].at) / (SHOTS[i].at - SHOTS[i - 1].at))));
  }
  return pose(SHOTS[SHOTS.length - 1]);
};
const lerpCam = (a: Cam, b: Cam, q: number): Cam => ({ x: mix(a.x, b.x, q), y: mix(a.y, b.y, q), z: mix(a.z, b.z, q), rx: mix(a.rx, b.rx, q), ry: mix(a.ry, b.ry, q), rz: mix(a.rz, b.rz, q), focus: mix(a.focus, b.focus, q), ap: mix(a.ap, b.ap, q) });
const camC = (g: number): { c: Cam; s: Pose } => {
  const t = g / 30, s = shotAt(t);
  // a slow breath on top of every shot, so the camera is never at rest (the target stays centred)
  s.ry += 0.6 * Math.sin((t / 6.7) * Math.PI * 2);
  s.rx += 0.3 * Math.sin((t / 8.9) * Math.PI * 2 + 1);
  // the focus stays on the card until the third row is green, then racks to the type plane
  if (t > 39.5 && t < 40.37) s.fo = mixV(CARD_C, P, INOUT(clamp01((t - 39.92) / 0.45)));
  let c = shotCam(s);
  const t0 = (f("h2") + HANDOFF_HALF) / 30, u = INOUT(clamp01((t - t0) / (38.95 - t0)));
  if (u < 1) { c = lerpCam(camH2(g), c, u); c.focus = project(c, { x: CARD_C[0], y: CARD_C[1], z: CARD_C[2] }).dist; }   // out of the hand-off: camH2's drift carries on and blends into the first shot
  return { c, s };
};

/* ---------- small pieces ---------- */
const bez = (a: { x: number; y: number }, b: { x: number; y: number }, bend: number, q: number) => {
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, mx = (a.x + b.x) / 2 - (dy / L) * bend, my = (a.y + b.y) / 2 + (dx / L) * bend, u = 1 - q;
  return { x: u * u * a.x + 2 * u * q * mx + q * q * b.x, y: u * u * a.y + 2 * u * q * my + q * q * b.y };
};
type Dot = { x: number; y: number; r: number; o?: number };
// comet: the dot with a short fading trail of ghosts (where it was a moment ago)
const comet = (pos: (t: number) => Dot, t: number, n = 6, dt = 0.016): Dot[] => {
  const out: Dot[] = [];
  for (let j = n; j >= 1; j--) { const p = pos(t - j * dt); out.push({ ...p, r: p.r * (1 - 0.09 * j), o: 0.3 * (1 - j / (n + 1)) }); }
  out.push({ ...pos(t), o: 1 });
  return out;
};
// the mark (size S, its visual centre on mx / my)
const markDots = (S: number, mx: number, my: number) => dotsAt(S, mx + ((RING.x - BOX_C.x) * S) / 100, my + ((RING.y - BOX_C.y) * S) / 100);
const S_BIG = 240;
// the two lockups: the first (about 640 px wide) and the final one (about 700 px wide, the C about 190 px tall)
type Lock = { S: number; h: number; gap: number };
const LA: Lock = { S: 240, h: 94, gap: 46 }, LB: Lock = { S: 260, h: 103, gap: 50 };
const geo = (L: Lock) => { const mw = (61.75 * L.S) / 100, wmW = L.h * 4.77, tot = mw + L.gap + wmW; return { markX: -tot / 2 + mw / 2, wmLeft: -tot / 2 + mw + L.gap, wmW }; };
// Lockup: the C (centred) slides left while the wordmark comes out from behind it (s 0..1); wm 0..1 reveals the
// wordmark (its stop lands last); rs = each dot's radius factor
const Lockup: React.FC<{ L: Lock; cy: number; s: number; wm: number; rs: number[] }> = ({ L, cy, s, wm, rs }) => {
  const G = geo(L), mx = mix(0, G.markX, s);
  const ds = markDots(L.S, mx, cy).map((d, i) => ({ ...d, r: d.r * (rs[i] ?? 1) }));
  const edge = mx + ((78.81 - BOX_C.x) * L.S) / 100;
  return (
    <>
      {wm > 0.001 && (
        <div style={{ position: "absolute", left: G.wmLeft, top: cy - L.h / 2, width: G.wmW, height: L.h, clipPath: `inset(-40px -80px -40px ${Math.max(0, edge + 12 - G.wmLeft).toFixed(1)}px)` }}>
          <Wordmark h={L.h} p={wm} style={{ transform: `translateX(${(-(1 - s) * 150).toFixed(2)}px)` }} />
        </div>
      )}
      <Dots dots={ds} />
    </>
  );
};

const PILLS: [string, string][] = [["Domænet i dit navn", "w:domnet"], ["Servere i Europa", "w:servere"], ["Ingen binding", "w:ingen3"]];
const Pills: React.FC<{ g: number }> = ({ g }) => {
  const join = PILLS.map(([, at]) => k(g, at, 0.6, INOUT)), n1 = join[1] + join[2];
  return (
    <>
      {PILLS.map(([text, at], i) => {
        const a = k(g, at, 0.6, OUT), out = k(g, 46.2 + i * 0.09, 0.45, INOUT);
        if (a <= 0 || out >= 1) return null;
        const y = (i - n1 / 2) * 152 + (1 - a) * 80 - out * 100;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%, -50%) translateY(${y.toFixed(2)}px)`, opacity: clamp01(a * 1.6) * (1 - out),
            height: 120, borderRadius: 60, boxSizing: "border-box", padding: "0 60px 0 46px", background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`,
            display: "flex", alignItems: "center", gap: 24, fontFamily: SANS, fontWeight: 500, fontSize: 56, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap" }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: C.sage, flex: "none" }} />{text}
          </div>
        );
      })}
    </>
  );
};

const CHAT_Y = 190;
const REPLY = "Selvfølgelig. Jeg kigger på det med det samme.";
// the chat: the wizard's sage chat button opens into the panel (one shape); hideSend when the outro lifts the button
const Chat: React.FC<{ g: number; hideSend: boolean }> = ({ g, hideSend }) => {
  const a = k(g, 47.66, 0.5, OUT), m = k(g, 48.1, 0.6, INOUT), dip = press(g, 48.02);
  const w = mix(120, PANEL.w, m), h = mix(120, PANEL.h, m), body = clamp01((m - 0.5) / 0.5);
  const up = (at: number | string, dur = 0.5): React.CSSProperties => { const q = k(g, at, dur, OUT); return { opacity: q, transform: `translateY(${((1 - q) * 14).toFixed(2)}px)` }; };
  const reply = typed(g, "w:forstr", REPLY, 56);
  return (
    <div style={{ position: "absolute", left: -w / 2, top: -h / 2 + CHAT_Y * (1 - m), width: w, height: h, borderRadius: mix(60, 28, m), overflow: "hidden", opacity: clamp01(a * 2),
      transform: `scale(${(mix(0.6, 1, a) * (1 - 0.06 * dip)).toFixed(4)})`, background: `color-mix(in srgb, ${C.white} ${(clamp01(m * 1.7) * 100).toFixed(1)}%, ${C.sageDark})`,
      boxShadow: `0 0 0 1px rgba(232,229,223,${clamp01(m * 2).toFixed(3)}), ${m > 0.5 ? SHADOW_BIG : SHADOW}` }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: 1 - clamp01(m * 3) }}><Ico n="chat" s={58} c={C.white} w={2.2} /></div>
      <div style={{ position: "absolute", left: (w - PANEL.w) / 2, top: (h - PANEL.h) / 2, width: PANEL.w, height: PANEL.h, opacity: body, fontFamily: SANS, color: C.ink }}>
        {/* header */}
        <div style={{ position: "absolute", left: 54, top: 44 }}><Icon size={44} /></div>
        <div style={{ position: "absolute", left: 92, top: 27, fontSize: 25, fontWeight: 600, letterSpacing: "-0.01em" }}>Creoble <span style={{ fontWeight: 400, color: C.muted }}>Support</span></div>
        <div style={{ position: "absolute", left: 0, top: 88, width: PANEL.w, height: 1, background: C.line }} />
        {/* the customer */}
        <div style={{ position: "absolute", right: 32, top: 122, padding: "17px 26px", borderRadius: "26px 26px 8px 26px", background: C.sageTint, fontSize: 27, whiteSpace: "nowrap", ...up(48.42) }}>Kan I hjælpe med min e-mail?</div>
        {/* the person */}
        <div style={{ position: "absolute", left: 32, top: 246, width: 64, height: 64, borderRadius: 32, background: C.sage, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 600, letterSpacing: "0.02em", ...up(48.58) }}>SL</div>
        <div style={{ position: "absolute", left: 114, top: 232, fontSize: 21, fontWeight: 500, color: C.muted, ...up(48.62) }}>Sofie</div>
        <div style={{ position: "absolute", left: 112, top: 268, width: 584, boxSizing: "border-box", padding: "20px 28px", borderRadius: "8px 26px 26px 26px", background: C.white, boxShadow: `0 0 0 1px ${C.line}, 0 1px 2px rgba(26,22,20,0.04)`,
          fontSize: 34, lineHeight: 1.36, letterSpacing: "-0.01em", ...up("w:forstr-0.12", 0.45) }}>
          <span>{reply}</span><span style={{ opacity: 0 }}>{REPLY.slice(reply.length)}</span>
        </div>
        {/* the input row */}
        <div style={{ position: "absolute", left: 28, top: SEND.y, width: SEND.x - 28 - 14, height: SEND.s, boxSizing: "border-box", borderRadius: 16, background: C.white, border: `1px solid #E1DDD6`, display: "flex", alignItems: "center", padding: "0 22px" }}>
          <div style={{ width: 2, height: 28, background: C.ink, opacity: Math.floor(g / 15) % 2 === 0 ? 0.85 : 0 }} />
        </div>
        {!hideSend && <SendButton p={press(g, 52.28)} />}
      </div>
    </div>
  );
};
const SendButton: React.FC<{ p?: number; m?: number; abs?: boolean }> = ({ p = 0, m = 0, abs = true }) => {
  const s = mix(SEND.s, 84, m);
  return (
    <div style={{ position: "absolute", left: abs ? SEND.x : -s / 2, top: abs ? SEND.y : -s / 2, width: s, height: s, borderRadius: mix(16, 42, m), background: `color-mix(in srgb, ${C.sage} ${(m * 100).toFixed(1)}%, ${C.ink})`,
      display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${(1 - 0.07 * p).toFixed(4)})` }}>
      <Ico n="arrow" s={30} c={C.white} w={2.4} style={{ transform: "rotate(-90deg)", opacity: 1 - clamp01(m * 2.5) }} />
    </div>
  );
};

const W = (text: string, at: (string | number)[], accent: number, out: string | number, dur = 0.34): KItem[] => text.split(" ").map((tx, i) => ({ t: tx, at: at[i], accent: accent === i, out, dur }));
const L10: [string, string, boolean?][] = [["Byg", "w:byg"], ["den.", "w:den3"], ["Se", "w:se"], ["den.", "w:den4"], ["Så", "w:s2"], ["køber", "w:kber", true], ["du.", "w:du5"]];
const CTA_A = "Byg din side gratis på ", CTA_B = "creoble.dk";

/* ---------- the scene ---------- */
export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  const ready = useFonts();
  if (g < f("h2") + HANDOFF_HALF) return <Handoff2 g={g} />;
  const t = g / 30, { c } = camC(g);
  const W2 = 1920, H2 = 1080, mid: React.CSSProperties = { left: W2 / 2, top: H2 / 2 };

  // C1: the card
  const active = [k(g, "w:domne", 0.45, LIN), k(g, "w:email", 0.45, LIN), k(g, "w:med", 0.45, LIN)];
  const back = k(g, 39.9, 0.4, INOUT);
  const close = t < 41 ? clamp01((1600 / project(c, { x: CARD_C[0], y: CARD_C[1], z: CARD_C[2] }).dist - 1.25) / 0.5) : 0;

  // C7: the send button becomes the dot; the dots assemble on "Creoble."
  const back6 = k(g, 49.95, 0.4, INOUT) * (1 - k(g, 51.85, 0.4, INOUT));
  const lifted = t >= 52.28, m7 = k(g, 52.36, 0.35, INOUT), T_FLY = 52.68, T_C = f("w:creoble3") / 30;
  const fall = k(g, 52.45, 0.5, INOUT);
  const big = markDots(S_BIG, 0, 0);
  const pos7 = (tt: number): Dot => { const q = INOUT(clamp01((tt - T_FLY) / 0.52)); return { ...bez(B_O, big[0], 150, q), r: mix(42, big[0].r, q) }; };
  const ASM = { dur: 0.7, stagger: 0.04, bend: 170 }, tA = t - (T_C - ASM.dur - 5 * ASM.stagger);
  const FROM = [big[0], { x: -1050, y: -520, r: big[1].r }, { x: -1150, y: 260, r: big[2].r }, { x: -420, y: 900, r: big[3].r }, { x: 560, y: 880, r: big[4].r }, { x: 1150, y: 420, r: big[5].r }];
  const asm = assemble(tA, FROM, S_BIG, ((RING.x - BOX_C.x) * S_BIG) / 100, ((RING.y - BOX_C.y) * S_BIG) / 100, ASM);

  // C8–C10: the first lockup
  const cyA = -150 * k(g, "w:hjemmeside2", 0.65, INOUT);
  const T_DOWN = 56.6, d5 = markDots(LA.S, geo(LA).markX, -150)[5];
  const pos10 = (tt: number): Dot => { const q = INOUT(clamp01((tt - T_DOWN) / 0.5)); return { ...bez(d5, { x: rideX(f(T_DOWN + 0.5)), y: 8 }, -110, q), r: mix(d5.r, 12, q) }; };
  const rsA = [0, 1, 2, 3, 4].map((i) => 1 - k(g, 56.72 + i * 0.04, 0.35, INOUT)).concat(t < T_DOWN ? 1 : 0);

  // C10: the line with the dot riding after the last word
  const T_UP = 59.5, lineOut = 59.62, D10 = 0.3;
  const items10: KItem[] = L10.map(([tx, at, acc]) => ({ t: tx, at, accent: !!acc, out: lineOut, dur: D10 }));
  // the dot's place: just after the last word (Kinetic's own layout, replayed), moving ahead of each word as it arrives
  const rideX = (gg: number) => {
    const sp = 0.27 * TYPE.big; let width = 0, acc = 0, right = 0, accM = 0;
    for (const [tx, at, it] of L10) {
      const w = measure(tx, TYPE.big, !!it, true, 400, ready), u = gg - f(at), slot = INOUT(clamp01(u / (D10 * 27))), m = Math.max(slot, OUT(clamp01(u / (D10 * 27))));
      width += sp * slot * Math.min(1, acc) + w * slot; acc += slot;
      right += sp * m * Math.min(1, accM) + w * m; accM += m;
    }
    return -width / 2 + right + 0.2 * TYPE.big * Math.min(1, accM) + 12;
  };

  // C11: the final lockup
  const CY = -70, fin = markDots(LB.S, 0, CY);
  const pos11 = (tt: number): Dot => { const q = INOUT(clamp01((tt - T_UP) / 0.58)); return { ...bez({ x: rideX(f(T_UP)), y: 8 }, fin[0], 150, q), r: mix(12, fin[0].r, q) }; };
  const rsB = [t >= T_UP + 0.58 ? 1 : 0, ...[1, 2, 3, 4, 5].map((i) => k(g, 60.06 + (i - 1) * 0.07, 0.4, OUT))];
  const ctaA = typed(g, "w:byg2", CTA_A, 19), ctaB = typed(g, "w:creoble4", CTA_B, 17);

  // the type planes ride with the camera while it pulls back (so a word is never seen oversized), then stay put
  const ride = (to: V3, arrive: number, leave = 1e9) => {
    const w = INOUT(clamp01((t - arrive) / 0.6)) * (1 - INOUT(clamp01((t - leave) / 0.25))), q = mixV([c.x, c.y, c.z], to, w);
    return { x: q[0], y: q[1], z: q[2], ry: -c.ry * (1 - w), rx: c.rx * (1 - w) };
  };

  // cursors (screen space)
  const cq = project(c, { x: Q[0], y: Q[1] + CHAT_Y * (1 - k(g, 48.1, 0.6, INOUT)), z: Q[2] }), co = cursorAt(g, [{ at: 47.5, x: 420, y: 300 }, { at: 47.97, x: 8, y: 6 }, { at: 48.15, x: 8, y: 6 }, { at: 48.8, x: 600, y: 440 }]);
  const cb = project(c, { x: B[0], y: B[1], z: B[2] }), cbo = cursorAt(g, [{ at: 51.85, x: 330, y: 250 }, { at: 52.25, x: 18, y: 16 }]);

  return (
    <AbsoluteFill>
      <Stage3D cam={c}>
        {/* the hosting card (C1; soft behind C2 and C3) */}
        {t < 47.2 && (
          <Plane {...H2_CARD} w={CARD.w} h={CARD.h} opacity={1 - 0.75 * back} blur={9 * back} farBlur={close > 0.05 ? 7 * close : 0} farMask="linear-gradient(180deg, transparent 6%, #000 27%, #000 76%, transparent 96%)">
            <HostingCard g={g} rows={3} active={active} price={1} />
          </Plane>
        )}
        {/* C2: "Fast pris." → "Også når du fornyer."   C3: the pills */}
        {t > 39.9 && t < 47.2 && (
          <Plane {...ride(P, 40.37)} w={W2} h={H2} dof={false}>
            <Kinetic g={g} size={TYPE.hero} style={mid} items={W("Fast pris.", ["w:fast", "w:pris"], 0, "w:ogs-0.1", 0.42)} />
            <Kinetic g={g} size={TYPE.big} style={mid} items={W("Også når du fornyer.", ["w:ogs", "w:nr+0.1", "w:du4+0.06", "w:fornyer+0.1"], 3, "w:domnet-0.1", 0.3)} />
            <div style={{ position: "absolute", ...mid }}><Pills g={g} /></div>
          </Plane>
        )}
        {/* C5: the chat (soft behind C6; falls away in C7) */}
        {t > 47.7 && fall < 1 && (
          <Plane x={Q[0]} y={Q[1]} z={Q[2] - 1900 * fall} w={PANEL.w} h={PANEL.h} opacity={(1 - 0.75 * back6) * (1 - k(g, 52.5, 0.42, LIN))} blur={9 * back6}>
            <div style={{ position: "absolute", left: PANEL.w / 2, top: PANEL.h / 2 }}><Chat g={g} hideSend={lifted} /></div>
          </Plane>
        )}
        {/* C4: "Brug for hjælp?" */}
        {t > 46.9 && t < 48.4 && (
          <Plane x={Q[0]} y={Q[1]} z={Q[2] + 1} w={W2} h={H2} dof={false}>
            <Kinetic g={g} size={TYPE.hero} style={mid} items={W("Brug for hjælp?", ["w:brug", "w:for2", "w:hjlp"], 2, 47.92, 0.3)} />
          </Plane>
        )}
        {/* C6: "Ingen kø." → "Ingen robotsvar." */}
        {t > 50.1 && t < 52.2 && (
          <Plane {...ride(Q2, 50.67, 51.78)} w={W2} h={H2} dof={false}>
            <Kinetic g={g} size={TYPE.hero} style={mid} items={[{ t: "Ingen", at: "w:ingen4", out: 51.84, dur: 0.42 }, { t: "kø.", at: "w:k", accent: true, out: "w:ingen5", dur: 0.42 }, { t: "robotsvar.", at: "w:robotsvar", accent: true, out: 51.84 }]} />
          </Plane>
        )}
        {/* C7: the send button, lifted off the panel: it turns sage and becomes the dot */}
        {lifted && t < T_FLY && (
          <Plane x={B[0]} y={B[1]} z={B[2] + 2} w={2} h={2} dof={false}>
            <div style={{ position: "absolute", left: 1, top: 1 }}><SendButton abs={false} m={m7} p={press(g, 52.28)} /></div>
          </Plane>
        )}
        {/* C7: five dots fly in from depth and land on "Creoble." */}
        {t < T_C && tA > 0 && [1, 2, 3, 4, 5].map((i) => {
          const q = INOUT(clamp01((tA - i * ASM.stagger) / ASM.dur)), d = asm[i];
          return (
            <Plane key={i} x={Q[0] + d.x} y={Q[1] + d.y} z={Q[2] + (1 - q) * 700} w={d.r * 2} h={d.r * 2}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.sage }} />
            </Plane>
          );
        })}
        {/* the outro's plane */}
        {t >= T_FLY && (
          <Plane x={Q[0]} y={Q[1]} z={Q[2]} w={W2} h={H2}>
            <div style={{ position: "absolute", ...mid, width: 0, height: 0 }}>
              {t < T_C && <Dots dots={comet(pos7, t)} />}
              {t >= T_C && t < 57.3 && <Lockup L={LA} cy={cyA} s={k(g, 53.4, 0.7, INOUT)} wm={k(g, 53.42, 0.85, LIN) * (1 - k(g, 56.7, 0.45, LIN))} rs={rsA} />}
              {t > 54 && t < 57.4 && <Kinetic g={g} size={TYPE.line} style={{ top: 104 }} items={W("Hjemmeside og hosting, samlet ét sted.", ["w:hjemmeside2", "w:og2", "w:hosting", "w:samlet", "w:t", "w:sted"], 3, 56.7, 0.32)} />}
              {t >= T_DOWN && t < T_DOWN + 0.5 && <Dots dots={comet(pos10, t)} />}
              {t >= T_DOWN + 0.4 && t < 60.3 && <Kinetic g={g} size={TYPE.big} items={items10} />}
              {t >= T_DOWN + 0.5 && t < T_UP && <Dots dots={[{ x: rideX(g), y: 8, r: 12 }]} />}
              {t >= T_UP && t < T_UP + 0.58 && <Dots dots={comet(pos11, t)} />}
              {t >= T_UP && <Lockup L={LB} cy={CY} s={k(g, 60.62, 0.7, INOUT)} wm={k(g, 60.64, 0.85, LIN)} rs={rsB} />}
              {t >= 60 && (
                <div style={{ position: "absolute", left: 0, top: CY + 196, transform: "translate(-50%, -50%)", fontFamily: SANS, fontSize: 40, fontWeight: 400, letterSpacing: "-0.005em", whiteSpace: "pre", color: C.muted }}>
                  <span>{ctaA}</span><span style={{ color: C.ink, fontWeight: 500 }}>{ctaB}</span><span style={{ opacity: 0 }}>{CTA_A.slice(ctaA.length)}{CTA_B.slice(ctaB.length)}</span>
                </div>
              )}
            </div>
          </Plane>
        )}
      </Stage3D>
      {t > 47.5 && t < 48.8 && <Cursor x={cq.x + co.x} y={cq.y + co.y} press={press(g, 48.02)} size={44} opacity={k(g, 47.5, 0.2, LIN) * (1 - k(g, 48.5, 0.25, LIN))} />}
      {t > 51.95 && t < 52.6 && <Cursor x={cb.x + cbo.x} y={cb.y + cbo.y} press={press(g, 52.28)} size={76} opacity={k(g, 51.95, 0.15, LIN) * (1 - k(g, 52.42, 0.15, LIN))} />}
    </AbsoluteFill>
  );
};
