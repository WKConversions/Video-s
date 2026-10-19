// Scene H — CTA: "Make it Moviqly. Get started today." The world of films flies out of frame and the glow settles
// into the landing page's exact glow; the landing builds in its place, centred: the Moviqly logo, the headline "Make it
// Moviqly" on the words ("Moviqly" in the brand gradient), the prompt box with its placeholder, and a black "Get
// started" button that pops in and a cursor clicks on "get started" (a ripple and a glow surge answer). On the music's
// last hit (w:today+1.08) the glow swells and a soft halo breathes out of the button; then a calm hold to the end.
import React from "react";
import { ARRIVE, BlackButton, C, Cursor, Glow, LIN, Logo, MOVE, POP, PromptBox, SNAP, Say, clamp01, f, k, kf, mix } from "../shared";
import { OutroWorld, outroGlow } from "./G";

// the landing stack (centred): logo, headline, prompt box, button
const LOGO_Y = 190, HEAD_Y = 288, BOX_Y = 498, BTN_Y = 728;
const BTN = { w: 226, h: 76 };                     // BlackButton size 30 ("Get started"), measured from a still
const BX = 960, BY = BTN_Y + BTN.h / 2;

export const SceneH: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sH")) return null;
  const sH = f("sH"), get = f("w:get2"), started = f("w:started"), today = f("w:today"), hit = f("w:today+1.08");

  // glow: settles into the landing glow, surges on the click, swells on the last hit
  const swing = (at: number, up: number, down: number) => kf(g, at, up, MOVE) * (1 - kf(g, at + up, down, MOVE));
  const gl = outroGlow(g), surge = swing(started + 1, 10, 30), swell = swing(hit - 8, 8, 44);
  const rise = gl.rise + 0.16 * surge + 0.26 * swell;

  // the lockup settles in (a slow pull from 1.05) and breathes once on the hit
  const settle = k(g, "sH", 2.8, MOVE), cam = mix(1.05, 1, settle) + 0.012 * swell;
  const logoIn = k(g, "sH+0.15", 0.8), logoP = clamp01((g - sH - 5) / 28);
  const box = k(g, "w:moviqly3+0.12", 0.7);
  const btn = kf(g, get - 18, 12, POP);
  const press = kf(g, get - 3, 3, SNAP) * (1 - kf(g, started + 2, 6, SNAP));

  // the cursor: glides in from the bottom right, clicks, drifts away
  const cin = kf(g, get - 22, 19, ARRIVE), cout = kf(g, today + 2, 34, MOVE);
  const cx = mix(1500, BX + 26, cin) + 220 * cout, cy = mix(1140, BY + 12, cin) + 150 * cout;
  const co = 1 - kf(g, today + 20, 16, LIN);

  // answers to the click (ripples on the button, then two gradient waves out into the world) and to the hit (a soft halo)
  const ripples = [0, 6].map((d) => kf(g, started + 1 + d, 24, ARRIVE));
  const waves = [0, 9].map((d) => kf(g, started + 2 + d, 40, (t) => 1 - Math.pow(1 - t, 1.5)));
  const halo = kf(g, hit - 2, 36, ARRIVE);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Glow g={g} a={gl.a} rise={rise} />
      {halo > 0 && halo < 1 && <div style={{ position: "absolute", left: BX - 60 - 760 * halo, top: BY - 60 - 760 * halo, width: 120 + 1520 * halo, height: 120 + 1520 * halo, borderRadius: "50%",
        opacity: 0.55 * (1 - halo), background: "radial-gradient(circle, rgba(250,249,247,0) 30%, rgba(152,42,255,0.35) 52%, rgba(48,71,255,0.25) 62%, rgba(16,219,237,0) 71%)" }} />}
      <OutroWorld g={g} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs><linearGradient id="gCtaWave" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor={C.purple} /><stop offset="0.55" stopColor={C.blue} /><stop offset="1" stopColor={C.cyan} /></linearGradient></defs>
        {waves.map((w, i) => w > 0 && w < 1 && <circle key={i} cx={BX} cy={BY} r={60 + 1300 * w} fill="none" stroke="url(#gCtaWave)" strokeWidth={14 * (1 - w) + 3} opacity={0.62 * Math.pow(1 - w, 0.7)} />)}
      </svg>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, transformOrigin: `${BX}px 500px` }}>
        <div style={{ position: "absolute", left: 0, top: LOGO_Y, width: 1920, display: "flex", justifyContent: "center", transform: `translateY(${(1 - logoIn) * -36}px)` }}>
          <Logo h={66} p={logoP} />
        </div>
        <Say g={g} y={HEAD_Y} size={136} words={[{ t: "Make", at: "w:make2" }, { t: "it", at: "w:it2" }, { t: "Moviqly", at: "w:moviqly3", grad: true }]} />
        {box > 0 && <PromptBox w={1000} style={{ position: "absolute", left: 460, top: BOX_Y, opacity: Math.min(1, box * 1.6), transform: `translateY(${(1 - box) * 90}px) scale(${mix(0.94, 1, box)})` }} />}
        {ripples.map((r, i) => r > 0 && r < 1 && <div key={i} style={{ position: "absolute", left: BX - BTN.w / 2, top: BTN_Y, width: BTN.w, height: BTN.h, borderRadius: 17, boxSizing: "border-box",
          border: `3px solid ${C.violet}`, opacity: 0.7 * (1 - r), transform: `scale(${1 + 0.9 * r}, ${1 + 1.6 * r})` }} />)}
        {btn > 0 && <div style={{ position: "absolute", left: 0, top: BTN_Y, width: 1920, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 2), transform: `scale(${mix(0.4, 1, btn)})`, transformOrigin: `${BX}px ${BTN.h / 2}px` }}>
          <BlackButton text="Get started" size={30} press={press} />
        </div>}
      </div>
      {cin > 0 && co > 0 && <Cursor x={cx} y={cy} press={press} o={co} />}
    </div>
  );
};
