// Part A, 0–16 s: one home and its hundred moving parts; the chores pile up; you're miles away (the map); Málaga
// Hideaway comes in (the logo out of the Málaga pin); one local partner (Málaga itself); every detail taken care of.
import React from "react";
import { ARRIVE, C, F, MOVE, SHADOW_SOFT, SOFT, W, at, clamp01, expoOut, lerp, pr, px, pxi, rgba } from "./lib";
import { Icon } from "./icons";
import { CountryMap, Pin, Route } from "./maps";
import MAP from "./map.json";
import { Card, Check, Chip, Field, Head, HomeCard, Logo, MEDIA, Media, Place, rise } from "./shared";
import { LIST, toList } from "./SceneB";

// ---- the stage geometry ---------------------------------------------------------------------------------------------
const HOME_W = 560, HOME_H = 700;
/** The map: Natural Earth, shifted and scaled so Málaga sits low left of centre and "you" far north. */
const MAP_S = 1.35, M0 = MAP.cities["Málaga"] as number[], A0 = MAP.cities["Amsterdam"] as number[];
export const MALAGA = [820, 800];
export const YOU = [MALAGA[0] + MAP_S * (A0[0] - M0[0]), MALAGA[1] + MAP_S * (A0[1] - M0[1])];

/** Where the cluster (home, chores, swarm) is shrunk on "You're miles away": 0..1. */
const shrinkK = (g: number) => pr(g, W("w:youre", -0.3), 24, MOVE);

// ---- 1 the home and its hundred moving parts ------------------------------------------------------------------------
const PARTS: [string, string][] = [
  ["calendar", "Bookings"], ["key", "Check-ins"], ["sparkle", "Cleaning"], ["wrench", "Repairs"], ["chat", "Guest messages"],
  ["towel", "Towels"], ["laundry", "Laundry"], ["wifi", "Wi-Fi"], ["waves", "Pool"], ["thermo", "Air-con"], ["star", "Reviews"],
  ["lock", "Key box"], ["bulb", "Light bulbs"], ["leaf", "Plants"], ["mail", "Post"], ["invoice", "Invoices"], ["suitcase", "Arrivals"],
  ["bed", "Fresh linen"], ["door", "Check-outs"], ["phone", "Calls"], ["euro", "Payments"], ["clipboard", "Inventory"], ["sun", "High season"],
  ["shield", "Insurance"], ["plane", "Late flights"], ["bell", "Doorbell"], ["camera", "Photos"], ["pin", "Directions"],
];
/** Part i on its orbit around the cluster: x, y, depth (−1 behind … 1 in front). */
const orbit = (g: number, i: number) => {
  const a0 = W("w:a", -0.12) + i * 1.5;                              // they stream out on "A hundred moving parts"
  const out = clamp01(expoOut(22, 0.85)((g - a0) / 22));
  const band = 0.78 + 0.22 * ((i * 7) % 5) / 4;
  const th = (i * 2.399) + (g - a0) * 0.0085 * (i % 2 ? 1 : 1.18);   // golden-angle spread, two speeds
  const cx = lerp(960, 840, pr(g, W("w:bookings", -0.3), 22, MOVE));
  const rx = 800 * band * out, ry = 395 * band * out;
  return { x: cx + rx * Math.cos(th), y: 540 + ry * Math.sin(th), z: Math.sin(th), born: g >= a0, out };
};
/** Which swarm parts become the five chore cards (they leave the swarm). */
const CHORE_PART = [0, 1, 2, 3, 4];
const choreAt = (i: number) => W(["w:bookings", "w:checkins", "w:cleaning", "w:repairs", "w:guest"][i], -0.2);

