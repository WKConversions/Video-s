// Builder 5 — version 3 (plan/storyboard.md, shots 29–38): h4 → end. Every shot has its own named motion:
// 29 whip in from the left (h4) + the help bubble's soft drop (bounce, squash) + a liquid split (Gooey);
// 30 iMessage stack: the two halves grow into the messages, typing dots bounce, the reply springs open and the stack
//    shifts up, an Island "Creoble support · svarer nu"; held in a slow 3D sway, then swallowed by the Island;
// 31 squash and pop: the queue chip pops in, gets squashed and bursts into droplets (Gooey); "Ingen kø." letter bounce;
// 32 an arc pan down-right to a KineticLine; the "Bot" chip is knocked off the line and falls off the bottom (gravity);
// 33 the full stop leads: it bounces in from above (two bounces), the wordmark wipes in right-to-left from it while
//    the camera pulls back; on "Hjemmeside" it docks up as a header;
// 34 two Liquid Glass tiles rise on arcs from the bottom corners and merge on "samlet" (gooey sage join);
// 35–37 ink pours down from the top; "Byg den." / "Se den." / "Så køber du." pop word by word, the stack shifts up;
// 38 the ink frame contracts into the Island capsule, which springs open into the button; press + shine on "gratis";
//    creoble.dk types; an elliptical float to the end (the last 0.6 s hold).
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  BAR, Browser, C, EXIT, Gooey, HolmSite, INOUT, Ico, Island, KineticLine, Label, LiquidGlass, OUT, PillButton,
  SANS, SERIF, SHADOW, SHADOW_BIG, aspring, bounce, clamp01, f, k, mix, press, squash, whipInR,
} from "../shared";
import { WM_DOT, WM_VIEW, WM_WORD } from "../wordmark";

/* ---------- clock (g = 30-unit frames, fractional at 60 fps) ---------- */
type V2 = [number, number];
const sec = (fr: number) => fr / 30;
const u01 = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1e-6, b - a));
const lerp2 = (a: V2, b: V2, t: number): V2 => [mix(a[0], b[0], t), mix(a[1], b[1], t)];
const qb = (a: V2, c: V2, b: V2, t: number): V2 => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];

const H4 = f("h4"), END = f("end"), HOLD = END - 18;               // the last 0.6 s may hold
// 29–30
const LAND = f("w:hjlp");                                          // the bubble lands on "hjælp"
const DROP_R = 0.9, DROP_AT = LAND - 0.4405 * DROP_R * 30;         // bounce(0.9, 0.6) first touches 1 after 0.4405 R
const SPLIT = LAND + 8;
const ET = f("w:et"), MEN = f("w:menneske"), FORS = f("w:forstr");
const SWAL = f("w:forretning") + 12;                               // the chat is swallowed by the Island
// 31
const CHIP = SWAL + 3, KO = f("w:k");
// 32
const PAN = f("w:ingen5") - 12, PAND = 18;
const KICK = f("w:robotsvar") + 2;
// 33
const DOT_HIT = f("w:creoble3") - 6;
const DOT_R = 0.7, DOT_AT = DOT_HIT - 0.4103 * DOT_R * 30;         // bounce(0.7, 0.55) first touches 1 after 0.41 R
const ZOOM_A = DOT_HIT, ZOOM_B = ZOOM_A + 24;
// 34
const HJ = f("w:hjemmeside2"), HOST = f("w:hosting"), SAML = f("w:samlet"), ETT = f("w:t");
// 35–38
const INK = f("w:byg") - 10, INKD = 12;
const CON = f("w:du5") + 6, OPEN = CON + 14;
const CAPY = 250;                                                  // the capsule / button centre
const BW = 566, BH = 104;                                          // PillButton size 38, measured

