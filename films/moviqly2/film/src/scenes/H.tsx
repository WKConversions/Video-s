// Scene H — the review (sH → h3): "Moviqly reviews test frames like an art director."
// The thumbnails that lifted off the storyboard in G are carried onto a light table (a plane tilted back 25°, two
// rows) as the seven test frames. On "reviews test frames" a loupe glides from frame to frame, its lens magnifying
// what is under it. On "like an art director" it stops on scene 1, whose headline runs off the right edge: a thin
// red outline and "Cut-off text". The headline reflows into the frame, the flag becomes a check, the other frames get
// theirs in a sweep ("Review passed"), and the fixed frame lifts off the table, flattens and lands as Handoff3.
import React from "react";
import { Check, FjFrame, Handoff3, Mountains, Stage3D, canvasRect, f, fjAt, k, kf, surface } from "../shared";
import { Easing } from "remotion";
import { C, CRAFT, FJ, FONT, LAND, LEAVE, SERIF, SHADOW_BIG, SNAP, clamp01, mix } from "../lib";
// the carry onto the table picks up the thumbnails' lift speed (they leave G accelerating), then lands
const CARRY = Easing.bezier(0.3, 0.45, 0.15, 1);
import { gThumb } from "./G";

/* ---------- the light table: a plane tilted back, seen in the stage's perspective ---------- */
// The plane settles from 42° to its 25° tilt while the frames land and the loupe works (the table never stops).
const PERSP = 1800;
let TILT = 25, COS = Math.cos((TILT * Math.PI) / 180), SIN = Math.sin((TILT * Math.PI) / 180);
const setTilt = (deg: number) => { TILT = deg; COS = Math.cos((deg * Math.PI) / 180); SIN = Math.sin((deg * Math.PI) / 180); };
const TC = { x: 960, y: 560 };
const TW = 340, THh = TW * 9 / 16, GAP = 32, ROWDY = THh / 2 + 18;
const TBW = 4 * TW + 3 * GAP + 112, TBH = 2 * THh + 36 + 100;
const tileLocal = (i: number) => (i < 4 ? { dx: (i - 1.5) * (TW + GAP), dy: -ROWDY } : { dx: (i - 5) * (TW + GAP), dy: ROWDY });
// a point on the table (local dx, dy from its centre; n = height above it) → 3D, and 3D → the frame
const onTable = (dx: number, dy: number, n = 0) => ({ X: TC.x + dx, Y: TC.y + dy * COS - n * SIN, Z: dy * SIN + n * COS });
const proj = (X: number, Y: number, Z: number) => { const s = PERSP / (PERSP - Z); return { x: 960 + (X - 960) * s, y: 540 + (Y - 540) * s, s }; };
const tableToFrame = (dx: number, dy: number) => { const p = onTable(dx, dy); return proj(p.X, p.Y, p.Z); };

/* ---------- scene 1 of the film, as rendered in the test: the headline runs off the right edge until it reflows ---------- */
// At fix = 1 it is exactly FjFrame 0 at the film's 1.6 s (the frame Handoff3 shows).
const T0 = fjAt(1.6).t;
const Flaw0: React.FC<{ w: number; h: number; fix: number }> = ({ w, h, fix }) => {
  const u = Math.min(w, h) / 100, e = LAND(clamp01(T0 * 1.8)), dx = (1 - CRAFT(clamp01(fix))) * w * 0.31;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, color: FJ.snow, background: FJ.pine, paddingTop: 0 }}>
      <Mountains w={w} h={h * 0.5} rise={T0 * 1.4} tone={0} />
      <div style={{ position: "relative", transform: `${dx ? `translateX(${dx}px) ` : ""}scale(${0.85 + 0.15 * e})`, opacity: e, marginTop: -h * 0.36, filter: e < 1 ? `blur(${(1 - e) * u}px)` : undefined }}>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: u * 15, letterSpacing: "-0.03em", lineHeight: 1.0, color: FJ.snow, textAlign: "center" }}>Gear that goes<br /><span style={{ color: FJ.ember }}>further.</span></div>
      </div>
    </div>
  );
};
const TileContent: React.FC<{ i: number; w: number; h: number; fix: number; flawIn?: number }> = ({ i, w, h, fix, flawIn = 1 }) =>
  i === 0 ? <>{flawIn < 1 && <FjFrame i={0} w={w} h={h} t={1} />}<div style={{ position: "absolute", inset: 0, opacity: flawIn }}><Flaw0 w={w} h={h} fix={fix} /></div></>
    : <FjFrame i={i} w={w} h={h} t={1} />;

/* ---------- the loupe's path over the table (local coordinates) ---------- */
const LOUPE_A = { x: 558 - 40, y: -ROWDY - 10 }, LOUPE_B = { x: 30, y: ROWDY - 20 }, LOUPE_C = { x: -(1.5 * (TW + GAP)) + TW / 2 - 24, y: -ROWDY - 38 };
const R = 112;

