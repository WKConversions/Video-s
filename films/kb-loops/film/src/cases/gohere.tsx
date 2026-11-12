// gohere: "Two days, two wipes" (../cases/gohere.md).
// One browser window ("gohere.app") holds GoHere's old site: grey, crooked blocks bobbing out of line, the product tiny
// and greyed in a corner, a red padlock the cursor clicks in vain and a red search badge that shakes "nothing found".
// The K.B tile drops onto the window's edge (the window glides left, a K.B calendar chip pops in on the right: "1") and
// becomes a squeegee blade. Day 1 it wipes left → right and the new GoHere site appears in its wake (FLOURISH: the old
// site smears sideways behind the blade, a horizontal motion smear with a cyan wet edge that dissolves into the new
// design); the calendar rolls to "2"; Day 2 it wipes back and leaves the CMS (dashed edit outlines, mint pencils), then
// a search card with its two channels grows out of the tile. The chip grows into a big calendar page: "2 days". Then it
// shrinks away, the blocks tilt and grey back into the old site one by one and the tile lifts off: the opening again.
import React from "react";
import { Easing, Img, staticFile } from "remotion";
import { Frame, useT, seg, pop, popOut, clamp01, lerp, SOFT } from "../loop";
import { C, KBTile, SHADOW } from "../kb";

// ---------- GoHere's brand (gohere.app CSS) and the old site's greys ----------
const GH = { navy: "#141430", mint: "#A3D2C2", sky: "#86ACD9", muted: "#4B5372", border: "#E6E9F2", ground: "#EEF1F7", bar: "#C9CEDC" };
const G1 = "#B3BAC4", G2 = "#CBD0D7", G3 = "#DCE0E5", G4 = "#AAB1BB";
const pic = (f: string) => staticFile("cases/gohere/" + f);
const TAU = Math.PI * 2;
// glide: for the big surfaces (the window, the calendar): an ease-in start with no kick, a small overshoot that stops and
// eases back (velocity stays continuous, so nothing reads as a jolt), at rest exactly at at + dur.
const sstep = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
const glide = (t: number, at: number, dur: number, over = 0.03) => {
  const u = (t - at) / dur, P = 0.68;
  return u <= 0 ? 0 : u < P ? (1 + over) * sstep(u / P) : 1 + over * (1 - sstep((u - P) / (1 - P)));
};
const SWEEP = Easing.bezier(0.45, 0, 0.55, 1);

// ---------- layout ----------
const BW = 1140, BH = 672, TB = 58, CW = BW, CH = BH - TB, BY = 118, MIDY = CH / 2;
const BX_C = (1920 - BW) / 2, BX_L = 200; // the window centred, and shifted left to make room for the calendar
const CAL = { x: 1580, y0: 236, y1: 478, w: 340, h: 392, s0: 0.36 };
const BAR_W = 44, BAR_H = CH - 28, TILE = 108;
const CAP_Y = 884;

// ---------- timing (s) ----------
const T = {
  cur: 0.2, click: 0.72, lock: 0.78, click2: 1.36, srch: 1.42, curOut: 1.75,
  drop: 2.15, shift: 1.7, probOut: 2.45, chip: 2.55,
  st1: 2.7, s1a: 2.95, s1b: 4.05, ct1: 4.0, solIn: 4.2, flip: 4.3,
  st2: 4.45, s2a: 4.7, s2b: 5.7, ct2: 5.65, card: 5.95, solOut: 6.0,
  grow: 6.1, resIn: 6.35, resOut: 8.35, shrink: 8.1, cmsOut: 8.22, cardOut: 8.5, morph: 8.55,
  chipOut: 8.85, kbOut: 8.9, shiftBack: 8.55, probIn: 9.15, curIn: 9.3,
};

// the blade's two wipes (bar centre, content x)
const x1 = (t: number) => lerp(BAR_W / 2, CW - BAR_W / 2, seg(t, T.s1a, T.s1b, SWEEP));
const x2 = (t: number) => lerp(CW - BAR_W / 2, BAR_W / 2, seg(t, T.s2a, T.s2b, SWEEP));
const vel = (f: (t: number) => number, t: number) => (f(t + 1 / 240) - f(t - 1 / 240)) * 120;
const VMAX = (() => { let m = 1; for (let t = T.s1a; t < T.s1b; t += 0.005) m = Math.max(m, Math.abs(vel(x1, t))); return m; })();
const crossAt = (x: number) => { let a = T.s2a, b = T.s2b; for (let n = 0; n < 30; n++) { const m = (a + b) / 2; if (x2(m) > x) a = m; else b = m; } return a; };

