// Scene C (h2 44.65 s → end 65.2 s): the panel that updates the live site, "Aldrig en linje kode.", the plan card,
// Danish support, and the outro (send button → dot → the C → the lockup, the button, the address).
// Object-led: every beat is a fixed 2D frame in a slow steady push (the camera: linear and calm, never bouncing); the
// things in it arrive from below, leave upward or sink back, and grow out of what caused them.
// Karl's notes of 10 Nov: every OBJECT animation pops (../motion: pop in, popOut out, wobble after an impact); the hand
// glides target to target (../hand) with a calm rest before each click (no "[hand]" warnings). The flourishes, each
// grown out of what happens: C1 the sage dot carries each change along a softly curved dashed path that draws itself
// ahead of the dot and erases behind it, and lands with a small ripple on the element it updates; C2 faint lines of code
// sit behind "Aldrig en linje kode." and one soft sage brush stroke wipes them away as "kode." lands; C3 the year
// columns grow up in a staggered pop and the level line draws through them, a small light glint running along it once;
// C4 a typing indicator of three logo dots bobbing in a wave before Sofie's reply; C5 a soft light sweep across the
// wordmark as it reveals, and a gentle shine across "Byg din side gratis" right after the hand presses it.
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile } from "remotion";
import { C, HOLM, SANS, SERIF, SHADOW, SHADOW_BIG, clamp01, mix } from "../lib";
import { aspring, press, typed, Ico, Wordmark, HolmSite, Browser } from "../shared";
import { ACCENT, TYPE, measure, useFonts } from "../type";
import { Dots, Icon, ANG, RING, LOGO, BOX_C } from "../dots";
import { HostingCard, CARD, Handoff2, NEW_HEADLINE } from "../ui";
import { Hand, handAt, handPlan, HandKey } from "../hand";
import { pop, popOut, wobble } from "../motion";
import { f } from "../shared";

export const BLUR: [number, number][] = [];

/* ---------- the beats (film seconds) ---------- */
const TC = {
  card: 44.95, site: 45.05, focus: 45.4, type: 45.65, offer: 45.75, done: 46.45,
  c1: 46.5, scroll: 47.2, c2: 48.3, mini: 49.15, sinkC1: 51.95,                       // C1
  code: 50.12, brush: 51.25, up: 51.85, off: 52.9,                                    // C2
  plan: 52.25, title: 52.55, row: 52.66, tick: 52.82, price: 53.4,
  years: [53.75, 53.97, 54.19], level: 54.7, glint: 55.45, planOut: 55.95,          // C3
  chat: 56.05, b1: 56.6, sofie: 56.8, wave: 56.86, reply: 57.34, rtype: 57.4, flag: 57.7, // C4
};
const ARRIVE = 0.45;                                   // a courier dot lands this long after it leaves
const A1 = TC.c1 + ARRIVE, A2 = TC.c2 + ARRIVE;        // the price swaps; the hero photo changes
const T_GRAB = 46.8, T_DROP = 48.2;                    // the hand takes the photo; releases it on the panel
const T_SEND = 58.3, T_SINK = 59.0, T_PRESS = 62.6;    // the chat's send button; the chat sinks; the final button

export const EVENTS: { t: number; kind: "click" | "type" | "check" | "pop" | "open" | "send" | "logo"; len?: number; note: string }[] = [
  { t: TC.card, kind: "open", note: "C1 the hosting card shrinks into the panel (soft settle); the live site rises" },
  { t: TC.type, kind: "type", len: 0.76, note: "C1 panel field types 'Massage: 450 kr.'" },
  { t: TC.offer, kind: "pop", note: "C1 a photo rises under the panel" },
  { t: TC.done, kind: "check", note: "C1 the field's check pops" },
  { t: TC.c1 - 0.1, kind: "send", len: 0.55, note: "C1 the sage dot runs a dashed path that draws ahead of it and erases behind it (light dotted whoosh, panel to price)" },
  { t: T_GRAB, kind: "click", note: "C1 the hand takes the photo (it lifts)" },
  { t: A1, kind: "pop", note: "C1 the dot lands with a small ripple; the Massage price swaps to 450 kr." },
  { t: TC.scroll + 0.2, kind: "open", len: 1.3, note: "C1 the site scrolls up to the hero (soft)" },
  { t: T_DROP, kind: "click", note: "C1 the hand releases the photo on the panel (it settles)" },
  { t: TC.c2 - 0.1, kind: "send", len: 0.55, note: "C1 second dashed-path run (panel to hero), a touch higher in pitch" },
  { t: A2, kind: "pop", note: "C1 ripple on the hero; the hero photo changes" },
  { t: A2 + 0.32, kind: "check", note: "C1 'Opdateret' chip pops onto the site window" },
  { t: TC.mini + 0.55, kind: "open", len: 1.3, note: "C1 panel, then site, settle small (staggered); the type line begins" },
  { t: TC.code, kind: "type", len: 0.45, note: "C2 faint code lines tick in behind the words (very quiet)" },
  { t: TC.brush, kind: "open", len: 0.6, note: "C2 one soft sage brush stroke wipes the code away (soft swish)" },
  { t: TC.up + 0.3, kind: "open", note: "C2 the line glides up as a heading" },
  { t: TC.plan + 0.15, kind: "open", note: "C3 the plan card rises" },
  { t: TC.tick, kind: "check", note: "C3 row 'Stop når som helst' ticks in" },
  { t: TC.price, kind: "pop", note: "C3 the price '99 kr. /md.' pops" },
  { t: TC.years[0], kind: "pop", note: "C3 column År 1 grows up" },
  { t: TC.years[1], kind: "pop", note: "C3 column År 2 grows up" },
  { t: TC.years[2], kind: "pop", note: "C3 column År 3 grows up" },
  { t: TC.level, kind: "open", len: 0.7, note: "C3 the level line draws through the columns" },
  { t: TC.glint, kind: "logo", len: 0.55, note: "C3 a small light glint runs along the level line (airy shimmer)" },
  { t: TC.chat + 0.1, kind: "open", note: "C4 the plan card leaves upward; the chat panel rises" },
  { t: TC.b1, kind: "send", note: "C4 customer bubble 'Kan I hjælpe med min e-mail?'" },
  { t: TC.wave, kind: "pop", len: 0.5, note: "C4 typing indicator: three sage dots bob in a wave (three soft ticks)" },
  { t: TC.reply, kind: "pop", note: "C4 the reply bubble grows out of the indicator" },
  { t: TC.rtype, kind: "type", len: 0.63, note: "C4 Sofie's reply types" },
  { t: TC.flag, kind: "pop", note: "C4 chip 'Dansk support'" },
  { t: T_SEND, kind: "click", note: "C5 the hand presses the send button; it turns sage" },
  { t: T_SEND + 0.26, kind: "send", len: 0.82, note: "C5 the dot leaves the panel and glides to the centre, smearing a soft sage trail" },
  { t: 58.96, kind: "logo", len: 0.5, note: "C5 the five dots unfurl into the C (each settles)" },
  { t: 59.34, kind: "open", note: "C5 the wordmark slides out beside the C" },
  { t: 59.62, kind: "logo", len: 1.0, note: "C5 a soft light sweep runs across the wordmark" },
  { t: 59.84, kind: "pop", note: "C5 button 'Byg din side gratis' pops up" },
  { t: 60.9, kind: "type", len: 0.83, note: "C5 creoble.dk types" },
  { t: T_PRESS, kind: "click", note: "C5 the hand presses the button; the dots turn once" },
  { t: T_PRESS + 0.2, kind: "logo", len: 0.65, note: "C5 a gentle shine passes across the button" },
];

