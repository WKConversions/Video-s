// 0–23 s: the kinetic opening, shot for shot after the reference — the ball field, the line that types itself, the
// brackets closing round it, "Mød", the logo on its rising arc, the words over glowing spheres, the gradient, the count
// down to 5 minutes, the flower and its star that opens onto the websites Creoble has built.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, GRAD, GRAD_V, MOVE, SOFT, clamp01, expoOut, lerp, pr, px } from "./lib";
import { At, Flow, Glow, Grain, Icon, Mark, Words, Wordmark, tw } from "./kit";
import { BASE_H, BASE_W, SITES, SiteCard, Scaled } from "./sites";

const DARK_TEXT = "linear-gradient(180deg, #2A2522 30%, #7A6C64 100%)";
const LIGHT_TEXT = "linear-gradient(180deg, #FFFFFF 20%, #FCE6CF 100%)";

/** The cream ground with soft glows at its edges (the reference's pink haze, in terracotta, sage and apricot). */
export const Haze: React.FC<{ g: number; a: number; v?: number; children?: React.ReactNode }> = ({ g, a, v = 0, children }) => {
  const k = pr(g, a, 12);
  const s = Math.sin((g - a) * 0.04 + v);
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <Glow x={960 + 120 * s} y={-90} w={1000} h={420} color={C.gCoral} blur={130} opacity={0.55 * k} />
      <Glow x={2000} y={520 - 60 * s} w={560} h={1100} color={C.gTerra} blur={140} opacity={0.5 * k} />
      <Glow x={880 - 80 * s} y={1170} w={1100} h={420} color={C.gSage} blur={130} opacity={0.55 * k} />
      <Glow x={-80} y={880} w={420} h={700} color={C.gApricot} blur={140} opacity={0.45 * k} />
      {children}
    </AbsoluteFill>
  );
};

// ---- 0–1.5 s: the ball field -----------------------------------------------------------------------------------------
const BALL = [
  "radial-gradient(circle at 32% 28%, #FBD2BD 0%, #EF8A66 42%, #D9623A 100%)",
  "radial-gradient(circle at 32% 28%, #E6F4EE 0%, #8FC0AE 45%, #3D8371 100%)",
  "radial-gradient(circle at 32% 28%, #FFEBD0 0%, #F7B276 45%, #E2773F 100%)",
  "linear-gradient(145deg, #A9D3C4 0%, #EF8A66 100%)",
  "linear-gradient(160deg, #F7B276 0%, #E06F45 60%, #B9502E 100%)",
];
const balls = (() => {
  const out: { x: number; y: number; d: number; p: number }[] = [];
  for (let r = -3; r <= 3; r++) for (let c = -5; c <= 5; c++) {
    const x = 960 + c * 300 + (r % 2 ? 150 : 0), y = 540 + r * 250;
    const h = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
    out.push({ x, y, d: r === 0 && c === 0 ? 210 : 150 + 60 * h, p: r === 0 && c === 0 ? 4 : Math.floor(h * 5) });
  }
  return out;
})();
const BallField: React.FC<{ s: number; fade: number; opacity?: number; centre?: React.ReactNode }> = ({ s, fade, opacity = 1, centre }) => (
  <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "960px 540px", opacity }}>
    {balls.map((b, i) => {
      const me = b.x === 960 && b.y === 540;
      return (
        <div key={i} style={{ position: "absolute", left: b.x - b.d / 2, top: b.y - b.d / 2, width: b.d, height: b.d, borderRadius: "50%", background: BALL[b.p],
          filter: "blur(2.5px)", opacity: me ? 1 : 1 - 0.68 * fade, display: "flex", alignItems: "center", justifyContent: "center" }}>{me && centre}</div>
      );
    })}
  </div>
);
export const A1: React.FC<{ g: number }> = ({ g }) => {
  const s = 1 + 1.55 * px(g, 0, 16, 0.8) + 0.22 * clamp01((g - 16) / 29);
  const w = clamp01((g - 11) / 8), e = expoOut(8, 0.78)(w);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <BallField s={s} fade={pr(g, 28, 14)} centre={
        <div style={{ fontFamily: F.serif, fontWeight: 500, fontSize: 46, color: "#fff", opacity: w, filter: w < 1 ? `blur(${8 * (1 - e)}px)` : undefined, transform: `translateY(${8 * (1 - e)}px)`, letterSpacing: -0.5 }}>Mange</div>} />
    </AbsoluteFill>
  );
};

