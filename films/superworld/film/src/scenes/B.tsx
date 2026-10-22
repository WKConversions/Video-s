// Segment B (10-20 s): "Become the Pioneer of your place." and "Own a piece of the map."
// 10.0-10.25 H1 map (hand-in) -> the map shrinks into a rounded window and dives to Sesame; @hrish's pin drops, a gold
// ring irises out and the Pioneer title card expands from the pin; a SuperFan card stacks under it. 13.4: the cards
// fold back into the pin, the window tilts into a 3D map sheet, a plot grid draws, plots glow, a cursor buys a plot
// (Available -> Owned). 16.6: the Top Plots leaderboard rises over the sheet, rows stack in, points roll.
// 19.05-19.75: the leaderboard empties and becomes H2Panel, drawn unchanged 19.75-20.0.
import React from "react";
import { AbsoluteFill } from "remotion";
import { S, BTN, SANS, SHADOW, clamp, mix, ease, inout, spring, bounce, CityMap, Cam, toScreen, Pin, Avatar, Glass, H1Map, h1Cam, H2Panel, H2 } from "../kit";

const SES = { x: 2230, y: 930 };            // "Sesame": @hrish's place
const RAD = Math.PI / 180;
const WIN = { l: 800, t: 110, r: 64, b: 110 }; // the map window (insets)

// ---- camera: H1's glide -> dive to Sesame -> slow orbit -> pull back over the plots
const h1F = (t: number) => { const c = h1Cam(t); return { x: c.cx, y: c.cy }; };
const camAt = (t: number) => {
  const p = inout((t - 10.25) / 1.2);
  const f = h1F(Math.min(t, 10.25)), v = { x: 90, y: -40 };
  const dt = Math.max(0, t - 10.25);
  // keep H1's velocity, ease it toward Sesame, then a slow drift
  const startF = { x: f.x + v.x * dt * (1 - p), y: f.y + v.y * dt * (1 - p) };
  const d5 = Math.max(0, t - 13.4);
  const d6 = Math.max(0, t - 16.5), g6 = d6 < 0.6 ? (d6 * d6) / 1.2 : d6 - 0.3;
  const drift = { x: 40 * d5 - 90 * g6, y: 175 * d5 - 400 * g6 };
  const q = inout((t - 13.4) / 1.3);
  const fx = mix(startF.x, SES.x, p) + drift.x - q * 170, fy = mix(startF.y, SES.y, p) + drift.y + q * 60;
  const z = mix(0.9, 1.6, p) - 0.36 * Math.max(0, Math.min(t, 13.45) - 11.2) + 0.1 * q;
  const g6r = Math.max(0, t - 16.5), gr = g6r < 0.6 ? (g6r * g6r) / 1.2 : g6r - 0.3;
  const rot = p * (36 * Math.max(0, Math.min(t, 13.4) - 10.6) + 5 * d5 + 11 * gr - 47.6 * inout((t - 13.4) / 1.5));
  return { fx, fy, z, rot };
};
// window anchor: where the focus sits inside the container
const anchorAt = (t: number) => {
  const k = spring(t, 10.25, 0.9, 0.86);
  const gl = -80 * Math.max(0, Math.min(t, 13.4) - 11.0) + 192 * inout((t - 13.4) / 1.5);
  return { ax: mix(960, 1500, k) + gl, ay: mix(540, 800, k), k };
};
const camEff = (t: number): Cam => {
  const c = camAt(t), a = anchorAt(t);
  const r = (c.rot * RAD);
  // put the focus at (ax, ay): solve the screen offset back into map units (rotation-aware)
  const ox = (a.ax - 960) / c.z, oy = (a.ay - 540) / c.z;
  const mx = ox * Math.cos(-r) - oy * Math.sin(-r), my = ox * Math.sin(-r) + oy * Math.cos(-r);
  return { cx: c.fx - mx, cy: c.fy - my, z: c.z, rot: c.rot };
};

