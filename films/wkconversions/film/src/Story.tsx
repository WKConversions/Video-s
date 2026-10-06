// The one continuous stage: the world (city, crowd, routes), a soft paper scrim under the captions, the screen-facing
// cards, the captions, the end card.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib";
import { World } from "./World";
import { Cards } from "./Cards";
import { Captions } from "./Captions";
import { Finale } from "./Finale";

export const Story: React.FC<{ g: number }> = ({ g }) => (
  <AbsoluteFill style={{ background: C.page }}>
    <World g={g} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "radial-gradient(ellipse 820px 200px at 470px 960px, rgba(247,247,248,0.9), rgba(247,247,248,0.55) 55%, rgba(247,247,248,0) 100%)" }} />
    <Cards g={g} />
    <Captions g={g} />
    <Finale g={g} />
  </AbsoluteFill>
);
