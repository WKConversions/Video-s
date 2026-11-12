// vino-mio: "Every booking finds its table" (../cases/vino-mio.md).
// A top-down Zenchef floor plan of the Vino Mio dining room (seal + Zenchef tile in the header, six round tables, a
// flamenco stage). Left: booking messages (email, chat) drop out of the GetYourGuide tile into a crooked pile; a manager
// cursor with a red time ring drags one to a table by hand, then taps GetYourGuide to keep it in step. The K.B tile drops
// onto the card's edge, the pile flips into neat GetYourGuide tickets, a live availability mini-map pops up, and each
// ticket slides into K.B and is POURED into a table (flourish: a glossy liquid ribbon arcs over the room, splashes in and
// fills the table Vino Mio blue with a sloshing surface; the coral ring makes it the Vino Mio seal) while its mini-map dot
// fills in sync. A ripple, "30h saved per month". The tables drain, K.B leaves, the messages drop again: the opening.
import React from "react";
import { Img, staticFile } from "remotion";
import { Frame, useT, seg, pop, popOut, clamp01, lerp, INOUT, SOFT, OUT } from "../loop";
import { C, KBTile, ToolTile, SHADOW } from "../kb";

// ---------- brand (restaurantevinomio.es) ----------
const VM = { blue: "#005898", hi: "#4C9BD6", coral: "#E86858", pale: "#FCE1DE", gyg: "#FF5533", chat: "#25D366" };

// ---------- layout ----------
type P = { x: number; y: number };
const CARD = { x: 580, y: 120, w: 1140, h: 640 }, HEAD = 92;
const FLOOR = { x: 612, y: 232, w: 1076, h: 498 };
const TR = 62;
const TABLES: P[] = [{ x: 800, y: 372 }, { x: 1050, y: 372 }, { x: 1300, y: 372 }, { x: 800, y: 606 }, { x: 1050, y: 606 }, { x: 1300, y: 606 }];
const STAGE = { x: CARD.x + CARD.w - 32, y: 489, r: 132 };
const GYG = { x: 300, y: 196, s: 112 };
const MAP = { x: 432, y: 196 };
const KB = { x: 580, y: 440, s: 124 };
const PX = 304, SLOTY = [724, 666, 608, 550, 492, 434], BW = 204, BH = 60, TH = 54;
const CAPX = 950;

// ---------- timing ----------
// problem time: the problem runs across the loop seam (t 8 → 10 is pt -2 → 0)
const ptOf = (t: number) => (t >= 8 ? t - 10 : t);
type Kind = "mail" | "chat";
const BUB: { at: number; slot: number; kind: Kind; rot: number; dx: number }[] = [
  { at: -1.5, slot: 0, kind: "mail", rot: -4, dx: -8 },
  { at: -1.0, slot: 1, kind: "chat", rot: 5, dx: 10 },
  { at: -0.5, slot: 2, kind: "mail", rot: -3, dx: -4 },
  { at: 0.0, slot: 3, kind: "chat", rot: 6, dx: 12 }, // the one the cursor drags to table 0
  { at: 0.7, slot: 3, kind: "mail", rot: -6, dx: -10 },
  { at: 1.25, slot: 4, kind: "chat", rot: 4, dx: 6 },
  { at: 1.8, slot: 5, kind: "mail", rot: -5, dx: -6 },
];
const PICK = 3;
const CUR = { in: -1.0, to: 0.3, grab: 0.62, carry: 0.72, drop: 1.45, back: 1.62, tap: 2.12, out: 2.4 };
const KBT = { in: 2.45, out: 9.0 };
const FLIP = (slot: number) => 2.8 + 0.07 * (5 - slot);
const POUR = [0, 1, 2, 3, 4, 5].map((i) => 3.45 + 0.46 * i); // ticket i (from slot 5 - i) pours into table ORDER[i]
const ORDER = [0, 1, 3, 2, 4, 5];
const DRAIN = (i: number) => 8.45 + 0.1 * (5 - i);
const MAPT = { in: 3.0, check: 7.0, checkOut: 8.55, out: 9.05 };
const TXT = { probIn: -0.75, probOut: 2.6, solIn: 3.15, solOut: 6.2, resIn: 6.45, resOut: 8.45 };

