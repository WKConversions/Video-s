// Builder 4 — hosting, version 3 (plan/storyboard.md, shots 20–28): h3 → h4. Obvious Apple, every shot its own move:
//  20 the sage iris shrinks off a full-bleed site scrolling UP; a big Liquid Glass address bar floats UP like a bubble
//     and wobbles (jelly squash) as it settles; "Forhåndsvisning" selects on "nettet".
//  21 the bar sinks to the bottom (Safari's bottom bar) as "holmfysio.dk" types; setup rows drop out from under an
//     ink Island like iOS notifications, each pushing the stack DOWN on springs; the Island springs open "● Live".
//  21→22 the home gesture: the whole site shrinks into a card and flies UP out of frame.
//  22 bento begins: the Hosting tile pops at centre with a bounce, "83" ticks in; hold = float bob.
//  23 the grid reflows: Hosting slides left, two tiles spring OUT from behind it (staggered); hold = slow rise.
//  24 layout morph: Hosting expands to fill the grid, the others are pushed aside RIGHT; "Fast pris." letter bounce,
//     a flat sage line draws.
//  25 a Liquid Glass lens glides along the line, its year rolling UP 2026 → 2027 → 2028; the grey dashed "Typisk
//     webhotel" line jumps UP with a bounce; hold = slow 3D sway.
//  26 the tile collapses into the left column, the others slide back from the right, the owner tile RISES from below;
//     hold = diagonal parallax.
//  27 the EU tile is DROPPED from above under gravity (real bounces, squash on impact, a ripple through the grid);
//     twelve sage dots pop around a ring one by one; "GDPR" pops.
//  28 the padlock tile arrives on an ARC; the shackle springs open on "binding"; the grid scatters in six directions
//     with momentum into the speed-matched whip RIGHT at h4.
import React from "react";
import {
  C, HolmSite, INOUT, Ico, Island, LiquidGlass, RollNumber, SANS, SERIF, SHADOW_BIG, SITE, SageIris, WIPE, EXIT, OUT,
  aspring, bounce, clamp01, f, k, mix, squash, whipOutR,
} from "../shared";

/* ---------- the clock of this span (30-unit frames; g itself is fractional) ---------- */
const F = {
  h3: f("h3"), skal: f("w:skal"), nettet: f("w:nettet"), vi: f("w:vi"), stter: f("w:stter"), det: f("w:det5"), op: f("w:op"),
  for: f("w:for"), dig: f("w:dig"), fra: f("w:fra"), n83: f("w:83"), kroner: f("w:kroner2"), mdr: f("w:mneden"),
  domne: f("w:domne"), email: f("w:email"), med: f("w:med"), fast: f("w:fast"), pris: f("w:pris"), ogs: f("w:ogs"),
  nr: f("w:nr"), fornyer: f("w:fornyer"), domnet: f("w:domnet"), dit: f("w:dit"), navn: f("w:navn"), servere: f("w:servere"),
  europa: f("w:europa"), ingen: f("w:ingen3"), binding: f("w:binding"), h4: f("h4"),
};
const HOME_UP = F.fra - 9;            // 21 → 22: the home gesture (site card flies up)
const REFLOW = F.domne - 8;           // 23: Hosting slides left
const EXPAND = F.fast - 3;            // 24: the morph
const COLLAPSE = F.domnet - 6;        // 26: collapse
const DROP_AT = F.servere - 6;        // 27: the EU tile is released
const ARC_AT = F.ingen - 13;          // 28: the padlock tile's arc
const SCATTER = F.binding - 1;        // 28: the grid scatters (into the whip)

/* ---------- small local helpers ---------- */
const sec = (fr: number) => fr / 30;
// Springs from a 30-unit frame number (the kit's aspring/bounce take labels or seconds).
const sp = (g: number, at: number, response = 0.5, damping = 1) => aspring(g, sec(at), response, damping);
const bn = (g: number, at: number, response = 0.5, damping = 0.62) => bounce(g, sec(at), response, damping);
// glide: an even travel between frames a and b with short soft ramps (a hold that never stops).
const glide = (g: number, a: number, b: number, e = 0.2) => {
  const t = clamp01((g - a) / Math.max(1, b - a));
  return t < e ? (t * t) / (2 * e * (1 - e)) : t > 1 - e ? 1 - ((1 - t) * (1 - t)) / (2 * e * (1 - e)) : (t - e / 2) / (1 - e);
};
const typedF = (g: number, at: number, text: string, cps = 22) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - at) / 30) * cps))));
const TAU = Math.PI * 2;
// a damped wobble (jelly) starting at frame a: amplitude amp, period per (s), decay (1/s)
const jelly = (g: number, a: number, amp: number, per = 0.3, decay = 4) => { const t = (g - a) / 30; return t <= 0 ? 0 : amp * Math.exp(-decay * t) * Math.sin((TAU * t) / per); };

