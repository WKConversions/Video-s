// Segment D (24.25-32.85 s): "No awkward networking. No endless business card exchanges. Just ambitious minds, real
// conversations, and connections that matter." Three objects tell it: a HELLO-my-name-is sticker that peels and
// crumples away on ink, a desktop Rolodex that spins faster and faster until it jams and bursts, and (after one card
// expands to cream) a top-down seating plan whose seats fill, talk and get linked, until warm light rises into H4Glow.
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SERIF, SANS, Mark, clamp, mix, ease, inout, spring, seeded, w, H3, H3Ink, H4, H4Glow } from "../kit";

const ACC = F.tan; // the bronze accent, lifted for legibility on ink

// Line: the kit's SerifLine (words rising through masks on their voice-over times), with composited transforms so
// the slow end of each settle glides instead of stepping on whole pixels.
type Wd = { text: string; at: number; it?: boolean; d?: number };
const Line: React.FC<{ t: number; words: Wd[]; x: number; y: number; size: number; color?: string; accent?: string; out?: number; od?: number }> = ({ t, words, x, y, size, color = F.ink, accent = F.bronze, out = 9999, od = 0.32 }) => {
  const o = ease((t - out) / od);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0)`, display: "flex", gap: size * 0.26, fontFamily: SERIF, fontSize: size, lineHeight: 1.12, letterSpacing: "-0.02em", whiteSpace: "pre" }}>
      {words.map((wd, i) => {
        const p = ease((t - wd.at) / (wd.d ?? 0.5));
        if (t < wd.at) return null;
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.14, marginBottom: -size * 0.14 }}>
            <span style={{ display: "inline-block", willChange: "transform", transform: `translate3d(0, ${((1 - p) * 112 - o * 112).toFixed(3)}%, 0)`, fontStyle: wd.it ? "italic" : "normal", color: wd.it ? accent : color }}>{wd.text}</span>
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- shot 13: the sticker
const ST_W = 620, ST_H = 420;
const Sticker: React.FC<{ t: number }> = ({ t }) => {
  if (t < 24.5 || t > 25.75) return null;
  const a = spring(t, 24.47, 0.5, 0.8);                        // drifts in
  const curl = ease((t - w("awkward")) / 0.42);                 // the corner curls from "awkward"
  const fly = clamp((t - 25.02) / 0.62);                        // peels away on "networking"
  const fk = fly * fly * (3 - 2 * fly);
  const c = mix(0, 250, curl) + fk * 140;
  const x = mix(2250, 1340, a) + fk * fk * 1100 + Math.sin(t * 2.1) * 6;
  const y = mix(1180, 520, a) - fk * 880 + fk * fk * 120;
  const rot = mix(22, -6, a) + fk * 210 + curl * -2;
  const sc = (1 + curl * 0.035) * (1 - fk * 0.72);
  const squash = 1 - clamp((fly - 0.15) / 0.5) * 0.35;
  const ball = clamp((fly - 0.28) / 0.22);
  const W = ST_W, H = ST_H;
  const body = `M22 0 H${W - 22} Q${W} 0 ${W} 22 V${H - 22} Q${W} ${H} ${W - 22} ${H} H22 Q0 ${H} 0 ${H - 22} V22 Q0 0 22 0 Z`;
  const clip = `0,0 ${W},0 ${W},${H - c} ${W - c},${H} 0,${H}`;
  const flap = `${W},${H - c} ${W - c},${H} ${W - c},${H - c}`;
  const shadow = `${W + 10},${H - c - 6} ${W - c - 10},${H + 6} ${W - c - 30},${H - c - 30}`;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${x - W / 2}px, ${y - H / 2}px) rotate(${rot}deg) scale(${sc * squash}, ${sc / Math.max(0.7, squash * 0.95 + 0.05)})` }}>
      <svg width={W + 40} height={H + 40} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ball }}>
        <defs>
          <clipPath id="stc"><polygon points={clip} /></clipPath>
          <linearGradient id="stp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFDF8" /><stop offset="1" stopColor="#F1EADF" /></linearGradient>
          <linearGradient id="stb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9C8269" /><stop offset="1" stopColor="#80664D" /></linearGradient>
          <linearGradient id="stf" gradientUnits="userSpaceOnUse" x1={W - c / 2} y1={H - c / 2} x2={W - c} y2={H - c}>
            <stop offset="0" stopColor="#CFC5B6" /><stop offset="0.55" stopColor="#ECE5DA" /><stop offset="1" stopColor="#FAF7F1" />
          </linearGradient>
        </defs>
        <g clipPath="url(#stc)">
          <path d={body} fill="url(#stp)" />
          <path d={`M22 0 H${W - 22} Q${W} 0 ${W} 22 V150 H0 V22 Q0 0 22 0 Z`} fill="url(#stb)" />
          <rect x={0} y={H - 30} width={W} height={30} fill="url(#stb)" />
          <text x={W / 2} y={98} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={88} letterSpacing="14" fill={F.cream}>HELLO</text>
          <text x={W / 2} y={136} textAnchor="middle" fontFamily={SANS} fontWeight={400} fontSize={28} letterSpacing="5" fill={F.cream} opacity={0.9}>my name is</text>
          <line x1={70} y1={330} x2={W - 70} y2={330} stroke={F.sand2} strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" />
          <rect x={0} y={150} width={W} height={10} fill="rgba(39,38,36,0.06)" />
        </g>
        {c > 2 && <polygon points={shadow} fill="rgba(0,0,0,0.28)" style={{ filter: "blur(10px)" }} />}
        {c > 2 && <polygon points={flap} fill="url(#stf)" stroke="#E2D8CA" strokeWidth={1} />}
      </svg>
      {ball > 0 && <Crumple o={ball} w={W} h={H} t={t} />}
    </div>
  );
};
// the crumpled paper ball the sticker becomes: faceted, shaded like real paper
const Crumple: React.FC<{ o: number; w: number; h: number; t: number }> = ({ o, w: W, h: H }) => {
  const n = 11, R = 190, cx = W / 2, cy = H / 2;
  const P = Array.from({ length: n }, (_, i) => { const an = (i / n) * Math.PI * 2, r = R * (0.78 + seeded(i + 3) * 0.3); return [cx + Math.cos(an) * r, cy + Math.sin(an) * r * 0.92]; });
  const core = [cx + 18, cy - 14];
  const tones = ["#FBF8F2", "#E9E1D4", "#D9CEBE", "#F4EEE5", "#9A8067", "#E2D9CB", "#FFFDF8", "#CDBFAC", "#EFE8DD", "#866C53", "#F7F2EA"];
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: o }}>
      {P.map((p, i) => { const q = P[(i + 1) % n]; return <polygon key={i} points={`${core[0]},${core[1]} ${p[0]},${p[1]} ${q[0]},${q[1]}`} fill={tones[i]} stroke="#CFC4B4" strokeWidth={1.5} />; })}
      {P.map((p, i) => <line key={"l" + i} x1={core[0]} y1={core[1]} x2={mix(core[0], p[0], 0.7)} y2={mix(core[1], p[1], 0.7)} stroke="rgba(39,38,36,0.18)" strokeWidth={2} />)}
    </svg>
  );
};

