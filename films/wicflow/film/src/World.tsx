// The world, drawn as one SVG per frame: the district fields on the paper, the loop of plates and its spurs, the routes,
// the blocks (depth-sorted), the team, the dots. Every state comes from src/scene.ts and the labels in src/clock.ts.
import React from "react";
import { T } from "./clock";
import { C, clamp01, lerp, mix, rgba } from "./lib";
import { depth, proj, pts, View } from "./iso";
import { Box, BoxState, WorldDefs, groundRing } from "./draw";
import { EASE } from "./kinetic";
import {
  ANNA, ANNA_TO_CRM, BIZ, BIZ_START, CRM, DESK, FAR, LOOP, MARKET, PLATES, SPURS, TEAM, TOOL_TILES, TO_ANNA, VIEW, along, loopPoint, part, route,
} from "./map";
import { ARRIVE, DEPART, MOVE, bizOffset, bizRise, bizView, dim, dot, FLOOR, gone, k, marketLift, rise, roofXY, s, waveIn } from "./scene";

type Item = { d: number; el: React.ReactNode };
const line = (v: View, p: [number, number][], z = 0) => pts(p.map(([x, y]) => proj(v, x, y, z)));

const Pawn: React.FC<{ v: View; x: number; y: number; u: number; o?: number }> = ({ v, x, y, u, o = 1 }) => {
  if (u <= 0 || o <= 0) return null;
  const sc = ARRIVE(u), q = 1.35;
  const [bx, by] = proj(v, x, y, 0), [hx, hy] = proj(v, x, y, 58 * q * sc);
  return (
    <g opacity={o * clamp01(u * 3)}>
      <ellipse cx={bx + 10} cy={by + 4} rx={28} ry={11} fill={rgba("#17171B", 0.1)} filter="url(#soft)" />
      <path d={`M ${bx - 17 * q} ${by} Q ${bx - 16 * q} ${hy + 22 * q} ${bx} ${hy + 16 * q} Q ${bx + 16 * q} ${hy + 22 * q} ${bx + 17 * q} ${by} Q ${bx} ${by + 8 * q} ${bx - 17 * q} ${by} Z`} fill={C.ink} />
      <circle cx={hx} cy={hy} r={13 * q * sc} fill={C.ink} />
    </g>
  );
};

/** A ground field in one of the site's tints, growing out of a point (radial, as on the site's service panels). */
const Field: React.FC<{ v: View; id: string; x: number; y: number; r: number; tint: readonly string[]; o?: number }> = ({ v, id, x, y, r, tint, o = 1 }) =>
  r <= 1 || o <= 0 ? null : (
    <g opacity={o}>
      <defs><radialGradient id={id}><stop offset="0" stopColor={tint[2]} /><stop offset="0.55" stopColor={tint[1]} /><stop offset="0.85" stopColor={tint[0]} /><stop offset="1" stopColor={tint[0]} stopOpacity={0} /></radialGradient></defs>
      <polygon points={pts(groundRing(v, x, y, r, 64))} fill={`url(#${id})`} />
    </g>
  );

