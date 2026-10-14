// Gucci — "A statement of distinction." A slow luxury film in black and ivory, letterboxed: the crowd that sees
// everything narrows to a single beam of light (remembered by the few); 1921; Italian craftsmanship in close-up;
// individuality, prestige, style; the detail (a thread through a needle); the legacy (the Web stripe drawn across);
// leather goods and fashion side by side; a presence that cannot be replicated (copies that fall away); the one who
// stands apart as the crowd parts; and the stripe's line becomes the rule under the wordmark.
// Footage: Mixkit (free licence), mood only, no Gucci product is shown or implied.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, MOVE, clamp01, mix } from "./lib";
import { breathe, off } from "./kinetic";

const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
const f = (at: string | number) => T.f(at);
const SERIF = "Bodoni Moda", SANS = "Manrope";
const BAR = 118;                                     // the letterbox (2.4:1 picture)

const COLD = "grayscale(0.9) contrast(1.18) brightness(0.62)";
const WARM = "saturate(0.72) sepia(0.2) contrast(1.14) brightness(0.8)";
const BW = "grayscale(1) sepia(0.14) contrast(1.22) brightness(0.82)";
const RICH = "saturate(0.95) sepia(0.08) contrast(1.12) brightness(0.78)";

/** A piece of footage between two labels: trimmed, slowed, pushed, graded, optionally masked. */
const Clip: React.FC<{ g: number; src: string; from: string | number; to: string | number; trim: number; rate?: number; z0?: number; z1?: number; pos?: string;
  grade?: string; o?: number; clip?: string; dx?: number; style?: React.CSSProperties }> = ({ g, src, from, to, trim, rate = 1, z0 = 1.08, z1 = 1.16, pos = "50% 50%", grade = WARM, o = 1, clip, dx = 0, style }) => {
  const a = f(from), b = f(to);
  if (g < a - 1 || g >= b || o <= 0.003) return null;
  const t = clamp01((g - a) / Math.max(1, b - a));
  return (
    <Sequence from={a} durationInFrames={b - a} layout="none">
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", opacity: o, clipPath: clip, ...style }}>
        <OffthreadVideo src={staticFile(`footage/${src}`)} trimBefore={Math.round(trim * 30)} playbackRate={rate} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transformOrigin: pos, transform: `scale(${mix(z0, z1, t)}) translateX(${dx * t}px)`, filter: grade }} />
      </div>
    </Sequence>
  );
};
const Vignette: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: "absolute", inset: 0, opacity: o, background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(10,9,8,0) 40%, rgba(10,9,8,0.55) 80%, rgba(10,9,8,0.85) 100%)" }} />
);

