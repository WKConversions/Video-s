// Segment 4 (placeholder until built from spec/seg4.md).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [384, 531];
export const Seg4: React.FC<{ g: number }> = () => <AbsoluteFill style={{ background: C.night }} />;
