// Creoble v4 — the shared kit every scene builds with. Written new for this film (nothing from v1–v3): clock helpers;
// the editorial statement (Fraunces 400, lines revealed through a mask, italic key words in deep sage); the eyebrow
// label; the official wordmark (outlined paths, the full stop lands last); Creoble's buttons, cards, toggle and
// check; a minimal browser frame; the example client's site ("Holm Fysioterapi", built by Creoble in the film);
// Creoble's real builder step (the form as on creoble.dk/builder); line icons; the camera breath; the four builder
// hand-offs. Scenes import from here and never redefine these. Tokens in ./lib.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { C, EXIT, HOLM, INOUT, LIN, OUT, SANS, SERIF, SHADOW, SHADOW_BIG, WIPE, clamp01, mix } from "./lib";
import { WM_DOT, WM_VIEW, WM_WORD } from "./wordmark";
import { LG_MAP } from "./lgmap";

export const k = (g: number, at: string | number, dur: number, ease = OUT) => T.k(g, at, dur, ease);
export const f = (at: string | number) => T.f(at);
export const kf = (g: number, a: number, d: number, e: (t: number) => number = OUT) => e(clamp01((g - a) / Math.max(1, d)));
export const typed = (g: number, at: string | number, text: string, cps = 24) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));
// settle(p): an object arriving (p 0 → 1): a short scale from 0.965 and a fade, no blur, no overshoot.
export const settle = (p: number, from = 0.965): React.CSSProperties => { const q = clamp01(p); return { opacity: q, transform: `scale(${mix(from, 1, q)})` }; };
// The camera's one slow breath for the whole film (never on a transition). Story wraps every scene in it.
export const breath = (g: number) => { const t = g / 30; return { s: 1.01 + 0.008 * Math.sin((t / 22) * Math.PI * 2 - 1.1), x: 12 * Math.sin((t / 18) * Math.PI * 2), y: 7 * Math.sin((t / 25) * Math.PI * 2 + 0.7) }; };

/* ---------- type ---------- */
// One word or phrase of a statement: t = text, at = the label it reveals on, it = italic deep sage (the site's
// accent), br = start a new line before it.
export type Wd = { t: string; at: string; it?: boolean; br?: boolean };
// The editorial statement: Fraunces 400, −0.025em, ink. Each word is revealed through its own mask, rising from
// below the line (0.55 s, OUT) on its label; `out` (a label) wipes the whole statement up and away. x, y = top-left
// of the block (or its centre line's left when align="center": then x is the block's centre); size = font px.
export const Statement: React.FC<{ g: number; words: Wd[]; x: number; y: number; size: number; align?: "left" | "center"; out?: string; color?: string; lh?: number }> = ({
  g, words, x, y, size, align = "left", out, color = C.ink, lh = 1.06 }) => {
  const o = out ? k(g, out, 0.45, EXIT) : 0;
  if (o >= 1) return null;
  const lines: Wd[][] = [[]];
  words.forEach((w) => { if (w.br && lines[lines.length - 1].length) lines.push([]); lines[lines.length - 1].push(w); });
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - 1600 : x, top: y, width: align === "center" ? 3200 : undefined, fontFamily: SERIF, fontWeight: 400, fontSize: size, letterSpacing: "-0.025em", lineHeight: lh, color, opacity: 1 - o * 0.4, transform: `translateY(${-o * size * 0.5}px)` }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.24, whiteSpace: "nowrap" }}>
          {ln.map((w, i) => {
            const p = k(g, w.at, 0.55);
            const q = o > 0 ? clamp01(1 - o * 1.4) : 1;
            return (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.16, marginBottom: -size * 0.16, paddingRight: w.it ? size * 0.06 : 0 }}>
                <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 105}%)`, opacity: q, fontStyle: w.it ? "italic" : "normal", color: w.it ? C.sageDeep : undefined }}>{w.t}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
// The eyebrow label as on creoble.dk: a short sage hairline, then DM Sans 500 uppercase with wide tracking. p 0..1
// draws the line, then reveals the text.
export const Label: React.FC<{ text: string; p?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, p = 1, size = 18, color = C.sageDeep, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.9, ...style }}>
    <div style={{ width: size * 2.6 * WIPE(clamp01(p * 1.6)), height: 1.5, background: C.sageLight }} />
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: size, letterSpacing: "0.2em", textTransform: "uppercase", color, whiteSpace: "nowrap", clipPath: `inset(0 ${100 - 100 * OUT(clamp01(p * 1.6 - 0.5))}% 0 0)` }}>{text}</div>
  </div>
);

/* ---------- the wordmark ---------- */
// "Creoble." from the client's outlined SVG. h = cap-to-baseline height of the drawing (px; width = h × 4.77).
// p 0..1: the word is revealed left to right through a soft mask, then the full stop lands (scale, sage). tone
// "dark" (ink word, sage stop: for the light ground) or "light" (cream word, light-sage stop).
export const Wordmark: React.FC<{ h: number; p?: number; tone?: "dark" | "light"; style?: React.CSSProperties }> = ({ h, p = 1, tone = "dark", style }) => {
  const w = (h * WM_VIEW.w) / WM_VIEW.h, rev = WIPE(clamp01(p / 0.75)), dot = OUT(clamp01((p - 0.7) / 0.3));
  const m = `linear-gradient(90deg, #000 ${rev * 110 - 10}%, transparent ${rev * 110 + 2}%)`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${WM_VIEW.w} ${WM_VIEW.h}`} style={{ display: "block", overflow: "visible", ...style }}>
      <g style={{ WebkitMaskImage: p < 0.75 ? m : undefined, maskImage: p < 0.75 ? m : undefined }}><path d={WM_WORD} fill={tone === "dark" ? C.ink : "#F5F1EA"} /></g>
      <g style={{ transformOrigin: "7062px 1344px", transform: `scale(${dot})`, opacity: dot }}><path d={WM_DOT} fill={tone === "dark" ? C.sage : C.sageLight} /></g>
    </svg>
  );
};

