// Scene A — the hook and the overview (0 → s1). "K.B. Network Intelligence is a system that turns everyday
// information into real business opportunities." The K.B mark (300 px) builds with its name and a breathing cyan ring
// under a slow push; on "turns" it rises and becomes the system in the middle of one frame-wide picture: eight
// everyday fragments drift in from the edges on slow paths, stream into the mark along curved flow lines (the mark
// pulses as it processes), and four opportunity cards fan out on the right, one per word, while the two-tone statement
// (112 px) builds below. "Here's how it works" (the music's entry): the picture leaves, the axis swings into the map's
// spine and the PipelineMap builds row by row, each rising 30 px. Calm and exact at s1 (the map with all defaults and
// the legend, at camera identity); scene B draws s1 itself.
import React from "react";
import { ARRIVE, C, CARD, DEPART, FONT, Flow, Ico, KBMark, LIN, MAP, MOVE, MapLegend, OPPS, PipelineMap, Say, clamp01, f, k, kf, mix } from "../shared";

// a label shifted by s seconds ("w:into" + 0.2 -> "w:into+0.20")
const at = (label: string, s: number) => `${label}${s >= 0 ? "+" : "-"}${Math.abs(s).toFixed(2)}`;

// the mark's soft cyan ring: a breathing halo and slow ripples (the agent's ring, at logo scale). o fades it.
const Breath: React.FC<{ g: number; x: number; y: number; d: number; o: number; from: number }> = ({ g, x, y, d, o, from }) => {
  if (o <= 0) return null;
  const br = Math.sin((g - from) / 14);
  return (
    <>
      <div style={{ position: "absolute", left: x - d, top: y - d, width: 2 * d, height: 2 * d, borderRadius: "50%", opacity: o * (0.75 + 0.25 * br),
        transform: `scale(${1 + 0.06 * br})`, background: "radial-gradient(closest-side, rgba(102,184,219,0.30), rgba(102,184,219,0.10) 55%, rgba(102,184,219,0))" }} />
      {[0, 1 / 3, 2 / 3].map((ph) => {
        const t = ((((g - from) / 45 + ph) % 1) + 1) % 1, r = d * (0.48 + 0.72 * t);
        return <div key={ph} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", boxSizing: "border-box",
          border: `5px solid rgba(33,138,179,${0.42 * o * (1 - t) * Math.min(1, t * 5) * Math.min(1, (g - from) / 10)})` }} />;
      })}
    </>
  );
};

