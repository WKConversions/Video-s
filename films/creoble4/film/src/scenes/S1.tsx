// Builder 1 — B1, VERSION 3 (open → h1; 60 fps frames 0–604; g = frame / 2, fractional). plan/storyboard.md, shots 1–6.
// Constant motion, a different named move in every shot (no drift-left-and-grow, no zoom through text):
// 1 "Din nye hjemmeside er få minutter væk." LETTER BOUNCE + GLASS MORPH: the words pop in letter by letter (float bob
//   while they hold); a Liquid Glass capsule launches UP from below, squashes as it lands, then on "minutter" stretches
//   wide and morphs (w, h, radius on springs) into a glass window over the words (refracting them); on "væk" sage
//   blobs POUR in (gravity), merge like liquid (Gooey) and spread into the site's section shapes.
// 2 "Bygget af AI." ISLAND DROP + STAGGERED POPS + 3D TILT: the ink Island drops from the top and springs open
//   "✦ Bygget af AI"; each liquid section pops into the real site with a bounce while the window tilts toward the
//   camera (rotateX 12° → 0°).
// 3 "Fortæl kort om din virksomhed." CARD RISE + GRAVITY DROP: the builder card rises from below on a spring (the
//   window recedes behind it), keeps a slow rise; the name types; on "virksomhed" the industry chips fall from above
//   and bounce on the Branche field; "Sundhed / Klinik" is picked.
// 4 "Creoble bygger hele siden." 3D FLIP UP + RUBBER-BAND SCROLL: the card flips up along an arc to the site on its
//   back, which scrolls fast down the whole page (the rest builds), overscrolls and rubber-bands; slow 3D sway.
// 5 "Ingen teknik." SLIDE FROM THE RIGHT (liquid edge) + GOOEY MELT: a deep-sage panel slides in from the right with
//   a bulging liquid edge and covers the frame; cream letter-bounce type; code-glyph blobs melt into one and burst;
//   the panel then dissolves into droplets radiating from the burst.
// 6 "Ingen skabeloner." COVER-FLOW FLICK RIGHT: grey templates in 3D cover flow, pulled back, then flicked to the
//   right with momentum; the real site stays centred and rubber-bands; speed-matched push UP out at h1.
import React from "react";
import {
  BAR, Browser, BounceText, C, EXIT, Gooey, HOLM, HolmSite, Ico, Island, Label, LiquidGlass, OUT, SANS, SERIF,
  SHADOW, SHADOW_BIG, aspring, bounce, clamp01, f, kf, mix, press, pushOutUp, squash, typed,
} from "../shared";

/* ---------- clock (labels → 30-unit frames) ---------- */
const F = {
  din: f("w:din"), hj: f("w:hjemmeside"), er: f("w:er"), min: f("w:minutter"), vk: f("w:vk"),
  byg: f("w:bygget"), af: f("w:af"), ai: f("w:ai"), fortl: f("w:fortl"), virk: f("w:virksomhed"),
  creo: f("w:creoble"), bygger: f("w:bygger"), hele: f("w:hele"), siden: f("w:siden"),
  ingen: f("w:ingen"), teknik: f("w:teknik"), ingen2: f("w:ingen2"), skab: f("w:skabeloner"), h1: f("h1"),
};

/* ---------- local helpers ---------- */
const bn = (g: number, fr: number, resp = 0.5, damp = 0.62) => bounce(g, fr / 30, resp, damp);   // bounce from a frame
const sp = (g: number, fr: number, resp = 0.5) => aspring(g, fr / 30, resp, 1);                 // big carry from a frame
const lin = (g: number, a: number, b: number) => clamp01((g - a) / (b - a));
const vel = (fn: (t: number) => number, g: number) => (fn(g) - fn(g - 0.5)) * 2;                  // px per 1/30 s
const accel = (fn: (t: number) => number, g: number) => (fn(g) - 2 * fn(g - 0.5) + fn(g - 1)) * 4;
const tint = (a: string, b: string, t: number) => `color-mix(in srgb, ${b} ${(clamp01(t) * 100).toFixed(2)}%, ${a})`;
const abs = (x: number) => Math.abs(x);
const ramp = (g: number, a: number, b: number) => (g <= a ? 0 : g < b ? ((g - a) * (g - a)) / (2 * (b - a)) : (b - a) / 2 + (g - b));   // eases into a constant speed of 1 per frame
const SK = "#D3DFDA";        // the liquid skeleton of a section (light sage-grey)

