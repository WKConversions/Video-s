// Scene F — the storyboard arrives (sF → h2): "Your storyboard arrives."
// The console, the idea line and the tags recede into depth; the dressed frame is carried down into row 1's
// thumbnail while the StoryboardCard surfaces around it, landing on "arrives"; the other rows cascade in, each
// surfacing; the last frames are Handoff2 itself.
import React from "react";
import { CRAFT, H2, Handoff2, LAND, LEAVE, StoryboardCard, clamp01, f, k, mix } from "../shared";
import { B_LEFT2, B_THUMB, Draft, bh, intoThumb, lerpBox } from "./D";
import { Console, FormChip, IdeaLine } from "./E";

// rows: p 0 → 1 from just before "arrives" to two frames before h2 (row 1 is the carried frame)
const ROWS_FROM = () => f("w:arrives") - 1;
const ROWS_TO = () => f("h2") - 2;
// the card builds around row 1's thumbnail: it scales about the thumbnail's centre (card top 269.1, measured on Handoff2)
const CARD_TOP = 269.1;
const TH = { cx: B_THUMB.x + B_THUMB.w / 2, cy: B_THUMB.y + bh(B_THUMB) / 2 };

export const SceneF: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sF") || g >= f("h2")) return null;
  if (g >= ROWS_TO()) return <Handoff2 />;
  const out = k(g, "sF", 0.55, LEAVE);
  const shell = k(g, "w:storyboard", 0.45, LAND);
  const S = mix(0.84, 1, k(g, "w:storyboard", 1.25, CRAFT));
  const target = { x: TH.cx - (B_THUMB.w * S) / 2, y: TH.cy - (bh(B_THUMB) * S) / 2, w: B_THUMB.w * S };
  const box = lerpBox(B_LEFT2, target, intoThumb(g));
  const p = clamp01((g - ROWS_FROM()) / (ROWS_TO() - ROWS_FROM()));
  // row 1 (j = 0) is fully in once p ≥ 1/7: from then the card's own thumbnail takes over from the carried frame
  const rowOneIn = p * 7 >= 1;
  return (
    <>
      <IdeaLine g={g} out={out} />
      <Console g={g} out={out} />
      {shell > 0 && (
        <div style={{ position: "absolute", left: H2.x, top: 0, height: 1080, display: "flex", alignItems: "center" }}>
          <StoryboardCard p={p} w={H2.w} size={H2.size} style={{ opacity: clamp01(shell * 1.6), transform: `scale(${S})`, transformOrigin: `${TH.cx - H2.x}px ${TH.cy - CARD_TOP}px`,
            filter: shell < 1 ? `blur(${(1 - shell) * 12}px)` : undefined }} />
        </div>
      )}
      {!rowOneIn && <Draft g={g} box={box} />}
      <FormChip g={g} />
    </>
  );
};
