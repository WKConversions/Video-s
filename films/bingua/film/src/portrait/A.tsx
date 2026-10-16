// Portrait (1080×1920) version of scene A (0–3.8 s): Turn scrolling into learning. / Meet Bingua.
// Re-laid out from ../scenes/A.tsx (see ../../../plan/portrait.md); content, animation and timing are unchanged.
// The statement builds at the top, left-aligned; below it a vertical feed of real videos (a centred column, masked
// under the statement) is flicked up on "turn" and "scrolling". On "learning" the playing card shows a caption and one
// word pops out as a translation chip. Then the card shrinks and becomes the navy logo tile (the video becomes the
// logo), the mark builds and the wordmark slides out from behind it.
import React from "react";
import { AbsoluteFill } from "remotion";
import { measure } from "../kinetic";
import { ARRIVE, C, CARD, Feed, Ico, Logo, MOVE, SANS, SNAP, Say, VideoCard, Wordmark, clamp01, f, k, mix } from "../shared";

/* ---------- the logo lockup, shared shape with portrait scene E ---------- */
export const LOGO = 220, WM = 165, GAP = 44;
export const LY = 940; // where the logo forms (frame centre, nudged into the safe area)
export const Lockup: React.FC<{ play: number; bars: number; slide: number; tap?: number }> = ({ play, bars, slide, tap = 0 }) => {
  const wmW = measure("Bingua", WM, 700, -0.035);
  const total = LOGO + GAP + wmW;
  // the logo starts centred alone; as the wordmark slides out from behind it, the pair re-centres
  const shift = (1 - slide) * (total - LOGO) / 2;
  const press = tap > 0 && tap < 1 ? Math.sin(tap * Math.PI) : 0;
  return (
    <div style={{ position: "absolute", left: -total / 2 + shift, top: -LOGO / 2, width: total, height: LOGO }}>
      {/* the wordmark, clipped at the logo's centre so it emerges from behind the tile */}
      <div style={{ position: "absolute", left: LOGO / 2, top: 0, width: total - LOGO / 2 + 40, height: LOGO, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: LOGO / 2 + GAP, top: (LOGO - WM) / 2 - WM * 0.02, opacity: clamp01(slide * 3),
          transform: `translateX(${-(1 - slide) * (LOGO / 2 + GAP + wmW)}px)` }}>
          <Wordmark size={WM} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: LOGO, height: LOGO, borderRadius: LOGO * 0.222, boxShadow: "0 30px 60px -28px rgba(15,26,41,0.45)",
        transform: `scale(${1 - 0.05 * press})` }}>
        <Logo s={LOGO} play={play} bars={bars} />
      </div>
    </div>
  );
};

/* ---------- the feed: a centred column under the statement ---------- */
const CW = 540, CH = 960, PITCH = CH + 40, CX = 540, CY = 1100;
const FEED = [{ clip: "v2", from: 2 }, { clip: "v5", from: 1 }, { clip: "v1", from: 0.5 }, { clip: "v6", from: 1 }];
const CUR = 2; // the card that plays the caption and becomes the logo
const MASK_TOP = 532; // cards scrolling up fade out under the statement (they never cross it)

