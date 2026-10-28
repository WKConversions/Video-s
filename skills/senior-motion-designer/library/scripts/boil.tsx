// Boil: the hand-drawn life of a held pose (measured round M19 on DemoDuck's Prisidio: in a "hold", the whole
// drawing is redrawn every 3 frames with outlines shifting ~1 px, while the face keeps acting). Flat vectors in
// Remotion are frozen in holds; wrap a character or icon in <Boil> to give it that life.
//   <Boil every={3} px={1.2}>{character}</Boil>   every: frames per redraw (2–4), px: displacement (0.8–2)
// An SVG turbulence displacement whose seed steps every `every` frames: the shape stays put, its edges wobble.
import React from "react";
import { useCurrentFrame } from "remotion";

let uid = 0;
export const Boil: React.FC<{ every?: number; px?: number; children: React.ReactNode; style?: React.CSSProperties }> =
  ({ every = 3, px = 1.2, children, style }) => {
    const g = useCurrentFrame();
    const id = React.useMemo(() => `boil${uid++}`, []);
    const seed = Math.floor(g / every) % 7;      // a short cycle of drawings, like a boil loop
    return (
      <div style={{ filter: `url(#${id})`, ...style }}>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={seed + 1} />
            <feDisplacementMap in="SourceGraphic" scale={px * 2} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        {children}
      </div>
    );
  };
