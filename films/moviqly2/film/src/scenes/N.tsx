// Scene N — back to the prompt (sN → end): "Describe your first motion. Make it Moviqly."
// The bookend with A: the versions slide back into depth behind the prompt box, which comes forward front-on while
// the landing glow rises back. "Describe": the empty box takes focus, its caret blinking. "your first motion": the
// studio's empty-state label lands under it. "Make it Moviqly": the M mark and the headline land above the box, and
// the glow rises to the landing look. Then a calm hold; only the glow drifts. (No button, no cursor: not film 1.)
import React from "react";
import { Glow, MMark, PromptBox, Say, f, k, promptH, surface } from "../shared";
import { CRAFT, FONT, LIN, SNAP, clamp01, mix } from "../lib";
import { Versions } from "./M";

const BOX = { w: 980, x: 470, y: 474 };
// exits into depth that gather speed (an ease-in power curve), so the versions keep moving until they are gone
const INTO = (t: number) => Math.pow(t, 1.7);
const BOX_H = promptH(BOX.w);

export const SceneN: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sN") || g >= f("end")) return null;
  // the versions recede into depth behind the box, gathering speed, toward where the mark will land, and are gone
  const dim = k(g, "sN", 0.6, CRAFT), back = k(g, "sN", 2.0, INTO);
  const box = k(g, "sN+0.05", 0.9);                                      // the box comes forward, front-on
  const focus = k(g, "w:describe", 0.27, SNAP);
  const pill = k(g, "w:first-0.05", 0.55);
  const mark = k(g, "w:make2-0.2", 0.8, LIN);
  // the landing glow: rises back with the bookend, and to the landing look on "Moviqly"
  const glowA = k(g, "sN", 1.0, CRAFT);
  const glowY = mix(900, 440, k(g, "sN", 2.2, CRAFT)) - 420 * k(g, "w:moviqly3-0.25", 1.6, CRAFT);
  const caretOn = g >= f("w:describe");
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Glow g={g} a={glowA} y={glowY} />

      {back < 1 && <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 300px", transform: `scale(${mix(1, 0.22, back)})`, opacity: mix(1, 0.6, dim) * (1 - clamp01((back - 0.6) / 0.4)), filter: dim > 0 ? `blur(${dim * 3 + back * 6}px)` : undefined }}>
        <Versions g={g} />
      </div>}

      {/* the prompt box, empty, with its caret; the focus ring snaps on on "Describe" */}
      <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX_H, transformOrigin: "50% 50%", transform: `scale(${mix(0.62, 1, box)})`, opacity: clamp01(box * 1.8), filter: box < 1 ? `blur(${(1 - box) * 14}px)` : undefined }}>
        <div style={{ position: "absolute", inset: -1, borderRadius: 28 * (BOX.w / 900), boxShadow: `0 0 0 ${5 * focus}px rgba(136,83,223,0.16), 0 0 0 1.5px rgba(136,83,223,${0.45 * focus})` }} />
        <PromptBox w={BOX.w} text="" placeholder="" g={g} caret={caretOn} style={{ position: "relative" }} />
      </div>

      {/* the studio's empty-state label */}
      {pill > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1920, top: BOX.y + BOX_H + 40, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "11px 26px", borderRadius: 7, border: "1.5px solid #D9D0E3", background: "rgba(255,255,255,0.82)", boxShadow: "0 10px 30px -18px rgba(60,40,110,0.25)",
            fontFamily: FONT, fontWeight: 500, fontSize: 22, letterSpacing: "0.24em", color: "#6E6280", whiteSpace: "nowrap", ...surface(pill) }}>DESCRIBE YOUR FIRST MOTION</div>
        </div>
      )}

      {/* the sign-off: the M mark and "Make it Moviqly" */}
      {mark > 0 && <div style={{ position: "absolute", left: 0, width: 1920, top: 166, display: "flex", justifyContent: "center" }}><MMark size={82} p={mark} /></div>}
      <Say g={g} y={272} size={120} words={[{ t: "Make", at: "w:make2" }, { t: "it", at: "w:it4" }, { t: "Moviqly", at: "w:moviqly3", grad: true }]} />
    </div>
  );
};

