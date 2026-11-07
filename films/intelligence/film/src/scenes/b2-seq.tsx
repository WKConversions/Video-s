// B2: the whole 17.0 - 32.2 sequence as one function of film time t (S4..S7 each draw it for their window; the base is opaque,
// so the 0.1-0.2 s overlaps between the scene windows are pixel-identical).
import React from "react";
import { Crop, Cursor, Shot, Cam, SHADOW, SW, SH, k, c01, mix, sp, SOFT, OUT, INOUT, w } from "../kit";
import { NATIVE, Nat, StageOv, Ov31, PanelP24, PanelP26, PanelP27, PanelP29, Ov18 } from "./b2-ov";

const K = (n: string): [number, number] => [SW / NATIVE[n][0], SH / NATIVE[n][1]];
const lerp = (t: number, a: number, b: number, e: (x: number) => number = SOFT) => k(t, a, b - a, e);

// ------------------------------------------------------------------ timeline (film seconds)
const T_LIFT = 20.0, T_SEND = 24.4, T_REPLY = 25.4, T_POP = 26.12, T_APPROVE = 27.52, T_UPD = 28.38, T_DONE = 30.2, T_LIST = 30.78;
// the camera on the screens (screen px): keyframes [t, x, y, s]
const CAMK: [number, number, number, number, boolean][] = [[17.0, 1280, 600, 1, true], [18.5, 1280, 538, 1.004, true], [19.6, 1280, 538, 1.03, false], [20.6, 1280, 600, 1.035, true], [28.0, 1310, 600, 1.08, false], [30.7, 1310, 600, 1.1, false], [31.7, 1280, 600, 1, true], [32.2, 1280, 600, 1, true]];
export const camAt = (t: number) => {
  if (t <= CAMK[0][0]) return { x: 1280, y: 600, s: 1 };
  for (let i = 1; i < CAMK.length; i++) if (t <= CAMK[i][0]) { const a = CAMK[i - 1], b = CAMK[i], u = c01((t - a[0]) / (b[0] - a[0])), p = b[4] ? INOUT(u) : u; return { x: mix(a[1], b[1], p), y: mix(a[2], b[2], p), s: mix(a[3], b[3], p) }; }
  return { x: 1280, y: 600, s: 1 };
};
const scr2f = (x: number, y: number, t: number): [number, number] => { const c = camAt(t); return [960 + (x - c.x) * c.s, 540 + (y - c.y) * c.s]; };

// ------------------------------------------------------------------ the lifted agent panel
const PXL = 1422, PXR = 1824, CXP = 1428;
const kx24 = K("24")[0];
const PW = (PXR - PXL) * kx24; // panel width in its own px
const H1 = 318 + 30 + 155, H2 = 448 + 30 + 155, H3 = 690, H4 = 382, H5 = 422;
const SC1 = 1.75, SC2 = 1.45;
const scAt = (t: number) => mix(SC1 + 0.022 * (Math.min(t, T_SEND + 0.1) - 20.5), SC2 + 0.009 * (Math.max(t, 24.6) - 24.6), lerp(t, T_SEND + 0.1, T_SEND + 1.0));
const hAt = (t: number) => {
  let h = H1; h = mix(h, H2, lerp(t, T_SEND + 0.1, T_SEND + 0.95)); h = mix(h, H3, lerp(t, T_REPLY - 0.05, T_REPLY + 0.55)); h = mix(h, H4, lerp(t, T_APPROVE + 0.12, T_APPROVE + 0.7)); h = mix(h, H5, lerp(t, T_DONE - 0.1, T_DONE + 0.4));
  return h;
};
const liftP = (t: number) => sp(t, T_LIFT, 1.5, 0.78);
const outP = (t: number) => lerp(t, 30.72, 31.0);
// the origin of the lift: the panel where it sits on the screen
const panelBox = (t: number) => {
  const sc = scAt(t), h = hAt(t), p = Math.min(1.04, liftP(t));
  const tl: [number, number] = [CXP - (PW * sc) / 2, 540 - (h * sc) / 2];
  const o = scr2f(PXL * kx24, 92, T_LIFT);
  const oSc = camAt(T_LIFT).s;
  const left = mix(o[0], tl[0], p), top = mix(o[1], tl[1], p), s = mix(oSc, sc, p);
  const hh = t < T_LIFT + 0.6 ? mix(1235, h, p) : h;
  return { left, top, sc: s, h: hh, p };
};
const PRES = (t: number) => c01(1 - outP(t)); // presence of the lifted layer
const toFrame = (lx: number, ly: number, t: number): [number, number] => { const b = panelBox(t); return [b.left + lx * b.sc, b.top + ly * b.sc]; };

