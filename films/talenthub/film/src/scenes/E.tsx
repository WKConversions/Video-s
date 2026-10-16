// Scene E (30.4–36.0 s): Talent Hub. Your next connection starts here. See ../../../plan/storyboard.md.
// Mirrors A: on the full red field the white "th" builds big (the hit at 31.0); the field contracts back into the mark,
// which turns red while the talent spills out of it into a loose orbit; the mark slides left and the wordmark slides
// out from behind it into the wide logo; the tagline builds under it, and a red dot and line connect a graduate and an
// employer. An end card with a gentle push.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ARRIVE, Avatar, C, FONT, Ico, Link, MOVE, POP, Say, THMark, WideLogo, clamp01, k, mix } from "../shared";
import { TH } from "../thpaths";

const rnd = (i: number, s: number) => { const x = Math.sin(i * 91.7 + s * 271.3) * 43758.5453; return x - Math.floor(x); };
const HUB = { x: 960, y: 540 };
const RMAX = Math.hypot(960, 540) + 4;
const FIELD = 918, BUILD = 923, BUILT = 942, SHRINK = 942, OPEN = 955, SLIDE = 944, SLID = 963, WORD = 951;
// the wide logo: 1100 px wide, centred, at y ≈ 420; its square mark is the first 438 of 1701 units
const WL_W = 1100, WL_H = (WL_W * 344) / 1701, WL_X = 960 - WL_W / 2, WL_Y = 420 - WL_H / 2;
const MARK_W = (WL_W * 438) / 1701, MARK_H = (MARK_W * TH.h) / TH.w;
const MARK_END = { x: WL_X + MARK_W / 2, y: WL_Y + MARK_H / 2 };
// the two people the line connects
const WAVE_Y = 470;
const GRAD = { x: 700, y: 820 }, EMP = { x: 1220, y: 820 }, AV = 92;

const ORBIT = Array.from({ length: 20 }, (_, i) => ({ a0: (i / 20) * Math.PI * 2 + rnd(i, 1) * 0.2, rs: 0.92 + rnd(i, 2) * 0.12, s: 34 + rnd(i, 3) * 22, o: 0.7 + rnd(i, 4) * 0.3, d: rnd(i, 5) * 10 }));

const markAt = (x: number, y: number, size: number, color: string, p = 1, key?: string) => (
  <div key={key} style={{ position: "absolute", left: x - size / 2, top: y - (size * TH.h) / TH.w / 2 }}><THMark size={size} color={color} p={p} /></div>
);

