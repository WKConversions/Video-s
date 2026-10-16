// Portrait (1080×1920) version of scene B — re-laid out from ../scenes/B.tsx. See ../../../plan/portrait.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { f } from "../shared";

export const SceneBP: React.FC<{ g: number }> = ({ g }) => {
  if (g < 0 || g > f("end")) return null;
  return <AbsoluteFill />;
};
