// COYOR clothing showcase (vertical 1080x1920, 60 fps, 29 s). Karl, 18 Nov: "purely the clothing, not the game;
// professional, natural, not so much animation; the mockups and the models, make something beautiful of it".
// Editorial lookbook: a cream studio, the site's own mockups and model shots (white backgrounds, multiplied onto the
// panels so they sit seamlessly), quiet type (Barlow Condensed + DM Sans, the site's fonts), slow pushes and clean slides.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";

export const FPS = 60, DUR = 29.0;
const C = { cream: "#F4EFE6", ink: "#111111", soft: "rgba(17,17,17,.62)", gold: "#C9A24E", gold2: "#E9C66A" };
const H = "'Barlow Condensed', sans-serif", B = "'DM Sans', sans-serif";
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = Easing.bezier(0.65, 0, 0.35, 1), easeOut = Easing.bezier(0.16, 1, 0.3, 1), easeIn = Easing.bezier(0.5, 0, 0.75, 0);
const E = (T: number, t0: number, d: number, f = ease) => f(clamp((T - t0) / d));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

const FONTS: [string, string, string, string][] = [
  ["Barlow Condensed", "BarlowCondensed-700.woff2", "700", "normal"], ["Barlow Condensed", "BarlowCondensed-800.woff2", "800", "normal"],
  ["Barlow Condensed", "BarlowCondensed-900.woff2", "900", "normal"], ["DM Sans", "DMSans-500.woff2", "500", "normal"], ["DM Sans", "DMSans-700.woff2", "700", "normal"],
];
const useFonts = () => {
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = FONTS.map(([f, file, w, s]) => `@font-face{font-family:'${f}';src:url(${staticFile("fonts/" + file)}) format('woff2');font-weight:${w};font-style:${s}}`).join("\n");
    document.head.appendChild(el);
    Promise.all(FONTS.map(([f, , w, s]) => document.fonts.load(`${s} ${w} 80px '${f}'`))).then(() => { setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};

// a product photo (white studio background) multiplied onto whatever is behind it, so it sits on the panel seamlessly
const Pic: React.FC<{ f: string; x: number; y: number; w: number; h: number; push?: number; op?: number; fit?: "contain" | "cover"; pos?: string; dx?: number; dy?: number }> =
  ({ f, x, y, w, h, push = 1, op = 1, fit = "contain", pos = "50% 50%", dx = 0, dy = 0 }) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", opacity: op, mixBlendMode: "multiply" }}>
      <Img src={staticFile("img/" + f)} style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: pos, transform: `translate(${dx}px, ${dy}px) scale(${push})`, transformOrigin: pos }} />
    </div>
  );

// a quiet label: name in Barlow, price/detail in DM Sans, rising in through its own mask
const Label: React.FC<{ T: number; t0: number; out?: number; x: number; y: number; name: string; sub?: string; align?: "left" | "right" | "center"; size?: number; color?: string; light?: boolean }> =
  ({ T, t0, out = 99, x, y, name, sub, align = "left", size = 64, color = C.ink, light = false }) => {
    const p = E(T, t0, 0.7, easeOut), q = E(T, out, 0.45, easeIn);
    if (p <= 0 || q >= 1) return null;
    const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: `translateX(${tx})`, textAlign: align, opacity: 1 - q }}>
        <div style={{ overflow: "hidden", paddingBottom: 4 }}>
          <div style={{ transform: `translateY(${(1 - p) * 110}%)`, fontFamily: H, fontWeight: 800, fontSize: size, letterSpacing: size * 0.08, color: light ? C.cream : color, whiteSpace: "nowrap", lineHeight: 1, textShadow: light ? "0 2px 14px rgba(0,0,0,.45)" : "none" }}>{name}</div>
        </div>
        {sub && <div style={{ overflow: "hidden" }}>
          <div style={{ transform: `translateY(${(1 - E(T, t0 + 0.15, 0.7, easeOut)) * 110}%)`, fontFamily: B, fontWeight: 500, fontSize: size * 0.5, letterSpacing: 3, color: light ? "rgba(244,239,230,.85)" : C.soft, marginTop: 10, whiteSpace: "nowrap", textShadow: light ? "0 2px 12px rgba(0,0,0,.45)" : "none" }}>{sub}</div>
        </div>}
      </div>
    );
  };

