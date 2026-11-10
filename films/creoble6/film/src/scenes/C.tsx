// Scene C (h2 37.92 s → end 65.18 s), revision 1: the rows turn green, the price holds at renewal (on the card), the
// pills dock beside the card, the support chat, and the outro after the reference: the clicked button becomes the
// dot, the dot flies on a trail, rides after the words, becomes the logo mark, the wordmark slides out and the URL
// types below (plan/contract.md, REVISION 1 + C1–C11).
// One world, one camera. Every shot is "look at a target from a distance" (shotCam). The camera is a sum of eased
// moves whose windows overlap (MOVES), so it never comes to rest: each move grows out of the previous one.
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { Stage3D, Plane, cam, project, Cam } from "../cam";
import { TYPE, ACCENT, measure, useFonts } from "../type";
import { Dots, dotsAt, RING, BOX_C, Icon, Spinner } from "../dots";
import { CARD, CARD_ROWS, CARD_R, SiteWindow, SITE_WIN, Cursor, cursorAt, Handoff2, camH2, H2_CARD, HANDOFF_HALF } from "../ui";
import { f, typed, press, Ico, Wordmark, C, LIN, SANS, SERIF, SHADOW, SHADOW_BIG, clamp01, mix } from "../shared";

// Revision 2: everything glides. S = a sine ease (the gentlest start and stop, peak speed 1.57× the mean) for the
// camera, carries and departures; G = a soft start with a long landing, for arrivals. No OUT (it starts at full speed).
const S = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(u));
const GB = Easing.bezier(0.4, 0, 0.2, 1), G = (u: number) => GB(clamp01(u));
const sec = (at: string | number) => f(at) / 30;
// k: progress 0..1 of a move of `dur` seconds from `at` (label or seconds)
const k = (g: number, at: string | number, dur: number, ease: (u: number) => number = G) => ease(clamp01((g - f(at)) / (dur * 30)));

// motion blur: only around the fastest part of the transitions (each ≤ 0.8 s)
export const BLUR: [number, number][] = [
  [46.4, 47.1],     // the glide from the card to "Brug for hjælp?"
  [51.6, 52.3],     // the glide in to the send button
  [52.55, 53.3],    // the dot's flight and the dots assembling
];

