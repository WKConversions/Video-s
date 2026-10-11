# VoxFlow footage candidates (Mixkit)

Checked on 2026-10-11. For each clip I read the licence from its own Mixkit page (`data-license`) and confirmed the
mp4 URL against the page's free-download link.

## Licence warning: clip 18256 cannot be used in this film

Mixkit now has two stock-video licences (https://mixkit.co/license/):

- **Mixkit Stock Video Free License**: commercial and non-commercial use, ads and marketing allowed, no credit needed.
- **Mixkit Stock Video Restricted License**: *personal projects only*. It explicitly rules out "Commercial Projects,
  Advertising, Company Social Media posts" and anything that appears "in social media, marketing or an advertisement
  for a business". The free download is capped at 720p. Commercial use needs the 4K version from an Envato subscription.

**18256 (the physio clip the draft uses) is under the Restricted License.** So is every physiotherapist clip on Mixkit
I checked: 13059, 13064, 13065, 13710, 18252, 18265, 18266, 18267, 18268, 36393 and 49539. A VoxFlow explainer is
marketing for a business, so 18256 is not cleared for it unless someone licenses it through Envato. I have not found
a Free-licence physio clip on Mixkit.

Quick check I used: on assets.mixkit.co, `<id>-1080.mp4` returns 200 for every Free-licence clip I tested and 403
for every Restricted one (a 1:1 match on 12 known clips). I only used this to narrow the list. The licences below come
from the clip pages themselves.

## Candidates downloaded (all Mixkit Stock Video Free License, no credit needed)

Camera speed is the median global motion at 1920 px wide (phase correlation, 6 samples/s). It includes some subject
motion. Brightness is mean luma from 0 to 255. Warmth is mean R minus mean B. None of these clips has an audio
track. All are 1920x1080 H.264 and need 24/25 to 30 fps conversion for the 30 fps film (minterpolate, as was done
for physio.mp4).

| id | file | page | res | fps | dur | camera | luma / warmth |
|---|---|---|---|---|---|---|---|
| 247 | 247.mp4 | https://mixkit.co/free-stock-video/black-phone-on-laptop-247/ | 1920x1080 | 23.976 | 21.56 s | slow slide ~40 px/s | 60 / +6 (dark) |
| 12146 | 12146.mp4 | https://mixkit.co/free-stock-video/dentist-checking-teeth-12146/ | 1920x1080 | 24 | 12.71 s | gentle handheld ~30 px/s | 155 / +8 |
| 357 | 357.mp4 | https://mixkit.co/free-stock-video/barber-cutting-hair-357/ | 1920x1080 | 23.976 | 15.10 s | mostly steady ~12 px/s | 120 / +25 |
| 4774 | 4774.mp4 | https://mixkit.co/free-stock-video/young-man-in-consultation-with-the-dentist-4774/ | 1920x1080 | 25 | 14.04 s | handheld ~49 px/s (p90 109) | 130 / -7 |
| 778 | 778.mp4 | https://mixkit.co/free-stock-video/carpenter-marking-a-piece-of-wood-778/ | 1920x1080 | 23.976 | 43.21 s | locked off ~4 px/s | 103 / +43 (warm) |
| 773 | 773.mp4 | https://mixkit.co/free-stock-video/a-carpenter-cleaning-his-tools-773/ | 1920x1080 | 23.976 | 23.02 s | near static ~11 px/s | 127 / +43 (warm) |

mp4 URLs (the free-download link on each page): `https://assets.mixkit.co/videos/<id>/<id>-1080.mp4`.

Contact strips (start / middle / end, 480 px each): `<id>.jpg` in this folder.

### What each one shows

- **247 Black phone on laptop**: a smartphone lies on a closed laptop next to a plant leaf. At **7.4 s** the screen
  lights up with an incoming call. The call screen shows "Michael", "celular" and a green "Contestar" button. It keeps
  ringing, unanswered, to the end at 21.6 s. The camera slides slowly.
  - Caveats: the shot is moody and dark green, not bright and warm, so it needs a lift and a warm grade. The call
    screen has Spanish text on it; cover it with the film's own "Inkomend gesprek" card or crop tighter. The phone has
    no visible brand mark. No person is in the shot.
- **12146 Dentist checking teeth**: a male dentist in a white tunic and green mask examines a patient in a yellow top.
  He has a mirror and a probe in her mouth, so both hands are busy. The clinic is bright and white with soft daylight.
  - Caveat: a small embroidered tooth logo and some printed text sit on the tunic chest (left of frame). They are
    small and not legible at full frame; reframe slightly if needed.
- **357 Barber cutting hair**: an over-the-shoulder close-up of a tattooed barber in a yellow shirt and black gloves.
  He uses clippers on a client's neck, with both hands busy. The light is warm, with a darker shop background (shelves
  and bottles, soft focus). There is no readable branding.
