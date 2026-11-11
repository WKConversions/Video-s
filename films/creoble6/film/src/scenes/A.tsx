// Scene A (0 → h1, 20.5 s), contract 2: object-led Apple motion. Four fixed frames, each with a slow steady push:
//   Hook   0 – 7.85   the line with the old website inside it; the window grows (the hook's one push) and pushes the
//                     words out; its content drops away to "Siden kan ikke findes"; the window rounds into a circle
//                     as it shrinks into a dot (one morph), and a single soft sage ripple leaves the forming logo.
//   Logo   7.5 – 9.2  the dot opens into the six dots, the wordmark slides out beside it; the lockup leaves upward.
//   Wizard 8.1 – 15.4 the window rises; one push to the form column; the progress row docks at the top (sticky) and
//                     its six segments fill with a sage wipe, one per completed field; each completed field gets a
//                     sage underline sweep. The cursor clicks name, Branche, "Fysioterapi" and "Fortsæt"; the other
//                     fields follow by Tab while the cursor glides to the button.
//   Site   14.3 – h1  the pressed button smears into the progress bar (100), the bar becomes the window's top bar;
//                     text, photos, layout arrive; three answer cards fly in with comet trails and land with a bloom.
// Every object moves with motion.tsx (pop in, popOut out, wobble after an impact); the camera moves stay sine.
// Times below are film seconds (t = g / 30).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, SANS, SERIF, SHADOW, SHADOW_BIG, INOUT, clamp01, mix } from "../lib";
import { f, press, typed, Browser, Wordmark } from "../shared";
import { Kinetic, KItem, measure, useFonts } from "../type";
import { Dots, LOGO, RING, ANG } from "../dots";
import { Stage3D, Plane, cam, project } from "../cam";
import { Wizard, WIZ_WIN, WIZ_R, Handoff1, camH1, H1_SITE, SITE_WIN, SiteWindow, HANDOFF_HALF } from "../ui";
import { OldSite, OldWindow, OLD } from "./A_old";
import { SiteBuild } from "./A_site";
import { Hand, handAt, HandKey } from "../hand";
import { pop, popOut, wobble } from "../motion";

export const BLUR: [number, number][] = [];

export const EVENTS: { t: number; kind: "click" | "type" | "check" | "pop" | "open" | "send" | "logo"; len?: number; note: string }[] = [
  { t: 0.1, kind: "pop", len: 1.6, note: "three more old sites fly up from below and tuck in behind the first, one after another (soft, 0.05 / 0.5 / 0.95)" },
  { t: 1.8, kind: "pop", note: "the stack turns once: the front site drops away, the next comes forward (soft card flick)" },
  { t: 3.3, kind: "pop", len: 1.5, note: "the stack turns three more times while the line is read (three soft card flicks, 3.3 / 3.85 / 4.4)" },
  { t: 4.55, kind: "open", len: 1.8, note: "the hook's push: the old window grows and pushes the line out to the right (soft swell)" },
  { t: 5.05, kind: "pop", len: 1.4, note: "the old site's rows drop away, top to bottom (six soft ticks, 0.2 s apart)" },
  { t: 5.85, kind: "check", note: "'Siden kan ikke findes' lands (dull error tone, not a chime)" },
  { t: 6.6, kind: "click", note: "the hand presses 'Opdater' once; nothing happens (dry old click)" },
  { t: 6.85, kind: "pop", len: 1.0, note: "the window's corners round into a circle as it shrinks into the dot (one soft morph); the dot lands with a small pop at 7.85" },
  { t: 7.55, kind: "logo", note: "the dot opens into the six dots, turning; the wordmark slides out" },
  { t: 7.82, kind: "pop", len: 1.15, note: "a single soft sage ripple ring expands from the forming logo and fades (airy, very quiet)" },
  { t: 8.05, kind: "open", len: 1.3, note: "the wizard window rises from below; the lockup leaves upward (8.45)" },
  { t: 9.4, kind: "click", note: "the hand clicks into Virksomhedsnavn" },
  { t: 9.45, kind: "type", len: 0.73, note: "types 'Holm Fysioterapi'" },
  { t: 9.9, kind: "pop", len: 0.5, note: "the progress row docks at the top of the frame as the camera pushes in (a soft hairline settles under it)" },
  { t: 10.2, kind: "check", note: "name done: a sage underline sweeps under the field, progress segment 2 fills with a sage wipe (light tick)" },
  { t: 10.75, kind: "click", note: "the hand clicks Branche, the menu opens" },
  { t: 11.95, kind: "click", note: "the hand picks 'Fysioterapi', the menu closes" },
  { t: 11.98, kind: "check", note: "Branche done: underline sweep under Branche, segment 3 fills (light tick, a step higher)" },
  { t: 11.99, kind: "pop", note: "the field 'Hvad laver du?' eases in, the fields below make room" },
  { t: 12.22, kind: "type", len: 0.77, note: "types 'Genoptræning og massage'" },
  { t: 12.0, kind: "pop", len: 2.0, note: "the page scrolls down to the button (soft, settles)" },
  { t: 13.0, kind: "check", note: "'Hvad laver du?' done: underline sweep, segment 4 fills; Tab to E-mail" },
  { t: 13.06, kind: "type", len: 0.63, note: "types 'kontakt@holmfysio.dk'" },
  { t: 13.7, kind: "check", note: "E-mail done: underline sweep, segment 5 fills; Tab to Telefon" },
  { t: 13.76, kind: "type", len: 0.4, note: "types '+45 31 42 53 64'" },
  { t: 14.17, kind: "check", note: "Telefon done: underline sweep, segment 6 fills: the progress row is full (brightest tick)" },
  { t: 14.3, kind: "send", note: "the hand presses 'Fortsæt'; the button turns sage" },
  { t: 14.46, kind: "open", len: 1.3, note: "the smear: the sage button stretches out to the right and sweeps across the frame, in again from the left (one long soft whoosh, rising then settling)" },
  { t: 14.92, kind: "type", len: 0.45, note: "the number counts 0 to 100 beside the bar (fine fast ticks slowing down, not keyboard)" },
  { t: 14.88, kind: "logo", len: 1.4, note: "the six-dot logo turns at the bar's head (loader)" },
  { t: 15.36, kind: "check", note: "the count lands on 100 and holds" },
  { t: 15.85, kind: "pop", len: 0.8, note: "the bar rises carrying the 100 and thins into the site window's top bar" },
  { t: 16.34, kind: "open", len: 0.6, note: "the site window unfolds down from its top bar" },
  { t: 16.28, kind: "pop", len: 0.6, note: "the photo frames slide into the empty page (very soft)" },
  { t: 16.3, kind: "pop", len: 0.6, note: "headline lines and text rise in" },
  { t: 16.8, kind: "pop", note: "the hero photo slides up into its frame" },
  { t: 17.1, kind: "pop", len: 0.6, note: "three service photos slide in, left to right" },
  { t: 17.15, kind: "pop", len: 0.6, note: "three answer cards rise in from below (Virksomhedsnavn, Branche, Hvad laver du?)" },
  { t: 17.4, kind: "pop", len: 0.5, note: "navigation slides into the layout, left to right; the button at 18.0" },
  { t: 18.15, kind: "send", len: 0.52, note: "card 'Holm Fysioterapi' flies into the navigation with a short sage comet trail (small airy whoosh)" },
  { t: 18.67, kind: "check", note: "'Holm Fysioterapi' lands in the navigation: a soft sage bloom on the spot" },
  { t: 18.6, kind: "send", len: 0.52, note: "card 'Fysioterapi' flies into the text with a comet trail (whoosh, a little higher)" },
  { t: 19.12, kind: "check", note: "'Fysioterapi' lands in the text: sage bloom" },
  { t: 19.05, kind: "send", len: 0.52, note: "card 'Genoptræning og massage' flies into the service cards with a comet trail (whoosh, highest)" },
  { t: 19.57, kind: "check", note: "'Genoptræning og massage' lands in the service cards: sage bloom; the loader finishes" },
];

