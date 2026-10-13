// Creoble's builder, after creoble.dk's own (cream step list on the left, Fraunces heading with a sage italic accent,
// sage buttons, the round chat button), with a live preview of the site on the right. One fixed layout, so the close-ups
// can find the prompt box and the buttons by their coordinates (window units, 1600 × 1000).
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, clamp01, mix, rgba } from "./lib";
import { Btn, Caret, Check, Icon, Mark, Switch, Wordmark } from "./kit";
import { BASE_W, ChatButton, FlowerSite } from "./sites";

export const WW = 1600, WH = 1000;
export const SIDE = 400;
export const PROMPT = { x: 24, y: 742, w: 352, h: 234, send: { x: 336, y: 936 } };
export const PREVIEW = { x: 416, y: 84, w: 1168, h: 900 };
export const BTN_CHAT = { x: 1236, y: 18, w: 156, h: 46 }, BTN_BUY = { x: 1404, y: 18, w: 180, h: 46 };
export const centre = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

export type Step = { t: string; a: string; k: number };
export type Msg = { from: "me" | "ai"; text: React.ReactNode; k: number };

/** The prompt box: placeholder or typed text, the tool chips, the send button. */
export const PromptBox: React.FC<{ g: number; text?: string; placeholder?: string; caret?: boolean; sendPress?: number; w?: number; h?: number; dark?: boolean }> =
  ({ g, text = "", placeholder = "Spørg Creoble…", caret = true, sendPress = 0, w = PROMPT.w, h = PROMPT.h, dark = false }) => (
    <div style={{ width: w, height: h, borderRadius: 18, background: dark ? C.panel : "#FFFFFF", border: `1.5px solid ${dark ? "#33403B" : C.line}`, boxSizing: "border-box",
      boxShadow: "0 10px 30px -18px rgba(20,30,26,0.4)", position: "relative", fontFamily: F.ui }}>
      <div style={{ position: "absolute", left: 20, top: 18, right: 20, fontSize: 20, lineHeight: 1.4, color: text ? (dark ? "#F2F1EC" : C.ink) : C.faint }}>
        {text || placeholder}{caret && <Caret g={g} h={22} color={dark ? "#fff" : C.sageDeep} />}
      </div>
      <div style={{ position: "absolute", left: 16, bottom: 16, display: "flex", gap: 8, alignItems: "center", fontSize: 15, color: dark ? "#C9CFCB" : C.muted }}>
        <div style={{ width: 34, height: 34, borderRadius: 17, border: `1.5px solid ${dark ? "#46524D" : C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={18} color={dark ? "#C9CFCB" : C.muted} /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="image" size={18} color={dark ? "#C9CFCB" : C.muted} />Billede</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="palette" size={18} color={dark ? "#C9CFCB" : C.muted} />Stil</div>
      </div>
      <div style={{ position: "absolute", right: 16 - 22 + 22, bottom: 18, width: 44, height: 44, borderRadius: 22, background: text ? C.sage : "#D9D7D1", display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${1 - 0.12 * sendPress})` }}><Icon name="arrowUp" size={22} color="#fff" stroke={2.6} /></div>
    </div>
  );

