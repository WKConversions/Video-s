// 2D shots for the realism demo, built as motion design: real 3D camera moves (perspective, translateZ, rotateX/Y)
// on speed ramps (eased, never linear), springs that overshoot and settle, motion blur from the speed of each move,
// depth of field from depth, and the joints to the neighbouring shots (J1–J5) built into each shot's first and last
// frame. Each shot takes t = local seconds from its start and fills 1920×1080.
import React, { useId } from "react";
import { AbsoluteFill, Easing, spring, staticFile } from "remotion";
import { C, SERIF, SANS, SCREEN_GRAD, OUT, INOUT, ramp, clamp01, mix, Wordmark } from "./kit";

// ───────────────────────────────── motion helpers
const FR = 60;
/** local time of a shot's last frame (a hair early, so float error never leaves a joint short of 100 %) */
const lastT = (dur: number) => dur - 1 / FR - 1e-4;
const k01 = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const inPow = (x: number, n: number) => Math.pow(clamp01(x), n);
const outPow = (x: number, n: number) => 1 - Math.pow(1 - clamp01(x), n);
type Cfg = { damping: number; mass: number; stiffness: number };
/** remotion spring started at a (s), driven by t */
const sp = (t: number, a: number, config: Cfg) => spring({ frame: Math.max(0, (t - a) * FR), fps: FR, config });
/** how much f changes over one frame at t (drives the motion blur) */
const perFrame = (f: (t: number) => number, t: number) => f(t + 0.5 / FR) - f(t - 0.5 / FR);
/** damped spring that starts at x0 moving at v0 (units/s) and settles at 0: a whip that lands */
const settle = (t: number, x0: number, v0: number, w0: number, z: number) => {
  const wd = w0 * Math.sqrt(1 - z * z);
  return Math.exp(-z * w0 * t) * (x0 * Math.cos(wd * t) + ((v0 + z * w0 * x0) / wd) * Math.sin(wd * t));
};

/** a directional (x/y) gaussian for `filter: url(#id)`: cheap motion blur along a move */
const useFilterId = () => "mb" + useId().replace(/[^a-zA-Z0-9]/g, "");
const DirBlur: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => (
  <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
      <feGaussianBlur stdDeviation={`${x.toFixed(2)} ${y.toFixed(2)}`} />
    </filter>
  </svg>
);
const dirFilter = (id: string, x: number, y: number) => (x > 0.4 || y > 0.4 ? `url(#${id})` : undefined);
const blurPx = (b: number) => (b > 0.25 ? `blur(${b.toFixed(2)}px)` : undefined);

// 3D: the same transform chain as the CSS, for the points we need on screen (focus, the dot that blooms)
type V3 = [number, number, number];
const RAD = Math.PI / 180;
const rotX = ([x, y, z]: V3, d: number): V3 => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return [x, y * c - z * s, y * s + z * c]; };
const rotY = ([x, y, z]: V3, d: number): V3 => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return [x * c + z * s, y, -x * s + z * c]; };
const project = ([x, y, z]: V3, P: number) => { const s = P / (P - z); return { x: 960 + x * s, y: 540 + y * s, s }; };

const DARK_BG = `radial-gradient(ellipse 80% 70% at 50% 45%, ${C.nightSage} 0%, ${C.night} 100%)`;
/** the full-frame sage glow shared by the last frame of Cards and the first frame of EndCard (J5) */
const SAGE_GLOW_FULL = `radial-gradient(ellipse 78% 78% at 50% 50%, ${C.sageTint} 0%, ${C.glow} 30%, ${C.sageLight} 62%, ${C.sage} 100%)`;

