// v2 conversation: the found ending (S6BB, Iris, Amina and Mossa reading together) opens out of its medallion into the
// whole page. "Our friend" is ringed in gold crayon; the talk is drawn as playful crayon speech bubbles that pop in
// turn; on "a quiet moment together" they rise and turn into the stars of the next scene.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, MOVE, SETTLE, SOFT, clamp01, lerp, tw } from "../lib";
import { Burst, Plate, Say, Sparkle } from "../parts";
import { T2 } from "./clock2";
import { DoodleLayer, Stroke, heart, pop, star } from "./Doodle";

const f = (p: string) => T2.f(p);
const k = (g: number, at: string, s: number, e = SETTLE) => T2.k(g, at, s, e);
const SHADOW = "0 2px 18px rgba(12,10,31,0.6)";
const BAND = "linear-gradient(180deg, rgba(12,10,31,0) 0%, rgba(12,10,31,0.6) 55%, rgba(12,10,31,0.76) 100%)";

const Bubble: React.FC<{ g: number; at: string; x: number; y: number; r: number; tx: number; ty: number; rise: number; children: React.ReactNode; name: string }> = ({ g, at, x, y, r, tx, ty, rise, children, name }) => {
  const p = pop(g, f(at) - 2, 13);
  if (p <= 0) return null;
  const up = rise;
  // the tail points at the speaker
  const ang = Math.atan2(ty - y, tx - x), bx = x + Math.cos(ang) * r * 0.82, by = y + Math.sin(ang) * r * 0.7;
  return (
    <g data-name={name} opacity={clamp01(p * 2) * (1 - up)} transform={`translate(${x} ${y - up * 220}) scale(${p * (1 - up * 0.6)}) translate(${-x} ${-y})`}>
      <path d={`M ${bx - 16} ${by} L ${tx} ${ty} L ${bx + 16} ${by + 6} Z`} fill="#FFF9EE" stroke={C.goldSoft} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.78} fill="#FFF9EE" stroke={C.goldSoft} strokeWidth={5} />
      {children}
    </g>
  );
};

