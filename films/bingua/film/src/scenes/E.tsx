// Scene E (31.8–37.6 s): Bingua. Learn languages by scrolling. See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(31.8) || g > f(37.6)) return null;
  return <AbsoluteFill />;
};
