// R07 artwork: the Bookings product as pencil sketch, notes, technical sheet, wireframe and finished screen.
// All drawn in the reference's 1280 x 720 space and scaled 1.5 into the 1920 x 1080 film.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, abs } from "../kit";

export const Wrap: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: "scale(1.5)", transformOrigin: "0 0", fontFamily: F, ...style }}>{children}</div>
);
const HAND = "Caveat, cursive";

// ---- the phone's screen, as strokes in local 0..200 x 0..350 (shared by every drawing)
const ScreenLines: React.FC = () => (
  <g>
    <rect x="14" y="30" width="172" height="26" rx="6" /><path d="M24 43h60" />
    {[0, 1, 2].map((i) => <rect key={i} x={14 + i * 59} y="68" width="52" height="40" rx="8" />)}
    <rect x="14" y="120" width="172" height="34" rx="8" /><path d="M96 130v14M89 137h14" />
    {[0, 1, 2].map((i) => [0, 1].map((j) => <rect key={i + "" + j} x={14 + i * 59} y={168 + j * 36} width="52" height="28" rx="7" />))}
    <rect x="22" y="258" width="156" height="34" rx="17" /><path d="M72 275l10 9 22-20" />
    <path d="M14 308h172" />
  </g>
);
const Phone: React.FC<{ x: number; y: number; s?: number; sw?: number }> = ({ x, y, s = 1, sw = 1.6 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeWidth={sw}>
    <rect x="0" y="0" width="200" height="350" rx="30" /><rect x="8" y="8" width="184" height="334" rx="24" /><rect x="76" y="14" width="48" height="8" rx="4" />
    <ScreenLines />
  </g>
);
const Table: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g><ellipse cx={cx} cy={cy} rx="150" ry="30" /><ellipse cx={cx} cy={cy + 10} rx="150" ry="30" /><path d={`M${cx - 150} ${cy}v10M${cx + 150} ${cy}v10`} /><path d={`M${cx - 110} ${cy + 36}v60M${cx + 110} ${cy + 36}v60M${cx - 40} ${cy + 40}v56M${cx + 40} ${cy + 40}v56`} />
    <ellipse cx={cx - 170} cy={cy + 70} rx="28" ry="9" /><path d={`M${cx - 198} ${cy + 70}v40M${cx - 142} ${cy + 70}v40`} /><ellipse cx={cx + 170} cy={cy + 70} rx="28" ry="9" /><path d={`M${cx + 142} ${cy + 70}v40M${cx + 198} ${cy + 70}v40`} /></g>
);
const Hatch: React.FC<{ x: number; y: number; w: number; h: number; gap?: number }> = ({ x, y, w, h, gap = 7 }) => (
  <path d={Array.from({ length: Math.floor((w + h) / gap) }, (_, i) => { const d = i * gap; return `M${x + Math.min(d, w)} ${y + Math.max(0, d - w)}L${x + Math.max(0, d - h)} ${y + Math.min(d, h)}`; }).join("")} strokeWidth=".6" opacity=".6" />
);
const T: React.FC<{ x: number; y: number; s?: number; r?: number; children: string; w?: number; c?: string; anchor?: "start" | "middle" | "end" }> = ({ x, y, s = 17, r = 0, children, w = 400, c = "#3A3D42", anchor = "start" }) => (
  <text x={x} y={y} fontFamily={HAND} fontWeight={Math.max(500, w)} fontSize={s * 1.28} fill={c} stroke="none" textAnchor={anchor} transform={`rotate(${r} ${x} ${y})`}>{children}</text>
);

