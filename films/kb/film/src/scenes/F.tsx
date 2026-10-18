// Scene F (s3 → s4): "Management reviews each stage before personalized outreach is prepared, approved, sent, and
// tracked." On the overview map the four gates light up one by one (1–2 pulse again, 3–4 approve) and a note gives
// the review rhythm (PDF: gates 1–3 in a Slack digest, gate 4 per message). The camera pushes into layers 6–7: the
// outreach router segments by audience and picks the partner channel, a personalised draft types out (illustrative),
// gate 4 approves it with management's click, it flies along its channel into layer 7 and is tracked
// (Sent → Opened → Replied, logged). Everything collapses into the navy dot of s4 (drawn by G on the s4 frame).
import React from "react";
import {
  C, CARD, CARD_BIG, Chip, Cursor, FONT, Flow, GRAD, GateBadge, Ico, LIN, LayerTag, MAP, MOVE, POP, Packet,
  PipelineMap, SNAP, clamp01, f, k, kf, mapGateY, mix,
} from "../shared";

/* ---------- layer 6: the outreach router (PDF facts) ---------- */
const SEG = [
  { icon: "investor", t: "Investors", tone: "Formal, from Robin", ch: ["Email", "One-pager", "Warm intro"] },
  { icon: "building", t: "Clients", tone: "Account context", ch: ["Email", "Client portal"] },
  { icon: "handshake", t: "Partners", tone: "Informal, fast", ch: ["WhatsApp", "Slack"] },
  { icon: "share", t: "Referrals, leads", tone: "Intro-led", ch: ["LinkedIn", "Email"] },
];
const SX = [330, 750, 1170, 1590], SEG_TOP = 222, SEG_W = 380, SEG_H = 204, PICK = 2;
// the personalised draft (illustrative: a short informal note to a partner)
const DRAFT = { x: 960, top: 540, w: 1000, h: 240 };
const MSG = "Hi Jonas! A client of ours is opening a second location and needs a fit-out partner. Intro this week?";
const GATE_Y = 884;                       // gate 4 in the close-up
const TRACK = { x: 960, y: 1130, w: 1060, h: 140 };
const PAN = 344;                          // the camera's move down into layer 7 (gate 4 lands on the centre line)

const GateRipple: React.FC<{ n: number; approved: number; s: number; r: number }> = ({ n, approved, s, r }) => (
  <div style={{ position: "absolute", left: MAP.cx0 - 60, top: mapGateY(n), transform: `translateY(-50%) scale(${1 + 0.16 * s})`, transformOrigin: "0 50%" }}>
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: `2px solid ${C.navy}`, transform: `scale(${1 + 0.12 * r}, ${1 + 0.7 * r})`, opacity: 0.55 * (1 - r) }} />
      <GateBadge n={n} size={15} approved={approved} />
    </div>
  </div>
);

