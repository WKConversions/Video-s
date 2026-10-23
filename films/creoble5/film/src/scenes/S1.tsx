import React from "react";
import { Easing } from "remotion";
import { C, HOLM, OUT, INOUT, SANS, clamp01, mix } from "../lib";
import { HolmSite, Ico, LiquidGlass, f, squash } from "../shared";
import { Handoff, HANDOFF_HALF, Line, MiniSite } from "../v5";

// Scene 1 (0 → h1, 10.05 s), revision 1: BIG and explaining. One hero object at a time on plain cream:
// dot → capsule → a big browser (1000 × 620) where Holm's site builds itself while the AI sparkle writes it, a timer
// counting to "2 min" in the bar → the sparkle dives into a big text field (1000 × 120) → the Island → a 1.4× phone
// that builds and scrolls the site → a code window that is struck out → template cards flicked away → the capsule.
// Timings are seconds (t = g / 30); springs are local (seconds based). No float or wobble: all motion explains.

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
const SCROLL = Easing.bezier(0.3, 0, 0.6, 1);
const MONO = "ui-monospace, SFMono-Regular, Menlo, 'DejaVu Sans Mono', monospace";

/** A static box (BW × BH) centred on the frame centre, moved by transforms only; its visible shape is a clip-path inset
 * (w × h, radius r), so a dot, a capsule, a browser and a field are one box morphing. */