/* ---------- type: a statement revealed word by word from under a line (masked rise) ---------- */
type Wd = { t: string; at: string; it?: boolean };
const Say: React.FC<{ g: number; words: Wd[]; y: number; size: number; out?: string; x?: number; align?: "center" | "left" | "right"; color?: string; ls?: number; w?: number; roll?: boolean }> = ({
  g, words, y, size, out, x, align = "center", color = C.ivory, ls = -0.01, w = 1920, roll }) => {
  const ro = roll && out ? k(g, out, 0.9) : 0;
  const o = out && !roll ? k(g, out, 0.6, DEPART) : 0;
  if (o >= 1 || ro >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: x === undefined ? 1920 : w, display: "flex", justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
      gap: size * 0.24, transform: `translate(${x ?? 0}px, ${y - o * 14}px)`, opacity: 1 - o, fontFamily: SERIF, fontWeight: 400, fontSize: size, lineHeight: 1.18, letterSpacing: `${ls}em`, color, whiteSpace: "nowrap" }}>
      {words.map((wd, i) => {
        const kk = k(g, wd.at, 0.9);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <span style={{ display: "inline-block", fontStyle: wd.it ? "italic" : "normal", transform: `translateY(${(1 - kk) * 105 - ro * 105}%)`, opacity: Math.min(1, kk * 2) }}>{wd.t}</span>
          </span>
        );
      })}
    </div>
  );
};
const Caps: React.FC<{ g: number; t: string; at: string; y: number; x?: number; size?: number; out?: string; color?: string; align?: "center" | "left" }> = ({ g, t, at, y, x, size = 22, out, color = C.ivory, align = "center" }) => {
  const a = k(g, at, 1.0), o = out ? k(g, out, 0.5, DEPART) : 0;
  if (a <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: x === undefined ? 1920 : undefined, textAlign: align, transform: `translate(${x ?? 0}px, ${y}px)`, opacity: a * (1 - o) * 0.9,
      fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: `${mix(0.7, 0.42, a)}em`, color, whiteSpace: "nowrap", textTransform: "uppercase" }}>{t}</div>
  );
};
/** The Web stripe: green, red, green, drawn across. */
const Web: React.FC<{ x: number; y: number; w: number; k: number; h?: number; o?: number; origin?: "left" | "center" }> = ({ x, y, w, k: kk, h = 7, o = 1, origin = "left" }) =>
  kk <= 0 ? null : (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, transform: `translate(${x}px, ${y}px) scaleX(${kk})`, transformOrigin: origin === "left" ? "0 50%" : "50% 50%", opacity: o, display: "flex", flexDirection: "column", gap: h * 0.45 }}>
      <div style={{ height: h, background: C.webGreen }} /><div style={{ height: h, background: C.webRed }} /><div style={{ height: h, background: C.webGreen }} />
    </div>
  );

/* ---------- 1–2 · seen by everyone → remembered by the few ---------- */
const Few: React.FC<{ g: number }> = ({ g }) => {
  if (g > f("since+0.3")) return null;
  const slit = k(g, "few", 0.9, MOVE);                       // the crowd narrows to a single beam
  const half = mix(50, 2.2, slit);
  const dancer = k(g, "few+0.45", 1.0);
  const out = k(g, "since-0.15", 0.5, DEPART);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Clip g={g} src="lobby-s.mp4" from="hook" to="few+1.0" trim={0.625} rate={1} z0={1.6} z1={1.72} pos="50% 96%" grade="grayscale(0.9) contrast(1.18) brightness(0.5)"
        clip={`inset(0 ${50 - half}% 0 ${50 - half}%)`} o={1 - clamp01((slit - 0.8) / 0.2) * 0.6} />
      <Clip g={g} src="dancer-s.mp4" from="few+0.3" to="since+0.3" trim={0.267} rate={1} z0={1.12} z1={1.2} pos="50% 30%" grade="grayscale(1) contrast(1.25) brightness(0.95)" o={dancer} />
      <Vignette />
      <Say g={g} y={390} size={150} out="few-0.2" words={[{ t: "Exclusivity", at: "w:exclusivity" }]} />
      <Say g={g} y={590} size={50} out="few-0.15" words={[{ t: "isn't", at: "w:isnt", it: true }, { t: "about", at: "w:about", it: true }, { t: "being", at: "w:being", it: true }, { t: "seen", at: "w:seen", it: true }, { t: "by", at: "w:by", it: true }, { t: "everyone.", at: "w:everyone", it: true }]} />
      <Say g={g} y={700} size={46} out="since-0.25" words={[{ t: "It's", at: "w:its" }, { t: "about", at: "w:about2" }, { t: "being", at: "w:being2" }]} />
      <Say g={g} y={762} size={104} out="since-0.2" words={[{ t: "remembered", at: "w:remembered", it: true }, { t: "by", at: "w:by2", it: true }, { t: "the", at: "w:the", it: true }, { t: "few.", at: "w:few", it: true }]} />
    </AbsoluteFill>
  );
};