// ---- the 3D sheet (shot 5): CSS transform and the matching projection of container points to the screen
const O3 = { x: 1430, y: 560 }, PERSP = 1700;
const sheetQ = (t: number) => spring(t, 13.45, 1.0, 0.8);
const sheetPose = (t: number) => {
  const q = sheetQ(t);
  const lb = spring(t, 16.5, 1.0, 0.9);          // the leaderboard push nudges the sheet left and back
  const out = Math.pow(clamp((t - 19.05) / 0.85), 1.6);
  return { a: 48 * q + 6 * lb, b: -14 * q, s: 1 + 0.16 * q - 0.08 * lb, tx: -40 * q - 120 * lb - 520 * out, ty: 40 * q + 60 * lb + 380 * out, op: 1 - out };
};
const sheetCss = (t: number) => {
  const p = sheetPose(t);
  return `translate(${p.tx}px, ${p.ty}px) perspective(${PERSP}px) rotateX(${p.a}deg) rotateZ(${p.b}deg) scale(${p.s})`;
};
const proj = (x: number, y: number, t: number) => {
  const p = sheetPose(t);
  const dx = (x - O3.x) * p.s, dy = (y - O3.y) * p.s, b = p.b * RAD, a = p.a * RAD;
  const x1 = dx * Math.cos(b) - dy * Math.sin(b), y1 = dx * Math.sin(b) + dy * Math.cos(b);
  const y2 = y1 * Math.cos(a), z2 = y1 * Math.sin(a), w = 1 - z2 / PERSP;
  return { x: O3.x + p.tx + x1 / w, y: O3.y + p.ty + y2 / w, w };
};

// ---- plot grid (the map's street grid is rotated -29 deg about (1800, 1200); plots are its blocks)
const GA = -29 * RAD;
const gridToMap = (gx: number, gy: number) => ({ x: 1800 + (gx - 1800) * Math.cos(GA) - (gy - 1200) * Math.sin(GA), y: 1200 + (gx - 1800) * Math.sin(GA) + (gy - 1200) * Math.cos(GA) });
const mapToGrid = (mx: number, my: number) => ({ x: 1800 + (mx - 1800) * Math.cos(-GA) - (my - 1200) * Math.sin(-GA), y: 1200 + (mx - 1800) * Math.sin(-GA) + (my - 1200) * Math.cos(-GA) });
const SEL = (() => { const f = camAt(15.6); const g = mapToGrid(f.fx + 40, f.fy + 120); return { i: Math.floor(g.x / 120), j: Math.floor(g.y / 90) }; })();
const HEAT = (() => {
  const f = camAt(14.6), g = mapToGrid(f.fx, f.fy), ci = Math.floor(g.x / 120), cj = Math.floor(g.y / 90);
  const offs = [[-3, -2], [2, -3], [-1, 1], [3, 2], [-4, 3], [1, -1], [4, -1], [-2, -4], [0, 4], [5, 4], [-5, -1], [2, 5], [-3, 6], [6, -3]];
  const h1 = offs.map(([a, b], n) => ({ i: ci + a, j: cj + b, at: 14.2 + n * 0.075, r: 80 + ((n * 37) % 50) }));
  const f2 = camAt(17.8), g2 = mapToGrid(f2.fx, f2.fy), di = Math.floor(g2.x / 120), dj = Math.floor(g2.y / 90);
  const h2 = offs.map(([a, b], n) => ({ i: di + b, j: dj - a, at: 16.7 + n * 0.09, r: 90 + ((n * 29) % 50) }));
  return [...h1, ...h2];
})();

