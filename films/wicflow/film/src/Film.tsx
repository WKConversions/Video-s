// The film: one continuous stage under one breathing camera (motion/camera.md), with a running-mean motion blur around
// the camera; the sound (voice-over, music, effects: sound/cues.json) outside it.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Freeze, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { fontsReady } from "./fonts";
import { breathe } from "./kinetic";
import { C } from "./lib";
import { Story } from "./Story";
import { DURATION } from "./clock";

export const FILM_DURATION = DURATION;
export type FilmProps = { blurSamples: number; audio?: "mix" | "vo" | "none" };

/** Camera motion blur as a running mean: sample i is composited at opacity 1/(i+1) over the samples before it, so the
 *  result is the exact average. The shutter is 180°: the samples span half a frame back. */
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

const Camera: React.FC = () => {
  const g = useCurrentFrame();
  const cam = breathe(g, "rest", 0.03);
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill data-probe="camera" style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%", willChange: "transform" }}>
        <Story g={g} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Film: React.FC<FilmProps> = ({ blurSamples = 1, audio = "mix" }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.paper }} />;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {blurSamples > 1 ? <MotionBlur samples={blurSamples} shutterAngle={180}><Camera /></MotionBlur> : <Camera />}
      {/* sound outside the blur wrapper (it renders its children once per sample) */}
      {audio !== "none" && (
        <Sequence from={0} layout="none"><Audio src={staticFile(audio === "mix" ? "audio/mix.wav" : "audio/vo.wav")} /></Sequence>
      )}
    </AbsoluteFill>
  );
};
