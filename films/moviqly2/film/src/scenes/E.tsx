// Scene E — form, idea, art direction (sE → sF): "It picks one of nine forms, finds the idea, sets the art direction."
// The draft carries to the left. The nine real forms surface as a 3 × 3 grid on the right; a violet selection ring
// hops and lands on Feature tour on "forms"; the other eight recede and the chosen card is carried under the draft as
// a chip. On "idea" the idea lands above the draft as one big serif line. On "sets the art direction" a console of four
// sliders stands where the grid was; they snap in turn and each dresses the draft a step further (dress 0 → 1).
// The idea line and the console are exported for F, which carries them out.
import React from "react";
import { C, CRAFT, FJ, FONT, Ico, LAND, LEAVE, SERIF, SHADOW, SHADOW_BIG, SNAP, Check, clamp01, f, k, kf, mix } from "../shared";
import { B_LEFT, Draft, SLIDER_AT, Shelf, chipBoxAt, draftBox, tagsOut } from "./D";

/* ---------- the nine forms ---------- */
const FORMS = ["Product demo", "Feature tour", "Story ad", "One continuous journey", "Conversation", "Typographic manifesto", "Proof first", "Living system", "Classic explainer"];
const CHOSEN = 1;
const GRID = { x: 980, y: 404, w: 250, h: 124, gx: 25, gy: 22 };
const cardRect = (i: number) => ({ x: GRID.x + (i % 3) * (GRID.w + GRID.gx), y: GRID.y + Math.floor(i / 3) * (GRID.h + GRID.gy), w: GRID.w, h: GRID.h });
// a simple line glyph per form (48-unit box)
const Glyph: React.FC<{ i: number; s: number; c: string }> = ({ i, s, c }) => {
  const sw = 3.6;
  const paths: React.ReactNode[] = [
    <><rect x="5" y="9" width="38" height="25" rx="3" /><path d="M17 41 H31 M24 34 V41" /></>,
    <><path d="M24 6 L43 15 L24 24 L5 15 Z" /><path d="M5 24 L24 33 L43 24 M5 33 L24 42 L43 33" /></>,
    <><rect x="6" y="9" width="36" height="30" rx="4" /><path d="M6 17 H42 M6 31 H42 M14 9 V17 M24 9 V17 M34 9 V17 M14 31 V39 M24 31 V39 M34 31 V39" /></>,
    <><path d="M5 36 C13 12 22 40 30 22 S40 8 43 12" /><circle cx="5" cy="36" r="2.5" /><circle cx="43" cy="12" r="2.5" /></>,
    <><path d="M5 9 H29 V25 H14 L8 30 V25 H5 Z" /><path d="M20 30 H43 V43 H39 V47 L34 43 H20 Z" /></>,
    <><path d="M6 40 L16 9 L26 40 M10 29 H22" /><path d="M42 40 V27 a6 6 0 1 0 0 6" /></>,
    <><circle cx="24" cy="24" r="17" /><path d="M16 25 L22 31 L33 18" /></>,
    <><circle cx="24" cy="24" r="6" /><circle cx="9" cy="11" r="3.5" /><circle cx="40" cy="14" r="3.5" /><circle cx="12" cy="39" r="3.5" /><circle cx="38" cy="38" r="3.5" /><path d="M12 13 L19 20 M37 16 L29 21 M14 36 L19 29 M35 35 L29 28" /></>,
    <><circle cx="24" cy="24" r="17" /><path d="M20 16 L32 24 L20 32 Z" /></>,
  ];
  return <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>{paths[i]}</svg>;
};

// timing
const cardIn = (g: number, i: number) => kf(g, f("w:it2") + i * 1.2, 11, LAND);
const HOPS = [7, 5, 0, CHOSEN];                            // Living system → Typographic manifesto → Product demo → Feature tour
const hopAt = (j: number) => f("w:forms") + 1 - (HOPS.length - 1 - j) * 5 - (j === 0 ? 2 : 0);
const others = (g: number) => k(g, "w:forms+0.07", 0.8, LEAVE);
const chipCarry = (g: number) => k(g, "w:forms+0.17", 0.62, CRAFT);

