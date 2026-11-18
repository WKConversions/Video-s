// K.B hero film: the shared kit (brand tokens, time helpers, SaaS centred type, UI shells). LEAD-OWNED: builders read it
// and import from it, they do not edit it. Brand from kruslockbosconsultancy.com: bright #F7F7F7, navy #293A51, cyan
// #38C8FF, card #EBECF4, Montserrat; the square K.B tile. Karl: "the bright look of the website is the leading colour
// approach, instead of primarily blue as a background"; "clean variety of colour use".
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, spring, staticFile } from "remotion";

export const FPS = 60, W = 1920, H = 1080;
export const C = {
  bg: "#F7F7F7", white: "#FFFFFF", card: "#EBECF4", muted: "#F1F5F9", ink: "#252525", sub: "#49525B",
  navy: "#293A51", navy2: "#354C67", cyan: "#38C8FF", cyanSoft: "#E6F7FF", line: "rgba(41,58,81,.12)",
  // accents for variety (always on bright grounds): one pair per pillar, plus signal colours for UI states
  violet: "#7C6CFF", indigo: "#4F7BFF", mint: "#22C7A0", amber: "#FFB547", coral: "#FF7A66", green: "#22B573", red: "#F2545B",
};
export const GRAD = {
  brand: "linear-gradient(100deg, #38C8FF 0%, #4F7BFF 100%)",
  ai: "linear-gradient(100deg, #38C8FF 0%, #7C6CFF 100%)",         // pillar 1: AI, Agents & Automation
  dev: "linear-gradient(100deg, #4F7BFF 0%, #38C8FF 100%)",        // pillar 2: Software Development
  growth: "linear-gradient(100deg, #22C7A0 0%, #38C8FF 100%)",     // pillar 3: Growth Technology
  warm: "linear-gradient(100deg, #FFB547 0%, #FF7A66 100%)",
  navy: "linear-gradient(100deg, #293A51 0%, #3D5574 100%)",
};
export const FONT = "Montserrat, sans-serif", LOGO = "'Copperplate CC', serif";
export const SHADOW = { card: "0 24px 60px rgba(41,58,81,.14), 0 4px 12px rgba(41,58,81,.06)", soft: "0 10px 30px rgba(41,58,81,.10)", lift: "0 40px 90px rgba(41,58,81,.22)" };

