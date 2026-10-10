// The story world: Tale Forge's own sample book "Iris och den sparade platsen" (public/img/S*.webp, cover.webp),
// its reader (narrator pill, prose, two choices: the site's EN copy), the endings map (the site's own geometry),
// the bookshelf, the night sky of adventures, the astronaut and the Natt→Morgon sunrise.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { C, F, MOVE, SETTLE, SOFT, clamp01, float, lerp, rand, tw } from "./lib";
import { T } from "./clock";
import { Burst, Chip, Glow, PaintBloom, Plate, Say, Sparkle, Stars, img, rise } from "./parts";
import { Book, Memory } from "./Theatre";

const k = (g: number, at: string, s: number, e = SETTLE) => T.k(g, at, s, e);
const BAND = "linear-gradient(180deg, rgba(12,10,31,0) 0%, rgba(12,10,31,0.62) 55%, rgba(12,10,31,0.78) 100%)";
const TEXT_SHADOW = "0 2px 18px rgba(12,10,31,0.55)";

/** The bottom text band of a picture-book page: a soft night scrim under the story text. */
const Band: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: BAND, opacity }} />
);

// ---------------------------------------------------------------- C. the book: Tale Forge, today's moment, the hero painted
// The spread opens out of the adult's hands (Room1's book at x 1080, y 790, page w 150) and grows to page w 620.
export const SPREAD = { x: 960, y: 572, w: 560 };
export const BookScene: React.FC<{ g: number }> = ({ g }) => {
  const up = k(g, "bookUp", 1.1, MOVE);
  const x = lerp(1080, SPREAD.x, up), y = lerp(760, SPREAD.y, up), w = lerp(210, SPREAD.w, up);
  const h = w * 1.5;
  const logoK = k(g, "logo", 0.7);
  const memK = tw(g, T.f("memory"), T.f("today") + 4, MOVE);
  const flip = k(g, "flip", 0.9, SOFT);
  const paint = k(g, "paint", 1.0, SOFT);
  const illus = k(g, "illus", 1.1, SOFT);
  const zoom = k(g, "adventure", 0.95, MOVE);
  const Z = lerp(1, 1920 / (2 * SPREAD.w), zoom);
  const s = w / SPREAD.w; // page content is laid out at the final page size and scaled with the book
  const page = (children: React.ReactNode) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: SPREAD.w, height: SPREAD.w * 1.5, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
  );
  // the leaf that turns at "flip": front = today's moment, back = blank
  const leafAng = -180 * flip;
  const childPage = page(
    <>
      <Img src={img("sil-child.png")} style={{ position: "absolute", left: 310 - 190, top: 250, width: 380, height: 570, opacity: 1 - paint }} />
      <PaintBloom k={paint} x={310} y={500} r={360} name="PaintIris">
        <Img src={img("cut-iris.png")} style={{ position: "absolute", left: 310 - 190, top: 250, width: 380, height: 570 }} />
      </PaintBloom>
    </>
  );
  return (
    <AbsoluteFill data-name="BookScene">
      <AbsoluteFill style={{ background: C.night, opacity: up }} />
      <Glow x={960} y={560} r={900} color="rgba(255,214,140,0.30)" opacity={1 - zoom} />
      <Stars g={g} n={60} h={1080} seed={8} opacity={0.6 * (1 - zoom)} />
      <AbsoluteFill style={{ transform: `translateY(${(540 - SPREAD.y) * zoom}px) scale(${Z})`, transformOrigin: `${SPREAD.x}px ${SPREAD.y}px` }}>
        <Book x={x} y={y} w={w} open={1} glow={0.55 * (1 - zoom)} title={false}
          left={page(
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: logoK, transform: `scale(${lerp(0.94, 1, logoK)})` }}>
              <Img src={img("tf-logo.webp")} style={{ width: 380, height: 380, filter: "drop-shadow(0 0 22px rgba(245,197,66,0.45))" }} />
            </div>
          )}
          right={childPage} />
        {/* the turning leaf, laid over the right page */}
        {flip < 1 && (
          <div style={{ position: "absolute", left: x, top: y - h / 2, width: w, height: h, perspective: w * 6 }}>
            <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${leafAng}deg)`, transformStyle: "preserve-3d" }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(90deg, #E9D8B6 0%, #FFF7E9 6%)", borderRadius: "2px 10px 10px 2px", overflow: "hidden" }}>
                {page(
                  <>
                    <div style={{ position: "absolute", left: lerp(-560, 70, SETTLE(memK)), top: lerp(-420, 300, SETTLE(memK)), transform: `scale(${lerp(1.15, 0.96, memK)}) rotate(${lerp(-8, -2, memK)}deg)`, transformOrigin: "0 0", opacity: clamp01(memK * 3) }}>
                      <Memory w={480} h={273} />
                    </div>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", ...rise(g, "today") }}>
                      <span style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color: "#8F6A12", background: "rgba(242,178,46,0.18)", padding: "10px 20px", borderRadius: 999 }}>TODAY</span>
                    </div>
                  </>
                )}
              </div>
              <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: "linear-gradient(270deg, #E9D8B6 0%, #FFF7E9 6%)", borderRadius: "10px 2px 2px 10px" }} />
            </div>
          </div>
        )}
        {/* the picture blooms across the spread: an illustrated adventure */}
        <div style={{ position: "absolute", left: x - w, top: y - h / 2, width: 2 * w, height: h, overflow: "hidden", borderRadius: 6 }}>
          <PaintBloom k={illus} x={w} y={h / 2} r={w * 1.3} name="BloomS1">
            <Img src={img("S1.webp")} style={{ position: "absolute", left: "50%", top: "50%", height: "100%", width: "auto", transform: "translate(-50%, -50%)" }} />
          </PaintBloom>
        </div>
      </AbsoluteFill>
      <Burst k={k(g, "paint", 1.6, SOFT)} x={960 + 310 * 1 - 0} y={520} n={16} spread={300} rise={260} seed={11} size={13} />
      <Say g={g} name="CapMoment" x={960} y={34} size={58} out="w:can-0.25" align="center" width={1600} shadow={TEXT_SHADOW} words={[
        { t: "A", at: "w:a3" }, { t: "small", at: "w:small" }, { t: "moment", at: "w:moment" }, { t: "from", at: "w:from" }, { t: "today…", at: "w:today", gold: true },
      ]} />
      <Say g={g} name="CapBecome" x={960} y={34} size={58} out="adventure+0.2" align="center" width={1700} shadow={TEXT_SHADOW} words={[
        { t: "…becomes", at: "w:become" }, { t: "a", at: "w:a4" }, { t: "personalised", at: "w:personalised", gold: true }, { t: "illustrated", at: "w:illustrated" }, { t: "adventure.", at: "w:adventure" },
      ]} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- D1. the hero in S1, then into S2: the characters
// S1 hands over from the book at the spread's zoomed framing: S1 2146 px wide, centred (Plate s = 2146/1920).
const S1_S0 = 1.5 * (1264 / 848) * 960; // S1 width after the zoom: 1.5w·(1264/848)·(1920/2w) = 2146.5 px
export const HeroScene: React.FC<{ g: number }> = ({ g }) => {
  const s0 = (S1_S0 / 1920) * (1 / 1.0); // ≈ 1.118
  const push = k(g, "hero", 2.2, SOFT);
  const s = s0 + 0.04 * push;
  const ring = k(g, "hero", 0.8);
  const toS2 = k(g, "inside2", 1.2, SOFT);
  const W = 1920 * s, H = W / (1264 / 848);
  const ix = 960 + (0.47 - 0.5) * W, iy = 540 + (0.42 - 0.5) * H;
  return (
    <AbsoluteFill data-name="HeroScene">
      <Plate src="S1.webp" aspect={1264 / 848} s={s} fx={0.5} fy={0.5} name="S1" />
      <Glow x={ix} y={iy} r={360} color="rgba(255,226,150,0.55)" opacity={ring * 0.7 * (1 - toS2)} />
      <Chip name="ChipHero" size={30} style={{ left: ix - 470, top: iy - 250, ...rise(g, "hero", "inside2") }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: C.goldSoft, boxShadow: "0 0 12px #f5c542" }} />Iris · the hero
      </Chip>
      <Band opacity={k(g, "adventure+0.95", 0.5, SOFT)} />
      <Say g={g} name="CapHero" x={140} y={890} size={72} out="inside2+0.3" width={1600} shadow={TEXT_SHADOW} words={[
        { t: "Your", at: "w:your" }, { t: "child", at: "w:child2" }, { t: "is", at: "w:is" }, { t: "the", at: "w:the2" }, { t: "hero.", at: "w:hero", gold: true },
      ]} />
      {/* S2 blooms out of Iris: inside the story */}
      <PaintBloom k={toS2} x={ix} y={iy} r={1500} name="BloomS2">
        <S2Plate g={g} />
      </PaintBloom>
    </AbsoluteFill>
  );
};

// S2 framing (full bleed): s 1, focus (0.5, 0.45): image 1920×1288 at top −40. Mossa (288, 501), Amina (1498, 385), Iris (845, 449).
const S2F = { s: 1, fx: 0.5, fy: 0.45 };
const S2Plate: React.FC<{ g: number }> = () => <Plate src="S2.webp" aspect={1.5} s={S2F.s} fx={S2F.fx} fy={S2F.fy} name="S2" />;

// The reader card: S2 shrinks from full bleed into a page card (x 420–1500, y 120–728), the site's reader layout.
const CARD = { x: 420, y: 130, w: 1080, h: 608 };
export const ReaderScene: React.FC<{ g: number }> = ({ g }) => {
  const spot1 = k(g, "mossa", 0.6), spotMove = k(g, "amina", 0.8, MOVE);
  const toCard = k(g, "listen", 0.9, MOVE);
  const spotOff = k(g, "listen", 0.35, SOFT);
  const sx = lerp(300, 1490, spotMove), sy = lerp(520, 400, spotMove), sr = lerp(250, 300, spotMove);
  // full-bleed S2 rect → card rect
  const full = { x: 0, y: -40, w: 1920, h: 1288 };
  const cardImg = { w: CARD.w, h: CARD.w / 1.5 }; // 1080×720 inside a 608-high card, top cropped at focus .45
  const ix = lerp(full.x, CARD.x, toCard), iy = lerp(full.y, CARD.y - (cardImg.h - CARD.h) * 0.45, toCard), iw = lerp(full.w, cardImg.w, toCard), ih = iw / 1.5;
  const clip = { l: lerp(0, CARD.x, toCard), t: lerp(0, CARD.y, toCard), r: lerp(0, 1920 - CARD.x - CARD.w, toCard), b: lerp(0, 1080 - CARD.y - CARD.h, toCard) };
  const readK = tw(g, T.f("w:read") - 4, T.f("w:read") + 24, MOVE);
  const proseOut = k(g, "decide", 0.35, SOFT);
  const lensK = tw(g, T.f("lens") - 2, T.f("lens") + 16, SETTLE), lensOut = k(g, "decide", 0.4, SOFT);
  const choose = k(g, "choose", 0.45);
  const toMap = k(g, "map", 0.7, SOFT);
  // mossa in card coords
  const mX = CARD.x + 0.15 * CARD.w, mY = CARD.y - (cardImg.h - CARD.h) * 0.45 + 0.43 * cardImg.h;
  const verbs: [string, string][] = [["Listen", "w:listen"], ["Read", "w:read"], ["Look closer", "w:look"], ["Decide", "w:decide"]];
  return (
    <AbsoluteFill data-name="ReaderScene" style={{ background: C.night }}>
      {/* the reader's letterbox: a blurred, saturated copy behind the page (site: blur 26px, saturate 1.08, scale 1.18) */}
      <AbsoluteFill style={{ opacity: toCard * (1 - toMap) }}>
        <Plate src="S2.webp" aspect={1.5} s={1.18} style={{ filter: "blur(26px) saturate(1.08) brightness(0.42)" }} />
      </AbsoluteFill>
      <div style={{ opacity: 1 - toMap, transform: `scale(${lerp(1, 0.92, toMap)})`, transformOrigin: "960px 540px", position: "absolute", inset: 0 }}>
        <div data-name="ReaderCard" style={{ position: "absolute", inset: 0, clipPath: `inset(${clip.t}px ${clip.r}px ${clip.b}px ${clip.l}px round ${24 * toCard}px)` }}>
          <Img src={img("S2.webp")} style={{ position: "absolute", left: ix, top: iy, width: iw, height: ih }} />
          {/* spotlight on the characters */}
          <div style={{ position: "absolute", inset: 0, opacity: spot1 * (1 - spotOff), background: `radial-gradient(circle ${sr}px at ${sx}px ${sy}px, rgba(12,10,31,0) 60%, rgba(12,10,31,0.62) 100%)` }} />
        </div>
        {toCard > 0.02 && <div style={{ position: "absolute", left: CARD.x - 3, top: CARD.y - 3, width: CARD.w + 6, height: CARD.h + 6, borderRadius: 26, border: "3px solid #101a30", boxShadow: "0 18px 44px rgba(5,8,20,0.5), 0 0 60px rgba(155,135,245,0.18)", opacity: toCard }} />}
        <Chip name="ChipMossa" size={28} style={{ left: 200, top: 700, ...rise(g, "mossa", "amina") }}>Mossa <span style={{ fontWeight: 500, color: C.sub }}>· a talking forest mouse</span></Chip>
        <Chip name="ChipAmina" size={28} style={{ left: 1180, top: 650, ...rise(g, "amina+0.2", "listen-0.2") }}>Amina <span style={{ fontWeight: 500, color: C.sub }}>· new in the library</span></Chip>
        <Band opacity={1 - toCard} />
        <Say g={g} name="CapCharacters" x={140} y={890} size={64} out="listen-0.45" width={1650} shadow={TEXT_SHADOW} words={[
          { t: "Characters", at: "w:characters" }, { t: "with", at: "w:with3" }, { t: "stories", at: "w:stories" }, { t: "of", at: "w:of" }, { t: "their", at: "w:their2" }, { t: "own.", at: "w:own", gold: true },
        ]} />
        {/* the four verbs, lit on their words */}
        <div data-name="Verbs" style={{ position: "absolute", left: 0, right: 0, top: 38, textAlign: "center", fontFamily: F.display, fontWeight: 600, fontSize: 46, color: C.warm, ...rise(g, "listen-0.1", "choose-0.2") }}>
          {verbs.map(([v, at], i) => {
            const on = tw(g, T.f(at) - 3, T.f(at) + 9);
            return (
              <span key={v} style={{ opacity: lerp(0.32, 1, on), display: "inline-block", margin: "0 18px", position: "relative" }}>
                {v}
                <span style={{ position: "absolute", left: 0, bottom: -6, height: 4, borderRadius: 2, width: `${100 * on}%`, background: `linear-gradient(90deg, ${C.goldPale}, ${C.goldSoft})` }} />
                {i < verbs.length - 1 && <span style={{ position: "absolute", right: -26, color: C.goldSoft, opacity: 0.8 }}>·</span>}
              </span>
            );
          })}
        </div>
        <Say g={g} name="CapChoices" x={960} y={38} size={52} out="map+0.1" align="center" width={1600} shadow={TEXT_SHADOW} words={[
          { t: "Their", at: "w:their3" }, { t: "choices", at: "w:choices", gold: true }, { t: "matter.", at: "w:matter" },
        ]} />
        {/* listen: the narrator pill */}
        <div data-name="NarratorPill" style={{ position: "absolute", left: CARD.x, top: 878, display: "flex", alignItems: "center", gap: 16, ...rise(g, "listen", "decide") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 24px 12px 12px", borderRadius: 999, background: `linear-gradient(135deg, ${C.goldPale}, ${C.goldSoft})`, boxShadow: "0 14px 40px rgba(245,197,66,0.28)", fontFamily: F.ui, fontWeight: 800, fontSize: 28, color: C.btnInk }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: C.btnInk, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 1, 2, 3].map((b) => <div key={b} style={{ width: 5, borderRadius: 3, background: C.goldSoft, height: 10 + 14 * Math.abs(Math.sin(g / 4 + b * 1.3)) * tw(g, T.f("w:listen"), T.f("w:listen") + 6) }} />)}
              </div>
            </div>
            Hear the narrator
          </div>
          <Chip size={26} style={{ position: "relative" }}>
            <Img src={img("narrator-morfar.webp")} style={{ width: 40, height: 40, borderRadius: 20, margin: "-6px 0 -6px -14px" }} />Grandpa Erik
          </Chip>
        </div>
        {/* read: the page's prose, the reading highlight sweeping on */}
        <div data-name="Prose" style={{ position: "absolute", left: CARD.x, top: 760, width: CARD.w, fontFamily: F.display, fontWeight: 500, fontSize: 32, lineHeight: 1.4, color: C.warm, opacity: tw(g, T.f("w:read") - 6, T.f("w:read") + 6) * (1 - proseOut) }}>
          <span style={{ backgroundImage: `linear-gradient(90deg, rgba(245,197,66,0.38), rgba(245,197,66,0.38))`, backgroundRepeat: "no-repeat", backgroundSize: `${readK * 100}% 100%`, borderRadius: 6, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", padding: "0 4px" }}>
            Iris stepped between the windowsill and the rug and placed the drawing paper on a low table.
          </span>
        </div>
        {/* look closer: a lens over Mossa */}
        {lensK > 0 && lensOut < 1 && (
          <>
            <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 24, opacity: lensK * (1 - lensOut),
              background: `radial-gradient(circle 230px at ${mX - CARD.x + 60}px ${mY - CARD.y - 10}px, rgba(12,10,31,0) 70%, rgba(12,10,31,0.55) 100%)` }} />
            <div data-name="Lens" style={{ position: "absolute", left: mX + 60 - 190, top: mY - 10 - 190, width: 380, height: 380, borderRadius: "50%", overflow: "hidden", opacity: lensK * (1 - lensOut), transform: `scale(${lerp(0.6, 1, lensK)})`,
              border: `5px solid ${C.goldSoft}`, boxShadow: "0 0 0 2px rgba(23,18,50,0.6), 0 16px 40px rgba(5,8,20,0.6), 0 0 50px rgba(245,197,66,0.45)" }}>
              <Img src={img("S2.webp")} style={{ position: "absolute", width: cardImg.w * 2.6, height: cardImg.h * 2.6, left: 190 - 0.15 * cardImg.w * 2.6, top: 190 - 0.41 * cardImg.h * 2.6 }} />
            </div>
          </>
        )}
        {/* decide: the two choices (the site's own copy) */}
        {(["Go with Mossa to the green rug.", "Stay and draw with the new child in the window light."] as const).map((c, i) => {
          const r = rise(g, `decide+${i * 0.12}`, undefined, 26);
          const chosen = i === 1 ? choose : 0;
          const dimmed = i === 0 ? choose : 0;
          return (
            <div key={c} data-name={`Choice${i + 1}`} style={{ position: "absolute", left: CARD.x, top: 770 + i * 92, width: CARD.w, height: 76, borderRadius: 18, display: "flex", alignItems: "center", padding: "0 30px", boxSizing: "border-box",
              background: chosen > 0 ? `linear-gradient(135deg, rgba(255,224,138,${chosen}), rgba(245,197,66,${chosen}))` : "rgba(255,255,255,0.06)", border: `1.5px solid ${chosen > 0.5 ? "rgba(245,197,66,0.9)" : "rgba(155,135,245,0.32)"}`, backdropFilter: "blur(22px)",
              fontFamily: F.display, fontWeight: 600, fontSize: 32, color: chosen > 0.5 ? C.btnInk : C.cardInk, boxShadow: chosen > 0 ? `0 14px 40px rgba(245,197,66,${0.3 * chosen})` : "none",
              opacity: (r.opacity as number) * (1 - 0.55 * dimmed), transform: `${r.transform} scale(${1 + 0.015 * chosen})` }}>
              <span style={{ marginRight: 18, color: chosen > 0.5 ? C.btnInk : C.goldSoft, fontFamily: F.ui, fontWeight: 800 }}>{i === 0 ? "A" : "B"}</span>{c}
            </div>
          );
        })}
        {/* the touch on B */}
        {(() => { const t = k(g, "choose-0.1", 0.6, SOFT); return t > 0 && t < 1 ? <div style={{ position: "absolute", left: 1180 - 90 * t, top: 862 + 38 - 90 * t, width: 180 * t, height: 180 * t, borderRadius: "50%", border: `3px solid rgba(255,247,233,${1 - t})` }} /> : null; })()}
        <Burst k={k(g, "star", 1.4, SOFT)} x={1180} y={900} n={20} spread={300} rise={200} seed={21} size={15} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- D2. the endings map: one small decision changes what happens next
const MAP = { x: 60, y: 22, s: 1.95 };
const P = (x: number, y: number) => [MAP.x + x * MAP.s, MAP.y + y * MAP.s] as const;
const BRANCHES = ["M 76 270 L 312 270", "M 312 270 C 355.2 270 376.8 138 420 138", "M 420 138 L 576 138", "M 312 270 C 355.2 270 376.8 402 420 402", "M 420 402 L 576 402",
  "M 576 138 C 616 138 636 72 676 72", "M 576 138 C 616 138 636 204 676 204", "M 576 402 C 616 402 636 336 676 336", "M 576 402 C 616 402 636 468 676 468",
  "M 676 72 L 856 72", "M 676 204 L 856 204", "M 676 336 L 856 336", "M 676 468 L 856 468"];
const LIT_1 = "M 76 270 L 312 270";
const LIT_2 = "M 312 270 C 355.2 270 376.8 402 420 402 L 576 402 C 616 402 636 468 676 468 L 856 468";
const ENDS = [["S6AA.webp", 72], ["S6AB.webp", 204], ["S6BA.webp", 336], ["S6BB.webp", 468]] as const;
export const MapScene: React.FC<{ g: number }> = ({ g }) => {
  const base = k(g, "map", 0.8, SOFT);
  const d1 = tw(g, T.f("map") + 6, T.f("w:decision") + 6, MOVE);
  const d2 = tw(g, T.f("w:change") - 4, T.f("w:next") + 2, MOVE);
  const lit4 = k(g, "w:next", 0.5);
  const together = k(g, "together", 1.4, SOFT);
  const starK = tw(g, T.f("map"), T.f("map") + 18, MOVE);
  const [c1x, c1y] = P(312, 270);
  const [bx, by] = P(420, 402);
  return (
    <AbsoluteFill data-name="MapScene" style={{ background: C.night }}>
      <Stars g={g} n={60} h={1080} seed={14} opacity={0.5} />
      <Glow x={960} y={540} r={900} color="rgba(109,79,224,0.20)" />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: base }}>
        <defs>
          <linearGradient id="mp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f5c542" /><stop offset="1" stopColor="#9b87f5" /></linearGradient>
          <linearGradient id="mr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f5c542" /><stop offset="1" stopColor="#6D4FE0" /></linearGradient>
          {ENDS.map(([, y], i) => <clipPath key={i} id={`me${i}`}><circle cx={856} cy={y} r={42} /></clipPath>)}
          <clipPath id="mcov"><rect x={50} y={236} width={52} height={68} rx={8} /></clipPath>
        </defs>
        <g transform={`translate(${MAP.x} ${MAP.y}) scale(${MAP.s})`}>
          {BRANCHES.map((d, i) => <path key={i} d={d} stroke="rgba(255,236,190,0.35)" strokeWidth={1.6} fill="none" strokeDasharray="0.1 8" strokeLinecap="round" />)}
          <path d={LIT_1} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - d1} stroke="url(#mp)" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <path d={LIT_2} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - d2} stroke="url(#mp)" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <image href={img("cover.webp")} x={50} y={236} width={52} height={68} clipPath="url(#mcov)" preserveAspectRatio="xMidYMid slice" />
          {[[168, 270], [236, 270], [420, 138], [500, 138], [420, 402], [500, 402], [676, 72], [676, 204], [676, 336], [676, 468]].map(([x, y], i) => {
            const on = (i < 2 && d1 > (x - 76) / 236) || ((i === 4 || i === 5 || i === 9) && d2 > [0, 0, 0, 0, 0.25, 0.42, 0, 0, 0, 0.74][i]);
            return <g key={i}><circle cx={x} cy={y} r={11} fill="#9b87f5" opacity={on ? 0.4 : 0.18} /><circle cx={x} cy={y} r={6} fill={on ? C.goldSoft : "#9b87f5"} /></g>;
          })}
          {[[312, 270], [576, 138], [576, 402]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect x={-13} y={-13} width={26} height={26} rx={6} transform="rotate(45)" fill="rgba(242,178,46,0.16)" stroke={C.goldSoft} strokeWidth={1.5} />
              <path d="M -5 -2 L 0 -7 L 5 -2 M -5 2 L 0 7 L 5 2" stroke={C.goldInk} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
          {ENDS.map(([src, y], i) => (
            <g key={i} opacity={i === 3 ? 1 : lerp(1, 0.5, lit4)} transform={`translate(856 ${y}) scale(${i === 3 ? 1 + 0.06 * lit4 : 1}) translate(-856 ${-y})`}>
              <image href={img(src)} x={814 - 21} y={y - 42} width={126} height={84} clipPath={`url(#me${i})`} preserveAspectRatio="xMidYMid slice" />
              <circle cx={856} cy={y} r={44} fill="none" stroke="url(#mr)" strokeWidth={i === 3 ? 2 + lit4 : 2} />
            </g>
          ))}
        </g>
      </svg>
      {/* the chosen star flies onto choice 1 */}
      {starK < 1 && <Sparkle x={lerp(1180, c1x, starK)} y={lerp(900, c1y, starK)} r={lerp(26, 18, starK)} opacity={1 - starK * 0.2} />}
      <Glow x={P(856, 468)[0]} y={P(856, 468)[1]} r={180} color="rgba(245,197,66,0.6)" opacity={lit4} />
      <Say g={g} name="CapDecision" x={120} y={90} size={66} out="together+0.2" width={760} shadow={TEXT_SHADOW} words={[
        { t: "One", at: "w:one" }, { t: "small", at: "w:small2" }, { t: "decision", at: "w:decision", gold: true }, { t: "can", at: "w:can3" }, { t: "change", at: "w:change" }, { t: "what", at: "w:what2" }, { t: "happens", at: "w:happens" }, { t: "next.", at: "w:next" },
      ]} />
      {/* S3B blooms out of the chosen branch's first page: the two girls drawing together */}
      <PaintBloom k={together} x={bx} y={by} r={1700} name="BloomS3B">
        <Plate src="S3B.webp" aspect={1.5} s={1} fx={0.5} fy={0.5} />
      </PaintBloom>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- D3. see things differently; return; the end
