// S3 (5.80–8.55) "Meet Digital Marketing Málaga": the knot unwinds into one straight line that springs into the logo's
// wave; the serif logotype builds around it word by word with the voice, the dot clicks in as the full stop and a ring
// ripples across the contours. The words leave and the mark alone glides to H.mark (WaveMark 400 wide, box centred
// (960, 560)) for S4. Shared stage: b1-core.tsx (S3 draws it from 5.80). Nothing is drawn after 8.55.
import React from "react";
import { C, OUT, SERIF, c01, k } from "../kit";
import { Cam, LOGO, Stage, topoS3 } from "./b1-core";
import { Scene } from "./types";

const WORDS: [string, number][] = [["Digital", 6.6], ["Marketing", 7.08], ["Málaga", 7.52]];
const Logotype: React.FC<{ t: number }> = ({ t }) => (
  <>
    {WORDS.map(([s, at], i) => {
      if (t < at - 0.02) return null;
      // exit bottom-up ('Málaga' 8.15, 'Marketing' 8.20, 'Digital' 8.25): each word is gone before the mark's slide to H.mark reaches it
      const q = k(t, at, 0.42, OUT), u = c01((t - (8.15 + 0.05 * (2 - i))) / 0.18), o = u * u; if (u >= 1) return null;
      // it lands while still softly blurred and sharpens at rest; it leaves blurring at once, then accelerating (lift u²):
      // crisp glyphs creeping by sub-pixels would step (Chrome snaps slow text to whole pixels)
      const bl = 7 * (1 - c01((t - at) / 0.6)) ** 2 + 7 * Math.sqrt(u);
      return <div key={s} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${LOGO.x0}px, ${LOGO.y0 + i * LOGO.lh + (1 - q) * 40 - o * 40}px)`,
        fontFamily: SERIF, fontWeight: 700, fontSize: LOGO.F, lineHeight: 0.98, letterSpacing: "-0.012em", fontVariationSettings: "'opsz' 60", color: C.white, whiteSpace: "nowrap",
        opacity: c01(q * 1.5) * (1 - u), filter: bl > 0.04 ? `blur(${bl.toFixed(2)}px)` : undefined }}>{s}</div>;
    })}
  </>
);

const View: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Stage t={t} id="b1s3" />
    <Cam t={t}><Logotype t={t} /></Cam>
  </>
);

export const S3: Scene = { id: "S3", t0: 5.8, t1: 8.55, C: View, topo: topoS3 };
