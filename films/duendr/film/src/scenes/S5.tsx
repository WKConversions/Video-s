// S5 "Find local gigs, discover collaborators," 11.5-14.6. The gig deck flips forward card by card, then the people list; Nadia lifts out
// with her clip and "Let's collab" pops; the map (S6) grows out of that pill.
import React from "react";
import { Media, Rise, C, INOUT, c01, k, mix, sp } from "../kit";
import { Freeze } from "remotion";
import { GigCard, PersonRow, Pill, Ico, Person } from "../ui";
import { Scene } from "./types";
import { DECK_FROM, DECK_Y, GIGS, Seq, deckScale } from "./b2-shared";

export const PEOPLE: Person[] = [
  { name: "Nadia Vega", roles: "Dancer, Choreographer", city: "Málaga", avatar: "img/avatars/nadia.jpg", badge: "founding" },
  { name: "Mateo Ruiz", roles: "Videographer, Photographer", city: "Marbella", avatar: "img/avatars/mateo.jpg", badge: "verified", avail: "Weekends" },
  { name: "Inés Navarro", roles: "Designer, Illustrator", city: "Nerja", badge: "verified" },
];
const SC = 2.1, SPL = 2.94, PT = 250, CT = 230, CLIP_H = 180, CARD_H = 16 + 64 + 12 + CLIP_H + 12 + 44 + 16;
export const PILL_Y = CT + (16 + 64 + 12 + CLIP_H + 12 + 22) * SC; // ~873: where the map grows from

const Deck: React.FC<{ t: number }> = ({ t }) => {
  const P = k(t, 12.0, 0.45, INOUT) + k(t, 12.32, 0.45, INOUT) + k(t, 12.98, 0.45, INOUT);
  const peek = sp(t, 11.84, 1.8, 0.75);
  const s = deckScale(t);
  return (
    <div style={{ position: "absolute", left: 738, top: 0, width: 444, height: 0, transform: `translateY(${DECK_Y}px) scale(${s})`, transformOrigin: "50% 0" }}>
      {[2, 1, 0].map((i) => {
        const d = i - P; if (d < -1.02) return null;
        const dd = Math.max(0, d) * (i === 0 ? 1 : peek) ; const fl = c01(-d);
        const behind = d > 0;
        const tr = behind ? `translateY(-50%) translateY(${dd * 34}px) scale(${1 - 0.07 * dd})` : `translateY(-50%) perspective(2400px) rotateX(${fl * 90}deg)`;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, zIndex: 10 - i, transform: tr, transformOrigin: behind ? "50% 100%" : "50% 0%", opacity: 1 - c01((fl - 0.8) / 0.2) }}>
            <Seq from={DECK_FROM}><Freeze frame={Math.round(([12.0, 12.32, 12.98][i] - DECK_FROM) * 60)} active={fl > 0}><GigCard g={GIGS[i]} /></Freeze></Seq>
            {behind && <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: `rgba(22,20,19,${Math.min(0.7, 0.3 * dd + 0.1)})` }} />}
          </div>
        );
      })}
    </div>
  );
};

const People: React.FC<{ t: number }> = ({ t }) => {
  const lift = k(t, 13.62, 0.45, INOUT), rev = k(t, 13.64, 0.42, INOUT), pill = sp(t, 14.0, 1.8, 0.6), pin = sp(t, 13.04, 1.8, 0.75);
  const out = k(t, 14.5, 0.12), sP = mix(SPL, SC, lift), mv = pin < 0.999 || lift < 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 - 0.03 * out})`, transformOrigin: "50% 80%" }}>
      <div style={{ position: "absolute", left: 960 - 238, top: PT, width: 476, transform: `translateY(${50 * lift}px) scale(${sP * (0.92 + 0.08 * pin)})`, transformOrigin: "50% 0", willChange: mv ? "transform" : undefined, opacity: c01(pin * 2) * (1 - 0.8 * lift) }}>
        <div style={{ width: 476, boxSizing: "border-box", borderRadius: 20, background: C.card, border: `1px solid ${C.border}`, padding: 16, overflow: "hidden", boxShadow: "0 0 30px rgba(0,0,0,0.35), 0 0 90px rgba(0,0,0,0.4)" }}>
          {PEOPLE.map((p, i) => { const q = sp(t, 13.06 + i * 0.12, 1.8, 0.75);
            return <div key={p.name} style={{ transform: `translateY(${(1 - q) * 24}px)`, opacity: i === 0 && t > 13.62 ? 0 : c01(q * 2), borderBottom: i < 2 ? `1px solid ${C.border}` : "none", height: 64, boxSizing: "border-box", display: "flex", alignItems: "center" }}><PersonRow p={p} w={444} /></div>; })}
        </div>
      </div>
      {t >= 13.62 && <div style={{ position: "absolute", left: 960 - 238, top: PT, width: 476, transform: `translateY(${(CT - PT) * lift}px) scale(${sP})`, transformOrigin: "50% 0", willChange: lift < 1 ? "transform" : undefined, filter: "drop-shadow(0 0 30px rgba(0,0,0,0.45))" }}>
        <div style={{ width: 476, boxSizing: "border-box", borderRadius: 20, background: C.card, border: `1px solid ${C.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, clipPath: `inset(0px 0px ${(CARD_H - 96) * (1 - rev)}px 0px round 20px)` }}>
          <PersonRow p={{ ...PEOPLE[0] }} w={444} />
          <Seq from={13.6}><Media src="clips/dance-graffiti.mp4" w={444} h={CLIP_H} r={12} shadow="none" zoom={1.04} /></Seq>
          <div style={{ transform: `scale(${pill})`, opacity: c01(pill * 3) }}><Pill label="Let's collab" w="100%" h={44} size={16} icon={<Ico n="arrow" s={16} w={2.2} />} /></div>
        </div>
      </div>}
    </div>
  );
};

const Body: React.FC<{ t: number }> = ({ t }) => {
  const h1out = k(t, 12.86, 0.18), deckOut = 1 - k(t, 14.3, 0.3);
  return (
    <>
      {t >= 12.98 && <People t={t} />}
      <div style={{ position: "absolute", inset: 0, opacity: deckOut }}><Deck t={t} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 48, display: "flex", justifyContent: "center", opacity: 1 - k(t, 14.3, 0.3) }}>
        {t < 13.3 && <Rise text="Find local gigs," t={t} at={11.84} times={[11.84, 12.02, 12.3]} size={100} out={h1out} colors={[undefined, undefined, C.coral]} />}
        {t >= 12.9 && <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", justifyContent: "center" }}><Rise text="discover collaborators," t={t} at={13.04} times={[13.04, 13.38]} size={100} colors={[undefined, C.coral]} /></div>}
      </div>
    </>
  );
};
export const S5: Scene = { id: "S5", t0: 11.5, t1: 14.6, C: ({ t }) => <div style={{ position: "absolute", inset: 0 }}><Body t={t} /></div> };