/* ---------- icons (rounded line) ---------- */
export const P: Record<string, React.ReactNode> = {
  arrow: <path d="M10 24 H38 M27 13 L38 24 L27 35" />,
  check: <path d="M12 25 L20 33 L36 15" />,
  lock: <><rect x="11" y="21" width="26" height="20" rx="4" /><path d="M16 21 V15 a8 8 0 0 1 16 0 V21" /></>,
  unlock: <><rect x="11" y="21" width="26" height="20" rx="4" /><path d="M16 21 V15 a8 8 0 0 1 15.5 -2.5" /></>,
  sparkle: <path d="M24 6 L27.5 20.5 L42 24 L27.5 27.5 L24 42 L20.5 27.5 L6 24 L20.5 20.5 Z" />,
  chat: <path d="M8 22 a16 14 0 1 1 7 11.5 L8 38 L10.5 31 A14 14 0 0 1 8 22 Z" />,
  mail: <><rect x="6" y="11" width="36" height="26" rx="4" /><path d="M7 13 L24 26 L41 13" /></>,
  globe: <><circle cx="24" cy="24" r="17" /><path d="M7 24 H41 M24 7 c-6 6 -6 28 0 34 c6 -6 6 -28 0 -34" /></>,
  user: <><circle cx="24" cy="16" r="7" /><path d="M10 41 c2 -9 7 -13 14 -13 s12 4 14 13" /></>,
  shield: <><path d="M24 5 L39 11 V23 c0 9 -6 16 -15 20 c-9 -4 -15 -11 -15 -20 V11 Z" /><path d="M17 24 L22 29 L31 19" /></>,
  code: <path d="M17 14 L7 24 L17 34 M31 14 L41 24 L31 34" />,
  grid: <><rect x="7" y="7" width="14" height="14" rx="3" /><rect x="27" y="7" width="14" height="14" rx="3" /><rect x="7" y="27" width="14" height="14" rx="3" /><rect x="27" y="27" width="14" height="14" rx="3" /></>,
  calendar: <><rect x="6" y="9" width="36" height="32" rx="5" /><path d="M6 18 H42 M15 5 V12 M33 5 V12" /></>,
  chevron: <path d="M14 19 L24 29 L34 19" />,
  x: <path d="M14 14 L34 34 M34 14 L14 34" />,
  server: <><rect x="8" y="8" width="32" height="13" rx="3" /><rect x="8" y="27" width="32" height="13" rx="3" /><path d="M14 14.5 H15 M14 33.5 H15" /></>,
  link: <><path d="M20 28 L28 20" /><path d="M22 14 l4 -4 a7 7 0 0 1 10 10 l-4 4 M26 34 l-4 4 a7 7 0 0 1 -10 -10 l4 -4" /></>,
};
export const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number; fill?: string; style?: React.CSSProperties }> = ({ n, s = 24, c = C.ink, w = 2, fill = "none", style }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill={fill} stroke={c} strokeWidth={(w * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none", ...style }}>{P[n]}</svg>
);

/* ---------- Creoble's UI pieces ---------- */
// The near-black pill button ("Byg din side gratis →"). size = font px; press 0..1 depresses it; shine 0..1 runs
// a soft light across it (an Apple-style highlight instead of a cursor).
export const PillButton: React.FC<{ text: string; size?: number; arrow?: boolean; press?: number; shine?: number; tone?: "ink" | "sage" | "outline"; style?: React.CSSProperties }> = ({ text, size = 22, arrow = true, press = 0, shine = 0, tone = "ink", style }) => {
  const bg = tone === "ink" ? C.ink : tone === "sage" ? C.sage : "transparent", fg = tone === "outline" ? C.ink : tone === "sage" ? C.white : C.btnText;
  return (
    <div style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", gap: size * 0.5, padding: `${size * 0.72}px ${size * 1.45}px`, borderRadius: 999, background: bg, color: fg, border: tone === "outline" ? `1.5px solid ${C.line}` : undefined,
      fontFamily: SANS, fontWeight: 500, fontSize: size, whiteSpace: "nowrap", transform: `scale(${1 - 0.05 * press})`, boxShadow: tone === "outline" ? undefined : `0 ${10 * (1 - press)}px 26px -14px rgba(26,22,20,0.55)`, ...style }}>
      {shine > 0 && shine < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-40 + shine * 160}%`, width: "35%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }} />}
      <span style={{ position: "relative" }}>{text}</span>{arrow && <Ico n="arrow" s={size * 0.95} c={fg} w={2.2} style={{ position: "relative" }} />}
    </div>
  );
};
// A Creoble card as on the site: cream, hairline, radius 20, soft shadow. Children inside; padding p px.
export const Card: React.FC<{ w?: number; h?: number; pad?: number; children?: React.ReactNode; tone?: "cream" | "white"; style?: React.CSSProperties }> = ({ w, h, pad = 36, children, tone = "cream", style }) => (
  <div style={{ width: w, height: h, boxSizing: "border-box", padding: pad, borderRadius: 20, background: tone === "cream" ? C.card : C.white, border: `1px solid ${C.line}`, boxShadow: SHADOW, fontFamily: SANS, color: C.ink, ...style }}>{children}</div>
);
// The Apple-style switch in Creoble's sage. on 0..1 slides the knob; size = track height px.
export const Toggle: React.FC<{ on: number; size?: number; style?: React.CSSProperties }> = ({ on, size = 34, style }) => {
  const q = INOUT(clamp01(on));
  return (
    <div style={{ width: size * 1.7, height: size, borderRadius: size, background: `color-mix(in srgb, ${C.sage} ${q * 100}%, #DCD8D1)`, position: "relative", flex: "none", ...style }}>
      <div style={{ position: "absolute", top: size * 0.09, left: size * 0.09 + q * size * 0.7, width: size * 0.82, height: size * 0.82, borderRadius: "50%", background: C.white, boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }} />
    </div>
  );
};
// The sage check disc. p 0..1 lands it (scale and fade, no overshoot).
export const Check: React.FC<{ size?: number; p?: number; color?: string; style?: React.CSSProperties }> = ({ size = 28, p = 1, color = C.sage, style }) => {
  const q = OUT(clamp01(p));
  return <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", opacity: q, transform: `scale(${0.6 + 0.4 * q})`, ...style }}><Ico n="check" s={size * 0.68} c={C.white} w={2.8} /></div>;
};
// A small chip: white, hairline, DM Sans 500, optional leading icon or dot.
export const Chip: React.FC<{ text: string; icon?: string; dot?: string; size?: number; style?: React.CSSProperties }> = ({ text, icon, dot, size = 20, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.5, padding: `${size * 0.5}px ${size * 0.9}px`, borderRadius: 999, background: C.white, border: `1px solid ${C.line}`, boxShadow: SHADOW, fontFamily: SANS, fontWeight: 500, fontSize: size, color: C.ink, whiteSpace: "nowrap", ...style }}>
    {dot && <div style={{ width: size * 0.45, height: size * 0.45, borderRadius: "50%", background: dot }} />}{icon && <Ico n={icon} s={size * 1.05} c={C.sageDeep} w={2.2} />}{text}
  </div>
);

