// Scene B (13.6 → 37.92 s), revision 1: "Det bedste?" on clean cream → the finished site (one scroll pass, the address
// bar, the headline edit) → "Tilfreds?" → the purchase card (499 kr., three ticks, the site lifting out) → "Ikke
// tilfreds?" → the roll to 0 kr. → "Nul risiko." → through the card's "0" → the address pill grows into the hosting card.
// Pacing: every camera move is an INOUT blend of at least 1.0 s; consecutive moves overlap, so the camera never rests.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, SANS, SERIF, SHADOW, SHADOW_BIG, INOUT, HOLM, clamp01, mix, appleShadow } from "../lib";
import { f, k, typed, press, Ico, HolmSite } from "../shared";
import { Stage3D, Plane, Cam, cam, project, PERSP } from "../cam";
import { Kinetic, TYPE, ACCENT, KItem } from "../type";
import { Spinner } from "../dots";
import { SiteWindow, SITE_WIN, NEW_HEADLINE, HostingCard, CARD, Cursor, Handoff1, Handoff2, camH1, camH2, H1_SITE, H2_CARD, HANDOFF_HALF } from "../ui";

export const BLUR: [number, number][] = [];

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
const SIN = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(t));          // the sine in-out: the gentlest start and landing
const io = (g: number, a: number, b: number) => SIN((g - a * 30) / ((b - a) * 30));
const lin = (g: number, a: number, b: number) => clamp01((g - a * 30) / ((b - a) * 30));
const W = (l: string) => f(l) / 30;                                   // a word's time in seconds
// a slow sway under every pose: nothing ever rests
const sway = (g: number, c: Cam, amt = 1): Cam => ({ ...c, x: c.x + amt * 9 * Math.sin(g / 41), y: c.y + amt * 5 * Math.sin(g / 57 + 1), ry: c.ry + amt * 0.5 * Math.sin(g / 49 + 2) });

/* ---------- the world ---------- */
const TYPE_Z = -600;                           // the purchase card's depth: 800 px in front of the site (a short glide through)
const PILL = sitePt(730, 23);                  // the address pill's centre
const AXIS = sitePt(730, 163);                 // the fly-through aims here: the address bar sits in the upper third on arrival
const PC = { w: 1000, h: 640 };                // the purchase card
const DIGIT = 150, COL = 0.6 * DIGIT, LH = DIGIT * 1.25;
const PRICE = { x: 540, y: 56 };               // the price's top-left on the card
const ZERO_L = { x: PRICE.x + COL / 2, y: PRICE.y + LH / 2 + 2.5 };   // the final "0"'s counter centre (card px)
const ZERO_A = 25, ZERO_B = 41;                // the clip ellipse inside the 0's stroke (half axes, px)
const PCC: V3 = { x: AXIS.x - (ZERO_L.x - PC.w / 2), y: AXIS.y - (ZERO_L.y - PC.h / 2), z: TYPE_Z };   // the card's centre: its 0 sits on the axis to the site
const pcPt = (u: number, v: number): V3 => ({ x: PCC.x + u - PC.w / 2, y: PCC.y + v - PC.h / 2, z: TYPE_Z });
const ZERO_W = pcPt(ZERO_L.x, ZERO_L.y);
const THUMB = { x: 56, y: 132, w: 420, h: 234 };

/* ---------- times (film seconds) ---------- */
const T = {
  click: 18.72, type0: 19.25, send: 20.1, swap: 20.5, swapIn: 20.7,
  cardIn: 22.65, lift0: 27.15, lift1: 28.3, drop0: 28.5, drop1: 29.7, roll0: 29.8, roll1: 30.85,
  push0: 32.1, morph0: 33.5, morph1: 35.3,
};
const EDIT_TEXT = "Gør overskriften mere personlig";
// through the zero: the card's scale grows exponentially (a steady relative growth, so the glide looks even)
const P0 = 31.4, P1 = 34.1;
const zoomS = (g: number) => 2.0 * Math.exp(Math.log(15) * io(g, P0, P1));   // 2 → 30, its rate rising and falling on a sine

