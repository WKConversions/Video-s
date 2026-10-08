// The film's timing as labels (film seconds). The voice-over (vo/elevenlabs-christina.mp3, force-aligned: vo/align.txt)
// starts at 0.40 s; every word is a label ("w:grow"), from src/words.json. Every move in Story.tsx is keyed to a label,
// so a retime moves labels, never frame numbers.
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const DURATION = 1020; // 34.0 s

export const BEATS: Record<string, number | string> = {
  open: 0,
  land: "w:your-0.12",            // the business lands on the floor
  lift: "w:grow-0.10",            // the floor lifts on "grow"
  grip: "w:hold-0.06",
  sink: "w:back-0.08",
  slide: "w:but-0.10",            // the business slides left, the reel rises
  reel: "w:finding-0.14",
  slow: "w:solutions-0.04",
  where: "w:where-0.10",
  close: "w:isnt-0.06",
  kb: "w:kay-0.16",               // the K.B tile seats in the hole
  field: "w:comes-0.06",          // the navy field
  fold: "w:we-0.04",              // the field folds back into the tile
  note: "w:offer-0.10",
  dock: "w:become-0.10",
  first: "w:first-0.12",
  lens: "w:understand-0.20",
  open3: "w:business2-0.14",      // the business opens into nine
  ring1: "w:identify-0.06",
  ring2: "w:opportunities-0.02",
  flip: "w:develop-0.08",
  flow: "w:solutions2-0.02",
  bring: "w:bring-0.12",
  life: "w:life-0.08",
  road: "w:from-0.10",
  ride: "w:to3-0.08",
  gather: "w:were-0.16",
  side: "w:side-0.10",
  behind0: "w:because-0.10",
  rise: "w:growth-0.06",
  floorIn: "w:technology2-0.30",
  alone: "w:alone-0.08",
  drop: "w:having-0.08",
  partner: "w:right2-0.10",
  up: "w:behind-0.06",
  rest: "w:it3+0.42",             // the last word ends: the camera eases to rest; the end card (with the music's last chord)
  end: 34.0,
};

export const T = timeline(FPS, { ...(WORDS as Record<string, number>), ...BEATS });
