// Segment D (30-40 s): "Build your own. No code." (SuperWorld Studio) and the end card.
// 30.00-30.25 H3Gradient unchanged; then the gradient irises down into a Studio app card; template tiles fly in and
// snap into its slots while pins pop on its mini map; the No-code switch flips; "Creators earn". 33.9 the card
// shrinks into the logo mark; the wordmark, tagline and URL build over a rising dot globe that spins to the end.
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  S, GRAD, BTN, SANS, SHADOW, clamp, mix, ease, inout, spring, bounce, Logo, CityMap, Cam, toScreen, PLACES, Pin,
  BounceWords, H3Gradient, AVATAR_COLORS,
} from "../kit";
import { LOGO_PATHS } from "../logo";

// ---- geometry -------------------------------------------------------------------------------------------------
const CX = 1380, CY = 540, CW = 640, CH = 860;          // the Studio card (screen px)
const CL = CX - CW / 2, CT = CY - CH / 2;               // 1060, 110
const HEAD = 160;                                      // gradient header height
const MAPX = 40, MAPY = 190, MAPW = 560, MAPH = 300;    // mini map window (card px)
const SLOT_Y = [512, 596, 680], SLOT_H = 72;           // template slots (card px)
const LOGO_X = 960, LOGO_Y = 176, LOGO = 170;          // end-card logo centre and size
const ICON_Y = 159, ICON_W = 189, MARK0 = 0.62;          // the app icon the card shrinks into (screen), its white S at 0.62 of the logo

const TPL = [
  { name: "Tour", tag: "TOUR", emoji: "🗺️", at: 30.95, place: { x: 1860, y: 960 }, c: "#FF6D00" },
  { name: "Treasure Hunt", tag: "ADVENTURE", emoji: "🧭", at: 31.45, place: { x: 2050, y: 1010 }, c: "#2EB872" },
  { name: "Party World", tag: "MULTIPLAYER", emoji: "🎉", at: 31.95, place: { x: 2210, y: 1090 }, c: "#7B61FF" },
];
const FROM = [ { x: -1250, y: 420, rz: -34, ry: 60 }, { x: -1300, y: 160, rz: 26, ry: 70 }, { x: -1200, y: 560, rz: -22, ry: 55 } ];
const LAND = 0.32;
const MINI_PEOPLE = [ { name: "@hrish", x: 1940, y: 1110, at: 32.7 }, { name: "@katya", x: 2150, y: 930, at: 32.95 }, { name: "@maxwoon", x: 1830, y: 1050, at: 33.2 } ];  // a tile lands about this long after it launches

// a landing squash pulse after time tl
const impact = (t: number, tl: number) => (t < tl || t > tl + 0.22 ? 0 : Math.sin((Math.PI * (t - tl)) / 0.22));

// ---- the mini map camera: glides over Manhattan, then dives into the park --------------------------------------
const miniCam = (t: number): Cam => {
  const g = t - 30.6;
  const dive = inout((t - 32.45) / 1.2);
  return { cx: mix(1500 + g * 420, 2030, dive), cy: mix(1180 - g * 110, 990, dive), z: mix(0.5, 0.8, dive) };
};

