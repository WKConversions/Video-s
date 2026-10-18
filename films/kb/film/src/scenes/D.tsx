// Scene D — layer 4, intelligence (s2 → sD). The knowledge base slides aside and the Opportunity agent reads it
// through a dotted read-only line (the eye: it reads, never writes); the camera travels right as external signals
// (trends, news, funding, hiring) stream in; then the camera lifts the cluster and the agent scores four
// opportunities, one per spoken word, into the row that hands off to scene E. Starts exactly on the s2 state
// (layer tag 3 + the full core), ends exactly on sD (layer tag 4 + the four cards).
import React from "react";
import { C, Chip, CoreNode, FONT, Flow, Ico, LayerTag, MOVE, NodeCard, OPP, OppCard, POP, SNAP, clamp01, f, k, kf } from "../shared";

// exact at the ends, so hand-off frames are pixel-identical
const lerp = (a: number, b: number, t: number) => (t <= 0 ? a : t >= 1 ? b : a + (b - a) * t);

// world layout (the camera frames it): core left, agent centre, external signals right
const MID_Y = 560;
const CORE_X = 360;
const AG_X = 1030, AG_W = 560, AG_Z = 1.45, AG_HH = 61;
const SIG: [string, string][] = [["trend", "Trends"], ["news", "News"], ["coins", "Funding"], ["users", "Hiring signals"]];
const SIG_X = 1680, SIG_DY = 68, SIG_Y0 = MID_Y - 1.5 * SIG_DY;
const LANE_A = SIG_X - 16, LANE_B = AG_X + AG_W / 2 + 14;
const SPAWN = ["w:partnerships", "w:referrals", "w:investments", "w:within"];

