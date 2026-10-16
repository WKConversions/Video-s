// Scene E (from s4): Talent Hub. Your next connection starts here. See ../../../plan/storyboard.md and plan/v2-jongleren-nl.md.
// Mirrors A: on the full red field the white "th" builds big (the hit on "Hub"); the field contracts back into the mark,
// which turns red while the talent spills out of it into a loose orbit; the mark slides left and the wordmark slides
// out from behind it into the wide logo; the tagline builds under it, and a red dot and line connect a graduate and an
// employer. v2: on "here" the connection's red dot drops down a thread, lands as a "verified" check on a thin divider,
// and the partner lockup ("Verified talent partner" + the JongLeren mark and wordmark) unfolds out of that line.
// An end card with a gentle push. Timed only on labels (s4, w:talent4, w:hub2, w:your, w:connection, w:here, end).
import React from "react";
import { AbsoluteFill } from "remotion";
import { ARRIVE, Avatar, C, FONT, Ico, JLMark, JLWord, Link, MOVE, POP, Say, THMark, WideLogo, clamp01, f, k, mix, tx } from "../shared";
import { TH } from "../thpaths";

const rnd = (i: number, s: number) => { const x = Math.sin(i * 91.7 + s * 271.3) * 43758.5453; return x - Math.floor(x); };
const HUB = { x: 960, y: 540 };
const RMAX = Math.hypot(960, 540) + 4;
// the end card (before the push): the wide logo (the hero, 1000 px wide), the tagline, the thread, the partner lockup
const WL_W = 1000, WL_H = (WL_W * 344) / 1701, WL_X = 960 - WL_W / 2, WL_Y = 282 - WL_H / 2;
const MARK_W = (WL_W * 438) / 1701, MARK_H = (MARK_W * TH.h) / TH.w;     // its square mark is the first 438 of 1701 units
const MARK_END = { x: WL_X + MARK_W / 2, y: WL_Y + MARK_H / 2 };
const TAG_Y = 436;
// the two people the line connects, and the partner lockup the line drops to
const AV = 84, ROW = 604;
const GRAD = { x: 680, y: ROW }, EMP = { x: 1240, y: ROW };
const DIV_Y = 722, DIV_W = 640, LOCK_TOP = DIV_Y + 30, JL_H = 80, JL_W = 340;
const WAVE_Y = 480;

const ORBIT = Array.from({ length: 20 }, (_, i) => ({ a0: (i / 20) * Math.PI * 2 + rnd(i, 1) * 0.2, rs: 0.92 + rnd(i, 2) * 0.12, s: 34 + rnd(i, 3) * 22, o: 0.7 + rnd(i, 4) * 0.3, d: rnd(i, 5) * 10 }));

const markAt = (x: number, y: number, size: number, color: string, p = 1, key?: string) => (
  <div key={key} style={{ position: "absolute", left: x - size / 2, top: y - (size * TH.h) / TH.w / 2 }}><THMark size={size} color={color} p={p} /></div>
);