const Part: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const o = orbit(g, i);
  if (!o.born) return null;
  const chore = CHORE_PART.indexOf(i);
  const gone = chore >= 0 ? clamp01((g - choreAt(chore)) / 4) : 0;
  if (gone >= 1) return null;
  const sc = 0.78 + 0.22 * (o.z + 1) / 2;
  const [icon, label] = PARTS[i];
  return (
    <div style={{ ...at(o.x, o.y, sc, clamp01((o.out - 0.05) * 3) * (0.55 + 0.45 * (o.z + 1) / 2) * (1 - gone)) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, height: 72, padding: "0 28px 0 14px", borderRadius: 36, background: C.white, boxShadow: SHADOW_SOFT,
        fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.ink, whiteSpace: "nowrap" }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: i % 3 === 1 ? C.terraSoft : C.bluePale, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={30} color={i % 3 === 1 ? C.terraDeep : C.blueDeep} stroke={2.3} /></div>{label}</div>
    </div>
  );
};

// ---- 2 the chores pile up -----------------------------------------------------------------------------------------------
const SLOTS = [[1300, 505, -3], [1322, 532, 2.5], [1288, 560, -1.5], [1330, 520, 3], [1300, 552, -2]];
const CHORE_W = 600, CHORE_H = 360;

const ChoreBody: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const a = choreAt(i);
  if (i === 0) {   // bookings: a week fills with stays
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const stays: [number, number, string, string][] = [[0, 3, "2 guests", C.blue], [3, 6, "4 guests", C.terra], [5, 7, "6 guests", C.sky]];
    return (<>
      <Head icon="calendar" title="Bookings" right={<span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: C.blueDeep, background: C.bluePale, padding: "8px 16px", borderRadius: 20 }}>3 new</span>} />
      <div style={{ display: "flex", marginTop: 30, gap: 6 }}>{days.map((d) => <div key={d} style={{ flex: 1, fontFamily: F.ui, fontSize: 20, fontWeight: 600, color: C.faint, textAlign: "center" }}>{d}</div>)}</div>
      <div style={{ position: "relative", height: 150, marginTop: 10 }}>
        {stays.map(([s0, s1, t, col], k) => {
          const e = pr(g, a + 6 + k * 5, 14);
          return <div key={k} style={{ position: "absolute", left: `${(s0 / 7) * 100}%`, width: `${((s1 - s0) / 7) * 100 * e}%`, top: k * 50, height: 40, borderRadius: 12, background: col,
            color: "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: 19, display: "flex", alignItems: "center", paddingLeft: 12, overflow: "hidden", whiteSpace: "nowrap", boxSizing: "border-box" }}>{t}</div>;
        })}
      </div>
    </>);
  }
  if (i === 1) return (<>
    <Head icon="key" title="Check-in" tone={C.terraDeep} tint={C.terraSoft} />
    <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 60, color: C.ink, marginTop: 26 }}>Sat · 15:00</div>
    <div style={{ display: "flex", gap: 14, marginTop: 20, alignItems: "center", fontFamily: F.ui, fontSize: 26, color: C.muted, fontWeight: 600 }}>
      Door code <span style={{ fontFamily: "monospace", fontSize: 32, color: C.ink, letterSpacing: 6, background: C.sandPale, padding: "4px 14px", borderRadius: 10 }}>4821</span></div>
  </>);
  if (i === 2) return (<>
    <Head icon="sparkle" title="Cleaning" />
    <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
      {["Bedrooms", "Bathrooms", "Fresh linen & towels"].map((t) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: F.ui, fontSize: 28, fontWeight: 500, color: C.ink }}><Check k={0} size={36} />{t}</div>))}
    </div>
  </>);
  if (i === 3) return (<>
    <Head icon="wrench" title="Repair" tone={C.red} tint={C.redSoft} right={<span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 22, color: C.red, background: C.redSoft, padding: "8px 16px", borderRadius: 20 }}>Urgent</span>} />
    <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 40, color: C.ink, marginTop: 34 }}>Air-con not cooling</div>
    <div style={{ fontFamily: F.ui, fontSize: 24, color: C.muted, marginTop: 12 }}>Reported by guests · Bedroom 2</div>
  </>);
  const msgs = ["Where do we pick up the keys?", "Is there parking nearby?", "What's the Wi-Fi password?"];
  return (<>
    <Head icon="chat" title="Guest messages" right={<span style={{ width: 44, height: 44, borderRadius: 22, background: C.red, color: "#fff", fontFamily: F.ui, fontWeight: 700, fontSize: 24,
      display: "flex", alignItems: "center", justifyContent: "center" }}>{Math.min(3, 1 + Math.max(0, Math.floor((g - a - 6) / 5)))}</span>} />
    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      {msgs.map((m, k) => g >= a + 4 + k * 5 && (
        <div key={k} style={{ ...rise(clamp01((g - a - 4 - k * 5) / 10), 16), background: C.paleCool, borderRadius: "22px 22px 22px 6px", padding: "10px 20px",
          fontFamily: F.ui, fontSize: 24, fontWeight: 500, color: C.ink }}>{m}</div>))}
    </div>
  </>);
};

