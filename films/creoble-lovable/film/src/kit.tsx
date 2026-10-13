// The film's kit: the 3D cursor (sprites rendered from Karl's Cursor.glb), grain, soft glows, words that blur in where
// they will stand, typed text with a caret, the Creoble mark and word mark, buttons, switches and windows.
import React from "react";
import { Img, staticFile } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { C, F, GRAD, clamp01, expoOut, lerp, rgba } from "./lib";
import { MARK_C, MARK_HOLE } from "./mark";
import { Icon } from "./icons";
import tipsJson from "../public/img/cursor/tips.json";

export { Icon };
const tips = tipsJson as unknown as { w: number; h: number; tips: Record<string, [number, number]> };

const cache: Record<string, number> = {};
/** Text width in px. */
export const tw = (text: string, size: number, weight = 500, family: string = F.serif, italic = false) => {
  const key = `${text}|${size}|${weight}|${family}|${italic}`;
  if (!(key in cache)) cache[key] = measureText({ text, fontFamily: family, fontSize: size, fontWeight: String(weight) }).width;
  return cache[key];
};

/** The 3D hand cursor. (x, y) is the fingertip; h the sprite's height in px; press 0..1; lean from the move's speed. */
export const Cursor: React.FC<{ x: number; y: number; h?: number; press?: number; vx?: number; opacity?: number }> = ({ x, y, h = 130, press = 0, vx = 0, opacity = 1 }) => {
  const li = Math.round(clamp01((vx / 26 + 1) / 2) * 4), pi = Math.round(clamp01(press) * 5);
  const key = `c_${li}_${pi}`, [tx, ty] = tips.tips[key], s = h / tips.h;
  return (
    <Img src={staticFile(`img/cursor/${key}.png`)} style={{ position: "absolute", left: 0, top: 0, width: tips.w * s, height: tips.h * s, opacity,
      transform: `translate3d(${x - tx * s}px, ${y - ty * s}px, 0)`, filter: `drop-shadow(0 ${h * 0.06}px ${h * 0.07}px rgba(0,0,0,0.28))` }} />
  );
};

/** Film grain over a picture (the reference is grainy wherever it glows). */
export const Grain: React.FC<{ opacity?: number; seed?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ opacity = 0.16, seed = 0, blend = "overlay" }) => (
  <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${staticFile("img/grain.png")})`, backgroundSize: "512px 512px",
    backgroundPosition: `${(seed * 173) % 512}px ${(seed * 97) % 512}px`, opacity, mixBlendMode: blend, pointerEvents: "none" }} />
);

/** A soft glow: an ellipse of colour, blurred. */
export const Glow: React.FC<{ x: number; y: number; w: number; h?: number; color: string; blur?: number; opacity?: number; rot?: number }> =
  ({ x, y, w, h, color, blur = 120, opacity = 1, rot = 0 }) => {
    const hh = h ?? w;
    return <div style={{ position: "absolute", left: x - w / 2, top: y - hh / 2, width: w, height: hh, borderRadius: "50%", background: color, filter: `blur(${blur}px)`, opacity, transform: `rotate(${rot}deg)` }} />;
  };

export type Word = { t: string; f: number; color?: string; italic?: boolean; grad?: string; icon?: React.ReactNode; iconW?: number };
/** A line of words laid out where the whole line will stand; each word blurs in and settles over `n` frames. */
export const Words: React.FC<{ g: number; words: Word[]; size: number; x: number; y: number; color?: string; family?: string; weight?: number;
  align?: "center" | "left"; n?: number; rise?: number; blur?: number; grad?: string; opacity?: number; spacing?: number; shadow?: string; gap?: number }> =
  ({ g, words, size, x, y, color = C.ink, family = F.serif, weight = 500, align = "center", n = 9, rise = 0.16, blur = 14, grad, opacity = 1, spacing = -0.02, shadow, gap }) => {
    const sp = gap ?? tw(" ", size, weight, family) * 1.0;
    const ws = words.map((w) => w.icon ? (w.iconW ?? size) : tw(w.t, size, weight, family, w.italic) * (1 + spacing * 0) + spacing * size * w.t.length);
    const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    let cx = align === "center" ? x - total / 2 : x;
    const x0 = cx;
    return (
      <>
        {words.map((w, i) => {
          const left = cx; cx += ws[i] + sp;
          if (g < w.f) return null;
          const k = clamp01((g - w.f) / n), e = expoOut(n, 0.78)(k);
          const fill = w.grad ?? grad;
          const st: React.CSSProperties = {
            position: "absolute", left: 0, top: 0, transform: `translate3d(${left}px, ${y - size * 0.62 + rise * size * (1 - e)}px, 0)`,
            opacity: opacity * clamp01((g - w.f) / (n * 0.6)), filter: k < 1 ? `blur(${blur * (1 - e)}px)` : undefined,
            fontFamily: family, fontWeight: weight, fontSize: size, fontStyle: w.italic ? "italic" : "normal", letterSpacing: spacing * size,
            color: w.color ?? color, whiteSpace: "pre", lineHeight: 1.24, textShadow: shadow,
          };
          if (fill) Object.assign(st, { backgroundImage: fill, backgroundSize: `${total}px 100%`, backgroundPosition: `${x0 - left}px 0`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });
          return <div key={i} style={st}>{w.icon ?? w.t}</div>;
        })}
      </>
    );
  };

/** Typed text: the first `n` characters of `text`, typing from frame a at `cps` characters a second, and a caret. */
export const typed = (g: number, a: number, text: string, cps = 24) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor((g - a) * cps / 30))));
export const Caret: React.FC<{ g: number; h: number; color?: string; w?: number; on?: boolean }> = ({ g, h, color = C.ink, w = 3, on = true }) =>
  <span style={{ display: "inline-block", width: w, height: h, background: color, marginLeft: 3, verticalAlign: "middle", opacity: on && Math.floor(g / 9) % 2 === 0 ? 1 : on ? 0.15 : 0, borderRadius: 2 }} />;

/** The Creoble mark: the C with its dot (creoble.dk's icon), in a colour or a gradient, on a tile or bare. */
export const Mark: React.FC<{ size: number; color?: string; grad?: [string, string, string?]; tile?: string; id?: string; style?: React.CSSProperties }> =
  ({ size, color = C.cream, grad, tile, id = "m", style }) => (
    <svg width={size} height={size} viewBox={tile ? "0 0 1080 1080" : "175 180 720 720"} style={{ display: "block", ...style }}>
      <defs>
        <mask id={`${id}-k`}><rect width="1080" height="1080" fill="black" /><path d={MARK_C} fill="white" /><path d={MARK_HOLE} fill="black" /></mask>
        {grad && <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={grad[0]} /><stop offset="0.55" stopColor={grad[1]} /><stop offset="1" stopColor={grad[2] ?? grad[1]} /></linearGradient>}
      </defs>
      {tile && <rect width="1080" height="1080" rx="240" fill={tile} />}
      <rect width="1080" height="1080" fill={grad ? `url(#${id}-g)` : color} mask={`url(#${id}-k)`} />
    </svg>
  );

