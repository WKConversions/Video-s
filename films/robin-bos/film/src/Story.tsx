// The stage of the Robin Bos film: one continuous world, every object keyed on the voice's words (src/clock.ts).
// Plan: ../storyboard/plan.md. Layer order (bottom → top): canvas, light, squares, rail/year/counter, Robin (stretch one),
// the navy field, the month ticks, the K.B mark, €2M, the project grid, the team card, the white frame, the logos,
// Robin (stretch two), the four areas, LET'S TALK., the button, the contact lines.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { ARRIVE, DEPART, MOVE, Line, Bloom, Roll, measure, lerp } from "./kinetic";
import { C } from "./lib";
import { Portrait, Sq, Logo, Micro, Text, Rule, OdoDigit, odo } from "./parts";

const cl = (t: number) => Math.min(1, Math.max(0, t));
const F = (pos: string) => T.f(pos);

// ---- geometry ----
const S = 110, GAP = 12, PITCH = S + GAP;                       // the wall's squares
const WALL1 = { x: 880, y: 476 };                                // stretch one: top-left of cell (0,0)
const cell1 = (c: number, r: number) => ({ x: WALL1.x + c * PITCH + S / 2, y: WALL1.y + r * PITCH + S / 2 });
const WALL2 = { x: 980, y: 610 };                                // the viewer's wall, stretch two
const cell2 = (c: number, r: number) => ({ x: WALL2.x + c * PITCH + S / 2, y: WALL2.y + r * PITCH + S / 2 });
const ROBIN1 = { x: 700, y: 1120, h: 940 };                      // bottom-centre anchor, 40 px below the frame
const ROBIN2 = { x: 1590, y: 1140, h: 1030 };
const TYPE1 = 1250;                                              // type column, stretch one
const TYPE2 = 140;                                               // type column, stretch two
const NAME = 160, STATE = 96, AREA = 96, CTA = 190;
const TILE = { x: 780, y: 520, s: 460, r: 0.22 };                // the K.B tile in Robin's place
const GRID = { x: 540, y: 400, s: 64, gap: 18 };                 // 5×5 of projects
const gp = GRID.s + GRID.gap;
const CARD = { x: 1060, y: 540, w: 1000, h: 700 };               // the team photo card

// progress helpers: a move keyed on a word, landing `early` seconds before it
const lbl = (at: string, early: number) => (early >= 0 ? `${at}-${early}` : `${at}+${-early}`);
const k = (g: number, at: string, dur: number, ease = ARRIVE, early = 0.13) => T.k(g, lbl(at, early), dur, ease);
const between = (g: number, a: string, b: string) => g >= F(a) && g < F(b);

