// Moviqly film 2 — "Behind this prompt": the shared kit every scene builds with. Clock helpers; the statement type
// (Say); the studio floor (Ground: paper with the canvas area's dot grid, the landing glow only when asked) and the
// slow camera breath (Breath); depth helpers (Stage3D, surface); the logo; line icons; the app's own pieces rebuilt
// from the test site and the tour (prompt box, send, export button in its real states, user bubble, narrated activity,
// storyboard card, preview canvas, studio window, cursor); the fictional demo brand "Fjello" (its site, its 7-scene
// film drawn in code, the raw draft tile) and five earlier films; the four builder hand-offs, drawn exactly.
// Scenes import from here and never redefine these. Tokens in ./lib.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { C, CRAFT, FJ, FONT, GRAD, GRAD_D, LAND, LEAVE, LIN, SERIF, SHADOW, SHADOW_BIG, SHADOW_DEEP, SNAP, clamp01, mix } from "./lib";

export const k = (g: number, at: string | number, dur: number, ease = LAND) => T.k(g, at, dur, ease);
export const f = (at: string | number) => T.f(at);
export const kf = (g: number, a: number, d: number, e: (t: number) => number = LAND) => e(clamp01((g - a) / Math.max(1, d)));
export const typed = (g: number, at: string | number, text: string, cps = 30) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));

/* ---------- depth (the film's entrance pattern: things surface from behind) ---------- */
// surface(p): style for an element arriving from depth (p 0 → 1): it comes forward from scale 0.82, out of a blur,
// fading in. Use it for entrances; reverse it (1 → 0) for exits into depth.
export const surface = (p: number, from = 0.82): React.CSSProperties => {
  const q = clamp01(p);
  return { transform: `scale(${mix(from, 1, q)})`, opacity: clamp01(q * 1.8), filter: q < 1 ? `blur(${(1 - q) * 12}px)` : undefined };
};
// A 3D stage: children can use translateZ / rotateX / rotateY in a shared perspective (origin at the frame's centre).
export const Stage3D: React.FC<{ children?: React.ReactNode; persp?: number; ox?: number; oy?: number; style?: React.CSSProperties }> = ({ children, persp = 2400, ox = 960, oy = 540, style }) => (
  <div style={{ position: "absolute", inset: 0, perspective: persp, perspectiveOrigin: `${ox}px ${oy}px`, transformStyle: "preserve-3d", ...style }}>{children}</div>
);

/* ---------- statements ---------- */
// DM Sans 700, tight tracking, ink; a key word can carry the brand gradient (grad). Words surface from depth on their
// spoken word (scale and blur, no rise: film 2's entrance). Centred in `width` from x by default; br starts a line.
export type Wd = { t: string; at: string; grad?: boolean; muted?: boolean; br?: boolean };
export const Say: React.FC<{ g: number; words: Wd[]; x?: number; y: number; size: number; out?: string; align?: "left" | "center"; width?: number; color?: string }> = ({
  g, words, x = 0, y, size, out, align = "center", width = 1920, color = C.ink }) => {
  const o = out ? k(g, out, 0.35, LEAVE) : 0;
  if (o >= 1) return null;
  const lines: Wd[][] = [[]];
  words.forEach((w) => { if (w.br && lines[lines.length - 1].length) lines.push([]); lines[lines.length - 1].push(w); });
  return (
    <div style={{ position: "absolute", left: x, top: y, width, transform: `scale(${1 - o * 0.08})`, transformOrigin: align === "center" ? "50% 50%" : "0% 50%", opacity: 1 - o,
      filter: o > 0 ? `blur(${o * 10}px)` : undefined, fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: "-0.045em", lineHeight: 1.08 }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.25, whiteSpace: "nowrap" }}>
          {ln.map((w, i) => {
            const kk = k(g, w.at, 0.45);
            return <span key={i} style={{ display: "inline-block", color: w.muted ? C.soft : color, opacity: Math.min(1, kk * 1.8), transform: `scale(${0.8 + 0.2 * kk})`,
              filter: kk < 1 ? `blur(${(1 - kk) * 10}px)` : undefined, paddingBottom: size * 0.08,
              ...(w.grad ? { backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}) }}>{w.t}</span>;
          })}
        </div>
      ))}
    </div>
  );
};

/* ---------- the ground: the studio floor ---------- */
// The landing page's glow (its exact CSS). a = strength 0..1; rise lifts it (0 = as on the landing page, 1 = filling
// the frame); g drifts it gently.
const GLOW_CSS = "radial-gradient(ellipse 48% 48% at 50% 29%,#faf9f7 8%,#faf9f700 100%),radial-gradient(ellipse 76% 58% at 3% 110%,#a32bff 0%,#8e32fc 38%,#7739f100 100%),radial-gradient(ellipse 75% 55% at 100% 111%,#08deeb 0%,#18caf0 40%,#17c7ef00 100%),radial-gradient(ellipse 110% 79% at 50% 115%,#2848ff 6%,#426bff 43%,#779cf4a6 66%,#faf9f700 100%)";
export const Glow: React.FC<{ g: number; a?: number; rise?: number; y?: number }> = ({ g, a = 1, rise = 0, y = 0 }) => {
  if (a <= 0) return null;
  const dx = Math.sin(g / 80) * 24, dy = Math.cos(g / 95) * 14;
  return <div style={{ position: "absolute", left: -40 + dx, top: -rise * 560 + y + dy, width: 2000, height: 1080 + rise * 560 + 40, background: GLOW_CSS, opacity: a, pointerEvents: "none" }} />;
};
// The studio floor: warm paper with the studio canvas area's dot grid (#9783ab22 dots, scaled for film), and the
// landing glow at strength `glow` (0 inside the studio; the opening and the close raise it). Story draws it.
export const Ground: React.FC<{ g: number; glow?: number; dots?: number }> = ({ g, glow = 0, dots = 1 }) => (
  <div style={{ position: "absolute", inset: 0, background: C.paper, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -40, top: -40, right: -40, bottom: -40, opacity: dots, backgroundImage: `radial-gradient(${C.dot} 1.6px, transparent 1.7px)`, backgroundSize: "30px 30px", transform: `translate(${(g * 0.15) % 30}px, 0)` }} />
    <Glow g={g} a={glow} />
  </div>
);
// The camera's one slow breath for the whole film (camera.md: a push and drift of a few percent over many seconds,
// never on a transition). Story wraps every scene in it.
export const breath = (g: number) => {
  const t = g / 30;
  return { s: 1.012 + 0.01 * Math.sin((t / 21) * Math.PI * 2 - 1.2), x: 14 * Math.sin((t / 17) * Math.PI * 2), y: 8 * Math.sin((t / 23) * Math.PI * 2 + 0.6) };
};

