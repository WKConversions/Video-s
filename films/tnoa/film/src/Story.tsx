// TNOA (The Network of Agents), 20 s, no voice-over, 60 fps, version 2: about twelve shots in four 5-second
// segments, each built by its own builder (plan/storyboard.md); the kit and the hand-offs are ./kit.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { B } from "./kit";
import { SegA } from "./scenes/A";
import { SegB } from "./scenes/B";
import { SegC } from "./scenes/C";
import { SegD } from "./scenes/D";

export const Story: React.FC = () => {
  const t = useCurrentFrame() / 60;
  return (
    <AbsoluteFill style={{ background: B.bg, overflow: "hidden" }}>
      {t < 5 && <SegA t={t} />}
      {t >= 5 && t < 10 && <SegB t={t} />}
      {t >= 10 && t < 15 && <SegC t={t} />}
      {t >= 15 && <SegD t={t} />}
    </AbsoluteFill>
  );
};