// ───────────────────────────────── 1. WordsSpace (1.4 s)
// J1 in: the phone screen's sage light we pushed through falls away into the dark space, the horizon draws out.
// The words fly in from deep z on springs while the camera dollies on a fast-slow-fast ramp: the side words pass the
// camera in a depth blur, focus racks to the far orb, the orb blooms to full #FAFAF8 (J2 out).
export const WORDS_SPACE_DUR = 1.4;
type Word = { s: string; x: number; y: number; z: number; a: number; size: number; serif?: boolean };
const WORDS: Word[] = [
  { s: "Bygget af AI.", x: 0, y: -48, z: -40, a: 0.03, size: 98, serif: true },
  { s: "Ingen teknik.", x: -440, y: -196, z: 110, a: 0.16, size: 44 },
  { s: "Ingen skabeloner.", x: 335, y: 82, z: 190, a: 0.26, size: 40 },
];
const WORD_SPRING: Cfg = { stiffness: 120, mass: 0.6, damping: 12.5 }; // ζ≈0.74: lands with a small overshoot
const rnd = (i: number, n: number) => { const v = Math.sin(i * 127.1 + n * 311.7) * 43758.5453; return v - Math.floor(v); };
const DUST = Array.from({ length: 22 }, (_, i) => ({
  x: mix(-1500, 1500, rnd(i, 1)), y: mix(-820, 700, rnd(i, 2)), z: mix(-2300, 520, rnd(i, 3)), r: mix(3, 8, rnd(i, 4)),
}));