/* ---------- the browser frame ---------- */
// A minimal window: white, radius 16, hairline, soft shadow; a 46 px top bar with three quiet dots and a centred
// address pill. url = the pill's text ("Forhåndsvisning" while previewing, "holmfysio.dk" when live); live shows the
// lock and a sage "Live" dot. Children fill the content area (w × (h − 46)).
export const BAR = 46;
export const Browser: React.FC<{ w: number; h: number; url?: string; live?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, url = "Forhåndsvisning", live = 0, children, style }) => (
  <div style={{ width: w, height: h, borderRadius: 16, overflow: "hidden", background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, position: "relative", flex: "none", ...style }}>
    <div style={{ height: BAR, background: "#FBFAF7", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 8, position: "relative" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: "#E4E0D9" }} />)}
      <div style={{ position: "absolute", left: "50%", top: 9, transform: "translateX(-50%)", height: 28, minWidth: 320, padding: "0 16px", borderRadius: 8, background: "#F1EEE8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: SANS, fontSize: 15, color: C.muted, whiteSpace: "nowrap" }}>
        {live > 0 && <Ico n="lock" s={14} c={C.muted} w={2.2} style={{ opacity: live }} />}{url}
        {live > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginLeft: 6, color: C.sageDeep, fontWeight: 500, opacity: live }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: C.sage }} />Live</span>}
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, top: BAR, width: w, height: h - BAR, overflow: "hidden" }}>{children}</div>
  </div>
);

