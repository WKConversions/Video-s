// S11 (27.6–30.85) "your next connection could open a new door.": the payoff of the opening. The two people
// who were pushed apart slide back in, the glowing dot links them with the wave, the line folds up into the outline
// of a door, the door (their topographic charcoal) swings open onto their cyan light, and the light fills the frame.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, CX, GRAD, IN, INOUT, OUT, Photo, Pt, Rise, SHADOW, Topo, WavePoly, c01, k, lerpPts, mix, sinePoints, sp, w } from "../kit";
import { H } from "../handoff";
import { Scene } from "./types";

const T0 = 27.6, T1 = H.cyan.t;
const N = 160;
const CARD = { w: 360, h: 460, y: 600 };
const AX = 520, BX = 1400;
const DOOR = { x0: 800, x1: 1120, top: 270, bottom: 830, r: 160 };

/** the door outline as N points: left threshold -> up the left jamb -> over the arch -> down -> right threshold */
const doorPts = (): Pt[] => {
  const raw: Pt[] = [];
  const add = (a: Pt, b: Pt, n: number) => { for (let i = 0; i < n; i++) { const s = i / n; raw.push([mix(a[0], b[0], s), mix(a[1], b[1], s)]); } };
  const yA = DOOR.top + DOOR.r;
  add([AX + CARD.w / 2, DOOR.bottom], [DOOR.x0, DOOR.bottom], 14);
  add([DOOR.x0, DOOR.bottom], [DOOR.x0, yA], 40);
  for (let i = 0; i < 50; i++) { const a = Math.PI + (i / 50) * Math.PI; raw.push([CX + Math.cos(a) * DOOR.r, yA + Math.sin(a) * DOOR.r]); }
  add([DOOR.x1, yA], [DOOR.x1, DOOR.bottom], 40);
  add([DOOR.x1, DOOR.bottom], [BX - CARD.w / 2, DOOR.bottom], 15);
  raw.push([BX - CARD.w / 2, DOOR.bottom]);
  // resample to N
  const L: number[] = [0]; for (let i = 1; i < raw.length; i++) L.push(L[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
  const tot = L[L.length - 1]; const out: Pt[] = []; let j = 0;
  for (let i = 0; i < N; i++) { const d = (i / (N - 1)) * tot; while (j < L.length - 2 && L[j + 1] < d) j++; const s = (d - L[j]) / ((L[j + 1] - L[j]) || 1); out.push([mix(raw[j][0], raw[j + 1][0], s), mix(raw[j][1], raw[j + 1][1], s)]); }
  return out;
};
const DOOR_PTS = doorPts();
const ARCH = `M ${DOOR.x0} ${DOOR.bottom} L ${DOOR.x0} ${DOOR.top + DOOR.r} A ${DOOR.r} ${DOOR.r} 0 0 1 ${DOOR.x1} ${DOOR.top + DOOR.r} L ${DOOR.x1} ${DOOR.bottom} Z`;

const Door: React.FC<{ t: number }> = ({ t }) => {
  const slide = k(t, T0 + 0.1, 0.55, OUT);
  const link = k(t, w("next") - 0.08, 0.38, INOUT);                 // the dot draws the wave out to both cards
  const tilt = c01(sp(t, w("connection") - 0.06, 1.6, 0.55));
  const fold = k(t, w("could") - 0.06, 0.5, INOUT);                  // the line folds up into the door outline
  const panelIn = k(t, w("could") + 0.32, 0.25, OUT);
  const open = k(t, w("open") - 0.06, 0.6, (x) => 1 - (1 - x) ** 3);  // soft start would be lazy here: it swings, then settles
  const flood = k(t, w("a2") - 0.06, 0.6, IN);                       // the lit opening grows to cover the frame
  const ax = mix(-260, AX, slide), bx = mix(2180, BX, slide);
  const half = sinePoints(N, AX + CARD.w / 2, CARD.y, BX - CARD.w / 2, CARD.y, 2.5, 34, t * 5, true);
  const wave = lerpPts(half, DOOR_PTS, fold);
  // grow the wave out from the centre both ways: trim both ends symmetrically
  const reach = c01(link);
  const pts = wave.slice(Math.floor((N - 1) * (0.5 - reach / 2)), Math.ceil((N - 1) * (0.5 + reach / 2)) + 1);
  // the flood: the door opening's rounded rect grows to the frame
  const fx0 = mix(DOOR.x0, -40, flood), fx1 = mix(DOOR.x1, 1960, flood), ftop = mix(DOOR.top, -40, flood), fbot = mix(DOOR.bottom, 1120, flood), fr = mix(DOOR.r, 0, flood);
  const cardsOut = flood;
  return (
    <>
      {/* the two people return */}
      {[{ x: ax, src: "street.jpg", pos: "50% 35%", s: 1 }, { x: bx, src: "team-diego.jpg", pos: "50% 30%", s: -1 }].map((c, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${c.x - CARD.w / 2}px, ${CARD.y - CARD.h / 2}px) perspective(1400px) rotateY(${c.s * 4 * tilt}deg) scale(${1 - cardsOut * 0.08})`, opacity: 1 - cardsOut }}>
          <Photo src={c.src} w={CARD.w} h={CARD.h} r={32} pos={c.pos} shadow={SHADOW} />
        </div>))}
      {/* the light behind the door, then the door panel (their topographic charcoal) swinging open on its left hinge */}
      {panelIn > 0 && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><linearGradient id="s11g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.cyanL} /></linearGradient></defs>
        <path d={flood > 0 ? `M ${fx0} ${fbot} L ${fx0} ${ftop + fr} A ${fr} ${fr} 0 0 1 ${fx0 + fr} ${ftop} L ${fx1 - fr} ${ftop} A ${fr} ${fr} 0 0 1 ${fx1} ${ftop + fr} L ${fx1} ${fbot} Z` : ARCH} fill="url(#s11g)" opacity={c01(open * 3)} />
        {/* the wedge of light on the floor */}
        {open > 0.05 && flood < 1 && <path d={`M ${DOOR.x0} ${DOOR.bottom} L ${DOOR.x1} ${DOOR.bottom} L ${mix(DOOR.x1, 1500, open)} 1080 L ${mix(DOOR.x0, 420, open)} 1080 Z`} fill="url(#s11g)" opacity={0.28 * open * (1 - flood)} />}
      </svg>}
      {panelIn > 0 && flood < 0.6 && <div style={{ position: "absolute", left: 0, top: 0, width: DOOR.x1 - DOOR.x0, height: DOOR.bottom - DOOR.top, transform: `translate(${DOOR.x0}px, ${DOOR.top}px) perspective(1600px) rotateY(${-72 * open}deg)`,
        transformOrigin: "0% 50%", borderRadius: `${DOOR.r}px ${DOOR.r}px 6px 6px`, overflow: "hidden", background: C.charD, opacity: panelIn * (1 - c01(flood * 2)), boxShadow: open > 0.02 ? SHADOW : undefined }}>
        <Topo o={{ t: t + 40, w: DOOR.x1 - DOOR.x0, h: DOOR.bottom - DOOR.top, cell: 8, scale: 1 / 300 }} color="rgba(255,255,255,0.16)" width={2} id="door" />
        <div style={{ position: "absolute", right: 36, top: (DOOR.bottom - DOOR.top) * 0.55, width: 16, height: 16, borderRadius: 8, background: C.cyanL }} />
      </div>}
      {/* the wave: the link, then the outline of the door */}
      {link > 0 && flood < 0.5 && <WavePoly pts={pts} width={16} p={1} dot={0} opacity={1 - c01(flood * 2)} />}
      {/* the dot from S10 sits at the centre until it draws the link */}
      {t < w("next") + 0.2 && <div style={{ position: "absolute", left: 0, top: 0, width: 40, height: 40, borderRadius: 20, background: C.cyanL, transform: `translate(${940}px, ${mix(520, CARD.y, k(t, T0, 0.6, INOUT)) - 20}px) scale(${mix(1.6, 0.6, k(t, T0, 0.8, INOUT)) * (1 - k(t, w("next") - 0.05, 0.25))})`,
        boxShadow: "0 0 40px rgba(158,230,253,0.6)" }} />}
      {/* the type: "your next connection" */}
      {t < w("open") + 0.4 && <div style={{ position: "absolute", left: 0, right: 0, top: 128, display: "flex", justifyContent: "center" }}>
        <Rise text="your next connection" t={t} at={0} times={[w("your4"), w("next"), w("connection")]} size={104} weight={700} out={k(t, w("open") - 0.1, 0.35, IN)} />
      </div>}
      {/* the sheen across the full cyan field */}
      {flood >= 1 && <AbsoluteFill style={{ background: `linear-gradient(105deg, rgba(255,255,255,0) ${mix(-30, 110, k(t, 30.55, 0.3)) - 12}%, rgba(255,255,255,0.35) ${mix(-30, 110, k(t, 30.55, 0.3))}%, rgba(255,255,255,0) ${mix(-30, 110, k(t, 30.55, 0.3)) + 12}%), ${GRAD}` }} />}
    </>
  );
};

export const S11: Scene = {
  id: "S11", t0: T0, t1: T1, C: Door,
  topo: (t) => ({
    bumps: [{ x: AX, y: CARD.y, h: 0.6 * k(t, T0, 0.6), r: 260 }, { x: BX, y: CARD.y, h: 0.6 * k(t, T0, 0.6), r: 260 }],
    ripples: [{ x: CX, y: CARD.y, age: t - w("connection"), h: 0.5, w: 70, speed: 850 }],
  }),
};
