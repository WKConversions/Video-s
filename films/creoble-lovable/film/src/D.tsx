// 53.7–80.49 s, after the reference's frames at 30 fps: "Se resultatet helt gratis" cut in word by word on the gradient and
// "før du betaler noget" typed, the click on "Køb · 499 kr." in close-up, the purchase card, the shop's site in a browser
// and on a laptop in the shop, "Oplev" and "nem hosting" typed, the hosting switch, the domain set-up on a dark hosting view,
// "Gå online" typed, "med dit eget domæne", "uden teknisk bøvl", "Din hjemmeside starter her — Hvad vil du skabe?" in the
// glow of Creoble's mark, the logo and creoble.dk.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, F, GRAD, MOVE, SOFT, clamp01, expoOut, lerp, path, pr, press } from "./lib";
import { At, Btn, Caret, Check, Cursor, Flow, Glow, Grain, Icon, Mark, Switch, Words, Wordmark, tw } from "./kit";
import { Gradient, Laptop } from "./A";
import { Peach, TopBarClose } from "./C";
import { Halo } from "./B";
import { BTN_BUY, Builder, PREVIEW, WH, WW, centre } from "./ui";
import { Browser, ChatButton, FlowerSite } from "./sites";

const LIGHT_TEXT = "linear-gradient(180deg, #FFFFFF 20%, #FCE6CF 100%)";