// ---------- time helpers: t is SECONDS (a scene's local time) ----------
export const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const ease = { inOut: Easing.bezier(0.65, 0, 0.35, 1), out: Easing.bezier(0.16, 1, 0.3, 1), in: Easing.bezier(0.5, 0, 0.75, 0), smooth: Easing.bezier(0.42, 0, 0.18, 1) };
/** eased 0..1 from t0 over d seconds */
export const E = (t: number, t0: number, d: number, f: (x: number) => number = ease.inOut) => f(clamp((t - t0) / d));
/** a spring 0..1 starting at t0 (Apple-style: small overshoot). cfg: damping (default 14), stiffness (170), mass (0.9) */
export const S = (t: number, t0: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  t < t0 ? 0 : spring({ frame: (t - t0) * FPS, fps: FPS, config: { damping: 14, stiffness: 170, mass: 0.9, ...cfg } });
/** a slow endless drift (the frame is never still): amp px/deg, period s */
export const drift = (t: number, period = 6, amp = 8, phase = 0) => amp * Math.sin((2 * Math.PI * t) / period + phase);
export const rnd = (k: number) => { const s = Math.sin(k * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------- fonts ----------
const FACES = [["Montserrat", "montserrat-var-latin.woff2", "100 900"], ["Montserrat", "montserrat-var-latin-ext.woff2", "100 900"], ["Copperplate CC", "copperplate-cc-heavy.otf", "800"]];
export const useFonts = () => {
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = FACES.map(([f, file, w]) => `@font-face{font-family:'${f}';src:url(${staticFile("fonts/" + file)});font-weight:${w}}`).join("\n");
    document.head.appendChild(el);
    Promise.all([400, 500, 600, 700, 800].map((w) => document.fonts.load(`${w} 60px Montserrat`)).concat([document.fonts.load("800 60px 'Copperplate CC'")]))
      .then(() => { setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};

// ---------- stage: a bright ground that is always quietly alive ----------
/** full-frame bright background with soft drifting colour washes. tint: any of the accents (default cyan). */
export const Stage: React.FC<{ t: number; bg?: string; tint?: string; tint2?: string; children?: React.ReactNode; grid?: boolean }> = ({ t, bg = C.bg, tint = C.cyan, tint2 = C.indigo, children, grid }) => (
  <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
    {/* two soft glows that breathe slowly (moved by transform: box offsets would step), and an optional dot grid that holds still */}
    <div style={{ position: "absolute", width: 1100, height: 1100, left: -260, top: -420, borderRadius: "50%", background: `radial-gradient(circle, ${tint}2E, transparent 62%)`, transform: `translate3d(${drift(t, 9, 60).toFixed(2)}px, ${drift(t, 11, 40, 1).toFixed(2)}px, 0)`, willChange: "transform" }} />
    <div style={{ position: "absolute", width: 1200, height: 1200, right: -380, bottom: -560, borderRadius: "50%", background: `radial-gradient(circle, ${tint2}24, transparent 62%)`, transform: `translate3d(${(-drift(t, 10, 50, 2)).toFixed(2)}px, ${(-drift(t, 8, 40, 3)).toFixed(2)}px, 0)`, willChange: "transform" }} />
    {grid && <AbsoluteFill style={{ backgroundImage: `radial-gradient(${C.line} 1.5px, transparent 1.5px)`, backgroundSize: "44px 44px", opacity: 0.9 }} />}
    {children}
  </AbsoluteFill>
);

// ---------- the K.B mark ----------
/** the square K.B logo tile (navy rounded square, white K.B), centred on (x, y) */
export const KBTile: React.FC<{ x: number; y: number; size: number; style?: React.CSSProperties }> = ({ x, y, size, style }) => (
  <Img src={staticFile("logo/kb-logo-tile.svg")} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size * 0.075, boxShadow: SHADOW.card, ...style }} />
);

// ---------- SaaS centred type ----------
/** Words: a centred headline, word by word: each word rises through a soft blur on a spring. hi: words to highlight with
 *  a gradient ({ word: gradient }). out: time the line leaves (rises and fades). size px. lines split on "\n". */
export const Words: React.FC<{ t: number; t0: number; text: string; size?: number; y?: number; x?: number; hi?: Record<string, string>; stagger?: number; out?: number; weight?: number; color?: string; maxW?: number; align?: "center" | "left"; shine?: boolean }> =
  ({ t, t0, text, size = 96, y = 540, x = 960, hi = {}, stagger = 0.075, out = 1e9, weight = 700, color = C.navy, maxW = 1500, align = "center", shine = true }) => {
    let i = 0;
    const o = E(t, out, 0.4, ease.in);
    if (t < t0 || o >= 1) return null;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: maxW, transform: `translate(${align === "center" ? "-50%" : "0"}, -50%) translateY(${-50 * o}px)`, textAlign: align, opacity: 1 - o,
        fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight: 1.12, letterSpacing: -size * 0.025, color }}>
        {text.split("\n").map((ln, li) => (
          <div key={li}>{ln.split(" ").map((w, wi) => {
            const w0 = t0 + i * stagger, p = S(t, w0, { damping: 15, stiffness: 150 }), g = hi[w.replace(/[.,!?]/g, "")]; i++;
            // the sheen: a band of light crosses each highlighted word (0.9 s), every 1.7 s, once the word has landed
            const u = g && shine ? clamp((((t - w0 - 0.7) % 1.7) + 1.7) % 1.7 / 0.9) : 1, sheen = t > w0 + 0.7 && u < 1 ? (100 - 100 * u).toFixed(2) : "0";
            return (
              <span key={wi} style={{ display: "inline-block", marginRight: size * 0.26, transform: `translateY(${(1 - p) * size * 0.55}px) scale(${mix(0.92, 1, p)})`, opacity: clamp(p * 1.6), filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : "none",
                ...(g ? { backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.92) 50%, rgba(255,255,255,0) 60%), ${g}`, backgroundSize: "300% 100%, 100% 100%", backgroundPosition: `${sheen}% 0, 0 0`, backgroundRepeat: "no-repeat",
                  WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", paddingBottom: size * 0.1 } : {}) }}>{w}</span>
            );
          })}</div>
        ))}
      </div>
    );
  };
/** a small label above or below a headline (eyebrow): letter-spaced caps in a pill */
export const Eyebrow: React.FC<{ t: number; t0: number; text: string; x?: number; y: number; color?: string; out?: number }> = ({ t, t0, text, x = 960, y, color = C.cyan, out = 1e9 }) => {
  const p = S(t, t0), o = E(t, out, 0.3, ease.in);
  if (t < t0 || o >= 1) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${mix(0.8, 1, p)})`, opacity: clamp(p * 2) * (1 - o), padding: "12px 26px", borderRadius: 40, background: C.white,
    border: `2px solid ${color}`, color: C.navy, fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 4, whiteSpace: "nowrap", boxShadow: SHADOW.soft }}>{text}</div>;
};

/** Caption: the one small label of a text-free scene (the service's own name from K.B's site), always at the same place
 *  (top centre), so the viewer knows what the picture is. A pill with a gradient dot; arrives at t0 on a spring. */
export const Caption: React.FC<{ t: number; t0?: number; text: string; grad?: string; y?: number }> = ({ t, t0 = -0.15, text, grad = GRAD.brand, y = 104 }) => {
  const p = S(t, t0, { damping: 16, stiffness: 160 });
  if (t < t0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y - 44, height: 88, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 42px 0 32px", height: 88, borderRadius: 44, background: C.white, boxShadow: SHADOW.soft, border: `1px solid ${C.line}`,
        opacity: clamp(p * 2), transform: `translate3d(0, ${((1 - p) * -30).toFixed(2)}px, 0) scale(${mix(0.9, 1, p).toFixed(4)})`, willChange: "transform" }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: grad }} />
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C.navy, letterSpacing: -0.5, whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  );
};

// ---------- UI shells ----------
/** a window (macOS-like chrome). Position is its top-left; children are laid out inside its body (position: relative). */
export const Win: React.FC<{ x: number; y: number; w: number; h: number; title?: string; dark?: boolean; children?: React.ReactNode; style?: React.CSSProperties; bar?: number }> = ({ x, y, w, h, title, dark, children, style, bar = 52 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, background: dark ? "#1F2B3D" : C.white, boxShadow: SHADOW.card, overflow: "hidden", border: `1px solid ${dark ? "rgba(255,255,255,.08)" : C.line}`, ...style }}>
    <div style={{ height: bar, display: "flex", alignItems: "center", padding: "0 20px", gap: 9, borderBottom: `1px solid ${dark ? "rgba(255,255,255,.08)" : C.line}`, background: dark ? "#243247" : "#FBFBFD" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />)}
      {title && <div style={{ flex: 1, textAlign: "center", marginRight: 60, fontFamily: FONT, fontWeight: 600, fontSize: 18, color: dark ? "rgba(255,255,255,.7)" : C.sub }}>{title}</div>}
    </div>
    <div style={{ position: "relative", width: "100%", height: h - bar }}>{children}</div>
  </div>
);
/** a pill button, centred on (x, y). press 0..1 pushes it in. */
export const Btn: React.FC<{ x: number; y: number; text: string; bg?: string; color?: string; size?: number; press?: number; style?: React.CSSProperties }> = ({ x, y, text, bg = C.cyan, color = C.navy, size = 30, press = 0, style }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${1 - 0.06 * press})`, padding: `${size * 0.62}px ${size * 1.5}px`, borderRadius: size * 2, background: bg, color,
    fontFamily: FONT, fontWeight: 700, fontSize: size, whiteSpace: "nowrap", boxShadow: `0 ${14 - 8 * press}px 34px rgba(56,200,255,.35)`, ...style }}>{text}</div>
);
/** a small rounded chip */
export const Chip: React.FC<{ text: string; color?: string; bg?: string; size?: number; style?: React.CSSProperties }> = ({ text, color = C.navy, bg = C.white, size = 22, style }) => (
  <div style={{ display: "inline-block", padding: `${size * 0.4}px ${size * 0.9}px`, borderRadius: size * 1.4, background: bg, color, fontFamily: FONT, fontWeight: 600, fontSize: size, whiteSpace: "nowrap", border: `1px solid ${C.line}`, ...style }}>{text}</div>
);
/** a tool logo from K.B's own "Tools we build with" (public/tools): n8n-logo2, makecom-removebg-preview, claude-removebg-preview,
 *  pipedrive, odoo-1, resend, supabase, postgresql, typescript, nextjs-white (white, use on dark), expogo, payload-cms, vite-removebg-preview, datadog-1 … */
export const Tool: React.FC<{ name: string; size: number; style?: React.CSSProperties }> = ({ name, size, style }) => (
  <Img src={staticFile(`tools/${name}.png`)} style={{ width: size, height: size, objectFit: "contain", ...style }} />
);
/** the press of a click at time c (the hand's key `at`): 0..1..0, deepest at c + 0.11 s; use it to push the clicked thing in */
export const pressAt = (t: number, c: number) => (t < c + 0.03 ? 0 : Math.max(0, Math.sin(Math.PI * clamp((t - c - 0.03) / 0.34))));
/** a ripple ring spreading from a click at (x, y), starting at the deepest point of a click at time c */
export const Ripple: React.FC<{ t: number; c: number; x: number; y: number; color?: string; r?: number }> = ({ t, c, x, y, color = C.cyan, r = 120 }) => {
  const p = E(t, c + 0.11, 0.6, ease.out);
  if (p <= 0 || p >= 1) return null;
  const D = 40 + 2 * r, k = (40 + 2 * r * p) / D;   // one ring of the final size, grown by scale (a growing box would step)
  return <div style={{ position: "absolute", left: x - D / 2, top: y - D / 2, width: D, height: D, boxSizing: "border-box", borderRadius: "50%", border: `${(4 / k).toFixed(2)}px solid ${color}`, opacity: 0.8 * (1 - p), transform: `scale(${k.toFixed(4)})` }} />;
};
