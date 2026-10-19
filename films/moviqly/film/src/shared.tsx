// Moviqly — the shared kit every scene builds with: clock helpers, the statement type (Say), the brand glow, the
// gradient "M" mark and wordmark, line icons, the app's own pieces rebuilt from the tour screenshots (the landing
// prompt box, the studio window, the chat's user bubble and narrated activity card, the storyboard card, the preview
// canvas with its transport and format menu, the Export MP4 button), a fictional demo film ("Lumo", made with
// Moviqly) for the previews, and a cursor. Scenes import from here and never redefine these. Tokens in ./lib.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, FONT, GRAD, GRAD_D, LIN, MOVE, POP, SHADOW, SHADOW_BIG, SNAP, clamp01, mix } from "./lib";

export const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
export const f = (at: string | number) => T.f(at);
export const kf = (g: number, a: number, d: number, e: (t: number) => number = ARRIVE) => e(clamp01((g - a) / Math.max(1, d)));
export const typed = (g: number, at: string | number, text: string, cps = 28) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));

/* ---------- statements ---------- */
// The app's headline type: DM Sans 700, tight tracking, ink; a key word can carry the brand gradient (grad). Words
// rise out of a soft blur on their spoken word. Centred in `width` from x by default; br starts a new line.
export type Wd = { t: string; at: string; grad?: boolean; muted?: boolean; br?: boolean };
export const Say: React.FC<{ g: number; words: Wd[]; x?: number; y: number; size: number; out?: string; align?: "left" | "center"; width?: number; color?: string }> = ({
  g, words, x = 0, y, size, out, align = "center", width = 1920, color = C.ink }) => {
  const o = out ? k(g, out, 0.35, MOVE) : 0;
  if (o >= 1) return null;
  const lines: Wd[][] = [[]];
  words.forEach((w) => { if (w.br && lines[lines.length - 1].length) lines.push([]); lines[lines.length - 1].push(w); });
  return (
    <div style={{ position: "absolute", left: x, top: y, width, transform: `translateY(${-o * 20}px) perspective(4000px) rotateX(0.01deg)`, opacity: 1 - o,
      filter: o > 0 ? `blur(${o * 8}px)` : undefined, fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: "-0.045em", lineHeight: 1.08 }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.25, whiteSpace: "nowrap" }}>
          {ln.map((w, i) => {
            const kk = k(g, w.at, 0.5);
            return <span key={i} style={{ display: "inline-block", color: w.muted ? C.soft : color, opacity: Math.min(1, kk * 1.6), transform: `translateY(${(1 - kk) * size * 0.35}px)`,
              filter: kk < 1 ? `blur(${(1 - kk) * 8}px)` : undefined, paddingBottom: size * 0.08,
              ...(w.grad ? { backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}) }}>{w.t}</span>;
          })}
        </div>
      ))}
    </div>
  );
};

/* ---------- the brand glow (the landing page's signature, its exact CSS: site/landing.html .hero .glow) ---------- */
// Purple from the bottom left, blue in the middle, cyan from the bottom right, fading up into paper. a = strength 0..1;
// rise lifts it (0 = as on the landing page, 1 = filling the frame); y shifts it; g drifts it gently.
const GLOW_CSS = "radial-gradient(ellipse 48% 48% at 50% 29%,#faf9f7 8%,#faf9f700 100%),radial-gradient(ellipse 76% 58% at 3% 110%,#a32bff 0%,#8e32fc 38%,#7739f100 100%),radial-gradient(ellipse 75% 55% at 100% 111%,#08deeb 0%,#18caf0 40%,#17c7ef00 100%),radial-gradient(ellipse 110% 79% at 50% 115%,#2848ff 6%,#426bff 43%,#779cf4a6 66%,#faf9f700 100%)";
export const Glow: React.FC<{ g: number; a?: number; rise?: number; y?: number }> = ({ g, a = 1, rise = 0, y = 0 }) => {
  if (a <= 0) return null;
  const dx = Math.sin(g / 80) * 24, dy = Math.cos(g / 95) * 14;
  return <div style={{ position: "absolute", left: -40 + dx, top: -rise * 560 + y + dy, width: 2000, height: 1080 + rise * 560 + 40, background: GLOW_CSS, opacity: a, pointerEvents: "none" }} />;
};
// The ground: warm paper with the glow resting low and faint, drifting. Story draws it.
export const Ground: React.FC<{ g: number; glow?: number }> = ({ g, glow = 0.18 }) => (
  <div style={{ position: "absolute", inset: 0, background: C.paper, overflow: "hidden" }}><Glow g={g} a={glow} /></div>
);

