// The Bingua ad (1080 × 1920): the problem first (a feed of other people's lives, your plans on hold, five minutes
// that became an hour, nothing gained), then Bingua (the same scrolling, now words, languages, the world lighting up)
// and the payoff abroad (a flight, conversations, friends, the world explored), ending outside the screen.
// Every move carries the message; keyed to the voice's words (src/clock.ts).
import React from "react";
import { Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { T } from "./clock";
import { Line, W, measure } from "./kinetic";
import { ARRIVE, BinguaIcon, C, FLICK, MOVE, OUT, SOFT, clamp01, lerp, txt } from "./lib";
import { Feed, Page, PAGE, SH, SW, StatusBar, TabBar, TopBar, WordCard, lineTop, wordBox } from "./app";

const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);
const on = (g: number, a: string, b: string) => g >= T.f(a) && g < T.f(b);
const s = (pos: string) => T.s(pos);
const BG = "#F4F6FA";

// ---- footage ------------------------------------------------------------------------------------------------------------
const V = {
  beach: "romantic-couple-walk-along-a-beach-at-sunset-44495.mp4", night: "pair-of-female-friends-having-fun-on-a-night-out-42299.mp4",
  car: "happy-girls-traveling-in-a-convertible-car-at-sunset-33343.mp4", bed: "a-man-lying-on-the-bed-scrolling-on-his-phone-13168.mp4",
  park: "friends-talking-in-the-park-21296.mp4", balcony: "group-of-friends-drinking-wine-on-a-balcony-42716.mp4",
  ibiza: "walking-through-ibiza-old-town-4206.mp4", selfie: "diverse-friends-take-selfie-in-london-street-15917.mp4", es: "woman-eating-fast-food-in-the-street-26219.mp4",
};
const Clip: React.FC<{ src: string; at: number; offset?: number; pos?: string; style?: React.CSSProperties }> = ({ src, at, offset = 0, pos = "50% 50%", style }) => (
  <Sequence from={Math.round(at * 30)} layout="none">
    <OffthreadVideo src={staticFile("footage/" + src)} startFrom={Math.round(offset * 30)} muted style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, ...style }} />
  </Sequence>
);

// ---- flags (round badges) ------------------------------------------------------------------------------------------------
type FC = "es" | "mx" | "ar" | "co" | "fr" | "be" | "ch" | "ca" | "de" | "at" | "nl" | "it" | "pt" | "br" | "pe" | "cl";
const FLAG: Record<FC, React.ReactNode> = {
  es: <><rect width="60" height="60" fill="#C60B1E" /><rect y="15" width="60" height="30" fill="#FFC400" /></>,
  mx: <><rect width="20" height="60" fill="#006847" /><rect x="20" width="20" height="60" fill="#fff" /><rect x="40" width="20" height="60" fill="#CE1126" /><circle cx="30" cy="30" r="5" fill="#8C5A2B" /></>,
  ar: <><rect width="60" height="60" fill="#74ACDF" /><rect y="20" width="60" height="20" fill="#fff" /><circle cx="30" cy="30" r="5" fill="#F6B40E" /></>,
  co: <><rect width="60" height="60" fill="#FCD116" /><rect y="30" width="60" height="15" fill="#003893" /><rect y="45" width="60" height="15" fill="#CE1126" /></>,
  pe: <><rect width="20" height="60" fill="#D91023" /><rect x="20" width="20" height="60" fill="#fff" /><rect x="40" width="20" height="60" fill="#D91023" /></>,
  cl: <><rect width="60" height="60" fill="#fff" /><rect y="30" width="60" height="30" fill="#D52B1E" /><rect width="26" height="30" fill="#0039A6" /><circle cx="13" cy="15" r="4.5" fill="#fff" /></>,
  fr: <><rect width="20" height="60" fill="#0055A4" /><rect x="20" width="20" height="60" fill="#fff" /><rect x="40" width="20" height="60" fill="#EF4135" /></>,
  be: <><rect width="20" height="60" fill="#000" /><rect x="20" width="20" height="60" fill="#FDDA24" /><rect x="40" width="20" height="60" fill="#EF3340" /></>,
  ch: <><rect width="60" height="60" fill="#DA291C" /><rect x="25" y="13" width="10" height="34" fill="#fff" /><rect x="13" y="25" width="34" height="10" fill="#fff" /></>,
  ca: <><rect width="60" height="60" fill="#fff" /><rect width="15" height="60" fill="#D52B1E" /><rect x="45" width="15" height="60" fill="#D52B1E" /><path d="M30 18l4 8 6-2-2 8 5 3-9 3 1 7h-10l1-7-9-3 5-3-2-8 6 2z" fill="#D52B1E" /></>,
  de: <><rect width="60" height="20" fill="#000" /><rect y="20" width="60" height="20" fill="#DD0000" /><rect y="40" width="60" height="20" fill="#FFCE00" /></>,
  at: <><rect width="60" height="60" fill="#ED2939" /><rect y="20" width="60" height="20" fill="#fff" /></>,
  nl: <><rect width="60" height="20" fill="#AE1C28" /><rect y="20" width="60" height="20" fill="#fff" /><rect y="40" width="60" height="20" fill="#21468B" /></>,
  it: <><rect width="20" height="60" fill="#009246" /><rect x="20" width="20" height="60" fill="#fff" /><rect x="40" width="20" height="60" fill="#CE2B37" /></>,
  pt: <><rect width="60" height="60" fill="#FF0000" /><rect width="24" height="60" fill="#006600" /><circle cx="24" cy="30" r="8" fill="#FFCC00" /></>,
  br: <><rect width="60" height="60" fill="#009C3B" /><path d="M30 10 54 30 30 50 6 30z" fill="#FFDF00" /><circle cx="30" cy="30" r="10" fill="#002776" /></>,
};
const Flag: React.FC<{ c: FC; size: number; style?: React.CSSProperties }> = ({ c, size, style }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block", borderRadius: "50%", boxShadow: `0 ${size * 0.08}px ${size * 0.2}px rgba(28,28,30,0.25)`, border: `${Math.max(2, size * 0.06)}px solid #fff`, boxSizing: "border-box", flex: "none", ...style }}>
    <defs><clipPath id={`fc-${c}`}><circle cx="30" cy="30" r="30" /></clipPath></defs><g clipPath={`url(#fc-${c})`}>{FLAG[c]}</g>
  </svg>
);

