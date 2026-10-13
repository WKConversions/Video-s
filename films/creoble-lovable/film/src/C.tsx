// 34–54 s, after the reference's frames at 30 fps: two labelled pointers drag "Tilføj din chatbot" together (the
// reference's collaborators), the click on Chatbot in a tight close-up, the set-up card, what the bot has learnt popping
// in and docking into the top bar as one camera pulls back to the tilted builder with visitors on the site, "Med ét klik",
// the power icon that fills the frame and zooms out into the Aktivér chip, and the chatbot answering a customer on the
// shop's site, down to an order, then a whip zoom out to the builder.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, MOVE, SOFT, clamp01, expoOut, lerp, mix, path, pr, press, px } from "./lib";
import { At, Btn, Caret, Check, Cursor, Flow, Glow, Grain, Icon, tw } from "./kit";
import { BTN_BUY, BTN_CHAT, Builder, Bubble, ChatWindow, PREVIEW, TOPICS, TopicTile, WH, WW, centre } from "./ui";
import { BASE_W, FlowerSite } from "./sites";
import { STEPS } from "./B";

/** An arrow pointer with a name tag (the reference's collaborator cursors). (x, y) is the arrow's tip. */
export const Pointer: React.FC<{ x: number; y: number; label: string; color: string; k?: number; size?: number }> = ({ x, y, label, color, k = 1, size = 60 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x - size * 0.12}px, ${y - size * 0.1}px, 0) scale(${0.7 + 0.3 * k})`, transformOrigin: "0 0", opacity: clamp01(k * 1.5) }}>
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.25))" }}><path d="M3 2.5l17 7.2-7.3 2.2-2.4 7.6z" fill={color} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" /></svg>
    <div style={{ marginLeft: size * 0.7, marginTop: -size * 0.25, display: "inline-flex", alignItems: "center", height: size * 1.1, padding: `0 ${size * 0.4}px`, borderRadius: size * 0.55, background: color, color: "#fff",
      fontFamily: F.ui, fontWeight: 600, fontSize: size * 0.5, whiteSpace: "nowrap" }}>{label}</div>
  </div>
);

/** The peach ground of the collaboration part (cream with terracotta and coral at the edges, warmer than Haze). */
export const Peach: React.FC<{ g: number; a: number; children?: React.ReactNode; v?: number }> = ({ g, a, children, v = 0 }) => {
  const s = Math.sin((g - a) * 0.065 + v), c = Math.cos((g - a) * 0.05 + v);
  return (
    <AbsoluteFill style={{ background: "#F8EFE7", overflow: "hidden" }}>
      <Glow x={1980 - 60 * c} y={120 + 140 * s} w={900} h={900} color={C.gCoral} blur={150} opacity={0.75} />
      <Glow x={-60 + 90 * s} y={-80 + 50 * c} w={700} h={520} color={C.gSage} blur={150} opacity={0.55} />
      <Glow x={1800 - 160 * s} y={1180} w={900} h={500} color={C.gApricot} blur={140} opacity={0.6} />
      <Glow x={200 + 180 * c} y={1150} w={800} h={400} color={C.gTerra} blur={150} opacity={0.35} />
      {children}
      <Grain opacity={0.1} seed={Math.floor(a / 30)} />
    </AbsoluteFill>
  );
};

/** A builder camera: the window's origin lands at (ox, oy) at scale s; logarithmic zooms that keep an anchor moving straight. */
type BCam = { s: number; ox: number; oy: number };
const zoomCam = (a: { s: number; ax: number; ay: number; wx: number; wy: number }, b: { s: number; ax: number; ay: number; wx: number; wy: number }, t: number): BCam => {
  const s = Math.exp(lerp(Math.log(a.s), Math.log(b.s), t));
  const wx = lerp(a.wx, b.wx, t), wy = lerp(a.wy, b.wy, t), ax = lerp(a.ax, b.ax, t), ay = lerp(a.ay, b.ay, t);
  return { s, ox: ax - wx * s, oy: ay - wy * s };
};
const BuilderAt: React.FC<{ cam: BCam; rx?: number; ry?: number; children: React.ReactNode; shadow?: boolean }> = ({ cam, rx = 0, ry = 0, children, shadow = true }) => (
  <div style={{ position: "absolute", inset: 0, perspective: 2600 }}>
    <div style={{ position: "absolute", left: cam.ox, top: cam.oy, width: WW, height: WH, transform: `scale(${cam.s}) rotateX(${rx}deg) rotateY(${ry}deg)`, transformOrigin: "0 0",
      filter: shadow ? "drop-shadow(0 40px 60px rgba(120,60,30,0.25))" : undefined }}>{children}</div>
  </div>
);

// ---- 33.93–35 s: "Tilføj din chatbot", dragged together by two pointers ----------------------------------------------------------
export const C1: React.FC<{ g: number }> = ({ g }) => {
  const size = 124, sp = tw(" ", size), wL = tw("Tilføj din", size), wR = tw("chatbot", size, 500, F.serif, true);
  const total = wL + sp + wR, left = 960 - total / 2, y = 540;
  const k = expoOut(14, 0.8)(clamp01((g - 1014) / 14));
  const dl = -560 * (1 - k), dr = 560 * (1 - k), op = clamp01((g - 1014) / 3), blur = 6 * (1 - clamp01((g - 1014) / 4));
  const base = { position: "absolute" as const, left: 0, top: 0, fontFamily: F.serif, fontWeight: 500, fontSize: size, whiteSpace: "pre" as const, lineHeight: 1.24, opacity: op, filter: blur > 0.2 ? `blur(${blur}px)` : undefined };
  const tipL = { x: left + dl + wL * 0.3, y: y + size * 0.4 }, tipR = { x: left + wL + sp + dr + wR * 0.55, y: y + size * 0.4 };
  return (
    <Peach g={g} a={1000}>
      <div style={{ ...base, transform: `translate3d(${left + dl}px, ${y - size * 0.62}px, 0)`, color: C.ink }}>Tilføj din</div>
      <div style={{ ...base, transform: `translate3d(${left + wL + sp + dr}px, ${y - size * 0.62}px, 0)`, color: C.sageDeep, fontStyle: "italic" }}>chatbot</div>
      <Pointer x={tipL.x + 4 * Math.sin(g * 0.2)} y={tipL.y} label="Kunde" color={C.gCoral} k={op} />
      <Pointer x={tipR.x} y={tipR.y + 4 * Math.sin(g * 0.23)} label="Chatbot" color={C.sageDeep} k={op} />
    </Peach>
  );
};

// ---- 35–36 s: the click on "Chatbot", close on the two buttons ----------------------------------------------------------------
const Z2 = 4.4, PAIR = { x: (BTN_CHAT.x + BTN_BUY.x + BTN_BUY.w) / 2, y: 41 }, OX2 = 960 - PAIR.x * Z2, OY2 = 380 - PAIR.y * Z2;
export const TopBarClose: React.FC<{ g: number; a: number; chatPress?: number; buyPress?: number; children?: React.ReactNode }> = ({ g, a, chatPress = 0, buyPress = 0, children }) => {
  const s = lerp(1.03, 0.97, pr(g, a, 30, SOFT));
  return (
    <Peach g={g} a={a} v={1}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "960px 380px", willChange: "transform" }}>
        <div style={{ position: "absolute", left: OX2, top: OY2, transform: `scale(${Z2})`, transformOrigin: "0 0", filter: "drop-shadow(0 30px 40px rgba(120,60,30,0.18))" }}>
          <Builder g={g} brand={1} from={792} steps={STEPS(g, 0)} chatPress={chatPress} buyPress={buyPress} topIcons={a > 1500 ? 1 : 0} video={false} />
        </div>
      </div>
      {children}
    </Peach>
  );
};
export const C2: React.FC<{ g: number }> = ({ g }) => {
  const bc = centre(BTN_CHAT), tx = OX2 + bc.x * Z2 + 20, ty = OY2 + bc.y * Z2 + 26;
  const cur = path(g, [{ f: 1050, x: 1250, y: 1180 }, { f: 1061, x: tx, y: ty }, { f: 1080, x: tx + 14, y: ty + 20 }]);
  const pk = press(g, 1063);
  return <TopBarClose g={g} a={1050} chatPress={pk}><Cursor x={cur.x} y={cur.y} vx={cur.vx} vy={cur.vy} h={300} press={pk} /></TopBarClose>;
};

// ---- 36–37.3 s: the set-up card ---------------------------------------------------------------------------------------------------
const HELLO = "Hej! Hvad kan jeg hjælpe dig med?";
const CARD_W = 1060;
const SetupCard: React.FC<{ g: number; save: number }> = ({ g, save }) => {
  const n = Math.max(0, Math.min(HELLO.length, Math.floor((g - 1081) * 42 / 30)));
  const rows: [string, number][] = [["Åbningstider", 0], ["Priser og buketter", 1], ["Levering", 2]];
  return (
    <div style={{ width: CARD_W, padding: "44px 50px", borderRadius: 34, background: "#FFFFFF", boxShadow: "0 50px 100px -40px rgba(120,60,30,0.4), 0 2px 8px rgba(0,0,0,0.06)", fontFamily: F.ui, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Icon name="chat" size={46} color={C.sageDeep} stroke={2.2} /><div style={{ fontSize: 44, fontWeight: 700 }}>Chatbot</div></div>
      <div style={{ marginTop: 30, fontSize: 26, fontWeight: 600, color: C.muted }}>Velkomstbesked</div>
      <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
        <div style={{ flex: 1, height: 88, borderRadius: 18, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 24px", fontSize: 32, color: C.ink }}>
          {HELLO.slice(0, n)}{save < 0.5 && <Caret g={g} h={36} color={C.sageDeep} />}</div>
        <Btn label={save > 0.5 ? "Gemt" : "Gem"} icon={save > 0.5 ? "check" : undefined} tone={save > 0.5 ? "sage" : "grey"} size={30} press={press(g, 1100)} style={{ height: 88, width: 170, padding: 0, justifyContent: "center" }} />
      </div>
      <div style={{ marginTop: 24 }}>
        {rows.map(([label, i]) => {
          const k = pr(g, 1080 + i * 3, 7);
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 0", borderTop: i ? `1.5px solid ${C.line}` : undefined, opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
              <TopicTile i={i} d={64} /><div style={{ fontSize: 34, fontWeight: 600 }}>{label}</div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, fontSize: 28, color: C.muted }}>Lært<Check k={pr(g, 1086 + i * 4, 8)} size={40} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const C3: React.FC<{ g: number }> = ({ g }) => {
  const settle = lerp(1.05, 1, expoOut(9, 0.8)(clamp01((g - 1080) / 9))), zoom = pr(g, 1104, 14, MOVE);
  const sc = settle * lerp(1, 1.6, zoom), ox = lerp(0, -250, zoom), oy = lerp(0, 300, zoom);
  const gem = { x: 960 + ox + (CARD_W / 2 - 50 - 85) * sc, y: 540 + oy + (-292 + 44 + 51 + 30 + 12 + 44) * sc };
  const cur = path(g, [{ f: 1080, x: 1200, y: 760 }, { f: 1097, x: gem.x + 10, y: gem.y + 22 }, { f: 1104, x: gem.x + 10, y: gem.y + 22 }, { f: 1119, x: gem.x + 14, y: gem.y + 30 }]);
  return (
    <Peach g={g} a={1080} v={2}>
      <At x={960 + ox} y={540 + oy} s={sc}><SetupCard g={g} save={g >= 1102 ? 1 : 0} /></At>
      <Cursor x={cur.x} y={cur.y} vx={cur.vx} vy={cur.vy} h={lerp(170, 260, zoom)} press={press(g, 1100)} />
    </Peach>
  );
};

// ---- 37.3–41.6 s: what the bot knows pops in; one camera pulls back from it through the top bar to the tilted builder ----------
const ICON_W = { x: BTN_CHAT.x - 190 + 75, y: 41 };          // the centre of the top bar's topic tiles, in window units
const S0 = 250 / 38;                                           // the tiles at 250 px
const ChatSide: React.FC = () => (
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
const Hello: React.FC<{ k: number }> = ({ k }) => (
  <div style={{ position: "absolute", right: 100, bottom: 26, padding: "12px 18px", borderRadius: 18, borderBottomRightRadius: 6, background: "#fff", fontFamily: F.ui, fontSize: 18, color: C.plum,
    boxShadow: "0 16px 40px -16px rgba(60,20,30,0.45)", opacity: k, transform: `translateY(${(1 - k) * 12}px)`, whiteSpace: "nowrap" }}>Hej! Hvad kan jeg hjælpe dig med?</div>
);
export const C4: React.FC<{ g: number }> = ({ g }) => {
  const A0 = { s: S0 * lerp(1, 0.97, pr(g, 1119, 27, SOFT)), ax: 960, ay: 540, wx: ICON_W.x, wy: ICON_W.y };
  const A1 = { s: 1.25, ax: 1250, ay: 112, wx: ICON_W.x, wy: ICON_W.y };
  const A2 = { s: 0.92, ax: 980, ay: 560, wx: 800, wy: 500 };
  let cam: BCam, rx = 0, ry = 0;
  if (g < 1146) cam = zoomCam(A0, A0, 0);
  else if (g < 1185) cam = zoomCam(A0, A1, pr(g, 1146, 39, MOVE));
  else {
    const c1 = zoomCam(A1, A1, 0), a1c = { s: 1.25, ax: c1.ox + 800 * 1.25, ay: c1.oy + 500 * 1.25, wx: 800, wy: 500 };
    const t = pr(g, 1185, 60, SOFT); cam = zoomCam(a1c, A2, t); rx = 6 * t; ry = -8 * t;
  }
  const bk = pr(g, 1146, 10);                                  // the builder fades in round the tiles as the camera pulls back
  const toS = (wx: number, wy: number) => ({ x: cam.ox + wx * cam.s, y: cam.oy + wy * cam.s });
  const launch = toS(PREVIEW.x + PREVIEW.w - 54, PREVIEW.y + PREVIEW.h - 54);
  const v1 = path(g, [{ f: 1196, x: toS(700, 420).x, y: toS(700, 420).y }, { f: 1244, x: launch.x - 70, y: launch.y - 120 }], SOFT);
  const v2 = path(g, [{ f: 1200, x: toS(1000, 300).x, y: toS(1000, 300).y }, { f: 1244, x: toS(820, 360).x, y: toS(820, 360).y }], SOFT);
  const v3 = path(g, [{ f: 1204, x: toS(1240, 720).x, y: toS(1240, 720).y }, { f: 1244, x: toS(1080, 700).x, y: toS(1080, 700).y }], SOFT);
  return (
    <Peach g={g} a={1119} v={3}>
      {bk > 0 && <div style={{ opacity: bk }}><BuilderAt cam={cam} rx={rx} ry={ry}>
        <Builder g={g} brand={1} from={792} side={<ChatSide />} topIcons={1} widget={1} widgetPing={((g - 1190) % 30 + 30) % 30 / 30} overlay={<Hello k={pr(g, 1196, 10)} />} />
      </BuilderAt></div>}
      {bk < 1 && TOPICS.map((_, i) => {
        const d = 38 * cam.s, gap = -10 * cam.s, total = d * 5 + gap * 4;
        const x0 = cam.ox + ICON_W.x * cam.s - total / 2, y = cam.oy + ICON_W.y * cam.s;
        const k = clamp01((g - 1117 - i * 3) / 6), sp = k >= 1 ? 1 : lerp(0.6, 1, k) + 0.08 * Math.sin(k * Math.PI);
        return <div key={i} style={{ position: "absolute", left: x0 + i * (d + gap), top: y - d / 2, transform: `scale(${sp})`, opacity: clamp01(k * 3), zIndex: 5 - i }}><TopicTile i={i} d={d} /></div>;
      })}
      {g >= 1196 && <Pointer x={v1.x} y={v1.y} label="Kunde" color={C.gCoral} k={px(g, 1196, 8)} size={46} />}
      {g >= 1200 && <Pointer x={v2.x} y={v2.y} label="Mette" color={C.sageDeep} k={px(g, 1200, 8)} size={46} />}
      {g >= 1204 && <Pointer x={v3.x} y={v3.y} label="Lars" color={C.terraDeep} k={px(g, 1204, 8)} size={46} />}
    </Peach>
  );
};

// ---- 41.6–42.43 s: "Med ét klik" ---------------------------------------------------------------------------------------------------
export const C6: React.FC<{ g: number }> = ({ g }) => (
  <Peach g={g} a={1235} v={5}>
    <Flow g={g} size={150} y={560} weight={600} words={[{ t: "Med", f: 1249 }, { t: "ét", f: 1255 }, { t: "klik", f: 1261, italic: true, color: C.terraDeep }]} />
  </Peach>
);

// ---- 42.43–45 s: the power icon fills the frame, zooms out into the Aktivér chip, the click ------------------------------------------
const CHIP = { x: 368, y: 188, w: 210, h: 72 }, ICON_AT = { x: CHIP.x + 30 + 16, y: CHIP.y + CHIP.h / 2 };
const CHIP_IDLE = mix(C.panel, C.gTeal, 0.62);
const ChipBox: React.FC<{ g: number; on: number; pk: number }> = ({ g, on, pk }) => (
  <div style={{ width: 1160, height: 300, borderRadius: 34, background: C.panel, boxShadow: "0 50px 100px -40px rgba(60,30,20,0.6)", position: "relative", fontFamily: F.ui, color: "#F2F1EC" }}>
    <div style={{ position: "absolute", left: 44, top: 44, fontSize: 40, display: "flex", alignItems: "center" }}>Chatbot til Blomsterhuset Rosa<Caret g={g} h={44} color={C.gSage} w={4} /></div>
    <div style={{ position: "absolute", left: 40, top: CHIP.y + 5, width: 62, height: 62, borderRadius: 31, border: "2px solid #46524D", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={30} color="#C9CFCB" /></div>
    <div style={{ position: "absolute", left: 124, top: CHIP.y, height: 72, display: "flex", alignItems: "center", gap: 10, fontSize: 30, color: "#C9CFCB" }}><Icon name="clock" size={32} color="#C9CFCB" />Svarer 24/7</div>
    <div style={{ position: "absolute", left: CHIP.x, top: CHIP.y, width: CHIP.w, height: CHIP.h, borderRadius: 18, transform: `scale(${1 - 0.05 * pk})`, boxSizing: "border-box",
      background: on > 0 ? mix(CHIP_IDLE, C.gTeal, on) : CHIP_IDLE, boxShadow: on > 0 ? `0 0 ${50 * on}px rgba(143,192,174,${0.7 * on})` : undefined, border: `2px solid ${C.gSage}` }}>
      <div style={{ position: "absolute", left: 30, top: CHIP.h / 2 - 16 }}><Icon name="power" size={32} color="#fff" stroke={2.4} /></div>
      <div style={{ position: "absolute", left: 76, top: 0, height: CHIP.h, display: "flex", alignItems: "center", fontSize: 30, fontWeight: 600, color: "#fff" }}>{on > 0.5 ? "Aktiv" : "Aktivér"}</div>
    </div>
    <div style={{ position: "absolute", left: CHIP.x + CHIP.w + 26, top: CHIP.y, height: 72, display: "flex", alignItems: "center", gap: 10, fontSize: 30, color: "#C9CFCB" }}><Icon name="palette" size={32} color="#C9CFCB" />Stil<Icon name="chevDown" size={26} color="#C9CFCB" /></div>
  </div>
);
export const C7: React.FC<{ g: number }> = ({ g }) => {
  const KC = 12;
  if (g < 1287) {
    // the glyph alone, three to four frames high, shrinking to the chip's icon while the ground turns into the chip's fill
    const t = expoOut(14, 0.84)(clamp01((g - 1273) / 14)), size = lerp(4300, 32 * KC, t), fill = pr(g, 1278, 9, SOFT);
    return (
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.gCoral} 0%, ${C.gTerra} 35%, ${C.gSage} 75%, ${C.gTeal} 100%)`, overflow: "hidden" }}>
        <AbsoluteFill style={{ background: CHIP_IDLE, opacity: fill }} />
        <Grain opacity={0.2 * (1 - fill)} seed={31} />
        <At x={960} y={540}><Icon name="power" size={size} color="#fff" stroke={2.4} style={{ display: "block", filter: "drop-shadow(0 0 40px rgba(255,255,255,0.35))" }} /></At>
      </AbsoluteFill>
    );
  }
  const FIN = { s: 1.8, ax: 9 + ICON_AT.x * 1.8, ay: 197 + ICON_AT.y * 1.8 };
  const t = expoOut(18, 0.84)(clamp01((g - 1287) / 18));
  const s = Math.exp(lerp(Math.log(KC), Math.log(FIN.s), t)) * lerp(1, 0.92, pr(g, 1305, 45, SOFT));
  const ax = lerp(960, FIN.ax, t), ay = lerp(540, FIN.ay, t), ox = ax - ICON_AT.x * s, oy = ay - ICON_AT.y * s;
  const chip = { x: ox + (CHIP.x + CHIP.w / 2) * s, y: oy + (CHIP.y + CHIP.h / 2) * s };
  const cur = path(g, [{ f: 1298, x: 1150, y: 1200 }, { f: 1315, x: chip.x + 10, y: chip.y + 8 }, { f: 1350, x: chip.x + 22, y: chip.y + 26 }]);
  const pk = press(g, 1318), on = pr(g, 1320, 7);
  return (
    <Peach g={g} a={1287} v={6}>
      <div style={{ position: "absolute", left: ox, top: oy, transform: `scale(${s})`, transformOrigin: "0 0" }}><ChipBox g={g} on={on} pk={pk} /></div>
      {g >= 1298 && <Cursor x={cur.x} y={cur.y} vx={cur.vx} vy={cur.vy} h={220} press={pk} />}
    </Peach>
  );
};