// ---- 1.5–2.5 s: "tror de skal kunne kode først" ------------------------------------------------------------------------
export const A2: React.FC<{ g: number }> = ({ g }) => {
  const ik = clamp01((g - 61) / 10), ie = expoOut(10, 0.78)(ik);
  const icon = (
    <div style={{ width: 78, height: 78, borderRadius: 39, background: `linear-gradient(135deg, ${C.gSage}, ${C.gCoral})`, display: "flex", alignItems: "center", justifyContent: "center",
      transform: `translateY(6px) rotate(${-120 * (1 - ie)}deg) scale(${0.6 + 0.4 * ie})`, boxShadow: "0 10px 24px -10px rgba(224,111,69,0.6)" }}>
      <Icon name="code" size={46} color="#fff" stroke={2.6} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <BallField s={0.42} fade={1} opacity={0.16 * (1 - pr(g, 45, 14))} />
      <Words g={g} size={84} x={960} y={560} words={[{ t: "tror", f: 45 }, { t: "de", f: 49 }, { t: "skal", f: 52 }, { t: "kunne", f: 55 }, { t: "kode", f: 58 }, { t: "", f: 61, icon, iconW: 78 }, { t: "først", f: 65 }]} />
    </AbsoluteFill>
  );
};

// ---- 2.5–3.5 s: the gradient caret types the line ----------------------------------------------------------------------
const LINE3 = "for at bygge hjemmesider";
export const A3: React.FC<{ g: number }> = ({ g }) => {
  const size = 84, wAll = tw(LINE3, size), left = 960 - wAll / 2;
  const n = Math.max(0, Math.min(LINE3.length, Math.floor((g - 86) * 40 / 30)));
  const txt = LINE3.slice(0, n), tx = left + tw(txt, size);
  const grow = px(g, 75, 8), m = pr(g, 82, 8, MOVE);
  const ch = lerp(lerp(220, 380, grow), 96, m), cw = lerp(56, 9, m), cx = lerp(960, tx + 6, m);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", left: cx - cw / 2, top: 540 - ch / 2 - 6 * m, width: cw, height: ch, borderRadius: cw / 2, background: GRAD_V, opacity: clamp01((g - 75) / 4) }} />
      <div style={{ position: "absolute", left, top: 540 - size * 0.68, fontFamily: F.serif, fontWeight: 500, fontSize: size, color: C.ink, whiteSpace: "pre", letterSpacing: 0, lineHeight: 1.24 }}>{txt}</div>
    </AbsoluteFill>
  );
};

