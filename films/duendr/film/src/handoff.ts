// Hand-offs between scenes built by different people: at time t both sides draw exactly this state
// (the outgoing scene up to t, the incoming one from t). Frame px, 1920 x 1080.
export const H = {
  /** B1 -> B2: a coral dot (r 18, #E25A3D) alone at the frame centre on the dark field (Málaga's pin, zoomed in) */
  dot: { t: 8.75, x: 960, y: 540, r: 18 },
  /** B2 -> B3: the app's Find work / Find talent switch alone (ui Segmented, w 444, on = 0 "Find work"), scaled 2.4 about its
   *  centre, centred at (960, 540) on the dark field; the map has gone */
  toggle: { t: 16.7, x: 960, y: 540, scale: 2.4 },
  /** B3 -> B4: the confirmed booking tile (ui BookedTile w 300, mon "NOV", day "21", dow "Sat", name "Javi Ortega", at "Casa Brisa",
   *  time "Sat · 20:00", img "clips/dj-stage.mp4") scaled 2 about its centre, centred at (960, 540) on the dark field, nothing else */
  booking: { t: 25.7, x: 960, y: 540, scale: 2 },
  /** B4 -> lead: the frame is full cream (#F3EEE4) from 36.05: B4 grows it out of an object between ~35.5 and 36.05 */
  cream: { t: 36.05 },
};
