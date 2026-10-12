// The Creoble film, beat by beat, on the voice-over's words. One continuous stage: the café's website (site.tsx) is the
// thread object: seen first, locked behind the old way, built from the owner's words, explored, bought, put online.
import React from "react";
import { Loop, OffthreadVideo, staticFile } from "remotion";
import { ARRIVE, C, F, MOVE, SHADOW, SHADOW_SOFT, W, at, clamp01, expoOut, lerp, mix, pr, press, px, pxi, rgba, tip } from "./lib";
import { tw } from "./parts";
import { Cursor, Shimmer } from "./ui";
import { Icon } from "./icons";
import { Browser, CafeSite } from "./site";

// ---- shared ---------------------------------------------------------------------------------------------------------
/** Words that ease in: each rises 26 px out of a light blur and fades on over 10 f (no pops). `it` marks italic words. */
export const Words: React.FC<{ g: number; words: { t: string; f: number; it?: boolean; color?: string }[]; size: number; x: number; y: number;
  color?: string; family?: string; weight?: number; align?: "center" | "left"; opacity?: number }> =
  ({ g, words, size, x, y, color = C.ink, family = F.serif, weight = 400, align = "center", opacity = 1 }) => {
    const sp = tw(" ", size, weight, family);
    const ws = words.map((w) => tw(w.t, size, weight, family) * (w.it ? 0.98 : 1));
    const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    let cx = align === "center" ? x - total / 2 : x;
    return (
      <>
        {words.map((w, i) => {
          const left = cx; cx += ws[i] + sp;
          if (g < w.f) return null;
          const k = clamp01((g - w.f) / 14), e = ARRIVE(k);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${left}px, ${y - size * 0.64 + 26 * (1 - e)}px, 0)`,
              opacity: opacity * clamp01((g - w.f) / 9), filter: k < 1 ? `blur(${6 * (1 - e)}px)` : undefined, fontFamily: family, fontWeight: weight,
              fontStyle: w.it ? "italic" : "normal", fontSize: size, color: w.color ?? color, whiteSpace: "pre", lineHeight: 1.25 }}>{w.t}</div>
          );
        })}
      </>
    );
  };
const fieldCircle = (g: number, a: number, n: number, color: string, x: number, y: number, lin = 0) => {
  if (g < a) return null;
  const k = clamp01((g - a) / n);
  const r = lin ? lin * k + 80 : 2300 * expoOut(n, 0.86)(k);
  return <div style={{ position: "absolute", inset: 0, background: color, clipPath: `circle(${r}px at ${x}px ${y}px)` }} />;
};
const CS = 88;
const Pointer: React.FC<{ x: number; y: number; p?: number }> = ({ x, y, p = 0 }) => {
  const t = tip(CS);
  return <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x + t.dx}px, ${y + t.dy}px, 0)` }}><Cursor size={CS} press={p} color={C.ink} /></div>;
};
export const Wordmark: React.FC<{ size: number; color?: string }> = ({ size, color = C.ink }) => (
  <span style={{ fontFamily: F.serif, fontWeight: 500, fontSize: size, color, letterSpacing: -size * 0.01, lineHeight: 1 }}>Creoble<span style={{ color: C.sage }}>.</span></span>
);

// ---- the fields (bright, warm; each grows out of the object that causes it) ------------------------------------------
export const Fields: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "absolute", inset: 0, background: C.page }}>
    {fieldCircle(g, W("w:normalt", -0.1), 40, C.sandPale, 960, 760, 1500)}
    {fieldCircle(g, W("w:creoble", -0.05), 38, C.sageTint, 960, 330, 1500)}
    {fieldCircle(g, W("w:fortael", -0.4), 38, "#F5EEE6", 960, 560, 1400)}
    {fieldCircle(g, W("w:paa2", 0.0), 38, C.page, 960, 560, 1400)}
    {fieldCircle(g, W("w:saa", 0.1), 40, C.clay, 1390, 560, 1700)}
    {fieldCircle(g, W("w:klar", 0.0), 40, C.sageTint, 960, 455, 1500)}
    {fieldCircle(g, W("w:ingen", -0.15), 36, C.page, 560, 430, 1700)}
    {fieldCircle(g, W("w:proev", -0.1), 40, C.cream, 960, 380, 1400)}
    {fieldCircle(g, W("w:dag", -0.06), 34, C.sageTint, 960, 730)}
  </div>
);

// ---- the website, through the whole film ------------------------------------------------------------------------------
/** Where the browser is, how big, and what the site is doing, at frame g. */
const siteState = (g: number) => {
  const res = W("w:resultatet", -0.2);
  const norm = W("w:normalt", -0.1);
  const clear = W("w:spoergsmaal", 0.55);           // the old way falls away
  const gen = W("w:paa2", -0.2);                     // the builder becomes the browser
  const price = W("w:saa", 0.0), klar = W("w:klar", -0.05), ingen = W("w:ingen", -0.3);
  let x = 960, y = 690, s = 0.86, o = 0;
  // hook: rises in on "resultatet"; old way: centres, blurs, then drops away
  if (g >= res - 2 && g < clear + 14) {
    y = 760; o = clamp01((g - (res + 6)) / 8);
    const c = pr(g, norm, 20, MOVE);
    y = lerp(y, 590, c); s = lerp(0.86, 0.8, c);
    const drop = pxi(g, clear, 14, 0.78);
    y += 1300 * drop;
  } else if (g >= gen && g < ingen + 12) {
    o = 1; y = 560; s = lerp(0.8, 1, pr(g, gen, 18, MOVE));
    const toLeft = pr(g, price, 22, MOVE), back = pr(g, klar, 22, MOVE);
    x = lerp(960, 670, toLeft * (1 - back)); s = lerp(s, 0.72, toLeft * (1 - back)); s = lerp(s, 0.7, back); y = lerp(y, 455, back);
    const out = pxi(g, ingen, 12, 0.78); y -= 1300 * out;
  }
  return { x, y, s, o };
};

