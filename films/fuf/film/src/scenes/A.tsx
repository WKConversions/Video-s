// Segment A (0-9.8 s): a marquee of giant serif strips, a one-line drawing of two hands meeting, and a premium
// cream slot machine that misses (mismatched symbols) and then lands three unicorns, which press into the wax seal.
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SERIF, SHADOW, w, clamp, mix, ease, inout, spring, seeded, Mark, SerifLine, DrawLine, H1, H1Seal } from "../kit";

const easeIn = (x: number) => Math.pow(clamp(x), 3);

// ---------------------------------------------------------------- shot 1: marquee strips
// Each strip is one rigid, filled paper band (rounded caps, padded): the type never slides under a cap, so no glyph is
// ever clipped. Five rows of 180 px with a 64 px clear margin at the top and bottom. Two bands are already running at
// frame 0; the rest arrive on "Great" / "opportunities"; on "start" they leave bottom-first (reverse cascade), so the
// lower half is clear before the serif line rises.
type Tok = { s: string; it?: boolean };
type Strip = { row: number; bg: string; ring: string; ink: string; acc: string; dash: string; dir: 1 | -1; at: number; out: number; toks: Tok[] };
const GO: Tok[] = [{ s: "Great" }, { s: "opportunities", it: true }];
const OG: Tok[] = [{ s: "opportunities", it: true }, { s: "Great" }];
const STRIPS: Strip[] = [
  { row: 0, bg: "linear-gradient(180deg, #E7E0D6 0%, #DDD5CB 52%, #D1C8BC 100%)", ring: "rgba(143,118,94,0.22)", ink: F.ink, acc: F.bronze, dash: F.bronze, dir: 1, at: 0.16, out: 2.34, toks: OG }, // the top band runs on as a header and clears just after "connections"
  { row: 1, bg: "linear-gradient(180deg, #383532 0%, #272624 52%, #1C1B19 100%)", ring: "rgba(187,167,145,0.35)", ink: F.cream, acc: F.tan, dash: F.tan, dir: -1, at: -0.55, out: 1.08, toks: GO },
  { row: 2, bg: "linear-gradient(180deg, #FFFEFB 0%, #FBF8F3 55%, #F0E9DF 100%)", ring: "rgba(143,118,94,0.30)", ink: F.ink, acc: F.bronze, dash: F.bronze, dir: 1, at: 0.05, out: 1.0, toks: OG },
  { row: 3, bg: "linear-gradient(180deg, #A48A70 0%, #8F765E 52%, #7A6450 100%)", ring: "rgba(255,255,255,0.18)", ink: F.cream, acc: F.ink, dash: F.cream, dir: -1, at: -0.42, out: 0.92, toks: GO },
  { row: 4, bg: "linear-gradient(180deg, #F4EEE6 0%, #EEE7DF 52%, #E3DACE 100%)", ring: "rgba(143,118,94,0.26)", ink: F.ink, acc: F.bronze, dash: F.bronze, dir: 1, at: 0.28, out: 0.84, toks: GO },
];
const DRIFT = 330, EXIT = 5600, EXIT_T = 0.42;
const Strips: React.FC<{ t: number }> = ({ t }) => (
  <>
    {STRIPS.map((s, i) => {
      const u = (t - s.out) / EXIT_T;
      if (u >= 1) return null;
      const p = spring(t, s.at, 0.62, 1);
      const from = s.dir > 0 ? -60 : 1980, to = s.dir > 0 ? 2320 : -400;
      const lead = from + (to - from) * p + s.dir * DRIFT * Math.max(0, t - s.at) + (u > 0 ? s.dir * EXIT * u * u : 0);
      const toks = [0, 1, 2].flatMap(() => s.toks);
      const y = 64 + s.row * 193;
      return (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 180, transform: `translate(${lead.toFixed(2)}px, ${y}px)` }}>
          <div style={{ position: "absolute", top: 0, [s.dir > 0 ? "right" : "left"]: 0, height: 180, borderRadius: 90, padding: "0 70px", boxSizing: "border-box",
            display: "flex", alignItems: "center", whiteSpace: "nowrap", gap: 56, background: s.bg,
            boxShadow: `inset 0 0 0 2px ${s.ring}, inset 0 3px 0 rgba(255,255,255,0.28), inset 0 -10px 18px rgba(39,38,36,0.10), 0 2px 4px rgba(39,38,36,0.08), 0 26px 44px -26px rgba(39,38,36,0.45)`,
            fontFamily: SERIF, fontSize: 142, lineHeight: "180px", letterSpacing: "-0.02em" }}>
            <span style={{ display: "inline-block", width: 70, height: 4, borderRadius: 2, background: s.dash, opacity: 0.85 }} />
            {toks.map((k, j) => (
              <React.Fragment key={j}>
                <span style={{ fontStyle: k.it ? "italic" : "normal", color: k.it ? s.acc : s.ink }}>{k.s}</span>
                <span style={{ display: "inline-block", width: 70, height: 4, borderRadius: 2, background: s.dash, opacity: 0.85 }} />
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    })}
  </>
);

// ---------------------------------------------------------------- shot 2: one-line hands meeting
type Seg = [number, number][]; // first point + cubic controls, or 2-point line
const HAND: { M: [number, number]; segs: Seg[] } = {
  M: [-1100, -70],
  segs: [
    [[-800, -72], [-560, -70], [-430, -62]], [[-360, -58], [-300, -66], [-240, -60]], [[-190, -55], [-150, -40], [-120, -26]],
    [[-90, -14], [-50, -12], [-14, -10]],
    [[2, -10], [8, 2], [-4, 8]], // the fingertip (segment index 4 ends here)
    [[-30, 12], [-70, 10], [-104, 8]], [[-118, 8], [-128, 16], [-120, 26]], [[-100, 32], [-80, 36], [-74, 46]],
    [[-70, 56], [-92, 60], [-118, 54]], [[-150, 48], [-170, 46], [-188, 50]],
    [[-178, 62], [-184, 80], [-204, 82]], [[-218, 84], [-226, 74], [-226, 66]],
    [[-232, 84], [-252, 92], [-268, 84]], [[-280, 78], [-282, 70], [-280, 66]],
    [[-290, 86], [-312, 92], [-328, 80]], [[-350, 70], [-390, 60], [-430, 56]], [[-560, 50], [-800, 52], [-1100, 58]],
  ],
};
const handGeo = (tx: number, ty: number, sx: number, s: number) => {
  const P = (p: [number, number]) => [tx + p[0] * s * sx, ty + p[1] * s] as [number, number];
  let cur = P(HAND.M), d = `M${cur[0].toFixed(1)} ${cur[1].toFixed(1)}`, len = 0, tipLen = 0;
  HAND.segs.forEach((sg, i) => {
    const pts = sg.map(P);
    if (pts.length === 1) { len += Math.hypot(pts[0][0] - cur[0], pts[0][1] - cur[1]); d += ` L${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`; }
    else {
      const [a, b, c] = pts; let px = cur[0], py = cur[1];
      for (let k = 1; k <= 24; k++) { const u = k / 24, v = 1 - u;
        const x = v * v * v * cur[0] + 3 * v * v * u * a[0] + 3 * v * u * u * b[0] + u * u * u * c[0];
        const y = v * v * v * cur[1] + 3 * v * v * u * a[1] + 3 * v * u * u * b[1] + u * u * u * c[1];
        len += Math.hypot(x - px, y - py); px = x; py = y; }
      d += ` C${a[0].toFixed(1)} ${a[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
    }
    cur = pts[pts.length - 1];
    if (i === 4) tipLen = len;
  });
  return { d, frac: tipLen / len };
};
const LEFT = handGeo(942, 478, 1, 1.25), RIGHT = handGeo(978, 452, -1, 1.25);
const handP = (t: number, frac: number, t0: number, tMeet: number, tEnd: number) =>
  t < tMeet ? frac * inout((t - t0) / (tMeet - t0)) : frac + (1 - frac) * ease((t - tMeet) / (tEnd - tMeet));

const Hands: React.FC<{ t: number }> = ({ t }) => {
  const tm = w("connections");
  return (
    <>
      <DrawLine d={LEFT.d} p={handP(t, LEFT.frac, 1.12, tm, 2.78)} width={5} />
      <DrawLine d={RIGHT.d} p={handP(t, RIGHT.frac, 1.18, tm, 2.84)} width={5} />
      {t > tm && t < tm + 1 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform="translate(960 470)">
            {/* eight sparks fly out from the touch, fast and linear, so nothing crawls or steps */}
            {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 + 0.39, x = clamp((t - tm) / 0.3), o = 1 - x;
              const r0 = 26 + 220 * x, r1 = 34 + 330 * x;
              return o > 0 && <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={F.bronze} strokeWidth={3} strokeLinecap="round" opacity={o} />; })}
          </g>
        </svg>
      )}
      <SerifLine t={t} x={960} y={690} size={104} align="center" words={[
        { text: "start", at: 1.36 }, { text: "with", at: w("with") + 0.04 }, { text: "the", at: w("the") }, { text: "right", at: w("right") }, { text: "connections.", at: tm, it: true }]} />
    </>
  );
};

// ---------------------------------------------------------------- shots 3-4: the slot machine
const IC = { stroke: F.ink, sw: 5 };
const Icon: React.FC<{ k: number }> = ({ k }) => {
  const s = { fill: "none", stroke: IC.stroke, strokeWidth: IC.sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const b = { ...s, stroke: F.bronze };
  switch (k) {
    case 0: return (<g>{/* rocket */}
      <path {...s} d="M60 10 C80 28 84 54 76 80 L44 80 C36 54 40 28 60 10 Z" /><circle {...b} cx={60} cy={44} r={9} />
      <path {...s} d="M44 64 L28 86 L44 82 M76 64 L92 86 L76 82" /><path {...b} d="M50 88 Q60 112 70 88" /></g>);
    case 1: return (<g>{/* chart */}
      <path {...s} d="M16 14 L16 102 L106 102" /><rect {...s} x={30} y={72} width={14} height={30} rx={2} /><rect {...s} x={53} y={56} width={14} height={46} rx={2} />
      <rect {...s} x={76} y={38} width={14} height={64} rx={2} /><path {...b} d="M26 58 L52 38 L66 48 L100 16 M84 16 L100 16 L100 32" /></g>);
    case 2: return (<g>{/* lightbulb */}
      <path {...s} d="M60 12 C38 12 26 30 30 50 C33 62 44 68 46 82 L74 82 C76 68 87 62 90 50 C94 30 82 12 60 12 Z" />
      <path {...s} d="M48 92 L72 92 M51 102 L69 102" /><path {...b} d="M50 62 L55 48 L60 62 L65 48 L70 62" /></g>);
    case 3: return (<g>{/* handshake */}
      <path {...s} d="M6 40 L26 40 L26 80 L6 80 M114 40 L94 40 L94 80 L114 80" />
      <path {...s} d="M26 48 C40 42 52 40 64 46 L84 58 C90 63 85 71 78 67 L66 60" />
      <path {...s} d="M94 48 C84 44 74 42 64 46 M26 72 C38 76 46 84 58 86 C64 88 70 84 66 78 M94 72 C88 78 80 82 74 82" />
      <path {...b} d="M50 54 L60 62" /></g>);
    case 4: return (<g>{/* compass */}
      <circle {...s} cx={60} cy={60} r={46} /><circle {...s} cx={60} cy={60} r={4} />
      <path d="M60 22 L71 60 L49 60 Z" fill={F.bronze} /><path {...s} d="M60 98 L71 60 L49 60 Z" strokeWidth={4} />
      <path {...s} d="M60 8 L60 16 M60 104 L60 112 M8 60 L16 60 M104 60 L112 60" strokeWidth={4} /></g>);
    case 5: return (<g>{/* briefcase */}
      <rect {...s} x={14} y={40} width={92} height={60} rx={10} /><path {...s} d="M44 40 L44 30 Q44 22 52 22 L68 22 Q76 22 76 30 L76 40 M14 66 L106 66" />
      <rect x={52} y={59} width={16} height={14} rx={3} fill={F.bronze} /></g>);
    default: return null;
  }
};
const SEQ = [[0, 3, 6, 1, 4, 2, 5], [2, 5, 1, 6, 0, 4, 3], [4, 1, 5, 2, 6, 3, 0]];
const N = 7, CH = 210, V = 5400; // cell height, spin speed px/s
type Spin = { s: number; e: number; sym: number; a: number; d: number };
const SPINS: Spin[][] = [0, 1, 2].map((r) => [
  { s: 3.62 + r * 0.06, e: [6.06, w("always"), w("easy")][r], sym: [0, 2, 5][r], a: 0.16, d: 0.42 },
  { s: 7.66 + r * 0.05, e: [w("unicorn"), (w("unicorn") + w("founders")) / 2, w("founders")][r], sym: 6, a: 0.12, d: 0.36 },
]);
const START = [1, 4, 2];
const NUDGE = 7.2; // after the miss, each reel nudges one cell (still no match) // initial symbols (chart, compass, bulb)
const idxOf = (r: number, sym: number) => SEQ[r].indexOf(sym);
// precomputed cell targets per reel and spin
const PLAN = SPINS.map((spins, r) => {
  let k = idxOf(r, START[r]);
  return spins.map((sp, j) => {
    if (j === 1) k += 1; // the nudge between the two spins
    const T = sp.e - sp.s, need = Math.round((V / CH) * (T - sp.a / 2 - sp.d / 2));
    let kt = k + need; while (SEQ[r][((kt % N) + N) % N] !== sp.sym) kt++;
    const out = { k0: k, k1: kt }; k = kt; return out;
  });
});
const travel = (u: number, T: number, a: number, d: number) => {
  const v = 1 / (T - a / 2 - d / 2);
  if (u <= 0) return [0, 0]; if (u >= T) return [1, 0];
  if (u < a) return [0.5 * (v / a) * u * u, (v * u) / a];
  if (u < T - d) return [v * (u - a / 2), v];
  const r = T - u; return [1 - 0.5 * (v / d) * r * r, (v * r) / d];
};
const reelState = (r: number, t: number) => {
  let off = idxOf(r, START[r]) * CH, speed = 0, lastStop = -9;
  SPINS[r].forEach((sp, j) => {
    if (t < sp.s) return;
    const { k0, k1 } = PLAN[r][j], D = (k1 - k0) * CH, [f, fv] = travel(t - sp.s, sp.e - sp.s, sp.a, sp.d);
    off = k0 * CH + D * f; speed = D * fv; if (t >= sp.e) lastStop = sp.e;
  });
  const tn = NUDGE + r * 0.1;
  if (t >= tn && t < SPINS[r][1].s) off += CH * inout((t - tn) / 0.28);
  const x = t - lastStop;
  if (lastStop > 0 && x < 1.2) off += CH * 0.075 * Math.exp(-x * 11) * Math.sin(x * 30);
  return { off, speed };
};
const ALL_STOPS = SPINS.map((s) => s[0].e); // body thunks on the losing stops only; the camera push carries the winning ones

const Reel: React.FC<{ t: number; r: number; x: number }> = ({ t, r, x }) => {
  const { off, speed } = reelState(r, t);
  const blur = Math.min(16, (speed / 60) * 0.3);
  const kc = Math.round(off / CH), cells = [];
  for (let k = kc - 2; k <= kc + 2; k++) cells.push(k);
  const hideUni = t >= 9.0, uniOn = t >= SPINS[r][1].s + 0.16; // the unicorn only joins the reel once spin 2 is a blur
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 240, height: 330, overflow: "hidden", borderRadius: 10, transform: `translate(${x}px, 375px)`, background: "#FBF9F5" }}>
      <svg width={240} height={330} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><filter id={`vb${r}`} x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} /></filter></defs>
        <g filter={blur > 0.3 ? `url(#vb${r})` : undefined}>
          {cells.map((k) => {
            const y = 165 + (off - k * CH) - CH / 2, sym = SEQ[r][((k % N) + N) % N];
            return (
              <g key={k} transform={`translate(0 ${y.toFixed(2)})`}>
                <rect x={0} y={0} width={240} height={CH} fill={k % 2 === 0 ? "#FBF9F5" : "#EDE5DA"} />
                <rect x={0} y={0} width={240} height={2} fill={F.sand2} />
                {(sym !== 6 || !uniOn) && <g transform="translate(42 27) scale(1.3)"><Icon k={sym !== 6 ? sym : [3, 4, 1][r]} /></g>}
              </g>
            );
          })}
        </g>
      </svg>
      {!hideUni && cells.map((k) => {
        const sym = SEQ[r][((k % N) + N) % N]; if (sym !== 6 || !uniOn) return null;
        const y = 165 + (off - k * CH) - 82;
        return <div key={"u" + k} style={{ position: "absolute", left: 0, top: 0, transform: `translate(38px, ${y.toFixed(2)}px)`, filter: blur > 0.3 ? `blur(${(blur * 0.45).toFixed(2)}px)` : undefined }}><Mark size={164} tone="bronze" /></div>;
      })}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(39,38,36,0.42) 0%, rgba(39,38,36,0.08) 24%, rgba(255,255,255,0.10) 46%, rgba(255,255,255,0) 56%, rgba(39,38,36,0.08) 76%, rgba(39,38,36,0.42) 100%)" }} />
    </div>
  );
};

const DISPLAY: { at: number; s: string; it?: boolean }[] = [
  { at: -1, s: "" }, { at: w("finding"), s: "Finding" }, { at: w("ambitious"), s: "ambitious people" }, { at: w("who"), s: "who share" },
  { at: w("your"), s: "your vision" }, { at: w("isnt"), s: "isn't always" }, { at: w("easy"), s: "easy.", it: true },
  { at: w("meet"), s: "Meet" }, { at: w("future"), s: "Future" }, { at: w("unicorn"), s: "Unicorn" }, { at: w("founders"), s: "Founders.", it: true },
];
const Display: React.FC<{ t: number }> = ({ t }) => {
  let i = 0; DISPLAY.forEach((d, j) => { if (t >= d.at) i = j; });
  const p = i === 0 ? 1 : spring(t, DISPLAY[i].at, 0.42, 0.9);
  const cur = DISPLAY[i], prev = DISPLAY[Math.max(0, i - 1)];
  const st = (d: typeof cur): React.CSSProperties => ({ position: "absolute", left: 0, right: 0, top: 0, height: 110, display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: SERIF, fontSize: 60, letterSpacing: "-0.02em", fontStyle: d.it ? "italic" : "normal", color: d.it ? F.tan : F.cream, whiteSpace: "nowrap" });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 620, height: 110, overflow: "hidden", borderRadius: 18, transform: "translate(650px, 168px)",
      background: "linear-gradient(180deg, #1B1A18, #2E2C29)", boxShadow: "inset 0 6px 16px rgba(0,0,0,0.55), 0 0 0 3px #8F765E, 0 0 0 7px #3A3633" }}>
      {i > 0 && p < 1 && <div style={{ ...st(prev), transform: `translateY(${-p * 110}px)` }}>{prev.s}</div>}
      <div style={{ ...st(cur), transform: `translateY(${(1 - p) * 110}px)` }}>{cur.s}</div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.45))" }} />
    </div>
  );
};