const Chore: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const a = choreAt(i);
  if (g < a) return null;
  // it leaves the swarm where its part is, and grows into a card on the pile
  const from = orbit(a, CHORE_PART[i]);
  const k = pr(g, a, 16, MOVE);
  const [sx, sy, rot] = SLOTS[i];
  // each later card pushes the pile down a little
  const later = [0, 1, 2, 3, 4].filter((j) => j > i).reduce((acc, j) => acc + pr(g, choreAt(j), 12, MOVE), 0);
  return (
    <div style={{ ...at(lerp(from.x, sx, k), lerp(from.y, sy, k) + 10 * later, lerp(0.22, 1 - 0.035 * later, k), clamp01((g - a) / 5), `rotate(${rot * k}deg)`) }}>
      <Card w={CHORE_W} h={CHORE_H} pad={38} style={{ filter: later > 0 ? `brightness(${1 - 0.03 * later})` : undefined }}><ChoreBody g={g} i={i} /></Card>
    </div>
  );
};

/** The cluster: the home card, the swarm and the pile; it shrinks onto Málaga on "You're miles away". */
const Cluster: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:one", -0.2), sk = shrinkK(g);
  const out = W("w:malaga", -0.12);
  if (g < a || g > out + 10) return null;
  const e = px(g, a, 20, 0.84);
  const homeX = lerp(960, 600, pr(g, W("w:bookings", -0.3), 22, MOVE));
  const sc = lerp(1, 0.12, sk);
  // the parts circle behind the home (nearer ones larger and stronger), so the home itself stays clear
  const parts = PARTS.map((_, i) => i).sort((p, q) => orbit(g, p).z - orbit(g, q).z);
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", opacity: 1 - clamp01((g - out) / 10),
      transform: `translate(${(MALAGA[0] - 960) * sk}px, ${(MALAGA[1] - 540) * sk}px) scale(${sc})` }}>
      <div style={{ opacity: 1 - sk }}>{parts.map((i) => <Part key={i} g={g} i={i} />)}</div>
      <div style={{ ...at(homeX, 540 + 50 * (1 - e), 0.94 + 0.06 * e, clamp01((g - a) / 8)), filter: e < 1 ? `blur(${8 * (1 - e)}px)` : undefined }}>
        <HomeCard w={HOME_W} h={HOME_H} />
      </div>
      {[0, 1, 2, 3, 4].map((i) => <Chore key={i} g={g} i={i} />)}
    </div>
  );
};

// ---- 3 you're miles away: the map ------------------------------------------------------------------------------------------
/** A point on the route's arc (the same curve maps.tsx draws), t 0..1 from Málaga to you. */
const onRoute = (t: number, arc = 0.22) => {
  const [x0, y0] = MALAGA, [x1, y1] = YOU, mx = (x0 + x1) / 2, my = (y0 + y1) / 2, len = Math.hypot(x1 - x0, y1 - y0);
  const nx = -(y1 - y0) / len, ny = (x1 - x0) / len, cx = mx + nx * len * arc, cy = my + ny * len * arc;
  return [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1];
};
/** While you're away the chores still find you: they travel up the route, one after another, until Málaga Hideaway comes in. */
const TRAVEL: [string, string][] = [["chat", "Guest message"], ["key", "Check-in"], ["wrench", "Repair"], ["calendar", "Booking"], ["sparkle", "Cleaning"],
  ["phone", "Call"], ["chat", "Guest message"], ["wrench", "Leak"], ["mail", "Post"], ["key", "Late arrival"]];