// the wordmark: COYOR + the gold dot, letters rising through a mask
const Wordmark: React.FC<{ T: number; t0: number; size: number; x: number; y: number; color?: string; instant?: boolean }> = ({ T, t0, size, x, y, color = C.ink, instant }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", display: "flex", alignItems: "baseline", fontFamily: H, fontWeight: 900, fontSize: size, letterSpacing: size * 0.03, color, lineHeight: 1 }}>
    {"COYOR".split("").map((ch, i) => (
      <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.04 }}>
        <div style={{ transform: `translateY(${instant ? 0 : (1 - E(T, t0 + i * 0.07, 0.75, easeOut)) * 105}%)` }}>{ch}</div>
      </div>
    ))}
    <div style={{ width: size * 0.17, height: size * 0.17, borderRadius: "50%", background: C.gold2, marginLeft: size * 0.04, transform: `scale(${instant ? 1 : E(T, t0 + 0.55, 0.45, easeOut)})` }} />
  </div>
);

// ---------- scenes ----------
const Open: React.FC<{ T: number }> = ({ T }) => {
  const up = E(T, 2.55, 0.7);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${-760 * up}px) scale(${mix(1, 0.32, up)})`, transformOrigin: "540px 960px" }}>
        <Wordmark T={T} t0={0.15} size={250} x={540} y={900} />
        <div style={{ position: "absolute", left: 540, top: 1060, transform: "translateX(-50%)", fontFamily: B, fontWeight: 500, fontSize: 40, letterSpacing: 6, color: C.soft,
          opacity: E(T, 1.1, 0.8) * (1 - up * 2), whiteSpace: "nowrap" }}>CREATOR OF YOUR OWN REALITY.</div>
      </div>
    </AbsoluteFill>
  );
};

// Karl (18 Nov): "the transitions must be better". Every scene change is one smooth blur-push: the old scene drifts up,
// softens and fades while the new one rises in from below and comes into focus (0.7 s, overlapping).
const Scene: React.FC<{ T: number; tIn: number; tOut: number; children: React.ReactNode }> = ({ T, tIn, tOut, children }) => {
  const pin = tIn <= 0 ? 1 : E(T, tIn, 0.7), pout = E(T, tOut, 0.7);
  if (pin <= 0 || pout >= 1) return null;
  const y = (1 - pin) * 9 - pout * 9, blur = (1 - pin) * 18 + pout * 18, sc = 1 + 0.04 * (1 - pin) - 0.03 * pout;
  return (
    <AbsoluteFill style={{ background: C.cream, opacity: Math.min(pin * 1.4, 1) * (1 - pout), transform: `translateY(${y}%) scale(${sc})`, filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none" }}>
      {children}
    </AbsoluteFill>
  );
};
// a camera on one photo: zoom and focus point move together between keys (a push into a detail, a pan to the next one)
type Cam = { t: number; d: number; ox: number; oy: number; z: number };
const camAt = (T: number, keys: Cam[]) => {
  let { ox, oy, z } = keys[0];
  for (const k of keys) { const p = E(T, k.t, k.d); ox = mix(ox, k.ox, p); oy = mix(oy, k.oy, p); z = mix(z, k.z, p); }
  return { ox, oy, z };
};

// flat lay -> worn: the two mockups lie side by side, then the model wearing them takes their place
const FlatToModel: React.FC<{ T: number; t0: number; top: string; bottom: string; model: string; name: string; sub: string;
  crops: { name: string; sub?: string; ox: number; oy: number; zoom: number; t: number; light?: boolean }[]; end: number }> = ({ T, t0, top, bottom, model, name, sub, crops, end }) => {
  const lay = E(T, t0 + 0.1, 0.8), worn = E(T, t0 + 1.45, 1.1);
  // the camera: the model contained in the frame, a slow push, then a continuous move into each detail
  const cam = camAt(T, [{ t: t0 + 1.45, d: 3, ox: 50, oy: 50, z: 1.1 }, { t: t0 + 1.45, d: 3, ox: 50, oy: 48, z: 1.16 },
    ...crops.map((c) => ({ t: c.t - 0.35, d: 1.0, ox: c.ox, oy: c.oy, z: c.zoom }))]);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      {/* the flat lay */}
      <Pic f={top} x={60 - 160 * (1 - lay)} y={330 - 40 * worn} w={620} h={700} op={lay} push={mix(1.05, 1, lay) * (1 + 0.06 * worn)} />
      <Pic f={bottom} x={460 + 160 * (1 - lay)} y={860 - 40 * worn} w={560} h={820} op={lay} push={mix(1.05, 1, lay) * (1 + 0.06 * worn)} />
      {/* worn: the model, then slow crops on the details */}
      <div style={{ position: "absolute", inset: 0, background: C.cream, WebkitMaskImage: `linear-gradient(180deg, #000 ${worn * 130 - 25}%, transparent ${worn * 130 + 5}%)`, maskImage: `linear-gradient(180deg, #000 ${worn * 130 - 25}%, transparent ${worn * 130 + 5}%)` }}>
        <Pic f={model} x={0} y={0} w={1080} h={1920} push={cam.z} pos={`${cam.ox}% ${cam.oy}%`} />
      </div>
      <Label T={T} t0={t0 + 2.0} out={crops.length ? crops[0].t - 0.15 : end} x={90} y={1690} name={name} sub={sub} />
      {crops.map((c, i) => <Label key={i} T={T} t0={c.t + 0.4} out={i < crops.length - 1 ? crops[i + 1].t - 0.15 : end} x={90} y={1690} name={c.name} sub={c.sub} light={c.light} />)}
    </AbsoluteFill>
  );
};
const Chenille: React.FC<{ T: number }> = ({ T }) => (
  <FlatToModel T={T} t0={3.2} top="black-joggers-1.jpg" bottom="black-joggers-3.jpg" model="black-joggers-0.png" name="CHENILLE SET" sub="€129,99" end={9.6}
    crops={[{ name: "CHENILLE SWEATSHIRT", sub: "€79,99", ox: 60, oy: 36.6, zoom: 2.1, t: 6.6, light: true }, { name: "CHENILLE JOGGERS", sub: "€69,99", ox: 52, oy: 59.8, zoom: 2.0, t: 8.1, light: true }]} />
);
const DiaZipSet: React.FC<{ T: number }> = ({ T }) => (
  <FlatToModel T={T} t0={17.2} top="set-1.jpg" bottom="set-2.jpg" model="set-0.png" name="DIAZIP SET" sub="€129,99" end={22.9}
    crops={[{ name: "DIAZIP HOODIE", ox: 52, oy: 37.3, zoom: 2.0, t: 20.6 }]} />
);
const COLOURS = [
  { n: "BLACK", f: "chenille-varsity-set-black-0.jpg", bg: "#E6E3DE", dot: "#1b1b1b" },
  { n: "WHITE", f: "chenille-varsity-set-white-0.png", bg: "#E8DFD0", dot: "#ffffff" },
  { n: "BABY PINK", f: "chenille-varsity-set-pink-0.jpg", bg: "#F5DCE0", dot: "#F2A9B9" },
  { n: "SKY BLUE", f: "chenille-varsity-set-sky-blue-0.png", bg: "#D7E6F2", dot: "#8FB8DE" },
  { n: "PASTEL PEACH", f: "pastel-peach-0.jpg", bg: "#F9DDCB", dot: "#F3B48E" },
];
const Varsity: React.FC<{ T: number }> = ({ T }) => {
  const t0 = 9.6, first = 10.65, each = 1.22;
  const k = Math.max(-1, Math.min(4, Math.floor((T - first) / each)));
  const slide = k >= 0 ? E(T, first + k * each, 0.75) : 0;
  const panel = (j: number, off: number) => {
    const c = COLOURS[j];
    return (
      <div key={j} style={{ position: "absolute", left: off, top: 0, width: 1080, height: 1920, background: c.bg }}>
        <Pic f={c.f} x={70 + off * 0.35} y={370 + 10 * Math.sin((T - j) * 1.6)} w={940} h={1120} push={mix(1.0, 1.04, clamp((T - first - j * each) / 1.9))} />
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: C.cream, overflow: "hidden" }}>
      {/* the intro card */}
      {T < first + 0.8 && <>
        <Label T={T} t0={t0 + 0.15} out={first - 0.1} x={540} y={820} name="THE VARSITY SET" align="center" size={120} />
        <Label T={T} t0={t0 + 0.45} out={first - 0.1} x={540} y={980} name="5 COLOURWAYS · €79,99" align="center" size={44} color={C.soft} />
      </>}
      {k >= 0 && <>
        {k > 0 && panel(k - 1, -1080 * slide)}
        {panel(k, 1080 * (1 - slide))}
        <div style={{ position: "absolute", left: 540, top: 1600, transform: "translateX(-50%)", textAlign: "center" }}>
          <div key={k} style={{ overflow: "hidden" }}>
            <div style={{ transform: `translateY(${(1 - E(T, first + k * each + 0.25, 0.6, easeOut)) * 110}%)`, fontFamily: H, fontWeight: 800, fontSize: 84, letterSpacing: 7, color: C.ink, whiteSpace: "nowrap" }}>{COLOURS[k].n}</div>
          </div>
          <div style={{ display: "flex", gap: 22, justifyContent: "center", marginTop: 26 }}>
            {COLOURS.map((c, j) => <div key={j} style={{ width: 26, height: 26, borderRadius: "50%", background: c.dot, border: "2px solid rgba(17,17,17,.35)",
              transform: `scale(${j === k ? 1.35 : 1})`, opacity: j <= k ? 1 : 0.45 }} />)}
          </div>
        </div>
      </>}
    </AbsoluteFill>
  );
};

