// Scene H — the loop and the end card (s5 → end). "Every outcome feeds back into the knowledge base, continuously
// improving the information available for future decisions." From the navy dot of s5: the PipelineMap builds around
// it (from the middle row outward), the dot (the outcome) drops to layer 7, then draws the cyan feedback loop up the
// right side into layer 3, which glows. On "continuously" the four gates approve and the loop keeps cycling; on
// "improving" the camera leans in, the other layers recede and the knowledge base fills; on "the information
// available for future decisions" the improved knowledge runs down the spine as cyan packets, waking layers 4–7.
// From about 60.5 s the map pulls back into the end card: the K.B mark, "Network Intelligence" and "From everyday
// information to real opportunities." (slate), the last word and a ripple on the music's last hit (w:decisions+2.05).
import React from "react";
import { ARRIVE, C, Chip, KBMark, LIN, MAP, MOVE, POP, Packet, PipelineMap, SNAP, Say, clamp01, f, k, kf, mapNodeX, mapRowY, mix } from "../shared";

const at = (label: string, s: number) => `${label}${s >= 0 ? "+" : "-"}${Math.abs(s).toFixed(2)}`;
const invArrive = (y: number) => { let a = 0, b = 1; for (let i = 0; i < 22; i++) { const m = (a + b) / 2; if (ARRIVE(m) < y) a = m; else b = m; } return (a + b) / 2; };

// the feedback loop's geometry, as PipelineMap draws it (layer 7 → right edge → layer 3)
const Y7 = mapRowY(7), Y3 = mapRowY(3), XR = 1790, X7 = 1300, X3 = 1588, RC = 30;
const LDASH = (XR - X7) + (Y7 - Y3) + (XR - X3);            // the dash length the map uses
const quad = (t: number, a: number, c: number, b: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
const QL = 45.9;                                            // length of a 30 px rounded corner
const SEGS = [XR - RC - X7, QL, (Y7 - RC) - (Y3 + RC), QL, (XR - RC) - X3];
const LREAL = SEGS.reduce((a, b) => a + b, 0);
// a point at distance d along the drawn loop
const loopAt = (d: number) => {
  let s = Math.max(0, Math.min(LREAL, d));
  if (s < SEGS[0]) return { x: X7 + s, y: Y7 }; s -= SEGS[0];
  if (s < SEGS[1]) { const t = s / QL; return { x: quad(t, XR - RC, XR, XR), y: quad(t, Y7, Y7, Y7 - RC) }; } s -= SEGS[1];
  if (s < SEGS[2]) return { x: XR, y: Y7 - RC - s }; s -= SEGS[2];
  if (s < SEGS[3]) { const t = s / QL; return { x: quad(t, XR, XR, XR - RC), y: quad(t, Y3 + RC, Y3, Y3) }; } s -= SEGS[3];
  return { x: XR - RC - s, y: Y3 };
};
// the packet model PipelineMap uses for its own loop packet (sharp corners), to space extra packets with it
const loopPacket = (t: number) => {
  const seg = [XR - X7, Y7 - Y3, XR - X3], tot = seg[0] + seg[1] + seg[2]; let s = (((t % 1) + 1) % 1) * tot;
  if (s < seg[0]) return { x: X7 + s, y: Y7 }; if ((s -= seg[0]) < seg[1]) return { x: XR, y: Y7 - s }; s -= seg[1]; return { x: XR - s, y: Y3 };
};

// the mark's soft cyan ring (as in scene A): a breathing halo and slow ripples; hit = a frame for one extra accent ripple
const Breath: React.FC<{ g: number; x: number; y: number; d: number; o: number; from: number; hit?: number }> = ({ g, x, y, d, o, from, hit }) => {
  if (o <= 0) return null;
  const br = Math.sin((g - from) / 16);
  const rings = [0, 1 / 3, 2 / 3].map((ph) => ((((g - from) / 60 + ph) % 1) + 1) % 1);
  const ht = hit !== undefined ? (g - hit) / 30 : -1;
  return (
    <>
      <div style={{ position: "absolute", left: x - d, top: y - d, width: 2 * d, height: 2 * d, borderRadius: "50%", opacity: o * (0.75 + 0.25 * br),
        transform: `scale(${1 + 0.05 * br})`, background: "radial-gradient(closest-side, rgba(102,184,219,0.28), rgba(102,184,219,0.09) 55%, rgba(102,184,219,0))" }} />
      {rings.map((t, i) => {
        const r = d * (0.56 + 0.5 * t);
        return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", boxSizing: "border-box",
          border: `5px solid rgba(33,138,179,${0.4 * o * (1 - t) * Math.min(1, t * 5)})` }} />;
      })}
      {ht >= 0 && ht < 1.4 && (() => {
        const t = ht / 1.4, r = d * (0.55 + 0.75 * ARRIVE(t));
        return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", boxSizing: "border-box", border: `3px solid rgba(33,138,179,${0.6 * (1 - t)})` }} />;
      })()}
    </>
  );
};

