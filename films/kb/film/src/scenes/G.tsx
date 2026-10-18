// Scene G (s4 → s5): "For example, when a client mentions launching a new business, the system can recognize
// potential needs, identify relevant connections, and suggest the next steps." The s4 dot opens into a client's call
// transcript (illustrative) under an "Example" eyebrow; "launching a new business" is marked as it is said; need chips
// come out of the mark; from a faint ecosystem network the matching connections light up (a partner, an investor, an
// existing client) while the Venture studio agent works; a next-steps card checks in step by step. Everything
// collapses into the navy dot of s5.
import React from "react";
import { ARRIVE, C, CARD_BIG, Chip, FONT, Flow, Ico, LIN, MOVE, NodeCard, POP, Packet, SNAP, clamp01, f, k, kf, mix } from "../shared";

/* ---------- the transcript (illustrative client) ---------- */
const CARD_W = 1300, CARD_H = 350, CARD_Y = 520;
const QUOTE: { t: string; hl?: string }[][] = [
  [{ t: "“Next" }, { t: "spring" }, { t: "we’re" }, { t: "launching", hl: "w:launching" }, { t: "a", hl: "w:a4" }, { t: "new", hl: "w:new" }, { t: "business,", hl: "w:business2" }],
  [{ t: "and" }, { t: "we’re" }, { t: "starting" }, { t: "from" }, { t: "scratch.”" }],
];
const HL = { x: 780, y: 156 };            // centre of the marked phrase in card coordinates (measured from a still)

/* ---------- needs → connections → next steps ---------- */
const CX = [390, 770, 1150, 1530], CHIP_Y = 520, NODE_Y = 772;
const NEEDS = [
  { t: "Brand & website", icon: "globe", at: "w:system2+0.25" },
  { t: "Software", icon: "portal", at: "w:recognize" },
  { t: "Funding", icon: "coins", at: "w:potential2" },
  { t: "Office space", icon: "building", at: "w:needs" },
];
const NODES = [
  { kind: "tool" as const, icon: "handshake", t: "Partner", sub: "Brand & web studio", at: "w:relevant" },
  { kind: "agent" as const, icon: "rocket", t: "Venture studio", sub: "New businesses", at: "w:identify" },
  { kind: "tool" as const, icon: "investor", t: "Investor", sub: "Early-stage fund", at: "w:relevant+0.3" },
  { kind: "tool" as const, icon: "building", t: "Existing client", sub: "Spare office space", at: "w:connections" },
];
// a faint ecosystem the connections are found in: contacts around the node row, linked to the node slots
const GHOST = [[150, -40], [580, -85], [580, 80], [960, -80], [960, 85], [1340, -85], [1340, 80], [1770, 40]].map(([x, dy]) => ({ x, y: NODE_Y + dy }));
const GLINK = GHOST.flatMap((p) => CX.filter((x) => Math.abs(x - p.x) < 400).map((x) => ({ a: p, b: { x, y: NODE_Y } })));
const STEPS = [
  { t: "Venture studio intro", from: 1, check: "w:suggest+0.3" },
  { t: "Introduce partner", from: 0, check: "w:next" },
  { t: "Investor warm intro", from: 2, check: "w:steps+0.12" },
];
const NS = { x: 960, top: 912, w: 760 };
const PAN = 300;

// the call's audio as a scrolling waveform (bars travel left; amp 0 = quiet, a flat dotted line)
const Wave: React.FC<{ g: number; amp: number }> = ({ g, amp }) => {
  const step = 19, n = 64, off = (g * 5) % step, base = Math.floor((g * 5) / step);
  return (
    <div style={{ position: "relative", height: 44, marginTop: 18, overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => {
        const q = i + base, e = Math.abs(Math.sin(q * 0.83) * Math.sin(q * 0.29 + 1.1)), h = 6 + 36 * amp * Math.pow(e, 0.8) * clamp01(i / 6);
        return <div key={i} style={{ position: "absolute", left: i * step - off, top: 22 - h / 2, width: 8, height: h, borderRadius: 4, background: i > n - 10 ? C.slate : C.faint }} />;
      })}
    </div>
  );
};

