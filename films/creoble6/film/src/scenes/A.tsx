// Scene A (0 → h1, 20.5 s), contract 2: object-led Apple motion. Four fixed frames, each with a slow steady push:
//   Hook   0 – 6.95   the line with the old website inside it; the window grows (the hook's one push) and pushes the
//                     words out; its content drops away to "Siden kan ikke findes"; the window shrinks into a dot.
//   Logo   6.75 – 8.8 the dot opens into the six dots, the wordmark slides out beside it; the lockup leaves upward.
//   Wizard 8.05 – 14.7 the window rises; one push to the form column; the cursor leads typing, the select, the new
//                     field, e-mail, phone; the page scrolls to "Fortsæt"; the pressed button contracts into a dot.
//   Site   13.9 – h1  the dot becomes the turning logo; the empty window rises under it; the logo settles on the
//                     address bar; text, photos, layout arrive; three answer chips fly into the site. Ends on Handoff1.
// Times below are film seconds (t = g / 30).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, SANS, SERIF, SHADOW, SHADOW_BIG, INOUT, clamp01, mix } from "../lib";
import { f, aspring, press, typed, Browser, Wordmark } from "../shared";
import { Kinetic, KItem, measure, useFonts } from "../type";
import { Dots, LOGO, RING, ANG } from "../dots";
import { Stage3D, Plane, cam, project } from "../cam";
import { Wizard, WIZ_WIN, WIZ_R, Handoff1, camH1, H1_SITE, SITE_WIN, SiteWindow, HANDOFF_HALF } from "../ui";
import { OldSite, OldWindow, OLD } from "./A_old";
import { SiteBuild } from "./A_site";
import { Hand, handAt, HandKey } from "../hand";

export const BLUR: [number, number][] = [];

export const EVENTS: { t: number; kind: "click" | "type" | "check" | "pop" | "open" | "send" | "logo"; len?: number; note: string }[] = [
  { t: 0.1, kind: "pop", len: 1.6, note: "three more old sites fly up from below and tuck in behind the first, one after another (soft, 0.1 / 0.55 / 1.0)" },
  { t: 1.85, kind: "pop", note: "the stack turns once: the front site drops away, the next comes forward (soft card flick)" },
  { t: 3.35, kind: "pop", len: 1.5, note: "the stack turns three more times while the line is read (three soft card flicks)" },
  { t: 4.55, kind: "open", len: 1.8, note: "the hook's push: the old window grows and pushes the line out to the right (soft swell)" },
  { t: 5.05, kind: "pop", len: 1.4, note: "the old site's rows drop away, top to bottom (six soft ticks, 0.2 s apart)" },
  { t: 5.85, kind: "check", note: "'Siden kan ikke findes' lands (dull error tone, not a chime)" },
  { t: 6.6, kind: "click", note: "the hand presses 'Opdater' once; nothing happens (dry old click)" },
  { t: 7.0, kind: "pop", len: 0.8, note: "the window shrinks into the dot" },
  { t: 7.6, kind: "logo", note: "the dot opens into the six dots, turning; the wordmark slides out" },
  { t: 8.3, kind: "open", len: 1.2, note: "the wizard window rises from below; the lockup leaves upward" },
  { t: 9.8, kind: "click", note: "the hand clicks into Virksomhedsnavn" },
  { t: 9.86, kind: "type", len: 0.73, note: "types 'Holm Fysioterapi'" },
  { t: 10.95, kind: "click", note: "the hand clicks Branche, the menu opens" },
  { t: 11.6, kind: "click", note: "the hand picks 'Fysioterapi', the menu closes" },
  { t: 11.75, kind: "pop", note: "the field 'Hvad laver du?' eases in, the fields below make room" },
  { t: 11.85, kind: "type", len: 0.82, note: "types 'Genoptræning og massage'" },
  { t: 12.75, kind: "click", note: "the hand clicks into E-mail" },
  { t: 12.81, kind: "type", len: 0.67, note: "types 'kontakt@holmfysio.dk'" },
  { t: 13.55, kind: "click", note: "the hand clicks into Telefon" },
  { t: 13.6, kind: "type", len: 0.42, note: "types '+45 31 42 53 64'" },
  { t: 14.3, kind: "send", note: "the hand presses 'Fortsæt'; the button turns sage" },
  { t: 14.48, kind: "open", len: 1.3, note: "the smear: the sage button stretches out to the right and sweeps across the frame, in again from the left (one long soft whoosh, rising then settling)" },
  { t: 14.88, kind: "type", len: 0.9, note: "the number counts 0 to 100 beside the bar (fine fast ticks slowing down, not keyboard)" },
  { t: 14.88, kind: "logo", len: 1.4, note: "the six-dot logo turns at the bar's head (loader)" },
  { t: 15.68, kind: "check", note: "the count lands on 100" },
  { t: 15.88, kind: "pop", len: 0.6, note: "the bar rises and thins into the site window's top bar" },
  { t: 16.34, kind: "open", len: 0.8, note: "the site window unfolds down from its top bar" },
  { t: 16.4, kind: "pop", len: 0.6, note: "the photo frames slide into the empty page (very soft)" },
  { t: 16.5, kind: "pop", len: 0.6, note: "headline lines and text rise in" },
  { t: 16.95, kind: "pop", note: "the hero photo slides up into its frame" },
  { t: 17.2, kind: "pop", len: 0.6, note: "three service photos slide in, left to right" },
  { t: 17.3, kind: "pop", len: 0.6, note: "three answer cards rise in from below (Virksomhedsnavn, Branche, Hvad laver du?)" },
  { t: 17.45, kind: "pop", len: 0.5, note: "navigation slides into the layout, left to right; the button at 18.1" },
  { t: 18.87, kind: "check", note: "answer 'Holm Fysioterapi' lands in the navigation" },
  { t: 19.37, kind: "check", note: "answer 'Fysioterapi' lands in the text" },
  { t: 19.87, kind: "check", note: "answer 'Genoptræning og massage' lands in the service cards; the loader finishes" },
];