/* ---------- the camera: ONE path. Long sine blends, each starting while the previous is still under way ---------- */
type Move = { name: string; a: number; b: number; p: (g: number) => Cam };
const pEdit0 = (g: number) => sway(g, focusOn(look(sitePt(395, 320), 1.4, 6, 0), SITE_C));
const pEdit1 = (g: number) => sway(g, focusOn(look(sitePt(375, 330), 2.0, -5, 0), SITE_C));
const pBar = (g: number) => sway(g, focusOn(look(sitePt(790, 60), 2.1, 10, -1), SITE_C), 0.5);
const pCardWhole = (g: number) => sway(g, look(pcPt(500, 320), 0.95, -7, 0, { ap: 16 }));
const pPrice499 = (g: number) => sway(g, look(pcPt(720, 175), 1.7, -2, 0, { ap: 16 }), 0.6);
const pRows = (g: number) => sway(g, look(pcPt(742, 330), 1.5, 6, 2, { ap: 16 }), 0.6);
const pThumb = (g: number) => sway(g, look(pcPt(470, 320), 1.1, 9, 0, { ap: 16 }));
const pRoll = (g: number) => sway(g, look(pcPt(690, 175), 2.0, 2, 0, { ap: 16 }), 0.6);
const pZoom = (g: number) => focusOn(look(ZERO_W, zoomS(g), 0, 0, { ap: 0 }), SITE_C);

