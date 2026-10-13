// 54–80.49 s: "Se resultatet helt gratis før du betaler noget" on the gradient, the click on "Køb · 499 kr.", the purchase card,
// the shop's site in a browser and on a laptop in the shop, "Oplev nem hosting", the hosting switch, the domain set-up,
// "Gå online med dit eget domæne uden teknisk bøvl", "Din hjemmeside starter her — Hvad vil du skabe?" in the glow of
// Creoble's mark, the logo and creoble.dk.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, F, GRAD, MOVE, SOFT, clamp01, expoOut, lerp, path, pr, press, px } from "./lib";
import { At, Btn, Caret, Check, Cursor, Flow, Glow, Grain, Icon, Mark, Switch, Words, Wordmark, tw } from "./kit";
import { Gradient, LIGHT_TEXT, Laptop } from "./A";
import { Peach } from "./C";
import { Halo } from "./B";
import { BTN_BUY, Builder, WH, WW, centre } from "./ui";
import { Browser, ChatButton, FlowerSite } from "./sites";

// ---- 54–57 s: "Se resultatet helt gratis før du betaler noget" -----------------------------------------------------------------
export const D1: React.FC<{ g: number }> = ({ g }) => (
  <Gradient g={g} a={1620} lift={26} seed={41}>
    {g < 1635 && <Words g={g} size={150} x={960} y={540} weight={600} grad={LIGHT_TEXT} words={[{ t: "Se", f: 1620 }, { t: "resultatet", f: 1622 }]} n={9} blur={20} shadow="0 20px 60px rgba(150,50,20,0.15)" />}
    {g >= 1635 && g < 1650 && <Words g={g} size={330} x={960} y={560} weight={600} grad={LIGHT_TEXT} words={[{ t: "helt", f: 1635 }]} n={8} blur={22} />}
    {g >= 1650 && g < 1668 && <Words g={g} size={330} x={960} y={560} weight={600} grad={LIGHT_TEXT} words={[{ t: "gratis", f: 1650, italic: true }]} n={8} blur={22} />}
    {g >= 1668 && <Flow g={g} size={104} y={560} color="#FFF8F0" words={[{ t: "før", f: 1668 }, { t: "du", f: 1672 }, { t: "betaler", f: 1680 }, { t: "noget", f: 1692 }]} shadow="0 8px 30px rgba(150,50,20,0.2)" />}
  </Gradient>
);