// ---- 3.5–5 s: the brackets close round it -------------------------------------------------------------------------------
const Chevron: React.FC<{ h: number; flip?: boolean; id: string }> = ({ h, flip, id }) => (
  <svg width={h * 0.45} height={h} viewBox="0 0 90 200" style={{ display: "block", transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.gCoral} /><stop offset="0.4" stopColor={C.gTerra} /><stop offset="0.75" stopColor={C.gSage} /><stop offset="1" stopColor={C.gTeal} /></linearGradient></defs>
    <path d="M 74 14 L 18 100 L 74 186" fill="none" stroke={`url(#${id})`} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const A4: React.FC<{ g: number }> = ({ g }) => {
  const k = expoOut(36, 0.9)(clamp01((g - 105) / 36));
  const h = lerp(1150, 440, k), xl = lerp(110, 420, k), xr = lerp(1810, 1500, k);
  const b = clamp01((g - 105) / 6);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <At x={960} y={540} s={lerp(1, 0.9, pr(g, 105, 45, SOFT))}><div style={{ fontFamily: F.serif, fontWeight: 500, fontSize: 84, color: C.ink, whiteSpace: "pre" }}>{LINE3}</div></At>
      <At x={xl} y={540} o={b}><div style={{ filter: b < 1 ? `blur(${10 * (1 - b)}px)` : undefined }}><Chevron h={h} id="chl" /></div></At>
      <At x={xr} y={540} o={b}><div style={{ filter: b < 1 ? `blur(${10 * (1 - b)}px)` : undefined }}><Chevron h={h} id="chr" flip /></div></At>
    </AbsoluteFill>
  );
};

// ---- 5–6 s: "men det ændrer sig nu" -----------------------------------------------------------------------------------
export const A5: React.FC<{ g: number }> = ({ g }) => (
  <Haze g={g} a={150}>
    <Flow g={g} size={84} y={560} words={[{ t: "men", f: 150 }, { t: "det", f: 152 }, { t: "ændrer", f: 154 }, { t: "sig", f: 156 }, { t: "nu", f: 165, color: "#ABA79F" }]} />
  </Haze>
);

// ---- 6–7 s: "Mød" sharpens out of a blur ------------------------------------------------------------------------------
export const A6: React.FC<{ g: number }> = ({ g }) => {
  const size = 300, word = "Mød", total = tw(word, size, 600);
  let cx = 960 - total / 2;
  return (
    <Haze g={g} a={150} v={1.2}>
      {word.split("").map((l, i) => {
        const w = tw(l, size, 600), left = cx; cx += w;
        const k = clamp01((g - 180 - i * 4) / 14), e = expoOut(14, 0.8)(k);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${left - 70 * (1 - e)}px, ${540 - size * 0.66 + 30 * (1 - e)}px, 0)`, opacity: clamp01(k * 2.2),
            filter: k < 1 ? `blur(${36 * (1 - e)}px)` : undefined, fontFamily: F.serif, fontWeight: 600, fontSize: size, letterSpacing: 0, lineHeight: 1.24, whiteSpace: "pre",
            backgroundImage: GRAD, backgroundSize: `${total}px 100%`, backgroundPosition: `${960 - total / 2 - left}px 0`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{l}</div>
        );
      })}
    </Haze>
  );
};

// ---- 7–8.8 s: the logo on the rising arc ------------------------------------------------------------------------------
export const A7: React.FC<{ g: number }> = ({ g }) => {
  const t = g - 210, rise = lerp(240, 660, expoOut(54, 0.95)(clamp01(t / 54)));
  const sc = lerp(1, 1.34, pr(g, 214, 50, SOFT)), wave = 1 - px(g, 210, 20, 0.84), size = 170;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #2C6F60 0%, #3D8371 60%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - 1700, top: 1080 - rise, width: 3400, height: 2200, borderRadius: "50%", filter: "blur(36px)",
        background: `radial-gradient(closest-side, ${C.gApricot} 0%, ${C.gTerra} 40%, ${C.gCoral} 60%, #F6C9B4 75%, rgba(211,235,225,0.95) 86%, rgba(211,235,225,0) 100%)` }} />
      <Grain opacity={0.2} seed={7} />
      <At x={960} y={540} s={sc}>
        <div style={{ display: "flex", alignItems: "center", gap: size * 0.26, opacity: clamp01(t / 4) }}>
          <div style={{ transform: `translateY(${wave * 18 * Math.sin(g * 0.3)}px) rotate(${wave * -12}deg)` }}><Mark size={size * 0.8} color={C.cream} id="a7m" /></div>
          <Wordmark size={size} color={C.cream} dot={C.gSand} wave={wave} g={g} reveal={0.62 + 0.38 * px(g, 210, 6)} />
        </div>
      </At>
    </AbsoluteFill>
  );
};

// ---- 8.8–10 s: words between glowing spheres ---------------------------------------------------------------------------
const Sphere: React.FC<{ x: number; y: number; d: number; kind: "sage" | "terra" }> = ({ x, y, d, kind }) => {
  const sage = kind === "sage";
  return (
    <>
      <div style={{ position: "absolute", left: x - d * 0.6, top: y - d * 0.6, width: d * 1.2, height: d * 1.2, borderRadius: "50%", background: sage ? C.gSage : C.gCoral, filter: "blur(70px)", opacity: 0.45 }} />
      <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%",
        background: sage ? "radial-gradient(circle at 42% 38%, #BFE6D7 0%, #5FA38F 30%, #2A6A5A 62%, #12302A 100%)" : "radial-gradient(circle at 58% 40%, #FFD1B8 0%, #F08A62 30%, #C9502C 64%, #4A170B 100%)",
        boxShadow: sage ? "inset 0 -18px 40px rgba(211,235,225,0.55), 0 0 60px rgba(143,192,174,0.55)" : "inset 0 18px 40px rgba(251,227,198,0.5), 0 0 60px rgba(239,138,102,0.55)" }} />
    </>
  );
};
export const A8: React.FC<{ g: number }> = ({ g }) => {
  const k = pr(g, 264, 36, MOVE);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <Sphere x={lerp(960, 1330, k)} y={lerp(-330, -120, k)} d={760} kind="sage" />
      <Sphere x={lerp(960, 560, k)} y={lerp(1430, 1230, k)} d={760} kind="terra" />
      <Grain opacity={0.14} seed={3} />
      {g < 285 ? <Words g={g} size={92} x={960} y={565} color="#fff" words={[{ t: "AI", f: 270 }, { t: "bygger", f: 272 }]} n={7} />
        : <Words g={g} size={92} x={960} y={565} color="#fff" words={[{ t: "hjemmesider", f: 285 }]} n={7} />}
    </AbsoluteFill>
  );
};

// ---- 10–12.5 s: "hurtigere end du troede muligt" on the gradient ------------------------------------------------------
export const Gradient: React.FC<{ g: number; a: number; lift?: number; children?: React.ReactNode; seed?: number }> = ({ g, a, lift = 14, children, seed = 1 }) => {
  const L = lift * pr(g, a, 60, SOFT) + 3 * Math.sin((g - a) * 0.05);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background:
      `radial-gradient(ellipse 72% 62% at 50% ${108 - L}%, ${C.gSand} 0%, ${C.gApricot} 26%, rgba(247,178,118,0) 72%),` +
      `radial-gradient(ellipse 55% 70% at 0% 0%, ${C.gTeal} 0%, rgba(61,131,113,0) 72%),` +
      `radial-gradient(ellipse 55% 70% at 100% 0%, ${C.gSage} 0%, rgba(143,192,174,0) 68%),` +
      `linear-gradient(180deg, ${C.gCoral} 0%, ${C.gTerra} 100%)` }}>
      <Grain opacity={0.22} seed={seed} />
      {children}
    </AbsoluteFill>
  );
};
export const A9: React.FC<{ g: number }> = ({ g }) => {
  const y = g < 345 ? lerp(700, 640, px(g, 315, 10)) : lerp(640, 545, px(g, 345, 16));
  return (
    <Gradient g={g} a={300} seed={11}>
      {g < 315 && <Words g={g} size={250} x={960} y={400} weight={600} grad={LIGHT_TEXT} words={[{ t: "hurtigere", f: 300, italic: true }]} n={10} blur={22} shadow="0 20px 60px rgba(150,50,20,0.18)" />}
      {g >= 315 && <Flow g={g} size={100} y={y} color="#FFF8F0" words={[{ t: "end", f: 315 }, { t: "du", f: 345 }, { t: "troede", f: 351 }, { t: "muligt", f: 358 }]} shadow="0 8px 30px rgba(150,50,20,0.2)" />}
    </Gradient>
  );
};

