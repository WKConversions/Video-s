// S3 "The platform connecting creatives, venues, and brands across the Costa del Sol." (3.7-8.75)
// The lone circle splits into three nodes joined by lines; each blooms into a cluster of cards; the clusters shrink and fly onto the curved
// globe, the coast lights up, the camera dives to Málaga, which becomes H.dot (r 18, centre) at 8.75.
import React from "react";
import { C, INOUT, OUT, SOFT, SHADOW, c01, k, mix, sp } from "../kit";
import { GlobeMap } from "../map";
import { CITIES, makeView, View } from "../globe";
import { H } from "../handoff";
import { Scene } from "./types";
import { Brand, BrandCard, CreativeCard, LOCK, VenueCard, WordLine } from "./b1-lib";

const X = [330, 960, 1590], NY = 925, CY = 410, OY = 540, ZS = 1.2;
const MAL = CITIES.find((c) => c.name === "Málaga")!;
const cityLL = (n: string): [number, number] => { const c = CITIES.find((q) => q.name === n)!; return [c.lon, c.lat]; };
const COAST = ["Estepona", "Marbella", "Fuengirola", "Torremolinos", "Málaga", "Nerja"].map(cityLL);
const TARGET = ["Marbella", "Málaga", "Nerja"].map(cityLL);
const DIVE0 = 8.25, DIVE1 = 8.65;

const camAt = (t: number): View => {
  const gIn = k(t, 6.9, 0.8, OUT), p = k(t, DIVE0, DIVE1 - DIVE0, INOUT);
  const base = (2250 + Math.max(0, t - 7) * 260) * mix(0.84, 1, gIn);
  return { lam0: mix(-4.9, MAL.lon, p), phi0: mix(36.9, MAL.lat, p), k: 10, pitch: 38, d: 1.55, S: base * mix(1, 2.3, p), cx: 960, cy: mix(640, 540, p) };
};
const catmull = (P: [number, number][], n = 14): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let j = 0; j < n; j++) { const s = j / n, s2 = s * s, s3 = s2 * s; const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3); out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]); }
  }
  out.push(P[P.length - 1]); return out;
};
const COASTPTS = catmull(COAST);

const Node: React.FC<{ x: number; y: number; r: number; glow?: number; o?: number }> = ({ x, y, r, glow = 1, o = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 2 * r, height: 2 * r, marginLeft: -r, marginTop: -r, borderRadius: "50%", background: C.coral, opacity: o,
    boxShadow: glow > 0.01 ? `0 0 0 4px rgba(22,20,19,0.9), 0 0 ${28 * glow}px rgba(226,90,61,${0.6 * glow})` : undefined, transform: `translate(${x}px, ${y}px)` }} />
);

const BLOOMS = [4.82, 5.78, 6.56];
const Bloom: React.FC<{ t: number; i: number; yc: number; h: number; j: number; children: React.ReactNode }> = ({ t, i, yc, h, j, children }) => {
  const q = sp(t, BLOOMS[i] + 0.12 * j, 1.7, 0.72); if (q <= 0.001) return null;
  return <div style={{ position: "absolute", left: X[i] - 230, top: yc - h / 2, transform: `translate(0px, ${(NY - yc) * (1 - q)}px) scale(${(0.25 + 0.75 * q) * ZS})`, opacity: c01(q * 2.2) }}>{children}</div>;
};

