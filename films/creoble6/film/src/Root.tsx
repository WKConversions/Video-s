import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { Kit } from "./Kit";
import { OUT_FPS, T } from "./clock";

// 60 fps; all animation runs on the 30-unit clock g = frame / 2 (Story). blurSamples: 1 for drafts, 6 for the final.
export const Root: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={T.f("end") * (OUT_FPS / 30)} fps={OUT_FPS} width={1920} height={1080}
      defaultProps={{ blurSamples: 1, audio: "audio/vo.mp3" }} />
    <Composition id="Kit" component={Kit} durationInFrames={600} fps={OUT_FPS} width={1920} height={1080} />
  </>
);
