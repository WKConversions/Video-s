// The stage of the Robin Bos film: one continuous world, every object keyed on the voice's words (src/clock.ts).
// Plan: ../storyboard/plan.md; revision log in ../storyboard/plan.md (art-director pass, round 1).
// Layer order (bottom → top): canvas, light, squares, year/months, Robin (stretch one), the navy field, the month
// ticks, the K.B mark, €2M, the project grid, the returning canvas, the team card, the light (two), the logos,
// Robin (stretch two), the four areas, LET'S TALK., the button, the contact lines.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { ARRIVE, DEPART, MOVE, Line, Bloom, Roll, measure, lerp } from "./kinetic";
import { C, SHADOW } from "./lib";
import { Portrait, Sq, Logo, Text, Rule, OdoDigit, odo } from "./parts";

const cl = (t: number) => Math.min(1, Math.max(0, t));
const F = (pos: string) => T.f(pos);

// ---- geometry ----
const S = 110, GAP = 8, PITCH = S + GAP;                        // the wall's squares
const WALL1 = { x: 880, y: 476 };                                // stretch one: top-left of cell (0,0)
const cell1 = (c: number, r: number) => ({ x: WALL1.x + c * PITCH + S / 2, y: WALL1.y + r * PITCH + S / 2 });
const WALL2 = { x: 980, y: 610 };                                // the viewer's wall, stretch two
const cell2 = (c: number, r: number) => ({ x: WALL2.x + c * PITCH + S / 2, y: WALL2.y + r * PITCH + S / 2 });
const ROBIN1 = { x: 700, y: 1120, h: 940 };                      // bottom-centre anchor, 40 px below the frame
const ROBIN2 = { x: 1590, y: 1140, h: 1030 };
const TYPE1 = 1250;                                              // type column, stretch one
const TYPE2 = 140;                                               // type column, stretch two
const NAME = 160, STATE = 96, AREA = 88, CTA = 190;
const PER = { display: 34, state: 24 };                          // the period squares (the site's proportion, ≈0.18 of the cap)
const TILE = { x: 780, y: 520, s: 460, r: 0.22 };                // the K.B tile in Robin's place
const TILE2 = { x: 560, y: 520, s: 300 };                        // the tile once the year is the subject
const YEAR = { x: 760, y: 500, size: 200 };                      // 2024
const MONTHS = { x: 1250, y: 500, size: 200 };                   // 18
const RAIL = { y: 780 };                                         // the hairline rail; ticks 740–768 on it
const GRID = { x: 540, y: 400, s: 64, gap: 18 };                 // 5×5 of projects
const gp = GRID.s + GRID.gap;
const CARD = { x: 1060, y: 540, w: 1000, h: 700 };               // the team photo card
const CELLS = { x: 300, y: 370, w: 460, h: 220, gapx: 20, gapy: 20 }; // the 2×2 of companies, then of areas, near Robin