// ---- 57–58 s: the click on "Køb · 499 kr." ------------------------------------------------------------------------------------
const Z2 = 2.4, OX2 = 1050 - 1410 * Z2, OY2 = 360 - 41 * Z2;
const BuyCard: React.FC<{ g: number }> = ({ g }) => {
  const url = "blomsterhuset-rosa.creoble.dk", n = Math.max(0, Math.min(url.length, Math.floor((g - 1744) * 40 / 30)));
  const paid = g >= 1786;
  return (
    <div style={{ width: 900, padding: "40px 44px", borderRadius: 30, background: "#FFFFFF", boxShadow: "0 60px 110px -40px rgba(120,60,30,0.45), 0 2px 8px rgba(0,0,0,0.06)", fontFamily: F.ui, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: F.serif, fontSize: 40, fontWeight: 500 }}>Din hjemmeside er <i style={{ color: C.sageDeep }}>klar</i></div>
        <div style={{ marginLeft: "auto", height: 36, padding: "0 14px", borderRadius: 18, background: C.sageTint, color: C.sageDeep, fontSize: 17, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}><Icon name="eye" size={19} color={C.sageDeep} />Gratis preview</div>
      </div>
      <div style={{ marginTop: 10, fontSize: 21, color: C.muted }}>Se den helt gratis — og betal kun, hvis du vil beholde den.</div>
      <div style={{ marginTop: 26, height: 66, borderRadius: 14, background: "#F6F5F1", display: "flex", alignItems: "center", gap: 14, padding: "0 20px", fontSize: 23 }}>
        <Icon name="globe" size={26} color={C.muted} />{url.slice(0, n)}{n < url.length && <Caret g={g} h={26} color={C.sageDeep} />}<div style={{ marginLeft: "auto" }}><Icon name="external" size={24} color={C.muted} /></div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 28 }}>
        <div style={{ fontFamily: F.serif, fontSize: 64, fontWeight: 500 }}>499 kr.</div><div style={{ fontSize: 21, color: C.muted }}>engangsbeløb · ingen binding</div>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <Btn label={paid ? "Betalt" : "Køb nu · 499 kr."} icon={paid ? "check" : "card"} tone={paid ? "forest" : "sage"} size={24} press={press(g, 1782)} style={{ height: 70, padding: "0 32px" }} />
        <Btn label="Fortsæt preview" tone="grey" size={24} style={{ height: 70, padding: "0 32px" }} />
      </div>
    </div>
  );
};
export const D2: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1740) {
    const s = lerp(1, 0.95, pr(g, 1710, 30, SOFT));
    const bc = centre(BTN_BUY), tx = OX2 + bc.x * Z2 + 20, ty = OY2 + bc.y * Z2 + 18;
    const cur = path(g, [{ f: 1710, x: 1500, y: 1150 }, { f: 1722, x: tx, y: ty }, { f: 1740, x: tx + 20, y: ty + 30 }]);
    const pk = press(g, 1723);
    return (
      <Peach g={g} a={1710} v={9}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "960px 540px" }}>
          <div style={{ position: "absolute", left: OX2, top: OY2, transform: `scale(${Z2})`, transformOrigin: "0 0", filter: "drop-shadow(0 30px 40px rgba(120,60,30,0.18))" }}>
            <Builder g={g} brand={1} from={792} buyPress={pk} topIcons={1} video={false} />
          </div>
        </div>
        <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={230} press={pk} />
      </Peach>
    );
  }
  if (g < 1800) {
    const k = px(g, 1740, 12), ry = lerp(14, -8, pr(g, 1740, 60, SOFT)), rx = lerp(8, 4, pr(g, 1740, 60, SOFT));
    const s = lerp(0.88, 1, k) * lerp(1, 1.05, pr(g, 1752, 48, SOFT));
    const btn = { x: 960 - 450 + 44 + 140, y: 540 + 205 };
    const cur = path(g, [{ f: 1760, x: 1300, y: 1150 }, { f: 1778, x: btn.x + 30, y: btn.y + 26 }, { f: 1800, x: btn.x + 50, y: btn.y + 60 }]);
    return (
      <Peach g={g} a={1740} v={10}>
        <div style={{ position: "absolute", inset: 0, perspective: 2200 }}>
          <At x={960} y={540} s={s} o={clamp01((g - 1740) / 5)}><div style={{ transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}><BuyCard g={g} /></div></At>
        </div>
        {g >= 1760 && <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={170} press={press(g, 1782)} />}
      </Peach>
    );
  }
  if (g < 1860) {
    const e1 = expoOut(30, 0.9)(clamp01((g - 1800) / 30));
    const s = lerp(2.3, 0.9, e1) * lerp(1, 0.96, pr(g, 1830, 30, SOFT));
    const ry = lerp(-24, -5, e1), rx = lerp(12, 3, e1);
    const fx = lerp(-360, 0, e1), fy = lerp(-330, 0, e1);
    return (
      <Peach g={g} a={1800} v={11}>
        <div style={{ position: "absolute", inset: 0, perspective: 2400 }}>
          <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(${-fx * s}px, ${-fy * s}px) scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)` }}>
            <div style={{ position: "absolute", left: -750, top: -440 }}>
              <Browser w={1500} url="blomsterhuset-rosa.creoble.dk"><div style={{ position: "relative" }}><FlowerSite brand={1} from={1800} />
                <div style={{ position: "absolute", right: 30, bottom: 30 }}><ChatButton size={80} brand={1} /></div></div></Browser>
            </div>
          </div>
        </div>
      </Peach>
    );
  }
  // the laptop on the shop's counter
  return (
    <AbsoluteFill style={{ background: "#2A2422", overflow: "hidden" }}>
      <Sequence from={1840} layout="none"><OffthreadVideo src={staticFile("footage/flower-shop-4742.mp4")} muted style={{ position: "absolute", inset: -40, width: 2000, height: 1160, objectFit: "cover", filter: "blur(14px) brightness(0.92) saturate(1.05)" }} /></Sequence>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: "linear-gradient(180deg, #C9A988 0%, #A78163 60%, #8A6A50 100%)", boxShadow: "0 -2px 0 rgba(255,255,255,0.25)" }} />
      <At x={960} y={560} s={lerp(1, 1.05, pr(g, 1860, 30, SOFT))}><Laptop w={1060} tilt={-14}><FlowerSite brand={1} video={false} /></Laptop></At>
      <Grain opacity={0.12} seed={43} />
    </AbsoluteFill>
  );
};

// ---- 63–65 s: "Oplev nem hosting" -------------------------------------------------------------------------------------------------
const Night: React.FC<{ g: number; a: number; children?: React.ReactNode; low?: boolean; seed?: number }> = ({ g, a, children, low = true, seed = 0 }) => {
  const s = Math.sin((g - a) * 0.04);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      {low && <Glow x={960 + 80 * s} y={1180} w={1700} h={520} color={C.gTeal} blur={140} opacity={0.75} />}
      {low && <Glow x={1500} y={1150} w={900} h={380} color={C.gCoral} blur={140} opacity={0.5} />}
      {low && <Glow x={300} y={1120} w={800} h={360} color={C.gSage} blur={140} opacity={0.45} />}
      {children}
      <Grain opacity={0.14} seed={seed} />
    </AbsoluteFill>
  );
};
export const D3: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1920) {
    const word = "Oplev", size = 130, total = tw(word, size);
    let cx = 960 - total / 2;
    return (
      <Night g={g} a={1890} seed={51}>
        {word.split("").map((l, i) => {
          const w = tw(l, size), left = cx; cx += w;
          const k = clamp01((g - 1890 - (word.length - 1 - i) * 2) / 12), e = expoOut(12, 0.8)(k);
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${left + 40 * (1 - e)}px, ${540 - size * 0.66}px, 0)`, opacity: k, filter: k < 1 ? `blur(${18 * (1 - e)}px)` : undefined,
            fontFamily: F.serif, fontWeight: 500, fontSize: size, color: "#F6F3EE", whiteSpace: "pre", lineHeight: 1.24 }}>{l}</div>;
        })}
      </Night>
    );
  }
  const k = clamp01((g - 1920) / 10), e = expoOut(10, 0.8)(k);
  const st: React.CSSProperties = { fontFamily: F.serif, fontWeight: 600, fontSize: 250, whiteSpace: "pre", letterSpacing: -5, lineHeight: 1.2 };
  return (
    <Night g={g} a={1890} seed={52}>
      <At x={960} y={540} s={lerp(1.06, 1, e) * lerp(1, 1.03, pr(g, 1930, 20, SOFT))} o={k}>
        <div style={{ position: "relative", filter: k < 1 ? `blur(${16 * (1 - e)}px)` : undefined }}>
          <div style={{ ...st, position: "absolute", inset: 0, backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "blur(28px)", opacity: 0.75 }}>nem hosting</div>
          <div style={{ ...st, position: "relative", backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>nem hosting</div>
        </div>
      </At>
    </Night>
  );
};

// ---- 65–66.5 s: the hosting switch ----------------------------------------------------------------------------------------------
export const D4: React.FC<{ g: number }> = ({ g }) => {
  const on = pr(g, 1968, 12, MOVE), zoom = lerp(1, 1.22, pr(g, 1950, 45, SOFT));
  const W2 = 360, H2 = 180, knob = 144;
  const kx = lerp(-W2 / 2 + 18 + knob / 2, W2 / 2 - 18 - knob / 2, on);
  const map = (x: number, y: number) => ({ x: 960 + x * zoom, y: 540 + y * zoom });
  const tgt = map(kx + 20, 30);
  const cur = path(g, [{ f: 1950, x: map(30, 260).x, y: map(30, 260).y }, { f: 1966, x: map(-W2 / 2 + 18 + knob / 2 + 20, 30).x, y: map(0, 30).y }, { f: 1980, x: tgt.x, y: tgt.y }, { f: 1995, x: tgt.x + 10, y: tgt.y + 10 }]);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <Glow x={-100} y={300} w={900} h={1100} color={C.gTerra} blur={160} opacity={0.55} />
      <Glow x={2050} y={600} w={800} h={1300} color={C.gTeal} blur={160} opacity={0.6} />
      <Glow x={1700} y={-120} w={800} h={400} color={C.gSage} blur={150} opacity={0.4} />
      <At x={960} y={540} s={zoom}>
        <div style={{ width: W2, height: H2, borderRadius: 52, position: "relative", background: on > 0 ? `linear-gradient(90deg, ${C.gTeal}, ${C.gSage} 45%, ${C.gCoral})` : "#2B302E",
          boxShadow: on > 0 ? `0 0 ${90 * on}px ${20 * on}px rgba(143,192,174,${0.45 * on}), 0 0 ${60 * on}px rgba(239,138,102,${0.4 * on})` : "inset 0 0 0 2px #3A413E" }}>
          {on < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: 52, background: "#2B302E", opacity: 1 - on }} />}
          <div style={{ position: "absolute", left: W2 / 2 + kx - knob / 2, top: (H2 - knob) / 2, width: knob, height: knob, borderRadius: 40, background: "#141917", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 24px rgba(0,0,0,0.45)" }}><Icon name="globe" size={70} color="#F3F1EC" stroke={2} /></div>
        </div>
      </At>
      <Grain opacity={0.14} seed={53} />
      <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={200} press={press(g, 1966)} />
    </AbsoluteFill>
  );
};