// A small white rail like the app's (heart, bookmark) on each feed card.
const Rail: React.FC = () => (
  <div style={{ position: "absolute", right: 24, top: 360, display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
    <Ico n="heart" s={44} c={C.white} w={2.6} />
    <Ico n="bookmark" s={42} c={C.white} w={2.6} />
  </div>
);

// A thumb flick beside the feed: a touch dot rises and leaves a fading capsule trail. p 0..1 over the flick.
const Flick: React.FC<{ p: number; x: number }> = ({ p, x }) => {
  if (p <= 0 || p >= 1) return null;
  const travel = clamp01(p / 0.6), fade = clamp01((p - 0.45) / 0.55);
  const y0 = CY + 290, y1 = CY - 270, D = 54;
  const y = mix(y0, y1, ARRIVE(travel));
  const tail = mix(y0, y, clamp01(fade * 1.4));
  return (
    <div style={{ position: "absolute", left: x - D / 2, top: 0, opacity: 1 - fade }}>
      <div style={{ position: "absolute", left: 0, top: y - D / 2, width: D, height: Math.max(D, tail - y + D), borderRadius: D, background: C.sky, opacity: 0.16 }} />
      <div style={{ position: "absolute", left: 0, top: y - D / 2, width: D, height: D, borderRadius: "50%", background: "rgba(15,26,41,0.16)",
        boxShadow: `0 0 0 3px ${C.sky}` }} />
    </div>
  );
};

const PILL = 34; // caption text size

export const SceneAP: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(0) || g > f(3.8)) return null;

  // the feed: the film opens mid-flick (card 0 → 1 lands on "turn"), then a second flick on "scrolling" lands card 2
  const off = 0.3 + 0.7 * k(g, 0, 0.32, ARRIVE) + k(g, "w:scrolling", 0.55, ARRIVE);
  // the caption pill and the word chip on "learning"
  const pill = k(g, "w:learning-0.2", 0.35, SNAP);
  const lit = k(g, "w:learning", 0.2, SNAP);
  const chip = k(g, "w:learning+0.12", 0.45, SNAP);
  const uiOut = k(g, 1.82, 0.22, MOVE);
  // the morph: the playing card shrinks into the navy logo tile at the centre
  const m = k(g, 1.9, 0.55, MOVE);
  const navy = clamp01((m - 0.15) / 0.6);
  const others = clamp01(k(g, 1.82, 0.35, MOVE));
  // the lockup
  const built = m >= 1;
  const play = k(g, "w:meet", 0.35, SNAP);
  const bars = k(g, "w:meet+0.12", 0.5, ARRIVE);
  const slide = k(g, "w:bingua+0.04", 0.62, ARRIVE);
  const push = 1 + 0.05 * k(g, "w:meet-0.1", 1.4, ARRIVE);

  const cw = mix(CW, LOGO, m), ch = mix(CH, LOGO, m), cr = mix(28, LOGO * 0.222, m);
  const mask = `linear-gradient(to bottom, transparent ${MASK_TOP}px, #000 ${MASK_TOP + 80}px)`;

  return (
    <Feed g={g} out="s1" h={1920}>
      <AbsoluteFill>
        {/* the statement */}
        <Say g={g} x={60} y={262} size={120} align="left" width={960} out="w:learning+0.49" words={[{ t: "Turn", at: "w:turn" }, { t: "scrolling", at: "w:scrolling" }]} />
        <Say g={g} x={60} y={392} size={120} align="left" width={960} out="w:learning+0.49" words={[{ t: "into", at: "w:into" }, { t: "learning.", at: "w:learning", blue: true }]} />

        {/* the other feed cards: they make way as the playing card becomes the logo */}
        <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
          {FEED.map((c, i) => {
            if (i === CUR) return null;
            const y = CY + (i - off) * PITCH + (i < CUR ? -1 : 1) * 80 * others;
            if (y < -CH / 2 - 10 || y > 1920 + CH / 2 + 10 || others >= 1) return null;
            return (
              <div key={i} style={{ position: "absolute", left: CX - CW / 2, top: y - CH / 2, opacity: 1 - others }}>
                <VideoCard clip={c.clip} w={CW} h={CH} from={c.from}><Rail /></VideoCard>
              </div>
            );
          })}
        </AbsoluteFill>

        {/* the playing card → the logo tile (it only ever rises to its place, so it stays clear of the statement) */}
        {!built && (() => {
          const y = mix(CY + (CUR - off) * PITCH, LY, m);
          return (
            <div style={{ position: "absolute", left: CX - cw / 2, top: y - ch / 2 }}>
              <VideoCard clip={FEED[CUR].clip} w={cw} h={ch} r={cr} from={FEED[CUR].from}>
                <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01(m * 4) }}><Rail /></div>
                {/* the caption */}
                {pill > 0 && uiOut < 1 && (
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, display: "flex", justifyContent: "center", opacity: pill * (1 - uiOut) }}>
                    <div style={{ background: C.white, borderRadius: 999, padding: "14px 22px", fontFamily: SANS, fontWeight: 700, fontSize: PILL, letterSpacing: "-0.015em",
                      color: C.ink, whiteSpace: "nowrap", transform: `translateY(${(1 - pill) * 16}px) scale(${0.92 + 0.08 * pill})`, boxShadow: "0 12px 26px -14px rgba(15,26,41,0.5)" }}>
                      ¿Qué está{" "}
                      <span style={{ background: `rgba(47,175,238,${lit})`, color: lit > 0.5 ? C.white : C.ink, borderRadius: 9, padding: "1px 8px", margin: "0 1px" }}>ocurriendo</span>?
                    </div>
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0, background: C.navy, opacity: navy }} />
              </VideoCard>
            </div>
          );
        })()}

        {/* the word pops out of the caption as a translation chip */}
        {chip > 0 && uiOut < 1 && (
          <div style={{ position: "absolute", left: mix(CX + 70, CX, chip), top: mix(CY + CH / 2 - 76, CY + CH / 2 - 236, chip), opacity: clamp01(chip * 2.5) * (1 - uiOut),
            transform: `translate(-50%, -50%) scale(${0.55 + 0.45 * chip})` }}>
            <div style={{ ...CARD, borderRadius: 26, display: "flex", alignItems: "center", gap: 18, padding: "22px 34px", whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 700, fontSize: 48, letterSpacing: "-0.02em" }}>
              <span style={{ color: C.ink }}>ocurriendo</span>
              <Ico n="arrow" s={42} c={C.sky} w={3} />
              <span style={{ color: C.sky }}>happening</span>
            </div>
          </div>
        )}

        {/* thumb flicks beside the feed */}
        <Flick p={0.3 + 0.7 * k(g, 0, 0.5, (t) => t)} x={CX + CW / 2 + 82} />
        <Flick p={k(g, "w:scrolling-0.03", 0.62, (t) => t)} x={CX + CW / 2 + 82} />

        {/* Meet Bingua */}
        {built && (
          <div style={{ position: "absolute", left: 540, top: LY, transform: `scale(${push})` }}>
            <Lockup play={play} bars={bars} slide={slide} />
          </div>
        )}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, transform: `scale(${push})`, transformOrigin: `540px ${LY}px` }}>
          <Say g={g} y={LY - LOGO / 2 - 118} size={56} weight={600} color={C.gray} width={1080} words={[{ t: "Meet", at: "w:meet-0.05" }]} />
        </div>
      </AbsoluteFill>
    </Feed>
  );
};
