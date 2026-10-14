// Segment 8 (placeholder until built from spec/seg8.md).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [1005, 1262];
export const Seg8: React.FC<{ g: number }> = () => <AbsoluteFill style={{ background: C.night }} />;
