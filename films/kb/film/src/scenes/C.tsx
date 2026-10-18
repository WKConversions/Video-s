// Scene C — gate 1 → knowledge core → ecosystem (sB → s2). "Once approved, everything is stored in a central knowledge
// base, connected to K.B.'s client ecosystem." Gate 1 (Summary review) draws under the summary card; management's
// cursor approves it on "approved" and the card shrinks through the gate line while the camera follows it down into
// the knowledge base, whose records fill as more approved summaries stream in ("everything"). On "connected" the
// Ecosystem agent syncs with the core (⇄), then KB Customers, the client portal and a ring of client companies
// (illustrative) connect. Before s2 the ecosystem folds back into the core. Hand-off s2: LayerTag 3 and the full
// CoreNode at centre, nothing else (scene D draws s2).
import React from "react";
import { ARRIVE, C, CARD, CoreNode, Cursor, FONT, GateBadge, Ico, LIN, MOVE, NodeCard, POP, SHADOW, SNAP, SummaryCard, LayerTag, clamp01, f, kf, mix } from "../shared";

type Pt = [number, number];
const lerp = (a: number, b: number, t: number) => (t >= 1 ? b : t <= 0 ? a : a + (b - a) * t);
const bump = (g: number, at: number, d: number) => { const t = (g - at) / d; return t > 0 && t < 1 ? Math.sin(Math.PI * t) : 0; };

// a vertical-tangent cubic (streams from above into the core)
const cub = (a: Pt, b: Pt, t: number): Pt => {
  const dy = (b[1] - a[1]) * 0.55, u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * (a[1] + dy) + 3 * u * t * t * (b[1] - dy) + t * t * t * b[1]];
};
const Stream: React.FC<{ a: Pt; b: Pt; p: number; g: number; o: number; phase: number }> = ({ a, b, p, g, o, phase }) => {
  if (p <= 0 || o <= 0) return null;
  const dy = (b[1] - a[1]) * 0.55, L = Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.15 + 2;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", opacity: o }}>
      <path d={`M ${a[0]} ${a[1]} C ${a[0]} ${a[1] + dy} ${b[0]} ${b[1] - dy} ${b[0]} ${b[1]}`} fill="none" stroke={C.faint} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - p)} />
      {p >= 1 && [0, 1].map((i) => {
        const t = ((((g / 30) * 0.8 + i / 2 + phase) % 1) + 1) % 1, c = cub(a, b, t);
        return <circle key={i} cx={c[0]} cy={c[1]} r={6.5} fill={C.navy} opacity={Math.min(1, t * 6, (1 - t) * 6)} />;
      })}
    </svg>
  );
};
// a straight sync line (⇄): navy packets one way, cyan the other
const Sync: React.FC<{ a: Pt; b: Pt; p: number; g: number; o: number; phase?: number }> = ({ a, b, p, g, o, phase = 0 }) => {
  if (p <= 0 || o <= 0) return null;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) + 2;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", opacity: o }}>
      <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} fill="none" stroke={C.faint} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - p)} />
      {p >= 1 && L > 40 && [0, 1].map((i) => {
        const t = ((((g / 30) * 0.7 + phase + i * 0.5) % 1) + 1) % 1, u = i === 0 ? t : 1 - t;
        return <circle key={i} cx={mix(a[0], b[0], u)} cy={mix(a[1], b[1], u)} r={6} fill={i === 0 ? C.navy : C.cyan} opacity={Math.min(1, t * 6, (1 - t) * 6)} />;
      })}
    </svg>
  );
};

