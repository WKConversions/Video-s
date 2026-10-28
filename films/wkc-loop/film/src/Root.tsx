// WKConversions: 15 s portrait loop (1080×1920, 60 fps). Rebuild of the other session's v3: the frame filled top to
// bottom, big type, one hero object that morphs dot → logo tile → phone → video grid → partner tiles → logo → dot,
// a service stream along the bottom, seamless (the last frame flows into the first).
import React from "react";
import { AbsoluteFill, Composition, continueRender, delayRender, Easing, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";

const fh = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") Promise.all([500, 700, 800].map((w) => loadFont({ family: "Inter", url: staticFile("fonts/inter.woff2"), weight: String(w) }))).then(() => fh !== null && continueRender(fh));

const C = { bg: "#F5F6F8", ink: "#0E1116", blue: "#3B82F6", blueL: "#DCE8FD", muted: "#6B7280", line: "rgba(14,17,22,0.08)" };
const SH = "0 0 2px rgba(14,17,22,0.06), 0 0 30px rgba(14,17,22,0.08), 0 0 100px rgba(14,17,22,0.10)";
const F = "Inter";
const D = 15, W = 1080, H = 1920;
const OUT = Easing.bezier(0.22, 1, 0.36, 1), IO = Easing.bezier(0.65, 0, 0.35, 1);
const c01 = (x: number) => Math.min(1, Math.max(0, x));
const k = (t: number, a: number, d: number, e = OUT) => e(c01((t - a) / d));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const sp = (t: number, a: number, f = 1.8, z = 0.6) => { const u = t - a; if (u <= 0) return 0; const om = 2 * Math.PI * f, wd = om * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * om * u) * (Math.cos(wd * u) + (z * om / wd) * Math.sin(wd * u)); };

// beats (s): the hero object's shape over the loop; it starts and ends as the blue dot, so the seam is invisible

type G = { w: number; h: number; r: number; blue: number };
const KEYS: [number, G][] = [
  [0, { w: 180, h: 180, r: 90, blue: 1 }], [0.7, { w: 520, h: 520, r: 130, blue: 1 }],
  [2.35, { w: 520, h: 520, r: 130, blue: 1 }], [2.85, { w: 560, h: 1060, r: 70, blue: 0 }],
  [7.35, { w: 560, h: 1060, r: 70, blue: 0 }], [7.85, { w: 900, h: 1060, r: 48, blue: 0 }],
  [12.35, { w: 900, h: 1060, r: 48, blue: 0 }], [12.85, { w: 360, h: 360, r: 90, blue: 0 }],
  [14.3, { w: 360, h: 360, r: 90, blue: 0 }], [15, { w: 180, h: 180, r: 90, blue: 1 }],
];
const geo = (t: number): G => {
  for (let i = 0; i < KEYS.length - 1; i++) { const [a, g0] = KEYS[i], [b, g1] = KEYS[i + 1]; if (t <= b) { const p = i === 0 ? c01(sp(t, a, 1.4, 0.65)) : IO(c01((t - a) / (b - a)));
    return { w: mix(g0.w, g1.w, p), h: mix(g0.h, g1.h, p), r: mix(g0.r, g1.r, p), blue: mix(g0.blue, g1.blue, p) }; } }
  return KEYS[KEYS.length - 1][1];
};

const Title: React.FC<{ t: number; items: [number, number, React.ReactNode][] }> = ({ t, items }) => (
  <>{items.map(([a, b, node], i) => { const p = c01(sp(t, a, 1.7, 0.7)), o = k(t, b - 0.3, 0.3, IO); if (t < a - 0.05 || t > b) return null;
    return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 112, letterSpacing: "-0.045em", color: C.ink, lineHeight: 1.02,
      opacity: c01(p * 1.6) * (1 - o), transform: `translateY(${(1 - p) * 60 - o * 50}px)`, filter: p < 0.97 || o > 0.02 ? `blur(${(1 - p) * 12 + o * 10}px)` : undefined }}>{node}</div>; })}</>
);
const Blue: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.blue }}>{children}</span>;
const Roll: React.FC<{ to: number; p: number }> = ({ to, p }) => <span style={{ color: C.blue, fontVariantNumeric: "tabular-nums" }}>{Math.round(to * p)}</span>;

