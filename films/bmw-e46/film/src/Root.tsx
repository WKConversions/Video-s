import React from "react";
import { Composition } from "remotion";
import { PipeTest } from "./PipeTest";
import { Preview } from "./Preview";
import { CarPreview, PVIEWS } from "./CarPreview";
import { PhotoMatch } from "./PhotoMatch";
import { Film } from "./film/Film";
import { DURATION } from "./film/timeline";
import photoCam from "../../build/photo_camera.json";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PipeTest" component={PipeTest} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="PreviewPaint" component={Preview} durationInFrames={10} fps={30} width={1600} height={900} defaultProps={{ model: "models/body.glb", mode: "paint" as const }} />
    <Composition id="Preview" component={Preview} durationInFrames={10} fps={30} width={1600} height={900} defaultProps={{ model: "models/body.glb", mode: "clay" as const }} />
    <Composition id="CarPreview" component={CarPreview} durationInFrames={PVIEWS.length} fps={30} width={1600} height={900} defaultProps={{ extras: ["details"] as string[], sweep: 99 }} />
    <Composition id="PhotoMatch" component={PhotoMatch} durationInFrames={1} fps={30} width={966} height={1288} defaultProps={{ cam: photoCam, extras: ["details", "wheels"] }} />
    <Composition id="Film" component={Film} durationInFrames={DURATION} fps={30} width={1920} height={1080} defaultProps={{ blurSamples: 1, internals: ["engine"] as string[] }} />
  </>
);
