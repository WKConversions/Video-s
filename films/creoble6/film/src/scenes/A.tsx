// Scene A (0 → h1, 13.6 s): the hook after the reference (a line with an object in it → the push into that object →
// a tunnel of screens with type floating in it → through the 404 page), then "Bygget af AI.", the crane down to the
// wizard, the typing, the Fortsæt button that becomes the turning logo, the progress line that becomes the browser
// window's top edge, the site building, and "Ingen teknik. / Ingen skabeloner." over the far, soft site (Handoff1).
//
// ONE world and ONE camera for the whole scene. Two zones:
//   zone S (absolute): the site at H1_SITE; the spinner sits L px to the left of the window's top-left corner, on the
//     line of its top edge, so the progress line runs from the spinner along that edge;
//   zone H (local coordinates + OH): the tunnel's axis is local x = 0, y = 0. The opening line is at local z = 4800,
//     the inline window at z = 0 (1200 px wide, seen at a quarter size from there), the tunnel behind it, the 404
//     page at z = −4300, "Bygget af AI." at z = −8000 and the wizard below it. OH is chosen so that the wizard's
//     Fortsæt button sits exactly where the spinner is: the button becomes the logo without leaving its spot.
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { C, OUT, INOUT, SANS, clamp01, mix } from "../lib";
import { f, k, typed, press } from "../shared";
import { Stage3D, Plane, cam, project, dofBlur, PERSP, type Cam } from "../cam";
import { Kinetic, TYPE, measure, useFonts, type KItem } from "../type";
import { Dots, dotsAt } from "../dots";
import { WizardWindow, WIZ_WIN, WIZ_R, SiteWindow, SITE_WIN, Cursor, cursorAt, Handoff1, camH1, H1_SITE, HANDOFF_HALF } from "../ui";
import { OLD, ERR, OldSite, ErrorPage } from "./A_old";

export const BLUR: [number, number][] = [[1.5, 2.25], [3.1, 3.8], [4.5, 5.15], [8.8, 9.35], [9.6, 10.3]];

/* ---------- geometry ---------- */
type V = { x: number; y: number; z: number };
type Pl = V & { rx?: number; ry?: number };
const rad = (d: number) => (d * Math.PI) / 180;
const vadd = (a: V, b: V, m = 1): V => ({ x: a.x + b.x * m, y: a.y + b.y * m, z: a.z + b.z * m });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// a point of a plane: (dx, dy) from its centre, in world space (the Plane's rotateY(ry) rotateX(rx))
const planePt = (P: Pl, dx: number, dy: number): V => {
  const th = rad(P.rx ?? 0), ph = rad(P.ry ?? 0), z0 = dy * Math.sin(th);
  return { x: P.x + dx * Math.cos(ph) + z0 * Math.sin(ph), y: P.y + dy * Math.cos(th), z: P.z - dx * Math.sin(ph) + z0 * Math.cos(ph) };
};
// the camera that looks head-on at a plane's point Q, shown at scale s (1 = natural size), turned off-axis by
// drx / dry degrees around Q (an orbit: Q stays at the frame's centre). Focus on Q.
const look = (P: Pl, Q: V, s: number, ap: number, drx = 0, dry = 0): Cam => {
  const rx = (P.rx ?? 0) + drx, ry = -(P.ry ?? 0) + dry, D = PERSP * (1 - 1 / s);
  const fw = { x: Math.cos(rad(rx)) * Math.sin(rad(ry)), y: Math.sin(rad(rx)), z: -Math.cos(rad(rx)) * Math.cos(rad(ry)) };
  return cam({ ...vadd(Q, fw, D), rx, ry, focus: PERSP / s, ap });
};
const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t), rx: lerp(a.rx, b.rx, t), ry: lerp(a.ry, b.ry, t), rz: lerp(a.rz, b.rz, t), focus: lerp(a.focus, b.focus, t), ap: lerp(a.ap, b.ap, t) });
const LIN = (t: number) => t;
const seg = (t: number, a: number, b: number, e: (t: number) => number = INOUT) => e(clamp01((t - a) / (b - a)));