const Traveller: React.FC<{ g: number; i: number; icon: string; label: string }> = ({ g, i, icon, label }) => {
  const a = W("w:miles", 0.3) + i * 4, n = 34, stop = W("w:malaga", -0.12);
  if (g < a || a > stop) return null;
  const t = clamp01((g - a) / n);
  if (t >= 1) return null;
  const [x, y] = onRoute(0.1 + 0.78 * t);                          // evenly spaced, clear of both labels
  return (
    <div style={{ ...at(x, y, 1.05, Math.min(1, t * 6, (1 - t) * 6)) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 56, padding: "0 20px 0 10px", borderRadius: 28, background: C.white, boxShadow: SHADOW_SOFT,
        fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.ink, whiteSpace: "nowrap" }}>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: i % 3 === 1 ? C.terraSoft : C.bluePale, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={24} color={i % 3 === 1 ? C.terraDeep : C.blueDeep} stroke={2.3} /></div>{label}</div>
    </div>
  );
};
const MapScene: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:youre", -0.3), out = W("w:hideaway", 0.95);
  if (g < a || g > out) return null;
  // the map spreads out of Málaga like a wave (~1.7 s), the route stretches north and lands on you
  const rv = SOFT(clamp01((g - a) / 50));
  const route = pr(g, W("w:miles", -0.25), 26, (t) => t);
  const youK = pr(g, W("w:away", 0.1), 16);
  const pinK = pr(g, a + 18, 16);
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: rv < 1 ? `circle(${1440 * rv}px at ${MALAGA[0]}px ${MALAGA[1]}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, background: C.bluePale }} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${MALAGA[0]}px, ${MALAGA[1]}px) scale(${MAP_S}) translate(${-M0[0]}px, ${-M0[1]}px)` }}>
        <CountryMap data={MAP} land="#FFFDF8" landHi={C.sand} border={C.blueSoft} hl={pr(g, a + 10, 24)} />
      </div>
      <Route pts={[MALAGA, YOU]} k={route} color={C.navy} guide={rgba(C.navy, 0.28)} width={7} arc={0.22} />
      <Pin x={MALAGA[0]} y={MALAGA[1]} k={pinK} color={C.terra} size={30} />
      <div style={{ ...at(MALAGA[0] - 150, MALAGA[1] + 8, 1, pinK) }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 34, color: C.ink, background: C.white, padding: "8px 20px", borderRadius: 30, boxShadow: SHADOW_SOFT }}>Málaga</div></div>
      {TRAVEL.map(([icon, label], i) => <Traveller key={i} g={g} i={i} icon={icon} label={label} />)}
      <Pin x={YOU[0]} y={YOU[1]} k={youK} color={C.navy} size={30} />
      {youK > 0 && <div style={{ ...at(YOU[0] + 108, YOU[1], 1, clamp01(youK * 1.5)) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 700, fontSize: 34, color: "#fff", background: C.navy, padding: "8px 22px", borderRadius: 30 }}>
          <Icon name="phone" size={30} color="#fff" stroke={2.3} />You</div></div>}
    </div>
  );
};

