// v2 opening, all storybook: Iris (cut from Tale Forge's hero portrait) hops home across a violet watercolour dusk to a
// gold crayon house; through the door we meet her worried face (the sample book's first page, S1) and her day drawn
// in crayon around her: the children playing in a ring, one child apart, a rain cloud. The doodles tangle (unsaid),
// unwind into a gold thread, questions pop up and blow away, and the thread leads to the book: "It's a story."
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { C, F, MOVE, SETTLE, SOFT, clamp01, float, lerp, rand, tw } from "../lib";
import { Burst, Glow, Plate, Say, Sparkle, img } from "../parts";
import { Book } from "../Theatre";
import { T2 } from "./clock2";
import { DoodleLayer, Stroke, kid, pop, qmark, star, tangle } from "./Doodle";

const f = (p: string) => T2.f(p);
const k = (g: number, at: string, s: number, e = SETTLE) => T2.k(g, at, s, e);
const SHADOW = "0 2px 18px rgba(12,10,31,0.6)";

/** The violet watercolour dusk: brand gradient with the Morgon wash's paper texture laid in as light. */
export const Dusk: React.FC<{ g: number; stars?: number }> = ({ g, stars = 1 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0F0A2A 0%, #1E1650 38%, #3B2A86 70%, #6D4FE0 100%)" }} />
    <AbsoluteFill style={{ mixBlendMode: "soft-light", opacity: 0.85 }}>
      <Img src={img("morgon-aurora-desktop.webp")} style={{ width: 1920, height: 1080, filter: "grayscale(1) contrast(1.5)" }} />
    </AbsoluteFill>
    <Glow x={1400} y={980} r={900} color="rgba(242,178,46,0.22)" />
    <AbsoluteFill style={{ backgroundImage: `url(${img("grain.png")})`, mixBlendMode: "overlay", opacity: 0.18 }} />
    {Array.from({ length: 46 }, (_, i) => {
      const x = rand(i * 3 + 5) * 1920, y = Math.pow(rand(i * 7 + 2), 1.5) * 620;
      const tw4 = 0.55 + float(g, 0.35, 4.6, rand(i) * 4.6);
      return rand(i * 11) > 0.82
        ? <Sparkle key={i} x={x} y={y} r={7 + rand(i) * 6} opacity={tw4 * stars} rot={g * 0.6 + i * 20} color={C.goldPale} />
        : <div key={i} style={{ position: "absolute", left: x, top: y, width: 3, height: 3, borderRadius: 2, background: "#F4EEFF", opacity: tw4 * stars }} />;
    })}
  </AbsoluteFill>
);

// the gold crayon house (right), base centre (1430, 820)
const HOUSE = {
  body: "M 1250 820 L 1250 600 L 1610 600 L 1610 820",
  roof: "M 1215 615 L 1430 455 L 1645 615",
  chim: "M 1530 528 L 1530 470 L 1572 470 L 1572 558",
  smoke: "M 1551 456 C 1540 430 1570 418 1558 394 C 1548 372 1578 360 1566 334",
  win: "M 1290 650 L 1380 650 L 1380 735 L 1290 735 Z",
  winx: "M 1335 650 L 1335 735 M 1290 692 L 1380 692",
  door: "M 1468 820 L 1468 690 C 1468 660 1552 660 1552 690 L 1552 820",
  ground: "M 40 870 C 380 840 760 880 1100 852 C 1300 836 1500 830 1880 846",
};
const DOOR = { x: 1534, y: 742 }; // the door after the house is scaled 1.3 about (1430, 830)

export const HomeScene: React.FC<{ g: number }> = ({ g }) => {
  const lit = k(g, "lit", 0.6, SOFT);
  const door = k(g, "door2", 0.5);
  // the walk: Iris hops from the left along the path to the door, a paper puppet with a little bounce
  const wk = tw(g, f("walk"), f("face") - 4, MOVE);
  const hop = Math.abs(Math.sin((g - f("walk")) / 30 * Math.PI * 2.2)) * (wk > 0 && wk < 1 ? 1 : 0);
  const ix = lerp(-200, 1470, wk), iFeet = 872 - hop * 18 - wk * 10, iH = lerp(500, 450, wk);
  const iW = iH * 512 / 700;
  const enter = clamp01(wk * 6);
  return (
    <AbsoluteFill data-name="HomeScene">
      <Dusk g={g} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs><linearGradient id="hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#21185A" /><stop offset="1" stopColor="#0E0A26" /></linearGradient></defs>
        <path d="M 0 860 C 380 830 760 872 1100 846 C 1300 830 1500 822 1920 838 L 1920 1080 L 0 1080 Z" fill="url(#hill)" />
      </svg>
      <Glow x={1300} y={716} r={320} color="rgba(255,214,140,0.65)" opacity={lit} />
      <Glow x={DOOR.x} y={DOOR.y} r={320} color="rgba(255,226,160,0.8)" opacity={door} />
      <DoodleLayer name="MoonDoodle" id="crayonM">
        <Stroke g={g} d="M 330 150 C 250 170 230 290 300 340 C 250 320 205 250 232 185 C 252 140 300 128 330 150 Z" a={f("house")} b={f("house") + 18} w={5} color={C.goldPale} fill="rgba(255,236,190,0.9)" fillAt={f("house") + 18} />
      </DoodleLayer>
      <Glow x={290} y={240} r={260} color="rgba(255,236,190,0.35)" opacity={tw(g, f("house") + 14, f("house") + 30)} />
      <DoodleLayer name="HouseDoodle" id="crayonH" style={{ transform: "scale(1.3)", transformOrigin: "1430px 830px" }}>
        <Stroke g={g} d={HOUSE.ground} a={f("house")} b={f("house") + 22} w={5} color="rgba(245,197,66,0.65)" />
        <Stroke g={g} d={HOUSE.body} a={f("house") + 4} b={f("house") + 26} />
        <Stroke g={g} d={HOUSE.roof} a={f("house") + 12} b={f("house") + 30} />
        <Stroke g={g} d={HOUSE.chim} a={f("house") + 22} b={f("house") + 32} w={5} />
        <Stroke g={g} d={HOUSE.smoke} a={f("house") + 30} b={f("house") + 48} w={4} color="rgba(255,240,210,0.7)" />
        <Stroke g={g} d={HOUSE.win} a={f("house") + 26} b={f("house") + 36} fill="rgba(255,214,120,0.85)" fillAt={f("lit")} />
        <Stroke g={g} d={HOUSE.winx} a={f("house") + 32} b={f("house") + 38} w={4} />
        <Stroke g={g} d={HOUSE.door} a={f("house") + 30} b={f("house") + 42} fill="rgba(255,236,180,0.95)" fillAt={f("door2")} />
        <Stroke g={g} d={star(1700, 300, 22)} a={f("house") + 36} b={f("house") + 46} w={4} fill={C.goldSoft} fillAt={f("house") + 46} />
        <Stroke g={g} d={star(1150, 230, 14)} a={f("house") + 42} b={f("house") + 50} w={4} fill={C.goldSoft} fillAt={f("house") + 50} />
        <Stroke g={g} d="M 140 900 C 420 880 760 905 1060 880 C 1250 865 1400 850 1468 822" a={f("path")} b={f("path") + 26} w={4} dash="2 16" color="rgba(255,236,190,0.75)" />
      </DoodleLayer>
      {/* Iris, a painted paper puppet, hopping home */}
      <div data-name="IrisWalk" style={{ position: "absolute", left: 0, top: 0, width: iW, height: iH * 768 / 700, opacity: enter * (1 - tw(g, f("face") - 8, f("face") + 2, SOFT)),
        transform: `translate(${ix - iW / 2}px, ${iFeet - iH * (734 / 700)}px) rotate(${Math.sin((g - f("walk")) / 30 * Math.PI * 2.2) * 2.5}deg)`, transformOrigin: "50% 95%", willChange: "transform" }}>
        <Img src={img("cut-iris.png")} style={{ width: "100%", height: "100%", filter: "drop-shadow(0 10px 18px rgba(8,5,30,0.55)) brightness(0.92) saturate(0.95)" }} />
      </div>
      <Burst k={k(g, "door2", 1.4, SOFT)} x={DOOR.x} y={DOOR.y - 20} n={16} spread={200} rise={180} seed={51} size={12} />
      <Say g={g} name="CapSomeDays" x={140} y={940} size={58} out="face" width={1600} shadow={SHADOW} words={[
        { t: "Some", at: "w:some" }, { t: "days,", at: "w:days" }, { t: "a", at: "w:a" }, { t: "child", at: "w:child" }, { t: "comes", at: "w:comes" }, { t: "home…", at: "w:home", gold: true },
      ]} />
    </AbsoluteFill>
  );
};

// S1 close-up on Iris's worried face: base 1920×1288 at s 2.3, her face (0.47, 0.30) at (820, 560).
const S1S = 2.3, S1W = 1920 * S1S, S1H = 1288 * S1S;
const S1FX = 0.47 + 140 / S1W, S1FY = 0.30 - 20 / S1H;
export const FaceScene: React.FC<{ g: number }> = ({ g }) => {
  const push = k(g, "face", 9.5, SOFT);
  const warm = k(g, "warm", 1.6, SOFT);
  const toNight = k(g, "night", 1.0, SETTLE);
  const tg = f("tangle");
  const out = tg + 4;
  // the tangle: drawn while the doodles fly into it; then it unwinds into the thread
  const tangleOut = f("thread") + 10;
  const qa = f("qaway");
  return (
    <AbsoluteFill data-name="FaceScene">
      <Plate src="S1.webp" aspect={1264 / 848} s={S1S * (1 + 0.035 * push)} fx={S1FX} fy={S1FY} style={{ filter: `saturate(${lerp(0.7, 1, warm)}) brightness(${lerp(0.86, 1, warm)})` }} />
      {/* dusk tint: the day still sits on her; it warms on "And sometimes" */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 80% at 42% 52%, rgba(36,26,82,0) 30%, rgba(23,18,50,0.82) 100%)", opacity: 1 - warm * 0.35 }} />
      <AbsoluteFill style={{ background: "#3B2A86", mixBlendMode: "multiply", opacity: 0.32 * (1 - warm) }} />
      <DoodleLayer name="FeelingDoodles" id="crayonF" style={{ transform: "scale(1.18)", transformOrigin: "980px 420px" }}>
        {/* the children playing in a ring, with a ball */}
        {[[1365, 420], [1455, 395], [1545, 420]].flatMap(([x, y], i) => kid(x, y, 1, 0.6).map((d, j) => (
          <Stroke key={`r${i}${j}`} g={g} d={d} a={f("d1") + i * 4 + j * 2} b={f("d1") + i * 4 + j * 2 + 12} out={out} color={INK} halo={HALO} w={6} />)))}
        <Stroke g={g} d="M 1387 352 Q 1410 340 1433 344 M 1477 344 Q 1500 340 1523 352" a={f("d1") + 14} b={f("d1") + 22} out={out} color={INK} halo={HALO} w={6} />
        <Stroke g={g} d="M 1468 450 a 13 13 0 1 0 -26 0 a 13 13 0 1 0 26 0" a={f("d1") + 18} b={f("d1") + 24} out={out} fill={C.goldSoft} fillAt={f("d1") + 24} />
        {/* one child apart, head down */}
        {kid(1700, 590, 1.0, -0.4).map((d, j) => <Stroke key={`a${j}`} g={g} d={d} a={f("d2") + j * 2} b={f("d2") + j * 2 + 10} out={out} color={C.ember} halo={HALO} w={6} />)}
        {/* a little rain cloud */}
        <Stroke g={g} d="M 300 330 C 270 330 262 290 296 284 C 296 248 346 236 364 262 C 378 236 430 244 428 280 C 462 284 460 330 428 330 Z" a={f("d3")} b={f("d3") + 14} out={out} color={INK} halo={HALO} w={6} />
        {[0, 1, 2].map((i) => {
          const t = ((g - f("d3") - 10 - i * 7) / 24) % 1;
          return g > f("d3") + 10 && g < out ? <path key={i} d={`M ${330 + i * 34} ${350 + t * 60} l -6 18`} stroke="#9FD0FF" strokeWidth={5} strokeLinecap="round" opacity={Math.sin(Math.PI * t)} /> : null;
        })}
        {/* the tangle, over her head */}
        <Stroke g={g} d={tangle(1000, 205, 95, 2)} a={tg + 2} b={tg + 18} out={tangleOut} color={INK} halo={HALO} w={6} />
        {/* the thread unwinds from the tangle and runs out of the frame: the way in */}
        <Stroke g={g} d="M 1000 205 C 1160 110 1240 340 1400 300 S 1640 170 1760 360 S 1890 560 1990 520" a={f("thread")} b={f("thread") + 40} out={f("night") + 6} color={C.gold} halo="rgba(255,250,235,0.9)" w={7} />
        {/* the questions pop up along it, then blow away */}
        {([["w:isn't", 1290, 360], ["w:another", 1560, 250], ["w:question", 1810, 430]] as const).map(([at, x, y], i) => {
          const p = pop(g, f(at) - 2, 12), away = tw(g, qa + i * 3, qa + i * 3 + 18, Easing2);
          return p > 0 && away < 1 ? (
            <g key={i} transform={`translate(${x + away * 160} ${y - away * 260}) rotate(${away * 70 - 8 + i * 8}) scale(${p * (1 - away * 0.4)})`} opacity={1 - away}>
              {qmark(0, 0, 1.7).map((d, j) => <g key={j}><path d={d} stroke={HALO} strokeWidth={17} strokeLinecap="round" fill="none" opacity={0.75} /><path d={d} stroke={C.violet} strokeWidth={9} strokeLinecap="round" fill="none" /></g>)}
            </g>
          ) : null;
        })}
      </DoodleLayer>
      {/* night falls; the thread leads to the book */}
      <AbsoluteFill style={{ clipPath: `circle(${lerp(0, 1250, toNight)}px at 960px 600px)` }}><Dusk g={g} /></AbsoluteFill>
      <Say g={g} name="CapPlay" x={140} y={930} size={66} out="w:more-0.3" width={1650} shadow={SHADOW} words={[
        { t: "“They", at: "w:they" }, { t: "didn't", at: "w:didn't" }, { t: "let", at: "w:let" }, { t: "me", at: "w:me" }, { t: "play.”", at: "w:play", gold: true },
      ]} />
      <Say g={g} name="CapMind" x={140} y={930} size={62} out="w:and-0.2" width={1650} shadow={SHADOW} words={[
        { t: "More", at: "w:more" }, { t: "than", at: "w:than" }, { t: "they", at: "w:they2" }, { t: "know", at: "w:know" }, { t: "how", at: "w:how" }, { t: "to", at: "w:to" }, { t: "say.", at: "w:say", gold: true },
      ]} />
      <Say g={g} name="CapWay" x={140} y={930} size={62} out="night" width={1700} shadow={SHADOW} words={[
        { t: "The", at: "w:the" }, { t: "best", at: "w:best" }, { t: "way", at: "w:way" }, { t: "into", at: "w:into" }, { t: "that", at: "w:that" }, { t: "feeling", at: "w:feeling" }, { t: "isn't", at: "w:isn't" }, { t: "another", at: "w:another" }, { t: "question.", at: "w:question", gold: true },
      ]} />
    </AbsoluteFill>
  );
};
const Easing2 = (t: number) => t * t * (3 - 2 * t);
const INK = "#2A1F5C", HALO = "rgba(255,250,240,0.85)";

/** The book rises out of the night and opens into light on "story". Hands over to BookV2 at (960, 600, w 250). */
export const BOOK0 = { x: 960, y: 600, w: 250 };
export const BookReveal: React.FC<{ g: number }> = ({ g }) => {
  const up = k(g, "night", 1.0);
  const open = tw(g, f("w:story") - 6, f("w:story") + 22, SOFT);
  const bloom = k(g, "w:story-0.2", 1.4, SOFT);
  return (
    <AbsoluteFill data-name="BookReveal">
      <Glow x={BOOK0.x} y={BOOK0.y} r={lerp(120, 900, bloom)} color="rgba(255,226,150,0.65)" opacity={up} />
      <div style={{ position: "absolute", inset: 0, opacity: up, transform: `translateY(${(1 - up) * 140 + float(g, 6, 7)}px)` }}>
        <Book x={BOOK0.x} y={BOOK0.y} w={BOOK0.w} open={open} glow={0.4 + bloom} title />
      </div>
      <Burst k={k(g, "w:story-0.1", 2.0, SOFT)} x={BOOK0.x} y={BOOK0.y - 40} n={44} spread={700} rise={460} seed={61} size={18} />
      <Burst k={k(g, "w:story+0.3", 2.0, SOFT)} x={BOOK0.x} y={BOOK0.y - 40} n={26} spread={420} rise={560} seed={62} size={12} color={C.warm} />
      <Say g={g} name="CapStory" x={960} y={90} size={120} out="bookUp+0.4" align="center" weight={700} width={1400} shadow={SHADOW} words={[
        { t: "It's", at: "w:it's" }, { t: "a", at: "w:a2" }, { t: "story.", at: "w:story", gold: true },
      ]} />
    </AbsoluteFill>
  );
};
export { F, C };
