// S13 (LEAD): proof on a dot globe. The globe turns to Europe, the K.B tile pins the office (Málaga, from the site's
// footer), light spreads over Europe ("the tech partner European SMEs and startups turn to"), and the two numbers from
// the site roll up: 25 client projects completed, 100+ automations built and integrated. No other claims.
// The globe is a canvas: 13,597 land dots (Natural Earth, public domain; made with the skill's globe_dots.py).
import React, { useLayoutEffect, useRef } from "react";
import GLOBE from "../globe.json";
import { C, E, FONT, GRAD, KBTile, S, SHADOW, Stage, clamp, ease, mix } from "../kit";
import type { HandKey, Scene, Sfx } from "../types";

const D2R = Math.PI / 180;
const NAMES = (GLOBE as any).names as string[], RAW = (GLOBE as any).dots as number[][], N = RAW.length;
const EU = new Set(["Spain", "Portugal", "France", "Germany", "Italy", "Netherlands", "Belgium", "Luxembourg", "Switzerland", "Austria", "United Kingdom", "Ireland", "Denmark", "Norway", "Sweden", "Finland", "Poland", "Czechia", "Slovakia", "Hungary", "Slovenia", "Croatia", "Bosnia and Herz.", "Serbia", "Montenegro", "Albania", "Macedonia", "Greece", "Bulgaria", "Romania", "Moldova", "Ukraine", "Belarus", "Lithuania", "Latvia", "Estonia", "Iceland", "Kosovo", "Cyprus", "Malta", "Andorra"].map((n) => NAMES.indexOf(n)).filter((i) => i > 0));
const vec = (la: number, lo: number) => [Math.cos(la * D2R) * Math.sin(lo * D2R), Math.sin(la * D2R), Math.cos(la * D2R) * Math.cos(lo * D2R)];
const PIN = vec(36.72, -4.42);   // Málaga
const GX = new Float32Array(N), GY = new Float32Array(N), GZ = new Float32Array(N), GD = new Float32Array(N), GE = new Uint8Array(N);
RAW.forEach(([la, lo, c], i) => {
  const v = vec(la, lo); GX[i] = v[0]; GY[i] = v[1]; GZ[i] = v[2];
  GD[i] = Math.acos(Math.max(-1, Math.min(1, v[0] * PIN[0] + v[1] * PIN[1] + v[2] * PIN[2])));   // angle from the pin
  GE[i] = EU.has(c) && lo > -25 && lo < 45 && la > 34 && la < 72 ? 1 : 0;
});
// a tangent frame at the pin, for the rings that spread over the surface
const U = (() => { const n = [-PIN[2], 0, PIN[0]]; const l = Math.hypot(n[0], n[2]); return [n[0] / l, 0, n[2] / l]; })();
const V = [PIN[1] * U[2] - PIN[2] * U[1], PIN[2] * U[0] - PIN[0] * U[2], PIN[0] * U[1] - PIN[1] * U[0]];
type Cam = { lon: number; lat: number };
const rot = (c: Cam, x: number, y: number, z: number) => {
  const cl = Math.cos(c.lon * D2R), sl = Math.sin(c.lon * D2R), cp = Math.cos(c.lat * D2R), sp = Math.sin(c.lat * D2R);
  const x1 = x * cl - z * sl, z0 = z * cl + x * sl;
  return [x1, y * cp - z0 * sp, y * sp + z0 * cp];
};
const NAVY = [41, 58, 81], LIT = [24, 168, 240];
const PAD = 90;

