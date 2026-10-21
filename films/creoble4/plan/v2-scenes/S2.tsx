// Builder 2 — B2, h1 → h2 (plan/storyboard.md, version 2). One shot per sentence, constant travel, a real
// transition on every sentence:
//   7  "Det bedste?"            whip in on a sage full frame; huge cream kinetic type pushing in.
//   8  "Du ser den færdig, …"   zoom THROUGH the "?": the finished site grows out of the hook to full bleed and keeps
//                              scrolling (the photos travel slower than the page); "Færdig" materializes on "færdig";
//                              on "betaler en krone" a Glass card slides up and "0 kr" rolls 9 → 0.
//   9  "Vil du ændre noget?"    vertical push: the card leaves up as Creoble's Glass prompt bar rises (1200 wide); the
//                              question springs into its placeholder word by word.
//   10 "Skriv det."             push-in to a close-up of the bar; the request types; send presses on "det".
//   11 "Creoble retter det."    zoom through the send button (it opens as a circle) into the site's hero; a light-sage
//                              pass runs over it on "Creoble"; "Book tid" springs in with a sage ripple on "retter".
//                              Whip out at h2.
import React from "react";
import { Img, staticFile } from "remotion";
import {
  C, Glass, HolmSite, HOLM, Ico, INOUT, OUT, RollNumber, SANS, SERIF, SITE, Scrim,
  aspring, clamp01, f, kf, mix, press, whipFade, whipIn, whipOut,
} from "../shared";

/* ---------- local helpers (frame numbers) ---------- */
const sp = (g: number, frame: number, resp = 0.42, damp = 1) => aspring(g, frame / 30, resp, damp);
const IN2 = (t: number) => t * t;
const lin = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
// Full bleed with overscan for Story's breath.
const FB = { x: -28, y: -18, w: 1976, h: 1116 };

/* ---------- the client's site, full bleed, with parallax photos ---------- */
// The page scrolls; each photo is re-drawn in its own window and travels slower than the page (Apple's parallax).
const PHOTOS = [
  { src: "holm-shoulder.jpg", x: 760, y: 120, w: 630, h: 560, r: "24px", k: 0.32, base: -190, pos: "50% 50%" },
  { src: "holm-neck.jpg", x: 70, y: 760, w: 420, h: 270, r: "22px 22px 0 0", k: 0.18, base: -100, pos: "50% 50%" },
  { src: "holm-calves.jpg", x: 520, y: 760, w: 420, h: 270, r: "22px 22px 0 0", k: 0.18, base: -100, pos: "50% 50%" },
  { src: "holm-shoulder.jpg", x: 970, y: 760, w: 420, h: 270, r: "22px 22px 0 0", k: 0.18, base: -100, pos: "70% 30%" },
];
const ParallaxSite: React.FC<{ w: number; h: number; scroll: number }> = ({ w, h, scroll }) => {
  const s = w / SITE.w;
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden" }}>
      <HolmSite w={w} h={h} scroll={scroll} />
      <div style={{ position: "absolute", left: 0, top: 0, width: SITE.w, height: SITE.page, transform: `scale(${s}) translateY(${-scroll}px)`, transformOrigin: "0 0" }}>
        {PHOTOS.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.w, height: p.h, borderRadius: p.r, overflow: "hidden", background: HOLM.tint }}>
            <Img src={staticFile(`img/${p.src}`)} style={{ position: "absolute", left: 0, top: p.base + scroll * p.k, width: p.w, height: p.h * 1.4, objectFit: "cover", objectPosition: p.pos }} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- shot 7: the kinetic line ---------- */
const SZ = 236;                       // Fraunces px
const LINE = { right: 1528, top: 540 - SZ * 0.68 };
const Q = { x: 1461, y: 470 };        // a point inside the "?"'s hook: the zoom flies through here
const CREAM = C.cream;
// A word rising through its own mask on spring p.
const MaskWord: React.FC<{ p: number; size: number; it?: boolean; color: string; children: React.ReactNode }> = ({ p, size, it, color, children }) => (
  <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.18, marginBottom: -size * 0.18, paddingRight: it ? size * 0.05 : 0 }}>
    <span style={{ display: "inline-block", transform: `translateY(${(1 - Math.min(1, p)) * 104}%) scale(${0.9 + 0.1 * Math.min(1, p)})`, transformOrigin: "50% 100%", fontStyle: it ? "italic" : "normal", color }}>{children}</span>
  </span>
);

const TYPED = "Tilføj en knap til online booking";

