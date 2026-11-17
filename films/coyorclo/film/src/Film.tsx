// COYOR RUN vertical ad, v2 (Karl, 17 Nov: "it must be fullscreen; understand the platform: a game that promotes their
// clothing"). FULLSCREEN 1080x1920 gameplay: the game rendered at 4K, a 9:16 camera following each runner
// (tools/capture_v.js). The platform: play -> earn CY coins -> real discounts on COYOR clothing (the in-game COYOR Shop:
// 10/25/50/100% off), unlock and equip the fits in the game, wear them IRL. 60 fps, 28 s, English.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender, spring, staticFile, useCurrentFrame } from "remotion";
import { Hand, handAt } from "./hand";
import { Burst, Shock, Tap, Swipe, Plus, Speed, Sheen, Twinkles, Dust, shakeAt, Rays, Layer, rnd } from "./fx";

export const FPS = 60, DUR = 28.0;
const C = { bg: "#0B0B0E", gold: "#E9C66A", gold2: "#FFDD70", cream: "#F8F1E2", muted: "rgba(248,241,226,.66)" };
const H = "'Barlow Condensed', sans-serif", B = "'DM Sans', sans-serif";
const GOLD = `linear-gradient(100deg, ${C.gold2}, ${C.gold} 58%, #C99A45)`;
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = Easing.bezier(0.65, 0, 0.35, 1), easeOut = Easing.bezier(0.16, 1, 0.3, 1), easeIn = Easing.bezier(0.5, 0, 0.75, 0);
const E = (T: number, t0: number, d: number, f = ease) => f(clamp((T - t0) / d));
const S = (T: number, t0: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  T < t0 ? 0 : spring({ frame: (T - t0) * FPS, fps: FPS, config: { damping: 13, stiffness: 170, mass: 0.9, ...cfg } });
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

const FONTS: [string, string, string, string][] = [
  ["Barlow Condensed", "BarlowCondensed-800.woff2", "800", "normal"], ["Barlow Condensed", "BarlowCondensed-900.woff2", "900", "normal"],
  ["Barlow Condensed", "BarlowCondensed-800i.woff2", "800", "italic"], ["Barlow Condensed", "BarlowCondensed-900i.woff2", "900", "italic"],
  ["DM Sans", "DMSans-500.woff2", "500", "normal"], ["DM Sans", "DMSans-700.woff2", "700", "normal"],
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

// ---------- pieces ----------
const NAMES = ["abdel", "bram", "paulie", "rahim"];
const Runner: React.FC<{ i: number; T: number; x: number; y: number; h: number; pose?: string; op?: number; sc?: number }> = ({ i, T, x, y, h, pose = "run", op = 1, sc = 1 }) => {
  const n = pose === "jump" ? 0 : Math.floor(T * (pose === "run" ? 48 : 30)) % 24, k = (h / 582) * sc;
  return (
    <div style={{ position: "absolute", left: x - 573 * k, top: y - 604 * k, width: 800 * k, height: 900 * k, opacity: op, filter: "drop-shadow(0 18px 22px rgba(0,0,0,.55))" }}>
      <Img src={staticFile(`sprites/${NAMES[i]}-${pose}-${String(n).padStart(2, "0")}.png`)} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
const Coin: React.FC<{ x: number; y: number; s: number; spin?: number; op?: number }> = ({ x, y, s, spin = 0, op = 1 }) => (
  <div style={{ position: "absolute", left: x - 50 * s, top: y - 50 * s, width: 100 * s, height: 100 * s, opacity: op, transform: `scaleX(${Math.max(0.08, Math.abs(Math.cos(spin)))})`,
    filter: `drop-shadow(0 ${6 * s}px ${10 * s}px rgba(0,0,0,.45)) drop-shadow(0 0 ${14 * s}px rgba(255,221,112,.5))` }}>
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs><radialGradient id="cg" cx=".38" cy=".32" r=".75"><stop offset="0" stopColor="#FFF2C4" /><stop offset=".45" stopColor="#F2CF6E" /><stop offset="1" stopColor="#B4842F" /></radialGradient></defs>
      <circle cx="50" cy="50" r="47" fill="url(#cg)" /><circle cx="50" cy="50" r="38" fill="none" stroke="#9C6E22" strokeWidth="3" opacity=".55" />
      <text x="50" y="63" fontFamily={H} fontWeight={900} fontStyle="italic" fontSize="38" fill="#5E3F0C" textAnchor="middle">CY</text>
    </svg>
  </div>
);
const Slam: React.FC<{ text: string; T: number; t0: number; x: number; y: number; size: number; color?: string; grad?: string; out?: number }> = ({ text, T, t0, x, y, size, color = C.cream, grad, out = 99 }) => {
  if (T < t0) return null;
  const p = S(T, t0, { damping: 11, stiffness: 220, mass: 0.7 }), o = 1 - E(T, out, 0.2, easeIn);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${mix(1.6, 1, p) * (1 + 0.15 * E(T, out, 0.2, easeIn))}) skewX(-5deg)`, opacity: clamp((T - t0) / 0.06) * o,
      fontFamily: H, fontWeight: 900, fontStyle: "italic", fontSize: size, lineHeight: 0.9, whiteSpace: "nowrap", color,
      filter: "drop-shadow(0 10px 26px rgba(0,0,0,.55))", ...(grad ? { background: grad, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" } : {}) }}>{text}</div>
  );
};
const Pill: React.FC<{ children: React.ReactNode; x: number; y: number; op: number; s?: number; gold?: boolean }> = ({ children, x, y, op, s = 1, gold }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: op, padding: "14px 30px", borderRadius: 50, whiteSpace: "nowrap",
    background: gold ? GOLD : "rgba(11,11,14,.78)", border: gold ? "none" : `2px solid ${C.gold}`, color: gold ? C.bg : C.gold, fontFamily: B, fontWeight: 700, fontSize: 32, letterSpacing: 4,
    boxShadow: "0 12px 40px rgba(0,0,0,.45)" }}>{children}</div>
);

// ---------- 1. fullscreen gameplay shots ----------
type Shot = { t0: number; t1: number; take: string; from: number; word: string; name?: string; i?: number; wordY?: number };
const SHOTS: Shot[] = [
  { t0: 0.0, t1: 2.1, take: "abdel", from: 4.6, word: "" },
  { t0: 2.1, t1: 4.3, take: "abdel", from: 0.4, word: "RUN.", name: "ABDEL", i: 0 },
  { t0: 4.3, t1: 6.4, take: "bram", from: 3.6, word: "FLY.", name: "BRAM", i: 1, wordY: 1500 },
  { t0: 6.4, t1: 8.5, take: "paulie", from: 1.6, word: "DODGE.", name: "PAULIE", i: 2 },
  { t0: 8.5, t1: 10.4, take: "rahim", from: 0.9, word: "BLAST.", name: "RAHIM", i: 3 },
  { t0: 10.4, t1: 12.6, take: "boss", from: 0.6, word: "BEAT THE BOSS.", name: "RAHIM", i: 3, wordY: 620 },
];
const Gameplay: React.FC<{ T: number }> = ({ T }) => {
  const s = SHOTS.find((x) => T >= x.t0 && T < x.t1);
  if (!s) return null;
  const u = T - s.t0, punch = mix(1.14, 1, S(T, s.t0, { damping: 16, stiffness: 120 })) * (1 + 0.025 * u);
  const coins = Math.floor(mix(0, 2480, E(T, 2.1, 10.5, (x) => x)));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        <Sequence from={Math.round(s.t0 * FPS)} durationInFrames={Math.round((s.t1 - s.t0) * FPS) + 1} layout="none">
          <OffthreadVideo src={staticFile(`vtakes/${s.take}.mp4`)} startFrom={Math.round(s.from * FPS)} muted style={{ width: 1080, height: 1920 }} />
        </Sequence>
      </AbsoluteFill>
      {s.take === "boss" && <AbsoluteFill style={{ background: "linear-gradient(180deg, #05060f 0%, #070a1c 34%, rgba(7,10,28,0) 52%)" }} />}
      {s.take === "boss" && <Stars T={T} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,8,.62) 0%, rgba(5,5,8,0) 30%, rgba(5,5,8,0) 78%, rgba(5,5,8,.5) 100%)" }} />
      {/* HUD: the coins earned, the runner */}
      {T > 2.1 && <div style={{ position: "absolute", left: 56, top: 70, display: "flex", alignItems: "center", gap: 14, padding: "10px 26px 10px 12px", borderRadius: 40,
        background: "rgba(11,11,14,.72)", border: "2px solid rgba(233,198,106,.5)", opacity: clamp((T - 2.1) / 0.2) }}>
        <div style={{ position: "relative", width: 56, height: 56 }}><Coin x={28} y={28} s={0.56} spin={T * 4} /></div>
        <div style={{ fontFamily: H, fontWeight: 900, fontSize: 52, color: C.gold2, letterSpacing: 1 }}>{coins.toLocaleString("en-US")}</div>
      </div>}
      {s.name && <Pill x={890} y={106} op={clamp(u / 0.15)} s={mix(0.7, 1, S(T, s.t0 + 0.05))}>{s.name}</Pill>}
      {s.word && <Slam text={s.word} T={T} t0={s.t0 + 0.06} x={540} y={s.wordY ?? 360} size={s.word.length > 8 ? 170 : 300} grad={GOLD} out={s.t1 - 0.2} />}
      {s.t0 === 0 && <>
        <Slam text="PLAY THE GAME." T={T} t0={0.08} x={540} y={330} size={168} out={1.95} />
        <Slam text="WEAR THE FIT." T={T} t0={0.75} x={540} y={500} size={168} grad={GOLD} out={1.95} />
        <Pill x={540} y={660} op={clamp((T - 1.1) / 0.2) * (1 - E(T, 1.9, 0.2))} s={mix(0.7, 1, S(T, 1.1))}>COYOR RUN · FREE TO PLAY</Pill>
      </>}
      {/* the cut: a hard flash and a punch-in */}
      <AbsoluteFill style={{ background: "#fff", opacity: 0.85 * (1 - E(T, s.t0, 0.09, easeOut)) * (s.t0 > 0 ? 1 : 0) }} />
    </AbsoluteFill>
  );
};
const Stars: React.FC<{ T: number }> = ({ T }) => (
  <AbsoluteFill>
    {Array.from({ length: 70 }, (_, k) => {
      const x = (k * 379) % 1080, y = (k * 211) % 980, r = 1.5 + (k % 3), tw = 0.4 + 0.6 * Math.abs(Math.sin(T * 2 + k));
      return <div key={k} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: "50%", background: "#E8ECFF", opacity: tw * 0.8 }} />;
    })}
  </AbsoluteFill>
);

// ---------- 2. CY coins = real discounts (the platform) ----------
const TIERS = [{ off: "10%", need: 2500, sub: "2,500 CY" }, { off: "25%", need: 6000, sub: "6,000 CY" }, { off: "50%", need: 12000, sub: "12,000 CY" }, { off: "100%", need: 1e9, sub: "INFINITY WINNERS" }];
const Discounts: React.FC<{ T: number }> = ({ T }) => {
  const t0 = 12.6, u = T - t0;
  const count = Math.round(mix(2480, 12000, E(T, t0 + 0.5, 1.9, easeOut)));
  const coinP = S(T, t0 + 0.05, { damping: 9, stiffness: 160 });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 30%, rgba(233,198,106,.22), transparent 70%), ${C.bg}` }}>
      {Array.from({ length: 16 }, (_, k) => {          // coins raining
        const st = t0 + 0.1 + k * 0.09, f = T - st; if (f < 0) return null;
        const x = 90 + ((k * 197) % 900), y = -100 + f * (900 + (k % 4) * 120);
        return <Coin key={k} x={x} y={y} s={0.6 + (k % 3) * 0.2} spin={f * 7 + k} op={1 - E(T, st + 1.4, 0.3)} />;
      })}
      <Coin x={540} y={330} s={mix(0.3, 2.3, coinP)} spin={u * 3.2} />
      <div style={{ position: "absolute", left: 540, top: 560, transform: "translate(-50%,-50%)", fontFamily: H, fontWeight: 900, fontSize: 150, color: C.gold2, letterSpacing: 1,
        opacity: clamp((u - 0.3) / 0.2), filter: "drop-shadow(0 10px 30px rgba(0,0,0,.5))" }}>{count.toLocaleString("en-US")} <span style={{ fontSize: 90, color: C.cream }}>CY</span></div>
      <Slam text="COINS = DISCOUNTS" T={T} t0={t0 + 0.55} x={540} y={720} size={118} />
      <div style={{ position: "absolute", left: 540, top: 805, transform: "translate(-50%,-50%)", fontFamily: B, fontWeight: 500, fontSize: 36, color: C.muted, opacity: clamp((u - 0.8) / 0.25), whiteSpace: "nowrap" }}>
        on real COYOR clothing</div>
      {TIERS.map((tr, k) => {
        const p = S(T, t0 + 1.0 + k * 0.12, { damping: 11, stiffness: 190 }), hit = count >= tr.need;
        const x = 290 + (k % 2) * 500, y = 1080 + Math.floor(k / 2) * 330;
        return (
          <div key={k} style={{ position: "absolute", left: x - 225, top: y - 140, width: 450, height: 280, borderRadius: 34, opacity: clamp(p * 3),
            transform: `translateY(${120 * (1 - p)}px) scale(${mix(0.7, 1, p) * (hit && k === 2 ? 1 + 0.05 * Math.sin(Math.PI * clamp((u - 2.3) / 0.35)) : 1)})`,
            background: hit ? "linear-gradient(160deg, rgba(255,221,112,.28), rgba(233,198,106,.10))" : "rgba(24,24,30,.92)", border: `3px solid ${hit ? C.gold : "rgba(233,198,106,.3)"}`,
            boxShadow: hit ? "0 0 60px rgba(233,198,106,.35)" : "0 20px 50px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: H, fontWeight: 900, fontStyle: "italic", fontSize: 130, lineHeight: 1, ...(hit ? { background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } : { color: C.cream }) }}>{tr.off}<span style={{ fontSize: 60 }}> OFF</span></div>
            <div style={{ fontFamily: B, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: hit ? C.gold2 : C.muted, marginTop: 8 }}>{tr.sub}</div>
            <Sheen T={T} t0={t0 + 1.25 + k * 0.12} dur={0.55} radius={34} />{k === 2 && <Sheen T={T} t0={14.95} dur={0.5} radius={34} color="rgba(255,240,190,.75)" />}{hit && <Sheen T={T} t0={15.6 + k * 0.15} dur={0.6} radius={34} />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 3. the fits, in the game: the COYOR Shop locker; the hand equips the Legendary set ----------
const EQUIP = 18.35;
const SHOP_KEYS = [{ at: 16.9, x: 1250, y: 2150 }, { at: EQUIP, x: 773, y: 845, click: true }, { at: 19.3, x: 900, y: 1150 }];
const ShopScene: React.FC<{ T: number }> = ({ T }) => {
  const t0 = 16.4, u = T - t0;
  const enter = S(T, t0, { damping: 16, stiffness: 130 });
  const press = T > EQUIP + 0.06 ? Math.max(0, 1 - S(T, EQUIP + 0.17, { damping: 8, stiffness: 220 })) * clamp((T - EQUIP - 0.06) / 0.06) : 0;
  const done = E(T, EQUIP + 0.15, 0.3, easeOut);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ transform: `translateY(${300 * (1 - enter)}px) scale(${mix(0.92, 1, enter) * (1 + 0.02 * u)})`, transformOrigin: "50% 40%", opacity: clamp(enter * 2) }}>
        <Img src={staticFile("ui/30-locker.png")} style={{ width: 1080, height: 1920 }} />
        {/* the equip button pressed, then confirmed */}
        <div style={{ position: "absolute", left: 773 - 196, top: 845 - 45, width: 392, height: 90, borderRadius: 18, transform: `scale(${1 - 0.06 * press})`,
          background: done > 0 ? `rgba(22,184,87,${0.92 * done})` : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: B, fontWeight: 700, fontSize: 38, color: "#fff", opacity: done }}>✓ Equipped</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,8,0) 55%, rgba(5,5,8,.92) 82%)" }} />
      <Slam text="UNLOCK THE FITS" T={T} t0={t0 + 0.25} x={540} y={1560} size={136} grad={GOLD} out={19.45} />
      <div style={{ position: "absolute", left: 540, top: 1680, transform: "translate(-50%,-50%)", fontFamily: B, fontWeight: 700, fontSize: 36, letterSpacing: 3, color: C.cream, opacity: clamp((u - 0.5) / 0.25) * (1 - E(T, 19.4, 0.2)), whiteSpace: "nowrap" }}>
        COMMON · RARE · EPIC · LEGENDARY</div>
      <Hand {...handAt(T * 30, SHOP_KEYS, { size: 200 })} />
    </AbsoluteFill>
  );
};

// ---------- 4. wear it IRL: the real COYOR clothing, fullscreen ----------
const PRODUCTS = [
  { f: "black-joggers.png", n: "CHENILLE SET", p: "€129,99" }, { f: "chenille-varsity-set-pink.jpg", n: "VARSITY SET · BABY PINK", p: "€79,99" },
  { f: "chenille-varsity-set-sky-blue.png", n: "VARSITY SET · SKY BLUE", p: "€79,99" }, { f: "pastel-peach.jpg", n: "VARSITY SET · PASTEL PEACH", p: "€79,99" },
];
const RealFits: React.FC<{ T: number }> = ({ T }) => {
  const t0 = 19.6, each = 1.0;
  const k = Math.min(3, Math.floor((T - t0) / each)), u = T - t0 - k * each, pr = PRODUCTS[k];
  const sl = S(T, t0 + k * each, { damping: 15, stiffness: 160 });
  const prev = k > 0 ? PRODUCTS[k - 1] : null;
  return (
    <AbsoluteFill style={{ background: "#efeae2" }}>
      {prev && <AbsoluteFill style={{ transform: `translateX(${-1080 * sl}px)` }}><Img src={staticFile("products/" + prev.f)} style={{ width: 1080, height: 1920, objectFit: "cover" }} /></AbsoluteFill>}
      <AbsoluteFill style={{ transform: `translateX(${k > 0 ? 1080 * (1 - sl) : 0}px) scale(${1.08 - 0.06 * clamp(u / each)})` }}>
        <Img src={staticFile("products/" + pr.f)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,8,10,.25) 0%, rgba(8,8,10,0) 20%, rgba(8,8,10,0) 55%, rgba(8,8,10,.86) 100%)" }} />
      <Slam text="WEAR IT IRL." T={T} t0={t0 + 0.08} x={540} y={1430} size={170} grad={GOLD} />
      <div key={k} style={{ position: "absolute", left: 540, top: 1660, transform: `translate(-50%,-50%) translateY(${40 * (1 - S(T, t0 + k * each + 0.12))}px)`, opacity: clamp((u - 0.12) / 0.15), textAlign: "center" }}>
        <div style={{ fontFamily: H, fontWeight: 900, fontStyle: "italic", fontSize: 92, color: C.cream, whiteSpace: "nowrap", textShadow: "0 8px 24px rgba(0,0,0,.5)" }}>{pr.n}</div>
        <div style={{ display: "inline-block", marginTop: 14, padding: "10px 30px", borderRadius: 40, background: GOLD, fontFamily: H, fontWeight: 900, fontSize: 60, color: C.bg, position: "relative", overflow: "hidden" }}>{pr.p}<Sheen T={T} t0={t0 + k * each + 0.35} dur={0.5} radius={40} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5. the call to action ----------
const CLICK = 26.1;
const CTA_KEYS = [{ at: 24.6, x: 1250, y: 2200 }, { at: CLICK, x: 600, y: 1470, click: true }, { at: 27.3, x: 760, y: 1660 }];
const CTA: React.FC<{ T: number }> = ({ T }) => {
  const t0 = 23.6, u = T - t0;
  const press = T > CLICK + 0.06 ? Math.max(0, 1 - S(T, CLICK + 0.17, { damping: 8, stiffness: 220 })) * clamp((T - CLICK - 0.06) / 0.06) : 0;
  const btn = S(T, t0 + 0.8, { damping: 10, stiffness: 180 }), ring = E(T, CLICK + 0.11, 0.7, easeOut);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 50% at 50% 40%, rgba(233,198,106,.2), transparent 70%), ${C.bg}` }}>
      <Slam text="COYOR" T={T} t0={t0 + 0.05} x={540} y={360} size={290} />
      <Slam text="RUN" T={T} t0={t0 + 0.22} x={540} y={600} size={290} grad={GOLD} />
      {[0, 1, 2, 3].map((i) => {
        const p = S(T, t0 + 0.32 + i * 0.08, { damping: 10, stiffness: 190 });
        const hop = T > CLICK + 0.15 + i * 0.06 ? 70 * Math.max(0, Math.sin(Math.PI * Math.min(1, (T - CLICK - 0.15 - i * 0.06) / 0.42))) : 0;
        return <Runner key={i} i={i} T={T + i * 0.2} x={[200, 427, 653, 880][i]} y={1250 + 120 * (1 - p) - hop} h={360} pose={hop > 4 ? "jump" : "stand"} op={clamp(p * 3)} sc={mix(0.6, 1, p)} />;
      })}
      <div style={{ position: "absolute", left: 540, top: 1470, transform: `translate(-50%,-50%) scale(${mix(0.6, 1, btn) * (1 - 0.07 * press)})`, opacity: clamp(btn * 3), width: 660, height: 156,
        borderRadius: 78, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 ${24 - 14 * press}px 70px rgba(233,198,106,.42)`,
        fontFamily: H, fontWeight: 900, fontStyle: "italic", fontSize: 88, color: C.bg, letterSpacing: 2, overflow: "hidden" }}>PLAY FREE{[24.9, 25.7, 26.5, 27.3].map((t) => <Sheen key={t} T={T} t0={t} dur={0.55} radius={78} />)}</div>
      {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: 600 - 60 - 240 * ring, top: 1470 - 60 - 240 * ring, width: 120 + 480 * ring, height: 120 + 480 * ring, borderRadius: "50%", border: `4px solid ${C.gold2}`, opacity: 0.8 * (1 - ring) }} />}
      <div style={{ position: "absolute", left: 540, top: 1625, transform: "translate(-50%,-50%)", opacity: clamp((u - 1.0) / 0.3), fontFamily: B, fontWeight: 700, fontSize: 36, letterSpacing: 4, color: C.muted, whiteSpace: "nowrap" }}>
        EARN CY COINS · SHOP THE FITS</div>
      <div style={{ position: "absolute", left: 540, top: 1700, transform: "translate(-50%,-50%)", opacity: clamp((u - 1.2) / 0.3), fontFamily: B, fontWeight: 700, fontSize: 54, letterSpacing: 8, color: C.cream }}>COYORCLO.COM</div>
      <Hand {...handAt(T * 30, CTA_KEYS, { size: 190 })} />
    </AbsoluteFill>
  );
};

