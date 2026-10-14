// Segment 5, shot 3 (frames 606-648): five floating phone screens of finished vertical deliverables on the moving
// blue gradient, each on its own parallax track (spec/seg5.md §4, table T5; the outer three extrapolated back to 606).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, F } from "./lib";
import { Field, ZoomBlur, tab } from "./seg5_util";
import { BG3 } from "./seg5_data";

/** [frame, then cx, top, width for SEND, CHART, CONTACTS, WALLET, RECEIPT]; height = 2.165 x width */
const PH: number[][] = [
  [606, 1081, 430, 1035, 219, -237, 551, 1933.4, -2418.8, 1010, -842.1, 649.2, 898.6, 2504.8, -32, 860.5],
  [607, 1065, 440, 905, 278, -259, 506, 1782.9, -1929.6, 853.2, -585.8, 630.5, 774.2, 2348.2, 45.2, 745.4],
  [608, 1059, 443, 848, 310, -261, 483, 1718.6, -1720.6, 786.2, -474.7, 622.4, 720.3, 2280.1, 78.7, 695.3],
  [609, 1054, 445, 807, 335, -259, 463, 1673, -1572.4, 738.7, -395.3, 616.7, 681.7, 2231.2, 102.8, 659.4],
  [610, 1050, 446, 773, 356, -254, 446, 1635.6, -1451, 699.8, -329.8, 611.9, 649.9, 2190.9, 122.7, 629.7],
  [611, 1047, 446, 747, 374, -250, 434, 1607.3, -1359.1, 670.4, -279.9, 608.3, 625.7, 2160.1, 137.8, 607],
  [612, 1044, 447, 722, 390, -243, 422, 1580.4, -1271.5, 642.3, -232.1, 604.8, 602.5, 2130.6, 152.4, 585.3],
  [613, 1042, 447, 702, 404, -236, 411, 1559, -1202, 620, -194, 602, 584, 2107, 164, 568],
  [614, 1039, 447, 682, 418, -229, 401, 1540, -1140, 600, -160, 599, 569, 2086, 174, 552],
  [615, 1037, 446, 665, 429, -221, 392, 1523, -1086, 584, -130, 596, 554, 2066, 184, 535],
  [616, 1036, 446, 651, 440, -214, 383, 1507, -1038, 571, -104, 593, 538, 2050, 192, 523],
  [617, 1034, 445, 640, 450, -207, 376, 1493, -992, 554, -78, 591, 525, 2034, 200, 512],
  [618, 1033, 445, 628, 460, -201, 369, 1481, -949, 539, -54, 592, 516, 2020, 207, 504],
  [619, 1032, 444, 616, 468, -194, 364, 1469, -912, 528, -33, 590, 506, 2007, 214, 493],
  [620, 1029, 442, 603, 477, -187, 357, 1458, -874, 514, -13, 589, 496, 1994, 220, 485],
  [621, 1029, 442, 596, 484, -179, 352, 1449, -846, 503, 5, 587, 487, 1983, 226, 476],
  [622, 1028, 441, 587, 491, -173, 345, 1440, -816, 492, 22, 586, 479, 1972, 231, 469],
  [623, 1027, 439, 579, 498, -167, 341, 1431, -788, 485, 37, 584, 469, 1962, 236, 461],
  [624, 1026, 438, 572, 505, -161, 336, 1424, -763, 475, 51, 583, 461, 1953, 240, 455],
  [625, 1025, 436, 567, 511, -156, 332, 1416, -738, 466, 65, 581, 456, 1944, 244, 448],
  [626, 1025, 435, 561, 517, -149, 327, 1409, -717, 462, 77, 580, 447, 1936, 248, 441],
  [627, 1024, 433, 556, 522, -145, 322, 1402, -697, 456, 89, 579, 440, 1928, 252, 436],
  [628, 1024, 432, 553, 527, -141, 320, 1396, -676, 449, 101, 579, 437, 1921, 255, 431],
  [629, 1024, 430, 549, 532, -136, 317, 1389, -658, 445, 111, 578, 431, 1914, 259, 425],
  [630, 1023, 429, 544, 537, -132, 313, 1383, -641, 440, 121, 577, 428, 1908, 262, 420],
  [631, 1023, 427, 540, 541, -126, 309, 1378, -625, 436, 131, 577, 423, 1901, 265, 414],
  [632, 1022, 425, 537, 546, -122, 306, 1372, -609, 431, 140, 576, 417, 1895, 268, 409],
  [633, 1022, 424, 533, 550, -116, 303, 1368, -593, 423, 150, 576, 412, 1889, 271, 405],
  [634, 1022, 423, 531, 555, -112, 301, 1363, -579, 417, 159, 575, 407, 1882, 274, 400],
  [635, 1022, 422, 527, 559, -105, 296, 1358, -565, 412, 168, 574, 403, 1876, 277, 395],
  [636, 1021, 421, 524, 564, -98, 293, 1353, -550, 407, 177, 574, 398, 1869, 281, 390],
  [637, 1021, 420, 521, 568, -92, 290, 1348, -535, 402, 187, 573, 394, 1862, 284, 386],
  [638, 1020, 419, 515, 573, -86, 283, 1342, -521, 401, 197, 573, 390, 1854, 287, 382],
  [639, 1020, 419, 510, 577, -78, 281, 1338, -506, 391, 207, 572, 385, 1845, 290, 376],
  [640, 1019, 418, 505, 582, -70, 277, 1333, -489, 382, 217, 572, 382, 1836, 293, 371],
  [641, 1018, 417, 498, 587, -63, 272, 1328, -474, 376, 228, 571, 377, 1827, 297, 365],
  [642, 1017, 417, 491, 592, -55, 268, 1322, -456, 369, 240, 570, 372, 1816, 301, 361],
  [643, 1016, 417, 483, 597, -46, 264, 1315, -440, 366, 252, 569, 364, 1804, 306, 355],
  [644, 1015, 418, 473, 603, -36, 260, 1308, -421, 360, 265, 568, 358, 1790, 310, 348],
  [645, 1014, 418, 463, 609, -26, 255, 1300, -399, 352, 280, 567, 350, 1775, 315, 340],
  [646, 1012, 420, 450, 616, -14, 249, 1291, -372, 344, 298, 567, 340, 1756, 321, 332],
  [647, 1010, 423, 433, 626, 2, 243, 1279, -339, 333, 320, 566, 329, 1731, 329, 320],
  [648, 1008, 428, 408, 638, 22, 234, 1263, -294, 316, 350, 564, 311, 1696, 340, 303],
];