/* ---------- the logo ---------- */
// The gradient "M" mark (Moviqly's own file, 821×668). size = height px. p 0..1 builds it (grows in, diagonal wipe).
export const M_RATIO = 821 / 668;
export const MMark: React.FC<{ size: number; p?: number; style?: React.CSSProperties }> = ({ size, p = 1, style }) => {
  const e = LAND(clamp01(p)), w = size * M_RATIO, wipe = -20 + 160 * e;
  return (
    <div style={{ width: w, height: size, flex: "none", transform: `scale(${0.6 + 0.4 * e})`, opacity: clamp01(p * 3), ...style,
      WebkitMaskImage: p < 1 ? `linear-gradient(60deg, #000 ${wipe - 20}%, transparent ${wipe}%)` : undefined, maskImage: p < 1 ? `linear-gradient(60deg, #000 ${wipe - 20}%, transparent ${wipe}%)` : undefined }}>
      <Img src={staticFile("img/moviqly-mark.png")} style={{ width: w, height: size, display: "block" }} />
    </div>
  );
};
// The wordmark "moviqly" (lowercase, DM Sans 700, ink). size = font px. p 0..1 reveals letters left to right.
export const Wordmark: React.FC<{ size: number; p?: number; color?: string; style?: React.CSSProperties }> = ({ size, p = 1, color = C.ink, style }) => (
  <div style={{ display: "flex", fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: "-0.05em", color, lineHeight: 1, ...style }}>
    {"moviqly".split("").map((ch, i) => { const q = LAND(clamp01(p * 1.6 - i * 0.09)); return <span key={i} style={{ display: "inline-block", opacity: q, transform: `scale(${0.7 + 0.3 * q})`, filter: q < 1 ? `blur(${(1 - q) * 6}px)` : undefined }}>{ch}</span>; })}
  </div>
);
// Mark + wordmark lockup as in the app header. h = mark height.
export const Logo: React.FC<{ h: number; p?: number; style?: React.CSSProperties }> = ({ h, p = 1, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: h * 0.3, ...style }}>
    <MMark size={h} p={clamp01(p / 0.6)} /><Wordmark size={h * 0.9} p={clamp01((p - 0.35) / 0.65)} />
  </div>
);

/* ---------- icons (rounded line, as in the app) ---------- */
export const P: Record<string, React.ReactNode> = {
  clip: <><path d="M31 15 L17 29 a5 5 0 0 0 7 7 L38 22 a9 9 0 0 0 -13 -13 L11 23 a13 13 0 0 0 18 18 L41 29" /></>,
  mic: <><rect x="18" y="6" width="12" height="22" rx="6" /><path d="M11 22 a13 13 0 0 0 26 0 M24 35 V42" /></>,
  up: <><path d="M24 38 V10 M12 22 L24 10 L36 22" /></>,
  check: <><path d="M12 25 L20 33 L36 15" /></>,
  play: <><path d="M15 9 L39 24 L15 39 Z" /></>,
  pause: <><path d="M16 10 V38 M32 10 V38" /></>,
  download: <><path d="M24 8 V32 M13 22 L24 33 L35 22 M9 40 H39" /></>,
  expand: <><path d="M8 18 V8 H18 M30 8 H40 V18 M40 30 V40 H30 M18 40 H8 V30" /></>,
  spark: <><path d="M24 6 L27 20 L41 24 L27 28 L24 42 L21 28 L7 24 L21 20 Z" /></>,
  globe: <><circle cx="24" cy="24" r="17" /><path d="M7 24 H41" /><path d="M24 7 c-6 6 -6 28 0 34 c6 -6 6 -28 0 -34" /></>,
  palette: <><path d="M24 6 a18 18 0 0 0 0 36 c3 0 4 -2 4 -4 c0 -3 -3 -4 -1 -6 c2 -2 6 0 9 -1 c4 -1 6 -5 6 -9 C42 13 34 6 24 6 Z" /><circle cx="16" cy="20" r="2.5" /><circle cx="24" cy="14" r="2.5" /><circle cx="32" cy="18" r="2.5" /></>,
  film: <><rect x="6" y="9" width="36" height="30" rx="4" /><path d="M6 17 H42 M6 31 H42 M14 9 V17 M24 9 V17 M34 9 V17 M14 31 V39 M24 31 V39 M34 31 V39" /></>,
  file: <><path d="M12 5 H29 L37 13 V43 H12 Z" /><path d="M29 5 V13 H37" /></>,
  chevron: <><path d="M14 19 L24 29 L34 19" /></>,
  x: <><path d="M14 14 L34 34 M34 14 L14 34" /></>,
  loupe: <><circle cx="20" cy="20" r="12" /><path d="M29 29 L41 41" /></>,
  eye: <><path d="M4 24 c6 -10 13 -14 20 -14 s14 4 20 14 c-6 10 -13 14 -20 14 s-14 -4 -20 -14 Z" /><circle cx="24" cy="24" r="6" /></>,
  layers: <><path d="M24 6 L43 15 L24 24 L5 15 Z" /><path d="M5 24 L24 33 L43 24 M5 33 L24 42 L43 33" /></>,
  sliders: <><path d="M10 8 V40 M24 8 V40 M38 8 V40" /><circle cx="10" cy="28" r="4" /><circle cx="24" cy="16" r="4" /><circle cx="38" cy="32" r="4" /></>,
  bulb: <><path d="M17 30 c-4 -3 -7 -7 -7 -12 a14 14 0 0 1 28 0 c0 5 -3 9 -7 12 V35 H17 Z" /><path d="M18 41 H30" /></>,
  monitor: <><rect x="5" y="9" width="38" height="25" rx="3" /><path d="M17 41 H31 M24 34 V41" /></>,
  sidebar: <><rect x="6" y="8" width="36" height="32" rx="4" /><path d="M18 8 V40" /></>,
  portrait: <><rect x="15" y="6" width="18" height="36" rx="3" /></>,
  landscape: <><rect x="5" y="14" width="38" height="20" rx="3" /></>,
  square: <><rect x="10" y="10" width="28" height="28" rx="3" /></>,
};
export const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number; fill?: string; style?: React.CSSProperties }> = ({ n, s = 24, c = C.ink, w = 2, fill = "none", style }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill={fill} stroke={c} strokeWidth={(w * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none", ...style }}>{P[n]}</svg>
);
// The studio's done-check: a violet disc with a white tick (.step.done .step-icon). size px; p 0..1 lands it (no overshoot).
export const Check: React.FC<{ size?: number; p?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, p = 1, color = C.violet, style }) => {
  const q = SNAP(clamp01(p));
  return <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", transform: `scale(${0.5 + 0.5 * q})`, opacity: clamp01(q * 2), ...style }}><Ico n="check" s={size * 0.72} c={C.white} w={3} /></div>;
};

/* ---------- buttons ---------- */
// The round gradient send button (landing and chat). size px; press 0..1 squeezes it.
export const SendButton: React.FC<{ size?: number; press?: number; style?: React.CSSProperties }> = ({ size = 44, press = 0, style }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(125deg,#922bff,#3047ff 65%,#16cfe5)", display: "flex", alignItems: "center", justifyContent: "center",
    transform: `scale(${1 - 0.12 * press})`, boxShadow: `0 ${6 * (1 - press)}px 16px -6px rgba(84,42,255,0.6)`, flex: "none", ...style }}>
    <Ico n="up" s={size * 0.5} c={C.white} w={2.6} />
  </div>
);
// The black button ("Get started").
export const BlackButton: React.FC<{ text: string; size?: number; press?: number; style?: React.CSSProperties }> = ({ text, size = 22, press = 0, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.62}px ${size * 1.1}px`, borderRadius: size * 0.45, background: C.button, color: C.white,
    fontFamily: FONT, fontWeight: 600, fontSize: size, letterSpacing: "-0.01em", whiteSpace: "nowrap", transform: `scale(${1 - 0.06 * press})`, boxShadow: "0 10px 24px -12px rgba(23,23,23,0.6)", ...style }}>{text}</div>
);
// The studio's "Export MP4" button in its real states (editor.css .export-button:enabled): "Export MP4 ⤓" (the
// purple→blue gradient), "Export queued…", "Rendering 42%". state: "idle" | "queued" | number 0..1 (rendering).
export const ExportButton: React.FC<{ size?: number; state?: "idle" | "queued" | number; press?: number; style?: React.CSSProperties }> = ({ size = 17, state = "idle", press = 0, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.5, padding: `${size * 0.55}px ${size * 0.9}px`, borderRadius: size * 0.55, background: "linear-gradient(120deg,#942aff,#3047ff)",
    color: C.white, fontFamily: FONT, fontWeight: 500, fontSize: size, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", transform: `scale(${1 - 0.06 * press})`, boxShadow: "0 8px 20px -10px rgba(80,40,255,0.7)", position: "relative", overflow: "hidden", ...style }}>
    {typeof state === "number" && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${state * 100}%`, background: "rgba(255,255,255,0.18)" }} />}
    <span style={{ position: "relative", display: "flex", alignItems: "center", gap: size * 0.5 }}>
      {state === "idle" ? <>Export MP4 <Ico n="download" s={size * 0.95} c={C.white} w={2.4} /></> : state === "queued" ? "Export queued…" : `Rendering ${Math.round((state as number) * 100)}%`}
    </span>
  </div>
);