const ringRect = (g: number) => {
  let r = cardRect(HOPS[0]);
  for (let j = 1; j < HOPS.length; j++) {
    const q = kf(g, hopAt(j) - 5, 5, SNAP), n = cardRect(HOPS[j]);
    r = { x: mix(r.x, n.x, q), y: mix(r.y, n.y, q), w: r.w, h: r.h };
  }
  return r;
};

const Grid: React.FC<{ g: number }> = ({ g }) => {
  const o = others(g), ringIn = kf(g, hopAt(0) - 2, 6, SNAP), landed = kf(g, hopAt(HOPS.length - 1), 6, SNAP);
  const carry = chipCarry(g);
  const rr = ringRect(g);
  // the chosen card's box: from its grid cell to the chip slot under the draft
  const b = draftBox(g), cb = chipBoxAt(b), c0 = cardRect(CHOSEN);
  const cx = mix(c0.x, cb.x, carry), cy = mix(c0.y, cb.y, carry), cw = mix(c0.w, cb.w, carry), ch = mix(c0.h, cb.h, carry);
  const morph = clamp01((carry - 0.25) / 0.5), to = tagsOut(g);
  return (
    <>
      {FORMS.map((name, i) => {
        if (i === CHOSEN) return null;
        const p = cardIn(g, i), r = cardRect(i);
        if (p <= 0 || o >= 1) return null;
        const hot = HOPS.slice(0, -1).some((h, j) => h === i && g >= hopAt(j) - 3 && g < hopAt(j + 1) - 2) ? 1 : 0;
        return (
          <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, boxSizing: "border-box", borderRadius: 16, background: C.white, border: `1px solid ${C.line}`, boxShadow: SHADOW,
            padding: "16px 18px", display: "flex", flexDirection: "column", gap: 9, opacity: clamp01(p * 1.8) * (1 - o), transform: `scale(${mix(0.82, 1, p) * mix(1, 0.8, o)})`,
            filter: p < 1 || o > 0 ? `blur(${(1 - p) * 12 + o * 10}px) grayscale(${o})` : undefined }}>
            <Glyph i={i} s={30} c={hot ? C.violet : C.muted} />
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 23, lineHeight: 1.12, letterSpacing: "-0.015em", color: C.ink }}>{name}</div>
          </div>
        );
      })}
      {/* the chosen card: Feature tour, then carried under the draft as the form chip */}
      {cardIn(g, CHOSEN) > 0 && to < 1 && (() => {
        const p = cardIn(g, CHOSEN);
        return (
          <div style={{ position: "absolute", left: cx, top: cy, width: cw, height: ch, boxSizing: "border-box", borderRadius: mix(16, 24, carry), overflow: "hidden",
            background: landed > 0 ? `linear-gradient(0deg, rgba(238,232,255,${landed}), rgba(238,232,255,${landed})), ${C.white}` : C.white,
            border: `${1 + landed * 0.5}px solid ${landed > 0.5 ? C.violet : C.line}`, boxShadow: carry > 0 ? "0 10px 24px -12px rgba(75,42,154,0.45)" : SHADOW,
            opacity: clamp01(p * 1.8) * (1 - to), transform: `scale(${mix(0.82, 1, p) * mix(1, 0.8, to)})`, filter: p < 1 || to > 0 ? `blur(${(1 - p) * 12 + to * 10}px)` : undefined }}>
            <div style={{ position: "absolute", left: 18, top: 16, display: "flex", flexDirection: "column", gap: 9, opacity: 1 - morph }}>
              <Glyph i={CHOSEN} s={30} c={landed > 0.5 ? C.violet : C.muted} />
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 23, lineHeight: 1.12, letterSpacing: "-0.015em", color: C.ink }}>{FORMS[CHOSEN]}</div>
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, opacity: morph, fontFamily: FONT, fontWeight: 600, fontSize: 22, color: C.lavenderInk, whiteSpace: "nowrap" }}>
              <Glyph i={CHOSEN} s={22} c={C.violet} />Feature tour
            </div>
          </div>
        );
      })()}
      {/* the selection ring hops, lands on Feature tour, then goes with the carry */}
      {ringIn > 0 && carry < 1 && (
        <div style={{ position: "absolute", left: (carry > 0 ? cx : rr.x) - 7, top: (carry > 0 ? cy : rr.y) - 7, width: (carry > 0 ? cw : rr.w) + 14, height: (carry > 0 ? ch : rr.h) + 14, boxSizing: "border-box",
          borderRadius: mix(22, 30, carry), border: `3.5px solid ${C.violet}`, boxShadow: `0 0 0 ${6 + landed * 4}px rgba(136,83,223,${0.14 + landed * 0.08})`,
          opacity: clamp01(ringIn * 2) * (1 - clamp01(carry * 2.5)), transform: `scale(${mix(1.08, 1, ringIn)})` }} />
      )}
    </>
  );
};