export const WordsSpace: React.FC<{ t: number }> = ({ t }) => {
  const L = lastT(WORDS_SPACE_DUR);
  const P = 1100;
  // camera: the push's momentum easing out, a slow glide to read, then a speed ramp into the light
  const camZ = (u: number) => 170 * outPow(u / 0.6, 3) + 85 * u + 600 * inPow((u - 0.84) / (L - 0.84), 3);
  const camX = mix(-60, 45, INOUT(clamp01(t / L)));
  const camY = mix(-20, 18, INOUT(clamp01(t / L)));
  const yaw = mix(-1.6, 1.4, INOUT(clamp01(t / L)));
  const roll = 1.1 * outPow(t / 0.7, 2) - 3.2 * inPow((t - 0.85) / (L - 0.85), 2); // banks into the light
  const cz = camZ(t);
  // focus: the hero, then a rack to the far orb as we accelerate
  const zHero = (u: number) => WORDS[0].z + (-2500 - WORDS[0].z) * (1 - sp(u, WORDS[0].a, WORD_SPRING));
  const sHero = P / (P - (zHero(t) + cz));
  const focusS = mix(Math.max(sHero, 0.6), 0.85, INOUT(k01(t, 0.86, 1.25)));

  // J1: the screen light falls away
  const fall = outPow(t / 0.26, 2);
  // the orb: a dot on the horizon, then a bloom to full cream-white (J2)
  const hy = 762 + 0.05 * cz;
  const orbIn = ramp(t, 0.6, 0.2);
  const bloom = k01(t, 0.95, L);
  const orbR = 9 + 3 * Math.sin(t * 14) * (1 - bloom) + 2900 * inPow(bloom, 2.7);
  const core = mix(0.12, 0.62, bloom);

  return (
    <AbsoluteFill style={{ background: DARK_BG, overflow: "hidden" }}>
      {/* calm: sage haze over the horizon, and the spill of the light we came through */}
      <div style={{ position: "absolute", left: -200, right: -200, top: hy - 230, height: 460,
        background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${C.sage}38 0%, transparent 70%)`, filter: "blur(24px)" }} />
      <AbsoluteFill style={{ opacity: 0.55 * (1 - outPow(t / 0.6, 2)),
        background: `radial-gradient(ellipse 70% 65% at 50% 50%, ${C.sage}66 0%, ${C.sageDark}22 55%, transparent 80%)` }} />
      {/* the glowing horizon, drawn out from the centre */}
      <div style={{ position: "absolute", left: -240, width: 2400, top: hy, height: 2, background: C.sageLight,
        opacity: 0.9, transform: `scaleX(${outPow(k01(t, 0.04, 0.62), 3) * mix(1, 1.08, cz / 900)})`,
        boxShadow: `0 0 12px 2px ${C.sageLight}, 0 0 60px 12px ${C.sage}aa, 0 0 180px 50px ${C.sage}55` }} />
      {/* the orb on the horizon, blooming */}
      {orbIn > 0 && (
        <div style={{ position: "absolute", left: 960 - orbR * 2, top: hy - orbR * 2, width: orbR * 4, height: orbR * 4,
          borderRadius: "50%", opacity: orbIn,
          background: `radial-gradient(circle closest-side, ${C.bg} 0%, ${C.bg} ${core * 50}%, ${C.glow} ${core * 50 + 10}%, ${C.sage}aa ${core * 50 + 24}%, ${C.sage}00 100%)` }} />
      )}
      {/* the 3D space: camera = rotateZ(roll) translateZ(dolly) rotateY(yaw) translate(-cam) */}
      <AbsoluteFill style={{ perspective: P, perspectiveOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transformStyle: "preserve-3d",
          transform: `rotateZ(${roll}deg) translateZ(${cz}px) rotateY(${yaw}deg) translate3d(${-camX}px, ${-camY}px, 0px)` }}>
          {DUST.map((d, i) => {
            const zEff = d.z + cz;
            if (zEff > P - 40) return null;
            const s = P / (P - zEff);
            const mb = Math.abs(perFrame((u) => P / (P - (d.z + camZ(u))), t)) * d.r * 4;
            const fog = clamp01((zEff + 2300) / 1500);
            const near = 1 - clamp01((s - 3) / 3);
            return (
              <div key={i} style={{ position: "absolute", left: -d.r, top: -d.r, width: d.r * 2, height: d.r * 2, borderRadius: "50%",
                background: C.glow, opacity: 0.4 * fog * near * ramp(t, 0.05, 0.3),
                filter: blurPx(Math.min(16, Math.abs(s - focusS) * 2.2 + mb)),
                transform: `translate3d(${d.x}px, ${d.y}px, ${d.z}px)` }} />
            );
          })}
          {WORDS.map((w, i) => {
            if (t < w.a) return null;
            const zAt = (u: number) => w.z + (-2500 - w.z) * (1 - sp(u, w.a, WORD_SPRING));
            const sAt = (u: number) => P / (P - (zAt(u) + camZ(u)));
            const z = zAt(t);
            const zEff = z + cz;
            if (zEff > P - 60) return null;
            const s = P / (P - zEff);
            const mb = Math.abs(perFrame(sAt, t)) * w.size * 1.1; // blur from the speed of the move
            const dof = Math.abs(s - focusS) * 5;
            const fog = clamp01((zEff + 2400) / 1500);
            const near = 1 - clamp01((s - 2.6) / 2.4);
            return (
              <div key={i} style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap",
                transform: `translate3d(${w.x}px, ${w.y}px, ${z}px) translate(-50%, -50%)`,
                opacity: ramp(t, w.a, 0.12) * fog * near * (w.serif ? 1 : 0.9),
                filter: blurPx(Math.min(30, dof + mb)),
                fontFamily: w.serif ? SERIF : SANS, fontWeight: 400, fontSize: w.size,
                color: w.serif ? C.cream : C.sageLight, letterSpacing: w.serif ? "-0.01em" : "0.01em",
                textShadow: w.serif ? `0 0 40px ${C.sage}66` : undefined }}>
                {w.s}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* J2: the bloom takes the frame, full #FAFAF8 on the last frame */}
      {bloom > 0 && <AbsoluteFill style={{ background: C.bg, opacity: inPow(bloom, 5) }} />}
      {/* J1: the phone screen's light we pushed through, rushing past and falling away */}
      {fall < 1 && (
        <AbsoluteFill style={{ background: SCREEN_GRAD, opacity: 1 - fall, transform: `scale(${1 + 0.7 * fall})`,
          filter: blurPx(26 * fall) }} />
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────────────── 2. FlowCheck (1.1 s)
// J3 in: full white. The camera dollies in and tracks along the row in 3D (yaw 14° → -8°, a fast-slow ramp) while the
// items arrive in turn; the ticks pop on springs, the arrows draw. J4 out: a whip to the left with motion blur.
export const FLOW_CHECK_DUR = 1.1;
const ENTER_SPRING: Cfg = { stiffness: 150, mass: 0.6, damping: 13 }; // ζ≈0.68
const TICK_SPRING: Cfg = { stiffness: 210, mass: 0.5, damping: 10.5 }; // ζ≈0.51: 0 → 1.15 → 1

const Tick: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const s = sp(t, a, TICK_SPRING);
  const draw = outPow(k01(t, a + 0.07, a + 0.27), 3);
  const ring = k01(t, a + 0.02, a + 0.4);
  return (
    <div style={{ position: "relative", width: 84, height: 84, flex: "none" }}>
      {ring > 0 && ring < 1 && (
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${C.sage}`,
          opacity: 0.55 * (1 - ring), transform: `scale(${1 + 0.8 * outPow(ring, 2)})` }} />
      )}
      <svg width={84} height={84} viewBox="0 0 84 84" style={{ display: "block", transform: `scale(${s})`, opacity: s > 0.01 ? 1 : 0 }}>
        <circle cx={42} cy={42} r={42} fill={C.sage} />
        <path d="M25 43 L37 55 L60 30" fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round"
          strokeLinejoin="round" strokeDasharray={52} strokeDashoffset={52 * (1 - draw)} />
      </svg>
    </div>
  );
};
const Arrow: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = outPow(k01(t, a, a + 0.2), 3);
  const head = outPow(k01(t, a + 0.12, a + 0.24), 2);
  return (
    <svg width={120} height={36} viewBox="0 0 120 36" style={{ display: "block", flex: "none", overflow: "visible" }}>
      <path d="M6 18 H108" fill="none" stroke={C.ink} strokeOpacity={0.45} strokeWidth={3.5} strokeLinecap="round"
        strokeDasharray={102} strokeDashoffset={102 * (1 - k)} />
      <path d="M95 6 L108 18 L95 30" fill="none" stroke={C.ink} strokeOpacity={0.45 * head} strokeWidth={3.5}
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray={36} strokeDashoffset={36 * (1 - head)} />
    </svg>
  );
};
const FlowWord: React.FC<{ t: number; a: number; s: string }> = ({ t, a, s }) => {
  const k = sp(t, a, ENTER_SPRING);
  const r = Math.max(0, 1 - k);
  return (
    <div style={{ flex: "none", whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 500, fontSize: 76, color: C.ink,
      letterSpacing: "-0.015em", opacity: clamp01(k * 1.5), filter: blurPx(r * 12),
      transform: `translate3d(0px, ${(1 - k) * 46}px, ${(1 - k) * -320}px)` }}>
      {s}
    </div>
  );
};
const FLOW_A = [0.03, 0.2, 0.3, 0.37, 0.5, 0.6, 0.66];
const TRACK_EASE = Easing.bezier(0.4, 0, 0.3, 1); // when each item arrives
const FlowRow: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 34, transformStyle: "preserve-3d" }}>
    <FlowWord t={t} a={FLOW_A[0]} s="Byg den" />
    <Arrow t={t} a={FLOW_A[1]} />
    <Tick t={t} a={FLOW_A[2]} />
    <FlowWord t={t} a={FLOW_A[3]} s="Se den" />
    <Arrow t={t} a={FLOW_A[4]} />
    <Tick t={t} a={FLOW_A[5]} />
    <FlowWord t={t} a={FLOW_A[6]} s="Så køber du" />
  </div>
);

