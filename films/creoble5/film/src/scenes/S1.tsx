import React from "react";
import { Easing, Img, staticFile } from "remotion";
import { C, HOLM, OUT, INOUT, SANS, SERIF, SHADOW_BIG, clamp01, mix, SHADOW, DROP } from "../lib";
import { Ico, LiquidGlass, f, squash } from "../shared";
import { HANDOFF_HALF, STAGE, Stage, StageHandoff } from "../v5";

// Scene 1 (0 → h1, 10.05 s), revision 2: the website is the hero object in every beat. A sage dot drops, becomes the
// capsule, and opens into the stage (a 960 × 600 browser). Holm's site builds itself live with a timer counting to
// "2 min"; the AI sparkle sweeps over it while it builds; a prompt field docks onto the stage and what is
// typed becomes the site's header name; the page unbuilds and rebuilds in a fast cascade; the stage flips to its back
// (code), a sage strike wipes it, it flips back; template sites flick through like a cover-flow and land on Holm's
// site. Revision 3: the site never scrolls; the camera frames what the voice names (push-ins and glides on the stage),
// and the content itself moves (build, photo swaps, looks, fan-out pages). Timings are seconds (t = g / 30), springs are local.

const SAGE = C.sage, DEEP = C.sageDeep, LIGHT = C.sageLight, INK = C.ink;
const sp = (t: number, t0: number, resp = 0.4, damp = 1) => {
  const x = t - t0;
  if (x <= 0) return 0;
  const w0 = (2 * Math.PI) / resp;
  if (damp >= 1) return 1 - (1 + w0 * x) * Math.exp(-w0 * x);
  const wd = w0 * Math.sqrt(1 - damp * damp);
  return 1 - Math.exp(-damp * w0 * x) * (Math.cos(wd * x) + ((damp * w0) / wd) * Math.sin(wd * x));
};
const ez = (t: number, t0: number, d: number, e: (x: number) => number = OUT) => e(clamp01((t - t0) / d));
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, p: number) => {
  const A = hex(a), B = hex(b), q = clamp01(p);
  return "#" + A.map((v, i) => Math.round(mix(v, B[i], q)).toString(16).padStart(2, "0")).join("");
};
const LIN = (x: number) => x;
const EASE_IN = Easing.bezier(0.5, 0, 0.9, 0.6);
const MONO = "ui-monospace, SFMono-Regular, Menlo, 'DejaVu Sans Mono', monospace";
const SX = 960, SY = 540;           // the stage's centre
const SL = SX - STAGE.w / 2, ST = SY - STAGE.h / 2;   // its top-left corner (480, 240)

/** A static box (BW × BH) centred on the frame centre, moved by transforms only; its visible shape is a clip-path inset
 * (w × h, radius r), so a dot, a capsule and the browser are one box morphing. `big` fades the browser's own soft shadow in. */
