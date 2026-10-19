// Scene C — the scan (sC → h1): "Moviqly scans your site: headlines, numbers, colors, logo."
// The WEBSITE chip (carried here from B) becomes the address bar of the Fjello site, which opens out of it, large on
// the left and turned a little in depth. A violet scan line sweeps down while the page scrolls, and a material rail
// stands up on the right. On each named word the thing lifts off the page toward the viewer and is carried to the
// rail (headline, the numbers, four sampled colours). On "logo" the site falls back into depth, a white card surfaces
// in the middle, the materials gather onto it and the logo flies in last: the raw draft, exactly Handoff1.
import React from "react";
import { BriefLayer, SITE, SS, URL_LOCAL, projSite, siteRy, siteZ } from "./B";
import { PERSP } from "./A";
import {
  C, CRAFT, DraftTile, FJ, FONT, FjLogo, FjSite, H1, Handoff1, LAND, LEAVE, SHADOW, SHADOW_DEEP, SITE_BAR, SITE_SPOTS, SNAP, Stage3D, Check,
  clamp01, f, k, mix, surface,
} from "../shared";

// a label shifted by off seconds (labels may already carry an offset: "w:numbers+0.1")
const lbl = (l: string, off: number) => {
  const m = l.match(/^(.+?)([+-][\d.]+)?$/) as RegExpMatchArray;
  const o = (m[2] ? parseFloat(m[2]) : 0) + off;
  return Math.abs(o) < 1e-6 ? m[1] : `${m[1]}${o > 0 ? "+" : "-"}${Math.abs(o).toFixed(3)}`;
};
const smooth = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
type Spot = { x: number; y: number; w: number; h: number };
const local = (s: Spot, scroll = 0) => ({ x: s.x * SS, y: (SITE_BAR + s.y - scroll) * SS, w: s.w * SS, h: s.h * SS });

/* ---------- the rail ---------- */
const RAIL = { x: 1200, w: 620 };
const SLOTS = [
  { key: "HEADLINE", y: 228, h: 204, at: "w:headlines" },
  { key: "NUMBERS", y: 458, h: 176, at: "w:numbers" },
  { key: "COLORS", y: 660, h: 136, at: "w:colors" },
];
const HEAD_TL = { x: RAIL.x + 30, y: SLOTS[0].y + 70 };
const N120_TL = { x: RAIL.x + 30, y: SLOTS[1].y + 64 };
const N49_TL = { x: RAIL.x + 250, y: SLOTS[1].y + 64 };
const DISC_RAIL = (i: number) => ({ x: RAIL.x + 30 + 34 + i * 88, y: SLOTS[2].y + 84, d: 68 });
const COLORS = [
  { c: FJ.pine, spot: SITE_SPOTS.pine }, { c: FJ.ember, spot: SITE_SPOTS.ember }, { c: FJ.sand, spot: SITE_SPOTS.sand }, { c: FJ.ink, spot: SITE_SPOTS.ink },
];

/* ---------- the draft card's own geometry (DraftTile at H1: u = 7.2) ---------- */
const U = H1.w / 100;
const CARD = { x: H1.x, y: H1.y, w: H1.w, h: (H1.w * 9) / 16 };
const D_LOGO = { x: CARD.x + U * 5, y: CARD.y + U * 5 };
const D_HEAD = { x: CARD.x + U * 5, y: CARD.y + U * 5 + U * 4 + U * 4.5 };
const D_PILL_BL = { x: CARD.x + U * 5, y: CARD.y + CARD.h - U * 5 };
const D_DISC = (i: number) => ({ x: CARD.x + CARD.w - U * 5 - (3 - i) * U * 5.6 - U * 2.2, y: CARD.y + CARD.h - U * 5 - U * 2.2, d: U * 4.4 });

