// Scene C (h2 37.92 s → end 65.18 s), revision 1: the rows turn green, the price holds at renewal (on the card), the
// pills dock beside the card, the support chat, and the outro after the reference: the clicked button becomes the
// dot, the dot flies on a trail, rides after the words, becomes the logo mark, the wordmark slides out and the URL
// types below (plan/contract.md, REVISION 1 + C1–C11).
// One world, one camera. Every shot is "look at a target from a distance" (shotCam). The camera is a sum of eased
// moves whose windows overlap (MOVES), so it never comes to rest: each move grows out of the previous one.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage3D, Plane, cam, project, Cam } from "../cam";
import { Kinetic, TYPE, measure, useFonts, KItem } from "../type";
import { Dots, dotsAt, RING, BOX_C, Icon, Spinner, assemble } from "../dots";
import { CARD, CARD_ROWS, CARD_R, SiteWindow, SITE_WIN, Cursor, cursorAt, Handoff2, camH2, H2_CARD, HANDOFF_HALF } from "../ui";
import { k, f, typed, press, Ico, Wordmark, C, OUT, INOUT, LIN, SANS, SERIF, SHADOW, SHADOW_BIG, clamp01, mix } from "../shared";

// motion blur: only around the fastest part of the transitions (each ≤ 0.8 s)
export const BLUR: [number, number][] = [
  [46.25, 46.95],   // the truck from the card to "Brug for hjælp?"
  [49.95, 50.6],    // pull back from the chat to "Ingen kø."
  [51.55, 52.2],    // the fly-in to the send button
  [52.55, 53.3],    // the dot's flight and the dots assembling
  [56.45, 57.0],    // the smallest dot flies down to the line
  [59.65, 60.2],    // the dot flies back up to the mark
];

