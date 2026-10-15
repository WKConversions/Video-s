// The site's hero sculpture (assets/hero-intelligence.svg) split into its parts, so it can assemble on screen: the ground
// shadow, the dark glass base, the silver middle slab, the dashed guides, the chrome orb (the AI at its core) and the top
// slab. Each part takes its own lift (px in the 800-unit drawing) and opacity. Same paths and gradients as the site.
import React from "react";
import { MetalDefs } from "./kit";

export type HeroParts = { ground?: number; base?: [number, number]; mid?: [number, number]; guides?: number; orb?: [number, number, number]; top?: [number, number]; bg?: number };

const SLAB_EDGE = "M-243-5V19Q-243 28-230 35L-20 156Q0 168 20 156L230 35Q243 28 243 19V-5Z";
const SLAB_TOP = "M-230-20-20-141Q0-153 20-141L230-20Q257-5 230 11L20 132Q0 144-20 132L-230 11Q-257-5-230-20Z";
const SLAB_LINES = "M-230-17-20-138Q0-150 20-138L230-17M-230 11-20 132Q0 144 20 132L230 11";

const Silver: React.FC<{ id: string }> = ({ id }) => (
  <>
    <path d={SLAB_EDGE} fill={`url(#${id}-bevel)`} />
    <path d={SLAB_TOP} fill={`url(#${id}-metal)`} />
    <path d={SLAB_LINES} fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="2" />
    <path d="M-221 27-17 145Q0 155 17 145L221 27" fill="none" stroke="#303030" strokeOpacity=".3" />
  </>
);

/** size: px of the 800×800 drawing. Each part: [lift px (drawing units, + = up), opacity]; orb: [lift, opacity, scale]. */
export const Intelligence: React.FC<{ id: string; size: number; p: HeroParts; style?: React.CSSProperties }> = ({ id, size, p, style }) => {
  const [bY, bO] = p.base ?? [0, 1], [mY, mO] = p.mid ?? [0, 1], [tY, tO] = p.top ?? [0, 1], [oY, oO, oS] = p.orb ?? [0, 1, 1];
  return (
    <svg viewBox="0 0 800 800" width={size} height={size} style={{ display: "block", overflow: "visible", ...style }}>
      <MetalDefs id={id} />
      <defs>
        <filter id={`${id}-core`} x="-80%" y="-60%" width="260%" height="250%"><feDropShadow dx="0" dy="27" stdDeviation="15" floodColor="#1F1F1F" floodOpacity=".22" /></filter>
      </defs>
      {(p.bg ?? 0) > 0 && <path fill={`url(#${id}-bg)`} d="M0 0h800v800H0z" opacity={p.bg} />}
      <ellipse cx="405" cy="718" rx="237" ry="37" fill="#3B3B3B" opacity={0.23 * (p.ground ?? 1)} filter={`url(#${id}-ground)`} />
      <g opacity={bO} transform={`translate(400 ${556 - bY}) scale(.97)`} filter={`url(#${id}-shadow)`}>
        <path d={SLAB_EDGE} fill={`url(#${id}-darkedge)`} />
        <path d={SLAB_TOP} fill={`url(#${id}-glass)`} />
        <path d={SLAB_LINES} fill="none" stroke="#E5E5E5" strokeOpacity=".44" strokeWidth="1.8" />
        <path d="M-191-12-13-115Q0-122 13-115L191-12Q207-3 191 6L13 109Q0 116-13 109L-191 6Q-207-3-191-12Z" fill="none" stroke="#ACACAC" strokeOpacity=".27" />
      </g>
      <g opacity={mO} transform={`translate(400 ${442 - mY}) scale(.97)`} filter={`url(#${id}-shadow)`}>
        <Silver id={id} />
        <path d="m-157-5 150-87q7-4 14 0L157-5q9 5 0 10L7 92q-7 4-14 0L-157 5q-9-5 0-10Z" fill="#A7A7A7" fillOpacity=".24" stroke="#F9F9F9" strokeOpacity=".65" />
        <ellipse cy="-1" rx="69" ry="39" fill="#3F3F3F" opacity=".14" />
        <ellipse cy="-1" rx="47" ry="27" fill="#232323" opacity=".1" />
        <path d="m-191 0 4-2m187-108 4 2m187 108-4 2m-187 108-4-2" stroke="#707070" strokeOpacity=".45" strokeWidth="2" />
      </g>
      <g fill="none" stroke="#A3A3A3" strokeOpacity={0.38 * (p.guides ?? 1)} strokeDasharray="2 7">
        <path d="M218 257v155M582 257v155M400 143v160" />
      </g>
      <g opacity={oO} filter={`url(#${id}-core)`} transform={`translate(400 ${342 - oY}) scale(${oS}) translate(-400 -342)`}>
        <circle cx="400" cy="342" r="61" fill={`url(#${id}-orb)`} />
        <ellipse cx="382" cy="315" rx="21" ry="11" fill={`url(#${id}-light)`} transform="rotate(-34 382 315)" />
        <path d="M344 363c27 15 73 19 112-3" fill="none" stroke="#F8F8F8" strokeOpacity=".45" strokeWidth="1.5" />
      </g>
      <g opacity={tO} transform={`translate(400 ${198 - tY}) scale(.97)`} filter={`url(#${id}-shadow)`}>
        <Silver id={id} />
        <path d="M-201-17-15-124Q0-133 15-124L201-17Q224-4 201 9L15 116Q0 125-15 116L-201 9Q-224-4-201-17Z" fill={`url(#${id}-glass)`} />
        <path d="M-201-14-15-121Q0-130 15-121L201-14M-201 9-15 116Q0 125 15 116L201 9" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1.3" />
        <g fill="none" stroke="#C6C6C6" strokeOpacity=".25">
          <path d="m-113-7 101-58q12-7 24 0L113-7q12 7 0 14L12 65q-12 7-24 0L-113 7q-12-7 0-14Z" />
          <path d="m-88-7 76-44q12-7 24 0L88-7q12 7 0 14L12 51q-12 7-24 0L-88 7q-12-7 0-14Z" />
        </g>
        <path d="m-39-4 32-18q7-4 14 0L39-4q7 4 0 8L7 22q-7 4-14 0L-39 4q-7-4 0-8Z" fill={`url(#${id}-metal)`} />
        <path d="M-153-39-57-94M57 94l96-55" fill="none" stroke="#DDDDDD" strokeOpacity=".25" strokeWidth="1" />
      </g>
    </svg>
  );
};