export const Scene2: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h1") || g >= f("h2")) return null;
  const F = {
    h1: f("h1"), det: f("w:det"), bed: f("w:bedste"), du: f("w:du"), frd: f("w:frdig"), bet: f("w:betaler"), kr: f("w:krone"),
    vil: f("w:vil"), du3: f("w:du3"), ndre: f("w:ndre"), noget: f("w:noget"), skriv: f("w:skriv"), det2: f("w:det2"),
    cre: f("w:creoble2"), ret: f("w:retter"), det3: f("w:det3"), h2: f("h2"),
  };

  /* ---- shot 7 → 8: the zoom through the "?" ---- */
  const Z0 = F.du - 9, ZD = 14;                               // the type flies past the camera
  const z = clamp01((g - Z0) / ZD);
  const zs = Math.pow(46, IN2(z));
  const zc = INOUT(z);
  const P = { x: mix(Q.x, 960, zc), y: mix(Q.y, 540, zc) };   // the "?" travels to the centre as we enter it
  const S0 = Z0 + 3, SD = 15;                                 // the site grows out of the hook
  const gp = kf(g, S0, SD, INOUT);
  const gsc = Math.pow(0.045, 1 - gp);

  /* ---- shot 8: the site scrolls; "Færdig"; the 0 kr card ---- */
  const scroll = 470 * (1 - Math.pow(1 - lin(g, S0, F.det2 + 24), 1.7));   // starts at speed inside the landing, settles under the bar
  const chip = sp(g, F.frd - 2, 0.42);
  const card = sp(g, F.bet - 3, 0.5);
  const roll = clamp01((g - (F.bet - 1)) / (F.kr - F.bet + 6));

  /* ---- shot 9: vertical push; the prompt bar ---- */
  const PU = kf(g, F.vil - 6, 13, INOUT);                      // card up and out, bar up and in: same move
  const PO0 = F.det2 + 7, PO = kf(g, PO0, 14, INOUT);           // the portal through the send button (shot 11)
  const CU = kf(g, F.noget + 7, 13, INOUT);                     // close-up push-in (shot 10)
  const barBase = 1 + 0.0022 * Math.max(0, g - (F.vil - 6));
  const bs = barBase * mix(1, 1.3, CU);
  const btx = -40 * CU, bty = 16 - 22 * lin(g, F.vil - 6, PO0 + 14);
  const SEND = { x: 1492, y: 560, r: 50 };                      // in bar (unscaled screen) coords
  const sendX = 960 + btx + (SEND.x - 960) * bs, sendY = 560 + bty + (SEND.y - 560) * bs;
  const dim = 0.42 * sp(g, F.bet - 3, 0.5) + 0.14 * PU + 0.12 * CU;

  /* ---- shot 11: the hero ---- */
  const HT = lin(g, PO0, F.h2);
  const he = 0.55 * HT + 0.45 * INOUT(HT);
  const HS = mix(1.5, 1.86, he) * (0.86 + 0.14 * INOUT(PO));
  const HA = { x: mix(300, 172, he), y: mix(468, 586, he) }, HB = { x: 520, y: 560 };
  const rStart = SEND.r * bs, rEnd = 2100;
  const pr = rStart * Math.pow(rEnd / rStart, IN2(PO) * 0.6 + INOUT(PO) * 0.4);

  const showSage = g < S0 + SD + 1;
  const showSite = g >= S0 && g < PO0 + 15;
  const showBar = g >= F.vil - 6 && g < PO0 + 15;
  const showHero = g >= PO0;

  return (
    <>
      {/* ===== shot 7: "Det bedste?" on sage ===== */}
      {showSage && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${whipIn(g, "h1")}px)` }}>
          <div style={{ position: "absolute", left: FB.x, top: FB.y, width: FB.w, height: FB.h, background: C.sage }} />
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${Q.x}px ${Q.y}px`, transform: `translate(${P.x - Q.x}px, ${P.y - Q.y}px) scale(${zs})`, opacity: 1 - clamp01((z - 0.62) / 0.38) }}>
            <div style={{ position: "absolute", inset: 0, transformOrigin: `${Q.x}px ${Q.y}px`, transform: `translateX(${-34 * lin(g, F.h1, Z0 + ZD)}px) scale(${1 + 0.085 * lin(g, F.h1, Z0 + 4)})` }}>
              <div style={{ position: "absolute", right: 1920 - LINE.right, top: LINE.top, display: "flex", alignItems: "baseline", fontFamily: SERIF, fontWeight: 400, fontSize: SZ, letterSpacing: "-0.025em", lineHeight: 1.1, color: CREAM, whiteSpace: "nowrap" }}>
                <MaskWord p={sp(g, F.h1 - 6)} size={SZ} color={CREAM}>Det</MaskWord>
                <span style={{ width: SZ * 0.24 }} />
                <MaskWord p={sp(g, F.bed - 2)} size={SZ} it color={CREAM}>bedste</MaskWord>
                <MaskWord p={sp(g, F.bed + 1)} size={SZ} color={CREAM}>?</MaskWord>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== shots 8–10: the site, full bleed, scrolling ===== */}
      {showSite && (
        <div style={{ position: "absolute", left: FB.x, top: FB.y, width: FB.w, height: FB.h, overflow: "hidden", borderRadius: (34 / gsc) * (1 - gp),
          transformOrigin: `${P.x - FB.x}px ${P.y - FB.y}px`, transform: `scale(${gsc * (1 + 0.1 * IN2(CU) + 0.04 * lin(g, S0 + SD, PO0 + 14))})` }}>
          <ParallaxSite w={FB.w} h={FB.h} scroll={scroll} />
          {dim > 0.001 && <Scrim p={dim} />}
        </div>
      )}

      {/* ===== shot 8: "Færdig" ===== */}
      {g >= F.frd - 2 && PU < 1 && (
        <div style={{ position: "absolute", left: 1210, top: 150 - 16 * lin(g, F.frd, F.vil), transform: `translate(-50%, ${-(1 - chip) * 60 - PU * 760}px)` }}>
          <Glass p={chip} radius={999} weight={1.4} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 34px 16px 20px", fontSize: 34, fontWeight: 500, whiteSpace: "nowrap" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.5 + 0.5 * sp(g, F.frd + 2, 0.4)})` }}><Ico n="check" s={28} c={C.white} w={3} /></div>
            Færdig
          </Glass>
        </div>
      )}

      {/* ===== shot 8: "0 kr" ===== */}
      {g >= F.bet - 3 && PU < 1 && (
        <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%, -50%) translateY(${(1 - card) * 640 - 36 * lin(g, F.bet, F.vil) - PU * 800}px) scale(${1 + 0.035 * lin(g, F.bet, F.vil)})` }}>
          <Glass p={Math.min(1, card * 1.4)} radius={44} weight={1.5} style={{ width: 600, padding: "40px 0 26px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 32, color: C.muted, fontWeight: 500 }}>Betalt indtil nu</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4, fontFamily: SERIF, fontSize: 250, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1 }}>
              <RollNumber value={0} from={9} p={roll} size={250} />
              <span style={{ transform: `translateY(${(1 - sp(g, F.bet + 4, 0.45)) * 60}px)`, opacity: sp(g, F.bet + 4, 0.45) }}>kr</span>
            </div>
          </Glass>
        </div>
      )}

      {/* ===== shots 9–10: the prompt bar ===== */}
      {showBar && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${sendX}px ${sendY}px`, transform: `scale(${Math.pow(2.6, IN2(PO))})`, opacity: 1 - clamp01((PO - 0.45) / 0.4) }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 560px", transform: `translate(${btx}px, ${bty + (1 - PU) * 800}px) scale(${bs})` }}>
            <PromptBar g={g} F={F} />
          </div>
        </div>
      )}

      {/* ===== shot 11: the hero, through the send button ===== */}
      {showHero && (
        <div style={{ position: "absolute", left: FB.x, top: FB.y, width: FB.w, height: FB.h, overflow: "hidden",
          clipPath: PO < 1 ? `circle(${pr}px at ${sendX - FB.x}px ${sendY - FB.y}px)` : undefined,
          transform: `translateX(${whipOut(g, "h2")}px)`, opacity: whipFade(g, "h2") }}>
          <div style={{ position: "absolute", inset: 0, background: HOLM.bg }} />
          <div style={{ position: "absolute", left: -FB.x, top: -FB.y, width: SITE.w, height: SITE.page, transformOrigin: "0 0",
            transform: `translate(${HB.x - HA.x * HS}px, ${HB.y - HA.y * HS}px) scale(${HS})` }}>
            <HolmSite w={SITE.w} h={SITE.page} booking={sp(g, F.ret - 1, 0.5)} />
            <HeroFx g={g} F={F} />
          </div>
          {PO < 1 && <div style={{ position: "absolute", left: sendX - FB.x - pr, top: sendY - FB.y - pr, width: pr * 2, height: pr * 2, borderRadius: "50%", boxShadow: `inset 0 0 0 ${6 * (1 - PO)}px ${C.sage}`, background: `rgba(135,168,158,${1 - clamp01(PO * 3)})` }} />}
        </div>
      )}
    </>
  );
};

