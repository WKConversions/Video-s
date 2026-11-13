/* B1 (0.00-5.45), round 2: a SaaS-style type-on of the three voice-over lines; each line TRANSFORMS into its UI
   (quiet -> the timer ring, pile up -> a pile of enquiry pills, twice -> two identical hours rows). The whole of
   0.00-8.60 is one scene (A_shared.scene), so the B1/B2 cut cannot jump. */
import * as A from './A_shared.js';
export const TYPING = A.TYPING;
export const HAND = [];
export function draw(T) { return A.scene(T); }