/* ---------- the world ---------- */
type V3 = [number, number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const cardPt = (lx: number, ly: number): V3 => [H2_CARD.x + lx * Math.cos(rad(3)), H2_CARD.y + ly, H2_CARD.z + lx * Math.sin(rad(3))];
const CARD_C: V3 = [H2_CARD.x, H2_CARD.y, H2_CARD.z];
const EXT = 140;                                 // the card grows by this for the two price rows
const PILL_X = 580;                              // the pills' left edge, right of the card
const GROUP: V3 = [366, 70, -100];
const Q: V3 = [2400, 0, 600];                   // the chat; later the outro's plane
const Q6: V3 = [Q[0] - 520, Q[1] - 420, Q[2]];   // where the camera looks in C6: clean cream, the panel small at the lower right
const PANEL = { w: 820, h: 640 };
const SEND = { x: 728, y: 548, s: 64 };                                  // the send button in the panel
const B_O = { x: SEND.x + SEND.s / 2 - PANEL.w / 2, y: SEND.y + SEND.s / 2 - PANEL.h / 2 };   // its centre, from the panel's centre
const B: V3 = [Q[0] + B_O.x, Q[1] + B_O.y, Q[2]];

/* ---------- the camera ---------- */
// a pose: target (3), distance beyond natural size, ry, rx, aperture, focus point (3)
type Pose = { t: V3; d: number; ry: number; rx: number; ap: number; fo: V3 };
// the target sits on the optical axis, d px beyond the natural-size distance (d < 0 = closer: scale 1600 / (1600 + d))
const shotCam = (s: Pose): Cam => {
  const a = rad(s.ry), b = rad(s.rx);
  const c = cam({ x: s.t[0] - s.d * Math.cos(b) * Math.sin(a), y: s.t[1] - s.d * Math.sin(b), z: s.t[2] + s.d * Math.cos(b) * Math.cos(a), rx: s.rx, ry: s.ry, ap: s.ap });
  c.focus = project(c, { x: s.fo[0], y: s.fo[1], z: s.fo[2] }).dist;
  return c;
};
const sc = (scale: number) => 1600 / scale - 1600;   // the distance for an on-screen scale
const START: Pose = { t: cardPt(6, -10), d: sc(1.62), ry: 5, rx: 2, ap: 14, fo: CARD_C };   // the rows, close (reached out of the hand-off)
const T_START = 39.8;                                                                       // the hand-off blend ends here
// MOVES: each move takes the pose to `p` (only the fields it names) between s and e with the sine ease; the windows
// overlap, so position and velocity are continuous and the camera never comes to rest.
type Move = { s: number; e: number; p: Partial<Pose>; n: string };
const QY: V3 = [Q[0], Q[1] + 6, Q[2]];
const MOVES: Move[] = [
  { n: "C1-C2 glide down the rows to the price rows", s: 39.1, e: 41.4, p: { t: cardPt(10, 345), d: sc(1.7), ry: -2 } },
  { n: "C3 ease back to card + pills", s: 40.9, e: 43.3, p: { t: GROUP, d: sc(0.8), ry: -6, rx: 0, ap: 12, fo: GROUP } },
  { n: "C3 slow push and orbit", s: 42.8, e: 46.6, p: { d: sc(0.93), ry: 6 } },
  { n: "C4 glide to the support world", s: 45.8, e: 47.7, p: { t: Q, d: 0, ry: -3, ap: 16, fo: Q } },
  { n: "C5 push on the chat", s: 47.3, e: 49.8, p: { t: QY, d: sc(1.28), ry: 3, rx: 1 } },
  { n: "C6 glide to clean cream beside the panel", s: 49.2, e: 51.0, p: { t: Q6, d: sc(0.62), ry: -3, rx: 0 } },
  { n: "C7 glide in to the send button", s: 51.25, e: 52.8, p: { t: [B[0] - 90, B[1] - 20, B[2]], d: sc(1.65), ry: 5, rx: 2 } },
  { n: "C7 ease out to the logo", s: 52.0, e: 54.0, p: { t: Q, d: 0, ry: 0, rx: 0, ap: 14 } },
  { n: "C8-C9 slow push", s: 53.7, e: 56.6, p: { d: -45, ry: -3 } },
  { n: "C10 ease back for the line", s: 56.1, e: 57.8, p: { d: 110, ry: 2 } },
  { n: "C10 slow push under the line", s: 57.3, e: 60.0, p: { d: -60, ry: -2 } },
  { n: "C11 ease back for the end card", s: 59.5, e: 61.5, p: { t: QY, d: 240, ry: 2 } },
  { n: "C11 slow push to the end", s: 60.9, e: 65.9, p: { d: -200, ry: -3 } },
];
const vec = (p: Pose) => [...p.t, p.d, p.ry, p.rx, p.ap, ...p.fo];
const unvec = (v: number[]): Pose => ({ t: [v[0], v[1], v[2]], d: v[3], ry: v[4], rx: v[5], ap: v[6], fo: [v[7], v[8], v[9]] });
const STEPS = (() => { let prev = START; return MOVES.map((m) => { const next = { ...prev, ...m.p }, a = vec(prev), b = vec(next); prev = next; return { s: m.s, e: m.e, d: b.map((x, i) => x - a[i]) }; }); })();
const poseAt = (t: number): Pose => {
  const v = vec(START);
  for (const st of STEPS) { const q = S((t - st.s) / (st.e - st.s)); if (q > 0) for (let i = 0; i < v.length; i++) v[i] += st.d[i] * q; }
  return unvec(v);
};
const lerpCam = (a: Cam, b: Cam, q: number): Cam => ({ x: mix(a.x, b.x, q), y: mix(a.y, b.y, q), z: mix(a.z, b.z, q), rx: mix(a.rx, b.rx, q), ry: mix(a.ry, b.ry, q), rz: mix(a.rz, b.rz, q), focus: mix(a.focus, b.focus, q), ap: mix(a.ap, b.ap, q) });
const camC = (g: number): { c: Cam; s: Pose } => {
  const t = g / 30, s = poseAt(t);
  // a slow breath on top of every shot (the target stays centred)
  s.ry += 1.1 * Math.sin((t / 7.3) * Math.PI * 2);
  s.rx += 0.6 * Math.sin((t / 9.7) * Math.PI * 2 + 1);
  let c = shotCam(s);
  const t0 = (f("h2") + HANDOFF_HALF) / 30, u = S((t - t0) / (T_START - t0));
  if (u < 1) { c = lerpCam(camH2(g), c, u); c.focus = project(c, { x: CARD_C[0], y: CARD_C[1], z: CARD_C[2] }).dist; }   // out of the hand-off: camH2's drift blends into the first shot
  return { c, s };
};

/* ---------- small pieces ---------- */
const bez = (a: { x: number; y: number }, b: { x: number; y: number }, bend: number, q: number) => {
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, mx = (a.x + b.x) / 2 - (dy / L) * bend, my = (a.y + b.y) / 2 + (dx / L) * bend, u = 1 - q;
  return { x: u * u * a.x + 2 * u * q * mx + q * q * b.x, y: u * u * a.y + 2 * u * q * my + q * q * b.y };
};
type Dot = { x: number; y: number; r: number; o?: number };
// comet: the dot with a short fading trail of ghosts (where it was a moment ago)
const comet = (pos: (t: number) => Dot, t: number, n = 8, dt = 0.016): Dot[] => {
  const out: Dot[] = [];
  for (let j = n; j >= 1; j--) { const p = pos(t - j * dt); out.push({ ...p, r: p.r * (1 - 0.075 * j), o: 0.3 * (1 - j / (n + 1)) }); }
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

// CardC: the kit's hosting card, drawn here so it can grow (ext 0..1) for two rows under the price: "I dag" and
// "Ved fornyelse", the same price twice, with a small sage "=" between them (eq). At ext 0 it is the kit's card.
const CardC: React.FC<{ g: number; active: number[]; ext?: number; rowA?: number; rowB?: number; eq?: number }> = ({ g, active, ext = 0, rowA = 0, rowB = 0, eq = 0 }) => (
  <div style={{ position: "relative", width: CARD.w, height: CARD.h + EXT * ext, borderRadius: 24, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 64, top: 56, fontSize: 15, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>Hosting</div>
    <div style={{ position: "absolute", left: 64, top: 86, fontFamily: SERIF, fontSize: 52, letterSpacing: "-0.025em", lineHeight: 1.1 }}>holmfysio.dk</div>
    {CARD_ROWS.map(([l, v], i) => {
      const a = S(active[i] ?? 0), r = CARD_R.rows[i];
      return (
        <div key={l} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center" }}>
          <div><div style={{ fontSize: 17, color: C.muted }}>{l}</div><div style={{ marginTop: 4, fontSize: 25, fontWeight: 500, letterSpacing: "-0.01em" }}>{v}</div></div>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", height: 44, width: 168, borderRadius: 999, overflow: "hidden", background: `color-mix(in srgb, ${C.sageTint} ${a * 100}%, #F1EEE8)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 17, fontWeight: 500 }}>
            {a < 1 && <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 1 - a, position: "absolute", transform: `translateY(${-a * 40}px)` }}>
              <div style={{ position: "relative", width: 22, height: 22 }}><div style={{ position: "absolute", left: 11, top: 11 }}><Spinner g={g + i * 7} size={24} color="#9C968E" /></div></div>
              <span style={{ color: C.muted }}>Sætter op</span></div>}
            {a > 0 && <div style={{ display: "flex", alignItems: "center", gap: 9, opacity: a, position: "absolute", color: C.sageDeep, transform: `translateY(${(1 - a) * 40}px)` }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="check" s={16} c={C.white} w={3} /></div>Aktiv</div>}
          </div>
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 64, top: 498, width: 872, height: 1, background: C.line }} />
    <div style={{ position: "absolute", left: 64, top: 528 }}>
      <div style={{ fontFamily: SERIF, fontSize: 54, letterSpacing: "-0.025em", lineHeight: 1 }}>Fra 83 kr.<span style={{ fontSize: 30, color: C.muted }}> /md.</span></div>
      <div style={{ marginTop: 10, fontSize: 16, color: C.muted }}>faktureres årligt</div>
    </div>
    <div style={{ position: "absolute", left: 744, top: 540, width: 192, height: 60, borderRadius: 12, background: C.ink, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 500 }}>Sæt online</div>
    {/* the two price rows */}
    <div style={{ position: "absolute", left: 64, top: 634, width: 872, height: 1, background: C.line, opacity: clamp01(ext * 2) }} />
    {([["I dag", rowA], ["Ved fornyelse", rowB]] as [string, number][]).map(([l, q], i) => (
      <div key={l} style={{ position: "absolute", left: 64, top: 646 + i * 64, width: 872, height: 64, display: "flex", alignItems: "center", opacity: q, transform: `translateY(${((1 - q) * 18).toFixed(2)}px)` }}>
        <span style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.01em" }}>{l}</span><div style={{ flex: 1 }} />
        <span style={{ fontFamily: SERIF, fontSize: 34, letterSpacing: "-0.02em" }}>83 kr.<span style={{ fontSize: 21, color: C.muted }}> /md.</span></span>
      </div>
    ))}
    <div style={{ position: "absolute", left: 936 - 236, top: 710 - 17, width: 34, height: 34, borderRadius: 17, background: C.sage, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 600, lineHeight: 1,
      opacity: eq, transform: `scale(${mix(0.6, 1, eq).toFixed(3)})` }}><span style={{ marginTop: -3 }}>=</span></div>
  </div>
);

// the pills: a left-aligned stack beside the card (origin = the stack's left edge, vertical centre); each glides out
// from the card's edge on its phrase and the stack re-centres as it joins
const PILLS: [string, string][] = [["Domænet i dit navn", "w:domnet"], ["Servere i Europa", "w:servere"], ["Ingen binding", "w:ingen3"]];
const Pills: React.FC<{ g: number }> = ({ g }) => {
  const join = PILLS.map(([, at]) => k(g, sec(at) - 0.1, 1.1, S)), n1 = join[1] + join[2];
  return (
    <>
      {PILLS.map(([text, at], i) => {
        const a = k(g, sec(at) - 0.1, 1.2, G), out = k(g, 45.9, 1.5, S);
        if (a <= 0 || out >= 1) return null;
        const y = (i - n1 / 2) * 150;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${(-(1 - a) * 90).toFixed(2)}px, ${y.toFixed(2)}px) translateY(-50%)`, opacity: clamp01(a * 1.4) * (1 - out),
            height: 120, borderRadius: 60, boxSizing: "border-box", padding: "0 60px 0 46px", background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`,
            display: "flex", alignItems: "center", gap: 24, fontFamily: SANS, fontWeight: 500, fontSize: 56, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap" }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: C.sage, flex: "none" }} />{text}
          </div>
        );
      })}
    </>
  );
};

const chatY = (m: number) => 190 * (1 - S((m - 0.3) / 0.7));
const T_CLICK5 = 47.95, T_OPEN = 47.98, D_OPEN = 1.3, T_CLICK7 = 52.3;
const REPLY = "Selvfølgelig. Jeg kigger på det med det samme.";
// the chat: the wizard's sage chat button opens into the panel (one shape); hideSend when the outro lifts the button
const Chat: React.FC<{ g: number; hideSend: boolean }> = ({ g, hideSend }) => {
  const a = k(g, 47.1, 0.9, G), m = k(g, T_OPEN, D_OPEN, S), dip = press(g, T_CLICK5);
  const w = mix(120, PANEL.w, m), h = mix(120, PANEL.h, m), body = clamp01((m - 0.45) / 0.55);
  const up = (at: number | string, dur = 0.9): React.CSSProperties => { const q = k(g, at, dur, G); return { opacity: q, transform: `translateY(${((1 - q) * 14).toFixed(2)}px)` }; };
  const reply = typed(g, "w:forstr+0.05", REPLY, 60);
  return (
    <div style={{ position: "absolute", left: -w / 2, top: -h / 2 + chatY(m), width: w, height: h, borderRadius: mix(60, 28, m), overflow: "hidden", opacity: clamp01(a * 1.6),
      transform: `scale(${(mix(0.6, 1, a) * (1 - 0.06 * dip)).toFixed(4)})`, background: `color-mix(in srgb, ${C.white} ${(clamp01(m * 1.7) * 100).toFixed(1)}%, ${C.sageDark})`,
      boxShadow: `0 0 0 1px rgba(232,229,223,${clamp01(m * 2).toFixed(3)}), ${m > 0.5 ? SHADOW_BIG : SHADOW}` }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: 1 - clamp01(m * 3) }}><Ico n="chat" s={58} c={C.white} w={2.2} /></div>
      <div style={{ position: "absolute", left: (w - PANEL.w) / 2, top: (h - PANEL.h) / 2, width: PANEL.w, height: PANEL.h, opacity: body, fontFamily: SANS, color: C.ink }}>
        {/* header */}
        <div style={{ position: "absolute", left: 54, top: 44 }}><Icon size={44} /></div>
        <div style={{ position: "absolute", left: 92, top: 27, fontSize: 25, fontWeight: 600, letterSpacing: "-0.01em" }}>Creoble <span style={{ fontWeight: 400, color: C.muted }}>Support</span></div>
        <div style={{ position: "absolute", left: 0, top: 88, width: PANEL.w, height: 1, background: C.line }} />
        {/* the customer */}
        <div style={{ position: "absolute", right: 32, top: 122, padding: "17px 26px", borderRadius: "26px 26px 8px 26px", background: C.sageTint, fontSize: 27, whiteSpace: "nowrap", ...up(48.4) }}>Kan I hjælpe med min e-mail?</div>
        {/* the person */}
        <div style={{ position: "absolute", left: 32, top: 246, width: 64, height: 64, borderRadius: 32, background: C.sage, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 600, letterSpacing: "0.02em", ...up(48.55) }}>SL</div>
        <div style={{ position: "absolute", left: 114, top: 232, fontSize: 21, fontWeight: 500, color: C.muted, ...up(48.6) }}>Sofie</div>
        <div style={{ position: "absolute", left: 112, top: 268, width: 584, boxSizing: "border-box", padding: "20px 28px", borderRadius: "8px 26px 26px 26px", background: C.white, boxShadow: `0 0 0 1px ${C.line}, 0 1px 2px rgba(26,22,20,0.04)`,
          fontSize: 34, lineHeight: 1.36, letterSpacing: "-0.01em", ...up("w:forstr-0.25", 0.8) }}>
          <span>{reply}</span><span style={{ opacity: 0 }}>{REPLY.slice(reply.length)}</span>
        </div>
        {/* the input row */}
        <div style={{ position: "absolute", left: 28, top: SEND.y, width: SEND.x - 28 - 14, height: SEND.s, boxSizing: "border-box", borderRadius: 16, background: C.white, border: `1px solid #E1DDD6`, display: "flex", alignItems: "center", padding: "0 22px" }}>
          <div style={{ width: 2, height: 28, background: C.ink, opacity: 0.45 + 0.4 * Math.cos((g / 30) * Math.PI * 2) }} />
        </div>
        {!hideSend && <SendButton p={press(g, T_CLICK7)} />}
      </div>
    </div>
  );
};
const SendButton: React.FC<{ p?: number; m?: number; abs?: boolean; k?: number }> = ({ p = 0, m = 0, abs = true, k: kk = 1 }) => {
  const s = mix(SEND.s, 84, m) * kk;
  return (
    <div style={{ position: "absolute", left: abs ? SEND.x : -s / 2, top: abs ? SEND.y : -s / 2, width: s, height: s, borderRadius: mix(16, 42, m), background: `color-mix(in srgb, ${C.sage} ${(m * 100).toFixed(1)}%, ${C.ink})`,
      display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${(1 - 0.07 * p).toFixed(4)})` }}>
      <Ico n="arrow" s={30} c={C.white} w={2.4} style={{ transform: "rotate(-90deg)", opacity: 1 - clamp01(m * 2.5) }} />
    </div>
  );
};

/* ---------- kinetic type that glides (the kit's Kinetic with soft eases) ---------- */
// One centred line, Fraunces 400, one accent word. Each word rises through its mask with a soft start and a long
// landing (dur, default 0.85 s) and sits at its final place in the line from the start, so quick words never
// overlap; the line re-centres with a sine ease. A word with `out` rises out the top (outDur) and the line closes up.
// Times are seconds; a word starts LEAD before its label, so it is visibly arriving on the spoken word.
type KW = { t: string; at: number; out?: number; accent?: boolean; dur?: number; outDur?: number; keep?: boolean };
const LEAD = 0.12, SPACE = 0.27;
const layoutK = (g: number, items: KW[], size: number, ready: boolean) => {
  const sp = SPACE * size;
  const st = items.map((it, i) => {
    const w = measure(it.t, size, !!it.accent, true, 400, ready) + (i > 0 ? sp : 0), a = it.at * 30, dur = (it.dur ?? 0.85) * 30, o = it.out !== undefined ? it.out * 30 : Infinity, od = (it.outDur ?? 0.75) * 30;
    const close = it.keep ? 0 : S((g - o - 3) / od);
    return { it, w, vis: G((g - a) / dur), gone: S((g - o) / od), slot: S((g - a) / (dur * 0.9)) * (1 - close), pres: (g >= a ? 1 : 0) * (1 - close), lead: S((g - a) / 16) * (1 - close) };
  });
  const width = st.reduce((acc, x) => acc + x.slot * x.w, 0);
  let cum = 0;
  const lefts = st.map((x, i) => { const l = cum + (i > 0 ? sp : 0); cum += x.pres * x.w; return l - width / 2; });
  const lead = st.reduce((acc, x) => acc + x.lead * x.w, 0) - width / 2;   // the end of the line, running ahead of each arriving word
  return { st, lefts, sp, lead, any: Math.min(1, st.reduce((acc, x) => acc + x.lead, 0)) };
};
const KineticC: React.FC<{ g: number; items: KW[]; size: number; style?: React.CSSProperties }> = ({ g, items, size, style }) => {
  const ready = useFonts(), L = layoutK(g, items, size, ready), lh = size * 1.25, pad = size * 0.16;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, ...style }}>
      {L.st.map((s, i) => {
        if (s.vis <= 0 || s.gone >= 1) return null;
        const y = (1 - s.vis) * size * 0.9 - s.gone * size * 0.95, w = s.w - (i > 0 ? L.sp : 0);
        return (
          <div key={i} style={{ position: "absolute", left: L.lefts[i] - pad, top: -lh / 2, width: w + 2 * pad, height: lh, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: pad, top: 0, height: lh, transform: `translateY(${y.toFixed(2)}px)`, fontFamily: SERIF, fontWeight: 400, fontSize: size, lineHeight: `${lh}px`,
              letterSpacing: "-0.02em", whiteSpace: "nowrap", color: s.it.accent ? ACCENT : C.ink, fontStyle: s.it.accent ? "italic" : "normal" }}>{s.it.t}</div>
          </div>
        );
      })}
    </div>
  );
};
// the wordmark's reveal, re-timed so it starts moving at once (the kit eases it in slowly), the stop landing last
const wmP = (u: number) => (u < 0.78 ? 0.75 * Math.pow(u / 0.78, 0.6) : 0.75 + 0.25 * S((u - 0.78) / 0.22));
const KW_ = (text: string, at: string[], accent: number, out: number, o: Partial<KW> = {}): KW[] => text.split(" ").map((tx, i) => ({ t: tx, at: sec(at[i]) - LEAD, accent: accent === i, out: out + i * 0.04, keep: true, ...o }));
const HELP = KW_("Brug for hjælp?", ["w:brug", "w:for2", "w:hjlp"], 2, 47.85);
const NOQ: KW[] = [
  { t: "Ingen", at: sec("w:ingen4") - LEAD, out: 51.72, outDur: 0.95, keep: true },
  { t: "kø.", at: sec("w:k") - LEAD, accent: true, out: 50.95, outDur: 0.6 },
  { t: "robotsvar.", at: sec("w:robotsvar") - LEAD, accent: true, out: 51.78, dur: 0.7, outDur: 0.95, keep: true },
];
const T_UP = 59.6, LINE_OUT = 59.6;
const L10 = KW_("Byg den. Se den. Så køber du.", ["w:byg", "w:den3", "w:se", "w:den4", "w:s2", "w:kber", "w:du5"], 5, LINE_OUT, { outDur: 0.8, dur: 0.7 });
const CTA_A = "Byg din side gratis på ", CTA_B = "creoble.dk";
// C9: the site window and the hosting card under the lockup, the same height, as large as SAFE allows
const PAIR_H = 480, PAIR = { y: 113, sSite: PAIR_H / SITE_WIN.h, sCard: PAIR_H / CARD.h, gap: 70 };
const PAIR_W = { site: SITE_WIN.w * PAIR.sSite, card: CARD.w * PAIR.sCard };

/* ---------- the scene ---------- */
export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  const ready = useFonts();
  if (g < f("h2") + HANDOFF_HALF) return <Handoff2 g={g} />;
  const t = g / 30, { c } = camC(g);
  const W2 = 1920, H2 = 1080, mid: React.CSSProperties = { left: W2 / 2, top: H2 / 2 };

  // C1: the rows turn green.   C2: the card grows; the same price today and at renewal
  const active = [k(g, "w:domne", 0.5, LIN), k(g, "w:email", 0.5, LIN), k(g, "w:med", 0.5, LIN)];
  const ext = k(g, 39.2, 1.5, S), rowA = k(g, sec("w:fast") - 0.1, 1.0), rowB = k(g, sec("w:fornyer") - 0.1, 1.0), eq = k(g, sec("w:fornyer") + 0.5, 0.7);
  const cardOut = k(g, 45.9, 1.6, S);

  // C6–C7: the panel small and faint beside the type; then the send button becomes the dot
  const back6 = k(g, 49.55, 0.9, S) * (1 - k(g, 51.7, 0.8, S));
  const drift6 = k(g, 51.3, 1.2, S);
  const lifted = t >= T_CLICK7, m7 = k(g, T_CLICK7 + 0.04, 0.34, S), T_FLY = 52.38, T_C = sec("w:creoble3"), D_FLY = T_C - 0.02 - T_FLY, T_SWAP = T_CLICK7 + 0.4;
  const fall = k(g, 52.2, 1.5, S);
  const big = markDots(S_BIG, 0, 0);
  const pos7 = (tt: number): Dot => { const q = S((tt - T_FLY) / D_FLY); return { ...bez(B_O, big[0], 150, q), r: mix(42, big[0].r, q) }; };
  // five dots fly in from depth on soft arcs and land in turn, the last exactly on "Creoble."
  const ASM = { dur: 1.0, stagger: 0.05 }, T_ASM = T_C - ASM.dur - 5 * ASM.stagger;
  const FROM = [big[0], { x: -1050, y: -520 }, { x: -1150, y: 260 }, { x: -420, y: 900 }, { x: 560, y: 880 }, { x: 1150, y: 420 }];
  const asm = [1, 2, 3, 4, 5].map((i) => { const q = S((t - T_ASM - i * ASM.stagger) / ASM.dur); return { ...bez(FROM[i], big[i], i % 2 ? -170 : 170, q), r: big[i].r, q }; });

  // C8–C9: the first lockup; under it the site and the hosting card come together
  const CY_A = -265, cyA = CY_A * k(g, 53.6, 1.3, S);
  const siteIn = k(g, sec("w:hjemmeside2") - 0.1, 1.1), cardIn = k(g, sec("w:hosting") - 0.1, 1.1), join = k(g, 55.2, 1.1, S), pairOut = k(g, 56.3, 1.0, S);
  const tot = PAIR_W.site + PAIR_W.card, siteX = -tot / 2 + PAIR_W.site / 2 - (1 - join) * PAIR.gap / 2 - (1 - siteIn) * 200, cardX = tot / 2 - PAIR_W.card / 2 + (1 - join) * PAIR.gap / 2 + (1 - cardIn) * 200;
  const pairY = PAIR.y + pairOut * 110;
  const T_DOWN = 56.2, D_DOWN = 0.9, d5 = markDots(LA.S, geo(LA).markX, CY_A)[5];
  const rsA = [0, 1, 2, 3, 4].map((i) => 1 - k(g, 56.3 + i * 0.06, 0.8, S)).concat(t < T_DOWN ? 1 : 0);

  // C10: the line with the dot riding after the last word
  const D_UP = 0.9;
  const rideX = (gg: number) => { const L = layoutK(gg, L10, TYPE.big, ready); return L.lead + 0.2 * TYPE.big * L.any + 12; };
  const pos10 = (tt: number): Dot => { const q = S((tt - T_DOWN) / D_DOWN); return { ...bez(d5, { x: rideX((T_DOWN + D_DOWN) * 30), y: 8 }, -130, q), r: mix(d5.r, 12, q) }; };

  // C11: the final lockup
  const CY = -70, fin = markDots(LB.S, 0, CY);
  const pos11 = (tt: number): Dot => { const q = S((tt - T_UP) / D_UP); return { ...bez({ x: rideX(T_UP * 30), y: 8 }, fin[0], 170, q), r: mix(12, fin[0].r, q) }; };
  const rsB = [t >= T_UP + D_UP ? 1 : 0, ...[1, 2, 3, 4, 5].map((i) => k(g, 60.5 + (i - 1) * 0.09, 0.8))];
  const ctaA = typed(g, "w:byg2", CTA_A, 19), ctaB = typed(g, "w:creoble4", CTA_B, 17);

  // a type plane rides with the camera (natural size, facing it); from `arrive` it settles into the world (w → 1)
  const ride = (to: V3, arrive: number) => {
    const w = S((t - arrive) / 1.0), q = mixV([c.x, c.y, c.z], to, w);
    return { x: q[0], y: q[1], z: q[2], ry: -c.ry * (1 - w), rx: c.rx * (1 - w) };
  };

  // cursors (screen space)
  const cq = project(c, { x: Q[0], y: Q[1] + chatY(k(g, T_OPEN, D_OPEN, S)), z: Q[2] }), co = cursorAt(g, [{ at: 47.05, x: 420, y: 300 }, { at: 47.9, x: 8, y: 6 }, { at: 48.1, x: 8, y: 6 }, { at: 49.2, x: 600, y: 440 }]);
  const p7 = pos7(t), cb = project(c, { x: B[0], y: B[1], z: B[2] }), cbo = cursorAt(g, [{ at: 51.5, x: 300, y: 230 }, { at: T_CLICK7 - 0.04, x: 16, y: 14 }]);

  return (
    <AbsoluteFill>
      <Stage3D cam={c}>
        {/* the hosting card (C1–C3); it glides away with the pills */}
        {t < 47.3 && (
          <Plane {...H2_CARD} y={H2_CARD.y + EXT / 2} w={CARD.w} h={CARD.h + EXT} opacity={1 - cardOut}>
            <CardC g={g} active={active} ext={ext} rowA={rowA} rowB={rowB} eq={eq} />
          </Plane>
        )}
        {/* C3: the pills, docked beside the card */}
        {t > 41.9 && t < 47.3 && (
          <Plane x={PILL_X + 400} y={GROUP[1]} z={H2_CARD.z + 20} ry={-5} w={800} h={500}>
            <div style={{ position: "absolute", left: 0, top: 250 }}><Pills g={g} /></div>
          </Plane>
        )}
        {/* C5: the chat (small and faint beside the type in C6; falls away in C7) */}
        {t > 47.05 && fall < 1 && (
          <Plane x={Q[0]} y={Q[1]} z={Q[2] - 1500 * fall} w={PANEL.w} h={PANEL.h} opacity={(1 - 0.75 * back6) * (1 - k(g, 52.4, 1.1, S))} blur={8 * back6}>
            <div style={{ position: "absolute", left: PANEL.w / 2, top: PANEL.h / 2 }}><Chat g={g} hideSend={lifted} /></div>
          </Plane>
        )}
        {/* C4: "Brug for hjælp?" */}
        {t > 46.8 && t < 48.8 && (
          <Plane {...ride([Q[0], Q[1], Q[2] + 1], 47.7)} w={W2} h={H2} dof={false}>
            <KineticC g={g} size={TYPE.hero} style={mid} items={HELP} />
          </Plane>
        )}
        {/* C6: "Ingen kø." → "Ingen robotsvar." (rides with the camera: always at its natural size) */}
        {t > 50 && t < 52.5 && (
          <Plane {...ride(Q6, 1e9)} w={W2} h={H2} dof={false} style={{ translate: `${(-160 * drift6).toFixed(1)}px ${(-250 * drift6).toFixed(1)}px` }}>
            <KineticC g={g} size={TYPE.hero} style={mid} items={NOQ} />
          </Plane>
        )}
        {/* C7: the send button, lifted off the panel: it turns sage and becomes the dot */}
        {lifted && t < T_SWAP && (
          <Plane x={Q[0] + p7.x} y={Q[1] + p7.y} z={Q[2] + 2} w={2} h={2} dof={false}>
            <div style={{ position: "absolute", left: 1, top: 1 }}><SendButton abs={false} m={m7} p={press(g, T_CLICK7)} k={p7.r / 42} /></div>
          </Plane>
        )}
        {/* C7: five dots fly in from depth and land on "Creoble." */}
        {t < T_C && t > T_ASM && asm.map((d, i) => (
          <Plane key={i} x={Q[0] + d.x} y={Q[1] + d.y} z={Q[2] + (1 - d.q) * 600} w={d.r * 2} h={d.r * 2}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.sage }} />
          </Plane>
        ))}
        {/* C9: the site and the hosting card, gliding in and together under the lockup */}
        {t > 54 && pairOut < 1 && siteIn > 0 && (
          <Plane x={Q[0] + siteX} y={Q[1] + pairY} z={Q[2] - 40 * (1 - join)} ry={10 * (1 - join)} w={SITE_WIN.w} h={SITE_WIN.h} scale={PAIR.sSite} opacity={clamp01(siteIn * 1.4) * (1 - pairOut)}>
            <SiteWindow />
          </Plane>
        )}
        {t > 54.7 && pairOut < 1 && cardIn > 0 && (
          <Plane x={Q[0] + cardX} y={Q[1] + pairY} z={Q[2] - 40 * (1 - join)} ry={-10 * (1 - join)} w={CARD.w} h={CARD.h} scale={PAIR.sCard} opacity={clamp01(cardIn * 1.4) * (1 - pairOut)}>
            <CardC g={g} active={[1, 1, 1]} />
          </Plane>
        )}
        {/* the outro's plane */}
        {t >= T_SWAP && (
          <Plane x={Q[0]} y={Q[1]} z={Q[2]} w={W2} h={H2}>
            <div style={{ position: "absolute", ...mid, width: 0, height: 0 }}>
              {t < T_C && <Dots dots={comet(pos7, t)} />}
              {t >= T_C && t < 57.4 && <Lockup L={LA} cy={cyA} s={k(g, 53.3, 1.3, S)} wm={wmP(k(g, 53.3, 1.4, LIN)) * (1 - k(g, 56.25, 0.9, LIN))} rs={rsA} />}
              {t >= T_DOWN && t < T_DOWN + D_DOWN && <Dots dots={comet(pos10, t)} />}
              {t >= T_DOWN + D_DOWN - 0.3 && t < 60.7 && <KineticC g={g} size={TYPE.big} items={L10} />}
              {t >= T_DOWN + D_DOWN && t < T_UP && <Dots dots={[{ x: rideX(g), y: 8, r: 12 }]} />}
              {t >= T_UP && t < T_UP + D_UP && <Dots dots={comet(pos11, t)} />}
              {t >= T_UP && <Lockup L={LB} cy={CY} s={k(g, 60.85, 1.4, S)} wm={wmP(k(g, 60.85, 1.5, LIN))} rs={rsB} />}
              {t >= 60 && (
                <div style={{ position: "absolute", left: 0, top: CY + 196, transform: "translate(-50%, -50%)", fontFamily: SANS, fontSize: 40, fontWeight: 400, letterSpacing: "-0.005em", whiteSpace: "pre", color: C.muted }}>
                  <span>{ctaA}</span><span style={{ color: C.ink, fontWeight: 500 }}>{ctaB}</span><span style={{ opacity: 0 }}>{CTA_A.slice(ctaA.length)}{CTA_B.slice(ctaB.length)}</span>
                </div>
              )}
            </div>
          </Plane>
        )}
      </Stage3D>
      {t > 47.05 && t < 49.2 && <Cursor x={cq.x + co.x} y={cq.y + co.y} press={press(g, T_CLICK5)} size={44} opacity={k(g, 47.05, 0.4, S) * (1 - k(g, 48.5, 0.6, S))} />}
      {t > 51.7 && t < 52.9 && <Cursor x={cb.x + cbo.x} y={cb.y + cbo.y} press={press(g, T_CLICK7)} size={66} opacity={k(g, 51.7, 0.4, S) * (1 - k(g, T_CLICK7 + 0.12, 0.4, S))} />}
    </AbsoluteFill>
  );
};
const mixV = (a: V3, b: V3, q: number): V3 => [mix(a[0], b[0], q), mix(a[1], b[1], q), mix(a[2], b[2], q)];
