// Segment 5, shot 4 (frames 649-717): the washed WKC delivery dashboard (three panels) under a slow pull-back, with
// two crisp 3D-tilted "Video Is Ready!" toasts whose bodies type on, the renders chart and the formats pie building
// in (spec/seg5.md §5; toast corners per frame from table T6, mapped with a homography).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, EASE, F, pr } from "./lib";
import { WkcMark } from "./kit";
import { Field, ZoomBlur, fieldAt, tab } from "./seg5_util";
import { BG4 } from "./seg5_data";

/** toast quads per frame: [frame, TL x,y, TR x,y, BL x,y, BR x,y] (T6; clipped corners rebuilt along the measured edges), each
 * coordinate fitted with an expo-out + drift + expo-in curve plus a smoothing spline of the residual: the raw corners
 * carried ±5-15 px of measurement noise (worst on the off-frame corners, which still steer the visible homography).
 * Heavy smoothing on purpose: the resulting toast velocities follow the reference's (tracked) expo-out / glide / expo-in;
 * visible corners stay within ~3 px of T6 at 655 and 690 (up to ~8 px only in the blurred exit, 714+). */
const Q_DARK: number[][] = [
  [649, -470.87, 58.72, 774.02, 74.86, -491.63, 481.28, 774.66, 467.61],
  [650, -398.92, 78.98, 791.74, 94.55, -416.39, 485.21, 795.39, 471.56],
  [651, -345.23, 94.8, 804.51, 110.86, -359.92, 488.66, 808.59, 475.14],
  [652, -303.16, 107.53, 814.44, 124.58, -315.6, 491.68, 818.96, 478.38],
  [653, -268.64, 118.05, 822.64, 136.3, -279.32, 494.32, 827.99, 481.33],
  [654, -239.24, 127, 829.71, 146.44, -248.52, 496.63, 836.13, 484],
  [655, -213.44, 134.77, 835.98, 155.35, -221.61, 498.65, 843.54, 486.42],
  [656, -190.31, 141.66, 841.64, 163.26, -197.58, 500.41, 850.31, 488.62],
  [657, -169.24, 147.85, 846.8, 170.37, -175.77, 501.95, 856.47, 490.61],
  [658, -149.87, 153.48, 851.54, 176.81, -155.78, 503.28, 862.06, 492.41],
  [659, -131.93, 158.65, 855.9, 182.69, -137.32, 504.45, 867.13, 494.04],
  [660, -115.26, 163.42, 859.92, 188.1, -120.22, 505.45, 871.71, 495.53],
  [661, -99.76, 167.86, 863.63, 193.11, -104.34, 506.32, 875.86, 496.89],
  [662, -85.35, 171.99, 867.05, 197.75, -89.61, 507.05, 879.6, 498.14],
  [663, -71.96, 175.85, 870.2, 202.06, -75.95, 507.67, 882.98, 499.29],
  [664, -59.55, 179.47, 873.1, 206.07, -63.29, 508.17, 886.04, 500.34],
  [665, -48.06, 182.87, 875.77, 209.8, -51.58, 508.58, 888.81, 501.33],
  [666, -37.46, 186.07, 878.21, 213.27, -40.78, 508.89, 891.33, 502.24],
  [667, -27.75, 189.08, 880.44, 216.5, -30.88, 509.11, 893.63, 503.11],
  [668, -18.89, 191.91, 882.47, 219.48, -21.84, 509.25, 895.72, 503.93],
  [669, -10.84, 194.58, 884.32, 222.25, -13.62, 509.31, 897.63, 504.73],
  [670, -3.52, 197.08, 886, 224.83, -6.13, 509.32, 899.38, 505.5],
  [671, 3.17, 199.43, 887.53, 227.22, 0.7, 509.28, 900.99, 506.25],
  [672, 9.31, 201.62, 888.94, 229.44, 6.97, 509.21, 902.47, 506.96],
  [673, 14.96, 203.65, 890.23, 231.51, 12.76, 509.14, 903.85, 507.64],
  [674, 20.19, 205.53, 891.42, 233.44, 18.11, 509.1, 905.13, 508.3],
  [675, 25.05, 207.26, 892.52, 235.23, 23.08, 509.09, 906.33, 508.93],
  [676, 29.58, 208.85, 893.54, 236.91, 27.72, 509.13, 907.44, 509.53],
  [677, 33.82, 210.32, 894.49, 238.46, 32.07, 509.21, 908.5, 510.09],
  [678, 37.8, 211.66, 895.36, 239.89, 36.17, 509.34, 909.5, 510.62],
  [679, 41.56, 212.89, 896.17, 241.22, 40.03, 509.52, 910.46, 511.11],
  [680, 45.14, 214, 896.94, 242.45, 43.7, 509.73, 911.4, 511.57],
  [681, 48.56, 215.02, 897.7, 243.59, 47.21, 509.97, 912.32, 511.99],
  [682, 51.85, 215.94, 898.46, 244.67, 50.57, 510.24, 913.25, 512.39],
  [683, 55.04, 216.79, 899.25, 245.68, 53.81, 510.51, 914.19, 512.75],
  [684, 58.17, 217.59, 900.09, 246.64, 56.98, 510.79, 915.16, 513.09],
  [685, 61.26, 218.33, 901, 247.55, 60.1, 511.07, 916.2, 513.41],
  [686, 64.35, 219.05, 902.01, 248.41, 63.21, 511.34, 917.31, 513.72],
  [687, 67.48, 219.75, 903.15, 249.24, 66.34, 511.6, 918.53, 514.01],
  [688, 70.69, 220.45, 904.43, 250.04, 69.53, 511.83, 919.87, 514.3],
  [689, 74.03, 221.16, 905.88, 250.82, 72.84, 512.04, 921.37, 514.59],
  [690, 77.53, 221.88, 907.54, 251.57, 76.28, 512.23, 923.04, 514.89],
  [691, 81.23, 222.64, 909.42, 252.3, 79.93, 512.39, 924.92, 515.2],
  [692, 85.19, 223.43, 911.56, 253.02, 83.81, 512.55, 927.04, 515.51],
  [693, 89.45, 224.26, 913.98, 253.73, 87.98, 512.68, 929.42, 515.84],
  [694, 94.07, 225.12, 916.71, 254.43, 92.49, 512.79, 932.09, 516.16],
  [695, 99.08, 226.03, 919.8, 255.14, 97.38, 512.89, 935.1, 516.47],
  [696, 104.55, 226.99, 923.26, 255.85, 102.71, 512.99, 938.47, 516.78],
  [697, 110.51, 228.02, 927.14, 256.59, 108.54, 513.08, 942.24, 517.07],
  [698, 117.02, 229.12, 931.45, 257.36, 114.93, 513.18, 946.46, 517.35],
  [699, 124.12, 230.29, 936.25, 258.19, 121.92, 513.28, 951.16, 517.59],
  [700, 131.88, 231.55, 941.57, 259.07, 129.58, 513.4, 956.38, 517.8],
  [701, 140.35, 232.9, 947.43, 260.03, 137.95, 513.52, 962.15, 517.98],
  [702, 149.61, 234.34, 953.87, 261.06, 147.09, 513.65, 968.51, 518.13],
  [703, 159.71, 235.87, 960.92, 262.2, 157.06, 513.8, 975.5, 518.26],
  [704, 170.73, 237.5, 968.59, 263.43, 167.92, 513.94, 983.14, 518.36],
  [705, 182.7, 239.26, 976.94, 264.78, 179.7, 514.09, 991.48, 518.44],
  [706, 195.68, 241.17, 985.98, 266.27, 192.47, 514.23, 1000.54, 518.51],
  [707, 209.71, 243.23, 995.74, 267.9, 206.28, 514.36, 1010.36, 518.55],
  [708, 224.83, 245.48, 1006.26, 269.68, 221.17, 514.49, 1020.95, 518.58],
  [709, 241.09, 247.93, 1017.57, 271.63, 237.2, 514.61, 1032.35, 518.59],
  [710, 258.57, 250.59, 1029.7, 273.76, 254.44, 514.72, 1044.56, 518.59],
  [711, 277.44, 253.48, 1042.68, 276.07, 273.02, 514.82, 1057.6, 518.57],
  [712, 298.05, 256.61, 1056.53, 278.59, 293.21, 514.95, 1071.48, 518.54],
  [713, 321.23, 260.04, 1071.3, 281.37, 315.76, 515.15, 1086.2, 518.51],
  [714, 349.01, 264.01, 1087.01, 284.67, 342.57, 515.58, 1101.77, 518.53],
  [715, 386.3, 269.69, 1103.71, 289.53, 378.72, 516.65, 1118.16, 518.81],
  [716, 444.99, 282.45, 1121.43, 300.4, 437.65, 519.33, 1135.1, 520.07],
  [717, 554.1, 327.06, 1140.27, 336.07, 555.1, 526.01, 1143.9, 524.99],
];
const Q_WHITE: number[][] = [
  [649, 1355.89, 706.12, 2586.97, 670.04, 1356, 1136.65, 2610.11, 1148.56],
  [650, 1304.14, 691.11, 2519.73, 676.79, 1297.83, 1116.47, 2539.57, 1137.96],
  [651, 1263.43, 682.16, 2460.65, 676.84, 1254.34, 1100.75, 2477.87, 1127.85],
  [652, 1230.81, 676.46, 2408.39, 675.36, 1220.92, 1087.89, 2423.63, 1118.19],
  [653, 1204.19, 672.55, 2361.89, 673.61, 1194.51, 1076.9, 2375.69, 1108.93],
  [654, 1182.09, 669.61, 2320.28, 671.88, 1173.05, 1067.19, 2333.11, 1100.08],
  [655, 1163.45, 667.22, 2282.87, 670.23, 1155.15, 1058.38, 2295.06, 1091.67],
  [656, 1147.49, 665.16, 2249.08, 668.7, 1139.88, 1050.25, 2260.89, 1083.75],
  [657, 1133.67, 663.3, 2218.44, 667.28, 1126.6, 1042.67, 2230.05, 1076.35],
  [658, 1121.56, 661.6, 2190.57, 665.97, 1114.87, 1035.57, 2202.08, 1069.5],
  [659, 1110.86, 660, 2165.17, 664.77, 1104.4, 1028.92, 2176.63, 1063.19],
  [660, 1101.33, 658.51, 2141.97, 663.66, 1094.97, 1022.68, 2153.42, 1057.43],
  [661, 1092.8, 657.1, 2120.78, 662.64, 1086.43, 1016.83, 2132.19, 1052.18],
  [662, 1085.13, 655.78, 2101.4, 661.71, 1078.66, 1011.38, 2112.76, 1047.42],
  [663, 1078.21, 654.53, 2083.69, 660.85, 1071.57, 1006.31, 2094.96, 1043.12],
  [664, 1071.94, 653.37, 2067.51, 660.07, 1065.09, 1001.6, 2078.64, 1039.24],
  [665, 1066.25, 652.27, 2052.68, 659.35, 1059.16, 997.23, 2063.63, 1035.74],
  [666, 1061.08, 651.26, 2039.07, 658.69, 1053.72, 993.19, 2049.79, 1032.59],
  [667, 1056.37, 650.32, 2026.55, 658.09, 1048.73, 989.44, 2037, 1029.73],
  [668, 1052.08, 649.45, 2015.03, 657.54, 1044.15, 985.97, 2025.15, 1027.14],
  [669, 1048.17, 648.67, 2004.39, 657.03, 1039.94, 982.78, 2014.16, 1024.78],
  [670, 1044.59, 647.96, 1994.56, 656.57, 1036.06, 979.83, 2003.96, 1022.62],
  [671, 1041.3, 647.33, 1985.45, 656.14, 1032.49, 977.12, 1994.46, 1020.63],
  [672, 1038.27, 646.78, 1977, 655.75, 1029.21, 974.64, 1985.62, 1018.78],
  [673, 1035.48, 646.29, 1969.14, 655.39, 1026.17, 972.36, 1977.39, 1017.05],
  [674, 1032.9, 645.88, 1961.84, 655.07, 1023.37, 970.28, 1969.72, 1015.41],
  [675, 1030.51, 645.52, 1955.06, 654.8, 1020.77, 968.38, 1962.59, 1013.86],
  [676, 1028.28, 645.21, 1948.79, 654.57, 1018.37, 966.65, 1955.99, 1012.37],
  [677, 1026.22, 644.94, 1943.01, 654.39, 1016.13, 965.07, 1949.88, 1010.93],
  [678, 1024.3, 644.68, 1937.7, 654.26, 1014.04, 963.64, 1944.25, 1009.52],
  [679, 1022.52, 644.44, 1932.83, 654.18, 1012.08, 962.33, 1939.06, 1008.15],
  [680, 1020.85, 644.21, 1928.33, 654.15, 1010.23, 961.13, 1934.24, 1006.79],
  [681, 1019.26, 643.99, 1924.13, 654.16, 1008.47, 960.03, 1929.73, 1005.44],
  [682, 1017.74, 643.77, 1920.17, 654.2, 1006.78, 959.01, 1925.47, 1004.11],
  [683, 1016.25, 643.57, 1916.39, 654.24, 1005.14, 958.06, 1921.39, 1002.8],
  [684, 1014.77, 643.37, 1912.71, 654.27, 1003.51, 957.18, 1917.43, 1001.54],
  [685, 1013.26, 643.19, 1909.08, 654.27, 1001.89, 956.35, 1913.52, 1000.34],
  [686, 1011.69, 643.02, 1905.44, 654.22, 1000.23, 955.58, 1909.62, 999.21],
  [687, 1010.05, 642.85, 1901.76, 654.13, 998.51, 954.85, 1905.68, 998.15],
  [688, 1008.3, 642.69, 1897.99, 654.02, 996.7, 954.16, 1901.68, 997.16],
  [689, 1006.42, 642.53, 1894.12, 653.87, 994.77, 953.5, 1897.56, 996.23],
  [690, 1004.39, 642.35, 1890.1, 653.71, 992.68, 952.87, 1893.3, 995.35],
  [691, 1002.18, 642.16, 1885.9, 653.54, 990.41, 952.26, 1888.84, 994.52],
  [692, 999.76, 641.96, 1881.47, 653.36, 987.92, 951.65, 1884.15, 993.73],
  [693, 997.09, 641.76, 1876.78, 653.17, 985.18, 951.03, 1879.19, 992.95],
  [694, 994.13, 641.55, 1871.78, 652.97, 982.16, 950.41, 1873.94, 992.17],
  [695, 990.87, 641.35, 1866.42, 652.76, 978.83, 949.75, 1868.36, 991.37],
  [696, 987.25, 641.14, 1860.64, 652.52, 975.16, 949.07, 1862.44, 990.51],
  [697, 983.24, 640.94, 1854.4, 652.26, 971.12, 948.34, 1856.14, 989.55],
  [698, 978.81, 640.74, 1847.65, 651.98, 966.67, 947.56, 1849.44, 988.46],
  [699, 973.93, 640.54, 1840.32, 651.67, 961.78, 946.72, 1842.31, 987.2],
  [700, 968.56, 640.34, 1832.37, 651.34, 956.43, 945.8, 1834.71, 985.75],
  [701, 962.65, 640.13, 1823.72, 650.96, 950.57, 944.79, 1826.58, 984.08],
  [702, 956.17, 639.93, 1814.32, 650.54, 944.19, 943.67, 1817.88, 982.15],
  [703, 949.08, 639.71, 1804.1, 650.06, 937.25, 942.45, 1808.51, 979.95],
  [704, 941.34, 639.49, 1792.98, 649.51, 929.71, 941.09, 1798.39, 977.45],
  [705, 932.93, 639.25, 1780.92, 648.9, 921.54, 939.59, 1787.39, 974.61],
  [706, 923.8, 639, 1767.84, 648.2, 912.71, 937.91, 1775.37, 971.41],
  [707, 913.92, 638.72, 1753.69, 647.43, 903.16, 936.04, 1762.12, 967.8],
  [708, 903.26, 638.41, 1738.43, 646.57, 892.88, 933.95, 1747.37, 963.75],
  [709, 891.79, 638.05, 1721.99, 645.61, 881.83, 931.62, 1730.74, 959.24],
  [710, 879.49, 637.63, 1704.33, 644.57, 869.97, 929.05, 1711.72, 954.25],
  [711, 866.34, 637.11, 1685.34, 643.42, 857.3, 926.22, 1689.58, 948.77],
  [712, 852.32, 636.43, 1664.81, 642.18, 843.78, 923.07, 1663.31, 942.8],
  [713, 837.42, 635.47, 1642.1, 640.83, 829.41, 919.46, 1631.52, 936.38],
  [714, 821.63, 633.96, 1615.47, 639.27, 814.16, 914.88, 1592.23, 929.53],
  [715, 804.94, 631.28, 1579.84, 637.15, 798.03, 907.47, 1542.66, 922.24],
  [716, 787.67, 626.04, 1520.5, 633.03, 781.55, 890.33, 1478.83, 912.69],
  [717, 779.54, 615.05, 1394.85, 620.98, 779.59, 838.01, 1395.07, 849.45],
];
/** centre panel scale about the frame centre (690 = 1): the measured keys of §5.3 fitted in log scale, one value per frame */
const SCALE: number[][] = [
  [649, 1.24524], [650, 1.21811], [651, 1.19804], [652, 1.18150], [653, 1.16698], [654, 1.15400], [655, 1.14248], [656, 1.13234],
  [657, 1.12310], [658, 1.11442], [659, 1.10609], [660, 1.09812], [661, 1.09060], [662, 1.08353], [663, 1.07691], [664, 1.07076],
  [665, 1.06508], [666, 1.05987], [667, 1.05510], [668, 1.05074], [669, 1.04673], [670, 1.04307], [671, 1.03969], [672, 1.03654],
  [673, 1.03354], [674, 1.03064], [675, 1.02775], [676, 1.02484], [677, 1.02196], [678, 1.01918], [679, 1.01656], [680, 1.01419],
  [681, 1.01211], [682, 1.01030], [683, 1.00872], [684, 1.00735], [685, 1.00614], [686, 1.00505], [687, 1.00396], [688, 1.00278],
  [689, 1.00139], [690, 0.99967], [691, 0.99754], [692, 0.99506], [693, 0.99228], [694, 0.98929], [695, 0.98617], [696, 0.98296],
  [697, 0.97967], [698, 0.97626], [699, 0.97272], [700, 0.96903], [701, 0.96516], [702, 0.96107], [703, 0.95675], [704, 0.95214],
  [705, 0.94721], [706, 0.94185], [707, 0.93597], [708, 0.92946], [709, 0.92218], [710, 0.91381], [711, 0.90413], [712, 0.89328],
  [713, 0.88149], [714, 0.86883], [715, 0.85216], [716, 0.81649], [717, 0.71211],
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
                <tspan x={ox + 52 * Math.sin(mid)} dy={5}>{lab}</tspan>
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
        <div style={abs(84, 86, ui(24, 600, C.white))}>Formats</div>
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
        <div style={abs(186, 200, ui(20, 700, "#1E2A3B"))}>GTM film</div>
        <div style={abs(186, 290, ui(13, 600, "#1E2A3B"))}>Project summary</div>
        {["ClearScaler GTM film", "Creoble website film", "Vendom reel", "VoxFlow explainer", "Malaga Hideaway", "Robin Bos explainer"].map((t, i) => (
          <div key={t} style={abs(186, 330 + i * 34, ui(12, 400, "#3A4A60"))}>{t}</div>
        ))}
      </div>
    </div>
  </>
);

/** a vanishing 3D tilt makes Chrome composite the zooming back layers and draw them with subpixel filtering; under a plain
 * 2D scale it snaps text baselines and box edges to whole pixels, so the slow pull-back stepped 0/1/0/1 px per frame */
const ANTISNAP = "perspective(2000px) rotateX(0.01deg)";
export const Shot4: React.FC<{ g: number }> = ({ g }) => {
  const [s] = tab(g, SCALE), [amt] = tab(g, BLUR);
  const ss = Math.pow(s, 0.95);
  const scene = () => (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `${ANTISNAP} scale(${ss})` }}><SidePanels /></div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `${ANTISNAP} scale(${s})` }}><Dashboard g={g} /></div>
      <DarkToast g={g} />
      <WhiteToast g={g} />
    </>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#8CB8F2" }}>
      <Field grid={fieldAt(BG4, g)} />
      <ZoomBlur amt={amt} n={amt > 0.03 ? 14 : 6} soft={amt > 0.03 ? 3 : 0} render={scene} />
    </AbsoluteFill>
  );
};
