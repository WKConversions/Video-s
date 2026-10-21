// Builder 3 (version 2) — B3, h2 → h3: the deal, one shot per sentence, never a still (plan/storyboard.md, shots 12–19).
// 12 "Tilfreds?" rides the whip in, its "?" lands on the word → zoom-through the type →
// 13 "499" rolls up from 000 out of depth while the number is spoken and keeps coming toward camera; on "kroner"
//    "kr" is thrown in as the shot leans in →
// 14 push up: the price leaves, "Én gang." rises with it and a single sage line draws under it →
// 15 push left: a giant Apple switch row "Abonnement" that turns OFF on the word →
// 16 the row recedes as Holm's site flies in tilted and lands; a Glass "Din" chip clips on; "Siden er din." →
// 17 the whole shot flips over (rotateY, critically damped) to sage: "Ikke tilfreds?" →
// 18 push down: "499 kr" in cream rolls DOWN to "0 kr" →
// 19 iris through the zero onto the ground: a shield-check draws where the 0 was, "Nul risiko." → whip out at h3.
import React from "react";
import {
  BAR, Browser, C, EXIT, Glass, HolmSite, INOUT, OUT, SANS, SERIF, SHADOW_BIG, WIPE,
  aspring, clamp01, f, kf, mix, whipFade, whipIn, whipOut,
} from "../shared";

const W = 1920, H = 1080;
// a spring that starts on a frame number (aspring takes labels or seconds)
const sp = (g: number, frame: number, response = 0.42, damping = 1) => aspring(g, frame / 30, response, damping);
// linear progress between two frames (for constant drifts: the cuts carry the starts and stops)
const lin = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));

/* ---------- local type ---------- */
// One word revealed through its own mask, springing up from below (p from aspring, 0 → 1).
const Word: React.FC<{ p: number; size: number; it?: boolean; color?: string; itColor?: string; children: React.ReactNode }> = ({ p, size, it, color, itColor = C.sageDeep, children }) => {
  const q = Math.min(1, Math.max(0, p));
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", padding: `${size * 0.22}px ${it ? size * 0.09 : size * 0.03}px ${size * 0.22}px ${size * 0.03}px`, margin: `${-size * 0.22}px ${it ? -size * 0.09 : -size * 0.03}px ${-size * 0.22}px ${-size * 0.03}px` }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - q) * 135}%) scale(${0.88 + 0.12 * q})`, transformOrigin: "50% 100%", fontStyle: it ? "italic" : "normal", color: it ? itColor : color }}>{children}</span>
    </span>
  );
};
const Line: React.FC<{ size: number; color?: string; gap?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ size, color = C.ink, gap = 0.24, children, style }) => (
  <div style={{ display: "flex", columnGap: size * gap, fontFamily: SERIF, fontWeight: 400, fontSize: size, letterSpacing: "-0.025em", lineHeight: 1.05, color, whiteSpace: "nowrap", ...style }}>{children}</div>
);

/* ---------- the switch ---------- */
// Creoble's sage switch at film size, driven straight by a spring; the knob stretches a little in transit (iOS).
const Switch: React.FC<{ on: number; size: number }> = ({ on, size }) => {
  const q = clamp01(on), tr = 4 * q * (1 - q), Wd = size * 1.7, kw = size * 0.84 * (1 + 0.26 * tr), pad = size * 0.08;
  return (
    <div style={{ width: Wd, height: size, borderRadius: size, background: `color-mix(in srgb, ${C.sage} ${q * 100}%, #DCD8D1)`, position: "relative", flex: "none" }}>
      <div style={{ position: "absolute", top: pad, left: pad + q * (Wd - 2 * pad - kw), width: kw, height: size - 2 * pad, borderRadius: size, background: C.white, boxShadow: "0 6px 16px rgba(26,22,20,0.18), 0 1px 3px rgba(26,22,20,0.12)" }} />
    </div>
  );
};

