// B2 (revision 1): the whole 20.0 - 39.4 sequence as one function of film time t (S4..S7 each draw it for their window; the base is
// opaque, so the overlaps between the windows are pixel-identical). Everything is keyed to the paced voice-over (words.json).
// Click grammar: glide 0.65-0.75 s INOUT -> hover 0.15 s -> press 0.12 s + release 0.2 s -> the app responds 0.15 s later.
import React from "react";
import { Crop, Cursor, Shot, Cam, SHADOW, SW, SH, k, c01, mix, sp, SOFT, OUT, INOUT, VO } from "../kit";
import WJ from "../words.json";
import { NATIVE, Nat, SalesCol, PanelHole, PanelP24, PanelP26, PanelP27, PanelP29 } from "./b2-ov";

const K = (n: string): [number, number] => [SW / NATIVE[n][0], SH / NATIVE[n][1]];
const lerp = (t: number, a: number, b: number, e: (x: number) => number = SOFT) => k(t, a, b - a, e);
const LIN = (x: number) => x;

// ------------------------------------------------------------------ the voice-over anchors (film seconds, from words.json)
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, "");
const hit = (word: string, after: number) => {
  const h = (WJ as { words: { word: string; start: number; end: number }[] }).words.find((x) => norm(x.word) === norm(word) && x.start + VO >= after - 0.01);
  if (!h) throw new Error("no VO word " + word);
  return h;
};
const wf = (word: string, after: number) => hit(word, after).start + VO;
const wfe = (word: string, after: number) => hit(word, after).end + VO;

const aNeed = wf("need", 19), aChangeE = wfe("change", 19);          // "Need something to change?"
const aOpen = wf("open", 21);                                          // "Open Strategy and just tell the agent, like: Raise ... euros."
const aEurosE = wfe("euros", 24);
const aSugg = wf("suggests", 29), aExact = wf("exact", 29), aEditE = wfe("edit", 29); // "It suggests the exact edit."
const aAppr = wf("approve", 31);                                       // "You approve."
const aEvery = wf("every", 33), aUpdates = wf("updates", 33);          // "Every related document updates to match, ready for your review."

// ------------------------------------------------------------------ the click script
type Click = { g0: number; g1: number; P: number; R: number };
const click = (g0: number, dur: number): Click => { const g1 = g0 + dur, P = g1 + 0.15; return { g0, g1, P, R: P + 0.32 + 0.15 }; };
const E0 = aNeed + 0.03, E1 = aChangeE - 0.08;                         // the cursor enters while "Need something to change?" is spoken
const C1 = click(aOpen - 0.2, 0.67);                                   // Strategy tab (on "Open Strategy")
const C2 = click(C1.P + 0.32 + 0.23, 0.67);                            // Sales card (while "tell the agent")
const LIFT0 = C2.R + 0.48 + 0.04;                                      // the agent panel lifts once the dissolve has finished
const TYPE0 = LIFT0 + 0.3, TYPE_DUR = 2.35;                            // typed 18 characters a second, ends before "euros" ends
const C3 = click(aEurosE + 0.17, 0.7);                                 // Send, in the pause after the sentence
const REP0 = aSugg + 0.1;                                              // the suggestion card appears on "suggests"
const C4 = click(aAppr - 0.62, 0.65);                                  // Approve, pressed on "approve"
const PROG0 = aEvery + 0.02, PROG1 = aUpdates - 0.12, SWAP = aUpdates - 0.06;
const C5 = click(aUpdates - 0.31, 0.65);                               // "Review one by one"
const SETTLE0 = C5.R;                                                  // the panel settles back (0.4 s), then the list dissolves in
const D30 = SETTLE0 + 0.4;
const CAM2 = D30 + 0.48 - 0.05;                                        // one calm reframe once the list has arrived (1.0 s)
const C6 = click(D30 + 0.48 + 0.05, 0.75);                             // Approve all (4), in the pause after the sentence
const D34 = C6.R, DISS = 0.48;                                         // screen 34 dissolves in and ends exactly at H2 (39.4)

// ------------------------------------------------------------------ the camera on the screens
const camAt = (t: number) => {
  const a = INOUT(c01((t - 20.2) / (E1 - 20.2))), b = INOUT(c01((t - CAM2) / 1.0));
  return { x: 1280, y: 600 - 60 * a + 60 * b, s: 1 };
};
const scr2f = (x: number, y: number, t: number): [number, number] => { const c = camAt(t); return [960 + (x - c.x) * c.s, 540 + (y - c.y) * c.s]; };

