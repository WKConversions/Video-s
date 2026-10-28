// The Bingua globe ad (1080 × 1920): one dotted Earth, always on screen, turned by a thumb. Every scroll takes you
// somewhere: five stops (Spain, France, Japan, Brazil, Italy), each one lighting up, a reel in its language rising
// out of it and the word you learn landing back on it, with a flight between stops; then every other country lights
// up and the world becomes the app. Keyed to the voice's words (src/clock.ts).
import React, { useLayoutEffect, useRef } from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { Line, W, measure } from "./kinetic";
import { ARRIVE, BinguaIcon, C, FLICK, MOVE, OUT, SOFT, clamp01, lerp, txt } from "./lib";
import { Feed, Page, PAGE, SH, SW, StatusBar, TabBar, TopBar, WordCard, lineTop, wordBox } from "./app";
import GLOBE from "./globe.json";

const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);
const s = (pos: string) => T.s(pos);
const BG = "#F4F6FA";
const B = C.blue;
const D2R = Math.PI / 180;

// ---- flags (round badges) --------------------------------------------------------------------------------------------
type FC = "es" | "fr" | "jp" | "br" | "it";
const FLAG: Record<FC, React.ReactNode> = {
  es: <><rect width="60" height="60" fill="#C60B1E" /><rect y="15" width="60" height="30" fill="#FFC400" /></>,
  fr: <><rect width="20" height="60" fill="#0055A4" /><rect x="20" width="20" height="60" fill="#fff" /><rect x="40" width="20" height="60" fill="#EF4135" /></>,
  jp: <><rect width="60" height="60" fill="#fff" /><circle cx="30" cy="30" r="13" fill="#BC002D" /></>,
  br: <><rect width="60" height="60" fill="#009C3B" /><path d="M30 10 54 30 30 50 6 30z" fill="#FFDF00" /><circle cx="30" cy="30" r="10" fill="#002776" /></>,
  it: <><rect width="20" height="60" fill="#009246" /><rect x="20" width="20" height="60" fill="#fff" /><rect x="40" width="20" height="60" fill="#CE2B37" /></>,
};
const Flag: React.FC<{ c: FC; size: number; style?: React.CSSProperties }> = ({ c, size, style }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "block", borderRadius: "50%", boxShadow: `0 ${size * 0.08}px ${size * 0.2}px rgba(28,28,30,0.25)`, border: `${Math.max(2, size * 0.06)}px solid #fff`, boxSizing: "border-box", flex: "none", ...style }}>
    <defs><clipPath id={`fc-${c}`}><circle cx="30" cy="30" r="30" /></clipPath></defs><g clipPath={`url(#fc-${c})`}>{FLAG[c]}</g>
  </svg>
);

// ---- the five stops -----------------------------------------------------------------------------------------------------
// lon is unwrapped (it only grows, so the globe always turns the same way); vlat is where the camera looks, a little
// south of the country, so the country sits high on the globe above the phone.
type Stop = { c: FC; name: string; lang: string; lon: number; lat: number; vlat: number; country: string; pin: string; up: string; done: string; out: string };
const STOPS: Stop[] = [
  { c: "es", name: "Spain", lang: "Spanish", lon: 716.3, lat: 40.2, vlat: 31.2, country: "Spain", pin: "w:spain-0.15", up: "esUp", done: "esDone", out: "fr" },
  { c: "fr", name: "France", lang: "French", lon: 722.4, lat: 46.6, vlat: 37.6, country: "France", pin: "w:france-0.1", up: "frUp", done: "frDone", out: "jp" },
  { c: "jp", name: "Japan", lang: "Japanese", lon: 858.5, lat: 36.5, vlat: 27.5, country: "Japan", pin: "w:japan", up: "jpUp", done: "jpDone", out: "br" },
  { c: "br", name: "Brazil", lang: "Portuguese", lon: 1029, lat: -12, vlat: -21, country: "Brazil", pin: "w:brazil+0.35", up: "brUp", done: "brDone", out: "it" },
  { c: "it", name: "Italy", lang: "Italian", lon: 1092.5, lat: 42.5, vlat: 33.5, country: "Italy", pin: "w:italy-0.1", up: "itUp", done: "itDone", out: "five" },
];
// flights: [from stop, to stop, start label, landing (s)]
const FLIGHTS: [number, number, number, number][] = [
  [0, 1, s("fr") + 0.2, s("w:france") + 0.1],
  [1, 2, s("jp"), s("w:japan") + 0.25],
  [2, 3, s("br") + 0.05, s("w:brazil") + 0.5],
  [3, 4, s("it"), s("w:italy") + 0.05],
];

// ---- the camera: where the globe looks, how big it is, where it sits ----------------------------------------------------
type K = [number, number, ((x: number) => number)?];
const tk = (t: number, keys: K[]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e = MOVE] = keys[i], [t0, v0] = keys[i - 1];
    if (t < t1) return lerp(v0, v1, e(clamp01((t - t0) / (t1 - t0))));
  }
  return keys[keys.length - 1][1];
};
const LIN = (x: number) => x;
const flightKeys = (get: (st: Stop) => number, drift: number): K[] => {
  const out: K[] = [];
  STOPS.forEach((st, i) => {
    const f = FLIGHTS.find((x) => x[1] === i);
    if (f) out.push([f[2], get(STOPS[f[0]]) + drift], [f[3], get(st), MOVE]);
    else out.push([s("w:spain") - 0.1, get(st), MOVE]);
  });
  return out;
};
const LON: K[] = [
  [-0.35, -60], [0.72, 138.5, ARRIVE], [s("sw2"), 138.5], [s("sw2") + 0.75, 309, ARRIVE], [s("sw3"), 309], [s("sw3") + 0.8, 372, ARRIVE],
  [s("swipe"), 380, LIN],
  ...flightKeys((st) => st.lon, 1.2),
  [s("five"), 1093.7, LIN], [s("five") + 1.2, 1103, MOVE], [s("classroom"), 1118, LIN], [s("endcard"), 1132, LIN],
  [s("spin"), 1136, LIN], [s("spin") + 1.3, 1226, ARRIVE], [46.5, 1232, LIN],
];
const LAT: K[] = [
  [-0.35, 12], [0.72, 30, ARRIVE], [s("sw2"), 30], [s("sw2") + 0.75, -16, ARRIVE], [s("sw3"), -16], [s("sw3") + 0.8, 38, ARRIVE],
  [s("swipe"), 36, LIN],
  ...flightKeys((st) => st.vlat, 0),
  [s("five"), 33.5], [s("five") + 1.2, 31, MOVE], [s("endcard"), 28, LIN], [46.5, 24, LIN],
];
const dip = (base: number, low: (i: number) => number): K[] =>
  FLIGHTS.flatMap(([, , t0, t1], i) => [[t0, base], [(t0 + t1) / 2, low(i), MOVE], [t1, base, MOVE]] as K[]);
