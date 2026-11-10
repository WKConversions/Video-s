// Scene B (h1 20.5 s → h2 44.65 s): the preview, the edit, the choice, hosting turning green (contract 2, B1–B7).
// Objects carry the motion. The camera is one steady push for the whole span (the kit's hand-off rate, 12 units/s);
// every "move" is an object morph on a critically damped spring. One world plane (z = ZS) holds the site, the cards
// and the line; the hosting card sits on the kit's hand-off plane so the last frames equal Handoff2.
import React from "react";
import { C, SANS, SERIF, SHADOW, SHADOW_BIG, INOUT, clamp01, mix } from "../lib";
import { f, aspring, press, Ico, Browser, HolmSite } from "../shared";
import { Stage3D, Plane, cam, PERSP } from "../cam";
import { Kinetic } from "../type";
import { Spinner } from "../dots";
import { SiteWindow, HostingCard, CARD, CARD_R, Cursor, Handoff1, Handoff2, HANDOFF_HALF } from "../ui";

export const BLUR: [number, number][] = [];
export const EVENTS: { t: number; kind: "click" | "type" | "check" | "pop" | "open" | "send" | "logo"; len?: number; note: string }[] = [
  { t: 20.9, kind: "open", note: "B1 the window grows to the whole page (soft, long)" },
  { t: 22.2, kind: "pop", note: "B1 chip 'Gratis forhåndsvisning' lands on the window's top edge" },
  { t: 23.8, kind: "open", note: "B2 the window returns to normal size (soft)" },
  { t: 24.48, kind: "click", note: "B2 cursor clicks the headline" },
  { t: 24.62, kind: "pop", note: "B2 the edit field grows out of the headline" },
  { t: 24.9, kind: "type", len: 0.97, note: "B2 typing 'Gør overskriften mere personlig'" },
  { t: 26.0, kind: "click", note: "B2 cursor presses send" },
  { t: 26.05, kind: "send", note: "B2 the edit is sent" },
  { t: 26.5, kind: "pop", note: "B2 the headline swaps to the new one (soft)" },
  { t: 27.98, kind: "open", note: "B3 the site shrinks into the thumbnail card" },
  { t: 28.5, kind: "pop", note: "B4 the card splits in two (the copy slides right)" },
  { t: 29.76, kind: "pop", note: "B4 'Én gang for alle' (very soft)" },
  { t: 30.85, kind: "pop", note: "B4 the right card comes forward: 'Online'" },
  { t: 31.8, kind: "pop", note: "B4 address pill holmfysio.dk" },
  { t: 32.52, kind: "pop", note: "B4 the price 99 kr. rises in" },
  { t: 34.68, kind: "check", note: "B5 'Uden binding' ticks in" },
  { t: 36.05, kind: "click", note: "B6 cursor clicks the Online card" },
  { t: 36.2, kind: "open", note: "B6 the card grows into the hosting card" },
  { t: 37.9, kind: "check", note: "B6 row 1 .dk-domæne turns green" },
  { t: 39.4, kind: "check", note: "B6 row 2 e-mail turns green" },
  { t: 41.2, kind: "check", note: "B6 row 3 siden online turns green" },
  { t: 43.0, kind: "logo", note: "B7 the sage sweep runs down the card; the price settles" },
];

/* ---------- the world ---------- */
const T1 = 20.5;                                   // h1 (s)
const ZS = -420;                                   // the stage plane (the kit's H1_SITE)
const ZH = -60 - 12 * (44.65 - T1);                // the hosting card's plane: the kit's H2_CARD under this camera
const cz = (t: number) => -30 - 12 * (t - T1);     // the one steady push (camH1's rate, kept to h2 = camH2)
const pz = (z: number, t: number) => PERSP / (PERSP - (z - cz(t)));          // on-screen scale of a plane at z
type Pose = { x: number; y: number; s: number };
// wp: a pose on the stage plane from how it should look on screen at time tRef (centre px, scale)
const wp = (tRef: number, sx: number, sy: number, S: number): Pose => { const p = pz(ZS, tRef); return { x: (sx - 960) / p, y: (sy - 540) / p, s: S / p }; };
const lp = (a: Pose, b: Pose, m: number): Pose => ({ x: mix(a.x, b.x, m), y: mix(a.y, b.y, m), s: mix(a.s, b.s, m) });
const sine = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));
const smoother = (x: number) => { const u = clamp01(x); return u * u * u * (u * (6 * u - 15) + 10); };
const lin = (t: number, a: number, d: number) => clamp01((t - a) / d);
const arrive = (p: number, dy = 26, from = 0.95): React.CSSProperties => ({ opacity: clamp01(p * 1.5), transform: `translateY(${((1 - p) * dy).toFixed(2)}px) scale(${mix(from, 1, p).toFixed(4)})` });

