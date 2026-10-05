// The map: the viewer's business at the centre, the loop of track plates around it, and the five things it connects —
// the market (back), the CRM cabinet (back right), the tool plot (right), the team and its desk (front left). World units;
// the view is fixed (45°, scale 1, the business at screen 1000,600), so the frame never zooms: the content moves.
import { hash } from "./iso";
import type { View } from "./iso";

export const VIEW = (g: number): View => ({ th: ((44.2 + 1.6 * (g / 1125)) * Math.PI) / 180, s: 1.08, fx: 0, fy: 0, cx: 1010, cy: 610 });

export type Rect = { x0: number; y0: number; x1: number; y1: number };
export const BIZ: Rect & { h: number } = { x0: -100, y0: -100, x1: 100, y1: 100, h: 104 };

// The market: a loose grid of companies behind the loop. Anna's building firm is the one nearest the loop's back corner.
export type Co = Rect & { id: string; h: number; fit: number; n: number };
export const MARKET: Co[] = [];
{
  let n = 0;
  for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++) {
      const id = `m${a}${b}`;
      
      const cx = -560 + a * 104 + (hash(a, b, 1) - 0.5) * 12, cy = -560 + b * 104 + (hash(a, b, 2) - 0.5) * 12;
      const w = 62 + 14 * hash(a, b, 3), d = 62 + 14 * hash(a, b, 4);
      MARKET.push({ id, x0: cx - w / 2, y0: cy - d / 2, x1: cx + w / 2, y1: cy + d / 2, h: 20 + 34 * hash(a, b, 6) ** 1.3, fit: hash(a, b, 7), n: n++ });
    }
}
export const ANNA = MARKET.find((m) => m.id === "m22")!;
ANNA.fit = 1; ANNA.h = 36;

// The CRM cabinet (back right) and its three drawers.
export const CRM: Rect & { h: number } = { x0: -20, y0: -560, x1: 100, y1: -470, h: 180 };
// The tool plot (right): 15 tiles, 5 × 3, in the site's grid order.
export const TOOL_IDS = ["chatgpt", "claude", "gemini", "copilot", "google", "microsoft", "gmail", "outlook", "sheets", "teams", "slack", "hubspot", "pipedrive", "salesforce", "n8n"];
export const TILE = 112;
export const TOOL_TILES = TOOL_IDS.map((id, k) => {
  const row = k % 5, col = Math.floor(k / 5);                     // the site's rows of five run along the y axis here
  const x = 290 + col * TILE, y = -420 + row * TILE;
  return { id, row: col, col: row, x0: x, y0: y, x1: x + 80, y1: y + 80 };
});
// The team (three people) and the desk with the paper stack (front left).
export const TEAM: [number, number][] = [[-480, 40], [-385, 70], [-440, 165]];
export const DESK: Rect & { h: number } = { x0: -330, y0: 250, x1: -240, y1: 320, h: 30 };

// The loop of track plates (a rounded rectangle round the business) and its spurs to each object.
export const LOOP = { x0: -300, y0: -340, x1: 190, y1: 200, r: 90 };
export const loopPoint = (u: number): [number, number] => {
  // perimeter of a rounded rectangle, starting at the middle of the front-right edge (in front of the business), clockwise
  const { x0, y0, x1, y1, r } = LOOP;
  const W = x1 - x0 - 2 * r, H = y1 - y0 - 2 * r, arc = (Math.PI / 2) * r, P = 2 * W + 2 * H + 4 * arc;
  let d = ((u % 1) + 1) % 1 * P;
  const segs: [number, (t: number) => [number, number]][] = [
    [H / 2, (t) => [x1, y0 + r + H / 2 + t]],                                                            // down the x1 edge to the front corner
    [arc, (t) => { const a = (t / r); return [x1 - r + r * Math.cos(a), y1 - r + r * Math.sin(a)]; }],
    [W, (t) => [x1 - r - t, y1]],
    [arc, (t) => { const a = Math.PI / 2 + t / r; return [x0 + r + r * Math.cos(a), y1 - r + r * Math.sin(a)]; }],
    [H, (t) => [x0, y1 - r - t]],
    [arc, (t) => { const a = Math.PI + t / r; return [x0 + r + r * Math.cos(a), y0 + r + r * Math.sin(a)]; }],
    [W, (t) => [x0 + r + t, y0]],
    [arc, (t) => { const a = 1.5 * Math.PI + t / r; return [x1 - r + r * Math.cos(a), y0 + r + r * Math.sin(a)]; }],
    [H / 2, (t) => [x1, y0 + r + t]],
  ];
  for (const [len, f] of segs) { if (d <= len) return f(d); d -= len; }
  return [x1, y0 + r + H / 2];
};
export const PLATES = 16;
// spurs from the loop to each object (dashed until 'connects')
export const SPURS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: "market", from: [LOOP.x0 + 60, LOOP.y0], to: [ANNA.x1, (ANNA.y0 + ANNA.y1) / 2] },
  { id: "crm", from: [40, LOOP.y0], to: [40, CRM.y1] },
  { id: "tools", from: [LOOP.x1, -150], to: [290, -150] },
  { id: "team", from: [LOOP.x0, 100], to: [-380, 100] },
  { id: "biz", from: [LOOP.x1, 0], to: [BIZ.x1, 0] },
];

