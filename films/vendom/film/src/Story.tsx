// The Vendom film, beat by beat on the voice-over's words. One clean, bright world: water and Vendom's teal bubble.
// The bubble is the thread: it closes the opening, opens the brand, travels the steps and closes the film; every new
// picture opens as a circle out of an object (a bubble, a card, a chip).
import React from "react";
import { Img, staticFile } from "remotion";
import { ARRIVE, C, F, MOVE, SHADOW, SHADOW_SOFT, SOFT, W, at, clamp01, expoOut, lerp, mix, pr, px, rgba } from "./lib";
import { Icon } from "./icons";
import { Card, Check, Chip, Field, Logo, MEDIA, Media, Place, Switch, Words, rise } from "./shared";

const circle = (r: number, x: number, y: number) => (r < 2290 ? `circle(${r}px at ${x}px ${y}px)` : undefined);
const open = (g: number, a: number, n: number) => 2300 * expoOut(n, 0.86)(clamp01((g - a) / n));
const SPA = (n: string) => `img/spa/${n}.jpg`;
/** Clip lengths in frames (30 fps), so a clip loops instead of freezing on its last frame. */
const LEN: Record<string, number> = { [MEDIA.caustics]: 428, [MEDIA.surface]: 148, [MEDIA.jet]: 178, [MEDIA.bubbles]: 208, [MEDIA.dense]: 178, [MEDIA.snow]: 208 };
const loopOf = (src: string, skip = 0) => Math.max(30, (LEN[src] ?? 900) - Math.round(skip * 30) - 2);
const Water: React.FC<{ src: string; from: number; skip?: number; veil?: number; veilColor?: string }> = ({ src, from, skip = 0, veil = 0, veilColor = C.page }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <Media src={src} from={from} skip={skip} loop={loopOf(src, skip)} />
    {veil > 0 && <div style={{ position: "absolute", inset: 0, background: rgba(veilColor, veil) }} />}
  </div>
);

// ---- 1 "Your next escape might be closer than you think." --------------------------------------------------------------
const DEST = ["BALI", "SANTORINI", "MALDIVES", "TULUM", "MAURITIUS", "IBIZA", "ZANZIBAR"];
const Escape: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:your", -0.25), land = W("w:closer", 0.0), out = W("w:think", 0.45);
  if (g > out + 16) return null;
  const e = px(g, a, 20, 0.84);
  // the destination flips every 4 frames until "closer", then lands on your garden
  const flips = Math.max(0, Math.floor((Math.min(g, land) - (a + 10)) / 4));
  const word = g >= land ? "YOUR GARDEN" : DEST[flips % DEST.length];
  const sinceFlip = g >= land ? g - land : (g - (a + 10)) % 4;
  const flipK = clamp01(sinceFlip / (g >= land ? 8 : 3));
  const km = Math.round(lerp(12400, 0, MOVE(clamp01((g - land) / 22))) / 10) * 10;
  const shrink = pr(g, out, 16, MOVE);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, clipPath: shrink > 0 ? circle(lerp(1400, 0, shrink), 960, 540) : undefined }}>
        <Water src={MEDIA.surface} from={0} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${rgba(C.navy, 0.0)} 30%, ${rgba(C.navy, 0.25)} 100%)` }} />
      </div>
      <div style={{ ...at(960, 540 + 60 * (1 - e), lerp(1, 0.2, shrink), clamp01((g - a) / 8) * (1 - shrink)), filter: e < 1 ? `blur(${8 * (1 - e)}px)` : undefined }}>
        <div style={{ width: 1180, height: 400, borderRadius: 44, background: C.white, boxShadow: SHADOW, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, padding: "56px 64px", position: "relative" }}>
            <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 26, letterSpacing: 6, color: C.aquaDeep }}>YOUR NEXT ESCAPE</div>
            <div style={{ height: 130, overflow: "hidden", marginTop: 18 }}>
              <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: g >= land ? 104 : 112, color: C.navy, lineHeight: "130px", whiteSpace: "nowrap",
                transform: `translateY(${50 * (1 - ARRIVE(flipK))}px)`, opacity: clamp01(flipK * 2) }}>{word}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, fontFamily: F.ui, fontSize: 28, color: C.muted }}>
              <Icon name={g >= land ? "home" : "plane"} size={34} color={C.aquaDeep} stroke={2} />{g >= land ? "Right outside your door" : "Departing soon"}</div>
          </div>
          <div style={{ width: 330, background: C.foam, borderLeft: `3px dashed ${C.mist}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 22, letterSpacing: 4, color: C.muted }}>DISTANCE</div>
            <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 52, color: g >= land ? C.aquaDeep : C.navy, marginTop: 8, whiteSpace: "nowrap" }}>{km.toLocaleString("en-US").replace(/,/g, " ")} km</div>
          </div>
        </div>
      </div>
    </>
  );
};

