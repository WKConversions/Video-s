import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame } from "remotion";
import { fontsReady } from "./fonts";
import { C } from "./lib";
import { View, depth, proj, hash } from "./iso";
import { Box, WorldDefs } from "./draw";
import { BIZ, PEOPLE, walk, I0, I1, J0, J1, CELL } from "./map";

type P = { orbit: number; drift: number; dark: number; ppl: number; pr: number; screens: number; pv: number };
/** A front-face screen: local u along x (world), w down from the top (world), as an affine SVG transform. */
const faceM = (v: View, x0: number, y: number, z: number) => {
  const c = Math.cos(v.th), s = Math.sin(v.th), [ox, oy] = proj(v, x0, y, z);
  return `matrix(${c * v.s} ${s * 0.56 * v.s} 0 ${0.84 * v.s} ${ox} ${oy})`;
};
export const Proto: React.FC<P> = ({ orbit = 1, drift = 0, dark = 0, ppl = 170, pr = 7, screens = 0, pv = 1 }) => {
  const g = useCurrentFrame();
  const [h] = useState(() => delayRender("f"));
  const [ok, setOk] = useState(false);
  useEffect(() => { fontsReady.then(() => { setOk(true); continueRender(h); }); }, [h]);
  if (!ok) return null;
  const t = g / 30;
  const v: View = { th: ((40 + orbit * t) * Math.PI) / 180, s: 0.9, fx: drift * t, fy: -drift * t * 0.4, cx: 960, cy: 560 };
  const dots: React.ReactNode[] = [];
  for (let i = I0 * 2; i <= I1 * 2 + 2; i++) for (let j = J0 * 2; j <= J1 * 2 + 2; j++) {
    const [x, y] = proj(v, i * CELL / 2 - 50, j * CELL / 2 - 50);
    if (x < -20 || x > 1940 || y < -20 || y > 1100) continue;
    dots.push(<circle key={`${i},${j}`} cx={x} cy={y} r={2.2} fill={C.dot} />);
  }
  type It = { d: number; n: React.ReactNode };
  const items: It[] = [];
  for (const b of BIZ) {
    const tint = b.role === "comp" ? "ink" : "grey";
    const scr = screens && b.h > 40 ? (() => {
      const W = b.x1 - b.x0, top = b.h - 8, hh = Math.min(26, b.h - 18);
      const ph = hash(b.i, b.j, 21) * 10, sp = 0.6 + hash(b.i, b.j, 22);
      const bars = [0, 1, 2].map((k) => { const w = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * sp * 2 + ph + k * 1.7)); return <rect key={k} x={10} y={5 + k * 7} width={(W - 20) * w} height={4} rx={2} fill={b.role === "comp" ? C.blue : "#AEB4BC"} />; });
      return <g transform={faceM(v, b.x0 + 8, b.y1, top)}><rect x={0} y={0} width={W - 16} height={hh} rx={3} fill={b.role === "comp" ? "#0C1A28" : "#EFF0F2"} />{bars}</g>;
    })() : null;
    items.push({ d: depth(v, b.x1, b.y1), n: <g key={b.id}><Box v={v} x0={b.x0} y0={b.y0} x1={b.x1} y1={b.y1} s={{ h: b.h, tint }} dark={dark} />{scr}</g> });
  }
  for (let k = 0; k < ppl; k++) {
    const p = PEOPLE[k % PEOPLE.length];
    const q = k < PEOPLE.length ? p : { ...p, u0: p.u0 + 977 * (k / PEOPLE.length), lane: -p.lane, dir: (-p.dir) as 1 | -1 };
    const [wx, wy] = walk({ ...q, v: q.v * pv }, t);
    const [x, y] = proj(v, wx, wy);
    if (x < -30 || x > 1950 || y < -30 || y > 1110) continue;
    items.push({ d: depth(v, wx, wy) - 30, n: <circle key={`p${k}`} cx={x} cy={y - pr} r={pr} fill={C.ink} /> });
  }
  items.sort((a, b) => a.d - b.d);
  return (
    <AbsoluteFill style={{ background: C.page }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}><WorldDefs />
        {dots}
        {items.map((it) => it.n)}
      </svg>
    </AbsoluteFill>
  );
};
