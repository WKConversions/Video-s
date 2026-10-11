// The film: one continuous stage whose camera is the world's own view (src/cam.ts), with a running-mean motion blur;
// the sound (voice-over, music, effects: sound/cues.json) outside it.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Freeze, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { fontsReady } from "./fonts";
import { C } from "./lib";
import { Story } from "./Story";
import { DURATION } from "./clock";

export const FILM_DURATION = DURATION;
export type FilmProps = { blurSamples: number; audio?: "mix" | "vo" | "none" };

/** Motion blur as a running mean: sample i is composited at opacity 1/(i+1) over the samples before it, so the result
 *  is the exact average. The shutter is 180°: the samples span half a frame back. */
const MotionBlur: React.FC<{ samples: number; shutterAngle?: number; children: React.ReactNode }> = ({ samples, shutterAngle = 180, children }) => {
  const f = useCurrentFrame();
  const span = shutterAngle / 360;
  return (
    <AbsoluteFill>
      {Array.from({ length: samples }, (_, i) => (
        <AbsoluteFill key={i} style={{ opacity: 1 / (i + 1) }}>
          <Freeze frame={Math.max(0, f - span * (i / Math.max(1, samples - 1)))}>{children}</Freeze>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

const Stage: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.page, overflow: "hidden" }}>
      <Story g={g} />
    </AbsoluteFill>
  );
};

export const Film: React.FC<FilmProps> = ({ blurSamples = 1, audio = "mix" }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.page }} />;
  return (
    <AbsoluteFill style={{ background: C.page }}>
      {blurSamples > 1 ? <MotionBlur samples={blurSamples} shutterAngle={180}><Stage /></MotionBlur> : <Stage />}
      {audio !== "none" && (
        <Sequence from={0} layout="none"><Audio src={staticFile(audio === "mix" ? "audio/mix.wav" : "audio/vo.wav")} /></Sequence>
      )}
    </AbsoluteFill>
  );
};
