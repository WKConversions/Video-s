// Scene I — "Your film plays beside the chat." (h3 → sJ, builder 4; plan/storyboard.md).
// Starts on Handoff3 (the reviewed frame alone at the canvas rect, the film at 1.6 s). The film keeps playing
// (filmClock) and never moves while the studio assembles around it from depth: on "film" the preview pane surfaces,
// on "plays" the studio window (header, chat column, composer); on "beside the chat" the chat fills, ChatReady's rows
// landing in turn. Also holds the local helpers the studio scenes I–L share (exported, used by J, K and L).
import React from "react";
import { Easing } from "remotion";
import {
  Activity, BRIEF, C, CRAFT, FJ_SCENES, FONT, FjFilm, FjFrame, LAND, Preview, SHADOW, SNAP, STUDIO, Studio, UserBubble,
  canvasRect, Handoff3, clamp01, f, filmClock, k, mix, studioPane, surface,
} from "../shared";

// a depth move that starts at once and settles long (between CRAFT and LAND)
export const DEPTH = Easing.bezier(0.45, 0.15, 0.2, 1);

/* ---------- shared local geometry of the default Studio (frame px) ---------- */
export const PANE = { x: STUDIO.x + STUDIO.chatW, y: STUDIO.y + STUDIO.bar, ...studioPane() };
export const CHAT = { x: STUDIO.x + 18, y: STUDIO.y + STUDIO.bar + 36, w: 524, h: STUDIO.h - STUDIO.bar - 18 - 36 - 132 };
export const COMPOSER = { x: STUDIO.x + 18, y: STUDIO.y + STUDIO.h - 18 - 118, w: STUDIO.chatW - 36, h: 118 };
// The canvas's rect on the frame as the Studio draws it (canvasRect plus the pane's 1 px border).
export const canvasAt = (ar: number, b = 1) => { const r = canvasRect(ar); return { x: r.x + b, y: r.y + b, w: r.w, h: r.h }; };
export const CANVAS_SHADOW = "0 0 0 1px #E9E0F0, 0 16px 70px #5d3d7c14";
export type Rect = { x: number; y: number; w: number; h: number };

// surface() that leaves no transform behind once landed (so a landed element equals the plain one).
export const surf = (p: number, from = 0.82): React.CSSProperties => (p >= 1 ? {} : surface(p, from));

// A soft paper veil over the studio while one object stands forward (focus by depth; gone when it settles back).
export const Veil: React.FC<{ a: number }> = ({ a }) => (a <= 0.001 ? null : <div style={{ position: "absolute", left: -80, top: -80, right: -80, bottom: -80, background: `rgba(246,244,241,${a})` }} />);

// The Studio's preview container, drawn on its own (same box, same border) so it can surface separately.
export const PaneBox: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", left: PANE.x, top: PANE.y, width: PANE.w, height: PANE.h, background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, overflow: "hidden", fontFamily: FONT, ...style }}>{children}</div>
);

// The playing Fjello film for a frame (filmClock); around "w:updates" the punchy film crossfades into the calm one.
export const filmNode = (g: number, w: number, h: number) => {
  const fc = filmClock(g), up = f("w:updates"), x = clamp01((g - up) / 8);
  if (g < up || x >= 1) return <FjFilm s={fc.s} w={w} h={h} calm={fc.calm} />;
  return (
    <>
      <FjFilm s={fc.s} w={w} h={h} calm />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - SNAP(x) }}><FjFilm s={1.6 + (g - f("h3")) / 30} w={w} h={h} /></div>
    </>
  );
};

// The canvas as a free object on the frame (exactly the Preview's canvas box when lift = 0).
export const CanvasCard: React.FC<{ r: Rect; lift?: number; children?: React.ReactNode }> = ({ r, lift = 0, children }) => (
  <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 6, overflow: "hidden", background: C.white,
    boxShadow: lift > 0 ? `${CANVAS_SHADOW}, 0 ${40 * lift}px ${110 * lift}px -${30 * lift}px rgba(60,40,110,${0.45 * lift})` : CANVAS_SHADOW,
    transform: lift > 0 ? `scale(${1 + 0.05 * lift})` : undefined }}>{children}</div>
);

