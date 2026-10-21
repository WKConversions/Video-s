// Segment D (15-20 s): fits your stack, the free audit, the end card.
//  10  15.00-16.55  the navy capsule (H3) opens like the Dynamic Island: "Plugs into your stack"; six tool chips fly
//                   in on arcs and dock in fixed slots around it (above and below, never beside it), connectors draw,
//                   data pulses run, status dots go green; the island rolls to "Your data stays yours." The whole
//                   constellation turns in 3D and leans left into the push.
//      16.42-16.85  push with momentum: the constellation flies out left, the audit card flies in from the right
//  11  16.60-17.70  the free-audit card: three checks tick in turn, the ring fills and turns green
//      17.66-18.15  iris: navy opens out of the ring's check
//  12  17.84-20.00  "TNOA." lands letter by letter inside a ring of agents, the capsule springs open into "Book a
//                   Call — Start Your Free Audit" (shine, press), the URL; the camera orbits to the last frame
// Everything is placed with transforms on static boxes; growing rounded shapes use clip-path inset on static boxes.
import React from "react";
import { AbsoluteFill } from "remotion";
import { B, SANS, clamp, mix, ease, inout, spring, bounce, BounceWords, H3, H3Capsule, SHADOW } from "../kit";

const PI = Math.PI;
const rad = (d: number) => (d * PI) / 180;
const gauss = (t: number, t0: number, w: number) => Math.exp(-Math.pow((t - t0) / w, 2));
const CHIP_SHADOW = "0 2px 5px rgba(11,18,32,0.06), 0 26px 50px -26px rgba(11,18,32,0.42)";
const BLUE_A = (a: number) => `rgba(37,99,235,${a})`;    // B.blue tints
const NAVY_A = (a: number) => `rgba(11,18,32,${a})`;     // B.navy tints

// ---------- timing ----------
const OPEN = H3 + 0.25;          // the island starts opening out of the hand-off capsule
const PLUG = 15.74;              // the chips plug in, one after another
const ROLL = 16.08;              // island text rolls to "Your data stays yours."
const PUSH = 16.42;              // push with momentum to the audit card
const TICKS = [16.9, 17.12, 17.34];
const RING_DONE = 17.5;
const IRIS = 17.66;
const IRIS_DUR = 0.5;

const pushP = (t: number) => spring(t, PUSH, 0.62, 0.82);
const deriv = (f: (x: number) => number, t: number) => (f(t + 1 / 240) - f(t - 1 / 240)) * 120;

// The hand-off capsule's own geometry, continued past its window so the morph starts exactly from it.
const h3 = (t: number) => { const p = 1 + Math.sin((t - H3) * 6) * 0.03; return { cy: 540 + Math.sin((t - H3) * 4) * 8, W: mix(180, 640, p), H: mix(54, 120, p) }; };