// ---- a dot globe (lat/lon rows), seen from the front, spinning about its vertical axis ---------------------------
type Dot = { lat: number; lon: number; land: boolean };
const DOTS: Dot[] = (() => {
  const out: Dot[] = [];
  const step = (1.8 * Math.PI) / 180;
  for (let lat = -Math.PI / 2 + step; lat < Math.PI / 2; lat += step) {
    const n = Math.max(1, Math.round((2 * Math.PI * Math.cos(lat)) / step));
    for (let k = 0; k < n; k++) {
      const lon = (k / n) * 2 * Math.PI;
      // a soft pseudo-continent field
      const f = Math.sin(lon * 2 + 0.6) * Math.cos(lat * 3 - 0.4) + 0.55 * Math.sin(lon * 5 + lat * 4 + 1.3) + 0.35 * Math.cos(lon * 9 - lat * 7);
      out.push({ lat, lon, land: f > 0.0 });
    }
  }
  return out;
})();
const GR = 1050;
const spin = (t: number) => (t - 34) * 0.6;
const project = (lat: number, lon: number, rot: number, gx: number, gy: number) => {
  const l = lon + rot;
  return { x: gx + GR * Math.cos(lat) * Math.sin(l), y: gy - GR * Math.sin(lat), z: Math.cos(lat) * Math.cos(l) };
};
const Globe: React.FC<{ t: number; gy: number; o: number }> = ({ t, gy, o }) => {
  const rot = spin(t);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < DOTS.length; i++) {
    const d = DOTS[i];
    if (d.lat < 0.5) continue;
    const p = project(d.lat, d.lon, rot, 960, gy);
    if (p.z < 0.02 || p.y > 1100) continue;
    const r = (d.land ? 7.5 : 4.4) * (0.6 + 0.4 * p.z);
    items.push(<circle key={i} cx={p.x} cy={p.y} r={r} fill={d.land ? S.blue : "#9DBDF5"} opacity={(d.land ? 0.95 : 0.8) * clamp(p.z * 3)} />);
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      <defs>
        <radialGradient id="dglow" cx="50%" cy="50%" r="50%">
          <stop offset="0.82" stopColor="#DCE8FF" stopOpacity={0.9} />
          <stop offset="1" stopColor="#DCE8FF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={960} cy={gy} r={GR * 1.06} fill="url(#dglow)" />
      <circle cx={960} cy={gy} r={GR} fill="#F4F8FF" stroke="#D5E3FB" strokeWidth={2} />
      {items}
    </svg>
  );
};
const GLOBE_PINS = [
  { name: "@hrish", at: 35.2, lat: 0.9, off: -0.15 },
  { name: "@isla.vuorinen", at: 35.7, lat: 0.74, off: 0.38 },
  { name: "@katya", at: 36.2, lat: 0.84, off: 0.02 },
  { name: "@travellingtexan", at: 36.9, lat: 0.7, off: -0.42 },
  { name: "@maxwoon", at: 37.4, lat: 0.92, off: 0.3 },
  { name: "@sebastian.ramon", at: 37.9, lat: 0.95, off: 0.12 },
  { name: "@alex.alexander", at: 38.4, lat: 0.86, off: -0.3 },
  { name: "@katya", at: 38.9, lat: 0.7, off: 0.2 },
  { name: "@hrish", at: 39.4, lat: 0.8, off: -0.05 },
];

// ---- small UI parts ---------------------------------------------------------------------------------------------
const Tile: React.FC<{ i: number }> = ({ i }) => {
  const d = TPL[i];
  return (
    <div style={{ width: MAPW, height: SLOT_H, borderRadius: 22, background: S.white, border: `1.5px solid ${S.line}`, boxShadow: "0 2px 6px rgba(26,26,26,0.06), 0 18px 40px -18px rgba(26,26,26,0.35)",
      display: "flex", alignItems: "center", padding: "0 18px", boxSizing: "border-box", fontFamily: SANS, gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: S.panel, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flex: "none" }}>{d.emoji}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: S.ink, letterSpacing: "-0.02em", flex: 1, whiteSpace: "nowrap" }}>{d.name}</div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.06em", color: d.c, background: d.c + "1A", borderRadius: 999, padding: "6px 12px", flex: "none" }}>{d.tag}</div>
    </div>
  );
};

const STAR = (() => { let d = ""; for (let k = 0; k < 10; k++) { const r = k % 2 ? 4.2 : 9.5, a = -Math.PI / 2 + (k * Math.PI) / 5; d += (k ? "L" : "M") + (20 + r * Math.cos(a)).toFixed(2) + " " + (20.6 + r * Math.sin(a)).toFixed(2); } return d + "Z"; })();
const Coin: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", flex: "none" }}>
    <defs><linearGradient id="dcoin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE082" /><stop offset="1" stopColor="#FFAB00" /></linearGradient></defs>
    <circle cx={20} cy={20} r={19} fill="url(#dcoin)" />
    <circle cx={20} cy={20} r={14} fill="none" stroke="#FFF3D1" strokeWidth={2} opacity={0.8} />
    <path d={STAR} fill="#FFFFFF" stroke="#E09A00" strokeWidth={1} strokeLinejoin="round" />
  </svg>
);

