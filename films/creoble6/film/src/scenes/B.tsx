// Scene B (13.6 → 37.92 s): "Det bedste?" → the finished site (one scroll pass, the address bar, the headline edit)
// → the price in kinetic type → through the "0" → the address pill grows into the hosting card → "Fra 83 kr./md.".
// One world: the site stays at H1_SITE; the price type hangs 2800 px in front of it (z = +1400) with the final "0"'s
// counter exactly on the line from the camera to the site's address pill, so the fly-through is one straight push.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, SANS, SHADOW, OUT, INOUT, HOLM, clamp01, mix, appleShadow } from "../lib";
import { f, k, typed, press, Ico } from "../shared";
import { Stage3D, Plane, Cam, cam, project, PERSP } from "../cam";
import { Kinetic, TYPE, measure, useFonts, KItem } from "../type";
import { Spinner } from "../dots";
import { SiteWindow, SITE_WIN, NEW_HEADLINE, HostingCard, CARD, Cursor, Handoff1, Handoff2, camH1, camH2, H1_SITE, H2_CARD, HANDOFF_HALF } from "../ui";

export const BLUR: [number, number][] = [[14.9, 15.55], [21.45, 22.2], [32.2, 33.0], [33.4, 34.1], [36.1, 36.75], [37.0, 37.6]];

/* ---------- camera helpers ---------- */
const rad = (d: number) => (d * Math.PI) / 180;
type V3 = { x: number; y: number; z: number };
// look: the camera that shows world point P at scale s (1 = natural size) at screen (sx, sy), turned ry / rx
const look = (P: V3, s: number, ry = 0, rx = 0, o: { sx?: number; sy?: number; ap?: number } = {}): Cam => {
  const X = ((o.sx ?? 960) - 960) / s, Y = ((o.sy ?? 540) - 540) / s, Z = PERSP - PERSP / s;
  const a2 = rad(-rx), a = rad(ry);
  const y = Y * Math.cos(a2) + Z * Math.sin(a2), Z1 = -Y * Math.sin(a2) + Z * Math.cos(a2);
  const x = X * Math.cos(a) - Z1 * Math.sin(a), z = X * Math.sin(a) + Z1 * Math.cos(a);
  return cam({ x: P.x - x, y: P.y - y, z: P.z - z, rx, ry, focus: PERSP / s, ap: o.ap ?? 14 });
};
// a point on a plane (centre c, turned ry) given in the plane's own px from its top-left corner
const onPlane = (c: { x: number; y: number; z: number; ry: number }, w: number, h: number, u: number, v: number): V3 => {
  const lx = u - w / 2, ly = v - h / 2;
  return { x: c.x + lx * Math.cos(rad(c.ry)), y: c.y + ly, z: c.z - lx * Math.sin(rad(c.ry)) };
};
const sitePt = (u: number, v: number) => onPlane(H1_SITE, SITE_WIN.w, SITE_WIN.h, u, v);   // window px (page y + 46)
const cardPt = (u: number, v: number) => onPlane(H2_CARD, CARD.w, CARD.h, u, v);
const focusOn = (c: Cam, P: V3): Cam => ({ ...c, focus: project(c, P).dist });
const SITE_C: V3 = { x: H1_SITE.x, y: H1_SITE.y, z: H1_SITE.z };
const CARD_C: V3 = { x: H2_CARD.x, y: H2_CARD.y, z: H2_CARD.z };
const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), z: mix(a.z, b.z, t), rx: mix(a.rx, b.rx, t), ry: mix(a.ry, b.ry, t),
  rz: mix(a.rz, b.rz, t), focus: mix(a.focus, b.focus, t), ap: mix(a.ap, b.ap, t),
});
const sec = (g: number) => g / 30;
const io = (g: number, a: number, b: number) => INOUT(clamp01((g - f(a)) / (f(b) - f(a))));
const lin = (g: number, a: number, b: number) => clamp01((g - f(a)) / (f(b) - f(a)));
// a slow sway under every pose: nothing ever rests
const sway = (g: number, c: Cam, amt = 1): Cam => ({ ...c, x: c.x + amt * 5 * Math.sin(g / 41), y: c.y + amt * 3 * Math.sin(g / 57 + 1) });