/* ================================================================================================================
   SHOTS 1–2: the words, the glass capsule → glass window, the liquid sections, the Island
   ================================================================================================================ */
const WIN = { w: 1280, h: 800, cy: 590, bar: 70, pad: 16 };
const CAP = { w: 440, h: 124 };
const capY = (g: number) => mix(1270, 812, bn(g, F.er - 2, 0.55, 0.6));
const winGeo = (g: number) => {
  const pw = bn(g, F.min, 0.55, 0.7), ph = bn(g, F.min + 2, 0.55, 0.7), pc = sp(g, F.min, 0.5);
  return { w: mix(CAP.w, WIN.w, pw), h: mix(CAP.h, WIN.h, ph), r: mix(CAP.h / 2, 34, clamp01(ph)), cy: mix(capY(g), WIN.cy, pc) };
};
const winCy = (g: number) => winGeo(g).cy;

// the eight sections of Holm Fysioterapi's first screen (design px of HolmSite) and the pour pool that becomes them
const SEC = [
  { x: 70, y: 34, w: 1320, h: 46, r: 12 },      // nav
  { x: 70, y: 168, w: 640, h: 230, r: 18 },     // headline
  { x: 760, y: 120, w: 630, h: 560, r: 24 },    // photo
  { x: 70, y: 420, w: 560, h: 96, r: 14 },      // intro text
  { x: 70, y: 556, w: 250, h: 64, r: 32 },      // button
  { x: 70, y: 760, w: 420, h: 400, r: 22 },     // services
  { x: 520, y: 760, w: 420, h: 400, r: 22 },
  { x: 970, y: 760, w: 420, h: 400, r: 22 },
];
const CLIP = [
  { x: 60, y: 24, w: 1340, h: 66 }, { x: 60, y: 160, w: 680, h: 250 }, { x: 760, y: 120, w: 630, h: 560 },
  { x: 60, y: 412, w: 600, h: 112 }, { x: 60, y: 548, w: 600, h: 80 },
  { x: 70, y: 760, w: 420, h: 400 }, { x: 520, y: 760, w: 420, h: 400 }, { x: 970, y: 760, w: 420, h: 400 },
];
const POOL = [
  { dx: -300, dy: 40, r: 92 }, { dx: -150, dy: -10, r: 84 }, { dx: 10, dy: 30, r: 112 }, { dx: 170, dy: -20, r: 90 },
  { dx: 310, dy: 30, r: 96 }, { dx: -220, dy: 110, r: 74 }, { dx: 90, dy: 120, r: 88 }, { dx: 240, dy: 110, r: 76 },
];
const POP = [79, 82.5, 86, 89.5, 93, 96.5, 98.5, 100.5];   // each section pops into the real site (shot 2)

// one section of the real site, cut out of a full HolmSite, so it can pop on its own
const SiteCut: React.FC<{ s: number; ch: number; i: number; p: number }> = ({ s, ch, i, p }) => {
  const c = CLIP[i];
  return (
    <div style={{ position: "absolute", left: c.x * s, top: c.y * s, width: c.w * s, height: c.h * s, overflow: "hidden", transform: `scale(${mix(0.5, 1, p)})`, opacity: clamp01(p * 3), transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: -c.x * s, top: -c.y * s }}><HolmSite w={1460 * s} h={ch} /></div>
    </div>
  );
};

const Clock: React.FC<{ s: number; g: number }> = ({ s, g }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={C.sageDeep} strokeWidth={3.6} strokeLinecap="round" style={{ display: "block", flex: "none" }}>
    <circle cx="24" cy="24" r="18" />
    <path d="M24 24 L24 12" transform={`rotate(${g * 16} 24 24)`} />
    <path d="M24 24 L31 24" transform={`rotate(${g * 1.3} 24 24)`} />
  </svg>
);

