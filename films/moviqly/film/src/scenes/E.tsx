// Scene E — showcase, live (s3 → sF): "Watch every step happen live and get your film in just minutes."
// The brief is sent: the prompt box flies into the studio, which grows out around it, and lands as the user's bubble.
// The camera pushes in on the chat: the activity card runs live (spin → check, the clock running) and the storyboard
// fills while the canvas is "creating"; the progress bar opens into the film, which plays big; the pull-back shows the
// whole studio and "Worked for 4:20". This file also holds the studio rig (layout, camera, chat, preview) that scene F
// continues from, so the two scenes are one continuous shot.
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { ActivityCard, ARRIVE, C, clamp01, DEPART, f, kf, LIN, mix, MOVE, Preview, PromptBox, SendButton, SNAP, StoryboardCard, Studio, STUDIO, studioPane, UserBubble } from "../shared";
import type { Step } from "../shared";

/* ---------- the studio in world coordinates (camera identity = the screen) ---------- */
const PANE = studioPane();
export const L = {
  chatX: STUDIO.x + 18, chatY: STUDIO.y + STUDIO.bar + 36, chatW: STUDIO.chatW - 18, chatH: STUDIO.h - STUDIO.bar - 18 - 36 - 132,
  paneX: STUDIO.x + STUDIO.chatW, paneY: STUDIO.y + STUDIO.bar, paneW: PANE.w, paneH: PANE.h,
  compX: STUDIO.x + 18, compY: STUDIO.y + STUDIO.h - 18 - 118, compW: STUDIO.chatW - 18, compH: 118,
};
// The preview canvas rect inside the pane for an aspect (the Preview's own layout).
export const canvasRect = (ar: number) => {
  const top = 56, bottom = 70, availW = L.paneW - 80, availH = L.paneH - top - bottom - 50;
  const w = Math.min(availW, availH * ar), h = w / ar;
  return { x: (L.paneW - w) / 2, y: top + (availH - h) / 2 + 10, w, h };
};

/* ---------- the camera: one path for E and F (world point x,y at the screen centre, scale s) ---------- */
export type Cam = { x: number; y: number; s: number };
type Key = { at: number; c: Cam; e?: (t: number) => number };
const cm = (x: number, y: number, s: number): Cam => ({ x, y, s });
export const CAM: Key[] = [
  { at: f("s3+0.15"), c: cm(960, 540, 1) },                 // the s3 state: the brief, the send press
  { at: f("w:step+0.15"), c: cm(780, 516, 1.4) },           // push in: the chat runs, the canvas is creating
  { at: f("w:and4"), c: cm(772, 548, 1.46), e: LIN },        // drift down with the steps and the storyboard
  { at: f("w:film+0.15"), c: cm(1236, 541, 1.62) },          // over to the film
  { at: f("w:minutes-0.1"), c: cm(1236, 541, 1.68), e: LIN },
  { at: f("sF-0.1"), c: cm(960, 540, 1.12) },                // pull back: the whole studio, "Worked for 4:20"
  // scene F
  { at: f("w:refine+0.3"), c: cm(745, 680, 1.55) },          // down to the composer: "Make it calmer"
  { at: f("w:chat+0.1"), c: cm(752, 690, 1.6), e: LIN },
  { at: f("w:export-0.13"), c: cm(1065, 482, 1.3) },         // the header's Export, the format menu, the canvas
  { at: f("w:portrait-0.35"), c: cm(1068, 485, 1.31), e: LIN },
  { at: f("w:portrait+0.05"), c: cm(1062, 497, 1.25) },      // a touch wider: room for the tall canvas
  { at: f("s4-0.4"), c: cm(1066, 500, 1.27), e: LIN },
  { at: f("s4-0.07"), c: cm(1080, 505, 0.92), e: DEPART },   // the studio recedes while the film becomes the dot
];
export const camAt = (g: number, keys: Key[] = CAM): Cam => {
  if (g <= keys[0].at) return keys[0].c;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (g <= b.at) {
      const t = (b.e ?? MOVE)(clamp01((g - a.at) / Math.max(1, b.at - a.at)));
      return { x: mix(a.c.x, b.c.x, t), y: mix(a.c.y, b.c.y, t), s: Math.exp(mix(Math.log(a.c.s), Math.log(b.c.s), t)) };
    }
  }
  return keys[keys.length - 1].c;
};
export const toScreen = (c: Cam, x: number, y: number) => ({ x: 960 + (x - c.x) * c.s, y: 540 + (y - c.y) * c.s });
export const World: React.FC<{ c: Cam; o?: number; children: React.ReactNode }> = ({ c, o = 1, children }) => (
  <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})`, opacity: o }}>{children}</AbsoluteFill>
);

/* ---------- the chat column's content (chat-local coordinates; heights from the kit's own styles) ---------- */
export const ACT = 20, SB = 17, BUB = 20;
export const actH = (n: number, subs = 0) => 2 + ACT * (2.2 + 1.302 + 0.9) + n * ACT * 1.302 + (n - 1) * ACT * 0.8 + subs * ACT * (0.15 + 0.8 * 1.35);
const sbH = 2 + SB * (2 + 1.1 * 1.302 + 0.8) + 6 * SB * 2.925 + 5 * SB * 0.6;
const BUBH = BUB * 2.55;
export const Y = (() => { const b1 = 12, a1 = b1 + BUBH + 16, sb = a1 + actH(7) + 16; return { b1, a1, sb, endE: sb + sbH, bubH: BUBH }; })();
// the centre of step i's status icon inside an activity card at chat-local y = top
export const stepIcon = (top: number, i: number) => ({ x: 1 + ACT * 1.1 + ACT * 0.575, y: top + 1 + ACT * 1.1 + ACT * 1.302 + ACT * 0.9 + i * ACT * (1.302 + 0.8) + ACT * 0.08 + ACT * 0.575 });
// a check landing: a violet ring bursting out of the icon (POP feel)
export const Burst: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t <= 0 || t >= 1) return null;
  const r = ACT * (0.6 + 0.9 * ARRIVE(t));
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${2.5 * (1 - t) + 0.5}px solid ${C.violet}`, opacity: 1 - t, boxSizing: "border-box" }} />;
};