/** The builder window. */
export const Builder: React.FC<{
  g: number; build?: number; brand?: number; from?: number; steps?: Step[]; msgs?: Msg[]; prompt?: string; caret?: boolean; sendPress?: number;
  url?: string; chatPress?: number; buyPress?: number; widget?: number; widgetPing?: number; status?: React.ReactNode; topIcons?: number; side?: React.ReactNode; overlay?: React.ReactNode; video?: boolean; live?: number;
}> = ({ g, build = 1, brand = 0, from = 0, steps, msgs = [], prompt = "", caret = false, sendPress = 0, url = "blomsterhuset-rosa.creoble.dk", chatPress = 0, buyPress = 0,
  widget = 0, widgetPing = 0, status, topIcons = 0, side, overlay, video = true, live = 0 }) => {
  const ps = PREVIEW.w / BASE_W;
  return (
    <div style={{ width: WW, height: WH, borderRadius: 22, overflow: "hidden", background: "#FFFFFF", position: "relative", fontFamily: F.ui, color: C.ink, boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.06)" }}>
      {/* the side panel */}
      <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: WH, background: C.cream, borderRight: `1.5px solid ${C.line}` }}>
        <div style={{ position: "absolute", left: 28, top: 26, display: "flex", alignItems: "center", gap: 10 }}><Mark size={34} tile={C.sage} id="bm" /><Wordmark size={30} /></div>
        <div style={{ position: "absolute", left: 28, top: 84, fontSize: 15, color: C.muted }}>Projekt · Blomsterhuset Rosa</div>
        {side ?? (
          <div style={{ position: "absolute", left: 24, top: 124, right: 24 }}>
            {(steps ?? []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "11px 0", borderBottom: `1px solid ${C.line}`, opacity: 0.55 + 0.45 * clamp01(s.k * 3) }}>
                <Check k={s.k} size={28} />
                <div><div style={{ fontSize: 17, fontWeight: 600 }}>{s.t}</div>
                  <div style={{ fontSize: 15, color: C.sageDeep, marginTop: 2, opacity: clamp01(s.k * 2), fontFamily: F.serif, fontStyle: "italic" }}>{s.a}</div></div>
              </div>
            ))}
            {status && <div style={{ marginTop: 18 }}>{status}</div>}
          </div>
        )}
        <div style={{ position: "absolute", left: 24, right: 24, bottom: WH - PROMPT.y + 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.filter((m) => m.k > 0).map((m, i) => (
            <div key={i} style={{ alignSelf: m.from === "me" ? "flex-end" : "flex-start", maxWidth: 300, padding: "11px 15px", borderRadius: 16, fontSize: 16, lineHeight: 1.35,
              background: m.from === "me" ? C.sage : "#FFFFFF", color: m.from === "me" ? "#fff" : C.ink, border: m.from === "ai" ? `1px solid ${C.line}` : undefined,
              opacity: clamp01(m.k * 1.5), transform: `translateY(${(1 - clamp01(m.k)) * 16}px)` }}>{m.text}</div>
          ))}
        </div>
        <div style={{ position: "absolute", left: PROMPT.x, top: PROMPT.y }}><PromptBox g={g} text={prompt} caret={caret} sendPress={sendPress} /></div>
      </div>
      {/* the preview's top bar */}
      <div style={{ position: "absolute", left: SIDE, right: 0, top: 0, height: 82, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ display: "flex", gap: 6, padding: 5, borderRadius: 12, background: "#F1F0EC" }}>
          <div style={{ width: 38, height: 34, borderRadius: 9, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}><Icon name="monitor" size={20} color={C.ink} /></div>
          <div style={{ width: 38, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="mobile" size={20} color={C.muted} /></div>
        </div>
        <div style={{ marginLeft: 60, height: 40, padding: "0 18px", borderRadius: 20, background: "#F1F0EC", display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: "#4A4844" }}>
          <Icon name="lock" size={16} color={C.muted} />{url}</div>
        {live > 0.5 ? <div style={{ height: 30, padding: "0 12px", borderRadius: 15, background: "#E3F1E8", color: "#2F7A52", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 9, height: 9, borderRadius: 5, background: "#3E8E63" }} />Online</div>
          : <div style={{ height: 30, padding: "0 12px", borderRadius: 15, background: C.sageTint, color: C.sageDeep, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Icon name="eye" size={16} color={C.sageDeep} />Gratis preview</div>}
      </div>
      {topIcons > 0 && <TopIcons k={topIcons} />}
      <div style={{ position: "absolute", left: BTN_CHAT.x, top: BTN_CHAT.y }}><Btn label="Chatbot" icon="chat" tone="grey" size={18} press={chatPress} style={{ height: BTN_CHAT.h, width: BTN_CHAT.w, padding: 0, justifyContent: "center", boxSizing: "border-box" }} /></div>
      <div style={{ position: "absolute", left: BTN_BUY.x, top: BTN_BUY.y }}><Btn label="Køb · 499 kr." tone="sage" size={18} press={buyPress} style={{ height: BTN_BUY.h, width: BTN_BUY.w, padding: 0, justifyContent: "center", boxSizing: "border-box" }} /></div>
      {/* the preview */}
      <div style={{ position: "absolute", left: PREVIEW.x, top: PREVIEW.y, width: PREVIEW.w, height: PREVIEW.h, borderRadius: 16, overflow: "hidden", border: `1.5px solid ${C.line}`, background: "#FAFAF8" }}>
        <div style={{ transform: `scale(${ps})`, transformOrigin: "0 0" }}><FlowerSite build={build} brand={brand} from={from} h={PREVIEW.h / ps} video={video} /></div>
        {widget > 0 && <div style={{ position: "absolute", right: 22, bottom: 22, transform: `scale(${clamp01(widget)})`, opacity: clamp01(widget * 2) }}><ChatButton size={64} brand={brand} ping={widgetPing} /></div>}
      </div>
      {overlay}
    </div>
  );
};

/** What the chatbot has learnt, as round tiles (the reference's row of collaborators). */
export const TOPICS = [
  { icon: "clock", bg: `linear-gradient(135deg, ${C.gSage}, ${C.gTeal})` },
  { icon: "tag", bg: `linear-gradient(135deg, ${C.gApricot}, ${C.gTerra})` },
  { icon: "truck", bg: `linear-gradient(135deg, ${C.gMint}, ${C.gSage})` },
  { icon: "flower", bg: `linear-gradient(135deg, ${C.gCoral}, ${C.rose})` },
  { icon: "phone", bg: `linear-gradient(135deg, ${C.gSand}, ${C.gApricot})` },
];
export const TopicTile: React.FC<{ i: number; d: number }> = ({ i, d }) => (
  <div style={{ width: d, height: d, borderRadius: d / 2, background: TOPICS[i].bg, display: "flex", alignItems: "center", justifyContent: "center", border: `${Math.max(2, d * 0.05)}px solid #fff`, boxSizing: "border-box",
    boxShadow: "0 8px 20px -10px rgba(0,0,0,0.35)" }}><Icon name={TOPICS[i].icon} size={d * 0.46} color="#fff" stroke={2.2} /></div>
);
const TopIcons: React.FC<{ k: number }> = ({ k }) => (
  <div style={{ position: "absolute", left: BTN_CHAT.x - 190, top: 22, display: "flex", opacity: clamp01(k) }}>
    {TOPICS.map((_, i) => <div key={i} style={{ marginLeft: i ? -10 : 0 }}><TopicTile i={i} d={38} /></div>)}
  </div>
);

/** The chat window on the shop's site. */
export type Bubble = { from: "bot" | "me"; text: React.ReactNode; k: number; card?: number; cardPress?: number; done?: number };
export const ChatWindow: React.FC<{ g: number; bubbles: Bubble[]; input?: string; caret?: boolean; dots?: number; sendPress?: number; w?: number; h?: number }> =
  ({ g, bubbles, input = "", caret = false, dots = 0, sendPress = 0, w = 560, h = 760 }) => (
    <div style={{ width: w, height: h, borderRadius: 28, background: "#FFFFFF", overflow: "hidden", position: "relative", fontFamily: F.ui, boxShadow: "0 40px 90px -30px rgba(60,20,30,0.45), 0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ height: 96, background: C.rose, display: "flex", alignItems: "center", gap: 14, padding: "0 24px", color: "#fff" }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="flower" size={30} color="#fff" stroke={2} /></div>
        <div><div style={{ fontFamily: F.serif, fontSize: 24, fontWeight: 500 }}>Blomsterhuset Rosa</div>
          <div style={{ fontSize: 15, opacity: 0.85, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 5, background: "#9BE3B5", display: "inline-block" }} />Svarer med det samme</div></div>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 110, bottom: 96, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12 }}>
        {bubbles.filter((b) => b.k > 0).map((b, i) => (
          <div key={i} style={{ alignSelf: b.from === "me" ? "flex-end" : "flex-start", maxWidth: w * 0.78, opacity: clamp01(b.k * 1.6), transform: `translateY(${(1 - clamp01(b.k)) * 18}px)` }}>
            <div style={{ padding: "13px 17px", borderRadius: 20, borderBottomRightRadius: b.from === "me" ? 6 : 20, borderBottomLeftRadius: b.from === "bot" ? 6 : 20,
              background: b.from === "me" ? C.plum : C.blush, color: b.from === "me" ? "#fff" : C.plum, fontSize: 19, lineHeight: 1.4 }}>{b.text}</div>
            {b.card !== undefined && b.card > 0 && <ProductCard k={b.card} press={b.cardPress ?? 0} done={b.done ?? 0} />}
          </div>
        ))}
        {dots > 0 && <div style={{ alignSelf: "flex-start", padding: "16px 20px", borderRadius: 20, background: C.blush, display: "flex", gap: 7 }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: C.rose, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(g * 0.45 - i * 0.9)) }} />)}</div>}
      </div>
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, height: 64, borderRadius: 32, background: "#F6F1EF", display: "flex", alignItems: "center", padding: "0 10px 0 22px", gap: 10 }}>
        <div style={{ flex: 1, fontSize: 18, color: input ? C.plum : "#A8999C" }}>{input || "Skriv en besked…"}{caret && <Caret g={g} h={20} color={C.rose} />}</div>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: input ? C.rose : "#E3D6D8", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.12 * sendPress})` }}><Icon name="arrowUp" size={22} color="#fff" stroke={2.6} /></div>
      </div>
    </div>
  );
const ProductCard: React.FC<{ k: number; press: number; done: number }> = ({ k, press, done }) => (
  <div style={{ marginTop: 10, width: 340, borderRadius: 20, overflow: "hidden", background: "#fff", border: `1.5px solid ${C.petal}`, opacity: clamp01(k * 1.5), transform: `translateY(${(1 - clamp01(k)) * 16}px)` }}>
    <Img src={staticFile("img/stills/bouquet.jpg")} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
    <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div><div style={{ fontWeight: 700, fontSize: 18, color: C.plum }}>Brudebuket</div><div style={{ fontSize: 16, color: C.rose, fontWeight: 600 }}>fra 895 kr.</div></div>
      <div style={{ height: 44, padding: "0 20px", borderRadius: 22, background: done > 0.5 ? "#3E8E63" : C.rose, color: "#fff", fontWeight: 600, fontSize: 17, display: "flex", alignItems: "center", gap: 6, transform: `scale(${1 - 0.08 * press})` }}>
        {done > 0.5 ? <><Icon name="check" size={18} color="#fff" stroke={3} />Bestilt</> : "Bestil"}</div>
    </div>
  </div>
);

export { mix, rgba, Switch };
