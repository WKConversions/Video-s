// Package R12 (reference f1080-f1200; cuts f1152, f1164), rebuilt on the reference's measured frames.
//   AN f1080-f1151  filmed: the close; the camera drifts as the reference's does; "Your next chapter" typed in white,
//                   centred, with a tall cyan caret that blinks as the reference's does
//   AO f1152-f1163  the row of glyphs: spacing, glyph changes and highlight jumps on the reference's frames
//   AP f1164-f1200  the cyan end screen: the K.B tile arrives large and settles, two dots drift in and vanish, then it holds
import React from "react";
import type { Pkg, Sfx } from "../types";
import { AbsoluteFill } from "remotion";
import { C, F, Footage, Ground, Tile, abs, kf, onTwos, refN, rs, useFonts } from "../kit";
import { G12 } from "./R12_glyphs";

const F0 = 1080;
const at = (n: number) => rs(n - F0);
const INK = "#16202E";

// ---------------------------------------------------------------- AN: the filmed close
const LINE = "Your next chapter";
// reference frame on which each character appears (space comes with the letter after it)
const CT = [1089, 1091, 1093, 1094, 1100, 1100, 1101, 1103, 1104, 1106, 1106, 1107, 1108, 1109, 1110, 1111, 1112];
// the reference's camera (track.py cam, accumulated): [frame, value]
const CX: [number, number][] = [[1080, 0], [1083, 9.7], [1086, 17.9], [1089, 22.5], [1092, 25.5], [1096, 23.5], [1100, 19.6], [1104, 15.5], [1108, 12.5], [1112, 10], [1116, 8.2], [1120, 6.1], [1124, 1.9], [1128, -3.8], [1132, -10.4], [1135, -14.4], [1138, -18.9], [1141, -24.9], [1144, -35.2], [1147, -42.5], [1150, -45.2], [1151, -45.4]];
const CY: [number, number][] = [[1080, 0], [1083, 8.7], [1086, 14], [1089, 16.4], [1092, 15.4], [1096, 14.1], [1100, 13.2], [1104, 11], [1108, 7.9], [1112, 4.8], [1116, 3.3], [1120, 3.6], [1124, 6.2], [1128, 11.2], [1132, 16], [1135, 17.1], [1138, 17], [1141, 14.3], [1144, 9.6], [1147, 7.4], [1150, 5.3], [1151, 4.3]];
const AN: React.FC<{ t: number }> = ({ t }) => {
  const tw = onTwos("AN", t, 0.1);
  const ns = F0 + tw.sj * 24;                                              // the camera steps with the drawings
  const n = Math.floor(refN(t, F0) + 1e-6);                                // text and caret live on the reference's frames
  const cnt = CT.filter((f) => f <= n).length, shown = LINE.slice(0, cnt);
  const caret = (n >= 1083 && n <= 1129) || n >= 1143;
  const grow = n >= 1150 ? 1.026 : 1;
  return (
    <AbsoluteFill style={{ fontFamily: F }}>
      <Footage name="AN" at={tw.at} scale={1.07} x={kf(ns, CX)} y={kf(ns, CY)} />
      <div style={{ position: "absolute", left: 0, width: 1920, top: 479, height: 108, display: "flex", justifyContent: "center", alignItems: "center", transform: `translate3d(${cnt === 0 ? 14 : 15}px,0,0) scale(${grow})`, transformOrigin: "953px 54px" }}>
        <span style={{ color: "#fff", fontSize: 108, fontWeight: 600, letterSpacing: -4, whiteSpace: "pre", lineHeight: "108px", textShadow: "0 2px 18px rgba(0,0,0,.25)" }}>{shown}</span>
        <span style={{ display: "inline-block", width: 9, height: 108, marginLeft: cnt === 0 ? 0 : 18, borderRadius: 2, background: C.cyan, opacity: caret ? 1 : 0 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- AO: the glyph row
type St = { g: number[]; hi: number; pitch: number; dots: [number, number][]; hc: "cy" | "in" };
const dots = (dx: number, dy: number): [number, number][] => [[-dx, -dy], [dx, -dy], [-dx, dy], [dx, dy]];
const state = (n: number): St => {
  if (n <= 1153) return { g: [0, 1, 2, 3, 4], hi: 4, pitch: 127.5, dots: dots(339, 73), hc: "cy" };
  if (n === 1154) return { g: [0, 1, 2, 3, 4], hi: 4, pitch: 133.5, dots: dots(352, 78), hc: "cy" };
  if (n === 1155) return { g: [0, 1, 2, 3, 4], hi: 2, pitch: 133.5, dots: dots(352, 78), hc: "in" };
  if (n <= 1157) return { g: [0, 1, 2, 6, 4], hi: 2, pitch: 133.5, dots: dots(352, 78), hc: "in" };
  if (n === 1158) return { g: [5, 1, 2, 6, 0], hi: 2, pitch: 133.5, dots: dots(352, 78), hc: "in" };
  if (n <= 1160) return { g: [5, 7, 2, 6, 0], hi: 0, pitch: 133.5, dots: dots(352, 78), hc: "cy" };
  return { g: [5, 8, 6, 0], hi: 1, pitch: 133.5, dots: [[282, -84], [-285, 84]], hc: "cy" };
};
const Row: React.FC<{ n: number; bg: string }> = ({ n, bg }) => {
  const st = state(n), m = st.g.length;
  return (
    <>
      {st.dots.map(([dx, dy], i) => <div key={i} style={abs(960 + dx - 5, 540 + dy - 5, 10, 10, { background: C.cyan })} />)}
      {st.g.map((k, i) => {
        const cx = 960 + (i - (m - 1) / 2) * st.pitch, hi = i === st.hi;
        const col = hi && st.hc === "in" ? "#B9CCFF" : INK;
        return (
          <React.Fragment key={i}>
            {hi && <div style={abs(cx - 54, 540 - 54, 108, 108, { borderRadius: 7, background: st.hc === "in" ? C.indigo : C.cyan })} />}
            <div style={abs(cx - 42, 540 - 42, 84, 84)}><G12 k={k} s={84} c={col} bg={hi ? (st.hc === "in" ? C.indigo : C.cyan) : bg} /></div>
          </React.Fragment>
        );
      })}
    </>
  );
};
const AO: React.FC<{ t: number }> = ({ t }) => {
  const n = Math.floor(refN(t, F0) + 1e-6);
  return <Ground tone="ui"><Row n={n} bg={C.ui} /></Ground>;
};

// ---------------------------------------------------------------- AP: the end
const AP: React.FC<{ t: number }> = ({ t }) => {
  const n = refN(t, F0), ni = Math.floor(n + 1e-6);
  const sc = kf(n, [[1164, 1.1], [1166, 1.066], [1167, 1.02], [1168, 1.005], [1170, 1]]);
  const lx = kf(n, [[1164, 694], [1166, 703], [1167, 714], [1168, 716], [1173, 721]]), ly = kf(n, [[1164, 585], [1167, 586], [1168, 537], [1173, 537]]);
  const rx = kf(n, [[1164, 1213], [1166, 1204], [1167, 1196], [1168, 1192], [1173, 1188]]), ry = kf(n, [[1164, 492], [1167, 492], [1168, 537], [1173, 537]]);
  return (
    <Ground tone="cyan">
      {ni < 1174 && [[lx, ly], [rx, ry]].map(([x, y], i) => <div key={i} style={abs(x - 5, y - 5, 10, 10, { background: INK })} />)}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "953px 539px", transform: `scale(${sc.toFixed(4)})`, willChange: "transform" }}>
        <Tile x={953} y={539} s={150} />
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
  { t: at(1089), kind: "type", note: "0.97 the closing words, 1089-1112" },
  { t: at(1152), kind: "sparkle", note: "the glyph row" },
  { t: at(1164), kind: "swish", note: "the end screen" },
  { t: at(1164) + 0.2, kind: "thud", note: "the K.B tile lands" },
];
export const PKG: Pkg = { id: "R12", Comp, sfx };