export const SceneH: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sH") || g >= f("h3")) return null;
  // the end: the fixed frame has landed exactly where I's canvas will be
  const lq = kf(g, f("h3") - 19, 17, CRAFT);
  if (lq >= 1) return <Handoff3 />;
  setTilt(mix(42, 25, k(g, "sH", 2.3, CRAFT)));

  const table = k(g, "sH+0.1", 0.7);
  const fl = k(g, "w:like-0.1", 0.25, SNAP), fix = k(g, "w:an3", 0.36, CRAFT), ok0 = k(g, "w:director", 0.27, SNAP);
  const red = fl * (1 - fix), violet = fix * (1 - k(g, "w:director+0.2", 0.3));
  const out = kf(g, f("h3") - 14, 12, LEAVE);
  const cap = k(g, "w:director-0.1", 0.45);

  // the tiles: carried from the lifted thumbnails onto the table
  const tilePose = (i: number) => {
    const q = k(g, `sH+${(i * 0.04).toFixed(2)}`, 0.75, CARRY), t = gThumb(i), L = tileLocal(i), p3 = onTable(L.dx, L.dy, 4);
    const w = mix(t.w, TW, q);
    return { X: mix(t.cx, p3.X, q), Y: mix(t.cy, p3.Y, q), Z: mix(0, p3.Z, q) + 70 * Math.sin(Math.PI * q), rot: TILT * q, w, h: (w * 9) / 16, r: mix(t.r, 6, q), q };
  };
  const tileEl = (i: number, extra?: React.ReactNode, pose = tilePose(i)) => (
    <div key={i} style={{ position: "absolute", left: pose.X - pose.w / 2, top: pose.Y - pose.h / 2, width: pose.w, height: pose.h, borderRadius: pose.r, overflow: "hidden",
      transform: `translateZ(${pose.Z}px) rotateX(${pose.rot}deg)`, boxShadow: `0 0 0 1px ${C.line}, 0 ${mix(18, 8, pose.q)}px ${mix(40, 18, pose.q)}px -${mix(12, 8, pose.q)}px rgba(60,40,110,${mix(0.35, 0.3, pose.q)})` }}>
      <TileContent i={i} w={pose.w} h={pose.h} fix={fix} flawIn={i === 0 ? clamp01(pose.q * 1.6) : 1} />
      {extra}
    </div>
  );

  // the loupe: appears over the last row's right frame, glides frame to frame, stops on scene 1's cut edge
  const ap = k(g, "w:reviews-0.12", 0.35), lv = k(g, "w:art2+0.1", 0.27, LEAVE);
  const m1 = k(g, "w:test-0.2", 0.45, CRAFT), m2 = k(g, "w:frames-0.05", 0.4, CRAFT);
  const lu = mix(mix(LOUPE_A.x, LOUPE_B.x, m1), LOUPE_C.x, m2), lvv = mix(mix(LOUPE_A.y, LOUPE_B.y, m1), LOUPE_C.y, m2);
  const lp = tableToFrame(lu, lvv);
  const MAG = mix(2.1, 2.8, k(g, "w:like-0.1", 0.5, CRAFT));                 // the art director leans in
  const loupeOn = ap > 0 && lv < 1;

  // where the badges sit: each frame's top-left corner on the table
  const corner = (i: number) => { const L = tileLocal(i); return tableToFrame(L.dx - TW / 2, L.dy - THh / 2); };
  const c0 = corner(0);

  // tile 0 during the lift: from its table pose to the canvas rect of I, flat
  const r3 = canvasRect(16 / 9);
  const liftPose = () => {
    const a = tilePose(0), w = mix(a.w, r3.w, lq);
    return { X: mix(a.X, r3.x + r3.w / 2, lq), Y: mix(a.Y, r3.y + r3.h / 2, lq), Z: mix(a.Z, 0, lq) + 160 * Math.sin(Math.PI * lq), rot: mix(TILT, 0, lq), w, h: (w * 9) / 16, r: 6, q: 1 };
  };
  const lifting = lq > 0;

  const flagEl = <>
    {red > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 6, boxShadow: `inset 0 0 0 3px ${C.flag}`, opacity: red }} />}
    {violet > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 6, boxShadow: `inset 0 0 0 3px ${C.violet}`, opacity: violet }} />}
  </>;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the table and the frames on it */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined, transform: `scale(${1 - 0.06 * out})` }}>
        <Stage3D persp={PERSP} style={{ transformStyle: "flat" }}>
          <div style={{ position: "absolute", left: TC.x - TBW / 2, top: TC.y - TBH / 2, width: TBW, height: TBH, borderRadius: 28,
            transform: `rotateX(${TILT}deg) scale(${mix(0.92, 1, table)})`, opacity: clamp01(table * 1.6), filter: table < 1 ? `blur(${(1 - table) * 10}px)` : undefined,
            background: "linear-gradient(180deg, #FFFFFF, #F6F2FB)", boxShadow: `0 0 0 1px ${C.line}, inset 0 0 80px rgba(136,83,223,0.08), 0 60px 90px -50px rgba(60,40,110,0.45)` }}>
            <div style={{ position: "absolute", inset: 18, borderRadius: 18, border: `1px dashed ${C.card}` }} />
          </div>
          {[1, 2, 3, 4, 5, 6].map((i) => tileEl(i))}
          {!lifting && tileEl(0, flagEl)}
        </Stage3D>
        {/* the checks on the other frames, in a sweep */}
        {[1, 2, 3, 4, 5, 6].map((i, j) => {
          const p = k(g, `w:director+${(0.12 + j * 0.05).toFixed(2)}`, 0.25, SNAP), c = corner(i);
          return p > 0 ? <Check key={i} size={30} p={p} style={{ position: "absolute", left: c.x - 15, top: c.y - 15 }} /> : null;
        })}
      </div>

      {/* the flag on scene 1: "Cut-off text", which becomes the check */}
      {fl > 0 && ok0 < 1 && (
        <div style={{ position: "absolute", left: c0.x - 34, top: c0.y - 60, transformOrigin: "0% 100%", opacity: (1 - ok0) * clamp01(fl * 2), transform: `scale(${mix(0.9, 1, SNAP(fl)) * mix(1, 0.8, ok0)})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px 8px 12px", borderRadius: 12, background: C.white, border: `1.5px solid ${C.flag}`, boxShadow: SHADOW_BIG,
            fontFamily: FONT, fontWeight: 600, fontSize: 23, color: C.flag, whiteSpace: "nowrap" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.flag, color: C.white, fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>!</div>
            Cut-off text
          </div>
        </div>
      )}
      {ok0 > 0 && <Check size={36} p={ok0} style={{ position: "absolute", left: c0.x - 18, top: c0.y - 18, opacity: 1 - clamp01(lq * 3) }} />}

      {/* the loupe: a white ring with a violet rim; the lens magnifies the table under it (seen straight down) */}
      {loupeOn && (
        <div style={{ position: "absolute", left: lp.x - R, top: lp.y - R, width: R * 2, height: R * 2, ...surface(ap * (1 - lv)) }}>
          <div style={{ position: "absolute", left: 22, top: 34, width: R * 2, height: R * 2, borderRadius: "50%", background: "rgba(60,40,110,0.22)", filter: "blur(16px)" }} />
          <div style={{ position: "absolute", left: R * 2 - 34, top: R * 2 - 34, width: 26, height: 104, borderRadius: 13, background: C.white, boxShadow: `0 0 0 2.5px ${C.violet}, 0 12px 24px -10px rgba(60,40,110,0.5)`, transform: "rotate(-45deg)", transformOrigin: "13px 0px" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "#FBF9FE" }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const L = tileLocal(i);
              if (Math.abs(L.dx - lu) > TW / 2 + R / MAG + 10 || Math.abs(L.dy - lvv) > THh / 2 + R / MAG + 10) return null;
              const w = TW * MAG, h = THh * MAG;
              return <div key={i} style={{ position: "absolute", left: R + (L.dx - TW / 2 - lu) * MAG, top: R + (L.dy - THh / 2 - lvv) * MAG, width: w, height: h, borderRadius: 6 * MAG, overflow: "hidden" }}>
                <TileContent i={i} w={w} h={h} fix={fix} />
                {i === 0 && red > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 6 * MAG, boxShadow: `inset 0 0 0 ${3 * MAG}px ${C.flag}`, opacity: red }} />}
              </div>;
            })}
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%)" }} />
          </div>
          <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: `12px solid ${C.white}`, boxShadow: `0 0 0 3px ${C.violet}, inset 0 0 0 1.5px rgba(136,83,223,0.35), 0 18px 40px -16px rgba(60,40,110,0.55)` }} />
        </div>
      )}

      {/* the fixed frame lifts off the table, flattens, and lands where the studio's canvas will be */}
      {lifting && <Stage3D persp={PERSP} style={{ transformStyle: "flat" }}>{(() => {
        const p = liftPose();
        return <div style={{ position: "absolute", left: p.X - p.w / 2, top: p.Y - p.h / 2, width: p.w, height: p.h, borderRadius: 6, overflow: "hidden",
          transform: `translateZ(${p.Z}px) rotateX(${p.rot}deg)`, boxShadow: `0 0 0 1px #E9E0F0, 0 ${16 + 30 * Math.sin(Math.PI * lq)}px ${70 + 30 * Math.sin(Math.PI * lq)}px #5d3d7c${lq < 1 ? "22" : "14"}` }}>
          <Flaw0 w={p.w} h={p.h} fix={1} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 6, boxShadow: `inset 0 0 0 3px ${C.violet}`, opacity: violet }} />
        </div>;
      })()}</Stage3D>}

      {/* the verdict, the real step */}
      {cap > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1920, top: 868, display: "flex", justifyContent: "center", opacity: 1 - out }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 28px", borderRadius: 20, background: C.white, border: `1px solid ${C.card}`, boxShadow: SHADOW_BIG, ...surface(cap) }}>
            <Check size={34} p={k(g, "w:director", 0.3, SNAP)} />
            <div style={{ fontFamily: FONT, fontSize: 27, color: C.label, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
              <span style={{ fontWeight: 700, color: C.ink }}>Review passed</span><span style={{ color: C.muted }}> · No cut-off text, overlaps or broken images.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
