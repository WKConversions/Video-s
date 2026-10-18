// Scene E — gate 2 and layer 5, the specialist agents (sD → s3). The four scored opportunities rise; gate 2
// (Opportunity triage) draws beneath them and its approval sweeps across, checking each card; the layer-5 agents
// arrive (Venture studio idle) and each card flies to its specialist, which glows while it works; on "actionable
// proposals" each working agent outputs a proposal document; then the close-up pulls back and settles into layer
// 5's row of the overview map. Starts exactly on sD, ends exactly on s3.
import React from "react";
import { C, CARD, FONT, Flow, GateBadge, Ico, LayerTag, MAP, MOVE, NodeCard, OPP, OppCard, POP, PipelineMap, SNAP, clamp01, f, k, kf, mapNodeX, mapRowY } from "../shared";

const lerp = (a: number, b: number, t: number) => (t <= 0 ? a : t >= 1 ? b : a + (b - a) * t);

// The close-up is layer 5 of the map at 1.5×: agent i of the map row sits at local x = 960 + (mapNodeX - 1110) × 1.5.
const Z = 1.5, AX0 = 1110, AY = mapRowY(5);
const AGENTS = [
  { icon: "rocket", t: "Venture studio", sub: "New businesses" },
  { icon: "handshake", t: "Partnership", sub: "Partner to partner" },
  { icon: "up", t: "Upsell", sub: "Existing clients" },
  { icon: "share", t: "Referral", sub: "Who refers whom" },
  { icon: "investor", t: "Investor match", sub: "Partner to investor" },
];
const ax = (j: number) => 960 + (mapNodeX(5, j) - AX0) * Z;
const AG_W = 320, AG_HH = 44;
const ROUTE = [1, 3, 4, 2];                 // opportunity i → agent j (Partnership, Referral, Investor match, Upsell)
const TY0 = 700, TY1 = 370;                 // the agent row's screen y: with the cards above it, then with the proposals below
const CARD_Y = 350, CARD_S = 0.86;          // the cards' row once they rise
const cardX = (i: number) => 960 + (OPP.xs[i] - 960) * 0.9;
const GATE_X0 = 140, GATE_X1 = 1780;
const MAP_GX0 = (MAP.cx0 - 60 - (AX0 - 960 / Z)) * Z, MAP_GX1 = (MAP.cx1 + 60 - (AX0 - 960 / Z)) * Z;   // the map's gate line, in local coords

// the proposals, in agent order (illustrative)
const DOCS = [
  { a: 1, t: "Joint offer", act: "Bundle with partner", who: "Lena Brandt, CEO", when: "This week" },
  { a: 2, t: "Second site", act: "Booking for site 2", who: "Sarah Lee, CEO", when: "Before opening" },
  { a: 3, t: "Warm referral", act: "Intro to a new lead", who: "Tom Vries, founder", when: "Next Tuesday" },
  { a: 4, t: "Investor intro", act: "Share the one-pager", who: "Anna Meyer, VC", when: "Within 2 weeks" },
];
const DOC = { w: 400, h: 282, dy: 330 };
const docX = (j: number) => 960 + (j - 1.5) * 440;

const Doc: React.FC<{ d: (typeof DOCS)[number]; x: number; y: number; s: number; p: number; o: number }> = ({ d, x, y, s, p, o }) => {
  const ty = (txt: string, a: number) => txt.slice(0, Math.floor(txt.length * clamp01((p - a) / 0.3)));
  const row = (icon: string, txt: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 11, height: 36 }}>
      <Ico n={icon} s={25} c={C.slate} w={2.1} />
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", color: C.slate, whiteSpace: "nowrap" }}>{txt}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x - DOC.w / 2, top: y - DOC.h / 2, width: DOC.w, height: DOC.h, transform: `scale(${s})`, transformOrigin: "50% 50%", opacity: o, ...CARD, borderRadius: 24, padding: "24px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 54, height: 54, borderRadius: 15, background: C.cyanTint, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n="doc" s={30} c={C.cyan} w={2.1} /></div>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, letterSpacing: "0.08em", color: C.cyanDeep, textTransform: "uppercase" }}>Proposal</div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 29, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap" }}>{d.t}</div>
        </div>
      </div>
      <div style={{ height: 1, background: C.line, margin: "16px 0 14px" }} />
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, letterSpacing: "0.07em", color: C.soft, textTransform: "uppercase" }}>Proposed action</div>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 25, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", height: 38, marginTop: 2 }}>{ty(d.act, 0.1)}</div>
      {row("user", ty(d.who, 0.4))}
      {row("clock", ty(d.when, 0.65))}
    </div>
  );
};

