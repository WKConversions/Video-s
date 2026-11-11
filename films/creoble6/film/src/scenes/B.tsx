// Scene B (h1 20.5 s → h2 44.65 s): the preview, the edit, the choice, hosting turning green (contract 2, B1–B7).
// Objects carry the motion. The camera is one steady push for the whole span (the kit's hand-off rate, 12 units/s);
// the B1 pull-back to the whole page and the B2 push close on the hero act as the camera and stay clean sine eases.
// Karl's notes of 10 Nov: every OBJECT animation pops (./motion: pop in, popOut out, wobble after an impact); the hand
// glides target to target (./hand) and rests about 0.45 s before each click. The flourishes, each grown out of what
// happens: B1 one soft light sheen across the page as it grows, the chip pops; B2 the old headline breaks into sage
// dots (the logo's motif) that drift up and re-gather into the new one; B4 the card divides like a cell (a gooey neck
// that pinches and snaps, then each card settles), the 99 rolls with a soft streak and one sage ring; B6 the rows fill
// green like liquid and their checks draw and pop (B_card.tsx). One world plane (z = ZS) holds the site, the cards and
// the line; the hosting card sits on the kit's hand-off plane so the last frames equal Handoff2.
import React from "react";
import { C, SANS, SERIF, SHADOW, SHADOW_BIG, clamp01, mix } from "../lib";
import { f, press, Ico, Browser, HolmSite } from "../shared";
import { Stage3D, Plane, cam, PERSP } from "../cam";
import { Kinetic } from "../type";
import { Spinner, LOGO } from "../dots";
import { SiteWindow, HostingCard, CARD, CARD_ROWS, Handoff1, Handoff2, HANDOFF_HALF } from "../ui";
import { Hand, handAt, HandKey } from "../hand";
import { pop, popOut, wobble } from "../motion";
import { HostCard, HRow } from "./B_card";

/* ---------- the beats (film seconds) ---------- */
const TB = {
  grow: 20.84, sheen: 21.05, chip: 21.85, back: 22.85, chipOut: 23.75,               // B1
  hl: 24.2, type: 24.55, send: 25.67, brk: 25.8, editOut: 26.62,                     // B2
  shrink: 26.4, card: 27.75,                                                         // B3
  split: 28.5, pinch: 28.86, btn: 29.15, snap: 29.32, cells: 29.7,                   // B4: the cell division
  dl: 30.4, pack: 30.47, file: 30.75, once: 29.95, bar: 30.9, done: 31.5, swap: 31.52,
  online: 31.42, pill: 31.57, addr: 31.75, live: 32.55, roll: 32.42, ring: 33.06, md: 33.55,
  ub: 34.6,                                                                          // B5
  pick: 36.1, morph: 36.2, leave: 36.3,                                              // B6
  rowsIn: [37.05, 38.35, 39.95], rowsType: [37.3, 38.65, 40.3], rowsLen: [0.5, 0.8, 0.85], rowsOn: [37.85, 39.5, 41.6],
  price: 42.0, set: 43.12,                                                           // B7
};

export const BLUR: [number, number][] = [];
export const EVENTS: { t: number; kind: "click" | "type" | "check" | "pop" | "open" | "send" | "logo"; len?: number; note: string }[] = [
  { t: 20.85, kind: "open", len: 1.85, note: "B1 the window grows to the whole page (soft, long)" },
  { t: 21.1, kind: "logo", len: 1.3, note: "B1 a soft light sheen sweeps across the page (airy shimmer)" },
  { t: 21.9, kind: "pop", note: "B1 chip 'Gratis forhåndsvisning' pops onto the window's top edge" },
  { t: 22.9, kind: "open", len: 1.85, note: "B2 the window comes back and close on the hero (soft, long)" },
  { t: TB.hl, kind: "click", note: "B2 the hand clicks the headline" },
  { t: TB.hl + 0.08, kind: "pop", note: "B2 the edit field grows out of the headline" },
  { t: TB.type, kind: "type", len: 0.95, note: "B2 typing 'Gør overskriften mere personlig'" },
  { t: TB.send, kind: "click", note: "B2 the hand presses send" },
  { t: TB.send + 0.03, kind: "send", note: "B2 the edit is sent" },
  { t: TB.brk, kind: "pop", note: "B2 the old headline breaks into small sage dots (a light scatter)" },
  { t: TB.brk + 0.55, kind: "logo", len: 0.4, note: "B2 the dots re-gather and the new headline resolves" },
  { t: 26.6, kind: "open", len: 1.7, note: "B3 the site shrinks into the thumbnail card (soft, long)" },
  { t: TB.card, kind: "pop", note: "B3 the thumbnail card settles" },
  { t: TB.split, kind: "open", len: 0.8, note: "B4 the card stretches like a cell (gooey)" },
  { t: TB.snap, kind: "pop", note: "B4 the neck pinches and snaps: two cards, each settling" },
  { t: TB.dl, kind: "click", note: "B4 the hand clicks the download button; the thumbnail packs into the file row" },
  { t: TB.bar, kind: "logo", len: 0.6, note: "B4 the download bar fills (soft rising tone)" },
  { t: TB.done, kind: "check", note: "B4 download done" },
  { t: TB.swap, kind: "pop", note: "B4 the Online card steps forward" },
  { t: TB.addr, kind: "type", len: 0.75, note: "B4 the address types holmfysio.dk" },
  { t: TB.live, kind: "pop", note: "B4 'Live' comes on (small)" },
  { t: TB.roll, kind: "logo", len: 0.6, note: "B4 the price 99 rolls up (soft ticking roll)" },
  { t: TB.ring, kind: "pop", note: "B4 the price lands; one faint sage ring pulses out behind it" },
  { t: TB.ub, kind: "click", note: "B5 the hand clicks; 'Uden binding' ticks in" },
  { t: TB.ub + 0.04, kind: "check", note: "B5 'Uden binding' ticks in" },
  { t: TB.pick, kind: "click", note: "B6 the hand clicks the Online card" },
  { t: TB.morph, kind: "open", len: 1.3, note: "B6 the card grows into the hosting card" },
  { t: TB.rowsType[0], kind: "type", len: TB.rowsLen[0], note: "B6 row 1 types holmfysio.dk" },
  { t: TB.rowsOn[0] - 0.05, kind: "open", len: 0.8, note: "B6 row 1 fills green like liquid (soft pour)" },
  { t: TB.rowsOn[0] + 0.05, kind: "check", note: "B6 row 1 .dk-domæne: the check draws and pops" },
  { t: TB.rowsType[1], kind: "type", len: TB.rowsLen[1], note: "B6 row 2 types kontakt@holmfysio.dk" },
  { t: TB.rowsOn[1] - 0.05, kind: "open", len: 0.8, note: "B6 row 2 fills green like liquid (soft pour)" },
  { t: TB.rowsOn[1] + 0.05, kind: "check", note: "B6 row 2 e-mail: the check draws and pops" },
  { t: TB.rowsType[2], kind: "type", len: TB.rowsLen[2], note: "B6 row 3 types Europæiske servere" },
  { t: TB.rowsOn[2] - 0.05, kind: "open", len: 0.8, note: "B6 row 3 fills green like liquid (soft pour)" },
  { t: TB.rowsOn[2] + 0.05, kind: "check", note: "B6 row 3 siden online: the check draws and pops" },
  { t: TB.price, kind: "pop", note: "B7 the price row pops up" },
  { t: TB.set, kind: "click", note: "B7 the hand clicks 'Sæt online'" },
  { t: TB.set + 0.1, kind: "logo", len: 0.6, note: "B7 the three checks pulse in turn (three soft notes, 0.12 s apart)" },
];

