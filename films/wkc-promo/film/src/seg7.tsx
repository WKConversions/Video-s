// Segment 7 (placeholder until built from spec/seg7.md).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [862, 1005];
export const Seg7: React.FC<{ g: number }> = () => <AbsoluteFill style={{ background: C.night }} />;