/* ---------- the example client's site (built by Creoble in the film) ---------- */
// "Holm Fysioterapi", a fictional clinic on Frederiksberg. Designed at 1460 × 814 (the home rect's content area);
// w scales it (the height follows the ratio unless h is given: it then shows more or less of the page). build 0..1
// generates it: each block shows as a quiet placeholder, then resolves into its content in order (nav, headline,
// text, photo, buttons, the three services). booking 0..1 adds the "Book tid" button the edit asks for. scroll =
// page offset in design px (the page is 1460 wide and 1500 tall: hero, services, a contact strip).
export const SITE = { w: 1460, h: 814, page: 1500 };
const ph = (on: number, style: React.CSSProperties, children: React.ReactNode) => (
  <div style={{ position: "relative", ...style }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(90deg,#ECE8E1,#F3F0EA,#ECE8E1)", opacity: 1 - on }} />
    <div style={{ opacity: on, transform: `translateY(${(1 - on) * 10}px)` }}>{children}</div>
  </div>
);
export const HolmSite: React.FC<{ w: number; h?: number; build?: number; booking?: number; scroll?: number }> = ({ w, h, build = 1, booking = 0, scroll = 0 }) => {
  const s = w / SITE.w, H = h ?? SITE.h * s;
  const b = (i: number) => OUT(clamp01(build * 7 - i));
  const bk = OUT(clamp01(booking));
  const photo = (src: string, st: React.CSSProperties) => <Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...st }} />;
  return (
    <div style={{ width: w, height: H, overflow: "hidden", position: "relative", background: HOLM.bg }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SITE.w, height: SITE.page, transform: `scale(${s}) translateY(${-scroll}px)`, transformOrigin: "0 0", fontFamily: SANS, color: HOLM.ink }}>
        {ph(b(0), { position: "absolute", left: 70, top: 34, width: 1320, height: 46 }, (
          <div style={{ display: "flex", alignItems: "center", height: 46 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: HOLM.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 17 }}>H</div>
            <div style={{ marginLeft: 12, fontWeight: 600, fontSize: 21, letterSpacing: "-0.01em" }}>Holm Fysioterapi</div>
            <div style={{ flex: 1 }} />
            {["Behandlinger", "Om os", "Priser", "Kontakt"].map((x) => <div key={x} style={{ marginLeft: 38, fontSize: 17, color: HOLM.muted }}>{x}</div>)}
          </div>))}
        {ph(b(1), { position: "absolute", left: 70, top: 168, width: 640, height: 230 }, (
          <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.0 }}>Kom godt i<br />bevægelse igen.</div>))}
        {ph(b(2), { position: "absolute", left: 70, top: 420, width: 560, height: 96 }, (
          <div style={{ fontSize: 21, lineHeight: 1.5, color: HOLM.muted }}>Fysioterapi og genoptræning på Frederiksberg. Vi finder årsagen og lægger en plan, der passer til dig.</div>))}
        {ph(b(3), { position: "absolute", left: 760, top: 120, width: 630, height: 560, borderRadius: 24, overflow: "hidden" }, (
          <div style={{ width: 630, height: 560, borderRadius: 24, overflow: "hidden" }}>{photo("holm-shoulder.jpg", { transform: `scale(${1.04 - 0.04 * b(3)})` })}</div>))}
        {ph(b(4), { position: "absolute", left: 70, top: 556, width: 560, height: 64 }, (
          <div style={{ display: "flex", alignItems: "center", gap: 16, height: 64 }}>
            <div style={{ width: 172 * bk, overflow: "hidden", flex: "none", opacity: bk }}>
              <div style={{ width: 156, height: 58, borderRadius: 999, background: HOLM.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 18, boxShadow: `0 0 0 ${8 * (1 - bk) * (bk > 0 ? 1 : 0)}px ${C.sageLight}66` }}><Ico n="calendar" s={18} c="#fff" w={2.4} />Book tid</div>
            </div>
            <div style={{ height: 58, padding: "0 26px", borderRadius: 999, border: `1.5px solid ${HOLM.ink}22`, display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 18, flex: "none" }}>Se behandlinger <Ico n="arrow" s={18} c={HOLM.ink} w={2.4} /></div>
          </div>))}
        {[["Fysioterapi", "holm-neck.jpg"], ["Massage", "holm-calves.jpg"], ["Genoptræning", "holm-shoulder.jpg"]].map(([t, src], i) => ph(b(5 + i * 0.6), { position: "absolute", left: 70 + i * 450, top: 760, width: 420, height: 400 }, (
          <div key={t} style={{ width: 420, height: 400, borderRadius: 22, background: "#fff", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
            <div style={{ height: 270, overflow: "hidden" }}>{photo(src, { objectPosition: i === 2 ? "70% 30%" : "50% 50%" })}</div>
            <div style={{ padding: "22px 26px", fontSize: 24, fontWeight: 600 }}>{t}<div style={{ fontSize: 17, fontWeight: 400, color: HOLM.muted, marginTop: 6 }}>Læs mere →</div></div>
          </div>)))}
        <div style={{ position: "absolute", left: 0, top: 1240, width: SITE.w, height: 260, background: HOLM.accent, color: "#fff", display: "flex", alignItems: "center", padding: "0 70px", boxSizing: "border-box", opacity: b(6.2) }}>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em" }}>Klar til at komme i gang?</div><div style={{ flex: 1 }} />
          <div style={{ height: 58, padding: "0 30px", borderRadius: 999, background: "#fff", color: HOLM.accent, display: "flex", alignItems: "center", fontWeight: 600, fontSize: 18 }}>Kontakt os</div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Creoble's builder (as on creoble.dk/builder) ---------- */
// The first step of the real builder: the left rail of steps (Virksomhed, Branche, Ydelser, Kontakt, Design,
// Billeder, Ekstra info, Social proof; `step` = how many are done, they tick in turn), the heading "Lad os starte med
// det vigtigste" (Fraunces, "vigtigste" in italic sage), "Fortæl os om din virksomhed", the fields Virksomhedsnavn
// (name, typed by the scene) and Branche (branche, empty = placeholder), and the sage "Næste" button (press 0..1).
// w × h; designed at 1440 × 860.
export const STEPS = ["Virksomhed", "Branche", "Ydelser", "Kontakt", "Design", "Billeder", "Ekstra info", "Social proof"];
export const Builder: React.FC<{ w: number; name?: string; caret?: boolean; branche?: string; step?: number; press?: number; g?: number }> = ({ w, name = "", caret = false, branche = "", step = 0, press = 0, g = 0 }) => {
  const s = w / 1440;
  const field = (label: string, value: string, placeholder: string, chevron = false, cur = false) => (
    <div style={{ marginTop: 34 }}>
      <div style={{ fontSize: 19, fontWeight: 500, color: C.ink }}>{label} <span style={{ color: C.sage }}>*</span></div>
      <div style={{ marginTop: 12, height: 64, borderRadius: 10, border: `1.5px solid ${cur ? C.sage : C.line}`, background: C.white, display: "flex", alignItems: "center", padding: "0 20px", fontSize: 21, color: value ? C.ink : C.soft, boxShadow: cur ? `0 0 0 4px ${C.sageTint}` : undefined }}>
        {value || placeholder}{cur && <span style={{ display: "inline-block", width: 2, height: 26, marginLeft: 2, background: C.sageDeep, opacity: Math.floor(g / 9) % 2 === 0 ? 1 : 0 }} />}
        <div style={{ flex: 1 }} />{chevron && <Ico n="chevron" s={22} c={C.muted} />}
      </div>
    </div>
  );
  return (
    <div style={{ width: w, height: 860 * s, overflow: "hidden", position: "relative", flex: "none" }}>
      <div style={{ width: 1440, height: 860, transform: `scale(${s})`, transformOrigin: "0 0", display: "flex", fontFamily: SANS, background: C.white }}>
        <div style={{ width: 300, background: "#F4F2EE", borderRight: `1px solid ${C.line}`, padding: "40px 32px", boxSizing: "border-box" }}>
          <div style={{ width: 150 }}><Wordmark h={31} /></div>
          <div style={{ marginTop: 52, display: "grid", gap: 26 }}>
            {STEPS.map((t, i) => { const d = clamp01(step - i); const cur = i === Math.floor(step) && step < STEPS.length; return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 19, color: d > 0 || cur ? C.ink : C.muted, fontWeight: cur ? 500 : 400 }}>
                {d > 0 ? <Check size={22} p={d} /> : <div style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${cur ? C.sage : "#D6D2CB"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{cur && <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.sage }} />}</div>}
                {t}</div>); })}
          </div>
        </div>
        <div style={{ flex: 1, position: "relative", padding: "64px 0 0 150px", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 4, width: `${12 + (step / STEPS.length) * 88}%`, background: C.sage }} />
          <div style={{ fontFamily: SERIF, fontSize: 58, letterSpacing: "-0.025em", color: C.ink }}>Lad os starte med det <span style={{ fontStyle: "italic", color: C.sage }}>vigtigste</span></div>
          <div style={{ fontSize: 22, color: C.muted, marginTop: 14 }}>Fortæl os om din virksomhed</div>
          <div style={{ width: 800 }}>
            {field("Virksomhedsnavn", name, "fx Klinik for Fysioterapi", false, caret)}
            {field("Branche", branche, "Vælg branche…", true)}
            {field("Email", "", "hej@virksomhed.dk")}
          </div>
          <div style={{ position: "absolute", left: 150, top: 690, width: 800, borderTop: `1px solid ${C.line}`, paddingTop: 30, display: "flex" }}>
            <div style={{ height: 58, padding: "0 28px", borderRadius: 10, border: `1px solid ${C.line}`, color: C.soft, display: "flex", alignItems: "center", fontSize: 19 }}>Tilbage</div>
            <div style={{ flex: 1 }} />
            <div style={{ height: 58, padding: "0 34px", borderRadius: 10, background: C.sage, color: C.white, display: "flex", alignItems: "center", fontSize: 20, fontWeight: 500, transform: `scale(${1 - 0.05 * press})` }}>Næste</div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ---------- Apple-style motion (WWDC "Designing Fluid Interfaces", translated for film) ---------- */
