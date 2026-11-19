// K.B blog + social loop: "Still Retyping WhatsApp Orders by Hand? How to Automate Them Into Your CRM".
// 12 s seamless loop, 30 fps, no audio. Isometric devices and app icons (true 30-degree projection, drawn in SVG);
// everything that carries words is an upright card, so it reads on a phone with the sound off.
// The scene is laid out in a 1080 x 1080 square and placed in the centre of every format (1:1, 4:5, 9:16, 16:9);
// only the canvas and the K.B wordmark's corner change per format. Every value is a pure function of the frame and
// the state at 12 s equals the state at 0 s (orbits and floats run on periods that divide 12 s).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";

export const FPS = 30, DUR = 360;
export type Fmt = "square" | "portrait" | "story" | "wide";
export const SIZES: Record<Fmt, [number, number]> = { square: [1080, 1080], portrait: [1080, 1350], story: [1080, 1920], wide: [1920, 1080] };

const C = { bg: "#F7F7F7", navy: "#293A51", sky: "#38C8FF", slate: "#E2E8F0", white: "#FFFFFF", shadow: "rgba(150,106,62,.20)" };
const F = "Montserrat, sans-serif";
const TAU = Math.PI * 2;
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const E = (t: number, a: number, b: number) => ease(clamp((t - a) / (b - a)));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
/** a small springy overshoot: only for the bubble pops and the Reviewed stamp */
const backOut = (x: number) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const POP = (t: number, a: number, d = 0.34) => (t <= a ? 0 : t >= a + d ? 1 : backOut((t - a) / d));

// ---------------------------------------------------------------- font
let fontReady = false;
const useFont = () => {
  const [ok, setOk] = useState(fontReady);
  const [h] = useState<number | null>(() => (fontReady ? null : delayRender("font")));
  useEffect(() => {
    if (fontReady) { setOk(true); return; }
    const face = new FontFace("Montserrat", `url(${staticFile("fonts/montserrat-var-latin.woff2")})`, { weight: "100 900" });
    face.load().then((f) => { document.fonts.add(f); return Promise.all([400, 600, 700].map((w) => document.fonts.load(`${w} 40px Montserrat`))); })
      .then(() => { fontReady = true; setOk(true); });
  }, []);
  useEffect(() => { if (ok && h !== null) continueRender(h); }, [ok, h]);
  return ok;
};

// ---------------------------------------------------------------- isometric projection
const CS = Math.cos(Math.PI / 6), SN = 0.5;
const P = (x: number, y: number, z: number): [number, number] => [(x - y) * CS, (x + y) * SN - z];
const pts = (...a: [number, number][]) => a.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
/** upright face looking right-front: u runs right and up, v runs down */
const mX = (ox = 0, oy = 0) => `matrix(${CS},${-SN},0,1,${ox},${oy})`;
/** ground plane: u runs right-down, v runs left-down */
const mTop = (ox = 0, oy = 0) => `matrix(${CS},${SN},${-CS},${SN},${ox},${oy})`;
/** upright face looking left-front: u runs right-down, v runs down */
const mY = (ox = 0, oy = 0) => `matrix(${CS},${SN},0,1,${ox},${oy})`;

const Box: React.FC<{ o?: [number, number, number]; w: number; d: number; h: number; top: string; right: string; left: string }> = ({ o = [0, 0, 0], w, d, h, top, right, left }) => {
  const [x, y, z] = o; const V = (a: number, b: number, c: number) => P(x + a, y + b, z + c);
  return (
    <g>
      <polygon points={pts(V(0, d, 0), V(w, d, 0), V(w, d, h), V(0, d, h))} fill={left} />
      <polygon points={pts(V(w, 0, 0), V(w, d, 0), V(w, d, h), V(w, 0, h))} fill={right} />
      <polygon points={pts(V(0, 0, h), V(w, 0, h), V(w, d, h), V(0, d, h))} fill={top} />
    </g>
  );
};
/** an upright rounded slab whose face looks right-front, with its thickness behind it (stacked copies: a smooth
 *  rounded extrusion). Local origin = the face's top-left corner. */
const XPanel: React.FC<{ fw: number; fh: number; r: number; depth: number; face: string; side: string; edge?: string; children?: React.ReactNode }> = ({ fw, fh, r, depth, face, side, edge, children }) => (
  <g>
    {Array.from({ length: depth }, (_, i) => depth - i).map((k) => <rect key={k} width={fw} height={fh} rx={r} fill={k === depth && edge ? edge : side} transform={mX(-k * CS, -k * SN)} />)}
    <g transform={mX()}><rect width={fw} height={fh} rx={r} fill={face} />{children}</g>
  </g>
);

