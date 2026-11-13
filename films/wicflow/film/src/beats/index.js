/* The beats in order. Each beat module exports draw(T) -> SVG markup for film second T (the inner content of the
   1920x1080 frame; or a full <svg> document) and HAND -> the 3D hand cursor's keys in that beat
   ([{ at: film s, x, y, click: true }], x/y = screen px of the target, see plan/build-brief.md). */
import * as B1 from './B1.js'; import * as B2 from './B2.js'; import * as B3 from './B3.js';
import * as B4 from './B4.js'; import * as B5 from './B5.js'; import * as B6 from './B6.js';
import * as B7 from './B7.js'; import * as B8 from './B8.js'; import * as B9 from './B9.js';
export const BEATS = { B1, B2, B3, B4, B5, B6, B7, B8, B9 };
