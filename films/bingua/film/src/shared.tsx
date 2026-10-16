// Bingua — the shared kit every scene builds with: the clock helpers, the feed swipe, the statement type (Say), the
// logo and wordmark, icons, white cards, the video card (real footage), the app's own UI pieces rebuilt at film scale
// (transcript line, word pop-up, + Save, flashcard, tap), a 3D plane and a phone. Scenes import from here and never
// redefine these. Tokens and eases live in ./lib.
import React from "react";
import { OffthreadVideo, staticFile } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, MOVE, SNAP, clamp01, mix } from "./lib";

export const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
export const f = (at: string | number) => T.f(at);
export const SANS = "Inter";
export const typed = (g: number, at: string | number, text: string, cps = 34) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));

/* ---------- the feed swipe: the film scrolls between scenes like the app's feed ---------- */
// A scene wraps its content in <Feed g in="s1" out="s2">: it scrolls up into place at its "in" swipe and scrolls
// away upward at its "out" swipe (0.45 s, MOVE). Both scenes of a swipe move together, so the join is one scroll.
export const SWIPE = 0.45;
// h = the frame height: 1080 for the 16:9 film, 1920 for the portrait version.
export const feedY = (g: number, inAt?: string, outAt?: string, h = 1080) =>
  (inAt ? (1 - k(g, inAt, SWIPE, MOVE)) * h : 0) - (outAt ? k(g, outAt, SWIPE, MOVE) * h : 0);
export const Feed: React.FC<{ g: number; in?: string; out?: string; h?: number; children: React.ReactNode }> = ({ g, in: inAt, out, h = 1080, children }) => {
  const y = feedY(g, inAt, out, h);
  if (Math.abs(y) >= h) return null;
  return <div style={{ position: "absolute", inset: 0, transform: `translateY(${y}px)` }}>{children}</div>;
};

/* ---------- statement type: words rise, fade and sharpen; the key word in sky blue ---------- */
export type Wd = { t: string; at: string; blue?: boolean };
export const Say: React.FC<{ g: number; words: Wd[]; y: number; size: number; out?: string; weight?: number; color?: string; x?: number; align?: "center" | "left"; width?: number }> = ({
  g, words, y, size, out, weight = 700, color = C.ink, x, align = "center", width = 1920 }) => {
  const o = out ? k(g, out, 0.45) : 0;
  if (o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x ?? 0, top: 0, width, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26,
      transform: `translateY(${y - o * 24}px) perspective(4000px) rotateX(0.01deg)`, opacity: 1 - o, filter: o > 0 ? `blur(${o * 8}px)` : undefined,
      fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: "-0.035em", lineHeight: 1.08, color, whiteSpace: "nowrap" }}>
      {words.map((w, i) => {
        const kk = k(g, w.at, 0.6);
        return <span key={i} style={{ display: "inline-block", color: w.blue ? C.sky : undefined, opacity: Math.min(1, kk * 1.6), transform: `translateY(${(1 - kk) * size * 0.32}px)`,
          filter: kk < 1 ? `blur(${(1 - kk) * 8}px)` : undefined }}>{w.t}</span>;
      })}
    </div>
  );
};

/* ---------- the logo (navy tile, sky play triangle, two subtitle bars) and the wordmark ---------- */
// play / bars 0..1 build the mark's parts (the triangle first, then the white and the blue subtitle bar).
export const Logo: React.FC<{ s?: number; play?: number; bars?: number; style?: React.CSSProperties }> = ({ s = 180, play = 1, bars = 1, style }) => (
  <svg width={s} height={s} viewBox="0 0 180 180" style={{ display: "block", ...style }}>
    <rect x="0" y="0" width="180" height="180" rx="40" fill={C.navy} />
    <path d="M73 42 L118 66 L73 90 Z" fill={C.sky} stroke={C.sky} strokeWidth={6} strokeLinejoin="round"
      style={{ transformOrigin: "90px 66px", transform: `scale(${0.3 + 0.7 * play})`, opacity: clamp01(play * 2) }} />
    <rect x="37" y="108" width={106 * clamp01(bars * 1.6)} height="18" rx="9" fill={C.white} />
    <rect x="53" y="137" width={73 * clamp01(bars * 1.6 - 0.6)} height="18" rx="9" fill={C.sky} opacity={0.75} />
  </svg>
);
export const Wordmark: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = C.ink, style }) => (
  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: "-0.035em", color, lineHeight: 1, ...style }}>Bingua</div>
);