/* ---------- the logo ---------- */
// The gradient "M" mark: Moviqly's own logo file (brand/moviqly-mark.png, 821×668, transparent; purple at the bottom
// left through blue to cyan at the top right). size = height in px (the width is 1.229 × size). p 0..1 builds it: it
// grows in from 60% and a soft diagonal wipe reveals it from the purple corner to the cyan corner.
export const M_RATIO = 821 / 668;
export const MMark: React.FC<{ size: number; p?: number; style?: React.CSSProperties }> = ({ size, p = 1, style }) => {
  const e = ARRIVE(clamp01(p)), w = size * M_RATIO, wipe = -20 + 160 * e;
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
    {"moviqly".split("").map((ch, i) => { const q = ARRIVE(clamp01(p * 1.6 - i * 0.09)); return <span key={i} style={{ display: "inline-block", opacity: q, transform: `translateY(${(1 - q) * size * 0.4}px)` }}>{ch}</span>; })}
  </div>
);
// Mark + wordmark lockup as in the app header. h = mark height; the wordmark follows.
// (In the app header the mark is 36×29 px beside the 26 px wordmark: the wordmark's font size is 0.9 × the mark's height.)
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
  brief: <><rect x="6" y="15" width="36" height="25" rx="4" /><path d="M17 15 V11 a3 3 0 0 1 3 -3 H28 a3 3 0 0 1 3 3 V15 M6 25 H42" /></>,
  pen: <><path d="M10 38 L12 30 L32 10 L38 16 L18 36 Z M28 14 L34 20" /></>,
  palette: <><path d="M24 6 a18 18 0 0 0 0 36 c3 0 4 -2 4 -4 c0 -3 -3 -4 -1 -6 c2 -2 6 0 9 -1 c4 -1 6 -5 6 -9 C42 13 34 6 24 6 Z" /><circle cx="16" cy="20" r="2.5" /><circle cx="24" cy="14" r="2.5" /><circle cx="32" cy="18" r="2.5" /></>,
  shield: <><path d="M24 5 L39 11 V23 c0 9 -6 16 -15 20 c-9 -4 -15 -11 -15 -20 V11 Z" /><path d="M17 24 L22 29 L31 19" /></>,
  film: <><rect x="6" y="9" width="36" height="30" rx="4" /><path d="M6 17 H42 M6 31 H42 M14 9 V17 M24 9 V17 M34 9 V17 M14 31 V39 M24 31 V39 M34 31 V39" /></>,
  user: <><circle cx="24" cy="16" r="8" /><path d="M9 42 c2 -10 8 -14 15 -14 s13 4 15 14" /></>,
  users: <><circle cx="18" cy="17" r="7" /><path d="M5 40 c2 -8 7 -11 13 -11 s11 3 13 11" /><circle cx="33" cy="15" r="6" /><path d="M33 27 c5 0 9 3 10 10" /></>,
  calendar: <><rect x="6" y="9" width="36" height="32" rx="5" /><path d="M6 18 H42 M15 5 V12 M33 5 V12" /></>,
  coin: <><circle cx="24" cy="24" r="17" /><path d="M24 14 V34 M19 18 h8 a4 4 0 0 1 0 8 h-6 a4 4 0 0 0 0 8 h8" /></>,
  file: <><path d="M12 5 H29 L37 13 V43 H12 Z" /><path d="M29 5 V13 H37" /></>,
  clock: <><circle cx="24" cy="24" r="17" /><path d="M24 14 V24 L31 29" /></>,
  rocket: <><path d="M24 5 c8 6 11 15 9 25 H15 c-2 -10 1 -19 9 -25 Z" /><circle cx="24" cy="18" r="4" /><path d="M15 30 L9 37 L16 36 M33 30 L39 37 L32 36 M21 36 L24 43 L27 36" /></>,
  megaphone: <><path d="M8 20 V28 H14 L32 38 V10 L14 20 Z" /><path d="M14 28 L17 39 H22 L20 29" /><path d="M37 18 a7 7 0 0 1 0 12" /></>,
  layers: <><path d="M24 6 L43 15 L24 24 L5 15 Z" /><path d="M5 24 L24 33 L43 24 M5 33 L24 42 L43 33" /></>,
  chevron: <><path d="M14 19 L24 29 L34 19" /></>,
  x: <><path d="M14 14 L34 34 M34 14 L14 34" /></>,
};
export const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number; fill?: string; style?: React.CSSProperties }> = ({ n, s = 24, c = C.ink, w = 2, fill = "none", style }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill={fill} stroke={c} strokeWidth={(w * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none", ...style }}>{P[n]}</svg>
);

/* ---------- buttons ---------- */
// The round gradient send button (landing and chat). size px; press 0..1 squeezes it.
export const SendButton: React.FC<{ size?: number; press?: number; style?: React.CSSProperties }> = ({ size = 44, press = 0, style }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(125deg,#922bff,#3047ff 65%,#16cfe5)", display: "flex", alignItems: "center", justifyContent: "center",
    transform: `scale(${1 - 0.12 * press})`, boxShadow: `0 ${6 * (1 - press)}px 16px -6px rgba(84,42,255,0.6)`, flex: "none", ...style }}>
    <Ico n="up" s={size * 0.5} c={C.white} w={2.6} />
  </div>
);
// The black pill button ("Get started", "Create account"). size = font px.
export const BlackButton: React.FC<{ text: string; size?: number; press?: number; style?: React.CSSProperties }> = ({ text, size = 22, press = 0, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.62}px ${size * 1.1}px`, borderRadius: size * 0.55, background: C.button, color: C.white,
    fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: "-0.01em", whiteSpace: "nowrap", transform: `scale(${1 - 0.06 * press})`, boxShadow: "0 10px 24px -12px rgba(23,23,23,0.6)", ...style }}>{text}</div>
);
// The purple "Export MP4" button in the studio header. state: 0 idle, 0..1 = rendering progress shown as "Rendering 42%".
export const ExportButton: React.FC<{ size?: number; progress?: number; press?: number; done?: boolean }> = ({ size = 20, progress, press = 0, done }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, padding: `${size * 0.5}px ${size * 0.9}px`, borderRadius: size * 0.45, background: done ? C.ok : `linear-gradient(135deg, ${C.purple}, #6A2BFF)`,
    color: C.white, fontFamily: FONT, fontWeight: 700, fontSize: size, whiteSpace: "nowrap", transform: `scale(${1 - 0.06 * press})`, boxShadow: "0 8px 20px -10px rgba(120,40,255,0.7)" }}>
    {done ? <><Ico n="check" s={size} c={C.white} w={2.6} />Downloaded</> : progress !== undefined ? `Rendering ${Math.round(progress * 100)}%` : <>Export MP4 <Ico n="download" s={size * 0.95} c={C.white} w={2.4} /></>}
  </div>
);

