// R10 AG / AH1 / AH2: the collage that settles into a product window, the window, the bolder window.
// All numbers are the reference's (1280 x 720 units, measured per frame); n = the reference frame (fractional).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, Hand, clamp, ease, kf } from "../kit";
import { A, IcoHeart, IcoNext, IcoPause, IcoPrev, IcoRepeat, IcoSearch, IcoShuffle, KBmark, Pic, Px } from "./R10_ui";
import type { PicK } from "./R10_ui";

// the six cards of "Explore more": picture, title, who, how long. Cells (x, y) at 126 x 126 in the light window.
const CARDS: { k: PicK; t: string; s: string; m: string; cx: number; cy: number }[] = [
  { k: "dots", t: "New lead", s: "K.B team", m: "2 min", cx: 631, cy: 201 },
  { k: "pebble", t: "Follow-up sent", s: "K.B team", m: "2 min", cx: 766, cy: 201 },
  { k: "mint", t: "CRM updated", s: "K.B team", m: "1 min", cx: 901, cy: 201 },
  { k: "glyph", t: "Team notified", s: "K.B team", m: "1 min", cx: 631, cy: 366 },
  { k: "plant", t: "Bookings", s: "Your business", m: "3 min", cx: 766, cy: 366 },
  { k: "sketch", t: "Ranking", s: "Your business", m: "3 min", cx: 901, cy: 366 },
];
// the bold window's row order (the reference's second row starts with the pebbles)
const ROW = [1, 0, 2, 3, 4, 5];
const ROW_AT = [878, 875.5, 873, 871, 871, 871];

// where each card is while the collage settles (f833-f846), measured on the reference: [x, y, w]
type R3 = { x: number; y: number; w: number };
const agRect = (i: number, n: number): R3 | null => {
  const c = CARDS[i];
  const cell = (dx = 0): R3 => ({ x: c.cx + dx, y: c.cy, w: 126 });
  switch (i) {
    case 0: // dots: arrives big at the top on f835, drops into its cell on f845
      if (n < 835) return null;
      return { x: kf(n, [[844, 587], [845, 631]]), y: kf(n, [[844, 70], [845, 201]]), w: kf(n, [[844, 213], [845, 126]]) };
    case 1: // pebbles: big on arrival, shrink on f835, settle into the cell
      return { x: kf(n, [[834, 712], [835, 757], [843, 757], [846, 766]]), y: kf(n, [[834, 152], [835, 259], [843, 259], [846, 205]]), w: kf(n, [[834, 233], [835, 143], [843, 143], [846, 126]]) };
    case 2: return n < 839 ? null : cell(13);
    case 3: return n < 839 ? null : cell();
    case 4: return n < 840 ? null : { x: 766, y: kf(n, [[844, 411], [845, 366]]), w: 126 };
    default: // sketch
      return { x: kf(n, [[834, 851], [835, 857], [843, 857], [846, 863]]), y: kf(n, [[834, 289], [835, 360], [843, 360], [846, 368]]), w: kf(n, [[834, 227], [835, 214], [843, 214], [846, 202]]) };
  }
};
const APPEAR = [835, 0, 839, 839, 840, 0];
const popAt = (n: number, n0: number) => (n0 <= 0 ? 1 : clamp(0.55 + (n - n0) / 0.9 * 0.45));

const Label: React.FC<{ i: number; x: number; y: number; col: string; sub: string; w?: number; o?: number }> = ({ i, x, y, col, sub, w = 126, o = 1 }) => (
  <div style={A(x, y, w, 30, { opacity: o })}>
    <div style={{ fontSize: 11, fontWeight: 500, color: col, letterSpacing: -0.2, lineHeight: "14px", whiteSpace: "nowrap" }}>{CARDS[i].t}</div>
    <div style={{ position: "absolute", right: 0, top: 1, color: col }}><IcoHeart s={9} /></div>
    <div style={{ fontSize: 7, fontWeight: 500, color: sub, marginTop: 6, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: sub, opacity: 0.8 }} />{CARDS[i].s}
      <span style={{ border: `0.5px solid ${sub}`, borderRadius: 6, padding: "0 4px", fontSize: 5.5 }}>{CARDS[i].m}</span>
    </div>
  </div>
);