/* ---------- the site window ---------- */
const SW = 1460, SH = 906, HT = 46 + 1500;         // normal window; the tall window showing the whole page
const TQ = 0.3;                                    // the thumbnail is laid out at this scale (crisp when small)
const P0: Pose = { x: 0, y: 0, s: 1 };                                     // the h1 hand-off
const P1 = wp(22.8, 960, 162 + (SH / 2) * 0.5175, 0.5175);                 // whole page: 755 × 800 on screen
const CY = 580, CXL = 592, CXR = 1328, TW = 460, TY = 6.7;                           // the two cards (as seen at 32 s)
const P3 = wp(32, 960, CY + TY, TW / SW), P4L = wp(32, CXL, CY + TY, TW / SW), P4R = wp(32, CXR, CY + TY, TW / SW);
const C3 = wp(32, 960, CY, 1), C4L = wp(32, CXL, CY, 1), C4R = wp(32, CXR, CY, 1);

const NewHeadline: React.FC<{ q1: number; a1: number; a2: number }> = ({ q1, a1, a2 }) => (
  <div style={{ position: "relative" }}>
    <div style={{ opacity: 1 - q1, transform: `translateY(${(-30 * q1).toFixed(2)}px)` }}>Kom godt i<br />bevægelse igen.</div>
    <div style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>
      <div style={{ opacity: clamp01(a1 * 1.4), transform: `translateY(${((1 - a1) * 34).toFixed(2)}px)` }}>Velkommen hjem</div>
      <div style={{ opacity: clamp01(a2 * 1.4), transform: `translateY(${((1 - a2) * 34).toFixed(2)}px)` }}>i din krop.</div>
    </div>
  </div>
);
// The window at height h (906 … HT): two pieces of the tall window, the top clipped at h, the bottom cap riding the
// edge (transforms and clips only; no layout changes).
const SiteTall: React.FC<{ h: number }> = ({ h }) => (
  <div style={{ position: "relative", width: SW, height: SH }}>
    <div style={{ position: "absolute", left: 0, top: 0, clipPath: `inset(-400px -400px ${(HT - h + 38).toFixed(2)}px -400px)` }}>
      <Browser w={SW} h={HT}><HolmSite w={SW} h={1500} /></Browser>
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(h - HT).toFixed(2)}px)` }}>
      <div style={{ clipPath: `inset(${HT - 40}px -400px -400px -400px)` }}>
        <Browser w={SW} h={HT}><div style={{ transform: `translateY(${(HT - h).toFixed(2)}px)` }}><HolmSite w={SW} h={1500} /></div></Browser>
      </div>
    </div>
  </div>
);

// The edit: a sage outline on the headline and a small field growing out of it (site px, over the window).
const EDIT_TEXT = "Gør overskriften mere personlig";
const HL = { x: 46, y: 198, w: 624, h: 184 }, FIELD = { x: 46, y: 398, w: 624, h: 86 };
const SEND = { x: FIELD.x + FIELD.w - 43, y: FIELD.y + 43 };
const Edit: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const po = aspring(g, 24.5, 0.45), pf = aspring(g, 24.58, 0.5), pr = aspring(g, 26.75, 0.5);
  if (po <= 0 || pr > 0.999) return null;
  const n = Math.floor(clamp01((t - 24.9) / 0.97) * EDIT_TEXT.length), typing = t > 24.9 && t < 25.87;
  const sp = lin(t, 26.08, 0.25), pb = press(g, 26.0);
  return (
    <>
      <div style={{ position: "absolute", left: HL.x, top: HL.y, width: HL.w, height: HL.h, boxSizing: "border-box", borderRadius: 16, border: `3px solid ${C.sage}`, background: "rgba(135,168,158,0.10)",
        opacity: po * (1 - pr), transform: `scale(${mix(1.04, 1, po).toFixed(4)})` }} />
      <div style={{ position: "absolute", left: FIELD.x, top: FIELD.y, width: FIELD.w, height: FIELD.h, boxSizing: "border-box", borderRadius: 18, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`,
        display: "flex", alignItems: "center", padding: "0 15px 0 26px", fontFamily: SANS, fontSize: 30, color: C.ink, whiteSpace: "nowrap", transformOrigin: "12% 0%",
        opacity: clamp01(pf * 1.5) * (1 - pr), transform: `translateY(${((1 - pf) * -44 - pr * 30).toFixed(2)}px) scale(${(mix(0.6, 1, pf) * mix(1, 0.85, pr)).toFixed(4)})` }}>
        <span>{EDIT_TEXT.slice(0, n)}</span>
        <span style={{ display: "inline-block", width: 2.5, height: 34, marginLeft: 2, background: C.sageDark, opacity: sp > 0 ? 0 : typing || Math.floor(g / 15) % 2 === 0 ? 1 : 0 }} />
        <div style={{ flex: 1 }} />
        <div style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", background: C.ink, flex: "none", transform: `scale(${(1 - 0.08 * pb).toFixed(4)})` }}>
          <div style={{ position: "absolute", left: 14, top: 14, opacity: 1 - sp }}><Ico n="arrow" s={28} c="#FFFFFF" w={2.4} /></div>
          {sp > 0 && <div style={{ position: "absolute", left: 28, top: 28 }}><Spinner g={g} size={34} p={sp} color="#FFFFFF" /></div>}
        </div>
      </div>
    </>
  );
};