const STOP_R = 760, STOP_CY = 830;
const RAD: K[] = [
  [0, 760], [s("meet"), 760], [s("meet") + 0.8, 430, MOVE], [s("swipe") + 0.2, 430], [s("w:spain") - 0.1, STOP_R, MOVE],
  ...dip(STOP_R, (i) => [600, 470, 440, 500][i]),
  [s("five"), STOP_R], [s("five") + 1.2, 470, MOVE], [s("classroom"), 470], [s("classroom") + 0.9, 226, MOVE],
  [s("endcard"), 226], [s("endcard") + 0.9, 560, MOVE],
];
const CY: K[] = [
  [0, 1180], [s("meet"), 1180], [s("meet") + 0.8, 1180, MOVE], [s("swipe") + 0.2, 1180], [s("w:spain") - 0.1, STOP_CY, MOVE],
  ...dip(STOP_CY, () => 930),
  [s("five"), STOP_CY], [s("five") + 1.2, 1150, MOVE], [s("classroom"), 1150], [s("classroom") + 0.9, 1170, MOVE],
  [s("endcard"), 1170], [s("endcard") + 0.9, 1560, MOVE],
];
type Cam = { lon: number; lat: number; R: number; cx: number; cy: number };
const cam = (t: number): Cam => ({ lon: tk(t, LON), lat: tk(t, LAT), R: tk(t, RAD), cx: 540, cy: tk(t, CY) });
/** Orthographic projection of (lon, lat) at height h (1 = the surface); z > 0 faces the viewer. */
const proj = (v: Cam, lon: number, lat: number, h = 1) => {
  const a = lat * D2R, b = (lon - v.lon) * D2R, p = v.lat * D2R;
  const x = Math.cos(a) * Math.sin(b), y0 = Math.sin(a), z0 = Math.cos(a) * Math.cos(b);
  const y = y0 * Math.cos(p) - z0 * Math.sin(p), z = y0 * Math.sin(p) + z0 * Math.cos(p);
  return { x: v.cx + v.R * h * x, y: v.cy - v.R * h * y, z };
};

// ---- the globe (canvas): a shaded sphere, a dot for every 0.9° of land, countries lit in Bingua blue -----------------------
const NAMES = GLOBE.names as string[];
const RAW = GLOBE.dots as number[][];
const N = RAW.length;
const GX = new Float32Array(N), GY = new Float32Array(N), GZ = new Float32Array(N), GC = new Int16Array(N), GLON = new Float32Array(N);
RAW.forEach(([la, lo, c], i) => { const a = la * D2R, b = lo * D2R; GX[i] = Math.cos(a) * Math.sin(b); GY[i] = Math.sin(a); GZ[i] = Math.cos(a) * Math.cos(b); GC[i] = c; GLON[i] = lo; });
const STOP_ID = STOPS.map((st) => NAMES.indexOf(st.country));
const ITALY = (() => { const a = 42.5 * D2R, b = 12.5 * D2R; return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)]; })();
const BASE = [196, 210, 226], LIT = [47, 175, 238];