const PEOPLE = [
  { u: "@katya", i: 1, dx: -260, dy: 90, at: 11.32 }, { u: "@maxwoon", i: 2, dx: 230, dy: 120, at: 11.5 },
  { u: "@isla.vuorinen", i: 3, dx: -120, dy: 230, at: 11.68 }, { u: "@travellingtexan", i: 4, dx: 380, dy: 260, at: 11.86 },
  { u: "@alex.alexander", i: 5, dx: -420, dy: 300, at: 12.04 }, { u: "@sebastian.ramon", i: 6, dx: 120, dy: 420, at: 12.22 },
];
// ---- left-aligned kinetic line: letters spring up; on exit they drop away
const Line: React.FC<{ t: number; at: number; out?: number; dur?: number; text: string; x: number; y: number; size: number; accent?: [number, number]; accentColor?: string; vx?: number; vy?: number; sc?: number }> = ({ t, at, out = 99, dur = 0.38, text, x, y, size, accent = [-1, -1], accentColor = S.blue, vx = 26, vy = 0, sc = 0.012 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", transform: `translate(${Math.min(t - at, out - at + 0.4) > 0 ? Math.min(t - at, out - at + 0.4) * vx : 0}px, ${Math.min(t - at, out - at + 0.4) > 0 ? Math.min(t - at, out - at + 0.4) * vy : 0}px) scale(${1 + Math.max(0, Math.min(t - at, out - at + 0.4)) * sc})`, transformOrigin: "0% 50%", fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: "-0.03em", whiteSpace: "pre", lineHeight: 1.05 }}>
    {text.split("").map((ch, i) => {
      const p = bounce(t, at + i * 0.024, 0.5), e = ease((t - (out + i * 0.014)) / dur), e2 = clamp((t - (out + i * 0.014)) / dur);
      return <span key={i} style={{ display: "inline-block", transform: `translate(${-e2 * e2 * 620}px, ${(1 - p) * size * 0.7 + e2 * e2 * size * 0.25}px) scale(${(0.55 + 0.45 * p) * (1 - 0.25 * e)}) rotate(${-e2 * 3}deg)`, opacity: clamp(p * 2) * (1 - e), color: i >= accent[0] && i < accent[1] ? accentColor : S.ink }}>{ch}</span>;
    })}
  </div>
);

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
// an odometer: every digit is a strip that glides; it lands exactly on n when v = n
const Odo: React.FC<{ v: number; n: number; size: number }> = ({ v, n, size }) => {
  const str = fmt(n), h = Math.round(size * 1.18);
  let k = str.replace(/,/g, "").length;
  return <span style={{ display: "inline-flex", height: h, lineHeight: `${h}px`, overflow: "hidden" }}>
    {str.split("").map((ch, i) => {
      if (ch === ",") return <span key={i}>,</span>;
      k--; const d = Number(ch), r = n > 0 ? v / n : 1;
      const off = ((d + 10 * Math.min(2, k === 0 ? 2 : k === 1 ? 1 : 0)) * r) % 10;
      return <span key={i} style={{ display: "inline-block", height: h, overflow: "hidden" }}>
        <span style={{ display: "flex", flexDirection: "column", transform: `translateY(${-off * h}px)` }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, j) => <span key={j} style={{ height: h }}>{d}</span>)}</span>
      </span>;
    })}
  </span>;
};
const Flag: React.FC<{ s: number; c: string }> = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M5 21V4 M5 4h11l-2 4 2 4H5" stroke={c} strokeWidth={2.4} fill="none" strokeLinejoin="round" strokeLinecap="round" /></svg>
);
const Trophy: React.FC<{ s: number; c: string }> = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M7 4h10v4a5 5 0 0 1-10 0V4z M7 6H4v1a3 3 0 0 0 3 3 M17 6h3v1a3 3 0 0 1-3 3 M12 13v4 M8 20h8" stroke={c} strokeWidth={2.2} fill="none" strokeLinejoin="round" strokeLinecap="round" /></svg>
);
const Heart: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.2 0 3.6 1.2 5.3 3.1 1.7-1.9 3.1-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill={S.red} /></svg>
);
const Cursor: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 6px 8px rgba(26,26,26,0.3))" }}><path d="M5 2.5l14 10.2-6.3 1.1 3.7 6.9-2.6 1.4-3.7-7-4.9 4.3z" fill={S.ink} stroke={S.white} strokeWidth={1.4} strokeLinejoin="round" /></svg>
);

// a pop-in: scale with a bounce, from a point
const pop = (t: number, at: number, r = 0.5) => bounce(t, at, r);