/* ---------- the two choice cards (700 × 520) ---------- */
const CW = 700, CH = 520;
const shell: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: CW, height: CH, borderRadius: 24, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}` };
const title: React.CSSProperties = { position: "absolute", left: 44, top: 30, fontFamily: SERIF, fontSize: 54, letterSpacing: "-0.025em", lineHeight: 1.2, color: C.ink, transformOrigin: "0% 100%" };
const CardL: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "relative", width: CW, height: CH, fontFamily: SANS, color: C.ink }}>
    <div style={shell} />
    <div style={{ ...title, ...arrive(aspring(g, 28.5, 0.65), 36) }}>Download</div>
    <div style={{ position: "absolute", right: 44, top: 36, width: 60, height: 60, borderRadius: 16, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", ...arrive(aspring(g, 28.72, 0.5, 0.88), 22, 0.8) }}>
      <Ico n="arrow" s={30} c="#FFFFFF" w={2.4} style={{ transform: "rotate(90deg)" }} /></div>
    <div style={{ position: "absolute", left: 44, top: 424, fontSize: 34, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap", transformOrigin: "0% 100%", ...arrive(aspring(g, 29.5, 0.65), 36) }}>Én gang for alle</div>
  </div>
);
const CardR: React.FC<{ g: number; box?: boolean }> = ({ g, box = true }) => {
  const pc = aspring(g, 34.56, 0.5, 0.86);
  return (
    <div style={{ position: "relative", width: CW, height: CH, fontFamily: SANS, color: C.ink }}>
      {box && <div style={shell} />}
      <div style={{ ...title, ...arrive(aspring(g, 30.7, 0.65), 36) }}>Online</div>
      <div style={{ position: "absolute", right: 44, top: 40, height: 52, padding: "0 22px 0 18px", borderRadius: 26, background: "#F1EEE8", display: "flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 500, color: C.ink, whiteSpace: "nowrap",
        transformOrigin: "100% 100%", ...arrive(aspring(g, 31.62, 0.5), 22, 0.9) }}><Ico n="lock" s={24} c={C.sageDeep} w={2.4} />holmfysio.dk</div>
      <div style={{ position: "absolute", left: 44, top: 404, height: 84, overflow: "hidden", display: "flex", alignItems: "baseline", whiteSpace: "nowrap", fontFamily: SERIF, letterSpacing: "-0.025em", paddingRight: 8 }}>
        <span style={{ display: "inline-block", fontSize: 66, lineHeight: "84px", ...arrive(aspring(g, 32.28, 0.55), 60, 1) }}>99 kr.</span>
        <span style={{ display: "inline-block", fontSize: 34, color: C.muted, marginLeft: 10, ...arrive(aspring(g, 33.46, 0.5), 30, 1) }}>/md.</span>
      </div>
      <div style={{ position: "absolute", right: 44, top: 430, height: 44, display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 500, whiteSpace: "nowrap" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp01(pc * 2), transform: `scale(${mix(0.5, 1, pc).toFixed(4)})` }}><Ico n="check" s={24} c={C.white} w={3} /></div>
        <span style={{ display: "inline-block", ...arrive(aspring(g, 34.5, 0.5), 20, 1) }}>Uden binding</span>
      </div>
    </div>
  );
};
const Thumb: React.FC = () => (
  <div style={{ width: SW * TQ, height: SH * TQ, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transform: `scale(${TQ})`, transformOrigin: "0 0" }}><SiteWindow headline={<NewHeadline q1={1} a1={1} a2={1} />} /></div>
  </div>
);

/* ---------- the scene ---------- */
export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h1") + HANDOFF_HALF) return <Handoff1 g={g} />;
  if (g >= f("h2") - HANDOFF_HALF) return <Handoff2 g={g} />;
  const t = g / 30, c = cam({ z: cz(t) }), p = pz(ZS, t), pH = pz(ZH, t);

  // the site: h1 pose → whole page (B1) → normal, closer (B2) → thumbnail (B3) → the left card's thumbnail (B4)
  const m1 = sine(lin(t, 20.84, 2.15)), m2 = sine(lin(t, 23.25, 1.4)), m3 = smoother(lin(t, 27.55, 1.4)), m4 = sine(lin(t, 28.5, 1.15));
  const P2 = wp(25.5, 960, 540, mix(0.87, 0.94, sine((t - 24.2) / 3.5)));          // normal size, then the scene's slow push on the hero
  const h = SH + (HT - SH) * m1 * (1 - m2);
  const lv = smoother(lin(t, 36.2, 1.2));                                         // the left card leaves downward
  const site = lp(lp(lp(lp(P0, P1, m1), P2, m2), P3, m3), P4L, m4);
  const hlOn = t > 26.15, q1 = sine(lin(t, 26.2, 0.26)), a1 = aspring(g, 26.32, 0.5), a2 = aspring(g, 26.42, 0.5);
  const small = t >= 28.97;

  // the cards
  const pc = sine(lin(t, 27.95, 0.8));
  const dL = aspring(g, 30.75, 0.9) - aspring(g, 34.3, 0.9), dR = sine(lin(t, 28.5, 1.0)) - aspring(g, 30.75, 0.9);   // 1 = dimmed, stepped back
  const dimL = 1 - 0.45 * dL, dimR = 1 - 0.45 * dR, fL = 1 - 0.06 * dL, fR = 1 - 0.06 * dR;
  const cL0 = lp(C3, C4L, m4), cR0 = lp(C3, C4R, m4), grow = mix(0.9, 1, pc);
  const pr = press(g, 36.05);
  const cL: Pose = { x: cL0.x, y: cL0.y + 400 * lv, s: cL0.s * grow * fL }, oL = pc * dimL * (1 - clamp01(lv * 1.7));
  const cR: Pose = { x: cR0.x, y: cR0.y, s: cR0.s * grow * fR * (1 - 0.015 * pr) };
  const tL: Pose = { x: site.x, y: site.y + 400 * lv, s: site.s * fL };

  // the hosting card: grows out of the right card (one box), then holds the kit's hand-off pose
  const TM = 36.15, m6 = smoother(lin(t, TM, 1.4)), morph = t >= TM;
  const push = mix(0.93, 1, sine((t - 36.9) / 6.7));                          // the scene's one slow push (ends 43.6)
  const hx = mix((cR.x * p) / pH, 0, m6), hy = mix(((cR.y) * p) / pH, 0, m6);
  const hsx = mix((CW * cR.s * p) / (CARD.w * pH), push, m6), hsy = mix((CH * cR.s * p) / (CARD.h * pH), push, m6);
  const ha = sine(lin(t, 36.5, 0.55));                                     // the hosting content fades in
  const rScr = 24 * mix(cR.s * p, pH * push, m6);
  const rows = (t - 37.0) / 0.22, act = [lin(t, 37.8, 0.45), lin(t, 39.2, 0.45), lin(t, 41.0, 0.45)];
  const wash = (a: number) => 0.6 * sine(lin(t, a - 0.1, 0.5)) * (1 - sine(lin(t, a + 0.5, 1.3)));
  const sweep = sine(lin(t, 42.9, 1.0));
  const oldO = 1 - sine(lin(t, TM, 0.42)), k6 = morph ? (hsx * CARD.w * pH) / (CW * cR.s * p) : 1;   // the old content rides the box and fades
  const rc: Pose = morph ? { x: (hx * pH) / p, y: (hy * pH) / p, s: cR.s * k6 } : cR;
  const tR1 = lp(P3, P4R, m4), tR0: Pose = { x: tR1.x, y: tR1.y, s: tR1.s * fR }, tR: Pose = morph ? { x: rc.x, y: rc.y + TY * tR0.s * k6, s: tR0.s * k6 } : tR0;

  // the chip on the window's top edge
  const pChip = aspring(g, 21.95, 0.6, 0.9), oChip = aspring(g, 24.15, 0.5), chipS = wp(22.8, 960, 540, 1).s;

  // the cursor (screen px), following its moving targets
  const sitePt = (x: number, y: number) => ({ x: 960 + (site.x + (x - SW / 2) * site.s) * p, y: 540 + (site.y + (y - SH / 2) * site.s) * p });
  const cardPt = (x: number, y: number) => ({ x: 960 + (cR.x + (x - CW / 2) * cR.s) * p, y: 540 + (cR.y + (y - CH / 2) * cR.s) * p });
  const mixPt = (a: { x: number; y: number }, b: { x: number; y: number }, m: number) => ({ x: mix(a.x, b.x, m), y: mix(a.y, b.y, m) });
  let cur: { x: number; y: number } | null = null, curPress = 0;
  if (t > 23.1 && t < 27.3) {
    const a = { x: 1120, y: 1140 }, b = sitePt(560, 338), s = sitePt(SEND.x + 4, SEND.y + 6), e = { x: 980, y: 1140 };
    cur = mixPt(mixPt(mixPt(a, b, sine(lin(t, 23.15, 1.25))), s, INOUT(lin(t, 25.42, 0.52))), e, sine(lin(t, 26.25, 1.0)));
    curPress = press(g, 24.48) + press(g, 26.0);
  } else if (t > 35.0 && t < 37.2) {
    const a = { x: 1480, y: 1140 }, b = cardPt(430, 300), e = { x: 1560, y: 1140 };
    cur = mixPt(mixPt(a, b, sine(lin(t, 35.0, 1.02))), e, sine(lin(t, 36.22, 1.0)));
    curPress = pr;
  }

  const settled = t > 43.95;
  return (
    <>
      <Stage3D cam={c}>
        {/* the line above the cards */}
        {t > 27.9 && t < 37.2 && (() => { const L = wp(32, 960, 196, 0.9), q = smoother(lin(t, 36.05, 1.0)); return (
          <Plane x={L.x} y={L.y - 90 * q * L.s} z={ZS} w={2} h={2} scale={L.s} opacity={1 - q}><div style={{ position: "absolute", left: 1, top: 1 }}>
            <Kinetic g={g} size={124} items={[{ t: "Du", at: 28.0 }, { t: "vælger", at: 28.12 }, { t: "selv.", at: 28.3, accent: true }]} />
          </div></Plane>); })()}

        {/* the right card (the copy) and its thumbnail */}
        {m4 > 0 && !morph && <Plane x={cR.x} y={cR.y} z={ZS} w={CW} h={CH} scale={cR.s} opacity={dimR}><CardR g={g} /></Plane>}
        {m4 > 0 && !morph && <Plane x={tR.x} y={tR.y} z={ZS + 1} w={SW * TQ} h={SH * TQ} scale={tR.s / TQ} opacity={dimR}><Thumb /></Plane>}

        {/* the left card and the site (the window, then its thumbnail) */}
        {pc > 0 && oL > 0.001 && <Plane x={cL.x} y={cL.y} z={ZS + 2} w={CW} h={CH} scale={cL.s} opacity={oL}><CardL g={g} /></Plane>}
        {!small && (
          <Plane x={site.x} y={site.y} z={ZS + 3} w={SW} h={SH} scale={site.s}>
            <div style={{ position: "relative", width: SW, height: SH }}>
              {h > SH + 0.02 ? <SiteTall h={h} /> : <SiteWindow headline={hlOn ? <NewHeadline q1={q1} a1={a1} a2={a2} /> : undefined} />}
              <Edit g={g} />
            </div>
          </Plane>
        )}
        {small && oL > 0.001 && <Plane x={tL.x} y={tL.y} z={ZS + 3} w={SW * TQ} h={SH * TQ} scale={tL.s / TQ} opacity={dimL * (1 - clamp01(lv * 1.7))}><Thumb /></Plane>}

        {/* B1: the chip on the window's top edge */}
        {pChip > 0 && oChip < 0.999 && (
          <Plane x={site.x} y={site.y - (SH / 2) * site.s + ((1 - pChip) * 34 - oChip * 30) * chipS} z={ZS + 4} w={2} h={2} scale={chipS * mix(0.94, 1, pChip)} opacity={clamp01(pChip * 1.6) * (1 - oChip)}>
            <div style={{ position: "absolute", left: 1, top: 1, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, height: 60, padding: "0 28px 0 24px", borderRadius: 30, background: C.white,
              boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, fontFamily: SANS, fontWeight: 500, fontSize: 30, color: C.ink, whiteSpace: "nowrap" }}>
              <div style={{ width: 13, height: 13, borderRadius: "50%", background: C.sage }} />Gratis forhåndsvisning</div>
          </Plane>
        )}

        {/* the old content of the right card rides the growing box and fades */}
        

        {/* B6–B7: the box grows into the hosting card */}
        {morph && !settled && (
          <Plane x={hx} y={hy} z={ZH} w={CARD.w} h={CARD.h} scale={hsy}>
            <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, transform: `scaleX(${(hsx / hsy).toFixed(5)})`, transformOrigin: "50% 50%" }}>
              {ha < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: `${(rScr / (hsx * pH)).toFixed(2)}px / ${(rScr / (hsy * pH)).toFixed(2)}px`, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, opacity: 1 - ha }} />}
              {ha < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: `${(rScr / (hsx * pH)).toFixed(2)}px / ${(rScr / (hsy * pH)).toFixed(2)}px`, background: C.white }} />}
              <div style={{ position: "absolute", inset: 0, opacity: ha }}><HostingCard g={g} rows={rows} active={act} price={(t - 42.55) / 0.6} /></div>
              <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden" }}>
                {[37.8, 39.2, 41.0].map((a, i) => { const r = CARD_R.rows[i]; return <div key={i} style={{ position: "absolute", left: 0, top: r.y, width: CARD.w, height: r.h, background: "rgba(135,168,158,0.30)", opacity: wash(a) }} />; })}
                {sweep > 0 && sweep < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: 300, transform: `translateY(${(-300 + sweep * (CARD.h + 300)).toFixed(2)}px)`,
                  background: "linear-gradient(180deg, rgba(135,168,158,0) 0%, rgba(135,168,158,0.20) 50%, rgba(135,168,158,0) 100%)" }} />}
              </div>
            </div>
          </Plane>
        )}
        {/* the old content of the right card rides the growing box (in front of it) and fades */}
        {morph && oldO > 0 && <Plane x={hx} y={hy} z={ZH + 1} w={CW} h={CH} scale={(rc.s * p) / pH} opacity={oldO}><CardR g={g} box={false} /></Plane>}
        {morph && oldO > 0 && <Plane x={hx} y={hy + (TY * tR.s * p) / pH} z={ZH + 2} w={SW * TQ} h={SH * TQ} scale={(tR.s * p) / pH / TQ} opacity={oldO}><Thumb /></Plane>}
        {settled && <Plane x={0} y={0} z={ZH} w={CARD.w} h={CARD.h}><HostingCard g={g} rows={3} active={[1, 1, 1]} price={1} /></Plane>}
      </Stage3D>
      {cur && <Cursor x={cur.x} y={cur.y} press={Math.min(1, curPress)} size={46} />}
    </>
  );
};