const Inner: React.FC<{ t: number; g: G }> = ({ t, g }) => {
  // 1 brand identity: the mark, type and colours
  const id = (t < 2.6) ? 1 - k(t, 2.3, 0.3, IO) : 0;
  // 2 online presence + motion design: a phone with the site; it scrolls once, then plays a film
  const ph = t > 2.5 && t < 7.7 ? Math.min(k(t, 2.7, 0.4), 1 - k(t, 7.3, 0.35, IO)) : 0;
  const scroll = k(t, 3.1, 1.8, IO) * 520;
  const film = k(t, 5.0, 0.5, IO);
  // 3 videos: a 3×5 grid fills; 4 partners: eight tiles join
  const vg = t > 7.5 && t < 10.2 ? Math.min(k(t, 7.7, 0.3), 1 - k(t, 9.9, 0.3, IO)) : 0;
  const pt = t > 9.9 && t < 12.7 ? Math.min(k(t, 10.1, 0.3), 1 - k(t, 12.3, 0.35, IO)) : 0;
  const lg = t > 12.5 ? Math.min(k(t, 12.75, 0.3), 1 - k(t, 14.4, 0.35, IO)) : 0;
  return (
    <>
      {id > 0 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: id }}>
        <svg width={g.w * 0.62} height={g.w * 0.62} viewBox="0 0 100 100" style={{ transform: `rotate(${(1 - c01(sp(t, 0.35, 1.3, 0.6))) * -90}deg) scale(${c01(sp(t, 0.35, 1.3, 0.6))})` }}>
          <circle cx="32" cy="34" r="12" fill="#fff" /><path d="M86 48 A 38 38 0 0 1 48 86 L 48 62 A 14 14 0 0 0 62 48 Z" fill="#fff" />
        </svg></div>}
      {ph > 0 && <div style={{ position: "absolute", inset: 18, borderRadius: 54, overflow: "hidden", background: "#fff", opacity: ph }}>
        <div style={{ transform: `translateY(${-Math.round(scroll)}px)` }}>
          <div style={{ height: 90, display: "flex", alignItems: "center", padding: "0 34px", gap: 14, fontFamily: F, fontWeight: 800, fontSize: 30, color: C.ink }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.ink }} />Your brand<div style={{ flex: 1 }} /><div style={{ width: 120, height: 44, borderRadius: 22, background: C.blue }} /></div>
          <div style={{ margin: "20px 34px", height: 420, borderRadius: 30, background: `linear-gradient(135deg, ${C.blue}, #8DB7FA)`, display: "flex", alignItems: "flex-end", padding: 30 }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 52, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05 }}>Grow with<br />a clear story.</div></div>
          {[0, 1, 2].map((i) => <div key={i} style={{ margin: "22px 34px", height: 170, borderRadius: 26, background: "#F1F4F9", display: "flex", alignItems: "center", gap: 22, padding: 24 }}>
            <div style={{ width: 120, height: 120, borderRadius: 22, background: i === 1 ? C.ink : C.blueL }} /><div style={{ flex: 1 }}><div style={{ height: 22, width: "80%", borderRadius: 11, background: "#D5DBE4" }} /><div style={{ height: 22, width: "55%", borderRadius: 11, background: "#E3E8EF", marginTop: 16 }} /></div></div>)}
        </div>
        {/* motion design: the screen turns into a playing film */}
        {film > 0 && <div style={{ position: "absolute", inset: 0, background: C.ink, clipPath: `circle(${film * 130}% at 50% 55%)` }}>
          {Array.from({ length: 6 }, (_, i) => { const a = (t - 5) * (0.8 + i * 0.15) + i; return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 80, height: 80, borderRadius: i % 2 ? 40 : 20, background: i % 3 === 0 ? C.blue : i % 3 === 1 ? "#fff" : "#8DB7FA", transform: `translate(${262 + Math.cos(a) * (90 + i * 30) - 40}px, ${540 + Math.sin(a * 1.3) * (120 + i * 35) - 40}px) rotate(${a * 60}deg)` }} />; })}
          <div style={{ position: "absolute", left: 60, right: 60, bottom: 80, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.2)" }}><div style={{ height: 10, borderRadius: 5, width: `${c01((t - 5.2) / 2.1) * 100}%`, background: C.blue }} /></div>
        </div>}
      </div>}
      {vg > 0 && <div style={{ position: "absolute", inset: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, opacity: vg }}>
        {Array.from({ length: 15 }, (_, i) => { const p = c01(sp(t, 7.75 + i * 0.1, 2.2, 0.6)); return <div key={i} style={{ borderRadius: 22, background: i % 4 === 0 ? C.blue : i % 4 === 2 ? C.ink : C.blueL, transform: `scale(${p})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="46" height="46" viewBox="0 0 10 10"><path d="M3 2 L8 5 L3 8 Z" fill={i % 4 === 1 || i % 4 === 3 ? C.blue : "#fff"} /></svg></div>; })}
      </div>}
      {pt > 0 && <div style={{ position: "absolute", inset: 60, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 30, opacity: pt }}>
        {Array.from({ length: 8 }, (_, i) => { const p = c01(sp(t, 10.15 + i * 0.12, 2, 0.6)); return <div key={i} style={{ borderRadius: 30, background: "#fff", boxShadow: SH, transform: `scale(${p}) translateY(${(1 - p) * 80}px)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ width: 70, height: 70, borderRadius: 20, background: i % 2 ? C.ink : C.blue }} /><svg width="44" height="44" viewBox="0 0 10 10"><path d="M2 5.2 L4.2 7.4 L8 3" fill="none" stroke={C.blue} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10" strokeDashoffset={10 * (1 - c01((t - 10.45 - i * 0.12) / 0.3))} /></svg></div>; })}
      </div>}
      {lg > 0 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: lg, fontFamily: F, fontWeight: 800, fontSize: 120, color: "#fff", letterSpacing: "-0.06em", fontStyle: "italic" }}>wkc</div>}
    </>
  );
};