type Route = { a: Stop; b: Stop; p: number; o: number };
const Globe: React.FC<{ v: Cam; lit: number[]; wave: number; routes: Route[]; plane: { st: Route } | null; clip?: string }> = ({ v, lit, wave, routes, clip }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.translate(60, 60);
    const { R, cx, cy } = v;
    // the sphere: a soft halo of atmosphere, then a lit-from-top-left body
    const halo = ctx.createRadialGradient(cx, cy, R * 0.98, cx, cy, R * 1.12);
    halo.addColorStop(0, "rgba(47,175,238,0.16)"); halo.addColorStop(1, "rgba(47,175,238,0)");
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2); ctx.fill();
    const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.42, R * 0.05, cx, cy, R);
    body.addColorStop(0, "#FFFFFF"); body.addColorStop(0.65, "#F3F7FC"); body.addColorStop(1, "#DCE6F1");
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    // dots, bucketed by colour (9 levels) and limb fade (3 levels) so each bucket is one path
    const cl = Math.cos(v.lon * D2R), sl = Math.sin(v.lon * D2R), cp = Math.cos(v.lat * D2R), sp = Math.sin(v.lat * D2R);
    const r0 = R * 0.0058;
    const buckets: number[][] = Array.from({ length: 27 }, () => []);
    const litById = new Map<number, number>(); STOP_ID.forEach((id, i) => litById.set(id, lit[i]));
    for (let i = 0; i < N; i++) {
      const x = GX[i] * cl - GZ[i] * sl, z0 = GZ[i] * cl + GX[i] * sl;
      const y = GY[i] * cp - z0 * sp, z = GY[i] * sp + z0 * cp;
      if (z <= 0.02) continue;
      let l = litById.get(GC[i]) ?? 0;
      if (GC[i] === STOP_ID[1] && GLON[i] < -20) l = 0; // France's dots in South America (French Guiana) stay grey
      if (wave > 0) { const d = Math.acos(Math.max(-1, Math.min(1, GX[i] * ITALY[0] + GY[i] * ITALY[1] + GZ[i] * ITALY[2]))) / Math.PI; l = Math.max(l, 0.8 * clamp01((wave - d) * 3)); }
      const lv = Math.round(l * 8), av = z < 0.12 ? 0 : z < 0.3 ? 1 : 2;
      buckets[lv * 3 + av].push(cx + R * x, cy - R * y, r0 * (0.5 + 0.5 * Math.sqrt(z)));
    }
    buckets.forEach((b, j) => {
      if (!b.length) return;
      const lv = Math.floor(j / 3) / 8, av = [0.35, 0.7, 1][j % 3];
      const col = BASE.map((c, q) => Math.round(lerp(c, LIT[q], lv)));
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${av})`;
      ctx.beginPath();
      for (let i = 0; i < b.length; i += 3) { ctx.moveTo(b[i] + b[i + 2], b[i + 1]); ctx.arc(b[i], b[i + 1], b[i + 2], 0, Math.PI * 2); }
      ctx.fill();
    });
    // the flight routes: dashed arcs lifted off the surface, drawn as far as the plane has got
    routes.forEach(({ a, b, p, o }) => {
      if (p <= 0 || o <= 0) return;
      ctx.save(); ctx.setLineDash([R * 0.022, R * 0.018]); ctx.lineCap = "round"; ctx.lineWidth = Math.max(3, R * 0.0065);
      ctx.strokeStyle = `rgba(24,157,223,${0.9 * o})`; ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 60; i++) {
        const u = (i / 60) * p, lo = lerp(a.lon, b.lon, u), la = lerp(a.lat, b.lat, u), h = 1 + 0.07 * Math.sin(Math.PI * u) * Math.min(1, Math.abs(b.lon - a.lon) / 30 + 0.4);
        const q = proj(v, lo, la, h), inside = Math.hypot(q.x - cx, q.y - cy) < R;
        if (q.z < 0 && inside) { started = false; continue; }
        if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke(); ctx.restore();
    });
  });
  return <canvas ref={ref} width={1200} height={2040} style={{ position: "absolute", left: -60, top: -60, width: 1200, height: 2040, clipPath: clip }} />;
};
/** Where the plane is on a flight, and which way it points. */
const planeAt = (v: Cam, a: Stop, b: Stop, p: number) => {
  const h = (u: number) => 1 + 0.07 * Math.sin(Math.PI * u) * Math.min(1, Math.abs(b.lon - a.lon) / 30 + 0.4);
  const q = proj(v, lerp(a.lon, b.lon, p), lerp(a.lat, b.lat, p), h(p)), q2 = proj(v, lerp(a.lon, b.lon, p + 0.01), lerp(a.lat, b.lat, p + 0.01), h(p + 0.01));
  return { x: q.x, y: q.y, ang: (Math.atan2(q2.y - q.y, q2.x - q.x) * 180) / Math.PI };
};
const Plane: React.FC<{ x: number; y: number; ang: number; o: number }> = ({ x, y, ang, o }) => o <= 0 ? null : (
  <div style={{ position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 34, background: "#fff", boxShadow: "0 8px 20px rgba(28,28,30,0.22)", opacity: o, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width={40} height={40} viewBox="0 0 24 24" style={{ transform: `rotate(${ang + 45}deg)` }}><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill={B} transform="rotate(-45 12 12)" /></svg>
  </div>
);

// ---- pieces ---------------------------------------------------------------------------------------------------------------
const Phone: React.FC<{ x: number; y: number; sc: number; o?: number; children: React.ReactNode }> = ({ x, y, sc, o = 1, children }) => o <= 0 || sc <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x - 207 * sc, top: y - 434 * sc, width: 414, height: 868, transform: `scale(${sc})`, transformOrigin: "0 0", opacity: o }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: "#111318", boxShadow: "0 30px 80px rgba(28,28,30,0.3)" }} />
    <div style={{ position: "absolute", left: 12, top: 12, width: SW, height: SH, borderRadius: 52, overflow: "hidden", background: C.bg }}>{children}</div>
    <div style={{ position: "absolute", left: 207 - 62, top: 23, width: 124, height: 36, borderRadius: 18, background: "#000" }} />
  </div>
);
const Touch: React.FC<{ x: number; y: number; o: number; press?: number; size?: number }> = ({ x, y, o, press = 0, size = 60 }) => o <= 0 ? null : (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2, background: "rgba(120,120,128,0.35)", border: `${size / 20}px solid rgba(255,255,255,0.95)`, boxSizing: "border-box", opacity: o, transform: `scale(${1 - 0.18 * press})`, zIndex: 50, boxShadow: "0 6px 18px rgba(28,28,30,0.18)" }} />
);
/** A thumb swiping across the globe, right to left, from t0 for dur seconds. */
const swipeTouch = (g: number, t0: number, x0: number, x1: number, y: number, dur = 0.45) => {
  const d = g / 30 - t0;
  if (d < -0.12 || d > dur + 0.12) return null;
  const u = clamp01(d / dur);
  return { x: lerp(x0, x1, FLICK(u)), y: y - 30 * Math.sin(Math.PI * u), o: Math.min(1, (d + 0.12) * 8, (dur + 0.12 - d) * 8) };
};
const Head: React.FC<{ g: number; lines: W[][]; y: number; size?: number; out?: string; color?: string }> = ({ g, lines, y, size = 84, out, color = C.ink }) => (
  <div style={{ position: "absolute", inset: 0, textShadow: `0 0 22px ${BG}, 0 0 8px ${BG}, 0 0 3px ${BG}` }}>
    {lines.map((ws, i) => {
      const w = ws.reduce((a, x) => a + measure(x.t, size, 800, -0.03), 0) + 0.26 * size * (ws.length - 1);
      return <Line key={i} g={g} words={ws} x={540 - w / 2} y={y + i * size * 1.12} size={size} weight={800} color={color} ls={-0.03} out={out} outDur={0.25} />;
    })}
  </div>
);
const w = (t: string, at: string, color?: string): W => ({ t, at, color });
const Chip: React.FC<{ c?: FC; a: string; b?: string; x: number; y: number; sc?: number; o?: number; size?: number }> = ({ c, a, b, x, y, sc = 1, o = 1, size = 40 }) => o <= 0 ? null : (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${sc})`, opacity: o, display: "flex", alignItems: "center", gap: size * 0.32, height: size * 2.2, padding: `0 ${size * 0.7}px 0 ${c ? size * 0.35 : size * 0.7}px`, borderRadius: size * 1.1, background: "#fff", boxShadow: "0 12px 30px rgba(28,28,30,0.16)", whiteSpace: "nowrap" }}>
    {c && <Flag c={c} size={size * 1.45} />}
    <span style={txt(size, 800)}>{a}</span>{b && <span style={txt(size * 0.66, 600, C.grey)}>{b}</span>}
  </div>
);

