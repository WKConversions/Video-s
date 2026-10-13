// 23–34 s, after the reference's frames at 30 fps: the prompt pill slides in inside its glowing halo, types the ask with
// the camera tracking the caret, pulls back for the click on send; a sheen wipes the text, the pill squashes to a bar,
// holds, and opens into Creoble's builder, which answers its questions and builds the flower shop's site. One camera then
// pushes into the prompt box ("Ret farverne…"), pulls back to the tilted builder while the site takes the brand's colours,
// and swings it away.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, MOVE, SOFT, clamp01, expoOut, lerp, path, pr, press, px } from "./lib";
import { Caret, Cursor, Grain, Icon, tw } from "./kit";
import { Builder, PROMPT, Step, WH, WW } from "./ui";

/** The halo the reference puts round its prompt and its editor: apricot at the edge, coral, then sage-teal far out. */
export const Halo: React.FC<{ x: number; y: number; w: number; h: number; r: number; k?: number; spread?: number }> = ({ x, y, w, h, r, k = 1, spread = 1 }) => {
  const L = (pad: number, color: string, blur: number, op: number) => (
    <div style={{ position: "absolute", left: x - w / 2 - pad, top: y - h / 2 - pad, width: w + pad * 2, height: h + pad * 2, borderRadius: r + pad, background: color, filter: `blur(${blur}px)`, opacity: op * k }} />
  );
  return (
    <>
      {L(250 * spread, C.gTeal, 90 * spread, 0.85)}
      {L(170 * spread, C.gSage, 70 * spread, 0.55)}
      {L(110 * spread, C.gCoral, 55 * spread, 0.95)}
      {L(45 * spread, C.gTerra, 30 * spread, 1)}
      {L(12 * spread, C.gApricot, 16 * spread, 0.85)}
    </>
  );
};

