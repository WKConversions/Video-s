// Future Unicorn Founders (1920 × 1080, 42.5 s): connections forming in the dark, the search that doesn't find
// anyone, the brand, Málaga and the people it brings together, gatherings, no business-card networking, real
// conversations, and the one conversation that starts something. Brand: charcoal, taupe, cream; a Times-like serif
// with italic accents (the logo and the site). Keyed to the voice's words (src/clock.ts).
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { Line, W, measure } from "./kinetic";
import { ARRIVE, KIT, MOVE, OUT, SOFT, clamp01, lerp } from "./lib";

const SERIF = "Liberation Serif", SANS = "Inter";
KIT.font = SERIF; KIT.serif = SERIF; KIT.strike = "#B9A595";
const INK = "#2B2B2B", CREAM = "#F7F4EF", TAUPE = "#B9A595", TAUPE_D = "#8C7765";
const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);
const s = (pos: string) => T.s(pos);

/** Lines of serif type that build word by word; each line starts on its own label. *word* is set in italic. */
type L = [string, string];
const Para: React.FC<{ g: number; lines: L[]; x: number; y: number; size: number; color: string; accent?: string; out?: string; center?: boolean; lh?: number; strike?: (string | undefined)[] }> =
  ({ g, lines, x, y, size, color, accent = TAUPE, out, center, lh = 1.12, strike = [] }) => (
    <>{lines.map(([label, text], i) => {
      const words: W[] = text.split(" ").map((t, j) => {
        const it = t.startsWith("*");
        return { t: t.replace(/\*/g, ""), at: (s(label) + 0.07 * j).toFixed(3), serif: it, color: it ? accent : undefined, strike: j === 0 ? strike[i] : undefined };
      });
      const w = words.reduce((a, q) => a + measure(q.t, size, 400, -0.02, !!q.serif), 0) + 0.26 * size * (words.length - 1);
      return <Line key={i} g={g} words={words} x={center ? 960 - w / 2 : x} y={y + i * size * lh} size={size} weight={400} color={color} ls={-0.02} out={out} outDur={0.35} />;
    })}</>
  );