// aspring: a spring from label `at`, as Apple specifies it: response (s, how quickly it gets there; not a
// duration) and damping ratio (1 = critically damped, no overshoot: the default for all UI; ~0.8 only when the
// object was thrown or flicked). Returns progress 0..1 (it may pass 1 slightly when damping < 1).
// Apple's values: move/reposition 1.0 / 0.4; drawer or sheet 0.8 / 0.3 (only after a flick); rotation 0.8 / 0.4.
export const aspring = (g: number, at: string | number, response = 0.4, damping = 1) => {
  const t = (g - f(at)) / 30;
  if (t <= 0) return 0;
  const w0 = (2 * Math.PI) / response;
  if (damping >= 1) return 1 - (1 + w0 * t) * Math.exp(-w0 * t);
  const wd = w0 * Math.sqrt(1 - damping * damping);
  return 1 - Math.exp(-damping * w0 * t) * (Math.cos(wd * t) + ((damping * w0) / wd) * Math.sin(wd * t));
};
// press: Apple's press feedback, instant on the press: 0 → 1 in 0.1 s, held `hold` s, released with a spring.
// Use it as scale(1 − 0.03 × press) on buttons and keys, on the exact frame of the word that presses them.
export const press = (g: number, at: string | number, hold = 0.12) => {
  const t = (g - f(at)) / 30;
  if (t < 0) return 0;
  if (t < 0.1) return t / 0.1;
  if (t < 0.1 + hold) return 1;
  const r = t - 0.1 - hold, w0 = (2 * Math.PI) / 0.3;               // release: a critically damped spring, response 0.3 s
  return (1 + w0 * r) * Math.exp(-w0 * r);
};
// Note: k, f, aspring and press take a label ("w:skriv", "h2+0.2") or a time in SECONDS. For frame numbers use
// kf(g, firstFrame, durationFrames, ease).
// Glass: Apple's translucent material for floating UI (a prompt bar, chips, a chat card, a toolbar over the site):
// semi-transparent white over a backdrop blur, a bright top edge, a soft shadow. p 0..1 materializes it (the blur
// radius, scale and opacity arrive together, not a plain fade). Bigger surfaces read thicker: pass weight 1.2–1.5.
export const Glass: React.FC<{ p?: number; radius?: number; weight?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ p = 1, radius = 20, weight = 1, children, style }) => {
  const q = clamp01(p);
  return (
    <div style={{ borderRadius: radius, background: `rgba(255,255,255,${0.55 + 0.1 * weight})`, backdropFilter: `blur(${20 * weight * q}px) saturate(${100 + 60 * q}%)`, WebkitBackdropFilter: `blur(${20 * weight * q}px) saturate(${100 + 60 * q}%)`,
      border: "1px solid rgba(255,255,255,0.55)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.7), 0 ${18 * weight}px ${46 * weight}px -${22 * weight}px rgba(26,22,20,0.32), 0 0 0 1px ${C.line}`,
      opacity: q, transform: `scale(${0.96 + 0.04 * q})`, fontFamily: SANS, color: C.ink, ...style }}>{children}</div>
  );
};
// Scrim: "dim to focus". When one surface comes forward for a moment (a lifted card, a modal), lay this between it
// and the rest: the background dims a little toward the ground colour. p 0..1.
export const Scrim: React.FC<{ p: number }> = ({ p }) => <div style={{ position: "absolute", inset: 0, background: `rgba(250,250,248,${0.62 * clamp01(p)})` }} />;