export const SegB: React.FC<{ t: number }> = ({ t }) => {
  if (t < 10.25) return <AbsoluteFill><H1Map t={t} /></AbsoluteFill>;

  const cam = camEff(t), an = anchorAt(t), k = an.k;
  const q5 = sheetQ(t), pose = sheetPose(t);
  const loc = (mx: number, my: number) => toScreen(mx, my, cam);          // container coords
  const scr = (mx: number, my: number) => { const c = loc(mx, my); return proj(c.x, c.y, t); }; // screen coords
  const tr = `translate(960 540) rotate(${cam.rot ?? 0}) scale(${cam.z}) translate(${-cam.cx} ${-cam.cy})`;

  // ---------- the map container: window clip, then the 3D sheet
  const clip = `inset(${WIN.t * k}px ${WIN.r * k}px ${WIN.b * k}px ${WIN.l * k}px round ${56 * Math.min(1, k)}px)`;
  const grow = q5; // the sheet's clip opens wider as it tilts
  const L5 = mix(WIN.l, 700, grow) * k;
  const clip5 = `inset(${mix(WIN.t, 20, grow) * k}px ${mix(WIN.r, -40, grow) * k}px ${mix(WIN.b, -60, grow) * k}px ${L5}px round ${mix(56, 64, grow)}px)`;
  const mask = q5 > 0.01 ? `linear-gradient(to bottom, rgba(0,0,0,${1 - q5}) 0px, rgba(0,0,0,${1 - q5}) ${mix(0, 60, q5)}px, black ${mix(1, 420, q5)}px), linear-gradient(to right, rgba(0,0,0,${1 - q5}) ${L5}px, black ${L5 + mix(1, 340, q5)}px)` : undefined;

  // plot grid and heat (shot 5)
  const gridP = (n: number, tot: number) => ease((t - (14.0 + (n / tot) * 0.5)) / 0.45);
  const vLines = Array.from({ length: 26 }, (_, n) => n + 2), hLines = Array.from({ length: 30 }, (_, n) => n - 2);
  const buy = pop(t, 16.02, 0.55);
  const selC = gridToMap(SEL.i * 120 + 60, SEL.j * 90 + 45);
  const selS = scr(selC.x, selC.y);

  const mapLayer = (
    <div style={{ position: "absolute", inset: 0, clipPath: q5 > 0.001 ? clip5 : clip, transform: q5 > 0.001 ? sheetCss(t) : undefined, transformOrigin: `${O3.x}px ${O3.y}px`,
      WebkitMaskImage: mask, maskImage: mask, maskComposite: "intersect", WebkitMaskComposite: "source-in", opacity: pose.op, boxShadow: k > 0.05 ? SHADOW : undefined }}>
      <CityMap cam={cam} />
      {t > 13.9 && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="heat"><stop offset="0" stopColor={S.violet} stopOpacity={0.62} /><stop offset="0.45" stopColor={S.blue} stopOpacity={0.34} /><stop offset="1" stopColor={S.blue} stopOpacity={0} /></radialGradient>
          <linearGradient id="buy" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={S.blue} /><stop offset="1" stopColor={S.violet} /></linearGradient>
        </defs>
        <g transform={tr}><g transform="rotate(-29 1800 1200)">
          {HEAT.map((h, n) => { const p = pop(t, h.at, 0.6); const pulse = 1 + 0.2 * Math.sin((t - h.at) * 6 + n); return p > 0 && <circle key={n} cx={h.i * 120 + 60} cy={h.j * 90 + 45} r={h.r * p * pulse} fill="url(#heat)" />; })}
          {HEAT.slice(0, 8).map((h, n) => { const p = clamp((t - h.at - 0.1) / 0.25); return p > 0 && <rect key={"o" + n} x={h.i * 120 + 10} y={h.j * 90 + 8} width={100} height={74} rx={8} fill={S.blue} opacity={0.22 * p} />; })}
          {vLines.map((i, n) => { const p = gridP(n, vLines.length); return p > 0 && <line key={"v" + n} x1={i * 120} y1={-200} x2={i * 120} y2={-200 + 2800 * p} stroke={S.blue} strokeOpacity={0.4} strokeWidth={3} />; })}
          {hLines.map((j, n) => { const p = gridP(n, hLines.length); return p > 0 && <line key={"h" + n} x1={0} y1={j * 90} x2={3400 * p} y2={j * 90} stroke={S.blue} strokeOpacity={0.4} strokeWidth={3} />; })}
          {buy > 0 && <g transform={`translate(${SEL.i * 120 + 60} ${SEL.j * 90 + 45}) scale(${buy} ${mix(1.25, 1, clamp(buy)) * buy}) translate(-60 -45)`}>
            <rect x={4} y={4} width={112} height={82} rx={10} fill="url(#buy)" />
            <rect x={4} y={4} width={112} height={82} rx={10} fill="none" stroke={S.white} strokeWidth={5} />
          </g>}
        </g></g>
      </svg>}
      {PEOPLE.map((pp, n) => { const p = pop(t, pp.at, 0.5) * (1 - ease((t - 13.45 - n * 0.03) / 0.3)); const s = loc(SES.x + pp.dx, SES.y + pp.dy); return p > 0.001 && <Pin key={n} x={s.x} y={s.y} p={p} name={pp.u} i={pp.i} size={64} />; })}
      {/* @hrish's pin at Sesame */}
      {(() => {
        const p = pop(t, 10.62, 0.55) * (1 - ease((t - 13.5) / 0.3)); const s = loc(SES.x, SES.y);
        return p > 0.001 && <Pin x={s.x} y={s.y} p={p} name="@hrish" i={0} size={84} />;
      })()}
    </div>
  );

  // ---------- shot 4: the gold ring, the Pioneer card, the SuperFan card
  const pinS = scr(SES.x, SES.y);
  const pinHead = { x: pinS.x, y: pinS.y - 70 };
  const ringP = clamp((t - 10.95) / 0.7);
  const cardIn = spring(t, 11.12, 0.62, 0.7), cardOut = inout((t - 13.22) / 0.32);
  const cardV = clamp(cardIn) * (1 - cardOut);
  const C1 = { x: 1416, y: 345, w: 740, h: 340 };
  const c1x = mix(pinHead.x, C1.x, cardIn) , c1y = mix(pinHead.y, C1.y, cardIn);
  const push = 1 + 0.08 * clamp((t - 11.1) / 2.1);
  const c1s = mix(0.06, 1, cardIn) * push;
  const fx = cardOut > 0 ? { x: mix(c1x, pinHead.x, cardOut), y: mix(c1y, pinHead.y, cardOut), s: mix(c1s, 0.05, cardOut) } : { x: c1x, y: c1y, s: c1s };
  const tilt = -20 + 19 * Math.max(0, t - 11.1) + Math.sin((t - 11.1) * 2.2) * 3, tiltX = Math.cos((t - 11.1) * 1.4) * 7;
  const row = (at: number) => { const p = spring(t, at, 0.5, 0.72); return { transform: `translateX(${(1 - p) * 60}px)`, opacity: clamp(p * 1.6) }; };
  const pill = pop(t, 11.45, 0.5);
  const card2In = spring(t, 12.62, 0.55, 0.7), c2 = clamp(card2In) * (1 - cardOut);
  const C2 = { x: 1416, y: 588, w: 680, h: 150 };
  const sparkT = t - 11.95;

  const shot4 = t < 13.6 && (
    <>
      {ringP > 0 && ringP < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 600, borderRadius: 600, border: `${mix(14, 2, ringP)}px solid #E8B94A`,
        transform: `translate(${pinHead.x - 300}px, ${pinHead.y - 300}px) scale(${ease(ringP)})`, opacity: 1 - ringP }} />}
      {ringP > 0 && ringP < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 600, borderRadius: 600, background: "radial-gradient(circle, rgba(255,214,120,0.55), rgba(255,214,120,0) 65%)",
        transform: `translate(${pinHead.x - 300}px, ${pinHead.y - 300}px) scale(${ease(ringP) * 0.9})`, opacity: (1 - ringP) }} />}
      {/* SuperFan card, stacked under */}
      {c2 > 0.001 && <div style={{ position: "absolute", left: 0, top: 0, width: C2.w, height: C2.h, borderRadius: 34, background: S.white, border: `1.5px solid ${S.line}`, boxShadow: SHADOW, fontFamily: SANS,
        transform: `translate(${mix(C1.x, C2.x, card2In) - C2.w / 2 + (fx.x - C1.x) * cardOut}px, ${mix(C1.y + 40, C2.y, card2In) - C2.h / 2 + (fx.y - C1.y) * cardOut}px) perspective(1400px) rotateY(${tilt * 0.8}deg) rotateX(${tiltX}deg) scale(${mix(0.9, 1, clamp(card2In)) * push * (1 - cardOut * 0.95)})`,
        opacity: clamp(c2 * 2), padding: "22px 30px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: S.goldBg, color: S.gold, borderRadius: 40, padding: "6px 18px", fontWeight: 700, fontSize: 26, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8, transform: `scale(${pop(t, 12.8, 0.5)})` }}><Heart s={24} />SUPERFAN</div>
        </div>
        <div style={{ marginTop: 14, fontSize: 30, fontWeight: 600, color: S.ink, ...row(12.9) }}>@hrish is the SuperFan of Málaga, Spain</div>
      </div>}
      {/* the Pioneer title card */}
      {cardV > 0.001 && <div style={{ position: "absolute", left: 0, top: 0, width: C1.w, height: C1.h, borderRadius: 44, background: S.white, border: `1.5px solid ${S.line}`, boxShadow: SHADOW, fontFamily: SANS, overflow: "hidden",
        transform: `translate(${fx.x - C1.w / 2}px, ${fx.y - C1.h / 2}px) perspective(1400px) rotateY(${tilt}deg) rotateX(${tiltX + (1 - clamp(cardIn)) * 30}deg) scale(${fx.s})`, opacity: clamp(cardV * 3), padding: "34px 40px", boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 150, background: "linear-gradient(180deg, rgba(255,243,209,0.9), rgba(255,243,209,0))" }} />
        {/* a light sweep */}
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 260, left: mix(-300, 900, clamp((t - 12.0) / 0.9)), background: "linear-gradient(100deg, transparent, rgba(255,236,180,0.55), transparent)" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ background: S.goldBg, color: S.gold, border: "1.5px solid #F0D68A", borderRadius: 40, padding: "8px 22px", fontWeight: 700, fontSize: 28, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 10, transform: `scale(${pill})`, transformOrigin: "0% 50%" }}><Flag s={28} c={S.gold} />PIONEER</div>
          <div style={{ fontSize: 26, color: S.muted, fontWeight: 600, ...row(11.95) }}>Since 21 Oct 2026</div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, marginTop: 30 }}>
          <div style={{ transform: `scale(${pop(t, 11.55, 0.55)})`, borderRadius: 120, boxShadow: "0 0 0 5px #F2C94C" }}><Avatar name="@hrish" size={110} i={0} /></div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 600, color: S.grey, ...row(11.62) }}>@hrish is the</div>
            <div style={{ fontSize: 50, fontWeight: 700, color: S.ink, letterSpacing: "-0.02em", ...row(11.75) }}>Pioneer of Sesame</div>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, marginTop: 26 }}>
          <div style={{ display: "flex" }}>{[0, 1, 2].map((n) => <div key={n} style={{ width: 40, height: 40, borderRadius: 40, marginLeft: n ? -12 : 0, border: "3px solid #fff", background: ["#7B61FF", "#FF6D00", "#2EB872"][n], transform: `scale(${pop(t, 12.15 + n * 0.1, 0.45)})` }} />)}</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: S.ink, ...row(12.2) }}>Hyped by 3 people</div>
          <div style={{ transform: `scale(${pop(t, 12.5, 0.45)})` }}><Heart s={32} /></div>
        </div>
      </div>}
      {/* gold sparkles */}
      {sparkT > 0 && sparkT < 1.1 && cardOut < 0.1 && Array.from({ length: 16 }, (_, n) => {
        const ang = (n / 16) * Math.PI * 2 + 0.3, d = ease(sparkT / 0.9) * (260 + (n % 3) * 70), s = 10 + (n % 4) * 4;
        return <div key={n} style={{ position: "absolute", left: 0, top: 0, width: s, height: s, borderRadius: n % 2 ? s : 2, background: n % 3 ? "#F2C94C" : "#E8A93A",
          transform: `translate(${C1.x + Math.cos(ang) * (C1.w * 0.42 + d * 0.6) - s / 2}px, ${C1.y + Math.sin(ang) * (C1.h * 0.42 + d * 0.35) - s / 2}px) rotate(${n * 30 + sparkT * 200}deg) scale(${1 - sparkT / 1.1})`, opacity: 1 - sparkT / 1.1 }} />;
      })}
    </>
  );

  // ---------- shot 5 overlays: the buy hint with plot states, the cursor, the state chip
  const hintIn = spring(t, 14.85, 0.6, 0.7), hintOut = inout((t - 16.45) / 0.4);
  const chips: [string, string, string][] = [["Owned", S.blue, S.white], ["My plots", S.green, S.white], ["Listed", S.orange, S.white], ["Wishlisted", S.red, S.white], ["Available", S.white, S.grey]];
  const curP = inout((t - 14.95) / 0.55), curOut = ease((t - 16.42) / 0.4);
  const curFrom = { x: 1760, y: 1010 };
  const cur = { x: mix(curFrom.x, selS.x - 8, curP) + curOut * 260, y: mix(curFrom.y, selS.y - 6, curP) + curOut * 200 };
  const tap = 1 - 0.18 * Math.sin(Math.PI * clamp((t - 15.92) / 0.16));
  const rip = clamp((t - 16.0) / 0.55);
  const chipIn = pop(t, 15.5, 0.5), owned = spring(t, 16.2, 0.45, 0.6), chipOut = ease((t - 16.78) / 0.35);
  const ownedSpark = t - 16.22;

  const shot5 = t > 14.7 && t < 17.2 && (
    <>
      {hintIn > 0.001 && hintOut < 1 && <Glass w={820} h={150} r={36} tint="rgba(255,255,255,0.78)"
        transform={`translate(${1010}px, ${mix(-180, 70, hintIn) - hintOut * 260}px) scale(${mix(0.8, 1, clamp(hintIn))})`}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 30px 0", fontSize: 30, fontWeight: 700, color: S.ink }}>
          <div style={{ transform: `scale(${pop(t, 14.95, 0.45)})` }}><Cursor s={32} /></div>Click anywhere on map to buy!</div>
        <div style={{ display: "flex", gap: 12, padding: "16px 30px 0" }}>
          {chips.map(([l, bg, fg], n) => <div key={l} style={{ background: bg, color: fg, border: bg === S.white ? `1.5px solid ${S.line}` : "none", borderRadius: 30, padding: "6px 18px", fontSize: 26, fontWeight: 700, transform: `scale(${pop(t, 15.05 + n * 0.08, 0.45)})` }}>{l}</div>)}
        </div>
      </Glass>}
      {rip > 0 && rip < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 300, borderRadius: 300, border: `${mix(10, 2, rip)}px solid ${S.blue}`, transform: `translate(${selS.x - 150}px, ${selS.y - 150}px) scale(${mix(0.1, 1, ease(rip))})`, opacity: 1 - rip }} />}
      {chipIn > 0.001 && chipOut < 1 && (() => {
        const w = mix(200, 190, owned), bg = owned > 0.5 ? BTN : S.white;
        return <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 60, borderRadius: 40, background: bg, border: owned > 0.5 ? "none" : `1.5px solid ${S.line}`, boxShadow: SHADOW,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: owned > 0.5 ? S.white : S.grey,
          transform: `translate(${selS.x - w / 2}px, ${selS.y - 150 - chipOut * 40}px) scale(${chipIn * (1 - chipOut)}) scaleY(${owned > 0.02 && owned < 0.98 ? Math.abs(Math.cos(owned * Math.PI)) * 0.9 + 0.1 : 1})`, opacity: 1 - chipOut }}>
          {owned > 0.5 ? <>
            <svg width={26} height={26} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>Owned</> : "Available"}
        </div>;
      })()}
      {ownedSpark > 0 && ownedSpark < 0.8 && Array.from({ length: 10 }, (_, n) => {
        const ang = (n / 10) * Math.PI * 2, d = ease(ownedSpark / 0.6) * 150;
        return <div key={n} style={{ position: "absolute", left: 0, top: 0, width: 12, height: 12, borderRadius: 12, background: n % 2 ? S.violet : S.sky, transform: `translate(${selS.x + Math.cos(ang) * d - 6}px, ${selS.y - 150 + Math.sin(ang) * d * 0.7 - 6}px) scale(${1 - ownedSpark / 0.8})` }} />;
      })}
      {curP > 0 && curOut < 1 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${cur.x}px, ${cur.y}px) scale(${tap})`, opacity: clamp(curP * 4) * (1 - curOut) }}><Cursor s={64} /></div>}
    </>
  );

  // ---------- the Top Plots leaderboard (becomes H2Panel)
  const lbIn = spring(t, 16.55, 0.85, 0.84), m = inout((t - 19.05) / 0.7), cOut = ease((t - 19.02) / 0.42);
  const dT = t - H2;
  const h2rot = `perspective(1800px) rotateY(${Math.sin(dT * 2.4) * 5}deg) rotateX(${Math.cos(dT * 2) * 3}deg) translateY(${Math.sin(dT * 3) * 10}px)`;
  const lbDx = 470 * (1 - m), lbDy = (1 - lbIn) * 1100, lbS = 1, sw = Math.sin(Math.PI * m);
  const rows = [
    { r: "#1", u: "@travellingtexan", pts: 9265, place: "The Metropolitan Museum of Art", city: "New York City", i: 0 },
    { r: "#2", u: "@katya", pts: 8825, place: "Department of Mathematics", city: "North Bergen", i: 1 },
    { r: "#3", u: "@maxwoon", pts: 7826, place: "West 47th Street", city: "New York City", i: 2 },
    { r: "#4", u: "Available", pts: 6400, place: "129 W 20th St", city: "New York", i: 3 },
  ];
  const segP = spring(t, 17.0, 0.5, 0.7);
  const scan = clamp((t - 18.35) / 0.7);

  const board = t > 16.5 && (
    <div style={{ position: "absolute", left: 550, top: 60, width: 820, height: 960, borderRadius: 48, background: S.white, boxShadow: SHADOW, border: `1.5px solid ${S.line}`,
      transform: `translate(${lbDx}px, ${lbDy + Math.sin((t - 16.5) * 2.6) * 14 * (1 - m)}px) scale(${lbS * (1 + 0.07 * sw)}) ${h2rot} rotateY(${Math.sin((t - 16.5) * 1.9) * 7 * (1 - m) - 24 * sw}deg) rotateX(${8 * sw}deg) rotateZ(${Math.sin((t - 16.5) * 1.4) * 1.2 * (1 - m)}deg)`, fontFamily: SANS, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, padding: "40px 48px", boxSizing: "border-box", opacity: 1 - ease((t - 19.2) / 0.3), transform: `translateY(${-cOut * cOut * 60}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, ...{ transform: `translateY(${(1 - spring(t, 16.8, 0.5, 0.72)) * 40}px)`, opacity: clamp((t - 16.8) * 5) } }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: S.goldBg, border: "1.5px solid #F0D68A", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(t, 16.85, 0.5)}) rotate(${(1 - clamp(pop(t, 16.85, 0.5))) * -30}deg)` }}><Trophy s={40} c={S.gold} /></div>
          <div>
            <div style={{ fontSize: 50, fontWeight: 700, color: S.ink, letterSpacing: "-0.03em", lineHeight: 1.05 }}>Top Plots</div>
            <div style={{ fontSize: 27, fontWeight: 500, color: S.muted, marginTop: 4 }}>Where the most happens on SuperWorld</div>
          </div>
        </div>
        {/* All Time | Weekly */}
        <div style={{ position: "relative", marginTop: 24, height: 66, borderRadius: 40, background: S.panel, display: "flex", opacity: clamp((t - 16.95) * 6), transform: `scaleX(${mix(0.85, 1, clamp(segP))})` }}>
          <div style={{ position: "absolute", top: 6, bottom: 6, left: 6, width: "calc(50% - 6px)", borderRadius: 34, background: S.white, boxShadow: "0 2px 8px rgba(26,26,26,0.12)", transform: `translateX(${(1 - segP) * 360}px)` }} />
          {["All Time", "Weekly"].map((l, n) => <div key={l} style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: n === 0 ? S.ink : S.muted }}>{l}</div>)}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {["Near here", "Worldwide"].map((l, n) => <div key={l} style={{ padding: "8px 22px", borderRadius: 30, fontSize: 26, fontWeight: 700, background: n === 0 ? S.blue : S.white, color: n === 0 ? S.white : S.grey, border: n === 0 ? "none" : `1.5px solid ${S.line}`, transform: `scale(${pop(t, 17.12 + n * 0.08, 0.45)})`, transformOrigin: "0% 50%" }}>{l}</div>)}
        </div>
        {rows.map((r, n) => {
          const at = 17.3 + n * 0.2, p = spring(t, at, 0.55, 0.66), roll = ease((t - at) / 0.75), ex = ease((t - 19.02 - n * 0.05) / 0.36);
          const gold = n === 0;
          const glow = n === 0 ? Math.max(0, 1 - Math.abs(scan * 4 - 0.5) * 2) : Math.max(0, 1 - Math.abs(scan * 4 - (n + 0.5)) * 2);
          return <div key={n} style={{ position: "relative", marginTop: 12, height: 136, borderRadius: 28, background: gold ? "linear-gradient(90deg, #FFF8E4, #FFFFFF)" : S.white, border: `1.5px solid ${gold ? "#F0D68A" : S.line}`,
            display: "flex", alignItems: "center", padding: "0 22px", gap: 18, boxSizing: "border-box", transform: `translateY(${(1 - p) * 120 - ex * ex * 260}px) scale(${mix(0.86, 1, clamp(p)) * (1 - 0.12 * ex)})`, opacity: clamp(p * 2.5) * (1 - ex), boxShadow: glow > 0 ? `0 0 0 ${3 * glow}px rgba(39,111,243,${0.35 * glow})` : "none" }}>
            <div style={{ width: 62, height: 44, borderRadius: 22, background: gold ? "#F2C94C" : S.panel, color: gold ? "#5A420A" : S.grey, fontSize: 26, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{r.r}</div>
            {r.u === "Available" ? <div style={{ width: 60, height: 60, borderRadius: 60, border: `3px dashed ${S.soft}`, boxSizing: "border-box", flex: "none" }} /> : <Avatar name={r.u} size={60} i={r.i} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.15, color: r.u === "Available" ? S.green : S.ink }}>{r.u}</div>
                <div style={{ display: "flex", alignItems: "center", fontSize: 32, fontWeight: 700, color: S.ink, fontVariantNumeric: "tabular-nums" }}><Odo v={r.pts * roll} n={r.pts} size={32} /><span style={{ fontSize: 26, color: S.muted, marginLeft: 6 }}>pts</span></div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 600, color: S.grey, marginTop: 2, lineHeight: 1.2, whiteSpace: "nowrap" }}>{r.place}</div>
              <div style={{ fontSize: 26, fontWeight: 500, color: S.muted, lineHeight: 1.2, whiteSpace: "nowrap" }}>{r.city}</div>
            </div>
          </div>;
        })}
      </div>
    </div>
  );

  // ---------- headlines (left column)
  const H = (
    <>
      <Line t={t} at={10.4} out={13.1} dur={0.34} text="Become the" x={112} y={392} size={124} vx={30} vy={-46} sc={0.02} />
      <Line t={t} at={10.62} out={13.2} dur={0.34} text="Pioneer of" x={112} y={524} size={124} vx={30} vy={-46} sc={0.02} accent={[0, 7]} accentColor={S.blue} />
      <Line t={t} at={10.85} out={13.3} dur={0.34} text="your place." x={112} y={656} size={124} vx={30} vy={-46} sc={0.02} />
      <Line t={t} at={13.62} out={18.98} dur={0.42} text="Own a" x={112} y={318} size={136} />
      <Line t={t} at={13.8} out={19.06} dur={0.42} text="piece of" x={112} y={460} size={136} />
      <Line t={t} at={14.0} out={19.14} dur={0.42} text="the map." x={112} y={602} size={136} accent={[4, 7]} accentColor={S.blue} />
    </>
  );

  if (t >= H2 - 0.25) return <AbsoluteFill style={{ overflow: "hidden" }}>{pose.op > 0.002 && mapLayer}{t < 19.95 && H}<H2Panel t={t} /></AbsoluteFill>;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {mapLayer}
      {shot4}
      {shot5}
      {H}
      {board}
    </AbsoluteFill>
  );
};
