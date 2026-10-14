// Segment 5 (frames 530-717, spec/seg5.md): the "Export" click (shot 1, 530-578), then a pull-back through three
// showcases of finished WKC client work: the 10deg tilted collage of scrolling columns (579-605), the floating phone
// screens (606-648) and the delivery dashboard with the two "Video Is Ready!" toasts (649-717). Hard cuts at
// 529->530, 578->579, 605->606, 648->649 and 717->718, each hidden inside the continuous camera pull-back.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Shot1 } from "./seg5_s1";
import { Shot2 } from "./seg5_s2";
import { Shot3 } from "./seg5_s3";
import { Shot4 } from "./seg5_s4";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [530, 718];

export const Seg5: React.FC<{ g: number }> = ({ g }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    {g < 579 ? <Shot1 g={g} /> : g < 606 ? <Shot2 g={g} /> : g < 649 ? <Shot3 g={g} /> : <Shot4 g={g} />}
  </AbsoluteFill>
);