/* ---------- the world ---------- */
type V3 = [number, number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const cardPt = (lx: number, ly: number): V3 => [H2_CARD.x + lx * Math.cos(rad(3)), H2_CARD.y + ly, H2_CARD.z + lx * Math.sin(rad(3))];
const CARD_C: V3 = [H2_CARD.x, H2_CARD.y, H2_CARD.z];
const EXT = 140;                                 // the card grows by this for the two price rows
const PILL_X = 580;                              // the pills' left edge, right of the card
const GROUP: V3 = [366, 70, -100];               // the centre of card + pills
const Q: V3 = [2800, 0, 1300];                   // the chat; later the outro's plane
const Q2: V3 = [2100, -620, 3400];               // the type plane in front of the chat (off-axis: the panel sits small, lower right)
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
const START: Pose = { t: cardPt(6, -24), d: sc(1.9), ry: 6, rx: 3, ap: 14, fo: CARD_C };   // the rows, close (reached out of the hand-off)
const T_START = 39.25;                                                                      // the hand-off blend ends here
// MOVES: each move takes the pose to `p` (only the fields it names) between s and e, INOUT; consecutive windows
// overlap, so one move starts before the previous has settled. Every window is ≥ 1.0 s.
type Move = { s: number; e: number; p: Partial<Pose>; n: string };
const QY: V3 = [Q[0], Q[1] + 6, Q[2]];
const MOVES: Move[] = [
  { n: "C1 drift down the rows", s: 38.9, e: 40.0, p: { t: cardPt(14, 50), d: sc(2.0), ry: 4.5, rx: 2 } },
  { n: "C2 glide down to the price rows", s: 39.35, e: 40.6, p: { t: cardPt(0, 300), d: sc(1.72), ry: -3 } },
  { n: "C2 slow push on the price rows", s: 40.3, e: 41.9, p: { t: cardPt(24, 318), d: sc(1.82), ry: 3 } },
  { n: "C3 pull back to card + pills", s: 41.55, e: 43.1, p: { t: GROUP, d: sc(0.84), ry: -4, rx: 0, ap: 12, fo: GROUP } },
  { n: "C3 orbit round card + pills", s: 42.8, e: 46.3, p: { d: sc(0.86), ry: 4 } },
  { n: "C4 truck to the support world", s: 45.95, e: 47.25, p: { t: Q, d: 0, ry: -3, ap: 16, fo: Q } },
  { n: "C5 push to the chat reply", s: 47.0, e: 49.4, p: { t: QY, d: sc(1.3), ry: 3, rx: 1 } },
  { n: "C5 drift on the reply", s: 49.0, e: 50.0, p: { ry: -1.5 } },
  { n: "C6 pull back to the type plane", s: 49.6, e: 50.95, p: { t: Q2, d: 0, ry: -3, rx: 0, ap: 24, fo: Q2 } },
  { n: "C6 drift", s: 50.7, e: 51.7, p: { d: -40, ry: 0.5 } },
  { n: "C7 fly in to the send button", s: 51.3, e: 52.45, p: { t: [B[0] - 62, B[1] - 8, B[2]], d: sc(3.1), ry: 6, rx: 3, ap: 16, fo: Q } },
  { n: "C7 out to the logo", s: 52.3, e: 53.5, p: { t: Q, d: 0, ry: 0, rx: 0, ap: 14 } },
  { n: "C8 drift while the wordmark slides", s: 53.3, e: 54.6, p: { d: -25, ry: -2 } },
  { n: "C9 ease back for the pair", s: 54.0, e: 55.2, p: { d: 30, ry: 1 } },
  { n: "C9 slow push on the pair", s: 55.0, e: 56.6, p: { d: -10, ry: 2 } },
  { n: "C10 ease back for the line", s: 56.3, e: 57.5, p: { d: 50, ry: -2 } },
  { n: "C10 slow push on the line", s: 57.2, e: 59.7, p: { d: 0, ry: 2 } },
  { n: "C11 ease back for the end card", s: 59.4, e: 60.8, p: { t: QY, d: 30, ry: 1.5 } },
  { n: "C11 slow dolly to the end", s: 60.5, e: 65.6, p: { d: -45, ry: -2 } },
];
const vec = (p: Pose) => [...p.t, p.d, p.ry, p.rx, p.ap, ...p.fo];
const unvec = (v: number[]): Pose => ({ t: [v[0], v[1], v[2]], d: v[3], ry: v[4], rx: v[5], ap: v[6], fo: [v[7], v[8], v[9]] });
const STEPS = (() => { let prev = START; return MOVES.map((m) => { const next = { ...prev, ...m.p }, a = vec(prev), b = vec(next); prev = next; return { s: m.s, e: m.e, d: b.map((x, i) => x - a[i]) }; }); })();
const poseAt = (t: number): Pose => {
  const v = vec(START);
  for (const st of STEPS) { const q = INOUT(clamp01((t - st.s) / (st.e - st.s))); if (q > 0) for (let i = 0; i < v.length; i++) v[i] += st.d[i] * q; }
  return unvec(v);
};
const lerpCam = (a: Cam, b: Cam, q: number): Cam => ({ x: mix(a.x, b.x, q), y: mix(a.y, b.y, q), z: mix(a.z, b.z, q), rx: mix(a.rx, b.rx, q), ry: mix(a.ry, b.ry, q), rz: mix(a.rz, b.rz, q), focus: mix(a.focus, b.focus, q), ap: mix(a.ap, b.ap, q) });
const camC = (g: number): { c: Cam; s: Pose } => {
  const t = g / 30, s = poseAt(t);
  // a slow breath on top of every shot (the target stays centred)
  s.ry += 0.6 * Math.sin((t / 6.7) * Math.PI * 2);
  s.rx += 0.3 * Math.sin((t / 8.9) * Math.PI * 2 + 1);
  let c = shotCam(s);
  const t0 = (f("h2") + HANDOFF_HALF) / 30, u = INOUT(clamp01((t - t0) / (T_START - t0)));
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
      const a = INOUT(clamp01(active[i] ?? 0)), r = CARD_R.rows[i];
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

// the pills: a left-aligned stack beside the card (origin = the stack's left edge, vertical centre); each slides in
// from the right on its phrase and the stack re-centres as it joins
const PILLS: [string, string][] = [["Domænet i dit navn", "w:domnet"], ["Servere i Europa", "w:servere"], ["Ingen binding", "w:ingen3"]];
const Pills: React.FC<{ g: number }> = ({ g }) => {
  const join = PILLS.map(([, at]) => k(g, at, 0.9, INOUT)), n1 = join[1] + join[2];
  return (
    <>
      {PILLS.map(([text, at], i) => {
        const a = k(g, at, 0.9, OUT), out = k(g, 45.95 + i * 0.1, 0.7, INOUT);
        if (a <= 0 || out >= 1) return null;
        const y = (i - n1 / 2) * 150 - out * 110;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${((1 - a) * 110).toFixed(2)}px, ${y.toFixed(2)}px) translateY(-50%)`, opacity: clamp01(a * 1.6) * (1 - out),
            height: 120, borderRadius: 60, boxSizing: "border-box", padding: "0 60px 0 46px", background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`,
            display: "flex", alignItems: "center", gap: 24, fontFamily: SANS, fontWeight: 500, fontSize: 56, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap" }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: C.sage, flex: "none" }} />{text}
          </div>
        );
      })}
    </>
  );
};

