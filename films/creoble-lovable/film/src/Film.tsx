// The film: the shot list on a 1920 × 1080 stage, and the mixed sound (sound/cues.json → public/audio/mix.wav).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { fontsReady } from "./fonts";
import { C } from "./lib";
import { DURATION, Story } from "./Story";

export const FILM_DURATION = DURATION;
export type FilmProps = { blurSamples: number; audio?: "mix" | "none" };

export const Film: React.FC<FilmProps> = ({ audio = "mix" }) => {
  const g = useCurrentFrame();
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.paper }} />;
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <Story g={g} />
      {audio !== "none" && <Sequence from={0} layout="none"><Audio src={staticFile("audio/mix.wav")} /></Sequence>}
    </AbsoluteFill>
  );
};