// ---------- helpers ----------
const qb = (a: P, c: P, b: P, u: number): P => ({ x: (1 - u) ** 2 * a.x + 2 * (1 - u) * u * c.x + u * u * b.x, y: (1 - u) ** 2 * a.y + 2 * (1 - u) * u * c.y + u * u * b.y });
const qd = (a: P, c: P, b: P, u: number): P => ({ x: 2 * (1 - u) * (c.x - a.x) + 2 * u * (b.x - c.x), y: 2 * (1 - u) * (c.y - a.y) + 2 * u * (b.y - c.y) });
const bump = (t: number, at: number, dur: number) => Math.sin(Math.PI * clamp01((t - at) / dur));
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp01(k)))).join(",")})`; };
const f1 = (v: number) => v.toFixed(1);

// the pour's arc from the K.B tile into a table
const pourArc = (j: number) => {
  const a = { x: KB.x + 48, y: KB.y - 22 }, b = TABLES[j];
  return { a, b, c: { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 170 - 0.12 * Math.abs(b.x - a.x) } };
};
// a tapered ribbon along a quadratic from u0 (thin tail) to u1 (thick head); off shifts it along the normal (highlight)
const ribbon = (a: P, c: P, b: P, u0: number, u1: number, r0: number, r1: number, off = 0, sc = 1) => {
  const n = 32, L: string[] = [], R: string[] = [];
  for (let k = 0; k <= n; k++) {
    const s = k / n, u = lerp(u0, u1, s), p = qb(a, c, b, u), d = qd(a, c, b, u), len = Math.hypot(d.x, d.y) || 1;
    const nx = -d.y / len, ny = d.x / len, r = lerp(r0, r1, Math.pow(s, 0.8));
    const cx = p.x + nx * off * r, cy = p.y + ny * off * r;
    L.push(`${f1(cx + nx * r * sc)} ${f1(cy + ny * r * sc)}`); R.push(`${f1(cx - nx * r * sc)} ${f1(cy - ny * r * sc)}`);
  }
  return `M${L.join(" L")} L${R.reverse().join(" L")} Z`;
};

// ---------- table state ----------
// fill level (0 → 1, up after the pour, down in the drain), slosh amplitude, ring and chair state
const tableState = (t: number, j: number) => {
  const i = ORDER.indexOf(j), P0 = POUR[i], D = DRAIN(i);
  const up = seg(t, P0 + 0.42, P0 + 1.0, OUT), down = seg(t, D + 0.05, D + 0.6, INOUT);
  const level = t < D ? up : 1 - down;
  const slosh = t < D ? 9 * Math.exp(-Math.max(0, t - (P0 + 0.45)) * 2.6) * (up > 0 ? 1 : 0) : 7 * bump(t, D, 0.75);
  const ring = Math.max(0, pop(t, P0 + 0.84, { dur: 0.5, over: 0.08 }) * popOut(t, D, { dur: 0.32 }));
  const chair = clamp01(seg(t, P0 + 0.8, P0 + 1.1) - seg(t, D + 0.2, D + 0.6));
  const ripple = bump(t, 6.55 + 0.07 * j, 0.5);
  return { i, P0, D, level, slosh, ring, chair, ripple };
};

const Chairs: React.FC<{ k: number }> = ({ k }) => (
  <>
    {[45, 135, 225, 315].map((a) => (
      <g key={a} transform={`rotate(${a}) translate(${TR + 21} 0) rotate(90)`}>
        <rect x={-17} y={-10} width={34} height={20} rx={9} fill={mix("#DCE3EC", C.kb, k)} />
      </g>
    ))}
  </>
);

const Table: React.FC<{ t: number; j: number }> = ({ t, j }) => {
  const { x, y } = TABLES[j], s = tableState(t, j), id = `vmt${j}`;
  const sc = 1 + 0.05 * s.ripple;
  // the liquid: a wavy surface clipped to the table top
  const surf = TR - (2 * TR + 16) * s.level, ph = t * 9 + j;
  let d = "";
  if (s.level > 0.001) {
    const pts: string[] = [];
    for (let k = 0; k <= 16; k++) {
      const xx = -TR - 4 + ((2 * TR + 8) * k) / 16;
      pts.push(`${f1(xx)} ${f1(surf + s.slosh * Math.sin(xx / 17 + ph) + 0.5 * s.slosh * Math.sin(xx / 9 - ph * 1.3))}`);
    }
    d = `M${pts.join(" L")} L${TR + 4} ${TR + 4} L${-TR - 4} ${TR + 4} Z`;
  }
  const glint = seg(t, 7.35 + 0.07 * j, 7.95 + 0.07 * j, INOUT);
  return (
    <g transform={`translate(${x} ${y}) scale(${sc.toFixed(4)})`}>
      <Chairs k={s.chair} />
      <circle r={TR} fill={C.white} stroke="#DCE3EC" strokeWidth={3} filter="url(#vmsh)" />
      <clipPath id={id}><circle r={TR - 1.5} /></clipPath>
      {d && (
        <g clipPath={`url(#${id})`}>
          <path d={d} fill={VM.blue} />
          {glint > 0 && glint < 1 && <rect x={lerp(-TR - 60, TR + 20, glint)} y={-TR - 20} width={34} height={2 * TR + 40} fill="#FFFFFF" opacity={0.22} transform="rotate(20)" />}
        </g>
      )}
      {s.ring > 0.001 && <circle r={TR + 3} fill="none" stroke={VM.coral} strokeWidth={10 * clamp01(s.ring)} opacity={clamp01(s.ring * 1.5)} transform={`scale(${(0.86 + 0.14 * s.ring).toFixed(4)})`} />}
    </g>
  );
};

