// Segment 3 preview entry (builder's tool only, not part of the film): renders Seg3 alone, so its stills don't depend on
// the other segments' in-progress files (seg 4's placeholder still overlaps 384–386). Same stage and fonts as Film.tsx.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Composition, continueRender, delayRender, registerRoot, useCurrentFrame } from "remotion";
import { fontsReady } from "./fonts";
import { C } from "./lib";
import { RANGE, Seg3 } from "./seg3";

const Only3: React.FC = () => {
  const g = useCurrentFrame();
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.night }} />;
  return <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>{g >= RANGE[0] && g < RANGE[1] && <Seg3 g={g} />}</AbsoluteFill>;
};
registerRoot(() => <Composition id="Film" component={Only3} durationInFrames={1262} fps={30} width={1920} height={1080} />);