/* ---------- constant motion (v2 of the film: Apple-style motion design, never a still) ---------- */
// drift: a constant, eased travel over a shot, from a to b between labels (or seconds) `from` and `to`. Use it so
// every element keeps moving while it is on screen (a slow push of scale 1 → 1.05, a pan of 40–120 px, a scroll).
export const drift = (g: number, from: string | number, to: string | number, a: number, b: number) => {
  const t0 = f(from), t1 = f(to);
  return mix(a, b, INOUT(clamp01((g - t0) / Math.max(1, t1 - t0))));
};
// The builders' boundary transition (and any whip inside a span): a speed-matched whip to the left. The outgoing
// content accelerates out over WHIP frames into the cut at frame `at` (whipOut: 0 → −W px); the incoming content
// enters at the cut at the same speed and decelerates (whipIn: +W → 0 px). Both move 2W/WHIP px per frame at the
// cut, so the cut lands on the fastest frame and the final render's motion blur smears it. Apply as translateX on
// the whole shot; fade the outgoing a little (whipFade) so the two never read as one frame.
export const WHIP = 9, WHIP_W = 1100;
export const whipOut = (g: number, at: string | number) => { const t = clamp01((g - (f(at) - WHIP)) / WHIP); return -WHIP_W * t * t; };
export const whipIn = (g: number, at: string | number) => { const t = clamp01((g - f(at)) / WHIP); return WHIP_W * (1 - t) * (1 - t); };
export const whipFade = (g: number, at: string | number) => 1 - 0.5 * clamp01((g - (f(at) - WHIP)) / WHIP);
// KineticLine: Apple-style kinetic type. Each word springs in on its label (from below through a mask, a little
// scale), the whole line keeps moving while it holds (drifts dx px and grows by `grow` over its life), and on `out`
// it pushes off in direction `dir` (left/up) with a fade. Fraunces 400 like the site; it = italic deep sage.
export const KineticLine: React.FC<{ g: number; words: Wd[]; x: number; y: number; size: number; out?: string; dir?: "left" | "up"; dx?: number; grow?: number; align?: "left" | "center"; color?: string; sans?: boolean }> = ({
  g, words, x, y, size, out, dir = "up", dx = -40, grow = 0.05, align = "left", color = C.ink, sans = false }) => {
  const first = f(words[0].at), last = out ? f(out) : first + 90;
  const life = clamp01((g - first) / Math.max(1, last - first + 12));
  const o = out ? clamp01((g - f(out)) / 10) : 0, oe = EXIT(o);
  if (o >= 1) return null;
  const tx = dx * life + (dir === "left" ? -oe * 520 : 0), ty = dir === "up" ? -oe * size * 1.2 : 0;
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - 1600 : x, top: y, width: align === "center" ? 3200 : undefined, display: "flex", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.24,
      fontFamily: sans ? SANS : SERIF, fontWeight: sans ? 500 : 400, fontSize: size, letterSpacing: sans ? "-0.03em" : "-0.025em", lineHeight: 1.05, color, whiteSpace: "nowrap",
      transform: `translate(${tx}px, ${ty}px) scale(${1 + grow * life})`, transformOrigin: align === "center" ? "50% 50%" : "0% 50%", opacity: 1 - oe }}>
      {words.map((w, i) => {
        const p = aspring(g, w.at, 0.42, 1);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.16, marginBottom: -size * 0.16, paddingRight: w.it ? size * 0.06 : 0 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - Math.min(1, p)) * 100}%) scale(${0.92 + 0.08 * Math.min(1, p)})`, transformOrigin: "50% 100%", fontStyle: w.it ? "italic" : "normal", color: w.it ? C.sageDeep : undefined }}>{w.t}</span>
          </span>
        );
      })}
    </div>
  );
};
// RollNumber: digits that roll into place like a counter (each digit column slides through 0–9 with a spring,
// later digits arriving a little later). value = the number shown; p 0..1 progress of the roll (from `from`).
export const RollNumber: React.FC<{ value: number; from?: number; p: number; size: number; color?: string; serif?: boolean }> = ({ value, from = 0, p, size, color = C.ink, serif = true }) => {
  const digits = String(value).split(""), fromD = String(from).padStart(digits.length, "0").split("");
  return (
    <div style={{ display: "inline-flex", fontFamily: serif ? SERIF : SANS, fontSize: size, lineHeight: 1, color, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
      {digits.map((d, i) => {
        const q = clamp01(p * 1.15 - i * 0.08), a = Number(fromD[i] ?? 0), b = Number(d), turns = (b - a + 10) % 10 + (i === 0 ? 10 : 0);
        const pos = a + turns * OUT(q);
        return (
          <span key={i} style={{ display: "inline-block", height: size * 1.25, overflow: "hidden", position: "relative", width: "0.62em" }}>
            <span style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-(pos % 10) * size * 1.25}px)` }}>
              {Array.from({ length: 11 }, (_, n) => <div key={n} style={{ height: size * 1.25, lineHeight: `${size * 1.25}px`, textAlign: "center" }}>{n % 10}</div>)}
            </span>
          </span>
        );
      })}
    </div>
  );
};