/** A word that cuts in: opaque within two frames, a short slide and a moment of motion blur (the reference's hard word cuts). */
const Cut: React.FC<{ g: number; f: number; text: string; size: number; y?: number; italic?: boolean; weight?: number; shadow?: string }> =
  ({ g, f, text, size, y = 560, italic, weight = 650, shadow }) => {
    if (g < f) return null;
    const k = clamp01((g - f + 1) / 3), e = expoOut(6, 0.75)(clamp01((g - f) / 6));
    return (
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translate3d(${14 * (1 - e)}px, ${y - size * 0.66 + 8 * (1 - e)}px, 0)`, opacity: k,
        filter: e < 0.6 ? `blur(${4 * (1 - e)}px)` : undefined, fontFamily: F.serif, fontWeight: weight, fontSize: size, fontStyle: italic ? "italic" : "normal", letterSpacing: -size * 0.02,
        lineHeight: 1.24, whiteSpace: "pre", textShadow: shadow, backgroundImage: LIGHT_TEXT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{text}</div>
    );
  };

// ---- 53.7–57 s: "Se resultatet helt gratis før du betaler noget" ----------------------------------------------------------------
const FOER = "før du betaler noget";
export const D1: React.FC<{ g: number }> = ({ g }) => {
  const n = Math.max(0, Math.min(FOER.length, Math.floor(g - 1667) + 1)), fullW = tw(FOER, 92, 500, F.ui);
  const bloom = Math.pow(clamp01((g - 1702) / 8), 2);
  return (
    <Gradient g={g} a={1624} lift={26} seed={41} bloom={bloom}>
      {g < 1638 && <Cut g={g} f={1625} text="Se resultatet" size={205} shadow="0 20px 60px rgba(150,50,20,0.12)" />}
      {g >= 1638 && g < 1652 && <Cut g={g} f={1638} text="helt" size={480} />}
      {g >= 1652 && g < 1667 && <Cut g={g} f={1652} text="gratis" size={480} italic weight={600} />}
      {g >= 1667 && (
        <div style={{ position: "absolute", left: 960 - fullW / 2, top: 560 - 92 * 0.66, fontFamily: F.ui, fontWeight: 500, fontSize: 92, color: "#FFF8F0", whiteSpace: "pre", lineHeight: 1.24,
          textShadow: "0 8px 30px rgba(150,50,20,0.25)", opacity: 1 - bloom }}>
          {FOER.slice(0, n)}<span style={{ display: "inline-block", width: 6, height: 96, marginLeft: 6, verticalAlign: "middle", background: "#FFF8F0", opacity: n < FOER.length || Math.floor(g / 8) % 2 === 0 ? 1 : 0 }} />
        </div>
      )}
    </Gradient>
  );
};

// ---- 57–63 s: the click on "Køb · 499 kr.", the purchase card, the browser, the laptop in the shop ---------------------------------
const CARD = { w: 1100, h: 606 }, BUY_AT = { x: 50 + 210, y: 460 + 48 };
const BuyCard: React.FC<{ g: number }> = ({ g }) => {
  const url = "blomsterhuset-rosa.creoble.dk", n = Math.max(0, Math.min(url.length, Math.floor((g - 1738) * 45 / 30)));
  const paid = g >= 1786;
  return (
    <div style={{ width: CARD.w, height: CARD.h, borderRadius: 36, background: "#FFFFFF", boxShadow: "0 60px 110px -40px rgba(120,60,30,0.45), 0 2px 8px rgba(0,0,0,0.06)", fontFamily: F.ui, position: "relative" }}>
      <div style={{ position: "absolute", left: 50, top: 46, fontFamily: F.serif, fontSize: 58, fontWeight: 500, lineHeight: 1.2 }}>Din hjemmeside er <i style={{ color: C.sageDeep }}>klar</i></div>
      <div style={{ position: "absolute", left: 50, top: 136, fontSize: 30, color: C.muted }}>Se den helt gratis — betal kun, hvis du vil beholde den.</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 200, height: 92, borderRadius: 18, background: "#F6F5F1", display: "flex", alignItems: "center", gap: 18, padding: "0 26px", fontSize: 36 }}>
        <Icon name="globe" size={36} color={C.muted} />{url.slice(0, n)}{n < url.length && <Caret g={g} h={40} color={C.sageDeep} />}<div style={{ marginLeft: "auto" }}><Icon name="external" size={32} color={C.muted} /></div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 318, display: "flex", alignItems: "baseline", gap: 20 }}>
        <div style={{ fontFamily: F.serif, fontSize: 92, fontWeight: 500 }}>499 kr.</div><div style={{ fontSize: 30, color: C.muted }}>engangsbeløb · ingen binding</div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 460 }}><Btn label={paid ? "Betalt" : "Køb nu · 499 kr."} icon={paid ? "check" : "card"} tone={paid ? "forest" : "sage"} size={32} press={press(g, 1782)}
        style={{ height: 96, width: 420, padding: 0, justifyContent: "center" }} /></div>
      <div style={{ position: "absolute", left: 494, top: 460 }}><Btn label="Fortsæt preview" tone="grey" size={32} style={{ height: 96, width: 330, padding: 0, justifyContent: "center" }} /></div>
    </div>
  );
};
/** A ceramic vase with greenery, for the desk (the reference's props). */
const Vase: React.FC = () => (
  <div style={{ position: "relative", width: 300, height: 620 }}>
    {([[-28, 190, 380, C.gTeal], [-8, 160, 420, "#5E8A6C"], [14, 200, 360, "#3F6E57"], [30, 170, 330, "#7FA88A"], [-40, 150, 300, "#4E7A60"]] as [number, number, number, string][]).map(([rot, w, h, col], i) => (
      <div key={i} style={{ position: "absolute", left: 150 - w / 2, top: 360 - h, width: w, height: h, borderRadius: "50% 50% 46% 54% / 70% 70% 30% 30%",
        background: col, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%", opacity: 0.92 }} />
    ))}
    <div style={{ position: "absolute", left: 40, top: 330, width: 220, height: 290, borderRadius: "40% 40% 30% 30% / 30% 30% 22% 22%", background: "linear-gradient(90deg, #C9B497 0%, #EBDCC6 45%, #D6C3A6 100%)",
      boxShadow: "inset -20px 0 40px rgba(90,60,30,0.2)" }} />
  </div>
);
export const D2: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1734) {
    const bc = centre(BTN_BUY), Z = 4.4, ox = 960 - ((1236 + 1404 + 180) / 2) * Z, oy = 380 - 41 * Z;
    const tx = ox + bc.x * Z + 20, ty = oy + bc.y * Z + 26;
    const cur = path(g, [{ f: 1710, x: 1500, y: 1180 }, { f: 1721, x: tx, y: ty }, { f: 1734, x: tx + 14, y: ty + 20 }]);
    const pk = press(g, 1723);
    return <TopBarClose g={g} a={1710} buyPress={pk}><Cursor x={cur.x} y={cur.y} vx={cur.vx} h={300} press={pk} /></TopBarClose>;
  }
  if (g < 1806) {
    const k = expoOut(15, 0.84)(clamp01((g - 1734) / 15)), sc = lerp(0.6, 1, k) * lerp(1, 1.03, pr(g, 1749, 57, SOFT));
    const rx = lerp(10, 3, k), ry = lerp(14, -4, k);
    const btn = { x: 960 + (BUY_AT.x - CARD.w / 2) * sc, y: 540 + (BUY_AT.y - CARD.h / 2) * sc };
    const cur = path(g, [{ f: 1737, x: 1100, y: 1180 }, { f: 1752, x: btn.x + 8, y: btn.y + 6 }, { f: 1767, x: btn.x + 16, y: btn.y + 2 }, { f: 1780, x: btn.x + 6, y: btn.y + 4 }, { f: 1806, x: btn.x + 14, y: btn.y + 16 }]);
    return (
      <Peach g={g} a={1734} v={10}>
        <div style={{ position: "absolute", inset: 0, perspective: 2200 }}>
          <At x={960} y={540} s={sc}><div style={{ transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}><BuyCard g={g} /></div></At>
        </div>
        <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={190} press={press(g, 1782)} />
      </Peach>
    );
  }
  if (g < 1848) {
    const e1 = expoOut(39, 0.92)(clamp01((g - 1806) / 39));
    const s = lerp(2.4, 0.92, e1), ry = lerp(-24, -5, e1), rx = lerp(12, 3, e1), fx = lerp(-380, 0, e1), fy = lerp(-340, 0, e1);
    return (
      <Peach g={g} a={1806} v={11}>
        <div style={{ position: "absolute", inset: 0, perspective: 2400 }}>
          <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(${-fx * s}px, ${-fy * s}px) scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)` }}>
            <div style={{ position: "absolute", left: -750, top: -440 }}>
              <Browser w={1500} url="blomsterhuset-rosa.creoble.dk"><div style={{ position: "relative" }}><FlowerSite brand={1} from={1806} />
                <div style={{ position: "absolute", right: 30, bottom: 30 }}><ChatButton size={80} brand={1} /></div></div></Browser>
            </div>
          </div>
        </div>
      </Peach>
    );
  }
  // the laptop on the shop's counter: close, easing back, a 3/4 view from above, a vase on the right
  const back = expoOut(27, 0.88)(clamp01((g - 1848) / 27)), sc = lerp(1.25, 1.0, back) * lerp(1, 1.02, pr(g, 1875, 15, SOFT));
  return (
    <AbsoluteFill style={{ background: "#2A2422", overflow: "hidden" }}>
      <Sequence from={1830} layout="none"><OffthreadVideo src={staticFile("footage/flower-shop-4742.mp4")} muted style={{ position: "absolute", inset: -40, width: 2000, height: 1160, objectFit: "cover", filter: "blur(16px) brightness(0.9)" }} /></Sequence>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "linear-gradient(180deg, #C9A988 0%, #A78163 60%, #8A6A50 100%)", boxShadow: "0 -2px 0 rgba(255,255,255,0.25)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${sc})`, transformOrigin: "760px 560px" }}>
        <div style={{ position: "absolute", left: 1500, top: 240 }}><Vase /></div>
        <At x={800} y={500}><Laptop w={1100} yaw={-22} pitch={18}><FlowerSite brand={1} video={false} /></Laptop></At>
      </div>
      <Grain opacity={0.12} seed={43} />
    </AbsoluteFill>
  );
};

