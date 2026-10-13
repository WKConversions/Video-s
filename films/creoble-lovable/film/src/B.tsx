// 23–34 s: the prompt pill in its glowing halo types the ask, is sent, folds to a bar and opens into Creoble's builder,
// which answers its questions and builds the flower shop's site; then the close-up of the prompt box asks for the
// brand's colours, and the tilted builder recolours the site.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, MOVE, SOFT, clamp01, expoOut, lerp, path, pr, press, px } from "./lib";
import { Caret, Cursor, Grain, Icon } from "./kit";
import { Builder, PROMPT, Step, WH, WW } from "./ui";

/** The halo the reference puts round its prompt and its editor: apricot at the edge, coral, then sage-teal far out. */
export const Halo: React.FC<{ x: number; y: number; w: number; h: number; r: number; k?: number; spread?: number }> = ({ x, y, w, h, r, k = 1, spread = 1 }) => {
  const L = (pad: number, color: string, blur: number, op: number) => (
    <div style={{ position: "absolute", left: x - w / 2 - pad, top: y - h / 2 - pad, width: w + pad * 2, height: h + pad * 2, borderRadius: r + pad, background: color, filter: `blur(${blur}px)`, opacity: op * k }} />
  );
  return (
    <>
      {L(250 * spread, C.gTeal, 90 * spread, 0.85)}
      {L(170 * spread, C.gSage, 70 * spread, 0.55)}
      {L(110 * spread, C.gCoral, 55 * spread, 0.95)}
      {L(45 * spread, C.gTerra, 30 * spread, 1)}
      {L(12 * spread, C.gApricot, 16 * spread, 0.85)}
    </>
  );
};

