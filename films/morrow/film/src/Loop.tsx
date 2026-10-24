// Morrow House ("Nights worth remembering", Amsterdam): a 12 s seamless loop in the site's own editorial style
// (ink #171514, paper #e9e0d5, cream #f7f1e9, wine #6e2734, muted #776f69; Playfair Display + DM Sans). Three
// evenings from the site's calendar, 4 s each, on one evening card: the date rolls in, the title rises word by word,
// "Reserve" is pressed into "Seat reserved"; the season's evenings flow underneath. Every beat starts and ends on an
// empty card body and the stream repeats exactly every 12 s, so the last frame flows into the first.
import React from "react";
import { AbsoluteFill, Img, continueRender, delayRender, Easing, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";

const M = { ink: "#171514", paper: "#E9E0D5", cream: "#F7F1E9", wine: "#6E2734", muted: "#776F69", line: "rgba(23,21,20,0.12)" };
const SANS = "DM Sans", SERIF = "Playfair Display";
const fh = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    ...[400, 500, 600].map((w) => loadFont({ family: SANS, url: staticFile(`fonts/dmsans-${w}.woff2`), weight: String(w) })),
    loadFont({ family: SERIF, url: staticFile("fonts/playfair-500.woff2"), weight: "500" }),
    loadFont({ family: SERIF, url: staticFile("fonts/playfair-600.woff2"), weight: "600" }),
    loadFont({ family: SERIF, url: staticFile("fonts/playfair-500i.woff2"), weight: "500", style: "italic" }),
  ]).then(() => fh !== null && continueRender(fh));
}
const INOUT = Easing.bezier(0.65, 0, 0.35, 1), OUT = Easing.bezier(0.22, 1, 0.36, 1);
const c01 = (x: number) => Math.min(1, Math.max(0, x));
const k = (t: number, a: number, d: number, e = OUT) => e(c01((t - a) / d));
const sp = (t: number, a: number, f = 2.0, z = 0.55) => { const u = t - a; if (u <= 0) return 0; const w = 2 * Math.PI * f; return 1 - Math.exp(-z * w * u) * Math.cos(w * Math.sqrt(1 - z * z) * u); };
const SHADOW = "0 0 2px rgba(23,21,20,0.08), 0 0 30px rgba(23,21,20,0.10), 0 0 90px rgba(23,21,20,0.12)";
const P = 4;

// the calendar (site copy)
const EVENINGS = [
  { d: "24", m: "APR", kind: "DINNER / 19:30", title: "The architecture of appetite", host: "With chef Mira Vos & architect Leon Vermeer" },
  { d: "08", m: "MAY", kind: "SALON / 20:00", title: "What makes a place feel like home?", host: "An evening of objects, memory and sound" },
  { d: "29", m: "MAY", kind: "LISTENING ROOM / 21:00", title: "Field recordings from the North Sea", host: "A live set by Aster Kline" },
];

/** words rising out of a blur, staggered (editorial) */
const Rise: React.FC<{ text: string; u: number; at: number; size: number; serif?: boolean; italic?: boolean; color?: string; weight?: number }> = ({ text, u, at, size, serif, italic, color = M.ink, weight = 500 }) => (
  <div style={{ fontFamily: serif ? SERIF : SANS, fontSize: size, fontWeight: weight, fontStyle: italic ? "italic" : "normal", color, lineHeight: 1.08, letterSpacing: serif ? "-0.02em" : "0.02em" }}>
    {text.split(" ").map((w, j) => { const p = c01(sp(u, at + j * 0.06, 1.9, 0.62)); return (
      <span key={j} style={{ display: "inline-block", marginRight: "0.24em", opacity: p, transform: `translateY(${(1 - p) * 0.5 * size}px)`, filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : undefined }}>{w}</span>); })}
  </div>
);
/** a two-digit date that rolls into place */
const RollDate: React.FC<{ d: string; u: number }> = ({ d, u }) => (
  <div style={{ display: "flex", fontFamily: SERIF, fontWeight: 500, fontSize: 210, lineHeight: "240px", color: M.ink, letterSpacing: "-0.04em" }}>
    {d.split("").map((ch, j) => { const p = k(u, 0.15 + j * 0.12, 1.0, OUT); const n = Number(ch); const pos = (n + 10 * (j + 1)) * p; return (
      <div key={j} style={{ height: 240, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-pos * 240}px)`, filter: p < 0.97 ? `blur(${(1 - p) * 4}px)` : undefined }}>
          {Array.from({ length: 10 * (j + 2) + 1 }, (_, q) => <div key={q} style={{ height: 240, lineHeight: "240px", overflow: "hidden" }}>{q % 10}</div>)}
        </div>
      </div>); })}
  </div>
);

const Evening: React.FC<{ e: (typeof EVENINGS)[number]; u: number }> = ({ e, u }) => {
  const press = sp(u, 2.55, 3, 0.4), pressed = u > 2.55;
  const bar = k(u, 2.6, 0.5);
  return (
    <div style={{ display: "flex", gap: 70, alignItems: "center" }}>
      <div style={{ width: 290 }}>
        <RollDate d={e.d} u={u} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: "0.2em", color: M.wine, marginTop: 6, opacity: k(u, 0.5, 0.5) }}>{e.m} · 2026</div>
      </div>
      <div style={{ width: 640 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: "0.18em", color: M.wine, opacity: k(u, 0.35, 0.4) }}>{e.kind}</div>
        <div style={{ marginTop: 18 }}><Rise text={e.title} u={u} at={0.45} size={64} serif /></div>
        <div style={{ marginTop: 18 }}><Rise text={e.host} u={u} at={1.0} size={24} color={M.muted} weight={400} /></div>
        {/* Reserve → Seat reserved */}
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 22, opacity: k(u, 1.5, 0.4), transform: `translateY(${(1 - k(u, 1.5, 0.5)) * 20}px)` }}>
          <div style={{ height: 66, padding: "0 30px", borderRadius: 33, background: pressed ? M.wine : M.ink, color: M.cream, display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 600, fontSize: 23,
            transform: `scale(${pressed ? 0.94 + 0.06 * c01(press) : 1})`, boxShadow: SHADOW }}>{pressed ? "Seat reserved ✓" : "Reserve ↗"}</div>
          {/* the long table filling */}
          <div style={{ display: "flex", gap: 10 }}>
            {Array.from({ length: 10 }, (_, j) => { const on = c01(k(u, 1.7 + j * 0.06, 0.25)); const mine = j === 9 ? c01(sp(u, 2.6, 2.6, 0.45)) : 0; return (
              <div key={j} style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${M.ink}`, background: j < 9 ? `rgba(23,21,20,${0.85 * on})` : `rgba(110,39,52,${mine})`, transform: `scale(${j === 9 ? 1 + 0.3 * Math.sin(Math.PI * c01(bar)) : 0.6 + 0.4 * on})` }} />); })}
          </div>
        </div>
      </div>
    </div>
  );
};