/* ---------- small helpers ---------- */
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const sine = (u: number) => (1 - Math.cos(Math.PI * clamp01(u))) / 2;
const P = (g: number, at: number, dur: number, over: number) => pop(g, at, { dur, over });          // an object in (motion.tsx)
const PO = (g: number, at: number, dur: number, over = 0.04) => popOut(g, at, { dur, over });       // an object out (1 → 0)
// soft: a critically damped spring of the third order (no overshoot, a gentle start); only for the hook's growing
// window, which is part of the hook's camera push
const soft = (t: number, at: number, response = 0.8) => { const x = Math.max(0, t - at) * ((3 * Math.PI) / response); return 1 - (1 + x + (x * x) / 2) * Math.exp(-x); };

// the logo opening out of ONE dot: all six start on the first dot (ring radius 0), the ring opens (ro) and the dots
// fan round it from the largest (fan[i]); spin in degrees. Circles in screen px.
const D_ANG = [0, -57.8, -110.4, -157.7, -200.1, -237.5].map((d) => (d * Math.PI) / 180);
const fanDots = (size: number, cx: number, cy: number, spin: number, ro: number, fan: number[], grow = 1) => {
  const u = size / 100, a0 = ANG[0] + (spin * Math.PI) / 180;
  return LOGO.map((d, i) => {
    const a = a0 + D_ANG[i] * fan[i], R = RING.r * u * ro;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, r: (i === 0 ? d.r : d.r * (fan[i] < 0.02 ? 0 : 0.4 + 0.6 * Math.min(1, fan[i]))) * u * Math.max(0, grow) };
  });
};

/* ================= Hook: 0 – 7.85 ================= */
const SIZE = 76, SLOT0 = 380, SLOT1 = 1100, PUSH0 = 4.5, PUSH1 = 6.9, M0 = 6.85, M1 = 7.85;
const LOGO_S = 260;                                   // the lockup's C
const LOCK = { cx: 723.5, cy: 545.7, wmX: 834, wmH: 96 };
const lockSpin = (g: number) => -150 * (1 - P(g, 7.55, 0.9, 0.04));     // the dots turn into the C's rest pose and settle
const dot0At = (g: number) => {                       // where the first dot is while the lockup opens (screen px)
  const q = P(g, 7.45, 0.55, 0.04), ro = P(g, 7.5, 0.5, 0.06), a = ANG[0] + (lockSpin(g) * Math.PI) / 180;
  const cx = mix(960, LOCK.cx, q), cy = mix(540, LOCK.cy, q), R = RING.r * (LOGO_S / 100) * ro;
  return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, cx, cy, ro };
};
// ONE line that only grows: the old site at the left, the words arriving on their spoken words
const hookItems = (slotW: number): KItem[] => [
  { node: <div style={{ width: slotW, height: 1 }} />, w: slotW, at: -1 },
  { t: "En", at: 1.38 }, { t: "hjemmeside,", at: 1.5, dur: 0.8 },
  { t: "de", at: 2.18 }, { t: "ikke", at: 2.3 }, { t: "er", at: 2.68 },
  { t: "stolte", at: 2.88, accent: true }, { t: "af.", at: 3.2 },
];
// the same slot maths as Kinetic, to find where the inline window sits (its centre, relative to the line's centre)
const slotCentre = (g: number, items: KItem[], size: number, ready: boolean) => {
  const gap = 0.27 * size; let acc = 0, cum = 0, c = 0;
  for (const it of items) {
    const w = it.node ? (it.w ?? size) : measure(it.t ?? "", size, !!it.accent, true, 400, ready);
    const a = f(it.at), dur = (it.dur ?? 0.6) * 30, o = it.out !== undefined ? f(it.out) : Infinity;
    const slot = INOUT(clamp01((g - a) / (dur * 0.9))) * (1 - INOUT(clamp01((g - o - 3) / 16.5)));
    const pre = gap * slot * Math.min(1, acc), l = cum + pre;
    if (it.node) c = l + (slot * w) / 2;
    cum += pre + slot * w; acc += slot;
  }
  return c - cum / 2;
};
const TIMES = "'Times New Roman', 'Liberation Serif', Times, serif", ARIAL = "Arial, 'Liberation Sans', Helvetica, sans-serif";
const BANDS: [number, number][] = [[80, 256], [256, 333], [333, 404], [404, 497], [497, 690], [690, 760]];
// the window → dot morph: one smooth collapse (soft start on the big surface, accelerating into the dot) that ends on
// the dot at M_DOT; the dot then lands with a small pop (dotPop, also on the lockup's first dot) and sends the ripple
const M_DOT = M1;
const morphM = (g: number) => sine(Math.pow(seg(g / 30, M0, M_DOT), 1.75));
const dotPop = (g: number) => 1 + wobble(g, M_DOT - 0.04, 0.16, 0.6);
// the hook's geometry (the window's centre cx, cy and scale ls, in the hook's frame, which the slow push scales by zs)
const hookGeo = (g: number, ready: boolean) => {
  const t = g / 30;
  const E = sine(1 - Math.pow(1 - seg(t, PUSH0, PUSH1), 1.8));       // the one push: a soft start, a long soft landing under the 404
  const slotW = SLOT0 * mix(0.8, 1, soft(t, 0, 1.6)) * Math.pow(SLOT1 / SLOT0, E);   // the window: visibly growing from frame 0, then the push
  const extra = 460 * sine(seg(t, PUSH0 + 0.15, 6.1));               // the growing window pushes the words out to the right
  const items = hookItems(slotW + extra);
  const zs = 1 + 0.012 * t;                                             // the slow steady push
  const m = morphM(g), d0 = dot0At(g);
  const rel = slotCentre(g, items, SIZE, ready) - extra / 2;            // the window's centre, relative to the line's centre
  const cx = 960 + rel * (1 - E) + (d0.x - 960) / zs, cy = 540 + (d0.y - 540) / zs;
  const ls0 = slotW / OLD.w, lsDot = (2 * LOGO[0].r * LOGO_S) / 100 / zs / OLD.h;
  return { E, items, zs, m, rel, cx, cy, ls: mix(ls0, lsDot, m) * dotPop(g) };
};

