// Scene G — the fact check (h2 → sH): "Every number and quote is checked against your site."
// Starts on Handoff2 (the storyboard card, left). Fjello's site surfaces on the right, scrolled to the stats and the
// quote. "Every number": the "120 trails tested" row and the site's 120 light up, a violet connector joins them, a
// check lands on the row. "and quote": the same for the quote. "checked against your site": the real step row lands
// between the columns ("Every number and quote is on the site") and the site is outlined. Out: the site recedes and
// the card's thumbnails lift off it as the test frames H lays on its light table.
import React from "react";
import { Check, FjFrame, FjSite, Handoff2, SITE_BAR, SITE_SPOTS, SITE_W, f, k, surface } from "../shared";
import { C, CRAFT, FONT, LEAVE, SHADOW_BIG, SNAP, clamp01, mix } from "../lib";

/* ---------- the card's geometry (Handoff2: StoryboardCard w 700, size 22, left 150, vertically centred) ---------- */
const SZ = 22;
export const ROW0 = 336.8;                         // top of row 0's thumbnail (measured on the hand-off frame)
export const ROWSTEP = SZ * 2.475 + SZ * 0.55;     // thumbnail height + row gap
export const THUMB = { x: 150 + 1 + SZ * 0.9, w: SZ * 4.4, h: SZ * 2.475, r: SZ * 0.3 };
// During G the card eases a little left and up in scale, so its rows read at 22 px or more.
const CARD_DX = -40, CARD_DY = -28, CARD_S = 1.12;
const cardT = (p: number) => ({ dx: CARD_DX * p, dy: CARD_DY * p, s: mix(1, CARD_S, p) });
const cardPt = (x: number, y: number, p = 1) => { const t = cardT(p); return { x: 150 + t.dx + (x - 150) * t.s, y: 540 + t.dy + (y - 540) * t.s }; };
// The thumbnails lifted off the card at the end of G (frame coordinates): where H picks them up.
export const LIFT = 1.22, SPREAD = 18;
export const gThumb = (i: number, lift = 1, p = 1) => {
  const c = cardPt(THUMB.x + THUMB.w / 2, ROW0 + i * ROWSTEP + THUMB.h / 2, p), s = cardT(p).s * mix(1, LIFT, lift);
  return { cx: c.x + 24 * lift, cy: c.y + (i - 3) * SPREAD * lift, w: THUMB.w * s, h: THUMB.h * s, r: THUMB.r * s };
};

/* ---------- the site (right) ---------- */
const SX = 1020, SY = 214, SW = 800, SH = 590, SS = SW / SITE_W;
// it scrolls in to the stats, on toward the quote on "and quote", and drifts on while the step lands
const scrollAt = (g: number) => 430 + 130 * k(g, "h2", 0.8, CRAFT) + 36 * k(g, "w:and", 0.6, CRAFT) + 22 * k(g, "w:checked", 1.3, CRAFT);
// the site's "120" with its caption (SITE_SPOTS.stat120 is wider than the number), and the quote
const SPOTS = { stat120: { ...SITE_SPOTS.stat120, x: 88, w: 140 }, quote: SITE_SPOTS.quote };
const spotRect = (name: keyof typeof SPOTS, scroll: number, pad = 14) => {
  const s = SPOTS[name];
  return { x: SX + (s.x - pad) * SS, y: SY + (SITE_BAR + s.y - scroll - pad * 0.6) * SS, w: (s.w + pad * 2) * SS, h: (s.h + pad * 1.2) * SS };
};

const Outline: React.FC<{ x: number; y: number; w: number; h: number; p: number; r?: number }> = ({ x, y, w, h, p, r = 12 }) => {
  if (p <= 0) return null;
  const q = SNAP(clamp01(p));
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, border: `2.5px solid ${C.violet}`, background: "rgba(136,83,223,0.07)",
    boxSizing: "border-box", opacity: clamp01(q * 1.6), transform: `scale(${mix(1.04, 1, q)})` }} />;
};

