// Creoble — "Just your website, made simple." An Apple-style product film on cream: big centred statements that rise
// and sharpen, and the product on floating devices. The flow the brief asks for: tell Creoble about the business →
// AI builds the site → the website on laptop and phone → change it by typing → preview for free → 499 kr → hosting
// with domain included. One light-blue accent; no orange.
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, MOVE, clamp01, mix } from "./lib";
import { off } from "./kinetic";

const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
const f = (at: string | number) => T.f(at);
const SANS = "Inter", SERIF = "Fraunces";
const typed = (g: number, at: string, text: string, cps = 34) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));

/* ---------- the statement type: words rise, fade and sharpen (Apple) ---------- */
type Wd = { t: string; at: string; blue?: boolean };
const Say: React.FC<{ g: number; words: Wd[]; y: number; size: number; out?: string; weight?: number; color?: string; x?: number }> = ({ g, words, y, size, out, weight = 600, color = C.ink, x }) => {
  const o = out ? k(g, out, 0.6, DEPART) : 0;
  if (o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", gap: size * 0.26, transform: `translate(${x ?? 0}px, ${y - o * 20}px) perspective(4000px) rotateX(0.01deg)`,
      opacity: 1 - o, filter: o > 0 ? `blur(${o * 8}px)` : undefined, fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: "-0.035em", lineHeight: 1.08, color, whiteSpace: "nowrap" }}>
      {words.map((w, i) => {
        const kk = k(g, w.at, 0.9);
        return <span key={i} style={{ display: "inline-block", color: w.blue ? C.blue : undefined, opacity: Math.min(1, kk * 1.4), transform: `translateY(${(1 - kk) * size * 0.28}px)`,
          filter: kk < 1 ? `blur(${(1 - kk) * 10}px)` : undefined }}>{w.t}</span>;
      })}
    </div>
  );
};
const Wordmark: React.FC<{ x: number; y: number; size: number; o?: number; dot?: number }> = ({ x, y, size, o = 1, dot = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`, opacity: o, fontFamily: SERIF, fontWeight: 500, fontSize: size, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", lineHeight: 1 }}>
    Creoble<span style={{ display: "inline-block", color: C.blue, transform: `scale(${dot})`, transformOrigin: "50% 80%" }}>.</span>
  </div>
);

/* ---------- icons (SF-like monoline) ---------- */
const P: Record<string, React.ReactNode> = {
  spark: <><path d="M24 6 L27 20 L41 24 L27 28 L24 42 L21 28 L7 24 L21 20 Z" /></>,
  check: <><path d="M11 25 L20 33 L37 15" /></>,
  arrow: <><path d="M10 24 H37" /><path d="M27 14 L37 24 L27 34" /></>,
  up: <><path d="M24 38 V12" /><path d="M13 22 L24 11 L35 22" /></>,
  lock: <><rect x="11" y="21" width="26" height="19" rx="4" /><path d="M16 21 V15 a8 8 0 0 1 16 0 V21" /></>,
  eye: <><path d="M4 24 C10 14 17 10 24 10 C31 10 38 14 44 24 C38 34 31 38 24 38 C17 38 10 34 4 24 Z" /><circle cx="24" cy="24" r="6" /></>,
  globe: <><circle cx="24" cy="24" r="17" /><path d="M7 24 H41" /><path d="M24 7 c-6 6 -6 28 0 34 c6 -6 6 -28 0 -34" /></>,
  mail: <><rect x="6" y="11" width="36" height="26" rx="4" /><path d="M7 13 L24 26 L41 13" /></>,
  server: <><rect x="8" y="9" width="32" height="12" rx="3" /><rect x="8" y="27" width="32" height="12" rx="3" /><path d="M14 15 h2 M14 33 h2" /></>,
  code: <><path d="M17 14 L7 24 L17 34" /><path d="M31 14 L41 24 L31 34" /><path d="M27 10 L21 38" /></>,
};
const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number }> = ({ n, s = 24, c = C.ink, w = 2.4 }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={w * (48 / s) * (s / 26)} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>{P[n]}</svg>
);

/* ---------- the devices (drawn, generic) ---------- */
const SW = 1280, SH = 800;                                   // the laptop's screen
const Laptop: React.FC<{ x: number; y: number; s: number; o?: number; children: React.ReactNode }> = ({ x, y, s, o = 1, children }) => {
  const B = 16, W = SW + 2 * B, H = SH + 2 * B;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H + 30, transform: `translate(${x - W / 2}px, ${y - H / 2}px) scale(${s})`, transformOrigin: `${W / 2}px ${H / 2}px`, opacity: o }}>
      <div style={{ position: "absolute", left: W / 2 - 900, top: H + 4, width: 1800, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(29,29,31,0.22) 0%, rgba(29,29,31,0) 70%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, borderRadius: 30, background: "#141416", boxShadow: "0 0 0 2px #C9CACE, 0 40px 90px -40px rgba(29,29,31,0.5)" }}>
        <div style={{ position: "absolute", left: B, top: B, width: SW, height: SH, borderRadius: 14, overflow: "hidden", background: C.white }}>{children}</div>
        <div style={{ position: "absolute", left: W / 2 - 4, top: 5, width: 8, height: 8, borderRadius: 4, background: "#2A2A2E" }} />
      </div>
      <div style={{ position: "absolute", left: W / 2 - 790, top: H - 2, width: 1580, height: 26, borderRadius: "4px 4px 18px 18px", background: "linear-gradient(180deg, #E8E9EC 0%, #CFD1D5 55%, #A9ABB0 100%)" }}>
        <div style={{ position: "absolute", left: 790 - 120, top: 0, width: 240, height: 9, borderRadius: "0 0 10px 10px", background: "#B9BBC0" }} />
      </div>
    </div>
  );
};
const PW = 392, PH = 830;                                    // the phone's screen
const Phone: React.FC<{ x: number; y: number; s: number; o?: number; children: React.ReactNode }> = ({ x, y, s, o = 1, children }) => {
  const B = 13, W = PW + 2 * B, H = PH + 2 * B;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${x - W / 2}px, ${y - H / 2}px) scale(${s})`, transformOrigin: "50% 50%", opacity: o }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 66, background: "#141416", boxShadow: "0 0 0 2px #C9CACE, 0 50px 90px -40px rgba(29,29,31,0.55)" }}>
        <div style={{ position: "absolute", left: B, top: B, width: PW, height: PH, borderRadius: 54, overflow: "hidden", background: C.white }}>{children}</div>
        <div style={{ position: "absolute", left: W / 2 - 62, top: 26, width: 124, height: 36, borderRadius: 18, background: "#0A0A0B" }} />
      </div>
    </div>
  );
};

