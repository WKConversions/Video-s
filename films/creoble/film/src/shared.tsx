// Creoble v2 — the shared kit every scene builds with: the clock helpers, the statement type (Say), the wordmark,
// icons, the drawn devices, the example bakery site (desktop and mobile), the answer chips, a cursor, a 3D plane.
// Scenes import from here and never redefine these. Tokens and eases live in ./lib.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, MOVE, clamp01, mix } from "./lib";
import { off } from "./kinetic";

export const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
export const f = (at: string | number) => T.f(at);
export const SANS = "Inter", SERIF = "Fraunces";
export const typed = (g: number, at: string, text: string, cps = 34) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));

/* ---------- the statement type: words rise, fade and sharpen (Apple) ---------- */
export type Wd = { t: string; at: string; blue?: boolean };
export const Say: React.FC<{ g: number; words: Wd[]; y: number; size: number; out?: string; weight?: number; color?: string; x?: number }> = ({ g, words, y, size, out, weight = 600, color = C.ink, x }) => {
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
export const Wordmark: React.FC<{ x: number; y: number; size: number; o?: number; dot?: number }> = ({ x, y, size, o = 1, dot = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`, opacity: o, fontFamily: SERIF, fontWeight: 500, fontSize: size, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", lineHeight: 1 }}>
    Creoble<span style={{ display: "inline-block", color: C.blue, transform: `scale(${dot})`, transformOrigin: "50% 80%" }}>.</span>
  </div>
);

/* ---------- icons (SF-like monoline) ---------- */
export const P: Record<string, React.ReactNode> = {
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
  store: <><path d="M8 20 L11 9 H37 L40 20" /><path d="M8 20 a5 5 0 0 0 10.7 0 a5 5 0 0 0 10.6 0 a5 5 0 0 0 10.7 0" /><path d="M11 24 V39 H37 V24" /><path d="M20 39 V30 H28 V39" /></>,
  tag: <><path d="M24 7 H40 V23 L23 40 L7 24 Z" /><circle cx="33" cy="14" r="2.5" /></>,
  leaf: <><path d="M10 38 C10 20 22 10 40 9 C39 27 29 38 12 38" /><path d="M10 38 L26 22" /></>,
  desktop: <><rect x="6" y="9" width="36" height="24" rx="3" /><path d="M18 40 H30" /><path d="M24 33 V40" /></>,
  tablet: <><rect x="11" y="6" width="26" height="36" rx="4" /><path d="M22 37 H26" /></>,
  phone: <><rect x="15" y="5" width="18" height="38" rx="4" /><path d="M22 38 H26" /></>,
  pin: <><path d="M24 43 C24 43 37 30 37 20 a13 13 0 0 0 -26 0 C11 30 24 43 24 43 Z" /><circle cx="24" cy="20" r="4.5" /></>,
  sliders: <><path d="M8 14 H40 M8 24 H40 M8 34 H40" /><circle cx="16" cy="14" r="3.5" /><circle cx="31" cy="24" r="3.5" /><circle cx="21" cy="34" r="3.5" /></>,
  layout: <><rect x="6" y="8" width="36" height="32" rx="3" /><path d="M6 17 H42" /><path d="M20 17 V40" /></>,
  image: <><rect x="6" y="9" width="36" height="30" rx="3" /><circle cx="17" cy="19" r="3.5" /><path d="M8 36 L19 26 L27 33 L32 28 L41 36" /></>,
  palette: <><path d="M24 6 a18 18 0 1 0 0 36 c3 0 4 -2 4 -4 c0 -3 -3 -4 -3 -7 c0 -2 2 -3 4 -3 h5 c5 0 8 -3 8 -8 C42 12 34 6 24 6 Z" /><circle cx="15" cy="21" r="2.5" /><circle cx="22" cy="13" r="2.5" /><circle cx="32" cy="15" r="2.5" /></>,
  type: <><path d="M10 12 H38" /><path d="M24 12 V38" /><path d="M18 38 H30" /></>,
  card: <><rect x="5" y="11" width="38" height="26" rx="4" /><path d="M5 19 H43" /><path d="M11 30 H20" /></>,
};
export const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number }> = ({ n, s = 24, c = C.ink, w = 2.4 }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={w * (48 / s) * (s / 26)} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>{P[n]}</svg>
);

/* ---------- the devices (drawn, generic) ---------- */
export const SW = 1280, SH = 800;                                   // the laptop's screen
export const Laptop: React.FC<{ x: number; y: number; s: number; o?: number; children: React.ReactNode }> = ({ x, y, s, o = 1, children }) => {
  const B = 16, W = SW + 2 * B, H = SH + 2 * B;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H + 30, transform: `translate(${x - W / 2}px, ${y - H / 2}px) scale(${s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: `${W / 2}px ${H / 2}px`, opacity: o }}>
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
export const PW = 392, PH = 830;                                    // the phone's screen
export const Phone: React.FC<{ x: number; y: number; s: number; o?: number; children: React.ReactNode }> = ({ x, y, s, o = 1, children }) => {
  const B = 13, W = PW + 2 * B, H = PH + 2 * B;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${x - W / 2}px, ${y - H / 2}px) scale(${s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%", opacity: o }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 66, background: "#141416", boxShadow: "0 0 0 2px #C9CACE, 0 50px 90px -40px rgba(29,29,31,0.55)" }}>
        <div style={{ position: "absolute", left: B, top: B, width: PW, height: PH, borderRadius: 54, overflow: "hidden", background: C.white }}>{children}</div>
        <div style={{ position: "absolute", left: W / 2 - 62, top: 26, width: 124, height: 36, borderRadius: 18, background: "#0A0A0B" }} />
      </div>
    </div>
  );
};

/* ---------- the builder (inside the laptop) ---------- */
export const AppBar: React.FC<{ right?: React.ReactNode }> = ({ right }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: 64, background: C.white, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", boxSizing: "border-box" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 28, color: C.ink, letterSpacing: "-0.02em" }}>Creoble<span style={{ color: C.blue }}>.</span></div>
    {right}
  </div>
);
export const FIELDS = [
  { q: "What do you do?", a: "A family bakery in Aarhus", at: "w:what2" },
  { q: "What do you offer?", a: "Sourdough, cakes and catering", at: "w:what3" },
  { q: "What makes you different?", a: "Organic flour, baked fresh every morning", at: "w:what4" },
];
export const Tell: React.FC<{ g: number }> = ({ g }) => {
  const btn = k(g, "w:let", 0.5), press = g >= f("w:ai") && g < f("w:ai") + 8 ? 1 : 0;
  const formOut = k(g, "w:ai+0.1", 0.25, MOVE), working = k(g, "w:ai+0.3", 0.4);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F7F7F4" }}>
      <AppBar right={<div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 16, color: C.gray }}>Step 1 of 2</div>} />
      <div style={{ position: "absolute", left: SW / 2 - 400, top: 110, width: 800, height: 610, borderRadius: 28, background: C.white, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 24px 60px -30px rgba(29,29,31,0.25)" }}>
        <div style={{ position: "absolute", left: 52, top: 44, opacity: 1 - formOut }}>
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
          <div style={{ marginTop: 30, display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 28px", borderRadius: 999, background: press ? C.blueDeep : C.blue, color: C.white, fontFamily: SANS, fontWeight: 600, fontSize: 20,
            opacity: 0.35 + 0.65 * btn, transform: `scale(${1 - press * 0.06})`, boxShadow: press ? `0 0 0 6px ${C.blueTint}` : btn > 0.5 ? `0 12px 28px -12px ${C.blueGlow}` : undefined }}><Ico n="spark" s={20} c={C.white} />Build my website</div>
        </div>
        {/* AI at work */}
        {working > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: working, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <svg width={120} height={120} viewBox="0 0 120 120"><circle cx={60} cy={60} r={48} stroke={C.fill} strokeWidth={8} fill="none" />
              <circle cx={60} cy={60} r={48} stroke={C.blue} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={`${mix(10, 300, clamp01((g - f("w:ai")) / 45))} 400`} transform={`rotate(${(g - f("w:ai")) * 9} 60 60)`} /></svg>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink, marginTop: 30, letterSpacing: "-0.02em" }}>Building your website</div>
            <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
              {["Writing your texts", "Choosing colours and fonts", "Building your pages"].map((s, i) => {
                const d = k(g, off("w:do2", 0.25 + i * 0.35), 0.4);
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
export const Site: React.FC<{ g: number; build: number; edit?: number; scroll?: number; headline?: React.ReactNode; select?: boolean }> = ({ g, build, scroll = 0, headline, select = true }) => {
  const part = (i: number) => clamp01(build * 5 - i * 0.8);       // blocks fall into place one by one
  const blk = (i: number): React.CSSProperties => ({ opacity: part(i), transform: `translateY(${(1 - part(i)) * 40}px)` });
  const hi = (p: number) => (p > 0 && p < 1 ? `0 0 0 ${3 * Math.sin(Math.PI * p)}px ${C.blue}` : undefined);
  const e0 = k(g, "w:it", 0.25, MOVE), e1 = k(g, "w:it+0.2", 0.45), e2 = k(g, "w:it+0.25", 0.6);
  const sel = select ? k(g, "w:change", 0.4) * (1 - k(g, "w:it+0.45", 0.4, DEPART)) : 0;   // the headline selected, ready to change
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH + 260, background: "#FFFDF9", transform: `translateY(${-scroll}px)` }}>
      <div style={{ ...blk(0), position: "absolute", left: 0, top: 0, width: SW, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 56px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 28, color: "#3A2A1E" }}>Bageriet Lund</div>
        <div style={{ display: "flex", gap: 34, fontFamily: SANS, fontWeight: 500, fontSize: 17, color: "#5A4A3E" }}><span>Bread</span><span>Cakes</span><span>Catering</span><span>Visit</span></div>
      </div>
      <div style={{ ...blk(1), position: "absolute", left: 56, top: 132, width: 520, borderRadius: 14 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 56, lineHeight: 1.06, color: "#2B1E15", letterSpacing: "-0.02em", position: "relative" }}>
          {sel > 0 && <div style={{ position: "absolute", left: -14, top: -12, right: -14, bottom: -12, border: `3px solid ${C.blue}`, borderRadius: 10, opacity: sel }}>
            {[[-7, -7], [-7, null], [null, -7], [null, null]].map(([l, t], i) => <div key={i} style={{ position: "absolute", width: 12, height: 12, borderRadius: 3, background: C.white, border: `3px solid ${C.blue}`,
              left: l ?? undefined, right: l === null ? -7 : undefined, top: t ?? undefined, bottom: t === null ? -7 : undefined }} />)}
            <div style={{ position: "absolute", left: -3, top: -44, padding: "6px 12px", borderRadius: 8, background: C.blue, color: C.white, fontFamily: SANS, fontWeight: 600, fontSize: 18, letterSpacing: 0 }}>Headline</div>
          </div>}
          {headline ?? <>
            <span style={{ opacity: 1 - e0 }}>{HEAD_OLD}</span>
            <span style={{ position: "absolute", left: 0, top: 0, opacity: e1, transform: `translateY(${(1 - e1) * 10}px)` }}>{HEAD_NEW}</span>
          </>}
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 19, lineHeight: 1.5, color: "#6B5B4E", marginTop: 22 }}>Organic flour, slow dough and a family recipe, in the heart of Aarhus.</div>
        <div style={{ marginTop: 28, display: "inline-flex", padding: "15px 28px", borderRadius: 999, background: "#2B1E15", color: "#FFFDF9", fontFamily: SANS, fontWeight: 600, fontSize: 18 }}>Order today</div>
      </div>
      <div style={{ ...blk(2), position: "absolute", left: 640, top: 112, width: 584, height: 400, borderRadius: 22, overflow: "hidden" }}>
        <Img src={staticFile("img/pastry.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + 0.03 * build})`, filter: "saturate(0.82)" }} />
      </div>
      {/* the opening hours, added by typing */}
      <div style={{ position: "absolute", left: 56, top: 548, width: 1168, height: mix(0, 64, e2), overflow: "hidden", borderRadius: 14, background: "#F6EEE4", boxShadow: hi(e2), opacity: e2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 64, padding: "0 26px", fontFamily: SANS, fontWeight: 600, fontSize: 18, color: "#3A2A1E" }}>
          <span>Opening hours</span><span style={{ fontWeight: 500, color: "#6B5B4E" }}>Mon–Fri 6–18</span>
        </div>
      </div>
      {[["img/flour.jpg", "Sourdough"], ["img/cake.jpg", "Cakes"], ["img/pastry.jpg", "Catering"]].map(([src, t], i) => (
        <div key={t} style={{ ...blk(3 + i * 0.4), position: "absolute", left: 56 + i * 396, top: 548 + mix(0, 84, e2), width: 376, height: 230, borderRadius: 18, overflow: "hidden", background: "#F2EAE0" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: 170, objectFit: "cover", objectPosition: i === 2 ? "30% 60%" : "50% 50%", filter: "saturate(0.82)" }} />
          <div style={{ padding: "16px 20px", fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: "#2B1E15" }}>{t}</div>
        </div>
      ))}
      <div style={{ ...blk(4.2), position: "absolute", left: 56, top: 902 + mix(0, 84, e2) - 84, width: 1168, paddingTop: 22, borderTop: "1px solid #EADFD2", display: "flex", justifyContent: "space-between",
        fontFamily: SANS, fontWeight: 500, fontSize: 17, color: "#6B5B4E" }}><span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 20, color: "#3A2A1E" }}>Bageriet Lund</span><span>Aarhus · Order today</span></div>
    </div>
  );
};
export const MobileSite: React.FC<{ g: number; build: number }> = ({ g, build }) => {
  const e0 = k(g, "w:it", 0.25, MOVE), e1 = k(g, "w:it+0.2", 0.45);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#FFFDF9", opacity: build }}>
      <div style={{ position: "absolute", left: 26, top: 74, fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: "#3A2A1E" }}>Bageriet Lund</div>
      <div style={{ position: "absolute", left: 18, top: 120, width: PW - 36, height: 260, borderRadius: 22, overflow: "hidden" }}><Img src={staticFile("img/pastry.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.82)" }} /></div>
      <div style={{ position: "absolute", left: 26, top: 404, width: PW - 52, fontFamily: SERIF, fontWeight: 500, fontSize: 34, lineHeight: 1.08, color: "#2B1E15" }}>
        <span style={{ opacity: 1 - e0 }}>Fresh sourdough, baked every morning.</span><span style={{ position: "absolute", left: 0, top: 0, opacity: e1 }}>Warm bread, made with love every morning.</span>
      </div>
      <div style={{ position: "absolute", left: 26, top: 560, padding: "13px 24px", borderRadius: 999, background: "#2B1E15", color: "#FFFDF9", fontFamily: SANS, fontWeight: 600, fontSize: 16 }}>Order today</div>
      <div style={{ position: "absolute", left: 18, top: 640, width: PW - 36, height: 170, borderRadius: 18, overflow: "hidden" }}><Img src={staticFile("img/cake.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.82)" }} /></div>
    </div>
  );
};