export const World: React.FC<{ g: number }> = ({ g }) => {
  const v = VIEW(g);
  const t = s(g);
  const at = (l: string) => T.s(l);
  const items: Item[] = [];
  const add = (d: number, el: React.ReactNode) => items.push({ d, el });
  const box = (key: string, r: { x0: number; y0: number; x1: number; y1: number }, st: BoxState, extra = 0) =>
    add(depth(v, r.x1, r.y1) + extra, <Box key={key} v={v} x0={r.x0} y0={r.y0} x1={r.x1} y1={r.y1} s={st} />);
  const D = dim(g);                       // the pilot dim
  const G = gone(g);                      // hidden under the blue field, then only the business remains
  const keep = 1 - G;

  // ---------- the business: base (ink) and the three floors that grow out of the tints ----------
  const [ox, oy] = bizOffset(g);
  const bz = { x0: BIZ.x0 + ox, y0: BIZ.y0 + oy, x1: BIZ.x1 + ox, y1: BIZ.y1 + oy };
  const endFade = 1 - k(g, "out", 0.45, MOVE);
  const bh = BIZ.h * bizRise(g);
  const fl = [k(g, "f1", 0.32), k(g, "f2", 0.32), k(g, "f3", 0.32)];
  const tints: ["sand", "sage", "blue"] = ["sand", "sage", "blue"];
  // the shadow turns like a sundial on "lasts"
  const sweep = k(g, "lasts", 1.0, EASE.soft);
  const shAng = Math.atan2(0.35, 1) - sweep * (Math.PI * 2 / 3);
  const totalH = bh + FLOOR * (fl[0] + fl[1] + fl[2]);
  if (bh > 0.5) {
    const v = bizView(g);
    const bizEls: React.ReactNode[] = [];
    bizEls.push(<Box key="biz" v={v} {...bz} s={{ h: totalH, tint: "ink", o: endFade, shadowAng: shAng, shadowO: 0.09 + 0.09 * k(g, "lasts-0.25", 0.4), topFill: "#2A2A30" }} />);
    // draw the floors over the ink body: each one a tinted band with an ink roof on top of the stack
    let z = bh;
    fl.forEach((f, i) => {
      if (f <= 0) return;
      bizEls.push(<Box key={`fl${i}`} v={v} {...bz} shadow={false} s={{ h: FLOOR * f, z0: z, tint: tints[i], o: endFade, topFill: i === 2 || fl[i + 1] <= 0 ? "#2A2A30" : undefined }} />);
      z += FLOOR * f;
    });
    // the seams lock: an ink hairline sweeps up the floor joints on "lasts"
    const lock = k(g, "lasts", 0.6);
    if (lock > 0) for (let i = 0; i < 3; i++) {
      const zz = bh + FLOOR * i;
      const a = proj(v, bz.x0, bz.y1, zz), b = proj(v, bz.x1, bz.y1, zz), c = proj(v, bz.x1, bz.y0, zz);
      const u = clamp01(lock * 3 - i);
      bizEls.push(<polyline key={`seam${i}`} points={pts([a, b, c])} fill="none" stroke={C.inkStrong} strokeWidth={2.4} pathLength={1} strokeDasharray={`${u} 1`} opacity={endFade} />);
    }
    // "that lasts": a sundial's ring on the ground round the building, three hour ticks; the shadow sweeps across it
    const dial = k(g, "lasts-0.25", 0.4) * endFade;
    if (dial > 0) {
      const R = 230;
      bizEls.unshift(<polyline key="dial" points={pts(groundRing(v, ox, oy, R * (0.9 + 0.1 * dial), 96))} fill="none" stroke={C.ink} strokeOpacity={0.28 * dial} strokeWidth={1.6} />);
      [0, 1, 2, 3].forEach((i) => {
        const a = Math.atan2(0.35, 1) - (i * Math.PI * 2) / 9;
        const p1 = proj(v, ox + Math.cos(a) * (R - 18), oy + Math.sin(a) * (R - 18)), p2 = proj(v, ox + Math.cos(a) * (R + 10), oy + Math.sin(a) * (R + 10));
        bizEls.unshift(<line key={`tick${i}`} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={C.ink} strokeOpacity={0.4 * dial} strokeWidth={2.4} strokeLinecap="round" />);
      });
    }
    add(depth(v, bz.x1, bz.y1), <g key="bizg">{bizEls}</g>);
  }
  // the business's first footprint: drawn on as it rises, left as a dashed outline when it moves, fading
  const fp0 = k(g, "open", 0.18, MOVE), fpGone = k(g, "fwd+0.4", 0.6);
  const fpRect: [number, number][] = [[BIZ.x0 + BIZ_START[0], BIZ.y0 + BIZ_START[1]], [BIZ.x1 + BIZ_START[0], BIZ.y0 + BIZ_START[1]], [BIZ.x1 + BIZ_START[0], BIZ.y1 + BIZ_START[1]], [BIZ.x0 + BIZ_START[0], BIZ.y1 + BIZ_START[1]], [BIZ.x0 + BIZ_START[0], BIZ.y0 + BIZ_START[1]]];

  // ---------- the market ----------
  MARKET.forEach((m) => {
    const u = waveIn(g, (m.x0 + m.x1) / 2, (m.y0 + m.y1) / 2);
    if (u <= 0) return;
    const ml = marketLift(g, m);
    const isAnna = m === ANNA;
    // "marketing": the market's tops ripple pale blue from the centre
    const rip = clamp01((t - at("marketing") - Math.hypot((m.x0 + m.x1) / 2 + 520, (m.y0 + m.y1) / 2 + 545) / 1400) / 0.25);
    const o = (isAnna ? 1 : 1 - D) * keep;
    const bump = 1 + 0.25 * Math.sin(Math.PI * rip);
    box(m.id, m, { h: m.h * rise(u) * ml * keep * bump, tint: "grey", to: "blue", k: rip, topFill: rip > 0 ? mix("#FFFFFF", C.tBlue[2], rip) : undefined, o, edge: isAnna ? k(g, "lock", 0.3) * (1 - k(g, "gather", 0.4)) : 0 });
  });

  // ---------- the pilot, scaled: eight more companies rise across the map ----------
  COPIES.forEach((m, i) => {
    const u = clamp01((t - at("scale") - i * 0.067) / 0.36);
    if (u <= 0) return;
    const won = i < 6 ? k(g, T.s("customers") - 0.08 + i * 0.05, 0.3) : 0;
    box(m.id, m, { h: m.h * rise(u) * keep, tint: "grey", to: "blue", k: won, o: keep * clamp01(u * 3), edge: won });
  });

  // ---------- the CRM cabinet, its drawer ----------
  const crmU = k(g, "sales-0.05", 0.36);
  if (crmU > 0) {
    const open = k(g, "drawer", 0.33) * (1 - k(g, "drawerIn", 0.27, DEPART));
    const lit = k(g, "drawerIn", 0.3);
    box("crm", CRM, { h: CRM.h * crmU * keep, tint: "sage", o: (1 - D) * keep });
    // drawer bands on the front face and the top drawer sliding out (toward the viewer: +y)
    const bands: React.ReactNode[] = [];
    [0.3, 0.55, 0.8].forEach((f, i) => {
      const z = CRM.h * crmU * f;
      bands.push(<polyline key={`band${i}`} points={line(v, [[CRM.x0 + 8, CRM.y1], [CRM.x1 - 8, CRM.y1]], z)} stroke={rgba("#17171B", 0.18)} strokeWidth={1.5} />);
    });
    add(depth(v, CRM.x1, CRM.y1) + 0.5, <g key="bands" opacity={(1 - D) * keep}>{bands}</g>);
    if (open > 0 || lit > 0) {
      const dz = CRM.h * 0.8, dy = 46 * open;
      const dr = { x0: CRM.x0 + 10, y0: CRM.y1 - 40 + dy, x1: CRM.x1 - 10, y1: CRM.y1 + dy };
      add(depth(v, dr.x1, dr.y1) + 1, <Box key="drawer" v={v} {...dr} shadow={false} s={{ h: CRM.h * 0.2 - 4, z0: dz - CRM.h * 0.2 + 2, tint: "sage", edge: lit, o: (1 - D) * keep }} />);
    }
  }

  // ---------- the tool plot: 15 low tiles rising row by row ----------
  TOOL_TILES.forEach((tl) => {
    const u = k(g, `tools+${(tl.row * 0.33 + tl.col * 0.035).toFixed(3)}`, 0.36);
    if (u <= 0) return;
    box(tl.id, tl, { h: 8 * rise(u) * keep, tint: "grey", o: (1 - Math.max(D, 0.62 * k(g, "dim", 0.4, MOVE))) * keep });
  });

  // ---------- the team and the desk with the paper stack ----------
  TEAM.forEach(([x, y], i) => add(depth(v, x + 12, y + 12), <Pawn key={`p${i}`} v={v} x={x} y={y} u={clamp01((t - 0.12 - i * 0.07) / 0.35)} o={(1 - D) * keep} />));
  const deskU = k(g, "work-0.05", 0.33);
  if (deskU > 0) {
    box("desk", DESK, { h: DESK.h * deskU, tint: "sand", o: (1 - D) * keep });
    // six sheets land one after another (B13); on "less" four lift off and fold into dots
    for (let i = 0; i < 6; i++) {
      const land = clamp01((t - at("work") - 0.1 - i * 0.07) / 0.2);
      if (land <= 0) continue;
      const leave = i >= 2 ? clamp01((t - at("less") - (5 - i) * 0.2) / 0.25) : 0;
      if (leave >= 1) continue;
      const z = DESK.h + 4 + i * 5 + (1 - ARRIVE(land)) * 40 + ARRIVE(leave) * 50;
      const sh = { x0: DESK.x0 + 18 + (i % 2) * 3, y0: DESK.y0 + 12, x1: DESK.x1 - 14 - (i % 2) * 3, y1: DESK.y1 - 10 };
      add(depth(v, DESK.x1, DESK.y1) + 2 + i, <Box key={`sheet${i}`} v={v} {...sh} shadow={false} s={{ h: 3, z0: z, tint: "grey", o: clamp01(land * 3) * (1 - leave) * (1 - D) * keep }} />);
    }
  }
  items.sort((a, b) => a.d - b.d);

  // ---------- ground: fields, loop, spurs, routes, rings ----------
  const ground: React.ReactNode[] = [];
  const fieldR = (l: string) => 330 * k(g, l, 0.5);
  const conv = k(g, "turn", 0.8, MOVE);                                  // the tints slide in under the business
  const toBiz = (x: number, y: number): [number, number] => [lerp(x, ox, conv), lerp(y, oy, conv)];
  const fieldO = (1 - D * 0.8) * (1 - k(g, "f1", 0.5)) * endFade;
  if (G < 1 || conv > 0) {
    const fr = (r: number) => r * lerp(1, 0.45, conv);
    const sage = toBiz(40, -520), blue = toBiz(-456, -456), sand = toBiz(-360, 200);
    ground.push(<Field key="fs" v={v} id="fs" x={sage[0]} y={sage[1]} r={fr(fieldR("sales") * 0.85)} tint={C.tSage} o={fieldO} />);
    ground.push(<Field key="fb" v={v} id="fb" x={blue[0]} y={blue[1]} r={fr(fieldR("marketing") * 1.6)} tint={C.tBlue} o={fieldO} />);
    ground.push(<Field key="fn" v={v} id="fn" x={sand[0]} y={sand[1]} r={fr(fieldR("work") * 0.95)} tint={C.tSand} o={fieldO} />);
    // the team's own spot: a small sand ring on "your team" (P2), before the desk and its field arrive
    const tm = k(g, "w:team-0.13", 0.4) * (1 - k(g, "fwd", 0.4));
    if (tm > 0) ground.push(<polygon key="teamRing" points={pts(groundRing(v, -435, 95, 170 * (0.6 + 0.4 * tm), 64))} fill={C.tSand[1]} stroke={C.tSand[2]} strokeWidth={2} opacity={tm} />);
  }
  if (fp0 > 0 && fpGone < 1)
    ground.push(<polyline key="fp" points={line(v, fpRect)} fill="none" stroke={C.ink} strokeOpacity={0.35 * (1 - fpGone)} strokeWidth={1.6} pathLength={1}
      strokeDasharray={t < at("fwd") ? `${fp0} 1` : "0.012 0.012"} />);

  // the loop: a hairline drawn with the plates, lit blue on "systems"
  const loopDraw = k(g, "builds", 1.0, EASE.steady);
  const lit = k(g, "live", 0.27, MOVE);
  const loopO = (1 - D) * keep;
  if (loopDraw > 0) {
    const n = Math.round(160 * loopDraw);
    const lp = Array.from({ length: n + 1 }, (_, i) => loopPoint(i / 160));
    ground.push(<polyline key="loopH" points={line(v, lp)} fill="none" stroke={C.line} strokeWidth={2} opacity={loopO} />);
    if (lit > 0) {
      const m = Math.round(160 * lit);
      ground.push(<polyline key="loopB" points={line(v, Array.from({ length: m + 1 }, (_, i) => loopPoint(i / 160)))} fill="none" stroke={C.blue} strokeWidth={3} opacity={loopO * 0.85} strokeLinecap="round" />);
    }
    for (let i = 0; i < PLATES; i++) {
      const u = clamp01((t - at("builds") - i * 0.067) / 0.2);
      if (u <= 0) continue;
      const [x, y] = loopPoint(i / PLATES);
      const drop = (1 - EASE.impact(u)) * 34;
      const q = 24;
      const pa = clamp01((t - at("run") - EASE.steady(i / PLATES) * 1.0) / 0.1);
      const passed = pa * (1 - 0.6 * clamp01((t - at("run") - EASE.steady(i / PLATES) * 1.0 - 0.25) / 0.4));
      ground.push(<polygon key={`pl${i}`} points={pts([proj(v, x - q, y - q, drop), proj(v, x + q, y - q, drop), proj(v, x + q, y + q, drop), proj(v, x - q, y + q, drop)])}
        fill="#FFFFFF" stroke={passed > 0 ? mix(C.line, C.blue, passed) : C.line} strokeWidth={1.5 + passed} opacity={clamp01(u * 2) * loopO} />);
    }
  }
  // spurs: dashed grey from the loop to each object, solid blue on "connects" (a sweep spreading out from the business)
  const spurIn = k(g, "builds+0.9", 0.4);
  if (spurIn > 0)
    SPURS.forEach((sp) => {
      const dist = Math.hypot(sp.to[0], sp.to[1]);
      const solid = clamp01((t - at("connects") - dist / 2600) / 0.3);
      const o = spurIn * (1 - D) * keep;
      ground.push(<polyline key={`sp${sp.id}`} points={line(v, [sp.from, sp.to])} stroke={C.line} strokeWidth={2} strokeDasharray="6 8" fill="none" opacity={o * (1 - solid)} />);
      if (solid > 0) ground.push(<polyline key={`spb${sp.id}`} points={line(v, [sp.from, [lerp(sp.from[0], sp.to[0], EASE.steady(solid)), lerp(sp.from[1], sp.to[1], EASE.steady(solid))]])} stroke={C.blue} strokeWidth={3} strokeLinecap="round" fill="none" opacity={o} />);
      // one pulse runs along each link once
      const pu = clamp01((t - at("connects") - 0.3 - dist / 2600) / 0.5);
      if (pu > 0 && pu < 1) { const [x, y] = proj(v, lerp(sp.from[0], sp.to[0], pu), lerp(sp.from[1], sp.to[1], pu)); ground.push(<circle key={`spp${sp.id}`} cx={x} cy={y} r={6} fill={C.blue} opacity={o} />); }
    });

  // the route forward (P3): the dot draws it as it leads the business
  const fwdU = k(g, "fwd", 0.85, EASE.longS);
  if (fwdU > 0) {
    const r = route([[BIZ_START[0] + 160, BIZ_START[1] + 40], [BIZ_START[0] + 160, BIZ_START[1] + 40 - 160], [160, -120]]);
    const fade = k(g, "fwd+1.2", 0.8);
    ground.push(<polyline key="fwdR" points={line(v, part(r, 0, fwdU))} stroke={C.blue} strokeWidth={4 - 2 * fade} strokeLinecap="round" fill="none" opacity={(1 - 0.7 * fade) * (1 - k(g, "builds", 0.4))} />);
  }
  // the outreach route to Anna (P10), the follow-up (P11), the reply into the CRM (P12); kept lit for the pilot
  const sendU = k(g, "send", 0.5, EASE.longS);
  if (sendU > 0 && G < 1) {
    const u = clamp01((sendU - 0.12) / 0.88);
    const keepPilot = Math.max(1 - k(g, "capOut5", 0.6), k(g, "dim", 0.4));
    const trailO = lerp(1, 0.35, k(g, "arrive", 0.6)) * keepPilot * (1 - k(g, "scale+0.6", 0.5));
    ground.push(<polyline key="toAnna" points={line(v, part(TO_ANNA, 0, u))} stroke={C.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={Math.max(trailO, 0.9 * k(g, "dim", 0.4) * (1 - k(g, "scale+0.6", 0.5)))} />);
  }
  const fol = k(g, "follow", 0.5, EASE.longS);
  if (fol > 0 && fol < 1) {
    const [x, y] = proj(v, ...along(TO_ANNA, fol));
    ground.push(<polyline key="folT" points={line(v, part(TO_ANNA, Math.max(0, fol - 0.25), fol))} stroke={C.blue} strokeWidth={3} strokeDasharray="4 7" strokeLinecap="round" fill="none" />);
    ground.push(<g key="folD"><circle cx={x} cy={y} r={20} fill={C.blueHalo} /><circle cx={x} cy={y} r={9} fill={C.blue} /></g>);
  }
  const crmU2 = k(g, "toCrm", 0.5, EASE.longS);
  if (crmU2 > 0) ground.push(<polyline key="toCrm" points={line(v, part(ANNA_TO_CRM, 0, crmU2))} stroke={C.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={lerp(1, 0.3, k(g, "drawerIn", 0.6)) * (1 - k(g, "capOut5", 0.6))} />);

  // the timer arc round Anna (P11): no reply yet, so the follow-up goes by itself
  const ac: [number, number] = [(ANNA.x0 + ANNA.x1) / 2, (ANNA.y0 + ANNA.y1) / 2];
  const tim = k(g, "timer", 0.5, EASE.steady) * (1 - k(g, "reply", 0.3));
  if (tim > 0) {
    const ring = groundRing(v, ac[0], ac[1], 92, 72);
    ground.push(<polyline key="timR" points={pts(ring)} fill="none" stroke={C.line} strokeWidth={3} opacity={1 - k(g, "reply", 0.3)} />);
    ground.push(<polyline key="timB" points={pts(ring.slice(0, Math.max(1, Math.round(72 * k(g, "timer", 0.5, EASE.steady))) + 1))} fill="none" stroke={C.blue} strokeWidth={4} strokeLinecap="round" opacity={1 - k(g, "reply", 0.3)} />);
  }
  // the lens (P9) and the target that locks onto Anna
  const lens = k(g, "scan", 0.15) * (1 - k(g, "lock", 0.2));
  if (lens > 0) {
    const d = dot(g);
    ground.push(<polygon key="lens" points={pts(groundRing(v, d.x, d.y, 110, 64))} fill={rgba(C.blue, 0.1)} stroke={C.blue} strokeWidth={2} opacity={lens} />);
  }
  const lock = k(g, "lock", 0.33, EASE.lead);
  if (lock > 0 && t < at("send")) {
    const o = 1 - k(g, "card", 0.3);
    ground.push(<polygon key="tg1" points={pts(groundRing(v, ac[0], ac[1], lerp(200, 86, lock), 64))} fill="none" stroke={C.blue} strokeWidth={3} opacity={o} />);
    ground.push(<polygon key="tg2" points={pts(groundRing(v, ac[0], ac[1], lerp(130, 50, lock), 64))} fill="none" stroke={C.blue} strokeWidth={2} opacity={o * 0.8} />);
  }
  // the pilot plot (P15): a dashed ink boundary with a sand fill, drawn round Anna's company; its copies stamp out (P17)
  const plotU = k(g, "plot", 0.45, EASE.steady);
  const plotRect = (m: { x0: number; y0: number; x1: number; y1: number }, pad = 30): [number, number][] => [[m.x0 - pad, m.y0 - pad], [m.x1 + pad, m.y0 - pad], [m.x1 + pad, m.y1 + pad], [m.x0 - pad, m.y1 + pad], [m.x0 - pad, m.y0 - pad]];
  const plotO = (1 - k(g, "gather", 0.4)) * keep;
  if (plotU > 0) {
    ground.push(<polygon key="plotF" points={line(v, plotRect(ANNA))} fill={C.tSand[1]} opacity={plotU * plotO} />);
    ground.push(<polyline key="plotL" points={line(v, plotRect(ANNA))} fill="none" stroke={C.ink} strokeWidth={2.2} strokeDasharray="8 7" pathLength={undefined} opacity={plotO} strokeDashoffset={0}
      style={{ clipPath: undefined }} />);
  }
  COPIES.forEach((m, i) => {
    const u = clamp01((t - at("scale") - i * 0.067) / 0.27);
    if (u <= 0) return;
    const sc = lerp(1.25, 1, ARRIVE(u));
    const c: [number, number] = [(m.x0 + m.x1) / 2, (m.y0 + m.y1) / 2];
    const r = plotRect(m, 24).map(([x, y]) => [c[0] + (x - c[0]) * sc, c[1] + (y - c[1]) * sc] as [number, number]);
    ground.push(<polygon key={`cpF${i}`} points={line(v, r)} fill={C.tSand[1]} opacity={clamp01(u * 2) * plotO} />);
    ground.push(<polyline key={`cpL${i}`} points={line(v, r)} fill="none" stroke={C.ink} strokeWidth={2} strokeDasharray="8 7" opacity={clamp01(u * 2) * plotO} />);
  });
  // the pilot's boundary hides under ANNA: draw it on the ground before the blocks
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }} data-probe="world">
      <WorldDefs />
      {ground}
      {items.map((i) => i.el)}
      <Dots g={g} v={v} />
    </svg>
  );
};