/* ---------- small helpers ---------- */
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const sine = (u: number) => (1 - Math.cos(Math.PI * clamp01(u))) / 2;
const sp = (t: number, at: number, response = 0.55, damping = 1) => aspring(t * 30, at, response, damping);
// soft: a critically damped spring of the third order for big surfaces: no overshoot, the same long soft landing, but
// it also STARTS gently (zero acceleration), so a large surface never jumps into motion. Settles in about 0.9 × response.
const soft = (t: number, at: number, response = 0.8) => { const x = Math.max(0, t - at) * ((3 * Math.PI) / response); return 1 - (1 + x + (x * x) / 2) * Math.exp(-x); };

// the logo opening out of ONE dot: all six start on the first dot (ring radius 0), the ring opens (ro) and the dots
// fan round it from the largest (fan[i]); spin in degrees. Circles in screen px.
const D_ANG = [0, -57.8, -110.4, -157.7, -200.1, -237.5].map((d) => (d * Math.PI) / 180);
const fanDots = (size: number, cx: number, cy: number, spin: number, ro: number, fan: number[], grow = 1) => {
  const u = size / 100, a0 = ANG[0] + (spin * Math.PI) / 180;
  return LOGO.map((d, i) => {
    const a = a0 + D_ANG[i] * fan[i], R = RING.r * u * ro;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, r: (i === 0 ? d.r : d.r * (fan[i] < 0.02 ? 0 : 0.4 + 0.6 * Math.min(1, fan[i]))) * u * grow };
  });
};