/* ---------- 3 · since 1921 ---------- */
const Since: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("since-0.1") || g > f("w:craftsmanship+0.6")) return null;
  const out = k(g, "w:italian", 0.7, DEPART);
  const rule = k(g, "w:1921+0.3", 1.0, MOVE);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.04})` }}>
      <Caps g={g} t="Since" at="w:since" y={330} size={24} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", transform: "translateY(380px)", fontFamily: SERIF, fontWeight: 400, fontSize: 300, lineHeight: 1, color: C.ivory, letterSpacing: "0.02em" }}>
        {"1921".split("").map((d, i) => {
          const kk = k(g, off("w:1921", -0.15 + i * 0.09), 1.1);
          return <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: 30, marginBottom: -30 }}><span style={{ display: "inline-block", transform: `translateY(${(1 - kk) * 105}%)` }}>{d}</span></span>;
        })}
      </div>
      <div style={{ position: "absolute", left: 960 - 260, top: 728, width: 520, height: 1.5, background: C.ivory, opacity: 0.55, transform: `scaleX(${rule})` }} />
      <Caps g={g} t="Florence" at="w:1921+0.45" y={756} size={24} />
    </AbsoluteFill>
  );
};

/* ---------- 4 · Italian craftsmanship → individuality, prestige, style ---------- */
// each new picture arrives behind a vertical edge that sweeps across (a cut made as a move)
const sweep = (g: number, at: string) => { const p = k(g, at, 0.55, MOVE); return { p, clip: `inset(0 0 0 ${(1 - p) * 100}%)` }; };
const Craft: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("w:italian-0.2") || g > f("detail+0.8")) return null;
  const open = k(g, "w:italian-0.05", 1.1, MOVE);           // the stitched seam opens on the craft
  const s1 = sweep(g, "ind"), s2 = sweep(g, "pres"), s3 = sweep(g, "sty");
  const edge = (p: number) => (p > 0 && p < 1 ? <div style={{ position: "absolute", top: 0, left: 1920 * (1 - p) - 1, width: 2, height: 1080, background: C.ivory, opacity: 0.8 }} /> : null);
  return (
    <AbsoluteFill>
      <Clip g={g} src="stitch-s.mp4" from="w:italian-0.2" to="sty+0.6" trim={0.429} rate={1} z0={1.1} z1={1.22} pos="50% 50%" grade={WARM} clip={`inset(${(1 - open) * 50}% 0 ${(1 - open) * 50}% 0)`} />
      <Clip g={g} src="bookstore-s.mp4" from="ind" to="sty+0.6" trim={0.5} rate={1} z0={1.1} z1={1.16} pos="40% 40%" grade={WARM} clip={s1.clip} />
      <Clip g={g} src="leather-s.mp4" from="pres" to="sty+0.6" trim={0.833} rate={1} z0={1.2} z1={1.3} grade={RICH} clip={s2.clip} />
      <Clip g={g} src="mirrors-s.mp4" from="sty" to="detail+0.8" trim={0.25} rate={1} z0={1.12} z1={1.2} pos="50% 35%" grade={BW} clip={s3.clip} />
      <Vignette />
      {edge(s1.p)}{edge(s2.p)}{edge(s3.p)}
      <Caps g={g} t="Italian craftsmanship" at="w:craftsmanship" y={880} x={150} size={22} align="left" out="ind-0.1" />
      <Say g={g} y={420} size={140} out="w:prestige+0.05" roll words={[{ t: "Individuality", at: "w:individuality+0.05", it: true }]} />
      <Say g={g} y={420} size={140} out="w:style+0.05" roll words={[{ t: "Prestige", at: "w:prestige+0.05", it: true }]} />
      <Say g={g} y={420} size={140} out="detail-0.15" words={[{ t: "Style", at: "w:style+0.05", it: true }]} />
    </AbsoluteFill>
  );
};

/* ---------- 5–6 · the detail (a thread through the needle), the legacy (the Web stripe) ---------- */
const Detail: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("detail-0.1") || g > f("goods+0.8")) return null;
  const inn = k(g, "detail", 0.9, MOVE), thread = k(g, "w:intention", 1.2, MOVE);
  const s = sweep(g, "legacy");
  const web = k(g, "w:legacy", 1.4, MOVE);
  return (
    <AbsoluteFill>
      <Clip g={g} src="needle-s.mp4" from="detail" to="legacy+0.6" trim={0.8} rate={1} z0={1.15} z1={1.32} pos="38% 55%" grade="grayscale(1) sepia(0.2) contrast(1.25) brightness(0.8)" o={inn} />
      <Clip g={g} src="cut-s.mp4" from="legacy" to="goods+0.8" trim={0.667} rate={1} z0={1.12} z1={1.2} pos="45% 50%" grade={WARM} clip={s.clip} />
      <Vignette />
      {s.p > 0 && s.p < 1 && <div style={{ position: "absolute", top: 0, left: 1920 * (1 - s.p) - 1, width: 2, height: 1080, background: C.ivory, opacity: 0.8 }} />}
      <Say g={g} y={400} size={92} x={1060} w={760} align="left" out="legacy-0.32" words={[{ t: "Every", at: "w:every" }, { t: "detail", at: "w:detail" }]} />
      <Say g={g} y={510} size={92} x={1060} w={760} align="left" out="legacy-0.28" words={[{ t: "has", at: "w:has2", it: true }, { t: "intention.", at: "w:intention", it: true }]} />
      {/* the thread: a fine line drawn on "intention" */}
      <div style={{ position: "absolute", left: 1062, top: 640, width: 640, height: 1.5, background: C.ivory, transformOrigin: "0 50%", transform: `scaleX(${thread})`, opacity: 0.8 * (1 - k(g, "legacy-0.1", 0.4)) }} />
      <Say g={g} y={380} size={92} x={150} w={900} align="left" out="goods-0.15" words={[{ t: "Every", at: "w:every2" }, { t: "design", at: "w:design" }]} />
      <Say g={g} y={490} size={92} x={150} w={1100} align="left" out="goods-0.1" words={[{ t: "carries", at: "w:carries", it: true }, { t: "a", at: "w:a2", it: true }, { t: "legacy.", at: "w:legacy", it: true }]} />
      <Web x={0} y={872} w={1920} k={web} h={7} o={1 - k(g, "goods+0.2", 0.5, DEPART)} />
    </AbsoluteFill>
  );
};

/* ---------- 7–8 · from leather goods to fashion statements; more than something to wear ---------- */
const Goods: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("goods-0.1") || g > f("presence+0.8")) return null;
  const l = k(g, "w:crafted-0.1", 0.9, MOVE), r = k(g, "w:distinctive-0.1", 0.9, MOVE);
  const close = k(g, "wear", 0.9, MOVE);                     // the two halves close into one portrait
  const lw = mix(960, 0, close), rx = mix(960, 960 - 300, close), rw = mix(960, 600, close);
  return (
    <AbsoluteFill>
      <Clip g={g} src="stitch-s.mp4" from="goods" to="wear+1.0" trim={5.714} rate={1} z0={1.25} z1={1.35} pos="50% 50%" grade={WARM} clip={`inset(0 ${1920 - lw}px 0 0)`} o={l} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(${BAR}px ${1920 - rx - rw * r}px ${BAR}px ${rx}px)` }}>
        <Clip g={g} src="coat-s.mp4" from="w:distinctive-0.1" to="presence+0.8" trim={0.75} rate={1} z0={1} z1={1.06} pos="50% 30%" grade={WARM}
          style={{ left: rx, width: rw, height: 1080 }} />
      </div>
      <Vignette o={0.8} />
      {close < 1 && <div style={{ position: "absolute", left: 959, top: BAR, width: 2, height: 1080 - 2 * BAR, background: C.ivory, opacity: 0.7 * r * (1 - close) }} />}
      <Caps g={g} t="Leather goods" at="w:leather" y={880} x={150} size={22} align="left" out="wear" />
      <Caps g={g} t="Ready-to-wear" at="w:fashion" y={880} x={1100} size={22} align="left" out="wear" />
      <Say g={g} y={430} size={64} x={150} w={460} align="left" out="presence-0.1" words={[{ t: "More", at: "w:more", it: true }, { t: "than", at: "w:than", it: true }]} />
      <Say g={g} y={510} size={64} x={150} w={460} align="left" out="presence-0.05" words={[{ t: "something", at: "w:something", it: true }]} />
      <Say g={g} y={590} size={64} x={150} w={460} align="left" out="presence" words={[{ t: "to", at: "w:to2", it: true }, { t: "wear.", at: "w:wear", it: true }]} />
    </AbsoluteFill>
  );
};