const SiteLayer: React.FC<{ g: number }> = ({ g }) => {
  const st = siteState(g);
  if (st.o <= 0) return null;
  const res = W("w:resultatet", -0.2), norm = W("w:normalt", -0.05);
  const gen = W("w:paa2", -0.2);
  // hook: develops from a blur; old way: locked behind a blur
  const lock = g < gen ? pr(g, norm, 30, MOVE) : 0;
  const blur = g < gen ? 9 * lock : 0;
  // the build (on "På få minutter … færdig hjemmeside")
  const bA = W("w:minutter", 0.0);
  const build = g < gen ? [1, 1, 1, 1, 1] : [pr(g, bA, 8), pr(g, bA + 6, 12), pr(g, bA + 34, 20), pr(g, bA + 52, 14), pr(g, bA + 66, 12)];
  const done = W("w:hjemmeside2", -0.1);
  // scroll: follows the build, then the pages are explored
  const ud = W("w:udforsk", -0.1), se = W("w:se2", -0.25);
  // the preview is browsed the whole time it is on screen (a live page, never a still picture)
  const ramp = (a: number, b: number, v: number) => g < a ? 0 : g < b ? v * ((g - a) - 8 * (1 - Math.min(1, (g - a) / 8)) * 0 ) : v * (b - a);
  let scroll = 0;
  if (g < gen) {
    scroll = Math.min(1700, ramp(res + 14, W("w:spoergsmaal", 0.6), 5.0));
  } else {
    const kan = W("w:kan", -0.2), price = W("w:saa", 0.0), klar = W("w:klar", -0.05);
    scroll = 1080 * pr(g, bA + 18, done - bA - 24, (x) => x) - 1080 * pr(g, done - 6, 14, MOVE);
    scroll += 1700 * pr(g, ud, 30, MOVE) - 1700 * pr(g, se, 14, MOVE);
    scroll += ramp(kan, price, 4) - ramp(kan, price, 4) * pr(g, price, 12, MOVE);
    scroll += Math.min(1720, ramp(price + 12, klar, 5.4)) * (1 - pr(g, klar, 14, MOVE));
    scroll += Math.min(1720, ramp(klar + 16, W("w:ingen", -0.3), 5.4));
  }
  // design: two theme changes on "se designet"; the change asked in plain words on "ændre"
  const th = 1 * pr(g, W("w:designet", 0.1), 12, MOVE) + 1 * pr(g, W("w:designet", 0.5), 12, MOVE);
  const head = 1 + 0.24 * pr(g, W("w:aendre", 0.05), 16, MOVE);
  const live = pr(g, W("w:online", 0.0), 8, MOVE);
  const url = g >= W("w:online", 0.1) ? "cafesalvie.dk" : g >= gen ? "forhåndsvisning.creoble.dk/cafe-salvie" : "cafesalvie.dk";
  const urlN = g >= W("w:online", 0.1) ? clamp01((g - W("w:online", 0.1)) / 14) * 13 : undefined;
  return (
    <div style={at(st.x, st.y, st.s * (1 + 0.16 * pr(g, W("w:fortael2", -0.1), 40, MOVE) * (1 - pr(g, W("w:kan", -0.3), 14, MOVE))))}>
      <Browser w={1560} h={880} url={url} urlN={urlN} live={live}>
        <div style={{ filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <CafeSite g={g} scroll={scroll} build={build} theme={th} headScale={head} />
        </div>
        {lock > 0 && (
          <div style={{ position: "absolute", inset: 0, background: rgba(C.sandPale, 0.45 * lock), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: C.white, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${0.85 + 0.15 * lock})`, opacity: lock }}><Icon name="shield" size={70} color={C.muted} stroke={1.8} /></div>
          </div>
        )}
        {g >= gen && g < done + 16 && <BuildBanner g={g} a={gen} done={done} />}
        {g >= W("w:fortael2", -0.2) && g < W("w:kan", 0.0) && <ChangeBar g={g} />}
      </Browser>
    </div>
  );
};

const BuildBanner: React.FC<{ g: number; a: number; done: number }> = ({ g, a, done }) => {
  const p = pr(g, a + 6, done - a - 6, (x) => x);
  const fin = g >= done;
  const o = 1 - clamp01((g - done - 8) / 8);
  return (
    <div style={{ position: "absolute", left: 1560 / 2 - 330, top: 880 - 58 - 110, width: 660, height: 78, borderRadius: 39, background: rgba(C.white, 0.96), boxShadow: SHADOW_SOFT,
      display: "flex", alignItems: "center", gap: 18, padding: "0 28px", opacity: o * clamp01((g - a) / 8), border: `1.5px solid ${C.line}` }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: fin ? C.sage : C.sageTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={fin ? "check" : "spark"} size={26} color={fin ? "#fff" : C.sageDeep} stroke={2.4} /></div>
      {fin ? <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.ink }}>Din hjemmeside er færdig</span>
        : <Shimmer text="Creoble bygger din hjemmeside…" size={26} t={(g - a) / 30} color={C.muted} />}
      <div style={{ marginLeft: "auto", width: 120, height: 8, borderRadius: 4, background: C.cream, overflow: "hidden" }}>
        <div style={{ width: `${100 * p}%`, height: "100%", background: C.sage }} /></div>
    </div>
  );
};

/** "Fortæl hvad du gerne vil ændre": a request typed in plain words, sent, applied. */
const CHANGE = "Gør overskriften større";
const ChangeBar: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:fortael2", -0.2), sent = W("w:aendre", -0.1), out = W("w:kan", -0.2);
  const e = px(g, a, 16, 0.8), n = CHANGE.length * MOVE(clamp01((g - a - 4) / (sent - a - 8)));
  const ok = g >= sent + 6;
  const o = 1 - pr(g, out - 6, 8, MOVE);
  return (
    <div style={{ position: "absolute", left: 1560 / 2 - 430, top: 880 - 58 - 150 + 60 * (1 - e), width: 860, height: 100, borderRadius: 50, background: C.white,
      boxShadow: SHADOW, display: "flex", alignItems: "center", gap: 18, padding: "0 16px 0 30px", border: `2px solid ${mix(C.line, C.sage, clamp01((g - a) / 10))}`, opacity: o }}>
      <Icon name="chat" size={36} color={C.sageDeep} stroke={2} />
      <span style={{ fontFamily: F.ui, fontSize: 32, color: C.ink, flex: 1, whiteSpace: "nowrap" }}>{CHANGE.slice(0, Math.floor(n))}
        {!ok && <span style={{ display: "inline-block", width: 3, height: 34, background: C.sageDeep, verticalAlign: "-6px", marginLeft: 3 }} />}</span>
      <div style={{ height: 68, padding: "0 24px", borderRadius: 34, background: ok ? C.green : C.sageDeep, color: "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: 24,
        display: "flex", alignItems: "center", gap: 8 }}>{ok ? <><Icon name="check" size={24} color="#fff" stroke={3} />Ændret</> : "Send"}</div>
    </div>
  );
};

// ---- 1 the hook -------------------------------------------------------------------------------------------------------
const HookFootage: React.FC<{ g: number }> = ({ g }) => {
  const res = W("w:resultatet", -0.2);
  if (g > res + 22) return null;
  const k = pr(g, res - 4, 22, MOVE);
  // the hero's rectangle on screen (browser at 960,760, scale 0.86)
  const s = 0.86, hx = 960 - 780 * s + 32 * s, hy = 760 - 440 * s + (58 + 92) * s, hw = (1560 - 64) * s, hh = 560 * s;
  const L = lerp(0, hx, k), T0 = lerp(0, hy, k), Wd = lerp(1920, hw, k), H = lerp(1080, hh, k);
  return (
    <div style={{ position: "absolute", left: L, top: T0, width: Wd, height: H, borderRadius: lerp(0, 30 * s, k), overflow: "hidden" }}>
      <Loop durationInFrames={330} layout="none">
        <OffthreadVideo src={staticFile("footage/serving-coffee-in-a-cup-at-a-coffee-shop-3574.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Loop>
      <div style={{ position: "absolute", inset: 0, background: rgba("#25332F", 0.55 * (1 - k) + 0.3 * k) }} />
    </div>
  );
};

const Hook: React.FC<{ g: number }> = ({ g }) => {
  const out = pr(g, W("w:betaler", 0.55), 14, MOVE);
  if (out >= 1) return null;
  const onFoot = 1 - pr(g, W("w:resultatet", -0.2), 22, MOVE);       // white on the footage, ink once it has become the site
  const col = mix(C.ink, "#FFFFFF", onFoot);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-40 * out}px)` }}>
      <Words g={g} size={84} x={960} y={140} color={col} words={[{ t: "Hvad", f: W("w:hvad", -0.1) }, { t: "nu,", f: W("w:nu", -0.1) }, { t: "hvis", f: W("w:hvis", -0.1) },
        { t: "du", f: W("w:du", -0.1) }, { t: "kunne", f: W("w:kunne", -0.1) }, { t: "se", f: W("w:se", -0.1) }, { t: "resultatet,", f: W("w:resultatet", -0.1) }]} />
      <Words g={g} size={84} x={960} y={246} color={col} words={[{ t: "før", f: W("w:foer", -0.1), it: true, color: C.terraDeep }, { t: "du", f: W("w:du2", -0.1) },
        { t: "betaler?", f: W("w:betaler", -0.1) }]} />
    </div>
  );
};

// ---- 2 the old way ---------------------------------------------------------------------------------------------------
const QSTREAM: [string, number][] = [["Hvornår er den klar?", 380], ["Hvad koster det i alt?", 1540], ["Hvordan kommer den til at se ud?", 520],
  ["Kan jeg ændre i den bagefter?", 1440], ["Hvad hvis jeg ikke kan lide den?", 410], ["Hvor lang tid tager det?", 1560], ["Er prisen fast?", 330],
  ["Hvem ejer siden?", 1500], ["Hvad med hosting?", 470], ["Skal jeg betale mere senere?", 1420], ["Kan jeg se et udkast?", 390], ["Hvad er inkluderet?", 1530],
  ["Hvornår kan jeg se den?", 560], ["Hvad hvis jeg fortryder?", 1380]];
const OldWay: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:normalt", 0.0), clear = W("w:spoergsmaal", 0.55);
  if (g < a || g > clear + 18) return null;
  const drop = (i: number) => pxi(g, clear + i * 1.5, 14, 0.78);
  const Doc: React.FC<{ i: number; at0: number; x: number; y: number; rot: number; title: string; children: React.ReactNode }> = ({ i, at0, x, y, rot, title, children }) => {
    if (g < at0) return null;
    const e = px(g, at0, 18, 0.8), d = drop(i);
    return (
      <div style={{ ...at(x + 260 * (1 - e), y + 1100 * d, 1, clamp01((g - at0) / 6)), transform: `translate3d(${x + 260 * (1 - e)}px, ${y + 1100 * d}px, 0) translate(-50%, -50%) rotate(${rot + 8 * (1 - e) + 14 * d}deg)` }}>
        <div style={{ width: 440, borderRadius: 22, background: C.white, boxShadow: SHADOW, padding: "30px 34px", border: `1.5px solid ${C.line}` }}>
          <div style={{ fontFamily: F.serif, fontSize: 44, color: C.ink }}>{title}</div>
          <div style={{ marginTop: 20 }}>{children}</div>
        </div>
      </div>
    );
  };
  const line = (w: number) => <div style={{ width: w, height: 14, borderRadius: 7, background: "#ECE7DE", marginTop: 14 }} />;
  return (
    <>
      <Doc i={0} at0={W("w:tilbud", -0.2)} x={700} y={560} rot={-5} title="Tilbud">
        {line(360)}{line(300)}{line(330)}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontFamily: F.ui, fontSize: 28, color: C.ink }}><span>I alt</span><span style={{ fontWeight: 600 }}>? kr</span></div>
      </Doc>
      <Doc i={1} at0={W("w:depositum", -0.2)} x={1230} y={600} rot={4} title="Depositum">
        {line(340)}{line(280)}
        <div style={{ marginTop: 26, height: 64, borderRadius: 32, background: C.terra, color: "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: 26, display: "flex",
          alignItems: "center", justifyContent: "center" }}>Betal 50 % nu</div>
      </Doc>
      {QSTREAM.map(([q, x], i) => {
        const s0 = W("w:en2", -0.2) + i * 4;
        if (g < s0) return null;
        const age = g - s0;
        const y = 1160 - 8.5 * age - 60 * (1 - expoOut(14, 0.8)(clamp01(age / 14)));
        if (y < -80) return null;
        const k = clamp01(age / 14), e = ARRIVE(k), d = drop(i % 6);
        return (
          <div key={i} style={{ ...at(x, y + 1100 * d, 0.96 + 0.04 * e, clamp01((g - s0) / 9)) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, borderRadius: 34, padding: "18px 28px", boxShadow: SHADOW_SOFT,
              border: `1.5px solid ${C.line}`, whiteSpace: "nowrap" }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: C.clay, color: C.terraDeep, fontFamily: F.serif, fontSize: 30, display: "flex",
                alignItems: "center", justifyContent: "center" }}>?</div>
              <span style={{ fontFamily: F.ui, fontSize: 30, color: C.ink }}>{q}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---- 3 Creoble turns the process on its head ---------------------------------------------------------------------------
const STEPS_OLD = [["Betal", "invoice"], ["Vent", "clock"], ["Se resultatet", "search"]];
const STEPS_NEW = [["Se resultatet", "search"], ["Ret til", "chat"], ["Betal", "invoice"]];
const Flip: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:creoble", -0.1), out = W("w:fortael", -0.45);
  if (g < a || g > out + 16) return null;
  const ex = pr(g, out, 16, MOVE);
  const rowIn = W("w:creoble", 0.3), turn = W("w:vender", 0.2);
  const r = pr(g, turn, 24, MOVE);                 // the row turns half a circle: its order reverses
  const ang = Math.PI * r;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - ex, transform: `translateY(${-60 * ex}px)` }}>
      <div style={{ ...at(960, 330 + 30 * (1 - ARRIVE(clamp01((g - a) / 16)))), opacity: clamp01((g - a) / 10) }}><Wordmark size={150} /></div>
      {[0, 1, 2].map((i) => {
        const s0 = rowIn + i * 3;
        if (g < s0) return null;
        const k = clamp01((g - s0) / 14), e = ARRIVE(k);
        const off = (i - 1) * 440;
        const xx = 960 + off * Math.cos(ang), yy = 680 + 150 * Math.sin(ang) * (i === 1 ? 0 : -Math.sign(off));
        const swapped = r > 0.5;
        const [label, icon] = swapped ? STEPS_NEW[2 - i] : STEPS_OLD[i];
        const n = swapped ? 3 - i : i + 1;
        const isSee = label === "Se resultatet";
        return (
          <div key={i} style={{ ...at(xx, yy + 30 * (1 - e)), opacity: clamp01((g - s0) / 9) }}>
            <div style={{ width: 380, height: 136, borderRadius: 32, background: isSee && swapped ? C.sageDeep : C.white, boxShadow: SHADOW, display: "flex", alignItems: "center",
              gap: 18, padding: "0 28px", border: `1.5px solid ${C.line}` }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: isSee && swapped ? rgba("#FFFFFF", 0.15) : C.sageTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={icon} size={34} color={isSee && swapped ? "#fff" : C.sageDeep} stroke={2.2} /></div>
              <div>
                <div style={{ fontFamily: F.ui, fontSize: 22, color: isSee && swapped ? rgba("#FFFFFF", 0.7) : C.faint }}>{n}</div>
                <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: isSee && swapped ? "#fff" : C.ink, whiteSpace: "nowrap" }}>{label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---- 4 the builder (Creoble's real first step) ------------------------------------------------------------------------
const NAME = "Café Salvie";
const BRANCHES = ["Sundhed / Klinik", "Håndværker / Service", "Skønhed / Wellness", "Coach / Konsulent", "Restaurant / Café", "Fotograf / Kreativ"];
const Builder: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:fortael", -0.45), gen = W("w:paa2", -0.2);
  if (g < a || g > gen + 20) return null;
  const rise = px(g, a, 18, 0.8);
  const ty0 = W("w:fortael", 0.05), ty1 = W("w:virksomhed", -0.15);
  const n = NAME.length * MOVE(clamp01((g - ty0) / (ty1 - ty0)));
  const open = W("w:virksomhed", 0.0), pick = W("w:virksomhed", 0.38), close = pick + 6;
  const listO = g >= open && g < close + 6 ? pr(g, open, 8, MOVE) * (1 - pr(g, close, 6, MOVE)) : 0;
  const hl = g < open + 6 ? 0 : Math.min(4, (g - open - 6) / 2.5);
  const picked = g >= pick;
  const morph = pr(g, gen, 10, MOVE);
  const clk = W("w:paa2", -0.45);
  const sc = 0.86 * (g >= gen ? siteState(g).s / 0.8 : 1);
  return (
    <div style={{ ...at(960, lerp(1400, 560, rise), sc), opacity: 1 - morph }}>
      <div style={{ width: 1500, height: 820, borderRadius: 30, background: C.white, boxShadow: SHADOW, display: "flex", overflow: "hidden", border: `1.5px solid ${C.line}` }}>
        <div style={{ width: 340, background: C.cream, padding: "40px 34px", boxSizing: "border-box" }}>
          <Wordmark size={44} />
          <div style={{ marginTop: 44 }}>
            {["Virksomhed", "Branche", "Ydelser", "Kontakt", "Design", "Billeder", "Ekstra info"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, height: 54, fontFamily: F.ui, fontSize: 25, color: i === 0 ? C.ink : C.faint, fontWeight: i === 0 ? 600 : 400 }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${i === 0 ? C.sageDeep : C.line}`, background: i === 0 ? C.sage : "transparent" }} />{s}</div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: "64px 110px", position: "relative" }}>
          <div style={{ fontFamily: F.serif, fontSize: 60, color: C.ink, lineHeight: 1.1 }}>Lad os starte med det <span style={{ fontStyle: "italic", color: C.sage }}>vigtigste</span></div>
          <div style={{ fontFamily: F.ui, fontSize: 26, color: C.muted, marginTop: 14 }}>Fortæl os om din virksomhed</div>
          <div style={{ marginTop: 44, fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.ink }}>Virksomhedsnavn <span style={{ color: C.terra }}>*</span></div>
          <div style={{ marginTop: 12, height: 76, borderRadius: 16, border: `2px solid ${g >= ty0 && g < open ? C.sage : C.line}`, display: "flex", alignItems: "center", padding: "0 24px",
            fontFamily: F.ui, fontSize: 30, color: n > 0 ? C.ink : C.faint }}>
            {n > 0 ? NAME.slice(0, Math.floor(n)) : "fx Klinik for Fysioterapi"}
            {g >= ty0 && g < open && <span style={{ display: "inline-block", width: 3, height: 34, background: C.sageDeep, marginLeft: 3 }} />}
          </div>
          <div style={{ marginTop: 30, fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.ink }}>Branche <span style={{ color: C.terra }}>*</span></div>
          <div style={{ marginTop: 12, height: 76, borderRadius: 16, border: `2px solid ${listO > 0 ? C.sage : C.line}`, display: "flex", alignItems: "center", padding: "0 24px",
            fontFamily: F.ui, fontSize: 30, color: picked ? C.ink : C.faint, position: "relative" }}>
            {picked ? "Restaurant / Café" : "Vælg branche…"}
            <div style={{ marginLeft: "auto", transform: `rotate(${180 * listO}deg)` }}><Icon name="arrowUp" size={26} color={C.muted} stroke={2.2} style={{ transform: "rotate(180deg)" }} /></div>
            {listO > 0 && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 84, borderRadius: 18, background: C.white, boxShadow: SHADOW, padding: 10, zIndex: 3,
                opacity: listO, transform: `translateY(${-14 * (1 - listO)}px)`, border: `1.5px solid ${C.line}` }}>
                {BRANCHES.map((b, i) => (
                  <div key={b} style={{ height: 58, borderRadius: 12, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: F.ui, fontSize: 26,
                    background: Math.abs(hl - i) < 0.5 ? C.sageTint : "transparent", color: Math.abs(hl - i) < 0.5 ? C.sageDeep : C.ink }}>{b}</div>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: "absolute", right: 110, bottom: 60, height: 74, padding: "0 40px", borderRadius: 37, background: C.sageDeep, color: "#fff", fontFamily: F.ui,
            fontWeight: 600, fontSize: 28, display: "flex", alignItems: "center", gap: 12, transform: `scale(${1 - 0.06 * press(g, clk)})` }}>Byg min side</div>
        </div>
      </div>
    </div>
  );
};

/** "Fortæl os lidt om din virksomhed": the café itself opens behind the form; on "forvandler … til en færdig hjemmeside" it
 *  closes into the hero of the site (the same footage, the same frame), so the description visibly becomes the website. */
const BuilderFootage: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:fortael", -0.4), gen = W("w:paa2", -0.2);
  if (g < a || g >= gen + 22) return null;
  const rev = pr(g, a, 26, MOVE), k = pr(g, gen, 22, MOVE);
  const st = siteState(g), s = st.s;
  const hx = st.x - 780 * s + 32 * s, hy = st.y - 440 * s + (58 + 92) * s, hw = (1560 - 64) * s, hh = 560 * s;
  const L = lerp(0, hx, k), T0 = lerp(0, hy, k), Wd = lerp(1920, hw, k), H = lerp(1080, hh, k);
  const hero = "#25332F";
  return (
    <div style={{ position: "absolute", left: L, top: T0, width: Wd, height: H, borderRadius: lerp(0, 30 * s, k), overflow: "hidden",
      clipPath: rev < 1 ? `circle(${1120 * rev}px at ${960 - L}px ${560 - T0}px)` : undefined }}>
      <Loop durationInFrames={330} layout="none">
        <OffthreadVideo src={staticFile("footage/serving-coffee-in-a-cup-at-a-coffee-shop-3574.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Loop>
      <div style={{ position: "absolute", inset: 0, background: rgba(hero, 0.4 * (1 - k)) }} />
      <div style={{ position: "absolute", inset: 0, opacity: k, background: `linear-gradient(90deg, ${rgba(hero, 0.78)} 0%, ${rgba(hero, 0.42)} 42%, ${rgba(hero, 0.0)} 70%)` }} />
    </div>
  );
};

// ---- 7 "Kan du lide resultatet?" -----------------------------------------------------------------------------------------
const Like: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:kan", -0.15), clk = W("w:resultatet2", 0.75), out = W("w:saa", 0.05);
  if (g < a || g > out + 14) return null;
  const e = px(g, a, 18, 0.8), ex = pxi(g, out, 12, 0.78);
  return (
    <div style={{ ...at(960, lerp(1300, 620, e) - 1200 * ex) }}>
      <div style={{ width: 760, borderRadius: 34, background: C.white, boxShadow: SHADOW, padding: "44px 50px", border: `1.5px solid ${C.line}` }}>
        <div style={{ fontFamily: F.serif, fontSize: 56, color: C.ink }}>Kan du lide <span style={{ fontStyle: "italic", color: C.sageDeep }}>resultatet</span>?</div>
        <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
          <div style={{ height: 76, padding: "0 34px", borderRadius: 38, background: C.ink, color: "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: 28, display: "flex",
            alignItems: "center", transform: `scale(${1 - 0.06 * press(g, clk)})` }}>Ja, den er min</div>
          <div style={{ height: 76, padding: "0 34px", borderRadius: 38, border: `2px solid ${C.line}`, color: C.ink, fontFamily: F.ui, fontWeight: 600, fontSize: 28, display: "flex",
            alignItems: "center" }}>Ret mere</div>
        </div>
      </div>
    </div>
  );
};

// ---- 8 the price ----------------------------------------------------------------------------------------------------------
const Price: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:saa", 0.1), out = W("w:klar", -0.1);
  if (g < a || g > out + 16) return null;
  const e = px(g, a, 20, 0.8), ex = pxi(g, out, 14, 0.78);
  const num = W("w:499", -0.1), one = W("w:en4", -0.1), sub = W("w:entet", -0.1), strike = W("w:abonnement", 0.1), own = W("w:ejere", -0.15);
  const k = clamp01((g - num) / 14);
  const st = pr(g, strike, 12, MOVE);
  return (
    <div style={{ ...at(1500, lerp(1300, 560, e) - 1300 * ex) }}>
      <div style={{ width: 660, borderRadius: 40, background: C.white, boxShadow: SHADOW, padding: "50px 54px", border: `1.5px solid ${C.line}` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.muted, letterSpacing: 1 }}>DIN HJEMMESIDE</div>
        {g >= num && <div style={{ fontFamily: F.serif, fontSize: 190, color: C.terraDeep, lineHeight: 1.05, marginTop: 6, opacity: clamp01((g - num) / 9),
          transform: `translateY(${30 * (1 - ARRIVE(k))}px)`, filter: k < 1 ? `blur(${6 * (1 - ARRIVE(k))}px)` : undefined }}>499 <span style={{ fontSize: 90 }}>kr</span></div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 30 }}>
          {g >= one && <Row g={g} a={one} icon="check" text="Én betaling" />}
          {g >= sub && <Row g={g} a={sub} icon="check" text={<span>Intet abonnement <span style={{ position: "relative", color: C.faint, marginLeft: 10 }}>kr/md
            <span style={{ position: "absolute", left: -4, top: "52%", width: `calc(${100 * st}% + 8px)`, height: 4, background: C.terra, borderRadius: 2 }} /></span></span>} />}
          {g >= own && <Row g={g} a={own} icon="shield" text="Siden er din" strong />}
        </div>
      </div>
    </div>
  );
};
const Row: React.FC<{ g: number; a: number; icon: string; text: React.ReactNode; strong?: boolean }> = ({ g, a, icon, text, strong }) => {
  const k = clamp01((g - a) / 14), e = ARRIVE(k);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: clamp01((g - a) / 9), transform: `translateY(${20 * (1 - e)}px)` }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: strong ? C.sageDeep : C.sageTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={30} color={strong ? "#fff" : C.sageDeep} stroke={2.6} /></div>
      <span style={{ fontFamily: F.ui, fontWeight: strong ? 700 : 500, fontSize: 38, color: C.ink }}>{text}</span>
    </div>
  );
};

// ---- 9 online: hosting, domain, e-mail in one place -------------------------------------------------------------------------
const Online: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:klar", -0.05), out = W("w:ingen", -0.3);
  if (g < a || g > out + 14) return null;
  const ex = pxi(g, out, 12, 0.78);
  const toggleOn = pr(g, W("w:online", -0.05), 8, MOVE);
  const tIn = px(g, a, 16, 0.8);
  const items: [string, string, string, string, number][] = [
    ["Hosting", "database", "fra 83 kr/md", "w:hosting", 0], ["Domæne", "link", "cafesalvie.dk", "w:domaene", 1], ["E-mail", "mail", "kontakt@cafesalvie.dk", "w:e", 2]];
  const merge = pr(g, W("w:samlet", -0.1), 22, MOVE);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-1300 * ex}px)` }}>
      {/* the go-live switch */}
      <div style={{ ...at(960, 78 + 30 * (1 - tIn)), opacity: clamp01((g - a) / 9) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.white, borderRadius: 44, padding: "16px 28px 16px 18px", boxShadow: SHADOW, border: `1.5px solid ${C.line}` }}>
          <div style={{ width: 104, height: 58, borderRadius: 29, background: mix("#D9D6CE", C.green, toggleOn), position: "relative" }}>
            <div style={{ position: "absolute", top: 6, left: lerp(6, 52, toggleOn), width: 46, height: 46, borderRadius: 23, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,.2)" }} /></div>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: C.ink }}>{toggleOn > 0.5 ? "Online" : "Gå online"}</span>
        </div>
      </div>
      {items.map(([t, ic, sub, key, i]) => {
        const s0 = W(key, -0.1);
        if (g < s0) return null;
        const k = clamp01((g - s0) / 16), e = ARRIVE(k);
        const x0 = 380 + i * 580, y0 = 930;
        const x1 = 960, y1 = 935;
        const x = lerp(x0, x1, merge), y = lerp(y0 + 40 * (1 - e), y1 + (i - 1) * 74 * merge, merge);
        return (
          <div key={t} style={{ ...at(x, y), opacity: clamp01((g - s0) / 9) }}>
            <div style={{ width: lerp(520, 760, merge), height: lerp(120, 74, merge), borderRadius: lerp(28, 20, merge), background: C.white, boxShadow: merge > 0.9 ? "none" : SHADOW_SOFT,
              display: "flex", alignItems: "center", gap: 18, padding: "0 24px", border: `1.5px solid ${C.line}`, boxSizing: "border-box" }}>
              <div style={{ width: lerp(64, 46, merge), height: lerp(64, 46, merge), borderRadius: 18, background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={ic} size={lerp(34, 26, merge)} color={C.sageDeep} stroke={2.2} /></div>
              <div style={{ display: "flex", flexDirection: merge > 0.5 ? "row" : "column", gap: merge > 0.5 ? 16 : 2, alignItems: merge > 0.5 ? "center" : "flex-start" }}>
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: lerp(32, 28, merge), color: C.ink }}>{t}</span>
                <span style={{ fontFamily: F.ui, fontSize: lerp(25, 24, merge), color: C.muted, whiteSpace: "nowrap" }}>{sub}</span>
              </div>
              {merge > 0.9 && <div style={{ marginLeft: "auto" }}><Icon name="check" size={28} color={C.green} stroke={3} /></div>}
            </div>
          </div>
        );
      })}
      {merge > 0.6 && (
        <div style={{ ...at(960, 812 - 30 * (1 - clamp01((merge - 0.6) / 0.4))), opacity: clamp01((merge - 0.6) / 0.4) }}>
          <div style={{ fontFamily: F.serif, fontSize: 40, color: C.ink }}>Samlet <span style={{ fontStyle: "italic", color: C.sageDeep }}>ét sted</span></div>
        </div>
      )}
    </div>
  );
};

// ---- 10 no code, no uncertainty; 11 the sign-off -------------------------------------------------------------------------
const NoCode: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:ingen", -0.12), out = W("w:proev", -0.5);    // gone before "Prøv" eases in
  if (g < a || g > out + 12) return null;
  const ex = pr(g, out, 12, MOVE);
  const strike = pr(g, W("w:kode", 0.25), 10, MOVE);
  const q2c = pr(g, W("w:usikkerhed", 0.3), 12, MOVE);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - ex, transform: `translateY(${-50 * ex}px)` }}>
      <div style={{ ...at(560, 430), opacity: clamp01((g - a) / 9) }}>
        <div style={{ width: 170, height: 170, borderRadius: 40, background: C.white, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <span style={{ fontFamily: "monospace", fontSize: 70, color: mix(C.ink, C.faint, strike) }}>&lt;/&gt;</span>
          <div style={{ position: "absolute", left: 20, top: 83, width: 130 * strike, height: 6, background: C.terra, borderRadius: 3, transform: "rotate(-24deg)", transformOrigin: "0 50%" }} />
        </div>
      </div>
      <Words g={g} size={110} x={700} y={440} align="left" words={[{ t: "Ingen", f: W("w:ingen", -0.1) }, { t: "kode.", f: W("w:kode", -0.1) }]} />
      {g >= W("w:ingen2", -0.15) && <div style={{ ...at(560, 650), opacity: clamp01((g - W("w:ingen2", -0.15)) / 9) }}>
        <div style={{ width: 170, height: 170, borderRadius: 85, background: mix(C.clay, C.sage, q2c), display: "flex", alignItems: "center", justifyContent: "center" }}>
          {q2c < 0.5 ? <span style={{ fontFamily: F.serif, fontSize: 96, color: C.terraDeep, opacity: 1 - q2c * 2 }}>?</span>
            : <div style={{ opacity: (q2c - 0.5) * 2 }}><Icon name="check" size={90} color="#fff" stroke={3} /></div>}
        </div>
      </div>}
      <Words g={g} size={110} x={700} y={660} align="left" words={[{ t: "Ingen", f: W("w:ingen2", -0.1) }, { t: "usikkerhed.", f: W("w:usikkerhed", -0.1), it: true, color: C.sageDeep }]} />
    </div>
  );
};

const SignOff: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:proev", -0.15);
  if (g < a) return null;
  const wa = W("w:creoble3", -0.15);                 // the wordmark lands as the name is said
  const e = ARRIVE(clamp01((g - wa) / 18));
  const push = 1 + 0.06 * pr(g, a, 120, (x) => x);
  const btn = W("w:dag", -0.12);                     // the action arrives on "i dag"
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "960px 540px" }}>
      {g >= wa && <div style={{ ...at(960, 380 + 40 * (1 - e)), opacity: clamp01((g - wa) / 10), filter: e < 1 ? `blur(${8 * (1 - e)}px)` : undefined }}><Wordmark size={170} /></div>}
      <Words g={g} size={66} x={960} y={575} family={F.serif} words={[{ t: "Prøv", f: W("w:proev", -0.02) }, { t: "Creoble", f: W("w:creoble3", -0.1) },
        { t: "gratis", f: W("w:gratis", -0.1), it: true, color: C.sageDeep }, { t: "i", f: W("w:i", -0.1) }, { t: "dag.", f: W("w:dag", -0.1) }]} />
      {g >= btn && <div style={{ ...at(960, 730 + 36 * (1 - ARRIVE(clamp01((g - btn) / 16)))), opacity: clamp01((g - btn) / 10) }}>
        <div style={{ height: 92, padding: "0 50px", borderRadius: 46, background: C.ink, color: "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: 34, display: "flex", alignItems: "center", gap: 14 }}>
          Byg din side gratis</div></div>}
    </div>
  );
};

// ---- the cursor (the café owner) ------------------------------------------------------------------------------------------
const OwnerCursor: React.FC<{ g: number }> = ({ g }) => {
  const segs: [number, number, number, number, number, number][] = [];
  // [from frame, to frame, x0, y0, x1, y1]
  const c1 = W("w:paa2", -0.9), clk1 = W("w:paa2", -0.45);          // to "Byg min side"
  const c2 = W("w:designet", -0.2), clk2 = W("w:designet", 0.1);    // to the second swatch
  const c3 = W("w:resultatet2", 0.2), clk3 = W("w:resultatet2", 0.75); // to "Ja, den er min"
  segs.push([c1, clk1 + 14, 1900, 1150, 1403, 830]);
  segs.push([c2, clk2 + 24, 1900, 900, 1640, 330]);
  segs.push([c3, clk3 + 14, 1900, 1100, 820, 744]);
  for (const [a, b, x0, y0, x1, y1] of segs) {
    if (g >= a && g < b) {
      const e = px(g, a, 14, 0.8), ex = pxi(g, b - 10, 10, 0.75);
      const pz = Math.max(press(g, clk1), press(g, clk2), press(g, clk2 + 12), press(g, clk3));
      return <Pointer x={lerp(x0, x1, e) + 500 * ex} y={lerp(y0, y1, e) + 500 * ex} p={pz} />;
    }
  }
  return null;
};

/** On "se designet" a palette panel floats beside the site; two clicks recolour it. */
const Palette: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:se2", -0.2), out = W("w:fortael2", -0.1);
  if (g < a || g > out + 12) return null;
  const e = px(g, a, 14, 0.8), o = 1 - pr(g, out, 10, MOVE);
  const sel = g < W("w:designet", 0.1) ? 0 : g < W("w:designet", 0.5) ? 1 : 2;
  return (
    <div style={{ ...at(1640 + 60 * (1 - e), 300), opacity: o * clamp01((g - a) / 8) }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, background: C.white, borderRadius: 30, padding: 22, boxShadow: SHADOW, border: `1.5px solid ${C.line}` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.muted, letterSpacing: 1 }}>DESIGN</div>
        {[[C.sage, C.sageDeep], [C.terra, C.terraDeep], ["#5E8A6F", C.forest]].map(([c1, c2], i) => (
          <div key={i} style={{ width: 150, height: 64, borderRadius: 18, background: `linear-gradient(90deg, ${c1} 50%, ${c2} 50%)`,
            boxShadow: sel === i ? `0 0 0 4px ${C.white}, 0 0 0 7px ${C.ink}` : "none" }} />
        ))}
      </div>
    </div>
  );
};

export const Story: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <Fields g={g} />
    <HookFootage g={g} />
    <Hook g={g} />
    <SiteLayer g={g} />
    <BuilderFootage g={g} />
    <OldWay g={g} />
    <Flip g={g} />
    <Builder g={g} />
    <Palette g={g} />
    <Like g={g} />
    <Price g={g} />
    <Online g={g} />
    <NoCode g={g} />
    <SignOff g={g} />
    <OwnerCursor g={g} />
  </div>
);