/* ---------- the world ---------- */
const T1 = 20.5;                                   // h1 (s)
const ZS = -420;                                   // the stage plane (the kit's H1_SITE)
const ZH = -60 - 12 * (44.65 - T1);                // the hosting card's plane: the kit's H2_CARD under this camera
const cz = (t: number) => -30 - 12 * (t - T1);     // the one steady push (camH1's rate, kept to h2 = camH2)
const pz = (z: number, t: number) => PERSP / (PERSP - (z - cz(t)));          // on-screen scale of a plane at z
type Pose = { x: number; y: number; s: number };
// wp: a pose on the stage plane from how it should look on screen at time tRef (centre px, scale)
const wp = (tRef: number, sx: number, sy: number, S: number): Pose => { const p = pz(ZS, tRef); return { x: (sx - 960) / p, y: (sy - 540) / p, s: S / p }; };
const lp = (a: Pose, b: Pose, m: number): Pose => ({ x: mix(a.x, b.x, m), y: mix(a.y, b.y, m), s: mix(a.s, b.s, m) });
const sine = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));
const smoother = (x: number) => { const u = clamp01(x); return u * u * u * (u * (6 * u - 15) + 10); };
const lin = (t: number, a: number, d: number) => clamp01((t - a) / d);
const op = (v: number, k = 1.5) => clamp01(v * k);                         // opacity from a pop (it may pass 1)
// soften: time eased in over A s from `at` (seconds), for a pop on a LARGE surface, so it starts without a kick
// (the flow check flags a sudden start); everything after the first A s runs A/2 later, so starts sit A/2 earlier.
const soften = (g: number, at: number, A: number) => { const u = (g - f(at)) / 30; return u <= 0 ? g : f(at) + 30 * (u < A ? (u * u) / (2 * A) : u - A / 2); };
// popRamp: the pop of a LARGE surface travelling far: a spring following a smooth target, built as a soft spread of
// pops (Hann-weighted, `spread` s wide). It starts gently, never kicks, and lands with the pop's small settle.
const popRamp = (g: number, at: number, spread: number, o: { dur?: number; over?: number }, n = 12) => {
  let s = 0, w = 0;
  for (let k = 0; k < n; k++) { const wk = Math.sin((Math.PI * (k + 0.5)) / n) ** 2; w += wk; s += wk * pop(g, at + (spread * k) / (n - 1), o); }
  return s / w;
};
const arrive = (p: number, dy = 26, from = 0.95): React.CSSProperties => ({ opacity: op(p), transform: `translateY(${((1 - p) * dy).toFixed(2)}px) scale(${mix(from, 1, p).toFixed(4)})` });

/* ---------- the site window ---------- */
const SW = 1460, SH = 906, HT = 46 + 1500;         // normal window; the tall window showing the whole page
const TQ = 0.36;                                   // the thumbnail is laid out at this scale (crisp when small)
const P0: Pose = { x: 0, y: 0, s: 1 };                                     // the h1 hand-off
const P1 = wp(22.5, 960, 140 + (SH / 2) * 0.535, 0.535);                   // whole page: 781 × 827 on screen
const CW = 780, CH = 590, CY = 671, CXL = 546, CXR = 1374;                 // the two cards (as seen at 34 s): 1608 wide together
const TW = 520, TY = -3;                                                   // the thumbnail in a card (width, centre offset)
const C3 = wp(34, 960, CY, 1), C4L = wp(34, CXL, CY, 1), C4R = wp(34, CXR, CY, 1);

/* ---------- B2: the headline rewrite (site px inside the headline box: DM Sans 600, 76 px, line height 76) ---------- */
type Wd = { t: string; x: number; w: number; l: number };
const OLD_W: Wd[] = [{ t: "Kom", x: 0, w: 146, l: 0 }, { t: "godt", x: 165, w: 150, l: 0 }, { t: "i", x: 333, w: 20, l: 0 }, { t: "bevægelse", x: 0, w: 352, l: 1 }, { t: "igen.", x: 371, w: 168, l: 1 }];
const NEW_W: Wd[] = [{ t: "Velkommen", x: 0, w: 384, l: 0 }, { t: "hjem", x: 403, w: 166, l: 0 }, { t: "i", x: 0, w: 20, l: 1 }, { t: "din", x: 39, w: 112, l: 1 }, { t: "krop.", x: 170, w: 182, l: 1 }];
const OLD_N = [2, 2, 1, 4, 3], NEW_N = [4, 2, 1, 2, 3];                    // dots per word: 12 each
const spread = (ws: Wd[], ns: number[]) => ws.flatMap((w, i) => Array.from({ length: ns[i] }, (_, j) => ({
  word: i, x: w.x + (w.w * (j + 0.5)) / ns[i] + 9 * Math.sin(i * 3.1 + j * 1.7), y: w.l * 76 + 44 + 7 * Math.cos(i * 2.3 + j * 2.9) })));