/* ---------- the world ---------- */
const TYPE_Z = 1400;                           // the price type's depth
const PILL = sitePt(730, 23);                  // the address pill's centre
const ZERO_Y = -150;                           // the "0" counter's world y: the fly-through aims at the site's upper middle
const DIGIT = 240, COL = 0.6 * DIGIT, SP = 0.27 * DIGIT, LH = DIGIT * 1.25;
const ZERO_CY = 4;                             // the "0" counter's centre below the line's centre (px at 240)
const ZERO_A = 40, ZERO_B = 66;                // the clip ellipse inside the 0's stroke (half axes, px at 240)

/* ---------- times (film seconds) ---------- */
const T = {
  fly0: 14.82, fly1: 15.56, pass1: 16.3, bar1: 17.1, bar2: 17.95, hero1: 18.65, edit0: 18.75, edit1: 19.3,
  type0: 19.05, send: 20.0, swap: 20.4, clear0: 21.15, clear1: 22.35,
  push0: 31.95, push1: 33.25, morph0: 33.35, morph1: 34.15, ecu0: 36.05, ecu1: 36.75, ecu2: 37.0,
};
const EDIT_TEXT = "Gør overskriften mere personlig";

/* ---------- the camera ---------- */
type Key = { at: number; p: (g: number) => Cam };
const makeCam = (g: number, zeroX: number): Cam => {
  const typeC: V3 = { x: -zeroX, y: ZERO_Y - ZERO_CY + 100, z: TYPE_Z };           // the type block's centre
  const pType = (gg: number) => {
    const u = lin(gg, T.clear1 - 0.6, T.push0);
    return sway(gg, look(typeC, mix(0.94, 1.12, u), mix(-5, 5, u), 0, { ap: 24 }));
  };
  const pA = (gg: number) => sway(gg, focusOn(look(PILL, 1.9 + 0.1 * (sec(gg) - T.push1), 0, 0, { ap: 16 }), SITE_C));
  const pCard = (gg: number) => {
    const u = lin(gg, T.morph1 - 0.4, T.ecu0);
    return sway(gg, focusOn(look(CARD_C, mix(0.95, 1.17, u), mix(-1, 3, u), 0, { ap: 14 }), CARD_C), 0.6);
  };
  const pPrice = (gg: number) => sway(gg, focusOn(look(cardPt(64 + 172, 528 + 44), 3.3 + 0.3 * (sec(gg) - T.ecu1), 5.5, 0, { ap: 14 }), CARD_C), 0.4);
  const keys: Key[] = [
    { at: T.fly0, p: camH1 },
    { at: T.fly1, p: (gg) => sway(gg, focusOn(look(sitePt(730, 453), 1.0, 2, 0), SITE_C)) },
    { at: T.pass1, p: (gg) => sway(gg, focusOn(look(sitePt(600, 540), 1.3, 15, 2), SITE_C)) },
    { at: T.bar1, p: (gg) => sway(gg, focusOn(look(sitePt(772, 23), 2.7 + 0.1 * (sec(gg) - T.bar1), 12, -1, { sy: 500 }), SITE_C), 0.5) },
    { at: T.bar2, p: (gg) => sway(gg, focusOn(look(sitePt(772, 23), 2.7 + 0.1 * (sec(gg) - T.bar1), 12, -1, { sy: 500 }), SITE_C), 0.5) },
    { at: T.hero1, p: (gg) => sway(gg, focusOn(look(sitePt(420, 330), 1.28, 3, 0), SITE_C)) },
    { at: T.edit0, p: (gg) => sway(gg, focusOn(look(sitePt(420, 330), 1.28, 3, 0), SITE_C)) },
    { at: T.edit1, p: (gg) => sway(gg, focusOn(look(sitePt(376, 330), 1.66 + 0.05 * (sec(gg) - T.edit1), 1 + 1.6 * (sec(gg) - T.edit1), 0), SITE_C)) },
    { at: T.clear0, p: (gg) => sway(gg, focusOn(look(sitePt(376, 330), 1.66 + 0.05 * (sec(gg) - T.edit1), 1 + 1.6 * (sec(gg) - T.edit1), 0), SITE_C)) },
    { at: T.clear1, p: pType },
    { at: T.push0, p: pType },
    { at: T.push1, p: pA },
    { at: T.morph0, p: pA },
    { at: T.morph1, p: pCard },
    { at: T.ecu0, p: pCard },
    { at: T.ecu1, p: pPrice },
    { at: T.ecu2, p: pPrice },
    { at: (f("h2") - HANDOFF_HALF) / 30, p: camH2 },
  ];
  // through the zero: one straight push; x / y / ry line up on the counter early, z runs through
  if (g > f(T.push0) && g < f(T.push1)) {
    const a = pType(g), b = pA(g), u = lin(g, T.push0, T.push1), al = INOUT(clamp01(u / 0.36)), zz = INOUT(u);
    const rise = INOUT(clamp01((u - 0.5) / 0.5));
    return { x: mix(a.x, b.x, al), y: mix(mix(a.y, ZERO_Y, al), b.y, rise), z: mix(a.z, b.z, zz), rx: 0, ry: mix(a.ry, b.ry, al), rz: 0, focus: mix(a.focus, b.focus, INOUT(clamp01(u / 0.7))), ap: mix(a.ap, b.ap, zz) };
  }
  if (g <= f(keys[0].at)) return keys[0].p(g);
  for (let i = 1; i < keys.length; i++) {
    const t0 = f(keys[i - 1].at), t1 = f(keys[i].at);
    if (g <= t1) return lerpCam(keys[i - 1].p(g), keys[i].p(g), INOUT(clamp01((g - t0) / Math.max(1e-6, t1 - t0))));
  }
  return keys[keys.length - 1].p(g);
};