const Caps: React.FC<{ t: string; x: number; y: number; o: number; color?: string; size?: number; center?: boolean }> = ({ t, x, y, o, color = TAUPE, size = 22, center }) => (
  <div style={{ position: "absolute", left: center ? 0 : x, right: center ? 0 : undefined, top: y, textAlign: center ? "center" : "left", fontFamily: SANS, fontSize: size, fontWeight: 500, letterSpacing: "0.32em", color, opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>{t}</div>
);
/** A scene's presence: fades in at `a`, out at `b`. */
const vis = (g: number, a: string, b: string) => g < T.f(a) - 15 || g > T.f(b) + 20 ? 0 : k(g, a, 0.5) * (1 - k(g, b, 0.45, OUT));
const Photo: React.FC<{ src: string; x: number; y: number; w: number; h: number; a: number; zoom?: number; pos?: string; radius?: number; shadow?: boolean }> = ({ src, x, y, w, h, a, zoom = 1, pos = "50% 50%", radius = 6, shadow = true }) => a <= 0 ? null : (
  <div style={{ position: "absolute", left: x, top: y + (1 - a) * 40, width: w, height: h, overflow: "hidden", borderRadius: radius, opacity: Math.min(1, a * 1.5), clipPath: `inset(${(1 - a) * 100}% 0 0 0 round ${radius}px)`, boxShadow: shadow ? "0 30px 70px rgba(30,24,18,0.22)" : undefined }}>
    <Img src={staticFile("img/" + src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})` }} />
  </div>
);

// ---- 1-2. connections in the dark, then the search -------------------------------------------------------------------------
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const DOTS = Array.from({ length: 44 }, (_, i) => ({ x: 80 + rnd(i) * 1760, y: 70 + rnd(i + 99) * 940 }));
const EDGES = (() => {
  const e: [number, number, number][] = [];
  DOTS.forEach((p, i) => DOTS.forEach((q, j) => { if (j > i) { const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 270) e.push([i, j, d]); } }));
  return e.sort((a, b) => (DOTS[a[0]].x + DOTS[a[1]].x) - (DOTS[b[0]].x + DOTS[b[1]].x));
})();
const Network: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "open-1", "meet+0.25");
  if (o <= 0) return null;
  const t = g / 30, apart = k(g, "but", 2.4, SOFT), lost = k(g, "but", 0.6, OUT);
  const pos = (i: number) => { const p = DOTS[i]; return { x: 960 + (p.x - 960) * (1 + 0.18 * apart) + Math.sin(t * 0.6 + i) * 6, y: 540 + (p.y - 540) * (1 + 0.18 * apart) + Math.cos(t * 0.5 + i * 1.3) * 6 }; };
  // the one dot looking for its match
  const seek = k(g, "ambitious", 0.4) * (1 - k(g, "meet-0.2", 0.3, OUT)), su = clamp01((t - s("ambitious")) / (s("easy") + 0.4 - s("ambitious")));
  const sx = 960 + Math.sin(su * Math.PI * 1.6) * 520, sy = 600 + Math.sin(su * Math.PI * 2.4 + 0.6) * 260;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {EDGES.map(([i, j], n) => {
          const d = clamp01((t + 0.4 - n * (2.6 / EDGES.length)) / 0.5) * (1 - lost);
          if (d <= 0) return null;
          const a = pos(i), b = pos(j);
          return <line key={n} x1={a.x} y1={a.y} x2={lerp(a.x, b.x, d)} y2={lerp(a.y, b.y, d)} stroke={TAUPE} strokeOpacity={0.45} strokeWidth={1.4} />;
        })}
        {DOTS.map((_, i) => { const p = pos(i); return <circle key={i} cx={p.x} cy={p.y} r={4.5} fill={CREAM} opacity={0.75} />; })}
        {seek > 0 && <>
          <circle cx={sx} cy={sy} r={7} fill={TAUPE} opacity={seek} />
          <circle cx={sx} cy={sy} r={26 + 10 * Math.sin(t * 5)} fill="none" stroke={TAUPE} strokeWidth={2} opacity={0.7 * seek} />
          {DOTS.map((_, i) => { const p = pos(i), d = Math.hypot(p.x - sx, p.y - sy); return d < 200 ? <line key={i} x1={sx} y1={sy} x2={p.x} y2={p.y} stroke={TAUPE} strokeOpacity={0.35 * seek * (1 - d / 200)} strokeWidth={1.2} strokeDasharray="4 6" /> : null; })}
        </>}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: 1080, background: "linear-gradient(90deg, rgba(43,43,43,0.92) 40%, rgba(43,43,43,0))" }} />
      <Caps t="FUTURE UNICORN FOUNDERS" x={140} y={330} o={k(g, "open-0.6", 0.5) * (1 - k(g, "but-0.3", 0.3, OUT))} />
      <Para g={g} lines={[["open-0.35", "Great opportunities start"], ["0.95", "with the right *connections.*"]]} x={136} y={400} size={96} color={CREAM} out="but-0.35" />
      <Para g={g} lines={[["but", "But finding ambitious people"], ["vision-0.3", "who share your vision"], ["easy-0.3", "isn't always *easy.*"]]} x={136} y={360} size={84} color={CREAM} out="meet-0.3" />
    </div>
  );
};

// ---- 3. Meet Future Unicorn Founders --------------------------------------------------------------------------------------------
const Logo: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("meet-0.2") || g > T.f("an+0.6")) return null;
  const r = k(g, "meet-0.1", 0.8, MOVE), o = 1 - k(g, "an-0.1", 0.45, OUT), m = k(g, "future-0.1", 0.9, SOFT);
  return (
    <div style={{ position: "absolute", inset: 0, background: CREAM, clipPath: `circle(${lerp(0, 1150, r)}px at 960px 540px)` }}>
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <div style={{ position: "absolute", left: 470, top: 300, width: 480, height: 480, clipPath: `inset(0 0 ${(1 - m) * 100}% 0)`, transform: `scale(${0.94 + 0.06 * m})` }}>
          <Img src={staticFile("img/unicorn-ink.png")} style={{ width: 480, height: 480 }} />
        </div>
        <Para g={g} lines={[["future", "Future"], ["unicorn", "*Unicorn*"], ["founders", "Founders"]]} x={980} y={350} size={124} color={INK} accent={INK} lh={0.98} />
        <div style={{ position: "absolute", left: 958, top: 340, width: 2, height: lerp(0, 400, k(g, "future", 0.6, MOVE)), background: TAUPE }} />
      </div>
    </div>
  );
};

// ---- 4. Málaga: who it brings together -------------------------------------------------------------------------------------------
const Malaga: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "an-0.25", "through-0.1");
  if (o <= 0) return null;
  const z = 1.04 + 0.1 * clamp01((g / 30 - s("an")) / 7.5);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: INK }}>
      <Img src={staticFile("img/hero-malaga.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", objectPosition: "60% 50%", transform: `scale(${z})`, transformOrigin: "70% 60%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(24,20,17,0.78) 0%, rgba(24,20,17,0.45) 45%, rgba(24,20,17,0) 75%)" }} />
      <Caps t="AN INTERNATIONAL NETWORKING COMMUNITY" x={140} y={190} o={k(g, "an", 0.5)} color="#E6D7C8" />
      <Para g={g} lines={[["founders2", "Founders,"], ["entrepreneurs", "entrepreneurs,"], ["builders", "builders"], ["investors-0.2", "& *investors.*"]]} x={136} y={260} size={100} color={CREAM} accent="#E6D2BE" lh={1.04} out="through-0.4" />
      <Para g={g} lines={[["together", "Together in *Málaga.*"]]} x={136} y={720} size={76} color={CREAM} accent="#E6D2BE" out="through-0.4" />
      <div style={{ position: "absolute", left: 140, top: 830, width: lerp(0, 420, k(g, "malaga", 0.7, MOVE)), height: 1.5, background: "#E6D2BE" }} />
      <Caps t="36.72° N  ·  4.42° W" x={140} y={852} o={k(g, "malaga+0.2", 0.5) * (1 - k(g, "through-0.4", 0.3, OUT))} color="#E6D7C8" size={20} />
    </div>
  );
};

// ---- 5. gatherings and what comes of them -----------------------------------------------------------------------------------------
const CARDS: { src: string; label: string; cap: string; pos?: string }[] = [
  { src: "c-laptop.jpg", label: "ideas", cap: "New ideas *emerge.*" },
  { src: "c-lounge.jpg", label: "partnerships", cap: "Partnerships *form.*" },
  { src: "c-palms.jpg", label: "opportunities", cap: "Opportunities *grow.*", pos: "50% 60%" },
];
const Gatherings: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "through-0.2", "no-0.15");
  if (o <= 0) return null;
  const t = g / 30;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: CREAM }}>
      <Para g={g} lines={[["exclusive", "Exclusive gatherings."], ["meaningful", "*Meaningful conversations.*"]]} x={136} y={110} size={78} color={INK} accent={TAUPE_D} lh={1.08} />
      {CARDS.map((c, i) => {
        const a = k(g, `through+${(0.5 + 0.18 * i).toFixed(2)}`, 0.8, MOVE), on = k(g, c.label, 0.5);
        const x = 136 + i * 568;
        return (
          <React.Fragment key={c.src}>
            <Photo src={c.src} x={x} y={360} w={520} h={470} a={a} zoom={1.04 + 0.06 * clamp01((t - s("through")) / 6)} pos={c.pos} />
            <div style={{ position: "absolute", left: x, top: 858, width: lerp(0, 520, k(g, c.label, 0.6, MOVE)), height: 1.5, background: TAUPE }} />
            {on > 0 && <Para g={g} lines={[[c.label, c.cap]]} x={x} y={880} size={50} color={INK} accent={TAUPE_D} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---- 6. not the usual networking ---------------------------------------------------------------------------------------------------
const NoCards: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "no-0.25", "just-0.1");
  if (o <= 0) return null;
  const t = g / 30;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: INK }}>
      {Array.from({ length: 7 }, (_, i) => {
        const a = k(g, `no+${(0.08 * i).toFixed(2)}`, 0.6), away = k(g, `business+${(0.1 * (6 - i)).toFixed(2)}`, 0.7, OUT);
        const rot = -14 + i * 4.5 + Math.sin(t * 0.8 + i) * 0.6, x = 1180 + i * 22 + away * (900 + i * 60), y = 330 + i * 26 - away * (200 - i * 50);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + (1 - a) * 60, width: 430, height: 250, borderRadius: 12, background: i % 2 ? "#EFE9E1" : CREAM, boxShadow: "0 20px 50px rgba(0,0,0,0.35)", opacity: Math.min(1, a * 1.5) * (1 - away), transform: `rotate(${rot + away * 25}deg)`, padding: "34px 36px", boxSizing: "border-box" }}>
            <div style={{ width: 150, height: 16, borderRadius: 8, background: "#CFC6BB" }} />
            <div style={{ marginTop: 14, width: 220, height: 10, borderRadius: 5, background: "#DDD5CB" }} />
            <div style={{ position: "absolute", left: 36, bottom: 34, width: 180, height: 8, borderRadius: 4, background: "#DDD5CB" }} />
            <div style={{ position: "absolute", left: 36, bottom: 54, width: 130, height: 8, borderRadius: 4, background: "#DDD5CB" }} />
            <div style={{ position: "absolute", right: 36, top: 34, width: 44, height: 44, borderRadius: 22, background: "#D8CFC4" }} />
          </div>
        );
      })}
      <Para g={g} lines={[["no", "No awkward networking."]]} x={136} y={380} size={82} color={CREAM} />
      <div style={{ position: "absolute", left: 130, top: 380 + 50, width: lerp(0, measure("No awkward networking.", 82, 400, -0.02) + 12, k(g, "25.4", 0.45, MOVE)), height: 6, borderRadius: 3, background: TAUPE, transform: "rotate(-1.5deg)" }} />
      <Para g={g} lines={[["no2", "No endless"], ["business-0.1", "business card exchanges."]]} x={136} y={520} size={82} color={CREAM} />
      <div style={{ position: "absolute", left: 130, top: 520 + 82 * 1.12 + 50, width: lerp(0, measure("business card exchanges.", 82, 400, -0.02) + 12, k(g, "business+0.75", 0.45, MOVE)), height: 6, borderRadius: 3, background: TAUPE, transform: "rotate(-1.5deg)" }} />
      <div style={{ position: "absolute", left: 130, top: 520 + 50, width: lerp(0, measure("No endless", 82, 400, -0.02) + 12, k(g, "endless+0.35", 0.4, MOVE)), height: 6, borderRadius: 3, background: TAUPE, transform: "rotate(-1.5deg)" }} />
    </div>
  );
};

// ---- 7. what it is instead ---------------------------------------------------------------------------------------------------------
const Real: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "just-0.25", "because-0.1");
  if (o <= 0) return null;
  const t = g / 30;
  const items: [string, string][] = [["just", "Ambitious *minds.*"], ["real", "Real *conversations.*"], ["connections2", "Connections that *matter.*"]];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: CREAM }}>
      <Photo src="c-terrace.jpg" x={136} y={110} w={640} h={860} a={k(g, "just-0.2", 0.9, MOVE)} zoom={1.03 + 0.07 * clamp01((t - s("just")) / 5)} pos="50% 35%" />
      <Photo src="c-bar.jpg" x={600} y={640} w={330} h={370} a={k(g, "real-0.2", 0.8, MOVE)} zoom={1.05} />
      <Caps t="JUST" x={1010} y={270} o={k(g, "just", 0.5)} color={TAUPE_D} />
      {items.map(([label, text], i) => (
        <React.Fragment key={label}>
          <div style={{ position: "absolute", left: 1010, top: 360 + i * 150, width: lerp(0, 60, k(g, label, 0.5, MOVE)), height: 1.5, background: TAUPE }} />
          <Para g={g} lines={[[i === 0 ? "minds-0.3" : label, text]]} x={1090} y={322 + i * 150} size={74} color={INK} accent={TAUPE_D} />
        </React.Fragment>
      ))}
    </div>
  );
};

// ---- 8. one conversation ----------------------------------------------------------------------------------------------------------
const One: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "because-0.25", "endcard-0.1");
  if (o <= 0) return null;
  const t = g / 30, near = k(g, "because", 2.4, SOFT), meet = k(g, "one", 0.5, MOVE), glow = k(g, "conversation", 0.9);
  const ax = lerp(360, 860, near), bx = lerp(1560, 1060, near), y = 700;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: INK }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {DOTS.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={CREAM} opacity={0.18 * (1 - glow * 0.5)} />)}
        <circle cx={960} cy={y} r={40 + 260 * glow} fill={TAUPE} opacity={0.18 * glow * (1 - glow * 0.6)} />
        <line x1={ax} y1={y} x2={lerp(ax, bx, meet)} y2={y} stroke={TAUPE} strokeWidth={2.5} />
        <circle cx={ax} cy={y + Math.sin(t * 1.4) * 4 * (1 - meet)} r={11} fill={CREAM} />
        <circle cx={bx} cy={y + Math.cos(t * 1.3) * 4 * (1 - meet)} r={11} fill={CREAM} />
      </svg>
      <Para g={g} lines={[["because", "The next big opportunity"], ["34.3", "might start with *one conversation.*"]]} x={0} y={300} size={84} color={CREAM} center />
    </div>
  );
};

// ---- 9. end card ------------------------------------------------------------------------------------------------------------------
const End: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("endcard-0.2")) return null;
  const a = k(g, "endcard-0.1", 0.7, MOVE), m = k(g, "endcard", 1.0, SOFT), btn = k(g, "together2+0.3", 0.5);
  return (
    <div style={{ position: "absolute", inset: 0, background: CREAM, clipPath: `circle(${lerp(0, 1150, a)}px at 960px 540px)` }}>
      <div style={{ position: "absolute", left: 960 - 150, top: 120, width: 300, height: 300, clipPath: `inset(0 0 ${(1 - m) * 100}% 0)` }}>
        <Img src={staticFile("img/unicorn-ink.png")} style={{ width: 300, height: 300 }} />
      </div>
      <Para g={g} lines={[["endcard", "Future *Unicorn* Founders"]]} x={0} y={460} size={92} color={INK} accent={INK} center />
      <div style={{ position: "absolute", left: 960 - lerp(0, 90, k(g, "build-0.3", 0.5, MOVE)), top: 600, width: lerp(0, 180, k(g, "build-0.3", 0.5, MOVE)), height: 1.5, background: TAUPE }} />
      <Para g={g} lines={[["build", "Build what's next, *together.*"]]} x={0} y={640} size={64} color={INK} accent={TAUPE_D} center />
      <div style={{ position: "absolute", left: 960 - 170, top: 790 + (1 - btn) * 16, width: 340, height: 74, borderRadius: 37, background: INK, opacity: btn, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 24, fontWeight: 500, color: CREAM }}>Join the community</div>
      <Caps t="MÁLAGA  ·  INTERNATIONAL" x={0} y={905} o={k(g, "together2+0.6", 0.5)} color={TAUPE_D} size={18} center />
    </div>
  );
};

export const Story: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "absolute", left: -60, top: -60, width: 2040, height: 1200, overflow: "hidden", background: INK }}>
    <div style={{ position: "absolute", left: 60, top: 60, width: 1920, height: 1080 }}>
      <Network g={g} />
      <Logo g={g} />
      <Malaga g={g} />
      <Gatherings g={g} />
      <NoCards g={g} />
      <Real g={g} />
      <One g={g} />
      <End g={g} />
    </div>
  </div>
);