/* ---------- bento layout: rects that spring between layout states ---------- */
type R = { x: number; y: number; w: number; h: number };
const rr = (x: number, y: number, w: number, h: number): R => ({ x, y, w, h });
type Key = [number, R, number, number];   // at (frame), rect, response, damping
const track = (g: number, r0: R, keys: Key[]): R => {
  let { x, y, w, h } = r0; let prev = r0;
  for (const [at, r, resp, damp] of keys) {
    const p = aspring(g, sec(at), resp, damp);
    x += (r.x - prev.x) * p; y += (r.y - prev.y) * p; w += (r.w - prev.w) * p; h += (r.h - prev.h) * p;
    prev = r;
  }
  return { x, y, w, h };
};
const H_KEYS: [R, Key[]] = [rr(580, 190, 760, 700), [
  [REFLOW, rr(150, 226, 800, 780), 0.62, 0.8],
  [EXPAND, rr(80, 80, 1760, 920), 0.6, 0.74],
  [COLLAPSE, rr(80, 80, 600, 920), 0.55, 0.7],
]];
const D_KEYS: [R, Key[]] = [rr(820, 330, 380, 200), [
  [F.domne, rr(974, 226, 796, 380), 0.5, 0.6],
  [EXPAND + 1, rr(1990, 150, 796, 380), 0.5, 0.78],
  [COLLAPSE + 2, rr(704, 80, 1136, 212), 0.55, 0.7],
  [DROP_AT - 5, rr(704, 80, 556, 212), 0.45, 0.78],
]];
const E_KEYS: [R, Key[]] = [rr(820, 700, 380, 200), [
  [F.email, rr(974, 626, 796, 380), 0.5, 0.6],
  [EXPAND + 3, rr(1990, 600, 796, 380), 0.5, 0.78],
  [COLLAPSE + 5, rr(704, 316, 1136, 212), 0.55, 0.7],
  [DROP_AT - 3, rr(704, 316, 556, 212), 0.45, 0.78],
]];
const O_KEYS: [R, Key[]] = [rr(704, 1180, 1136, 448), [
  [COLLAPSE + 7, rr(704, 552, 1136, 448), 0.55, 0.62],
  [ARC_AT - 3, rr(704, 552, 556, 448), 0.45, 0.78],
]];
const EU_R = rr(1284, 80, 556, 448), L_R = rr(1284, 552, 556, 448);

// The EU tile's gravity drop: a real bouncing fall (height above its slot), not a spring.
const DROP = { h0: 720, gr: 14.4, e: 0.36 };
const DROP_TF = Math.sqrt((2 * DROP.h0) / DROP.gr);   // frames to the first impact
const dropAt = (t: number): { h: number; v: number } => {
  const { h0, gr, e } = DROP;
  if (t <= 0) return { h: h0, v: 0 };
  let v = gr * DROP_TF;
  if (t < DROP_TF) return { h: h0 - 0.5 * gr * t * t, v: gr * t };
  let tt = t - DROP_TF; v *= e;
  for (let i = 0; i < 4; i++) { const tb = (2 * v) / gr; if (tt < tb) return { h: v * tt - 0.5 * gr * tt * tt, v: -(v - gr * tt) }; tt -= tb; v *= e; }
  return { h: 0, v: 0 };
};
const IMPACTS = (() => { const out: [number, number][] = []; let t = DROP_TF, v = DROP.gr * DROP_TF; for (let i = 0; i < 4; i++) { out.push([t, v]); v *= DROP.e; t += (2 * v) / DROP.gr; } return out; })();
const impactSquash = (g: number) => IMPACTS.reduce((s, [t, v]) => { const d = g - DROP_AT - t; return d < 0 ? s : s + 0.16 * (v / (DROP.gr * DROP_TF)) * Math.exp(-d / 2.2); }, 0);
const IMPACT = DROP_AT + DROP_TF;