// ---- 2 "Meet Vendom." ------------------------------------------------------------------------------------------------------
const meetA = () => W("w:meet", -0.3);
const Meet: React.FC<{ g: number }> = ({ g }) => {
  const a = meetA(), out = W("w:a", -0.1);
  if (g < a || g > W("w:start", 0.2)) return null;
  const r = open(g, a, 30);
  const logoE = pr(g, W("w:meet", -0.05), 18), word = pr(g, W("w:vendom", -0.1), 20, MOVE);
  const up = pr(g, out, 24, MOVE);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, clipPath: circle(r, 960, 540) }}>
        <Water src={MEDIA.bubbles} from={a} skip={0.5} veil={0.15 + 0.6 * up} />
      </div>
      <div style={{ ...at(lerp(960, 960, up), lerp(540, 150, up), lerp(0.85 + 0.15 * ARRIVE(logoE), 0.5, up), clamp01((g - W("w:meet", -0.05)) / 8)) }}>
        <Logo h={150} word={word} tag={pr(g, W("w:vendom", 0.3), 16)} />
      </div>
    </>
  );
};

// ---- 3 "A smarter way to bring wellness home." ------------------------------------------------------------------------------
/** The spa at home, in the shape of a house: the roof rises on "home". */
const HomeShape: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:a", -0.05), roof = pr(g, W("w:home", -0.15), 18, MOVE), out = W("w:start", -0.25);
  if (g < a || g > out + 20) return null;
  const e = pr(g, a, 22, MOVE), x = pr(g, out, 18, MOVE);
  const w = 1000, h = 640, rh = 170 * roof;
  const poly = `polygon(0px ${rh}px, ${w / 2}px 0px, ${w}px ${rh}px, ${w}px ${h + rh}px, 0px ${h + rh}px)`;
  return (
    <div style={{ ...at(960, 600 + 80 * (1 - e) - 30 * x, 1 - 0.4 * x, clamp01((g - a) / 8) * (1 - x)) }}>
      <div style={{ width: w, height: h + 170, position: "relative", filter: "drop-shadow(0 40px 60px rgba(11,26,46,0.28))" }}>
        <div style={{ position: "absolute", left: 0, top: 170 - rh, width: w, height: h + rh, clipPath: poly, overflow: "hidden", borderRadius: 30 }}>
          <Media src={MEDIA.home} pos="50% 62%" />
        </div>
      </div>
    </div>
  );
};

// ---- 4–5 "Start with your space." / "Discover a range of spas, from compact designs to spacious swim spas." ----------------
const RANGE: [string, string][] = [["CORFOU-BLANC-INTERIEUR-1", "Corfou"], ["RHODES-BLANC-INTERIEUR-1", "Rhodes"], ["MILOS-BLANC-MARBRE-INTERIEUR", "Milos"],
  ["TAHITI-BLANC-MARBRE-INTERIEUR", "Tahiti"], ["HAWAI-BLANC-MARBRE-INTERIEUR", "Hawaï"], ["IBIZA-BLANC-MARBRE-INTERIEUR", "Ibiza"]];