// ---- 45–53.7 s: the chatbot at work on the shop's site ------------------------------------------------------------------------------
const Q1 = "Kan I levere en buket i morgen?", Q2 = "Hvad koster en brudebuket?";
const tp = (g: number, a: number, s: string) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((g - a) * 36 / 30))));
const bubbles = (g: number): Bubble[] => [
  { from: "bot", text: "Hej! Velkommen til Blomsterhuset Rosa. Hvad kan jeg hjælpe dig med?", k: g >= 1381 ? 1 : pr(g, 1374, 6) },
  { from: "me", text: Q1, k: pr(g, 1421, 9) },
  { from: "bot", text: "Ja! Bestil inden kl. 14, så leverer vi i morgen i hele København.", k: pr(g, 1438, 10) },
  { from: "me", text: Q2, k: pr(g, 1475, 9) },
  { from: "bot", text: "En brudebuket starter ved 895 kr. Her er vores mest populære:", k: pr(g, 1490, 10), card: pr(g, 1497, 10), cardPress: press(g, 1522), done: g >= 1525 ? 1 : 0 },
  { from: "bot", text: "Tak! Vi ringer dig op inden for en time.", k: pr(g, 1538, 10) },
];
const chatState = (g: number) => {
  const input = g < 1420 && g >= 1394 ? tp(g, 1394, Q1) : g >= 1448 && g < 1474 ? tp(g, 1450, Q2) : "";
  const dots = (g >= 1425 && g < 1438) || (g >= 1479 && g < 1490) || (g >= 1528 && g < 1538) ? 1 : 0;
  const sendPress = Math.max(press(g, 1418), press(g, 1472));
  return { input, dots, sendPress, caret: input.length > 0 };
};
const CW = 600, CHH = 740, CS = 1.3, WIN = { x: 1290, y: 540 };
const winTL = { x: WIN.x - (CW * CS) / 2, y: WIN.y - (CHH * CS) / 2 };
const chatPt = (lx: number, ly: number) => ({ x: winTL.x + lx * CS, y: winTL.y + ly * CS });
export const C8: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1381) {
    // the builder on the peach ground; the cursor opens the chat, which opens out of its button
    const s = lerp(0.8, 0.86, pr(g, 1350, 31, SOFT));
    const wx = PREVIEW.x + PREVIEW.w - 54, wy = PREVIEW.y + PREVIEW.h - 54;
    const sx = 960 + (wx - WW / 2) * s, sy = 540 + (wy - WH / 2) * s;
    const cur = path(g, [{ f: 1350, x: 1100, y: 620 }, { f: 1364, x: sx + 6, y: sy + 10 }, { f: 1381, x: sx + 12, y: sy + 20 }]);
    const open = expoOut(12, 0.8)(clamp01((g - 1368) / 12));
    return (
      <Peach g={g} a={1350} v={7}>
        <At x={960} y={540} s={s}><div style={{ filter: "drop-shadow(0 40px 60px rgba(120,60,30,0.25))" }}>
          <Builder g={g} brand={1} from={792} side={<ChatSide />} topIcons={1} widget={1 - 0.06 * press(g, 1366)} widgetPing={((g - 1350) % 30) / 30}
            overlay={open > 0 ? <div style={{ position: "absolute", right: 30, bottom: 100, transform: `scale(${0.62 * open})`, transformOrigin: "100% 100%", opacity: clamp01(open * 3) }}>
              <ChatWindow g={g} w={CW} h={CHH} bubbles={bubbles(g)} top /></div> : undefined} />
        </div></At>
        <Cursor x={cur.x} y={cur.y} vx={cur.vx} vy={cur.vy} h={120} press={press(g, 1366)} />
      </Peach>
    );
  }
  const st = chatState(g);
  if (g < 1576) {
    // the close-up: the chat fixed to the page; the page racks into focus; the camera eases out, pans, closes on the card
    const out = pr(g, 1395, 45, SOFT), pan = pr(g, 1458, 22, SOFT), card = pr(g, 1500, 22, MOVE), whip = clamp01((g - 1572) / 4);
    const CARD = chatPt(190, 520);
    let s = lerp(1, 0.93, out), fx = lerp(1000, 960, pan), fy = 540;
    s = lerp(s, 1.5, card); fx = lerp(fx, CARD.x, card); fy = lerp(fy, CARD.y, card);
    s = s * lerp(1, 0.45, whip * whip);
    const toS = (p: { x: number; y: number }) => ({ x: (p.x - fx) * s + 960, y: (p.y - fy) * s + 540 });
    const send = toS(chatPt(CW - 49, CHH - 48)), bestil = toS(chatPt(300, 610));
    const cur = path(g, [{ f: 1381, x: send.x + 120, y: send.y + 150 }, { f: 1410, x: send.x + 40, y: send.y + 60 }, { f: 1416, x: send.x + 4, y: send.y + 8 },
      { f: 1428, x: send.x + 60, y: send.y + 90 }, { f: 1466, x: send.x + 50, y: send.y + 70 }, { f: 1470, x: send.x + 4, y: send.y + 8 }, { f: 1484, x: send.x + 70, y: send.y + 80 },
      { f: 1517, x: bestil.x, y: bestil.y }, { f: 1545, x: bestil.x + 20, y: bestil.y + 40 }, { f: 1576, x: bestil.x + 30, y: bestil.y + 60 }]);
    const ps = 1920 / BASE_W, focus = lerp(9, 1.2, pr(g, 1381, 14, SOFT));
    const pk = Math.max(press(g, 1418), press(g, 1472), press(g, 1522));
    return (
      <AbsoluteFill style={{ background: C.blush, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${960 - fx}px, ${540 - fy}px) scale(${s})`, transformOrigin: `${fx}px ${fy}px`, filter: whip > 0 ? `blur(${10 * whip}px)` : undefined }}>
          <div style={{ position: "absolute", left: 0, top: -60, transform: `scale(${ps})`, transformOrigin: "0 0", filter: `blur(${focus}px)` }}><FlowerSite brand={1} from={792} video={false} /></div>
          <div style={{ position: "absolute", inset: 0, background: "rgba(59,34,41,0.06)" }} />
          <div style={{ position: "absolute", left: winTL.x, top: winTL.y, transform: `scale(${CS})`, transformOrigin: "0 0" }}>
            <ChatWindow g={g} w={CW} h={CHH} bubbles={bubbles(g)} input={st.input} caret={st.caret} dots={st.dots} sendPress={st.sendPress} top />
          </div>
        </div>
        {whip < 0.5 && <Cursor x={cur.x} y={cur.y} vx={cur.vx} vy={cur.vy} h={170 * Math.max(1, s * 0.8)} press={pk} />}
      </AbsoluteFill>
    );
  }
  // the whip lands on the tilted builder with the chat open on the site, centred with even margins
  const land = expoOut(8, 0.8)(clamp01((g - 1576) / 8));
  const s = 0.78 * lerp(1.12, 1, land) * lerp(1, 1.02, pr(g, 1584, 27, SOFT));
  return (
    <Peach g={g} a={1560} v={8}>
      <div style={{ position: "absolute", inset: 0, perspective: 2600, filter: land < 1 ? `blur(${8 * (1 - land)}px)` : undefined }}>
        <div style={{ position: "absolute", left: 960 - WW / 2, top: 545 - WH / 2, width: WW, height: WH, transform: `scale(${s}) rotateX(7deg) rotateY(-10deg)`, filter: "drop-shadow(0 40px 60px rgba(120,60,30,0.25))" }}>
          <Builder g={g} brand={1} from={792} side={<ChatSide />} topIcons={1} widget={1}
            overlay={<div style={{ position: "absolute", right: 30, bottom: 100, transform: "scale(0.62)", transformOrigin: "100% 100%" }}><ChatWindow g={g} w={CW} h={CHH} bubbles={bubbles(g)} top /></div>} />
        </div>
      </div>
    </Peach>
  );
};

export { BTN_BUY };
