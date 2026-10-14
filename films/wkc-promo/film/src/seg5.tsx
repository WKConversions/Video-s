// Segment 5 (placeholder until built from spec/seg5.md).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [531, 720];
export const Seg5: React.FC<{ g: number }> = () => <AbsoluteFill style={{ background: C.night }} />;
