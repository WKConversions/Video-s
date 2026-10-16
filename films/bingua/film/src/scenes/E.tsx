// Scene E (31.8–37.6 s): Bingua. Learn languages by scrolling. See ../../../plan/storyboard.md.
// Mirrors scene A: the next video scrolls up into place and becomes the navy logo tile, the mark builds and the
// wordmark slides out from behind it. The lockup rises to make room for the tagline, then the six languages and the
// "bingua.app · On the App Store" row arrive. A slow push and a last tap on the play mark keep the end card alive.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { measure } from "../kinetic";
import { ARRIVE, C, Chip, Feed, Ico, LANGS, MOVE, SANS, SNAP, Say, Tap, VideoCard, clamp01, f, k, mix } from "../shared";
import { Lockup } from "./A";

const LOGO = 200, WM = 150, GAP = 40; // the lockup's geometry (as in scene A)
const CW = 430, CH = 765, PITCH = CH + 36;

// a light rail like the app's on the incoming card
const Rail: React.FC<{ o: number }> = ({ o }) => (
  <div style={{ position: "absolute", right: 22, top: 300, display: "flex", flexDirection: "column", gap: 26, alignItems: "center", opacity: o }}>
    <Ico n="heart" s={38} c={C.white} w={2.6} />
    <Ico n="bookmark" s={36} c={C.white} w={2.6} />
  </div>
);

export const SceneE: React.FC<{ g: number }> = ({ g }) => {
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
  const gy = mix(540, 372, lift);
  const push = 1 + 0.035 * k(g, "w:bingua3-0.2", 5.2, (x) => 1 - (1 - x) * (1 - x));

  // rows under the tagline
  const chipAt = (i: number) => k(g, `w:scrolling2+${(0.3 + i * 0.07).toFixed(2)}`, 0.5, SNAP);
  const row2 = k(g, "w:scrolling2+0.85", 0.5, SNAP);
  const t = (g - f(31.8)) / 30;

  // a last tap on the play mark (the end card stays gently alive)
  const tap = k(g, 36.75, 0.7, (x) => x);
  const wmW = measure("Bingua", WM, 700, -0.035);
  const logoCX = 960 - (LOGO + GAP + wmW) / 2 + LOGO / 2;

  const cw = mix(CW, LOGO, m), ch = mix(CH, LOGO, m), cr = mix(28, LOGO * 0.222, m);

  return (
    <Feed g={g} in="s4">
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "960px 470px" }}>
        <Sequence from={f(31.8)} layout="none">
          {/* the next card in the feed, peeking below; it drops away as the logo forms */}
          {next < 1 && (
            <div style={{ position: "absolute", left: 960 - CW / 2, top: 540 + PITCH - CH / 2 + next * 140, opacity: 1 - next }}>
              <VideoCard clip="v6" w={CW} h={CH} from={1}><Rail o={1} /></VideoCard>
            </div>
          )}
          {/* the incoming video → the logo tile */}
          {!built && (
            <div style={{ position: "absolute", left: 960 - cw / 2, top: 540 - ch / 2 }}>
              <VideoCard clip="v4" w={cw} h={ch} r={cr} from={1.5}>
                <Rail o={1 - clamp01(m * 4)} />
                <div style={{ position: "absolute", inset: 0, background: C.navy, opacity: navy }} />
              </VideoCard>
            </div>
          )}
        </Sequence>

        {built && (
          <div style={{ position: "absolute", left: 960, top: gy }}>
            <Lockup play={play} bars={bars} slide={slide} tap={tap} />
          </div>
        )}
        <Tap x={logoCX + 6} y={gy - LOGO / 2 + 73} p={tap} size={84} />

        {/* the tagline */}
        <Say g={g} y={548} size={76} words={[
          { t: "Learn", at: "w:learn2" }, { t: "languages", at: "w:languages2" }, { t: "by", at: "w:by" }, { t: "scrolling.", at: "w:scrolling2", blue: true }]} />

        {/* the six languages */}
        <div style={{ position: "absolute", left: 0, top: 680, width: 1920, display: "flex", justifyContent: "center", gap: 14 }}>
          {LANGS.map((l, i) => {
            const p = chipAt(i);
            // a selection runs across the six languages once (the end card stays gently alive)
            const lit = clamp01(1 - Math.abs((t + 31.8 - 35.1) / 0.26 - i - 0.5) * 1.4);
            return (
              <div key={l.name} style={{ opacity: p, transform: `translateY(${(1 - p) * 18 - lit * 4}px) scale(${0.92 + 0.08 * p + 0.03 * lit})` }}>
                <Chip text={l.name} size={26} color={lit > 0.4 ? C.skyDeep : C.ink2} bg={lit > 0.4 ? C.skyTint : C.white} />
              </div>
            );
          })}
        </div>

        {/* where to get it */}
        <div style={{ position: "absolute", left: 0, top: 776, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 18,
          opacity: row2, transform: `translateY(${(1 - row2) * 18}px)` }}>
          <Chip text="bingua.app" icon="globe" size={28} color={C.skyDeep} />
          <div style={{ display: "inline-flex", alignItems: "center", padding: "12.6px 24px", borderRadius: 999, background: C.ink, color: C.white,
            fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: "-0.01em", whiteSpace: "nowrap", boxShadow: "0 14px 30px -16px rgba(15,26,41,0.4)" }}>
            On the App Store
          </div>
        </div>
      </AbsoluteFill>
    </Feed>
  );
};
