import React from "react";
import { Composition, registerRoot } from "remotion";
import { Film } from "./Film";
import { DUR_FRAMES, FPS, H, W } from "./timeline";
registerRoot(() => React.createElement(Composition, { id: "Film", component: Film, durationInFrames: DUR_FRAMES, fps: FPS, width: W, height: H }));