// an everyday fragment: a white pill with a 56 px mist tile and a slate icon, 28 px label
const Frag: React.FC<{ icon: string; t: string }> = ({ icon, t }) => (
  <div style={{ ...CARD, borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 14, padding: "8px 24px 8px 8px", whiteSpace: "nowrap",
    boxShadow: "0 18px 36px -20px rgba(41,58,81,0.32), 0 3px 10px rgba(41,58,81,0.05)" }}>
    <div style={{ width: 56, height: 56, borderRadius: 15, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={icon} s={30} c={C.slate} w={2.1} /></div>
    <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, letterSpacing: "-0.02em", color: C.ink }}>{t}</div>
  </div>
);
// an opportunity: a white card with a cyan tile, title 30 px and the PDF's one-line purpose
const Opp: React.FC<{ i: number }> = ({ i }) => {
  const d = OPPS[i];
  return (
    <div style={{ ...CARD, width: 410, borderRadius: 22, display: "flex", alignItems: "center", gap: 18, padding: "14px 24px 14px 14px", border: "1.5px solid #CFE3EE" }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: C.cyanTint, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n={d.icon} s={32} c={C.cyan} w={2.1} /></div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap" }}>{d.t}</div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 21, color: C.cyanDeep, whiteSpace: "nowrap" }}>{d.sub}</div>
      </div>
    </div>
  );
};

const CY = 360;                                   // the picture's axis (the mark's centre in the picture)
const MARK_X = 960, IN_X = MARK_X - 112, OUT_X = MARK_X + 112, CARD_X = 1335;
// the fragments: where each floats (x, y = centre); vx = the direction of its slow orbit, vy = its phase
const FRAGS = [
  { icon: "chat", t: "Conversation", x: 300, y: 112, vx: 1, vy: 0 }, { icon: "mail", t: "Email", x: 640, y: 180, vx: -1, vy: 1 },
  { icon: "hash", t: "Slack thread", x: 290, y: 250, vx: 1, vy: 2 }, { icon: "meeting", t: "Meeting", x: 610, y: 318, vx: -1, vy: 3 },
  { icon: "wave", t: "Transcript", x: 300, y: 388, vx: 1, vy: 4 }, { icon: "mic", t: "Voice note", x: 630, y: 458, vx: -1, vy: 5 },
  { icon: "doc", t: "Document", x: 280, y: 526, vx: 1, vy: 6 }, { icon: "phone", t: "Phone call", x: 600, y: 594, vx: -1, vy: 7 },
];
const OUTS = [{ i: 0, at: "w:real", d: 0 }, { i: 1, at: "w:business", d: 0 }, { i: 2, at: "w:opportunities", d: 0 }, { i: 3, at: "w:opportunities", d: 0.4 }];
const outY = (i: number) => CY + (i - 1.5) * 116;

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  if (g < 0 || g >= f("s1")) return null;   // s1 itself is drawn by scene B (the same frame)
  const sec = g / 30;

  /* ---- the hook camera: a slow push during each hold (1.0 → 1.06 on the lockup; it eases back as the lockup
     rises, then 1.0 → 1.06 again across the picture) ---- */
  const camH = 1 + 0.06 * kf(g, f("w:kb+0.2"), f("w:turns") - f("w:kb+0.2"), MOVE) * (1 - k(g, "w:turns-0.1", 0.75, MOVE))
    + 0.06 * kf(g, f("w:everyday"), f("w:heres-0.5") - f("w:everyday"), LIN);
  const hs = (x: number, y: number) => ({ x: (x - 960) * camH + 960, y: (y - 500) * camH + 500 });

  /* ---- the lockup: builds at centre, rises and shrinks into the picture's middle (the title leaves), then leaves ---- */
  const rise = k(g, "w:turns-0.1", 0.75, MOVE);
  const gone = k(g, "w:heres-0.5", 0.36, DEPART);
  const ls = mix(1, 0.62, rise) * (1 - 0.75 * gone);
  const ly = mix(420, CY, rise);
  const titleO = 1 - clamp01(rise * 1.6);
  // the mark pulses as it processes (each pulse as a stream of packets lands)
  const proc = k(g, "w:into", 0.4, LIN) * (1 - gone);
  const ph = (((g - f("w:into")) / 18) % 1 + 1) % 1;
  const pulse = 1 + 0.045 * proc * Math.pow(1 - ph, 3);

  /* ---- the statement and the picture leave before the map ---- */
  const leave = k(g, "w:heres-0.5", 0.4, DEPART);

  /* ---- the axis that swings into the spine ---- */
  const swing = k(g, "w:heres-0.38", 0.5, MOVE);
  const top = MAP.rows[0].y + MAP.pillH / 2 + 4, bot = MAP.rows[MAP.rows.length - 1].y - MAP.pillH / 2 - 4;
  const a0 = hs(IN_X - 60, CY), b0 = hs(CARD_X, CY);
  const sx1 = mix(a0.x, MAP.spineX, swing), sy1 = mix(a0.y, top, swing), sx2 = mix(b0.x, MAP.spineX, swing), sy2 = mix(b0.y, bot, swing);
  const spineO = clamp01((g - f("w:heres-0.5")) / 3) * (1 - k(g, "w:heres+0.25", 0.3, LIN));

  /* ---- the map: rows and gates in the map's order, top to bottom from w:heres, each rising 30 px ---- */
  const H0 = f("w:heres"), STEP = 1.7, DUR = 9;
  const vOf = (j: number) => clamp01((g - H0 - j * STEP) / DUR);
  const built = g >= H0 + (MAP.rows.length - 1) * STEP + DUR;
  const mapOn = g >= H0;
  const cam = mix(1.045, 1, kf(g, H0, f("s1") - 3 - H0, MOVE));
  const legendO = k(g, "w:works+0.05", 0.4);
  const zeros7 = [0, 0, 0, 0, 0, 0, 0], zeros4 = [0, 0, 0, 0];
  // layers first, then gates (gates sit over the spine, as in the single map)
  const order = MAP.rows.map((r, j) => ({ r, j })).sort((a, b) => (a.r.kind === b.r.kind ? a.j - b.j : a.r.kind === "layer" ? -1 : 1));

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the axis that becomes the spine */}
      {spineO > 0 && (
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
          <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={C.faint} strokeWidth={2.5} strokeLinecap="round" opacity={spineO} />
        </svg>
      )}

      {/* the overview map, row by row; camera settles to identity before s1 */}
      {mapOn && (
        <div style={{ position: "absolute", inset: 0, transform: cam !== 1 ? `scale(${cam})` : undefined, transformOrigin: "960px 540px" }}>
          {built ? <PipelineMap g={g} /> : order.map(({ r, j }) => {
            const v = vOf(j);
            if (v <= 0) return null;
            const rows = r.kind === "layer" ? zeros7.map((_, i) => (i === r.n - 1 ? v : 0)) : zeros7;
            const gates = r.kind === "gate" ? zeros4.map((_, i) => (i === r.n - 1 ? v : 0)) : zeros4;
            return <div key={j} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - ARRIVE(v)) * 30}px)` }}><PipelineMap g={g} rows={rows} gates={gates} /></div>;
          })}
          {legendO > 0 && <div style={{ position: "absolute", inset: 0, transform: legendO < 1 ? `translateY(${(1 - legendO) * 20}px)` : undefined }}><MapLegend x={120} y={1000} o={legendO} /></div>}
        </div>
      )}

      {/* the hook world (slow push) */}
      {(leave < 1 || gone < 1) && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${camH})`, transformOrigin: "960px 500px" }}>
          {/* the picture: everyday fragments → the mark → opportunities */}
          {leave < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
              {/* fragments: drift in from the edges on "everyday information", then keep drifting on slow paths */}
              {FRAGS.map((fr, i) => {
                const inn = k(g, at("w:everyday", -0.15 + i * 0.07), 0.95);
                if (inn <= 0) return null;
                // a slow orbit (30 × 16 px, about 5 s a turn), entering from the left edge, fanned a little up or down
                const th = fr.vx * (sec / 5) * 2 * Math.PI + fr.vy * 0.9;
                const x = fr.x + 30 * Math.cos(th) - (620 + (i % 2) * 140) * (1 - inn), y = fr.y + 16 * Math.sin(th) + (fr.y - CY) * 0.45 * (1 - inn) * (fr.y > CY ? 0.4 : 1);
                const line = k(g, at("w:into", -0.15 + i * 0.06), 0.5);
                const by = (CY - y) / (2 * Math.max(60, IN_X - x));
                return (
                  <React.Fragment key={i}>
                    <Flow x1={x} y1={y} x2={IN_X} y2={CY} bend={by} p={line} g={g + i * 11} packets={2} speed={0.75} pcolor={C.navy} width={2.4} />
                    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * inn})`, opacity: clamp01(inn * 1.5) }}>
                      <Frag icon={fr.icon} t={fr.t} />
                    </div>
                  </React.Fragment>
                );
              })}
              {/* the output fan and the opportunity cards: one per word, staggered */}
              {OUTS.map((o) => {
                const y = outY(o.i), by = (CY - y) / (2 * (CARD_X - OUT_X));
                const ln = k(g, at(o.at, o.d - 0.12), 0.38), p = k(g, at(o.at, o.d + 0.08), 0.6);
                return (
                  <React.Fragment key={o.i}>
                    <Flow x1={OUT_X} y1={CY} x2={CARD_X + 4} y2={y} bend={by} p={ln} g={g + o.i * 9} packets={2} speed={0.7} pcolor={C.cyan} color={C.cyanLight} width={2.4} />
                    {p > 0 && <div style={{ position: "absolute", left: CARD_X, top: y, transform: `translate(${(1 - p) * -60}px, -50%) scale(${0.92 + 0.08 * p})`, transformOrigin: "0 50%", opacity: clamp01(p * 1.8) }}>
                      <Opp i={o.i} />
                    </div>}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* the lockup (the system in the middle of the picture) */}
          {gone < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - gone, transform: `translateY(${ly - 420}px) scale(${ls})`, transformOrigin: "960px 420px" }}>
              <Breath g={g} x={960} y={420} d={330} o={k(g, "w:network", 0.8)} from={f("w:network")} />
              <div style={{ position: "absolute", left: 960 - 150, top: 270, width: 300, height: 300, transform: `scale(${pulse})` }}>
                <KBMark size={300} p={kf(g, f("hook"), 33, LIN)} />
              </div>
              {titleO > 0 && <div style={{ position: "absolute", inset: 0, opacity: titleO }}>
                <Say g={g} y={622} size={96} words={[{ t: "Network", at: "w:network" }, { t: "Intelligence", at: "w:intelligence" }]} />
              </div>}
            </div>
          )}

          {/* the statement: ink, then slate */}
          <Say g={g} y={698} size={112} out="w:heres-0.5" words={[
            { t: "Everyday", at: "w:everyday" }, { t: "information.", at: "w:information" },
            { t: "Real", at: "w:real", slate: true, br: true }, { t: "business", at: "w:business", slate: true }, { t: "opportunities.", at: "w:opportunities", slate: true },
          ]} />
        </div>
      )}
    </div>
  );
};
