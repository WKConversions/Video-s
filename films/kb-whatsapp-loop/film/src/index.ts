import React from "react";
import { Composition, registerRoot } from "remotion";
import { DUR, FPS, H, Loop, W } from "./Loop";
registerRoot(() => React.createElement(Composition, { id: "Loop", component: Loop, durationInFrames: DUR, fps: FPS, width: W, height: H }));