- **4774 Young man in consultation with the dentist**: a close shot of a dentist with pink gloves, a mirror and a
  probe in a young man's mouth. Bright pink and blue palette, with a blonde assistant's head in the left foreground.
  - Caveat: the handheld drift is more noticeable than in the others.
- **778 Carpenter marking a piece of wood**: a craftsman in a cap and black T-shirt leans over a bench, marking and
  measuring a board, fully absorbed. It is a warm workshop with window light and a locked-off camera, and at 43 s it
  is the longest clip.
  - Caveats: a yellow and black power tool sits out of focus in the left foreground, and a yellow bench grinder is in
    the background. No logo is legible, but check after any reframe.
- **773 A carpenter cleaning his tools**: the same craftsman and workshop. He stands at a sage-green pegboard of
  chisels, sharpening and wiping a tool, and hangs it back. Calm, warm and near-static.

## Rankings

**(a) Hook, "Mis geen enkel telefoontje meer"** (someone busy, a phone ringing unanswered)

1. **247**: the only Free clip that literally shows a phone ringing with no one picking up. Use 6.5 s to 10 s so the
   screen lights up on cut. It needs a warm, bright grade, and the call screen should be covered or cropped.
2. **12146**: shows why the call is missed: both hands in a patient's mouth. Bright and clean, and it matches the
   film's palette. Overlay the incoming-call or missed-call card. It works best cut against 247 (busy hands, then the
   ringing phone), or alone with the UI card.
3. **357**: the same idea with a barber or hairdresser (clippers in hand). Warmer and moodier than 12146.
4. **4774**: busy-hands dentist close-up. Shakier, with a cooler pink and blue palette.
5. 778 and 773: calm craft shots with too little urgency for the hook.

**(b) "kun je volledig focussen op je bedrijf"** (focused work)

1. **778**: an absorbed craftsman (installer analogue), warm window light, locked-off camera, long take.
2. **773**: the same workshop, calm and focused. Use it as a second angle or an alternative to 778.
3. **12146**: a focused, calm treatment in a bright clinic. Use it if the film keeps a care or practice setting
   instead of the physio.
4. **357**: focused barber. Warm, but darker.
5. **4774**: OK, but shakier.
6. 247: not suitable.
- 18256 (physio) would rank 1 here on content (bright, warm, steady), but its Restricted licence rules it out.

## Considered and rejected (not downloaded)

- Physiotherapist clips 13059, 13064, 13065, 13710, 18252, 18265, 18266, 18267, 18268, 36393 and 49539: Restricted
  licence, read from each clip's page.
- Massage-therapist and nurse-physio clips 5561, 5493, 20904, 36550 and 24871, florist 6420, 6424 and 15122,
  manicurist 36905, reception 27902, carpenter 44861: no free 1080 file, so Restricted by the CDN check. I did not
  open their pages, because Mixkit's Cloudflare rate limit was blocking page requests at the time.
- 39697 and 39699 (saws): large visible DeWalt logo. Barber 43233, 43241 and 43244: printed brand logo on the cape.
- 4766 (hospital reception): a hospital, not a small business, and the staff pose for a group shot.
- 248 (phone on a round table, Free by the CDN check): no call ever comes in, and the city-view setting is grey.
- 4919 and 4908: phone scrolling, not a call.
- 12139, 12137 and 12149: the same dentist shoot as 12146, but in dark scrubs, with face shields and busier frames.

## Physio clip prepared as asked (licence not cleared, see the warning above)

