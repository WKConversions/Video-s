// The state of every object at frame g: pure functions of the frame and the labels (src/clock.ts). The World (SVG) and
// the Overlay (screen-facing cards) both read from here, so a card and the block it grows out of always agree.
import { Easing } from "remotion";
import { T } from "./clock";
import { ARRIVE, DEPART, MOVE, SMOOTH, clamp01, lerp } from "./lib";
import { EASE } from "./kinetic";
import { ANNA, ANNA_TO_CRM, BIZ, BIZ_START, CRM, MARKET, TO_ANNA, TOOL_TILES, VIEW, along, loopPoint } from "./map";
import { proj } from "./iso";

export const k = (g: number, pos: string | number, dur: number, ease: (t: number) => number = ARRIVE) => T.k(g, pos, dur, ease);
export const s = (g: number) => g / 30;
export const after = (g: number, pos: string) => s(g) >= T.s(pos);
export const between = (g: number, a: string, b: string) => s(g) >= T.s(a) && s(g) < T.s(b);

// ---------- the business ----------
export const bizOffset = (g: number): [number, number] => {
  const u = k(g, "fwd", 0.85, EASE.longS);
  return [lerp(BIZ_START[0], 0, u), lerp(BIZ_START[1], 0, u)];
};
export const bizRise = (g: number) => k(g, "bizUp", 0.42);
export const FLOOR = 64;
export const floors = (g: number) => k(g, "f1", 0.42, EASE.soft) + k(g, "f2", 0.42, EASE.soft) + k(g, "f3", 0.42, EASE.soft);
export const bizH = (g: number) => BIZ.h * bizRise(g) + FLOOR * floors(g);
export const bizRoof = (g: number): [number, number, number] => { const [ox, oy] = bizOffset(g); return [ox, oy, bizH(g)]; };
/** The business grows as an element (never the camera): 1 → 1.3 with its floors, about its own footprint. */
export const bizScale = (g: number) => 1 + 0.1 * floors(g);
export const bizView = (g: number) => { const v = VIEW(g); return { ...v, s: v.s * bizScale(g) }; };
/** The roof's screen point (the business is drawn in its own scaled view). */
export const roofXY = (g: number): [number, number] => proj(bizView(g), ...bizRoof(g));

// ---------- the world appearing, dimming, leaving ----------
const DIST0: [number, number] = [0, 0];
/** The market and the loop's plots rise ahead of the business on "forward", in a wave travelling away from it. */
export const waveIn = (g: number, x: number, y: number) => {
  const d = Math.hypot(x - DIST0[0], y - DIST0[1]);
  return clamp01((s(g) - T.s("rise") - d / 2400) / 0.42);
};
export const rise = (u: number) => ARRIVE(clamp01(u));
/** The pilot: everything but the business, the route to Anna and Anna steps back; it relights on the stamping wave. */
export const dim = (g: number) => 0.68 * (k(g, "dim", 0.4, MOVE) - k(g, "scale", 0.5, MOVE));
/** Everything but the business sinks away under the blue field (it is hidden then; nothing moves on screen). */
export const gone = (g: number) => sinkAll(g);
/** On "Wicflow helps" the world sinks back into the paper in a wave from the edges inward (the field has just left). */
export const sinkAll = (g: number) => k(g, "gather-0.3", 0.45, MOVE);

// ---------- the dot (the live AI) ----------
export type Dot = { x: number; y: number; z: number; o: number; r: number };
const HOP_FROM = (g: number): [number, number, number] => bizRoof(g);
const TEAM_SIDE: [number, number, number] = [-350, 40, 80];
const loopAt = (u: number): [number, number, number] => { const [x, y] = loopPoint(u); return [x, y, 0]; };
const crmFront: [number, number, number] = [40, CRM.y1 + 20, 0];
const marketMid: [number, number, number] = [-456, -456, 70];
const deskTop: [number, number, number] = [-285, 285, 60];
const annaDoor: [number, number, number] = [ANNA.x1 + 4, ANNA.y1 + 4, 0];
const lerp3 = (a: [number, number, number], b: [number, number, number], t: number, arc = 0): [number, number, number] =>
  [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t) + arc * Math.sin(Math.PI * t)];

