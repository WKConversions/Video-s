// Scene A — the hook: "One sentence. One finished video." The landing look (paper, the brand glow, the prompt box)
// types one sentence; on "One finished video" the send press opens the demo film out of the same card (a circle
// grows from the send button while the card stretches to 16:9), a play button pops, and on "video" it plays.
// The film then whips off to the left (the direction scene B arrives from), so s1 is the bare ground.
import React from "react";
import { C, DemoFilm, FONT, Glow, Ico, LIN, MOVE, POP, PromptBox, SHADOW_BIG, Say, clamp01, f, k, kf, mix, typed } from "../shared";

const BRIEF = "Make a launch video for Lumo.";
const BW = 1400, BS = BW / 900, BH = 154 * BS + 2;       // the prompt box (big: one sentence, readable) and its height
const FW = 1280, FH = 720;                               // the film card (16:9)
const SEND = { x: BW - 51 * BS, y: 111 * BS };           // the send button's centre inside the box
const easeIn = (t: number) => t * t * t;
const mmss = (s: number) => `00:${String(Math.floor(s)).padStart(2, "0")}`;

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  const end = f("s1");
  if (g >= end) return null;
  const a = k(g, "hook-0.12", 0.75);                          // the box arrives (already moving on frame 0)
  const out = kf(g, end - 11, 12, easeIn);                    // the film whips off to the left (a sliver still on frame s1-1)
  const push = 1 + 0.06 * clamp01(g / (end - 11));            // a slow camera push through the hook
  const m = k(g, "w:finished-0.03", 0.6, MOVE);              // the card stretches into the canvas
  const rv = k(g, "w:finished", 0.5, MOVE);                   // the film opens from the send button
  const press = Math.sin(Math.PI * k(g, "w:one2", 0.3, LIN));
  const text = typed(g, "w:sentence", BRIEF, 34);
  const W = mix(BW, FW, m), H = mix(BH, FH, m);
  const cy = mix(520, 600, m) + (1 - a) * 190;
  const playing = g >= f("w:video");
  const s = playing ? ((g - f("w:video")) / 30) * 3.0 : 0;       // a blank poster with a play button, then it plays
  const pb = k(g, "w:finished+0.12", 0.3, POP), pbOut = k(g, "w:video", 0.22);
  const tr = k(g, "w:video+0.05", 0.45);
  const bx = (W - BW) / 2, fy = (H - FH) / 2;          // the film spans the card's width while it narrows
  const glow = 0.7 * k(g, "hook", 0.9, MOVE) * (1 - kf(g, end - 16, 15, MOVE));
  return (
    <>
      <Glow g={g} a={glow} rise={0.12 * m} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "960px 540px" }}>
      <Say g={g} y={100} size={84} out="s1-0.42" words={[
        { t: "One", at: "w:one" }, { t: "sentence.", at: "w:sentence" },
        { t: "One", at: "w:one2" }, { t: "finished", at: "w:finished" }, { t: "video.", at: "w:video", grad: true },
      ]} />
      <div style={{ position: "absolute", left: 960 - W / 2, top: cy - H / 2, width: W, height: H, borderRadius: mix(26 * BS, 24, m), overflow: "hidden",
        background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, opacity: clamp01(a * 2.2),
        transform: `translateX(${-out * 2300}px) scale(${(0.94 + 0.06 * a) * (1 - 0.3 * out)})` }}>
        <PromptBox w={BW} text={text} g={g} caret={rv < 0.2} press={press}
          style={{ position: "absolute", left: bx, top: 0, border: "none", boxShadow: "none", background: "transparent", opacity: 1 - clamp01((m - 0.35) * 3) }} />
        {rv > 0 && (
          <div style={{ position: "absolute", left: 0, top: fy, width: W, height: FH, clipPath: `circle(${rv * 1420}px at ${bx + SEND.x}px ${SEND.y - fy}px)` }}>
            <DemoFilm s={s} w={W} h={FH} />
            {pb > 0 && pbOut < 1 && (
              <div style={{ position: "absolute", left: W / 2 - 66, top: FH / 2 - 66, width: 132, height: 132, borderRadius: "50%", background: C.white,
                display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px -16px rgba(10,14,60,0.55)",
                transform: `scale(${pb * (1 + 0.5 * pbOut)})`, opacity: 1 - pbOut }}>
                <Ico n="play" s={58} c={C.ink} fill={C.ink} w={2} style={{ marginLeft: 8 }} />
              </div>
            )}
            {tr > 0 && (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "linear-gradient(rgba(10,14,60,0), rgba(10,14,60,0.5))",
                opacity: tr, transform: `translateY(${(1 - tr) * 40}px)` }}>
                <div style={{ position: "absolute", left: 32, right: 32, bottom: 26, height: 40, display: "flex", alignItems: "center", gap: 20, fontFamily: FONT, color: C.white }}>
                  <Ico n="pause" s={26} c={C.white} w={3} />
                  <div style={{ fontSize: 22, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{mmss(s)} / 00:25</div>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.3)", position: "relative" }}>
                    <div style={{ width: `${(s / 25) * 100}%`, height: "100%", borderRadius: 3, background: C.white }} />
                    <div style={{ position: "absolute", left: `${(s / 25) * 100}%`, top: -6, width: 18, height: 18, marginLeft: -9, borderRadius: "50%", background: C.white }} />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 500 }}>16:9</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </>
  );
};