const DW = 390, DH = 844; // design units of every screen
const HEAD = "linear-gradient(180deg, #1266C9 0%, #0B4E9E 100%)";
const ui = (size: number, weight = 400, color: string = C.ink): React.CSSProperties => ({ fontFamily: F.ui, fontSize: size, fontWeight: weight, color, lineHeight: 1.2, whiteSpace: "nowrap" });
const abs = (left: number, top: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

const StatusBar: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const c = dark ? C.ink : C.white;
  return (
    <>
      <div style={abs(26, 13, ui(15, 600, c))}>09:41</div>
      <svg width={70} height={14} viewBox="0 0 70 14" style={abs(300, 15)}>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5} y={10 - i * 3} width={3.4} height={4 + i * 3} rx={1} fill={c} />)}
        <path d="M27 5.2 a9 9 0 0 1 12 0 M29.3 8 a5.6 5.6 0 0 1 7.4 0" stroke={c} strokeWidth={1.8} fill="none" strokeLinecap="round" /><circle cx={33} cy={11.2} r={1.6} fill={c} />
        <rect x={45} y={2} width={21} height={10} rx={3} stroke={c} strokeOpacity={0.5} fill="none" /><rect x={47} y={4} width={17} height={6} rx={1.6} fill={c} />
      </svg>
    </>
  );
};
const Thumb: React.FC<{ src: string; size: number; left: number; top: number; round?: boolean }> = ({ src, size, left, top, round = true }) => (
  <div style={abs(left, top, { width: size, height: size, borderRadius: round ? size / 2 : size * 0.26, overflow: "hidden", background: C.surface })}>
    <Img src={staticFile(src)} style={{ width: size, height: size, objectFit: "cover", display: "block" }} />
  </div>
);
const Clip: React.FC<{ name: string; w: number; h: number; still?: boolean }> = ({ name, w, h, still }) => still
  ? <Img src={staticFile(`clips/${name}.jpg`)} style={{ width: w, height: h, objectFit: "cover", display: "block" }} />
  : <Sequence from={606} layout="none"><OffthreadVideo src={staticFile(`clips/${name}.mp4`)} muted style={{ width: w, height: h, objectFit: "cover", display: "block" }} /></Sequence>;