// ---- the reels (the Bingua app, a page per video) -------------------------------------------------------------------------
const V = {
  seville: "walking-through-the-streets-of-seville-10987.mp4", mime: "mime-in-front-of-the-eiffel-tower-4772.mp4",
  ramen: "a-couple-of-young-aestethic-girls-at-the-japanese-restaurant-51239.mp4", shibuya: "crowds-of-people-cross-a-street-junction-4401.mp4",
  fan: "portrait-of-a-brazilian-fan-watching-the-world-cup-44598.mp4", pizza: "chef-shaping-a-pizza-42469.mp4", rome: "young-women-tourists-sightseeing-in-rome-9118.mp4",
};
type Reel = { pages: Page[]; next?: string; tap: { page: number; line: number; word: string; at: string; card: [string, string, string, string] }; cur: [string, number][]; heart?: string; chip: [string, string]; chipAt: string };
const REELS: Reel[] = [
  { pages: [{ clip: V.seville, at: s("esUp"), offset: 0.5, lines: [["¡Mira qué calle tan bonita!", "Look, what a pretty street!"], ["Vamos a comer unas tapas.", "Let's go and eat some tapas."], ["¡Me encanta Sevilla!", "I love Seville!"]] }],
    tap: { page: 0, line: 0, word: "calle", at: "w:discover", card: ["calle", "street", "NOUN", "a road in a town or city"] },
    cur: [["w:and", 1], ["w:naturally", 2]], chip: ["calle", "street"], chipAt: "esWords" },
  { pages: [{ clip: V.mime, at: s("frUp"), offset: 1, lines: [["Regarde, un mime !", "Look, a mime!"], ["On prend un café après ?", "Shall we get a coffee after?"], ["Avec plaisir !", "With pleasure!"]] }],
    tap: { page: 0, line: 2, word: "plaisir", at: "w:things", card: ["plaisir", "pleasure", "NOUN", "a feeling of happy enjoyment"] },
    cur: [["w:conversations", 1], ["w:new5", 2]], chip: ["plaisir", "pleasure"], chipAt: "w:discover2-0.1" },
  { pages: [{ clip: V.ramen, at: s("jpUp"), offset: 2, lines: [["これ、すごくおいしい！", "This is so delicious!"], ["もう一杯たのもう？", "Shall we order another bowl?"]] },
    { clip: V.shibuya, at: s("jpNext") + 0.1, offset: 3, lines: [["人がいっぱい！", "So many people!"], ["渋谷はいつもにぎやか。", "Shibuya is always lively."]] }],
    next: "jpNext", tap: { page: 0, line: 0, word: "おいしい", at: "w:people", card: ["おいしい", "delicious", "ADJECTIVE", "oishii · tasty"] },
    cur: [["w:saying", 1]], chip: ["おいしい", "delicious"], chipAt: "w:video" },
  { pages: [{ clip: V.fan, at: s("brUp"), offset: 1, pos: "50% 30%", lines: [["Que jogo lindo!", "What a beautiful game!"], ["Vai, Brasil! Gol!", "Come on, Brazil! Goal!"]] }],
    tap: { page: 0, line: 0, word: "lindo", at: "w:portuguese+0.2", card: ["lindo", "beautiful", "ADJECTIVE", "very pretty or lovely"] },
    cur: [["w:content", 1]], heart: "w:love", chip: ["lindo", "beautiful"], chipAt: "w:enjoying" },
  { pages: [{ clip: V.pizza, at: s("itUp"), offset: 0.5, lines: [["Guarda che pizza!", "Look at that pizza!"], ["Fatta a mano, con amore.", "Handmade, with love."]] },
    { clip: V.rome, at: s("itNext") + 0.1, offset: 2, lines: [["Ciao! Di dove siete?", "Hi! Where are you from?"], ["Piacere, io sono Marco.", "Nice to meet you, I'm Marco."]] }],
    next: "itNext", tap: { page: 0, line: 1, word: "amore", at: "w:language2", card: ["amore", "love", "NOUN", "a deep feeling of affection"] },
    cur: [["w:another2", 1]], chip: ["amore", "love"], chipAt: "w:culture+0.1" },
];
const PH = { x: 540, y: 1335, sc: 1.18 };            // the phone at rest during a stop
const SCREEN = { x: PH.x - 207 * PH.sc + 12 * PH.sc, y: PH.y - 434 * PH.sc + 12 * PH.sc };

