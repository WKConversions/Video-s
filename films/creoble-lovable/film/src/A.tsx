// 0–23 s: the kinetic opening, shot for shot after the reference (timed on its frames at 30 fps): the sphere field and
// its pull-back into a dot grid whose centre dot becomes the line's icon, the line that types itself in close-up, the
// brackets closing round it, "Mød", the logo on its rising arc, the words between spheres that meet in a flare and burst
// into the gradient, the cream bloom into "Hele processen tager under", the count down to 5, the push through a letter
// onto the flower, and its star opening onto the websites Creoble has built.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, GRAD, GRAD_V, MOVE, SOFT, clamp01, expoOut, lerp, mix, pr, px } from "./lib";
import { At, Flow, Glow, Grain, Icon, Mark, Words, tw } from "./kit";
import { BASE_H, BASE_W, SITES, SiteCard, Scaled } from "./sites";
import { Laptop3D } from "./laptop";

const DARK_TEXT = "linear-gradient(180deg, #2A2522 30%, #7A6C64 100%)";
const LIGHT_TEXT = "linear-gradient(180deg, #FFFFFF 20%, #FCE6CF 100%)";
const easeIn = (t: number) => t * t * t;

/** The cream ground with soft glows at its edges (the reference's pink haze, in terracotta, sage and apricot). */
export const Haze: React.FC<{ g: number; a: number; v?: number; children?: React.ReactNode }> = ({ g, a, v = 0, children }) => {
  const k = pr(g, a, 12);
  const s = Math.sin((g - a) * 0.075 + v), c = Math.cos((g - a) * 0.06 + v * 1.3);
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <Glow x={960 + 220 * s} y={-90 + 40 * c} w={1000 + 160 * c} h={420} color={C.gCoral} blur={130} opacity={0.55 * k} />
      <Glow x={2000 - 60 * c} y={520 - 140 * s} w={560} h={1100} color={C.gTerra} blur={140} opacity={0.5 * k} />
      <Glow x={880 - 200 * s} y={1170 - 40 * c} w={1100 + 200 * s} h={420} color={C.gSage} blur={130} opacity={0.55 * k} />
      <Glow x={-80 + 70 * c} y={880 + 120 * s} w={420} h={700} color={C.gApricot} blur={140} opacity={0.45 * k} />
      {children}
    </AbsoluteFill>
  );
};