/* ---------- local icons ---------- */
const LP: Record<string, React.ReactNode> = {
  bot: <><rect x="9" y="16" width="30" height="23" rx="7" /><path d="M24 16 V9" /><circle cx="24" cy="7.5" r="1.6" /><path d="M18.5 25.5 V29 M29.5 25.5 V29" /></>,
  clock: <><circle cx="24" cy="24" r="17" /><path d="M24 14 V24 L31 29" /></>,
};
const LIco: React.FC<{ n: string; s?: number; c?: string; w?: number; style?: React.CSSProperties }> = ({ n, s = 24, c = C.ink, w = 2, style }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={(w * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none", ...style }}>{LP[n]}</svg>
);

// Letter bounce with mixed roman / italic segments (as the kit's BounceText), centred on cx.
const BText: React.FC<{ g: number; segs: { t: string; it?: boolean }[]; at: number; cx: number; y: number; size: number; stagger?: number; color?: string; itColor?: string }> = ({
  g, segs, at, cx, y, size, stagger = 0.032, color = C.ink, itColor = C.sageDeep }) => {
  let n = 0;
  return (
    <div style={{ position: "absolute", left: cx - 1600, top: y, width: 3200, display: "flex", justifyContent: "center", fontFamily: SERIF, fontWeight: 400, fontSize: size, letterSpacing: "-0.025em", lineHeight: 1.05, whiteSpace: "pre", color }}>
      {segs.map((s, si) => (
        <span key={si} style={{ fontStyle: s.it ? "italic" : "normal", color: s.it ? itColor : color, display: "inline-flex" }}>
          {s.t.split("").map((ch, i) => {
            const p = bounce(g, at + (n++) * stagger, 0.42, 0.55);
            return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * 0.55}em) scale(${0.4 + 0.6 * p})`, transformOrigin: "50% 90%", opacity: clamp01(p * 2.5) }}>{ch}</span>;
          })}
        </span>
      ))}
    </div>
  );
};

/* ---------- 29–30: the help bubble → the conversation ---------- */
const box = (cx: number, cy: number, w: number, h: number, bg: string, r?: number, extra?: React.CSSProperties): React.ReactNode => (
  <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: Math.max(0, w), height: Math.max(0, h), borderRadius: r ?? Math.min(w, h) / 2, background: bg, ...extra }} />
);
const BUB = { x: 960, y: 420, w: 320, h: 230 };
const A_MSG = { l: 800, t: 392, w: 700, h: 176 };                  // the client's message (right)
const B_TYP = { l: 540, t: 680, w: 170, h: 110 };                  // typing bubble → the reply (left)
const B_REP = { w: 790, h: 176 };

const Chat: React.FC<{ g: number }> = ({ g }) => {
  if (g < H4 || g > SWAL + 13) return null;
  const wx = whipInR(g, "h4") - 110 * Math.pow(1 - u01(g, H4, H4 + 44), 2);   // the whip's long decelerating tail
  // the soft drop: falls 900 px, presses into the landing (squash instead of sinking), one small rebound
  const p = bounce(g, sec(DROP_AT), DROP_R, 0.6), p0 = bounce(g - 0.5, sec(DROP_AT), DROP_R, 0.6);
  const fall = 900 * Math.max(0, 1 - p), over = Math.max(0, p - 1);
  const vy = (p - p0) * 2 * 900;
  const stretch = p < 1 && g < LAND + 2 ? squash(0, vy, 0.0016) : "";
  const press = `scale(${1 + 1.1 * over}, ${1 - 1.6 * over})`;
  // the split
  const sA = bounce(g, sec(SPLIT), 0.5, 0.62), sB = bounce(g, sec(SPLIT + 2), 0.55, 0.62);
  const mA = bounce(g, sec(ET), 0.55, 0.65), mR = bounce(g, sec(FORS), 0.55, 0.65);
  const A1: V2 = [1180, 480], A2: V2 = [A_MSG.l + A_MSG.w / 2, A_MSG.t + A_MSG.h / 2];
  const aC = lerp2(lerp2([BUB.x, BUB.y], A1, sA), A2, mA);
  const aW = mix(mix(BUB.w, 220, sA), A_MSG.w, mA), aH = mix(mix(BUB.h, 176, sA), A_MSG.h, mA);
  const bW = mix(mix(150, B_TYP.w, sB), B_REP.w, mR), bH = mix(mix(120, B_TYP.h, sB), B_REP.h, mR);
  const bC: V2 = [mix(BUB.x, B_TYP.l + B_TYP.w / 2, sB) + (bW - mix(150, B_TYP.w, sB)) / 2, mix(BUB.y + 30, B_TYP.t + B_TYP.h / 2, sB) + (bH - mix(120, B_TYP.h, sB)) / 2];
  const white = u01(g, SPLIT + 8, SPLIT + 14);
  // the stack shifts up when the reply opens; the conversation sways slowly in 3D; then the Island swallows it
  const shift = -70 * bounce(g, sec(FORS + 1), 0.6, 0.7);
  const sw = u01(g, ET, ET + 24), ry = 7 * Math.sin(((g - ET) / 84) * Math.PI * 2) * sw, rx = -4 * Math.sin(((g - ET) / 110) * Math.PI * 2 + 0.8) * sw;
  const tr = Math.max(0, g - ET), rise = -3.4 * (tr - 6 * (1 - Math.exp(-tr / 6)));   // the conversation scrolls up
  const e = EXIT(u01(g, SWAL, SWAL + 11));
  const typeOut = EXIT(u01(g, SPLIT - 1, SPLIT + 9));
  const dotsOn = u01(g, SPLIT + 9, SPLIT + 13) * (1 - u01(g, FORS - 1, FORS + 3));
  const av = bounce(g, sec(MEN), 0.45, 0.6), nm = OUT(u01(g, MEN + 2, MEN + 12));
  const txtA = clamp01((mA - 0.6) * 4) * u01(g, ET + 3, ET + 8), txtB = clamp01((mR - 0.6) * 4) * u01(g, FORS + 3, FORS + 8);
  // the Island: pops as a pill, springs open on "Et", gulps the chat and closes
  const ipA = Math.max(0, bounce(g, sec(ET - 6), 0.35, 0.65)) * (1 - aspring(g, sec(SWAL + 15), 0.3, 1));
  const ip = bounce(g, sec(ET), 0.6, 0.6) - bounce(g, sec(SWAL + 6), 0.45, 0.7) + 0.18 * Math.sin(Math.PI * u01(g, SWAL + 3, SWAL + 10));
  const pulse = 1 + 0.25 * Math.sin((g / 30) * Math.PI * 2 * 1.4);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${wx}px)`, transformOrigin: "960px 80px", opacity: 1 - u01(g, SWAL + 5, SWAL + 11) }}>
        <AbsoluteFill style={{ transformOrigin: "960px 80px", transform: `scale(${mix(1, 0.04, e)})` }}>
          {/* 29: the question, sinking out through its mask at the split */}
          <div style={{ position: "absolute", left: 0, top: 610, width: 1920, overflow: "hidden", paddingBottom: 40, textAlign: "center", fontFamily: SERIF, fontSize: 170, letterSpacing: "-0.025em", lineHeight: 1.05, color: C.ink }}>
            <div style={{ transform: `translateY(${typeOut * 115}%)`, whiteSpace: "nowrap" }}>Brug for <span style={{ fontStyle: "italic", color: C.sageDeep }}>hjælp</span>?</div>
          </div>
          <AbsoluteFill style={{ perspective: 1800 }}>
            <AbsoluteFill style={{ transform: `translateY(${shift + rise}px) rotateY(${ry}deg) rotateX(${rx}deg)` }}>
              {/* the liquid layer: the bubble, its split, the two message shapes */}
              <Gooey>
                <AbsoluteFill style={{ transformOrigin: `${BUB.x}px ${BUB.y + BUB.h / 2}px`, transform: `translateY(${-fall}px) ${press} ${stretch}` }}>
                  {g < SPLIT + 2 && <>
                    {box(BUB.x - 112, BUB.y + 98, 64 * (1 - u01(g, SPLIT - 2, SPLIT + 2)), 64 * (1 - u01(g, SPLIT - 2, SPLIT + 2)), C.sageDark)}
                    {box(BUB.x - 150, BUB.y + 132, 30 * (1 - u01(g, SPLIT - 3, SPLIT)), 30 * (1 - u01(g, SPLIT - 3, SPLIT)), C.sageDark)}
                  </>}
                  {box(aC[0], aC[1], aW, aH, C.sageDark, Math.min(aH / 2, mix(aH / 2, 46, mA)))}
                  {mA > 0.05 && box(aC[0] + aW / 2 - 20, aC[1] + aH / 2 - 14, 46 * clamp01(mA), 46 * clamp01(mA), C.sageDark)}
                  {g >= SPLIT && g < SPLIT + 16 && box(bC[0], bC[1], bW, bH, C.sageDark, Math.min(bH / 2, 55))}
                  {g < SPLIT + 4 && [0, 1, 2].map((i) => box(BUB.x + (i - 1) * 54, BUB.y, 30 * (1 - u01(g, SPLIT - 3, SPLIT + 3)), 30 * (1 - u01(g, SPLIT - 3, SPLIT + 3)), C.cream))}
                </AbsoluteFill>
              </Gooey>
              {/* the typing bubble / reply (white), its dots, the avatar, the name */}
              {white > 0 && <div style={{ position: "absolute", left: bC[0] - bW / 2 - 1, top: bC[1] - bH / 2 - 1, width: bW + 2, height: bH + 2, borderRadius: Math.min(bH / 2, 46), background: C.white, opacity: white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}` }} />}
              {dotsOn > 0 && [0, 1, 2].map((i) => {
                const dy = -14 * Math.abs(Math.sin((Math.PI * (g - SPLIT)) / 9 - i * 0.75));
                return <div key={i} style={{ position: "absolute", left: B_TYP.l + B_TYP.w / 2 + (i - 1) * 36 - 11, top: B_TYP.t + B_TYP.h / 2 - 11 + dy, width: 22, height: 22, borderRadius: 11, background: C.sage, opacity: dotsOn }} />;
              })}
              <div style={{ position: "absolute", left: A_MSG.l + 40, top: A_MSG.t + 34, width: 640, fontFamily: SANS, fontSize: 40, lineHeight: "54px", color: C.cream, opacity: txtA }}>Hej! Kan I hjælpe med at<br />skifte et billede?</div>
              <div style={{ position: "absolute", left: B_TYP.l + 42, top: B_TYP.t + 34, width: 720, fontFamily: SANS, fontSize: 40, lineHeight: "54px", color: C.ink, opacity: txtB }}>Selvfølgelig! Jeg ordner det<br />med det samme.</div>
              <div style={{ position: "absolute", left: B_TYP.l + 8, top: B_TYP.t - 50 + 14 * (1 - nm), fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.muted, opacity: nm }}>Creoble support</div>
              <div style={{ position: "absolute", left: 412, top: B_TYP.t + B_TYP.h - 76 + mR * (B_REP.h - B_TYP.h), width: 76, height: 76, borderRadius: 38, background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.max(0, av)})`, boxShadow: `0 0 0 1px ${C.line}` }}>
                <Ico n="user" s={42} c={C.sageDeep} w={2.2} />
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      {ipA > 0.001 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 70px", transform: `scale(${ipA})` }}>
          <Island x={960} y={30} w={640 + 70 * Math.sin(Math.PI * u01(g, SWAL + 2, SWAL + 10))} h={82} p={ip}>
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 30, whiteSpace: "nowrap" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: C.sageLight, transform: `scale(${pulse})` }} />
              <span style={{ fontWeight: 500 }}>Creoble support</span><span style={{ color: C.sageLight }}>· svarer nu</span>
            </div>
          </Island>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 31: the queue chip, squashed and popped; "Ingen kø." ---------- */
const PANO: V2 = [1000, 640];
const panP = (e: number): V2 => qb([0, 0], [-60, -560], [-PANO[0], -PANO[1]], e);
const panE = (g: number) => bounce(g, sec(PAN), 0.8, 0.72);       // the arc pan lands with momentum
const CHIPC: V2 = [960, 720], CW = 660, CH = 120;
const N_DROP = 13;
const Queue: React.FC<{ g: number }> = ({ g }) => {
  if (g < CHIP || g > PAN + PAND + 1) return null;
  const off = panP(panE(g));
  const pop = bounce(g, sec(CHIP), 0.45, 0.6);
  const sq = INOUT(u01(g, KO - 7, KO)), wob = 0.04 * Math.sin((g - (KO - 7)) * 1.9) * u01(g, KO - 7, KO - 3);
  const jel = 0.07 * Math.sin((g - CHIP - 6) * 1.5) * u01(g, CHIP + 6, CHIP + 10) * (1 - u01(g, KO - 8, KO - 5));   // jelly tremble
  const sx = 1 + 0.36 * sq + wob + jel, sy = 1 - 0.5 * sq - wob - jel;
  const tilt = 5 * Math.sin((g - CHIP) * 0.33) * u01(g, CHIP + 2, CHIP + 8) * (1 - u01(g, KO - 6, KO - 1));   // rubbery tilt
  const t = g - KO;
  const ty = 300 + 90 * aspring(g, sec(KO + 3), 0.8, 1);
  return (
    <AbsoluteFill style={{ transform: `translate(${off[0]}px, ${off[1]}px)` }}>
      <Gooey>
        {t < 1.5 && (
          <div style={{ position: "absolute", left: CHIPC[0] - CW / 2, top: CHIPC[1] - CH / 2, width: CW, height: CH, borderRadius: CH / 2, background: C.sageDark,
            transform: `rotate(${tilt}deg) scale(${Math.max(0, pop) * sx}, ${Math.max(0, pop) * sy})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
            fontFamily: SANS, fontWeight: 500, fontSize: 42, color: C.cream, whiteSpace: "nowrap" }}>
            <span style={{ opacity: 1 - u01(g, KO - 3, KO), display: "flex", alignItems: "center", gap: 18 }}><LIco n="clock" s={44} c={C.cream} w={2.2} />Du er nr. 14 i køen</span>
          </div>
        )}
        {t >= 0 && Array.from({ length: N_DROP }, (_, i) => {
          const fx = i / (N_DROP - 1) - 0.5;
          const x0 = CHIPC[0] + fx * CW * 1.36 * 0.9, y0 = CHIPC[1] + 10 * Math.sin(i * 2.1);
          const r0 = 30 + 14 * (0.5 + 0.5 * Math.sin(i * 1.9 + 0.3));
          const vx = fx * 17 + 3 * Math.sin(i * 4.7), vy = -(6 + 8 * Math.abs(Math.sin(i * 1.3 + 0.4)));
          const x = x0 + vx * t, y = y0 + vy * t + 0.5 * 1.05 * t * t;
          const r = r0 * (1 + 0.35 * Math.exp(-t / 2.5)) * Math.pow(1 - u01(t, 4, 30), 0.7);
          return r > 0.5 ? <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: C.sageDark }} /> : null;
        })}
      </Gooey>
      <BText g={g} segs={[{ t: "Ingen " }, { t: "kø.", it: true }]} at={sec(f("w:ingen4"))} cx={960} y={ty} size={210} />
    </AbsoluteFill>
  );
};

/* ---------- 32: "Ingen robotsvar." and the Bot chip that falls off ---------- */
const BOT0: V2 = [1505, 428];
const GRAV = 2.6, V0 = 13, VX = 8.5, V1 = V0 * 0.42, T1 = (2 * V0) / GRAV, T2 = T1 + (2 * V1) / GRAV;
const botPose = (g: number) => {
  const t = g - KICK;
  if (t < 0) return { x: BOT0[0], y: BOT0[1], rot: -3 + 5 * Math.sin(g / 3.2), sx: 1, sy: 1 };
  const x = BOT0[0] + VX * t;
  if (t < T1) { const sqz = 0.22 * Math.exp(-t / 1.6); return { x, y: BOT0[1] - V0 * t + 0.5 * GRAV * t * t, rot: -3 + 1.6 * t, sx: 1 + sqz * 0.6, sy: 1 - sqz }; }
  if (t < T2) { const tt = t - T1, sqz = 0.16 * Math.exp(-tt / 1.2); return { x, y: BOT0[1] - V1 * tt + 0.5 * GRAV * tt * tt, rot: 13 + 1.2 * tt, sx: 1 + sqz * 0.6, sy: 1 - sqz }; }
  const tt = t - T2;
  return { x, y: BOT0[1] + V1 * tt + 0.5 * GRAV * tt * tt, rot: 18 + 2.2 * tt + 0.22 * tt * tt, sx: 1, sy: 1 };
};
const Robot: React.FC<{ g: number }> = ({ g }) => {
  if (g < PAN || g > KICK + 42) return null;
  const P = panP(panE(g)), off: V2 = [PANO[0] + P[0], PANO[1] + P[1]];
  const b = botPose(g);
  return (
    <AbsoluteFill style={{ transform: `translate(${off[0]}px, ${off[1]}px)` }}>
      <KineticLine g={g} words={[{ t: "Ingen", at: "w:ingen5" }, { t: "robotsvar.", at: "w:robotsvar", it: true }]} x={960} y={436} size={190} align="center" dx={110} grow={0} out="w:creoble3-0.62" dir="up" />
      {b.y < 1300 && (
        <div style={{ position: "absolute", left: b.x - 110, top: b.y - 44, width: 220, height: 88, transformOrigin: "50% 100%", transform: `rotate(${b.rot}deg) scale(${b.sx}, ${b.sy})`,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 14, borderRadius: 44, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`,
          fontFamily: SANS, fontWeight: 500, fontSize: 44, color: C.muted }}>
          <LIco n="bot" s={46} c={C.muted} w={2.2} />Bot
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 33: the full stop leads; the wordmark wipes in from it (right to left); camera pull-back ---------- */
const WH = 170, WWD = (WH * WM_VIEW.w) / WM_VIEW.h, WS = WH / WM_VIEW.h;
const WL = 960 - WWD / 2, WT = 540 - WH / 2 - 10;
const DX = WL + 7062.85 * WS, DY = WT + 1344.4 * WS, DRAD = 145.4 * WS;
const Mark: React.FC<{ g: number }> = ({ g }) => {
  if (g < DOT_AT - 1 || g >= INK + INKD) return null;
  const z = Math.min(1, aspring(g, sec(ZOOM_A), 0.9, 1)), Z = mix(2.6, 1, z), sc: V2 = [mix(960, DX, z), mix(560, DY, z)];
  const hc = aspring(g, sec(HJ - 4), 0.75, 1), hs = mix(1, 0.4, hc), hy = mix(0, 104 - (WT + WH / 2), hc);
  const hgt = (gg: number) => 250 * Math.pow(Math.abs(1 - bounce(gg, sec(DOT_AT), DOT_R, 0.55)), 0.8);
  const h = hgt(g), v = (h - hgt(g - 0.5)) * 2;
  const decay = Math.exp(-Math.max(0, g - DOT_HIT) / 12);
  const sq = 0.34 * Math.exp(-h / 5) * decay * (g > DOT_HIT - 2 ? 1 : 0), st = Math.min(0.3, Math.abs(v) * 0.006);
  const rev = OUT(u01(g, DOT_HIT, DOT_HIT + 20));
  const m = `linear-gradient(270deg, #000 ${rev * 112 - 12}%, transparent ${rev * 112}%)`;
  const lift = -10 * u01(g, ZOOM_B - 6, HJ + 8);
  return (
    <AbsoluteFill style={{ transformOrigin: `960px ${WT + WH / 2}px`, transform: `translateY(${hy + lift}px) scale(${hs})` }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${sc[0] - Z * DX}px, ${sc[1] - Z * DY}px) scale(${Z})` }}>
        <svg width={WWD} height={WH} viewBox={`0 0 ${WM_VIEW.w} ${WM_VIEW.h}`} style={{ position: "absolute", left: WL, top: WT, overflow: "visible" }}>
          <g style={{ WebkitMaskImage: rev < 1 ? m : undefined, maskImage: rev < 1 ? m : undefined }}><path d={WM_WORD} fill={C.ink} /></g>
          <path d={WM_DOT} fill="transparent" />
        </svg>
        <div style={{ position: "absolute", left: DX - DRAD, top: DY - DRAD - h, width: 2 * DRAD, height: 2 * DRAD, borderRadius: "50%", background: C.sage,
          transformOrigin: "50% 100%", transform: `scale(${(1 + 0.75 * sq) / (1 + st * 0.5)}, ${(1 - sq) * (1 + st)})` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- 34: two Liquid Glass tiles rise from the bottom corners and merge on "samlet" ---------- */
const TA = { w: 600, h: 470 }, TB = { w: 560, h: 470 };
const A0: V2 = [430, 640], B0: V2 = [1490, 640], A1: V2 = [640, 640], B1: V2 = [1300, 640];
const CARD = { cx: 960, cy: 640, w: 1340, h: 530 };
const tilePos = (g: number) => {
  const pa = bounce(g, sec(HJ), 0.8, 0.68), pb = bounce(g, sec(HOST), 0.8, 0.68), pm = bounce(g, sec(SAML + 3), 0.7, 0.62);
  const a = lerp2(qb([-340, 1480], [60, 820], A0, pa), A1, pm);
  const b = lerp2(qb([2260, 1480], [1860, 820], B0, pb), B1, pm);
  return { a, b, pa, pb, pm };
};
const Bento: React.FC<{ g: number }> = ({ g }) => {
  if (g < HJ || g >= INK + INKD) return null;
  const { a, b, pa, pb, pm } = tilePos(g), q = tilePos(g - 0.5), lag = tilePos(g - 2.5);
  const vA: V2 = [(a[0] - q.a[0]) * 2, (a[1] - q.a[1]) * 2], vB: V2 = [(b[0] - q.b[0]) * 2, (b[1] - q.b[1]) * 2];
  const pc = bounce(g, sec(ETT - 5), 0.55, 0.62), card = clamp01(pc);
  const push = -95 * u01(g, HJ, INK + INKD);                        // the shot's slow rise
  const sheen = 0.15 + 0.7 * u01(g, HJ, INK);
  const lab = u01(g, ETT + 2, ETT + 26);
  const bridge = clamp01(pm * 1.3) * (1 - card * 0.2);
  const midX = (lag.a[0] + TA.w * 0.46 + lag.b[0] - TB.w * 0.46) / 2;
  const span = Math.max(0, lag.b[0] - TB.w * 0.46 - (lag.a[0] + TA.w * 0.46));
  return (
    <AbsoluteFill style={{ transform: `translateY(${push}px)` }}>
      {/* the sage liquid under the glass: trails the tiles, joins them on "samlet" */}
      <Gooey>
        {pa > 0.01 && box(lag.a[0], lag.a[1] + 6, (TA.w - 36) * clamp01(pa * 1.5), (TA.h - 36) * clamp01(pa * 1.5), C.sageLight, 34)}
        {pb > 0.01 && box(lag.b[0], lag.b[1] + 6, (TB.w - 36) * clamp01(pb * 1.5), (TB.h - 36) * clamp01(pb * 1.5), C.sageLight, 34)}
        {bridge > 0.01 && box(midX, mix(lag.a[1], lag.b[1], 0.5) + 6, span + 120, 300 * bridge, C.sageLight, 150 * bridge)}
      </Gooey>
      {/* the merged card's glass */}
      {pc > 0.001 && (
        <div style={{ position: "absolute", left: CARD.cx - CARD.w / 2, top: CARD.cy - CARD.h / 2 }}>
          <LiquidGlass w={mix(CARD.w - 120, CARD.w, Math.max(0, pc))} h={CARD.h} radius={60} p={1} sheen={sheen} style={{ opacity: card, marginLeft: mix(60, 0, Math.max(0, pc)) }} />
        </div>
      )}
      {/* the two tiles' glass (fades into the card) */}
      {pa > 0.001 && <div style={{ position: "absolute", left: a[0] - TA.w / 2, top: a[1] - TA.h / 2 }}><LiquidGlass w={TA.w} h={TA.h} radius={44} p={Math.max(0.05, Math.min(1.1, pa))} sheen={sheen} transform={squash(vA[0], vA[1], 0.0014)} style={{ opacity: clamp01(pa * 2) * (1 - card) }} /></div>}
      {pb > 0.001 && <div style={{ position: "absolute", left: b[0] - TB.w / 2, top: b[1] - TB.h / 2 }}><LiquidGlass w={TB.w} h={TB.h} radius={44} p={Math.max(0.05, Math.min(1.1, pb))} sheen={1 - sheen} transform={squash(vB[0], vB[1], 0.0014)} style={{ opacity: clamp01(pb * 2) * (1 - card) }} /></div>}
      {/* contents */}
      {pa > 0.001 && (
        <div style={{ position: "absolute", left: a[0] - TA.w / 2, top: a[1] - TA.h / 2, width: TA.w, height: TA.h, transform: `${squash(vA[0], vA[1], 0.0014)} scale(${0.7 + 0.3 * Math.min(1.1, pa)})`, opacity: clamp01(pa * 2) }}>
          <Browser w={540} h={350} url="holmfysio.dk" live={1} style={{ position: "absolute", left: 30, top: 30 }}>
            <HolmSite w={540} h={350 - BAR} booking={1} scroll={140 * INOUT(u01(g, HJ + 10, INK))} />
          </Browser>
          <div style={{ position: "absolute", left: 34, top: 402, fontFamily: SANS, fontWeight: 500, fontSize: 32, color: C.ink }}>Hjemmeside</div>
        </div>
      )}
      {pb > 0.001 && (
        <div style={{ position: "absolute", left: b[0] - TB.w / 2, top: b[1] - TB.h / 2, width: TB.w, height: TB.h, transform: `${squash(vB[0], vB[1], 0.0014)} scale(${0.7 + 0.3 * Math.min(1.1, pb)})`, opacity: clamp01(pb * 2), fontFamily: SANS, color: C.ink }}>
          <div style={{ position: "absolute", left: 48, top: 44, display: "flex", alignItems: "center", gap: 14, fontWeight: 500, fontSize: 34 }}><Ico n="server" s={40} c={C.sageDeep} w={2.2} />Hosting</div>
          <div style={{ position: "absolute", left: 48, top: 130, display: "flex", alignItems: "baseline", gap: 14, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 38, color: C.muted }}>fra</span>
            <span style={{ fontFamily: SERIF, fontSize: 170, letterSpacing: "-0.03em", lineHeight: 1 }}>83</span>
            <span style={{ fontSize: 42, fontWeight: 500 }}>kr /md</span>
          </div>
          <div style={{ position: "absolute", left: 48, top: 384, fontSize: 32, color: C.muted }}>Betalt årligt</div>
        </div>
      )}
      {lab > 0 && <Label text="Hjemmeside & hosting" p={lab} size={28} style={{ position: "absolute", left: CARD.cx - CARD.w / 2 + 8, top: CARD.cy - CARD.h / 2 - 66 }} />}
    </AbsoluteFill>
  );
};

/* ---------- 35–38: ink pours down; the stack; the ink contracts into the capsule; the button ---------- */
type SW = { t: string; at: string; it?: boolean; dot?: boolean };
const STACK: SW[][] = [
  [{ t: "Byg", at: "w:byg" }, { t: "den", at: "w:den3", dot: true }],
  [{ t: "Se", at: "w:se" }, { t: "den", at: "w:den4", dot: true }],
  [{ t: "Så", at: "w:s2", it: true }, { t: "køber", at: "w:kber" }, { t: "du", at: "w:du5", dot: true }],
];
const LH = 232, TS = 206;
const Ink: React.FC<{ g: number }> = ({ g }) => {
  if (g < INK) return null;
  // geometry of the ink: pour (wavy bottom edge) → full frame → contraction into a capsule → spring open into the button
  const pe = EXIT(u01(g, INK, INK + INKD));
  const ce = EXIT(u01(g, CON, OPEN));                                // the ink collapses, accelerating, into the capsule
  const po = bounce(g, sec(OPEN), 0.5, 0.55);
  const bob = u01(g, OPEN, OPEN + 24), gt = Math.min(g, HOLD);
  const T = (HOLD - OPEN) / 1.75, ph = ((gt - OPEN) / T) * Math.PI * 2;
  const fy = 11 * Math.sin(ph) * bob, fx = 7 * Math.cos(ph) * bob * (1 - u01(gt, HOLD - 30, HOLD));
  let node: React.ReactNode;
  if (g < CON) {
    if (pe >= 1) node = <div style={{ position: "absolute", inset: 0, background: C.ink }} />;
    else {
      const Y = mix(-90, 1150, pe), A = 50 * (1 - 0.5 * pe), pts: string[] = [];
      for (let i = 0; i <= 24; i++) { const x = (i / 24) * 1920; pts.push(`${x.toFixed(1)},${(Y + A * Math.sin((x / 1920) * Math.PI * 3 + g * 0.35) + 0.4 * A * Math.sin((x / 1920) * Math.PI * 7 - g * 0.5)).toFixed(1)}`); }
      node = <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><polygon points={`0,-10 1920,-10 ${pts.reverse().join(" ")}`} fill={C.ink} /></svg>;
    }
  } else if (g < OPEN) {
    const x0 = mix(0, 960 - 90, ce), x1 = mix(1920, 960 + 90, ce), y0 = mix(0, CAPY - 26, ce), y1 = mix(1080, CAPY + 26, ce);
    const r = Math.min((y1 - y0) / 2, (x1 - x0) / 2, 420 * ce);
    node = <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, borderRadius: r, background: C.ink }} />;
  } else {
    const ti = (g - OPEN) / 2, imp = ti * Math.exp(1 - ti);           // it lands in the capsule with a squish
    const W = mix(180, BW, po) + 70 * imp, H = mix(52, BH, po) - 12 * imp, pr = press(g, "w:gratis");
    node = (
      <div style={{ position: "absolute", left: 960 - W / 2 + fx, top: CAPY - H / 2 + fy, width: W, height: H, borderRadius: H / 2, background: C.ink, overflow: "hidden",
        boxShadow: `0 ${18 * (1 - pr)}px 40px -18px rgba(26,22,20,0.55)`, transform: `scale(${1 - 0.05 * pr})` }}>
        <div style={{ position: "absolute", left: W / 2 - 400, top: H / 2 - 100, width: 800, height: 200, display: "flex", alignItems: "center", justifyContent: "center", opacity: u01(g, OPEN + 4, OPEN + 11) }}>
          <PillButton text="Byg din side gratis" size={38} shine={k(g, "w:gratis", 0.75, INOUT)} style={{ boxShadow: "none" }} />
        </div>
      </div>
    );
  }
  // the stack (cream on ink), pops word by word, shifts up as it grows; shrinks with the ink into the capsule
  const n = 1 + bounce(g, "w:se", 0.6, 0.7) + bounce(g, "w:s2", 0.6, 0.7);
  const sT = mix(1, 0.1, ce), stackOp = 1 - u01(g, CON + 3, CON + 10);
  const stackY = mix(540, CAPY, ce);
  return (
    <AbsoluteFill>
      {g >= f("w:din5") && <SiteRise g={g} />}
      {node}
      {g < OPEN && g >= f("w:byg") - 1 && stackOp > 0 && (
        <AbsoluteFill style={{ transformOrigin: "960px 540px", transform: `translateY(${stackY - 540}px) scale(${sT})`, opacity: stackOp }}>
          {STACK.map((line, li) => {
            if (g < f(line[0].at) - 1) return null;
            const cy = 660 - 3.0 * Math.max(0, g - f("w:byg")) + (li - (n - 1) / 2) * LH;
            const px = (li % 2 === 0 ? 1 : -1) * 1.0 * Math.max(0, g - f(line[0].at));          // parallax: lines slide apart
            return (
              <div key={li} style={{ position: "absolute", left: px, width: 1920, top: cy - TS * 0.62, display: "flex", justifyContent: "center", columnGap: TS * 0.24, fontFamily: SERIF, fontSize: TS, letterSpacing: "-0.025em", lineHeight: 1.05, color: C.cream, whiteSpace: "nowrap" }}>
                {line.map((w, wi) => {
                  const q = bounce(g, w.at, 0.45, 0.55);
                  return (
                    <span key={wi} style={{ display: "inline-block", transformOrigin: "50% 85%", transform: `translateY(${(1 - q) * 120}px) scale(${Math.max(0, q)})`, opacity: clamp01(q * 3), fontStyle: w.it ? "italic" : "normal", color: w.it ? C.sageLight : undefined, paddingRight: w.it ? TS * 0.04 : 0 }}>
                      {w.t}{w.dot && <span style={{ color: C.sageLight }}>.</span>}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </AbsoluteFill>
      )}
      {g >= OPEN && <Url g={g} fx={fx} fy={fy} />}
    </AbsoluteFill>
  );
};

// 38: on "side" the client's site rises from below with a bounce and keeps rising and scrolling under the button;
// it comes to rest exactly at the final hold.
const stopEase = (p: number) => (p < 0.88 ? p : 0.88 + (p - 0.88) - ((p - 0.88) * (p - 0.88)) / 0.24) / 0.94;
const SiteRise: React.FC<{ g: number }> = ({ g }) => {
  const SIDE = f("w:din5"), ps = bounce(g, "w:din5", 0.8, 0.68), q = stopEase(u01(g, SIDE, HOLD));
  const W = 1280, H = 720, y = mix(1130, 548, ps) - 80 * q;
  return (
    <Browser w={W} h={H} url="holmfysio.dk" live={1} style={{ position: "absolute", left: 960 - W / 2, top: y }}>
      <HolmSite w={W} h={H - BAR} booking={1} scroll={330 * stopEase(u01(g, SIDE + 8, HOLD))} />
    </Browser>
  );
};

// creoble.dk types under the button (letters land with a short rise, no caret)
const URL = "creoble.dk";
const Url: React.FC<{ g: number; fx: number; fy: number }> = ({ g, fx, fy }) => {
  const t0 = f("w:creoble4"), cps = 12;
  return (
    <div style={{ position: "absolute", left: 0, width: 1920, top: CAPY + 78, display: "flex", justifyContent: "center", fontFamily: SERIF, fontSize: 104, letterSpacing: "-0.025em", lineHeight: 1.1, color: C.ink, transform: `translate(${fx * 0.6}px, ${fy * 0.7}px)` }}>
      {URL.split("").map((ch, i) => {
        const a = t0 + (i * 30) / cps, q = OUT(u01(g, a, a + 5));
        return <span key={i} style={{ display: "inline-block", opacity: q, transform: `translateY(${(1 - q) * 18}px)`, color: ch === "." ? C.sage : undefined }}>{ch}</span>;
      })}
    </div>
  );
};

export const Scene5: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h4") || g >= f("end")) return null;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Chat g={g} />
      <Queue g={g} />
      <Robot g={g} />
      <Mark g={g} />
      <Bento g={g} />
      <Ink g={g} />
    </AbsoluteFill>
  );
};