const StopReel: React.FC<{ g: number; i: number; v: Cam }> = ({ g, i, v }) => {
  const st = STOPS[i], r = REELS[i];
  const up = k(g, st.up, 0.55, ARRIVE), down = k(g, st.out, 0.38, OUT);
  if (up <= 0 || down >= 1) return null;
  const pin = proj(v, st.lon, st.lat);
  const a = up * (1 - down);
  const x = lerp(pin.x, PH.x, a), y = lerp(pin.y, PH.y, a), sc = lerp(0.06, PH.sc, a);
  const nextO = r.next ? k(g, r.next, 0.4, MOVE) : 0;
  let cur = 0, prev = 0;
  for (const [at, n] of r.cur) { cur += k(g, at, 0.35, MOVE) * (n - prev); prev = n; }
  const tp = r.tap, tapT = s(tp.at);
  const tapped = clamp01((g / 30 - tapT) * 6) * (1 - k(g, r.chipAt, 0.25));
  const line = r.pages[tp.page].lines[tp.line][0], wb = wordBox(line, tp.word);
  const ty = PAGE.top + lineTop(tp.line, cur) + 20, tx = 24 + wb.x + wb.w / 2;
  const heart = r.heart ? k(g, r.heart, 0.35) : 0;
  const card = tapped > 0 && nextO < 0.5;
  const xp = 40 + 15 * i + (g > T.f(r.chipAt) ? 10 : 0) + (g > T.f(st.done) ? 5 : 0);
  return (
    <Phone x={x} y={y} sc={sc}>
      <StatusBar />
      <TopBar xp={xp} streak={2 + i} goal={0} />
      <Feed pages={r.pages} offset={nextO} exPage={0} ex={{ cur, hi: { line: tp.line, word: tp.word, pulse: clamp01(1 - Math.abs(g / 30 - tapT + 0.3) * 4), tapped }, heart }} />
      {card && <div style={{ position: "absolute", left: 30, top: Math.max(PAGE.top + 120, ty - 140), zIndex: 12, opacity: tapped, transform: `scale(${0.9 + 0.1 * tapped})` }}><WordCard saved={g > T.f(r.chipAt) ? 1 : 0} tr={k(g, tapT + 0.25, 0.3)} word={tp.card[0]} mean={tp.card[1]} kind={tp.card[2]} def={tp.card[3]} /></div>}
      <TabBar active={0} badge={5 + i + (g > T.f(r.chipAt) ? 1 : 0)} />
      {g > (tapT - 0.35) * 30 && g < (tapT + 0.3) * 30 && <Touch x={tx} y={ty} o={1} press={clamp01(1 - Math.abs(g / 30 - tapT) * 8)} />}
      {r.next && (() => { const d = g / 30 - s(r.next) + 0.08; return d > -0.1 && d < 0.5 ? <Touch x={300} y={lerp(640, 260, FLICK(clamp01(d / 0.4)))} o={Math.min(1, (d + 0.1) * 8, (0.5 - d) * 8)} /> : null; })()}
    </Phone>
  );
};

// ---- on the globe: pins, the words that land, greetings -------------------------------------------------------------------
const StopPin: React.FC<{ g: number; i: number; v: Cam }> = ({ g, i, v }) => {
  const st = STOPS[i];
  const a = k(g, st.pin, 0.45, ARRIVE);
  const p = proj(v, st.lon, st.lat);
  if (a <= 0 || p.z < 0.04) return null;
  const vis = clamp01((p.z - 0.04) * 6) * Math.min(1, a * 1.6);
  const small = k(g, st.out, 0.4, MOVE), size = lerp(96, 44, small), done = k(g, st.done, 0.3);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, opacity: vis }}>
      <div style={{ position: "absolute", left: -11, top: -11, width: 22, height: 22, borderRadius: 11, background: B, border: "4px solid #fff", boxSizing: "border-box", boxShadow: `0 0 0 ${10 * (1 - small)}px rgba(47,175,238,0.22)` }} />
      <div style={{ position: "absolute", left: -size / 2, top: -size - 24 - (1 - a) * 60, transform: `scale(${0.6 + 0.4 * a})`, transformOrigin: "50% 100%" }}>
        <Flag c={st.c} size={size} />
        <div style={{ position: "absolute", left: size / 2 - 7, top: size - 5, width: 14, height: 14, background: "#fff", transform: "rotate(45deg)", borderRadius: 2 }} />
      </div>
      {small < 1 && (
        <div style={{ position: "absolute", left: 66, top: -96 - 31, opacity: (1 - small) * clamp01(a * 2 - 0.6), transform: `scale(${1 + 0.14 * Math.sin(Math.PI * done)})`, transformOrigin: "0 50%",
          height: 62, padding: "0 24px", borderRadius: 31, display: "flex", alignItems: "center", gap: 10, background: done > 0.5 ? B : "#fff", boxShadow: "0 10px 26px rgba(28,28,30,0.18)", ...txt(32, 800, done > 0.5 ? "#fff" : C.ink) }}>
          {done > 0.5 ? <>{st.lang}<svg width={26} height={26} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></> : st.name}
        </div>
      )}
    </div>
  );
};
/** The word you learned flies out of the reel and lands on its country; it goes into the pin when you leave. */
const WordFly: React.FC<{ g: number; i: number; v: Cam }> = ({ g, i, v }) => {
  const st = STOPS[i], r = REELS[i], tp = r.tap;
  const f = k(g, r.chipAt, 0.6, MOVE), gone = k(g, st.out, 0.35, OUT);
  if (f <= 0 || gone >= 1) return null;
  const p = proj(v, st.lon, st.lat);
  const wb = wordBox(r.pages[tp.page].lines[tp.line][0], tp.word);
  const sx = SCREEN.x + (24 + wb.x + wb.w / 2) * PH.sc, sy = SCREEN.y + (PAGE.top + lineTop(tp.line, 0) + 20) * PH.sc;
  const rx = lerp(p.x - 150, p.x, gone), ry = lerp(p.y + 72, p.y, gone);
  return <Chip c={st.c} a={r.chip[0]} b={r.chip[1]} x={lerp(sx, rx, f)} y={lerp(sy, ry, f) - Math.sin(Math.PI * f) * 140} sc={lerp(0.55, 1, f) * (1 - 0.85 * gone)} o={1 - gone} size={32} />;
};
const HOOK: { c: FC; t: string; lon: number; lat: number; from: number; to: number; dx?: number; dy?: number }[] = [
  { c: "jp", t: "こんにちは", lon: 138.5, lat: 36.5, from: 0.55, to: s("sw2") + 0.05 },
  { c: "br", t: "Olá!", lon: 309, lat: -12, from: s("sw2") + 0.55, to: s("sw3") + 0.05 },
  { c: "es", t: "¡Hola!", lon: 356.3, lat: 40.2, from: s("sw3") + 0.6, to: s("meet") + 0.35, dx: -150, dy: 10 },
  { c: "fr", t: "Bonjour !", lon: 362.4, lat: 46.6, from: s("sw3") + 0.72, to: s("meet") + 0.35, dx: -20, dy: -130 },
  { c: "it", t: "Ciao!", lon: 372.5, lat: 42.5, from: s("sw3") + 0.84, to: s("meet") + 0.35, dx: 150, dy: -20 },
];
const GREET: { t: string; lon: number; lat: number }[] = [
  { t: "Hallo", lon: 10.4, lat: 51.1 }, { t: "Hello", lon: -1.5, lat: 52.5 }, { t: "Привет", lon: 37.6, lat: 55.7 }, { t: "Merhaba", lon: 35, lat: 39 },
  { t: "Hej", lon: 15, lat: 61 }, { t: "你好", lon: 104, lat: 35 }, { t: "안녕", lon: 127.8, lat: 36.5 }, { t: "Γειά σου", lon: 22, lat: 39 },
  { t: "Salut", lon: 25, lat: 45.9 }, { t: "Jambo", lon: 37.9, lat: 0 }, { t: "Cześć", lon: 19.1, lat: 52 }, { t: "Hola", lon: -74, lat: 4.6 },
];
const angFromItaly = (lon: number, lat: number) => { const a = lat * D2R, b = lon * D2R; return Math.acos(Math.cos(a) * Math.sin(b) * ITALY[0] + Math.sin(a) * ITALY[1] + Math.cos(a) * Math.cos(b) * ITALY[2]) / Math.PI; };
const WAVE_DUR = 1.6, WAVE_TO = 1.4;
const waveAt = (g: number) => WAVE_TO * k(g, "endless", WAVE_DUR, SOFT);

