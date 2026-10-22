// Segment B (9.8-16.85 s): "An international networking community bringing founders, entrepreneurs, builders, and
// investors together in Málaga." A split-flap arrivals board grows out of the wax seal; rows flip to the four roles on
// their words while the camera glides down the board; on "together" giant flaps spell MÁLAGA, the photo fills the
// letters and the camera flies through the L into the H2 photo.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { F, SERIF, SANS, SHADOW, w, clamp, mix, ease, inout, spring, seeded, H1Seal, H2Malaga, H2, SerifLine } from "../kit";

const HOLD_IN = 9.8 + 0.25; // H1 drawn unchanged until here
const HOLD_OUT = H2 - 0.25; // H2 drawn unchanged from here
// the L's stem in the giant serif: its centre relative to the old origin, and its width (measured from a render)
const L_DX = 0.5, STEM = 27; // stem about +/-14.4 px about OX; Chrome drops clip-path glyphs past ~50x, so a rect inside the stem carries the cover
const ALPH = "ABCDEFGHIJKLMNOPRSTUVWYZ";
const rl = (s: number) => ALPH[Math.floor(seeded(s) * ALPH.length) % ALPH.length];

// ---------- split-flap cell ----------
type Glyph = { font: string; size: number; weight: number; cap: number; color: string; accent?: string; final?: string; dy?: number; hide?: boolean };
// a lit (cream) face with no character: the giant cards arrive blank and lit
const LIT = "\u00a0";
type Timeline = { chars: (string | null)[]; at: number[] }; // flip k at at[k] turns chars[k] into chars[k+1]

const tlRun = (tl: Timeline, to: string, start: number, n: number, gap: number, seed: number) => {
  for (let k = 0; k < n; k++) {
    tl.at.push(start + k * gap);
    tl.chars.push(k === n - 1 ? to : rl(seed * 13.7 + k * 3.1));
  }
  return tl;
};

const TOP_FACE = "linear-gradient(180deg, #FCFAF6 0%, #F3EFE8 100%)";
const BOT_FACE = "linear-gradient(180deg, #EDE8E0 0%, #E3DDD3 100%)";
// unlit (blank) flaps sit a step darker so the arriving words read first
const TOP_BLANK = "linear-gradient(180deg, #E4DED5 0%, #D9D2C7 100%)";
const BOT_BLANK = "linear-gradient(180deg, #D3CBBF 0%, #C9C0B3 100%)";

const Half: React.FC<{ w: number; h: number; top: boolean; ch: string | null; g: Glyph; r: number; style?: React.CSSProperties; shade?: number; sg?: number }> = ({ w, h, top, ch, g, r, style, shade = 0, sg = 1 }) => {
  if (ch === null) return null;
  const hh = h / 2 - sg;
  const col = g.final !== undefined && ch === g.final ? (g.accent ?? g.color) : g.color;
  return (
    <div style={{ position: "absolute", left: 0, top: top ? 0 : h / 2 + sg, width: w, height: hh, overflow: "hidden",
      borderRadius: top ? `${r}px ${r}px 2px 2px` : `2px 2px ${r}px ${r}px`, background: ch === " " ? (top ? TOP_BLANK : BOT_BLANK) : top ? TOP_FACE : BOT_FACE, ...style }}>
      {ch !== " " && ch !== LIT && !g.hide && (
        <svg width={w} height={h} style={{ position: "absolute", left: 0, top: top ? 0 : -(h / 2 + sg) }}>
          <text x={w / 2} y={h / 2 + (g.cap * g.size) * 0.42 + (g.dy ?? 0)} textAnchor="middle" fontFamily={g.font} fontSize={g.size} fontWeight={g.weight} fill={col}>{ch}</text>
        </svg>
      )}
      {shade > 0.001 && <div style={{ position: "absolute", inset: 0, background: `rgba(20,18,16,${shade})` }} />}
    </div>
  );
};

