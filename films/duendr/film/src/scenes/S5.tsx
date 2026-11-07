// S5 "Find local gigs, discover collaborators," 11.5-14.6. The gig deck flips forward card by card, then the people list; Nadia lifts out
// with her clip and "Let's collab" pops; the map (S6) grows out of that pill.
import React from "react";
import { Media, Rise, C, INOUT, SHADOW, SOFT, c01, k, mix, sp } from "../kit";
import { GigCard, PersonRow, Pill, Ico, Person } from "../ui";
import { Scene } from "./types";
import { DECK_Y, GIGS, Seq } from "./b2-shared";

export const PEOPLE: Person[] = [
  { name: "Nadia Vega", roles: "Dancer, Choreographer", city: "Málaga", avatar: "img/avatars/nadia.jpg", badge: "founding" },
  { name: "Mateo Ruiz", roles: "Videographer, Photographer", city: "Marbella", avatar: "img/avatars/mateo.jpg", badge: "verified", avail: "Weekends" },
  { name: "Inés Navarro", roles: "Designer, Illustrator", city: "Nerja", badge: "verified" },
];
const SC = 2.1, CT = 230, CLIP_H = 180;
export const PILL_Y = CT + (16 + 64 + 12 + CLIP_H + 12 + 22) * SC; // ~873: where the map grows from

const Fan: React.FC<{ t: number }> = ({ t }) => {
  const sink = k(t, 12.92, 0.4, INOUT), f = k(t, 11.85, 0.5), drift = k(t, 11.9, 1.3, SOFT);
  if (sink >= 1) return null;
  // 0 = top card (centre), 1 = left, 2 = right
  const cards = [0, 1, 2].map((i) => {
    const side = i === 0 ? 0 : i === 1 ? -1 : 1, r = k(t, 11.55 + (i ? 0.07 : 0), 0.5);
    const dx = side * mix(0, 590, f) + side * 14 * drift, s = (i === 0 ? 1.7 : mix(1.6, 1.3, f)) * (1 + 0.035 * drift) * (1 - 0.1 * sink);
    const y = DECK_Y + (1 - r) * 420 + 240 * sink + (i === 0 ? 0 : -14 * drift);
    return { i, side, dx, s, y, rot: -side * 20 * f, op: c01(r * 2.5) * (1 - c01((sink - 0.5) / 0.5)) };
  });
  return (
    <>
      {[1, 2, 0].map((i) => { const c = cards[i];
        return (
          <div key={i} style={{ position: "absolute", left: 738, top: 0, width: 444, height: 0, zIndex: i === 0 ? 5 : 1, transform: `translate(${c.dx}px, ${c.y}px) scale(${c.s})`, transformOrigin: "50% 0", opacity: c.op, willChange: "transform" }}>
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(-50%) perspective(2400px) rotateY(${c.rot}deg)`, boxShadow: SHADOW, borderRadius: 16 }}>
              <Seq from={11.5}><GigCard g={GIGS[i]} /></Seq>
              {i !== 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "rgba(22,20,19,0.32)" }} />}
            </div>
          </div>
        ); })}
    </>
  );
};

const Mini: React.FC<{ p: Person; clip: string; from: number }> = ({ p, clip, from }) => (
  <div style={{ width: 476, boxSizing: "border-box", borderRadius: 20, background: C.card, border: `1px solid ${C.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxShadow: SHADOW }}>
    <PersonRow p={p} w={444} />
    <Seq from={from}><Media src={clip} w={444} h={CLIP_H} r={12} shadow="none" zoom={1.04} /></Seq>
  </div>
);

const People: React.FC<{ t: number }> = ({ t }) => {
  const rise = k(t, 13.0, 0.5), pill = sp(t, 13.85, 1.8, 0.6), out = k(t, 14.5, 0.12);
  const sideOut = k(t, 14.0, 0.28, INOUT), mv = rise < 1;
  const SIDES = [{ p: PEOPLE[1], clip: "clips/photog-lens.mp4", side: -1 }, { p: PEOPLE[2], clip: "clips/design-tablet.mp4", side: 1 }];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 - 0.03 * out})`, transformOrigin: "50% 80%" }}>
      {SIDES.map(({ p, clip, side }, j) => { const r = k(t, 13.1 + j * 0.05, 0.5);
        return <div key={p.name} style={{ position: "absolute", left: 960 - 238, top: CT + 120, width: 476, zIndex: 1, opacity: c01(r * 2.5) * (1 - sideOut), willChange: "transform",
          transform: `translate(${side * 610}px, ${(1 - r) * 400 + 140 * sideOut}px) scale(${1.4 * (1 - 0.08 * sideOut)}) perspective(2400px) rotateY(${-side * 20}deg)`, transformOrigin: "50% 0" }}>
          <Mini p={p} clip={clip} from={13.1} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "rgba(22,20,19,0.3)" }} />
        </div>; })}
      <div style={{ position: "absolute", left: 960 - 238, top: CT, width: 476, zIndex: 5, transform: `translateY(${(1 - rise) * 420}px) scale(${SC * (0.88 + 0.12 * rise)})`, transformOrigin: "50% 0", willChange: mv ? "transform" : undefined, opacity: c01(rise * 2.5), filter: "drop-shadow(0 0 30px rgba(0,0,0,0.45))" }}>
        <div style={{ width: 476, boxSizing: "border-box", borderRadius: 20, background: C.card, border: `1px solid ${C.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <PersonRow p={{ ...PEOPLE[0] }} w={444} />
          <Seq from={13.1}><Media src="clips/dance-graffiti.mp4" w={444} h={CLIP_H} r={12} shadow="none" zoom={1.04} /></Seq>
          <div style={{ transform: `scale(${pill})`, opacity: c01(pill * 3) }}><Pill label="Let's collab" w="100%" h={44} size={16} icon={<Ico n="arrow" s={16} w={2.2} />} /></div>
        </div>
      </div>
    </div>
  );
};

const Body: React.FC<{ t: number }> = ({ t }) => {
  const h1out = k(t, 12.86, 0.18);
  return (
    <>
      {t >= 12.98 && <People t={t} />}
      {t < 13.4 && t >= 11.5 && <div style={{ position: "absolute", inset: 0 }}><Fan t={t} /></div>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 48, display: "flex", justifyContent: "center", opacity: 1 - k(t, 14.3, 0.3), zIndex: 9 }}>
        {t < 13.3 && <Rise text="Find local gigs," t={t} at={11.84} times={[11.84, 12.02, 12.3]} size={100} out={h1out} colors={[undefined, undefined, C.coral]} />}
        {t >= 12.9 && <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", justifyContent: "center" }}><Rise text="discover collaborators," t={t} at={13.04} times={[13.04, 13.38]} size={100} colors={[undefined, C.coral]} /></div>}
      </div>
    </>
  );
};
export const S5: Scene = { id: "S5", t0: 11.4, t1: 14.6, C: ({ t }) => <div style={{ position: "absolute", inset: 0 }}><Body t={t} /></div> };
