// Segment 2 (frames 147–286, 4.90–9.53 s): "Explain. / Engage. / Convert." over the WKC Studio scene editor (shot A,
// 147–218), hard cut to the pastel "Or……… just look incredible." (shot B, 219–286). Built from spec/seg2.md; the shots
// live in seg2_a.tsx and seg2_b.tsx, the measured tables in seg2_data.tsx.
import React from "react";
import { ShotA } from "./seg2_a";
import { ShotB } from "./seg2_b";

/** the frames this segment draws: the reference cuts in at 147 and out at 287 */
export const RANGE: [number, number] = [147, 287];
export const Seg2: React.FC<{ g: number }> = ({ g }) => (g < 219 ? <ShotA g={g} /> : <ShotB g={g} />);