/* ---------- the landing prompt box ---------- */
// White, rounded, soft shadow; the brief (typed) or the placeholder; paperclip and mic bottom left, "Create ⌄" and
// the round send button bottom right. w = width (height ≈ 0.19 w). caret blinks after the text; press squeezes send.
export const PromptBox: React.FC<{ w?: number; text?: string; placeholder?: string; g?: number; caret?: boolean; press?: number; style?: React.CSSProperties }> = ({
  w = 900, text = "", placeholder = "Ask Moviqly to create a motion design…", g = 0, caret = false, press = 0, style }) => {
  const s = w / 900;
  return (
    <div style={{ width: w, background: C.white, borderRadius: 26 * s, boxShadow: SHADOW_BIG, border: `1px solid ${C.line}`, padding: `${24 * s}px ${26 * s}px ${18 * s}px`, boxSizing: "border-box", ...style }}>
      <div style={{ minHeight: 44 * s, fontFamily: FONT, fontSize: 30 * s, fontWeight: 500, letterSpacing: "-0.01em", color: text ? C.ink : C.soft, lineHeight: 1.3, whiteSpace: "pre-wrap" }}>
        {text || placeholder}{caret && <span style={{ display: "inline-block", width: 3 * s, height: 34 * s, marginLeft: 3 * s, verticalAlign: "-6%", background: C.blue, opacity: Math.floor(g / 9) % 2 === 0 ? 1 : 0 }} />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 * s, marginTop: 18 * s }}>
        {["clip", "mic"].map((n) => <div key={n} style={{ width: 44 * s, height: 44 * s, borderRadius: "50%", border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={n} s={22 * s} c={C.muted} /></div>)}
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: FONT, fontSize: 21 * s, color: C.muted, display: "flex", alignItems: "center", gap: 4 * s }}>Create<Ico n="chevron" s={18 * s} c={C.soft} /></div>
        <SendButton size={50 * s} press={press} />
      </div>
    </div>
  );
};
// The PromptBox's measured height at width w (its layout is fixed): use it to place the box exactly.
export const promptH = (w: number) => (w / 900) * 173;

/* ---------- the chat pieces (editor.css: .activity, .step, .storyboard) ---------- */
// The user's message: a lavender bubble. size = font px.
export const UserBubble: React.FC<{ text: string; size?: number; style?: React.CSSProperties }> = ({ text, size = 24, style }) => (
  <div style={{ display: "inline-block", maxWidth: 560 * (size / 24), background: C.lavender, color: C.ink, fontFamily: FONT, fontWeight: 500, fontSize: size, lineHeight: 1.35,
    padding: `${size * 0.6}px ${size * 0.85}px`, borderRadius: size * 0.9, borderTopRightRadius: size * 0.3, ...style }}>{text}</div>
);
// One narrated step. state: 0 waiting (grey ring), between 0 and 1 working (spinner), 1 done (violet check lands).
export type Step = { t: string; sub?: string; state: number };
const StepRow: React.FC<{ s: Step; size: number; g: number }> = ({ s, size, g }) => {
  const done = s.state >= 1, working = s.state > 0 && s.state < 1;
  return (
    <div style={{ display: "flex", gap: size * 0.6, alignItems: "flex-start", opacity: s.state <= 0 ? 0.45 : 1 }}>
      <div style={{ width: size * 1.1, height: size * 1.1, flex: "none", marginTop: size * 0.12, position: "relative" }}>
        {done ? <Check size={size * 1.1} p={1} />
          : working ? <svg width={size * 1.1} height={size * 1.1} viewBox="0 0 24 24" style={{ transform: `rotate(${g * 14}deg)` }}><circle cx="12" cy="12" r="9" fill="none" stroke="#E2D8EE" strokeWidth="3" /><path d="M12 3 a9 9 0 0 1 9 9" fill="none" stroke={C.violet} strokeWidth="3" strokeLinecap="round" /></svg>
            : <div style={{ position: "absolute", inset: size * 0.08, borderRadius: "50%", border: `2px solid ${C.line}` }} />}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: size, color: working ? "#6B3FC4" : C.label, letterSpacing: "-0.01em", lineHeight: 1.35 }}>{s.t}</div>
        {s.sub && s.state > 0 && <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: size * 0.85, color: C.detail, marginTop: size * 0.12, lineHeight: 1.4 }}>{s.sub}</div>}
      </div>
    </div>
  );
};
// The activity: the AI narrating its work. Header: the M mark, "Moviqly", the clock right ("Working 1:23" /
// "Worked for 3:48"). steps: the list (or `fold` to show the folded "▸ 11 steps" line). card = draw it as a white card.
export const Activity: React.FC<{ g: number; steps?: Step[]; clock: string; w?: number; size?: number; fold?: string; card?: boolean; style?: React.CSSProperties }> = ({ g, steps = [], clock, w = 620, size = 22, fold, card = true, style }) => (
  <div style={{ width: w, boxSizing: "border-box", ...(card ? { background: C.white, borderRadius: size * 0.9, border: `1px solid ${C.card}`, boxShadow: SHADOW, padding: size * 1.0 } : {}), ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.5, marginBottom: fold ? size * 0.5 : size * 0.8 }}>
      <MMark size={size * 1.1} /><div style={{ fontFamily: FONT, fontWeight: 600, fontSize: size, color: "#443450" }}>Moviqly</div>
      <div style={{ flex: 1 }} /><div style={{ fontFamily: FONT, fontSize: size * 0.85, color: "#A395AF", fontVariantNumeric: "tabular-nums" }}>{clock}</div>
    </div>
    {fold ? <div style={{ display: "flex", alignItems: "center", gap: size * 0.45, fontFamily: FONT, fontSize: size * 0.9, color: "#8F7D9E" }}><Ico n="chevron" s={size * 0.8} c="#A28FB3" style={{ transform: "rotate(-90deg)" }} />{fold}</div>
      : <div style={{ display: "grid", gap: size * 0.7 }}>{steps.map((s, i) => <StepRow key={i} s={s} size={size} g={g} />)}</div>}
  </div>
);
// The steps Moviqly narrates for the Fjello film (the real step names from the tour, for the demo brand).
export const FJ_STEPS: { t: string; sub: string }[] = [
  { t: "Read fjello.com", sub: "8 sections · 2 numbers · 1 quote · colors #1F4D3B / #F07A2C · Fraunces type · logo" },
  { t: "Understood Fjello", sub: "Boots and packs for hikers, tested on 120 trails." },
  { t: "Looked at 5 earlier films to make this one different", sub: "91% alike to the closest earlier film → a new idea" },
  { t: "Form: Feature tour", sub: "chosen from Feature tour, Product demo, Proof first" },
  { t: "Found the idea", sub: "“Fjello gear goes further than the trail.”" },
  { t: "Art direction", sub: "pine world · ember accents · serif type · whip cuts" },
  { t: "Storyboard ready: 7 scenes", sub: "30 s · punchy motion" },
  { t: "Checked facts, timing and colors", sub: "Every number and quote is on the site" },
  { t: "Rendered the test frames", sub: "7 frames" },
  { t: "Review passed", sub: "No cut-off text, overlaps or broken images." },
  { t: "Rendered the video", sub: "30 s · 1920 × 1080" },
];
export const steps = (n: number, working = -1): Step[] => FJ_STEPS.map((s, i) => ({ ...s, state: i < n ? 1 : i === working ? 0.5 : 0 }));