const TER = { x: 960, y: 680, w: 1560, h: 520 };
const Space: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:start", -0.25), out = W("w:choose", -0.3);
  if (g < a || g > out + 24) return null;
  const r = open(g, a, 32);
  const draw = pr(g, W("w:space", -0.3), 26, (t) => t);
  const x = pr(g, out, 20, MOVE);
  const rangeA = W("w:discover", -0.05), compact = W("w:compact", -0.1), swim = W("w:spacious", -0.05);
  const per = 2 * (TER.w + TER.h);
  // the compact spa (Milos) leaves the range and settles in the space; the swim spa slides in, long
  const ck = pr(g, compact, 22, MOVE), sk = pr(g, swim, 24, MOVE);
  const tx = (i: number) => 960 + (i - 2.5) * 280, ty = 215;
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: r < 2290 ? circle(r, 960, 600) : "inset(70px 70px 60px 70px round 44px)", opacity: 1 - x }}>
      <div style={{ position: "absolute", inset: 0, background: C.foam }} />
      {/* a quiet plan grid */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 33 }, (_, i) => <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={1080} stroke={C.mist} strokeWidth={1.5} />)}
        {Array.from({ length: 19 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 60} x2={1920} y2={i * 60} stroke={C.mist} strokeWidth={1.5} />)}
        {/* your space: the terrace, drawn */}
        <rect x={TER.x - TER.w / 2} y={TER.y - TER.h / 2} width={TER.w} height={TER.h} rx={24} fill={rgba(C.sand, 0.85 * clamp01(draw * 2 - 0.4))} stroke={C.navy} strokeWidth={4}
          strokeDasharray={per} strokeDashoffset={per * (1 - draw)} />
        <g opacity={clamp01(draw * 2 - 1)}>
          <line x1={TER.x - TER.w / 2} y1={TER.y + TER.h / 2 + 46} x2={TER.x + TER.w / 2} y2={TER.y + TER.h / 2 + 46} stroke={C.aquaDeep} strokeWidth={3} />
          <line x1={TER.x - TER.w / 2} y1={TER.y + TER.h / 2 + 34} x2={TER.x - TER.w / 2} y2={TER.y + TER.h / 2 + 58} stroke={C.aquaDeep} strokeWidth={3} />
          <line x1={TER.x + TER.w / 2} y1={TER.y + TER.h / 2 + 34} x2={TER.x + TER.w / 2} y2={TER.y + TER.h / 2 + 58} stroke={C.aquaDeep} strokeWidth={3} />
        </g>
      </svg>
      {draw > 0.5 && <div style={{ ...at(TER.x, TER.y + TER.h / 2 + 46, 1, clamp01(draw * 2 - 1)) }}>
        <div style={{ background: C.foam, padding: "2px 18px", fontFamily: F.ui, fontWeight: 500, fontSize: 28, color: C.aquaDeep }}>Your space</div></div>}
      {/* the range */}
      {RANGE.map(([f, name], i) => {
        const s0 = rangeA + i * 4;
        if (g < s0) return null;
        const e = pr(g, s0, 16, MOVE);
        const chosen = i === 2;
        const kk = chosen ? ck : 0;
        const cx = lerp(tx(i), 560, kk), cy = lerp(ty, TER.y, kk), sc = lerp(1, 1.75, kk);
        return (
          <div key={f} style={{ ...at(cx, cy + 40 * (1 - e), sc, clamp01((g - s0) / 6) * (chosen ? 1 : 1 - 0.65 * ck)) }}>
            <div style={{ width: 240, height: 180, borderRadius: 24, background: C.white, boxShadow: SHADOW_SOFT, overflow: "hidden", position: "relative" }}>
              <Img src={staticFile(SPA(f))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.18)" }} />
            </div>
            <div style={{ textAlign: "center", marginTop: 10, fontFamily: F.ui, fontWeight: 500, fontSize: 22 / sc * (1 + kk * 0.2), color: C.navy, opacity: 1 - kk }}>{name}</div>
          </div>
        );
      })}
      {ck > 0 && <div style={{ ...at(560, TER.y - 205, 1, ck) }}><Chip icon="tub" text="Compact" size={26} /></div>}
      {/* the swim spa: long, from the site's Hydra (590 × 225 cm) */}
      {g >= swim && (
        <div style={{ ...at(lerp(1700, 1250, sk), TER.y, 1, clamp01((g - swim) / 6)) }}>
          <div style={{ width: 760, height: 300, borderRadius: 26, background: C.white, boxShadow: SHADOW, overflow: "hidden" }}>
            <Img src={staticFile(SPA("HYDRA-BLANC-MARBRE-INTERIEUR"))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.06)" }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: -64, display: "flex", justifyContent: "center", opacity: pr(g, swim + 10, 12) }}>
            <Chip icon="waves" text="Swim spa · Hydra 590 × 225 cm" size={26} /></div>
        </div>
      )}
    </div>
  );
};