const Pc: React.FC<{ n: string; y0: number; y1: number; at: number; ov?: React.ReactNode; x0?: number; x1?: number; style?: React.CSSProperties }> = ({ n, y0, y1, at, ov, x0 = PXL, x1 = PXR, style }) => {
  const [kx, ky] = K(n);
  return (
    <div style={{ position: "absolute", left: 0, top: at, width: (x1 - x0) * kx, height: (y1 - y0) * ky, ...style }}>
      <Crop n={n} x={x0 * kx} y={y0 * ky} w={(x1 - x0) * kx} h={(y1 - y0) * ky}>
        <div style={{ position: "absolute", left: -x0 * kx, top: -y0 * ky }}><Nat n={n}>{ov}</Nat></div>
      </Crop>
    </div>
  );
};

// the typed prompt, word by word with the voice
const WORDS: [string, number][] = [["Raise", w("raise")], ["our", w("our")], ["minimum", w("minimum")], ["project", w("project")], ["price", w("price")], ["to", w("to", 2)], ["€450", w("four")]];
const typedAt = (t: number) => {
  let s = "";
  WORDS.forEach(([word, a], i) => {
    const nxt = i < WORDS.length - 1 ? WORDS[i + 1][1] - 0.02 : 24.15;
    const d = i === WORDS.length - 1 ? 0.62 : Math.min(0.3, nxt - a);
    const n = Math.round(word.length * c01((t - a) / d));
    if (n > 0) s += (s ? " " : "") + word.slice(0, n);
  });
  return s;
};

const POPR: [number, number, number, number] = [1459, 712, 1783, 1012]; // the diff-preview block of the suggestion card (screen 26)
const CARD_TOP = 392;

const Panel: React.FC<{ t: number }> = ({ t }) => {
  const b = panelBox(t);
  const pres = PRES(t);
  if (t < T_LIFT || pres <= 0) return null;
  const [kx26, ky26] = K("26");
  const a1 = 1 - lerp(t, T_SEND + 0.06, T_SEND + 0.3);
  const a3 = lerp(t, T_REPLY, T_REPLY + 0.22);
  const a4 = lerp(t, T_APPROVE + 0.12, T_APPROVE + 0.34);
  const a5 = lerp(t, T_DONE, T_DONE + 0.22);
  const lift = c01(b.p);
  const footLy = mix(1165 - 92, 318 + 30, lerp(t, T_LIFT, T_LIFT + 0.5, OUT));
  const typed = typedAt(t);
  const caret = t >= 21.0 && t < T_SEND + 0.05 && (typed.length > 0 && typed !== "Raise our minimum project price to €450" || Math.floor(t * 2.2) % 2 === 0);
  const strike = lerp(t, 26.3, 26.55), show = lerp(t, 26.5, 26.72);
  const pop = sp(t, T_POP, 1.5, 0.8) * (1 - lerp(t, 26.98, 27.28));
  const prog = lerp(t, T_UPD, 29.56), nDone = Math.min(15, Math.floor(prog * 15 + 0.001));
  const pressA = c01((t - T_APPROVE) / 0.3);
  const [pL, pT, pW, pH] = POPR;
  const ps = 1 + 0.12 * pop;
  const pressBtn = 1 - 0.07 * Math.sin(Math.PI * pressA) * (pressA > 0 && pressA < 1 ? 1 : 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: b.h, transformOrigin: "0 0", transform: `translate(${b.left}px, ${b.top}px) scale(${b.sc * (0.965 + 0.035 * pres)})`, opacity: Math.min(1, lift * 4) * pres }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 27, background: "#fff", boxShadow: SHADOW, overflow: "hidden" }}>
        {t >= T_SEND && a3 < 1 && <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
          <Pc n="25" y0={92} y1={540} at={0} />
          <Pc n="25" y0={1165} y1={1320} at={448 + 30} />
        </div>}
        {a1 > 0.001 && <div style={{ position: "absolute", inset: 0, opacity: a1, background: "#fff" }}>
          <Pc n="25" y0={92} y1={410} at={0} />
          <Pc n="25" y0={1165} y1={1320} at={footLy} ov={<PanelP24 typed={typed} caret={caret} />} />
        </div>}
        {a3 > 0.001 && a4 < 1 && <div style={{ position: "absolute", inset: 0, opacity: a3, background: "#fff" }}>
          <Pc n="26" y0={CARD_TOP} y1={CARD_TOP + 690} at={0} ov={<PanelP26 strike={strike} show={show} />} />
          {pressA > 0 && <div style={{ position: "absolute", left: (1457 - PXL) * kx26, top: (1026 - CARD_TOP) * ky26, width: 118 * kx26, height: 36, transform: `scale(${pressBtn})`, transformOrigin: "50% 50%", background: "#fff" }}>
            <Pc n="26" y0={1026} y1={1062} at={0} x0={1457} x1={1575} ov={null} />
          </div>}
        </div>}
        {a4 > 0.001 && a5 < 1 && <div style={{ position: "absolute", inset: 0, opacity: a4, background: "#fff" }}>
          <Pc n="27" y0={470} y1={852} at={0} ov={<PanelP27 n={nDone} p={prog} />} />
        </div>}
        {a5 > 0.001 && <div style={{ position: "absolute", inset: 0, opacity: a5, background: "#fff" }}>
          <Pc n="29" y0={470} y1={892} at={0} ov={<PanelP29 />} />
        </div>}
      </div>
      {/* the exact edit: the diff-preview block steps forward out of the card */}
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

