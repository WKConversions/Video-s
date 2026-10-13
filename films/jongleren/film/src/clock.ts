// The film's timing: beats and the voice-over's force-aligned words as labels in seconds
// (vo/words_full.json, from vo/vo.mp3 with faster-whisper, corrected to the measured pauses).
// Every move is placed relative to a label, so a retime moves the labels, not the scenes.
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const T = timeline(FPS, {
  hook: 0,
  turn: "w:met-0.1",          // "Met JongLeren…"
  intake: "w:eerst-0.15",
  app: "w:vervolgens-0.15",
  search: "w:wij-0.15",
  hired: "w:ben-0.1",
  house: "w:dan-0.1",
  spain: "w:en3-0.15",
  journey: "w:van2-0.15",
  close: "w:jongleren2-0.15",
  end: 42.0,
  ...(WORDS as Record<string, number>),
});