/* ---------- the demo brand: Fjello (fictional outdoor-gear shop) ---------- */
// Its peak logo glyph (two peaks, ember) and wordmark (Fraunces 800). h = glyph height.
export const FjPeak: React.FC<{ h: number; color?: string }> = ({ h, color = FJ.ember }) => (
  <svg width={h * 1.3} height={h} viewBox="0 0 26 20" style={{ display: "block", flex: "none" }}><path d="M1 19 L9 5 L13 11 L17 3 L25 19 Z" fill={color} /><path d="M17 3 L19.6 8.2 L17 7 L15.1 8.6 Z" fill="#fff" opacity="0.8" /></svg>
);
export const FjLogo: React.FC<{ h: number; color?: string; peak?: string }> = ({ h, color = FJ.ink, peak = FJ.ember }) => (
  <div style={{ display: "flex", alignItems: "center", gap: h * 0.3 }}><FjPeak h={h} color={peak} /><div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: h * 1.25, letterSpacing: "-0.03em", color, lineHeight: 1 }}>fjello</div></div>
);
// Layered mountains (back moss, mid pine, front deep) with an ember sun. w, h; rise 0..1 lifts the ranges in.
export const Mountains: React.FC<{ w: number; h: number; rise?: number; sun?: boolean; tone?: number }> = ({ w, h, rise = 1, sun = true, tone = 0 }) => {
  const r = (i: number) => (1 - LAND(clamp01(rise * 1.6 - i * 0.25))) * h * 0.5;
  return (
    <svg width={w} height={h} viewBox="0 0 600 300" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", left: 0, bottom: 0, display: "block" }}>
      {sun && <circle cx="505" cy={112 + r(0) * 0.6} r="40" fill={FJ.ember} opacity={0.95} />}
      <path transform={`translate(0 ${r(0)})`} d="M0 210 L90 120 L150 170 L250 70 L330 150 L420 90 L520 170 L600 120 L600 300 L0 300 Z" fill={tone ? "#C9DACD" : FJ.moss} />
      <path transform={`translate(0 ${r(1)})`} d="M0 250 L120 160 L200 220 L300 140 L380 210 L470 150 L600 240 L600 300 L0 300 Z" fill={tone ? "#9DB9A6" : "#2C6B52"} />
      <path transform={`translate(0 ${r(2)})`} d="M0 280 L140 210 L260 270 L360 200 L480 260 L600 220 L600 300 L0 300 Z" fill={tone ? "#6F937B" : FJ.deep} />
    </svg>
  );
};
// Simple product drawings: boot, pack, shell (s = height px, colour c).
export const Product: React.FC<{ kind: "boot" | "pack" | "shell"; s: number; c?: string }> = ({ kind, s, c = FJ.pine }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" style={{ display: "block", flex: "none" }}>
    {kind === "boot" && <><path d="M12 6 H26 V24 L40 30 a5 5 0 0 1 4 5 V40 H8 V30 Z" fill={c} /><path d="M8 40 H44 V44 H8 Z" fill={FJ.ember} /><path d="M14 12 H24 M14 17 H24" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" /></>}
    {kind === "pack" && <><rect x="10" y="8" width="28" height="36" rx="9" fill={c} /><rect x="15" y="26" width="18" height="12" rx="3" fill={FJ.ember} /><path d="M18 8 V4 H30 V8" stroke={c} strokeWidth="3" fill="none" /></>}
    {kind === "shell" && <><path d="M17 5 L24 9 L31 5 L42 12 L39 22 L35 20 V44 H13 V20 L9 22 L6 12 Z" fill={c} /><path d="M24 9 V44" stroke={FJ.ember} strokeWidth="2.5" /></>}
  </svg>
);

// The Fjello film: 7 scenes drawn in code (any aspect; portrait recomposes). i = scene 0..6, t 0..1 progress inside
// the scene, calm = the "make it calmer" version (softer moves, sand fields instead of the hard pine/ember cuts).
export const FJ_SCENES = [
  { type: "Kinetic line", copy: "Gear that goes further.", dur: 3.6, calm: 4.4 },
  { type: "Product", copy: "The Ridge Boot", dur: 4.4, calm: 5.0 },
  { type: "Stat", copy: "120 trails tested", dur: 3.8, calm: 4.6 },
  { type: "Quote", copy: "“My boots survived three winters.”", dur: 4.6, calm: 5.2 },
  { type: "Showcase", copy: "Boots · Packs · Shells", dur: 4.0, calm: 0 },   // dropped by "make it calmer"
  { type: "Trail map", copy: "Find your next trail.", dur: 4.8, calm: 5.6 },
  { type: "Close", copy: "Shop fjello.com", dur: 4.8, calm: 5.2 },
];
export const FjFrame: React.FC<{ i: number; w: number; h: number; t?: number; calm?: boolean }> = ({ i, w, h, t = 1, calm = false }) => {
  const u = Math.min(w, h) / 100, portrait = h > w * 1.1, e = LAND(clamp01(t * (calm ? 1.1 : 1.8))), e2 = LAND(clamp01(t * (calm ? 1.1 : 1.8) - 0.25));
  const base: React.CSSProperties = { position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, color: FJ.snow };
  const head = (txt: React.ReactNode, size: number, color = FJ.snow) => <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: u * size, letterSpacing: "-0.03em", lineHeight: 1.0, color, textAlign: "center" }}>{txt}</div>;
  if (i === 0) return (
    <div style={{ ...base, background: calm ? FJ.sand : FJ.pine, alignItems: portrait ? "flex-start" : "center", paddingTop: portrait ? h * 0.18 : 0 }}>
      <Mountains w={w} h={h * (portrait ? 0.5 : 0.5)} rise={t * 1.4} tone={calm ? 1 : 0} />
      <div style={{ position: "relative", transform: `scale(${0.85 + 0.15 * e})`, opacity: e, marginTop: portrait ? 0 : -h * 0.36, filter: e < 1 ? `blur(${(1 - e) * u}px)` : undefined }}>
        {head(<>Gear that goes<br /><span style={{ color: FJ.ember }}>further.</span></>, portrait ? 13 : 15, calm ? FJ.ink : FJ.snow)}
      </div>
    </div>
  );
  if (i === 1) return (
    <div style={{ ...base, background: calm ? FJ.mist : FJ.sand, flexDirection: portrait ? "column" : "row", gap: u * 6 }}>
      <div style={{ transform: `translateX(${(1 - e) * (portrait ? 0 : -u * 30)}px) translateY(${(1 - e) * (portrait ? u * 20 : 0)}px) rotate(${(1 - e) * -8}deg)`, opacity: e }}><Product kind="boot" s={u * (portrait ? 46 : 52)} /></div>
      <div style={{ opacity: e2, transform: `scale(${0.9 + 0.1 * e2})`, textAlign: portrait ? "center" : "left" }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: u * 4, letterSpacing: "0.14em", color: FJ.ember }}>NEW</div>
        {head("The Ridge Boot", portrait ? 10 : 11, FJ.ink)}
      </div>
    </div>
  );
  if (i === 2) return (
    <div style={{ ...base, background: calm ? FJ.sand : FJ.ember, flexDirection: "column" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: u * (portrait ? 40 : 46), letterSpacing: "-0.05em", lineHeight: 0.9, color: calm ? FJ.pine : FJ.snow, transform: `scale(${0.7 + 0.3 * e})`, opacity: e }}>120</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: u * 7, letterSpacing: "-0.02em", color: calm ? FJ.ink : FJ.ink, opacity: e2, marginTop: u * 2 }}>trails tested</div>
    </div>
  );
  if (i === 3) return (
    <div style={{ ...base, background: calm ? FJ.snow : FJ.sand, flexDirection: "column", padding: u * 8, boxSizing: "border-box" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: u * 24, color: FJ.ember, lineHeight: 0.6, height: u * 9, opacity: e }}>“</div>
      <div style={{ opacity: e, transform: `scale(${0.92 + 0.08 * e})` }}>{head(<>My boots survived<br />three winters.</>, portrait ? 9 : 10.5, FJ.ink)}</div>
      <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: u * 4.2, color: FJ.moss, marginTop: u * 4, opacity: e2 }}>— Lea, Oslo</div>
    </div>
  );
  if (i === 4) return (
    <div style={{ ...base, background: FJ.pine, flexDirection: portrait ? "column" : "row", gap: u * 4 }}>
      {(["boot", "pack", "shell"] as const).map((kd, j) => { const q = LAND(clamp01(t * 2.2 - j * 0.3)); return (
        <div key={kd} style={{ width: u * (portrait ? 36 : 28), height: u * (portrait ? 24 : 36), borderRadius: u * 3, background: FJ.sand, display: "flex", alignItems: "center", justifyContent: "center", opacity: q, transform: `translateY(${(1 - q) * u * 16}px)` }}><Product kind={kd} s={u * (portrait ? 18 : 20)} /></div>); })}
    </div>
  );
  if (i === 5) return (
    <div style={{ ...base, background: calm ? FJ.sand : FJ.mist, flexDirection: "column" }}>
      <svg width={w} height={h} viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3, 4].map((j) => <ellipse key={j} cx={70 + j * 2} cy={48 - j} rx={70 - j * 13} ry={36 - j * 7} fill="none" stroke={FJ.moss} strokeOpacity={0.35} strokeWidth={0.5} />)}
        <path d="M18 76 C40 70 44 52 64 50 S96 58 108 40 S132 22 146 16" fill="none" stroke={FJ.ember} strokeWidth={1.6} strokeLinecap="round" strokeDasharray="3 2.4" pathLength={100} style={{ strokeDashoffset: 0 }} opacity={e} />
        <circle cx={18} cy={76} r={2.6} fill={FJ.pine} opacity={e} /><circle cx={146} cy={16} r={2.6 + e2} fill={FJ.ember} opacity={e2} />
      </svg>
      <div style={{ position: "relative", opacity: e2, marginTop: portrait ? h * 0.38 : h * 0.42, background: "rgba(255,255,255,0.85)", padding: `${u * 2}px ${u * 4}px`, borderRadius: u * 2 }}>{head("Find your next trail.", portrait ? 6.5 : 7, FJ.ink)}</div>
    </div>
  );
  return (
    <div style={{ ...base, background: calm ? FJ.sand : FJ.pine, flexDirection: "column", gap: u * 5 }}>
      <div style={{ opacity: e, transform: `scale(${0.85 + 0.15 * e})` }}><FjLogo h={u * 12} color={calm ? FJ.ink : FJ.snow} /></div>
      <div style={{ opacity: e2, padding: `${u * 2.6}px ${u * 6}px`, borderRadius: 999, background: FJ.ember, color: FJ.snow, fontFamily: FONT, fontWeight: 700, fontSize: u * 4.6 }}>Shop fjello.com</div>
    </div>
  );
};
// The Fjello film playing: which scene and how far at film-local time s (seconds, looping over 30 s).
export const fjAt = (s: number, calm = false) => {
  const lens = FJ_SCENES.map((x) => (calm ? x.calm : x.dur));
  let x = ((s % 30) + 30) % 30, i = 0;
  while (i < 6 && (lens[i] === 0 || x >= lens[i])) { x -= lens[i]; i++; }
  return { i, t: x / lens[i] };
};
export const FjFilm: React.FC<{ s: number; w: number; h: number; calm?: boolean }> = ({ s, w, h, calm }) => { const a = fjAt(s, calm); return <FjFrame i={a.i} w={w} h={h} t={a.t} calm={calm} />; };