/* ---------- pieces ---------- */
const HeadText: React.FC = () => (
  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: U * 6.4, letterSpacing: "-0.03em", lineHeight: 1.05, color: FJ.ink, whiteSpace: "nowrap" }}>Gear that goes<br />further.</div>
);
const Num: React.FC<{ n: string; sub: string }> = ({ n, sub }) => (
  <div style={{ fontFamily: FONT, color: FJ.ink, whiteSpace: "nowrap" }}>
    <div style={{ fontWeight: 700, fontSize: 58, letterSpacing: "-0.03em", lineHeight: 1 }}>{n}</div>
    <div style={{ fontSize: 22, color: C.muted, marginTop: 8 }}>{sub}</div>
  </div>
);
const Pill: React.FC = () => (
  <div style={{ fontFamily: FONT, padding: `${U}px ${U * 2}px`, borderRadius: 999, background: C.mist, fontWeight: 600, fontSize: U * 2.6, color: FJ.ink, whiteSpace: "nowrap" }}>120 trails tested</div>
);
// a cut-out of the page (the site at scroll 0), the spot's size in window px
const Clip: React.FC<{ spot: Spot }> = ({ spot }) => {
  const l = local(spot);
  return (
    <div style={{ width: l.w, height: l.h, overflow: "hidden", position: "relative", borderRadius: 10 }}>
      <div style={{ position: "absolute", left: -l.x, top: -l.y }}><FjSite w={SITE.w} h={SITE.h} style={{ boxShadow: "none", borderRadius: 0 }} /></div>
    </div>
  );
};

