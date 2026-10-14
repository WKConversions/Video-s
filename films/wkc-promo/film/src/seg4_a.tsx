// Segment 4, shot A (387-428): the storyboard frames pop onto the pastel board as pixel mosaics, the WKC-blue
// "Storyboard" card grows in from the right with a horizontal smear and types its line, the camera settles and pushes
// in, and the Storyboard card de-rezzes into blocks before the hard cut to shot B (spec §3, §9.2).
import React from "react";
import { CAM, QA, SENDQ, TA2 } from "./seg4_data";
import { Arrow, CH, CW, HH, HW, StoryCard, StoryboardCard } from "./seg4_card";
import { HBlurDef, P2, Quad, QuadLayer, applyH, flatQuad, invH, mosaicId, rectToQuadH, rows, tab } from "./seg4_util";

const KEY: Record<string, string> = {
  c1r1: "DB2", c2r1: "GDrive", c3r1: "MySQL", c4r1: "Postgres4", c1r2: "Elastic", c3r2: "BigQuery", c4r2: "DB2c4",
  c1r3: "Postgres1", c2r3: "Jira", c3r3: "S3", c4r3: "MariaDB4", c1r4: "MariaDB1", c2r4: "Search", c3r4: "CreateDOC", c4r4: "Elastic4",
};
const REST: Record<string, { q: Quad; a: P2 }> = Object.fromEntries(QA.map((c) => [c.slot, { q: c.q as unknown as Quad, a: c.a as unknown as P2 }]));

/** TA1: the frame-420 layout point p at frame g */
const cam = (g: number, p: P2): P2 => {
  const [s, rot, tx, ty] = tab(CAM, g);
  const th = (rot * Math.PI) / 180, c = Math.cos(th), sn = Math.sin(th), vx = p[0] - 960, vy = p[1] - 540;
  return [960 + s * (c * vx - sn * vy) + tx, 540 + s * (sn * vx + c * vy) + ty];
};
/** a white card's screen quad at frame g (TA2 about the anchor, then TA1, then the screen offset) */
const cardQuad = (slot: string, g: number): Quad => {
  const { q, a } = REST[slot];
  const [s, dx, dy] = rows(TA2[KEY[slot]], g);
  return q.map(([x, y]) => {
    const [X, Y] = cam(g, [a[0] + s * (x - a[0]), a[1] + s * (y - a[1])]);
    return [X + dx, Y + dy];
  }) as Quad;
};
/** the connector arrows measured at 420 (screen x0, x1, y), carried by the card on their right */
const ARROWS: [string, number, number, number][] = [
  ["c2r1", 708, 755, 286], ["c3r1", 1224, 1265, 306], ["c4r1", 1677, 1710, 322], ["c4r2", 1678, 1709, 528],
  ["c2r3", 708, 755, 754], ["c3r3", 1227, 1265, 743], ["c4r3", 1680, 1710, 733], ["c2r4", 708, 750, 986], ["c3r4", 1228, 1262, 958], ["c4r4", 1680, 1700, 935],
];
const LOCAL_ARROWS: Record<string, { x0: number; x1: number; y: number }> = Object.fromEntries(ARROWS.map(([slot, x0, x1, y]) => {
  const Hi = invH(rectToQuadH(CW, CH, REST[slot].q));
  const p0 = applyH(Hi, x0, y), p1 = applyH(Hi, x1, y);
  return [slot, { x0: p0[0], x1: p1[0], y: (p0[1] + p1[1]) / 2 }];
}));

/** mosaic block size per frame from first-visible (16/8/4/3 px, then sharp), read off the reference card by card */
const MOS: Record<string, number[]> = {
  c1r1: [16, 16, 16, 16, 16, 8, 4], c2r1: [16, 16, 16, 16, 16, 8, 4], c3r1: [16, 16, 16, 16, 16, 16, 16, 8, 4], c4r1: [16, 16, 16, 16, 16, 8, 4],
  c1r2: [16, 16, 16, 16, 16, 8, 4], c3r2: [16, 16, 16, 16, 4, 3], c4r2: [16, 16, 16, 8], c1r3: [16, 16, 16, 16, 4, 3],
  c2r3: [16, 16, 16, 8, 4, 4, 3], c3r3: [16, 16, 8, 4], c4r3: [16, 16, 16, 16, 16, 8, 4, 4], c1r4: [16, 8, 4, 4],
  c2r4: [16, 8, 4, 4], c3r4: [16, 8, 4, 4], c4r4: [16, 8, 4, 4],
};
const block = (slot: string, g: number, f0: number) => MOS[slot][g - f0] ?? 0;
const Mosaic: React.FC<{ b: number; children: React.ReactNode; clip?: string }> = ({ b, children, clip }) =>
  b ? <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: `url(#${mosaicId(b)})`, clipPath: clip }}>{children}</div> : <>{children}</>;

const WhiteCard: React.FC<{ slot: string; g: number }> = ({ slot, g }) => {
  const f0 = TA2[KEY[slot]][0][0];
  if (g < f0) return null;
  const ar = LOCAL_ARROWS[slot];
  return (
    <Mosaic b={block(slot, g, f0)}>
      <QuadLayer w={CW} h={CH} q={cardQuad(slot, g)}>
        <StoryCard slot={slot} />
        {ar && <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}><Arrow x0={ar.x0} x1={ar.x1} y={ar.y} sw={2.7} head={7.5} /></svg>}
      </QuadLayer>
    </Mosaic>
  );
};

/** typed characters of "From brief to storyboard..." per frame (§9.2) */
const TYPED: [number, number][] = [[389, 2], [391, 3], [392, 4], [393, 5], [395, 8], [397, 9], [399, 11], [400, 12], [401, 13], [404, 15], [405, 16],
  [406, 17], [409, 20], [410, 21], [411, 22], [412, 23], [414, 24], [415, 25], [416, 26], [417, 27]];
const typed = (g: number) => { let n = 0; for (const [f, k] of TYPED) if (g >= f) n = k; return n; };
/** horizontal smear (10-90 % edge spread / 2.56 = Gaussian sigma) of the grow-in, 387-392 */
const SMEAR: Record<number, number> = { 387: 30, 388: 24, 389: 16.5, 390: 12, 391: 7.5, 392: 4.5 };

const SendCard: React.FC<{ g: number }> = ({ g }) => {
  const q = flatQuad(SENDQ[g] ?? SENDQ[428]);
  const card = <QuadLayer w={HW} h={HH} q={q}><StoryboardCard n={typed(g)} /></QuadLayer>;
  const sm = SMEAR[g];
  if (sm) return <><HBlurDef id="s4hz" s={sm / 2.56} /><div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: "url(#s4hz)" }}>{card}</div></>;
  if (g === 426) return <><Mosaic b={4} clip="inset(0 0 50% 0)">{card}</Mosaic><Mosaic b={8} clip="inset(50% 0 0 0)">{card}</Mosaic></>;
  const b = g >= 427 ? 8 : g >= 424 ? 4 : 0;
  return <Mosaic b={b}>{card}</Mosaic>;
};

export const ShotA: React.FC<{ g: number }> = ({ g }) => (
  <>
    {Object.keys(KEY).map((slot) => <WhiteCard key={slot} slot={slot} g={g} />)}
    <SendCard g={g} />
  </>
);