/* ---------- 9 · a presence that cannot be replicated: copies appear, and fall away ---------- */
const Presence: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("presence-0.1") || g > f("crowd+0.8")) return null;
  const inn = k(g, "presence", 0.9, MOVE);
  const copies = k(g, "w:cannot-0.1", 0.6, MOVE), fall = k(g, "w:replicated+0.15", 0.8, MOVE);
  const out = k(g, "crowd", 0.6, DEPART);
  const cells = [-1, 0, 1].flatMap((r) => [-1, 0, 1].map((c) => [r, c]));
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {cells.map(([r, c], i) => {
        const centre = r === 0 && c === 0;
        const s = mix(1, 0.333, copies) * (centre ? mix(1, 3, fall) : 1);
        const x = c * 640 * copies * (centre ? 1 - fall : 1), y = r * 360 * copies * (centre ? 1 - fall : 1);
        const o = centre ? inn : copies * (1 - clamp01(fall * 1.6 - i * 0.04));
        if (o <= 0.01) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${x}px, ${y}px) scale(${centre ? s : mix(1, 0.333, copies)})`, opacity: o,
            outline: copies > 0.05 && !centre ? `2px solid rgba(10,9,8,${copies})` : undefined }}>
            <Clip g={g} src="mirrors-s.mp4" from="presence-0.1" to="crowd+0.8" trim={6.875} rate={1} z0={1.1} z1={1.16} pos="50% 35%" grade={BW} />
          </div>
        );
      })}
      <Vignette />
      <Say g={g} y={800} size={56} out="crowd-0.1" words={[{ t: "A", at: "w:a3", it: true }, { t: "presence", at: "w:presence", it: true }, { t: "that", at: "w:that", it: true }, { t: "cannot", at: "w:cannot", it: true }, { t: "be", at: "w:be", it: true }, { t: "replicated.", at: "w:replicated", it: true }]} />
    </AbsoluteFill>
  );
};

/* ---------- 10–11 · not the crowd: it parts, one stays; its light becomes a line ---------- */
const Apart: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("crowd-0.1") || g > f("brand+0.6")) return null;
  const inn = k(g, "crowd", 0.8);
  const part = k(g, "w:stand-0.05", 1.1, MOVE);             // the crowd parts around the one
  const thin = k(g, "pause", 0.8, MOVE), turn = k(g, "pause+0.7", 0.7, MOVE);
  const cw = 360;                                            // the one: a centre strip
  const side = (left: boolean) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: left ? `inset(0 ${960 + cw / 2}px 0 0)` : `inset(0 0 0 ${960 + cw / 2}px)`,
      transform: `translateX(${(left ? -1 : 1) * part * 260}px)`, opacity: inn * (1 - part * 0.75) * (1 - thin) }}>
      <Clip g={g} src="street-s.mp4" from="crowd-0.1" to="pause+1.0" trim={0.714} rate={1} z0={1.1} z1={1.16} pos="50% 50%" grade={COLD} />
    </div>
  );
  const w = mix(mix(cw, cw * 1.12, part), 2, thin);
  return (
    <AbsoluteFill>
      {side(true)}{side(false)}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(${mix(0, BAR, part)}px ${960 - w / 2}px ${mix(0, BAR, part)}px ${960 - w / 2}px)`,
        transform: `scale(${1 + part * 0.08})`, opacity: inn * (1 - turn) }}>
        <Clip g={g} src="street-s.mp4" from="crowd-0.1" to="pause+1.0" trim={0.714} rate={1} z0={1.1} z1={1.16} pos="50% 50%" grade={`grayscale(${mix(0.9, 0.15, part)}) contrast(1.15) brightness(${mix(0.62, 0.95, part)})`} />
        <div style={{ position: "absolute", inset: 0, background: C.ivory, opacity: thin }} />
      </div>
      <Say g={g} y={300} size={56} out="w:stand-0.1" words={[{ t: "Not", at: "w:not", it: true }, { t: "designed", at: "w:designed", it: true }, { t: "to", at: "w:to3", it: true }, { t: "follow", at: "w:follow", it: true }, { t: "the", at: "w:the2", it: true }, { t: "crowd,", at: "w:crowd", it: true }]} />
      <Say g={g} y={760} size={74} out="pause" words={[{ t: "but", at: "w:but", it: true }, { t: "to", at: "w:to4", it: true }, { t: "stand", at: "w:stand", it: true }, { t: "apart", at: "w:apart", it: true }, { t: "from", at: "w:from2", it: true }, { t: "it.", at: "w:it2", it: true }]} />
      {/* the line of light turns and becomes the rule under the name */}
      {thin > 0.95 && <div style={{ position: "absolute", left: 960 - mix(1, 340, turn), top: mix(BAR, 640, turn), width: mix(2, 680, turn), height: mix(1080 - 2 * BAR, 1.5, turn), background: C.ivory, opacity: 1 - k(g, "brand+0.2", 0.4) }} />}
    </AbsoluteFill>
  );
};

