// Scene C (12.0–19.0 s): "In minutes, your answers become a complete, ready-to-use website." / "Want to change
// something? Just describe it." See ../../../plan/v2-storyboard.md.
//   12.12  the point bursts into an exploded 3D stack of the site's layers (skeletons), turning slowly
//   13.0   the three answers fly in from the edges, lie down into their layers and fill them with the real site
//   14.08  the stack collapses into one flat page that faces the camera; a laptop forms around it; the phone joins
//   16.43  macro push into the headline; on "change" a click selects it
//   16.86  a prompt bar floats up and types the change; on "it" it sends, the headline rewrites word by word
//   18.3   pull back to the exact hand-off laptop (frame 566)
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { ARRIVE, C, DEPART, MOVE, clamp01, mix } from "../lib";
import { ANSWERS, AnswerChip, Cursor, HEAD_NEW, HEAD_OLD, Ico, Laptop, MobileSite, Phone, SANS, SH, SW, Site, f, typed } from "../shared";

type Ease = (t: number) => number;
const LIN: Ease = (t) => t;
const SOFT: Ease = Easing.bezier(0.33, 0, 0.25, 1);          // a long, gentle turn
const INTO: Ease = Easing.bezier(0.55, 0, 0.7, 0.45);         // accelerating into a layer
// progress 0..1 of a move that starts at frame a and lasts d frames
const kf = (g: number, a: number, d: number, e: Ease = ARRIVE) => e(clamp01((g - a) / d));
const W = (w: string) => f(w);

/* ---------- frames ---------- */
const P0 = 364;                      // the point (from scene B) at (960, 540)
const COLL = 421;                    // the stack collapses ("complete" 422)
const SWAP = 461;                    // the flat stack has become the real laptop + site
const PUSH = W("w:want") - 2;        // 491: macro push
const PULL = 549;                    // pull back (18.3 s)
const HAND = 566;                    // the hand-off frame

/* ---------- the page and its layers ---------- */
const PGW = SW, PGH = SH + 260;      // the bakery page, 1280 x 1060
const SITE_BG = "#FFFDF9", SKEL = "#EEEAE3";
const LX = 846, LY = 612, LS = 0.7;  // the laptop in the "ready-to-use" shot
const PIV = { x: LX, y: LY + 130 * LS }; // the page centre on that laptop: the pivot of its turn

type Box = { x: number; y: number; w: number; h: number; r: number };
type Bar = [number, number, number, number, number, boolean?];   // x, y, w, h, radius, is-image (page coordinates)
type Lay = { id: string; panels: Box[]; bars: Bar[]; answer: number; delay: number };
const card = (i: number) => 56 + i * 396;
const LAYERS: Lay[] = [            // bottom to top (the base page is layer 0, drawn separately)
  { id: "footer", answer: 0, delay: 5, panels: [{ x: 32, y: 800, w: 1216, h: 84, r: 20 }], bars: [[56, 838, 170, 20, 10], [1040, 841, 184, 14, 7]] },
  { id: "cards", answer: 1, delay: 0, panels: [0, 1, 2].map((i) => ({ x: card(i), y: 548, w: 376, h: 230, r: 18 })),
    bars: [0, 1, 2].flatMap((i): Bar[] => [[card(i), 548, 376, 170, 0, true], [card(i) + 20, 736, 124, 20, 10]]) },
  { id: "photo", answer: 0, delay: 3, panels: [{ x: 640, y: 112, w: 584, h: 400, r: 22 }], bars: [[640, 112, 584, 400, 0, true]] },
  { id: "hero", answer: 2, delay: 0, panels: [{ x: 32, y: 108, w: 568, h: 384, r: 20 }],
    bars: [[56, 140, 470, 42, 12], [56, 199, 420, 42, 12], [56, 258, 250, 42, 12], [56, 340, 500, 14, 7], [56, 368, 360, 14, 7], [56, 417, 158, 51, 26]] },
  { id: "nav", answer: 0, delay: 0, panels: [{ x: 24, y: 10, w: 1232, h: 52, r: 26 }], bars: [[56, 24, 172, 24, 12], [872, 30, 48, 12, 6], [954, 30, 52, 12, 6], [1040, 30, 70, 12, 6], [1144, 30, 44, 12, 6]] },
];
const ZS = 98;                        // layer spacing in the exploded stack (page px)

