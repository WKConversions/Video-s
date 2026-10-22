import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, FPS } from "./kit";
import { Cards, EndCard, FlowCheck, WordsSpace } from "./shots2d";
import { RoundShot, WoodShot } from "./footage";

// Test harness for the builders: render one shot by name (props.name), from local time 0.
// npx remotion still src/index.ts Test out/x.jpg --frame=N --props='{"name":"round"}' --scale=0.5
const SHOTS: Record<string, React.FC<{ t: number }>> = { round: RoundShot, words: WordsSpace, wood: WoodShot, flow: FlowCheck, cards: Cards, end: EndCard };
const Local: React.FC<{ S: React.FC<{ t: number }> }> = ({ S }) => { const f = useCurrentFrame(); return <S t={f / FPS} />; };
export const Test: React.FC<{ name: string }> = ({ name }) => {
  const S = SHOTS[name];
  return <AbsoluteFill style={{ background: C.night }}>{S ? <Sequence from={0}><Local S={S} /></Sequence> : null}</AbsoluteFill>;
};
