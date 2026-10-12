// Part B, 16–29.8 s: what Málaga Hideaway does. The checklist becomes the service list (left) over real life, full
// frame: each service's picture opens out of the list as it is named (reservations, arrivals, cleaning, maintenance,
// ready for every stay); then, for owners who don't rent, keyholding and property support.
import React from "react";
import { C, F, MOVE, W, at, clamp01, lerp, mix, pr } from "./lib";
import { Icon } from "./icons";
import { Card, Check, Chip, HomeCard, Logo, MEDIA, Media, Place, Switch, rise } from "./shared";

// ---- geometry --------------------------------------------------------------------------------------------------------
export const LIST = { x: 440, y: 540, w: 620 };
export const bStart = () => W("w:we", -0.3);                         // the checklist moves left
export const bEnd = () => W("w:with", -0.3);                         // the list becomes the agreement
/** The checklist (centre) travelling to the list's place: 0..1. */
export const toList = (g: number) => pr(g, bStart(), 22, MOVE);

const T = () => ({
  R: W("w:reservations", -0.2), ARR: W("w:coordinate", -0.05), CLN: W("w:arrange", -0.1), MNT: W("w:handle", -0.15), RDY: W("w:keeping", -0.1),
  KEY: W("w:keyholding", -0.15), CHK: W("w:property3", -0.1), TEC: W("w:services", -0.05), COV: W("w:covered", -0.1),
});

type Row = { icon: string; t: string; on: number; off: number };
const rent = (): Row[] => { const t = T(); return [
  { icon: "calendar", t: "Reservations", on: t.R, off: t.ARR },
  { icon: "suitcase", t: "Guest arrivals", on: t.ARR, off: t.CLN },
  { icon: "sparkle", t: "Cleaning", on: t.CLN, off: t.MNT },
  { icon: "wrench", t: "Maintenance", on: t.MNT, off: t.RDY },
]; };
const keep = (): Row[] => { const t = T(); return [
  { icon: "key", t: "Secure key custody", on: t.KEY, off: t.CHK },
  { icon: "clipboard", t: "Property checks", on: t.CHK, off: t.TEC },
  { icon: "wrench", t: "On site for technicians", on: t.TEC, off: t.COV },
]; };
const keepK = (g: number) => pr(g, W("w:our", -0.05), 16, MOVE);     // the keyholding list comes in
const dimK = (g: number) => pr(g, W("w:not", -0.1), 14, MOVE);      // the rental list steps back

const Rows: React.FC<{ g: number; rows: Row[]; dim?: number }> = ({ g, rows, dim = 0 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28 }}>
    {rows.map((r) => {
      const act = pr(g, r.on, 8) * (1 - pr(g, r.off, 8));
      const done = pr(g, r.off, 10);
      return (
        <div key={r.t} style={{ display: "flex", alignItems: "center", gap: 18, height: 84, padding: "0 20px", borderRadius: 20,
          background: mix(C.page, C.bluePale, act), border: `2px solid ${mix(C.page, C.blueSoft, act)}`, opacity: 1 - 0.55 * dim }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: mix(C.white, C.blue, act), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={r.icon} size={32} color={mix(C.blueDeep, "#FFFFFF", act)} stroke={2.2} /></div>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 31, color: C.ink, flex: 1, whiteSpace: "nowrap" }}>{r.t}</span>
          <Check k={done} size={40} />
        </div>
      );
    })}
  </div>
);

/** The service list: rental management, then keyholding and property support. */
export const ServiceList: React.FC<{ g: number }> = ({ g }) => {
  const a = bStart(), out = bEnd();
  if (g < a || g > out + 14) return null;
  const k = toList(g), kp = keepK(g);
  const leave = pr(g, out, 9, MOVE);
  return (
    <div style={{ ...at(lerp(960, LIST.x, k), LIST.y, 1, clamp01((g - a) / 8) * (1 - leave)) }}>
      <Card w={LIST.w} pad={40} style={{ height: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Logo h={50} word={0} />
          <div style={{ position: "relative", height: 44, flex: 1 }}>
            <div style={{ position: "absolute", fontFamily: F.ui, fontWeight: 700, fontSize: 32, color: C.ink, opacity: 1 - kp, whiteSpace: "nowrap" }}>Rental management</div>
            <div style={{ position: "absolute", fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.ink, opacity: kp, whiteSpace: "nowrap", top: 2 }}>Keyholding & support</div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, opacity: 1 - kp, transform: `translateY(${-24 * kp}px)` }}><Rows g={g} rows={rent()} dim={dimK(g)} /></div>
          {kp > 0 && <div style={{ position: "absolute", left: 0, right: 0, opacity: kp, transform: `translateY(${24 * (1 - kp)}px)` }}><Rows g={g} rows={keep()} /></div>}
        </div>
      </Card>
    </div>
  );
};

