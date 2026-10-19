// Scene M — steps and versions (h4 → sN): "Every step visible. Every version saved."
// Starts on Handoff4 (the studio, final state). "Every step visible": the folded activity ("11 steps") lights up,
// unfolds and lifts out in front as a tall card with all of FJ_STEPS at 24 px; their checks land top to bottom,
// "Worked for 3:48". "Every version saved": the card and the studio recede; the portrait canvas detaches and stands
// as version 3 while versions 1 and 2 surface behind it in depth, each playing, each labelled.
import React from "react";
import { Check, FJ_STEPS, FjFilm, Handoff4, MMark, canvasRect, f, filmClock, k, kf, surface } from "../shared";
import { C, CRAFT, FONT, LEAVE, LIN, SHADOW_DEEP, SNAP, clamp01, mix } from "../lib";

/* ---------- the three versions (shared with N, which sends them back into depth) ---------- */
// Standing in depth: the earliest furthest back (smaller, higher), the portrait in front. Rects in frame px.
export const VERSIONS = [
  { x: 180, w: 500, ar: 16 / 9, bottom: 652, label: "Version 1", tone: "punchy", calm: false },
  { x: 730, w: 590, ar: 16 / 9, bottom: 722, label: "Version 2", tone: "calmer", calm: true },
  { x: 1370, w: 370, ar: 9 / 16, bottom: 846, label: "Version 3", tone: "portrait", calm: true },
].map((v) => ({ ...v, h: v.w / v.ar, y: v.bottom - v.w / v.ar }));
// each version plays: v1 the punchy film, v2 the calm film from its start, v3 the studio's portrait film (filmClock)
export const versionClock = (i: number, g: number) => (i === 0 ? 6.3 + (g - f("h4")) / 30 : i === 1 ? 0.4 + (g - f("h4")) / 30 : filmClock(g).s);