const Shaped: React.FC<{ BW: number; BH: number; cx: number; cy: number; w: number; h: number; r?: number; color: string; sc?: number; tf?: string; shadow?: number; big?: number; children?: React.ReactNode }> =
  ({ BW, BH, cx, cy, w, h, r, color, sc = 1, tf = "", shadow = 1, big = 0, children }) => {
  const ww = Math.max(0.5, w), hh = Math.max(0.5, h), rr = Math.max(0, Math.min(r ?? hh / 2, ww / 2, hh / 2));
  const ix = (BW - ww) / 2, iy = (BH - hh) / 2;
  return (
    <div style={{ position: "absolute", left: 960 - BW / 2, top: 540 - BH / 2, width: BW, height: BH, transform: `translate(${cx - 960}px, ${cy - 540}px) ${tf} scale(${sc})`,
      filter: shadow > 0.01 ? `drop-shadow(0 0 ${3 * shadow}px rgba(26,22,20,${0.08 * shadow})) drop-shadow(0 0 ${30 * shadow}px rgba(26,22,20,${0.13 * shadow})) drop-shadow(0 0 ${60 * shadow}px rgba(26,22,20,${0.08 * shadow}))` : undefined }}>
      {big > 0.01 && <div style={{ position: "absolute", left: (BW - STAGE.w) / 2, top: (BH - STAGE.h) / 2, width: STAGE.w, height: STAGE.h, borderRadius: 16, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, opacity: big }} />}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${rr}px)`, background: color }}>{children}</div>
    </div>
  );
};

// ── the sparkle ──────────────────────────────────────────────────────────────────────────────────────────────────
const STAR = "M50 0 C54.5 29 71 45.5 100 50 C71 54.5 54.5 71 50 100 C45.5 71 29 54.5 0 50 C29 45.5 45.5 29 50 0 Z";
const Sparkle: React.FC<{ t: number; x: number; y: number; size: number; rot: number; scale: number; sq?: string }> = ({ t, x, y, size, rot, scale, sq = "" }) => (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `${sq} rotate(${rot}deg) scale(${Math.max(0, scale)})`,
    filter: DROP }}>
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="s1-spark" x1="0" y1="0" x2="1" y2="1" gradientTransform={`rotate(${t * 90} 0.5 0.5)`}>
          <stop offset="0" stopColor={LIGHT} /><stop offset="0.5" stopColor={SAGE} /><stop offset="1" stopColor={DEEP} />
        </linearGradient>
      </defs>
      <path d={STAR} fill="url(#s1-spark)" />
    </svg>
  </div>
);

// ── the timer chip in the browser bar ("0:00" → "2 min") ─────────────────────────────────────────────────────────
const TimerChip: React.FC<{ t: number; left: number; top: number }> = ({ t, left, top }) => {
  const secs = Math.floor(119 * ez(t, 0.95, 1.45, LIN));
  const done = t >= 2.4;
  const pop = done ? sp(t, 2.4, 0.4, 0.5) : 1;
  const label = done ? "2 min" : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const hand = (t - 0.95) * 360 * 5;
  return (
    <div style={{ position: "absolute", left, top, width: 128, height: 38, borderRadius: 19, background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: DEEP,
      fontFamily: SANS, fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums", transform: `scale(${pop})` }}>
      <svg width={22} height={22} viewBox="0 0 22 22"><circle cx={11} cy={11} r={9} fill="none" stroke={DEEP} strokeWidth={2.2} /><line x1={11} y1={11} x2={11} y2={5} stroke={DEEP} strokeWidth={2.2} strokeLinecap="round" transform={`rotate(${done ? 0 : hand} 11 11)`} /></svg>
      {label}
    </div>
  );
};

// ── the wireframe: sage skeleton blocks over the page that fade as each block of the site resolves ─────────────
const SK = "rgba(135,168,158,0.42)", SK2 = "rgba(135,168,158,0.62)";
const Wireframe: React.FC<{ build: number }> = ({ build }) => {
  if (build >= 0.999) return null;
  const b = (i: number) => 1 - OUT(clamp01(build * 7 - i));
  const s = STAGE.w / 1460;
  const bar = (l: number, t: number, w: number, h: number, c = SK2) => <div style={{ position: "absolute", left: l, top: t, width: w, height: h, borderRadius: h / 2, background: c }} />;
  const blk = (i: number, l: number, t: number, w: number, h: number, r: number, ch?: React.ReactNode) =>
    <div style={{ position: "absolute", left: l, top: t, width: w, height: h, borderRadius: r, background: SK, opacity: b(i), transform: `scale(${1 - 0.04 * (1 - b(i))})` }}>{ch}</div>;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1460, height: 1500, transformOrigin: "0 0", transform: `scale(${s})`, pointerEvents: "none" }}>
      {blk(0, 70, 34, 1320, 46, 14, <>{bar(10, 8, 30, 30, SK2)}{bar(54, 15, 190, 16)}{[0, 1, 2, 3].map((n) => bar(1000 + n * 78, 15, 60, 16))}</>)}
      {blk(1, 70, 168, 640, 230, 22, <>{bar(30, 40, 560, 54)}{bar(30, 116, 400, 54)}</>)}
      {blk(2, 70, 420, 560, 96, 18, <>{bar(0, 14, 520, 16)}{bar(0, 44, 460, 16)}{bar(0, 74, 360, 16)}</>)}
      {blk(3, 760, 120, 630, 560, 28, <div style={{ position: "absolute", left: 240, top: 190, width: 150, height: 150, borderRadius: 75, background: SK2 }} />)}
      {blk(4, 70, 556, 560, 64, 32, <>{bar(0, 0, 156, 64, SK2)}{bar(176, 0, 250, 64)}</>)}
      {[0, 1, 2].map((i) => blk(5 + i * 0.6, 70 + i * 450, 760, 420, 400, 26, <>{bar(0, 0, 420, 270, SK2)}{bar(26, 296, 240, 20)}{bar(26, 332, 170, 14)}</>))}
      <div style={{ position: "absolute", left: 0, top: 1240, width: 1460, height: 260, background: "rgba(73,93,88,0.55)", opacity: b(6.2) }} />
    </div>
  );
};

// ── the sticky site header: what is typed in the prompt becomes the site's name ─────────────────────────────────
const SiteHeader: React.FC<{ name: string; p: number }> = ({ name, p }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: STAGE.w, height: 64, background: HOLM.bg, borderBottom: "1px solid rgba(31,42,46,0.10)", boxShadow: SHADOW,
    transform: `translateY(${-70 * (1 - p)}px)`, fontFamily: SANS, color: HOLM.ink }}>
  <div style={{ position: "absolute", left: 28, top: 15, width: 34, height: 34, borderRadius: 10, background: HOLM.accent, color: "#fff", fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{name.length ? name[0] : ""}</div>
    <div style={{ position: "absolute", left: 76, top: 0, height: 64, display: "flex", alignItems: "center", fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", whiteSpace: "pre" }}>{name}</div>
    <div style={{ position: "absolute", right: 28, top: 0, height: 64, display: "flex", alignItems: "center", gap: 30, fontSize: 18, color: HOLM.muted }}>{["Behandlinger", "Om os", "Priser", "Kontakt"].map((x) => <div key={x}>{x}</div>)}</div>
  </div>
);

// ── the stage's back: code ("Ingen teknik") ──────────────────────────────────────────────────────────────────────
const CODE: [string, string][] = [
  ["<!doctype html>", LIGHT], ['<html lang="da">', LIGHT], ["<head>", LIGHT], ['  <meta charset="utf-8">', LIGHT], ['  <link rel="stylesheet" href="app.css">', LIGHT], ["</head>", LIGHT],
  ['<body class="home">', LIGHT], ['  <header class="nav">', LIGHT], ["    <h1>Kom godt i bevægelse igen.</h1>", LIGHT], ["  </header>", LIGHT],
  [".hero { display: grid; gap: 24px; }", "#EDE8DE"], [".hero img { object-fit: cover; }", "#EDE8DE"], ["@media (max-width: 600px) {", "#EDE8DE"], ["  .nav { position: sticky; }", "#EDE8DE"], ["}", "#EDE8DE"],
  ["const app = express();", SAGE], ["app.use(cors(), helmet());", SAGE], ['app.get("/", render);', SAGE], ["npm install && npm run build", "rgba(255,255,255,0.7)"], ["deploy --env production", "rgba(255,255,255,0.7)"],
  ["</body>", LIGHT], ["</html>", LIGHT],
];
const CodeBack: React.FC<{ t: number }> = ({ t }) => {
  const scrollY = (t - 8.13) * 60 * 8, strike = ez(t, 8.5, 0.2, OUT), wipe = ez(t, 8.66, 0.16, INOUT);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: STAGE.w, height: STAGE.h, borderRadius: 16, background: INK, overflow: "hidden", transform: "scaleX(-1)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: STAGE.w, height: 56, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 26 + i * 24, top: 22, width: 12, height: 12, borderRadius: 6, background: i === 0 ? SAGE : "rgba(255,255,255,0.25)" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", fontFamily: MONO, fontSize: 20, color: "rgba(255,255,255,0.5)" }}>index.html</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 56, width: STAGE.w, height: STAGE.h - 56, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 32, top: 0, width: 880, willChange: "transform", transform: `translateY(${10 - scrollY}px)` }}>
          {CODE.map(([s, col], i) => <div key={i} style={{ height: 44, lineHeight: "44px", fontFamily: MONO, fontSize: 26, color: col, whiteSpace: "pre" }}>{s}</div>)}
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: SAGE, clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)` }} />
      <div style={{ position: "absolute", left: -20, top: 280, width: STAGE.w + 40, height: 26, borderRadius: 13, background: DEEP, transformOrigin: "0 50%", transform: `rotate(-4deg) scaleX(${strike})` }} />
    </div>
  );
};