export const TogetherScene: React.FC<{ g: number }> = ({ g }) => {
  const push = k(g, "together", 3.5, SOFT);
  const card = k(g, "differently", 0.6);
  const flip = k(g, "w:differently-0.1", 0.7, SOFT);
  const shrink = k(g, "close", 0.9, MOVE);
  return (
    <AbsoluteFill data-name="TogetherScene" style={{ background: C.night }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${lerp(1, 0.17, shrink)})`, transformOrigin: "960px 560px", borderRadius: 30 * shrink, overflow: "hidden" }}>
        <Plate src="S3B.webp" aspect={1.5} s={1 + 0.04 * push} fx={0.5} fy={0.5} />
        <Band opacity={k(g, "together+1.4", 0.5, SOFT)} />
      </div>
      {/* before → after on the same character: Amina alone at the window, then drawing with Iris */}
      <div data-name="FlipCard" style={{ position: "absolute", left: 110, top: 150, width: 520, height: 390, perspective: 2600, opacity: card * (1 - shrink), transform: `translateY(${(1 - card) * 30}px) rotate(-4deg)` }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${-180 * flip}deg)` }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 18, overflow: "hidden", border: "10px solid #101a30", boxShadow: "0 18px 44px rgba(5,8,20,0.55)" }}>
            <Img src={img("S2.webp")} style={{ position: "absolute", width: 1536 * 0.62, height: 1024 * 0.62, left: -1536 * 0.62 * 0.78 + 250, top: -1024 * 0.62 * 0.36 + 185, filter: "saturate(0.75)" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 18, overflow: "hidden", border: "10px solid #101a30", boxShadow: "0 18px 44px rgba(5,8,20,0.55), 0 0 50px rgba(245,197,66,0.35)" }}>
            <Img src={img("S5BB.webp")} style={{ position: "absolute", width: 1536 * 0.42, height: 1024 * 0.42, left: -1536 * 0.42 * 0.5 + 250, top: -1024 * 0.42 * 0.42 + 185 }} />
          </div>
        </div>
      </div>
      <Say g={g} name="CapDifferently" x={140} y={890} size={64} out="close" width={1650} shadow={TEXT_SHADOW} words={[
        { t: "A", at: "w:a5" }, { t: "story", at: "w:story2" }, { t: "helps", at: "w:helps" }, { t: "us", at: "w:us" }, { t: "see", at: "w:see" }, { t: "things", at: "w:things" }, { t: "differently.", at: "w:differently", gold: true },
      ]} />
    </AbsoluteFill>
  );
};