const Header: React.FC<{ fg: string; pill: string; pillActive: string; avatarBg: string }> = ({ fg, pill, pillActive, avatarBg }) => (
  <>
    <div style={A(251, 117, 20, 20, { borderRadius: 10, background: avatarBg, color: "#fff", fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" })}>YB</div>
    <div style={A(280, 117, 100, 24, { color: fg, fontSize: 7.5, fontWeight: 500, lineHeight: "10px" })}>Good morning<br />Your business</div>
    <div style={A(525, 114, 232, 24, { background: pill, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "space-around", fontSize: 8, fontWeight: 500, color: fg, padding: "0 6px", boxSizing: "border-box" })}>
      {["Flow", "Bookings", "Ranking", "Clients"].map((t, k) => <span key={t} style={{ background: k === 1 ? pillActive : "transparent", padding: "3px 9px", borderRadius: 5 }}>{t}</span>)}
    </div>
    <div style={A(1010, 117, 20, 20, { color: fg })}><IcoSearch s={14} /></div>
  </>
);

export const WinScene: React.FC<{ n: number }> = ({ n }) => {
  const ghost = n < 847, bold = n >= 871;
  // ----- ground: black with a purple glow from below on f833 that drains away by f836
  const glow = kf(n, [[833, 1], [834, 0.45], [835, 0.14], [838, 0]]);
  // ----- the window outline and chrome
  const frameO = kf(n, [[843, 0], [844, 1]]);
  const chromeO = ghost ? kf(n, [[843, 0], [844, 1]]) : 1;
  const inset = bold ? kf(n, [[871, 5], [872, 3], [873, 0]]) : 0;
  const knob = kf(n, [[847, 445], [870, 468]]);
  // ----- the big picture (now playing): in the grid it is 251,163; from f866 it grows over the whole window
  const pL = n < 838 ? kf(n, [[837, 310], [838, 251]]) : n < 866 ? 251 : kf(n, [[866, 251], [867, 240], [869, 226], [870, 224]]);
  const pT = n < 866 ? 163 : kf(n, [[866, 163], [867, 150], [869, 112], [870, 100]]);
  const pR = n < 838 ? 640 : n < 866 ? 618 : kf(n, [[866, 618], [867, 760], [869, 880], [870, 1055]]);
  const pB = n < 866 ? (n < 838 ? 448 : n < 847 ? 465 : 492) : kf(n, [[866, 492], [867, 500], [869, 582], [870, 620]]);
  const leafO = n < 836 ? 0 : clamp(0.55 + (n - 836) / 0.9 * 0.45);
  const dim = ghost ? "rgba(255,255,255,.36)" : "#1d1d1d";
  const dimSub = ghost ? "rgba(255,255,255,.28)" : "#6d6a65";
  const bg = "#E6E3DD";
  // refresh button turns blue from f863
  const hover = n >= 863;
  // pointer (screen px): glides to the refresh button and rests; f848 on, rests f858-f899
  const hx = kf(n, [[848, 1552], [850, 1535], [853, 1508], [856, 1482], [859, 1467], [899, 1458]]);
  const hy = kf(n, [[848, 204], [850, 192], [853, 168], [856, 140], [859, 124], [899, 114]]);
  const showHand = n >= 848;
  // the whole bold window's last move: a small breath outwards-in before the cut (f896-f899)
  const endS = bold ? kf(n, [[895, 1], [897, 0.9982], [899, 0.9945]]) : 1;
  return (
    <AbsoluteFill style={{ background: "#020202", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 55% at 50% 108%, rgba(112,84,176,${glow.toFixed(3)}), rgba(60,70,120,${(glow * 0.45).toFixed(3)}) 55%, transparent 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 40% at 50% 100%, rgba(20,60,50,.45), transparent 100%)", opacity: kf(n, [[834, 0.2], [835, 1], [838, 0.7], [842, 0.35], [847, 0.12]]) }} />
      <KBmark />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: `scale(${endS.toFixed(4)})`, willChange: "transform" }}>
        <Px>
          {/* the window: outline in the ghost, beige when lit */}
          {ghost && <div style={A(224, 100, 831, 520, { border: "1px solid rgba(96,92,224,.75)", boxSizing: "border-box", opacity: frameO })} />}
          {n >= 845 && n < 847 && <div style={A(224, 92, 22, 14, { background: "#3556d8", color: "#fff", fontSize: 7, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 })}>div</div>}
          {!ghost && (
            <>
              <div style={A(224, 100, 831, 520, { background: bg })} />
              <div style={A(224, 92, 22, 14, { background: "#3556d8", color: "#fff", fontSize: 7, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1 })}>div</div>
              <div style={A(945, bold ? 62 : 60, 33, 31, { background: hover ? "#2f5be8" : "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: hover ? "#fff" : "#222", boxShadow: "0 1px 4px rgba(0,0,0,.2)" })}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11a8 8 0 0 0-14-4M4 5v4h4M4 13a8 8 0 0 0 14 4M20 19v-4h-4" /></svg>
              </div>
              <div style={A(982, bold ? 62 : 60, 75, 31, { background: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, fontWeight: 500, color: "#1a1a1a", boxShadow: "0 1px 4px rgba(0,0,0,.2)" })}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></svg>Replace
              </div>
            </>
          )}

          {/* ---- the light and ghost grid */}
          {!bold && (
            <>
              {/* the big picture */}
              {leafO > 0 && (
                <div style={A(pL, pT, pR - pL, pB - pT, { opacity: leafO, transform: `scale(${(0.94 + 0.06 * leafO).toFixed(3)})` })}><Pic k="leaf" /></div>
              )}
              {!ghost && n < 866 && <div style={A(259, 170, 60, 10, { color: "#fff", fontSize: 8, fontWeight: 500 })}>Today</div>}
              {n >= 866 && <div style={A(pL + 8, pT + 8, 60, 10, { color: "#fff", fontSize: 8, fontWeight: 500 })}>Today</div>}
              {!ghost && <div style={A(596, 168, 20, 10, { color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1 })}>···</div>}
              {!ghost && <Header fg="#1d1d1d" pill="#CFD6D2" pillActive="#B7C4C1" avatarBg={C.ink} />}
              <div style={{ opacity: chromeO }}>
              <div style={A(630, 164, 200, 18, { fontSize: 13, fontWeight: 500, color: dim, letterSpacing: -0.2 })}>What K.B runs</div>
              <div style={A(990, 171, 40, 12, { fontSize: 8.5, fontWeight: 500, color: dim, textAlign: "right", width: 32, left: 990 })}>Show all</div>
              </div>
              {/* the cards */}
              {CARDS.map((c, i) => {
                const r = n < 847 ? agRect(i, n) : { x: c.cx, y: c.cy, w: 126 };
                if (!r) return null;
                const p = n < 847 ? popAt(n, APPEAR[i]) : 1;
                if (p <= 0) return null;
                const own = n >= 847 && n < 871;
                return (
                  <div key={c.k} style={A(r.x - 2, r.y - 2, r.w + 4, r.w + 4, { opacity: clamp(p * 1.6), transform: `scale(${(0.9 + 0.1 * ease.out(p)).toFixed(3)})`, willChange: "transform" })}>
                    <div style={A(2, 2, r.w, r.w, { overflow: "hidden", boxShadow: own ? "none" : "0 0 0 0 transparent" })}><Pic k={c.k} /></div>
                  </div>
                );
              })}
              {/* the card labels: in the ghost they come as their card reaches its cell */}
              {CARDS.map((c, i) => {
                const lx = n < 847 && i === 2 ? c.cx + 13 : c.cx;
                const ly = c.cy + 135 - (i === 1 && n < 847 ? -4 : 0);
                const o = n >= 847 ? 1 : i === 2 || i === 3 ? clamp((n - 842) / 1) : clamp((n - 845) / 1);
                if (o <= 0) return null;
                return <Label key={i} i={i} x={lx} y={ly} col={dim} sub={dimSub} o={o} />;
              })}
              {/* now-playing block */}
              <div style={{ opacity: chromeO }}>
              <div style={A(250, 505, 300, 22, { fontSize: 17, fontWeight: 500, color: dim, letterSpacing: -0.5 })}>Your product</div>
              <div style={A(250, 527, 200, 12, { fontSize: 8.5, fontWeight: 500, color: dimSub })}>✻&nbsp; K.B team</div>
              <div style={A(600, 503, 12, 12, { color: dimSub })}><IcoHeart s={11} fill={dimSub} /></div>
              <div style={A(554, 539, 180, 16, { color: dim, display: "flex", gap: 24, alignItems: "center", opacity: ghost ? 0.7 : 1 })}>
                <IcoShuffle s={12} /><IcoPrev s={12} />
                <div style={{ width: 28, height: 28, borderRadius: 14, background: ghost ? "rgba(255,255,255,.25)" : "#44464a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "-6px -4px" }}><IcoPause s={11} /></div>
                <IcoNext s={12} /><IcoRepeat s={12} />
              </div>
              <div style={A(255, 580, 24, 10, { fontSize: 8, color: dimSub, fontWeight: 500 })}>0:41</div>
              <div style={A(288, 584, 699, 4, { background: ghost ? "rgba(255,255,255,.14)" : "#C3CBC8", borderRadius: 2 })}>
                <div style={A(0, 0, knob - 288, 4, { background: ghost ? "rgba(120,170,170,.5)" : "#7FA9A6", borderRadius: 2 })} />
                <div style={A(knob - 288 - 6, -4, 12, 12, { borderRadius: 6, background: ghost ? "rgba(220,220,220,.45)" : "#222" })} />
              </div>
              <div style={A(1006, 580, 30, 10, { fontSize: 8, color: dimSub, fontWeight: 500 })}>5:00</div>
              </div>
            </>
          )}

          {/* ---- the bolder window: the picture fills it */}
          {bold && (
            <>
              <div style={A(224 + inset, 100 + inset, 831 - 2 * inset, 520 - 2 * inset, { overflow: "hidden" })}><Pic k="bloom" g={kf(n, [[871, 0.58], [873, 0.6], [875, 0.7], [879, 0.88], [882, 0.98], [884, 1]])} /></div>
              <Header fg="#f6f4fa" pill="rgba(235,240,238,.62)" pillActive="rgba(255,255,255,.75)" avatarBg="#6b5aa8" />
              <div style={A(253, 114, 0, 0, {})} />
              <div style={A(255, 400, 300, 44, { fontSize: 33, fontWeight: 500, color: "#fff", letterSpacing: -1, whiteSpace: "nowrap", textShadow: "0 1px 12px rgba(40,30,90,.25)" })}>Your product</div>
              <div style={A(480, 424, 120, 14, { fontSize: 8, fontWeight: 500, color: "#fff", display: "flex", alignItems: "center", gap: 6 })}>✻ K.B team<span style={{ border: "0.5px solid #fff", borderRadius: 7, padding: "0 5px", fontSize: 6 }}>5 min</span></div>
              <div style={A(255, 453, 18, 10, { fontSize: 6.5, color: "#fff", fontWeight: 500 })}>0:43</div>
              <div style={A(277, 456, 563, 3, { background: "rgba(255,255,255,.4)", borderRadius: 2 })}><div style={A(0, 0, kf(n, [[871, 100], [899, 106]]), 3, { background: "#fff", borderRadius: 2 })} /><div style={A(kf(n, [[871, 100], [899, 106]]) - 4, -2.5, 8, 8, { borderRadius: 4, background: "#fff" })} /></div>
              <div style={A(848, 453, 24, 10, { fontSize: 6.5, color: "#fff", fontWeight: 500 })}>5:00</div>
              <div style={A(894, 448, 140, 20, { color: "rgba(255,255,255,.85)", display: "flex", gap: 14, alignItems: "center" })}>
                <IcoShuffle s={11} /><IcoPrev s={11} />
                <div style={{ width: 26, height: 26, borderRadius: 13, background: "rgba(255,255,255,.55)", color: "#2b2b30", display: "flex", alignItems: "center", justifyContent: "center", margin: "-4px -2px" }}><IcoPause s={10} /></div>
                <IcoNext s={11} /><IcoRepeat s={11} />
              </div>
              {ROW.map((ci, pos) => {
                const c = CARDS[ci], p = clamp((n - ROW_AT[pos]) / 2), x = 255 + 131 * pos;
                if (p <= 0) return null;
                return (
                  <div key={ci} style={A(x - 2, 487, 124, 130, { opacity: p, transform: `translate3d(0, ${((1 - ease.out(p)) * 14).toFixed(2)}px, 0)`, willChange: "transform" })}>
                    <div style={A(2, 2, 118, 80, { overflow: "hidden" })}><Pic k={c.k} /></div>
                    <div style={A(2, 94, 118, 14, { fontSize: 11, fontWeight: 500, color: "#fff", letterSpacing: -0.2, whiteSpace: "nowrap" })}>{c.t}</div>
                    <div style={{ position: "absolute", left: 108, top: 96, color: "#fff" }}><IcoHeart s={9} /></div>
                    <div style={A(2, 113, 118, 10, { fontSize: 6.5, fontWeight: 500, color: "rgba(255,255,255,.75)", whiteSpace: "nowrap" })}>✻ {c.s}</div>
                  </div>
                );
              })}
            </>
          )}
        </Px>
      </div>
      {showHand && <Hand x={hx} y={hy} size={110} />}
    </AbsoluteFill>
  );
};
