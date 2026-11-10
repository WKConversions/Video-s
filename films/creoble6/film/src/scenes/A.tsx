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

export const BLUR: [number, number][] = [[1.5, 2.25], [3.1, 3.8], [4.5, 5.15], [8.8, 9.35], [9.6, 10.3]];

/* ---------- geometry ---------- */
type V = { x: number; y: number; z: number };
type Pl = V & { rx?: number; ry?: number };
const rad = (d: number) => (d * Math.PI) / 180;
const vadd = (a: V, b: V, m = 1): V => ({ x: a.x + b.x * m, y: a.y + b.y * m, z: a.z + b.z * m });
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
const LIN = (t: number) => t;
const COS = (u: number) => (1 - Math.cos(Math.PI * u)) / 2;       // the softest ease: for fades and wipes of large areas
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
const WIZ_L = { x: 0, y: 1150, z: -2200 };                        // the wizard's centre in zone H's local space
const OH: V = { x: WIZ.x - WIZ_L.x, y: WIZ.y - WIZ_L.y, z: WIZ.z - WIZ_L.z };
const H = (x: number, y: number, z: number): V => ({ x: x + OH.x, y: y + OH.y, z: z + OH.z });

// the tunnel (local), short (revision 2): the 404 page at its end; old sites on the walls, the floor, the ceiling
const Z_ERR = -1900, Z_LINE2 = -2600;   // "Bygget af AI." waits just behind the 404 page
const TUNNEL: { x: number; y: number; z: number; rx: number; ry: number; rz: number; i: number }[] = [
  { x: -720, y: 0, z: -1170, rx: 0, ry: 76, rz: 0, i: 3 }, { x: 720, y: 0, z: -1170, rx: 0, ry: -76, rz: 0, i: 1 },
  { x: 0, y: -440, z: -1380, rx: -75, ry: 0, rz: 0, i: 2 }, { x: 0, y: 440, z: -1380, rx: 75, ry: 0, rz: 0, i: 4 },
];

