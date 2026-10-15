// Film 2, for companies: "No cost until someone is hired." 40 s, no voice-over. The thread object is the role: one
// sentence becomes a job ad, the ad a marketplace assignment that specialist recruiters work in parallel, the
// assignment a pipeline, the pipeline a hire, and only the hire an invoice.
import React from "react";
import { AbsoluteFill, Img, interpolateColors } from "remotion";
import { C, F, MOVE, SHADOW, SOFT, clamp01, lerp, tw } from "./tokens";
import { AppShell, Avatar, Button, CandidateCard, Chip, Cursor, Headline, Icon, JobCard, Kicker, Page, Stars, img, sek, typed, words } from "./ui";

const s = (x: number) => Math.round(x * 30);
export const K = {
  hook: 0, turn: s(2.6), post: s(5.0), ad: s(10.2), reward: s(14.8), match: s(19.6), pipe: s(24.4), hire: s(29.4), cta: s(34.0), end: s(40),
};
const NAV = [{ icon: "home", label: "Create job ad", on: true }, { icon: "kanban", label: "Pipeline" }, { icon: "briefcase", label: "Jobs" }];
const SENTENCE = "We're hiring an Account Executive for our SaaS team in Stockholm, hybrid, 3-5 years of B2B sales.";
const CRIT: [string, number][] = [["Role name", 32], ["Seniority", 84], ["Education", 999], ["Location", 66], ["Industry", 45], ["Skills", 96], ["Company", 51]];
// the app window: drawn at 1500×880; centred and large for the sentence, then moved right for the ad and the reward
const APP_W = 1500, APP_H = 880;
// measured from stills: the congrats modal's height, the centre of the end card's "Start hiring" button
const MODAL_H = 620, CTA_BTN_CY = 650;

const Pills: React.FC<{ g: number; items: [string, string][] }> = ({ g, items }) => {
  const out = tw(g, K.turn - 12, K.turn + 8, SOFT);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 490, display: "flex", justifyContent: "center", gap: 30 }}>
      {items.map(([icon, t], i) => {
        const k = tw(g, 6 + i * 10, 22 + i * 10), strike = tw(g, 44 + i * 6, 56 + i * 6, MOVE);
        return (
          <div key={i} style={{ position: "relative", opacity: k * (1 - out), transform: `translateY(${(1 - k) * 30 + out * 60}px) scale(${lerp(0.92, 1, k)}) rotate(${out * (i - 1) * 4}deg)` }}>
            <Chip icon={icon} tone="white" size={44} style={{ padding: "22px 36px", boxShadow: SHADOW.card, color: interpolateColors(strike, [0.3, 0.7], [C.ink, C.faint]) }}>{t}</Chip>
            <div style={{ position: "absolute", left: 18, top: "50%", height: 4, borderRadius: 2, background: C.ink, width: `calc(${strike * 100}% - 36px)` }} />
          </div>
        );
      })}
    </div>
  );
};

const RECRUITERS = [
  { ini: "AB", name: "Arthur Berg", tone: 2 },
  { ini: "MH", name: "Maja Holm", tone: 3 },
  { ini: "EL", name: "Erik Lund", tone: 4 },
  { ini: "SN", name: "Sara Nyström", tone: 1 },
];
const CANDS = [
  { name: "Oskar Vinge", ini: "OV", tone: 0, ai: 8, stars: 4 },
  { name: "Linnea Bäck", ini: "LB", tone: 3, ai: 7, stars: 3 },
  { name: "Jonas Ek", ini: "JE", tone: 4, ai: 7, stars: 0 },
  { name: "Ida Sjöberg", ini: "IS", tone: 2, ai: 6, stars: 0 },
];

