import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { FPS, T } from "./clock";
import { tx } from "./lang";

export const Root: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={T.f("end")} fps={FPS} width={1920} height={1080}
    defaultProps={{ blurSamples: 1, audio: tx("audio/vo.mp3", "audio/vo_nl.mp3") }} />
);
