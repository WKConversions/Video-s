// Scene B — the brief (sB → sC): "Ask for an energetic, thirty-second film about your site."
// The prompt box, front-on and low, takes focus on "Ask" and types the brief on the voice. On "energetic",
// "thirty-second" and "your site" the key word is marked in the line and surfaces above the box as a parsed token
// (TONE · Energetic, LENGTH · 30 s, WEBSITE · fjello.com). Send presses, the box sinks back into depth and the
// WEBSITE chip is carried to where C opens the site (it becomes the site's address bar). BriefLayer is a function of
// the frame, so C draws its tail (the sink and the carry) without a seam.
import React from "react";
import { BOX, PERSP, boxZ } from "./A";
import { C, CRAFT, FONT, GRAD_D, Ico, LAND, LEAVE, PromptBox, SHADOW_BIG, SITE_BAR, SITE_W, SNAP, Stage3D, clamp01, f, k, mix, surface } from "../shared";

const S = BOX.w / 900;

/* ---------- the site's place in C (shared here so B can carry the chip to its address bar) ---------- */
export const SITE = { x: 70, y: 120, w: 1000, h: 830 };
export const SS = SITE.w / SITE_W;
const cProg = (g: number) => CRAFT(clamp01((g - f("sC")) / (f("h1") - f("sC"))));
export const siteRy = (g: number) => 11 - 4 * cProg(g);
// the site's slow approach while it is read (it keeps the page alive between the lifts)
export const siteZ = (g: number) => 200 * cProg(g);
// a point inside the site window (lx, ly in window px), projected through the site's rotateY (origin: left edge,
// vertical middle) and the stage's perspective (origin at the frame's centre)
export const projSite = (lx: number, ly: number, ry: number, z = 0) => {
  const a = (ry * Math.PI) / 180;
  const X = SITE.x + lx * Math.cos(a), Z = z - lx * Math.sin(a), Y = SITE.y + ly; // z: the site's translateZ
  const sc = PERSP / (PERSP - Z);
  return { x: 960 + (X - 960) * sc, y: 540 + (Y - 540) * sc, sc };
};
// the address bar ("fjello.com", 300 × 28 design px at x 464, y 8 in the browser bar)
export const URL_LOCAL = { x: 614 * SS, y: (SITE_BAR / 2) * SS };

/* ---------- the brief, typed on the voice ---------- */
type Seg = { t: string; at: string; key?: number };
const SEGS: Seg[] = [
  { t: "An ", at: "w:for" },
  { t: "energetic", at: "w:an2", key: 0 },
  { t: ", ", at: "w:energetic+0.25" },
  { t: "30-second", at: "w:thirtysecond-0.15", key: 1 },
  { t: " film ", at: "w:film-0.1" },
  { t: "about ", at: "w:about-0.1" },
  { t: "fjello.com", at: "w:your-0.15", key: 2 },
];
const CPF = 1.5; // characters per frame
const typedN = (g: number, s: Seg) => Math.max(0, Math.min(s.t.length, Math.floor((g - f(s.at)) * CPF + 1)));

export const CHIPS = [
  { key: "TONE", val: "Energetic", ico: "spark", at: "w:energetic", cx: 540, wx: 564 },
  { key: "LENGTH", val: "30 s", ico: "film", at: "w:thirtysecond", cx: 890, wx: 748 },
  { key: "WEBSITE", val: "fjello.com", ico: "globe", at: "w:your", cx: 1250, wx: 1098 },
];
export const CHIP_Y = 474;
const WORD_TOP = 596; // the typed line's top (the words' x centres are in CHIPS.wx, measured on the render)

