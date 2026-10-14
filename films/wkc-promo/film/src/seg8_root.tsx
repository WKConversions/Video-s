// Segment 8 preview root (for the segment builder's stills only; not part of the film's entry): fonts + Seg8 alone.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Composition, continueRender, delayRender, registerRoot, useCurrentFrame } from "remotion";
import { fontsReady } from "./fonts";
import { C } from "./lib";
import { Seg8, RANGE } from "./seg8";

const Only8: React.FC = () => {
  const g = useCurrentFrame();
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.night }} />;
  return <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>{g >= RANGE[0] && g < RANGE[1] && <Seg8 g={g} />}</AbsoluteFill>;
};
const Root: React.FC = () => <Composition id="Seg8" component={Only8} durationInFrames={1262} fps={30} width={1920} height={1080} />;
registerRoot(Root);