// progress helpers: a move keyed on a word, starting `early` seconds before it
const lbl = (at: string, early: number) => (early >= 0 ? `${at}-${early}` : `${at}+${-early}`);
const k = (g: number, at: string, dur: number, ease = ARRIVE, early = 0.13) => T.k(g, lbl(at, early), dur, ease);
const between = (g: number, a: string, b: string) => g >= F(a) && g < F(b);
const mixc = (a: string, b: string, t: number) => { const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], cl(t)))).join(",")})`; };
// where a period square sits after a word: 0.2 em clear of the last glyph, its bottom on the baseline
const periodAt = (x: number, y: number, text: string, size: number, weight: number, ls: number, sq: number) => ({ x: x + measure(text, size, weight, ls) + size * 0.2 + sq / 2, y: y + size * 0.8 - sq / 2 });

// a square that travels: from (x0,y0,s0) to (x1,y1,s1) on key `at` over dur, with blur on the fast frames
const Travel: React.FC<{ g: number; at: string; dur: number; from: [number, number, number]; to: [number, number, number]; ease?: (t: number) => number; early?: number; o?: number; name?: string }> = ({ g, at, dur, from, to, ease = MOVE, early = 0.13, o = 1, name }) => {
  const p = k(g, at, dur, ease, early);
  const sp = Math.sin(p * Math.PI);
  return <Sq name={name} x={lerp(from[0], to[0], p)} y={lerp(from[1], to[1], p)} s={lerp(from[2], to[2], p)} o={o} style={{ filter: sp > 0.3 ? `blur(${sp * 4}px)` : undefined }} />;
};

export const Story: React.FC<{ g: number }> = ({ g }) => {
  // ---------- stretch one: the wall ----------
  // the first three squares stack before Robin; the last three behind his shoulder once he is in
  const rise1: { c: number; r: number; at: number }[] = [
    { c: 0, r: 2, at: 1 }, { c: 1, r: 1, at: 12 }, { c: 0, r: 1, at: 23 }, { c: 1, r: 0, at: 40 }, { c: 0, r: 0, at: 52 },
  ];
  const settle = T.k(g, 52 / 30 + 0.5, 0.2, MOVE);                 // the whole stack settles 6 px as the top course lands
  const course = k(g, "w:build", 0.47, MOVE, 0.3);                 // the wall grows a course on "I build": everything up 118
  const lift = course * PITCH;
  const robin1In = k(g, "w:strong", 0.63, ARRIVE, 0.75);           // Robin rises on "strong" (lands ≈1.5 s)
  const robin1Exit = k(g, "w:consultancy", 0.55, DEPART, 0.15);    // Robin and the wall remainder leave left
  const exitX = -robin1Exit * 1300;
  const wallVisible = g < F("w:consultancy") + 20;

  // the periods: (1,0) → BOS.; the BOS period → People.; (1,1) → Process.; (0,1) → Technology.
  const periodBOS = periodAt(TYPE1, 560, "BOS", NAME, 700, -0.08, PER.display);
  const stRow = (i: number) => 300 + i * 140;
  const pPeople = periodAt(TYPE1, stRow(0), "People", STATE, 500, -0.045, PER.state);
  const pProcess = periodAt(TYPE1, stRow(1), "Process", STATE, 500, -0.045, PER.state);
  const pTech = periodAt(TYPE1, stRow(2), "Technology", STATE, 500, -0.045, PER.state);
  const gatherPt = { x: 1480, y: 470 };                           // where the three periods gather into one square
  const stateOut = k(g, "w:founded", 0.3, DEPART, 0.13);           // the statement words leave rightward with their periods

  // ---------- B4–B5: the tile, the year, the months ----------
  const tileIn = k(g, "w:kay", 0.28, ARRIVE);                     // the gathered square becomes the tile
  const tileMove = k(g, "w:consultancy", 0.5, MOVE, 0.15);         // into Robin's place
  const tileSmall = k(g, "w:in", 0.5, MOVE, 0.3);                  // then it steps aside and shrinks as the year is spoken
  const tileX = lerp(lerp(gatherPt.x, TILE.x, tileMove), TILE2.x, tileSmall), tileY = lerp(lerp(gatherPt.y, TILE.y, tileMove), TILE2.y, tileSmall);
  const tileS = lerp(lerp(90, TILE.s, tileIn), TILE2.s, tileSmall);
  const railK = k(g, "w:eighteen", 0.8, MOVE, 0.3);                // the rail draws out of the tile and lays the months
  const railMore = k(g, "w:later", 0.8, MOVE, 0.0);                // then it keeps going toward the edge (B11 progress)
  const monthsN = Math.floor(railK * 18 + 1e-6);
  const field = k(g, "w:two", 0.67, MOVE, 0.45);                   // the tile grows into the navy field
  const fieldOn = g >= F("w:two-0.45") && g < F("w:today") + 20;
  // ---------- B6: the number, the grid, the card ----------
  const headerK = k(g, "w:twenty3", 0.47, MOVE, 0.14);             // €2M shrinks to a header
  const under = k(g, "w:valuation", 0.4, MOVE, 0.14);              // the ticks become the underline
  const split = k(g, "w:hundred", 0.27, MOVE, 0.15);               // 25 → 100
  const close = k(g, "w:team", 0.27, MOVE, 0.13);                  // the 100 close into one block
  const cardK = k(g, "w:team", 0.47, ARRIVE, 0.0);                 // the block grows into the card
  const push = k(g, "w:all", 1.0, MOVE, 0.0);                      // the photo pushes in
  const whiteOut = k(g, "w:today", 0.53, MOVE, 0.25);              // the card's box grows into the canvas
  const whiteGone = whiteOut >= 1;                                 // once the haze covers, the field layers unmount
  const cardExit = k(g, "w:today", 0.5, DEPART, 0.2);
  // ---------- stretch two ----------
  const robin2In = k(g, "w:advise", 0.6, ARRIVE, 0.4);
  const cellAt = (c: number, r: number) => ({ x: CELLS.x + c * (CELLS.w + CELLS.gapx), y: CELLS.y + r * (CELLS.h + CELLS.gapy) });
  const areas = [["Strategy", "w:strategy", 0, 0], ["Leadership", "w:leadership", 1, 0], ["Growth", "w:growth", 0, 1], ["Capital", "w:capital", 1, 1]] as const;
  const areaPeriod = (i: number) => { const c = cellAt(areas[i][2], areas[i][3]); return periodAt(c.x + 24, c.y + 60, areas[i][0], AREA, 500, -0.045, PER.state); };
  const areaOut = k(g, "w:if", 0.3, DEPART, 0.0);                  // the areas sink with the square as it drops
  const ctaPeriod = periodAt(TYPE2, 500, "TALK", CTA, 700, -0.08, PER.display);
  const btn = { x: 140, y: 740, w: 640, h: 112 };
  const btnK = T.k(g, 28.2, 0.47, ARRIVE);
  const linesK = T.k(g, 28.7, 0.4, ARRIVE);
  const press = Math.sin(cl(T.k(g, 29.2, 0.3, (t) => t)) * Math.PI);

  // the stepping square of B7: from Robin's shoulder to each area's period, then down to the viewer's first block
  const stepPos = (): { x: number; y: number; s: number; blur: number } => {
    const start = { x: 1430, y: 600 };
    const p = [areaPeriod(0), areaPeriod(1), areaPeriod(2), areaPeriod(3)];
    const drop = cell2(0, 2);
    const segs: [string, { x: number; y: number }, { x: number; y: number }, number, number][] = [
      ["w:strategy", start, p[0], 0.47, 0.17], ["w:leadership", p[0], p[1], 0.33, 0.13], ["w:growth", p[1], p[2], 0.33, 0.13], ["w:capital", p[2], p[3], 0.33, 0.13], ["w:building", p[3], drop, 0.47, 0.13],
    ];
    let x = start.x, y = start.y, size = PER.state, blur = 0;
    for (const [at, a, b, dur, early] of segs) {
      const pp = k(g, at, dur, MOVE, early);
      if (pp <= 0) break;
      x = lerp(a.x, b.x, pp); y = lerp(a.y, b.y, pp); blur = Math.sin(pp * Math.PI) * 5;
      if (at === "w:building") size = lerp(PER.state, S, pp);
    }
    return { x, y, s: size, blur };
  };
  const step = stepPos();
  const toPeriod = k(g, "w:talk", 0.5, MOVE, 0.2);                 // the wall's top-left square → the period of TALK.
  const morph = btnK;                                                // the period → the button

  return (
    <>
      {/* canvas: the site's haze, white where the page is white */}
      <div data-probe="canvas" style={{ position: "absolute", left: -300, top: -300, width: 2520, height: 1680, background: `linear-gradient(165deg, ${C.canvas} 0%, ${C.canvas} 40%, ${C.haze} 80%, ${C.mist} 100%)` }} />
      {/* the light: the portrait backdrop's sky as one soft disc, behind Robin only */}
      {!fieldOn && g < F("w:consultancy") + 10 && <Bloom g={g} x={ROBIN1.x + 60 + exitX} y={520} r={430} color={C.sky} k={(0.55 + 0.45 * robin1In) * (1 - robin1Exit)} drift={28} />}

      {/* ---------- stretch one: the wall, its squares, the periods ---------- */}
      {wallVisible && (
        <div data-probe="wall" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${exitX}px, ${-lift + settle * 6}px)` }}>
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
      {between(g, "w:bos-0.13", "w:people-0.13") && <Travel g={g} at="w:bos" dur={0.45} from={[cell1(1, 0).x, cell1(1, 0).y - lift, S]} to={[periodBOS.x, periodBOS.y, PER.display]} name="period" />}
      {between(g, "w:people-0.13", "w:founded-0.13") && <Travel g={g} at="w:people" dur={0.4} from={[periodBOS.x, periodBOS.y, PER.display]} to={[pPeople.x, pPeople.y, PER.state]} name="period" />}
      {between(g, "w:process-0.13", "w:founded-0.13") && <Travel g={g} at="w:process" dur={0.45} from={[cell1(1, 1).x, cell1(1, 1).y - PITCH, S]} to={[pProcess.x, pProcess.y, PER.state]} name="period2" />}
      {between(g, "w:technology-0.13", "w:founded-0.13") && <Travel g={g} at="w:technology" dur={0.45} from={[cell1(0, 1).x, cell1(0, 1).y - PITCH, S]} to={[pTech.x, pTech.y, PER.state]} name="period3" />}
      {/* the three periods gather into one square on "co-founded", after the words have gone */}
      {between(g, "w:founded-0.13", "w:kay-0.13") && [pPeople, pProcess, pTech].map((p, i) => <Travel key={i} g={g} at="w:founded" dur={0.33} from={[p.x + 120, p.y, PER.state]} to={[gatherPt.x, gatherPt.y, 90]} early={-0.12} name={`gather${i}`} />)}

      {/* the name and the statement, stretch one */}
      {between(g, "w:robin-0.4", "w:people-0.13") && (
        <div data-probe="name" style={{ position: "absolute", left: 0, top: 0 }}>
          <Line g={g} words={[{ t: "ROBIN", at: "w:robin-0.13" }]} x={TYPE1} y={330} size={NAME} weight={700} ls={-0.08} out="w:build-0.13" outDur={0.27} />
          <Line g={g} words={[{ t: "BOS", at: "w:bos-0.13" }]} x={TYPE1} y={560} size={NAME} weight={700} ls={-0.08} out="w:build-0.1" outDur={0.27} />
        </div>
      )}
      {between(g, "w:people-0.4", "w:kay") && (
        <div data-probe="statement" style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${stateOut * 120}px)`, opacity: 1 - stateOut, filter: stateOut > 0 ? `blur(${stateOut * 8}px)` : undefined }}>
          <Line g={g} words={[{ t: "People", at: "w:people-0.13" }]} x={TYPE1} y={stRow(0)} size={STATE} weight={500} />
          <Line g={g} words={[{ t: "Process", at: "w:process-0.13" }]} x={TYPE1} y={stRow(1)} size={STATE} weight={500} />
          <Line g={g} words={[{ t: "Technology", at: "w:technology-0.13", color: C.blue }]} x={TYPE1} y={stRow(2)} size={STATE} weight={500} />
        </div>
      )}

      {/* the year and the months (below the field) */}
      {between(g, "w:in-0.3", "w:two") && (
        <div data-probe="timeline" style={{ position: "absolute", left: 0, top: 0 }}>
          {railK > 0 && <Rule x={TILE2.x + TILE2.s / 2} y={RAIL.y - 2} w={1130} k={(railK * 880 + railMore * 250) / 1130} color={C.skyDeep} thick={4} />}
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${YEAR.x}px, ${YEAR.y}px)`, opacity: Math.min(1, k(g, "w:twenty", 0.3) * 1.5) * (1 - railK * 0.45), display: "flex", fontFamily: "Manrope", fontWeight: 500, fontSize: YEAR.size, color: C.navy, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <OdoDigit v={2 * k(g, "w:twenty", 0.33, MOVE)} size={YEAR.size} width={0.6} />
            <OdoDigit v={0} size={YEAR.size} width={0.6} />
            <OdoDigit v={2 * k(g, "w:twenty2", 0.33, MOVE)} size={YEAR.size} width={0.6} />
            <OdoDigit v={4 * k(g, "w:four", 0.45, MOVE)} size={YEAR.size} width={0.6} />
          </div>
          {railK > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${MONTHS.x}px, ${MONTHS.y + (1 - Math.min(1, railK * 4)) * 30}px)`, opacity: Math.min(1, railK * 4), display: "flex", alignItems: "flex-end", fontFamily: "Manrope", fontWeight: 500, fontSize: MONTHS.size, color: C.ink, letterSpacing: "-0.05em", lineHeight: 1 }}>
              <OdoDigit v={odo(railK * 18, 2)[0]} size={MONTHS.size} width={0.6} />
              <OdoDigit v={odo(railK * 18, 2)[1]} size={MONTHS.size} width={0.6} />
              <span style={{ fontSize: 64, color: C.ink, opacity: 0.8 * k(g, "w:later", 0.3, ARRIVE, 0.1), marginLeft: 22, marginBottom: 10, letterSpacing: "-0.02em", display: "inline-block", transform: `translateY(${(1 - k(g, "w:later", 0.3, ARRIVE, 0.1)) * 16}px)` }}>months</span>
            </div>
          )}
        </div>
      )}

      {/* Robin, stretch one: rises in front of the wall on "strong", leaves left on "Consultancy" */}
      {g >= F("w:strong") - 24 && g < F("w:consultancy") + 20 && (
        <Portrait name="robin1" x={ROBIN1.x + exitX} y={ROBIN1.y + (1 - robin1In) * 980} h={ROBIN1.h} blur={robin1In < 0.75 ? (1 - robin1In) * 6 : robin1Exit > 0 ? robin1Exit * 6 : 0} />
      )}

      {/* the K.B tile: the gathered square turns navy, rounds and takes the real letters; then grows into the field */}
      {g >= F("w:kay-0.13") && !whiteGone && (() => {
        const w = lerp(tileS, 2520, field), h = lerp(tileS, 1680, field);
        const cx = lerp(tileX, 960, field), cy = lerp(tileY, 540, field);
        const rad = lerp(tileS * TILE.r, 0, field);
        const navy = mixc(C.kb, C.field, field * 1.6);
        const logoS = lerp(tileS, 110, field), logoX = lerp(tileX, 120 + 55, field), logoY = lerp(tileY, 100 + 55, field);
        const wipeK = k(g, "w:kay", 0.27, MOVE, 0.0), wipeB = k(g, "w:bee", 0.27, MOVE, 0.0);
        return (
          <>
            <div data-probe="tile" style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: rad, background: navy, transform: `translate(${cx - w / 2}px, ${cy - h / 2}px)`, boxShadow: field < 1 ? SHADOW.card : undefined, willChange: "transform" }} />
            <div data-probe="kb" style={{ position: "absolute", left: 0, top: 0, width: logoS, height: logoS, borderRadius: logoS * TILE.r, overflow: "hidden", transform: `translate(${logoX - logoS / 2}px, ${logoY - logoS / 2}px)`, willChange: "transform", opacity: tileIn }}>
              <Img src={staticFile("img/kb-consultancy.png")} style={{ width: "100%", height: "100%", display: "block", clipPath: `inset(0 ${(1 - Math.max(wipeK * 0.56, wipeB)) * 100}% 0 0)` }} />
            </div>
          </>
        );
      })()}

      {/* the 18 month ticks: laid on the rail, then the underline of €2M, then gone */}
      {railK > 0 && g < F("w:twenty3") && Array.from({ length: 18 }, (_, i) => {
        if (i >= monthsN) return null;
        const onRail = { x: TILE2.x + TILE2.s / 2 + 420 + i * 27, y: RAIL.y - 16 };
        const onLine = { x: 528 + i * 48 + 14, y: 760 };
        const x = lerp(onRail.x, onLine.x, under), y = lerp(onRail.y, onLine.y, under);
        const born = cl((railK * 18 - i) * 3);                       // each tick rises onto the rail over 3 frames
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 6 + under * 22, height: (28 - under * 20) * born, background: C.accent, opacity: 1 - headerK, transform: `translate(${x - 3 - under * 11}px, ${y - 14 + under * 10 + (28 - under * 20) * (1 - born)}px)`, filter: headerK > 0 ? `blur(${headerK * 6}px)` : undefined, willChange: "transform" }} />;
      })}

      {/* €2M on the field, then the header */}
      {g >= F("w:two+0.05") && !whiteGone && (() => {
        const eK = k(g, "w:two", 0.4, ARRIVE, -0.05), twoK = k(g, "w:two", 0.42, ARRIVE, -0.12), mK = k(g, "w:million", 0.42, ARRIVE, 0.05);
        const size = lerp(440, 130, headerK);
        const x = lerp(505, 262, headerK), y = lerp(290, 80, headerK);
        return (
          <>
            <div data-probe="eur2m" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, display: "flex", fontFamily: "Manrope", fontWeight: 700, fontSize: size, color: C.white, letterSpacing: "-0.05em", lineHeight: 1, willChange: "transform" }}>
              <span style={{ display: "inline-block", transform: `translateX(${(1 - eK) * -220}px)`, opacity: eK, filter: eK < 1 ? `blur(${(1 - eK) * 8}px)` : undefined }}>€</span>
              <span style={{ display: "inline-block", transform: `translateY(${(1 - twoK) * size * 0.32}px)`, opacity: Math.min(1, twoK * 1.7), filter: twoK < 1 ? `blur(${(1 - twoK) * 9}px)` : undefined }}>2</span>
              <span style={{ display: "inline-block", transform: `translateY(${(1 - mK) * size * 0.32}px)`, opacity: Math.min(1, mK * 1.7), filter: mK < 1 ? `blur(${(1 - mK) * 9}px)` : undefined }}>M</span>
            </div>
            {under > 0 && headerK < 1 && (
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, opacity: (1 - headerK) * Math.min(1, under * 2), transform: `translate(0, ${806 + (1 - under) * 24}px)`, textAlign: "center", fontFamily: "Manrope", filter: headerK > 0 ? `blur(${headerK * 6}px)` : undefined }}>
                <div style={{ fontSize: 44, fontWeight: 500, color: C.sky, letterSpacing: "-0.02em" }}>Company-reported, following its first funding round.</div>
              </div>
            )}
          </>
        );
      })()}

      {/* the projects: 25 squares rise, split into 100, close into the card */}
      {g >= F("w:twenty3-0.14") && g < F("w:team") + 10 && (() => {
        if (cardK >= 0.4) return null;
        const items: React.ReactNode[] = [];
        let landed = 0;
        for (let r = 4; r >= 0; r--) for (let c = 0; c < 5; c++) {
          const idx = (4 - r) * 5 + c;
          const p = k(g, "w:twenty3", 0.4, ARRIVE, 0.14 - idx * 0.033);
          landed += Math.min(1, p / 0.9);
          if (p <= 0) continue;
          const cx0 = GRID.x + c * gp + GRID.s / 2, cy0 = GRID.y + r * gp + GRID.s / 2;
          const bc = { x: GRID.x + 2 * gp + GRID.s / 2, y: GRID.y + 2 * gp + GRID.s / 2 };
          const cx = lerp(cx0, bc.x + (c - 2) * GRID.s, close), cy = lerp(cy0, bc.y + (r - 2) * GRID.s, close);
          const yRise = (1 - p) * 600;
          const blur = p < 0.7 ? (1 - p) * 6 : 0;
          if (split <= 0) {
            items.push(<Sq key={idx} x={cx} y={cy + yRise} s={GRID.s} style={{ filter: blur ? `blur(${blur}px)` : undefined }} />);
          } else {
            const sp = split * (1 - close);
            const q = lerp(32, 26, sp), d = lerp(16, 19, sp);
            for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) items.push(<Sq key={`${idx}${dx}${dy}`} x={cx + dx * d} y={cy + dy * d} s={q} />);
          }
        }
        const count = split > 0 ? lerp(25, 100, split) : landed;
        const labelK = k(g, "w:projects", 0.3, ARRIVE, 0.13);
        const plusK = k(g, "w:automations", 0.27, ARRIVE, 0.1);
        const outK = T.k(g, F("w:team") / 30 - 0.2, 0.2, DEPART);
        return (
          <div data-probe="projects" style={{ position: "absolute", left: 0, top: 0 }}>
            {items}
            <div data-probe="counter" style={{ position: "absolute", left: 0, top: 0, transform: `translate(1080px, 440px)`, opacity: 1 - outK, filter: outK > 0 ? `blur(${outK * 8}px)` : undefined, fontFamily: "Manrope", color: C.white }}>
              <div style={{ display: "flex", alignItems: "flex-end", fontWeight: 700, fontSize: 200, letterSpacing: "-0.05em", lineHeight: 1 }}>
                {split > 0 ? <OdoDigit v={odo(count, 3)[0]} size={200} width={0.62} /> : null}
                <OdoDigit v={odo(count, 3)[1]} size={200} width={0.62} />
                <OdoDigit v={odo(count, 3)[2]} size={200} width={0.62} />
                <span style={{ fontSize: 120, marginBottom: 20, marginLeft: 6, opacity: plusK, transform: `translateY(${(1 - plusK) * 30}px)`, display: "inline-block" }}>+</span>
              </div>
              <div style={{ height: 64, marginTop: 14, opacity: labelK, transform: `translateY(${(1 - labelK) * 20}px)` }}>
                {/* the label rolls with the counter, on the same word: "100" never sits over "client projects" */}
                <Roll g={g} at="w:hundred-0.15" dur={0.27} h={64} a={<span style={{ fontSize: 52, fontWeight: 500, letterSpacing: "-0.02em" }}>client projects</span>} b={<span style={{ fontSize: 52, fontWeight: 500, letterSpacing: "-0.02em" }}>automations</span>} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* the returning canvas grows out of the card's box (behind the card), and stays: it is the canvas */}
      {whiteOut > 0 && (() => {
        const w = lerp(CARD.w, 2520, whiteOut), h = lerp(CARD.h, 1680, whiteOut);
        const cx = lerp(CARD.x, 960, whiteOut), cy = lerp(CARD.y, 540, whiteOut);
        const left = cx - w / 2, top = cy - h / 2;
        return (
          <div data-probe="canvasback" style={{ position: "absolute", zIndex: 1, left: 0, top: 0, width: w, height: h, borderRadius: lerp(24, 0, whiteOut), overflow: "hidden", transform: `translate(${left}px, ${top}px)`, willChange: "transform" }}>
            <div style={{ position: "absolute", left: -300 - left, top: -300 - top, width: 2520, height: 1680, background: `linear-gradient(165deg, ${C.canvas} 0%, ${C.canvas} 40%, ${C.haze} 80%, ${C.mist} 100%)` }} />
          </div>
        );
      })()}
      {/* the team card grows out of the block; the photo pushes in on "all"; it leaves left on "today" */}
      {cardK > 0 && g < F("w:today") + 24 && (() => {
        const bc = { x: GRID.x + 2 * gp + GRID.s / 2, y: GRID.y + 2 * gp + GRID.s / 2 };
        const w = lerp(320, CARD.w, cardK), h = lerp(320, CARD.h, cardK);
        const cx = lerp(bc.x, CARD.x, cardK) - cardExit * 1700, cy = lerp(bc.y, CARD.y, cardK);
        return (
          <div data-probe="teamcard" style={{ position: "absolute", zIndex: 2, left: 0, top: 0, width: w, height: h, background: C.white, borderRadius: 24, transform: `translate(${cx - w / 2}px, ${cy - h / 2}px)`, boxShadow: "0 8px 35px rgba(0,0,0,.20), 0 0 0 1px rgba(0,0,0,.03)", overflow: "hidden", willChange: "transform", filter: cardExit > 0 ? `blur(${cardExit * 6}px)` : undefined }}>
            <Img src={staticFile("img/team-2m.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%", transform: `scale(${1 + push * 0.06})`, transformOrigin: "50% 45%", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: C.accent, opacity: Math.max(0, 1 - cardK * 3) }} />
          </div>
        );
      })()}

      {/* the light, stretch two */}
      {g >= F("w:advise") - 12 && <Bloom g={g} x={ROBIN2.x - 60} y={520} r={430} color={C.sky} k={cl((g - F("w:advise") + 12) / 20) * 0.9} drift={28} style={{ zIndex: 2 }} />}

      {/* the four companies, stretch two: a loose 2×2 gathered at Robin's shoulder, no table */}
      {g >= F("w:founders") - 10 && g < F("w:strategy") + 10 && (() => {
        const cells = [
          { src: "wkconversions.svg", c: 0, r: 0, w: 330, h: 150, name: "WKConversions" },
          { src: "topjobsabroad.png", c: 1, r: 0, w: 440, h: 104, name: "Top Jobs Abroad" },
          { src: "clearscaler.svg", c: 0, r: 1, w: 120, h: 120, name: "ClearScaler", label: "ClearScaler" },
          { src: "tale-forge.png", c: 1, r: 1, w: 130, h: 206, name: "Tale Forge" },
        ];
        return (
          <div data-probe="logos" style={{ position: "absolute", zIndex: 3, left: 0, top: 0 }}>
            {cells.map((l, i) => {
              const pIn = k(g, "w:founders", 0.4, ARRIVE, 0.13 - i * 0.1);
              const pOut = k(g, "w:strategy", 0.4, DEPART, 0.5 - i * 0.08);
              const cell = cellAt(l.c, l.r);
              const cx = cell.x + CELLS.w / 2, cy = cell.y + CELLS.h / 2;
              const dx = (1 - pIn) * -700, dy = pOut * 700;
              return (
                <div key={l.src} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${dx}px, ${dy}px)`, opacity: Math.min(1, pIn * 1.5), filter: pIn < 0.7 || pOut > 0 ? `blur(${(1 - pIn) * 6 + pOut * 6}px)` : undefined, willChange: "transform" }}>
                  {l.label ? (
                    <>
                      <Logo src={l.src} x={cell.x + 90} y={cy} w={l.w} h={l.h} />
                      <Text x={cell.x + 170} y={cy - 30} size={56} weight={600} color={C.ink} ls={-0.02}>{l.label}</Text>
                    </>
                  ) : (
                    <Logo src={l.src} x={cx} y={cy} w={l.w} h={l.h} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Robin, stretch two: enters from the right on "advise" and stays */}
      {g >= F("w:advise") - 14 && <Portrait style={{ zIndex: 3 }} name="robin2" x={ROBIN2.x + (1 - robin2In) * 900} y={ROBIN2.y} h={ROBIN2.h} blur={robin2In < 0.75 ? (1 - robin2In) * 6 : 0} />}

      {/* the four areas take the cells the logos leave; the square steps through them as each word's period */}
      {g >= F("w:strategy") - 10 && g < F("w:building") && (
        <div data-probe="areas" style={{ position: "absolute", zIndex: 3, left: 0, top: 0, opacity: 1 - areaOut, transform: `translateY(${areaOut * 60}px)`, filter: areaOut > 0 ? `blur(${areaOut * 8}px)` : undefined }}>
          {areas.map(([t, at, c, r], i) => {
            const dim = i < 3 ? k(g, areas[i + 1][1], 0.27, MOVE, 0.13) : 0;
            const cell = cellAt(c, r);
            return <Line key={t} g={g} words={[{ t, at: `${at}-0.13`, color: i === 3 ? C.blue : C.ink }]} x={cell.x + 24} y={cell.y + 60} size={AREA} weight={500} style={{ opacity: 1 - dim * 0.45 }} />;
          })}
        </div>
      )}
      {g >= F("w:strategy-0.17") && g < F("w:talk-0.2") && <Sq name="step" x={step.x} y={step.y} s={step.s} style={{ zIndex: 3, filter: step.blur > 1 ? `blur(${step.blur}px)` : undefined }} />}
      {/* the viewer's wall: the dropped square is the first block; a second lands ON it (a thin tower that needs structure);
          Robin's four squares brace it into the 2×3 wall on "structure" */}
      {g >= F("w:something-0.13") && (() => {
        const p = k(g, "w:something", 0.4, ARRIVE, 0.13);
        const c = cell2(0, 1);
        return <Sq name="v-01" x={c.x} y={lerp(c.y - 500, c.y, p)} s={S} style={{ zIndex: 3, filter: p < 0.7 ? `blur(${(1 - p) * 6}px)` : undefined }} />;
      })()}
      {g >= F("w:talk-0.2") && <Sq name="v-02" x={cell2(0, 2).x} y={cell2(0, 2).y} s={S} style={{ zIndex: 3 }} />}
      {g >= F("w:structure2-0.4") && ([[1, 2], [1, 1], [1, 0], [0, 0]] as [number, number][]).map(([c, r], i) => {
        const pos = cell2(c, r);
        const p = k(g, "w:structure2", 0.4, MOVE, 0.4 - i * 0.1);
        const from = { x: 1430, y: 640 };
        if (c === 0 && r === 0 && toPeriod > 0) {
          if (morph > 0) return null;
          const x = lerp(pos.x, ctaPeriod.x, toPeriod), y = lerp(pos.y, ctaPeriod.y, toPeriod), sz = lerp(S, PER.display, toPeriod);
          return <Sq key="v-00" name="v-00" x={x} y={y} s={sz} style={{ zIndex: 3, filter: toPeriod > 0 && toPeriod < 1 ? `blur(${Math.sin(toPeriod * Math.PI) * 4}px)` : undefined }} />;
        }
        return <Sq key={`v-${c}${r}`} name={`v-${c}${r}`} x={lerp(from.x, pos.x, p)} y={lerp(from.y, pos.y, p)} s={S} o={p > 0 ? 1 : 0} style={{ zIndex: 2, filter: p > 0 && p < 1 ? `blur(${Math.sin(p * Math.PI) * 4}px)` : undefined }} />;
      })}

      {/* LET'S TALK. */}
      {g >= F("w:lets") - 10 && (
        <div data-probe="cta" style={{ position: "absolute", zIndex: 3, left: 0, top: 0 }}>
          <Line g={g} words={[{ t: "LET'S", at: "w:lets-0.13" }]} x={TYPE2} y={280} size={CTA} weight={700} ls={-0.08} />
          <Line g={g} words={[{ t: "TALK", at: "w:talk-0.14" }]} x={TYPE2} y={500} size={CTA} weight={700} ls={-0.08} />
        </div>
      )}
      {/* the period widens into the site's button, then the contact lines, then the press */}
      {morph > 0 && (() => {
        const w = lerp(PER.display, btn.w, morph), h = lerp(PER.display, btn.h, morph);
        const cx = lerp(ctaPeriod.x, btn.x + btn.w / 2, morph), cy = lerp(ctaPeriod.y, btn.y + btn.h / 2, morph);
        const sc = 1 - press * 0.03;
        return (
          <div data-probe="button" style={{ position: "absolute", zIndex: 3, left: 0, top: 0, width: w, height: h, borderRadius: lerp(0, 999, morph), background: mixc(C.accent, C.ink, morph * 1.4), transform: `translate(${cx - w / 2}px, ${cy - h / 2}px) scale(${sc})`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${h * 0.34}px 0 ${h * 0.4}px`, boxSizing: "border-box", color: C.white, fontFamily: "Manrope", fontWeight: 600, fontSize: 44, letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", boxShadow: `0 12px 40px rgba(14,32,56,${0.18 * morph})`, willChange: "transform" }}>
            <span style={{ opacity: cl((morph - 0.6) * 2.5) }}>Start a conversation</span>
            <svg width={34} height={34} viewBox="0 0 24 24" style={{ opacity: cl((morph - 0.6) * 2.5), transform: `translate(${press * 4}px, ${-press * 4}px)` }}><path d="M5 19 19 5M5 5h14v14" fill="none" stroke={C.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        );
      })()}
      {linesK > 0 && (
        <div data-probe="contact" style={{ position: "absolute", zIndex: 3, left: 0, top: 0, transform: `translate(${TYPE2}px, ${884 + (1 - linesK) * 24}px)`, opacity: linesK, fontFamily: "Manrope", fontWeight: 500, fontSize: 40, letterSpacing: "-0.02em", lineHeight: 1.25 }}>
          <div style={{ color: C.ink }}>robin@kruslockbosconsultancy.com</div>
          <div style={{ color: C.blue }}>linkedin.com/in/robindanielbos</div>
        </div>
      )}
    </>
  );
};
