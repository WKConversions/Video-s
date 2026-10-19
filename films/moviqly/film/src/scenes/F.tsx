// Scene F — refine and export (sF → s4): "Refine it right in the chat, then export landscape, portrait, or square."
// The same shot as E, continued (the rig is in ./E): the camera drops to the composer, which types "Make it calmer"
// and sends; the chat scrolls, a short activity "Revised the storyboard" checks and the film restarts, calmer, under a
// light sweep. The cursor clicks Export MP4 (Rendering → Downloaded), opens the format menu and picks Portrait, then
// Square: the canvas morphs 16:9 → 9:16 → 1:1. The square film lifts out of the studio and shrinks into the gradient
// dot at the centre as the studio recedes: the s4 hand-off, a GDot alone on the ground.
import React from "react";
import { ActivityCard, ARRIVE, C, clamp01, Cursor, DemoFilm, ExportButton, f, FONT, GDot, GRAD_D, Ico, kf, LIN, mix, MOVE, POP, Preview, SHADOW, SNAP, typed, UserBubble } from "../shared";
import { ACT, actH, BUB, Burst, camAt, canvasRect, F_SEND, F_UPD, filmS, L, Show, stepIcon, toScreen, Y } from "./E";

const CALM = "Make it calmer";
const Y2 = (() => { const b2 = Y.endE + 16, a2 = b2 + Y.bubH + 14; return { b2, a2, end: a2 + actH(1, 1) + 14 }; })();
const SCROLL = Y2.end - L.chatH;
const A2_IN = F_SEND + 5, A2_WORK = F_SEND + 7, A2_DONE = f("w:chat+0.4");
const CLICK = f("w:export"), REND0 = CLICK + 3, REND1 = f("w:landscape+0.4");
const MENU = f("w:landscape-0.1"), P_AT = f("w:portrait") - 3, Q_AT = f("w:square") - 3;
const DOT0 = f("s4") - 11, DOT1 = f("s4") - 2;
const FORMATS = [{ t: "16:9 · Landscape", ar: 16 / 9 }, { t: "9:16 · Portrait", ar: 9 / 16 }, { t: "1:1 · Square", ar: 1 }];

const press = (g: number, at: number) => kf(g, at, 3, SNAP) - kf(g, at + 3, 6, MOVE);
const lerpAr = (a: number, b: number, t: number) => Math.exp(mix(Math.log(a), Math.log(b), t));
const arAt = (g: number) => lerpAr(lerpAr(16 / 9, 9 / 16, kf(g, P_AT, 11, MOVE)), 1, kf(g, Q_AT, 9, MOVE));
const selAt = (g: number) => (g >= Q_AT ? 2 : g >= P_AT ? 1 : 0);