const Lever: React.FC<{ t: number }> = ({ t }) => {
  const pull = (t0: number, t1: number) => (t < t0 ? 0 : t < t1 ? ease((t - t0) / 0.2) : 1 - spring(t, t1, 0.5, 0.62));
  // after the miss the lever eases back (a wind-up from 7.34) and then drops on "Meet"
  const q = t < 7.3 ? pull(3.5, w("easy")) : t < w("meet") ? -0.12 * inout((t - 7.34) / 0.24) : t < w("founders") ? mix(-0.12, 1, pull(w("meet"), w("founders"))) : pull(w("meet"), w("founders"));
  const th = q * Math.PI * 0.83, L = 280, px = 1440, py = 590;
  const c = Math.cos(th), ky = py - L * c, ks = 1 + 0.22 * Math.sin(th);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 18, height: L, borderRadius: 9, transformOrigin: "50% 100%",
        transform: `translate(${px - 9}px, ${py - L}px) scaleY(${c.toFixed(4)})`, background: "linear-gradient(90deg, #6E5A47, #C9B39A 40%, #8F765E 70%, #5E4C3C)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 56, height: 150, borderRadius: 16, transform: "translate(1398px, 515px)",
        background: "linear-gradient(90deg, #7A6450, #B39A80 45%, #8F765E 75%, #6A5644)", boxShadow: "0 10px 24px -8px rgba(39,38,36,0.5)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 30, height: 30, borderRadius: 15, transform: `translate(${px - 15}px, ${py - 15}px)`, background: "radial-gradient(circle at 35% 35%, #D8C6B0, #6E5A47)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 76, height: 76, borderRadius: 38, transform: `translate(${px - 38}px, ${ky - 38}px) scale(${ks.toFixed(4)})`,
        background: "radial-gradient(circle at 34% 30%, #6A6560 0%, #272624 55%, #121110 100%)", boxShadow: "0 14px 24px -10px rgba(39,38,36,0.6)" }} />
    </>
  );
};