// ── template sites flicking through the stage like a cover-flow ─────────────────────────────────────────────────
const TemplateFlick: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const t0 = 9.02 + i * 0.1, u = clamp01((t - t0) / 0.56);
  if (u <= 0 || u >= 1) return null;
  const e = INOUT(u), c = Math.abs(2 * e - 1);          // 1 at the sides, 0 at the middle
  return (
    <div style={{ position: "absolute", left: STAGE.w / 2 - 400, top: (STAGE.h - 46) / 2 - 240, width: 800, height: 480, opacity: clamp01((1 - c) * 6),
      transform: `perspective(1500px) translate3d(${mix(900, -900, e)}px, ${-30 * Math.sin(Math.PI * e)}px, ${mix(160, 0, c) + 70 * Math.sin(Math.PI * e)}px) rotateY(${mix(-58, 58, e)}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "#ECE9E3", border: "2px solid #D6D2CA", boxShadow: SHADOW_BIG, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 56, background: "#E2DFD8" }}>
          <div style={{ position: "absolute", left: 28, top: 16, width: 120, height: 24, borderRadius: 12, background: "#CFCBC3" }} />
          {[0, 1, 2].map((n) => <div key={n} style={{ position: "absolute", right: 28 + n * 84, top: 20, width: 60, height: 16, borderRadius: 8, background: "#D3CFC7" }} />)}
        </div>
        <div style={{ position: "absolute", left: 28, top: 84, width: 330, height: 22, borderRadius: 11, background: "#CFCBC3" }} />
        <div style={{ position: "absolute", left: 28, top: 120, width: 270, height: 22, borderRadius: 11, background: "#CFCBC3" }} />
        <div style={{ position: "absolute", left: 28, top: 164, width: 300, height: 12, borderRadius: 6, background: "#D6D2CA" }} />
        <div style={{ position: "absolute", left: 28, top: 190, width: 240, height: 12, borderRadius: 6, background: "#D6D2CA" }} />
        <div style={{ position: "absolute", left: 28, top: 226, width: 120, height: 40, borderRadius: 20, background: "#CBC7BF" }} />
        <div style={{ position: "absolute", right: 28, top: 84, width: 380, height: 200, borderRadius: 16, background: "#D9D5CD" }} />
        {[0, 1, 2].map((n) => <div key={n} style={{ position: "absolute", left: 28 + n * 250, top: 316, width: 230, height: 134, borderRadius: 14, background: "#DEDAD3" }} />)}
        <div style={{ position: "absolute", left: 300, top: 238, height: 34, padding: "0 16px", borderRadius: 17, background: "#D3CFC7", color: "#8B867D", fontFamily: SANS, fontWeight: 600, fontSize: 22, display: "flex", alignItems: "center" }}>Skabelon</div>
      </div>
    </div>
  );
};

// ── the camera (revision 4): calm. One reframe per sentence, each 1.2–1.4 s, a sine ease from rest to rest, no spring,
//    zoom within ±12%, pans within ~150 px; everything else holds the frame. (c = zoom, fu/fv = focus from the stage centre) ──
const CAM: [number, number, number, number][] = [
  [0.9, 1, 0, 0], [2.3, 1.08, 0, 0],          // "Din nye hjemmeside er få minutter væk": settle in while the site builds
  [8.1, 1.08, 0, 0], [9.0, 1, 0, 0],          // (lead, rev. 4) hold through AI, the field and the rebuild; pull back inside the code flip
];
const camAt = (t: number) => {
  if (t <= CAM[0][0]) return { c: 1, fu: 0, fv: 0 };
  for (let i = 0; i < CAM.length - 1; i += 2) {
    const [a, c0, u0, v0] = CAM[i], [b, c1, u1, v1] = CAM[i + 1];
    if (t < b) { const u = clamp01((t - a) / (b - a)), e = 0.5 - 0.5 * Math.cos(Math.PI * u); return { c: mix(c0, c1, e), fu: mix(u0, u1, e), fv: mix(v0, v1, e) }; }
    if (i + 2 < CAM.length && t < CAM[i + 2][0]) return { c: c1, fu: u1, fv: v1 };
  }
  return { c: 1, fu: 0, fv: 0 };
};
/** the sparkle's own travel (an object, so it keeps a small spring): anticipation, push, ~14% overshoot, settle */
const camSpring = (u: number) => {
  if (u < 0.14) return -0.08 * Math.sin((Math.PI * u) / 0.14);
  const v = (u - 0.14) / 0.86;
  return 1 - Math.exp(-5.5 * v) * (Math.cos(9.5 * v) + (5.5 / 9.5) * Math.sin(9.5 * v)) + 0.004 * v;
};

// ── "Bygget af AI": the AI tries looks (a sage tone with a serif headline, then dark, then back) and swaps the photo ──
const Looks: React.FC<{ t: number }> = ({ t }) => {
  const a = ez(t, 2.6, 0.28, INOUT), b1 = ez(t, 3.05, 0.28, INOUT), b2 = ez(t, 3.5, 0.28, INOUT);
  const W = STAGE.w, aOn = t >= 2.6 && t < 3.36, bOn = t >= 3.05 && t < 3.8;
  const edge = (x: number) => <div style={{ position: "absolute", left: x - 2, top: 0, width: 4, height: STAGE.h - 46, background: SAGE }} />;
  return (
    <>
      {aOn && <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - a) * 100}% 0 0)`, backdropFilter: "grayscale(1) contrast(1.05)", WebkitBackdropFilter: "grayscale(1) contrast(1.05)", background: "rgba(135,168,158,0.32)" }} />}
      {aOn && a < 0.999 && edge(a * W)}
      {bOn && <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - b1) * 100}% 0 ${b2 * 100}%)`, backdropFilter: "invert(0.92) hue-rotate(180deg) brightness(0.92) contrast(1.05)", WebkitBackdropFilter: "invert(0.92) hue-rotate(180deg) brightness(0.92) contrast(1.05)" }} />}
      {bOn && b1 < 0.999 && b1 > 0 && edge(b1 * W)}
      {bOn && b2 > 0.001 && b2 < 0.999 && edge(b2 * W)}
    </>
  );
};
const HERO_IMGS = ["holm-neck.jpg", "holm-shoulder.jpg"];
const HERO_T = [2.65, 4.2];
const HeroSlider: React.FC<{ t: number }> = ({ t }) => {
  if (t < 2.6 || t > 5.1) return null;
  const s = STAGE.w / 1460;
  return (
    <div style={{ position: "absolute", left: 760 * s, top: 120 * s, width: 630 * s, height: 560 * s, borderRadius: 24 * s, overflow: "hidden" }}>
      {HERO_IMGS.map((src, i) => {
        const o = ez(t, HERO_T[i], 0.8, INOUT);
        return o > 0 ? <Img key={src} src={staticFile(`img/${src}`)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", opacity: o }} /> : null;
      })}
    </div>
  );
};

// ── "Creoble bygger hele siden": the site fans out as its pages and steps through them like a carousel ──────────
const PAGE_SCROLL = [0, 470, 658], PAGE_NAME = ["Forside", "Behandlinger", "Kontakt"];
const Pages: React.FC<{ t: number }> = ({ t }) => {
  const fan = sp(t, 6.95, 0.45, 0.5), ret0 = sp(t, 7.92, 0.28, 0.55), ret = ret0 > 1 ? 1 + (ret0 - 1) * (1 - ez(t, 8.0, 0.12, LIN)) : ret0;
  const pos = sp(t, 7.2, 0.3, 0.6) + sp(t, 7.45, 0.3, 0.6) + sp(t, 7.7, 0.3, 0.6);   // 0 → 3: Forside, Behandlinger, Kontakt, Forside
  const ff = fan * (1 - ret);
  return (
    <>
      {[0, 1, 2].map((i) => {
        const d = ((((i - pos + 1.5) % 3) + 3) % 3) - 1.5, ad = Math.min(1, Math.abs(d));
        const sc = mix(1, mix(0.8, 0.58, ad), ff), x = 960 + d * 650 * ff, rot = -Math.max(-1, Math.min(1, d)) * 38 * ff;
        const op = i === 0 ? 1 : clamp01((1.45 - Math.abs(d)) * 4) * clamp01(ff * 3);
        const front = Math.abs(d) < 0.5;
        return (
          <React.Fragment key={i}>
            <Stage x={x} y={540} scale={sc} scroll={PAGE_SCROLL[i]} transform={`perspective(1800px) rotateY(${rot}deg)`} style={{ opacity: op, zIndex: front ? 2 : 1 }} />
            <div style={{ position: "absolute", left: 960 - 160, top: 868, width: 320, textAlign: "center", opacity: i === 0 ? clamp01((t - 7.15) * 8) * (1 - ez(t, 7.88, 0.12, LIN)) : op * clamp01((t - 7.15) * 8) * (1 - ez(t, 7.88, 0.12, LIN)),
              transform: `translateX(${Math.round(d * 650)}px)`, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: INK }}>
              <span style={{ display: "inline-block", padding: "6px 24px", borderRadius: 26, background: "#fff", border: `1px solid ${C.line}`, boxShadow: SHADOW }}>{PAGE_NAME[i]}</span>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ── a headline line: each word springs up (overshoot ~10%) out of a blur, then settles ───────────────────────────
const SLine: React.FC<{ t: number; text: string; t0: number; D: number; y: number; size: number; out?: number; italicWords?: string[] }> = ({ t, text, t0, D, y, size, out = 0, italicWords = [] }) => {
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", left: 960 - 900, top: y - size * 0.62, width: 1800, textAlign: "center", fontFamily: SERIF, fontSize: size, fontWeight: 400, letterSpacing: "-0.025em", color: INK, lineHeight: 1.15,
      whiteSpace: "nowrap", opacity: 1 - out, transform: `translateY(${-28 * out}px)`, filter: out > 0 ? `blur(${10 * out}px)` : undefined }}>
      {words.map((w, i) => {
        const q = sp(t, t0 + (i * D) / (words.length + 2), 0.5, 0.5), o = clamp01(q * 2.2), it = italicWords.includes(w.replace(/[.,?!]/g, ""));
        return <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: o, transform: `translateY(${(1 - q) * 46}px) scale(${0.9 + 0.1 * q})`, filter: o < 1 ? `blur(${(1 - o) * 10}px)` : undefined,
          fontStyle: it ? "italic" : "normal", color: it ? DEEP : undefined }}>{w}</span>;
      })}
    </div>
  );
};

// ── the scene ────────────────────────────────────────────────────────────────────────────────────────────────────
export const Scene1: React.FC<{ g: number }> = ({ g }) => {
  const HOFF = f("h1") - HANDOFF_HALF;
  if (g >= HOFF) return <StageHandoff g={g} at="h1" />;   // from h1 - 0.25 s to the end of the span: the hand-off only
  const t = g / 30;

  // ── the dot, the capsule and the stage: one Shaped box (1000 × 640) ──
  const fall = t < 0.2 ? (t / 0.2) ** 2 : 1;
  let y = -30 + 570 * fall;
  if (t >= 0.2 && t < 0.34) { const u = (t - 0.2) / 0.14; y = 540 - 95 * 4 * u * (1 - u); }
  if (t >= 0.34 && t < 0.42) { const u = (t - 0.34) / 0.08; y = 540 - 24 * 4 * u * (1 - u); }
  if (t >= 0.42) y = 540;
  const imp = [0.2, 0.34, 0.42].reduce((s, ti, i) => s + (t >= ti ? [0.55, 0.4, 0.25][i] * Math.exp(-(t - ti) / 0.045) : 0), 0);
  const fs = t < 0.2 ? (t / 0.2) * 0.4 : 0;
  const D = 30, dw = D * (1 + 0.5 * imp - 0.2 * fs), dh = D * (1 - 0.4 * imp + fs);
  const pd = sp(t, 0.43, 0.26, 0.5), wp = sp(t, 0.62, 0.55, 0.5);
  const capW = t < 0.43 ? dw : mix(dw, 200, pd), capH = t < 0.43 ? dh : mix(dh, 60, pd);
  const w = Math.min(STAGE.w, capW + (STAGE.w - 200) * wp), h = Math.min(STAGE.h, capH + (STAGE.h - 60) * wp), osc = 1 + 0.55 * Math.max(0, wp - 1);
  const cy = t < 0.43 ? y + 15 - dh / 2 : 540;
  const r = Math.min(w / 2, h / 2, mix(30, 16, clamp01(wp)));
  const col = mixc(SAGE, "#FFFFFF", clamp01(wp * 1.4));
  const full = clamp01((w - 950) / 10) * clamp01((h - 590) / 10);

  // the site: builds (0.9 → 2.05), unbuilds at the send press, rebuilds in a fast cascade (6.25 → 6.95); it never scrolls
  const buildV = t < 6.1 ? ez(t, 0.9, 1.15, LIN) : t < 6.25 ? 1 - ez(t, 6.1, 0.15, LIN) : ez(t, 6.25, 0.7, LIN);
  const fo = clamp01((wp - 0.25) * 2.2);
  const serif = t >= 2.7 && t < 3.75;

  // the prompt field docks onto the lower part of the stage (4.1) and drops away at the press (6.09)
  const txt = "Holm Fysioterapi", t0 = 4.62, cps = 12;
  const n = Math.max(0, Math.min(txt.length, Math.floor((t - t0) * cps)));
  const fdy = (tt: number) => (1 - sp(tt, 4.1, 0.5, 0.5)) * 190 + ez(tt, 6.16, 0.3, EASE_IN) * 200;
  const leave = ez(t, 6.16, 0.3, EASE_IN);
  const fieldDy = fdy(t), fieldSq = squash(0, fdy(t) - fdy(t - 1 / 30), 0.003);
  const btn = sp(t, 4.5, 0.4, 0.55), pr = 1 - 0.14 * Math.max(0, Math.min(1, (t - 6.09) / 0.08)) * (t < 6.21 ? 1 : Math.exp(-(t - 6.21) * 12));
  const caretOn = n < txt.length || Math.floor(t * 2.2) % 2 === 0;
  const hdr = sp(t, 4.45, 0.45, 0.5) * (1 - ez(t, 6.1, 0.22, INOUT));
  const showField = t > 4.08 && t < 6.5;
  const lab = ez(t, 4.2, 0.4, OUT);

  // the flip to the code side and back ("Ingen teknik")
  const theta = 180 * sp(t, 8.13, 0.42, 0.55) - 180 * sp(t, 8.82, 0.42, 0.55);
  const back = theta > 90;

  const stageEl = (
    <Shaped BW={1000} BH={640} cx={960} cy={cy} w={w} h={h} r={r} color={col} sc={osc} shadow={(1 - full) * 1.1} big={full}
      tf={Math.abs(theta) > 0.05 ? `perspective(2400px) rotateY(${theta}deg)` : ""}>
      {fo > 0.01 && !back && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 640, opacity: fo }}>
          <Stage x={500} y={320} scroll={0} build={buildV} booking={1} url="Forhåndsvisning"
            headline={serif ? <span style={{ fontFamily: SERIF, fontWeight: 400, letterSpacing: "-0.02em" }}>Kom godt i<br />bevægelse igen.</span> : undefined}>
            <Wireframe build={buildV} />
            <HeroSlider t={t} />
            <Looks t={t} />
            {showField && <SiteHeader name={txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((t - t0 - 0.12) * cps))))} p={hdr} />}
            {showField && (
              <div style={{ position: "absolute", left: 30, top: STAGE.h - 46 - 24 - 110, width: 900, height: 110, transform: `translateY(${fieldDy}px) ${fieldSq}`, opacity: 1 - clamp01((leave - 0.5) * 2), fontFamily: SANS }}>
                <div style={{ position: "absolute", left: 450, top: -64, height: 50, padding: "0 24px", borderRadius: 25, transform: `translateX(-50%) translateY(${(1 - lab) * 14}px)`, background: "rgba(250,250,248,0.94)", border: `1px solid ${C.line}`, boxShadow: SHADOW,
                  display: "flex", alignItems: "center", fontSize: 28, fontWeight: 500, color: C.muted, whiteSpace: "nowrap", opacity: lab }}>Fortæl kort om din virksomhed</div>
                <LiquidGlass w={900} h={110} radius={55} p={1} sheen={0.5 + 0.5 * Math.sin(t * 1.8)} tint="clear" />
                <div style={{ position: "absolute", left: 120, top: 0, height: 110, display: "flex", alignItems: "center", fontSize: 40, fontWeight: 500, color: INK, whiteSpace: "pre", letterSpacing: "-0.01em" }}>
                  {txt.slice(0, n).split("").map((ch, i) => {
                    const a = sp(t, t0 + i / cps, 0.22, 0.5);
                    return <span key={i} style={{ display: "inline-block", opacity: clamp01(a * 3), transform: `translateY(${(1 - a) * 14}px) scale(${0.6 + 0.4 * a})`, filter: a < 0.7 ? `blur(${(0.7 - a) * 6}px)` : undefined }}>{ch}</span>;
                  })}
                  <span style={{ display: "inline-block", width: 4, height: 52, marginLeft: 4, borderRadius: 2, background: SAGE, opacity: caretOn ? 1 : 0 }} />
                </div>
                <div style={{ position: "absolute", left: 900 - 16 - 78, top: 16, width: 78, height: 78, borderRadius: 39, background: SAGE, display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `scale(${Math.max(0, btn) * pr})`, boxShadow: SHADOW }}>
                  <Ico n="arrow" s={42} c="#fff" w={2.6} />
                </div>
              </div>
            )}
            {t > 9.0 && <>{[0, 1, 2].map((i) => <TemplateFlick key={i} t={t} i={i} />)}</>}
          </Stage>
          {t < 2.9 && <TimerChip t={t} left={20 + STAGE.w - 18 - 128} top={24} />}
        </div>
      )}
      {back && <div style={{ position: "absolute", left: 20, top: 20, width: STAGE.w, height: STAGE.h }}><CodeBack t={t} /></div>}
    </Shaped>
  );
  const pagesOn = t >= 6.95 && t < 8.12;

  // landing rings of the dot
  const landRings = [0.2, 0.34, 0.42].map((ti, i) => {
    const p = ez(t, ti, 0.45, OUT);
    return t >= ti && t < ti + 0.45 ? <div key={i} style={{ position: "absolute", left: 960 - 220, top: 555 - 220, width: 440, height: 440, borderRadius: "50%", border: `4px solid ${SAGE}`,
      opacity: 0.5 * (1 - p), transform: `scale(${0.07 + (0.9 - 0.2 * i) * p})` }} /> : null;
  });

  // ── the sparkle: born in the timer chip, writes the site, dives into the prompt field as its icon ──
  let spark: React.ReactNode = null;
  if (t >= 2.5 && t < 6.3) {
    const WP: [number, number, number][] = [[SL + STAGE.w - 18 - 64, ST + 23, 2.5], [1180, 430, 2.82], [760, 470, 3.12], [900, 700, 3.42], [1210, 650, 3.72]];
    const pos = (tt: number) => {
      let px = WP[0][0], py = WP[0][1];
      for (let i = 0; i < WP.length - 1; i++) {
        if (tt >= WP[i][2]) { const q = camSpring(clamp01((tt - WP[i][2]) / (WP[i + 1][2] - WP[i][2]))); px = mix(WP[i][0], WP[i + 1][0], q); py = mix(WP[i][1], WP[i + 1][1], q); }
      }
      const dv = Math.max(0, sp(tt, 3.95, 0.45, 0.6)), ic = ST + 46 + (STAGE.h - 46 - 24 - 55) + fdy(tt);
      return [mix(px, SL + 30 + 64, dv), mix(py, ic, dv)];
    };
    const born = sp(t, 2.5, 0.45, 0.5), dive = clamp01(sp(t, 3.95, 0.45, 0.6));
    const [x, yy] = pos(t), [x1, y1] = pos(t - 1 / 30), sqs = squash(x - x1, yy - y1, 0.0016);
    const sc = mix(born, 56 / 260, dive) * (1 - ez(t, 6.1, 0.18, INOUT));
    const rot = -230 * (1 - sp(t, 2.5, 0.55, 0.62)) + 90 * (Math.min(t, 4.4) - 2.5);
    spark = <Sparkle t={t} x={x} y={yy} size={260} rot={rot} scale={sc} sq={sqs} />;
  }

  const lines = (
    <>
      {t > 1.36 && t < 2.62 && <SLine t={t} text="få minutter" t0={1.38} D={0.8} y={985} size={76} out={ez(t, 2.34, 0.26, INOUT)} italicWords={["minutter"]} />}
      {t > 2.58 && t < 4.15 && <SLine t={t} text="Bygget af AI." t0={2.6} D={1.9} y={985} size={76} out={ez(t, 3.86, 0.24, INOUT)} italicWords={["AI"]} />}
    </>
  );

  const cam = camAt(t);
  const tx = 960 - cam.c * (960 + cam.fu), ty = 540 - cam.c * (540 + cam.fv);
  return (
    <>
      {lines}
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", willChange: "transform", transform: `translate(${tx}px, ${ty}px) scale(${cam.c})` }}>
        {landRings}
        {pagesOn ? <Pages t={t} /> : stageEl}
        {spark}
      </div>
    </>
  );
};
