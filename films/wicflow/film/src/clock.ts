// The film's timing as labels (seconds). The voice-over's force-aligned words are labels ("w:prospects"; a repeated word
// gets a number: "w:ai2", "w:more2"), from src/words.json (vo/align.txt, pocketsphinx). Beats are labels relative to
// words, so the picture leads each word by a few frames and a retime moves the labels, not the scenes.
import { timeline } from "./timeline";
import WORDS_JSON from "./words.json";

export const FPS = 30;
export const DURATION = 1125;                 // 37.5 s: the voice-over (35.0 s) and the end card
type Wd = { word: string; start: number; end: number };
export const VO = WORDS_JSON as Wd[];
const words: Record<string, number> = {};
const ends: Record<string, number> = {};
const seen: Record<string, number> = {};
for (const w of VO) {
  const base = "w:" + w.word.toLowerCase().replace(/[^a-z0-9]/g, "");
  const n = (seen[base] = (seen[base] ?? 0) + 1);
  const key = n > 1 ? base + n : base;
  words[key] = w.start;
  ends[key.replace("w:", "e:")] = w.end;
}
export const WORDS = words;
export const BEATS: Record<string, number | string> = { open: 0, end: 37.5, rest: 35.2 };
export const T = timeline(FPS, { ...BEATS, ...WORDS, ...ends });