// ---- the ring of languages that orbits the world --------------------------------------------------------------------------
const RING: { c?: FC; t: string }[] = [
  { c: "es", t: "Hola" }, { t: "Hello" }, { c: "fr", t: "Bonjour" }, { t: "你好" }, { c: "jp", t: "こんにちは" },
  { t: "Hallo" }, { c: "br", t: "Olá" }, { t: "Merhaba" }, { c: "it", t: "Ciao" }, { t: "안녕" },
];
const ringPos = (g: number, v: Cam, j: number) => {
  const inA = k(g, "orbit", 0.7, ARRIVE), outA = k(g, "swipe", 0.5, OUT);
  const rho = v.R * lerp(0.85, 1.3, inA) * (1 + 0.7 * outA), tau = 16 * D2R, roll = -9 * D2R;
  const a = (2 * Math.PI * j) / RING.length + 0.75 * (g / 30 - s("orbit")) + 2.2 * outA;
  const X = rho * Math.cos(a), Z = rho * Math.sin(a), Y = Z * Math.sin(tau);
  const x = X * Math.cos(roll) - Y * Math.sin(roll), y = X * Math.sin(roll) + Y * Math.cos(roll);
  const z = Z * Math.cos(tau) / rho;
  return { x: v.cx + x, y: v.cy + y, z, o: Math.min(1, inA * 1.5) * (1 - outA) };
};
const Ring: React.FC<{ g: number; v: Cam; front: boolean }> = ({ g, v, front }) => {
  if (g < T.f("orbit") || g > T.f("swipe+0.5")) return null;
  return <>{RING.map((r, j) => { const p = ringPos(g, v, j); if ((p.z >= 0) !== front) return null; return <Chip key={j} c={r.c} a={r.t} x={p.x} y={p.y} sc={0.82 + 0.18 * p.z} o={p.o * (front ? 1 : 0.55)} size={34} />; })}</>;
};

// ---- the phone that the world goes into ----------------------------------------------------------------------------------
const FRAME = { x: 540, y: 1130 };
const frameSc = (g: number) => lerp(lerp(1.9, 1.25, k(g, "classroom", 0.9, MOVE)), 2.6, k(g, "endcard", 0.8, MOVE));
const frameO = (g: number) => k(g, "classroom", 0.6) * (1 - k(g, "endcard", 0.6, OUT));
/** The phone's screen as a clip-path, for a layer whose origin is `off` px up and left of the stage's (0, 0). */
const screenClip = (g: number, off: number, W = 1080 + 2 * off, H = 1920 + 2 * off) => {
  if (frameO(g) <= 0) return undefined;
  const sc = frameSc(g), l = FRAME.x - 195 * sc + off, t = FRAME.y - 422 * sc + off, w = SW * sc, h = SH * sc;
  return `inset(${t}px ${W - l - w}px ${H - t - h}px ${l}px round ${52 * sc}px)`;
};
const AppFrame: React.FC<{ g: number }> = ({ g }) => {
  const o = frameO(g), sc = frameSc(g);
  if (o <= 0) return null;
  const flags = STOPS.map((st, i) => ({ c: st.c, a: k(g, `w:world2+${(0.1 * i).toFixed(1)}`, 0.4) }));
  return (
    <div style={{ position: "absolute", left: FRAME.x - 207 * sc, top: FRAME.y - 434 * sc, width: 414, height: 868, transform: `scale(${sc})`, transformOrigin: "0 0", opacity: o }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 64, border: "12px solid #111318", boxSizing: "border-box", boxShadow: "0 30px 80px rgba(28,28,30,0.28)" }} />
      <div style={{ position: "absolute", left: 12, top: 12, width: SW, height: SH, borderRadius: 52, overflow: "hidden" }}>
        <StatusBar />
        <div style={{ position: "absolute", left: 0, top: 0, width: SW }}><TopBar xp={95 + Math.round(20 * k(g, "w:classroom", 0.6))} streak={7} goal={0} /></div>
        <div style={{ position: "absolute", left: 0, top: 112, width: SW, display: "flex", justifyContent: "center", gap: 10 }}>
          {flags.map((f) => <div key={f.c} style={{ opacity: f.a, transform: `translateY(${(1 - f.a) * 14}px) scale(${0.7 + 0.3 * f.a})` }}><Flag c={f.c} size={44} /></div>)}
        </div>
        <div style={{ position: "absolute", left: 0, top: 168, width: SW, textAlign: "center", ...txt(15, 700, C.grey2), opacity: k(g, "w:becomes", 0.4) }}>5 languages · 5 new words</div>
        <TabBar active={0} badge={10} />
      </div>
      <div style={{ position: "absolute", left: 207 - 62, top: 23, width: 124, height: 36, borderRadius: 18, background: "#000" }} />
    </div>
  );
};

