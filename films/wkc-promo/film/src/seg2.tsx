// Segment 2 (placeholder until built from spec/seg2.md).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [150, 282];
export const Seg2: React.FC<{ g: number }> = () => <AbsoluteFill style={{ background: C.night }} />;