const Stage: React.FC<{ t: string; on: number; ok?: boolean }> = ({ t, on, ok }) => {
  const c = ok ? C.ok : C.navy, a = POP(clamp01(on));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 38, height: 38, borderRadius: "50%", background: C.mist, flex: "none" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: c, transform: `scale(${a})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ico n="check" s={24} c={C.white} w={2.8} />
        </div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", color: on > 0.5 ? (ok ? C.ok : C.ink) : C.faint, whiteSpace: "nowrap" }}>{t}</div>
    </div>
  );
};

export const SceneF: React.FC<{ g: number }> = ({ g }) => {
  const s3 = f("s3"), s4 = f("s4");
  // F draws s3 … s4−1; the s4 frame (the dot) is drawn by G alone, so the hand-off frame is never drawn twice
  if (g < s3 || g >= s4) return null;

  /* ---- 1. the map: the four gates light up on "management / reviews / each / stage" ---- */
  const GW = ["w:management", "w:reviews", "w:each", "w:stage"];
  const ap = [1, 1, k(g, "w:each", 0.25, LIN), k(g, "w:stage", 0.25, LIN)];
  const push = k(g, "w:before", 0.9, MOVE);                         // camera into layers 6–7
  const und = k(g, "w:before", 0.6, MOVE);                          // layers 6–7 undim
  const mapO = 1 - k(g, "w:before+0.45", 0.4, MOVE);
  // a slow push on the map while the gates light (the camera never stops), then the push into layers 6–7
  const drift = 0.0018 * (Math.min(g, f("w:before")) - s3);
  const fx = mix(960, MAP.spineX, push), fy = mix(540, mapGateY(4), push), sc = mix(1 + drift, 1.6, push);
  const note = k(g, "w:reviews", 0.6) * (1 - k(g, "w:before", 0.3, MOVE));

  /* ---- 2. the close-up: layers 6–7 ---- */
  const cu = k(g, "w:before+0.4", 1.0, MOVE);                       // the close-up takes over from the map
  const pan = k(g, "w:sent-0.15", 0.75, MOVE);                      // down through gate 4 into layer 7
  const sel = k(g, "w:outreach+0.25", 0.4, SNAP);                             // the router picks the partner segment
  const segOut = k(g, "w:sent-0.2", 0.35, MOVE);
  const dA = k(g, "w:is3-0.1", 0.55);
  const nType = Math.max(0, Math.min(MSG.length, Math.floor(((g - f("w:is3+0.1")) / 30) * 112)));
  const gA = k(g, "w:prepared", 0.5);
  const apr = k(g, "w:approved2", 0.2, LIN);
  const chan = k(g, "w:approved2+0.35", 0.4);                       // the channel line to layer 7
  const fly = k(g, "w:sent", 0.32, MOVE);                            // the message flies along it
  const tA = k(g, "w:sent+0.05", 0.5);
  const st = [k(g, "w:sent+0.3", 0.3, LIN), k(g, "w:and3+0.05", 0.3, LIN), k(g, "w:tracked-0.05", 0.3, LIN)];
  const logged = k(g, "w:tracked+0.12", 0.3);
  const tag6 = k(g, "w:personalized+0.4", 0.5) * (1 - k(g, "w:sent-0.1", 0.25, MOVE));
  const tag7 = k(g, "w:sent+0.12", 0.5);
  // management's cursor on gate 4
  const cIn = k(g, "w:approved2-0.6", 0.55, MOVE), cOut = k(g, "w:approved2+0.3", 0.5, MOVE);
  const press = k(g, "w:approved2-0.05", 0.08, LIN) * (1 - k(g, "w:approved2+0.08", 0.15, LIN));
  const curX = mix(mix(1380, 1010, cIn), 1420, cOut), curY = mix(mix(1060, GATE_Y + 4, cIn), 1120, cOut);

  /* ---- 3. collapse into the dot (complete on s4−1) ---- */
  const col = kf(g, s4 - 11, 10, MOVE);
  const dot = POP(kf(g, s4 - 9, 8, LIN));

  // the close-up keeps a slow push, settles back during the move into layer 7, then pushes on
  const zA = f("w:before+0.6"), zB = f("w:sent-0.15"), zC = f("w:sent+0.6");
  const zoom = 1 + 0.0018 * Math.max(0, Math.min(g, zB) - zA) * (1 - pan) + 0.0022 * Math.max(0, g - zC);
  const typing = nType > 0 && nType < MSG.length;
  const caret = typing || (nType >= MSG.length && apr <= 0 && Math.floor(g / 8) % 2 === 0);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {col < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - col, transformOrigin: "960px 540px", transform: `scale(${mix(1, 0.18, col)})` }}>
          {/* the overview map, then the push into layers 6–7 */}
          {mapO > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: mapO }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - fx * sc}px, ${540 - fy * sc}px) scale(${sc})` }}>
                <PipelineMap g={g} approved={ap} dim={[0, 0, 0, 0, 0, 1 - und, 1 - und]} />
                {GW.map((w, i) => {
                  const r = k(g, w, 0.6, LIN), s = k(g, w, 0.2) * (1 - k(g, `${w}+0.2`, 0.4, MOVE));
                  if (r <= 0 || r >= 1) return null;
                  return <GateRipple key={i} n={i + 1} approved={ap[i]} s={s} r={r} />;
                })}
              </div>
              {note > 0 && (
                <div style={{ position: "absolute", left: MAP.cx0 - 60, top: 922, display: "flex", alignItems: "center", gap: 18, padding: "12px 26px 12px 12px", ...CARD, borderRadius: 999,
                  opacity: note, transform: `translateY(${(1 - note) * 26}px)`, fontFamily: FONT, fontSize: 22, whiteSpace: "nowrap" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.gateTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="userCheck" s={24} c={C.navy} w={2.3} /></div>
                  <span><b style={{ fontWeight: 700, color: C.navy }}>Gates 1–3</b><span style={{ fontWeight: 500, color: C.muted }}> · daily or weekly Slack digest</span></span>
                  <span style={{ width: 1.5, height: 26, background: C.line }} />
                  <span><b style={{ fontWeight: 700, color: C.navy }}>Gate 4</b><span style={{ fontWeight: 500, color: C.muted }}> · every message</span></span>
                </div>
              )}
            </div>
          )}

          {/* the close-up of layers 6–7 */}
          {cu > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: clamp01(cu * 1.6), transformOrigin: "960px 540px", transform: `scale(${mix(0.8, 1, cu) * zoom})` }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${-PAN * pan}px)` }}>
                {/* the router: four audiences, each with its channels */}
                {segOut < 1 && SEG.map((s, i) => {
                  const a = k(g, `w:before+${0.55 + i * 0.07}`, 0.6), on = i === PICK;
                  const o = a * (1 - segOut) * (on ? 1 : 1 - 0.55 * sel);
                  return (
                    <div key={i} style={{ position: "absolute", left: SX[i] - SEG_W / 2, top: SEG_TOP, width: SEG_W, height: SEG_H, ...CARD, padding: "22px 24px", opacity: o,
                      transform: `translateY(${(1 - a) * 60 - (on ? 14 * sel : 0)}px)`, boxShadow: on && sel > 0 ? `0 0 0 ${2.5 * sel}px ${C.navy}, 0 30px 60px -28px rgba(41,58,81,0.35)` : CARD.boxShadow }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, flex: "none", background: on && sel > 0.5 ? GRAD : C.mist, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Ico n={s.icon} s={28} c={on && sel > 0.5 ? C.white : C.slate} w={2.1} />
                        </div>
                        <div>
                          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap" }}>{s.t}</div>
                          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 20, color: C.muted, whiteSpace: "nowrap" }}>{s.tone}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                        {s.ch.map((c, j) => {
                          const pick = on && j === 0, pp = pick ? POP(k(g, "w:outreach+0.35", 0.35)) : 0;
                          return <Chip key={c} text={c} size={20} tone={pick && pp > 0.5 ? "navy" : "outline"} icon={pick && pp > 0.5 ? "check" : undefined}
                            style={{ transform: `scale(${pick ? 1 + 0.08 * Math.sin(Math.PI * clamp01(pp)) : 1})` }} />;
                        })}
                      </div>
                    </div>
                  );
                })}
                {/* router → draft */}
                <Flow x1={SX[PICK]} y1={SEG_TOP + SEG_H + 4} x2={SX[PICK]} y2={DRAFT.top - 4} p={k(g, "w:outreach+0.4", 0.35) * (1 - segOut)} g={g} packets={1} speed={1.3} width={2.5} />
                {/* the channel: draft → gate 4 → layer 7 */}
                <Flow x1={DRAFT.x} y1={DRAFT.top + DRAFT.h + 4} x2={TRACK.x} y2={TRACK.y - TRACK.h / 2 - 6} p={chan} g={g} width={2.5} color={apr > 0.5 ? C.faint : C.line} />
                {chan > 0 && (
                  <div style={{ position: "absolute", left: DRAFT.x + 26, top: mix(GATE_Y + 52, GATE_Y + 64, 1 - chan), opacity: chan }}>
                    <Chip text="WhatsApp" icon="chat" size={20} tone="soft" />
                  </div>
                )}
                {/* gate 4: message approval */}
                {gA > 0 && (
                  <>
                    <div style={{ position: "absolute", left: 300, width: 1320, top: GATE_Y - 1, height: 0, borderTop: `2px ${apr > 0.5 ? "solid" : "dashed"} ${apr > 0.5 ? C.navy : "rgba(52,74,101,0.45)"}`,
                      transform: `scaleX(${gA})`, opacity: clamp01(gA * 2) }} />
                    <div style={{ position: "absolute", left: 960, top: GATE_Y, transform: `translate(-50%, -50%) scale(${mix(0.92, 1, gA)})`, opacity: clamp01(gA * 1.5) }}>
                      <GateBadge n={4} size={24} approved={apr} showQ />
                    </div>
                  </>
                )}
                {/* the message on its way */}
                {fly > 0 && fly < 1 && <Packet x={DRAFT.x} y={mix(DRAFT.top + DRAFT.h + 6, TRACK.y - TRACK.h / 2 - 8, fly)} r={12} color={C.navy} />}
                {/* the personalised draft */}
                {dA > 0 && (
                  <div style={{ position: "absolute", left: DRAFT.x - DRAFT.w / 2, top: DRAFT.top, width: DRAFT.w, height: DRAFT.h, ...CARD_BIG, borderRadius: 26, padding: "24px 32px",
                    opacity: clamp01(dA * 1.5), transform: `translateY(${(1 - dA) * 28}px)` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 54, height: 54, borderRadius: "50%", background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.slate }}>JB</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: "-0.02em", color: C.ink }}>Jonas Berg</div>
                        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 20, color: C.muted }}>Partner · Fit-out studio</div>
                      </div>
                      <Chip text={fly > 0.98 ? "Sent" : apr > 0.5 ? "Approved" : "Draft"} size={20} tone={apr > 0.5 ? "navy" : "soft"} icon={apr > 0.5 ? (fly > 0.98 ? "send" : "check") : "doc"} />
                    </div>
                    <div style={{ height: 1, background: C.line, margin: "18px 0 16px" }} />
                    <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 30, lineHeight: 1.42, letterSpacing: "-0.015em", color: C.ink }}>
                      {MSG.slice(0, nType)}
                      {caret && <span style={{ display: "inline-block", width: 3, height: 30, background: C.navy, marginLeft: 3, verticalAlign: "-5px" }} />}
                    </div>
                  </div>
                )}
                {/* layer 7: send and track */}
                {tA > 0 && (
                  <div style={{ position: "absolute", left: TRACK.x - TRACK.w / 2, top: TRACK.y - TRACK.h / 2, width: TRACK.w, height: TRACK.h, ...CARD_BIG, borderRadius: 26, padding: "0 36px 0 30px",
                    display: "flex", alignItems: "center", gap: 26, opacity: clamp01(tA * 1.5), transform: `translateY(${(1 - tA) * 26}px)` }}>
                    <div style={{ width: 56, height: 56, borderRadius: 15, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n="send" s={30} c={C.slate} w={2.1} /></div>
                    <div style={{ width: 300 }}>
                      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap" }}>To Jonas Berg</div>
                      <div style={{ position: "relative", height: 26, fontFamily: FONT, fontWeight: 500, fontSize: 20, color: C.muted, whiteSpace: "nowrap" }}>
                        <span style={{ position: "absolute", left: 0, top: 0, opacity: 1 - logged }}>via WhatsApp</span>
                        <span style={{ position: "absolute", left: 0, top: 0, opacity: logged, display: "flex", alignItems: "center", gap: 7, transform: `translateY(${(1 - logged) * 10}px)` }}>
                          <Ico n="db" s={20} c={C.slate} w={2.1} />Reply logged
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 18 }}>
                      <Stage t="Sent" on={st[0]} />
                      <Ico n="arrow" s={24} c={st[1] > 0.5 ? C.slate : C.faint} w={2.2} />
                      <Stage t="Opened" on={st[1]} />
                      <Ico n="arrow" s={24} c={st[2] > 0.5 ? C.slate : C.faint} w={2.2} />
                      <Stage t="Replied" on={st[2]} ok />
                    </div>
                  </div>
                )}
                {/* management's click on gate 4 */}
                {cIn > 0 && cOut < 1 && <Cursor x={curX} y={curY} press={press} o={clamp01(cIn * 2) * (1 - cOut)} />}
              </div>
            </div>
          )}
          <LayerTag n={6} p={tag6} />
          <LayerTag n={7} p={tag7} />
        </div>
      )}
      {dot > 0 && <Packet x={960} y={540} r={14 * dot} color={C.navy} />}
    </div>
  );
};