/* ---------- shared bits ---------- */
const Disc: React.FC<{ ico: string; s?: number; bg?: string; c?: string; style?: React.CSSProperties }> = ({ ico, s = 64, bg = C.sage, c = C.white, style }) => (
  <div style={{ width: s, height: s, borderRadius: s * 0.3, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", ...style }}><Ico n={ico} s={s * 0.58} c={c} w={2.4} /></div>
);
const popStyle = (p: number, dy = 26): React.CSSProperties => ({ opacity: clamp01(p * 3), transform: `translateY(${(1 - p) * dy}px) scale(${0.4 + 0.6 * p})` });
// letters popping one by one with a bounce (Fraunces; italic words in deep sage)
const BounceWords: React.FC<{ g: number; words: { t: string; at: number; it?: boolean }[]; x: number; y: number; size: number; color?: string; itColor?: string }> = ({ g, words, x, y, size, color = C.ink, itColor = C.sageDeep }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", columnGap: size * 0.22, fontFamily: SERIF, fontSize: size, letterSpacing: "-0.025em", lineHeight: 1.05, whiteSpace: "pre", color }}>
    {words.map((w, wi) => (
      <span key={wi} style={{ display: "inline-flex", fontStyle: w.it ? "italic" : "normal", color: w.it ? itColor : color, paddingRight: w.it ? size * 0.05 : 0 }}>
        {w.t.split("").map((ch, i) => {
          const p = bn(g, w.at + i * 0.9, 0.42, 0.55);
          return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * 0.55}em) scale(${0.4 + 0.6 * p})`, transformOrigin: "50% 90%", opacity: clamp01(p * 2.5) }}>{ch}</span>;
        })}
      </span>
    ))}
  </div>
);

/* ================= shots 20–21: the site, the glass bar, the notification stack ================= */
const BAR_W = 1320, BAR_H = 172;
const barY = (g: number) => {
  const rise = bn(g, F.h3 + 2, 0.62, 0.5);                 // floats UP like a bubble, overshoots, settles
  const down = sp(g, F.vi, 0.62, 1);                       // 21: sinks to the bottom
  const bob = 8 * Math.sin((TAU * (g - F.h3)) / 30 / 2.3) * (1 - down);
  return mix(1010, 520, rise) + 352 * down + bob;
};
const Bar: React.FC<{ g: number }> = ({ g }) => {
  const y = barY(g), vy = (y - barY(g - 0.5)) / 0.5;
  const wob = jelly(g, F.h3 + 9, 0.06, 0.32, 3.6) + jelly(g, F.vi + 12, 0.04, 0.28, 5);
  const p = 0.55 + 0.45 * bn(g, F.h3 + 2, 0.5, 0.55);
  const sheen = clamp01(0.08 + (g - F.h3) / 100 + Math.abs(vy) * 0.002);
  const typing = g >= F.vi + 3;
  const txt = typing ? typedF(g, F.vi + 3, "holmfysio.dk", 22) : "Forhåndsvisning";
  const sel = typing ? 0 : WIPE(clamp01((g - F.nettet) / 7));
  const lock = bn(g, F.vi + 21, 0.42, 0.55);
  return (
    // positioned by transform on a static box, as its own layer (will-change): its rise and sink glide by fractions of
    // a pixel instead of snapping its box and re-drawing its text on whole-pixel baselines
    <div style={{ position: "absolute", left: 960 - BAR_W / 2, top: 0, width: BAR_W, height: BAR_H, transform: `translateY(${y - BAR_H / 2}px)`, willChange: "transform" }}>
      <LiquidGlass w={BAR_W} h={BAR_H} p={p} sheen={sheen} transform={`${squash(0, vy, 0.0026)} scale(${1 + wob}, ${1 - wob})`}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.44)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, fontFamily: SANS, fontWeight: 500, fontSize: 72, letterSpacing: "-0.02em", color: C.ink }}>
          <div style={{ position: "relative", width: 60, height: 60, flex: "none" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01(lock * 2), transform: `scale(${1 - 0.6 * clamp01(lock)})` }}><Ico n="sparkle" s={60} c={C.sage} w={2.4} /></div>
            <div style={{ position: "absolute", inset: 0, opacity: clamp01(lock * 2), transform: `scale(${0.3 + 0.7 * lock})` }}><Ico n="lock" s={60} c={C.sageDeep} w={2.6} /></div>
          </div>
          <span style={{ position: "relative", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}>
            <span style={{ position: "absolute", left: -8, right: -8, top: 2, bottom: 2, borderRadius: 12, background: "rgba(168,196,187,0.62)", transformOrigin: "0 50%", transform: `scaleX(${sel})` }} />
            <span style={{ position: "relative" }}>{txt}</span>
          </span>
        </div>
      </LiquidGlass>
    </div>
  );
};

const ROWS = [
  { at: F.stter, t: "Domæne", s: "holmfysio.dk", ico: "globe" },
  { at: F.det, t: "E-mail", s: "kontakt@holmfysio.dk", ico: "mail" },
  { at: F.op, t: "SSL", s: "Sikker forbindelse", ico: "lock" },
  { at: F.for, t: "Hosting", s: "Siden er live", ico: "server" },
];
const RW = 1000, RH = 124, RGAP = 16, RTOP = 126;
const rowY = (g: number, i: number) => {
  let y = mix(-180, RTOP, bn(g, ROWS[i].at, 0.5, 0.66));                              // drops out from under the Island
  for (let j = i + 1; j < ROWS.length; j++) y += (RH + RGAP) * bn(g, ROWS[j].at, 0.5, 0.7);   // pushed down by newer ones
  return y;
};
const Rows: React.FC<{ g: number }> = ({ g }) => (
  <>
    {ROWS.map((r, i) => {
      if (g < r.at) return null;
      const y = rowY(g, i), vy = (y - rowY(g - 0.5, i)) / 0.5, e = bn(g, r.at, 0.5, 0.66), ck = bn(g, r.at + 7, 0.4, 0.5);
      return (
        <div key={i} style={{ position: "absolute", left: 960 - RW / 2, top: 0, width: RW, height: RH, transform: `translateY(${y}px)`, willChange: "transform" }}>
          <LiquidGlass w={RW} h={RH} radius={40} p={0.55 + 0.45 * e} sheen={clamp01(0.15 + (g - r.at) / 50)} transform={squash(0, vy, 0.0018)}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.58)" }} />
            <Disc ico={r.ico} s={74} style={{ position: "absolute", left: 26, top: 25 }} />
            <div style={{ position: "absolute", left: 124, top: 20, fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.ink }}>{r.t}</div>
            <div style={{ position: "absolute", left: 124, top: 66, fontFamily: SANS, fontSize: 30, color: C.muted }}>{r.s}</div>
            <div style={{ position: "absolute", right: 34, top: 35, width: 54, height: 54, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", ...popStyle(ck, 0) }}>
              <Ico n="check" s={36} c={C.white} w={3} />
            </div>
          </LiquidGlass>
        </div>
      );
    })}
  </>
);

const SITE_S = 1920 / SITE.w;
const SiteAct: React.FC<{ g: number }> = ({ g }) => {
  const scroll = 20 + 420 * glide(g, F.h3 - 6, HOME_UP + 16, 0.08);
  const u = clamp01((g - HOME_UP) / 17);                      // the home gesture
  const sc = 1 - 0.44 * INOUT(clamp01(u * 1.35)), ty = -1550 * Math.pow(u, 2.5);
  const scrim = 0.24 + 0.2 * sp(g, F.vi, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${ty}px) scale(${sc})`, transformOrigin: "960px 540px" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 80 * clamp01(u * 3), overflow: "hidden", boxShadow: u > 0 ? SHADOW_BIG : undefined }}>
        {/* the scroll moves the whole page as one composited layer (will-change), so it glides by fractions of a pixel;
            scrolling inside HolmSite re-draws the page every frame and its text snaps to whole-pixel baselines */}
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${-scroll * SITE_S}px)`, willChange: "transform" }}>
          <HolmSite w={1920} h={SITE.page * SITE_S} booking={1} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: `rgba(250,250,248,${scrim})` }} />
      </div>
      <Rows g={g} />
      <Bar g={g} />
    </div>
  );
};

// The ink Island: appears as a pill, springs open "● Live holmfysio.dk" on "dig", closes and lifts away in 22.
const LiveIsland: React.FC<{ g: number }> = ({ g }) => {
  const appear = bn(g, F.vi - 6, 0.45, 0.6), gone = k(g, sec(F.n83 + 26), 0.3, EXIT);
  const open = Math.max(0, bn(g, F.dig, 0.5, 0.6) - bn(g, F.n83 + 16, 0.42, 0.85));
  const pulse = 6 + 6 * Math.sin((TAU * (g - F.dig)) / 22);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-90 * gone}px) scale(${Math.max(0, appear * (1 - gone))})`, transformOrigin: "960px 52px" }}>
      <Island x={960} y={26} w={600} h={88} p={open}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, fontSize: 34, fontWeight: 600, color: C.cream }}>
          <span style={{ width: 18, height: 18, borderRadius: 9, background: C.sageLight, boxShadow: `0 0 0 ${pulse}px rgba(168,196,187,0.28)` }} />
          Live<span style={{ fontWeight: 400, color: C.soft, marginLeft: 6 }}>holmfysio.dk</span>
        </div>
      </Island>
    </div>
  );
};