const More: React.FC<{ T: number }> = ({ T }) => {
  const t0 = 22.9, items = [{ f: "coyor-cy-jeans-0.jpg", n: "CY JEANS", p: "€95,99" }, { f: "coyor-cy-zip-up-hoodi-0.jpg", n: "MONO CY ZIP-UP", p: "€79,99" }, { f: "coyor-puffer-logo-t-shirt-0.png", n: "CHENILLE T-SHIRT", p: "€49,99" }];
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      {items.map((it, i) => {
        const p = E(T, t0 + 0.2 + i * 0.35, 0.8), y = 230 + i * 540;
        return <React.Fragment key={i}>
          <Pic f={it.f} x={(i % 2 ? 480 : 60) + (i % 2 ? 1 : -1) * 120 * (1 - p)} y={y + 8 * Math.sin(T * 1.4 + i * 2)} w={540} h={500} op={p} />
          <Label T={T} t0={t0 + 0.5 + i * 0.35} out={25.35} x={i % 2 ? 90 : 990} y={y + 200} name={it.n} sub={it.p} align={i % 2 ? "left" : "right"} size={54} />
        </React.Fragment>;
      })}
    </AbsoluteFill>
  );
};

const End: React.FC<{ T: number }> = ({ T }) => {
  const t0 = 25.4;
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Pic f="black-joggers-0.png" x={-140 - 60 * (1 - E(T, t0 + 0.1, 1.0))} y={480} w={760} h={950} op={E(T, t0 + 0.1, 0.8)} push={mix(1.03, 1, E(T, t0, 2))} />
      <Pic f="set-0.png" x={460 + 60 * (1 - E(T, t0 + 0.25, 1.0))} y={480} w={760} h={950} op={E(T, t0 + 0.25, 0.8)} push={mix(1.03, 1, E(T, t0, 2))} />
      <Wordmark T={T} t0={t0 + 0.5} size={200} x={540} y={250} />
      <Label T={T} t0={t0 + 1.0} x={540} y={370} name="CREATOR OF YOUR OWN REALITY." align="center" size={38} color={C.soft} />
      <div style={{ position: "absolute", left: 540, top: 1560, transform: `translate(-50%,-50%) translateY(${30 * (1 - E(T, t0 + 1.3, 0.7, easeOut))}px)`, opacity: E(T, t0 + 1.3, 0.6),
        padding: "26px 60px", borderRadius: 60, background: C.ink, color: C.cream, fontFamily: B, fontWeight: 700, fontSize: 40, letterSpacing: 6, whiteSpace: "nowrap" }}>SHOP NOW · COYORCLO.COM</div>
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const T = useCurrentFrame() / FPS;
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.cream }} />;
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Scene T={T} tIn={0} tOut={2.9}><Open T={T} /></Scene>
      <Scene T={T} tIn={2.9} tOut={9.4}><Chenille T={T} /></Scene>
      <Scene T={T} tIn={9.4} tOut={16.9}><Varsity T={T} /></Scene>
      <Scene T={T} tIn={16.9} tOut={22.6}><DiaZipSet T={T} /></Scene>
      <Scene T={T} tIn={22.6} tOut={25.1}><More T={T} /></Scene>
      <Scene T={T} tIn={25.1} tOut={99}><End T={T} /></Scene>
    </AbsoluteFill>
  );
};
