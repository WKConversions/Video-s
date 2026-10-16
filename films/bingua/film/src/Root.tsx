import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { FPS, T } from "./clock";

export const Root: React.FC = () => (
  <>
  <Composition id="Film" component={Film} durationInFrames={T.f("end")} fps={FPS} width={1920} height={1080}
    defaultProps={{ blurSamples: 1, audio: "audio/vo.mp3" }} />
  <Composition id="Portrait" component={Film} durationInFrames={T.f("end")} fps={FPS} width={1080} height={1920}
    defaultProps={{ blurSamples: 1, audio: "audio/vo.mp3", portrait: true }} />
  </>
);