/* ---------- motion helpers (seconds) ---------- */
type Pt = { x: number; y: number };
const GL = Easing.bezier(0.42, 0, 0.22, 1);            // strokes and wipes (not objects): soft start, long landing
const SINE = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
const gl = (t: number, at: number, dur: number) => GL(clamp01((t - at) / dur));
const sn = (t: number, at: number, dur: number) => SINE(clamp01((t - at) / dur));   // opacity only
const push = (t: number, a: number, b: number, from = 0.95, to = 1) => from + (to - from) * clamp01((t - a) / (b - a));   // the camera
const pp = (g: number, at: number, dur: number, over: number) => pop(g, at, { dur, over });
const away = (g: number, at: number, dur: number) => 1 - popOut(g, at, { dur });   // 0 → 1 (a small anticipation first)
// big surfaces: the same pop / popOut on a clock that eases in over about A s (its speed grows from 0 instead of
// kicking in), so a large card or the whole page never jumps from still to fast (flow check); it lands about A later
const wt = (g: number, at: number, A: number) => { const x = g / 30 - at; return x <= 0 ? g : (at + x - A * (1 - Math.exp(-x / A))) * 30; };
const ppw = (g: number, at: number, dur: number, over: number, A = 0.3) => pop(wt(g, at, A), at, { dur, over });
const awayw = (g: number, at: number, dur: number, A = 0.2) => away(wt(g, at, A), at, dur);
// an object arriving: q is a pop (it may pass 1: the settle rises a touch above its place and comes back)
const arr = (q: number, rise = 70, from = 0.9): React.CSSProperties => ({ opacity: SINE(clamp01(q * 1.25)), transform: `translateY(${((1 - q) * rise).toFixed(2)}px) scale(${mix(from, 1, q).toFixed(4)})` });
const Group: React.FC<{ s: number; children?: React.ReactNode }> = ({ s, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${s.toFixed(5)})` }}>{children}</div>
);
const photo = (src: string, st: React.CSSProperties = {}) => <Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...st }} />;
const CheckDot: React.FC<{ s: number; q?: number }> = ({ s, q = 1 }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", transform: `scale(${Math.max(0, q).toFixed(4)})`, opacity: clamp01(q * 2) }}>
    <Ico n="check" s={s * 0.66} c={C.white} w={3} />
  </div>
);

/* ---------- the courier: a sage dot on a dashed path that draws ahead of it and erases behind it ---------- */
// arc: a quadratic curve sampled by arc length, so the dot and the dashes move at one speed; at(s) extrapolates past
// the ends (the dot's settle runs a hair past its target and back).
const arc = (a: Pt, c: Pt, b: Pt, n = 40) => {
  const pts = Array.from({ length: n + 1 }, (_, i) => { const u = i / n, w = 1 - u; return { x: w * w * a.x + 2 * w * u * c.x + u * u * b.x, y: w * w * a.y + 2 * w * u * c.y + u * u * b.y }; });
  const L = [0];
  for (let i = 1; i <= n; i++) L.push(L[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = L[n];
  const at = (s: number) => {
    const d = s * total;
    let i = 1;
    while (i < n && L[i] < d) i++;
    const k = (d - L[i - 1]) / (L[i] - L[i - 1]);
    return { x: mix(pts[i - 1].x, pts[i].x, k), y: mix(pts[i - 1].y, pts[i].y, k) };
  };
  const seg = (s0: number, s1: number) => [at(s0), ...pts.filter((_, i) => L[i] > s0 * total && L[i] < s1 * total), at(s1)];
  return { at, seg, total };
};
// Ripple: two thin sage rings opening from the point where the dot lands
const Ripple: React.FC<{ g: number; at: number; x: number; y: number; r?: number }> = ({ g, at, x, y, r = 58 }) => {
  const t = g / 30 - at;
  if (t <= 0 || t > 1.1) return null;
  const ring = (d: number, rr: number, a: number) => {
    const tt = t - d;
    if (tt <= 0 || tt > 0.85) return null;
    const q = pp(g, at + d, 0.7, 0.02), o = a * Math.pow(1 - clamp01(tt / 0.85), 1.6);
    return <div style={{ position: "absolute", left: x - rr, top: y - rr, width: 2 * rr, height: 2 * rr, borderRadius: "50%", boxSizing: "border-box", border: `3px solid ${C.sage}`, opacity: o, transform: `scale(${(0.12 + 0.88 * q).toFixed(4)})` }} />;
  };
  return <>{ring(0, r, 0.85)}{ring(0.13, r * 1.55, 0.45)}</>;
};
const Courier: React.FC<{ g: number; at: number; a: Pt; b: Pt; bend?: number }> = ({ g, at, a, b, bend = 90 }) => {
  const t = g / 30;
  if (t < at - 0.12 || t > at + 1.3) return null;
  const P = arc(a, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - bend }, b);
  const head = gl(t, at - 0.1, 0.5), dot = pp(g, at, 0.55, 0.02), tail = gl(t, at + 0.12, 0.48);
  const pos = P.at(dot), ds = pp(g, at - 0.06, 0.26, 0.12) * popOut(g, at + ARRIVE - 0.02, { dur: 0.28 });
  const line = tail < Math.min(1, head) - 0.003 ? P.seg(tail, Math.min(1, head)) : null;
  return (
    <>
      {line && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <polyline points={line.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ")} fill="none" stroke={C.sage} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="13 13" strokeDashoffset={(-tail * P.total).toFixed(1)} opacity={0.8} />
      </svg>}
      {ds > 0.01 && <div style={{ position: "absolute", left: pos.x - 15, top: pos.y - 15, width: 30, height: 30, borderRadius: 15, background: C.sage, boxShadow: "0 0 0 6px rgba(135,168,158,0.18)", transform: `scale(${ds.toFixed(4)})` }} />}
      <Ripple g={g} at={at + ARRIVE} x={b.x} y={b.y} />
    </>
  );
};

/* ---------- C1: the panel updates the live site ---------- */
// Two objects fill SAFE: the panel (600 × 560, left) and the live site (1000 × 740, right). The hosting card of the
// hand-off becomes the panel (one box: it shrinks left while its content cross-fades). Each change is a chain: the
// panel takes the input, a sage dot carries it to the site on its dashed path, the site's element updates.
const SITE_S = 1000 / 1460, SITE_H = 740 / SITE_S, SCR_CARDS = 380, SCR_HERO = 40;   // the page scrolls from the services row up to the hero
const PANEL = { x: 144, y: 260, w: 600, h: 560 }, SITEP = { x: 776, y: 170, w: 1000, h: 740 };
const FIELD = { x: 34, y: 146, w: 532, h: 84 }, ZONE = { x: 34, y: 290, w: 532, h: 236 }, THUMB = { w: 250, h: 176 };
const pagePt = (x: number, y: number, scroll: number) => ({ x: SITEP.x + x * SITE_S, y: SITEP.y + (46 + y - scroll) * SITE_S });
const SRC1 = { x: PANEL.x + FIELD.x + FIELD.w - 44, y: PANEL.y + FIELD.y + FIELD.h / 2 }, DST1 = pagePt(620, 1110, SCR_CARDS);
const SRC2 = { x: PANEL.x + ZONE.x + ZONE.w / 2, y: PANEL.y + ZONE.y + ZONE.h / 2 }, DST2 = pagePt(1075, 400, SCR_HERO);
const NEWTXT = "Massage: 450 kr.";
const TRAY = { x: PANEL.x + ZONE.x + ZONE.w / 2, y: 900 }, TRAY_S = 0.8;            // the photo waits under the panel, small, inside SAFE
const MINI = 0.32, MINI_Y = 838;
const HAND = 170, BELOW = 1220;
// SHIFT: from the resting hand's (x, y) to the point its click lands on (the hand hovers short of a click target by
// the press travel): the carried photo rides on that point, so it never jumps when it is taken or released
const SHIFT = (() => { const kk = handPlan([{ at: 0, x: 0, y: 0 }, { at: 1, x: 0, y: 0, click: true }], HAND).keys[1]; return { x: -kk.x, y: -kk.y }; })();
const C1: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  // afterwards (C2): both settle small under the type line, then sink as the plan card rises
  const mP = ppw(g, TC.mini, 1.7, 0.03, 0.4), mS = ppw(g, TC.mini + 0.25, 1.7, 0.03, 0.4), sink = awayw(g, TC.sinkC1, 0.85);   // the panel first, then the site
  const mini = (cx: number, tx: number, m: number) => `translate(${((tx - cx) * m).toFixed(2)}px, ${((MINI_Y - 540) * m + sink * 170).toFixed(2)}px) scale(${(mix(1, MINI, m) * (1 - 0.1 * sink)).toFixed(4)})`;
  // the hosting card becomes the panel
  const cq = ppw(g, TC.card, 1.2, 0.03, 0.25), toX = (960 - (PANEL.x + PANEL.w / 2)) * (1 - cq);
  const cardO = 1 - sn(t, TC.card + 0.08, 0.8), panelO = sn(t, TC.card + 0.3, 0.8);
  const sq = ppw(g, TC.site, 1.25, 0.03), scroll = mix(SCR_CARDS, SCR_HERO, ppw(g, TC.scroll, 1.5, 0.03));
  // the field: focused as the panel lands, it types on "priser"; its check pops when the text is complete
  const focus = aspring(g, TC.focus, 0.4), txt = typed(g, TC.type, NEWTXT, 21), typing = t > TC.type && t < TC.done;
  const done = pp(g, TC.done, 0.4, 0.1);
  // the site's price line: it swaps when the dot lands (A1)
  const sw = pp(g, A1, 0.5, 0.08), hl = sn(t, A1 - 0.02, 0.3) * (1 - sn(t, A1 + 0.85, 0.8)), ring1 = pp(g, A1, 0.55, 0.04);
  // the photo rises under the panel, the hand takes it (T_GRAB), it rides at the click point and is released on the panel (T_DROP)
  const offer = pp(g, TC.offer, 0.55, 0.05), held = pp(g, T_GRAB, 0.4, 0.08), carry = sn(t, T_GRAB, 0.5), land = pp(g, T_DROP, 0.35, 0.06);
  const P1 = push(t, TC.card, 53.0), hd = handAt(g, handKeys(t), { size: HAND });
  const ride = { x: 960 + (hd.x + SHIFT.x - 960) / P1, y: 540 + (hd.y + SHIFT.y - 540) / P1 };
  const tray = { x: TRAY.x, y: TRAY.y + (1 - offer) * 260 };
  const hq = clamp01((t - T_GRAB) / 0.12), lq = clamp01(land);
  const th = { x: mix(mix(tray.x, ride.x, hq), SRC2.x, lq), y: mix(mix(tray.y, ride.y, hq), SRC2.y, lq) };
  const thS = mix(mix(TRAY_S, 1.04, held), 1, land);
  const inPanel = t >= T_DROP + 0.7;
  // the hero photo changes when the second dot lands (A2); then "Opdateret"
  const hero = pp(g, A2, 0.7, 0.03), hhl = sn(t, A2 - 0.02, 0.3) * (1 - sn(t, A2 + 0.65, 0.6)), ring2 = pp(g, A2, 0.6, 0.04);
  const chip = pp(g, A2 + 0.2, 0.5, 0.08);
  const caretOn = typing || Math.floor(g / 15) % 2 === 0;
  const thumb = (st: React.CSSProperties) => <div style={{ position: "absolute", width: THUMB.w, height: THUMB.h, borderRadius: 14, overflow: "hidden", boxShadow: `0 0 0 1px ${C.line}`, ...st }}>{photo("holm-stretch.jpg")}</div>;
  return (
    <Group s={P1}>
      {/* the hosting card, leaving into the panel */}
      {cardO > 0 && <div style={{ position: "absolute", left: 960 - CARD.w / 2, top: 540 - CARD.h / 2, width: CARD.w, height: CARD.h, opacity: cardO, transform: `translateX(${(-(960 - (PANEL.x + PANEL.w / 2)) * cq).toFixed(2)}px) scale(${(1.0355 * Math.pow(0.6 / 1.0355, cq)).toFixed(5)})` }}>
        <HostingCard g={g} rows={3} active={[1, 1, 1]} price={1} /></div>}
      {/* the panel */}
      <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: clamp01(1 - sink), transform: mini(PANEL.x + PANEL.w / 2, 960 - 271 + 96, mP) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, opacity: panelO, transform: `translateX(${toX.toFixed(2)}px) scale(${mix(1.35, 1, cq).toFixed(4)})` }}>
          <div style={{ position: "absolute", left: 34, top: 30, fontFamily: SERIF, fontSize: 46, letterSpacing: "-0.025em" }}>Dit panel</div>
          <div style={{ position: "absolute", right: 34, top: 52, display: "flex", alignItems: "center", gap: 9, fontSize: 20, color: C.muted }}><span style={{ width: 9, height: 9, borderRadius: 5, background: C.sage }} />holmfysio.dk</div>
          <div style={{ position: "absolute", left: 34, top: 112, fontSize: 20, color: C.muted }}>Skriv en ændring</div>
          <div style={{ position: "absolute", left: FIELD.x, top: FIELD.y, width: FIELD.w, height: FIELD.h, boxSizing: "border-box", borderRadius: 14, background: C.white, border: `1.5px solid color-mix(in srgb, #8FAFA6 ${focus * 100}%, #E1DDD6)`,
            boxShadow: `0 0 0 5px rgba(135,168,158,${(0.22 * focus).toFixed(3)})`, display: "flex", alignItems: "center", padding: "0 22px", fontSize: 34, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            {txt && <span>{txt}</span>}
            {focus > 0.5 && t < TC.done && <span style={{ width: 2.5, height: 40, marginLeft: 2, marginRight: 3, background: C.ink, opacity: caretOn ? 1 : 0 }} />}
            {!txt && <span style={{ color: "#A9A39B", fontWeight: 400 }}>fx nye priser</span>}
            <div style={{ flex: 1 }} />
            <CheckDot s={36} q={done} />
          </div>
          <div style={{ position: "absolute", left: 34, top: 256, fontSize: 20, color: C.muted }}>Billede</div>
          <div style={{ position: "absolute", left: ZONE.x, top: ZONE.y, width: ZONE.w, height: ZONE.h, boxSizing: "border-box", borderRadius: 16, border: `2px dashed color-mix(in srgb, ${C.sage} ${carry * 100}%, #D9D4CC)`,
            background: `rgba(231,239,236,${(0.7 * carry).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: C.muted }}>
            <span style={{ opacity: 1 - carry }}>Slip et billede her</span>
          </div>
          {inPanel && thumb({ left: ZONE.x + (ZONE.w - THUMB.w) / 2, top: ZONE.y + (ZONE.h - THUMB.h) / 2 })}
        </div>
      </div>
      {/* the live site */}
      <div style={{ position: "absolute", left: SITEP.x, top: SITEP.y, width: SITEP.w, height: SITEP.h, opacity: clamp01(1 - sink), transform: mini(SITEP.x + SITEP.w / 2, 960 + 271 - 160, mS) }}>
        <div style={{ position: "absolute", inset: 0, ...arr(sq, 90, 0.9) }}>
          <div style={{ width: 1460, height: SITE_H, transform: `scale(${SITE_S})`, transformOrigin: "0 0" }}>
            <Browser w={1460} h={SITE_H} url="holmfysio.dk" live={1}>
              <HolmSite w={1460} h={SITE_H - 46} scroll={scroll} headline={NEW_HEADLINE} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 1460, height: 1500, transform: `translateY(${(-scroll).toFixed(2)}px)`, fontFamily: SANS, color: HOLM.ink }}>
                {/* the new hero photo rises into its frame (taller than the frame, so its settle never shows an edge) */}
                <div style={{ position: "absolute", left: 760, top: 120, width: 630, height: 560, borderRadius: 24, overflow: "hidden" }}>
                  {hero > 0 && <div style={{ position: "absolute", left: 0, top: -30, width: 630, height: 620, transform: `translateY(${((1 - hero) * 590).toFixed(2)}px) scale(${(1.07 - 0.07 * Math.min(1, hero)).toFixed(4)})` }}>{photo("holm-stretch.jpg")}</div>}
                </div>
                <div style={{ position: "absolute", left: 760, top: 120, width: 630, height: 560, borderRadius: 24, boxSizing: "border-box", border: `7px solid ${C.sage}`, opacity: hhl, transform: `scale(${mix(0.92, 1.03, ring2).toFixed(4)})` }} />
                {/* the Massage card carries the price */}
                <div style={{ position: "absolute", left: 520, top: 1030, width: 420, height: 130, background: "#fff", borderRadius: "0 0 22px 22px" }}>
                  <div style={{ position: "absolute", left: 12, top: 8, right: 12, bottom: 8, borderRadius: 14, background: C.sageTint, opacity: hl }} />
                  <div style={{ position: "absolute", left: 26, top: 18, fontSize: 24, fontWeight: 600 }}>Massage</div>
                  <div style={{ position: "absolute", left: 26, top: 52, width: 340, height: 56, overflow: "hidden", fontSize: 44, fontWeight: 600, letterSpacing: "-0.025em", color: HOLM.accent, lineHeight: "56px" }}>
                    <div style={{ position: "absolute", transform: `translateY(${(-sw * 56).toFixed(2)}px)`, opacity: 1 - clamp01(sw) }}>400 kr.</div>
                    <div style={{ position: "absolute", transform: `translateY(${((1 - sw) * 56).toFixed(2)}px)`, opacity: clamp01(sw) }}>450 kr.</div>
                  </div>
                </div>
                <div style={{ position: "absolute", left: 520, top: 760, width: 420, height: 400, borderRadius: 22, boxSizing: "border-box", border: `6px solid ${C.sage}`, opacity: hl, transform: `scale(${mix(0.92, 1.03, ring1).toFixed(4)})` }} />
              </div>
            </Browser>
          </div>
        </div>
        {/* "Opdateret" pops onto the window's top edge */}
        <div style={{ position: "absolute", right: 40, top: -32, height: 64, padding: "0 28px 0 16px", borderRadius: 999, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, display: "flex", alignItems: "center", gap: 13,
          fontFamily: SANS, fontSize: 30, fontWeight: 500, color: C.sageDeep, transformOrigin: "50% 100%", ...arr(chip, 40, 0.85) }}><CheckDot s={38} q={pp(g, A2 + 0.32, 0.4, 0.1)} />Opdateret</div>
      </div>
      {/* the couriers */}
      <Courier g={g} at={TC.c1} a={SRC1} b={DST1} bend={95} />
      <Courier g={g} at={TC.c2} a={SRC2} b={DST2} bend={120} />
      {/* the photo, carried by the hand */}
      {t > TC.offer && !inPanel && <div style={{ position: "absolute", left: th.x - THUMB.w / 2, top: th.y - THUMB.h / 2, width: THUMB.w, height: THUMB.h, transform: `scale(${thS.toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, boxShadow: SHADOW_BIG, opacity: clamp01(held) * (1 - lq) }} />
        {thumb({ left: 0, top: 0 })}
      </div>}
    </Group>
  );
};

/* ---------- C2: "Aldrig en linje kode." ---------- */
// The kit's Kinetic look (each word rises through its own mask with a small settle, the line re-centres), with the
// slot opening ahead of the word so two arriving words never overlap. Behind it, faint code; one brush stroke wipes it.
type LW = { t: string; at: number; dur: number; out: number; accent?: boolean; slot?: number };   // slot: s for the line to re-centre (last word only)
const Line: React.FC<{ g: number; items: LW[]; size: number }> = ({ g, items, size }) => {
  const ready = useFonts(), t = g / 30;
  const sp = 0.27 * size, lh = size * 1.25, pad = size * 0.16;
  const st = items.map((it) => {
    const a = (t - it.at) / it.dur, o = t - it.out;
    return { it, w: measure(it.t, size, !!it.accent, true, 400, ready), vis: pp(g, it.at + 0.06, it.dur, 0.07), gone: SINE(clamp01(o / 0.7)), slot: it.slot ? gl(t, it.at, it.slot) : SINE(clamp01(a / 0.62)) };
  });
  let acc = 0, cum = 0;
  const lefts = st.map((x) => { const pre = sp * x.slot * Math.min(1, acc), l = cum + pre; cum += pre + x.slot * x.w; acc += x.slot; return l; });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0 }}>
      {st.map((x, i) => (x.vis <= 0 || x.gone >= 1 ? null : (
        <div key={i} style={{ position: "absolute", left: 0, top: -lh / 2, width: x.w + 2 * pad, height: lh, overflow: "hidden", transform: `translateX(${(lefts[i] - cum / 2 - pad).toFixed(2)}px)` }}>
          <div style={{ position: "absolute", left: pad, top: 0, height: lh, display: "flex", alignItems: "center", transform: `translateY(${((1 - x.vis) * size * 0.9 - x.gone * size * 0.95).toFixed(2)}px)`,
            fontFamily: SERIF, fontWeight: 400, fontSize: size, lineHeight: `${lh}px`, letterSpacing: "-0.02em", whiteSpace: "nowrap", color: x.it.accent ? ACCENT : C.ink, fontStyle: x.it.accent ? "italic" : "normal" }}>{x.it.t}</div>
        </div>
      )))}
    </div>
  );
};
// the code behind the words: what the panel just changed, as the code nobody has to touch
const CODE = [`<section class="priser">`, `  <h3>Massage</h3>`, `  <p class="pris">450 kr.</p>`, `</section>`, `<img src="holm-hero.jpg">`, `.pris { font-weight: 600; }`];
const CODE_X = -250, CODE_LH = 54, MONO = "'JetBrains Mono', 'DejaVu Sans Mono', monospace";
// the brush: seven soft bristles side by side (different reach and strength), sweeping left → right across the code;
// its head wipes the code, its tail lifts off behind it, so it leaves clean cream
const BR = { x0: -330, x1: 330, len: 0.6, lag: 0.2 };
const BRISTLES = [
  { y: -156, h: 12, tl: -18, o: 0.2 }, { y: -104, h: -10, tl: 14, o: 0.3 }, { y: -52, h: 22, tl: -6, o: 0.26 }, { y: 0, h: 4, tl: 20, o: 0.32 },
  { y: 52, h: -14, tl: -12, o: 0.27 }, { y: 104, h: 16, tl: 8, o: 0.3 }, { y: 156, h: -20, tl: -16, o: 0.2 },
];
const CodeWipe: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  if (t > TC.brush + BR.len + BR.lag + 0.1) return null;
  const head = BR.x0 + (BR.x1 - BR.x0 + 40) * gl(t, TC.brush, BR.len), tail = BR.x0 + (BR.x1 - BR.x0 + 100) * gl(t, TC.brush + BR.lag, BR.len);
  const started = t > TC.brush;
  const tilt = (x: number) => -0.035 * x;              // the stroke rises a little to the right, as a hand paints it
  const near = (y: number) => BRISTLES.reduce((b, q) => (Math.abs(q.y - y) < Math.abs(b.y - y) ? q : b));
  return (
    <>
      {CODE.map((ln, i) => {
        const y = (i - 2.5) * CODE_LH, q = pp(g, TC.code + 0.07 * i, 0.5, 0.06);
        const hx = head + near(y).h - 34 - CODE_X;           // the wipe edge inside this line's box, a little behind the bristle tip
        const mask = started ? `linear-gradient(90deg, transparent ${(hx - 26).toFixed(1)}px, #000 ${(hx + 26).toFixed(1)}px)` : undefined;
        return q <= 0 ? null : (
          <div key={i} style={{ position: "absolute", left: CODE_X, top: y - CODE_LH / 2 + tilt(0), height: CODE_LH, display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 28, color: "#D9D4CC", whiteSpace: "pre",
            opacity: clamp01(q * 1.4), transform: `translateY(${((1 - q) * 16).toFixed(2)}px)`, WebkitMaskImage: mask, maskImage: mask }}>{ln}</div>
        );
      })}
      {started && head - tail > 2 && <svg width={2} height={2} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs><filter id="c-brush" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation={2.2} /></filter></defs>
        <g filter="url(#c-brush)">
          {BRISTLES.map((b, i) => {
            const x1 = head + b.h, x0 = Math.min(x1, tail + b.tl);
            return x1 - x0 < 1 ? null : <line key={i} x1={x0} y1={b.y + tilt(x0)} x2={x1} y2={b.y + tilt(x1)} stroke={C.sageLight} strokeWidth={60} strokeLinecap="round" opacity={b.o} />;
          })}
        </g>
      </svg>}
    </>
  );
};
const C2: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  // fully up ~51.6 → 52.85: it reads at the centre, then glides up as a heading while the plan card rises, and leaves upward
  const up = ppw(g, TC.up, 1.5, 0.03, 0.4), off = awayw(g, TC.off, 0.7, 0.25);
  return (
    <Group s={push(t, 50.0, 53.5, 0.94)}>
      <div style={{ position: "absolute", left: 960, top: 450, opacity: clamp01(1 - off), transform: `translateY(${(-285 * up - 70 * off).toFixed(2)}px) scale(${mix(1, 0.5, up).toFixed(4)})` }}>
        <CodeWipe g={g} />
        <Line g={g} size={TYPE.hero} items={[
          { t: "Aldrig", at: 50.2, dur: 0.62, out: 99 }, { t: "en", at: 50.62, dur: 0.62, out: 99 },
          { t: "linje", at: 50.85, dur: 0.62, out: 99 }, { t: "kode.", at: 51.08, dur: 0.8, accent: true, out: 99, slot: 1.0 },
        ]} />
      </div>
    </Group>
  );
};

