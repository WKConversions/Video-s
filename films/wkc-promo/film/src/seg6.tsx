// Segment 6 (placeholder until built from spec/seg6.md).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [720, 862];
export const Seg6: React.FC<{ g: number }> = () => <AbsoluteFill style={{ background: C.night }} />;
