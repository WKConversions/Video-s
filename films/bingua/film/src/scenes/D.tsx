// Scene D (21.1–32.3 s): No endless word lists. No repetitive textbook exercises. / Just content you enjoy, a growing vocabulary, and more confidence with every video, at your own pace. See ../../../plan/storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneD: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(21.1) || g > f(32.3)) return null;
  return <AbsoluteFill />;
};