// ---- 0–1.53 s: the sphere field, the close-up on "Mange", the pull-back into a dot grid ---------------------------------
const BALL = [
  "radial-gradient(circle at 32% 26%, #FCE7D9 0%, #F2A07C 38%, #DA6A40 100%)",   // terracotta → sand
  "radial-gradient(circle at 32% 26%, #F1FAF6 0%, #A9D3C4 40%, #4E9180 100%)",   // sage → cream
  "radial-gradient(circle at 32% 26%, #FFF1DE 0%, #F8C08A 40%, #E68350 100%)",   // apricot
  "linear-gradient(150deg, #B9DDCF 0%, #EF9A72 100%)",                          // sage → coral
  "linear-gradient(160deg, #F9C9A6 0%, #E07A52 55%, #C25A36 100%)",             // coral → terracotta
];
const HERO_BALL = "radial-gradient(circle at 34% 28%, #F7B79A 0%, #E2754B 45%, #B84E2D 100%)";
const BALLS = (() => {
  const out: { x: number; y: number; d: number; p: number }[] = [];
  const h = (a: number, b: number) => Math.abs(Math.sin(a * 12.9898 + b * 78.233) * 43758.5453) % 1;
  for (let r = -7; r <= 8; r++) for (let c = -12; c <= 13; c++) {
    if (r === 0 && c === 0) continue;
    const jx = (h(r, c) - 0.5) * 70, jy = (h(c, r) - 0.5) * 60;
    out.push({ x: 960 + c * 232 + (r % 2 ? 116 : 0) + jx, y: 540 + r * 204 + jy, d: 168 + 46 * h(r + 3, c - 7), p: Math.floor(h(r - 5, c + 2) * 5) });
  }
  return out;
})();
/** The field at camera scale s around the frame centre; `pale` fades the others, `clear` empties a growing hole from the centre. */
const Field: React.FC<{ s: number; pale: number; clear?: number; centre?: React.ReactNode; hero?: boolean }> = ({ s, pale, clear = 0, centre, hero = true }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {BALLS.map((b, i) => {
      const x = 960 + (b.x - 960) * s, y = 540 + (b.y - 540) * s, d = b.d * s;
      if (x < -d || x > 1920 + d || y < -d || y > 1080 + d) return null;
      const dist = Math.hypot((x - 960) / 1.6, y - 540);
      const gone = clamp01((clear - dist) / 120);
      if (gone >= 1) return null;
      return <div key={i} style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: BALL[b.p],
        opacity: (1 - 0.7 * pale) * (1 - gone), filter: s > 1.5 ? "blur(1.5px)" : undefined }} />;
    })}
    {hero && <div style={{ position: "absolute", left: 960 - 105 * s, top: 540 - 105 * s, width: 210 * s, height: 210 * s, borderRadius: "50%", background: HERO_BALL,
      display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 ${8 * s}px ${20 * s}px -${8 * s}px rgba(184,78,45,0.5)` }}>{centre}</div>}
  </div>
);
const fieldScale = (g: number) => {
  const zin = 1 + 1.7 * px(g, 7, 10, 0.8) + 0.18 * clamp01((g - 17) / 20);
  return g < 37 ? zin : lerp(zin, 0.3, pr(g, 37, 9, MOVE));
};
export const A1: React.FC<{ g: number }> = ({ g }) => {
  const w = clamp01((g - 9) / 7), e = expoOut(7, 0.78)(w), out = pr(g, 36, 5);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Field s={fieldScale(g)} pale={pr(g, 28, 12)} centre={
        <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: 48, color: "#fff", opacity: w * (1 - out), filter: w < 1 ? `blur(${8 * (1 - e)}px)` : undefined,
          transform: `translateY(${8 * (1 - e)}px)`, letterSpacing: -0.5 }}>Mange</div>} />
    </AbsoluteFill>
  );
};

// ---- 1.53–2.73 s: the grid clears from the centre; its dot becomes the icon of "tror de skal kunne kode ● først" ----------
const L2 = { size: 104 };
export const A2: React.FC<{ g: number }> = ({ g }) => {
  const words = ["tror", "de", "skal", "kunne", "kode"], after = "først", size = L2.size, sp = tw(" ", size);
  const iconD = 92, ws = words.map((w) => tw(w, size) - 0.02 * size * w.length);   // as Words lays them out (letter-spacing −0.02 em)
  const total = ws.reduce((a, b) => a + b, 0) + sp * words.length + iconD + sp + tw(after, size) - 0.02 * size * after.length;
  const left = 960 - total / 2, iconX = left + ws.reduce((a, b) => a + b, 0) + sp * words.length + iconD / 2;
  const zoom = lerp(1.05, 0.93, pr(g, 46, 36, SOFT));
  const travel = pr(g, 50, 12, MOVE), d = lerp(210 * 0.3, iconD, travel), cx = lerp(960, iconX, travel), cy = lerp(540, 552, travel);
  const morph = pr(g, 57, 8);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Field s={0.3} pale={1} clear={easeIn(clamp01((g - 46) / 16)) * 1700} hero={false} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "960px 552px" }}>
        <Words g={g} size={size} x={960} y={570} words={[{ t: "tror", f: 52 }, { t: "de", f: 54 }, { t: "skal", f: 56 }, { t: "kunne", f: 58 }, { t: "kode", f: 61 },
          { t: "", f: 999, iconW: iconD }, { t: after, f: 66 }]} />
        <div style={{ position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: "50%",
          background: morph > 0 ? `linear-gradient(135deg, ${mix("#E2754B", C.gSage, morph)}, ${C.gCoral})` : HERO_BALL, display: "flex", alignItems: "center", justifyContent: "center",
          transform: `rotate(${-140 * (1 - morph)}deg)`, boxShadow: "0 10px 24px -10px rgba(224,111,69,0.6)" }}>
          <Icon name="code" size={d * 0.56} color="#fff" stroke={2.6} style={{ opacity: morph }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- 2.73–3.6 s: the line types itself in extreme close-up, then the camera snaps back ------------------------------------
const LINE3 = "for at bygge hjemmesider", S3 = 84;
const GLYPHS = ["#", "}", "<", "/"];
export const A3: React.FC<{ g: number }> = ({ g }) => {
  const wAll = tw(LINE3, S3), left = 960 - wAll / 2;
  const n = Math.max(1, Math.min(LINE3.length, Math.floor((g - 82) * 36 / 30) + 1));
  const txt = LINE3.slice(0, n), typedW = tw(txt, S3);
  const scramble = n >= LINE3.length - 3 && n < LINE3.length && g % 2 === 0 ? GLYPHS[g % 4] : "";
  const snap = pr(g, 94, 4, MOVE), z = lerp(3.4, 1, snap);
  // while close, the caret sits a little right of centre; after the snap the line sits where it will stand
  const caretX = left + typedW + (scramble ? tw(scramble, S3) : 0) + 8;
  const fx = lerp(caretX - 140 / 3.4, 960, snap);
  const sx = (wx: number) => (wx - fx) * z + 960;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", left: sx(left), top: 540 - S3 * 0.68 * z, fontFamily: F.serif, fontWeight: 500, fontSize: S3 * z, color: C.ink, whiteSpace: "pre", lineHeight: 1.24 }}>
        {txt}{scramble && <span style={{ color: C.gTerra }}>{scramble}</span>}</div>
      <div style={{ position: "absolute", left: sx(caretX), top: 540 - 50 * z, width: 9 * z, height: 98 * z, borderRadius: 5 * z, background: GRAD_V }} />
    </AbsoluteFill>
  );
};

// ---- 3.6–4.9 s: the brackets close round it ---------------------------------------------------------------------------------
const Chevron: React.FC<{ h: number; flip?: boolean; id: string }> = ({ h, flip, id }) => (
  <svg width={h * 0.45} height={h} viewBox="0 0 90 200" style={{ display: "block", transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.gCoral} /><stop offset="0.4" stopColor={C.gTerra} /><stop offset="0.75" stopColor={C.gSage} /><stop offset="1" stopColor={C.gTeal} /></linearGradient></defs>
    <path d="M 74 14 L 18 100 L 74 186" fill="none" stroke={`url(#${id})`} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const A4: React.FC<{ g: number }> = ({ g }) => {
  const k = expoOut(30, 0.9)(clamp01((g - 106) / 30)), end = pr(g, 141, 6, SOFT);
  const h = lerp(1350, 880, k) * lerp(1, 0.85, end), xl = lerp(130, 360, k) + 70 * end, xr = lerp(1790, 1560, k) - 70 * end;
  const b = clamp01((g - 104) / 5);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <At x={960} y={540} s={lerp(1, 0.9, pr(g, 108, 39, SOFT))}><div style={{ fontFamily: F.serif, fontWeight: 500, fontSize: S3, color: C.ink, whiteSpace: "pre" }}>{LINE3}</div></At>
      <At x={xl} y={540} o={b}><div style={{ filter: b < 1 ? `blur(${10 * (1 - b)}px)` : undefined }}><Chevron h={h} id="chl" /></div></At>
      <At x={xr} y={540} o={b}><div style={{ filter: b < 1 ? `blur(${10 * (1 - b)}px)` : undefined }}><Chevron h={h} id="chr" flip /></div></At>
    </AbsoluteFill>
  );
};

// ---- 4.9–6 s: "men det ændrer sig nu" ---------------------------------------------------------------------------------------
export const A5: React.FC<{ g: number }> = ({ g }) => {
  const nu = mix("#B5B1A9", C.ink, pr(g, 166, 9));
  const sc = lerp(1.12, 1, px(g, 147, 8)) * lerp(1, 0.88, pr(g, 175, 5, SOFT)), op = 1 - pr(g, 176, 4);
  return (
    <Haze g={g} a={130}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${sc})`, transformOrigin: "960px 560px", opacity: op }}>
        <Flow g={g} size={124} y={572} n={6} words={[{ t: "men", f: 148 }, { t: "det", f: 148 }, { t: "ændrer", f: 148 }, { t: "sig", f: 157 }, { t: "nu", f: 163, color: nu }]} />
      </div>
    </Haze>
  );
};

// ---- 6–7 s: "Mød" sharpens out of a blur, then pulls back ----------------------------------------------------------------------
export const A6: React.FC<{ g: number }> = ({ g }) => {
  const size = 520, word = "Mød", total = tw(word, size, 600);
  const pull = lerp(1, 0.76, pr(g, 190, 22, SOFT));
  let cx = 960 - total / 2;
  return (
    <Haze g={g} a={130} v={1.2}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${pull})`, transformOrigin: "960px 540px" }}>
        {word.split("").map((l, i) => {
          const w = tw(l, size, 600), left = cx; cx += w;
          const k = clamp01((g - 176 - i * 4) / 13), e = expoOut(13, 0.8)(k);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${left - 90 * (1 - e)}px, ${540 - size * 0.66 + 40 * (1 - e)}px, 0)`, opacity: clamp01(k * 2.2),
              filter: k < 1 ? `blur(${40 * (1 - e)}px)` : undefined, fontFamily: F.serif, fontWeight: 600, fontSize: size, lineHeight: 1.24, whiteSpace: "pre",
              backgroundImage: GRAD, backgroundSize: `${total}px 100%`, backgroundPosition: `${960 - total / 2 - left}px 0`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{l}</div>
          );
        })}
      </div>
    </Haze>
  );
};

// ---- 7–8.83 s: the logo on the rising arc --------------------------------------------------------------------------------------
export const A7: React.FC<{ g: number }> = ({ g }) => {
  const t = g - 210, rise = lerp(300, 840, expoOut(36, 0.92)(clamp01(t / 36)));
  const size = 286, ms = size * 0.78, gap = size * 0.24, ww = tw("Creoble.", size) - size * 0.08, total = ms + gap + ww;
  const sc = lerp(1, 1.2, pr(g, 212, 46, SOFT)) * lerp(1, 0.97, pr(g, 258, 7, SOFT));
  const flip = pr(g, 231, 9, MOVE) * 360;
  const letters = "Creoble".split("");
  let lx = 0;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #2C6F60 0%, #3D8371 60%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - 1800, top: 1080 - rise, width: 3600, height: 2400, borderRadius: "50%", filter: "blur(40px)",
        background: `radial-gradient(closest-side, ${C.gApricot} 0%, ${C.gTerra} 38%, ${C.gCoral} 58%, #F6C9B4 74%, rgba(211,235,225,0.95) 86%, rgba(211,235,225,0) 100%)` }} />
      <Grain opacity={0.2} seed={7} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${sc})`, transformOrigin: "960px 540px" }}>
        <div style={{ position: "absolute", left: 960 - total / 2, top: 540 - ms / 2, width: ms, height: ms, transform: `perspective(900px) rotateY(${flip}deg)` }}>
          <Mark size={ms} color={C.cream} id="a7m" /></div>
        {letters.concat(["."]).map((l, i) => {
          const left = 960 - total / 2 + ms + gap + lx; lx += tw(l, size) - size * 0.015;
          const k = clamp01((t + 3 - i * 0.9) / 7), e = expoOut(7, 0.78)(k);
          return <div key={i} style={{ position: "absolute", left, top: 540 - size * 0.66 + 22 * (1 - e), opacity: k, filter: k < 1 ? `blur(${8 * (1 - e)}px)` : undefined,
            fontFamily: F.serif, fontWeight: 500, fontSize: size, lineHeight: 1.24, color: l === "." ? C.gSand : C.cream, whiteSpace: "pre" }}>{l}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- 8.83–10.17 s: words between two spheres that grow, meet in a flare and burst into the gradient --------------------------
const Sphere: React.FC<{ x: number; y: number; d: number; kind: "sage" | "terra" }> = ({ x, y, d, kind }) => {
  const sage = kind === "sage";
  return (
    <>
      <div style={{ position: "absolute", left: x - d * 0.56, top: y - d * 0.56, width: d * 1.12, height: d * 1.12, borderRadius: "50%", background: sage ? C.gSage : C.gCoral, filter: "blur(50px)", opacity: 0.45 }} />
      <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%",
        background: sage ? "radial-gradient(circle at 46% 60%, #2E6E5E 0%, #3F8C77 40%, #7CC1AA 72%, #CDEBDF 88%, #F4FFF9 92%, #9CCFBE 100%)"
          : "radial-gradient(circle at 54% 40%, #8E2E16 0%, #C9502C 38%, #F08A62 70%, #FFD3BC 87%, #FFF4EA 91%, #F4A27F 100%)" }} />
    </>
  );
};
const BURST = 300;
export const A8: React.FC<{ g: number }> = ({ g }) => {
  const k = pr(g, 265, BURST - 265, (t) => t * t * (3 - 2 * t));
  const d = lerp(1150, 1600, k);
  const top = { x: lerp(1060, 1525, k), y: lerp(-390, -25, k) }, bot = { x: lerp(860, 395, k), y: lerp(1470, 1105, k) };
  const flare = clamp01(1 - Math.abs(g - (BURST - 1)) / 4), R = g >= BURST ? 120 * Math.pow(2.2, g - BURST) : 0;
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <Glow x={1800} y={1000} w={1200} h={700} color={C.gDeep} blur={150} opacity={0.9} />
      <Glow x={120} y={60} w={900} h={500} color={C.terraDeep} blur={160} opacity={0.45} />
      <Sphere x={top.x} y={top.y} d={d} kind="sage" />
      <Sphere x={bot.x} y={bot.y} d={d} kind="terra" />
      <Grain opacity={0.14} seed={3} />
      {g < BURST && (g < 285
        ? <Words g={g} size={128} x={960} y={572} weight={600} color="#fff" words={[{ t: "AI", f: 267 }, { t: "bygger", f: 267 }]} n={3} blur={6} rise={0.05} />
        : <Words g={g} size={128} x={960} y={572} weight={600} color="#fff" words={[{ t: "hjemmesider", f: 288 }]} n={3} blur={6} rise={0.05} />)}
      {flare > 0 && (
        <div style={{ position: "absolute", left: 960 - 300, top: 540 - 300, width: 600, height: 600, opacity: flare }}>
          <div style={{ position: "absolute", inset: 0, clipPath: astroid(300 * (0.4 + 0.6 * flare), 300, 300), background: "radial-gradient(circle, #FFFFFF 0%, #FFF4E6 30%, rgba(255,244,230,0) 70%)" }} />
          <div style={{ position: "absolute", left: 240, top: 240, width: 120, height: 120, borderRadius: 60, background: "#fff", filter: "blur(24px)" }} />
        </div>
      )}
      {R > 0 && <div style={{ position: "absolute", inset: 0, clipPath: astroid(R, 960, 540) }}><A9Inner g={g} /></div>}
    </AbsoluteFill>
  );
};

// ---- 10–12.47 s: "hurtigere end du troede muligt" on the gradient, then a cream bloom ------------------------------------------
export const Gradient: React.FC<{ g: number; a: number; lift?: number; children?: React.ReactNode; seed?: number; bloom?: number }> = ({ g, a, lift = 14, children, seed = 1, bloom = 0 }) => {
  const L = lift * pr(g, a, 60, SOFT) + 6 * Math.sin((g - a) * 0.08) + bloom * 60, cx = 50 + 8 * Math.sin((g - a) * 0.05), tl = 8 * Math.cos((g - a) * 0.06);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background:
      `radial-gradient(ellipse ${72 + bloom * 90}% ${62 + bloom * 90}% at ${cx}% ${108 - L}%, ${C.gSand} 0%, ${C.gApricot} ${26 - bloom * 20}%, rgba(247,178,118,0) 72%),` +
      `radial-gradient(ellipse ${55 + tl}% 70% at 0% ${tl}%, ${C.gTeal} 0%, rgba(61,131,113,0) 72%),` +
      `radial-gradient(ellipse ${55 - tl}% 70% at 100% ${-tl}%, ${C.gSage} 0%, rgba(143,192,174,0) 68%),` +
      `linear-gradient(180deg, ${C.gCoral} 0%, ${C.gTerra} 100%)` }}>
      <Grain opacity={0.22} seed={seed} />
      {bloom > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse ${60 + 120 * bloom}% ${50 + 110 * bloom}% at 50% ${110 - 70 * bloom}%, ${C.paper} 0%, ${C.paper} ${30 + 50 * bloom}%, rgba(246,242,236,0) 100%)`, opacity: clamp01(bloom * 1.4) }} />}
      {children}
    </AbsoluteFill>
  );
};
const A9Inner: React.FC<{ g: number }> = ({ g }) => {
  const bloom = easeIn(clamp01((g - 362) / 12));
  const drift = -60 * bloom, fade = 1 - clamp01(bloom * 1.6);
  const y = g < 345 ? lerp(640, 600, px(g, 327, 10)) : lerp(600, 545, px(g, 345, 16));
  const hk = pr(g, 302, 25, SOFT);
  return (
    <Gradient g={g} a={300} seed={11} bloom={bloom}>
      {g < 327 && <At x={960} y={540} s={lerp(1.0, 1.05, hk)}><div style={{ position: "relative", width: 1, height: 1 }}>
        <Words g={g} size={330} x={0} y={0} weight={600} grad={LIGHT_TEXT} words={[{ t: "hurtigere", f: 301, italic: true }]} n={8} blur={20} shadow="0 20px 60px rgba(150,50,20,0.15)" /></div></At>}
      {g >= 327 && <div style={{ position: "absolute", inset: 0, transform: `translateY(${drift}px)`, opacity: fade }}>
        <Flow g={g} size={128} y={y} weight={600} color="#FFF8F0" words={[{ t: "end", f: 327 }, { t: "du", f: 344 }, { t: "troede", f: 352 }, { t: "muligt", f: 360 }]} shadow="0 8px 30px rgba(150,50,20,0.25)" />
      </div>}
    </Gradient>
  );
};
export const A9: React.FC<{ g: number }> = ({ g }) => <A9Inner g={g} />;