export const Chip: React.FC<{ ico: string; k: string; v: string }> = ({ ico, k: key, v }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "11px 26px 11px 11px", background: C.white, borderRadius: 999, border: `1px solid ${C.card}`,
    boxShadow: SHADOW_BIG, fontFamily: FONT, whiteSpace: "nowrap" }}>
    <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.lavender, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Ico n={ico} s={25} c={C.violet} fill={ico === "spark" ? C.violet : "none"} w={ico === "spark" ? 1 : 2.2} />
    </div>
    <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.14em", color: C.detail }}>{key}</span>
    <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.soft }} />
    <span style={{ fontSize: 32, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>{v}</span>
  </div>
);

// where the WEBSITE chip is at frame g once sent (its carry to the address bar), as centre and scale
export const webChipAt = (g: number) => {
  const c = k(g, "w:site+0.4", 0.6, CRAFT), bz = push(g);
  const u = projSite(URL_LOCAL.x, URL_LOCAL.y, siteRy(g), siteZ(g));
  const x0 = PUSH_O.x + (CHIPS[2].cx - PUSH_O.x) * bz, y0 = PUSH_O.y + (CHIP_Y - PUSH_O.y) * bz;
  return { x: mix(x0, u.x, c), y: mix(y0, u.y, c), s: mix(bz, 0.72, c), c };
};

// the brief group's slow push toward the viewer through B (moving from its first frame, at rest by the send)
const PUSH_O = { x: 960, y: 590 };
const push = (g: number) => {
  const t = clamp01((g - f("sB")) / (f("w:site+0.4") - f("sB")));
  return 1 + 0.17 * t * (1.5 - 0.5 * t);
};
const lbl2 = (i: number) => `w:site+${(0.45 + i * 0.04).toFixed(2)}`;

export const BriefLayer: React.FC<{ g: number }> = ({ g }) => {
  const focus = k(g, "w:ask", 0.3, SNAP);
  const press = k(g, "w:site+0.3", 0.13, SNAP) - k(g, "w:site+0.45", 0.2, SNAP);
  const sink = k(g, "w:site+0.45", 0.7, LEAVE);
  const web = webChipAt(g);
  const webFade = k(g, "w:moviqly+0.15", 0.35, LEAVE);
  if (sink >= 1 && webFade >= 1) return null;

  // the typed line, with the parsed words marked
  let last = -1;
  const spans = SEGS.map((s, i) => {
    const n = g >= f(s.at) ? typedN(g, s) : 0;
    if (n > 0) last = i;
    const hl = s.key !== undefined ? k(g, CHIPS[s.key].at, 0.25, SNAP) : 0;
    return (
      <span key={i} style={hl > 0 ? { background: `linear-gradient(${C.violet}, ${C.violet}) left 100% / ${hl * 100}% 3px no-repeat, rgba(136,83,223,${(0.13 * hl).toFixed(3)})`, borderRadius: 6, color: hl > 0.5 ? C.lavenderInk : C.ink } : undefined}>
        {s.t.slice(0, n)}
      </span>
    );
  });
  const lastSeg = last >= 0 ? SEGS[last] : null;
  const typing = lastSeg ? g - f(lastSeg.at) < lastSeg.t.length / CPF + 6 : false;
  const caretOn = focus > 0.5 && (typing || Math.floor(g / 9) % 2 === 0);

  const bz = push(g);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${PUSH_O.x}px ${PUSH_O.y}px`, transform: `scale(${bz})` }}>
      <Stage3D persp={PERSP}>
        {sink < 1 && (
          <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, transform: `translateZ(${boxZ(g) - 560 * sink}px)`,
            opacity: 1 - sink, filter: sink > 0 ? `blur(${(sink * 12).toFixed(2)}px)` : undefined }}>
            {/* focus: the gradient outline accent */}
            <div style={{ position: "absolute", left: -3, top: -3, right: -3, bottom: -3, borderRadius: 26 * S + 3, background: GRAD_D, opacity: focus * 0.9 * (1 - press * 0.3),
              boxShadow: `0 0 ${50 * focus}px rgba(48,71,255,${0.22 * focus})` }} />
            <PromptBox w={BOX.w} text={"\u200B"} press={press} style={{ position: "relative" }} />
            <div style={{ position: "absolute", left: 1 + 26 * S, top: 1 + 24 * S, fontFamily: FONT, fontSize: 30 * S, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.3,
              whiteSpace: "pre", color: C.ink }}>
              {focus < 1 && <span style={{ position: "absolute", left: 0, top: 0, color: C.soft, opacity: 1 - focus }}>Ask Moviqly to create a motion design…</span>}
              {spans}
              <span style={{ display: "inline-block", width: 3 * S, height: 34 * S, marginLeft: 3 * S, verticalAlign: "-6%", background: C.blue, opacity: caretOn ? 1 : 0 }} />
            </div>
          </div>
        )}
      </Stage3D>
      {/* the parse: a hairline from each marked word up to its token */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {CHIPS.map((c, i) => {
          const d = k(g, c.at, 0.4, CRAFT);
          const o = i < 2 ? k(g, lbl2(i), 0.3, LEAVE) : k(g, "w:site+0.35", 0.15, LEAVE);
          if (d <= 0 || o >= 1) return null;
          const y1 = WORD_TOP, y0 = CHIP_Y + 34;
          return <path key={i} d={`M ${c.wx} ${y1} C ${c.wx} ${y1 - 50}, ${c.cx} ${y0 + 50}, ${c.cx} ${y0}`} fill="none" stroke={C.violet} strokeWidth={2}
            strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} opacity={0.75 * (1 - o) * (1 - sink)} />;
        })}
      </svg>
      {CHIPS.map((c, i) => {
        const p = k(g, c.at, 0.45, LAND);
        if (p <= 0) return null;
        if (i < 2) {
          const o = k(g, lbl2(i), 0.55, LEAVE);
          if (o >= 1) return null;
          const st = surface(p * (1 - o));
          return (
            <div key={i} style={{ position: "absolute", left: c.cx, top: CHIP_Y, transform: "translate(-50%, -50%)" }}>
              <div style={st}><Chip ico={c.ico} k={c.key} v={c.val} /></div>
            </div>
          );
        }
        return null;
      })}
      </div>
      {CHIPS.map((c, i) => {
        const p = k(g, c.at, 0.45, LAND);
        if (i < 2 || p <= 0 || webFade >= 1) return null;
        const st = surface(p);
        return (
          <div key={i} style={{ position: "absolute", left: web.x, top: web.y, transform: `translate(-50%, -50%) scale(${web.s})`, opacity: 1 - webFade }}>
            <div style={st}><Chip ico={c.ico} k={c.key} v={c.val} /></div>
          </div>
        );
      })}
    </>
  );
};

export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sB") || g >= f("sC")) return null;
  return <BriefLayer g={g} />;
};
