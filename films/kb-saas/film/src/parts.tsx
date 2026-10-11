// The film's shared pieces: lines of type that pop on word by word, the prompt bar, the K.B tile that becomes the
// site's nav pill, task pills, and the sign-off. Everything is driven by frame numbers passed in, so the Story keeps
// the timing.
import React from "react";
import { measureText } from "@remotion/layout-utils";
import { C, F, SHADOW, SHADOW_SOFT, clamp01, expoOut, lerp, mix, rgba } from "./lib";
import { Cursor, KBTile, Typed } from "./ui";
import { Icon } from "./icons";

const cache: Record<string, number> = {};
/** Text width in px (Montserrat unless said otherwise). */
export const tw = (text: string, size: number, weight = 600, family: string = F.ui) => {
  const key = `${text}|${size}|${weight}|${family}`;
  if (!(key in cache)) cache[key] = measureText({ text, fontFamily: family, fontSize: size, fontWeight: String(weight) }).width;
  return cache[key];
};

/** A line of type laid out at its final centred width; each word pops on whole at its frame (no fade, no rise, no
 *  blur: technique 21), with a pale cyan wake band behind the newest word that clears in 12 f (24, as a shape: the
 *  brand never puts cyan text on a light ground). Optional single glide: the line starts `glide` px off and settles on
 *  one exponential from `glideFrom`. */
export const WordLine: React.FC<{
  words: { t: string; f: number; color?: string; weight?: number }[]; g: number; size: number; x: number; y: number;
  weight?: number; color?: string; glide?: number; glideFrom?: number; glideFrames?: number; wake?: boolean; align?: "center" | "left";
  opacity?: number;
}> = ({ words, g, size, x, y, weight = 700, color = C.ink, glide = 0, glideFrom = 0, glideFrames = 21, wake = true, align = "center", opacity = 1 }) => {
  const space = tw(" ", size, weight);
  const widths = words.map((w) => tw(w.t, size, w.weight ?? weight));
  const total = widths.reduce((a, b) => a + b, 0) + space * (words.length - 1);
  const gp = glide ? glide * (1 - expoOut(glideFrames, 0.8)(clamp01((g - glideFrom) / glideFrames))) : 0;
  let cx = (align === "center" ? x - total / 2 : x) + gp;
  return (
    <>
      {words.map((w, i) => {
        const left = cx; cx += widths[i] + space;
        if (g < w.f) return null;
        const age = g - w.f;
        const band = wake ? clamp01(1 - age / 12) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${left}px, ${y - size * 0.62}px, 0)`, opacity }}>
            {band > 0 && <div style={{ position: "absolute", left: -size * 0.06, top: size * 0.42, width: widths[i] + size * 0.12, height: size * 0.62,
              borderRadius: size * 0.14, background: rgba(C.cyan, 0.22 * band) }} />}
            <span style={{ position: "relative", fontFamily: F.ui, fontWeight: w.weight ?? weight, fontSize: size, color: w.color ?? color, whiteSpace: "pre", lineHeight: 1.24 }}>{w.t}</span>
          </div>
        );
      })}
    </>
  );
};

/** A task pill: an empty (or checked) box and the task's words. `ink` 0..1 from grey texture to readable ink. */
export const TaskPill: React.FC<{ label: string; size?: number; ink?: number; check?: number; w?: number; icons?: [string, string] }> =
  ({ label, size = 46, ink = 1, check = 0, w, icons }) => {
    const h = size * 2.1;
    const width = w ?? tw(label, size, 600) + size * 3.2 + (icons ? size * 3.6 : 0);
    const box = size * 0.86;
    return (
      <div style={{ width, height: h, borderRadius: h / 2, background: C.white, boxShadow: SHADOW_SOFT, display: "flex", alignItems: "center",
        gap: size * 0.5, paddingLeft: size * 0.7, boxSizing: "border-box", border: `1.5px solid ${rgba(C.navy, 0.06)}` }}>
        <div style={{ width: box, height: box, borderRadius: box * 0.3, flex: "none", border: `${size * 0.06}px solid ${mix("#C9CFD8", C.navy, check)}`,
          background: check > 0 ? rgba(C.navy, clamp01(check)) : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
          {check > 0.5 && <Icon name="check" size={box * 0.8} color="#fff" stroke={3} />}
        </div>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: size, color: mix("#A9B0B9", C.ink, ink), whiteSpace: "nowrap" }}>{label}</span>
        {icons && (
          <div style={{ marginLeft: "auto", marginRight: size * 0.7, display: "flex", alignItems: "center", gap: size * 0.25, opacity: 0.35 + 0.65 * ink }}>
            <Icon name={icons[0]} size={size * 0.95} color={C.muted} stroke={2} />
            <Icon name="code" size={size * 0.6} color={C.muted2} stroke={2} />
            <Icon name={icons[1]} size={size * 0.95} color={C.muted} stroke={2} />
          </div>
        )}
      </div>
    );
  };

/** The prompt bar: a white rounded field, a typed question with a caret, and a send tile at the right.
 *  `send` 0..1 lights the tile (grey → navy); `press` 0..1 for the click. */
export const Composer: React.FC<{ w: number; h: number; text: string; n: number; size: number; send: number; placeholder?: string;
  caret?: boolean; blinkT?: number; tileScale?: number; lead?: React.ReactNode }> =
  ({ w, h, text, n, size, send, placeholder, caret = true, blinkT = 0, tileScale = 1, lead }) => {
    const tile = h * 0.62;
    return (
      <div style={{ width: w, height: h, borderRadius: h * 0.32, background: C.white, boxShadow: SHADOW, position: "relative",
        border: `1.5px solid ${rgba(C.navy, 0.07)}`, boxSizing: "border-box", display: "flex", alignItems: "center", paddingLeft: h * 0.3 }}>
        {lead}
        <div style={{ flex: 1, position: "relative" }}>
          {n <= 0 && placeholder ? <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: size, color: "#A9B0B9" }}>{placeholder}</span> :
            <Typed text={text} n={n} size={size} caret={caret} blinkT={blinkT} />}
        </div>
        <div style={{ width: tile, height: tile, marginRight: (h - tile) / 2, borderRadius: tile * 0.28, flex: "none",
          background: mix("#E2E8F0", C.navy, send), display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${tileScale})` }}>
          <Icon name="arrowUp" size={tile * 0.5} color={mix("#FFFFFF", "#FFFFFF", 1)} stroke={2.6} />
        </div>
      </div>
    );
  };

