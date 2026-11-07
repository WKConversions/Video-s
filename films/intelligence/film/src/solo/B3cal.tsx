// calibration views: pages at 1:1 (screen px) in a 1920 x 540 window, one view per frame
import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { C } from "../kit";
import { Pg03, Pg13, Pg16, Pg17, Pg18 } from "../scenes/b3-screens";
import "../scenes/b3-lib";
const VIEWS: { pg: string; x: number; y: number }[] = [
  { pg: "03", x: 700, y: 300 }, { pg: "03", x: 700, y: 800 }, { pg: "13", x: 700, y: 330 }, { pg: "13", x: 700, y: 690 },
  { pg: "13", x: 700, y: 1100 }, { pg: "16", x: 700, y: 380 }, { pg: "16", x: 700, y: 700 }, { pg: "16", x: 700, y: 1000 },
  { pg: "17", x: 700, y: 60 }, { pg: "17", x: 700, y: 440 }, { pg: "17", x: 700, y: 780 }, { pg: "18", x: 700, y: 450 },
];
const Cal: React.FC = () => {
  const v = VIEWS[useCurrentFrame()];
  return (
    <div style={{ width: 1920, height: 540, position: "relative", overflow: "hidden", background: C.page }}>
      <div style={{ position: "absolute", left: -v.x, top: -v.y, width: 2559, height: 4000 }}>
        {v.pg === "03" ? <Pg03 t={34.6} /> : v.pg === "13" ? <Pg13 t={40} /> : v.pg === "16" ? <Pg16 /> : v.pg === "17" ? <Pg17 /> : <Pg18 />}
      </div>
    </div>
  );
};
registerRoot(() => <Composition id="Cal" component={Cal} durationInFrames={VIEWS.length} fps={60} width={1920} height={540} />);
