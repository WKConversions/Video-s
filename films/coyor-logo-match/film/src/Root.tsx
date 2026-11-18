import React from 'react';
import {Composition, useCurrentFrame, useVideoConfig, staticFile, Img} from 'remotion';
import cy from './cy.json';
import logos from './logos.json';

const L = logos as {file: string; cx: number; cy: number; w: number}[];
const idxOf = (n: string, k = 0) => L.map((l, i) => [l, i] as const).filter(([l]) => l.file.startsWith(n)).map(([, i]) => i)[k];

// deterministic order: interleave so neighbours differ in file and colour family
const base = L.map((_, i) => i);
const fam = (i: number) => L[i].file.split('-').slice(0, -1).join('-');
const order: number[] = [];
{
  const pool = [...base];
  // simple LCG shuffle
  let s = 7;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const seq: number[] = [];
  const total = 4 + 10 + 25;
  while (seq.length < total) {
    const cand = pool.filter((p) => !seq.slice(-8).includes(p) && (seq.length === 0 || fam(p) !== fam(seq[seq.length - 1])));
    const p = cand.length ? cand[Math.floor(rnd() * cand.length)] : pool.find((q) => !seq.slice(-2).includes(q))!;
    seq.push(p);
  }
  order.push(...seq);
}
const LAST = idxOf('chenille-varsity-set-white-1');
order[order.length - 1] = LAST;
if (order[order.length - 2] === LAST) order[order.length - 2] = idxOf('pastel-peach-0');

// holds: 4x3 frames, 10x2 frames, then 1 frame; frame 0 = white flash; logo from LOGO_AT
export const LOGO_AT = 58;
const holds: number[] = [...Array(4).fill(3), ...Array(10).fill(2)];
const frameShot: number[] = [];
{
  let f = 1, k = 0;
  while (f < LOGO_AT) {
    const h = k < holds.length ? holds[k] : 1;
    for (let i = 0; i < h && f < LOGO_AT; i++, f++) frameShot[f] = order[k];
    k++;
  }
}

const Match: React.FC<{tw: number}> = ({tw}) => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const bgc = '#fff';
  if (f >= LOGO_AT) {
    const s = tw / cy.bw;
    return (
      <div style={{width: W, height: H, background: bgc}}>
        <svg width={W} height={H}>
          <g transform={`translate(${W / 2} ${H / 2}) scale(${s}) translate(${-(cy.x + cy.bw / 2)} ${-(cy.y + cy.bh / 2)})`}>
            <path d={cy.d} fillRule="evenodd" fill="#000" />
          </g>
        </svg>
      </div>
    );
  }
  if (f === 0) return <div style={{width: W, height: H, background: bgc}} />;
  const e = L[frameShot[f]];
  const k = tw / e.w;
  return (
    <div style={{width: W, height: H, background: bgc, overflow: 'hidden', position: 'relative'}}>
      <Img src={staticFile(e.file)} style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0',
        transform: `translate(${W / 2 - e.cx * k}px, ${H / 2 - e.cy * k}px) scale(${k})`, imageRendering: 'auto'}} />
    </div>
  );
};

export const Root: React.FC = () => (
  <>
    <Composition id="MatchV" component={Match} width={1080} height={1920} fps={60} durationInFrames={300} defaultProps={{tw: 520}} />
    <Composition id="MatchS" component={Match} width={1080} height={1080} fps={60} durationInFrames={300} defaultProps={{tw: 420}} />
  </>
);
