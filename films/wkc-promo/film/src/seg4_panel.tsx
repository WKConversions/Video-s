// Segment 4, shot B: the "WKC Studio" panel (the reference's app panel), 1540 x 1000 local px (§4.4, §9.3): sidebar
// tools, header, the composition preview playing a real WKC client clip, the voice-over clip, a keyframe block, three
// timeline layer rows with a playhead, and the project column (Raphael Wind, storyboard scenes, recent projects).
// The measured quad is the front face; the slab's dark sides lie just outside it (PanelSides).
import React from "react";
import { Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, F } from "./lib";
import { WkcMark } from "./kit";
import { Icon, T } from "./seg4_util";

export const PW = 1540, PH = 1000;
const INK = C.ink;

const Avatar: React.FC<{ x: number; y: number; r: number; src: string }> = ({ x, y, r, src }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 1.5px #FFFFFF, 0 1px 3px rgba(5,15,25,0.15)" }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);
const Diamond: React.FC<{ x: number; y: number; s?: number; fill: string; stroke?: string }> = ({ x, y, s = 10, fill, stroke }) => (
  <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={1.5} fill={fill} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} transform={`rotate(45 ${x} ${y})`} />
);

/** the waveform bars of the voice-over clip (white), x 755-975, centred on y 215 */
const WAVE = Array.from({ length: 44 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.43) * 0.5 + Math.sin(i * 3.1) * 0.25);
  return 4 + Math.min(1, v) * 26;
});

/** the slab's dark sides, seen just outside the front face: top 7, right 16 local px (measured on the reference) */
export const PanelSides: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: -7, width: PW + 16, height: PH + 7, borderRadius: "26px 34px 24px 24px", background: INK }} />
);

