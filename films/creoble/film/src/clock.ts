// The film's timing as labels (film seconds), on the voice-over's words (src/words.json: faster-whisper word timings of
// Karl's ElevenLabs file, placed at +0.50 s).
import { timeline } from "./timeline";
import WORDS_JSON from "./words.json";

export const FPS = 30;
export const DURATION = 1320;                  // 44.0 s: the voice-over (0.54–41.8 s) and the sign-off
type Wd = { word: string; key: string; start: number; end: number };
export const VO = WORDS_JSON as Wd[];
export const WORDS: Record<string, number> = Object.fromEntries(VO.map((w) => [w.key, w.start]));
export const BEATS: Record<string, number> = { open: 0, end: 44 };
export const T = timeline(FPS, { ...WORDS, ...BEATS });