// ---- 6 "Choose your experience." -----------------------------------------------------------------------------------------
const chooseA = () => W("w:choose", -0.3);
const Choose: React.FC<{ g: number }> = ({ g }) => {
  const a = chooseA(), out = W("w:targeted", -0.25);
  if (g < a || g > out + 18) return null;
  const x = pr(g, out, 16, MOVE);
  const opt = (i: number, icon: string, t: string, sub: string, on: number) => {
    const e = pr(g, a + 6 + i * 4, 18, MOVE);
    return (
      <div key={t} style={{ ...at(960 + (i ? 300 : -300) + (i ? 200 : -200) * x, 560 + 60 * (1 - e), 1, clamp01((g - a - 6 - i * 4) / 8) * (1 - x)) }}>
        <Card w={540} pad={40} r={36}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Img src={staticFile(`img/${icon}`)} style={{ width: 110, height: 110, objectFit: "cover", borderRadius: 28 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: C.navy }}>{t}</div>
              <div style={{ fontFamily: F.ui, fontWeight: 400, fontSize: 24, color: C.muted, marginTop: 4 }}>{sub}</div>
            </div>
            <Switch on={on} w={86} />
          </div>
        </Card>
      </div>
    );
  };
  return (
    <>
      {opt(0, "Hydromassage.png", "Hydromassage", "Targeted jets", pr(g, W("w:experience", 0.0), 10, MOVE))}
      {opt(1, "Isolation.png", "Insulation", "Warmth kept in", pr(g, W("w:experience", 0.3), 10, MOVE))}
    </>
  );
};

/** Water behind the experience, the jets and the steps (caustics over tiles, under a light veil). */
const WaterBack: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:start", -0.25), out = W("w:less", 0.4);
  if (g < a || g > out) return null;
  const r = open(g, a, 30);
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: circle(r, 960, 1080) }}>
      {/* a calm shimmer behind the cards: softened and veiled, so the cards stay the subject */}
      <div style={{ position: "absolute", inset: -20, filter: "blur(5px)" }}><Water src={MEDIA.caustics} from={a} /></div>
      <div style={{ position: "absolute", inset: 0, background: rgba(C.foam, 0.79) }} />
    </div>
  );
};