/** the front face, (0,0)-(1540,1000) = the measured quad */
export const StudioPanel: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, borderRadius: "24px 28px 24px 24px", background: C.page, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 100, bottom: 0, background: C.white, boxShadow: "1px 0 0 #ECEEF1" }} />
      <div style={{ position: "absolute", left: 1150, top: 0, width: 400, bottom: 0, background: "#FBFBFC", boxShadow: "-1px 0 0 #E8EAED" }} />
    </div>
    {/* content, in panel-local px */}
    <div style={{ position: "absolute", left: 23, top: 28, width: 34, height: 34, borderRadius: 10, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <WkcMark w={26} fill="#FFFFFF" />
    </div>
    <Avatar x={47} y={953} r={25} src="img/raphael-400.webp" />
    <Avatar x={1025} y={210} r={20} src="img/karl-400.webp" />
    <Avatar x={1025} y={665} r={20} src="img/karl-400.webp" />
    <Avatar x={1200} y={47} r={27} src="img/raphael-400.webp" />
    {/* composition preview: a real WKC project */}
    <div style={{ position: "absolute", left: 247, top: 300, width: 480, height: 270, borderRadius: 10, overflow: "hidden", background: "#E9EEF4", boxShadow: "0 0 0 1px #D9E2EC" }}>
      <Sequence from={455} layout="none">
        <OffthreadVideo src={staticFile("clips/wicflow-16x9.mp4")} muted style={{ width: 480, height: 270, objectFit: "cover", display: "block" }} />
      </Sequence>
    </div>
    <div style={{ position: "absolute", left: 207 - 11, top: 152 - 11, width: 22, height: 22, borderRadius: "50%", background: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <WkcMark w={15} fill="#FFFFFF" />
    </div>
    <svg width={PW} height={PH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {/* sidebar tools */}
      {(["select", "layers", "pen", "type", "camera", "sparkle"] as const).map((k, i) => <Icon key={k} k={k} cx={40} cy={[120, 187, 253, 320, 387, 453][i]} size={24} color={C.muted} sw={1.8} />)}
      <Icon k="gear" cx={50} cy={887} size={24} color={C.muted} sw={1.8} />
      {/* header */}
      <T x={109} y={60} s="Studio" size={30} w={800} fill={INK} family={F.head} track={-1.5} />
      <Icon k="playS" cx={587} cy={47} size={20} color={C.muted} />
      <Icon k="pause" cx={640} cy={47} size={20} color={C.muted} />
      {[870, 920].map((x, i) => <g key={x}><circle cx={x} cy={47} r={22} fill={C.white} stroke="#E2E6EB" strokeWidth={1.5} /><Icon k={i ? "gear" : "zoom"} cx={x} cy={47} size={20} color={INK} sw={1.7} /></g>)}
      <rect x={952.75} y={27.75} width={169.5} height={38.5} rx={19.25} fill={C.white} stroke="#D9E2EC" strokeWidth={1.5} />
      <Icon k="eye" cx={984} cy={47} size={20} color={INK} sw={1.7} />
      <T x={1004} y={53} s="Preview" size={17} w={500} fill={INK} />
      {/* scene line */}
      <T x={247} y={157} s="Scene 03 · Product      00:00:06:12" size={15} w={500} fill={C.muted2} />
      {/* voice-over clip */}
      <rect x={700} y={188} width={295} height={84} rx={18} fill={C.blue} />
      <circle cx={727} cy={215} r={15} fill={C.white} />
      <path d="M722.5 208 L733.5 215 L722.5 222 Z" fill={C.blue} />
      {WAVE.map((h, i) => <rect key={i} x={755 + i * 5} y={215 - h / 2} width={2.6} height={h} rx={1.3} fill={C.white} />)}
      <T x={726} y={256} s="VO" size={13} w={700} fill={C.white} />
      <T x={975} y={256} s="00:12" size={13} w={500} fill={C.white} opacity={0.8} anchor="end" />
      {/* composition preview guides and readout */}
      <rect x={271.5} y={313.5} width={432} height={243} fill="none" stroke={C.blue} strokeOpacity={0.25} strokeWidth={1} />
      <rect x={295.5} y={327.5} width={384} height={216} fill="none" stroke={C.blue} strokeOpacity={0.25} strokeWidth={1} strokeDasharray="4 4" />
      <path d="M481 435 H493 M487 429 V441" stroke={C.blue} strokeOpacity={0.35} strokeWidth={1} />
      <T x={812} y={588} s="1920 × 1080 · 30 fps" size={13} w={500} fill={C.muted2} anchor="end" />
      <rect x={772} y={308} width={6} height={254} rx={3} fill={C.blueSoft} />
      <rect x={772} y={380} width={6} height={182} rx={3} fill={C.blue} />
      <circle cx={775} cy={380} r={8} fill={C.white} stroke={C.blue} strokeWidth={2} />
      {/* keyframe block */}
      <rect x={560} y={618} width={435} height={117} rx={14} fill={C.blueText} />
      <T x={580} y={649} s="Position · Scale · Opacity" size={16} w={600} fill={C.white} />
      <T x={580} y={671} s="ease cubic-bezier(.22,1,.36,1)" size={13} w={500} fill={C.white} opacity={0.6} />
      <Icon k="diamond" cx={965} cy={647} size={20} color={C.white} sw={1.6} />
      <rect x={580} y={686} width={395} height={1} fill={C.white} opacity={0.4} />
      <rect x={590} y={714.25} width={370} height={1.5} fill={C.white} opacity={0.45} />
      {[600, 680, 760, 860, 950].map((x) => <Diamond key={x} x={x} y={715} fill={C.white} />)}
      {/* timeline layer rows, playhead, transport */}
      {([["Logo", 780, [392, 520, 700]], ["Headline", 830, [450, 640, 880]], ["Cursor", 880, [540, 760, 960]]] as [string, number, number[]][]).map(([l, y, ks]) => (
        <g key={l}>
          <T x={253} y={y + 5} s={l} size={15} w={500} fill={C.muted} />
          <rect x={360} y={y - 9} width={630} height={18} rx={9} fill={C.blueSoft} />
          <rect x={ks[0]} y={y - 2} width={ks[ks.length - 1] - ks[0]} height={4} rx={2} fill={C.blue} opacity={0.35} />
          {ks.map((x) => <Diamond key={x} x={x} y={y} fill={C.blue} />)}
        </g>
      ))}
      <rect x={519} y={762} width={2} height={178} fill={C.blue} />
      <path d="M514 757 H526 L520 766 Z" fill={C.blue} />
      <Icon k="prev" cx={262} cy={920} size={15} color={C.muted2} sw={1.6} />
      <Icon k="playS" cx={298} cy={920} size={15} color={C.muted2} />
      <Icon k="next" cx={334} cy={920} size={15} color={C.muted2} sw={1.6} />
      {/* project column */}
      <T x={1243} y={42} s="Raphael Wind" size={18} w={600} fill={INK} />
      <T x={1243} y={63} s="WKConversions" size={13} w={400} fill={C.muted2} />
      <Icon k="chev" cx={1490} cy={47} size={20} color={C.muted} sw={1.8} />
      <T x={1168} y={121} s="Scenes" size={15} w={600} fill={INK} />
      <T x={1243} y={121} s="Layers" size={15} w={500} fill={C.muted2} />
      <T x={1347} y={121} s="Render" size={15} w={500} fill={C.muted2} />
      <rect x={1150} y={134.5} width={390} height={1} fill="#E2E3E6" />
      <rect x={1150} y={131} width={70} height={2.5} rx={1} fill={C.blueText} />
      <T x={1178} y={199} s="Storyboard" size={18} w={700} fill={INK} />
      <rect x={1153} y={335} width={387} height={55} fill={C.blueSoft} />
      <rect x={1153} y={335} width={4} height={55} fill={C.blue} />
      {(["01 · Hook", "02 · Problem", "03 · Product", "04 · Feature"] as const).map((s, i) => {
        const y = [245, 304, 363, 423][i];
        return <g key={s}><Icon k="frame" cx={1190} cy={y} size={18} color={i === 2 ? C.blueText : C.muted} sw={1.6} /><T x={1213} y={y + 5.5} s={s} size={16} w={500} fill={i === 2 ? C.blueText : INK} /></g>;
      })}
      <T x={1178} y={521} s="Recent projects" size={18} w={700} fill={INK} />
      <Icon k="chev" cx={1490} cy={515} size={18} color={C.muted} sw={1.8} />
      <T x={1178} y={570} s="Wicflow · AI at work" size={15} w={400} fill={C.muted} />
      <rect x={1153} y={604} width={3} height={36} fill={C.blue} />
      <T x={1178} y={627} s="VoxFlow launch film" size={15} w={400} fill={C.muted} />
    </svg>
  </div>
);