// ---- 12.47–14.8 s: "Hele processen tager under" ----------------------------------------------------------------------------------
const LINE10 = "Hele processen tager";
export const A10: React.FC<{ g: number }> = ({ g }) => {
  const dark = (st: React.CSSProperties): React.CSSProperties => ({ ...st, fontFamily: F.serif, fontWeight: 600, whiteSpace: "pre", lineHeight: 1.24, backgroundImage: DARK_TEXT,
    WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });
  if (g < 390) {
    // "Hele" slides up out of the bloom into place, with motion blur
    const k = expoOut(10, 0.78)(clamp01((g - 373) / 10)), size = 240;
    return (
      <Haze g={g} a={356}>
        <div style={dark({ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", fontSize: size, transform: `translateY(${540 - size * 0.66 + 320 * (1 - k)}px)`,
          filter: k < 1 ? `blur(${14 * (1 - k)}px)` : undefined, opacity: clamp01(k * 2) })}>Hele</div>
      </Haze>
    );
  }
  if (g < 416) {
    // the line builds to "Hele processen tager", holds, then dissolves from both ends inward
    const size = 124;
    if (g < 406) return <Haze g={g} a={356}><Flow g={g} size={size} y={560} weight={600} grad={DARK_TEXT} words={[{ t: "Hele", f: 300 }, { t: "processen", f: 391 }, { t: "tager", f: 399 }]} /></Haze>;
    const total = tw(LINE10, size, 600), left = 960 - total / 2, N = LINE10.length;
    return (
      <Haze g={g} a={356}>
        {LINE10.split("").map((l, i) => {
          const order = Math.min(i, N - 1 - i), k = clamp01((g - 406 - order * 0.9) / 4);
          return <div key={i} style={dark({ position: "absolute", left: left + tw(LINE10.slice(0, i), size, 600), top: 560 - size * 0.62, fontSize: size, opacity: 1 - k,
            filter: k > 0 ? `blur(${10 * k}px)` : undefined })}>{l}</div>;
        })}
      </Haze>
    );
  }
  // "under" builds from its centre letter outward, each letter springing onto the baseline
  const size = 210, word = "under", total = tw(word, size, 600), left = 960 - total / 2;
  const grow = lerp(1, 1.06, pr(g, 418, 26, SOFT));
  return (
    <Haze g={g} a={356}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${grow})`, transformOrigin: "960px 560px" }}>
        {word.split("").map((l, i) => {
          const order = Math.abs(i - 2), t = (g - 415 - order * 1.6) / 7, k = clamp01(t);
          const spring = k >= 1 ? 0 : (i % 2 ? -1 : 1) * 16 * Math.cos(k * Math.PI * 1.3) * (1 - k);
          return <div key={i} style={dark({ position: "absolute", left: left + tw(word.slice(0, i), size, 600), top: 560 - size * 0.62 + spring, fontSize: size, opacity: clamp01(t * 2.5) })}>{l}</div>;
        })}
      </div>
    </Haze>
  );
};

// ---- 14.8–16.5 s: the count down to 5 ------------------------------------------------------------------------------------------
export const A11: React.FC<{ g: number }> = ({ g }) => {
  const t = g - 444, p = clamp01(t / 43), v = Math.max(5, Math.round(lerp(60, 5, 1 - Math.pow(1 - p, 2.4))));
  const label = String(v), size = 540, w = tw(label, size, 600) * 0.92;
  const dotX = 960 + w / 2 - 16, dotY = 700;
  const draw = lerp(0.2, 1, 1 - Math.pow(1 - clamp01(t / 48), 2));
  const d = `M -80 880 C 220 730 380 1030 660 940 S ${dotX - 190} ${dotY + 60} ${dotX} ${dotY}`;
  const nk = clamp01((t + 4) / 6);
  return (
    <Haze g={g} a={430} v={3.0}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.gTeal} /><stop offset="0.45" stopColor={C.gSage} /><stop offset="0.75" stopColor={C.gCoral} /><stop offset="1" stopColor={C.gTerra} /></linearGradient>
          <linearGradient id="haze" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.gSage} stopOpacity="0.7" /><stop offset="1" stopColor={C.gCoral} stopOpacity="0.5" /></linearGradient>
        </defs>
        <path d={`${d} L ${dotX} 1080 L -80 1080 Z`} fill="url(#haze)" style={{ filter: "blur(60px)", opacity: 0.55 * draw }} />
        <path d={d} fill="none" stroke="url(#wave)" strokeWidth={34} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} style={{ filter: "drop-shadow(0 0 18px rgba(239,138,102,0.55))" }} />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${470 - size * 0.66 + 30 * (1 - expoOut(6, 0.78)(nk))}px)`, opacity: nk,
        fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: size, letterSpacing: -12, lineHeight: 1.24, whiteSpace: "pre",
        backgroundImage: DARK_TEXT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{label}</div>
      {draw > 0.95 && <div style={{ position: "absolute", left: dotX - 32, top: dotY - 32, width: 64, height: 64, borderRadius: 32, background: "#FFFDF8",
        boxShadow: "0 0 36px 14px rgba(255,250,240,0.8), 0 0 70px rgba(239,138,102,0.65)" }} />}
    </Haze>
  );
};

