// Segment 5, shot 3 (frames 606-648): five floating phone screens of finished vertical deliverables on the moving
// blue gradient, each on its own parallax track (spec/seg5.md §4, table T5; the outer three extrapolated back to 606).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, F } from "./lib";
import { Field, ZoomBlur, fieldAt, tab } from "./seg5_util";
import { BG3 } from "./seg5_data";

/** [frame, then cx, top, width for SEND, CHART, CONTACTS, WALLET, RECEIPT]; height = 2.165 x width. T5 (±3 px measurement
 * noise) fitted per column with an expo-out + drift + expo-in curve plus a smoothing spline of the residual, so the
 * phones glide instead of shaking (raw T5 stepped up to 8 px frame to frame; the fit stays within ~5 px of T5 on
 * screen while slow, ~10 px only at 607 where the edges move ~280 px/frame; 606 and 648 exact). */
const PH: number[][] = [
  [606, 1081, 430, 1034.99, 219.05, -237.14, 550.95, 1932.68, -2416.46, 1009.69, -840.94, 649.17, 898.08, 2504.28, -31.68, 859.95],
  [607, 1065.52, 439.93, 909.36, 274.85, -254.32, 508.91, 1788.76, -1948.58, 857.11, -595.39, 630.89, 778.69, 2353.15, 42.42, 749.8],
  [608, 1058.28, 443.26, 844.68, 310.78, -260.51, 481.61, 1715.19, -1709.48, 782.79, -468.96, 622.07, 717.46, 2276.61, 80.46, 692.79],
  [609, 1053.72, 444.84, 803.77, 336.55, -260.19, 461.97, 1669.79, -1561.98, 736.39, -389.97, 616.47, 679.19, 2228.43, 104.32, 657.03],
  [610, 1050.14, 445.79, 772.77, 356.94, -256.18, 446.46, 1635.87, -1451.81, 700.8, -330.34, 612.07, 650.25, 2191.56, 122.44, 629.94],
  [611, 1047.04, 446.39, 746.6, 374.32, -250.21, 433.31, 1607.42, -1359.46, 670.64, -280.04, 608.26, 625.82, 2160.22, 137.78, 606.99],
  [612, 1044.25, 446.74, 723.41, 389.79, -243.28, 421.64, 1582.44, -1278.44, 644.27, -235.74, 604.85, 604.29, 2132.56, 151.32, 586.64],
  [613, 1041.74, 446.85, 702.54, 403.89, -235.96, 411.03, 1560.3, -1206.78, 621.17, -196.47, 601.76, 585.19, 2108.03, 163.36, 568.45],
  [614, 1039.48, 446.75, 683.76, 416.85, -228.54, 401.26, 1540.58, -1143.06, 600.82, -161.44, 598.98, 568.12, 2086.17, 174.12, 552.11],
  [615, 1037.47, 446.45, 666.91, 428.81, -221.18, 392.27, 1522.94, -1086.11, 582.74, -130.06, 596.51, 552.76, 2066.61, 183.8, 537.47],
  [616, 1035.67, 445.98, 651.82, 439.87, -213.96, 383.99, 1507.13, -1035.02, 566.49, -101.8, 594.35, 538.9, 2049.04, 192.53, 524.37],
  [617, 1034.05, 445.38, 638.27, 450.1, -206.88, 376.39, 1492.92, -988.97, 551.68, -76.23, 592.48, 526.36, 2033.18, 200.45, 512.66],
  [618, 1032.58, 444.64, 625.97, 459.6, -199.93, 369.39, 1480.11, -947.27, 538.06, -52.96, 590.86, 514.97, 2018.76, 207.67, 502.12],
  [619, 1031.21, 443.78, 614.75, 468.42, -193.07, 362.91, 1468.49, -909.37, 525.49, -31.72, 589.39, 504.53, 2005.55, 214.27, 492.55],
  [620, 1029.96, 442.79, 604.53, 476.64, -186.31, 356.85, 1457.91, -874.77, 513.85, -12.25, 588, 494.84, 1993.38, 220.34, 483.77],
  [621, 1028.83, 441.7, 595.27, 484.32, -179.71, 351.14, 1448.2, -843.07, 503.1, 5.66, 586.65, 485.8, 1982.1, 225.91, 475.65],
  [622, 1027.81, 440.5, 586.91, 491.54, -173.32, 345.77, 1439.22, -813.86, 493.23, 22.19, 585.32, 477.3, 1971.61, 231.05, 468.07],
  [623, 1026.9, 439.19, 579.39, 498.36, -167.19, 340.73, 1430.85, -786.82, 484.22, 37.51, 584.03, 469.3, 1961.82, 235.8, 460.94],
  [624, 1026.1, 437.79, 572.66, 504.79, -161.34, 335.99, 1423, -761.68, 476.01, 51.76, 582.78, 461.8, 1952.66, 240.21, 454.2],
  [625, 1025.41, 436.32, 566.66, 510.86, -155.79, 331.53, 1415.59, -738.25, 468.56, 65.07, 581.6, 454.79, 1944.07, 244.33, 447.8],
  [626, 1024.82, 434.81, 561.3, 516.59, -150.52, 327.33, 1408.55, -716.35, 461.82, 77.56, 580.53, 448.26, 1936, 248.21, 441.7],
  [627, 1024.32, 433.26, 556.47, 522, -145.51, 323.41, 1401.85, -695.81, 455.66, 89.34, 579.58, 442.21, 1928.4, 251.88, 435.86],
  [628, 1023.89, 431.69, 552.09, 527.14, -140.7, 319.74, 1395.47, -676.49, 449.94, 100.48, 578.74, 436.61, 1921.21, 255.37, 430.26],
  [629, 1023.5, 430.12, 548.03, 532.06, -135.98, 316.24, 1389.38, -658.26, 444.55, 111.07, 577.99, 431.36, 1914.37, 258.72, 424.85],
  [630, 1023.14, 428.56, 544.23, 536.8, -131.25, 312.86, 1383.58, -641.01, 439.34, 121.19, 577.31, 426.37, 1907.8, 261.94, 419.6],
  [631, 1022.81, 427.04, 540.65, 541.4, -126.42, 309.55, 1378.06, -624.6, 434.2, 130.95, 576.69, 421.55, 1901.41, 265.07, 414.51],
  [632, 1022.49, 425.59, 537.26, 545.92, -121.42, 306.29, 1372.79, -608.9, 429.03, 140.42, 576.11, 416.84, 1895.13, 268.13, 409.57],
  [633, 1022.2, 424.24, 533.97, 550.37, -116.19, 303.02, 1367.72, -593.78, 423.82, 149.68, 575.54, 412.24, 1888.87, 271.16, 404.76],
  [634, 1021.9, 423.01, 530.71, 554.8, -110.67, 299.67, 1362.8, -579.13, 418.57, 158.82, 574.99, 407.76, 1882.52, 274.18, 400.06],
  [635, 1021.58, 421.89, 527.34, 559.21, -104.83, 296.2, 1357.98, -564.8, 413.32, 167.91, 574.44, 403.39, 1875.99, 277.2, 395.44],
  [636, 1021.21, 420.86, 523.74, 563.63, -98.66, 292.58, 1353.21, -550.64, 408.04, 177.04, 573.9, 399.1, 1869.18, 280.25, 390.85],
  [637, 1020.77, 419.94, 519.77, 568.07, -92.19, 288.82, 1348.43, -536.52, 402.65, 186.3, 573.35, 394.85, 1861.96, 283.33, 386.26],
  [638, 1020.26, 419.11, 515.3, 572.56, -85.41, 284.94, 1343.6, -522.25, 397.08, 195.79, 572.78, 390.56, 1854.22, 286.48, 381.59],
  [639, 1019.66, 418.4, 510.28, 577.14, -78.3, 280.99, 1338.65, -507.63, 391.23, 205.62, 572.18, 386.13, 1845.85, 289.75, 376.78],
  [640, 1018.96, 417.82, 504.61, 581.85, -70.86, 276.96, 1333.45, -492.39, 385.11, 215.96, 571.53, 381.42, 1836.71, 293.21, 371.73],
  [641, 1018.15, 417.39, 498.21, 586.74, -63.06, 272.83, 1327.85, -476.21, 378.74, 227, 570.81, 376.29, 1826.66, 296.94, 366.35],
  [642, 1017.23, 417.17, 490.98, 591.87, -54.82, 268.57, 1321.72, -458.67, 372.05, 238.98, 570.02, 370.58, 1815.52, 301.02, 360.53],
  [643, 1016.18, 417.22, 482.82, 597.31, -46, 264.11, 1314.88, -439.25, 364.89, 252.17, 569.18, 364.19, 1803.11, 305.52, 354.1],
  [644, 1014.99, 417.59, 473.55, 603.15, -36.41, 259.35, 1307.19, -417.38, 357.03, 266.87, 568.27, 357.01, 1789.25, 310.51, 346.92],
  [645, 1013.61, 418.42, 462.83, 609.5, -25.73, 254.19, 1298.52, -392.51, 348.29, 283.39, 567.32, 348.99, 1773.63, 316.1, 338.86],
  [646, 1012, 419.96, 449.93, 616.62, -13.34, 248.57, 1288.76, -364.2, 338.56, 301.95, 566.3, 340.02, 1755.53, 322.34, 329.85],
  [647, 1010.14, 422.77, 433.1, 625.25, 1.87, 242.39, 1277.75, -332.17, 327.92, 322.79, 565.21, 329.48, 1732.55, 329.38, 319.66],
  [648, 1008, 428, 408, 637.99, 21.99, 234.06, 1263.21, -294.82, 316.6, 349.61, 564.05, 311.06, 1696.04, 339.9, 303.17],
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

/** CHART -> "Renders" (production details, no performance claims) */
const BARS = [[0.42, 0.62], [0.55, 0.88], [0.92, 0.7], [0.64, 0.8], [0.3, 0.52], [0.48, 0.66], [0.58, 0.6]];
const Perf: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: C.white }} />
    <StatusBar dark />
    <div style={abs(24, 120, ui(13, 400, C.muted2))}>Project</div>
    <div style={abs(24, 148, ui(32, 700))}>Launch film</div>
    <div style={abs(24, 228, ui(15, 600))}>Renders</div>
    <div style={abs(300, 226, { ...ui(12, 500, C.muted), padding: "3px 10px", borderRadius: 10, border: `1px solid ${C.line}` })}>Month</div>
    
    {BARS.map(([a, b], i) => (
      <React.Fragment key={i}>
        <div style={abs(72 + i * 43, 462 - 170 * a, { width: 11, height: 170 * a, borderRadius: 6, background: C.blue })} />
        <div style={abs(87 + i * 43, 462 - 170 * b, { width: 11, height: 170 * b, borderRadius: 6, background: C.ink })} />
        <div style={abs(72 + i * 43, 482, ui(10, 400, C.muted2))}>{["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"][i]}</div>
      </React.Fragment>
    ))}
    <div style={abs(26, 516, { display: "flex", gap: 16, ...ui(11, 400, C.muted) })}>
      <span><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 2, background: C.ink, marginRight: 6 }} />16:9</span>
      <span><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 2, background: C.blue, marginRight: 6 }} />9:16</span>
    </div>
    <div style={abs(24, 568, { width: 162, height: 159, borderRadius: 16, background: C.ink })}>
      <div style={abs(16, 96, ui(12, 400, "rgba(255,255,255,0.7)"))}>Resolution</div>
      <div style={abs(16, 116, ui(19, 600, C.white))}>1080p</div>
    </div>
    <div style={abs(202, 568, { width: 162, height: 159, borderRadius: 16, background: C.blue })}>
      <div style={abs(16, 96, ui(12, 400, "rgba(255,255,255,0.8)"))}>Frame rate</div>
      <div style={abs(16, 116, ui(19, 600, C.white))}>30 fps</div>
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
/** a vanishing 3D tilt (0.15 design px of depth over the whole screen) makes Chrome composite the phone and draw it with
 * subpixel filtering; under a plain 2D translate/scale it snaps text baselines and box edges to whole pixels, so the
 * slowly shrinking screens stepped by 1 px every other frame */
