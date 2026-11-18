// K.B hero film: scenes in order, a different clean transition at each boundary, the 3D hand cursor on top. LEAD-OWNED.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, E, FPS, GRAD, ease, mix, useFonts } from "./kit";
import { SCENES, TR, SceneDef } from "./timeline";
import type { Group, HandKey } from "./types";
import { Hand, handAt } from "./hand";
import { GROUP as A } from "./scenes/A"; import { GROUP as B } from "./scenes/B"; import { GROUP as Cg } from "./scenes/C";
import { GROUP as D } from "./scenes/D"; import { GROUP as Eg } from "./scenes/E";

export const GROUPS: Record<string, Group> = { A, B, C: Cg, D, E: Eg };
export const HAND_SIZE = 170;
/** every hand key of the film in film seconds */
export const handKeys = (): HandKey[] => SCENES.flatMap((s) => (GROUPS[s.group].hand[s.id] || []).map((k) => ({ ...k, at: k.at + s.start }))).sort((a, b) => a.at - b.at);

// the transition into scene `s` (progress p 0..1 over TR seconds around its start): styles for the scene coming IN and the one going OUT
const trans = (kind: SceneDef["trans"], p: number): { inn: React.CSSProperties; out: React.CSSProperties; over?: React.ReactNode } => {
  switch (kind) {
    case "zoom": return { inn: { transform: `scale(${mix(0.8, 1, p)})`, opacity: Math.min(1, p * 1.6), filter: p < 0.99 ? `blur(${(1 - p) * 10}px)` : undefined },
      out: { transform: `scale(${1 + 0.55 * p})`, opacity: 1 - p ** 1.4, filter: `blur(${p * 14}px)` } };
    case "push-up": return { inn: { transform: `translateY(${(1 - p) * 100}%)` }, out: { transform: `translateY(${-p * 100}%) scale(${1 - 0.04 * p})` } };
    case "push-left": return { inn: { transform: `translateX(${(1 - p) * 100}%)` }, out: { transform: `translateX(${-p * 100}%) scale(${1 - 0.04 * p})` } };
    case "iris": return { inn: { clipPath: `circle(${p * 125}% at 50% 50%)` }, out: { transform: `scale(${1 - 0.05 * p})` } };
    case "wipe": { const c = mix(-30, 130, p);
      return { inn: { clipPath: `polygon(${c - 14}% 0, 100% 0, 100% 100%, ${c - 34}% 100%)`.replace(/(\d+(\.\d+)?)%/g, (m) => m), WebkitClipPath: undefined } as any, out: {},
        over: <AbsoluteFill style={{ background: GRAD.brand, clipPath: `polygon(${c - 22}% 0, ${c - 12}% 0, ${c - 32}% 100%, ${c - 42}% 100%)`, opacity: Math.sin(Math.PI * p) }} /> }; }
    case "blur": return { inn: { opacity: p, filter: p < 0.99 ? `blur(${(1 - p) * 18}px)` : undefined, transform: `scale(${mix(1.04, 1, p)})` }, out: { filter: `blur(${p * 18}px)`, transform: `scale(${1 - 0.03 * p})` } };
    default: return { inn: {}, out: {} };
  }
};

export const Film: React.FC = () => {
  const T = useCurrentFrame() / FPS;
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.bg }} />;
  const layers: React.ReactNode[] = [];
  SCENES.forEach((s, i) => {
    const t = T - s.start, next = SCENES[i + 1];
    if (t < -TR / 2 || t > s.dur + TR / 2) return;
    const Comp = GROUPS[s.group].scenes[s.id];
    const pin = i === 0 ? 1 : E(T, s.start - TR / 2, TR, ease.inOut), pout = next ? E(T, next.start - TR / 2, TR, ease.inOut) : 0;
    let style: React.CSSProperties = {};
    if (pin < 1) style = trans(s.trans, pin).inn; else if (pout > 0 && next) style = trans(next.trans, pout).out;
    layers.push(<AbsoluteFill key={s.id} style={{ ...style, overflow: "hidden" }}><Comp t={t} dur={s.dur} /></AbsoluteFill>);
    if (pin < 1 && pin > 0) { const o = trans(s.trans, pin).over; if (o) layers.push(<React.Fragment key={s.id + "o"}>{o}</React.Fragment>); }
  });
  const keys = handKeys();
  const h = keys.length ? handAt(T * 30, keys, { size: HAND_SIZE }) : null;
  const on = h && h.x > -HAND_SIZE && h.x < 1920 + HAND_SIZE && h.y > -HAND_SIZE && h.y < 1080 + HAND_SIZE * 1.2;
  return <AbsoluteFill style={{ background: C.bg }}>{layers}{on && h && <Hand {...h} />}</AbsoluteFill>;
};