// ---- 16.5–18.2 s: "minutter. Ingen kode nødvendig", then the push through the "d" onto the flower -----------------------------
const NOED = "nødvendig", SN = 270;
export const A12: React.FC<{ g: number }> = ({ g }) => {

  const cx = 755, cy = 595;                                   // the bowl of the first "d", measured on the rendered frame (a 54 × 115 px oval)
  const push = g < 535 ? 1 : 1 + 30 * easeIn(clamp01((g - 535) / 11));
  const spark = pr(g, 536, 5) * (1 - clamp01((push - 2.5) / 3));
  return (
    <AbsoluteFill>
      <Haze g={g} a={486} v={g < 510 ? 4 : g < 525 ? 5.2 : 6.4}>
        {push > 1.05 && <AbsoluteFill style={{ clipPath: `ellipse(${26 * push}px ${56 * push}px at ${cx}px ${cy}px)` }}><FlowerScene g={g} /></AbsoluteFill>}
        {g < 510 && <Words g={g} size={92} x={960} y={572} weight={600} grad={DARK_TEXT} words={[{ t: "minutter.", f: 496 }, { t: "Ingen", f: 499 }]} n={7} />}
        {g >= 510 && g < 525 && <Words g={g} size={170} x={960} y={572} weight={600} grad={DARK_TEXT} words={[{ t: "kode", f: 511 }]} n={7} />}
        {g >= 525 && (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: `${cx}px ${cy}px` }}>
            <Words g={g} size={SN} x={960} y={560} weight={600} grad={DARK_TEXT} words={[{ t: NOED, f: 526 }]} n={8} />
            {spark > 0 && <div style={{ position: "absolute", left: cx - 18, top: cy - 18, width: 36, height: 36, clipPath: astroid(18 * spark, 18, 18), background: C.gTerra }} />}
          </div>
        )}
      </Haze>
    </AbsoluteFill>
  );
};

