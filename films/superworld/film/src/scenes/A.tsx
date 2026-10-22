// Segment A (0-10 s): the dot globe dives into the city (line 1), pins drop by kind on the map (line 2), a pin opens
// into Casa Haga's recommendation card and closes back into the map hand-off H1Map (line 3).
import React from "react";
import { AbsoluteFill } from "remotion";
import { S, BTN, SANS, SHADOW, clamp, mix, ease, inout, spring, bounce, CityMap, toScreen, PLACES, Avatar, BounceWords, H1Map, h1Cam, Cam } from "../kit";

const D2R = Math.PI / 180;

// ---------- the dot globe ----------
const BLOBS: [number, number, number][] = [
  [48, -100, 22], [35, -90, 14], [60, -125, 15], [41, -76, 9], [20, -100, 8], [68, -95, 12], [72, -42, 9],
  [-10, -60, 16], [-30, -63, 11], [5, -70, 8],
  [50, 10, 12], [45, 25, 10], [62, 25, 9], [40, -4, 6], [57, 40, 12],
  [8, 20, 20], [-15, 25, 13], [22, 10, 14], [25, 45, 9],
  [50, 90, 25], [30, 80, 14], [25, 105, 12], [62, 130, 16], [35, 135, 6],
  [-25, 134, 11],
];
const isLand = (lat: number, lon: number) => BLOBS.some(([a, b, r]) => {
  const c = Math.sin(lat * D2R) * Math.sin(a * D2R) + Math.cos(lat * D2R) * Math.cos(a * D2R) * Math.cos((lon - b) * D2R);
  return Math.acos(Math.max(-1, Math.min(1, c))) / D2R < r * (0.85 + 0.25 * Math.sin(lat * 0.31 + lon * 0.17));
});
const GN = 2600;
const GPTS = (() => {
  const a: { lat: number; lon: number; land: boolean }[] = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < GN; i++) {
    const y = 1 - (i / (GN - 1)) * 2; const th = ga * i;
    const lat = Math.asin(y) / D2R; const lon = (((th / D2R) % 360) + 360) % 360 - 180;
    a.push({ lat, lon, land: isLand(lat, lon) });
  }
  return a;
})();
const project = (lat: number, lon: number, L: number, B: number) => {
  const cl = Math.cos(lat * D2R), x = cl * Math.sin((lon - L) * D2R), y = Math.sin(lat * D2R), z = cl * Math.cos((lon - L) * D2R);
  const b = B * D2R;
  return { x, y: y * Math.cos(b) - z * Math.sin(b), z: y * Math.sin(b) + z * Math.cos(b) };
};
const viewLon = (t: number) => { const u = clamp((2.65 - t) / 2.65); return -74 + 190 * Math.pow(u, 1.7) + 120 * Math.exp(-t * 3); };
const viewLat = (t: number) => mix(14, 40.7, inout((t - 1.5) / 1.1));

const FRIENDS = [
  { n: "@isla.vuorinen", lat: 60.17, lon: 24.94, i: 1, at: 0.6, side: "r" },
  { n: "@tattiv", lat: 38.72, lon: -9.14, i: 5, at: 1.0, side: "d" },
  { n: "@travellingtexan", lat: 30.27, lon: -97.74, i: 3, at: 1.4, side: "d" },
  { n: "@katya", lat: 40.8, lon: -74.01, i: 4, at: 1.75, side: "u" },
];

const Globe: React.FC<{ t: number; cx: number; cy: number; R: number; fade: number }> = ({ t, cx, cy, R, fade }) => {
  const L = viewLon(t), B = viewLat(t);
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < GPTS.length; i++) {
    const p = GPTS[i]; const q = project(p.lat, p.lon, L, B);
    if (q.z < 0.02) continue;
    const sx = cx + R * q.x, sy = cy - R * q.y, k = 0.45 + 0.55 * q.z;
    dots.push(p.land
      ? <circle key={i} cx={sx} cy={sy} r={R * 0.021 * k} fill={q.z > 0.55 ? S.deep : S.mid} />
      : <circle key={i} cx={sx} cy={sy} r={R * 0.011 * k} fill="#AFC4F0" />);
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: fade }}>
      <circle cx={cx} cy={cy} r={R} fill="#FFFFFF" opacity={0.55} />
      {dots}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#C9D8F6" strokeWidth={2} />
    </svg>
  );
};