// ---- 7 "Targeted hydromassage jets help release tension," ---------------------------------------------------------------------
const JETS: [number, number][] = [[0.3, 0.33], [0.7, 0.3], [0.5, 0.72]];
const Jets: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:targeted", -0.25), out = W("w:while", -0.2);
  if (g < a || g > out + 18) return null;
  const e = pr(g, a, 22, MOVE), x = pr(g, out, 16, MOVE);
  const rel = W("w:release", -0.1);
  const burst = pr(g, rel, 26, MOVE);
  return (
    <>
      {/* release: the bubbles rush up behind */}
      {g >= rel && <div style={{ position: "absolute", inset: 0, clipPath: circle(open(g, rel, 28), 1240, 560), opacity: 1 - x }}>
        <Water src={MEDIA.dense} from={rel} veil={0.1} veilColor={C.white} />
      </div>}
      <div style={{ ...at(560, 560 + 60 * (1 - e), 1, clamp01((g - a) / 8) * (1 - x)) }}>
        <div style={{ width: 520, height: 820, borderRadius: 40, overflow: "hidden", boxShadow: SHADOW, position: "relative" }}>
          <Media src={MEDIA.jet} from={a} skip={0.5} loop={loopOf(MEDIA.jet, 0.5)} />
          <div style={{ position: "absolute", left: 28, bottom: 28 }}><Chip icon="droplet" text="Hydromassage jets" size={26} /></div>
        </div>
      </div>
      <div style={{ ...at(1240, 560 + 60 * (1 - e) - 40 * burst, 1, clamp01((g - a - 4) / 8) * (1 - x)) }}>
        <Card w={720} h={620} pad={0} r={40} style={{ overflow: "hidden" }}>
          <Img src={staticFile(SPA("TAHITI-BLANC-MARBRE-INTERIEUR"))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)" }} />
          {JETS.map(([fx, fy], i) => {
            const t0 = W("w:hydromassage", -0.1) + i * 6;
            if (g < t0) return null;
            const ring = ((g - t0) % 30) / 30;
            return (
              <div key={i} style={{ position: "absolute", left: fx * 720, top: fy * 620 }}>
                <div style={{ position: "absolute", left: -18, top: -18, width: 36, height: 36, borderRadius: 18, background: C.aqua, opacity: clamp01((g - t0) / 6) }} />
                <div style={{ position: "absolute", left: -18, top: -18, width: 36, height: 36, borderRadius: 18, border: `4px solid ${C.aqua}`, transform: `scale(${1 + 3 * ring})`, opacity: 1 - ring }} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 28, top: 28, opacity: pr(g, W("w:jets", -0.1), 12) }}><Chip icon="spark" text="Targeted" size={26} /></div>
          {g >= W("w:tension", -0.1) && <div style={{ position: "absolute", right: 28, bottom: 28, ...rise(pr(g, W("w:tension", -0.1), 14), 16) }}>
            <Chip icon="check" text="Tension released" tone="green" size={26} /></div>}
        </Card>
      </div>
    </>
  );
};

// ---- 8 "while advanced insulation helps keep the warmth in and energy use down." -------------------------------------------
const Insulation: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:while", -0.2), out = W("w:then", -0.2);
  if (g < a || g > out + 18) return null;
  const e = pr(g, a, 22, MOVE), x = pr(g, out, 16, MOVE);
  const ins = pr(g, W("w:insulation", -0.1), 22, MOVE);         // the insulation layer wraps the water
  const warm = pr(g, W("w:warmth", -0.1), 18, MOVE);            // heat turns back inward
  const down = pr(g, W("w:energy", -0.05), 24, MOVE);           // energy use falls
  const wob = Math.sin(g / 7) * 6;
  return (
    <>
      <div style={{ ...at(560, 560 + 60 * (1 - e), 1, clamp01((g - a) / 8) * (1 - x)) }}>
        <div style={{ width: 520, height: 820, borderRadius: 40, overflow: "hidden", boxShadow: SHADOW, position: "relative" }}>
          <Media src={MEDIA.snow} from={a} loop={loopOf(MEDIA.snow)} />
          <div style={{ position: "absolute", left: 28, top: 28 }}><Chip icon="snowflake" text="Outside −2 °C" tone="navy" size={26} /></div>
        </div>
      </div>
      <div style={{ ...at(1240, 560 + 60 * (1 - e), 1, clamp01((g - a - 4) / 8) * (1 - x)) }}>
        <Card w={720} h={620} pad={44} r={40}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: C.navy }}>Advanced insulation</div>
          {/* a cut through the spa: cabinet, insulation, warm water */}
          <div style={{ position: "relative", marginTop: 26, height: 290, borderRadius: 26, background: "#6B5A4C", padding: 18, boxSizing: "border-box" }}>
            <div style={{ position: "absolute", inset: 18, borderRadius: 18, background: `repeating-linear-gradient(45deg, ${C.white} 0 10px, ${C.mist} 10px 20px)`,
              clipPath: `inset(0 ${100 * (1 - ins)}% 0 0 round 18px)` }} />
            <div style={{ position: "absolute", inset: 46, borderRadius: 14, background: `linear-gradient(180deg, ${C.warm} 0%, ${C.warmDeep} 100%)` }}>
              {[0.25, 0.5, 0.75].map((f, i) => (
                <div key={i} style={{ position: "absolute", left: `${f * 100}%`, top: 20 + wob * (i % 2 ? 1 : -1), transform: `translateX(-50%) rotate(${180 * warm}deg)`, opacity: 0.9 }}>
                  <Icon name="arrowUp" size={54} color="#FFFFFF" stroke={2.6} /></div>))}
              <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: F.display, fontWeight: 600, fontSize: 64, color: "#FFFFFF" }}>38 °C</div>
            </div>
          </div>
          {g >= W("w:keep", -0.1) && <div style={{ position: "absolute", right: 30, top: 30, ...rise(pr(g, W("w:keep", -0.1), 14), 18) }}>
            <Chip icon="flame" text="Heat stays in" tone="terra" size={26} /></div>}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 30 }}>
            <Icon name="bolt" size={38} color={C.aquaDeep} stroke={2.2} />
            <div style={{ flex: 1, height: 20, borderRadius: 10, background: C.foam, overflow: "hidden" }}>
              <div style={{ width: `${lerp(82, 34, down)}%`, height: "100%", borderRadius: 10, background: mix(C.warm, C.aqua, down) }} /></div>
            <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.navy, width: 210, whiteSpace: "nowrap" }}>Energy use {down > 0.5 ? "↓" : ""}</div>
          </div>
        </Card>
      </div>
    </>
  );
};