// ---- 23–26.43 s: the prompt pill -----------------------------------------------------------------------------------------
const ASK = "Lav en hjemmeside til blomsterbutikken";
const PW = 980, PH = 205, FS = 34, TX = 960 - PW / 2 + 70;              // the pill in world units; its text starts at TX
export const B1: React.FC<{ g: number }> = ({ g }) => {
  const n = Math.max(0, Math.min(ASK.length, Math.floor((g - 700) * 26 / 30)));
  // camera: the pill slides in from the right, the frame follows the caret, then pulls back for the click. The follow
  // tracks the typing's average pace through a smooth max, so it eases in and never steps with a letter; the pull-back
  // eases in from rest (SOFT; the exponential started at 10.6 % a frame) and lands at rest on 760, where the drift takes over
  const Zc = 2.3, pace = measure(ASK) / ASK.length;
  const cam = (q: number) => {
    const a = lerp(579, 712, px(q, 690, 13, 0.82)), b = TX + pace * Math.max(0, (q - 700) * 26 / 30) - (1750 - 960) / Zc;
    const fxClose = (a + b + Math.hypot(a - b, 40)) / 2, out = pr(q, 744, 16, SOFT);
    return { Z: lerp(Zc, 1, out) * lerp(1, 0.9, pr(q, 760, 33, SOFT)), fx: lerp(fxClose, 960, out) };
  };
  const { Z, fx } = cam(g), fy = 540, p = cam(g - 1);
  // no camera motion blur in this film: blur the camera layer by how far the frame's corners travel this frame
  const flow = (x: number, y: number) => Math.hypot(x - ((x - 960) / Z + fx - p.fx) * p.Z - 960, (y - 540) * (1 - p.Z / Z));
  const mb = Math.min(6, Math.max(0, (flow(0, 0) + flow(1920, 0) + flow(0, 1080) + flow(1920, 1080)) / 4 - 25) * 0.025);
  const sx = (wx: number) => (wx - fx) * Z + 960, sy = (wy: number) => (wy - fy) * Z + 540;
  // the sheen wipe, the squash to a bar (eased over 10 f: in 5 f of MOVE its ends jumped 90 px a frame), the hold
  const wipe = pr(g, 763, 8, SOFT), squash = pr(g, 776, 10, SOFT);
  const pw = lerp(PW, 600, squash), ph = lerp(PH, 96, squash);
  const sendX = 960 + pw / 2 - 26 - 55;
  const cur = path(g, [{ f: 744, x: 1580, y: 940 }, { f: 756, x: sx(sendX + 6), y: sy(546) }, { f: 776, x: sx(sendX + 6), y: sy(548) }, { f: 784, x: sx(960 + pw / 2 - 10), y: sy(552) }, { f: 793, x: sx(960 + pw / 2 - 8), y: sy(552) }]);
  const pk = press(g, 758);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${960 - fx * Z}px, ${540 - fy * Z}px) scale(${Z})`, transformOrigin: "0 0", filter: mb > 0.05 ? `blur(${mb / Z}px)` : undefined }}>
        <Halo x={960} y={540} w={lerp(PW, 760, squash)} h={lerp(PH, 150, squash)} r={lerp(PH, 150, squash) / 2} />
        <div style={{ position: "absolute", left: 960 - pw / 2, top: 540 - ph / 2, width: pw, height: ph, borderRadius: ph / 2, background: "#060908", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.07)",
          transform: `scale(${1 - 0.012 * pk})`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 70, top: 0, height: ph, display: "flex", alignItems: "center", fontFamily: F.ui, fontSize: FS, color: n ? "#F4F2EE" : "#7D8581", whiteSpace: "pre",
            opacity: 1 - squash, WebkitMaskImage: wipe > 0 ? `linear-gradient(90deg, transparent ${wipe * 110 - 10}%, black ${wipe * 110}%)` : undefined }}>
            {!n && g < 700 && <Caret g={g} h={FS + 6} color="#F4F2EE" />}
            {n ? ASK.slice(0, n) : "Beskriv din drømmehjemmeside …"}{n > 0 && g < 760 && <Caret g={g} h={FS + 6} color="#F4F2EE" on />}
          </div>
          {/* smeared back over this frame's travel (up to 250 px a frame) so it sweeps instead of strobing; faded at both ends */}
          {wipe > 0 && wipe < 1 && (() => { const v = (pw - 140) * (wipe - pr(g - 1, 763, 8, SOFT)); return <div style={{ position: "absolute", top: 0, bottom: 0, left: 70 + (pw - 140) * wipe - 60 - v, width: 120 + v, opacity: Math.min(1, wipe * 6, (1 - wipe) * 6), background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,246,236,0.55), rgba(255,255,255,0))", filter: `blur(${6 + v * 0.08}px)` }} />; })()}
          <div style={{ position: "absolute", right: 26, top: ph / 2 - 55, width: 110, height: 110, borderRadius: 55, background: n > 3 ? `linear-gradient(135deg, ${C.gSage}, ${C.gTeal})` : "#2A3330",
            display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - squash * 1.5, transform: `scale(${1 - 0.14 * pk})` }}><Icon name="arrowUp" size={52} color="#fff" stroke={2.6} /></div>
        </div>
      </div>
      <Grain opacity={0.12} seed={21} />
      {/* fades in over 4 f as it enters (it used to appear whole, mid-frame, on 744); vy for its motion blur */}
      {g >= 744 && <Cursor x={cur.x} y={cur.y} vx={cur.vx} vy={cur.vy} h={110} press={pk} opacity={clamp01((g - 743) / 4)} />}
    </AbsoluteFill>
  );
};
const measure = (t: string) => tw(t, FS, 400, F.ui);

// ---- 26.43–27.8 s: the bar opens into the builder, which builds the site -----------------------------------------------------
export const STEPS = (g: number, a: number): Step[] => [
  { t: "Virksomhed", a: "Blomsterhuset Rosa" }, { t: "Branche", a: "Blomsterbutik" }, { t: "Ydelser", a: "Buketter · Bryllup · Levering" },
  { t: "Kontakt", a: "København · 33 12 45 67" }, { t: "Design", a: "Lyst og romantisk" }, { t: "Billeder", a: "Butikken og buketterne" },
].map((s, i) => ({ ...s, k: pr(g, a + i * 5, 7) }));
export const Building: React.FC<{ g: number; a: number }> = ({ g, a }) => {
  const p = clamp01((g - a) / 40);
  return (
    <div style={{ padding: "14px 16px", borderRadius: 14, background: "#fff", border: `1px solid ${C.line}`, fontFamily: F.ui }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: C.sageDeep }}><Icon name="spark" size={18} color={C.sageDeep} />{p < 1 ? "Bygger din hjemmeside…" : "Din hjemmeside er klar"}</div>
      <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: C.sageTint }}><div style={{ width: `${p * 100}%`, height: 6, borderRadius: 3, background: C.sage }} /></div>
    </div>
  );
};
const S_WIDE = 0.74;
export const B2: React.FC<{ g: number }> = ({ g }) => {
  const e = expoOut(12, 0.82)(clamp01((g - 793) / 12));
  const s = lerp(0.62, S_WIDE, e) * lerp(1, 1.02, pr(g, 805, 29, SOFT));
  const w = lerp(600, WW * s, e), h = lerp(96, WH * s, e), r = lerp(48, 22 * s, e);
  const cover = Math.max(w / WW, h / WH);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <Halo x={960} y={540} w={Math.max(w, 760 * (1 - e) + w * e)} h={Math.max(h, 150 * (1 - e) + h * e)} r={r} spread={lerp(0.8, 1.15, e)} />
      <div style={{ position: "absolute", left: 960 - w / 2, top: 540 - h / 2, width: w, height: h, borderRadius: r, overflow: "hidden", background: C.cream }}>
        <div style={{ position: "absolute", left: w / 2 - (WW * cover) / 2, top: h / 2 - (WH * cover) / 2, transform: `scale(${cover})`, transformOrigin: "0 0" }}>
          <Builder g={g} build={clamp01((g - 800) / 34)} brand={0} from={800} steps={STEPS(g, 798)} status={<Building g={g} a={800} />} />
        </div>
      </div>
      <Grain opacity={0.12} seed={22} />
    </AbsoluteFill>
  );
};

// ---- 27.8–33.93 s: one camera: push into the prompt box, the second ask, pull back to the tilted builder, recolour, swing away ----
const ASK2 = "Ret farverne så de passer til mit brand og min virksomhed";
type Cam = { s: number; cx: number; cy: number; rx: number; ry: number; spread: number };
const WIDE: Cam = { s: S_WIDE * 1.02, cx: 960, cy: 540, rx: 0, ry: 0, spread: 1.15 };
const S3 = 2.1, PB = { x: PROMPT.x + PROMPT.w / 2, y: PROMPT.y + PROMPT.h / 2 };
const CLOSE: Cam = { s: S3, cx: 640 - (PB.x - WW / 2) * S3, cy: 690 - (PB.y - WH / 2) * S3, rx: 5, ry: -7, spread: 1.5 };
const TILT: Cam = { s: 0.86, cx: 960, cy: 560, rx: 12, ry: -20, spread: 1.25 };
const SETTLE: Cam = { s: 0.9, cx: 960, cy: 560, rx: 7, ry: -11, spread: 1.25 };
const AWAY: Cam = { s: 0.62, cx: 1010, cy: 560, rx: 6, ry: -34, spread: 1.0 };
const mixCam = (a: Cam, b: Cam, t: number): Cam => ({ s: lerp(a.s, b.s, t), cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), rx: lerp(a.rx, b.rx, t), ry: lerp(a.ry, b.ry, t), spread: lerp(a.spread, b.spread, t) });
const camAt = (g: number): Cam => {
  if (g < 845) return mixCam(WIDE, CLOSE, pr(g, 834, 11, MOVE));
  if (g < 936) { const c = { ...CLOSE }; const d = lerp(1, 1.05, pr(g, 845, 91, SOFT)); return { ...c, s: c.s * d, cx: 640 + (c.cx - 640) * d, cy: 690 + (c.cy - 690) * d }; }
  const closeEnd = (() => { const d = 1.05; return { ...CLOSE, s: CLOSE.s * d, cx: 640 + (CLOSE.cx - 640) * d, cy: 690 + (CLOSE.cy - 690) * d }; })();
  if (g < 960) return mixCam(closeEnd, TILT, expoOut(24, 0.86)(clamp01((g - 936) / 24)));
  if (g < 1006) return mixCam(TILT, SETTLE, pr(g, 960, 46, SOFT));
  return mixCam(SETTLE, AWAY, Math.pow(clamp01((g - 1006) / 12), 2.2));
};
/** Where a point of the window lands on screen (rotation ignored: used for the cursor in the close-up, where the tilt is small). */
const toScreen = (c: Cam, wx: number, wy: number) => ({ x: c.cx + (wx - WW / 2) * c.s, y: c.cy + (wy - WH / 2) * c.s });
export const B3: React.FC<{ g: number }> = ({ g }) => {
  const c = camAt(g);
  const n = Math.max(0, Math.min(ASK2.length, Math.floor((g - 856) * 34 / 30)));
  const sent = g >= 920;
  const send = toScreen(c, PROMPT.x + PROMPT.send.x - 24 + 4, PROMPT.y + PROMPT.h - 40);
  const cur = path(g, [{ f: 900, x: 1400, y: 1180 }, { f: 916, x: send.x, y: send.y }, { f: 930, x: send.x + 10, y: send.y + 6 }, { f: 946, x: send.x + 160, y: send.y + 260 }]);
  const b = pr(g, 962, 26, MOVE), sweep = clamp01((g - 960) / 30);
  const msgs = [{ from: "me" as const, text: ASK2, k: pr(g, 921, 10) },
    { from: "ai" as const, text: b < 1 ? <>Klart! Jeg tilpasser farverne til <i>Blomsterhuset Rosa</i>…</> : <>Færdig! Farverne passer nu til dit brand ✓</>, k: pr(g, 934, 10) }];
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden", perspective: 2400 }}>
      <div style={{ position: "absolute", left: c.cx - WW / 2, top: c.cy - WH / 2, width: WW, height: WH, transform: `scale(${c.s}) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`, transformStyle: "preserve-3d" }}>
        <Halo x={WW / 2} y={WH / 2} w={WW} h={WH} r={22} spread={c.spread} />
        <Builder g={g} build={1} brand={b} from={800} steps={STEPS(g, 0)} status={<Building g={g} a={0} />} prompt={sent ? "" : ASK2.slice(0, n)} caret={!sent && g >= 845} sendPress={press(g, 917)} msgs={msgs}
          overlay={sweep > 0 && sweep < 1 ? <div style={{ position: "absolute", top: 84, bottom: 16, left: lerp(300, 1700, sweep) - 160, width: 320, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,240,236,0.55), rgba(255,255,255,0))", mixBlendMode: "screen" }} /> : undefined} />
      </div>
      <Grain opacity={0.12} seed={23} />
      {g >= 900 && g < 946 && <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={190} press={press(g, 917)} />}
    </AbsoluteFill>
  );
};