/** SEND -> "Share Video": the export/share screen of a 9:16 deliverable */
const Share: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: HEAD }} />
    <StatusBar />
    <div style={abs(22, 62, { width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.14)" })}>
      <svg width={44} height={44} viewBox="0 0 44 44"><path d="M25 14 L17 22 L25 30" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    <div style={abs(0, 73, { width: DW, textAlign: "center", ...ui(17.7, 600, C.white) })}>Share Video</div>
    <div style={abs(0, 130, { width: DW, height: DH - 130, borderRadius: "26px 26px 0 0", background: C.white })} />
    <div style={abs(24, 156, { width: 342, height: 82, borderRadius: 16, border: `1px solid ${C.line}`, background: C.white, boxShadow: "0 4px 14px rgba(5,15,25,0.05)" })} />
    <Thumb src="clips/vendom-1x1.jpg" size={46} left={41} top={174} round={false} />
    <div style={abs(101, 176, ui(17.7, 600))}>Vendom</div>
    <div style={abs(101, 202, ui(12.5, 400, C.muted2))}>Reel · 1080 x 1920</div>
    <svg width={20} height={20} viewBox="0 0 20 20" style={abs(326, 187)}><path d="M5 8 L10 13 L15 8" stroke={C.ink} strokeWidth={2} fill="none" strokeLinecap="round" /></svg>
    <div style={abs(0, 284, { width: DW, textAlign: "center", ...ui(45, 600), letterSpacing: "-0.01em" })}>00:15</div>
    <div style={abs(75, 360, { width: 240, height: 427, borderRadius: 16, overflow: "hidden", background: C.surface, boxShadow: "0 8px 24px rgba(5,15,25,0.12)" })}>
      <Clip name="vendom-9x16" w={240} h={427} />
    </div>
  </>
);

/** CHART -> "Performance" */
const BARS = [[0.42, 0.62], [0.55, 0.88], [0.92, 0.7], [0.64, 0.8], [0.3, 0.52], [0.48, 0.66], [0.58, 0.6]];
const Perf: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: C.white }} />
    <StatusBar dark />
    <div style={abs(24, 120, ui(13, 400, C.muted2))}>Total views</div>
    <div style={abs(24, 148, ui(32, 700))}>21,350</div>
    <div style={abs(24, 228, ui(15, 600))}>Performance</div>
    <div style={abs(300, 226, { ...ui(12, 500, C.muted), padding: "3px 10px", borderRadius: 10, border: `1px solid ${C.line}` })}>Month</div>
    {["40k", "30k", "20k", "10k", "0k"].map((t, i) => <div key={t} style={abs(24, 284 + i * 43, ui(10, 400, C.muted2))}>{t}</div>)}
    {BARS.map(([a, b], i) => (
      <React.Fragment key={i}>
        <div style={abs(72 + i * 43, 462 - 170 * a, { width: 11, height: 170 * a, borderRadius: 6, background: C.blue })} />
        <div style={abs(87 + i * 43, 462 - 170 * b, { width: 11, height: 170 * b, borderRadius: 6, background: C.ink })} />
        <div style={abs(72 + i * 43, 482, ui(10, 400, C.muted2))}>{["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"][i]}</div>
      </React.Fragment>
    ))}
    <div style={abs(26, 516, { display: "flex", gap: 16, ...ui(11, 400, C.muted) })}>
      <span><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 2, background: C.ink, marginRight: 6 }} />Views</span>
      <span><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 2, background: C.blue, marginRight: 6 }} />Shares</span>
    </div>
    <div style={abs(24, 568, { width: 162, height: 159, borderRadius: 16, background: C.ink })}>
      <div style={abs(16, 96, ui(12, 400, "rgba(255,255,255,0.7)"))}>Watch time</div>
      <div style={abs(16, 116, ui(19, 600, C.white))}>18.5k h</div>
    </div>
    <div style={abs(202, 568, { width: 162, height: 159, borderRadius: 16, background: C.blue })}>
      <div style={abs(16, 96, ui(12, 400, "rgba(255,255,255,0.8)"))}>CTR</div>
      <div style={abs(16, 116, ui(19, 600, C.white))}>+14.5 %</div>
    </div>
    <div style={abs(165, 730, { width: 60, height: 60, borderRadius: 30, background: C.blue, boxShadow: "0 6px 16px rgba(63,140,232,0.4)" })} />
    {[46, 110, 280, 344].map((x) => <div key={x} style={abs(x - 9, 772, { width: 18, height: 18, borderRadius: 5, border: `1.8px solid ${C.muted2}` })} />)}
    <div style={abs(130, 828, { width: 130, height: 5, borderRadius: 3, background: C.ink })} />
  </>
);