const Ticket: React.FC<{ t: number }> = ({ t }) => {
  const t0 = w("easy") + 0.12, p = ease((t - t0) / 0.55), fall = easeIn((t - w("meet")) / 0.45);
  if (t < t0 || fall >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 280, height: 420, overflow: "hidden", transform: "translate(820px, 818px)" }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 220, height: 150, borderRadius: "0 0 10px 10px", padding: "26px 0 0", boxSizing: "border-box",
        transform: `translate(0px, ${(-150 + p * 150 + fall * 420).toFixed(2)}px) rotate(${(fall * 14).toFixed(2)}deg)`,
        background: "linear-gradient(180deg, #EDE6DC, #FFFDF9 22%, #FBF8F2)", boxShadow: "0 12px 24px -12px rgba(39,38,36,0.45)", textAlign: "center" }}>
        <div style={{ position: "absolute", left: 10, right: 10, top: 12, borderTop: `2px dashed ${F.sand2}` }} />
        <svg width={220} height={124} style={{ position: "absolute", left: 0, top: 22 }}>
          {[0, 2, 5].map((k, i) => <g key={i} transform={`translate(${22 + i * 62} 22) scale(0.42)`} opacity={0.9}><Icon k={k} /></g>)}
          <path d="M70 46 L88 64 M88 46 L70 64 M132 46 L150 64 M150 46 L132 64" stroke={F.bronze} strokeWidth={3} strokeLinecap="round" opacity={0.75} />
          <line x1={24} y1={96} x2={196} y2={96} stroke={F.sand2} strokeWidth={2} />
        </svg>
      </div>
    </div>
  );
};