// ---- the backdrop: real life, full frame; each picture opens out of the list --------------------------------------------
type Shot = { a: number; src: string; pos?: string; skip?: number; ox?: number; oy?: number };
export const shots = (): Shot[] => { const t = T(); return [
  { a: t.ARR, src: MEDIA.arrival, skip: 1.0 },              // walking up to the door
  { a: t.CLN, src: MEDIA.cleaning, skip: 1.0 },
  { a: t.MNT, src: MEDIA.repair, skip: 0.5 },
  { a: t.RDY, src: MEDIA.ready, skip: 0 },                  // a made room turning towards its terrace
  { a: t.KEY, src: MEDIA.keys, skip: 2.0 },
  { a: t.CHK, src: MEDIA.check, skip: 0 },                  // walking through the rooms as the checks tick
]; };
const REVEAL = 20;
const Shots: React.FC<{ g: number }> = ({ g }) => {
  const list = shots(), out = bEnd() + 26;
  if (g < list[0].a || g > out) return null;
  return (
    <>
      {list.map((s, i) => {
        const next = list[i + 1]?.a ?? out;
        if (g < s.a || g > next + REVEAL) return null;
        const r = 2300 * MOVE(clamp01((g - s.a) / REVEAL));
        const ox = s.ox ?? LIST.x + LIST.w / 2, oy = s.oy ?? 540;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, clipPath: r < 2290 ? `circle(${r}px at ${ox}px ${oy}px)` : undefined }}>
            <Media src={s.src} pos={s.pos} from={s.a} skip={s.skip} loop={900} />
          </div>
        );
      })}
    </>
  );
};

/** Reservations: the month fills with stays, on a card over Málaga. */
const Calendar: React.FC<{ g: number; a: number }> = ({ g, a }) => {
  const start = 2, cw = 96, out = T().ARR;
  const stays: [number, number, string][] = [[3, 9, C.blue], [10, 16, C.terra], [17, 22, C.sky], [24, 30, C.blueDeep]];
  const e = pr(g, a, 18, MOVE), x = pr(g, out - 8, 10, MOVE);   // gone before the arrival opens
  return (
    <div style={{ ...at(1300, 540 + 60 * (1 - e) - 40 * x, 1, clamp01((g - a) / 8) * (1 - x)) }}>
      <Card w={760} pad={40}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Icon name="calendar" size={40} color={C.blueDeep} stroke={2.2} />
          <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 36, color: C.ink }}>July</span>
          <span style={{ marginLeft: "auto", fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: C.green, background: C.greenSoft, padding: "8px 18px", borderRadius: 22 }}>
            {Math.min(4, Math.max(0, Math.floor((g - a - 6) / 6) + 1))} stays booked</span>
        </div>
        <div style={{ position: "relative", marginTop: 26, height: 5 * 76 }}>
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: (i % 7) * cw, top: Math.floor(i / 7) * 76, width: cw - 8, height: 68, borderRadius: 12, background: C.page,
              fontFamily: F.ui, fontSize: 18, fontWeight: 600, color: C.faint, padding: "6px 9px", boxSizing: "border-box" }}>{i - start + 1 > 0 && i - start + 1 <= 31 ? i - start + 1 : ""}</div>
          ))}
          {stays.map(([d0, d1, col], k) => {
            const p = pr(g, a + 6 + k * 6, 14, MOVE);
            const segs: [number, number][] = [];
            for (let d = d0; d <= d1;) { const c = d + start - 1, end = Math.min(d1, d + (6 - (c % 7))); segs.push([d, end]); d = end + 1; }
            return segs.map(([s0, s1], j) => {
              const c0 = s0 + start - 1, c1 = s1 + start - 1;
              return <div key={`${k}-${j}`} style={{ position: "absolute", left: (c0 % 7) * cw, top: Math.floor(c0 / 7) * 76 + 36, height: 26, borderRadius: 9, background: col,
                width: ((c1 - c0 + 1) * cw - 8) * p, opacity: clamp01(p * 3) }} />;
            });
          })}
        </div>
      </Card>
    </div>
  );
};

/** A chip at the lower right while its shot is up. */
const ShotChip: React.FC<{ g: number; a: number; b: number; y?: number; children: React.ReactNode }> = ({ g, a, b, y = 960, children }) => {
  if (g < a || g > b + 12) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: 1 - pr(g, b, 10, MOVE) }}><Place x={1440} y={y} k={pr(g, a, 14)} d={24}>{children}</Place></div>;
};

