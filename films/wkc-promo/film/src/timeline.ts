// The segments in drawing order; each owns its frame range (RANGE in its file), so a transition can overlap two of them.
import React from "react";
import * as S1 from "./seg1";
import * as S2 from "./seg2";
import * as S3 from "./seg3";
import * as S4 from "./seg4";
import * as S5 from "./seg5";
import * as S6 from "./seg6";
import * as S7 from "./seg7";
import * as S8 from "./seg8";

export const DURATION = 1262; // 42.07 s (the script ends at 42.08 s; the reference is 1262 frames)
type Seg = { key: string; from: number; to: number; C: React.FC<{ g: number }> };
export const SEGMENTS: Seg[] = [
  { key: "s1", from: S1.RANGE[0], to: S1.RANGE[1], C: S1.Seg1 },
  { key: "s2", from: S2.RANGE[0], to: S2.RANGE[1], C: S2.Seg2 },
  { key: "s3", from: S3.RANGE[0], to: S3.RANGE[1], C: S3.Seg3 },
  { key: "s4", from: S4.RANGE[0], to: S4.RANGE[1], C: S4.Seg4 },
  { key: "s5", from: S5.RANGE[0], to: S5.RANGE[1], C: S5.Seg5 },
  { key: "s6", from: S6.RANGE[0], to: S6.RANGE[1], C: S6.Seg6 },
  { key: "s7", from: S7.RANGE[0], to: S7.RANGE[1], C: S7.Seg7 },
  { key: "s8", from: S8.RANGE[0], to: S8.RANGE[1], C: S8.Seg8 },
];
