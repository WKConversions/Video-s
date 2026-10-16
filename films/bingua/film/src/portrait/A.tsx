// Portrait (1080×1920) version of scene A — re-laid out from ../scenes/A.tsx. See ../../../plan/portrait.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneAP: React.FC<{ g: number }> = ({ g }) => {
  if (g < 0 || g > f("end")) return null;
  return <AbsoluteFill />;
};
