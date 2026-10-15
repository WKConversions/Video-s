// Film 1, for recruiters: "Stop selling. Start recruiting." 40 s, no voice-over. The thread object is the assignment:
// picked from the marketplace, filled with a screened candidate, worked in one thread, turned into a reward.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { C, F, MOVE, SETTLE, SHADOW, SOFT, clamp01, lerp, tw } from "./tokens";
import { AppShell, Avatar, Bar, Button, Caret, Chip, Cursor, Headline, Icon, Job, JobCard, Kicker, Page, ScoreRing, Stars, count, img, sek, typed, words } from "./ui";

const s = (x: number) => Math.round(x * 30);
export const R = {
  hook: 0, turn: s(2.6), market: s(5.0), pick: s(9.6), submit: s(14.4), ai: s(19.2), collab: s(24.6), reward: s(29.4), cta: s(34.0), end: s(40),
};

const JOBS: Job[] = [
  { co: "Nordvik Systems AB", ini: "No", title: "Senior Backend Engineer", pos: "1 position", loc: "Stockholm · Hybrid", guar: "90 days replacement guarantee", hired: 0, proc: 2, wait: 3, reward: 119000 },
  { co: "Hisingen Mobility AB", ini: "Hi", title: "Senior Platform Engineer", pos: "2 positions", loc: "Göteborg · Hybrid", guar: "No guarantee", hired: 2, proc: 3, wait: 5, reward: 140000 },
  { co: "Mälardalen Byggpartner AB", ini: "Mä", title: "Senior Compliance Officer", pos: "1 position", loc: "Västerås · Hybrid", guar: "90 days replacement guarantee", hired: 1, proc: 4, wait: 2, reward: 112000 },
  { co: "Storsjö Försäkring AB", ini: "St", title: "Senior Fullstack Engineer", pos: "1 position", loc: "Östersund · Hybrid", guar: "No guarantee", hired: 0, proc: 5, wait: 5, reward: 129500 },
];
const NAV = [{ icon: "home", label: "Open Jobs", on: true }, { icon: "kanban", label: "Pipeline" }, { icon: "users", label: "Candidates" }, { icon: "briefcase", label: "Jobs" }, { icon: "compass", label: "Sourcing tools" }];
const HL = { x: 110, w: 640 };
// the app is drawn at 1500×880 and scaled into the right of the frame; the first card's rectangle on screen, and the
// panel it grows into
const A = 0.75, AX = 760, AY = 205;
const CARD0 = { x: AX + A * 300, y: AY + A * (36 - 40 + 46 + 18 + 33 + 22), w: A * 1150, h: A * 178 };
const PANEL = { x: 790, y: 150, w: 1040, h: 790 };
const REWARD = { x: 820, y: 660, w: 980, h: 170 };
const at = (lx: number, ly: number) => ({ x: AX + A * lx, y: AY + A * ly });

/** the opening: the sales chores, struck through */
const Chores: React.FC<{ g: number; items: [string, string][] }> = ({ g, items }) => {
  const out = tw(g, R.turn - 12, R.turn + 8, SOFT);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 490, display: "flex", justifyContent: "center", gap: 30 }}>
      {items.map(([icon, t], i) => {
        const k = tw(g, 6 + i * 10, 22 + i * 10), strike = tw(g, 44 + i * 6, 56 + i * 6, MOVE);
        return (
          <div key={i} style={{ position: "relative", opacity: k * (1 - out), transform: `translateY(${(1 - k) * 30 + out * 60}px) scale(${lerp(0.92, 1, k)}) rotate(${out * (i - 1) * 4}deg)` }}>
            <Chip icon={icon} tone="white" size={44} style={{ padding: "22px 36px", boxShadow: SHADOW.card, color: lerp(1, 0, strike) > 0.5 ? C.ink : C.faint }}>{t}</Chip>
            <div style={{ position: "absolute", left: 18, top: "50%", height: 4, borderRadius: 2, background: C.ink, width: `calc(${strike * 100}% - 36px)` }} />
          </div>
        );
      })}
    </div>
  );
};

