// The shot list, cut for cut on the Lovable 2.0 reference (its cuts sit on the music's beat; ours on the same frames,
// moved only where the Creoble script times a line differently). Each shot gets the film frame.
import React from "react";
import { A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14 } from "./A";
import { B1, B2, B3, B4 } from "./B";
import { C1, C2, C3, C4, C5, C6, C7, C8 } from "./C";
import { D1, D2, D3, D4, D5, D6, D7, D8 } from "./D";

type Shot = [number, number, React.FC<{ g: number }>];
export const SHOTS: Shot[] = [
  [0, 45, A1], [45, 75, A2], [75, 105, A3], [105, 150, A4], [150, 180, A5], [180, 210, A6], [210, 264, A7], [264, 300, A8],
  [300, 375, A9], [375, 450, A10], [450, 495, A11], [495, 540, A12], [540, 570, A13], [570, 690, A14],
  [690, 780, B1], [780, 840, B2], [840, 945, B3], [945, 1020, B4],
  [1020, 1050, C1], [1050, 1080, C2], [1080, 1125, C3], [1125, 1170, C4], [1170, 1260, C5], [1260, 1293, C6], [1293, 1350, C7], [1350, 1620, C8],
  [1620, 1710, D1], [1710, 1890, D2], [1890, 1950, D3], [1950, 1995, D4], [1995, 2100, D5], [2100, 2175, D6], [2175, 2280, D7], [2280, 2415, D8],
];
export const DURATION = 2415;

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const s = SHOTS.find(([a, b]) => g >= a && g < b) ?? SHOTS[SHOTS.length - 1];
  const S = s[2];
  return <S g={g} />;
};