const ShotHook: React.FC<{ g: number }> = ({ g }) => {
  if (g >= 136) return null;
  // the words: letter bounce, then a float bob while they hold; hidden under the frosting glass
  const bob = Math.sin((g / 30) * Math.PI * 2 / 1.6) * 10 * lin(g, 10, 22);
  const wordsO = 1 - lin(g, 53, 58);
  // capsule → window
  const geo = winGeo(g);
  const vy = vel(winCy, g), ay = accel(winCy, g);
  const imp = Math.max(-0.14, Math.min(0.14, ay * 0.0019));
  const showGlass = g >= F.er - 2;
  const frost = OUT(lin(g, 55, 64));
  const capO = 1 - lin(g, F.min + 1, F.min + 6);
  // the window's 3D tilt (back to 12° as the liquid pours, toward the camera in shot 2) and its recede in shot 3
  const tilt = 12 * sp(g, 63, 0.7) * (1 - sp(g, 80, 1.3));
  const rc = sp(g, 113, 0.7), wo = 1 - lin(g, 118, 132);
  const cw = geo.w - WIN.pad * 2, ch = geo.h - WIN.bar - WIN.pad, s = cw / 1460;
  const pcx = cw / 2, pcy = ch * 0.6;
  // the Island
  const drop = bn(g, F.byg - 4, 0.55, 0.6), close = sp(g, 112, 0.35), lift = sp(g, 118, 0.4);
  const iy = mix(-80, 34, drop) - 140 * lift;
  const ip = bn(g, F.byg + 3, 0.5, 0.6) * (1 - close);
  const kick = bn(g, F.ai - 1, 0.4, 0.55) - bn(g, F.ai + 1.5, 0.4, 0.55);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {wordsO > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${bob}px)`, opacity: wordsO }}>
          <BounceText g={g} text="Din nye" at={-0.03} x={960} y={175} size={200} align="center" stagger={0.036} />
          <BounceText g={g} text="hjemmeside" at={0.36} x={960} y={392} size={200} it align="center" stagger={0.026} />
        </div>
      )}
      {showGlass && (
        <div style={{ position: "absolute", inset: 0, perspective: 1800, perspectiveOrigin: "50% 45%", opacity: wo, transform: `translateY(${-60 * rc}px) scale(${1 - 0.12 * rc})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: geo.w, height: geo.h, transform: `translate3d(${960 - geo.w / 2}px, ${geo.cy - geo.h / 2}px, 0) rotateX(${tilt}deg)`, transformOrigin: "50% 60%" }}>
            <LiquidGlass w={geo.w} h={geo.h} radius={geo.r} p={1} sheen={0.15 + 0.7 * lin(g, F.er - 2, 90)} transform={`${squash(0, vy)} scale(${1 + imp}, ${1 - imp})`}>
              {/* the capsule's face: a running clock, "få minutter" */}
              {capO > 0 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, opacity: capO }}>
                  <Clock s={56} g={g} />
                  <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, color: C.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>få minutter</div>
                </div>
              )}
              {/* the window's bar */}
              {frost > 0 && (
                <div style={{ position: "absolute", left: 0, top: 0, width: geo.w, height: WIN.bar, opacity: frost, display: "flex", alignItems: "center", paddingLeft: 30, gap: 10, boxSizing: "border-box" }}>
                  {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(26,22,20,0.16)" }} />)}
                  <div style={{ position: "absolute", left: "50%", top: 12, transform: "translateX(-50%)", height: 46, padding: "0 26px", borderRadius: 14, background: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", fontFamily: SANS, fontSize: 28, color: C.muted, whiteSpace: "nowrap" }}>Forhåndsvisning</div>
                </div>
              )}
              {/* the window's page: frosts in, the liquid pours, the sections pop */}
              {g >= 55 && (
                <div style={{ position: "absolute", left: WIN.pad, top: WIN.bar, width: cw, height: ch, borderRadius: 20, overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: HOLM.bg, opacity: frost }} />
                  {g < 106 && (
                    <Gooey>
                      {POOL.map((b, i) => {
                        const ti = F.vk + 0.5 + i * 1.1;
                        const yAt = (t: number) => pcy + b.dy - 760 * abs(1 - bn(t, ti, 0.5, 0.58));
                        const vfall = abs(vel(yAt, g)), st = Math.min(0.32, vfall * 0.0035);
                        const q = bn(g, 62 + i * 0.8, 0.45, 0.7);
                        const sec = SEC[i];
                        const cx = pcx + b.dx, cy = yAt(g);
                        let x = mix(cx - b.r * (1 - st * 0.5), sec.x * s, q), y = mix(cy - b.r * (1 + st), sec.y * s, q);
                        let w = mix(2 * b.r * (1 - st * 0.5), sec.w * s, q), h = mix(2 * b.r * (1 + st), sec.h * s, q);
                        const rad = mix(b.r, sec.r * s, clamp01(q));
                        const shrink = 1 - EXIT(lin(g, POP[i], POP[i] + 6));
                        if (shrink <= 0) return null;
                        x += (w * (1 - shrink)) / 2; y += (h * (1 - shrink)) / 2; w *= shrink; h *= shrink;
                        return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: rad, background: tint(C.sage, SK, q) }} />;
                      })}
                    </Gooey>
                  )}
                  {POP.map((t, i) => g >= t && <SiteCut key={i} s={s} ch={ch} i={i} p={bn(g, t, 0.42, 0.55)} />)}
                </div>
              )}
            </LiquidGlass>
          </div>
        </div>
      )}
      {g >= F.byg - 4 && iy > -100 && (
        <Island x={960} y={iy} w={560} h={96} p={ip}>
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Ico n="sparkle" s={40} c={C.sageLight} fill={C.sageLight} w={1.5} style={{ transform: `scale(${1 + 0.7 * kick}) rotate(${40 * kick}deg)` }} />
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, color: C.cream, whiteSpace: "nowrap" }}>Bygget af AI</div>
          </div>
        </Island>
      )}
    </div>
  );
};