/* ---------- zone S: the site, the rail, the spinner ---------- */
const SITE = { ...H1_SITE };
const L = 1500;                                                  // the spinner sits this far left of the window's corner
const S = planePt(SITE, -SITE_WIN.w / 2 - L, -SITE_WIN.h / 2);   // the spinner's centre (= the button's spot)
const MARK: Pl = { ...S, ry: SITE.ry };
const NORM = { x: Math.sin(rad(SITE.ry)), y: 0, z: Math.cos(rad(SITE.ry)) };   // the site plane's normal, toward the viewer
const RAIL_W = L + SITE_WIN.w;
const RAIL: Pl = { ...vadd(planePt(SITE, -SITE_WIN.w / 2 - L + RAIL_W / 2, -SITE_WIN.h / 2), NORM, 2), ry: SITE.ry };
const siteQ = (px: number, py: number) => planePt(SITE, px - SITE_WIN.w / 2, py - SITE_WIN.h / 2);

/* ---------- zone H: the wizard (its button on S), and everything before it ---------- */
const WRX = 30;
const ZK = 2.5;   // the wizard is laid out 2.5× larger and scaled back, so its text stays crisp in the extreme close-ups
const BTN = { x: WIZ_R.button.x + WIZ_R.button.w / 2, y: WIZ_R.button.y + WIZ_R.button.h / 2 + 46 };   // window px
const WIZ: Pl = (() => { const o = planePt({ x: 0, y: 0, z: 0, rx: WRX }, BTN.x - WIZ_WIN.w / 2, BTN.y - WIZ_WIN.h / 2); return { x: S.x - o.x, y: S.y - o.y, z: S.z - o.z, rx: WRX }; })();
const WFW = { x: 0, y: Math.sin(rad(WRX)), z: -Math.cos(rad(WRX)) };   // into the wizard page (away from the viewer)
const wizQ = (px: number, py: number) => planePt(WIZ, px - WIZ_WIN.w / 2, py + 46 - WIZ_WIN.h / 2);   // page px → world
const lookW = (px: number, py: number, s: number, ap = 10) => look(WIZ, wizQ(px, py), s, ap);
const WIZ_L = { x: 0, y: 1150, z: -7600 };                        // the wizard's centre in zone H's local space
const OH: V = { x: WIZ.x - WIZ_L.x, y: WIZ.y - WIZ_L.y, z: WIZ.z - WIZ_L.z };
const H = (x: number, y: number, z: number): V => ({ x: x + OH.x, y: y + OH.y, z: z + OH.z });

// the tunnel (local): the 404 page at its end; the old sites on the walls, the floor and the ceiling
const Z_ERR = -4300, Z_REST = -4230, Z_LINE2 = -8000;
const T_P0 = 1.25, T_P1 = 1.9, T_T1 = 2.8, T_FLY = 2.85;
const TUNNEL: { x: number; y: number; z: number; rx: number; ry: number; rz: number; i: number }[] = [
  { x: -720, y: 30, z: -1070, rx: 0, ry: 76, rz: -1.5, i: 1 }, { x: 720, y: -30, z: -1070, rx: 0, ry: -76, rz: 1.5, i: 2 },
  { x: -720, y: -20, z: -2320, rx: 0, ry: 76, rz: 1, i: 4 }, { x: 720, y: 20, z: -2320, rx: 0, ry: -76, rz: -1, i: 0 },
  { x: -720, y: 0, z: -3570, rx: 0, ry: 76, rz: 0, i: 3 }, { x: 720, y: 0, z: -3570, rx: 0, ry: -76, rz: 0, i: 1 },
  { x: 60, y: -440, z: -2300, rx: -75, ry: 0, rz: 0, i: 3 }, { x: -60, y: 440, z: -2300, rx: 75, ry: 0, rz: 0, i: 2 },
  { x: 0, y: -440, z: -3760, rx: -75, ry: 0, rz: 0, i: 0 }, { x: 0, y: 440, z: -3760, rx: 75, ry: 0, rz: 0, i: 4 },
];