const Machine: React.FC<{ t: number }> = ({ t }) => {
  // bumps on every stop and pull, and a quick "no" shake after the miss
  let by = 0;
  ALL_STOPS.forEach((e) => { const x = t - e; if (x > 0 && x < 0.6) by += 5 * Math.exp(-x * 12) * Math.sin(x * 42); });
  [3.5, w("meet")].forEach((e) => { const x = t - e - 0.12; if (x > 0 && x < 0.6) by += 7 * Math.exp(-x * 10) * Math.sin(x * 36); });
  const sx = t > w("easy") + 0.1 && t < w("easy") + 0.8 ? 16 * Math.exp(-(t - w("easy") - 0.1) * 5) * Math.sin((t - w("easy") - 0.1) * 34) : 0;
  const out = t - 9.0, down = out > 0 ? easeIn(out / 0.45) * 1250 : 0, up = out > 0 ? easeIn(out / 0.4) * -800 : 0;
  const win = (r: number) => { const e = SPINS[r][1].e, x = t - e; return x > 0 && t < 9.0 ? x : -1; };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${sx.toFixed(2)}px, ${by.toFixed(2)}px)` }}>
      {/* crown */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${up}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 240, borderRadius: "160px 160px 22px 22px", transform: "translate(580px, 100px)",
          background: "linear-gradient(180deg, #3A3633, #272624 60%, #1F1E1C)", boxShadow: `inset 0 0 0 4px ${F.bronze}, inset 0 10px 22px rgba(255,255,255,0.08), ${SHADOW}` }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 700, height: 20, overflow: "hidden", borderRadius: 10, transform: "translate(610px, 300px)", background: F.bronze }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: 20, transform: `translateX(${(((t * 150) % 40) - 40).toFixed(2)}px)`,
            background: `repeating-linear-gradient(115deg, ${F.tan} 0 10px, ${F.bronze} 10px 20px)` }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(960px, 128px)" }}>
          <svg width={420} height={40} style={{ position: "absolute", left: -210, top: 0 }}>
            <path d="M20 20 L180 20 M240 20 L400 20" stroke={F.bronze} strokeWidth={2} strokeLinecap="round" />
            <path d="M210 6 L224 20 L210 34 L196 20 Z" fill={F.bronze} /><path d="M210 12 L218 20 L210 28 L202 20 Z" fill={F.tan} />
            <circle cx={186} cy={20} r={3} fill={F.tan} /><circle cx={234} cy={20} r={3} fill={F.tan} />
          </svg>
        </div>
        <Display t={t} />
      </div>
      {/* body */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${down}px)` }}>
        <Lever t={t} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 920, height: 28, borderRadius: 14, transform: "translate(500px, 940px)",
          background: "linear-gradient(180deg, #B39A80, #8F765E 50%, #6A5644)", boxShadow: "0 30px 50px -20px rgba(39,38,36,0.5)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 880, height: 620, borderRadius: 48, transform: "translate(520px, 330px)",
          background: "linear-gradient(180deg, #FDFBF8 0%, #F4EFE8 55%, #E8E0D5 100%)",
          boxShadow: `inset 0 0 0 5px ${F.bronze}, inset 0 0 0 11px #F7F2EA, inset 0 0 0 13px rgba(143,118,94,0.35), inset 0 -26px 40px rgba(143,118,94,0.16), ${SHADOW}` }} />
        {/* reel window */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: 360, borderRadius: 24, transform: "translate(560px, 360px)",
          background: "linear-gradient(180deg, #2E2C29, #1E1D1B)", boxShadow: `0 0 0 4px ${F.bronze}, 0 2px 0 6px rgba(255,255,255,0.7)` }} />
        <Reel t={t} r={0} x={580} /><Reel t={t} r={1} x={840} /><Reel t={t} r={2} x={1100} />
        {[0, 1, 2].map((r) => { const x = win(r); if (x < 0) return null; const q = ease(x / 0.35);
          return <div key={r} style={{ position: "absolute", left: 0, top: 0, width: 220, height: 200, borderRadius: 18, border: `4px solid ${F.bronze}`, boxSizing: "border-box",
            transform: `translate(${590 + r * 260}px, 440px) scale(${mix(1.25, 1, q).toFixed(4)})`, opacity: clamp(x / 0.12) }} />; })}
        {/* payline */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M540 524 L566 540 L540 556 Z M1380 524 L1354 540 L1380 556 Z" fill={F.bronze} />
          <line x1={572} y1={540} x2={1348} y2={540} stroke={F.bronze} strokeWidth={2} strokeOpacity={0.55} strokeDasharray="10 8" />
        </svg>
        {/* plaque, slot, tray */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 440, height: 52, borderRadius: 26, transform: "translate(740px, 744px)", display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(180deg, #B39A80, #8F765E 55%, #7A6450)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 6px 14px -6px rgba(39,38,36,0.5)",
          }}>
          <svg width={440} height={52}><path d="M60 26 L190 26 M250 26 L380 26" stroke={F.cream} strokeOpacity={0.7} strokeWidth={2} strokeLinecap="round" />
            <path d="M220 14 L232 26 L220 38 L208 26 Z" fill={F.cream} fillOpacity={0.85} /><circle cx={44} cy={26} r={5} fill="#6A5644" /><circle cx={396} cy={26} r={5} fill="#6A5644" /></svg>
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, width: 260, height: 10, borderRadius: 5, transform: "translate(830px, 812px)", background: "#1E1D1B", boxShadow: `0 0 0 3px ${F.bronze}` }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: 74, borderRadius: 26, transform: "translate(640px, 846px)",
          background: "linear-gradient(180deg, #151413, #3A3633)", boxShadow: `0 0 0 4px ${F.bronze}, inset 0 12px 18px rgba(0,0,0,0.6)` }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 50, height: 90, borderRadius: 12, transform: "translate(1300px, 744px)",
          background: "linear-gradient(90deg, #E8E0D5, #FDFBF8)", boxShadow: `inset 0 0 0 3px ${F.bronze}` }}>
          <div style={{ position: "absolute", left: 21, top: 18, width: 8, height: 54, borderRadius: 4, background: "#1E1D1B" }} />
        </div>
        <Ticket t={t} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- camera on the machine (decisive moves, 2+ px/frame)