- Source: `18256-src.mp4`, https://assets.mixkit.co/videos/18256/18256-720.mp4 (720p is the most the free download
  offers; the 1080 and 2160 files return 403). It is 1280x720, 25 fps, 7.32 s, no audio. Page:
  https://mixkit.co/free-stock-video/physiotherapist-massaging-a-womans-back-18256/ (Restricted License).
- Output: `film/public/footage/physio.mp4`. It is 1280x720 (native size kept, since the source is under 1920 wide),
  30 fps via `minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1`, H.264 yuv420p crf 16, no audio,
  218 frames, 7.267 s. I checked the interpolated frames and found no visible warping, since the motion is slow.

## Caller and reader candidates (Free licence, verified)

Checked on 2026-10-11. Each licence below is the `data-license` value read from the clip's own Mixkit page
(`curl -sSL <page> | grep -o 'data-license="[^"]*"'`). Every page returned exactly one value, `videoFree`, on the
page's own "Free Download" block ("Mixkit Stock Video Free License"), and each page offers a 1920x1080 download. The
mp4 is `https://assets.mixkit.co/videos/<id>/<id>-1080.mp4` (all returned 200). I used the CDN 200/403 check only to
narrow the search. I screened shortlists from 360p previews kept outside this folder.

All six are 1920x1080 H.264 yuv420p with no audio track. Measurements use the same method as above. Camera speed is
the median global motion at 1920 px wide (phase correlation, 6 samples/s, includes some subject motion), with the
p90 where it matters. Luma is mean luma from 0 to 255. Warmth is mean R minus mean B. The 24 and 23.976 fps clips
need conversion to 30 fps like the others. 4820 is already 29.97 fps.

| id | file | page | licence (from page) | res | fps | dur | camera | luma / warmth |
|---|---|---|---|---|---|---|---|---|
| 49920 | 49920.mp4 | https://mixkit.co/free-stock-video/face-of-a-woman-during-a-phone-call-49920/ | videoFree | 1920x1080 | 23.976 | 19.89 s | gentle handheld ~25 px/s (p90 53) | 89 / +37 (warm, a bit dim) |
| 49933 | 49933.mp4 | https://mixkit.co/free-stock-video/close-up-view-of-a-cheerful-woman-on-a-phone-49933/ | videoFree | 1920x1080 | 23.976 | 12.43 s | handheld drift ~39 px/s (p90 106) | 111 / +17 |
| 1798 | 1798.mp4 | https://mixkit.co/free-stock-video/a-woman-having-a-phone-call-1798/ | videoFree | 1920x1080 | 24 | 10.21 s | smooth gimbal arc ~277 px/s (p90 357), not steady | 141 / +11 (bright, backlit) |
| 4820 | 4820.mp4 | https://mixkit.co/free-stock-video/woman-in-a-kitchen-typing-on-her-smartphone-4820/ | videoFree | 1920x1080 | 29.97 | 17.45 s | locked off ~3 px/s | 138 / +20 (bright) |
| 1805 | 1805.mp4 | https://mixkit.co/free-stock-video/a-woman-using-her-smartphone-1805/ | videoFree | 1920x1080 | 24 | 14.08 s | near static ~14 px/s (p90 67) | 84 / -1 (moderately dim) |
| 1786 | 1786.mp4 | https://mixkit.co/free-stock-video/a-woman-texting-on-her-phone-1786/ | videoFree | 1920x1080 | 23.976 | 16.02 s | near static ~11 px/s | 172 / -5 (high-key, cool) |

Contact strips (start / middle / end, 480 px each): `<id>.jpg` in this folder.

### What each one shows

- **49920 Face of a woman during a phone call**: a close-up of a woman, about 25 to 30, with a dark bob. She holds a
  red smartphone to her ear the whole time, talking and smiling, in a friendly, chatty way. The setting is a home
  interior with plants and a soft warm background. No logos: her fingers cover the phone's back, and there is no
  readable text.
  - Caveat: it is slightly dim and needs a small lift.
- **49933 Close up view of a cheerful woman on a phone call**: the same woman and shoot as 49920, in a wider
  medium close-up against a white wall and a large plant. She opens with a questioning look, as if asking something
  (around 0 to 3 s), then smiles, nods and gestures with her free hand. It is brighter than 49920, with no logos or text.
  - Caveat: there is gentle handheld drift.
