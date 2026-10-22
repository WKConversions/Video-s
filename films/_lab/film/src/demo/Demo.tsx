import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, FPS } from "./kit";
import { Cards, EndCard, FlowCheck, WordsSpace } from "./shots2d";
import { RoundShot, WoodShot } from "./footage";

// The preview cut (9 s): the two real phone shots with tracked screen UIs, and the 2D shots. Each shot carries its own
// joint (zoom-through, pull-out, whip, glow match; plan/demo.md), so the shots meet on plain cuts here. The Blender
// plate shots (desk, tablet, dark room) slot in later.
export const SHOTS = { round: [0, 132], words: [132, 84], wood: [216, 87], flow: [303, 66], cards: [369, 78], end: [447, 96] } as const;
export const DEMO_FRAMES = 543;

const Local: React.FC<{ S: React.FC<{ t: number }> }> = ({ S }) => { const f = useCurrentFrame(); return <S t={f / FPS} />; };
const ORDER: [keyof typeof SHOTS, React.FC<{ t: number }>][] = [
  ["round", RoundShot], ["words", WordsSpace], ["wood", WoodShot], ["flow", FlowCheck], ["cards", Cards], ["end", EndCard],
];

export const Demo: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    {ORDER.map(([k, S]) => (
      <Sequence key={k} from={SHOTS[k][0]} durationInFrames={SHOTS[k][1]}><Local S={S} /></Sequence>
    ))}
  </AbsoluteFill>
);