/* ================= shots 22–28: the bento ================= */
type Off = { dx: number; dy: number; rot: number; sx: number; sy: number; op: number; pre?: string; origin?: string };
const off0 = (): Off => ({ dx: 0, dy: 0, rot: 0, sx: 1, sy: 1, op: 1 });
// A tile springs between layout rects without box geometry (left/top/width/height snap to whole pixels, so a slow
// move or resize would step): it sits on a static box as its own layer (will-change), placed by transform; its card is
// an SVG rect and its content clip a clip-path, both drawn at fractional sizes. Content inside is placed from the
// top-left (anything anchored to a size that changes is moved by transform).
const TILE_R = 46, CLIP_W = 2400, CLIP_H = 1400;
const pct = (v: string, size: number) => (v.endsWith("%") ? (parseFloat(v) / 100) * size : parseFloat(v));
const Tile: React.FC<{ r: R; o: Off; bg: string; line?: boolean; children?: React.ReactNode }> = ({ r, o, bg, line, children }) => {
  const [ox0, oy0] = (o.origin ?? "50% 50%").split(" "), ox = pct(ox0, r.w), oy = pct(oy0, r.h);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: o.op, transformOrigin: "0 0", willChange: "transform",
      transform: `translate(${r.x + ox + o.dx}px, ${r.y + oy + o.dy}px) ${o.pre ?? ""} rotate(${o.rot}deg) scale(${o.sx}, ${o.sy}) translate(${-ox}px, ${-oy}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: r.w, height: r.h, borderRadius: TILE_R, boxShadow: "0 2px 6px rgba(26,22,20,0.05), 0 30px 70px -34px rgba(26,22,20,0.32)" }} />
      <svg width={CLIP_W} height={CLIP_H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {line && <rect x={-1} y={-1} width={r.w + 2} height={r.h + 2} rx={TILE_R + 1} fill={C.line} />}
        <rect x={0} y={0} width={r.w} height={r.h} rx={TILE_R} fill={bg} />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: CLIP_W, height: CLIP_H, clipPath: `inset(0px ${CLIP_W - r.w}px ${CLIP_H - r.h}px 0px round ${TILE_R}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: r.w, height: r.h }}>{children}</div>
      </div>
    </div>
  );
};
const Head: React.FC<{ ico: string; text: string; dark?: boolean; disc?: string; ic?: string }> = ({ ico, text, dark, disc, ic }) => (
  <div style={{ position: "absolute", left: 40, top: 36, display: "flex", alignItems: "center", gap: 18, fontFamily: SANS, fontWeight: 500, fontSize: 34, color: dark ? C.cream : C.ink, whiteSpace: "nowrap" }}>
    <Disc ico={ico} s={64} bg={disc ?? C.sage} c={ic ?? C.white} />{text}
  </div>
);

