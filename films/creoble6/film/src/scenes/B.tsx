// Scene B (h1 20.5 s → h2 44.65 s): the preview, the edit, the choice, hosting turning green (contract 2, B1–B7).
// Objects carry the motion. The camera is one steady push for the whole span (the kit's hand-off rate, 12 units/s);
// every "move" is an object morph on a long sine / quintic ease (large surfaces) or a spring (small things). One world
// plane (z = ZS) holds the site, the cards and the line; the hosting card sits on the kit's hand-off plane so the
// last frames equal Handoff2. Helper: B_card.tsx (the animated copy of the kit's hosting card).
import React from "react";
import { C, SANS, SERIF, SHADOW, SHADOW_BIG, clamp01, mix } from "../lib";
import { f, aspring, press, Ico, Browser, HolmSite } from "../shared";
import { Stage3D, Plane, cam, PERSP } from "../cam";
import { Kinetic } from "../type";
import { Spinner } from "../dots";
import { SiteWindow, HostingCard, CARD, CARD_ROWS, Cursor, Handoff1, Handoff2, HANDOFF_HALF } from "../ui";
import { HostCard, HRow } from "./B_card";

export const BLUR: [number, number][] = [];
export const EVENTS: { t: number; kind: "click" | "type" | "check" | "pop" | "open" | "send" | "logo"; len?: number; note: string }[] = [
  { t: 20.85, kind: "open", len: 1.85, note: "B1 the window grows to the whole page (soft, long)" },
  { t: 22.2, kind: "pop", note: "B1 chip 'Gratis forhåndsvisning' lands on the window's top edge" },
  { t: 23.0, kind: "open", len: 1.6, note: "B2 the window comes back and close on the hero (soft, long)" },
  { t: 24.2, kind: "click", note: "B2 cursor clicks the headline" },
  { t: 24.35, kind: "pop", note: "B2 the edit field grows out of the headline" },
  { t: 24.55, kind: "type", len: 0.9, note: "B2 typing 'Gør overskriften mere personlig'" },
  { t: 25.55, kind: "click", note: "B2 cursor presses send" },
  { t: 25.6, kind: "send", note: "B2 the edit is sent" },
  { t: 25.9, kind: "pop", note: "B2 the headline swaps to the new one (soft)" },
  { t: 27.2, kind: "open", len: 1.4, note: "B3 the site shrinks into the thumbnail card (soft, long)" },
  { t: 28.5, kind: "pop", len: 1.1, note: "B4 the card splits in two (the copy slides right)" },
  { t: 29.15, kind: "click", note: "B4 the download button presses; the thumbnail packs into the file row" },
  { t: 29.85, kind: "logo", len: 0.75, note: "B4 the download bar fills (soft rising tone)" },
  { t: 30.62, kind: "check", note: "B4 download done" },
  { t: 30.8, kind: "pop", note: "B4 the Online card steps forward" },
  { t: 31.3, kind: "type", len: 0.75, note: "B4 the address types holmfysio.dk" },
  { t: 32.15, kind: "pop", note: "B4 'Live' comes on (small)" },
  { t: 32.4, kind: "pop", note: "B4 the price 99 rolls up" },
  { t: 34.62, kind: "check", note: "B5 'Uden binding' ticks in" },
  { t: 36.05, kind: "click", note: "B6 cursor clicks the Online card" },
  { t: 36.2, kind: "open", len: 1.4, note: "B6 the card grows into the hosting card" },
  { t: 37.3, kind: "type", len: 0.5, note: "B6 row 1 types holmfysio.dk" },
  { t: 37.95, kind: "check", note: "B6 row 1 .dk-domæne turns green" },
  { t: 38.65, kind: "type", len: 0.8, note: "B6 row 2 types kontakt@holmfysio.dk" },
  { t: 39.6, kind: "check", note: "B6 row 2 e-mail turns green" },
  { t: 40.3, kind: "type", len: 0.85, note: "B6 row 3 types Europæiske servere" },
  { t: 41.7, kind: "check", note: "B6 row 3 siden online turns green" },
  { t: 42.75, kind: "logo", len: 0.9, note: "B7 the three checks pulse in turn (three soft notes, 0.2 s apart); the price row rises" },
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
const TQ = 0.36;                                   // the thumbnail is laid out at this scale (crisp when small)
const P0: Pose = { x: 0, y: 0, s: 1 };                                     // the h1 hand-off
const P1 = wp(22.5, 960, 140 + (SH / 2) * 0.535, 0.535);                   // whole page: 781 × 827 on screen
const CW = 780, CH = 590, CY = 671, CXL = 546, CXR = 1374;                 // the two cards (as seen at 34 s): 1608 wide together
const TW = 520, TY = -3;                                                   // the thumbnail in a card (width, centre offset)
const P3 = wp(34, 960, CY + TY, TW / SW), P4L = wp(34, CXL, CY + TY, TW / SW);
const C3 = wp(34, 960, CY, 1), C4L = wp(34, CXL, CY, 1), C4R = wp(34, CXR, CY, 1);

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
// The site laid out at scale q inside its plane (q > 1 for the close-up, < 1 for small views), so it stays crisp.
const SiteQ: React.FC<{ q: number; children?: React.ReactNode }> = ({ q, children }) => (
  <div style={{ width: SW * q, height: SH * q, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transform: q === 1 ? undefined : `scale(${q})`, transformOrigin: "0 0" }}>{children}</div>
  </div>
);
const DONE_HEADLINE = <NewHeadline q1={1} a1={1} a2={1} />;

// The edit: a sage outline on the headline and a small field growing out of it (site px, over the window).
const EDIT_TEXT = "Gør overskriften mere personlig";
const HL = { x: 46, y: 198, w: 624, h: 184 }, FIELD = { x: 46, y: 398, w: 624, h: 86 };
const SEND = { x: FIELD.x + FIELD.w - 43, y: FIELD.y + 43 };
const Edit: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const po = aspring(g, 24.22, 0.45), pf = aspring(g, 24.3, 0.6), pr = aspring(g, 26.3, 0.55);
  if (po <= 0 || pr > 0.999) return null;
  const n = Math.floor(clamp01((t - 24.55) / 0.9) * EDIT_TEXT.length), typing = t > 24.55 && t < 25.45;
  const sp = lin(t, 25.62, 0.25), pb = press(g, 25.55);
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

/* ---------- the two choice cards (780 × 590) ---------- */
const shell: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: CW, height: CH, borderRadius: 24, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}` };
const title: React.CSSProperties = { position: "absolute", left: 48, top: 30, fontFamily: SERIF, fontSize: 60, letterSpacing: "-0.025em", lineHeight: 1.2, color: C.ink, transformOrigin: "0% 100%" };
const MINI = { x: 138, y: 295, w: 150 };           // where the thumbnail packs down to (card px, centre; width)
const CardL: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, fill = sine(lin(t, 29.85, 0.75)), done = aspring(g, 30.6, 0.5, 0.86);
  return (
    <div style={{ position: "relative", width: CW, height: CH, fontFamily: SANS, color: C.ink }}>
      <div style={shell} />
      <div style={{ ...title, ...arrive(aspring(g, 28.5, 0.65), 36) }}>Download</div>
      <div style={{ position: "absolute", right: 48, top: 38, width: 64, height: 64, ...arrive(aspring(g, 28.72, 0.55, 0.88), 24, 0.8) }}>
        <div style={{ width: 64, height: 64, borderRadius: 17, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${(1 - 0.08 * press(g, 29.15)).toFixed(4)})` }}>
          <Ico n="arrow" s={32} c="#FFFFFF" w={2.4} style={{ transform: "rotate(90deg)" }} /></div></div>
      {/* the file row the thumbnail packs into */}
      <div style={{ position: "absolute", left: 238, top: 250, fontSize: 38, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap", transformOrigin: "0% 100%", ...arrive(aspring(g, 29.55, 0.6), 30) }}>holmfysio.zip</div>
      <div style={{ position: "absolute", left: 238, top: 322, width: 440, height: 12, borderRadius: 6, background: "#ECE8E1", overflow: "hidden", ...arrive(aspring(g, 29.65, 0.6), 30, 1) }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 6, background: C.sage, transformOrigin: "0% 50%", transform: `scaleX(${fill.toFixed(4)})` }} /></div>
      <div style={{ position: "absolute", left: 692, top: 252, width: 44, height: 44, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp01(done * 2), transform: `scale(${mix(0.5, 1, done).toFixed(4)})` }}><Ico n="check" s={30} c={C.white} w={3} /></div>
      <div style={{ position: "absolute", left: 48, top: 482, fontSize: 40, fontWeight: 500, letterSpacing: "-0.015em", whiteSpace: "nowrap", transformOrigin: "0% 100%", ...arrive(aspring(g, 29.62, 0.65), 36) }}>Én gang for alle</div>
    </div>
  );
};
const ADDR = "holmfysio.dk";
const CardR: React.FC<{ g: number; box?: boolean }> = ({ g, box = true }) => {
  const t = g / 30, pc = aspring(g, 34.56, 0.5, 0.86), n = Math.floor(lin(t, 31.3, 0.75) * ADDR.length), live = aspring(g, 32.15, 0.5, 0.88);
  return (
    <div style={{ position: "relative", width: CW, height: CH, fontFamily: SANS, color: C.ink }}>
      {box && <div style={shell} />}
      <div style={{ ...title, ...arrive(aspring(g, 30.7, 0.65), 36) }}>Online</div>
      <div style={{ position: "absolute", right: 48, top: 42, width: 344, height: 58, boxSizing: "border-box", padding: "0 20px 0 18px", borderRadius: 29, background: "#F1EEE8", display: "flex", alignItems: "center", gap: 10, fontSize: 29, fontWeight: 500, color: C.ink, whiteSpace: "nowrap",
        transformOrigin: "100% 100%", ...arrive(aspring(g, 31.08, 0.55), 24, 0.9) }}>
        <Ico n="lock" s={25} c={C.sageDeep} w={2.4} /><span>{ADDR.slice(0, n)}</span>
        {n < ADDR.length && <span style={{ display: "inline-block", width: 2.5, height: 30, marginLeft: -6, background: C.sageDark }} />}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 22, color: C.sageDeep, opacity: clamp01(live * 1.6), transform: `scale(${mix(0.7, 1, live).toFixed(4)})` }}><div style={{ width: 11, height: 11, borderRadius: "50%", background: C.sage }} />Live</div>
      </div>
      <div style={{ position: "absolute", left: 48, top: 462, height: 96, overflow: "hidden", display: "flex", alignItems: "baseline", whiteSpace: "nowrap", fontFamily: SERIF, letterSpacing: "-0.025em", paddingRight: 8, fontSize: 78, lineHeight: "96px" }}>
        {[0, 1].map((i) => { const r = aspring(g, 32.25 + i * 0.13, 0.75); return (
          <span key={i} style={{ display: "inline-block", position: "relative", height: 96, opacity: clamp01(r * 3) }}>
            <span style={{ visibility: "hidden" }}>9</span>
            <span style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${((1 - r) * 96 * 3).toFixed(2)}px)` }}>
              {["9", "8", "7", "6"].map((d, j) => <span key={j} style={{ position: "absolute", left: 0, top: -96 * j }}>{d}</span>)}
            </span>
          </span>); })}
        <span style={{ display: "inline-block", marginLeft: 16, ...arrive(aspring(g, 32.5, 0.6), 60, 1) }}>kr.</span>
        <span style={{ display: "inline-block", fontSize: 38, color: C.muted, marginLeft: 12, ...arrive(aspring(g, 33.46, 0.55), 36, 1) }}>/md.</span>
      </div>
      <div style={{ position: "absolute", right: 48, top: 492, height: 48, display: "flex", alignItems: "center", gap: 13, fontSize: 34, fontWeight: 500, whiteSpace: "nowrap" }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp01(pc * 2), transform: `scale(${mix(0.5, 1, pc).toFixed(4)})` }}><Ico n="check" s={28} c={C.white} w={3} /></div>
        <span style={{ display: "inline-block", ...arrive(aspring(g, 34.5, 0.55), 24, 1) }}>Uden binding</span>
      </div>
    </div>
  );
};
const Thumb: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => <SiteQ q={TQ}><SiteWindow headline={DONE_HEADLINE} scroll={scroll} /></SiteQ>;

/* ---------- the scene ---------- */
const HK = 1.3;                                    // the hosting card is laid out at this scale (it shows at 1.25×)
export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h1") + HANDOFF_HALF) return <Handoff1 g={g} />;
  if (g >= f("h2") - HANDOFF_HALF) return <Handoff2 g={g} />;
  const t = g / 30, c = cam({ z: cz(t) }), p = pz(ZS, t), pH = pz(ZH, t);

  // the site: h1 pose → whole page (B1) → close on the hero, a slow push (B2) → the thumbnail in the card (B3)
  const m1 = sine(lin(t, 20.84, 1.86)), m2 = sine(lin(t, 23.0, 1.6)), m3 = smoother(lin(t, 27.2, 1.4)), m4 = sine(lin(t, 28.5, 1.15));
  const S2 = mix(1.3, 1.42, sine((t - 24.4) / 2.85)), P2 = wp(25.5, 575 + (SW / 2 - 358) * S2, 503 + (SH / 2 - 341) * S2, S2);   // the headline + field held at (575, 503)
  const h = SH + (HT - SH) * m1 * (1 - m2);
  const site = lp(lp(lp(lp(P0, P1, m1), P2, m2), P3, m3), P4L, m4);
  const hlOn = t > 25.7, q1 = sine(lin(t, 25.75, 0.26)), a1 = aspring(g, 25.87, 0.5), a2 = aspring(g, 25.97, 0.5);
  const small = t >= 28.6, sq = t < 23.0 ? 1 : site.s * p > 0.9 ? 1.6 : 0.72;

  // the cards: the one stepping back dims, shrinks and sinks a little
  const pc = sine(lin(t, 27.75, 0.75)), grow = mix(0.9, 1, pc);
  const dL = aspring(g, 30.75, 0.9) - aspring(g, 34.3, 0.9), dR = sine(lin(t, 28.5, 1.0)) - aspring(g, 30.75, 0.9);   // 1 = stepped back
  const lv = smoother(lin(t, 36.2, 1.2));                                    // the left card leaves downward
  const cL0 = lp(C3, C4L, m4), cR0 = lp(C3, C4R, m4), pr = press(g, 36.05);
  const cL: Pose = { x: cL0.x, y: cL0.y + (14 * dL + 420 * lv) * cL0.s, s: cL0.s * grow * (1 - 0.07 * dL) }, oL = pc * (1 - 0.42 * dL) * (1 - clamp01(lv * 1.7));
  const cR: Pose = { x: cR0.x, y: cR0.y + 14 * dR * cR0.s, s: cR0.s * grow * (1 - 0.07 * dR) * (1 - 0.015 * pr) }, oR = 1 - 0.42 * dR;
  const inCard = (cd: Pose, lx: number, ly: number, w: number): Pose => ({ x: cd.x + lx * cd.s, y: cd.y + ly * cd.s, s: (w / SW) * cd.s });
  const pk = sine(lin(t, 29.2, 1.0));                                        // the thumbnail packs down into the file row
  const tL = inCard(cL, mix(0, MINI.x - CW / 2, pk), mix(TY, MINI.y - CH / 2, pk), mix(TW, MINI.w, pk));
  const scroll = 420 * sine(lin(t, 31.9, 2.4));

  // the hosting card: grows out of the right card (one box) to 1.25×, a slow push, then back to the hand-off pose
  const TM = 36.15, m6 = smoother(lin(t, TM, 1.4)), morph = t >= TM;
  const Sscr = mix(mix(1.22, 1.27, sine((t - 37.5) / 5)), pH, sine(lin(t, 42.5, 1.6))), tgt = Sscr / pH;
  const hx = mix((cR.x * p) / pH, 0, m6), hy = mix((cR.y * p) / pH, 0, m6);
  const hsx = mix((CW * cR.s * p) / (CARD.w * pH), tgt, m6), hsy = mix((CH * cR.s * p) / (CARD.h * pH), tgt, m6);
  const ha = sine(lin(t, 36.55, 0.55));                                      // the hosting content fades in
  const rScr = 24 * mix(cR.s * p, Sscr, m6), rad = `${(rScr / (hsx * pH)).toFixed(2)}px / ${(rScr / (hsy * pH)).toFixed(2)}px`;
  const tintO = 1 - sine(lin(t, 42.5, 0.9));
  const row = (i: number, tin: number, ttype: number, len: number, tact: number): HRow => {
    const n = CARD_ROWS[i][1].length, ty = lin(t, ttype, len);
    return { in: sine(lin(t, tin, 0.55)), chars: Math.floor(ty * n), caret: t > ttype - 0.2 && ty < 1, a: sine(lin(t, tact, 0.45)), draw: sine(lin(t, tact + 0.15, 0.45)),
      tint: sine(lin(t, tact, 0.9)), tintO, pulse: Math.sin(Math.PI * lin(t, 42.75 + i * 0.2, 0.6)) };
  };
  const hrows = [row(0, 37.05, 37.3, 0.5, 37.85), row(1, 38.35, 38.65, 0.8, 39.5), row(2, 39.95, 40.3, 0.85, 41.6)];
  const price = sine(lin(t, 42.6, 0.75)), spin = lin(t, 36.9, 0.5) * (1 - lin(t, 42.2, 0.5));
  const oldO = 1 - sine(lin(t, TM, 0.45)), k6 = morph ? (hsx * CARD.w * pH) / (CW * cR.s * p) : 1;   // the old content rides the box and fades
  const rc: Pose = morph ? { x: (hx * pH) / p, y: (hy * pH) / p, s: cR.s * k6 } : cR;
  const tR = inCard(rc, 0, TY, TW);

  // the chip on the window's top edge
  const pChip = aspring(g, 21.9, 0.6, 0.9), oChip = aspring(g, 23.75, 0.5), chipS = wp(22.5, 960, 540, 1).s;

  // the cursor (screen px), following its moving targets
  const sitePt = (x: number, y: number) => ({ x: 960 + (site.x + (x - SW / 2) * site.s) * p, y: 540 + (site.y + (y - SH / 2) * site.s) * p });
  const cardPt = (x: number, y: number) => ({ x: 960 + (cR.x + (x - CW / 2) * cR.s) * p, y: 540 + (cR.y + (y - CH / 2) * cR.s) * p });
  const mixPt = (a: { x: number; y: number }, b: { x: number; y: number }, m: number) => ({ x: mix(a.x, b.x, m), y: mix(a.y, b.y, m) });
  let cur: { x: number; y: number } | null = null, curPress = 0, curSize = 46;
  if (t > 22.85 && t < 26.9) {
    const a = { x: 1150, y: 1170 }, b = sitePt(560, 338), s = sitePt(SEND.x + 4, SEND.y + 6), e = { x: 820, y: 1180 };
    cur = mixPt(mixPt(mixPt(a, b, sine(lin(t, 22.9, 1.25))), s, sine(lin(t, 25.0, 0.5))), e, sine(lin(t, 25.8, 1.0)));
    curPress = press(g, 24.2) + press(g, 25.55); curSize = 60;
  } else if (t > 34.9 && t < 37.3) {
    const a = { x: 1480, y: 1150 }, b = cardPt(480, 330), e = { x: 1600, y: 1160 };
    cur = mixPt(mixPt(a, b, sine(lin(t, 35.0, 1.02))), e, sine(lin(t, 36.22, 1.0)));
    curPress = pr;
  }

  const settled = t > 44.15;
  return (
    <>
      <Stage3D cam={c}>
        {/* the line above the cards (uncovered as the window shrinks away) */}
        {t > 27.7 && t < 37.2 && (() => { const L = wp(34, 960, 215, 0.9), q = smoother(lin(t, 36.05, 1.0)); return (
          <Plane x={L.x} y={L.y - 90 * q * L.s} z={ZS} w={2} h={2} scale={L.s} opacity={1 - q}><div style={{ position: "absolute", left: 1, top: 1 }}>
            <Kinetic g={g} size={124} items={[{ t: "Du", at: 27.83 }, { t: "vælger", at: 27.9 }, { t: "selv.", at: 28.2, accent: true }]} />
          </div></Plane>); })()}

        {/* the right card (the copy) and its thumbnail */}
        {m4 > 0 && !morph && <Plane x={cR.x} y={cR.y} z={ZS} w={CW} h={CH} scale={cR.s} opacity={oR}><CardR g={g} /></Plane>}
        {m4 > 0 && !morph && <Plane x={tR.x} y={tR.y} z={ZS + 1} w={SW * TQ} h={SH * TQ} scale={tR.s / TQ} opacity={oR}><Thumb scroll={scroll} /></Plane>}

        {/* the left card and the site (the window, then its thumbnail) */}
        {pc > 0 && oL > 0.001 && <Plane x={cL.x} y={cL.y} z={ZS + 2} w={CW} h={CH} scale={cL.s} opacity={oL}><CardL g={g} /></Plane>}
        {!small && (
          <Plane x={site.x} y={site.y} z={ZS + 3} w={SW * sq} h={SH * sq} scale={site.s / sq}>
            <SiteQ q={sq}>
              {h > SH + 0.02 ? <SiteTall h={h} /> : <SiteWindow headline={hlOn ? <NewHeadline q1={q1} a1={a1} a2={a2} /> : undefined} />}
              <Edit g={g} />
            </SiteQ>
          </Plane>
        )}
        {small && oL > 0.001 && <Plane x={tL.x} y={tL.y} z={ZS + 3} w={SW * TQ} h={SH * TQ} scale={tL.s / TQ} opacity={oL}><Thumb /></Plane>}

        {/* B1: the chip on the window's top edge */}
        {pChip > 0 && oChip < 0.999 && (
          <Plane x={site.x} y={site.y - (SH / 2) * site.s + ((1 - pChip) * 34 - oChip * 30) * chipS} z={ZS + 4} w={2} h={2} scale={chipS * mix(0.94, 1, pChip)} opacity={clamp01(pChip * 1.6) * (1 - oChip)}>
            <div style={{ position: "absolute", left: 1, top: 1, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, height: 62, padding: "0 30px 0 26px", borderRadius: 31, background: C.white,
              boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, fontFamily: SANS, fontWeight: 500, fontSize: 32, color: C.ink, whiteSpace: "nowrap" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.sage }} />Gratis forhåndsvisning</div>
          </Plane>
        )}

        {/* B6–B7: the box grows into the hosting card */}
        {morph && !settled && (
          <Plane x={hx} y={hy} z={ZH} w={CARD.w * HK} h={CARD.h * HK} scale={hsy / HK}>
            <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w * HK, height: CARD.h * HK, transform: `scaleX(${(hsx / hsy).toFixed(5)})`, transformOrigin: "50% 50%" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, transform: `scale(${HK})`, transformOrigin: "0 0" }}>
                {ha < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: rad, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, opacity: 1 - ha }} />}
                {ha < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: rad, background: C.white }} />}
                <div style={{ position: "absolute", inset: 0, opacity: ha }}><HostCard g={g} rows={hrows} price={price} spin={spin} /></div>
              </div>
            </div>
          </Plane>
        )}
        {/* the old content of the right card rides the growing box (in front of it) and fades */}
        {morph && oldO > 0 && <Plane x={hx} y={hy} z={ZH + 1} w={CW} h={CH} scale={(rc.s * p) / pH} opacity={oldO}><CardR g={g} box={false} /></Plane>}
        {morph && oldO > 0 && <Plane x={hx} y={hy + (TY * rc.s * p) / pH} z={ZH + 2} w={SW * TQ} h={SH * TQ} scale={(tR.s * p) / pH / TQ} opacity={oldO}><Thumb scroll={scroll} /></Plane>}
        {settled && <Plane x={0} y={0} z={ZH} w={CARD.w} h={CARD.h}><HostingCard g={g} rows={3} active={[1, 1, 1]} price={1} /></Plane>}
      </Stage3D>
      {cur && <Cursor x={cur.x} y={cur.y} press={Math.min(1, curPress)} size={curSize} />}
    </>
  );
};