/** The word mark: "Creoble" in Fraunces with the sage full stop. `reveal` 0..1 fades the letters on from the left. */
export const Wordmark: React.FC<{ size: number; color?: string; dot?: string; reveal?: number; wave?: number; g?: number }> = ({ size, color = C.ink, dot = C.sage, reveal = 1, wave = 0, g = 0 }) => {
  const letters = "Creoble".split("");
  return (
    <span style={{ fontFamily: F.serif, fontWeight: 500, fontSize: size, color, letterSpacing: -size * 0.015, lineHeight: 1, whiteSpace: "pre", display: "inline-flex" }}>
      {letters.map((l, i) => {
        const r = clamp01(reveal * 9 - i * 1.15);
        const wy = wave * Math.sin(g * 0.32 - i * 0.9) * size * 0.16, ws = 1 + wave * 0.12 * Math.sin(g * 0.28 - i * 0.9 + 1);
        return <span key={i} style={{ display: "inline-block", opacity: r, filter: r < 1 ? `blur(${(1 - r) * 10}px)` : undefined, transform: `translateY(${wy}px) scale(${ws})` }}>{l}</span>;
      })}
      <span style={{ color: dot, opacity: clamp01(reveal * 9 - 7.5) }}>.</span>
    </span>
  );
};

/** A button. */
export const Btn: React.FC<{ label: React.ReactNode; size?: number; tone?: "sage" | "grey" | "ink" | "rose" | "ghost" | "forest"; icon?: string; press?: number; style?: React.CSSProperties; glow?: number }> =
  ({ label, size = 26, tone = "sage", icon, press = 0, style, glow = 0 }) => {
    const bg = { sage: C.sage, grey: "#EEEDE8", ink: C.ink, rose: C.rose, ghost: "transparent", forest: C.forest }[tone];
    const fg = tone === "grey" || tone === "ghost" ? C.ink : "#fff";
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, height: size * 2.15, padding: `0 ${size * 0.95}px`, borderRadius: size * 0.55, background: bg,
        color: fg, fontFamily: F.ui, fontWeight: 600, fontSize: size, whiteSpace: "nowrap", transform: `scale(${1 - 0.05 * press})`, border: tone === "ghost" ? `1.5px solid ${C.line}` : undefined,
        boxShadow: glow ? `0 0 ${40 * glow}px ${rgba(C.gSage, 0.8 * glow)}` : tone === "grey" ? "inset 0 -1px 0 rgba(0,0,0,0.06)" : "0 6px 16px -8px rgba(0,0,0,0.35)", ...style }}>
        {icon && <Icon name={icon} size={size * 1.05} color={fg} stroke={2.2} />}{label}
      </div>
    );
  };

