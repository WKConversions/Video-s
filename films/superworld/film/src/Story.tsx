// SuperWorld, 40 s, no voice-over (the script is on-screen type), 60 fps: four 10-second segments, each built by its
// own builder (plan/storyboard.md); the kit and the hand-offs are ./kit.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { S } from "./kit";
import { SegA } from "./scenes/A";
import { SegB } from "./scenes/B";
import { SegC } from "./scenes/C";
import { SegD } from "./scenes/D";

export const Story: React.FC = () => {
  const t = useCurrentFrame() / 60;
  return (
    <AbsoluteFill style={{ background: S.cream, overflow: "hidden" }}>
      {t < 10 && <SegA t={t} />}
      {t >= 10 && t < 20 && <SegB t={t} />}
      {t >= 20 && t < 30 && <SegC t={t} />}
      {t >= 30 && <SegD t={t} />}
    </AbsoluteFill>
  );
};