export const TalkV2: React.FC<{ g: number }> = ({ g }) => {
  const open = k(g, "talk2", 1.1, MOVE);
  const s = lerp(660 / 1280, 1, open) * (1 + 0.05 * k(g, "talk2+1.1", 4.8, SOFT));
  const fy = 0.5 + (lerp(-20, 0, open)) / (1280 * s);
  const rise = k(g, "rise", 1.5, SOFT);
  const dusk = k(g, "rise+0.4", 1.4, SOFT);
  return (
    <AbsoluteFill data-name="TalkV2">
      {/* a blurred, darkened copy fills around the opening picture (the site's reader letterbox), so no edge shows */}
      <Plate src="S6BB.webp" aspect={1.5} s={1.2} style={{ filter: "blur(30px) saturate(1.1) brightness(0.55)" }} />
      {/* the sharp picture is feathered into the blurred copy while it opens, so no rectangle edge shows */}
      <AbsoluteFill style={{ WebkitMaskImage: `radial-gradient(ellipse ${lerp(46, 140, open)}% ${lerp(54, 150, open)}% at 50% ${lerp(48, 50, open)}%, #000 ${lerp(55, 80, open)}%, transparent 100%)`,
        maskImage: `radial-gradient(ellipse ${lerp(46, 140, open)}% ${lerp(54, 150, open)}% at 50% ${lerp(48, 50, open)}%, #000 ${lerp(55, 80, open)}%, transparent 100%)` }}>
        <Plate src="S6BB.webp" aspect={1.5} s={s} fx={0.5} fy={fy} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(15,10,42,0.95) 0%, rgba(30,22,80,0.6) 45%, rgba(23,18,50,0) 100%)", opacity: dusk }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: BAND, opacity: open }} />
      <DoodleLayer name="TalkDoodles" id="crayonT">
        {/* our friend, ringed */}
        <Stroke g={g} d="M 1046 500 C 1046 430 990 392 935 395 C 868 398 830 452 836 510 C 842 572 896 612 952 606 C 1010 600 1050 556 1044 492" a={f("ring")} b={f("ring") + 16} color={C.goldSoft} w={6} out={f("rise")} outDur={14} />
        {[[1078, 418, 16], [812, 440, 12]].map(([x, y, r], i) => (
          <Stroke key={i} g={g} d={star(x, y, r)} a={f("ring") + 12 + i * 4} b={f("ring") + 18 + i * 4} color={C.goldSoft} w={4} fill={C.goldSoft} fillAt={f("ring") + 18 + i * 4} out={f("rise")} />
        ))}
        {/* the conversation, in turn: Iris, Amina, Iris, Amina */}
        <Bubble name="TalkIris1" g={g} at="b1" x={430} y={170} r={92} tx={600} ty={250} rise={rise}>
          <path d={star(430, 168, 34)} fill={C.goldSoft} />
        </Bubble>
        <Bubble name="TalkAmina1" g={g} at="b2" x={1480} y={220} r={92} tx={1290} ty={330} rise={rise}>
          <path d={heart(1480, 226, 1.5)} fill="#E86A7A" />
        </Bubble>
        <Bubble name="TalkIris2" g={g} at="b3" x={400} y={420} r={80} tx={590} ty={360} rise={rise}>
          {/* a little mouse face: Mossa */}
          <circle cx={400} cy={428} r={24} fill="#B5835A" /><circle cx={378} cy={404} r={13} fill="#C99A72" /><circle cx={422} cy={404} r={13} fill="#C99A72" />
          <circle cx={392} cy={426} r={3} fill={C.plum} /><circle cx={408} cy={426} r={3} fill={C.plum} /><circle cx={400} cy={436} r={4} fill="#E86A7A" />
        </Bubble>
        <Bubble name="TalkAmina2" g={g} at="b4" x={1530} y={480} r={80} tx={1330} ty={430} rise={rise}>
          <circle cx={1530} cy={482} r={20} fill={C.goldSoft} />
          {Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <line key={i} x1={1530 + Math.cos(a) * 28} y1={482 + Math.sin(a) * 28} x2={1530 + Math.cos(a) * 40} y2={482 + Math.sin(a) * 40} stroke={C.goldSoft} strokeWidth={5} strokeLinecap="round" />; })}
        </Bubble>
      </DoodleLayer>
      {/* the bubbles become stars rising into the night */}
      {rise > 0 && rise < 1 && [[430, 170], [1480, 220], [400, 420], [1530, 480], [941, 500]].map(([x, y], i) => (
        <Sparkle key={i} x={x + (960 - x) * rise * 0.2} y={y - rise * 380} r={10 + 14 * Math.sin(Math.PI * rise)} opacity={Math.sin(Math.PI * clamp01(rise * 1.2))} rot={rise * 140} />
      ))}
      <Burst k={k(g, "rise", 2.0, SOFT)} x={941} y={560} n={24} spread={520} rise={460} seed={81} size={12} />
      <Say g={g} name="CapFriend" x={140} y={900} size={64} out="w:conversation-0.3" width={1650} shadow={SHADOW} words={[
        { t: "“What", at: "w:what3" }, { t: "do", at: "w:do2" }, { t: "you", at: "w:you" }, { t: "think", at: "w:think" }, { t: "our", at: "w:our" }, { t: "friend", at: "w:friend", gold: true }, { t: "needed?”", at: "w:needed" },
      ]} />
      <Say g={g} name="CapConversation" x={140} y={900} size={64} out="w:a7-0.2" width={1650} shadow={SHADOW} words={[
        { t: "…the", at: "w:the4" }, { t: "conversation", at: "w:conversation", gold: true }, { t: "doesn't", at: "w:doesn't" }, { t: "have", at: "w:have" }, { t: "to.", at: "w:to4" },
      ]} />
      <Say g={g} name="CapQuiet" x={140} y={900} size={64} out="sky+0.4" width={1650} shadow={SHADOW} words={[
        { t: "A", at: "w:a7" }, { t: "quiet", at: "w:quiet" }, { t: "moment", at: "w:moment2" }, { t: "together.", at: "w:together", gold: true },
      ]} />
    </AbsoluteFill>
  );
};
export { tw };