// ---------- icons and pins ----------
const Icon: React.FC<{ kind: number; size: number }> = ({ kind, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    {kind === 0 && <path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#fff" />}
    {kind === 1 && <path d="M5 12.5l4.4 4.4L19.2 7" stroke="#fff" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    {kind === 2 && <g fill="none" stroke="#fff" strokeWidth={2.4}><rect x={3} y={7} width={18} height={13} rx={3.5} /><circle cx={12} cy={13.5} r={3.6} /><path d="M8.5 7l1.6-2.6h3.8L15.5 7" strokeLinejoin="round" /></g>}
    {kind === 4 && <g fill="none" stroke="#fff" strokeWidth={2.2}><circle cx={12} cy={12} r={8.6} /><ellipse cx={12} cy={12} rx={3.8} ry={8.6} /><path d="M3.6 12h16.8" /></g>}
    {kind === 9 && <path d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.4 3.5 5 6.9 5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.4 0 5.5 3.4 4.2 6.8C19.5 16.4 12 21 12 21z" fill={S.red} />}
  </svg>
);
const KIND_BG = [S.amber, S.green, S.violet, S.blue, S.sky];
const KPin: React.FC<{ x: number; y: number; p: number; s: number; kind: number; name?: string; i?: number; size?: number }> = ({ x, y, p, s, kind, name, i = 0, size = 80 }) => {
  const sc = Math.max(0, (0.35 + 0.65 * Math.min(1.2, p)) * s);
  const squash = 1 + (1 - clamp(p)) * 0.0 + Math.max(0, p - 1) * 0.5;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: size, height: size * 1.3, transformOrigin: "50% 100%", opacity: clamp(p * 3),
      transform: `translate(${x - size / 2}px, ${y - size * 1.3 - (1 - Math.min(1, p)) * 180}px) scale(${sc / squash}, ${sc * squash})` }}>
      <svg width={size} height={size * 1.3} viewBox="0 0 64 83" style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 8px 10px rgba(26,26,26,0.25))" }}>
        <path d="M32 0 C49.7 0 64 14.3 64 32 C64 52 32 83 32 83 C32 83 0 52 0 32 C0 14.3 14.3 0 32 0 Z" fill={S.white} />
      </svg>
      <div style={{ position: "absolute", left: size * 0.09, top: size * 0.09 }}>
        {name ? <Avatar name={name} size={size * 0.82} i={i} ring={S.white} />
          : <div style={{ width: size * 0.82, height: size * 0.82, borderRadius: size, background: KIND_BG[kind], display: "flex", alignItems: "center", justifyContent: "center" }}><Icon kind={kind} size={size * 0.44} /></div>}
      </div>
      {name && kind === 0 && <div style={{ position: "absolute", right: -size * 0.08, top: -size * 0.06, width: size * 0.38, height: size * 0.38, borderRadius: size, background: S.amber, border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon kind={0} size={size * 0.24} /></div>}
    </div>
  );
};

// ---------- the map camera (2.4 s to the hand-off) ----------
const camMap = (t: number): Cam => {
  const d = ease(clamp((t - 2.4) / 1.3)); const kk = clamp((t - 2.9) / 3.8), g = 0.5 * kk + 0.5 * inout(kk);
  const sw = inout(clamp((t - 2.85) / 1.15));   // the purposeful glide right after the dive lands
  const x = Math.max(0, t - 3.3), L = x - 0.5 * (1 - Math.exp(-x / 0.5));   // then a steady glide, 2+ px a frame
  void g;
  const b: Cam = { cx: mix(1700, 1820, d) + 200 * sw + 150 * L, cy: mix(1120, 1200, d) + 60 * sw + 26 * L, z: mix(0.16, 0.5, d) + 0.28 * sw + 0.025 * L, rot: mix(-42, -12, d) + 14 * sw + 3.2 * L };
  if (t < 8.75) return b;
  const m = inout(clamp((t - 8.75) / 1.0)), h = h1Cam(t);
  return { cx: mix(b.cx, h.cx, m), cy: mix(b.cy, h.cy, m), z: mix(b.z, h.z, m), rot: mix(b.rot ?? 0, 0, m) };
};
const REF = camMap(5.0);
const fromScreen = (sx: number, sy: number, c: Cam) => {
  const a = (-(c.rot ?? 0) * Math.PI) / 180, dx = sx - 960, dy = sy - 540;
  return { x: c.cx + (dx * Math.cos(a) - dy * Math.sin(a)) / c.z, y: c.cy + (dx * Math.sin(a) + dy * Math.cos(a)) / c.z };
};
const CASA = { x: PLACES.cafe.x, y: PLACES.cafe.y };
type PinDef = { x: number; y: number; kind: number; name?: string; i?: number; casa?: boolean };
const PINS: PinDef[] = [
  [430, 540, 0], [0, 0, 0, "@isla.vuorinen", 1, true], [1610, 580, 0],
  [680, 780, 1], [980, 460, 1], [1470, 800, 1],
  [300, 790, 2], [840, 620, 2], [1330, 470, 2],
  [590, 450, 3, "@hrish", 0], [1220, 830, 3, "@katya", 2], [1720, 760, 3, "@maxwoon", 3],
  [1000, 790, 4], [1500, 660, 4], [220, 560, 4],
].map((r) => {
  const [sx, sy, kind, name, i, casa] = r as [number, number, number, string?, number?, boolean?];
  const m = casa ? CASA : fromScreen(sx, sy, REF);
  return { x: m.x, y: m.y, kind, name, i, casa };
});
const KIND_AT = [3.45, 3.95, 4.45, 4.95, 5.45];
const SWITCHES: [number, number][] = [[3.45, 0], [3.95, 1], [4.45, 2], [4.95, 3], [5.45, 4], [5.95, 0]];
const TABS = ["Recs", "Check-ins", "Posts", "People", "Worlds"];

const activeness = (t: number, k: number) => {
  let a = spring(t, KIND_AT[k], 0.4, 0.75) - (k < 4 ? spring(t, KIND_AT[k + 1], 0.4, 0.75) : spring(t, 5.95, 0.4, 0.75));
  if (k === 0) a += spring(t, 5.95, 0.4, 0.75);
  return a;
};

// the segmented control, opening out of a Dynamic-Island capsule
const SegCtl: React.FC<{ t: number }> = ({ t }) => {
  const w = 1120, h = 100, cx = 960, cy = 950;
  const open = bounce(t, 3.2, 0.6) * (1 - spring(t, 6.3, 0.42, 0.9));
  const away = ease(clamp((t - 6.55) / 0.3));
  if (t < 3.05 || away >= 1) return null;
  const appear = bounce(t, 3.08, 0.4);
  const W = mix(180, w, open), H = mix(54, h, open);
  let pos = 0, prev = 0;
  for (const [ts, idx] of SWITCHES) { if (ts === 3.45) { prev = idx; continue; } pos += (idx - prev) * spring(t, ts, 0.42, 0.72); prev = idx; }
  const tw = (w - 16) / 5;
  const stretch = 1 + 0.18 * Math.abs(Math.sin(Math.PI * (pos % 1)));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${cx - w / 2}px, ${cy - h / 2 + away * 160}px) scale(${0.5 + 0.5 * appear})`, opacity: clamp(appear * 2) * clamp(1 - away * 2.4) }}>
      <div style={{ position: "absolute", inset: 0, background: S.ink, clipPath: `inset(${(h - H) / 2}px ${(w - W) / 2}px round ${H / 2}px)`, boxShadow: SHADOW }} />
      <div style={{ position: "absolute", inset: 0, opacity: clamp((open - 0.55) * 3) }}>
        <div style={{ position: "absolute", left: 8 + pos * tw, top: 8, width: tw, height: h - 16, borderRadius: h, background: BTN, transform: `scaleX(${stretch})`, boxShadow: "0 8px 24px -8px rgba(123,97,255,0.7)" }} />
        {TABS.map((l, i) => {
          const on = clamp(1 - Math.abs(pos - i));
          return <div key={l} style={{ position: "absolute", left: 8 + i * tw, top: 8, width: tw, height: h - 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: SANS, fontWeight: 600, fontSize: 30, color: S.white, opacity: 0.55 + 0.45 * on, transform: `scale(${1 + 0.06 * on})` }}>
            <div style={{ width: 30, height: 30, borderRadius: 30, background: KIND_BG[i], display: "flex", alignItems: "center", justifyContent: "center" }}>{i === 3 ? <div style={{ width: 12, height: 12, borderRadius: 12, background: "#fff" }} /> : <Icon kind={i} size={18} />}</div>
            {l}</div>;
        })}
      </div>
    </div>
  );
};

// ---------- the recommendation card ----------
const TAGS = ["Spanish", "The food", "The ambiance", "Terrace", "Cozy", "Groups"];
const Card: React.FC<{ t: number; p: number; px: number; py: number }> = ({ t, p, px, py }) => {
  const W = 800, H = 820;
  const cx = mix(px, 1430, p), cy = mix(py, 540, p), sc = mix(0.08, 1, p);
  const r = mix(400, 44, clamp(p * 1.3));
  const show = clamp((p - 0.45) * 2.2);
  const ry = (1 - p) * -24, rx = (1 - p) * 8;
  const row = (at: number) => { const q = bounce(t, at, 0.55); return { opacity: clamp(q * 2) * show, transform: `translateY(${(1 - q) * 60}px)` }; };
  const heartOn = bounce(t, 7.8, 0.45);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${cx - W / 2}px, ${cy - H / 2}px) perspective(1800px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, background: S.white, clipPath: `inset(0px round ${r}px)`, fontFamily: SANS }}>
        <div style={{ position: "absolute", inset: 0, background: S.white, opacity: 1 - show, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ transform: `scale(${mix(9, 2, clamp(p))})`, opacity: clamp(1 - show * 8) }}><Avatar name="isla" size={60} i={1} /></div></div>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${-250 * inout(clamp((t - 8.0) / 0.8))}px)` }}>
        {/* hero: a prototype of the place */}
        <div style={{ position: "absolute", left: 24, top: 24, width: W - 48, height: 270, borderRadius: 30, overflow: "hidden", background: `linear-gradient(135deg, #FF8A3D 0%, ${S.amber} 100%)`, ...row(6.6) }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: W - 48, height: 70, background: "repeating-linear-gradient(90deg, #fff 0 58px, #FF6D00 58px 116px)", opacity: 0.9, transformOrigin: "50% 0%", transform: `scaleY(${clamp(bounce(t, 6.7, 0.5))})` }} />
          <div style={{ position: "absolute", left: (W - 48) / 2 - 70, top: 105, width: 140, height: 140, borderRadius: 140, background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * bounce(t, 6.75, 0.5)}) rotate(${(1 - bounce(t, 6.75, 0.5)) * -30}deg)` }}>
            <svg width={76} height={76} viewBox="0 0 24 24"><g stroke={S.orange} strokeWidth={2} fill="none" strokeLinecap="round"><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10" /><path d="M17 3c-2 1-3 4-3 7h3v11" /></g></svg>
          </div>
          <div style={{ position: "absolute", left: 22, bottom: 20, padding: "8px 18px", borderRadius: 40, background: "rgba(26,26,26,0.72)", color: "#fff", fontSize: 26, fontWeight: 600 }}>Restaurant</div>
          <div style={{ position: "absolute", right: 22, bottom: 18, width: 66, height: 66, borderRadius: 66, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.25 * Math.sin(Math.PI * clamp((t - 7.8) / 0.35))})` }}>
            <div style={{ opacity: 0.25 + 0.75 * clamp(heartOn) }}><Icon kind={9} size={36} /></div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, top: 320, display: "flex", alignItems: "center", gap: 16, ...row(6.72) }}>
          <Avatar name="isla" size={60} i={1} />
          <div style={{ fontSize: 28, color: S.grey }}><span style={{ fontWeight: 700, color: S.ink }}>@isla.vuorinen</span> recommended</div>
        </div>
        <div style={{ position: "absolute", left: 40, top: 398, fontSize: 70, fontWeight: 700, letterSpacing: "-0.03em", color: S.ink, ...row(6.82) }}>Casa Haga</div>
        <div style={{ position: "absolute", left: 42, top: 490, fontSize: 30, color: S.muted, ...row(6.9) }}>Restaurant</div>
        <div style={{ position: "absolute", left: 40, top: 548, width: W - 80, display: "flex", flexWrap: "wrap", gap: 12 }}>
          {TAGS.map((g, i) => { const q = bounce(t, 7.05 + i * 0.09, 0.45); return (
            <div key={g} style={{ padding: "10px 22px", borderRadius: 40, background: S.panel, border: `1.5px solid ${S.line}`, fontSize: 27, fontWeight: 600, color: S.grey, opacity: clamp(q * 2) * show, transform: `scale(${0.4 + 0.6 * q})` }}>{g}</div>); })}
        </div>
        <div style={{ position: "absolute", left: 40, top: 700, width: W - 80, height: 84, borderRadius: 24, background: "#FFF0F0", display: "flex", alignItems: "center", gap: 16, paddingLeft: 24, ...row(7.7) }}>
          <Icon kind={9} size={38} />
          <div style={{ fontSize: 34, fontWeight: 700, color: S.ink }}>“Love it!”</div>
        </div>
        {[["@katya", 4, "Best terrace in town."], ["@tattiv", 5, "Saving this for Friday."]].map(([n, i, c], k) => (
          <div key={k} style={{ position: "absolute", left: 40, top: 812 + k * 96, width: W - 80, display: "flex", alignItems: "center", gap: 16, ...row(7.9 + k * 0.1) }}>
            <Avatar name={n as string} size={60} i={i as number} />
            <div style={{ fontSize: 28, color: S.grey }}><span style={{ fontWeight: 700, color: S.ink }}>{n}</span> {c}</div>
          </div>))}
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, boxShadow: SHADOW, border: `1.5px solid ${S.line}`, pointerEvents: "none" }} />
      {/* hearts popping out of "Love it!" */}
      {[0, 1, 2, 3, 4].map((k) => {
        const t0 = 7.85 + k * 0.14, a = t - t0; if (a < 0 || a > 1.1) return null;
        const q = bounce(t, t0, 0.4);
        return <div key={k} style={{ position: "absolute", left: 640 + (k - 2) * 30 + a * (k - 2) * 30, top: 200 - a * 210, opacity: clamp((1.1 - a) * 2.5) * show, transform: `scale(${q * (0.9 + 0.2 * (k % 2))}) rotate(${(k - 2) * 12}deg)` }}><Icon kind={9} size={54} /></div>;
      })}
    </div>
  );
};