/* ---------- icons (SF-like monoline) ---------- */
export const P: Record<string, React.ReactNode> = {
  play: <><path d="M16 11 L37 24 L16 37 Z" /></>,
  plus: <><path d="M24 11 V37 M11 24 H37" /></>,
  check: <><path d="M11 25 L20 33 L37 15" /></>,
  x: <><path d="M14 14 L34 34 M34 14 L14 34" /></>,
  heart: <><path d="M24 39 C10 30 6 23 6 17 a9 9 0 0 1 18 -3 a9 9 0 0 1 18 3 c0 6 -4 13 -18 22 Z" /></>,
  bookmark: <><path d="M14 8 H34 V41 L24 33 L14 41 Z" /></>,
  speaker: <><path d="M9 19 H16 L26 11 V37 L16 29 H9 Z" /><path d="M32 18 a8 8 0 0 1 0 12" /><path d="M36 13 a14 14 0 0 1 0 22" /></>,
  cards: <><rect x="12" y="13" width="26" height="28" rx="4" /><path d="M8 33 V11 a4 4 0 0 1 4 -4 H30" /></>,
  quiz: <><circle cx="24" cy="24" r="17" /><path d="M19 19 a5 5 0 1 1 7 4.5 c-1.6 .8 -2 1.8 -2 3.5" /><path d="M24 33 v.5" /></>,
  home: <><path d="M8 22 L24 9 L40 22 V39 H8 Z" /><path d="M19 39 V28 H29 V39" /></>,
  bolt: <><path d="M27 6 L12 27 H23 L21 42 L36 20 H25 Z" /></>,
  flame: <><path d="M24 42 c-8 0 -13 -5 -13 -12 c0 -8 8 -11 8 -20 c5 3 9 8 9 13 c2 -2 3 -4 3 -6 c4 4 6 8 6 13 c0 7 -5 12 -13 12 Z" /></>,
  arrow: <><path d="M10 24 H37" /><path d="M27 14 L37 24 L27 34" /></>,
  swipe: <><path d="M38 24 H12" /><path d="M20 16 L12 24 L20 32" /></>,
  mic: <><rect x="18" y="7" width="12" height="22" rx="6" /><path d="M12 23 a12 12 0 0 0 24 0 M24 35 V41" /></>,
  keyboard: <><rect x="6" y="13" width="36" height="22" rx="4" /><path d="M12 20 h2 M18 20 h2 M24 20 h2 M30 20 h2 M36 20 h0 M14 28 H34" /></>,
  headphones: <><path d="M8 30 V24 a16 16 0 0 1 32 0 V30" /><rect x="8" y="28" width="7" height="11" rx="3" /><rect x="33" y="28" width="7" height="11" rx="3" /></>,
  match: <><circle cx="12" cy="14" r="4" /><circle cx="12" cy="34" r="4" /><circle cx="36" cy="14" r="4" /><circle cx="36" cy="34" r="4" /><path d="M16 14 L32 34 M16 34 L32 14" /></>,
  list: <><path d="M16 13 H40 M16 24 H40 M16 35 H40" /><path d="M8 13 h1 M8 24 h1 M8 35 h1" /></>,
  book: <><path d="M24 12 C19 8 12 8 7 10 V39 C12 37 19 37 24 41 C29 37 36 37 41 39 V10 C36 8 29 8 24 12 Z" /><path d="M24 12 V41" /></>,
  pencil: <><path d="M10 38 L12 30 L32 10 L38 16 L18 36 Z" /><path d="M28 14 L34 20" /></>,
  chart: <><path d="M8 40 H40" /><path d="M13 34 V26 M21 34 V20 M29 34 V14 M37 34 V9" /></>,
  gauge: <><path d="M8 32 a16 16 0 0 1 32 0" /><path d="M24 32 L32 20" /><circle cx="24" cy="32" r="2.5" /></>,
  clock: <><circle cx="24" cy="24" r="17" /><path d="M24 14 V24 L31 28" /></>,
  globe: <><circle cx="24" cy="24" r="17" /><path d="M7 24 H41" /><path d="M24 7 c-6 6 -6 28 0 34 c6 -6 6 -28 0 -34" /></>,
  chat: <><path d="M8 12 H40 V32 H22 L13 39 V32 H8 Z" /></>,
  translate: <><path d="M7 11 H25 M16 7 V11 M11 11 c1 7 6 12 12 15 M21 11 c-1 7 -6 12 -12 15" /><path d="M26 41 L33 24 L40 41 M28.5 35 H37.5" /></>,
};
export const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number; fill?: string }> = ({ n, s = 24, c = C.ink, w = 2.4, fill = "none" }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill={fill} stroke={c} strokeWidth={w * (48 / s) * (s / 26)} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>{P[n]}</svg>
);

