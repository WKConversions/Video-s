import React from "react";
import { AbsoluteFill } from "remotion";
import { Mark } from "./ui";

export const MarkTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff", flexDirection: "row", flexWrap: "wrap", gap: 30, padding: 40 }}>
    {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 0.95, 1].map((r, i) => <Mark key={i} w={420} reveal={r} id={`m${i}`} />)}
  </AbsoluteFill>
);
