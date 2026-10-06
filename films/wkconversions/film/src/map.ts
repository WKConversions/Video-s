// The attention market: a city of businesses (blocks) on the site's dot-grid paper, its streets full of people (the
// audience) walking. Your business (right) and the competitor (left) face each other across the middle. World units.
import { hash } from "./iso";

export const CELL = 250, GAP = 100, W = CELL - GAP;
export const I0 = -6, I1 = 6, J0 = -6, J1 = 6;
export type Biz = { id: string; i: number; j: number; x0: number; y0: number; x1: number; y1: number; h: number; role: "you" | "comp" | "biz" };
const isYou = (i: number, j: number) => i === 1 && j === -1;
const isComp = (i: number, j: number) => i === -1 && j === 1;
export const BIZ: Biz[] = [];
for (let i = I0; i <= I1; i++)
  for (let j = J0; j <= J1; j++) {
    const special = isYou(i, j) || isComp(i, j);
    if (!special && (hash(i, j, 9) < 0.2 || (i === 0 && j === 0))) continue;   // a few empty lots; the square between the two
    const w = W * (0.58 + 0.36 * hash(i, j, 1)), d = W * (0.58 + 0.36 * hash(i, j, 2));
    const x0 = i * CELL + (W - w) * hash(i, j, 3), y0 = j * CELL + (W - d) * hash(i, j, 4);
    const role = isYou(i, j) ? "you" : isComp(i, j) ? "comp" : "biz";
    BIZ.push({ id: `${i},${j}`, i, j, x0: special ? i * CELL : x0, y0: special ? j * CELL : y0, x1: special ? i * CELL + W : x0 + w, y1: special ? j * CELL + W : y0 + d,
      h: role === "you" ? 72 : role === "comp" ? 108 : 24 + 50 * hash(i, j, 6) ** 1.3, role });
  }
export const YOU = BIZ.find((b) => b.role === "you")!;
export const COMP = BIZ.find((b) => b.role === "comp")!;
export const centre = (b: { x0: number; y0: number; x1: number; y1: number }): [number, number] => [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2];
/** The four streets round a full lot: x of its west and east streets, y of its north and south streets. */
export const ring = (b: Biz) => ({ xa: b.i * CELL - GAP / 2, xb: (b.i + 1) * CELL - GAP / 2, ya: b.j * CELL - GAP / 2, yb: (b.j + 1) * CELL - GAP / 2 });

// People: each walks one street (a horizontal or vertical line between the blocks), in a lane, at their own pace.
export type Person = { k: number; axis: 0 | 1; line: number; lane: number; u0: number; v: number; dir: 1 | -1 };
export const PEOPLE: Person[] = [];
export const N_PEOPLE = 820;
const span = (I1 - I0 + 2) * CELL;
for (let k = 0; k < N_PEOPLE; k++) {
  const axis = (hash(k, 1, 31) < 0.5 ? 0 : 1) as 0 | 1;
  const line = Math.floor(I0 + hash(k, 2, 31) * (I1 - I0 + 2));
  PEOPLE.push({ k, axis, line: line * CELL - GAP / 2, lane: (hash(k, 3, 31) - 0.5) * 44, u0: hash(k, 4, 31) * span, v: 58 + 40 * hash(k, 5, 31), dir: hash(k, 6, 31) < 0.5 ? 1 : -1 });
}
export const SPAN = span;
export const X_MIN = I0 * CELL - GAP;
/** Where a person is when nothing else calls them: walking their street, wrapping round the city. */
export const walk = (p: Person, t: number): [number, number] => {
  const u = (((p.u0 + p.dir * p.v * t) % span) + span) % span + X_MIN;
  return p.axis === 0 ? [u, p.line + p.lane] : [p.line + p.lane, u];
};
