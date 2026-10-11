// The stage: the colour fields, then the sections in order. The camera never moves; everything is content motion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Fields } from "./Fields";
import { SectionA } from "./SectionA";
import { SectionB } from "./SectionB";
import { SectionC } from "./SectionC";

export const Story: React.FC<{ g: number }> = ({ g }) => (
  <AbsoluteFill>
    <Fields g={g} />
    <SectionA g={g} />
    <SectionB g={g} />
    <SectionC g={g} />
  </AbsoluteFill>
);
