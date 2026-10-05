// The bright world: the viewer's business at the centre (one block), its three work districts in the site's three service
// tints (sales = blue, marketing = sage, everyday work = sand), and the market around it (white blocks: companies).
// Geometry only; what each block does over time lives in the beats.
import { hash } from "./iso";
import type { Tint } from "./draw";

export const CELL = 220;            // lot pitch, world units
export const GAP = 84;              // street width
export const I0 = -8, I1 = 10, J0 = -8, J1 = 10;
export type Role = "you" | "sales" | "marketing" | "work" | "market";
export type Block = { id: string; i: number; j: number; x0: number; y0: number; x1: number; y1: number; h: number; role: Role; tint: Tint; fit: number; name?: string };

const lot = (i: number, j: number) => {
  const W = CELL - GAP;
  const w = W * (hash(i, j, 7) < 0.25 ? 1 : 0.64 + 0.36 * hash(i, j, 1)), d = W * (hash(i, j, 7) > 0.8 ? 1 : 0.64 + 0.36 * hash(i, j, 2));
  const x0 = i * CELL + (W - w) * hash(i, j, 3), y0 = j * CELL + (W - d) * hash(i, j, 4);
  return { x0, y0, x1: x0 + w, y1: y0 + d };
};
const DIST: Record<string, Role> = {};
const put = (role: Role, cells: [number, number][]) => cells.forEach(([i, j]) => (DIST[`${i},${j}`] = role));
put("sales", [[2, -1], [3, -1], [2, -2], [3, -2], [3, 0]]);
put("marketing", [[-1, 2], [-1, 3], [-2, 2], [-2, 3], [0, 3]]);
put("work", [[-2, -1], [-2, -2], [-1, -2], [-3, -1], [-1, -3]]);

export const BLOCKS: Block[] = [];
for (let i = I0; i <= I1; i++)
  for (let j = J0; j <= J1; j++) {
    const id = `${i},${j}`;
    const role: Role = i === 0 && j === 0 ? "you" : DIST[id] ?? "market";
    if (role === "market" && hash(i, j, 9) < 0.1) continue;
    if (role === "market" && Math.abs(i) <= 1 && Math.abs(j) <= 1) continue;           // a plaza around the viewer's block
    const g = role === "you" ? { x0: 0, y0: 0, x1: CELL - GAP, y1: CELL - GAP } : lot(i, j);
    const tint: Tint = role === "sales" ? "blue" : role === "marketing" ? "sage" : role === "work" ? "sand" : role === "you" ? "ink" : "grey";
    const h = role === "you" ? 96 : role === "market" ? 14 + 44 * hash(i, j, 6) ** 1.5 : 34 + 40 * hash(i, j, 6);
    BLOCKS.push({ id, i, j, ...g, h, role, tint, fit: hash(i, j, 5) });
  }
export const YOU = BLOCKS.find((b) => b.role === "you")!;
export const centre = (b: Block): [number, number] => [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2];
export const dist = (b: Block, o: Block = YOU) => Math.hypot(centre(b)[0] - centre(o)[0], centre(b)[1] - centre(o)[1]);
export const byId = (id: string) => BLOCKS.find((b) => b.id === id)!;
