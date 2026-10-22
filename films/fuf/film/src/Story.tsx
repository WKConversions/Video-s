// Future Unicorn Founders, 42.5 s, 60 fps, on the Christina voice-over: five segments, each built by its own
// builder (plan/storyboard.md); the kit, the word clock and the hand-offs are ./kit.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { F, H1, H2, H3, H4 } from "./kit";
import { SegA } from "./scenes/A";
import { SegB } from "./scenes/B";
import { SegC } from "./scenes/C";
import { SegD } from "./scenes/D";
import { SegE } from "./scenes/E";

export const Story: React.FC = () => {
  const t = useCurrentFrame() / 60;
  return (
    <AbsoluteFill style={{ background: F.cream, overflow: "hidden" }}>
      {t < H1 && <SegA t={t} />}
      {t >= H1 && t < H2 && <SegB t={t} />}
      {t >= H2 && t < H3 && <SegC t={t} />}
      {t >= H3 && t < H4 && <SegD t={t} />}
      {t >= H4 && <SegE t={t} />}
    </AbsoluteFill>
  );
};