export const SceneG: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h2") || g >= f("sH")) return null;
  const cp = k(g, "h2", 1.0, CRAFT), ct = cardT(cp);
  const out = k(g, "sH-0.45", 0.4, CRAFT), lift = k(g, "sH-0.45", 0.4, LEAVE);
  const site = k(g, "h2", 0.7) * (1 - out);
  const scroll = scrollAt(g);
  const live = 1 - out;

  // the two checks: the stat row (row 2) with the site's 120, the quote row (row 3) with the site's quote
  const pairs = [
    { row: 2, spot: "stat120" as const, hiRow: k(g, "w:every-0.05", 0.3, SNAP), hiSite: k(g, "w:number-0.05", 0.3, SNAP), line: k(g, "w:number", 0.4, CRAFT), ok: k(g, "w:number+0.3", 0.27, SNAP) },
    { row: 3, spot: "quote" as const, hiRow: k(g, "w:and-0.05", 0.3, SNAP), hiSite: k(g, "w:quote-0.05", 0.3, SNAP), line: k(g, "w:quote", 0.35, CRAFT), ok: k(g, "w:quote+0.27", 0.27, SNAP) },
  ];
  const stepIn = k(g, "w:checked-0.05", 0.5), stepOk = k(g, "w:against", 0.27, SNAP);
  const ring = k(g, "w:your4-0.05", 0.3, SNAP);
  // a spotlight on the site: the rest of the page fades back while one fact is checked, moves to the quote, lifts
  const veil = k(g, "w:number-0.1", 0.35, CRAFT) * (1 - k(g, "w:checked", 0.4, CRAFT)), mv = k(g, "w:quote-0.1", 0.4, CRAFT);
  const ra = spotRect("stat120", scroll), rb = spotRect("quote", scroll);
  const hole = { x: mix(ra.x, rb.x, mv) - SX, y: mix(ra.y, rb.y, mv) - SY - SITE_BAR * SS, w: mix(ra.w, rb.w, mv), h: mix(ra.h, rb.h, mv) };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the site, surfacing on the right, scrolled to the stats and the quote */}
      {site > 0 && (
        <div style={{ position: "absolute", left: SX, top: SY, width: SW, height: SH, transformOrigin: "50% 50%", ...surface(site) }}>
          <FjSite w={SW} h={SH} scroll={scroll} />
          {veil > 0 && <div style={{ position: "absolute", left: 0, top: SITE_BAR * SS, width: SW, height: SH - SITE_BAR * SS, overflow: "hidden", borderRadius: `0 0 ${16 * SS}px ${16 * SS}px` }}>
            <div style={{ position: "absolute", left: hole.x, top: hole.y, width: hole.w, height: hole.h, borderRadius: 10, boxShadow: `0 0 0 2000px rgba(246,243,250,${0.72 * veil})` }} />
          </div>}
          <div style={{ position: "absolute", inset: -5, borderRadius: 16, border: `2.5px solid ${C.violet}`, opacity: ring * live, transform: `scale(${mix(1.015, 1, SNAP(ring))})` }} />
        </div>
      )}
      {site > 0 && <div style={{ position: "absolute", inset: 0, opacity: live, clipPath: `inset(${SY + SITE_BAR * SS}px 0 0 0)` }}>
        {pairs.map((pr) => { const r = spotRect(pr.spot, scroll); return <Outline key={pr.spot} x={r.x} y={r.y} w={r.w} h={r.h} p={pr.hiSite} r={10} />; })}
      </div>}

      {/* the storyboard card (exactly Handoff2 at h2), with its row highlights and checks */}
      <div style={{ position: "absolute", inset: 0, transformOrigin: "150px 540px", transform: `translate(${ct.dx}px, ${ct.dy}px) scale(${ct.s})`,
        opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
        <Handoff2 />
        {pairs.map((pr) => {
          const top = ROW0 + pr.row * ROWSTEP;
          return (
            <React.Fragment key={pr.row}>
              <Outline x={162} y={top - 6} w={676} h={THUMB.h + 12} p={pr.hiRow} />
              {pr.ok > 0 && <Check size={30} p={pr.ok} style={{ position: "absolute", left: 790, top: top + THUMB.h / 2 - 15 }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* the thumbnails, lifting off the card as test frames (exact copies until they lift) */}
      {out > 0 && <div style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const t = gThumb(i, lift, cp), w = t.w, h = t.h;
          return <div key={i} style={{ position: "absolute", left: t.cx - w / 2, top: t.cy - h / 2, width: w, height: h, borderRadius: t.r, overflow: "hidden",
            boxShadow: `0 0 0 1px ${C.line}, 0 ${18 * lift}px ${40 * lift}px -${12 * lift}px rgba(60,40,110,${0.35 * lift})` }}><FjFrame i={i} w={w} h={h} t={1} /></div>;
        })}
      </div>}

      {/* the connectors: card row → site */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: live }}>
        {pairs.map((pr) => {
          if (pr.line <= 0) return null;
          const a = cardPt(838, ROW0 + pr.row * ROWSTEP + THUMB.h / 2, cp), r = spotRect(pr.spot, scroll), b = { x: r.x, y: r.y + r.h / 2 };
          const d = `M ${a.x} ${a.y} C ${a.x + 90} ${a.y}, ${b.x - 90} ${b.y}, ${b.x} ${b.y}`;
          return (
            <g key={pr.row}>
              <path d={d} fill="none" stroke={C.violet} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pr.line} />
              <circle cx={a.x} cy={a.y} r={6} fill={C.violet} opacity={clamp01(pr.line * 4)} />
              <circle cx={b.x} cy={b.y} r={6} fill={C.violet} opacity={clamp01(pr.line * 3 - 2)} />
            </g>
          );
        })}
      </svg>

      {/* the step row: the real step, landing between the two columns */}
      {stepIn > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1920, top: 858, display: "flex", justifyContent: "center", opacity: live }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderRadius: 20, background: C.white, border: `1px solid ${C.card}`, boxShadow: SHADOW_BIG, ...surface(stepIn) }}>
            <div style={{ width: 36, height: 36, position: "relative", flex: "none" }}>
              <div style={{ position: "absolute", inset: 2, borderRadius: "50%", border: `2.5px solid ${C.line}` }} />
              {stepOk > 0 && <Check size={36} p={stepOk} style={{ position: "absolute", left: 0, top: 0 }} />}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: C.label, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Every number and quote is on the site</div>
          </div>
        </div>
      )}
    </div>
  );
};