const Frame: React.FC<{ i: number; g: number; x: number; y: number; w: number; h: number; style?: React.CSSProperties }> = ({ i, g, x, y, w, h, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 8, overflow: "hidden", background: C.white, boxShadow: `0 0 0 1px #E9E0F0, ${SHADOW_DEEP}`, ...style }}>
    <FjFilm s={versionClock(i, g)} w={w} h={h} calm={VERSIONS[i].calm} />
  </div>
);
const Label: React.FC<{ i: number; p: number; x: number; y: number }> = ({ i, p, x, y }) => p <= 0 ? null : (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontSize: 24, whiteSpace: "nowrap", transformOrigin: "0% 50%", ...surface(p) }}>
    <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.violet }} />
    <span style={{ fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>{VERSIONS[i].label}</span><span style={{ color: C.muted }}>· {VERSIONS[i].tone}</span>
  </div>
);
// The versions as they stand at the end of M (N draws this and moves it on). `show` per version, `labels` per label.
export const Versions: React.FC<{ g: number; show?: number[]; labels?: number[]; v3?: { x: number; y: number; w: number; h: number } }> = ({ g, show = [1, 1, 1], labels = [1, 1, 1], v3 }) => (
  <>
    {VERSIONS.map((v, i) => {
      const r = i === 2 && v3 ? v3 : v;
      if (show[i] <= 0) return null;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${v.x + v.w / 2}px ${v.y + v.h / 2}px`, ...(i === 2 ? { opacity: clamp01(show[i] * 1.8) } : surface(show[i])) }}>
          <Frame i={i} g={g} x={r.x} y={r.y} w={r.w} h={r.h} />
        </div>
        <Label i={i} p={labels[i]} x={v.x + 2} y={v.bottom + 18} />
      </React.Fragment>;
    })}
  </>
);

/* ---------- the steps, lifted out of the chat ---------- */
const CARD = { x: 96, y: 92, w: 1000, size: 24, pad: 28 };
const FOLD = { x: 128, y: 238, w: 524 };                    // the folded activity in Handoff4's chat
const ROW_H = CARD.size * 1.3 + 2 + 20 * 1.35, ROW_GAP = 12;
const HEAD = CARD.size * 1.35 + 20;
const FULL_H = CARD.pad * 2 + HEAD + FJ_STEPS.length * ROW_H + (FJ_STEPS.length - 1) * ROW_GAP;

export const SceneM: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h4") || g >= f("sN")) return null;
  const hl = k(g, "w:every2-0.25", 0.25, SNAP);
  const lift = k(g, "w:every2", 0.7, CRAFT), unfold = k(g, "w:every2+0.2", 0.75, CRAFT);
  const rec = k(g, "w:every3-0.2", 0.7, CRAFT), recL = k(g, "w:every3-0.2", 0.6, LEAVE);
  const carry = k(g, "w:every3-0.15", 0.8, CRAFT);
  const v1 = k(g, "w:every3", 0.6), v2 = k(g, "w:version", 0.6);
  const labels = [0, 1, 2].map((j) => k(g, `w:saved+${(j * 0.08).toFixed(2)}`, 0.45));

  // the studio: steps back while the card is out, then recedes into depth
  const sScale = mix(1, 0.965, lift) * mix(1, 0.86, rec), sO = mix(1, 0.5, lift) * (1 - rec);
  // the portrait canvas, detached from the receding studio and carried to version 3
  const cr = canvasRect(9 / 16), sc0 = 0.965;
  const from = { x: 960 + (cr.x - 960) * sc0, y: 540 + (cr.y - 540) * sc0, w: cr.w * sc0, h: cr.h * sc0 }, V3 = VERSIONS[2];
  const v3 = { x: mix(from.x, V3.x, carry), y: mix(from.y, V3.y, carry), w: mix(from.w, V3.w, carry), h: mix(from.h, V3.h, carry) };

  const cardO = clamp01(lift * 4) * (1 - recL);
  const H = mix(CARD.pad * 2 + HEAD - 14, FULL_H, unfold);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {sO > 0 && <div style={{ position: "absolute", inset: 0, transform: `scale(${sScale})`, opacity: sO, filter: rec > 0 ? `blur(${rec * 10}px)` : undefined }}>
        <Handoff4 g={g} />
        {hl > 0 && <div style={{ position: "absolute", left: FOLD.x - 10, top: FOLD.y - 8, width: FOLD.w + 20, height: 66, borderRadius: 12, border: `2px solid ${C.violet}`, background: "rgba(136,83,223,0.06)",
          opacity: clamp01(hl * 1.6) * (1 - clamp01(lift * 2)), transform: `scale(${mix(1.03, 1, hl)})` }} />}
      </div>}

      {/* versions 1 and 2 surface behind; version 3 is the studio's canvas, carried */}
      {rec > 0 && <Versions g={g} show={[v1, v2, carry > 0 ? clamp01(carry * 5) : 0]} labels={labels} v3={v3} />}

      {/* the activity, unfolded and lifted out in front */}
      {cardO > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w, transformOrigin: "0 0",
          transform: `translate(${mix(FOLD.x, CARD.x, lift)}px, ${mix(FOLD.y, CARD.y, lift)}px) scale(${mix(FOLD.w / CARD.w, 1, lift) * mix(1, 0.88, rec)})`,
          opacity: cardO, filter: rec > 0 ? `blur(${rec * 12}px)` : undefined }}>
          <div style={{ position: "relative", width: CARD.w, height: H, boxSizing: "border-box", padding: CARD.pad, overflow: "hidden", background: C.white, borderRadius: 24, border: `1px solid ${C.card}`, boxShadow: SHADOW_DEEP }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, height: CARD.size * 1.35, marginBottom: 20 }}>
              <MMark size={28} /><div style={{ fontFamily: FONT, fontWeight: 600, fontSize: CARD.size, color: "#443450" }}>Moviqly</div>
              <div style={{ flex: 1 }} />
              <div style={{ fontFamily: FONT, fontSize: 21, color: "#A395AF", fontVariantNumeric: "tabular-nums" }}>Worked for 3:48</div>
            </div>
            <div style={{ display: "grid", gap: ROW_GAP }}>
              {FJ_STEPS.map((s, j) => {
                const r = kf(g, f("w:every2+0.25") + j * 1.6, 12), c = kf(g, f("w:visible-0.1") + j * 2.2, 8, LIN);
                return (
                  <div key={j} style={{ display: "flex", gap: 14, alignItems: "flex-start", height: ROW_H, opacity: clamp01(r * 1.8), transform: `scale(${mix(0.94, 1, r)})`, transformOrigin: "0% 50%", filter: r < 1 ? `blur(${(1 - r) * 6}px)` : undefined }}>
                    <div style={{ width: 28, height: 28, flex: "none", marginTop: 2, position: "relative" }}>
                      <div style={{ position: "absolute", inset: 2, borderRadius: "50%", border: `2px solid ${C.line}`, opacity: 1 - clamp01(c * 2) }} />
                      {c > 0 && <Check size={28} p={c} style={{ position: "absolute", left: 0, top: 0 }} />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: CARD.size, lineHeight: 1.3, color: C.label, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{s.t}</div>
                      <div style={{ fontFamily: FONT, fontSize: 20, lineHeight: 1.35, color: C.detail, marginTop: 2, whiteSpace: "nowrap" }}>{s.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
