// Shared pieces of the Málaga Hideaway film: words that ease in, colour fields that grow out of an object, media (a
// clip or a photo), the logo, small UI parts (chips, rows, checks, switches) and the home card.
import React from "react";
import { Img, Loop, OffthreadVideo, Sequence, staticFile } from "remotion";
import { ARRIVE, C, F, MOVE, SHADOW, SHADOW_SOFT, clamp01, expoOut, lerp, mix, pr, rgba } from "./lib";
import { tw } from "./parts";
import { Icon } from "./icons";

/** The footage and photos of the film (public/footage, public/img/photos). */
export const MEDIA = {
  home: "img/photos/happy-house-el-palo-facade-orange.jpg",          // the thread object: a home the company manages (El Palo)
  terrace: "img/photos/happy-house-el-palo-rooftop-terrace-palms.jpg",
  interior: "img/photos/happy-house-el-palo-living-kitchen.jpg",
  lounge: "img/photos/rooftop-beachhouse-pedregalejo-rooftop-lounge-view.jpg",
  towels: "img/photos/casa-malaga-beach-bedroom-towels.jpg",
  pool: "img/photos/la-perla-escondida-pool-daybed-view.jpg",
  // footage: Mixkit Stock Video Free License clips, converted to 30 fps (public/footage/CREDITS.md)
  malaga: "footage/malaga-street-2595.mp4",
  arrival: "footage/arrival-front-door-8729.mp4",
  cleaning: "footage/cleaning-living-room-43373.mp4",
  repair: "footage/maintenance-painting-2296.mp4",
  ready: "footage/ready-room-terrace-4029.mp4",
  keys: "footage/keyholding-white-room-4046.mp4",
  check: "footage/check-room-pan-4198.mp4",
  owner: "footage/owner-at-home-660.mp4",
  freedom: "footage/freedom-pool-3175.mp4",
};

/** A clip or a photo, covering its box. A clip starts `skip` seconds in at film frame `from` and loops every `loop` frames. */
export const Media: React.FC<{ src: string; style?: React.CSSProperties; loop?: number; pos?: string; from?: number; skip?: number }> =
  ({ src, style, loop = 300, pos = "50% 50%", from = 0, skip = 0 }) =>
    src.endsWith(".mp4") ? (
      <Sequence from={from} layout="none">
        <Loop durationInFrames={loop} layout="none">
          <OffthreadVideo src={staticFile(src)} muted trimBefore={Math.round(skip * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, ...style }} />
        </Loop>
      </Sequence>
    ) : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block", ...style }} />;