/** The K.B mark as the site shows it: the logo tile (square, white letters on the navy gradient) and, on hover, the
 *  nav pill that widens to "K.B  Tech Partner". `m` 0..1 morphs square → pill (same height); `open` px of extra width
 *  revealed for the words after K.B. Everything is one rounded rectangle, so the mass is kept. */
export const KBMark: React.FC<{ h: number; m: number; open: number; words?: { t: string; o: number }[]; letters?: number }> =
  ({ h, m, open, words = [], letters = 1 }) => {
    const kbW = tw("K.B", h * 0.42, 800, F.logo);
    const pillW = kbW + h * 0.9;
    const w = lerp(h, pillW, m) + open;
    const r = lerp(h * 0.074, h / 2, m);
    return (
      <div style={{ width: w, height: h, borderRadius: r, background: m < 1 ? `linear-gradient(90deg, ${mix("#354C67", C.navy, m)}, ${mix("#3D5574", C.navy, m)})` : C.navy,
        boxShadow: SHADOW, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: lerp(h * 0.12, h * 0.45, m), top: 0, height: h, display: "flex", alignItems: "center", opacity: letters }}>
          <span style={{ fontFamily: F.logo, fontWeight: 800, fontSize: lerp(h * 0.282 * (512 / 512) * 1.3, h * 0.42, m), color: mix("#FFFFFF", C.paleCool, m), lineHeight: 1, whiteSpace: "nowrap" }}>K.B</span>
          <span style={{ display: "inline-flex", gap: h * 0.11, marginLeft: h * 0.22 }}>
            {words.map((wd, i) => (
              <span key={i} style={{ fontFamily: F.ui, fontWeight: 600, fontSize: h * 0.3, color: C.paleCool, opacity: wd.o, whiteSpace: "nowrap" }}>{wd.t}</span>
            ))}
          </span>
        </div>
      </div>
    );
  };

/** The sign-off: the logo tile, then one or two lines that pop on in place. */
export const KBTileAt: React.FC<{ size: number }> = ({ size }) => <KBTile size={size} />;

/** The viewer's business as a workspace chip: a gradient avatar with a building, and its name. */
export const BusinessChip: React.FC<{ h: number; label?: string; status?: number; labelOpacity?: number; labelSize?: number; labelWeight?: number; children?: React.ReactNode }> =
  ({ h, label = "Your business", status = 0, labelOpacity = 1, labelSize, labelWeight = 600, children }) => (
    <div style={{ height: h, borderRadius: h * 0.3, background: C.white, boxShadow: SHADOW_SOFT, display: "inline-flex", alignItems: "center",
      gap: h * 0.22, padding: `0 ${h * 0.36}px 0 ${h * 0.16}px`, border: `1.5px solid ${rgba(C.navy, 0.07)}`, whiteSpace: "nowrap" }}>
      <div style={{ width: h * 0.68, height: h * 0.68, borderRadius: h * 0.2, background: `linear-gradient(135deg, ${C.cyan}, ${C.navy2})`, flex: "none",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="building" size={h * 0.42} color="#fff" stroke={2.2} />
      </div>
      <span style={{ fontFamily: F.ui, fontWeight: labelWeight, fontSize: labelSize ?? h * 0.36, color: C.ink, opacity: labelOpacity }}>{label}</span>
      {children}
    </div>
  );

export { Cursor, Icon, SHADOW };