export const SceneD: React.FC<{ g: number }> = ({ g }) => {
  const A = f("s2"), B = f("sD");
  if (g < A || g >= B) return null;

  // the layer marker: 3 out, 4 in, on "AI"
  const tagOut = k(g, "s2+0.05", 0.25, SNAP), tagIn = k(g, "w:ai", 0.5);

  // "AI then analyzes this knowledge": the core slides left, the agent arrives and reads it (read-only)
  const cm = k(g, "s2", 1.0, MOVE);
  const coreX = lerp(960, CORE_X, cm);
  const agIn = k(g, "w:ai+0.2", 0.9);
  const rd = k(g, "w:analyzes", 0.55, MOVE);
  const eye = k(g, "w:analyzes+0.3", 0.4, POP);
  const work = k(g, "w:analyzes", 0.6);
  const breath = 0.72 + 0.28 * Math.sin(g / 6);
  // "alongside external data": the source label and four signal chips stream in from the right, then their lanes
  // carry signal tokens into the agent
  const ext = k(g, "w:alongside", 0.55);
  const sig = (i: number) => kf(g, f("w:alongside") + 5 + i * 4, 22);
  const lane = (i: number) => kf(g, f("w:data") - 2 + i * 3, 12, MOVE);
  const tokT0 = f("w:data") + 6;
  // "… within existing clients": the read sources light up under the core (it reads them, never writes)
  const src = (i: number) => k(g, `w:within+${0.1 + i * 0.15}`, 0.4, POP);

  // the camera: identity at s2; frames core + agent and pushes in slowly; travels right to take in the external
  // signals; lifts and pulls back so the opportunities can land in a row below; the cluster clears on "clients"
  const push1 = kf(g, f("w:ai+0.5"), f("w:alongside+0.3") - f("w:ai+0.5"), MOVE);
  const p2 = k(g, "w:alongside", 1.2, MOVE);
  const push2 = kf(g, f("w:alongside+0.9"), f("w:identifying") - f("w:alongside+0.9"), MOVE);
  const u = k(g, "w:identifying-0.1", 0.9, MOVE);
  const push3 = kf(g, f("w:identifying+0.7"), f("w:clients") - f("w:identifying+0.7"), MOVE);
  const cl = k(g, "w:clients-0.15", 0.65, MOVE);
  const cx = lerp(lerp(lerp(960, (CORE_X + AG_X) / 2, cm), (CORE_X + AG_X) / 2 + 90, push1), 1062, p2);
  const cs = lerp(lerp(lerp(1, 1.09, push1), 0.92, p2) * (1 + 0.05 * push2), 0.68, u) * (1 + 0.07 * push3);
  const cy = lerp(540, 957, u) + 118 * cl;
  const co = 1 - cl;
  const sx = (x: number) => 960 + (x - cx) * cs, sy = (y: number) => 540 + (y - cy) * cs;
  const camT = cx !== 960 || cy !== 540 || cs !== 1 ? `translate(${960 - cx * cs}px, ${540 - cy * cs}px) scale(${cs})` : undefined;

  // the row of opportunities (screen coordinates), settling to the hand-off position on "clients"
  const st = kf(g, f("w:clients") - 2, 28, MOVE);
  const rowY = lerp(680, OPP.y, st);
  // a slow push on the row while the cards land; it resolves exactly as the row settles
  const rp = 1 + 0.04 * kf(g, f("w:partnerships"), f("w:clients") - f("w:partnerships"), MOVE) * (1 - st);
  const rx = (x: number) => (rp === 1 ? x : 960 + (x - 960) * rp), ry = (y: number) => (rp === 1 ? y : 540 + (y - 540) * rp);
  const agX = sx(AG_X), agB = sy(MID_Y + AG_HH);

  // phase-2 camera over the whole picture: the recompose lands slightly closer and left (on the first slot), then it
  // drifts right with the cards as they land and resolves to identity at sD
  const gp = kf(g, f("w:identifying+0.8"), f("sD") - f("w:identifying+0.8"), MOVE);
  const gx = lerp(lerp(960, 760, u), 960, gp), gz = lerp(lerp(1, 1.08, u), 1, gp);
  const gT = gx !== 960 || gz !== 1 ? `translate(${960 - gx * gz}px, ${540 - 540 * gz}px) scale(${gz})` : undefined;

  const readA = coreX + 210 + 14, readB = AG_X - AG_W / 2 - 14, eyeX = (readA + readB) / 2;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {tagOut < 1 && <LayerTag n={3} p={1 - tagOut} />}
      <LayerTag n={4} p={tagIn} />

      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: gT }}>
      {co > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: camT, opacity: co < 1 ? co : undefined }}>
          {/* external signals → agent: lanes with tokens streaming in */}
          {SIG.map(([ic], i) => {
            const p = lane(i), y1 = SIG_Y0 + i * SIG_DY;
            if (p <= 0) return null;
            return (
              <React.Fragment key={`l${i}`}>
                <Flow x1={LANE_A} y1={y1} x2={LANE_B} y2={MID_Y} p={p} g={g} width={2.6} color={C.faint} packets={0} />
                {p >= 1 && [0, 1].map((n) => {
                  const t = ((((g - tokT0) / 34 + i * 0.27 + n * 0.5) % 1) + 1) % 1, on = clamp01((g - tokT0 - n * 17 - i * 4) / 6);
                  const x = LANE_A + (LANE_B - LANE_A) * t, y = y1 + (MID_Y - y1) * t, o = on * Math.min(1, t * 5, (1 - t) * 5);
                  if (o <= 0) return null;
                  return (
                    <div key={n} style={{ position: "absolute", left: x - 21, top: y - 21, width: 42, height: 42, borderRadius: "50%", background: C.white, opacity: o,
                      boxShadow: `inset 0 0 0 1.5px ${C.line}, 0 8px 16px -8px rgba(41,58,81,0.35)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ico n={ic} s={24} c={C.slate} w={2.2} />
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
          {/* the read-only line: core → agent, dotted, information packets travel toward the agent */}
          {rd > 0 && <Flow x1={readA} y1={MID_Y} x2={readB} y2={MID_Y} p={rd} g={g} dashed width={4.5} color={C.soft} packets={2} speed={0.8} pcolor={C.navy} />}
          <CoreNode x={coreX} y={MID_Y} fill={1} />
          {eye > 0 && (
            <div style={{ position: "absolute", left: eyeX, top: MID_Y, transform: `translate(-50%, -50%) scale(${eye})` }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.white, boxShadow: `inset 0 0 0 1.5px ${C.line}, 0 10px 22px -12px rgba(41,58,81,0.35)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico n="eye" s={36} c={C.slate} w={2.2} />
              </div>
            </div>
          )}
          {eye > 0 && (
            <div style={{ position: "absolute", left: eyeX, top: MID_Y + 58, transform: `translate(-50%, 0) translateY(${(1 - clamp01(eye)) * 10}px)`, opacity: clamp01(eye) }}>
              <Chip text="Read-only" size={24} tone="soft" />
            </div>
          )}
          {/* what it reads (it never writes back) */}
          {src(0) > 0 && (
            <div style={{ position: "absolute", left: CORE_X - 400, width: 800, top: MID_Y + 166, display: "flex", justifyContent: "center", gap: 18 }}>
              {[["users", "Ecosystem"], ["portal", "Client portal"]].map(([ic, t], i) => {
                const s = src(i);
                return <div key={t} style={{ transform: `scale(${s})`, opacity: clamp01(s * 2) }}><Chip text={t} icon={ic} size={30} /></div>;
              })}
            </div>
          )}
          {agIn > 0 && (
            <div style={{ position: "absolute", left: AG_X - AG_W / 2 + (1 - agIn) * 260, top: MID_Y - AG_HH, opacity: clamp01(agIn * 1.4) }}>
              <NodeCard kind="agent" icon="spark" title="Opportunity agent" sub="Spots synergies, scores them" w={AG_W} size={AG_Z} glow={work * breath} />
            </div>
          )}
          {/* external data: label + signal chips */}
          {ext > 0 && (
            <div style={{ position: "absolute", left: SIG_X + (1 - ext) * 160, top: SIG_Y0 - 104, display: "flex", alignItems: "center", gap: 16, opacity: ext }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="globe" s={30} c={C.slate} w={2.1} /></div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap" }}>External data</div>
            </div>
          )}
          {SIG.map(([ic, t], i) => {
            const s = sig(i);
            if (s <= 0) return null;
            return (
              <div key={t} style={{ position: "absolute", left: SIG_X + (1 - s) * 420, top: SIG_Y0 + i * SIG_DY, transform: "translateY(-50%)", opacity: clamp01(s * 1.5) }}>
                <Chip text={t} icon={ic} size={26} />
              </div>
            );
          })}
        </div>
      )}

      {/* the agent's output lines (AI output: cyan packets), each drawn as its opportunity is named */}
      {co > 0 && OPP.xs.map((x, i) => {
        const p = kf(g, i === 3 ? f("w:and2") : f(SPAWN[i]) - 2, 10, MOVE);
        if (p <= 0) return null;
        return (
          <div key={`o${i}`} style={{ position: "absolute", inset: 0, opacity: co }}>
            <Flow x1={agX} y1={agB + 8} x2={rx(x)} y2={ry(rowY - OPP.h / 2 - 10)} p={p} g={g + i * 9} width={2.8} color={C.faint} packets={2} speed={0.8} pcolor={C.cyan} />
          </div>
        );
      })}

      {/* "and opportunities": the agent opens a fourth slot, still scanning */}
      {(() => {
        const ph = k(g, "w:and2", 0.45), land = kf(g, f(SPAWN[3]) - 5, 26, MOVE), o = ph * (1 - land);
        if (o <= 0) return null;
        const sh = (d: number) => 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(g / 4 - d * 0.9));
        return (
          <div style={{ position: "absolute", left: rx(OPP.xs[3]) - OPP.w / 2, top: ry(rowY) - OPP.h / 2, width: OPP.w, height: OPP.h, borderRadius: 24, border: `3px dashed ${C.faint}`, boxSizing: "border-box",
            opacity: o, transform: `scale(${(0.92 + 0.08 * ph) * rp})`, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.cyanTint, opacity: sh(0) }} />
              <div>
                <div style={{ width: 170, height: 18, borderRadius: 9, background: C.faint, opacity: sh(1) }} />
                <div style={{ width: 120, height: 14, borderRadius: 7, background: C.line, marginTop: 10, opacity: sh(2) }} />
              </div>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: C.line, marginTop: 34, opacity: sh(3) }} />
          </div>
        );
      })()}

      {/* the four opportunities, one per word, flying out of the agent and scoring as they land */}
      {OPP.xs.map((x, i) => {
        const t0 = f(SPAWN[i]) - 5;
        if (g < t0) return null;
        const fl = kf(g, t0, 26, MOVE);
        return <OppCard key={i} i={i} x={lerp(agX, rx(x), fl)} y={lerp(agB, ry(rowY), fl)} s={lerp(0.2, 1, fl) * rp} o={clamp01(fl * 3)} p={kf(g, t0, 40, (t) => t)} />;
      })}
      </div>
    </div>
  );
};