// ---- 63–65 s: "Oplev" and "nem hosting" ------------------------------------------------------------------------------------------
const Night: React.FC<{ g: number; a: number; children?: React.ReactNode; low?: boolean; seed?: number }> = ({ g, a, children, low = true, seed = 0 }) => {
  const s = Math.sin((g - a) * 0.07), c = Math.cos((g - a) * 0.055);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      {low && <Glow x={960 + 200 * s} y={1180 - 40 * c} w={1700} h={520 + 80 * c} color={C.gTeal} blur={140} opacity={0.75} />}
      {low && <Glow x={1500 - 160 * c} y={1150 - 30 * s} w={900} h={380} color={C.gCoral} blur={140} opacity={0.5} />}
      {low && <Glow x={300 + 160 * s} y={1120} w={800} h={360} color={C.gSage} blur={140} opacity={0.45} />}
      {children}
      <Grain opacity={0.14} seed={seed} />
    </AbsoluteFill>
  );
};
const HOST = "nem hosting", HS = 330;
export const D3: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1912) {
    const word = "Oplev", size = 140, total = tw(word, size);
    let cx = 960 - total / 2;
    return (
      <Night g={g} a={1890} seed={51}>
        {word.split("").map((l, i) => {
          const w = tw(l, size), left = cx; cx += w;
          const k = clamp01((g - 1883 - i * 2) / 10), e = expoOut(10, 0.8)(k);
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${left - 30 * (1 - e)}px, ${540 - size * 0.66}px, 0)`, opacity: k, filter: k < 1 ? `blur(${18 * (1 - e)}px)` : undefined,
            fontFamily: F.serif, fontWeight: 500, fontSize: size, color: "#F6F3EE", whiteSpace: "pre", lineHeight: 1.24 }}>{l}</div>;
        })}
      </Night>
    );
  }
  // typed on letter by letter with a terracotta caret riding the last letter, then a slow drift left as it holds
  const n = Math.min(HOST.length, Math.floor((g - 1912) * HOST.length / 15) + 1), full = tw(HOST, HS, 600), part = tw(HOST.slice(0, n), HS, 600);
  const drift = pr(g, 1927, 23, SOFT), dx = -60 * drift, sc = lerp(1, 0.97, drift), left = 960 - full / 2;
  const st: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: full, fontFamily: F.serif, fontWeight: 600, fontSize: HS, whiteSpace: "pre", letterSpacing: 0, lineHeight: 1.2,
    backgroundImage: GRAD, backgroundSize: `${full}px 100%`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", clipPath: `inset(-20% ${full - part}px -20% -5%)` };
  return (
    <Night g={g} a={1890} seed={52}>
      <div style={{ position: "absolute", left: left + dx, top: 540 - HS * 0.62, transform: `scale(${sc})`, transformOrigin: `${full / 2}px ${HS * 0.6}px` }}>
        <div style={{ ...st, filter: "blur(30px)", opacity: 0.7 }}>{HOST}</div>
        <div style={st}>{HOST}</div>
        {n < HOST.length && <div style={{ position: "absolute", left: part + 8, top: HS * 0.18, width: 16, height: HS * 0.86, borderRadius: 8, background: C.gTerra }} />}
      </div>
    </Night>
  );
};

// ---- 65–66.2 s: the hosting switch ---------------------------------------------------------------------------------------------
export const D4: React.FC<{ g: number }> = ({ g }) => {
  const on = pr(g, 1968, 12, MOVE), zoom = lerp(1, 1.5, pr(g, 1950, 36, SOFT));
  const W2 = 360, H2 = 180, knob = 162;
  const kx = lerp(-W2 / 2 + 9 + knob / 2, W2 / 2 - 9 - knob / 2, on);
  const map = (x: number, y: number) => ({ x: 960 + x * zoom, y: 540 + y * zoom });
  const tgt = map(kx + 20, 30);
  const cur = path(g, [{ f: 1950, x: map(30, 260).x, y: map(30, 260).y }, { f: 1964, x: map(-W2 / 2 + 9 + knob / 2 + 20, 30).x, y: map(0, 30).y }, { f: 1978, x: tgt.x, y: tgt.y }, { f: 1986, x: tgt.x + 10, y: tgt.y + 10 }]);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <Glow x={-100} y={300} w={900} h={1100} color={C.gTerra} blur={160} opacity={0.55} />
      <Glow x={2050} y={600} w={800} h={1300} color={C.gTeal} blur={160} opacity={0.6} />
      <Glow x={1700} y={-120} w={800} h={400} color={C.gSage} blur={150} opacity={0.4} />
      <At x={960} y={540} s={zoom}>
        <div style={{ width: W2, height: H2, borderRadius: 54, position: "relative", background: on > 0 ? `linear-gradient(90deg, ${C.gTeal}, ${C.gSage} 45%, ${C.gCoral})` : "#2B302E",
          boxShadow: on > 0 ? `0 0 ${90 * on}px ${20 * on}px rgba(143,192,174,${0.45 * on}), 0 0 ${60 * on}px rgba(239,138,102,${0.4 * on})` : "inset 0 0 0 2px #3A413E" }}>
          {on < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: 54, background: "#2B302E", opacity: 1 - on }} />}
          <div style={{ position: "absolute", left: W2 / 2 + kx - knob / 2, top: (H2 - knob) / 2, width: knob, height: knob, borderRadius: 46, background: "#141917", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 24px rgba(0,0,0,0.45)" }}><Icon name="globe" size={78} color="#F3F1EC" stroke={2} /></div>
        </div>
      </At>
      <Grain opacity={0.14} seed={53} />
      <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={210} press={press(g, 1964)} />
    </AbsoluteFill>
  );
};

// ---- 66.2–69.25 s: hosting and domain set-up; the preview turns into a dark hosting view ------------------------------------------
const DOMAIN = "blomsterhusetrosa.dk";
const ROWS: [string, number][] = [["Domæne forbundet", 2038], ["SSL-sikkerhed", 2047], ["Hurtig dansk hosting", 2056], ["Hjemmesiden er online", 2065]];
const HostSide: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "absolute", left: 24, top: 124, right: 24, fontFamily: F.ui }}>
    <div style={{ fontFamily: F.serif, fontSize: 32, fontWeight: 500 }}>Hosting & <i style={{ color: C.sageDeep }}>domæne</i></div>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, padding: "12px 14px", borderRadius: 14, background: "#fff", border: `1px solid ${C.line}` }}>
      <Icon name="server" size={24} color={C.sageDeep} /><div style={{ fontSize: 16, fontWeight: 600 }}>Hosting</div><div style={{ marginLeft: "auto" }}><Switch on={1} w={56} /></div></div>
    <div style={{ marginTop: 16 }}>
      {ROWS.map(([t, a]) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.line}`, opacity: 0.4 + 0.6 * pr(g, a, 6) }}>
          <Check k={pr(g, a, 8)} size={26} /><div style={{ fontSize: 16, fontWeight: 600 }}>{t}</div></div>
      ))}
    </div>
  </div>
);
const HostView: React.FC<{ g: number }> = ({ g }) => {
  const n = Math.max(0, Math.min(DOMAIN.length, Math.floor((g - 2019) * 40 / 30))), online = pr(g, 2071, 6);
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${C.forest} 0%, #1C2E29 100%)`, fontFamily: F.ui, color: "#F3F1EC" }}>
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: F.serif, fontSize: 62, fontWeight: 500 }}>Hosting & <i style={{ color: C.gSage }}>domæne</i></div>
      <div style={{ position: "absolute", left: 70, top: 180, fontSize: 28, color: "#A9BDB6" }}>Dit domæne</div>
      <div style={{ position: "absolute", left: 70, top: 226, width: 720, height: 96, borderRadius: 20, background: "rgba(255,255,255,0.08)", border: `2px solid ${n ? C.gSage : "rgba(255,255,255,0.15)"}`,
        display: "flex", alignItems: "center", gap: 18, padding: "0 28px", boxSizing: "border-box", fontSize: 40 }}>
        <Icon name="globe" size={38} color="#A9BDB6" />{DOMAIN.slice(0, n)}{n < DOMAIN.length && <Caret g={g} h={44} color={C.gSage} />}</div>
      <div style={{ position: "absolute", left: 810, top: 226 }}><Btn label="Forbind" tone="sage" size={32} press={press(g, 2034)} style={{ height: 96, width: 230, padding: 0, justifyContent: "center" }} /></div>
      <div style={{ position: "absolute", left: 70, top: 370 }}>
        {ROWS.map(([t, a]) => {
          const k = pr(g, a, 7);
          return <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, height: 78, opacity: 0.25 + 0.75 * k, transform: `translateX(${(1 - k) * 16}px)` }}>
            <Check k={k} size={48} color={C.gTeal} /><div style={{ fontSize: 40, fontWeight: 600 }}>{t}</div></div>;
        })}
      </div>
      {online > 0 && <div style={{ position: "absolute", right: 70, bottom: 70, height: 110, padding: "0 46px", borderRadius: 55, background: "#E3F1E8", color: "#2F7A52", display: "flex", alignItems: "center", gap: 20,
        fontSize: 52, fontWeight: 700, opacity: online, transform: `scale(${lerp(0.7, 1, expoOut(6, 0.75)(online))})` }}>
        <span style={{ width: 26, height: 26, borderRadius: 13, background: "#3E8E63", boxShadow: "0 0 0 10px rgba(62,142,99,0.25)" }} />Online</div>}
    </div>
  );
};
export const D5: React.FC<{ g: number }> = ({ g }) => {
  const out = expoOut(34, 0.9)(clamp01((g - 1986) / 34)), focus = 12 * (1 - clamp01((g - 1986) / 9));
  const s = Math.exp(lerp(Math.log(1.9), Math.log(0.97), out)) * lerp(1, 1.02, pr(g, 2020, 57, SOFT));
  const ax = lerp(960, 980, out), ay = lerp(560, 545, out), wx = lerp(220, 800, out), wy = lerp(380, 500, out);
  const ry = lerp(-18, -8, out), rx = lerp(10, 6, out);
  const flip = pr(g, 2015, 6), live = g >= 2071 ? 1 : 0;
  return (
    <Gradient g={g} a={1986} lift={10} seed={55}>
      <div style={{ position: "absolute", inset: 0, perspective: 2600, filter: focus > 0.2 ? `blur(${focus}px)` : undefined }}>
        <div style={{ position: "absolute", left: ax - wx, top: ay - wy, width: WW, height: WH, transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`, transformOrigin: `${wx}px ${wy}px`,
          filter: "drop-shadow(0 50px 70px rgba(80,30,20,0.35))" }}>
          <Builder g={g} brand={1} from={1986} side={<HostSide g={g} />} topIcons={1} widget={1} url={live ? DOMAIN : "blomsterhuset-rosa.creoble.dk"} live={live}
            overlay={flip > 0 ? <div style={{ position: "absolute", left: PREVIEW.x, top: PREVIEW.y, width: PREVIEW.w, height: PREVIEW.h, borderRadius: 16, overflow: "hidden",
              clipPath: `inset(0 ${(1 - flip) * 100}% 0 0)` }}><HostView g={g} /></div> : undefined} />
        </div>
      </div>
    </Gradient>
  );
};

// ---- 69.25–72.5 s: "Gå online" typed, "med dit eget domæne", "uden teknisk bøvl" -----------------------------------------------------
const GAA = "Gå online";
export const D6: React.FC<{ g: number }> = ({ g }) => {
  const icon = <div style={{ width: 96, height: 96, borderRadius: 48, background: "#F6F3EE", display: "flex", alignItems: "center", justifyContent: "center", transform: "translateY(14px)" }}><Icon name="wrench" size={56} color={C.night} stroke={2.2} /></div>;
  if (g < 2130) {
    const size = 210, n = Math.max(1, Math.min(GAA.length, Math.floor((g - 2077) * GAA.length / 14) + 1)), full = tw(GAA, size, 600);
    const mv = pr(g, 2104, 12, MOVE);
    return (
      <Night g={g} a={2077} seed={61}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${lerp(0, -470, mv)}px, ${lerp(0, -330, mv)}px) scale(${lerp(1, 0.62, mv)})`, transformOrigin: "960px 560px" }}>
          <div style={{ position: "absolute", left: 960 - full / 2, top: 560 - size * 0.66, fontFamily: F.serif, fontWeight: 600, fontSize: size, color: "#F6F3EE", whiteSpace: "pre", lineHeight: 1.24 }}>
            {GAA.slice(0, n)}<span style={{ color: C.gTerra, opacity: n < GAA.length || Math.floor(g / 8) % 2 === 0 ? 1 : 0 }}>_</span></div>
        </div>
      </Night>
    );
  }
  if (g < 2145) return <Night g={g} a={2077} seed={62}><Flow g={g} size={112} y={260} color="#F6F3EE" words={[{ t: "med", f: 2130 }, { t: "dit", f: 2132 }, { t: "eget", f: 2135 }, { t: "domæne", f: 2138, italic: true }]} /></Night>;
  const y = lerp(260, 540, pr(g, 2150, 25, MOVE));
  return <Night g={g} a={2077} seed={63}><Words g={g} size={112} x={960} y={y} color="#F6F3EE" words={[{ t: "uden", f: 2145 }, { t: "", f: 2148, icon, iconW: 96 }, { t: "teknisk", f: 2151 }, { t: "bøvl", f: 2154 }]} n={8} /></Night>;
};

