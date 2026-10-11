// v2 opening, painted pages and light only: Iris in the library at dusk (the sample book's first page, S1), the
// window seat she saved taken by the new girl. Light carries the feeling: dusk, a cool shadow after "play", a warm
// light rising from below on "And sometimes…", night falling on "isn't another question", and the blank Tale Forge
// book rising out of the warm light to open on "story".
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { C, F, MOVE, SETTLE, SOFT, clamp01, float, lerp, rand, tw } from "../lib";
import { Burst, Glow, PaintBloom, Plate, Say, Sparkle, img } from "../parts";
import { Book } from "../Theatre";
import { T2 } from "./clock2";
import { Band, SHADOW, at } from "./kit";

const f = (p: string) => T2.f(p);
const k = (g: number, l: string, s: number, e = SETTLE) => T2.k(g, l, s, e);
const S1A = 1264 / 848;

/** The violet watercolour dusk: brand gradient with the Morgon wash's paper texture laid in as light. */
export const Dusk: React.FC<{ g: number; stars?: number }> = ({ g, stars = 1 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0F0A2A 0%, #1E1650 38%, #3B2A86 70%, #6D4FE0 100%)" }} />
    <AbsoluteFill style={{ mixBlendMode: "soft-light", opacity: 0.85 }}>
      <Img src={img("morgon-aurora-desktop.webp")} style={{ width: 1920, height: 1080, filter: "grayscale(1) contrast(1.5)" }} />
    </AbsoluteFill>
    <Glow x={960} y={1000} r={900} color="rgba(242,178,46,0.22)" />
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

// the three framings of S1 (scale, focus) and where the faces land in each
const WIDE = { s0: 1.45, s1: 1.49, fx: 0.44, fy: 0.4 };
const CLOSE = { s0: 2.1, s1: 2.22, fx: 0.51, fy: 0.33 };
const POV = { s0: 2.0, s1: 2.05, fx: 0.75, fy: 0.31 };

export const OpeningS1: React.FC<{ g: number }> = ({ g }) => {
  // shot A: the wide, out of night into dusk
  const a = clamp01(g / f("face"));
  const wideS = lerp(WIDE.s0, WIDE.s1, SOFT(a));
  const face = at(S1A, wideS, WIDE.fx, WIDE.fy, 0.5, 0.32);
  const up = tw(g, 0, 30, SOFT);
  const homeK = k(g, "w:home-0.1", 0.8);
  // shot B: the close-up (blooms out of her face); shot C: what she sees (the window seat), then back to B
  const toClose = k(g, "face", 0.75);
  const toPov = k(g, "w:with-0.05", 0.45, SOFT);
  const back = k(g, "w:and-0.6", 0.7);
  const cs = lerp(CLOSE.s0, CLOSE.s1, SOFT(clamp01((g - f("face")) / (f("night") - f("face")))));
  const cool = k(g, "w:play+0.1", 0.8, SOFT) * (1 - 0.7 * k(g, "w:feeling", 1.0, SOFT));
  const rise1 = k(g, "w:and", 1.2, SOFT), rise2 = k(g, "w:way", 1.0, SOFT), rise3 = k(g, "w:feeling", 0.8, SOFT);
  const night = k(g, "w:isn't", 1.1, SOFT);
  const pool = k(g, "w:question", 0.6, SOFT);
  const povS = lerp(POV.s0, POV.s1, SOFT(clamp01((g - f("w:with")) / 80)));
  const blur = lerp(5, 8, k(g, "w:mind", 0.8, SOFT));
  const vig = lerp(0.2, 0.45, k(g, "w:know", 0.6, SOFT));
  const roll = at(S1A, povS, POV.fx, POV.fy, 0.62, 0.37);

  const closePlate = (
    <AbsoluteFill>
      <Plate src="S1.webp" aspect={S1A} s={cs} fx={CLOSE.fx} fy={CLOSE.fy} style={{ filter: `saturate(${lerp(1, 0.75, cool)}) brightness(${lerp(1, 0.86, cool) * lerp(1, 0.4, night)})` }} />
      <AbsoluteFill style={{ background: "#3B2A86", mixBlendMode: "multiply", opacity: 0.28 * cool,
        WebkitMaskImage: "radial-gradient(circle 300px at 920px 480px, transparent 40%, #000 100%)", maskImage: "radial-gradient(circle 300px at 920px 480px, transparent 40%, #000 100%)" }} />
      {/* something warm is brought near: a light rising from below, onto her coat, onto her face */}
      <Glow x={960} y={lerp(1240, 1020, rise2)} r={lerp(650, 820, rise2)} color="rgba(255,214,140,0.6)" opacity={rise1} />
      <Glow x={920} y={470} r={150} color="rgba(255,236,200,0.9)" opacity={0.35 * rise3} />
      <AbsoluteFill style={{ background: "#171232", mixBlendMode: "multiply", opacity: 0.55 * night,
        WebkitMaskImage: "radial-gradient(ellipse 360px 300px at 920px 520px, transparent 30%, #000 100%)", maskImage: "radial-gradient(ellipse 360px 300px at 920px 520px, transparent 30%, #000 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.6 * night }}><Dusk g={g} /></AbsoluteFill>
      <Glow x={960} y={1180} r={420} color="rgba(255,236,190,0.9)" opacity={0.5 * pool + 0.3 * night} />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill data-name="OpeningS1">
      {/* A: the wide, out of night: the window lights, a key light finds Iris, warm room light on "home" */}
      {toClose < 1 && (
        <AbsoluteFill>
          <Plate src="S1.webp" aspect={S1A} s={wideS} fx={WIDE.fx} fy={WIDE.fy}
            style={{ filter: `saturate(${lerp(0.7, 1, homeK)}) brightness(${lerp(0.25, 0.72, up) + 0.23 * homeK})` }} />
          <AbsoluteFill style={{ background: "#3B2A86", mixBlendMode: "multiply", opacity: lerp(0.35, 0.12, homeK) }} />
          <Glow x={640} y={160} r={760} color="rgba(255,214,170,0.45)" opacity={k(g, "w:some", 0.9, SOFT)} />
          <Glow x={face.x} y={face.y + 80} r={520} color="rgba(255,236,200,0.35)" opacity={k(g, "w:child", 0.6)} />
          <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(255,196,120,0.55) 0%, rgba(255,196,120,0) 55%)", mixBlendMode: "screen", opacity: homeK }} />
        </AbsoluteFill>
      )}
      {/* B: the close-up, blooming out of her face */}
      <PaintBloom k={toClose} x={face.x} y={face.y} r={2000} name="BloomClose">
        {toPov < 1 || back > 0 ? closePlate : null}
      </PaintBloom>
      {/* C: what is on her mind, from her eyeline: the window seat she saved, soft, as a thought */}
      {toPov > 0 && back < 1 && (
        <AbsoluteFill style={{ opacity: toPov }}>
          <Plate src="S1.webp" aspect={S1A} s={povS} fx={POV.fx} fy={POV.fy} style={{ filter: `blur(${blur}px) brightness(0.82) saturate(0.85)` }} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 80% at 55% 50%, rgba(12,10,31,0) 40%, rgba(12,10,31,${vig}) 100%)` }} />
          <Glow x={1300} y={260} r={900} color="rgba(255,220,180,0.3)" opacity={lerp(0.6, 1, k(g, "w:more", 0.8, SOFT))} />
          <Glow x={1500} y={300} r={lerp(1400, 300, toPov)} color="rgba(255,236,210,0.9)" opacity={0.9 * (1 - toPov) + 0.0} />
        </AbsoluteFill>
      )}
      {/* back to her, out of the end of the rolled paper */}
      {back > 0 && back < 1 && <PaintBloom k={back} x={roll.x} y={roll.y} r={1700} name="BloomBack">{closePlate}</PaintBloom>}
      <AbsoluteFill style={{ backgroundImage: `url(${img("grain.png")})`, mixBlendMode: "overlay", opacity: 0.12 }} />
      <Band o={1 - night * 0.3} />
      <Say g={g} name="CapSomeDays" x={140} y={940} size={58} out="face-0.1" width={1600} shadow={SHADOW} words={[
        { t: "Some", at: "w:some" }, { t: "days,", at: "w:days" }, { t: "a", at: "w:a" }, { t: "child", at: "w:child" }, { t: "comes", at: "w:comes" }, { t: "home…", at: "w:home", gold: true },
      ]} />
      <Say g={g} name="CapPlay" x={140} y={930} size={66} out="w:more-0.3" width={1650} shadow={SHADOW} words={[
        { t: "“They", at: "w:they" }, { t: "didn't", at: "w:didn't" }, { t: "let", at: "w:let" }, { t: "me", at: "w:me" }, { t: "play.”", at: "w:play", gold: true },
      ]} />
      <Say g={g} name="CapMind" x={140} y={930} size={60} out="w:and-0.2" width={1700} shadow={SHADOW} words={[
        { t: "With", at: "w:with" }, { t: "more", at: "w:more" }, { t: "on", at: "w:on" }, { t: "their", at: "w:their" }, { t: "mind", at: "w:mind" }, { t: "than", at: "w:than" }, { t: "they", at: "w:they2" }, { t: "know", at: "w:know" }, { t: "how", at: "w:how" }, { t: "to", at: "w:to" }, { t: "say.", at: "w:say", gold: true },
      ]} />
      <Say g={g} name="CapWay" x={140} y={860} size={62} out="night-0.15" width={1700} shadow={SHADOW} words={[
        { t: "And", at: "w:and" }, { t: "sometimes,", at: "w:sometimes" }, { t: "the", at: "w:the" }, { t: "best", at: "w:best" }, { t: "way", at: "w:way" }, { t: "into", at: "w:into" }, { t: "that", at: "w:that" }, { t: "feeling…", at: "w:feeling", gold: true },
      ]} />
      <Say g={g} name="CapQuestion" x={140} y={936} size={62} out="w:it's-0.1" width={1000} shadow={SHADOW} words={[
        { t: "isn't", at: "w:isn't" }, { t: "another", at: "w:another" }, { t: "question.", at: "w:question", gold: true },
      ]} />
    </AbsoluteFill>
  );
};

/** The blank Tale Forge book rises out of the warm light and opens on "story". Hands over to BookV2 at BOOK0. */
export const BOOK0 = { x: 960, y: 600, w: 250 };
export const BookReveal: React.FC<{ g: number }> = ({ g }) => {
  const up = k(g, "night", 1.0);
  const open = tw(g, f("w:story") - 6, f("w:story") + 22, SOFT);
  const bloom = k(g, "w:story-0.2", 1.4, SOFT);
  const y = lerp(1180, BOOK0.y, up) + float(g, 6, 7);
  return (
    <AbsoluteFill data-name="BookReveal">
      <AbsoluteFill style={{ opacity: k(g, "night+0.2", 0.6, SOFT) }}><Dusk g={g} /></AbsoluteFill>
      <Glow x={BOOK0.x} y={y} r={lerp(120, 900, bloom)} color="rgba(255,226,150,0.65)" opacity={clamp01(up * 2)} />
      <Book x={BOOK0.x} y={y} w={BOOK0.w} open={open} glow={0.4 + bloom} title={false} coverSrc="cover-next-book.webp" />
      <Burst k={k(g, "w:story-0.1", 2.0, SOFT)} x={BOOK0.x} y={BOOK0.y - 40} n={44} spread={700} rise={460} seed={61} size={18} />
      <Burst k={k(g, "w:story+0.3", 2.0, SOFT)} x={BOOK0.x} y={BOOK0.y - 40} n={26} spread={420} rise={560} seed={62} size={12} color={C.warm} />
      <Say g={g} name="CapStory" x={960} y={90} size={120} out="bookUp+0.4" align="center" weight={700} width={1400} shadow={SHADOW} words={[
        { t: "It's", at: "w:it's" }, { t: "a", at: "w:a2" }, { t: "story.", at: "w:story", gold: true },
      ]} />
    </AbsoluteFill>
  );
};
export { F, MOVE };
