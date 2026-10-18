// Scene B — capture → Claude (s1 → sB). "First, conversations, meetings, emails, and documents are collected. Claude
// processes this information into structured summaries." From the overview map at camera identity, the camera pushes
// into layer 1; the map dissolves into four empty source slots, and each source arrives on its word and emits its
// information (a voice note, a transcript line, an email, a document). On "are collected" the four streams bend into
// one flow; the camera follows it down to Claude's summariser, which pulls out the five facets of a summary, and on
// "structured summaries" the summary card rises out of the agent and types itself out. Hand-off sB: LayerTag 2 and the
// complete SummaryCard at centre, nothing else. B draws s1 itself; scene C draws sB.
import React from "react";
import {
  ARRIVE, C, FONT, Flow, Ico, LIN, LayerTag, MAP, MOVE, MapLegend, NodeCard, POP, PipelineMap, SHADOW, SummaryCard,
  clamp01, f, k, kf, mapNodeX, mapRowY, mix,
} from "../shared";

type Pt = [number, number];
const lerp = (a: number, b: number, t: number) => (t >= 1 ? b : t <= 0 ? a : a + (b - a) * t);

// a flow line that leaves downward and lands downward (a cubic with vertical tangents), drawn 0..1 by p, with packets
const cub = (a: Pt, b: Pt, t: number): Pt => {
  const dy = (b[1] - a[1]) * 0.55, u = 1 - t;
  const p1: Pt = [a[0], a[1] + dy], p2: Pt = [b[0], b[1] - dy];
  return [u * u * u * a[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * b[1]];
};
const Curve: React.FC<{ a: Pt; b: Pt; p: number; g: number; o?: number; packets?: number; speed?: number; pcolor?: string; r?: number; width?: number; phase?: number }> = ({
  a, b, p, g, o = 1, packets = 0, speed = 0.7, pcolor = C.navy, r = 6.5, width = 2.5, phase = 0 }) => {
  if (p <= 0 || o <= 0) return null;
  const dy = (b[1] - a[1]) * 0.55;
  const d = `M ${a[0]} ${a[1]} C ${a[0]} ${a[1] + dy} ${b[0]} ${b[1] - dy} ${b[0]} ${b[1]}`;
  let L = 0; let q = a;
  for (let i = 1; i <= 16; i++) { const n = cub(a, b, i / 16); L += Math.hypot(n[0] - q[0], n[1] - q[1]); q = n; }
  L += 2;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", opacity: o }}>
      <path d={d} fill="none" stroke={C.faint} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - p)} />
      {p >= 1 && Array.from({ length: packets }, (_, i) => {
        const t = ((((g / 30) * speed + i / packets + phase) % 1) + 1) % 1, c = cub(a, b, t);
        return <circle key={i} cx={c[0]} cy={c[1]} r={r} fill={pcolor} opacity={Math.min(1, t * 6, (1 - t) * 6)} />;
      })}
    </svg>
  );
};

/* ---------- layout (close-up world; the camera pans down it and drifts in slowly) ---------- */
const PUSH = 1.45;                                   // the push-in: layer 1's map pills grow into the source slots
const A0: Pt = [MAP.spineX, mapRowY(1)], A1: Pt = [960, 360];
const SRC_Y = 360, CARD_W = 384, CARD_H = 108, CHIP_Y = 520;
const PILL_W = 273, PILL_H = 50;                     // the map's layer-1 pill (shared.tsx: PipelineMap)
const SRC_X = [0, 1, 2, 3].map((i) => 960 + (mapNodeX(1, i) - MAP.spineX) * PUSH);
const SOURCES = [
  { w: "w:conversations", icon: "mic", t: "Conversations", sub: "Wispr Flow" },
  { w: "w:meetings", icon: "meeting", t: "Meetings", sub: "Transcriptions" },
  { w: "w:emails", icon: "mail", t: "Emails", sub: "Slack and email" },
  { w: "w:documents", icon: "doc", t: "Documents", sub: "Contracts, docs" },
];
const MERGE: Pt = [960, 790];
const AGENT: Pt = [960, 1120], AGENT_SIZE = 1.5;
const FACETS: [string, string][] = [["doc", "Summary"], ["users", "People"], ["chat", "Asks"], ["handshake", "Offers"], ["flag", "Next steps"]];
const FACET_Y = 1262;
const facetW = (t: string) => 66 + t.length * 13.4;
const FACET_X = (() => {
  const gap = 18, tot = FACETS.reduce((s, [, t]) => s + facetW(t), 0) + gap * (FACETS.length - 1);
  let x = 960 - tot / 2;
  return FACETS.map(([, t]) => { const c = x + facetW(t) / 2; x += facetW(t) + gap; return c; });
})();

