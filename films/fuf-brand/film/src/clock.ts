// The film's timing, in film seconds, on the voice-over's words (vo/whisper_words.json; film time = file time).
import { timeline } from "./timeline";

export const FPS = 30;
export const DURATION = 1275; // 42.5 s

export const BEATS: Record<string, number | string> = {
  open: 0, connections: 2.26,                                   // Great opportunities start with the right connections.
  but: 3.38, ambitious: 3.86, vision: 5.38, easy: 6.54,         // But finding ambitious people ... isn't always easy.
  meet: 7.7, future: 7.86, unicorn: 8.4, founders: 8.92,        // Meet Future Unicorn Founders.
  an: 10.02, networking: 10.62, founders2: 12.16, entrepreneurs: 13.04, builders: 13.96, investors: 14.76, together: 15.3, malaga: 16.18,
  through: 17.02, exclusive: 17.18, meaningful: 18.52, ideas: 20.22, partnerships: 21.62, opportunities: 22.82,
  no: 24.46, awkward: 24.72, no2: 25.9, endless: 26.24, business: 26.7,
  just: 28.12, minds: 28.54, real: 29.98, connections2: 31.36, matter: 32.12,
  because: 32.88, next: 33.44, one: 35.54, conversation: 35.88,
  endcard: 37.4, build: 39.24, together2: 40.04,
  rest: 40.6, end: 42.5,
};
export const T = timeline(FPS, BEATS);
