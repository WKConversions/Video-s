// Segment 5 test entry: a root that renders only segment 5 (so test stills don't depend on the other segments'
// in-progress files). Used by the scratch stills script; the film itself uses src/index.ts.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Composition, continueRender, delayRender, registerRoot, useCurrentFrame } from "remotion";
import { fontsReady } from "./fonts";
import { C } from "./lib";
import { RANGE, Seg5 } from "./seg5";

const Only5: React.FC = () => {
  const g = useCurrentFrame();
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.night }} />;
  return <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>{g >= RANGE[0] && g < RANGE[1] && <Seg5 g={g} />}</AbsoluteFill>;
};
registerRoot(() => <Composition id="Film" component={Only5} durationInFrames={1262} fps={30} width={1920} height={1080} />);
