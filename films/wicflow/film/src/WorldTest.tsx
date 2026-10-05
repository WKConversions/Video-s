import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender } from "remotion";
import { fontsReady } from "./fonts";
import { C } from "./lib";
import { View, depth } from "./iso";
import { Box, WorldDefs } from "./draw";
import { proj, pts } from "./iso";
import { CELL, GAP, I0, I1, J0, J1 } from "./world";
import { BLOCKS, centre, YOU } from "./world";

export const WorldTest: React.FC<{ s: number; th: number }> = ({ s = 0.8, th = 42 }) => {
  const [h] = useState(() => delayRender("fonts"));
  const [ok, setOk] = useState(false);
  useEffect(() => { fontsReady.then(() => { setOk(true); continueRender(h); }); }, [h]);
  if (!ok) return null;
  const [fx, fy] = centre(YOU);
  const v: View = { th: (th * Math.PI) / 180, s, fx, fy, cx: 1060, cy: 560 };
  const vis = [...BLOCKS].sort((a, b) => depth(v, a.x1, a.y1) - depth(v, b.x1, b.y1));
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}><WorldDefs />
        <polygon points={pts([proj(v, I0 * CELL - GAP, J0 * CELL - GAP), proj(v, (I1 + 1) * CELL, J0 * CELL - GAP), proj(v, (I1 + 1) * CELL, (J1 + 1) * CELL), proj(v, I0 * CELL - GAP, (J1 + 1) * CELL)])} fill="#F3F4F7" />
        {vis.map((b) => <Box key={b.id} v={v} x0={b.x0} y0={b.y0} x1={b.x1} y1={b.y1} s={{ h: b.h, tint: b.tint }} />)}
      </svg>
    </AbsoluteFill>
  );
};