/* ================================================================================================================
   SHOTS 3–4: the builder card rises, chips drop; the card flips up to the site, which scrolls and rubber-bands
   ================================================================================================================ */
const CHIPS = [{ t: "Sundhed / Klinik", sel: true }, { t: "Håndværker / Service" }, { t: "Restaurant / Café" }];
const CARD = { w: 1240, h: 720 };
const SITEB = { w: 1360, h: 800 };

const FormFace: React.FC<{ g: number }> = ({ g }) => {
  const name = typed(g, (F.fortl + 6) / 30, "Holm Fysioterapi", 26);
  const sel = bn(g, 170, 0.42, 0.55), pr = press(g, 168.5 / 30, 0.06), nx = press(g, 179 / 30, 0.08);
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", width: CARD.w, height: CARD.h, transform: "translate(-50%, -50%)", fontFamily: SANS, color: C.ink }}>
      <Label text="Virksomhed" size={26} p={lin(g, 124, 140)} style={{ position: "absolute", left: 72, top: 60 }} />
      <div style={{ position: "absolute", left: 72, top: 104, fontFamily: SERIF, fontSize: 66, letterSpacing: "-0.025em", whiteSpace: "nowrap" }}>
        Fortæl os om din <span style={{ fontStyle: "italic", color: C.sageDeep }}>virksomhed</span>
      </div>
      <div style={{ position: "absolute", left: 72, top: 226, fontSize: 30, fontWeight: 500 }}>Virksomhedsnavn <span style={{ color: C.sage }}>*</span></div>
      <div style={{ position: "absolute", left: 72, top: 274, width: 1096, height: 104, boxSizing: "border-box", borderRadius: 14, border: `2px solid ${C.sage}`, boxShadow: `0 0 0 6px ${C.sageTint}`, background: C.white, display: "flex", alignItems: "center", padding: "0 30px", fontSize: 48, letterSpacing: "-0.01em" }}>
        {name ? name.split("").map((ch, i) => { const q = bn(g, F.fortl + 6 + (i * 30) / 26, 0.3, 0.6); return <span key={i} style={{ display: "inline-block", whiteSpace: "pre", transform: `translateY(${(1 - q) * 14}px) scale(${0.6 + 0.4 * q})`, transformOrigin: "50% 90%" }}>{ch}</span>; })
          : <span style={{ color: C.soft }}>fx Klinik for Fysioterapi</span>}
        <span style={{ display: "inline-block", width: 3, height: 54, marginLeft: 3, background: C.sageDeep, opacity: Math.floor(g / 8) % 2 === 0 || (g > F.fortl + 6 && g < 152) ? 1 : 0 }} />
      </div>
      <div style={{ position: "absolute", left: 72, top: 420, fontSize: 30, fontWeight: 500 }}>Branche <span style={{ color: C.sage }}>*</span></div>
      <div style={{ position: "absolute", left: 72, top: 468, width: 1096, height: 112, boxSizing: "border-box", borderRadius: 14, border: `1.5px solid ${C.line}`, background: C.white, display: "flex", alignItems: "flex-end", padding: "0 22px 24px", gap: 18 }}>
        {CHIPS.map((c, i) => {
          const at = F.virk + i * 2.6;
          const yAt = (t: number) => -720 * abs(1 - bn(t, at, 0.5, 0.6));
          const y = yAt(g), near = clamp01(1 - abs(y) / 30);
          const sq = Math.min(0.2, abs(vel(yAt, g)) * 0.0028) * near;
          const rot = (i - 1) * 9 * clamp01(abs(y) / 200);
          const on = c.sel ? sel : 0;
          return (
            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 64, padding: "0 26px", borderRadius: 999, boxSizing: "border-box",
              background: tint(C.white, C.sage, on), border: `1.5px solid ${tint(C.line, C.sage, on)}`, color: tint(C.ink, C.white, on), boxShadow: SHADOW,
              fontSize: 30, fontWeight: 500, whiteSpace: "nowrap", opacity: g >= at ? 1 : 0, transformOrigin: "50% 100%",
              transform: `translateY(${y}px) rotate(${rot}deg) scale(${(1 + sq) * (1 - 0.06 * (c.sel ? pr : 0))}, ${(1 - sq) * (1 - 0.06 * (c.sel ? pr : 0))})` }}>
              {c.sel && <div style={{ width: 34 * clamp01(on), overflow: "hidden", flex: "none", display: "flex" }}><Ico n="check" s={30} c={C.white} w={2.6} style={{ transform: `scale(${Math.max(0, on)})` }} /></div>}
              {c.t}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 72, top: 614, height: 64, padding: "0 40px", borderRadius: 12, background: C.sage, color: C.white, display: "flex", alignItems: "center", fontSize: 30, fontWeight: 500, transform: `scale(${1 - 0.06 * nx})` }}>Næste</div>
    </div>
  );
};