// the information each source emits: a voice note, a transcript line, an email, a document
const Emitted: React.FC<{ i: number; g: number }> = ({ i, g }) => {
  const box: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, height: 52, padding: "0 22px 0 8px", borderRadius: 999, background: C.white, border: `1px solid ${C.line}`,
    boxShadow: SHADOW, boxSizing: "border-box", fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap" };
  const tile = (n: string) => <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n={n} s={21} c={C.slate} w={2.3} /></div>;
  if (i === 0) {
    return (
      <div style={box}>
        {tile("mic")}
        <div style={{ display: "flex", alignItems: "center", gap: 4, height: 30 }}>
          {Array.from({ length: 13 }, (_, b) => {
            const h = 5 + 22 * Math.abs(Math.sin(g * 0.32 + b * 1.37)) * (0.45 + 0.55 * Math.abs(Math.sin(b * 0.7 + 0.4)));
            return <div key={b} style={{ width: 4, height: h, borderRadius: 2, background: b < 9 ? C.slate : C.faint }} />;
          })}
        </div>
        <span style={{ color: C.muted, fontWeight: 500, marginLeft: 4 }}>0:42</span>
      </div>
    );
  }
  const [ic, text] = ([["chat", "“…a second location”"], ["mail", "Re: Booking system"], ["doc", "Proposal draft"]] as const)[i - 1];
  return <div style={box}>{tile(ic)}{text}</div>;
};

type Cam = { x: number; y: number; z: number };
// the camera's moves, in close-up world coordinates: [start frame, frames, ease, target]
const camAt = (g: number): Cam => {
  const off = [110, 40, -40, -110], FY = 440, W = ["w:conversations", "w:meetings", "w:emails", "w:documents"];
  const K: [number, number, (t: number) => number, Cam][] = [[f("s1") + 4, 32, MOVE, { x: SRC_X[0] + off[0], y: FY, z: 1.28 }]];
  for (let i = 0; i < 4; i++) {
    const a = i === 0 ? f("s1") + 36 : f(W[i]) - 6 + 14, b = i < 3 ? f(W[i + 1]) - 6 : f("w:are") - 4;
    if (i > 0) K.push([f(W[i]) - 6, 14, MOVE, { x: SRC_X[i] + off[i], y: FY, z: 1.28 }]);
    K.push([a, b - a, LIN, { x: SRC_X[i] + off[i] + (i === 0 ? 160 : 70), y: FY + 14, z: i === 0 ? 1.46 : 1.38 }]);
  }
  K.push([f("w:are") - 4, 20, MOVE, { x: 960, y: 560, z: 1 }]);
  K.push([f("w:collected") + 8, 32, MOVE, { x: 960, y: 1160, z: 1.15 }]);
  K.push([f("w:collected") + 40, f("w:structured") - f("w:collected") - 40, LIN, { x: 960, y: 1255, z: 1.46 }]);
  K.push([f("w:structured"), f("sB") - 1 - f("w:structured"), LIN, { x: 960, y: 1300, z: 1.58 }]);
  let c: Cam = { x: 960, y: 540, z: 1 };
  for (const [at, d, e, to] of K) {
    const t = kf(g, at, d, e);
    if (t > 0) c = { x: lerp(c.x, to.x, t), y: lerp(c.y, to.y, t), z: lerp(c.z, to.z, t) };
  }
  return c;
};