/* ---------- version 3: obvious Apple — bounce, Liquid Glass, the ink capsule, liquid merges, bouncy type ---------- */
// NOTE (version 3): the film renders at 60 fps; g is the 30-unit clock and is FRACTIONAL (g = frame / 2). Never
// index arrays with g; never assume integer g. Labels and seconds work as before.
// bounce: an Apple bouncy spring (iOS "bouncy"): it overshoots its target and settles. Use it for things that pop
// in, land, get thrown or snap (chips, tiles, icons, toggles, buttons, capsules, numbers). damping 0.55 = playful,
// 0.7 = gentle. Returns progress that passes 1 and comes back.
export const bounce = (g: number, at: string | number, response = 0.5, damping = 0.62) => aspring(g, at, response, damping);
// squash: Liquid-Glass squash and stretch from velocity (px per 1/30 s): a moving glass object stretches along its
// travel and thins across it, then rounds out when it stops. Compute vx, vy from your position at g and g − 0.5.
export const squash = (vx: number, vy: number, amount = 0.0011) => {
  const v = Math.hypot(vx, vy), s = Math.min(0.22, v * amount), a = Math.atan2(vy, vx);
  return `rotate(${a}rad) scale(${1 + s}, ${1 - s * 0.6}) rotate(${-a}rad)`;
};
// FilterDefs: the SVG filters the kit uses (Story draws them once): "goo" (liquid merge: blobs that touch flow
// together) and "lg-refract" (Liquid Glass's refraction of what is behind it).
export const FilterDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="goo" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
        <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="g" />
        <feComposite in="SourceGraphic" in2="g" operator="atop" />
      </filter>
      <filter id="lg-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={LG_MAP} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="70" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);
// LiquidGlass: Apple's Liquid Glass material. What is behind it is blurred a little; a rim lens (a ring just inside the
// edge, brighter and more saturated) reads as the glass's thickness bending light; a bright rim and an inner glow catch
// the light. (No SVG refraction: lg-refract in a backdrop-filter renders in rectangular seams in headless Chrome.) a specular highlight slides across it (sheen 0..1, move it as the
// glass moves). p 0..1(+) materializes it (pass a bounce for a springy arrival). w × h, radius (default: a pill).
// tint: "clear" (white glass) or "sage" (Creoble-tinted glass). transform: e.g. a squash() from its velocity.
export const LiquidGlass: React.FC<{ w: number; h: number; radius?: number; p?: number; sheen?: number; tint?: "clear" | "sage" | "ink"; transform?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  w, h, radius, p = 1, sheen = 0.3, tint = "clear", transform = "", children, style }) => {
  const q = Math.max(0, p), r = radius ?? Math.min(w, h) / 2, o = clamp01(q * 2);
  const base = tint === "sage" ? "rgba(135,168,158,0.30)" : tint === "ink" ? "rgba(26,22,20,0.55)" : "rgba(255,255,255,0.28)";
  return (
    <div style={{ width: w, height: h, borderRadius: r, position: "relative", overflow: "hidden", opacity: o, transform: `${transform} scale(${0.7 + 0.3 * q})`,
      backdropFilter: `blur(${3 + 3 * clamp01(q)}px) saturate(112%) brightness(1.05)`, WebkitBackdropFilter: `blur(${3 + 3 * clamp01(q)}px) saturate(112%) brightness(1.05)`,
      background: `linear-gradient(160deg, ${base}, rgba(255,255,255,0.06))`,
      boxShadow: `inset 0 1.5px 1px rgba(255,255,255,0.95), inset 0 -1.5px 1px rgba(255,255,255,0.45), inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 0 24px rgba(255,255,255,0.25), 0 18px 46px -18px rgba(26,22,20,0.38)`,
      fontFamily: SANS, color: tint === "ink" ? C.cream : C.ink, flex: "none", ...style }}>
      {/* the rim lens: a ring just inside the edge where the glass is thickest bends more light: brighter, more saturated, a little clearer */}
      <div style={{ position: "absolute", inset: 0, borderRadius: r, padding: Math.min(16, Math.min(w, h) * 0.12), backdropFilter: "brightness(1.10) saturate(135%) contrast(1.04)", WebkitBackdropFilter: "brightness(1.10) saturate(135%) contrast(1.04)",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: `radial-gradient(90% 70% at ${8 + 84 * sheen}% -10%, rgba(255,255,255,0.75), rgba(255,255,255,0) 55%)`, mixBlendMode: "screen", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: `radial-gradient(70% 50% at ${92 - 70 * sheen}% 115%, rgba(255,255,255,0.45), rgba(255,255,255,0) 60%)`, mixBlendMode: "screen", pointerEvents: "none" }} />
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
};
// Island: a Dynamic-Island-style ink capsule. It starts as a small pill (180 × 52) and springs open to w × h with a
// bounce (p from bounce(); it may pass 1), its corners staying round; children fade in once it is mostly open. Place
// it by its top centre (x, y). Use it for live status: "Opdateret", "Live", "0 kr", a notification.
export const Island: React.FC<{ x: number; y: number; w: number; h: number; p: number; children?: React.ReactNode }> = ({ x, y, w, h, p, children }) => {
  const W = mix(180, w, p), H = mix(52, h, p), R = Math.min(H / 2, mix(26, Math.min(44, h / 2), clamp01(p)));
  // the layout box is whole, even pixels (Wl × Hl); y and the fraction left over are a transform, so the capsule glides
  // as it drops and springs open instead of snapping its edges to the pixel grid
  const Wl = Math.max(2, 2 * Math.round(W / 2)), Hl = Math.max(2, 2 * Math.round(H / 2));
  return (
    <div style={{ position: "absolute", left: x - Wl / 2, top: 0, width: Wl, height: Hl, borderRadius: R, transform: `translateY(${y}px) scale(${W / Wl}, ${H / Hl})`, transformOrigin: "50% 0", background: C.ink, boxShadow: "0 20px 50px -20px rgba(26,22,20,0.6)", overflow: "hidden", color: C.cream, fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${(Wl - w) / 2}px, ${(Hl - h) / 2}px)`, opacity: clamp01((p - 0.55) * 3) }}>{children}</div>
    </div>
  );
};
// Gooey: wrap sage/ink blobs (circles, pills) in it and they melt into each other where they touch — Apple's
// liquid merge (a bubble splitting into two, chips flowing into a button). Solid colours only inside.
export const Gooey: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, filter: "url(#goo)", ...style }}>{children}</div>
);
// BounceText: Apple's bouncy letter build. Each letter pops up from below and springs past its size and back,
// one after another (stagger s apart) from label `at`. Fraunces 400 (or DM Sans 600 with sans); it = italic deep
// sage (or `itColor`). Place with x, y (top-left; align "center" makes x the centre).
export const BounceText: React.FC<{ g: number; text: string; at: string | number; x: number; y: number; size: number; it?: boolean; sans?: boolean; color?: string; itColor?: string; stagger?: number; align?: "left" | "center"; damping?: number }> = ({
  g, text, at, x, y, size, it = false, sans = false, color = C.ink, itColor = C.sageDeep, stagger = 0.028, align = "left", damping = 0.55 }) => {
  const t0 = (typeof at === "number" ? at : f(at) / 30);
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - 1600 : x, top: y, width: align === "center" ? 3200 : undefined, display: "flex", justifyContent: align === "center" ? "center" : "flex-start",
      fontFamily: sans ? SANS : SERIF, fontWeight: sans ? 600 : 400, fontStyle: it ? "italic" : "normal", fontSize: size, letterSpacing: sans ? "-0.03em" : "-0.025em", lineHeight: 1.05, color: it ? itColor : color, whiteSpace: "pre" }}>
      {text.split("").map((ch, i) => {
        const p = aspring(g, t0 + i * stagger, 0.42, damping);
        return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * 0.55}em) scale(${0.4 + 0.6 * p})`, transformOrigin: "50% 90%", opacity: clamp01(p * 2.5) }}>{ch}</span>;
      })}
    </div>
  );
};