// ---- five countries, five languages: the stops collected in a row --------------------------------------------------------
const FiveRow: React.FC<{ g: number }> = ({ g }) => {
  const gone = k(g, "w:endless-0.3", 0.3, OUT);
  if (g < T.f("w:countries-0.2") || gone >= 1) return null;
  return <>{STOPS.map((st, i) => {
    const a = k(g, `w:countries+${(0.09 * i).toFixed(2)}`, 0.45), b = k(g, `w:languages2+${(0.09 * i).toFixed(2)}`, 0.35);
    const x = 540 + (i - 2) * 190;
    return (
      <div key={st.c} style={{ position: "absolute", left: x - 60, top: 400 + (1 - a) * 40 - gone * 30, width: 120, opacity: Math.min(1, a * 2) * (1 - gone), display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * a})` }}><Flag c={st.c} size={112} /></div>
        <div style={{ marginTop: 14, ...txt(27, 800, C.blueD), opacity: b, transform: `translateY(${(1 - b) * 10}px)` }}>{st.lang}</div>
      </div>
    );
  })}</>;
};

// ---- the stage ------------------------------------------------------------------------------------------------------------
const Heads: React.FC<{ g: number }> = ({ g }) => (
  <>
    <Head g={g} lines={[[w("What", "w:what-0.3"), w("if", "w:if"), w("every", "w:every"), w("scroll", "w:scroll", B)], [w("took", "w:took"), w("you", "w:you"), w("somewhere", "w:somewhere"), w("new?", "w:new", B)]]} y={150} size={80} out="w:meet-0.4" />
    <Head g={g} lines={[[w("Your", "w:your"), w("world", "w:world"), w("of", "w:of")], [w("languages,", "w:languages", B)], [w("one", "w:one"), w("swipe", "w:swipe"), w("at", "w:at"), w("a", "w:a"), w("time.", "w:time")]]} y={150} size={76} out="w:first-0.35" />
    <Head g={g} lines={[[w("First", "w:first"), w("stop,", "w:stop")], [w("Spain.", "w:spain", B)]]} y={140} size={96} out="w:watch-0.3" />
    <Head g={g} lines={[[w("Watch", "w:watch"), w("real", "w:real"), w("videos,", "w:videos", B)]]} y={170} size={80} out="w:discover-0.3" />
    <Head g={g} lines={[[w("discover", "w:discover"), w("new", "w:new2"), w("words,", "w:words", B)]]} y={170} size={80} out="w:and-0.25" />
    <Head g={g} lines={[[w("and", "w:and"), w("learn", "w:learn"), w("Spanish", "w:spanish", B)], [w("naturally.", "w:naturally")]]} y={140} size={80} out="w:now-0.3" />
    <Head g={g} lines={[[w("Now,", "w:now"), w("let's", "w:lets"), w("go", "w:go")], [w("to", "w:to"), w("France.", "w:france", B)]]} y={140} size={88} out="w:new3-0.3" />
    <Head g={g} lines={[[w("New", "w:new3"), w("language.", "w:language", B)]]} y={170} size={84} out="w:new4-0.3" />
    <Head g={g} lines={[[w("New", "w:new4"), w("conversations.", "w:conversations", B)]]} y={170} size={80} out="w:new5-0.3" />
    <Head g={g} lines={[[w("New", "w:new5"), w("things", "w:things")], [w("to", "w:to2"), w("discover.", "w:discover2", B)]]} y={140} size={84} out="w:next-0.3" />
    <Head g={g} lines={[[w("Next", "w:next"), w("up,", "w:up")], [w("Japan.", "w:japan", B)]]} y={140} size={96} out="w:understand-0.3" />
    <Head g={g} lines={[[w("Understand", "w:understand"), w("what", "w:what2")], [w("people", "w:people"), w("are", "w:are"), w("saying,", "w:saying", B)]]} y={140} size={80} out="w:one2-0.3" />
    <Head g={g} lines={[[w("one", "w:one2"), w("video", "w:video", B)], [w("at", "w:at2"), w("a", "w:a2"), w("time.", "w:time2")]]} y={140} size={84} out="w:over-0.3" />
    <Head g={g} lines={[[w("Over", "w:over"), w("to", "w:to3")], [w("Brazil.", "w:brazil", B)]]} y={140} size={96} out="w:learn2-0.3" />
    <Head g={g} lines={[[w("Learn", "w:learn2"), w("Portuguese", "w:portuguese", B)], [w("while", "w:while"), w("enjoying", "w:enjoying")], [w("content", "w:content"), w("you", "w:you2"), w("love.", "w:love", B)]]} y={110} size={72} out="w:and2-0.3" />
    <Head g={g} lines={[[w("And", "w:and2"), w("finally,", "w:finally")], [w("Italy.", "w:italy", B)]]} y={140} size={96} out="w:another-0.3" />
    <Head g={g} lines={[[w("Another", "w:another"), w("language.", "w:language2", B)]]} y={170} size={80} out="w:another2-0.2" />
    <Head g={g} lines={[[w("Another", "w:another2"), w("culture.", "w:culture", B)]]} y={170} size={80} out="w:another3-0.25" />
    <Head g={g} lines={[[w("Another", "w:another3"), w("connection.", "w:connection", B)]]} y={170} size={80} out="w:five-0.3" />
    <Head g={g} lines={[[w("Five", "w:five"), w("countries.", "w:countries", B)], [w("Five", "w:five2"), w("languages.", "w:languages2", B)]]} y={170} size={88} out="w:endless-0.3" />
    <Head g={g} lines={[[w("Endless", "w:endless")], [w("possibilities.", "w:possibilities", B)]]} y={170} size={96} out="w:with-0.3" />
    <Head g={g} lines={[[w("With", "w:with"), w("Bingua,", "w:bingua2")], [w("the", "w:the"), w("world", "w:world2"), w("becomes", "w:becomes")], [w("your", "w:your2"), w("classroom.", "w:classroom", B)]]} y={110} size={72} out="w:bingua3-0.3" />
    <Head g={g} lines={[[w("Scroll", "w:scroll2"), w("the", "w:the2"), w("world.", "w:world3")], [w("Speak", "w:speak"), w("its", "w:its"), w("languages.", "w:languages3", B)]]} y={640} size={72} />
  </>
);

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, v = cam(t);
  const lit = STOPS.map((st, i) => {
    const hook = HOOK.filter((h) => h.c === st.c).reduce((m, h) => Math.max(m, clamp01((t - h.from) * 4) * clamp01((h.to - t) * 4 + 1) * (t < h.to + 0.25 ? 1 : 0)), 0);
    return Math.max(k(g, st.pin, 0.6), 0.9 * hook);
  });
  const routes: Route[] = FLIGHTS.map(([a, b, t0, t1]) => ({ a: STOPS[a], b: STOPS[b], p: MOVE(clamp01((t - t0) / (t1 - t0))), o: 1 }));
  const flying = FLIGHTS.map(([a, b, t0, t1]) => ({ a: STOPS[a], b: STOPS[b], u: (t - t0) / (t1 - t0) })).find((f) => f.u > 0 && f.u < 1);
  const wave = waveAt(g);
  const meetA = k(g, "meet", 0.5, ARRIVE), meetO = k(g, "orbit", 0.35, OUT);
  const endA = k(g, "endcard", 0.6, ARRIVE);
  const touches = [swipeTouch(g, -0.2, 860, 300, 1420), swipeTouch(g, s("sw2") - 0.12, 860, 300, 1420), swipeTouch(g, s("sw3") - 0.12, 860, 300, 1420),
    swipeTouch(g, s("swipe") - 0.1, 880, 260, 1400, 0.5), swipeTouch(g, s("spin") - 0.1, 880, 260, 1520, 0.5)].filter(Boolean) as { x: number; y: number; o: number }[];
  return (
    <div style={{ position: "absolute", left: -60, top: -60, width: 1200, height: 2040, overflow: "hidden", background: BG }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 1080, height: 1920 }}>
        <Ring g={g} v={v} front={false} />
        <Globe v={v} lit={lit} wave={wave} routes={routes} plane={null} clip={screenClip(g, 60)} />
        <div style={{ position: "absolute", inset: 0, clipPath: screenClip(g, 0) }}>
          {HOOK.map((h) => {
            const a = clamp01((t - h.from) / 0.3), z = clamp01((h.to - t) / 0.2);
            if (a <= 0 || z <= 0) return null;
            const p = proj(v, h.lon, h.lat); if (p.z < 0.1) return null;
            return <React.Fragment key={h.c}>
              <div style={{ position: "absolute", left: p.x - 10, top: p.y - 10, width: 20, height: 20, borderRadius: 10, background: B, border: "4px solid #fff", boxSizing: "border-box", opacity: a * z }} />
              <Chip c={h.c} a={h.t} x={p.x + (h.dx ?? 0)} y={p.y + (h.dy ?? -70) - (1 - ARRIVE(a)) * 40} sc={(0.6 + 0.4 * ARRIVE(a)) * (0.8 + 0.2 * z)} o={Math.min(1, a * 2) * z} size={h.c === "es" || h.c === "fr" || h.c === "it" ? 30 : 38} />
            </React.Fragment>;
          })}
          {STOPS.map((_, i) => <StopPin key={i} g={g} i={i} v={v} />)}
          {GREET.map((q, j) => {
            const d = angFromItaly(q.lon, q.lat), a = clamp01((wave - d) * 3 - 0.2) * (1 - k(g, "classroom", 0.3, OUT));
            const p = proj(v, q.lon, q.lat); if (a <= 0 || p.z < 0.12) return null;
            return <Chip key={j} a={q.t} x={p.x} y={p.y - 40} sc={0.6 + 0.4 * ARRIVE(a)} o={Math.min(1, a * 2) * clamp01((p.z - 0.12) * 5)} size={26} />;
          })}
          {flying && (() => { const u = MOVE(clamp01(flying.u)), pl = planeAt(v, flying.a, flying.b, u); return <Plane x={pl.x} y={pl.y} ang={pl.ang} o={Math.min(1, flying.u * 8, (1 - flying.u) * 8)} />; })()}
        </div>
        <Ring g={g} v={v} front={true} />
        {STOPS.map((_, i) => <WordFly key={i} g={g} i={i} v={v} />)}
        {STOPS.map((_, i) => <StopReel key={i} g={g} i={i} v={v} />)}
        <AppFrame g={g} />
        {/* Meet Bingua */}
        {meetA > 0 && meetO < 1 && <>
          <div style={{ position: "absolute", left: 540 - 110, top: 250 - (1 - meetA) * 80 - meetO * 60, opacity: Math.min(1, meetA * 2) * (1 - meetO), transform: `scale(${0.7 + 0.3 * meetA})` }}><BinguaIcon size={220} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 500 - meetO * 60, textAlign: "center", ...txt(140, 800), letterSpacing: "-0.04em", opacity: k(g, "w:bingua", 0.35) * (1 - meetO), transform: `translateY(${(1 - k(g, "w:bingua", 0.4)) * 30}px)` }}>Bingua</div>
        </>}
        {/* the end card */}
        {endA > 0 && <>
          <div style={{ position: "absolute", left: 540 - 100, top: 170 + (1 - endA) * 60, opacity: Math.min(1, endA * 2), transform: `scale(${0.7 + 0.3 * endA})` }}><BinguaIcon size={200} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", ...txt(140, 800), letterSpacing: "-0.04em", opacity: k(g, "w:bingua3", 0.35), transform: `translateY(${(1 - k(g, "w:bingua3", 0.4)) * 30}px)` }}>Bingua</div>
          {(() => { const b = k(g, "w:languages3+0.3", 0.5); return b > 0 ? <Img src={staticFile("app-store-badge-white.svg")} style={{ position: "absolute", left: 540 - 190, top: 840 + (1 - b) * 30, width: 380, opacity: b, filter: "drop-shadow(0 10px 24px rgba(28,28,30,0.18))" }} /> : null; })()}
        </>}
        <FiveRow g={g} />
        <Heads g={g} />
        {touches.map((q, i) => <Touch key={i} x={q.x} y={q.y} o={q.o} size={84} />)}
      </div>
    </div>
  );
};