// light: the small rows (mini, flight code, status) get a fine 1 px split and no hinge pins, so a row of small flaps
// never reads as struck-through text; the large header, role and giant flaps keep the strong split and pins.
const Flap: React.FC<{ t: number; x: number; y: number; w: number; h: number; tl: Timeline; d: number; g: Glyph; r?: number; style?: React.CSSProperties; shadow?: number; light?: boolean; sg?: number; pinO?: number }> = ({ t, x, y, w, h, tl, d, g, r = 6, style, shadow = 1, light = false, sg: sgIn, pinO = 1 }) => {
  const sg = sgIn ?? (light ? 0 : 1);
  let k = -1;
  for (let i = 0; i < tl.at.length; i++) if (tl.at[i] <= t) k = i;
  let cur: string | null, nxt: string | null = null, f = -1;
  if (k < 0) cur = tl.chars[0];
  else if (t < tl.at[k] + d) { cur = tl.chars[k]; nxt = tl.chars[k + 1]; f = (t - tl.at[k]) / d; }
  else cur = tl.chars[k + 1];
  const flipping = f >= 0;
  const anyVisible = cur !== null || nxt !== null;
  if (!anyVisible) return null;
  const a = flipping ? (f < 0.5 ? f * 180 : (1 - f) * 180) : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${x}px, ${y}px)`, perspective: h * 4, ...style }}>
      {shadow > 0.001 && <div style={{ position: "absolute", left: 2, top: 4, width: w - 4, height: h - 2, borderRadius: r, background: `rgba(0,0,0,${0.38 * shadow})`, filter: "blur(3px)" }} />}
      {/* static halves: the next char's top is revealed behind the falling flap; the current char's bottom stays until covered */}
      <Half w={w} h={h} top ch={flipping ? nxt : cur} g={g} r={r} sg={sg} />
      <Half w={w} h={h} top={false} ch={cur} g={g} r={r} sg={sg} shade={flipping && f < 0.5 ? f * 0.35 : flipping ? (1 - f) * 0.25 : 0} />
      {flipping && f < 0.5 && (
        <Half w={w} h={h} top ch={cur} g={g} r={r} sg={sg} shade={a / 90 * 0.18}
          style={{ transformOrigin: "50% 100%", transform: `rotateX(${-a}deg)`, top: 0 }} />
      )}
      {flipping && f >= 0.5 && (
        <Half w={w} h={h} top={false} ch={nxt} g={g} r={r} sg={sg} shade={a / 90 * 0.4}
          style={{ transformOrigin: "50% 0%", transform: `rotateX(${a}deg)` }} />
      )}
      {light ? (
        // a fine split, inside the card only
        <div style={{ position: "absolute", left: 1, top: h / 2 - 0.5, width: w - 2, height: 1, background: "rgba(0,0,0,0.3)" }} />
      ) : pinO > 0.001 && (
        <>
          <div style={{ position: "absolute", left: -2, top: h / 2 - h * 0.07, width: 4, height: h * 0.14, borderRadius: 2, background: "#1b1a18", opacity: pinO }} />
          <div style={{ position: "absolute", left: w - 2, top: h / 2 - h * 0.07, width: 4, height: h * 0.14, borderRadius: 2, background: "#1b1a18", opacity: pinO }} />
        </>
      )}
    </div>
  );
};

// ---------- board layout (board space; the camera slides it up) ----------
const PANEL = { x: 96, y: 96, w: 1728, h: 2150 };
const HDR = { y: 236, w: 102, h: 146, step: 110, x0: 150 };
const MINI = { y: 420, w: 36, h: 52, step: 40, x0: 150, n: 40 };
const ROW0 = 660, RSTEP = 170, NROWS = 10;
const CODE = { x0: 150, w: 44, h: 64, step: 50 };
const ROLE = { x0: 500, w: 66, h: 96, step: 72, n: 13 };
const STAT = { x0: 1480, w: 44, h: 64, step: 50 };

const gHdr: Glyph = { font: SERIF, size: 112, weight: 500, cap: 0.68, color: F.ink, dy: 9 };
const gHdrM: Glyph = { ...gHdr, color: F.bronze };
const gMini: Glyph = { font: SANS, size: 30, weight: 800, cap: 0.71, color: F.ink };
const gMiniB: Glyph = { ...gMini, color: F.bronze };
const gRole: Glyph = { font: SERIF, size: 76, weight: 500, cap: 0.68, color: F.ink };
const gCode: Glyph = { font: SANS, size: 30, weight: 800, cap: 0.71, color: F.grey };
const gStat: Glyph = { font: SANS, size: 30, weight: 800, cap: 0.71, color: F.ink, accent: F.bronze };

const ROLES: [string, string][] = [["FOUNDERS", "founders2"], ["ENTREPRENEURS", "entrepreneurs"], ["BUILDERS", "builders"], ["INVESTORS", "investors"]];

// the moment every small flap flips at once (on "together")
const ALL = () => w("together");

// (cells whose screen position at that moment lies behind the "together" line go straight to blank, no letters)
const withAll = (tl: Timeline, seed: number, by: number) => {
  const s = ALL() + seeded(seed * 7.3) * 0.12;
  const last = tl.chars[tl.chars.length - 1];
  if (last === null) return tl;
  const sy = by - camY(ALL());
  const calm = sy > 90 && sy < 360;
  tlRun(tl, " ", calm ? ALL() + seeded(seed * 7.3) * 0.05 : s, calm ? 1 : 3, 0.07, seed + 400);
  return tl;
};
const idle = (tl: Timeline, seed: number, from: number) => {
  const per = 1.1 + seeded(seed * 3.3) * 1.3;
  for (let s = from + seeded(seed * 5.1) * per; s < ALL() - 0.1; s += per) { tl.at.push(s); tl.chars.push(" "); }
  return tl;
};

// the board wakes up: two diagonal waves of blank flips cross it between "networking" and "bringing"
const wake = (tl: Timeline, x: number, y: number): Timeline => {
  const first = tl.at.length ? tl.at[0] : 99;
  const ws = [10.74, 11.26].map((b) => b + ((x - 150) / 1600) * 0.32 + ((y - 236) / 1500) * 0.22);
  if (tl.chars.every((c) => c === " ")) {
    const all = [...tl.at, ...ws].sort((a, b) => a - b).filter((v, i, arr) => i === 0 || v - arr[i - 1] > 0.09);
    return { chars: [" ", ...all.map(() => " ")], at: all };
  }
  const add = ws.filter((v) => v < first - 0.1);
  return { chars: [" ", ...add.map(() => " "), ...tl.chars.slice(1)], at: [...add, ...tl.at] };
};

// the camera's glide down the board: Hermite through (time, y, speed px/s) keys, the active row near mid-frame
const camKeys = (): [number, number, number][] => {
  const r = ROLES.map(([, k]) => w(k));
  return [[w("bringing"), 0, 0], [r[0], 150, 240], [r[1], 320, 220], [r[2], 490, 198], [r[3], 660, 200], [17.2, 660 + (17.2 - r[3]) * 200, 200]];
};
const camY = (t: number) => {
  const K = camKeys();
  if (t <= K[0][0]) return 0;
  for (let i = 0; i < K.length - 1; i++) {
    const [t0, p0, v0] = K[i], [t1, p1, v1] = K[i + 1];
    if (t <= t1) {
      const h = t1 - t0, s = (t - t0) / h, s2 = s * s, s3 = s2 * s;
      return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * h * v0 + (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * h * v1;
    }
  }
  return K[K.length - 1][1];
};

const Board: React.FC<{ t: number }> = ({ t }) => {
  const cy = camY(t);
  const vis = (y: number, h: number) => y - cy < 1200 && y + h - cy > -120;
  const cells: React.ReactNode[] = [];
  // header: ARRIVALS (on "international") · MÁLAGA (on "networking")
  const hdr = (word: string, x0: number, at: number, g: Glyph, key: string) => word.split("").forEach((ch, i) => {
    const tl = tlRun({ chars: [" "], at: [] }, ch, at + i * 0.035, 4, 0.075, i + key.length * 31);
    cells.push(<Flap key={key + i} t={t} x={x0 + i * HDR.step} y={HDR.y} w={HDR.w} h={HDR.h} tl={withAll(tl, i + 50, HDR.y)} d={0.075} g={g} r={8} />);
  });
  if (vis(HDR.y, HDR.h)) {
    hdr("ARRIVALS", HDR.x0, w("international") - 0.02, gHdr, "a");
    hdr("MÁLAGA", HDR.x0 + 8 * HDR.step + 60, w("networking") - 0.04, { ...gHdrM }, "m");
  }
  // the mini row: INTERNATIONAL NETWORKING COMMUNITY, each word on its word
  if (vis(MINI.y, MINI.h)) {
    const words: [string, number, Glyph][] = [["INTERNATIONAL", w("international"), gMini], ["NETWORKING", w("networking"), gMini], ["COMMUNITY", w("community"), gMiniB]];
    let c = 0;
    words.forEach(([wd, at, g], wi) => {
      wd.split("").forEach((ch, i) => {
        const tl = tlRun({ chars: [" "], at: [] }, ch, at - 0.06 + i * 0.022, 3, 0.06, c + 200);
        cells.push(<Flap key={"n" + c} t={t} x={MINI.x0 + c * MINI.step} y={MINI.y} w={MINI.w} h={MINI.h} tl={withAll(tl, c, MINI.y)} d={0.06} g={g} r={4} light />);
        c++;
      });
      if (wi < 2) { cells.push(<Flap key={"n" + c} t={t} x={MINI.x0 + c * MINI.step} y={MINI.y} w={MINI.w} h={MINI.h} tl={withAll(wake(idle({ chars: [" "], at: [] }, c, 10.4), MINI.x0 + c * MINI.step, MINI.y), c, MINI.y)} d={0.06} g={gMini} r={4} light />); c++; }
    });
    for (; c < MINI.n; c++) cells.push(<Flap key={"n" + c} t={t} x={MINI.x0 + c * MINI.step} y={MINI.y} w={MINI.w} h={MINI.h} tl={withAll(wake(idle({ chars: [" "], at: [] }, c, 10.4), MINI.x0 + c * MINI.step, MINI.y), c, MINI.y)} d={0.06} g={gMini} r={4} light />);
  }
  // rows
  const bands: React.ReactNode[] = [];
  for (let r = 0; r < NROWS; r++) {
    const y = ROW0 + r * RSTEP;
    if (!vis(y - 40, 140)) continue;
    const role = ROLES[r];
    const wt = role ? w(role[1]) : 0;
    // flight code
    const code = r < 4 ? `FUF 0${r + 1}` : "      ";
    code.split("").forEach((ch, i) => {
      const tl: Timeline = { chars: [" "], at: [] };
      if (r < 4 && ch !== " ") tlRun(tl, ch, w("bringing") + r * 0.09 + i * 0.03, 3, 0.065, r * 20 + i);
      else idle(tl, r * 20 + i + 900, 10.5);
      cells.push(<Flap key={`c${r}-${i}`} t={t} x={CODE.x0 + i * CODE.step} y={y + 16} w={CODE.w} h={CODE.h} tl={withAll(wake(tl, CODE.x0 + i * CODE.step, y), r * 20 + i, y + 16)} d={0.065} g={gCode} r={4} light />);
    });
    // role
    for (let i = 0; i < ROLE.n; i++) {
      const ch = role ? (role[0][i] ?? " ") : " ";
      const tl: Timeline = { chars: [" "], at: [] };
      if (role && ch !== " ") tlRun(tl, ch, wt - 0.3 + i * 0.016, 4, 0.07, r * 40 + i);
      else idle(tl, r * 40 + i + 500, 10.5);
      cells.push(<Flap key={`r${r}-${i}`} t={t} x={ROLE.x0 + i * ROLE.step} y={y} w={ROLE.w} h={ROLE.h} tl={withAll(wake(tl, ROLE.x0 + i * ROLE.step, y), r * 40 + i + 7, y)} d={0.07} g={gRole} r={6} />);
    }
    // status
    "LANDED".split("").forEach((ch, i) => {
      const tl: Timeline = { chars: [" "], at: [] };
      if (role) tlRun(tl, ch, wt + 0.12 + i * 0.03, 3, 0.065, r * 60 + i + 3);
      else idle(tl, r * 60 + i + 700, 10.5);
      cells.push(<Flap key={`s${r}-${i}`} t={t} x={STAT.x0 + i * STAT.step} y={y + 16} w={STAT.w} h={STAT.h} tl={withAll(wake(tl, STAT.x0 + i * STAT.step, y), r * 60 + i + 9, y + 16)} d={0.065} g={{ ...gStat, final: role ? ch : undefined }} r={4} light />);
    });
    // landing band: a bronze wash sweeping in behind the row on its word
    if (role) {
      const p = clamp((t - (wt - 0.05)) / 0.35), fade = clamp((t - wt - 0.5) / 0.6);
      bands.push(<div key={"b" + r} style={{ position: "absolute", left: 0, top: 0, width: 1688, height: 132, borderRadius: 16, transform: `translate(116px, ${y - 18}px) scaleX(${ease(p)})`, transformOrigin: "0% 50%",
        background: "linear-gradient(90deg, rgba(143,118,94,0.34), rgba(143,118,94,0.14) 70%, rgba(143,118,94,0.05))", opacity: mix(1, 0.45, fade) }} />);
    }
    if (r > 0) bands.push(<div key={"l" + r} style={{ position: "absolute", left: 0, top: 0, width: 1688, height: 1, transform: `translate(116px, ${y - 37}px)`, background: "rgba(247,244,239,0.09)" }} />);
  }
  // hairline under the header and the column labels (on "community")
  const lp = ease(clamp((t - w("community")) / 0.45));
  const lab = (txt: string, x: number, k: number) => {
    const p = ease(clamp((t - w("community") - 0.05 - k * 0.06) / 0.3));
    return <div key={txt} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x + (1 - p) * -40}px, 560px)`, opacity: p, fontFamily: SANS, fontWeight: 700, fontSize: 18, letterSpacing: "0.26em", color: F.tan }}>{txt}</div>;
  };
  const tp = ease(clamp((t - 10.45) / 0.4));
  const mp = ease(clamp((t - w("networking")) / 0.4));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 2400, transform: `translateY(${-cy}px)` }}>
      <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 28, background: "linear-gradient(180deg, #2E2C29 0%, #272624 30%, #232220 100%)", boxShadow: SHADOW }}>
        <div style={{ position: "absolute", inset: 10, borderRadius: 20, border: "1px solid rgba(247,244,239,0.07)", boxShadow: "inset 0 2px 30px rgba(0,0,0,0.35)" }} />
      </div>
      {bands}
      {/* header labels */}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${236 + (1 - tp) * -40}px, 160px)`, opacity: tp, fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.26em", color: "rgba(247,244,239,0.72)" }}>FUTURE UNICORN FOUNDERS</div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 600, textAlign: "right", transform: `translate(${1142 + (1 - mp) * 40}px, 160px)`, opacity: mp, fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.26em", color: F.tan }}>MÁLAGA · SPAIN</div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1592, height: 2, transform: `translate(150px, 512px) scaleX(${lp})`, transformOrigin: "0% 50%", background: `linear-gradient(90deg, ${F.bronze}, rgba(143,118,94,0.25))` }} />
      {lab("FLIGHT", 150, 0)}{lab("WHO", 500, 1)}{lab("STATUS", 1480, 2)}
      {cells}
    </div>
  );
};

// ---------- the giant MÁLAGA flaps and the flight through the L ----------
const G = { x0: 185, y: 380, w: 240, h: 350, step: 262 };
// lowered 24 px so the acute accent of Á sits well inside the card (caps now centred on the card)
const gGiant: Glyph = { font: SERIF, size: 262, weight: 500, cap: 0.68, color: F.ink, dy: 24 };
const WORD = "MÁLAGA";
const BY = G.y + G.h / 2 + (gGiant.cap * gGiant.size) * 0.42 + (gGiant.dy ?? 0); // the giant baseline
// the scale origin: the middle of the L's stem (third letter), at the cap height's centre
const OX = G.x0 + 2 * G.step + G.w / 2 - 34 + L_DX, OY = BY - (gGiant.cap * gGiant.size) / 2;
const dropT = (i: number) => ALL() + 0.06 + i * 0.06;

// the camera flies into the L: the six cards and the photo letters scale together about (OX, OY), registered, from
// G0 and reach full coverage three frames before the hand-off, then hold (the photo inside keeps its own push)
const G0 = () => w("mlaga") + 0.12, G1 = HOLD_OUT - 3 / 60;
const growS = (t: number) => {
  const p = clamp((t - G0()) / (G1 - G0()));
  return Math.exp(Math.log(110) * Math.pow(p, 2.1));
};
const growT = (t: number) => { const s = growS(t); return { s, css: `translate(${OX}px, ${OY}px) scale(${s}) translate(${-OX}px, ${-OY}px)`, svg: `translate(${OX} ${OY}) scale(${s}) translate(${-OX} ${-OY})` }; };

const Giant: React.FC<{ t: number }> = ({ t }) => {
  const tm = w("mlaga");
  const { s, css } = growT(t);
  const hide = t >= tm; // from "Málaga" the photo letters (and their ink twins in the SVG) are the letters
  const gs = clamp((s - 1) / 1.2);
  const cells = WORD.split("").map((ch, i) => {
    const d0 = dropT(i);
    if (t < d0) return null;
    // a real drop-in: each blank lit card rises into place on a spring, staggered left to right
    const ds = spring(t, d0, 0.42, 0.8);
    const tl: Timeline = { chars: [LIT], at: [] };
    tlRun(tl, ch, d0 + 0.08, 4, 0.075, i * 9 + 77);
    return <Flap key={i} t={t} x={G.x0 + i * G.step} y={G.y} w={G.w} h={G.h} tl={tl} d={0.075} g={{ ...gGiant, hide }} r={14}
      shadow={1 - gs} sg={1 - gs} pinO={1 - gs}
      style={{ transform: `translate(${G.x0 + i * G.step}px, ${G.y + (1 - ds) * 150}px) scale(${mix(0.88, 1, ds)})`, transformOrigin: "50% 50%", opacity: clamp((t - d0) / 0.035) }} />;
  });
  // a bronze rule draws under the word on "in"
  const up = ease(clamp((t - w("in")) / 0.35));
  const upOut = clamp((t - tm) / 0.2);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: css, transformOrigin: "0px 0px" }}>
      {cells}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1572, height: 3, transform: `translate(${G.x0}px, ${G.y + G.h + 34}px) scaleX(${up})`, transformOrigin: "0% 50%", opacity: 1 - upOut,
        background: `linear-gradient(90deg, ${F.bronze}, ${F.sunset}, rgba(232,185,138,0.2))` }} />
    </div>
  );
};

// the photo inside the letters, drawn in SVG (an HTML clip-path cannot reference text): the same geometry as
// H2Malaga at time t, so once the L's stem covers the frame the photo is exactly H2. Ink twins of the letters sit
// under the photo (the cards' own faces are blank from "Málaga"), so the photo spreads through the ink from the L.
const PHOTO_URL = staticFile("img/hero-malaga.jpg");
const PhotoLetters: React.FC<{ t: number; on: boolean }> = ({ t, on }) => {
  if (!on) return null;
  const tm = w("mlaga");
  const { svg: gt } = growT(t);
  const rr = ease(clamp((t - tm) / 0.3)) * 1400;
  const k = t - H2, z = 1.12 + k * 0.05;
  const letters = (fill?: string) => WORD.split("").map((ch, i) => (
    <text key={i} transform={gt} x={G.x0 + i * G.step + G.w / 2} y={BY} textAnchor="middle" fontFamily={SERIF} fontSize={gGiant.size} fontWeight={500} fill={fill}>{ch}</text>
  ));
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <clipPath id="fufB-letters" clipPathUnits="userSpaceOnUse">
          {letters()}
          <rect transform={gt} x={OX - STEM / 2} y={OY - 70} width={STEM} height={140} />
        </clipPath>
        <clipPath id="fufB-circle" clipPathUnits="userSpaceOnUse"><circle cx={OX} cy={OY} r={rr} /></clipPath>
      </defs>
      <g>{letters(F.ink)}</g>
      <g clipPath="url(#fufB-letters)">
        <g clipPath="url(#fufB-circle)">
          <image href={PHOTO_URL} x={0} y={0} width={2000} height={1080} preserveAspectRatio="xMidYMid slice"
            transform={`translate(${-k * 60} 0) translate(1400 648) scale(${z}) translate(-1400 -648)`} />
        </g>
      </g>
    </svg>
  );
};

const photoTf = (t: number) => { const k = t - H2, z = 1.12 + k * 0.05; return `translate(${-k * 60} 0) translate(1400 648) scale(${z}) translate(-1400 -648)`; };
const PhotoUnder: React.FC<{ t: number }> = ({ t }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
    <image href={PHOTO_URL} x={0} y={0} width={2000} height={1080} preserveAspectRatio="xMidYMid slice" transform={photoTf(t)} />
  </svg>
);

export const SegB: React.FC<{ t: number }> = ({ t }) => {
  if (t < HOLD_IN) return <AbsoluteFill><H1Seal t={t} /></AbsoluteFill>;
  // H2 exactly as the kit draws it; under it the same photo unclipped, so the kit's 15 px gap at the left edge
  // (its translateX(-k*60) is positive before 16.85) shows the photo's own continuation instead of cream
  if (t >= HOLD_OUT) return <AbsoluteFill><PhotoUnder t={t} /><H2Malaga t={t} /></AbsoluteFill>;
  // seal -> badge in the board's header, the ink board flooding out of it
  const sp = spring(t, HOLD_IN, 0.5, 1);
  const flood = inout(clamp((t - HOLD_IN) / 0.42));
  const cy = camY(t);
  const sealS = mix(1, 0.2, sp), sealX = mix(0, 180 - 960, sp), sealY = mix(0, 176 - 540 - cy, sp);
  const tAll = ALL();
  // the board dims fast on "together" (complete before the line rises), with a deeper band behind the line
  const dim = ease(clamp((t - tAll) / 0.12));
  const tm = w("mlaga");
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, clipPath: flood < 1 ? `circle(${flood * 2300 + 70 * sealS}px at ${960 + sealX}px ${540 + sealY}px)` : undefined }}>
        <Board t={t} />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sealX}px, ${sealY}px) scale(${sealS})`, transformOrigin: "960px 540px" }}>
        <H1Seal t={t} />
      </div>
      {t >= tAll && (
        <>
          <div style={{ position: "absolute", left: PANEL.x, top: 0, width: PANEL.w, height: 1080, background: "#1f1e1c", opacity: dim * 0.82 }} />
          <div style={{ position: "absolute", left: PANEL.x, top: 110, width: PANEL.w, height: 250, opacity: dim,
            background: "linear-gradient(180deg, rgba(25,24,22,0) 0%, rgba(25,24,22,0.8) 28%, rgba(25,24,22,0.8) 72%, rgba(25,24,22,0) 100%)" }} />
          <SerifLine t={t} words={[{ text: "together", at: tAll + 0.07, it: true }, { text: "in", at: w("in") }]} x={960} y={200} size={72} align="center" color={F.cream} accent={F.tan} out={tm - 0.02} />
          <Giant t={t} />
        </>
      )}
      <PhotoLetters t={t} on={t >= tm} />
      <Img src={PHOTO_URL} style={{ position: "absolute", left: 0, top: 0, width: 4, height: 4, opacity: 0 }} />
    </AbsoluteFill>
  );
};