/* ---------- the camera (revision 1: calm, eased, overlapping; it never stops) ---------- */
// The hook (local) is ONE flight: a slow push on the line, a smooth acceleration into the window (fast while it is
// far: that reads as a zoom), a long soft deceleration down the tunnel to the 404 page; before that has fully
// settled the fly-through begins, very gently (the page stays readable for about half a second), passes the page
// and decelerates for a second onto "Bygget af AI.". A slow forward drift runs under all of it.
const FLY = Easing.bezier(0.5, 0, 0.15, 1);
const T_FLY1 = T_FLY + 1.45;
const V_T = (3 * (Z_REST + PERSP)) / (T_T1 - T_P1);              // the tunnel's entry speed (cubic-out), negative
const hookZ = (t: number) => {
  if (t < T_P0) return 4800 - 50 * t;
  if (t < T_P1) {
    const T = T_P1 - T_P0, u = (t - T_P0) / T, u2 = u * u, u3 = u2 * u, z0 = 4800 - 50 * T_P0;
    return (2 * u3 - 3 * u2 + 1) * z0 + (u3 - 2 * u2 + u) * T * -50 + (-2 * u3 + 3 * u2) * -PERSP + (u3 - u2) * T * V_T;
  }
  const u = clamp01((t - T_P1) / (T_T1 - T_P1));
  return -PERSP + (Z_REST + PERSP) * (1 - Math.pow(1 - u, 3)) - 70 * Math.max(0, t - T_T1) - (Z_REST - 70 * (T_FLY1 - T_T1) - Z_LINE2) * seg(t, T_FLY, T_FLY1, FLY);
};
const hookCam = (t: number, cs: number): Cam => {
  const z = hookZ(t), x = cs * (1 - seg(t, T_P0, T_P0 + 0.55)), w = clamp01((t - T_P0) / (T_T1 - T_P0));
  const d404 = Math.min(PERSP + Z_REST - Z_ERR, Math.max(200, Z_ERR - z + PERSP));
  return cam({ ...H(x, 0, z), rz: 11 * Math.sin(Math.PI * w) * (1 - w), ap: 10 * seg(t, 1.5, 1.95), focus: mix(d404, PERSP, seg(t, 3.25, 3.75)) });
};
// After the hook: a chain of eased moves. Each one blends the camera from wherever it is to its pose (INOUT), and
// starts before the one before it has settled, so the camera flows from move to move without a hold.
type Move = { a: number; b: number; c: Cam; name: string };
// A10's pose: the site small and far in the upper right (about 520 px wide), clear of the line's band
const A10_S = 0.36, A10 = look(SITE, siteQ(730 - 370 / A10_S, 453 + 270 / A10_S), A10_S, 20, 0, -8);
const MOVES: Move[] = [
  { a: 3.95, b: 5.6, c: lookW(800, 330, 1.875), name: "crane down to the wizard" },
  { a: 5.35, b: 6.75, c: lookW(806, 283, 2.7), name: "push to the field (extreme close-up)" },
  { a: 6.55, b: 8.0, c: lookW(840, 286, 2.85), name: "track the typed text" },
  { a: 7.55, b: 8.6, c: lookW(905, 600, 2.4), name: "glide down-right to Fortsaet" },
  { a: 8.5, b: 9.6, c: look(MARK, S, 1.3, 20, 0, -6), name: "button -> dot -> logo (camera settles on the spinner)" },
  { a: 9.3, b: 10.55, c: look(SITE, siteQ(730, 453), 0.96, 20, 0, -5), name: "truck along the progress line to the window" },
  { a: 10.5, b: 11.55, c: A10, name: "pull back: the site small, upper right" },
];
const T_HOME0 = 12.25, T_HOME1 = 13.28;                             // the drift back to the hand-off pose
const sceneCam = (g: number, cs: number): Cam => {
  const t = g / 30;
  let c = hookCam(t, cs);
  for (const m of MOVES) if (t > m.a) c = lerpCam(c, m.c, seg(t, m.a, m.b));
  if (t > T_HOME0) c = lerpCam(c, camH1(g), seg(t, T_HOME0, T_HOME1));
  return c;
};
export const A_MOVES = [
  { a: T_P0, b: T_T1, name: "push into the window + tunnel flight (Hermite accel, cubic-out decel)" },
  { a: T_FLY, b: T_FLY1, name: "through the 404 to 'Bygget af AI.' (bezier .5,0,.15,1)" },
  ...MOVES.map((m) => ({ a: m.a, b: m.b, name: m.name + " (INOUT)" })),
  { a: T_HOME0, b: T_HOME1, name: "drift back to Handoff1 (INOUT)" },
];