/* ---------- the landing prompt box ---------- */
// The app's prompt box: white, rounded, soft shadow; the brief (typed) or the placeholder; paperclip and mic at the
// bottom left, "Create ⌄" and the round send button at the bottom right. w = width (height follows, ~0.2 w).
// caret shows a blinking caret after the text (g drives the blink); press 0..1 squeezes the send button.
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

/* ---------- the chat pieces ---------- */
// The user's message: a lavender bubble, right-aligned in the chat. size = font px.
export const UserBubble: React.FC<{ text: string; size?: number; style?: React.CSSProperties }> = ({ text, size = 24, style }) => (
  <div style={{ display: "inline-block", maxWidth: 560 * (size / 24), background: C.lavender, color: C.ink, fontFamily: FONT, fontWeight: 500, fontSize: size, lineHeight: 1.35,
    padding: `${size * 0.6}px ${size * 0.85}px`, borderRadius: size * 0.9, borderTopRightRadius: size * 0.3, ...style }}>{text}</div>
);
// One narrated step. state: 0 waiting (grey ring), between 0 and 1 = working (spinner), 1 = done (purple check, pops in).
export type Step = { t: string; sub?: string; state: number };
const StepRow: React.FC<{ s: Step; size: number; g: number }> = ({ s, size, g }) => {
  const done = s.state >= 1, working = s.state > 0 && s.state < 1, pop = POP(clamp01((s.state - 0.99) * 100));
  return (
    <div style={{ display: "flex", gap: size * 0.6, alignItems: "flex-start", opacity: s.state <= 0 ? 0.45 : 1 }}>
      <div style={{ width: size * 1.15, height: size * 1.15, flex: "none", marginTop: size * 0.08, position: "relative" }}>
        {done ? <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.violet, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop})` }}><Ico n="check" s={size * 0.8} c={C.white} w={3} /></div>
          : working ? <svg width={size * 1.15} height={size * 1.15} viewBox="0 0 24 24" style={{ transform: `rotate(${g * 14}deg)` }}><circle cx="12" cy="12" r="9" fill="none" stroke={C.line} strokeWidth="3" /><path d="M12 3 a9 9 0 0 1 9 9" fill="none" stroke={C.violet} strokeWidth="3" strokeLinecap="round" /></svg>
            : <div style={{ position: "absolute", inset: size * 0.08, borderRadius: "50%", border: `2px solid ${C.line}` }} />}
      </div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, color: C.ink, letterSpacing: "-0.01em" }}>{s.t}</div>
        {s.sub && s.state > 0 && <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: size * 0.8, color: C.muted, marginTop: size * 0.15, lineHeight: 1.35 }}>{s.sub}</div>}
      </div>
    </div>
  );
};
// The activity card: the AI narrating its work. Header: the M mark, "Moviqly", and on the right the clock
// ("Working 1:23" while running, "Worked for 4:20" when done). steps: the list. w = width; size = step font px.
export const ActivityCard: React.FC<{ g: number; steps: Step[]; clock: string; w?: number; size?: number; style?: React.CSSProperties }> = ({ g, steps, clock, w = 620, size = 22, style }) => (
  <div style={{ width: w, background: C.white, borderRadius: size * 1.0, border: `1px solid ${C.line}`, boxShadow: SHADOW, padding: size * 1.1, boxSizing: "border-box", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.5, marginBottom: size * 0.9 }}>
      <MMark size={size * 1.25} /><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, color: C.ink }}>Moviqly</div>
      <div style={{ flex: 1 }} /><div style={{ fontFamily: FONT, fontSize: size * 0.8, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{clock}</div>
    </div>
    <div style={{ display: "grid", gap: size * 0.8 }}>{steps.map((s, i) => <StepRow key={i} s={s} size={size} g={g} />)}</div>
  </div>
);
// The storyboard card: header ("Storyboard · 6 scenes · 25 s · punchy motion") and one row per scene with a thumbnail
// of the demo film, the scene type and length in small caps, and its copy. p 0..1 fills the rows in turn.
export const SCENES = [
  { type: "Kinetic line", dur: "3 s", copy: "Launch day is here." }, { type: "Brand reveal", dur: "3.7 s", copy: "Meet Lumo" },
  { type: "Icon flow", dur: "4 s", copy: "Plan → Share → Ship" }, { type: "Device", dur: "4.3 s", copy: "Your week, in one view" },
  { type: "Word cloud", dur: "4 s", copy: "Faster · Simpler · Together" }, { type: "Close", dur: "6 s", copy: "Try Lumo today." },
];
export const StoryboardCard: React.FC<{ p?: number; w?: number; size?: number; rows?: number; style?: React.CSSProperties }> = ({ p = 1, w = 620, size = 20, rows = 6, style }) => (
  <div style={{ width: w, background: C.white, borderRadius: size * 1.0, border: `1px solid ${C.line}`, boxShadow: SHADOW, padding: size * 1.0, boxSizing: "border-box", ...style }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: size * 0.6, marginBottom: size * 0.8 }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size * 1.1, color: C.ink }}>Storyboard</div><div style={{ flex: 1 }} />
      <div style={{ fontFamily: FONT, fontSize: size * 0.8, color: C.muted }}>6 scenes · 25 s · punchy motion</div>
    </div>
    <div style={{ display: "grid", gap: size * 0.6 }}>
      {SCENES.slice(0, rows).map((s, i) => {
        const r = ARRIVE(clamp01(p * rows - i));
        return (
          <div key={i} style={{ display: "flex", gap: size * 0.8, alignItems: "center", opacity: r, transform: `translateY(${(1 - r) * size}px)` }}>
            <div style={{ width: size * 5.2, height: size * 2.925, borderRadius: size * 0.35, overflow: "hidden", flex: "none", position: "relative", boxShadow: `0 0 0 1px ${C.line}` }}><DemoFrame i={i} w={size * 5.2} h={size * 2.925} t={1} /></div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: size * 0.62, letterSpacing: "0.08em", textTransform: "uppercase", color: C.soft }}>{s.type} · {s.dur}</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: size * 0.95, color: C.ink, marginTop: size * 0.1 }}>{s.copy}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* ---------- the demo film (a fictional brand, "Lumo", as a Moviqly film) ---------- */
// Six frames drawn in code, so the previews show a real-looking motion film without using any real company's brand.
// i = scene 0..5; w, h = size of the frame (any aspect: layouts adapt); t 0..1 = progress through the scene (its
// own small animation). Lumo's look: deep blue field, white type, cyan accents — distinct from Moviqly's own UI.
const LUMO = { bg: "#2440FF", deep: "#1428C8", accent: "#7FF0FF", white: "#FFFFFF" };
export const DemoFrame: React.FC<{ i: number; w: number; h: number; t?: number }> = ({ i, w, h, t = 1 }) => {
  const u = Math.min(w, h) / 100, e = ARRIVE(clamp01(t * 1.4)), portrait = h > w * 1.1;
  const base: React.CSSProperties = { position: "absolute", inset: 0, overflow: "hidden", fontFamily: FONT, color: LUMO.white, display: "flex", alignItems: "center", justifyContent: "center" };
  const dots = <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,0.18) ${u * 0.35}px, transparent ${u * 0.45}px)`, backgroundSize: `${u * 4}px ${u * 4}px`, transform: `translateY(${-t * u * 4}px)` }} />;
  if (i === 0) return <div style={{ ...base, background: LUMO.bg }}>{dots}<div style={{ fontWeight: 700, fontSize: u * (portrait ? 13 : 15), letterSpacing: "-0.04em", lineHeight: 1, textAlign: "center", transform: `translateY(${(1 - e) * u * 10}px)`, opacity: e }}>Launch day<br />is <span style={{ color: LUMO.accent }}>here.</span></div></div>;
  if (i === 1) return <div style={{ ...base, background: `radial-gradient(circle at 50% 60%, ${LUMO.bg}, ${LUMO.deep})` }}>{dots}<div style={{ display: "flex", alignItems: "center", gap: u * 3, transform: `scale(${0.8 + 0.2 * e})`, opacity: e }}><div style={{ width: u * 16, height: u * 16, borderRadius: "50%", background: LUMO.white, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: u * 8, height: u * 8, borderRadius: "50%", background: LUMO.bg }} /></div><div style={{ fontWeight: 700, fontSize: u * 18, letterSpacing: "-0.05em" }}>lumo</div></div></div>;
  if (i === 2) return <div style={{ ...base, background: LUMO.white, color: LUMO.bg, flexDirection: portrait ? "column" : "row", gap: u * 4 }}>{["calendar", "users", "rocket"].map((n, j) => { const q = ARRIVE(clamp01(t * 2 - j * 0.3)); return <React.Fragment key={n}><div style={{ width: u * 18, height: u * 18, borderRadius: u * 4, background: "#EEF1FF", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * q})`, opacity: q }}><Ico n={n} s={u * 10} c={LUMO.bg} w={2.2} /></div>{j < 2 && <div style={{ width: portrait ? 2 : u * 6, height: portrait ? u * 4 : 2, background: LUMO.bg, opacity: q }} />}</React.Fragment>; })}</div>;
  if (i === 3) return <div style={{ ...base, background: `linear-gradient(160deg, ${LUMO.bg}, ${LUMO.deep})` }}>{dots}<div style={{ width: u * (portrait ? 46 : 36), height: u * (portrait ? 80 : 64), borderRadius: u * 5, background: LUMO.white, boxShadow: `0 ${u * 4}px ${u * 10}px rgba(0,0,0,0.25)`, padding: u * 3, boxSizing: "border-box", transform: `translateY(${(1 - e) * u * 20}px)`, display: "grid", gap: u * 2, alignContent: "start" }}>{[0, 1, 2, 3].map((j) => <div key={j} style={{ height: u * 7, borderRadius: u * 1.5, background: j === 1 ? LUMO.accent : "#EEF1FF", width: `${100 - j * 12}%` }} />)}</div></div>;
  if (i === 4) return <div style={{ ...base, background: LUMO.deep, flexDirection: "column", gap: u * 2 }}>{["Faster", "Simpler", "Together"].map((wd, j) => { const q = ARRIVE(clamp01(t * 2.2 - j * 0.35)); return <div key={wd} style={{ fontWeight: 700, fontSize: u * 12, letterSpacing: "-0.04em", lineHeight: 1, color: j === 2 ? LUMO.accent : LUMO.white, opacity: q, transform: `translateX(${(1 - q) * (j % 2 ? 1 : -1) * u * 14}px)` }}>{wd}</div>; })}</div>;
  return <div style={{ ...base, background: LUMO.white, color: LUMO.bg, flexDirection: "column", gap: u * 4 }}><div style={{ fontWeight: 700, fontSize: u * 13, letterSpacing: "-0.04em", opacity: e }}>Try Lumo today.</div><div style={{ padding: `${u * 2.4}px ${u * 6}px`, borderRadius: 999, background: LUMO.bg, color: LUMO.white, fontWeight: 700, fontSize: u * 5, transform: `scale(${0.8 + 0.2 * e})` }}>Get Lumo</div></div>;
};
// The demo film playing: which scene and how far, at film-local time s (seconds, looping over 25 s).
const SCENE_LEN = [3, 3.7, 4, 4.3, 4, 6];
export const filmAt = (s: number) => {
  let x = ((s % 25) + 25) % 25, i = 0;
  while (i < 5 && x >= SCENE_LEN[i]) { x -= SCENE_LEN[i]; i++; }
  return { i, t: x / SCENE_LEN[i] };
};
export const DemoFilm: React.FC<{ s: number; w: number; h: number }> = ({ s, w, h }) => { const a = filmAt(s); return <DemoFrame i={a.i} w={w} h={h} t={a.t} />; };

/* ---------- the preview canvas ---------- */
// The studio's preview pane content: "● Motion canvas" and the format menu on top, the canvas (aspect ar = width/height:
// 16/9, 9/16 or 1; it can be animated between them) showing the demo film at time s (or an empty state when s < 0),
// and the transport (play state, timecode, seek bar, "30 fps"). w, h = the pane's size.
export const Preview: React.FC<{ w: number; h: number; ar: number; s: number; format?: string; playing?: boolean; empty?: string; progress?: number }> = ({ w, h, ar, s, format = "16:9 · Landscape", playing = true, empty, progress }) => {
  const top = 56, bottom = 70, availW = w - 80, availH = h - top - bottom - 50;
  const cw = Math.min(availW, availH * ar), ch = cw / ar, film = s >= 0 && !empty;
  const len = 25, tt = film ? ((s % len) + len) % len : 0, mm = (n: number) => `00:${String(Math.floor(n)).padStart(2, "0")}`;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 28, top: 18, display: "flex", alignItems: "center", gap: 8, fontSize: 17, color: C.muted }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.violet }} />Motion canvas</div>
      <div style={{ position: "absolute", right: 28, top: 14, display: "flex", alignItems: "center", gap: 6, fontSize: 17, color: C.ink, fontWeight: 500 }}>{format}<Ico n="chevron" s={16} c={C.ink} /></div>
      <div style={{ position: "absolute", left: (w - cw) / 2, top: top + (availH - ch) / 2 + 10, width: cw, height: ch, borderRadius: 10, overflow: "hidden", boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, background: C.white }}>
        {film ? <DemoFilm s={tt} w={cw} h={ch} /> : (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: C.paper }}>
            <div style={{ fontWeight: 700, fontSize: Math.max(18, cw * 0.035), color: C.ink, letterSpacing: "-0.03em" }}>Your motion starts here.</div>
            <div style={{ fontSize: Math.max(12, cw * 0.016), letterSpacing: "0.12em", color: C.soft, fontWeight: 600 }}>{empty ?? "DESCRIBE YOUR FIRST MOTION"}</div>
            {progress !== undefined && <div style={{ width: cw * 0.34, height: 6, borderRadius: 3, background: C.mist, marginTop: 10 }}><div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 3, background: GRAD }} /></div>}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 28, right: 28, bottom: 18, height: 40, display: "flex", alignItems: "center", gap: 16, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
        <Ico n={playing && film ? "pause" : "play"} s={20} c={C.ink} w={2.4} fill={playing && film ? "none" : C.ink} />
        <div style={{ fontSize: 15, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{mm(tt)} / 00:25</div>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.mist, position: "relative" }}><div style={{ width: `${(tt / len) * 100}%`, height: "100%", borderRadius: 2, background: C.violet }} />
          <div style={{ position: "absolute", left: `${(tt / len) * 100}%`, top: -5, width: 14, height: 14, marginLeft: -7, borderRadius: "50%", background: C.violet, boxShadow: "0 0 0 3px #fff" }} /></div>
        <div style={{ fontSize: 15, color: C.muted }}>30 fps</div>
      </div>
    </div>
  );
};

/* ---------- the studio window ---------- */
// The studio: a white app window (radius 22, soft shadow) with the slim header (M mark + project name ⌄, "Preview" tab,
// save status, Export MP4, the avatar "K"), the chat column on the left ("Your creative space", children `chat`, the
// composer at the bottom) and the preview pane on the right (children `preview`, a pale panel). x, y, w, h place it;
// chatW = the chat column's width. exportEl replaces the header button (pass an ExportButton in a state).
export const STUDIO = { x: 110, y: 70, w: 1700, h: 940, bar: 64, chatW: 560 };
export const Studio: React.FC<{ x?: number; y?: number; w?: number; h?: number; chatW?: number; project?: string; chat?: React.ReactNode; preview?: React.ReactNode; composer?: string; composerCaret?: boolean; g?: number; exportEl?: React.ReactNode; s?: number; o?: number; style?: React.CSSProperties }> = ({
  x = STUDIO.x, y = STUDIO.y, w = STUDIO.w, h = STUDIO.h, chatW = STUDIO.chatW, project = "Lumo launch", chat, preview, composer = "", composerCaret = false, g = 0, exportEl, s = 1, o = 1, style }) => {
  if (o <= 0) return null;
  const pw = w - chatW - 18, ph = h - STUDIO.bar - 18;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${s})`, transformOrigin: "50% 50%", background: "#FBFAF8", borderRadius: 22,
      boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, overflow: "hidden", fontFamily: FONT, ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: STUDIO.bar, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", boxSizing: "border-box" }}>
        <MMark size={30} /><div style={{ fontWeight: 600, fontSize: 19, color: C.ink }}>{project}</div><Ico n="chevron" s={16} c={C.muted} />
        <div style={{ marginLeft: chatW - 230, display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 10, background: C.lavender, color: C.lavenderInk, fontSize: 16, fontWeight: 600 }}>Preview</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: C.muted }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: C.violet }} />All changes saved</div>
        {exportEl ?? <ExportButton size={17} />}
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17 }}>K</div>
      </div>
      <div style={{ position: "absolute", left: 18, top: STUDIO.bar, width: chatW - 18, height: h - STUDIO.bar - 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: C.muted, marginTop: 4 }}><Ico n="spark" s={16} c={C.violet} fill={C.violet} w={1} />Your creative space</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 36, bottom: 132, overflow: "hidden" }}>{chat}</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 118, background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, padding: "14px 16px", boxSizing: "border-box" }}>
          <div style={{ fontSize: 19, color: composer ? C.ink : C.soft }}>{composer || "Describe your next idea…"}{composerCaret && <span style={{ display: "inline-block", width: 2, height: 22, marginLeft: 2, verticalAlign: "-4px", background: C.blue, opacity: Math.floor(g / 9) % 2 === 0 ? 1 : 0 }} />}</div>
          <div style={{ position: "absolute", left: 16, bottom: 12, display: "flex", gap: 10 }}>{["clip", "mic"].map((n) => <div key={n} style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={n} s={17} c={C.white} /></div>)}</div>
          <div style={{ position: "absolute", right: 14, bottom: 12 }}><SendButton size={36} /></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: chatW, top: STUDIO.bar, width: pw, height: ph, background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, overflow: "hidden" }}>{preview}</div>
    </div>
  );
};
// The preview pane's size inside a Studio of the given size (so scenes can lay a Preview in it).
export const studioPane = (w = STUDIO.w, h = STUDIO.h, chatW = STUDIO.chatW) => ({ w: w - chatW - 18, h: h - STUDIO.bar - 18 });

/* ---------- a cursor ---------- */
export const Cursor: React.FC<{ x: number; y: number; press?: number; o?: number }> = ({ x, y, press = 0, o = 1 }) => (
  <svg width={44} height={44} viewBox="0 0 44 44" style={{ position: "absolute", left: x - 6, top: y - 4, opacity: o, transform: `scale(${1 - 0.12 * press})`, transformOrigin: "6px 4px", overflow: "visible" }}>
    <path d="M6 4 L6 34 L14 26 L20 40 L26 37 L20 24 L31 24 Z" fill={C.ink} stroke={C.white} strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);
// A small gradient dot (the hand-off carrier). r px.
export const GDot: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 14, o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: GRAD_D, opacity: o, boxShadow: `0 0 ${r}px rgba(84,42,255,0.35)` }} />
);

export { ARRIVE, C, DEPART, FONT, GRAD, GRAD_D, LIN, MOVE, POP, SHADOW, SHADOW_BIG, SNAP, clamp01, mix };