// ---------- the segment ----------
export const SegA: React.FC<{ t: number }> = ({ t }) => {
  if (t >= 9.75) return <H1Map t={t} />;

  // shot 1: the globe
  const intro = bounce(t, 0.0, 0.7);
  const dv = clamp((t - 2.4) / 0.7), dIn = inout(dv);
  const gs = Math.pow(13, dIn);
  const R = 350 * (0.75 + 0.25 * intro) * (1 + 0.05 * clamp(t / 2.4));
  const gcx = 960, gcy = mix(790, 540, dIn) + (1 - intro) * 150;
  const globeFade = 1 - clamp((dv - 0.25) / 0.45);
  const textOut = inout(clamp((t - 2.3) / 0.45));

  // the map
  const cam = camMap(t);
  const mapOn = t >= 2.45;
  const iris = R * gs;
  const dim = 0.32 * clamp((t - 6.45) / 0.35) * (1 - clamp((t - 8.95) / 0.6));
  const lab = clamp(1 - clamp((t - 6.2) / 0.35) + clamp((t - 9.2) / 0.4));

  // headline 2
  const h2Out = inout(clamp((t - 6.25) / 0.4));
  // card
  const open = spring(t, 6.45, 0.62, 0.78), close = spring(t, 8.95, 0.5, 0.95);
  const cp = open * (1 - close);
  const casaS = toScreen(CASA.x, CASA.y, cam);
  const pinOut = 1 - ease(clamp((t - 9.42) / 0.25));
  // headline 3 exit
  const h3Out = inout(clamp((t - 8.85) / 0.45));

  return (
    <AbsoluteFill>
      {/* glow grows out of the globe */}
      {t < 3.1 && <div style={{ position: "absolute", left: 0, top: 0, width: 1400, height: 1400, borderRadius: 1400, transform: `translate(${gcx - 700}px, ${gcy - 700}px) scale(${(0.7 + 0.3 * intro) * (1 + dIn * 3)})`,
        background: "radial-gradient(circle, rgba(68,198,250,0.42) 0%, rgba(48,126,231,0.22) 32%, rgba(30,58,214,0.08) 48%, rgba(255,250,240,0) 68%)", opacity: globeFade }} />}

      {mapOn && <div style={{ position: "absolute", inset: 0, clipPath: t < 3.2 ? `circle(${iris}px at ${gcx}px ${gcy}px)` : undefined, opacity: clamp((t - 2.45) / 0.2) }}>
        {lab < 1 && <CityMap cam={cam} dim={dim} labels={false} />}
        {lab > 0 && <div style={{ position: "absolute", inset: 0, opacity: lab }}><CityMap cam={cam} dim={dim} /></div>}
      </div>}
      {t < 3.2 && globeFade > 0 && <div style={{ position: "absolute", inset: 0, transform: `translate(${gcx}px, ${gcy}px) scale(${gs}) translate(${-gcx}px, ${-gcy}px)`, transformOrigin: "0 0" }}>
        <Globe t={t} cx={gcx} cy={gcy} R={R} fade={globeFade} />
      </div>}

      {/* friends on the globe */}
      {t < 2.6 && FRIENDS.map((f, k) => {
        const q = project(f.lat, f.lon, viewLon(t), viewLat(t)); const pp = bounce(t, f.at, 0.5);
        if (q.z < 0 || pp <= 0) return null;
        const sx = gcx + R * q.x, sy = gcy - R * q.y, vis = clamp(q.z * 4) * (1 - clamp((t - 2.35) / 0.2));
        const lbl = bounce(t, f.at + 0.1, 0.5);
        const side = f.side, right = side === "r";
        return <div key={f.n} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${sx}px, ${sy}px)`, opacity: vis }}>
          <div style={{ position: "absolute", left: -30, top: -30, transform: `scale(${pp * (0.7 + 0.3 * q.z)})` }}><Avatar name={f.n} size={60} i={f.i} /></div>
          <div style={{ position: "absolute", ...(side === "r" ? { top: -24, left: 40 } : side === "u" ? { top: -96, left: 0 } : { top: 40, left: 0 }), padding: "6px 16px", borderRadius: 30, background: S.white, boxShadow: SHADOW, border: `1.5px solid ${S.line}`,
            fontFamily: SANS, fontWeight: 600, fontSize: 26, color: S.ink, whiteSpace: "nowrap", opacity: clamp(lbl * 2), transform: `${right ? "" : "translateX(-50%) "}scale(${0.5 + 0.5 * lbl})`, transformOrigin: right ? "0% 50%" : side === "u" ? "0% 100%" : "0% 0%" }}>{f.n}</div>
        </div>;
      })}

      {/* line 1 */}
      {t < 2.8 && <div style={{ position: "absolute", inset: 0, transform: `translateY(${-textOut * 260}px) scale(${1 + textOut * 0.35})`, transformOrigin: "50% 20%", opacity: 1 - textOut }}>
        <BounceWords t={t} at={0.15} text="Your world," cx={960} y={96} size={150} />
        <BounceWords t={t} at={0.9} text="mapped by you and your friends." cx={960} y={268} size={92} accentFrom={10} stagger={0.018} />
      </div>}

      {/* shot 2: pins */}
      {t >= 3.4 && t < 9.75 && PINS.map((pd, n) => {
        const j = PINS.filter((q, m) => q.kind === pd.kind && m < n).length;
        const at = KIND_AT[pd.kind] + j * 0.08;
        let p = bounce(t, at, 0.5);
        const act = activeness(t, pd.kind);
        let s = 0.6 + 0.4 * act;
        if (pd.casa) {
          if (cp > 0.02) return null;
          s = s * (1 + 0.25 * Math.sin(Math.PI * clamp((t - 5.95) / 0.35))) * pinOut;
          if (t > 6.9) { s = pinOut * bounce(t, 9.25, 0.4); p = 1; }
        } else {
          const out = ease(clamp((t - 6.3 - (n % 5) * 0.04) / 0.25));
          s *= 1 - out; if (out >= 1) return null;
        }
        const sp = toScreen(pd.x, pd.y, cam);
        return <KPin key={n} x={sp.x} y={sp.y} p={p} s={s} kind={pd.kind} name={pd.name} i={pd.i} size={92} />;
      })}

      {/* headline 2 over a soft cream fade */}
      {t >= 2.85 && t < 6.7 && <>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 540, background: "linear-gradient(180deg, rgba(255,250,240,0.97) 0%, rgba(255,250,240,0.9) 60%, rgba(255,250,240,0) 100%)", opacity: clamp((t - 2.85) / 0.25) * (1 - h2Out) }} />
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${-h2Out * 180}px)`, opacity: 1 - h2Out }}>
          <BounceWords t={t} at={2.95} text="Real places." cx={960} y={100} size={128} />
          <BounceWords t={t} at={3.4} text="Pinned by real people." cx={960} y={236} size={104} accentFrom={10} />
        </div>
      </>}
      {t >= 3.1 && t < 7 && <SegCtl t={t} />}

      {/* shot 3: line 3 and the card */}
      {t >= 6.4 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "linear-gradient(90deg, rgba(255,250,240,0.97) 0%, rgba(255,250,240,0.93) 46%, rgba(255,250,240,0) 64%)", opacity: clamp((t - 6.4) / 0.35) * (1 - clamp((t - 9.0) / 0.45)) }} />}
      {t >= 6.5 && <div style={{ position: "absolute", inset: 0 }}><div style={{ position: "absolute", inset: 0 }}>
        {(() => {
          const g = bounce(t, 6.6, 0.5), o = clamp(h3Out * 1.4);
          return <div style={{ position: "absolute", left: 0, top: 196, width: 1020, display: "flex", justifyContent: "center", opacity: clamp(g * 2) * (1 - o), transform: `translateX(${-o * 600}px) scale(${0.5 + 0.5 * g})` }}>
            <div style={{ padding: "10px 24px", borderRadius: 40, background: S.goldBg, color: S.gold, fontFamily: SANS, fontWeight: 700, fontSize: 28, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 30, background: S.amber, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon kind={0} size={20} /></div>Recs · places people vouch for</div>
          </div>;
        })()}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-h3Out * 760}px)`, opacity: 1 - clamp(h3Out * 1.3) }}>
          <BounceWords t={t} at={6.7} text="Recommend the" cx={500} y={296} size={104} />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-inout(clamp((t - 8.92) / 0.45)) * 760}px)`, opacity: 1 - clamp(inout(clamp((t - 8.92) / 0.45)) * 1.3) }}>
          <BounceWords t={t} at={7.05} text="spots you love." cx={500} y={412} size={104} accentFrom={6} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 590, width: 1020, display: "flex", justifyContent: "center", gap: 16 }}>
          {["Comment", "Share", "Buy the spot"].map((c, i) => {
            const q = bounce(t, 7.6 + i * 0.15, 0.45), o = inout(clamp((t - 8.86 - i * 0.025) / 0.4));
            return <div key={c} style={{ padding: "14px 28px", borderRadius: 50, background: i === 2 ? BTN : S.white, color: i === 2 ? S.white : S.ink, border: i === 2 ? "none" : `1.5px solid ${S.line}`, boxShadow: SHADOW,
              fontFamily: SANS, fontWeight: 600, fontSize: 30, opacity: clamp(q * 2) * (1 - clamp(o * 1.3)), transform: `translateX(${-o * 700}px) translateY(${(1 - q) * 50}px) scale(${0.6 + 0.4 * q})` }}>{c}</div>;
          })}
        </div>
        </div>
        {cp > 0.01 && <Card t={t} p={cp} px={casaS.x} py={casaS.y - 50} />}
      </div>}
    </AbsoluteFill>
  );
};
