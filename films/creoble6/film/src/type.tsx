// v6's kinetic type (Willads 4: "pure kinetic type beats: big, centred, word by word, one accent word; drop the blur-in
// preset"; reference 0–4 s and 26–28 s). One centred line. Each word rises into place through its own mask on its
// spoken word (no blur, no bounce) and the line RE-CENTRES smoothly as words arrive or leave, so the line always sits
// on the centre (the reference's "Turn" sliding left as "Books" arrives). A word with `out` leaves through the top of
// its mask and the line closes up: "Ingen teknik." → "Ingen skabeloner." is one line where "teknik." leaves and
// "skabeloner." arrives. Inline objects (a logo dot, a small UI piece) can sit in the line like words and travel with
// it (the reference's star trailing "Translate. Dub. Distribute").
import React, { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { C, OUT, INOUT, SERIF, SANS, clamp01, fontsReady } from "./lib";
import { f } from "./shared";
import { pop } from "./motion";

export const ACCENT = "#6F9187";          // the accent word: italic, a deeper sage than #87A89E so it reads at display size
export const TYPE = { hero: 136, big: 112, line: 88, sub: 56 };   // Fraunces 400 sizes (px at 1080p)

// useFonts: true once the faces are loaded (the line is measured with them); holds the frame until then
export const useFonts = () => {
  const [ok, setOk] = useState(false);
  const [h] = useState(() => (typeof window !== "undefined" ? delayRender("kinetic: fonts") : null));
  useEffect(() => { fontsReady.then(() => { setOk(true); if (h !== null) continueRender(h); }); }, [h]);
  return ok;
};
const cache = new Map<string, number>();
let ctx: CanvasRenderingContext2D | null = null;
export const measure = (text: string, size: number, italic: boolean, serif = true, weight = 400, ready = true) => {
  const font = `${italic ? "italic " : ""}${weight} ${size}px ${serif ? SERIF : SANS}`, key = font + "|" + text;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  if (typeof document === "undefined") return text.length * size * 0.5;
  ctx = ctx ?? document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * size * 0.5;
  ctx.font = font;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${(serif ? -0.02 : -0.01) * size}px`;
  const wdt = ctx.measureText(text).width;
  if (ready) cache.set(key, wdt);
  return wdt;
};

// One item of a line: a word (t) or an inline object (node, with its width w in px). at = when it arrives (label or
// seconds); out = when it leaves; accent = italic sage (one per line). dur = arrival time in s (default 0.6).
export type KItem = { t?: string; node?: React.ReactNode; w?: number; at: string | number; out?: string | number; accent?: boolean; dur?: number };

// Kinetic: the line, centred on (0, 0) of wherever it is placed (a Plane, or an absolutely positioned box).
// size = font px (TYPE.*); color = ink; serif = Fraunces (false: DM Sans 500, for UI-ish lines).
// A word's arrival: it rises 0.9 em through its mask (OUT, 0.6 s); its slot opens over the same time (INOUT), so
// the line re-centres while it rises. Leaving: it rises out the top (0.45 s) and its slot closes (0.55 s).
export const Kinetic: React.FC<{ g: number; items: KItem[]; size?: number; color?: string; serif?: boolean; space?: number; style?: React.CSSProperties }> = ({ g, items, size = TYPE.big, color = C.ink, serif = true, space = 0.27, style }) => {
  const ready = useFonts();
  const sp = space * size;
  const st = items.map((it) => {
    const w = it.node ? (it.w ?? size) : measure(it.t ?? "", size, !!it.accent, serif, serif ? 400 : 500, ready);
    const a = f(it.at), dur = (it.dur ?? 0.6) * 30;
    // Karl (10 Nov): "everything should bounce a bit": a word rises with a soft start and settles with a small overshoot
    const inV = pop(g, (a) / 30, { dur: dur / 30, over: 0.07 }), inL = INOUT(clamp01((g - a) / (dur * 0.9)));
    const o = it.out !== undefined ? f(it.out) : Infinity;
    const outV = OUT(clamp01((g - o) / 13.5)), outL = INOUT(clamp01((g - o - 3) / 16.5));
    return { it, w, vis: inV, gone: outV, slot: inL * (1 - outL) };
  });
  // slots: an item's width opens with its slot; the space before it opens with it, but only once something sits to
  // its left (so a line whose first word leaves closes up without a jump)
  let acc = 0, cum = 0;
  const lefts = st.map((x) => { const pre = sp * x.slot * Math.min(1, acc), l = cum + pre; cum += pre + x.slot * x.w; acc += x.slot; return l; });
  const width = cum;
  const lh = size * 1.25, pad = size * 0.16;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, ...style }}>
      {st.map((s, i) => {
        const left = lefts[i] - width / 2;
        if (s.vis <= 0 || s.gone >= 1) return null;
        // vis may pass 1 slightly (the settle): the word rises a touch above its line and comes back
        const y = (1 - s.vis) * size * 0.9 - s.gone * size * 0.95;
        return (
          <div key={i} style={{ position: "absolute", left: left - pad, top: -lh / 2, width: s.w + 2 * pad, height: lh, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: pad, top: 0, height: lh, display: "flex", alignItems: "center", transform: `translateY(${y.toFixed(2)}px)`,
              fontFamily: serif ? SERIF : SANS, fontWeight: serif ? 400 : 500, fontSize: size, lineHeight: `${lh}px`, letterSpacing: `${serif ? -0.02 : -0.01}em`,
              whiteSpace: "nowrap", color: s.it.accent ? ACCENT : color, fontStyle: s.it.accent ? "italic" : "normal" }}>
              {s.it.node ?? s.it.t}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Words: shorthand to build items from a sentence and word labels:
//   words("Ingen teknik.", ["w:ingen", "w:teknik"], { accent: 1 })   → accent = index of the accent word
export const words = (text: string, at: (string | number)[], o: { accent?: number; out?: string | number; outEach?: (string | number | undefined)[] } = {}): KItem[] =>
  text.split(" ").map((t, i) => ({ t, at: at[Math.min(i, at.length - 1)], accent: o.accent === i, out: o.outEach?.[i] ?? o.out }));