const FRONT = 0;                                       // the site in front after the stack has turned (same layout as site 0)
const Hook: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, ready = useFonts();
  const { E, items, zs, m, rel, cx, cy, ls } = hookGeo(g, ready);
  // the stack ("de fleste"): three more old sites fly up from below and tuck in behind the first; while the line is
  // read the stack turns four times, each a soft flick that settles; it folds away as the window grows
  const rot = P(g, 1.8, 0.75, 0.04) + P(g, 3.22, 0.8, 0.04) + P(g, 3.72, 0.8, 0.04) + P(g, 4.22, 0.8, 0.04);
  const ret = P(g, PUSH0 + 0.05, 0.8, 0.03);
  const deck = [0, 1, 2, 3].map((k) => {
    const arrive = k === 0 ? 1 : P(g, 0.05 + 0.45 * (k - 1), 0.95, 0.03);
    const dm = ((((k - rot) % 4) + 4) % 4);
    let d = dm, y = 0, o = 1, z = 10 - dm;
    if (dm > 3) { const L = 4 - dm; if (L < 0.5) { d = 0; y = L * 2 * 300; o = 1 - sine(L * 2); z = 20; } else { d = 3; y = (1 - L) * 2 * 140; o = sine((L - 0.5) * 2); z = 0; } }
    const fold = d > 0.5 ? 1 - ret : 1;
    return { k, z, o: clamp01(o * (d > 0.02 ? fold : 1) * (k === 0 ? 1 : sine(arrive * 2.5))), tf: `translateY(${(-(23 + 62) * d * fold + y + (1 - arrive) * 2000).toFixed(2)}px) scale(${(1 - 0.06 * d * fold).toFixed(4)})` };
  }).sort((a, b) => a.z - b.z);
  const dropping = t >= 5.03;
  const er = (at: number) => { const p = P(g, at, 0.5, 0.05); return { opacity: clamp01(p * 1.6), transform: `translateY(${((1 - p) * 30).toFixed(2)}px)` }; };
  const pr = press(g, 6.6, 0.16);                                       // 'Opdater' is pressed once; nothing happens
  const eb = er(6.15);
  // the morph: the corners round into a circle (c) while the window shrinks; the page fades and the shape turns sage
  const c = sine(seg(m, 0.2, 0.9)), sh = 1 - sine(seg(m, 0, 0.18));   // the shadow fades first, then the corners round
  const morphing = c > 0.0005;
  return (
    <AbsoluteFill style={{ transform: `scale(${zs.toFixed(5)})` }}>
      {t < 6.2 && <div style={{ position: "absolute", left: 960, top: 540, transform: `translateX(${(-rel * E).toFixed(2)}px)` }}><Kinetic g={g} items={items} size={SIZE} /></div>}
      <div style={{ position: "absolute", left: cx, top: cy, width: 0, height: 0 }}>
        <div style={{ position: "absolute", left: -OLD.w / 2, top: -OLD.h / 2, width: OLD.w, height: OLD.h, transform: `scale(${ls.toFixed(5)})` }}>
          <div style={{ position: "absolute", inset: 0, clipPath: morphing ? `inset(0px ${(220 * c).toFixed(2)}px round ${(380 * c).toFixed(2)}px)` : undefined }}>
            {deck.map((d) => (d.o > 0.002 && !(dropping && d.k === FRONT)) && (
              <div key={d.k} style={{ position: "absolute", inset: 0, transform: d.tf, opacity: d.o }}><OldSite i={d.k} /></div>))}
            {dropping && (
              <div style={{ position: "absolute", inset: 0, opacity: 1 - sine(seg(m, 0.1, 0.8)) }}>
                <OldWindow w={OLD.w} h={OLD.h} title="Siden kan ikke findes" path="/kontakt.htm" shadow={sh}>
                  <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", fontFamily: TIMES, color: "#111111" }}>
                    <div style={{ position: "absolute", left: 84, top: 132, fontSize: 104, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap", lineHeight: 1, ...er(5.45) }}>Siden kan ikke findes</div>
                    <div style={{ position: "absolute", left: 84, top: 276, width: 1024, height: 3, background: "#8C8982", transformOrigin: "0 50%", opacity: er(5.7).opacity, transform: `scaleX(${clamp01(P(g, 5.7, 0.55, 0.03)).toFixed(4)})` }} />
                    <div style={{ position: "absolute", left: 84, top: 316, fontFamily: ARIAL, fontSize: 34, whiteSpace: "nowrap", color: "#2A2A2A", ...er(5.9) }}>HTTP 404 – Filen eller mappen blev ikke fundet.</div>
                    <div style={{ position: "absolute", left: 84, top: 424, width: 220, height: 70, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ARIAL, fontSize: 32, color: "#1E1E1E",
                      background: "#D6D2CA", border: "3px solid", borderColor: pr > 0.5 ? "#7C7A76 #FFFFFF #FFFFFF #7C7A76" : "#FFFFFF #7C7A76 #7C7A76 #FFFFFF", boxSizing: "border-box", opacity: eb.opacity, transform: `${eb.transform} scale(${1 - 0.05 * pr})` }}>Opdater</div>
                  </div>
                </OldWindow>
              </div>)}
            {/* the old site's title bar fades to the error page's; its rows drop away top to bottom (a small lift, then down) */}
            {dropping && t < 5.6 && <div style={{ position: "absolute", inset: 0, clipPath: "inset(0px 0px 680px 0px)", opacity: 1 - sine(seg(t, 5.05, 5.55)) }}><OldSite i={FRONT} /></div>}
            {dropping && t < 7.0 && (
              <div style={{ position: "absolute", left: 4, top: 80, width: OLD.w - 8, height: OLD.h - 84, overflow: "hidden" }}>
                {BANDS.map(([a, b], i) => { const p = 1 - PO(g, 5.05 + 0.2 * i, 0.75, 0.05), o = 1 - sine(p * 1.6); return o > 0.002 && (
                  <div key={i} style={{ position: "absolute", left: -4, top: -80, width: OLD.w, height: OLD.h, clipPath: `inset(${a}px 0px ${OLD.h - b}px 0px)`, transform: `translateY(${(p * 160).toFixed(2)}px)`, opacity: o }}><OldSite i={FRONT} /></div>); })}
              </div>)}
            {/* the shape turns sage as it becomes the dot */}
            {m > 0.0005 && <div style={{ position: "absolute", inset: 0, background: C.sage, opacity: sine(seg(m, 0, 0.8)) }} />}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// the hand presses 'Opdater' once (it comes up from below, well before, and leaves downward). Its targets follow the
// growing window until it has clicked, then stay where they were, so the exit is one clean glide.
const HOOK_FREEZE = 6.95;
const hookKeys = (g: number, ready: boolean): HandKey[] => {
  const k = hookGeo(Math.min(g, HOOK_FREEZE * 30), ready);
  const ox = k.cx + (194 - OLD.w / 2) * k.ls, oy = k.cy + (80 + 424 + 35 - OLD.h / 2) * k.ls;   // the centre of 'Opdater'
  return [{ at: 4.6, x: ox + 40, y: 1320 }, { at: 6.6, x: ox, y: oy, click: true, dur: 1.15, early: 0.5 }, { at: 8.3, x: ox + 30, y: 1380, early: 0, dur: 1.35 }];
};
const HookHand: React.FC<{ g: number }> = ({ g }) => {
  const ready = useFonts(), zs = 1 + (0.012 * g) / 30;
  return <AbsoluteFill style={{ transform: `scale(${zs.toFixed(5)})` }}><Hand {...handAt(g, hookKeys(g, ready), { size: 170 })} /></AbsoluteFill>;
};
// the ripple: when the window has become the dot, one thin soft sage ring leaves the forming logo and fades on the cream
const RIP = M_DOT - 0.03, RIP_D = 1.15;
const Ripple: React.FC<{ g: number }> = ({ g }) => {
  const u = seg(g / 30, RIP, RIP + RIP_D);
  if (u <= 0 || u >= 1) return null;
  const d = dot0At(g), e = 1 - Math.pow(1 - u, 3), r = 30 + 330 * e, o = Math.pow(1 - u, 1.5) * clamp01(u / 0.06);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><radialGradient id="ripf"><stop offset="0.55" stopColor={C.sageTint} stopOpacity={0} /><stop offset="1" stopColor={C.sageTint} stopOpacity={0.55} /></radialGradient></defs>
      <circle cx={d.cx} cy={d.cy} r={r} fill="url(#ripf)" opacity={o * 0.8} />
      <circle cx={d.cx} cy={d.cy} r={r} fill="none" stroke={C.sage} strokeWidth={3 - 1.5 * u} opacity={0.55 * o} />
    </svg>
  );
};

/* ================= Logo: 7.5 – 9.2 ================= */
const Lockup: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, d0 = dot0At(g);
  const fan = LOGO.map((_, i) => P(g, 7.55 + 0.04 * i, 0.5, 0.08));
  const dots = fanDots(LOGO_S, d0.cx, d0.cy, lockSpin(g), d0.ro, fan).map((d, i) => (i === 0 ? { ...d, r: t < M1 ? 0 : d.r * dotPop(g) } : d));
  const wp = seg(t, 7.6, 8.05), wq = P(g, 7.6, 0.6, 0.05);
  const lift = 1 - PO(g, 8.45, 0.6, 0.012), zs = 1 + 0.04 * seg(t, 7.6, 9.7);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(-300 * lift).toFixed(2)}px) scale(${zs.toFixed(5)})`, opacity: 1 - sine(clamp01(lift) * 1.8) }}>
      <Dots dots={dots} />
      {wp > 0 && <div style={{ position: "absolute", left: LOCK.wmX, top: 540 - LOCK.wmH / 2, transform: `translateX(${((1 - wq) * -90).toFixed(2)}px)` }}><Wordmark h={LOCK.wmH} p={wp} /></div>}
    </AbsoluteFill>
  );
};

/* ================= Wizard: 8.1 – 15.4 ================= */
const S0 = 1500 / WIZ_WIN.w, S1 = 2.2, ZR = 2.3, SHIFT = 86, SPLIT = 424, SCROLL = 270, FY = 420, PUSH_W: [number, number] = [9.15, 10.45];
// the hand's click times (every UI response fires at its click time) and the typing runs (start s, cps)
export const CLK = { name: 9.4, branche: 10.75, option: 11.95, go: 14.3 };
const T_NAME = "Holm Fysioterapi", T_WHAT = "Genoptræning og massage", T_MAIL = "kontakt@holmfysio.dk", T_TEL = "+45 31 42 53 64";
const TY = { name: [9.45, 22], what: [12.22, 30], mail: [13.06, 32], tel: [13.76, 38] } as const;
const doneAt = (k: keyof typeof TY, text: string) => TY[k][0] + text.length / TY[k][1] + 0.02;
// a field is completed (underline sweep + one progress segment): name, Branche, what, e-mail, phone
const DONE = { name: doneAt("name", T_NAME), branche: CLK.option + 0.03, what: doneAt("what", T_WHAT), mail: doneAt("mail", T_MAIL), tel: doneAt("tel", T_TEL) };
const TAB = { mail: DONE.what + 0.02, tel: DONE.mail + 0.02 };         // Tab moves the focus on
const wiz = (t: number) => {
  const g = t * 30;
  const e = sine(seg(t, PUSH_W[0], PUSH_W[1]));                         // the scene's one push (camera), to the form column
  const s = S0 * Math.pow(S1 / S0, e) * (1 + 0.04 * seg(t, PUSH_W[1], 14.6));
  const fy = mix(WIZ_WIN.h / 2, FY, e);
  const arr = P(g, 8.05, 1.45, 0.03), ex = 1 - PO(g, 14.36, 1.04, 0);   // the window rises in and sinks away (objects)
  const sIn = s * mix(0.94, 1, arr), sT = sIn * mix(1, 0.96, ex);
  const yIn = (1 - arr) * 900 + (WIZ_WIN.h / 2 - fy) * sIn;
  const y = (1 - arr) * 900 + ex * 300 + (WIZ_WIN.h / 2 - fy) * sT;
  const scroll = SCROLL * P(g, 12.0, 2.2, 0.02), shift = SHIFT * P(g, CLK.option + 0.04, 0.45, 0.06);
  // a page point (final layout coordinates) on screen
  const at = (px: number, py: number) => ({ x: 960 + (px - 800) * sT, y: 540 + y + (46 + py - scroll - WIZ_WIN.h / 2) * sT });
  // the progress row docks at screen y 122 once the push brings it there (sticky; measured without the exit, so it
  // leaves with the window)
  const stick = (122 - 540 - yIn) / sIn - 46 + scroll + WIZ_WIN.h / 2, kk = 16;
  const rowY = (90 + stick + Math.sqrt((90 - stick) ** 2 + kk * kk)) / 2;   // a soft max: no kink when it docks
  return { s, sT, y, scroll, shift, at, rowY, opacity: sine(seg(t, 8.05, 8.35)) * (1 - sine(seg(t, 14.45, 15.25))) };
};
const handKeys = (t: number): HandKey[] => {
  const v = wiz(t), n = v.at(920, 287), br = v.at(920, 373), op = v.at(900, 424), go = v.at(993, 810);   // the true marks
  return [
    { at: 8.2, x: n.x + 60, y: 1340 },
    { at: CLK.name, ...n, click: true, dur: 1.6, early: 0.5 },
    { at: CLK.branche, ...br, click: true, dur: 0.7, early: 0.33 },
    { at: CLK.option, ...op, click: true, dur: 0.6, early: 0.28 },
    { at: CLK.go, ...go, click: true, dur: 1.4, early: 0.5 },
    { at: 15.65, x: go.x + 40, y: 1400, early: 0, dur: 1.0 },
  ];
};
const BTN = { x: WIZ_R.button.x + WIZ_R.button.w / 2, y: WIZ_R.button.y + WIZ_R.button.h / 2, w: WIZ_R.button.w, h: WIZ_R.button.h };
const OPTIONS = ["Fysioterapi", "Frisør", "Restaurant"];
// progress segments 2–6 fill as the fields are completed (segment 1 is step 1, already full)
const SEG_T = [0, DONE.name, DONE.branche, DONE.what, DONE.mail, DONE.tel];
// the underline sweeps: field rect (layout px, after the room is made) and the time it was completed
const ULINES = [
  { x: 560, y: 308, w: 480, at: DONE.name }, { x: 560, y: 394, w: 480, at: DONE.branche }, { x: 560, y: 500, w: 480, at: DONE.what },
  { x: 560, y: 544 + 42, w: 236, at: DONE.mail }, { x: 804, y: 544 + 42, w: 236, at: DONE.tel },
];
const Underline: React.FC<{ g: number; x: number; y: number; w: number; at: number }> = ({ g, x, y, w, at }) => {
  const t = g / 30, s = clamp01(P(g, at, 0.5, 0.02)), o = 1 - sine(seg(t, at + 0.5, at + 1.0));
  if (t < at || o <= 0.002) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y + 3, width: w, height: 2, borderRadius: 1, overflow: "hidden", opacity: o }}>
      <div style={{ width: w, height: 2, transformOrigin: "0 50%", transform: `scaleX(${s.toFixed(4)})`, background: `linear-gradient(90deg, ${C.sageLight}, ${C.sage} 70%, ${C.sageDark})` }} />
    </div>
  );
};
// the docked progress row: the kit's row (same text, same segments) on a cream band, with the sage wipe
const ProgressRow: React.FC<{ g: number; y: number }> = ({ g, y }) => {
  const t = g / 30, docked = clamp01((y - 90) / 24);
  return (
    <>
      {/* the band hides the page that scrolls under the docked row */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 1200, background: C.bg, clipPath: `inset(80px 0px ${(1200 - (y + 34)).toFixed(3)}px 0px)` }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 60, transform: `translateY(${y.toFixed(3)}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 34, width: 1600, height: 14, background: `linear-gradient(${C.bg}, rgba(250,250,248,0))` }} />
        <div style={{ position: "absolute", left: 540, top: 36, width: 520, height: 1, background: C.line, opacity: 0.9 * docked }} />
        <div style={{ position: "absolute", left: 560, top: 0, width: 480, fontFamily: SANS, fontSize: 12.5, color: C.muted, display: "flex" }}>
          <span>Trin <b style={{ color: C.ink, fontWeight: 600 }}>1</b> af 6, <b style={{ color: C.ink, fontWeight: 600 }}>Virksomhed</b></span><div style={{ flex: 1 }} /><span>Omkring 4 minutter tilbage</span>
        </div>
        {SEG_T.map((at, i) => {
          const p = i === 0 ? 1 : clamp01(P(g, at, 0.5, 0.06)), u = i === 0 ? 1 : seg(t, at, at + 0.6), glow = i === 0 ? 0 : Math.sin(Math.PI * u);
          return (
            <div key={i} style={{ position: "absolute", left: 560 + i * 80.8, top: 26, width: 76.8, height: 3 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 2, background: "#E4E0D9", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", transformOrigin: "0 50%", transform: `scaleX(${p.toFixed(4)})`, background: i === 0 ? C.sageDark : `linear-gradient(90deg, ${C.sageDark}, ${C.sage})` }} />
              </div>
              {glow > 0.003 && <div style={{ position: "absolute", left: 76.8 * p - 14, top: -5, width: 28, height: 13, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(168,196,187,0.9), rgba(168,196,187,0))`, opacity: glow }} />}
            </div>);
        })}
      </div>
    </>
  );
};

const WizardScene: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, v = wiz(t);
  const name = typed(g, TY.name[0], T_NAME, TY.name[1]), what = typed(g, TY.what[0], T_WHAT, TY.what[1]), mail = typed(g, TY.mail[0], T_MAIL, TY.mail[1]), tel = typed(g, TY.tel[0], T_TEL, TY.tel[1]);
  const focus = t < CLK.name ? null : t < CLK.branche ? "name" : t < CLK.option + 0.02 ? "branche" : t < TAB.mail ? null : t < TAB.tel ? "email" : t < CLK.go ? "phone" : null;
  const whatOn = t >= CLK.option + 0.02 && t < TAB.mail;
  const typing = (name.length > 0 && name.length < T_NAME.length) || (mail.length > 0 && mail.length < T_MAIL.length) || (tel.length > 0 && tel.length < T_TEL.length);
  const props = { g, name, branche: t >= CLK.option + 0.02 ? "Fysioterapi" : "", email: mail, phone: tel, focus, caret: true, caretSolid: typing, hideButton: true } as const;
  const menu = P(g, CLK.branche + 0.02, 0.4, 0.06) - (1 - PO(g, CLK.option + 0.03, 0.28, 0.04)), room = v.shift / SHIFT;
  const hover = sine(seg(t, 11.55, 11.72));
  const blink = (what.length > 0 && what.length < T_WHAT.length) || Math.floor(g / 15) % 2 === 0;
  return (
    <AbsoluteFill>
      <Stage3D cam={cam()}>
        <Plane x={0} y={v.y} z={0} w={WIZ_WIN.w * ZR} h={WIZ_WIN.h * ZR} scale={v.sT / ZR} opacity={v.opacity} dof={false}>
          <div style={{ zoom: ZR, width: WIZ_WIN.w, height: WIZ_WIN.h }}>
            <Browser w={WIZ_WIN.w} h={WIZ_WIN.h} url="creoble.dk/builder">
              <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 1200, background: C.bg, transform: `translateY(${(-v.scroll).toFixed(3)}px)` }}>
                <div style={{ position: "absolute", left: 0, top: 0, clipPath: `inset(0px 0px ${800 - SPLIT}px 0px)` }}><Wizard {...props} /></div>
                <div style={{ position: "absolute", left: 0, top: 0, clipPath: `inset(${SPLIT}px 0px 0px 0px)`, transform: `translateY(${v.shift.toFixed(3)}px)` }}><Wizard {...props} /></div>
                {/* the field that eases in under Branche */}
                {room > 0.001 && (
                  <div style={{ position: "absolute", left: 560, top: 433, width: 480, fontFamily: SANS, color: C.ink, opacity: seg(room, 0.25, 0.8), transform: `translateY(${((1 - room) * -26).toFixed(2)}px) scale(${mix(0.96, 1, room).toFixed(4)})`, transformOrigin: "50% 0%" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, height: 25 }}>Hvad laver du?<span style={{ color: "#B4574A" }}> *</span></div>
                    <div style={{ width: 480, height: 42, boxSizing: "border-box", borderRadius: 7, background: C.white, border: `1px solid ${whatOn ? "#8FAFA6" : "#E1DDD6"}`, boxShadow: whatOn ? "0 0 0 3px rgba(135,168,158,0.22)" : "0 1px 1px rgba(26,22,20,0.03)",
                      display: "flex", alignItems: "center", padding: "0 13px", fontSize: 14, color: what ? C.ink : "#A9A39B", whiteSpace: "nowrap" }}>
                      <span>{what || "fx behandling af skader"}</span>
                      {whatOn && <span style={{ display: "inline-block", width: 1.5, height: 18, marginLeft: what ? 1 : -2, background: C.ink, opacity: blink ? 1 : 0 }} />}
                    </div>
                  </div>)}
                {ULINES.map((u, i) => <Underline key={i} g={g} {...u} />)}
                {/* the select's menu grows out of the Branche field */}
                {menu > 0.001 && (
                  <div style={{ position: "absolute", left: 560, top: 398, width: 480, height: 132, boxSizing: "border-box", borderRadius: 8, background: C.white, border: "1px solid #E1DDD6", boxShadow: SHADOW, padding: 6,
                    fontFamily: SANS, fontSize: 14, color: C.ink, opacity: clamp01(menu * 1.25), transform: `translateY(${((1 - menu) * -10).toFixed(2)}px) scale(${mix(0.94, 1, menu).toFixed(4)})`, transformOrigin: "50% 0%" }}>
                    {OPTIONS.map((o, i) => (
                      <div key={o} style={{ height: 40, borderRadius: 5, padding: "0 10px", display: "flex", alignItems: "center", background: i === 0 ? `rgba(231,239,236,${hover})` : "transparent" }}>{o}</div>))}
                  </div>)}
                <ProgressRow g={g} y={v.rowY} />
              </div>
            </Browser>
          </div>
        </Plane>
      </Stage3D>
    </AbsoluteFill>
  );
};
// the hand cursor, drawn over everything: one key list for the whole wizard beat, its targets re-projected every frame
// so it stays on them through the push and the page scroll
const WizHand: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, v = wiz(t);
  return <Hand {...handAt(g, handKeys(t), { size: 150 + 30 * seg(v.s, S0, S1) })} />;
};

/* ================= the smear: button → trail → progress bar → the window's top edge (14.3 – 20.15) ================= */
// After the reference (10–12 s): the pressed button turns sage and smears out to the right, leaving a soft trail that is
// wide and faint where it came from and tapers into a thick bar. The sweep is ONE motion, left to right: the head
// leaves through the right edge and comes in again from the left at the centre line (soft start, long landing),
// where it settles as the progress bar; the number counts with the head and lands on 100. Then the bar rises,
// carrying the number, and thins into the site window's top bar, and the window unfolds down from it.
const BAR_H = 86, BAR_L = 410, BAR_R = 1510, SW0 = 14.46, SW1 = 15.8, D1 = 700, D2 = BAR_R + 260, LAG = 0.42;
const ramp = (x: number) => (x <= 0 ? 0 : x < 0.6 ? (x * x) / 1.2 : x - 0.3);
const sweepE = (t: number) => sine(1 - Math.pow(1 - seg(t, SW0, SW1), 1.8));
const h2At = (t: number) => -260 + Math.max(0, (D1 + D2) * sweepE(t) - D1);
const barM = (g: number) => P(g, 15.85, 0.85, 0.025);                    // the bar → the window's top bar (a morph that settles)
const barGeo = (g: number) => {                                           // the bar's rect (screen px) during that morph
  const m2 = barM(g), cH = camH1(g);
  const tl = project(cH, { x: H1_SITE.x - SITE_WIN.w / 2, y: H1_SITE.y - SITE_WIN.h / 2, z: H1_SITE.z }), pill = project(cH, { x: H1_SITE.x, y: H1_SITE.y + 23 - SITE_WIN.h / 2, z: H1_SITE.z });
  return { m2, tl, pill, rx: mix(BAR_L, tl.x, m2), rw: mix(BAR_R - BAR_L, SITE_WIN.w * tl.s, m2), rh: mix(BAR_H, 46 * tl.s, m2), ry: mix(540 - BAR_H / 2, tl.y, m2) };
};
// the smear's shape between tail xL and head xH on the line yc: fh = the tail's height (≥ BAR_H), a = strength;
// join = the solid body from the button's right end to the head (the button stretching), so no gap opens between them
const Smear: React.FC<{ id: string; xL: number; xH: number; yc: number; fh: number; a: number; solid: number; join?: number; joinL?: number }> = ({ id, xL, xH, yc, fh, a, solid, join = 0, joinL = 0 }) => {
  const r = BAR_H / 2, len = Math.max(1, xH - xL), xT = xL + Math.min(len * 0.62, 900), d = (xT - xL) * 0.5;
  if (len < 4 || (a <= 0.003 && join <= 0.003)) return null;
  const path = `M ${xL} ${yc - fh / 2} C ${xL + d} ${yc - fh / 2} ${xT - d} ${yc - r} ${xT} ${yc - r} L ${xH - r} ${yc - r} A ${r} ${r} 0 0 1 ${xH - r} ${yc + r} L ${xT} ${yc + r} C ${xT - d} ${yc + r} ${xL + d} ${yc + fh / 2} ${xL} ${yc + fh / 2} Z`;
  const headL = Math.max(xL, xH - 360);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}a`} gradientUnits="userSpaceOnUse" x1={xL} y1={0} x2={xH} y2={0}>
          <stop offset={0} stopColor={C.sageLight} stopOpacity={0.0 + 0.9 * solid} /><stop offset={0.4} stopColor={C.sageLight} stopOpacity={0.5 + 0.5 * solid} />
          <stop offset={0.8} stopColor={C.sage} stopOpacity={0.95} /><stop offset={1} stopColor={C.sage} stopOpacity={1} />
        </linearGradient>
        <linearGradient id={`${id}b`} gradientUnits="userSpaceOnUse" x1={headL} y1={0} x2={xH} y2={0}>
          <stop offset={0} stopColor={C.sage} stopOpacity={0} /><stop offset={0.7} stopColor={C.sage} stopOpacity={1} /><stop offset={1} stopColor={C.sage} stopOpacity={1} />
        </linearGradient>
        <filter id={`${id}f`} x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation={9} /></filter>
      </defs>
      <g opacity={a}>
        <path d={path} fill={`url(#${id}a)`} filter={`url(#${id}f)`} opacity={1 - solid} />
        {solid > 0 && <rect x={xL} y={yc - r} width={len} height={BAR_H} rx={r} fill={`url(#${id}a)`} opacity={solid} />}
        <rect x={headL} y={yc - r} width={xH - headL} height={BAR_H} rx={r} fill={`url(#${id}b)`} opacity={1 - solid} />
      </g>
      {join > 0.003 && xH - joinL > 2 * r && <rect x={joinL} y={yc - r} width={xH - joinL} height={BAR_H} rx={r} fill={C.sage} opacity={join} />}
    </svg>
  );
};
const Loader: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, live = wiz(t);
  const b = live.at(BTN.x, BTN.y + live.shift), bs = live.sT / S1, bw = BTN.w * S1, bh = BTN.h * S1;
  const col = sine(seg(t, CLK.go + 0.03, CLK.go + 0.2));                               // ink → sage, before the smear leaves
  const S = (D1 + D2) * sweepE(t), Sl = (D1 + D2) * sweepE(t - LAG);
  const v = clamp01(((sweepE(t + 0.01) - sweepE(t - 0.01)) / 0.02) / 1.9);   // the sweep's speed, 0..1
  // stage 1: out of the button, off the right edge (the body stays solid while the head is near the button)
  const x0 = b.x + (bw * bs) / 2, h1x = x0 + Math.min(S, D1 + 400), t1x = b.x - (bw * bs) / 2;   // the trail stays anchored where the button was
  const join = (1 - sine(clamp01((h1x - x0) / 620))) * (t >= SW0 ? 1 : 0);
  // stage 2: in from the left, landing as the bar
  const h2x = h2At(t), t2x = Math.min(BAR_L, -260 + Math.max(0, Sl - D1));
  const landed = sine(seg(t, SW1 - 0.45, SW1 + 0.05));
  const lead = 0.25 * seg(t, 15.0, 15.4);                                 // the count runs a little ahead of the head's long landing, so 100 holds
  const pct = Math.round(100 * clamp01((h2At(t + lead) - BAR_L) / (BAR_R - BAR_L)));
  // the bar becomes the window's top bar
  const { m2, pill, rx, rw, rh, ry, tl } = barGeo(g);
  const barOp = 1 - sine(seg(t, 16.5, 16.8));
  // the turning logo: at the bar's head, then on the address pill
  const lp = P(g, 14.88, 0.4, 0.08), out = 1 - PO(g, 19.75, 0.35, 0.08);
  const lx = mix(Math.min(h2x, BAR_R) - BAR_H / 2, pill.x, m2), ly = mix(540, pill.y, m2), lsz = mix(64, 30 * pill.s, m2);
  const dots = fanDots(lsz, lx, ly, 240 * ramp(t - 14.88), 1, [1, 1, 1, 1, 1, 1], lp * (1 - out));
  const nIn = P(g, 14.88, 0.4, 0.06), nOp = clamp01(nIn * 1.5) * (1 - sine(seg(t, 15.95, 16.25)));
  const ride = ry - (540 - BAR_H / 2);                                     // the number rides up on the bar
  return (
    <AbsoluteFill>
      {t < 15.5 && (
        <div style={{ position: "absolute", left: b.x - bw / 2, top: b.y - bh / 2, width: bw, height: bh, borderRadius: mix(7 * S1, bh / 2, col), opacity: live.opacity * (1 - sine(seg(t, 14.58, 15.13))),
          transform: `scale(${(bs * (1 - 0.045 * press(g, CLK.go)) * (1 + wobble(g, CLK.go + 0.22, 0.02, 0.5))).toFixed(5)})`,
          background: `color-mix(in srgb, ${C.sage} ${(col * 100).toFixed(1)}%, ${C.ink})`, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 14 * S1, fontWeight: 500 }}>
          <span style={{ opacity: 1 - col }}>Fortsæt</span>
        </div>)}
      {t >= SW0 && t < 15.7 && <Smear id="s1" xL={t1x} xH={h1x} yc={b.y} fh={BAR_H + 300 * v} a={sine(seg(t, SW0, SW0 + 0.2)) * (1 - sine(seg(t, 14.83, 15.63)))} solid={0} join={join * live.opacity * sine(seg(t, SW0, SW0 + 0.1))} joinL={x0 - bh * bs} />}
      {t >= SW0 && m2 <= 0 && <Smear id="s2" xL={t2x} xH={Math.max(h2x, t2x + 1)} yc={540} fh={BAR_H + 420 * v} a={1} solid={landed} />}
      {m2 > 0 && barOp > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: barOp }}>
          <div style={{ position: "absolute", left: rx, top: ry, width: rw, height: rh, borderRadius: mix(BAR_H / 2, 16 * tl.s, m2), background: `linear-gradient(90deg, color-mix(in srgb, #FBFAF7 ${(clamp01(m2) * 100).toFixed(1)}%, ${C.sageLight}), color-mix(in srgb, #FBFAF7 ${(clamp01(m2) * 100).toFixed(1)}%, ${C.sage}))` }} />
        </div>)}
      {nOp > 0 && (
        <div style={{ position: "absolute", left: BAR_R - 400, top: 540 - BAR_H / 2 - 150, width: 400, textAlign: "right", fontFamily: SERIF, fontSize: 112, lineHeight: "120px", letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums",
          opacity: nOp, transform: `translateY(${((1 - nIn) * 30 + ride).toFixed(2)}px)` }}>
          {pct}<span style={{ fontSize: 56, color: C.soft }}> /100</span>
        </div>)}
      {lp > 0 && <Dots dots={dots} color={`color-mix(in srgb, ${C.sage} ${(clamp01(m2) * 100).toFixed(1)}%, #FFFFFF)`} />}
    </AbsoluteFill>
  );
};

/* ================= Site: 16.2 – h1 ================= */
// chips: the wizard's answers, on the window's bottom edge (plane px), each flying to where the site uses it
const CHIPS = [
  { label: "Virksomhedsnavn", text: T_NAME, w: 430, x: 276, to: { x: 201, y: 103 }, hi: { x: 104, y: 82, w: 300, h: 42 }, hi2: null as null | { x: number; y: number; w: number; h: number } },
  { label: "Branche", text: "Fysioterapi", w: 430, x: 730, to: { x: 126, y: 482 }, hi: { x: 62, y: 464, w: 128, h: 36 }, hi2: null },
  { label: "Hvad laver du?", text: T_WHAT, w: 430, x: 1184, to: { x: 955, y: 858 }, hi: { x: 520, y: 806, w: 420, h: 100 }, hi2: { x: 970, y: 806, w: 420, h: 100 } },
];
const FLY = [18.15, 18.6, 19.05], FLY_D = 0.65, LAND = FLY.map((a) => a + 0.8 * FLY_D);   // pop passes 1 at 0.8 × dur: the landing
const chipAt = (i: number, g: number) => {
  const c = CHIPS[i], p = clamp01(P(g, FLY[i], FLY_D, 0.03)), a = P(g, 17.15 + 0.25 * i, 0.6, 0.05);
  return { p, a, x: mix(c.x, c.to.x, p), y: mix(SITE_WIN.h - 10, c.to.y, p) + (1 - a) * 260, sc: mix(1, 0.4, p), o: sine(a * 1.6) * (1 - sine(seg(p, 0.55, 1))) };
};
// the comet: a short soft sage streak behind a flying card (the smear's family, smaller): wide and faint where it
// came from, tapering into the card
const Comet: React.FC<{ i: number; g: number }> = ({ i, g }) => {
  const h = chipAt(i, g), tl = chipAt(i, g - 0.16 * 30);
  const dx = h.x - tl.x, dy = h.y - tl.y, L = Math.hypot(dx, dy);
  if (L < 6 || h.p <= 0 || h.p >= 1) return null;
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux, wh = 34 * h.sc, wt = 64 * h.sc;
  const pts = [[h.x + nx * wh, h.y + ny * wh], [h.x - nx * wh, h.y - ny * wh], [tl.x - nx * wt, tl.y - ny * wt], [tl.x + nx * wt, tl.y + ny * wt]].map((q) => q.map((n) => n.toFixed(1)).join(",")).join(" ");
  const o = 0.75 * h.o * clamp01(L / 60);
  return (
    <svg width={SITE_WIN.w} height={SITE_WIN.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id={`cm${i}`} gradientUnits="userSpaceOnUse" x1={tl.x} y1={tl.y} x2={h.x} y2={h.y}>
          <stop offset={0} stopColor={C.sageLight} stopOpacity={0} /><stop offset={0.6} stopColor={C.sageLight} stopOpacity={0.55} /><stop offset={1} stopColor={C.sage} stopOpacity={0.95} />
        </linearGradient>
        <filter id={`cmf${i}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={9} /></filter>
      </defs>
      <polygon points={pts} fill={`url(#cm${i})`} filter={`url(#cmf${i})`} opacity={o} />
    </svg>
  );
};
// the landing: the spot the answer fills lights up (a sage highlight that pops in and fades) inside a soft sage bloom
const Bloom: React.FC<{ g: number; at: number; r: { x: number; y: number; w: number; h: number } }> = ({ g, at, r }) => {
  const t = g / 30, k = P(g, at - 0.08, 0.3, 0.06), fade = 1 - sine(seg(t, at + 0.15, at + 0.5)), u = seg(t, at - 0.05, at + 0.5);
  if (k <= 0.001 || fade <= 0.002) return null;
  const R = Math.max(r.w, r.h) * 0.62, cx = r.x + r.w / 2, cy = r.y + r.h / 2, bs = 0.55 + 0.9 * (1 - Math.pow(1 - u, 2.5));
  return (
    <>
      <div style={{ position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(168,196,187,0.55), rgba(168,196,187,0.18) 60%, rgba(168,196,187,0))",
        transform: `scale(${bs.toFixed(4)})`, opacity: (1 - u) * clamp01(k * 2) }} />
      <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 10, background: "rgba(135,168,158,0.26)", boxShadow: "0 0 0 2px rgba(135,168,158,0.5)",
        transform: `scale(${mix(0.94, 1, k).toFixed(4)})`, opacity: clamp01(k) * fade }} />
    </>
  );
};
const SiteScene: React.FC<{ g: number; dy: number }> = ({ g, dy }) => {
  // the unfold is a reveal that must stop exactly at the window's size, so it lands softly without overshoot; the
  // window's settle comes from its top bar, which rides the bar's bounce (dy)
  const t = g / 30, q = soft(t, 16.34, 0.95), winOp = sine(seg(t, 16.26, 16.46));
  const done = t >= 20.18;
  const b = {
    frame: [P(g, 16.28, 0.6, 0.03), P(g, 16.43, 0.6, 0.03), P(g, 16.58, 0.6, 0.03), P(g, 16.73, 0.6, 0.03)],
    h1: P(g, 16.3, 0.65, 0.04), h2: P(g, 16.47, 0.65, 0.04), para: P(g, 16.66, 0.65, 0.04),
    hero: P(g, 16.8, 0.75, 0.03), cards: [P(g, 17.1, 0.6, 0.04), P(g, 17.3, 0.6, 0.04), P(g, 17.5, 0.6, 0.04)],
    nav: [0, 1, 2, 3, 4, 5].map((i) => P(g, 17.4 + 0.09 * i, 0.45, 0.06)), btn: P(g, 18.0, 0.5, 0.05),
  };
  const patch = 1 - seg(t, 19.85, 20.15);
  return (
    <Stage3D cam={camH1(g)}>
      <Plane {...H1_SITE} y={H1_SITE.y + (done ? 0 : dy)} opacity={winOp} w={SITE_WIN.w} h={SITE_WIN.h}>
        {done ? <SiteWindow /> : (
          <>
            {/* the window unfolds down from its top bar */}
            <div style={{ position: "absolute", left: 0, top: 0, width: SITE_WIN.w, height: mix(46, SITE_WIN.h, q), borderRadius: 16, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}` }} />
            <div style={{ position: "absolute", left: 0, top: 0, clipPath: `inset(0px 0px ${mix(SITE_WIN.h - 46, 0, q).toFixed(2)}px 0px round 16px)` }}><Browser w={SITE_WIN.w} h={SITE_WIN.h} url="Forhåndsvisning"><SiteBuild b={b} /></Browser></div>
            {patch > 0 && <div style={{ position: "absolute", left: SITE_WIN.w / 2 - 140, top: 12, width: 280, height: 22, background: "#F1EEE8", opacity: patch }} />}
            {CHIPS.map((c, i) => [c.hi, c.hi2].map((h, j) => h && <Bloom key={`${i}-${j}`} g={g} at={LAND[i]} r={h} />))}
            {CHIPS.map((_, i) => <Comet key={`c${i}`} i={i} g={g} />)}
            {CHIPS.map((c, i) => {
              const s = chipAt(i, g);
              if (s.a <= 0.001 || s.p >= 1) return null;
              return (
                <div key={c.text} style={{ position: "absolute", left: s.x - c.w / 2, top: s.y - 56, width: c.w, height: 112, boxSizing: "border-box", borderRadius: 18, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, padding: "16px 26px",
                  fontFamily: SANS, color: C.ink, whiteSpace: "nowrap", opacity: s.o, transform: `scale(${s.sc.toFixed(4)})` }}>
                  <div style={{ fontSize: 21, fontWeight: 500, color: C.muted }}>{c.label}</div>
                  <div style={{ marginTop: 4, fontSize: 35, fontWeight: 500, letterSpacing: "-0.01em" }}>{c.text}</div>
                </div>);
            })}
          </>)}
      </Plane>
    </Stage3D>
  );
};

/* ================= the scene ================= */
export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  if (g >= f("h1") - HANDOFF_HALF) return <Handoff1 g={g} />;
  const bar = t >= 15.8 ? barGeo(g) : null, dy = bar ? (bar.ry - bar.tl.y) / bar.tl.s : 0;   // the window's top bar rides with the settling bar
  return (
    <AbsoluteFill>
      {t >= RIP && t < RIP + RIP_D && <Ripple g={g} />}
      {t < M1 && <Hook g={g} />}
      {t > 4.9 && t < 8.35 && <HookHand g={g} />}
      {t >= 8.05 && t < 15.45 && <WizardScene g={g} />}
      {t >= 7.5 && t < 9.4 && <Lockup g={g} />}
      {t >= 16.2 && <SiteScene g={g} dy={dy} />}
      {t >= 8.05 && t < 20.12 && <Loader g={g} />}
      {t >= 8.3 && t < 15.7 && <WizHand g={g} />}
    </AbsoluteFill>
  );
};
// for checking the cursor plan outside the browser (tools: handPlan per frame)
export const HAND_KEYS_A = { hook: (g: number) => hookKeys(g, true), wizard: (g: number) => handKeys(g / 30) };
