// Scene G — outro: "A little idea. A whole new world of motion." It starts from the s4 hand-off, the little gradient
// dot alone at the centre. On "a little idea" the dot lifts above its caption, breathes and sends out soft gradient
// ripples (it pulses on "little" and "idea"). On "a whole" it drops back to the centre, gathers and bursts: a white-hot
// bloom and a shock ring, the brand glow rises, and a world of playing film tiles (the demo film at 16:9, 9:16 and 1:1)
// spirals out of it into an orbit around the words "A whole new world of motion" ("motion" in the brand gradient);
// on "world" the camera pulls back and a second, outer ring blooms behind. The world (OutroWorld) runs on into H,
// which flies the tiles out of frame and settles the glow into the landing look.
import React from "react";
import { ARRIVE, C, DEPART, DemoFilm, GDot, Glow, LIN, MOVE, Say, clamp01, f, k, kf, mix } from "../shared";

const CX = 960, CY = 540;
const TAU = Math.PI * 2;

// A quick swell and a softer fall: up frames ARRIVE, down frames MOVE (pulses, surges).
export const bump = (g: number, at: number, up: number, down: number) => kf(g, at, up, ARRIVE) * (1 - kf(g, at + up, down, MOVE));

// The glow through the outro and into the CTA: it rises on "whole" (the world opens) and settles from sH into the
// landing page's exact glow (a 1, rise 0). H adds its click surge and the final accent on top.
export const outroGlow = (g: number) => {
  const up = k(g, "w:whole-0.05", 1.0, MOVE), land = k(g, "sH", 1.3, MOVE);
  return { a: mix(0.78 * up, 1, land), rise: 0.3 * up * (1 - land) };
};

/* ---------- the film tiles ---------- */
const AR = [16 / 9, 9 / 16, 1];
const START = [0.6, 3.6, 7.3, 11.3, 15.6, 19.8];        // a moment into each demo scene, so every tile opens on content
type Tile = { a0: number; ar: number; film: number; size: number };
const INNER: Tile[] = Array.from({ length: 12 }, (_, i) => ({ a0: -Math.PI / 2 + 0.14 + (i * TAU) / 12, ar: AR[[0, 1, 2, 0, 2, 1][i % 6]], film: START[i % 6] + (i >= 6 ? 1.3 : 0), size: 196 }));
const OUTER: Tile[] = Array.from({ length: 12 }, (_, i) => ({ a0: -Math.PI / 2 + ((i + 0.5) * TAU) / 12, ar: AR[[2, 0, 1, 1, 0, 2][i % 6]], film: START[(i + 3) % 6] + 0.7, size: 158 }));

