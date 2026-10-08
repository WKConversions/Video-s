// Act 1 (0–7.2 s): two circles, K.B and "Your business", dock into one lockup; the lockup opens into the business's
// workspace window; Automations switches on, then every module runs; a phone slides in; K.B and You join; "How?".
import React from "react";
import { Easing } from "remotion";
import { T } from "./clock";
import { Line, measure, off } from "./kinetic";
import { ARRIVE, C, KBTile, MOVE, SHADOW, lerp } from "./lib";
import { Avatar, BAR, Box, Check, IconBox, PHONE, Phone, STRIP, Skel, Toggle, U, mix, trk, txt } from "./ui";

export const IN = Easing.bezier(0.3, 0.7, 0.4, 1);     // arrivals from outside the frame (≤ ~120 px a frame)
export const OUT = Easing.bezier(0.45, 0, 0.8, 0.5);   // gentle exits that speed up as they leave
const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);

const MODULES = [
  { n: "Automations", i: "bolt" }, { n: "Website", i: "globe" }, { n: "CRM", i: "users" }, { n: "Invoices", i: "receipt" },
  { n: "Dashboard", i: "chart" }, { n: "Mobile app", i: "mobile" }, { n: "Bookings", i: "calendar" }, { n: "Team chat", i: "chat" },
];
const W1 = { w: 1440, h: 800 };
const TITLE = "Your business";