const Person: React.FC<{ g: number; x: number; y: number; at: number; icon: string; label: string; lit: number }> = ({ g, x, y, at, icon, label, lit }) => {
  const s = POP(clamp01((g - at) / 12));
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - AV / 2, top: y - AV / 2, width: AV, transform: `scale(${s})`, transformOrigin: "50% 50%" }}>
      <Avatar size={AV} ring={lit > 0.5 ? C.red : C.rose} style={{ boxShadow: `0 0 0 ${AV * 0.06}px ${lit > 0.5 ? C.red : C.rose}, 0 18px 34px -18px rgba(25,27,32,0.4)` }} />
      <div style={{ position: "absolute", left: AV - 30, top: AV - 34, width: 40, height: 40, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${C.ivory}` }}>
        <Ico n={icon} s={24} c={C.white} w={2.8} />
      </div>
      <div style={{ position: "absolute", left: -60, width: AV + 120, top: AV + 20, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.gray, opacity: clamp01((g - at - 4) / 8) }}>{label}</div>
    </div>
  );
};

export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  if (g < FIELD) return null;
  const p = clamp01((g - BUILD) / (BUILT - BUILD));
  const hit = Math.max(0, 1 - Math.abs(g - 931) / 5);                      // the music's last hit at 31.0
  const burst = clamp01((g - 929) / 14);
  const shrink = MOVE(clamp01((g - SHRINK) / (OPEN - SHRINK)));
  const R = mix(RMAX, 0, shrink);
  const slide = MOVE(clamp01((g - SLIDE) / (SLID - SLIDE)));
  const size = shrink > 0 ? mix(432, MARK_W, shrink) : mix(400, 432, p) * (1 + 0.035 * hit);
  const mx = mix(HUB.x, MARK_END.x, slide), my = mix(HUB.y, MARK_END.y, slide);
  const rv = ARRIVE(clamp01((g - WORD) / 22));
  const sk = slide >= 1 ? clamp01((g - WORD - 22) / 10) : 0;              // THMark → the wide logo's own mark (crossfade)
  const push = 1 + 0.035 * clamp01((g - 985) / 94);
  const link = k(g, "w:connection", 0.8, MOVE);
  const lit = clamp01((g - 990) / 4);
  const here = clamp01((g - 990) / 22);

  return (
    <AbsoluteFill>
      {/* the red field's echo: soft rose waves keep travelling out from the logo (the ripples of the ground) */}
      {g >= SHRINK + 4 && (
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          {Array.from({ length: 5 }, (_, j) => {
            const r = 150 + (((g - SHRINK - 4) * 6.2 + j * 230) % 1150);
            const born = clamp01((g - SHRINK - 4 - j * 3) / 10);
            return <circle key={j} cx={960} cy={WAVE_Y} r={r} fill="none" stroke={C.rose} strokeWidth={54} opacity={born * clamp01((1150 - r) / 200) * clamp01((r - 150) / 60)} />;
          })}
        </svg>
      )}
      {/* the talent spills out of the mark as the field opens, into a slow orbit around the end card */}
      {g >= SHRINK && ORBIT.map((o, i) => {
        const e = ARRIVE(clamp01((g - SHRINK - 2 - o.d) / 26));
        const a = o.a0 + 0.0055 * (g - SHRINK);
        const tx = 960 + 880 * o.rs * Math.cos(a), ty = 560 + 455 * o.rs * Math.sin(a);
        const s = o.s * (0.4 + 0.6 * e);
        return <div key={i} style={{ position: "absolute", left: mix(HUB.x, tx, e) - s / 2, top: mix(HUB.y, ty, e) - s / 2, opacity: o.o * clamp01(e * 3) }}><Avatar size={s} style={{ boxShadow: "0 0 0 2px #DCD8D4" }} /></div>;
      })}

      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "960px 560px" }}>
        {/* the wordmark slides out from behind the mark, then the full wide logo holds */}
        {sk < 1 && rv > 0 && (
          <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${mx + MARK_W / 2 + 6}px)` }}>
            <WideLogo width={WL_W} style={{ position: "absolute", left: WL_X - (1 - rv) * 640, top: WL_Y + (my - MARK_END.y) }} />
          </AbsoluteFill>
        )}
        {sk < 1 && shrink > 0 && markAt(mx, my, size, C.red, 1, "red")}
        {sk > 0 && <WideLogo width={WL_W} style={{ position: "absolute", left: WL_X, top: WL_Y, opacity: sk }} />}

        {/* the tagline */}
        <Say g={g} x={120} width={1680} align="center" y={606} size={64}
          words={[{ t: "Your", at: "w:your" }, { t: "next", at: "w:next" }, { t: "connection", at: "w:connection", red: true }, { t: "starts", at: "w:starts" }, { t: "here.", at: "w:here" }]} />

        {/* the thread: a red line and dot connect a graduate and an employer */}
        <Link x1={GRAD.x + AV / 2 + 14} y1={GRAD.y} x2={EMP.x - AV / 2 - 14} y2={EMP.y} p={link} width={5} />
        {link > 0 && link < 1 && <div style={{ position: "absolute", left: mix(GRAD.x + AV / 2 + 14, EMP.x - AV / 2 - 14, link) - 11, top: GRAD.y - 11, width: 22, height: 22, borderRadius: "50%", background: C.red }} />}
        {here > 0 && (
          <>
            <div style={{ position: "absolute", left: 960 - 13, top: GRAD.y - 13, width: 26, height: 26, borderRadius: "50%", background: C.red, transform: `scale(${POP(clamp01(here * 2.2))})` }} />
            <div style={{ position: "absolute", left: 960 - 13 - 40 * here, top: GRAD.y - 13 - 40 * here, width: 26 + 80 * here, height: 26 + 80 * here, borderRadius: "50%", border: `3px solid rgba(207,20,30,${0.5 * (1 - here)})`, boxSizing: "border-box" }} />
          </>
        )}
        <Person g={g} x={GRAD.x} y={GRAD.y} at={958} icon="cap" label="Graduate" lit={lit} />
        <Person g={g} x={EMP.x} y={EMP.y} at={963} icon="building" label="Employer" lit={lit} />
      </AbsoluteFill>

      {/* the red field (from 918) with the white mark building on it; it contracts back into the mark */}
      {(shrink === 0 || R > 60) && (
        <AbsoluteFill style={{ clipPath: `circle(${R}px at ${HUB.x}px ${HUB.y}px)` }}>
          <div style={{ position: "absolute", inset: 0, background: C.red }} />
          {Array.from({ length: 5 }, (_, j) => {
            const r = 210 + (((g - FIELD) * 14 + j * 200) % 1000);
            return <div key={j} style={{ position: "absolute", left: HUB.x - r, top: HUB.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `6px solid rgba(255,255,255,${0.2 * (1 - 0.6 * (r - 210) / 1000)})` }} />;
          })}
          {[BUILD + 1, BUILD + 6].map((b, j) => {
            const t = clamp01((g - b) / 14);
            if (t <= 0 || t >= 1) return null;
            const r = 260 + ARRIVE(t) * 520;
            return <div key={`b${j}`} style={{ position: "absolute", left: HUB.x - r, top: HUB.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${10 * (1 - t) + 2}px solid rgba(255,255,255,${0.35 * (1 - t)})` }} />;
          })}
          {burst > 0 && burst < 1 && (() => { const r = 250 + ARRIVE(burst) * 420; return <div style={{ position: "absolute", left: HUB.x - r, top: HUB.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `6px solid rgba(255,255,255,${0.5 * (1 - burst)})` }} />; })()}
          {g >= BUILD && markAt(mx, my, size, C.white, p, "white")}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
