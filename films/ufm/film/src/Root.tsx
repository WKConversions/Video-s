import React, { useEffect, useState } from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Composition, continueRender, delayRender, staticFile } from "remotion";
import { Film } from "./Film";
import { DUR, FPS, SIZE, fontsReady } from "./kit";

type Props = { audio: "vo" | "mix" | "none" };
const Main: React.FC<Props> = ({ audio }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  return (
    <AbsoluteFill>
      {ready && <Film />}
      {audio === "vo" && <Audio src={staticFile("audio/vo.mp3")} />}
      {audio === "mix" && <Audio src={staticFile("audio/mix.wav")} />}
    </AbsoluteFill>
  );
};
export const Root: React.FC = () => (
  <Composition id="Film" component={Main} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={SIZE} height={SIZE} defaultProps={{ audio: "none" } as Props} />
);
