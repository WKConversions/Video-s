// Scene D — use case (sC → s3): "Launching a product or announcing a new feature? Just type: Make a 25 second video
// about our launch." Two big use-case cards rise on their words (rocket "Product launch", megaphone "New feature"), each
// playing a Lumo film; on "just type" they lift away and the landing prompt box rises, the glow under it, and the brief
// types word by word on the voice while the camera pulls back. Ends exactly in the s3 state: the w 1000 box with the
// full line alone at left 460, top 454, no caret, press 0, on the Ground.
import React from "react";
import { Easing } from "remotion";
import { C, clamp01, DemoFilm, f, FONT, Glow, GRAD_D, Ico, k, LIN, mix, MOVE, POP, PromptBox, SHADOW_BIG } from "../shared";

const CAM = Easing.bezier(0.3, 0.15, 0.55, 1); // the pull-back: under way at once, landing softly

const LINE: [string, string][] = [["Make", "w:make"], ["a", "w:a3"], ["25", "w:25"], ["second", "w:second"], ["video", "w:video2"], ["about", "w:about"], ["our", "w:our"], ["launch.", "w:launch"]];
const FULL = LINE.map((w) => w[0]).join(" ");
// word by word on the voice: each word types quickly from its own spoken word
const spoken = (g: number) => {
  let out = "";
  LINE.forEach(([w, at], i) => {
    const t = g - f(at);
    if (t < 0) return;
    const next = LINE[i + 1];
    const n = next && g >= f(next[1]) ? w.length : Math.min(w.length, Math.floor((t / 30) * 34) + 1);
    out += (i ? " " : "") + w.slice(0, n);
  });
  return out;
};

const CW = 700, FW = 652, FH = 367;
const UseCard: React.FC<{ g: number; icon: string; title: string; tp: number; film: number; iconT: React.CSSProperties }> = ({ g, icon, title, tp, film, iconT }) => (
  <div style={{ width: CW, background: C.white, borderRadius: 28, border: `1px solid ${C.line}`, boxShadow: SHADOW_BIG, padding: 24, boxSizing: "border-box", fontFamily: FONT }}>
    <div style={{ width: FW, height: FH, borderRadius: 16, overflow: "hidden", position: "relative" }}><DemoFilm s={film} w={FW} h={FH} /></div>
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 24, height: 84 }}>
      <div style={{ width: 84, height: 84, borderRadius: 24, background: GRAD_D, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", boxShadow: "0 12px 24px -12px rgba(84,42,255,0.8)", overflow: "hidden" }}>
        <div style={iconT}><Ico n={icon} s={50} c={C.white} w={2.4} /></div>
      </div>
      <div style={{ fontWeight: 700, fontSize: 50, letterSpacing: "-0.035em", color: C.ink, whiteSpace: "nowrap", opacity: clamp01(tp * 3), transform: `translateY(${(1 - Math.min(1, tp)) * 26}px) scale(${0.9 + 0.1 * tp})`, transformOrigin: "0% 50%" }}>{title}</div>
    </div>
  </div>
);

export const SceneD: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sC") || g >= f("s3")) return null;
  const end = f("s3") - 1; // the last frame D draws: must equal the s3 state

  // the glow: continues from C, rises under the box (the landing look), then clears to the bare Ground by s3
  const gUp = k(g, "w:just-0.1", 0.8), gDown = k(g, "w:launch", (end - f("w:launch")) / 30, LIN);
  const glowA = mix(0.45, 0.85, gUp) * (1 - gDown);

  // the two use-case cards: "Product launch" rises centred, slides left as "New feature" arrives from the right
  const i1 = k(g, "w:launching-0.25", 0.65), sl = k(g, "w:announcing-0.25", 0.6, MOVE), i2 = k(g, "w:announcing-0.2", 0.65);
  const e1 = k(g, "w:just-0.15", 0.45, MOVE), e2 = k(g, "w:just-0.1", 0.45, MOVE);
  const push = 1 + 0.06 * k(g, "sC", (f("w:just") - f("sC")) / 30, LIN), drift = 70 - (g - f("sC")) * 1.6; // the pair floats up
  const t1 = k(g, "w:product-0.05", 0.4, POP), t2 = k(g, "w:new-0.05", 0.4, POP);
  const rocket: React.CSSProperties = { transform: `translateY(${Math.sin(g / 5) * 3 - 14 * k(g, "w:product", 0.35, POP) + 14 * k(g, "w:product+0.35", 0.4)}px)` };
  const mega: React.CSSProperties = { transform: `rotate(${Math.sin(g / 3.2) * 7 * (0.4 + 0.6 * k(g, "w:announcing", 0.3))}deg)` };

  // the box: rises on "just", the caret on "type", the line types on the voice; the camera pulls back to identity by s3
  const pa = k(g, "w:just-0.1", 0.7);
  const cam = k(g, "w:just", (end - f("w:just")) / 30, CAM), zoom = mix(1.42, 1, cam), lift = (1 - cam) * 130;
  const caret = g >= f("w:type") && g < f("w:launch+0.35");
  const text = g >= f("w:launch+0.3") ? FULL : spoken(g); // the exact hand-off line once "launch" is said

  return (
    <>
      <Glow g={g} a={glowA} />
      {e1 < 1 && i1 > 0 && (
        <div style={{ position: "absolute", left: mix(610, 220, sl), top: 278, transform: `translateY(${(1 - i1) * 560 + drift - e1 * 620}px) scale(${push * (1 - 0.1 * e1)})`, opacity: clamp01(i1 * 2.5) * (1 - e1) }}>
          <UseCard g={g} icon="rocket" title="Product launch" tp={t1} film={(g - f("w:launching-0.25")) / 30} iconT={rocket} />
        </div>
      )}
      {e2 < 1 && i2 > 0 && (
        <div style={{ position: "absolute", left: 980 + (1 - i2) * 760, top: 278, transform: `translateY(${drift - e2 * 620}px) scale(${push * (1 - 0.1 * e2)})`, opacity: clamp01(i2 * 2.5) * (1 - e2) }}>
          <UseCard g={g} icon="megaphone" title="New feature" tp={t2} film={10.7 + (g - f("w:announcing-0.2")) / 30} iconT={mega} />
        </div>
      )}
      {pa > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: cam >= 1 ? undefined : `translateY(${lift}px) scale(${zoom})`, transformOrigin: "960px 540px" }}>
          <PromptBox w={1000} text={text} g={g} caret={caret} press={0}
            style={{ position: "absolute", left: 460, top: 454, opacity: pa >= 1 ? undefined : clamp01(pa * 2), transform: pa >= 1 ? undefined : `translateY(${(1 - pa) * 420}px)` }} />
        </div>
      )}
    </>
  );
};