// Routes on the ground (world points), measured so a dot can travel them at any u.
export type Route = { pts: [number, number][]; len: number[]; total: number };
export const route = (p: [number, number][]): Route => {
  const len = [0];
  for (let k = 1; k < p.length; k++) len.push(len[k - 1] + Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]));
  return { pts: p, len, total: len[len.length - 1] };
};
export const along = (r: Route, u: number): [number, number] => {
  const d = Math.min(1, Math.max(0, u)) * r.total;
  let k = 1;
  while (k < r.len.length - 1 && r.len[k] < d) k++;
  const t = (d - r.len[k - 1]) / Math.max(1e-6, r.len[k] - r.len[k - 1]);
  return [r.pts[k - 1][0] + (r.pts[k][0] - r.pts[k - 1][0]) * t, r.pts[k - 1][1] + (r.pts[k][1] - r.pts[k - 1][1]) * t];
};
export const part = (r: Route, u0: number, u1: number): [number, number][] => {
  const a = Math.max(0, u0) * r.total, b = Math.min(1, u1) * r.total;
  if (b <= a) return [];
  const out: [number, number][] = [along(r, u0)];
  for (let k = 0; k < r.pts.length; k++) if (r.len[k] > a && r.len[k] < b) out.push(r.pts[k]);
  out.push(along(r, u1));
  return out;
};
const ac: [number, number] = [(ANNA.x0 + ANNA.x1) / 2, (ANNA.y0 + ANNA.y1) / 2];
export const ANNA_C = ac;
// the outreach: out of the business's back edge, across the loop, along the street to Anna's door
export const TO_ANNA = route([[0, -100], [0, -390], [ANNA.x1 + 18, -390], [ANNA.x1 + 18, ac[1]], [ANNA.x1, ac[1]]]);
// the reply into the CRM: from Anna's door along the street to the cabinet's front
export const ANNA_TO_CRM = route([[ANNA.x1, ac[1]], [ANNA.x1 + 18, ac[1]], [ANNA.x1 + 18, -420], [40, -420], [40, CRM.y1]]);
// the business moving forward in the hook: from its first spot (front left) to home
export const BIZ_START: [number, number] = [-60, 300];

// The pilot, scaled: eight more companies across the map (screen-placed: left, front, back, right), stamped with the
// pilot's plot on "scale". The first six reply (P19) and book (P20).
const sp = (X: number, Y: number): [number, number] => {
  const a = (X - 1010) / (1.08 * Math.SQRT1_2), b = (Y - 610) / (1.08 * 0.56 * Math.SQRT1_2);
  return [(a + b) / 2, (b - a) / 2];
};
export const FAR: Co[] = [[470, 430], [400, 650], [720, 800], [1090, 955], [1320, 95], [1690, 215], [1810, 400], [300, 470]].map(([X, Y], i) => {
  const [cx, cy] = sp(X, Y);
  const w = 64 + 12 * hash(i, 3, 3), d = 64 + 12 * hash(i, 3, 4);
  return { id: `f${i}`, x0: cx - w / 2, y0: cy - d / 2, x1: cx + w / 2, y1: cy + d / 2, h: 24 + 26 * hash(i, 3, 6), fit: 1, n: 100 + i };
});