export const Companies: React.FC<{ g: number }> = ({ g }) => {
  // the camera only breathes; rotate(0.02deg) keeps sub-pixel vertical drift smooth instead of snapping to whole pixels
  const camX = 5 * Math.sin(g / 70), camY = 3 * Math.cos(g / 85), camS = 1.006 + 0.004 * Math.sin(g / 120);
  const cam = `translate(${camX}px, ${camY}px) scale(${camS}) rotate(0.02deg)`;
  // a point inside the camera container, on screen (origin = frame centre): o + t + s(p - o)
  const onScreen = (x: number, y: number) => ({ x: 960 + camX + camS * (x - 960), y: 540 + camY + camS * (y - 540) });
  // ----- the app: centred for the sentence, moved right for the ad and the reward, folded into a card for the match
  const appIn = tw(g, K.post - 12, K.post + 14);
  const morph = tw(g, K.post - 16, K.post + 2, MOVE), question = tw(g, K.post - 2, K.post + 6, SOFT);
  const side = tw(g, K.ad + 2, K.ad + 26, MOVE);
  const fold = tw(g, K.match - 2, K.match + 18, MOVE);
  // the job card's content appears inside the folded frame; the frame stays under it until the card is opaque
  // (eased in and out, so its first frames are faint while the frame lands, and there is no jump in opacity)
  const jobK = tw(g, K.match + 12, K.match + 26, SOFT);
  const sc = lerp(0.92, 0.74, side), ax = lerp((1920 - APP_W * 0.92) / 2, 760, side), ay = lerp(150, 214, side);
  // while folding, the window's own drop shadow and border (clipped from then on) are carried by the frame and eased into the card's
  const fl = (a: number, b: number) => lerp(a, b, fold);
  const foldBw = fl(1.5 * sc, 1.5);
  const foldShadow = `0 ${fl(2 * sc, 1)}px ${fl(6 * sc, 2)}px rgba(28,25,23,${fl(0.05, 0.04) * (1 - jobK)}), 0 ${fl(40 * sc, 12)}px ${fl(90 * sc, 32)}px ${fl(-30 * sc, -12)}px rgba(28,25,23,${fl(0.32, 0.16) * (1 - jobK)})`;
  const L = (lx: number, ly: number) => ({ x: ax + sc * lx, y: ay + sc * ly });
  const typeEnd = K.ad - 22;
  const n = Math.round(SENTENCE.length * clamp01((g - (K.post + 22)) / (typeEnd - (K.post + 22))));
  const ticked = CRIT.filter(([, at]) => n >= at).length;
  const send = tw(g, K.ad - 6, K.ad + 2, SOFT);
  const adK = tw(g, K.ad + 8, K.ad + 24);
  const pub = tw(g, K.reward - 4, K.reward + 14, MOVE);
  // the ad leaves first, then the publishing page arrives (no double exposure)
  const adOut = tw(g, K.reward - 6, K.reward + 2, SOFT), pubIn = tw(g, K.reward + 2, K.reward + 16);
  const rewardHi = tw(g, K.reward + 16, K.reward + 30);
  const days = g >= K.reward + 50;
  const verify = tw(g, K.reward + 104, K.reward + 112, SOFT);
  const sent = tw(g, K.reward + 114, K.reward + 128);
  // ----- the match
  const CARD = { x: 218, y: 300, w: 1485, h: 268 }; // h measured from a still (JobCard at fs 1.35)
  const rec = RECRUITERS.map((_, i) => tw(g, K.match + 24 + i * 9, K.match + 44 + i * 9));
  const lines = RECRUITERS.map((_, i) => tw(g, K.match + 34 + i * 9, K.match + 54 + i * 9, MOVE));
  const matchOut = tw(g, K.pipe - 14, K.pipe + 2, MOVE);
  // ----- the pipeline: it grows out of the recruiters, each one hands over a candidate
  const board = tw(g, K.pipe + 2, K.pipe + 22);
  const drop = CANDS.map((_, i) => tw(g, K.pipe + 16 + i * 8, K.pipe + 34 + i * 8));
  const mv1 = tw(g, K.pipe + 56, K.pipe + 76, MOVE), mv0 = tw(g, K.pipe + 72, K.pipe + 92, MOVE);
  const drawer = tw(g, K.pipe + 96, K.pipe + 118, MOVE);
  const rating = tw(g, K.pipe + 120, K.pipe + 140, SOFT);
  const ratedStars = [0, 1, 2, 3].filter((i) => clamp01(rating * 4 - i) > 0.5).length;
  const hiredSt = g >= K.hire + 12;
  const modal = tw(g, K.hire + 18, K.hire + 36);
  const ctaK = tw(g, K.cta - 2, K.cta + 24, MOVE);
  // the navy panel starts exactly on the congrats modal (measured, mapped through the camera) and grows to the frame
  const MODAL = { x: 560, y: 250, w: 800, h: MODAL_H };
  const m0 = onScreen(MODAL.x, MODAL.y);
  const panel = { x: lerp(m0.x, 0, ctaK), y: lerp(m0.y, 0, ctaK), w: lerp(MODAL.w * camS, 1920, ctaK), h: lerp(MODAL.h * camS, 1080, ctaK) };
  // the end card breathes: the content drifts 1 -> 1.018 over the call to action, the glow wanders
  const endS = lerp(1, 1.018, clamp01((g - K.cta) / (K.end - K.cta)));
  const btn = { x: 960, y: 540 + lerp(1, 1.018, 124 / (K.end - K.cta)) * (CTA_BTN_CY - 540) };

  // pipeline geometry (screen)
  const COLS = [{ t: "Waiting", c: "#C98A2E", x: 100 }, { t: "In process", c: "#6B5BD6", x: 490 }, { t: "Interview 1", c: "#3B6BC4", x: 880 }];
  const COLW = 370, COLY = 260;
  // where each candidate card sits: column, row
  const slot = (i: number): [number, number] => {
    if (i === 0) return mv0 > 0 ? [lerp(0, 2, mv0), lerp(0, 0, mv0)] : [0, 0];
    if (i === 1) return [lerp(0, 1, mv1), lerp(1, 0, mv1)];
    return [0, i === 2 ? lerp(2, 1, mv0) : lerp(3, 2, mv0)];
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Page g={g} tint={tw(g, K.hire, K.hire + 30, SOFT)} />
      <AbsoluteFill style={{ transform: cam, transformOrigin: "50% 50%", willChange: "transform" }}>
        {/* 1 · hook */}
        {g < K.post + 6 && (
          <>
            <Pills g={g} items={[["receipt", "Retainers"], ["calendar", "Monthly fees"], ["briefcase", "Minimum volumes"]]} />
          </>
        )}

        {/* the app */}
        {appIn > 0 && jobK < 1 && (
          <div style={{ position: "absolute", left: lerp(ax, CARD.x, fold), top: lerp(ay, CARD.y, fold), width: lerp(APP_W * sc, CARD.w, fold), height: lerp(APP_H * sc, CARD.h, fold), opacity: appIn, transform: `translateY(${(1 - appIn) * 120}px)`, borderRadius: lerp(22 * sc, 18 * 1.35, fold),
            // while it folds, the window itself becomes the card: card styling, its content clipped and fading early
            ...(fold > 0 ? { boxSizing: "border-box" as const, overflow: "hidden", background: C.card, border: `${foldBw}px solid ${interpolateColors(fold, [0, 1], [C.line, C.lineSoft])}`, boxShadow: foldShadow } : {}) }}>
            <div style={{ position: "absolute", left: fold > 0 ? -foldBw : 0, top: fold > 0 ? -foldBw : 0, transform: `scale(${sc})`, transformOrigin: "0 0", opacity: 1 - tw(g, K.match - 2, K.match + 10, SOFT) }}>
              <AppShell w={APP_W} h={APP_H} nav={NAV} workspace="Nordvik Systems AB" ws="N">
                {/* the sentence */}
                {adK < 1 && (
                  <div style={{ position: "absolute", inset: 0, opacity: 1 - adK, transform: `translateY(${-adK * 40}px)` }}>
                    <Img src={img("logo-icon.svg")} style={{ position: "absolute", left: 625 - 42, top: 196, width: 84, opacity: question }} />
                    <div style={{ position: "absolute", left: 0, right: 0, top: 304, textAlign: "center", fontFamily: F.display, fontWeight: 600, fontSize: 60, letterSpacing: "-0.02em", color: C.ink, opacity: question }}>
                      Who do you <span style={{ color: C.green }}>want to hire</span> today?
                    </div>
                    <div style={{ position: "absolute", left: 170, width: 910, top: 414, height: 210, borderRadius: 20, background: C.card, border: `2px solid ${n > 0 ? C.greenLine : C.line}`, boxShadow: SHADOW.lift, padding: "22px 26px" }}>
                      <div style={{ fontFamily: F.ui, fontSize: 31, lineHeight: 1.4, color: n > 0 ? C.ink : C.faint }}>
                        {n > 0 ? (
                          // the untyped rest is laid out but transparent, so no word jumps to the next line while typing;
                          // the caret is a shadow on the last typed letter, so it adds no width and no line-break opportunity
                          <>
                            {SENTENCE.slice(0, n - 1)}
                            <span style={{ boxShadow: g < K.ad ? `3px 0 0 0 rgba(40,126,97,${Math.floor(g / 15) % 2 ? 0.2 : 1})` : undefined }}>{SENTENCE.slice(n - 1, n)}</span>
                            <span style={{ color: "transparent" }}>{SENTENCE.slice(n)}</span>
                          </>
                        ) : "e.g. find a senior product designer in Stockholm with SaaS background"}
                      </div>
                      <div style={{ position: "absolute", left: 22, bottom: 18, display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 999, border: `1.5px solid ${C.line}`, fontFamily: F.ui, fontWeight: 600, fontSize: 20, color: C.muted }}>
                        <Icon n="search" s={20} c={C.muted} />{ticked}/7 criteria detected
                      </div>
                      <div style={{ position: "absolute", right: 18, bottom: 14, width: 60, height: 60, borderRadius: 30, background: send > 0.5 ? C.greenDeep : C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.08 * Math.sin(Math.PI * send)})` }}>
                        <Icon n="arrowup" s={28} c={C.white} w={2.4} />
                      </div>
                    </div>
                    {/* two fixed rows, six and one, as in the real UI: no chip reflows to the next line as ticks widen the row */}
                    <div style={{ position: "absolute", left: 90, width: 1070, top: 660, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      {[CRIT.slice(0, 6), CRIT.slice(6)].map((row, r) => (
                        <div key={r} style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                          {row.map(([t, at], i) => {
                            const on = n >= at, k = tw(g, K.post + 22 + (at / SENTENCE.length) * (typeEnd - K.post - 22), K.post + 30 + (at / SENTENCE.length) * (typeEnd - K.post - 22));
                            return <div key={i} style={{ transform: `scale(${on ? 1 + 0.08 * Math.sin(Math.PI * k) : 1})` }}><Chip tone={on ? "green" : "line"} icon={on ? "check" : undefined} size={23}>{t}</Chip></div>;
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* the ad, written by Aifos; then publishing and reward */}
                {adK > 0 && (
                  <div style={{ position: "absolute", inset: 0, opacity: adK }}>
                    <div style={{ position: "absolute", left: 60, top: 34, display: "flex", alignItems: "center", gap: 14, fontFamily: F.ui, fontWeight: 600, fontSize: 21, color: C.ink2 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 16, background: pub > 0.5 ? C.green : C.card, border: `2px solid ${C.green}`, color: pub > 0.5 ? C.white : C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>{pub > 0.5 ? <Icon n="check" s={18} c={C.white} w={2.6} /> : 1}</div>Write the ad
                      <div style={{ width: 60, height: 2, background: C.line }} />
                      <div style={{ width: 32, height: 32, borderRadius: 16, border: `2px solid ${pub > 0.5 ? C.green : C.line}`, color: pub > 0.5 ? C.green : C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>2</div>Publish
                    </div>
                    {/* the ad */}
                    <div style={{ position: "absolute", left: 60, top: 104, width: 800, opacity: 1 - adOut, transform: `translateY(${-pub * 30}px)` }}>
                      <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 60, color: C.ink, letterSpacing: "-0.02em" }}>{typed("Account Executive, SaaS", g, K.ad + 16, K.ad + 34)}</div>
                      <div style={{ fontFamily: F.ui, fontSize: 26, color: C.muted, marginTop: 6, opacity: tw(g, K.ad + 34, K.ad + 44) }}>Stockholm · Hybrid · Sales · Mid (3-5 years) · 1 position</div>
                      {([["About Nordvik Systems AB", "Nordvik Systems AB is building SaaS solutions that help businesses thrive, with a culture of collaboration and real impact for clients."], ["About the role", "We are looking for a driven Account Executive to join our expanding SaaS team in Stockholm, managing the full sales cycle and building strong relationships with B2B clients."], ["What you'll do", "Identify and pursue new business · Manage the entire sales process · Develop long-lasting client relationships"]] as const).map(([h, p], i) => {
                        const k = tw(g, K.ad + 44 + i * 16, K.ad + 64 + i * 16);
                        return (
                          <div key={i} style={{ marginTop: 24, opacity: k, transform: `translateY(${(1 - k) * 16}px)` }}>
                            <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 33, color: C.ink }}>{h}</div>
                            <div style={{ fontFamily: F.ui, fontSize: 28, lineHeight: 1.45, color: C.ink2, marginTop: 6, clipPath: `inset(0 ${(1 - tw(g, K.ad + 48 + i * 16, K.ad + 72 + i * 16, SOFT)) * 100}% 0 0)` }}>{p}</div>
                          </div>
                        );
                      })}
                    </div>
                    {/* publishing and reward */}
                    {pubIn > 0 && (
                      <div style={{ position: "absolute", left: 60, top: 104, width: 820, opacity: pubIn, transform: `translateY(${(1 - pubIn) * 40}px)` }}>
                        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 50, color: C.ink }}>Publishing and reward</div>
                        <div style={{ fontFamily: F.ui, fontSize: 26, lineHeight: 1.4, color: C.muted, marginTop: 6 }}>Set the reward, response time and screening questions before your ad goes live on the marketplace.</div>
                        <div style={{ marginTop: 28, fontFamily: F.display, fontWeight: 600, fontSize: 34, color: C.ink }}>Reward</div>
                        <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 20px", borderRadius: 14, background: lerp(0, 1, rewardHi) > 0.01 ? C.greenSoft : "transparent", border: `1.5px solid ${rewardHi > 0.01 ? C.greenLine : "transparent"}`, boxShadow: `0 0 0 ${6 * rewardHi}px rgba(40,126,97,0.08)` }}>
                          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 36, color: C.green }}>SEK 95 000</div>
                          <div style={{ fontFamily: F.ui, fontSize: 24, color: C.ink2 }}>reward per hired</div>
                          <Icon n="check" s={22} c={C.green} w={2.4} />
                        </div>
                        <div style={{ marginTop: 26, fontFamily: F.display, fontWeight: 600, fontSize: 34, color: C.ink }}>Response time to candidates</div>
                        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                          {["2 business days", "3 business days", "4 business days", "Custom"].map((t, i) => <Chip key={i} tone={i === 1 && days ? "green" : "white"} size={24}>{t}</Chip>)}
                        </div>
                        <div style={{ marginTop: 26, fontFamily: F.display, fontWeight: 600, fontSize: 34, color: C.ink }}>Questions for recruiters</div>
                        {["Can you share an example of how you've consistently exceeded sales targets?", "What CRM systems are you proficient in?"].map((q, i) => (
                          <div key={i} style={{ display: "flex", gap: 12, marginTop: 12, fontFamily: F.ui, fontSize: 26, lineHeight: 1.4, color: C.ink2, opacity: tw(g, K.reward + 60 + i * 8, K.reward + 74 + i * 8) }}><div style={{ width: 8, height: 8, borderRadius: 4, background: C.green, marginTop: 14, flex: "none" }} />{q}</div>
                        ))}
                      </div>
                    )}
                    {/* Aifos */}
                    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 360, background: C.card, borderLeft: `1.5px solid ${C.lineSoft}`, padding: "30px 26px", transform: `translateX(${(1 - tw(g, K.ad + 20, K.ad + 40, MOVE)) * 360}px)` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Img src={img("logo-icon.svg")} style={{ width: 42 }} />
                        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 24, color: C.ink, lineHeight: 1.2 }}>Let Aifos help you define your role!</div>
                      </div>
                      {["Account Executive confirmed, good to anchor the ad.", "These are some draft screening questions:", "What CRM systems are you proficient in?", "Confirmed role title, drafted initial screening questions, and proposed salary details."].map((t, i) => {
                        const k = tw(g, K.ad + 46 + i * 20, K.ad + 60 + i * 20);
                        return <div key={i} style={{ marginTop: 18, padding: "12px 14px", borderRadius: 12, background: i === 3 ? C.greenSoft : i === 2 ? C.panel : "transparent", border: i === 3 ? `1.5px solid ${C.greenLine}` : "none", fontFamily: F.ui, fontSize: 24, lineHeight: 1.42, color: C.ink2, opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>{i === 3 && <div style={{ fontWeight: 700, color: C.ink }}>We're ready</div>}{t}</div>;
                      })}
                    </div>
                    {/* send for verification */}
                    <div style={{ position: "absolute", left: 60, bottom: 40, display: "flex", gap: 12, opacity: pub }}>
                      <Button size={28} ghost>Save draft</Button>
                      <Button size={28} press={verify}>Send for verification</Button>
                    </div>
                    {/* the real confirmation: the button stays, a toast reports the review */}
                    {sent > 0 && (
                      <div style={{ position: "absolute", right: 28, bottom: 34, width: 470, display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", borderRadius: 14, background: C.card, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.lift, opacity: sent, transform: `translateY(${(1 - sent) * 30}px)` }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon n="check" s={22} c={C.white} w={2.6} /></div>
                        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 24, lineHeight: 1.35, color: C.ink }}>Sent for review - your ad will go live once approved</div>
                      </div>
                    )}
                  </div>
                )}
              </AppShell>
            </div>
          </div>
        )}

        {/* the hook headline shrinks onto the app's own question while the app rises around it */}
        {g < K.post + 6 && (
          <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 483px", transform: `translate(${116 * morph}px, ${-25 * morph}px) scale(${lerp(1, 0.37, morph)})`, opacity: 1 - question }}>
            <Headline g={g} name="HNoCost" x={960} y={330} size={150} align="center" width={1500} lh={1.02} words={[
              { t: "No", at: K.turn }, { t: "cost", at: K.turn + 4 }, { t: "until", at: K.turn + 8 }, { t: "someone", at: K.turn + 20, green: true }, { t: "is", at: K.turn + 24, green: true }, { t: "hired.", at: K.turn + 28, green: true },
            ]} />
          </div>
        )}

        {/* the match: the ad, folded into its marketplace card; specialist recruiters dock onto it */}
        {fold > 0 && drop[3] < 1 && (
          <>
            {matchOut < 1 && (
              <div style={{ position: "absolute", left: CARD.x, top: CARD.y, opacity: jobK * (1 - matchOut), transform: `translateY(${-matchOut * 140}px) scale(${1 - 0.1 * matchOut})` }}>
                <JobCard j={{ co: "Nordvik Systems AB", ini: "No", title: "Account Executive, SaaS", pos: "1 position", loc: "Stockholm · Hybrid", guar: "No guarantee", hired: 0, proc: 0, wait: 0, reward: 95000 }} w={CARD.w} fs={1.35} highlight={lines[3]} />
              </div>
            )}
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - matchOut }}>
              {RECRUITERS.map((_, i) => {
                const x = 300 + i * 440, y0 = 730, x1 = CARD.x + CARD.w / 2 + (i - 1.5) * 120, y1 = CARD.y + CARD.h;
                const d = `M ${x} ${y0} C ${x} ${y0 - 60} ${x1} ${y1 + 60} ${x1} ${y1}`;
                return <path key={i} d={d} fill="none" stroke={C.green} strokeWidth={3} strokeDasharray="1 1" pathLength={1} strokeDashoffset={1 - lines[i]} strokeLinecap="round" opacity={0.7} />;
              })}
            </svg>
            {RECRUITERS.map((r, i) => (
              <div key={i} style={{ position: "absolute", left: 300 + i * 440 - 190, top: 730, width: 380, zIndex: 1, opacity: rec[i] * (1 - drop[i]), transform: `translateY(${(1 - rec[i]) * 60}px)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", borderRadius: 18, background: C.card, border: `1.5px solid ${C.lineSoft}`, boxShadow: SHADOW.card }}>
                  <Avatar t={r.ini} s={54} tone={r.tone} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: C.ink }}>{r.name}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: 852, textAlign: "center", fontFamily: F.ui, fontSize: 24, color: C.muted, opacity: tw(g, K.match + 62, K.match + 78) * (1 - matchOut) }}>Specialists in your industry, each with their own network.</div>
          </>
        )}

        {/* the pipeline */}
        {board > 0 && ctaK < 1 && (
          <div style={{ position: "absolute", inset: 0, isolation: "isolate", opacity: board * (1 - ctaK) }}>
            {COLS.map((c, ci) => (
              <div key={ci} style={{ position: "absolute", left: c.x, top: COLY, width: COLW, height: 760, borderRadius: 20, background: "rgba(243,240,236,0.8)", border: `1.5px solid ${C.lineSoft}`, transform: `translateY(${(1 - board) * 60}px)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px", fontFamily: F.ui, fontWeight: 700, fontSize: 23, color: C.ink }}>
                  <div style={{ width: 13, height: 11, borderRadius: 6, background: c.c }} />{c.t}
                </div>
              </div>
            ))}
            {CANDS.map((cd, i) => {
              const [col, row] = slot(i);
              const x = 100 + col * 390 + 12, y = COLY + 72 + row * 168;
              const isHero = i === 0;
              // each candidate is handed over by its recruiter (Oskar by Arthur Berg); Oskar arcs over the others on his move
              const fx = lerp(300 + i * 440 - 190 + 17, x, drop[i]), fy = lerp(730, y, drop[i]) - (isHero ? 50 * Math.sin(Math.PI * mv0) : 0);
              return (
                <div key={i} style={{ position: "absolute", left: fx, top: fy, zIndex: isHero ? 2 : 1, opacity: drop[i] }}>
                  <CandidateCard k={1.2} w={346} name={cd.name} role="Account Executive" ini={cd.ini} tone={cd.tone} ai={cd.ai} stars={isHero ? (ratedStars > 0 ? ratedStars : undefined) : cd.stars || undefined} glow={isHero ? tw(g, K.pipe + 92, K.pipe + 100) : 0} />
                </div>
              );
            })}
            {/* the candidate profile */}
            {drawer > 0 && (
              <div style={{ position: "absolute", left: 1270 + (1 - drawer) * 720, top: 236, width: 590, height: 784, borderRadius: 24, background: C.card, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.window, padding: "30px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar t="OV" s={58} tone={0} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 32, color: C.ink }}>Oskar Vinge</div>
                    <div style={{ fontFamily: F.ui, fontSize: 19, color: C.muted }}>Account Executive · Mid</div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <Chip tone={hiredSt ? "green" : "blue"} icon={hiredSt ? "check" : undefined} size={20}>{hiredSt ? "Hired" : "Interview 1"}</Chip>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 18, marginTop: 26, fontFamily: F.ui, fontWeight: 600, fontSize: 19, color: C.muted, borderBottom: `1.5px solid ${C.lineSoft}`, paddingBottom: 12 }}>
                  <span style={{ color: C.green }}>Info</span><span>AI score</span><span>Q&A</span><span>Reminders & notes</span><span>Chat</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22 }}>
                  <div style={{ padding: "8px 12px", borderRadius: 12, background: C.greenSoft, color: C.greenDeep, fontFamily: F.ui, fontWeight: 800, fontSize: 20 }}>AI 8</div>
                  <div><div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 15, letterSpacing: "0.1em", color: C.muted }}>AI SCORE</div><div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.ink }}>8 / 10</div></div>
                </div>
                <div style={{ marginTop: 20, fontFamily: F.ui, fontWeight: 700, fontSize: 15, letterSpacing: "0.1em", color: C.muted }}>RATING</div>
                <div style={{ marginTop: 8 }}><Stars n={4} s={26} fill={rating} /></div>
                <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontSize: 21, color: C.ink2 }}><Icon n="users" s={22} /> Recruiter <b style={{ color: C.ink }}>Arthur Berg</b></div>
                <div style={{ marginTop: 24, fontFamily: F.ui, fontWeight: 700, fontSize: 15, letterSpacing: "0.1em", color: C.muted }}>RECRUITER MOTIVATION</div>
                <div style={{ marginTop: 10, fontFamily: F.ui, fontSize: 22, lineHeight: 1.45, color: C.ink2 }}>Five years of B2B SaaS sales in the Nordics. Runs the full cycle from first call to signed contract, and was the first name his references mentioned.</div>
                <div style={{ position: "absolute", left: 32, right: 32, bottom: 26, display: "flex", gap: 12 }}>
                  <Button size={19} ghost icon="calendar">Add reminder</Button>
                  <Button size={19} ghost icon="file">Add note</Button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* the cursor: posting (send, response time, verification), then the pipeline (open Oskar, mark him hired) */}
        <Cursor g={g} show={[K.post + 10, K.match - 2]} clicks={[K.ad - 6, K.reward + 48, K.reward + 104]} path={[
          [K.post + 10, 1400, 900], [K.ad - 30, 1400, 900], [K.ad - 8, L(1282, 580).x, L(1282, 580).y],
          [K.ad + 26, 1500, 860], [K.reward + 30, 1500, 860], [K.reward + 46, L(650, 518).x, L(650, 518).y],
          [K.reward + 84, L(650, 518).x, L(650, 518).y], [K.reward + 102, L(706, 801).x, L(706, 801).y],
        ]} />
        <Cursor g={g} show={[K.pipe + 60, K.hire + 22]} clicks={[K.pipe + 92, K.hire + 6]} path={[
          [K.pipe + 60, 1500, 820], [K.pipe + 90, 1065, 395], [K.pipe + 112, 1150, 480], [K.hire - 20, 1150, 480], [K.hire + 4, 1753, 295],
        ]} />

        {/* the hire */}
        {modal > 0 && ctaK < 1 && (
          <>
            <AbsoluteFill style={{ background: "rgba(28,25,23,0.32)", opacity: modal * (1 - ctaK) }} />
            <div style={{ position: "absolute", left: 960 - 400, top: 250, width: 800, padding: "44px 52px", borderRadius: 26, background: C.card, boxShadow: SHADOW.window, opacity: modal * (1 - ctaK), transform: `translateY(${(1 - modal) * 40}px) scale(${lerp(0.96, 1, modal)})` }}>
              <div style={{ display: "flex", justifyContent: "center" }}><div style={{ width: 68, height: 68, borderRadius: 34, border: `3px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="check" s={38} c={C.green} w={2.6} /></div></div>
              <div style={{ marginTop: 16, textAlign: "center", fontFamily: F.display, fontWeight: 600, fontSize: 46, color: C.ink }}>Congrats, Oskar Vinge is hired!</div>
              <div style={{ marginTop: 6, textAlign: "center", fontFamily: F.ui, fontSize: 23, color: C.muted }}>Here's what happens next with payment.</div>
              <div style={{ display: "flex", gap: 8, marginTop: 24 }}>{[1, 1, 0, 0].map((on, i) => <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: on ? C.green : C.lineSoft }} />)}</div>
              <div style={{ marginTop: 8, textAlign: "center", fontFamily: F.ui, fontSize: 18, color: C.muted }}>Step 2 of 4 · Invoicing</div>
              <div style={{ marginTop: 22, padding: "20px 22px", borderRadius: 16, border: `1.5px solid ${C.lineSoft}`, background: "#FCFBFA" }}>
                <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 15, letterSpacing: "0.1em", color: C.muted }}>INVOICE BREAKDOWN</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: F.ui, fontSize: 24, color: C.ink2 }}><span>Recruitment reward</span><span>{sek(95000)}</span></div>
                <div style={{ height: 1.5, background: C.lineSoft, margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: C.ink }}><span>Total to invoice</span><span>{sek(95000)}</span></div>
              </div>
              {[["mail", "We'll email you the invoice when the time comes."], ["file", "The reward is invoiced when the candidate starts the job."]].map(([ic, t], i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginTop: 16, fontFamily: F.ui, fontSize: 22, color: C.ink2, opacity: tw(g, K.hire + 40 + i * 8, K.hire + 54 + i * 8) }}><Icon n={ic} s={22} c={C.green} />{t}</div>
              ))}
            </div>
          </>
        )}

        {/* headlines */}
        <Kicker g={g} at={K.post} n={1} text="Post assignment" x={110} y={70} out={K.ad - 4} />
        <Kicker g={g} at={K.ad + 12} n={1} text="Post assignment" x={110} y={330} out={K.match - 8} />
        <Headline g={g} name="HAd" x={110} y={392} size={76} width={620} out={K.reward - 8} words={words("One sentence. / |A full job ad.", K.ad + 16)} />
        <div style={{ position: "absolute", left: 110, top: 584, width: 560, fontFamily: F.ui, fontSize: 25, lineHeight: 1.45, color: C.muted, opacity: tw(g, K.ad + 40, K.ad + 54) * (1 - tw(g, K.reward - 8, K.reward, SOFT)) }}>Aifos writes the ad, then only asks for what it still needs.</div>
        <Headline g={g} name="HReward" x={110} y={392} size={76} width={620} out={K.match - 8} words={words("Free to post. / |Pay on the hire.", K.reward + 6)} />
        <div style={{ position: "absolute", left: 110, top: 584, width: 560, fontFamily: F.ui, fontSize: 25, lineHeight: 1.45, color: C.muted, opacity: tw(g, K.reward + 36, K.reward + 50) * (1 - tw(g, K.match - 8, K.match, SOFT)) }}>No retainer, no monthly fee, no minimum volume.</div>
        <Kicker g={g} at={K.match + 6} n={2} text="Get matched" x={110} y={90} out={K.pipe - 8} />
        <Headline g={g} name="HMatch" x={110} y={140} size={60} width={1700} out={K.pipe - 8} words={words("Specialist recruiters |work your role in parallel.", K.match + 12)} />
        <Kicker g={g} at={K.pipe} n={3} text="Collaborate" x={100} y={90} out={K.hire - 8} />
        <Headline g={g} name="HPipe" x={100} y={140} size={60} width={1720} out={K.hire - 8} words={words("Screened candidates, |straight to your pipeline.", K.pipe + 6)} />
        <Kicker g={g} at={K.hire} n={4} text="Reward" x={110} y={90} out={K.cta - 8} />
        <Headline g={g} name="HHire" x={110} y={140} size={60} width={1200} out={K.cta - 8} words={words("You pay |when they start.", K.hire + 6)} />
      </AbsoluteFill>

      {/* the call to action: the navy panel grows out of the hire */}
      {ctaK > 0 && (
        <div style={{ position: "absolute", left: panel.x, top: panel.y, width: panel.w, height: panel.h, borderRadius: lerp(26 * camS, 0, ctaK), background: C.navy, overflow: "hidden", opacity: tw(g, K.cta - 2, K.cta + 8) }}>
          <div style={{ position: "absolute", left: -panel.x, top: -panel.y, width: 1920, height: 1080, opacity: tw(g, K.cta + 16, K.cta + 30), transform: `scale(${endS})`, transformOrigin: "960px 540px" }}>
            <div style={{ position: "absolute", left: -200 + 70 * Math.sin(g / 90), top: -300 + 45 * Math.cos(g / 110), width: 1200, height: 1000, borderRadius: "50%", background: "radial-gradient(circle, rgba(40,126,97,0.35) 0%, rgba(40,126,97,0) 65%)" }} />
            <Img src={img("logo-white.svg")} style={{ position: "absolute", left: 960 - 230, top: 160, width: 460, opacity: tw(g, K.cta + 18, K.cta + 32) }} />
            <Headline g={g} name="HCta" x={960} y={310} size={100} align="center" width={1700} color={C.white} words={[
              { t: "No", at: K.cta + 26 }, { t: "cost", at: K.cta + 29 }, { t: "until", at: K.cta + 32 }, { t: "someone", at: K.cta + 38 }, { t: "is", at: K.cta + 41 }, { t: "hired.", at: K.cta + 44 },
            ]} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center", gap: 18 }}>
              {["Free to post", "30–45% lower cost than a traditional agency", "Pay only on result"].map((t, i) => {
                const k = tw(g, K.cta + 52 + i * 6, K.cta + 66 + i * 6);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 26px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.16)", fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.white, opacity: k, transform: `translateY(${(1 - k) * 16}px)` }}>
                    <Icon n="check" s={26} c="#7FD1AE" w={2.4} />{t}
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 610, display: "flex", justifyContent: "center", opacity: tw(g, K.cta + 72, K.cta + 86), transform: `translateY(${(1 - tw(g, K.cta + 72, K.cta + 86)) * 16}px)` }}>
              <Button size={30} iconRight="arrow" press={tw(g, K.cta + 124, K.cta + 134, SOFT)}>Start hiring</Button>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 750, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: "rgba(255,255,255,0.6)", opacity: tw(g, K.cta + 84, K.cta + 98) }}>recruitingrewards.com</div>
          </div>
        </div>
      )}
      {/* the end card's cursor comes in from below right and presses "Start hiring" */}
      <Cursor g={g} show={[K.cta + 96, K.end + 10]} clicks={[K.cta + 124]} path={[
        [K.cta + 96, 1560, 1010], [K.cta + 120, btn.x, btn.y], [K.cta + 140, btn.x, btn.y], [K.cta + 166, btn.x + 230, btn.y + 30],
      ]} />
    </AbsoluteFill>
  );
};
