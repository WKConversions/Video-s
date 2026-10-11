// The film's timing as labels (seconds of film time), on the voice-over's force-aligned words (src/words.json: CTC
// alignment of the script on Karl's ElevenLabs file, placed at +0.50 s). Retime by moving labels.
import { timeline } from "./timeline";
import WORDS_JSON from "./words.json";

export const FPS = 30;
export const DURATION = 1200;                  // 40.0 s: the voice-over (0.56–38.1 s) and the end card
type Wd = { word: string; key: string; start: number; end: number };
export const VO = WORDS_JSON as Wd[];
export const WORDS: Record<string, number> = Object.fromEntries(VO.map((w) => [w.key, w.start]));
export const WORD_END: Record<string, number> = Object.fromEntries(VO.map((w) => [w.key, w.end]));
export const BEATS: Record<string, number> = {
  open: 0, end: 40,
};
export const T = timeline(FPS, { ...WORDS, ...BEATS });