/* ---------- the counter (000 → 499 rolling up; 499 → 000 → "0" rolling down) ---------- */
// Each column rolls through the digits (dir 1: they come up from below; −1: they fall in from above), later columns a
// little later, with a gentle ease-out so the roll keeps travelling until it lands; `gone` collapses the leading
// columns (width and opacity) so "000" closes up to "0".
const CELL = 1.25, DIGW = 0.62;
const Roll: React.FC<{ from: number[]; to: number[]; dir: 1 | -1; p: number; size: number; color: string; gone?: number }> = ({ from, to, dir, p, size, color, gone = 0 }) => (
  <div style={{ display: "inline-flex", fontFamily: SERIF, fontSize: size, lineHeight: 1, color, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
    {from.map((a, i) => {
      const q = clamp01(p * 1.2 - i * 0.1), b = to[i];
      const turns = (dir > 0 ? (b - a + 10) % 10 : (a - b + 10) % 10) + (i === 0 ? 10 : 0);
      const pos = a + dir * turns * (1 - Math.pow(1 - q, 2.4)), m = ((pos % 10) + 10) % 10;
      const lead = i < from.length - 1 && gone > 0, w = lead ? 1 - gone : 1;
      return (
        <span key={i} style={{ display: "inline-block", height: size * CELL, overflow: "hidden", position: "relative", width: `${DIGW * w}em`, opacity: lead ? 1 - clamp01(gone * 1.6) : 1 }}>
          <span style={{ position: "absolute", left: 0, top: 0, width: `${DIGW}em`, transform: `translateY(${-m * size * CELL}px)` }}>
            {Array.from({ length: 11 }, (_, n) => <div key={n} style={{ height: size * CELL, lineHeight: `${size * CELL}px`, textAlign: "center" }}>{n % 10}</div>)}
          </span>
        </span>
      );
    })}
  </div>
);

/* ---------- the shield ---------- */
const Shield: React.FC<{ s: number; d: number; c: number; fill: number }> = ({ s, d, c, fill }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", overflow: "visible" }}>
    <path d="M24 5 L39 11 V23 c0 9 -6 16 -15 20 c-9 -4 -15 -11 -15 -20 V11 Z" fill={C.sageTint} stroke="none" opacity={fill} />
    <path d="M24 5 L39 11 V23 c0 9 -6 16 -15 20 c-9 -4 -15 -11 -15 -20 V11 Z" stroke={C.sageDeep} strokeWidth={2.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(d)} />
    <path d="M16.5 24.5 L22 30 L31.5 19" stroke={C.sage} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(c)} />
  </svg>
);

export const Scene3: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h2") || g >= f("h3")) return null;

  // ---- the clock: the words of this span, as frames ----
  const H2 = f("h2"), H3 = f("h3");
  const TIL = f("w:tilfreds"), N499 = f("w:499"), KR = f("w:kroner");
  const EN = f("w:n"), GANG = f("w:gang"), INTET = f("w:intet"), ABO = f("w:abonnement");
  const SIDEN = f("w:siden2"), ER = f("w:er2"), DIN = f("w:din3");
  const IKKE = f("w:ikke"), TIL2 = f("w:tilfreds2");
  const SA = f("w:s"), KOST = f("w:koster"), INGEN = f("w:ingenting");
  const NUL = f("w:nul"), RIS = f("w:risiko");
  // transitions (start frames)
  const TZ = 10, TP = 14, TI = 16;   // transition lengths (frames): zoom-through, pushes, iris
  const Z1 = N499 - 8;      // 12 → 13 zoom-through the type
  const P2 = EN - 8;        // 13 → 14 push up
  const P3 = INTET - 9;     // 14 → 15 push left
  const F4 = SIDEN - 9;     // 15 → 16 the site flies in
  const FL = IKKE - 10;     // 16 → 17 the flip
  const P6 = SA - 7;        // 17 → 18 push down
  const IR = NUL - 8;       // 18 → 19 iris through the zero

  const NX = 300, NY = 360, NS = 260;   // the price's place (shots 13 and 18 rhyme)

  // ===== 12 · "Tilfreds?" =====
  const shot12 = () => {
    if (g >= Z1 + TZ) return null;
    const zt = kf(g, Z1, TZ, EXIT);
    const life = lin(g, H2, Z1 + TZ);
    const q = sp(g, TIL - 2, 0.38);
    // the push toward camera is anchored at the word's left edge (it grows to the right while it slides left);
    // the zoom-through scales about the word's centre
    return (
      <div style={{ position: "absolute", left: 430, top: 540 - 131, transformOrigin: "0% 50%", transform: `perspective(1800px) translate(${mix(-10, -500, life)}px, ${mix(70, -80, life)}px) rotateY(${mix(14, -8, life)}deg) scale(${1 + 0.42 * life})` }}>
        <div style={{ transformOrigin: "50% 50%", transform: `scale(${1 + 11 * zt * zt})`, opacity: (1 - zt) * (1 - zt) }}>
          <Line size={250} gap={0}>
            <span>Tilfreds</span>
            <span style={{ display: "inline-block", transform: `rotate(${(1 - Math.min(1, q)) * 14}deg)`, transformOrigin: "50% 100%" }}><Word p={q} size={250} it>?</Word></span>
          </Line>
        </div>
      </div>
    );
  };

  // ===== 13 · "499 kr" (rolls up from 000, out of depth) =====
  const up = kf(g, P2, TP, INOUT);
  const shot13 = () => {
    if (g < Z1 || g >= P2 + TP) return null;
    const na = sp(g, Z1 + 5, 0.4);
    const life = lin(g, Z1, P2 + TP);
    const lean = sp(g, KR - 2, 0.5);
    const sc = (1 + 0.45 * life) * (1 + 0.2 * lean), arr = mix(0.6, 1.1, na);
    const roll = lin(g, Z1 + 3, KR - 1);   // the digits roll for as long as the number is spoken
    const kr = sp(g, KR, 0.4);
    return (
      <div style={{ position: "absolute", left: NX, top: NY, transformOrigin: "0% 50%", transform: `perspective(1800px) translate(${mix(640, -230, life) - 90 * lean}px, ${mix(80, -90, life) - 700 * up}px) rotateY(${mix(10, -8, life)}deg) scale(${sc})`, opacity: Math.min(1, na * 1.6) * (1 - 0.7 * up) }}>
        <div style={{ display: "flex", alignItems: "flex-start", transformOrigin: "30% 50%", transform: `scale(${arr})` }}>
          <Roll from={[0, 0, 0]} to={[4, 9, 9]} dir={1} p={roll} size={NS} color={C.ink} />
          <div style={{ marginLeft: 40, marginTop: 110, transform: `translateX(${(1 - Math.min(1, kr)) * 520}px)` }}><Line size={170}><Word p={kr} size={170}>kr</Word></Line></div>
        </div>
      </div>
    );
  };

  // ===== 14 · "Én gang." (rises onto the carried sage line) =====
  const e3 = kf(g, P3, TP, INOUT);
  const shot14 = () => {
    if (g < P2 || g >= P3 + TP) return null;
    const life = lin(g, P2, P3 + TP);
    const ln = kf(g, EN + 1, 18, WIPE);
    return (
      <div style={{ position: "absolute", left: NX, top: NY + 22, transformOrigin: "0% 50%", transform: `perspective(1800px) translate(${mix(200, -400, life) - W * e3}px, ${700 * (1 - up) + mix(60, -90, life)}px) rotateY(${mix(10, -8, life)}deg) scale(${1 + 0.36 * life})` }}>
        <Line size={232}>
          <Word p={sp(g, EN - 6, 0.4)} size={232} it>Én</Word>
          <Word p={sp(g, GANG - 8, 0.4)} size={232}>gang.</Word>
        </Line>
        <div style={{ position: "absolute", left: 6, top: 232 * 1.05 + 44, height: 10, borderRadius: 10, width: 860 * ln, background: C.sage }} />
      </div>
    );
  };

  // ===== 15 · the "Abonnement" switch turns off =====
  const rec = kf(g, F4, 14, INOUT);
  const shot15 = () => {
    if (g < P3 || g >= F4 + 14) return null;
    const life = lin(g, P3, F4 + 14);
    const off = sp(g, ABO, 0.34);
    const rw = 1340, rh = 290;
    return (
      <div style={{ position: "absolute", left: (W - rw) / 2, top: (H - rh) / 2 - 10, width: rw, height: rh, perspective: 2400,
        transform: `translate(${W * (1 - e3) + mix(380, -320, life) - 760 * rec}px, ${mix(70, -80, life)}px) scale(${(1 + 0.3 * life) * (1 - 0.22 * rec)})`, opacity: 1 - rec }}>
        <div style={{ width: rw, height: rh, borderRadius: 76, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px 0 92px", boxSizing: "border-box",
          transform: `rotateY(${mix(-18, 14, life)}deg) rotateX(${mix(7, -5, life)}deg)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 116, letterSpacing: "-0.035em", color: `color-mix(in srgb, ${C.soft} ${clamp01(off) * 100}%, ${C.ink})` }}>Abonnement</div>
          <Switch on={1 - off} size={180} />
        </div>
      </div>
    );
  };

  // ===== 16 · Holm's site flies in; "Siden er din." (front face of the flip) =====
  const flip = g >= FL ? sp(g, FL, 0.55) : 0;
  const shot16 = () => {
    if (g < F4 || g >= FL + 14) return null;
    const fly = sp(g, F4, 0.62);
    const life = lin(g, F4, FL + 14);
    const din = sp(g, DIN - 1, 0.3);
    const sw = 1120, sh = 700;
    return (
      <>
        <div style={{ position: "absolute", left: 90, top: 182, width: sw, height: sh, perspective: 2200, perspectiveOrigin: "50% 50%" }}>
          <div style={{ width: sw, height: sh, position: "relative", transformOrigin: "50% 50%",
            transform: `translate(${mix(1350, 0, fly) + mix(0, -40, life)}px, ${mix(330, 0, fly)}px) rotateY(${mix(48, 13, fly) - 6 * life}deg) rotateZ(${mix(-9, 0, fly)}deg) scale(${mix(0.62, 1, fly) * (1 + 0.05 * life)})` }}>
            <Browser w={sw} h={sh}>
              <HolmSite w={sw} h={sh - BAR} booking={1} scroll={mix(0, 300, life)} />
            </Browser>
            {din > 0.001 && (
              <div style={{ position: "absolute", right: 46, top: BAR + 34, transformOrigin: "100% 0%", transform: `translateY(${-46 * (1 - Math.min(1, din))}px) scale(${1.32 - 0.32 * Math.min(1, din)})` }}>
                <Glass p={din * 1.4} radius={999} weight={1.2} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 32px 16px 22px", fontSize: 40, fontWeight: 500, whiteSpace: "nowrap" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={34} height={34} viewBox="0 0 48 48" fill="none" stroke={C.white} strokeWidth={4.2} strokeLinecap="round"><circle cx="24" cy="16" r="7" /><path d="M10 41 c2 -9 7 -13 14 -13 s12 4 14 13" /></svg>
                  </div>Din
                </Glass>
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", left: 1290, top: 318, transformOrigin: "0% 50%", transform: `translateX(${mix(60, -50, lin(g, SIDEN - 4, FL + 14))}px) scale(${1 + 0.05 * life})` }}>
          <Line size={140}>
            <Word p={sp(g, SIDEN, 0.4)} size={140}>Siden</Word>
            <Word p={sp(g, ER, 0.4)} size={140}>er</Word>
          </Line>
          <Line size={140} style={{ marginTop: 18 }}>
            <Word p={sp(g, DIN, 0.4)} size={140} it>din.</Word>
          </Line>
        </div>
      </>
    );
  };

  // ===== 17 · "Ikke tilfreds?" on sage =====
  const e6 = kf(g, P6, TP, INOUT);
  const shot17 = () => {
    if (g < FL || g >= P6 + TP) return null;
    const life = lin(g, FL, P6 + TP);
    return (
      <div style={{ position: "absolute", left: 230 + 60, top: 410, transformOrigin: "0% 50%", transform: `perspective(1800px) translate(${mix(330, -380, life)}px, ${H * e6 + mix(-70, 70, life)}px) rotateY(${mix(12, -9, life)}deg) scale(${1 + 0.24 * life})`, opacity: 1 - 0.6 * e6 }}>
        <Line size={214} color={C.cream}>
          <Word p={sp(g, IKKE - 3, 0.4)} size={214} it itColor={C.sageDeep}>Ikke</Word>
          <Word p={sp(g, TIL2 - 5, 0.4)} size={214}>tilfreds?</Word>
        </Line>
      </div>
    );
  };

  // ===== 18 · "499 kr" rolls DOWN to "0 kr" (cream on sage) =====
  const gone = sp(g, INGEN + 2, 0.42);
  // the group drifts left and toward camera; as the leading zeros close up, "kr" holds its place and the 0 slides into
  // the last 9's place (so the shield that replaces it sits in the composition, not at the edge)
  const t18 = (gg: number) => {
    const life = lin(gg, P6, IR + 16), gn = sp(gg, INGEN + 2, 0.42), push = Math.pow(lin(gg, INGEN - 2, IR + TI), 1.15);
    const sc = (1.1 + 0.3 * life) * (1 + 0.2 * gn) * (1 + 1.0 * push);
    return { sc, tx: mix(200, -600, life) + sc * 2 * DIGW * NS * gn, ty: mix(-60, 60, life) };
  };
  const zeroAt = (gg: number) => {
    const { sc, tx, ty } = t18(gg), gn = sp(gg, INGEN + 2, 0.42);
    return { x: NX + tx + sc * NS * DIGW * (2 * (1 - gn) + 0.5), y: NY + ty + (NS * CELL) / 2 };
  };
  const shot18 = () => {
    if (g < P6) return null;
    const { sc, tx, ty } = t18(g);
    const roll = lin(g, KOST - 1, INGEN + 3);
    return (
      <div style={{ position: "absolute", left: NX, top: NY, transformOrigin: "0% 50%", transform: `translate(${tx}px, ${ty - H * (1 - e6)}px) scale(${sc})`, display: "flex", alignItems: "flex-start" }}>
        <Roll from={[4, 9, 9]} to={[0, 0, 0]} dir={-1} p={roll} size={NS} color={C.cream} gone={gone} />
        <div style={{ marginLeft: 40, marginTop: 110 }}><Line size={170} color={C.cream}>kr</Line></div>
      </div>
    );
  };

  // ===== the flip: shot 16 on the front, the sage frame (17, 18) on the back =====
  const ir = kf(g, IR, TI, (t) => t * t * (3 - 2 * t));
  const z0 = zeroAt(IR);
  const r0 = 44, rr = r0 * Math.pow(2600 / r0, ir);      // the iris radius: an even, accelerating zoom
  const flipView = () => {
    if (g < F4 || ir >= 0.98) return null;
    const ang = 180 * Math.min(1, flip), front = ang < 90;
    const lift = Math.sin(Math.PI * clamp01(flip));
    const zc = zeroAt(g), Z = rr / r0;
    const face: React.CSSProperties = { position: "absolute", left: -80, top: -80, width: W + 160, height: H + 160, overflow: "hidden" };
    const inner: React.CSSProperties = { position: "absolute", left: 80, top: 80, width: W, height: H };
    if (g < FL) return <div style={face}><div style={inner}>{shot16()}</div></div>;
    return (
      <div style={{ position: "absolute", inset: 0, perspective: 2600, perspectiveOrigin: "50% 50%" }}>
        {lift > 0.002 && <div style={{ position: "absolute", inset: -80, background: `rgba(26,22,20,${0.07 * lift})` }} />}
        <div style={{ ...face, transformOrigin: "50% 50%", transform: `rotateY(${front ? -ang : 180 - ang}deg) scale(${1 - 0.2 * lift})`,
          background: front ? C.bg : C.sage, borderRadius: 60 * lift, boxShadow: lift > 0.01 ? `0 ${40 * lift}px ${120 * lift}px rgba(26,22,20,${0.28 * lift})` : undefined }}>
          <div style={{ ...inner, transformOrigin: `${zc.x}px ${zc.y}px`, transform: ir > 0 ? `scale(${Z})` : undefined }}>
            {front ? shot16() : <>{shot17()}{shot18()}</>}
          </div>
        </div>
      </div>
    );
  };

  // ===== 19 · iris through the zero: the shield draws where the 0 was; "Nul risiko." =====
  const shot19 = () => {
    if (g < IR) return null;
    const life = lin(g, IR, H3);
    const sh = sp(g, IR + 2, 0.5);
    const d = kf(g, IR + 3, 16, INOUT), c = kf(g, NUL + 6, 10, OUT);
    const clip = ir < 0.98 ? `ellipse(${rr}px ${rr * 1.75}px at ${z0.x + 80}px ${z0.y + 80}px)` : undefined;
    const S = 460;
    return (
      <div style={{ position: "absolute", left: -80, top: -80, width: W + 160, height: H + 160, background: C.bg, clipPath: clip }}>
        <div style={{ position: "absolute", left: 80, top: 80, width: W, height: H, transformOrigin: `${z0.x}px ${z0.y}px`, transform: `translate(${mix(60, -520, life)}px, ${mix(40, -70, life)}px) scale(${1 + 0.34 * life})` }}>
          <div style={{ position: "absolute", left: z0.x - S / 2, top: z0.y - S / 2, transform: `scale(${mix(0.45, 1, sh)}) rotate(${(1 - sh) * -10}deg)` }}>
            <Shield s={S} d={d} c={c} fill={clamp01(d * 1.5 - 0.3)} />
          </div>
          <div style={{ position: "absolute", left: z0.x + 0.46 * S, top: z0.y - 0.6 * 196 - 4 }}>
            <Line size={196}>
              <Word p={sp(g, NUL, 0.4)} size={196} it>Nul</Word>
              <Word p={sp(g, RIS - 2, 0.4)} size={196}>risiko.</Word>
            </Line>
          </div>
        </div>
      </div>
    );
  };

  const wx = whipIn(g, "h2") + whipOut(g, "h3");
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translateX(${wx}px)`, opacity: whipFade(g, "h3") }}>
      {shot12()}
      {shot13()}
      {shot14()}
      {shot15()}
      {flipView()}
      {shot19()}
    </div>
  );
};