/* ---------- 12 · Gucci. Beyond fashion. A statement of distinction. ---------- */
const Brand: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("brand-0.2")) return null;
  const wm = k(g, "w:gucci3-0.05", 1.6), web = k(g, "brand+0.2", 1.4, MOVE);
  const W = 900, H = (W * 150) / 936.15;
  const push = 1 + 0.045 * clamp01((g - f("brand")) / (f("end") - f("brand")));
  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 48%" }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 420 - H / 2, width: W, height: H, overflow: "hidden" }}>
        <Img src={staticFile("img/gucci-wordmark-ivory.svg")} style={{ width: W, height: H, transform: `translateY(${(1 - wm) * 100}%)`, opacity: Math.min(1, wm * 1.5) }} />
      </div>
      <Web x={960 - 340} y={548} w={680} k={web} h={4} origin="center" />
      <Say g={g} y={600} size={60} words={[{ t: "Beyond", at: "w:beyond", it: true }, { t: "fashion.", at: "w:fashion2", it: true }]} />
      <Say g={g} y={690} size={44} color="#CFC6B8" words={[{ t: "A", at: "w:a4" }, { t: "statement", at: "w:statement" }, { t: "of", at: "w:of2" }, { t: "distinction.", at: "w:distinction" }]} />
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const cam = breathe(g, "brand", 0.03);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ transform: `translate(${cam.x * 0.5}px, ${cam.y * 0.5}px) scale(${1 + (cam.s - 1) * 0.6}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%" }}>
        <Few g={g} />
        <Since g={g} />
        <Craft g={g} />
        <Detail g={g} />
        <Goods g={g} />
        <Presence g={g} />
        <Apart g={g} />
        <Brand g={g} />
      </AbsoluteFill>
      {/* the letterbox */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: BAR, background: C.black }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: BAR, background: C.black }} />
      <Img src={staticFile("img/grain.png")} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
