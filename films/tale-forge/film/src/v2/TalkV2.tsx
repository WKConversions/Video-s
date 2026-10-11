// v2 return and conversation, light and paper only: the page of the three of them together (S6BB) draws back into a
// book, closes (its cover is the book's own cover painting) and opens again ("a story they can return to"); "The
// End" settles on the page; the book grows back into the room; a light finds "our friend" Mossa, opens onto all three,
// "The End" lifts off the page as gold motes ("the conversation doesn't have to"), and evening comes in around them.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { C, F, SETTLE, SOFT, clamp01, lerp, rand, tw } from "../lib";
import { Burst, Glow, Plate, Say, Sparkle, img } from "../parts";
import { T2 } from "./clock2";
import { Band, Gutter, SHADOW, TopScrim } from "./kit";

const f = (p: string) => T2.f(p);
const k = (g: number, l: string, s: number, e = SETTLE) => T2.k(g, l, s, e);

const half = (side: "L" | "R", node: React.ReactNode) => (
  <div style={{ position: "absolute", top: 0, left: side === "L" ? 0 : 960, width: 960, height: 1080, overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: side === "L" ? 0 : -960, width: 1920, height: 1080 }}>{node}</div>
  </div>
);

export const TalkV2: React.FC<{ g: number }> = ({ g }) => {
  // the spread draws back into a book (an object move; the camera only breathes), closes, opens again
  const back = k(g, "w:a6-0.02", 1.1, SOFT) * (1 - k(g, "w:what3-0.2", 1.0, SOFT));
  const sc = lerp(1, 0.8, back);
  const close = tw(g, f("w:story3"), f("w:story3") + 21, SOFT) * (1 - tw(g, f("w:return") - 2, f("w:return") + 22, SOFT));
  const reopenGlow = k(g, "w:return", 0.8, SOFT) * (1 - k(g, "w:and4", 1.0, SOFT));
  const theEnd = k(g, "w:ends", 0.6);
  const motes = tw(g, f("w:doesn't"), f("w:doesn't") + 27, SOFT);
  // the conversation
  const push = lerp(1, 1.06, SOFT(clamp01((g - f("w:what3")) / (f("w:together") + 15 - f("w:what3")))));
  const friend = k(g, "w:our", 0.7) * (1 - k(g, "w:conversation", 1.2, SOFT));
  const sweep = k(g, "w:conversation", 1.2, SOFT);
  const dusk = k(g, "w:a7", 1.4, SOFT);
  const tight = k(g, "w:together", 0.8, SOFT);
  const page = (
    <AbsoluteFill>
      <Plate src="S6BB.webp" aspect={1.5} s={1} fx={0.5} fy={0.5} />
      <Gutter o={0.6 * (1 - push + 1)} />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill data-name="TalkV2">
      {/* the reader's soft room around the book: the same page, blurred and dimmed */}
      <AbsoluteFill style={{ opacity: back }}>
        <Plate src="S6BB.webp" aspect={1.5} s={1.2} style={{ filter: "blur(30px) brightness(0.5) saturate(1.1)" }} />
      </AbsoluteFill>
      <Glow x={1344} y={560} r={700} color="rgba(255,226,150,0.6)" opacity={0.4 * close + 0.5 * reopenGlow} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${sc})`, transformOrigin: "960px 540px",
        borderRadius: 10 * back / sc, boxShadow: back > 0 ? `0 22px 52px rgba(5,8,20,${0.5 * back})` : undefined, perspective: 3200, perspectiveOrigin: "960px 540px" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "941px 540px" }}>
          {half("R", page)}
          {/* the left page folds over onto the right: its back is the front cover */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 960, height: 1080, transformOrigin: "100% 50%", transform: `rotateY(${180 * close}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>{page}</div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(10,6,20,1), rgba(10,6,20,0) 60%)", opacity: 0.35 * Math.sin(Math.PI * close) }} />
            </div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", overflow: "hidden", borderRadius: "4px 12px 12px 4px" }}>
              <Img src={img("cover.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(23,18,50,0.55) 0%, rgba(23,18,50,0) 30%)" }} />
              <div style={{ position: "absolute", left: "8%", right: "8%", top: "6%", textAlign: "center", fontFamily: F.display, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: C.warm, textShadow: "0 2px 10px rgba(12,8,40,0.6)" }}>Iris and the Saved Place</div>
            </div>
          </div>
          {/* the light of the conversation */}
          <AbsoluteFill style={{ background: "radial-gradient(circle 420px at 941px 560px, rgba(12,10,31,0) 45%, rgba(12,10,31,0.18) 100%)", opacity: friend }} />
          <Glow x={941} y={560} r={260} color="rgba(255,232,190,1)" opacity={0.32 * friend} />
          <Glow x={60} y={280} r={1500} color="rgba(255,226,160,1)" opacity={0.4 * sweep * (1 - 0.6 * dusk)} />
          <AbsoluteFill style={{ background: "linear-gradient(90deg, #3B2A86 0%, #3B2A86 60%, #2A1F5C 100%)", mixBlendMode: "multiply", opacity: 0.35 * dusk }} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse ${lerp(760, 600, tight)}px ${lerp(560, 460, tight)}px at 941px 600px, rgba(12,10,31,0) 50%, rgba(12,10,31,${0.25 * tight + 0.1 * dusk}) 100%)` }} />
          <Glow x={941} y={760} r={lerp(760, 600, tight)} color="rgba(255,214,140,0.5)" opacity={dusk} blend="normal" />
          {/* "The End", on the right page; on "doesn't" it lifts off as gold motes towards the window light */}
          {theEnd > 0 && motes < 1 && (
            <div style={{ position: "absolute", left: 1344 - 300, top: 925 - 26, width: 600, textAlign: "center", fontFamily: F.display, fontWeight: 600, fontSize: 40, letterSpacing: "0.22em",
              color: C.goldSoft, textShadow: "0 2px 12px rgba(12,10,31,0.8)", opacity: theEnd * (1 - motes), filter: `blur(${(1 - theEnd) * 6 + motes * 4}px)`, transform: `translateY(${(1 - theEnd) * 18}px)` }}>THE END</div>
          )}
          {motes > 0 && motes < 1 && Array.from({ length: 40 }, (_, i) => {
            const x0 = 1344 - 180 + rand(i * 3 + 7) * 360, y0 = 925 + (rand(i * 5 + 1) - 0.5) * 40;
            const d = motes * (0.6 + rand(i) * 0.4);
            return <Sparkle key={i} x={x0 - d * (160 + rand(i * 7) * 220)} y={y0 - d * (160 + rand(i * 9) * 120)} r={3 + rand(i * 11) * 3} opacity={Math.sin(Math.PI * Math.min(1, motes * 1.1))} rot={d * 120} />;
          })}
        </div>
      </div>
      <Burst k={k(g, "w:return", 1.4, SOFT)} x={960} y={540} n={14} spread={300} rise={240} seed={33} size={11} />
      <TopScrim o={k(g, "w:a6", 0.4, SOFT) * (1 - k(g, "w:what3-0.3", 0.4, SOFT))} />
      <Band o={k(g, "w:what3-0.4", 0.4, SOFT)} />
      <Say g={g} name="CapReturn" x={960} y={30} size={54} out="w:and4-0.1" align="center" width={1600} shadow={SHADOW} words={[
        { t: "A", at: "w:a6" }, { t: "story", at: "w:story3" }, { t: "they", at: "w:they6" }, { t: "can", at: "w:can4" }, { t: "return", at: "w:return", gold: true }, { t: "to.", at: "w:to3" },
      ]} />
      <Say g={g} name="CapEnds" x={960} y={30} size={54} out="w:what3-0.3" align="center" width={1600} shadow={SHADOW} words={[
        { t: "And", at: "w:and4" }, { t: "when", at: "w:when" }, { t: "the", at: "w:the3" }, { t: "adventure", at: "w:adventure2" }, { t: "ends…", at: "w:ends", gold: true },
      ]} />
      <Say g={g} name="CapFriend" x={140} y={880} size={64} out="w:conversation-0.3" width={1650} shadow={SHADOW} words={[
        { t: "“What", at: "w:what3" }, { t: "do", at: "w:do2" }, { t: "you", at: "w:you" }, { t: "think", at: "w:think" }, { t: "our", at: "w:our" }, { t: "friend", at: "w:friend", gold: true }, { t: "needed?”", at: "w:needed" },
      ]} />
      <Say g={g} name="CapConversation" x={140} y={880} size={64} out="w:a7-0.2" width={1650} shadow={SHADOW} words={[
        { t: "…the", at: "w:the4" }, { t: "conversation", at: "w:conversation", gold: true }, { t: "doesn't", at: "w:doesn't" }, { t: "have", at: "w:have" }, { t: "to.", at: "w:to4" },
      ]} />
      <Say g={g} name="CapQuiet" x={140} y={880} size={64} out="sky+0.4" width={1650} shadow={SHADOW} words={[
        { t: "A", at: "w:a7" }, { t: "quiet", at: "w:quiet" }, { t: "moment", at: "w:moment2" }, { t: "together,", at: "w:together", gold: true },
      ]} />
    </AbsoluteFill>
  );
};
export { Sparkle };