export const SceneH: React.FC<{ g: number }> = ({ g }) => {
  const S5 = f("s5");
  if (g < S5 || g >= f("end")) return null;

  /* ---- the map builds around the dot: from the middle row outward, ~0.6 s ---- */
  const rows = [0, 0, 0, 0, 0, 0, 0], gates = [0, 0, 0, 0];
  MAP.rows.forEach((r) => {
    const v = clamp01((g - S5 - 2 - Math.round((Math.abs(r.y - 540) / 362) * 9)) / 9);
    if (r.kind === "layer") rows[r.n - 1] = v; else gates[r.n - 1] = v;
  });

  /* ---- camera (world point F at screen point Ctr, scale cs): settle in, push toward layer 7 on "outcome", follow the
     dot up the loop, back out for the gates, lean toward layer 3 on "improving", release, then collapse into the mark ---- */
  let cs = mix(1.12, 1, kf(g, S5, f("w:outcome-0.1") - S5, ARRIVE)), fx = 960, fy = 540, cx = 960, cy = 540;
  const c2 = k(g, "w:outcome-0.1", 0.75, MOVE);
  cs = mix(cs, 1.22, c2); fx = mix(fx, 1280, c2); fy = mix(fy, 760, c2);
  const c3 = kf(g, f("w:feeds"), f("w:base2") - f("w:feeds"), MOVE);
  cs = mix(cs, 1.18, c3); fx = mix(fx, 1330, c3); fy = mix(fy, 480, c3);
  const c4 = kf(g, f("w:base2+0.1"), f("w:continuously+0.3") - f("w:base2+0.1"), MOVE);
  cs = mix(cs, 1, c4); fx = mix(fx, 960, c4); fy = mix(fy, 540, c4);
  const c5 = kf(g, f("w:improving-0.1"), f("w:available") - f("w:improving-0.1"), MOVE);
  cs = mix(cs, 1.07, c5); fy = mix(fy, 465, c5);
  const c6 = kf(g, f("w:available"), f("w:decisions") - f("w:available"), MOVE);
  cs = mix(cs, 1, c6); fy = mix(fy, 540, c6);
  const pull = k(g, "w:decisions+0.15", 0.85, MOVE);                     // the map collapses into the mark
  cs = cs * Math.pow(0.1, pull); fx = mix(fx, 955, pull); fy = mix(fy, 515, pull); cy = mix(540, 432, pull);
  const tx = cx - fx * cs, ty = cy - fy * cs;
  const scr = (x: number, y: number) => ({ x: tx + x * cs, y: ty + y * cs });
  const worldO = 1 - clamp01((pull - 0.6) / 0.38);

  /* ---- the outcome: the dot drops to layer 7, then draws the loop into layer 3 ---- */
  const drop = k(g, "w:outcome-0.1", 0.55, MOVE);
  const lt = kf(g, f("w:feeds"), f("w:base2") - f("w:feeds"), LIN), lm = MOVE(lt);
  const loop = lt <= 0 ? 0 : lt >= 1 ? 1 : invArrive(lm * (LREAL / LDASH));
  const arrive = k(g, "w:base2", 0.25, ARRIVE);
  let dx: number, dy: number;
  if (lt <= 0) { dx = quad(drop, 960, 1080, X7); dy = quad(drop, 540, Y7, Y7); }
  else { const q = loopAt(lm * LREAL); dx = q.x; dy = q.y; }
  const dr = mix(14, 10, drop) * (1 - arrive);
  const cyan = k(g, "w:feeds", 0.3, LIN);
  const dot = scr(dx, dy);

  /* ---- layer 3 glows on arrival; gates approve on "continuously"; focus on "improving"; then down the spine ---- */
  const glow3 = k(g, "w:base2", 0.35, SNAP);
  const approved = [0, 1, 2, 3].map((i) => k(g, at("w:continuously", i * 0.11), 0.3, LIN));
  const focus = k(g, "w:improving", 0.45, MOVE);
  const wake = ["", "", "", "w:the4", "w:available", "w:for2", "w:future"];
  const dim = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    if (i === 2) return 0;
    const back = i < 2 ? k(g, "w:future", 0.5, MOVE) : k(g, wake[i], 0.45, MOVE);
    return 0.62 * focus * (1 - back);
  });
  const glow = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    if (i === 2) return glow3 * (0.85 + 0.15 * Math.sin(g / 9));
    if (i < 3) return 0;
    const on = k(g, wake[i], 0.3, SNAP), off = k(g, at(wake[i], 0.9), 0.5, MOVE);
    return on * (1 - 0.7 * off);
  });
  const fill = k(g, "w:improving+0.05", 1.1, MOVE);                       // the knowledge base fills
  const extra = k(g, "w:continuously", 0.4, LIN);                        // more packets on the loop
  const down = k(g, "w:the4-0.1", 0.4, LIN);                             // cyan packets down the spine
  const replied = k(g, "w:outcome+0.35", 0.4, ARRIVE) * (1 - k(g, "w:continuously-0.2", 0.35, MOVE));

  /* ---- the end card ---- */
  const card = k(g, "w:decisions+0.5", 0.4, ARRIVE);
  const settle = kf(g, f("w:decisions+0.5"), f("end") - f("w:decisions+0.5"), LIN);
  const HIT = f("w:decisions+2.05");

  const kbx = mapNodeX(3, 0), y3 = Y3, pillW = 330;
  const layerYs = [1, 2, 3, 4, 5, 6, 7].map(mapRowY);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {worldO > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: worldO, transform: `translate(${tx}px, ${ty}px) scale(${cs})`, transformOrigin: "0 0" }}>
          <PipelineMap g={g} rows={rows} gates={gates} approved={approved} dim={dim} glow={glow} loop={loop} />
          {/* the knowledge base fills: a cyan sweep across its pill */}
          {fill > 0 && (
            <div style={{ position: "absolute", left: kbx - pillW / 2 + 1, top: y3 - 24, width: (pillW - 2) * fill, height: 48, borderRadius: 13, background: C.cyanTint,
              mixBlendMode: "multiply", opacity: 0.9 }} />
          )}
          {fill > 0 && fill < 1 && <div style={{ position: "absolute", left: kbx - pillW / 2 + (pillW - 2) * fill - 2, top: y3 - 20, width: 3, height: 40, borderRadius: 2, background: C.cyan, opacity: 0.7 * (1 - fill) + 0.2 }} />}
          {/* a ripple off layer 3 when the outcome lands */}
          {g >= f("w:base2") && g < f("w:base2+0.8") ? (() => {
            const t = clamp01((g - f("w:base2")) / 24), e = ARRIVE(t);
            return [kbx, mapNodeX(3, 1)].map((x, i) => (
              <div key={i} style={{ position: "absolute", left: x - pillW / 2 - 18 * e, top: y3 - 25 - 18 * e, width: pillW + 36 * e, height: 50 + 36 * e, borderRadius: 14 + 18 * e, boxSizing: "border-box",
                border: `2.5px solid rgba(33,138,179,${0.55 * (1 - t)})` }} />
            ));
          })() : null}
          {/* more outcomes keep cycling */}
          {loop >= 1 && extra > 0 && [1 / 3, 2 / 3].map((ph) => {
            const q = loopPacket((g / 30) * 0.35 + ph);
            return <svg key={ph} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}><circle cx={q.x} cy={q.y} r={7} fill={C.cyan} opacity={extra} /></svg>;
          })}
          {/* the improved knowledge runs down the spine (layer 3 → 7) */}
          {down > 0 && layerYs.slice(2, 6).map((ya, i) => {
            const yb = layerYs[i + 3], a = ya + MAP.pillH / 2 + 4, b = yb - MAP.pillH / 2 - 4;
            const o = k(g, at("w:the4", -0.1 + i * 0.35), 0.4, LIN);
            if (o <= 0) return null;
            const t = ((((g - f("w:the4")) / 30) * 1.1 - i * 0.35) % 1 + 1) % 1;
            return <svg key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
              <circle cx={MAP.spineX} cy={mix(a, b, t)} r={6} fill={C.cyan} opacity={o * Math.min(1, t * 6, (1 - t) * 6)} />
            </svg>;
          })}
          {/* the outcome, as a UI note at layer 7 */}
          {replied > 0 && (
            <div style={{ position: "absolute", left: MAP.spineX, top: Y7 + 58, transform: `translate(-50%, ${(1 - replied) * 10}px) scale(${0.8 + 0.2 * POP(clamp01(replied))})`, opacity: clamp01(replied * 1.5) }}>
              <Chip text="Reply logged" icon="reply" tone="ok" size={20} />
            </div>
          )}
          {/* the dot's first breath at s5 */}
          {g < f("w:outcome") && (() => {
            const t = clamp01((g - S5) / 22), r = 14 + 40 * ARRIVE(t);
            return <div style={{ position: "absolute", left: 960 - r, top: 540 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", boxSizing: "border-box", border: `2px solid rgba(52,74,101,${0.3 * (1 - t) * Math.min(1, t * 8)})` }} />;
          })()}
        </div>
      )}

      {/* the outcome dot (screen space, so it is exactly the s5 dot at the first frame) */}
      {dr > 0.3 && worldO > 0 && (
        <>
          <Packet x={g === S5 ? 960 : dot.x} y={g === S5 ? 540 : dot.y} r={g === S5 ? 14 : dr * mix(1, cs, c2)} color={C.navy} o={1 - cyan} />
          {cyan > 0 && <Packet x={dot.x} y={dot.y} r={dr * mix(1, cs, c2)} color={C.cyan} o={cyan} />}
        </>
      )}

      {/* the end card */}
      {card > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${(1 + 0.04 * settle)})`, transformOrigin: "960px 520px" }}>
          <Breath g={g} x={960} y={432} d={230} o={k(g, "w:decisions+0.6", 0.8)} from={f("w:decisions+0.6")} hit={HIT} />
          <KBMark size={200} p={kf(g, f("w:decisions+0.5"), 18, LIN)} style={{ position: "absolute", left: 960 - 100, top: 332 }} />
          <Say g={g} y={572} size={96} words={[{ t: "Network", at: "w:decisions+0.75" }, { t: "Intelligence", at: "w:decisions+0.92" }]} />
          <Say g={g} y={702} size={40} slateColor={C.slate} words={[
            { t: "From", at: "w:decisions+1.3", slate: true }, { t: "everyday", at: "w:decisions+1.4", slate: true }, { t: "information", at: "w:decisions+1.5", slate: true },
            { t: "to", at: "w:decisions+1.62", slate: true }, { t: "real", at: "w:decisions+1.72", slate: true }, { t: "opportunities.", at: "w:decisions+1.93", slate: true },
          ]} />
        </div>
      )}
    </div>
  );
};