export const SceneG: React.FC<{ g: number }> = ({ g }) => {
  const s4 = f("s4"), s5 = f("s5");
  if (g < s4 || g >= s5) return null;   // H draws the s5 dot
  // the hand-off frames are exactly the navy dot
  if (g === s4 || g === s5) return <Packet x={960} y={540} r={14} color={C.navy} />;

  /* ---- "For example": the dot opens into the transcript card ---- */
  const m = k(g, "s4", 0.75);
  const mv = k(g, "w:the", 0.8, MOVE);                               // the card rises to make room for the needs
  const cy = mix(CARD_Y, 268, mv), cs = mix(1, 0.75, mv);
  const cardL = 960 - CARD_W / 2, cardT = CARD_Y - CARD_H / 2;
  // while opening, the card grows out of the dot (at the screen centre), and the dot becomes the client's avatar
  const grow = Math.max(0.001, m);
  const av = { x: 48 + 32, y: 34 + 32 };                              // avatar centre in card coordinates
  const ox = 960 - cardL, oy = 540 - cardT;                            // the screen centre in card coordinates
  const avX = 960 + (av.x - ox) * grow, avY = 540 + (av.y - oy) * grow, avR = mix(14, 32, m);
  const eyebrow = k(g, "w:for", 0.6);
  const nType = Math.max(0, Math.floor(((g - f("s4+0.5")) / 30) * 52));
  const pan = k(g, "w:and4-0.1", 0.7, MOVE);
  const cardOut = k(g, "w:and4-0.15", 0.4, MOVE);
  const col = k(g, "s5-0.33", 0.33, MOVE);
  const dotIn = POP(kf(g, s5 - 8, 8, LIN));

  // where the marked phrase sits on screen once the card has moved
  const hx = 960 + (HL.x - CARD_W / 2) * cs, hy = cy + (HL.y - CARD_H / 2) * cs;
  const ghost = k(g, "w:identify-0.6", 0.8);

  // the camera keeps drifting in slowly through each beat and settles back on the big moves
  const tThe = f("w:the"), t2 = f("w:the+0.8"), tAnd = f("w:and4-0.1"), t3 = f("w:and4+0.6");
  const zoomA = 1 + 0.0022 * (Math.min(g, tThe) - s4) * (1 - mv);                    // on the transcript
  const zoomB = 1 + 0.002 * Math.max(0, Math.min(g, tAnd) - t2) * (1 - pan);         // on needs and connections
  const zoomC = 1 + 0.0018 * Math.max(0, g - t3);                                     // on the next steps
  // the call's audio, scrolling while the client speaks (the transcript types along), then quiet
  const speak = clamp01((g - f("s4+0.4")) / 6) * (1 - k(g, "s4+2.15", 0.5, MOVE));
  let ci = 0;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {col < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - col, transformOrigin: "960px 540px", transform: `scale(${mix(1, 0.18, col)})` }}>
          {/* the Example eyebrow (the one caption allowed here) */}
          {eyebrow > 0 && (
            <div style={{ position: "absolute", left: 120, top: 92, display: "flex", alignItems: "center", gap: 16, opacity: clamp01(eyebrow * 1.5), transform: `translateY(${(1 - eyebrow) * 14}px)` }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="bulb" s={26} c={C.slate} w={2.2} /></div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, letterSpacing: "0.055em", color: "#48647D", textTransform: "uppercase" }}>Example</div>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: `scale(${zoomA * zoomC})` }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 360px", transform: `scale(${zoomB})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${-PAN * pan}px)` }}>
            {/* the faint ecosystem network, out of which the connections light up */}
            {ghost > 0 && (
              <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1200, overflow: "visible", opacity: ghost * (1 - pan) }}>
                {GLINK.map((l, i) => <line key={i} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} stroke={C.line} strokeWidth={2} />)}
                {CX.map((x, i) => <circle key={`n${i}`} cx={x} cy={NODE_Y} r={10} fill={C.white} stroke={C.faint} strokeWidth={2} />)}
                {GHOST.map((p, i) => <circle key={`c${i}`} cx={p.x} cy={p.y} r={7 + (i % 3) * 2} fill={C.white} stroke={C.faint} strokeWidth={2} />)}
              </svg>
            )}
            {/* phrase → needs */}
            {NEEDS.map((n, i) => {
              const e = k(g, n.at, 0.55, MOVE);
              return <Flow key={i} x1={hx} y1={hy + 30 * cs} x2={CX[i]} y2={CHIP_Y - 30} p={e * (1 - cardOut)} g={g + i * 9} bend={(i - 1.5) * 0.04} width={2} color={C.cyanLight} packets={2} speed={0.8} pcolor={C.cyan} />;
            })}
            {/* needs → connections */}
            {NODES.map((n, i) => {
              const e = k(g, n.at, 0.45);
              return <Flow key={i} x1={CX[i]} y1={CHIP_Y + 30} x2={CX[i]} y2={NODE_Y - 48} p={e} g={g + i * 11} width={2.5} color={C.faint} packets={2} speed={0.9} />;
            })}
            {/* connections → next steps */}
            {STEPS.map((s, i) => {
              const e = k(g, `w:and4+${0.1 + i * 0.12}`, 0.5);
              return <Flow key={i} x1={CX[s.from]} y1={NODE_Y + 48} x2={Math.min(NS.x + NS.w / 2 - 50, Math.max(NS.x - NS.w / 2 + 50, CX[s.from]))} y2={NS.top - 6} p={e} g={g + i * 13} width={2.5} color={C.faint} packets={1} speed={1.2} />;
            })}
            {/* the need chips, out of the marked phrase */}
            {NEEDS.map((n, i) => {
              const e = k(g, n.at, 0.55, MOVE), pp = POP(clamp01(e * 1.15));
              if (e <= 0) return null;
              const x = mix(hx, CX[i], e), y = mix(hy, CHIP_Y, e);
              return (
                <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${mix(0.35, 1, pp)})`, opacity: clamp01(e * 3) }}>
                  <Chip text={n.t} icon={n.icon} size={27} tone="cyan" style={{ boxShadow: "0 14px 30px -18px rgba(25,129,172,0.6)" }} />
                </div>
              );
            })}
            {/* the connections light up */}
            {NODES.map((n, i) => {
              const e = k(g, n.at, 0.55);
              if (e <= 0) return null;
              const glow = n.kind === "agent" ? clamp01(e * 2) * (0.7 + 0.3 * Math.sin((g - f(n.at)) / 6)) : 0;
              return (
                <div key={i} style={{ position: "absolute", left: CX[i], top: NODE_Y, transform: `translate(-50%, -50%) scale(${mix(0.82, 1, e)})`, opacity: clamp01(e * 1.6) }}>
                  <NodeCard kind={n.kind} icon={n.icon} title={n.t} sub={n.sub} w={350} size={1.08} glow={glow} />
                </div>
              );
            })}
            {/* the next steps */}
            {(() => {
              const a = k(g, "w:and4", 0.6);
              if (a <= 0) return null;
              return (
                <div style={{ position: "absolute", left: NS.x - NS.w / 2, top: NS.top, width: NS.w, ...CARD_BIG, borderRadius: 26, padding: "24px 32px 14px", opacity: clamp01(a * 1.5), transform: `translateY(${(1 - a) * 30}px)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: C.cyanTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="flag" s={25} c={C.cyan} w={2.2} /></div>
                    <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, letterSpacing: "-0.03em", color: C.ink }}>Suggested next steps</div>
                  </div>
                  {STEPS.map((s, i) => {
                    const r = k(g, `w:suggest+${i * 0.12}`, 0.45), c = POP(k(g, s.check, 0.3, LIN));
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 64, borderTop: `1px solid ${C.mist}`, opacity: clamp01(r * 1.6), transform: `translateX(${(1 - r) * 24}px)` }}>
                        <div style={{ position: "relative", width: 38, height: 38, borderRadius: "50%", background: C.mist, flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.slate }}>
                          {i + 1}
                          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.navy, transform: `scale(${c})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Ico n="check" s={24} c={C.white} w={2.8} />
                          </div>
                        </div>
                        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 27, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap" }}>{s.t}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            {/* the client's transcript */}
            {cardOut < 1 && (
              <div style={{ position: "absolute", left: 960 - CARD_W / 2, top: cy - CARD_H / 2, width: CARD_W, height: CARD_H, transformOrigin: "50% 50%", transform: `scale(${cs})`, opacity: 1 - cardOut }}>
                <div style={{ position: "absolute", inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${grow})` }}>
                <div style={{ position: "absolute", inset: 0, ...CARD_BIG, borderRadius: 30, opacity: clamp01(m * 3) }} />
                <div style={{ position: "absolute", inset: 0, padding: "34px 48px", opacity: clamp01((m - 0.6) * 3) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 64 + 18, height: 64 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, letterSpacing: "-0.02em", color: C.ink }}>Mila Jansen</div>
                      <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 22, color: C.muted }}>Client · call transcript</div>
                    </div>
                    <Chip text="Transcription" icon="wave" size={22} tone="soft" />
                  </div>
                  <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 500, fontSize: 46, lineHeight: 1.3, letterSpacing: "-0.02em", color: C.ink }}>
                    {QUOTE.map((ln, li) => (
                      <div key={li} style={{ display: "flex", columnGap: 13, whiteSpace: "nowrap", minHeight: 60 }}>
                        {ln.map((w, wi) => {
                          const start = ci; ci += w.t.length + 1;
                          // each word rises in as the transcript reaches it
                          const wr = ARRIVE(clamp01((nType - start) / 9));
                          if (wr <= 0) return null;
                          const h = w.hl ? k(g, w.hl, 0.28, SNAP) : 0;
                          return (
                            <span key={wi} style={{ position: "relative", display: "inline-block", opacity: clamp01(wr * 1.6), transform: `translateY(${(1 - wr) * 26}px)` }}>
                              {h > 0 && <span style={{ position: "absolute", left: -5, right: -5, top: 3, bottom: 0, borderRadius: 8, background: C.cyanTint, transformOrigin: "0 50%", transform: `scaleX(${h})` }} />}
                              <span style={{ position: "relative", color: h > 0.4 ? C.cyanDeep : C.ink, fontWeight: h > 0.4 ? 600 : 500 }}>{w.t}</span>
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <Wave g={g} amp={speak} />
                </div>
                </div>
                {/* the client's avatar: the s4 dot, settled into the card */}
                {m >= 1 && (
                  <div style={{ position: "absolute", left: 48, top: 34, width: 64, height: 64, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: FONT, fontWeight: 700, fontSize: 23, color: C.white }}><span style={{ opacity: k(g, "s4+0.7", 0.3) }}>MJ</span></div>
                )}
              </div>
            )}
          </div>
          {/* the dot travelling into the avatar position while the card opens */}
          {m < 1 && <div style={{ position: "absolute", left: avX - avR, top: avY - avR, width: 2 * avR, height: 2 * avR, borderRadius: "50%", background: C.navy,
            boxShadow: `0 0 0 ${avR * 0.6 * (1 - m)}px rgba(52,74,101,${0.12 * (1 - m)})` }} />}
          </div>
          </div>
        </div>
      )}
      {dotIn > 0 && <Packet x={960} y={540} r={14 * dotIn} color={C.navy} />}
    </div>
  );
};
