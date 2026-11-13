/* B4: PLACEHOLDER (the storyboard key frames as an animatic) until the beat is built. */
import * as K from '../engine/kit.js';
import { SPANS } from '../timeline.js';
const IDS = K.FRAME_META.filter((m) => m.id.startsWith('B04-'));
export const HAND = [];
export function draw(T) {
  const [t0, t1] = SPANS.B4, u = (T - t0) / (t1 - t0);
  const m = IDS[Math.min(IDS.length - 1, Math.floor(u * IDS.length))];
  return K.FRAMES[m.id]();   // a full <svg> document
}