// ---- 72.5–76 s: "Din hjemmeside starter her — Hvad vil du skabe?" in the mark's glow --------------------------------------------
export const D7: React.FC<{ g: number }> = ({ g }) => {
  const t = g - 2175, grow = lerp(0.92, 1.14, pr(g, 2175, 105, SOFT)), core = pr(g, 2200, 60, SOFT);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #DDEDE6 0%, ${C.gSage} 70%)`, overflow: "hidden" }}>
      <At x={960} y={760} s={grow}>
        <div style={{ position: "relative", width: 1800, height: 1800 }}>
          <div style={{ position: "absolute", left: 150, top: 150, filter: "blur(90px)" }}><Mark size={1500} color={C.gTeal} id="d7a" /></div>
          <div style={{ position: "absolute", left: 325, top: 325, filter: "blur(70px)" }}><Mark size={1150} color={C.gCoral} id="d7b" /></div>
          <div style={{ position: "absolute", left: 500, top: 500, filter: "blur(60px)", opacity: 0.6 + 0.4 * core }}><Mark size={800} color={C.gApricot} id="d7c" /></div>
        </div>
      </At>
      <Grain opacity={0.24} seed={71} />
      {t < 56 && (g < 2190 ? <Words g={g} size={240} x={960} y={470} color="#FFFFFF" weight={600} words={[{ t: "Din", f: 2176 }]} n={8} shadow="0 10px 40px rgba(30,74,63,0.25)" />
        : <Flow g={g} size={110} y={450} color="#FFFFFF" weight={600} words={[{ t: "Din", f: 2100 }, { t: "hjemmeside", f: 2190 }, { t: "starter", f: 2194 }, { t: "her", f: 2198 }]} shadow="0 8px 30px rgba(30,74,63,0.25)" />)}
      {t >= 56 && <Words g={g} size={116} x={960} y={540} color="#FFFFFF" weight={600} words={[{ t: "Hvad", f: 2231 }, { t: "vil", f: 2234 }, { t: "du", f: 2237 }, { t: "skabe?", f: 2242, italic: true }]} n={10} rise={0.3} shadow="0 8px 30px rgba(30,74,63,0.25)" />}
    </AbsoluteFill>
  );
};

