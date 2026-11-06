// B1 helpers: measured word lines (S1), the shared logo/lockup states (S2 + S3), and the cards of S3's clusters.
import React, { useEffect, useState } from "react";
import { Easing } from "remotion";
import { continueRender, delayRender } from "remotion";
import { Avatar, Badge, Pill, Ico } from "../ui";
import { C, Media, SANS, SHADOW, Wordmark, INOUT, OUT, SOFT, c01, k, mix, sp } from "../kit";
import WM from "../wordmark.json";

// ------------------------------------------------------------------ text measuring (fonts-safe)
const fontsOk = () => typeof document !== "undefined" && document.fonts.check("900 20px Inter") && document.fonts.check("800 20px Inter");
export const useFonts = () => {
  const [ok, setOk] = useState(fontsOk);
  const [h] = useState(() => (fontsOk() ? null : delayRender("b1fonts")));
  useEffect(() => {
    if (ok) return;
    Promise.all([document.fonts.load("900 20px Inter"), document.fonts.load("800 20px Inter")]).then(() => { setOk(true); if (h !== null) continueRender(h); });
  }, []);
  return ok;
};
let ctx: CanvasRenderingContext2D | null = null;
const cache = new Map<string, number>();
/** width in em of a word at weight, with letter-spacing ls (em) */
export const emW = (text: string, weight = 900, ls = -0.04) => {
  const key = `${text}|${weight}|${ls}`; const hit = cache.get(key); if (hit !== undefined) return hit;
  if (!ctx) ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `${weight} 100px ${SANS}`; const v = ctx.measureText(text).width / 100 + ls * text.length;
  if (fontsOk()) cache.set(key, v); return v;
};