/* ---------- E's timing (all from the clock's labels) ---------- */
const S3 = f("s3");
export const BRIEF = "Make a 25 second video about our launch.";
const STEPS = ["Read lumo.app", "Understood Lumo", "Wrote the story", "Art direction", "Storyboard ready: 6 scenes", "Checked facts", "Rendered the video"];
const W0 = f("s3+0.7");                                     // the first step starts
const DONE = [f("w:step"), f("w:happen"), f("w:happen+0.2"), f("w:live"), f("w:live+0.2"), f("w:and4+0.07"), f("w:film")];
const A1_IN = f("s3+0.5");                                  // the activity card arrives
export const F_REV = f("w:film-0.2");                       // the progress bar opens into the film
export const F_SEND = f("w:right+0.2");                     // (F) "Make it calmer" is sent
export const F_UPD = f("w:chat+0.47");                      // (F) the film is updated: it restarts, calmer
export const filmS = (g: number) => (g < F_UPD ? (g - F_REV) / 30 : ((g - F_UPD) / 30) * 0.75);

const eSteps = (g: number): Step[] => STEPS.map((t, i) => {
  const a = i === 0 ? W0 : DONE[i - 1] - 1;
  return { t, state: g >= DONE[i] ? 1 : g >= a ? 0.5 : 0 };
});
const clockE = (g: number) => {
  if (g >= DONE[6]) return "Worked for 4:20";
  const sec = Math.floor(259 * Math.pow(clamp01((g - W0) / (DONE[6] - W0)), 1.7));
  return `Working ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
};

/* ---------- the flight: the prompt box becomes the user's bubble ---------- */
const BOX = { x: 460, y: 454, w: 1000, s: 1000 / 900 };
const BOX_TXT = { x: BOX.x + 1 + 26 * BOX.s, y: BOX.y + 1 + 24 * BOX.s };
const B1W = 418;
const B1 = { x: L.chatX + L.chatW - 6 - B1W, y: L.chatY + Y.b1 };
const B1_TXT = { x: B1.x + 0.85 * BUB, y: B1.y + 0.6 * BUB };
const TXT_K = BUB / (30 * BOX.s);                            // the bubble's text size over the box's
const FLY0 = f("s3+0.2"), FLY_D = 22, FLY_EASE = Easing.bezier(0.45, 0, 0.15, 1);
const press = (g: number, at: number) => kf(g, at, 4, SNAP) - kf(g, at + 4, 6, MOVE);

const Bubble1: React.FC = () => <UserBubble text={BRIEF} size={BUB} style={{ width: B1W, boxSizing: "border-box", whiteSpace: "nowrap" }} />;

const Flight: React.FC<{ g: number }> = ({ g }) => {
  if (g >= FLY0 + FLY_D) return null;
  const p = kf(g, FLY0, FLY_D, FLY_EASE);
  const ax = mix(BOX_TXT.x, B1_TXT.x, p), ay = mix(BOX_TXT.y, B1_TXT.y, p) - Math.sin(Math.PI * p) * 40, sc = mix(1, TXT_K, p);
  const boxO = 1 - clamp01((p - 0.22) / 0.22), bubO = clamp01((p - 0.3) / 0.2);
  return (
    <>
      {boxO > 0 && (
        <div style={{ position: "absolute", left: BOX.x, top: BOX.y, opacity: boxO, transformOrigin: `${BOX_TXT.x - BOX.x}px ${BOX_TXT.y - BOX.y}px`,
          transform: `translate(${ax - BOX_TXT.x}px, ${ay - BOX_TXT.y}px) scale(${sc})` }}>
          <PromptBox w={BOX.w} text={BRIEF} press={press(g, S3)} />
        </div>
      )}
      {bubO > 0 && (
        <div style={{ position: "absolute", left: B1.x, top: B1.y, opacity: bubO, transformOrigin: `${B1_TXT.x - B1.x}px ${B1_TXT.y - B1.y}px`,
          transform: `translate(${ax - B1_TXT.x}px, ${ay - B1_TXT.y}px) scale(${sc / TXT_K})` }}>
          <Bubble1 />
        </div>
      )}
    </>
  );
};

/* ---------- E's chat: the bubble, the live activity, the storyboard ---------- */
export const EChat: React.FC<{ g: number }> = ({ g }) => {
  const a = kf(g, A1_IN, 12, ARRIVE), sbIn = kf(g, DONE[4], 10, ARRIVE), sbP = kf(g, DONE[4] + 2, 24, LIN);
  return (
    <>
      {g >= FLY0 + FLY_D && <div style={{ position: "absolute", left: B1.x - L.chatX, top: Y.b1 }}><Bubble1 /></div>}
      {a > 0 && (
        <div style={{ position: "absolute", left: 0, top: Y.a1, opacity: a, transform: `translateY(${(1 - a) * 60}px)` }}>
          <ActivityCard g={g} steps={eSteps(g)} clock={clockE(g)} w={L.chatW} size={ACT} />
        </div>
      )}
      {DONE.map((d, i) => { const p = stepIcon(Y.a1, i); return <Burst key={i} x={p.x} y={p.y} t={(g - d) / 9} />; })}
      {sbIn > 0 && (
        <div style={{ position: "absolute", left: 0, top: Y.sb, opacity: sbIn, transform: `translateY(${(1 - sbIn) * 50}px)` }}>
          <StoryboardCard p={sbP} w={L.chatW} size={SB} />
        </div>
      )}
    </>
  );
};

/* ---------- the preview: "creating" with progress, then the bar opens into the film ---------- */
const BAR = (() => {
  const cv = canvasRect(16 / 9), title = Math.max(18, cv.w * 0.035) * 1.302, label = Math.max(12, cv.w * 0.016) * 1.302, stack = title + 10 + label + 10 + 10 + 6;
  const w = cv.w * 0.34;
  return { x: cv.x + (cv.w - w) / 2, y: cv.y + (cv.h - stack) / 2 + title + 10 + label + 20, w, h: 6 };
})();
const EPreview: React.FC<{ g: number }> = ({ g }) => {
  const prog = MOVE(clamp01((g - W0) / (F_REV - 2 - W0))) * 0.9 + 0.1 * clamp01((g - W0) / (F_REV - 2 - W0));
  const r = kf(g, F_REV, 14, LIN);
  const empty = <Preview w={L.paneW} h={L.paneH} ar={16 / 9} s={-1} empty="CREATING YOUR MOTION…" progress={prog} />;
  if (r <= 0) return empty;
  const film = <Preview w={L.paneW} h={L.paneH} ar={16 / 9} s={filmS(g)} />;
  if (r >= 1) return film;
  const cv = canvasRect(16 / 9), rx = ARRIVE(clamp01(r / 0.5)), ry = MOVE(clamp01((r - 0.2) / 0.8));
  const x = mix(BAR.x, cv.x, rx), w = mix(BAR.w, cv.w, rx), y = mix(BAR.y, cv.y, ry), h = mix(BAR.h, cv.h, ry);
  return (
    <>
      {empty}
      <div style={{ position: "absolute", left: cv.x, top: cv.y, width: cv.w, height: cv.h, borderRadius: 10, background: C.paper, opacity: clamp01(r / 0.25) }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${y}px ${L.paneW - x - w}px ${L.paneH - y - h}px ${x}px round ${mix(3, 10, r)}px)` }}>{film}</div>
    </>
  );
};

