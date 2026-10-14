// Segment 8 (1002-1261): the "3" + three formats in the converging rings, the "Built for" carousel, the end card and
// the fade to black. Measured from the reference (spec/seg8.md), rebuilt in WKC's blues.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeShot } from "./seg8_three";
import { Carousel } from "./seg8_carousel";
import { EndShot } from "./seg8_end";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [1002, 1262];

export const Seg8: React.FC<{ g: number }> = ({ g }) => {
  // 1236-1261: linear fade to black (1.0 at 1236, 0.0 at 1261)
  const fade = g < 1236 ? 1 : Math.max(0, 1 - (g - 1236) / 25);
  const body = g < 1059 ? <ThreeShot g={g} /> : g < 1153 ? <Carousel g={g} /> : <EndShot g={g} />;
  if (fade >= 1) return body;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fade }}>{body}</AbsoluteFill>
    </AbsoluteFill>
  );
};