const CHAT_Y = 190, T_CLICK5 = 47.95, T_OPEN = 47.98, T_CLICK7 = 52.15;
const REPLY = "Selvfølgelig. Jeg kigger på det med det samme.";
// the chat: the wizard's sage chat button opens into the panel (one shape); hideSend when the outro lifts the button
const Chat: React.FC<{ g: number; hideSend: boolean }> = ({ g, hideSend }) => {
  const a = k(g, 47.4, 0.7, OUT), m = k(g, T_OPEN, 1.0, INOUT), dip = press(g, T_CLICK5);
  const w = mix(120, PANEL.w, m), h = mix(120, PANEL.h, m), body = clamp01((m - 0.5) / 0.5);
  const up = (at: number | string, dur = 0.7): React.CSSProperties => { const q = k(g, at, dur, OUT); return { opacity: q, transform: `translateY(${((1 - q) * 14).toFixed(2)}px)` }; };
  const reply = typed(g, "w:forstr+0.05", REPLY, 54);
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
        <div style={{ position: "absolute", right: 32, top: 122, padding: "17px 26px", borderRadius: "26px 26px 8px 26px", background: C.sageTint, fontSize: 27, whiteSpace: "nowrap", ...up(48.45) }}>Kan I hjælpe med min e-mail?</div>
        {/* the person */}
        <div style={{ position: "absolute", left: 32, top: 246, width: 64, height: 64, borderRadius: 32, background: C.sage, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 600, letterSpacing: "0.02em", ...up(48.62) }}>SL</div>
        <div style={{ position: "absolute", left: 114, top: 232, fontSize: 21, fontWeight: 500, color: C.muted, ...up(48.66) }}>Sofie</div>
        <div style={{ position: "absolute", left: 112, top: 268, width: 584, boxSizing: "border-box", padding: "20px 28px", borderRadius: "8px 26px 26px 26px", background: C.white, boxShadow: `0 0 0 1px ${C.line}, 0 1px 2px rgba(26,22,20,0.04)`,
          fontSize: 34, lineHeight: 1.36, letterSpacing: "-0.01em", ...up("w:forstr-0.15", 0.6) }}>
          <span>{reply}</span><span style={{ opacity: 0 }}>{REPLY.slice(reply.length)}</span>
        </div>
        {/* the input row */}
        <div style={{ position: "absolute", left: 28, top: SEND.y, width: SEND.x - 28 - 14, height: SEND.s, boxSizing: "border-box", borderRadius: 16, background: C.white, border: `1px solid #E1DDD6`, display: "flex", alignItems: "center", padding: "0 22px" }}>
          <div style={{ width: 2, height: 28, background: C.ink, opacity: Math.floor(g / 15) % 2 === 0 ? 0.85 : 0 }} />
        </div>
        {!hideSend && <SendButton p={press(g, T_CLICK7)} />}
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
// C9: the site window and the hosting card under the lockup, the same height (330), sliding together
const PAIR = { y: 135, sSite: 330 / SITE_WIN.h, sCard: 330 / CARD.h };
const PAIR_W = { site: SITE_WIN.w * PAIR.sSite, card: CARD.w * PAIR.sCard };

/* ---------- the scene ---------- */
export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  const ready = useFonts();
  if (g < f("h2") + HANDOFF_HALF) return <Handoff2 g={g} />;
  const t = g / 30, { c, s } = camC(g);
  const W2 = 1920, H2 = 1080, mid: React.CSSProperties = { left: W2 / 2, top: H2 / 2 };

  // C1: the rows turn green.   C2: the card grows; the same price today and at renewal
  const active = [k(g, "w:domne", 0.45, LIN), k(g, "w:email", 0.45, LIN), k(g, "w:med", 0.45, LIN)];
  const ext = k(g, 39.45, 1.0, INOUT), rowA = k(g, "w:fast", 0.8, OUT), rowB = k(g, "w:fornyer", 0.8, OUT), eq = k(g, "w:fornyer+0.45", 0.5, OUT);
  // depth of field on the card in the close-ups: sharp where the camera looks, soft above and below
  const cScale = 1600 / project(c, { x: CARD_C[0], y: CARD_C[1], z: CARD_C[2] }).dist, close = clamp01((cScale - 1.2) / 0.5);
  const ly = s.t[1] - H2_CARD.y + CARD.h / 2;   // where the camera looks, in card px from its top
  const cardMask = `linear-gradient(180deg, transparent ${(ly - 430).toFixed(0)}px, #000 ${(ly - 240).toFixed(0)}px, #000 ${(ly + 240).toFixed(0)}px, transparent ${(ly + 430).toFixed(0)}px)`;

  // C7: the send button becomes the dot; the dots assemble on "Creoble."
  const back6 = k(g, 49.95, 0.5, INOUT) * (1 - k(g, 51.9, 0.45, INOUT));
  const lifted = t >= T_CLICK7, m7 = k(g, 52.2, 0.3, INOUT), T_FLY = 52.45, D_FLY = 0.78, T_SWAP = 52.5, T_C = f("w:creoble3") / 30;
  const fall = k(g, 52.4, 1.0, INOUT);
  const big = markDots(S_BIG, 0, 0);
  const pos7 = (tt: number): Dot => { const q = INOUT(clamp01((tt - T_FLY) / D_FLY)); return { ...bez(B_O, big[0], 150, q), r: mix(42, big[0].r, q) }; };
  const ASM = { dur: 0.9, stagger: 0.05, bend: 170 }, tA = t - (T_C - ASM.dur - 5 * ASM.stagger);
  const FROM = [big[0], { x: -1050, y: -520, r: big[1].r }, { x: -1150, y: 260, r: big[2].r }, { x: -420, y: 900, r: big[3].r }, { x: 560, y: 880, r: big[4].r }, { x: 1150, y: 420, r: big[5].r }];
  const asm = assemble(tA, FROM, S_BIG, ((RING.x - BOX_C.x) * S_BIG) / 100, ((RING.y - BOX_C.y) * S_BIG) / 100, ASM);

  // C8–C9: the first lockup; under it the site and the hosting card come together
  const CY_A = -255, cyA = CY_A * k(g, 54.0, 1.0, INOUT);
  const siteIn = k(g, "w:hjemmeside2", 0.9, OUT), cardIn = k(g, "w:hosting", 0.9, OUT), join = k(g, 55.2, 1.0, INOUT), pairOut = k(g, 56.45, 0.8, INOUT);
  const tot = PAIR_W.site + PAIR_W.card, siteX = mix(-400, -tot / 2 + PAIR_W.site / 2, join) - (1 - siteIn) * 260, cardX = mix(410, tot / 2 - PAIR_W.card / 2, join) + (1 - cardIn) * 260;
  const pairY = PAIR.y + pairOut * 120;
  const T_DOWN = 56.3, D_DOWN = 0.8, d5 = markDots(LA.S, geo(LA).markX, CY_A)[5];
  const rsA = [0, 1, 2, 3, 4].map((i) => 1 - k(g, 56.45 + i * 0.05, 0.5, INOUT)).concat(t < T_DOWN ? 1 : 0);

  // C10: the line with the dot riding after the last word
  const T_UP = 59.5, D_UP = 0.8, lineOut = 59.62, D10 = 0.3;
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
  const pos10 = (tt: number): Dot => { const q = INOUT(clamp01((tt - T_DOWN) / D_DOWN)); return { ...bez(d5, { x: rideX(f(T_DOWN + D_DOWN)), y: 8 }, -130, q), r: mix(d5.r, 12, q) }; };

  // C11: the final lockup
  const CY = -70, fin = markDots(LB.S, 0, CY);
  const pos11 = (tt: number): Dot => { const q = INOUT(clamp01((tt - T_UP) / D_UP)); return { ...bez({ x: rideX(f(T_UP)), y: 8 }, fin[0], 170, q), r: mix(12, fin[0].r, q) }; };
  const rsB = [t >= T_UP + D_UP ? 1 : 0, ...[1, 2, 3, 4, 5].map((i) => k(g, 60.25 + (i - 1) * 0.08, 0.6, OUT))];
  const ctaA = typed(g, "w:byg2", CTA_A, 19), ctaB = typed(g, "w:creoble4", CTA_B, 17);

  // the type planes ride with the camera while it travels (so a word is never seen oversized), and rest in the world between
  const ride = (to: V3, arrive: number, leave = 1e9) => {
    const w = INOUT(clamp01((t - arrive) / 0.8)) * (1 - INOUT(clamp01((t - leave) / 0.4))), q = mixV([c.x, c.y, c.z], to, w);
    return { x: q[0], y: q[1], z: q[2], ry: -c.ry * (1 - w), rx: c.rx * (1 - w) };
  };

  // cursors (screen space)
  const cq = project(c, { x: Q[0], y: Q[1] + CHAT_Y * (1 - k(g, T_OPEN, 1.0, INOUT)), z: Q[2] }), co = cursorAt(g, [{ at: 47.3, x: 420, y: 300 }, { at: 47.9, x: 8, y: 6 }, { at: 48.1, x: 8, y: 6 }, { at: 49.0, x: 600, y: 440 }]);
  const cb = project(c, { x: B[0], y: B[1], z: B[2] }), cbo = cursorAt(g, [{ at: 51.5, x: 330, y: 250 }, { at: 52.12, x: 18, y: 16 }]);

  return (
    <AbsoluteFill>
      <Stage3D cam={c}>
        {/* the hosting card (C1–C3) */}
        {t < 47.4 && (
          <Plane {...H2_CARD} w={CARD.w} h={CARD.h} farBlur={close > 0.05 ? 7 * close : 0} farMask={cardMask}>
            <CardC g={g} active={active} ext={ext} rowA={rowA} rowB={rowB} eq={eq} />
          </Plane>
        )}
        {/* C3: the pills, docked beside the card */}
        {t > 42 && t < 47.4 && (
          <Plane x={PILL_X + 400} y={GROUP[1]} z={H2_CARD.z + 20} ry={-5} w={800} h={500}>
            <div style={{ position: "absolute", left: 0, top: 250 }}><Pills g={g} /></div>
          </Plane>
        )}
        {/* C5: the chat (small and faint behind C6; falls away in C7) */}
        {t > 47.3 && fall < 1 && (
          <Plane x={Q[0]} y={Q[1]} z={Q[2] - 1900 * fall} w={PANEL.w} h={PANEL.h} opacity={(1 - 0.75 * back6) * (1 - k(g, 52.45, 0.65, INOUT))} blur={9 * back6}>
            <div style={{ position: "absolute", left: PANEL.w / 2, top: PANEL.h / 2 }}><Chat g={g} hideSend={lifted} /></div>
          </Plane>
        )}
        {/* C4: "Brug for hjælp?" */}
        {t > 46.9 && t < 48.6 && (
          <Plane {...ride([Q[0], Q[1], Q[2] + 1], 47.25)} w={W2} h={H2} dof={false}>
            <Kinetic g={g} size={TYPE.hero} style={mid} items={W("Brug for hjælp?", ["w:brug", "w:for2", "w:hjlp"], 2, 47.9, 0.3)} />
          </Plane>
        )}
        {/* C6: "Ingen kø." → "Ingen robotsvar." */}
        {t > 50.1 && t < 52.5 && (
          <Plane {...ride(Q2, 50.95, 51.3)} w={W2} h={H2} dof={false}>
            <Kinetic g={g} size={TYPE.hero} style={mid} items={[{ t: "Ingen", at: "w:ingen4", out: 51.95, dur: 0.42 }, { t: "kø.", at: "w:k", accent: true, out: "w:ingen5", dur: 0.42 }, { t: "robotsvar.", at: "w:robotsvar", accent: true, out: 51.95 }]} />
          </Plane>
        )}
        {/* C7: the send button, lifted off the panel: it turns sage and becomes the dot */}
        {lifted && t < T_SWAP && (
          <Plane x={B[0]} y={B[1]} z={B[2] + 2} w={2} h={2} dof={false}>
            <div style={{ position: "absolute", left: 1, top: 1 }}><SendButton abs={false} m={m7} p={press(g, T_CLICK7)} /></div>
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
        {/* C9: the site and the hosting card, sliding in and together under the lockup */}
        {t > 54.1 && pairOut < 1 && siteIn > 0 && (
          <Plane x={Q[0] + siteX} y={Q[1] + pairY} z={Q[2] - 40 * (1 - join)} ry={12 * (1 - join)} w={SITE_WIN.w} h={SITE_WIN.h} scale={PAIR.sSite} opacity={clamp01(siteIn * 1.5) * (1 - pairOut)}>
            <SiteWindow />
          </Plane>
        )}
        {t > 54.8 && pairOut < 1 && cardIn > 0 && (
          <Plane x={Q[0] + cardX} y={Q[1] + pairY} z={Q[2] - 40 * (1 - join)} ry={-12 * (1 - join)} w={CARD.w} h={CARD.h} scale={PAIR.sCard} opacity={clamp01(cardIn * 1.5) * (1 - pairOut)}>
            <CardC g={g} active={[1, 1, 1]} />
          </Plane>
        )}
        {/* the outro's plane */}
        {t >= T_SWAP && (
          <Plane x={Q[0]} y={Q[1]} z={Q[2]} w={W2} h={H2}>
            <div style={{ position: "absolute", ...mid, width: 0, height: 0 }}>
              {t < T_C && <Dots dots={comet(pos7, t)} />}
              {t >= T_C && t < 57.4 && <Lockup L={LA} cy={cyA} s={k(g, 53.4, 1.0, INOUT)} wm={k(g, 53.45, 1.1, LIN) * (1 - k(g, 56.4, 0.6, LIN))} rs={rsA} />}
              {t >= T_DOWN && t < T_DOWN + D_DOWN && <Dots dots={comet(pos10, t)} />}
              {t >= T_DOWN + D_DOWN - 0.1 && t < 60.3 && <Kinetic g={g} size={TYPE.big} items={items10} />}
              {t >= T_DOWN + D_DOWN && t < T_UP && <Dots dots={[{ x: rideX(g), y: 8, r: 12 }]} />}
              {t >= T_UP && t < T_UP + D_UP && <Dots dots={comet(pos11, t)} />}
              {t >= T_UP && <Lockup L={LB} cy={CY} s={k(g, 60.7, 1.0, INOUT)} wm={k(g, 60.75, 1.1, LIN)} rs={rsB} />}
              {t >= 60 && (
                <div style={{ position: "absolute", left: 0, top: CY + 196, transform: "translate(-50%, -50%)", fontFamily: SANS, fontSize: 40, fontWeight: 400, letterSpacing: "-0.005em", whiteSpace: "pre", color: C.muted }}>
                  <span>{ctaA}</span><span style={{ color: C.ink, fontWeight: 500 }}>{ctaB}</span><span style={{ opacity: 0 }}>{CTA_A.slice(ctaA.length)}{CTA_B.slice(ctaB.length)}</span>
                </div>
              )}
            </div>
          </Plane>
        )}
      </Stage3D>
      {t > 47.3 && t < 49 && <Cursor x={cq.x + co.x} y={cq.y + co.y} press={press(g, T_CLICK5)} size={44} opacity={k(g, 47.3, 0.25, LIN) * (1 - k(g, 48.55, 0.35, LIN))} />}
      {t > 51.9 && t < 52.6 && <Cursor x={cb.x + cbo.x} y={cb.y + cbo.y} press={press(g, T_CLICK7)} size={76} opacity={k(g, 51.9, 0.2, LIN) * (1 - k(g, 52.3, 0.2, LIN))} />}
    </AbsoluteFill>
  );
};
const mixV = (a: V3, b: V3, q: number): V3 => [mix(a[0], b[0], q), mix(a[1], b[1], q), mix(a[2], b[2], q)];
