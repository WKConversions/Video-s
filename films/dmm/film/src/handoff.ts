// Hand-offs between scenes built by different people: at time t both sides draw exactly this state
// (the outgoing scene up to t, the incoming one from t). Positions are frame px (1920 x 1080), centre = box centre.
export const H = {
  /** S3 -> S4: the logotype has gone; the wave mark alone, drawn complete (p 1, dot 1), WaveMark/markPoints width 400, box centred here */
  mark: { t: 8.55, cx: 960, cy: 560, width: 400 },
  /** S5 -> S6: the pin dot on the cathedral card's top edge, radius 12 (cyan #9EE6FD), not yet swelling; S6 draws the dot from here on and opens the white circle out of it */
  pin: { t: 12.45, x: 960, y: 365, r: 12 },
  /** S7 -> S8: three portrait cards 430 x 620, radius 28, centres (480, 520), (960, 520), (1440, 520), speaker-tatiana / -yago / -charlie, names already gone, on the white field */
  trio: { t: 17.25, xs: [480, 960, 1440], y: 520, w: 430, h: 620, r: 28 },
  /** S9 -> S10: the zoom-through cut: the phone's charcoal topographic screen covers the frame; from here the spine's charcoal stage eases in (its scale 1.06 -> 1) */
  cut: { t: 23.15 },
  /** S11 -> S12: the frame is full cyan (linear-gradient 90deg #49D8ED -> #9EE6FD) from 30.80; S12 contracts it into the JOIN US pill from 30.85 */
  cyan: { t: 30.85 },
};