// the K.B ripple ring over each table once the room is full
const Ripple: React.FC<{ t: number; j: number }> = ({ t, j }) => {
  const k = seg(t, 6.55 + 0.07 * j, 7.25 + 0.07 * j, OUT);
  if (k <= 0 || k >= 1) return null;
  return <circle cx={TABLES[j].x} cy={TABLES[j].y} r={TR + 10 + 40 * k} fill="none" stroke={C.cyan} strokeWidth={6 * (1 - k)} opacity={1 - k} />;
};

// the pour: ribbon + splash for table ORDER[i]
const Pour: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const j = ORDER[i], P0 = POUR[i], { a, b, c } = pourArc(j);
  const head = seg(t, P0, P0 + 0.55, INOUT), tail = seg(t, P0 + 0.2, P0 + 0.8, INOUT), ghost = seg(t, P0 + 0.08, P0 + 0.95, INOUT);
  const out: React.ReactNode[] = [];
  if (head > 0 && head - tail > 0.004) {
    const w = seg(t, P0, P0 + 0.14, OUT), rh = 21 * w * (1 - 0.55 * seg(t, P0 + 0.52, P0 + 0.8));
    const hp = qb(a, c, b, head);
    if (head - ghost > 0.004) out.push(<path key="gh" d={ribbon(a, c, b, ghost, head, 1, rh * 0.8)} fill={VM.blue} opacity={0.16} />);
    out.push(<path key="r" d={ribbon(a, c, b, tail, head, 3 * w, rh)} fill={VM.blue} />);
    out.push(<circle key="h" cx={hp.x} cy={hp.y} r={rh} fill={VM.blue} />);
    out.push(<path key="g" d={ribbon(a, c, b, tail, head, 1.2 * w, rh, -0.42, 0.3)} fill={VM.hi} opacity={0.75} />);
  }
  // splash: four droplets jump out of the table as the head lands
  const tau = t - (P0 + 0.53);
  if (tau > 0 && tau < 0.5) {
    [[-260, -300], [-120, -380], [140, -360], [270, -290]].forEach(([vx, vy], k) => {
      const px = b.x + vx * tau * 0.9, py = b.y - TR * 0.4 + vy * tau + 0.5 * 1500 * tau * tau;
      out.push(<circle key={`d${k}`} cx={px} cy={py} r={Math.max(0, 10 * (1 - tau / 0.5))} fill={VM.blue} />);
    });
  }
  return <>{out}</>;
};

