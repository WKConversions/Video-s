import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
// @ts-ignore: plain JS module
import { FPS, FRAMES_TOTAL } from "./timeline.js";

// Wicflow hero film: 1920x1080, 60 fps, 33.0 s, no loop. The picture is one SVG per frame (src/film.js), the 3D hand
// is drawn on top (src/hand.tsx). Audio is muxed after the render (sound/mix.wav).
export const Root: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={FRAMES_TOTAL} fps={FPS} width={1920} height={1080} />
);
