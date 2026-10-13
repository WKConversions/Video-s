// The shot list, cut for cut on the Lovable 2.0 reference (its cuts sit on the music's beat; ours on the same frames,
// moved only where the Creoble script times a line differently). Each shot gets the film frame.
import React from "react";
import { A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14 } from "./A";
import { B1, B2, B3 } from "./B";
import { C1, C2, C3, C4, C6, C7, C8 } from "./C";
import { D1, D2, D3, D4, D5, D6, D7, D8 } from "./D";

type Shot = [number, number, React.FC<{ g: number }>];
export const SHOTS: Shot[] = [
  [0, 46, A1], [46, 82, A2], [82, 106, A3], [106, 147, A4], [147, 180, A5], [180, 210, A6], [210, 265, A7], [265, 305, A8],
  [305, 374, A9], [374, 444, A10], [444, 495, A11], [495, 546, A12], [546, 572, A13], [572, 690, A14],
  [690, 793, B1], [793, 834, B2], [834, 1018, B3],
  [1018, 1050, C1], [1050, 1080, C2], [1080, 1119, C3], [1119, 1245, C4], [1245, 1273, C6], [1273, 1350, C7], [1350, 1624, C8],
  [1624, 1710, D1], [1710, 1890, D2], [1890, 1950, D3], [1950, 1986, D4], [1986, 2077, D5], [2077, 2175, D6], [2175, 2280, D7], [2280, 2415, D8],
];
export const DURATION = 2415;

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const s = SHOTS.find(([a, b]) => g >= a && g < b) ?? SHOTS[SHOTS.length - 1];
  const [a, b, S] = s;
  // the reference never holds still: every shot creeps in at a constant slow rate on top of its own moves
  const k = (g - a) / (b - a);
  return <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.04 * k})`, transformOrigin: "50% 50%" }}><S g={g} /></div>;
};