/** Where the dot is: a chain of moves, each from where the last one ended. */
export const dot = (g: number): Dot => {
  const t = s(g);
  const at = (l: string) => T.s(l);
  let p: [number, number, number];
  let o = 1, r = 1;
  if (t < at("dotLand")) {                                    // P1: drops onto the roof (B8, one small bounce)
    const u = clamp01((t - 0.05) / (at("dotLand") - 0.05));
    const [x, y, z] = HOP_FROM(g);
    p = [x, y, z + 260 * (1 - u * u)];
    o = clamp01((t - 0.05) / 0.08);
  } else if (t < at("hop")) {                                  // sits on the roof; one small landing bounce
    const [x, y, z] = HOP_FROM(g);
    const b = t - at("dotLand");
    p = [x, y, z + 14 * Math.max(0, Math.sin(Math.min(1, b / 0.22) * Math.PI)) * (1 - b / 0.3 > 0 ? 1 : 0)];
  } else if (t < at("strike")) {                               // P2: hops beside the team (B2 arc), sits as the assistant's avatar
    p = lerp3(HOP_FROM(g), TEAM_SIDE, EASE.longS(clamp01((t - at("hop")) / 0.3)), 90);
  } else if (t < at("fwd")) {                                  // the bubble folds into it; it drops to the business's front
    const front: [number, number, number] = [BIZ_START[0] + 160, BIZ_START[1] + 40, 0];
    p = lerp3(TEAM_SIDE, front, MOVE(clamp01((t - at("strike") - 0.2) / 0.32)), 40);
  } else if (t < at("builds")) {                               // P3: leads the business forward, then waits at its front edge
    const u = EASE.longS(clamp01((t - at("fwd")) / 0.85));
    p = [lerp(BIZ_START[0] + 160, 160, u), lerp(BIZ_START[1] + 40 - 160, -120, u), 0];
  } else if (t < at("run")) {
    p = [160, -120, 0];
    p = lerp3(p, loopAt(0), MOVE(clamp01((t - at("builds") - 0.2) / 0.25)));
  } else if (t < at("sales") - 0.33) {                         // P5: runs the loop once (B11), then keeps circling slowly
    const lap = EASE.steady(clamp01((t - at("run")) / 1.0));
    const after = Math.max(0, t - at("run") - 1.0) * 0.12;
    p = loopAt(lap + after);
  } else if (t < at("marketing") - 0.33) {                     // P6: whips to the CRM (A1, cut on the fastest frame)
    const from = loopAt(1 + (at("sales") - 0.33 - at("run") - 1.0) * 0.12);
    p = lerp3(from, crmFront, whipU(t, at("sales")));
  } else if (t < at("work") - 0.33) {                          // P7: whips to the market
    p = lerp3(crmFront, marketMid, whipU(t, at("marketing")), 60);
  } else if (t < at("work") + 0.6) {                           // P8: whips to the team's desk
    p = lerp3(marketMid, deskTop, whipU(t, at("work")), 60);
  } else if (t < at("scan")) {                                 // back onto the loop, circling
    const u0 = 0.62;
    const k2 = MOVE(clamp01((t - at("work") - 0.6) / 0.4));
    p = lerp3(deskTop, loopAt(u0 + Math.max(0, t - at("work") - 1.0) * 0.1), k2);
  } else if (t < at("lock")) {                                 // P9: rides the lens across the market
    const u = EASE.sweep(clamp01((t - at("scan")) / (at("lock") - at("scan"))));
    const a: [number, number, number] = [-600, -600, 30], b: [number, number, number] = [annaDoor[0] - 40, annaDoor[1], 30];
    p = lerp3(a, b, u);
    if (t < at("scan") + 0.15) p = lerp3(loopAt(0.62 + (at("scan") - at("work") - 1.0) * 0.1), a, MOVE(clamp01((t - at("scan") + 0.0) / 0.15)));
  } else if (t < at("send")) {                                 // locks on, then comes home to the roof for the writing
    const lockP: [number, number, number] = [(ANNA.x0 + ANNA.x1) / 2, (ANNA.y0 + ANNA.y1) / 2, ANNA.h * 1.4 + 30];
    p = t < at("home1") ? lerp3([annaDoor[0] - 40, annaDoor[1], 30], lockP, ARRIVE(clamp01((t - at("lock")) / 0.25))) : lerp3(lockP, bizRoof(g), EASE.longS(clamp01((t - at("home1")) / 0.5)), 80);
  } else if (t < at("toCrm")) {                                // P10: holds while the card folds into it, then one long S to Anna
    const u = EASE.longS(clamp01((t - at("send") - 0.24) / 0.5));
    if (u <= 0) p = bizRoof(g);
    else if (u < 0.15) p = lerp3(bizRoof(g), [-95, -95, 0], u / 0.15);
    else { const [x, y] = along(TO_ANNA, (u - 0.15) / 0.85); p = [x, y, 0]; }
  } else if (t < at("drawerIn")) {                             // P12: the reply folds into it; it carries it to the CRM
    const u = EASE.longS(clamp01((t - at("toCrm")) / 0.5));
    const [x, y] = along(ANNA_TO_CRM, u); p = [x, y, 0];
  } else if (t < at("already")) {                              // back on the loop
    const u = MOVE(clamp01((t - at("drawerIn")) / 0.5));
    p = lerp3(crmFront, loopAt(0.88 + Math.max(0, t - at("drawerIn") - 0.5) * 0.1), u);
  } else if (t < at("dim")) {                                  // P14: runs through Gmail and HubSpot into the CRM
    const gm = TOOL_TILES.find((q) => q.id === "gmail")!, hs = TOOL_TILES.find((q) => q.id === "hubspot")!;
    const pts: [number, number, number][] = [loopAt(0.88 + (at("already") - at("drawerIn") - 0.5) * 0.1), [(gm.x0 + gm.x1) / 2, (gm.y0 + gm.y1) / 2, 20], [(hs.x0 + hs.x1) / 2, (hs.y0 + hs.y1) / 2, 20], crmFront];
    const u = EASE.steady(clamp01((t - at("already")) / 0.9)) * 3;
    const i = Math.min(2, Math.floor(u));
    p = lerp3(pts[i], pts[i + 1], u - i, 30);
  } else if (t < at("scale")) {                                // P15: runs the pilot route
    const u = EASE.longS(clamp01((t - at("pilotRun")) / 0.6));
    if (t < at("pilotRun")) p = lerp3(crmFront, [0, -100, 0], MOVE(clamp01((t - at("dim")) / 0.4)));
    else { const [x, y] = along(TO_ANNA, u); p = [x, y, 0]; }
  } else if (t < at("gather")) {                               // P17–P20: rests at the pilot (its copies carry on)
    p = annaDoor;
  } else {                                                     // P21: home to the roof; rides the floors up; glides off at the end
    const u = EASE.longS(clamp01((t - at("gather")) / 0.8));
    p = lerp3(annaDoor, bizRoof(g), u, 120);
    if (t >= at("gather") + 0.8) p = bizRoof(g);
    o = 1 - clamp01((t - at("glide")) / 0.25);
  }
  return { x: p[0], y: p[1], z: p[2], o, r };
};
/** A1 whip as a 0..1 position: speeds up into the cut at `cut` (the word's frame) and slows after it. */
export const whipU = (t: number, cut: number, half = 0.33) =>
  t < cut ? 0.5 * EASE.whipIn(clamp01((t - cut + half) / half)) : 0.5 + 0.5 * EASE.whipOut(clamp01((t - cut) / half));

// ---------- per-object helpers ----------
export const marketLift = (g: number, m: (typeof MARKET)[number]) => {
  // P9: the lens passes; companies that don't fit settle lower, Anna rises with a blue edge
  const passed = clamp01((s(g) - T.s("scan") - (m.x0 + 600) / 400 * 0.45) / 0.3);
  const fit = m === ANNA ? 1 : m.fit > 0.55 ? 0.5 : 0;
  const sink = (1 - fit) * 0.3 * SMOOTH(passed) * (1 - k(g, "wash1Out", 0.5));
  const up = m === ANNA ? 0.4 * k(g, "lock", 0.33) : 0;
  return 1 - sink + up;
};
export const easeOut = Easing.out(Easing.cubic);
export { DEPART, MOVE, ARRIVE };
