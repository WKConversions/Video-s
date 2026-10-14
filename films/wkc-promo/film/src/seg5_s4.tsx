// Segment 5, shot 4 (frames 649-717): the washed WKC delivery dashboard (three panels) under a slow pull-back, with
// two crisp 3D-tilted "Video Is Ready!" toasts whose bodies type on, the renders chart and the formats pie building
// in (spec/seg5.md §5; toast corners per frame from table T6, mapped with a homography).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, EASE, F, pr } from "./lib";
import { WkcMark } from "./kit";
import { Field, ZoomBlur, tab } from "./seg5_util";
import { BG4 } from "./seg5_data";

/** toast quads per frame: [frame, TL x,y, TR x,y, BL x,y, BR x,y] (T6; clipped corners rebuilt along the measured edges) */
const Q_DARK: number[][] = [
  [649, -470.6, 58.9, 774, 75, -491.4, 481.4, 774, 468],
  [650, -405.1, 76.4, 789, 93, -422, 485.3, 792, 470],
  [651, -339.6, 93.9, 804, 111, -352.6, 489.2, 810, 472],
  [652, -307.4, 107.5, 814, 124, -320.1, 491.9, 820, 478],
  [653, -272.1, 118.7, 824, 136, -283.4, 492.7, 831, 482],
  [654, -227.2, 127.6, 834, 148, -238.9, 497.1, 840, 483],
  [655, -213.8, 135.9, 838, 156, -223.4, 498.1, 846, 488],
  [656, -189.8, 141.9, 843, 164, -198.2, 499.9, 852, 490],
  [657, -168.1, 148.4, 846, 170, -173.1, 502, 858, 490],
  [658, -157.8, 154.7, 850, 176, -162.7, 502.3, 862, 494],
  [659, -136.9, 158.8, 855, 182, -141.7, 503.1, 867, 495],
  [660, -112.9, 163.1, 860, 188, -117.3, 505.2, 872, 495],
  [661, -98.5, 168.6, 862, 192, -100.7, 507.3, 876, 495],
  [662, -91.2, 171.7, 866, 196, -94.4, 506.9, 879, 498],
  [663, -58.3, 176.1, 873, 206, -65.2, 507.5, 882, 500],
  [664, -74.7, 177.9, 870, 204, -76.7, 508.5, 884, 502],
  [665, -58.9, 182.4, 873, 208, -61.7, 508.4, 886, 502],
  [666, -26, 185.1, 880, 216, -31.5, 510.3, 890, 502],
  [667, -14.5, 188.5, 882, 219, -19.9, 510.2, 892, 502],
  [668, -9.8, 191.7, 884, 220, -12, 510.1, 897, 502],
  [669, -2.5, 193.9, 885, 222, -4.6, 512.1, 898, 502],
  [670, -9.9, 194.7, 884, 224, -11.2, 512.1, 898, 506],
  [671, 1, 198, 888, 228, -4.2, 512, 898, 508],
  [672, 1, 206, 886, 228, 2.1, 506, 902, 507],
  [673, 12, 204, 890, 231, 10, 508, 903, 508],
  [674, 16, 207, 890, 232, 14, 506, 906, 507],
  [675, 26, 206, 891, 234, 21, 508, 908, 507],
  [676, 28, 208, 894, 237, 26, 507, 906, 512],
  [677, 33, 210, 897, 240, 30, 507, 908, 512],
  [678, 36, 213, 898, 242, 36, 510, 910, 510],
  [679, 42, 213, 898, 242, 40, 510, 912, 510],
  [680, 44, 216, 897, 242, 42, 507, 910, 514],
  [681, 48, 216, 898, 243, 48, 510, 914, 512],
  [682, 52, 216, 897, 243, 52, 512, 915, 512],
  [683, 57, 216, 898, 244, 56, 512, 915, 513],
  [684, 60, 218, 902, 248, 57, 510, 916, 513],
  [685, 63, 218, 902, 248, 60, 510, 915, 516],
  [686, 64, 219, 902, 248, 64, 513, 918, 513],
  [687, 66, 220, 902, 248, 68, 513, 920, 513],
  [688, 72, 219, 903, 249, 70, 513, 920, 514],
  [689, 75, 220, 908, 252, 75, 514, 921, 514],
  [690, 80, 220, 908, 252, 75, 510, 924, 514],
  [691, 82, 222, 909, 252, 80, 512, 926, 514],
  [692, 86, 224, 912, 254, 86, 514, 928, 514],
  [693, 88, 225, 914, 254, 88, 513, 930, 516],
  [694, 92, 228, 916, 255, 94, 514, 932, 518],
  [695, 100, 225, 921, 256, 99, 514, 936, 516],
  [696, 106, 226, 922, 256, 102, 512, 940, 514],
  [697, 111, 228, 928, 258, 108, 512, 942, 518],
  [698, 120, 228, 932, 258, 114, 512, 946, 518],
  [699, 126, 230, 934, 256, 123, 514, 950, 520],
  [700, 134, 231, 939, 258, 129, 512, 956, 519],
  [701, 140, 234, 946, 260, 138, 513, 962, 519],
  [702, 148, 236, 957, 264, 148, 514, 968, 519],
  [703, 154, 240, 958, 261, 156, 513, 976, 516],
  [704, 168, 238, 970, 264, 166, 513, 984, 516],
  [705, 180, 240, 975, 264, 180, 516, 988, 520],
  [706, 195, 240, 987, 267, 190, 514, 998, 520],
  [707, 207, 243, 994, 267, 204, 514, 1010, 518],
  [708, 224, 243, 1005, 268, 219, 514, 1020, 518],
  [709, 240, 246, 1018, 272, 234, 514, 1030, 518],
  [710, 258, 249, 1030, 273, 252, 514, 1042, 518],
  [711, 279, 252, 1041, 273, 273, 516, 1056, 519],
  [712, 302, 255, 1056, 276, 296, 516, 1071, 518],
  [713, 327, 260, 1074, 284, 320, 514, 1086, 519],
  [714, 354, 267, 1089, 288, 351, 518, 1104, 518],
  [715, 388, 276, 1110, 294, 387, 518, 1119, 520],
  [716, 444, 282, 1126, 300, 436, 519, 1138, 520],
  [717, 554, 327, 1138, 336, 555, 526, 1143, 525],
];
const Q_WHITE: number[][] = [
  [649, 1355, 706, 2586.1, 670, 1355.4, 1136.6, 2610.5, 1145.1],
  [650, 1312, 693, 2524.7, 675, 1306.3, 1117, 2542, 1143.2],
  [651, 1269, 680, 2463.3, 680, 1257.2, 1097.4, 2473.5, 1141.3],
  [652, 1234, 675, 2410.1, 676.7, 1221.8, 1086.1, 2419.5, 1131],
  [653, 1204, 672, 2362.2, 675.2, 1191.4, 1076.8, 2370.9, 1122.6],
  [654, 1176, 672, 2316.6, 668.9, 1165.8, 1070.7, 2327.5, 1109.4],
  [655, 1161, 668, 2288, 669.5, 1155, 1062, 2303.2, 1086.1],
  [656, 1143, 668, 2246.9, 668, 1142, 1054, 2266.8, 1074.3],
  [657, 1132, 663, 2221.8, 667.2, 1126, 1044, 2236.3, 1069.2],
  [658, 1122, 660, 2191.9, 665.4, 1113, 1034, 2202.9, 1063.8],
  [659, 1110, 660, 2162.6, 663.9, 1104, 1028, 2176.2, 1059.6],
  [660, 1101, 658, 2142.1, 664.4, 1095, 1022, 2155.5, 1054.2],
  [661, 1092, 657, 2121.6, 663.2, 1088, 1017, 2136.8, 1048.6],
  [662, 1086, 656, 2093, 660.8, 1077, 1008, 2102.5, 1047],
  [663, 1078, 656, 2067.8, 660.7, 1070, 1002, 2077.9, 1041.2],
  [664, 1074, 652, 2069.6, 661.4, 1065, 1000, 2078.8, 1040.4],
  [665, 1068, 652, 2057.8, 659, 1060, 998, 2068, 1035.6],
  [666, 1060, 652, 2043.9, 658.9, 1056, 996, 2058, 1033.2],
  [667, 1056, 651, 2025.7, 657.7, 1050, 990, 2037.3, 1030.9],
  [668, 1053, 650, 2014.3, 657.8, 1044, 986, 2022.7, 1027.4],
  [669, 1048, 648, 2003.4, 657.9, 1041, 982, 2013.6, 1026.4],
  [670, 1048, 645, 2006.6, 657.1, 1036, 980, 2012, 1024.3],
  [671, 1040, 648, 1983.9, 656.6, 1034, 978, 1995, 1021.5],
  [672, 1040, 646, 1978.5, 656.7, 1029, 974, 1984.4, 1019.1],
  [673, 1038, 645, 1979.3, 656.8, 1028, 974, 1986.2, 1019.2],
  [674, 1035, 645, 1962.2, 654.5, 1023, 969, 1966.8, 1016.5],
  [675, 1032, 645, 1959, 654.4, 1022, 969, 1965.7, 1014.3],
  [676, 1029, 645, 1947.5, 654.3, 1018, 966, 1952.9, 1012.7],
  [677, 1024, 646, 1933.7, 654.1, 1016, 964, 1941.9, 1011.2],
  [678, 1020, 648, 1923.9, 652, 1014, 964, 1934, 1010.8],
  [679, 1022, 645, 1929.1, 652.1, 1011, 962, 1934.2, 1010.9],
  [680, 1022, 644, 1934.8, 652.2, 1011, 963, 1940.1, 1009.1],
  [681, 1017, 645, 1923.9, 652, 1008, 962, 1931.1, 1008.7],
  [682, 1017, 644, 1915.6, 652, 1005, 958, 1919.6, 1006.1],
  [683, 1016, 644, 1914.6, 656, 1004, 958, 1918.7, 1004],
  [684, 1016, 642, 1925.9, 658.1, 1005, 960, 1931.5, 1000.6],
  [685, 1014, 642, 1912.7, 661.9, 1000, 956, 1915.4, 991.9],
  [686, 1012, 642, 1905, 654, 999, 954, 1908, 999],
  [687, 1011, 642, 1902, 654, 998, 954, 1905, 998],
  [688, 1010, 642, 1898, 654, 999, 957, 1902, 996],
  [689, 1000, 648, 1894, 654, 993, 951, 1898, 996],
  [690, 1005, 642, 1888, 652, 992, 951, 1894, 994],
  [691, 1002, 642, 1884, 652, 992, 954, 1890, 993],
  [692, 1000, 642, 1880, 652, 988, 952, 1886, 992],
  [693, 996, 642, 1875, 652, 984, 950, 1881, 990],
  [694, 993, 642, 1874, 656, 982, 951, 1875, 990],
  [695, 992, 640, 1864, 652, 980, 951, 1870, 988],
  [696, 988, 640, 1860, 652, 974, 946, 1862, 992],
  [697, 984, 640, 1854, 652, 972, 950, 1856, 990],
  [698, 976, 642, 1846, 651, 966, 946, 1846, 992],
  [699, 972, 642, 1839, 651, 963, 948, 1840, 988],
  [700, 970, 639, 1832, 651, 956, 945, 1836, 982],
  [701, 964, 639, 1821, 650, 950, 944, 1822, 988],
  [702, 956, 640, 1815, 651, 944, 944, 1818, 981],
  [703, 951, 639, 1806, 651, 936, 940, 1809, 978],
  [704, 940, 640, 1794, 650, 928, 939, 1798, 976],
  [705, 933, 639, 1784, 650, 922, 940, 1786, 975],
  [706, 924, 639, 1770, 648, 914, 939, 1774, 972],
  [707, 918, 636, 1755, 646, 904, 938, 1761, 969],
  [708, 903, 639, 1743, 648, 896, 936, 1744, 969],
  [709, 896, 638, 1726, 648, 884, 933, 1730, 963],
  [710, 879, 639, 1707, 645, 870, 928, 1712, 960],
  [711, 868, 638, 1684, 642, 858, 927, 1692, 956],
  [712, 850, 639, 1664, 642, 844, 926, 1670, 950],
  [713, 837, 636, 1636, 640, 830, 921, 1644, 944],
  [714, 820, 634, 1606, 638, 816, 914, 1592, 910],
  [715, 807, 630, 1572, 638, 796, 898, 1550, 886],
  [716, 786, 626, 1522, 633, 780, 891, 1474, 915],
  [717, 780, 615, 1395, 621, 780, 838, 1396, 850],
];
/** centre panel scale about the frame centre (690 = 1) */
const SCALE: number[][] = [
  [649, 1.245], [650, 1.22], [651, 1.197], [652, 1.182], [653, 1.167], [654, 1.154], [655, 1.141], [656, 1.133], [658, 1.115], [660, 1.098],
  [665, 1.065], [670, 1.043], [675, 1.028], [680, 1.014], [685, 1.006], [690, 1], [695, 0.986], [700, 0.969], [704, 0.952], [708, 0.929],
  [710, 0.915], [712, 0.895], [713, 0.881], [714, 0.866], [715, 0.849], [716, 0.818], [717, 0.712],
];
const BLUR: number[][] = [[649, 0.07], [650, 0.016], [651, 0.006], [651.5, 0], [711.5, 0], [712, 0.005], [713, 0.007], [714, 0.01], [715, 0.016], [716, 0.032], [717, 0.11]];
/** characters typed per frame (dark: ease-out to 682; white: linear 3.45/frame to 675) */
const TYPE_D: number[][] = [[649, 3], [650, 10], [651, 15], [652, 21], [653, 28], [654, 33], [655, 37], [656, 40], [657, 43], [658, 46], [659, 47], [660, 50], [661, 51],
  [662, 53], [663, 54], [664, 56], [665, 57], [666, 58], [667, 59], [668, 59], [669, 60], [670, 60], [671, 62], [672, 62], [673, 63], [674, 63], [675, 64], [677, 64],
  [678, 65], [681, 65], [682, 66]];