const ShotCard: React.FC<{ g: number }> = ({ g }) => {
  if (g < 116 || g >= 261) return null;
  const rise = mix(1080, 0, bn(g, 119, 0.6, 0.7));
  const slow = -1.0 * Math.min(57, Math.max(0, g - 126)) * (1 - sp(g, F.creo, 0.75));
  const fp = bn(g, F.creo, 0.8, 0.72), ang = 180 * fp, gp = sp(g, F.creo, 0.8);
  const W = mix(CARD.w, SITEB.w, gp), H = mix(CARD.h, SITEB.h, gp);
  const arc = -90 * Math.sin(Math.PI * clamp01(fp));
  // shot 4: the scroll (fast down, overscroll, rubber-band); the rest of the page builds; shot 5: back up behind the panel
  const s = W / 1460, maxS = 1500 - (H - BAR) / s;
  const sc = (maxS * bn(g, 203, 0.6, 0.55) - 3.2 * ramp(g, 224, 234)) * (1 - sp(g, F.ingen + 3, 0.8));
  const build = 0.72 + 0.28 * kf(g, 203, 18, OUT);
  const para = 1.4 * ramp(g, 205, 215);
  const back = sp(g, F.ingen, 0.6);
  const front = ang < 90;
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 2200, perspectiveOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 560 - H / 2, width: W, height: H,
        transform: `translate3d(0, ${rise + slow + arc + para}px, 0) ${front ? `rotateX(${ang}deg)` : `rotateX(${ang - 180}deg)`} scale(${1 - 0.06 * back})`, transformOrigin: "50% 50%" }}>
        {front ? (
          <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: C.card, border: `1px solid ${C.line}`, boxShadow: SHADOW_BIG }}>
            <FormFace g={g} />
          </div>
        ) : (
          <Browser w={W} h={H}><HolmSite w={W} h={H - BAR} build={build} scroll={sc} /></Browser>
        )}
      </div>
    </div>
  );
};