- **1798 A woman having a phone call**: a different woman in a striped sweater, standing in a bright glass-walled
  café or office with trees outside. She talks on her phone and gives a small smile at the end. The light is bright
  natural backlight, and the camera arcs smoothly around her the whole time.
  - Caveats: mirrored window lettering "1995-2" is legible at top right for the first ~2 s. Another person's head is
    at bottom left in the first frames. A sun flare passes mid-clip. Use roughly 3 to 10 s.
- **4820 Woman in a kitchen typing on her smartphone**: a woman, about 25 to 30, sits at a wooden kitchen table with a
  mug, oranges and a laptop. She reads and types on her phone with a soft smile until ~14.5 s, then puts the phone
  down and smiles toward the camera from ~15.5 s. The white kitchen is bright and the shot is locked off. No logos are
  visible: we see the laptop lid's edge and the phone back without marks.
- **1805 A woman using her smartphone**: a woman in a blue ruffled blouse at a café table looks down at a light-green
  phone with a warm, pleased smile, with a coffee cup beside her. The café is cosy, with a darker ceiling and string
  lights. No logo on the phone.
  - Caveat: the darker background lowers the overall brightness.
- **1786 A woman texting on her phone**: a woman in a black blazer at a desk in front of a large bright window
  scrolls and types with a slight smile. A laptop is at the left edge, showing its keyboard side, with no logo.
  - Caveats: it is very bright and cool, and reads more "office worker" than customer. The smile is subtle.

### Rankings

**(a) Customer calling the business** (phone to ear, talking or asking, friendly, bright)

1. **49920**: the clearest friendly caller: phone to ear the whole time, talking and smiling, gentle camera, 19.9 s.
   Lift the exposure slightly.
2. **49933**: the same actress, wider and brighter. The questioning look at the start fits "asking something", and it
   turns into a smile. It cuts well with 49920 (medium, then close-up).
3. **1798**: the best "bright café or office" light, and a different person. It is not steady (gimbal arc), and you
   should avoid the first ~2 s because of the window lettering.

**(b) Smiling while reading a message on the phone** (receiving the confirmation)

1. **4820**: bright, locked off, a natural smile while reading, and 29.97 fps. The put-down-and-smile ending
   (~15.5 s) is a nice optional beat.
2. **1805**: the warmest, most obvious "nice message" smile, near static. Moderately dim, so lift it a little.
3. **1786**: the brightest and steady, but a corporate look and a subtle smile.

### Also checked (not downloaded)

- Free on the page, but not used:
  - 44745 (young man in a turtleneck on a phone call in an open-plan office, 9.7 s, dim, a dark monitor edge slides
    into frame)
  - 44751 (the same man, smiling on the phone, but **vertical 1080x1920**)
  - 1815 (the same café as 1805, dark blouse, dimmer, less smile)
- Free by the CDN check only, rejected on content (page not opened):
  - 49932 and 49934 (the same actress as 49920; side view gesturing at a laptop, and picking up the phone in a home
    office)
  - 39776 (woman on an overcast city terrace)
  - 10451 (dusk, dark blue)
  - 311 (night background)
  - 305 (only 4.75 s)
  - 4937 (answering the phone at work)
  - 42628 (half-face, at a laptop)
  - 44752 (concerned expression)
  - 42623 (serious pair)
  - 42637 (green screen)
  - 39795, 39797 and 39803 (earbuds, no phone to ear)
  - 41336 (vintage handset, posters with text)
  - 39815 (screen close-up)
  - 51121 (smiling, but dark, luma ~66)
  - 4805 (businessman outdoors, slight smile)
  - 4914 (on-screen like counters)
  - 31405 (backlit in bed)
  - 39791 and 41174 (vertical 1080x1920)
- Restricted by the CDN check (1080 returns 403, so not considered): 22568, 27669, 46612, 48666, 16284, 21040, 9256,
  100050, 100053, 100065, 100067, 24317, 24382, 23735, 36507, 14370, 29959, 24213, 24356, 23073, 38354, 27763, 34217,
  14746, 23525, 21243, 39553, 32045, 47002 and others.