// Version 3 boundaries — each builder boundary uses a DIFFERENT transition (Karl: "everything moves to the left"):
//   h1 = speed-matched push UP (pushOutUp on the outgoing shot, pushInUp on the incoming);
//   h2 = a hard cut on the beat: the incoming shot pops in with a bounce (nothing shared);
//   h3 = a sage iris: SageIris drawn by BOTH sides (a disc grows to cover the frame by h3, then shrinks away,
//        revealing the new shot around it);
//   h4 = speed-matched whip to the RIGHT (whipOutR / whipInR).
export const pushOutUp = (g: number, at: string | number) => { const t = clamp01((g - (f(at) - WHIP)) / WHIP); return -900 * t * t; };
export const pushInUp = (g: number, at: string | number) => { const t = clamp01((g - f(at)) / WHIP); return 900 * (1 - t) * (1 - t); };
export const whipOutR = (g: number, at: string | number) => -whipOut(g, at);
export const whipInR = (g: number, at: string | number) => -whipIn(g, at);
export const SageIris: React.FC<{ g: number; at: string | number; cx?: number; cy?: number }> = ({ g, at, cx = 960, cy = 540 }) => {
  const t0 = f(at), grow = INOUT(clamp01((g - (t0 - 11)) / 11)), shrink = INOUT(clamp01((g - t0) / 13));
  const r = g < t0 ? grow * 1150 : (1 - shrink) * 1150;
  if (r <= 0.5) return null;
  return <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: C.sage }} />;
};

/* ---------- the site's home position and the hand-offs ---------- */
// The thread of the film is the client's website. Its home position: a Browser at x 230, y 106, 1460 × 860 (content
// 1460 × 814), centred. Each builder may move it, but at every hand-off frame it is exactly here, in the state below.
export const HOME = { x: 230, y: 106, w: 1460, h: 860 };
export const SiteHome: React.FC<{ booking?: number; url?: string; live?: number; scroll?: number }> = ({ booking = 0, url = "Forhåndsvisning", live = 0, scroll = 0 }) => (
  <Browser w={HOME.w} h={HOME.h} url={url} live={live} style={{ position: "absolute", left: HOME.x, top: HOME.y }}>
    <HolmSite w={HOME.w} h={HOME.h - BAR} booking={booking} scroll={scroll} />
  </Browser>
);
// h1 (B1 → B2, "Det bedste?"): the finished site, preview, no booking button.
export const Handoff1: React.FC = () => <SiteHome />;
// h2 (B2 → B3, "Tilfreds?") and h3 (B3 → B4, "Skal den på nettet?"): the site with the "Book tid" button.
export const Handoff2: React.FC = () => <SiteHome booking={1} />;
export const Handoff3: React.FC = () => <SiteHome booking={1} />;
// h4 (B4 → B5, "Brug for hjælp?"): the site live on its own domain.
export const Handoff4: React.FC = () => <SiteHome booking={1} url="holmfysio.dk" live={1} />;

export { C, EXIT, HOLM, INOUT, LIN, OUT, SANS, SERIF, SHADOW, SHADOW_BIG, WIPE, clamp01, mix };