/* ---------- the idea ---------- */
const IDEA = ["Fjello", "gear", "goes", "further", "than", "the", "trail."];
export const IdeaLine: React.FC<{ g: number; out?: number }> = ({ g, out = 0 }) => {
  const bulb = k(g, "w:finds", 0.45, LAND);
  if (bulb <= 0 || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: B_LEFT.x, top: 222, display: "flex", alignItems: "center", gap: 26, opacity: 1 - out, transform: `scale(${mix(1, 0.9, out)})`, transformOrigin: "0% 100%",
      filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      <div style={{ width: 76, height: 76, borderRadius: "50%", background: C.lavender, display: "flex", alignItems: "center", justifyContent: "center", flex: "none",
        opacity: clamp01(bulb * 1.8), transform: `scale(${mix(0.6, 1, bulb)})`, filter: bulb < 1 ? `blur(${(1 - bulb) * 8}px)` : undefined }}>
        <Ico n="bulb" s={44} c={C.violet} w={2.4} />
      </div>
      <div style={{ display: "flex", columnGap: 19, fontFamily: SERIF, fontWeight: 800, fontSize: 74, letterSpacing: "-0.03em", lineHeight: 1.05, color: FJ.ink, whiteSpace: "nowrap" }}>
        {IDEA.map((w, i) => {
          const q = kf(g, f("w:idea") - 4 + i * 2, 16, LAND);
          return <span key={i} style={{ display: "inline-block", opacity: clamp01(q * 1.8), transform: `scale(${mix(0.82, 1, q)})`, filter: q < 1 ? `blur(${(1 - q) * 10}px)` : undefined,
            color: w === "further" ? FJ.ember : FJ.ink }}>{w}</span>;
        })}
      </div>
    </div>
  );
};