/* ---------- the whole studio, for any frame of E and F ---------- */
export type ShowProps = {
  g: number; c?: Cam; worldO?: number; scroll?: number; chatMore?: React.ReactNode; composer?: string; caret?: boolean; sendPress?: number;
  exportEl?: React.ReactNode; preview?: React.ReactNode; paneOver?: React.ReactNode; over?: React.ReactNode;
};
export const Show: React.FC<ShowProps> = ({ g, c = camAt(g), worldO = 1, scroll = 0, chatMore, composer = "", caret = false, sendPress = 0, exportEl, preview, paneOver, over }) => {
  if (worldO <= 0) return null;
  const rv = kf(g, S3 + 3, 22, ARRIVE);                      // the studio grows out of the prompt box
  const clip = rv < 1 ? `inset(${(BOX.y - STUDIO.y) * (1 - rv)}px ${(STUDIO.x + STUDIO.w - BOX.x - BOX.w) * (1 - rv)}px ${(STUDIO.y + STUDIO.h - BOX.y - 173) * (1 - rv)}px ${(BOX.x - STUDIO.x) * (1 - rv)}px round ${mix(29, 22, rv)}px)` : undefined;
  // the clock pill on "minutes" and the composer's focus glow inviting the refine (they carry on into F)
  const pill = kf(g, f("w:minutes"), 8, ARRIVE) * (1 - kf(g, f("sF+0.35"), 8, MOVE));
  const glow = kf(g, f("w:minutes+0.35"), 10, MOVE) * (1 - kf(g, F_SEND, 6, MOVE));
  return (
    <World c={c} o={worldO}>
      <Studio g={g} s={mix(0.96, 1, rv)} o={clamp01(rv * 5)} style={clip ? { clipPath: clip } : undefined} composer={composer} composerCaret={caret} exportEl={exportEl}
        chat={<div style={{ position: "absolute", left: 0, top: 0, width: L.chatW, transform: `translateY(${-scroll}px)` }}><EChat g={g} />{chatMore}</div>}
        preview={<>{preview ?? <EPreview g={g} />}{paneOver}</>} />
      {pill > 0 && (
        <div style={{ position: "absolute", left: L.chatX + L.chatW - 23 - 132, top: L.chatY + Y.a1 - scroll + 1 + ACT * 1.1 + ACT * 0.651 - 16, width: 144, height: 32, borderRadius: 16,
          background: C.lavender, mixBlendMode: "multiply", opacity: pill, transform: `scale(${0.7 + 0.3 * pill})` }} />
      )}
      {glow > 0 && (
        <div style={{ position: "absolute", left: L.compX - 1, top: L.compY - 1, width: L.compW + 2, height: L.compH + 2, borderRadius: 19, boxSizing: "border-box",
          border: `2px solid rgba(152,42,255,${0.75 * glow})`, boxShadow: `0 0 ${16 + 8 * Math.sin(g / 4)}px rgba(48,71,255,${0.35 * glow})` }} />
      )}
      {sendPress > 0 && <div style={{ position: "absolute", left: L.compX + L.compW - 1 - 14 - 36, top: L.compY + L.compH - 1 - 12 - 36 }}><SendButton size={36} press={sendPress} /></div>}
      <Flight g={g} />
      {over}
    </World>
  );
};

export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("s3") || g >= f("sF")) return null;
  return <Show g={g} />;
};
