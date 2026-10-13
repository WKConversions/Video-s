// 34–54 s: "Tilføj din chatbot" with two labelled pointers (the reference's collaborators), the click on Chatbot, the set-up
// card, what the bot has learnt flying into the top bar, the builder with the chat button, "Med ét klik", the activation
// chip, and the chatbot answering a customer on the shop's site, down to an order.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, MOVE, SOFT, clamp01, expoOut, lerp, path, pr, press, px } from "./lib";
import { At, Btn, Caret, Check, Cursor, Flow, Glow, Grain, Icon, Words } from "./kit";
import { BTN_BUY, BTN_CHAT, Builder, Bubble, ChatWindow, PREVIEW, TOPICS, TopicTile, WH, WW, centre } from "./ui";
import { BASE_W, FlowerSite } from "./sites";
import { STEPS } from "./B";

/** A small arrow pointer with a name tag (the reference's collaborator cursors). */
export const Pointer: React.FC<{ x: number; y: number; label: string; color: string; k?: number; size?: number }> = ({ x, y, label, color, k = 1, size = 34 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) scale(${0.7 + 0.3 * k})`, opacity: clamp01(k * 1.5) }}>
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}><path d="M3 2.5l17 7.2-7.3 2.2-2.4 7.6z" fill={color} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" /></svg>
    <div style={{ marginLeft: size * 0.75, marginTop: -size * 0.2, display: "inline-block", padding: "6px 14px", borderRadius: 14, background: color, color: "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: size * 0.62, whiteSpace: "nowrap" }}>{label}</div>
  </div>
);

/** The peach ground of the collaboration part (cream with terracotta and coral at the edges, warmer than Haze). */
export const Peach: React.FC<{ g: number; a: number; children?: React.ReactNode; v?: number }> = ({ g, a, children, v = 0 }) => {
  const s = Math.sin((g - a) * 0.035 + v);
  return (
    <AbsoluteFill style={{ background: "#F8EFE7", overflow: "hidden" }}>
      <Glow x={1980} y={120 + 40 * s} w={900} h={900} color={C.gCoral} blur={150} opacity={0.75} />
      <Glow x={-60} y={-80} w={700} h={520} color={C.gSage} blur={150} opacity={0.55} />
      <Glow x={1800} y={1180} w={900} h={500} color={C.gApricot} blur={140} opacity={0.6} />
      <Glow x={200 + 60 * s} y={1150} w={800} h={400} color={C.gTerra} blur={150} opacity={0.35} />
      {children}
      <Grain opacity={0.1} seed={Math.floor(a / 30)} />
    </AbsoluteFill>
  );
};

// ---- 34–35 s: "Tilføj din chatbot" -------------------------------------------------------------------------------------------
export const C1: React.FC<{ g: number }> = ({ g }) => {
  const t = g - 1020;
  return (
    <Peach g={g} a={1012}>
      <Flow g={g} size={112} y={520} words={[{ t: "Tilføj", f: 1020 }, { t: "din", f: 1026 }, { t: "chatbot", f: 1032, italic: true, color: C.sageDeep }]} />
      {g >= 1026 && <Pointer x={lerp(700, 650, pr(g, 1026, 24, SOFT)) + 8 * Math.sin(t * 0.2)} y={lerp(640, 680, pr(g, 1026, 24, SOFT))} label="Kunde" color={C.gCoral} k={px(g, 1026, 8)} size={58} />}
      {g >= 1032 && <Pointer x={lerp(1330, 1390, pr(g, 1032, 18, SOFT))} y={lerp(600, 630, pr(g, 1032, 18, SOFT)) + 6 * Math.sin(t * 0.23)} label="Chatbot" color={C.sageDeep} k={px(g, 1032, 8)} size={58} />}
    </Peach>
  );
};

// ---- 35–36 s: the click on "Chatbot" in the top bar ------------------------------------------------------------------------
const Z2 = 2.4, OX2 = 1050 - 1410 * Z2, OY2 = 360 - 41 * Z2;
export const C2: React.FC<{ g: number }> = ({ g }) => {
  const s = lerp(1, 0.95, pr(g, 1050, 30, SOFT));
  const bc = centre(BTN_CHAT), tx = OX2 + bc.x * Z2 + 10, ty = OY2 + bc.y * Z2 + 18;
  const cur = path(g, [{ f: 1050, x: 1250, y: 1150 }, { f: 1062, x: tx, y: ty }, { f: 1080, x: tx + 20, y: ty + 30 }]);
  const pk = press(g, 1063);
  return (
    <Peach g={g} a={1050} v={1}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "960px 540px" }}>
        <div style={{ position: "absolute", left: OX2, top: OY2, transform: `scale(${Z2})`, transformOrigin: "0 0", filter: "drop-shadow(0 30px 40px rgba(120,60,30,0.18))" }}>
          <Builder g={g} brand={1} from={792} steps={STEPS(g, 0)} chatPress={pk} video={false} />
        </div>
      </div>
      <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={230} press={pk} />
    </Peach>
  );
};

// ---- 36–37.5 s: the set-up card ------------------------------------------------------------------------------------------------
const HELLO = "Hej! Hvad kan jeg hjælpe dig med?";
const SetupCard: React.FC<{ g: number; save: number }> = ({ g, save }) => {
  const n = Math.max(0, Math.min(HELLO.length, Math.floor((g - 1084) * 40 / 30)));
  const rows: [string, string, number][] = [["clock", "Åbningstider", 0], ["tag", "Priser og buketter", 1], ["truck", "Levering", 2]];
  return (
    <div style={{ width: 940, padding: "40px 44px", borderRadius: 30, background: "#FFFFFF", boxShadow: "0 50px 100px -40px rgba(120,60,30,0.4), 0 2px 8px rgba(0,0,0,0.06)", fontFamily: F.ui, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Icon name="chat" size={34} color={C.sageDeep} stroke={2.2} /><div style={{ fontSize: 32, fontWeight: 700 }}>Chatbot</div>
        <div style={{ marginLeft: "auto", fontSize: 18, color: C.muted }}>Svarer dine kunder døgnet rundt</div></div>
      <div style={{ marginTop: 30, fontSize: 18, fontWeight: 600, color: C.muted }}>Velkomstbesked</div>
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        <div style={{ flex: 1, height: 66, borderRadius: 14, border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 20px", fontSize: 23, color: C.ink }}>
          {HELLO.slice(0, n)}{save < 0.5 && <Caret g={g} h={26} color={C.sageDeep} />}</div>
        <Btn label={save > 0.5 ? "Gemt" : "Gem"} icon={save > 0.5 ? "check" : undefined} tone={save > 0.5 ? "sage" : "grey"} size={22} press={press(g, 1104)} style={{ height: 66, minWidth: 130, justifyContent: "center" }} />
      </div>
      <div style={{ marginTop: 26 }}>
        {rows.map(([ic, label, i]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0", borderTop: i ? `1px solid ${C.line}` : undefined }}>
            <TopicTile i={i} d={50} /><div style={{ fontSize: 23, fontWeight: 600 }}>{label}</div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, fontSize: 20, color: C.muted }}>Lært<Check k={pr(g, 1086 + i * 5, 8)} size={30} /><Icon name={ic === "clock" ? "chevDown" : "chevDown"} size={20} color={C.faint} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};
export const C3: React.FC<{ g: number }> = ({ g }) => {
  const enter = px(g, 1080, 12), zoom = pr(g, 1110, 15, MOVE);
  const sc = lerp(0.9, 1, enter) * lerp(1, 1.75, zoom);
  const ox = lerp(0, -180, zoom), oy = lerp(0, 330, zoom);
  const bx = 960 + ox + 330 * sc, by = 540 + oy - 70 * sc;
  const cur = path(g, [{ f: 1080, x: 1100, y: 640 }, { f: 1100, x: 960 + 340, y: 540 - 50 }, { f: 1110, x: 960 + 340, y: 540 - 50 }, { f: 1125, x: bx + 20, y: by + 40 }]);
  return (
    <Peach g={g} a={1080} v={2}>
      <At x={960 + ox} y={540 + oy} s={sc} o={clamp01((g - 1080) / 5)}><SetupCard g={g} save={g >= 1106 ? 1 : 0} /></At>
      <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={lerp(150, 250, zoom)} press={press(g, 1104)} />
    </Peach>
  );
};

// ---- 37.5–39 s: what the chatbot knows, flying into the top bar ----------------------------------------------------------------
export const C4: React.FC<{ g: number }> = ({ g }) => {
  const fly = pr(g, 1152, 16, MOVE), bar = px(g, 1148, 12);
  const d = lerp(lerp(200, 184, pr(g, 1125, 25, SOFT)), 64, fly), gap = lerp(-16, -14, fly);
  const total = d * 5 + gap * 4, x0 = lerp(960, 900, fly) - total / 2, y = lerp(540, 250, fly);
  return (
    <Peach g={g} a={1125} v={3}>
      <div style={{ position: "absolute", left: -40, right: -40, top: lerp(-200, 186, bar), height: 128, background: "#FFFFFF", boxShadow: "0 20px 50px -30px rgba(120,60,30,0.4)", display: "flex", alignItems: "center", padding: "0 120px", gap: 24, fontFamily: F.ui }}>
        <Icon name="monitor" size={36} color={C.muted} /><Icon name="refresh" size={34} color={C.muted} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 18 }}><Btn label="Chatbot" icon="chat" tone="grey" size={28} /><Btn label="Køb · 499 kr." tone="sage" size={28} /></div>
      </div>
      {TOPICS.map((_, i) => {
        const k = clamp01((g - 1125 - i * 2) / 9), e = expoOut(9, 0.78)(k);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x0 + i * (d + gap)}px, ${y - d / 2 + 30 * (1 - e)}px, 0)`, opacity: k, filter: k < 1 ? `blur(${10 * (1 - e)}px)` : undefined, zIndex: 5 - i }}>
            <TopicTile i={i} d={d} /></div>
        );
      })}
    </Peach>
  );
};

