// Scene J — "Type 'make it calmer'. The storyboard updates." (sJ → sK, builder 4; plan/storyboard.md).
// On "Type" the composer lifts forward (big enough to read) and types "make it calmer" on the words, with the caret;
// send presses and the composer settles back. The chat moves on to ChatCalmer's layout: the old turn recedes, the
// bubble lands, the activity works briefly ("Working 0:08") and folds ("Worked for 1:12 · 5 steps"). On "The
// storyboard" the card lifts forward out of the chat (≈ 1.8×, deep shadow); on "updates" the Showcase row slides out,
// the durations tick up, the header becomes "6 scenes · 30 s · smooth motion" and the preview's film turns calm; the
// card goes back into its place by sK. Ends on the studio with ChatCalmer and the calm 16:9 film.
import React from "react";
import { Activity, BRIEF, C, CRAFT, FONT, Ico, LAND, Preview, SNAP, SendButton, Studio, UserBubble, clamp01, f, filmClock, k, kf, mix } from "../shared";
import { CALM_SUM, CHAT, COMPOSER, ChatRows, PANE, READY_SUM, SbCard, Summary, Veil, canvasAt, filmNode } from "./I";

// the storyboard card's top-left in the chat (same slot in ChatReady and ChatCalmer)
export const CARD = { x: CHAT.x, y: 304.4 };
const LIFT = { x: 138, y: 294, s: 1.78 };
const CMP = { x: 104, y: 813, s: 1.55 };

// The composer (Studio's exact markup) as a free object: text, caret, send press.
const Composer: React.FC<{ g: number; text: string; caret: boolean; press: number }> = ({ g, text, caret, press }) => (
  <div style={{ width: COMPOSER.w, height: COMPOSER.h, background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, padding: "14px 16px", boxSizing: "border-box", position: "relative", fontFamily: FONT }}>
    <div style={{ fontSize: 19, color: text ? C.ink : C.soft }}>{text || "Describe your next idea…"}{caret && <span style={{ display: "inline-block", width: 2, height: 22, marginLeft: 2, verticalAlign: "-4px", background: C.blue, opacity: Math.floor(g / 9) % 2 === 0 ? 1 : 0 }} />}</div>
    <div style={{ position: "absolute", left: 16, bottom: 12, display: "flex", gap: 10 }}>{["clip", "mic"].map((n) => <div key={n} style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={n} s={17} c={C.white} /></div>)}</div>
    <div style={{ position: "absolute", right: 14, bottom: 12 }}><SendButton size={36} press={press} /></div>
  </div>
);

// "make it calmer" typed on the voice: each word's letters land across its first frames.
const typedCalmer = (g: number) => {
  const words: [string, string, number][] = [["make", "w:make", 5], ["it", "w:it3", 3], ["calmer", "w:calmer", 8]];
  let out = "";
  words.forEach(([w, at, d], i) => {
    const n = Math.max(0, Math.min(w.length, Math.ceil(((g - f(at) + 1) / d) * w.length)));
    if (n > 0) out += (i ? " " : "") + w.slice(0, n);
  });
  return out;
};

const recede = (o: number): React.CSSProperties => (o <= 0 ? {} : o >= 1 ? { opacity: 0 } : { transform: `translateY(${-34 * o}px) scale(${mix(1, 0.9, o)})`, opacity: 1 - o, filter: `blur(${o * 8}px)` });