/** Words that ease in: each rises 26 px out of a light blur and fades on over 10 f (no pops). */
export const Words: React.FC<{ g: number; words: { t: string; f: number; color?: string }[]; size: number; x: number; y: number;
  color?: string; family?: string; weight?: number; align?: "center" | "left"; opacity?: number }> =
  ({ g, words, size, x, y, color = C.ink, family = F.display, weight = 400, align = "center", opacity = 1 }) => {
    const sp = tw(" ", size, weight, family);
    const ws = words.map((w) => tw(w.t, size, weight, family));
    const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    let cx = align === "center" ? x - total / 2 : x;
    return (
      <>
        {words.map((w, i) => {
          const left = cx; cx += ws[i] + sp;
          if (g < w.f) return null;
          const k = clamp01((g - w.f) / 14), e = ARRIVE(k);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${left}px, ${y - size * 0.64 + 26 * (1 - e)}px, 0)`,
              opacity: opacity * clamp01((g - w.f) / 9), filter: k < 1 ? `blur(${6 * (1 - e)}px)` : undefined, fontFamily: family, fontWeight: weight,
              fontSize: size, color: w.color ?? color, whiteSpace: "pre", lineHeight: 1.25 }}>{w.t}</div>
          );
        })}
      </>
    );
  };

/** A colour field that grows out of a point (an object), expo-out over n frames. */
export const Field: React.FC<{ g: number; a: number; n: number; color: string; x: number; y: number; r1?: number }> = ({ g, a, n, color, x, y, r1 = 2300 }) => {
  if (g < a) return null;
  const r = r1 * expoOut(n, 0.86)(clamp01((g - a) / n));
  return <div style={{ position: "absolute", inset: 0, background: color, clipPath: `circle(${r}px at ${x}px ${y}px)` }} />;
};

/** The logo: the house mark, and the word mark beside it (`word` 0..1 reveals it). White or blue. */
export const Logo: React.FC<{ h: number; white?: boolean; word?: number; style?: React.CSSProperties }> = ({ h, white, word = 1, style }) => {
  const mw = h * 996 / 924, ww = h * 0.84 * 2430 / 810;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: h * 0.16 * word, ...style }}>
      <Img src={staticFile(`img/malaga-hideaway-mark-${white ? "white" : "blue"}.png`)} style={{ width: mw, height: h, display: "block" }} />
      <div style={{ width: ww * word, overflow: "hidden", height: h * 0.84 }}>
        <Img src={staticFile(`img/malaga-hideaway-wordmark-${white ? "white" : "blue"}.png`)}
          style={{ width: ww, height: h * 0.84, display: "block", opacity: clamp01(word * 1.6 - 0.3), transform: `translateX(${-30 * (1 - word)}px)` }} />
      </div>
    </div>
  );
};

/** A small round check that fills when `k` goes 0→1. */
export const Check: React.FC<{ k: number; size?: number; color?: string }> = ({ k, size = 40, color = C.green }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, border: `2.5px solid ${mix(C.line, color, k)}`, background: k > 0 ? rgba(color, clamp01(k)) : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
    <Icon name="check" size={size * 0.62} color="#fff" stroke={3} style={{ opacity: clamp01(k * 1.5 - 0.3), transform: `scale(${0.6 + 0.4 * ARRIVE(k)})` }} />
  </div>
);

/** A switch: `on` 0..1. */
export const Switch: React.FC<{ on: number; w?: number }> = ({ on, w = 74 }) => {
  const h = w * 0.56;
  return (
    <div style={{ width: w, height: h, borderRadius: h / 2, background: mix("#D5D9DE", C.blue, on), position: "relative", flex: "none" }}>
      <div style={{ position: "absolute", top: h * 0.1, left: lerp(h * 0.1, w - h * 0.9, MOVE(clamp01(on))), width: h * 0.8, height: h * 0.8, borderRadius: h, background: "#fff",
        boxShadow: "0 2px 6px rgba(17,35,55,0.25)" }} />
    </div>
  );
};

/** A status chip: icon in a round tint, a label. */
export const Chip: React.FC<{ icon: string; text: React.ReactNode; tone?: "blue" | "green" | "terra" | "red" | "navy"; size?: number; style?: React.CSSProperties }> =
  ({ icon, text, tone = "blue", size = 30, style }) => {
    const ink = { blue: C.blueDeep, green: C.green, terra: C.terraDeep, red: C.red, navy: C.navy }[tone];
    const tint = { blue: C.bluePale, green: C.greenSoft, terra: C.terraSoft, red: C.redSoft, navy: C.paleCool }[tone];
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, height: size * 2.1, padding: `0 ${size * 0.8}px 0 ${size * 0.32}px`, borderRadius: size * 1.05,
        background: C.white, boxShadow: SHADOW_SOFT, fontFamily: F.ui, fontWeight: 600, fontSize: size, color: C.ink, whiteSpace: "nowrap", ...style }}>
        <div style={{ width: size * 1.5, height: size * 1.5, borderRadius: size, background: tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={size * 0.95} color={ink} stroke={2.3} /></div>
        {text}
      </div>
    );
  };

/** The home card: a photo of the home, rounded, with a label and a status line under it. */
export const HomeCard: React.FC<{ w: number; h: number; src?: string; label?: string; status?: React.ReactNode; children?: React.ReactNode; style?: React.CSSProperties }> =
  ({ w, h, src = MEDIA.home, label = "Your home · Málaga", status, children, style }) => (
    <div style={{ width: w, height: h, borderRadius: 38, overflow: "hidden", background: C.white, boxShadow: SHADOW, position: "relative", ...style }}>
      <div style={{ position: "absolute", inset: 0 }}><Media src={src} /></div>
      {label && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: `linear-gradient(0deg, ${rgba(C.navy, 0.55)}, transparent)` }} />}
      {label && <div style={{ position: "absolute", left: 30, bottom: 28, display: "flex", alignItems: "center", gap: 14, fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: "#fff" }}>
        <Icon name="home" size={36} color="#fff" stroke={2.3} />{label}</div>}
      {status}
      {children}
    </div>
  );

/** A white card. */
export const Card: React.FC<{ w: number; h?: number; pad?: number; r?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, pad = 36, r = 30, style, children }) => (
  <div style={{ width: w, height: h, padding: pad, borderRadius: r, background: C.white, boxShadow: SHADOW, boxSizing: "border-box", position: "relative", ...style }}>{children}</div>
);

/** A card header: an icon tile and a title. */
export const Head: React.FC<{ icon: string; title: string; tone?: string; tint?: string; size?: number; right?: React.ReactNode }> = ({ icon, title, tone = C.blueDeep, tint = C.bluePale, size = 34, right }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ width: size * 1.75, height: size * 1.75, borderRadius: size * 0.5, background: tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={size * 1.05} color={tone} stroke={2.2} /></div>
    <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: size, color: C.ink }}>{title}</div>
    {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
  </div>
);

/** Rise-in helper: opacity and a small rise out of a blur, `k` 0..1. */
export const rise = (k: number, d = 30): React.CSSProperties => ({
  opacity: clamp01(k * 1.6), transform: `translateY(${d * (1 - ARRIVE(k))}px)`, filter: k < 1 ? `blur(${5 * (1 - ARRIVE(k))}px)` : undefined,
});

/** Placed by centre, rising in with `k` (position and rise kept on separate boxes so neither overrides the other). */
export const Place: React.FC<{ x: number; y: number; k: number; d?: number; children: React.ReactNode }> = ({ x, y, k, d = 30, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)` }}><div style={rise(k, d)}>{children}</div></div>
);

export { pr, SHADOW, SHADOW_SOFT };