// ---- 39–42 s: the builder, with the chat button on the site ---------------------------------------------------------------------
const ChatSide: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "absolute", left: 24, top: 124, right: 24, fontFamily: F.ui }}>
    <div style={{ fontFamily: F.serif, fontSize: 30, fontWeight: 500 }}>Din <i style={{ color: C.sageDeep }}>chatbot</i></div>
    <div style={{ fontSize: 15, color: C.muted, marginTop: 6 }}>Trænet på din hjemmeside</div>
    {["Åbningstider", "Priser og buketter", "Levering", "Buketter", "Kontakt"].map((t, i) => (
      <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
        <TopicTile i={i} d={34} /><div style={{ fontSize: 16, fontWeight: 600 }}>{t}</div><div style={{ marginLeft: "auto" }}><Check k={1} size={24} /></div>
      </div>
    ))}
    <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: C.sageTint, color: C.sageDeep, fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name="power" size={18} color={C.sageDeep} />Klar til at blive slået til</div>
  </div>
);
export const C5: React.FC<{ g: number }> = ({ g }) => {
  const out = expoOut(20, 0.84)(clamp01((g - 1170) / 20));
  const s = lerp(2.2, 0.8, out) * lerp(1, 1.04, pr(g, 1190, 70, SOFT));
  const fx = lerp(1300, 800, out), fy = lerp(41, 500, out);
  const rx = lerp(0, 7, out), ry = lerp(0, -9, out);
  const bubble = pr(g, 1196, 10);
  const wsx = 960 + (PREVIEW.x + PREVIEW.w - 54 - fx) * s, wsy = 560 + (PREVIEW.y + PREVIEW.h - 54 - fy) * s;
  const pt = path(g, [{ f: 1200, x: 820, y: 700 }, { f: 1250, x: wsx - 90, y: wsy - 40 }], SOFT);
  return (
    <Peach g={g} a={1170} v={4}>
      <div style={{ position: "absolute", inset: 0, perspective: 2600 }}>
        <div style={{ position: "absolute", left: 960 - fx * s, top: 560 - fy * s, width: WW, height: WH, transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`, transformOrigin: `${fx}px ${fy}px`,
          filter: "drop-shadow(0 40px 60px rgba(120,60,30,0.25))" }}>
          <Builder g={g} brand={1} from={792} side={<ChatSide g={g} />} topIcons={1} widget={1} widgetPing={((g - 1190) % 30) / 30}
            overlay={bubble > 0 ? <div style={{ position: "absolute", right: 110, bottom: 110, padding: "14px 20px", borderRadius: 20, borderBottomRightRadius: 6, background: "#fff", fontFamily: F.ui, fontSize: 19, color: C.plum,
              boxShadow: "0 16px 40px -16px rgba(60,20,30,0.45)", opacity: bubble, transform: `translateY(${(1 - bubble) * 14}px)` }}>Hej! Hvad kan jeg hjælpe dig med?</div> : undefined} />
        </div>
      </div>
      {g >= 1200 && <Pointer x={pt.x} y={pt.y} label="Kunde" color={C.gCoral} k={px(g, 1200, 8)} size={46} />}
    </Peach>
  );
};

// ---- 42–43.1 s: "Med ét klik", then the switch icon on the gradient ----------------------------------------------------------
export const C6: React.FC<{ g: number }> = ({ g }) => {
  if (g >= 1281) {
    const k = clamp01((g - 1281) / 8), e = expoOut(8, 0.78)(k);
    return (
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.gCoral} 0%, ${C.gTerra} 35%, ${C.gSage} 75%, ${C.gTeal} 100%)` }}>
        <Grain opacity={0.24} seed={31} />
        <At x={960} y={540} s={lerp(0.8, 1, e) * lerp(1, 1.05, pr(g, 1289, 6))} o={k}>
          <div style={{ width: 330, height: 330, borderRadius: 165, background: "radial-gradient(circle at 40% 30%, #FFFFFF 0%, #F2F7F4 55%, #D3EBE1 100%)", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 40px 80px -30px rgba(30,74,63,0.6), inset 0 -10px 30px rgba(61,131,113,0.25)", filter: k < 1 ? `blur(${10 * (1 - e)}px)` : undefined }}>
            <div style={{ width: 210, height: 210, borderRadius: 105, border: `16px solid ${C.gSage}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="power" size={120} color={C.gTeal} stroke={2.6} /></div>
          </div>
        </At>
      </AbsoluteFill>
    );
  }
  return (
    <Peach g={g} a={1252} v={5}>
      {g < 1268 ? <Words g={g} size={230} x={960} y={540} weight={600} words={[{ t: "Med", f: 1260 }]} n={8} />
        : <Flow g={g} size={130} y={540} weight={600} words={[{ t: "Med", f: 1200 }, { t: "ét", f: 1268 }, { t: "klik", f: 1273, italic: true, color: C.terraDeep }]} />}
    </Peach>
  );
};

// ---- 43.1–45 s: the activation chip ---------------------------------------------------------------------------------------------
const ChipBox: React.FC<{ g: number; on: number; pk: number }> = ({ g, on, pk }) => (
  <div style={{ width: 1160, height: 300, borderRadius: 34, background: C.panel, boxShadow: "0 50px 100px -40px rgba(60,30,20,0.6)", position: "relative", fontFamily: F.ui, color: "#F2F1EC" }}>
    <div style={{ position: "absolute", left: 44, top: 44, fontSize: 40, display: "flex", alignItems: "center" }}>Chatbot til Blomsterhuset Rosa<Caret g={g} h={44} color={C.gSage} w={4} /></div>
    <div style={{ position: "absolute", left: 40, bottom: 40, display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#C9CFCB" }}>
      <div style={{ width: 62, height: 62, borderRadius: 31, border: "2px solid #46524D", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={30} color="#C9CFCB" /></div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 10px" }}><Icon name="clock" size={32} color="#C9CFCB" />Svarer 24/7</div>
      <div style={{ height: 72, padding: "0 26px", borderRadius: 18, display: "flex", alignItems: "center", gap: 12, fontWeight: 600, color: "#fff", transform: `scale(${1 - 0.05 * pk})`,
        background: on > 0 ? `color-mix(in srgb, ${C.gTeal} ${on * 100}%, #2E3935)` : "#2E3935", boxShadow: on > 0 ? `0 0 ${50 * on}px rgba(143,192,174,${0.7 * on})` : undefined, border: `2px solid ${on > 0.5 ? C.gSage : "#46524D"}` }}>
        <Icon name="power" size={32} color="#fff" stroke={2.4} />{on > 0.5 ? "Aktiv" : "Aktivér"}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 10px" }}><Icon name="palette" size={32} color="#C9CFCB" />Stil<Icon name="chevDown" size={26} color="#C9CFCB" /></div>
    </div>
  </div>
);
export const C7: React.FC<{ g: number }> = ({ g }) => {
  const out = expoOut(14, 0.82)(clamp01((g - 1293) / 14));
  const s = lerp(1.9, 1, out), bx = lerp(1180, 930, out), by = lerp(330, 660, out);
  const chip = { x: bx + (-580 + 40 + 62 + 18 + 220 + 18 + 115) * s, y: by + (150 - 40 - 36) * s };
  const cur = path(g, [{ f: 1296, x: 1200, y: 1200 }, { f: 1316, x: chip.x + 10, y: chip.y + 26 }, { f: 1350, x: chip.x + 30, y: chip.y + 60 }]);
  const pk = press(g, 1318), on = pr(g, 1320, 8);
  return (
    <Peach g={g} a={1293} v={6}>
      <At x={bx} y={by} s={s}><ChipBox g={g} on={on} pk={pk} /></At>
      <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={220} press={pk} />
    </Peach>
  );
};

// ---- 45–54 s: the chatbot at work on the shop's site -----------------------------------------------------------------------------
const Q1 = "Kan I levere en buket i morgen?", Q2 = "Hvad koster en brudebuket?";
const tp = (g: number, a: number, s: string) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((g - a) * 36 / 30))));
const bubbles = (g: number): Bubble[] => [
  { from: "bot", text: "Hej! Velkommen til Blomsterhuset Rosa. Hvad kan jeg hjælpe dig med?", k: pr(g, 1388, 10) },
  { from: "me", text: Q1, k: pr(g, 1421, 9) },
  { from: "bot", text: "Ja! Bestil inden kl. 14, så leverer vi i morgen i hele København.", k: pr(g, 1438, 10) },
  { from: "me", text: Q2, k: pr(g, 1475, 9) },
  { from: "bot", text: "En brudebuket starter ved 895 kr. Her er vores mest populære:", k: pr(g, 1490, 10), card: pr(g, 1497, 10), cardPress: press(g, 1522), done: g >= 1525 ? 1 : 0 },
  { from: "bot", text: "Tak! Vi ringer dig op inden for en time.", k: pr(g, 1538, 10) },
];
const chatState = (g: number) => {
  const input = g < 1420 ? tp(g, 1394, Q1) : g >= 1448 && g < 1474 ? tp(g, 1450, Q2) : "";
  const dots = (g >= 1425 && g < 1438) || (g >= 1479 && g < 1490) || (g >= 1528 && g < 1538) ? 1 : 0;
  const sendPress = Math.max(press(g, 1418), press(g, 1472));
  return { input, dots, sendPress, caret: input.length > 0 };
};
export const C8: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1380) {
    // the builder on the peach ground; the cursor opens the chat
    const s = lerp(0.8, 0.86, pr(g, 1350, 30, SOFT));
    const wx = PREVIEW.x + PREVIEW.w - 54, wy = PREVIEW.y + PREVIEW.h - 54;
    const sx = 960 + (wx - WW / 2) * s, sy = 540 + (wy - WH / 2) * s;
    const cur = path(g, [{ f: 1350, x: 1100, y: 620 }, { f: 1369, x: sx + 6, y: sy + 10 }, { f: 1380, x: sx + 8, y: sy + 12 }]);
    return (
      <Peach g={g} a={1350} v={7}>
        <At x={960} y={540} s={s}><div style={{ filter: "drop-shadow(0 40px 60px rgba(120,60,30,0.25))" }}><Builder g={g} brand={1} from={792} side={<ChatSide g={g} />} topIcons={1} widget={1 - 0.06 * press(g, 1371)} widgetPing={((g - 1350) % 30) / 30} /></div></At>
        <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={120} press={press(g, 1371)} />
      </Peach>
    );
  }
  const st = chatState(g);
  if (g < 1560) {
    const enter = expoOut(12, 0.8)(clamp01((g - 1380) / 12));
    const zoom = pr(g, 1500, 22, MOVE);
    const s = lerp(1, 1.5, zoom), fx = lerp(1250, 1230, zoom), fy = lerp(540, 760, zoom);
    const cw = 600, ch = 820;
    const winX = 1250, winY = 540;
    const map = (x: number, y: number) => ({ x: (x - fx) * s + 960 + (fx - 960) * (1 - zoom), y: (y - fy) * s + 540 + (fy - 540) * (1 - zoom) });
    const btn = map(winX - cw / 2 + 20 + 340 - 70, winY + ch / 2 - 96 - 30);
    const cur = path(g, [{ f: 1500, x: 1500, y: 1200 }, { f: 1519, x: btn.x, y: btn.y }, { f: 1545, x: btn.x + 30, y: btn.y + 50 }, { f: 1560, x: btn.x + 60, y: btn.y + 90 }]);
    const ps = 1920 / BASE_W;
    return (
      <AbsoluteFill style={{ background: C.blush, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -60, transform: `scale(${ps * lerp(1.02, 1.06, pr(g, 1380, 180, SOFT))})`, transformOrigin: "0 0", filter: "blur(7px) saturate(1.05)" }}>
          <FlowerSite brand={1} from={792} video={false} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(59,34,41,0.12)" }} />
        <div style={{ position: "absolute", inset: 0, transform: `translate(${(960 - fx) * zoom}px, ${(540 - fy) * zoom}px) scale(${s})`, transformOrigin: `${fx}px ${fy}px` }}>
          <At x={winX} y={winY} s={lerp(0.3, 1, enter)} o={clamp01((g - 1380) / 6)} style={{ transformOrigin: "100% 100%" }}>
            <ChatWindow g={g} w={cw} h={ch} bubbles={bubbles(g)} input={st.input} caret={st.caret} dots={st.dots} sendPress={st.sendPress} />
          </At>
        </div>
        {g >= 1500 && <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={200} press={press(g, 1522)} />}
      </AbsoluteFill>
    );
  }
  // zoom out to the builder with the chat open on the site
  const out = expoOut(22, 0.86)(clamp01((g - 1560) / 22));
  const s = lerp(1.7, 0.8, out) * lerp(1, 1.03, pr(g, 1582, 38, SOFT));
  const fx = lerp(1380, 800, out), fy = lerp(700, 500, out), rx = 7 * out, ry = -10 * out;
  return (
    <Peach g={g} a={1560} v={8}>
      <div style={{ position: "absolute", inset: 0, perspective: 2600 }}>
        <div style={{ position: "absolute", left: 960 - fx * s, top: 560 - fy * s, width: WW, height: WH, transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`, transformOrigin: `${fx}px ${fy}px`, filter: "drop-shadow(0 40px 60px rgba(120,60,30,0.25))" }}>
          <Builder g={g} brand={1} from={792} side={<ChatSide g={g} />} topIcons={1} widget={1}
            overlay={<div style={{ position: "absolute", right: 40, bottom: 120, transform: "scale(0.62)", transformOrigin: "100% 100%" }}><ChatWindow g={g} w={600} h={820} bubbles={bubbles(g)} /></div>} />
        </div>
      </div>
    </Peach>
  );
};

export { BTN_BUY };
