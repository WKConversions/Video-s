import React from "react";
import { Composition, registerRoot } from "remotion";
import { DUR, FPS, Loop, SIZE } from "./Loop";
registerRoot(() => React.createElement(Composition, { id: "Loop", component: Loop, durationInFrames: DUR, fps: FPS, width: SIZE, height: SIZE }));
