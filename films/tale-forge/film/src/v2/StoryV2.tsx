// v2 story section, painted pages, light and paper only (no drawing pages): the hero (the book's cover painting),
// the characters (S6BA, a light on Mossa, then Amina), reading together (S6AA: Grandpa Erik narrates, the page's own
// Swedish line is read, a lens on Mossa, two pools of light to choose between), four endings fanned out of one
// page turn, the first page seen again with Amina in focus, then the three of them together (S6BB).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { C, F, MOVE, SETTLE, SOFT, clamp01, float, lerp, tw } from "../lib";
import { Burst, Chip, Glow, PaintBloom, Plate, Say, Sparkle, img } from "../parts";
import { T2 } from "./clock2";
import { Band, Gutter, Halves, LightPool, PageTurn, SHADOW, TopScrim, at } from "./kit";

const f = (p: string) => T2.f(p);
const k = (g: number, l: string, s: number, e = SETTLE) => T2.k(g, l, s, e);
const COVER = 1024 / 1536, S1A = 1264 / 848;

// ------------------------------------------------------------------------------------------ the hero (cover.webp)
const coverPlate = (s: number) => <Plate src="cover.webp" aspect={COVER} s={s} fx={0.5} fy={0.24} />;
export const HeroV2: React.FC<{ g: number }> = ({ g }) => {
  const s = lerp(1, 1.04, SOFT(clamp01((g - f("w:adventure")) / 100)));
  const flood = 1 - tw(g, f("w:adventure") + 11, f("w:adventure") + 30, SOFT);
  return (
    <AbsoluteFill data-name="HeroV2">
      {coverPlate(s)}
      <Glow x={691} y={338} r={380} color="rgba(255,230,180,0.6)" opacity={0.6 * k(g, "w:child2", 0.6)} />
      <Glow x={691} y={300} r={lerp(200, 460, k(g, "w:hero", 1.0, SOFT))} color="rgba(245,197,66,0.55)" opacity={0.7 * k(g, "w:hero", 1.0, SOFT)} />
      <Burst k={k(g, "w:hero", 1.6, SOFT)} x={691} y={420} n={12} spread={260} rise={180} seed={91} size={9} />
      <Band />
      <Glow x={1240} y={572} r={2400} color="rgba(255,243,214,1)" opacity={0.92 * flood} />
      <Say g={g} name="CapHero" x={140} y={900} size={66} out="w:inside-0.1" width={1650} shadow={SHADOW} words={[
        { t: "Where", at: "w:where" }, { t: "your", at: "w:your" }, { t: "child", at: "w:child2" }, { t: "is", at: "w:is" }, { t: "the", at: "w:the2" }, { t: "hero.", at: "w:hero", gold: true },
      ]} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ the characters (S6BA)
const Label: React.FC<{ x: number; y: number; o: number; t: string }> = ({ x, y, o, t }) => (
  <div style={{ position: "absolute", left: x - 200, top: y, width: 400, textAlign: "center", fontFamily: F.display, fontWeight: 600, fontSize: 38, color: C.goldSoft,
    textShadow: "0 2px 14px rgba(12,10,31,0.85)", opacity: o, transform: `translateY(${(1 - Math.min(1, o * 1.2)) * 22}px)` }}>{t}</div>
);
export const MeetV2: React.FC<{ g: number }> = ({ g }) => {
  const leaf = k(g, "w:inside-0.1", 0.9, SOFT);
  const s = lerp(1, 1.03, SOFT(clamp01((g - f("w:inside")) / 120)));
  const mossa = k(g, "w:characters", 0.6) * (1 - k(g, "w:stories", 0.8, MOVE));
  const amina = k(g, "w:stories", 0.8, MOVE);
  const px = lerp(1066, 1344, amina), py = lerp(640, 470, amina);
  return (
    <AbsoluteFill data-name="MeetV2">
      <Plate src="S6BA.webp" aspect={1.5} s={s} fx={0.5} fy={0.5} />
      <Gutter o={0.8} />
      <LightPool x={px} y={py} r={lerp(300, 320, amina)} k={Math.max(mossa, amina)} dim={0.3} />
      <Label x={1066} y={400} o={mossa} t="Mossa" />
      <Label x={1344} y={60} o={amina * (1 - k(g, "w:they4-0.2", 0.4, SOFT))} t="Amina" />
      {/* the cover opens towards us like a door, hinged on the left edge */}
      {leaf < 1 && (
        <AbsoluteFill style={{ perspective: 2600, perspectiveOrigin: "0px 540px" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 0.45 * (1 - leaf), background: "linear-gradient(90deg, rgba(10,6,20,0.9), rgba(10,6,20,0) 60%)" }} />
          <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${-105 * leaf}deg)`, transformStyle: "preserve-3d" }}>
            <AbsoluteFill style={{ backfaceVisibility: "hidden", overflow: "hidden" }}>{coverPlate(1.04)}</AbsoluteFill>
            <AbsoluteFill style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#F3E6CC" }} />
          </div>
        </AbsoluteFill>
      )}
      <Band />
      <Say g={g} name="CapMeet" x={140} y={900} size={64} out="w:they4-0.15" width={1700} shadow={SHADOW} words={[
        { t: "Inside,", at: "w:inside" }, { t: "they", at: "w:they3" }, { t: "meet", at: "w:meet" }, { t: "characters", at: "w:characters" }, { t: "with", at: "w:with3" }, { t: "stories", at: "w:stories" }, { t: "of", at: "w:of" }, { t: "their", at: "w:their2" }, { t: "own.", at: "w:own", gold: true },
      ]} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ reading together (S6AA)
const READ = { s0: 1.0, s1: 1.03 };
const readS = (g: number) => lerp(READ.s0, READ.s1, SOFT(clamp01((g - f("w:they4")) / 240)));
const P6 = (g: number, px: number, py: number) => at(1.5, readS(g), 0.5, 0.5, px, py);
export const ReadV2: React.FC<{ g: number }> = ({ g }) => {
  const bloom = k(g, "w:they4-0.2", 0.9);
  const s = readS(g);
  const amina = P6(g, 0.25, 0.47), mossa = P6(g, 0.745, 0.58), iris = P6(g, 0.54, 0.36);
  const pill = k(g, "w:listen-0.1", 0.45) * (1 - k(g, "w:decide-0.25", 0.35, SOFT));
  const prose = k(g, "w:read-0.1", 0.25, SOFT) * (1 - k(g, "w:decide-0.25", 0.35, SOFT));
  const readK = tw(g, f("w:read"), f("w:read") + 42, MOVE);
  const lens = k(g, "w:look-0.1", 0.5) * (1 - k(g, "w:and2-0.1", 0.35, SOFT));
  const choose = k(g, "w:choices", 0.8);
  const poolA = k(g, "w:decide", 0.6), poolM = k(g, "w:what", 0.6) * (1 - k(g, "w:choices", 0.6, SOFT));
  const breathe = (ph: number) => (choose > 0 ? 1 : 0.85 + 0.15 * Math.sin((g - f("w:what")) / 9 + ph));
  const tighten = k(g, "w:one", 0.6);
  const sparkR = lerp(lerp(18, 30, choose), 10, tighten);
  const dim = 0.28 * k(g, "w:decide-0.2", 0.4, SOFT) + 0.1 * tighten;
  return (
    <AbsoluteFill data-name="ReadV2">
      <PaintBloom k={bloom} x={768} y={770} r={2400} name="BloomS6AA">
        <Plate src="S6AA.webp" aspect={1.5} s={s} fx={0.5} fy={0.5} />
        <Gutter o={0.8} />
        <AbsoluteFill style={{ background: "rgba(12,10,31,1)", opacity: dim }} />
        {/* two ways to go: a pool of light on Amina, one on Mossa; the chosen one brings the girls together */}
        <Glow x={amina.x} y={amina.y} r={lerp(330, 520, choose)} color="rgba(255,226,170,1)" opacity={0.42 * poolA * breathe(0)} />
        <Glow x={mossa.x} y={mossa.y} r={300} color="rgba(255,226,170,1)" opacity={0.42 * poolM * breathe(Math.PI)} />
        <Glow x={iris.x} y={iris.y} r={300} color="rgba(255,226,170,1)" opacity={0.35 * choose} />
        {poolA > 0 && <Sparkle x={amina.x} y={amina.y - 300} r={sparkR * poolA} rot={g * 0.8} />}
        {poolM > 0 && <Sparkle x={mossa.x} y={mossa.y - 190} r={18 * poolM} rot={-g * 0.8} />}
        <Burst k={k(g, "w:matter", 1.4, SOFT)} x={amina.x} y={amina.y - 300} n={16} spread={240} rise={200} seed={41} size={11} />
        {/* look closer: a lens over Mossa on Iris's boot */}
        {lens > 0 && (
          <>
            <AbsoluteFill style={{ background: `radial-gradient(circle 260px at ${mossa.x}px ${mossa.y - 10}px, rgba(12,10,31,0) 70%, rgba(12,10,31,0.4) 100%)`, opacity: lens }} />
            <div data-name="Lens" style={{ position: "absolute", left: mossa.x - 170, top: mossa.y - 10 - 170, width: 340, height: 340, borderRadius: "50%", overflow: "hidden", opacity: lens, transform: `scale(${lerp(0.6, 1, lens)})`,
              border: `5px solid ${C.goldSoft}`, boxShadow: "0 0 0 2px rgba(23,18,50,0.6), 0 16px 40px rgba(5,8,20,0.6), 0 0 50px rgba(245,197,66,0.45)" }}>
              <Img src={img("S6AA.webp")} style={{ position: "absolute", width: 1920 * 2, height: 1280 * 2, left: 170 - 0.745 * 3840, top: 180 - 0.56 * 2560 }} />
            </div>
          </>
        )}
      </PaintBloom>
      <TopScrim />
      <Band o={Math.max(pill, prose)} />
      {/* listen: the narrator, as on tale-forge.app */}
      <div data-name="NarratorPill" style={{ position: "absolute", left: 140, top: 812, display: "flex", alignItems: "center", gap: 16, opacity: pill, transform: `translateY(${(1 - Math.min(1, pill * 1.3)) * 22}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 24px 12px 12px", borderRadius: 999, background: `linear-gradient(135deg, ${C.goldPale}, ${C.goldSoft})`, boxShadow: "0 14px 40px rgba(245,197,66,0.28)", fontFamily: F.ui, fontWeight: 800, fontSize: 28, color: C.btnInk }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: C.btnInk, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2, 3].map((b) => <div key={b} style={{ width: 5, borderRadius: 3, background: C.goldSoft, height: 10 + 14 * Math.abs(Math.sin(g / 4 + b * 1.3)) }} />)}
            </div>
          </div>
          Hear the narrator
        </div>
        <Chip size={26} style={{ position: "relative" }}>
          <Img src={img("narrator-morfar.webp")} style={{ width: 40, height: 40, borderRadius: 20, margin: "-6px 0 -6px -14px" }} />Grandpa Erik
        </Chip>
      </div>
      {/* read: the page's own line (the sample book is Swedish), the reading highlight sweeping on */}
      <div data-name="Prose" style={{ position: "absolute", left: 140, top: 912, width: 1500, fontFamily: F.display, fontWeight: 500, fontSize: 38, lineHeight: 1.4, color: C.warm, opacity: prose }}>
        <span style={{ backgroundImage: "linear-gradient(90deg, rgba(245,197,66,0.38), rgba(245,197,66,0.38))", backgroundRepeat: "no-repeat", backgroundSize: `${readK * 100}% 100%`, borderRadius: 6, padding: "0 4px" }}>
          Hon lämnade en bred bit bredvid knät. Amina slog sig ner där.
        </span>
      </div>
      <Say g={g} name="CapVerbs" x={960} y={44} size={56} out="w:and2-0.15" align="center" width={1600} shadow={SHADOW} words={[
        { t: "They", at: "w:they4" }, { t: "can", at: "w:can2" }, { t: "listen,", at: "w:listen", gold: true }, { t: "read,", at: "w:read", gold: true }, { t: "look", at: "w:look" }, { t: "closer,", at: "w:closer", gold: true },
      ]} />
      <Say g={g} name="CapDecide" x={960} y={44} size={56} out="w:because-0.15" align="center" width={1600} shadow={SHADOW} words={[
        { t: "and", at: "w:and2" }, { t: "decide", at: "w:decide", gold: true }, { t: "what", at: "w:what" }, { t: "they", at: "w:they5" }, { t: "want", at: "w:want" }, { t: "to", at: "w:to2" }, { t: "do.", at: "w:do" },
      ]} />
      <Say g={g} name="CapChoices" x={960} y={44} size={56} out="w:one-0.15" align="center" width={1600} shadow={SHADOW} words={[
        { t: "Because", at: "w:because" }, { t: "their", at: "w:their3" }, { t: "choices", at: "w:choices", gold: true }, { t: "matter.", at: "w:matter" },
      ]} />
    </AbsoluteFill>
  );
};
/** the last state of the reading page (for the page turn into the endings) */
const ReadFinal: React.FC<{ g: number }> = ({ g }) => {
  const amina = P6(g, 0.25, 0.47), iris = P6(g, 0.54, 0.36);
  return (
    <AbsoluteFill>
      <Plate src="S6AA.webp" aspect={1.5} s={readS(g)} fx={0.5} fy={0.5} />
      <Gutter o={0.8} />
      <AbsoluteFill style={{ background: "rgba(12,10,31,1)", opacity: 0.38 }} />
      <Glow x={amina.x} y={amina.y} r={520} color="rgba(255,226,170,1)" opacity={0.42} />
      <Glow x={iris.x} y={iris.y} r={300} color="rgba(255,226,170,1)" opacity={0.35} />
      <Sparkle x={amina.x} y={amina.y - 300} r={10} rot={g * 0.8} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ four endings, then page 1 again
const TWO = { s: 1.6, fx: 0.65, fy: 0.31 };
const ENDS = [
  { src: "S6AA.webp", x: 360, y: 600, r: -7 }, { src: "S6AB.webp", x: 740, y: 560, r: -2.5 },
  { src: "S6BA.webp", x: 1180, y: 560, r: 2.5 }, { src: "S6BB.webp", x: 1560, y: 600, r: 7 },
];
export const EndsSee: React.FC<{ g: number }> = ({ g }) => {
  const turn1 = tw(g, f("w:change") - 3, f("w:change") + 21, SOFT);
  const fan = k(g, "w:happens-0.15", 0.8, MOVE);
  const pick = k(g, "w:next", 0.4);
  const fanOut = k(g, "w:and3-0.15", 0.6, SOFT);
  const focus = k(g, "w:sometimes2-0.2", 1.0, SOFT);
  const rack = k(g, "w:helps-0.35", 0.9, SOFT);
  const turn2 = tw(g, f("w:things") - 3, f("w:things") + 21, SOFT);
  const sweep = k(g, "w:differently", 1.0, SOFT) * (1 - tw(g, f("w:differently") + 26, f("w:a6") - 2, SOFT));
  const ts = lerp(TWO.s, TWO.s + 0.04, SOFT(clamp01((g - f("w:and3")) / 110)));
  const amina = at(S1A, ts, TWO.fx, TWO.fy, 0.785, 0.345);
  const page1 = (
    <AbsoluteFill>
      <Halves
        left={{ filter: `blur(${lerp(24, 0, focus) + 5 * rack}px) brightness(${lerp(0.35, 0.9, focus) - 0.08 * rack}) saturate(0.85)` }}
        right={{ filter: `blur(${lerp(24, 6, focus) * (1 - rack)}px) brightness(${lerp(0.35, 0.75, focus) + 0.2 * rack}) saturate(${0.85 + 0.15 * rack})` }}>
        <Plate src="S1.webp" aspect={S1A} s={ts} fx={TWO.fx} fy={TWO.fy} />
      </Halves>
      <AbsoluteFill style={{ background: "#171232", mixBlendMode: "multiply", opacity: 0.5 * (1 - focus) }} />
      <LightPool x={amina.x} y={amina.y} r={300} k={rack} dim={0.18} lift={0.35} />
      <Gutter o={0.9} />
      {/* the four endings, stacked, then fanned out of the one decision */}
      {fanOut < 1 && ENDS.map((e, i) => {
        const x = lerp(960, e.x, fan) + (i - 1.5) * 4 * (1 - fan), y = lerp(560, e.y, fan) - (i === 3 ? 12 * pick : 0);
        const dimmed = i === 3 ? 1 : lerp(1, 0.55, pick);
        return (
          <div key={i} style={{ position: "absolute", left: x - 280, top: y - 187 + fanOut * 40, width: 560, height: 373, borderRadius: 14, overflow: "hidden",
            transform: `rotate(${e.r * fan}deg)`, border: `3px solid ${i === 3 && pick > 0 ? `rgba(245,197,66,${0.4 + 0.6 * pick})` : "#101a30"}`,
            boxShadow: `0 18px 44px rgba(5,8,20,0.5)${i === 3 ? `, 0 0 ${40 * pick}px rgba(245,197,66,${0.5 * pick})` : ""}`,
            opacity: (1 - fanOut), filter: `brightness(${dimmed}) blur(${12 * fanOut}px)` }}>
            <Img src={img(e.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
  const s6bb = (
    <AbsoluteFill>
      <Plate src="S6BB.webp" aspect={1.5} s={1} fx={0.5} fy={0.5} />
      <Glow x={100} y={300} r={1400} color="rgba(255,226,160,1)" opacity={0.35 * sweep} />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill data-name="EndsSee">
      {turn2 <= 0
        ? <PageTurn k={turn1} from={<ReadFinal g={g} />} to={page1} />
        : <PageTurn k={turn2} from={page1} to={s6bb} />}
      <TopScrim o={1 - k(g, "w:next+0.5", 0.5, SOFT)} />
      <Band o={k(g, "w:and3-0.2", 0.5, SOFT)} />
      <Say g={g} name="CapDecision" x={960} y={44} size={56} out="w:next+0.5" align="center" width={1700} shadow={SHADOW} words={[
        { t: "One", at: "w:one" }, { t: "small", at: "w:small2" }, { t: "decision", at: "w:decision" }, { t: "can", at: "w:can3" }, { t: "change", at: "w:change" }, { t: "what", at: "w:what2" }, { t: "happens", at: "w:happens" }, { t: "next.", at: "w:next", gold: true },
      ]} />
      <Say g={g} name="CapDifferently" x={140} y={900} size={64} out="w:a6-0.1" width={1700} shadow={SHADOW} words={[
        { t: "And", at: "w:and3" }, { t: "sometimes,", at: "w:sometimes2" }, { t: "a", at: "w:a5" }, { t: "story", at: "w:story2" }, { t: "helps", at: "w:helps" }, { t: "us", at: "w:us" }, { t: "see", at: "w:see" }, { t: "things", at: "w:things" }, { t: "differently.", at: "w:differently", gold: true },
      ]} />
    </AbsoluteFill>
  );
};
export { float };
