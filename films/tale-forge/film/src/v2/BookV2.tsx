// v2 book: the blank Tale Forge book comes forward (BOOK0 → SPREAD). Left page: the Tale Forge mark. On "a small
// moment from today" the moment itself (S1, Iris's worried face, as we saw it) paints onto the right page; on "can"
// the page turns and carries it to the left; on "personalised" the painted hero (hero portrait) blooms on the new
// page; on "illustrated" her world (the book's cover painting) blooms around her; on "adventure" its light floods out.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { C, MOVE, SETTLE, SOFT, lerp, tw } from "../lib";
import { Burst, Glow, PaintBloom, Say, img } from "../parts";
import { Book } from "../Theatre";
import { SPREAD } from "../StoryWorld";
import { T2 } from "./clock2";
import { BOOK0, Dusk } from "./Opening";
import { SHADOW } from "./kit";

const f = (p: string) => T2.f(p);
const k = (g: number, l: string, s: number, e = SETTLE) => T2.k(g, l, s, e);
const PW = SPREAD.w, PH = SPREAD.w * 1.5;

/** today's moment: the close-up framing of S1 (source x .293–.727, y .148–.512), in its cool dusk grade */
const Moment: React.FC<{ rim: number }> = ({ rim }) => {
  const W = 420, H = 236, sw = W / (0.727 - 0.293), sh = sw * 848 / 1264;
  return (
    <div style={{ position: "absolute", left: PW / 2 - W / 2, top: 300 - H / 2, width: W, height: H, borderRadius: 16, overflow: "hidden",
      boxShadow: `0 10px 26px rgba(40,24,10,0.25), 0 0 ${40 * rim}px rgba(245,197,66,${0.55 * rim})` }}>
      <Img src={img("S1.webp")} style={{ position: "absolute", width: sw, height: sh, left: -0.293 * sw, top: -0.148 * sh, filter: "saturate(0.8) brightness(0.9)" }} />
      <div style={{ position: "absolute", inset: 0, background: "#3B2A86", mixBlendMode: "multiply", opacity: 0.22 }} />
    </div>
  );
};

export const BookV2: React.FC<{ g: number }> = ({ g }) => {
  const up = k(g, "bookUp", 1.2, MOVE);
  const x = lerp(BOOK0.x, SPREAD.x, up), y = lerp(BOOK0.y, SPREAD.y, up), w = lerp(BOOK0.w, SPREAD.w, up);
  const h = w * 1.5, s = w / SPREAD.w;
  const logoK = k(g, "w:tale", 0.7);
  const momentK = k(g, "w:small", 0.9);
  const rim = k(g, "w:today", 0.5, SOFT);
  const flip = tw(g, f("w:can") - 2, f("w:can") + 25, SOFT);
  const hero = k(g, "w:personalised", 0.8);
  const world = k(g, "w:illustrated", 0.9);
  const flood = tw(g, f("w:adventure") - 3, f("w:adventure") + 11, SOFT) * (1 - tw(g, f("w:adventure") + 11, f("w:adventure") + 30, SOFT));
  const page = (children: React.ReactNode) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
  );
  const cream = "linear-gradient(90deg, #E9D8B6 0%, #FFF7E9 6%)";
  return (
    <AbsoluteFill data-name="BookV2">
      <Dusk g={g} />
      <Glow x={960} y={580} r={900} color="rgba(255,214,140,0.32)" />
      <Book x={x} y={y} w={w} open={1} glow={0.5} title={false} coverSrc="cover-next-book.webp"
        left={page(
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: logoK, transform: `translateY(${(1 - logoK) * 22}px) scale(${lerp(0.92, 1, logoK)})` }}>
            <Img src={img("tf-logo.webp")} style={{ width: 380, height: 380, filter: "drop-shadow(0 0 22px rgba(245,197,66,0.45))" }} />
          </div>
        )}
        right={page(
          <>
            {/* the painted hero, on the page beneath the turning leaf */}
            <PaintBloom k={hero} x={PW / 2} y={250} r={560} name="PaintHero">
              <Img src={img("hero-portrait.webp")} style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, mixBlendMode: "multiply", opacity: 1 - 0.6 * world }} />
            </PaintBloom>
            {/* and her world around her: the book's cover painting */}
            <PaintBloom k={world} x={PW * 0.45} y={PH * 0.4} r={640} name="PaintWorld">
              <Img src={img("cover.webp")} style={{ position: "absolute", left: -78, top: 0, width: 717, height: 1075 }} />
            </PaintBloom>
          </>
        )} />
      {/* the leaf: today's moment on its front; it turns on "can" and lands, moment up, on the left page */}
      <div style={{ position: "absolute", left: x, top: y - h / 2, width: w, height: h, perspective: w * 6 }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${-180 * flip}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: cream, borderRadius: "2px 10px 10px 2px", overflow: "hidden" }}>
            {page(<PaintBloom k={momentK} x={PW / 2} y={300} r={300} name="PaintMoment"><Moment rim={rim} /></PaintBloom>)}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(40,24,10,0.5), rgba(40,24,10,0) 60%)", opacity: 0.6 * Math.sin(Math.PI * flip) }} />
          </div>
          <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: "linear-gradient(270deg, #E9D8B6 0%, #FFF7E9 6%)", borderRadius: "10px 2px 2px 10px", overflow: "hidden" }}>
            {page(<Moment rim={rim} />)}
          </div>
        </div>
      </div>
      <Burst k={k(g, "w:personalised", 1.6, SOFT)} x={1240} y={420} n={18} spread={300} rise={240} seed={71} size={12} />
      <Burst k={k(g, "w:adventure-0.1", 1.4, SOFT)} x={1240} y={560} n={22} spread={420} rise={300} seed={72} size={14} />
      {/* on "adventure" the painted page's light floods the frame; the story world is behind it */}
      <Glow x={1240} y={572} r={lerp(200, 2400, flood)} color="rgba(255,243,214,1)" opacity={0.92 * flood} />
      <Say g={g} name="CapMoment" x={960} y={34} size={58} out="w:can-0.25" align="center" width={1600} shadow={SHADOW} words={[
        { t: "With", at: "w:with2" }, { t: "Tale", at: "w:tale" }, { t: "Forge,", at: "w:forge" }, { t: "a", at: "w:a3" }, { t: "small", at: "w:small" }, { t: "moment", at: "w:moment" }, { t: "from", at: "w:from" }, { t: "today…", at: "w:today", gold: true },
      ]} />
      <Say g={g} name="CapBecome" x={960} y={34} size={58} out="w:adventure+0.1" align="center" width={1700} shadow={SHADOW} words={[
        { t: "…can", at: "w:can" }, { t: "become", at: "w:become" }, { t: "a", at: "w:a4" }, { t: "personalised", at: "w:personalised", gold: true }, { t: "illustrated", at: "w:illustrated" }, { t: "adventure.", at: "w:adventure" },
      ]} />
    </AbsoluteFill>
  );
};
export { C };