// ------------------------------------------------------------------ the lifted agent panel
const PXL = 1422, PXR = 1824, CXP = 1428;
const kx24 = K("24")[0];
const PW = (PXR - PXL) * kx24;
const H1 = 318 + 30 + 155, H2 = 448 + 30 + 155, H3 = 690, H4 = 382, H5 = 422;
const SC1 = 1.75, SC2 = 1.45;
const scAt = (t: number) => mix(SC1, SC2, lerp(t, C3.R, C3.R + 0.8, INOUT)) * (1 + 0.005 * (Math.min(t, SETTLE0) - LIFT0));
const hAt = (t: number) => {
  let h = H1; h = mix(h, H2, lerp(t, C3.R, C3.R + 0.55)); h = mix(h, H3, lerp(t, REP0, REP0 + 0.5)); h = mix(h, H4, lerp(t, C4.R, C4.R + 0.5)); h = mix(h, H5, lerp(t, SWAP, SWAP + 0.3));
  return h;
};
const liftP = (t: number) => sp(t, LIFT0, 1.6, 0.9);
const settleS = (t: number) => lerp(t, SETTLE0, SETTLE0 + 0.4, INOUT);
const pe = (t: number) => Math.min(1.02, liftP(t)) * (1 - settleS(t));
const panelBox = (t: number) => {
  const sc = scAt(t), h = hAt(t), p = pe(t);
  const tl: [number, number] = [CXP - (PW * sc) / 2, 540 - (h * sc) / 2];
  const o = scr2f(PXL * kx24, 92, LIFT0), oSc = camAt(LIFT0).s;
  return { left: mix(o[0], tl[0], p), top: mix(o[1], tl[1], p), sc: mix(oSc, sc, p), h: mix(1235, h, Math.min(1, p)), p };
};
const toFrame = (lx: number, ly: number, t: number): [number, number] => { const b = panelBox(t); return [b.left + lx * b.sc, b.top + ly * b.sc]; };
const footLyAt = (t: number) => mix(1165 - 92, 318 + 30, lerp(t, LIFT0, LIFT0 + 0.5, OUT));

const Pc: React.FC<{ n: string; y0: number; y1: number; at: number; ov?: React.ReactNode; x0?: number; x1?: number }> = ({ n, y0, y1, at, ov, x0 = PXL, x1 = PXR }) => {
  const [kx, ky] = K(n);
  return (
    <div style={{ position: "absolute", left: 0, top: at, width: (x1 - x0) * kx, height: (y1 - y0) * ky }}>
      <Crop n={n} x={x0 * kx} y={y0 * ky} w={(x1 - x0) * kx} h={(y1 - y0) * ky}>
        <div style={{ position: "absolute", left: -x0 * kx, top: -y0 * ky }}><Nat n={n}>{ov}</Nat></div>
      </Crop>
    </div>
  );
};

// press = the visible squeeze (0.12 s down, 0.2 s up) as 0..1 for the Cursor; hover = the target's highlight
const press = (t: number, P: number) => { const u = (t - P) / 0.32; if (u <= 0 || u >= 1) return 0; return u < 0.375 ? (0.5 * u) / 0.375 : 0.5 + (0.5 * (u - 0.375)) / 0.625; };
const hover = (t: number, c: Click) => lerp(t, c.g1 - 0.1, c.g1 + 0.15) * (1 - lerp(t, c.P + 0.32, c.P + 0.55));
/** the hover / press highlight of a target (parent coordinates) */
const Hov: React.FC<{ x: number; y: number; w: number; h: number; r: number; t: number; c: Click; dark?: boolean }> = ({ x, y, w, h, r, t, c, dark }) => {
  const hv = hover(t, c), pr = Math.sin(Math.PI * press(t, c.P));
  if (hv <= 0.002) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, background: dark ? `rgba(255,255,255,${0.12 * hv + 0.06 * pr})` : `rgba(5,15,25,${0.05 * hv + 0.05 * pr})`, boxShadow: `0 0 0 3px rgba(63,140,232,${0.38 * hv})` }} />;
};
/** a button's visible squeeze: a still backing, the squeezed copy of the button on top */
const Sq: React.FC<{ n: string; nx: number; ny: number; nw: number; nh: number; left: number; top: number; t: number; c: Click; bg: string }> = ({ n, nx, ny, nw, nh, left, top, t, c, bg }) => {
  const p = press(t, c.P); if (p <= 0) return null;
  const [kx, ky] = K(n), s = 1 - 0.07 * Math.sin(Math.PI * p);
  return <div style={{ position: "absolute", left, top, width: nw * kx, height: nh * ky, background: bg }}><div style={{ transform: `scale(${s})`, transformOrigin: "50% 50%" }}><Crop n={n} x={nx * kx} y={ny * ky} w={nw * kx} h={nh * ky} /></div></div>;
};

