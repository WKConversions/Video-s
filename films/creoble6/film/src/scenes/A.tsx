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
import { AbsoluteFill } from "remotion";
import { C, OUT, INOUT, SANS, clamp01, mix } from "../lib";
import { f, k, typed, press } from "../shared";
import { Stage3D, Plane, cam, project, dofBlur, PERSP, type Cam } from "../cam";
import { Kinetic, TYPE, measure, useFonts, type KItem } from "../type";
import { Dots, dotsAt } from "../dots";
import { WizardWindow, WIZ_WIN, WIZ_R, SiteWindow, SITE_WIN, Cursor, cursorAt, Handoff1, camH1, H1_SITE, HANDOFF_HALF } from "../ui";
import { OLD, ERR, OldSite, ErrorPage } from "./A_old";

export const BLUR: [number, number][] = [[1.36, 2.14], [2.93, 3.42], [4.72, 5.26], [8.62, 9.2], [9.72, 10.3]];

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
const T_P0 = 1.33, T_P1 = 1.78, T_T1 = 2.72, T_FLY = 2.94;
const TUNNEL: { x: number; y: number; z: number; rx: number; ry: number; rz: number; i: number }[] = [
  { x: -720, y: 30, z: -1070, rx: 0, ry: 76, rz: -1.5, i: 1 }, { x: 720, y: -30, z: -1070, rx: 0, ry: -76, rz: 1.5, i: 2 },
  { x: -720, y: -20, z: -2320, rx: 0, ry: 76, rz: 1, i: 4 }, { x: 720, y: 20, z: -2320, rx: 0, ry: -76, rz: -1, i: 0 },
  { x: -720, y: 0, z: -3570, rx: 0, ry: 76, rz: 0, i: 3 }, { x: 720, y: 0, z: -3570, rx: 0, ry: -76, rz: 0, i: 1 },
  { x: 60, y: -440, z: -2300, rx: -75, ry: 0, rz: 0, i: 3 }, { x: -60, y: 440, z: -2300, rx: 75, ry: 0, rz: 0, i: 2 },
  { x: 0, y: -440, z: -3760, rx: -75, ry: 0, rz: 0, i: 0 }, { x: 0, y: 440, z: -3760, rx: 75, ry: 0, rz: 0, i: 4 },
];

