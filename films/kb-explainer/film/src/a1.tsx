// Act 1 (0–7.2 s): two circles, K.B and "Your business", dock into one lockup; the lockup opens into the business's
// workspace window; Automations switches on, then every module runs; a phone slides in; K.B and You join; "How?".
import React from "react";
import { Easing } from "remotion";
import { T } from "./clock";
import { EASE, Line, Typed, measure, off } from "./kinetic";
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

/** The workspace body (1440 × 684): eight module cards; on "automation" the Automations card fills with cyan, lifts
 *  and shows a big check with a small burst (the reference's module switching on); then every module runs. */
const Workspace: React.FC<{ g: number }> = ({ g }) => {
  const lift = k(g, "auto", 0.5, MOVE), fill = k(g, "auto+0.08", 0.3, MOVE), dim = Math.max(k(g, "auto+0.05", 0.4) * (1 - k(g, "runs", 0.45)), 1.3 * k(g, "chips", 0.4));
  const chk = k(g, "auto+0.26", 0.4), burst = Math.min(1, Math.max(0, (g - T.f("auto+0.28")) / 16));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 684 }}>
      <div style={{ position: "absolute", left: 60, top: 30, opacity: k(g, "cards", 0.4), ...txt(24, 600, C.muted) }}>Workspace</div>
      {MODULES.map((m, i) => {
        const a = k(g, off("cards", 0.05 * i), 0.45);
        if (a <= 0) return null;
        const x = 60 + (i % 4) * 336, y = 76 + Math.floor(i / 4) * 290;
        const isAuto = i === 0;
        const on = isAuto ? 1 : k(g, off("runs", 0.05 * i), 0.28, MOVE);
        const s = isAuto ? 1 + 0.2 * lift : 1;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 312, height: 266, opacity: a * (1 - 0.5 * Math.min(1, dim) * (isAuto ? k(g, "chips", 0.4) : 1)), zIndex: isAuto ? 2 : 1,
            transform: `translateY(${(1 - a) * 40 + (isAuto ? 14 * lift : 0)}px) scale(${s})`, transformOrigin: "50% 50%" }}>
            {isAuto && burst > 0 && burst < 1 && <>
              <div style={{ position: "absolute", inset: -14 - 40 * burst, borderRadius: 26 + 30 * burst, border: `4px solid ${C.cyan}`, opacity: 1 - burst }} />
              {Array.from({ length: 8 }, (_, j) => { const an = (j / 8) * Math.PI * 2 + 0.3, r = 190 + 90 * EASE.lead(burst);
                return <div key={j} style={{ position: "absolute", left: 156 + Math.cos(an) * r - 7, top: 133 + Math.sin(an) * r * 0.85 - 7, width: 14, height: 14, borderRadius: 7,
                  background: j % 2 ? C.navy : C.cyan, opacity: 1 - burst }} />; })}
            </>}
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: isAuto ? mix(C.white, C.cyan, fill) : C.white,
              boxShadow: isAuto ? `0 ${10 + 28 * lift}px ${30 + 36 * lift}px -18px rgba(41,58,81,${0.25 + 0.25 * lift})` : "0 10px 26px -16px rgba(41,58,81,0.25)",
              border: `3px solid ${isAuto ? mix(U.skel, C.cyan, lift) : U.skel}` }} />
            <div style={{ position: "absolute", left: 26, top: 26 }}><IconBox name={m.i} size={64} bg={isAuto ? mix(U.tint, C.white, fill) : U.tint} /></div>
            <div style={{ position: "absolute", left: 26, top: 114, ...txt(28, 700) }}>{m.n}</div>
            <Skel w={190} c={isAuto ? mix(U.skel, "#9FE3FF", fill) : U.skel} style={{ position: "absolute", left: 26, top: 166 }} />
            <Skel w={128} c={isAuto ? mix(U.skel, "#9FE3FF", fill) : U.skel} style={{ position: "absolute", left: 26, top: 190 }} />
            {isAuto ? (
              <div style={{ position: "absolute", right: 22, bottom: 20, opacity: Math.min(1, chk * 1.5), transform: `scale(${0.5 + 0.5 * chk})` }}><Check size={92} bg={C.white} /></div>
            ) : <div style={{ position: "absolute", right: 26, bottom: 26 }}><Toggle on={on} /></div>}
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
  const M = trk(g, [["grow", 960, 540, 452, 452, 226, 1, 1], ["grow+0.75", 960, 560, W1.w, W1.h, 26, 1, 1, MOVE], ["shift-0.1", 960, 560, W1.w, W1.h, 26, 1.02, 1],
    ["shift+0.6", 800, 560, W1.w, W1.h, 26, 0.88, 1, MOVE], ["away", 790, 560, W1.w, W1.h, 26, 0.89, 1], ["away+0.3", 190, 560, W1.w, W1.h, 26, 0.89, 0, OUT]]);
  const chrome = k(g, "grow+0.32", 0.4);
  // the K.B tile and the "Your business" words travel from the circles into the lockup, then into the app bar
  // the K.B tile and the "Your business" words travel from the circles into the lockup, then into the app bar of the
  // opening window (they aim at where the bar is now, so they stay inside the window); the tile leads, the words follow
  const tile0 = trk(g, [["open", 650, 300, 96], ["open+0.5", 800, 385, 120, ARRIVE], ["dock", 800, 385, 120], ["dock+0.55", 960, 478, 126, MOVE], ["grow", 960, 478, 130]]);
  const word0 = trk(g, [["open", 1320, 830, 26], ["open+0.5", 1125, 700, 30, ARRIVE], ["dock", 1125, 700, 30], ["dock+0.55", 960, 604, 36, MOVE], ["grow", 960, 604, 37]]);
  const left = M[0] - M[2] / 2, barY = M[1] - M[3] / 2 + STRIP + BAR / 2;
  const pT = k(g, "grow", 0.62, MOVE);
  const tile = [lerp(tile0[0], left + 30 + 23, pT), lerp(tile0[1], barY, pT), lerp(tile0[2], 46, pT)];
  // the words stay in the circle and fade as it opens; the bar types them fresh
  const word = word0, wordO = 1 - k(g, "grow", 0.25, MOVE);
  const inBar = g >= done;
  const ph = trk(g, [["open", 2260, 560, 0.9, 1], ["phone", 2260, 560, 0.9, 1], ["phone+0.6", 1500, 560, 0.9, 1, IN], ["away", 1500, 560, 0.9, 1], ["away+0.3", 900, 560, 0.9, 0, OUT]]);
  // "with you": K.B drops in from above, You rises from below; they meet over the workspace and leave with it
  const kbP = trk(g, [["chips", 700, -110], ["chips+0.5", 700, 545, IN], ["away", 712, 545], ["away+0.3", 112, 545, OUT]]);
  const youP = trk(g, [["chips+0.08", 880, 1190], ["chips+0.58", 880, 545, IN], ["away", 892, 545], ["away+0.3", 292, 545, OUT]]);
  const pairO = 1 - k(g, "away", 0.3, OUT);
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
            <div style={{ position: "absolute", left: 0, top: STRIP, width: "100%", height: BAR, background: C.navy, opacity: chrome }} />
            <div style={{ position: "absolute", left: 30 + 46 + 22, top: STRIP, height: BAR, display: "flex", alignItems: "center", ...txt(28, 700, C.white) }}>
              <Typed g={g} text={TITLE} at="grow+0.5" cps={28} caret={false} />
            </div>
            {inBar && <div style={{ position: "absolute", left: 30, top: STRIP + BAR / 2 - 23 }}><KBTile size={46} /></div>}
            <div style={{ position: "absolute", left: (M[2] - W1.w) / 2, top: STRIP + BAR, width: W1.w, height: W1.h - STRIP - BAR }}><Workspace g={g} /></div>
          </div>
        </Box>
      )}
      {!inBar && <>
        <Box x={tile[0]} y={tile[1]} w={tile[2]} h={tile[2]} o={A[3]}><KBTile size={tile[2]} /></Box>
        {wordO > 0 && <div style={{ position: "absolute", left: word[0] - measure(TITLE, word[2], 700, -0.01) / 2, top: word[1] - word[2] * 0.6, opacity: wordO * B[3], ...txt(word[2], 700, C.navy), lineHeight: 1.2 }}>{TITLE}</div>}
      </>}
      {ph[3] > 0 && g >= T.f("phone") && <Box x={ph[0]} y={ph[1]} w={PHONE.w} h={PHONE.h} s={ph[2]} o={ph[3]}><PhoneWorkspace g={g} /></Box>}
      {g >= T.f("chips") && pairO > 0 && <>
        <Box x={kbP[0]} y={kbP[1]} w={150} h={150} o={pairO}><KBTile size={150} /></Box>
        <Box x={youP[0]} y={youP[1]} w={150} h={150} o={pairO}><Avatar size={150} text="You" bg={C.cyan} ring={C.white} /></Box>
      </>}
    </>
  );
};

/** "How?": rises out of a blur and leaves upward into the next window. */
export const How: React.FC<{ g: number }> = ({ g }) => {
  const words = [{ t: "How?", at: "how" }];
  return <Line g={g} words={words} x={960 - measure("How?", 250, 800, -0.02) / 2} y={540 - 150} size={250} weight={800} color={C.navy} ls={-0.02} out="audit-0.18" outDur={0.25} />;
};

export const lerpN = lerp;