// A chat column whose rows can land one by one (layout identical to ChatReady / ChatCalmer).
export type Row = { node: React.ReactNode; p?: number; end?: boolean; hide?: boolean; style?: React.CSSProperties };
export const ChatRows: React.FC<{ rows: Row[]; style?: React.CSSProperties }> = ({ rows, style }) => (
  <div style={{ position: "absolute", left: 0, top: 6, width: 524, display: "flex", flexDirection: "column", gap: 16, ...style }}>
    {rows.map((r, i) => <div key={i} style={{ alignSelf: r.end ? "flex-end" : undefined, visibility: r.hide ? "hidden" : undefined, ...surf(r.p ?? 1), ...r.style }}>{r.node}</div>)}
  </div>
);
export const Summary: React.FC<{ text: string }> = ({ text }) => <div style={{ fontSize: 17, lineHeight: 1.45, color: C.label }}>{text}</div>;
export const READY_SUM = "Your 30-second film is ready: 7 scenes, punchy motion, built from fjello.com.";
export const CALM_SUM = "Your film is updated: 6 scenes, smooth motion.";

// The storyboard card (StoryboardCard's exact markup) morphing from the punchy board (u 0) to the calm one (u 1):
// the header changes, the Showcase row slides out and closes up, the durations tick up, the thumbnails turn calm.
export const SbCard: React.FC<{ u: number; p?: number; w?: number; size?: number; shadow?: string; style?: React.CSSProperties }> = ({ u, p = 1, w = 524, size = 17, shadow, style }) => {
  const hd = SNAP(clamp01(u / 0.25)), out = CRAFT(clamp01((u - 0.05) / 0.55)), tick = clamp01((u - 0.2) / 0.7), th = clamp01((u - 0.1) / 0.5);
  const rows = FJ_SCENES.map((s, i) => ({ ...s, i })).filter((s) => u < 1 || s.calm > 0);
  const hdrTxt = (calm: boolean) => <div style={{ fontFamily: FONT, fontSize: size * 0.8, color: C.muted, whiteSpace: "nowrap" }}>{calm ? "6 scenes · 30 s · smooth motion" : "7 scenes · 30 s · punchy motion"}</div>;
  return (
    <div style={{ width: w, background: "linear-gradient(125deg,#FCFAFF,#F7F9FF)", borderRadius: size * 0.75, border: `1px solid ${C.card}`, boxShadow: shadow ?? SHADOW, padding: size * 0.9, boxSizing: "border-box", ...style }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: size * 0.6, marginBottom: size * 0.8 }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size * 1.05, color: C.ink }}>Storyboard</div><div style={{ flex: 1 }} />
        {hd <= 0 ? hdrTxt(false) : hd >= 1 ? hdrTxt(true)
          : <div style={{ display: "grid", justifyItems: "end" }}><div style={{ gridArea: "1/1", opacity: 1 - hd, filter: `blur(${hd * 4}px)` }}>{hdrTxt(false)}</div><div style={{ gridArea: "1/1", opacity: hd, filter: `blur(${(1 - hd) * 4}px)` }}>{hdrTxt(true)}</div></div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: size * 0.55 }}>
        {rows.map((s, j) => {
          const r = p >= 1 ? 1 : LAND(clamp01(p * rows.length - j));
          const gone = s.calm === 0;
          const val = mix(s.dur, s.calm, SNAP(tick));
          const dur = gone ? String(s.dur) : tick <= 0 ? String(s.dur) : tick >= 1 ? String(s.calm) : val.toFixed(1);
          const th1 = <FjFrame i={s.i} w={size * 4.4} h={size * 2.475} t={1} />, th2 = <FjFrame i={s.i} w={size * 4.4} h={size * 2.475} t={1} calm />;
          const rowEl = (
            <div style={{ display: "flex", gap: size * 0.8, alignItems: "center", opacity: gone ? r * (1 - out) : r, transform: gone ? `translateX(${out * size * 6}px) scale(${0.94 + 0.06 * r})` : `scale(${0.94 + 0.06 * r})`, transformOrigin: "0 50%", filter: r < 1 || (gone && out > 0) ? `blur(${(1 - r) * 6 + (gone ? out * 6 : 0)}px)` : undefined }}>
              <div style={{ width: size * 4.4, height: size * 2.475, borderRadius: size * 0.3, overflow: "hidden", flex: "none", position: "relative", boxShadow: `0 0 0 1px ${C.line}` }}>
                {gone ? th1 : th <= 0 ? th1 : th >= 1 ? th2 : <><div style={{ position: "absolute", inset: 0 }}>{th1}</div><div style={{ position: "absolute", inset: 0, opacity: th }}>{th2}</div></>}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: size * 0.6, letterSpacing: "0.08em", textTransform: "uppercase", color: !gone && tick > 0 && tick < 1 ? C.violet : C.soft, fontVariantNumeric: tick > 0 && tick < 1 ? "tabular-nums" : undefined }}>{s.type} · {dur} s</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: size * 0.9, color: C.ink, marginTop: size * 0.08, whiteSpace: "nowrap" }}>{s.copy}</div>
              </div>
            </div>
          );
          // the Showcase row closes up: its height and its gap go to 0 while it slides out
          if (gone && u > 0) return <div key={s.i} style={{ height: size * 2.475 * (1 - out), marginTop: -size * 0.55 * out, overflow: "visible" }}>{rowEl}</div>;
          return <React.Fragment key={s.i}>{rowEl}</React.Fragment>;
        })}
      </div>
    </div>
  );
};