const DOT_FROM = spread(OLD_W, OLD_N), DOT_TO = spread(NEW_W, NEW_N);
const DOT_R = DOT_FROM.map((_, j) => 4.5 + LOGO[j % 6].r * 0.32);         // the logo's own dot sizes, small
const ST = 0.018, TRAVEL = 0.5;                                            // stagger between dots, each dot's flight (s)
const firstDot = (ns: number[], i: number) => ns.slice(0, i).reduce((a, b) => a + b, 0);
const ioEase = (u: number) => { const x = clamp01(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const word = (w: Wd, st: React.CSSProperties, key: number) => <span key={key} style={{ display: "inline-block", ...st }}>{w.t}</span>;
const words2 = (ws: Wd[], st: (i: number) => React.CSSProperties) => (
  <>{ws.filter((w) => w.l === 0).map((w, i) => <React.Fragment key={i}>{i > 0 && " "}{word(w, st(i), i)}</React.Fragment>)}<br />
    {ws.map((w, i) => [w, i] as const).filter(([w]) => w.l === 1).map(([w, i], n) => <React.Fragment key={i}>{n > 0 && " "}{word(w, st(i), i)}</React.Fragment>)}</>
);
// The new words; a[i] 0..1(+) = word i's arrival (rises 14 px and settles from 0.94, crisp: no blur)
const NewWords: React.FC<{ a: number[] }> = ({ a }) => words2(NEW_W, (i) => a[i] >= 1 ? {} : { opacity: op(a[i], 1.6), transform: `translateY(${((1 - a[i]) * 14).toFixed(2)}px) scale(${mix(0.94, 1, a[i]).toFixed(4)})` });
const DONE_HEADLINE = <NewWords a={[1, 1, 1, 1, 1]} />;
const Rewrite: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, t0 = TB.brk;
  if (t >= t0 + 1.4) return DONE_HEADLINE;
  const oldA = OLD_W.map((_, i) => sine(lin(t, t0 + firstDot(OLD_N, i) * ST - 0.03, 0.22)));          // each old word breaks as its dots appear
  const newA = NEW_W.map((_, i) => pop(g, t0 + 0.04 + TRAVEL + firstDot(NEW_N, i) * ST, { dur: 0.42, over: 0.06 }));
  const dots = DOT_FROM.map((a, j) => {
    const b = DOT_TO[j], d0 = t0 + j * ST, appear = pop(g, d0, { dur: 0.22, over: 0.15 });
    const u = ioEase((t - d0 - 0.04) / TRAVEL), cx = (a.x + b.x) / 2 + 30 * Math.sin(j * 2.1), cy = Math.min(a.y, b.y) - 70 - 16 * Math.cos(j * 1.3);
    const x = (1 - u) * (1 - u) * a.x + 2 * u * (1 - u) * cx + u * u * b.x, y = (1 - u) * (1 - u) * a.y + 2 * u * (1 - u) * cy + u * u * b.y;
    const gone = smoother(lin(t, d0 + 0.04 + TRAVEL - 0.04, 0.16));
    return { x, y, r: DOT_R[j] * appear * (1 - gone) };
  });
  return (
    <div style={{ position: "relative" }}>
      <div>{oldA.every((v) => v >= 1) ? <span style={{ visibility: "hidden" }}>Kom godt i<br />bevægelse igen.</span>
        : words2(OLD_W, (i) => ({ opacity: 1 - oldA[i], transform: `translateY(${(-8 * oldA[i]).toFixed(2)}px) scale(${mix(1, 0.9, oldA[i]).toFixed(4)})` }))}</div>
      <div style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}><NewWords a={newA} /></div>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        {dots.map((d, j) => d.r > 0.05 ? <circle key={j} cx={d.x} cy={d.y} r={d.r} fill={C.sage} /> : null)}
      </svg>
    </div>
  );
};