const Globe: React.FC<{ cx: number; cy: number; R: number; cam: Cam; wave: number; rings: { r: number; o: number }[] }> = ({ cx, cy, R, cam, wave, rings }) => {
  const ref = useRef<HTMLCanvasElement>(null), size = 2 * (R + PAD);
  useLayoutEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, size, size);
    const o = R + PAD;
    const halo = ctx.createRadialGradient(o, o, R * 0.97, o, o, R * 1.16);
    halo.addColorStop(0, "rgba(56,200,255,0.22)"); halo.addColorStop(1, "rgba(56,200,255,0)");
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(o, o, R * 1.16, 0, Math.PI * 2); ctx.fill();
    const body = ctx.createRadialGradient(o - R * 0.38, o - R * 0.44, R * 0.05, o, o, R);
    body.addColorStop(0, "#FFFFFF"); body.addColorStop(0.62, "#F1F6FB"); body.addColorStop(1, "#D3DFEC");
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(o, o, R, 0, Math.PI * 2); ctx.fill();
    // the land dots, bucketed by light (6 levels) and limb fade (3 levels): one path per bucket
    const cl = Math.cos(cam.lon * D2R), sl = Math.sin(cam.lon * D2R), cp = Math.cos(cam.lat * D2R), sp = Math.sin(cam.lat * D2R);
    const r0 = R * 0.0062, B: number[][] = Array.from({ length: 18 }, () => []);
    for (let i = 0; i < N; i++) {
      const x = GX[i] * cl - GZ[i] * sl, z0 = GZ[i] * cl + GX[i] * sl, y = GY[i] * cp - z0 * sp, z = GY[i] * sp + z0 * cp;
      if (z <= 0.02) continue;
      const l = GE[i] ? clamp((wave - GD[i]) * 9) : 0, lv = Math.round(l * 5), av = z < 0.14 ? 0 : z < 0.34 ? 1 : 2;
      B[lv * 3 + av].push(o + R * x, o - R * y, r0 * (0.55 + 0.45 * Math.sqrt(z)) * (1 + 0.3 * l));
    }
    B.forEach((b, j) => {
      if (!b.length) return;
      const lv = Math.floor(j / 3) / 5, a = [0.3, 0.62, 0.92][j % 3], col = NAVY.map((c, q) => Math.round(mix(c, LIT[q], lv)));
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`; ctx.beginPath();
      for (let i = 0; i < b.length; i += 3) { ctx.moveTo(b[i] + b[i + 2], b[i + 1]); ctx.arc(b[i], b[i + 1], b[i + 2], 0, Math.PI * 2); }
      ctx.fill();
    });
    // rings spreading over the surface from the pin
    rings.forEach(({ r, o: op }) => {
      if (op <= 0.01 || r <= 0.005) return;
      ctx.lineWidth = Math.max(3, R * 0.012); ctx.lineCap = "round"; ctx.strokeStyle = `rgba(56,200,255,${0.85 * op})`; ctx.beginPath();
      let on = false;
      for (let k = 0; k <= 90; k++) {
        const th = (k / 90) * Math.PI * 2, cr = Math.cos(r), sr = Math.sin(r), ct = Math.cos(th), st = Math.sin(th);
        const p = rot(cam, PIN[0] * cr + (U[0] * ct + V[0] * st) * sr, PIN[1] * cr + (U[1] * ct + V[1] * st) * sr, PIN[2] * cr + (U[2] * ct + V[2] * st) * sr);
        if (p[2] < 0.03) { on = false; continue; }
        if (!on) { ctx.moveTo(o + R * p[0], o - R * p[1]); on = true; } else ctx.lineTo(o + R * p[0], o - R * p[1]);
      }
      ctx.stroke();
    });
  });
  return <canvas ref={ref} width={size} height={size} style={{ position: "absolute", left: cx - R - PAD, top: cy - R - PAD, width: size, height: size }} />;
};

// a rolling number (odometer): each digit is a column that rolls; higher digits roll over with the unit below them
const Roll: React.FC<{ v: number; digits: number; size: number; color: string }> = ({ v, digits, size, color }) => (
  <div style={{ display: "flex", height: size, overflow: "hidden", fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1, color, letterSpacing: "-0.02em" }}>
    {Array.from({ length: digits }, (_, q) => {
      const k = digits - 1 - q, p = v / 10 ** k, w = 1 / 10 ** k, fr = p - Math.floor(p);
      const off = Math.floor(p) + (k === 0 ? fr : ease.inOut(clamp((fr - (1 - w)) / w)));
      const lead = k > 0 && v < 10 ** k - 0.5 ? clamp((v - (10 ** k - 1)) * 2) : 1;   // a leading digit appears as it is reached
      return <div key={q} style={{ width: lead < 0.02 ? 0 : size * 0.64 * Math.max(lead, 0.02), opacity: lead, height: size, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${-(off % 10) * size}px)` }}>
          {Array.from({ length: 11 }, (_, d) => <div key={d} style={{ height: size, width: size * 0.64, textAlign: "center" }}>{d % 10}</div>)}
        </div>
      </div>;
    })}
  </div>
);
const Card: React.FC<{ t: number; t0: number; y: number; to: number; digits: number; plus?: boolean; label: string; grad: string; c0: number; c1: number }> = ({ t, t0, y, to, digits, plus, label, grad, c0, c1 }) => {
  const a = S(t, t0, { damping: 15, stiffness: 150 }), p = E(t, c0, c1 - c0, ease.smooth), v = to * p, pl = S(t, c1 - 0.05, { damping: 11, stiffness: 220 });
  return (
    <div style={{ position: "absolute", left: 1215, top: y, width: 580, height: 290, borderRadius: 34, background: C.white, boxShadow: SHADOW.card, opacity: clamp(a * 1.4), transform: `translateX(${(1 - a) * 150}px) scale(${mix(0.92, 1, a)})`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 44, top: 34, display: "flex", alignItems: "flex-start" }}>
        <Roll v={v} digits={digits} size={150} color={C.navy} />
        {plus && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 110, lineHeight: "150px", marginLeft: 8, background: grad, WebkitBackgroundClip: "text", color: "transparent", transform: `scale(${pl})`, transformOrigin: "20% 60%", opacity: clamp(pl * 2) }}>+</div>}
      </div>
      <div style={{ position: "absolute", left: 46, top: 192, fontFamily: FONT, fontWeight: 600, fontSize: 29, color: C.sub, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ position: "absolute", left: 46, right: 46, bottom: 28, height: 12, borderRadius: 6, background: C.card }}>
        <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 6, background: grad }} />
      </div>
    </div>
  );
};