/** CONTACTS -> "Recent clients" */
const CLIENTS: [string, string, number][] = [["Robin Bos", "clips/robin-bos-16x9.jpg", 452], ["bfound", "clips/wkc-bfound-16x9.jpg", 522],
  ["ClearScaler", "clips/clearscaler-1x1.jpg", 625], ["Creoble", "clips/creoble-lovable-1x1.jpg", 697], ["Malaga Hideaway", "clips/malaga-16x9.jpg", 768]];
const Clients: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: C.white }} />
    <StatusBar dark />
    <div style={abs(24, 70, ui(22, 700))}>Clients</div>
    <div style={abs(24, 380, ui(13, 500, C.muted2))}>Pinned</div>
    <div style={abs(24, 548, { width: 342, height: 1, background: C.line })} />
    <div style={abs(24, 572, ui(13, 500, C.muted2))}>Recent clients</div>
    {CLIENTS.map(([n, src, y]) => (
      <React.Fragment key={n}>
        <Thumb src={src} size={46} left={21} top={y - 23} />
        <div style={abs(82, y - 20, ui(15, 600))}>{n}</div>
        <div style={abs(82, y + 3, ui(11.5, 400, C.muted2))}>16:9 · 1:1 · 9:16</div>
      </React.Fragment>
    ))}
    <div style={abs(130, 828, { width: 130, height: 5, borderRadius: 3, background: C.ink })} />
  </>
);

/** WALLET -> the Malaga Hideaway reel, full-bleed under a blue header */
const Reel: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 0, top: 290, width: DW, height: DH - 290, overflow: "hidden" }}><Clip name="malaga-9x16" w={DW} h={DH - 290} /></div>
    <div style={{ position: "absolute", left: 0, top: 0, width: DW, height: 262, background: HEAD }} />
    <StatusBar />
    <Thumb src="clips/malaga-16x9.jpg" size={44} left={24} top={61} />
    <svg width={22} height={22} viewBox="0 0 22 22" style={abs(342, 72)}><path d="M6 15 V10 a5 5 0 0 1 10 0 V15 Z M9 18 h4" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinejoin="round" /></svg>
    <div style={abs(0, 116, { width: DW, textAlign: "center", ...ui(13, 400, "rgba(255,255,255,0.8)") })}>Malaga Hideaway</div>
    <div style={abs(0, 144, { width: DW, textAlign: "center", ...ui(32, 600, C.white) })}>Reel ready</div>
    <div style={abs(24, 226, { width: 342, height: 76, borderRadius: 16, background: C.white, boxShadow: "0 6px 18px rgba(5,15,25,0.12)" })}>
      {["Reel", "Story", "Ad", "Web"].map((t, i) => (
        <React.Fragment key={t}>
          <div style={abs(30 + i * 86, 12, { width: 24, height: 24, borderRadius: 7, background: C.blueSoft, border: `1.5px solid ${C.blue}` })} />
          <div style={abs(42 + i * 86 - 30, 46, { width: 60, textAlign: "center", ...ui(11.5, 500, C.ink) })}>{t}</div>
        </React.Fragment>
      ))}
    </div>
  </>
);