// ---------- colour helpers ----------
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixC = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(Math.min(255, Math.max(0, lerp(v, B[i], k))))).join(",")})`;
};

// ---------- the site: every block has a new state (k = 0) and an old state (k = 1) ----------
type S = { x: number; y: number; w: number; h: number; c: string; rad: number; r: number; op: number };
type Kind = "rect" | "logo" | "wash" | "card" | "phone" | "band" | "lock" | "search";
type B = { k: Kind; n: S; o: S };
const R = (x: number, y: number, w: number, h: number, c: string, rad = 0, r = 0, op = 1): S => ({ x, y, w, h, c, rad, r, op });
const NAVO = [R(290, 26, 96, 12, G2, 2, -4), R(410, 44, 54, 12, G2, 2, 3), R(495, 22, 120, 12, G2, 2, -2), R(665, 40, 70, 12, G2, 2, 5)];
const PARN = [470, 440, 360], PARO = [R(38, 296, 540, 13, G2, 2, 1.5), R(112, 324, 290, 13, G2, 2, -2.5), R(54, 352, 590, 13, G2, 2, 1)];
const BLOCKS: B[] = [
  { k: "wash", n: R(0, 82, CW, CH - 82, "#FFFFFF"), o: R(0, 82, CW, CH - 82, "#FFFFFF", 0, 0, 0) },
  { k: "rect", n: R(0, 80, CW, 2, GH.border), o: R(-10, 92, CW + 20, 3, G3, 0, 0.8) },
  { k: "logo", n: R(36, 22, 152, 36, "#FFFFFF"), o: R(26, 30, 100, 24, "#FFFFFF", 0, -3, 0.45) },
  ...NAVO.map((o, i): B => ({ k: "rect", n: R(440 + i * 85, 36, 60, 10, GH.bar, 5), o })),
  { k: "rect", n: R(954, 20, 150, 42, GH.navy, 21), o: R(915, 28, 118, 32, G4, 4, 4) },
  { k: "rect", n: R(56, 124, 190, 30, GH.ground, 15), o: R(90, 118, 128, 26, G3, 3, -5) },
  { k: "rect", n: R(56, 176, 450, 54, GH.navy, 14), o: R(122, 166, 340, 34, G1, 4, 3) },
  { k: "rect", n: R(56, 244, 320, 54, GH.navy, 14), o: R(60, 214, 410, 30, G1, 4, -2) },
  ...PARO.map((o, i): B => ({ k: "rect", n: R(56, 326 + i * 26, PARN[i], 14, GH.bar, 7), o })),
  { k: "rect", n: R(56, 426, 166, 54, GH.navy, 27), o: R(276, 420, 116, 40, G4, 4, -7) },
  { k: "rect", n: R(238, 426, 176, 54, GH.mint, 27), o: R(448, 466, 96, 34, G4, 4, 6) },
  { k: "card", n: R(600, 108, 486, 424, "#FFFFFF", 26), o: R(570, 150, 456, 360, G3, 6, 2.5) },
  { k: "phone", n: R(748, 124, 190, 380, "#FFFFFF"), o: R(885, 380, 70, 140, "#FFFFFF", 0, 14, 0.55) },
  { k: "band", n: R(0, 556, CW, 58, GH.navy), o: R(-6, 566, CW + 12, 40, "#DADDE2", 0, 1.2) },
  { k: "rect", n: R(1078, 260, 0, 0, G3, 6, 0, 0), o: R(1040, 110, 76, 300, G3, 6, -1.5) },
  { k: "rect", n: R(440, 523, 0, 0, G3, 4, 0, 0), o: R(360, 500, 160, 46, G3, 4, -3) },
  { k: "lock", n: R(575, 300, 0, 0, C.warn, 0, 0, 0), o: R(575, 300, 54, 54, C.warn) },
  { k: "search", n: R(830, 40, 0, 0, C.warn, 0, 0, 0), o: R(830, 40, 50, 50, C.warn) },
];
const mixS = (n: S, o: S, k: number): S => ({
  x: lerp(n.x, o.x, k), y: lerp(n.y, o.y, k), w: Math.max(0, lerp(n.w, o.w, k)), h: Math.max(0, lerp(n.h, o.h, k)),
  c: mixC(n.c, o.c, k), rad: lerp(n.rad, o.rad, k), r: lerp(n.r, o.r, k), op: clamp01(lerp(n.op, o.op, k)),
});
// the phone's screens during the result hold (crossfades: home → bucket list → map → home)
const SCREENS = ["app-home.png", "app-bucketlist.png", "app-map.png", "app-home.png"];
const SWAPS = [6.95, 7.55, 8.15];
const screenW = (t: number) => [1, ...SWAPS.map((a) => seg(t, a, a + 0.32))];

// ---------- icons ----------
const Ico: React.FC<{ d: "lock" | "search" | "pencil" | "spark" | "broken"; size: number; color?: string }> = ({ d, size, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    {d === "lock" && <><rect x="5.5" y="10.5" width="13" height="10" rx="2.2" fill={color} /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke={color} strokeWidth="2.3" fill="none" strokeLinecap="round" /></>}
    {d === "search" && <><circle cx="10.5" cy="10.5" r="5.3" stroke={color} strokeWidth="2.4" fill="none" /><path d="M14.6 14.6l4.6 4.6" stroke={color} strokeWidth="2.6" strokeLinecap="round" /></>}
    {d === "pencil" && <><path d="M5 19.2l1.1-4.3L15.4 5.6a2.1 2.1 0 0 1 3 3l-9.3 9.3z" fill={color} /><path d="M13.6 7.4l3 3" stroke={GH.mint} strokeWidth="1.4" /></>}
    {d === "spark" && <path d="M12 2.8c.7 4.6 2.9 6.8 7.4 7.4-4.5.7-6.7 2.9-7.4 7.4-.7-4.5-2.9-6.7-7.4-7.4 4.5-.6 6.7-2.8 7.4-7.4z" fill={color} />}
    {d === "broken" && <><rect x="3" y="4.5" width="18" height="15" rx="2" stroke={color} strokeWidth="1.5" fill="none" /><path d="M5 17l4.6-5.4 3.6 3.8 2.2-2.2 3.4 3.8" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" /><circle cx="16" cy="8.8" r="1.6" fill={color} /><path d="M2 21L22 3" stroke={color} strokeWidth="1.5" /></>}
  </svg>
);

// ---------- one block at morph state k ----------
const Block: React.FC<{ b: B; k: number; i: number; t: number }> = ({ b, k, i, t }) => {
  const s = mixS(b.n, b.o, k), kk = clamp01(k);
  let dx = kk * 9 * Math.sin(TAU * (t / 2.5 + i * 0.23)), dy = kk * 8 * Math.sin(TAU * (t / 2.5 + i * 0.17) + 1), sc = 1;
  let rot = s.r + kk * 2.2 * Math.sin(TAU * (t / 2.5 + i * 0.29));
  if (b.k === "lock" && t > T.lock && t < T.lock + 0.55) { const u = (t - T.lock) / 0.55; rot += 16 * Math.sin(TAU * 2.5 * u) * (1 - u); sc = 1 + 0.14 * Math.sin(Math.PI * Math.min(1, u * 2)); }
  if (b.k === "search" && t > T.srch && t < T.srch + 0.6) { const u = (t - T.srch) / 0.6; dx += 10 * Math.sin(TAU * 3 * u) * (1 - u); sc = 1 + 0.12 * Math.sin(Math.PI * Math.min(1, u * 2)); }
  if (b.k === "phone") {
    dy += (1 - kk) * 7 * Math.sin(TAU * (t / 2.5 + 0.4));
    sc = 1 - 0.035 * SWAPS.reduce((m, a) => m + Math.sin(Math.PI * clamp01((t - a + 0.06) / 0.4)), 0); // a little tap at each swap
  }
  const centred = b.k === "lock" || b.k === "search";
  const box: React.CSSProperties = {
    position: "absolute", left: (centred ? s.x - s.w / 2 : s.x) + dx, top: (centred ? s.y - s.h / 2 : s.y) + dy, width: s.w, height: s.h,
    transform: `rotate(${rot}deg) scale(${sc})`, opacity: s.op, borderRadius: s.rad,
  };
  switch (b.k) {
    case "rect": return <div style={{ ...box, background: s.c }} />;
    case "logo": return <Img src={pic("gohere-logo.png")} style={{ ...box, objectFit: "contain", filter: `grayscale(${kk})` }} />;
    case "wash": {
      const a = TAU * (t / 10);
      return <div style={{ ...box, opacity: 1 - kk, background: `radial-gradient(circle at ${14 + 4 * Math.sin(a)}% ${24 + 6 * Math.cos(a)}%, rgba(163,210,194,0.42), rgba(163,210,194,0) 46%), radial-gradient(circle at ${88 + 3 * Math.cos(a)}% ${70 + 5 * Math.sin(a)}%, rgba(134,172,217,0.30), rgba(134,172,217,0) 50%)` }} />;
    }
    case "card": {
      const a = TAU * (t / 5);
      return (
        <div style={{ ...box, background: s.c, overflow: "hidden", boxShadow: `0 30px 60px -30px rgba(20,20,48,${0.35 * (1 - kk)}), 0 0 0 1px rgba(230,233,242,${1 - kk})` }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - kk, background: `radial-gradient(circle at ${22 + 6 * Math.sin(a)}% ${28 + 5 * Math.cos(a)}%, rgba(163,210,194,0.75), rgba(163,210,194,0) 42%), radial-gradient(circle at ${80 + 5 * Math.cos(a)}% ${78 + 4 * Math.sin(a)}%, rgba(134,172,217,0.6), rgba(134,172,217,0) 44%)` }} />
          <div style={{ position: "absolute", left: "50%", top: "42%", transform: "translate(-50%,-50%)", opacity: kk }}><Ico d="broken" size={96} color={G4} /></div>
        </div>
      );
    }
    case "phone": {
      const w = screenW(t);
      return (
        <div style={{ ...box, filter: `grayscale(${kk})` }}>
          {SCREENS.map((f, j) => (j === 0 || w[j] > 0) && (
            <Img key={j} src={pic(f)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: j ? clamp01(w[j] * 1.6) : 1,
              clipPath: j ? "inset(3.4% 6.9% 3.4% 6.9% round 9%)" : undefined, transform: j ? `translateY(${(1 - w[j]) * 22}px) scale(${1 + 0.05 * (1 - w[j])})` : undefined }} />
          ))}
        </div>
      );
    }
    case "band":
      return (
        <div style={{ ...box, background: s.c, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 60px" }}>
          {[96, 72, 110, 80, 92].map((w, j) => <div key={j} style={{ width: w, height: 12, borderRadius: 6, background: `rgba(255,255,255,${0.5 * (1 - kk)})` }} />)}
        </div>
      );
    case "lock": case "search":
      return (
        <div style={{ ...box, borderRadius: 999, background: s.c, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 22px -10px rgba(229,72,77,0.7)" }}>
          {[0, 0.5].map((ph) => { const u = (t / 1.25 + ph + (b.k === "search" ? 0.25 : 0)) % 1; return (
            <div key={ph} style={{ position: "absolute", inset: 0, borderRadius: 999, border: `4px solid ${C.warn}`, opacity: 0.6 * (1 - u) * kk, transform: `scale(${1 + 1.9 * SOFT(u)})` }} />
          ); })}
          <Ico d={b.k} size={s.w * 0.56} />
        </div>
      );
  }
};
const Site: React.FC<{ t: number; k: (i: number) => number }> = ({ t, k }) => (
  <div style={{ position: "absolute", inset: 0 }}>{BLOCKS.map((b, i) => <Block key={i} b={b} k={k(i)} i={i} t={t} />)}</div>
);

// ---------- the CMS layer Day 2 leaves behind: dashed edit outlines + mint pencil badges ----------
const CMS = [
  { x: 42, y: 162, w: 478, h: 148 },
  { x: 42, y: 316, w: 498, h: 88 },
  { x: 586, y: 94, w: 514, h: 452 },
].map((r) => ({ ...r, at: crossAt(r.x + r.w) }));
const CmsLayer: React.FC<{ t: number }> = ({ t }) => (
  <>
    {CMS.map((r, j) => {
      const e = popOut(t, T.cmsOut + j * 0.1, { dur: 0.42 });
      if (t < T.s2a || e <= 0.001) return null;
      const bp = pop(t, r.at, { dur: 0.42, over: 0.08 });
      const wa = 6.5 + j * 0.6, wig = t > wa && t < wa + 0.5 ? 16 * Math.sin(TAU * 1.5 * (t - wa) / 0.5) * (1 - (t - wa) / 0.5) : 0;
      return (
        <React.Fragment key={j}>
          <svg width={r.w + 8} height={r.h + 8} style={{ position: "absolute", left: r.x - 4, top: r.y - 4, opacity: clamp01(e * 1.5), transform: `scale(${lerp(0.96, 1, e)})` }}>
            <rect x={4} y={4} width={r.w} height={r.h} rx={18} fill="rgba(56,200,255,0.05)" stroke={C.cyan} strokeWidth={3} strokeDasharray="12 9" strokeDashoffset={-t * 30} />
          </svg>
          <div style={{ position: "absolute", left: r.x + r.w - 23, top: r.y - 23, width: 46, height: 46, borderRadius: 999, background: GH.mint,
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 22px -10px rgba(20,20,48,0.55)",
            transform: `scale(${Math.max(0, bp * e)}) rotate(${(1 - clamp01(bp)) * -40 + wig}deg)` }}>
            <Ico d="pencil" size={26} color={GH.navy} />
          </div>
        </React.Fragment>
      );
    })}
  </>
);

// ---------- the K.B tile / blade ----------
type TS = { x: number; y: number; w: number; h: number; letters: number; bar: number; skew: number; op: number; sc: number; dir: number; vn: number };
const tileState = (t: number): TS | null => {
  if (t < T.drop || t > T.kbOut + 0.42) return null;
  const d = pop(t, T.drop, { dur: 0.55, over: 0.07 });
  let x = 2, y = lerp(MIDY - 220, MIDY, d), w = TILE, h = TILE, letters = 1, bar = 0, dir = 0, vn = 0;
  let op = clamp01((t - T.drop) / 0.15), sc = lerp(0.6, 1, d);
  if (t >= T.st1) { const s = pop(t, T.st1, { dur: 0.38, over: 0.04 }); x = lerp(2, BAR_W / 2, s); w = lerp(TILE, BAR_W, s); h = lerp(TILE, BAR_H, s); letters = 1 - seg(t, T.st1, T.st1 + 0.16); bar = clamp01(s); }
  if (t >= T.s1a) { x = x1(t); dir = 1; vn = Math.abs(vel(x1, t)) / VMAX; }
  if (t >= T.ct1) { const c = pop(t, T.ct1, { dur: 0.38, over: 0.07 }); x = lerp(x1(t), CW - 2, c); w = lerp(BAR_W, TILE, c); h = lerp(BAR_H, TILE, c); letters = seg(t, T.ct1 + 0.12, T.ct1 + 0.34); bar = 1 - clamp01(c); }
  if (t >= T.st2) { const s = pop(t, T.st2, { dur: 0.38, over: 0.04 }); x = lerp(CW - 2, CW - BAR_W / 2, s); w = lerp(TILE, BAR_W, s); h = lerp(TILE, BAR_H, s); letters = 1 - seg(t, T.st2, T.st2 + 0.16); bar = clamp01(s); dir = 0; vn = 0; }
  if (t >= T.s2a) { x = x2(t); dir = -1; vn = Math.abs(vel(x2, t)) / VMAX; }
  if (t >= T.ct2) { const c = pop(t, T.ct2, { dur: 0.38, over: 0.07 }); x = lerp(x2(t), 2, c); w = lerp(BAR_W, TILE, c); h = lerp(BAR_H, TILE, c); letters = seg(t, T.ct2 + 0.12, T.ct2 + 0.34); bar = 1 - clamp01(c); }
  if (t >= T.ct2 + 0.3) y += 7 * Math.sin(TAU * (t - T.ct2 - 0.3) / 2.5) * seg(t, T.ct2 + 0.3, T.ct2 + 1.0);
  const e = popOut(t, T.kbOut, { dur: 0.4 });
  sc *= e; y -= (1 - e) * 50; op *= clamp01(e * 1.6);
  return { x, y, w, h, letters, bar, skew: -dir * 9 * vn, op, sc, dir, vn };
};
const Blade: React.FC<{ s: TS }> = ({ s }) => {
  const rad = lerp(8, 22, s.bar), m = Math.min(s.w, s.h);
  return (
    <div style={{ position: "absolute", left: s.x - s.w / 2, top: TB + s.y - s.h / 2, width: s.w, height: s.h, opacity: s.op,
      transform: `skewX(${s.skew}deg) scale(${s.sc})`, borderRadius: rad, background: `linear-gradient(90deg, ${C.kbL}, ${C.kbR})`,
      boxShadow: SHADOW.tile }}>
      {s.bar > 0.01 && <div style={{ position: "absolute", top: 10, bottom: 10, width: 5, borderRadius: 3, background: C.cyan, opacity: s.bar,
        left: s.dir < 0 ? 5 : undefined, right: s.dir < 0 ? undefined : 5 }} />}
      {s.letters > 0.01 && <div style={{ position: "absolute", left: (s.w - m) / 2, top: (s.h - m) / 2, opacity: s.letters }}><KBTile size={m} shadow="" /></div>}
    </div>
  );
};

// ---------- the search card that grows out of the tile after Day 2 (search + AI: the two channels) ----------
const SearchCard: React.FC<{ t: number; tile: TS | null }> = ({ t, tile }) => {
  const m = pop(t, T.card, { dur: 0.5, over: 0.06 }) * popOut(t, T.cardOut, { dur: 0.4 });
  if (t < T.card || m <= 0.001 || !tile) return null;
  const cx = lerp(2, 196, m), cy = lerp(TB + MIDY, TB + 552, m) + 3 * Math.sin(TAU * (t / 2.5 + 0.5)) * seg(t, T.card + 0.4, T.card + 1);
  return (
    <div style={{ position: "absolute", left: cx - 160, top: cy - 50, width: 320, height: 100, borderRadius: 20, background: C.white, boxShadow: SHADOW.card,
      transform: `scale(${lerp(0.2, 1, m)})`, opacity: clamp01(m * 3), display: "flex", alignItems: "center", gap: 16, padding: "0 18px" }}>
      <Img src={pic("gohere-icon.png")} style={{ width: 56, height: 56, borderRadius: 14 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ width: 118, height: 13, borderRadius: 7, background: GH.navy }} />
        <div style={{ width: 84, height: 10, borderRadius: 5, background: GH.mint }} />
        <div style={{ width: 128, height: 8, borderRadius: 4, background: GH.bar }} />
      </div>
      {(["search", "spark"] as const).map((d, j) => {
        const q = pop(t, T.card + 0.22 + j * 0.12, { dur: 0.4, over: 0.1 });
        const u = (((t - T.card - 0.6) / 1.25 + j * 0.5) % 1 + 1) % 1, on = seg(t, T.card + 0.6, T.card + 0.9);
        return (
          <div key={d} style={{ position: "relative", width: 38, height: 38, borderRadius: 999, background: j ? C.cyan : GH.navy, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${q})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: `3px solid ${j ? C.cyan : GH.navy}`, opacity: 0.5 * (1 - u) * on, transform: `scale(${1 + 1.2 * SOFT(u)})` }} />
            <Ico d={d} size={22} />
          </div>
        );
      })}
    </div>
  );
};

// ---------- the K.B calendar: a chip that counts the days, then the result page ----------
const Calendar: React.FC<{ t: number }> = ({ t }) => {
  const a = pop(t, T.chip, { dur: 0.5, over: 0.08 }), ex = popOut(t, T.chipOut, { dur: 0.35 });
  if (t < T.chip || ex <= 0.001) return null;
  const g = t < T.shrink ? glide(t, T.grow, 0.75, 0.035) : 1 - sstep((t - T.shrink) / 0.8);
  const sc = lerp(CAL.s0, 1, g) * a * ex, y = lerp(CAL.y0, CAL.y1, g) + 7 * Math.sin(TAU * (t / 2.5 + 0.3));
  const r = pop(t, T.flip, { dur: 0.45, over: 0.06 }), days = clamp01(lerp(0, 1, (g - 0.55) / 0.4));
  return (
    <div style={{ position: "absolute", left: CAL.x - CAL.w / 2, top: y - CAL.h / 2, width: CAL.w, height: CAL.h, transform: `scale(${sc})`,
      borderRadius: 30, background: C.white, boxShadow: SHADOW.card }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, borderRadius: "30px 30px 0 0", background: `linear-gradient(90deg, ${C.kbL}, ${C.kbR})` }} />
      {[92, 248].map((x) => <div key={x} style={{ position: "absolute", left: x - 9, top: -20, width: 18, height: 50, borderRadius: 9, background: C.cyan, boxShadow: "0 4px 10px -4px rgba(41,58,81,0.5)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, height: 214, overflow: "hidden" }}>
        {["1", "2"].map((n, j) => (
          <div key={n} style={{ position: "absolute", inset: 0, textAlign: "center", fontWeight: 800, fontSize: 212, lineHeight: "214px", color: C.navy, letterSpacing: "-0.04em",
            transform: `translateY(${(j ? 1 - r : -r) * 200}px)`, opacity: clamp01(j ? r * 1.5 : 1 - r * 1.5) }}>{n}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 312, textAlign: "center", fontWeight: 700, fontSize: 50, lineHeight: 1, color: C.navy, opacity: days,
        transform: `translateY(${(1 - days) * 14}px)` }}>days</div>
    </div>
  );
};

// ---------- the cursor (the team trying to edit the old site) ----------
const Cursor: React.FC<{ t: number }> = ({ t }) => {
  const REST = { x: 470, y: 474 }, LOCK = { x: 582, y: 306 }, SRCH = { x: 836, y: 46 }, AWAY = { x: 990, y: 190 };
  let x = REST.x, y = REST.y, op = 1, sc = 1;
  if (t < 5) {
    // rest → the padlock (click: it refuses) → the search badge (click: nothing found) → away
    const m = seg(t, T.cur, T.click - 0.04, SOFT), n = seg(t, T.click + 0.2, T.click2 - 0.04, SOFT), f = seg(t, T.curOut, T.curOut + 0.6, SOFT);
    x = lerp(lerp(lerp(REST.x, LOCK.x, m), SRCH.x, n), AWAY.x, f);
    y = lerp(lerp(lerp(REST.y, LOCK.y, m) - 40 * Math.sin(Math.PI * m), SRCH.y, n) - 50 * Math.sin(Math.PI * n), AWAY.y, f);
    for (const c of [T.click, T.click2]) if (t > c && t < c + 0.22) sc = 1 - 0.18 * Math.sin((Math.PI * (t - c)) / 0.22);
    op = 1 - seg(t, T.curOut + 0.1, T.curOut + 0.6);
  } else {
    const m = seg(t, T.curIn, T.curIn + 0.6, SOFT);
    x = lerp(520, REST.x, m); y = lerp(520, REST.y, m); op = seg(t, T.curIn, T.curIn + 0.45);
  }
  if (op <= 0.001) return null;
  return (
    <svg width={40} height={40} viewBox="0 0 24 24" style={{ position: "absolute", left: x - 4, top: y - 2, opacity: op, transform: `scale(${sc})`, transformOrigin: "4px 2px", filter: "drop-shadow(0 3px 4px rgba(37,37,37,0.3))" }}>
      <path d="M4 2.5l13.5 11.6-6.2.7 3.6 6.9-2.9 1.4-3.5-7-4.5 4.3z" fill={C.ink} stroke="#FFFFFF" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
};

// ---------- the big text (≤ 3 short lines + the figure) ----------
const Caption: React.FC<{ t: number; text: string; cx: number; inK: (i: number) => number; out: number }> = ({ t, text, cx, inK, out }) => {
  if (out <= 0.001) return null;
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", left: cx - 800, width: 1600, top: CAP_Y - 40, display: "flex", justifyContent: "center", gap: 16,
      fontWeight: 700, fontSize: 56, lineHeight: "80px", color: C.navy, letterSpacing: "-0.01em", opacity: clamp01(out * 1.4), transform: `translateY(${(1 - out) * -20}px)` }}>
      {words.map((w, i) => { const k = inK(i); return <span key={i} style={{ display: "inline-block", opacity: clamp01(k * 1.5), transform: `translateY(${(1 - k) * 26}px)` }}>{w}</span>; })}
    </div>
  );
};

export const Loop: React.FC = () => {
  const t = useT();
  // the window glides left when K.B arrives (room for the calendar) and back at the end; a slow periodic float
  const sh = t < 8 ? glide(t, T.shift, 1.35, 0.03) : 1 - glide(t, T.shiftBack, 1.3, 0.03);
  const bx = lerp(BX_C, BX_L, sh), by = BY + 5 * Math.sin((TAU * t) / 10);
  const tile = tileState(t);
  const kOld = (i: number) => (t < T.s1a ? 1 : t < T.morph ? 0 : pop(t, T.morph + i * 0.028, { dur: 0.45, over: 0.06 }));
  // the wipes
  const inS1 = t >= T.s1a && t < T.s1b, inS2 = t >= T.s2a && t < T.s2b + 0.05;
  const b1 = x1(t), b2 = x2(t), vn1 = Math.abs(vel(x1, t)) / VMAX, vn2 = Math.abs(vel(x2, t)) / VMAX;
  const edge1 = b1 + BAR_W / 2, L = 60 + 400 * vn1;
  const wpop = (i: number, at: number) => pop(t, at + i * 0.07, { dur: 0.45, over: 0.06 });
  const capX = bx + BW / 2;
  return (
    <Frame>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs><filter id="ghSmear" x="-30%" y="0%" width="160%" height="100%"><feGaussianBlur stdDeviation={`${6 + 30 * vn1} 0`} /></filter></defs>
      </svg>
      <Calendar t={t} />
      <div style={{ position: "absolute", left: bx, top: by, width: BW, height: BH }}>
        {/* the browser window */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.white, boxShadow: SHADOW.card, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: TB, borderBottom: `1.5px solid ${GH.border}`, background: "#FCFCFD" }}>
            {[26, 48, 70].map((x) => <div key={x} style={{ position: "absolute", left: x - 6.5, top: TB / 2 - 6.5, width: 13, height: 13, borderRadius: 7, background: "#DCE1E8" }} />)}
            <div style={{ position: "absolute", left: BW / 2 - 170, top: TB / 2 - 17, width: 340, height: 34, borderRadius: 17, background: C.paleCool,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 17, color: C.muted }}>
              <Ico d="lock" size={16} color="#9AA3AE" />gohere.app
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, top: TB, width: CW, height: CH, overflow: "hidden" }}>
            {t < T.s1a && <Site t={t} k={() => 1} />}
            {inS1 && (
              <>
                <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${Math.max(0, CW - edge1)}px 0 0)` }}><Site t={t} k={() => 0} /></div>
                <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${edge1}px)` }}><Site t={t} k={() => 1} /></div>
                {/* FLOURISH: the old site smears sideways in the blade's wake and dissolves into the new one */}
                <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${Math.max(0, CW - b1)}px 0 ${Math.max(0, b1 - L)}px)`,
                  WebkitMaskImage: `linear-gradient(to right, rgba(0,0,0,0) ${b1 - L}px, rgba(0,0,0,0.9) ${b1}px)`, maskImage: `linear-gradient(to right, rgba(0,0,0,0) ${b1 - L}px, rgba(0,0,0,0.9) ${b1}px)` }}>
                  <div style={{ position: "absolute", inset: 0, filter: "url(#ghSmear)", transform: `translateX(${L * 0.22}px)` }}><Site t={t} k={() => 1} /></div>
                </div>
                <div style={{ position: "absolute", top: 0, bottom: 0, left: b1 - 130, width: 130, opacity: vn1,
                  background: "linear-gradient(to right, rgba(56,200,255,0), rgba(56,200,255,0.32))" }} />
              </>
            )}
            {t >= T.s1b && <Site t={t} k={kOld} />}
            {t >= T.s2a && (
              <div style={{ position: "absolute", inset: 0, clipPath: inS2 ? `inset(0 0 0 ${b2}px)` : undefined }}><CmsLayer t={t} /></div>
            )}
            {inS2 && <div style={{ position: "absolute", top: 0, bottom: 0, left: b2, width: 130, opacity: vn2,
              background: "linear-gradient(to left, rgba(163,210,194,0), rgba(56,200,255,0.28))" }} />}
            <Cursor t={t} />
          </div>
        </div>
        {tile && <Blade s={tile} />}
        <SearchCard t={t} tile={tile} />
      </div>
      {/* the three lines */}
      <Caption t={t} text="Hard to update, hard to find" cx={capX}
        inK={(i) => (t < 5 ? 1 : wpop(i, T.probIn))} out={t < 5 ? popOut(t, T.probOut, { dur: 0.35 }) : t >= T.probIn ? 1 : 0} />
      {t > 4 && t < 7 && <Caption t={t} text="Redesigned, editable, findable" cx={capX} inK={(i) => wpop(i, T.solIn)} out={t >= T.solIn ? popOut(t, T.solOut, { dur: 0.35 }) : 0} />}
      {t > 6 && t < 9 && <Caption t={t} text="Complete website rebuild" cx={capX} inK={(i) => wpop(i, T.resIn)} out={t >= T.resIn ? popOut(t, T.resOut, { dur: 0.35 }) : 0} />}
    </Frame>
  );
};
