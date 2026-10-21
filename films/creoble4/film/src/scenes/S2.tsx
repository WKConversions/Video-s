// Builder 2 — B2, h1 → h2 (plan/storyboard.md, version 3). Five shots, each with its own move:
//   7  "Det bedste?"            push UP in from below (h1) + per-word scale pops with a bounce + a light shine sweeping
//                              through the italic word; hold = a float bob.
//   8  "Du ser den færdig, …"   the site pops forward in DEPTH to full bleed (0.72 → 1, bounce) and momentum-scrolls
//                              DOWN to the services; on "betaler" the ink Island springs open, "Betalt:", then "0 kr"
//                              ticks in from above as the capsule widens; it pulses on "krone".
//   9  "Vil du ændre noget?"    the Liquid Glass prompt bar falls from the top under gravity, lands with a squash and a
//                              hop; the page swings back up to the hero behind it and starts a slow 3D sway.
//   10 "Skriv det."             the request types; the bar stretches wider word by word on elastic springs; the send
//                              dot presses on "det".
//   11 "Creoble retter det."    the sage dot pulls off the bar (liquid split) and flies an ARC into the hero, melts
//                              into a pill (Gooey) that pops out as "Book tid" with a ripple; the bar is dismissed;
//                              Island "✓ Opdateret". Hard cut at h2 while it is all still moving.
import React from "react";
import {
  C, Check, EXIT, Gooey, HOLM, HolmSite, Ico, INOUT, Island, LiquidGlass, OUT, SANS, SERIF, SHADOW_BIG, SITE,
  aspring, bounce, clamp01, f, mix, press, pushInUp, squash,
} from "../shared";

/* ---------- local helpers ---------- */
const S = (fr: number) => fr / 30;                                       // 30-unit frame → seconds (for bounce/aspring)
const lin = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1e-6, b - a));
const FB = { x: -60, y: -40, w: 2040, h: 1160 };                          // full bleed, with overscan for the breath and sway
const DS = 1.6;                                                          // the site's design px → screen px (UI ≥ 28 px)
const CX = 960, CY = 540, PERSP = 2200;
const BOOK = { x: 148, y: 588, w: 156, h: 58 };                          // the "Book tid" button: centre and size (design px)
const ASK = "Vil du ændre noget?";
const REQ = "Tilføj en knap til online booking";
const REQ_WORDS = ["Tilføj ", "en ", "knap ", "til ", "online ", "booking"];
const BAR_H = 128, W0 = 820, W1 = 1200, SEND = 100, SEND_PAD = 14, TXT = 54, TXT_X = 112;
const SCROLL_DOWN = 520, SCROLL_HOME = 150, LAND = 928;

// Impulse response of a damped spring (damping ζ, period in 30-unit frames), normalised so its first lobe peaks at 1:
// the glass's landing (positive lobes squash it into the floor, negative lobes lift it off).
const kick = (t: number, period: number, zeta: number) => {
  if (t <= 0) return 0;
  const w = (2 * Math.PI) / period, wd = w * Math.sqrt(1 - zeta * zeta), tp = Math.atan(wd / (zeta * w)) / wd;
  const peak = Math.exp(-zeta * w * tp) * Math.sin(wd * tp);
  return (Math.exp(-zeta * w * t) * Math.sin(wd * t)) / peak;
};
const bez = (a: number, b: number, c: number, u: number) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;

