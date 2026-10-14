// Segment 7 preview entry (builder's tool only, not part of the film): renders Seg7 alone, so the stills of this
// segment can be made while other segments are mid-edit. Same stage, fonts and background as Film.tsx.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Composition, continueRender, delayRender, registerRoot, useCurrentFrame } from "remotion";
import { fontsReady } from "./fonts";
import { C } from "./lib";
import { Seg7, RANGE } from "./seg7";

const Only: React.FC = () => {
  const g = useCurrentFrame();
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.night }} />;
  return <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>{g >= RANGE[0] && g < RANGE[1] && <Seg7 g={g} />}</AbsoluteFill>;
};
const Root: React.FC = () => <Composition id="Seg7" component={Only} durationInFrames={1262} fps={30} width={1920} height={1080} />;
registerRoot(Root);