// ------------------------------------------------------------------ the cascade of document rows (7)
const ROWS = 13, ROW_H = 84.35, ROW_TOP = 261;
const Cascade: React.FC<{ t: number }> = ({ t }) => {
  const a = lerp(t, 28.95, 29.1) * (1 - lerp(t, 29.78, 30.05));
  if (a <= 0.001) return null;
  const [kx, ky] = K("30"), sc = 0.9, cw = 560;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: cw, height: ROWS * ROW_H * ky, transformOrigin: "0 0", transform: `translate(130px, ${(1080 - ROWS * ROW_H * sc) / 2}px) scale(${sc})`, opacity: a, borderRadius: 26, background: "#fff", boxShadow: SHADOW, overflow: "hidden" }}>
      {Array.from({ length: ROWS }, (_, i) => {
        const s = lerp(t, 29.04 + i * 0.038, 29.04 + i * 0.038 + 0.16, OUT);
        return <div key={i} style={{ position: "absolute", left: 0, top: i * ROW_H, width: cw, height: ROW_H, opacity: s, transform: `translateY(${(1 - s) * 14}px)` }}>
          <Crop n="30" x={716 * kx} y={(ROW_TOP + i * ROW_H) * ky} w={cw} h={ROW_H * ky} />
        </div>;
      })}
    </div>
  );
};

// ------------------------------------------------------------------ the diff lifted out (7)
const DIFF: [number, number, number, number] = [772, 344, 1292, 632];
const DiffLift: React.FC<{ t: number }> = ({ t }) => {
  const a = lerp(t, 31.28, 31.4, OUT) * (1 - lerp(t, 31.74, 31.94));
  if (a <= 0.001) return null;
  const [kx, ky] = K("31");
  const [x0, y0, x1, y1] = DIFF; const cw = (x1 - x0) * kx, ch = (y1 - y0) * ky;
  const p = sp(t, 31.28, 1.6, 0.8), sc = mix(1.05, 2.1, Math.min(1.03, p)) * (1 - 0.04 * (1 - a));
  const r1 = lerp(t, 31.5, 31.64, OUT);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: cw, height: ch, transformOrigin: "0 0", transform: `translate(${960 - (cw * sc) / 2}px, ${540 - (ch * sc) / 2}px) scale(${sc})`, opacity: a, borderRadius: 14, overflow: "hidden", boxShadow: SHADOW }}>
      <Crop n="31" x={x0 * kx} y={y0 * ky} w={cw} h={ch}>
        <div style={{ position: "absolute", left: -x0 * kx, top: -y0 * ky }}><Nat n="31"><Ov31 r1={r1} r2={1} /></Nat></div>
      </Crop>
    </div>
  );
};