// ---- 4 that's where Málaga Hideaway comes in -------------------------------------------------------------------------------
const LOGO_H = 200;
export const logoState = (g: number) => {
  const land = W("w:malaga", -0.12), fly = W("w:hideaway", -0.05), loc = W("w:one2", -0.25);
  const kL = pr(g, land, 14), kF = pr(g, fly, 26, MOVE), kC = pr(g, loc, 24, MOVE);
  let x = lerp(MALAGA[0], 960, kF), y = lerp(MALAGA[1], 520, kF), h = lerp(96 * kL, LOGO_H, kF);
  x = lerp(x, 300, kC); y = lerp(y, 985, kC); h = lerp(h, 70, kC);
  return { x, y, h, white: g >= fly + 2, word: pr(g, W("w:comes", -0.15), 20, MOVE), on: g >= land };
};
const BrandField: React.FC<{ g: number }> = ({ g }) => {
  const fly = W("w:hideaway", -0.05);
  if (g < fly || g > W("w:one2", 1.0)) return null;               // Málaga covers it by then
  return <Field g={g} a={fly} n={32} color={C.blue} x={MALAGA[0]} y={MALAGA[1]} />;
};
export const BrandLogo: React.FC<{ g: number }> = ({ g }) => {
  const st = logoState(g), out = W("w:we", -0.3);
  if (!st.on || g > out + 12) return null;
  // the word mark is centred with the house: centre the whole logo on x
  const mw = st.h * 996 / 924, ww = st.h * 0.84 * 2430 / 810, full = mw + st.h * 0.16 * st.word + ww * st.word;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${st.x - full / 2 + (st.word < 1 ? 0 : 0)}px, ${st.y - st.h / 2}px, 0)`, opacity: 1 - pr(g, out, 12, MOVE) }}>
      {st.h > 4 && <Logo h={st.h} white={st.white} word={st.word} />}
    </div>
  );
};

// ---- 5 one local partner: a circle opens out of the logo into Málaga ---------------------------------------------------------
export const localK = (g: number) => expoOut(30, 0.87)(clamp01((g - W("w:one2", -0.25)) / 30));
const Local: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:one2", -0.25), out = W("w:coordinate", -0.05) + 22;   // Málaga stays behind the list until the first service opens
  if (g < a || g > out) return null;
  const veil = pr(g, W("w:every", -0.25), 14, MOVE) * (1 - pr(g, W("w:we", -0.3), 20, MOVE));
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `circle(${2300 * localK(g)}px at 960px 520px)` }}>
      <Media src={MEDIA.malaga} from={a} loop={900} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, ${rgba(C.navy, 0.55)} 0%, ${rgba(C.navy, 0.0)} 34%)`, opacity: 1 - pr(g, W("w:we", -0.3), 20, MOVE) }} />
      <div style={{ position: "absolute", inset: 0, background: rgba(C.navy, 0.32 * veil) }} />
      {g >= W("w:local", -0.1) && <Place x={1600} y={985} k={pr(g, W("w:local", -0.1), 14)}>
        <Chip icon="pin" text="Málaga, Costa del Sol" tone="terra" size={28} /></Place>}
    </div>
  );
};

// ---- 6 every detail taken care of: the chores come back as one list and are checked off ------------------------------------
export const CHORES: [string, string][] = [["calendar", "Bookings"], ["key", "Check-ins"], ["sparkle", "Cleaning"], ["wrench", "Repairs"], ["chat", "Guest messages"]];
const Handled: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:every", -0.3), out = W("w:we", -0.3);
  if (g < a || g > out + 10) return null;
  const e = px(g, a, 20, 0.84);
  // on "We manage" it travels to the list's place and hands over to the service list (they cross-fade in step)
  return (
    <div style={{ ...at(lerp(960, LIST.x, toList(g)), 540 + 60 * (1 - e), 1, clamp01((g - a) / 8) * (1 - clamp01((g - out) / 8))), filter: e < 1 ? `blur(${6 * (1 - e)}px)` : undefined }}>
      <Card w={720} pad={44}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo h={54} word={0} />
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 36, color: C.ink }}>Taken care of</div>
        </div>
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 8 }}>
          {CHORES.map(([icon, t], i) => {
            const ck = pr(g, W("w:every", 0.05) + i * 7, 10);
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 20, height: 72, padding: "0 18px", borderRadius: 18, background: ck > 0.5 ? C.greenSoft : C.page }}>
                <Icon name={icon} size={36} color={C.blueDeep} stroke={2.2} />
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: C.ink, flex: 1 }}>{t}</span>
                <Check k={ck} size={42} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export const SceneA: React.FC<{ g: number }> = ({ g }) => (
  <>
    <MapScene g={g} />
    <Cluster g={g} />
    <BrandField g={g} />
    <Local g={g} />
    <Handled g={g} />
  </>
);
export { HOME_W, HOME_H, ARRIVE, pxi };