/** The pilot's copies: the eight companies nearest Anna (P17), the first six of which reply (P19) and book (P20). */
export const COPIES = [...FAR].sort((a, b) => Math.hypot(a.x0 - ANNA.x0, a.y0 - ANNA.y0) - Math.hypot(b.x0 - ANNA.x0, b.y0 - ANNA.y0));

/** The AI: the one blue dot that travels, plus its copies (P17) and the sheets that fold into dots (P18). */
const Dots: React.FC<{ g: number; v: View }> = ({ g, v }) => {
  const t = g / 30;
  const at = (l: string) => T.s(l);
  const out: React.ReactNode[] = [];
  const d = dot(g);
  const keep = 1 - gone(g);
  // the copies' dots: one lap round each new plot, then they rest on its corner (they stop, so they don't compete)
  COPIES.forEach((m, i) => {
    const u = clamp01((t - at("scale") - 0.2 - i * 0.067) / 0.8);
    if (u <= 0 || keep <= 0) return;
    const pad = 24;
    const corners: [number, number][] = [[m.x1 + pad, m.y1 + pad], [m.x1 + pad, m.y0 - pad], [m.x0 - pad, m.y0 - pad], [m.x0 - pad, m.y1 + pad], [m.x1 + pad, m.y1 + pad]];
    const [x, y] = along(route(corners), EASE.steady(u));
    const [px, py] = proj(v, x, y, 0);
    const o = clamp01(u * 5) * (1 - k(g, "convos", 0.3));
    out.push(<g key={`cd${i}`} opacity={o}><circle cx={px} cy={py} r={16} fill={C.blueHalo} /><circle cx={px} cy={py} r={7} fill={C.blue} /></g>);
  });
  // the sheets: each folds into a small dot that slides onto the loop
  for (let i = 2; i < 6; i++) {
    const a = at("less") + (5 - i) * 0.2 + 0.2;
    const u = clamp01((t - a) / 0.45);
    if (u <= 0 || u >= 1) continue;
    const [lx, ly] = loopPoint(0.58 + i * 0.03);
    const p0: [number, number] = [-285, 285];
    const e = MOVE(u);
    const [x, y] = proj(v, lerp(p0[0], lx, e), lerp(p0[1], ly, e), lerp(110, 0, e));
    out.push(<circle key={`sd${i}`} cx={x} cy={y} r={8} fill={C.blue} opacity={1 - clamp01((u - 0.8) / 0.2)} />);
  }
  if (d.o > 0 && t > 0.05) {
    let [x, y] = proj(v, d.x, d.y, d.z);
    if (t >= at("gather")) {
      const u = EASE.longS(clamp01((t - at("gather")) / 0.8));
      const [ax, ay] = proj(v, ANNA.x1 + 6, (ANNA.y0 + ANNA.y1) / 2, 0), [rx, ry] = roofXY(g);
      x = lerp(ax, rx, u); y = lerp(ay, ry, u) - Math.sin(u * Math.PI) * 120;
    }
    const pulse = 0.5 + 0.5 * Math.sin(g / 9);
    // the landing ripple (P1), the lock-on ping (P9)
    const rip = clamp01((t - at("dotLand")) / 0.4);
    out.push(<g key="dot" opacity={d.o}>
      {rip > 0 && rip < 1 && <circle cx={x} cy={y} r={22 + 50 * ARRIVE(rip)} fill="none" stroke={C.blue} strokeWidth={2} opacity={1 - rip} />}
      <circle cx={x} cy={y} r={28 + 4 * pulse} fill={rgba(C.blue, 0.14)} />
      <circle cx={x} cy={y} r={13} fill={C.blue} />
    </g>);
  }
  return <>{out}</>;
};
export { LOOP };