// the format menu under "16:9 · Landscape ⌄" (pane-local)
const MENU_BOX = { right: 20, top: 46, w: 276, row: 48, pad: 8 };
const menuRowY = (i: number) => L.paneY + MENU_BOX.top + MENU_BOX.pad + MENU_BOX.row * (i + 0.5);
const menuX = L.paneX + L.paneW - MENU_BOX.right - MENU_BOX.w;
const FormatMenu: React.FC<{ g: number }> = ({ g }) => {
  const o = kf(g, MENU, 8, ARRIVE) * (1 - kf(g, Q_AT + 7, 6, MOVE));
  if (o <= 0) return null;
  const sel = selAt(g), cy = curAt(g).y, hover = [0, 1, 2].find((i) => Math.abs(cy - 4 - menuRowY(i)) < MENU_BOX.row / 2) ?? -1;
  return (
    <div style={{ position: "absolute", right: MENU_BOX.right, top: MENU_BOX.top, width: MENU_BOX.w, padding: MENU_BOX.pad, boxSizing: "border-box", background: C.white, borderRadius: 14,
      border: `1px solid ${C.line}`, boxShadow: SHADOW, opacity: o, transformOrigin: "85% 0%", transform: `translateY(${(1 - o) * -10}px) scale(${0.94 + 0.06 * o})`, fontFamily: FONT }}>
      {FORMATS.map((fm, i) => {
        const pk = i === sel ? POP(clamp01((g - (i === 0 ? MENU : i === 1 ? P_AT : Q_AT)) / 6)) : 1;
        const bw = fm.ar >= 1 ? 26 : 26 * fm.ar, bh = fm.ar >= 1 ? 26 / fm.ar : 26;
        return (
          <div key={i} style={{ height: MENU_BOX.row, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", borderRadius: 9, background: i === hover ? C.mist : "transparent" }}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: bw, height: bh, borderRadius: 3, border: `2px solid ${i === sel ? C.violet : C.soft}`, boxSizing: "border-box" }} /></div>
            <div style={{ fontSize: 20, fontWeight: i === sel ? 700 : 500, color: C.ink, flex: 1 }}>{fm.t}</div>
            {i === sel && <div style={{ transform: `scale(${pk})` }}><Ico n="check" s={20} c={C.violet} w={2.8} /></div>}
          </div>
        );
      })}
    </div>
  );
};

// the cursor's path (world): to Export, to the format label, to Portrait, to Square
type CK = { at: number; x: number; y: number };
const CUR: CK[] = [
  { at: f("w:chat+0.1"), x: 1900, y: 720 }, { at: CLICK - 2, x: 1662, y: 108 }, { at: MENU - 2, x: 1694, y: 166 },
  { at: P_AT - 2, x: menuX + 120, y: menuRowY(1) + 4 }, { at: Q_AT - 2, x: menuX + 110, y: menuRowY(2) + 4 }, { at: DOT0, x: menuX + 190, y: menuRowY(2) + 120 },
];
const curAt = (g: number) => {
  if (g <= CUR[0].at) return CUR[0];
  for (let i = 1; i < CUR.length; i++) {
    const a = CUR[i - 1], b = CUR[i];
    if (g <= b.at) { const d = i === 1 ? b.at - a.at : Math.min(12, b.at - a.at), t = (i === 1 ? ARRIVE : MOVE)(clamp01((g - (b.at - d)) / d)); return { at: g, x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) }; }
  }
  return CUR[CUR.length - 1];
};

export const SceneF: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sF") || g >= f("s4")) return null;
  const c = camAt(g);
  // the hand-off: only the dot
  if (g >= DOT1) return <GDot x={960} y={540} r={14} />;

  // refine: type, send, the chat scrolls, the short activity
  const sent = g >= F_SEND;
  const composer = sent ? "" : typed(g, "w:refine-0.05", CALM, 26);
  const scroll = SCROLL * kf(g, F_SEND, 18, MOVE);
  const b2 = kf(g, F_SEND, 12, ARRIVE), a2 = kf(g, A2_IN, 12, ARRIVE);
  const secs = Math.floor(38 * clamp01((g - A2_WORK) / (A2_DONE - A2_WORK)));
  const chatMore = (
    <>
      {b2 > 0 && <div style={{ position: "absolute", right: 6, top: Y2.b2, opacity: b2, transform: `translateY(${(1 - b2) * 90}px)` }}><UserBubble text={CALM} size={BUB} /></div>}
      {a2 > 0 && (
        <div style={{ position: "absolute", left: 0, top: Y2.a2, opacity: a2, transform: `translateY(${(1 - a2) * 60}px)` }}>
          <ActivityCard g={g} w={L.chatW} size={ACT} clock={g >= A2_DONE ? "Worked for 0:38" : `Working 0:${String(secs).padStart(2, "0")}`}
            steps={[{ t: "Revised the storyboard", sub: "Slower pacing, softer easing, longer holds", state: g >= A2_DONE ? 1 : g >= A2_WORK ? 0.5 : 0 }]} />
        </div>
      )}
      {(() => { const p = stepIcon(Y2.a2, 0); return <Burst x={p.x} y={p.y} t={(g - A2_DONE) / 9} />; })()}
    </>
  );

  // export: click → rendering → downloaded
  const pr = press(g, CLICK);
  const exportEl = g < REND0 ? <ExportButton size={19} press={pr} /> : g < REND1 ? <ExportButton size={19} progress={LIN(clamp01((g - REND0) / (REND1 - REND0)))} press={pr} />
    : <div style={{ transform: `scale(${0.9 + 0.1 * POP(clamp01((g - REND1) / 7))})` }}><ExportButton size={19} done /></div>;

  // the canvas: aspect morphs with the menu's picks; the update sweep; the empty slot when the film lifts out
  const ar = arAt(g), sel = selAt(g), cv = canvasRect(ar);
  const sweep = kf(g, F_UPD - 2, 14, LIN);
  const lift = g >= DOT0;
  const paneOver = (
    <>
      {sweep > 0 && sweep < 1 && (
        <div style={{ position: "absolute", left: cv.x, top: cv.y, width: cv.w, height: cv.h, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: cv.w * 0.5, left: mix(-cv.w * 0.5, cv.w, sweep), background: "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)" }} />
        </div>
      )}
      {lift && <div style={{ position: "absolute", left: cv.x, top: cv.y, width: cv.w, height: cv.h, borderRadius: 10, background: C.white, boxShadow: `inset 0 0 0 1px ${C.line}` }} />}
      <FormatMenu g={g} />
    </>
  );
  const cur = curAt(g), co = kf(g, CUR[0].at + 2, 6, LIN) * (1 - kf(g, Q_AT + 6, 7, LIN));
  const cp = Math.max(press(g, CLICK), press(g, MENU - 1), press(g, P_AT - 1), press(g, Q_AT - 1));
  const over = co > 0 ? <Cursor x={cur.x} y={cur.y} press={cp} o={co} /> : null;

  // focus: the chat column softens while the camera is on Export and the formats
  const fog = lift ? 0 : kf(g, f("w:then-0.1"), 14, MOVE) * (1 - kf(g, DOT0 - 2, 4, LIN));
  // the square film lifts out and shrinks into the dot at the centre while the studio recedes
  const worldO = 1 - kf(g, DOT0 - 1, 8, LIN);
  let chip: React.ReactNode = null;
  if (lift) {
    const c0 = camAt(DOT0), sq = canvasRect(1), s0 = toScreen(c0, L.paneX + sq.x + sq.w / 2, L.paneY + sq.y + sq.h / 2), d0 = sq.w * c0.s;
    const t = kf(g, DOT0, DOT1 - DOT0, MOVE), d = Math.exp(mix(Math.log(d0), Math.log(28), t));
    const x = mix(s0.x, 960, ARRIVE(t)), y = mix(s0.y, 540, ARRIVE(t)), dotO = clamp01((t - 0.35) / 0.45);
    chip = (
      <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: mix(10 * c0.s, d / 2, clamp01(t * 1.6)), overflow: "hidden",
        boxShadow: `0 ${20 * (1 - t)}px ${60 * (1 - t) + 14 * t}px rgba(84,42,255,${0.25 + 0.1 * t})` }}>
        <DemoFilm s={filmS(g)} w={d} h={d} />
        <div style={{ position: "absolute", inset: 0, background: GRAD_D, opacity: dotO }} />
      </div>
    );
  }
  return (
    <>
      <Show g={g} c={c} worldO={worldO} scroll={scroll} chatMore={chatMore} composer={composer} caret={g >= f("w:refine-0.2") && !sent} sendPress={press(g, F_SEND - 3)}
        exportEl={exportEl} preview={<Preview w={L.paneW} h={L.paneH} ar={ar} s={filmS(g)} format={FORMATS[sel].t} />} paneOver={paneOver} over={over} />
      {fog > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 1080, opacity: fog, background: "linear-gradient(90deg, rgba(250,249,247,0.9) 0%, rgba(250,249,247,0.75) 45%, rgba(250,249,247,0) 100%)",
          backdropFilter: "blur(5px)", WebkitMaskImage: "linear-gradient(90deg, #000 55%, transparent 100%)", maskImage: "linear-gradient(90deg, #000 55%, transparent 100%)" }} />
      )}
      {chip}
    </>
  );
};
