import React from "react";
import { Composition, registerRoot } from "remotion";
import { FPS } from "./kit";
import { DUR } from "./timing";
import { Reel } from "./Reel";
registerRoot(() => React.createElement(Composition, { id: "Reel", component: Reel as unknown as React.FC<Record<string, unknown>>, durationInFrames: Math.round(DUR * FPS), fps: FPS, width: 1080, height: 1920, defaultProps: { layer: "all" } }));