const Person: React.FC<{ g: number; x: number; y: number; at: number; icon: string; label: string; side: "left" | "right"; lit: number }> = ({ g, x, y, at, icon, label, side, lit }) => {
  const s = POP(clamp01((g - at) / 12));
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - AV / 2, top: y - AV / 2, width: AV, height: AV, transform: `scale(${s})`, transformOrigin: "50% 50%" }}>
      <Avatar size={AV} ring={lit > 0.5 ? C.red : C.rose} style={{ boxShadow: `0 0 0 ${AV * 0.06}px ${lit > 0.5 ? C.red : C.rose}, 0 18px 34px -18px rgba(25,27,32,0.4)` }} />
      <div style={{ position: "absolute", left: AV - 30, top: AV - 34, width: 38, height: 38, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${C.ivory}` }}>
        <Ico n={icon} s={22} c={C.white} w={2.8} />
      </div>
      {/* the role reads beside the avatar: Graduate (o)———●———(o) Employer */}
      <div style={{ position: "absolute", top: AV / 2 - 17, ...(side === "left" ? { right: AV + 26, textAlign: "right" as const } : { left: AV + 30 }), whiteSpace: "nowrap",
        fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.gray, opacity: clamp01((g - at - 4) / 8), transform: `translateX(${(side === "left" ? 1 : -1) * 14 * (1 - ARRIVE(clamp01((g - at - 4) / 12)))}px)` }}>{label}</div>
    </div>
  );
};

export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  const FIELD = f("s4") + 3;                       // D's iris covers by s4+5; E's own field is full from s4+3
  if (g < FIELD) return null;
  const YOUR = f("w:your"), HERE = f("w:here"), HUB2 = f("w:hub2");
  const BUILD = f("w:talent4"), SHRINK = YOUR - 11, OPEN = YOUR + 2, SLIDE = YOUR - 9, SLID = YOUR + 10, WORD = YOUR - 2;
  const p = clamp01((g - BUILD) / Math.max(1, SHRINK - BUILD));
  const hit = Math.max(0, 1 - Math.abs(g - HUB2) / 5);                     // the last hit, on "Hub"
  const burst = clamp01((g - (HUB2 - 2)) / 14);
  const shrink = MOVE(clamp01((g - SHRINK) / (OPEN - SHRINK)));
  const R = mix(RMAX, 0, shrink);
  const slide = MOVE(clamp01((g - SLIDE) / (SLID - SLIDE)));
  const size = shrink > 0 ? mix(432, MARK_W, shrink) : mix(400, 432, p) * (1 + 0.035 * hit);
  const mx = mix(HUB.x, MARK_END.x, slide), my = mix(HUB.y, MARK_END.y, slide);
  const rv = ARRIVE(clamp01((g - WORD) / 22));
  const sk = slide >= 1 ? clamp01((g - WORD - 22) / 10) : 0;              // THMark → the wide logo's own mark (crossfade)
  const push = 1 + 0.035 * clamp01((g - (HERE - 5)) / Math.max(1, f("end") - 1 - (HERE - 5)));
  const link = k(g, "w:connection", 0.8, MOVE);
  const lit = clamp01((g - HERE) / 4);
  const here = clamp01((g - HERE) / 22);
  // v2: the connection's dot drops down the thread to the partner lockup; it lands as a "verified" check
  const L1 = GRAD.x + AV / 2 + 14, L2 = EMP.x - AV / 2 - 14;
  const drop = MOVE(clamp01((g - HERE - 5) / 12));
  const landed = clamp01((g - HERE - 17) / 10);
  const divider = MOVE(clamp01((g - HERE - 15) / 18));
  const lbl = ARRIVE(clamp01((g - HERE - 22) / 18));
  const lock = ARRIVE(clamp01((g - HERE - 28) / 20));
  const dropY = mix(ROW, DIV_Y, drop);

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
        const ox = 960 + 880 * o.rs * Math.cos(a), oy = 560 + 455 * o.rs * Math.sin(a);
        const s = o.s * (0.4 + 0.6 * e);
        const cx = mix(HUB.x, ox, e), cy = mix(HUB.y, oy, e);
        // keep the wide logo clear: an orbiting avatar fades as it passes near the logo's box
        const dx = Math.max(WL_X - 24 - cx, 0, cx - (WL_X + WL_W + 24)), dy = Math.max(WL_Y - 24 - cy, 0, cy - (WL_Y + WL_H + 24));
        const keep = mix(1, clamp01((Math.hypot(dx, dy) - s / 2) / 36), e);
        return <div key={i} style={{ position: "absolute", left: cx - s / 2, top: cy - s / 2, opacity: o.o * clamp01(e * 3) * keep }}><Avatar size={s} style={{ boxShadow: "0 0 0 2px #DCD8D4" }} /></div>;
      })}

      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "960px 540px" }}>
        {/* the wordmark slides out from behind the mark, then the full wide logo holds */}
        {sk < 1 && rv > 0 && (
          <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${mx + MARK_W / 2 + 6}px)` }}>
            <WideLogo width={WL_W} style={{ position: "absolute", left: WL_X - (1 - rv) * 600, top: WL_Y + (my - MARK_END.y) }} />
          </AbsoluteFill>
        )}
        {sk < 1 && shrink > 0 && markAt(mx, my, size, C.red, 1, "red")}
        {sk > 0 && <WideLogo width={WL_W} style={{ position: "absolute", left: WL_X, top: WL_Y, opacity: sk }} />}

        {/* the tagline */}
        <Say g={g} x={120} width={1680} align="center" y={TAG_Y} size={64}
          words={tx(
            [{ t: "Your", at: "w:your" }, { t: "next", at: "w:next" }, { t: "connection", at: "w:connection", red: true }, { t: "starts", at: "w:starts" }, { t: "here.", at: "w:here" }],
            [{ t: "Jouw", at: "w:nl_jouw" }, { t: "volgende", at: "w:nl_volgende" }, { t: "connectie", at: "w:nl_connectie", red: true }, { t: "begint", at: "w:nl_begint" }, { t: "hier.", at: "w:nl_hier" }],
          )} />

        {/* the thread: a red line and dot connect a graduate and an employer */}
        <Link x1={L1} y1={ROW} x2={L2} y2={ROW} p={link} width={5} />
        {link > 0 && link < 1 && <div style={{ position: "absolute", left: mix(L1, L2, link) - 11, top: ROW - 11, width: 22, height: 22, borderRadius: "50%", background: C.red }} />}

        {/* ... and from that connection the thread drops to the partner who verifies the talent */}
        {drop > 0 && <div style={{ position: "absolute", left: 960 - 2.5, top: ROW, width: 5, height: dropY - ROW, background: C.red, borderRadius: 3 }} />}
        {divider > 0 && (
          <div style={{ position: "absolute", left: 960 - (DIV_W / 2) * divider, top: DIV_Y - 1, width: DIV_W * divider, height: 2,
            background: "linear-gradient(90deg, rgba(107,110,118,0), rgba(107,110,118,0.4) 22%, rgba(107,110,118,0.4) 78%, rgba(107,110,118,0))" }} />
        )}
        {(lbl > 0 || lock > 0) && (
          <div style={{ position: "absolute", left: 360, width: 1200, top: DIV_Y + 1, height: 260, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, width: 1200, top: LOCK_TOP - DIV_Y - 1, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: "0.2em",
              textTransform: "uppercase", color: C.gray, whiteSpace: "nowrap", opacity: clamp01(lbl * 1.6), transform: `translateY(${-(1 - lbl) * 46}px)` }}>
              {tx("Verified talent partner", "Geverifieerde talentpartner")}
            </div>
            {/* the mark and wordmark unfold from just under the label, so they never pass through it */}
            <div style={{ position: "absolute", left: 0, width: 1200, top: LOCK_TOP - DIV_Y - 1 + 40, height: 120, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, width: 1200, top: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 26,
                opacity: clamp01(lock * 1.6), transform: `translateY(${-(1 - lock) * 96}px)` }}>
                <JLMark h={JL_H} />
                <JLWord w={JL_W} />
              </div>
            </div>
          </div>
        )}
        {drop > 0 && landed <= 0 && <div style={{ position: "absolute", left: 960 - 11, top: dropY - 11, width: 22, height: 22, borderRadius: "50%", background: C.red }} />}
        {landed > 0 && (() => {
          const s = POP(landed), r = 11 + 7 * s;
          return (
            <>
              <div style={{ position: "absolute", left: 960 - r, top: DIV_Y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: C.red, boxShadow: `0 0 0 5px ${C.ivory}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ opacity: clamp01(landed * 2 - 0.6), transform: `scale(${0.5 + 0.5 * s})` }}><Ico n="check" s={24} c={C.white} w={4} /></div>
              </div>
              {landed < 1 && <div style={{ position: "absolute", left: 960 - 18 - 44 * landed, top: DIV_Y - 18 - 44 * landed, width: 36 + 88 * landed, height: 36 + 88 * landed, borderRadius: "50%", border: `3px solid rgba(207,20,30,${0.45 * (1 - landed)})`, boxSizing: "border-box" }} />}
            </>
          );
        })()}

        {here > 0 && (
          <>
            <div style={{ position: "absolute", left: 960 - 13, top: ROW - 13, width: 26, height: 26, borderRadius: "50%", background: C.red, transform: `scale(${POP(clamp01(here * 2.2))})` }} />
            <div style={{ position: "absolute", left: 960 - 13 - 40 * here, top: ROW - 13 - 40 * here, width: 26 + 80 * here, height: 26 + 80 * here, borderRadius: "50%", border: `3px solid rgba(207,20,30,${0.5 * (1 - here)})`, boxSizing: "border-box" }} />
          </>
        )}
        <Person g={g} x={GRAD.x} y={GRAD.y} at={YOUR + 5} icon="cap" label={tx("Graduate", "Afgestudeerde")} side="left" lit={lit} />
        <Person g={g} x={EMP.x} y={EMP.y} at={YOUR + 10} icon="building" label={tx("Employer", "Werkgever")} side="right" lit={lit} />
      </AbsoluteFill>

      {/* the red field (from s4+3) with the white mark building on it; it contracts back into the mark */}
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