/** RECEIPT -> "Export complete" */
const Done: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: HEAD }} />
    <StatusBar />
    <svg width={24} height={24} viewBox="0 0 24 24" style={abs(24, 79)}><path d="M15 5 L8 12 L15 19" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    <div style={abs(0, 80, { width: DW, textAlign: "center", ...ui(17.7, 600, C.white) })}>Export</div>
    <div style={abs(0, 142, { width: DW, height: DH - 142, borderRadius: "26px 26px 0 0", background: C.white })} />
    <div style={abs(157, 176, { width: 76, height: 76, borderRadius: 38, background: "rgba(41,179,107,0.14)" })} />
    <div style={abs(167, 186, { width: 56, height: 56, borderRadius: 28, background: "#29B36B" })}>
      <svg width={56} height={56} viewBox="0 0 56 56"><path d="M18 29 L25 36 L39 21" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    <div style={abs(0, 280, { width: DW, textAlign: "center", ...ui(19, 600) })}>Export complete</div>
    <div style={abs(0, 312, { width: DW, textAlign: "center", ...ui(12.5, 400, C.muted2) })}>Your video is ready to share.</div>
    <div style={abs(24, 368, { width: 342, height: 1, background: C.line })} />
    <div style={abs(24, 396, ui(13, 400, C.muted2))}>Deliverable</div>
    <div style={abs(24, 438, { width: 342, height: 72, borderRadius: 14, background: C.page })}>
      <Thumb src="clips/creoble-9x16.jpg" size={44} left={14} top={14} round={false} />
      <div style={abs(72, 18, ui(14.5, 600))}>Creoble</div>
      <div style={abs(72, 40, ui(11.5, 400, C.muted2))}>Social cut · 9:16</div>
    </div>
    {[["File", "creoble_9x16.mp4", 540], ["Format", "1080x1920", 584], ["Size", "24 MB", 628]].map(([k, v, y]) => (
      <React.Fragment key={k as string}>
        <div style={abs(24, y as number, ui(13, 400, C.muted))}>{k}</div>
        <div style={abs(366, y as number, { ...ui(13, 600), transform: "translateX(-100%)" })}>{v}</div>
      </React.Fragment>
    ))}
    <div style={abs(24, 650, ui(14, 600))}>See Detail</div>
    <div style={abs(24, 766, { width: 342, height: 56, borderRadius: 28, background: C.blue, textAlign: "center", ...ui(16, 600, C.white), lineHeight: "56px" })}>Done</div>
  </>
);

const SCREENS = [Share, Perf, Clients, Reel, Done];
const Phone: React.FC<{ cx: number; top: number; w: number; i: number }> = ({ cx, top, w, i }) => {
  const S = SCREENS[i], k = w / DW;
  if (cx + w / 2 < -40 || cx - w / 2 > 1960 || top > 1100 || top + DH * k < -40) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: DW, height: DH, transformOrigin: "0 0", transform: `translate(${cx - w / 2}px, ${top}px) scale(${k})`,
      borderRadius: 0.045 * DW, overflow: "hidden", background: C.white, boxShadow: "0 20px 60px rgba(18,50,120,0.18)" }}>
      <S />
    </div>
  );
};

const BLUR: number[][] = [[645, 0], [646, 0.004], [647, 0.008], [648, 0.018]];
export const Shot3: React.FC<{ g: number }> = ({ g }) => {
  const r = tab(g, PH);
  let k = 0;
  while (k < BG3.length - 2 && BG3[k + 1][0] <= g) k++;
  const [fa, a] = BG3[k], [fb, b] = BG3[Math.min(k + 1, BG3.length - 1)];
  const [amt] = tab(g, BLUR);
  const outer = (
    <>{[1, 2, 3, 4].map((i) => <Phone key={i} i={i} cx={r[i * 3]} top={r[i * 3 + 1]} w={r[i * 3 + 2]} />)}</>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#8CC4F4" }}>
      <Field a={a} b={b} t={fb > fa ? (g - fa) / (fb - fa) : 0} />
      <ZoomBlur amt={amt} n={6} cx={960} cy={470} render={() => outer} />
      <Phone i={0} cx={r[0]} top={r[1]} w={r[2]} />
    </AbsoluteFill>
  );
};