// ---------- messages and tickets ----------
const Mail: React.FC = () => (
  <g>
    <rect x={-BW / 2} y={-BH / 2} width={BW} height={BH} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
    <g transform="translate(-68 0) scale(1.15)">
      <rect x={-17} y={-12} width={34} height={24} rx={5} fill="none" stroke={C.navy} strokeWidth={3.2} />
      <path d="M-15 -9 L0 3 L15 -9" fill="none" stroke={C.navy} strokeWidth={3.2} strokeLinejoin="round" />
    </g>
    <rect x={-36} y={-13} width={104} height={10} rx={5} fill="#CBD4DF" />
    <rect x={-36} y={5} width={70} height={9} rx={4.5} fill="#E3E8EF" />
  </g>
);
const Chat: React.FC = () => (
  <g>
    <path d={`M${-BW / 2 + 14} ${-BH / 2} H${BW / 2 - 14} Q${BW / 2} ${-BH / 2} ${BW / 2} ${-BH / 2 + 14} V${BH / 2 - 14} Q${BW / 2} ${BH / 2} ${BW / 2 - 14} ${BH / 2} H${-BW / 2 + 30} L${-BW / 2 + 8} ${BH / 2 + 12} L${-BW / 2 + 12} ${BH / 2 - 2} Q${-BW / 2} ${BH / 2 - 6} ${-BW / 2} ${BH / 2 - 16} V${-BH / 2 + 14} Q${-BW / 2} ${-BH / 2} ${-BW / 2 + 14} ${-BH / 2} Z`}
      fill={C.white} stroke={C.line} strokeWidth={2} />
    <g transform="translate(-68 0) scale(1.15)">
      <circle r={16} fill={VM.chat} />
      <path d="M-7 -5 H7 Q9 -5 9 -3 V3 Q9 5 7 5 H-1 L-6 9 L-5 5 H-7 Q-9 5 -9 3 V-3 Q-9 -5 -7 -5 Z" fill="#FFFFFF" />
    </g>
    <rect x={-36} y={-13} width={88} height={10} rx={5} fill="#CBD4DF" />
    <rect x={-36} y={5} width={110} height={9} rx={4.5} fill="#E3E8EF" />
  </g>
);
const Ticket: React.FC = () => (
  <g>
    <rect x={-BW / 2} y={-TH / 2} width={BW} height={TH} rx={11} fill={C.white} stroke={C.line} strokeWidth={2} />
    <path d={`M${-BW / 2 + 11} ${-TH / 2} H${-BW / 2 + 22} V${TH / 2} H${-BW / 2 + 11} Q${-BW / 2} ${TH / 2} ${-BW / 2} ${TH / 2 - 11} V${-TH / 2 + 11} Q${-BW / 2} ${-TH / 2} ${-BW / 2 + 11} ${-TH / 2} Z`} fill={VM.gyg} />
    <g transform="translate(-56 0) scale(1.15)" fill={VM.gyg}>
      <circle cy={-6} r={6} />
      <path d="M-10 13 Q-10 1 0 1 Q10 1 10 13 Z" />
    </g>
    <rect x={-32} y={-12} width={70} height={10} rx={5} fill={C.navy} />
    <rect x={-32} y={5} width={48} height={9} rx={4.5} fill="#D3DAE3" />
    <line x1={58} y1={-TH / 2 + 8} x2={58} y2={TH / 2 - 8} stroke="#D3DAE3" strokeWidth={2.5} strokeDasharray="4 5" />
    <circle cx={80} r={8} fill={VM.gyg} opacity={0.9} />
  </g>
);

// the cursor (problem time)
const cursorPos = (pt: number): P => {
  const idle = { x: 446 + 8 * Math.sin(pt * 3.4), y: 652 + 6 * Math.cos(pt * 2.7) };
  const grab = { x: PX + 12 + 52, y: SLOTY[3] + 6 };
  const t0 = { x: TABLES[0].x + 18, y: TABLES[0].y + 14 }, g = { x: GYG.x + 22, y: GYG.y + 26 }, away = { x: 372, y: 330 };
  const k1 = seg(pt, CUR.to, CUR.grab, INOUT), k2 = seg(pt, CUR.carry, CUR.drop, INOUT), k3 = seg(pt, CUR.back, CUR.tap, INOUT), k4 = seg(pt, CUR.tap + 0.18, CUR.out + 0.4, SOFT);
  let p = { x: lerp(idle.x, grab.x, k1), y: lerp(idle.y, grab.y, k1) };
  p = { x: lerp(p.x, t0.x, k2), y: lerp(p.y, t0.y, k2) - 70 * Math.sin(Math.PI * k2) };
  p = { x: lerp(p.x, g.x, k3), y: lerp(p.y, g.y, k3) - 40 * Math.sin(Math.PI * k3) };
  return { x: lerp(p.x, away.x, k4), y: lerp(p.y, away.y, k4) };
};