// ---- 9–10 "Then leave the details to the experts. From choosing the right model to delivery, installation, and ongoing support,
//           Vendom guides every step." ---------------------------------------------------------------------------------------------
const STEPS: { icon: string; t: string; key: string }[] = [
  { icon: "tub", t: "The right model", key: "w:choosing" }, { icon: "truck", t: "Delivery", key: "w:delivery" },
  { icon: "wrench", t: "Installation", key: "w:installation" }, { icon: "headset", t: "Ongoing support", key: "w:support" }];
const NX = (i: number) => 330 + i * 420, NY = 600;
const Steps: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:then", -0.2), out = W("w:less", -0.2);
  if (g < a || g > out + 18) return null;
  const e = pr(g, a, 20, MOVE), fold = pr(g, out, 16, MOVE);
  const experts = W("w:experts", -0.15);
  const pathK = pr(g, W("w:from2", -0.1), 16, MOVE);
  // the bubble travels the path and arrives at each step on its word
  const arr = STEPS.map((s) => W(s.key, -0.05));
  let bx = NX(0);
  for (let i = 0; i < 4; i++) if (g >= arr[i]) bx = NX(i);
  for (let i = 1; i < 4; i++) if (g >= arr[i] - 12 && g < arr[i]) bx = lerp(NX(i - 1), NX(i), MOVE(clamp01((g - arr[i] + 12) / 12)));
  const guides = pr(g, W("w:guides", -0.1), 24, MOVE);
  const endX = lerp(bx, NX(3), guides);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - fold, transform: `scale(${1 - 0.3 * fold})`, transformOrigin: "960px 540px" }}>
      {/* the details card, handed to the experts */}
      {g < W("w:from2", 0.4) && <div style={{ ...at(960, 540 + 60 * (1 - e) - 120 * pathK, 1, clamp01((g - a) / 8) * (1 - pathK)) }}>
        <Card w={760} pad={44} r={36}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: C.navy }}>Your spa project</div>
          {["Which model?", "Delivery", "Installation", "Support"].map((t, i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, fontFamily: F.ui, fontSize: 28, color: C.muted, ...rise(pr(g, a + 6 + i * 3, 12), 12) }}>
              <Check k={pr(g, experts + 6 + i * 4, 10)} size={36} color={C.aquaDeep} />{t}</div>))}
          {g >= experts && <div style={{ position: "absolute", right: 34, top: 30, ...rise(pr(g, experts, 14), 16) }}>
            <Chip icon="users" text="Vendom experts" size={26} /></div>}
        </Card>
      </div>}
      {/* the path */}
      {pathK > 0 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: pathK }}>
        <line x1={NX(0)} y1={NY} x2={NX(3)} y2={NY} stroke={C.mist} strokeWidth={10} strokeLinecap="round" />
        <line x1={NX(0)} y1={NY} x2={Math.max(NX(0), endX)} y2={NY} stroke={C.aqua} strokeWidth={10} strokeLinecap="round" />
      </svg>}
      {pathK > 0 && STEPS.map((s, i) => {
        const on = g >= arr[i];
        const k = pr(g, arr[i], 16, MOVE);
        const done = pr(g, W("w:every", -0.1) + i * 4, 10);
        return (
          <React.Fragment key={s.t}>
            <div style={{ ...at(NX(i), NY, 1, pathK) }}>
              <div style={{ width: 92, height: 92, borderRadius: 46, background: on ? C.aqua : C.white, border: `4px solid ${on ? C.aqua : C.mist}`, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: SHADOW_SOFT }}>
                {done > 0.5 ? <Icon name="check" size={46} color="#fff" stroke={3} /> : <Icon name={s.icon} size={46} color={on ? "#fff" : C.aquaDeep} stroke={2.1} />}
              </div>
            </div>
            {on && <div style={{ ...at(NX(i), NY - 220 + 40 * (1 - k), 0.85 + 0.15 * ARRIVE(k), clamp01(k * 2)) }}>
              <div style={{ width: 360, borderRadius: 30, background: C.white, boxShadow: SHADOW, padding: "18px 18px 22px", boxSizing: "border-box", textAlign: "center" }}>
                {i === 0 ? <Img src={staticFile(SPA("MILOS-BLANC-MARBRE-INTERIEUR"))} style={{ width: "100%", height: 170, objectFit: "cover", borderRadius: 18 }} />
                  : <div style={{ height: 170, borderRadius: 18, background: C.aqua, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={s.icon} size={96} color="#FFFFFF" stroke={1.8} /></div>}
                <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.navy, marginTop: 14 }}>{s.t}</div>
              </div>
            </div>}
          </React.Fragment>
        );
      })}
      {/* the bubble that guides */}
      {pathK > 0 && <div style={{ ...at(endX, NY, 1, pathK) }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: C.white, border: `6px solid ${C.aquaDeep}`, boxShadow: `0 0 0 10px ${rgba(C.aqua, 0.3)}` }} /></div>}
      {guides > 0 && <Place x={960} y={850} k={guides} d={30}><Logo h={96} word={1} tag={0} /></Place>}
    </div>
  );
};