// a line of letters that spring up one after another (inline, so it can live inside the island)
const Letters: React.FC<{ t: number; at: number; text: string; size: number; color: string; accentFrom?: number; accent?: string; stagger?: number; weight?: number }> =
  ({ t, at, text, size, color, accentFrom = 9999, accent = B.sky, stagger = 0.016, weight = 700 }) => (
    <div style={{ display: "flex", fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: "-0.035em", whiteSpace: "pre", lineHeight: 1 }}>
      {text.split("").map((ch, i) => {
        const p = bounce(t, at + i * stagger, 0.5);
        return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * size * 0.8}px) scale(${0.5 + 0.5 * p})`, opacity: clamp(p * 2.2), color: i >= accentFrom ? accent : color }}>{ch}</span>;
      })}
    </div>
  );

const Sparkle: React.FC<{ size: number; rot: number; color?: string }> = ({ size, rot, color = B.white }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ display: "block" }}>
    <path d="M0 -40 C4 -12 12 -4 40 0 C12 4 4 12 0 40 C-4 12 -12 4 -40 0 C-12 -4 -4 -12 0 -40 Z" fill={color} transform={`rotate(${rot})`} />
  </svg>
);

// ======================================================================================================
// Shot 10: integrations docked around the Dynamic Island
// ======================================================================================================
// Six fixed slots on an ellipse: three above the island, three below. The side slots sit at +-45 deg / +-135 deg and
// the whole ring only sways one way by 8 deg -> -12 deg, so no chip ever enters the island's horizontal band.
// (narrow chips where the sway closes a gap, wide ones where it opens one)
export const TOOLS = ["Gmail & Outlook", "Slack", "HubSpot & Salesforce", "Google Sheets", "Stripe", "QuickBooks & Xero"];
const TOOL_ANG = [-131, -90, -49, 49, 90, 131].map(rad);
export const CHIP_T0 = { v: 14.897 };
// they fly in as opposite pairs (top-left + bottom-right, top + bottom, top-right + bottom-left); all still off-frame
// at 15.0 (the hand-off frame), the first pair breaks in on the very next frame
const CHIP_OFF = [0, 0.075, 0.15, 0.002, 0.077, 0.152];
const chipStart = (i: number) => CHIP_T0.v + CHIP_OFF[i];
const RX = 760, RY = 380, CY10 = 520;
const IW = 1320, IH = 200;             // the open island
const BW = 1600, BH = 380;             // the island's static box (larger than its overshoot)
const sway = (t: number) => rad(10) - rad(15) * (t - 15);   // one way (+10 deg -> -14 deg by the push), never stops

// the island's own geometry (size spring, position spring, centre)
const islandGeom = (t: number) => {
  const k = spring(t, OPEN, 0.62, 0.6);                 // island size (overshoots, settles)
  const kp = spring(t, OPEN, 0.7, 1);                   // island position (no overshoot)
  const g = h3(t);
  const cy = mix(g.cy, CY10 + Math.sin((t - 15) * 2.6) * 16, t < OPEN ? 0 : kp);
  return { k: t < OPEN ? 0 : k, kp, cy, W: mix(g.W, IW, t < OPEN ? 0 : k), H: mix(g.H, IH, t < OPEN ? 0 : k) };
};

// each chip's place (centre x, y in the constellation's plane, before the camera)
export const chipGeom = (t: number) => {
  const { cy } = islandGeom(t);
  return TOOLS.map((label, i) => {
    const st = chipStart(i);
    const th = TOOL_ANG[i] + sway(t);
    const s = spring(t, st, 0.62, 0.76), arc = ease((t - st) / 0.6);
    // plug in: each chip nudges toward the island and springs back as its status turns green
    const pl = PLUG + i * 0.05, plug = spring(t, pl, 0.3, 1) - spring(t, pl + 0.1, 0.5, 0.5);
    const rho = mix(2.5, 1, s) * (1 - 0.05 * plug), phi = th - 0.55 * (1 - arc);
    const x = 960 + RX * rho * Math.cos(phi), y = cy + RY * rho * Math.sin(phi) + 7 * Math.sin((t - 15) * 2.4 + i * 1.1);
    const sc = (0.72 + 0.28 * clamp(s)) * (1 + 0.05 * Math.sin(phi)) * (1 + 0.05 * plug);
    return { label, x, y, sc, rot: (1 - arc) * -28 + Math.sin((t - 15) * 2.1 + i * 1.3) * 2.2, on: bounce(t, pl + 0.07, 0.42), draw: ease((t - st - 0.42) / 0.24), st, op: t < st ? 0 : 1, cy };
  });
};

// the constellation's camera: flat during the hand-off, then it turns in 3D and leans left into the push. The turn is
// projected by hand (each chip is placed and scaled at its projected point) so nothing is painted into a 3D layer:
// text inside a 3D-transformed layer snaps to that layer's pixel grid and shakes when it moves slowly.
export const cam10 = (t: number) => {
  const P = pushP(t);
  const r = inout((t - OPEN) / 0.45);
  const u = Math.max(0, t - OPEN) / (PUSH - OPEN);
  const ry = -14 * u * r;                                   // one-way turn: the right side swings toward us
  const rx = 4 * Math.sin((t - OPEN) * 2.4) * r;
  const drift = r * (80 * u + 130 * u * u);                 // leans left, faster and faster, into the push
  const push = 1 + 0.06 * u * r;
  return { P, ry, rx, drift, push };
};
const PERSP10 = 2000;
const proj10 = (c: ReturnType<typeof cam10>, x: number, y: number) => {
  const X = x - 960, Y = y - 540, ax = rad(c.rx), ay = rad(c.ry);
  const y1 = Y * Math.cos(ax), z1 = Y * Math.sin(ax);
  const x2 = X * Math.cos(ay) + z1 * Math.sin(ay), z2 = -X * Math.sin(ay) + z1 * Math.cos(ay);
  const k = (PERSP10 / (PERSP10 - z2)) * c.push;
  return { x: 960 + x2 * k, y: 540 + y1 * k, k };
};
// the island's own rock (on top of the camera's turn)
export const islandRX = (t: number) => Math.sin((t - OPEN) * 3.2) * 9 * inout((t - OPEN) / 0.5);
export const islandRY = (t: number) => Math.sin((t - OPEN) * 2.8 + 0.4) * 11 * inout((t - OPEN) / 0.5);
// everything of shot 10 in screen space (before the push): chips, island centre and scale
export const layout10 = (t: number) => {
  const c = cam10(t);
  const chips = chipGeom(t).map((ch) => { const p = proj10(c, ch.x, ch.y); return { ...ch, x: p.x, y: p.y, sc: ch.sc * p.k }; });
  const ig = islandGeom(t);
  const ic = proj10(c, 960, ig.cy);
  return { c, chips, ig, ic };
};

const Chip: React.FC<{ label: string; x: number; y: number; s: number; rot: number; on: number; op: number }> = ({ label, x, y, s, rot, on, op }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, opacity: op }}>
    <div style={{ transform: `translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`, display: "flex", alignItems: "center", gap: 20, height: 112, padding: "0 44px 0 36px", borderRadius: 56,
      background: B.white, border: `1.5px solid ${B.line}`, boxShadow: CHIP_SHADOW, fontFamily: SANS, fontWeight: 600, fontSize: 43, letterSpacing: "-0.02em", color: B.navy, whiteSpace: "nowrap" }}>
      <div style={{ position: "relative", width: 22, height: 22 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 11, background: B.light }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 11, background: B.green, transform: `scale(${on})` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 11, border: `3px solid ${B.green}`, transform: `scale(${1 + 1.6 * clamp(on)})`, opacity: on > 0 ? 0.6 * (1 - clamp(on * 1.15 - 0.15)) : 0 }} />
      </div>
      {label}
    </div>
  </div>
);

const Integrations: React.FC<{ t: number }> = ({ t }) => {
  const { c, chips, ig, ic } = layout10(t);
  const { k, W, H } = ig;
  const lim = clamp(k * 2.5);
  const Lw = mix(640, BW, lim), Lh = mix(120, BH, lim);
  const roll = inout((t - ROLL) / 0.32);
  const glyph = bounce(t, OPEN + 0.16, 0.45), dot = bounce(t, OPEN + 0.26, 0.45);
  const shadowA = 0.42 * clamp(k * 1.5);
  return (
    <AbsoluteFill style={{ transform: `translateX(${-1600 * c.P - c.drift}px) scale(${1 - 0.3 * c.P})` }}>
        {/* connectors and data pulses */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {chips.map((ch, i) => {
            if (ch.draw <= 0) return null;
            const ex = mix(ch.x, ic.x, ch.draw), ey = mix(ch.y, ic.y, ch.draw);
            return (
              <g key={i}>
                <line x1={ch.x} y1={ch.y} x2={ex} y2={ey} stroke={BLUE_A(0.34)} strokeWidth={4} strokeLinecap="round" />
                {[0, 0.2, 0.4, 0.6, 0.8].map((o, j) => {
                  const f = ((t - ch.st) * 1.4 + o + i * 0.13) % 1;
                  const inward = j % 2 === 0;
                  const ff = inward ? f : 1 - f;
                  return <circle key={j} cx={mix(ch.x, ic.x, ff)} cy={mix(ch.y, ic.y, ff)} r={13} fill={inward ? B.blue : B.sky} opacity={Math.sin(f * PI) * clamp(ch.draw * 2 - 1)} />;
                })}
              </g>
            );
          })}
        </svg>
        {chips.map((ch, i) => <Chip key={i} label={ch.label} x={ch.x} y={ch.y} s={ch.sc} rot={ch.rot} on={ch.on} op={ch.op} />)}

        {/* the island */}
        {t < OPEN ? <H3Capsule t={t} /> : (
          // the shadow is a drop-shadow of the clipped, tilted capsule itself, so it can never poke out of it
          <AbsoluteFill style={{ filter: `drop-shadow(0 30px 30px ${NAVY_A(shadowA)})` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, willChange: "transform",
              transform: `translate(${ic.x - BW / 2}px, ${ic.y - BH / 2}px) scale(${ic.k}) perspective(1600px) rotateX(${islandRX(t) + c.rx}deg) rotateY(${islandRY(t) + 0.8 * c.ry}deg)`,
              clipPath: `inset(${(BH - Lh) / 2}px ${(BW - Lw) / 2}px)` }}>
              <div style={{ position: "absolute", inset: 0, background: B.navy, clipPath: `inset(${(BH - H) / 2}px ${(BW - W) / 2}px round ${H / 2}px)` }}>
                {/* left: the agent glyph */}
                <div style={{ position: "absolute", left: 0, top: 0, width: 112, height: 112, borderRadius: 56, background: `linear-gradient(140deg, ${B.sky}, ${B.blue})`,
                  transform: `translate(${BW / 2 - W / 2 + 44}px, ${BH / 2 - 56}px) scale(${glyph})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkle size={66} rot={(t - 15) * 120} />
                </div>
                {/* right: live dot */}
                <div style={{ position: "absolute", left: 0, top: 0, width: 30, height: 30, transform: `translate(${BW / 2 + W / 2 - 86}px, ${BH / 2 - 15}px) scale(${dot})` }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 15, background: B.green }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: 15, border: `3px solid ${B.green}`, transform: `scale(${1 + 1.4 * (((t - 15) * 1.6) % 1)})`, opacity: 0.8 * (1 - (((t - 15) * 1.6) % 1)) }} />
                </div>
                {/* the words, rolling inside the island */}
                <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `translate(26px, ${-roll * 170}px)`, opacity: 1 - clamp(roll * 1.4) }}>
                  <Letters t={t} at={OPEN + 0.1} text="Plugs into your stack" size={90} color={B.white} />
                </div>
                {t > ROLL && (
                  <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(26px, ${(1 - roll) * 60}px)` }}>
                    <Letters t={t} at={ROLL + 0.06} text="Your data stays yours." size={90} color={B.white} accentFrom={16} stagger={0.014} />
                  </div>
                )}
              </div>
            </div>
          </AbsoluteFill>
        )}
    </AbsoluteFill>
  );
};

// ======================================================================================================
// Shot 11: the free-audit card
// ======================================================================================================
const CW = 1160, CH = 660;
const ROWS: { text: string; tail?: string }[] = [
  { text: "Free 15-minute discovery call" },
  { text: "Free audit & roadmap", tail: " if there's a fit" },
  { text: "No obligation" },
];
const ROW_Y0 = 204, ROW_H = 140;
const CHECK_X = 92;
// the camera follows the checks down the card (capped so the card's top stays well inside the frame), then pulls
// back to show it whole
const sineIO = (x: number) => 0.5 - 0.5 * Math.cos(PI * clamp(x));
const PULL = TICKS[2] + 0.02;
const ZMAX = 0.1;
// the zoom-out starts a little before the pan turns back, so the turn never stops the picture
const camF = (t: number) => mix(mix(300, 425, sineIO((t - 16.72) / 0.66)), CH / 2, inout((t - PULL) / 0.3));
const camZ = (t: number) => 1 + ZMAX * ease((t - 16.45) / 0.45) - ZMAX * inout((t - (PULL - 0.08)) / 0.38);
const RING_O = { x: CW - 56 - 52 - CW / 2, y: 50 + 52 - CH / 2 };   // the progress ring, from the card centre
export const cardState = (t: number) => {
  const P = pushP(t);
  const calm = 1 - ease((t - 17.3) / 0.34);
  const ph = t - 16.4;
  const tx = 1700 * (1 - P);
  const z = camZ(t), F = camF(t);
  const ty = 30 * (z - 1) / ZMAX - (F - CH / 2) * z + Math.sin(ph * 2.6) * 12;
  const rotY = (Math.sin(ph * 2.3) * 6) * calm - (1 - P) * 22;
  const rotX = (Math.cos(ph * 1.9) * 3 - deriv(camF, t) * 0.008) * calm;
  const zoom = 1 + 0.5 * Math.pow(clamp((t - IRIS + 0.16) / (IRIS_DUR + 0.16)), 1.3);
  const jolt = TICKS.reduce((a, tk) => a + gauss(t, tk + 0.07, 0.07), 0);
  const sc = (0.86 + 0.14 * P) * z * zoom * (1 + 0.014 * jolt);
  const v = Math.abs(deriv(pushP, t));
  return { P, tx, ty, rotY, rotX, sc, stretch: 1 + 0.05 * clamp(v / 3.5) };
};

const Scorecard: React.FC<{ t: number }> = ({ t }) => {
  const s = cardState(t);
  const fill = TICKS.reduce((a, tk) => a + spring(t, tk, 0.5, 0.72), 0) / 3;
  const done = clamp((t - RING_DONE) / 0.2);
  const ringC = 2 * PI * 38;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 960 - CW / 2, top: 540 - CH / 2, width: CW, height: CH, borderRadius: 44, background: B.white, border: `1.5px solid ${B.line}`, boxShadow: SHADOW, overflow: "hidden", fontFamily: SANS,
        transform: `perspective(1800px) translate3d(${s.tx}px, ${s.ty}px, 0) rotateY(${s.rotY}deg) rotateX(${s.rotX}deg) scale(${s.sc * s.stretch}, ${s.sc / s.stretch})` }}>
        {/* header */}
        <div style={{ position: "absolute", left: 56, top: 52, width: 100, height: 100, borderRadius: 28, background: `linear-gradient(140deg, ${B.sky}, ${B.blue})`, display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${bounce(t, 16.62, 0.45)}) rotate(${(1 - bounce(t, 16.62, 0.45)) * -30}deg)`, boxShadow: `0 16px 30px -14px ${BLUE_A(0.8)}` }}>
          <Sparkle size={58} rot={(t - 16) * 90} />
        </div>
        <div style={{ position: "absolute", left: 186, top: 48, fontSize: 56, fontWeight: 700, letterSpacing: "-0.035em", color: B.navy, lineHeight: 1.1 }}>Start Your Free Audit</div>
        <div style={{ position: "absolute", left: 188, top: 118, fontSize: 30, fontWeight: 500, color: B.muted }}>TNOA · The Network of Agents</div>
        {/* progress ring */}
        <svg width={104} height={104} viewBox="-52 -52 104 104" style={{ position: "absolute", left: CW - 56 - 104, top: 50 }}>
          <circle r={38} fill="none" stroke={B.line} strokeWidth={10} />
          <circle r={38} fill="none" stroke={done > 0 ? B.green : B.blue} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${ringC * clamp(fill)} ${ringC}`} transform="rotate(-90)" />
          <g transform={`scale(${bounce(t, RING_DONE, 0.4)})`}>
            <circle r={26} fill={B.green} />
            <path d="M-11 0 L-3 8 L12 -8" fill="none" stroke={B.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 56, right: 56, top: ROW_Y0 - 1, height: 1.5, background: B.line }} />
        {/* rows */}
        {ROWS.map((r, i) => {
          const tk = TICKS[i];
          const enter = bounce(t, 16.56 + i * 0.09, 0.5);
          const pop = bounce(t, tk, 0.42);
          const draw = ease((t - tk - 0.04) / 0.18);
          const lit = clamp((t - tk) / 0.15);
          const flash = gauss(t, tk + 0.12, 0.18);
          const ripple = clamp((t - tk) / 0.5);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: ROW_Y0 + i * ROW_H, width: CW, height: ROW_H, transform: `translateY(${(1 - enter) * 90}px)`, opacity: clamp(enter * 2) }}>
              <div style={{ position: "absolute", left: 24, right: 24, top: 10, bottom: 10, borderRadius: 26, background: B.green, opacity: 0.1 * lit + 0.12 * flash }} />
              {i > 0 && <div style={{ position: "absolute", left: 56, right: 56, top: 0, height: 1.5, background: B.line }} />}
              <svg width={140} height={140} viewBox="-70 -70 140 140" style={{ position: "absolute", left: CHECK_X - 70, top: ROW_H / 2 - 70, overflow: "visible" }}>
                <circle r={31} fill="none" stroke={B.light} strokeWidth={3.5} />
                {t > tk && <circle r={31 + 34 * ripple} fill="none" stroke={B.green} strokeWidth={4} opacity={0.7 * (1 - ripple)} />}
                <g transform={`scale(${pop})`}>
                  <circle r={33} fill={B.green} />
                  <path d="M-14 1 L-4 11 L15 -10" fill="none" stroke={B.white} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="44" strokeDashoffset={44 * (1 - draw)} />
                </g>
              </svg>
              {/* the row fades up with rgba text colour, not opacity: an opacity group inside the turning card is
                  rasterised on its own pixel grid and shakes as the camera follows */}
              <div style={{ position: "absolute", left: 160, top: 0, height: ROW_H, display: "flex", alignItems: "center", fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em", color: NAVY_A(0.45 + 0.55 * lit), whiteSpace: "nowrap",
                transform: `translateX(${lit * 8 + gauss(t, tk + 0.1, 0.1) * 6}px)` }}>
                {r.text}{r.tail && <span style={{ color: `rgba(90,102,120,${0.45 + 0.55 * lit})`, fontWeight: 500, fontSize: 34, marginLeft: 14 }}>{r.tail.trim()}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ======================================================================================================
// Shot 12: navy iris, the end card
// ======================================================================================================
const LAND = 17.84;   // TNOA. starts to drop
const BTN_W = 1040, BTN_H = 120, BX_W = BTN_W + 240, BX_H = BTN_H + 80, TOUCH_X = BX_W / 2 + 430;
const BTN_Y = 716, URL_Y = 826, SUB_Y = 528;

// the network, orbiting the wordmark on a flat ring: the back arc runs above the letters (behind them), the front
// arc runs in the gap between the baseline and the subtitle, so it never crosses the letters or the sky full stop.
const ORBIT_N = 18, ORX = 760, ORY = 168, OCY = 326;
const ringPt = (th: number) => ({ x: 960 + ORX * Math.cos(th), y: OCY + ORY * Math.sin(th), d: Math.sin(th) });
const Orbit: React.FC<{ t: number; front: boolean }> = ({ t, front }) => {
  const draw = inout((t - 18.16) / 0.5);
  const per = 2 * PI * Math.sqrt((ORX * ORX + ORY * ORY) / 2);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {!front && <ellipse cx={960} cy={OCY} rx={ORX} ry={ORY} fill="none" stroke={BLUE_A(0.6)} strokeWidth={3} strokeDasharray={`${per * draw} ${per}`} transform={`rotate(180 960 ${OCY})`} />}
      {/* traffic: fine dots streaming round the ring */}
      {!front && <ellipse cx={960} cy={OCY} rx={ORX} ry={ORY} fill="none" stroke={B.white} strokeOpacity={0.42 * draw} strokeWidth={3.5} strokeLinecap="round" strokeDasharray="0.1 17.9" strokeDashoffset={-(t - 18) * 210} />}
      {Array.from({ length: ORBIT_N }, (_, j) => {
        const th = (j / ORBIT_N) * 2 * PI + 0.9 * (t - 18) + 0.9;
        const p = ringPt(th);
        if ((p.d >= 0) !== front) return null;
        const pop = bounce(t, 18.2 + ((j * 7) % ORBIT_N) * 0.025, 0.45);
        const k = (p.d + 1) / 2;
        const c = j % 3 === 0 ? B.white : B.blue;
        return <circle key={j} cx={p.x} cy={p.y} r={Math.max(0, (7 + 9 * k) * pop)} fill={c} opacity={0.4 + 0.6 * k} />;
      })}
      {/* two pulses of activity racing round the ring (white heads, fading trails) */}
      {[0, PI].map((o, c) => Array.from({ length: 9 }, (_, q) => {
        const th = o + 2.1 * (t - 18.35) + 2.2 - q * 0.04;
        const p = ringPt(th);
        if ((p.d >= 0) !== front) return null;
        const k = (p.d + 1) / 2;
        return <circle key={`${c}-${q}`} cx={p.x} cy={p.y} r={(8 + 4 * k) * (1 - q * 0.08)} fill={B.white} opacity={clamp((t - 18.35) * 4) * (1 - q / 9) * (0.4 + 0.6 * k)} />;
      }))}
    </svg>
  );
};

// the end card's camera: a slow orbit that never stops (one-way turn, truck left, push in)
const endCam = (t: number) => {
  const u = (t - IRIS) / (20 - IRIS);
  return {
    x: mix(125, -125, u),
    y: mix(20, -20, u) + Math.sin((t - 18) * 2.1) * 12,
    ry: mix(12, -12, u),
    rx: mix(5, -4, u),
    z: 0.97 + 0.1 * u,
  };
};

const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const s = cardState(t);
  // the iris opens out of the green ring check (the card has stopped turning by then)
  const ix = 960 + s.tx + RING_O.x * s.sc, iy = 540 + s.ty + RING_O.y * s.sc;
  const r = 2300 * Math.pow(clamp((t - IRIS) / IRIS_DUR), 1.5);
  const cam = endCam(t);
  const group = `perspective(1700px) translate(${cam.x}px, ${cam.y}px) rotateY(${cam.ry}deg) rotateX(${cam.rx}deg) scale(${cam.z})`;
  const lift = mix(150, 0, spring(t, 18.13, 0.7, 0.78));   // the wordmark lands centred, then rises to make room

  // the button: a capsule pops, then springs open
  const pop = bounce(t, 18.5, 0.42), open = spring(t, 18.64, 0.62, 0.62);
  const bw = mix(170, BTN_W, open), bh = mix(60, BTN_H, open);
  const press = 1 - 0.06 * (spring(t, 19.47, 0.22, 1) - spring(t, 19.6, 0.5, 0.5));
  const shine = (t0: number) => mix(BX_W / 2 - BTN_W / 2 - 300, BX_W / 2 + BTN_W / 2 + 80, inout((t - t0) / 0.55));
  const touch = clamp((t - 19.3) / 0.12) * (1 - clamp((t - 19.75) / 0.2));
  const ring = clamp((t - 19.5) / 0.45);
  return (
    <AbsoluteFill style={{ background: B.navy, clipPath: t > IRIS + IRIS_DUR ? undefined : `circle(${r}px at ${ix}px ${iy}px)` }}>
      <AbsoluteFill style={{ transform: group, transformStyle: "preserve-3d" }}>
        {/* TNOA. lands letter by letter, squashing on the landing */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${lift}px) translateZ(110px)` }}>
          {t > 18.14 && <Orbit t={t} front={false} />}
          <div style={{ position: "absolute", left: 0, top: 190, width: 1920, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 270, letterSpacing: "-0.04em", lineHeight: 1, color: B.white }}>
            {"TNOA.".split("").map((ch, i) => {
              const t0 = LAND + i * 0.075 + (i === 4 ? 0.06 : 0);
              const p = spring(t, t0, 0.5, 0.5);
              const fall = Math.min(p, 1), over = Math.max(0, p - 1);
              const stretch = clamp(deriv((x) => spring(x, t0, 0.5, 0.5), t) / 12) * (p < 1 ? 1 : 0);
              return <span key={i} style={{ display: "inline-block", transformOrigin: "50% 100%", color: i === 4 ? B.sky : B.white, opacity: clamp(p * 6),
                transform: `translateY(${(1 - fall) * -420}px) scale(${(1 + over * 0.4) / (1 + stretch * 0.1)}, ${(1 - over * 0.7) * (1 + stretch * 0.1)})` }}>{ch}</span>;
            })}
          </div>
          {t > 18.14 && <Orbit t={t} front />}
          <BounceWords t={t} at={18.22} text="The Network of Agents" cx={960} y={SUB_Y} size={52} color={B.light} stagger={0.014} weight={500} />
        </div>
        {/* the button: a static box larger than the open capsule (it overshoots), clipped to the capsule */}
        <div style={{ position: "absolute", left: 0, top: 0, width: BX_W, height: BX_H, transform: `translate(${960 - BX_W / 2}px, ${BTN_Y - BX_H / 2}px) translateZ(45px) scale(${pop * press})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: BX_W, height: BX_H, borderRadius: BX_H / 2, background: B.blue, opacity: clamp(pop),
            transform: `scale(${Math.max(0, bw - 40) / BX_W}, ${Math.max(0, bh - 16) / BX_H})`, boxShadow: `0 34px 60px -14px ${BLUE_A(0.8)}` }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 60%), ${B.blue}`, clipPath: `inset(${(BX_H - bh) / 2}px ${(BX_W - bw) / 2}px round ${bh / 2}px)` }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 42, letterSpacing: "-0.02em", color: B.white, whiteSpace: "nowrap",
              opacity: clamp((open - 0.55) * 3), transform: `translateY(${(1 - clamp(open)) * 30}px)` }}>Book a Call — Start Your Free Audit</div>
            {[19.0, 19.72].map((t0) => t > t0 && t < t0 + 0.6 && (
              <div key={t0} style={{ position: "absolute", left: 0, top: 0, width: 220, height: BX_H, transform: `translateX(${shine(t0)}px) skewX(-18deg)`, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))" }} />
            ))}
            {t > 19.5 && <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 120, borderRadius: 60, background: "rgba(255,255,255,0.35)", transform: `translate(${TOUCH_X - 60}px, ${BX_H / 2 - 60}px) scale(${0.3 + 7 * ring})`, opacity: 1 - ring }} />}
          </div>
          {/* the touch */}
          {touch > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: 84, height: 84, borderRadius: 42, background: "rgba(255,255,255,0.32)", border: "2px solid rgba(255,255,255,0.7)",
            transform: `translate(${TOUCH_X - 42}px, ${BX_H / 2 - 42}px) scale(${(1.35 - 0.35 * ease((t - 19.3) / 0.15)) * (1 - 0.15 * (spring(t, 19.47, 0.22, 1) - spring(t, 19.6, 0.5, 0.5)))})`, opacity: touch }} />}
        </div>
        <BounceWords t={t} at={19.16} text="thenetworkofagents.com" cx={960} y={URL_Y} size={40} color={B.light} stagger={0.012} weight={500} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SegD: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    {t < PUSH + 0.6 && <Integrations t={t} />}
    {t >= PUSH && t < IRIS + IRIS_DUR + 0.05 && <Scorecard t={t} />}
    {t >= IRIS && <EndCard t={t} />}
  </AbsoluteFill>
);