/* ---------- the white card (the site's own surface) ---------- */
export const CARD: React.CSSProperties = { background: C.white, borderRadius: 24, boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 24px 50px -24px rgba(15,26,41,0.28)" };

/* ---------- real videos ---------- */
// Seven portrait clips (405×720, 8 s, 30 fps; Mixkit, see public/clips/CREDITS.md): v1 woman talking with a friend,
// v2 friends at a coffee shop, v3 influencer talking to camera, v4 woman talking to camera, v5 woman eating street
// food, v6 women chatting in a cafeteria, v7 youtuber vlogging.
export const CLIPS = ["v1", "v2", "v3", "v4", "v5", "v6", "v7"];
// A playing video in a rounded card. from = which second of the clip to start at; it plays from the moment the card
// mounts. Keep any one card on screen under 8 s minus from (the clips are 8 s long).
export const VideoCard: React.FC<{ clip: string; w: number; h: number; r?: number; from?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ clip, w, h, r = 28, from = 0, style, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: r, overflow: "hidden", background: C.navy, boxShadow: "0 30px 60px -28px rgba(15,26,41,0.45)", ...style }}>
    <OffthreadVideo src={staticFile(`clips/${clip}.mp4`)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    {children}
  </div>
);

/* ---------- the app's UI, rebuilt at film scale ---------- */
// A transcript line: the target language in bold, the translation under it in gray; active lines sit on the sky tint.
// mark = a word of `es` to highlight (as when tapped).
export const Line: React.FC<{ es: string; en?: string; enO?: number; active?: number; mark?: string; markO?: number; size?: number; w?: number; style?: React.CSSProperties }> = ({
  es, en, enO = 1, active = 0, mark, markO = 1, size = 30, w = 720, style }) => {
  const parts = mark ? es.split(mark) : [es];
  return (
    <div style={{ width: w, padding: `${size * 0.5}px ${size * 0.7}px`, borderRadius: size * 0.5, boxSizing: "border-box", background: `rgba(228,243,252,${active})`, ...style }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: "-0.015em", lineHeight: 1.25, color: C.ink }}>
        {mark ? <>{parts[0]}<span style={{ background: `rgba(47,175,238,${0.28 * markO})`, borderRadius: 6, padding: "0 4px", margin: "0 -4px", boxShadow: `inset 0 -3px 0 rgba(47,175,238,${markO})` }}>{mark}</span>{parts.slice(1).join(mark)}</> : es}
      </div>
      {en && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: size * 0.8, lineHeight: 1.3, color: C.gray, marginTop: size * 0.2, opacity: enO }}>{en}</div>}
    </div>
  );
};
// "+ Save" — the app's save pill. done 0..1 turns it into "✓ Saved".
export const SaveBtn: React.FC<{ size?: number; done?: number; press?: number }> = ({ size = 26, done = 0, press = 0 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.3, padding: `${size * 0.35}px ${size * 0.75}px`, borderRadius: 999, background: done > 0.5 ? C.skyDeep : C.sky, color: C.white,
    fontFamily: SANS, fontWeight: 600, fontSize: size, transform: `scale(${1 - 0.08 * press})`, whiteSpace: "nowrap" }}>
    <Ico n={done > 0.5 ? "check" : "plus"} s={size * 0.95} c={C.white} w={3} />{done > 0.5 ? "Saved" : "Save"}
  </div>
);
// The tap-a-word pop-up: the word, a speaker, + Save, the translation, its word class and a plain-English note.
export const WordPop: React.FC<{ word: string; trans: string; kind?: string; note?: string; size?: number; saved?: number; press?: number; style?: React.CSSProperties }> = ({
  word, trans, kind = "ADJECTIVE", note, size = 40, saved = 0, press = 0, style }) => (
  <div style={{ ...CARD, padding: `${size * 0.6}px ${size * 0.7}px`, width: size * 13, boxSizing: "border-box", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: "-0.02em", color: C.ink }}>{word}</div>
      <Ico n="speaker" s={size * 0.6} c={C.sky} w={2.6} />
      <div style={{ flex: 1 }} />
      <SaveBtn size={size * 0.5} done={saved} press={press} />
    </div>
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: size * 0.6, color: C.gray, marginTop: size * 0.15 }}>{trans}</div>
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3, marginTop: size * 0.35 }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size * 0.34, letterSpacing: "0.04em", color: C.green, background: C.greenTint, borderRadius: 6, padding: `${size * 0.08}px ${size * 0.2}px` }}>{kind}</div>
      {note && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: size * 0.4, color: C.gray }}>{note}</div>}
    </div>
  </div>
);
// A flashcard: front shows the word, back shows the translation and the line it came from. flip 0..1 turns it.
export const Flashcard: React.FC<{ word: string; trans: string; context?: string; flip?: number; w?: number; h?: number; style?: React.CSSProperties }> = ({ word, trans, context, flip = 0, w = 520, h = 340, style }) => {
  const a = flip * 180, back = a > 90;
  return (
    <div style={{ width: w, height: h, transform: `perspective(1800px) rotateY(${a}deg)`, ...style }}>
      <div style={{ ...CARD, position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
        transform: back ? "rotateY(180deg)" : undefined }}>
        {!back ? <>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: w * 0.12, letterSpacing: "-0.03em", color: C.ink }}>{word}</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.04, letterSpacing: "0.06em", color: C.light }}>TAP TO FLIP</div>
        </> : <>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: w * 0.1, letterSpacing: "-0.03em", color: C.sky }}>{trans}</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.05, color: C.gray }}>{word}</div>
          {context && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: w * 0.038, color: C.gray, background: C.bg, borderRadius: 12, padding: "10px 16px", maxWidth: w * 0.84, textAlign: "center" }}>{context}</div>}
        </>}
      </div>
    </div>
  );
};
// A finger tap at (x, y): p 0..1 — a press dot, then a ring that widens and fades.
export const Tap: React.FC<{ x: number; y: number; p: number; size?: number }> = ({ x, y, p, size = 70 }) => {
  if (p <= 0 || p >= 1) return null;
  const dot = p < 0.35 ? p / 0.35 : 1 - (p - 0.35) / 0.65, ring = clamp01((p - 0.15) / 0.85);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -size * 0.3, top: -size * 0.3, width: size * 0.6, height: size * 0.6, borderRadius: "50%", background: "rgba(15,26,41,0.22)", opacity: dot, transform: `scale(${0.7 + 0.3 * dot})` }} />
      <div style={{ position: "absolute", left: -size / 2, top: -size / 2, width: size, height: size, borderRadius: "50%", border: `3px solid ${C.sky}`, opacity: 1 - ring, transform: `scale(${0.5 + ring})` }} />
    </div>
  );
};
// A chip (language, tag, counter): white pill with an optional icon.
export const Chip: React.FC<{ text: string; icon?: string; size?: number; color?: string; bg?: string; style?: React.CSSProperties }> = ({ text, icon, size = 26, color = C.ink, bg = C.white, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.45}px ${size * 0.8}px`, borderRadius: 999, background: bg, boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 14px 30px -16px rgba(15,26,41,0.3)",
    fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: "-0.01em", color, whiteSpace: "nowrap", ...style }}>
    {icon && <Ico n={icon} s={size * 1.05} c={C.sky} w={2.4} />}{text}
  </div>
);

/* ---------- a 3D plane and a phone ---------- */
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
// Use the phone sparingly: the brief asks to explain with UI and visual animation, not a phone on screen all the time.
export const PW = 392, PH = 830;
export const Phone: React.FC<{ x: number; y: number; s: number; o?: number; children: React.ReactNode }> = ({ x, y, s, o = 1, children }) => {
  const B = 13, W = PW + 2 * B, H = PH + 2 * B;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${x - W / 2}px, ${y - H / 2}px) scale(${s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%", opacity: o }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 66, background: "#141416", boxShadow: "0 0 0 2px #C9CACE, 0 50px 90px -40px rgba(15,26,41,0.55)" }}>
        <div style={{ position: "absolute", left: B, top: B, width: PW, height: PH, borderRadius: 54, overflow: "hidden", background: C.white }}>{children}</div>
        <div style={{ position: "absolute", left: W / 2 - 62, top: 26, width: 124, height: 36, borderRadius: 18, background: "#0A0A0B" }} />
      </div>
    </div>
  );
};

/* ---------- example content (from the app's own screens, Spanish) ---------- */
export const LANGS = [
  { name: "Spanish", hi: "¡Hola!" }, { name: "French", hi: "Salut !" }, { name: "German", hi: "Hallo!" },
  { name: "Dutch", hi: "Hoi!" }, { name: "Italian", hi: "Ciao!" }, { name: "Portuguese", hi: "Olá!" },
];
export const LINES = [
  { es: "O sea, trae lechuga para cinco familias, tío.", en: "That is, it brings lettuce for five families, man." },
  { es: "No moleste, no ve que estoy ocupado", en: "Don't bother me—can't you see I'm busy?" },
  { es: "¿Qué está ocurriendo?", en: "What's going on?" },
  { es: "Sí, amorita, a la noche nos vemos", en: "Yeah, sweetheart, see you tonight" },
];
export const WORD = { word: "ocupado", trans: "busy", kind: "ADJECTIVE", note: "occupied, having no time" };
export const CARDS = [
  { word: "ocupado", trans: "busy" }, { word: "grandes", trans: "great" }, { word: "lechuga", trans: "lettuce" }, { word: "la noche", trans: "the night" },
];
export { ARRIVE, C, MOVE, SNAP, clamp01, mix };
