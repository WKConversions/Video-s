// Segment E (placeholder until its builder writes it).
import React from "react";
import { AbsoluteFill } from "remotion";
export const SegE: React.FC<{ t: number }> = ({ t }) => <AbsoluteFill style={{ opacity: t < 0 ? 0 : 1 }} />;
