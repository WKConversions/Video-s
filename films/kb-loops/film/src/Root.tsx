import React from "react";
import { Composition } from "remotion";
import { FPS, FRAMES, W, H } from "./loop";
import { Loop as Goteborgsvarvet } from "./cases/goteborgsvarvet";
import { Loop as SocialImpactFactory } from "./cases/social-impact-factory";
import { Loop as AbroadInternships } from "./cases/abroad-internships";
import { Loop as Jongleren } from "./cases/jongleren";
import { Loop as Gohere } from "./cases/gohere";
import { Loop as TopJobsAbroad } from "./cases/top-jobs-abroad";
import { Loop as VinoMio } from "./cases/vino-mio";
import { Loop as H2oWaterCoolers } from "./cases/h2o-water-coolers";

// one 10 s seamless loop per K.B client case (cases/<slug>.tsx)
export const Root: React.FC = () => (
  <>
    <Composition id="goteborgsvarvet" component={Goteborgsvarvet} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="social-impact-factory" component={SocialImpactFactory} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="abroad-internships" component={AbroadInternships} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="jongleren" component={Jongleren} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="gohere" component={Gohere} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="top-jobs-abroad" component={TopJobsAbroad} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="vino-mio" component={VinoMio} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="h2o-water-coolers" component={H2oWaterCoolers} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
  </>
);
