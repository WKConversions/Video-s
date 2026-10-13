// The film's timing as labels (film seconds), on the voice-over's words (src/words.json: CTC forced alignment of the
// script against Karl's ElevenLabs file, placed at +0.50 s).
import { timeline } from "./timeline";
import WORDS_JSON from "./words.json";

export const FPS = 30;
export const DURATION = 1260;                  // 42.0 s: the voice-over (0.60–40.9 s) and the sign-off
type Wd = { word: string; key: string; start: number; end: number };
export const VO = WORDS_JSON as Wd[];
export const WORDS: Record<string, number> = Object.fromEntries(VO.map((w) => [w.key, w.start]));
export const BEATS: Record<string, number> = { open: 0, end: 42 };
export const T = timeline(FPS, { ...WORDS, ...BEATS });
