// Film v2: Tale Forge's own storybook pages, light and paper (no drawings). One evening goes into a book and comes back
// as something to talk about: S1 at dusk, the blank Tale Forge book opens on "story", today's moment is laid on its page,
// the hero and her world are painted in, the characters, reading together, four endings, the first page seen again,
// the book closes and opens, the conversation, then the sky of adventures and Morgon.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Freeze, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { fontsReady } from "../fonts";
import { C, SETTLE, SOFT, lerp } from "../lib";
import { VO_AT } from "../clock";
import { MorningScene, SkyScene } from "../StoryWorld";
import { T2 } from "./clock2";
import { BookReveal, OpeningS1 } from "./Opening";
import { EndsSee, HeroV2, MeetV2, ReadV2 } from "./StoryV2";
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
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill data-probe="camera" style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: "50% 50%", willChange: "transform" }}>
        <Span g={g} a="open" b="bookUp+0.05"><OpeningS1 g={g} /></Span>
        <Span g={g} a="night" b="bookUp+0.05"><BookReveal g={g} /></Span>
        <Span g={g} a="bookUp" b="w:adventure+0.4"><BookV2 g={g} /></Span>
        <Span g={g} a="w:adventure+0.35" b="w:inside"><HeroV2 g={g} /></Span>
        <Span g={g} a="w:inside-0.12" b="w:read-0.3"><MeetV2 g={g} /></Span>
        <Span g={g} a="w:they4-0.2" b="w:change-0.08"><ReadV2 g={g} /></Span>
        <Span g={g} a="w:change-0.12" b="w:a6+0.02"><EndsSee g={g} /></Span>
        <Span g={g} a="w:a6-0.02" b="sky+1.25"><TalkV2 g={g} /></Span>
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