// ---- 23–26 s: the prompt pill -------------------------------------------------------------------------------------------
const ASK = "Lav en hjemmeside til blomsterbutikken";
export const B1: React.FC<{ g: number }> = ({ g }) => {
  const out = px(g, 744, 16, 0.82), Z = lerp(lerp(2.4, 2.3, pr(g, 690, 54, SOFT)), 1, out) * lerp(1, 0.88, pr(g, 760, 20, SOFT));
  const fx = lerp(743, 960, out), fy = 540;
  const sx = (wx: number) => (wx - fx) * Z + 960, sy = (wy: number) => (wy - fy) * Z + 540;
  const fold = pr(g, 765, 14, MOVE);
  const pw = lerp(900, 520, fold), ph = lerp(124, 66, fold);
  const n = Math.max(0, Math.min(ASK.length, Math.floor((g - 698) * 26 / 30)));
  const cur = path(g, [{ f: 744, x: 1560, y: 900 }, { f: 757, x: sx(1349), y: sy(546) }, { f: 772, x: sx(1349), y: sy(546) }, { f: 780, x: sx(1180), y: sy(600) }]);
  const pk = press(g, 758);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${960 - fx * Z}px, ${540 - fy * Z}px) scale(${Z})`, transformOrigin: "0 0" }}>
        <Halo x={960} y={540} w={pw} h={ph} r={ph / 2} spread={lerp(1, 0.75, fold)} />
        <div style={{ position: "absolute", left: 960 - pw / 2, top: 540 - ph / 2, width: pw, height: ph, borderRadius: ph / 2, background: "#060908", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          transform: `scale(${1 - 0.015 * pk})` }}>
          <div style={{ position: "absolute", left: 50, top: 0, height: ph, display: "flex", alignItems: "center", fontFamily: F.ui, fontSize: 30, color: n ? "#F4F2EE" : "#7D8581", whiteSpace: "pre", opacity: 1 - fold * 1.6 }}>
            {n ? ASK.slice(0, n) : "Beskriv din drømmehjemmeside …"}{g >= 694 && g < 760 && <Caret g={g} h={34} color="#F4F2EE" on={n > 0 || g < 698} />}
          </div>
          <div style={{ position: "absolute", right: 24, top: ph / 2 - 38, width: 76, height: 76, borderRadius: 38, background: n > 3 ? `linear-gradient(135deg, ${C.gSage}, ${C.gTeal})` : "#2A3330",
            display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - fold * 1.8, transform: `scale(${1 - 0.14 * pk})` }}><Icon name="arrowUp" size={36} color="#fff" stroke={2.6} /></div>
        </div>
      </div>
      <Grain opacity={0.12} seed={21} />
      {g >= 744 && <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={110} press={pk} />}
    </AbsoluteFill>
  );
};

// ---- 26–28 s: the bar opens into the builder, which builds the site -----------------------------------------------------
export const STEPS = (g: number, a: number): Step[] => [
  { t: "Virksomhed", a: "Blomsterhuset Rosa" }, { t: "Branche", a: "Blomsterbutik" }, { t: "Ydelser", a: "Buketter · Bryllup · Levering" },
  { t: "Kontakt", a: "København · 33 12 45 67" }, { t: "Design", a: "Lyst og romantisk" }, { t: "Billeder", a: "Butikken og buketterne" },
].map((s, i) => ({ ...s, k: pr(g, a + i * 6, 8) }));
const Building: React.FC<{ g: number; a: number }> = ({ g, a }) => {
  const p = clamp01((g - a) / 48);
  return (
    <div style={{ padding: "14px 16px", borderRadius: 14, background: "#fff", border: `1px solid ${C.line}`, fontFamily: F.ui }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: C.sageDeep }}><Icon name="spark" size={18} color={C.sageDeep} />{p < 1 ? "Bygger din hjemmeside…" : "Din hjemmeside er klar"}</div>
      <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: C.sageTint }}><div style={{ width: `${p * 100}%`, height: 6, borderRadius: 3, background: C.sage }} /></div>
    </div>
  );
};
export const B2: React.FC<{ g: number }> = ({ g }) => {
  const e = expoOut(20, 0.84)(clamp01((g - 780) / 20));
  const s = lerp(0.62, 0.86, pr(g, 784, 56, SOFT));
  const w = lerp(520, WW * s, e), h = lerp(66, WH * s, e), r = lerp(33, 22 * s, e);
  const cur = path(g, [{ f: 780, x: 1180, y: 600 }, { f: 800, x: 1620, y: 960 }]);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <Halo x={960} y={540} w={w} h={h} r={r} spread={lerp(0.75, 1.15, e)} />
      <div style={{ position: "absolute", left: 960 - w / 2, top: 540 - h / 2, width: w, height: h, borderRadius: r, overflow: "hidden", background: "#060908" }}>
        <div style={{ position: "absolute", left: w / 2 - (WW * s) / 2, top: h / 2 - (WH * s) / 2, transform: `scale(${s})`, transformOrigin: "0 0", opacity: clamp01((g - 784) / 6) }}>
          <Builder g={g} build={clamp01((g - 792) / 44)} brand={0} from={792} steps={STEPS(g, 788)} status={<Building g={g} a={792} />} />
        </div>
      </div>
      <Grain opacity={0.12} seed={22} />
      {g < 800 && <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={110} />}
    </AbsoluteFill>
  );
};

// ---- 28–31.5 s: the close-up of the prompt box ---------------------------------------------------------------------------
const ASK2 = "Ret farverne så de passer til mit brand og min virksomhed";
const S3 = 2.1, OX = 200, OY = 640 - (PROMPT.y + PROMPT.h / 2) * S3;
export const B3: React.FC<{ g: number }> = ({ g }) => {
  const n = Math.max(0, Math.min(ASK2.length, Math.floor((g - 856) * 34 / 30)));
  const sent = g >= 920;
  const push = lerp(1, 1.05, pr(g, 840, 105, SOFT)) * lerp(0.94, 1, px(g, 840, 14));
  const send = { x: OX + (PROMPT.x + PROMPT.send.x - 24 + 4) * S3, y: OY + (PROMPT.y + PROMPT.h - 40) * S3 };
  const cur = path(g, [{ f: 900, x: 1400, y: 1180 }, { f: 916, x: send.x, y: send.y }, { f: 930, x: send.x + 10, y: send.y + 6 }, { f: 945, x: send.x + 160, y: send.y + 200 }]);
  const msgs = [{ from: "me" as const, text: ASK2, k: pr(g, 921, 10) }, { from: "ai" as const, text: <>Klart! Jeg tilpasser farverne til <i>Blomsterhuset Rosa</i>…</>, k: pr(g, 934, 10) }];
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "560px 640px" }}>
        <div style={{ position: "absolute", inset: 0, perspective: 2600 }}>
          <div style={{ position: "absolute", left: OX, top: OY, width: WW * S3, height: WH * S3, transform: "rotateX(5deg) rotateY(-7deg)", transformOrigin: "360px 1500px" }}>
            <Halo x={WW * S3 / 2} y={WH * S3 / 2} w={WW * S3} h={WH * S3} r={46} spread={1.6} />
            <div style={{ transform: `scale(${S3})`, transformOrigin: "0 0" }}>
              <Builder g={g} build={1} brand={0} from={792} steps={STEPS(g, 0)} status={<Building g={g} a={0} />} prompt={sent ? "" : ASK2.slice(0, n)} caret={!sent} sendPress={press(g, 917)} msgs={msgs} />
            </div>
          </div>
        </div>
      </div>
      <Grain opacity={0.12} seed={23} />
      {g >= 900 && <Cursor x={cur.x} y={cur.y} vx={cur.vx} h={190} press={press(g, 917)} />}
    </AbsoluteFill>
  );
};

// ---- 31.5–34 s: the tilted builder recolours the site --------------------------------------------------------------------
export const B4: React.FC<{ g: number }> = ({ g }) => {
  const b = pr(g, 952, 28, MOVE), sweep = clamp01((g - 950) / 32);
  const ry = lerp(-20, -11, pr(g, 945, 75, SOFT)), rx = lerp(12, 7, pr(g, 945, 75, SOFT)), s = lerp(0.74, 0.8, pr(g, 945, 75, SOFT));
  const msgs = [{ from: "me" as const, text: ASK2, k: 1 }, { from: "ai" as const, text: b < 1 ? <>Klart! Jeg tilpasser farverne til <i>Blomsterhuset Rosa</i>…</> : <>Færdig! Farverne passer nu til dit brand ✓</>, k: 1 }];
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden", perspective: 2400 }}>
      <div style={{ position: "absolute", left: 960 - WW / 2, top: 560 - WH / 2, width: WW, height: WH, transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`, transformStyle: "preserve-3d" }}>
        <Halo x={WW / 2} y={WH / 2} w={WW} h={WH} r={22} spread={1.25} />
        <Builder g={g} build={1} brand={b} from={792} steps={STEPS(g, 0)} status={<Building g={g} a={0} />} msgs={msgs}
          overlay={sweep > 0 && sweep < 1 ? <div style={{ position: "absolute", top: 84, bottom: 16, left: lerp(300, 1700, sweep) - 160, width: 320, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,240,236,0.55), rgba(255,255,255,0))", mixBlendMode: "screen" }} /> : undefined} />
      </div>
      <Grain opacity={0.12} seed={24} />
    </AbsoluteFill>
  );
};