export type WItem = { text: string; at: number; out?: number; color?: string };
/** a centred line of words that enter one by one (spring), the spacing tightening as they settle, and optionally drop away one by one */
export const WordLine: React.FC<{ items: WItem[]; t: number; size: number; cx?: number; cy?: number; weight?: number; color?: string; dy?: number }> = ({ items, t, size, cx = 960, cy = 540, weight = 900, color = C.ink, dy = 0 }) => {
  useFonts();
  const rows = items.map((it) => {
    const q = c01(sp(t, it.at, 1.9, 0.8)); const settle = k(t, it.at, 0.6, OUT);
    const gap = size * (0.2 + 0.34 * (1 - settle));
    return { it, q, settle, gap, wd: emW(it.text, weight) * size };
  });
  const eff = rows.map((r) => (r.wd + r.gap) * r.q);
  const total = eff.reduce((a, b) => a + b, 0) - (rows.length ? rows[rows.length - 1].gap * rows[rows.length - 1].q : 0);
  let x = cx - total / 2;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
      {rows.map((r, i) => {
        const left = x; x += eff[i];
        const o = r.it.out !== undefined ? k(t, r.it.out, 0.24, (v) => v * v) : 0;
        if (r.q <= 0 || o >= 1) return null;
        const y = (1 - r.q) * 0.38 * size + o * 0.9 * size;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${left.toFixed(2)}px, ${(cy - size * 0.55 + y + dy).toFixed(2)}px)`, fontFamily: SANS, fontWeight: weight, fontSize: size, lineHeight: 1.1,
            letterSpacing: "-0.04em", color: r.it.color ?? color, whiteSpace: "nowrap", opacity: c01(r.q * 1.7) * (1 - o), filter: `blur(${((1 - r.q) * 9 + o * 9).toFixed(2)}px)` }}>{r.it.text}</div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ the lockup (S2) and its hand-over to S3
const ICON_S = 625, u = ICON_S / 512, WM_H = 170, WM_A = (WM as { aspect: number }).aspect, WM_W = WM_H * WM_A;
const iconW = 325 * u, GAP = 74, total = iconW + GAP + WM_W, LEFT = 960 - total / 2;
const LAND = Easing.bezier(0.3, 0.3, 0.2, 1);
export const LOCK = {
  cx: LEFT + 106.5 * u, cy: 540 + (311.5 - 256) * u, r: 130, barX: LEFT + 240 * u, barW: 85 * u, barBottom: 540 + (418 - 256) * u, barH: 325 * u,
  wmLeft: LEFT + iconW + GAP, wmTop: 540 - WM_H / 2, hdrY: 62, hdrH: 44, nodeR: 70, cutover: 3.84,
};
/** coral field -> circle -> lockup -> header wordmark + the lone circle; S2 and S3 both draw this, identically */
export const Brand: React.FC<{ t: number }> = ({ t }) => {
  const mv = sp(t, 2.9, 1.6, 0.85), off = (1 - mv) * (960 - LOCK.cx), lift = k(t, 3.4, 0.44, INOUT);
  const R0 = t < 3.4 ? mix(1102, LOCK.r, k(t, 2.6, 0.6, LAND)) : mix(LOCK.r, LOCK.nodeR, lift);
  const cx = mix(LOCK.cx + off, 960, lift), cy = mix(mix(540, LOCK.cy, mv), 540, lift);
  const b = Math.min(1, sp(t, 3.02, 1.8, 0.7)) * (1 - k(t, 3.4, 0.22, INOUT)), bx = mix(LOCK.barX + off, cx - LOCK.barW / 2, lift), bb = mix(LOCK.barBottom, cy, lift);
  const rev = k(t, 3.0, 0.42, OUT), p = k(t, 3.4, 0.45, SOFT), s = mix(1, LOCK.hdrH / WM_H, p);
  const dx = (960 - (LOCK.wmLeft + WM_W / 2)) * p, dy = (LOCK.hdrY - 540) * p;
  const dot = c01(sp(t, 3.30, 2.2, 0.6)); const gl = 0.55 + 0.25 * Math.sin(t * 5);
  return (
    <>
      {t >= 2.6 && t < LOCK.cutover && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={cx} cy={cy} r={R0} fill={C.coral} />
        {b > 0 && <rect x={bx} y={bb - LOCK.barH * b} width={LOCK.barW} height={LOCK.barH * b} fill={C.cream} />}
      </svg>}
      {t >= 2.9 && (
        <div style={{ position: "absolute", left: LOCK.wmLeft + off, top: LOCK.wmTop, width: WM_W, height: WM_H, clipPath: t < 3.42 ? `inset(-60px -60px -60px ${-GAP}px)` : undefined }}>
          <div style={{ transform: `translate(${dx - (1 - rev) * (WM_W + GAP)}px, ${dy}px) scale(${s})`, transformOrigin: "50% 50%", opacity: c01(rev * 3) }}>
            <div style={{ position: "absolute", left: WM_W - 0.105 * WM_H - 0.3 * WM_H, top: 0.47 * WM_H - 0.3 * WM_H, width: 0.6 * WM_H, height: 0.6 * WM_H, borderRadius: "50%", opacity: dot * gl,
              background: "radial-gradient(circle, rgba(226,90,61,0.9) 0%, rgba(226,90,61,0) 70%)", transform: `scale(${1 + 0.4 * dot})` }} />
            <Wordmark h={WM_H} dot={dot} />
          </div>
        </div>
      )}
    </>
  );
};

// ------------------------------------------------------------------ cards of the three clusters (app style, frame px)
const F = (size: number, weight = 500, color: string = C.cream): React.CSSProperties => ({ fontFamily: SANS, fontSize: size, fontWeight: weight, color, letterSpacing: "-0.01em" });
const card: React.CSSProperties = { borderRadius: 22, background: C.card, border: `1px solid ${C.border}`, boxShadow: SHADOW, overflow: "hidden" };
export const CreativeCard: React.FC<{ name: string; roles: string; city: string; clip: string; avatar?: string; initials?: string; avail: string }> = ({ name, roles, city, clip, avatar, initials, avail }) => (
  <div style={{ ...card, width: 460, height: 140, display: "flex", alignItems: "center", gap: 16, padding: 14 }}>
    <Media src={clip} w={132} h={112} r={14} shadow="none" />
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar s={40} src={avatar} initials={initials} /><span style={F(25, 700)}>{name}</span></div>
      <span style={F(22, 500, C.muted)}>{roles} · {city}</span>
      <span style={{ ...F(21, 600), display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 9, height: 9, borderRadius: 5, background: C.coral }} />{avail}</span>
    </div>
  </div>
);
export const VenueCard: React.FC<{ letter: string; name: string; sub: string }> = ({ letter, name, sub }) => (
  <div style={{ ...card, width: 460, height: 190, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 62, height: 62, borderRadius: 14, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", ...F(30, 800, C.ink) }}>{letter}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={F(29, 700)}>{name}</span><Badge s={20} /></div><span style={F(22, 500, C.muted)}>{sub}</span></div>
    </div>
    <div style={{ display: "flex", gap: 12 }}><Pill label="See all roles" kind="outline" w="50%" h={56} size={22} /><Pill label="Connect" w="50%" h={56} size={22} icon={<Ico n="arrow" s={18} w={2.4} />} /></div>
  </div>
);
export const BrandCard: React.FC<{ clip: string }> = ({ clip }) => (
  <div style={{ ...card, width: 460, height: 330, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
    <Media src={clip} w={428} h={214} r={14} shadow="none" />
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 58, height: 58, borderRadius: 14, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", ...F(28, 800, C.ink) }}>A</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={F(28, 700)}>Atelier Mar</span><Badge s={20} /></div><span style={F(22, 500, C.muted)}>Brand · Málaga</span></div>
    </div>
  </div>
);

export { c01 };
