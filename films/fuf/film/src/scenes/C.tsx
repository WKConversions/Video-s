// Segment C (16.85-24.25 s): "Through exclusive gatherings and meaningful conversations, new ideas emerge,
// partnerships form, and opportunities grow." Tactile objects on the still cream table:
//  8  the Málaga photo shrinks into a framed print; an envelope with a wax seal arrives, the seal cracks, the
//     invitation card rises (Upcoming gatherings, Mon-Sun, FUF tag)          -> speed-matched push left
//  9  one bronze line draws two profiles leaning in (face/vase); the space between them fills into a cup
//                                                                            -> vertical push, napkin tossed in
// 10  a paper napkin; a fountain pen sketches a rocket and a rising arrow chart -> napkin flicked away
// 11  top-down: two coffee cups slide together and clink, ripples, the saucers lock with two bronze rings
//                                                                            -> cups lift away
// 12  a pop-up paper Málaga skyline folds up out of the table; ink floods from the cathedral tower (H3Ink)
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SERIF, SANS, H2, H3, H2Malaga, H3Ink, Mark, Photo, SerifLine, DrawLine, clamp, mix, ease, inout, spring, seeded } from "../kit";

// ---------- helpers ----------
const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.16  0 0 0 0 0.14  0 0 0 0 0.12  0.42 0 0 0 -0.12'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(GRAIN_SVG)}")`;
const PAPER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' seed='11' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.22  0 0 0 0 0.18  0 0 0 0 0.14  0.9 0 0 0 -0.38'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const PAPER = `url("data:image/svg+xml;utf8,${encodeURIComponent(PAPER_SVG)}")`;
const FIBRE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.02 0.6' numOctaves='2' seed='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.3  0 0 0 0 0.24  0 0 0 0 0.18  0.3 0 0 0 -0.08'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const FIBRE = `url("data:image/svg+xml;utf8,${encodeURIComponent(FIBRE_SVG)}")`;
type P2 = [number, number];
const pl = (P: P2[]) => "M" + P.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
const smooth = (P: P2[], close = false) => {
  let d = `M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return close ? d + " Z" : d;
};
const lenOf = (P: P2[]) => P.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - P[i][0], p[1] - P[i][1]), 0);
const pointAt = (P: P2[], f: number): P2 => {
  const L = lenOf(P) * clamp(f); let acc = 0;
  for (let i = 1; i < P.length; i++) {
    const s = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
    if (acc + s >= L) { const k = s ? (L - acc) / s : 0; return [mix(P[i - 1][0], P[i][0], k), mix(P[i - 1][1], P[i][1], k)]; }
    acc += s;
  }
  return P[P.length - 1];
};
const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

// ======================================================================================================
// SHOT 8: the print, the envelope, the seal, the invitation (16.85-18.70)
// ======================================================================================================
const SEAL_RIM = (() => {
  const n = 22, R = 64;
  return Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2, r = (i % 2 ? R : R - 7) + seeded(i) * 2.5; return `${(Math.cos(a) * r + 70).toFixed(1)},${(Math.sin(a) * r + 70).toFixed(1)}`; }).join(" ");
})();
const Seal: React.FC = () => (
  <div style={{ ...abs, width: 140, height: 140 }}>
    <svg width={140} height={140} style={abs}>
      <defs>
        <radialGradient id="waxC" cx="38%" cy="32%" r="75%"><stop offset="0" stopColor="#B49477" /><stop offset="0.45" stopColor="#8F765E" /><stop offset="1" stopColor="#5E4B3A" /></radialGradient>
      </defs>
      <polygon points={SEAL_RIM} fill="url(#waxC)" />
      <circle cx={70} cy={70} r={46} fill="none" stroke="#6E5A47" strokeWidth={3} opacity={0.7} />
      <circle cx={70} cy={71.5} r={46} fill="none" stroke="#C7AD92" strokeWidth={1.2} opacity={0.6} />
      <ellipse cx={50} cy={42} rx={20} ry={9} fill="#FFFFFF" opacity={0.16} transform="rotate(-30 50 42)" />
    </svg>
    <div style={{ ...abs, transform: "translate(34px, 34px)", opacity: 0.92 }}><Mark size={72} tone="cream" /></div>
  </div>
);

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const Invitation: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ ...abs, width: 620, height: 400, borderRadius: 8, overflow: "hidden", background: `${GRAIN}, linear-gradient(168deg, #FFFEFB 0%, #F8F3EC 70%, #F1EAE0 100%)`, boxShadow: "0 2px 4px rgba(39,38,36,0.08), 0 24px 50px -24px rgba(39,38,36,0.4)" }}>
    <div style={{ position: "absolute", left: 14, top: 14, right: 14, bottom: 14, border: "1.5px solid rgba(143,118,94,0.5)", borderRadius: 5 }} />
    <div style={{ position: "absolute", left: 20, top: 20, right: 20, bottom: 20, border: "1px solid rgba(143,118,94,0.22)", borderRadius: 3 }} />
    <div style={{ position: "absolute", left: 46, top: 44, fontFamily: SANS, fontWeight: 700, fontSize: 16, letterSpacing: "0.24em", color: F.bronze }}>UPCOMING GATHERINGS</div>
    <div style={{ position: "absolute", left: 520, top: 30 }}><Mark size={56} tone="ink" /></div>
    <div style={{ position: "absolute", left: 44, top: 72, fontFamily: SERIF, fontSize: 48, letterSpacing: "-0.02em", color: F.ink, whiteSpace: "pre" }}>Dates to be <span style={{ fontStyle: "italic", color: F.bronze }}>announced.</span></div>
    <div style={{ position: "absolute", left: 46, top: 158, width: 528, height: 1, background: "rgba(39,38,36,0.14)" }} />
    {DAYS.map((d, i) => {
      const p = spring(t, 18.0 + i * 0.045, 0.42, 0.8);
      const tag = i === 3 ? spring(t, 18.33, 0.4, 0.65) : 0;
      return (
        <div key={d} style={{ position: "absolute", left: 46 + i * 77, top: 176, width: 68, height: 150, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 26}px)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 13, letterSpacing: "0.16em", color: F.muted, textAlign: "center" }}>{d}</div>
          <div style={{ position: "absolute", left: 0, top: 26, width: 68, height: 104, borderRadius: 12, background: i === 3 ? `linear-gradient(180deg, #EEE5DA, #E4D8C9)` : "linear-gradient(180deg, #F3EEE7, #ECE5DC)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 2px rgba(39,38,36,0.06)" }} />
          {i === 3 && (
            <div style={{ position: "absolute", left: 6, top: 58, width: 56, height: 40, borderRadius: 20, background: "linear-gradient(180deg, #A0866C, #826A53)", boxShadow: "0 6px 12px -4px rgba(39,38,36,0.5)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${tag})`, fontFamily: SANS, fontWeight: 800, fontSize: 15, letterSpacing: "0.1em", color: F.cream }}>FUF</div>
          )}
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 46, top: 346, fontFamily: SANS, fontWeight: 700, fontSize: 13, letterSpacing: "0.22em", color: F.muted }}>MÁLAGA, SPAIN · DATES TO BE ANNOUNCED</div>
  </div>
);

const Shot8: React.FC<{ t: number }> = ({ t }) => {
  const k = t - H2;
  const p = spring(t, 17.1, 0.8, 1);
  const ex = inout((t - 18.38) / 0.34), exX = -2150 * ex;
  // the photo layer, shrinking into a framed print
  const s = mix(1, 0.4, p), cx = mix(960, 500, p) + exX, cy = mix(540, 590, p), rot = mix(0, -4, p);
  const iX = mix(0, 150, p), iY = mix(0, 90, p), mX = iX - 62 * p, mY = iY - 62 * p;
  const z = 1.12 + k * 0.05 + 0.34 * Math.max(0, t - 17.1);
  // the envelope
  const e = spring(t, 17.16, 0.62, 0.85);
  const ecx = mix(2500, 1390, e) - 132 * (t - 17.5) + exX, ecy = mix(700, 650, e), erot = mix(16, 3, e);
  const crack = clamp((t - 17.7) / 0.18);
  const flap = spring(t, 17.76, 0.5, 0.85) * 180;
  const rise = spring(t, 17.9, 0.6, 0.8);
  const flapEl = (open: boolean) => (
    <div style={{ ...abs, width: 700, height: 250, transformOrigin: "50% 0%", transform: `perspective(1600px) rotateX(${flap}deg)` }}>
      <div style={{ ...abs, width: 700, height: 250, clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: open ? `${PAPER}, linear-gradient(0deg, #F2EBE1, #E3D8CA)` : `${PAPER}, linear-gradient(180deg, #E7DDD0 0%, #DCCFBF 100%)` }} />
    </div>
  );
  return (
    <>
      {/* framed print */}
      <div style={{ ...abs, width: 1920, height: 1080, transform: `translate(${cx - 960}px, ${cy - 540}px) rotate(${rot}deg) scale(${s})`, filter: p > 0.02 ? `drop-shadow(0 ${(26 * p) / s}px ${(34 * p) / s}px rgba(39,38,36,${0.3 * p}))` : undefined }}>
        <div style={{ ...abs, width: 1920, height: 1080, clipPath: `inset(${mY}px ${mX}px round ${(10 * p) / s}px)`, background: `${GRAIN}, linear-gradient(160deg, #FFFEFB, #F1EAE0)`, opacity: clamp(p * 4) }} />
        <div style={{ ...abs, width: 1920, height: 1080, clipPath: `inset(${iY}px ${iX}px round ${(4 * p) / s}px)` }}>
          <div style={{ ...abs, transform: `translateX(${-k * 60}px)` }}><Photo src="hero-malaga.jpg" w={2000} h={1080} z={z} fx={0.7} fy={0.6} /></div>
          <div style={{ ...abs, width: 1920, height: 1080, boxShadow: `inset 0 0 ${80 * p}px rgba(39,38,36,${0.25 * p})` }} />
        </div>
      </div>
      {/* envelope */}
      {e > 0.001 && (
        <div style={{ ...abs, width: 700, height: 440, transform: `translate(${ecx - 350}px, ${ecy - 220}px) rotate(${erot}deg)` }}>
          <div style={{ ...abs, width: 700, height: 440, borderRadius: 10, background: `${PAPER}, linear-gradient(180deg, #E2D7C9, #D6C9B8)`, boxShadow: "0 3px 8px rgba(39,38,36,0.1), 0 50px 90px -40px rgba(39,38,36,0.45)" }} />
          {flap > 90 && flapEl(true)}
          <div style={{ ...abs, transform: `translate(40px, ${20 - rise * 350}px) rotate(${-rise * 3}deg)` }}><Invitation t={t} /></div>
          <div style={{ ...abs, width: 700, height: 440, filter: "drop-shadow(0 -2px 3px rgba(39,38,36,0.12))" }}>
            <div style={{ ...abs, width: 700, height: 440, borderRadius: 10, clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)", background: `${PAPER}, linear-gradient(175deg, #EEE6DA 0%, #E5DACC 100%)` }} />
          </div>
          <svg width={700} height={440} style={abs}>
            <path d="M2 2 L350 229 L698 2" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} />
            <path d="M6 434 L300 300 M694 434 L400 300" fill="none" stroke="rgba(39,38,36,0.07)" strokeWidth={2} />
          </svg>
          {flap <= 90 && <div style={{ ...abs, filter: "drop-shadow(0 5px 6px rgba(39,38,36,0.18))" }}>{flapEl(false)}</div>}
          {/* the wax seal on the flap's tip: it cracks into two halves on "gatherings" */}
          {[0, 1].map((h) => {
            const dir = h ? 1 : -1;
            const clip = h ? "polygon(52% 0, 100% 0, 100% 100%, 50% 100%, 55% 82%, 47% 64%, 56% 45%, 46% 24%)" : "polygon(0 0, 52% 0, 46% 24%, 56% 45%, 47% 64%, 55% 82%, 50% 100%, 0 100%)";
            const fall = clamp((t - 17.74) / 0.4);
            return (
              <div key={h} style={{ ...abs, width: 140, height: 140, clipPath: crack > 0 ? clip : undefined, opacity: 1 - clamp((t - 17.95) / 0.2),
                transform: `translate(${280 + dir * crack * 16 + dir * fall * 40}px, ${170 + fall * fall * 160}px) rotate(${dir * (crack * 10 + fall * 30)}deg)` }}>
                <Seal />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

// ======================================================================================================
// SHOT 9: two profiles drawn by one bronze line, leaning in; the space between becomes a cup (18.38-20.32)
// ======================================================================================================
const PROFILE: P2[] = ([
  [240, 690], [300, 712], [360, 736], [415, 752], [450, 760], [482, 748], [510, 765], [550, 800], [588, 838], [610, 832],
  [622, 806], [638, 800], [658, 818], [676, 806], [690, 803], [706, 816], [728, 800], [746, 792], [774, 808], [802, 800],
  [826, 770], [850, 742], [900, 735], [950, 738],
] as P2[]).map(([y, x]) => [x, y] as P2);
const BASE_Y = 950;
const leftProfile = (off: number): P2[] => PROFILE.map(([x, y]) => [x - off, y] as P2);
const rightProfile = (off: number): P2[] => PROFILE.map(([x, y]) => [1920 - x + off, y] as P2);

const Shot9: React.FC<{ t: number }> = ({ t }) => {
  const en = inout((t - 18.38) / 0.34), ex = inout((t - 19.98) / 0.34);
  const gx = 1920 * (1 - en), gy = -1250 * ex;
  const off = 200 * (20.12 - t); // the two heads lean in, over 3 px per frame, the whole shot
  const pan = 90 * (t - 18.4); // the photo glides inside each head
  const L = leftProfile(off), R = rightProfile(off);
  const line: P2[] = [...L, [L[L.length - 1][0] + 40, BASE_Y], [960, BASE_Y + 2], [R[R.length - 1][0] - 40, BASE_Y], ...R.slice().reverse()];
  const draw = ease((t - 18.42) / 0.75);
  const cupD = smooth([...L, [L[L.length - 1][0] + 40, BASE_Y], [R[R.length - 1][0] - 40, BASE_Y], ...R.slice().reverse()], true);
  const fill = ease((t - 19.0) / 0.55);
  const level = mix(BASE_Y + 10, 225, fill);
  const wave: P2[] = Array.from({ length: 67 }, (_, i) => { const x = 300 + i * 20; return [x, level + Math.sin(x / 46 + t * 9) * 7 * (1 - fill * 0.6)] as P2; });
  const liquid = pl(wave) + ` L1620 ${BASE_Y + 40} L300 ${BASE_Y + 40} Z`;
  const back: P2[] = [[540, BASE_Y], [490, 800], [454, 620], [450, 450], [482, 324], [556, 240], [632, 212]];
  const headL = smooth([...PROFILE, ...back] as P2[], true);
  const headR = smooth([...PROFILE, ...back].map(([x, y]) => [1920 - x, y] as P2), true);
  const faceOp = clamp((t - 18.5) / 0.3);
  return (
    <div style={{ ...abs, width: 1920, height: 1080, transform: `translate(${gx}px, ${gy}px)` }}>
      {/* the two heads: the Málaga photo inside each profile, leaning in */}
      {[0, 1].map((h) => (
        <div key={h} style={{ ...abs, width: 1920, height: 1080, transform: `translateX(${h ? off : -off}px)`, opacity: faceOp }}>
          <div style={{ ...abs, width: 1920, height: 1080, clipPath: `path('${h ? headR : headL}')` }}>
            <div style={{ ...abs, transform: `translateX(${h ? 920 - pan : 240 + pan}px) translateY(200px)` }}><Photo src={h ? "hero-malaga.jpg" : "malaga-skyline-detail.jpg"} w={760} h={800} z={1.15} fx={h ? 0.3 : 0.6} fy={0.5} /></div>
            <div style={{ ...abs, width: 1920, height: 1080, background: h ? "linear-gradient(270deg, rgba(247,244,239,0.75) 500px, rgba(247,244,239,0) 760px)" : "linear-gradient(90deg, rgba(247,244,239,0.75) 500px, rgba(247,244,239,0) 760px)" }} />
          </div>
        </div>
      ))}
      <svg width={1920} height={1080} style={abs}>
        <defs>
          <clipPath id="c9cup"><path d={cupD} /></clipPath>
          <linearGradient id="c9liq" x1="0" x2="1" y1="0" y2="0"><stop offset="0.25" stopColor="#6E5A47" /><stop offset="0.42" stopColor="#B49477" /><stop offset="0.55" stopColor="#8F765E" /><stop offset="0.75" stopColor="#6A5644" /></linearGradient>
        </defs>
        <g clipPath="url(#c9cup)">
          <path d={liquid} fill="url(#c9liq)" />
          <path d={pl(wave)} fill="none" stroke="#D9C3A8" strokeWidth={3} opacity={0.7} />
        </g>
      </svg>
      <DrawLine d={smooth(line)} p={draw} width={6} />
      {/* a saucer line under the cup once it is full */}
      <DrawLine d={`M${960 - 330} ${BASE_Y + 34} Q960 ${BASE_Y + 64} ${960 + 330} ${BASE_Y + 34}`} p={ease((t - 19.45) / 0.4)} width={5} color={F.tan} />
      <SerifLine t={t} x={960} y={70} size={92} align="center" words={[{ text: "meaningful", at: 18.5 }, { text: "conversations.", at: 18.94, it: true }]} />
    </div>
  );
};

// ======================================================================================================
// SHOT 10: the napkin sketch (19.98-21.65)
// ======================================================================================================
const jit = (P: P2[], s: number): P2[] => P.map(([x, y], i) => [x + (seeded(i * 3.1 + s) - 0.5) * 5, y + (seeded(i * 7.7 + s) - 0.5) * 5] as P2);
const circ = (cx: number, cy: number, r: number, n = 16): P2[] => Array.from({ length: n + 2 }, (_, i) => { const a = (i / n) * Math.PI * 2 - 1.2; return [cx + Math.cos(a) * r * (1 + 0.04 * Math.sin(i)), cy + Math.sin(a) * r] as P2; });
const STROKES: { P: P2[]; from: number; to: number }[] = [
  { P: jit([[226, 486], [216, 400], [222, 316], [246, 236], [262, 198], [280, 236], [304, 316], [310, 400], [298, 486], [226, 486]], 1), from: 20.14, to: 20.36 },
  { P: jit(circ(262, 330, 30), 2), from: 20.36, to: 20.44 },
  { P: jit([[224, 420], [180, 500], [222, 488]], 3), from: 20.44, to: 20.5 },
  { P: jit([[302, 420], [346, 500], [300, 488]], 4), from: 20.5, to: 20.56 },
  { P: jit([[240, 500], [246, 552], [262, 520], [270, 566], [284, 500]], 5), from: 20.56, to: 20.66 },
  { P: jit([[400, 230], [404, 520], [640, 516]], 6), from: 20.7, to: 20.84 },
  { P: jit([[420, 492], [468, 452], [506, 470], [552, 392], [586, 404], [622, 300]], 7), from: 20.84, to: 21.02 },
  { P: jit([[592, 318], [624, 296], [632, 334]], 8), from: 21.02, to: 21.08 },
];

const Pen: React.FC = () => (
  <div style={{ ...abs, width: 30, height: 470, transform: "translate(-15px, -470px)", transformOrigin: "50% 100%" }}>
    <div style={{ position: "absolute", left: 4, top: 0, width: 22, height: 300, borderRadius: "11px 11px 4px 4px", background: "linear-gradient(90deg, #1A1918 0%, #4A4642 30%, #2B2A28 55%, #121110 100%)" }} />
    <div style={{ position: "absolute", left: 3, top: 300, width: 24, height: 26, background: "linear-gradient(90deg, #6E5A47, #C7AD92 35%, #8F765E 65%, #5E4B3A)" }} />
    <div style={{ position: "absolute", left: 5, top: 326, width: 20, height: 84, borderRadius: "0 0 8px 8px", background: "linear-gradient(90deg, #1A1918 0%, #45413D 35%, #22211F 100%)" }} />
    <div style={{ position: "absolute", left: 7, top: 408, width: 16, height: 62, clipPath: "polygon(0 0, 100% 0, 54% 100%, 46% 100%)", background: "linear-gradient(90deg, #8F765E, #E2CDB3 45%, #A88C70 60%, #6E5A47)" }} />
    <div style={{ position: "absolute", left: 21, top: 30, width: 4, height: 200, borderRadius: 2, background: "linear-gradient(90deg, #C7AD92, #8F765E)" }} />
  </div>
);

const Shot10: React.FC<{ t: number }> = ({ t }) => {
  const en = spring(t, 19.98, 0.75, 0.86);
  const ex = inout((t - 21.2) / 0.28); // the flick clears the frame before the cups slide in (they start at 21.44)
  const cx = 500 + 138 * (t - 20.0) - 1500 * ex, cy = mix(1560, 560, en) - 260 * ex, rot = mix(-26, -5, en) - 30 * ex; // flicked up-left, clear of the incoming type
  // the pen: where the ink is now
  let tip: P2 = STROKES[0].P[0], active = false;
  for (const s of STROKES) { if (t >= s.from) { tip = pointAt(s.P, (t - s.from) / (s.to - s.from)); active = t <= s.to + 0.04; } }
  const penIn = spring(t, 20.04, 0.45, 0.9), penOut = clamp((t - 21.12) / 0.3);
  const lift = active ? 0 : 1;
  return (
    <>
      <div style={{ ...abs, width: 680, height: 680, transform: `translate(${cx - 340}px, ${cy - 340}px) rotate(${rot}deg)` }}>
        <div style={{ ...abs, width: 680, height: 680, borderRadius: 6, background: `${PAPER}, radial-gradient(circle at 30% 24%, #FFFFFF 0%, #F7F2EB 60%, #EDE5DA 100%)`, boxShadow: "0 3px 8px rgba(39,38,36,0.08), 0 60px 100px -50px rgba(39,38,36,0.5)" }} />
        {/* fold creases and the embossed border */}
        <div style={{ ...abs, width: 340, height: 680, background: "linear-gradient(90deg, rgba(39,38,36,0) 60%, rgba(39,38,36,0.045) 100%)" }} />
        <div style={{ ...abs, width: 680, height: 340, background: "linear-gradient(180deg, rgba(255,255,255,0) 50%, rgba(255,255,255,0.5) 100%)" }} />
        <div style={{ position: "absolute", left: 339, top: 0, width: 2, height: 680, background: "linear-gradient(90deg, rgba(39,38,36,0.07), rgba(255,255,255,0.7))" }} />
        <div style={{ position: "absolute", left: 0, top: 339, width: 680, height: 2, background: "linear-gradient(180deg, rgba(39,38,36,0.07), rgba(255,255,255,0.7))" }} />
        <div style={{ position: "absolute", left: 28, top: 28, width: 620, height: 620, border: "3px dotted rgba(143,118,94,0.3)", borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 40, top: 40, width: 596, height: 596, border: "1px solid rgba(143,118,94,0.22)", borderRadius: 2 }} />
        <svg width={680} height={680} style={abs}>
          {STROKES.map((s, i) => (
            <path key={i} d={pl(s.P)} pathLength={1} fill="none" stroke={F.ink} strokeOpacity={0.9} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - clamp((t - s.from) / (s.to - s.from))} />
          ))}
        </svg>
        {/* the fountain pen rides the ink */}
        {penIn > 0.001 && penOut < 1 && (
          <div style={{ ...abs, transform: `translate(${tip[0] - (1 - penIn) * 500 - penOut * 600 - lift * 8}px, ${tip[1] - (1 - penIn) * 300 - penOut * 200 - lift * 10}px) rotate(-24deg) scale(0.8)` }}>
            <div style={{ ...abs, transform: "translate(16px, 26px)", opacity: 0.18, filter: "blur(6px)" }}><Pen /></div>
            <Pen />
          </div>
        )}
      </div>
      <SerifLine t={t} x={1200} y={250} size={128} words={[{ text: "new", at: 20.14 }]} out={21.02} />
      <SerifLine t={t} x={1200} y={392} size={128} words={[{ text: "ideas", at: 20.34, it: true }]} out={21.05} />
      <SerifLine t={t} x={1200} y={534} size={128} words={[{ text: "emerge.", at: 20.72 }]} out={21.08} />
    </>
  );
};

// ======================================================================================================
// SHOT 11: two coffee cups, top down: slide, clink, ripple, the saucers lock (21.36-22.95)
// ======================================================================================================
const Cup: React.FC<{ t: number; side: -1 | 1; ripple: number }> = ({ t, side, ripple }) => (
  <div style={{ ...abs, width: 400, height: 400, transform: "translate(-200px, -200px)" }}>
    {/* saucer */}
    <div style={{ ...abs, width: 400, height: 400, borderRadius: "50%", background: `${PAPER}, radial-gradient(circle at 38% 32%, #FFFFFF 0%, #F7F2EB 45%, #E6DDD1 80%, #D3C7B7 100%)`, boxShadow: "0 4px 10px rgba(39,38,36,0.08), 0 40px 70px -30px rgba(39,38,36,0.45)" }} />
    <div style={{ position: "absolute", left: 14, top: 14, width: 372, height: 372, borderRadius: "50%", border: "2px solid rgba(143,118,94,0.35)" }} />
    <div style={{ position: "absolute", left: 58, top: 58, width: 284, height: 284, borderRadius: "50%", boxShadow: "inset 0 6px 14px rgba(39,38,36,0.1), inset 0 -2px 4px rgba(255,255,255,0.8)" }} />
    {/* cup, nudged toward the other cup */}
    <div style={{ ...abs, transform: `translate(${side * 80}px, 0px)` }}>
      <div style={{ position: "absolute", left: side > 0 ? 40 : 268, top: 180, width: 92, height: 40, borderRadius: 20, background: "linear-gradient(180deg, #FFFFFF, #E2D8CB)", boxShadow: "0 8px 14px -6px rgba(39,38,36,0.4)", transform: `rotate(${side * -18}deg)` }} />
      <div style={{ position: "absolute", left: 75, top: 75, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #F3EEE7 55%, #DDD3C6 100%)", boxShadow: "0 18px 30px -12px rgba(39,38,36,0.45), 0 2px 4px rgba(39,38,36,0.12)" }} />
      <div style={{ position: "absolute", left: 102, top: 102, width: 196, height: 196, borderRadius: "50%", overflow: "hidden", background: `${FIBRE}, radial-gradient(circle at 44% 40%, #8C6646 0%, #654630 45%, #3E2A1C 100%)`, boxShadow: "inset 0 8px 16px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 6, top: 6, width: 184, height: 184, borderRadius: "50%", border: "7px solid rgba(201,160,118,0.5)", filter: "blur(2px)" }} />
        {[0, 1, 2].map((i) => {
          const q = clamp((ripple - i * 0.09) / 0.55), r = mix(6, 190, ease(q));
          const ox = 98 - side * 70;
          return q > 0 && q < 1 ? <div key={i} style={{ position: "absolute", left: 0, top: 0, width: r * 2, height: r * 2, borderRadius: "50%", border: `${mix(5, 1.5, q)}px solid rgba(230,200,165,${0.65 * (1 - q)})`, transform: `translate(${ox - r}px, ${98 - r}px)` }} /> : null;
        })}
        <div style={{ position: "absolute", left: 40, top: 34, width: 70, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.3), rgba(255,255,255,0))", transform: "rotate(-28deg)" }} />
      </div>
    </div>
  </div>
);

const Shot11: React.FC<{ t: number }> = ({ t }) => {
  const q = clamp((t - 21.44) / 0.46);   // starts once the napkin has gone, still clinks at 21.9
  const f = q * (2 - q) * 0.72 + q * 0.28; // arrives with some speed: the clink
  const u = t - 21.9;
  const recoil = u > 0 ? 18 * Math.exp(-u * 7) * Math.sin(u * 26) : 0;
  const sx = mix(1250, 205, f) + recoil; // each saucer's distance from the centre
  const lock = spring(t, 22.0, 0.42, 0.65);
  const rot = 0; // a steady glide up instead of a slow turn (a slow turn steps on the pixel grid)
  const drift = -150 * Math.max(0, t - 21.98);
  const lift = inout((t - 22.62) / 0.36);
  const sc = 1 - lift * 0.55, gy = -lift * 700;
  const ringD = (cx: number) => `M${cx + 214} 520 A214 214 0 1 1 ${cx + 214} 519.9`;
  const ringP = ease((t - 22.02) / 0.42);
  return (
    <>
      <div style={{ ...abs, width: 1920, height: 1080, transformOrigin: "960px 520px", transform: `translateY(${gy + drift}px) rotate(${rot}deg) scale(${sc * (1 + (lock - 1) * 0 + Math.sin(clamp((t - 22.0) / 0.25) * Math.PI) * 0.015)})`, opacity: 1 - clamp((lift - 0.6) / 0.4) }}>
        <div style={{ ...abs, transform: `translate(${960 - sx}px, 520px)` }}><Cup t={t} side={1} ripple={u} /></div>
        <div style={{ ...abs, transform: `translate(${960 + sx}px, 520px)` }}><Cup t={t} side={-1} ripple={u} /></div>
        <DrawLine d={ringD(960 - 205)} p={ringP} width={6} />
        <DrawLine d={ringD(960 + 205)} p={ringP} width={6} />
      </div>
      {/* the type slides together like the cups */}
      <div style={{ ...abs, width: 1920, top: 846, display: "flex", justifyContent: "center", gap: 28, fontFamily: SERIF, fontSize: 104, letterSpacing: "-0.02em", lineHeight: 1.1, whiteSpace: "pre", transform: `translateY(${-lift * 400}px)`, opacity: 1 - clamp(lift * 1.8) }}>
        {[{ s: "partnerships", at: 21.57, d: -1, it: false }, { s: "form.", at: 21.9, d: 1, it: true }].map((wd) => {
          const p = spring(t, wd.at - 0.12, 0.5, 0.85);
          return <span key={wd.s} style={{ display: "inline-block", transform: `translateX(${wd.d * (1 - p) * 760}px)`, opacity: clamp(p * 1.6), fontStyle: wd.it ? "italic" : "normal", color: wd.it ? F.bronze : F.ink }}>{wd.s}</span>;
        })}
      </div>
    </>
  );
};

// ======================================================================================================
// SHOT 12: a pop-up paper Málaga skyline; ink floods from the cathedral tower (22.62-24.25)
// ======================================================================================================
const W12 = 1560;
const up = (H: number, P: P2[]) => P.map(([x, y]) => [x, H - y] as P2);
const castle = (() => {
  const P: P2[] = [[0, 0], [0, 110], [120, 140], [250, 200], [360, 246]];
  for (let x = 380; x < 640; x += 24) { const tw = x === 452 || x === 572 ? 44 : 0; P.push([x, 262 + tw], [x + 12, 262 + tw], [x + 12, 276 + tw], [x + 24, 276 + tw]); }
  P.push([660, 250], [800, 205], [960, 172], [1100, 190], [1240, 150], [1400, 118], [1560, 96], [1560, 0]);
  return P;
})();
const BLOCKS = Array.from({ length: 17 }, (_, i) => ({ x: i * 92 + (seeded(i) - 0.5) * 20, w: 70 + seeded(i + 40) * 40, h: 90 + seeded(i + 9) * 120 }));
const CATH: P2[] = [
  [470, 0], [470, 200], [500, 214], [500, 236], [520, 236], [520, 300], [530, 300], [530, 360], [540, 360], [540, 410], [548, 410], [552, 430], [556, 446],
  [560, 470], [564, 446], [568, 430], [572, 410], [580, 410], [580, 360], [590, 360], [590, 300], [600, 300], [600, 236], [640, 236], [652, 262], [690, 284], [728, 262], [740, 236],
  [760, 236], [760, 286], [850, 286], [850, 236], [880, 214], [880, 200], [910, 200], [910, 0],
];
const TOWER = { x: 560, y: 470 };

const Layer: React.FC<{ t: number; at: number; H: number; resp?: number; damp?: number; children: React.ReactNode }> = ({ t, at, H, resp = 0.6, damp = 0.8, children }) => {
  const p = spring(t, at, resp, damp);
  return (
    <div style={{ ...abs, width: W12, height: H, transform: `translateY(${-H}px) perspective(1800px) rotateX(${(1 - p) * 90}deg)`, transformOrigin: "50% 100%", filter: `brightness(${mix(0.78, 1, clamp(p))})`, opacity: p > 0.02 ? 1 : 0 }}>
      <svg width={W12} height={H} style={{ ...abs, overflow: "visible", filter: "drop-shadow(0 6px 6px rgba(39,38,36,0.18))" }}>{children}</svg>
    </div>
  );
};

const Shot12: React.FC<{ t: number }> = ({ t }) => {
  const enter = inout((t - 22.6) / 0.42);
  const gx = -70 + 138 * (t - 22.62), gy = 760 * (1 - enter);
  const fold = 830; // the fold line (screen y) where the paper stands up
  const back = spring(t, 22.7, 0.6, 0.9);
  const sun = ease((t - 22.86) / 0.7);
  const flood = clamp((t - 23.55) / 0.45);
  // the spire tip on screen, through the cathedral layer's live spring, rotateX and perspective (Layer below)
  const cp = spring(t, 23.28, 0.62, 0.72), th = ((1 - cp) * Math.PI) / 2, pw = 1 + (TOWER.y * Math.sin(th)) / 1800;
  const fx = gx + 960 + (TOWER.x - W12 / 2) / pw, fy = gy + fold - (TOWER.y * Math.cos(th)) / pw + 6;
  const maxD = Math.max(Math.hypot(fx, fy), Math.hypot(1920 - fx, fy), Math.hypot(fx, 1080 - fy), Math.hypot(1920 - fx, 1080 - fy));
  const r = maxD * 1.02 * Math.pow(flood, 1.7);
  const X0 = 960 - W12 / 2;
  return (
    <>
      <div style={{ ...abs, width: 1920, height: 1080, transform: `translate(${gx}px, ${gy}px)` }}>
        {/* the base page lying on the table */}
        <div style={{ ...abs, width: W12, height: 330, transform: `translate(${X0}px, ${fold}px) perspective(1100px) rotateX(64deg)`, transformOrigin: "50% 0%", borderRadius: 8, background: `${PAPER}, linear-gradient(180deg, #E6DCCF, #D9CCBB)`, boxShadow: "0 40px 80px -30px rgba(39,38,36,0.45)" }} />
        <div style={{ ...abs, transform: `translate(${X0}px, ${fold}px)` }}>
          {/* the back page: a paper sunset sky with the sun rising */}
          <div style={{ ...abs, width: W12, height: 560, transform: `translateY(-560px) perspective(1800px) rotateX(${(1 - back) * 90}deg)`, transformOrigin: "50% 100%", borderRadius: "8px 8px 0 0", overflow: "hidden", background: `${PAPER}, linear-gradient(180deg, #F6EBDD 0%, #F2D9BE 60%, #EEC9A2 100%)`, boxShadow: "0 -1px 0 rgba(255,255,255,0.6) inset" }}>
            <div style={{ position: "absolute", left: 1000, top: 0, width: 240, height: 240, borderRadius: "50%", transform: `translateY(${mix(560, 150, sun)}px)`, background: `${GRAIN}, radial-gradient(circle at 40% 35%, #F3CBA0, ${F.sunset} 60%, #DFA676)`, boxShadow: "0 8px 16px -6px rgba(143,118,94,0.5)" }} />
          </div>
          <Layer t={t} at={22.8} H={330}>
            <path d={pl(up(330, castle)) + " Z"} fill={F.tan} />
            <path d={pl(up(330, castle))} fill="none" stroke="#A8937C" strokeWidth={2} />
          </Layer>
          <Layer t={t} at={22.92} H={240}>
            {BLOCKS.map((b, i) => (
              <g key={i}>
                <rect x={b.x} y={240 - b.h} width={b.w} height={b.h} fill={i % 2 ? F.sand2 : "#D5CBBE"} />
                {Array.from({ length: Math.floor(b.h / 34) }, (_, j) => <rect key={j} x={b.x + 12} y={240 - b.h + 14 + j * 34} width={b.w - 24} height={10} fill="#C4B7A6" opacity={0.8} />)}
              </g>
            ))}
          </Layer>
          <Layer t={t} at={23.28} H={480} resp={0.62} damp={0.72}>
            <path d={pl(up(480, CATH)) + " Z"} fill="#F1EAE0" />
            <path d={pl(up(480, CATH)) + " Z"} fill="none" stroke="#BBA791" strokeWidth={2.5} />
            {[540, 614, 688, 762, 836].map((x, i) => <path key={i} d={`M${x} ${480 - 20} L${x} ${480 - 120} Q${x + 18} ${480 - 150} ${x + 36} ${480 - 120} L${x + 36} ${480 - 20} Z`} fill="#DCCFBF" />)}
            {[300, 340, 380].map((y, i) => <rect key={i} x={548} y={480 - y} width={24} height={30} rx={12} fill="#DCCFBF" />)}
            <rect x={760} y={480 - 286} width={90} height={8} fill="#DCCFBF" />
            <circle cx={690} cy={480 - 230} r={26} fill="none" stroke="#BBA791" strokeWidth={3} />
          </Layer>
          <Layer t={t} at={23.04} H={300}>
            {/* La Farola lighthouse and palms */}
            <path d="M1290 300 L1300 80 L1340 80 L1350 300 Z" fill="#F4EEE6" stroke="#BBA791" strokeWidth={2} />
            <rect x={1294} y={56} width={52} height={26} fill={F.bronze} />
            <path d="M1300 56 L1320 30 L1340 56 Z" fill="#6E5A47" />
            {[[150, 160], [270, 200], [1060, 170], [1170, 140]].map(([x, h], i) => (
              <g key={i}>
                <path d={`M${x} 300 Q${x + 14} ${300 - h / 2} ${x + 6} ${300 - h}`} fill="none" stroke={F.bronze} strokeWidth={9} strokeLinecap="round" />
                {[-60, -20, 20, 60, 100, 150].map((a, j) => { const rad = ((a - 90) * Math.PI) / 180, L = 58; const ex = x + 6 + Math.cos(rad) * L, ey = 300 - h + Math.sin(rad) * L * 0.8 + 18; return <path key={j} d={`M${x + 6} ${300 - h} Q${(x + 6 + ex) / 2} ${300 - h - 22} ${ex} ${ey}`} fill="none" stroke="#7C6651" strokeWidth={8} strokeLinecap="round" />; })}
              </g>
            ))}
            <path d={"M0 300 " + Array.from({ length: 26 }, (_, i) => `Q${i * 60 + 30} ${276 + (i % 2) * 6} ${i * 60 + 60} 286`).join(" ") + " L1560 300 Z"} fill="#C9B8A3" />
          </Layer>
        </div>
      </div>
      <SerifLine t={t} x={120} y={84} size={104} words={[{ text: "opportunities", at: 22.8 }, { text: "grow.", at: 23.32, it: true }]} />
      {/* the ink floods from the tower's tip */}
      {t >= 23.5 && t < H3 - 0.25 && (
        <div style={{ ...abs, width: 1920, height: 1080, clipPath: `circle(${Math.max(r, 7 * clamp((t - 23.5) / 0.05))}px at ${fx}px ${fy}px)` }}><H3Ink t={t} /></div>
      )}
      {t >= H3 - 0.25 && <H3Ink t={t} />}
    </>
  );
};

export const SegC: React.FC<{ t: number }> = ({ t }) => {
  if (t < H2 + 0.25) return <H2Malaga t={t} />;
  if (t >= H3 - 0.25) return <H3Ink t={t} />;
  return (
    <AbsoluteFill>
      {t < 18.75 && <Shot8 t={t} />}
      {t >= 18.36 && t < 20.34 && <Shot9 t={t} />}
      {t >= 19.96 && t < 21.82 && <Shot10 t={t} />}
      {t >= 21.34 && t < 23.0 && <Shot11 t={t} />}
      {t >= 22.6 && <Shot12 t={t} />}
    </AbsoluteFill>
  );
};
