import React from "react";
import { Composition, registerRoot } from "remotion";
import { DUR, FPS, Loop, SIZES } from "./Iso";
import type { Fmt } from "./Iso";
const ID: Record<Fmt, string> = { square: "Square", portrait: "Portrait", story: "Story", wide: "Wide" };
registerRoot(() => React.createElement(React.Fragment, null, (Object.keys(SIZES) as Fmt[]).map((fmt) =>
  React.createElement(Composition, { key: fmt, id: ID[fmt], component: Loop as unknown as React.FC<Record<string, unknown>>, durationInFrames: DUR, fps: FPS, width: SIZES[fmt][0], height: SIZES[fmt][1], defaultProps: { fmt } }))));