// ------------------------------------------------------------------ the cursor
type Seg = { a: number; b: number; to: [number, number]; sp: "s" | "f"; e?: (x: number) => number };
const APPROVE_T = 27.4, REVIEW_T = 30.45;
const SEGS: Seg[] = [
  { a: 17.0, b: 18.64, to: [1070, 40], sp: "s", e: OUT },
  { a: 18.98, b: 19.58, to: [905, 345], sp: "s" },
  { a: 19.9, b: 20.85, to: toFrame((1800 - PXL) * kx24, 318 + 30 + (1248 - 1165), 20.9), sp: "f" },
  { a: 21.3, b: 24.3, to: toFrame((1790 - PXL) * kx24, 318 + 30 + (1292 - 1165), 24.3), sp: "f" },
  { a: 24.9, b: 27.4, to: toFrame((1515 - PXL) * K("26")[0], 1043 - CARD_TOP, APPROVE_T), sp: "f" },
  { a: 27.95, b: 30.5, to: toFrame((1657 - PXL) * K("29")[0], 795 - 470, REVIEW_T), sp: "f" },
  { a: 30.82, b: 31.0, to: [748, 298], sp: "s" },
  { a: 31.3, b: 31.76, to: [1765, 208], sp: "s" },
];
const PRESS: [number, number][] = [[18.7, 18.98], [19.6, 19.85], [20.9, 21.15], [24.4, 24.65], [27.5, 27.8], [30.55, 30.8], [31.02, 31.26], [31.8, 32.0]];
const SEG_START: [number, number] = [880, 430];
const idle = (t: number): [number, number] => [Math.sin(t * 3.1) * 2.4, Math.cos(t * 2.6) * 2.0];
const curAt = (t: number): [number, number] => {
  let p0 = SEG_START;
  for (const sg of SEGS) {
    const end = (tt: number): [number, number] => (sg.sp === "s" ? scr2f(sg.to[0], sg.to[1], tt) : sg.to);
    if (t < sg.a) return p0;
    if (t < sg.b) { const e = (sg.e ?? SOFT)(c01((t - sg.a) / (sg.b - sg.a))), q = end(t); return [mix(p0[0], q[0], e), mix(p0[1], q[1], e)]; }
    p0 = end(sg.b);
    if (sg === SEGS[SEGS.length - 1] || t < (SEGS[SEGS.indexOf(sg) + 1]?.a ?? 1e9)) return end(t);
  }
  return p0;
};

// ------------------------------------------------------------------ the stage layer
const F: React.FC<{ t: number; a: number; d?: number; until?: number; children: React.ReactNode }> = ({ t, a, d = 0.3, until = 1e9, children }) => {
  const op = k(t, a, d, SOFT);
  if (op <= 0.001 || t > until) return null;
  return <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, opacity: op }}>{children}</div>;
};

export const Seq: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(t);
  const lp = Math.min(1, liftP(t)) * PRES(t);
  const hole = lp;
  const veil = 0.16 * Math.min(1, lerp(t, T_LIFT, T_LIFT + 0.4)) * PRES(t) + 0.16 * Math.max(0, lerp(t, 31.28, 31.4) * (1 - lerp(t, 31.74, 31.94))) + 0.1 * (lerp(t, 28.95, 29.1) * (1 - lerp(t, 29.78, 30.05)));
  const cur0 = curAt(t), id = idle(t), cur: [number, number] = [cur0[0] + id[0], cur0[1] + id[1]];
  let press = 0; for (const [a, b] of PRESS) if (t >= a && t <= b) press = (t - a) / (b - a);
  const sCur = 1 + 0.18 * (t > 27.3 && t < 27.9 ? 1 : 0);
  return (<>
    <Cam {...cam}>
      <Shot n="06" />
      <F t={t} a={18.92} until={20.1}><Shot n="04" /></F>
      <F t={t} a={19.72} until={20.9}><Shot n="18"><StageOv n="18" hole={hole} /></Shot></F>
      <F t={t} a={20.5} until={24.9}><Shot n="24"><StageOv n="24" hole={hole} /></Shot></F>
      <F t={t} a={T_SEND + 0.05} d={0.16} until={25.9}><Shot n="25"><StageOv n="25" hole={hole} /></Shot></F>
      <F t={t} a={T_REPLY} until={28.2}><Shot n="26"><StageOv n="26" hole={hole} /></Shot></F>
      <F t={t} a={T_APPROVE + 0.12} until={31.3}><Shot n="27"><StageOv n="27" hole={hole} /></Shot></F>
      <F t={t} a={T_LIST + 0.04} d={0.26}><Shot n="30" /></F>
      <F t={t} a={31.12} d={0.2} until={32.3}><Shot n="31"><Nat n="31"><Ov31 /></Nat></Shot></F>
      <F t={t} a={31.88} d={0.26}><Shot n="34" /></F>
    </Cam>
    {veil > 0.002 && <div style={{ position: "absolute", inset: 0, background: `rgba(5,15,25,${veil})` }} />}
    <Cascade t={t} />
    <Panel t={t} />
    <DiffLift t={t} />
    <Cursor x={cur[0]} y={cur[1]} press={press} s={sCur} />
  </>);
};
void Ov18; void OUT;