// ---- the world map (dots; one layer per language) --------------------------------------------------------------------------
const PD = 15, LAT0 = 78, MW = 5400, MH = 2040;
type View = { lon: number; lat: number; s: number; y: number };
const at = (v: View, lon: number, lat: number) => ({ x: 540 + ((lon + 180) * PD - (v.lon + 180) * PD) * v.s, y: v.y + ((LAT0 - lat) * PD - (LAT0 - v.lat) * PD) * v.s });
const LANGS: { k: string; f: FC[] }[] = [{ k: "es", f: ["es", "mx", "ar", "co"] }, { k: "fr", f: ["fr", "ca"] }, { k: "de", f: ["de"] }, { k: "it", f: ["it"] }, { k: "pt", f: ["pt", "br"] }, { k: "nl", f: ["nl"] }];
const PLACE: Record<FC, [number, number]> = {
  es: [-3.7, 40.4], mx: [-102, 23], ar: [-64, -34], co: [-73, 4.5], pe: [-75, -9], cl: [-71, -33], fr: [2.4, 47], be: [4.5, 50.8], ch: [8.2, 46.8], ca: [-73, 47],
  de: [10.4, 51.2], at: [14.5, 47.5], nl: [5.3, 52.3], it: [12.5, 42.8], pt: [-8.2, 39.6], br: [-50, -12],
};
const WorldMap: React.FC<{ v: View; o: number; lit: number[]; tint?: number }> = ({ v, o, lit, tint = 1 }) => {
  const p = at(v, -180, LAT0);
  return o <= 0 ? null : (
    <div style={{ position: "absolute", left: p.x, top: p.y, width: MW, height: MH, transform: `scale(${v.s})`, transformOrigin: "0 0", opacity: o }}>
      <Img src={staticFile("map/world.png")} style={{ position: "absolute", left: 0, top: 0, width: MW, height: MH, opacity: tint }} />
      {LANGS.map((l, i) => lit[i] > 0 && <Img key={l.k} src={staticFile(`map/lang-${l.k}.png`)} style={{ position: "absolute", left: 0, top: 0, width: MW, height: MH, opacity: lit[i] }} />)}
    </div>
  );
};
const Pin: React.FC<{ v: View; c: FC; a: number; size?: number; label?: string }> = ({ v, c, a, size = 84, label }) => {
  if (a <= 0) return null;
  const p = at(v, ...PLACE[c]);
  return (
    <div style={{ position: "absolute", left: p.x - size / 2, top: p.y - size - 14 + (1 - a) * -40, opacity: Math.min(1, a * 1.6), transform: `scale(${0.6 + 0.4 * a})`, transformOrigin: "50% 100%" }}>
      <Flag c={c} size={size} />
      <div style={{ position: "absolute", left: size / 2 - 6, top: size - 4, width: 12, height: 12, background: "#fff", transform: "rotate(45deg)", borderRadius: 2 }} />
      {label && <div style={{ position: "absolute", left: size + 10, top: size / 2 - 22, height: 44, padding: "0 16px", borderRadius: 22, background: "#fff", display: "flex", alignItems: "center", boxShadow: "0 6px 16px rgba(28,28,30,0.15)", ...txt(26, 800) }}>{label}</div>}
    </div>
  );
};