/** The home (the thread object) on a card: ready for guests, the next stays under it; then not rented, the switch off. */
const ReadyHome: React.FC<{ g: number }> = ({ g }) => {
  const t = T(), offK = pr(g, W("w:renting", 0.0), 12, MOVE);
  const e = pr(g, t.RDY + 4, 20, MOVE), x = pr(g, t.KEY, 12, MOVE);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - x }}>
      <div style={{ ...at(1430, 500 + 70 * (1 - e), 1, clamp01((g - t.RDY - 4) / 8)) }}>
        <HomeCard w={540} h={620}>
          {g >= W("w:ready", -0.1) && <div style={{ position: "absolute", left: 24, top: 24, ...rise(pr(g, W("w:ready", -0.1), 14), 16) }}>
            <div style={{ position: "relative" }}>
              <div style={{ opacity: 1 - offK }}><Chip icon="check" text="Ready for guests" tone="green" size={28} /></div>
              <div style={{ position: "absolute", left: 0, top: 0, opacity: offK }}><Chip icon="home" text="Not rented" tone="navy" size={28} /></div>
            </div></div>}
        </HomeCard>
      </div>
      {["12–19 Jul", "20–27 Jul", "2–9 Aug"].map((d, i) => {
        const s0 = W("w:every2", -0.15) + i * 5;
        if (g < s0) return null;
        const drop = pr(g, W("w:renting", 0.0) + i * 2, 12, MOVE);
        return <div key={d} style={{ position: "absolute", inset: 0, opacity: 1 - drop, transform: `translateY(${50 * drop}px)` }}>
          <Place x={1182 + i * 248} y={900} k={pr(g, s0, 14)} d={22}>
            <div style={{ height: 66, padding: "0 22px", borderRadius: 33, background: C.white, display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 700, fontSize: 25, color: C.ink,
              boxShadow: "0 20px 40px -24px rgba(17,35,55,0.5)", whiteSpace: "nowrap" }}>
              <Icon name="calendar" size={28} color={C.blueDeep} stroke={2.2} />{d}</div></Place></div>;
      })}
      {g >= W("w:not", -0.15) && <Place x={1430} y={150} k={pr(g, W("w:not", -0.15), 12)} d={16}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, height: 76, padding: "0 16px 0 28px", borderRadius: 38, background: C.white,
          fontFamily: F.ui, fontWeight: 700, fontSize: 29, color: C.ink, boxShadow: "0 20px 40px -24px rgba(17,35,55,0.5)" }}>Renting out<Switch on={1 - offK} w={80} /></div></Place>}
    </div>
  );
};

const Overlays: React.FC<{ g: number }> = ({ g }) => {
  const t = T(), out = bEnd();
  if (g < t.R || g > out + 14) return null;
  const leave = pr(g, out - 4, 10, MOVE);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      {g < t.ARR + 4 && <Calendar g={g} a={t.R} />}
      <ShotChip g={g} a={t.ARR + 10} b={t.CLN}><Chip icon="key" text="Guests arriving 15:00 · door code sent" tone="terra" size={30} /></ShotChip>
      <ShotChip g={g} a={t.CLN + 10} b={t.MNT}><Chip icon="sparkle" text="Cleaned · fresh linen & towels" size={30} /></ShotChip>
      <ShotChip g={g} a={t.MNT + 10} b={t.RDY}><Chip icon="wrench" text="Maintenance done" tone="green" size={30} /></ShotChip>
      {/* ready for every stay: the home itself, on a card over a made room */}
      {g >= t.RDY && g < t.KEY + 12 && <ReadyHome g={g} />}
      <ShotChip g={g} a={t.KEY + 12} b={t.CHK}><Chip icon="lock" text="Your keys, held safely in Málaga" size={30} /></ShotChip>
      {/* the property check */}
      {g >= t.CHK + 6 && (
        <Place x={1530} y={330} k={pr(g, t.CHK + 6, 14)} d={24}>
          <div style={{ background: C.white, borderRadius: 28, padding: "28px 32px", width: 420, boxSizing: "border-box", boxShadow: "0 30px 60px -30px rgba(17,35,55,0.5)" }}>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.ink, display: "flex", alignItems: "center", gap: 12 }}>
              <Icon name="clipboard" size={34} color={C.blueDeep} stroke={2.2} />Property check</div>
            {["Doors & windows", "Water & power", "Post", "Air-con"].map((x, i) => (
              <div key={x} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, fontFamily: F.ui, fontSize: 27, fontWeight: 500, color: C.ink }}>
                <Check k={pr(g, t.CHK + 14 + i * 6, 10)} size={36} />{x}</div>))}
          </div>
        </Place>
      )}
      <ShotChip g={g} a={t.TEC} b={out + 20} y={720}><Chip icon="wrench" text="Technician Tue 10:00 · we'll be there" tone="terra" size={30} /></ShotChip>
      <ShotChip g={g} a={t.COV} b={out + 20} y={850}><Chip icon="shield" text="Covered while you're away" tone="green" size={32} /></ShotChip>
    </div>
  );
};

export { Shots, Overlays };