/* ================= Hook: 0 – 6.95 ================= */
const SIZE = 76, SLOT0 = 380, SLOT1 = 1100, PUSH0 = 4.5, PUSH1 = 6.9, M0 = 6.85, M1 = 7.85;
const LOGO_S = 260;                                   // the lockup's C
const LOCK = { cx: 723.5, cy: 545.7, wmX: 834, wmH: 96 };
const lockSpin = (t: number) => { const u = 1 - seg(t, 7.55, 8.95); return -150 * u * u; };   // the dots turn slowly into the C's rest pose
const dot0At = (t: number) => {                       // where the first dot is while the lockup opens (screen px)
  const q = sp(t, 7.6, 0.55), ro = sp(t, 7.55, 0.55), a = ANG[0] + (lockSpin(t) * Math.PI) / 180;
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

const FRONT = 0;                                       // the site in front after the stack has turned twice (same layout as site 0)
const Hook: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, ready = useFonts();
  const E = sine(1 - Math.pow(1 - seg(t, PUSH0, PUSH1), 1.8));       // the one push: a soft start, a long soft landing under the 404
  const slotW = SLOT0 * mix(0.8, 1, soft(t, 0, 1.6)) * Math.pow(SLOT1 / SLOT0, E);   // the window: visibly growing from frame 0, then the push
  const extra = 460 * sine(seg(t, PUSH0 + 0.15, 6.1));               // the growing window pushes the words out to the right
  const items = hookItems(slotW + extra);
  const zs = 1 + 0.012 * t;                                             // the slow steady push
  const m = sine(Math.pow(seg(t, M0, M1), 1.6));                        // window → dot
  const d0 = dot0At(t);
  const rel = slotCentre(g, items, SIZE, ready) - extra / 2;            // the window's centre, relative to the line's centre
  const cx = 960 + rel * (1 - E) + (d0.x - 960) / zs, cy = 540 + (d0.y - 540) / zs;
  const ls0 = slotW / OLD.w, lsDot = (2 * LOGO[0].r * LOGO_S) / 100 / zs / OLD.h, ls = mix(ls0, lsDot, m);
  // the stack ("de fleste"): three more old sites fly up from below and tuck in behind the first; while the line is
  // read the stack turns (the front site drops away and returns at the back); it folds away as the window grows
  const rot = sine(seg(t, 1.8, 2.55)) + 3 * sine(seg(t, 3.3, 4.95)), ret = sine(seg(t, PUSH0 + 0.1, PUSH0 + 1.0));
  const deck = [0, 1, 2, 3].map((k) => {
    const arrive = k === 0 ? 1 : soft(t, 0.05 + 0.45 * (k - 1), 1.25);
    const dm = ((((k - rot) % 4) + 4) % 4);
    let d = dm, y = 0, o = 1, z = 10 - dm;
    if (dm > 3) { const L = 4 - dm; if (L < 0.5) { d = 0; y = L * 2 * 300; o = 1 - sine(L * 2); z = 20; } else { d = 3; y = (1 - L) * 2 * 140; o = sine((L - 0.5) * 2); z = 0; } }
    const fold = d > 0.5 ? 1 - ret : 1;
    return { k, z, o: o * (d > 0.02 ? fold : 1) * (k === 0 ? 1 : sine(arrive * 2.5)), tf: `translateY(${(-(23 + 62) * d * fold + y + (1 - arrive) * 2000).toFixed(2)}px) scale(${(1 - 0.06 * d * fold).toFixed(4)})`, front: dm < 0.02 || dm > 3.98 };
  }).sort((a, b) => a.z - b.z);
  const dropping = t >= 5.03;
  const er = (at: number) => { const p = sp(t, at, 0.5); return { opacity: clamp01(p * 1.6), transform: `translateY(${((1 - p) * 30).toFixed(2)}px)` }; };
  const c2 = sine(seg(m, 0.25, 1)), pr = press(g, 6.6, 0.16);            // 'Opdater' is pressed once; nothing happens
  const eb = er(6.15);
  // the hand presses 'Opdater' once (it comes up from below, well before, and leaves downward)
  const ox = cx + (194 - OLD.w / 2) * ls, oy = cy + (80 + 424 + 35 - OLD.h / 2) * ls;
  const hand = handAt(g, [{ at: 4.6, x: ox + 40, y: 1320 }, { at: 6.6, x: ox, y: oy, click: true, dur: 0.85, early: 0.5 }, { at: 7.6, x: ox + 30, y: 1380, early: 0, dur: 0.8 }], { size: 170 });
  return (
    <AbsoluteFill style={{ transform: `scale(${zs.toFixed(5)})` }}>
      {t < 6.2 && <div style={{ position: "absolute", left: 960, top: 540, transform: `translateX(${(-rel * E).toFixed(2)}px)` }}><Kinetic g={g} items={items} size={SIZE} /></div>}
      <div style={{ position: "absolute", left: cx, top: cy, width: 0, height: 0 }}>
        <div style={{ position: "absolute", left: -OLD.w / 2, top: -OLD.h / 2, width: OLD.w, height: OLD.h, transform: `scale(${ls.toFixed(5)})` }}>
          {deck.map((c) => (c.o > 0.002 && !(dropping && c.k === FRONT)) && (
            <div key={c.k} style={{ position: "absolute", inset: 0, transform: c.tf, opacity: c.o }}><OldSite i={c.k} /></div>))}
          {dropping && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - sine(seg(m, 0.1, 0.8)) }}>
              <OldWindow w={OLD.w} h={OLD.h} title="Siden kan ikke findes" path="/kontakt.htm">
                <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", fontFamily: TIMES, color: "#111111" }}>
                  <div style={{ position: "absolute", left: 84, top: 132, fontSize: 104, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap", lineHeight: 1, ...er(5.45) }}>Siden kan ikke findes</div>
                  <div style={{ position: "absolute", left: 84, top: 276, width: 1024, height: 3, background: "#8C8982", ...er(5.7) }} />
                  <div style={{ position: "absolute", left: 84, top: 316, fontFamily: ARIAL, fontSize: 34, whiteSpace: "nowrap", color: "#2A2A2A", ...er(5.9) }}>HTTP 404 – Filen eller mappen blev ikke fundet.</div>
                  <div style={{ position: "absolute", left: 84, top: 424, width: 220, height: 70, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ARIAL, fontSize: 32, color: "#1E1E1E",
                    background: "#D6D2CA", border: "3px solid", borderColor: pr > 0.5 ? "#7C7A76 #FFFFFF #FFFFFF #7C7A76" : "#FFFFFF #7C7A76 #7C7A76 #FFFFFF", boxSizing: "border-box", opacity: eb.opacity, transform: `${eb.transform} scale(${1 - 0.05 * pr})` }}>Opdater</div>
                </div>
              </OldWindow>
            </div>)}
          {/* the old site's title bar fades to the error page's; its rows drop away top to bottom, the last still falling while the error is read */}
          {dropping && t < 5.6 && <div style={{ position: "absolute", inset: 0, clipPath: "inset(0px 0px 680px 0px)", opacity: 1 - sine(seg(t, 5.05, 5.55)) }}><OldSite i={FRONT} /></div>}
          {dropping && t < 7.0 && (
            <div style={{ position: "absolute", left: 4, top: 80, width: OLD.w - 8, height: OLD.h - 84, overflow: "hidden" }}>
              {BANDS.map(([a, b], i) => { const p = soft(t, 5.05 + 0.2 * i, 0.85), o = 1 - sine(p * 1.6); return o > 0.002 && (
                <div key={i} style={{ position: "absolute", left: -4, top: -80, width: OLD.w, height: OLD.h, clipPath: `inset(${a}px 0px ${OLD.h - b}px 0px)`, transform: `translateY(${(p * 160).toFixed(2)}px)`, opacity: o }}><OldSite i={FRONT} /></div>); })}
            </div>)}
          {/* the morph: a sage shape the window's size, becoming a circle */}
          {m > 0 && <div style={{ position: "absolute", inset: 0, background: C.sage, opacity: sine(seg(m, 0, 0.8)), clipPath: `inset(0px ${(220 * c2).toFixed(2)}px round ${(380 * c2).toFixed(2)}px)` }} />}
        </div>
      </div>
      {t > 5.0 && t < 7.7 && <Hand {...hand} />}
    </AbsoluteFill>
  );
};