const Cursor: React.FC<{ pt: number }> = ({ pt }) => {
  const v = pop(pt, CUR.in, { dur: 0.5, over: 0.06 }) * popOut(pt, CUR.out, { dur: 0.4 });
  if (v <= 0.001 || pt > CUR.out + 0.5) return null;
  const p = cursorPos(pt), press = 1 - 0.12 * bump(pt, CUR.grab, 0.16) - 0.14 * bump(pt, CUR.tap, 0.18);
  const prog = 0.92 * seg(pt, CUR.in + 0.2, CUR.out, (x) => x);
  const rr = 15, circ = 2 * Math.PI * rr;
  return (
    <g transform={`translate(${f1(p.x)} ${f1(p.y)}) scale(${(clamp01(v) * press).toFixed(4)})`} opacity={clamp01(v * 1.3)}>
      <g transform="translate(44 50)" filter="url(#vmsh)">
        <circle r={25} fill={C.white} />
        <circle r={rr} fill="none" stroke="#EEF1F5" strokeWidth={6} />
        <circle r={rr} fill="none" stroke={C.warn} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${f1(circ * prog)} ${f1(circ)}`} transform="rotate(-90)" />
      </g>
      <path d="M0 0 L0 38 L10 29 L17 43 L24 40 L17 26 L30 26 Z" fill={C.navy} stroke={C.white} strokeWidth={3} strokeLinejoin="round" filter="url(#vmsh)" />
    </g>
  );
};

// a message in the pile (problem time), flipping into a ticket when K.B arrives (loop time)
const PileItem: React.FC<{ t: number; pt: number; k: number }> = ({ t, pt, k }) => {
  const b = BUB[k];
  if (k === PICK) return null; // drawn by Carried
  const slotY = SLOTY[b.slot];
  const fall = pop(pt, b.at, { dur: 0.5, over: 0.07 });
  const flip = seg(t, FLIP(b.slot), FLIP(b.slot) + 0.34, INOUT);
  const ti = 5 - b.slot, P0 = POUR[ti];
  const go = seg(t, P0 - 0.4, P0, INOUT);
  // the message (problem time; it exists from its drop until it has flipped)
  const inProblem = pt >= b.at && !(t >= 2.8 && t < 8 && flip >= 0.5);
  const isTicket = t >= 2.8 && t < 8 && flip >= 0.5 && go < 1;
  if (!inProblem && !isTicket) return null;
  if (inProblem) {
    // each message landing on top jostles the pile below it (a damped wobble)
    const jostle = BUB.reduce((a, m, mk) => {
      if (mk <= k) return a;
      const tau = pt - (m.at + 0.3);
      return tau > 0 ? a + Math.exp(-tau * 5.5) * Math.sin(tau * 17) : a;
    }, 0) * (k % 2 ? 1 : -1) * (1 - flip);
    const x = lerp(GYG.x, PX + b.dx * (1 - flip), clamp01(fall)) + 5 * jostle, y = lerp(GYG.y + 10, slotY, fall);
    const sc = lerp(0.3, 1, clamp01(fall * 1.6)) * Math.abs(Math.cos(Math.PI * flip));
    const rot = b.rot * clamp01(fall) * (1 - flip) + 3 * jostle;
    return (
      <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${rot.toFixed(2)}) scale(${sc.toFixed(4)} ${lerp(0.3, 1, clamp01(fall * 1.6)).toFixed(4)})`} opacity={clamp01(fall * 3)} filter="url(#vmsh)">
        {b.kind === "mail" ? <Mail /> : <Chat />}
      </g>
    );
  }
  // the ticket: settles in its slot, then slides into the K.B tile
  const sx = Math.abs(Math.cos(Math.PI * flip));
  // the queue moves up a slot each time the ticket above it leaves
  const up = POUR.slice(0, ti).reduce((a, Pj) => a + pop(t, Pj - 0.22, { dur: 0.42, over: 0.08 }), 0);
  const baseY = slotY - (SLOTY[0] - SLOTY[1]) * up;
  const x = lerp(PX, KB.x, go), y = lerp(baseY, KB.y, go) - 50 * Math.sin(Math.PI * go);
  const sc = lerp(1, 0.32, go);
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${(-8 * Math.sin(Math.PI * go)).toFixed(2)}) scale(${(sc * sx).toFixed(4)} ${sc.toFixed(4)})`} opacity={1 - seg(go, 0.7, 1)} filter="url(#vmsh)">
      <Ticket />
    </g>
  );
};

// the message the cursor drags to table 0, which then waits there as a pending badge
const Carried: React.FC<{ t: number; pt: number; top: boolean }> = ({ t, pt, top }) => {
  const b = BUB[PICK];
  if (pt < b.at || (pt >= CUR.grab) !== top) return null;
  const fall = pop(pt, b.at, { dur: 0.5, over: 0.07 });
  const badgeOut = popOut(t < 8 ? t : -1, POUR[0] + 0.42, { dur: 0.3 });
  if (pt > 3 && badgeOut <= 0.001) return null;
  let x = lerp(GYG.x, PX + b.dx, clamp01(fall)), y = lerp(GYG.y + 10, SLOTY[b.slot], fall), sc = lerp(0.3, 1, clamp01(fall * 1.6)), rot = b.rot * clamp01(fall);
  if (pt >= CUR.grab) {
    const c = cursorPos(pt), lift = seg(pt, CUR.grab, CUR.carry + 0.1, OUT);
    const held = { x: c.x - 52, y: c.y - 6 };
    const drop = seg(pt, CUR.drop, CUR.back + 0.1, INOUT);
    const badge = { x: TABLES[0].x + 46, y: TABLES[0].y - 46 };
    x = lerp(lerp(x, held.x, lift), badge.x, drop); y = lerp(lerp(y, held.y, lift), badge.y, drop);
    sc = lerp(1 + 0.06 * lift, 0.34, drop); rot = lerp(b.rot * (1 - lift), 0, drop);
    sc *= badgeOut;
  }
  if (sc <= 0.001) return null;
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${rot.toFixed(2)}) scale(${sc.toFixed(4)})`} filter="url(#vmsh)">
      <Chat />
    </g>
  );
};

