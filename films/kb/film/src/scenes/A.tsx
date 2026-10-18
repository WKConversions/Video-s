// Scene A — the hook and the overview (0 → s1). "K.B. Network Intelligence is a system that turns everyday
// information into real business opportunities." The K.B mark builds with its name and a breathing cyan ring; it
// rises and shrinks into the middle of one picture: everyday fragments (chat, meeting, mail, doc, voice) drift in from
// the edges, stream into a line into the mark, and leave as an ordered column of cyan opportunities, while the
// two-tone statement builds below. "Here's how it works": the statement leaves, the line swings into the map's spine
// and the PipelineMap builds layer by layer, top to bottom, from the music's entry on w:heres. Calm and exact at s1
// (the map with all defaults and the legend, at camera identity); scene B draws s1 itself.
import React from "react";
import { C, Chip, DEPART, Flow, KBMark, LIN, MAP, MOVE, MapLegend, OPPS, POP, Packet, PipelineMap, Say, clamp01, f, k, kf, mix } from "../shared";

// a label shifted by s seconds ("w:into" + 0.2 -> "w:into+0.20")
const at = (label: string, s: number) => `${label}${s >= 0 ? "+" : "-"}${Math.abs(s).toFixed(2)}`;

// the mark's soft cyan ring: a breathing halo and slow ripples (the agent's ring, at logo scale). o fades it.
const Breath: React.FC<{ g: number; x: number; y: number; d: number; o: number; from: number }> = ({ g, x, y, d, o, from }) => {
  if (o <= 0) return null;
  const br = Math.sin((g - from) / 14);
  return (
    <>
      <div style={{ position: "absolute", left: x - d, top: y - d, width: 2 * d, height: 2 * d, borderRadius: "50%", opacity: o * (0.75 + 0.25 * br),
        transform: `scale(${1 + 0.05 * br})`, background: "radial-gradient(closest-side, rgba(102,184,219,0.30), rgba(102,184,219,0.10) 55%, rgba(102,184,219,0))" }} />
      {[0, 1 / 3, 2 / 3].map((ph) => {
        const t = ((((g - from) / 54 + ph) % 1) + 1) % 1, r = d * (0.56 + 0.5 * t);
        return <div key={ph} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", boxSizing: "border-box",
          border: `3.5px solid rgba(33,138,179,${0.4 * o * (1 - t) * Math.min(1, t * 5) * Math.min(1, (g - from) / 10)})` }} />;
      })}
    </>
  );
};