/* ---------- the camera (revision 2): ONE velocity-continuous path ---------- */
// A monotone cubic spline (PCHIP) through the poses below, per parameter: position and speed are continuous
// everywhere, the camera glides THROUGH each pose without stopping, and it never overshoots a pose.
// In the hook the keys are the eye's distance d to the inline window's plane (negative = inside the tunnel): a
// steady push from frame 0 that grows into the entry, a calm glide down the short tunnel, the same glide on through
// the 404 page to "Bygget af AI.".
type Key = { t: number; c: Cam };
const hk = (t: number, d: number, o: Partial<Cam> = {}): Key => ({ t, c: cam({ ...H(0, 0, d - PERSP), ...o }) });
const a10 = (sc: number, ox: number, oy: number, dry: number) => look(SITE, siteQ(730 - ox / sc, 453 - oy / sc), sc, 20, 0, dry);
const T_END = (f("h1") - HANDOFF_HALF) / 30;
const KEYS: Key[] = [
  hk(0, 5200), hk(0.5, 4450), hk(1.0, 3600), hk(1.4, 2750), hk(1.75, 1950, { ap: 4 }),
  hk(2.1, 1300, { ap: 10, rz: 2, focus: 3000 }), hk(2.45, 660, { ap: 12, rz: 3, focus: 2500 }), hk(2.8, 90, { ap: 12, rz: 1, focus: 1990 }),
  hk(3.15, -280, { ap: 12, focus: 1620 }), hk(3.5, -480, { ap: 12, focus: 1420 }), hk(3.8, -700, { ap: 10, focus: 1500 }),
  { t: 4.2, c: cam({ ...H(0, 70, Z_LINE2 + 110), rx: 2.5, ap: 10 }) },   // "Bygget af AI."; the crane has already begun
  { t: 5.85, c: lookW(800, 350, 1.72) },                               // the crane down: the form column 900 px wide
  { t: 6.7, c: lookW(806, 284, 2.62) },                                 // extreme close-up: the field 1250 px wide
  { t: 7.4, c: lookW(840, 288, 2.95) },                                // pushing on and tracking the text
  { t: 8.55, c: lookW(905, 600, 2.4) },                                // down-right to Fortsæt
  { t: 9.55, c: look(MARK, S, 1.3, 20, 0, -6) },                       // the button's spot: the spinner
  { t: 10.6, c: look(SITE, siteQ(730, 453), 0.96, 20, 0, -5) },        // along the progress line to the window
  { t: 11.5, c: a10(0.4, 330, -240, -8) },                             // the site small, gliding to the upper right
  { t: T_END, c: camH1(f("h1") - HANDOFF_HALF) },                      // exactly the hand-off pose
];
const CAMP: (keyof Cam)[] = ["x", "y", "z", "rx", "ry", "rz", "focus", "ap"];
const SLOPES = CAMP.map((p) => {
  const n = KEYS.length, h = KEYS.slice(1).map((kk, i) => kk.t - KEYS[i].t), d = h.map((hh, i) => (KEYS[i + 1].c[p] - KEYS[i].c[p]) / hh);
  return KEYS.map((_, i) => {
    if (i === 0) return d[0];
    if (i === n - 1) return 0;                                      // a soft landing on the hand-off
    if (d[i - 1] * d[i] <= 0) return 0;
    const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
    return (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  });
});
const sceneCam = (g: number): Cam => {
  const t = Math.min(T_END, Math.max(0, g / 30));
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i++;
  const h = KEYS[i + 1].t - KEYS[i].t, u = (t - KEYS[i].t) / h, u2 = u * u, u3 = u2 * u;
  const c = cam();
  CAMP.forEach((p, j) => { c[p] = (2 * u3 - 3 * u2 + 1) * KEYS[i].c[p] + (u3 - 2 * u2 + u) * h * SLOPES[j][i] + (-2 * u3 + 3 * u2) * KEYS[i + 1].c[p] + (u3 - u2) * h * SLOPES[j][i + 1]; });
  return c;
};

/* ---------- the opening line's layout (the same slot maths as Kinetic, to know where its inline window sits) ---------- */
const SP = 0.27 * TYPE.big, WDUR = 0.8;
const LINE1: { t: string; at: string; accent?: boolean }[] = [{ t: "Din", at: "w:din" }, { t: "nye", at: "w:nye" }, { t: "", at: "" }, { t: "hjemmeside", at: "w:hjemmeside", accent: true }];
const nodeX = (g: number, nodeW: number, ready: boolean) => {
  let acc = 0, cum = 0, nx = 0;
  for (const it of LINE1) {
    const node = it.t === "", w = node ? nodeW : measure(it.t, TYPE.big, !!it.accent, true, 400, ready);
    const slot = node ? 1 : INOUT(clamp01((g - f(it.at)) / (WDUR * 30 * 0.9)));
    const pre = SP * slot * Math.min(1, acc), l = cum + pre;
    if (node) nx = l + nodeW / 2;
    cum += pre + slot * w; acc += slot;
  }
  return nx - cum / 2;
};

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  const ready = useFonts();
  if (g >= f("h1") - HANDOFF_HALF) return <Handoff1 g={g} />;
  const t = g / 30;
  const c = sceneCam(g);
  const dW = c.z - OH.z + PERSP;                                  // the eye's distance to the inline window's plane
  const sW = PERSP / Math.max(200, dW);                           // the inline window's scale on screen
  const nodeW = Math.min(5000, OLD.w * sW);                       // its slot in the line grows with it: the words glide apart
  const shift = -nodeX(g, nodeW, ready) * seg(t, 0.95, 1.7);      // the line slides so the window ends on the centre
  const winX = (nodeX(g, nodeW, ready) + shift) / sW;             // the window's place in the world (the camera is on the axis)
  const dist = (p: V) => project(c, p).dist;

  /* the opening line */
  const line1: KItem[] = LINE1.map((it) => (it.t === "" ? { node: <div style={{ width: nodeW, height: 1 }} />, w: nodeW, at: -1 } : { t: it.t, at: it.at, accent: it.accent, dur: WDUR }));
  const rock = 1 - seg(t, 0.2, 1.5);
  const pageO = INOUT(clamp01((dW - 900) / 1300));
  const gate = INOUT(clamp01((1900 - dW) / 1100)) * (1 - seg(t, 3.0, 3.85, COS));

  /* the wizard */
  const NAME = "Holm Fysioterapi";
  const T_LINE = 9.42;                                            // the progress line starts, to be well under way on "bygger"
  const name = typed(g, 6.52, NAME, 17);
  const focused = t >= 6.47;
  const far = 5 * seg(t, 5.8, 6.7) * (1 - seg(t, 7.3, 8.4));
  const lifted = t >= 8.58;
  const fall = seg(t, 8.62, 10.1);
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
  const unfold = seg(t, 9.8, 11.0, COS);
  const build = clamp01((t - 10.3) / 1.3);
  const lineO = 1 - seg(t, 10.95, 11.4);

  /* the cursor (screen space, on page points) */
  const pg = (px: number, py: number) => { const q = project(c, wizQ(px, py)); return { x: q.x, y: q.y }; };
  const cur = cursorAt(g, [{ at: 5.8, ...pg(1480, 760) }, { at: 6.42, ...pg(905, 298) }, { at: 6.56, ...pg(905, 298) }, { at: 7.0, ...pg(990, 322) }, { at: 7.72, ...pg(994, 330) }, { at: 8.33, ...pg(1004, 730) }]);
  const curS = project(c, wizQ(900, 500)).s;

  return (
    <AbsoluteFill>
      <Stage3D cam={c}>
        {/* A1: the line, with the old window inside it */}
        {dW > -60 && (
          <Plane {...H(winX, 0, 0)} w={OLD.w} h={OLD.h} dof={false} blur={16 * INOUT(clamp01((1700 - dW) / 1300))}
            ry={rock * (9 * Math.sin(t * 2.3) + 2)} rx={rock * 5 * Math.sin(t * 1.7 + 0.6)}>
            <OldSite i={0} pageOpacity={pageO} />
          </Plane>
        )}
        {/* A2: the tunnel of old sites; A3: the 404 page at its end */}
        {t > 1.0 && t < 4.0 && TUNNEL.map((p, i) => {
          const P = H(p.x, p.y, p.z), fog = clamp01((3600 - dist(P)) / 1400);
          return <Plane key={i} {...P} rx={p.rx} ry={p.ry} rz={p.rz} w={OLD.w} h={OLD.h} opacity={gate * fog}><OldSite i={p.i} /></Plane>;
        })}
        {t > 1.0 && t < 4.0 && (() => {
          const P = H(0, 0, Z_ERR);
          return <Plane {...P} w={ERR.w} h={ERR.h} opacity={INOUT(clamp01((1900 - dW) / 1100)) * (1 - seg(t, 3.25, 3.95, COS))}><ErrorPage p={seg(t, 2.56, 2.8)} /></Plane>;
        })()}
        {/* A4: "Bygget af AI." */}
        {t > 2.9 && t < 5.7 && (
          <Plane {...H(0, 0, Z_LINE2)} w={2} h={2} dof={false} opacity={seg(t, 3.45, 3.95, COS)}>
            <Kinetic g={g} items={[{ t: "Bygget", at: "w:bygget", dur: 0.8 }, { t: "af", at: "w:af", dur: 0.8 }, { t: "AI.", at: "w:ai", accent: true, dur: 0.8 }]} size={TYPE.hero} style={{ left: 1, top: 1 }} />
          </Plane>
        )}
        {/* A5–A7: the wizard */}
        {t > 4.0 && t < 10.1 && (
          <Plane {...wizP} rx={WRX} w={WIZ_WIN.w * ZK} h={WIZ_WIN.h * ZK} scale={1 / ZK} opacity={1 - 0.45 * seg(t, 8.8, 9.5) - 0.55 * seg(t, 9.3, 10.1)}
            blur={ZK * 10 * fall + (ZK - 1) * dofBlur(c, dist(wizP))}
            farBlur={ZK * far} farMask="radial-gradient(ellipse 36% 15% at 50% 39.5%, #000 55%, transparent 100%)">
            <div style={{ position: "relative", width: WIZ_WIN.w, height: WIZ_WIN.h, zoom: ZK }}>
              <WizardWindow g={g} name={name} focus={focused ? "name" : null} caret={focused} caretSolid={t < 7.6} hover={hover} press={prs} hideButton={lifted} />
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
        {t >= 9.8 && (
          <Plane {...H1_SITE} w={SITE_WIN.w} h={SITE_WIN.h}
            style={unfold < 1 ? { clipPath: `inset(${(-240 * unfold).toFixed(1)}px -240px ${mix(SITE_WIN.h - 4, -240, unfold).toFixed(1)}px -240px)` } : undefined}>
            <SiteWindow build={build} />
          </Plane>
        )}
      </Stage3D>

      {/* A1: the line, with the old window growing inside it; the words glide apart and out */}
      {t < 1.85 && (
        <div style={{ position: "absolute", left: 960 + shift, top: 540, opacity: 1 - seg(t, 1.5, 1.82) }}>
          <Kinetic g={g} items={line1} size={TYPE.big} />
        </div>
      )}
      {/* A2: the line floating in the tunnel */}
      {t > 1.7 && t < 3.2 && (
        <div style={{ position: "absolute", left: 960, top: 540, transform: `scale(${mix(0.95, 1.03, seg(t, 1.78, 2.9, LIN))})` }}>
          <Kinetic g={g} size={TYPE.big} items={[{ t: "få", at: "w:f", out: 2.54, dur: 0.7 }, { t: "minutter", at: "w:minutter", out: 2.54, accent: true, dur: 0.7 }, { t: "væk.", at: "w:vk", out: 2.54, dur: 0.6 }]} />
        </div>
      )}
      {/* a quiet cream veil over the receding site while the line is read (gone before the hand-off) */}
      {t > 11.2 && <AbsoluteFill style={{ background: C.bg, opacity: 0.8 * seg(t, 10.9, 12.1, COS) * (1 - seg(t, 12.7, 13.3, COS)) }} />}
      {/* A10: "Ingen teknik." → "Ingen skabeloner." in front of the far, soft site */}
      {t > 11.2 && (
        <div style={{ position: "absolute", left: 960, top: 540, transform: `scale(${mix(0.97, 1.03, seg(t, 11.33, 13.3, LIN))})`, opacity: 1 - seg(t, 12.8, 13.22, COS) }}>
          <Kinetic g={g} size={TYPE.big} items={[{ t: "Ingen", at: "w:ingen", dur: 0.9 }, { t: "teknik.", at: "w:teknik", out: "w:ingen2", accent: true, dur: 0.9 },
            { t: "skabeloner.", at: "w:skabeloner", accent: true, dur: 0.9 }]} />
        </div>
      )}
      {t > 5.75 && t < 8.82 && <Cursor x={cur.x} y={cur.y} press={Math.max(press(g, 6.45), prs)} size={22 * curS} opacity={1 - seg(t, 8.64, 8.9)} />}
    </AbsoluteFill>
  );
};
