import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FPS, OnQuad, Quad, clamp01 } from "./kit";
import { Cards, EndCard, FlowCheck, WordsSpace } from "./shots2d";
import { PHONE_WAKE_GLOW, PhoneForm, PhoneWake } from "./ui";
import round from "../../public/tracks/round.json";
import wood from "../../public/tracks/wood.json";

// The preview cut (9 s): the two real phone shots with tracked screen UIs, and the 2D shots. The Blender plate shots
// (desk, tablet, dark room) slot in later (plan/demo.md).

/** Real footage, graded low-key and cool like the reference, with a UI pinned on the tracked screen and its light
 * spilling onto the surface around it. */
const Footage: React.FC<{ src: string; quads: number[][][]; uiW: number; uiH: number; glow: (t: number) => number; spill: number;
  children: (t: number) => React.ReactNode }> = ({ src, quads, uiW, uiH, glow, spill, children }) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const q = quads[Math.min(f, quads.length - 1)] as Quad;
  const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
  const g = glow(t);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: 1920, height: 1080, filter: "brightness(0.62) contrast(1.18) saturate(0.78)" }} />
      {/* cool low-key grade */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,40,60,0.35), rgba(5,12,18,0.25))", mixBlendMode: "multiply" }} />
      {/* the screen's light on the surface */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 820px 560px at ${cx}px ${cy}px, rgba(168,196,187,${0.55 * g * spill}) 0%, rgba(135,168,158,${0.22 * g * spill}) 40%, rgba(0,0,0,0) 72%)`, mixBlendMode: "screen" }} />
      <OnQuad w={uiW} h={uiH} q={q}>{children(t)}</OnQuad>
      {/* glass sheen over the screen */}
      <OnQuad w={uiW} h={uiH} q={q} style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%)", pointerEvents: "none" }}><div /></OnQuad>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/** 2D shot wrapper: local seconds. */
const Shot2D: React.FC<{ C2: React.FC<{ t: number }> }> = ({ C2 }) => {
  const f = useCurrentFrame();
  return <C2 t={f / FPS} />;
};

/** The cut: the incoming shot settles out of a short blur push (the reference's soft cuts). */
const Cut: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => (
  <Sequence from={from} durationInFrames={dur}><CutIn>{children}</CutIn></Sequence>
);
const CutIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame(); const k = clamp01(f / 9); const e = 1 - Math.pow(1 - k, 3);
  return <AbsoluteFill style={{ transform: `scale(${1.05 - 0.05 * e})`, filter: k < 1 ? `blur(${(1 - e) * 10}px)` : undefined }}>{children}</AbsoluteFill>;
};

export const SHOTS = { round: [0, 132], words: [132, 84], wood: [216, 87], flow: [303, 66], cards: [369, 78], end: [447, 96] } as const;
export const DEMO_FRAMES = 543;

export const Demo: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Cut from={SHOTS.round[0]} dur={SHOTS.round[1]}>
      <Footage src="footage/seg_round.mp4" quads={round.quads} uiW={600} uiH={1300} glow={PHONE_WAKE_GLOW} spill={1}>
        {(t) => <PhoneWake t={t} />}
      </Footage>
    </Cut>
    <Cut from={SHOTS.words[0]} dur={SHOTS.words[1]}><Shot2D C2={WordsSpace} /></Cut>
    <Cut from={SHOTS.wood[0]} dur={SHOTS.wood[1]}>
      <Footage src="footage/seg_wood.mp4" quads={wood.quads} uiW={750} uiH={1334} glow={() => 1} spill={0.7}>
        {(t) => <PhoneForm t={t} />}
      </Footage>
    </Cut>
    <Cut from={SHOTS.flow[0]} dur={SHOTS.flow[1]}><Shot2D C2={FlowCheck} /></Cut>
    <Cut from={SHOTS.cards[0]} dur={SHOTS.cards[1]}><Shot2D C2={Cards} /></Cut>
    <Cut from={SHOTS.end[0]} dur={SHOTS.end[1]}><Shot2D C2={EndCard} /></Cut>
  </AbsoluteFill>
);