const Shaped: React.FC<{ BW: number; BH: number; cx: number; cy: number; w: number; h: number; r?: number; color: string; sc?: number; tf?: string; shadow?: number; children?: React.ReactNode }> =
  ({ BW, BH, cx, cy, w, h, r, color, sc = 1, tf = "", shadow = 1, children }) => {
  const ww = Math.max(0.5, w), hh = Math.max(0.5, h), rr = Math.max(0, Math.min(r ?? hh / 2, ww / 2, hh / 2));
  const ix = (BW - ww) / 2, iy = (BH - hh) / 2;
  return (
    <div style={{ position: "absolute", left: 960 - BW / 2, top: 540 - BH / 2, width: BW, height: BH, transform: `translate(${cx - 960}px, ${cy - 540}px) ${tf} scale(${sc})`,
      filter: shadow > 0 ? `drop-shadow(0 ${12 * shadow}px ${15 * shadow}px rgba(26,22,20,${0.13 * shadow}))` : undefined }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${rr}px)`, background: color }}>{children}</div>
    </div>
  );
};

// ── the sparkle ──────────────────────────────────────────────────────────────────────────────────────────────────
const STAR = "M50 0 C54.5 29 71 45.5 100 50 C71 54.5 54.5 71 50 100 C45.5 71 29 54.5 0 50 C29 45.5 45.5 29 50 0 Z";
const Sparkle: React.FC<{ t: number; x: number; y: number; size: number; rot: number; scale: number }> = ({ t, x, y, size, rot, scale }) => (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `rotate(${rot}deg) scale(${Math.max(0, scale)})`,
    filter: "drop-shadow(0 14px 18px rgba(26,22,20,0.22))" }}>
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

// ── the browser bar with the timer ("0:00" → "2 min") ───────────────────────────────────────────────────────────
const BAR_H = 56;
const Bar: React.FC<{ t: number }> = ({ t }) => {
  const secs = Math.floor(119 * ez(t, 0.95, 1.45, LIN));
  const done = t >= 2.4;
  const pop = done ? sp(t, 2.4, 0.4, 0.5) : 1;
  const label = done ? "2 min" : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const hand = (t - 0.95) * 360 * 5;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: BAR_H, background: "#FBFAF7", borderBottom: `1px solid ${C.line}`, fontFamily: SANS }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 24 + i * 22, top: 22, width: 12, height: 12, borderRadius: 6, background: "#E4E0D9" }} />)}
      <div style={{ position: "absolute", left: 330, top: 10, width: 300, height: 36, borderRadius: 10, background: "#F1EEE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 500, color: C.muted }}>holmfysio.dk</div>
      <div style={{ position: "absolute", left: 852, top: 9, width: 128, height: 38, borderRadius: 19, background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: DEEP, fontSize: 22, fontWeight: 600,
        letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums", transform: `scale(${pop})` }}>
        <svg width={22} height={22} viewBox="0 0 22 22"><circle cx={11} cy={11} r={9} fill="none" stroke={DEEP} strokeWidth={2.2} /><line x1={11} y1={11} x2={11} y2={5} stroke={DEEP} strokeWidth={2.2} strokeLinecap="round" transform={`rotate(${done ? 0 : hand} 11 11)`} /></svg>
        {label}
      </div>
    </div>
  );
};

// ── the code window ("Ingen teknik") ─────────────────────────────────────────────────────────────────────────────
const CODE: [string, string][] = [
  ["<!doctype html>", LIGHT], ['<html lang="da">', LIGHT], ["<head>", LIGHT], ['  <meta charset="utf-8">', LIGHT], ['  <link rel="stylesheet" href="app.css">', LIGHT], ["</head>", LIGHT],
  ['<body class="home">', LIGHT], ['  <header class="nav">', LIGHT], ["    <h1>Kom godt i bevægelse</h1>", LIGHT], ["  </header>", LIGHT],
  [".hero { display: grid; gap: 24px; }", "#EDE8DE"], [".hero img { object-fit: cover; }", "#EDE8DE"], ["@media (max-width: 600px) {", "#EDE8DE"], ["  .nav { position: sticky; }", "#EDE8DE"], ["}", "#EDE8DE"],
  ["const app = express();", SAGE], ["app.use(cors(), helmet());", SAGE], ['app.get("/", render);', SAGE], ["npm install && npm run build", "rgba(255,255,255,0.7)"], ["deploy --env production", "rgba(255,255,255,0.7)"],
  ["</body>", LIGHT], ["</html>", LIGHT],
];
const CodeWin: React.FC<{ t: number }> = ({ t }) => {
  const pop = sp(t, 8.13, 0.45, 0.6), strike = ez(t, 8.42, 0.2, OUT), wipe = ez(t, 8.6, 0.26, INOUT), away = ez(t, 8.9, 0.3, EASE_IN);
  const sc = mix(0.12, 1, Math.min(pop, 1.08)) * (1 - 0.94 * away);
  const y = mix(138, 540, Math.min(pop, 1.06)) + (138 - 540) * away;
  const scrollY = (t - 8.13) * 60 * 5.5;
  return (
    <div style={{ position: "absolute", left: 960 - 350, top: 540 - 160, width: 700, height: 320, transform: `translateY(${y - 540}px) scale(${sc})`, opacity: 1 - clamp01((away - 0.7) / 0.3),
      filter: "drop-shadow(0 22px 26px rgba(26,22,20,0.30))" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: INK, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 700, height: 56, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 26 + i * 24, top: 22, width: 12, height: 12, borderRadius: 6, background: i === 0 ? SAGE : "rgba(255,255,255,0.25)" }} />)}
          <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", fontFamily: MONO, fontSize: 20, color: "rgba(255,255,255,0.5)" }}>index.html</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 56, width: 700, height: 264, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 28, top: 0, width: 650, willChange: "transform", transform: `translateY(${220 - scrollY}px)` }}>
            {CODE.map(([s, col], i) => <div key={i} style={{ height: 44, lineHeight: "44px", fontFamily: MONO, fontSize: 26, color: col, whiteSpace: "pre" }}>{s}</div>)}
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: SAGE, clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)` }} />
        <div style={{ position: "absolute", left: -10, top: 150, width: 720, height: 20, borderRadius: 10, background: DEEP, transformOrigin: "0 50%", transform: `rotate(-4deg) scaleX(${strike})` }} />
      </div>
    </div>
  );
};