// ---------------------------------------------------------------- positioned pieces
const Obj: React.FC<{ x: number; y: number; s?: number; z: number; o?: number; children: React.ReactNode }> = ({ x, y, s = 1, z, o = 1, children }) =>
  o <= 0.002 ? null : (
    <div style={{ position: "absolute", left: 0, top: 0, zIndex: z, opacity: o, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`, transformOrigin: "0 0", willChange: "transform" }}>
      <svg width={1} height={1} style={{ overflow: "visible", display: "block" }}>{children}</svg>
    </div>
  );
const Card: React.FC<{ x: number; y: number; s?: number; z: number; o?: number; origin?: string; children: React.ReactNode }> = ({ x, y, s = 1, z, o = 1, origin = "0 50%", children }) =>
  o <= 0.002 ? null : (
    <div style={{ position: "absolute", left: 0, top: 0, zIndex: z, opacity: o, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`, transformOrigin: origin, willChange: "transform" }}>{children}</div>
  );
/** a soft, warm ground shadow */
const Shadow: React.FC<{ x: number; y: number; w: number; h: number; o?: number; z?: number }> = ({ x, y, w, h, o = 1, z = 2 }) =>
  o <= 0.002 ? null : <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, zIndex: z, opacity: o, transform: `translate3d(${(x - w / 2).toFixed(2)}px, ${(y - h / 2).toFixed(2)}px, 0)`, background: `radial-gradient(closest-side, ${C.shadow}, rgba(150,106,62,0))`, willChange: "transform" }} />;

// ---------------------------------------------------------------- the phone
const PW = 230, PHH = 450;
const Phone: React.FC<{ lit: number; inb: number[] }> = ({ lit, inb }) => (
  <g transform={`translate(${(-CS * PW / 2).toFixed(2)}, ${(-(PHH / 2 - SN * PW / 2)).toFixed(2)})`}>
    <defs><clipPath id="scr"><rect x={12} y={12} width={PW - 24} height={PHH - 24} rx={24} /></clipPath></defs>
    <XPanel fw={PW} fh={PHH} r={36} depth={18} face={C.white} side="#D4DCE6" edge="#C3CEDB">
      <rect x={12} y={12} width={PW - 24} height={PHH - 24} rx={24} fill="#D9E0E8" />
      <g opacity={lit} clipPath="url(#scr)">
        <rect x={12} y={12} width={PW - 24} height={PHH - 24} fill="#EFEAE2" />
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={40 + (i % 3) * 70} cy={140 + Math.floor(i / 3) * 170} r={18} fill="none" stroke="#E2DACE" strokeWidth={2} />)}
        <rect x={12} y={12} width={PW - 24} height={66} fill="#008069" />
        <circle cx={42} cy={47} r={14} fill="#DFE5E7" />
        <rect x={64} y={37} width={86} height={9} rx={4.5} fill="#fff" opacity={0.92} />
        <rect x={64} y={52} width={54} height={7} rx={3.5} fill="#fff" opacity={0.6} />
        {inb.map((o, k) => <rect key={k} x={22} y={100 + k * 62} width={[156, 140, 128][k]} height={46} rx={12} fill="#fff" opacity={o} />)}
        <rect x={22} y={PHH - 70} width={148} height={42} rx={21} fill="#fff" />
        <circle cx={PW - 44} cy={PHH - 49} r={21} fill="#00A884" />
        <path d={`M${PW - 52} ${PHH - 49}h14m-5-6l6 6-6 6`} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <rect x={PW / 2 - 26} y={20} width={52} height={9} rx={4.5} fill="#1E2735" opacity={0.85} />
    </XPanel>
  </g>
);

