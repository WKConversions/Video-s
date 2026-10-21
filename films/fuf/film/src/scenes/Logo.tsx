import React from "react";
import { T, Para, k, s, MOVE, OUT, SOFT, clamp01, lerp, Img, staticFile, INK, CREAM, TAUPE } from "./brand";
import { crowdAt, crowdLook, youAt } from "./Open";
import PTS from "../data/logo-points.json";

// ---- B. "Meet Future Unicorn Founders."
// The crowd from the opening converges: on "Meet" every dot travels (MOVE) to its own point on the strokes of the
// unicorn mark and turns from grey to cream; they land in order from the mane up to the horn, and the real mark
// resolves over them along the same diagonal as the points fade. You (the taupe dot) land as the eye. The wordmark
// builds to the right on its words, with a thin taupe rule between.
// logo-points.json: 232 points sampled evenly along the skeleton of unicorn-cream.png's alpha (Zhang-Suen thinning,
// farthest-point sampling), in frame px for the mark box below; w is the stroke's half-width there.
// logo-unicorn-hi.png: the same alpha upscaled and re-edged, at 2x its display size here.

const MARK = { x: 500, y: 330, h: 420 };                       // the mark's bbox (source bbox 80,60 → 319,354)
const S = MARK.h / 294;
const HI = { x: MARK.x - 3 * S, y: MARK.y - 3 * S, w: 245 * S, h: 300 * S };   // logo-unicorn-hi.png covers source 77,57 +245×300
const EYE = { x: MARK.x + (232.5 - 80) * S, y: MARK.y + (176.5 - 60) * S };
/** Position along the reveal's diagonal ("to top right" across the image box): 0 bottom-left, 1 top-right. */
const diag = (x: number, y: number) => ((x - HI.x) * HI.h - (y - HI.y) * HI.w + HI.h * HI.w) / (2 * HI.h * HI.w);

const P = PTS as { x: number; y: number; w: number }[];
const FM = T.f("meet");

/** Min-cost perfect matching (Hungarian, O(n³)); Euclidean cost, so the paths never cross. */
const hungarian = (cost: number[][]) => {
  const n = cost.length, INF = 1e18;
  const u = new Float64Array(n + 1), v = new Float64Array(n + 1), p = new Int32Array(n + 1), way = new Int32Array(n + 1);
  for (let i = 1; i <= n; i++) {
    p[0] = i; let j0 = 0;
    const minv = new Float64Array(n + 1).fill(INF), used = new Uint8Array(n + 1);
    do {
      used[j0] = 1; const i0 = p[j0]; let delta = INF, j1 = 0;
      for (let j = 1; j <= n; j++) if (!used[j]) {
        const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= n; j++) if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta;
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  const ans = new Array<number>(n);
  for (let j = 1; j <= n; j++) ans[p[j] - 1] = j - 1;
  return ans;
};

const LAND0 = 8.3, LANDS = 0.62;                                // first landing, spread of the landings
const FLY = (() => {
  const from = crowdAt(FM).slice(0, P.length);
  const to = hungarian(from.map((a) => P.map((b) => Math.hypot(a.x - b.x, a.y - b.y))));
  return from.map((a, i) => {
    const b = P[to[i]], o = diag(b.x, b.y), dist = Math.hypot(a.x - b.x, a.y - b.y);
    const land = LAND0 + LANDS * o;
    const st = Math.max(s("meet") + 0.02, land - Math.min(1.25, 0.72 + dist / 1700));
    return { to: b, o, st, dur: land - st, r: Math.max(1.25, Math.min(2.3, b.w * 0.72)) };
  });
})();
const YOU = (() => { const o = diag(EYE.x, EYE.y), land = LAND0 + LANDS * o; return { o, st: s("meet") + 0.02, dur: land - s("meet") - 0.02 }; })();

// the mark resolves along the same diagonal, a beat behind the landings
const REV0 = 8.62, REVD = 0.78, BAND = 22;                     // start, duration, soft edge (% of the diagonal)
const revAt = (t: number) => SOFT(clamp01((t - REV0) / REVD)) * (100 + BAND);
const covered = (a: number, o: number) => clamp01((a - BAND * 0.35 - o * 100) / (BAND * 0.65));

const WX = 958, WY = 388, WS = 100;                            // the wordmark
const RX = 900;                                                // the rule

export const Logo: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("meet-0.2") || g > T.f("an+0.6")) return null;
  const t = g / 30;
  const bg = clamp01((g - T.f("meet-0.2")) / 6);              // opaque by "meet": until then the dots match the crowd's
  const out = 1 - k(g, "an-0.15", 0.45, OUT);
  const a = revAt(t);
  const look = crowdLook(Math.min(g, FM + 6));
  const now = crowdAt(g);
  const you = youAt(g);
  const yu = MOVE(clamp01((t - YOU.st) / YOU.dur));
  const yx = lerp(you.x, EYE.x, yu), yy = lerp(you.y, EYE.y, yu), yo = 1 - covered(a, YOU.o);
  const rule = k(g, "future-0.1", 0.75, MOVE);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: INK, opacity: bg }} />
      <div style={{ position: "absolute", inset: 0, opacity: out }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {FLY.map((f, i) => {
            const u = MOVE(clamp01((t - f.st) / f.dur));
            const q = look[i], p = now[i];
            const x = lerp(p.x, f.to.x, u), y = lerp(p.y, f.to.y, u);
            const fo = 1 - covered(a, f.o);
            if (fo <= 0 || x < -20 || x > 1940 || y < -20 || y > 1100) return null;
            return <circle key={i} cx={x} cy={y} r={lerp(q.r, f.r, u)} fill={`rgb(${q.c.map((c, j) => Math.round(lerp(c, [247, 244, 239][j], u))).join(",")})`} opacity={lerp(q.o, 1, u) * fo} />;
          })}
          {yo > 0 && <circle cx={yx} cy={yy} r={lerp(5.2, 4.2, yu)} fill={TAUPE} opacity={yo} />}
        </svg>
        {a > 0 && (
          <Img src={staticFile("img/logo-unicorn-hi.png")} style={{ position: "absolute", left: HI.x, top: HI.y, width: HI.w, height: HI.h,
            WebkitMaskImage: `linear-gradient(to top right, #000 ${a - BAND}%, transparent ${a}%)`, maskImage: `linear-gradient(to top right, #000 ${a - BAND}%, transparent ${a}%)` }} />
        )}
        <div style={{ position: "absolute", left: RX, top: 392, width: 1.5, height: lerp(0, 296, rule), background: TAUPE, opacity: 0.85 }} />
        <Para g={g} lines={[["future", "Future"], ["unicorn", "*Unicorn*"], ["founders", "Founders"]]} x={WX} y={WY} size={WS} color={CREAM} accent={TAUPE} lh={1.04} />
      </div>
    </div>
  );
};