/* ---------- layout ---------- */
const GATE_Y = 880, LINE_X0 = 300, LINE_X1 = 1620, BADGE = 28;
const ICON: Pt = [LINE_X0 + BADGE * 0.45 + BADGE * 0.85, GATE_Y];        // the badge's person-check icon (the click)
const CORE_Y = 1250, PAN = CORE_Y - 560;                                  // the core sits below the gate; the camera follows
const AGENT: Pt = [960, 878];
const NODES = [
  { x: 400, icon: "users", t: "KB Customers", sub: "Client records" },
  { x: 1520, icon: "portal", t: "Client portal", sub: "Shared with clients" },
];
const NODE_W = 360;
const TILES: { p: Pt; icon: string; to: Pt }[] = [
  { p: [330, 300], icon: "building", to: [360, 507] }, { p: [730, 250], icon: "briefcase", to: [860, 428] }, { p: [1190, 250], icon: "rocket", to: [1060, 428] },
  { p: [1590, 300], icon: "bulb", to: [1560, 507] }, { p: [1590, 830], icon: "globe", to: [1560, 613] }, { p: [330, 830], icon: "flag", to: [360, 613] },
];
const MINI_FROM: Pt[] = [[280, -10], [1640, -10], [960, -40]];

// a small approved summary (one of "everything") streaming into the core
const Mini: React.FC = () => (
  <div style={{ ...CARD, width: 170, height: 104, borderRadius: 18, padding: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, background: C.cyanTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="spark" s={15} c={C.cyan} fill={C.cyan} w={2.2} /></div>
      <div style={{ flex: 1, height: 10, borderRadius: 5, background: "#C9D7E2" }} />
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="check" s={14} c={C.white} w={3} /></div>
    </div>
    {[0.9, 0.7, 0.8].map((w, i) => <div key={i} style={{ marginTop: i ? 8 : 14, width: `${w * 100}%`, height: 9, borderRadius: 5, background: C.mist }} />)}
  </div>
);

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sB") || g >= f("s2")) return null;
  const AP = f("w:approved");

  /* gate 1: draws under the card; management clicks it on "approved" */
  const gl = kf(g, f("sB"), 20, ARRIVE), gb = kf(g, f("sB"), 16, ARRIVE);
  const ap = kf(g, AP + 3, 8, SNAP);
  const cm = kf(g, f("sB"), AP - f("sB"), MOVE), cOut = kf(g, AP + 6, 12, MOVE);
  const press = bump(g, AP - 1, 8);
  const curX = mix(mix(1260, ICON[0] + 6, cm), ICON[0] + 60, cOut), curY = mix(mix(1100, ICON[1] + 8, cm), ICON[1] + 70, cOut);
  const ring = kf(g, AP + 4, 14, ARRIVE);

  /* the card passes the gate and drops into the core; the camera follows it down */
  const drop = kf(g, AP + 5, 42, MOVE);
  const py = PAN * kf(g, AP + 10, 38, MOVE);
  const cardY = lerp(560, CORE_Y + 20, drop) - py, cardS = lerp(1, 0.2, drop), cardO = drop <= 0.85 ? 1 : 1 - clamp01((drop - 0.85) / 0.15);
  const coreA = kf(g, AP + 18, 24, ARRIVE), coreY = CORE_Y - py;
  const gateO = 1 - kf(g, AP + 30, 14, MOVE);

  /* "everything": more approved summaries stream in; each landing fills a record row */
  const E = f("w:everything");
  const minis = [0, 1, 2, 3, 4, 5, 6, 7].map((j) => ({ j, st: E + 2 + 7 * j, src: MINI_FROM[j % 3] }));
  const lands = [AP + 46, ...minis.map((m) => m.st + 24)];
  const fill = lands.reduce((s, t) => s + kf(g, t, 8, ARRIVE), 0) / lands.length;
  const streamP = kf(g, E + 2, 14, MOVE), streamO = 1 - kf(g, E + 66, 14, MOVE);
  const coreTop: Pt = [960, coreY - 128];

  /* the ecosystem: the agent syncs with the core, then the client nodes and the ring of client companies */
  const CN = f("w:connected"), KB = f("w:kbs"), CL = f("w:client");
  const fb = kf(g, f("s2") - 17, 16, MOVE);
  const fold = (p: Pt): Pt => [mix(p[0], 960, fb), mix(p[1], 560, fb)];
  const ecoO = 1 - fb;
  const ea = kf(g, CN, 24, ARRIVE), sl = kf(g, CN + 4, 12, MOVE), lab = kf(g, CN + 10, 12, ARRIVE);
  const ag = fold(AGENT);
  const agentGlow = clamp01(ea * 1.4) * (0.65 + 0.35 * Math.sin((g - CN) / 7));
  const coreGlow = clamp01(0.5 * kf(g, CN, 12) * (1 - fb) + lands.reduce((s, t) => s + 0.45 * bump(g, t, 12), 0));

  const tag2 = 1 - kf(g, E, 8, MOVE), tag3 = kf(g, E + 6, 16, ARRIVE);

  /* the camera: a slow push into the core while the summaries land, a pull back to reveal the ecosystem; identity at s2 */
  const zIn = 0.1 * kf(g, f("sB"), AP + 6 - f("sB"), LIN) + 0.5 * kf(g, AP + 36, CN - 12 - AP - 36, (t) => (t < 0.35 ? MOVE(t / 0.7) * 0.7 : t) );
  const zBack = kf(g, CN - 12, 30, MOVE), zOut = kf(g, CN + 18, f("s2") - 17 - CN - 18, LIN), zEnd = kf(g, f("s2") - 17, 16, MOVE);
  const zc = zEnd >= 1 ? 1 : 1 + zIn - 0.52 * zBack - 0.2 * zOut + 0.12 * zEnd;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 560px", transform: zc !== 1 ? `scale(${zc})` : undefined }}>
      {/* gate line (under the card) */}
      {gateO > 0 && gl > 0 && (() => {
        const y = GATE_Y - py, w = (LINE_X1 - LINE_X0) * gl;
        return <>
          <div style={{ position: "absolute", left: LINE_X0, top: y - 1, width: w, height: 0, borderTop: `2px dashed rgba(52,74,101,0.45)`, opacity: gateO * (1 - ap) }} />
          <div style={{ position: "absolute", left: LINE_X0, top: y - 1.5, width: w, height: 3, borderRadius: 2, background: C.navy, opacity: gateO * ap }} />
        </>;
      })()}

      {/* incoming streams of approved summaries */}
      {MINI_FROM.map((s, i) => <Stream key={i} a={s} b={coreTop} p={kf(g, E + 2 + 3 * i, 14, MOVE) * streamP} g={g} o={streamO} phase={i * 0.21} />)}

      {/* ecosystem lines (under the cards) */}
      {ecoO > 0 && <>
        <Sync a={fold([960, 694])} b={fold([AGENT[0], AGENT[1] - 58])} p={sl} g={g} o={ecoO} />
        {NODES.map((n, i) => {
          const a = kf(g, KB + 4 * i, 16, MOVE);
          const inner = i === 0 ? n.x + NODE_W / 2 : n.x - NODE_W / 2, edge = i === 0 ? 746 : 1174;
          return <Sync key={i} a={fold([edge, 560])} b={fold([inner, 560])} p={a} g={g + 11 * i} o={ecoO} phase={0.3} />;
        })}
        {TILES.map((t, j) => <Sync key={j} a={fold(t.to)} b={fold(t.p)} p={kf(g, CL + 3 * j, 10, MOVE)} g={g + 5 * j} o={ecoO} phase={j * 0.17} />)}
      </>}

      {/* the summary card */}
      {cardO > 0 && <SummaryCard x={960} y={cardY} s={cardS} p={1} o={cardO} />}

      {/* the knowledge base */}
      {coreA > 0 && <CoreNode x={960} y={coreY} fill={fill} glow={coreGlow} s={lerp(0.92, 1, coreA)} o={coreA >= 1 ? 1 : clamp01(coreA * 1.5)} />}

      {/* minis landing */}
      {minis.map(({ j, st, src }) => {
        const t = kf(g, st, 24, MOVE);
        if (t <= 0 || t >= 1) return null;
        const c = cub(src, coreTop, t);
        return <div key={j} style={{ position: "absolute", left: c[0] - 85, top: c[1] - 52, transform: `scale(${1.5 - 0.9 * t})`, opacity: clamp01(t * 6) * (1 - clamp01((t - 0.75) / 0.25)) }}><Mini /></div>;
      })}


      {/* the gate badge (over the card) and management's click */}
      {gateO > 0 && gb > 0 && (
        <div style={{ position: "absolute", left: LINE_X0, top: GATE_Y - py, opacity: gb * gateO, transform: `translateY(-50%) translateY(${(1 - gb) * 24}px)` }}>
          <GateBadge n={1} size={BADGE} approved={ap} showQ />
          {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: ICON[0] - LINE_X0 - 22 - 24 * ring, top: "50%", width: 44 + 48 * ring, height: 44 + 48 * ring, marginTop: -(22 + 24 * ring),
            borderRadius: "50%", border: `3px solid ${C.navy}`, opacity: 0.45 * (1 - ring), boxSizing: "border-box" }} />}
        </div>
      )}
      {cm > 0 && cOut < 1 && <Cursor x={curX} y={curY - py} press={press} o={clamp01(cm * 3) * (1 - cOut)} />}

      {/* the ecosystem cards */}
      {ecoO > 0 && <>
        {ea > 0 && <div style={{ position: "absolute", left: ag[0], top: ag[1], width: "max-content", opacity: clamp01(ea * 1.5) * ecoO,
          transform: `translate(-50%, -50%) translateY(${(1 - ea) * 110}px) scale(${(0.92 + 0.08 * ea) * (1 - 0.7 * fb)})` }}>
          <NodeCard kind="agent" icon="share" title="Ecosystem agent" sub="Keeps clients in sync" size={1.25} glow={agentGlow} />
        </div>}
        {lab > 0 && <div style={{ position: "absolute", left: fold([986, 752])[0], top: fold([986, 752])[1], transform: "translateY(-50%)", opacity: lab * ecoO, display: "flex", alignItems: "center", gap: 8,
          fontFamily: FONT, fontWeight: 600, fontSize: 25, color: C.muted, whiteSpace: "nowrap" }}><Ico n="sync" s={27} c={C.muted} w={2.3} />syncs with</div>}
        {NODES.map((n, i) => {
          const a = kf(g, KB + 4 * i, 16, ARRIVE);
          if (a <= 0) return null;
          const p = fold([n.x, 560]);
          return <div key={i} style={{ position: "absolute", left: p[0] - NODE_W / 2, top: p[1] - 54, width: NODE_W, opacity: clamp01(a * 1.5) * ecoO,
            transform: `translateX(${(1 - a) * (i === 0 ? -140 : 140)}px) scale(${(0.94 + 0.06 * a) * (1 - 0.7 * fb)})` }}>
            <NodeCard kind="tool" icon={n.icon} title={n.t} sub={n.sub} w={NODE_W} size={1.25} />
          </div>;
        })}
        {TILES.map((t, j) => {
          const a = kf(g, CL + 3 * j, 14, ARRIVE);
          if (a <= 0) return null;
          const p = fold([mix(t.p[0], 960 + (t.p[0] - 960) * 1.3, 1 - a), mix(t.p[1], 560 + (t.p[1] - 560) * 1.3, 1 - a)]);
          return <div key={j} style={{ position: "absolute", left: p[0] - 46, top: p[1] - 46, width: 92, height: 92, ...CARD, borderRadius: 24, boxShadow: SHADOW, display: "flex", alignItems: "center",
            justifyContent: "center", opacity: clamp01(a * 2) * ecoO, transform: `scale(${(0.6 + 0.4 * POP(a)) * (1 - 0.7 * fb)})` }}><Ico n={t.icon} s={40} c={C.slate} w={2.1} /></div>;
        })}
      </>}

      </div>
      <LayerTag n={2} p={tag2} />
      <LayerTag n={3} p={tag3} />
    </>
  );
};