// ---------------------------------------------------------------- app icons (their own colours), as isometric tiles
const IW = 92;
const Logo: React.FC<{ k: number }> = ({ k }) => {
  if (k === 0) return ( // WhatsApp
    <>
      <rect width={IW} height={IW} rx={22} fill="#25D366" />
      <circle cx={46} cy={44} r={22} fill="none" stroke="#fff" strokeWidth={5.5} />
      <polygon points="28,56 22,71 37,65" fill="#fff" />
      <path transform="translate(33.4,31.4) scale(1.05)" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#fff" />
    </>
  );
  if (k === 1) return ( // Instagram
    <>
      <rect width={IW} height={IW} rx={22} fill="url(#igg)" />
      <rect x={21} y={21} width={50} height={50} rx={15} fill="none" stroke="#fff" strokeWidth={5.5} />
      <circle cx={46} cy={46} r={11.5} fill="none" stroke="#fff" strokeWidth={5.5} />
      <circle cx={60.5} cy={31.5} r={3.4} fill="#fff" />
    </>
  );
  if (k === 2) return ( // Messenger
    <>
      <rect width={IW} height={IW} rx={22} fill="#fff" />
      <path d="M46 17c-16.6 0-29 12-29 27.6 0 8.4 3.6 15.6 9.6 20.4v9.6l9-5c3.2.9 6.8 1.4 10.4 1.4 16.6 0 29-12 29-27.6S62.6 17 46 17z" fill="url(#msg)" />
      <path d="M29.5 52.5l12.6-13.4 7.2 6.4 12.9-7.6-12.6 13.4-7.2-6.4z" fill="#fff" />
    </>
  );
  if (k === 3) return ( // Gmail
    <>
      <rect width={IW} height={IW} rx={22} fill="#fff" />
      <path d="M18 40v22a4 4 0 0 0 4 4h7V44.5z" fill="#4285F4" />
      <path d="M74 40v22a4 4 0 0 1-4 4h-7V44.5z" fill="#34A853" />
      <path d="M18 33.5a5 5 0 0 1 8-4l20 15 20-15a5 5 0 0 1 8 4v6.5L63 48.5V41l-17 12.8L29 41v7.5L18 40z" fill="#EA4335" />
      <path d="M63 41l11-8.5V40L63 48.5z" fill="#FBBC04" />
      <path d="M18 33.5V40l11 8.5V41z" fill="#C5221F" />
    </>
  );
  return ( // a website chat widget
    <>
      <rect width={IW} height={IW} rx={22} fill={C.slate} />
      <path d="M24 30a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H40l-10 9v-9h-0a8 8 0 0 1-6-8z" fill={C.navy} />
      {[0, 1, 2].map((i) => <circle key={i} cx={36 + i * 10} cy={40} r={3.2} fill="#fff" />)}
    </>
  );
};
const ICON_SIDE = ["#1DAF55", "#B5307C", "#D3DAE3", "#D3DAE3", "#C8D2DE"];
const Icon: React.FC<{ k: number }> = ({ k }) => (
  <g transform={`translate(${(-CS * IW / 2).toFixed(2)}, ${(-(IW / 2 - SN * IW / 2)).toFixed(2)})`}>
    <XPanel fw={IW} fh={IW} r={22} depth={12} face="none" side={ICON_SIDE[k]}><Logo k={k} /></XPanel>
  </g>
);
const IconDefs: React.FC = () => (
  <defs>
    <radialGradient id="igg" cx="0.3" cy="1.07" r="1.5"><stop offset="0" stopColor="#FDF497" /><stop offset="0.05" stopColor="#FDF497" /><stop offset="0.45" stopColor="#FD5949" /><stop offset="0.6" stopColor="#D6249F" /><stop offset="0.9" stopColor="#285AEB" /></radialGradient>
    <linearGradient id="msg" x1="0.15" y1="1" x2="0.85" y2="0"><stop offset="0" stopColor="#0099FF" /><stop offset="0.6" stopColor="#A033FF" /><stop offset="0.9" stopColor="#FF5280" /><stop offset="1" stopColor="#FF7061" /></linearGradient>
  </defs>
);

// ---------------------------------------------------------------- the desk in the corner, the order slips, the van, the pin
const Desk: React.FC = () => (
  <g transform="translate(26, -30)">
    {[[0, 0], [100, 0], [0, 160], [100, 160]].map(([x, y], i) => <Box key={i} o={[x, y, 0]} w={8} d={8} h={70} top="#C9D3DF" right="#B9C5D3" left="#C9D3DF" />)}
    <Box o={[-4, -4, 70]} w={116} d={176} h={10} top="#FFFFFF" right="#DCE3EC" left="#E9EEF4" />
    <Box o={[22, 44, 80]} w={58} d={84} h={5} top="#E2E8F0" right="#C9D3DF" left="#D5DDE7" />
    <g transform={`translate(${P(22, 128, 141)[0].toFixed(2)}, ${P(22, 128, 141)[1].toFixed(2)})`}>
      <XPanel fw={84} fh={56} r={6} depth={4} face="#FFFFFF" side="#C9D3DF">
        <rect x={5} y={5} width={74} height={46} rx={3} fill="#EEF2F6" />
        {[0, 1, 2].map((i) => <rect key={i} x={12} y={13 + i * 12} width={[44, 56, 30][i]} height={6} rx={3} fill="#C3CDD9" />)}
      </XPanel>
    </g>
  </g>
);
const Slip: React.FC<{ rot: number }> = ({ rot }) => (
  <g transform="translate(6.9, -32)">
    <g transform={mTop(0, 3)}><g transform={`rotate(${rot.toFixed(2)} 28 36)`}><rect width={56} height={72} rx={4} fill="#DCE3EC" /></g></g>
    <g transform={mTop()}><g transform={`rotate(${rot.toFixed(2)} 28 36)`}>
      <rect width={56} height={72} rx={4} fill="#FFFFFF" />
      <rect x={8} y={9} width={26} height={6} rx={3} fill={C.navy} opacity={0.55} />
      {[0, 1, 2].map((i) => <rect key={i} x={8} y={24 + i * 12} width={[40, 32, 36][i]} height={5} rx={2.5} fill="#C3CDD9" />)}
    </g></g>
  </g>
);
const Van: React.FC = () => {
  const glass = "#A9BACB", bodyTop = "#FFFFFF", bodyR = "#EEF2F7", bodyL = "#DCE3EC";
  const rear = P(0, 128, 56);
  return (
    <g transform="translate(32, -17)">
      <Box o={[0, 0, 4]} w={54} d={34} h={40} top={bodyTop} right={bodyR} left={bodyL} />
      <Box o={[0, 34, 4]} w={54} d={94} h={52} top={bodyTop} right={bodyR} left={bodyL} />
      {/* cab window and a navy line along the side */}
      <polygon points={pts(P(54, 30, 22), P(54, 6, 22), P(54, 6, 38), P(54, 30, 38))} fill={glass} />
      <polygon points={pts(P(54, 38, 14), P(54, 124, 14), P(54, 124, 17), P(54, 38, 17))} fill={C.navy} opacity={0.8} />
      {/* the open back with the water bottles */}
      <g transform={mY(rear[0], rear[1])}>
        <rect x={3} y={3} width={48} height={47} rx={3} fill="#E6EDF4" />
        {[0, 1, 2].map((c) => [0, 1].map((r) => (
          <g key={`${c}${r}`}>
            <rect x={7 + c * 15} y={8 + r * 21} width={12} height={18} rx={5} fill="#CFE6F7" stroke="#9EC3DF" strokeWidth={1.2} />
            <rect x={10 + c * 15} y={5 + r * 21} width={6} height={4} rx={1.5} fill="#7FA7C6" />
          </g>
        )))}
      </g>
      {[16, 102].map((y) => { const [x, yy] = P(54, y, 6); return <g key={y}><ellipse cx={x} cy={yy} rx={9} ry={10.5} fill={C.navy} /><ellipse cx={x} cy={yy} rx={3.5} ry={4} fill="#C3CDD9" /></g>; })}
    </g>
  );
};
const Pin: React.FC = () => (
  <g>
    <path d="M0 0c-7-10-22-22-22-38a22 22 0 0 1 44 0c0 16-15 28-22 38z" fill={C.navy} />
    <circle cx={0} cy={-38} r={8.5} fill="#fff" />
  </g>
);