/* ================= Logo: 6.75 – 8.8 ================= */
const Lockup: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, d0 = dot0At(t);
  const fan = LOGO.map((_, i) => sp(t, 7.55 + 0.04 * i, 0.6, 0.9));
  const dots = fanDots(LOGO_S, d0.cx, d0.cy, lockSpin(t), d0.ro, fan).map((d, i) => (i === 0 && t < M1 ? { ...d, r: 0 } : d));
  const wp = seg(t, 7.6, 8.05), wq = soft(t, 7.6, 0.85);
  const lift = soft(t, 8.5, 0.6), zs = 1 + 0.04 * seg(t, 7.6, 9.7);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(-300 * lift).toFixed(2)}px) scale(${zs.toFixed(5)})`, opacity: 1 - sine(lift * 1.8) }}>
      <Dots dots={dots} />
      {wp > 0 && <div style={{ position: "absolute", left: LOCK.wmX, top: 540 - LOCK.wmH / 2, transform: `translateX(${((1 - wq) * -90).toFixed(2)}px)` }}><Wordmark h={LOCK.wmH} p={wp} /></div>}
    </AbsoluteFill>
  );
};

/* ================= Wizard: 8.05 – 14.7 ================= */
const S0 = 1500 / WIZ_WIN.w, S1 = 2.2, ZR = 2.3, SHIFT = 86, SPLIT = 424, SCROLL = 215;
const wiz = (t: number) => {
  const e = sine(seg(t, 9.45, 10.75));                                    // the scene's one push, to the form column
  const s = S0 * Math.pow(S1 / S0, e) * (1 + 0.04 * seg(t, 10.75, 14.6));
  const fy = mix(WIZ_WIN.h / 2, 476, e);
  const arr = soft(t, 8.1, 1.6), ex = sine(seg(t, 14.45, 15.43));
  const sT = s * mix(0.94, 1, arr) * mix(1, 0.96, ex);
  const y = (1 - arr) * 900 + ex * 300 + (WIZ_WIN.h / 2 - fy) * sT;
  const scroll = SCROLL * sine(seg(t, 11.9, 14.25)), shift = SHIFT * soft(t, CLK.option + 0.07, 0.9);
  // a page point (final layout coordinates) on screen
  const at = (px: number, py: number) => ({ x: 960 + (px - 800) * sT, y: 540 + y + (46 + py - scroll - WIZ_WIN.h / 2) * sT });
  return { s, sT, y, scroll, shift, at, opacity: sine(seg(t, 8.1, 8.4)) * (1 - sine(seg(t, 14.45, 15.25))) };
};
// the hand's targets (page px of the fingertip) and click times; every UI response fires at its click time
// (each glide starts at least 0.2 s after the click before it, so the hand is still on its target at the click's deepest point)
const CLK = { name: 9.8, branche: 10.95, option: 11.6, mail: 12.75, tel: 13.55, go: 14.3 };
const handKeys = (t: number): HandKey[] => {
  const v = wiz(t), P = (x: number, y: number) => v.at(x, y);
  const n = P(920, 287), br = P(920, 373), op = P(760, 424), ma = P(730, 565), te = P(974, 565), go = P(993, 810);   // the true marks
  return [
    { at: 8.2, x: n.x + 60, y: 1340 },
    { at: CLK.name, ...n, click: true },
    { at: CLK.branche, ...br, click: true, dur: 0.55, early: 0.4 },
    { at: CLK.option, ...op, click: true, dur: 0.3, early: 0.15 },
    { at: CLK.mail, ...ma, click: true, dur: 0.55, early: 0.4 },
    { at: CLK.tel, ...te, click: true, dur: 0.4, early: 0.2 },
    { at: CLK.go, ...go, click: true, dur: 0.4, early: 0.15 },
    { at: 15.5, x: go.x + 40, y: 1400, early: 0, dur: 0.85 },
  ];
};
const BTN = { x: WIZ_R.button.x + WIZ_R.button.w / 2, y: WIZ_R.button.y + WIZ_R.button.h / 2, w: WIZ_R.button.w, h: WIZ_R.button.h };
const T_NAME = "Holm Fysioterapi", T_WHAT = "Genoptræning og massage", T_MAIL = "kontakt@holmfysio.dk", T_TEL = "+45 31 42 53 64";
const OPTIONS = ["Fysioterapi", "Frisør", "Restaurant"];

const WizardScene: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, v = wiz(t);
  const name = typed(g, 9.86, T_NAME, 22), what = typed(g, 11.85, T_WHAT, 28), mail = typed(g, 12.81, T_MAIL, 30), tel = typed(g, 13.6, T_TEL, 36);
  const focus = t < CLK.name ? null : t < CLK.branche ? "name" : t < CLK.option + 0.02 ? "branche" : t < CLK.mail ? null : t < CLK.tel ? "email" : t < CLK.go ? "phone" : null;
  const whatOn = t >= CLK.option + 0.02 && t < CLK.mail;
  const typing = (name.length > 0 && name.length < T_NAME.length) || (mail.length > 0 && mail.length < T_MAIL.length) || (tel.length > 0 && tel.length < T_TEL.length);
  const props = { g, name, branche: t >= CLK.option + 0.02 ? "Fysioterapi" : "", email: mail, phone: tel, focus, caret: true, caretSolid: typing, hideButton: true } as const;
  const menu = sp(t, CLK.branche + 0.02, 0.45) - sp(t, CLK.option + 0.03, 0.5), room = v.shift / SHIFT;
  const hover = seg(t, 11.3, 11.45);
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
                  <div style={{ position: "absolute", left: 560, top: 433, width: 480, fontFamily: SANS, color: C.ink, opacity: seg(room, 0.25, 0.8), transform: `translateY(${((1 - room) * -26).toFixed(2)}px) scale(${mix(0.96, 1, room)})`, transformOrigin: "50% 0%" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, height: 25 }}>Hvad laver du?<span style={{ color: "#B4574A" }}> *</span></div>
                    <div style={{ width: 480, height: 42, boxSizing: "border-box", borderRadius: 7, background: C.white, border: `1px solid ${whatOn ? "#8FAFA6" : "#E1DDD6"}`, boxShadow: whatOn ? "0 0 0 3px rgba(135,168,158,0.22)" : "0 1px 1px rgba(26,22,20,0.03)",
                      display: "flex", alignItems: "center", padding: "0 13px", fontSize: 14, color: what ? C.ink : "#A9A39B", whiteSpace: "nowrap" }}>
                      <span>{what || "fx behandling af skader"}</span>
                      {whatOn && <span style={{ display: "inline-block", width: 1.5, height: 18, marginLeft: what ? 1 : -2, background: C.ink, opacity: blink ? 1 : 0 }} />}
                    </div>
                  </div>)}
                {/* the select's menu grows out of the Branche field */}
                {menu > 0.001 && (
                  <div style={{ position: "absolute", left: 560, top: 398, width: 480, height: 132, boxSizing: "border-box", borderRadius: 8, background: C.white, border: "1px solid #E1DDD6", boxShadow: SHADOW, padding: 6,
                    fontFamily: SANS, fontSize: 14, color: C.ink, opacity: clamp01(menu * 1.6), transform: `translateY(${((1 - menu) * -10).toFixed(2)}px) scale(${mix(0.94, 1, menu)})`, transformOrigin: "50% 0%" }}>
                    {OPTIONS.map((o, i) => (
                      <div key={o} style={{ height: 40, borderRadius: 5, padding: "0 10px", display: "flex", alignItems: "center", background: i === 0 ? `rgba(231,239,236,${hover})` : "transparent" }}>{o}</div>))}
                  </div>)}
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

/* ================= the smear: button → trail → progress bar → the window's top edge (13.9 – 20.15) ================= */
// After the reference (10–12 s): the pressed button turns sage and smears out to the right, leaving a soft trail that is
// wide and faint where it came from and tapers into a thick bar. The sweep is ONE motion, left to right: the head
// leaves through the right edge and comes in again from the left at the centre line (soft start, long landing),
// where it settles as the progress bar; the number counts with the head and lands on 100. Then the bar rises and
// thins into the site window's top bar, and the window unfolds down from it.
const BAR_H = 86, BAR_L = 410, BAR_R = 1510, SW0 = 14.46, SW1 = 15.8, D1 = 700, D2 = BAR_R + 260, LAG = 0.42;
const ramp = (x: number) => (x <= 0 ? 0 : x < 0.6 ? (x * x) / 1.2 : x - 0.3);
const sweepE = (t: number) => sine(1 - Math.pow(1 - seg(t, SW0, SW1), 1.8));
const siteQ = (t: number) => soft(t, 16.34, 0.95);                       // the window unfolding down from its top bar
// the smear's shape between tail xL and head xH on the line yc: fh = the tail's height (≥ BAR_H), a = strength
const Smear: React.FC<{ id: string; xL: number; xH: number; yc: number; fh: number; a: number; solid: number }> = ({ id, xL, xH, yc, fh, a, solid }) => {
  const r = BAR_H / 2, len = Math.max(1, xH - xL), xT = xL + Math.min(len * 0.62, 900), d = (xT - xL) * 0.5;
  if (len < 4 || a <= 0.003) return null;
  const path = `M ${xL} ${yc - fh / 2} C ${xL + d} ${yc - fh / 2} ${xT - d} ${yc - r} ${xT} ${yc - r} L ${xH - r} ${yc - r} A ${r} ${r} 0 0 1 ${xH - r} ${yc + r} L ${xT} ${yc + r} C ${xT - d} ${yc + r} ${xL + d} ${yc + fh / 2} ${xL} ${yc + fh / 2} Z`;
  const headL = Math.max(xL, xH - 360);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: a }}>
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
      <path d={path} fill={`url(#${id}a)`} filter={`url(#${id}f)`} opacity={1 - solid} />
      {solid > 0 && <rect x={xL} y={yc - r} width={len} height={BAR_H} rx={r} fill={`url(#${id}a)`} opacity={solid} />}
      <rect x={headL} y={yc - r} width={xH - headL} height={BAR_H} rx={r} fill={`url(#${id}b)`} opacity={1 - solid} />
    </svg>
  );
};
const Loader: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, live = wiz(t);
  const b = live.at(BTN.x, BTN.y + live.shift), bs = live.sT / S1, bw = BTN.w * S1, bh = BTN.h * S1;
  const col = sine(seg(t, CLK.go + 0.06, CLK.go + 0.33));                               // ink → sage
  const S = (D1 + D2) * sweepE(t), Sl = (D1 + D2) * sweepE(t - LAG);
  const v = clamp01(((sweepE(t + 0.01) - sweepE(t - 0.01)) / 0.02) / 1.9);   // the sweep's speed, 0..1
  // stage 1: out of the button, off the right edge
  const x0 = b.x + (bw * bs) / 2, h1x = x0 + Math.min(S, D1 + 400), t1x = b.x - (bw * bs) / 2;   // the trail stays anchored where the button was
  // stage 2: in from the left, landing as the bar
  const h2x = -260 + Math.max(0, S - D1), t2x = Math.min(BAR_L, -260 + Math.max(0, Sl - D1));
  const landed = sine(seg(t, SW1 - 0.45, SW1 + 0.05));
  const pct = Math.round(100 * clamp01((h2x - BAR_L) / (BAR_R - BAR_L)));
  // the bar becomes the window's top bar
  const m2 = sine(seg(t, 15.86, 16.46)), cH = camH1(g);
  const tl = project(cH, { x: H1_SITE.x - SITE_WIN.w / 2, y: H1_SITE.y - SITE_WIN.h / 2, z: H1_SITE.z }), pill = project(cH, { x: H1_SITE.x, y: H1_SITE.y + 23 - SITE_WIN.h / 2, z: H1_SITE.z });
  const rx = mix(BAR_L, tl.x, m2), rw = mix(BAR_R - BAR_L, SITE_WIN.w * tl.s, m2), rh = mix(BAR_H, 46 * tl.s, m2), ry = mix(540 - BAR_H / 2, tl.y, m2);
  const barOp = 1 - sine(seg(t, 16.44, 16.68));
  // the turning logo: at the bar's head, then on the address pill
  const lp = sine(seg(t, 14.88, 15.28)), out = sine(seg(t, 19.75, 20.1));
  const lx = mix(Math.min(h2x, BAR_R) - BAR_H / 2, pill.x, m2), ly = mix(540, pill.y, m2), lsz = mix(64, 30 * pill.s, m2);
  const dots = fanDots(lsz, lx, ly, 240 * ramp(t - 14.88), 1, [1, 1, 1, 1, 1, 1], lp * (1 - out));
  const nOp = sine(seg(t, 14.88, 15.18)) * (1 - sine(seg(t, 15.84, 16.14)));
  return (
    <AbsoluteFill>
      {t < 15.5 && (
        <div style={{ position: "absolute", left: b.x - bw / 2, top: b.y - bh / 2, width: bw, height: bh, borderRadius: mix(7 * S1, bh / 2, col), opacity: live.opacity * (1 - sine(seg(t, 14.58, 15.13))), transform: `scale(${(bs * (1 - 0.045 * press(g, CLK.go))).toFixed(5)})`,
          background: `color-mix(in srgb, ${C.sage} ${(col * 100).toFixed(1)}%, ${C.ink})`, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 14 * S1, fontWeight: 500 }}>
          <span style={{ opacity: 1 - col }}>Fortsæt</span>
        </div>)}
      {t >= SW0 && t < 15.7 && <Smear id="s1" xL={t1x} xH={h1x} yc={b.y} fh={BAR_H + 300 * v} a={sine(seg(t, SW0, SW0 + 0.2)) * (1 - sine(seg(t, 14.83, 15.63)))} solid={0} />}
      {t >= SW0 && m2 <= 0 && <Smear id="s2" xL={t2x} xH={Math.max(h2x, t2x + 1)} yc={540} fh={BAR_H + 420 * v} a={1} solid={landed} />}
      {m2 > 0 && barOp > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: barOp }}>
          <div style={{ position: "absolute", left: rx, top: ry, width: rw, height: rh, borderRadius: mix(BAR_H / 2, 16 * tl.s, m2), background: `linear-gradient(90deg, color-mix(in srgb, #FBFAF7 ${(m2 * 100).toFixed(1)}%, ${C.sageLight}), color-mix(in srgb, #FBFAF7 ${(m2 * 100).toFixed(1)}%, ${C.sage}))` }} />
        </div>)}
      {nOp > 0 && (
        <div style={{ position: "absolute", left: BAR_R - 400, top: 540 - BAR_H / 2 - 150, width: 400, textAlign: "right", fontFamily: SERIF, fontSize: 112, lineHeight: "120px", letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums",
          opacity: nOp, transform: `translateY(${((1 - sine(seg(t, 14.88, 15.28))) * 30 - sine(seg(t, 15.84, 16.14)) * 40).toFixed(2)}px)` }}>
          {pct}<span style={{ fontSize: 56, color: C.soft }}> /100</span>
        </div>)}
      {lp > 0 && <Dots dots={dots} color={`color-mix(in srgb, ${C.sage} ${(m2 * 100).toFixed(1)}%, #FFFFFF)`} />}
    </AbsoluteFill>
  );
};