// ---- 18.2–19.07 s: the flower grows past the frame; its star opens onto a website -------------------------------------------------
const astroid = (R: number, cx: number, cy: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 96; i++) { const t = (i / 96) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t); pts.push(`${cx + R * Math.sign(c) * Math.abs(c) ** 3}px ${cy + R * Math.sign(s) * Math.abs(s) ** 3}px`); }
  return `polygon(${pts.join(",")})`;
};
const FLOWER = (() => {
  let d = "";
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2, x = 500 + 290 * Math.cos(a), y = 500 + 290 * Math.sin(a); d += `M ${x - 190} ${y} a 190 190 0 1 0 380 0 a 190 190 0 1 0 -380 0 `; }
  return d + "M 310 500 a 190 190 0 1 0 380 0 a 190 190 0 1 0 -380 0";
})();
const FlowerScene: React.FC<{ g: number }> = ({ g }) => {
  // the flower is 0.6 of the frame's height at 18.2 s and grows past the edges by 18.55 s; its pale heart becomes the ground
  const grow = 0.62 + 1.4 * easeIn(clamp01((g - 546) / 12)), rot = lerp(-10, 12, clamp01((g - 536) / 30));
  const star = pr(g, 552, 6), R = g < 558 ? 0 : 90 * Math.pow(1.36, g - 558);
  const size = 1080 * grow / 0.82;
  return (
    <AbsoluteFill style={{ background: "#5C6E67", overflow: "hidden" }}>
      <Glow x={1700} y={150} w={900} h={500} color={C.gCoral} blur={120} opacity={0.6} rot={-20} />
      <div style={{ position: "absolute", left: 960 - size / 2, top: 560 - size / 2, width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 1000 1000" style={{ transform: `rotate(${rot}deg)`, display: "block" }}>
          <defs><radialGradient id="pet" cx="0.5" cy="0.5" r="0.62"><stop offset="0" stopColor="#FFF4EC" /><stop offset="0.32" stopColor="#F9D7C8" /><stop offset="0.8" stopColor={C.gCoral} /><stop offset="1" stopColor={C.gTerra} /></radialGradient></defs>
          <path d={FLOWER} fill="url(#pet)" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 960 - 120, top: 560 - 120, width: 240, height: 240, clipPath: astroid(120 * lerp(0.35, 1, star) * (1 + 0.6 * clamp01((g - 552) / 6)), 120, 120), background: C.gTerra }} />
      {R > 0 && <div style={{ position: "absolute", inset: 0, clipPath: astroid(R, 960, 560) }}><div><Scaled w={1920} r={0}><SiteCard s={SITES[6]} /></Scaled></div></div>}
    </AbsoluteFill>
  );
};
export const A13: React.FC<{ g: number }> = ({ g }) => <FlowerScene g={g} />;