// ---------------------------------------------------------------- texts on cards
const Bubble: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: "inline-flex", alignItems: "center", height: 64, padding: "0 24px", background: C.white, borderRadius: "4px 20px 20px 20px", boxShadow: "0 14px 30px rgba(150,106,62,.16), 0 2px 6px rgba(41,58,81,.07)", color: C.navy, fontFamily: F, fontSize: 30, fontWeight: 600, letterSpacing: -0.3, whiteSpace: "nowrap" }}>{text}</div>
);
const TEXTS = ["6 bottles tomorrow", "Same as last week", "+2 extra please"];

// ---------------------------------------------------------------- layout and timing
const PH0 = { x: 540, y: 500 }, PH1 = { x: 215, y: 565 };      // phone face centre: the hook, then moved aside
const HUB = { x: 535, y: 548, w: 244, h: 360 }, CRM = { x: 852, y: 575, w: 300, h: 330 };
const VAN0 = { x: 730, y: 405 }, DIR = { x: CS, y: -SN }, PIN_D = 236;
const phone = (t: number) => {
  const m = E(t, 3.9, 4.6) * (1 - E(t, 10.9, 11.8));
  return { x: mix(PH0.x, PH1.x, m), y: mix(PH0.y, PH1.y, m) + 4 * Math.sin((TAU * t) / 3), s: mix(1, 0.86, m) };
};
const orbit = (k: number, t: number) => {
  const ph = phone(t), a = (TAU * t) / 4 + (k * TAU) / 5 - 0.9, sa = Math.sin(a);
  return { x: ph.x + 300 * ph.s * Math.cos(a), y: ph.y + 180 * ph.s + 92 * ph.s * sa + 4 * Math.sin((TAU * t) / 2 + k * 1.7), s: (0.9 + 0.1 * sa) * ph.s, front: sa > 0 };
};
const iconSlot = (k: number, t = 0) => ({ x: HUB.x - 90 + k * 45, y: HUB.y - 98 + bob(t, 2, k * 1.2, 3) + bob(t, 4, 0.5, 3), s: 0.36 });
const bubPhone = (k: number, t: number) => { const ph = phone(t); return { x: ph.x - 118 * ph.s + k * 14 * ph.s, y: ph.y - 168 * ph.s + k * 80 * ph.s, s: ph.s }; };
const bubHub = (k: number, t = 0) => ({ x: HUB.x - 106, y: HUB.y - 22 + k * 56 + bob(t, 4, 0.5, 3), s: 0.6 });
const bubCrm = (k: number, t = 0) => ({ x: CRM.x - 128, y: CRM.y - 69 + k * 78 + bob(t, 3, 2.0, 3), s: 0.72 });
const ICON_T = (k: number) => 4.85 + 0.1 * k, BUB_HUB_T = (k: number) => 5.95 + 0.1 * k, BUB_CRM_T = (k: number) => 7.55 + 0.1 * k;
/** a gentle float for the parked pieces (periods divide 12 s) */
const bob = (t: number, per: number, ph: number, amp = 3) => amp * Math.sin((TAU * t) / per + ph);
const qb = (a: { x: number; y: number }, b: { x: number; y: number }, lift: number, p: number) => {
  const cx = (a.x + b.x) / 2, cy = Math.min(a.y, b.y) - lift, q = 1 - p;
  return { x: q * q * a.x + 2 * q * p * cx + p * p * b.x, y: q * q * a.y + 2 * q * p * cy + p * p * b.y };
};
const qPath = (a: { x: number; y: number }, b: { x: number; y: number }, lift: number) => `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${((a.x + b.x) / 2).toFixed(1)} ${(Math.min(a.y, b.y) - lift).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
/** a line that draws ahead of a travelling object and leaves a short trail behind it */
const Trail: React.FC<{ d: string; head: number; p: number; arrive: number; t: number; w?: number }> = ({ d, head, p, arrive, t, w = 2.5 }) => {
  const tail = p < 1 ? Math.max(0, p - 0.28) : mix(0.72, 1, E(t, arrive, arrive + 0.3));
  const len = head - tail;
  if (len <= 0.002) return null;
  return <path d={d} fill="none" stroke={C.sky} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={`${len.toFixed(4)} 2`} strokeDashoffset={(-tail).toFixed(4)} />;
};

// ---------------------------------------------------------------- the scene (1080 x 1080 layout space)
const Scene: React.FC<{ t: number }> = ({ t }) => {
  const ph = phone(t);
  const lit = E(t, 0.12, 0.3) * (1 - E(t, 11.55, 11.85));
  const parts: React.ReactNode[] = [];

  // the phone and its shadow
  const inb = [0, 1, 2].map((k) => clamp((t - (0.3 + 0.12 * k)) / 0.12) * (1 - E(t, BUB_HUB_T(k), BUB_HUB_T(k) + 0.3)) + E(t, 11.45, 11.6) * (1 - E(t, 11.55, 11.85)));
  parts.push(<Shadow key="phs" x={ph.x + 20 * ph.s} y={ph.y + 300 * ph.s} w={420 * ph.s} h={150 * ph.s} />);
  parts.push(<Obj key="ph" x={ph.x} y={ph.y} s={ph.s} z={30}><Phone lit={lit} inb={inb} /></Obj>);

  // the five app icons: orbit, glide into the hub, drift back out
  const trails: React.ReactNode[] = [];
  for (let k = 0; k < 5; k++) {
    const td = ICON_T(k), ta = td + 0.8, tr = 10.7 + 0.08 * k;
    const dep = E(t, td, ta), ret = E(t, tr, tr + 0.9), slot = iconSlot(k);
    let x: number, y: number, s: number, z: number;
    if (t < td) { const o = orbit(k, t); x = o.x; y = o.y; s = o.s; z = o.front ? 37 : 25; }
    else if (t < tr) { const o0 = orbit(k, td), sl = iconSlot(k, t), q = qb(o0, sl, 120, dep); x = q.x; y = q.y; s = mix(o0.s, sl.s, dep); z = 45; }
    else { const o = orbit(k, t), q = qb(iconSlot(k, t), o, 90, ret); x = q.x; y = q.y; s = mix(slot.s, o.s, ret); z = ret > 0.6 ? (o.front ? 37 : 25) : 45; }
    const inOrbit = t < td || t >= tr + 0.9;
    parts.push(<Shadow key={`is${k}`} x={x + 6} y={y + 120 * s} w={110 * s} h={34 * s} o={inOrbit ? 0.7 : 0.7 * (1 - dep) + 0.7 * ret} />);
    parts.push(<Obj key={`ic${k}`} x={x} y={y} s={s} z={z}><IconDefs /><Icon k={k} /></Obj>);
    if (t > td - 0.3 && t < ta + 0.35) { const o0 = orbit(k, td); trails.push(<Trail key={`it${k}`} d={qPath(o0, slot, 120)} head={E(t, td - 0.25, td + 0.25)} p={dep} arrive={ta} t={t} />); }
    if (k === 0) { // the unread badge on the WhatsApp icon
      const n = t < 0.5 ? 3 : t < 0.68 ? 8 : 14, since = t < 0.5 ? 0.32 : t < 0.68 ? 0.5 : 0.68;
      const bo = clamp((t - 0.32) / 0.08) * (1 - E(t, 4.45, 4.65));
      const bump = 1 + 0.22 * Math.sin(Math.PI * clamp((t - since) / 0.18));
      if (bo > 0.002) parts.push(
        <Card key="badge" x={x + 40 * s} y={y - 70 * s} z={z + 1} o={bo} s={bump} origin="50% 50%">
          <div style={{ transform: "translate(-50%, -50%)", minWidth: 40, height: 40, padding: "0 10px", boxSizing: "border-box", borderRadius: 20, background: "#FF3B30", border: "3px solid #fff", color: "#fff", fontFamily: F, fontSize: 21, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
        </Card>
      );
    }
  }

  // the order slips (the chaos)
  const SLIPS = [[300, 395], [822, 372], [262, 590], [858, 590]];
  SLIPS.forEach(([sx, sy], i) => {
    const a0 = 1.6 + 0.1 * i, out = E(t, 4.2 + 0.07 * i, 4.65 + 0.07 * i), inn = E(t, a0, a0 + 0.4);
    const o = inn * (1 - out); if (o <= 0.002) return;
    const fx = mix(sx, HUB.x, out), fy = mix(sy + (1 - inn) * 24, HUB.y, out) + 4 * Math.sin((TAU * t) / 2 + i * 1.3);
    parts.push(<Obj key={`sl${i}`} x={fx} y={fy} s={1 - 0.6 * out} z={28} o={o}><Slip rot={8 * Math.sin((TAU * t) / 3 + i * 2.1)} /></Obj>);
  });

  // the desk in the corner, and its sticky note
  parts.push(<Shadow key="dks" x={180} y={985} w={300} h={110} />);
  parts.push(<Obj key="desk" x={165} y={905} z={60}><Desk /></Obj>);
  const note = E(t, 2.2, 2.6) * (1 - E(t, 8.4, 8.8)), peel = E(t, 8.4, 8.8);
  parts.push(
    <Card key="note" x={182 + 16 * peel} y={812 - 26 * (1 - E(t, 2.2, 2.6)) - 30 * peel} z={61} o={note} origin="50% 50%">
      <div style={{ transform: `translate(-50%, -50%) rotate(${(-6 + 14 * peel).toFixed(2)}deg)`, padding: "12px 16px", background: "#FFE68A", boxShadow: "0 8px 18px rgba(150,106,62,.18)", color: C.navy, fontFamily: F, fontSize: 25, fontWeight: 700, letterSpacing: -0.2 }}>retype?</div>
    </Card>
  );

  // the hub
  const hubIn = E(t, 4.45, 5.0), hubOut = E(t, 11.2, 11.6), hubO = hubIn * (1 - hubOut);
  parts.push(<Shadow key="hbs" x={HUB.x} y={HUB.y + HUB.h / 2 + 34} w={330} h={70} o={hubO} />);
  parts.push(
    <Card key="hub" x={HUB.x - HUB.w / 2} y={HUB.y - HUB.h / 2 + 40 * (1 - hubIn) + 30 * hubOut + bob(t, 4, 0.5, 3)} z={32} o={hubO} origin="50% 50%">
      <div style={{ width: HUB.w, height: HUB.h, boxSizing: "border-box", borderRadius: 26, background: C.white, border: `2.5px solid ${C.sky}`, boxShadow: "0 26px 50px rgba(150,106,62,.18), 0 3px 8px rgba(41,58,81,.06)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 24, textAlign: "center", color: C.navy, fontFamily: F, fontSize: 22, fontWeight: 700, letterSpacing: "0.12em" }}>ONE INBOX</div>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: HUB.w / 2 - 90 + i * 45 - 17, top: 68, width: 34, height: 34, borderRadius: 10, background: "#EEF2F6" }} />)}
      </div>
    </Card>
  );

  // the CRM card and its order rows
  const crmIn = E(t, 6.95, 7.45), crmOut = E(t, 11.15, 11.55), crmO = crmIn * (1 - crmOut);
  const row = [0, 1, 2].map((k) => E(t, 8.05 + 0.1 * k, 8.4 + 0.1 * k) * (1 - E(t, 10.45 + 0.06 * k, 10.7 + 0.06 * k)));
  const rv = POP(t, 8.75, 0.36), rvO = clamp((t - 8.75) / 0.1) * (1 - E(t, 10.3, 10.48));
  parts.push(<Shadow key="crs" x={CRM.x} y={CRM.y + CRM.h / 2 + 34} w={400} h={74} o={crmO} />);
  parts.push(
    <Card key="crm" x={CRM.x - CRM.w / 2} y={CRM.y - CRM.h / 2 + 30 * (1 - crmIn) + 24 * crmOut + bob(t, 3, 2.0, 3)} z={40} o={crmO} origin="50% 50%">
      <div style={{ width: CRM.w, height: CRM.h, boxSizing: "border-box", borderRadius: 24, background: C.white, boxShadow: "0 26px 50px rgba(150,106,62,.18), 0 3px 8px rgba(41,58,81,.06)", position: "relative", fontFamily: F }}>
        <div style={{ position: "absolute", left: 22, top: 22, display: "flex", gap: 7 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: 5, background: "#D3DBE5" }} />)}</div>
        <div style={{ position: "absolute", left: 76, top: 23, width: 96, height: 9, borderRadius: 4.5, background: "#D3DBE5" }} />
        <div style={{ position: "absolute", right: 22, top: 16, width: 22, height: 22, borderRadius: 11, background: C.slate }} />
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ position: "absolute", left: 22, top: 58 + k * 78, width: CRM.w - 44, height: 66, borderRadius: 14, background: "#F1F4F8" }}>
            <div style={{ opacity: row[k], transform: `translate3d(${((1 - row[k]) * -14).toFixed(2)}px, 0, 0)` }}>
              {k === 0 ? (
                <>
                  <div style={{ position: "absolute", left: 16, top: 9, color: C.navy, fontSize: 21, fontWeight: 700, letterSpacing: -0.2 }}>Customer</div>
                  <div style={{ position: "absolute", left: 16, top: 37, display: "flex", gap: 8 }}>
                    {["Qty 6", "Tomorrow"].map((s) => <span key={s} style={{ padding: "2px 10px", borderRadius: 11, background: C.slate, color: C.navy, fontSize: 16, fontWeight: 600 }}>{s}</span>)}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ position: "absolute", left: 16, top: 15, width: [0, 104, 86][k], height: 11, borderRadius: 5.5, background: C.navy, opacity: 0.22 }} />
                  <div style={{ position: "absolute", left: 16, top: 38, display: "flex", gap: 8 }}>{[52, 74].map((w, i) => <span key={i} style={{ width: w, height: 16, borderRadius: 8, background: C.slate }} />)}</div>
                </>
              )}
            </div>
          </div>
        ))}
        {rvO > 0.002 && (
          <div style={{ position: "absolute", right: 14, top: 50, opacity: rvO, transform: `rotate(${mix(-14, -5, rv).toFixed(2)}deg) scale(${mix(1.7, 1, rv).toFixed(4)})`, transformOrigin: "50% 50%", display: "flex", alignItems: "center", gap: 7, padding: "7px 13px 7px 10px", borderRadius: 16, background: C.navy, color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", boxShadow: "0 8px 18px rgba(41,58,81,.25)" }}>
            <svg width={18} height={18} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={C.sky} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>REVIEWED
          </div>
        )}
      </div>
    </Card>
  );

  // the chat bubbles: pop out of the phone, into the hub, into the CRM (as rows), and back
  for (let k = 0; k < 3; k++) {
    const tp = 0.3 + 0.12 * k, th = BUB_HUB_T(k), tc = BUB_CRM_T(k), tb = 10.72 + 0.08 * k;
    const h = E(t, th, th + 0.7), c = E(t, tc, tc + 0.6), b = E(t, tb, tb + 0.7), sk = E(t, 11.48, 11.76);
    const m = row[k];
    let x: number, y: number, s: number;
    if (t < th) { const q = bubPhone(k, t); x = q.x; y = q.y; s = q.s; }
    else if (t < tc) { const a = bubPhone(k, th), hb = bubHub(k, t), q = qb(a, hb, 70, h); x = q.x; y = q.y; s = mix(a.s, hb.s, h); }
    else if (t < tb) { const a = bubHub(k, t), z = bubCrm(k, t), q = qb(a, z, 50, c); x = q.x; y = q.y; s = mix(a.s, z.s, c); }
    else { const a = bubCrm(k, t), z = bubPhone(k, t), q = qb(a, z, 90, b); x = q.x; y = q.y; s = mix(a.s, z.s, b) * (1 - 0.4 * sk); }
    const pop = POP(t, tp), o = clamp((t - tp) / 0.1) * (1 - m) * (1 - sk);
    parts.push(<Card key={`b${k}`} x={x + 30 * sk} y={y - 32 + 10 * sk} s={s * mix(0.55, 1, pop)} z={t < th ? 39 : 47} o={o}><Bubble text={TEXTS[k]} /></Card>);
    if (t > th - 0.3 && t < th + 1.05) { const a = bubPhone(k, th), z = bubHub(k); trails.push(<Trail key={`bt${k}`} d={qPath({ x: a.x + 20, y: a.y }, { x: z.x + 20, y: z.y }, 70)} head={E(t, th - 0.25, th + 0.25)} p={h} arrive={th + 0.7} t={t} />); }
  }

  // the hub-to-CRM connector, with a node at each end
  const conn = E(t, 7.15, 7.6) * (1 - E(t, 10.6, 10.95)), connA = { x: HUB.x + HUB.w / 2, y: HUB.y - 40 + bob(t, 4, 0.5, 3) }, connB = { x: CRM.x - CRM.w / 2, y: CRM.y - 40 + bob(t, 3, 2.0, 3) };
  if (conn > 0.002) trails.push(
    <g key="conn" opacity={1 - E(t, 10.6, 10.95)}>
      <path d={qPath(connA, connB, 46)} fill="none" stroke={C.sky} strokeWidth={2.5} strokeLinecap="round" pathLength={1} strokeDasharray={`${E(t, 7.15, 7.6).toFixed(4)} 2`} />
      {/* data keeps flowing hub -> CRM: three dots, one every 0.6 s */}
      {E(t, 7.6, 7.8) > 0 && [0, 1, 2].map((i) => { const u = (((t - 7.6) / 1.8 + i / 3) % 1 + 1) % 1, q = qb(connA, connB, 46, u); return <circle key={i} cx={q.x} cy={q.y} r={4.5} fill={C.sky} opacity={E(t, 7.6, 7.8) * Math.sin(Math.PI * u)} />; })}
      <circle cx={connA.x} cy={connA.y} r={5} fill={C.sky} />
      {E(t, 7.5, 7.65) > 0 && <circle cx={connB.x} cy={connB.y} r={5 * E(t, 7.5, 7.65)} fill={C.sky} />}
    </g>
  );
  parts.push(<div key="trails" style={{ position: "absolute", left: 0, top: 0, zIndex: 34 }}><svg width={1080} height={1080} style={{ overflow: "visible", display: "block" }}>{trails}</svg></div>);

  // the delivery: a dotted route, the van with its bottles, a map pin
  const route = E(t, 7.2, 7.7) * (1 - E(t, 10.95, 11.3));
  if (route > 0.002) {
    const g0 = { x: VAN0.x - 30 * DIR.x, y: VAN0.y + 34 - 30 * DIR.y }, g1 = { x: VAN0.x + PIN_D * DIR.x, y: VAN0.y + 34 + PIN_D * DIR.y };
    parts.push(
      <div key="route" style={{ position: "absolute", left: 0, top: 0, zIndex: 18, opacity: route }}>
        <svg width={1080} height={1080} style={{ overflow: "visible", display: "block" }}>
          <path d={`M${g0.x} ${g0.y} L${g1.x} ${g1.y}`} fill="none" stroke={C.navy} strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" strokeDasharray="0.1 12" />
        </svg>
      </div>
    );
    const pin = E(t, 7.55, 7.85);
    parts.push(<Shadow key="pns" x={g1.x} y={g1.y} w={60} h={22} o={route * pin} z={19} />);
    parts.push(<Obj key="pin" x={g1.x} y={g1.y - 4 - 16 * (1 - pin)} z={22} o={route * pin}><Pin /></Obj>);
  }
  const vanO = E(t, 7.3, 7.6), drive = -40 * (1 - vanO) + 150 * E(t, 7.6, 9.3) + 1100 * E(t, 10.35, 11.05);
  if (vanO > 0.002 && t < 11.1) {
    const vx = VAN0.x + DIR.x * drive, vy = VAN0.y + DIR.y * drive;
    parts.push(<Shadow key="vns" x={vx + 4} y={vy + 40} w={190} h={60} o={vanO} z={19} />);
    parts.push(<Obj key="van" x={vx} y={vy} z={20} o={vanO}><Van /></Obj>);
  }

  // the result
  const num = E(t, 9.6, 10.0), numO = num * (1 - E(t, 10.95, 11.3));
  parts.push(
    <Card key="num" x={540} y={150 + bob(t, 3, 1.0, 3)} z={80} o={numO} s={mix(1.12, 1, num)} origin="50% 50%">
      <div style={{ transform: "translate(-50%, -50%)", whiteSpace: "nowrap", fontFamily: F, fontSize: 76, fontWeight: 700, letterSpacing: -2, color: C.navy }}>
        <span style={{ color: C.sky }}>2 hrs</span>/day saved
      </div>
    </Card>
  );
  return <>{parts}</>;
};

// ---------------------------------------------------------------- one format
export const Loop: React.FC<{ fmt: Fmt }> = ({ fmt }) => {
  const ok = useFont();
  const t = useCurrentFrame() / FPS;
  const [W, H] = SIZES[fmt];
  if (!ok) return <AbsoluteFill style={{ background: C.bg }} />;
  const ox = (W - 1080) / 2, oy = (H - 1080) / 2;
  const cam = 1 + 0.15 * E(t, 0, 10.6) * (1 - E(t, 10.6, 12));       // a slow push-in, eased back to the opening framing
  const wm = E(t, 9.95, 10.35) * (1 - E(t, 11.1, 11.4));
  const safeBottom = fmt === "story" ? 250 : 0;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: ox + 540 - 620, top: oy + 520 - 560, width: 1240, height: 1120, background: "radial-gradient(closest-side, rgba(56,200,255,.13), rgba(56,200,255,.05) 55%, rgba(56,200,255,0))" }} />
      <div style={{ position: "absolute", left: ox, top: oy, width: 1080, height: 1080, transformOrigin: "555px 575px", transform: `scale(${cam.toFixed(5)})`, willChange: "transform" }}>
        <Scene t={t} />
      </div>
      {wm > 0.002 && <Img src={staticFile("logo/kb-wordmark-navy.svg")} style={{ position: "absolute", right: 46, bottom: 44 + safeBottom, height: 30, opacity: wm }} />}
    </AbsoluteFill>
  );
};