// ---- 12.5–15 s: "Hele processen tager under" ----------------------------------------------------------------------------
export const A10: React.FC<{ g: number }> = ({ g }) => {
  const size = 124, sp = tw(" ", size), wH = tw("Hele", size), wP = tw("processen", size), wT = tw("tager", size);
  const aP = 960 - (wH + sp + wP) / 2 + wH + sp, bP = 960 - (wP + sp + wT) / 2;
  const shift = (bP - aP) * px(g, 405, 10, 0.78);
  const st = (left: number, op = 1): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, transform: `translate3d(${left}px, ${540 - size * 0.62}px, 0)`, opacity: op,
    fontFamily: F.serif, fontWeight: 600, fontSize: size, whiteSpace: "pre", lineHeight: 1.24, backgroundImage: DARK_TEXT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });
  const tk = clamp01((g - 405) / 8), te = expoOut(8, 0.78)(tk);
  return (
    <Haze g={g} a={366} v={2.1}>
      {g < 390 && <Words g={g} size={230} x={960} y={540} weight={600} grad={DARK_TEXT} words={[{ t: "Hele", f: 378 }]} n={8} />}
      {g >= 390 && g < 420 && (
        <>
          <div style={st(aP - wH - sp + shift, 1 - pr(g, 405, 8))}>Hele</div>
          {g < 405 ? <Words g={g} size={size} x={aP} y={540} weight={600} align="left" grad={DARK_TEXT} words={[{ t: "processen", f: 390 }]} n={8} /> : <div style={st(aP + shift)}>processen</div>}
          {g >= 405 && <div style={{ ...st(bP + wP + sp + 30 * (1 - te), tk), filter: tk < 1 ? `blur(${12 * (1 - te)}px)` : undefined }}>tager</div>}
        </>
      )}
      {g >= 420 && <At x={960} y={540} s={lerp(1, 1.07, pr(g, 420, 30, SOFT))}><div style={{ position: "relative", width: 1, height: 1 }}>
        <Words g={g} size={190} x={0} y={0} weight={600} grad={DARK_TEXT} words={[{ t: "under", f: 420 }]} n={8} /></div></At>}
    </Haze>
  );
};