export const S13: Scene = ({ t }) => {
  // the globe turns to Europe and comes closer while it does (one move: turn + approach), then keeps turning slowly
  const u = clamp((t + 0.3) / 2.3), turn = 1 - (1 - u) ** 2.4, near = E(t, -0.3, 2.1, ease.smooth);
  const cam: Cam = { lon: -116 + 100 * turn + 9.5 * (t + 0.3), lat: mix(14, 47, turn) };
  const R = mix(430, 800, near), CX = mix(650, 610, near), CY = mix(560, 660, near);
  const wave = E(t, 1.05, 1.25, ease.smooth) * 0.9;
  const rings = [1.1, 1.5, 1.9].map((t0) => { const p = clamp((t - t0) / 1.0); return { r: 0.03 + 0.5 * ease.out(p), o: p <= 0 ? 0 : (1 - p) ** 1.3 }; });
  const pv = rot(cam, PIN[0], PIN[1], PIN[2]), px = CX + R * pv[0], py = CY - R * pv[1];
  const drop = S(t, 0.95, { damping: 11, stiffness: 190 }), seen = clamp((pv[2] - 0.1) * 6);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.mint}>
      {/* the globe's soft ground shadow */}
      <div style={{ position: "absolute", left: CX - R * 0.8, top: CY + R * 0.93, width: R * 1.6, height: 90, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(41,58,81,.20), transparent)" }} />
      <Globe cx={CX} cy={CY} R={R} cam={cam} wave={wave} rings={rings} />
      {/* the K.B pin on the office */}
      {seen > 0.01 && drop > 0.001 && (
        <div style={{ position: "absolute", left: px, top: py, opacity: seen * clamp(drop * 3) }}>
          <div style={{ position: "absolute", left: -11, top: -11, width: 22, height: 22, borderRadius: 11, background: C.cyan, border: "4px solid #fff", boxShadow: "0 2px 10px rgba(41,58,81,.35)", transform: `scale(${drop})` }} />
          <div style={{ position: "absolute", left: -3, top: -64 * clamp(drop), width: 6, height: 60 * clamp(drop), borderRadius: 3, background: C.navy }} />
          <KBTile x={0} y={-64 - 52 - (1 - drop) * 170} size={108} style={{ transform: `scale(${mix(0.6, 1, clamp(drop))})`, boxShadow: SHADOW.lift }} />
        </div>
      )}
      <Card t={t} t0={-0.28} y={232} to={25} digits={2} label="Client projects completed" grad={GRAD.brand} c0={0.2} c1={1.5} />
      <Card t={t} t0={-0.12} y={560} to={100} digits={3} plus label="Automations built and integrated" grad={GRAD.growth} c0={0.45} c1={1.9} />
    </Stage>
  );
};
export const S13_HAND: HandKey[] = [];
export const S13_SFX: Sfx[] = [
  { t: 0.0, kind: "whoosh", note: "the globe turns to Europe" },
  { t: 0.98, kind: "pop", note: "the K.B pin drops" },
  { t: 1.5, kind: "tick", note: "25 lands" },
  { t: 1.9, kind: "success", note: "100+ lands" },
];