// the season flowing underneath (exactly periodic over 12 s)
const CHIPS = ["24 APR · Dinner", "Long tables", "08 MAY · Salon", "Conversations", "29 MAY · Listening room", "Performances", "Shared tables", "Amsterdam · 2026"];
const SP = 380, V = 950;   // 950 × 12 = 30 × 380: seamless
const Season: React.FC<{ t: number; y: number; dir: 1 | -1; shift: number }> = ({ t, y, dir, shift }) => {
  const x0 = ((t * V + shift) % SP + SP) % SP;
  return (<>{Array.from({ length: 7 }, (_, j) => {
    const x = dir > 0 ? -SP + x0 + j * SP : 1920 - x0 - j * SP + 20;
    const idx = ((Math.floor((t * V + shift) / SP) * dir + j * dir) % 8 + 8000) % 8;
    return (<div key={j} style={{ position: "absolute", left: x, top: y, height: 62, width: 340, borderRadius: 31, border: `1.5px solid ${M.line}`, background: "rgba(247,241,233,0.75)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      fontFamily: idx % 2 ? SERIF : SANS, fontStyle: idx % 2 ? "italic" : "normal", fontWeight: 500, fontSize: idx % 2 ? 26 : 21, letterSpacing: idx % 2 ? "0" : "0.06em", color: M.ink }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: M.wine }} />{CHIPS[idx]}</div>);
  })}</>);
};

export const Loop: React.FC = () => {
  const t = useCurrentFrame() / 60;
  const i = Math.floor(t / P) % 3, u = t % P, e = EVENINGS[i];
  const enter = c01(sp(u, 0.0, 1.5, 0.65)), leave = k(u, 3.55, 0.45, INOUT);
  const drift = Math.sin((t / 12) * Math.PI * 2);    // the photo pans and breathes once per loop (periodic over 12 s)
  return (
    <AbsoluteFill style={{ background: M.paper, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 58, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: "0.2em", color: M.ink }}>
        <span style={{ width: 40, height: 40, borderRadius: 20, background: M.ink, color: M.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 22, letterSpacing: 0 }}>M</span>
        MORROW HOUSE <span style={{ color: M.muted, fontWeight: 500 }}>· NIGHTS WORTH REMEMBERING</span>
      </div>
      {/* the evening card */}
      <div style={{ position: "absolute", left: 960 - 780, top: 140, width: 1560, height: 620, borderRadius: 28, background: M.cream, boxShadow: SHADOW, overflow: "hidden", display: "flex" }}>
        <div style={{ flex: 1, padding: "70px 0 0 80px", opacity: enter * (1 - leave), transform: `translateY(${(1 - enter) * 30 - leave * 24}px)`, filter: leave > 0.02 ? `blur(${leave * 10}px)` : undefined }}>
          <Evening e={e} u={u} />
        </div>
        <div style={{ width: 330, height: 620, overflow: "hidden", position: "relative" }}>
          <Img src={staticFile("img/hero.jpg")} style={{ position: "absolute", height: 620, left: -380 + 120 * drift, top: 0, transform: `scale(${1.12 + 0.04 * Math.cos((t / 12) * Math.PI * 2)})` }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(247,241,233,0.35), rgba(0,0,0,0) 30%)" }} />
          <div style={{ position: "absolute", left: 24, bottom: 24, fontFamily: SANS, fontWeight: 600, fontSize: 16, letterSpacing: "0.18em", color: M.cream }}>0{i + 1} / 03</div>
        </div>
      </div>
      <Season t={t} y={810} dir={1} shift={0} />
      <Season t={t} y={900} dir={-1} shift={190} />
      <div style={{ position: "absolute", left: 0, top: 795, width: 160, height: 200, background: `linear-gradient(90deg, ${M.paper}, rgba(233,224,213,0))` }} />
      <div style={{ position: "absolute", right: 0, top: 795, width: 160, height: 200, background: `linear-gradient(270deg, ${M.paper}, rgba(233,224,213,0))` }} />
    </AbsoluteFill>
  );
};