// a fast gold wipe between the big chapters
const Wipe: React.FC<{ T: number; t: number }> = ({ T, t }) => {
  const p = E(T, t - 0.18, 0.36, ease);
  if (p <= 0 || p >= 1) return null;
  const c = mix(-40, 140, p);
  return <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent ${c - 32}%, ${C.gold} ${c - 20}%, ${C.gold2} ${c}%, transparent ${c + 6}%)` }} />;
};

// ---------- the extra animation layer: clicks, particles, shockwaves, speed lines (Karl: "lots of animations") ----------
const HITS = [0.08, 0.75, 2.16, 4.36, 6.46, 8.56, 10.46, 13.15, 14.95, 16.65, 18.46, 19.68, 23.65, 23.82, 26.21];
const every = (a: number, b: number, d: number) => { const out: number[] = []; for (let t = a; t < b; t += d) out.push(+t.toFixed(3)); return out; };
const FXLayer: React.FC<{ T: number }> = ({ T }) => {
  const slam = (t: number, x: number, y: number, seed: number, r = 460) => (<React.Fragment key={"s" + t}>
    <Shock T={T} t0={t} x={x} y={y} r={r} ry={0.42} /><Burst T={T} t0={t} x={x} y={y} n={30} speed={1500} life={0.7} g={500} size={12} seed={seed} /></React.Fragment>);
  return (
    <Layer>
      <Dust T={T} op={T >= 19.6 && T < 23.6 ? 0.35 : 1} />
      {/* hook */}
      {slam(0.08, 540, 330, 1)}{slam(0.75, 540, 500, 2)}
      <Tap T={T} t0={0.86} x={540} y={1690} label="TAP TO JUMP" />
      {/* gameplay: a speed burst at each cut, a shockwave and sparks under each word */}
      {[2.1, 4.3, 6.4, 8.5, 10.4].map((t, i) => <Speed key={"sp" + t} T={T} t0={t} seed={i + 4} />)}
      {slam(2.16, 540, 360, 3)}{slam(4.36, 540, 1500, 4)}{slam(6.46, 540, 360, 5)}{slam(8.56, 540, 360, 6)}{slam(10.46, 540, 620, 7, 560)}
      {/* coins: a sparkle at the counter and a "+10" every beat; "+1" pops above the runner */}
      {every(2.3, 12.4, 0.4).map((t, k) => <React.Fragment key={"c" + t}><Burst T={T} t0={t} x={92} y={106} n={10} speed={420} life={0.45} g={200} size={8} kind="dot" seed={20 + k} />
        <Plus T={T} t0={t} x={250 + 30 * rnd(k)} y={112} text="+10" size={42} /></React.Fragment>)}
      {every(2.4, 4.2, 0.55).map((t, k) => <Plus key={"a" + t} T={T} t0={t} x={300 + 40 * rnd(k + 9)} y={1260} text="+1 CY" size={58} />)}
      {every(8.7, 10.3, 0.5).map((t, k) => <Plus key={"r" + t} T={T} t0={t} x={300 + 50 * rnd(k + 19)} y={1250} text="+5 CY" size={58} />)}
      {/* the player's taps: jump (Abdel), fly (Bram), switch lanes (Paulie), shoot (Rahim) */}
      {every(2.5, 4.2, 0.82).map((t) => <Tap key={"ta" + t} T={T} t0={t} x={880} y={1700} label="JUMP" />)}
      {every(4.55, 6.3, 0.42).map((t) => <Tap key={"tb" + t} T={T} t0={t} x={880} y={1700} label="FLY" />)}
      {every(6.7, 8.4, 0.62).map((t, k) => <Swipe key={"sw" + t} T={T} t0={t} x={540} y={1760} dir={k % 2 ? 1 : -1} />)}
      {every(8.75, 10.3, 0.3).map((t) => <Tap key={"tr" + t} T={T} t0={t} x={880} y={1700} label="SHOOT" color="#A9B1FF" />)}
      {every(10.7, 12.4, 0.45).map((t, k) => <Burst key={"bo" + t} T={T} t0={t} x={820 + 60 * rnd(k)} y={1560 + 40 * rnd(k + 3)} n={14} speed={600} life={0.5} g={300} size={9} colors={["#FF8AC4", "#FFDD70", "#fff"]} seed={40 + k} />)}
      {/* coins = discounts: the big coin bursts, twinkles around it, confetti when 50% unlocks */}
      <Burst T={T} t0={12.66} x={540} y={330} n={36} speed={1700} life={0.9} g={700} size={13} seed={60} />
      <Shock T={T} t0={12.66} x={540} y={330} r={520} />
      {T > 12.7 && T < 16.4 && <Twinkles T={T} x={300} y={140} w={480} h={380} n={12} seed={71} />}
      <Burst T={T} t0={14.95} x={290} y={1410} n={70} speed={2100} life={1.4} g={1300} size={18} kind="confetti" colors={["#FFDD70", "#E9C66A", "#F8F1E2", "#FF8AC4", "#7FE3EC"]} seed={80} up spread={2.2} />
      <Burst T={T} t0={14.95} x={790} y={1410} n={70} speed={2100} life={1.4} g={1300} size={18} kind="confetti" colors={["#FFDD70", "#E9C66A", "#F8F1E2", "#A9B1FF", "#F6A27F"]} seed={81} up spread={2.2} />
      <Shock T={T} t0={14.95} x={290} y={1410} r={380} /><Plus T={T} t0={15.0} x={290} y={1250} text="UNLOCKED!" size={70} />
      {/* the shop: the tap on Equip, sparks, a LEGENDARY badge with rays */}
      <Rays T={T} t0={18.5} x={773} y={640} r={300} />
      <Burst T={T} t0={18.46} x={773} y={845} n={34} speed={1300} life={0.8} g={600} size={12} seed={90} />
      <Shock T={T} t0={18.46} x={773} y={845} r={300} />
      {T > 18.5 && T < 19.5 && <div style={{ position: "absolute", left: 773, top: 640, transform: `translate(-50%,-50%) scale(${Math.min(1.1, (T - 18.5) / 0.12) - 0.1 * Math.max(0, Math.min(1, (T - 18.62) / 0.15))})`,
        opacity: Math.min(1, (19.5 - T) / 0.2), padding: "14px 30px", borderRadius: 40, background: "linear-gradient(100deg,#FFE7A0,#E9C66A)", color: "#0B0B0E",
        fontFamily: "'Barlow Condensed'", fontWeight: 900, fontStyle: "italic", fontSize: 54, whiteSpace: "nowrap", boxShadow: "0 16px 40px rgba(233,198,106,.45)" }}>★ LEGENDARY UNLOCKED</div>}
      {/* the real fits: twinkles on each product, sparks off the price tag, a streak at each swipe */}
      {T > 19.6 && T < 23.6 && <Twinkles T={T} x={120} y={260} w={840} h={1000} n={9} seed={100 + Math.floor((T - 19.6) / 1.0)} size={40} />}
      {[19.95, 20.95, 21.95, 22.95].map((t, k) => <Burst key={"pt" + t} T={T} t0={t} x={540} y={1735} n={16} speed={700} life={0.5} g={400} size={9} seed={110 + k} />)}
      {[20.6, 21.6, 22.6].map((t, k) => <Speed key={"ps" + t} T={T} t0={t - 0.04} x={540} y={900} seed={120 + k} />)}
      {/* the end card: slams, sparkles around the button, the tap: confetti and a coin fountain */}
      {slam(23.65, 540, 360, 130)}{slam(23.82, 540, 600, 131)}
      {T > 24.5 && <Twinkles T={T} x={200} y={1380} w={680} h={180} n={8} seed={140} size={30} />}
      <Burst T={T} t0={26.21} x={540} y={1470} n={90} speed={2300} life={1.5} g={1400} size={18} kind="confetti" colors={["#FFDD70", "#E9C66A", "#F8F1E2", "#FF8AC4", "#7FE3EC", "#A9B1FF"]} seed={150} up spread={2.6} />
      <Burst T={T} t0={26.21} x={540} y={1470} n={18} speed={1500} life={1.2} g={1500} size={30} kind="coin" seed={151} up spread={1.8} />
      <Shock T={T} t0={26.21} x={540} y={1470} r={600} ry={0.5} />
    </Layer>
  );
};

export const Film: React.FC = () => {
  const T = useCurrentFrame() / FPS;
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.bg }} />;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ transform: `translate(${shakeAt(T, HITS)[0].toFixed(1)}px, ${shakeAt(T, HITS)[1].toFixed(1)}px)` }}>
      {T < 12.6 && <Gameplay T={T} />}
      {T >= 12.6 && T < 16.4 && <Discounts T={T} />}
      {T >= 16.4 && T < 19.6 && <ShopScene T={T} />}
      {T >= 19.6 && T < 23.6 && <RealFits T={T} />}
      {T >= 23.6 && <CTA T={T} />}
      </AbsoluteFill>
      <FXLayer T={T} />
      {[12.6, 16.4, 19.6, 23.6].map((t) => <Wipe key={t} T={T} t={t} />)}
    </AbsoluteFill>
  );
};