// ---- 66.5–70 s: hosting and domain set-up --------------------------------------------------------------------------------------
const DOMAIN = "blomsterhusetrosa.dk";
const HostSide: React.FC<{ g: number }> = ({ g }) => {
  const n = Math.max(0, Math.min(DOMAIN.length, Math.floor((g - 2000) * 30 / 30)));
  const rows: [string, number][] = [["Domæne forbundet", 2034], ["SSL-sikkerhed", 2042], ["Hurtig dansk hosting", 2050], ["Hjemmesiden er online", 2058]];
  return (
    <div style={{ position: "absolute", left: 24, top: 124, right: 24, fontFamily: F.ui }}>
      <div style={{ fontFamily: F.serif, fontSize: 32, fontWeight: 500 }}>Hosting & <i style={{ color: C.sageDeep }}>domæne</i></div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, padding: "12px 14px", borderRadius: 14, background: "#fff", border: `1px solid ${C.line}` }}>
        <Icon name="server" size={24} color={C.sageDeep} /><div style={{ fontSize: 16, fontWeight: 600 }}>Hosting</div><div style={{ marginLeft: "auto" }}><Switch on={1} w={56} /></div></div>
      <div style={{ marginTop: 18, fontSize: 14, fontWeight: 600, color: C.muted }}>Dit domæne</div>
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <div style={{ flex: 1, height: 46, borderRadius: 12, border: `1.5px solid ${n ? C.sage : C.line}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16 }}>
          {DOMAIN.slice(0, n)}{n < DOMAIN.length && <Caret g={g} h={18} color={C.sageDeep} />}</div>
        <Btn label="Forbind" tone="sage" size={15} press={press(g, 2026)} style={{ height: 46 }} />
      </div>
      <div style={{ marginTop: 14 }}>
        {rows.map(([t, a]) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.line}`, opacity: 0.4 + 0.6 * pr(g, a, 6) }}>
            <Check k={pr(g, a, 8)} size={26} /><div style={{ fontSize: 16, fontWeight: 600 }}>{t}</div></div>
        ))}
      </div>
    </div>
  );
};
export const D5: React.FC<{ g: number }> = ({ g }) => {
  const out = expoOut(34, 0.9)(clamp01((g - 1995) / 34));
  const s = lerp(1.9, 0.8, out) * lerp(1, 1.03, pr(g, 2030, 70, SOFT));
  const fx = lerp(220, 800, out), fy = lerp(380, 500, out), ry = lerp(-18, -10, out), rx = lerp(10, 7, out);
  const live = g >= 2060 ? 1 : 0;
  return (
    <Gradient g={g} a={1995} lift={10} seed={55}>
      <div style={{ position: "absolute", inset: 0, perspective: 2600 }}>
        <div style={{ position: "absolute", left: 960 - fx * s, top: 560 - fy * s, width: WW, height: WH, transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`, transformOrigin: `${fx}px ${fy}px`,
          filter: "drop-shadow(0 50px 70px rgba(80,30,20,0.35))" }}>
          <Builder g={g} brand={1} from={1995} side={<HostSide g={g} />} topIcons={1} widget={1} url={live ? DOMAIN : "blomsterhuset-rosa.creoble.dk"} live={live} />
        </div>
      </div>
    </Gradient>
  );
};

// ---- 70–72.5 s: "Gå online med dit eget domæne uden teknisk bøvl" ----------------------------------------------------------------
export const D6: React.FC<{ g: number }> = ({ g }) => {
  const icon = <div style={{ width: 96, height: 96, borderRadius: 48, background: "#F6F3EE", display: "flex", alignItems: "center", justifyContent: "center", transform: "translateY(14px)" }}><Icon name="wrench" size={56} color={C.night} stroke={2.2} /></div>;
  if (g < 2130) {
    const mv = pr(g, 2118, 12, MOVE);
    return (
      <Night g={g} a={2100} seed={61}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${lerp(0, -470, mv)}px, ${lerp(0, -330, mv)}px) scale(${lerp(1, 0.62, mv)})`, transformOrigin: "960px 560px" }}>
          <Flow g={g} size={200} y={580} color="#F6F3EE" weight={600} words={[{ t: "Gå", f: 2100 }, { t: "online", f: 2107 }]} />
        </div>
      </Night>
    );
  }
  if (g < 2145) return <Night g={g} a={2100} seed={62}><Flow g={g} size={104} y={260} color="#F6F3EE" words={[{ t: "med", f: 2130 }, { t: "dit", f: 2132 }, { t: "eget", f: 2135 }, { t: "domæne", f: 2138, italic: true }]} /></Night>;
  const y = lerp(260, 540, pr(g, 2150, 25, MOVE));
  return <Night g={g} a={2100} seed={63}><Words g={g} size={104} x={960} y={y} color="#F6F3EE" words={[{ t: "uden", f: 2145 }, { t: "", f: 2148, icon, iconW: 96 }, { t: "teknisk", f: 2151 }, { t: "bøvl", f: 2154 }]} n={8} /></Night>;
};

