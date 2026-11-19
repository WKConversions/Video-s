// Package R11 (reference f962-f1079; cuts f1007, f1050).
//   AK f962-f1006   the update: the report is pushed up as each check row arrives; "Involved." is typed on the voice
//   AL f1007-f1049  macro: "Involved." and "From day one onwards.", typed word by word on the voice; the hand comes in
//   AM f1050-f1079  the corner of the window: the hand lands on the button and clicks it
// Timed on the reference (measured on its frames): the report's pushes start on f962, f966, f971, f986 and f1004 and
// each covers 60% of its way in the first 1/24 s; the rows show from f964, f968, f973; the macro text is still settling
// from the last push at the cut (f1007-f1010) and then drifts upward at 20 px/s, with no zoom; the cursor enters the
// macro shot at f1040, is at rest on the button by f1066-f1070, and the button gives at f1075-f1077.
import React from "react";
import { Img, staticFile } from "remotion";
import type { Pkg, Sfx } from "../types";
import type { HandKey } from "../kit";
import { Bar, C, Caret, Check, E, Fringe, Ground, HandAt, S, Tx, abs, clamp, ease, mix, rs, typed, useFonts } from "../kit";

const F0 = 962;
/** local seconds of a reference frame */
const at = (n: number) => rs(n - F0);
/** local seconds of a moment in the voice-over (film seconds) */
const say = (filmSeconds: number) => filmSeconds - rs(F0);
/** the caret riding the end of a typed line; it takes no room, so the line never changes height */
const Cur: React.FC<{ t: number; h: number; w: number; up: number; gap: number; c?: string }> = ({ t, h, w, up, gap, c }) => (
  <span style={{ display: "inline-block", position: "relative", width: 0, height: 0 }}>
    <Caret t={t} h={h} w={w} c={c} typing style={{ position: "absolute", left: gap, top: -up, marginLeft: 0 }} />
  </span>
);

// ---------------------------------------------------------------- AK: the update
const ROWS = ["Process audit with your team", "Built in the open, with your team", "Training and onboarding"];
const ROW_AT = [963, 967, 972];                                        // each row shows one frame into its push
const PUSH: [number, number][] = [[962, 52], [966, 86], [971, 86], [986, 138], [1004, 72]];   // [starts on frame, px up]
const RISE = PUSH.slice(0, 4).reduce((s, [, d]) => s + d, 0);          // 362: the report starts this far below FR 35
const INV0 = at(993) - 1 / 18;                                         // "Involved." (41.38 s): first letter on f993, last by f1004
// the earlier part of the update, above "WHAT WE DID": lines without words, gone above the frame once the list is complete
const OLD: [number, number, number, number, string?][] = [
  [150, -342, 300, 20, "#C9CED6"],
  [218, -262, 1010, 18], [218, -224, 700, 18],
  [218, -148, 1040, 18], [218, -110, 980, 18], [218, -72, 520, 18],
];
const AK: React.FC<{ t: number }> = ({ t }) => {
  const y = PUSH.reduce((s, [f, d]) => s - d * E(t, at(f), 0.3, ease.out), RISE);
  const next = t >= at(1004) + 0.04;                                   // with the last push the caret drops to a new line
  const cur = t >= at(987) ? <Cur t={t} h={62} w={4} up={49} gap={8} /> : null;
  return (
    <Ground tone="ui">
      <div style={abs(60, 0, 1400, 1080, { background: "#FBFBFA" })} />
      <div style={abs(1620, 0, 300, 1080, { background: C.dark })} />
      {/* the report: every new line arrives on the same height and pushes the rest upward */}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(0, ${y.toFixed(2)}px, 0)`, willChange: "transform" }}>
        {OLD.map(([x, yy, w, h, c], i) => <Bar key={i} x={x} y={yy} w={w} h={h} c={c} />)}
        {[-262, -148].map((yy) => <div key={yy} style={abs(152, yy - 3, 24, 24, { borderRadius: 12, background: C.cyan })} />)}
        <Tx x={150} y={90} s={30} w={700} c={C.sub} style={{ letterSpacing: 3 }}>WHAT WE DID</Tx>
        {ROWS.map((txt, i) => {
          const r = at(ROW_AT[i]), ring = clamp((t - r - 0.05) / 0.55);
          return (
            <div key={txt} style={abs(150, 160 + i * 86, 1200, 60, { display: "flex", alignItems: "center", gap: 24, fontSize: 44, fontWeight: 500, opacity: E(t, r, 0.08, ease.out), transform: `translate3d(0, ${(16 * (1 - E(t, r, 0.3, ease.out))).toFixed(2)}px, 0)` })}>
              <div style={{ position: "relative", width: 44, height: 44, flex: "none" }}>
                <div style={abs(0, 0, 44, 44, { borderRadius: 22, border: `3px solid ${C.green}`, boxSizing: "border-box", opacity: 0.55 * (1 - ring), transform: `scale(${(1 + 0.85 * ease.out(ring)).toFixed(4)})` })} />
                <div style={abs(0, 0, 44, 44, { transform: `scale(${mix(0.45, 1, S(t, r, { damping: 11, stiffness: 240 })).toFixed(4)})` })}><Check s={44} /></div>
              </div>
              {txt}
            </div>
          );
        })}
        <Tx x={150} y={470} s={52} w={500}>{typed("Involved.", t, INV0, 18)}{!next && cur}</Tx>
        {next && <Tx x={150} y={542} s={52} w={500}>{cur}</Tx>}
      </div>
      <Tx x={150} y={640} s={42} w={600}>Suggestions</Tx>
      <div style={abs(140, 730, 1300, 100, { display: "flex", gap: 26 })}>
        {["Plan the next release", "Review the numbers"].map((txt) => <div key={txt} style={{ height: 96, borderRadius: 24, background: "#EEEDE9", fontSize: 40, fontWeight: 500, padding: "0 40px", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{txt}</div>)}
      </div>
    </Ground>
  );
};

// ---------------------------------------------------------------- AL: the macro sentence
const cubicOut = (x: number) => 1 - (1 - x) ** 3;                    // a short tail: 60%, 89%, 99% of the way after 1, 2, 3 reference frames
const CPS = 40;                                                        // inside a word; the words themselves wait for the voice
// "From day one onwards.": From 42.30 (day follows at once), one 42.64, onwards 42.98
const SAID: [string, number][] = [["From day", say(42.3) - 0.02 - 1 / CPS], [" one", say(42.64) - 0.045 - 1 / CPS], [" onwards.", say(42.98) - 0.045 - 1 / CPS]];
// the hand rises from below the frame toward the button of the next shot; the cut comes while it is still travelling
const HAND_AL: HandKey[] = [{ at: 0, x: 1229, y: 1144 }, { at: 5.14, x: 1651, y: 376, early: 0, dur: 2.266 }];
const AL: React.FC<{ t: number }> = ({ t }) => {
  const y = 65 * (1 - E(t, at(1007), 0.16, cubicOut)) + 20 * (at(1050) - t);   // the last push settles (f1007-f1010), then a slow drift up
  const ink = "#1F2A3A";
  return (
    <Ground tone="vig">
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(0, ${y.toFixed(2)}px, 0)`, willChange: "transform" }}>
        <Tx x={70} y={300} s={190} w={400} c={ink} style={{ letterSpacing: -5 }}>Involved.</Tx>
        <Tx x={70} y={540} s={190} w={400} c={ink} style={{ letterSpacing: -5 }}>{SAID.map(([w, s]) => typed(w, t, s, CPS)).join("")}<Cur t={t} h={190} w={9} up={163} gap={14} c={ink} /></Tx>
      </div>
      <Fringe o={0.04} />
      <HandAt t={t} keys={HAND_AL} size={330} />
    </Ground>
  );
};