/* ---------- the stack's camera and a projector for its points ---------- */
type Cam = { cx: number; cy: number; rx: number; ry: number; rz: number; s: number };
const PERSP = 2400;
const cam = (g: number): Cam => {
  const burst = kf(g, P0, 30), turn = kf(g, P0, 90, SOFT), c = kf(g, COLL, 28, MOVE), drop = kf(g, 434, 26);
  return {
    rx: mix(mix(62, 53, turn), 0, c),
    ry: ryLap(g),
    rz: mix(mix(-52, -33, turn), 0, c),
    s: mix(mix(0.34, 0.58, burst), LS * (1 + 0.05 * (1 - drop)), c),
    cx: mix(960, LX, c),
    cy: mix(mix(540, 600, burst), LY + 130 * LS - 40 * (1 - drop), c),
  };
};
// the page turns a little toward the frame's centre as it lands; the laptop keeps turning back toward the camera
const INOUT: Ease = Easing.bezier(0.42, 0, 0.58, 1);
const ryLap = (g: number) => (11 * kf(g, COLL, 28, MOVE) - 8 * kf(g, 450, 50, INOUT)) * (1 - kf(g, PUSH, 30, MOVE));
// where the point (x, y) of the page (centre-relative), lifted by z, lands on screen
const project = (cm: Cam, x: number, y: number, z: number) => {
  const a = (cm.rz * Math.PI) / 180, b = (cm.rx * Math.PI) / 180, c = (cm.ry * Math.PI) / 180;
  const X = x * cm.s, Y = y * cm.s, Z = z * cm.s;
  const x1 = X * Math.cos(a) - Y * Math.sin(a), y1 = X * Math.sin(a) + Y * Math.cos(a);
  const y2 = y1 * Math.cos(b) - Z * Math.sin(b), z2 = y1 * Math.sin(b) + Z * Math.cos(b);
  const x3 = x1 * Math.cos(c) + z2 * Math.sin(c), z3 = -x1 * Math.sin(c) + z2 * Math.cos(c);
  const w = 1 - z3 / PERSP;
  return { x: cm.cx + x3 / w, y: cm.cy + y2 / w };
};
const layerBurst = (g: number, i: number) => kf(g, P0 + 0.5 + i * 2.4, 24);              // i = 0 is the base page
const layerZ = (g: number, i: number) => (i * ZS * (1 - kf(g, COLL, 28, MOVE)) + i * 0.4) * layerBurst(g, i);

/* ---------- the answers: fly in, lie down, fill ---------- */
const CH = [
  { from: [-420, 250], hover: [430, 250], layer: 5, tgt: [640, 36], start: 385 },
  { from: [2340, 820], hover: [1530, 850], layer: 2, tgt: [640, 663], start: 389 },
  { from: [180, 1260], hover: [500, 880], layer: 4, tgt: [316, 260], start: 393 },
];
const LAND = (i: number) => CH[i].start + 25;          // 410, 414, 418
const fillOf = (g: number, l: Lay) => kf(g, LAND(l.answer) + l.delay, 11, MOVE);

const Skeleton: React.FC<{ g: number; p: Box; bars: Bar[]; w: number; bg: string }> = ({ g, p, bars, w, bg }) => {
  if (w >= 1) return null;
  const sweep = ((g - P0) * 26) % 1800 - 600;
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, clipPath: `inset(0 0 0 ${w * 100}%)` }}>
      {bars.filter((b) => b[0] >= p.x - 1 && b[0] < p.x + p.w && b[1] >= p.y - 1 && b[1] < p.y + p.h).map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b[0] - p.x, top: b[1] - p.y, width: b[2], height: b[3], borderRadius: b[4], overflow: "hidden",
          background: b[5] ? C.blueTint : `linear-gradient(100deg, ${SKEL} 0px, #F8F6F2 120px, ${SKEL} 240px) ${sweep - b[0]}px 0 / 1800px 100% no-repeat, ${SKEL}`,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          {b[5] && <div style={{ opacity: 0.55 }}><Ico n="image" s={Math.min(64, b[3] * 0.4)} c={C.blue} w={2} /></div>}
        </div>
      ))}
      {w > 0 && <div style={{ position: "absolute", left: `${w * 100}%`, top: 0, bottom: 0, width: 70, marginLeft: -35,
        background: "linear-gradient(90deg, rgba(74,163,245,0) 0%, rgba(74,163,245,0.35) 50%, rgba(74,163,245,0) 100%)" }} />}
    </div>
  );
};