// The window at height h (906 … HT): two pieces of the tall window, the top clipped at h, the bottom cap riding the
// edge (transforms and clips only; no layout changes).
const SiteTall: React.FC<{ h: number }> = ({ h }) => (
  <div style={{ position: "relative", width: SW, height: SH }}>
    <div style={{ position: "absolute", left: 0, top: 0, clipPath: `inset(-400px -400px ${(HT - h + 38).toFixed(2)}px -400px)` }}>
      <Browser w={SW} h={HT}><HolmSite w={SW} h={1500} /></Browser>
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(h - HT).toFixed(2)}px)` }}>
      <div style={{ clipPath: `inset(${HT - 40}px -400px -400px -400px)` }}>
        <Browser w={SW} h={HT}><div style={{ transform: `translateY(${(HT - h).toFixed(2)}px)` }}><HolmSite w={SW} h={1500} /></div></Browser>
      </div>
    </div>
  </div>
);
// B1's flourish: one soft diagonal light sheen crossing the page while it grows (u 0..1), clipped to the window.
const Sheen: React.FC<{ h: number; u: number }> = ({ h, u }) => u <= 0 || u >= 1 ? null : (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: HT, overflow: "hidden", clipPath: `inset(0px 0px ${(HT - h).toFixed(2)}px 0px round 16px)`, pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, top: -300, width: 460, height: HT + 600, transform: `translateX(${(-700 + (SW + 1100) * u).toFixed(2)}px) rotate(18deg)`, mixBlendMode: "screen",
      opacity: Math.sin(Math.PI * u) ** 0.6, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,250,240,0.2) 28%, rgba(255,252,246,0.56) 50%, rgba(255,250,240,0.2) 72%, rgba(255,255,255,0) 100%)" }} />
  </div>
);
// The site laid out at scale q inside its plane (q > 1 for the close-up, < 1 for small views), so it stays crisp.
const SiteQ: React.FC<{ q: number; children?: React.ReactNode }> = ({ q, children }) => (
  <div style={{ width: SW * q, height: SH * q, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transform: q === 1 ? undefined : `scale(${q})`, transformOrigin: "0 0" }}>{children}</div>
  </div>
);

// The edit: a sage outline on the headline and a small field growing out of it (site px, over the window).
const EDIT_TEXT = "Gør overskriften mere personlig";
const HL = { x: 46, y: 198, w: 624, h: 184 }, FIELD = { x: 46, y: 398, w: 624, h: 86 };
const SEND = { x: FIELD.x + FIELD.w - 43, y: FIELD.y + 43 };
const Edit: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const po = pop(g, TB.hl + 0.02, { dur: 0.45, over: 0.05 }), pf = pop(g, TB.hl + 0.1, { dur: 0.55, over: 0.06 }), pr = 1 - popOut(g, TB.editOut, { dur: 0.42 });
  if (po <= 0 || pr > 0.999) return null;
  const n = Math.floor(lin(t, TB.type, 0.95) * EDIT_TEXT.length), typing = t > TB.type && t < TB.type + 0.95;
  const sp = pop(g, TB.send + 0.04, { dur: 0.3, over: 0.06 }) * popOut(g, TB.brk + 0.62, { dur: 0.3 }), pb = press(g, TB.send);
  const ar = 1 - op(pop(g, TB.send + 0.02, { dur: 0.22, over: 0 }), 1.2);
  const o = clamp01(1 - pr);
  return (
    <>
      <div style={{ position: "absolute", left: HL.x, top: HL.y, width: HL.w, height: HL.h, boxSizing: "border-box", borderRadius: 16, border: `3px solid ${C.sage}`, background: "rgba(135,168,158,0.10)",
        opacity: op(po, 1.4) * o, transform: `scale(${(mix(1.04, 1, po) * mix(1, 1.02, clamp01(pr))).toFixed(4)})` }} />
      <div style={{ position: "absolute", left: FIELD.x, top: FIELD.y, width: FIELD.w, height: FIELD.h, boxSizing: "border-box", borderRadius: 18, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`,
        display: "flex", alignItems: "center", padding: "0 15px 0 26px", fontFamily: SANS, fontSize: 30, color: C.ink, whiteSpace: "nowrap", transformOrigin: "12% 0%",
        opacity: op(pf) * o, transform: `translateY(${((1 - pf) * -44 - pr * 30).toFixed(2)}px) scale(${(mix(0.6, 1, pf) * mix(1, 0.85, pr)).toFixed(4)})` }}>
        <span>{EDIT_TEXT.slice(0, n)}</span>
        <span style={{ display: "inline-block", width: 2.5, height: 34, marginLeft: 2, background: C.sageDark, opacity: t > TB.send ? 0 : typing || Math.floor(g / 15) % 2 === 0 ? 1 : 0 }} />
        <div style={{ flex: 1 }} />
        <div style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", background: C.ink, flex: "none", transform: `scale(${(1 - 0.08 * pb).toFixed(4)})` }}>
          <div style={{ position: "absolute", left: 14, top: 14, opacity: ar }}><Ico n="arrow" s={28} c="#FFFFFF" w={2.4} /></div>
          {sp > 0.001 && <div style={{ position: "absolute", left: 28, top: 28 }}><Spinner g={g} size={34} p={sp} color="#FFFFFF" /></div>}
        </div>
      </div>
    </>
  );
};

