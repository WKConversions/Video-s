// K.B blog loop: "Still Retyping WhatsApp Orders by Hand? How to Automate Them Into Your CRM".
// 12 s seamless loop, 1920x1080, 30 fps, no audio. Before (left) / after (right), split by a sky-blue divider.
// Every value is a pure function of the frame; at 12 s the picture is back to frame 0 exactly.
// Key action sits inside the centred square x 420-1500, so a 1080x1080 centre crop works too.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";

export const FPS = 30, DUR = 360, W = 1920, H = 1080;
const C = { navy: "#293A51", navy2: "#3A4E69", off: "#F7F7F7", slate: "#E2E8F0", char: "#252525", muted: "#49525B", sky: "#38C8FF" };
const F = "Montserrat, sans-serif";
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** eased 0..1 between a and b seconds */
const E = (t: number, a: number, b: number) => ease(clamp((t - a) / (b - a)));
/** in over [a,b], out over [c,d]: 0..1..0 */
const inOut = (t: number, a: number, b: number, c: number, d: number) => E(t, a, b) * (1 - E(t, c, d));
const rnd = (k: number) => { const s = Math.sin(k * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------------------------------------------------------------- font (held until it is in and drawn)
let fontReady = false;
const useFont = () => {
  const [ok, setOk] = useState(fontReady);
  const [h] = useState<number | null>(() => (fontReady ? null : delayRender("font")));
  useEffect(() => {
    if (fontReady) { setOk(true); return; }
    const face = new FontFace("Montserrat", `url(${staticFile("fonts/montserrat-var-latin.woff2")})`, { weight: "100 900" });
    face.load().then((f) => { document.fonts.add(f); return Promise.all([400, 600, 700].map((w) => document.fonts.load(`${w} 40px Montserrat`))); })
      .then(() => { fontReady = true; setOk(true); });
  }, []);
  useEffect(() => { if (ok && h !== null) continueRender(h); }, [ok, h]);
  return ok;
};

// ---------------------------------------------------------------- layout (film px)
const COLW = 480, LX = 450, RX = 990;                // left column centred at 690, right at 1230; divider at 960 (30 px clear)
const PILL_Y = 182, PILL_H = 56;
const BUB_Y = 278, BUB_H = 92;
const CARD_Y = 482, CARD_H = 330, PADX = 30;
const ROW0 = 30, PITCH = 96, BOX_DY = 34, BOX_H = 46;
const LINK_X = 50;                                   // connector: from the bubble's lower left to the card's top edge

// the order, as "typed" glyph blocks (only the brief's words appear as text): letter widths per word
const FIELDS = [
  { label: "Customer", words: [[14, 12, 13, 12], [13, 11, 12, 15]], boxW: COLW - 2 * PADX },
  { label: "Address", words: [[12, 13], [14, 12, 11, 13, 12, 11, 14, 12]], boxW: COLW - 2 * PADX },
  { label: "Qty", words: [[13, 13]], boxW: 140 },
];
const GH = 18, GAP = 5, WGAP = 16;
const GLYPHS = FIELDS.map((f) => {
  const out: { x: number; w: number }[] = []; let x = 18;
  f.words.forEach((wd, wi) => { if (wi > 0) x += WGAP - GAP; wd.forEach((w) => { out.push({ x, w }); x += w + GAP; }); });
  return out;
});
// before: hunt-and-peck typing, uneven, a pause between words and when moving to the next field
const KEYS: number[][] = (() => {
  let t = 0.4, k = 0;
  return FIELDS.map((f, fi) => {
    const ts: number[] = []; if (fi > 0) t += 0.2;
    f.words.forEach((wd, wi) => { if (wi > 0) t += 0.09; wd.forEach(() => { ts.push(t); t += 0.075 + 0.04 * rnd(++k); }); });
    return ts;
  });
})();
const FIRST = KEYS[0][0], LAST = KEYS[2][KEYS[2].length - 1];
const boxX = (cx: number) => cx + PADX;
const boxY = (fi: number) => CARD_Y + ROW0 + fi * PITCH + BOX_DY;

// ---------------------------------------------------------------- pieces
const abs = (x: number, y: number, w?: number, h?: number, more: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h, ...more });

const Bubble: React.FC<{ x: number }> = ({ x }) => (
  <div style={abs(x, BUB_Y, undefined, BUB_H, { display: "flex", alignItems: "center", padding: "0 34px", background: C.off, borderRadius: "16px 16px 16px 4px", boxShadow: "0 14px 34px rgba(8,16,30,.28)", color: C.char, fontSize: 34, fontWeight: 600, letterSpacing: -0.3, whiteSpace: "nowrap" })}>
    Same as last week
  </div>
);

const Glyphs: React.FC<{ fi: number; color: string; shown?: number; opacity?: number }> = ({ fi, color, shown = 99, opacity = 1 }) => (
  <>
    {GLYPHS[fi].slice(0, shown).map((g, i) => (
      <div key={i} style={abs(g.x, (BOX_H - GH) / 2, g.w, GH, { borderRadius: 4, background: color, opacity })} />
    ))}
  </>
);

/** the CRM form; kind "before" = grey, typed by hand; "after" = clean, filled at once */
const Form: React.FC<{ x: number; kind: "before" | "after"; t: number }> = ({ x, kind, t }) => {
  const before = kind === "before";
  return (
    <div style={abs(x, CARD_Y, COLW, CARD_H, { borderRadius: 16, background: before ? "rgba(226,232,240,.88)" : C.off, boxShadow: before ? "0 10px 26px rgba(8,16,30,.18)" : "0 18px 44px rgba(8,16,30,.34)" })}>
      {FIELDS.map((f, fi) => {
        const y = ROW0 + fi * PITCH;
        let inner: React.ReactNode;
        if (before) {
          const shown = KEYS[fi].filter((k) => k <= t).length;
          const reset = 1 - E(t, 11.0 + 0.08 * fi, 11.3 + 0.08 * fi);  // the loop clears the typed order
          inner = reset > 0.001 ? <Glyphs fi={fi} color={C.muted} shown={shown} opacity={reset} /> : null;
        } else {
          const p = E(t, 7.0 + 0.08 * fi, 7.26 + 0.08 * fi);             // all fields at once, 80 ms apart
          inner = p > 0.001 ? <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${((1 - p) * 100).toFixed(3)}% 0 0)` }}><Glyphs fi={fi} color={C.char} /></div> : null;
        }
        return (
          <React.Fragment key={f.label}>
            <div style={abs(PADX, y, undefined, 26, { fontSize: 22, fontWeight: 600, color: C.muted, letterSpacing: 0.2, lineHeight: "26px" })}>{f.label}</div>
            <div style={abs(PADX, y + BOX_DY, f.boxW, BOX_H, { borderRadius: 10, background: before ? "rgba(247,247,247,.8)" : C.slate, border: before ? "1px solid #CBD5E1" : "none", boxSizing: "border-box", overflow: "hidden" })}>
              {inner}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** the before side's text cursor: solid while typing, blinking when idle; moves field to field; reset by the loop */
const Cursor: React.FC<{ t: number }> = ({ t }) => {
  if (t >= 11.0 && t < 11.5) return null;                                // hidden while the form clears
  let fi = 0, n = 0;
  if (t < 11.0) {
    for (let i = 1; i < FIELDS.length; i++) if (t >= KEYS[i][0] - 0.14) fi = i;
    n = KEYS[fi].filter((k) => k <= t).length;
  }
  const typing = t >= FIRST - 0.05 && t <= LAST + 0.45;
  const on = typing || (t + 0.1) % 1 < 0.55;
  if (!on) return null;
  const gx = n > 0 ? GLYPHS[fi][n - 1].x + GLYPHS[fi][n - 1].w + 5 : 18;
  return <div style={abs(boxX(LX) + gx, boxY(fi) + 10, 2.5, 26, { background: C.char })} />;
};

const Clock: React.FC<{ s: number; c: string }> = ({ s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="2" /><path d="M12 7v5l3.2 2" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// ---------------------------------------------------------------- the loop
export const Loop: React.FC = () => {
  const ok = useFont();
  const t = useCurrentFrame() / FPS;
  if (!ok) return <AbsoluteFill style={{ background: C.navy }} />;

  const divider = E(t, 3.05, 4.45) * (1 - E(t, 10.7, 11.3));            // draws down; retracts upwards
  const lighten = E(t, 4.0, 5.3) * (1 - E(t, 10.8, 11.4));
  const strike = E(t, 8.6, 9.15) * (1 - E(t, 10.75, 11.15));            // draws on, then undraws
  const dim = E(t, 8.85, 9.25) * (1 - E(t, 10.8, 11.2));
  // right side: [in start, in end, out start, out end]
  const bub = inOut(t, 5.55, 6.05, 10.74, 11.14), card = inOut(t, 5.8, 6.35, 10.66, 11.06);
  const link = E(t, 6.3, 6.9), node = E(t, 6.82, 7.02);
  const rev = inOut(t, 7.55, 8.0, 10.58, 10.98), tick = E(t, 7.85, 8.15);
  const back = inOut(t, 9.0, 9.5, 10.5, 10.9);
  const slide = (a: number, b: number, c: number, d: number) => (1 - E(t, a, b)) * 26 + E(t, c, d) * 16;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 100%)`, fontFamily: F, overflow: "hidden" }}>
      {/* the right half lightens once it is split off */}
      {lighten > 0.001 && <div style={abs(960, 0, 960, 1080, { background: "linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.04))", opacity: lighten })} />}

      {/* ---------------- BEFORE (left) ---------------- */}
      <div style={abs(LX, PILL_Y, undefined, PILL_H, { display: "flex", alignItems: "center", gap: 12, padding: "0 24px 0 20px", borderRadius: PILL_H / 2, background: "rgba(226,232,240,.92)" })}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: 1 - 0.45 * dim }}>
          <Clock s={27} c={C.muted} /><span style={{ fontSize: 26, fontWeight: 700, color: C.muted, letterSpacing: -0.2, whiteSpace: "nowrap" }}>2 hrs/day</span>
        </div>
        {strike > 0.001 && <div style={{ position: "absolute", left: -10, right: -10, top: PILL_H / 2 - 1.5, height: 3, borderRadius: 2, background: C.sky, transformOrigin: "0 50%", transform: `scaleX(${strike.toFixed(5)})`, willChange: "transform" }} />}
      </div>
      <Bubble x={LX} />
      <Form x={LX} kind="before" t={t} />
      <Cursor t={t} />

      {/* ---------------- THE DIVIDE ---------------- */}
      {divider > 0.001 && <div style={abs(959, 0, 2, 1080, { background: C.sky, transformOrigin: "50% 0", transform: `scaleY(${divider.toFixed(5)})`, willChange: "transform" })} />}

      {/* ---------------- AFTER (right) ---------------- */}
      {card > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: card, transform: `translate3d(0, ${slide(5.8, 6.35, 10.66, 11.06).toFixed(3)}px, 0)`, willChange: "transform" }}>
          <Form x={RX} kind="after" t={t} />
        </div>
      )}
      {link > 0.001 && card > 0.001 && (
        <div style={{ opacity: card }}>
          <div style={abs(RX + LINK_X - 1, BUB_Y + BUB_H, 2, CARD_Y - BUB_Y - BUB_H, { background: C.sky, transformOrigin: "50% 0", transform: `scaleY(${link.toFixed(5)})`, willChange: "transform" })} />
          {node > 0.001 && <div style={abs(RX + LINK_X - 6, CARD_Y - 6, 12, 12, { borderRadius: 6, background: C.sky, opacity: node, transform: `scale(${(0.4 + 0.6 * node).toFixed(4)})` })} />}
        </div>
      )}
      {bub > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: bub, transform: `translate3d(0, ${slide(5.55, 6.05, 10.74, 11.14).toFixed(3)}px, 0)`, willChange: "transform" }}>
          <Bubble x={RX} />
        </div>
      )}
      {rev > 0.001 && (
        <div style={abs(0, 0, undefined, undefined, { opacity: rev, transform: `translate3d(${((1 - E(t, 7.55, 8.0)) * -30).toFixed(3)}px, ${(E(t, 10.58, 10.98) * 16).toFixed(3)}px, 0)`, willChange: "transform" })}>
          <div style={abs(RX, CARD_Y + CARD_H + 30, undefined, PILL_H, { display: "flex", alignItems: "center", gap: 12, padding: "0 26px 0 18px", borderRadius: PILL_H / 2, background: C.off, boxShadow: "0 10px 26px rgba(8,16,30,.25)", whiteSpace: "nowrap" })}>
            <svg width={28} height={28} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={C.sky} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tick} /></svg>
            <span style={{ fontSize: 26, fontWeight: 600, color: C.char, letterSpacing: -0.2 }}>Reviewed</span>
          </div>
        </div>
      )}
      {back > 0.001 && (
        <div style={abs(0, 0, undefined, undefined, { opacity: back, transform: `translate3d(0, ${slide(9.0, 9.5, 10.5, 10.9).toFixed(3)}px, 0)`, willChange: "transform" })}>
          <div style={abs(RX, PILL_Y, undefined, PILL_H, { display: "flex", alignItems: "center", padding: "0 26px", borderRadius: PILL_H / 2, background: "rgba(41,58,81,.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.14)", boxSizing: "border-box", color: "#fff", fontSize: 26, fontWeight: 600, letterSpacing: -0.2, whiteSpace: "nowrap" })}>
            Back to your team
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
