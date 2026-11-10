// Scene B (13.6 → 37.92 s), revision 1: "Det bedste?" on clean cream → the finished site (one scroll pass, the address
// bar, the headline edit) → "Tilfreds?" → the purchase card (499 kr., three ticks, the site lifting out) → "Ikke
// tilfreds?" → the roll to 0 kr. → "Nul risiko." → through the card's "0" → the address pill grows into the hosting card.
// Pacing: every camera move is an INOUT blend of at least 1.0 s; consecutive moves overlap, so the camera never rests.
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { C, SANS, SERIF, SHADOW, SHADOW_BIG, OUT, INOUT, HOLM, clamp01, mix, appleShadow } from "../lib";
import { f, k, typed, press, Ico, HolmSite } from "../shared";
import { Stage3D, Plane, Cam, cam, project, dofBlur, PERSP } from "../cam";
import { Kinetic, TYPE, ACCENT, KItem } from "../type";
import { Spinner } from "../dots";
import { SiteWindow, SITE_WIN, NEW_HEADLINE, HostingCard, CARD, Cursor, Handoff1, Handoff2, camH1, camH2, H1_SITE, H2_CARD, HANDOFF_HALF } from "../ui";

export const BLUR: [number, number][] = [[15.2, 15.95], [21.75, 22.5], [32.5, 33.3]];

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
const onPlane = (c: { x: number; y: number; z: number; ry: number }, w: number, h: number, u: number, v: number): V3 => {
  const lx = u - w / 2, ly = v - h / 2;
  return { x: c.x + lx * Math.cos(rad(c.ry)), y: c.y + ly, z: c.z - lx * Math.sin(rad(c.ry)) };
};
const sitePt = (u: number, v: number) => onPlane(H1_SITE, SITE_WIN.w, SITE_WIN.h, u, v);   // window px (page y + 46)
const cardPt = (u: number, v: number) => onPlane(H2_CARD, CARD.w, CARD.h, u, v);
const focusOn = (c: Cam, P: V3): Cam => ({ ...c, focus: project(c, P).dist });
const SITE_C: V3 = { x: H1_SITE.x, y: H1_SITE.y, z: H1_SITE.z };
const CARD_C: V3 = { x: H2_CARD.x, y: H2_CARD.y, z: H2_CARD.z };
const sec = (g: number) => g / 30;
const io = (g: number, a: number, b: number) => INOUT(clamp01((g - a * 30) / ((b - a) * 30)));
const lin = (g: number, a: number, b: number) => clamp01((g - a * 30) / ((b - a) * 30));
const W = (l: string) => f(l) / 30;                                   // a word's time in seconds
const QUICK = Easing.bezier(0.4, 0, 0.2, 1);                          // an in-out that leaves a little sooner (the first move only)
// a slow sway under every pose: nothing ever rests
const sway = (g: number, c: Cam, amt = 1): Cam => ({ ...c, x: c.x + amt * 9 * Math.sin(g / 41), y: c.y + amt * 5 * Math.sin(g / 57 + 1), ry: c.ry + amt * 0.5 * Math.sin(g / 49 + 2) });

/* ---------- the world ---------- */
const TYPE_Z = 1400;                           // the purchase card's depth (2800 px in front of the site)
const PILL = sitePt(730, 23);                  // the address pill's centre
const ZERO_Y = -150;                           // the "0" counter's world y: the fly-through aims at the site's upper middle
const PC = { w: 1000, h: 640 };                // the purchase card
const DIGIT = 150, COL = 0.6 * DIGIT, LH = DIGIT * 1.25;
const PRICE = { x: 540, y: 56 };               // the price's top-left on the card
const ZERO_L = { x: PRICE.x + COL / 2, y: PRICE.y + LH / 2 + 2.5 };   // the final "0"'s counter centre (card px)
const ZERO_A = 25, ZERO_B = 41;                // the clip ellipse inside the 0's stroke (half axes, px)
const PCC: V3 = { x: -(ZERO_L.x - PC.w / 2), y: ZERO_Y - (ZERO_L.y - PC.h / 2), z: TYPE_Z };   // the card's centre: its 0 sits on the axis to the site
const pcPt = (u: number, v: number): V3 => ({ x: PCC.x + u - PC.w / 2, y: PCC.y + v - PC.h / 2, z: TYPE_Z });
const ZERO_W = pcPt(ZERO_L.x, ZERO_L.y);
const THUMB = { x: 56, y: 132, w: 420, h: 234 };

