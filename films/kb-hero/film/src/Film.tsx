// K.B hero film: scenes in order, a different clean transition at each boundary, the 3D hand cursor on top. LEAD-OWNED.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, E, FPS, GRAD, ease, mix, useFonts } from "./kit";
import { SCENES, TR, SceneDef } from "./timeline";
import type { Group, HandKey } from "./types";
import { Hand, handAt } from "./hand";
import { GROUP as A } from "./scenes/A"; import { GROUP as B } from "./scenes/B"; import { GROUP as Cg } from "./scenes/C";
import { GROUP as D } from "./scenes/D"; import { GROUP as Eg } from "./scenes/E";

import { S13, S13_HAND, S13_SFX } from "./scenes/S13globe";

// S13 is the lead's dot globe (src/scenes/S13globe.tsx); it replaces the placeholder map in group E
const Ex: Group = { scenes: { ...Eg.scenes, S13 }, hand: { ...Eg.hand, S13: S13_HAND }, sfx: { ...Eg.sfx, S13: S13_SFX } };
export const GROUPS: Record<string, Group> = { A, B, C: Cg, D, E: Ex };
export const HAND_SIZE = 170;
// The hand works in SESSIONS (Karl: the cursor about half the film). In a session it comes in from below the frame, does
// the scenes' own keys (targets only), and leaves either by its own exit key or with the last scene's transition (it is
// then drawn inside that scene's layer, so it zooms, blurs, slides or is wiped away with it).
type Session = { scenes: string[]; from: [number, number]; early?: number; exit?: { at: number; x: number; y: number } };
export const SESSIONS: Session[] = [
  { scenes: ["S1", "S2"], from: [1500, 1310] },
  { scenes: ["S4"], from: [560, 1300], early: 0.3, exit: { at: 13.2, x: 1150, y: 1300 } },
  { scenes: ["S7"], from: [900, 1310], early: 0.35, exit: { at: 20.15, x: 1250, y: -320 } },
  { scenes: ["S10", "S11"], from: [760, 1310], early: 0.25 },
  { scenes: ["S14"], from: [1150, 1310] },
];
const inFrame = (k: HandKey) => k.x >= 0 && k.x <= 1920 && k.y >= 0 && k.y <= 1080;
/** a session's keys in film seconds: the entry point, the scenes' keys, the exit */
export const sessionKeys = (s: Session): HandKey[] => {
  const ks = s.scenes.flatMap((id) => { const sc = SCENES.find((x) => x.id === id)!; return (GROUPS[sc.group].hand[id] || []).filter(inFrame).map((k) => ({ ...k, at: k.at + sc.start })); }).sort((a, b) => a.at - b.at);
  if (!ks.length) return [];
  if (s.early != null) ks[0] = { ...ks[0], early: s.early };
  return [{ at: ks[0].at - 4, x: s.from[0], y: s.from[1] }, ...ks, ...(s.exit ? [{ ...s.exit, early: 0 }] : [])];
};
/** the hand at film time T: its pose, and the scene whose layer it is drawn in while that scene is transitioning out (else on top) */
export const handNow = (T: number): { h: ReturnType<typeof handAt>; inScene: string | null } | null => {
  for (const s of SESSIONS) {
    const keys = sessionKeys(s); if (!keys.length) continue;
    const last = SCENES.find((x) => x.id === s.scenes[s.scenes.length - 1])!, end = last.start + last.dur, final = last === SCENES[SCENES.length - 1];
    if (T < keys[0].at || (!final && T > end + TR / 2)) continue;
    const h = handAt(T * 30, keys, { size: HAND_SIZE });
    if (!(h.x > -HAND_SIZE && h.x < 1920 + HAND_SIZE && h.y > -HAND_SIZE * 1.3 && h.y < 1080 + HAND_SIZE * 0.3)) return null;
    return { h, inScene: !final && T >= end - TR / 2 ? last.id : null };
  }
  return null;
};

// the transition into scene `s` (progress p 0..1 over TR seconds around its start): styles for the scene coming IN and the one going OUT
const trans = (kind: SceneDef["trans"], p: number): { inn: React.CSSProperties; out: React.CSSProperties; over?: React.ReactNode } => {
  switch (kind) {
    case "zoom": return { inn: { transform: `scale(${mix(0.8, 1, p)})`, opacity: Math.min(1, p * 1.6), filter: p < 0.99 ? `blur(${(1 - p) * 10}px)` : undefined },
      out: { transform: `scale(${1 + 0.55 * p})`, opacity: 1 - p ** 1.4, filter: `blur(${p * 14}px)` } };
    case "push-up": return { inn: { transform: `translateY(${(1 - p) * 100}%)` }, out: { transform: `translateY(${-p * 100}%) scale(${1 - 0.04 * p})` } };
    case "push-left": return { inn: { transform: `translateX(${(1 - p) * 100}%)` }, out: { transform: `translateX(${-p * 100}%) scale(${1 - 0.04 * p})` } };
    case "iris": return { inn: { clipPath: `circle(${p * 125}% at 50% 50%)` }, out: { transform: `scale(${1 - 0.05 * p})` } };
    case "wipe": { const c = mix(-10, 150, p);   // a diagonal edge crossing left to right: the incoming scene is everything left of it
      return { inn: { clipPath: `polygon(0 0, ${c}% 0, ${c - 22}% 100%, 0 100%)` }, out: {},
        over: <AbsoluteFill style={{ background: GRAD.brand, clipPath: `polygon(${c}% 0, ${c + 7}% 0, ${c - 15}% 100%, ${c - 22}% 100%)`, opacity: Math.min(1, Math.sin(Math.PI * p) * 1.6) }} /> }; }
    case "blur": return { inn: { opacity: p, filter: p < 0.99 ? `blur(${(1 - p) * 18}px)` : undefined, transform: `scale(${mix(1.04, 1, p)})` }, out: { filter: `blur(${p * 18}px)`, transform: `scale(${1 - 0.03 * p})` } };
    default: return { inn: {}, out: {} };
  }
};

export const Film: React.FC = () => {
  const T = useCurrentFrame() / FPS;
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.bg }} />;
  const layers: React.ReactNode[] = [], hn = handNow(T);
  SCENES.forEach((s, i) => {
    const t = T - s.start, next = SCENES[i + 1];
    if (t < -TR / 2 || t > s.dur + TR / 2) return;
    const Comp = GROUPS[s.group].scenes[s.id];
    const pin = i === 0 ? 1 : E(T, s.start - TR / 2, TR, ease.inOut), pout = next ? E(T, next.start - TR / 2, TR, ease.inOut) : 0;
    let style: React.CSSProperties = {};
    if (pin < 1) style = trans(s.trans, pin).inn; else if (pout > 0 && next) style = trans(next.trans, pout).out;
    layers.push(<AbsoluteFill key={s.id} style={{ ...style, overflow: "hidden" }}><Comp t={t} dur={s.dur} />{hn && hn.inScene === s.id && <Hand {...hn.h} />}</AbsoluteFill>);
    if (pin < 1 && pin > 0) { const o = trans(s.trans, pin).over; if (o) layers.push(<React.Fragment key={s.id + "o"}>{o}</React.Fragment>); }
  });
  return <AbsoluteFill style={{ background: C.bg }}>{layers}{hn && !hn.inScene && <Hand {...hn.h} />}</AbsoluteFill>;
};
