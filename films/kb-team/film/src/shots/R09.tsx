// Package R09 · reference f733-f832 · cuts f748, f760, f771, f787, f810
// AA-AD  four filmed people, each with one white line and the small cyan send button (FR 28, 29)
// AE     the one button, navy; the hand clicks it and it floods cyan (FR 30)
// AF     the cards burst out of the button; the tower rises faster and faster while the button sinks out (FR 31)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Arrow, Bar, Bars, C, E, F, Footage, Glyph, Ground, HandAt, Over, Port, S, SH, Tool, abs, ease, mix, onTwos, pressAt, rs, settle } from "../kit";
import type { HandKey } from "../kit";
import type { Pkg } from "../types";

const F0 = 733;
const at = (n: number) => rs(n - F0);                 // local seconds of a reference frame
const EPS = 1e-6;
const MONO = "ui-monospace, Menlo, monospace";

// ---------------------------------------------------------------- AA-AD: the filmed people and their wishes
const FILMED = [
  { name: "AA", f: 733, dim: 0.28, shade: 0.26, text: "Can you help us automate our follow-ups and keep the CRM up to date?" },
  { name: "AB", f: 748, dim: 0.36, shade: 0.32, text: "Turn these sketches into an app our customers can use." },
  { name: "AC", f: 760, dim: 0.34, shade: 0.14, text: "We want to be found by the right customers, in search and in AI answers." },
  { name: "AD", f: 771, dim: 0.36, shade: 0.36, text: "Build us one dashboard for the whole operation." },
];
const Filmed: React.FC<{ t: number }> = ({ t }) => {
  let k = 0;
  for (let i = 1; i < FILMED.length; i++) if (t >= at(FILMED[i].f) - EPS) k = i;
  const s = FILMED[k], tw = onTwos(s.name, t - at(s.f), 0.1);          // each clip on twos, the camera stepping with it
  return (
    <AbsoluteFill style={{ fontFamily: F }}>
      <Footage key={s.name} name={s.name} at={tw.at} scale={settle(tw.sj, 0.03)} dim={s.dim} />
      {/* a soft shade behind the line only, so the white text reads on the bright rooms too */}
      <AbsoluteFill style={{ background: `radial-gradient(46% 30% at 50% 48.5%, rgba(10,16,26,${s.shade}) 0%, rgba(10,16,26,0) 100%)` }} />
      <Over text={s.text} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- AE + AF: the button and the tower of cards
// One world: the button stands at (960, 540); everything the click sets free is placed above it (world y runs up into
// the negative). The camera rises along the tower: the world slides down by cam(t), measured on the reference
// (the button's and the cards' positions, f796-f832) and fitted with one smooth polynomial.
const T_AE = at(787), T_AF = at(810);
const CLICK = 2.52;                                    // the hand's click key: deepest at CLICK + 0.11 (reference f796)
const KEYS: HandKey[] = [{ at: 0, x: 1640, y: 1400 }, { at: CLICK, x: 1040, y: 640, click: true, early: 0.21 }];
const CAM = [1928.356, -9204.539, 41333.325, -78500.845, 69078.999, -22570.495];
const cam = (t: number) => { const u = Math.max(0, (t - at(796)) / 1.5); let s = 0, p = u; for (const c of CAM) { p *= u; s += c * p; } return s; };
const BTN = { x: 960, y: 540 };
const POP = { damping: 22, stiffness: 420, mass: 0.7 };
const FROM_BUTTON = [800, 810, 812, 814, 816];         // the reference frames at which a card jumps out of the button

/** A card of the tower. It appears exactly at reference frame f (already under way, so a cut stays a cut), from the
 *  button (the first five) or from below, where the button is (the rest), and lands with a small overshoot. */
const Card: React.FC<{ t: number; f: number; cx: number; cy: number; btn?: boolean; children: React.ReactNode }> = ({ t, f, cx, cy, btn, children }) => {
  const t0 = at(f);
  if (t < t0 - EPS) return null;
  const p = S(t, t0 - 0.06, POP), q = 1 - p;        // on its first frame it is already more than half way: it reads as a cut
  const fx = btn ? BTN.x : mix(cx, BTN.x, 0.3), fy = btn ? BTN.y : cy + 200;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${cx}px ${cy}px`, willChange: "transform",
      transform: `translate3d(${((fx - cx) * q).toFixed(2)}px, ${((fy - cy) * q).toFixed(2)}px, 0) rotate(${(q * (cx < BTN.x ? -8 : 8)).toFixed(2)}deg) scale(${mix(btn ? 0.12 : 0.5, 1, p).toFixed(4)})` }}>{children}</div>
  );
};
const Dot: React.FC<{ t: number; f: number; x: number; y: number; s: number; c: string }> = ({ t, f, x, y, s, c }) => (
  <Card t={t} f={f} cx={x} cy={y}><div style={abs(x - s / 2, y - s / 2, s, s, { borderRadius: s / 2, background: c })} /></Card>
);
/** a ring that leaves the button: the pulse after the click, and the burst */
const Ring: React.FC<{ t: number; t0: number; d?: number; grow?: number; o?: number }> = ({ t, t0, d = 0.6, grow = 0.5, o = 0.5 }) => {
  const x = (t - t0) / d;
  if (x <= 0 || x >= 1) return null;
  return <div style={abs(810, 390, 300, 300, { borderRadius: 66, border: `6px solid ${C.cyan}`, opacity: o * (1 - x), transform: `scale(${(1 + grow * ease.out(x)).toFixed(4)})`, willChange: "transform" })} />;
};
const Button: React.FC<{ t: number }> = ({ t }) => {
  const rel = t - (CLICK + 0.37);
  const rebound = rel < 0 ? 0 : 0.0265 * Math.sin((rel * 2 * Math.PI) / 0.3) * Math.exp(-rel * 9);
  const kick = FROM_BUTTON.reduce((a, f) => { const x = (t - at(f)) / 0.24; return a + (x > 0 && x < 1 ? 0.06 * Math.sin(Math.PI * x) * (1 - x) : 0); }, 0);
  const sc = 1 - 0.06 * pressAt(t, CLICK) + rebound + kick;
  const fill = E(t, CLICK + 0.05, 0.2, ease.out);     // the cyan floods out from under the fingertip
  const face: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 300, height: 300, borderRadius: 66, display: "flex", alignItems: "center", justifyContent: "center" };
  return (
    <div style={abs(810, 390, 300, 300, { transform: `scale(${sc.toFixed(4)})`, willChange: "transform" })}>
      <div style={{ ...face, boxShadow: "0 30px 70px rgba(41,58,81,.26)", opacity: 1 - fill }} />
      <div style={{ ...face, boxShadow: "0 30px 70px rgba(56,200,255,.45)", opacity: fill }} />
      <div style={{ ...face, background: C.ink }}><Arrow s={150} c="#fff" /></div>
      {fill > 0 && <div style={{ ...face, background: C.cyan, clipPath: fill < 1 ? `circle(${(fill * 350).toFixed(1)}px at 230px 250px)` : undefined }}><Arrow s={150} c={C.ink} /></div>}
    </div>
  );
};
const CLIENTS = ["abroad-internships", "tale-forge", "venga-travel", "worldwiders", "olea-hospitality", "mindmymind"];

const Tower: React.FC<{ t: number }> = ({ t }) => {
  const d = cam(t), v = cam(t + 1 / 120) - cam(t - 1 / 120);       // px the world moves in one film frame
  const blur = Math.max(0, v - 24) * 0.1;                           // a little vertical blur on the fastest frames (from about f818)
  const bars = mix(0.2, 1, S(t, T_AF + 0.04, { damping: 15, stiffness: 150 }));
  return (
    <Ground>
      {/* the ground wakes up a little after the click (the reference's ground takes on a tint): calm and still */}
      <AbsoluteFill style={{ opacity: E(t, CLICK + 0.1, 1.2), background: "radial-gradient(120% 95% at 50% 105%, rgba(56,200,255,.20) 0%, rgba(56,200,255,.07) 55%, rgba(56,200,255,0) 100%)" }} />
      {blur > 0.2 && <svg width="0" height="0" style={{ position: "absolute" }}><defs><filter id="r09blur" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} /></filter></defs></svg>}
      <div style={{ position: "absolute", left: 0, top: -160, width: 1920, height: 1400, overflow: "hidden", filter: blur > 0.2 ? "url(#r09blur)" : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 160, transform: `translate3d(0, ${d.toFixed(2)}px, 0)`, willChange: "transform" }}>
          {/* the button's pulses, on the ground behind everything: after the click, once more, and the burst */}
          <Ring t={t} t0={CLICK + 0.11} /><Ring t={t} t0={CLICK + 0.43} grow={0.42} o={0.35} /><Ring t={t} t0={T_AF} d={0.5} grow={1.1} o={0.6} />
          {/* the top of the tower (it leads into the collage of the next shot) */}
          <Card t={t} f={830} cx={1440} cy={-1630}><div style={abs(1250, -1810, 380, 360, { borderRadius: 6, background: "#8B95A5" })}><svg width="380" height="360" viewBox="0 0 320 303"><path d="M60 90 C160 40 240 110 150 150 C60 190 250 190 180 250" fill="none" stroke={C.ink} strokeWidth="7" /></svg></div></Card>
          <Card t={t} f={829} cx={870} cy={-1340}><div style={abs(660, -1500, 420, 320, { borderRadius: 6, background: "#2A3648" })}><svg width="420" height="320"><ellipse cx="210" cy="160" rx="150" ry="64" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="2 22" strokeLinecap="round" transform="rotate(-20 210 160)" /></svg></div></Card>
          <Dot t={t} f={828} x={1480} y={-1290} s={46} c={C.cyan} /><Dot t={t} f={829} x={590} y={-1330} s={40} c={C.amber} /><Dot t={t} f={829} x={1180} y={-1395} s={34} c={C.coral} />
          <Card t={t} f={826} cx={390} cy={-1020}><div style={abs(170, -1190, 440, 340, { borderRadius: 22, background: `linear-gradient(140deg, ${C.indigo}, ${C.cyan} 60%, ${C.mint})` })} /></Card>
          <Card t={t} f={827} cx={1230} cy={-1010}><Port who="robin" x={1060} y={-1230} w={340} h={440} rot={3} /></Card>
          <Card t={t} f={825} cx={660} cy={-855}>
            <div style={abs(380, -980, 560, 250, { borderRadius: 22, background: C.white, boxShadow: SH, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: 22 })}>{CLIENTS.map((n) => <div key={n} style={{ borderRadius: 12, background: "#F4F6F9", display: "flex", alignItems: "center", justifyContent: "center" }}><Img src={staticFile(`clients/${n}-logo.png`)} style={{ maxWidth: "78%", maxHeight: "62%", objectFit: "contain" }} /></div>)}</div>
          </Card>
          <Card t={t} f={824} cx={1370} cy={-615}>
            <div style={abs(1200, -740, 340, 250, { borderRadius: 22, background: C.ink })}><Bar x={34} y={34} w={110} h={12} c="rgba(255,255,255,.4)" /><Bar x={34} y={58} w={64} h={10} c="rgba(255,255,255,.2)" /><div style={abs(170, 62, 130, 130)}><Glyph k={3} s={130} c={C.cyan} /></div></div>
          </Card>
          <Card t={t} f={819} cx={840} cy={-540}>
            <div style={abs(560, -700, 560, 320, { borderRadius: 22, background: "#F7F9FB", boxShadow: SH })}><svg width="560" height="320"><path d="M110 160 H240 M330 160 C380 160 380 90 440 90 M330 160 C380 160 380 230 440 230" fill="none" stroke={C.cyan} strokeWidth="5" /></svg><Tool n="pipedrive" x={40} y={120} s={80} navy /><Tool n="n8n-logo2" x={440} y={50} s={80} /><Tool n="odoo-1" x={440} y={190} s={80} navy /><div style={abs(245, 118, 84, 84, { borderRadius: 20, border: `4px solid ${C.cyan}`, background: "#fff" })} /></div>
          </Card>
          {/* the five cards of FR 31, each where the storyboard has it (the storyboard frame is this world at cam = 470) */}
          <Card t={t} f={810} cx={640} cy={-120} btn>
            <div style={abs(330, -320, 620, 400, { borderRadius: 22, background: C.dark })}><div style={abs(0, 0, 620, 400, { transformOrigin: "50% 350px", transform: `scaleY(${bars.toFixed(4)})` })}><Bars x={50} y={60} w={520} h={290} n={12} /></div></div>
          </Card>
          <Card t={t} f={816} cx={1270} cy={-195} btn>
            <div style={abs(1010, -360, 520, 330, { borderRadius: 22, background: "#F4F1EA", boxShadow: SH, padding: 44 })}><div style={{ fontSize: 150, fontWeight: 600, fontFamily: MONO, letterSpacing: -6 }}>100+</div><div style={{ fontSize: 26, letterSpacing: 3, fontWeight: 600, color: C.sub }}>AUTOMATIONS BUILT</div></div>
          </Card>
          <Card t={t} f={800} cx={1010} cy={150} btn><Port who="karl" x={860} y={0} w={300} h={300} rot={-3} /></Card>
          <Card t={t} f={814} cx={1445} cy={180} btn><div style={abs(1230, 30, 430, 300, { borderRadius: 22, background: C.indigo })}><div style={abs(50, 50, 200, 200, { borderRadius: 100, background: "#DCE6FF" })} /></div></Card>
          <Card t={t} f={812} cx={610} cy={280} btn>
            <div style={abs(420, 150, 380, 260, { borderRadius: 22, background: C.white, boxShadow: SH, padding: 40 })}><div style={{ fontSize: 120, fontWeight: 600, fontFamily: MONO }}>25</div><div style={{ fontSize: 22, letterSpacing: 3, fontWeight: 600, color: C.sub }}>CLIENT PROJECTS</div></div>
          </Card>
          {/* the button, and the hand that rides down with it */}
          {d < 760 && <Button t={t} />}
          {d < 700 && <HandAt t={t} keys={KEYS} size={330} />}
        </div>
      </div>
    </Ground>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => (t < T_AE - EPS ? <Filmed t={t} /> : <Tower t={t} />);

export const PKG: Pkg = {
  id: "R09",
  Comp,
  sfx: [
    { t: CLICK + 0.11, kind: "click", note: "the hand presses the one button; it floods cyan", ref: 794 },
    { t: at(800), kind: "pop", note: "the first card jumps out of the button", ref: 800 },
    { t: T_AF, kind: "pop", note: "the burst: the chart, then three more cards two frames apart", ref: 810 },
    { t: T_AF, kind: "rise", note: "0.95", ref: 810 },
    { t: at(819), kind: "pop", note: "the next card, at the top edge", ref: 819 },
    { t: at(824), kind: "swish", note: "the fast run of cards, one a frame, f824-f830", ref: 824 },
  ],
};