type Cam = { z: number; fx: number; fy: number };
const CAM0: Cam = { z: 1, fx: 960, fy: 540 };
const MOVES: { t0: number; t1: number; to: Cam }[] = [
  { t0: 4.62, t1: 5.14, to: { z: 1.12, fx: 960, fy: 480 } }, // "who share your vision": lean in on the display
  { t0: 5.96, t1: 6.58, to: { z: 1.3, fx: 960, fy: 505 } }, // push in on the reels as they stop (the display stays inside the safe margin)
  { t0: 6.68, t1: 7.32, to: { z: 1.5, fx: 1000, fy: 744 } }, // tilt down to the ticket slot
  { t0: 7.4, t1: 7.98, to: { z: 1, fx: 960, fy: 540 } }, // pull back as the lever drops on "Meet"
  { t0: 8.22, t1: 8.9, to: { z: 1.2, fx: 960, fy: 520 } }, // push in as the unicorns land
];
const cam = (t: number): Cam => {
  let c = CAM0;
  for (const m of MOVES) {
    if (t <= m.t0) break;
    const k = inout((t - m.t0) / (m.t1 - m.t0));
    c = { z: mix(c.z, m.to.z, k), fx: mix(c.fx, m.to.fx, k), fy: mix(c.fy, m.to.fy, k) };
  }
  return c;
};
const camT = (c: Cam) => `translate(${(960 - c.fx * c.z).toFixed(2)}px, ${(540 - c.fy * c.z).toFixed(2)}px) scale(${c.z.toFixed(5)})`;