// the dashed "pending" ring on table 0 while the manual booking waits
const Pending: React.FC<{ t: number; pt: number }> = ({ t, pt }) => {
  const v = pop(pt, CUR.drop + 0.08, { dur: 0.45, over: 0.07 }) * popOut(t < 8 ? t : -1, POUR[0] + 0.42, { dur: 0.3 });
  if (v <= 0.001 || pt > 4.2) return null;
  return (
    <circle cx={TABLES[0].x} cy={TABLES[0].y} r={(TR + 12) * (0.9 + 0.1 * v)} fill="none" stroke={C.warn} strokeWidth={4} strokeDasharray="12 10"
      opacity={clamp01(v) * 0.85} transform={`rotate(${(pt * 40).toFixed(2)} ${TABLES[0].x} ${TABLES[0].y})`} />
  );
};

// ---------- the live availability mini-map (GetYourGuide side) ----------
const MiniMap: React.FC<{ t: number }> = ({ t }) => {
  const v = t < 8 ? pop(t, MAPT.in, { dur: 0.5, over: 0.07 }) : popOut(t, MAPT.out, { dur: 0.4 });
  if (v <= 0.001) return null;
  const chk = pop(t, MAPT.check, { dur: 0.45, over: 0.08 }) * popOut(t, MAPT.checkOut, { dur: 0.3 });
  return (
    <g transform={`translate(${MAP.x} ${MAP.y}) scale(${v.toFixed(4)})`} opacity={clamp01(v * 1.5)}>
      <rect x={-54} y={-44} width={108} height={88} rx={16} fill={C.white} filter="url(#vmsh)" />
      <rect x={-34} y={-31} width={36} height={7} rx={3.5} fill={VM.gyg} />
      <rect x={8} y={-31} width={22} height={7} rx={3.5} fill="#E3E8EF" />
      {TABLES.map((_, j) => {
        const s = tableState(t, j), cx = -30 + 30 * (j % 3), cy = -2 + 28 * Math.floor(j / 3);
        const fill = clamp01(pop(t, s.P0 + 0.88, { dur: 0.4, over: 0.1 }) * popOut(t, s.D + 0.2, { dur: 0.3 }));
        const ping = seg(t, s.P0 + 0.88, s.P0 + 1.45, OUT);
        return (
          <g key={j} transform={`translate(${cx} ${cy})`}>
            <circle r={10} fill="none" stroke="#DCE3EC" strokeWidth={3} />
            {fill > 0.001 && <circle r={10 * fill} fill={VM.blue} stroke={VM.coral} strokeWidth={2.5 * fill} />}
            {ping > 0 && ping < 1 && <circle r={10 + 14 * ping} fill="none" stroke={C.cyan} strokeWidth={4 * (1 - ping)} opacity={1 - ping} />}
          </g>
        );
      })}
      {chk > 0.001 && (
        <g transform={`translate(50 -40) scale(${chk.toFixed(4)})`}>
          <circle r={15} fill={C.cyan} />
          <path d="M-6 0 L-2 5 L7 -5" fill="none" stroke={C.white} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};

// the flamenco stage once the room is full: three coral notes rise from the guitar and fade
const Notes: React.FC<{ t: number }> = ({ t }) => (
  <>
    {[6.7, 7.15, 7.6, 8.05].map((at, k) => {
      const u = seg(t, at, at + 1.1, SOFT);
      if (u <= 0 || u >= 1) return null;
      const x = STAGE.x - 70 - 40 * u + 14 * Math.sin(u * 5 + k), y = STAGE.y - 70 - 120 * u, o = Math.sin(Math.PI * u);
      return (
        <g key={k} transform={`translate(${f1(x)} ${f1(y)}) scale(${(0.7 + 0.4 * o).toFixed(3)}) rotate(${(-12 + 24 * (k % 2)).toFixed(1)})`} opacity={o} fill={VM.coral}>
          <ellipse cx={0} cy={0} rx={9} ry={7} transform="rotate(-20)" />
          <rect x={6} y={-30} width={4} height={30} rx={2} />
          <path d="M8 -30 Q22 -24 18 -10 Q16 -20 8 -22 Z" />
        </g>
      );
    })}
  </>
);

// ---------- text ----------
const Line: React.FC<{ v: number; y: number; size: number; children: React.ReactNode }> = ({ v, y, size, children }) => {
  if (v <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: CAPX - 800, width: 1600, top: y, textAlign: "center", fontSize: size, fontWeight: 800, color: C.navy, lineHeight: 1,
      letterSpacing: "-0.02em", whiteSpace: "nowrap", opacity: clamp01(v * 1.4), transform: `translateY(${(Math.abs(1 - v) < 0.02 ? 0 : (1 - v) * 36).toFixed(2)}px)` }}>{children}</div>
  );
};

export const Loop: React.FC = () => {
  const t = useT(), pt = ptOf(t);
  const driftX = 6 * Math.sin((2 * Math.PI * t) / 10), driftY = 6 * Math.sin((2 * Math.PI * t) / 5);
  const zoom = 1 + 0.03 * Math.sin(Math.PI * clamp01((t - 6.2) / 2.7)) ** 2;
  // K.B tile: drops onto the card's edge, gulps each ticket, lifts away at the end
  const kbIn = t < 8 ? pop(t, KBT.in, { dur: 0.6, over: 0.06 }) : popOut(t, KBT.out, { dur: 0.45 });
  const kbY = KB.y - (t < 8 ? 150 * (1 - clamp01(kbIn)) : 40 * seg(t, KBT.out, KBT.out + 0.45));
  const gulp = POUR.reduce((a, P0) => a + 0.08 * bump(t, P0 - 0.06, 0.26), 0);
  const kbDot = 1 + POUR.reduce((a, P0) => a + 0.6 * bump(t, P0 + 0.02, 0.3), 0) + 0.5 * bump(t, 6.5, 0.4);
  // GetYourGuide tile: twitches as each message drops out of it and when the cursor taps it
  const gygB = 1 + BUB.reduce((a, b) => a + 0.05 * bump(pt, b.at - 0.04, 0.22), 0) + 0.08 * bump(pt, CUR.tap + 0.02, 0.24);
  const zenB = 1 + POUR.reduce((a, P0) => a + 0.08 * bump(t, P0 + 0.86, 0.3), 0);
  const live = seg(t, 6.5, 7.0) * (1 - seg(t, 8.5, 9.1)); // the room is full: the stage comes alive
  const guitar = 3 * (1 - live) * Math.sin((2 * Math.PI * t) / 2.5) + 8 * live * Math.sin((2 * Math.PI * t) / 1.25);
  const prob = pop(pt, TXT.probIn, { dur: 0.55, over: 0.04 }) * popOut(pt, TXT.probOut, { dur: 0.4 });
  const sol = pop(t, TXT.solIn, { dur: 0.55, over: 0.04 }) * popOut(t, TXT.solOut, { dur: 0.4 });
  const res = pop(t, TXT.resIn, { dur: 0.55, over: 0.04 }) * popOut(t, TXT.resOut, { dur: 0.4 });
  const res2 = pop(t, TXT.resIn + 0.15, { dur: 0.55, over: 0.04 }) * popOut(t, TXT.resOut - 0.05, { dur: 0.4 });
  const count = Math.round(30 * seg(t, TXT.resIn, TXT.resIn + 0.7, (x) => 1 - Math.pow(1 - x, 3)));
  return (
    <Frame>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px) scale(${zoom.toFixed(5)})`, transformOrigin: "1000px 440px" }}>
        {/* the Zenchef floor-plan card */}
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 24, background: C.white, boxShadow: SHADOW.card }}>
          <Img src={staticFile("cases/vino-mio/vinomio-logo.png")} style={{ position: "absolute", left: 30, top: 15, width: 62, height: 62 }} />
          <div style={{ position: "absolute", left: 112, top: 34, width: 150, height: 12, borderRadius: 6, background: "#E3E8EF" }} />
          <div style={{ position: "absolute", left: 112, top: 54, width: 92, height: 10, borderRadius: 5, background: "#EEF1F5" }} />
          <div style={{ position: "absolute", left: CARD.w - 30 - 60, top: 16, transform: `scale(${zenB.toFixed(4)})` }}><ToolTile tool="zenchef" size={60} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: HEAD, height: 1.5, background: C.line }} />
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <filter id="vmsh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx={0} dy={7} stdDeviation={8} floodColor={C.navy} floodOpacity={0.2} /></filter>
            <clipPath id="vmfloor"><rect x={FLOOR.x} y={FLOOR.y} width={FLOOR.w} height={FLOOR.h} rx={16} /></clipPath>
          </defs>
          <rect x={FLOOR.x} y={FLOOR.y} width={FLOOR.w} height={FLOOR.h} rx={16} fill="#F3F5F8" />
          {/* the flamenco stage on the right wall */}
          <g clipPath="url(#vmfloor)">
            <circle cx={STAGE.x} cy={STAGE.y} r={STAGE.r} fill={VM.pale} />
            <circle cx={STAGE.x} cy={STAGE.y} r={STAGE.r - 26} fill="none" stroke={VM.coral} strokeOpacity={0.35} strokeWidth={3} strokeDasharray="3 9" strokeLinecap="round" />
            <g transform={`translate(${STAGE.x - 62} ${STAGE.y}) rotate(${(-28 + guitar).toFixed(2)})`} fill={VM.coral}>
              <circle cy={12} r={19} /><circle cy={-10} r={14} /><circle cy={6} r={6} fill={VM.pale} />
              <rect x={-3.5} y={-58} width={7} height={46} rx={3} /><rect x={-6} y={-66} width={12} height={12} rx={3} />
            </g>
          </g>
          <Notes t={t} />
          {TABLES.map((_, j) => <Table key={j} t={t} j={j} />)}
          <Pending t={t} pt={pt} />
          {TABLES.map((_, j) => <Ripple key={j} t={t} j={j} />)}
          {POUR.map((_, i) => <Pour key={i} t={t} i={i} />)}
          <MiniMap t={t} />
          {BUB.map((_, k) => <PileItem key={k} t={t} pt={pt} k={k} />)}
          <Carried t={t} pt={pt} top={false} />
        </svg>
        {/* GetYourGuide tile */}
        <div style={{ position: "absolute", left: GYG.x - GYG.s / 2, top: GYG.y - GYG.s / 2, transform: `scale(${gygB.toFixed(4)})` }}><ToolTile tool="gyg" size={GYG.s} /></div>
        {/* K.B keeps both platforms in sync: a soft heartbeat while the room is full */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {[7.05, 7.6, 8.15].map((at) => {
            const u = seg(t, at, at + 0.9, OUT);
            return u > 0 && u < 1 ? <circle key={at} cx={KB.x} cy={KB.y} r={70 + 90 * u} fill="none" stroke={C.cyan} strokeWidth={7 * (1 - u)} opacity={0.9 * (1 - u)} /> : null;
          })}
        </svg>
        {/* the K.B tile */}
        {kbIn > 0.001 && (
          <div style={{ position: "absolute", left: KB.x - KB.s / 2, top: kbY - KB.s / 2, width: KB.s, height: KB.s, opacity: clamp01(kbIn * 2),
            transform: `scale(${(kbIn * (1 + gulp)).toFixed(4)})` }}>
            <KBTile size={KB.s} dot={kbDot} />
          </div>
        )}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <Carried t={t} pt={pt} top />
          <Cursor pt={pt} />
        </svg>
      </div>
      {/* ---------- caption strip ---------- */}
      <Line v={prob} y={836} size={76}>Every booking by hand</Line>
      <Line v={sol} y={836} size={76}>Bookings flow straight in</Line>
      {res > 0.001 && (
        <div style={{ position: "absolute", left: CAPX - 800, width: 1600, top: 796, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 44, whiteSpace: "nowrap", lineHeight: 1, letterSpacing: "-0.02em" }}>
          <span style={{ display: "inline-block", width: 310, textAlign: "right", fontSize: 164, fontWeight: 800, color: C.navy, fontVariantNumeric: "tabular-nums",
            opacity: clamp01(res * 1.4), transform: `translateY(${(Math.abs(1 - res) < 0.02 ? 0 : (1 - res) * 40).toFixed(2)}px)` }}>{count}h</span>
          <span style={{ display: "inline-block", fontSize: 52, fontWeight: 700, color: C.muted, opacity: clamp01(res2 * 1.4),
            transform: `translateY(${(Math.abs(1 - res2) < 0.02 ? 0 : (1 - res2) * 30).toFixed(2)}px)` }}>saved per month</span>
        </div>
      )}
    </Frame>
  );
};