/* ---------- the opening line's layout (the same slot maths as Kinetic, to know where its inline window sits) ---------- */
const NODE_W = 300, SP = 0.27 * TYPE.big, WDUR = 0.5;
const LINE1: { t: string; at: string; accent?: boolean }[] = [{ t: "Din", at: "w:din" }, { t: "nye", at: "w:nye" }, { t: "", at: "" }, { t: "hjemmeside", at: "w:hjemmeside", accent: true }];
const nodeX = (g: number, ready: boolean) => {
  let acc = 0, cum = 0, nx = 0;
  for (const it of LINE1) {
    const node = it.t === "", w = node ? NODE_W : measure(it.t, TYPE.big, !!it.accent, true, 400, ready);
    const slot = node ? 1 : INOUT(clamp01((g - f(it.at)) / (WDUR * 30 * 0.9)));
    const pre = SP * slot * Math.min(1, acc), l = cum + pre;
    if (node) nx = l + NODE_W / 2;
    cum += pre + slot * w; acc += slot;
  }
  return nx - cum / 2;
};

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  const ready = useFonts();
  if (g >= f("h1") - HANDOFF_HALF) return <Handoff1 g={g} />;
  const t = g / 30;
  const wxF = nodeX(9999, ready), wx = nodeX(g, ready);
  const cs = -4 * wxF;                                            // the camera starts here: the line is centred on it
  const c = sceneCam(g, cs);
  const zl = c.z - OH.z, dW = zl + PERSP;                         // the eye's distance to the inline window's plane
  const dist = (p: V) => project(c, p).dist;

  /* the opening line */
  const line1: KItem[] = LINE1.map((it) => (it.t === "" ? { node: <div style={{ width: NODE_W, height: 1 }} />, w: NODE_W, at: -1 } : { t: it.t, at: it.at, accent: it.accent, dur: WDUR }));
  const rock = 1 - seg(t, 1.05, 1.45);
  const pageO = clamp01((dW - 350) / 950);
  const gate = clamp01((2600 - dW) / 1500);

  /* the wizard */
  const NAME = "Holm Fysioterapi";
  const T_LINE = 9.42;                                            // the progress line starts, to be well under way on "bygger"
  const name = typed(g, 6.62, NAME, 13);
  const focused = t >= 6.47;
  const far = 5 * seg(t, 5.9, 6.75) * (1 - seg(t, 7.7, 8.35));
  const lifted = t >= 8.58;
  const fall = seg(t, 8.62, 9.65);
  const wizP = vadd(WIZ, WFW, 2600 * fall);
  const fys = k(g, 7.95, 0.2, INOUT);
  const hover = k(g, 8.25, 0.2, INOUT), prs = press(g, 8.5);

  /* the button → the dot → the six dots → the turning logo */
  const mq = seg(t, 8.6, 9.55);                                    // the mark's plane turns from the wizard's to the site's
  const m1 = seg(t, 8.6, 9.08);                                   // button → dot
  const m2 = seg(t, 9.02, 9.72);                                   // dot → the C
  const R0 = 22, SPIN = 300;
  const tau = t - 9.02, spin = tau <= 0 ? 0 : tau < 0.4 ? (200 * tau * tau) / 0.8 : 200 * (tau - 0.2);
  const leave = 1 - seg(t, 9.85, 10.4);
  const logo = dotsAt(SPIN, 0, 0, spin).map((d, i) => ({ x: d.x * m2, y: d.y * m2, r: mix(R0 * (d.r / (SPIN * 0.1119)), d.r, m2) * OUT(clamp01(leave * 1.6 - i * 0.12)) }));
  const bw = mix(WIZ_R.button.w, 2 * R0, m1), bh = mix(WIZ_R.button.h, 2 * R0, m1);

  /* the progress line (rail px from the spinner's centre) and the window that unfolds from it */
  const head = mix(130, RAIL_W - 16, seg(t, T_LINE, 10.32));
  const tail = mix(130, L + 16, seg(t, 9.85, 10.62));
  const unfold = seg(t, 10.1, 10.85);
  const build = clamp01((t - 10.2) / 1.0);
  const lineO = 1 - seg(t, 10.95, 11.4);

  /* the cursor (screen space, on page points) */
  const pg = (px: number, py: number) => { const q = project(c, wizQ(px, py)); return { x: q.x, y: q.y }; };
  const cur = cursorAt(g, [{ at: 5.8, ...pg(1480, 760) }, { at: 6.42, ...pg(905, 298) }, { at: 6.56, ...pg(905, 298) }, { at: 7.0, ...pg(990, 322) }, { at: 7.72, ...pg(994, 330) }, { at: 8.33, ...pg(1004, 730) }]);
  const curS = project(c, wizQ(900, 500)).s;

  return (
    <AbsoluteFill>
      <Stage3D cam={c}>
        {/* A1: the line, with the old window inside it */}
        {t < 1.52 && (
          <Plane {...H(cs, 0, 4800)} w={2} h={2} dof={false} opacity={1 - seg(t, 1.3, 1.48)}>
            <Kinetic g={g} items={line1} size={TYPE.big} style={{ left: 1, top: 1 }} />
          </Plane>
        )}
        {t < 2.0 && (
          <Plane {...H(4 * (wx - wxF), 0, 0)} w={OLD.w} h={OLD.h} dof={false}
            ry={rock * (9 * Math.sin(t * 2.3) + 2)} rx={rock * 5 * Math.sin(t * 1.7 + 0.6)}>
            <OldSite i={0} pageOpacity={pageO} />
          </Plane>
        )}
        {/* A2: the tunnel of old sites; A3: the 404 page at its end */}
        {t > 1.2 && t < 3.8 && TUNNEL.map((p, i) => {
          const P = H(p.x, p.y, p.z), fog = clamp01((3900 - dist(P)) / 1500);
          return <Plane key={i} {...P} rx={p.rx} ry={p.ry} rz={p.rz} w={OLD.w} h={OLD.h} opacity={gate * fog}><OldSite i={p.i} /></Plane>;
        })}
        {t > 1.2 && t < 3.7 && (() => {
          const P = H(0, 0, Z_ERR);
          return <Plane {...P} w={ERR.w} h={ERR.h} opacity={gate * clamp01((dist(P) - 170) / 380)}><ErrorPage p={seg(t, 2.6, 2.78)} /></Plane>;
        })()}
        {/* A4: "Bygget af AI." */}
        {t > 2.9 && t < 5.7 && (
          <Plane {...H(0, 0, Z_LINE2)} w={2} h={2} dof={false}>
            <Kinetic g={g} items={[{ t: "Bygget", at: "w:bygget" }, { t: "af", at: "w:af" }, { t: "AI.", at: "w:ai", accent: true }]} size={TYPE.hero} style={{ left: 1, top: 1 }} />
          </Plane>
        )}
        {/* A5–A7: the wizard */}
        {t > 3.8 && t < 9.65 && (
          <Plane {...wizP} rx={WRX} w={WIZ_WIN.w * ZK} h={WIZ_WIN.h * ZK} scale={1 / ZK} opacity={1 - seg(t, 8.95, 9.6)}
            blur={ZK * 10 * fall + (ZK - 1) * dofBlur(c, dist(wizP))}
            farBlur={ZK * far} farMask="radial-gradient(ellipse 36% 15% at 50% 39.5%, #000 55%, transparent 100%)">
            <div style={{ position: "relative", width: WIZ_WIN.w, height: WIZ_WIN.h, zoom: ZK }}>
              <WizardWindow g={g} name={name} focus={focused ? "name" : null} caret={focused} caretSolid={t < 8.0} hover={hover} press={prs} hideButton={lifted} />
              {fys > 0 && (
                <div style={{ position: "absolute", left: WIZ_R.branche.x + 2, top: WIZ_R.branche.y + 46 + 2, width: 420, height: WIZ_R.branche.h - 4, borderRadius: 6, background: C.white, opacity: fys,
                  display: "flex", alignItems: "center", paddingLeft: 11, fontFamily: SANS, fontSize: 14, color: C.ink }}>Fysioterapi</div>
              )}
            </div>
          </Plane>
        )}
        {/* A7–A8: the lifted button, the dot, the turning logo */}
        {lifted && t < 10.45 && (
          <Plane {...vadd(S, { x: 0, y: -Math.sin(rad(WRX)) * (1 - mq), z: 1 }, 1.5)} rx={WRX * (1 - mq)} ry={SITE.ry * mq} w={0} h={0} scale={1 / ZK} dof={false}>
            <div style={{ position: "absolute", left: 0, top: 0, zoom: ZK }}>
            {m2 < 1 && (
              <div style={{ position: "absolute", left: -bw / 2, top: -bh / 2, width: bw, height: bh, borderRadius: mix(7, R0, m1), background: `color-mix(in srgb, ${C.sage} ${(m2 * 100).toFixed(1)}%, #3A3431)`,
                opacity: 1 - seg(t, 9.02, 9.14), transform: `scale(${1 - 0.045 * prs})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 14, fontWeight: 500, color: "#FFFFFF", overflow: "hidden", whiteSpace: "nowrap" }}>
                <span style={{ opacity: 1 - seg(t, 8.6, 8.85) }}>Fortsæt</span>
              </div>
            )}
            {t >= 9.02 && <Dots dots={logo} color={`color-mix(in srgb, ${C.sage} ${(m2 * 100).toFixed(1)}%, #3A3431)`} />}
            </div>
          </Plane>
        )}
        {/* A8: the progress line, then the site unfolding from it */}
        {t >= T_LINE && lineO > 0 && (
          <Plane {...RAIL} ry={SITE.ry} w={RAIL_W} h={20} dof={false} opacity={lineO}>
            <div style={{ position: "absolute", left: tail, top: 10, width: Math.max(0, head - tail), height: 3, borderRadius: 2, background: C.sage }} />
          </Plane>
        )}
        {t >= 10.1 && (
          <Plane {...H1_SITE} w={SITE_WIN.w} h={SITE_WIN.h}
            style={unfold < 1 ? { clipPath: `inset(${(-240 * unfold).toFixed(1)}px -240px ${mix(SITE_WIN.h - 4, -240, unfold).toFixed(1)}px -240px)` } : undefined}>
            <SiteWindow build={build} />
          </Plane>
        )}
      </Stage3D>

      {/* A2: the line floating in the tunnel */}
      {t > 1.7 && t < 3.2 && (
        <div style={{ position: "absolute", left: 960, top: 540, transform: `scale(${mix(0.95, 1.03, seg(t, 1.78, 2.9, LIN))})` }}>
          <Kinetic g={g} size={TYPE.big} items={[{ t: "få", at: "w:f", out: 2.54, dur: 0.45 }, { t: "minutter", at: "w:minutter", out: 2.54, accent: true, dur: 0.45 }, { t: "væk.", at: "w:vk", out: 2.54, dur: 0.4 }]} />
        </div>
      )}
      {/* a quiet cream veil over the receding site while the line is read (gone before the hand-off) */}
      {t > 11.2 && <AbsoluteFill style={{ background: C.bg, opacity: (0.45 * seg(t, 10.9, 11.5) + 0.43 * seg(t, T_HOME0, 12.6)) * (1 - seg(t, 12.9, 13.28)) }} />}
      {/* A10: "Ingen teknik." → "Ingen skabeloner." in front of the far, soft site */}
      {t > 11.2 && (
        <div style={{ position: "absolute", left: 960, top: 540, transform: `scale(${mix(0.97, 1.03, seg(t, 11.33, 13.3, LIN))})`, opacity: 1 - seg(t, 13.16, 13.28, LIN) }}>
          <Kinetic g={g} size={TYPE.hero} items={[{ t: "Ingen", at: "w:ingen", out: 12.9 }, { t: "teknik.", at: "w:teknik", out: "w:ingen2", accent: true },
            { t: "skabeloner.", at: "w:skabeloner", out: 12.9, accent: true }]} />
        </div>
      )}
      {t > 5.75 && t < 8.82 && <Cursor x={cur.x} y={cur.y} press={Math.max(press(g, 6.45), prs)} size={22 * curS} opacity={1 - seg(t, 8.64, 8.9)} />}
    </AbsoluteFill>
  );
};
