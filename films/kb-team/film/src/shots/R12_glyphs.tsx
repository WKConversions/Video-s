// The nine bold glyphs of the closing row (shapes measured on the reference's row, drawn for K.B in the ink colour).
import React from "react";

// 0 grid, 1 sprout, 2 globe, 3 gear, 4 brackets, 5 knot, 6 star, 7 person, 8 notched block
export const G12: React.FC<{ k: number; s: number; c: string; bg: string }> = ({ k, s, c, bg }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: "block" }}>
    {k === 0 && <g fill={c}>{[0, 1, 2, 3, 4].flatMap((i) => [0, 1, 2, 3, 4].map((j) => ((i + j) % 2 === 0 ? <rect key={`${i}${j}`} x={4 + i * 19} y={4 + j * 19} width="19" height="19" /> : null)))}
      {[[1, 1], [3, 1], [1, 3], [3, 3], [2, 2]].map(([i, j]) => <rect key={`h${i}${j}`} x={4 + i * 19 + 6} y={4 + j * 19 + 6} width="7" height="7" fill={bg} />)}</g>}
    {k === 1 && <g fill={c}><path d="M8 34 Q38 34 42 54 L42 14 Q50 4 58 14 L58 54 Q62 34 92 34 L92 46 Q72 52 68 64 L32 64 Q28 52 8 46 Z" /><rect x="8" y="72" width="84" height="22" rx="4" /></g>}
    {k === 2 && <g><circle cx="50" cy="50" r="46" fill={c} /><ellipse cx="50" cy="52" rx="10" ry="30" fill={bg} /><ellipse cx="22" cy="52" rx="7" ry="20" fill={bg} /><ellipse cx="78" cy="52" rx="7" ry="20" fill={bg} /><rect x="14" y="14" width="72" height="3" fill={bg} opacity="0.5" transform="rotate(0 50 50)" /></g>}
    {k === 3 && <g fill={c}>{[0, 45, 90, 135].map((a) => <rect key={a} x="38" y="3" width="24" height="94" rx="3" transform={`rotate(${a} 50 50)`} />)}<circle cx="50" cy="50" r="34" /><rect x="38" y="38" width="24" height="24" fill={bg} /></g>}
    {k === 4 && <g fill={c}><path d="M6 4 H44 V20 H24 V80 H44 V96 H6 Z" /><path d="M94 4 H56 V20 H76 V80 H56 V96 H94 Z" /></g>}
    {k === 5 && <g fill={c}><circle cx="50" cy="26" r="22" /><circle cx="50" cy="74" r="22" /><circle cx="26" cy="50" r="22" /><circle cx="74" cy="50" r="22" /><rect x="34" y="34" width="32" height="32" /><circle cx="50" cy="12" r="4.5" fill={bg} /><circle cx="50" cy="88" r="4.5" fill={bg} /><circle cx="12" cy="50" r="4.5" fill={bg} /><circle cx="88" cy="50" r="4.5" fill={bg} /><rect x="44" y="44" width="12" height="12" fill={bg} /></g>}
    {k === 6 && <g><path fill={c} d="M50 2 C54 32 68 46 98 50 C68 54 54 68 50 98 C46 68 32 54 2 50 C32 46 46 32 50 2Z" /><rect x="44" y="44" width="12" height="12" fill={bg} transform="rotate(45 50 50)" /></g>}
    {k === 7 && <g fill={c}><rect x="36" y="4" width="28" height="26" rx="2" /><path d="M4 34 H96 V54 H74 V96 H58 V70 H42 V96 H26 V54 H4 Z" /></g>}
    {k === 8 && <g fill={c}><path d="M14 4 H38 V14 H62 V4 H86 V26 H96 V40 H86 V60 H96 V74 H86 V96 H62 V86 H38 V96 H14 V74 H4 V60 H14 V40 H4 V26 H14 Z" /><rect x="34" y="34" width="32" height="32" fill={bg} /></g>}
  </svg>
);