// ---- 11 "Less planning. More relaxing." -------------------------------------------------------------------------------------------
const Less: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:less", -0.05), out = W("w:more", -0.15) + 30;
  if (g < a || g > out) return null;
  return <Place x={960} y={540} k={pr(g, a, 14)} d={20}><Chip icon="check" text="All arranged" tone="green" size={42} /></Place>;
};
const relaxA = () => W("w:more", -0.15);
const Relax: React.FC<{ g: number }> = ({ g }) => {
  const a = relaxA(), out = W("w:vendom3", -0.35);
  if (g < a || g > out + 24) return null;
  const r = open(g, a, 30);
  const season = W("w:all", -0.25);
  const sr = g >= season ? open(g, season, 24) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: circle(r, 960, 540) }}>
      <Media src={MEDIA.relax} pos="50% 40%" />
      {/* bubbles rise through the water at the bottom of the picture */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 640, mixBlendMode: "screen", opacity: 0.62,
        WebkitMaskImage: "linear-gradient(0deg, black 30%, transparent 100%)", maskImage: "linear-gradient(0deg, black 30%, transparent 100%)" }}>
        <Media src={MEDIA.dense} from={a} skip={1} loop={loopOf(MEDIA.dense, 1)} /></div>
      {/* all year round: winter opens out of the panel */}
      {sr > 0 && <div style={{ position: "absolute", inset: 0, clipPath: circle(sr, 1440, 540) }}>
        <Media src={MEDIA.snow} from={season} skip={2} loop={loopOf(MEDIA.snow, 2)} />
        <div style={{ position: "absolute", inset: 0, background: rgba(C.navy, 0.18) }} /></div>}
    </div>
  );
};