/* ---------- the camera ---------- */
// The hook (local): a slow push on the line; then one continuous flight: fast while the window is far (it reads as a
// zoom), slower through the window, decelerating down the tunnel to the 404 page; a creep; through the page to the
// "Bygget af AI." line, still creeping forward.
const V_T = (3 * (Z_REST + PERSP)) / (T_T1 - T_P1);              // the tunnel's entry speed (cubic-out), negative
const hookCam = (t: number, cs: number): Cam => {
  let x = cs, z = 4800 - 50 * t, rz = 0;
  if (t >= T_P0 && t < T_P1) {
    const T = T_P1 - T_P0, u = (t - T_P0) / T, u2 = u * u, u3 = u2 * u, z0 = 4800 - 50 * T_P0;
    z = (2 * u3 - 3 * u2 + 1) * z0 + (u3 - 2 * u2 + u) * T * -50 + (-2 * u3 + 3 * u2) * -PERSP + (u3 - u2) * T * V_T;
    x = cs * (1 - INOUT(clamp01(u / 0.8)));
  } else if (t >= T_P1) {
    const u = clamp01((t - T_P1) / (T_T1 - T_P1));
    x = 0;
    z = -PERSP + (Z_REST + PERSP) * (1 - Math.pow(1 - u, 3)) - 70 * Math.max(0, t - T_T1) - (Z_REST - 70 * (4.25 - T_T1) - Z_LINE2) * seg(t, T_FLY, T_FLY + 0.46);
  }
  if (t >= T_P0) { const w = clamp01((t - T_P0) / (T_T1 - T_P0)); rz = 11 * Math.sin(Math.PI * w) * (1 - w); }
  const ap = 10 * seg(t, 1.5, 1.85);
  const focus = mix(PERSP + Z_REST - Z_ERR, PERSP, seg(t, 3.0, 3.4));
  return cam({ ...H(x, 0, z), rz, ap, focus });
};
type Key = { t: number; c: Cam; e?: (t: number) => number };
const sceneCam = (g: number, cs: number): Cam => {
  const t = g / 30;
  if (t <= 4.25) return hookCam(t, cs);
  const keys: Key[] = [
    { t: 4.25, c: hookCam(4.25, cs) },
    { t: 5.6, c: lookW(800, 330, 1.875) },                               // the crane down: the form column 900 px wide
    { t: 5.87, c: lookW(800, 326, 1.95), e: LIN },
    { t: 6.68, c: lookW(806, 283, 2.7) },                                // extreme close-up: the field 1300 px wide
    { t: 7.9, c: lookW(838, 285, 2.85), e: LIN },                        // tracking the text
    { t: 8.45, c: lookW(905, 600, 2.4) },                                // down-right to Fortsæt
    { t: 8.56, c: lookW(908, 605, 2.43), e: LIN },
    { t: 9.25, c: look(MARK, S, 1.3, 20, 0, -6) },                       // the button's spot: the spinner
    { t: 9.62, c: look(MARK, S, 1.36, 20, 0, -1.5), e: LIN },
    { t: 10.32, c: look(SITE, siteQ(730, 453), 0.96, 20, 0, -5) },        // the truck along the line to the window
    { t: 10.5, c: look(SITE, siteQ(727, 451), 0.975, 20, 0, -4.7), e: LIN },
    { t: 11.08, c: look(SITE, siteQ(690, 430), 1.16, 20, 0, -10) },       // the glide over the site, a 5° turn
  ];
  if (t >= 11.08) return lerpCam(keys[keys.length - 1].c, camH1(g), seg(t, 11.08, 12.05));   // back to the hand-off pose
  for (let i = 1; i < keys.length; i++) if (t <= keys[i].t) return lerpCam(keys[i - 1].c, keys[i].c, seg(t, keys[i - 1].t, keys[i].t, keys[i].e ?? INOUT));
  return keys[keys.length - 1].c;
};

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
  const rock = 1 - seg(t, 1.2, 1.5);
  const pageO = clamp01((dW - 350) / 950);
  const gate = clamp01((2600 - dW) / 1500);

  /* the wizard */
  const NAME = "Holm Fysioterapi";
  const name = typed(g, 6.62, NAME, 13);
  const focused = t >= 6.47;
  const far = 5 * seg(t, 6.0, 6.68) * (1 - seg(t, 7.9, 8.3));
  const lifted = t >= 8.58;
  const fall = seg(t, 8.62, 9.3);
  const wizP = vadd(WIZ, WFW, 2600 * fall);
  const fys = k(g, 7.95, 0.2, INOUT);
  const hover = k(g, 8.25, 0.2, INOUT), prs = press(g, 8.5);

  /* the button → the dot → the six dots → the turning logo */
  const mq = seg(t, 8.6, 9.2);                                    // the mark's plane turns from the wizard's to the site's
  const m1 = seg(t, 8.6, 8.95);                                   // button → dot
  const m2 = seg(t, 8.9, 9.32);                                   // dot → the C
  const R0 = 22, SPIN = 300;
  const tau = t - 8.9, spin = tau <= 0 ? 0 : tau < 0.4 ? (200 * tau * tau) / 0.8 : 200 * (tau - 0.2);
  const leave = 1 - seg(t, 9.72, 10.1);
  const logo = dotsAt(SPIN, 0, 0, spin).map((d, i) => ({ x: d.x * m2, y: d.y * m2, r: mix(R0 * (d.r / (SPIN * 0.1119)), d.r, m2) * OUT(clamp01(leave * 1.6 - i * 0.12)) }));
  const bw = mix(WIZ_R.button.w, 2 * R0, m1), bh = mix(WIZ_R.button.h, 2 * R0, m1);

  /* the progress line (rail px from the spinner's centre) and the window that unfolds from it */
  const head = mix(130, RAIL_W - 16, seg(t, f("w:bygger") / 30, f("w:bygger") / 30 + 0.52));
  const tail = mix(130, L + 16, seg(t, 9.8, 10.25));
  const unfold = seg(t, 9.98, 10.52);
  const build = clamp01((t - 10.08) / 0.95);
  const lineO = 1 - seg(t, 10.8, 11.1);

  /* the cursor (screen space, on page points) */
  const pg = (px: number, py: number) => { const q = project(c, wizQ(px, py)); return { x: q.x, y: q.y }; };
  const cur = cursorAt(g, [{ at: 5.8, ...pg(1480, 760) }, { at: 6.42, ...pg(905, 298) }, { at: 6.56, ...pg(905, 298) }, { at: 7.0, ...pg(990, 322) }, { at: 7.72, ...pg(994, 330) }, { at: 8.33, ...pg(1004, 730) }]);
  const curS = project(c, wizQ(900, 500)).s;

  return (
    <AbsoluteFill>
      <Stage3D cam={c}>
        {/* A1: the line, with the old window inside it */}
        {t < 1.5 && (
          <Plane {...H(cs, 0, 4800)} w={2} h={2} dof={false} opacity={1 - seg(t, 1.36, 1.47, LIN)}>
            <Kinetic g={g} items={line1} size={TYPE.big} style={{ left: 1, top: 1 }} />
          </Plane>
        )}
        {t < 1.86 && (
          <Plane {...H(4 * (wx - wxF), 0, 0)} w={OLD.w} h={OLD.h} dof={false}
            ry={rock * (9 * Math.sin(t * 2.3) + 2)} rx={rock * 5 * Math.sin(t * 1.7 + 0.6)}>
            <OldSite i={0} pageOpacity={pageO} />
          </Plane>
        )}
        {/* A2: the tunnel of old sites; A3: the 404 page at its end */}
        {t > 1.3 && t < 3.4 && TUNNEL.map((p, i) => {
          const P = H(p.x, p.y, p.z), fog = clamp01((3900 - dist(P)) / 1500);
          return <Plane key={i} {...P} rx={p.rx} ry={p.ry} rz={p.rz} w={OLD.w} h={OLD.h} opacity={gate * fog}><OldSite i={p.i} /></Plane>;
        })}
        {t > 1.3 && t < 3.3 && (() => {
          const P = H(0, 0, Z_ERR);
          return <Plane {...P} w={ERR.w} h={ERR.h} opacity={gate * clamp01((dist(P) - 170) / 380)}><ErrorPage p={seg(t, 2.66, 2.84)} /></Plane>;
        })()}
        {/* A4: "Bygget af AI." */}
        {t > 2.9 && t < 5.7 && (
          <Plane {...H(0, 0, Z_LINE2)} w={2} h={2} dof={false}>
            <Kinetic g={g} items={[{ t: "Bygget", at: "w:bygget" }, { t: "af", at: "w:af" }, { t: "AI.", at: "w:ai", accent: true }]} size={TYPE.hero} style={{ left: 1, top: 1 }} />
          </Plane>
        )}
        {/* A5–A7: the wizard */}
        {t > 3.5 && t < 9.3 && (
          <Plane {...wizP} rx={WRX} w={WIZ_WIN.w * ZK} h={WIZ_WIN.h * ZK} scale={1 / ZK} opacity={1 - seg(t, 8.78, 9.28)}
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
        {lifted && t < 10.12 && (
          <Plane {...vadd(S, { x: 0, y: -Math.sin(rad(WRX)) * (1 - mq), z: 1 }, 1.5)} rx={WRX * (1 - mq)} ry={SITE.ry * mq} w={0} h={0} scale={1 / ZK} dof={false}>
            <div style={{ position: "absolute", left: 0, top: 0, zoom: ZK }}>
            {m2 < 1 && (
              <div style={{ position: "absolute", left: -bw / 2, top: -bh / 2, width: bw, height: bh, borderRadius: mix(7, R0, m1), background: `color-mix(in srgb, ${C.sage} ${(m2 * 100).toFixed(1)}%, #3A3431)`,
                opacity: 1 - seg(t, 8.9, 9.0, LIN), transform: `scale(${1 - 0.045 * prs})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 14, fontWeight: 500, color: "#FFFFFF", overflow: "hidden", whiteSpace: "nowrap" }}>
                <span style={{ opacity: 1 - seg(t, 8.6, 8.76, LIN) }}>Fortsæt</span>
              </div>
            )}
            {t >= 8.9 && <Dots dots={logo} color={`color-mix(in srgb, ${C.sage} ${(m2 * 100).toFixed(1)}%, #3A3431)`} />}
            </div>
          </Plane>
        )}
        {/* A8: the progress line, then the site unfolding from it */}
        {t >= f("w:bygger") / 30 && lineO > 0 && (
          <Plane {...RAIL} ry={SITE.ry} w={RAIL_W} h={20} dof={false} opacity={lineO}>
            <div style={{ position: "absolute", left: tail, top: 10, width: Math.max(0, head - tail), height: 3, borderRadius: 2, background: C.sage }} />
          </Plane>
        )}
        {t >= 9.98 && (
          <Plane {...H1_SITE} w={SITE_WIN.w} h={SITE_WIN.h}
            style={unfold < 1 ? { clipPath: `inset(${(-240 * unfold).toFixed(1)}px -240px ${mix(SITE_WIN.h - 4, -240, unfold).toFixed(1)}px -240px)` } : undefined}>
            <SiteWindow build={build} />
          </Plane>
        )}
      </Stage3D>

      {/* A2: the line floating in the tunnel */}
      {t > 1.7 && t < 3.2 && (
        <div style={{ position: "absolute", left: 960, top: 540, transform: `scale(${mix(0.95, 1.03, seg(t, 1.78, 2.9, LIN))})` }}>
          <Kinetic g={g} size={TYPE.big} items={[{ t: "få", at: "w:f", out: 2.58, dur: 0.45 }, { t: "minutter", at: "w:minutter", out: 2.58, accent: true, dur: 0.45 }, { t: "væk.", at: "w:vk", out: 2.58, dur: 0.4 }]} />
        </div>
      )}
      {/* A10: "Ingen teknik." → "Ingen skabeloner." in front of the far, soft site */}
      {t > 11.2 && (
        <div style={{ position: "absolute", left: 960, top: 540, transform: `scale(${mix(0.97, 1.03, seg(t, 11.33, 13.3, LIN))})`, opacity: 1 - seg(t, 13.16, 13.28, LIN) }}>
          <Kinetic g={g} size={TYPE.hero} items={[{ t: "Ingen", at: "w:ingen", out: 12.98 }, { t: "teknik.", at: "w:teknik", out: "w:ingen2", accent: true },
            { t: "skabeloner.", at: "w:skabeloner", out: 12.98, accent: true }]} />
        </div>
      )}
      {t > 5.75 && t < 8.82 && <Cursor x={cur.x} y={cur.y} press={Math.max(press(g, 6.45), prs)} size={22 * curS} opacity={1 - seg(t, 8.64, 8.8, LIN)} />}
    </AbsoluteFill>
  );
};