export const Scene2: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h1") || g >= f("h2")) return null;
  const F = {
    h1: f("h1"), bed: f("w:bedste"), du: f("w:du"), bet: f("w:betaler"), kr: f("w:krone"), vil: f("w:vil"),
    skriv: f("w:skriv"), det2: f("w:det2"), cre: f("w:creoble2"), ret: f("w:retter"), h2: f("h2"),
  };
  const POP = F.du - 3;                       // shot 8: the site pops forward
  const FALL0 = F.vil - 13, FALL1 = F.vil;    // shot 9: the drop; impact on "vil"
  const REC = FALL0 + 1;                      // the page swings home and starts its sway
  const TY0 = F.skriv - 7, TY1 = F.det2 - 1;  // shot 10: typing
  const LAUNCH = F.cre;                       // shot 11: the dot leaves

  /* ---- the site card: pop + scroll (8), swing home + slow 3D sway (9–11) ---- */
  const card = (gg: number) => {
    const pop = bounce(gg, S(POP), 0.55, 0.58);
    const down = SCROLL_DOWN * aspring(gg, S(POP + 4), 2.1, 1);
    const home = aspring(gg, S(REC), 0.9, 1);
    const scroll = mix(down, SCROLL_HOME, home);
    const ws = aspring(gg, S(REC + 4), 1.1, 1), ph = (gg - REC) / 30;
    const ry = ws * 2.6 * Math.sin((ph * Math.PI * 2) / 3.4), rx = -ws * 1.3 * Math.sin((ph * Math.PI * 2) / 4.6 + 0.4);
    const ty = -ws * 10 * Math.sin((ph * Math.PI * 2) / 3.9);
    return { pop, sc: mix(0.72, 1, pop), scroll, ry, rx, ty };
  };
  type Card = ReturnType<typeof card>;
  // A site design point → screen (the same maths as the card's CSS transform), with the local scale there.
  const proj = (c: Card, dx: number, dy: number) => {
    const x = (dx * DS - CX) * c.sc, y = ((dy - c.scroll) * DS - CY) * c.sc;
    const a = (c.ry * Math.PI) / 180, b = (c.rx * Math.PI) / 180;
    const x1 = x * Math.cos(a), z1 = -x * Math.sin(a);
    const y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
    const w = 1 - z2 / PERSP;
    return { x: CX + x1 / w, y: CY + y2 / w + c.ty, s: (c.sc * DS) / w };
  };
  const cd = card(g);

  /* ---- shot 7 ---- */
  const show7 = g < POP + 14;
  const sheetR = 56 * (1 - OUT(lin(g, F.h1, F.h1 + 10)));
  const pDet = bounce(g, S(F.h1 + 1), 0.5, 0.6);
  const pBed = bounce(g, S(F.bed - 2), 0.5, 0.56);
  const pQ = bounce(g, S(F.bed + 2), 0.45, 0.55);
  const bob = 9 * Math.sin(((g - F.h1) / 30) * Math.PI * 2 / 1.3);
  const shine = mix(-30, 135, INOUT(lin(g, F.bed + 3, F.bed + 19)));
  const away = OUT(lin(g, POP, POP + 5));

  /* ---- Island 1: "Betalt: 0 kr" ---- */
  const I1C = F.kr + 8, TICK = F.kr - 10;
  const i1in = bounce(g, S(F.bet - 8), 0.4, 0.62), i1hide = INOUT(lin(g, I1C + 5, I1C + 12));
  const ow = bounce(g, S(TICK), 0.45, 0.58);                                    // "0 kr" ticks in, the capsule widens
  const thump = 0.09 * kick(g - F.kr, 9, 0.55);                                 // and pulses on "krone"
  const i1p = Math.max(-0.12, bounce(g, "w:betaler", 0.55, 0.6) + thump - bounce(g, S(I1C), 0.45, 0.7));
  const show1 = g >= F.bet - 8 && i1hide < 1;

  /* ---- the bar: drop, squash, elastic width, dismissal ---- */
  const nTyped = Math.max(0, Math.min(REQ.length, Math.floor((g - TY0) * (REQ.length / (TY1 - TY0)))));
  let cum = 0, wGrow = 0;
  REQ_WORDS.forEach((w) => { cum += w.length; const t = TY0 + (cum * (TY1 - TY0)) / REQ.length; wGrow += (((W1 - W0) * w.length) / REQ.length) * bounce(g, S(t - 1.5), 0.42, 0.55); });
  const barW = W0 + wGrow;
  const exitY = (gg: number) => 70 * EXIT(lin(gg, LAUNCH + 5, LAUNCH + 21));   // dismissed: it sinks a little and dissolves
  const fallY = (gg: number) => { const u = lin(gg, FALL0, FALL1); return mix(-100, LAND, u * u); };
  let bw = barW, bh = BAR_H, bcy = LAND, vy = 0;
  if (g < FALL1) {
    bcy = fallY(g); vy = (fallY(g) - fallY(g - 0.5)) / 0.5;
  } else {
    const e = kick(g - FALL1, 11, 0.55);
    if (e > 0) { const c = 0.24 * e; bh = BAR_H * (1 - c); bw = barW * (1 + 0.4 * c); bcy = LAND + (BAR_H - bh) / 2; }
    else bcy = LAND + 300 * e;
    bcy += exitY(g); vy = (exitY(g) - exitY(g - 0.5)) / 0.5;
  }
  const barStretch = squash(0, Math.min(vy, 120), 0.0011);
  const barOut = INOUT(lin(g, LAUNCH + 6, LAUNCH + 20));
  const showBar = g >= FALL0 && barOut < 1;
  const sheen = 0.1 + 0.45 * lin(g, FALL0, FALL1 + 12) + 0.35 * lin(g, TY0, LAUNCH + 16);
  const askOut = lin(g, TY0 - 4, TY0);
  const sentOut = OUT(lin(g, LAUNCH + 1, LAUNCH + 7));
  const active = lin(g, TY0, TY0 + 3);
  const pr = press(g, "w:det2", 0.1);
  const sendC = { x: CX + barW / 2 - SEND_PAD - SEND / 2, y: LAND };     // the send dot's centre once the bar has settled

  /* ---- shot 11: the arc, the merge, the pop ---- */
  const u = aspring(g, S(LAUNCH), 0.62, 1);
  const dotAt = (gg: number) => {
    const q = aspring(gg, S(LAUNCH), 0.62, 1), P2 = proj(card(gg), BOOK.x, BOOK.y);
    const P1 = { x: (sendC.x + P2.x) / 2 + 80, y: Math.min(sendC.y, P2.y) - 560 };
    return { x: bez(sendC.x, P1.x, P2.x, q), y: bez(sendC.y, P1.y, P2.y, q) };
  };
  const dot = dotAt(g), dotPrev = dotAt(g - 0.5);
  const tgt = proj(cd, BOOK.x, BOOK.y), btnW = BOOK.w * tgt.s, btnH = BOOK.h * tgt.s;
  const dotD = mix(SEND, btnH, u);
  const stub = 1 - OUT(lin(g, LAUNCH, LAUNCH + 9));                          // what stays behind in the bar, shrinking
  // the page makes room while the dot flies: "Se behandlinger" slides aside and a sage slot opens where the new button
  // goes (it also hides the real button growing underneath); the dot melts into it, the blob pulses, "Book tid" pops.
  const booking = OUT(lin(g, LAUNCH + 4, F.ret - 2));
  const slotW = Math.min(BOOK.w, 172 * OUT(booking)) + 6;                   // HolmSite eases booking once more inside
  const pad = proj(cd, 70 - 3 + slotW / 2, BOOK.y), pk = kick(g - (F.ret - 1), 10, 0.55);
  const padW = slotW * pad.s * (1 + 0.12 * pk), padH = (BOOK.h + 6) * pad.s * (1 - 0.1 * pk);
  const btnPop = bounce(g, S(F.ret + 1), 0.5, 0.55);
  const btnIn = lin(g, F.ret + 1, F.ret + 3);
  const gooFade = 1 - lin(g, F.ret + 4, F.ret + 9);
  const ripple = lin(g, F.ret + 2, F.ret + 17);
  const showGoo = g >= LAUNCH && gooFade > 0;

  /* ---- Island 2: "✓ Opdateret" ---- */
  const i2in = bounce(g, S(F.ret - 4), 0.4, 0.62), i2p = bounce(g, S(F.ret + 3), 0.55, 0.6);

  const rad = (40 * (1 - clamp01(cd.pop))) / Math.max(0.5, cd.sc);
  const showCard = g >= POP;

  return (
    <>
      {/* ===== shot 7: "Det bedste?" ===== */}
      {show7 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${pushInUp(g, "h1")}px)` }}>
          {/* a pale-sage sheet that pushes up from below (iOS sheet), corners rounding square as it lands */}
          <div style={{ position: "absolute", left: -60, top: -40, width: 2040, height: 1220, background: C.sageTint, borderRadius: `${sheetR}px ${sheetR}px 0 0`, boxShadow: "0 -20px 60px -18px rgba(26,22,20,0.22)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 560px", transform: `translateY(${bob}px) scale(${1 - 0.12 * away})`, opacity: 1 - away }}>
            <div style={{ position: "absolute", left: 0, width: 1920, top: 392, display: "flex", justifyContent: "center", alignItems: "baseline", fontFamily: SERIF, fontWeight: 400, fontSize: 240, letterSpacing: "-0.025em", lineHeight: 1.1, color: C.ink, whiteSpace: "nowrap" }}>
              <span style={{ display: "inline-block", transformOrigin: "50% 85%", transform: `translateY(${(1 - pDet) * 40}px) scale(${0.5 + 0.5 * pDet})`, opacity: clamp01(pDet * 3) }}>Det</span>
              <span style={{ width: 58 }} />
              <span style={{ display: "inline-block", transformOrigin: "50% 85%", transform: `translateY(${(1 - pBed) * 60}px) scale(${0.4 + 0.6 * pBed}) rotate(${(1 - pBed) * -7}deg)`, opacity: clamp01(pBed * 3), fontStyle: "italic", padding: "0 0.07em 0 0.04em",
                backgroundImage: `linear-gradient(102deg, ${C.sageDeep} ${shine - 16}%, #D9EAE4 ${shine}%, ${C.sageDeep} ${shine + 16}%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>bedste</span>
              <span style={{ display: "inline-block", transformOrigin: "50% 90%", transform: `translateY(${(1 - pQ) * 70}px) scale(${0.4 + 0.6 * pQ}) rotate(${(1 - pQ) * 18}deg)`, opacity: clamp01(pQ * 3) }}>?</span>
            </div>
          </div>
        </div>
      )}

      {/* ===== shots 8–11: the site card ===== */}
      {showCard && (
        <div style={{ position: "absolute", left: FB.x, top: FB.y, width: FB.w, height: FB.h, borderRadius: rad, overflow: "hidden", transformOrigin: `${CX - FB.x}px ${CY - FB.y}px`,
          transform: `translateY(${cd.ty}px) perspective(${PERSP}px) rotateX(${cd.rx}deg) rotateY(${cd.ry}deg) scale(${cd.sc})`, opacity: lin(g, POP, POP + 1.5), boxShadow: SHADOW_BIG, background: HOLM.bg }}>
          <div style={{ position: "absolute", left: -FB.x, top: -FB.y }}>
            <HolmSite w={SITE.w * DS} h={FB.h + FB.y} scroll={cd.scroll} booking={booking} />
          </div>
        </div>
      )}

      {/* ===== Island 1: Betalt: 0 kr ===== */}
      {show1 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 56px", transform: `scale(${Math.max(0, i1in) * (1 - i1hide)})` }}>
          <Island x={960} y={30} w={mix(290, 410, ow)} h={92} p={i1p}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 36, fontWeight: 500, whiteSpace: "nowrap" }}>
              <span style={{ opacity: 0.66 }}>Betalt:</span>
              <span style={{ display: "inline-flex", width: 104 * clamp01(ow), overflow: "hidden", height: 56, alignItems: "center", flex: "none" }}>
                <span style={{ display: "inline-block", marginLeft: 14, transform: `translateY(${(1 - ow) * -46}px)`, opacity: clamp01(ow * 3), color: C.sageLight, fontWeight: 600 }}>0</span>
                <span style={{ marginLeft: 10, opacity: clamp01(ow * 2 - 0.4) }}>kr</span>
              </span>
            </div>
          </Island>
        </div>
      )}

      {/* ===== shots 9–11: the Liquid Glass prompt bar ===== */}
      {showBar && (
        <div style={{ position: "absolute", left: CX - bw / 2, top: bcy - bh / 2, width: bw, height: bh, opacity: 1 - barOut, transform: `scale(${1 - 0.14 * barOut})` }}>
          <LiquidGlass w={bw} h={bh} p={1} sheen={sheen} transform={barStretch}>
            <div style={{ position: "absolute", inset: 10, borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.8))" }} />
            <div style={{ position: "absolute", left: 42, top: 0, height: "100%", display: "flex", alignItems: "center" }}>
              <Ico n="sparkle" s={46} c={C.sage} w={1.6} fill={C.sage} />
            </div>
            {/* the placeholder: the question, letter by letter */}
            {askOut < 1 && (
              <div style={{ position: "absolute", left: TXT_X, top: 0, height: "100%", display: "flex", alignItems: "center", fontSize: TXT, color: C.muted, letterSpacing: "-0.01em", whiteSpace: "pre", opacity: 1 - askOut, transform: `translateY(${askOut * 18}px)` }}>
                {ASK.split("").map((ch, i) => { const p = bounce(g, S(F.vil + 1) + i * 0.018, 0.4, 0.58); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * 30}px) scale(${0.5 + 0.5 * p})`, transformOrigin: "50% 80%", opacity: clamp01(p * 2.5) }}>{ch}</span>; })}
              </div>
            )}
            {/* the request */}
            {nTyped > 0 && (
              <div style={{ position: "absolute", left: TXT_X, top: 0, height: "100%", display: "flex", alignItems: "center", fontSize: TXT, fontWeight: 500, color: C.ink, letterSpacing: "-0.015em", whiteSpace: "pre", opacity: 1 - sentOut, transform: `translateY(${-sentOut * 26}px)` }}>
                {REQ.slice(0, nTyped)}
                <span style={{ display: "inline-block", width: 3, height: 60, marginLeft: 4, borderRadius: 2, background: C.sage, opacity: nTyped < REQ.length || Math.floor((g - TY1) / 8) % 2 === 0 ? 1 : 0 }} />
              </div>
            )}
            {/* the send dot (it leaves on "Creoble": the Gooey layer takes it from there) */}
            {g < LAUNCH && (
              <div style={{ position: "absolute", right: SEND_PAD, top: (bh - SEND * (bh / BAR_H)) / 2, width: SEND, height: SEND * (bh / BAR_H), borderRadius: "50%",
                background: `color-mix(in srgb, ${C.sage} ${active * 100}%, #CFDCD7)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.16 * pr})`, boxShadow: `0 ${10 - 8 * pr}px 22px -10px rgba(73,93,88,0.65)` }}>
                <Ico n="arrow" s={48} c={C.white} w={2.6} style={{ transform: "rotate(-90deg)" }} />
              </div>
            )}
            {g >= LAUNCH && <div style={{ position: "absolute", right: SEND_PAD, top: (BAR_H - SEND) / 2, width: SEND, height: SEND, borderRadius: "50%", border: "2px solid rgba(135,168,158,0.45)", boxSizing: "border-box" }} />}
          </LiquidGlass>
        </div>
      )}

      {/* ===== shot 11: the liquid dot ===== */}
      {showGoo && (
        <div style={{ position: "absolute", inset: 0, opacity: gooFade }}>
          <Gooey>
            {stub > 0.02 && <div style={{ position: "absolute", left: sendC.x - (SEND * stub) / 2, top: sendC.y + exitY(g) - (SEND * stub) / 2, width: SEND * stub, height: SEND * stub, borderRadius: "50%", background: C.sage }} />}
            <div style={{ position: "absolute", left: dot.x - dotD / 2, top: dot.y - dotD / 2, width: dotD, height: dotD, borderRadius: "50%", background: C.sage, transform: squash(dot.x - dotPrev.x, dot.y - dotPrev.y, 0.0016) }} />
            {booking > 0.01 && <div style={{ position: "absolute", left: pad.x - padW / 2, top: pad.y - padH / 2, width: padW, height: padH, borderRadius: 999, background: C.sage }} />}
          </Gooey>
          {u < 0.55 && <div style={{ position: "absolute", left: dot.x - 24, top: dot.y - 24, opacity: 1 - lin(u, 0.15, 0.55) }}><Ico n="arrow" s={48} c={C.white} w={2.6} style={{ transform: "rotate(-90deg)" }} /></div>}
        </div>
      )}

      {/* ===== shot 11: "Book tid" pops out of the liquid ===== */}
      {g >= F.ret + 1 && (
        <>
          {ripple < 1 && <div style={{ position: "absolute", left: tgt.x - (btnW + 110 * ripple) / 2, top: tgt.y - (btnH + 110 * ripple) / 2, width: btnW + 110 * ripple, height: btnH + 110 * ripple, borderRadius: 999, border: `3px solid ${C.sage}`, opacity: 0.9 * (1 - ripple), boxSizing: "border-box" }} />}
          <div style={{ position: "absolute", left: tgt.x - btnW / 2, top: tgt.y - btnH / 2, width: btnW, height: btnH, borderRadius: 999, background: HOLM.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 * tgt.s,
            fontFamily: SANS, fontWeight: 600, fontSize: 18 * tgt.s, whiteSpace: "nowrap", opacity: btnIn, transform: `scale(${0.78 + 0.22 * btnPop})` }}>
            <Ico n="calendar" s={18 * tgt.s} c="#fff" w={2.4} />Book tid
          </div>
        </>
      )}

      {/* ===== Island 2: ✓ Opdateret ===== */}
      {g >= F.ret - 4 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 56px", transform: `scale(${Math.max(0, i2in)})` }}>
          <Island x={960} y={30} w={400} h={92} p={i2p}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, height: "100%", fontSize: 36, fontWeight: 500, whiteSpace: "nowrap" }}>
              <Check size={42} p={lin(g, F.ret + 6, F.ret + 12)} />Opdateret
            </div>
          </Island>
        </div>
      )}
    </>
  );
};