/* --- 22/24/25: the Hosting tile (in a cell, or expanded with "Fast pris.", the line chart and the year lens) --- */
const CH = { x0: 150, x1: 1610, y: 676, axis: 800, years: [230, 830, 1430] };
const partial = (pts: number[][], len: number) => {
  let left = len; const out = [pts[0]];
  for (let i = 1; i < pts.length && left > 0; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay) || 1e-6, t = Math.min(1, left / d);
    out.push([ax + (bx - ax) * t, ay + (by - ay) * t]); left -= d;
  }
  return out.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
};
const LENS_IN = F.pris + 7;
const lensX = (g: number) => -260 + (CH.years[0] + 260) * bn(g, LENS_IN, 0.6, 0.66) + 600 * bn(g, F.nr, 0.55, 0.68) + 600 * bn(g, F.fornyer, 0.55, 0.68);
const Chart: React.FC<{ g: number }> = ({ g }) => {
  const draw = WIPE(clamp01((g - (F.fast + 6)) / 30));
  const gd = OUT(clamp01((g - (F.pris + 12)) / 12));
  const jump = 186 * bn(g, F.fornyer + 2, 0.5, 0.55);
  const greyPts = [[CH.x0, CH.y], [CH.years[1], CH.y], [CH.years[1], CH.y - jump], [CH.x1, CH.y - jump]];
  const greyLen = (CH.years[1] - CH.x0 + jump + CH.x1 - CH.years[1]) * gd;
  const lx = lensX(g), lv = (lx - lensX(g - 0.5)) / 0.5, lp = g < LENS_IN ? 0 : 0.6 + 0.4 * bn(g, LENS_IN, 0.45, 0.6);
  const idx = sp(g, F.nr, 0.5, 0.62) + sp(g, F.fornyer, 0.5, 0.62);
  const lbl = clamp01(jump / 60);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1760, height: 920 }}>
      <svg width={1760} height={920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={CH.x0} y1={CH.axis} x2={CH.x0 + (CH.x1 - CH.x0) * draw} y2={CH.axis} stroke="rgba(255,255,255,0.45)" strokeWidth={3} />
        {CH.years.map((x, i) => <circle key={i} cx={x} cy={CH.y} r={15 * clamp01((draw * (CH.x1 - CH.x0) - (x - CH.x0)) / 40)} fill={C.white} />)}
        {gd > 0 && <path d={partial(greyPts, greyLen)} stroke="rgba(26,22,20,0.55)" strokeWidth={6} strokeDasharray="20 16" strokeLinecap="round" fill="none" />}
        <path d={`M${CH.x0} ${CH.y} H${CH.x0 + (CH.x1 - CH.x0) * draw}`} stroke={C.white} strokeWidth={12} strokeLinecap="round" fill="none" />
      </svg>
      {CH.years.map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x - 60, width: 120, top: CH.axis + 18, textAlign: "center", fontFamily: SANS, fontSize: 30, color: "rgba(255,255,255,0.85)", opacity: clamp01((draw * (CH.x1 - CH.x0) - (x - CH.x0)) / 60) }}>{2026 + i}</div>
      ))}
      <div style={{ position: "absolute", left: 470, top: CH.y + 26, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.white, opacity: clamp01(draw * 3 - 0.6) }}>Creoble</div>
      <div style={{ position: "absolute", left: 1080, top: CH.y - 64, fontFamily: SANS, fontWeight: 500, fontSize: 30, color: "rgba(26,22,20,0.7)", opacity: lbl, transform: `translateY(${-jump}px) scale(${0.6 + 0.4 * lbl})`, transformOrigin: "0 100%" }}>Typisk webhotel</div>
      {lp > 0.001 && (
        <div style={{ position: "absolute", left: 0, top: CH.y - 78, width: 320, height: 156, transform: `translateX(${lx - 160}px)`, willChange: "transform" }}>
          <LiquidGlass w={320} h={156} radius={78} p={lp} sheen={clamp01(0.15 + (lx + 260) / 1900)} transform={squash(lv, 0, 0.0016)}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.4)" }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-idx * 156}px)`, willChange: "transform" }}>
              {[2026, 2027, 2028].map((y) => <div key={y} style={{ height: 156, lineHeight: "156px", textAlign: "center", fontFamily: SERIF, fontSize: 112, letterSpacing: "-0.03em", color: C.ink }}>{y}</div>)}
            </div>
          </LiquidGlass>
        </div>
      )}
    </div>
  );
};
const HostingTile: React.FC<{ g: number; w: number; h: number; px?: number; py?: number }> = ({ g, w, h, px = 0, py = 0 }) => {
  const e = clamp01((w - 800) / 960), eo = clamp01((e - 0.62) / 0.38);
  const ns = mix(250, 168, e);
  const nx = mix(48, w - 660, e), ny = mix(h / 2 - 196, 54, e);
  const num = clamp01((g - (F.n83 - 3)) / 4), kr = bn(g, F.kroner, 0.42, 0.55), chip = bn(g, F.mdr, 0.42, 0.55);
  return (
    <>
      <Head ico="server" text="Hosting" dark disc={C.white} ic={C.sageDeep} />
      {/* its own layer (will-change): the counter-float moves the price inside the floating tile by fractions of a pixel */}
      <div style={{ position: "absolute", left: 0, top: 0, fontFamily: SANS, transform: `translate(${nx + px}px, ${ny + py}px)`, willChange: "transform" }}>
        <div style={{ fontSize: 34, color: "rgba(255,255,255,0.88)", marginLeft: 8 }}>fra</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: -ns * 0.08 }}>
          <div style={{ opacity: num }}><RollNumber value={83} p={k(g, "w:83", 1.0)} size={ns} color={C.white} /></div>
          <div style={{ fontSize: mix(48, 42, e), fontWeight: 500, color: "rgba(255,255,255,0.9)", paddingBottom: ns * 0.3, whiteSpace: "nowrap", ...popStyle(kr, 30) }}>kr /md</div>
        </div>
        <div style={{ display: "inline-flex", marginTop: 6, marginLeft: 6, padding: "10px 22px", borderRadius: 999, background: C.white, color: C.sageDeep, fontWeight: 500, fontSize: 30, whiteSpace: "nowrap", transformOrigin: "0 50%", ...popStyle(chip, 20) }}>Betalt årligt</div>
      </div>
      {eo > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: eo }}>
          <BounceWords g={g} x={58} y={150} size={196} color={C.white} itColor={C.white} words={[{ t: "Fast", at: F.fast, it: true }, { t: "pris.", at: F.pris }]} />
          <Chart g={g} />
        </div>
      )}
    </>
  );
};
/* --- 23: domain and e-mail tiles (content anchored so it reads in every cell size) --- */
const InfoTile: React.FC<{ g: number; w: number; h: number; ico: string; label: string; value: string; serif?: boolean; dark?: boolean; checkAt: number }> = ({ g, w, h, ico, label, value, serif, checkAt }) => {
  // the value is set at a fixed size and scaled about its bottom-left (h − 34), so a resizing cell never re-lays it out;
  // its optical size ("opsz", which the browser would pick from the font size) follows the size it is shown at
  const base = serif ? 84 : 58, size = serif ? Math.min(84, (w - 90) / 6.4, h * 0.24) : Math.min(58, (w - 90) / 10.6, h * 0.2);
  const ck = bn(g, checkAt, 0.4, 0.5), cps = popStyle(ck, 0);
  return (
    <>
      <Head ico={ico} text={label} />
      <div style={{ position: "absolute", left: 44, top: 0, fontFamily: serif ? SERIF : SANS, fontWeight: serif ? 400 : 500, fontSize: base, letterSpacing: serif ? "-0.025em" : "-0.02em", color: C.ink, whiteSpace: "nowrap", lineHeight: 1.1, fontVariationSettings: `"opsz" ${size}`,
        transformOrigin: "0 100%", transform: `translateY(${h - 34 - 1.1 * base}px) scale(${size / base})` }}>{value}</div>
      <div style={{ position: "absolute", left: 0, top: 40, width: 56, height: 56, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", opacity: cps.opacity, transform: `translateX(${w - 36 - 56}px) ${cps.transform}` }}>
        <Ico n="check" s={36} c={C.white} w={3} />
      </div>
    </>
  );
};
/* --- 26: the owner tile (ink) --- */
const OwnerTile: React.FC<{ g: number; w: number; h: number }> = ({ g, w }) => {
  const big = Math.min(112, (w - 90) / 6.3);
  const who = bn(g, F.dit, 0.42, 0.55), name = sp(g, F.navn, 0.42, 1);
  return (
    <>
      <div style={{ position: "absolute", left: 44, top: 40, display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: "0.16em", textTransform: "uppercase", color: C.sageLight }}>
        <Ico n="globe" s={36} c={C.sageLight} w={2.2} />Domæne
      </div>
      <div style={{ position: "absolute", left: 42, top: 96, fontFamily: SERIF, fontSize: 112, fontVariationSettings: `"opsz" ${big}`, letterSpacing: "-0.025em", color: C.cream, whiteSpace: "nowrap", transformOrigin: "0 0", transform: `scale(${big / 112})` }}>holmfysio.dk</div>
      <div style={{ position: "absolute", left: 44, bottom: 40, display: "flex", alignItems: "center", gap: 22, fontFamily: SANS }}>
        <div style={{ ...popStyle(who, 0) }}><Disc ico="user" s={84} bg={C.sage} /></div>
        <div style={{ overflow: "hidden", paddingBottom: 4 }}>
          <div style={{ fontSize: 30, fontWeight: 500, color: C.sageLight, opacity: clamp01(who * 3) }}>Ejer</div>
          <div style={{ fontSize: 42, fontWeight: 600, color: C.cream, whiteSpace: "nowrap", transform: `translateY(${(1 - Math.min(1, name)) * 110}%)` }}>Holm Fysioterapi</div>
        </div>
      </div>
    </>
  );
};
/* --- 27: servers in Europe: twelve dots pop around a ring (no spin) --- */
const EuTile: React.FC<{ g: number; w: number; h: number }> = ({ g, w, h }) => {
  const cx = w * 0.42, cy = h * 0.56, R0 = 128, gd = bn(g, F.europa, 0.42, 0.55);
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 38, fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.ink }}>Servere i EU</div>
      {Array.from({ length: 12 }, (_, i) => {
        const a = -Math.PI / 2 + (i * TAU) / 12, p = bn(g, IMPACT + 1 + Math.round(i * 2.1), 0.38, 0.5);
        return <div key={i} style={{ position: "absolute", left: cx + R0 * Math.cos(a) - 14, top: cy + R0 * Math.sin(a) - 14, width: 28, height: 28, borderRadius: 14, background: C.sage, opacity: clamp01(p * 3), transform: `scale(${Math.max(0, p)})` }} />;
      })}
      <div style={{ position: "absolute", left: cx - 52, top: cy - 52 }}><Ico n="server" s={104} c={C.ink} w={2.2} /></div>
      <div style={{ position: "absolute", right: 34, bottom: 34, display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 999, background: C.sageDark, color: C.white, fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: "0.04em", transformOrigin: "100% 100%", ...popStyle(gd, 20) }}>
        <Ico n="shield" s={32} c={C.white} w={2.4} />GDPR
      </div>
    </>
  );
};
/* --- 28: the padlock (shackle springs open) --- */
const Padlock: React.FC<{ s: number; open: number }> = ({ s, open }) => (
  <svg width={s} height={s * 1.1} viewBox="0 0 200 220" style={{ display: "block", overflow: "visible" }}>
    <g transform={`translate(0 ${-30 * open}) rotate(${-24 * open} 52 112)`}>
      <path d="M52 118 V74 a48 48 0 0 1 96 0 V118" fill="none" stroke={C.white} strokeWidth={24} strokeLinecap="round" />
    </g>
    <rect x="18" y="100" width="164" height="118" rx="28" fill={C.white} />
    <circle cx="100" cy="150" r="15" fill={C.sageDark} /><rect x="93" y="150" width="14" height="36" rx="7" fill={C.sageDark} />
  </svg>
);
const LockTile: React.FC<{ g: number; w: number; h: number }> = ({ g }) => {
  const open = bn(g, F.binding - 3, 0.42, 0.45), lbl = bn(g, F.ingen, 0.42, 0.55);
  return (
    <>
      <div style={{ position: "absolute", right: 56, top: 52 }}><Padlock s={150} open={open} /></div>
      <div style={{ position: "absolute", left: 44, bottom: 38, fontFamily: SERIF, fontSize: 100, lineHeight: 0.98, letterSpacing: "-0.025em", color: C.white, transformOrigin: "0 100%", ...popStyle(lbl, 24) }}>Ingen<br /><span style={{ fontStyle: "italic" }}>binding.</span></div>
    </>
  );
};

