// Package R12 (reference f1080-f1200; cuts f1152, f1164).
//   AN f1080-f1151  filmed: the close. A slow push in; "Your next chapter" is typed in white on the voice; a cyan caret
//   AO f1152-f1163  the row of five K.B glyphs, changing every two or three frames; the cyan square jumps along the row
//   AP f1164-f1200  the cyan end screen: the glyph row closes into the K.B tile, which holds
import React from "react";
import type { Pkg, Sfx } from "../types";
import { AbsoluteFill } from "remotion";
import { C, Caret, E, F, Footage, Glyph, Ground, S, Tile, abs, clamp, ease, mix, onTwos, rs, settle, typed, useFonts } from "../kit";

const F0 = 1080;
const at = (n: number) => rs(n - F0);
const say = (filmSeconds: number) => filmSeconds - rs(F0);

// ---------------------------------------------------------------- AN: the filmed close
const LINE = "Your next chapter";
const TYPE0 = say(45.5), CPS = 17.5;                                   // "your" 45.58, "next" 45.86, "chapter" 46.10 (film seconds)
const AN: React.FC<{ t: number }> = ({ t }) => {
  const shown = typed(LINE, t, TYPE0, CPS), typing = t >= TYPE0 && shown.length < LINE.length;
  const tw = onTwos("AN", t, 0.1);                                      // the clip on twos, the camera stepping with it
  return (
    <AbsoluteFill style={{ fontFamily: F }}>
      <Footage name="AN" at={tw.at} scale={settle(tw.sj, 0.035, 0.6, 0.012)} dim={0.44} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 462, textAlign: "center", color: "#fff", fontSize: 132, fontWeight: 600, letterSpacing: -5, whiteSpace: "pre", textShadow: "0 4px 30px rgba(0,0,0,.35)" }}>
        <span>{shown}</span>
        <span style={{ display: "inline-block", position: "relative", width: 0, height: 0 }}>
          {t >= TYPE0 - 0.5 && <Caret t={t} h={128} w={7} c={C.cyan} typing={typing} style={{ position: "absolute", left: 10, top: -108, marginLeft: 0 }} />}
        </span>
        <span style={{ opacity: 0 }}>{LINE.slice(shown.length)}</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- AO: the glyph row
const SLOT = 96, ROW_X = 960 - 2.5 * SLOT;
const Row: React.FC<{ t: number; c: string; close?: number }> = ({ t, c, close = 0 }) => {
  const n = Math.max(0, (t - at(1152)) * 24);                         // reference frames into the row
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => {
        const k = (i * 2 + Math.floor((n + i * 1.3) / 2.5)) % 5;      // each slot changes every 2.5 frames, out of step with its neighbours
        const dx = (2 - i) * SLOT * close;                            // closing: every slot travels to the centre
        return (
          <div key={i} style={abs(ROW_X + i * SLOT, 540 - SLOT / 2, SLOT, SLOT, { display: "flex", alignItems: "center", justifyContent: "center", transform: `translate3d(${dx.toFixed(2)}px, 0, 0) scale(${(1 - 0.5 * close).toFixed(4)})`, opacity: 1 - close, willChange: "transform" })}>
            <Glyph k={k} s={62} c={c} />
          </div>
        );
      })}
    </>
  );
};
const AO: React.FC<{ t: number }> = ({ t }) => {
  const n = Math.max(0, (t - at(1152)) * 24), hi = Math.floor(n / 2.4) % 5;
  return (
    <Ground tone="ui">
      {[[ROW_X - 40, 440], [ROW_X + 5 * SLOT + 32, 440], [ROW_X - 40, 632], [ROW_X + 5 * SLOT + 32, 632]].map(([x, y], i) => <div key={i} style={abs(x, y, 8, 8, { background: C.cyan })} />)}
      <div style={abs(ROW_X + hi * SLOT + 11, 540 - 37, 74, 74, { borderRadius: 8, background: C.cyan })} />
      <Row t={t} c={C.ink} />
    </Ground>
  );
};

// ---------------------------------------------------------------- AP: the end
const AP: React.FC<{ t: number }> = ({ t }) => {
  const t0 = at(1164), close = E(t, t0, 0.3, ease.inOut), tile = S(t, t0 + 0.12, { damping: 12, stiffness: 190 });
  const ring = clamp((t - t0 - 0.45) / 0.9);
  return (
    <Ground tone="cyan">
      <Row t={t} c={C.ink} close={close} />
      <div style={abs(960 - 115, 540 - 115, 230, 230, { borderRadius: 30, border: "3px solid rgba(41,58,81,.55)", boxSizing: "border-box", opacity: ring > 0 && ring < 1 ? 0.6 * (1 - ring) : 0, transform: `scale(${(1 + 0.7 * ease.out(ring)).toFixed(4)})` })} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(mix(0.55, 1, tile) * (1 + 0.012 * Math.max(0, t - t0 - 0.5))).toFixed(4)})`, opacity: clamp(tile * 2.2), willChange: "transform" }}>
        <Tile x={960} y={540} s={230} />
      </div>
    </Ground>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: "#000" }} />;
  if (t < at(1152)) return <AN t={t} />;
  if (t < at(1164)) return <AO t={t} />;
  return <AP t={t} />;
};
const sfx: Sfx[] = [
  { t: TYPE0, kind: "type", note: "0.97 the closing words" },
  { t: at(1152), kind: "sparkle", note: "the glyph row" },
  { t: at(1164), kind: "swish", note: "the end screen" },
  { t: at(1164) + 0.2, kind: "thud", note: "the K.B tile lands" },
];
export const PKG: Pkg = { id: "R12", Comp, sfx };