/* ---------- the site with the edit (B2 – B8) ---------- */
const HEAD: React.CSSProperties = { position: "absolute", left: 70, top: 168, fontFamily: SANS, fontSize: 76, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.0, color: HOLM.ink, whiteSpace: "nowrap" };
const Line: React.FC<{ ws: string[]; p: (i: number) => number; i0: number }> = ({ ws, p, i0 }) => (
  <div style={{ height: 76 }}>
    {ws.map((w, i) => (
      <React.Fragment key={i}>
        <span style={{ display: "inline-block", overflow: "hidden", padding: "0.1em 0.04em 0.24em", margin: "-0.1em -0.04em -0.24em", verticalAlign: "top" }}>
          <span style={{ display: "inline-block", transform: `translateY(${(p(i0 + i) * 125).toFixed(2)}%)` }}>{w}</span>
        </span>{i < ws.length - 1 ? " " : null}
      </React.Fragment>
    ))}
  </div>
);
const SiteLayer: React.FC<{ g: number; scroll: number }> = ({ g, scroll }) => {
  const chip = k(g, "w:en+0.1", 0.55);
  const sel = k(g, "w:noget+0.06", 0.35) * (1 - k(g, 21.0, 0.4, INOUT));
  const field = k(g, "w:noget+0.14", 0.5) * (1 - k(g, 20.95, 0.4, INOUT));
  const fieldIn = k(g, "w:noget+0.14", 0.5);
  const txt = typed(g, T.type0, EDIT_TEXT, 36);
  const busy = k(g, T.send + 0.08, 0.3, INOUT), spin = busy * (1 - k(g, 20.75, 0.3, INOUT));
  const blink = txt.length > 0 && txt.length < EDIT_TEXT.length ? 1 : (Math.floor((g / 30) * 2) % 2 === 0 ? 1 : 0);
  const outP = (i: number) => -INOUT(clamp01((g - f(T.swap) - i * 1.2) / 10));                       // old words rise out
  const inP = (i: number) => 1 - OUT(clamp01((g - f("w:retter-0.1") - i * 2.2) / 18));                   // new words rise in
  const swapped = g >= f(T.swap) + 30;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SITE_WIN.w, height: SITE_WIN.h }}>
      <SiteWindow scroll={scroll} headline={<span />} />
      {/* "Gratis" beside "Forhåndsvisning" in the address pill */}
      {chip > 0 && (
        <div style={{ position: "absolute", left: 797, top: 13, height: 20, width: 62, overflow: "hidden" }}>
          <div style={{ height: 20, padding: "0 9px", borderRadius: 10, background: C.sageTint, color: C.sageDeep, fontFamily: SANS, fontWeight: 500, fontSize: 12.5, lineHeight: "20px", display: "inline-block",
            transform: `translateX(${((1 - chip) * -64).toFixed(2)}px)` }}>Gratis</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, top: 46, width: SITE_WIN.w, height: SITE_WIN.h - 46, overflow: "hidden", borderRadius: "0 0 16px 16px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${-scroll}px)` }}>
          {!swapped && <div style={HEAD}><Line ws={["Kom", "godt", "i"]} p={outP} i0={0} /><Line ws={["bevægelse", "igen."]} p={outP} i0={3} /></div>}
          {g >= f("w:retter-0.1") && <div style={HEAD}><Line ws={["Velkommen", "hjem"]} p={inP} i0={0} /><Line ws={["i", "din", "krop."]} p={inP} i0={2} /></div>}
          {sel > 0 && <div style={{ position: "absolute", left: 54, top: 156, width: 612, height: 176, borderRadius: 8, border: `2px solid ${C.sage}`, boxSizing: "border-box", opacity: sel }} />}
          {field > 0 && (
            <div style={{ position: "absolute", left: 54, top: 346, width: 640, height: 64, borderRadius: 12, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, opacity: field,
              transform: `translateY(${((1 - fieldIn) * -14).toFixed(2)}px)`, fontFamily: SANS, fontSize: 20, color: C.ink, display: "flex", alignItems: "center", padding: "0 14px 0 22px", boxSizing: "border-box" }}>
              {txt.length === 0 ? <><div style={{ width: 2, height: 26, background: C.ink, opacity: blink, marginRight: 2 }} /><span style={{ color: C.soft }}>Beskriv din ændring…</span></>
                : <><span style={{ whiteSpace: "pre" }}>{txt}</span><div style={{ width: 2, height: 26, background: C.ink, opacity: blink * (1 - busy), marginLeft: 2 }} /></>}
              <div style={{ flex: 1 }} />
              <div style={{ position: "relative", width: 40, height: 40, flex: "none" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: C.ink, opacity: 1 - busy, transform: `scale(${(1 - 0.08 * press(g, T.send)) * mix(1, 0.5, busy)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ico n="arrow" s={20} c="#fff" w={2.4} style={{ transform: "rotate(-90deg)" }} /></div>
                {spin > 0 && <div style={{ position: "absolute", left: 20, top: 20 }}><Spinner g={g} size={34} p={spin} color={C.sageDark} /></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- the price: three columns that roll down to 0, then the leading zeros fold away ---------- */
const Roll: React.FC<{ p: number; fold: number }> = ({ p, fold }) => (
  <div style={{ display: "flex", height: LH, fontVariantNumeric: "lining-nums tabular-nums" }}>
    {[4, 9, 9].map((a, i) => {
      const q = INOUT(clamp01(p * 1.3 - i * 0.15)), w = i < 2 ? COL * (1 - fold) : COL;
      return (
        <div key={i} style={{ position: "relative", width: w, height: LH, overflow: "hidden", flex: "none" }}>
          <div style={{ position: "absolute", right: 0, top: 0, width: COL, transform: `translateY(${(-q * a * LH).toFixed(2)}px)` }}>
            {Array.from({ length: a + 1 }, (_, n) => <div key={n} style={{ height: LH, lineHeight: `${LH}px`, textAlign: "center" }}>{a - n}</div>)}
          </div>
        </div>
      );
    })}
  </div>
);

const SUB = 72;
const subLines = (): KItem[][] => [
  [{ t: "Én", at: "w:n", accent: true, out: "w:intet-0.12" }, { t: "gang.", at: "w:gang", out: "w:intet-0.12" }],
  [{ t: "Intet", at: "w:intet", out: "w:siden2-0.12" }, { t: "abonnement.", at: "w:abonnement", accent: true, out: "w:siden2-0.12" }],
  [{ t: "Siden", at: "w:siden2", out: "w:ikke-0.12" }, { t: "er", at: "w:er2", out: "w:ikke-0.12" }, { t: "din.", at: "w:din3", accent: true, out: "w:ikke-0.12" }],
  [{ t: "Ikke", at: "w:ikke", out: "w:nul-0.12" }, { t: "tilfreds?", at: "w:tilfreds2", accent: true, out: "w:nul-0.12" }],
  [{ t: "Nul", at: "w:nul", accent: true, out: T.push0 - 0.12 }, { t: "risiko.", at: "w:risiko", out: T.push0 - 0.12 }],
];

/* ---------- the scene ---------- */
export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  const ready = useFonts();
  const wKr = measure("kr.", DIGIT, true, true, 400, ready);
  const zeroX = -(COL + SP + wKr) / 2 + COL / 2;                 // the final "0"'s centre in the line (line centre = 0)
  if (g <= f("h1") + HANDOFF_HALF) return <Handoff1 g={g} />;
  if (g >= f("h2") - HANDOFF_HALF) return <Handoff2 g={g} />;
  const c = makeCam(g, zeroX);

  /* the site */
  const scroll = 560 * io(g, 15.2, 16.75);
  const reset = io(g, 17.4, 17.8);
  const siteO = g < f(T.clear1) ? (1 - 0.6 * io(g, 13.9, 14.15) * (1 - io(g, 14.8, 15.2))) * (1 - io(g, 21.9, 22.33)) : g < f(T.push0) ? 0 : lin(g, T.push0, T.push0 + 0.25) * (1 - io(g, 33.85, 34.4));
  const edited = g >= f(T.push0);
  const fb = g < f(T.pass1) ? 8 * io(g, T.fly1, T.pass1) : g < f(T.bar2) ? mix(8, 15, io(g, T.pass1, T.bar1)) : 15 * (1 - io(g, T.bar2 + 0.1, T.bar2 + 0.6));
  const ang = mix(90, 180, io(g, T.pass1, T.bar1)), back = io(g, T.bar2, T.bar2 + 0.6);
  const ma = mix(mix(45, 5, io(g, T.pass1, T.bar1)), 120, back), mb = mix(mix(95, 8.5, io(g, T.pass1, T.bar1)), 170, back);
  const mask = `linear-gradient(${ang.toFixed(2)}deg, #000 ${ma.toFixed(2)}%, transparent ${mb.toFixed(2)}%)`;

  /* the type */
  const priceY = ZERO_Y - ZERO_CY, typeX = -zeroX;
  const up = k(g, "w:n", 0.6, INOUT);
  const rollP = lin(g, f("w:koster") / 30, f("w:ingenting") / 30 + 0.5), fold = k(g, "w:ingenting+0.32", 0.55, INOUT);
  const zero: V3 = { x: 0, y: ZERO_Y, z: TYPE_Z };
  const zp = project(c, zero), passed = c.z + PERSP <= TYPE_Z + 30;
  const showType = g > f(T.clear1 - 0.3) && !passed && zp.s < 34;
  const pushing = g > f(T.push0) && !passed;
  const clip = pushing ? `ellipse(${(ZERO_A * zp.s).toFixed(1)}px ${(ZERO_B * zp.s).toFixed(1)}px at ${zp.x.toFixed(1)}px ${zp.y.toFixed(1)}px)` : undefined;

  /* the pill → the hosting card */
  const m = io(g, T.morph0, T.morph1), morphing = g > f(T.morph0);
  const bw = mix(320, CARD.w, m), bh = mix(28, CARD.h, m);
  const box = { x: mix(PILL.x, H2_CARD.x, m), y: mix(PILL.y, H2_CARD.y, m), z: mix(PILL.z + 4, H2_CARD.z, m), ry: mix(H1_SITE.ry, H2_CARD.ry, m) };
  const rows = lin(g, f("w:stter") / 30, f("w:stter") / 30 + 0.5) + lin(g, f("w:hele2") / 30, f("w:hele2") / 30 + 0.5) + lin(g, f("w:op") / 30, f("w:op") / 30 + 0.5);
  const price = lin(g, f("w:fra") / 30, f("w:fra") / 30 + 0.55);
  const card = <HostingCard g={g} rows={rows} active={[0, 0, 0]} price={price} />;

  /* the cursor (screen space) */
  const showCur = g > f(T.bar2) && g < f(21.2);
  let cur = { x: 0, y: 0 };
  if (showCur) {
    const t1 = project(c, sitePt(330, 46 + 268)), t2 = project(c, sitePt(54 + 640 - 34, 46 + 346 + 36));
    const a = io(g, T.bar2 + 0.05, 18.62), b = io(g, 19.3, 19.92), d = io(g, 20.4, 21.15);
    cur = { x: mix(mix(mix(1500, t1.x, a), t2.x, b), 1560, d), y: mix(mix(mix(1180, t1.y, a), t2.y, b), 1200, d) };
  }

  return (
    <AbsoluteFill>
      {siteO > 0 && (
        <AbsoluteFill style={{ opacity: siteO, clipPath: clip }}>
          <Stage3D cam={c}>
            <Plane {...H1_SITE} w={SITE_WIN.w} h={SITE_WIN.h} farBlur={edited ? 0 : fb} farMask={mask}>
              {edited ? <SiteWindow headline={NEW_HEADLINE} /> : (
                <>
                  {reset < 1 && <SiteLayer g={g} scroll={scroll} />}
                  {reset > 0 && <div style={{ position: "absolute", left: 0, top: 0, opacity: reset }}><SiteLayer g={g} scroll={0} /></div>}
                </>
              )}
            </Plane>
          </Stage3D>
        </AbsoluteFill>
      )}
      <Stage3D cam={c}>
        {/* B1: "Det bedste?" in front of the far site */}
        {g < f(15.5) && (
          <Plane x={16} y={-4} z={-200} w={0} h={0} dof={false}>
            <Kinetic g={g} size={TYPE.hero} items={[{ t: "Det", at: "w:det", out: 14.84 }, { t: "bedste?", at: "w:bedste", accent: true, out: 14.84 }]} />
          </Plane>
        )}
        {/* B9: the price */}
        {showType && (
          <>
            <Plane x={typeX} y={priceY + 100} z={TYPE_Z} w={0} h={0} dof={false}>
              <Kinetic g={g} size={TYPE.hero} items={[{ t: "Tilfreds?", at: "w:tilfreds", accent: true, out: 23.0 }]} />
            </Plane>
            <Plane x={typeX} y={priceY + 100 * (1 - up)} z={TYPE_Z} w={0} h={0} dof={false}>
              <Kinetic g={g} size={DIGIT} items={[{ node: <Roll p={rollP} fold={fold} />, w: COL * (3 - 2 * fold), at: "w:499", dur: 0.7 }, { t: "kr.", at: "w:kroner", accent: true, dur: 0.7 }]} />
            </Plane>
            <Plane x={typeX} y={priceY + 212} z={TYPE_Z + 36} w={0} h={0} dof={false}>
              {subLines().map((items, i) => <Kinetic key={i} g={g} size={SUB} items={items} />)}
            </Plane>
          </>
        )}
        {/* B11 – B13: the address pill grows into the hosting card */}
        {morphing && (m < 1 ? (
          <Plane {...box} w={bw} h={bh}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: mix(8, 24, m), background: `color-mix(in srgb, ${C.white} ${(m * 100).toFixed(1)}%, #F1EEE8)`,
              boxShadow: `0 0 0 1px rgba(232,229,223,${m.toFixed(3)}), ${appleShadow(m, 1)}` }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 15, color: C.muted, opacity: 1 - clamp01(m * 4) }}>Forhåndsvisning</div>
              <div style={{ position: "absolute", left: (bw - CARD.w) / 2, top: (bh - CARD.h) / 2, opacity: clamp01((m - 0.45) / 0.5) }}>{card}</div>
            </div>
          </Plane>
        ) : <Plane {...H2_CARD} w={CARD.w} h={CARD.h}>{card}</Plane>)}
      </Stage3D>
      {showCur && <Cursor x={cur.x} y={cur.y} size={48} press={Math.max(press(g, "w:noget"), press(g, T.send))} />}
    </AbsoluteFill>
  );
};
