// The film's timing as labels (seconds). The voice-over's force-aligned words are labels ("w:prospects"; a repeated word
// gets a number: "w:ai2", "w:more2"), from src/words.json (vo/align.txt, pocketsphinx). Beats are written relative to the
// words, so each visual lands 3–6 frames before its word and a retime moves the labels, not the scenes.
import { timeline } from "./timeline";
import WORDS_JSON from "./words.json";

export const FPS = 30;
export const DURATION = 1125;                 // 37.5 s: the voice-over (35.0 s) and the end card
type Wd = { word: string; start: number; end: number };
export const VO = WORDS_JSON as Wd[];
const words: Record<string, number> = {};
const seen: Record<string, number> = {};
for (const w of VO) {
  const base = "w:" + w.word.toLowerCase().replace(/[^a-z0-9]/g, "");
  const n = (seen[base] = (seen[base] ?? 0) + 1);
  words[n > 1 ? base + n : base] = w.start;
}
export const WORDS = words;
const L = 0.13;                               // the picture leads the word by 4 frames
export const BEATS: Record<string, number | string> = {
  open: 0,
  // P1–P3 the hook
  bizUp: 0.0, dotLand: 0.37, hop: 1.17, assist: "w:assist-0.1", strike: "w:but-0.14", fwd: "w:moved-0.15", tag: "w:moved+0.4", rise: "w:forward-0.14",
  // P4–P8 what Wicflow builds
  capOut1: 5.3, builds: "w:builds-0.14", run: 6.3, live: "w:systems-0.15", chip: "w:systems-0.15",
  capOut2: 7.66, sales: "w:sales-0.12", marketing: "w:marketing-0.13", work: "w:everyday-0.14",
  // P9–P12 the work
  capOut3: 10.55, wash1: 10.75, scan: 10.95, lock: "w:prospects-0.15", home1: 11.95,
  card: "w:writing-0.13", personal: "w:personalized-0.13", approve: "w:outreach-0.14", send: 13.62, arrive: 14.12,
  capOut4: 14.25, timer: 14.4, follow: "w:followups-0.15", reply: 15.3, toCrm: 15.72, drawer: "w:crm-0.15", updated: "w:updated-0.14", drawerIn: 17.35, wash1Out: 17.5,
  // P13–P14 connected
  capOut5: 17.85, wash2: 17.95, connects: "w:connects-0.15", tools: "w:tools-0.15", already: "w:already-0.12",
  // P15–P17 pilot, measure, scale
  capOut6: 21.25, wash2Out: 21.3, dim: "w:one-0.15", plot: "w:focused-0.12", pilotRun: 22.5, measure: "w:measure-0.15", results: "w:results-0.15",
  scale: "w:scale-0.15", works: "w:works-0.15",
  // P18–P20 the outcome
  capOut7: 26.1, wash3: 26.1, less: "w:less-0.15", convos: "w:conversations-0.15", customers: "w:customers-0.12", blue: "w:customers-0.05",
  // P21–P23 growth that lasts
  capOut8: 30.45, gather: "w:wicflow2-0.14", turn: "w:turn-0.12", f1: "w:real-0.12", f2: "w:business2-0.12", f3: "w:growth-0.15", lasts: "w:lasts-0.15",
  // the end card
  out: 35.0, glide: 35.1, word: 35.55, mark: 35.75, line: 36.05, cta: 36.45, rest: 35.2, end: 37.5,
};
export const T = timeline(FPS, { ...WORDS, ...BEATS });
export { L };