// The raw draft: what the scan pulled from the site, pinned on a white 16:9 card before any art direction (the logo,
// the headline in plain type, the number, the four colours). dress 0..1 turns it into the art-directed film's first
// frame (FjFrame 0). w = width (h = w × 9/16).
export const DraftTile: React.FC<{ w: number; dress?: number; style?: React.CSSProperties }> = ({ w, dress = 0, style }) => {
  const h = (w * 9) / 16, u = w / 100, d = clamp01(dress);
  return (
    <div style={{ width: w, height: h, borderRadius: u * 2.6, overflow: "hidden", position: "relative", background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_DEEP}`, flex: "none", ...style }}>
      {d < 1 && <div style={{ position: "absolute", inset: 0, opacity: clamp01(1 - d * 1.8), padding: u * 5, boxSizing: "border-box", fontFamily: FONT }}>
        <FjLogo h={u * 3.2} />
        <div style={{ marginTop: u * 4.5, fontFamily: FONT, fontWeight: 600, fontSize: u * 6.4, letterSpacing: "-0.03em", lineHeight: 1.05, color: FJ.ink }}>Gear that goes<br />further.</div>
        <div style={{ position: "absolute", left: u * 5, bottom: u * 5, display: "flex", alignItems: "center", gap: u * 2 }}>
          <div style={{ padding: `${u * 1}px ${u * 2}px`, borderRadius: 999, background: C.mist, fontWeight: 600, fontSize: u * 2.6, color: FJ.ink }}>120 trails tested</div>
        </div>
        <div style={{ position: "absolute", right: u * 5, bottom: u * 5, display: "flex", gap: u * 1.2 }}>{[FJ.pine, FJ.ember, FJ.sand, FJ.ink].map((c) => <div key={c} style={{ width: u * 4.4, height: u * 4.4, borderRadius: "50%", background: c, boxShadow: `0 0 0 1px ${C.line}` }} />)}</div>
        <div style={{ position: "absolute", right: u * 5, top: u * 5, fontSize: u * 2.2, letterSpacing: "0.14em", fontWeight: 600, color: C.soft }}>DRAFT</div>
      </div>}
      {d > 0 && <div style={{ position: "absolute", inset: 0, opacity: clamp01((d - 0.2) * 1.6) }}><FjFrame i={0} w={w} h={h} t={clamp01(d * 1.2)} /></div>}
    </div>
  );
};

// The Fjello website (fictional), as Moviqly reads it. Designed at 1200 px wide, 1640 tall; w scales it; h = the
// window's height (a browser frame with the URL "fjello.com"); scroll = page offset in design px. SITE_SPOTS gives
// the design-px boxes of what the scan lifts out (add the 44 px browser bar, subtract scroll, multiply by w/1200).
export const SITE_W = 1200;
export const SITE_BAR = 44;
export const SITE_SPOTS = {
  logo: { x: 60, y: 22, w: 150, h: 40 }, headline: { x: 70, y: 150, w: 600, h: 170 }, stat120: { x: 90, y: 620, w: 260, h: 110 },
  stat49: { x: 470, y: 620, w: 330, h: 110 }, quote: { x: 150, y: 830, w: 900, h: 140 }, pine: { x: 900, y: 240, w: 40, h: 40 }, ember: { x: 70, y: 420, w: 40, h: 40 },
  sand: { x: 1000, y: 650, w: 40, h: 40 }, ink: { x: 600, y: 880, w: 40, h: 40 },
};
export const FjSite: React.FC<{ w: number; h: number; scroll?: number; style?: React.CSSProperties }> = ({ w, h, scroll = 0, style }) => {
  const s = w / SITE_W;
  return (
    <div style={{ width: w, height: h, borderRadius: 16 * s, overflow: "hidden", position: "relative", background: FJ.snow, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_DEEP}`, flex: "none", ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SITE_W, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        <div style={{ height: SITE_BAR, background: "#F4F2F0", borderBottom: "1px solid #E6E2DD", display: "flex", alignItems: "center", gap: 10, padding: "0 18px", position: "relative", zIndex: 2 }}>
          {["#E8776B", "#EFC15B", "#7BC47F"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
          <div style={{ marginLeft: 380, width: 300, height: 28, borderRadius: 8, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 15, color: C.muted }}>fjello.com</div>
        </div>
        <div style={{ position: "relative", transform: `translateY(${-scroll}px)` }}>
          <div style={{ height: 84, display: "flex", alignItems: "center", padding: "0 60px", background: FJ.pine, fontFamily: FONT, color: FJ.mist, fontSize: 17, gap: 34 }}>
            <FjLogo h={30} color={FJ.snow} /><div style={{ flex: 1 }} />{["Boots", "Packs", "Trails", "Journal"].map((x) => <div key={x}>{x}</div>)}
            <div style={{ padding: "10px 22px", borderRadius: 999, background: FJ.ember, color: FJ.snow, fontWeight: 700 }}>Shop</div>
          </div>
          <div style={{ height: 480, background: FJ.pine, position: "relative", overflow: "hidden" }}>
            <Mountains w={1200} h={330} />
            <div style={{ position: "absolute", left: 70, top: 70, fontFamily: SERIF, fontWeight: 800, fontSize: 78, letterSpacing: "-0.03em", lineHeight: 1.02, color: FJ.snow }}>Gear that goes<br />further.</div>
            <div style={{ position: "absolute", left: 72, top: 262, fontFamily: FONT, fontSize: 21, color: FJ.mist }}>Boots and packs, tested on the trails we love.</div>
            <div style={{ position: "absolute", left: 70, top: 330, padding: "16px 30px", borderRadius: 999, background: FJ.ember, color: FJ.snow, fontFamily: FONT, fontWeight: 700, fontSize: 19 }}>Shop the collection</div>
          </div>
          <div style={{ height: 200, background: FJ.sand, display: "flex", alignItems: "center", gap: 120, padding: "0 90px", fontFamily: FONT, color: FJ.ink }}>
            <div><div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 70, color: FJ.pine, lineHeight: 1 }}>120</div><div style={{ fontSize: 19, marginTop: 6 }}>trails tested</div></div>
            <div><div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 70, color: FJ.pine, lineHeight: 1 }}>4.9 ★</div><div style={{ fontSize: 19, marginTop: 6 }}>from 2,300 reviews</div></div>
          </div>
          <div style={{ height: 300, background: FJ.snow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SERIF, color: FJ.ink }}>
            <div style={{ fontWeight: 800, fontSize: 50, letterSpacing: "-0.02em" }}>“My boots survived three winters.”</div>
            <div style={{ fontFamily: FONT, fontSize: 19, color: FJ.moss, marginTop: 14 }}>— Lea, Oslo</div>
          </div>
          <div style={{ height: 420, background: FJ.sand, display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
            {([["boot", "The Ridge Boot"], ["pack", "Summit Pack"], ["shell", "Fjord Shell"]] as const).map(([kd, nm]) => (
              <div key={kd} style={{ width: 300, height: 320, borderRadius: 18, background: FJ.snow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
                <Product kind={kd} s={150} /><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, color: FJ.ink }}>{nm}</div></div>))}
          </div>
          <div style={{ height: 160, background: FJ.deep }} />
        </div>
      </div>
    </div>
  );
};

/* ---------- five earlier films (other briefs, other forms) ---------- */
// Small frames of earlier Moviqly films, each a different form and look, for the "studies earlier films" beat.
export const EARLIER = ["Living system", "Story ad", "Typographic manifesto", "Product demo", "Conversation"];
export const EarlierFrame: React.FC<{ i: number; w: number; h: number }> = ({ i, w, h }) => {
  const u = Math.min(w, h) / 100;
  const base: React.CSSProperties = { position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700 };
  if (i === 0) return <div style={{ ...base, background: "#2440FF" }}>{[0, 1, 2, 3, 4, 5].map((j) => <div key={j} style={{ position: "absolute", left: `${50 + 32 * Math.cos(j)}%`, top: `${50 + 30 * Math.sin(j)}%`, width: u * 8, height: u * 8, borderRadius: "50%", background: "#7FF0FF" }} />)}<div style={{ width: u * 22, height: u * 22, borderRadius: "50%", background: "#fff" }} /></div>;
  if (i === 1) return <div style={{ ...base, background: "#111014", color: "#FFD447", fontSize: u * 16, letterSpacing: "-0.04em" }}>Stop waiting.</div>;
  if (i === 2) return <div style={{ ...base, background: "#FF5A36", color: "#fff", fontSize: u * 22, letterSpacing: "-0.06em", lineHeight: 0.9, flexDirection: "column" }}><div>BOLD</div><div style={{ color: "#1B1B1B" }}>MOVES</div></div>;
  if (i === 3) return <div style={{ ...base, background: "#E9EEF6" }}><div style={{ width: u * 70, height: u * 46, borderRadius: u * 3, background: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,0.12)", display: "grid", gap: u * 3, padding: u * 5, boxSizing: "border-box", alignContent: "start" }}>{[0, 1, 2].map((j) => <div key={j} style={{ height: u * 6, borderRadius: u, background: j === 0 ? "#3A6FF7" : "#DCE3EE", width: `${90 - j * 18}%` }} />)}</div></div>;
  return <div style={{ ...base, background: "#F7E9FF", flexDirection: "column", gap: u * 4, alignItems: "stretch", padding: u * 10, boxSizing: "border-box" }}><div style={{ alignSelf: "flex-start", padding: `${u * 3}px ${u * 6}px`, borderRadius: u * 6, background: "#fff", fontSize: u * 8, color: "#3B2A55", fontWeight: 600 }}>Can you help?</div><div style={{ alignSelf: "flex-end", padding: `${u * 3}px ${u * 6}px`, borderRadius: u * 6, background: "#8E3BFF", fontSize: u * 8, color: "#fff", fontWeight: 600 }}>Of course.</div></div>;
};

/* ---------- the storyboard card (editor.css .storyboard) ---------- */
// Header "Storyboard" and "7 scenes · 30 s · punchy motion"; one row per scene: a test-frame thumbnail, the scene type
// and length in small caps, its copy. p 0..1 fills the rows in turn. calm = the revised storyboard ("make it calmer"):
// 6 scenes (Showcase dropped), longer scenes, "smooth motion". w = width, size = copy font px.
export const StoryboardCard: React.FC<{ p?: number; w?: number; size?: number; calm?: boolean; style?: React.CSSProperties }> = ({ p = 1, w = 640, size = 20, calm = false, style }) => {
  const rows = FJ_SCENES.map((s, i) => ({ ...s, i })).filter((s) => !calm || s.calm > 0);
  return (
    <div style={{ width: w, background: "linear-gradient(125deg,#FCFAFF,#F7F9FF)", borderRadius: size * 0.75, border: `1px solid ${C.card}`, boxShadow: SHADOW, padding: size * 0.9, boxSizing: "border-box", ...style }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: size * 0.6, marginBottom: size * 0.8 }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size * 1.05, color: C.ink }}>Storyboard</div><div style={{ flex: 1 }} />
        <div style={{ fontFamily: FONT, fontSize: size * 0.8, color: C.muted }}>{calm ? "6 scenes · 30 s · smooth motion" : "7 scenes · 30 s · punchy motion"}</div>
      </div>
      <div style={{ display: "grid", gap: size * 0.55 }}>
        {rows.map((s, j) => {
          const r = LAND(clamp01(p * rows.length - j));
          return (
            <div key={s.i} style={{ display: "flex", gap: size * 0.8, alignItems: "center", opacity: r, transform: `scale(${0.94 + 0.06 * r})`, transformOrigin: "0 50%", filter: r < 1 ? `blur(${(1 - r) * 6}px)` : undefined }}>
              <div style={{ width: size * 4.4, height: size * 2.475, borderRadius: size * 0.3, overflow: "hidden", flex: "none", position: "relative", boxShadow: `0 0 0 1px ${C.line}` }}><FjFrame i={s.i} w={size * 4.4} h={size * 2.475} t={1} calm={calm} /></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: size * 0.6, letterSpacing: "0.08em", textTransform: "uppercase", color: C.soft }}>{s.type} · {calm ? s.calm : s.dur} s</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: size * 0.9, color: C.ink, marginTop: size * 0.08, whiteSpace: "nowrap" }}>{s.copy}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- the preview canvas ---------- */
// The studio's preview pane: "● Motion canvas" and the format menu ("16:9 · Landscape" / "9:16 · Portrait") with the
// full-screen icon on top; the canvas area with its dot grid; the canvas (aspect ar, animatable) showing the Fjello
// film at film time s (calm version when calm); the caption row (size, title, "Download MP4 ↓" when download);
// the transport (play, timecode / 00:30, seek bar, 30 fps). w, h = the pane's size.
export const PREVIEW = { top: 62, bottom: 74, padX: 40, padY: 30, caption: 30 };
export const canvasBox = (w: number, h: number, ar: number) => {
  const availW = w - PREVIEW.padX * 2, availH = h - PREVIEW.top - PREVIEW.bottom - PREVIEW.padY * 2 - PREVIEW.caption;
  const cw = Math.min(availW, availH * ar), ch = cw / ar;
  return { x: (w - cw) / 2, y: PREVIEW.top + PREVIEW.padY + (availH - ch) / 2, w: cw, h: ch };
};
export const Preview: React.FC<{ w: number; h: number; ar: number; s: number; calm?: boolean; format?: string; playing?: boolean; download?: boolean; content?: React.ReactNode }> = ({ w, h, ar, s, calm = false, format, playing = true, download = false, content }) => {
  const cb = canvasBox(w, h, ar), tt = ((s % 30) + 30) % 30, mm = (n: number) => `00:${String(Math.floor(n)).padStart(2, "0")}`;
  const fmt = format ?? (ar < 1 ? "9:16 · Portrait" : ar === 1 ? "1:1 · Square" : "16:9 · Landscape");
  const res = ar < 1 ? "1080 × 1920" : "1920 × 1080";
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: PREVIEW.top, borderBottom: `1px solid ${C.line}`, background: C.white }}>
        <div style={{ position: "absolute", left: 26, top: 20, display: "flex", alignItems: "center", gap: 9, fontSize: 17, color: C.muted }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: C.violet }} />Motion canvas</div>
        <div style={{ position: "absolute", right: 70, top: 18, display: "flex", alignItems: "center", gap: 6, fontSize: 17, color: "#877593" }}>{fmt}<Ico n="chevron" s={16} c="#877593" /></div>
        <div style={{ position: "absolute", right: 24, top: 18 }}><Ico n="expand" s={22} c={C.muted} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: PREVIEW.top, width: w, height: h - PREVIEW.top - PREVIEW.bottom, background: C.canvas, backgroundImage: `radial-gradient(${C.dot} 1px, transparent 1.1px)`, backgroundSize: "20px 20px" }} />
      <div style={{ position: "absolute", left: cb.x, top: cb.y, width: cb.w, height: cb.h, borderRadius: 6, overflow: "hidden", background: C.white, boxShadow: `0 0 0 1px #E9E0F0, 0 16px 70px #5d3d7c14` }}>
        {content ?? <FjFilm s={tt} w={cb.w} h={cb.h} calm={calm} />}
      </div>
      <div style={{ position: "absolute", left: PREVIEW.padX, width: w - PREVIEW.padX * 2, top: cb.y + cb.h + 12, display: "flex", justifyContent: "space-between", fontSize: 14, color: "#AC9BB9" }}>
        <div>{res}</div><div>Fjello · 30-second film</div><div style={{ display: "flex", gap: 14 }}>{download && <span style={{ color: C.violet, fontWeight: 600 }}>Download MP4 ↓</span>}<span>100%</span></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: PREVIEW.bottom, borderTop: `1px solid ${C.line}`, background: C.white, display: "flex", alignItems: "center", gap: 16, padding: "0 28px", boxSizing: "border-box" }}>
        <Ico n={playing ? "pause" : "play"} s={20} c={C.ink} w={2.4} fill={playing ? "none" : C.ink} />
        <div style={{ fontSize: 15, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{mm(tt)} / 00:30</div>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.mist, position: "relative" }}><div style={{ width: `${(tt / 30) * 100}%`, height: "100%", borderRadius: 2, background: "#9562D7" }} />
          <div style={{ position: "absolute", left: `${(tt / 30) * 100}%`, top: -4, width: 8, height: 12, marginLeft: -4, borderRadius: 3, background: "#9562D7" }} /></div>
        <div style={{ fontSize: 15, color: C.muted }}>30 fps</div>
      </div>
    </div>
  );
};

