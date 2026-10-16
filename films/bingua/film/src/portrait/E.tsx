// Portrait (1080×1920) version of scene E (31.8–37.6 s): Bingua. Learn languages by scrolling.
// Re-laid out from ../scenes/E.tsx (see ../../../plan/portrait.md); content, animation and timing are unchanged.
// Mirrors portrait scene A: the next video scrolls up into place and becomes the navy logo tile, the mark builds and
// the wordmark slides out from behind it. The lockup rises to make room for the two-line tagline, then the six
// languages (two rows of three) and the "bingua.app · On the App Store" row arrive. A slow push and a last tap on the
// play mark keep the end card alive.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { measure } from "../kinetic";
import { ARRIVE, C, Chip, Feed, Ico, LANGS, MOVE, SANS, SNAP, Say, Tap, VideoCard, clamp01, f, k, mix } from "../shared";
import { GAP, LOGO, LY, Lockup, WM } from "./A";

const CW = 540, CH = 960, PITCH = CH + 40; // as the feed cards in portrait scene A

// the end card's vertical stack (centred in the safe area)
const GY1 = 625;                 // the lockup's centre once it has risen
const TAG1 = GY1 + LOGO / 2 + 64; // tagline, line 1 top
const TAG = 100, TAGLH = TAG * 1.08;
const CHIPS = TAG1 + 2 * TAGLH + 58; // language rows top
const CHIP = 38, CHIPROW = 90;
const ROW2 = CHIPS + 2 * CHIPROW + 34;

// a light rail like the app's on the incoming card
const Rail: React.FC<{ o: number }> = ({ o }) => (
  <div style={{ position: "absolute", right: 24, top: 360, display: "flex", flexDirection: "column", gap: 30, alignItems: "center", opacity: o }}>
    <Ico n="heart" s={44} c={C.white} w={2.6} />
    <Ico n="bookmark" s={42} c={C.white} w={2.6} />
  </div>
);

export const SceneEP: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(31.8) || g > f(37.6)) return null;

  // the incoming video becomes the logo tile on "Bingua"
  const m = k(g, "w:bingua3-0.42", 0.47, MOVE);
  const navy = clamp01((m - 0.15) / 0.6);
  const built = m >= 1;
  const play = k(g, "w:bingua3+0.02", 0.35, SNAP);
  const bars = k(g, "w:bingua3+0.12", 0.5, ARRIVE);
  const slide = k(g, "w:bingua3+0.1", 0.62, ARRIVE);
  const next = k(g, "w:bingua3-0.5", 0.35, MOVE); // the next card below makes way

  // the lockup rises to make room for the tagline
  const lift = k(g, "w:learn2-0.5", 0.72, MOVE);
  const gy = mix(LY, GY1, lift);
  const push = 1 + 0.035 * k(g, "w:bingua3-0.2", 5.2, (x) => 1 - (1 - x) * (1 - x));

  // rows under the tagline
  const chipAt = (i: number) => k(g, `w:scrolling2+${(0.3 + i * 0.07).toFixed(2)}`, 0.5, SNAP);
  const row2 = k(g, "w:scrolling2+0.85", 0.5, SNAP);
  const t = (g - f(31.8)) / 30;

  // a last tap on the play mark (the end card stays gently alive)
  const tap = k(g, 36.75, 0.7, (x) => x);
  const wmW = measure("Bingua", WM, 700, -0.035);
  const logoCX = 540 - (LOGO + GAP + wmW) / 2 + LOGO / 2;

  const cw = mix(CW, LOGO, m), ch = mix(CH, LOGO, m), cr = mix(28, LOGO * 0.222, m);

  const lang = (i: number) => {
    const l = LANGS[i];
    const p = chipAt(i);
    // a selection runs across the six languages once (the end card stays gently alive)
    const lit = clamp01(1 - Math.abs((t + 31.8 - 35.1) / 0.26 - i - 0.5) * 1.4);
    return (
      <div key={l.name} style={{ opacity: p, transform: `translateY(${(1 - p) * 22 - lit * 5}px) scale(${0.92 + 0.08 * p + 0.03 * lit})` }}>
        <Chip text={l.name} size={CHIP} color={lit > 0.4 ? C.skyDeep : C.ink2} bg={lit > 0.4 ? C.skyTint : C.white} />
      </div>
    );
  };
  const rowStyle: React.CSSProperties = { position: "absolute", left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 18 };

  return (
    <Feed g={g} in="s4" h={1920}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "540px 900px" }}>
        <Sequence from={f(31.8)} layout="none">
          {/* the next card in the feed, peeking below; it drops away as the logo forms */}
          {next < 1 && (
            <div style={{ position: "absolute", left: 540 - CW / 2, top: LY + PITCH - CH / 2 + next * 160, opacity: 1 - next }}>
              <VideoCard clip="v6" w={CW} h={CH} from={1}><Rail o={1} /></VideoCard>
            </div>
          )}
          {/* the incoming video → the logo tile */}
          {!built && (
            <div style={{ position: "absolute", left: 540 - cw / 2, top: LY - ch / 2 }}>
              <VideoCard clip="v4" w={cw} h={ch} r={cr} from={1.5}>
                <Rail o={1 - clamp01(m * 4)} />
                <div style={{ position: "absolute", inset: 0, background: C.navy, opacity: navy }} />
              </VideoCard>
            </div>
          )}
        </Sequence>

        {built && (
          <div style={{ position: "absolute", left: 540, top: gy }}>
            <Lockup play={play} bars={bars} slide={slide} tap={tap} />
          </div>
        )}
        <Tap x={logoCX + 6 * LOGO / 200} y={gy - LOGO / 2 + 73 * LOGO / 200} p={tap} size={96} />

        {/* the tagline, two lines */}
        <Say g={g} y={TAG1} size={TAG} width={1080} words={[{ t: "Learn", at: "w:learn2" }, { t: "languages", at: "w:languages2" }]} />
        <Say g={g} y={TAG1 + TAGLH} size={TAG} width={1080} words={[{ t: "by", at: "w:by" }, { t: "scrolling.", at: "w:scrolling2", blue: true }]} />

        {/* the six languages, two rows of three */}
        <div style={{ ...rowStyle, top: CHIPS }}>{[0, 1, 2].map(lang)}</div>
        <div style={{ ...rowStyle, top: CHIPS + CHIPROW }}>{[3, 4, 5].map(lang)}</div>

        {/* where to get it */}
        <div style={{ ...rowStyle, top: ROW2, alignItems: "center", gap: 20, opacity: row2, transform: `translateY(${(1 - row2) * 22}px)` }}>
          <Chip text="bingua.app" icon="globe" size={40} color={C.skyDeep} />
          <div style={{ display: "inline-flex", alignItems: "center", padding: "18px 32px", borderRadius: 999, background: C.ink, color: C.white,
            fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: "-0.01em", whiteSpace: "nowrap", boxShadow: "0 14px 30px -16px rgba(15,26,41,0.4)" }}>
            On the App Store
          </div>
        </div>
      </AbsoluteFill>
    </Feed>
  );
};