// ================= U1 / U2a: the pencil sketch. `dense` = the second picture, darker paper and more notes
export const PencilSketch: React.FC<{ dense?: boolean }> = ({ dense }) => {
  const paper = dense ? "#D6D6D4" : "#EEEEEC", ink = dense ? "#3E4146" : "#9EA1A4", o = dense ? 1 : 0.7;
  return (
    <Wrap>
      <svg width="1280" height="720" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id={`r07pn${dense ? 1 : 0}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" /><feColorMatrix in="n" type="matrix" values={`0 0 0 0 .3  0 0 0 0 .3  0 0 0 0 .3  0 0 0 ${dense ? 0.16 : 0.06} 0`} /></filter>
          <filter id={`r07pw${dense ? 1 : 0}`}><feTurbulence baseFrequency="0.03" numOctaves="2" seed="9" /><feDisplacementMap in="SourceGraphic" scale="3.2" /></filter>
          <linearGradient id="r07shade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /></linearGradient>
        </defs>
        <rect width="1280" height="720" fill={paper} /><rect width="1280" height="720" filter={`url(#r07pn${dense ? 1 : 0})`} /><rect width="1280" height="720" fill="url(#r07shade)" />
        <path d="M636 0V720" stroke="#000" strokeOpacity=".05" />
        {!dense && <rect x="1090" y="150" width="190" height="570" fill="#E7EAE0" opacity=".9" />}
        <g filter={`url(#r07pw${dense ? 1 : 0})`} fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round" opacity={o}>
          <g transform="translate(640 340) scale(1.22) translate(-648 -340)"><Phone x={548} y={160} s={1.0} sw={dense ? 2 : 1.7} /><Table cx={648} cy={540} /><Hatch x={738} y={190} w={10} h={300} gap={6} /></g>
          <path d="M470 250C520 215 560 200 560 200M470 250l22-4M470 250l8 18" />
          {/* notes, left */}
          <T x={110} y={106} s={26} w={500}>Bookings</T><path d="M108 116h130" strokeWidth="2" />
          <T x={60} y={190} s={19}>- pick a day</T><T x={60} y={222} s={19}>- pick a time</T><T x={60} y={254} s={19}>- party size</T><T x={60} y={286} s={19}>- confirm</T><T x={60} y={318} s={19}>- reminder</T>
          {/* notes, top and right */}
          <T x={310} y={80} s={17}>SCREEN SETTINGS</T><T x={306} y={112} s={15}>Slot length: 90 min</T><T x={306} y={140} s={15}>Hold table: 15 min</T><T x={306} y={168} s={15}>Max party: 8</T>
          <path d="M770 300C790 250 880 262 940 280C980 330 940 390 860 400C790 400 760 350 770 300z" /><T x={790} y={322} s={22} r={-4}>book in</T><T x={800} y={358} s={26} r={-4}>2 taps!</T>
          <path d="M960 200l40-60 40 30 50-40 60 10M1000 250v160M1060 200v210" /><rect x="1010" y="330" width="80" height="60" /><path d="M1000 410h200" />
          {/* list, bottom right */}
          {Array.from({ length: 11 }, (_, i) => <g key={i}><path d={`M940 ${468 + i * 20}h280`} strokeWidth=".8" /><T x={950} y={466 + i * 20} s={13}>{["1 Home", "2 Pick a day", "3 Pick a time", "4 Party size", "5 Table notes", "6 Confirm", "7 Reminder", "8 Change booking", "9 Cancel", "10 Waitlist", "11 Reviews"][i]}</T></g>)}
          <T x={840} y={520} s={26} r={-6}>X +</T><path d="M906 520l24 6" />
          {/* left bottom */}
          <ellipse cx="160" cy="580" rx="115" ry="22" /><T x={90} y={585} s={15}>No-show rules</T>
          <T x={74} y={616} s={14}>✓ reminder the day before</T><T x={74} y={642} s={14}>✓ optional deposit</T><T x={74} y={668} s={14}>✓ waitlist fills gaps</T>
          <circle cx="110" cy="410" r="52" /><circle cx="110" cy="410" r="30" /><path d="M140 410h60" />
          {dense && <>
            <ellipse cx="470" cy="340" rx="60" ry="90" transform="rotate(30 470 340)" /><T x={455} y={330} s={13}>Mon-Sun</T><T x={455} y={352} s={13}>12:00-23:00</T>
            <path d="M410 440l70-36M410 440l24-4M410 440l10 20" /><T x={230} y={500} s={24} r={-4}>main tap</T><T x={270} y={532} s={24} r={-4}>point</T>
            <path d="M560 600c30 20 100 20 130 0" /><T x={880} y={640} s={13}>2 taps. one confirmation.</T>
          </>}
        </g>
      </svg>
    </Wrap>
  );
};

// ================= U2b: the technical sheet
const NAMES = [["Home", "Landing with tonight's free tables"], ["Pick a day", "Seven days, today first"], ["Pick a time", "Free slots as chips"], ["Party size", "Stepper, 1 to 8 guests"], ["Table notes", "Allergies, high chair"], ["Confirm", "One tap, one screen"], ["Reminder", "Message the day before"], ["Change booking", "Move date or time"], ["Cancel", "Frees the table at once"], ["Waitlist", "Fills last-minute gaps"], ["Reviews", "Rating after the visit"], ["Host view", "Tonight's tables on one screen"], ["Settings", "Opening hours and slot length"]];
const PARTS = (i: number) => {
  const k = i % 6;
  return k === 0 ? <><rect x="2" y="14" width="40" height="22" rx="11" /><path d="M10 25h24" /></> : k === 1 ? <><rect x="2" y="6" width="40" height="30" rx="6" /><path d="M2 16h40M10 26h12" /></> : k === 2 ? <><circle cx="22" cy="21" r="16" /><path d="M22 10v11l8 5" /></> : k === 3 ? <><rect x="2" y="12" width="40" height="18" rx="5" /><path d="M12 21h6M30 21h6M33 18v6" /></> : k === 4 ? <><path d="M2 36h40M8 36V18M18 36V8M28 36V22M38 36V14" /></> : <><rect x="10" y="2" width="24" height="38" rx="6" /><path d="M16 12h12M16 20h12" /></>;
};
export const TechSheet: React.FC = () => {
  const L = "#2A2D31", sub = "#9A9DA1";
  return (
    <Wrap>
      <svg width="1280" height="720" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><filter id="r07tn"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" /><feColorMatrix type="matrix" values="0 0 0 0 .3  0 0 0 0 .3  0 0 0 0 .3  0 0 0 .07 0" /></filter><radialGradient id="r07tv" cx=".5" cy=".5" r=".75"><stop offset=".55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".22" /></radialGradient><linearGradient id="r07tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".6" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
        <rect width="1280" height="720" fill="#D8D8D6" /><rect width="1280" height="720" filter="url(#r07tn)" /><rect width="1280" height="720" fill="url(#r07tg)" /><rect width="1280" height="720" fill="url(#r07tv)" /><path d="M0 0H1280V14H0zM0 706H1280V720H0z" fill="#000" opacity=".05" /><path d="M0 0H12V720H0z" fill="#fff" opacity=".35" />
        <g fill="none" stroke={L} strokeWidth="1.2" strokeLinejoin="round">
          <path d="M26 30v-12h12M1254 30v-12h-12M26 690v12h12M1254 690v12h-12" />
          <rect x="581" y="34" width="102" height="20" /><rect x="694" y="34" width="62" height="20" /><rect x="563" y="61" width="108" height="20" /><rect x="680" y="61" width="96" height="20" />
          {/* 01 list */}
          {NAMES.map((n, i) => <g key={i}><circle cx="51" cy={107 + i * 24.7} r="8" /><path d={`M42 ${118 + i * 24.7}H365`} stroke="#B8B9B8" strokeWidth=".8" /></g>)}
          {/* 02 floor plans */}
          <circle cx="116" cy="560" r="26" /><circle cx="116" cy="560" r="14" /><circle cx="184" cy="560" r="30" /><circle cx="184" cy="560" r="6" /><rect x="214" y="535" width="46" height="50" rx="6" /><rect x="222" y="543" width="30" height="34" rx="4" /><rect x="270" y="518" width="56" height="64" rx="8" /><path d="M280 530h36M280 548h36M280 566h36" />
          {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={104 + i * 16} cy="618" rx="26" ry="10" />)}
          {/* centre phone */}<g transform="translate(620 330) scale(1.22) translate(-620 -330)">
          <g transform="translate(520 150) scale(.55)" strokeWidth="2"><rect x="0" y="0" width="200" height="350" rx="30" /><rect x="8" y="8" width="184" height="334" rx="24" /><ScreenLines /></g>
          <g transform="translate(540 168) scale(.55)" strokeWidth="2" opacity="0"><rect width="1" height="1" /></g>
          <path d="M530 400L520 418M630 400L640 418M520 418h120" /><ellipse cx="580" cy="460" rx="70" ry="22" /><path d="M510 460v34l70 24 70-24v-34" />
          {[[622, 160, 7, 600, 190], [738, 222, 6, 650, 240], [758, 314, 5, 650, 310], [718, 342, 4, 650, 350], [744, 418, 2, 650, 430], [772, 514, 1, 650, 480], [575, 295, 8, 560, 290]].map(([cx, cy, , lx, ly], i) => <g key={i}><circle cx={cx} cy={cy} r="10" fill="#E9E9E7" /><path d={`M${lx} ${ly}L${cx - 10} ${cy}`} strokeWidth=".9" /></g>)}</g>
          {/* 04 parts */}
          {Array.from({ length: 13 }, (_, i) => { const col = i < 5 ? i : i < 10 ? i - 5 : i - 10, row = i < 5 ? 0 : i < 10 ? 1 : 2; return <g key={i} transform={`translate(${852 + col * 74} ${118 + row * 70})`}>{PARTS(i)}</g>; })}
          <rect x="1082" y="268" width="141" height="46" rx="6" strokeDasharray="2 3" strokeWidth=".8" />
          {/* 05 table */}
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M1028 ${487 + i * 34.4}H1222`} stroke="#B8B9B8" strokeWidth=".8" />)}
          <path d="M910 540v70M890 618h56M910 540l-12-20M922 560l12-24" strokeWidth="1.4" /><ellipse cx="910" cy="622" rx="36" ry="9" />
          {/* 03 flow */}
          {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={458 + (i % 3) * 118} cy={594 + Math.floor(i / 3) * 37} r="8" />)}
        </g>
        <g fill={L} fontFamily={F} fontWeight={600} letterSpacing=".2">
          <text x="44" y="68" fontSize="14" fontWeight="500">01</text><text x="68" y="66" fontSize="7.5">SCREEN INVENTORY</text><text x="188" y="66" fontSize="7.5" fontWeight="500">ONE SCREEN PER STEP, NO DETOURS</text>
          <text x="44" y="464" fontSize="14" fontWeight="500">02</text><text x="68" y="462" fontSize="7.5">TABLE LAYOUTS</text><text x="358" y="462" fontSize="7.5" fontWeight="500" textAnchor="end">PER ROOM</text>
          <text x="425" y="574" fontSize="12" fontWeight="500">03</text><text x="458" y="572" fontSize="7.5">BOOKING FLOW</text><text x="797" y="572" fontSize="7" fontWeight="500" textAnchor="end">9 STEPS</text>
          <text x="864" y="82" fontSize="14" fontWeight="500">04</text><text x="900" y="80" fontSize="7.5">COMPONENTS</text><text x="1224" y="80" fontSize="7.5" fontWeight="500" textAnchor="end">13 UNIQUE</text>
          <text x="855" y="472" fontSize="12" fontWeight="500">05</text><text x="888" y="471" fontSize="7.5">TIMINGS</text>
          <text x="632" y="48" fontSize="8" textAnchor="middle">6 SCREENS</text><text x="725" y="48" fontSize="8" textAnchor="middle">2 TAPS</text><text x="617" y="75" fontSize="8" textAnchor="middle">MOBILE + WEB</text><text x="728" y="75" fontSize="8" textAnchor="middle">REV A - 2026</text>
          {NAMES.map((n, i) => <g key={i}><text x="51" y={110 + i * 24.7} fontSize="6.5" textAnchor="middle" fontWeight="500">{String(i + 1).padStart(2, "0")}</text><text x="68" y={110 + i * 24.7} fontSize="8.3">{n[0]}</text><text x="188" y={110 + i * 24.7} fontSize="8.3" fontWeight="500" fill={sub}>{n[1]}</text></g>)}
          {["MDF 3mm", "MDF 6mm"].map((s, i) => <text key={i} x={111 + i * 182} y="650" fontSize="8">{s}</text>)}
          {[["Material", "[wood/steel]"], ["Slot length", "[90 min]"], ["Walls", "[n] / [%]"], ["Seats", "[where]"], ["Hold time", "[min]"]].map((m, i) => <g key={i}><text x={878 + i * 62} y="361" fontSize="7.5" fontWeight="500" textAnchor="middle" fill="#55595F">{m[0]}</text><text x={878 + i * 62} y="381" fontSize="7.5" textAnchor="middle">{m[1]}</text></g>)}
          {["Wrist base", "Yaw housing", "Pitch bracket", "Finger MCP", "Finger DIP", "Thumb CMC", "Thumb IP", "Wire servos", "Calibrate"].map((_, i) => null)}
          {["Pick a day", "Pick a time", "Party size", "Table notes", "Confirm", "Reminder", "Change", "Cancel", "Review"].map((s, i) => <g key={i}><text x={458 + (i % 3) * 118} y={597 + Math.floor(i / 3) * 37} fontSize="6.5" textAnchor="middle" fontWeight="500">{i + 1}</text><text x={474 + (i % 3) * 118} y={596 + Math.floor(i / 3) * 37} fontSize="8">{s}</text><text x={474 + (i % 3) * 118} y={606 + Math.floor(i / 3) * 37} fontSize="7" fontWeight="500" fill={sub}>{["tap day", "tap slot", "stepper", "optional", "one tap", "day before", "any time", "frees table", "after visit"][i]}</text></g>)}
          {[["Hold table", "[min]"], ["Reminder sent", "[h]"], ["Late arrival", "[min]"], ["Slot length", "[min]"], ["Waitlist ping", "[s]"], ["Review ask", "[h]"]].map((m, i) => <g key={i}><text x="1030" y={508 + i * 34.4} fontSize="7.5" fontWeight="500" fill={sub}>{m[0]}</text><text x="1218" y={504 + i * 34.4} fontSize="7" textAnchor="end" fill={sub}>{m[1]}</text></g>)}
          <text x="1082" y="286" fontSize="6.8" fontWeight="500" fill={sub}>Chips 09 and 10 are a pair</text><text x="1082" y="297" fontSize="6.8" fontWeight="500" fill={sub}>- check one of each. 11-13 optional.</text>
          <g transform="translate(620 330) scale(1.22) translate(-620 -330)">{[["1", 772, 518], ["2", 744, 422], ["3", 718, 346], ["4", 758, 318], ["5", 738, 226], ["6", 622, 164], ["7", 575, 299]].map(([s, x, y], i) => <text key={i} x={x as number} y={(y as number) + 3} fontSize="9" textAnchor="middle" fontWeight="600">{s}</text>)}</g>
        </g>
      </svg>
    </Wrap>
  );
};

// ================= U3: the wireframe
export const WireFrame: React.FC<{ dim?: boolean }> = () => {
  const L = "#2E3136", G = "#E3E4E4";
  const lab = (x: number, y: number, t: string, s = 10, w = 500, c = L, a: "start" | "middle" | "end" = "start") => <text key={t + x + y} x={x} y={y} fontSize={s} fontWeight={w} fill={c} textAnchor={a} fontFamily={F} letterSpacing=".3">{t}</text>;
  return (
    <Wrap>
      <svg width="1280" height="720" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><filter id="r07wn"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="6" /><feColorMatrix type="matrix" values="0 0 0 0 .3  0 0 0 0 .3  0 0 0 0 .3  0 0 0 .05 0" /></filter></defs>
        <rect width="1280" height="720" fill="#F1F1F0" /><rect width="1280" height="720" filter="url(#r07wn)" />
        <g fill="none" stroke="#C9CACA" strokeWidth="1">
          <rect x="20" y="69" width="244" height="234" /><rect x="20" y="323" width="244" height="374" /><rect x="285" y="69" width="707" height="493" /><rect x="285" y="570" width="344" height="127" /><rect x="650" y="570" width="341" height="127" /><rect x="1015" y="69" width="244" height="276" /><rect x="1015" y="366" width="244" height="331" />
        </g>
        <circle cx="45" cy="35" r="19" fill="#2B2E33" /><rect x="490" y="26" width="67" height="30" fill={G} /><rect x="567" y="26" width="67" height="30" fill={G} /><rect x="644" y="26" width="67" height="30" fill={G} /><rect x="722" y="26" width="67" height="30" fill={G} /><rect x="1124" y="26" width="135" height="30" fill="#2B2E33" />
        {lab(523, 46, "TODAY", 11, 500, "#6A6D70", "middle")}{lab(600, 46, "TOMORROW", 10, 500, "#6A6D70", "middle")}{lab(677, 46, "FRIDAY", 11, 500, "#6A6D70", "middle")}{lab(755, 46, "RESET", 11, 500, "#6A6D70", "middle")}{lab(1191, 46, "PAUSE BOOKINGS", 11, 600, "#fff", "middle")}
        {lab(33, 93, "FLOOR PLAN", 11)}{lab(122, 113, "ROUND TABLE 4", 7, 500, "#777")}
        <circle cx="142" cy="204" r="82" fill="#F7F7F7" stroke="#E4E4E4" strokeWidth="14" /><circle cx="142" cy="204" r="59" fill="#E9E9E9" /><path d="M96 204h92M142 158v92" stroke={L} strokeWidth="1" /><circle cx="119" cy="219" r="6" fill="#777" /><circle cx="112" cy="274" r="7" fill="#C9C9C9" />
        {lab(33, 349, "PARTY AND TIME", 11)}<path d="M33 387h218" stroke={L} strokeWidth="2" /><g stroke="#C9C9C9"><rect x="74" y="427" width="127" height="136" fill={G} /><path d="M74 427l127 136M201 427l-127 136" /></g>
        <rect x="33" y="617" width="105" height="29" fill="#2B2E33" /><rect x="147" y="617" width="104" height="29" fill={G} /><rect x="33" y="653" width="66" height="26" fill={G} /><rect x="108" y="653" width="66" height="26" fill={G} /><rect x="183" y="653" width="68" height="26" fill={G} />
        {lab(86, 636, "LUNCH", 11, 500, "#fff", "middle")}{lab(199, 636, "DINNER", 11, 500, "#777", "middle")}{lab(66, 671, "2 GUESTS", 10, 500, "#777", "middle")}{lab(141, 671, "4 GUESTS", 10, 500, "#777", "middle")}{lab(217, 671, "6 GUESTS", 10, 500, "#777", "middle")}
        {lab(294, 90, "PREVIEW", 11)}
        <g fill="none" stroke={L} strokeWidth="1">
          <g transform="translate(500 80) scale(1.3)"><rect width="200" height="350" rx="30" strokeWidth="1.4" /><rect x="8" y="8" width="184" height="334" rx="24" strokeWidth=".7" /><g strokeWidth=".9"><ScreenLines /></g>
            {Array.from({ length: 15 }, (_, i) => <path key={i} d={`M8 ${20 + i * 22}Q100 ${24 + i * 22} 192 ${20 + i * 22}`} strokeWidth=".3" opacity=".6" />)}{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${14 + i * 19} 10V340`} strokeWidth=".3" opacity=".5" />)}</g>
          <ellipse cx="632" cy="548" rx="130" ry="10" strokeWidth=".8" />
        </g>
        {[["1", 500, 235], ["2", 581, 240], ["3", 715, 304], ["4", 702, 370], ["5", 784, 218], ["6", 741, 465]].map(([s, x, y]) => <g key={s as string}><circle cx={x as number} cy={y as number} r="13" fill="#E9E9E9" />{lab(x as number, (y as number) + 4, "J" + s, 10, 500, "#444", "middle")}</g>)}
        {lab(298, 597, "SLOT LENGTH", 11)}<circle cx="299" cy="622" r="5" fill="#777" /><circle cx="438" cy="622" r="5" fill="#E8E8E8" />{lab(310, 626, "STANDARD", 10, 500, "#666")}{lab(449, 626, "EXTENDED", 10, 500, "#666")}
        {lab(294, 669, "HOLD TIME", 10, 500, "#666")}<rect x="366" y="654" width="34" height="18" fill={G} />{lab(375, 667, "15", 10, 500, "#777")}{lab(405, 669, "min", 9, 500, "#777")}<path d="M461 664h116" stroke={L} strokeWidth="2" /><path d="M440 664h8M595 664h8M599 660v8" stroke={L} />
        {lab(664, 596, "LIVE PREVIEW", 11)}<g stroke="#C9C9C9" fill={G}><rect x="670" y="613" width="144" height="73" /><path d="M670 613l144 73M814 613l-144 73" /><rect x="827" y="613" width="144" height="73" /><path d="M827 613l144 73M971 613l-144 73" /></g>
        {lab(1026, 96, "BOOKING DETAILS", 11, 500, "#666")}
        {["Name", "Date", "Time", "Guests", "Table", "Notes"].map((s, i) => <g key={s}>{lab(1030, 132 + (i < 3 ? i : i + 0.8) * 26 + 0, s, 11, 500, "#666")}<rect x="1050" y={118 + (i < 3 ? i : i + 0.8) * 26 + 0} width="195" height="20" fill={G} /></g>)}
        <rect x="1073" y="304" width="130" height="30" fill="#2B2E33" />{lab(1138, 324, "CONFIRM BOOKING", 10, 600, "#fff", "middle")}
        {lab(1030, 398, "TABLE SETTINGS", 11, 500, "#555")}
        {["TABLE 1", "TABLE 2", "TABLE 3", "TABLE 4", "TABLE 5", "TABLE 6"].map((s, i) => <g key={s}>{lab(1029, 421 + i * 49, s, 11, 500, "#666")}<rect x="1192" y={405 + i * 49} width="52" height="19" fill={G} /><path d={`M1029 ${433 + i * 49}H1244`} stroke={L} strokeWidth="2" /></g>)}
      </svg>
    </Wrap>
  );
};