// ---- 19.07–23 s: the showcase: the hero site, a collage of sites round it, the push into Café Gaden, the laptop --------------------
const CW = 760, CH = CW * BASE_H / BASE_W;
const COLLAGE: { i: number; x: number; y: number; w: number }[] = [
  { i: 0, x: 300, y: 250, w: 500 }, { i: 1, x: 250, y: 600, w: 440 }, { i: 2, x: 330, y: 930, w: 500 },
  { i: 3, x: 1630, y: 220, w: 500 }, { i: 4, x: 1680, y: 560, w: 440 }, { i: 7, x: 1600, y: 900, w: 520 },
  { i: 8, x: 960, y: 150, w: 420 }, { i: 9, x: 980, y: 960, w: 440 }, { i: 5, x: -260, y: 520, w: 500 }, { i: 2, x: 2200, y: 560, w: 480 },
];
export const A14: React.FC<{ g: number }> = ({ g }) => {
  const full = 1920 / CW;
  if (g < 630) {
    const out = (t: number) => 1 - Math.pow(1 - t, 3);
    let s = g < 585 ? full * lerp(1.04, 1, pr(g, 572, 13)) : lerp(full, 1.2, out(clamp01((g - 585) / 14)));
    const tgt = COLLAGE[5], m = pr(g, 606, 24, MOVE), tfull = 1920 / tgt.w;
    s = lerp(s, tfull, m);
    const fx = lerp(960, tgt.x, m);
    const fy0 = 540 - CH / 2 + 540 / full;                                        // the hero's top meets the frame's top at full size
    const fy = lerp(lerp(fy0, 540, clamp01((full - s) / (full - 1.2))), tgt.y - (tgt.w * BASE_H / BASE_W) / 2 + 540 / tfull, m);
    const card = (p: { i: number; x: number; y: number; w: number }, key: number, hero = false) => {
      const sx = (p.x - fx) * s + 960, sy = (p.y - fy) * s + 540, w = p.w * s, h = w * BASE_H / BASE_W;
      if (sx + w / 2 < 0 || sx - w / 2 > 1920 || sy + h / 2 < 0 || sy - h / 2 > 1080) return null;
      return <At key={key} x={sx} y={sy} s={s}><Scaled w={p.w} r={14} shadow={hero ? "0 50px 90px -30px rgba(0,0,0,0.7)" : "0 24px 50px -24px rgba(0,0,0,0.5)"}><SiteCard s={SITES[p.i]} /></Scaled></At>;
    };
    return (
      <AbsoluteFill style={{ background: "#121815", overflow: "hidden" }}>
        {COLLAGE.map((p, j) => card(p, j))}
        {card({ i: 6, x: 960, y: 540, w: CW }, 99, true)}
        <Grain opacity={0.08} seed={5} />
      </AbsoluteFill>
    );
  }
  if (g < 645) return <AbsoluteFill><div style={{ transform: `scale(${lerp(1, 1.04, pr(g, 630, 15, SOFT))})` }}><Scaled w={1920} r={0}><SiteCard s={SITES[7]} /></Scaled></div></AbsoluteFill>;
  return <LaptopRock g={g} />;
};

const LaptopRock: React.FC<{ g: number }> = ({ g }) => {
  // opens close and high, the top of the screen cropped, pulls back by 21.9 s, then creeps in while the angle drifts; the
  // laptop sits on a dark stone floor under a soft top light, seen from above with the lid wide open
  const back = expoOut(12, 0.8)(clamp01((g - 645) / 12)), drift = pr(g, 657, 33, SOFT);
  const sc = lerp(1.55, 1.0, back) * lerp(1, 1.03, drift);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 75% at 50% 10%, #39423E 0%, #1C211F 55%, #101311 100%)", overflow: "hidden" }}>
      <Laptop3D w={700} x={920} y={lerp(700, 610, back)} s={sc} yaw={lerp(19, 13, drift)} elev={24} open={115} floor="stone"><SiteCard s={SITES[7]} /></Laptop3D>
      <Grain opacity={0.26} seed={9} />
    </AbsoluteFill>
  );
};

export { DARK_TEXT, LIGHT_TEXT };