/* ---------- the builder (inside the laptop) ---------- */
const AppBar: React.FC<{ right?: React.ReactNode }> = ({ right }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: 64, background: C.white, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", boxSizing: "border-box" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 28, color: C.ink, letterSpacing: "-0.02em" }}>Creoble<span style={{ color: C.blue }}>.</span></div>
    {right}
  </div>
);
const FIELDS = [
  { q: "What do you do?", a: "A family bakery in Aarhus", at: "w:what2" },
  { q: "What do you offer?", a: "Sourdough, cakes and catering", at: "w:what3" },
  { q: "What makes you different?", a: "Organic flour, baked fresh every morning", at: "w:what4" },
];
const Tell: React.FC<{ g: number }> = ({ g }) => {
  const btn = k(g, "w:let", 0.5), press = g >= f("w:ai") && g < f("w:ai") + 5 ? 1 : 0;
  const working = k(g, "w:ai+0.15", 0.5);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F7F7F4" }}>
      <AppBar right={<div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 16, color: C.gray }}>Step 1 of 2</div>} />
      <div style={{ position: "absolute", left: SW / 2 - 400, top: 110, width: 800, height: 610, borderRadius: 28, background: C.white, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 24px 60px -30px rgba(29,29,31,0.25)" }}>
        <div style={{ position: "absolute", left: 52, top: 44, opacity: 1 - working }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.ink, letterSpacing: "-0.025em" }}>Tell us about your business</div>
          <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 19, color: C.gray, marginTop: 8 }}>A few sentences is all it takes.</div>
          {FIELDS.map((fl, i) => {
            const t = typed(g, `${fl.at}+0.1`, fl.a, 38), on = g >= f(fl.at) && g < f(FIELDS[i + 1]?.at ?? "w:then");
            return (
              <div key={i} style={{ marginTop: i === 0 ? 34 : 20 }}>
                <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 16, color: C.gray, marginBottom: 8 }}>{fl.q}</div>
                <div style={{ width: 696, height: 58, borderRadius: 14, background: on ? C.white : C.fill, border: `1.5px solid ${on ? C.blue : "transparent"}`, boxShadow: on ? `0 0 0 4px ${C.blueTint}` : undefined,
                  display: "flex", alignItems: "center", padding: "0 18px", boxSizing: "border-box", fontFamily: SANS, fontWeight: 500, fontSize: 21, color: C.ink }}>
                  {t}{on && <span style={{ width: 2, height: 26, marginLeft: 2, background: C.blue, opacity: Math.floor(g / 8) % 2 ? 1 : 0.2 }} />}
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 30, display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 28px", borderRadius: 999, background: C.blue, color: C.white, fontFamily: SANS, fontWeight: 600, fontSize: 20,
            opacity: 0.35 + 0.65 * btn, transform: `scale(${1 - press * 0.04})`, boxShadow: btn > 0.5 ? `0 12px 28px -12px ${C.blueGlow}` : undefined }}><Ico n="spark" s={20} c={C.white} />Build my website</div>
        </div>
        {/* AI at work */}
        {working > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: working, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <svg width={120} height={120} viewBox="0 0 120 120"><circle cx={60} cy={60} r={48} stroke={C.fill} strokeWidth={8} fill="none" />
              <circle cx={60} cy={60} r={48} stroke={C.blue} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={`${mix(10, 300, clamp01((g - f("w:ai")) / 45))} 400`} transform={`rotate(${(g - f("w:ai")) * 9} 60 60)`} /></svg>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink, marginTop: 30, letterSpacing: "-0.02em" }}>Building your website</div>
            <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
              {["Writing your texts", "Choosing colours and fonts", "Building your pages"].map((s, i) => {
                const d = k(g, off("w:do2", i * 0.35), 0.4);
                return <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 500, fontSize: 20, color: d > 0.5 ? C.ink : C.light }}>
                  <div style={{ width: 26, height: 26, borderRadius: 13, background: d > 0.5 ? C.blue : C.fill, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * d})` }}><Ico n="check" s={16} c={C.white} w={3.2} /></div>{s}</div>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- the website it builds (an example bakery) ---------- */
const Site: React.FC<{ g: number; build: number; edit: number; scroll?: number }> = ({ g, build, edit, scroll = 0 }) => {
  const part = (i: number) => clamp01(build * 5 - i * 0.8);       // blocks fall into place one by one
  const blk = (i: number): React.CSSProperties => ({ opacity: part(i), transform: `translateY(${(1 - part(i)) * 40}px)` });
  const hi = (p: number) => (p > 0 && p < 1 ? `0 0 0 ${3 * Math.sin(Math.PI * p)}px ${C.blue}` : undefined);
  const e1 = k(g, "w:it", 0.6), e2 = k(g, "w:it+0.25", 0.6);
  const sel = k(g, "w:change", 0.4) * (1 - k(g, "w:it", 0.4, DEPART));   // the headline selected, ready to change
  return (
    <div style={{ position: "absolute", inset: 0, background: "#FFFDF9", transform: `translateY(${-scroll}px)` }}>
      <div style={{ ...blk(0), position: "absolute", left: 0, top: 0, width: SW, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 56px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 28, color: "#3A2A1E" }}>Bageriet Lund</div>
        <div style={{ display: "flex", gap: 34, fontFamily: SANS, fontWeight: 500, fontSize: 17, color: "#5A4A3E" }}><span>Bread</span><span>Cakes</span><span>Catering</span><span>Visit</span></div>
      </div>
      <div style={{ ...blk(1), position: "absolute", left: 56, top: 132, width: 520, borderRadius: 14, boxShadow: hi(e1) }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 56, lineHeight: 1.06, color: "#2B1E15", letterSpacing: "-0.02em", position: "relative" }}>
          {sel > 0 && <div style={{ position: "absolute", left: -14, top: -12, right: -14, bottom: -12, border: `3px solid ${C.blue}`, borderRadius: 10, opacity: sel }}>
            {[[-7, -7], [-7, null], [null, -7], [null, null]].map(([l, t], i) => <div key={i} style={{ position: "absolute", width: 12, height: 12, borderRadius: 3, background: C.white, border: `3px solid ${C.blue}`,
              left: l ?? undefined, right: l === null ? -7 : undefined, top: t ?? undefined, bottom: t === null ? -7 : undefined }} />)}
            <div style={{ position: "absolute", left: -3, top: -44, padding: "6px 12px", borderRadius: 8, background: C.blue, color: C.white, fontFamily: SANS, fontWeight: 600, fontSize: 18, letterSpacing: 0 }}>Headline</div>
          </div>}
          <span style={{ opacity: 1 - e1 }}>Fresh sourdough, baked every morning.</span>
          <span style={{ position: "absolute", left: 0, top: 0, opacity: e1 }}>Warm bread, made with love every morning.</span>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 19, lineHeight: 1.5, color: "#6B5B4E", marginTop: 22 }}>Organic flour, slow dough and a family recipe, in the heart of Aarhus.</div>
        <div style={{ marginTop: 28, display: "inline-flex", padding: "15px 28px", borderRadius: 999, background: "#2B1E15", color: "#FFFDF9", fontFamily: SANS, fontWeight: 600, fontSize: 18 }}>Order today</div>
      </div>
      <div style={{ ...blk(2), position: "absolute", left: 640, top: 112, width: 584, height: 400, borderRadius: 22, overflow: "hidden" }}>
        <Img src={staticFile("img/pastry.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + 0.03 * build})` }} />
      </div>
      {/* the opening hours, added by typing */}
      <div style={{ position: "absolute", left: 56, top: 548, width: 1168, height: mix(0, 64, e2), overflow: "hidden", borderRadius: 14, background: "#F6EEE4", boxShadow: hi(e2), opacity: e2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 64, padding: "0 26px", fontFamily: SANS, fontWeight: 600, fontSize: 18, color: "#3A2A1E" }}>
          <span>Opening hours</span><span style={{ fontWeight: 500, color: "#6B5B4E" }}>Mon–Fri 6–18 · Sat–Sun 7–15</span>
        </div>
      </div>
      {[["img/flour.jpg", "Sourdough"], ["img/cake.jpg", "Cakes"], ["img/pastry.jpg", "Catering"]].map(([src, t], i) => (
        <div key={t} style={{ ...blk(3 + i * 0.4), position: "absolute", left: 56 + i * 396, top: 548 + mix(0, 84, e2), width: 376, height: 230, borderRadius: 18, overflow: "hidden", background: "#F2EAE0" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: 170, objectFit: "cover", objectPosition: i === 2 ? "30% 60%" : "50% 50%" }} />
          <div style={{ padding: "16px 20px", fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: "#2B1E15" }}>{t}</div>
        </div>
      ))}
    </div>
  );
};
const MobileSite: React.FC<{ g: number; build: number }> = ({ g, build }) => {
  const e1 = k(g, "w:it", 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#FFFDF9", opacity: build }}>
      <div style={{ position: "absolute", left: 26, top: 74, fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: "#3A2A1E" }}>Bageriet Lund</div>
      <div style={{ position: "absolute", left: 18, top: 120, width: PW - 36, height: 260, borderRadius: 22, overflow: "hidden" }}><Img src={staticFile("img/pastry.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
      <div style={{ position: "absolute", left: 26, top: 404, width: PW - 52, fontFamily: SERIF, fontWeight: 500, fontSize: 34, lineHeight: 1.08, color: "#2B1E15" }}>
        <span style={{ opacity: 1 - e1 }}>Fresh sourdough, baked every morning.</span><span style={{ position: "absolute", left: 0, top: 0, opacity: e1 }}>Warm bread, made with love every morning.</span>
      </div>
      <div style={{ position: "absolute", left: 26, top: 560, padding: "13px 24px", borderRadius: 999, background: "#2B1E15", color: "#FFFDF9", fontFamily: SANS, fontWeight: 600, fontSize: 16 }}>Order today</div>
      <div style={{ position: "absolute", left: 18, top: 640, width: PW - 36, height: 170, borderRadius: 18, overflow: "hidden" }}><Img src={staticFile("img/cake.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    </div>
  );
};

/* ---------- where the devices are (a slow, Apple-like camera on the product) ---------- */
type Key = [string, number, number, number];   // label, x, y, scale (the laptop)
const LKEYS: Key[] = [["tell", 960, 1500, 0.8], ["tell+0.9", 960, 560, 0.8], ["w:what2-0.3", 960, 560, 0.8], ["w:what2+0.9", 960, 530, 0.98], ["w:then-0.2", 960, 530, 0.98],
  ["w:then+0.8", 960, 560, 0.8], ["w:complete-0.2", 960, 560, 0.8], ["w:website2-0.1", 780, 560, 0.74], ["happy", 780, 560, 0.74], ["happy+0.9", 960, 560, 0.56],
  ["w:499-0.35", 960, 560, 0.56], ["w:499+0.4", 960, 420, 0.46], ["host+0.4", 960, -500, 0.46], ["simple-0.1", 820, 1500, 0.66], ["simple+0.9", 820, 600, 0.66], ["brand-0.3", 820, 600, 0.68], ["brand+0.5", 820, 1500, 0.66]];
const keyed = (g: number, keys: Key[]) => {
  let x = keys[0][1], y = keys[0][2], s = keys[0][3];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (g < f(a[0])) break;
    const t = MOVE(clamp01((g - f(a[0])) / Math.max(1, f(b[0]) - f(a[0]))));
    x = mix(a[1], b[1], t); y = mix(a[2], b[2], t); s = mix(a[3], b[3], t);
  }
  return { x, y, s };
};

/* ---------- the edit prompt, the free preview, the price, hosting ---------- */
const Prompt: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "w:want", 0.7), o = k(g, "preview", 0.5, DEPART);
  if (a <= 0 || o >= 1) return null;
  const t = typed(g, "w:just2-0.05", "Make the headline warmer and add our opening hours", 40);
  const sent = g >= f("w:it-0.05");
  return (
    <div style={{ position: "absolute", left: 780 - 470, top: 0, width: 940, height: 84, borderRadius: 42, transform: `translateY(${880 + (1 - a) * 40}px)`, opacity: a * (1 - o),
      background: "rgba(255,255,255,0.96)", boxShadow: "0 0 0 1px rgba(29,29,31,0.06), 0 30px 60px -24px rgba(29,29,31,0.35)", display: "flex", alignItems: "center", gap: 16, padding: "0 14px 0 30px", boxSizing: "border-box" }}>
      <Ico n="spark" s={26} c={C.blue} />
      <div style={{ flex: 1, fontFamily: SANS, fontWeight: 500, fontSize: 24, color: t ? C.ink : C.light, whiteSpace: "nowrap", overflow: "hidden" }}>{t || "Describe a change…"}</div>
      <div style={{ width: 56, height: 56, borderRadius: 28, background: sent ? C.blueDeep : C.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sent && g < f("w:it") + 5 ? 0.92 : 1})` }}><Ico n="up" s={28} c={C.white} w={3} /></div>
    </div>
  );
};
const Badge: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "w:preview", 0.6), o = k(g, "happy-0.35", 0.4, DEPART);
  if (a <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", transform: `translateY(${110 + (1 - a) * 20}px)`, opacity: a * (1 - o) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 26px", borderRadius: 999, background: C.white, boxShadow: "0 0 0 1px rgba(29,29,31,0.06), 0 16px 40px -20px rgba(29,29,31,0.3)",
        fontFamily: SANS, fontWeight: 600, fontSize: 24, color: C.ink }}>
        <Ico n="eye" s={26} c={C.blue} />Preview <span style={{ color: C.blue }}>for free</span>
      </div>
    </div>
  );
};
const Price: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("happy") || g > f("host+0.8")) return null;
  const n = k(g, "w:499", 0.9), kr = k(g, "w:kroner-0.05", 0.7), sub = k(g, "w:kroner+0.1", 0.6), out = k(g, "host-0.1", 0.45, MOVE);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <Say g={g} y={110} size={56} weight={600} color={C.gray} words={[{ t: "Happy", at: "w:happy" }, { t: "with", at: "w:with" }, { t: "the", at: "w:the2" }, { t: "result?", at: "w:result" }]} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", alignItems: "flex-end", transform: `translateY(${560 + (1 - n) * 40}px)`,
        fontFamily: SANS, fontWeight: 700, fontSize: 230, letterSpacing: "-0.05em", color: C.ink, lineHeight: 1 }}>
        <span style={{ opacity: n, filter: n < 1 ? `blur(${(1 - n) * 12}px)` : undefined }}>499</span>
        <span style={{ display: "inline-block", maxWidth: mix(0, 250, kr), overflow: "hidden", whiteSpace: "pre", fontSize: 120, fontWeight: 600, letterSpacing: "-0.03em", transform: `translateY(-15px)`,
          opacity: kr, filter: kr < 1 ? `blur(${(1 - kr) * 10}px)` : undefined }}> kr.</span></div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${820 + (1 - sub) * 16}px)`, opacity: sub, fontFamily: SANS, fontWeight: 500, fontSize: 36, color: C.gray, letterSpacing: "-0.01em" }}>
        One payment. No subscription. <span style={{ color: C.blue }}>Yours.</span></div>
    </AbsoluteFill>
  );
};
const Hosting: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("host-0.1") || g > f("w:no+0.7")) return null;
  const bar = k(g, "w:hosting", 0.8), live = k(g, "w:hosting+0.5", 0.5), out = k(g, "w:no-0.05", 0.6, DEPART);
  const ticks = [["globe", "Your own domain"], ["mail", "Email included"], ["server", "European servers"]];
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <Say g={g} y={170} size={72} words={[{ t: "Need", at: "w:need" }, { t: "hosting?", at: "w:hosting", blue: true }]} />
      <div style={{ position: "absolute", left: 960 - 420, top: 0, width: 840, height: 96, borderRadius: 48, transform: `translateY(${360 + (1 - bar) * 30}px) scale(${0.94 + 0.06 * bar})`, opacity: bar,
        background: C.white, boxShadow: "0 0 0 1px rgba(29,29,31,0.06), 0 30px 60px -28px rgba(29,29,31,0.35)", display: "flex", alignItems: "center", gap: 18, padding: "0 34px", boxSizing: "border-box" }}>
        <Ico n="lock" s={30} c={C.gray} />
        <div style={{ flex: 1, fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.ink, letterSpacing: "-0.015em" }}>bagerietlund.dk</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.blueDeep, opacity: live }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: C.blue, boxShadow: `0 0 0 ${6 * Math.abs(Math.sin(g / 14))}px ${C.blueTint}` }} />Live</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 540, width: 1920, display: "flex", justifyContent: "center", gap: 80 }}>
        {ticks.map(([ic, t], i) => {
          const a = k(g, off("w:covered", -0.1 + i * 0.18), 0.6);
          return <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: a, transform: `translateY(${(1 - a) * 24}px)` }}>
            <div style={{ width: 92, height: 92, borderRadius: 26, background: C.blueTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={ic} s={46} c={C.blueDeep} w={2.2} /></div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: C.ink, letterSpacing: "-0.015em" }}>{t}</div>
          </div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${800 + (1 - k(g, "w:too", 0.6)) * 14}px)`, opacity: k(g, "w:too", 0.6), fontFamily: SANS, fontWeight: 500, fontSize: 30, color: C.gray }}>
        From 83 kr/month. Domain and email included.</div>
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const L = keyed(g, LKEYS);
  const build = k(g, "w:in-0.05", 2.6, Easing.bezier(0.3, 0.5, 0.35, 1));
  const siteOn = k(g, "w:in-0.1", 0.5);
  const phoneIn = k(g, "w:website2-0.1", 0.9, MOVE) * (1 - k(g, "happy", 0.6, DEPART)) + k(g, "simple+0.2", 0.9, MOVE) * (1 - k(g, "brand", 0.6, DEPART));
  const scroll = mix(0, 180, k(g, "w:everything", 1.4, MOVE)) * (1 - k(g, "happy", 0.6, MOVE));
  const lo = 1 - k(g, "w:499-0.35", 0.5, DEPART) + k(g, "simple-0.1", 0.6);
  const meetOut = k(g, "tell-0.1", 0.5, MOVE);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 48%, #FFFFFF 0%, rgba(255,255,255,0) 70%)" }} />
      {/* 1 · the question */}
      <Say g={g} y={380} size={104} out="meet-0.1" words={[{ t: "What", at: "w:what" }, { t: "if", at: "w:if" }, { t: "building", at: "w:building" }, { t: "a", at: "w:a" }, { t: "website", at: "w:website" }]} />
      <Say g={g} y={510} size={104} out="meet-0.05" words={[{ t: "was", at: "w:was" }, { t: "this", at: "w:this" }, { t: "simple?", at: "w:simple", blue: true }]} />
      {/* 2 · Meet Creoble. */}
      {g >= f("meet") && g < f("tell+0.8") && <>
        <Say g={g} y={330} size={48} weight={500} color={C.gray} out="tell-0.1" words={[{ t: "Meet", at: "w:meet" }]} />
        <Wordmark x={960} y={mix(520, 210, meetOut)} size={mix(210, 60, meetOut)} o={k(g, "w:creoble-0.35", 0.9) * (1 - clamp01((meetOut - 0.7) / 0.3))} dot={k(g, "w:creoble+0.15", 0.6)} />
      </>}
      {/* 3–8 · the product */}
      <Laptop x={L.x} y={L.y} s={L.s} o={clamp01(lo) * (g < f("host+0.6") || g > f("simple-0.2") ? 1 : 0)}>
        {g >= f("w:in-0.15") && <Site g={g} build={build} edit={0} scroll={scroll} />}
        {g < f("w:minutes+0.5") && <div style={{ position: "absolute", inset: 0, opacity: 1 - siteOn }}><Tell g={g} /></div>}
      </Laptop>
      <Phone x={mix(2300, 1530, phoneIn)} y={600} s={0.7} o={clamp01(phoneIn * 1.5)}><MobileSite g={g} build={1} /></Phone>
      <Say g={g} y={92} size={60} out="w:what2-0.2" words={[{ t: "Just", at: "w:just" }, { t: "tell", at: "w:tell" }, { t: "us", at: "w:us" }, { t: "about", at: "w:about" }, { t: "your", at: "w:your" }, { t: "business.", at: "w:business", blue: true }]} />
      <Say g={g} y={92} size={60} out="w:in-0.1" words={[{ t: "Then", at: "w:then" }, { t: "let", at: "w:let" }, { t: "AI", at: "w:ai", blue: true }, { t: "do", at: "w:do2" }, { t: "the", at: "w:the" }, { t: "rest.", at: "w:rest" }]} />
      <Say g={g} y={92} size={60} out="w:want" words={[{ t: "A", at: "w:complete-0.1" }, { t: "complete", at: "w:complete" }, { t: "website,", at: "w:complete+0.15" }, { t: "in", at: "w:ready" }, { t: "minutes.", at: "w:ready+0.12", blue: true }]} />
      <Say g={g} y={92} size={60} out="preview-0.05" words={[{ t: "Just", at: "w:just2" }, { t: "describe", at: "w:describe" }, { t: "it.", at: "w:it", blue: true }]} />
      <Prompt g={g} />
      <Badge g={g} />
      {/* it's yours: a mark on the finished site */}
      {g >= f("w:its-0.1") && g < f("w:499+0.4") && (() => {
        const a = k(g, "w:its", 0.6), o = k(g, "w:499-0.35", 0.45, DEPART);
        return <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${960 + 300}px, ${330 + (1 - a) * 20}px) scale(${0.8 + 0.2 * a})`, opacity: a * (1 - o) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 999, background: C.blue, color: C.white, fontFamily: SANS, fontWeight: 600, fontSize: 26,
            boxShadow: `0 16px 34px -14px ${C.blueGlow}` }}><Ico n="check" s={26} c={C.white} w={3.2} />It’s yours</div>
        </div>;
      })()}
      <Price g={g} />
      <Hosting g={g} />
      {/* 11 · no coding, no complexity */}
      {g >= f("nocode-0.1") && g < f("simple+0.6") && <>
        {(() => {
          const a = k(g, "w:no", 0.8), x = k(g, "w:coding", 0.5, MOVE), o = k(g, "w:no2", 0.8);
          return <div style={{ position: "absolute", left: 960 - 64, top: 196, width: 128, height: 128, borderRadius: 32, background: C.blue, boxShadow: `0 20px 40px -18px ${C.blueGlow}`,
            display: "flex", alignItems: "center", justifyContent: "center", opacity: a * (1 - o), filter: o > 0 ? `blur(${o * 8}px)` : undefined, transform: `translateY(${(1 - a) * 24}px) scale(${0.9 + 0.1 * a})` }}>
            <Ico n="code" s={64} c={C.white} w={2.4} />
            {/* struck through on "coding" */}
            <div style={{ position: "absolute", left: 22, top: 61, width: 84, height: 6, borderRadius: 3, background: C.white, boxShadow: `0 0 0 3px ${C.blue}`, transform: `rotate(-40deg) scaleX(${x})`, opacity: x > 0 ? 1 : 0 }} />
          </div>;
        })()}
        <Say g={g} y={372} size={128} out="simple-0.1" words={[{ t: "No", at: "w:no" }, { t: "coding.", at: "w:coding" }]} />
        <Say g={g} y={520} size={128} out="simple-0.05" words={[{ t: "No", at: "w:no2" }, { t: "complexity.", at: "w:complexity", blue: true }]} />
      </>}
      {/* 12 · made simple */}
      <Say g={g} y={92} size={64} out="brand-0.1" words={[{ t: "Just", at: "w:just4" }, { t: "your", at: "w:your3" }, { t: "website,", at: "w:website3" }, { t: "made", at: "w:made" }, { t: "simple.", at: "w:simple2", blue: true }]} />
      {/* 13 · Creoble. */}
      {g >= f("brand") && <>
        <Wordmark x={960} y={500} size={190} o={k(g, "brand+0.15", 1.0)} dot={k(g, "w:creoble2+0.3", 0.6)} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${648 + (1 - k(g, "w:creoble2+0.6", 0.8)) * 16}px)`, opacity: k(g, "w:creoble2+0.6", 0.8),
          fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.gray, letterSpacing: "-0.01em" }}>Build your website for free at <span style={{ color: C.blueDeep }}>creoble.dk</span></div>
      </>}
    </AbsoluteFill>
  );
};