// a lifted piece: from its spot on the page (top-left anchored), lifted toward the viewer, carried to `to` where it
// turns into the material (natural width mw). Returns the anchor, the clip's scale and the two opacities.
const carryOf = (g: number, spot: Spot, L: string, to: { x: number; y: number }, mw: number, dur = 0.6, start = 0.2, zx = 0) => {
  const ry = siteRy(g), l = local(spot);
  const z = siteZ(g) + zx, p0 = projSite(l.x, l.y, ry, z), pc = projSite(l.x + l.w / 2, l.y + l.h / 2, ry, z);
  const lt = k(g, L, 0.3, LAND), ct = k(g, lbl(L, start), dur, CRAFT);
  const ls = 1 + 0.14 * lt, s0 = pc.sc * ls;
  const tl0 = { x: pc.x - (pc.x - p0.x) * ls, y: pc.y - (pc.y - p0.y) * ls };
  const s = mix(s0, mw / l.w, ct);
  return { lt, ct, x: mix(tl0.x, to.x, ct), y: mix(tl0.y, to.y, ct), s, ms: (s * l.w) / mw, clipO: 1 - smooth(ct, 0.2, 0.7), lift: lt * (1 - ct) };
};

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sC") || g >= f("h1")) return null;
  if (g >= f("h1") - 1) return <Handoff1 />;

  const ry = siteRy(g);
  // the site opens out of the chip, then is scanned
  const open = k(g, "w:moviqly", 0.8, CRAFT);
  const sc1 = k(g, "w:scans", 0.85, CRAFT), sc2 = k(g, "w:site2+0.25", 0.5, CRAFT);
  const scroll = 520 * sc1 * (1 - sc2);
  const beamO = smooth(sc1, 0, 0.08) * (1 - smooth(sc1, 0.85, 1));
  const beamY = mix(SITE_BAR * SS, SITE.h, sc1);
  // the finale: the site recedes, the rail recedes, a card surfaces, the draft fades in
  const rs = k(g, "w:logo-0.25", 0.75, CRAFT);
  const rr = k(g, "w:logo-0.07", 0.5, LEAVE);
  const ck = k(g, "w:logo-0.1", 0.45, LAND);
  const fin = k(g, "h1-0.2", 0.17, LAND);
  const matO = 1 - fin;

  const marks: { spot: Spot; at: string; round?: boolean }[] = [
    { spot: SITE_SPOTS.headline, at: "w:headlines" }, { spot: SITE_SPOTS.stat120, at: "w:numbers" }, { spot: SITE_SPOTS.stat49, at: "w:numbers" },
    ...COLORS.map((c, i) => ({ spot: c.spot, at: lbl("w:colors", i * 0.06), round: true })), { spot: SITE_SPOTS.logo, at: "w:logo" },
  ];

  // carries
  const head = carryOf(g, SITE_SPOTS.headline, "w:headlines", HEAD_TL, 354);
  const n120 = carryOf(g, SITE_SPOTS.stat120, "w:numbers", N120_TL, SITE_SPOTS.stat120.w * SS);
  const n49 = carryOf(g, SITE_SPOTS.stat49, "w:numbers", N49_TL, SITE_SPOTS.stat49.w * SS);
  const logo = carryOf(g, SITE_SPOTS.logo, "w:logo", D_LOGO, 115, 0.45, 0.05, -420 * rs);
  // gathers onto the card
  const gh = k(g, "w:logo-0.07", 0.5, CRAFT), gn = k(g, "w:logo", 0.5, CRAFT);

  return (
    <>
      <BriefLayer g={g} />
      <Stage3D persp={PERSP}>
        {open > 0 && (
          <div style={{ position: "absolute", left: SITE.x, top: SITE.y, width: SITE.w, height: SITE.h, transformOrigin: "0% 50%",
            transform: `translateZ(${siteZ(g) - 420 * rs}px) rotateY(${ry}deg)`, opacity: 1 - rs, filter: rs > 0 ? `blur(${(rs * 12).toFixed(2)}px)` : undefined }}>
            <div style={{ position: "absolute", inset: 0, transformOrigin: `${URL_LOCAL.x}px ${URL_LOCAL.y}px`, transform: `scale(${mix(0.22, 1, open)})`,
              opacity: clamp01(open * 2.2), filter: open < 1 ? `blur(${((1 - open) * 10).toFixed(2)}px)` : undefined }}>
              <FjSite w={SITE.w} h={SITE.h} scroll={scroll} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 16 * SS, overflow: "hidden" }}>
                {beamO > 0 && <>
                  <div style={{ position: "absolute", left: 0, right: 0, top: beamY - 150, height: 150, opacity: beamO, background: "linear-gradient(rgba(136,83,223,0), rgba(136,83,223,0.16))" }} />
                  <div style={{ position: "absolute", left: 0, right: 0, top: beamY - 2, height: 4, opacity: beamO, background: "linear-gradient(90deg, #982AFF, #3047FF 55%, #10DBED)",
                    boxShadow: "0 0 22px 5px rgba(136,83,223,0.55)" }} />
                </>}
                {marks.map((m, i) => {
                  const p = k(g, m.at, 0.2, SNAP) * (1 - 0.55 * k(g, lbl(m.at, 0.8), 0.4));
                  if (p <= 0) return null;
                  const l = local(m.spot, scroll);
                  const pad = m.round ? 6 : 8;
                  return <div key={i} style={{ position: "absolute", left: l.x - pad, top: l.y - pad, width: l.w + pad * 2, height: l.h + pad * 2, borderRadius: m.round ? "50%" : 10,
                    border: `3px solid ${C.violet}`, background: "rgba(136,83,223,0.10)", opacity: p, boxSizing: "border-box", boxShadow: "0 0 0 4px rgba(255,255,255,0.55)" }} />;
                })}
              </div>
            </div>
          </div>
        )}
      </Stage3D>

      {/* the material rail */}
      {SLOTS.map((s, i) => {
        const p = k(g, lbl("w:site2", -0.1 + 0.15 * i), 0.45, LAND);
        if (p <= 0) return null;
        const fill = k(g, lbl(s.at, i === 2 ? 0.6 : 0.72), 0.25, SNAP);
        const st = surface(p * (1 - rr));
        return (
          <div key={s.key} style={{ position: "absolute", left: RAIL.x, top: s.y, width: RAIL.w, height: s.h, ...st }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, border: `2px dashed #D6C8E6`, background: "rgba(255,255,255,0.45)", boxSizing: "border-box", opacity: 1 - fill }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, border: `1px solid ${C.card}`, background: C.white, boxShadow: SHADOW, opacity: fill }} />
            <div style={{ position: "absolute", left: 30, top: 24, fontFamily: FONT, fontSize: 20, fontWeight: 600, letterSpacing: "0.16em", color: C.detail }}>{s.key}</div>
            <Check size={32} p={fill} style={{ position: "absolute", right: 22, top: 18 }} />
          </div>
        );
      })}

      {/* the draft card surfaces */}
      {ck > 0 && <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: U * 2.6, background: C.white,
        boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_DEEP}`, ...surface(ck) }} />}
      {fin > 0 && <DraftTile w={H1.w} style={{ position: "absolute", left: H1.x, top: H1.y, background: "transparent", boxShadow: "none", opacity: fin }} />}

      {/* headline: page → rail → card */}
      {head.lt > 0 && (() => {
        const x = mix(head.x, D_HEAD.x, gh), y = mix(head.y, D_HEAD.y, gh);
        return <>
          {head.clipO > 0 && <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `scale(${head.s})`, opacity: head.clipO,
            boxShadow: `0 0 0 ${3 * head.lift}px #fff, 0 ${40 * head.lift}px ${70 * head.lift}px -20px rgba(20,40,30,${0.55 * head.lift})`, borderRadius: 10 }}><Clip spot={SITE_SPOTS.headline} /></div>}
          <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `scale(${head.ms})`, opacity: (1 - head.clipO) * matO }}><HeadText /></div>
        </>;
      })()}

      {/* numbers: page → rail; 120 → the card's pill, 4.9 ★ recedes with the rail */}
      {[{ c: n120, spot: SITE_SPOTS.stat120, n: "120", sub: "trails tested", main: true }, { c: n49, spot: SITE_SPOTS.stat49, n: "4.9 ★", sub: "from 2,300 reviews", main: false }].map(({ c, spot, n, sub, main }) => {
        if (c.lt <= 0) return null;
        const gt = main ? gn : 0;
        const pillTL = { x: D_PILL_BL.x, y: D_PILL_BL.y - U * 2 - U * 2.6 * 1.3 };
        const x = mix(c.x, pillTL.x, gt), y = mix(c.y, pillTL.y, gt);
        const away = main ? 0 : rr;
        const st = away > 0 ? surface(1 - away) : {};
        return <div key={n} style={{ position: "absolute", left: 0, top: 0, ...st, transformOrigin: `${N49_TL.x + 75}px ${N49_TL.y + 40}px` }}>
          {c.clipO > 0 && <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `scale(${c.s})`, opacity: c.clipO, borderRadius: 10,
            boxShadow: `0 0 0 ${3 * c.lift}px #fff, 0 ${34 * c.lift}px ${60 * c.lift}px -18px rgba(60,40,20,${0.5 * c.lift})` }}><Clip spot={spot} /></div>}
          <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `scale(${c.ms * mix(1, 0.42, gt)})`, opacity: (1 - c.clipO) * (1 - smooth(gt, 0.15, 0.6)) }}><Num n={n} sub={sub} /></div>
          {main && gt > 0 && <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `scale(${mix(1.6, 1, gt)})`, opacity: smooth(gt, 0.25, 0.7) * matO }}><Pill /></div>}
        </div>;
      })}

      {/* colours: sampled off the page → rail → card */}
      {COLORS.map((cl, i) => {
        const L = lbl("w:colors", i * 0.06);
        const lt = k(g, L, 0.25, LAND);
        if (lt <= 0) return null;
        const ct = k(g, lbl(L, 0.15), 0.5, CRAFT);
        const gt = k(g, lbl("w:logo", i * 0.02), 0.45, CRAFT);
        const l = local(cl.spot), pc = projSite(l.x + l.w / 2, l.y + l.h / 2, ry, siteZ(g));
        const r = DISC_RAIL(i), d = D_DISC(i);
        const d0 = l.w * pc.sc * (1 + 0.25 * lt);
        const x = mix(mix(pc.x, r.x, ct), d.x, gt), y = mix(mix(pc.y, r.y, ct), d.y, gt), dd = mix(mix(d0, r.d, ct), d.d, gt);
        const lift = lt * (1 - ct);
        return <div key={i} style={{ position: "absolute", left: x - dd / 2, top: y - dd / 2, width: dd, height: dd, borderRadius: "50%", background: cl.c, opacity: matO,
          boxShadow: `0 0 0 ${mix(4, 1, Math.max(ct, gt))}px ${ct > 0.5 ? C.line : C.white}, 0 ${16 * lift + 6}px ${30 * lift + 10}px -8px rgba(30,20,50,${0.25 + 0.2 * lift})` }} />;
      })}

      {/* logo: page → card, last */}
      {logo.lt > 0 && <>
        {logo.clipO > 0 && <div style={{ position: "absolute", left: logo.x, top: logo.y, transformOrigin: "0 0", transform: `scale(${logo.s})`, opacity: logo.clipO, borderRadius: 10,
          boxShadow: `0 0 0 ${3 * logo.lift}px #fff, 0 ${34 * logo.lift}px ${60 * logo.lift}px -18px rgba(20,40,30,${0.55 * logo.lift})` }}><Clip spot={SITE_SPOTS.logo} /></div>}
        <div style={{ position: "absolute", left: logo.x, top: logo.y, transformOrigin: "0 0", transform: `scale(${logo.ms})`, opacity: (1 - logo.clipO) * matO }}><FjLogo h={U * 3.2} /></div>
      </>}
    </>
  );
};