/* ---------- scene I ---------- */
export const SceneI: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h3") || g >= f("sJ")) return null;
  if (g === f("h3")) return <Handoff3 />;   // the hand-off, exactly
  const fc = filmClock(g);
  const r0 = canvasRect(16 / 9);
  // the pane surfaces on "film", the window on "plays" (both from depth, scaled about the fixed canvas)
  const pp = k(g, "w:your5", 0.85, DEPTH), pw = k(g, "w:plays-0.12", 0.9, DEPTH);
  // the canvas creeps the pane's 1 px border into place while the pane arrives
  const cr = { x: r0.x + pp, y: r0.y + pp, w: r0.w, h: r0.h };
  const ox = cr.x + cr.w / 2, oy = cr.y + cr.h / 2;
  const at = (cx: number, cy: number, x: number, y: number) => `${cx - x}px ${cy - y}px`;
  // the chat fills on "beside the chat": the brief, the folded activity, the storyboard (rows cascade), the summary
  const pb = k(g, "w:beside", 0.55), pa = k(g, "w:beside+0.2", 0.55), ps = k(g, "w:the3-0.08", 0.5), sb = k(g, "w:the3", 0.85, CRAFT), pm = k(g, "w:chat+0.2", 0.5);
  const chat = (
    <ChatRows rows={[
      { node: <UserBubble text={BRIEF} size={18} />, end: true, p: pb },
      { node: <Activity g={g} clock="Worked for 3:48" fold="11 steps" w={524} size={17} card={false} />, p: pa },
      { node: <SbCard u={0} p={sb} />, p: ps },
      { node: <Summary text={READY_SUM} />, p: pm },
    ]} />
  );
  const preview = <Preview w={PANE.w} h={PANE.h} ar={16 / 9} s={fc.s} calm={fc.calm} content={filmNode(g, canvasAt(16 / 9).w, canvasAt(16 / 9).h)} />;
  if (pp >= 1 && pw >= 1) {
    return <><Studio g={g} chat={chat} preview={preview} /><CanvasCard r={canvasAt(16 / 9)}>{filmNode(g, cr.w, cr.h)}</CanvasCard></>;
  }
  const sw = surface(pw, 0.76), sp = surface(pp, 0.93);
  return (
    <>
      {pw > 0 && <Studio g={g} chat={chat} style={{ ...sw, transformOrigin: at(ox, oy, STUDIO.x, STUDIO.y) }} />}
      {pp > 0 && <PaneBox style={{ ...sp, transformOrigin: at(ox, oy, PANE.x, PANE.y) }}>{preview}</PaneBox>}
      <CanvasCard r={cr}>{filmNode(g, cr.w, cr.h)}</CanvasCard>
    </>
  );
};