export const SceneJ: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sJ") || g >= f("sK")) return null;
  const fc = filmClock(g), cv = canvasAt(16 / 9);
  const sendF = f("w:calmer+0.55");
  // the composer: lifts on "Type", types on the words, send presses, settles back
  // (it comes forward in two steps: half-way on "Type", all the way as the words start on "make")
  const lift = (0.45 * k(g, "w:type", 0.5, LAND) + 0.55 * k(g, "w:make-0.1", 0.5, CRAFT)) * (1 - kf(g, sendF + 3, 14, CRAFT));
  const press = g < sendF ? 0 : g < sendF + 3 ? SNAP((g - sendF) / 3) : 1 - SNAP(clamp01((g - sendF - 3) / 6));
  const sent = g >= sendF + 3;
  const text = sent ? "" : typedCalmer(g);
  const showCmp = g >= f("w:type") && g < sendF + 3 + 14;
  // the chat moves on: the old turn recedes, the new bubble and the activity land
  const o = kf(g, sendF + 2, 10, CRAFT);
  const nb = kf(g, sendF + 4, 12, LAND), na = kf(g, sendF + 8, 12, LAND);
  const fold = kf(g, f("w:updates") - 5, 6, SNAP);
  const secs = 6 + Math.min(2, Math.floor(Math.max(0, g - sendF - 8) / 7));
  // the storyboard card: lifts on "The storyboard", updates on "updates", returns by sK
  const up = k(g, "w:the4", 0.5, CRAFT), u = k(g, "w:updates", 0.42, (t) => t), back = kf(g, f("sK") - 16, 15, CRAFT);
  const l = up * (1 - back);
  const twin = up > 0 && back < 1;
  const ns = kf(g, f("sK") - 12, 10, LAND);

  const act = (
    <div style={{ display: "grid" }}>
      {fold < 1 && <div style={{ gridArea: "1/1", opacity: 1 - fold }}><Activity g={g} clock={`Working 0:0${secs}`} fold="Making it calmer…" w={524} size={17} card={false} /></div>}
      {fold > 0 && <div style={{ gridArea: "1/1", opacity: fold }}><Activity g={g} clock="Worked for 1:12" fold="5 steps" w={524} size={17} card={false} /></div>}
    </div>
  );
  const chat = (
    <>
      {(o < 1 || up <= 0) && <ChatRows rows={[
        { node: <UserBubble text={BRIEF} size={18} />, end: true, style: recede(o) },
        { node: <Activity g={g} clock="Worked for 3:48" fold="11 steps" w={524} size={17} card={false} />, style: recede(o) },
        { node: <SbCard u={0} />, hide: up > 0 },
        { node: <Summary text={READY_SUM} />, style: recede(o) },
      ]} />}
      {nb > 0 && <ChatRows rows={[
        { node: <UserBubble text="make it calmer" size={18} />, end: true, p: nb },
        { node: fold >= 1 ? <Activity g={g} clock="Worked for 1:12" fold="5 steps" w={524} size={17} card={false} /> : act, p: na },
        { node: <SbCard u={1} />, hide: back < 1 },
        { node: <Summary text={CALM_SUM} />, p: ns },
      ]} />}
    </>
  );
  const preview = <Preview w={PANE.w} h={PANE.h} ar={16 / 9} s={fc.s} calm={fc.calm} content={filmNode(g, cv.w, cv.h)} />;
  const cs = mix(1, CMP.s, lift);
  const ss = mix(1, LIFT.s, l);
  return (
    <>
      <Studio g={g} chat={chat} preview={preview} />
      <Veil a={0.42 * Math.max(lift, l)} />
      {showCmp && (
        <div style={{ position: "absolute", left: mix(COMPOSER.x, CMP.x, lift), top: mix(COMPOSER.y, CMP.y, lift), width: COMPOSER.w, height: COMPOSER.h, transform: `scale(${cs})`, transformOrigin: "0 0",
          borderRadius: 18, boxShadow: lift > 0 ? `0 ${26 * lift}px ${60 * lift}px -${14 * lift}px rgba(60,40,110,${0.4 * lift})` : undefined }}>
          <Composer g={g} text={text} caret={!sent && g >= f("w:type")} press={press} />
        </div>
      )}
      {twin && (
        <div style={{ position: "absolute", left: mix(CARD.x, LIFT.x, l), top: mix(CARD.y, LIFT.y, l), transform: `scale(${ss})`, transformOrigin: "0 0" }}>
          <SbCard u={u} shadow={`0 1px 2px rgba(38,35,44,0.06), 0 ${10 + 26 * l}px ${28 + 40 * l}px -${10 * l}px rgba(60,40,110,${0.08 + 0.3 * l})`} />
        </div>
      )}
    </>
  );
};
