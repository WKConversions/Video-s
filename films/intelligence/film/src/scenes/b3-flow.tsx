// B3 (revision 1): S8..S11 as one continuous composition over 39.2 - 61.0, sentence by sentence, every time derived from the VO words.
// One still camera P for the whole stretch (it only zooms out once, in the pause before the first click, and breathes at the very end).
// Screens are layers (an upper layer fades in over the opaque lower one in 0.48 s, camera still); lifts rise 0.55 s, hold >= 1.0 s, settle 0.4 s, one at a time.
import React from "react";
import { Crop, SHADOW, Shot, SOFT, INOUT, w, we } from "../kit";
import { CamV, Layer, Lift, Mv, Ptr, Spin, Tint, Veil, breath, c01, cursorPos, dis, hovP, k, liftP, mix, prsP } from "./b3-lib";
import { OFFER_TITLE as _unused, Pg03, Pg13, Pg14, Pg16, Pg18, STRAT_RECT, P03 } from "./b3-screens";
void _unused;

// ------------------------------------------------------------------ the beats, all from the VO
const DIS = 0.48;                                   // every screen change: one soft dissolve
const eCall = we("call");          // S8 sentence 1: "Had a client call?"
const wPaste = w("Paste"), wNeeds = w("needs"), wBudget = w("budget"), wTime = w("timeline"), eTime = we("timeline");
const wPrices = w("prices"), wProcess = w("process");
const wSource = w("source");

// S8: 1. the camera eases out (pause before the first click) while the cursor glides to the Offer tab, 2. click, dissolve to Offer
const CAM0 = 39.4;                                  // H2 ends here (screen 34, Cam 1280/600/1.0, no cursor)
const tTab = eCall;                                 // 40.50 press on the Offer tab
const rTab = tTab + 0.32;                           // 40.82 the app responds: dissolve to the Offer page
const CAM1 = tTab - 0.15;                           // camera arrives and stays still from here to the end
// 3. "Paste": click into the box, the box lifts out, the call pours in
const tBox = wPaste + 0.22;                         // 41.60
const rBox = tBox + 0.32;                           // 41.92 lift starts
const L1a = rBox, PASTE_AT = L1a + 0.48, PASTE_STEP = 0.22;
const L1b = PASTE_AT + 4 * PASTE_STEP + 0.22 + 0.05; // lift settles once the last line is in (>= 1.0 s hold)
// 4. "Read transcript" (the pause after sentence 2)
const tRead = L1b + 0.58;                           // 44.10
const rRead = tRead + 0.32;                         // 44.42 -> "Reading your transcript..."
// S9: the summary, then the four needs cards in one lift with a focus on needs / budget / timeline
const D12 = rRead, D13 = D12 + 0.98, CARD_AT = D13 + 0.05;
const L2a = wNeeds - 0.05, L2b = eTime + 0.08;
// the click on "Make an offer" and S10
const D14 = L2b + 0.4;
const tChip = D14 + DIS + 0.82;                     // 49.30
const rChip = tChip + 0.32;                         // 49.62 -> "Writing your offer..."
const D16 = rChip + DIS + 0.35;                     // 50.45 -> "Your offer is ready"
const L3a = D16 + DIS + 0.02, L3b = L3a + 0.55 + 1.05;
// S11
const tStrat = L3b + 0.75;                          // 53.35 press on the Strategy tab
const rStrat = tStrat + 0.32;
const L4a = wSource - 0.14, L4b = L4a + 0.55 + 1.0;
const tBase = L4b + 0.1, rBase = tBase + 0.32;      // 56.17 -> the knowledge base
const tOffer = rBase + 0.93, rOffer = tOffer + 0.32; // 57.42 -> the offer again
const tLogo = rOffer + 0.88, rLogo = tLogo + 0.32;  // 58.62 -> the home screen at rest
const HOME = rLogo + DIS;                           // 59.10

// ------------------------------------------------------------------ camera (screen px at the frame centre, scale)
const P: CamV = { x: 1280, y: 600, s: 0.9 };
const cam = (t: number): CamV => {
  if (t < CAM0) return { x: 1280, y: 600, s: 1.0 };
  if (t < CAM1) { const u = INOUT(c01((t - CAM0) / (CAM1 - CAM0))); return { x: P.x, y: P.y, s: mix(1.0, P.s, u) }; }
  if (t < HOME + 0.05) return P;
  const u = c01((t - HOME - 0.05) / (61.0 - HOME - 0.05)); const e = INOUT(u); return { x: P.x, y: mix(P.y, 470, e), s: mix(P.s, 0.95, e) };
};