/* ---------- C3: the plan card ---------- */
const PLAN = { x: 510, y: 270, w: 900, h: 540 };
const C3: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const q = ppw(g, TC.plan, 1.0, 0.03, 0.25), out = awayw(g, TC.planOut, 0.95), gone = sn(t, TC.planOut + 0.08, 0.66);
  const title = pp(g, TC.title, 0.6, 0.05), row = pp(g, TC.row, 0.55, 0.06), tick = pp(g, TC.tick, 0.4, 0.1), price = pp(g, TC.price, 0.6, 0.05);
  const yr = TC.years.map((a) => pp(g, a, 0.55, 0.07)), lab = TC.years.map((a) => pp(g, a + 0.07, 0.5, 0.06));
  const line = gl(t, TC.level, 0.7);
  // the glint: a small light running the level line once, after it is drawn
  const gq = gl(t, TC.glint, 0.6), go = Math.sin(Math.PI * clamp01((t - TC.glint) / 0.6));
  return (
    <Group s={push(t, 52.3, 57.1, 0.93) * 1.15}>
      <div style={{ position: "absolute", left: PLAN.x, top: PLAN.y, width: PLAN.w, height: PLAN.h, opacity: 1 - gone, transform: `translateY(${(-out * 300).toFixed(2)}px) scale(${(1 - 0.05 * out).toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, ...arr(q, 120, 0.9) }}>
          <div style={{ position: "absolute", left: 52, top: 44, transformOrigin: "0 100%", ...arr(title, 30, 0.96) }}>
            <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>Hosting</div>
            <div style={{ marginTop: 6, fontFamily: SERIF, fontSize: 48, letterSpacing: "-0.025em", lineHeight: 1.1 }}>holmfysio.dk</div>
          </div>
          <div style={{ position: "absolute", right: 52, top: 54, fontFamily: SERIF, fontSize: 62, letterSpacing: "-0.025em", lineHeight: 1, whiteSpace: "nowrap", transformOrigin: "100% 50%", ...arr(price, 44, 0.9) }}>99 kr.<span style={{ fontSize: 32, color: C.muted }}> /md.</span></div>
          <div style={{ position: "absolute", left: 52, top: 152, width: 796, height: 1, background: C.line }} />
          <div style={{ position: "absolute", left: 52, top: 153, height: 84, display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 500, letterSpacing: "-0.01em", transformOrigin: "0 50%", ...arr(row, 36, 0.94) }}>
            <CheckDot s={40} q={tick} />Stop når som helst</div>
          <div style={{ position: "absolute", left: 52, top: 238, width: 796, height: 1, background: C.line }} />
          {/* the same price every year: three equal columns grow up in turn under one level line */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 52 + i * 272, top: 290, width: 252, height: 210 }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 252, height: 156, borderRadius: 16, background: C.sage, transformOrigin: "50% 100%", transform: `scaleY(${Math.max(0, yr[i]).toFixed(4)})`, opacity: clamp01(yr[i] * 3) }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 252, height: 156, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 500, letterSpacing: "-0.015em", color: C.white, whiteSpace: "nowrap", ...arr(lab[i], 40, 0.9) }}>99 kr. /md.</div>
              <div style={{ position: "absolute", left: 0, top: 168, width: 252, textAlign: "center", fontSize: 23, color: C.muted, ...arr(lab[i], 14, 0.94) }}>År {i + 1}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 52, top: 286, width: 796, height: 4, borderRadius: 2, background: C.sageDark, transformOrigin: "0 50%", transform: `scaleX(${line.toFixed(4)})` }} />
          {go > 0.001 && <>
            <div style={{ position: "absolute", left: 52 - 80 + 796 * gq, top: 288 - 22, width: 160, height: 44, opacity: go * 0.9, background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.85), rgba(255,255,255,0) 72%)" }} />
            <div style={{ position: "absolute", left: 52 - 45 + 796 * gq, top: 286, width: 90, height: 4, borderRadius: 2, opacity: go, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.95), rgba(255,255,255,0))" }} />
          </>}
        </div>
      </div>
    </Group>
  );
};

/* ---------- C4: Danish support ---------- */
const CHAT = { x: 550, y: 240, w: 820, h: 600 };
const SEND = { x: CHAT.x + CHAT.w - 24 - 30, y: CHAT.y + CHAT.h - 24 - 30 };   // the send button's centre in the panel's layout
const REPLY = "Selvfølgelig. Jeg kigger på det nu.";
const KC = 1.2;                                                              // the chat shows at 1.2× (984 × 720)
const SEND_S = { x: 960 + (SEND.x - 960) * KC, y: 540 + (SEND.y - 540) * KC };
const BUB_H = 17 * 2 + 28 * 1.25;                                           // a bubble's height (padding + one line)
const C4: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const q = ppw(g, TC.chat, 1.0, 0.03, 0.25), sink = away(g, T_SINK, 0.9), gone = sn(t, T_SINK, 0.55);
  const b1 = pp(g, TC.b1, 0.45, 0.07), who = pp(g, TC.sofie, 0.45, 0.06), flag = pp(g, TC.flag, 0.45, 0.1);
  // the typing indicator: a small bubble with three logo dots that bob in one wave, then the reply grows out of it
  const ind = pp(g, TC.sofie, 0.32, 0.08) * popOut(g, TC.reply, { dur: 0.22 }), bub = pp(g, TC.reply, 0.45, 0.04);
  const bob = (i: number) => { const u = clamp01((t - TC.wave - 0.09 * i) / 0.32); return Math.sin(Math.PI * u) ** 2; };
  const txt = typed(g, TC.rtype, REPLY, 56);
  const bubble: React.CSSProperties = { padding: "17px 26px", fontSize: 28, lineHeight: 1.25, letterSpacing: "-0.01em", whiteSpace: "nowrap" };
  return (
    <Group s={push(t, TC.chat, T_SEND, 0.94) * KC}>
      <div style={{ position: "absolute", left: CHAT.x, top: CHAT.y, width: CHAT.w, height: CHAT.h, opacity: 1 - gone, transform: `translateY(${(sink * 170).toFixed(2)}px) scale(${(1 - 0.08 * sink).toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, ...arr(q, 200, 0.9) }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: CHAT.w, height: 92, borderBottom: `1px solid ${C.line}`, boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 32 + 24, top: 46 }}><Icon size={48} /></div>
            <div style={{ position: "absolute", left: 98, top: 28, fontSize: 28, fontWeight: 600, letterSpacing: "-0.015em" }}>Creoble Support</div>
          </div>
          {/* the customer */}
          <div style={{ position: "absolute", right: 32, top: 124, transformOrigin: "100% 100%", borderRadius: "24px 24px 8px 24px", background: "#F1EEE8", ...bubble, ...arr(b1, 50, 0.88) }}>Kan I hjælpe med min e-mail?</div>
          {/* Sofie */}
          <div style={{ position: "absolute", left: 32, top: 232, width: 700, height: 150 }}>
            <div style={{ position: "absolute", left: 0, top: 4, width: 52, height: 52, borderRadius: 26, background: C.sage, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, fontWeight: 600, transformOrigin: "50% 50%", opacity: clamp01(who * 2), transform: `scale(${Math.max(0, mix(0.6, 1, who)).toFixed(4)})` }}>S</div>
            <div style={{ position: "absolute", left: 68, top: 0, height: 36, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 23, fontWeight: 600, display: "inline-block", transformOrigin: "0 50%", ...arr(who, 16, 0.94) }}>Sofie</span>
              <div style={{ height: 36, padding: "0 14px 0 10px", borderRadius: 999, background: C.sageTint, display: "flex", alignItems: "center", gap: 9, fontSize: 19, fontWeight: 500, color: C.sageDeep, transformOrigin: "0 50%", opacity: clamp01(flag * 1.6), transform: `translateY(${((1 - flag) * 16).toFixed(2)}px) scale(${mix(0.7, 1, flag).toFixed(4)})` }}>
                <svg width={26} height={19} viewBox="0 0 37 28" style={{ borderRadius: 3, display: "block" }}><rect width="37" height="28" fill="#C8102E" /><rect x="12" width="4" height="28" fill="#fff" /><rect y="12" width="37" height="4" fill="#fff" /></svg>
                Dansk support</div>
            </div>
            {/* the typing indicator */}
            {ind > 0.003 && <div style={{ position: "absolute", left: 68, top: 48, width: 118, height: BUB_H, borderRadius: "8px 24px 24px 24px", background: C.sageTint, transformOrigin: "0 0", opacity: clamp01(ind * 1.8), transform: `scale(${mix(0.55, 1, ind).toFixed(4)})` }}>
              {[0, 1, 2].map((i) => {
                const r = LOGO[i].r * 0.72, b = bob(i);
                return <div key={i} style={{ position: "absolute", left: 32 + 27 * i - r, top: BUB_H / 2 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: C.sage, opacity: 0.6 + 0.4 * b, transform: `translateY(${(-9 * b).toFixed(2)}px)` }} />;
              })}
            </div>}
            {/* the reply */}
            {bub > 0.003 && <div style={{ position: "absolute", left: 68, top: 48, borderRadius: "8px 24px 24px 24px", background: C.sageTint, transformOrigin: "0 0", opacity: clamp01(bub * 2), transform: `translateY(${((1 - bub) * 10).toFixed(2)}px) scale(${mix(0.86, 1, bub).toFixed(4)})`, ...bubble }}>
              <span style={{ visibility: "hidden" }}>{REPLY}</span>
              <span style={{ position: "absolute", left: 26, top: 17 }}>{txt}</span>
            </div>}
          </div>
          {/* the message field; the send button is drawn by the outro once it is pressed */}
          <div style={{ position: "absolute", left: 32, bottom: 24, width: CHAT.w - 32 - 24 - 60 - 16, height: 60, boxSizing: "border-box", borderRadius: 14, border: "1.5px solid #E1DDD6", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 22, color: "#A9A39B" }}>Skriv en besked…</div>
          {t < T_SEND && <div style={{ position: "absolute", right: 24, bottom: 24, width: 60, height: 60, borderRadius: 16, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico n="arrow" s={28} c={C.white} w={2.4} style={{ transform: "rotate(-90deg)" }} /></div>}
        </div>
      </div>
    </Group>
  );
};

/* ---------- C5: the outro ---------- */
// The pressed send button turns sage and contracts into a dot; the dot glides to the centre on a calm arc and is the
// logo's largest dot; the other five unfurl round the ring from it as it lands; the C moves left as the wordmark
// slides out under a soft light sweep; the button rises on "gratis"; the address types on "creoble.dk"; the final
// press turns the six dots once, slowly and evenly, as the loader did, and a gentle shine crosses the button.
const LOGO_S = 200, LY = 420, WM_H = 112, GAP = 44;
const C_W = (78.81 - 17.06) * (LOGO_S / 100);                     // the C's visual width
const LOCK_W = C_W + GAP + WM_H * 4.77;
const C_X1 = 960 - LOCK_W / 2 + C_W / 2;                          // the C's visual centre in the lockup
const UNWRAP = ANG.map((a) => (a <= ANG[0] ? a : a - 2 * Math.PI));   // the ring, counter-clockwise from the largest dot
const ADDR = "creoble.dk";
const T_FLY = T_SEND + 0.26;
const even = (x: number, r = 0.18) => { const v = 1 / (1 - r); return x <= 0 ? 0 : x >= 1 ? 1 : x < r ? (v * x * x) / (2 * r) : x < 1 - r ? v * (x - r / 2) : 1 - (v * (1 - x) * (1 - x)) / (2 * r); };
const C5: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, s = LOGO_S / 100, R = RING.r * s;
  const P = 1 + 0.06 * clamp01((t - 58.6) / (65.2 - 58.6));
  const shift = pp(g, 59.3, 0.95, 0.03), dx = (C_X1 - 960) * shift;
  const spin = 2 * Math.PI * even((t - (T_PRESS + 0.12)) / (65.12 - T_PRESS - 0.12));
  const ring0 = { x: 960 + (RING.x - BOX_C.x) * s, y: LY + (RING.y - BOX_C.y) * s };
  const D0 = { x: ring0.x + Math.cos(ANG[0]) * R, y: ring0.y + Math.sin(ANG[0]) * R };
  // the lead dot: press, sage, circle, flight (the ring travels with it); the flight lands with a soft settle
  const pr = press(g, T_SEND), sage = sn(t, T_SEND + 0.02, 0.26), round = pp(g, T_SEND + 0.05, 0.32, 0.06);
  const FLY = (tt: number) => pp(tt * 30, T_FLY, 0.82, 0.025);
  const fl = FLY(t), u = 1 - fl;
  const mx = (SEND_S.x + D0.x) / 2 + 0.776 * 110, my = (SEND_S.y + D0.y) / 2 - 0.631 * 110;
  const bez = (q: number) => { const w = 1 - q; return { x: w * w * SEND_S.x + 2 * w * q * mx + q * q * D0.x, y: w * w * SEND_S.y + 2 * w * q * my + q * q * D0.y }; };
  const lead0 = bez(fl);
  // the smear: the dot stretches along its path and leaves a soft sage trail (wide and faint at the tail, tapering
  // to the dot), which closes up into the dot and fades as it lands
  const vel = Math.max(-0.3, Math.min(1.2, ((FLY(t + 0.01) - FLY(t - 0.01)) / 0.02) * 0.3));
  const tan = { x: 2 * u * (mx - SEND_S.x) + 2 * fl * (D0.x - mx), y: 2 * u * (my - SEND_S.y) + 2 * fl * (D0.y - my) }, dir = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
  const tailQ = FLY(t - 0.42), trailO = sn(t, T_FLY + 0.05, 0.25) * (1 - sn(t, 59.05, 0.7));
  const N = 24, pts = Array.from({ length: N + 1 }, (_, i) => { const k = i / N, q = mix(tailQ, fl, k), a = bez(q), b = bez(Math.min(1, q + 0.01)), c0 = bez(Math.max(0, q - 0.01)), L = Math.hypot(b.x - c0.x, b.y - c0.y) || 1; return { x: a.x, y: a.y, nx: -(b.y - c0.y) / L, ny: (b.x - c0.x) / L, w: mix(40, 19, k) }; });
  const trailD = fl - tailQ > 0.004 ? "M" + pts.map((q) => `${(q.x + q.nx * q.w).toFixed(1)} ${(q.y + q.ny * q.w).toFixed(1)}`).join(" L") + " L" + pts.slice().reverse().map((q) => `${(q.x - q.nx * q.w).toFixed(1)} ${(q.y - q.ny * q.w).toFixed(1)}`).join(" L") + " Z" : "";
  const ring = { x: lead0.x - Math.cos(ANG[0]) * R + dx, y: lead0.y - Math.sin(ANG[0]) * R };
  const lead = { x: ring.x + Math.cos(ANG[0] + spin) * R, y: ring.y + Math.sin(ANG[0] + spin) * R };
  const leadScale = mix(KC, (LOGO[0].r * s * 2) / 60, round) * (1 - 0.06 * pr);
  const others = [1, 2, 3, 4, 5].map((i) => {
    const q = pp(g, 58.96 + (i - 1) * 0.055, 0.5, 0.08), a = mix(ANG[0], UNWRAP[i], q) + spin;
    return { x: ring.x + Math.cos(a) * R, y: ring.y + Math.sin(a) * R, r: LOGO[i].r * s * clamp01(q * 1.4) };
  });
  const wm = pp(g, 59.34, 0.95, 0.03), wmask = `linear-gradient(90deg, #000 ${(wm * 116 - 10).toFixed(2)}%, transparent ${(wm * 116).toFixed(2)}%)`, wx = (960 - C_X1) * (1 - shift);
  // the light sweep: a cream band crossing the glyphs just behind the reveal
  const sw = -0.2 + 1.45 * gl(t, 59.62, 1.0), swO = Math.sin(Math.PI * clamp01((t - 59.62) / 1.0)) * 0.6;
  const swMask = `linear-gradient(90deg, transparent ${((sw - 0.13) * 100).toFixed(2)}%, #000 ${(sw * 100).toFixed(2)}%, transparent ${((sw + 0.13) * 100).toFixed(2)}%)`;
  const btn = pp(g, 59.84, 0.6, 0.04), bp = press(g, T_PRESS, 0.16), bw = wobble(g, T_PRESS + 0.26, 0.012, 0.6);
  const shine = gl(t, T_PRESS + 0.2, 0.65);
  const adr = typed(g, 60.9, ADDR, 12), caret = t > 60.8 && (t < 61.8 || Math.floor((t - 61.8) * 2) % 2 === 0);
  return (
    <Group s={P}>
      <Dots dots={others} />
      {trailD && trailO > 0.002 && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: trailO, transform: `translateX(${dx.toFixed(2)}px)` }}>
        <defs>
          <linearGradient id="c-trail" gradientUnits="userSpaceOnUse" x1={pts[0].x} y1={pts[0].y} x2={pts[N].x} y2={pts[N].y}><stop offset="0" stopColor={C.sage} stopOpacity={0} /><stop offset="0.55" stopColor={C.sage} stopOpacity={0.22} /><stop offset="1" stopColor={C.sage} stopOpacity={0.6} /></linearGradient>
          <filter id="c-trail-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={7} /></filter>
        </defs>
        <path d={trailD} fill="url(#c-trail)" filter="url(#c-trail-soft)" />
      </svg>}
      <div style={{ position: "absolute", left: 960 - LOCK_W / 2 + C_W + GAP, top: LY - WM_H / 2, transform: `translateX(${wx.toFixed(2)}px)`, WebkitMaskImage: wm < 1 ? wmask : undefined, maskImage: wm < 1 ? wmask : undefined }}>
        <Wordmark h={WM_H} />
        {swO > 0.003 && <div style={{ position: "absolute", left: 0, top: 0, opacity: swO, WebkitMaskImage: swMask, maskImage: swMask }}><Wordmark h={WM_H} tone="light" /></div>}
      </div>
      {/* the send button → the dot */}
      <div style={{ position: "absolute", left: lead.x - 30, top: lead.y - 30, width: 60, height: 60, borderRadius: mix(16, 30, Math.min(1, round)), background: `color-mix(in srgb, ${C.sage} ${(sage * 100).toFixed(1)}%, ${C.ink})`,
        transform: `rotate(${dir.toFixed(2)}deg) scale(${(1 + 0.42 * vel).toFixed(4)}, ${(1 - 0.08 * vel).toFixed(4)}) rotate(${(-dir).toFixed(2)}deg) scale(${leadScale.toFixed(4)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {round < 1 && <Ico n="arrow" s={28} c={C.white} w={2.4} style={{ transform: "rotate(-90deg)", opacity: clamp01(1 - round) }} />}
      </div>
      {/* the button */}
      <div style={{ position: "absolute", left: 960 - 230, top: 566, width: 460, height: 88, ...arr(btn, 70, 0.9) }}>
        <div style={{ position: "relative", overflow: "hidden", width: 460, height: 88, borderRadius: 12, background: C.ink, color: C.btnText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: "-0.01em", whiteSpace: "nowrap",
          transform: `scale(${(1 - 0.05 * bp + bw).toFixed(4)})` }}>
          {shine > 0 && shine < 1 && <div style={{ position: "absolute", top: -20, bottom: -20, left: -150 + shine * 760, width: 130, transform: "skewX(-20deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.26), rgba(255,255,255,0))" }} />}
          <span style={{ position: "relative" }}>Byg din side gratis</span>
        </div>
      </div>
      {/* the address */}
      <div style={{ position: "absolute", left: 0, top: 700, width: 1920, display: "flex", justifyContent: "center", fontFamily: SANS, fontSize: 32, color: C.ink, letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>
        <div style={{ position: "relative" }}>
          <span style={{ visibility: "hidden" }}>{ADDR}</span>
          <span style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center" }}>{adr}<span style={{ width: 2, height: 34, marginLeft: 3, background: C.ink, opacity: caret ? 1 : 0, flex: "none" }} /></span>
        </div>
      </div>
    </Group>
  );
};

/* ---------- the hand cursor (screen px, one for the whole scene) ---------- */
// It enters from below with the photo, takes it and lays it on the panel, leaves downward; rises to the chat's send
// button; leaves; rises to the final button and stays resting by it. Each glide gets the time its distance needs and
// a calm rest (0.4–0.5 s) before its click. Targets are re-evaluated every frame, so it stays on a target that moves.
const BTN_TIP = { x: 960, y: 610 }, BTN_REST = { x: 1150, y: 612 };   // the press lands on the centre of "Byg din side gratis"; it then rests on the right end, clear of the address
export function handKeys(t: number): HandKey[] {
  const at = (x: number, y: number, sc: number) => ({ x: 960 + (x - 960) * sc, y: 540 + (y - 540) * sc });
  const P1 = push(t, TC.card, 53.0);
  const tray = at(TRAY.x, TRAY.y, P1), zone = at(SRC2.x, SRC2.y, P1);
  const send = at(SEND.x, SEND.y, push(t, TC.chat, T_SEND, 0.94) * KC);
  const P5 = 1 + 0.06 * clamp01((t - 58.6) / (65.2 - 58.6)), btn = at(BTN_TIP.x, BTN_TIP.y, P5), rest = at(BTN_REST.x, BTN_REST.y, P5);
  return [
    { at: 45.0, x: tray.x + 30, y: 1300 },
    { at: T_GRAB, x: tray.x, y: tray.y, click: true, early: 0.45 },
    { at: T_DROP, x: zone.x, y: zone.y, click: true, early: 0.4 },
    { at: 49.8, x: 640, y: BELOW, early: 0 },
    { at: 56.7, x: send.x + 50, y: BELOW, early: 0 },
    { at: T_SEND, x: send.x, y: send.y, click: true, early: 0.5 },
    { at: 59.65, x: send.x + 60, y: BELOW, early: 0 },
    { at: 60.9, x: btn.x + 40, y: BELOW, early: 0 },
    { at: T_PRESS, x: btn.x, y: btn.y, click: true, early: 0.42 },
    { at: 63.75, x: rest.x, y: rest.y, early: 0 },
  ];
}

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h2") + 9) return <Handoff2 g={g} />;
  const t = g / 30;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {t < 53.0 && <C1 g={g} />}
      {t > 52.2 && t < 57.15 && <C3 g={g} />}
      {t > 50.0 && t < 54.0 && <C2 g={g} />}
      {t > 56.2 && t < 59.9 && <C4 g={g} />}
      {t >= T_SEND && <C5 g={g} />}
      <Hand {...handAt(g, handKeys(t), { size: HAND })} />
    </AbsoluteFill>
  );
};