const TileCard: React.FC<{ t: Tile; x: number; y: number; sc: number; o: number; z: number; s: number }> = ({ t, x, y, sc, o, z, s }) => {
  const w = t.size * Math.sqrt(t.ar), h = t.size / Math.sqrt(t.ar);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${sc})`, opacity: o, zIndex: z, borderRadius: 16, overflow: "hidden",
      boxShadow: "0 0 0 3px #fff, 0 26px 44px -22px rgba(38,35,44,0.5)" }}>
      <DemoFilm s={s} w={w} h={h} />
    </div>
  );
};

/* ---------- the outro world: dot, ripples, captions, bloom, orbiting tiles (G, and its exit at the start of H) ---------- */
export const OutroWorld: React.FC<{ g: number; glow?: boolean }> = ({ g, glow = false }) => {
  const s4 = f("s4"), burst = f("w:whole") - 1, sH = f("sH");
  const exit = kf(g, sH, 15, DEPART);                         // H: the world flies out of frame
  if (exit >= 1) return null;
  const gl = outroGlow(g);

  // the little idea: lifts above its caption, breathes, pulses on "little" and "idea", drops back and gathers on "a"
  const lift = k(g, "s4", 0.6, MOVE) * (1 - k(g, "w:a5-0.15", 0.25, MOVE));
  const dotY = mix(CY, 498, lift);
  const pulse = bump(g, f("w:little"), 4, 12) + bump(g, f("w:idea2"), 4, 14) * 1.15;
  const gather = kf(g, f("w:a5") - 3, 5, MOVE);
  const blast = kf(g, burst, 8, ARRIVE);
  const dotR = 14 * (1 + 0.55 * pulse - 0.3 * gather) * (1 + 5 * blast);
  const halo = k(g, "s4", 0.4) * (1 - blast);

  // ripples: a heartbeat from the dot while the idea is little
  const emits = [s4 + 1, f("w:little"), f("w:idea2"), f("w:idea2") + 9, f("w:idea2") + 18, f("w:a5") - 3];
  const rings = emits.map((e) => kf(g, e, 34, ARRIVE)).map((u, i) => ({ u, on: g > emits[i] && u < 1 }));

  // the burst
  const bloom = kf(g, burst, 22, ARRIVE), bloomO = 1 - kf(g, burst, 28, LIN);
  const shock = kf(g, burst, 26, ARRIVE);
  const open = kf(g, burst, 16, MOVE);                        // the paper light behind the words

  // camera on the tiles: close at the bloom, pulls back on "world"
  const cam = mix(1.1, 0.94, k(g, "w:world-0.1", 1.1, MOVE)) * (1 + 0.25 * exit);
  const orbit = (g - burst) / 30;

  const tile = (t: Tile, i: number, outer: boolean) => {
    const st = outer ? f("w:world") - 4 + i * 0.8 : burst + 1 + i * 0.6;
    const e = kf(g, st, outer ? 28 : 22, ARRIVE);
    if (e <= 0) return null;
    const ang = t.a0 + (outer ? -0.1 : 0.17) * orbit - (outer ? 0.5 : 1.15) * (1 - e);
    const rx = outer ? 1240 : 800, ry = outer ? 570 : 352;
    const rho = (outer ? mix(0.62, 1, e) : e) * (1 + 1.5 * exit);
    const d = (Math.sin(ang) + 1) / 2;
    const sc = (outer ? 0.78 : 0.82 + 0.18 * d) * mix(0.12, 1, e) * (1 + 0.3 * exit);
    return <TileCard key={(outer ? "o" : "i") + i} t={t} x={CX + rx * rho * Math.cos(ang)} y={CY + ry * rho * Math.sin(ang)} sc={sc} o={clamp01(e * 4) * (outer ? 0.9 : 1) * (1 - exit)}
      z={Math.round(d * 100) + (outer ? 0 : 200)} s={t.film + (g - burst) / 30} />;
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {glow && <Glow g={g} a={gl.a} rise={gl.rise} />}
      {/* the light the world opens with: paper-bright at the centre, so the words stay crisp on the glow */}
      {open > 0 && <div style={{ position: "absolute", left: CX - 820, top: CY - 380, width: 1640, height: 760, opacity: open * (1 - exit),
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(250,249,247,0.97) 0%, rgba(250,249,247,0.85) 42%, rgba(250,249,247,0) 100%)" }} />}
      {/* ripples and the shock ring */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs><linearGradient id="gOutroRing" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor={C.purple} /><stop offset="0.55" stopColor={C.blue} /><stop offset="1" stopColor={C.cyan} /></linearGradient></defs>
        {rings.map((r, i) => r.on && <circle key={i} cx={CX} cy={dotY} r={18 + 380 * r.u} fill="none" stroke="url(#gOutroRing)" strokeWidth={16 * (1 - r.u) + 3} opacity={0.62 * (1 - r.u)} />)}
        {shock > 0 && shock < 1 && <circle cx={CX} cy={CY} r={20 + 1250 * shock} fill="none" stroke="url(#gOutroRing)" strokeWidth={14 * (1 - shock) + 3} opacity={0.85 * (1 - shock)} />}
      </svg>
      {/* the bloom: the dot bursts open, white-hot centre through purple, blue and cyan */}
      {bloom > 0 && bloomO > 0 && <div style={{ position: "absolute", left: CX - 60 - 900 * bloom, top: CY - 60 - 900 * bloom, width: 120 + 1800 * bloom, height: 120 + 1800 * bloom, borderRadius: "50%", opacity: bloomO,
        background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 16%, rgba(152,42,255,0.5) 32%, rgba(48,71,255,0.38) 48%, rgba(16,219,237,0.22) 62%, rgba(16,219,237,0) 72%)" }} />}
      {/* the orbiting world of films */}
      {g >= burst && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, transformOrigin: `${CX}px ${CY}px` }}>
          {OUTER.map((t, i) => tile(t, i, true))}
          {INNER.map((t, i) => tile(t, i, false))}
        </div>
      )}
      {/* the little idea */}
      {halo > 0 && <div style={{ position: "absolute", left: CX - 110, top: dotY - 110, width: 220, height: 220, borderRadius: "50%", opacity: halo * (0.7 + 0.3 * pulse),
        transform: `scale(${1 + 0.35 * pulse})`, background: "radial-gradient(circle, rgba(84,42,255,0.22) 0%, rgba(84,42,255,0.08) 45%, rgba(84,42,255,0) 70%)" }} />}
      {blast < 1 && <GDot x={CX} y={dotY} r={dotR} o={1 - blast} />}
      <Say g={g} y={566} size={84} out="w:a5-0.2" words={[{ t: "A", at: "w:a4" }, { t: "little", at: "w:little" }, { t: "idea.", at: "w:idea2" }]} />
      <Say g={g} y={404} size={116} out="sH" words={[{ t: "A", at: "w:a5" }, { t: "whole", at: "w:whole" }, { t: "new", at: "w:new2" }, { t: "world", at: "w:world" },
        { t: "of", at: "w:of2", br: true }, { t: "motion.", at: "w:motion2", grad: true }]} />
    </div>
  );
};

export const SceneG: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("s4") || g >= f("sH")) return null;
  return <OutroWorld g={g} glow />;
};