// ------------------------------------------------------------------ the cursor: every click = glide 0.6-0.8 s, rest 0.15 s, press, the app answers
const MV: Mv[] = [
  { a: CAM0 + 0.15, b: CAM1, x: 982, y: 35, tp: tTab },          // Offer tab (screen 34 layout)
  { a: tBox - 0.75, b: tBox - 0.15, x: 1100, y: 470, tp: tBox },  // the transcript box
  { a: tRead - 0.75, b: tRead - 0.15, x: 836, y: 908, tp: tRead },// Read transcript
  { a: tChip - 0.75, b: tChip - 0.15, x: 809, y: 1055, tp: tChip },// Make an offer
  { a: tStrat - 0.8, b: tStrat - 0.15, x: 1062, y: 35, tp: tStrat },// Strategy tab
  { a: tBase - 0.7, b: tBase - 0.15, x: 918, y: 35, tp: tBase },   // knowledge base tab
  { a: tOffer - 0.7, b: tOffer - 0.15, x: 990, y: 35, tp: tOffer },// Offer tab
  { a: tLogo - 0.75, b: tLogo - 0.15, x: 738, y: 33, tp: tLogo },  // the logo -> home
];
const [M_TAB, M_BOX, M_READ, M_CHIP, M_STRAT, M_BASE, M_OFFER, M_LOGO] = MV;
// the second block of moves (S10 -> S11) starts from the Make-an-offer cursor having left; each group has its own appearance
const GROUPS: { from: number; to: number; start: { x: number; y: number }; moves: Mv[]; inA: number; outA: number }[] = [
  { from: 0, to: 3, start: { x: 1560, y: 470 }, moves: [M_TAB, M_BOX, M_READ], inA: CAM0 + 0.1, outA: rRead + 0.15 },
  { from: 3, to: 4, start: { x: 1500, y: 760 }, moves: [M_CHIP], inA: M_CHIP.a - 0.12, outA: rChip + 0.15 },
  { from: 4, to: 8, start: { x: 1420, y: 640 }, moves: [M_STRAT, M_BASE, M_OFFER, M_LOGO], inA: M_STRAT.a - 0.1, outA: rLogo + 0.04 },
];

// ------------------------------------------------------------------ the 02 ripple
const KB_CARDS = [[714, 331], [1098, 331], [1482, 331], [714, 552], [1098, 552], [1482, 552]];
const RIP = rBase + DIS + 0.02;
const LitCard: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const a = RIP + i * 0.07;
  const up = k(t, a, 0.22, SOFT), down = k(t, a + 0.47, 0.3, SOFT), p = up * (1 - down);
  if (p <= 0.001) return null;
  const [x, y] = KB_CARDS[i];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 364, height: 201 + (i > 2 ? 1 : 0), transform: `scale(${1 + 0.04 * p})`, borderRadius: 24, boxShadow: `0 0 0 ${3.5 * p}px rgba(47,125,225,${0.6 * p}), ${SHADOW}`, zIndex: 3 }}>
      <Crop n="02" x={x} y={y} w={364} h={201 + (i > 2 ? 1 : 0)} r={24} />
    </div>
  );
};