export const Recruiters: React.FC<{ g: number }> = ({ g }) => {
  // ----- camera breath
  const cam = `translate(${5 * Math.sin(g / 70)}px, ${3 * Math.cos(g / 85)}px) scale(${1.006 + 0.004 * Math.sin(g / 120)})`;
  // ----- the app window (marketplace → brief → form → AI → thread)
  const appIn = tw(g, R.market - 4, R.market + 22);
  const appOut = tw(g, R.collab - 10, R.collab + 12, MOVE);
  const listScroll = lerp(0, -40, tw(g, R.market, R.pick, SOFT));
  const filterK = tw(g, R.pick + 30, R.pick + 44);
  const panel = tw(g, R.pick + 60, R.pick + 84, MOVE);
  const form = tw(g, R.submit + 12, R.submit + 30, MOVE);
  const aiK = tw(g, R.ai - 6, R.ai + 16, MOVE);
  const ring = tw(g, R.ai + 10, R.ai + 50, SOFT);
  const bars = [0, 1, 2].map((i) => tw(g, R.ai + 18 + i * 8, R.ai + 50 + i * 8, SOFT));
  const pass = tw(g, R.ai + 62, R.ai + 74);
  const submitPress = tw(g, R.ai + 98, R.ai + 106, SOFT);
  const toast = tw(g, R.ai + 108, R.ai + 122) * (1 - tw(g, R.collab - 14, R.collab - 4, SOFT));
  // ----- thread and reward
  const thread = tw(g, R.collab - 4, R.collab + 18);
  const st1 = g >= R.collab + 26, st2 = g >= R.collab + 92, hired = g >= R.reward + 8;
  const msg = tw(g, R.collab + 40, R.collab + 56), rating = tw(g, R.collab + 52, R.collab + 76, SOFT);
  const reply = tw(g, R.collab + 100, R.collab + 116);
  const rewardK = tw(g, R.reward + 14, R.reward + 34);
  const rewardV = count(119000, g, R.reward + 20, R.reward + 64);
  const ctaK = tw(g, R.cta - 2, R.cta + 24, MOVE);

  const questionT = "She has owned the service end to end for four years, and could name the numbers without looking them up.";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Page g={g} tint={tw(g, R.reward, R.reward + 30, SOFT)} />
      <AbsoluteFill style={{ transform: cam, transformOrigin: "50% 50%", willChange: "transform" }}>
        {/* 1 · hook */}
        {g < R.market + 6 && (
          <>
            <Chores g={g} items={[["phone", "Cold calls"], ["calendar", "Meeting booking"], ["deck", "Pitch decks"]]} />
            <Headline g={g} name="HStop" x={960} y={330} size={150} align="center" width={1060} out={R.market - 14} words={[
              { t: "Stop", at: R.turn }, { t: "selling.", at: R.turn + 5 }, { t: "Start", at: R.turn + 18, green: true }, { t: "recruiting.", at: R.turn + 24, green: true },
            ]} lh={1.02} />
          </>
        )}

        {/* the app, scaled into the right of the frame; it steps back when the chosen card grows into the brief */}
        {appIn > 0 && appOut < 1 && (
          <div style={{ position: "absolute", left: AX, top: AY, opacity: appIn * (1 - appOut) * (1 - 0.6 * panel), transform: `translate(${appOut * 220}px, ${(1 - appIn) * 120}px) scale(${A * (1 - 0.05 * panel)})`, transformOrigin: "0 0", filter: panel > 0 ? `blur(${2.5 * panel}px)` : undefined, willChange: "transform" }}>
            <AppShell w={1500} h={880} nav={NAV} workspace="RR">
              <div style={{ position: "absolute", left: 50, top: 36 + listScroll, width: 1150 }}>
                <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 38, color: C.ink, letterSpacing: "-0.01em" }}>Find roles to work on</div>
                <div style={{ display: "flex", gap: 10, margin: "18px 0 22px" }}>
                  {["All jobs", "Tech", "Sales", "Finance", "Marketing"].map((t, i) => (
                    <Chip key={i} tone={(i === 0 && filterK < 0.5) || (i === 1 && filterK >= 0.5) ? "green" : "line"} size={15}>{t}</Chip>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {JOBS.map((j, i) => {
                    const k = tw(g, R.market + 10 + i * 6, R.market + 28 + i * 6);
                    const gone = i === 2 ? filterK : 0; // the compliance role leaves on "Tech"
                    return (
                      <div key={i} style={{ opacity: k * (1 - gone) * (i === 0 ? 1 - panel : 1), transform: `translateY(${(1 - k) * 40}px)`, height: gone > 0 ? lerp(178, 0, gone) : undefined, marginBottom: gone > 0 ? lerp(0, -16, gone) : 0, overflow: gone > 0 ? "hidden" : undefined }}>
                        <JobCard j={j} tone={i} highlight={i === 0 ? tw(g, R.pick + 50, R.pick + 58) : 0} w={1150} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </AppShell>
          </div>
        )}
        {/* the chosen card grows into one panel: the brief, the recommendation form, the AI match analysis */}
        {panel > 0 && g < R.collab + 12 && (
          <div style={{ position: "absolute", left: lerp(CARD0.x, PANEL.x, panel), top: lerp(CARD0.y, PANEL.y, panel), width: lerp(CARD0.w, PANEL.w, panel), height: lerp(CARD0.h, PANEL.h, panel),
            borderRadius: lerp(14, 26, panel), background: C.card, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.window, overflow: "hidden", opacity: 1 - appOut, transform: `translateX(${appOut * 200}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: PANEL.w, height: PANEL.h, padding: "44px 52px", opacity: tw(g, R.pick + 76, R.pick + 90) }}>
                  {/* the brief */}
                  <div style={{ position: "absolute", left: 46, right: 46, top: 40, opacity: 1 - form, transform: `translateY(${-form * 30}px)` }}>
                    <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.muted }}>Nordvik Systems AB</div>
                    <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 44, color: C.ink, letterSpacing: "-0.015em" }}>Senior Backend Engineer</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 14 }}>
                      <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 40, color: C.green }}>{sek(119000)}</div>
                      <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 14, letterSpacing: "0.1em", color: C.muted }}>REWARD PER HIRED</div>
                    </div>
                    <div style={{ marginTop: 30, fontFamily: F.ui, fontWeight: 700, fontSize: 14, letterSpacing: "0.12em", color: C.muted }}>REQUIREMENT PROFILE</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                      {["Senior", "Backend", "Kafka", "PostgreSQL", "Stockholm · Hybrid", "Swedish & English"].map((t, i) => {
                        const k = tw(g, R.pick + 80 + i * 4, R.pick + 94 + i * 4);
                        return <div key={i} style={{ opacity: k, transform: `scale(${lerp(0.85, 1, k)})` }}><Chip tone="green" size={19}>{t}</Chip></div>;
                      })}
                    </div>
                    <div style={{ marginTop: 30, fontFamily: F.ui, fontWeight: 700, fontSize: 14, letterSpacing: "0.12em", color: C.muted }}>QUESTIONS FOR RECRUITERS</div>
                    {["Which part of the backend stack has the candidate owned in production, and for how long?", "Describe a time someone gave you hard feedback. How did you react?"].map((q, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginTop: 14, fontFamily: F.ui, fontWeight: 500, fontSize: 21, color: C.ink2, lineHeight: 1.4, opacity: tw(g, R.pick + 100 + i * 6, R.pick + 114 + i * 6) }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, background: C.green, marginTop: 10, flex: "none" }} />{q}
                      </div>
                    ))}
                    <div style={{ marginTop: 30, fontFamily: F.ui, fontWeight: 700, fontSize: 14, letterSpacing: "0.12em", color: C.muted }}>PAYMENT TERMS</div>
                    <div style={{ marginTop: 12, display: "flex", gap: 10 }}><Chip icon="coins" tone="white" size={19}>Paid when the candidate starts</Chip><Chip icon="shield" tone="white" size={19}>90 days guarantee</Chip></div>
                    
                  </div>
                  {/* the recommendation form */}
                  {form > 0 && (
                    <div style={{ position: "absolute", left: 46, right: 46, top: 40, opacity: form * (1 - aiK), transform: `translateY(${(1 - form) * 40 - aiK * 60}px)` }}>
                      <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 46, color: C.ink }}>Recommend a candidate</div>
                      <div style={{ fontFamily: F.ui, fontSize: 20, color: C.muted, marginTop: 6 }}>Senior Backend Engineer · Nordvik Systems AB</div>
                      <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderRadius: 16, border: `1.5px solid ${C.greenLine}`, background: C.greenSoft }}>
                        <Avatar t="KS" s={58} tone={3} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: C.ink }}>Karla S.</div>
                          <div style={{ fontFamily: F.ui, fontSize: 18, color: C.muted }}>Backend Engineer · 9 years · Stockholm</div>
                        </div>
                        <Chip icon="file" tone="white" size={18}>CV attached</Chip>
                      </div>
                      <div style={{ marginTop: 30, fontFamily: F.ui, fontWeight: 700, fontSize: 22, lineHeight: 1.35, color: C.ink }}>Which part of the backend stack has the candidate owned in production, and for how long? <span style={{ color: C.red }}>*</span></div>
                      <div style={{ marginTop: 12, minHeight: 150, padding: "18px 20px", borderRadius: 14, border: `1.5px solid ${C.green}`, background: C.card, fontFamily: F.ui, fontSize: 25, lineHeight: 1.5, color: C.ink, boxShadow: "0 0 0 4px rgba(40,126,97,0.10)" }}>
                        {typed(questionT, g, R.submit + 34, R.submit + 118)}<Caret g={g} h={30} on={g < R.ai} />
                      </div>
                      <div style={{ marginTop: 26, fontFamily: F.ui, fontWeight: 700, fontSize: 22, color: C.ink }}>Your motivation</div>
                      <div style={{ marginTop: 12, height: 76, padding: "18px 20px", borderRadius: 14, border: `1.5px solid ${C.line}`, fontFamily: F.ui, fontSize: 22, color: C.muted }}>Your own assessment, read next to the CV.</div>
                    </div>
                  )}
                  {/* AI match analysis */}
                  {aiK > 0 && (
                    <div style={{ position: "absolute", left: 46, right: 46, top: 40, opacity: aiK, transform: `translateY(${(1 - aiK) * 60}px)` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Icon n="sparkle" s={38} c={C.green} /><div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 46, color: C.ink }}>AI Match Analysis</div></div>
                      <div style={{ fontFamily: F.ui, fontSize: 20, color: C.muted, marginTop: 6 }}>Karla S. against the requirement profile</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 34, marginTop: 34 }}>
                        <ScoreRing v={9} s={184} k={ring} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                          <Bar label="Domain and language fit" v={9} k={bars[0]} w={350} />
                          <Bar label="Relevant senior experience" v={9} k={bars[1]} w={350} />
                          <Bar label="Strong technical alignment" v={9.5} k={bars[2]} w={350} />
                        </div>
                      </div>
                      <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderRadius: 14, background: C.greenSoft, border: `1.5px solid ${C.greenLine}`, opacity: pass, transform: `scale(${lerp(0.96, 1, pass)})`, transformOrigin: "left center" }}>
                        <Icon n="check" s={24} c={C.green} w={2.4} /><div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: C.greenDeep }}>Meets the quality threshold (9/7)</div>
                      </div>
                      <div style={{ marginTop: 22, fontFamily: F.ui, fontWeight: 700, fontSize: 14, letterSpacing: "0.12em", color: C.muted, opacity: pass }}>KEY SIGNALS</div>
                      {["Proven track record of splitting monoliths and running event-driven Kafka services", "Deep PostgreSQL expertise", "Native Swedish and professional English"].map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, marginTop: 12, fontFamily: F.ui, fontSize: 23, color: C.ink2, opacity: tw(g, R.ai + 70 + i * 6, R.ai + 84 + i * 6) }}><div style={{ width: 8, height: 8, borderRadius: 4, background: C.green, marginTop: 9, flex: "none" }} />{t}</div>
                      ))}
                      
                    </div>
                  )}
              <div style={{ position: "absolute", left: 46, bottom: 40, opacity: 1 - form }}><Button icon="userplus" size={22} press={tw(g, R.submit, R.submit + 8)}>Recommend a candidate</Button></div>
              <div style={{ position: "absolute", left: 46, bottom: 40, opacity: aiK }}><Button icon="send" size={22} press={submitPress}>Submit Candidate</Button></div>
              {toast > 0 && (
                <div style={{ position: "absolute", right: 40, bottom: 36, display: "flex", alignItems: "center", gap: 12, padding: "16px 22px", borderRadius: 14, background: C.card, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.lift, opacity: toast, transform: `translateY(${(1 - toast) * 30}px)` }}>
                  <div style={{ width: 26, height: 26, borderRadius: 13, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="check" s={18} c={C.white} w={2.6} /></div>
                  <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 19, color: C.ink }}>Candidate submitted successfully</div>
                </div>
              )}
            </div>
          </div>
        )}
        <Cursor g={g} show={[R.pick + 14, R.ai + 116]} clicks={[R.pick + 34, R.pick + 56, R.submit, R.ai + 98]} path={[
          [R.pick + 14, 1500, 760], [R.pick + 32, at(437, 75).x, at(437, 75).y], [R.pick + 40, at(437, 75).x, at(437, 75).y],
          [R.pick + 54, CARD0.x + CARD0.w * 0.45, CARD0.y + CARD0.h * 0.4], [R.pick + 60, CARD0.x + CARD0.w * 0.45, CARD0.y + CARD0.h * 0.4],
          [R.submit - 20, 1100, 820], [R.submit - 2, PANEL.x + 46 + 160, PANEL.y + PANEL.h - 40 - 28], [R.submit + 30, 1500, 700],
          [R.ai + 80, 1500, 700], [R.ai + 96, PANEL.x + 46 + 130, PANEL.y + PANEL.h - 40 - 28],
        ]} />

        {/* the thread and the reward */}
        {thread > 0 && g < R.cta + 26 && (
          <div style={{ position: "absolute", left: 820, top: 226, width: 980, opacity: thread * (1 - ctaK), transform: `translateY(${(1 - thread) * 80}px) scale(${1 - 0.06 * ctaK})` }}>
            <div style={{ padding: "30px 34px", borderRadius: 24, background: C.card, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.window }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Avatar t="KS" s={72} tone={3} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 40, color: C.ink }}>Karla S.</div>
                  <div style={{ fontFamily: F.ui, fontSize: 20, color: C.muted }}>Senior Backend Engineer · Nordvik Systems AB</div>
                </div>
                <div style={{ position: "relative" }}>
                  {(["Submitted", "Interview 1", "Interview 2", "Hired"] as const).map((t, i) => {
                    const on = [true, st1, st2, hired][i] && ![st1, st2, hired, false][i];
                    const k = i === 0 ? 1 : tw(g, [0, R.collab + 26, R.collab + 92, R.reward + 8][i], [0, R.collab + 36, R.collab + 102, R.reward + 18][i]);
                    return on ? (
                      <div key={i} style={{ position: i === 0 ? "relative" : "absolute", right: 0, top: 0, transform: `scale(${lerp(0.8, 1, k)})`, opacity: k }}>
                        <Chip tone={i === 3 ? "green" : i === 0 ? "line" : "amber"} icon={i === 3 ? "check" : undefined} size={22}>{t}</Chip>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <div style={{ height: 1.5, background: C.lineSoft, margin: "24px 0" }} />
              {/* the company's feedback */}
              <div style={{ display: "flex", gap: 14, opacity: msg, transform: `translateY(${(1 - msg) * 20}px)` }}>
                <Avatar t="No" s={52} tone={0} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.ink }}>Nordvik Systems AB</div><Stars n={4} s={24} fill={rating} /></div>
                  <div style={{ marginTop: 8, padding: "14px 18px", borderRadius: "4px 16px 16px 16px", background: C.panel, fontFamily: F.ui, fontSize: 24, color: C.ink2, lineHeight: 1.45 }}>Strong first interview. Let's book a second round with the tech lead.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 18, flexDirection: "row-reverse", opacity: reply, transform: `translateY(${(1 - reply) * 20}px)` }}>
                <Avatar t="RR" s={52} tone={2} />
                <div style={{ padding: "14px 18px", borderRadius: "16px 4px 16px 16px", background: C.greenSoft, fontFamily: F.ui, fontSize: 24, color: C.greenDeep, lineHeight: 1.45 }}>Great. She can do Thursday or Friday.</div>
              </div>
            </div>
            {/* the reward */}
            <div style={{ position: "absolute", left: 0, top: REWARD.y - 226, width: REWARD.w, height: REWARD.h, boxSizing: "border-box", padding: "0 34px", borderRadius: 24, background: C.card, border: `1.5px solid ${C.greenLine}`, boxShadow: SHADOW.window, opacity: rewardK, transform: `translateY(${(1 - rewardK) * 50}px)`, display: "flex", alignItems: "center", gap: 26 }}>
              <div style={{ width: 76, height: 76, borderRadius: 22, background: C.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="coins" s={40} c={C.green} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 15, letterSpacing: "0.12em", color: C.muted }}>YOUR REWARD</div>
                <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 60, color: C.green, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>{sek(rewardV)}</div>
              </div>
              <div style={{ fontFamily: F.ui, fontSize: 21, color: C.muted, width: 320, lineHeight: 1.4, opacity: tw(g, R.reward + 60, R.reward + 74) }}>Invoiced when Karla starts, paid on the terms you accepted.</div>
            </div>
          </div>
        )}

        {/* headlines and kickers (left column) */}
        <Headline g={g} name="HMarket" x={HL.x} y={330} size={72} width={HL.w} out={R.pick - 10} words={words("Real assignments, |already on the platform.", R.market + 8)} />
        <div style={{ position: "absolute", left: HL.x, top: 590, width: 560, fontFamily: F.ui, fontSize: 24, lineHeight: 1.5, color: C.muted, opacity: tw(g, R.market + 40, R.market + 54) * (1 - tw(g, R.pick - 10, R.pick, SOFT)) }}>
          Companies publish the brief and the reward. You decide what to take on.
        </div>
        <Kicker g={g} at={R.pick} n={1} text="Pick assignments" x={HL.x} y={316} out={R.submit - 8} />
        <Headline g={g} name="HPick" x={HL.x} y={376} size={68} width={600} out={R.submit - 8} words={words("Pick the ones that |fit your niche.", R.pick + 6)} />
        <Kicker g={g} at={R.submit} n={2} text="Submit candidates" x={HL.x} y={316} out={R.ai - 8} />
        <Headline g={g} name="HSubmit" x={HL.x} y={376} size={68} width={600} out={R.ai - 8} words={words("Present your candidate, |in your own words.", R.submit + 6)} />
        <Kicker g={g} at={R.ai} text="AI-screened before sending" x={HL.x} y={316} out={R.collab - 8} />
        <Headline g={g} name="HAi" x={HL.x} y={376} size={68} width={600} out={R.collab - 8} words={words("A clear score |and a clear why.", R.ai + 6)} />
        <div style={{ position: "absolute", left: HL.x, top: 600, width: 540, fontFamily: F.ui, fontSize: 25, lineHeight: 1.5, color: C.muted, opacity: tw(g, R.ai + 40, R.ai + 54) * (1 - tw(g, R.collab - 8, R.collab, SOFT)) }}>
          Below the threshold, it cannot be sent.
        </div>
        <Kicker g={g} at={R.collab} n={3} text="Collaborate" x={HL.x} y={316} out={R.reward - 8} />
        <Headline g={g} name="HCollab" x={HL.x} y={376} size={68} width={620} out={R.reward - 8} words={words("Feedback and status, |in one thread.", R.collab + 6)} />
        <Kicker g={g} at={R.reward} n={4} text="Get rewarded" x={HL.x} y={316} out={R.cta - 8} />
        <Headline g={g} name="HReward" x={HL.x} y={376} size={68} width={620} out={R.cta - 8} words={words("Paid |when your candidate starts.", R.reward + 6)} />
      </AbsoluteFill>

      {/* the call to action: the navy panel grows out of the reward card */}
      {ctaK > 0 && (
        <div style={{ position: "absolute", left: lerp(REWARD.x, 0, ctaK), top: lerp(REWARD.y, 0, ctaK), width: lerp(REWARD.w, 1920, ctaK), height: lerp(REWARD.h, 1080, ctaK), borderRadius: lerp(24, 0, ctaK), background: C.navy, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: tw(g, R.cta + 16, R.cta + 30) }}>
            <div style={{ position: "absolute", left: -200, top: -300, width: 1200, height: 1000, borderRadius: "50%", background: "radial-gradient(circle, rgba(40,126,97,0.35) 0%, rgba(40,126,97,0) 65%)" }} />
            <Img src={img("logo-white.svg")} style={{ position: "absolute", left: 960 - 230, top: 170, width: 460, opacity: tw(g, R.cta + 18, R.cta + 32), transform: `translateY(${(1 - tw(g, R.cta + 18, R.cta + 32)) * 20}px)` }} />
            <Headline g={g} name="HCta" x={960} y={330} size={104} align="center" width={1700} color={C.white} words={[
              { t: "Stop selling.", at: R.cta + 26 }, { t: "Start", at: R.cta + 34 }, { t: "recruiting.", at: R.cta + 38 },
            ]} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", opacity: tw(g, R.cta + 50, R.cta + 64), transform: `translateY(${(1 - tw(g, R.cta + 50, R.cta + 64)) * 16}px)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.16)", fontFamily: F.ui, fontSize: 24, color: "rgba(255,255,255,0.85)" }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: C.amber }} /><b style={{ color: C.white }}>200+</b> specialist recruiters already working here
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", opacity: tw(g, R.cta + 62, R.cta + 76), transform: `translateY(${(1 - tw(g, R.cta + 62, R.cta + 76)) * 16}px)` }}>
              <Button size={30} iconRight="arrow" press={tw(g, R.cta + 120, R.cta + 130, SOFT)}>Join as a recruiter</Button>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: "rgba(255,255,255,0.6)", opacity: tw(g, R.cta + 74, R.cta + 88) }}>recruitingrewards.com</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
export { clamp01, SETTLE };