// ---------------------------------------------------------------- confetti of bronze paper bits
const BITS = Array.from({ length: 54 }, (_, i) => ({
  x0: 960 + (seeded(i) - 0.5) * 700, y0: 540 + (seeded(i + 50) - 0.5) * 160,
  vx: (seeded(i + 100) - 0.5) * 3600, vy: -900 - seeded(i + 150) * 1900, w: 12 + seeded(i + 200) * 14, h: 22 + seeded(i + 250) * 16,
  rot: seeded(i + 300) * 360, spin: (seeded(i + 350) - 0.5) * 900, flip: 8 + seeded(i + 400) * 14,
  c: [["#A88B6E", "#7A6450"], ["#C9B49B", "#9E8669"], ["#8F765E", "#5E4C3C"], ["#DDD5CB", "#B8AC9D"], ["#BBA791", "#8F765E"]][i % 5],
}));
const Confetti: React.FC<{ t: number }> = ({ t }) => {
  const t0 = w("founders") + 0.04, x = t - t0;
  if (x <= 0 || t >= 9.52) return null;
  const k = 1.6, fade = 1 - clamp((t - 9.28) / 0.22);
  return (
    <>
      {BITS.map((b, i) => {
        const dr = (1 - Math.exp(-k * x)) / k;
        const px = b.x0 + b.vx * dr, py = b.y0 + b.vy * dr + 0.5 * 2600 * x * x;
        const sc = Math.cos(x * b.flip);
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: b.w, height: b.h, borderRadius: 2, opacity: fade,
          transform: `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px) rotate(${(b.rot + b.spin * x).toFixed(2)}deg) scaleX(${sc.toFixed(3)})`,
          background: `linear-gradient(135deg, ${sc > 0 ? b.c[0] : b.c[1]}, ${sc > 0 ? b.c[1] : b.c[0]})` }} />;
      })}
    </>
  );
};