// The book closes, joins the bookshelf (four endings: one found, three still waiting), then the ending opens big.
export const ShelfScene: React.FC<{ g: number }> = ({ g }) => {
  const close = k(g, "close+0.5", 0.8, SOFT);
  const toShelf = k(g, "shelf", 1.0, MOVE);
  const others = k(g, "shelf+0.2", 0.8);
  const ends = k(g, "ends", 1.2, MOVE);
  const bx = lerp(960, 1040, toShelf), by = lerp(560, 600, toShelf), bw = lerp(200, 230, toShelf);
  const shelfOut = ends;
  const [mx, my] = [bx + 0, by - 260];
  const R = lerp(40, 330, ends), cx = lerp(mx + 92, 960, ends), cy = lerp(my, 520, ends);
  return (
    <AbsoluteFill data-name="ShelfScene" style={{ background: C.night }}>
      <Stars g={g} n={70} h={1080} seed={21} opacity={0.6} />
      <Glow x={960} y={620} r={800} color="rgba(109,79,224,0.22)" />
      <div style={{ opacity: 1 - shelfOut, position: "absolute", inset: 0 }}>
        {/* the shelf: a line of gold light, the site's other books standing on it */}
        <div style={{ position: "absolute", left: 300, top: by + bw * 0.75 + 4, width: 1320, height: 6, borderRadius: 3, background: `linear-gradient(90deg, rgba(245,197,66,0), ${C.goldSoft}, rgba(245,197,66,0))`, opacity: toShelf, boxShadow: "0 0 24px rgba(245,197,66,0.5)" }} />
        {[["cover-tornet.webp", 500, -3], ["cover-filten.webp", 770, 2], ["cover-next-book.webp", 1310, 3]].map(([src, x, r], i) => (
          <div key={i} style={{ position: "absolute", left: (x as number) - 115, top: by - 172, width: 230, height: 345, borderRadius: 8, overflow: "hidden", opacity: others * (i === 2 ? 0.55 : 1), transform: `translateY(${(1 - others) * 30}px) rotate(${r}deg)`, boxShadow: "0 18px 44px rgba(5,8,20,0.5)", border: "3px solid #101a30" }}>
            <Img src={img(src as string)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
        <Book x={bx} y={by} w={bw} open={1 - close} title right={<Img src={img("S3B.webp")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />} />
        {/* the four endings above the book: one found, three waiting */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: mx - 160 + i * 84 - 32, top: my - 32, width: 64, height: 64, borderRadius: 32, border: `2px dashed rgba(245,197,66,${0.7 * toShelf})`, opacity: toShelf, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 700, fontSize: 26, color: C.goldInk, transform: `scale(${1 + 0.05 * Math.sin(g / 10 + i)})` }}>?</div>
        ))}
      </div>
      {/* the found ending: it grows into the last page of the adventure */}
      <div data-name="Ending" style={{ position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", opacity: toShelf, boxShadow: `0 0 0 ${lerp(2, 6, ends)}px ${C.goldSoft}, 0 0 ${lerp(20, 80, ends)}px rgba(245,197,66,0.55)` }}>
        <Img src={img("S6BB.webp")} style={{ position: "absolute", height: "100%", left: "50%", transform: "translateX(-50%)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontFamily: F.display, fontWeight: 600, fontSize: 40, letterSpacing: "0.22em", color: C.goldSoft, ...rise(g, "endmark", "room2") }}>THE END</div>
      <Say g={g} name="CapReturn" x={960} y={90} size={64} out="ends" align="center" width={1600} shadow={TEXT_SHADOW} words={[
        { t: "A", at: "w:a6" }, { t: "story", at: "w:story3" }, { t: "they", at: "w:they6" }, { t: "can", at: "w:can4" }, { t: "return", at: "w:return", gold: true }, { t: "to.", at: "w:to3" },
      ]} />
      <Say g={g} name="CapEnds" x={960} y={90} size={64} out="room2" align="center" width={1600} shadow={TEXT_SHADOW} words={[
        { t: "And", at: "w:and4" }, { t: "when", at: "w:when" }, { t: "the", at: "w:the3" }, { t: "adventure", at: "w:adventure2" }, { t: "ends…", at: "w:ends" },
      ]} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- F. the night sky of adventures; the astronaut
const CARDS = [["pick-1.webp", 360, 330, -6, 0], ["pick-2.webp", 760, 690, 4, 1], ["pick-3.webp", 1190, 300, -3, 2], ["surprise-us.webp", 1570, 640, 6, 3]] as const;
export const SkyScene: React.FC<{ g: number }> = ({ g }) => {
  const one = k(g, "one", 0.8);
  const toWorld = k(g, "world", 1.1, MOVE);
  const nebula = k(g, "world", 1.3, SOFT);
  const push = k(g, "astro", 2.4, SOFT);
  // the astronaut's book in nebula-hero.webp: (0.385, 0.43). Plate s 1.12, focus (0.45, 0.5) → (819, 455) on screen.
  const ns = 1.12 + 0.05 * push, nW = 1920 * Math.max(1, 1080 * 1.791 / 1920) * ns, nH = nW / 1.791;
  const ax = 960 + (0.385 - 0.45) * nW, ay = 540 + (0.43 - 0.5) * nH;
  const bx = lerp(960, ax, toWorld), by = lerp(560, ay, toWorld), bw = lerp(230, 26, toWorld);
  return (
    <AbsoluteFill data-name="SkyScene" style={{ background: "linear-gradient(180deg, #0C0A1F 0%, #171232 50%, #2E2368 100%)" }}>
      <Stars g={g} n={110} h={1080} seed={31} />
      <Glow x={700} y={620} r={700} color="rgba(109,79,224,0.28)" />
      {CARDS.map(([src, x, y, r, i]) => {
        const inK = k(g, `cards+${i * 0.22}`, 1.0);
        const fy = float(g, i % 2 ? 16 : 12, i % 2 ? 8 : 7, i * 1.7);
        return (
          <div key={src} data-name={`Card${i}`} style={{ position: "absolute", left: x - 180, top: y - 121, width: 360, height: 241, borderRadius: 18, overflow: "hidden", opacity: inK * lerp(1, 0.42, one) * (1 - k(g, "w:story4", 0.8, SOFT)) * (1 - toWorld),
            transform: `translate(${(x - 960) * (0.06 * one + 0.25 * k(g, "w:story4", 1.2, SOFT))}px, ${fy + (1 - inK) * 140}px) rotate(${r}deg)`, willChange: "transform", border: "3px solid #101a30", boxShadow: `0 18px 44px rgba(5,8,20,0.5), 0 0 40px rgba(245,197,66,${0.25 * inK})` }}>
            <Img src={img(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        );
      })}
      {/* one story tonight: the Iris book rises, glowing; on "tonight" a halo of light opens behind it */}
      <Glow x={960} y={560} r={lerp(120, 620, k(g, "w:story4-0.1", 1.0))} color="rgba(255,226,150,0.75)" opacity={k(g, "w:story4-0.1", 0.6) * (1 - toWorld)} />
      <Burst k={k(g, "w:tonight-0.1", 1.6, SOFT)} x={960} y={560} n={28} spread={460} rise={260} seed={41} size={16} />
      <div style={{ opacity: one * (1 - k(g, "world+0.8", 0.4, SOFT)), transform: `translateY(${(1 - one) * 120}px)`, position: "absolute", inset: 0 }}>
        <Book x={bx} y={by} w={bw} open={0} glow={0.9 + float(g, 0.1, 3)} title />
      </div>
      {/* a whole world: the astronaut's nebula blooms out of the book */}
      <PaintBloom k={nebula} x={ax} y={ay} r={2300} name="BloomNebula">
        <Plate src="nebula-hero.webp" aspect={1.791} s={ns} fx={0.45} fy={0.5} />
        {Array.from({ length: 26 }, (_, i) => {
          const t = ((g / 30) * (0.05 + rand(i) * 0.06) + rand(i * 3)) % 1;
          return <Sparkle key={i} x={rand(i * 7) * 1920} y={1080 - t * 1200} r={3 + rand(i * 5) * 5} opacity={Math.sin(Math.PI * t) * 0.85} rot={t * 120} color={C.goldPale} />;
        })}
      </PaintBloom>
      <Band opacity={1} />
      <Say g={g} name="CapMore" x={140} y={890} size={64} out="w:one2-0.05" width={1650} shadow={TEXT_SHADOW} words={[
        { t: "More", at: "w:more2" }, { t: "adventures", at: "w:adventures" }, { t: "waiting", at: "w:waiting" }, { t: "to", at: "w:to5" }, { t: "be", at: "w:be" }, { t: "discovered.", at: "w:discovered", gold: true },
      ]} />
      <Say g={g} name="CapTonight" x={140} y={890} size={64} out="world-0.05" width={1650} shadow={TEXT_SHADOW} words={[
        { t: "One", at: "w:one2" }, { t: "story", at: "w:story4" }, { t: "tonight.", at: "w:tonight", gold: true },
      ]} />
      <Say g={g} name="CapWorld" x={140} y={890} size={64} out="tomorrow-0.05" width={1650} shadow={TEXT_SHADOW} words={[
        { t: "A", at: "w:a8" }, { t: "whole", at: "w:whole" }, { t: "world", at: "w:world", gold: true }, { t: "to", at: "w:to6" }, { t: "explore.", at: "w:explore" },
      ]} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- G. tomorrow: Natt → Morgon, and the sign-off
export const MorningScene: React.FC<{ g: number }> = ({ g }) => {
  const toggle = rise(g, "tomorrow", "logoEnd");
  const sw = k(g, "morgon", 0.5);           // the site's toggle: 0.5 s
  const sky = k(g, "morgon", 1.4, SOFT);    // the backdrops cross-fade, at film pace
  const next = k(g, "morgon+0.3", 1.0);
  const nextOut = k(g, "logoEnd", 0.6, SOFT);
  const push = k(g, "tomorrow", 12, SOFT);
  const W = 1920 * (1 + 0.03 * push);
  return (
    <AbsoluteFill data-name="MorningScene">
      <AbsoluteFill style={{ opacity: 1 - sky }}>
        <Plate src="nebula-hero.webp" aspect={1.791} s={1.17} fx={0.45} fy={0.5} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sky }}>
        <Img src={img("morgon-aurora-desktop.webp")} style={{ position: "absolute", width: 1920, height: 1080, left: 0, top: 0, transform: `scale(${W / 1920})`, transformOrigin: "50% 50%", willChange: "transform" }} />
        <Glow x={960} y={1080} r={900} color="rgba(255,214,140,0.55)" blend="normal" opacity={0.6 * sky} />
      </AbsoluteFill>
      {/* the site's own Natt / Morgon switch */}
      <div data-name="ThemeToggle" style={{ position: "absolute", left: 960 - 190, top: 120, width: 380, height: 76, borderRadius: 999, border: `1.5px solid rgba(${Math.round(lerp(255, 136, sky))},${Math.round(lerp(243, 125, sky))},${Math.round(lerp(217, 160, sky))},${lerp(0.32, 1, sky)})`, background: `rgba(${Math.round(lerp(15, 255, sky))},${Math.round(lerp(22, 255, sky))},${Math.round(lerp(40, 255, sky))},${lerp(0.6, 0.72, sky)})`, backdropFilter: "blur(22px)", ...toggle }}>
        <div style={{ position: "absolute", top: 6, left: lerp(6, 190, sw), width: 184, height: 62, borderRadius: 999, background: sw > 0.5 ? `linear-gradient(135deg, ${C.violet}, ${C.violetInk})` : `linear-gradient(135deg, ${C.goldPale}, ${C.goldSoft})`, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }} />
        {(["Natt", "Morgon"] as const).map((t, i) => (
          <div key={t} style={{ position: "absolute", top: 0, left: i * 184 + 6, width: 184, height: 76, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: F.ui, fontWeight: 800, fontSize: 28,
            color: i === 0 ? (sw < 0.5 ? C.btnInk : C.plum) : (sw > 0.5 ? "#fff" : C.warm) }}>
            {i === 0
              ? <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
              : <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" /></svg>}
            {t}
          </div>
        ))}
      </div>
      {/* tomorrow's adventure: the next book, still unpainted */}
      <div data-name="NextBook" style={{ position: "absolute", left: 960 - 130, top: 300 + (1 - next) * 60 - nextOut * 40, width: 260, height: 390, borderRadius: 12, overflow: "hidden", opacity: next * (1 - nextOut), border: "3px solid #fff", boxShadow: "0 4px 12px rgba(36,31,53,0.1), 0 22px 52px rgba(36,31,53,0.18), 0 0 60px rgba(245,197,66,0.4)" }}>
        <Img src={img("cover-next-book.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {[0, 1].map((m) => (
        <div key={m} style={{ position: "absolute", inset: 0, opacity: m ? clamp01((sky - 0.5) / 0.25) : 1 - clamp01((sky - 0.25) / 0.25) }}>
          {!m && <Band opacity={1} />}
          <Say g={g} name={m ? "CapTomorrowDay" : "CapTomorrowNight"} x={960} y={800} size={62} out="logoEnd" align="center" color={m ? C.plum : C.warm} width={1700} shadow={m ? undefined : TEXT_SHADOW} words={[
            { t: "Another", at: "w:another2" }, { t: "adventure", at: "w:adventure3" }, { t: "waiting", at: "w:waiting2" }, { t: "for", at: "w:for" }, { t: "tomorrow.", at: "w:tomorrow", violet: !!m, gold: !m },
          ]} />
        </div>
      ))}
      {/* sign-off: the logo and the words arrive; nothing else moves across the screen */}
      <div data-name="Logo" style={{ position: "absolute", left: 960 - 170, top: 110, width: 340, height: 340, ...rise(g, "logoEnd", undefined, 18, 0.9) }}>
        <Img src={img("tf-logo.webp")} style={{ width: "100%", height: "100%", filter: "drop-shadow(0 6px 22px rgba(242,178,46,0.35))" }} />
      </div>
      <Say g={g} name="CapTag" x={960} y={500} size={86} out={200} align="center" color={C.plum} weight={700} width={1800} words={[
        { t: "Adventures", at: "w:adventures2" }, { t: "worth", at: "w:worth" }, { t: "talking", at: "w:talking", violet: true }, { t: "about.", at: "w:about", violet: true },
      ]} />
      <Say g={g} name="CapBelong" x={960} y={640} size={46} out={200} align="center" color="#5F5878" weight={500} width={1800} words={[
        { t: "A", at: "w:a9" }, { t: "world", at: "w:world2" }, { t: "they", at: "w:they7" }, { t: "belong", at: "w:belong" }, { t: "to.", at: "w:to7" },
        { t: "  A", at: "w:a10" }, { t: "story", at: "w:story5" }, { t: "you", at: "w:you2" }, { t: "share.", at: "w:share" },
      ]} />
      <div data-name="URL" style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: "0.06em", color: C.violet, ...rise(g, "url") }}>tale-forge.app</div>
    </AbsoluteFill>
  );
};
export { Chip };