/* ---------- the studio window ---------- */
// The studio as on the test site: header (M mark, project name ⌄, sidebar icon, "Preview" tab, the project name in the
// middle, "● All changes saved", Export MP4, the avatar), the chat column on the left ("✦ Your creative space ·
// BRIEF", children `chat`, the composer at the bottom) and the preview pane on the right (children `preview`).
// x, y, w, h place it; exportEl replaces the header button; composer text + caret; sendPress squeezes send.
export const STUDIO = { x: 110, y: 70, w: 1700, h: 940, bar: 64, chatW: 560 };
export const Studio: React.FC<{ x?: number; y?: number; w?: number; h?: number; chatW?: number; project?: string; chat?: React.ReactNode; preview?: React.ReactNode; composer?: string; composerCaret?: boolean; sendPress?: number; g?: number; exportEl?: React.ReactNode; style?: React.CSSProperties }> = ({
  x = STUDIO.x, y = STUDIO.y, w = STUDIO.w, h = STUDIO.h, chatW = STUDIO.chatW, project = "Fjello film", chat, preview, composer = "", composerCaret = false, sendPress = 0, g = 0, exportEl, style }) => {
  const pw = w - chatW - 18, ph = h - STUDIO.bar - 18;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#FBFAF8", borderRadius: 22, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, overflow: "hidden", fontFamily: FONT, ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: STUDIO.bar, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", boxSizing: "border-box" }}>
        <MMark size={28} /><div style={{ fontWeight: 600, fontSize: 19, color: C.ink }}>{project}</div><Ico n="chevron" s={15} c={C.muted} />
        <Ico n="sidebar" s={22} c={C.muted} style={{ marginLeft: chatW - 300 }} />
        <div style={{ marginLeft: 40, display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 9, background: C.lavender, color: C.lavenderInk, fontSize: 16, fontWeight: 600 }}><Ico n="monitor" s={18} c={C.lavenderInk} />Preview</div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 16, color: C.muted }}>{project}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: C.muted }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9861DA" }} />All changes saved</div>
        {exportEl ?? <ExportButton size={17} />}
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 17 }}>K</div>
      </div>
      <div style={{ position: "absolute", left: 18, top: STUDIO.bar, width: chatW - 36, height: h - STUDIO.bar - 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: C.muted, marginTop: 4 }}><Ico n="spark" s={16} c={C.violet} fill={C.violet} w={1} />Your creative space<div style={{ flex: 1 }} /><span style={{ fontSize: 12, letterSpacing: "0.14em", color: "#A39AAE" }}>BRIEF</span></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 36, bottom: 132, overflow: "hidden" }}>{chat}</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 118, background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, padding: "14px 16px", boxSizing: "border-box" }}>
          <div style={{ fontSize: 19, color: composer ? C.ink : C.soft }}>{composer || "Describe your next idea…"}{composerCaret && <span style={{ display: "inline-block", width: 2, height: 22, marginLeft: 2, verticalAlign: "-4px", background: C.blue, opacity: Math.floor(g / 9) % 2 === 0 ? 1 : 0 }} />}</div>
          <div style={{ position: "absolute", left: 16, bottom: 12, display: "flex", gap: 10 }}>{["clip", "mic"].map((n) => <div key={n} style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={n} s={17} c={C.white} /></div>)}</div>
          <div style={{ position: "absolute", right: 14, bottom: 12 }}><SendButton size={36} press={sendPress} /></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: chatW, top: STUDIO.bar, width: pw, height: ph, background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, overflow: "hidden" }}>{preview}</div>
    </div>
  );
};
// The preview pane's size inside a default Studio, and the canvas's rect on the frame (absolute px) for an aspect.
export const studioPane = () => ({ w: STUDIO.w - STUDIO.chatW - 18, h: STUDIO.h - STUDIO.bar - 18 });
export const canvasRect = (ar: number) => { const p = studioPane(), b = canvasBox(p.w, p.h, ar); return { x: STUDIO.x + STUDIO.chatW + b.x, y: STUDIO.y + STUDIO.bar + b.y, w: b.w, h: b.h }; };

