// v2 book: the open book comes forward out of the dusk (from the reveal at 960, 600, page w 250 to the spread at page
// w 560). Left page: the Tale Forge mark. Right page: today's moment drawn in crayon (the children's ring, one apart),
// stamped TODAY. The page turns: Iris is drawn in gold line ("personalised"), painted in watercolour ("illustrated"),
// the first painting blooms across the spread and we fall into it ("adventure").
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { C, F, MOVE, SETTLE, SOFT, clamp01, lerp, tw } from "../lib";
import { Burst, Glow, PaintBloom, Say, img } from "../parts";
import { Book } from "../Theatre";
import { SPREAD } from "../StoryWorld";
import { T2 } from "./clock2";
import { BOOK0, Dusk } from "./Opening";
import { Stroke, kid, pop } from "./Doodle";

const f = (p: string) => T2.f(p);
const k = (g: number, at: string, s: number, e = SETTLE) => T2.k(g, at, s, e);
const SHADOW = "0 2px 18px rgba(12,10,31,0.6)";
const PW = SPREAD.w, PH = SPREAD.w * 1.5;

export const BookV2: React.FC<{ g: number }> = ({ g }) => {
  const up = k(g, "bookUp", 1.1, MOVE);
  const x = lerp(BOOK0.x, SPREAD.x, up), y = lerp(BOOK0.y, SPREAD.y, up), w = lerp(BOOK0.w, SPREAD.w, up);
  const h = w * 1.5;
  const logoK = k(g, "logo", 0.7);
  const flip = k(g, "flip", 0.9, SOFT);
  const lineK = tw(g, f("line"), f("line") + 18, SOFT);
  const paint = k(g, "paint2", 0.9, SOFT);
  const illus = k(g, "illus", 1.0, SOFT);
  const zoom = k(g, "adventure", 0.95, MOVE);
  const Z = lerp(1, 1920 / (2 * SPREAD.w), zoom);
  const s = w / SPREAD.w;
  const page = (children: React.ReactNode) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
  );
  const ink = "#5B3FC7";
  const m0 = f("memory");
  const stamp = pop(g, f("today") - 2, 12);
  return (
    <AbsoluteFill data-name="BookV2">
      <AbsoluteFill style={{ opacity: 1 - zoom }}><Dusk g={g} /></AbsoluteFill>
      <Glow x={960} y={580} r={900} color="rgba(255,214,140,0.32)" opacity={1 - zoom} />
      <AbsoluteFill style={{ transform: `translateY(${(540 - SPREAD.y) * zoom}px) scale(${Z})`, transformOrigin: `${SPREAD.x}px ${SPREAD.y}px` }}>
        <Book x={x} y={y} w={w} open={1} glow={0.55 * (1 - zoom)} title={false}
          left={page(
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: logoK, transform: `scale(${lerp(0.92, 1, logoK)})` }}>
              <Img src={img("tf-logo.webp")} style={{ width: 380, height: 380, filter: "drop-shadow(0 0 22px rgba(245,197,66,0.45))" }} />
            </div>
          )}
          right={page(
            <>
              {/* Iris, drawn in gold line, then painted */}
              <div style={{ position: "absolute", left: PW / 2 - 200, top: 160, width: 400, height: 600, clipPath: `inset(0 0 ${(1 - lineK) * 100}% 0)`, opacity: 1 - paint * 0.85 }}>
                <Img src={img("line-iris.png")} style={{ width: "100%", height: "100%", filter: "brightness(0.85) saturate(1.2)" }} />
              </div>
              <PaintBloom k={paint} x={PW / 2} y={420} r={380} name="PaintIris">
                <Img src={img("cut-iris.png")} style={{ position: "absolute", left: PW / 2 - 200, top: 160, width: 400, height: 600 }} />
              </PaintBloom>
            </>
          )} />
        {/* the turning leaf: today's moment, drawn in crayon */}
        {flip < 1 && (
          <div style={{ position: "absolute", left: x, top: y - h / 2, width: w, height: h, perspective: w * 6 }}>
            <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${-180 * flip}deg)`, transformStyle: "preserve-3d" }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(90deg, #E9D8B6 0%, #FFF7E9 6%)", borderRadius: "2px 10px 10px 2px", overflow: "hidden" }}>
                {page(
                  <>
                    <svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`} style={{ position: "absolute" }}>
                      {[[150, 470], [240, 445], [330, 470]].flatMap(([px, py], i) => kid(px, py, 1.05, 0.6).map((d, j) => (
                        <Stroke key={`p${i}${j}`} g={g} d={d} a={m0 + i * 4 + j * 2} b={m0 + i * 4 + j * 2 + 10} color={ink} w={5} />)))}
                      <Stroke g={g} d="M 172 400 Q 195 388 218 392 M 262 392 Q 285 388 308 400" a={m0 + 14} b={m0 + 20} color={ink} w={5} />
                      <Stroke g={g} d="M 253 498 a 13 13 0 1 0 -26 0 a 13 13 0 1 0 26 0" a={m0 + 16} b={m0 + 22} color={C.gold} fill={C.gold} fillAt={m0 + 22} />
                      {kid(450, 500, 0.95, -0.4).map((d, j) => <Stroke key={`q${j}`} g={g} d={d} a={m0 + 18 + j * 2} b={m0 + 26 + j * 2} color={C.ember} w={5} />)}
                    </svg>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", opacity: clamp01(stamp * 2), transform: `scale(${stamp}) rotate(-4deg)` }}>
                      <span style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: "0.16em", color: "#8F6A12", background: "rgba(242,178,46,0.22)", border: "2px solid rgba(242,178,46,0.6)", padding: "10px 22px", borderRadius: 999 }}>TODAY</span>
                    </div>
                  </>
                )}
              </div>
              <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: "linear-gradient(270deg, #E9D8B6 0%, #FFF7E9 6%)", borderRadius: "10px 2px 2px 10px" }} />
            </div>
          </div>
        )}
        {/* the first painting blooms across the spread */}
        <div style={{ position: "absolute", left: x - w, top: y - h / 2, width: 2 * w, height: h, overflow: "hidden", borderRadius: 6 }}>
          <PaintBloom k={illus} x={w} y={h / 2} r={w * 1.3} name="BloomS1">
            <Img src={img("S1.webp")} style={{ position: "absolute", left: "50%", top: "50%", height: "100%", width: "auto", transform: "translate(-50%, -50%)" }} />
          </PaintBloom>
        </div>
      </AbsoluteFill>
      <Burst k={k(g, "paint2", 1.6, SOFT)} x={1240} y={560} n={22} spread={340} rise={280} seed={71} size={14} />
      <Say g={g} name="CapMoment" x={960} y={34} size={58} out="w:can-0.25" align="center" width={1600} shadow={SHADOW} words={[
        { t: "With", at: "w:with2" }, { t: "Tale", at: "w:tale" }, { t: "Forge,", at: "w:forge" }, { t: "a", at: "w:a3" }, { t: "small", at: "w:small" }, { t: "moment", at: "w:moment" }, { t: "from", at: "w:from" }, { t: "today…", at: "w:today", gold: true },
      ]} />
      <Say g={g} name="CapBecome" x={960} y={34} size={58} out="adventure+0.2" align="center" width={1700} shadow={SHADOW} words={[
        { t: "…becomes", at: "w:become" }, { t: "a", at: "w:a4" }, { t: "personalised", at: "w:personalised", gold: true }, { t: "illustrated", at: "w:illustrated" }, { t: "adventure.", at: "w:adventure" },
      ]} />
    </AbsoluteFill>
  );
};
export { C };