export const FlowCheck: React.FC<{ t: number }> = ({ t }) => {
  const id = useFilterId();
  const L = lastT(FLOW_CHECK_DUR);
  // track along the row: easing in behind the arriving items, a long settle as "Så køber du" lands (then the whip)
  const U = TRACK_EASE(k01(t, 0, 0.88));
  const track = (u: number) => mix(-480, 300, TRACK_EASE(k01(u, 0, 0.88))) + 25 * u;
  const tx = track(t);
  // J4: the whip to the left on the last 0.2 s, accelerating out of frame (streaks still on the left at the cut)
  const whip = (u: number) => -1150 * inPow((u - (L - 0.2)) / 0.2, 3.4);
  const w = k01(t, L - 0.2, L);
  const yaw = mix(14, -8, U) - 12 * inPow(w, 2);
  // J3: we arrive out of the push into the white screen, dollying in and easing out
  const camZ = mix(-520, 120, outPow(t / 0.55, 3)) + 150 * inPow(t / L, 1.4);
  const pitch = mix(7, 3, OUT(clamp01(t / L)));
  // motion blur from the on-screen speed of the track and the whip
  const v = Math.abs(perFrame((u) => whip(u) - track(u), t));
  const mbx = Math.min(120, Math.max(0, v - 12) * 0.32);
  const groundIn = ramp(t, 0.05, 0.5);
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(26,22,20,0.10) 100%)" }} />
      <DirBlur id={id} x={mbx} y={mbx * 0.04} />
      <AbsoluteFill style={{ transform: `translateX(${whip(t)}px) rotate(${-1.6 * inPow(w, 2)}deg)`, filter: dirFilter(id, mbx, mbx * 0.04) }}>
        <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", left: 960, top: 530, width: 0, height: 0, transformStyle: "preserve-3d",
            transform: `translateZ(${camZ}px) rotateX(${pitch}deg) rotateY(${yaw}deg) translateX(${-tx}px)` }}>
            {/* soft floor shadow */}
            <div style={{ position: "absolute", left: -820, top: 40, width: 1640, height: 70, borderRadius: "50%",
              background: "rgba(26,22,20,0.13)", filter: "blur(22px)", opacity: groundIn }} />
            {/* floor reflection */}
            <div style={{ position: "absolute", left: 0, top: 0, opacity: 0.07 * groundIn, filter: "blur(2px)",
              transform: "translate(-50%, 0) translateY(54px) scaleY(-1)",
              WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 55%)", maskImage: "linear-gradient(to top, #000 0%, transparent 55%)" }}>
              <FlowRow t={t} />
            </div>
            <div style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transform: "translate(-50%, -50%)" }}>
              <FlowRow t={t} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────────────── 3. Cards (1.3 s)