/* ================================================================================================================
   SHOT 5: the deep-sage panel slides in from the right with a liquid edge; glyph blobs melt and burst; it dissolves
   ================================================================================================================ */
const GLY = ["</>", "{ }", "#", "=>"];
const BURST = { x: 960, y: 850 };
const panelX = (g: number) => mix(1990, -90, bn(g, F.ingen, 0.7, 0.68));

const ShotPanel: React.FC<{ g: number }> = ({ g }) => {
  if (g < F.ingen - 1 || g >= 284) return null;
  const X = panelX(g), vx = vel(panelX, g), lead = Math.max(0, -vx) * 0.32;
  // the panel collapses like liquid into one drop at BURST (width first, then height, wobbling), then bursts
  const R = 150, cxp = bn(g, 262, 0.55, 0.7), cyp = bn(g, 263.5, 0.6, 0.7);
  const L = mix(X, BURST.x - R, cxp), Rt = mix(2110, BURST.x + R, cxp), T = mix(-100, BURST.y - R, cyp), B = mix(1180, BURST.y + R, cyp);
  const k1 = OUT(lin(g, 270, 272)), k2 = EXIT(lin(g, 272, 276)), pop = (1 + 0.18 * k1) * (1 - k2);
  const sx = Math.max(0, (Rt - L) * pop), sy = Math.max(0, (B - T) * pop), mx = (L + Rt) / 2, my = (T + B) / 2;
  const rad = Math.min(sx, sy) / 2 * clamp01(Math.min(cxp, cyp) * 1.05);
  const suck = EXIT(lin(g, 261, 267));
  const merge = sp(g, 259, 0.42), glyO = 1 - lin(g, 259, 262.5);
  const drops = (col: string, n0: number, dist: number, rr: number) => g >= 272 && Array.from({ length: 7 }, (_, n) => {
    const a = ((n + n0 * 0.5) / 7) * Math.PI * 2 + 0.3, d = dist * OUT(lin(g, 272, 282)), r = rr * (1 - lin(g, 273, 283));
    return r > 0.5 ? <div key={`${col}${n}`} style={{ position: "absolute", left: BURST.x + Math.cos(a) * d - r, top: BURST.y + Math.sin(a) * d * 0.85 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: col }} /> : null;
  });
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Gooey>
        {sx > 0.5 && <div style={{ position: "absolute", left: mx - sx / 2, top: my - sy / 2, width: sx, height: sy, borderRadius: rad, background: C.sageDark }} />}
        {g < 262 && Array.from({ length: 26 }, (_, j) => {
          const y = -60 + j * 48, prof = Math.sin((Math.PI * (y + 60)) / 1200);
          return <div key={j} style={{ position: "absolute", left: X - lead * prof, top: y - 90, width: 180, height: 180, borderRadius: "50%", background: C.sageDark }} />;
        })}
        {drops(C.sageDark, 0, 380, 30)}
      </Gooey>
      {suck < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - suck, transform: `scale(${1 - 0.8 * suck})`, transformOrigin: `${BURST.x}px ${BURST.y}px` }}>
          <BounceText g={g} text="Ingen" at={(F.ingen + 5) / 30} x={960} y={250} size={220} align="center" color={C.cream} stagger={0.032} />
          <BounceText g={g} text="teknik." at={F.teknik / 30} x={960} y={480} size={220} it align="center" itColor={C.sageLight} stagger={0.03} />
        </div>
      )}
      {g >= 251 && (
        <Gooey>
          {GLY.map((t, i) => {
            const pi = bn(g, 251.5 + i * 1.6, 0.45, 0.58);
            const bx = 660 + i * 200, by = 850 + Math.sin(((g / 30) * Math.PI * 2) / 1.2 + i * 1.3) * 12;
            const x = mix(bx, BURST.x, merge), y = mix(by, BURST.y, merge), r = 76 * Math.max(0, pi) * pop;
            return r > 0.5 ? (
              <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: C.sageLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50 * Math.max(0, Math.min(1.2, pi)), color: C.sageDark, opacity: glyO, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>{t}</span>
              </div>
            ) : null;
          })}
          {merge > 0.01 && pop > 0.01 && <div style={{ position: "absolute", left: BURST.x - 105 * merge * pop, top: BURST.y - 105 * merge * pop, width: 210 * merge * pop, height: 210 * merge * pop, borderRadius: "50%", background: C.sageLight }} />}
          {drops(C.sageLight, 1, 300, 24)}
        </Gooey>
      )}
    </div>
  );
};

