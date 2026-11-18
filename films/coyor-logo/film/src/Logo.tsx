import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import cy from './cy.json';
import {states, hash, M0, M1, SLAM} from './schedule';

const BW = cy.bw, BH = cy.bh;
const INK = '#000', PAPER = '#fff';

type P = {x: number; y: number; w: number; fill?: string; stroke?: string; sw?: number; op?: number; blend?: string; rot?: number};
const Mark: React.FC<P> = ({x, y, w, fill, stroke, sw = 0, op = 1, blend, rot = 0}) => {
  const s = w / BW;
  return (
    <g opacity={op} style={blend ? {mixBlendMode: blend as any} : undefined}
       transform={`translate(${x} ${y}) rotate(${rot}) scale(${s}) translate(${-(cy.x + BW / 2)} ${-(cy.y + BH / 2)})`}>
      <path d={cy.d} fillRule="evenodd" fill={fill ?? 'none'} stroke={stroke} strokeWidth={sw / s} strokeLinejoin="miter" />
    </g>
  );
};

export const Logo: React.FC<{finalW: number}> = ({finalW}) => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const cx = W / 2, cyy = H / 2;
  const short = Math.min(W, H);
  const fw = finalW;
  let bg = PAPER;
  let body: React.ReactNode = null;
  let shake: [number, number] = [0, 0];
  const R = (n: number) => hash(n); // seeded

  if (f < M0) {
    // opening flash: white / black / white
    bg = [PAPER, INK, PAPER][f] ?? PAPER;
    if (f === 4) body = <Mark x={cx} y={cyy} w={fw * 0.5} fill={INK} />;
  } else if (f < M1) {
    const st = states.find((s) => f >= s.start && f < s.start + s.dur)!;
    const k = st.i * 13 + 5;
    const sub = f - st.start;
    const inv = st.kind === 'inv' || st.kind === 'strobe';
    bg = inv ? INK : PAPER;
    const fg = inv ? PAPER : INK;
    const pos = () => ({x: cx + (R(k + 1) - 0.5) * W * 0.5, y: cyy + (R(k + 2) - 0.5) * H * 0.4});
    switch (st.kind) {
      case 'huge': {
        const w = short * (2.2 + R(k) * 2.6);
        body = <Mark x={cx + (R(k + 1) - 0.5) * w * 0.5} y={cyy + (R(k + 2) - 0.5) * w * 0.5} w={w} fill={fg} />;
        break;
      }
      case 'bigoff': {
        const w = short * (1.3 + R(k) * 0.8);
        body = <Mark x={cx + (R(k + 1) - 0.5) * W * 0.9} y={cyy + (R(k + 2) - 0.5) * H * 0.6} w={w} fill={fg} />;
        break;
      }
      case 'tiny': {
        const p = pos();
        body = <Mark x={p.x} y={p.y} w={short * (0.07 + R(k) * 0.09)} fill={fg} />;
        break;
      }
      case 'mid': {
        const p = pos();
        body = <Mark x={p.x * 0.5 + cx * 0.5} y={p.y * 0.6 + cyy * 0.4} w={short * (0.35 + R(k) * 0.4)} fill={fg} />;
        break;
      }
      case 'inv': {
        const w = short * (0.45 + R(k) * 1.4);
        const p = pos();
        body = <Mark x={p.x * 0.6 + cx * 0.4} y={p.y * 0.6 + cyy * 0.4} w={w} fill={fg} />;
        break;
      }
      case 'strobe': {
        // white CY on black, strobing between two sizes on every frame
        const w = fw * (sub % 2 ? 1.0 : 2.0);
        body = <Mark x={cx} y={cyy} w={w} fill={fg} />;
        break;
      }
      case 'outline': {
        const w = short * (0.5 + R(k) * 0.9);
        const p = pos();
        body = <Mark x={p.x * 0.5 + cx * 0.5} y={p.y * 0.5 + cyy * 0.5} w={w} stroke={INK} sw={3 + R(k + 3) * 3} />;
        break;
      }
      case 'grid': {
        const cols = 2 + Math.floor(R(k) * 3);
        const cw = W / cols, rows = Math.ceil(H / cw);
        const cells: React.ReactNode[] = [];
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const o = (r + c + sub) % 2 === 0;
          cells.push(<Mark key={r * 9 + c} x={cw * (c + 0.5)} y={cw * (r + 0.5) + (H - rows * cw) / 2} w={cw * 0.62} fill={o ? INK : 'none'} stroke={o ? undefined : INK} sw={2} />);
        }
        body = <>{cells}</>;
        break;
      }
      case 'slice': {
        const w = fw * (1.1 + R(k) * 1.6);
        const n = 7, bandH = H / n, bands: React.ReactNode[] = [];
        for (let b = 0; b < n; b++) {
          const dx = (R(k + 10 + b + sub * 7) - 0.5) * W * (0.35 + 0.35 * R(k + 4)) * (R(k + 30 + b) > 0.35 ? 1 : 0);
          bands.push(
            <g key={b} clipPath={`url(#band${b})`}>
              <Mark x={cx + dx} y={cyy} w={w} fill={INK} />
            </g>
          );
        }
        body = (<>
          <defs>{Array.from({length: n}, (_, b) => <clipPath key={b} id={`band${b}`}><rect x={0} y={b * bandH} width={W} height={bandH + 1} /></clipPath>)}</defs>
          {bands}
        </>);
        break;
      }
      case 'rgb': {
        const w = fw * (0.9 + R(k) * 1.8);
        const d = 10 + R(k + 2) * 26;
        body = (<>
          <Mark x={cx - d} y={cyy} w={w} fill="#00e5ff" blend="multiply" />
          <Mark x={cx + d} y={cyy} w={w} fill="#ff2a55" blend="multiply" />
          <Mark x={cx} y={cyy} w={w} fill={INK} blend="multiply" />
        </>);
        break;
      }
      case 'streak': {
        const w = fw * (0.8 + R(k) * 0.8);
        const vert = R(k + 1) > 0.5;
        const len = 160 + R(k + 2) * 260;
        body = (<>
          {Array.from({length: 9}, (_, j) => {
            const t = (j - 4) / 4;
            return <Mark key={j} x={cx + (vert ? 0 : t * len)} y={cyy + (vert ? t * len : 0)} w={w * (1 + t * 0.08)} fill={INK} op={j === 4 ? 1 : 0.28} />;
          })}
        </>);
        break;
      }
    }
  } else {
    const s = f - SLAM;
    const ease = Easing.bezier(0.2, 0.9, 0.2, 1);
    if (s < 4) {
      // approach: scale 1.35 -> 1, fast, with smear
      const sc = interpolate(s, [0, 3], [1.35, 1.04], {easing: ease});
      const x0 = interpolate(s, [0, 3], [1.9, 1.15]);
      body = (<>
        <Mark x={cx} y={cyy} w={fw * sc * x0 * 0.9} fill={INK} op={0.18} />
        <Mark x={cx} y={cyy} w={fw * sc} fill={INK} />
      </>);
    } else if (s === 4) {
      // landing flash: white CY on black for one frame
      bg = INK;
      body = <Mark x={cx} y={cyy} w={fw * 1.0} fill={PAPER} />;
      shake = [0, 0];
    } else {
      const t = s - 5;
      const amp = Math.max(0, 14 * Math.pow(0.55, t)) * (t < 7 ? 1 : 0);
      shake = [(R(t + 200) - 0.5) * 2 * amp, (R(t + 300) - 0.5) * 2 * amp * 0.6];
      const settle = f >= SLAM + 24 ? 0 : 0.0035 * Math.pow(0.9, t);
      body = <Mark x={cx} y={cyy} w={fw * (1 + settle)} fill={INK} />;
    }
  }
  return (
    <div style={{width: W, height: H, background: bg, overflow: 'hidden'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{display: 'block', transform: `translate(${shake[0]}px, ${shake[1]}px)`, isolation: 'isolate'}}>
        <rect width={W} height={H} fill={bg} />
        {body}
      </svg>
    </div>
  );
};
