// K.B team film: the timeline. LEAD-OWNED. The film follows the reference frame for frame: the reference runs at 24 fps
// (frames f0-f1200), this film at 60 fps. Reference frame n is film time n / 24 s and film frame n * 2.5.
export const FPS = 60, REF_FPS = 24, W = 1920, H = 1080;
export const REF_FRAMES = 1201;
export const DUR_FRAMES = 3003;                       // 50.05 s
/** film seconds of a reference frame */
export const rt = (refFrame: number) => refFrame / REF_FPS;
/** film frame of a reference frame */
export const rf = (refFrame: number) => Math.round(refFrame * 2.5);

// The twelve packages (one builder each). Every boundary between packages is a hard cut in the reference.
// f0 = first reference frame, f1 = last. Inside a package the builder cuts between its shots at the listed frames.
export type PkgDef = { id: string; f0: number; f1: number; cuts: number[]; shots: string };
export const PKGS: PkgDef[] = [
  { id: "R01", f0: 0, f1: 92, cuts: [64, 75], shots: "A B: the opening words and the image card; three screens" },
  { id: "R02", f0: 93, f1: 187, cuts: [130], shots: "D E: the words with the portraits; the logo" },
  { id: "R03", f0: 188, f1: 264, cuts: [192, 196, 200, 205, 254], shots: "F G H: four filmed flash cuts; the caret and the typed words; the macro letters" },
  { id: "R04", f0: 265, f1: 384, cuts: [295], shots: "I J K L: the message box and the click; the glyphs; the pieces flying in; the card at work" },
  { id: "R05", f0: 385, f1: 474, cuts: [387, 393, 396, 399, 402, 405, 408, 411, 414, 417, 420, 423, 426, 429, 431, 434], shots: "M N O: the full-screen flash cuts; the macro letters; the second message" },
  { id: "R06", f0: 475, f1: 556, cuts: [478, 484, 513, 528], shots: "P Q R S: the circles; the browser; the filmed customer; the hands and the climbing row" },
  { id: "R07", f0: 557, f1: 662, cuts: [606, 610, 618, 622, 639], shots: "T U V W: the dark message box with attachments; sketch, drawing, wireframe; the finished UI; the filmed founder" },
  { id: "R08", f0: 663, f1: 732, cuts: [679, 699], shots: "X Y Z: the UI close-up; the browser with the dashboard; the chart close-up" },
  { id: "R09", f0: 733, f1: 832, cuts: [748, 760, 771, 787, 810], shots: "AA-AD AE AF: four filmed people with a line of text; the one button; the burst of cards" },
  { id: "R10", f0: 833, f1: 961, cuts: [847, 871, 900, 925], shots: "AG AH AI AJ: the collage; the window that becomes full-bleed; the close canvas; the wide canvas" },
  { id: "R11", f0: 962, f1: 1079, cuts: [1007, 1050], shots: "AK AL AM: the update with check marks; the macro sentence; the button in the corner" },
  { id: "R12", f0: 1080, f1: 1200, cuts: [1152, 1164], shots: "AN AO AP: the filmed close with typed words; the glyph row; the end logo" },
];
export const pkgAt = (T: number) => { const n = T * REF_FPS; return PKGS.find((p) => n >= p.f0 && n < p.f1 + 1) || PKGS[PKGS.length - 1]; };
