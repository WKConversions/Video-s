/* frameSvg(T): the whole picture (minus the 3D hand, which Remotion draws on top) at film second T, as one
   1920x1080 SVG document. Used by Remotion (src/Film.tsx) and by the fast previewer (tools/frames.mjs). */
import * as K from './engine/kit.js';
import { BEATS } from './beats/index.js';
import { SPANS, DUR } from './timeline.js';
export { K };
export const beatAt = (T) => {
  const ids = Object.keys(SPANS);
  for (const id of ids) if (T < SPANS[id][1]) return id;
  return ids[ids.length - 1];
};
export const handKeys = () => Object.values(BEATS).flatMap((b) => b.HAND || []);
export function frameSvg(T, opts = {}) {
  T = Math.max(0, Math.min(DUR - 1e-6, T));
  K.resetUid();
  let s = BEATS[beatAt(T)].draw(T);
  if (!s.trimStart().startsWith('<svg')) s = K.svgDoc(s);
  if (opts.debugHand) {   // previewer only: where the hand's targets are (a ring from 0.5 s before a key to 0.35 s after)
    const marks = handKeys().filter((k) => T > k.at - 0.5 && T < k.at + 0.35).map((k) => {
      const p = Math.max(0, Math.min(1, (T - (k.at - 0.5)) / 0.5));
      return `<circle cx="${k.x}" cy="${k.y}" r="${18 - 8 * p}" fill="none" stroke="#ff3bd4" stroke-width="3"/><path d="M${k.x - 26},${k.y} h52 M${k.x},${k.y - 26} v52" stroke="#ff3bd4" stroke-width="2"/>` +
        (k.click && T >= k.at ? `<circle cx="${k.x}" cy="${k.y}" r="10" fill="#ff3bd4"/>` : '');
    }).join('');
    s = s.replace(/<\/svg>\s*$/, marks + '</svg>');
  }
  return s;
}