export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("s1") || g >= f("sB")) return null;

  /* the push-in from the overview (exact s1 state at its first frame) */
  const pe = kf(g, f("s1"), 34, MOVE), S = lerp(1, PUSH, pe);
  const ax = lerp(A0[0], A1[0], pe), ay = lerp(A0[1], A1[1], pe);
  const mapO = 1 - kf(g, f("s1") + 8, 22, MOVE);
  const ghostO = kf(g, f("s1") + 12, 16, ARRIVE);

  /* the camera: it swoops into the first slot, trucks to each source on its word (drifting in on the holds), pulls
     back on "are collected" to show the four streams meet, then follows the flow down to Claude */
  const c = camAt(g);
  const cam = (x: number, y: number): Pt => [960 + (x - c.x) * c.z, 540 + (y - c.y) * c.z];
  const camId = c.x === 960 && c.y === 540 && c.z === 1;

  /* the stream */
  const conv = (i: number) => kf(g, f("w:are") + 2 * i, 14, MOVE);
  const travel = (i: number) => kf(g, f("w:collected") + 2 * i, 18, MOVE);
  const hub = kf(g, f("w:collected") + 10, 10, POP);
  const main = kf(g, f("w:collected") + 8, 22, MOVE);
  const streamO = 1 - kf(g, f("w:structured") + 6, f("sB") - 1 - f("w:structured") - 6, MOVE);

  /* Claude */
  const ag = kf(g, f("w:claude") - 8, 20, ARRIVE);
  const agOut = kf(g, f("w:structured"), 10, MOVE);
  const glow = clamp01(ag * 1.3) * (0.7 + 0.3 * Math.sin((g - f("w:claude")) / 7));
  const agS = cam(AGENT[0], AGENT[1]);

  /* the summary card rises out of the agent and types out */
  const ce = kf(g, f("w:structured"), 22, MOVE);
  const settle = kf(g, f("w:structured") + 22, f("sB") - 1 - f("w:structured") - 22, LIN);   // a slow final settle while it types
  const cx = 960, cy = ce < 1 ? lerp(agS[1] + 20, 584, ce) : lerp(584, 560, settle), cs = ce < 1 ? lerp(0.4, 0.88, ce) : lerp(0.88, 1, settle), co = ce >= 1 ? 1 : clamp01(ce * 5);
  const cp = clamp01(kf(g, f("w:structured") + 8, f("sB") - 1 - f("w:structured") - 8, LIN) / 0.91);

  /* layer tags: 1 on "first", 2 on "Claude" */
  const tag1 = k(g, "w:first", 0.6) * (1 - kf(g, f("w:claude") - 6, 8, MOVE));
  const tag2 = kf(g, f("w:claude") + 2, 16, ARRIVE);

  return (
    <>
      {(mapO > 0 || streamO > 0) && (
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: camId ? undefined : `translate(960px, 540px) scale(${c.z}) translate(${-c.x}px, ${-c.y}px)` }}>
      {/* the overview, pushing in toward layer 1 and dissolving */}
      {mapO > 0 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: pe > 0 ? `translate(${ax - A0[0] * S}px, ${ay - A0[1] * S}px) scale(${S})` : undefined }}>
          <PipelineMap g={g} o={mapO} />
          <MapLegend x={120} y={1000} o={mapO} />
        </div>
      )}

      {/* the close-up world */}
      {streamO > 0 && (
        <div style={{ position: "absolute", inset: 0 }}>
        {/* during the push the close-up rides the map's camera, so the slots sit exactly on layer 1's pills */}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: pe < 1 ? `translate(${ax}px, ${ay}px) scale(${S / PUSH}) translate(${-A1[0]}px, ${-A1[1]}px)` : undefined }}>
          {/* empty source slots (layer 1's pills, close up) */}
          {SRC_X.map((x, i) => {
            const o = ghostO * (1 - clamp01(k(g, SOURCES[i].w, 0.3) * 1.2));
            if (o <= 0) return null;
            const gw = lerp(PILL_W * PUSH, CARD_W, pe), gh = lerp(PILL_H * PUSH, CARD_H, pe);
            return (
              <div key={i} style={{ position: "absolute", left: x - gw / 2, top: SRC_Y - gh / 2, width: gw, height: gh, borderRadius: lerp(14 * PUSH, 25, pe), border: `2px dashed ${C.line}`, overflow: "hidden",
                background: "rgba(255,255,255,0.55)", boxSizing: "border-box", opacity: o, display: "flex", alignItems: "center", paddingLeft: 20 }}>
                <div style={{ width: 65, height: 65, borderRadius: 17, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={SOURCES[i].icon} s={34} c={C.faint} w={2.1} /></div>
                <div style={{ marginLeft: 20, width: 150, height: 16, borderRadius: 8, background: C.mist }} />
              </div>
            );
          })}

          {/* the four streams bending into one, and the one flow down to Claude */}
          {SRC_X.map((x, i) => <Curve key={i} a={[x, CHIP_Y]} b={MERGE} p={conv(i)} g={g} packets={2} speed={0.75} phase={i * 0.13} />)}
          <Flow x1={MERGE[0]} y1={MERGE[1]} x2={AGENT[0]} y2={AGENT[1] - 66} p={main} g={g} width={3} color={C.faint} packets={3} speed={0.85} pcolor={C.navy} />
          {hub > 0 && <div style={{ position: "absolute", left: MERGE[0] - 13, top: MERGE[1] - 13, width: 26, height: 26, borderRadius: "50%", background: C.navy,
            transform: `scale(${hub})`, boxShadow: `0 0 0 ${8 + 3 * Math.sin(g / 5)}px rgba(52,74,101,0.12)` }} />}

          {/* the sources: one per word, each emitting its information */}
          {SOURCES.map((s, i) => {
            const a = k(g, s.w, 0.5);
            if (a <= 0) return null;
            const stub = kf(g, f(s.w) + 7, 10, ARRIVE), em = kf(g, f(s.w) + 10, 14, ARRIVE), tr = travel(i);
            const pos = tr > 0 ? cub([SRC_X[i], CHIP_Y], MERGE, tr) : [SRC_X[i], CHIP_Y - 90 * (1 - em)];
            return (
              <React.Fragment key={i}>
                <Flow x1={SRC_X[i]} y1={SRC_Y + CARD_H / 2 + 2} x2={SRC_X[i]} y2={CHIP_Y} p={stub} g={g + i * 9} width={2.5} color={C.faint} packets={1} speed={1.1} pcolor={C.navy} />
                <div style={{ position: "absolute", left: SRC_X[i] - CARD_W / 2, top: SRC_Y - CARD_H / 2, width: CARD_W, opacity: clamp01(a * 1.6), transform: `translateY(${(1 - a) * 120}px) scale(${0.88 + 0.12 * a})` }}>
                  <NodeCard kind="tool" icon={s.icon} title={s.t} sub={s.sub} w={CARD_W} size={1.25} />
                </div>
                {em > 0 && tr < 1 && (
                  <div style={{ position: "absolute", left: pos[0], top: pos[1], transform: `translate(-50%, -50%) scale(${lerp(1, 0.2, tr)})`, opacity: clamp01(em * 1.5) * (1 - clamp01((tr - 0.55) / 0.45)) }}>
                    <Emitted i={i} g={g} />
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Claude's summariser receives the stream */}
          {ag > 0 && agOut < 1 && (
            <div style={{ position: "absolute", left: AGENT[0], top: AGENT[1], width: "max-content", opacity: clamp01(ag * 1.5) * (1 - agOut),
              transform: `translate(-50%, -50%) translateY(${(1 - ag) * 40 - 70 * agOut}px) scale(${(0.92 + 0.08 * ag) * (1 - 0.1 * agOut)})` }}>
              <NodeCard kind="agent" icon="spark" title="Claude summariser" sub="Summarises every input" size={AGENT_SIZE} glow={glow} />
            </div>
          )}
        </div>
        </div>
      )}
      </div>
      )}

      {ce > 0 && <SummaryCard x={cx} y={cy} s={cs} p={cp} o={co} />}

      {/* the five facets Claude pulls out; on "structured summaries" each flies into its row of the card */}
      {FACETS.map(([ic, t], j) => {
        const a = kf(g, f("w:processes") + 2 + 6 * j, 12, ARRIVE);
        if (a <= 0) return null;
        const fl = kf(g, f("w:structured") + 2 + 5 * j, 12, MOVE);
        if (fl >= 1) return null;
        const from = cam(mix(AGENT[0], FACET_X[j], a), mix(AGENT[1] + 30, FACET_Y, a));
        const to: Pt = [cx + (110 - 320) * cs, cy + (113 + 56 * j - 200) * cs];
        const x = mix(from[0], to[0], fl), y = mix(from[1], to[1], fl);
        const sc = c.z * (0.6 + 0.4 * POP(a)) * (1 - 0.35 * fl);
        return (
          <div key={t} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${sc})`, opacity: clamp01(a * 2) * (1 - clamp01((fl - 0.6) / 0.4)),
            display: "flex", alignItems: "center", gap: 9, height: 46, padding: "0 18px 0 14px", borderRadius: 999, background: C.cyanTint, color: C.cyanDeep,
            fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: "-0.01em", whiteSpace: "nowrap", boxSizing: "border-box" }}>
            <Ico n={ic} s={23} c={C.cyanDeep} w={2.2} />{t}
          </div>
        );
      })}

      <LayerTag n={1} p={tag1} />
      <LayerTag n={2} p={tag2} />
    </>
  );
};
