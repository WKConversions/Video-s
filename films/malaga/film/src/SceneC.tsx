// Part C, 29.8–46 s: clear agreements (the list becomes the agreement), personal communication (the window becomes your
// phone), services tailored to your home, always in the loop; less to manage (everything folds into one line), more
// freedom (the home, enjoyed); the sign-off: the logo, your home in good hands, request your proposal.
import React from "react";
import { C, F, MOVE, W, at, clamp01, expoOut, lerp, pr, rgba } from "./lib";
import { Icon } from "./icons";
import { Card, Check, Chip, HomeCard, Logo, MEDIA, Media, Place, Switch, Words, rise } from "./shared";
import { LIST, bEnd } from "./SceneB";

const AG = { x: 600, y: 540, w: 700 };
const PH = { x: 1330, y: 540, w: 430, h: 860 };
const foldA = () => W("w:less", -0.2);                              // everything folds into one line
const k0 = (g: number) => pr(g, bEnd() + 8, 24, MOVE);              // the list card becomes the agreement, then widens

// ---- the agreement card (left): agreement, then the services tailored to your home ---------------------------------------
const Agreement: React.FC<{ g: number }> = ({ g }) => {
  const a = bEnd(), fold = foldA();
  if (g < a || g > fold + 16) return null;
  const k = k0(g), f = pr(g, fold, 16, MOVE);
  const tl = pr(g, W("w:and3", -0.15), 16, MOVE);                   // the agreement turns into the services
  const ag = pr(g, a + 2, 10, MOVE);                                // its content fades in as the list's fades out above it
  const sign = clamp01((g - W("w:agreements", -0.05)) / 18);
  return (
    <div style={{ ...at(lerp(lerp(LIST.x, AG.x, k), 960, f), lerp(AG.y, 540, f), lerp(1, 0.25, f), 1 - f) }}>
      <Card w={lerp(LIST.w, AG.w, k)} pad={46} style={{ height: 600 }}>
        <div style={{ position: "absolute", inset: 46, opacity: ag * (1 - tl), transform: `translateY(${-20 * tl}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 62, height: 62, borderRadius: 18, background: C.bluePale, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="pen" size={36} color={C.blueDeep} stroke={2.2} /></div>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 36, color: C.ink }}>Management agreement</div>
          </div>
          {["Commission-based", "Transparent prices", "Use your home whenever you like"].map((t, i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: i ? 20 : 40, fontFamily: F.ui, fontWeight: 500, fontSize: 31, color: C.ink, ...rise(pr(g, W("w:clear", -0.15) + i * 5, 12), 14) }}>
              <Check k={pr(g, W("w:clear", -0.05) + i * 5, 10)} size={38} />{t}</div>))}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, borderTop: `2px solid ${C.line}`, paddingTop: 14, display: "flex", alignItems: "flex-end", gap: 20 }}>
            <svg width={300} height={80} viewBox="0 0 300 80">
              <path d="M10 58c18-30 34-44 40-30s-12 34 4 30 22-40 40-38-2 36 14 34 16-26 30-24 4 22 20 20 20-18 36-16 30 10 70 2" fill="none" stroke={C.navy} strokeWidth={4}
                strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - MOVE(sign)} />
            </svg>
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: sign >= 1 ? C.green : C.faint, marginBottom: 12 }}>{sign >= 1 ? "Signed" : "Signature"}</span>
          </div>
        </div>
        {tl > 0 && <div style={{ position: "absolute", inset: 46, opacity: tl, transform: `translateY(${20 * (1 - tl)}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 90, height: 66, borderRadius: 14, overflow: "hidden" }}><Media src={MEDIA.home} pos="50% 60%" /></div>
            <div>
              <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 34, color: C.ink }}>Your services</div>
              <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 24, color: C.muted }}>tailored to your home</div>
            </div>
          </div>
          {([["Rental management", 1], ["Cleaning & laundry", 1], ["Maintenance & repairs", 1], ["Keyholding", 0]] as [string, number][]).map(([t, on], i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: i ? 14 : 34, height: 78, padding: "0 22px", borderRadius: 20, background: C.page }}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.ink, flex: 1 }}>{t}</span>
              <Switch on={on * pr(g, W("w:services2", 0.0) + i * 7, 10, MOVE)} w={80} />
            </div>))}
        </div>}
      </Card>
    </div>
  );
};

