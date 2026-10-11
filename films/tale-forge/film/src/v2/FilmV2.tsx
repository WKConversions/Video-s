// Film v2: storybook imagery all the way through. Hand-offs grow out of objects: the house door becomes Iris's face,
// night falls and the thread leads to the book, the book becomes the spread, Iris is drawn and painted, the page becomes
// the world (v1 scenes from here), the found ending's medallion opens into the conversation, its bubbles become the
// stars of the sky of adventures, the book becomes the astronaut's, Natt becomes Morgon.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Freeze, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { fontsReady } from "../fonts";
import { C, SETTLE, SOFT, lerp } from "../lib";
import { VO_AT } from "../clock";
import { HeroScene, MapScene, MorningScene, ReaderScene, ShelfScene, SkyScene, TogetherScene } from "../StoryWorld";
import { T2 } from "./clock2";
import { BookReveal, FaceScene, HomeScene } from "./Opening";
import { BookV2 } from "./BookV2";
import { TalkV2 } from "./TalkV2";

export type FilmV2Props = { blurSamples: number; audio?: "mix" | "vo" | "none" };

const MotionBlur: React.FC<{ samples: number; children: React.ReactNode }> = ({ samples, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: samples }, (_, i) => (
        <AbsoluteFill key={i} style={{ opacity: 1 / (i + 1) }}>
          <Freeze frame={Math.max(0, f - 0.5 * (i / Math.max(1, samples - 1)))}>{children}</Freeze>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

const Span: React.FC<{ g: number; a: string; b: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ g, a, b, children, style }) =>
  g >= T2.f(a) && g < T2.f(b) ? <AbsoluteFill style={style}>{children}</AbsoluteFill> : null;

const Stage: React.FC = () => {
  const g = useCurrentFrame();
  const s = 1.012 + 0.006 * Math.sin(g / 150);
  const x = 6 * Math.sin(g / 110), y = 4 * Math.cos(g / 130);
  const door = T2.k(g, "face", 0.75, SETTLE);          // Iris's face grows out of the house door's light (1510, 755)
  const doorClip = `circle(${lerp(40, 1500, door)}px at 1510px 755px)`;
  const med = T2.k(g, "talk2", 1.1, SETTLE);           // the conversation opens out of the ending's medallion (960, 520, r 330)
  const medClip = `circle(${lerp(330, 1250, med)}px at 960px 520px)`;
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill data-probe="camera" style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: "50% 50%", willChange: "transform" }}>
        <Span g={g} a="open" b="face+0.8"><HomeScene g={g} /></Span>
        <Span g={g} a="face" b="bookUp+1.2" style={{ clipPath: door < 1 ? doorClip : undefined }}><FaceScene g={g} /></Span>
        <Span g={g} a="night" b="bookUp+0.05"><BookReveal g={g} /></Span>
        <Span g={g} a="bookUp" b="adventure+1.0"><BookV2 g={g} /></Span>
        <Span g={g} a="adventure+0.95" b="inside2+1.25"><HeroScene g={g} /></Span>
        <Span g={g} a="inside2+1.2" b="map+0.8"><ReaderScene g={g} /></Span>
        <Span g={g} a="map" b="together+1.45" style={{ opacity: T2.k(g, "map", 0.5, SOFT) }}><MapScene g={g} /></Span>
        <Span g={g} a="together+1.4" b="close+1.0"><TogetherScene g={g} /></Span>
        <Span g={g} a="close+0.6" b="talk2+1.15" style={{ opacity: T2.k(g, "close+0.6", 0.35, SOFT) }}><ShelfScene g={g} /></Span>
        <Span g={g} a="talk2" b="sky+1.25" style={{ clipPath: med < 1 ? medClip : undefined }}><TalkV2 g={g} /></Span>
        <Span g={g} a="sky" b="tomorrow+0.45" style={{ opacity: T2.k(g, "sky", 1.2, SOFT) }}><SkyScene g={g} /></Span>
        <Span g={g} a="tomorrow" b="end+1" style={{ opacity: T2.k(g, "tomorrow", 0.4, SOFT) }}><MorningScene g={g} /></Span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FilmV2: React.FC<FilmV2Props> = ({ blurSamples = 1, audio = "mix" }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: C.night }} />;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {blurSamples > 1 ? <MotionBlur samples={blurSamples}><Stage /></MotionBlur> : <Stage />}
      {audio === "mix" && <Sequence from={0} layout="none"><Audio src={staticFile("audio/mix-v2.wav")} /></Sequence>}
      {audio === "vo" && <Sequence from={Math.round(VO_AT * 30)} layout="none"><Audio src={staticFile("audio/vo.wav")} /></Sequence>}
    </AbsoluteFill>
  );
};
