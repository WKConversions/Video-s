// Future Unicorn Founders (1920 × 1080, 42.5 s). The stage: one scene per stretch of the voice-over (scenes/*.tsx),
// sharing the brand kit (scenes/brand.tsx). Keyed to the voice's words (src/clock.ts).
import React from "react";
import { INK } from "./scenes/brand";
import { Network } from "./scenes/Open";
import { Logo } from "./scenes/Logo";
import { Malaga } from "./scenes/Malaga";
import { Gatherings } from "./scenes/Gatherings";
import { NoCards } from "./scenes/NoCards";
import { Real } from "./scenes/Real";
import { One } from "./scenes/One";
import { End } from "./scenes/End";

export const Story: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "absolute", left: -60, top: -60, width: 2040, height: 1200, overflow: "hidden", background: INK }}>
    <div style={{ position: "absolute", left: 60, top: 60, width: 1920, height: 1080 }}>
      <Network g={g} />
      <Logo g={g} />
      <Malaga g={g} />
      <Gatherings g={g} />
      <NoCards g={g} />
      <Real g={g} />
      <One g={g} />
      <End g={g} />
    </div>
  </div>
);