const TYPE_W: number[][] = [[649, 2], [650, 6], [651, 10], [652, 14], [653, 17], [654, 21], [655, 23], [656, 27], [657, 31], [658, 34], [659, 38], [660, 42], [661, 45],
  [662, 49], [663, 52], [664, 55], [665, 59], [666, 62], [667, 66], [668, 69], [669, 72], [670, 75], [671, 80], [672, 83], [673, 87], [674, 91], [675, 92]];

const ui = (size: number, weight = 400, color: string = C.ink): React.CSSProperties => ({ fontFamily: F.ui, fontSize: size, fontWeight: weight, color, lineHeight: 1.2, whiteSpace: "nowrap" });
const abs = (left: number, top: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

/** CSS matrix3d mapping the rect (0,0)-(w,h) onto the quad TL, TR, BL, BR */
const quad = (q: number[], w: number, h: number) => {
  const [x0, y0, x1, y1, x3, y3, x2, y2] = q; // TL, TR, BL, BR -> 0, 1, 3, 2 (clockwise)
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1, g = (dx3 * dy2 - dx2 * dy3) / den, hh = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
  return `matrix3d(${a / w}, ${d / w}, 0, ${g / w}, ${b / h}, ${e / h}, 0, ${hh / h}, 0, 0, 1, 0, ${x0}, ${y0}, 0, 1)`;
};
const Typed: React.FC<{ lines: string[]; n: number; style: React.CSSProperties; left: number; base: number[] }> = ({ lines, n, style, left, base }) => {
  let used = 0;
  return (
    <>
      {lines.map((l, i) => {
        const k = Math.max(0, Math.min(l.length, n - used));
        used += l.length;
        return (
          <div key={i} style={{ position: "absolute", left, top: base[i], ...style, transform: "translateY(-0.95em)", lineHeight: 1.2 }}>
            <span>{l.slice(0, k)}</span><span style={{ opacity: 0 }}>{l.slice(k)}</span>
          </div>
        );
      })}
    </>
  );
};
const Check: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <div style={abs(x, y, { width: w, height: h, borderRadius: 8, background: C.blue })}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><path d={`M${w * 0.3} ${h * 0.52} L${w * 0.45} ${h * 0.66} L${w * 0.71} ${h * 0.37}`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);
const Close: React.FC<{ x: number; y: number; s: number; c: string }> = ({ x, y, s, c }) => (
  <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={abs(x, y)}><path d={`M1 1 L${s - 1} ${s - 1} M${s - 1} 1 L1 ${s - 1}`} stroke={c} strokeWidth={1.6} strokeLinecap="round" /></svg>
);

const DW = 840, DH = 290, WW = 895, WH = 320;
const DarkToast: React.FC<{ g: number }> = ({ g }) => {
  const q = tab(g, Q_DARK), [n] = tab(g, TYPE_D);
  const lift = q.map((v, i) => (i % 2 ? v + 3 : v));
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: DW, height: DH, transformOrigin: "0 0", transform: quad(lift, DW, DH), borderRadius: 10, background: "#1B2633" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: DW, height: DH, transformOrigin: "0 0", transform: quad(q, DW, DH), borderRadius: 10, background: C.ink, overflow: "hidden" }}>
        <Check x={54} y={64} w={70} h={68} />
        <div style={abs(170, 94.6, { ...ui(43, 600, "#FEFEFF"), transform: "translateY(-0.95em)" })}>Video Is Ready!</div>
        <Typed lines={["Your 16:9 master is rendered. Grab ", "it via the provided link below."]} n={Math.round(n)} left={170} base={[168, 216.5]} style={ui(34, 400, "rgba(254,254,255,0.92)")} />
        <Close x={756} y={66} s={23} c="#9AA1AD" />
      </div>
    </>
  );
};
const WhiteToast: React.FC<{ g: number }> = ({ g }) => {
  const q = tab(g, Q_WHITE), [n] = tab(g, TYPE_W);
  const rim = q.map((v, i) => (i % 2 ? v + 3 : v - 3));
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: WW, height: WH, transformOrigin: "0 0", transform: quad(rim, WW, WH), borderRadius: 12, background: C.blueText }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: WW, height: WH, transformOrigin: "0 0", transform: quad(q, WW, WH), borderRadius: 12, background: C.page, overflow: "hidden" }}>
        <Check x={52} y={57} w={73} h={68} />
        <div style={abs(167, 90, { ...ui(39, 600, C.ink), transform: "translateY(-0.95em)" })}>Video Is Ready!</div>
        <Typed lines={["Need a 1:1 or 9:16 cut for socials? ", "We can export more versions from the ", "same project files."]} n={Math.round(n)} left={170} base={[157, 203.5, 248]}
          style={ui(31, 400, "#2A3139")} />
        <Close x={810} y={61} s={29} c="#A9AFB8" />
      </div>
    </>
  );
};

