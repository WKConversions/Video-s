import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { OUT_FPS, T } from "./clock";

// Version 3 renders at 60 fps for Apple-smooth motion. All animation runs on the 30-unit clock g = frame / 2
// (Story), so every move is sampled twice as often; durations and labels are unchanged.
export const Root: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={T.f("end") * (OUT_FPS / 30)} fps={OUT_FPS} width={1920} height={1080}
    defaultProps={{ blurSamples: 1, audio: "audio/vo.mp3" }} />
);
