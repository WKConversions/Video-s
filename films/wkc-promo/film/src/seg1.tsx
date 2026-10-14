// Segment 1 (placeholder until built from spec/seg1.md).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [0, 150];
export const Seg1: React.FC<{ g: number }> = () => <AbsoluteFill style={{ background: C.night }} />;