// the kit's BounceWords, with each letter on its own compositor layer (no pixel stepping while letters settle)
const BW: React.FC<{ t: number; at: number; text: string; cx: number; y: number; size: number; color?: string; stagger?: number; weight?: number }> = ({ t, at, text, cx, y, size, color = S.ink, stagger = 0.022, weight = 700 }) => (
  <div style={{ position: "absolute", left: cx - 1600, top: y, width: 3200, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: "-0.03em", whiteSpace: "pre", lineHeight: 1.05 }}>
    {text.split("").map((ch, i) => { const p = bounce(t, at + i * stagger, 0.5); return <span key={i} style={{ display: "inline-block", willChange: "transform", transform: `translate3d(0, ${(1 - p) * size * 0.7}px, 0) scale(${0.55 + 0.45 * p})`, opacity: clamp(p * 2), color }}>{ch}</span>; })}
  </div>
);

// ---- the segment ------------------------------------------------------------------------------------------------
export const SegD: React.FC<{ t: number }> = ({ t }) => {
  // 1) the hand-off gradient irises down into the Studio card
  const p0 = spring(t, 30.25, 0.85, 0.9);
  // 2) the card shrinks into the logo mark
  const q = spring(t, 33.92, 0.62, 0.9);
  const qe = clamp(q);
  const cx0 = mix(960, CX, spring(t, 30.8, 0.75, 0.86)), cl0 = cx0 - CW / 2;
  const fromR = { l: cl0 * p0, t: CT * p0, r: (1920 - cl0 - CW) * p0, b: (1080 - CT - CH) * p0, rad: 56 * p0 };
  const ccx = mix(cx0, LOGO_X, qe), ccy = mix(CY, ICON_Y, qe), cw = mix(CW, ICON_W, qe), ch = mix(CH, ICON_W, qe);
  const toR = { l: ccx - cw / 2, t: ccy - ch / 2, r: 1920 - ccx - cw / 2, b: 1080 - ccy - ch / 2, rad: mix(56, ICON_W * 0.25, qe) };
  const R = t < 33.92 ? fromR : toR;

  const blobOut = clamp((t - 34.3) / 0.1);   // the app icon gives way to the logo (0.1 s)
  const blobScale = 1 + 0.25 * ease(blobOut);
  const markP = spring(t, 34.06, 0.42, 0.8);  // the white S inside the shrinking icon

  // card turn and snaps
  const snaps = TPL.reduce((a, d) => a + impact(t, d.at + LAND), 0);
  const turnIn = ease((t - 30.35) / 0.9);
  const rotY = turnIn * (-8 + Math.sin((t - 30.35) * 2.1) * 6) * (1 - qe);
  const rotX = turnIn * Math.sin((t - 30.35) * 1.7) * 4 * (1 - qe);
  // a slow camera push over the whole Studio stage, released as the card shrinks into the icon
  const camK = inout((t - 30.5) / 3.35) * (1 - qe);
  const camPush = 1 + 0.07 * camK, camDX = -30 * camK, camDY = 12 * camK;
  const cardS = 1 + 0.01 * snaps;
  const cardScaleOut = mix(1, ICON_W / CW, qe);
  const cardDX = ccx - CX, cardDY = ccy - CY;

  // card content
  const bodyP = spring(t, 30.62, 0.6, 0.86);          // white body rises inside the card
  const headP = spring(t, 30.72, 0.5, 0.7);
  const contentO = 1 - clamp((t - 33.92) / 0.18);
  const bodyTop = mix(1080 - R.b, ccy - (CH * cardScaleOut) / 2 + HEAD * cardScaleOut, bodyP);   // screen y of the white body's top: rises from the card's bottom edge
  // the gradient stops just under the body's top, so no blue fringe shows along the body's anti-aliased side edges
  const gradCut = p0 > 0.2 && t < 33.92 ? Math.max(0, 1080 - (bodyTop + 48)) : 0;
  const cam = miniCam(t);
  const sw = bounce(t, 32.55, 0.42);                  // the No-code switch
  const swPress = Math.exp(-Math.max(0, t - 32.5) * 8) * (t > 32.45 ? 1 : 0);

  // left column type
  const push = ease((t - 33.82) / 0.42);
  const colX = -320 * push, colO = 1 - clamp((t - 33.82) / 0.32);
  const chipP = bounce(t, 33.0, 0.5);
  const subAt = 33.32;

  // end card
  const logoP = bounce(t, 34.3, 0.55);
  const ringP = clamp((t - 34.32) / 0.7);
  const globeP = spring(t, 34.5, 0.9, 0.86);
  const gy = mix(2300, 1640, globeP);
  const pillP = bounce(t, 36.4, 0.5);
  const float = t > 34.3 ? Math.sin((t - 34.3) * 1.6) * 7 : 0;
  const push2 = t > 34.3 ? (1 + 0.1 * (1 - ease((t - 34.3) / 1.5))) * (1 + 0.035 * inout((t - 35.8) / 4.2)) : 1;

  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      {/* ---- the end-card globe (behind everything) ---- */}
      {t > 34.5 && <Globe t={t} gy={gy} o={clamp((t - 34.55) * 4)} />}
      {t > 34.5 && GLOBE_PINS.map((g, i) => {
        if (t < g.at - 0.02) return null;
        const lon = -spin(g.at) + g.off;
        const pr = project(g.lat, lon, spin(t), 960, gy);
        if (pr.z < 0.25) return null;
        const p = bounce(t, g.at, 0.5);
        const fade = clamp((pr.z - 0.25) * 4);
        return <div key={i} style={{ position: "absolute", inset: 0, opacity: fade }}>
          {[0, 0.55].map((ph) => { const rip = (((t - g.at) + 1.1 - ph) % 1.1) / 1.1; if (t - g.at < ph) return null; return (
            <div key={ph} style={{ position: "absolute", left: 0, top: 0, width: 260, height: 260, borderRadius: 260, border: `6px solid ${AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length]}`,
              transform: `translate(${pr.x - 130}px, ${pr.y - 130}px) scale(${0.15 + rip * 1.25}, ${(0.15 + rip * 1.25) * 0.45})`, opacity: (1 - rip) * 0.75 * clamp((t - g.at) * 4) * clamp((1840 - pr.x - 130 * (0.15 + rip * 1.25)) / 60) * clamp((pr.x - 130 * (0.15 + rip * 1.25) - 80) / 60) }} />); })}
          <Pin x={pr.x} y={pr.y} p={p} name={g.name} i={i + 1} size={64 + 20 * pr.z} /></div>;
      })}

      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", willChange: "transform", transform: `translate3d(${camDX}px, ${camDY}px, 0) scale(${camPush})` }}>
      {/* ---- the gradient: full frame (H3), then the card, then the logo blob ---- */}
      {blobOut < 1 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${ccx}px ${ccy}px`, willChange: "transform",
          transform: `perspective(2200px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${cardS * blobScale})`, opacity: 1 - blobOut }}>
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(${R.t}px ${R.r}px ${R.b}px ${R.l}px round ${R.rad}px)` }}>
            <div style={{ position: "absolute", inset: 0, clipPath: gradCut > 0 ? `inset(0px 0px ${gradCut}px 0px)` : undefined }}>
              <H3Gradient t={t} />
            </div>
            {/* white body rising, inside the card's own clip so its edges are the card's edges */}
            {p0 > 0.2 && contentO > 0 && (
              <div style={{ position: "absolute", left: R.l, right: R.r, top: bodyTop, bottom: R.b - 2, background: S.white,
                borderRadius: `${36 * cardScaleOut}px ${36 * cardScaleOut}px 0 0`, opacity: contentO }} />
            )}
          </div>
          {/* the white S of the app icon */}
          {markP > 0 && (
            <svg width={LOGO * 1.09 * MARK0} height={LOGO * 1.09 * MARK0} viewBox="0 0 48 48" style={{ position: "absolute", left: ccx - (LOGO * 1.09 * MARK0) / 2, top: ccy - (LOGO * 1.09 * MARK0) / 2,
              transform: `scale(${0.5 + 0.5 * markP})`, opacity: clamp(markP * 2.5), filter: "drop-shadow(0 4px 8px rgba(10,30,120,0.25))" }}>
              {LOGO_PATHS.map((pp, i) => <path key={i} d={pp.d} fill={S.white} />)}
            </svg>
          )}
          {p0 > 0.2 && (t < 33.92 || contentO > 0) && (
            <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, opacity: contentO,
              transform: `translate(${CL + cardDX + (CW / 2) * (1 - cardScaleOut)}px, ${CT + cardDY + (CH / 2) * (1 - cardScaleOut)}px) scale(${cardScaleOut})`, transformOrigin: "0 0" }}>
              {/* header */}
              <div style={{ position: "absolute", left: 40, top: 38, color: S.white, transform: `translateY(${(1 - headP) * 30}px)`, opacity: clamp(headP * 2) }}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.14em", opacity: 0.85 }}>SUPERWORLD STUDIO</div>
                <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 6 }}>Make your own app</div>
              </div>
              <div style={{ position: "absolute", right: 36, top: 44, width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center",
                transform: `scale(${bounce(t, 30.9, 0.5)}) rotate(${(1 - bounce(t, 30.9, 0.5)) * -40}deg)`, fontSize: 34 }}>🛠️</div>
              {/* mini map */}
              <div style={{ position: "absolute", left: MAPX, top: MAPY, width: MAPW, height: MAPH, borderRadius: 28, overflow: "hidden", border: `1.5px solid ${S.line}`, boxSizing: "border-box",
                opacity: clamp((bodyP - 0.5) * 3), transform: `translateY(${(1 - clamp(bodyP)) * 120}px) scale(${0.94 + 0.06 * clamp(bodyP)})` }}>
                <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${-(1920 - MAPW) / 2}px, ${-(1080 - MAPH) / 2}px)` }}>
                  <CityMap cam={cam} labels />
                  {TPL.map((d, i) => { const sp = toScreen(d.place.x, d.place.y, cam); return <Pin key={i} x={sp.x} y={sp.y} p={bounce(t, d.at + LAND - 0.02, 0.5)} emoji={d.emoji} size={66} />; })}
                  {MINI_PEOPLE.map((m, i) => { if (t < m.at) return null; const sp = toScreen(m.x, m.y, cam); return <Pin key={"m" + i} x={sp.x} y={sp.y} p={bounce(t, m.at, 0.45)} name={m.name} i={i + 2} size={56} />; })}
                </div>
              </div>
              {/* empty slots */}
              {SLOT_Y.map((y, i) => (
                <div key={i} style={{ position: "absolute", left: MAPX, top: y, width: MAPW, height: SLOT_H, borderRadius: 22, border: `2px dashed #D3D3D3`, boxSizing: "border-box",
                  opacity: clamp((bodyP - 0.6) * 3) * (t < TPL[i].at + LAND ? 1 : 0), display: "flex", alignItems: "center", justifyContent: "center", color: "#BDBDBD", fontSize: 44, fontWeight: 500, lineHeight: 1,
                  transform: `translateY(${(1 - clamp(spring(t, 30.8 + i * 0.08, 0.5, 0.8))) * 60}px)` }}>+</div>
              ))}
              {/* the No-code switch row */}
              <div style={{ position: "absolute", left: MAPX, top: 774, width: MAPW, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
                opacity: clamp((t - 32.2) * 4), transform: `translateY(${(1 - clamp(spring(t, 32.2, 0.5, 0.75))) * 40}px)` }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: S.ink, letterSpacing: "-0.02em" }}>No code</div>
                <div style={{ width: 92, height: 54, borderRadius: 27, position: "relative", background: S.line, overflow: "hidden", transform: `scale(${1 - 0.06 * swPress})` }}>
                  <div style={{ position: "absolute", inset: 0, background: BTN, opacity: clamp(sw) }} />
                  <div style={{ position: "absolute", left: 4, top: 4, width: 46 + 8 * swPress, height: 46, borderRadius: 23, background: S.white, boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                    transform: `translateX(${sw * 38 - 8 * swPress * sw}px)` }} />
                </div>
              </div>
            </div>
          )}
          {/* ---- template tiles: inside the card's 3D wrapper, so they turn with the card ---- */}
          {t < 34.1 && TPL.map((d, i) => {
            if (t < d.at) return null;
            const p = spring(t, d.at, 0.62, 0.66);
            const f = FROM[i];
            const im = impact(t, d.at + LAND);
            const tx = CL + MAPX + f.x * (1 - p), ty = CT + SLOT_Y[i] + f.y * (1 - p);
            // follow the card on its way out (the tiles are in the card from here)
            const k = cardScaleOut;
            const sx = CX + (tx - CX) * k + cardDX, sy = CY + (ty - CY) * k + cardDY;
            return (
              <div key={i} style={{ position: "absolute", left: 0, top: 0, width: MAPW, height: SLOT_H, transformOrigin: "0 0", opacity: contentO * clamp((t - d.at) * 8),
                transform: `translate(${sx}px, ${sy}px) perspective(1400px) rotateZ(${f.rz * (1 - p)}deg) rotateY(${f.ry * (1 - p)}deg) scale(${k * (1 + 0.6 * (1 - p))}) scaleX(${1 + 0.07 * im}) scaleY(${1 - 0.09 * im})` }}>
                <Tile i={i} />
              </div>
            );
          })}
        </div>
      )}


      {/* ---- the left column: the script line, then Creators earn ---- */}
      {t < 34.4 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${colX}px)`, opacity: colO }}>
          <BW t={t} at={31.0} text="Build your own." cx={540} y={292} size={112} stagger={0.026} />
          <BW t={t} at={31.5} text="No code." cx={540} y={420} size={112} color={S.blue} stagger={0.034} />
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${540 - 190}px, ${600 - (1 - chipP) * 50}px) scale(${0.5 + 0.5 * chipP})`, transformOrigin: "190px 36px", opacity: clamp(chipP * 2) }}>
            <div style={{ width: 380, height: 72, borderRadius: 999, background: S.goldBg, border: "1.5px solid #F2DFA6", display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
              color: S.gold, fontSize: 34, fontWeight: 700, letterSpacing: "-0.01em", boxShadow: "0 18px 40px -20px rgba(122,92,18,0.5)" }}>
              <div style={{ transform: `rotateY(${(1 - clamp(bounce(t, 33.08, 0.6))) * 360}deg)` }}><Coin size={40} /></div>Creators earn
            </div>
          </div>
          <BW t={t} at={subAt} text="from the apps they build." cx={540} y={700} size={44} color={S.grey} weight={600} stagger={0.012} />
          {/* coins fly from the card into the chip */}
          {[0, 1, 2].map((i) => {
            const c = clamp((t - (32.92 + i * 0.07)) / 0.38);
            if (c <= 0 || c >= 1) return null;
            const e = inout(c);
            const x0 = ccx - CW / 2 + 40, y0 = 596 + i * 8, x1 = 540 - 150, y1 = 636;
            const x = mix(x0, x1, e), y = mix(y0, y1, e) - Math.sin(e * Math.PI) * (46 - i * 6);
            return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 22}px, ${y - 22}px) scale(${1.2 - 0.5 * e}) rotate(${e * 300}deg)` }}><Coin size={44} /></div>;
          })}
        </div>
      )}

      </div>

      {/* ---- the end card ---- */}
      {t > 34.2 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 360px", willChange: "transform", transform: `translate3d(0, ${float}px, 0) scale(${push2})` }}>
          {/* a ring of light from the logo */}
          {ringP > 0 && ringP < 1 && (
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: (1 - ringP) * 0.7 }}>
              <circle cx={LOGO_X} cy={LOGO_Y} r={150 * (0.6 + ringP * 2.4) - 2 * (0.6 + ringP * 2.4)} fill="none" stroke={S.sky} strokeWidth={4 * (0.6 + ringP * 2.4)} />
            </svg>
          )}
          <div style={{ position: "absolute", left: LOGO_X - LOGO / 2, top: LOGO_Y - LOGO / 2, width: LOGO, height: LOGO, transform: `scale(${mix(MARK0, 1, logoP)})`, opacity: clamp((t - 34.3) / 0.1),
            filter: "drop-shadow(0 18px 30px rgba(30,58,214,0.28))" }}>
            <Logo size={LOGO} id="dlogo" />
          </div>
          <BounceWords t={t} at={34.72} text="SuperWorld" cx={960} y={272} size={150} stagger={0.032} />
          <BounceWords t={t} at={35.45} text="Your world, mapped by you and your friends." cx={960} y={446} size={58} stagger={0.013} accentFrom={22} weight={700} />
          <div style={{ position: "absolute", left: 960 - 270, top: 548, width: 540, height: 84, borderRadius: 999, background: S.white, border: `1.5px solid ${S.line}`, boxShadow: SHADOW,
            display: "flex", alignItems: "center", justifyContent: "center", color: S.blue, fontSize: 38, fontWeight: 700, letterSpacing: "-0.01em",
            transform: `translateY(${(1 - pillP) * 60}px) scale(${0.6 + 0.4 * pillP})`, opacity: clamp(pillP * 2.5) }}>
            map.superworldapp.com
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
// keep imported helpers referenced for tsc (noUnusedLocals safety)
void GRAD; void PLACES;