// ---- the phone (right): the window becomes your phone; a personal message; then updates, always in the loop ---------------
const Phone: React.FC<{ g: number }> = ({ g }) => {
  const a = bEnd(), fold = foldA();
  if (g < a || g > fold + 16) return null;
  const k = pr(g, a + 4, 22, MOVE), f = pr(g, fold, 16, MOVE);
  const w = PH.w, h = PH.h;
  const loop = pr(g, W("w:youre3", -0.2), 14, MOVE);
  const m1 = W("w:personal", -0.15), m2 = W("w:communication", 0.25);
  return (
    <div style={{ ...at(lerp(PH.x, 960, f), lerp(PH.y + 300 * (1 - k), 540, f), lerp(1, 0.25, f), clamp01((g - a - 4) / 8) * (1 - f)) }}>
      <div style={{ width: w, height: h, borderRadius: 64, background: C.navy, padding: 14, boxSizing: "border-box", boxShadow: "0 50px 90px -40px rgba(17,35,55,0.55)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 52, overflow: "hidden", position: "relative", background: C.page }}>
          {/* the chat */}
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${-160 * loop}px)` }}>
            <div style={{ height: 120, background: C.white, display: "flex", alignItems: "center", gap: 14, padding: "20px 24px 0", boxSizing: "border-box", borderBottom: `1.5px solid ${C.line}` }}>
              <div style={{ width: 62, height: 62, borderRadius: 31, background: C.bluePale, display: "flex", alignItems: "center", justifyContent: "center" }}><Logo h={36} word={0} /></div>
              <div><div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 25, color: C.ink }}>Málaga Hideaway</div>
                <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 19, color: C.green }}>online</div></div>
            </div>
            {g >= m1 && <div style={{ position: "absolute", left: 20, top: 150, width: 330, ...rise(pr(g, m1, 14), 24) }}>
              <div style={{ background: C.white, borderRadius: "26px 26px 26px 8px", padding: 10, boxShadow: "0 8px 20px -12px rgba(17,35,55,0.3)" }}>
                <div style={{ height: 200, borderRadius: 18, overflow: "hidden" }}><Media src={MEDIA.terrace} /></div>
                <div style={{ fontFamily: F.ui, fontSize: 22, fontWeight: 500, color: C.ink, padding: "12px 10px 6px", lineHeight: 1.35 }}>All checked at the house today. Everything looks great!</div>
              </div></div>}
            {g >= m2 && <div style={{ position: "absolute", right: 20, top: 520, ...rise(pr(g, m2, 14), 24) }}>
              <div style={{ background: C.blue, color: "#fff", borderRadius: "26px 26px 8px 26px", padding: "14px 22px", fontFamily: F.ui, fontSize: 22, fontWeight: 600 }}>Thank you, perfect!</div></div>}
          </div>
          {/* always in the loop: updates arrive one after another */}
          {loop > 0 && <div style={{ position: "absolute", inset: 0, background: rgba(C.navy, 0.88 * loop) }}>
            <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontFamily: F.ui, fontWeight: 300, fontSize: 84, color: "#fff", opacity: loop }}>09:41</div>
            {([["suitcase", "Guests checked in", "Sat 15:12"], ["sparkle", "Cleaning done", "fresh linen & towels"], ["wrench", "Repair finished", "air-con"], ["camera", "New report", "photos & updates"]] as [string, string, string][]).map(([ic, t, s], i) => {
              const a0 = W("w:youre3", 0.0) + i * 6;
              if (g < a0) return null;
              const e = pr(g, a0, 12, MOVE);
              const later = [1, 2, 3].filter((j) => j > i).reduce((acc, j) => acc + pr(g, W("w:youre3", 0.0) + j * 6, 12, MOVE), 0);
              return (
                <div key={t} style={{ position: "absolute", left: 18, right: 18, top: 220 + 110 * (3 - i) - 110 * (3 - i) * 0 + 0 * later, opacity: clamp01(e * 2),
                  transform: `translateY(${-40 * (1 - e)}px)` }}>
                  <div style={{ background: rgba("#FFFFFF", 0.95), borderRadius: 24, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: C.bluePale, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                      <Icon name={ic} size={30} color={C.blueDeep} stroke={2.2} /></div>
                    <div><div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 22, color: C.ink }}>{t}</div>
                      <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 18, color: C.muted }}>{s}</div></div>
                  </div>
                </div>
              );
            })}
          </div>}
        </div>
      </div>
    </div>
  );
};

// ---- the owner, at home far away, in the loop (full frame behind the agreement and the phone) ---------------------------------
const OwnerBack: React.FC<{ g: number }> = ({ g }) => {
  const a = bEnd(), out = free0() + 32;
  if (g < a || g > out) return null;
  const r = 2300 * MOVE(clamp01((g - a) / 22));
  const veil = pr(g, foldA(), 14, MOVE);
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: r < 2290 ? `circle(${r}px at ${LIST.x}px 540px)` : undefined }}>
      <Media src={MEDIA.owner} from={a} skip={2} loop={900} />
      {/* a soft light veil: the owner's world stays calm behind the cards */}
      <div style={{ position: "absolute", inset: 0, background: rgba(C.page, 0.3 * (1 - veil)) }} />
      <div style={{ position: "absolute", inset: 0, background: rgba(C.navy, 0.38 * veil) }} />
    </div>
  );
};

// ---- less to manage: one quiet line; more freedom: the home, enjoyed ----------------------------------------------------------
const free0 = () => W("w:more", -0.2);
const Less: React.FC<{ g: number }> = ({ g }) => {
  const a = foldA() + 8, out = free0() + 30;
  if (g < a || g > out) return null;
  return (
    <Place x={960} y={540} k={pr(g, a, 14)} d={20}>
      <Chip icon="check" text="All taken care of" tone="green" size={40} />
    </Place>
  );
};
const freeK = (g: number) => expoOut(30, 0.87)(clamp01((g - free0()) / 30));
const END = () => W("w:malaga2", -0.75);                             // the footage closes into the home card
const endK = (g: number) => pr(g, END(), 26, MOVE);
const CARD = { x: 600, y: 540, w: 640, h: 760 };
const Freedom: React.FC<{ g: number }> = ({ g }) => {
  const a = free0();
  if (g < a) return null;
  const k = endK(g);
  const L = lerp(0, CARD.x - CARD.w / 2, k), T0 = lerp(0, CARD.y - CARD.h / 2, k), Wd = lerp(1920, CARD.w, k), H = lerp(1080, CARD.h, k);
  const home = pr(g, W("w:your4", -0.1), 16, MOVE);
  const hands = W("w:hands", -0.15);
  return (
    <div style={{ position: "absolute", left: L, top: T0, width: Wd, height: H, borderRadius: lerp(0, 38, k), overflow: "hidden",
      clipPath: k > 0 ? undefined : `circle(${2300 * freeK(g)}px at 960px 540px)`, boxShadow: k > 0.5 ? "0 50px 90px -40px rgba(17,35,55,0.4)" : undefined }}>
      <Media src={MEDIA.freedom} from={a} skip={2.5} loop={900} />
      {home > 0 && <div style={{ position: "absolute", inset: 0, opacity: home }}><HomeCard w={Wd} h={H} label="" style={{ borderRadius: 0, boxShadow: "none" }} /></div>}
      {g >= hands && <div style={{ position: "absolute", left: 28, top: 28, ...rise(pr(g, hands, 14), 18) }}><Chip icon="shield" text="In good hands" tone="green" size={30} /></div>}
    </div>
  );
};

// ---- the sign-off ---------------------------------------------------------------------------------------------------------------
const SignOff: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:malaga2", -0.02);
  if (g < a) return null;
  const e = pr(g, a, 20);
  const btn = W("w:request", -0.15);
  return (
    <>
      <div style={{ ...at(1340, 330 + 30 * (1 - e), 1, clamp01((g - a) / 9)), filter: e < 1 ? `blur(${6 * (1 - e)}px)` : undefined }}><Logo h={130} /></div>
      <Words g={g} size={58} x={1340} y={540} words={[{ t: "Your", f: W("w:your4", -0.1) }, { t: "home", f: W("w:home2", -0.1) }, { t: "in", f: W("w:in3", -0.1) }, { t: "Málaga,", f: W("w:malaga3", -0.1) }]} />
      <Words g={g} size={58} x={1340} y={622} words={[{ t: "in", f: W("w:in4", -0.1) }, { t: "good", f: W("w:good", -0.1) }, { t: "hands.", f: W("w:hands", -0.1), color: C.blue }]} />
      {g >= btn && <Place x={1340} y={790} k={pr(g, btn, 16)}>
        <div style={{ height: 96, padding: "0 46px", borderRadius: 48, background: C.blue, color: "#fff", fontFamily: F.ui, fontWeight: 700, fontSize: 34, display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 24px 50px -24px rgba(0,144,218,0.7)" }}>Request your proposal<Icon name="arrowUp" size={34} color="#fff" stroke={2.6} style={{ transform: "rotate(90deg)" }} /></div></Place>}
      {g >= btn + 8 && <Place x={1340} y={896} k={pr(g, btn + 8, 14)} d={16}>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.muted }}>malagahideaway.com</div></Place>}
    </>
  );
};

export { OwnerBack, Agreement, Phone, Less, Freedom, SignOff };
export const fieldsC = { foldA, free0, END };