/* ---------- the Glass prompt bar (shots 9–10) ---------- */
type FT = Record<string, number>;
const PromptBar: React.FC<{ g: number; F: FT }> = ({ g, F }) => {
  const W = 1200, H = 136, X = 960 - W / 2, Y = 560 - H / 2;
  const PH = 52, TY = 40;
  const phOut = kf(g, F.noget + 8, 6, INOUT);
  const TY0 = F.skriv - 5;
  const n = Math.max(0, Math.min(TYPED.length, Math.floor((g - TY0 + 1) * 2.8)));
  const on = kf(g, TY0, 6, OUT);
  const pr = press(g, "w:det2");
  const pulse = kf(g, F.det2, 14, OUT);
  const words: [string, number][] = [["Vil", F.vil], ["du", F.du3], ["ændre", F.ndre], ["noget?", F.noget]];
  return (
    <div style={{ position: "absolute", left: X, top: Y, width: W, height: H }}>
      <Glass p={kf(g, F.vil - 6, 10, OUT)} radius={H / 2} weight={1.5} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 20px 0 44px" }}>
        <Ico n="sparkle" s={46} c={C.sage} w={2.2} style={{ transform: `rotate(${(g - F.vil) * 1.2}deg)` }} />
        <div style={{ position: "relative", flex: 1, height: H, marginLeft: 26, overflow: "hidden" }}>
          {/* the placeholder: the question springs in word by word */}
          {phOut < 1 && (
            <div style={{ position: "absolute", left: 0, top: 0, height: H, display: "flex", alignItems: "center", columnGap: PH * 0.28, fontFamily: SANS, fontSize: PH, color: C.muted, letterSpacing: "-0.015em", whiteSpace: "nowrap", transform: `translateY(${-phOut * H * 0.7}px)`, opacity: 1 - phOut }}>
              {words.map(([w, at]) => {
                const p = sp(g, at - 2, 0.38);
                return (
                  <span key={w} style={{ display: "inline-block", overflow: "hidden", paddingBottom: PH * 0.2, marginBottom: -PH * 0.2 }}>
                    <span style={{ display: "inline-block", transform: `translateY(${(1 - Math.min(1, p)) * 105}%)`, color: w === "ændre" ? C.sageDeep : undefined }}>{w}</span>
                  </span>
                );
              })}
            </div>
          )}
          {/* the request types */}
          {n > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, height: H, display: "flex", alignItems: "center", fontFamily: SANS, fontSize: TY, color: C.ink, letterSpacing: "-0.01em", whiteSpace: "pre" }}>
              {TYPED.slice(0, n)}
              <span style={{ display: "inline-block", width: 3, height: TY * 1.15, marginLeft: 3, background: C.sageDeep, opacity: n < TYPED.length || Math.floor((g - TY0) / 7) % 2 === 0 ? 1 : 0 }} />
            </div>
          )}
        </div>
        {/* send */}
        <div style={{ position: "relative", width: 100, height: 100, flex: "none" }}>
          {pulse > 0 && pulse < 1 && <div style={{ position: "absolute", left: 50 - (50 + 46 * pulse), top: 50 - (50 + 46 * pulse), width: (50 + 46 * pulse) * 2, height: (50 + 46 * pulse) * 2, borderRadius: "50%", border: `3px solid ${C.sage}`, opacity: 1 - pulse, boxSizing: "border-box" }} />}
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: `color-mix(in srgb, ${C.sage} ${on * 100}%, #DCD8D1)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.09 * pr})`, boxShadow: `0 ${10 * (1 - pr)}px 24px -12px rgba(73,93,88,${0.6 * on})` }}>
            <Ico n="arrow" s={50} c={C.white} w={2.6} style={{ transform: "rotate(-90deg)" }} />
          </div>
        </div>
      </Glass>
    </div>
  );
};