// J4 in: the whip arrives from the right and lands on a spring. The cards fan apart in z on springs while the camera
// orbits (yaw on a fast-slow-fast ramp) with a rack focus from the back card to the front card. J5 out: the camera
// pans and pushes onto the front card's sage dot, whose light grows into the full-frame sage glow.
export const CARDS_DUR = 1.3;
const CARD_LABELS = ["Hjemmeside", "Domæne", "E-mail"];
const FAN_SPRING: Cfg = { stiffness: 140, mass: 0.7, damping: 13 }; // ζ≈0.66: fans out past its mark and settles
const CARD_W = 900, CARD_H = 140, DOT = 26, DOT_X = -CARD_W / 2 + 54 + DOT / 2;
const cardPos = (i: number, f: number): V3 => [mix(0, i * 40, f), mix(200 - i * 26, 200 - i * 215, f), mix(-i * 30, -i * 300, f)];

export const Cards: React.FC<{ t: number }> = ({ t }) => {
  const id = useFilterId();
  const L = lastT(CARDS_DUR);
  const P = 1600;
  // J4: arrival from the right on a damped spring that starts at the outgoing whip's speed
  const wx = (u: number) => settle(Math.max(0, u), 1300, -19500, 16, 0.78);
  const x = wx(t);
  // the orbit: fast (carrying the whip) → slow (read) → fast (into the dot)
  const u = clamp01(t / L);
  const U = u + (0.55 * Math.sin(2 * Math.PI * u)) / (2 * Math.PI);
  const yaw = -26 + 32 * U;
  const pitch = mix(13, 6, OUT(u));
  const end = k01(t, L - 0.32, L); // J5
  const dolly = 150 + 90 * outPow(t / 0.6, 2) + 520 * inPow(end, 2.6);
  const zc = -300 + dolly;
  const toCam = (p: V3): V3 => { const q = rotX(rotY([p[0], p[1], p[2] + 300], yaw), pitch); return [q[0], q[1], q[2] + zc]; };
  const fan = CARD_LABELS.map((_, i) => sp(t, 0.1 + i * 0.06, FAN_SPRING));
  const pos = CARD_LABELS.map((_, i) => cardPos(i, fan[i]));
  const sc = pos.map((p) => project(toCam(p), P).s);
  // rack focus: back card → front card
  const focusS = mix(sc[2], sc[0], INOUT(k01(t, 0.42, 0.86)));
  // J5: the front card's dot on screen; the camera pans it to the centre while its light blooms
  const dot = project(toCam([pos[0][0] + DOT_X, pos[0][1], pos[0][2]]), P);
  const panK = inPow(end, 1.7);
  const panX = (960 - dot.x) * panK, panY = (540 - dot.y) * panK;
  const gx = dot.x + x + panX, gy = dot.y + panY;
  const gR = (DOT / 2) * dot.s * 3 + 3000 * inPow(end, 3);
  // motion blur from the whip (x) and the pan
  const mbx = Math.min(120, Math.abs(perFrame(wx, t)) * 0.22 + Math.abs(perFrame((v) => inPow(k01(v, L - 0.32, L), 1.7), t) * (960 - dot.x)) * 0.25);
  const mby = Math.min(40, Math.abs(perFrame((v) => inPow(k01(v, L - 0.32, L), 1.7), t) * (540 - dot.y)) * 0.25) + mbx * 0.03;

  return (
    <AbsoluteFill style={{ background: DARK_BG, overflow: "hidden" }}>
      {/* calm sage haze behind the stack, with a slow parallax of its own */}
      <div style={{ position: "absolute", left: 960 - 650, top: 560 - 330, width: 1300, height: 660, transform: `translate(${x * 0.18 + panX * 0.3}px, ${panY * 0.3}px)`,
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${C.sage}36 0%, transparent 70%)`, filter: "blur(30px)" }} />
      <DirBlur id={id} x={mbx} y={mby} />
      <AbsoluteFill style={{ transform: `translate(${x + panX}px, ${panY}px) rotate(${x * -0.0016}deg)`, filter: dirFilter(id, mbx, mby) }}>
        <AbsoluteFill style={{ perspective: P, perspectiveOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transformStyle: "preserve-3d",
            transform: `translateZ(${zc}px) rotateX(${pitch}deg) rotateY(${yaw}deg) translateZ(300px)` }}>
            {[2, 1, 0].map((i) => {
              const p = pos[i];
              const dof = Math.min(14, Math.abs(sc[i] - focusS) * 24);
              const lit = i === 0 ? end : 0;
              return (
                <div key={i} style={{ position: "absolute", left: -CARD_W / 2, top: -CARD_H / 2, width: CARD_W, height: CARD_H,
                  borderRadius: 30, boxSizing: "border-box", border: "1px solid rgba(255,255,255,0.10)",
                  background: "linear-gradient(180deg, rgba(46,61,56,0.94) 0%, rgba(25,35,32,0.96) 100%)",
                  boxShadow: `0 40px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 ${40 + 80 * lit}px ${C.sage}${i === 0 ? "33" : "14"}`,
                  display: "flex", alignItems: "center", gap: 30, padding: "0 54px",
                  opacity: i === 0 ? 1 : ramp(t, 0, 0.06 + i * 0.05), filter: blurPx(dof),
                  transform: `translate3d(${p[0]}px, ${p[1]}px, ${p[2]}px)` }}>
                  <div style={{ width: DOT, height: DOT, borderRadius: DOT / 2, background: lit > 0.3 ? C.glow : C.sage, flex: "none",
                    boxShadow: `0 0 ${16 + 50 * lit}px ${8 * lit}px ${C.sage}`, transform: `scale(${1 + 2.5 * inPow(lit, 1.4)})` }} />
                  <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 56, color: C.cream, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
                    {CARD_LABELS[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* J5: the dot's light grows to fill the frame */}
      {end > 0 && (
        <>
          <div style={{ position: "absolute", left: gx - gR, top: gy - gR, width: gR * 2, height: gR * 2, borderRadius: "50%",
            background: `radial-gradient(circle closest-side, ${C.sageTint} 0%, ${C.glow} 16%, ${C.sageLight}ee 34%, ${C.sage}aa 54%, ${C.sage}44 76%, ${C.sage}00 100%)`,
            opacity: clamp01(end * 5) }} />
          <AbsoluteFill style={{ background: SAGE_GLOW_FULL, opacity: inPow(end, 4) }} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────────────── 4. EndCard (1.6 s)
// J5 in: the full sage glow contracts into the sage gradient. The wordmark lands in 3D (mask wipe + blur + spring
// scale 1.12 → 1), a light glint crosses it, the line and the URL rise on springs; the camera pushes in to the end.
export const END_CARD_DUR = 1.6;
const END_BG = `radial-gradient(ellipse 110% 95% at 50% 6%, ${C.sageLight} 0%, ${C.sage} 36%, ${C.sageDark} 76%, ${C.sageDeep} 100%)`;
const WM_SPRING: Cfg = { stiffness: 110, mass: 0.8, damping: 12 }; // ζ≈0.64: a small overshoot
const RISE_SPRING: Cfg = { stiffness: 130, mass: 0.7, damping: 14 };
const WM_W = 820, WM_H = (WM_W * 1511) / 7208;

export const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const L = lastT(END_CARD_DUR);
  const u = clamp01(t / L);
  // continuous push: eased, still moving on the last frame
  const push = 1 + 0.055 * OUT(u) + 0.04 * u;
  const drift = mix(-5, 2.5, OUT(u)); // a slow 3D yaw under the push
  const land = sp(t, 0.14, WM_SPRING);
  const wmScale = mix(1.12, 1, land);
  const wipe = outPow(k01(t, 0.18, 0.66), 3) * 135 - 20;
  const wmBlur = mix(16, 0, outPow(k01(t, 0.16, 0.62), 2));
  const glint = INOUT(k01(t, 0.78, 1.3));
  const line = sp(t, 0.56, RISE_SPRING);
  const url = sp(t, 0.78, RISE_SPRING);
  const bloomK = outPow(k01(t, 0, 0.62), 3);
  const bloomD = mix(3400, 1250, bloomK);
  const rise = (k: number, dy: number): React.CSSProperties => ({
    opacity: clamp01(k * 1.4), filter: blurPx(Math.max(0, 1 - k) * 10),
    transform: `translate3d(0px, ${(1 - k) * dy}px, ${(1 - k) * -120}px)`,
  });
  return (
    <AbsoluteFill style={{ background: C.sageDeep, overflow: "hidden" }}>
      {/* the gradient (calm: it moves at a third of the foreground's push) */}
      <AbsoluteFill style={{ background: END_BG, transform: `scale(${1 + (push - 1) * 0.35})` }} />
      {/* the bloom contracting */}
      <div style={{ position: "absolute", left: 960 - bloomD / 2, top: 540 - bloomD / 2, width: bloomD, height: bloomD, borderRadius: "50%",
        opacity: mix(1, 0.2, outPow(k01(t, 0.04, 0.75), 2)),
        background: `radial-gradient(circle closest-side, ${C.sageTint} 0%, ${C.glow} 34%, ${C.sageLight}aa 62%, ${C.sageLight}00 100%)` }} />
      {/* the foreground, in 3D */}
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 50%" }}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d",
          transform: `scale(${push}) translateZ(${(1 - land) * -90}px) rotateX(${(1 - land) * 7}deg) rotateY(${drift}deg)` }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transformStyle: "preserve-3d" }}>
            <div style={{ position: "relative", width: WM_W, height: WM_H, transform: `scale(${wmScale})`, opacity: ramp(t, 0.14, 0.12),
              filter: blurPx(wmBlur),
              WebkitMaskImage: `linear-gradient(100deg, #000 ${wipe}%, transparent ${wipe + 18}%)`,
              maskImage: `linear-gradient(100deg, #000 ${wipe}%, transparent ${wipe + 18}%)` }}>
              <Wordmark w={WM_W} />
              {/* a light glint across the letters */}
              {glint > 0 && glint < 1 && (
                <div style={{ position: "absolute", inset: 0,
                  WebkitMaskImage: `url(${staticFile("brand/creoble-wordmark-light.svg")})`, WebkitMaskSize: "100% 100%",
                  maskImage: `url(${staticFile("brand/creoble-wordmark-light.svg")})`, maskSize: "100% 100%",
                  background: `linear-gradient(105deg, transparent ${glint * 140 - 40}%, rgba(255,255,255,1) ${glint * 140 - 28}%, transparent ${glint * 140 - 16}%)` }} />
              )}
            </div>
            <div style={{ ...rise(line, 44), marginTop: 50, fontFamily: SANS, fontWeight: 400, fontSize: 38, color: C.cream, whiteSpace: "nowrap" }}>
              Hjemmeside og hosting, samlet ét sted.
            </div>
            <div style={{ ...rise(url, 36), marginTop: 26, fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.cream,
              letterSpacing: "0.08em", whiteSpace: "nowrap", opacity: clamp01(url * 1.4) * 0.92 }}>
              creoble.dk
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* J5: the full glow we arrive on, falling off fast */}
      {t < 0.32 && <AbsoluteFill style={{ background: SAGE_GLOW_FULL, opacity: 1 - outPow(t / 0.32, 2) }} />}
    </AbsoluteFill>
  );
};