/* ================= Site: 14.5 – h1 ================= */
// chips: the wizard's answers, on the window's bottom edge (plane px), each flying to where the site uses it
const CHIPS = [
  { label: "Virksomhedsnavn", text: T_NAME, w: 430, x: 276, to: { x: 201, y: 103 }, hi: { x: 104, y: 82, w: 300, h: 42 }, hi2: null as null | { x: number; y: number; w: number; h: number } },
  { label: "Branche", text: "Fysioterapi", w: 430, x: 730, to: { x: 126, y: 482 }, hi: { x: 62, y: 464, w: 128, h: 36 }, hi2: null },
  { label: "Hvad laver du?", text: T_WHAT, w: 430, x: 1184, to: { x: 955, y: 858 }, hi: { x: 520, y: 806, w: 420, h: 100 }, hi2: { x: 970, y: 806, w: 420, h: 100 } },
];
const FLY = [18.3, 18.8, 19.3], FLY_D = 0.6;
const SiteScene: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, q = siteQ(t), winOp = sine(seg(t, 16.26, 16.46));
  const done = t >= 20.18;
  const o = (at: number, r = 0.55) => sp(t, at, r);
  const b = {
    frame: [soft(t, 16.28, 0.9), soft(t, 16.43, 0.9), soft(t, 16.58, 0.9), soft(t, 16.73, 0.9)],
    h1: soft(t, 16.26, 1.0), h2: soft(t, 16.43, 1.0), para: soft(t, 16.63, 1.0),
    hero: soft(t, 16.8, 1.2), cards: [soft(t, 17.1, 0.9), soft(t, 17.3, 0.9), soft(t, 17.5, 0.9)],
    nav: [0, 1, 2, 3, 4, 5].map((i) => o(17.4 + 0.09 * i, 0.5)), btn: soft(t, 18.0, 0.7),
  };
  const patch = 1 - seg(t, 19.85, 20.15);
  return (
    <Stage3D cam={camH1(g)}>
      <Plane {...H1_SITE} opacity={winOp} w={SITE_WIN.w} h={SITE_WIN.h}>
        {done ? <SiteWindow /> : (
          <>
            {/* the window unfolds down from its top bar */}
            <div style={{ position: "absolute", left: 0, top: 0, width: SITE_WIN.w, height: mix(46, SITE_WIN.h, q), borderRadius: 16, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}` }} />
            <div style={{ position: "absolute", left: 0, top: 0, clipPath: `inset(0px 0px ${mix(SITE_WIN.h - 46, 0, q).toFixed(2)}px 0px round 16px)` }}><Browser w={SITE_WIN.w} h={SITE_WIN.h} url="Forhåndsvisning"><SiteBuild b={b} /></Browser></div>
            {patch > 0 && <div style={{ position: "absolute", left: SITE_WIN.w / 2 - 140, top: 12, width: 280, height: 22, background: "#F1EEE8", opacity: patch }} />}
            {CHIPS.map((c, i) => {
              const land = FLY[i] + FLY_D - 0.03, hv = seg(t, land - 0.12, land) * (1 - seg(t, land, land + 0.25));
              if (hv <= 0) return null;
              return [c.hi, c.hi2].map((h, j) => h && (
                <div key={`${i}-${j}`} style={{ position: "absolute", left: h.x, top: h.y, width: h.w, height: h.h, borderRadius: 10, background: "rgba(135,168,158,0.30)", boxShadow: "0 0 0 2px rgba(135,168,158,0.55)", opacity: hv }} />));
            })}
            {CHIPS.map((c, i) => {
              const a = soft(t, 17.15 + 0.25 * i, 0.9), p = sine(seg(t, FLY[i], FLY[i] + FLY_D));
              if (a <= 0.001 || p >= 1) return null;
              const x = mix(c.x, c.to.x, p), y = mix(SITE_WIN.h - 10, c.to.y, p) + (1 - a) * 260;
              return (
                <div key={c.text} style={{ position: "absolute", left: x - c.w / 2, top: y - 56, width: c.w, height: 112, boxSizing: "border-box", borderRadius: 18, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, padding: "16px 26px",
                  fontFamily: SANS, color: C.ink, whiteSpace: "nowrap", opacity: sine(a * 1.6) * (1 - sine(seg(p, 0.55, 1))), transform: `scale(${mix(1, 0.4, p).toFixed(4)})` }}>
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
  return (
    <AbsoluteFill>
      {t >= 7.5 && t < 9.4 && <Lockup g={g} />}
      {t < M1 && <Hook g={g} />}
      {t >= 8.05 && t < 15.45 && <WizardScene g={g} />}
      {t >= 16.2 && <SiteScene g={g} />}
      {t >= 8.05 && t < 20.12 && <Loader g={g} />}
      {t >= 8.3 && t < 15.6 && <WizHand g={g} />}
    </AbsoluteFill>
  );
};