// the everyday fragments: where they settle (left of the mark) before they stream into the line
const FRAGS = [
  { icon: "chat", t: "Conversation", x: 330, y: 282 }, { icon: "calendar", t: "Meeting", x: 615, y: 314 }, { icon: "mail", t: "Email", x: 232, y: 410 },
  { icon: "doc", t: "Document", x: 560, y: 478 }, { icon: "mic", t: "Voice note", x: 330, y: 552 },
];
// the opportunities: an ordered column right of the mark, one per spoken word
const OUTS = [
  { i: 0, y: 292, at: "w:real", d: 0 }, { i: 1, y: 364, at: "w:business", d: 0 }, { i: 2, y: 436, at: "w:opportunities", d: 0 }, { i: 3, y: 508, at: "w:opportunities", d: 0.3 },
];
const CY = 400;            // the picture's axis
const IN_X = 540, MARK_X = 960, OUT_X = 1330, MH = 86;   // MH: half the mark plus a margin, where lines meet it

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  if (g < 0 || g >= f("s1")) return null;   // s1 itself is drawn by scene B (the same frame)

  /* ---- the lockup: builds at centre, rises and shrinks into the picture's middle, then leaves ---- */
  const push = kf(g, f("w:kb+0.8"), f("w:turns") - f("w:kb+0.8"), MOVE);
  const rise = k(g, "w:turns-0.1", 0.7, MOVE);
  const gone = k(g, "w:heres-0.5", 0.36, DEPART);
  const ls = mix(1 + 0.035 * push, 0.6, rise) * (1 - 0.75 * gone);
  const ly = mix(450, CY, rise);
  const lockO = 1 - gone;

  /* ---- the statement and the picture leave before the map ---- */
  const leave = k(g, "w:heres-0.5", 0.4, DEPART);

  /* ---- the line that swings into the spine (the input/output axis → x = spineX) ---- */
  const swing = k(g, "w:heres-0.38", 0.5, MOVE);
  const top = MAP.rows[0].y + MAP.pillH / 2 + 4, bot = MAP.rows[MAP.rows.length - 1].y - MAP.pillH / 2 - 4;
  const sx1 = mix(IN_X, MAP.spineX, swing), sy1 = mix(CY, top, swing), sx2 = mix(OUT_X, MAP.spineX, swing), sy2 = mix(CY, bot, swing);
  const spineO = clamp01((g - f("w:heres-0.5")) / 3) * (1 - k(g, "w:heres+0.25", 0.3, LIN));

  /* ---- the map: rows and gates in the map's order, top to bottom, from w:heres ---- */
  const H0 = f("w:heres");
  const rows = [0, 0, 0, 0, 0, 0, 0], gates = [0, 0, 0, 0];
  MAP.rows.forEach((r, j) => {
    const v = clamp01((g - H0 - j * 1.6) / 9);
    if (r.kind === "layer") rows[r.n - 1] = v; else gates[r.n - 1] = v;
  });
  const mapOn = g >= H0;
  const cam = mix(1.045, 1, kf(g, H0, f("s1") - 3 - H0, MOVE));
  const legendO = k(g, "w:works+0.05", 0.4);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the axis that becomes the spine */}
      {spineO > 0 && (
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
          <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={C.faint} strokeWidth={2.5} strokeLinecap="round" opacity={spineO} />
        </svg>
      )}

      {/* the overview map, layer by layer; camera settles to identity before s1 */}
      {mapOn && (
        <div style={{ position: "absolute", inset: 0, transform: cam !== 1 ? `scale(${cam})` : undefined, transformOrigin: "960px 540px" }}>
          <PipelineMap g={g} rows={rows} gates={gates} />
          {legendO > 0 && <MapLegend x={120} y={1000} o={legendO} />}
        </div>
      )}

      {/* the picture: everyday fragments → the mark → opportunities */}
      {leave < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
          {/* the input line and its stream */}
          <Flow x1={IN_X} y1={CY} x2={MARK_X - MH} y2={CY} p={k(g, "w:into-0.2", 0.45)} g={g} packets={4} speed={1.0} pcolor={C.navy} />
          {/* the output fan */}
          {OUTS.map((o) => {
            const by = (CY - o.y) / (2 * (OUT_X - (MARK_X + MH)));
            return <Flow key={o.i} x1={MARK_X + MH} y1={CY} x2={OUT_X - 6} y2={o.y} bend={by} p={k(g, at(o.at, o.d - 0.12), 0.4)} g={g + o.i * 9} packets={2} speed={0.7} pcolor={C.cyan} color={C.cyanLight} width={2.2} />;
          })}
          {/* fragments: drift in from the edges on "everyday information", stream into the line on "into" */}
          {FRAGS.map((fr, i) => {
            const inn = k(g, at("w:everyday", -0.12 + i * 0.11), 0.85);
            if (inn <= 0) return null;
            const dx = fr.x - 900, dy = fr.y - CY, dl = Math.hypot(dx, dy);
            const drift = kf(g, f("w:everyday"), f("w:into") - f("w:everyday"), LIN);
            const bx = fr.x + (dx / dl) * 420 * (1 - inn) + (IN_X - 40 - fr.x) * 0.07 * drift;
            const byy = fr.y + (dy / dl) * 420 * (1 - inn) + (CY - fr.y) * 0.07 * drift;
            const q = k(g, at("w:into", -0.2 + i * 0.07), 0.5, MOVE);
            const x = mix(bx, IN_X, q), y = mix(byy, CY, q);
            const travel = k(g, at("w:into", 0.3 + i * 0.07), 0.38, MOVE);
            return (
              <React.Fragment key={i}>
                {q < 1 && <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${1 - 0.8 * q})`, opacity: Math.min(inn * 1.4, 1) * (1 - q) }}>
                  <Chip text={fr.t} icon={fr.icon} size={26} style={{ boxShadow: `inset 0 0 0 1px ${C.line}, 0 10px 22px -14px rgba(41,58,81,0.3)` }} />
                </div>}
                {q > 0.3 && travel < 1 && <Packet x={mix(x, MARK_X - MH + 8, travel)} y={y} r={8} o={clamp01((q - 0.3) * 3)} />}
              </React.Fragment>
            );
          })}
          {/* opportunities: a cyan chip per word */}
          {OUTS.map((o) => {
            const p = k(g, at(o.at, o.d + 0.12), 0.5), s = POP(clamp01(p * 1.3));
            if (p <= 0) return null;
            const d = OPPS[o.i];
            return <div key={o.i} style={{ position: "absolute", left: OUT_X, top: o.y, transform: `translate(${(1 - p) * -24}px, -50%) scale(${0.7 + 0.3 * s})`, transformOrigin: "0 50%", opacity: clamp01(p * 2) }}>
              <Chip text={d.t} icon={d.icon} tone="cyan" size={27} />
            </div>;
          })}
        </div>
      )}

      {/* the lockup (the system in the middle of the picture) */}
      {lockO > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: lockO, transform: `translateY(${ly - 450}px) scale(${ls})`, transformOrigin: "960px 450px" }}>
          <Breath g={g} x={960} y={450} d={250} o={k(g, "w:intelligence-0.1", 0.8)} from={f("w:intelligence-0.1")} />
          <KBMark size={220} p={kf(g, f("hook"), 33, LIN)} style={{ position: "absolute", left: 960 - 110, top: 340 }} />
          <Say g={g} y={604} size={72} words={[{ t: "Network", at: "w:network" }, { t: "Intelligence", at: "w:intelligence" }]} />
        </div>
      )}

      {/* the statement: ink, then slate */}
      <Say g={g} y={690} size={70} out="w:heres-0.5" words={[
        { t: "Everyday", at: "w:everyday" }, { t: "information.", at: "w:information" },
        { t: "Real", at: "w:real", slate: true, br: true }, { t: "business", at: "w:business", slate: true }, { t: "opportunities.", at: "w:opportunities", slate: true },
      ]} />
    </div>
  );
};