const Stack: React.FC<{ g: number; cm: Cam }> = ({ g, cm }) => {
  const c = kf(g, COLL, 28, MOVE);
  const cut = kf(g, 432, 20, MOVE);                         // the page trims to the screen (the footer dissolves)
  const site = <Site g={g} build={1} scroll={0} select={false} />;
  const base = layerBurst(g, 0);
  return (
    <div style={{ position: "absolute", left: cm.cx - PGW / 2, top: cm.cy - PGH / 2, width: PGW, height: PGH, transformStyle: "preserve-3d",
      transform: `perspective(${PERSP}px) rotateY(${cm.ry}deg) rotateX(${cm.rx + 0.01}deg) rotateZ(${cm.rz}deg) scale3d(${cm.s}, ${cm.s}, ${cm.s})`, transformOrigin: "50% 50%" }}>
      {/* the page itself */}
      <div style={{ position: "absolute", left: 0, top: 0, width: PGW, height: PGH, transform: `scale(${mix(0.03, 1, base)})`, opacity: clamp01(base * 3) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: PGW, height: mix(PGH, SH, cut), borderRadius: mix(30, 14, cut), background: SITE_BG,
          boxShadow: `0 0 0 ${1.5 * (1 - c)}px rgba(74,163,245,${0.3 * (1 - c)}), 0 70px 110px -50px rgba(29,29,31,${0.42 * (1 - cut)})` }} />
      </div>
      {LAYERS.map((l, li) => {
        const i = li + 1, b = layerBurst(g, i), z = layerZ(g, i), w = fillOf(g, l);
        const land = kf(g, LAND(l.answer) + l.delay, 16, LIN), fl = Math.sin(Math.PI * land);
        const o = clamp01(b * 3) * (l.id === "footer" ? 1 - kf(g, 426, 14, MOVE) : 1);
        if (o <= 0.001) return null;
        return (
          <div key={l.id} style={{ position: "absolute", left: 0, top: 0, width: PGW, height: PGH, transform: `translateZ(${z}px) scale(${mix(0.03, 1, b)})`, opacity: o }}>
            {l.panels.map((p, pi) => (
              <div key={pi} style={{ position: "absolute", left: p.x, top: p.y, width: p.w, height: p.h, borderRadius: p.r, overflow: "hidden", background: SITE_BG,
                boxShadow: `0 0 0 ${1.5 + 4 * fl}px rgba(74,163,245,${(0.4 + 0.5 * fl) * (1 - c)}), 0 34px 50px -30px rgba(29,29,31,${0.32 * (1 - c)})` }}>
                <div style={{ position: "absolute", left: -p.x, top: -p.y, width: PGW, height: PGH }}>{site}</div>
                <Skeleton g={g} p={p} bars={l.bars} w={w} bg={l.id === "cards" ? "#F4F1EC" : SITE_BG} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const Chips: React.FC<{ g: number; cm: Cam }> = ({ g, cm }) => (
  <>
    {CH.map((ch, i) => {
      const a = kf(g, ch.start, 14), b = kf(g, ch.start + 14, 11, INTO);
      if (a <= 0 || b >= 1) return null;
      const t = project(cm, ch.tgt[0] - PGW / 2, ch.tgt[1] - PGH / 2, layerZ(g, ch.layer));
      const x = mix(mix(ch.from[0], ch.hover[0], a), t.x, b), y = mix(mix(ch.from[1], ch.hover[1], a), t.y, b);
      const ans = ANSWERS[i];
      return (
        <div key={i} style={{ position: "absolute", left: x, top: y, opacity: clamp01(a * 2.5) * (1 - clamp01((b - 0.7) / 0.3)),
          transform: `translate(-50%, -50%) perspective(2400px) rotateX(${cm.rx * b}deg) rotateZ(${cm.rz * b}deg) scale(${mix(1, 0.24, b)})` }}>
          <AnswerChip icon={ans.icon} text={ans.a} size={28} />
        </div>
      );
    })}
    {/* a soft blue bloom where each answer lands */}
    {CH.map((ch, i) => {
      const l = kf(g, LAND(i) - 2, 16, LIN);
      if (l <= 0 || l >= 1) return null;
      const t = project(cm, ch.tgt[0] - PGW / 2, ch.tgt[1] - PGH / 2, layerZ(g, ch.layer));
      const r = mix(30, 120, ARRIVE(l));
      return <div key={`b${i}`} style={{ position: "absolute", left: t.x - r, top: t.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", opacity: Math.sin(Math.PI * l) * 0.75,
        background: "radial-gradient(circle, rgba(234,244,254,0.9) 0%, rgba(74,163,245,0.28) 32%, rgba(74,163,245,0) 70%)" }} />;
    })}
  </>
);

/* ---------- the laptop that forms around the page (Laptop's exact geometry; bezel and base fade in) ---------- */
const Shell: React.FC<{ x: number; y: number; s: number; bez: number; base: number }> = ({ x, y, s, bez, base }) => {
  const B = 16, LW = SW + 2 * B, LH = SH + 2 * B;
  if (bez <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH + 30, transform: `translate(${x - LW / 2}px, ${y - LH / 2}px) scale(${s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: `${LW / 2}px ${LH / 2}px` }}>
      <div style={{ position: "absolute", left: LW / 2 - 900, top: LH + 4, width: 1800, height: 120, borderRadius: "50%", opacity: base, background: "radial-gradient(ellipse at center, rgba(29,29,31,0.22) 0%, rgba(29,29,31,0) 70%)" }} />
      {/* the bezel grows outward from behind the page's edges */}
      <div style={{ position: "absolute", left: B * (1 - bez), top: B * (1 - bez), width: SW + 2 * B * bez, height: SH + 2 * B * bez, borderRadius: mix(14, 30, bez), background: "#141416",
        opacity: Math.min(1, bez * 4), boxShadow: `0 0 0 ${2 * bez}px #C9CACE, 0 40px 90px -40px rgba(29,29,31,${0.5 * bez})` }}>
        <div style={{ position: "absolute", left: SW / 2 + B * bez - 4, top: 5 - B * (1 - bez), width: 8, height: 8, borderRadius: 4, background: "#2A2A2E" }} />
      </div>
      <div style={{ position: "absolute", left: LW / 2 - 790, top: LH - 2, width: 1580, height: 26, borderRadius: "4px 4px 18px 18px", opacity: Math.min(1, base * 3), transform: `translateY(${-(1 - base) * 24}px) scaleX(${mix(0.86, 1, base)})`,
        background: "linear-gradient(180deg, #E8E9EC 0%, #CFD1D5 55%, #A9ABB0 100%)" }}>
        <div style={{ position: "absolute", left: 790 - 120, top: 0, width: 240, height: 9, borderRadius: "0 0 10px 10px", background: "#B9BBC0" }} />
      </div>
    </div>
  );
};

/* ---------- the statement: words rise, fade and sharpen; `join` sets a word without a gap ---------- */
type BW = { t: string; at: string; blue?: boolean; join?: boolean };
const Line: React.FC<{ g: number; words: BW[]; y: number; size: number; out: number }> = ({ g, words, y, size, out }) => {
  if (g > out + 30) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1920, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: size,
      letterSpacing: "-0.035em", lineHeight: 1.1, color: C.ink, whiteSpace: "nowrap" }}>
      {words.map((w, i) => {
        const a = kf(g, W(w.at), 26), o = kf(g, out + i, 12, DEPART);
        const bl = (1 - a) * 10 + o * 8;
        return <span key={i} style={{ display: "inline-block", marginLeft: i === 0 || w.join ? 0 : size * 0.26, color: w.blue ? C.blue : undefined, opacity: Math.min(1, a * 1.4) * (1 - o),
          transform: `translateY(${(1 - a) * size * 0.3 - o * size * 0.32}px)`, filter: bl > 0.05 ? `blur(${bl}px)` : undefined }}>{w.t}</span>;
      })}
    </div>
  );
};

/* ---------- the laptop's path from the pair shot to the macro and back ---------- */
const MAC0 = { x: 1305, y: 815, s: 2.05 }, MAC1 = { x: 1338, y: 836, s: 2.11 }, END = { x: 960, y: 600, s: 0.72 };
const lapPush = (g: number) => {
  const p = kf(g, PUSH, 30, MOVE), d = kf(g, PUSH + 18, PULL - PUSH - 18 + 10, Easing.bezier(0.3, 0, 0.7, 1));
  return { x: mix(LX, MAC0.x, p) + (MAC1.x - MAC0.x) * d, y: mix(LY, MAC0.y, p) + (MAC1.y - MAC0.y) * d, s: mix(LS, MAC0.s, p) + (MAC1.s - MAC0.s) * d };
};
const lap = (g: number) => {
  if (g < PULL) return lapPush(g);
  const a = lapPush(PULL), q = kf(g, PULL, HAND - PULL, MOVE);
  return { x: mix(a.x, END.x, q), y: mix(a.y, END.y, q), s: mix(a.s, END.s, q) };
};
// a point of the site (screen coordinates inside the laptop) on the frame
const onLap = (L: { x: number; y: number; s: number }, sx: number, sy: number) => ({ x: L.x + (sx - SW / 2) * L.s, y: L.y + (sy - SH / 2) * L.s });

/* ---------- the headline, selected and then rewritten word by word ---------- */
const OLDW = HEAD_OLD.split(" "), NEWW = HEAD_NEW.split(" ");
const Headline: React.FC<{ g: number }> = ({ g }) => {
  const it = W("w:it");
  const sel = kf(g, W("w:change"), 9) * (1 - kf(g, it + 3, 9, DEPART));
  const pulse = Math.sin(Math.PI * kf(g, it, 14, LIN));
  return (
    <>
      {sel > 0.001 && (
        <div style={{ position: "absolute", left: -14, top: -12, right: -14, bottom: -12, borderRadius: 10, border: `3px solid ${C.blue}`, opacity: Math.min(1, sel * 1.6),
          transform: `scale(${mix(1.07, 1, sel)})`, background: `rgba(74,163,245,${0.05 + 0.06 * pulse})`, boxShadow: `0 0 0 ${5 + 6 * pulse}px rgba(74,163,245,${0.14 + 0.1 * pulse})` }}>
          {[[-8, -8], [-8, null], [null, -8], [null, null]].map(([l, t], i) => {
            const h = kf(g, W("w:change") + 2 + i, 7);
            return <div key={i} style={{ position: "absolute", width: 13, height: 13, borderRadius: 3, background: C.white, border: `3px solid ${C.blue}`, transform: `scale(${h})`,
              left: l ?? undefined, right: l === null ? -8 : undefined, top: t ?? undefined, bottom: t === null ? -8 : undefined }} />;
          })}
          {pulse > 0 && <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 8 }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${mix(-20, 110, kf(g, it, 13, MOVE))}%`, width: 160, marginLeft: -80,
              background: "linear-gradient(90deg, rgba(74,163,245,0) 0%, rgba(74,163,245,0.28) 50%, rgba(74,163,245,0) 100%)" }} />
          </div>}
          <div style={{ position: "absolute", left: -3, top: -46, padding: "6px 12px", borderRadius: 8, background: C.blue, color: C.white, fontFamily: SANS, fontWeight: 600, fontSize: 18,
            letterSpacing: 0, lineHeight: 1.2, opacity: kf(g, W("w:change") + 3, 8), transform: `translateY(${(1 - kf(g, W("w:change") + 3, 10)) * 8}px)` }}>Headline</div>
        </div>
      )}
      <span>{OLDW.map((w, i) => {
        const o = kf(g, it + i * 0.6, 4, DEPART);
        return <React.Fragment key={i}><span style={{ display: "inline-block", opacity: 1 - o, transform: o > 0 ? `translateY(${-o * 16}px)` : undefined, filter: o > 0.02 ? `blur(${o * 9}px)` : undefined }}>{w}</span>{i < OLDW.length - 1 ? " " : ""}</React.Fragment>;
      })}</span>
      <span style={{ position: "absolute", left: 0, top: 0 }}>{NEWW.map((w, i) => {
        const a = kf(g, it + 4.5 + i * 0.95, 9);
        return <React.Fragment key={i}><span style={{ display: "inline-block", opacity: Math.min(1, a * 1.3), transform: a < 1 ? `translateY(${(1 - a) * 20}px)` : undefined, filter: a < 0.98 ? `blur(${(1 - a) * 9}px)` : undefined }}>{w}</span>{i < NEWW.length - 1 ? " " : ""}</React.Fragment>;
      })}</span>
    </>
  );
};

/* ---------- the prompt: floats up, types the change, sends on "it" ---------- */
const PROMPT = "Make it warmer and add our hours: Mon–Fri 6–18";
const Prompt: React.FC<{ g: number }> = ({ g }) => {
  const it = W("w:it");
  const a = kf(g, W("w:something") - 3, 24), out = kf(g, PULL - 1, 8, DEPART);
  if (a <= 0 || out >= 1) return null;
  const text = typed(g, "w:something+0.1", PROMPT, 40);
  const press = Math.sin(Math.PI * kf(g, it - 1, 6, LIN)), rip = kf(g, it, 14, LIN);
  const sent = g >= it;
  const PWd = 1000, PHt = 108, PX = 1112;
  return (
    <div style={{ position: "absolute", left: PX - PWd / 2, top: 956 - PHt / 2 + (1 - a) * 150 + out * 110, width: PWd, height: PHt, opacity: Math.min(1, a * 1.7) * (1 - out),
      transform: `perspective(1600px) rotateX(${(1 - a) * 26}deg) scale(${mix(0.92, 1, a)})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: PHt / 2, background: C.white, boxShadow: "0 0 0 1px rgba(29,29,31,0.06), 0 40px 80px -34px rgba(29,29,31,0.42)",
        display: "flex", alignItems: "center", gap: 22, padding: "0 20px 0 22px", boxSizing: "border-box" }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: C.blueTint, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <div style={{ transform: `scale(${1 + 0.18 * press})` }}><Ico n="spark" s={32} c={C.blueDeep} w={2.4} /></div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: "-0.018em", color: text ? C.ink : C.light, whiteSpace: "nowrap", overflow: "hidden",
          opacity: sent ? 1 - 0.45 * kf(g, it + 1, 6) : 1 }}>
          {text || "Describe a change…"}
          {!sent && <span style={{ width: 3, height: 40, marginLeft: 3, borderRadius: 2, background: C.blue, opacity: Math.floor(g / 7) % 2 ? 1 : 0.25 }} />}
        </div>
        <div style={{ position: "relative", width: 68, height: 68, flex: "none" }}>
          {rip > 0 && rip < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: 34, border: `3px solid ${C.blue}`, opacity: 0.6 * (1 - rip), transform: `scale(${1 + 1.1 * ARRIVE(rip)})` }} />}
          <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: text.length > 3 ? (press > 0.3 ? C.blueDeep : C.blue) : C.line, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${1 - 0.12 * press})`, boxShadow: text.length > 3 ? `0 10px 24px -10px ${C.blueGlow}` : undefined }}>
            <Ico n="up" s={32} c={C.white} w={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g < P0 - 1 || g > HAND) return null;
  const cm = cam(g);

  // the point and its burst of light
  const pt = kf(g, P0 - 1, 2, LIN) * (1 - kf(g, P0 + 2, 5, DEPART)), ring = kf(g, P0, 20, LIN);
  const bloom = kf(g, P0, 20) * (1 - kf(g, COLL, 24, MOVE));

  // the laptop forming around the landing page, then the pair shot (both turned a little toward each other)
  const bez = kf(g, 445, 15), lbase = kf(g, 448, 13);
  const ry = ryLap(g);
  const turn = (node: React.ReactNode) => (
    <div style={{ position: "absolute", inset: 0, transform: ry !== 0 ? `perspective(${PERSP}px) rotateY(${ry}deg)` : undefined, transformOrigin: `${PIV.x}px ${PIV.y}px` }}>{node}</div>
  );
  const ph = kf(g, W("w:use") - 5, 28), phOut = kf(g, PUSH - 6, 16, DEPART);
  const phx = mix(1900, 1398, ph) + 420 * phOut, phy = 704 + mix(40, 0, ph);
  const phRy = mix(-48, -18, ph) + 8 * kf(g, W("w:use") + 14, 40, INOUT) - 16 * phOut;
  // the pair shot's slow push (from the swap frame, so the stack lands on the exact laptop)
  const gz = 1 + 0.05 * kf(g, SWAP, 34, INOUT) * (1 - kf(g, PUSH, 30, MOVE));
  const push = (node: React.ReactNode) => gz === 1 ? node : <div style={{ position: "absolute", inset: 0, transform: `scale(${gz})`, transformOrigin: "930px 660px" }}>{node}</div>;
  const L = lap(g);

  // the cursor clicks the headline on "change"
  const ch = W("w:change");
  const tip = onLap(L, 452, 232);
  const cIn = kf(g, ch - 12, 12, MOVE), cOut = kf(g, ch + 7, 9, DEPART);
  const cur = { x: mix(1640, tip.x, cIn) + cOut * 40, y: mix(1040, tip.y, cIn) + cOut * 60 };
  const press = Math.sin(Math.PI * kf(g, ch - 1, 5, LIN));

  return (
    <AbsoluteFill>
      {/* the light behind the burst */}
      {bloom > 0 && <div style={{ position: "absolute", left: cm.cx - 700, top: cm.cy - 560, width: 1400, height: 1120, borderRadius: "50%", opacity: 0.85 * bloom,
        background: "radial-gradient(ellipse at center, rgba(74,163,245,0.2) 0%, rgba(74,163,245,0.07) 40%, rgba(74,163,245,0) 70%)" }} />}
      {ring > 0 && ring < 1 && (() => {
        const r = mix(10, 360, ARRIVE(ring));
        return <div style={{ position: "absolute", left: 960 - r, top: 540 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", opacity: 0.55 * (1 - ring) * Math.min(1, ring * 6),
          background: "radial-gradient(circle, rgba(74,163,245,0) 60%, rgba(74,163,245,0.3) 69%, rgba(74,163,245,0) 71%)" }} />;
      })()}

      {/* 12.12–15.4: the exploded stack, the answers diving in, the collapse into a page, the laptop forming around it */}
      {g < SWAP && turn(<Shell x={LX} y={LY} s={LS} bez={bez} base={lbase} />)}
      {g < SWAP && <Stack g={g} cm={cm} />}
      {g < SWAP && <Chips g={g} cm={cm} />}
      {pt > 0 && <div style={{ position: "absolute", left: 960 - 9, top: 540 - 9, width: 18, height: 18, borderRadius: 9, background: C.white, opacity: pt,
        boxShadow: `0 0 18px 8px rgba(74,163,245,0.75), 0 0 60px 24px rgba(74,163,245,0.35)` }} />}

      {/* 15.4–16.4: the laptop, the phone joins in front; 16.43: the macro push */}
      {g >= SWAP && g < PULL && push(turn(<Laptop x={L.x} y={L.y} s={L.s}><Site g={g} build={1} scroll={0} select={false} headline={g >= ch - 2 ? <Headline g={g} /> : undefined} /></Laptop>))}
      {ph > 0 && phOut < 1 && push(
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${phx}px ${phy}px`, transform: `perspective(2200px) rotateY(${phRy}deg)`, opacity: 1 - phOut }}>
          <Phone x={phx} y={phy} s={0.6} o={clamp01(ph * 2.2)}><MobileSite g={g} build={1} /></Phone>
        </div>
      )}
      {g >= PULL && g < HAND && <Laptop x={L.x} y={L.y} s={L.s}><Site g={g} build={1} scroll={0} select={false} headline={<Headline g={g} />} /></Laptop>}
      {g === HAND && <Laptop x={960} y={600} s={0.72}><Site g={g} build={1} scroll={0} select={false} /></Laptop>}

      {/* "A complete, ready-to-use website." */}
      <Line g={g} y={104} size={62} out={PUSH - 6} words={[
        { t: "A", at: "w:a2" }, { t: "complete,", at: "w:complete" },
        { t: "ready-", at: "w:ready", blue: true }, { t: "to-", at: "w:to", blue: true, join: true }, { t: "use", at: "w:use", blue: true, join: true },
        { t: "website.", at: "w:website2" },
      ]} />

      {/* the click, the prompt */}
      {cIn > 0 && cOut < 1 && <Cursor x={cur.x} y={cur.y} s={1.25} o={1 - cOut} press={press} />}
      <Prompt g={g} />
    </AbsoluteFill>
  );
};