// ---- 76–80.49 s: the logo, then creoble.dk -------------------------------------------------------------------------------------
export const D8: React.FC<{ g: number }> = ({ g }) => {
  const glow = (
    <>
      <Glow x={960} y={-120} w={620} h={300} color={C.gApricot} blur={110} opacity={0.75} />
      <Glow x={-60} y={1140} w={760} h={480} color={C.gCoral} blur={130} opacity={0.7} />
      <Glow x={1980} y={1140} w={760} h={480} color={C.gTeal} blur={130} opacity={0.75} />
    </>
  );
  if (g >= 2355) {
    return (
      <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
        {glow}<Grain opacity={0.14} seed={82} />
        <Words g={g} size={70} x={960} y={560} family={F.ui} weight={500} color="#F6F3EE" words={[{ t: "creoble.dk", f: 2355 }]} n={6} spacing={0} />
      </AbsoluteFill>
    );
  }
  const size = 230, ms = 176, gap = 50, ww = tw("Creoble.", size) - size * 0.1;
  const total = ms + gap + ww, mv = pr(g, 2310, 16, MOVE);
  const mx = lerp(960, 960 - total / 2 + ms / 2, mv);
  // the mark arrives huge and soft (the reference's heart) and settles small and sharp
  const k = clamp01((g - 2277) / 14), e = expoOut(14, 0.8)(k), big = lerp(1.35, 1, mv);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      {glow}<Grain opacity={0.14} seed={81} />
      <At x={mx} y={540} s={lerp(6, 1, e) * big} o={clamp01(k * 3)}><div style={{ filter: k < 1 ? `blur(${7 * (1 - e)}px)` : undefined }}><Mark size={ms} grad={[C.gSage, C.gCoral, C.gApricot]} id="d8m" /></div></At>
      {g >= 2310 && <div style={{ position: "absolute", left: 960 - total / 2 + ms + gap, top: 540 - size * 0.58 }}><Wordmark size={size} color="#F6F3EE" dot={C.gSage} reveal={pr(g, 2312, 20, SOFT)} /></div>}
    </AbsoluteFill>
  );
};

export { Halo };
