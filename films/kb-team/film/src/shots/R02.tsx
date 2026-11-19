// Package R02 (reference f93-f187; cut f130).
//   D f93-f129   "For what / comes next": each word lands as it is spoken; the five team portraits pop in around them
//   E f130-f187  the portraits travel into a row, close up into one square, which becomes the K.B tile; the logo holds
//                while two hairlines draw in; then it softens into the paper (the reference dissolves before its cut)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Pkg, Sfx } from "../types";
import { C, E, Ground, ROLE, S, TEAM, Tile, abs, clamp, ease, mix, rs, useFonts } from "../kit";

const F0 = 93;
const at = (n: number) => rs(n - F0);
const say = (filmSeconds: number) => filmSeconds - rs(F0);
const CUT = at(130);

// where each portrait sits around the words (D), in TEAM order: robin, tom, youri, karl, cedric
const SPOT: Record<string, [number, number, number, number]> = { robin: [150, 170, 210, 230], tom: [1010, 770, 190, 210], youri: [1395, 120, 235, 260], karl: [1560, 560, 200, 220], cedric: [330, 700, 190, 210] };
const ORDER = ["robin", "youri", "karl", "cedric", "tom"];             // the order they pop in
const POP = (who: string) => at(93) + 0.02 + ORDER.indexOf(who) * 0.165;
const ROW = (i: number): [number, number, number, number] => [445 + i * 210, 445, 190, 190];
const WORDS: [string, number, number][] = [["For", 0, say(3.78)], ["what", 0, say(4.06)], ["comes", 1, say(4.26)], ["next", 1, say(4.52)]];

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.paper }} />;
  const row = E(t, CUT - 0.02, 0.34, ease.out);                        // into the row (settled by f138)
  const close = E(t, at(141), 0.26, ease.inOut);                       // the row closes into one square
  const tile = S(t, at(144), { damping: 13, stiffness: 200 });         // the square becomes the logo
  const lines = E(t, at(173), 0.3, ease.out);
  const out = E(t, at(180), 0.33, ease.in);                            // the logo softens into the paper
  const drift = 1 + 0.012 * clamp(t / CUT);
  return (
    <Ground>
      {/* the words: set loosely, each lands on its spoken word and the line gives a little as the next one arrives */}
      {t < CUT && [0, 1].map((ln) => (
        <div key={ln} style={abs(0, 380 + ln * 140, 1920, 150, { display: "flex", justifyContent: "center", gap: 34, fontSize: 132, fontWeight: 600, letterSpacing: -4, lineHeight: 1.08, transform: `translate3d(${ln === 0 ? 40 : -46}px, 0, 0)` })}>
          {WORDS.filter((w) => w[1] === ln).map(([w, , t0], i, arr) => {
            const p = S(t, t0 - 0.04, { damping: 12, stiffness: 210 }), nextIn = i + 1 < arr.length ? S(t, arr[i + 1][2] - 0.04, { damping: 14 }) : 0;
            const give = ln === 0 ? S(t, WORDS[2][2] - 0.04, { damping: 14 }) : 0;
            return <span key={w} style={{ display: "inline-block", opacity: clamp(p * 3), transform: `translate3d(${(-10 * nextIn).toFixed(2)}px, ${((1 - p) * 34 - 6 * give).toFixed(2)}px, 0) rotate(${((1 - p) * -2).toFixed(2)}deg)`, willChange: "transform" }}>{w}</span>;
          })}
        </div>
      ))}
      {/* the portraits: pop in around the words, then travel into the row and close into one square */}
      {TEAM.map((who, i) => {
        const [x0, y0, w0, h0] = SPOT[who], [x1, y1, w1, h1] = ROW(i);
        const pop = S(t, POP(who), { damping: 11, stiffness: 190 });
        const cx = mix(mix(x0 + w0 / 2, x1 + w1 / 2, row), 960, close), cy = mix(mix(y0 + h0 / 2, y1 + h1 / 2, row), 540, close);
        const w = mix(w0, w1, row), h = mix(h0, h1, row), sc = mix(0.55, 1, pop) * mix(1, 200 / 190, close) * (t < CUT ? drift : 1);
        if (pop <= 0.001 || tile >= 0.999) return null;
        return (
          <div key={who} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${(cx - w / 2).toFixed(2)}px, ${(cy - h / 2).toFixed(2)}px, 0) scale(${sc.toFixed(4)})`, opacity: clamp(pop * 3) * (1 - clamp(tile * 1.6)), zIndex: 5 - i, willChange: "transform" }}>
            <div style={{ width: w, height: h, borderRadius: mix(6, 15, close), overflow: "hidden", boxShadow: "0 14px 34px rgba(41,58,81,.18)" }}>
              <Img src={staticFile(`team/${who}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 15, fontWeight: 500, color: C.sub, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", opacity: clamp((pop - 0.6) * 3) * (1 - clamp(row * 4)) }}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.cyan }} />{ROLE[who]}</div>
          </div>
        );
      })}
      {/* the logo, its hairlines, and the soft way out */}
      {t >= at(144) && (
        <>
          <div style={abs(700, 0, 1, 1080, { background: C.line, transformOrigin: "50% 0", transform: `scaleY(${lines.toFixed(4)})`, opacity: 1 - out })} />
          <div style={abs(0, 730, 1920, 1, { background: C.line, transformOrigin: "0 50%", transform: `scaleX(${E(t, at(175), 0.3, ease.out).toFixed(4)})`, opacity: 1 - out })} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(mix(0.8, 1, tile) * (1 + 0.5 * out)).toFixed(4)})`, opacity: clamp(tile * 2.4) * (1 - 0.85 * out), filter: out > 0.01 ? `blur(${(out * 10).toFixed(2)}px)` : undefined, willChange: "transform" }}>
            <Tile x={960} y={540} s={200} />
          </div>
          <AbsoluteFill style={{ background: "#FBFBFA", opacity: 0.5 * out }} />
        </>
      )}
    </Ground>
  );
};
const sfx: Sfx[] = [
  { t: POP("robin"), kind: "pop", note: "first portrait" },
  { t: POP("karl"), kind: "pop", note: "third portrait" },
  { t: POP("tom"), kind: "pop", note: "fifth portrait" },
  { t: CUT, kind: "slide", note: "the portraits travel into a row" },
  { t: at(145), kind: "thud", note: "the row becomes the K.B tile" },
  { t: at(180), kind: "swish", note: "the logo softens into the paper" },
];
export const PKG: Pkg = { id: "R02", Comp, sfx };