// ---- the centre dashboard panel (1044 x 954 at frame 690, top-left 432,57) ----
const NAV = ["Projects", "Clients", "Storyboards", "Renders", "Deliveries", "Calendar", "Messages", "Brand kit", "Settings"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const B1 = [0.95, 0.78, 0.78, 1.05, 0.25, 0.85, 0.8], B2 = [0.3, 0.25, 0.6, 0.78, 0.42, 0.5, 0.6];
// pie: [percent, start angle (deg, clockwise from 12 o'clock), sweep, colour, label, pop frame]
const PIE: [number, number, number, string, string, number][] = [
  [30, -72, 108, C.blueText, "9:16", 653], [15, 36, 54, C.ink, "Other", 650], [35, 90, 126, C.blue, "16:9", 659], [20, 216, 72, "#8CC4F4", "1:1", 656],
];
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`;
};
const Card: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; bg?: string }> = ({ x, y, w, h, children, bg = C.white }) => (
  <div style={abs(x, y, { width: w, height: h, borderRadius: 16, background: bg, overflow: "hidden" })}>{children}</div>
);
const Dashboard: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "absolute", left: 432, top: 57, width: 1044, height: 954, borderRadius: 14, background: "rgba(236,242,253,0.80)", overflow: "hidden",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.5), 0 20px 50px rgba(18,50,120,0.12)" }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.64, filter: "blur(0.7px)" }}>
      <div style={abs(0, 0, { width: 232, height: 954, borderRight: `1px solid ${C.line}` })} />
      <div style={abs(0, 92, { width: 1044, height: 1, background: C.line })} />
      <WkcMark w={34} fill={C.blue} style={abs(30, 34)} />
      <div style={abs(74, 30, { fontFamily: F.head, fontWeight: 800, fontSize: 21, letterSpacing: "-0.05em", color: C.ink, lineHeight: "30px" })}>WKConversions</div>
      <div style={abs(262, 28, ui(26, 600, "#1E2A3B"))}>Overview</div>
      <div style={abs(568, 26, { width: 257, height: 40, borderRadius: 20, background: "#EEF3FA", ...ui(13, 400, C.muted2), lineHeight: "40px", paddingLeft: 44 })}>Search projects</div>
      <div style={abs(586, 39, { width: 13, height: 13, borderRadius: 7, border: `2px solid ${C.muted2}` })} />
      {[861, 922].map((x) => <div key={x} style={abs(x - 12, 34, { width: 24, height: 24, borderRadius: 12, background: "#EEF3FA" })} />)}
      <div style={abs(968, 21, { width: 46, height: 46, borderRadius: 23, overflow: "hidden" })}><Img src={staticFile("img/karl-400.webp")} style={{ width: 46, height: 46, objectFit: "cover" }} /></div>
      {NAV.map((t, i) => (
        <React.Fragment key={t}>
          {i === 0 && <div style={abs(0, 106, { width: 5, height: 40, borderRadius: "0 4px 4px 0", background: C.blue })} />}
          <div style={abs(32, 116 + i * 56, { width: 20, height: 20, borderRadius: 6, background: i === 0 ? C.blue : "#C7D2E2" })} />
          <div style={abs(71, 115 + i * 56, ui(17, 500, i === 0 ? C.blue : "#9AA6B8"))}>{t}</div>
        </React.Fragment>
      ))}
      <div style={abs(262, 104, ui(21, 600, "#1E2A3B"))}>Now rendering</div>
      <div style={abs(700, 108, ui(15, 600, "#1E2A3B"))}>See all</div>
      <Card x={262} y={150} w={235} h={157} bg={C.blue}>
        <div style={abs(14, 14, { width: 112, height: 63, borderRadius: 8, overflow: "hidden" })}><Img src={staticFile("clips/clearscaler-16x9.jpg")} style={{ width: 112, height: 63, objectFit: "cover" }} /></div>
        <div style={abs(140, 16, ui(12, 400, "rgba(255,255,255,0.75)"))}>ClearScaler</div>
        <div style={abs(140, 36, ui(15, 600, C.white))}>GTM film 40s</div>
        <div style={abs(140, 58, { ...ui(11, 600, C.white), padding: "2px 8px", borderRadius: 9, background: "rgba(255,255,255,0.2)" })}>16:9</div>
        <div style={abs(14, 100, ui(11, 400, "rgba(255,255,255,0.75)"))}>Rendering</div>
        <div style={abs(14, 122, { width: 207, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.25)" })}><div style={{ width: "65%", height: 6, borderRadius: 3, background: C.white }} /></div>
        <div style={abs(14, 134, ui(11, 500, C.white))}>frame 778 / 1200</div>
      </Card>
      <Card x={525} y={150} w={236} h={164}>
        <div style={abs(18, 16, ui(11, 400, C.muted2))}>Progress</div>
        <div style={abs(18, 32, ui(19, 600, "#1E2A3B"))}>65%</div>
        <div style={abs(170, 22, { ...ui(12, 600, C.blueText), padding: "3px 9px", borderRadius: 10, background: C.blueSoft })}>16:9</div>
        <div style={abs(18, 76, ui(10, 500, C.muted2))}>CLIENT</div><div style={abs(18, 92, ui(13, 500, "#1E2A3B"))}>ClearScaler</div>
        <div style={abs(130, 76, ui(10, 500, C.muted2))}>LENGTH</div><div style={abs(130, 92, ui(13, 500, "#1E2A3B"))}>0:40</div>
        <div style={abs(18, 130, ui(14, 500, "#1E2A3B"))}>1920 x 1080 · 30 fps</div>
      </Card>
      <div style={abs(784, 104, ui(21, 600, "#1E2A3B"))}>Recent deliveries</div>
      {([["Creoble", "Social cut", "9:16", "clips/creoble-lovable-1x1.jpg"], ["Vendom", "Reel", "9:16", "clips/vendom-1x1.jpg"], ["VoxFlow", "Explainer", "16:9", "clips/voxflow-16x9.jpg"]] as string[][]).map(([n, k, f, src], i) => (
        <React.Fragment key={n}>
          <div style={abs(796, 158 + i * 53, { width: 42, height: 42, borderRadius: 21, overflow: "hidden" })}><Img src={staticFile(src)} style={{ width: 42, height: 42, objectFit: "cover" }} /></div>
          <div style={abs(848, 160 + i * 53, ui(15, 500, "#1E2A3B"))}>{n}</div>
          <div style={abs(848, 181 + i * 53, ui(12, 400, C.muted2))}>{k} · delivered</div>
          <div style={abs(974, 168 + i * 53, ui(13, 600, C.blue))}>{f}</div>
        </React.Fragment>
      ))}
      <Card x={262} y={372} w={490} h={260}>
        <div style={abs(16, 14, ui(16, 600, "#1E2A3B"))}>Renders this week</div>
        <div style={abs(292, 26, { display: "flex", gap: 18, ...ui(13, 400, C.muted) })}>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 5, background: C.blue, marginRight: 7 }} />Masters</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 5, background: "#8CC4F4", marginRight: 7 }} />Cut-downs</span>
        </div>
        {["40", "30", "20", "10", "0"].map((t, i) => <div key={t} style={abs(26, 79 + i * 33.7, { ...ui(11, 400, C.muted2), width: 20, textAlign: "right" })}>{t}</div>)}
        {DAYS.map((d, i) => {
          const p = pr(g, 650 + 3.3 * i, 8, EASE);
          return (
            <React.Fragment key={d}>
              <div style={abs(70 + i * 60, 221 - 135 * B1[i] * p, { width: 13, height: 135 * B1[i] * p, borderRadius: "7px 7px 0 0", background: C.blue })} />
              <div style={abs(96 + i * 60, 221 - 135 * B2[i] * p, { width: 13, height: 135 * B2[i] * p, borderRadius: "7px 7px 0 0", background: "#8CC4F4" })} />
              <div style={abs(70 + i * 60, 236, { ...ui(12, 400, C.muted2), width: 40, textAlign: "center" })}>{d}</div>
            </React.Fragment>
          );
        })}
      </Card>
      <div style={abs(784, 337, ui(21, 600, "#1E2A3B"))}>Formats delivered</div>
      <svg width={260} height={230} viewBox="0 0 260 230" style={abs(760, 384)}>
        {PIE.map(([pc, a0, sw, col, lab, f0]) => {
          const k = pr(g, f0, 4, EASE), mid = ((a0 + sw / 2) * Math.PI) / 180, ox = 129 + 6 * Math.sin(mid), oy = 120 - 6 * Math.cos(mid);
          if (k <= 0) return null;
          return (
            <g key={lab} transform={`translate(${ox} ${oy}) scale(${k}) translate(${-ox} ${-oy})`}>
              <path d={arc(ox, oy, 86, a0, a0 + sw)} fill={col} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
              <text x={ox + 52 * Math.sin(mid)} y={oy - 52 * Math.cos(mid)} textAnchor="middle" fontFamily={F.ui} fontWeight={700} fontSize={13} fill={col === "#8CC4F4" ? C.ink : "#fff"}>
                <tspan x={ox + 52 * Math.sin(mid)} dy={-2}>{pc}%</tspan><tspan x={ox + 52 * Math.sin(mid)} dy={15} fontWeight={500} fontSize={11}>{lab}</tspan>
              </text>
            </g>
          );
        })}
      </svg>
      <div style={abs(262, 662, ui(21, 600, "#1E2A3B"))}>Team</div>
      {([["Raphael Wind", "Founder", "img/raphael-400.webp"], ["Karl van Kessel", "Founder", "img/karl-400.webp"]] as string[][]).map(([n, r, src], i) => (
        <React.Fragment key={n}>
          <div style={abs(281 + i * 100, 738, { width: 52, height: 52, borderRadius: 26, overflow: "hidden" })}><Img src={staticFile(src)} style={{ width: 52, height: 52, objectFit: "cover" }} /></div>
          <div style={abs(257 + i * 100, 797, { ...ui(13, 600, "#1E2A3B"), width: 100, textAlign: "center" })}>{n}</div>
          <div style={abs(257 + i * 100, 816, { ...ui(12, 400, C.blue), width: 100, textAlign: "center" })}>{r}</div>
        </React.Fragment>
      ))}
      <div style={abs(481, 738, { width: 52, height: 52, borderRadius: 26, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" })}><WkcMark w={32} fill={C.white} /></div>
      <div style={abs(457, 797, { ...ui(13, 600, "#1E2A3B"), width: 100, textAlign: "center" })}>WKC</div>
      <div style={abs(457, 816, { ...ui(12, 400, C.blue), width: 100, textAlign: "center" })}>Studio</div>
      <div style={abs(300, 870, ui(13, 400, C.muted2))}>Add a note</div>
      <div style={abs(380, 859, { width: 64, height: 38, borderRadius: 19, background: "#EEF3FA" })} />
      <div style={abs(445, 859, { width: 103, height: 38, borderRadius: 19, background: C.blue, textAlign: "center", ...ui(15, 600, C.white), lineHeight: "38px" })}>Share</div>
      <Card x={568} y={650} w={450} h={280}>
        <div style={abs(18, 14, ui(16, 600, "#1E2A3B"))}>Delivery history</div>
        <svg width={420} height={200} viewBox="0 0 420 200" style={abs(18, 56)}>
          <path d="M0 150 C40 120 60 140 100 110 S170 60 210 90 S280 140 320 70 S390 40 420 30 L420 200 L0 200 Z" fill="rgba(63,140,232,0.14)" />
          <path d="M0 150 C40 120 60 140 100 110 S170 60 210 90 S280 140 320 70 S390 40 420 30" fill="none" stroke={C.blue} strokeWidth={3} />
        </svg>
      </Card>
    </div>
  </div>
);

/** left: an ink analytics card ("Views"), right: the WKC sidebar; both washed like the reference's side panels */
const SidePanels: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: -60, top: 174, width: 387, height: 692, borderRadius: 14, background: "rgba(5,15,25,0.62)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.7 }}>
        <div style={abs(250, 26, { width: 26, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.3)" })} />
        <div style={abs(300, 26, { width: 26, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.45)" })} />
        <div style={abs(84, 86, ui(24, 600, C.white))}>Views</div>
        <div style={abs(84, 118, ui(13, 400, "rgba(255,255,255,0.7)"))}>All channels</div>
        {["16:9", "1:1", "9:16", "GIF"].map((t, i) => <div key={t} style={abs(84, 230 + i * 44, { ...ui(12, 600, C.white), padding: "4px 10px", borderRadius: 10, background: "rgba(63,140,232,0.45)" })}>{t}</div>)}
        <div style={abs(180, 340, ui(12, 400, "rgba(255,255,255,0.7)"))}>Last month</div>
        <div style={abs(280, 340, ui(12, 400, "rgba(255,255,255,0.7)"))}>This month</div>
        <svg width={387} height={200} viewBox="0 0 387 200" style={abs(0, 420)}>
          <path d="M60 140 L80 120 L95 128 L112 92 L128 104 L146 70 L160 96 L178 84 L196 112 L212 88 L230 120 L248 96 L266 128 L284 104 L302 138 L320 110 L338 130 L360 100 L387 120 L387 200 L60 200 Z" fill="rgba(255,255,255,0.22)" />
          <path d="M60 140 L80 120 L95 128 L112 92 L128 104 L146 70 L160 96 L178 84 L196 112 L212 88 L230 120 L248 96 L266 128 L284 104 L302 138 L320 110 L338 130 L360 100 L387 120" fill="none" stroke="#fff" strokeWidth={2.5} />
        </svg>
        {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => <div key={m} style={abs(66 + i * 34, 640, ui(11, 400, "rgba(255,255,255,0.7)"))}>{m}</div>)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 1598, top: 175, width: 392, height: 725, borderRadius: 14, overflow: "hidden", background: "rgba(205,222,245,0.78)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 167, height: 725, background: "rgba(5,15,25,0.72)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.75 }}>
        <WkcMark w={26} fill={C.white} style={abs(18, 24)} />
        <div style={abs(52, 25, ui(15, 600, C.white))}>WKC</div>
        <div style={abs(20, 86, { width: 128, height: 34, borderRadius: 17, background: C.blue, ...ui(12, 600, C.white), lineHeight: "34px", textAlign: "center" })}>New project</div>
        {["Projects", "Clients", "Renders", "Storyboards", "Deliveries", "Team", "Brand kit", "Settings"].map((t, i) => (
          <React.Fragment key={t}>
            <div style={abs(22, 166 + i * 40, { width: 14, height: 14, borderRadius: 4, background: i === 0 ? C.blue : "rgba(255,255,255,0.45)" })} />
            <div style={abs(46, 164 + i * 40, ui(12.5, 500, i === 0 ? "#8DC0FF" : "rgba(255,255,255,0.8)"))}>{t}</div>
          </React.Fragment>
        ))}
        <div style={abs(186, 20, ui(20, 600, "#1E2A3B"))}>Projects</div>
        <div style={abs(186, 78, ui(13, 500, "#3A4A60"))}>Overview</div>
        <div style={abs(186, 130, { width: 34, height: 34, borderRadius: 17, background: C.blue, opacity: 0.6 })} />
        <div style={abs(186, 180, ui(12, 400, "#3A4A60"))}>In production</div>
        <div style={abs(186, 200, ui(20, 700, "#1E2A3B"))}>5 films</div>
        <div style={abs(186, 290, ui(13, 600, "#1E2A3B"))}>Project summary</div>
        {["ClearScaler GTM film", "Creoble website film", "Vendom reel", "VoxFlow explainer", "Malaga Hideaway", "Robin Bos explainer"].map((t, i) => (
          <div key={t} style={abs(186, 330 + i * 34, ui(12, 400, "#3A4A60"))}>{t}</div>
        ))}
      </div>
    </div>
  </>
);

export const Shot4: React.FC<{ g: number }> = ({ g }) => {
  const [s] = tab(g, SCALE), [amt] = tab(g, BLUR);
  const ss = Math.pow(s, 0.95);
  let k = 0;
  while (k < BG4.length - 2 && BG4[k + 1][0] <= g) k++;
  const [fa, a] = BG4[k], [fb, b] = BG4[Math.min(k + 1, BG4.length - 1)];
  const scene = () => (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${ss})` }}><SidePanels /></div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${s})` }}><Dashboard g={g} /></div>
      <DarkToast g={g} />
      <WhiteToast g={g} />
    </>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#8CB8F2" }}>
      <Field a={a} b={b} t={fb > fa ? Math.min(1, Math.max(0, (g - fa) / (fb - fa))) : 0} />
      <ZoomBlur amt={amt} n={amt > 0.03 ? 14 : 6} soft={amt > 0.03 ? 3 : 0} render={scene} />
    </AbsoluteFill>
  );
};