// ── template cards in a cover-flow ───────────────────────────────────────────────────────────────────────────────
const CARDS = [
  { dx: -440, rot: 52, dz: 0, dir: -1, label: "Skabelon" },
  { dx: -700, rot: 62, dz: -160, dir: -1, label: "Skabelon" },
  { dx: 440, rot: -52, dz: 0, dir: 1, label: "Skabelon" },
];
const TCard: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const c = CARDS[i];
  const fan = sp(t, 9.07 + i * 0.045, 0.45, 0.62), away = ez(t, 9.3 + i * 0.04, 0.32, EASE_IN);
  const dx = c.dx * fan + c.dir * 1400 * away, rot = c.rot * fan + c.dir * -30 * away;
  return (
    <div style={{ position: "absolute", left: 960 - 180, top: 540 - 240, width: 360, height: 480, opacity: clamp01(fan * 4) * (1 - clamp01((away - 0.2) / 0.5)),
      transform: `perspective(1500px) translate3d(${dx}px, ${-40 * away}px, ${c.dz * fan}px) rotateY(${rot}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "#ECE9E3", border: "2px solid #D6D2CA", boxShadow: "0 24px 40px -22px rgba(26,22,20,0.32)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 26, top: 26, height: 40, padding: "0 18px", borderRadius: 20, background: "#D9D5CD", color: "#8B867D", fontFamily: SANS, fontWeight: 600, fontSize: 24, display: "flex", alignItems: "center" }}>{c.label}</div>
        <div style={{ position: "absolute", left: 26, top: 92, width: 308, height: 176, borderRadius: 18, background: "#D9D5CD" }} />
        {[0, 1, 2].map((n) => <div key={n} style={{ position: "absolute", left: 26, top: 298 + n * 34, width: 308 - n * 62, height: 16, borderRadius: 8, background: "#D2CEC6" }} />)}
        <div style={{ position: "absolute", left: 26, top: 410, width: 130, height: 44, borderRadius: 22, background: "#CFCBC3" }} />
      </div>
    </div>
  );
};

// ── the scene ────────────────────────────────────────────────────────────────────────────────────────────────────
export const Scene1: React.FC<{ g: number }> = ({ g }) => {
  const HOFF = f("h1") - HANDOFF_HALF;
  if (g >= HOFF) return <Handoff g={g} at="h1" />;       // from h1 - 0.25 s to the end of the span: the hand-off only
  const t = g / 30, TH = HOFF / 30;
  const BY = 440, FY = 540, ISY = 138.2;                  // browser centre, field centre, the Island's centre under the 1.4× phone

  // ── A: dot → capsule → browser → field → capsule (one Shaped box, 1040 × 660) ──
  let A: React.ReactNode = null;
  let landRings: React.ReactNode = null;
  if (t < 6.45) {
    const fall = t < 0.2 ? (t / 0.2) ** 2 : 1;
    let y = -30 + 570 * fall;
    if (t >= 0.2 && t < 0.34) { const u = (t - 0.2) / 0.14; y = 540 - 95 * 4 * u * (1 - u); }
    if (t >= 0.34 && t < 0.42) { const u = (t - 0.34) / 0.08; y = 540 - 24 * 4 * u * (1 - u); }
    if (t >= 0.42) y = 540;
    const imp = [0.2, 0.34, 0.42].reduce((s, ti, i) => s + (t >= ti ? [0.55, 0.4, 0.25][i] * Math.exp(-(t - ti) / 0.045) : 0), 0);
    const fs = t < 0.2 ? (t / 0.2) * 0.4 : 0;
    const D = 30, dw = D * (1 + 0.5 * imp - 0.2 * fs), dh = D * (1 - 0.4 * imp + fs);
    const pd = sp(t, 0.43, 0.26, 0.6), wp = sp(t, 0.62, 0.5, 0.68), fm = sp(t, 3.9, 0.45, 0.8), g1 = sp(t, 6.12, 0.26, 0.85);
    const capW = t < 0.43 ? dw : mix(dw, 200, pd), capH = t < 0.43 ? dh : mix(dh, 60, pd);
    const w = capW + 800 * wp - 800 * g1, h = capH + 560 * wp - 500 * fm - 60 * g1;
    const cy0 = t < 0.43 ? y + 15 - dh / 2 : 540;
    const cy = cy0 + (BY - 540) * wp + (FY - BY) * fm;
    const r = Math.min(w / 2, h / 2, 30 + 30 * clamp01(fm));
    const col = mixc(mixc(SAGE, "#FFFFFF", clamp01(wp * 1.4)), SAGE, clamp01(g1 * 1.2));

    // browser content (site builds, scrolls, timer counts) and field content (typing)
    const bo = clamp01((wp - 0.25) * 2.2) * (1 - clamp01((t - 3.88) / 0.14));
    const build = ez(t, 0.95, 1.6, LIN), scroll = 560 * (ez(t, 1.2, 1.2, SCROLL) - ez(t, 2.65, 1.1, SCROLL));
    const fo = clamp01((fm - 0.55) * 2.4) * (1 - clamp01(g1 * 4));
    const txt = "Holm Fysioterapi", t0 = 4.62, cps = 12;
    const n = Math.max(0, Math.min(txt.length, Math.floor((t - t0) * cps)));
    const btn = sp(t, 4.5, 0.4, 0.55), pr = 1 - 0.14 * Math.max(0, Math.min(1, (t - 6.09) / 0.08)) * (t < 6.21 ? 1 : Math.exp(-(t - 6.21) * 12));
    const caretOn = n < txt.length || Math.floor(t * 2.2) % 2 === 0;
    A = (
      <Shaped BW={1040} BH={660} cx={960} cy={cy} w={w} h={h} r={r} color={col} shadow={1.4}>
        {bo > 0.01 && (
          <div style={{ position: "absolute", left: 20, top: 20, width: 1000, height: 620, opacity: bo, overflow: "hidden", background: "#fff" }}>
            <Bar t={t} />
            <div className="s1holm" style={{ position: "absolute", left: 0, top: BAR_H, width: 1000, height: 564 }}>
              <style>{".s1holm > div > div { will-change: transform; }"}</style>
              <HolmSite w={1000} h={564} build={build} scroll={scroll} />
            </div>
          </div>
        )}
        {fo > 0.01 && (
          <div style={{ position: "absolute", left: 20, top: 270, width: 1000, height: 120, opacity: fo, fontFamily: SANS }}>
            <div style={{ position: "absolute", inset: 0 }}><LiquidGlass w={1000} h={120} radius={60} p={1} sheen={0.5 + 0.5 * Math.sin(t * 1.8)} tint="clear" /></div>
            <div style={{ position: "absolute", left: 118, top: 0, height: 120, display: "flex", alignItems: "center", fontSize: 44, fontWeight: 500, color: INK, whiteSpace: "pre", letterSpacing: "-0.01em" }}>
              {txt.slice(0, n).split("").map((ch, i) => {
                const a = sp(t, t0 + i / cps, 0.22, 0.5);
                return <span key={i} style={{ display: "inline-block", opacity: clamp01(a * 3), transform: `translateY(${(1 - a) * 14}px) scale(${0.6 + 0.4 * a})`, filter: a < 0.7 ? `blur(${(0.7 - a) * 6}px)` : undefined }}>{ch}</span>;
              })}
              <span style={{ display: "inline-block", width: 4, height: 58, marginLeft: 4, borderRadius: 2, background: SAGE, opacity: caretOn ? 1 : 0 }} />
            </div>
            <div style={{ position: "absolute", left: 1000 - 18 - 84, top: 18, width: 84, height: 84, borderRadius: 42, background: SAGE, display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${Math.max(0, btn) * pr})`, boxShadow: "0 8px 18px -8px rgba(26,22,20,0.4)" }}>
              <Ico n="arrow" s={44} c="#fff" w={2.6} />
            </div>
          </div>
        )}
      </Shaped>
    );
    // each landing sends a thin ring out of the dot
    landRings = [0.2, 0.34, 0.42].map((ti, i) => {
      const p = ez(t, ti, 0.45, OUT);
      return t >= ti && t < ti + 0.45 ? <div key={i} style={{ position: "absolute", left: 960 - 220, top: 555 - 220, width: 440, height: 440, borderRadius: "50%", border: `4px solid ${SAGE}`,
        opacity: 0.5 * (1 - p), transform: `scale(${0.07 + (0.9 - 0.2 * i) * p})` }} /> : null;
    });
  }

  // ── the sparkle: born in the timer chip, writes the site, dives into the field as its icon ──
  let spark: React.ReactNode = null;
  if (t >= 2.5 && t < 6.3) {
    const WP: [number, number, number][] = [[1376, 158, 2.5], [1120, 330, 2.82], [690, 360, 3.12], [830, 610, 3.42], [1190, 560, 3.72]];
    let px = WP[0][0], py = WP[0][1];
    for (let i = 0; i < WP.length - 1; i++) {
      if (t >= WP[i][2]) { const q = ez(t, WP[i][2], WP[i + 1][2] - WP[i][2], INOUT); px = mix(WP[i][0], WP[i + 1][0], q); py = mix(WP[i][1], WP[i + 1][1], q); }
    }
    const born = sp(t, 2.5, 0.45, 0.55), dive = ez(t, 3.86, 0.42, INOUT);
    const x = mix(px, 530, dive), y = mix(py, FY, dive);
    const sc = mix(born, 56 / 260, dive) * (1 - ez(t, 6.08, 0.16, INOUT));
    const rot = -230 * (1 - sp(t, 2.5, 0.55, 0.62)) + 90 * (Math.min(t, 4.3) - 2.5);
    spark = <Sparkle t={t} x={x} y={y} size={260} rot={rot} scale={sc} />;
  }

  // ── B: capsule rises and becomes the Island (6.4 → 6.8); later the Island drops into the capsule (→ TH) ──
  let B: React.ReactNode = null;
  if (t >= 6.4 && t < 6.8) {
    const pr = sp(t, 6.4, 0.38, 0.72);
    B = <Shaped BW={240} BH={80} cx={960} cy={540 - (540 - ISY) * pr} w={200 - 74 * pr} h={60 - 23.6 * pr} color={mixc(SAGE, "#000000", clamp01((pr - 0.45) * 2))} />;
  }
  const dropStart = TH - 0.2;
  if (t >= dropStart) {
    const q = ez(t, dropStart, 0.2, OUT), qp = ez(t - 1 / 30, dropStart, 0.2, OUT);
    const px = (u: number) => mix(960, 760, u), py = (u: number) => mix(ISY, 540, u);
    B = <Shaped BW={240} BH={80} cx={px(q)} cy={py(q)} w={126 + 74 * q} h={36.4 + 23.6 * q} color={mixc("#000000", SAGE, clamp01(q * 1.3))}
      tf={squash(px(q) - px(qp), py(q) - py(qp), 0.0016)} />;
  }

  // ── the phone (1.4×), unrolled from the Island; the site builds, then scrolls steadily ──
  let phone: React.ReactNode = null, code: React.ReactNode = null, cards: React.ReactNode = null;
  const u0 = 6.78;
  if (t >= u0 && t < TH - 0.15) {
    const pw = sp(t, u0, 0.38, 0.8), ph = sp(t, u0 + 0.02, 0.5, 0.68);
    const collapse = ez(t, TH - 0.42, 0.24, INOUT);
    const open = t < TH - 0.45 ? 1 : 1 - collapse;
    const ow = t < TH - 0.45 ? clamp01(pw) : open, oh = t < TH - 0.45 ? clamp01(ph) : open;
    const top = mix(240, 220, oh), bot = mix(814, 220, oh), side = mix(915, 810, ow), rad = mix(13, 50, ow);
    const pop = 1 + 0.25 * Math.max(0, Math.min(ph, pw) - 1);
    const build = ez(t, 6.86, 0.7, LIN);
    const scroll = 340 * (ez(t, 7.45, 1.1, SCROLL) - ez(t, 8.6, 0.85, SCROLL));
    phone = (
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: `scale(${1.4 * pop})` }}>
        <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 3px rgba(26,22,20,0.10)) drop-shadow(0 30px 26px rgba(26,22,20,0.20))" }}>
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(${top}px ${side}px ${bot}px ${side}px round ${rad}px)` }}>
            <div style={{ position: "absolute", left: 810, top: 220, width: 300, height: 640 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 50, background: INK }} />
              <div style={{ position: "absolute", left: 9, top: 9, width: 282, height: 622, borderRadius: 41, overflow: "hidden", background: HOLM.bg,
                clipPath: `inset(${top - 220}px ${side - 810}px ${bot - 220}px ${side - 810}px round ${Math.max(0, rad - 9)}px)` }}>
                <div className="s1site"><style>{".s1site > div > div { will-change: transform; }"}</style><MiniSite build={build} scroll={scroll} /></div>
              </div>
              <div style={{ position: "absolute", left: 105, top: 20, width: 90, height: 26, borderRadius: 13, background: "#000" }} />
            </div>
          </div>
        </div>
      </div>
    );
    if (t > 8.1 && t < 9.25) code = <CodeWin t={t} />;
    if (t > 9.05) cards = <>{CARDS.map((_, i) => <TCard key={i} t={t} i={i} />)}</>;
  }

  // ── the lines ──
  const lines = (
    <>
      {t > 1.36 && t < 2.62 && <Line text="få minutter" y={882} size={92} p={clamp01((t - 1.38) / 0.8)} out={ez(t, 2.34, 0.26, INOUT)} italicWords={["minutter"]} />}
      {t > 2.58 && t < 4.15 && <Line text="Bygget af AI." y={882} size={92} p={clamp01((t - 2.6) / 1.9)} out={ez(t, 3.86, 0.24, INOUT)} italicWords={["AI"]} />}
      {t > 4.15 && t < 6.4 && <Line text="Fortæl kort om din virksomhed" y={FY - 128} size={30} serif={false} color={C.muted} p={clamp01((t - 4.2) / 1.7)} out={ez(t, 6.0, 0.24, INOUT)} />}
    </>
  );

  return (
    <>
      {lines}
      {landRings}
      {A}
      {spark}
      {cards}
      {phone}
      {code}
      {B}
    </>
  );
};