// a square that travels: from (x0,y0,s0) to (x1,y1,s1) on key `at` over dur, with blur on the fast frames
const Travel: React.FC<{ g: number; at: string; dur: number; from: [number, number, number]; to: [number, number, number]; ease?: (t: number) => number; early?: number; o?: number; name?: string; color?: string; r?: number }> = ({ g, at, dur, from, to, ease = MOVE, early = 0.13, o = 1, name, color, r }) => {
  const p = k(g, at, dur, ease, early);
  const sp = Math.sin(p * Math.PI);
  return <Sq name={name} x={lerp(from[0], to[0], p)} y={lerp(from[1], to[1], p)} s={lerp(from[2], to[2], p)} o={o} color={color} r={r} style={{ filter: sp > 0.3 ? `blur(${sp * 4}px)` : undefined }} />;
};

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const s = g / 30;
  const tileWidth = TILE.s;
  // ---------- stretch one: the wall ----------
  // rise order and start frames for the five squares that join the first one (bottom-right is there at frame 0)
  const rise1: { c: number; r: number; at: number }[] = [
    { c: 0, r: 2, at: 1 }, { c: 1, r: 1, at: 13 }, { c: 0, r: 1, at: 25 }, { c: 1, r: 0, at: 37 }, { c: 0, r: 0, at: 49 },
  ];
  const course = k(g, "w:build", 0.47, MOVE, 0.3);                      // the wall grows a course on "I build": everything up 122
  const lift = course * PITCH;
  const robin1Exit = k(g, "w:consultancy", 0.55, DEPART, 0.15);    // Robin and the wall remainder leave left
  const exitX = -robin1Exit * 1300;
  const wallVisible = g < F("w:consultancy") + 20;

  // which squares leave the wall, and when: (1,0) → the period of BOS.; (0,0) → People.; (1,1) → Process.; (0,1) → Technology.
  const nameW = measure("BOS", NAME, 700, -0.08);
  const periodBOS = { x: TYPE1 + nameW + NAME * 0.14, y: 560 + NAME * 0.74 };
  const stW = (t: string) => measure(t, STATE, 500, -0.045);
  const perStatement = (t: string, row: number) => ({ x: TYPE1 + stW(t) + STATE * 0.14, y: 300 + row * 140 + STATE * 0.76 });
  const pPeople = perStatement("People", 0), pProcess = perStatement("Process", 1), pTech = perStatement("Technology", 2);
  const gatherPt = { x: 1480, y: 470 };                           // where the three periods gather into one square

  // ---------- B4–B5: the tile, the rail, the year, the months ----------
  const tileIn = k(g, "w:kay", 0.28, ARRIVE);                     // the gathered square becomes the tile
  const tileMove = k(g, "w:consultancy", 0.5, MOVE, 0.15);         // into Robin's place
  const tileX = lerp(gatherPt.x, TILE.x, tileMove), tileY = lerp(gatherPt.y, TILE.y, tileMove);
  const tileS = lerp(90, tileWidth, tileIn);
  const railK = k(g, "w:in", 0.6, MOVE, 0.3);                      // the rail draws out of the tile
  const railExt = k(g, "w:eighteen", 0.8, MOVE, 0.25);             // the rail extends and lays the months
  const railMore = k(g, "w:later", 0.8, MOVE, 0.0);                // then it keeps going toward the edge (B11 progress)
  const monthsN = Math.floor(railExt * 18 + 1e-6);
  const field = k(g, "w:two", 0.53, MOVE, 0.3);                    // the tile grows into the navy field
  const fieldOn = g >= F("w:two-0.3") && g < F("w:today") + 20;
  // ---------- B6: the number, the grid, the card ----------
  const headerK = k(g, "w:twenty3", 0.47, MOVE, 0.14);             // €2M shrinks to a header
  const under = k(g, "w:valuation", 0.4, MOVE, 0.14);              // the ticks become the underline
  const split = k(g, "w:hundred", 0.27, MOVE, 0.15);               // 25 → 100
  const close = k(g, "w:team", 0.27, MOVE, 0.13);                  // the 100 close into one block
  const cardK = k(g, "w:team", 0.47, ARRIVE, 0.0);                 // the block grows into the card
    const push = k(g, "w:all", 1.0, MOVE, 0.0);                      // the photo pushes in
  const whiteOut = k(g, "w:today", 0.53, MOVE, 0.25);              // the card's box grows into the canvas
  const whiteFade = whiteOut >= 1 ? 1 : 0;                           // once the haze covers, the field is gone
  const cardExit = k(g, "w:today", 0.5, DEPART, 0.2);
  // ---------- stretch two ----------
  const robin2In = k(g, "w:advise", 0.6, ARRIVE, 0.4);
  const areaW = (t: string) => measure(t, AREA, 500, -0.045);
  const perArea = (t: string, row: number) => ({ x: TYPE2 + areaW(t) + AREA * 0.14, y: 300 + row * 140 + AREA * 0.76 });
  const areas = [["Strategy", "w:strategy"], ["Leadership", "w:leadership"], ["Growth", "w:growth"], ["Capital", "w:capital"]] as const;
  const areaOut = k(g, "w:if", 0.2, DEPART, 0.0);
  const ctaW = measure("TALK", CTA, 700, -0.08);
  const periodTALK = { x: TYPE2 + ctaW + CTA * 0.14, y: 530 + CTA * 0.74 };
  const btn = { x: 140, y: 790, w: 520, h: 96 };
  const btnK = T.k(g, 28.2, 0.47, ARRIVE);
  const linesK = T.k(g, 28.7, 0.4, ARRIVE);
  const press = Math.sin(cl(T.k(g, 29.2, 0.3, (t) => t)) * Math.PI);

  // the stepping square of B7: where is it?
  const stepPos = (): { x: number; y: number; s: number; blur: number } => {
    const start = { x: 1430, y: 600 };
    const p1 = perArea("Strategy", 0), p2 = perArea("Leadership", 1), p3 = perArea("Growth", 2), p4 = perArea("Capital", 3);
    const drop = cell2(0, 2);
    const segs: [string, { x: number; y: number }, { x: number; y: number }, number, number][] = [
      ["w:strategy", start, p1, 0.47, 0.17], ["w:leadership", p1, p2, 0.33, 0.13], ["w:growth", p2, p3, 0.33, 0.13], ["w:capital", p3, p4, 0.33, 0.13], ["w:building", p4, drop, 0.47, 0.13],
    ];
    let x = start.x, y = start.y, size = 46, blur = 0;
    for (const [at, a, b, dur, early] of segs) {
      const p = k(g, at, dur, MOVE, early);
      if (p <= 0) break;
      x = lerp(a.x, b.x, p); y = lerp(a.y, b.y, p); blur = Math.sin(p * Math.PI) * 5;
      if (at === "w:building") size = lerp(46, S, p);
    }
    return { x, y, s: size, blur };
  };
  const step = stepPos();
  const toPeriod = k(g, "w:talk", 0.5, MOVE, 0.2);               // the wall's top-left square → the period of TALK.
  const morph = btnK;                                                // the period → the button

  return (
    <>
      {/* canvas: the site's haze */}
      <div data-probe="canvas" style={{ position: "absolute", left: -300, top: -300, width: 2520, height: 1680, background: `linear-gradient(160deg, ${C.canvas} 0%, ${C.haze} 70%, ${C.mist} 100%)` }} />
      {/* the light: one soft disc of the backdrop's sky, behind the subject */}
      {!fieldOn && g < F("w:two-0.3") && <Bloom g={g} x={lerp(1100, lerp(700, TILE.x, tileMove), k(g, "w:behind", 0.7, MOVE, 0.3))} y={lerp(650, 520, k(g, "w:behind", 0.7, MOVE, 0.3))} r={430} color={C.sky} k={0.8 + 0.2 * k(g, "w:robin", 0.67, MOVE, 0.0) - robin1Exit * 0.3} drift={28} />}
      {g >= F("w:advise") - 12 && <Bloom g={g} x={ROBIN2.x - 60} y={520} r={430} color={C.sky} k={cl((g - F("w:advise") + 12) / 20) * 0.9} drift={28} />}

      {/* ---------- stretch one: the wall, its squares, the periods ---------- */}
      {wallVisible && (
        <div data-probe="wall" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${exitX}px, ${-lift}px)` }}>
          {/* the first square, there from frame 0 */}
          <Sq name="w-br" x={cell1(1, 2).x} y={cell1(1, 2).y} s={S} />
          {rise1.map(({ c, r, at }) => {
            const p = T.k(g, at / 30, 0.53, ARRIVE);
            const pos = cell1(c, r);
            const leaves = (c === 1 && r === 0) ? "w:bos" : (c === 1 && r === 1) ? "w:process" : (c === 0 && r === 1) ? "w:technology" : null;
            if (leaves && g >= F(`${leaves}-0.13`)) return null;     // it has left the wall: drawn by its travel below
            return <Sq key={`${c}${r}`} name={`w-${c}${r}`} x={pos.x} y={lerp(pos.y + 700, pos.y, p)} s={S} o={p > 0 ? 1 : 0} style={{ filter: p > 0 && p < 0.7 ? `blur(${(1 - p) * 6}px)` : undefined }} />;
          })}
          {/* the course: two squares rise under the wall on "I build" */}
          {[0, 1].map((c) => {
            const p = k(g, "w:build", 0.47, ARRIVE, 0.3 - c * 0.08);
            const pos = cell1(c, 3);
            return p > 0 && <Sq key={`c${c}`} name={`w-${c}3`} x={pos.x} y={lerp(pos.y + 500, pos.y, p)} s={S} style={{ filter: p < 0.7 ? `blur(${(1 - p) * 6}px)` : undefined }} />;
          })}
        </div>
      )}
      {/* the periods: squares that leave the wall (world coordinates, lifted with the wall until they go) */}
      {between(g, "w:bos-0.13", "w:people-0.13") && <Travel g={g} at="w:bos" dur={0.4} from={[cell1(1, 0).x, cell1(1, 0).y - lift, S]} to={[periodBOS.x, periodBOS.y, 46]} ease={MOVE} name="period" />}
      {between(g, "w:people-0.13", "w:founded-0.13") && <Travel g={g} at="w:people" dur={0.4} from={[periodBOS.x, periodBOS.y, 46]} to={[pPeople.x, pPeople.y, 40]} ease={MOVE} name="period" />}
      {between(g, "w:process-0.13", "w:founded-0.13") && <Travel g={g} at="w:process" dur={0.4} from={[cell1(1, 1).x, cell1(1, 1).y - PITCH, S]} to={[pProcess.x, pProcess.y, 40]} ease={MOVE} name="period2" />}
      {between(g, "w:technology-0.13", "w:founded-0.13") && <Travel g={g} at="w:technology" dur={0.4} from={[cell1(0, 1).x, cell1(0, 1).y - PITCH, S]} to={[pTech.x, pTech.y, 40]} ease={MOVE} name="period3" />}
      {/* the three periods gather into one square on "co-founded" */}
      {between(g, "w:founded-0.13", "w:kay-0.13") && [pPeople, pProcess, pTech].map((p, i) => <Travel key={i} g={g} at="w:founded" dur={0.33} from={[p.x, p.y, 40]} to={[gatherPt.x, gatherPt.y, 90]} ease={MOVE} name={`gather${i}`} />)}

      {/* the name and the statement, stretch one */}
      {between(g, "w:robin-0.4", "w:people-0.13") && (
        <div data-probe="name" style={{ position: "absolute", left: 0, top: 0 }}>
          <Line g={g} words={[{ t: "ROBIN", at: "w:robin-0.13" }]} x={TYPE1} y={330} size={NAME} weight={700} ls={-0.08} out="w:build-0.13" outDur={0.27} />
          <Line g={g} words={[{ t: "BOS", at: "w:bos-0.13" }]} x={TYPE1} y={560} size={NAME} weight={700} ls={-0.08} out="w:build-0.1" outDur={0.27} />
        </div>
      )}
      {between(g, "w:people-0.4", "w:kay") && (
        <div data-probe="statement" style={{ position: "absolute", left: 0, top: 0 }}>
          <Line g={g} words={[{ t: "People", at: "w:people-0.13" }]} x={TYPE1} y={300} size={STATE} weight={500} out="w:founded-0.13" outDur={0.27} />
          <Line g={g} words={[{ t: "Process", at: "w:process-0.13" }]} x={TYPE1} y={440} size={STATE} weight={500} out="w:founded-0.1" outDur={0.27} />
          <Line g={g} words={[{ t: "Technology", at: "w:technology-0.13", color: C.blue }]} x={TYPE1} y={580} size={STATE} weight={500} out="w:founded-0.07" outDur={0.27} />
        </div>
      )}

      {/* the rail, the year, the months (below the field) */}
      {between(g, "w:in-0.13", "w:two") && (
        <div data-probe="timeline" style={{ position: "absolute", left: 0, top: 0 }}>
          <Rule x={TILE.x + TILE.s / 2} y={698} w={290} k={railK} color={C.skyDeep} thick={4} />
          {railExt > 0 && <Rule x={TILE.x + TILE.s / 2 + 290} y={698} w={520 + 160} k={(railExt * 520 + railMore * 160) / 680} color={C.skyDeep} thick={4} />}
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(1060px, 560px)`, opacity: Math.min(1, k(g, "w:twenty", 0.3) * 1.5) * (1 - railExt * 0.4), display: "flex", fontFamily: "Manrope", fontWeight: 500, fontSize: 150, color: C.navy, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <OdoDigit v={2 * k(g, "w:twenty", 0.33, MOVE)} size={150} width={0.62} />
            <OdoDigit v={0} size={150} width={0.62} />
            <OdoDigit v={2 * k(g, "w:twenty2", 0.33, MOVE)} size={150} width={0.62} />
            <OdoDigit v={4 * k(g, "w:four", 0.45, MOVE)} size={150} width={0.62} />
          </div>
          {railExt > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(1480px, ${560 + (1 - Math.min(1, railExt * 4)) * 30}px)`, opacity: Math.min(1, railExt * 4), display: "flex", alignItems: "flex-end", fontFamily: "Manrope", fontWeight: 500, fontSize: 150, color: C.ink, letterSpacing: "-0.05em", lineHeight: 1 }}>
              <OdoDigit v={odo(railExt * 18, 2)[0]} size={150} width={0.62} />
              <OdoDigit v={odo(railExt * 18, 2)[1]} size={150} width={0.62} />
              <span style={{ fontSize: 52, color: C.muted, marginLeft: 18, marginBottom: 14, letterSpacing: "-0.02em", opacity: k(g, "w:later", 0.3, ARRIVE, 0.1), display: "inline-block", transform: `translateY(${(1 - k(g, "w:later", 0.3, ARRIVE, 0.1)) * 16}px)` }}>months</span>
            </div>
          )}
        </div>
      )}

      {/* Robin, stretch one: rises in front of the wall on "behind", leaves left on "Consultancy" */}
      {g >= F("w:behind") - 12 && g < F("w:consultancy") + 20 && (() => {
        const p = k(g, "w:behind", 0.63, ARRIVE, 0.33);
        return <Portrait name="robin1" x={ROBIN1.x + exitX} y={ROBIN1.y + (1 - p) * 980} h={ROBIN1.h} blur={p < 0.75 ? (1 - p) * 6 : robin1Exit > 0 ? robin1Exit * 6 : 0} />;
      })()}

      {/* the K.B tile: the gathered square turns navy, rounds and takes the real letters; then grows into the field */}
      {g >= F("w:kay-0.13") && g < F("w:today") + 20 && (() => {
        const w = lerp(tileS, 2520, field), h = lerp(tileS, 1680, field);
        const cx = lerp(tileX, 960, field), cy = lerp(tileY, 540, field);
        const rad = lerp(tileS * TILE.r, 0, field);
        const navy = field > 0 ? C.field : C.kb;
        const logoS = lerp(tileS, 110, field), logoX = lerp(tileX, 120 + 55, field), logoY = lerp(tileY, 80 + 55, field);
        const wipeK = k(g, "w:kay", 0.27, MOVE, 0.0), wipeB = k(g, "w:bee", 0.27, MOVE, 0.0);
        const whiteGone = whiteFade >= 1;
        return (
          <>
            {!whiteGone && <div data-probe="tile" style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: rad, background: navy, transform: `translate(${cx - w / 2}px, ${cy - h / 2}px)`, boxShadow: field < 1 ? "0 30px 60px -20px rgba(14,32,56,.35)" : undefined, willChange: "transform" }} />}
            {/* the real tile's letters: wiped in K then .B; later the mark top-left */}
            {!whiteGone && (
              <div data-probe="kb" style={{ position: "absolute", left: 0, top: 0, width: logoS, height: logoS, borderRadius: logoS * TILE.r, overflow: "hidden", transform: `translate(${logoX - logoS / 2}px, ${logoY - logoS / 2}px)`, willChange: "transform", opacity: tileIn }}>
                <Img src={staticFile("img/kb-consultancy.png")} style={{ width: "100%", height: "100%", display: "block", clipPath: `inset(0 ${(1 - Math.max(wipeK * 0.56, wipeB)) * 100}% 0 0)` }} />
              </div>
            )}
          </>
        );
      })()}

      {/* the 18 month ticks: laid on the rail, then the underline of €2M, then gone */}
      {railExt > 0 && g < F("w:twenty3") && Array.from({ length: 18 }, (_, i) => {
        if (i >= monthsN) return null;
        const onRail = { x: TILE.x + TILE.s / 2 + 310 + i * 27.5, y: 684 };
        const onLine = { x: 528 + i * 48 + 14, y: 760 };
        const x = lerp(onRail.x, onLine.x, under), y = lerp(onRail.y, onLine.y, under);
        const o = 1 - headerK;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 6 + under * 22, height: 28 - under * 20, background: C.accent, opacity: o, transform: `translate(${x - 3 - under * 11}px, ${y - 14 + under * 10}px)`, filter: headerK > 0 ? `blur(${headerK * 6}px)` : undefined, willChange: "transform" }} />;
      })}

      {/* €2M on the field, then the header */}
      {g >= F("w:two+0.05") && g < F("w:today") + 24 && (() => {
        const eK = k(g, "w:two", 0.4, ARRIVE, -0.05), twoK = k(g, "w:two", 0.4, MOVE, -0.1), mK = k(g, "w:million", 0.3, ARRIVE, 0.0);
        const size = lerp(440, 130, headerK);
        const x = lerp(505, 262, headerK), y = lerp(290, 60, headerK);
        const whiteGone = whiteFade >= 1;
        if (whiteGone) return null;
        return (
          <>
            <div data-probe="eur2m" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, display: "flex", fontFamily: "Manrope", fontWeight: 700, fontSize: size, color: C.white, letterSpacing: "-0.05em", lineHeight: 1, willChange: "transform" }}>
              <span style={{ display: "inline-block", transform: `translateX(${(1 - eK) * -220}px)`, opacity: eK, filter: eK < 1 ? `blur(${(1 - eK) * 8}px)` : undefined }}>€</span>
              <OdoDigit v={2 * twoK} size={size} width={0.62} />
              <span style={{ display: "inline-block", transform: `translateY(${(1 - mK) * size * 0.3}px)`, opacity: mK, filter: mK < 1 ? `blur(${(1 - mK) * 8}px)` : undefined }}>M</span>
            </div>
            {under > 0 && headerK < 1 && (
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, opacity: (1 - headerK) * Math.min(1, under * 2), transform: `translate(0, ${800 + (1 - under) * 24}px)`, textAlign: "center", fontFamily: "Manrope", filter: headerK > 0 ? `blur(${headerK * 6}px)` : undefined }}>
                <div style={{ fontSize: 36, fontWeight: 500, color: C.accent, letterSpacing: "-0.02em" }}>K.B Consultancy valuation reached within 18 months.</div>
                <div style={{ fontSize: 30, fontWeight: 400, color: C.sky, opacity: 0.8, marginTop: 10 }}>Company-reported, following its first funding round.</div>
              </div>
            )}
          </>
        );
      })()}

      {/* the projects: 25 squares rise, split into 100, close into the card */}
      {g >= F("w:twenty3-0.14") && g < F("w:team") + 10 && (() => {
        const gridOut = cardK;                                             // the grid becomes the card: hide when the card has grown
        if (gridOut >= 0.4) return null;
        const items: React.ReactNode[] = [];
        let landed = 0;
        for (let r = 4; r >= 0; r--) for (let c = 0; c < 5; c++) {
          const idx = (4 - r) * 5 + c;
          const p = k(g, "w:twenty3", 0.4, ARRIVE, 0.14 - idx * 0.033);
          landed += Math.min(1, p / 0.6);
          if (p <= 0) continue;
          // cell centre: closes toward the block's centre on "team"
          const cx0 = GRID.x + c * gp + GRID.s / 2, cy0 = GRID.y + r * gp + GRID.s / 2;
          const bc = { x: GRID.x + 2 * gp + GRID.s / 2, y: GRID.y + 2 * gp + GRID.s / 2 };
          const cx = lerp(cx0, bc.x + (c - 2) * GRID.s, close), cy = lerp(cy0, bc.y + (r - 2) * GRID.s, close);
          const yRise = (1 - p) * 600;
          const blur = p < 0.7 ? (1 - p) * 6 : 0;
          if (split <= 0) {
            items.push(<Sq key={idx} x={cx} y={cy + yRise} s={GRID.s} style={{ filter: blur ? `blur(${blur}px)` : undefined }} />);
          } else {
            // four quadrants: from touching (32 px at ±16) to split (26 px at ±19), then back to touching on "team"
            const sp = split * (1 - close);
            const q = lerp(32, 26, sp), d = lerp(16, 19, sp);
            for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) items.push(<Sq key={`${idx}${dx}${dy}`} x={cx + dx * d} y={cy + dy * d} s={q} />);
          }
        }
        const count = split > 0 ? lerp(25, 100, split) : landed;
        const labelK = k(g, "w:projects", 0.3, ARRIVE, 0.13);
        const outK = T.k(g, F("w:team") / 30 - 0.2, 0.2, DEPART);
        return (
          <div data-probe="projects" style={{ position: "absolute", left: 0, top: 0 }}>
            {items}
            <div data-probe="counter" style={{ position: "absolute", left: 0, top: 0, transform: `translate(1080px, 440px)`, opacity: 1 - outK, filter: outK > 0 ? `blur(${outK * 8}px)` : undefined, fontFamily: "Manrope", color: C.white }}>
              <div style={{ display: "flex", alignItems: "flex-end", fontWeight: 700, fontSize: 200, letterSpacing: "-0.05em", lineHeight: 1 }}>
                {split > 0 ? <OdoDigit v={odo(count, 3)[0]} size={200} width={0.62} /> : null}
                <OdoDigit v={odo(count, 3)[1]} size={200} width={0.62} />
                <OdoDigit v={odo(count, 3)[2]} size={200} width={0.62} />
                <span style={{ fontSize: 120, marginBottom: 20, marginLeft: 6, opacity: k(g, "w:automations", 0.27, ARRIVE, 0.1), transform: `translateY(${(1 - k(g, "w:automations", 0.27, ARRIVE, 0.1)) * 30}px)`, display: "inline-block" }}>+</span>
              </div>
              <div style={{ height: 64, marginTop: 14, opacity: labelK, transform: `translateY(${(1 - labelK) * 20}px)` }}>
                <Roll g={g} at="w:automations-0.1" h={64} a={<span style={{ fontSize: 52, fontWeight: 500, letterSpacing: "-0.02em" }}>client projects</span>} b={<span style={{ fontSize: 52, fontWeight: 500, letterSpacing: "-0.02em" }}>automations</span>} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* the team card grows out of the block; the white frame; the frame grows into the canvas */}
      {cardK > 0 && g < F("w:today") + 24 && (() => {
        const bc = { x: GRID.x + 2 * gp + GRID.s / 2, y: GRID.y + 2 * gp + GRID.s / 2 };
        const w = lerp(320, CARD.w, cardK), h = lerp(320, CARD.h, cardK);
        const cx = lerp(bc.x, CARD.x, cardK) - cardExit * 1700, cy = lerp(bc.y, CARD.y, cardK);
        const border = 0;
        return (
          <>
            <div data-probe="teamcard" style={{ position: "absolute", left: 0, top: 0, width: w + 2 * border, height: h + 2 * border, background: C.white, borderRadius: 24 + border, transform: `translate(${cx - w / 2 - border}px, ${cy - h / 2 - border}px)`, boxShadow: "0 30px 80px -20px rgba(0,0,0,.45)", overflow: "hidden", willChange: "transform", filter: cardExit > 0 ? `blur(${cardExit * 6}px)` : undefined }}>
              <div style={{ position: "absolute", left: border, top: border, width: w, height: h, borderRadius: 24, overflow: "hidden" }}>
                <Img src={staticFile("img/team-2m.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%", transform: `scale(${1 + push * 0.06})`, transformOrigin: "50% 45%", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: C.accent, opacity: Math.max(0, 1 - cardK * 3) }} />
              </div>
            </div>
          </>
        );
      })()}
      {whiteOut > 0 && whiteFade < 1 && (() => {
        const bc = { x: CARD.x, y: CARD.y };
        const w = lerp(CARD.w + 48, 2520, whiteOut), h = lerp(CARD.h + 48, 1680, whiteOut);
        const cx = lerp(bc.x, 960, whiteOut), cy = lerp(bc.y, 540, whiteOut);
        const left = cx - w / 2, top = cy - h / 2;
        return (
          <div data-probe="canvasback" style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: lerp(48, 0, whiteOut), overflow: "hidden", transform: `translate(${left}px, ${top}px)`, willChange: "transform" }}>
            <div style={{ position: "absolute", left: -300 - left, top: -300 - top, width: 2520, height: 1680, background: `linear-gradient(160deg, ${C.canvas} 0%, ${C.haze} 70%, ${C.mist} 100%)` }} />
          </div>
        );
      })()}

      {/* the four companies, stretch two */}
      {g >= F("w:founders") - 10 && g < F("w:strategy") + 10 && (() => {
        const cells = [
          { src: "wkconversions.svg", c: 0, r: 0, w: 300, h: 140, name: "WKConversions" },
          { src: "topjobsabroad.png", c: 1, r: 0, w: 440, h: 104, name: "Top Jobs Abroad" },
          { src: "clearscaler.svg", c: 0, r: 1, w: 120, h: 120, name: "ClearScaler", label: "ClearScaler" },
          { src: "tale-forge.png", c: 1, r: 1, w: 110, h: 170, name: "Tale Forge" },
        ];
        return (
          <div data-probe="logos" style={{ position: "absolute", left: 0, top: 0 }}>
            {cells.map((l, i) => {
              const pIn = k(g, "w:founders", 0.4, ARRIVE, 0.13 - i * 0.1);
              const pOut = k(g, "w:strategy", 0.4, DEPART, 0.4 - i * 0.1);
              const x0 = 140 + l.c * 480, y0 = 380 + l.r * 220;
              const cx = x0 + 220, cy = y0 + 85;
              const dx = (1 - pIn) * -700, dy = pOut * 700;
              return (
                <div key={l.src} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${dx}px, ${dy}px)`, opacity: Math.min(1, pIn * 1.5), filter: pIn < 0.7 || pOut > 0 ? `blur(${(1 - pIn) * 6 + pOut * 6}px)` : undefined, willChange: "transform" }}>
                  {l.label ? (
                    <>
                      <Logo src={l.src} x={x0 + 70} y={cy} w={l.w} h={l.h} />
                      <Text x={x0 + 150} y={cy - 26} size={44} weight={600} color={C.ink} ls={-0.02}>{l.label}</Text>
                    </>
                  ) : (
                    <Logo src={l.src} x={cx} y={cy} w={l.w} h={l.h} />
                  )}
                  <Rule x={x0} y={y0 + 190} w={440} k={pIn} color={C.line} />
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Robin, stretch two: enters from the right on "advise" and stays */}
      {g >= F("w:advise") - 14 && <Portrait name="robin2" x={ROBIN2.x + (1 - robin2In) * 900} y={ROBIN2.y} h={ROBIN2.h} blur={robin2In < 0.75 ? (1 - robin2In) * 6 : 0} />}

      {/* the four areas: a column the square steps down */}
      {g >= F("w:strategy") - 10 && g < F("w:building") && (
        <div data-probe="areas" style={{ position: "absolute", left: 0, top: 0, opacity: 1 - areaOut, filter: areaOut > 0 ? `blur(${areaOut * 8}px)` : undefined }}>
          {areas.map(([t, at], i) => {
            const dim = i < 3 ? k(g, areas[i + 1][1], 0.27, MOVE, 0.13) : 0;
            const col = i === 3 ? C.blue : C.ink;
            return <Line key={t} g={g} words={[{ t, at: `${at}-0.13`, color: col }]} x={TYPE2} y={300 + i * 140} size={AREA} weight={500} style={{ opacity: 1 - dim * 0.65 }} />;
          })}
        </div>
      )}
      {/* the stepping square: from Robin's shoulder to each period, then down to the first block of the viewer's wall */}
      {g >= F("w:strategy-0.17") && g < F("w:talk-0.14") && <Sq name="step" x={step.x} y={step.y} s={step.s} style={{ filter: step.blur > 1 ? `blur(${step.blur}px)` : undefined }} />}
      {/* the viewer's wall: a second block from below on "something"; four from Robin's shoulder on "structure" */}
      {g >= F("w:something-0.13") && (() => {
        const p = k(g, "w:something", 0.4, ARRIVE, 0.13);
        const c = cell2(1, 2);
        return <Sq name="v-12" x={c.x} y={lerp(c.y + 500, c.y, p)} s={S} style={{ filter: p < 0.7 ? `blur(${(1 - p) * 6}px)` : undefined }} />;
      })()}
      {g >= F("w:talk-0.14") && <Sq name="v-02" x={cell2(0, 2).x} y={cell2(0, 2).y} s={S} />}
      {g >= F("w:structure2-0.4") && ([[1, 1], [0, 1], [1, 0], [0, 0]] as [number, number][]).map(([c, r], i) => {
        const pos = cell2(c, r);
        const p = k(g, "w:structure2", 0.4, MOVE, 0.4 - i * 0.1);
        const from = { x: 1430, y: 640 };
        if (c === 0 && r === 0 && toPeriod > 0) {                       // the top-left square becomes the period of TALK., then the button
          if (morph > 0) return null;
          const x = lerp(pos.x, periodTALK.x, toPeriod), y = lerp(pos.y, periodTALK.y, toPeriod), sz = lerp(S, 46, toPeriod);
          return <Sq key="v-00" name="v-00" x={x} y={y} s={sz} style={{ filter: toPeriod > 0 && toPeriod < 1 ? `blur(${Math.sin(toPeriod * Math.PI) * 4}px)` : undefined }} />;
        }
        return <Sq key={`v-${c}${r}`} name={`v-${c}${r}`} x={lerp(from.x, pos.x, p)} y={lerp(from.y, pos.y, p)} s={S} o={p > 0 ? 1 : 0} style={{ filter: p > 0 && p < 1 ? `blur(${Math.sin(p * Math.PI) * 4}px)` : undefined }} />;
      })}

      {/* LET'S TALK. */}
      {g >= F("w:lets") - 10 && (
        <div data-probe="cta" style={{ position: "absolute", left: 0, top: 0 }}>
          <Line g={g} words={[{ t: "LET'S", at: "w:lets-0.13" }]} x={TYPE2} y={300} size={CTA} weight={700} ls={-0.08} />
          <Line g={g} words={[{ t: "TALK", at: "w:talk-0.14" }]} x={TYPE2} y={530} size={CTA} weight={700} ls={-0.08} />
        </div>
      )}
      {/* the period widens into the site's button, then the contact lines, then the press */}
      {morph > 0 && (() => {
        const w = lerp(46, btn.w, morph), h = lerp(46, btn.h, morph);
        const cx = lerp(periodTALK.x, btn.x + btn.w / 2, morph), cy = lerp(periodTALK.y, btn.y + btn.h / 2, morph);
        const mix = (a: string, b: string, t: number) => { const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], t))).join(",")})`; };
        const sc = 1 - press * 0.03;
        return (
          <div data-probe="button" style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: lerp(0, 999, morph), background: mix(C.accent, C.ink, cl(morph * 1.4)), transform: `translate(${cx - w / 2}px, ${cy - h / 2}px) scale(${sc})`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${h * 0.34}px 0 ${h * 0.4}px`, boxSizing: "border-box", color: C.white, fontFamily: "Manrope", fontWeight: 600, fontSize: 36, letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", boxShadow: `0 12px 40px rgba(14,32,56,${0.18 * morph})`, willChange: "transform" }}>
            <span style={{ opacity: cl((morph - 0.6) * 2.5) }}>Start a conversation</span>
            <svg width={30} height={30} viewBox="0 0 24 24" style={{ opacity: cl((morph - 0.6) * 2.5), transform: `translate(${press * 4}px, ${-press * 4}px)` }}><path d="M5 19 19 5M5 5h14v14" fill="none" stroke={C.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        );
      })()}
      {linesK > 0 && (
        <div data-probe="contact" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${TYPE2}px, ${920 + (1 - linesK) * 24}px)`, opacity: linesK, fontFamily: "Manrope", fontWeight: 500, fontSize: 34, color: C.muted, letterSpacing: "-0.02em", lineHeight: 1.35 }}>
          <div>robin@kruslockbosconsultancy.com</div>
          <div>linkedin.com/in/robindanielbos</div>
        </div>
      )}
      {/* unused-import guard */}
      {false && <Micro x={0} y={0} text="" />}{false && s}
    </>
  );
};