// the services stream along the bottom: 160 px/s × 15 s = 2400 = 5 × 480, so it repeats exactly every loop
const CHIPS = ["Brand identity", "Websites", "Motion design", "Marketing", "Strategy"];
const Stream: React.FC<{ t: number }> = ({ t }) => {
  const SPC = 480, x0 = (t * 160) % SPC;
  return <>{Array.from({ length: 5 }, (_, j) => { const idx = (((j - Math.floor(t * 160 / SPC)) % 5) + 5) % 5; const x = -SPC + x0 + j * SPC;
    return <div key={j} style={{ position: "absolute", left: 0, top: 1680, transform: `translateX(${x}px)`, width: 440, height: 96, borderRadius: 48, background: "#fff", boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: F, fontWeight: 700, fontSize: 36, color: C.ink, letterSpacing: "-0.02em" }}>
      <span style={{ width: 14, height: 14, borderRadius: 7, background: C.blue }} />{CHIPS[idx]}</div>; })}</>;
};

const Loop: React.FC = () => {
  const t = useCurrentFrame() / 60;
  const g = geo(t);
  const breathe = 1 + 0.012 * Math.sin((t / D) * Math.PI * 2 * 5);   // five breaths per loop: periodic
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Title t={t} items={[
        [0.15, 2.5, <>Brand <Blue>identity</Blue></>], [2.55, 5.0, <>Online <Blue>presence</Blue></>], [5.05, 7.5, <>Motion <Blue>design</Blue></>],
        [7.55, 10.0, <><Roll to={15} p={k(t, 7.7, 1.3)} /> published<br />videos</>], [10.05, 12.5, <><Roll to={8} p={k(t, 10.2, 1.1)} /> partner<br />businesses</>],
        [12.55, 14.6, <>One creative<br /><Blue>partner</Blue></>],
      ]} />
      <div style={{ position: "absolute", left: Math.round(W / 2 - g.w / 2), top: Math.round(1090 - g.h / 2), width: Math.round(g.w), height: Math.round(g.h), borderRadius: g.r, overflow: "hidden", boxShadow: SH,
        background: g.blue > 0.5 ? C.blue : t > 12.6 ? C.ink : "#fff", transform: `scale(${breathe})`, transition: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: C.blue, opacity: g.blue > 0.5 ? 0 : g.blue * 2 }} />
        <Inner t={t} g={g} />
      </div>
      {t > 12.6 && t < 14.7 && <div style={{ position: "absolute", left: 0, right: 0, top: 1350, textAlign: "center", opacity: Math.min(k(t, 13.0, 0.4), 1 - k(t, 14.3, 0.35, IO)) }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 92, letterSpacing: "-0.05em", color: C.ink }}>WKConversions</div>
        <div style={{ display: "inline-block", marginTop: 34, padding: "26px 56px", borderRadius: 60, background: C.blue, color: "#fff", fontFamily: F, fontWeight: 700, fontSize: 40, boxShadow: SH,
          transform: `scale(${c01(sp(t, 13.3, 1.8, 0.55)) * (t > 13.9 ? 1 - 0.05 * Math.sin(Math.min(Math.PI, (t - 13.9) * 12)) : 1)})` }}>Start a project →</div>
      </div>}
      <Stream t={t} />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("dither.png")})`, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => <Composition id="Loop" component={Loop} durationInFrames={D * 60} fps={60} width={W} height={H} />;