// the typed prompt
const PROMPT = "Raise our minimum project price to €450";
const typedAt = (t: number) => PROMPT.slice(0, Math.round(PROMPT.length * lerp(t, TYPE0, TYPE0 + TYPE_DUR, LIN)));

const POPR: [number, number, number, number] = [1459, 712, 1783, 1012]; // the diff-preview block of the suggestion card (screen 26)
const CARD_TOP = 392;
// button rectangles (screen px of their own screens)
const SEND: [number, number, number, number] = [1754, 1273, 1823, 1309];
const APPR: [number, number, number, number] = [1457, 1026, 1575, 1062];
const REVW: [number, number, number, number] = [1577, 776, 1736, 812];
const ALL: [number, number, number, number] = [1687, 185, 1839, 229];

const POP0 = aExact, POP_END = POP0 + 1.55; // rises on "exact", held at least 1 s, then settles in 0.4 s

const Panel: React.FC<{ t: number }> = ({ t }) => {
  const b = panelBox(t);
  if (t < LIFT0 || b.p <= 0.001) return null;
  const [kx26, ky26] = K("26"), [kx25, ky25] = K("25"), [kx29, ky29] = K("29");
  const a1 = 1 - lerp(t, C3.R, C3.R + 0.3);
  const a3 = lerp(t, REP0, REP0 + 0.45);
  const a4 = lerp(t, C4.R, C4.R + 0.4);
  const a5 = lerp(t, SWAP, SWAP + 0.3);
  const lift = c01(b.p);
  const footLy = footLyAt(t);
  const typed = typedAt(t);
  const typing = t >= TYPE0 - 0.1 && t < C3.R;
  const caret = typing && (typed.length < PROMPT.length || Math.floor(t * 2) % 2 === 0) || (t >= TYPE0 - 0.4 && t < TYPE0 - 0.1 && Math.floor(t * 2) % 2 === 0);
  const strike = lerp(t, aEditE - 0.25, aEditE + 0.1), show = lerp(t, aEditE + 0.05, aEditE + 0.35);
  const pop = sp(t, POP0, 1.7, 0.9) * (1 - lerp(t, POP_END, POP_END + 0.4, INOUT));
  const prog = lerp(t, PROG0, PROG1, LIN), nDone = Math.min(15, Math.floor(prog * 15 + 0.001));
  const [pL, pT, pW, pH] = POPR;
  const ps = 1 + 0.12 * pop;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: b.h, transformOrigin: "0 0", transform: `translate(${b.left}px, ${b.top}px) scale(${b.sc * (0.965 + 0.035 * Math.min(1, b.p))})`, opacity: Math.min(1, lift * 3.5) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 27, background: "#fff", boxShadow: SHADOW, overflow: "hidden" }}>
        {t >= C3.R && a3 < 1 && <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
          <Pc n="25" y0={92} y1={540} at={0} />
          <Pc n="25" y0={1165} y1={1320} at={448 + 30} />
        </div>}
        {a1 > 0.001 && <div style={{ position: "absolute", inset: 0, opacity: a1, background: "#fff" }}>
          <Pc n="25" y0={92} y1={410} at={0} />
          <Pc n="25" y0={1165} y1={1320} at={footLy} ov={<PanelP24 typed={typed} caret={caret} />} />
          <Hov x={(SEND[0] - PXL) * kx25} y={footLy + (SEND[1] - 1165) * ky25} w={(SEND[2] - SEND[0]) * kx25} h={(SEND[3] - SEND[1]) * ky25} r={18} t={t} c={C3} dark />
          <Sq n="25" nx={SEND[0]} ny={SEND[1]} nw={SEND[2] - SEND[0]} nh={SEND[3] - SEND[1]} left={(SEND[0] - PXL) * kx25} top={footLy + (SEND[1] - 1165) * ky25} t={t} c={C3} bg="#fff" />
        </div>}
        {a3 > 0.001 && a4 < 1 && <div style={{ position: "absolute", inset: 0, opacity: a3, background: "#fff" }}>
          <Pc n="26" y0={CARD_TOP} y1={CARD_TOP + 690} at={0} ov={<PanelP26 strike={strike} show={show} />} />
          <Hov x={(APPR[0] - PXL) * kx26} y={(APPR[1] - CARD_TOP) * ky26} w={(APPR[2] - APPR[0]) * kx26} h={(APPR[3] - APPR[1]) * ky26} r={18} t={t} c={C4} dark />
          <Sq n="26" nx={APPR[0]} ny={APPR[1]} nw={APPR[2] - APPR[0]} nh={APPR[3] - APPR[1]} left={(APPR[0] - PXL) * kx26} top={(APPR[1] - CARD_TOP) * ky26} t={t} c={C4} bg="#fff" />
        </div>}
        {a4 > 0.001 && a5 < 1 && <div style={{ position: "absolute", inset: 0, opacity: a4, background: "#fff" }}>
          <Pc n="27" y0={470} y1={852} at={0} ov={<PanelP27 n={nDone} p={prog} />} />
        </div>}
        {a5 > 0.001 && <div style={{ position: "absolute", inset: 0, opacity: a5, background: "#fff" }}>
          <Pc n="29" y0={470} y1={892} at={0} ov={<PanelP29 />} />
          <Hov x={(REVW[0] - PXL) * kx29} y={(REVW[1] - 470) * ky29} w={(REVW[2] - REVW[0]) * kx29} h={(REVW[3] - REVW[1]) * ky29} r={18} t={t} c={C5} />
          <Sq n="29" nx={REVW[0]} ny={REVW[1]} nw={REVW[2] - REVW[0]} nh={REVW[3] - REVW[1]} left={(REVW[0] - PXL) * kx29} top={(REVW[1] - 470) * ky29} t={t} c={C5} bg="#fff" />
        </div>}
      </div>
      {/* the exact edit: the diff-preview block steps forward out of the card, is held, then settles */}
      {pop > 0.003 && a3 > 0.01 && a4 < 0.5 && (
        <div style={{ position: "absolute", left: (pL - PXL) * kx26, top: (pT - CARD_TOP) * ky26, width: (pW - pL) * kx26, height: pH - pT, transform: `scale(${ps})`, transformOrigin: "50% 50%", borderRadius: 12, overflow: "hidden", boxShadow: `0 ${6 + 26 * pop}px ${18 + 46 * pop}px rgba(5,15,25,${0.08 + 0.12 * pop})`, opacity: a3 * (1 - a4) }}>
          <Crop n="26" x={pL * kx26} y={pT * ky26} w={(pW - pL) * kx26} h={pH - pT}>
            <div style={{ position: "absolute", left: -pL * kx26, top: -pT * ky26 }}><Nat n="26"><PanelP26 strike={strike} show={show} /></Nat></div>
          </Crop>
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------------------ the cursor
type Seg = { c: Click; end: (t: number) => [number, number]; e?: (x: number) => number };
const frozen = (lx: number, ly: number, at: number): ((t: number) => [number, number]) => { let v: [number, number] | null = null; return () => (v = v ?? toFrame(lx, ly, at)); };
const mid = (r: [number, number, number, number]): [number, number] => [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2];
const SEGS: Seg[] = [
  { c: { g0: E0, g1: E1, P: 1e9, R: 1e9 }, end: () => [1250, 330] },
  { c: C1, end: (t) => scr2f(1063, 35, t) },
  { c: C2, end: (t) => scr2f(895, 352, t) },
  { c: C3, end: frozen((mid(SEND)[0] - PXL) * kx24, footLyAt(1e3) + (mid(SEND)[1] - 1165), C3.P) },
  { c: C4, end: frozen((mid(APPR)[0] - PXL) * K("26")[0], mid(APPR)[1] - CARD_TOP, C4.P) },
  { c: C5, end: frozen((mid(REVW)[0] - PXL) * K("29")[0], mid(REVW)[1] - 470, C5.P) },
  { c: C6, end: (t) => scr2f(mid(ALL)[0] * K("30")[0], mid(ALL)[1] * K("30")[1], t) },
];
const START: [number, number] = [2010, 1010];
const curAt = (t: number): [number, number] => {
  let p0: (t: number) => [number, number] = () => START;
  for (const sg of SEGS) {
    if (t < sg.c.g0) return p0(t);
    if (t < sg.c.g1) { const e = (sg.e ?? INOUT)(c01((t - sg.c.g0) / (sg.c.g1 - sg.c.g0))), a = p0(sg.c.g0), q = sg.end(t); return [mix(a[0], q[0], e), mix(a[1], q[1], e)]; }
    p0 = sg.end;
  }
  return p0(t);
};

// ------------------------------------------------------------------ the stage layer
const F: React.FC<{ t: number; a: number; d?: number; children: React.ReactNode }> = ({ t, a, d = DISS, children }) => {
  const op = k(t, a, d, SOFT);
  if (op <= 0.001) return null;
  return <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, opacity: op }}>{children}</div>;
};
/** screen 24 as the stage behind the lifted panel: the table value changes when the app responds to Approve */
const Stage24: React.FC<{ t: number }> = ({ t }) => {
  const [kx, ky] = K("24");
  return (
    <Shot n="24">
      <div style={{ position: "absolute", left: PXL * kx, top: 92 * ky, opacity: lerp(t, C4.R + 0.5, C4.R + 0.9) }}><Pc n="29" y0={92} y1={1327} at={0} ov={<PanelP29 />} /></div>
      <Nat n="24">
        <SalesCol v="A" val="400" p450={lerp(t, C4.R + 0.1, C4.R + 0.5)} flash={lerp(t, C4.R + 0.1, C4.R + 0.5) * (1 - lerp(t, C4.R + 0.9, C4.R + 1.6))} />
        <PanelHole op={c01(pe(t))} />
      </Nat>
    </Shot>
  );
};