// The chat's contents in its two settled states (chat column width 524 px). "ready": the brief, the folded activity,
// the storyboard and the summary. "calmer": scrolled on; the follow-up "make it calmer", its activity (folded) and
// the revised storyboard. Scenes animate between them; the hand-offs use them as they are.
export const BRIEF = "An energetic, 30-second film about fjello.com";
export const ChatReady: React.FC<{ g: number; sb?: number }> = ({ g, sb = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 6, width: 524, display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ alignSelf: "flex-end" }}><UserBubble text={BRIEF} size={18} /></div>
    <Activity g={g} clock="Worked for 3:48" fold="11 steps" w={524} size={17} card={false} />
    <StoryboardCard p={sb} w={524} size={17} />
    <div style={{ fontSize: 17, lineHeight: 1.45, color: C.label }}>Your 30-second film is ready: 7 scenes, punchy motion, built from fjello.com.</div>
  </div>
);
export const ChatCalmer: React.FC<{ g: number; sb?: number }> = ({ g, sb = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 6, width: 524, display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ alignSelf: "flex-end" }}><UserBubble text="make it calmer" size={18} /></div>
    <Activity g={g} clock="Worked for 1:12" fold="5 steps" w={524} size={17} card={false} />
    <StoryboardCard p={sb} w={524} size={17} calm />
    <div style={{ fontSize: 17, lineHeight: 1.45, color: C.label }}>Your film is updated: 6 scenes, smooth motion.</div>
  </div>
);