export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  const A = f("sD"), B = f("s3");
  if (g < A || g >= B) return null;

  // layer marker 4 → 5 on "specialized"; it leaves with the pull-back
  const pullA = B - 25, m = kf(g, pullA, 24, MOVE);
  const tag4 = 1 - k(g, "w:specialized-0.05", 0.25, SNAP);
  const tag5 = k(g, "w:specialized+0.25", 0.45) * (1 - clamp01(m / 0.2));

  // the cards rise and shrink to make room for the gate and the agents
  const m1 = k(g, "sD", 0.9);
  // gate 2: line + badge, then the approval sweep (dashed → solid navy) checks each card, then "Approved"
  const gd = k(g, "sD+0.15", 0.6, MOVE), gb = k(g, "sD+0.1", 0.5);
  const sw = k(g, "w:specialized+0.2", 0.6, MOVE), fillX = lerp(GATE_X0, GATE_X1, sw);
  const ap = clamp01((g - f("w:specialized+0.8")) / 6);
  // the agents arrive
  const agIn = (j: number) => kf(g, f("w:specialized+0.15") + j * 3, 18);
  // each card flies to its specialist on "develop"
  const fly = (i: number) => kf(g, f("w:develop") - 3 + i * 6, 24, MOVE);
  const landF = (i: number) => f("w:develop") - 3 + i * 6 + 24;
  // the camera rises to make room for the proposals, on "into actionable"
  const up = kf(g, f("w:into3") - 14, 38, MOVE);
  const TY = lerp(TY0, TY1, up);
  const gateY = lerp(-170, (560 - AY) * Z, up);       // local; ends on the map's gate-2 line
  // the proposals, on "actionable"
  const docT = (j: number) => f("w:into3") + j * 3;

  // pull-back: the close-up (local coords) shrinks into layer 5's row of the map; s=2/3 maps local → map world
  const s = lerp(1, 1 / Z, m), tx = lerp(0, AX0 - 960 / Z, m);
  const tyE = lerp(TY, AY, m);
  const camT = `translate(${tx}px, ${tyE}px) scale(${s})`;
  const S = Z * s, mapT = m >= 1 ? undefined : `translate(${tx - (AX0 - 960 / Z) * S}px, ${tyE - AY * S}px) scale(${S})`;
  // the close-up gate morphs onto the map's gate-2 line and badge (same size at 1.5×), so it can stay until the map is in
  const oClose = m < 1 ? 1 : 0, oAg = 1 - clamp01((m - 0.2) / 0.35), oGate = 1 - clamp01((m - 0.6) / 0.4), fold = MOVE(clamp01(m / 0.55));
  const gm = MOVE(clamp01(m / 0.6)), gx0 = lerp(GATE_X0, MAP_GX0, gm), gx1 = lerp(GATE_X1, MAP_GX1, gm);
  const oMap = clamp01(m / 0.5);
  const breath = (j: number) => 0.72 + 0.28 * Math.sin(g / 6 + j * 1.3);

  // a slow push through the close-up; it resolves to identity with the pull-back
  const P = 1 + 0.06 * kf(g, A, pullA - A, MOVE) * (1 - m);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
     <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 560px", transform: P !== 1 ? `scale(${P})` : undefined }}>
      {/* the overview map, arriving around the close-up */}
      {oMap > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: mapT, opacity: oMap < 1 ? oMap : undefined }}>
          <PipelineMap g={g} approved={[1, 1, 0, 0]} dim={[0, 0, 0, 0, 0, 1, 1]} glow={[0, 0, 0, 0, Math.max(0, 1 - m * 1.4), 0, 0]} />
        </div>
      )}


      {/* the opportunity cards (screen coordinates: they are gone before the pull-back; drawn under the gate and the agents they sink into) */}
      {OPP.xs.map((x0, i) => {
        const fl = fly(i);
        if (fl >= 1) return null;
        const j = ROUTE[i];
        const x = lerp(lerp(x0, cardX(i), m1), ax(j), fl), y = lerp(lerp(OPP.y, CARD_Y, m1), TY, fl);
        const sc = lerp(lerp(1, CARD_S, m1), 0.22, fl), o = 1 - clamp01((fl - 0.55) / 0.45);
        // the gate's check, as the sweep passes under the card
        const ck = POP(clamp01((fillX - cardX(i) + 40) / 110));
        return (
          <React.Fragment key={i}>
            <OppCard i={i} x={x} y={y} s={sc} p={1} o={o} />
            {ck > 0 && (
              <div style={{ position: "absolute", left: x + (OPP.w / 2) * sc - 18, top: y - (OPP.h / 2) * sc - 18, width: 40, height: 40, borderRadius: "50%", background: C.navy, opacity: o,
                display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ck * lerp(1, 0.4, fl)})`, boxShadow: "0 8px 18px -8px rgba(23,44,67,0.55)" }}>
                <Ico n="check" s={24} c={C.white} w={3} />
              </div>
            )}
          </React.Fragment>
        );
      })}
      {/* close-up layer, in local coordinates (agent row at y = 0) */}
      {oClose > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: camT }}>
          {/* gate 2 */}
          {gd > 0 && oGate > 0 && (
            <div style={{ position: "absolute", left: 0, top: gateY, width: 1920, opacity: oGate }}>
              <div style={{ position: "absolute", left: gx0, width: (gx1 - gx0) * gd, top: -1, borderTop: `2px dashed rgba(52,74,101,0.45)` }} />
              {sw > 0 && <div style={{ position: "absolute", left: gx0, width: (sw >= 1 ? gx1 : fillX) - gx0, top: -1.5, height: 3, background: C.navy }} />}
              <div style={{ position: "absolute", left: gx0 - 20 * (1 - gm), top: 0, transform: `translateY(-50%) translateX(${(1 - gb) * -30}px)`, opacity: gb }}>
                <GateBadge n={2} size={15 * Z} showQ approved={ap} />
              </div>
            </div>
          )}

          {/* the proposal lines (AI output, cyan packets) */}
          {DOCS.map((d, j) => {
            const p = kf(g, docT(j) - 2, 9, MOVE) * (1 - fold);
            if (p <= 0) return null;
            return <Flow key={`dl${j}`} x1={ax(d.a)} y1={AG_HH + 6} x2={docX(j)} y2={DOC.dy - DOC.h / 2 - 8} p={p} g={g + j * 8} width={2.4} color={C.line} packets={2} speed={0.9} pcolor={C.cyan} />;
          })}

          {/* the specialist agents (map order) */}
          {AGENTS.map((a, j) => {
            const b = agIn(j);
            if (b <= 0) return null;
            const i = ROUTE.indexOf(j), gl = i < 0 ? 0 : kf(g, landF(i) - 3, 8) * breath(j) * (1 - m);
            return (
              <div key={a.t} style={{ position: "absolute", left: ax(j) - AG_W / 2, top: -AG_HH + (1 - b) * 40, opacity: clamp01(b * 1.4) * (j === 0 ? 0.5 : 1) * oAg }}>
                <NodeCard kind="agent" icon={a.icon} title={a.t} sub={a.sub} w={AG_W} glow={gl} />
              </div>
            );
          })}

          {/* the proposals: out of each working agent on "actionable"; they fold back into the row as the camera pulls back */}
          {DOCS.map((d, j) => {
            const t0 = docT(j), e = kf(g, t0, 14, MOVE);
            if (e <= 0) return null;
            const x = lerp(lerp(ax(d.a), docX(j), e), ax(d.a), fold), y = lerp(lerp(0, DOC.dy, e), 0, fold);
            return <Doc key={d.t} d={d} x={x} y={y} s={lerp(0.3, 1, e) * lerp(1, 0.2, fold)} p={kf(g, t0 + 2, 24, (t) => t)} o={clamp01(e * 2) * (1 - fold)} />;
          })}
        </div>
      )}

     </div>
      {tag4 > 0 && <LayerTag n={4} p={tag4} />}
      {tag5 > 0 && <LayerTag n={5} p={tag5} />}
    </div>
  );
};