// ---------------------------------------------------------------- the three marks press into the seal (H1)
const Seal: React.FC<{ t: number }> = ({ t }) => {
  if (t >= H1 - 0.25) return <H1Seal t={t} />;
  // the seal rises out of the centre reel with a turn, overshoots to 1.22 and presses down like a stamp, landing at
  // exactly scale 1 / no offset / no turn at H1 - 0.25 (the bare H1Seal from then on)
  const t0 = 9.08, tp = 9.4, t1 = H1 - 0.25;
  const s = t < tp ? mix(0.3, 1.22, ease((t - t0) / (tp - t0))) : mix(1.22, 1, Math.pow(clamp((t - tp) / (t1 - tp)), 2));
  const rot = -170 * (1 - ease((t - t0) / (t1 - t0))), dy = 150 * (1 - ease((t - t0) / (tp - t0 + 0.06)));
  const op = clamp((t - t0) / 0.08);
  const fly = inout((t - 9.0) / 0.4), fade = 1 - clamp((t - 9.3) / 0.2), c = cam(9.0);
  return (
    <>
      {t > t0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: op, transformOrigin: "960px 540px",
        transform: `translateY(${dy.toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${s.toFixed(5)})` }}><H1Seal t={t} /></div>}
      {fade > 0 && [0, 1, 2].map((r) => {
        const { off } = reelState(r, 9.0), k1 = PLAN[r][1].k1, dy0 = off - k1 * CH;
        const x0 = 960 + (700 + r * 260 - c.fx) * c.z, y0 = 540 + (540 + dy0 - c.fy) * c.z;
        const cx = mix(x0, 960, fly), cy = mix(y0, 540, fly), sz = mix(164 * c.z, 300, fly);
        return <div key={r} style={{ position: "absolute", left: 0, top: 0, opacity: fade, transform: `translate(${(cx - sz / 2).toFixed(2)}px, ${(cy - sz / 2).toFixed(2)}px) rotate(${(fly * (r - 1) * -40).toFixed(2)}deg)` }}><Mark size={sz} tone="bronze" /></div>;
      })}
    </>
  );
};

export const SegA: React.FC<{ t: number }> = ({ t }) => {
  const push = t < 2.68 ? 0 : 1 - Math.pow(1 - clamp((t - 2.68) / 0.7), 4);
  return (
    <AbsoluteFill>
      {t < 2.7 && <Strips t={t} />}
      {t >= 1.25 && t < 3.45 && <AbsoluteFill style={{ transform: `translateY(${(-1100 * push).toFixed(2)}px)` }}><Hands t={t} /></AbsoluteFill>}
      {t >= 2.68 && t < 9.5 && <AbsoluteFill style={{ transform: `translateY(${(1100 * (1 - push)).toFixed(2)}px)` }}>
        <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cam(t)) }}><Machine t={t} /></AbsoluteFill>
      </AbsoluteFill>}
      {t >= 9.0 && <Seal t={t} />}
      <Confetti t={t} />
    </AbsoluteFill>
  );
};