const S3C: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(t), m = makeView(cam);
  const gIn = k(t, 6.9, 0.8, OUT), mapFade = 1 - k(t, 8.38, 0.3, SOFT);
  const hdr = 1 - k(t, 8.3, 0.3, SOFT);
  // nodes
  const split = k(t, 3.84, 0.56, INOUT);
  const fl = [0, 1, 2].map((i) => k(t, 7.12 + 0.06 * i, 0.62, INOUT));
  const tgt = TARGET.map(([lo, la]) => { const [x, y] = m.at(lo, la); return [x, y] as [number, number]; });
  const nodes = [0, 1, 2].map((i) => {
    const bx = mix(960, X[i], split), by = mix(540, NY, split), r0 = mix(LOCK.nodeR, 26, split);
    return { x: mix(bx, tgt[i][0], fl[i]), y: mix(by, tgt[i][1], fl[i]), r: mix(r0, i === 1 ? 14 : 11, fl[i]) };
  });
  // the dive: Málaga's node becomes the dot of the hand-off
  const dv = k(t, DIVE0, DIVE1 - DIVE0, INOUT);
  const midNode = { x: mix(nodes[1].x, H.dot.x, dv), y: mix(nodes[1].y, H.dot.y, dv), r: mix(nodes[1].r, H.dot.r, dv) };
  if (t >= DIVE1) { midNode.x = H.dot.x; midNode.y = H.dot.y; midNode.r = H.dot.r; }
  const sideO = 1 - k(t, 8.3, 0.25);
  // lines
  const lineP = k(t, 4.12, 0.55, OUT), lit = k(t, 6.9, 0.3), lineO = 1 - k(t, 7.55, 0.35);
  const seg = (a: { x: number; y: number }, b: { x: number; y: number }, from: { x: number; y: number }) => ({ x1: from.x, y1: from.y, x2: mix(from.x, b.x, lineP), y2: mix(from.y, b.y, lineP), a });
  const sL = seg(nodes[1], nodes[0], nodes[1]), sR = seg(nodes[1], nodes[2], nodes[1]);
  // pulses
  const pulse = (a: { x: number; y: number }, b: { x: number; y: number }, at: number) => { const p = k(t, at, 0.5, INOUT); return p > 0 && p < 1 ? { x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), o: Math.sin(Math.PI * p) } : null; };
  const pulses = [pulse(nodes[1], nodes[0], 4.22), pulse(nodes[1], nodes[2], 4.3), pulse(nodes[0], nodes[1], 4.62), pulse(nodes[2], nodes[1], 4.7), pulse(nodes[0], nodes[1], 6.9), pulse(nodes[1], nodes[2], 6.98), pulse(nodes[2], nodes[1], 7.2), pulse(nodes[1], nodes[0], 7.28)].filter(Boolean) as { x: number; y: number; o: number }[];
  // clusters
  const group = (i: number): React.CSSProperties => {
    const p = fl[i]; const [tx, ty] = tgt[i];
    return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${X[i]}px ${OY}px`,
      transform: `translate(${mix(0, tx - X[i], p)}px, ${mix(0, ty - OY, p)}px) scale(${mix(1, 0.08, p)})`, opacity: 1 - k(t, 7.12 + 0.06 * i + 0.3, 0.25) };
  };
  const clusterOn = (i: number) => t >= BLOOMS[i] && fl[i] < 0.999 && 1 - k(t, 7.12 + 0.06 * i + 0.3, 0.25) > 0.001;
  // coast
  const coastP = k(t, 7.55, 0.75, INOUT), coastO = 1 - k(t, 8.4, 0.25);
  const cpts = COASTPTS.map(([lo, la]) => m.at(lo, la)).filter((q) => q[2]);
  const cd = cpts.length ? "M" + cpts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("L") : "";
  const ttl = 1 - k(t, 8.3, 0.25);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* the globe */}
      {t >= 6.9 && mapFade > 0.001 && <div style={{ position: "absolute", inset: 0, opacity: gIn * mapFade }}>
        <GlobeMap v={cam} t={t} pins={[]} glow={gIn} />
      </div>}
      {cd && coastP > 0.001 && coastO > 0.001 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: coastO }}>
          <path d={cd} pathLength={1} fill="none" stroke="rgba(226,90,61,0.28)" strokeWidth={22} strokeLinecap="round" strokeDasharray="1 1.01" strokeDashoffset={1 - coastP} />
          <path d={cd} pathLength={1} fill="none" stroke="rgba(226,90,61,0.45)" strokeWidth={10} strokeLinecap="round" strokeDasharray="1 1.01" strokeDashoffset={1 - coastP} />
          <path d={cd} pathLength={1} fill="none" stroke={C.coralL} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 1.01" strokeDashoffset={1 - coastP} />
        </svg>
      )}
      {/* header (the lockup's wordmark) and the lone circle */}
      {t < 8.62 && <div style={{ opacity: hdr }}><Brand t={t} /></div>}
      {/* lines */}
      {t >= 4.0 && lineO > 0.001 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: lineO }}>
          {[sL, sR].map((s, n) => (
            <g key={n}>
              <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="rgba(240,235,225,0.5)" strokeWidth={3} strokeLinecap="round" />
              {lit > 0 && <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={C.coral} strokeWidth={6} strokeLinecap="round" opacity={lit} />}
            </g>))}
        </svg>
      )}
      {pulses.map((p, n) => <div key={n} style={{ position: "absolute", left: 0, top: 0, width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: 11, background: C.cream, opacity: p.o, boxShadow: "0 0 18px 4px rgba(226,90,61,0.8)", transform: `translate(${p.x}px, ${p.y}px)` }} />)}
      {/* ripples around the nodes, and a light running along the coast */}
      {t > 4.35 && t < 7.7 && [0, 1, 2].map((i) => { const ph = (((t - 4.35 + i * 0.3) / 1.0) % 1 + 1) % 1; const f = 1 - fl[i]; return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 2 * nodes[i].r, height: 2 * nodes[i].r, marginLeft: -nodes[i].r, marginTop: -nodes[i].r, borderRadius: "50%", border: "2px solid rgba(226,90,61,0.9)", opacity: (1 - ph) * 0.7 * f, transform: `translate(${nodes[i].x}px, ${nodes[i].y}px) scale(${1 + ph * 2.2})` }} />; })}
      {cpts.length > 3 && t > 7.9 && t < 8.45 && (() => { const q = c01((t - 7.9) / 0.5); const idx = Math.min(cpts.length - 1, Math.floor(q * (cpts.length - 1))); return <div style={{ position: "absolute", left: 0, top: 0, width: 26, height: 26, marginLeft: -13, marginTop: -13, borderRadius: 13, background: C.cream, boxShadow: "0 0 22px 6px rgba(226,90,61,0.8)", opacity: Math.sin(Math.PI * q) * coastO, transform: `translate(${cpts[idx][0]}px, ${cpts[idx][1]}px)` }} />; })()}
      {/* clusters */}
      {clusterOn(0) && <div style={group(0)}>
        <Bloom t={t} i={0} yc={CY - 154 * ZS} h={140} j={0}><CreativeCard name="Javi Ortega" roles="DJ, Producer" city="Marbella" clip="clips/dj-hands.mp4" initials="JO" avail="Weekends" /></Bloom>
        <Bloom t={t} i={0} yc={CY} h={140} j={1}><CreativeCard name="Mateo Ruiz" roles="Videographer" city="Marbella" clip="clips/photog-review.mp4" avatar="img/avatars/mateo.jpg" avail="Weekends" /></Bloom>
        <Bloom t={t} i={0} yc={CY + 154 * ZS} h={140} j={2}><CreativeCard name="Alba Ríos" roles="Painter" city="Granada" clip="clips/paint-canvas.mp4" initials="AR" avail="Most days" /></Bloom>
        <WordLine t={t} size={96} weight={800} color={C.cream} cx={X[0]} cy={775} items={[{ text: "Creatives", at: 4.82 }]} />
      </div>}
      {clusterOn(1) && <div style={group(1)}>
        <Bloom t={t} i={1} yc={CY - 107 * ZS} h={190} j={0}><VenueCard letter="C" name="Casa Brisa" sub="Beach club · Marbella" /></Bloom>
        <Bloom t={t} i={1} yc={CY + 107 * ZS} h={190} j={1}><VenueCard letter="L" name="La Terraza" sub="Rooftop · Málaga" /></Bloom>
        <WordLine t={t} size={96} weight={800} color={C.cream} cx={X[1]} cy={775} items={[{ text: "Venues", at: 5.78 }]} />
      </div>}
      {clusterOn(2) && <div style={group(2)}>
        <Bloom t={t} i={2} yc={CY} h={330} j={0}><BrandCard clip="clips/model-dress.mp4" /></Bloom>
        <WordLine t={t} size={96} weight={800} color={C.cream} cx={X[2]} cy={775} items={[{ text: "Brands", at: 6.56 }]} />
      </div>}
      {/* nodes */}
      {t >= LOCK.cutover && (
        <>
          <Node x={nodes[0].x} y={nodes[0].y} r={nodes[0].r} o={sideO} glow={1 - dv} />
          <Node x={nodes[2].x} y={nodes[2].y} r={nodes[2].r} o={sideO} glow={1 - dv} />
          <Node x={midNode.x} y={midNode.y} r={midNode.r} glow={1 - dv} />
        </>
      )}
      {/* Costa del Sol */}
      {ttl > 0.001 && t > 7.7 && <div style={{ opacity: ttl }}><WordLine t={t} size={112} weight={800} color={C.cream} cx={960} cy={190} items={[{ text: "Costa", at: 7.74 }, { text: "del", at: 7.94 }, { text: "Sol", at: 8.2 }]} /></div>}
    </div>
  );
};
export const S3: Scene = { id: "S3", t0: 3.7, t1: 8.75, C: S3C };