/* ---------- shot 11: the edit happening on the hero (site design px) ---------- */
const HeroFx: React.FC<{ g: number; F: FT }> = ({ g, F }) => {
  const sw = kf(g, F.cre + 1, 20, INOUT);
  const BK = { x: 148, y: 588 };
  return (
    <>
      {sw > 0 && sw < 1 && (
        <div style={{ position: "absolute", top: 40, left: mix(-560, 1500, sw), width: 420, height: 900, transform: "skewX(-16deg)",
          background: "linear-gradient(90deg, rgba(168,196,187,0), rgba(168,196,187,0.55), rgba(168,196,187,0))" }} />
      )}
      {(() => {
        const r = kf(g, F.ret, 20, OUT);
        if (r <= 0 || r >= 1) return null;
        const R = 40 + 170 * r;
        return <div style={{ position: "absolute", left: BK.x - R, top: BK.y - R, width: R * 2, height: R * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(135,168,158,0.5) 0%, rgba(168,196,187,0.35) 45%, rgba(168,196,187,0) 70%)`, opacity: 1 - r }} />;
      })()}
      {[0, 1].map((i) => {
        const r = kf(g, F.ret + 2 + i * 6, 22, OUT);
        if (r <= 0 || r >= 1) return null;
        const R = 50 + 180 * r;
        return <div key={i} style={{ position: "absolute", left: BK.x - R, top: BK.y - R, width: R * 2, height: R * 2, borderRadius: "50%", border: `${6 - 4 * r}px solid ${C.sage}`, opacity: (1 - r) * (i ? 0.6 : 1), boxSizing: "border-box" }} />;
      })}
    </>
  );
};