const pCard = (g: number) => sway(g, focusOn(look(cardPt(500, 205), 1.52, -6, 0, { ap: 0 }), CARD_C), 0.6);
const pFra = (g: number) => sway(g, focusOn(look(cardPt(500, 445), 1.5, 4, 0, { ap: 0 }), CARD_C), 0.4);
export const MOVES: Move[] = [
  { name: "site aside for the line", a: 13.9, b: 15.1, p: (g) => sway(g, cam({ ...look(SITE_C, 0.4, 3, 0, { sx: 350, sy: 745 }), focus: PERSP, ap: 20 })) },
  { name: "glide to the address bar", a: 14.7, b: 17.3, p: pBar },
  { name: "down to the headline", a: 15.9, b: 19.1, p: pEdit0 },
  { name: "slow push on the edit", a: 18.2, b: 21.8, p: pEdit1 },
  { name: "back to the purchase card", a: 21.1, b: 23.5, p: pCardWhole },
  { name: "push in on 499 kr.", a: 22.8, b: 25.0, p: pPrice499 },
  { name: "down the rows", a: 24.4, b: 27.2, p: pRows },
  { name: "back for the lifted site", a: 26.6, b: 29.2, p: pThumb },
  { name: "in on the price (roll)", a: 28.2, b: 30.7, p: pRoll },
  { name: "through the 0", a: 30.4, b: 31.8, p: pZoom },
  { name: "pill grows into the card", a: T.morph0, b: T.morph1, p: pCard },
  { name: "glide down to the price", a: 34.2, b: 36.4, p: pFra },
  { name: "back to the hand-off", a: 36.05, b: (f("h2") - HANDOFF_HALF) / 30, p: camH2 },
];
const MORPH_I = MOVES.findIndex((m) => m.name === "pill grows into the card");
const makeCam = (g: number, upTo = MOVES.length): Cam => {
  let c = camH1(g);
  for (const m of MOVES.slice(0, upTo)) {
    if (g <= m.a * 30) continue;
    const t = io(g, m.a, m.b), q = m.p(g);
    c = { x: mix(c.x, q.x, t), y: mix(c.y, q.y, t), z: mix(c.z, q.z, t), rx: mix(c.rx, q.rx, t), ry: mix(c.ry, q.ry, t), rz: 0, focus: mix(c.focus, q.focus, t), ap: mix(c.ap, q.ap, t) };
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
  const chip = io(g, 16.75, 17.5);
  const sel = k(g, T.click + 0.05, 0.4) * (1 - k(g, 21.2, 0.45, INOUT));
  const field = k(g, T.click + 0.1, 0.6) * (1 - k(g, 21.15, 0.45, INOUT));
  const fieldIn = k(g, T.click + 0.1, 0.6);
  const txt = typed(g, T.type0, EDIT_TEXT, 40);
  const busy = k(g, T.send + 0.08, 0.3, INOUT), spin = busy * (1 - k(g, 20.9, 0.35, INOUT));
  const blink = txt.length > 0 && txt.length < EDIT_TEXT.length ? 1 : (Math.floor((g / 30) * 2) % 2 === 0 ? 1 : 0);
  const outP = (i: number) => -SIN((g - f(T.swap) - i * 2) / 15);                       // old words rise out
  const inP = (i: number) => 1 - SIN((g - f(T.swapIn) - i * 2.6) / 22);                   // new words rise in
  const swapped = g >= f(T.swap) + 36;
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
  const p = lin(g, T.roll0, T.roll1 + 0.15), fold = io(g, 30.75, 31.4);
  return (
    <div style={{ position: "absolute", left: PRICE.x, top: PRICE.y, height: LH, display: "flex", fontFamily: SERIF, fontSize: DIGIT, letterSpacing: "-0.02em", color: C.ink, fontVariantNumeric: "lining-nums tabular-nums" }}>
      <div style={{ height: LH, overflow: "hidden", display: "flex" }}>
        <div style={{ display: "flex", transform: `translateY(${((1 - inN) * LH).toFixed(2)}px)` }}>
          {[4, 9, 9].map((a, i) => {
            const q = SIN(p * 1.4 - i * 0.2), w = i < 2 ? COL * (1 - fold) : COL;
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
// a type beat in screen space: the line rides with the camera (always centred), with a slow push of its own; it
// leaves as one line rising out through a mask on a sine ease (no sudden start)
const TypeBeat: React.FC<{ g: number; items: KItem[]; a: number; out: number }> = ({ g, items, a, out }) => {
  if (g < a * 30 || g > (out + 0.9) * 30) return null;
  const q = io(g, out, out + 0.75), h = TYPE.hero * 1.25;
  return (
    <div style={{ position: "absolute", left: 960, top: 540, transform: `scale(${(1 + 0.08 * lin(g, a, out + 0.9)).toFixed(4)})` }}>
      <div style={{ position: "absolute", left: -900, top: -h / 2, width: 1800, height: h, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 900, top: h / 2, transform: `translateY(${(-q * h).toFixed(2)}px)` }}><Kinetic g={g} size={TYPE.hero} items={items} /></div>
      </div>
    </div>
  );
};

/* ---------- the scene ---------- */
export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h1") + HANDOFF_HALF) return <Handoff1 g={g} />;
  if (g >= f("h2") - HANDOFF_HALF) return <Handoff2 g={g} />;
  const c = makeCam(g);

  /* the site */
  const pre = g > T.morph0 * 30 ? makeCam(g, MORPH_I) : c;      // the camera without the pill-to-card move
  const zp = project(c, ZERO_W), zs = project(pre, ZERO_W).s;
  const gone = SIN(lin(Math.log(Math.max(1, zs)) * 30, Math.log(9), Math.log(29.5)));       // the card dissolves as the camera glides through its 0
  const pushing = g > T.push0 * 30 && gone < 1;
  const phase1 = g < 22.8 * 30;
  const siteO = phase1 ? mix(1, 0.12, io(g, 13.9, 14.55) * (1 - io(g, 14.9, 16.0))) * (1 - io(g, 21.6, 22.7))
    : (g > T.push0 * 30 && gone > 0 ? 1 - io(g, 33.7, 34.6) : 0);
  const clip = `ellipse(${(ZERO_A * zp.s).toFixed(1)}px ${(ZERO_B * zp.s).toFixed(1)}px at ${zp.x.toFixed(1)}px ${zp.y.toFixed(1)}px)`;

  /* the purchase card */
  const showPC = g > T.cardIn * 30 && gone < 1;
  const pcIn = io(g, T.cardIn, T.cardIn + 1.35);
  const dim = Math.max(io(g, 28.1, 28.8) * (1 - io(g, 29.7, 30.3)), io(g, 30.9, 31.5) * (1 - io(g, 32.1, 32.85)));
  const pcO = clamp01(pcIn * 2) * (1 - 0.8 * dim) * (1 - gone), pcY = PCC.y + (1 - pcIn) * 560;
  const pcBlur = 6 * dim;   // soft only behind the type beats; otherwise the card is the subject
  const lift = io(g, T.lift0, T.lift1) * (1 - io(g, T.drop0, T.drop1));
  const tc = pcPt(THUMB.x + THUMB.w / 2, THUMB.y + THUMB.h / 2);
  // while the pill grows into the card the camera travels 2,000 px; the fading site travels with it, so it dissolves in place
  const site2 = <Plane x={H1_SITE.x + c.x - pre.x} y={H1_SITE.y + c.y - pre.y} z={H1_SITE.z + c.z - pre.z} ry={H1_SITE.ry} w={SITE_WIN.w} h={SITE_WIN.h} dof={false}><SiteWindow headline={NEW_HEADLINE} /></Plane>;

  /* the pill → the hosting card */
  const m = io(g, T.morph0, T.morph1), morphing = g > T.morph0 * 30;
  const bw = mix(320, CARD.w, m), bh = mix(28, CARD.h, m);
  const box = { x: mix(PILL.x, H2_CARD.x, m), y: mix(PILL.y, H2_CARD.y, m), z: mix(PILL.z + 4, H2_CARD.z, m) + 0, ry: mix(H1_SITE.ry, H2_CARD.ry, m) };
  const rows = lin(g, W("w:stter"), W("w:stter") + 0.6) + lin(g, W("w:hele2"), W("w:hele2") + 0.6) + lin(g, W("w:op"), W("w:op") + 0.6);
  const price = lin(g, W("w:fra"), W("w:fra") + 0.7);
  const card = <HostingCard g={g} rows={rows} active={[0, 0, 0]} price={price} />;

  /* the cursor (screen space) */
  const showCur = g > 17.8 * 30 && g < 21.4 * 30;
  let cur = { x: 0, y: 0 };
  if (showCur) {
    const t1 = project(c, sitePt(330, 46 + 268)), t2 = project(c, sitePt(54 + 640 - 34, 46 + 346 + 36));
    const a = io(g, 17.85, 18.68), b = io(g, 19.3, 20.05), d = io(g, 20.4, 21.35);
    cur = { x: mix(mix(mix(1500, t1.x, a), t2.x, b), 1560, d), y: mix(mix(mix(1180, t1.y, a), t2.y, b), 1200, d) };
  }

  return (
    <AbsoluteFill>
      {siteO > 0 && (
        <AbsoluteFill style={{ opacity: siteO }}>
          <Stage3D cam={c}>{phase1 ? <Plane {...H1_SITE} w={SITE_WIN.w} h={SITE_WIN.h}><SiteLayer g={g} scroll={0} /></Plane> : site2}</Stage3D>
        </AbsoluteFill>
      )}
      {showPC && (
        <Stage3D cam={c}>
          <Plane x={PCC.x} y={pcY} z={TYPE_Z} w={PC.w} h={PC.h} opacity={pcO} dof={false} blur={pcBlur}><PurchaseBody g={g} /></Plane>
        </Stage3D>
      )}
      {/* the site seen through the price's "0" */}
      {pushing && <AbsoluteFill style={{ opacity: (1 - dim) * (1 - gone), clipPath: clip }}><Stage3D cam={c}>{site2}</Stage3D></AbsoluteFill>}
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
              <div style={{ position: "absolute", left: (bw - CARD.w) / 2, top: (bh - CARD.h) / 2, opacity: clamp01((m - 0.3) / 0.4) }}>{card}</div>
            </div>
          </Plane>
        ) : <Plane {...H2_CARD} w={CARD.w} h={CARD.h}>{card}</Plane>)}
      </Stage3D>
      {/* the type beats */}
      <TypeBeat g={g} a={13.9} out={14.75} items={[{ t: "Det", at: "w:det", dur: 0.7 }, { t: "bedste?", at: "w:bedste", accent: true, dur: 0.7 }]} />
      <TypeBeat g={g} a={22.3} out={22.85} items={[{ t: "Tilfreds?", at: "w:tilfreds", accent: true, dur: 0.6 }]} />
      <TypeBeat g={g} a={28.6} out={29.45} items={[{ t: "Ikke", at: "w:ikke", dur: 0.7 }, { t: "tilfreds?", at: "w:tilfreds2", accent: true, dur: 0.7 }]} />
      <TypeBeat g={g} a={31.0} out={31.95} items={[{ t: "Nul", at: "w:nul", accent: true, dur: 0.7 }, { t: "risiko.", at: "w:risiko", dur: 0.7 }]} />
      {showCur && <Cursor x={cur.x} y={cur.y} size={48} press={Math.max(press(g, T.click), press(g, T.send))} />}
    </AbsoluteFill>
  );
};