/* ---------- the art-direction console ---------- */
const AD = [
  { key: "PALETTE", val: "Pine & ember", at: 0.72 },
  { key: "TYPE", val: "Serif, bold", at: 0.86 },
  { key: "CUTS", val: "Whip", at: 0.92 },
  { key: "CAMERA", val: "Push-in", at: 0.62 },
];
export const CONSOLE = { x: 980, y: 410, w: 800, h: 405 };
export const Console: React.FC<{ g: number; out?: number }> = ({ g, out = 0 }) => {
  const p = k(g, "w:sets-0.13", 0.5, LAND);
  if (p <= 0 || out >= 1) return null;
  const TRACK = 300;
  return (
    <div style={{ position: "absolute", left: CONSOLE.x, top: CONSOLE.y, width: CONSOLE.w, height: CONSOLE.h, boxSizing: "border-box", borderRadius: 24, background: C.white, border: `1px solid ${C.line}`,
      boxShadow: SHADOW_BIG, padding: "26px 34px", fontFamily: FONT, opacity: clamp01(p * 1.8) * (1 - out), transform: `scale(${mix(0.82, 1, p) * mix(1, 0.86, out)})`,
      filter: p < 1 || out > 0 ? `blur(${(1 - p) * 12 + out * 10}px)` : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <Ico n="sliders" s={28} c={C.violet} w={2.2} />
        <div style={{ fontWeight: 700, fontSize: 27, color: C.ink, letterSpacing: "-0.02em" }}>Art direction</div>
      </div>
      {AD.map((r, i) => {
        const q = k(g, SLIDER_AT[i], 0.27, SNAP), ck = kf(g, f(SLIDER_AT[i]) + 4, 8, SNAP);
        const pos = mix(0.3, r.at, q);
        return (
          <div key={r.key} style={{ display: "flex", alignItems: "center", height: 78, borderTop: i ? `1px solid ${C.mist}` : undefined }}>
            <div style={{ width: 300, flex: "none" }}>
              <div style={{ fontWeight: 600, fontSize: 20, letterSpacing: "0.13em", color: q > 0.5 ? C.violet : C.soft }}>{r.key}</div>
              <div style={{ position: "relative", height: 36, marginTop: 2 }}>
                <div style={{ position: "absolute", left: 0, top: 0, fontSize: 28, fontWeight: 600, color: C.soft, opacity: 1 - q }}>—</div>
                <div style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", opacity: q, transform: `scale(${mix(0.9, 1, q)})`, transformOrigin: "0 50%",
                  fontSize: 28, fontWeight: 600, letterSpacing: "-0.015em", color: C.ink, fontFamily: i === 1 ? SERIF : FONT }}>
                  {i === 0 && <><span style={{ width: 20, height: 20, borderRadius: "50%", background: FJ.pine, flex: "none" }} /><span style={{ width: 20, height: 20, borderRadius: "50%", background: FJ.ember, marginLeft: -16, boxShadow: `0 0 0 2px ${C.white}`, flex: "none" }} /></>}
                  {r.val}
                </div>
              </div>
            </div>
            <div style={{ width: TRACK, height: 8, borderRadius: 4, background: C.mist, position: "relative", marginLeft: 36 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: pos * TRACK, borderRadius: 4, background: q > 0 ? `linear-gradient(90deg, ${C.purple}, ${C.blue})` : C.line, opacity: mix(0.5, 1, q) }} />
              <div style={{ position: "absolute", left: pos * TRACK - 13, top: -9, width: 26, height: 26, borderRadius: "50%", background: C.white, border: `2.5px solid ${q > 0 ? C.blue : C.soft}`, boxSizing: "border-box",
                boxShadow: "0 3px 8px rgba(38,35,44,0.18)" }} />
            </div>
            <div style={{ flex: 1 }} />
            <Check size={30} p={ck} />
          </div>
        );
      })}
    </div>
  );
};

export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sE") || g >= f("sF")) return null;
  return (
    <>
      <Shelf g={g} />
      <IdeaLine g={g} />
      <Console g={g} />
      <Draft g={g} />
      <Grid g={g} />
    </>
  );
};

// the chip as it rests under the draft (F carries it out); same look as the end of the Grid's carry
export const FormChip: React.FC<{ g: number }> = ({ g }) => {
  const to = tagsOut(g);
  if (to >= 1) return null;
  const cb = chipBoxAt(draftBox(g));
  return (
    <div style={{ position: "absolute", left: cb.x, top: cb.y, width: cb.w, height: cb.h, boxSizing: "border-box", borderRadius: 24, overflow: "hidden", background: C.lavender,
      border: `1.5px solid ${C.violet}`, boxShadow: "0 10px 24px -12px rgba(75,42,154,0.45)", opacity: 1 - to, transform: `scale(${mix(1, 0.8, to)})`, filter: to > 0 ? `blur(${to * 10}px)` : undefined,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontFamily: FONT, fontWeight: 600, fontSize: 22, color: C.lavenderInk, whiteSpace: "nowrap" }}>
      <Glyph i={CHOSEN} s={22} c={C.violet} />Feature tour
    </div>
  );
};