// The film's clock in the studio (I → M): the punchy film plays from 1.6 s at h3; after "The storyboard updates" the
// calm version plays from 1.2 s. Every scene that shows the preview uses it, so the film never jumps between builders.
export const filmClock = (g: number) => {
  const up = f("w:updates");
  return g < up ? { s: 1.6 + (g - f("h3")) / 30, calm: false } : { s: 1.2 + (g - up) / 30, calm: true };
};

/* ---------- a cursor ---------- */
export const Cursor: React.FC<{ x: number; y: number; press?: number; o?: number }> = ({ x, y, press = 0, o = 1 }) => (
  <svg width={44} height={44} viewBox="0 0 44 44" style={{ position: "absolute", left: x - 6, top: y - 4, opacity: o, transform: `scale(${1 - 0.12 * press})`, transformOrigin: "6px 4px", overflow: "visible" }}>
    <path d="M6 4 L6 34 L14 26 L20 40 L26 37 L20 24 L31 24 Z" fill={C.ink} stroke={C.white} strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);

/* ---------- the hand-offs between builders (drawn exactly; plan/storyboard.md) ---------- */
// h1 (C → D): the draft tile, raw (dress 0), 720 × 405, centred on the frame, flat, on the studio floor.
export const H1 = { x: 600, y: 337.5, w: 720 };
export const Handoff1: React.FC = () => <DraftTile w={H1.w} style={{ position: "absolute", left: H1.x, top: H1.y }} />;
// h2 (F → G): the storyboard card (punchy, all rows filled), 700 wide at size 22, left 150, vertically centred.
export const H2 = { x: 150, w: 700, size: 22 };
export const Handoff2: React.FC = () => (
  <div style={{ position: "absolute", left: H2.x, top: 0, height: 1080, display: "flex", alignItems: "center" }}><StoryboardCard p={1} w={H2.w} size={H2.size} /></div>
);
// h3 (H → I): the reviewed frame alone at the studio canvas's rect (16:9), the film at 1.6 s, no studio around it.
export const Handoff3: React.FC = () => {
  const r = canvasRect(16 / 9);
  return <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 6, overflow: "hidden", boxShadow: `0 0 0 1px #E9E0F0, 0 16px 70px #5d3d7c14` }}><FjFilm s={1.6} w={r.w} h={r.h} /></div>;
};
// h4 (L → M): the studio, final state: the "calmer" chat, the preview in Portrait playing the calm film (filmClock),
// "Download MP4 ↓" in the caption, the Export button idle. g = the current frame (the film keeps playing).
export const Handoff4: React.FC<{ g: number }> = ({ g }) => {
  const p = studioPane(), fc = filmClock(g);
  return <Studio g={g} chat={<ChatCalmer g={g} />} preview={<Preview w={p.w} h={p.h} ar={9 / 16} s={fc.s} calm={fc.calm} download />} />;
};

export { C, CRAFT, FJ, FONT, GRAD, GRAD_D, LAND, LEAVE, LIN, SERIF, SHADOW, SHADOW_BIG, SHADOW_DEEP, SNAP, clamp01, mix };