/** A switch: on 0..1. */
export const Switch: React.FC<{ on: number; w?: number; color?: string }> = ({ on, w = 74, color = C.sage }) => {
  const h = w * 0.56;
  return (
    <div style={{ width: w, height: h, borderRadius: h / 2, background: on > 0 ? `color-mix(in srgb, ${color} ${on * 100}%, #D6D4CE)` : "#D6D4CE", position: "relative", flex: "none" }}>
      <div style={{ position: "absolute", top: h * 0.1, left: lerp(h * 0.1, w - h * 0.9, clamp01(on)), width: h * 0.8, height: h * 0.8, borderRadius: h, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }} />
    </div>
  );
};

/** A round check that fills with k. */
export const Check: React.FC<{ k: number; size?: number; color?: string }> = ({ k, size = 34, color = C.sage }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: k > 0 ? `color-mix(in srgb, ${color} ${clamp01(k) * 100}%, transparent)` : "transparent", border: `2px solid ${k > 0.5 ? color : C.line}`,
    display: "flex", alignItems: "center", justifyContent: "center", flex: "none", boxSizing: "border-box" }}>
    <Icon name="check" size={size * 0.62} color="#fff" stroke={3} style={{ opacity: clamp01(k * 1.6 - 0.4), transform: `scale(${0.6 + 0.4 * clamp01(k)})` }} />
  </div>
);

/** Absolute box placed by its centre. */
export const At: React.FC<{ x: number; y: number; s?: number; o?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, s = 1, o = 1, children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${s})`, opacity: o, ...style }}>{children}</div>
);

/** The gradient used on type, as a CSS fill for a block of text. */
export const gradText = (grad = GRAD): React.CSSProperties => ({ backgroundImage: grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });

/** A centred line that grows word by word: the words already there slide to make room (7 f), the new one blurs in. */
export const Flow: React.FC<{ g: number; words: Word[]; size: number; x?: number; y: number; color?: string; family?: string; weight?: number; grad?: string; n?: number; shadow?: string }> =
  ({ g, words, size, x = 960, y, color = C.ink, family = F.serif, weight = 500, grad, n = 9, shadow }) => {
    const vis = words.filter((w) => g >= w.f);
    if (!vis.length) return null;
    const sp = tw(" ", size, weight, family);
    const ws = words.map((w) => w.icon ? (w.iconW ?? size) : tw(w.t, size, weight, family, w.italic));
    const lay = (m: number) => { const tot = ws.slice(0, m).reduce((a, b) => a + b, 0) + sp * (m - 1); let cx = x - tot / 2; return ws.slice(0, m).map((w) => { const l = cx; cx += w + sp; return l; }); };
    const m = vis.length, cur = lay(m), prev = m > 1 ? [...lay(m - 1), 0] : cur;
    if (m > 1) prev[m - 1] = prev[m - 2] + ws[m - 2] + sp;   // the new word rides in at the end of the sliding line
    const e = expoOut(8, 0.75)(clamp01((g - words[m - 1].f) / 8));
    return (
      <>
        {vis.map((w, i) => {
          const left = lerp(prev[i], cur[i], e);
          const k = clamp01((g - w.f) / n), ee = expoOut(n, 0.78)(k);
          const fill = w.grad ?? grad;
          const st: React.CSSProperties = { position: "absolute", left: 0, top: 0, transform: `translate3d(${left}px, ${y - size * 0.62 + 0.16 * size * (1 - ee)}px, 0)`,
            opacity: clamp01((g - w.f) / (n * 0.6)), filter: k < 1 ? `blur(${14 * (1 - ee)}px)` : undefined, fontFamily: family, fontWeight: weight, fontSize: size,
            fontStyle: w.italic ? "italic" : "normal", color: w.color ?? color, whiteSpace: "pre", lineHeight: 1.24, textShadow: shadow };
          if (fill) Object.assign(st, { backgroundImage: fill, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });
          return <div key={i} style={st}>{w.icon ?? w.t}</div>;
        })}
      </>
    );
  };

/** A whole line laid out once and placed by its centre, for lines that move as one. */
export const Line: React.FC<{ text: string; size: number; color?: string; family?: string; weight?: number; italic?: boolean; grad?: string; style?: React.CSSProperties }> =
  ({ text, size, color = C.ink, family = F.serif, weight = 500, italic, grad, style }) => (
    <div style={{ fontFamily: family, fontWeight: weight, fontSize: size, color, fontStyle: italic ? "italic" : "normal", whiteSpace: "pre", lineHeight: 1.2, letterSpacing: -size * 0.015,
      ...(grad ? { backgroundImage: grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}), ...style }}>{text}</div>
  );