// ---------------------------------------------------------------- AM: the button in the corner
const CLICK = 4.6;                                                     // the finger is deepest at +0.11 s = f1075, where the reference's button gives
// one long glide from far below the frame: at the cut the hand is 370 px short of the button and slowing down, as in the reference.
// The finger lands on the button's right end, so "Book a Free Discovery Call" stays readable under the hand.
const HAND_AM: HandKey[] = [{ at: 0, x: 391, y: 2348 }, { at: CLICK, x: 1578, y: 532, click: true, early: 0.21 }];
const AM: React.FC<{ t: number }> = ({ t }) => {
  const over = S(t, at(1057), { damping: 18, stiffness: 190 });        // the button notices the hand above it
  const down = E(t, CLICK + 0.075, 0.05, ease.out) * (1 - E(t, CLICK + 0.16, 0.11));   // pressed (f1075-f1077), let go by f1079
  const k = 0.14 * over + 0.86 * down;
  return (
    <Ground>
      <div style={abs(-40, 150, 1700, 1000, { background: "#EDEEF0", borderRadius: 40 })} />
      <div style={abs(-40, 380, 1700, 800, { background: C.white })} />
      <div style={abs(-40, 600, 1700, 600, { background: C.dark })} />
      <Tx x={300} y={236} s={70} w={400}>×</Tx><Tx x={560} y={236} s={70} w={300} c="#9AA3AF">+</Tx>
      <div style={abs(420, 430, 300, 110, { display: "flex" })}>{["robin", "tom", "youri"].map((w, i) => <Img key={w} src={staticFile(`team/${w}.jpg`)} style={{ width: 110, height: 110, borderRadius: 55, objectFit: "cover", objectPosition: "50% 20%", border: "6px solid #fff", marginLeft: i ? -34 : 0 }} />)}</div>
      <div style={abs(790, 420, 820, 130, { borderRadius: 30, background: `rgb(${mix(41, 96, k).toFixed(0)}, ${mix(58, 121, k).toFixed(0)}, ${mix(81, 156, k).toFixed(0)})`, color: "#fff", fontSize: 54, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: -1,
        boxShadow: `0 ${(16 * over * (1 - down)).toFixed(1)}px ${(34 * over * (1 - down)).toFixed(1)}px rgba(41,58,81,${(0.22 * over * (1 - down)).toFixed(3)})`, transform: `scale(${(1 + 0.02 * over - 0.035 * down).toFixed(4)})`, willChange: "transform" })}>Book a Free Discovery Call</div>
      <HandAt t={t} keys={HAND_AM} size={300} />
    </Ground>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  useFonts();                                                          // the package entry does not load the fonts itself
  return t >= at(1050) ? <AM t={t} /> : t >= at(1007) ? <AL t={t} /> : <AK t={t} />;
};
const sfx: Sfx[] = [
  { t: at(964), kind: "pop", note: "check row 1 lands", ref: 964, db: -8 },
  { t: at(968), kind: "pop", note: "check row 2 lands", ref: 968, db: -8 },
  { t: at(973), kind: "pop", note: "check row 3 lands", ref: 973, db: -8 },
  { t: at(993), kind: "type", note: "0.45", ref: 988 },                // "Involved."
  { t: say(42.3) - 0.02, kind: "type", note: "0.2", ref: 1009 },       // "From day"
  { t: say(42.64) - 0.02, kind: "type", note: "0.08", ref: 1013 },     // "one"
  { t: say(42.98) - 0.02, kind: "type", note: "0.2", ref: 1017 },      // "onwards."
  { t: CLICK + 0.11, kind: "click", note: "the hand clicks the button", ref: 1075 },
];
export const PKG: Pkg = { id: "R11", Comp, sfx };
