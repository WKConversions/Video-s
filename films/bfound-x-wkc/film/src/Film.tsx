import React, { useEffect, useState } from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { fontsReady } from "./fonts";
import { WK } from "./lib";
import { Story } from "./Story";

export type FilmProps = { audio: boolean };

export const Film: React.FC<FilmProps> = ({ audio = true }) => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: WK.page }} />;
  return (
    <AbsoluteFill style={{ background: WK.page }}>
      <Story f={f} />
      {audio && (
        <Sequence from={0} layout="none">
          <Audio src={staticFile("audio/vo.wav")} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