// ---- 72.5–76 s: "Din hjemmeside starter her — Hvad vil du skabe?" in the mark's glow --------------------------------------------
export const D7: React.FC<{ g: number }> = ({ g }) => {
  const t = g - 2175, grow = lerp(0.92, 1.12, pr(g, 2175, 105, SOFT)), core = pr(g, 2200, 60, SOFT);
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
      {t < 60 && (g < 2190 ? <Words g={g} size={230} x={960} y={470} color="#FFFFFF" weight={600} words={[{ t: "Din", f: 2175 }]} n={8} shadow="0 10px 40px rgba(30,74,63,0.25)" />
        : <Flow g={g} size={100} y={450} color="#FFFFFF" words={[{ t: "Din", f: 2100 }, { t: "hjemmeside", f: 2190 }, { t: "starter", f: 2194 }, { t: "her", f: 2198 }]} shadow="0 8px 30px rgba(30,74,63,0.25)" />)}
      {t >= 60 && <Words g={g} size={104} x={960} y={540} color="#FFFFFF" words={[{ t: "Hvad", f: 2235 }, { t: "vil", f: 2238 }, { t: "du", f: 2241 }, { t: "skabe?", f: 2246, italic: true }]} n={10} rise={0.3} shadow="0 8px 30px rgba(30,74,63,0.25)" />}
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
        <Words g={g} size={70} x={960} y={560} family={F.ui} weight={500} color="#F6F3EE" words={[{ t: "creoble.dk", f: 2355 }]} n={8} spacing={0} />
      </AbsoluteFill>
    );
  }
  const size = 230, ms = 176, gap = 50, ww = tw("Creoble.", size) - size * 0.1;
  const total = ms + gap + ww, mv = pr(g, 2310, 16, MOVE);
  const mx = lerp(960, 960 - total / 2 + ms / 2, mv);
  const k = clamp01((g - 2280) / 12), e = expoOut(12, 0.8)(k), big = lerp(1.35, 1, mv);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      {glow}<Grain opacity={0.14} seed={81} />
      <At x={mx} y={540} s={lerp(0.8, 1, e) * big} o={k}><div style={{ filter: k < 1 ? `blur(${14 * (1 - e)}px)` : undefined }}><Mark size={ms} grad={[C.gSage, C.gCoral, C.gApricot]} id="d8m" /></div></At>
      {g >= 2310 && <div style={{ position: "absolute", left: 960 - total / 2 + ms + gap, top: 540 - size * 0.58 }}><Wordmark size={size} color="#F6F3EE" dot={C.gSage} reveal={pr(g, 2312, 20, SOFT)} /></div>}
    </AbsoluteFill>
  );
};

export { Halo };