/* ---------- the two choice cards (780 × 590) ---------- */
const shell = (o = 1): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, width: CW, height: CH, borderRadius: 24, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, opacity: o });
const title: React.CSSProperties = { position: "absolute", left: 48, top: 30, fontFamily: SERIF, fontSize: 60, letterSpacing: "-0.025em", lineHeight: 1.2, color: C.ink, transformOrigin: "0% 100%" };
const MINI = { x: 152, y: 292, w: 208 };           // where the thumbnail packs down to (card px, centre; width)
const CardL: React.FC<{ g: number; box: number }> = ({ g, box }) => {
  const t = g / 30, fill = sine(lin(t, TB.bar, 0.6)), done = pop(g, TB.done, { dur: 0.4, over: 0.1 });
  return (
    <div style={{ position: "relative", width: CW, height: CH, fontFamily: SANS, color: C.ink }}>
      {box > 0.001 && <div style={shell(box)} />}
      <div style={{ ...title, ...arrive(pop(g, TB.split + 0.15, { dur: 0.6, over: 0.05 }), 36) }}>Download</div>
      <div style={{ position: "absolute", right: 48, top: 38, width: 64, height: 64, ...arrive(pop(g, TB.btn, { dur: 0.45, over: 0.09 }), 24, 0.7) }}>
        <div style={{ width: 64, height: 64, borderRadius: 17, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${(1 - 0.08 * press(g, TB.dl)).toFixed(4)}) rotate(${wobble(g, TB.dl + 0.2, 4, 0.6).toFixed(2)}deg)` }}>
          <Ico n="arrow" s={32} c="#FFFFFF" w={2.4} style={{ transform: "rotate(90deg)" }} /></div></div>
      {/* the file row the thumbnail packs into */}
      <div style={{ position: "absolute", left: 284, top: 236, fontSize: 46, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap", transformOrigin: "0% 100%", ...arrive(pop(g, TB.file, { dur: 0.5, over: 0.05 }), 30) }}>holmfysio.zip</div>
      <div style={{ position: "absolute", left: 284, top: 318, width: 448, height: 14, borderRadius: 7, background: "#ECE8E1", overflow: "hidden", ...arrive(pop(g, TB.file + 0.1, { dur: 0.5, over: 0.04 }), 30, 1) }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 7, background: C.sage, transformOrigin: "0% 50%", transform: `scaleX(${fill.toFixed(4)})` }} /></div>
      <div style={{ position: "absolute", left: 686, top: 242, width: 46, height: 46, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", opacity: op(done, 2), transform: `scale(${mix(0.5, 1, done).toFixed(4)})` }}><Ico n="check" s={30} c={C.white} w={3} /></div>
      <div style={{ position: "absolute", left: 48, top: 482, fontSize: 40, fontWeight: 500, letterSpacing: "-0.015em", whiteSpace: "nowrap", transformOrigin: "0% 100%", ...arrive(pop(g, TB.once, { dur: 0.55, over: 0.05 }), 36) }}>Én gang for alle</div>
    </div>
  );
};
const ADDR = "holmfysio.dk";
// one rolling digit column of the price: r 0..1(+) rolls 6 → 9; while it moves, two faint copies trail it (a soft
// vertical streak on the moving digit only; gone once it has landed, so the number is crisp)
const DIG = 96;
const Roll: React.FC<{ g: number; at: number }> = ({ g, at }) => {
  const r = pop(g, at, { dur: 0.72, over: 0.06 }), v = (pop(g + 0.5, at, { dur: 0.72, over: 0.06 }) - pop(g - 0.5, at, { dur: 0.72, over: 0.06 })) * 30 * DIG * 3;   // px/s, + = rising
  const stack = (dy: number, o: number, k: number) => o <= 0.01 ? null : (
    <span key={k} style={{ position: "absolute", left: 0, top: 0, opacity: o, transform: `translateY(${((1 - r) * DIG * 3 + dy).toFixed(2)}px)` }}>
      {["9", "8", "7", "6"].map((d, j) => <span key={j} style={{ position: "absolute", left: 0, top: -DIG * j }}>{d}</span>)}
    </span>);
  const s = clamp01(Math.abs(v) / 900), trail = Math.sign(v) * Math.min(26, Math.abs(v) * 0.022);
  return (
    <span style={{ display: "inline-block", position: "relative", height: DIG, opacity: op(r, 3) }}>
      <span style={{ visibility: "hidden" }}>9</span>
      {stack(trail * 1.0, 0.22 * s, 2)}{stack(trail * 0.5, 0.3 * s, 1)}{stack(0, 1, 0)}
    </span>
  );
};
const CardR: React.FC<{ g: number; box?: number }> = ({ g, box = 1 }) => {
  const t = g / 30, pc = pop(g, TB.ub, { dur: 0.42, over: 0.1 }), n = Math.floor(lin(t, TB.addr, 0.75) * ADDR.length), live = pop(g, TB.live, { dur: 0.4, over: 0.1 });
  const ring = lin(t, TB.ring, 1.0), ringE = 1 - Math.pow(1 - ring, 3);
  return (
    <div style={{ position: "relative", width: CW, height: CH, fontFamily: SANS, color: C.ink }}>
      {box > 0.001 && <div style={shell(box)} />}
      {/* the sage ring behind the price as it lands, clipped to the card */}
      {ring > 0 && ring < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 150 - 130, top: 510 - 130, width: 260, height: 260, borderRadius: "50%", boxSizing: "border-box", border: `${(2.5 - 1.2 * ringE).toFixed(2)}px solid ${C.sage}`,
          opacity: 0.5 * (1 - ringE) * clamp01(ring * 12), transform: `scale(${mix(0.45, 1.45, ringE).toFixed(4)})` }} /></div>}
      <div style={{ ...title, ...arrive(pop(g, TB.online, { dur: 0.6, over: 0.05 }), 36) }}>Online</div>
      <div style={{ position: "absolute", right: 48, top: 42, width: 344, height: 58, boxSizing: "border-box", padding: "0 20px 0 18px", borderRadius: 29, background: "#F1EEE8", display: "flex", alignItems: "center", gap: 10, fontSize: 29, fontWeight: 500, color: C.ink, whiteSpace: "nowrap",
        transformOrigin: "100% 100%", ...arrive(pop(g, TB.pill, { dur: 0.5, over: 0.07 }), 24, 0.9) }}>
        <Ico n="lock" s={25} c={C.sageDeep} w={2.4} /><span>{ADDR.slice(0, n)}</span>
        {n < ADDR.length && <span style={{ display: "inline-block", width: 2.5, height: 30, marginLeft: -6, background: C.sageDark }} />}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 22, color: C.sageDeep, opacity: op(live, 1.6), transform: `scale(${mix(0.7, 1, live).toFixed(4)})` }}><div style={{ width: 11, height: 11, borderRadius: "50%", background: C.sage }} />Live</div>
      </div>
      <div style={{ position: "absolute", left: 48, top: 462, height: DIG, overflow: "hidden", display: "flex", alignItems: "baseline", whiteSpace: "nowrap", fontFamily: SERIF, letterSpacing: "-0.025em", paddingRight: 8, fontSize: 78, lineHeight: `${DIG}px` }}>
        <Roll g={g} at={TB.roll} /><Roll g={g} at={TB.roll + 0.12} />
        <span style={{ display: "inline-block", marginLeft: 16, ...arrive(pop(g, TB.roll + 0.24, { dur: 0.55, over: 0.06 }), 60, 1) }}>kr.</span>
        <span style={{ display: "inline-block", fontSize: 38, color: C.muted, marginLeft: 12, ...arrive(pop(g, TB.md, { dur: 0.5, over: 0.06 }), 36, 1) }}>/md.</span>
      </div>
      <div style={{ position: "absolute", right: 48, top: 492, height: 48, display: "flex", alignItems: "center", gap: 13, fontSize: 34, fontWeight: 500, whiteSpace: "nowrap" }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", opacity: op(pc, 2), transform: `scale(${mix(0.5, 1, pc).toFixed(4)})` }}><Ico n="check" s={28} c={C.white} w={3} /></div>
        <span style={{ display: "inline-block", ...arrive(pop(g, TB.ub + 0.03, { dur: 0.5, over: 0.05 }), 24, 1) }}>Uden binding</span>
      </div>
    </div>
  );
};
const Thumb: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => <SiteQ q={TQ}><SiteWindow headline={DONE_HEADLINE} scroll={scroll} /></SiteQ>;

/* ---------- B4: the card divides like a cell ---------- */
// Both shells drawn as ONE gooey shape (the kit's "goo" filter: shapes that touch melt together) behind the cards'
// content: as the copy slides out, the inner corners round off and each card stretches a tongue (an ellipse) toward
// the other; the tongues meet in a soft hourglass neck that thins (neck 1 → 0) and snaps at TB.snap, then they recoil
// into their cards (recoil 0 → 1), the corners spring back and the real shells take over.
const GW = 2300, GH = 1000;
const CellSplit: React.FC<{ L: Pose; R: Pose; ri: number; neck: number; recoil: number; shadow: number }> = ({ L, R, ri, neck, recoil, shadow }) => {
  const X0 = (L.x + R.x) / 2, Y0 = L.y;
  const lx = (x: number) => x - X0 + GW / 2, ly = (y: number) => y - Y0 + GH / 2;
  const box = (cd: Pose, rad: string) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, background: C.white, borderRadius: rad, transformOrigin: "50% 50%",
      transform: `translate(${(lx(cd.x) - CW / 2).toFixed(2)}px, ${(ly(cd.y) - CH / 2).toFixed(2)}px) scale(${cd.s.toFixed(5)})` }} />);
  const Lr = L.x + (CW / 2) * L.s, Rl = R.x - (CW / 2) * R.s, half = Math.max(0, (Rl - Lr) / 2);
  const reach = mix(half + 16 + 30 * neck - 28 * (1 - neck), -46, recoil), ry = (CH / 2) * L.s * (0.2 + 0.8 * neck), IN = 40;
  const tongue = (edge: number, dir: number) => { const rx = Math.max(1, reach + IN), cx = edge + dir * (reach - rx); return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 200, height: 200, borderRadius: "50%", background: C.white, transformOrigin: "50% 50%",
      transform: `translate(${(lx(cx) - 100).toFixed(2)}px, ${(ly(Y0) - 100).toFixed(2)}px) scale(${(rx / 100).toFixed(4)}, ${(ry / 100).toFixed(4)})` }} />); };
  const a = shadow;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: GW, height: GH, filter: `drop-shadow(0 0 1px rgba(170,162,150,${(0.55 * a).toFixed(3)})) drop-shadow(0 0 30px rgba(26,22,20,${(0.1 * a).toFixed(3)})) drop-shadow(0 0 90px rgba(26,22,20,${(0.12 * a).toFixed(3)}))` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: GW, height: GH, filter: "url(#goo)" }}>
        {box(L, `24px ${ri.toFixed(1)}px ${ri.toFixed(1)}px 24px`)}
        {box(R, `${ri.toFixed(1)}px 24px 24px ${ri.toFixed(1)}px`)}
        {reach > -IN + 2 && ry > 1 && <>{tongue(Lr, 1)}{tongue(Rl, -1)}</>}
      </div>
    </div>
  );
};

/* ---------- the layout at g (poses, progress values, the hand's keys) ---------- */
const HK = 1.3;                                    // the hosting card is laid out at this scale (it shows at 1.25×)
const layout = (g: number) => {
  const t = g / 30, p = pz(ZS, t), pH = pz(ZH, t);

  // camera-like (clean sine, never bounced): the pull-back to the whole page (B1), the push close on the hero (B2)
  const m1 = sine(lin(t, TB.grow, 1.86)), m2 = smoother(lin(t, TB.back, 1.9));
  const hg = Math.min(1.025, pop(g, TB.grow, { dur: 1.55, over: 0.03 }));                         // the window's height morph pops
  const h = SH + (HT - SH) * hg * (1 - m2);
  const S2 = mix(1.3, 1.42, sine((t - 24.4) / 2.85)), P2 = wp(25.5, 575 + (SW / 2 - 358) * S2, 503 + (SH / 2 - 341) * S2, S2);   // the headline + field held at (575, 503)

  // the cards: the thumbnail card pops in (B3), divides (B4); the one stepping back dims, shrinks and sinks a little
  const pc = pop(g, TB.card, { dur: 0.7, over: 0.03 }), grow = mix(0.9, 1, pc);
  const sp = pop(soften(g, TB.split - 0.12, 0.24), TB.split - 0.12, { dur: 0.8, over: 0.03 }), wb = 1 + wobble(g, TB.snap, 0.012, 0.6);
  const dR = pop(g, TB.cells + 0.12, { dur: 0.7, over: 0.03 }) - pop(g, TB.swap, { dur: 0.7, over: 0.03 });
  const dL = pop(g, TB.swap, { dur: 0.7, over: 0.03 }) - pop(g, 34.3, { dur: 0.8, over: 0.03 });   // 1 = stepped back
  const lv = 1 - popOut(soften(g, TB.leave - 0.2, 0.4), TB.leave - 0.2, { dur: 1.0 });                                               // the left card leaves downward
  const cL0 = lp(C3, C4L, sp), cR0 = lp(C3, C4R, sp), prs = press(g, TB.pick);
  const cL: Pose = { x: cL0.x, y: cL0.y + (14 * dL + 420 * lv) * cL0.s, s: cL0.s * grow * wb * (1 - 0.1 * dL) }, oL = op(pc, 1.6) * (1 - 0.42 * dL) * (1 - clamp01(lv * 1.7));
  const cR: Pose = { x: cR0.x, y: cR0.y + 14 * dR * cR0.s, s: cR0.s * grow * wb * (1 - 0.1 * dR) * (1 - 0.015 * prs) }, oR = 1 - 0.42 * dR;
  const inCard = (cd: Pose, lx: number, ly: number, w: number): Pose => ({ x: cd.x + lx * cd.s, y: cd.y + ly * cd.s, s: (w / SW) * cd.s });
  const pk = pop(g, TB.pack, { dur: 0.85, over: 0.04 });                                            // the thumbnail packs down into the file row
  const tL = inCard(cL, mix(0, MINI.x - CW / 2, pk), mix(TY, MINI.y - CH / 2, pk), mix(TW, MINI.w, pk));
  const scroll = 640 * pop(g, 31.6, { dur: 3.2, over: 0.015 });
  // the cell division: inner corners round off and spring back, the neck pinches to the snap, the real shells return
  const ri = t < TB.snap ? mix(24, 100, sine(lin(t, TB.split + 0.25, 0.4))) : mix(100, 24, pop(g, TB.snap - 0.04, { dur: 0.3, over: 0.02 }));
  const neck = t < TB.pinch ? 1 : 1 - Math.pow(lin(t, TB.pinch, TB.snap - TB.pinch), 1.4), recoil = t < TB.snap ? 0 : pop(g, TB.snap, { dur: 0.26, over: 0.08 });
  const cells = t < TB.split ? 1 : t < TB.snap ? 1 - sine(lin(t, TB.split, 0.12)) : sine(lin(t, TB.cells, 0.12));   // the real shells' strength
  const goo = t >= TB.split && t < TB.cells + 0.12;

  // the site: h1 pose → whole page (B1) → close on the hero (B2) → shrinks into the thumbnail of the left card (B3)
  const m3 = popRamp(g, TB.shrink, 1.25, { dur: 1.35, over: 0.03 });
  let site = lp(lp(P0, P1, m1), P2, m2);
  if (t > TB.shrink) site = lp(site, tL, m3);
  const small = t >= 28.75, sq = t < TB.back ? 1 : site.s * p > 0.9 ? 1.6 : 0.72;

  // the hosting card: grows out of the right card (one box) to 1.17×, a slow push, then back to the hand-off pose
  const TM = TB.morph, m6 = pop(soften(g, TM - 0.15, 0.4), TM - 0.15, { dur: 1.4, over: 0.03 }), morph = t >= TM - 0.15;
  const Sscr = mix(mix(1.17, 1.27, sine((t - 37.4) / 5.1)), pH, sine(lin(t, 42.5, 1.6))), tgt = Sscr / pH;
  const hx = mix((cR.x * p) / pH, 0, m6), hy = mix((cR.y * p) / pH, 0, m6);
  const hsx = mix((CW * cR.s * p) / (CARD.w * pH), tgt, m6), hsy = mix((CH * cR.s * p) / (CARD.h * pH), tgt, m6);
  const ha = sine(lin(t, 36.55, 0.55));                                      // the hosting content fades in
  const rScr = 24 * mix(cR.s * p, Sscr, clamp01(m6)), rad = `${(rScr / (hsx * pH)).toFixed(2)}px / ${(rScr / (hsy * pH)).toFixed(2)}px`;
  const tintO = 1 - sine(lin(t, 42.5, 0.9));
  const row = (i: number): HRow => {
    const n = CARD_ROWS[i][1].length, ty = lin(t, TB.rowsType[i], TB.rowsLen[i]), on = TB.rowsOn[i], at = TB.set + 0.1 + i * 0.12;
    return { in: pop(g, TB.rowsIn[i], { dur: 0.55, over: 0.05 }), chars: Math.floor(ty * n), caret: t > TB.rowsType[i] - 0.2 && ty < 1,
      a: pop(g, on, { dur: 0.45, over: 0.05 }), draw: sine(lin(t, on + 0.14, 0.38)), ck: pop(g, on + 0.02, { dur: 0.4, over: 0.12 }),
      tint: pop(g, on - 0.05, { dur: 0.95, over: 0.015 }), tintO: tintO * (1 - 0.5 * sine(lin(t, on + 0.9, 0.9))),
      pulse: pop(g, at, { dur: 0.2, over: 0.1 }) - pop(g, at + 0.18, { dur: 0.3, over: 0.12 }) };
  };
  const hrows = [row(0), row(1), row(2)];
  const price = pop(g, TB.price, { dur: 0.6, over: 0.03 }), spin = pop(g, 36.9, { dur: 0.5, over: 0.06 }) * popOut(g, TB.price, { dur: 0.45 });
  const oldO = 1 - sine(lin(t, TM, 0.45)), k6 = morph ? (hsx * CARD.w * pH) / (CW * cR.s * p) : 1;   // the old content rides the box and fades
  const rc: Pose = morph ? { x: (hx * pH) / p, y: (hy * pH) / p, s: cR.s * k6 } : cR;
  const tR = inCard(rc, 0, TY, TW);

  // the chip on the window's top edge
  const pChip = pop(g, TB.chip, { dur: 0.55, over: 0.08 }), oChip = 1 - popOut(g, TB.chipOut, { dur: 0.45 }), chipS = wp(22.5, 960, 540, 1).s;

  // the hand cursor (screen px of the fingertip); targets are re-evaluated every frame so it stays on moving things
  const sitePt = (x: number, y: number) => ({ x: 960 + (site.x + (x - SW / 2) * site.s) * p, y: 540 + (site.y + (y - SH / 2) * site.s) * p });
  const cardPt = (cd: Pose, x: number, y: number) => ({ x: 960 + (cd.x + (x - CW / 2) * cd.s) * p, y: 540 + (cd.y + (y - CH / 2) * cd.s) * p });
  const hostPt = (x: number, y: number) => ({ x: 960 + (hx + (x - CARD.w / 2) * hsx) * pH, y: 540 + (hy + (y - CARD.h / 2) * hsy) * pH });
  const keys: HandKey[] = [
    { at: 20.5, x: 1150, y: 1290 },
    { at: TB.hl, ...sitePt(470, 322), click: true },                         // the headline
    { at: TB.send, ...sitePt(SEND.x, SEND.y + 4), click: true },             // send
    { at: 27.55, x: 300, y: 1250, early: 0 },                                // nothing to do in B3: leaves down-left (it comes back from there, clear of the cell division)
    { at: TB.dl, ...cardPt(cL, 700, 70), click: true },                      // the download button
    { at: 32.3, ...cardPt(cR, 680, 585), early: 0 },                         // parks at the Online card's lower right corner, clear of the price
    { at: TB.ub, ...cardPt(cR, 498, 516), click: true },                     // the "Uden binding" check
    { at: TB.pick, ...cardPt(cR, 470, 300), click: true },                   // the Online card
    { at: 37.8, x: 1640, y: 1300, early: 0 },                                // leaves downward
    { at: TB.set, ...hostPt(840, 570), click: true },                        // "Sæt online"
    { at: 44.32, x: 1330, y: 1140, early: 0 },                               // gone before the hand-off
  ];
  const size = t < 27.5 ? 190 : 170;
  return { t, p, pH, h, site, small, sq, cL, cR, oL, oR, tL, tR, rc, scroll, ri, neck, recoil, cells, goo, morph, hx, hy, hsx, hsy, ha, rad, hrows, price, spin, oldO, pChip, oChip, chipS, keys, size };
};
// the hand's keys and size at g (for tools: a hand-plan check without rendering)
export const handB = (g: number) => { const L = layout(g); return { keys: L.keys, size: L.size }; };

/* ---------- the scene ---------- */
export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h1") + HANDOFF_HALF) return <Handoff1 g={g} />;
  if (g >= f("h2") - HANDOFF_HALF) return <Handoff2 g={g} />;
  const L = layout(g), { t, p, pH, site, cL, cR, rc, tL, tR } = L, c = cam({ z: cz(t) });
  const hand = handAt(g, L.keys, { size: L.size });
  const sheenU = smoother(lin(t, TB.sheen, 1.45));
  const settled = t > 44.15;
  return (
    <>
      <Stage3D cam={c}>
        {/* the line above the cards (uncovered as the window shrinks away) */}
        {t > 27.6 && t < 37.2 && (() => { const Lp = wp(34, 960, 215, 0.9), q = 1 - popOut(soften(g, TB.pick - 0.15, 0.3), TB.pick - 0.15, { dur: 0.75 }); return (
          <Plane x={Lp.x} y={Lp.y - 90 * q * Lp.s} z={ZS} w={2} h={2} scale={Lp.s} opacity={clamp01(1 - q)}><div style={{ position: "absolute", left: 1, top: 1 }}>
            <Kinetic g={g} size={124} items={[{ t: "Du", at: 27.68 }, { t: "vælger", at: 27.93 }, { t: "selv.", at: 28.24, accent: true }]} />
          </div></Plane>); })()}

        {/* B4: the two shells as one gooey shape while the card divides (behind all the cards' content) */}
        {L.goo && (() => { const k = pz(ZS, t) / pz(ZS - 1, t); return (
          <Plane x={((cL.x + cR.x) / 2) * k} y={cL.y * k} z={ZS - 1} w={GW} h={GH} scale={k}>
            <CellSplit L={cL} R={cR} ri={L.ri} neck={L.neck} recoil={L.recoil} shadow={1 - L.cells} />
          </Plane>); })()}

        {/* the right card (the copy) and its thumbnail */}
        {t >= TB.split && !L.morph && <Plane x={cR.x} y={cR.y} z={ZS} w={CW} h={CH} scale={cR.s} opacity={L.oR}><CardR g={g} box={L.cells} /></Plane>}
        {t >= TB.split && !L.morph && <Plane x={tR.x} y={tR.y} z={ZS + 1} w={SW * TQ} h={SH * TQ} scale={tR.s / TQ} opacity={L.oR}><Thumb scroll={L.scroll} /></Plane>}

        {/* the left card and the site (the window, then its thumbnail) */}
        {t >= TB.card && L.oL > 0.001 && <Plane x={cL.x} y={cL.y} z={ZS + 2} w={CW} h={CH} scale={cL.s} opacity={L.oL}><CardL g={g} box={L.cells} /></Plane>}
        {!L.small && (
          <Plane x={site.x} y={site.y} z={ZS + 3} w={SW * L.sq} h={SH * L.sq} scale={site.s / L.sq}>
            <SiteQ q={L.sq}>
              {L.h > SH + 0.02 ? <SiteTall h={L.h} /> : <SiteWindow headline={t > 25.0 ? <Rewrite g={g} /> : undefined} />}
              <Sheen h={Math.max(SH, L.h)} u={sheenU} />
              <Edit g={g} />
            </SiteQ>
          </Plane>
        )}
        {L.small && L.oL > 0.001 && <Plane x={tL.x} y={tL.y} z={ZS + 3} w={SW * TQ} h={SH * TQ} scale={tL.s / TQ} opacity={L.oL}><Thumb /></Plane>}

        {/* B1: the chip on the window's top edge */}
        {L.pChip > 0 && L.oChip < 0.999 && (
          <Plane x={site.x} y={site.y - (SH / 2) * site.s + ((1 - L.pChip) * 34 - L.oChip * 30) * L.chipS} z={ZS + 4} w={2} h={2} scale={L.chipS * mix(0.9, 1, L.pChip)} opacity={op(L.pChip, 1.6) * clamp01(1 - L.oChip)}>
            <div style={{ position: "absolute", left: 1, top: 1, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, height: 62, padding: "0 30px 0 26px", borderRadius: 31, background: C.white,
              boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, fontFamily: SANS, fontWeight: 500, fontSize: 32, color: C.ink, whiteSpace: "nowrap" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.sage, transform: `scale(${(1 + wobble(g, TB.chip + 0.4, 0.25, 0.5)).toFixed(4)})` }} />Gratis forhåndsvisning</div>
          </Plane>
        )}

        {/* B6–B7: the box grows into the hosting card */}
        {L.morph && !settled && (
          <Plane x={L.hx} y={L.hy} z={ZH} w={CARD.w * HK} h={CARD.h * HK} scale={L.hsy / HK}>
            <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w * HK, height: CARD.h * HK, transform: `scaleX(${(L.hsx / L.hsy).toFixed(5)})`, transformOrigin: "50% 50%" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, transform: `scale(${HK})`, transformOrigin: "0 0" }}>
                {L.ha < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: L.rad, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, opacity: 1 - L.ha }} />}
                {L.ha < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: L.rad, background: C.white }} />}
                <div style={{ position: "absolute", inset: 0, opacity: L.ha }}><HostCard g={g} rows={L.hrows} price={L.price} spin={L.spin} press={press(g, TB.set)} /></div>
              </div>
            </div>
          </Plane>
        )}
        {/* the old content of the right card rides the growing box (in front of it) and fades */}
        {L.morph && L.oldO > 0 && <Plane x={L.hx} y={L.hy} z={ZH + 1} w={CW} h={CH} scale={(rc.s * p) / pH} opacity={L.oldO}><CardR g={g} box={0} /></Plane>}
        {L.morph && L.oldO > 0 && <Plane x={L.hx} y={L.hy + (TY * rc.s * p) / pH} z={ZH + 2} w={SW * TQ} h={SH * TQ} scale={(tR.s * p) / pH / TQ} opacity={L.oldO}><Thumb scroll={L.scroll} /></Plane>}
        {settled && <Plane x={0} y={0} z={ZH} w={CARD.w} h={CARD.h}><HostingCard g={g} rows={3} active={[1, 1, 1]} price={1} /></Plane>}
      </Stage3D>
      {t > 22.5 && t < 44.35 && <Hand {...hand} opacity={1 - lin(t, 44.24, 0.1)} />}
    </>
  );
};