const Bento: React.FC<{ g: number }> = ({ g }) => {
  const H = track(g, ...H_KEYS), D = track(g, ...D_KEYS), E = track(g, ...E_KEYS), O = track(g, ...O_KEYS);
  const t = g / 30;
  // ambient life: every tile breathes on its own phase (small; the named holds below are the shot's motion)
  const amb = (i: number) => clamp01((g - F.fra - 8) / 12) * 5 * Math.sin(TAU * (t / (2.6 + i * 0.23)) + i * 1.7);
  // 22 hold: float bob of the lone Hosting tile
  const fEnv = clamp01((g - F.fra - 4) / 10) * (1 - clamp01((g - REFLOW) / 12));
  const ft = (g - F.fra) / 30;
  const float = fEnv * 32 * Math.sin((TAU * ft) / 1.8), floatX = fEnv * 22 * Math.sin((TAU * ft) / 2.6 + 1.1), floatR = fEnv * 2 * Math.sin((TAU * ft) / 2.2 + 0.8);
  const cpx = fEnv * -16 * Math.sin((TAU * ft) / 2.6 + 1.9), cpy = fEnv * -18 * Math.sin((TAU * ft) / 1.8 + 0.9);
  // 23 hold: the grid rises slowly, then settles back as the morph takes over
  const rise = -132 * glide(g, REFLOW + 4, EXPAND + 4, 0.16) * (1 - sp(g, EXPAND, 0.6, 1));
  // 25 hold: slow 3D sway of the expanded tile
  const sway = sp(g, F.pris + 4, 0.9, 1) * (1 - sp(g, COLLAPSE, 0.45, 1)) * (-7 + 14 * glide(g, F.pris + 4, COLLAPSE, 0.15));
  // 26 hold: diagonal parallax (each tile at its own depth)
  const par = sp(g, COLLAPSE, 0.7, 1) * (1 - sp(g, DROP_AT - 6, 0.5, 1)) * (glide(g, COLLAPSE, DROP_AT, 0.1) - 0.5);
  // 27: the impact ripple through the grid (tiles dip in turn, nearest first)
  const ripple = (dist: number) => { const d = g - IMPACT - dist / 160; return d <= 0 ? 0 : 18 * Math.exp(-d / 9) * Math.sin(d / 2.4); };
  // 28: scatter with momentum (each tile its own direction and spin)
  const su = clamp01((g - SCATTER) / 11), sd = 640 * (0.45 * su + 0.55 * su * su);
  const scat = (o: Off, ux: number, uy: number, spin: number) => { const n = Math.hypot(ux, uy); o.dx += (ux / n) * sd; o.dy += (uy / n) * sd; o.rot += spin * su; return o; };

  // --- Hosting ---
  const oH = off0();
  const pop = bn(g, F.fra, 0.5, 0.58);
  oH.sx = oH.sy = 0.2 + 0.8 * pop; oH.op = clamp01((g - F.fra) / 3);
  oH.dy += float + rise + amb(0) + ripple(1000) - par * 40 * 0.6; oH.dx += par * 56 * -0.6 + floatX; oH.rot += floatR;
  if (sway !== 0) oH.pre = `perspective(2200px) rotateY(${sway}deg)`;
  scat(oH, -1, 0.15, -16);
  // --- Domain / E-mail: spring out from behind Hosting, staggered ---
  const oD = off0(), oE = off0();
  oD.op = clamp01((g - F.domne) / 3); oE.op = clamp01((g - F.email) / 3);
  oD.dy += rise + amb(1) + ripple(650) + par * -30; oD.dx += par * 50;
  oE.dy += rise + amb(2) + ripple(420) + par * -42; oE.dx += par * 66;
  scat(oD, -0.25, -1, 14); scat(oE, 0.5, -1, -22);
  // --- Owner: rises from below ---
  const oO = off0();
  oO.dy += amb(3) + ripple(300) + par * -60; oO.dx += par * 86;
  scat(oO, 0.05, 1, 12);
  // --- EU: the gravity drop ---
  const dState = dropAt(g - DROP_AT), oU = off0();
  const isq = impactSquash(g), fallStretch = Math.min(0.12, Math.max(0, dState.v) * 0.0012);
  oU.dy = -dState.h + amb(4) * clamp01((g - IMPACT - 20) / 10); oU.sx = 1 + 0.6 * isq - 0.5 * fallStretch; oU.sy = 1 - isq + fallStretch; oU.origin = "50% 100%";
  scat(oU, 0.7, -1, 20);
  // --- Padlock: travels in on an arc ---
  const ua = bn(g, ARC_AT, 0.55, 0.62), oL = off0();
  const P0 = [2260, 1380], PC = [2050, 560], P1 = [L_R.x + L_R.w / 2, L_R.y + L_R.h / 2];
  const qx = (1 - ua) * (1 - ua) * P0[0] + 2 * ua * (1 - ua) * PC[0] + ua * ua * P1[0], qy = (1 - ua) * (1 - ua) * P0[1] + 2 * ua * (1 - ua) * PC[1] + ua * ua * P1[1];
  oL.dx = qx - P1[0]; oL.dy = qy - P1[1]; oL.rot = 24 * (1 - ua); oL.sx = oL.sy = 0.7 + 0.3 * Math.min(1.04, ua);
  scat(oL, 1, 0.45, 26);

  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${whipOutR(g, "h4")}px)` }}>
      {g >= F.domne && <Tile r={D} o={oD} bg={C.sageTint}><InfoTile g={g} w={D.w} h={D.h} ico="globe" label="Domæne" value="holmfysio.dk" serif checkAt={F.med} /></Tile>}
      {g >= F.email && <Tile r={E} o={oE} bg={C.card} line><InfoTile g={g} w={E.w} h={E.h} ico="mail" label="E-mail" value="kontakt@holmfysio.dk" checkAt={F.med + 3} /></Tile>}
      <Tile r={H} o={oH} bg={C.sage}><HostingTile g={g} w={H.w} h={H.h} px={cpx} py={cpy} /></Tile>
      {g >= COLLAPSE + 7 && <Tile r={O} o={oO} bg={C.ink}><OwnerTile g={g} w={O.w} h={O.h} /></Tile>}
      {g >= DROP_AT && <Tile r={EU_R} o={oU} bg={C.white} line><EuTile g={g} w={EU_R.w} h={EU_R.h} /></Tile>}
      {g >= ARC_AT && <Tile r={L_R} o={oL} bg={C.sageDark}><LockTile g={g} w={L_R.w} h={L_R.h} /></Tile>}
    </div>
  );
};

export const Scene4: React.FC<{ g: number }> = ({ g }) => {
  if (g < F.h3 || g >= F.h4) return null;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {g < HOME_UP + 18 && <SiteAct g={g} />}
      {g >= F.fra && <Bento g={g} />}
      {g >= F.vi - 8 && g < F.n83 + 38 && <LiveIsland g={g} />}
      {g < F.h3 + 14 && <SageIris g={g} at="h3" />}
    </div>
  );
};