const ANTISNAP = "perspective(2000px) rotateX(0.01deg)";
const Phone: React.FC<{ cx: number; top: number; w: number; i: number }> = ({ cx, top, w, i }) => {
  const S = SCREENS[i], k = w / DW;
  if (cx + w / 2 < -40 || cx - w / 2 > 1960 || top > 1100 || top + DH * k < -40) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: DW, height: DH, transformOrigin: "0 0", transform: `translate(${cx - w / 2}px, ${top}px) ${ANTISNAP} scale(${k})`,
      borderRadius: 0.045 * DW, overflow: "hidden", background: C.white, boxShadow: "0 20px 60px rgba(18,50,120,0.18)" }}>
      <S />
    </div>
  );
};

const BLUR: number[][] = [[645, 0], [646, 0.004], [647, 0.008], [648, 0.018]];
export const Shot3: React.FC<{ g: number }> = ({ g }) => {
  const r = tab(g, PH);
  const [amt] = tab(g, BLUR);
  const outer = (
    <>{[1, 2, 3, 4].map((i) => <Phone key={i} i={i} cx={r[i * 3]} top={r[i * 3 + 1]} w={r[i * 3 + 2]} />)}</>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#8CC4F4" }}>
      <Field grid={fieldAt(BG3, g)} />
      <ZoomBlur amt={amt} n={6} cx={960} cy={470} render={() => outer} />
      <Phone i={0} cx={r[0]} top={r[1]} w={r[2]} />
    </AbsoluteFill>
  );
};