/* ---------- times (film seconds) ---------- */
const T = {
  reset0: 17.8, reset1: 18.2, click: 19.0, type0: 19.3, send: 20.3, swap: 20.7, swapIn: 20.9,
  cardIn: 22.9, lift0: 27.15, lift1: 28.0, drop0: 28.0, drop1: 28.95, roll0: 29.7, roll1: 30.5,
  push0: 32.05, push1: 33.6, morph0: 33.45, morph1: 34.65,
};
const EDIT_TEXT = "Gør overskriften mere personlig";

/* ---------- the camera: moves that blend in one after another and overlap, so it never rests ---------- */
type Move = { name: string; a: number; b: number; p: (g: number) => Cam; ease?: (t: number) => number; part?: "aim" | "z" };
const pSiteEdit = (g: number) => sway(g, focusOn(look(sitePt(380, 330), 1.5 + 0.09 * (sec(g) - 19.3), 3 - 1.2 * (sec(g) - 19.3), 0), SITE_C));
const pBar = (g: number) => sway(g, focusOn(look(sitePt(772, 23), 2.6 + 0.08 * (sec(g) - 17.9), 12, -1, { sy: 500 }), SITE_C), 0.5);
const pCardWhole = (g: number) => sway(g, look(pcPt(500, 320), 0.98 + 0.03 * (sec(g) - 22.75), -8, 0, { ap: 16 }));
const pPrice499 = (g: number) => sway(g, look(pcPt(735, 165), 2.0 + 0.05 * (sec(g) - 24.5), -3 + 1.5 * (sec(g) - 24.5), 0, { ap: 16 }), 0.6);
const pRows = (g: number) => sway(g, look(pcPt(742, 395 + 22 * (sec(g) - 26.1)), 1.95, 5, 2, { ap: 16 }), 0.6);
const pThumb = (g: number) => sway(g, look(pcPt(430, 310), 1.18 + 0.03 * (sec(g) - 27.9), 9, 0, { ap: 16 }));
const pSide = (dir: number) => (g: number) => sway(g, cam({ x: PCC.x + dir * 1300, y: PCC.y, z: TYPE_Z + 1900 - 40 * (sec(g) - 29), ry: 0, focus: PERSP, ap: 22 }));
const pRoll = (g: number) => sway(g, look(pcPt(700, 165), 2.25 + 0.06 * (sec(g) - 30.3), 3, 0, { ap: 16 }), 0.6);
const pAim = () => cam({ x: ZERO_W.x, y: ZERO_W.y, rx: 0, ry: 0 });
const pPill = (g: number) => sway(g, focusOn(look(PILL, 1.6 + 0.08 * (sec(g) - T.push1), 0, 0, { ap: 16 }), SITE_C), 0.5);
const pCard = (g: number) => { const u = lin(g, 34.2, 35.6); return sway(g, focusOn(look(CARD_C, mix(0.95, 1.14, u), mix(-1, 3, u), 0, { ap: 14 }), CARD_C), 0.6); };
const pFra = (g: number) => sway(g, focusOn(look(cardPt(64 + 172, 528 + 44), 2.8 + 0.2 * (sec(g) - 36.6), 5.5, 0, { ap: 14 }), CARD_C), 0.4);
export const MOVES: Move[] = [
  { name: "site aside for the line", a: 13.9, b: 15.0, ease: QUICK, p: (g) => sway(g, cam({ ...look(SITE_C, 0.34, -3, 0, { sx: 1500, sy: 600 }), focus: PERSP, ap: 20 })) },
  { name: "fly to the site", a: 14.85, b: 16.35, p: (g) => sway(g, focusOn(look(sitePt(730, 453), 1.04, 3, 0), SITE_C)) },
  { name: "glide down-left (scroll pass)", a: 15.9, b: 17.1, p: (g) => sway(g, focusOn(look(sitePt(600, 540), 1.3, 15, 2), SITE_C)) },
  { name: "rise to the address bar", a: 16.75, b: 17.95, p: pBar },
  { name: "back to the headline", a: 18.0, b: 19.3, p: pSiteEdit },
  { name: "fall away to the card's place", a: 21.35, b: 22.75, p: pCardWhole },
  { name: "push in on 499 kr.", a: 23.0, b: 24.5, p: pPrice499 },
  { name: "glide down the rows", a: 24.6, b: 26.1, p: pRows },
  { name: "back to the lifted site", a: 26.6, b: 27.9, p: pThumb },
  { name: "card away (Ikke tilfreds?)", a: 27.75, b: 28.95, p: pSide(-1) },
  { name: "in on the price (roll)", a: 29.2, b: 30.3, p: pRoll },
  { name: "card away (Nul risiko.)", a: 30.35, b: 31.5, p: pSide(1) },
  { name: "line up on the 0", a: T.push0, b: 32.78, p: pAim, part: "aim" },
  { name: "through the 0 to the site", a: T.push0, b: T.push1, p: pPill, part: "z" },
  { name: "rise to the address pill", a: 32.95, b: 33.95, p: pPill, part: "aim" },
  { name: "pill grows into the card", a: T.morph0, b: T.morph1, p: pCard },
  { name: "push in on Fra 83 kr.", a: 35.45, b: 36.65, p: pFra },
  { name: "back to the hand-off", a: 36.6, b: (f("h2") - HANDOFF_HALF) / 30, p: camH2 },
];
const makeCam = (g: number): Cam => {
  let c = camH1(g);
  for (const m of MOVES) {
    if (g <= m.a * 30) continue;
    const t = (m.ease ?? INOUT)(clamp01((g - m.a * 30) / ((m.b - m.a) * 30))), q = m.p(g);
    const all = !m.part, aim = all || m.part === "aim", z = all || m.part === "z";
    c = {
      x: aim ? mix(c.x, q.x, t) : c.x, y: aim ? mix(c.y, q.y, t) : c.y, rx: aim ? mix(c.rx, q.rx, t) : c.rx, ry: aim ? mix(c.ry, q.ry, t) : c.ry,
      rz: 0, z: z ? mix(c.z, q.z, t) : c.z, focus: z ? mix(c.focus, q.focus, t) : c.focus, ap: z ? mix(c.ap, q.ap, t) : c.ap,
    };
  }
  return c;
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
  const chip = k(g, 17.35, 0.7);
  const sel = k(g, T.click + 0.05, 0.4) * (1 - k(g, 21.2, 0.45, INOUT));
  const field = k(g, T.click + 0.1, 0.6) * (1 - k(g, 21.15, 0.45, INOUT));
  const fieldIn = k(g, T.click + 0.1, 0.6);
  const txt = typed(g, T.type0, EDIT_TEXT, 40);
  const busy = k(g, T.send + 0.08, 0.3, INOUT), spin = busy * (1 - k(g, 20.9, 0.35, INOUT));
  const blink = txt.length > 0 && txt.length < EDIT_TEXT.length ? 1 : (Math.floor((g / 30) * 2) % 2 === 0 ? 1 : 0);
  const outP = (i: number) => -INOUT(clamp01((g - f(T.swap) - i * 1.4) / 12));                       // old words rise out
  const inP = (i: number) => 1 - OUT(clamp01((g - f(T.swapIn) - i * 2.4) / 21));                   // new words rise in
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
          {g >= f(T.swapIn) && <div style={HEAD}><Line ws={["Velkommen", "hjem"]} p={inP} i0={0} /><Line ws={["i", "din", "krop."]} p={inP} i0={2} /></div>}
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

/* ---------- the purchase card (drawn here, in the hosting card's style) ---------- */
// The body: the name under the site thumbnail's slot, and three rows that tick on their phrases. The price and the
// thumbnail are separate planes on top (the price so the fly-through can show the site inside its "0").
const ROWS: [string, string][] = [["Én gang", "w:n"], ["Intet abonnement", "w:intet"], ["Siden er din", "w:siden2"]];
const PurchaseBody: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "relative", width: PC.w, height: PC.h, borderRadius: 24, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: THUMB.x, top: THUMB.y, width: THUMB.w, height: THUMB.h, borderRadius: 12, background: "#F1EEE8" }} />
    <div style={{ position: "absolute", left: 56, top: 392, fontSize: 27, fontWeight: 500, letterSpacing: "-0.01em" }}>Holm Fysioterapi</div>
    <div style={{ position: "absolute", left: 56, top: 430, fontSize: 18, color: C.muted }}>Din hjemmeside</div>
    {ROWS.map(([t, at], i) => {
      const q = k(g, at, 0.45);
      return (
        <div key={t} style={{ position: "absolute", left: 540, top: 280 + i * 92, width: 404, height: 92, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", boxSizing: "border-box" }}>
          <div style={{ fontSize: 27, fontWeight: 500, letterSpacing: "-0.01em", color: `color-mix(in srgb, ${C.ink} ${(q * 100).toFixed(1)}%, ${C.soft})` }}>{t}</div>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", width: 36, height: 36 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `inset 0 0 0 1.5px #D9D5CD`, opacity: 1 - q }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.sage, opacity: q, transform: `scale(${mix(0.6, 1, q)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={22} height={22} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 25 L20 33 L36 15" strokeDasharray={40} strokeDashoffset={40 * (1 - q)} /></svg>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);
// the price: "499" rises in on its word, "kr." on its own; three columns roll down to 0, then the leading zeros fold away
const PurchasePrice: React.FC<{ g: number }> = ({ g }) => {
  const inN = k(g, "w:499", 0.8), inK = k(g, "w:kroner", 0.7);
  const p = lin(g, T.roll0, T.roll1 + 0.15), fold = io(g, 30.4, 30.9);
  return (
    <div style={{ position: "absolute", left: PRICE.x, top: PRICE.y, height: LH, display: "flex", fontFamily: SERIF, fontSize: DIGIT, letterSpacing: "-0.02em", color: C.ink, fontVariantNumeric: "lining-nums tabular-nums" }}>
      <div style={{ height: LH, overflow: "hidden", display: "flex" }}>
        <div style={{ display: "flex", transform: `translateY(${((1 - inN) * LH).toFixed(2)}px)` }}>
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
      </div>
      <div style={{ height: LH, overflow: "hidden", marginLeft: 22, paddingRight: 12 }}>
        <div style={{ height: LH, lineHeight: `${LH}px`, fontSize: 84, fontStyle: "italic", color: ACCENT, paddingTop: 30, boxSizing: "border-box", transform: `translateY(${((1 - inK) * LH).toFixed(2)}px)` }}>kr.</div>
      </div>
    </div>
  );
};
// a type beat in screen space: the line rides with the camera (always centred), with a slow push of its own
const TypeBeat: React.FC<{ g: number; items: KItem[]; a: number; b: number }> = ({ g, items, a, b }) => (
  g < a * 30 || g > b * 30 ? null : (
    <div style={{ position: "absolute", left: 960, top: 540, transform: `scale(${(1 + 0.04 * lin(g, a, b)).toFixed(4)})` }}><Kinetic g={g} size={TYPE.hero} items={items} /></div>
  )
);

/* ---------- the scene ---------- */
export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h1") + HANDOFF_HALF) return <Handoff1 g={g} />;
  if (g >= f("h2") - HANDOFF_HALF) return <Handoff2 g={g} />;
  const c = makeCam(g);

  /* the site */
  const scroll = 560 * io(g, 15.6, 17.1);
  const reset = io(g, T.reset0, T.reset1);
  const edited = g >= 22.75 * 30;
  const zp = project(c, ZERO_W), passed = c.z + PERSP <= TYPE_Z + 20;
  const pushing = g > T.push0 * 30 && !passed;
  const siteO = !edited ? mix(1, 0.22, QUICK(lin(g, 13.9, 14.45)) * (1 - io(g, 14.9, 15.7))) * (1 - io(g, 21.85, 22.4))
    : g < T.push0 * 30 ? 0 : io(g, T.push0 + 0.1, T.push0 + 0.5) * (1 - io(g, 34.2, 34.8));
  const clip = pushing && zp.s < 48 ? `ellipse(${(ZERO_A * zp.s).toFixed(1)}px ${(ZERO_B * zp.s).toFixed(1)}px at ${zp.x.toFixed(1)}px ${zp.y.toFixed(1)}px)` : undefined;
  const toBar = io(g, 16.75, 17.95), back = io(g, 18.15, 19.0);
  const fb = mix(8 * io(g, 15.9, 17.1), 15, io(g, 17.2, 17.95)) * (1 - back);
  const ang = mix(90, 180, toBar), ma = mix(mix(45, 5, toBar), 120, back), mb = mix(mix(95, 8.5, toBar), 170, back);
  const mask = `linear-gradient(${ang.toFixed(2)}deg, #000 ${ma.toFixed(2)}%, transparent ${mb.toFixed(2)}%)`;

  /* the purchase card */
  const showPC = g > T.cardIn * 30 && !passed && zp.s < 48;
  const pcIn = io(g, T.cardIn, T.cardIn + 1.0);
  const dim = Math.max(io(g, 27.9, 28.6) * (1 - io(g, 29.25, 29.9)), io(g, 30.6, 31.15) * (1 - io(g, T.push0, T.push0 + 0.5)));
  const pcO = clamp01(pcIn * 2.5) * (1 - 0.6 * dim), pcY = PCC.y + (1 - pcIn) * 620;
  const pcBlur = dofBlur(c, project(c, PCC).dist) * dim;   // soft only behind the type beats; otherwise the card is the subject
  const lift = io(g, T.lift0, T.lift1) * (1 - io(g, T.drop0, T.drop1));
  const tc = pcPt(THUMB.x + THUMB.w / 2, THUMB.y + THUMB.h / 2);

  /* the pill → the hosting card */
  const m = io(g, T.morph0, T.morph1), morphing = g > T.morph0 * 30;
  const bw = mix(320, CARD.w, m), bh = mix(28, CARD.h, m);
  const box = { x: mix(PILL.x, H2_CARD.x, m), y: mix(PILL.y, H2_CARD.y, m), z: mix(PILL.z + 4, H2_CARD.z, m), ry: mix(H1_SITE.ry, H2_CARD.ry, m) };
  const rows = lin(g, W("w:stter"), W("w:stter") + 0.6) + lin(g, W("w:hele2"), W("w:hele2") + 0.6) + lin(g, W("w:op"), W("w:op") + 0.6);
  const price = lin(g, W("w:fra"), W("w:fra") + 0.7);
  const card = <HostingCard g={g} rows={rows} active={[0, 0, 0]} price={price} />;

  /* the cursor (screen space) */
  const showCur = g > 18.1 * 30 && g < 21.55 * 30;
  let cur = { x: 0, y: 0 };
  if (showCur) {
    const t1 = project(c, sitePt(330, 46 + 268)), t2 = project(c, sitePt(54 + 640 - 34, 46 + 346 + 36));
    const a = io(g, 18.15, 18.95), b = io(g, 19.5, 20.25), d = io(g, 20.7, 21.5);
    cur = { x: mix(mix(mix(1500, t1.x, a), t2.x, b), 1560, d), y: mix(mix(mix(1180, t1.y, a), t2.y, b), 1200, d) };
  }

  return (
    <AbsoluteFill>
      {showPC && (
        <Stage3D cam={c}>
          <Plane x={PCC.x} y={pcY} z={TYPE_Z} w={PC.w} h={PC.h} opacity={pcO} dof={false} blur={pcBlur}><PurchaseBody g={g} /></Plane>
        </Stage3D>
      )}
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
        {showPC && (
          <>
            <Plane x={PCC.x} y={pcY} z={TYPE_Z} w={PC.w} h={PC.h} opacity={pcO} dof={false} blur={pcBlur}><PurchasePrice g={g} /></Plane>
            {/* the site thumbnail: on "Siden er din" it lifts out of the card toward the camera and grows */}
            <Plane x={tc.x - 50 * lift} y={tc.y + (pcY - PCC.y) - 10 * lift} z={TYPE_Z + 2 + 300 * lift} w={THUMB.w} h={THUMB.h} scale={1 + 0.22 * lift} opacity={pcO} dof={false} blur={pcBlur * (1 - lift)}>
              <div style={{ width: THUMB.w, height: THUMB.h, borderRadius: 12, overflow: "hidden", boxShadow: `0 0 0 1px ${C.line}, ${appleShadow(0.25 + 0.75 * lift, 0.3 + 0.7 * lift)}` }}>
                <HolmSite w={THUMB.w} headline={NEW_HEADLINE} />
              </div>
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
      {/* the type beats */}
      <TypeBeat g={g} a={13.9} b={15.6} items={[{ t: "Det", at: "w:det", out: 14.95, dur: 0.7 }, { t: "bedste?", at: "w:bedste", accent: true, out: 14.95, dur: 0.7 }]} />
      <TypeBeat g={g} a={22.3} b={23.6} items={[{ t: "Tilfreds?", at: "w:tilfreds", accent: true, out: 22.95, dur: 0.6 }]} />
      <TypeBeat g={g} a={28.6} b={30.2} items={[{ t: "Ikke", at: "w:ikke", out: 29.45, dur: 0.7 }, { t: "tilfreds?", at: "w:tilfreds2", accent: true, out: 29.45, dur: 0.7 }]} />
      <TypeBeat g={g} a={31.0} b={32.7} items={[{ t: "Nul", at: "w:nul", accent: true, out: T.push0, dur: 0.7 }, { t: "risiko.", at: "w:risiko", out: T.push0, dur: 0.7 }]} />
      {showCur && <Cursor x={cur.x} y={cur.y} size={48} press={Math.max(press(g, T.click), press(g, T.send))} />}
    </AbsoluteFill>
  );
};