// ------------------------------------------------------------------ the film part
export const Flow: React.FC<{ t: number }> = ({ t }) => {
  const c = cam(t);
  // the cursor group that is live now
  let g = GROUPS.find((q) => t >= q.inA && t < q.outA + 0.3) ?? null;
  const cur = g ? cursorPos(g.start, g.moves, t, cam) : null;
  const op = g ? k(t, g.inA, 0.15) * (1 - k(t, g.outA, 0.25)) : 0;
  const H = (m: Mv) => hovP(t, m) * (t < m.tp + 0.55 ? 1 : 1), PR = (m: Mv) => prsP(t, m);

  // lifts
  const pTx = liftP(t, L1a, L1b), pCards = liftP(t, L2a, L2b), pTab = liftP(t, L3a, L3b), pStrat = liftP(t, L4a, L4b);
  const veil = Math.max(pTx, pCards, pTab, pStrat);
  const ring = (a: number, b: number) => k(t, a, 0.2, SOFT) * (1 - k(t, b, 0.2, SOFT));
  const fCards = { needs: ring(wNeeds + 0.03, wBudget - 0.04), budget: ring(wBudget - 0.02, wTime - 0.04), timeline: ring(wTime - 0.02, L2b) };
  const fTab = { table: ring(wPrices + 0.24, wProcess + 0.14), time: ring(wProcess + 0.14, L3b) };

  const p03: P03 = { at: PASTE_AT, step: PASTE_STEP, ring: k(t, tBox, 0.25) * (1 - k(t, L1b + 0.2, 0.3)), hov: H(M_READ), prs: PR(M_READ) };
  const none = { hov: 0, prs: 0 };

  return (
    <>
      {t < rTab + DIS + 0.05 && (
        <Layer cam={c} op={1}>
          <Shot n="34" />
          <Tint x={950} y={17} w={64} h={38} hov={H(M_TAB)} prs={PR(M_TAB)} />
        </Layer>
      )}
      {t >= rTab && t < D12 + DIS + 0.05 && <Layer cam={c} op={dis(t, rTab, DIS)}><Pg03 t={t} p={p03} /></Layer>}
      {t >= D12 && t < D13 + DIS + 0.05 && (
        <Layer cam={c} op={dis(t, D12, DIS)}><Shot n="12"><Spin x={756} y={350} t={t} /></Shot></Layer>
      )}
      {t >= D13 && t < D14 + DIS + 0.05 && <Layer cam={c} op={dis(t, D13, DIS)}><Pg13 t={t} at={CARD_AT} foc={fCards} /></Layer>}
      {t >= D14 && t < rChip + DIS + 0.05 && <Layer cam={c} op={dis(t, D14, DIS)}><Pg14 hov={H(M_CHIP)} prs={PR(M_CHIP)} /></Layer>}
      {t >= rChip && t < D16 + DIS + 0.05 && (
        <Layer cam={c} op={dis(t, rChip, DIS)}><Shot n="15"><Spin x={756} y={350} t={t} /></Shot></Layer>
      )}
      {t >= D16 && t < rStrat + DIS + 0.05 && (
        <Layer cam={c} op={dis(t, D16, DIS)}>
          <Pg16 foc={fTab} />
          <Tint x={1020} y={17} w={86} h={38} hov={H(M_STRAT)} prs={PR(M_STRAT)} />
        </Layer>
      )}
      {t >= rStrat && t < rBase + DIS + 0.05 && (
        <Layer cam={c} op={dis(t, rStrat, DIS)}>
          <Pg18 />
          <Tint x={890} y={17} w={62} h={38} hov={H(M_BASE)} prs={PR(M_BASE)} />
        </Layer>
      )}
      {t >= rBase && t < rOffer + DIS + 0.05 && (
        <Layer cam={c} op={dis(t, rBase, DIS)}>
          <Shot n="02">{KB_CARDS.map((_, i) => <LitCard key={i} i={i} t={t} />)}</Shot>
          <Tint x={959} y={17} w={62} h={38} hov={H(M_OFFER)} prs={PR(M_OFFER)} />
        </Layer>
      )}
      {t >= rOffer && t < rLogo + DIS + 0.05 && (
        <Layer cam={c} op={dis(t, rOffer, DIS)}><Pg16 logo={{ hov: H(M_LOGO), prs: PR(M_LOGO) }} /></Layer>
      )}
      {t >= rLogo && <Layer cam={c} op={dis(t, rLogo, DIS)}><Shot n="01" /></Layer>}

      <Veil p={veil} />
      <Lift cam={c} rect={{ x: 735, y: 322, w: 1090, h: 372 }} p={pTx} bre={breath(t, L1a, L1b)} ts={1.5} ty={520} r={22}><Pg03 t={t} p={{ ...p03, ...none }} /></Lift>
      <Lift cam={c} rect={{ x: 743, y: 689, w: 1074, h: 518 }} p={pCards} bre={breath(t, L2a, L2b)} ts={1.6} r={20}><Pg13 t={t} at={CARD_AT} foc={fCards} /></Lift>
      <Lift cam={c} rect={{ x: 745, y: 888, w: 1070, h: 420 }} p={pTab} bre={breath(t, L3a, L3b)} ts={1.6} r={20}><Pg16 foc={fTab} /></Lift>
      <Lift cam={c} rect={STRAT_RECT} p={pStrat} bre={breath(t, L4a, L4b)} ts={1.3} r={22}><Pg18 /></Lift>
      {cur && op > 0.001 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, zIndex: 40 }}><Ptr x={cur.x} y={cur.y} press={cur.press} op={op} /></div>}
    </>
  );
};
export const B3_TIMES = { tTab, rTab, tBox, rBox, L1a, PASTE_AT, L1b, tRead, rRead, D13, L2a, L2b, D14, tChip, rChip, D16, L3a, L3b, tStrat, rStrat, L4a, L4b, tBase, rBase, tOffer, rOffer, tLogo, rLogo, HOME, CAM1 };