export type Key = [string, number, number, number];   // label, x, y, scale (the laptop)
export const keyed = (g: number, keys: Key[]) => {
  let x = keys[0][1], y = keys[0][2], s = keys[0][3];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (g < f(a[0])) break;
    const t = MOVE(clamp01((g - f(a[0])) / Math.max(1, f(b[0]) - f(a[0]))));
    x = mix(a[1], b[1], t); y = mix(a[2], b[2], t); s = mix(a[3], b[3], t);
  }
  return { x, y, s };
};

/* ---------- v2 additions ---------- */
export const HEAD_OLD = "Fresh sourdough, baked every morning.";
export const HEAD_NEW = "Warm bread, made with love every morning.";
// The three answers the user gives (the film's thread object): asked in scene B, carried into the site in scene C.
export const ANSWERS = [
  { icon: "store", q: "What do you do?", a: "A family bakery in Aarhus", at: "w:what2" },
  { icon: "tag", q: "What do you offer?", a: "Sourdough, cakes and catering", at: "w:what3" },
  { icon: "leaf", q: "What makes you different?", a: "Organic flour, baked fresh every morning", at: "w:what4" },
];
// An answer as a floating chip (white pill, blue icon tile, the answer text). size = font size in px.
export const AnswerChip: React.FC<{ icon: string; text: string; size?: number; style?: React.CSSProperties }> = ({ icon, text, size = 26, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.5, padding: `${size * 0.45}px ${size * 0.8}px ${size * 0.45}px ${size * 0.45}px`, borderRadius: 999, background: C.white,
    boxShadow: "0 0 0 1px rgba(29,29,31,0.05), 0 18px 40px -18px rgba(29,29,31,0.28)", fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap", ...style }}>
    <div style={{ width: size * 1.7, height: size * 1.7, borderRadius: size * 0.85, background: C.blueTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={icon} s={size} c={C.blueDeep} w={2.2} /></div>
    {text}
  </div>
);
// A macOS-like pointer; its tip is at (x, y). press 0..1 shrinks it a little (a click).
export const Cursor: React.FC<{ x: number; y: number; s?: number; o?: number; press?: number }> = ({ x, y, s = 1, o = 1, press = 0 }) => (
  <svg width={40 * s} height={52 * s} viewBox="0 0 40 52" style={{ position: "absolute", left: x - 6 * s, top: y - 3 * s, opacity: o, transform: `scale(${1 - 0.12 * press})`, transformOrigin: "6px 3px",
    filter: "drop-shadow(0 6px 10px rgba(29,29,31,0.25))", overflow: "visible" }}>
    <path d="M6 3 L6 41 L15.5 32.5 L21.5 47 L28 44.2 L22 30 L34.5 30 Z" fill={C.ink} stroke={C.white} strokeWidth={3} strokeLinejoin="round" />
  </svg>
);
// A 3D plane: children laid out in a w x h box centred on (x, y), turned by rx / ry / rz degrees, pushed by z px,
// seen with a 2400 px perspective. The 0.01 deg term keeps slow moves off the pixel grid.
export const Plane: React.FC<{ x: number; y: number; w: number; h: number; rx?: number; ry?: number; rz?: number; z?: number; s?: number; o?: number; persp?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  x, y, w, h, rx = 0, ry = 0, rz = 0, z = 0, s = 1, o = 1, persp = 2400, children, style }) => {
  if (o <= 0.005) return null;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: o,
      transform: `perspective(${persp}px) translateZ(${z}px) rotateX(${rx + 0.01}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`, transformOrigin: "50% 50%", ...style }}>
      {children}
    </div>
  );
};
