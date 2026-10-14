// Segment 3 (placeholder until built from spec/seg3.md).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [282, 384];
export const Seg3: React.FC<{ g: number }> = () => <AbsoluteFill style={{ background: C.night }} />;