// ---- a generic social feed (other people's lives) ---------------------------------------------------------------------------
const POSTS = [
  { v: V.beach, h: "@sun.and.salt", c: "golden hour with you ☀️", n: "24.1K" }, { v: V.night, h: "@nightswithana", c: "best night of the year", n: "87.3K" },
  { v: V.car, h: "@roadtrip.girls", c: "no plans, just vibes", n: "51.9K" },
];
const HeartIco = ({ s: z, c = "#fff" }: { s: number; c?: string }) => <svg width={z} height={z} viewBox="0 0 24 24"><path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.5 2.6C20.5 15 12 20.5 12 20.5z" fill={c} /></svg>;
const SocialFeed: React.FC<{ offset: number; dim?: number }> = ({ offset, dim = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden" }}>
    {Array.from({ length: 14 }, (_, i) => {
      const y = (i - offset) * SH; if (y <= -SH || y >= SH) return null;
      const p = POSTS[i % 3];
      return (
        <div key={i} style={{ position: "absolute", left: 0, top: y, width: SW, height: SH }}>
          <Clip src={p.v} at={0} offset={(i * 2.3) % 5} pos="50% 50%" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0) 25%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55))" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 58, display: "flex", justifyContent: "center", gap: 18, ...txt(16, 700, "#fff") }}><span style={{ opacity: 0.7 }}>Following</span><span style={{ borderBottom: "2px solid #fff" }}>For You</span></div>
          <div style={{ position: "absolute", right: 14, bottom: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, ...txt(13, 700, "#fff") }}>
            <HeartIco s={34} />{p.n}
            <svg width={32} height={32} viewBox="0 0 24 24" style={{ marginTop: 14 }}><path d="M4 5h16v11H9l-5 4z" fill="#fff" /></svg>1.2K
            <svg width={32} height={32} viewBox="0 0 24 24" style={{ marginTop: 14 }}><path d="M14 4l7 7-7 7v-4c-6 0-9 2-11 6 1-7 4-11 11-12z" fill="#fff" /></svg>Share
          </div>
          <div style={{ position: "absolute", left: 16, bottom: 110, ...txt(16, 800, "#fff") }}>{p.h}</div>
          <div style={{ position: "absolute", left: 16, bottom: 84, ...txt(14, 500, "#fff") }}>{p.c}</div>
        </div>
      );
    })}
    {dim > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(244,246,250,${0.85 * dim})` }} />}
  </div>
);

/** A phone (390 × 844 points) at stage scale `sc`, centred on (x, y). */
const Phone: React.FC<{ x: number; y: number; sc: number; o?: number; bezel?: number; children: React.ReactNode }> = ({ x, y, sc, o = 1, bezel = 1, children }) => o <= 0 ? null : (
  <div style={{ position: "absolute", left: x - (207 * sc), top: y - (434 * sc), width: 414, height: 868, transform: `scale(${sc})`, transformOrigin: "0 0", opacity: o }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: "#111318", opacity: bezel, boxShadow: `0 30px 80px rgba(28,28,30,${0.3 * bezel})` }} />
    <div style={{ position: "absolute", left: 12, top: 12, width: SW, height: SH, borderRadius: 52, overflow: "hidden", background: C.bg }}>{children}</div>
    <div style={{ position: "absolute", left: 207 - 62, top: 23, width: 124, height: 36, borderRadius: 18, background: "#000", opacity: bezel }} />
  </div>
);
const Touch: React.FC<{ x: number; y: number; o: number; press?: number }> = ({ x, y, o, press = 0 }) => o <= 0 ? null : (
  <div style={{ position: "absolute", left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: 30, background: "rgba(120,120,128,0.35)", border: "3px solid rgba(255,255,255,0.95)", boxSizing: "border-box", opacity: o, transform: `scale(${1 - 0.18 * press})`, zIndex: 50 }} />
);

// ---- headlines --------------------------------------------------------------------------------------------------------
const Head: React.FC<{ g: number; lines: W[][]; y: number; size?: number; out?: string; color?: string }> = ({ g, lines, y, size = 92, out, color = C.ink }) => (
  <>
    {lines.map((ws, i) => {
      const w = ws.reduce((a, x) => a + measure(x.t, size, 800, -0.03), 0) + 0.26 * size * (ws.length - 1);
      return <Line key={i} g={g} words={ws} x={540 - w / 2} y={y + i * size * 1.12} size={size} weight={800} color={color} ls={-0.03} out={out} outDur={0.25} />;
    })}
  </>
);
const B = C.blue;

// ---- the scenes -------------------------------------------------------------------------------------------------------
const Problem: React.FC<{ g: number }> = ({ g }) => {
  // the feed: very fast from frame 0 (the hook), slowing to other people's lives, fast again for the hour, then stopped
  const off = 5 * EASE_OUT(clamp01(g / T.f("slow"))) + 1.2 * k(g, "w:lives", 0.5, MOVE) + 5 * k(g, "timer+0.2", 1.5, MOVE);
  const dim = k(g, "empty", 0.4);
  const flick = (a: number, d = 9) => { const t = (g - a) / d; return t < 0 || t > 1 ? null : t; };
  const flicks = [0, 9, 18, 27, 36, 45, Math.round(s("w:lives") * 30), ...Array.from({ length: 5 }, (_, i) => Math.round(s("timer+0.2") * 30) + i * 9)].map((a) => flick(a)).find((t) => t !== null);
  const plans = k(g, "plans", 0.45) * (1 - k(g, "timer", 0.3, OUT));
  const PL = [["Learn Spanish", "w:putting"], ["Trip to Lisbon", "w:yours"], ["Meet new people", "w:on"]];
  const mins = Math.round(lerp(5, 60, k(g, "w:minutes", 1.15, MOVE)));
  const tmr = k(g, "timer", 0.35) * (1 - k(g, "empty", 0.25, OUT));
  const stats = k(g, "empty+0.2", 0.45);
  const battery = Math.round(lerp(78, 11, k(g, "w:minutes", 1.15, MOVE)));
  return (
    <>
      <Phone x={540} y={1170} sc={1.72}>
        <SocialFeed offset={off} dim={dim} />
        <StatusBar dark={dim < 0.5} />
        <div style={{ position: "absolute", right: 70, top: 17, ...txt(13, 800, battery < 20 ? C.red : dim < 0.5 ? "#fff" : C.ink) }}>{battery}%</div>
        {flicks !== undefined && flicks !== null && <Touch x={280} y={lerp(640, 230, FLICK(flicks))} o={Math.min(1, (1 - flicks) * 3)} />}
        {plans > 0 && (
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 40 + (1 - plans) * -120, opacity: plans, borderRadius: 26, background: "#fff", padding: "20px 22px", boxShadow: "0 20px 50px rgba(0,0,0,0.35)" }}>
            <div style={txt(20, 800)}>Your plans</div>
            {PL.map(([t, a]) => { const h = k(g, a, 0.3); return (
              <div key={t} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, ...txt(18, 600, h > 0.5 ? C.grey : C.ink) }}>
                <div style={{ width: 34, height: 34, borderRadius: 17, background: h > 0.5 ? C.line : C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {h > 0.5 ? <svg width={14} height={14} viewBox="0 0 14 14"><rect x="2" y="1" width="3.5" height="12" rx="1" fill={C.grey2} /><rect x="8.5" y="1" width="3.5" height="12" rx="1" fill={C.grey2} /></svg>
                    : <svg width={14} height={14} viewBox="0 0 14 14"><path d="M3 1.5v11l9-5.5z" fill="#fff" /></svg>}
                </div>
                <span style={{ flex: 1, textDecoration: h > 0.5 ? "line-through" : "none" }}>{t}</span>
                {h > 0.5 && <span style={{ ...txt(13, 800, C.grey2), background: C.line, borderRadius: 9, padding: "4px 8px" }}>ON HOLD</span>}
              </div>
            ); })}
          </div>
        )}
        {stats > 0 && (
          <div style={{ position: "absolute", left: 30, right: 30, top: 230 + (1 - stats) * 60, opacity: stats, borderRadius: 28, background: "#fff", padding: "24px 26px", boxShadow: "0 20px 50px rgba(28,28,30,0.18)" }}>
            <div style={txt(15, 700, C.grey)}>TODAY</div>
            {[["Time scrolled", "1 h 03 min", C.ink, "empty+0.3"], ["New words", "0", C.red, "w:get"], ["New people met", "0", C.red, "w:out"], ["Plans", "on hold", C.red, "w:it2"]].map(([l, v, c, a]) => { const q = k(g, a, 0.3); return (
              <div key={l} style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: q, transform: `translateY(${(1 - q) * 10}px)` }}>
                <span style={txt(19, 600, C.grey2)}>{l}</span><span style={txt(c === C.ink ? 22 : 30, 800, c)}>{v}</span>
              </div>
            ); })}
          </div>
        )}
      </Phone>
      <Head g={g} lines={[[{ t: "You're", at: "open" }, { t: "doing", at: "w:doing" }, { t: "it", at: "w:it" }], [{ t: "again.", at: "w:again", color: B }]]} y={110} size={112} out="w:through" />
      <Head g={g} lines={[[{ t: "Other", at: "w:other" }, { t: "people's", at: "w:peoples" }], [{ t: "lives.", at: "w:lives" }]]} y={120} out="w:putting-0.1" />
      <Head g={g} lines={[[{ t: "Yours?", at: "w:yours" }], [{ t: "On", at: "w:on" }, { t: "hold.", at: "w:hold", color: C.red }]]} y={120} out="timer" />
      {tmr > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 96 + (1 - tmr) * -30, opacity: tmr, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18 }}>
          <span style={{ ...txt(190, 800, mins >= 60 ? C.red : C.ink), letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums" }}>{mins >= 60 ? "1" : mins}</span>
          <span style={txt(76, 800, mins >= 60 ? C.red : C.ink)}>{mins >= 60 ? "hour" : "min"}</span>
        </div>
      )}
      <Head g={g} lines={[[{ t: "What", at: "w:what" }, { t: "did", at: "w:did" }, { t: "you", at: "w:you" }], [{ t: "get", at: "w:get" }, { t: "out", at: "w:out" }, { t: "of", at: "w:of" }, { t: "it?", at: "w:it2", color: B }]]} y={110} out="meet" />
    </>
  );
};
const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 2.2);

// ---- Bingua: the same scrolling, now useful ------------------------------------------------------------------------------
const CHIPS: { w: string; t: string; f: FC }[] = [
  { w: "hola", t: "hello", f: "es" }, { w: "merci", t: "thank you", f: "fr" }, { w: "danke", t: "thanks", f: "de" },
  { w: "grazie", t: "thanks", f: "it" }, { w: "obrigado", t: "thank you", f: "pt" }, { w: "dank je", t: "thanks", f: "nl" },
];
const pages = (): Page[] => [
  { clip: V.es, at: s("app") - 0.3, offset: 3, pos: "45% 40%", lines: [["¡Este bocadillo es buenísimo!", "This sandwich is amazing!"], ["Es el más famoso de toda la ciudad.", "It's the most famous one in the whole city."], ["¿Qué está pasando aquí?", "What's going on here?"], ["¡Hay una cola enorme!", "There's a huge line!"]] },
  { clip: V.park, at: s("app") - 0.3, offset: 1, lines: [["On se retrouve au parc ?", "Shall we meet at the park?"], ["Il fait trop beau aujourd'hui !", "The weather is so nice today!"]] },
  { clip: V.ibiza, at: s("app") - 0.3, offset: 2, lines: [["Mira qué calles tan bonitas.", "Look how pretty these streets are."], ["Vamos a la playa después.", "Let's go to the beach later."]] },
  { clip: V.balcony, at: s("app") - 0.3, offset: 2, lines: [["Salute! Alla nostra amicizia!", "Cheers! To our friendship!"], ["Che bella serata.", "What a lovely evening."]] },
];
const Solution: React.FC<{ g: number }> = ({ g }) => {
  // 6 swipes while "scrolling habit … useful": each lands a word that flies up into the collection
  const SW_T = [0, 0.45, 0.9, 1.35, 1.8, 2.25].map((d) => s("app") + 0.15 + d);
  const swipeIdx = SW_T.filter((t) => g / 30 >= t + 0.2).length;
  const offA = SW_T.reduce((a, t) => a + MOVE(clamp01((g / 30 - t) / 0.3)), 0) % 4;
  const offB = k(g, "love+0.2", 0.35, MOVE) + k(g, "love+0.9", 0.35, MOVE);
  const inWatch = g >= T.f("watch");
  const touch = (() => {
    for (const t of [...SW_T, ...(inWatch ? [s("love+0.2"), s("love+0.9")] : [])]) { const d = g / 30 - t + 0.1; if (d > 0 && d < 0.45) return { y: lerp(640, 280, FLICK(clamp01(d / 0.3))), o: Math.min(1, (0.45 - d) * 6, d * 8) }; }
    return null;
  })();
  const cur = k(g, "convo", 0.3, MOVE) * 2;
  const tapT = s("w:new");
  const tap = clamp01((g / 30 - tapT) * 6) * (1 - k(g, "convo", 0.2));
  const fam = wordBox("Es el más famoso de toda la ciudad.", "famoso");
  const famY = PAGE.top + lineTop(1, 1) + 20, famX = 24 + fam.x + fam.w / 2;
  const heart = k(g, "w:love", 0.35);
  return (
    <>
      {/* the phone: Bingua */}
      <Phone x={540} y={(inWatch ? 1190 : 1250) + (inWatch ? 0 : 1300 * k(g, "map", 0.45, OUT))} sc={1.5}>
        <StatusBar />
        <TopBar xp={40 + 6 * swipeIdx + (inWatch ? 20 : 0)} streak={inWatch ? 4 : 3} />
        {!inWatch && <Feed pages={pages()} offset={offA} />}
        {inWatch && <Feed pages={pages()} offset={offB} exPage={0} ex={{ cur: g < T.f("convo") ? 1 : 1 + cur / 2, hi: { line: 1, word: "famoso", pulse: 0, tapped: tap }, heart: g > T.f("love+0.9") ? heart : 0 }} />}
        {inWatch && tap > 0 && g < T.f("convo") && <div style={{ position: "absolute", left: 30, top: PAGE.top + lineTop(1, 1) - 132, zIndex: 12, opacity: tap }}><WordCard saved={0} tr={k(g, "w:words", 0.3)} /></div>}
        <TabBar active={0} badge={14 + swipeIdx + (g > T.f("w:words") ? 1 : 0)} />
        {touch && <Touch x={280} y={touch.y} o={touch.o} />}
        {inWatch && g > T.f("w:new-0.35") && g < T.f("w:new+0.35") && <Touch x={famX} y={famY} o={1} press={clamp01(1 - Math.abs(g / 30 - tapT) * 8)} />}
        {inWatch && g > T.f("w:love-0.3") && g < T.f("w:love+0.4") && <Touch x={362} y={PAGE.top + 210} o={1} press={clamp01(1 - Math.abs(g / 30 - s("w:love")) * 8)} />}
      </Phone>
      {/* the words you collected, flying up out of the phone */}
      {!inWatch && CHIPS.map((c, i) => {
        const t0 = SW_T[i] + 0.2, f = clamp01((g / 30 - t0) / 0.5);
        if (f <= 0) return null;
        const col = i % 2, row = Math.floor(i / 2);
        const tx = 300 + col * 480 - 210, ty = 260 + row * 120;
        // at "map" each word flies home to its country, where its flag pin lands
        const f2 = k(g, `map+${(0.06 * i).toFixed(2)}`, 0.55, MOVE), d = at(WORLD, ...PLACE[c.f]);
        const sc = (0.5 + 0.5 * MOVE(f)) * (1 - 0.4 * f2);
        const x = lerp(lerp(540, tx, MOVE(f)), d.x - 46 * sc, f2), y = lerp(lerp(1100, ty, MOVE(f)) - Math.sin(Math.PI * f) * 120, d.y - 140, f2) - Math.sin(Math.PI * f2) * 90;
        return (
          <div key={c.w} style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, height: 96, padding: "0 28px 0 16px", borderRadius: 48, background: "#fff", boxShadow: "0 14px 34px rgba(28,28,30,0.16)", transform: `scale(${sc})`, transformOrigin: "0 50%", opacity: 1 - clamp01((f2 - 0.75) / 0.25) }}>
            <Flag c={c.f} size={60} /><span style={txt(40, 800)}>{c.w}</span><span style={txt(26, 600, C.grey)}>{c.t}</span>
          </div>
        );
      })}
      <Head g={g} lines={[[{ t: "Your", at: "w:your" }, { t: "scrolling,", at: "w:scrolling2" }], [{ t: "made", at: "w:something" }, { t: "useful.", at: "w:useful", color: B }]]} y={70} size={84} out="map" />
      {/* watch, discover, understand, love */}
      <Head g={g} lines={[[{ t: "Watch", at: "w:watch" }, { t: "real", at: "w:real" }, { t: "videos.", at: "w:videos", color: B }]]} y={150} out="words-0.1" />
      <Head g={g} lines={[[{ t: "Discover", at: "w:discover" }, { t: "new", at: "w:new" }, { t: "words.", at: "w:words", color: B }]]} y={150} out="convo-0.1" />
      <Head g={g} lines={[[{ t: "Understand", at: "w:understand" }], [{ t: "real", at: "w:real2" }, { t: "conversations.", at: "w:conversations", color: B }]]} y={110} size={84} out="love-0.1" />
      <Head g={g} lines={[[{ t: "While", at: "w:while2" }, { t: "doing", at: "w:doing2" }, { t: "what", at: "w:what2" }], [{ t: "you", at: "w:you2" }, { t: "already", at: "w:already" }, { t: "love.", at: "w:love", color: B }]]} y={110} size={84} out="diff-0.1" />
    </>
  );
};

// ---- abroad ----------------------------------------------------------------------------------------------------------
const WORLD: View = { lon: -28, lat: 22, s: 0.36, y: 980 };
const EUROPE: View = { lon: 2, lat: 45.5, s: 1.55, y: 620 };
const mixView = (a: View, b: View, t: number): View => ({ lon: lerp(a.lon, b.lon, t), lat: lerp(a.lat, b.lat, t), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), t)), y: lerp(a.y, b.y, t) });
const CITIES: { c: FC; ll: [number, number]; n: string; at: string }[] = [
  { c: "es", ll: [2.17, 41.39], n: "Barcelona", at: "w:abroad" }, { c: "pt", ll: [-9.14, 38.72], n: "Lisbon", at: "w:exploring" }, { c: "fr", ll: [2.35, 48.86], n: "Paris", at: "w:the3" },
  { c: "it", ll: [12.5, 41.9], n: "Rome", at: "w:world" }, { c: "de", ll: [13.4, 52.5], n: "Berlin", at: "w:world+0.25" },
];
const CityPin: React.FC<{ v: View; c: FC; ll: [number, number]; n: string; a: number }> = ({ v, c, ll, n, a }) => {
  if (a <= 0) return null;
  const p = at(v, ll[0], ll[1]);
  return (
    <div style={{ position: "absolute", left: p.x - 36, top: p.y - 86 + (1 - a) * -30, opacity: Math.min(1, a * 1.6), transform: `scale(${0.6 + 0.4 * a})`, transformOrigin: "36px 86px" }}>
      <Flag c={c} size={72} />
      <div style={{ position: "absolute", left: 30, top: 70, width: 12, height: 12, background: "#fff", transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", left: 82, top: 14, height: 44, padding: "0 16px", borderRadius: 22, background: "#fff", display: "flex", alignItems: "center", boxShadow: "0 6px 16px rgba(28,28,30,0.15)", ...txt(24, 800) }}>{n}</div>
    </div>
  );
};
const World: React.FC<{ g: number }> = ({ g }) => {
  const toEu = k(g, "abroad", 0.9, MOVE);
  const v = mixView(WORLD, EUROPE, toEu);
  const mapO = Math.max(k(g, "map", 0.4) * (1 - k(g, "watch", 0.3)), k(g, "diff-0.1", 0.4)) * (1 - k(g, "outside", 0.35, OUT));
  const lit = LANGS.map((_, i) => k(g, `w:learning+${(0.18 * i).toFixed(2)}`, 0.35) * (1 - k(g, "abroad", 0.6)) + (g > T.f("abroad") ? 0.0 : 0));
  // the flight: home (Amsterdam) → Barcelona, then on to the other cities while exploring
  const home = at(v, 4.9, 52.37), dest = at(v, 2.17, 41.39);
  const fly = k(g, "abroad+0.3", 1.1, MOVE);
  const ctrl = { x: (home.x + dest.x) / 2 - 260, y: (home.y + dest.y) / 2 - 80 };
  const bez = (t: number) => ({ x: (1 - t) ** 2 * home.x + 2 * (1 - t) * t * ctrl.x + t * t * dest.x, y: (1 - t) ** 2 * home.y + 2 * (1 - t) * t * ctrl.y + t * t * dest.y });
  const pl = bez(Math.max(0.001, fly)), pl2 = bez(Math.max(0.002, fly - 0.01)), ang = (Math.atan2(pl.y - pl2.y, pl.x - pl2.x) * 180) / Math.PI;
  const path = Array.from({ length: 41 }, (_, i) => { const p = bez(i / 40); return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }).join(" ");
  const inEu = g >= T.f("abroad");
  const exploreO = 1 - k(g, "outside", 0.3, OUT);
  return mapO <= 0 ? null : (
    <div style={{ position: "absolute", inset: 0, opacity: mapO }}>
      <WorldMap v={v} o={1} lit={lit} />
      {!inEu && LANGS.map((l, i) => l.f.map((c, j) => <Pin key={c} v={v} c={c} a={k(g, `w:learning+${(0.18 * i + 0.06 * j).toFixed(2)}`, 0.4)} size={64} />))}
      {inEu && <>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={path} fill="none" stroke={C.blue} strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: undefined }} opacity={0} />
          <path d={path} fill="none" stroke={C.blue} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${fly} 1`} opacity={0.9 * exploreO} />
        </svg>
        <div style={{ position: "absolute", left: home.x - 12, top: home.y - 12, width: 24, height: 24, borderRadius: 12, background: C.ink, border: "5px solid #fff", boxSizing: "border-box", opacity: exploreO }} />
        <div style={{ position: "absolute", left: home.x + 20, top: home.y - 24, height: 44, padding: "0 16px", borderRadius: 22, background: C.ink, display: "flex", alignItems: "center", opacity: k(g, "abroad+0.2", 0.3) * exploreO, ...txt(24, 800, "#fff") }}>You</div>
        {fly > 0 && fly < 1 && (
          <svg width={70} height={70} viewBox="0 0 24 24" style={{ position: "absolute", left: pl.x - 35, top: pl.y - 35, transform: `rotate(${ang + 45}deg)` }}>
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill={C.ink} transform="rotate(-45 12 12)" />
          </svg>
        )}
        {CITIES.map((c) => <CityPin key={c.n} v={v} c={c.c} ll={c.ll} n={c.n} a={k(g, c.at, 0.4) * exploreO} />)}
        {g > T.f("explore") && CITIES.slice(1).map((c, i) => {
          const a = k(g, T.s(c.at) - 0.15, 0.35, MOVE); if (a <= 0) return null;
          const p0 = at(v, 2.17, 41.39), p1 = at(v, ...c.ll);
          return <svg key={c.n} width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: exploreO }}><path d={`M${p0.x} ${p0.y} L${p1.x} ${p1.y}`} stroke={C.blue} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${a} 1`} fill="none" /></svg>;
        })}
      </>}
    </div>
  );
};
/** A footage card (rounded, white border, shadow) that lands from below and leaves. */
const Card: React.FC<{ g: number; src: string; at0: string; out: string; x: number; y: number; w: number; h: number; rot?: number; offset?: number; children?: React.ReactNode }> = ({ g, src, at0, out, x, y, w, h, rot = 0, offset = 0, children }) => {
  const a = k(g, at0, 0.5), o = k(g, out, 0.3, OUT);
  if (a <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - a) * 260, width: w, height: h, opacity: Math.min(1, a * 1.5) * (1 - o), transform: `rotate(${rot * a}deg) scale(${1 - 0.06 * o})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 34, overflow: "hidden", border: "8px solid #fff", boxShadow: "0 30px 70px rgba(28,28,30,0.28)", background: "#000" }}><Clip src={src} at={T.s(at0) - 0.2} offset={offset} /></div>
      {children}
    </div>
  );
};
const Bubble: React.FC<{ a: number; side: "l" | "r"; t: string; tr: string; x: number; y: number }> = ({ a, side, t, tr, x, y }) => a <= 0 ? null : (
  <div style={{ position: "absolute", left: x, top: y + (1 - a) * 20, opacity: Math.min(1, a * 1.5), transform: `scale(${0.85 + 0.15 * a})`, transformOrigin: side === "l" ? "0 100%" : "100% 100%",
    padding: "18px 26px", borderRadius: side === "l" ? "28px 28px 28px 8px" : "28px 28px 8px 28px", background: side === "l" ? "#fff" : C.blue, boxShadow: "0 14px 34px rgba(28,28,30,0.2)", maxWidth: 640 }}>
    <div style={txt(36, 800, side === "l" ? C.ink : "#fff")}>{t}</div>
    <div style={{ marginTop: 4, ...txt(24, 600, side === "l" ? C.grey : "rgba(255,255,255,0.85)") }}>{tr}</div>
  </div>
);
const Abroad: React.FC<{ g: number }> = ({ g }) => {
  const oth = k(g, "others", 0.45) * (1 - k(g, "talk", 0.35, OUT));
  const done = (a: string) => k(g, a, 0.35);
  return (
    <>
      {/* watching others make memories: someone else's feed */}
      {oth > 0 && <Phone x={540 + (1 - oth) * 0} y={1450 + (1 - oth) * 500} sc={0.95} o={oth}><SocialFeed offset={0.02 * (g - T.f("others"))} /></Phone>}
      <Card g={g} src={V.park} at0="talk" out="friends+0.05" x={70} y={1010} w={940} h={620} rot={-2} offset={2}>
        <Bubble a={k(g, "w:starting", 0.35)} side="l" t="¡Hola! ¿De dónde eres?" tr="Hi! Where are you from?" x={-20} y={-150} />
        <Bubble a={k(g, "w:conversations2+0.35", 0.35)} side="r" t="¡Soy de Holanda!" tr="I'm from the Netherlands!" x={430} y={500} />
      </Card>
      <Card g={g} src={V.balcony} at0="friends" out="explore+0.05" x={90} y={1060} w={900} h={600} rot={2} offset={3}>
        <div style={{ position: "absolute", right: -10, top: -40, height: 80, padding: "0 28px", borderRadius: 40, background: "#fff", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 14px 34px rgba(28,28,30,0.2)", opacity: k(g, "w:friends", 0.3), ...txt(32, 800) }}>
          <HeartIco s={34} c={C.red} />+3 new friends
        </div>
      </Card>
      <Card g={g} src={V.ibiza} at0="explore" out="outside" x={110} y={1090} w={860} h={580} rot={-1.5} offset={3} />
      <Head g={g} lines={[[{ t: "Next", at: "w:next" }, { t: "time", at: "w:time" }], [{ t: "you're", at: "w:youre2" }, { t: "abroad…", at: "w:abroad", color: B }]]} y={1180} size={96} out="others" />
      {/* the list builds: what you do instead of watching */}
      {[["Starting conversations", "w:starting"], ["Making friends", "w:making"], ["Exploring the world", "w:exploring"]].map(([t, a], i) => { const q = done(a); return q > 0 && g < T.f("outside") && (
        <div key={t} style={{ position: "absolute", left: 90, top: 1700 + i * 0, display: i === Math.min(2, [done("w:starting"), done("w:making"), done("w:exploring")].filter((v) => v > 0).length - 1) ? "flex" : "none", alignItems: "center", gap: 18, opacity: q }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={34} height={34} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <span style={txt(60, 800)}>{t}</span>
        </div>
      ); })}
      <Head g={g} lines={[[{ t: "Not", at: "w:not" }, { t: "just", at: "w:just" }, { t: "watching", at: "w:watching" }], [{ t: "others", at: "w:others" }, { t: "make", at: "w:make" }, { t: "memories.", at: "w:memories", color: C.grey }]]} y={130} size={78} out="talk" />
    </>
  );
};

// ---- life happens outside your screen; the end ------------------------------------------------------------------------------
const Outside: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "outside", 0.5), b = k(g, "burst", 0.8, MOVE), o = k(g, "endcard", 0.4, OUT);
  if (a <= 0 || o >= 1) return null;
  // the phone's screen grows past the phone into the world: the bezel falls away as the footage takes the frame
  const sc = lerp(1.35, 2.75, b), cardW = lerp(SW * 1.35, 1080, b), cardH = lerp(SH * 1.35, 1920, b), r = lerp(70, 0, b);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 540 - cardW / 2, top: lerp(1180, 960, b) - cardH / 2 + (1 - a) * 400, width: cardW, height: cardH, borderRadius: r, overflow: "hidden", background: "#000" }}>
        <Clip src={V.selfie} at={s("outside") - 0.2} offset={0.5} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(rgba(244,246,250,${0.9 * b}) 0%, rgba(244,246,250,0) 34%)` }} />
      </div>
      {b < 1 && <div style={{ position: "absolute", left: 540 - (207 * sc), top: lerp(1180, 960, b) - 434 * sc + (1 - a) * 400, width: 414, height: 868, transform: `scale(${sc})`, transformOrigin: "0 0", opacity: 1 - b }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 64, border: "12px solid #111318", boxSizing: "border-box" }} />
      </div>}
      <Head g={g} lines={[[{ t: "Life", at: "w:life" }, { t: "happens", at: "w:happens" }], [{ t: "outside", at: "w:outside", color: B }, { t: "your", at: "w:your2" }, { t: "screen.", at: "w:screen" }]]} y={110} size={96} out="endcard" />
    </div>
  );
};
const End: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "endcard", 0.5);
  if (a <= 0) return null;
  const v: View = { lon: -28, lat: 20, s: 0.38, y: 1500 };
  const all = LANGS.map((_, i) => k(g, `endcard+${(0.25 + 0.12 * i).toFixed(2)}`, 0.4));
  const flags: FC[] = ["es", "mx", "ar", "co", "fr", "ca", "de", "it", "pt", "br", "nl"];
  const badge = k(g, "w:connections+0.2", 0.5);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, a * 1.5) }}>
      <WorldMap v={v} o={0.9} lit={all} />
      {flags.map((c, i) => <Pin key={c} v={v} c={c} a={k(g, `endcard+${(0.3 + 0.07 * i).toFixed(2)}`, 0.4)} size={58} />)}
      <div style={{ position: "absolute", left: 540 - 130, top: 300 + (1 - a) * 60, transform: `scale(${0.7 + 0.3 * a})` }}><BinguaIcon size={260} /></div>
      <Head g={g} lines={[[{ t: "Bingua", at: "endcard+0.1" }]]} y={590} size={150} />
      <Head g={g} lines={[[{ t: "Turn", at: "w:turn" }, { t: "scrolling", at: "w:scrolling3" }, { t: "into", at: "w:into3" }], [{ t: "real-life", at: "w:real3", color: B }, { t: "connections.", at: "w:connections", color: B }]]} y={800} size={74} />
      {badge > 0 && <Img src={staticFile("app-store-badge-white.svg")} style={{ position: "absolute", left: 540 - 190, top: 1040 + (1 - badge) * 30, width: 380, opacity: badge, filter: "drop-shadow(0 10px 24px rgba(28,28,30,0.18))" }} />}
    </div>
  );
};

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const flood = k(g, "meet", 0.45, MOVE), floodOut = k(g, "app", 0.4, MOVE);
  return (
    <div style={{ position: "absolute", left: -60, top: -60, width: 1200, height: 2040, overflow: "hidden", background: BG }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 1080, height: 1920 }}>
        <World g={g} />
        {g < T.f("meet+0.5") && <Problem g={g} />}
        {on(g, "app", "diff+0.4") && g < T.f("map") + 28 || on(g, "watch-0.1", "diff+0.4") ? <Solution g={g} /> : null}
        <Head g={g} lines={[[{ t: "Learning", at: "w:learning" }], [{ t: "a", at: "w:a" }, { t: "language.", at: "w:language", color: B }]]} y={180} size={110} out="watch-0.1" />
        <Head g={g} lines={[[{ t: "But", at: "w:but" }, { t: "here's", at: "w:heres" }], [{ t: "the", at: "w:the2" }, { t: "difference.", at: "w:difference", color: B }]]} y={180} size={110} out="abroad" />
        {on(g, "abroad", "outside+0.4") && <Abroad g={g} />}
        <Outside g={g} />
        <End g={g} />
        {/* Meet Bingua: the brand blue floods out of the phone, then pours back into it as the app */}
        {flood > 0 && floodOut < 1 && (
          <div style={{ position: "absolute", inset: 0, background: C.blue, clipPath: `circle(${lerp(0, 1300, flood) * (1 - floodOut) + 40 * floodOut}px at 540px ${lerp(1170, 1250, floodOut)}px)` }}>
            <div style={{ position: "absolute", left: 540 - 150, top: 640 - 150 + (1 - flood) * 80, transform: `scale(${0.6 + 0.4 * flood})`, opacity: 1 - floodOut }}><BinguaIcon size={300} /></div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", opacity: k(g, "w:bingua", 0.3) * (1 - floodOut), ...txt(170, 800, "#fff"), letterSpacing: "-0.04em" }}>Bingua</div>
          </div>
        )}
      </div>
    </div>
  );
};
export const SOFT_ = SOFT;
export const KF = (g: number) => k(g, "open", 0.1);