export const Seq: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(t);
  const veil = 0.16 * c01(pe(t));
  const cur0 = curAt(t), cur: [number, number] = [cur0[0] - 3 + Math.sin(t * 3.1) * 1.2, cur0[1] - 2 + Math.cos(t * 2.6) * 1.0];
  let pr = 0; for (const sg of SEGS) pr = Math.max(pr, press(t, sg.c.P));
  const cop = k(t, E0, 0.25, SOFT) * (1 - k(t, C6.R + 0.08, 0.28, SOFT));
  const [k04x, k04y] = K("04"), [k06x, k06y] = K("06"), [k30x, k30y] = K("30");
  return (<>
    <Cam {...cam}>
      <Shot n="06"><Hov x={1020 * k06x} y={16 * k06y} w={86 * k06x} h={38 * k06y} r={19} t={t} c={C1} /></Shot>
      <F t={t} a={C1.R}><Shot n="04"><Hov x={712 * k04x} y={258 * k04y} w={366 * k04x} h={192 * k04y} r={18} t={t} c={C2} /></Shot></F>
      <F t={t} a={C2.R}><Stage24 t={t} /></F>
      <F t={t} a={D30}><Shot n="30">
        <Hov x={ALL[0] * k30x} y={ALL[1] * k30y} w={(ALL[2] - ALL[0]) * k30x} h={(ALL[3] - ALL[1]) * k30y} r={22} t={t} c={C6} dark />
        <Sq n="30" nx={ALL[0]} ny={ALL[1]} nw={ALL[2] - ALL[0]} nh={ALL[3] - ALL[1]} left={ALL[0] * k30x} top={ALL[1] * k30y} t={t} c={C6} bg="#f7f7f8" />
      </Shot></F>
      <F t={t} a={D34}><Shot n="34" /></F>
    </Cam>
    {veil > 0.002 && <div style={{ position: "absolute", inset: 0, background: `rgba(5,15,25,${veil})` }} />}
    <Panel t={t} />
    {cop > 0.002 && <div style={{ opacity: cop }}><Cursor x={cur[0]} y={cur[1]} press={pr} /></div>}
  </>);
};

/** every click / lift / screen change / typing span of this sequence, in film seconds (for the sound cues) */
export const EVENTS = { E0, E1, C1, C2, LIFT0, TYPE0, TYPE_END: TYPE0 + TYPE_DUR, C3, REP0, POP0, POP_END, C4, PROG0, PROG1, SWAP, C5, SETTLE0, D30, CAM2, C6, D34 };