/** The workspace body (1440 × 684): eight module cards; Automations switches on and lifts, then every module runs. */
const Workspace: React.FC<{ g: number }> = ({ g }) => {
  const lift = k(g, "auto", 0.5, MOVE), dim = k(g, "auto+0.05", 0.4) * (1 - k(g, "runs", 0.45));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 684 }}>
      <div style={{ position: "absolute", left: 60, top: 30, opacity: k(g, "cards", 0.4), ...txt(24, 600, C.muted) }}>Workspace</div>
      {MODULES.map((m, i) => {
        const a = k(g, off("cards", 0.05 * i), 0.45);
        if (a <= 0) return null;
        const x = 60 + (i % 4) * 336, y = 76 + Math.floor(i / 4) * 290;
        const isAuto = i === 0;
        const on = isAuto ? k(g, "auto+0.18", 0.28, MOVE) : k(g, off("runs", 0.05 * i), 0.28, MOVE);
        const s = isAuto ? 1 + 0.07 * lift : 1;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 312, height: 266, opacity: a * (isAuto ? 1 : 1 - 0.5 * dim), zIndex: isAuto ? 2 : 1,
            transform: `translateY(${(1 - a) * 40 - (isAuto ? 12 * lift : 0)}px) scale(${s})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: C.white, boxShadow: isAuto ? `0 ${10 + 24 * lift}px ${30 + 30 * lift}px -18px rgba(41,58,81,${0.25 + 0.2 * lift})` : "0 10px 26px -16px rgba(41,58,81,0.25)",
              border: `3px solid ${isAuto ? mix(U.skel, C.cyan, lift) : U.skel}` }} />
            <div style={{ position: "absolute", left: 26, top: 26 }}><IconBox name={m.i} size={64} bg={isAuto ? mix(U.tint, C.cyanSoft, lift) : U.tint} /></div>
            <div style={{ position: "absolute", left: 26, top: 114, ...txt(28, 700) }}>{m.n}</div>
            <Skel w={190} style={{ position: "absolute", left: 26, top: 166 }} />
            <Skel w={128} style={{ position: "absolute", left: 26, top: 190 }} />
            <div style={{ position: "absolute", right: 26, bottom: 26 }}><Toggle on={on} /></div>
            {isAuto && <div style={{ position: "absolute", right: -22, top: -22, opacity: k(g, "auto+0.3", 0.25), transform: `scale(${0.6 + 0.4 * k(g, "auto+0.3", 0.4)})` }}><Check size={62} /></div>}
          </div>
        );
      })}
    </div>
  );
};

/** The phone running the same workspace. */
const PhoneWorkspace: React.FC<{ g: number }> = ({ g }) => (
  <Phone>
    <div style={{ position: "absolute", left: 0, top: 0, width: PHONE.w - 26, height: 150, background: C.navy }} />
    <div style={{ position: "absolute", left: 26, top: 82, ...txt(27, 700, C.white) }}>{TITLE}</div>
    <div style={{ position: "absolute", right: 22, top: 74, display: "flex" }}>
      <div style={{ opacity: k(g, "chips+0.1", 0.3), transform: `scale(${0.6 + 0.4 * k(g, "chips+0.1", 0.4)})` }}><Avatar size={44} kb ring={C.navy} /></div>
      <div style={{ marginLeft: -10, opacity: k(g, "chips+0.22", 0.3), transform: `scale(${0.6 + 0.4 * k(g, "chips+0.22", 0.4)})` }}><Avatar size={44} text="You" bg={C.cyan} ring={C.navy} /></div>
    </div>
    {MODULES.slice(0, 5).map((m, i) => (
      <div key={i} style={{ position: "absolute", left: 16, top: 170 + i * 108, width: PHONE.w - 58, height: 92, borderRadius: 18, background: C.white,
        boxShadow: "0 8px 20px -14px rgba(41,58,81,0.3)", display: "flex", alignItems: "center", gap: 16, padding: "0 18px", boxSizing: "border-box",
        border: `2px solid ${i === 0 ? C.cyan : U.skel}` }}>
        <IconBox name={m.i} size={50} bg={i === 0 ? C.cyanSoft : U.tint} />
        <div style={{ flex: 1, ...txt(23, 700) }}>{m.n}</div>
        <Toggle on={1} w={54} />
      </div>
    ))}
  </Phone>
);

export const Act1: React.FC<{ g: number }> = ({ g }) => {
  const gf = T.f("grow"), done = T.f("grow+0.75");
  // the two circles (centre x, y, diameter, opacity), then the one circle that opens into the window
  const A = trk(g, [["open", 650, 300, 250, 0], ["open+0.5", 800, 385, 290, 1, ARRIVE], ["dock", 800, 385, 290, 1], ["dock+0.55", 960, 540, 440, 1, MOVE], ["grow", 960, 540, 452, 1]]);
  const B = trk(g, [["open", 1320, 830, 230, 0], ["open+0.5", 1125, 700, 290, 1, ARRIVE], ["dock", 1125, 700, 290, 1], ["dock+0.55", 960, 540, 440, 1, MOVE], ["grow", 960, 540, 452, 1]]);
  // the window: centre x, y, w, h, radius, scale, opacity
  const M = trk(g, [["grow", 960, 540, 452, 452, 226, 1, 1], ["grow+0.75", 960, 560, W1.w, W1.h, 26, 1, 1, MOVE], ["shift", 960, 560, W1.w, W1.h, 26, 1.065, 1],
    ["shift+0.55", 790, 560, W1.w, W1.h, 26, 0.84, 1, MOVE], ["away", 770, 560, W1.w, W1.h, 26, 0.875, 1], ["away+0.45", 170, 560, W1.w, W1.h, 26, 0.875, 0, OUT]]);
  const chrome = k(g, "grow+0.32", 0.4);
  // the K.B tile and the "Your business" words travel from the circles into the lockup, then into the app bar
  // the K.B tile and the "Your business" words travel from the circles into the lockup, then into the app bar of the
  // opening window (they aim at where the bar is now, so they stay inside the window); the tile leads, the words follow
  const tile0 = trk(g, [["open", 650, 300, 96], ["open+0.5", 800, 385, 120, ARRIVE], ["dock", 800, 385, 120], ["dock+0.55", 960, 478, 126, MOVE], ["grow", 960, 478, 130]]);
  const word0 = trk(g, [["open", 1320, 830, 26], ["open+0.5", 1125, 700, 30, ARRIVE], ["dock", 1125, 700, 30], ["dock+0.55", 960, 604, 36, MOVE], ["grow", 960, 604, 37]]);
  const left = M[0] - M[2] / 2, barY = M[1] - M[3] / 2 + STRIP + BAR / 2, tw = measure(TITLE, 28, 700, -0.01);
  const pT = k(g, "grow", 0.62, MOVE), pW = k(g, "grow+0.13", 0.62, MOVE);
  const tile = [lerp(tile0[0], left + 30 + 23, pT), lerp(tile0[1], barY, pT), lerp(tile0[2], 46, pT)];
  const word = [lerp(word0[0], left + 30 + 46 + 22 + tw / 2, pW), lerp(word0[1], barY, pW), lerp(word0[2], 28, pW)];
  const wordColor = mix(C.navy, C.white, k(g, "grow+0.5", 0.25, MOVE));
  const inBar = g >= done;
  const ph = trk(g, [["open", 2260, 560, 0.9, 1], ["phone", 2260, 560, 0.9, 1], ["phone+0.6", 1500, 560, 0.9, 1, IN], ["away+0.06", 1500, 560, 0.9, 1], ["away+0.5", 900, 560, 0.9, 0, OUT]]);
  const chip = (d: number) => ({ opacity: k(g, off("chips", d), 0.3), transform: `scale(${0.5 + 0.5 * k(g, off("chips", d), 0.45)})` });
  const right = (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={chip(0)}><Avatar size={52} kb ring={C.navy} /></div>
      <div style={{ marginLeft: -12, ...chip(0.12) }}><Avatar size={52} text="You" bg={C.cyan} ring={C.navy} /></div>
    </div>
  );
  return (
    <>
      {g < gf && <>
        <Box x={B[0]} y={B[1]} w={B[2]} h={B[2]} o={B[3]} style={{ borderRadius: "50%", background: C.white, boxShadow: SHADOW.card }} />
        <Box x={A[0]} y={A[1]} w={A[2]} h={A[2]} o={A[3]} style={{ borderRadius: "50%", background: C.white, boxShadow: SHADOW.card }} />
      </>}
      {g >= gf && M[6] > 0 && (
        <Box x={M[0]} y={M[1]} w={M[2]} h={M[3]} s={M[5]} o={M[6]}>
          <div style={{ position: "absolute", inset: 0, borderRadius: M[4], overflow: "hidden", background: U.body, boxShadow: SHADOW.card }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: STRIP, background: U.chrome, opacity: chrome, display: "flex", alignItems: "center", gap: 10, paddingLeft: 26 }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: U.dots }} />)}
            </div>
            <div style={{ position: "absolute", left: 0, top: STRIP, width: "100%", height: BAR, background: C.navy, opacity: chrome }}>
              <div style={{ position: "absolute", left: 30 + 46 + 22 + measure(TITLE, 28, 700, -0.01) + 34, top: 10 }}>{right}</div>
            </div>
            {inBar && <>
              <div style={{ position: "absolute", left: 30, top: STRIP + BAR / 2 - 23 }}><KBTile size={46} shadow="" /></div>
              <div style={{ position: "absolute", left: 30 + 46 + 22, top: STRIP, height: BAR, display: "flex", alignItems: "center", ...txt(28, 700, C.white) }}>{TITLE}</div>
            </>}
            <div style={{ position: "absolute", left: (M[2] - W1.w) / 2, top: STRIP + BAR, width: W1.w, height: W1.h - STRIP - BAR }}><Workspace g={g} /></div>
          </div>
        </Box>
      )}
      {!inBar && <>
        <Box x={tile[0]} y={tile[1]} w={tile[2]} h={tile[2]}><KBTile size={tile[2]} shadow={g < gf ? undefined : ""} /></Box>
        <div style={{ position: "absolute", left: word[0] - measure(TITLE, word[2], 700, -0.01) / 2, top: word[1] - word[2] * 0.6, ...txt(word[2], 700, wordColor), lineHeight: 1.2 }}>{TITLE}</div>
      </>}
      {ph[3] > 0 && g >= T.f("phone") && <Box x={ph[0]} y={ph[1]} w={PHONE.w} h={PHONE.h} s={ph[2]} o={ph[3]}><PhoneWorkspace g={g} /></Box>}
    </>
  );
};

/** "How?": rises out of a blur and leaves upward into the next window. */
export const How: React.FC<{ g: number }> = ({ g }) => {
  const words = [{ t: "How?", at: "how" }];
  return <Line g={g} words={words} x={960 - measure("How?", 250, 800) / 2} y={540 - 150} size={250} weight={800} color={C.navy} out="audit" outDur={0.35} />;
};

export const lerpN = lerp;