// ---------------------------------------------------------------- shot 14: the Rolodex
const N = 30, CW = 440, CH = 236, R0 = 46, AX = 600, AY = 600;
const JAM = w("exchanges");
const LET = "ABCDEFGHIJKLMNOPRSTUVWZ";
// the reel's angle: accelerating from 50 to ~330 deg/s, then the jam: a hard stop with a shudder
const spinAngle = (t: number) => {
  const t0 = 25.45, tj = JAM;
  const acc = (x: number) => 95 * x + 30 * Math.pow(x, 2.6);   // integral of the rising speed
  if (t < tj) return 6 + acc(Math.max(0, t - t0));
  const k = t - tj;
  return 6 + acc(tj - t0) + 7 * Math.exp(-k * 14) * Math.sin(k * 60) + 3 * (1 - Math.exp(-k * 30));
};
const RCard: React.FC<{ i: number; phi: number; burst: number; t: number }> = ({ i, phi, burst }) => {
  const r1 = seeded(i * 3.1), r2 = seeded(i * 7.7), r3 = seeded(i * 1.9);
  const b = burst;
  const dist = b * (520 + r1 * 640), dx = b * (r2 - 0.5) * 900, rz = b * (r3 - 0.5) * 140, ry = b * (r1 - 0.5) * 160;
  const a = ((phi % 360) + 360) % 360;
  const shade = Math.min(0.45, 0.06 + 0.42 * (1 - Math.abs(Math.cos((a * Math.PI) / 180))) + (a > 90 && a < 270 ? 0.16 : 0));
  const special = i % 5 === 0;
  return (
    <div style={{ position: "absolute", left: -CW / 2, top: -CH - R0, width: CW, height: CH, transformOrigin: `50% ${CH + R0}px`,
      transform: `rotateX(${phi}deg) translate3d(${dx}px, ${-dist}px, 0px) rotateY(${ry}deg) rotateZ(${rz}deg)`, opacity: 1 - clamp((b - 0.35) / 0.4),
      background: special ? "linear-gradient(180deg, #F3E9DB, #E6D9C6)" : "linear-gradient(180deg, #FBF8F2, #EEE7DC)", borderRadius: 10,
      boxShadow: "inset 0 0 0 1.5px rgba(39,38,36,0.10)", backfaceVisibility: "visible" }}>
      {/* the Rolodex tab (lettered) and the card's print: a bronze monogram ring, an index rule, ruled lines */}
      <div style={{ position: "absolute", left: special ? 300 : 40 + (i % 4) * 70, top: -20, width: 90, height: 24, borderRadius: "8px 8px 0 0", background: special ? F.bronze : "#E4DACB", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 15, letterSpacing: "0.2em", color: special ? F.cream : F.bronze }}>{LET[i % LET.length]}</div>
      <div style={{ position: "absolute", left: 32, top: 30, width: 76, height: 76, borderRadius: 76, border: `3px solid ${F.bronze}`, boxShadow: "inset 0 0 0 5px rgba(143,118,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: F.bronze, lineHeight: 1 }}>{LET[(i * 7) % LET.length]}</div>
      <div style={{ position: "absolute", left: 128, top: 52, width: 130 + r2 * 80, height: 9, borderRadius: 5, background: `linear-gradient(90deg, ${F.bronze}, #B39A7E)` }} />
      <div style={{ position: "absolute", left: 128, top: 74, width: 70 + r3 * 50, height: 6, borderRadius: 3, background: F.tan, opacity: 0.8 }} />
      <div style={{ position: "absolute", left: 24, top: 120, width: CW - 48, height: 2, background: "rgba(143,118,94,0.55)" }} />
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 24, top: 146 + k * 24, width: CW - 48, height: 1.5, background: F.sand2 }} />)}
      <div style={{ position: "absolute", left: CW / 2 - 70, bottom: 10, width: 36, height: 14, borderRadius: 7, background: "rgba(39,38,36,0.16)" }} />
      <div style={{ position: "absolute", left: CW / 2 + 34, bottom: 10, width: 36, height: 14, borderRadius: 7, background: "rgba(39,38,36,0.16)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "#14130F", opacity: clamp(shade) }} />
    </div>
  );
};
const Knob: React.FC<{ x: number; ang: number }> = ({ x, ang }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 130, height: 130, transform: `translate(${x - 65}px, ${AY - 65}px)` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 130, background: "radial-gradient(circle at 35% 30%, #D8C2A6, #8F765E 55%, #5E4C3B)", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }} />
    <svg width={130} height={130} style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${ang}deg)` }}>
      {Array.from({ length: 6 }, (_, k) => { const an = (k / 6) * Math.PI * 2; return <line key={k} x1={65 + Math.cos(an) * 20} y1={65 + Math.sin(an) * 20} x2={65 + Math.cos(an) * 54} y2={65 + Math.sin(an) * 54} stroke="rgba(39,38,36,0.35)" strokeWidth={5} strokeLinecap="round" />; })}
      <circle cx={65} cy={65} r={16} fill="#E9D7BF" stroke="#6E5947" strokeWidth={3} />
    </svg>
  </div>
);
const Rolodex: React.FC<{ t: number }> = ({ t }) => {
  if (t < 25.4 || t > 28.3) return null;
  const inP = spring(t, 25.42, 0.7, 0.9);
  const ang = spinAngle(t);
  const burstT = JAM + 0.06;
  const shake = t > JAM ? Math.exp(-(t - JAM) * 9) * Math.sin((t - JAM) * 38) * 9 : 0;
  const baseOut = ease((t - (JAM + 0.12)) / 0.5);
  const lift = (1 - inP) * 760;
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${AX}px ${AY}px`, transform: `translate(${shake}px, ${lift - 42}px) scale(1.18)` }}>
      {/* the base: a dark, bronze-trimmed stand */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: 120, transform: `translate(${AX - 320}px, ${AY + 250 + baseOut * 400}px)`, opacity: 1 - baseOut }}>
        <svg width={640} height={120}><defs><linearGradient id="rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A4540" /><stop offset="1" stopColor="#2F2C29" /></linearGradient></defs>
          <path d="M70 10 H570 L630 96 Q632 110 618 110 H22 Q8 110 10 96 Z" fill="url(#rb)" />
          <path d="M70 10 H570" stroke={F.bronze} strokeWidth={4} strokeLinecap="round" />
          <path d="M10 98 H630" stroke="rgba(187,167,145,0.4)" strokeWidth={2} />
        </svg>
      </div>
      {/* the two struts to the axle */}
      {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 0, top: 0, width: 26, height: 280, borderRadius: 13, background: "linear-gradient(90deg, #5E4C3B, #A88E73, #5E4C3B)", transform: `translate(${AX + s * 262 - 13}px, ${AY}px) rotate(${s * -14}deg) translateY(${baseOut * 400}px)`, transformOrigin: "50% 0", opacity: 1 - baseOut }} />)}
      {/* the reel, in 3D */}
      <div style={{ position: "absolute", inset: 0, perspective: 1700, perspectiveOrigin: `${AX}px ${AY - 60}px` }}>
        <div style={{ position: "absolute", left: AX, top: AY, width: 0, height: 0, transformStyle: "preserve-3d", transform: "rotateX(-16deg) rotateY(-14deg)" }}>
          {Array.from({ length: N }, (_, i) => {
            const b = t > burstT ? ease((t - burstT - seeded(i * 5.3) * 0.12) / 0.75) : 0;
            return <RCard key={i} i={i} phi={(i / N) * 360 - ang} burst={b} t={t} />;
          })}
        </div>
      </div>
      {/* the axle's knobs turn with the reel */}
      <div style={{ opacity: 1 - baseOut }}>
        <Knob x={AX - 285} ang={-ang} />
        <Knob x={AX + 255} ang={-ang} />
      </div>
    </div>
  );
};
// the card that expands into the cream page of the seating plan
const ExpandCard: React.FC<{ t: number }> = ({ t }) => {
  const t0 = JAM + 0.56;   // the card sweeps across once the ink lines have exited through their masks
  if (t < t0) return null;
  const k = spring(t, t0, 0.5, 1);
  const s = mix(0.2, 1.08, k), x = mix(AX - 30, 960, k), y = mix(AY - 330, 540, k), r = mix(-24, 0, k);
  const fade = clamp((k - 0.2) / 0.5);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${x - 960}px, ${y - 540}px) rotate(${r}deg) scale(${s})`,
      background: `linear-gradient(160deg, #FBF8F2, ${F.cream})`, borderRadius: mix(60, 0, k), boxShadow: `0 40px 120px rgba(0,0,0,${0.5 * (1 - k)})`, overflow: "hidden" }}>
      <div style={{ opacity: 1 - fade }}>
        <div style={{ position: "absolute", left: 120, top: 120, width: 330, height: 330, borderRadius: 330, border: `13px solid ${F.bronze}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 190, color: F.bronze, lineHeight: 1 }}>M</div>
        <div style={{ position: "absolute", left: 560, top: 225, width: 760, height: 40, borderRadius: 20, background: `linear-gradient(90deg, ${F.bronze}, #B39A7E)` }} />
        <div style={{ position: "absolute", left: 560, top: 320, width: 420, height: 26, borderRadius: 13, background: F.tan, opacity: 0.8 }} />
        <div style={{ position: "absolute", left: 105, top: 520, width: 1710, height: 9, background: "rgba(143,118,94,0.55)" }} />
        {[0, 1, 2].map((q) => <div key={q} style={{ position: "absolute", left: 105, top: 630 + q * 104, width: 1710, height: 6, background: F.sand2 }} />)}
      </div>
    </div>
  );
};

// the kit's Kicker look, with a masked exit (rises out of its line like the words)
const KickerOut: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number }> = ({ t, at, out, text, x, y }) => {
  const p = spring(t, at, 0.5, 0.9), o = ease((t - out) / 0.2);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x + (1 - p) * -30}px, ${y}px)`, opacity: clamp(p * 1.5), overflow: "hidden", paddingBottom: 6 }}>
      <div style={{ transform: `translate3d(0, ${(-o * 130).toFixed(3)}%, 0)`, fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", textTransform: "uppercase", color: F.bronze }}>{text}</div>
    </div>
  );
};

// ---------------------------------------------------------------- shot 15: the seating plan
const TX = 1370, TY = 548, TR = 218, SR = 302, BR = 410, RUG = 462;
const INIT = ["AM", "JR", "LC", "SK", "ND", "EV", "TB", "MO"];
// seats two apart (90 deg), bowing outward: every curve stays well clear of the centrepiece and the mark
const LINKS: [number, number, number][] = [[0, 2, w("connections2")], [4, 6, w("connections2") + 0.16], [1, 3, w("that")], [5, 7, w("that") + 0.18], [2, 4, w("matter") - 0.12], [6, 0, w("matter") + 0.06]];
const PLAN0 = 28.1;
// the overhead camera turns with the table: a steady orbit, plus a quick quarter-swing on each new phrase
const planRot = (t: number) => -40 + (t - PLAN0) * 26 + (1 - spring(t, PLAN0, 0.9, 1)) * -120 + 38 * inout((t - (w("real") - 0.3)) / 0.75) + 38 * inout((t - (w("and4") - 0.3)) / 0.75);
const seatXY = (i: number, r: number, rot: number) => { const a = ((i * 45 - 90 + rot) * Math.PI) / 180; return [TX + Math.cos(a) * r, TY + Math.sin(a) * r]; };
const Plan: React.FC<{ t: number }> = ({ t }) => {
  if (t < PLAN0) return null;
  const rot = planRot(t);
  const tin = spring(t, PLAN0, 0.75, 0.85);
  const glowIn = ease((t - 31.9) / 0.6);
  const pd = clamp((t - 32.3) / 0.5), push = mix(1, 1.9, pd * pd);   // the overhead camera dives into the table's warm centre
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${TX}px ${TY}px`, transform: `scale(${push})` }}>
      {/* a round woven jute rug under the table: its weave turns with the overhead camera */}
      <div style={{ position: "absolute", left: 0, top: 0, width: RUG * 2, height: RUG * 2, transform: `translate(${TX - RUG}px, ${TY - RUG}px) rotate(${rot}deg) scale(${mix(0.3, 1, tin)})`, opacity: clamp(tin * 2.5) }}>
        <svg width={RUG * 2} height={RUG * 2} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <filter id="jute" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.045 0.07" numOctaves={3} seed={3} />
              <feColorMatrix type="matrix" values="0.9 0 0 0 0.44  0.88 0 0 0 0.38  0.8 0 0 0 0.31  0 0 0 0 1" /></filter>
            <clipPath id="rugc"><circle cx={RUG} cy={RUG} r={RUG} /></clipPath>
          </defs>
          <g clipPath="url(#rugc)"><rect width={RUG * 2} height={RUG * 2} filter="url(#jute)" /></g>
          <circle cx={RUG} cy={RUG} r={RUG - 9} fill="none" stroke="#A88E73" strokeWidth={16} />
          <circle cx={RUG} cy={RUG} r={RUG - 34} fill="none" stroke={F.bronze} strokeWidth={2.5} strokeOpacity={0.6} />
        </svg>
      </div>
      {/* the rug's stitched edge: a ring, drawn unrotated (a turning dash pattern aliases into false steps) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: RUG * 2, height: RUG * 2, transform: `translate(${TX - RUG}px, ${TY - RUG}px) scale(${mix(0.3, 1, tin)})`, opacity: clamp(tin * 2.5) }}>
        <svg width={RUG * 2} height={RUG * 2} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={RUG} cy={RUG} r={RUG - 9} fill="none" stroke="#D9C8B0" strokeWidth={6} strokeDasharray="10 8" />
        </svg>
      </div>
      {/* chairs */}
      {Array.from({ length: 8 }, (_, i) => {
        const p = spring(t, PLAN0 + 0.12 + i * 0.045, 0.6, 0.8);
        const [x, y] = seatXY(i, mix(TR - 60, SR + 8, p), rot);
        const a = i * 45 + rot;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 132, height: 118, opacity: clamp(p * 3), willChange: "transform", transform: `translate3d(${x - 66}px, ${y - 59}px, 0) rotate(${a}deg)` }}>
            <div style={{ position: "absolute", left: 10, top: 18, width: 112, height: 92, borderRadius: 26, background: "linear-gradient(180deg, #E7DDCF, #D8CCBB)", boxShadow: "0 10px 22px rgba(39,38,36,0.18), inset 0 2px 0 rgba(255,255,255,0.6)" }} />
            <div style={{ position: "absolute", left: 4, top: 0, width: 124, height: 26, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(180deg, #A68C71, #7E654D)", boxShadow: "0 6px 12px rgba(39,38,36,0.25)" }} />
          </div>
        );
      })}
      {/* the round table, top-down: oak with a linen runner ring, place settings, the mark at its heart */}
      <div style={{ position: "absolute", left: 0, top: 0, width: TR * 2, height: TR * 2, transform: `translate(${TX - TR}px, ${TY - TR}px) rotate(${rot}deg) scale(${mix(0.4, 1, tin)})`, opacity: clamp(tin * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", boxShadow: "0 30px 70px -20px rgba(39,38,36,0.45)" }}>
          {/* light oak, its grain from fractal noise */}
          <svg width={TR * 2} height={TR * 2} style={{ position: "absolute", left: 0, top: 0 }}>
            <filter id="oak" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.005 0.11" numOctaves={4} seed={7} />
              <feColorMatrix type="matrix" values="0.62 0 0 0 0.54  0.56 0 0 0 0.46  0.48 0 0 0 0.36  0 0 0 0 1" /></filter>
            <rect width={TR * 2} height={TR * 2} filter="url(#oak)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from 20deg, rgba(255,250,240,0.35), rgba(120,95,70,0.12), rgba(255,250,240,0.3), rgba(120,95,70,0.16), rgba(255,250,240,0.35))` }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 0 10px #B89F80, inset 0 0 0 12px rgba(255,255,255,0.45), inset 0 0 40px rgba(60,45,30,0.25)" }} />
        </div>
        <div style={{ position: "absolute", left: TR - 96, top: TR - 96, width: 192, height: 192, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FBF8F2, #EEE6DA)", boxShadow: "0 6px 18px rgba(39,38,36,0.18)" }} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = ((i * 45 - 90) * Math.PI) / 180, px = TR + Math.cos(a) * 160, py = TR + Math.sin(a) * 160;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: px - 30, top: py - 30, width: 60, height: 60, borderRadius: 60, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #EFE9E0 60%, #DCD3C6)", boxShadow: "0 4px 8px rgba(39,38,36,0.2)" }} />
              <div style={{ position: "absolute", left: px - 15, top: py - 15, width: 30, height: 30, borderRadius: 30, border: "2px solid rgba(143,118,94,0.45)" }} />
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 130, height: 130, transform: `translate(${TX - 65}px, ${TY - 65}px) rotate(${rot}deg) scale(${tin})` }}><Mark size={130} tone="bronze" /></div>
      {/* the links: elegant bronze curves across the table between seats */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {LINKS.map(([i, j, at], k) => {
          const p = ease((t - at) / 0.5);
          if (p <= 0) return null;
          const [x1, y1] = seatXY(i, SR - 52, rot), [x2, y2] = seatXY(j, SR - 52, rot);
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
          const om = Math.hypot(mx - TX, my - TY) || 1, bend = 0.28 * L;   // bow away from the table's centre
          const cx = mx + ((mx - TX) / om) * bend, cy = my + ((my - TY) / om) * bend;
          return <path key={k} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`} pathLength={1} fill="none" stroke={F.bronze} strokeWidth={5} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />;
        })}
      </svg>
      {/* initials fill the seats on "ambitious minds" */}
      {INIT.map((s, i) => {
        const p = spring(t, w("minds") - 0.3 + i * 0.06, 0.5, 0.65);
        const [x, y] = seatXY(i, SR + 8, rot);
        const tone = i % 3;
        return (
          <div key={s} style={{ position: "absolute", left: 0, top: 0, width: 96, height: 96, willChange: "transform", transform: `translate3d(${x - 48}px, ${y - 48}px, 0) scale(${clamp(p) * 0.9 + Math.max(0, p - 1) * 0.6})`, opacity: clamp(p * 4),
            borderRadius: 96, background: tone === 0 ? F.ink : tone === 1 ? `linear-gradient(160deg, #A58B70, ${F.bronze})` : "#FBF8F2", border: tone === 2 ? `3px solid ${F.bronze}` : "none",
            boxShadow: "0 10px 24px rgba(39,38,36,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 38, letterSpacing: "0.02em", color: tone === 2 ? F.ink : F.cream }}>{s}</div>
        );
      })}
      {/* speech bubbles pop between neighbours on "real conversations" */}
      {[0, 2, 4, 6].map((i, k) => {
        const at = [w("real"), w("real") + 0.1, w("conversations2") - 0.1, w("conversations2")][k];
        const p = spring(t, at, 0.45, 0.65);
        if (p <= 0) return null;
        const [x, y] = seatXY(i + 0.5, BR, rot);
        const [sx, sy] = seatXY(i + 0.5, SR, rot);
        const ta = Math.atan2(sy - y, sx - x) * 180 / Math.PI;
        const dots = [0, 1, 2].map((d) => 0.5 + 0.5 * Math.sin(t * 9 - d * 0.9 + k));
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 150, height: 96, willChange: "transform", transform: `translate3d(${x - 75}px, ${y - 48}px, 0) scale(${p})`, opacity: clamp(p * 3) }}>
            <div style={{ position: "absolute", left: 75 - 16, top: 48 - 16, width: 32, height: 32, background: k % 2 ? F.ink : "#FFFDF9", transform: `rotate(${ta}deg) translateX(46px) rotate(45deg)`, borderRadius: 4 }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: 48, background: k % 2 ? F.ink : "#FFFDF9", boxShadow: "0 14px 30px rgba(39,38,36,0.22)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              {dots.map((d, q) => <div key={q} style={{ width: 16, height: 16, borderRadius: 16, background: k % 2 ? F.tan : F.bronze, transform: `translateY(${-d * 8}px)`, opacity: 0.6 + d * 0.4 }} />)}
            </div>
          </div>
        );
      })}
      {/* warm light rising from the table's centre */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 1600, transform: `translate(${TX - 800}px, ${TY - 800}px) scale(${mix(0.1, 1.4, glowIn)})`, opacity: glowIn,
        background: `radial-gradient(circle, ${F.sunset} 0%, rgba(241,215,184,0.85) 30%, rgba(247,244,239,0) 68%)` }} />
    </div>
  );
};
const PlanText: React.FC<{ t: number }> = ({ t }) => {
  if (t < PLAN0) return null;
  const X = 128, S = 104;
  return (
    <>
      <KickerOut t={t} at={w("just") - 0.05} out={32.2} text="Meet across disciplines" x={X + 4} y={300} />
      <Line t={t} words={[{ text: "Just", at: w("just") }, { text: "ambitious", at: w("ambitious2"), it: true }]} x={X} y={360} size={S} out={w("real") - 0.22} />
      <Line t={t} words={[{ text: "minds,", at: w("minds"), it: true }]} x={X} y={486} size={S} out={w("real") - 0.16} />
      <Line t={t} words={[{ text: "Real", at: w("real") }]} x={X} y={360} size={S} out={w("and4") - 0.2} />
      <Line t={t} words={[{ text: "conversations,", at: w("conversations2"), it: true }]} x={X} y={486} size={S} out={w("and4") - 0.14} />
      <Line t={t} words={[{ text: "and", at: w("and4") }, { text: "connections", at: w("connections2") }]} x={X} y={360} size={S} out={32.25} od={0.2} />
      <Line t={t} words={[{ text: "that", at: w("that"), it: true }, { text: "matter.", at: w("matter") - 0.05, it: true, d: 0.24 }]} x={X} y={486} size={S} out={32.31} od={0.18} />
    </>
  );
};