// ---- 15–16.5 s: the count down to 5 ---------------------------------------------------------------------------------------
export const A11: React.FC<{ g: number }> = ({ g }) => {
  const t = g - 450, v = t >= 20 ? 5 : Math.round(lerp(60, 5, expoOut(20, 0.84)(t / 20)));
  const label = String(v), size = 540, w = tw(label, size, 600) * 0.92;
  const dotX = 960 + w / 2 - 12, dotY = 690;
  const draw = px(g, 450, 16, 0.82);
  const d = `M -80 860 C 220 720 380 1010 640 920 S ${dotX - 170} ${dotY + 50} ${dotX} ${dotY}`;
  const nk = clamp01(t / 7);
  return (
    <Haze g={g} a={440} v={3.0}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs><linearGradient id="wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.gTeal} /><stop offset="0.45" stopColor={C.gSage} /><stop offset="0.75" stopColor={C.gCoral} /><stop offset="1" stopColor={C.gTerra} /></linearGradient></defs>
        <path d={d} fill="none" stroke="url(#wave)" strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} style={{ filter: "drop-shadow(0 0 14px rgba(239,138,102,0.5))" }} />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${470 - size * 0.66 + 30 * (1 - expoOut(7, 0.78)(nk))}px)`, opacity: nk,
        fontFamily: F.serif, fontStyle: "italic", fontWeight: 600, fontSize: size, letterSpacing: -12, lineHeight: 1.24, whiteSpace: "pre",
        backgroundImage: DARK_TEXT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{label}</div>
      <div style={{ position: "absolute", left: dotX - 20, top: dotY - 20, width: 40, height: 40, borderRadius: 20, background: "#fff", opacity: clamp01(draw * 1.4 - 0.4),
        boxShadow: "0 0 26px 8px rgba(255,255,255,0.75), 0 0 50px rgba(239,138,102,0.6)" }} />
    </Haze>
  );
};

// ---- 16.5–18 s: "minutter. Ingen kode nødvendig" -------------------------------------------------------------------------
export const A12: React.FC<{ g: number }> = ({ g }) => (
  <Haze g={g} a={486} v={g < 510 ? 4 : g < 525 ? 5.2 : 6.4}>
    {g < 510 && <Words g={g} size={80} x={960} y={560} weight={600} grad={DARK_TEXT} words={[{ t: "minutter.", f: 495 }, { t: "Ingen", f: 499 }]} n={7} />}
    {g >= 510 && g < 525 && <Words g={g} size={160} x={960} y={560} weight={600} grad={DARK_TEXT} words={[{ t: "kode", f: 510 }]} n={7} />}
    {g >= 525 && <Words g={g} size={250} x={960} y={560} weight={600} grad={DARK_TEXT} words={[{ t: "nødvendig", f: 525 }]} n={8} />}
  </Haze>
);

// ---- 18–19 s: the flower, and its star opening onto a website -----------------------------------------------------------
const astroid = (R: number, cx: number, cy: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 96; i++) { const t = (i / 96) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t); pts.push(`${cx + R * Math.sign(c) * Math.abs(c) ** 3}px ${cy + R * Math.sign(s) * Math.abs(s) ** 3}px`); }
  return `polygon(${pts.join(",")})`;
};
const FLOWER = (() => {
  // eight round petals round a centre, as one path
  let d = "";
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2, x = 500 + 290 * Math.cos(a), y = 500 + 290 * Math.sin(a); d += `M ${x - 190} ${y} a 190 190 0 1 0 380 0 a 190 190 0 1 0 -380 0 `; }
  return d + "M 310 500 a 190 190 0 1 0 380 0 a 190 190 0 1 0 -380 0";
})();
export const A13: React.FC<{ g: number }> = ({ g }) => {
  const t = g - 540, sc = lerp(0.82, 1.18, pr(g, 540, 16, SOFT)), rot = lerp(-8, 14, pr(g, 540, 16, SOFT));
  const R = t < 12 ? 0 : 160 * Math.pow(1.32, t - 12);
  return (
    <AbsoluteFill style={{ background: "#5C6E67", overflow: "hidden" }}>
      <Glow x={1700} y={150} w={900} h={500} color={C.gCoral} blur={120} opacity={0.6} rot={-20} />
      <At x={940} y={560} s={sc}>
        <svg width={1000} height={1000} viewBox="0 0 1000 1000" style={{ transform: `rotate(${rot}deg)`, display: "block", filter: "blur(1.5px)" }}>
          <defs><radialGradient id="pet" cx="0.5" cy="0.5" r="0.62"><stop offset="0" stopColor="#FFF6F0" /><stop offset="0.45" stopColor="#F7C9B6" /><stop offset="0.8" stopColor={C.gCoral} /><stop offset="1" stopColor={C.gTerra} /></radialGradient></defs>
          <path d={FLOWER} fill="url(#pet)" fillRule="nonzero" />
          <path d="M500 410 C 510 470 530 490 590 500 C 530 510 510 530 500 590 C 490 530 470 510 410 500 C 470 490 490 470 500 410 Z" fill={C.gTerra} />
        </svg>
      </At>
      {R > 0 && (
        <AbsoluteFill style={{ background: "#F6D6C9" }}>
          <div style={{ position: "absolute", inset: 0, clipPath: astroid(R, 960, 560) }}>
            <div><Scaled w={1920} r={0}><SiteCard s={SITES[6]} /></Scaled></div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---- 19–23 s: the showcase ---------------------------------------------------------------------------------------------
const GRID = (() => {
  const order = [0, 1, 2, 3, 4, 8, 9, 6, 5, 7, 2, 4, 0, 3, 1];
  const out: { c: number; r: number; i: number }[] = []; let k = 0;
  for (let r = -1; r <= 1; r++) for (let c = -2; c <= 2; c++) out.push({ c, r, i: r === 0 && c === 0 ? 6 : r === 1 && c === 1 ? 7 : order[k++ % order.length] });
  return out;
})();
const CW = 760, CH = CW * BASE_H / BASE_W, PX = 810, PY = 520;
export const A14: React.FC<{ g: number }> = ({ g }) => {
  if (g < 585) return <AbsoluteFill><div style={{ transform: `scale(${lerp(1.05, 1, pr(g, 570, 15))})`, transformOrigin: "50% 50%" }}><div><Scaled w={1920} r={0}><SiteCard s={SITES[6]} /></Scaled></div></div></AbsoluteFill>;
  if (g < 630) {
    const full = 1920 / CW;
    let s = lerp(full, 0.6, expoOut(20, 0.84)(clamp01((g - 585) / 20)));
    const m = pr(g, 606, 24, MOVE);
    s = lerp(s, full, m);
    const fx = lerp(960, 960 + PX, m), fy = lerp(lerp(540 - CH / 2 + 540 / full, 540, expoOut(20, 0.84)(clamp01((g - 585) / 20))), 540 + PY - CH / 2 + 540 / full, m);
    return (
      <AbsoluteFill style={{ background: "#121815", overflow: "hidden" }}>
        {GRID.map((p, j) => {
          const wx = 960 + p.c * PX, wy = 540 + p.r * PY, sx = (wx - fx) * s + 960, sy = (wy - fy) * s + 540;
          if (Math.abs(sx - 960) > 960 + CW * s / 2 || Math.abs(sy - 540) > 540 + CH * s / 2) return null;
          return <At key={j} x={sx} y={sy} s={s}><Scaled w={CW} r={16} shadow="0 30px 60px -30px rgba(0,0,0,0.6)"><SiteCard s={SITES[p.i]} /></Scaled></At>;
        })}
        <Grain opacity={0.08} seed={5} />
      </AbsoluteFill>
    );
  }
  if (g < 645) return <AbsoluteFill><div style={{ transform: `scale(${lerp(1, 1.04, pr(g, 630, 15, SOFT))})` }}><div><Scaled w={1920} r={0}><SiteCard s={SITES[7]} /></Scaled></div></div></AbsoluteFill>;
  return <LaptopRock g={g} />;
};

/** A laptop showing a site, in a dark stone studio (the reference's laptop on rocks). */
export const Laptop: React.FC<{ w: number; children: React.ReactNode; tilt?: number }> = ({ w, children, tilt = -16 }) => {
  const sh = w * 0.64, bez = w * 0.022;
  return (
    <div style={{ perspective: 2400, width: w * 1.16 }}>
      <div style={{ transform: `rotateX(6deg) rotateY(${tilt}deg)`, transformStyle: "preserve-3d", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: w, height: sh, background: "#0D0E0E", borderRadius: w * 0.03, padding: bez, boxSizing: "border-box", boxShadow: "inset 0 0 0 2px #3A3C3B" }}>
          <div style={{ width: w - bez * 2, height: sh - bez * 2, overflow: "hidden", borderRadius: w * 0.01, position: "relative" }}>
            <Scaled w={w - bez * 2} r={0}>{children}</Scaled>
          </div>
        </div>
        <div style={{ width: w * 1.16, height: w * 0.045, background: "linear-gradient(180deg, #C9CBCB 0%, #8D9090 55%, #4A4C4C 100%)", clipPath: "polygon(3% 0, 97% 0, 100% 100%, 0 100%)", borderRadius: `0 0 ${w * 0.02}px ${w * 0.02}px` }} />
        <div style={{ width: w * 1.1, height: w * 0.06, marginTop: -w * 0.01, background: "radial-gradient(closest-side, rgba(0,0,0,0.6), rgba(0,0,0,0))", filter: "blur(8px)" }} />
      </div>
    </div>
  );
};
const LaptopRock: React.FC<{ g: number }> = ({ g }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 25%, #5A5E5B 0%, #2A2E2C 55%, #121413 100%)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -200, right: -200, top: 760, height: 520, background: "radial-gradient(ellipse 60% 70% at 50% 20%, #3E423F 0%, #1A1C1B 70%)",
      borderRadius: "48% 52% 0 0 / 30% 26% 0 0", filter: "blur(2px)" }} />
    <At x={960} y={520} s={lerp(1, 1.07, pr(g, 645, 45, SOFT))}><Laptop w={1080}><SiteCard s={SITES[7]} /></Laptop></At>
    <Grain opacity={0.3} seed={9} />
  </AbsoluteFill>
);

export { DARK_TEXT, LIGHT_TEXT };