/* ================================================================================================================
   SHOT 6: cover flow of grey templates flicked RIGHT with momentum; the real site stays and rubber-bands; push UP
   ================================================================================================================ */
const CF = { w: 1000, h: Math.round((1000 * 860) / 1460) };
const Tpl: React.FC = () => {
  const blk = (x: number, y: number, w: number, h: number, r = 8, c = "#D9D4CC") => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, background: c }} />;
  return (
    <div style={{ width: CF.w, height: CF.h, borderRadius: 16, background: "#EFECE7", boxShadow: `0 0 0 1px #DDD8D0, ${SHADOW}`, overflow: "hidden", position: "relative" }}>
      <div style={{ height: 32, background: "#E7E4DF", display: "flex", alignItems: "center", gap: 7, paddingLeft: 14 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#D3CFC8" }} />)}</div>
      {blk(48, 58, 120, 20)}{blk(640, 62, 70, 12)}{blk(730, 62, 70, 12)}{blk(820, 62, 70, 12)}
      {blk(48, 130, 400, 46)}{blk(48, 188, 310, 46)}
      {blk(48, 262, 380, 13, 6, "#E3E0DA")}{blk(48, 286, 350, 13, 6, "#E3E0DA")}{blk(48, 310, 300, 13, 6, "#E3E0DA")}
      {blk(48, 352, 160, 44, 22)}
      {blk(520, 110, 432, 320, 16, "#E2DED8")}
      {blk(48, 468, 290, 110, 14, "#E5E2DC")}{blk(355, 468, 290, 110, 14, "#E5E2DC")}{blk(662, 468, 290, 110, 14, "#E5E2DC")}
    </div>
  );
};
const strip = (g: number) => (g < 281 ? -0.35 * lin(g, 261, 281) : -0.35 + 7.85 * (1 - Math.exp(-(g - 281) / 6.5)));
const cover = (s: number) => {
  const a = Math.max(-1, Math.min(1, s)), m = abs(s);
  return { x: Math.sign(s) * (Math.min(m, 1) * 560 + Math.max(0, m - 1) * 260), ry: -a * 58, z: -Math.min(m, 1) * 320 - Math.max(0, m - 1) * 30 };
};

const ShotFlow: React.FC<{ g: number }> = ({ g }) => {
  if (g < 261) return null;
  const o = strip(g);
  const band = 110 * (bn(g, 281, 0.5, 0.55) - bn(g, 283.5, 0.5, 0.55));
  const sway = 6 * Math.sin(((g - 266) / 30) * Math.PI * 2 / 2.4);
  const push = pushOutUp(g, "h1");
  const cards = [-3, -2, -1, 1, 2, 3].map((j) => ({ j, s: j + o })).filter((c) => abs(c.s) < 5).sort((a, b) => abs(b.s) - abs(a.s));
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${push}px)` }}>
      <div style={{ position: "absolute", inset: 0, perspective: 1700, perspectiveOrigin: "50% 50%" }}>
        {cards.map(({ j, s }) => {
          const c = cover(s);
          return (
            <div key={j} style={{ position: "absolute", left: 960 - CF.w / 2, top: 540 - CF.h / 2, width: CF.w, height: CF.h, transform: `translate3d(${c.x}px, 0, ${c.z}px) rotateY(${c.ry}deg)`, opacity: clamp01(abs(s) * 2 - 0.4) }}>
              <Tpl />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 960 - CF.w / 2, top: 540 - CF.h / 2, transform: `translateX(${band}px) rotateY(${sway}deg) rotateX(${sway * 0.35}deg)` }}>
          <Browser w={CF.w} h={CF.h}><HolmSite w={CF.w} h={CF.h - BAR} /></Browser>
        </div>
      </div>
    </div>
  );
};

export const Scene1: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("open") || g >= F.h1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <ShotFlow g={g} />
      <ShotHook g={g} />
      <ShotCard g={g} />
      <ShotPanel g={g} />
    </div>
  );
};