// ---------------------------------------------------------------- the segment
export const SegD: React.FC<{ t: number }> = ({ t }) => {
  // hand-in: H3Ink drawn unchanged for 0.25 s
  if (t < H3 + 0.25) return <AbsoluteFill><H3Ink t={t} /></AbsoluteFill>;
  // hand-out: H4Glow drawn unchanged from H4 - 0.25 s
  if (t >= H4 - 0.25) return <AbsoluteFill><H4Glow t={t} /></AbsoluteFill>;
  const glowMask = clamp((t - 32.22) / 0.38);
  const gr = mix(-160, 1500, Math.pow(glowMask, 2.2));
  return (
    <AbsoluteFill>
      {t < 28.4 && <H3Ink t={t} />}
      {t < 25.8 && <Line t={t} words={[{ text: "No", at: Math.max(H3 + 0.27, w("no")) }, { text: "awkward", at: w("awkward"), it: true }]} x={130} y={330} size={140} color={F.cream} accent={ACC} out={25.42} />}
      {t < 25.8 && <Line t={t} words={[{ text: "networking.", at: w("networking2") }]} x={130} y={490} size={140} color={F.cream} accent={ACC} out={25.48} />}
      <Sticker t={t} />
      <Rolodex t={t} />
      {t > 25.6 && t < 28.3 && (
        <>
          <Line t={t} words={[{ text: "No", at: w("no2") }, { text: "endless", at: w("endless"), it: true }]} x={1030} y={290} size={112} color={F.cream} accent={ACC} out={JAM + 0.4} od={0.2} />
          <Line t={t} words={[{ text: "business", at: w("business") }, { text: "card", at: w("card") }]} x={1030} y={430} size={112} color={F.cream} accent={ACC} out={JAM + 0.44} od={0.2} />
          <Line t={t} words={[{ text: "exchanges.", at: JAM, d: 0.4 }]} x={1030} y={570} size={112} color={F.cream} accent={ACC} out={JAM + 0.48} od={0.2} />
        </>
      )}
      <ExpandCard t={t} />
      <Plan t={t} />
      <PlanText t={t} />
      {glowMask > 0 && (
        <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `radial-gradient(circle at ${TX}px ${TY}px, #000 ${gr}px, rgba(0,0,0,0) ${gr + 160}px)`, maskImage: `radial-gradient(circle at ${TX}px ${TY}px, #000 ${gr}px, rgba(0,0,0,0) ${gr + 160}px)` }}>
          <H4Glow t={t} />
        </div>
      )}
    </AbsoluteFill>
  );
};