// ---- 12–13 "And a personal wellness space that's always ready when you are. All year round." ------------------------------------
const SEASONS: [string, string, string][] = [["snowflake", "Winter", "−2°"], ["flower", "Spring", "14°"], ["sun", "Summer", "28°"], ["leaf", "Autumn", "9°"]];
const Panel: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:personal", -0.25), out = W("w:vendom3", -0.35);
  if (g < a || g > out + 16) return null;
  const e = pr(g, a, 22, MOVE), x = pr(g, out, 16, MOVE);
  const ready = pr(g, W("w:ready", -0.1), 14);
  const ring = pr(g, a + 8, 40, SOFT);
  const yr = W("w:all", -0.15);
  const C0 = 2 * Math.PI * 120;
  return (
    <div style={{ ...at(1440, 540 + 60 * (1 - e), 1, clamp01((g - a) / 8) * (1 - x)) }}>
      <div style={{ width: 640, borderRadius: 44, background: rgba("#FFFFFF", 0.94), boxShadow: SHADOW, padding: "44px 48px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: C.navy }}>Your spa</div>
          <div style={{ opacity: ready }}><Chip icon="check" text="Ready" tone="green" size={26} /></div>
        </div>
        <div style={{ position: "relative", width: 300, height: 300, margin: "26px auto 0" }}>
          <svg width={300} height={300} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx={150} cy={150} r={120} stroke={C.foam} strokeWidth={22} fill="none" />
            <circle cx={150} cy={150} r={120} stroke={C.aqua} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={C0} strokeDashoffset={C0 * (1 - 0.78 * ring)} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 92, color: C.navy, lineHeight: 1 }}>{Math.round(lerp(31, 38, ring))}°</div>
            <div style={{ fontFamily: F.ui, fontSize: 24, color: C.muted, marginTop: 6 }}>water</div>
          </div>
        </div>
        {/* all year round: the seasons pass, the water stays ready */}
        <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
          {SEASONS.map(([ic, t, deg], i) => {
            const on = pr(g, yr + i * 5, 8);
            return (
              <div key={t} style={{ flex: 1, borderRadius: 20, padding: "14px 6px", textAlign: "center", background: mix(C.foam, C.aqua, on * (i === Math.min(3, Math.floor((g - yr) / 5)) ? 1 : 0.25)),
                opacity: g >= yr ? 1 : 0.55 }}>
                <Icon name={ic} size={34} color={on > 0.5 ? "#fff" : C.aquaDeep} stroke={2} />
                <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 20, color: on > 0.5 ? "#fff" : C.navy }}>{t}</div>
                <div style={{ fontFamily: F.ui, fontSize: 18, color: on > 0.5 ? "#fff" : C.muted }}>{deg}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---- 14 "Vendom. Make room for wellbeing." --------------------------------------------------------------------------------------
const SignOff: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:vendom3", -0.35);
  if (g < a) return null;
  const r = open(g, a, 30);
  const logoE = pr(g, W("w:vendom3", -0.1), 20);
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: circle(r, 960, 470) }}>
      <div style={{ position: "absolute", inset: 0, background: C.page }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.22 }}><Media src={MEDIA.bubbles} from={a} skip={0} loop={loopOf(MEDIA.bubbles)} /></div>
      <div style={{ ...at(960, 440 + 30 * (1 - logoE), 1, clamp01((g - W("w:vendom3", -0.1)) / 8)), filter: logoE < 1 ? `blur(${6 * (1 - logoE)}px)` : undefined }}>
        <Logo h={170} word={pr(g, W("w:vendom3", 0.05), 20, MOVE)} tag={pr(g, W("w:vendom3", 0.4), 16)} />
      </div>
      <Words g={g} size={62} x={960} y={680} weight={300} color={C.navy} words={[{ t: "Make", f: W("w:make", -0.1) }, { t: "room", f: W("w:room", -0.1) }, { t: "for", f: W("w:for", -0.1) },
        { t: "wellbeing.", f: W("w:wellbeing", -0.1), color: C.aquaDeep }]} />
      {g >= W("w:wellbeing", 0.5) && <Place x={960} y={800} k={pr(g, W("w:wellbeing", 0.5), 14)} d={14}>
        <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 30, letterSpacing: 2, color: C.muted }}>vendom-pro.com</div></Place>}
    </div>
  );
};

export const Story: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div style={{ position: "absolute", inset: 0, background: C.page }} />
    <Escape g={g} />
    <Meet g={g} />
    <HomeShape g={g} />
    <WaterBack g={g} />
    <Space g={g} />
    <Choose g={g} />
    <Jets g={g} />
    <Insulation g={g} />
    <Steps g={g} />
    <Less g={g} />
    <Relax g={g} />
    <Panel g={g} />
    <SignOff g={g} />
  </div>
);
export { Field };
