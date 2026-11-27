import React from "react";
import { Composition, registerRoot } from "remotion";
import { FPS } from "./kit";
import { DUR } from "./timing";
import { Reel } from "./Reel";
import { ReelCurrent } from "./ReelCurrent";
const comp = (id: string, c: unknown) => React.createElement(Composition, { key: id, id, component: c as React.FC<Record<string, unknown>>, durationInFrames: Math.round(DUR * FPS), fps: FPS, width: 1080, height: 1920, defaultProps: { layer: "all" } });
registerRoot(() => React.createElement(React.Fragment, null, comp("Reel", Reel), comp("ReelCurrent", ReelCurrent)));
