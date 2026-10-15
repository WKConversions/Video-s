// The film's timing as labels (film seconds). The voice-over (vo/elevenlabs-christina.mp3, word timings from
// faster-whisper: vo/whisper_words.json) starts at 0.30 s; every word is a label ("w:tap"), from src/words.json.
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const DURATION = 1080; // 36.0 s

export const BEATS: Record<string, number | string> = {
  open: 0,
  mark: "w:learning",              // studying: the lesson's verb row is highlighted
  flick: "w:scrolling-0.2",        // the thumb flicks the lesson away; the feed scrolls in
  land: "w:scrolling+0.75",        // the feed lands on a video
  logo: "w:meet-0.15",             // the phone becomes the Bingua tile
  word: "w:bingua-0.05",           // "Bingua" sets beside it
  reopen: "w:watch-0.2",           // the tile opens back into the phone
  s1: "w:real-0.05",               // swipe: French
  s2: "w:language2-0.05",          // swipe: Italian
  s3: "w:learn-0.1",               // swipe: Spanish, where we stay
  l1: "w:follow-0.1",              // transcript line 1 spoken
  l2: "w:dual-0.05",               // line 2 (holds "famoso")
  unknown: "w:word-0.1",           // famoso pulses
  tap: "w:tap",                    // the finger taps it
  card: "w:tap+0.12",              // the word card opens
  trans: "w:instant",              // the translation lands
  close: "w:need-0.3",             // the card closes
  l3: "w:need-0.05",               // line 3 becomes current
  swipe: "w:swipe-0.05",           // the finger swipes line 3 sideways
  sheet: "w:swipe+0.3",            // the sentence breakdown slides up
  ex1: "w:understand",
  ex2: "w:entire",
  shut: "w:found-0.25",            // the breakdown closes; the word card returns
  save: "w:save",                  // + Save tapped
  fly: "w:one-0.05",               // famoso flies into Cards
  badge: "w:tap2+0.2",             // badge 14 → 15
  cards: "w:then-0.2",             // Cards tab
  flip: "w:smart",                 // the flashcard flips
  gotit: "w:flashcards+0.25",
  quiz: "w:quizzes-0.2",           // quiz question
  pick: "w:quizzes+0.35",          // "famous" picked
  lesson: "w:no-0.15",             // the old lesson card comes back...
  lessonOut: "w:lessons",          // ...and is flicked away
  routine: "w:no2-0.15",           // the study routine
  routineOut: "w:routines",
  feed: "w:just2-0.1",             // back to the feed
  next: "w:videos2-0.15",          // swipe to a video you love
  heart: "w:love",                 // heart tapped
  xp: "w:language4-0.1",           // XP fills to the goal
  streak: "w:learning2",           // streak 2 → 3
  outro: "w:bingua2-0.2",          // the phone becomes the tile again
  tag: "w:learn2-0.05",            // Learn languages by
  scroll: "w:scrolling2-0.05",     // Scrolling.
  rest: "w:scrolling2+0.55",       // the camera settles
  end: 36.0,
};

export const T = timeline(FPS, { ...(WORDS as Record<string, number>), ...BEATS });
