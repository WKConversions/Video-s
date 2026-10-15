import React, { useEffect, useState } from "react";
import { AbsoluteFill, Composition, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, fontsReady } from "./tokens";
import { Recruiters } from "./Recruiters";
import { Companies } from "./Companies";

type Props = { audio?: "mix" | "none" };
const withFonts = (Film: React.FC<{ g: number }>, mix: string) => {
  const Comp: React.FC<Props> = ({ audio = "mix" }) => {
    const g = useCurrentFrame();
    const [handle] = useState(() => delayRender("fonts"));
    const [ready, setReady] = useState(false);
    useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
    if (!ready) return <AbsoluteFill style={{ background: C.page }} />;
    return (
      <AbsoluteFill style={{ background: C.page }}>
        <Film g={g} />
        {audio === "mix" && <Sequence from={0} layout="none"><Audio src={staticFile(`audio/${mix}`)} /></Sequence>}
      </AbsoluteFill>
    );
  };
  return Comp;
};
const RecruitersFilm = withFonts(Recruiters, "mix-recruiters.wav");
const CompaniesFilm = withFonts(Companies, "mix-companies.wav");

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Recruiters" component={RecruitersFilm} durationInFrames={1200} fps={30} width={1920} height={1080} defaultProps={{ audio: "none" } as Props} />
    <Composition id="Companies" component={CompaniesFilm} durationInFrames={1200} fps={30} width={1920} height={1080} defaultProps={{ audio: "none" } as Props} />
  </>
);