// ================= V: the finished product, full frame
const Panel: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <div style={abs(x, y, w, h, { background: "rgba(250,251,252,.92)", borderRadius: 14, boxShadow: "0 6px 22px rgba(41,58,81,.08)" })}>{children}</div>
);
const Lab: React.FC<{ x: number; y: number; s?: number; w?: number; c?: string; children: React.ReactNode; right?: boolean; style?: React.CSSProperties }> = ({ x, y, s = 10, w = 500, c = "#3B4350", children, right, style }) => (
  <div style={{ position: "absolute", left: right ? undefined : x, right: right ? x : undefined, top: y, fontSize: s, fontWeight: w, color: c, whiteSpace: "nowrap", lineHeight: 1.2, letterSpacing: -0.1, ...style }}>{children}</div>
);
const Slider: React.FC<{ x: number; y: number; w: number; p: number }> = ({ x, y, w, p }) => (
  <><div style={abs(x, y, w, 2, { background: "#15181C", borderRadius: 1 })} /><div style={abs(x + w * p - 4, y - 3, 8, 8, { background: "#111", borderRadius: 4 })} /></>
);
export type VState = { n: number; rot: number; lift: number; tick: number; pulse: (i: number) => number; sl: number };
export const Product: React.FC<{ s: VState }> = ({ s }) => {
  const dots = [];
  for (let r = 0; r < 12; r++) for (let c = 0; c < 17; c++) dots.push(<circle key={r + "-" + c} cx={67 + c * 9.7} cy={118 + r * 14.5} r={1.4} fill="#CCD0D3" />);
  const hs: [number, number][] = [[493, 257], [590, 241], [812, 210], [783, 322], [735, 379], [768, 467]];
  return (
    <Wrap>
      <div style={abs(0, 0, 1280, 720, { background: "radial-gradient(ellipse at 50% 40%, #EEF3F5 0%, #E4EAED 60%, #DCE4E8 100%)" })} />
      <svg width="1280" height="720" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M0 610L1280 520M270 720L900 520M0 690L640 560" stroke="#9BC7B7" strokeWidth=".7" strokeDasharray="4 4" fill="none" opacity=".6" /><path d="M690 560L900 720" stroke="#E7A09A" strokeWidth=".7" strokeDasharray="4 4" fill="none" opacity=".6" />
        <path d="M313 521V470M313 521L357 556M313 521L367 505" stroke="#99A" strokeWidth="1" fill="none" /><circle cx="313" cy="521" r="5" fill="#111" />
        <text x="313" y="470" fontSize="9" fill="#5573A8" fontFamily={F} textAnchor="end">Z</text><text x="369" y="509" fontSize="10" fill="#4F9A62" fontFamily={F}>Y</text><text x="357" y="561" fontSize="10" fill="#C0584E" fontFamily={F}>X</text>
      </svg>
      {/* top bar */}
      <div style={abs(22, 14, 48, 48, { borderRadius: 24, background: C.cyan, color: "#fff", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" })}>K.B</div>
      <Panel x={480} y={26} w={320} h={30} />
      <Lab x={497} y={36} s={9} w={600} c={C.indigo}>BOOKINGS</Lab><Lab x={573} y={36} s={9}>TABLES</Lab><Lab x={640} y={36} s={9}>GUESTS</Lab><Lab x={718} y={36} s={9}>SETTINGS</Lab>
      <div style={abs(1123, 28, 136, 28, { background: C.cyan, borderRadius: 4, color: "#10202E", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 0.4 })}>PAUSE BOOKINGS</div>
      {/* left panels */}
      <Panel x={21} y={69} w={244} h={233}>
        <Lab x={14} y={12} s={11} w={600}>Availability</Lab><Lab x={112} y={26} s={9} w={500}>TIME</Lab>
        <svg width="244" height="233" style={{ position: "absolute", left: -21, top: -69 }}>{dots}<circle cx="172" cy="166" r="6.5" fill="#111" /><circle cx="143" cy="195" r="3" fill="#fff" stroke="#111" /></svg>
        <Lab x={14} y={96} s={9}>THU</Lab><Lab x={211} y={96} s={9}>SUN</Lab><Lab x={118} y={210} s={9}>18:00-22:00</Lab>
      </Panel>
      <Panel x={21} y={323} w={244} h={374}>
        <Lab x={14} y={14} s={11} w={600}>Party size</Lab>
        <div style={abs(14, 36, 220, 40, { fontSize: 34, fontWeight: 600, color: "#1A2230", letterSpacing: -1 })}>{Math.min(248, 236 + s.tick)}<span style={{ fontSize: 10, fontWeight: 500, marginLeft: 6, color: "#555" }}>bookings this week</span></div>
        <Lab x={14} y={82} s={8}>Show-up</Lab><Lab x={196} y={82} s={8} c="#777">92%</Lab><Slider x={14} y={96} w={218} p={0.78 + s.sl * 0.01} />
        <Lab x={14} y={112} s={8}>Rating</Lab><Lab x={206} y={112} s={8}>4.8</Lab><Slider x={14} y={126} w={218} p={0.3 + s.sl * 0.012} />
        <svg width="244" height="110" style={{ position: "absolute", left: 0, top: 150 }}><path d="M92 8v60l24 26M154 8v60l-24 26" stroke={C.cyan} strokeWidth="6" strokeLinecap="round" fill="none" /><circle cx="92" cy="8" r="6" fill={C.cyan} /><circle cx="154" cy="8" r="6" fill={C.cyan} /><circle cx="92" cy="66" r="4" fill="#111" /><circle cx="154" cy="66" r="4" fill="#111" /><path d="M78 62h92" stroke="#444" strokeWidth=".8" /><text x="122" y="56" fontSize="8" textAnchor="middle" fill="#444" fontFamily={F}>visitors +38%</text></svg>
        <div style={abs(12, 280, 105, 30, { background: "#22262B", color: "#fff", borderRadius: 4, fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" })}>Dinner</div>
        <div style={abs(126, 280, 104, 30, { background: "#E5E8EA", color: "#666", borderRadius: 4, fontSize: 10, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" })}>Lunch</div>
        {["Two", "Four", "Six"].map((t, i) => <div key={t} style={abs(12 + i * 76, 318, 66, 26, { background: "#E9ECEE", color: "#777", borderRadius: 4, fontSize: 9, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" })}>{t}</div>)}
      </Panel>
      {/* centre product */}
      <div style={abs(300, 80, 700, 480, { perspective: 1400, transform: "translate3d(0, 12px, 0) scale(1.5)", transformOrigin: "350px 240px" })}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 700, height: 480, transform: `translate3d(0, ${s.lift}px, 0)`, willChange: "transform" }}>
          <svg width="700" height="480" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}><defs>
            <linearGradient id="r07clay" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#D8DBDD" /><stop offset=".55" stopColor="#B4B9BD" /><stop offset="1" stopColor="#8E959A" /></linearGradient>
            <linearGradient id="r07scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#EAF6FD" /></linearGradient></defs>
            <ellipse cx="350" cy="470" rx="150" ry="22" fill="#9AA5AD" opacity=".35" />
            <path d="M200 420L350 450L500 420V380L350 410L200 380z" fill="url(#r07clay)" /><path d="M200 380L350 350L500 380L350 410z" fill="#E4E7E9" />
          </svg>
          <div style={{ position: "absolute", left: 250, top: 20, width: 200, height: 350, transformStyle: "preserve-3d", transform: `rotateY(${s.rot}deg) rotateX(4deg)`, willChange: "transform" }}>
            <div style={abs(0, 0, 200, 350, { borderRadius: 30, background: "linear-gradient(100deg, #C9CED2, #9AA2A8)", boxShadow: "0 24px 40px rgba(41,58,81,.25), inset 0 0 0 2px #fff" })} />
            <div style={abs(9, 9, 182, 332, { borderRadius: 23, background: "url(#)", overflow: "hidden", backgroundColor: "#fff" })}>
              <div style={abs(0, 0, 182, 332, { background: "linear-gradient(#FFFFFF, #EAF6FD)" })} />
              <Lab x={14} y={22} s={11} w={700} c="#1A2230">Your business</Lab><Lab x={14} y={38} s={7.5} w={500} c="#7A8494">Book a table in two taps</Lab>
              {["Fri 14", "Sat 15", "Sun 16"].map((d, i) => <div key={d} style={abs(12 + i * 55, 58, 50, 38, { borderRadius: 9, background: i === 1 ? C.cyan : "#EEF2F6", color: i === 1 ? "#0E2A3A" : "#4A5463", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" })}>{d}</div>)}
              <div style={abs(12, 108, 158, 30, { borderRadius: 9, background: "#EEF2F6", fontSize: 10, fontWeight: 700, color: "#1A2230", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", boxSizing: "border-box" })}><span>-</span><span>{s.n > 630 ? 4 : 2} guests</span><span>+</span></div>
              {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"].map((tm, i) => <div key={tm} style={abs(12 + (i % 3) * 55, 150 + Math.floor(i / 3) * 34, 48, 28, { borderRadius: 8, background: i === 3 ? "#293A51" : "#fff", border: "1px solid #D9E0E7", color: i === 3 ? "#fff" : "#3B4350", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" })}>{tm}</div>)}
              <div style={abs(14, 232, 154, 32, { borderRadius: 16, background: C.indigo, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" })}>Book a table</div>
              <div style={abs(14, 280, 154, 36, { borderRadius: 10, background: "#E8F8F1", color: "#1B7D5E", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", padding: "0 10px", boxSizing: "border-box" })}>Confirmed. Reminder goes out the day before.</div>
            </div>
          </div>
        </div>
      </div>
      {hs.map(([x, y], i) => { const p = s.pulse(i); return (
        <div key={i} style={abs(x - 15, y - 15, 30, 30, { transform: `scale(${(1 + 0.1 * p).toFixed(3)})`, willChange: "transform" })}>
          <div style={abs(-6, -6, 42, 42, { borderRadius: 21, background: C.cyan, opacity: 0.25 * p, transform: `scale(${(1 + 0.4 * p).toFixed(3)})` })} />
          <div style={abs(0, 0, 30, 30, { borderRadius: 15, background: C.cyan, color: "#0E2A3A", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(41,58,81,.25)" })}>{i + 1}</div>
        </div>); })}
      {/* bottom */}
      <Panel x={285} y={573} w={344} h={125}>
        <Lab x={12} y={12} s={11} w={600}>Slot length</Lab>
        <div style={abs(14, 45, 10, 10, { borderRadius: 5, background: "#999" })} /><Lab x={30} y={44} s={9}>Standard</Lab><div style={abs(152, 45, 10, 10, { borderRadius: 5, border: "1px solid #888", boxSizing: "border-box" })} /><Lab x={168} y={44} s={9}>Extended</Lab>
        <Lab x={9} y={92} s={9}>Hold time</Lab><div style={abs(80, 86, 34, 20, { background: "#EDEFF1", fontSize: 9, borderRadius: 3, color: "#777", display: "flex", alignItems: "center", justifyContent: "center" })}>15</div>
        <div style={abs(145, 86, 20, 20, { border: "1px solid #bbb", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 })}>-</div><Slider x={175} y={96} w={116} p={0.55 + s.sl * 0.01} /><div style={abs(310, 86, 20, 20, { border: "1px solid #bbb", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 })}>+</div>
      </Panel>
      <Panel x={650} y={573} w={344} h={125}>
        <Lab x={14} y={12} s={11} w={600}>Live floor</Lab>
        {[0, 1].map((i) => <div key={i} style={abs(20 + i * 157, 40, 144, 73, { borderRadius: 4, overflow: "hidden" })}><Img src={staticFile(i ? "stills/R-1.jpg" : "stills/S-1.jpg")} style={{ width: 144, height: 73, objectFit: "cover", transform: `translate3d(${(i ? -1 : 1) * s.sl * 1.2}px,0,0) scale(1.25)` }} /><div style={abs(0, 0, 42, 13, { background: "#fff", fontSize: 7, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" })}>Room 0{i + 1}</div></div>)}
      </Panel>
      {/* right panels */}
      <Panel x={1015} y={69} w={244} h={276}>
        <Lab x={10} y={16} s={11} w={600}>Booking details</Lab>
        {["Name", "Date", "Time", "Guests", "Table", "Notes"].map((k, i) => <React.Fragment key={k}><Lab x={14} y={52 + (i < 3 ? i : i + 0.8) * 26} s={8}>{k}</Lab><div style={abs(35, 48 + (i < 3 ? i : i + 0.8) * 26, 195, 20, { background: "#EDEFF1", borderRadius: 3 })}><div style={{ fontSize: 8, fontWeight: 500, color: "#7B828C", position: "absolute", right: 6, top: 5 }}>{["Your business", "Fri 14 Mar", "19:30", "4", "Table 6", "High chair"][i]}</div></div></React.Fragment>)}
        <div style={abs(58, 235, 130, 30, { background: "#22262B", color: "#fff", borderRadius: 4, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" })}>CONFIRM BOOKING</div>
      </Panel>
      <Panel x={1015} y={366} w={244} h={331}>
        <Lab x={14} y={20} s={11} w={600}>Tables</Lab>
        {["Table 1", "Table 2", "Table 3", "Table 4", "Table 5", "Table 6"].map((k, i) => <React.Fragment key={k}><Lab x={14} y={46 + i * 49} s={8}>{k}</Lab><div style={abs(177, 38 + i * 49, 52, 19, { background: "#EDEFF1", borderRadius: 3, fontSize: 8, fontWeight: 500, color: "#7B828C", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 5, boxSizing: "border-box" })}>{[2, 4, 4, 6, 2, 8][i]} seats</div><Slider x={14} y={66 + i * 49} w={215} p={[0.35, 0.22, 0.52, 0.34, 0.58, 0.4][i] + s.sl * 0.003 * (i % 2 ? -1 : 1)} /></React.Fragment>)}
      </Panel>
    </Wrap>
  );
};
