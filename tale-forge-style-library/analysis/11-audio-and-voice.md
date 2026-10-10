# 11 · Audio and voice

Tale Forge sounds like a grandfather reading at bedtime, with an optional fire, rain, forest, music box, harp or ember drone low in the background. The product has **no sound effects, no jingle and no music on the landing page**. Every sound is opt-in, and there are exactly three things in the code that play audio: a looping background bed, a narration player and two "hear the voice" buttons.
This file lists all 28 audio files with measured specs. It then shows how the JavaScript wires them up (volumes, storage keys, the listen-mode timing), matches each narration file to its source text with pace and pause measurements, and describes the narrator, the six ambient beds and the sonic identity. It ends with recipes for using or imitating the sound in a film.
Literal data is in [`derived/audio/audio-specs.csv`](../derived/audio/audio-specs.csv) (one row per file) and [`derived/audio/narration-text-match.csv`](../derived/audio/narration-text-match.csv). Labelled waveforms and spectrograms are in [`derived/audio/plots/`](../derived/audio/plots/), and verbatim JS excerpts are in [`derived/audio/js-excerpts/`](../derived/audio/js-excerpts/).

## Contents

1. [At a glance](#1-at-a-glance)
2. [Inventory of every audio file](#2-inventory-of-every-audio-file)
3. [How audio is wired in the UI](#3-how-audio-is-wired-in-the-ui)
4. [The narrator: Morfar Erik / Grandpa Erik](#4-the-narrator-morfar-erik--grandpa-erik)
5. [Narration matched to text, beat by beat](#5-narration-matched-to-text-beat-by-beat)
6. [The narrator cast (voice picker)](#6-the-narrator-cast-voice-picker)
7. [The six ambient beds](#7-the-six-ambient-beds)
8. [Loop check: do the beds loop seamlessly?](#8-loop-check-do-the-beds-loop-seamlessly)
9. [Sonic identity (interpretation)](#9-sonic-identity-interpretation)
10. [Using these sounds in a film](#10-using-these-sounds-in-a-film)
11. [Derived files index](#11-derived-files-index)
12. [Method, limits and open questions](#12-method-limits-and-open-questions)

---

## 1. At a glance

| What | Value | Evidence |
|---|---|---|
| Audio files on the public site | 28: 6 ambient beds, 2 landing voice samples, 6 more narrator samples under `/voices/`, 14 narrated pages of the sample book | §2, [`audio-specs.csv`](../derived/audio/audio-specs.csv) |
| Things in the code that play audio | 3 `<audio>` sinks: the bed singleton `data-testid="tf-bed-audio"`, the reader's `narration-audio`, the landing pill's `<audio preload="none">`. Plus one `new Audio()` in the narrator voice picker | §3 |
| Autoplay on first visit | none. Every sound starts from a click. The bed resumes on the next `pointerdown` if a bed was chosen before | §3.1, §3.3 |
| Bed volume | `DEFAULT_BED_VOLUME` **0.18**, `MAX_BED_VOLUME` **0.4** (clamp), slider step **0.02** | [`1pgfdvt65g9p-.js` @37128](../source/js/1pgfdvt65g9p-.js), [`36tbz-w9v-p8v.js` @7439](../source/js/36tbz-w9v-p8v.js) |
| Persistence | `localStorage` `tf-bed` / `tf-bed:<childId>` (bed id or `"off"`), `tf-bed-vol` / `tf-bed-vol:<childId>` (number) | §3.1 |
| Default bed | `DEFAULT_WAIT_BED = "hearth"` ("Brasa" [Fireplace]) | [`1pgfdvt65g9p-.js` @37210](../source/js/1pgfdvt65g9p-.js) |
| Narrator persona | `narratorPersona: "grandpa"` = **Morfar Erik** [Grandpa Erik; *morfar* = mother's father], the default (`DEFAULT_CREATE_VOICE_ID "grandpa"`) | [`390j9gbq0u9ce.js` @32429](../source/js/390j9gbq0u9ce.js) |
| Narration engine (sample book) | `vertex-gemini-tts:gemini-3.1-flash-tts-preview:Enceladus` on all 14 pages | [sample-book JSON](../source/sample-book.iris-och-den-sparade-platsen.json) `beats[].assets.audio.provider` |
| Narration pace | 87–115 words/min over the whole file (mean **102**), 118–147 wpm excluding pauses (mean 129), ≈3.9 syllables/s; pauses fill **20 %** of the speech time | §5 |
| Narration loudness | −18.5 to −19.9 LUFS-I, true peak −2.0 to −2.4 dBTP (the JSON says it was normalised to `-23LUFS:-2dBTP:11LRA`) | §4.2 |
| Bed loudness | all six at −24.3 to −24.7 LUFS-I in the file. With the default volume of 0.18 they play at about **−39 LUFS**, about **20 dB under the narration** | §3.8 |
| Bed loops | all six are exactly 30.000 s (1 323 000 samples). All six loop **without an audible seam** by three measures | §8 |
| Narrator pitch | book narration median F0 93–119 Hz (a low male voice). It rises about +2.7 semitones on quoted dialogue, and about +7 st (a fifth) on the girl Amina's lines | §4.4 |

---

## 2. Inventory of every audio file

Measured with `ffprobe`, `ffmpeg ebur128=peak=true` (integrated loudness, true peak, LRA), `astats`, `silencedetect=-40dB:d=0.2`, and numpy on the decoded PCM (energy-weighted spectral centroid, 85 % roll-off, band energy shares, F0). Every number below is also a column in [`derived/audio/audio-specs.csv`](../derived/audio/audio-specs.csv) (28 rows × 59 columns, including md5 and byte size). The live site serves all of them as `audio/mpeg` with `accept-ranges: bytes`. `/voices/*` files carry `cache-control: public, max-age=31536000, immutable`, the rest `public, max-age=14400, must-revalidate` (checked with `curl -I`, 2026-10-10).

### 2.1 Ambient beds: `assets/audio/atmosphere/v1/` (site path `/audio/atmosphere/v1/<id>.mp3`)

All six are byte-for-byte the same size (481 115 bytes). They are 128 kb/s CBR MP3, 44.1 kHz stereo, encoder tag `Lavc60.31` (ffmpeg's libmp3lame). They decode to exactly 30.000 s, and the LAME header trims the encoder delay (container start 0.025 s, container duration 30.041 s).

| id | Label sv / en | Group | Duration | Format | LUFS-I | True peak | LRA | Centroid | Stereo corr. | Loop seam | Files |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `hearth` | Brasa / Fireplace | ambience | 30.00 s | MP3 128 kb/s, 44.1 kHz stereo | -24.4 | -2.6 dBTP | 2.7 LU | 277 Hz | 0.9997 | seamless | [mp3](../assets/audio/atmosphere/v1/hearth.mp3) · [wave](../derived/audio/plots/bed__hearth__waveform.png) · [spec](../derived/audio/plots/bed__hearth__spectrogram.webp) · [seam clip](../derived/audio/seams/hearth__seam-audition_last3s-then-first3s.mp3) |
| `rain` | Fönsterregn / Window rain | ambience | 30.00 s | MP3 128 kb/s, 44.1 kHz stereo | -24.7 | -3.2 dBTP | 0.5 LU | 6309 Hz | 0.3139 | seamless | [mp3](../assets/audio/atmosphere/v1/rain.mp3) · [wave](../derived/audio/plots/bed__rain__waveform.png) · [spec](../derived/audio/plots/bed__rain__spectrogram.webp) · [seam clip](../derived/audio/seams/rain__seam-audition_last3s-then-first3s.mp3) |
| `forest` | Sagoskogen / Enchanted forest | ambience | 30.00 s | MP3 128 kb/s, 44.1 kHz stereo | -24.4 | -3.1 dBTP | 3.8 LU | 3144 Hz | 0.224 | seamless | [mp3](../assets/audio/atmosphere/v1/forest.mp3) · [wave](../derived/audio/plots/bed__forest__waveform.png) · [spec](../derived/audio/plots/bed__forest__spectrogram.webp) · [seam clip](../derived/audio/seams/forest__seam-audition_last3s-then-first3s.mp3) |
| `musicbox` | Speldosa / Music box | music | 30.00 s | MP3 128 kb/s, 44.1 kHz stereo | -24.3 | -11.0 dBTP | 3.1 LU | 1176 Hz | 0.7457 | seamless | [mp3](../assets/audio/atmosphere/v1/musicbox.mp3) · [wave](../derived/audio/plots/bed__musicbox__waveform.png) · [spec](../derived/audio/plots/bed__musicbox__spectrogram.webp) · [seam clip](../derived/audio/seams/musicbox__seam-audition_last3s-then-first3s.mp3) |
| `harp` | Månharpa / Moonlit harp | music | 30.00 s | MP3 128 kb/s, 44.1 kHz stereo | -24.3 | -9.3 dBTP | 3.6 LU | 339 Hz | 0.6137 | seamless | [mp3](../assets/audio/atmosphere/v1/harp.mp3) · [wave](../derived/audio/plots/bed__harp__waveform.png) · [spec](../derived/audio/plots/bed__harp__spectrogram.webp) · [seam clip](../derived/audio/seams/harp__seam-audition_last3s-then-first3s.mp3) |
| `fire` | Glödljus / Ember glow | music | 30.00 s | MP3 128 kb/s, 44.1 kHz stereo | -24.4 | -5.6 dBTP | 5.7 LU | 1486 Hz | -0.1384 | seamless | [mp3](../assets/audio/atmosphere/v1/fire.mp3) · [wave](../derived/audio/plots/bed__fire__waveform.png) · [spec](../derived/audio/plots/bed__fire__spectrogram.webp) · [seam clip](../derived/audio/seams/fire__seam-audition_last3s-then-first3s.mp3) |

### 2.2 Narrator samples: landing page and voice picker

The two landing files live in [`assets/audio/landing-voice/`](../assets/audio/landing-voice/). The other six were fetched for this library from `https://tale-forge.app/voices/<id>.mp3` into [`derived/audio/fetched/voices/`](../derived/audio/fetched/voices/). `grandpa.mp3` and `grandpa-en.mp3` in that folder have the same md5 as the landing files (`4fd9fc63…`, `ba2efb70…`), so the landing page and the voice picker play **the same Morfar recording**. All are 24 kHz mono. The Swedish files are 96 kb/s CBR. The English files are VBR, about 54–57 kb/s, judging by the varying frame sizes. Muxer tag `Lavf60.16.100`.

| Voice | Lang | Site URL | Library file | Duration | Format | LUFS-I | True peak | F0 median (p10–p90) | Words / WPM (ASR) | Plots |
|---|---|---|---|---|---|---|---|---|---|---|
| Morfar Erik | sv | `/landing/voice/grandpa-sample.mp3 and /voices/grandpa.mp3 (byte-identical)` | [grandpa-sample.mp3](../assets/audio/landing-voice/grandpa-sample.mp3) | 13.00 s | MP3 96 kb/s, 24 kHz mono | -26.6 | -8.0 | 138 Hz (88–175) | 24 / 111 | [wave](../derived/audio/plots/voice__grandpa-sample__waveform.png) · [spec](../derived/audio/plots/voice__grandpa-sample__spectrogram.webp) |
| Grandpa Erik | en | `/landing/voice/grandpa-sample-en.mp3 and /voices/grandpa-en.mp3 (byte-identical)` | [grandpa-sample-en.mp3](../assets/audio/landing-voice/grandpa-sample-en.mp3) | 12.00 s | MP3 56 kb/s VBR, 24 kHz mono | -26.8 | -8.0 | 100 Hz (78–153) | 22 / 110 | [wave](../derived/audio/plots/voice__grandpa-sample-en__waveform.png) · [spec](../derived/audio/plots/voice__grandpa-sample-en__spectrogram.webp) |
| Berättaren Lily | sv | `/voices/female.mp3` | [female.mp3](../derived/audio/fetched/voices/female.mp3) | 14.64 s | MP3 96 kb/s, 24 kHz mono | -24.4 | -6.3 | 192 Hz (146–288) | 24 / 98 | [wave](../derived/audio/plots/voice__female__waveform.png) · [spec](../derived/audio/plots/voice__female__spectrogram.webp) |
| Storyteller Lily | en | `/voices/female-en.mp3` | [female-en.mp3](../derived/audio/fetched/voices/female-en.mp3) | 9.16 s | MP3 54 kb/s VBR, 24 kHz mono | -24.5 | -7.4 | 192 Hz (148–245) | 23 / 151 | [wave](../derived/audio/plots/voice__female-en__waveform.png) · [spec](../derived/audio/plots/voice__female-en__spectrogram.webp) |
| Berättaren Marcus | sv | `/voices/male.mp3` | [male.mp3](../derived/audio/fetched/voices/male.mp3) | 14.40 s | MP3 96 kb/s, 24 kHz mono | -23.9 | -3.9 | 132 Hz (92–216) | 24 / 100 | [wave](../derived/audio/plots/voice__male__waveform.png) · [spec](../derived/audio/plots/voice__male__spectrogram.webp) |
| Narrator Marcus | en | `/voices/male-en.mp3` | [male-en.mp3](../derived/audio/fetched/voices/male-en.mp3) | 10.24 s | MP3 57 kb/s VBR, 24 kHz mono | -19.4 | -1.8 | 117 Hz (81–161) | 19 / 111 | [wave](../derived/audio/plots/voice__male-en__waveform.png) · [spec](../derived/audio/plots/voice__male-en__spectrogram.webp) |
| Unga Saga | sv | `/voices/young.mp3` | [young.mp3](../derived/audio/fetched/voices/young.mp3) | 15.24 s | MP3 96 kb/s, 24 kHz mono | -27.5 | -9.9 | 190 Hz (154–306) | 24 / 94 | [wave](../derived/audio/plots/voice__young__waveform.png) · [spec](../derived/audio/plots/voice__young__spectrogram.webp) |
| Young Saga | en | `/voices/young-en.mp3` | [young-en.mp3](../derived/audio/fetched/voices/young-en.mp3) | 9.12 s | MP3 55 kb/s VBR, 24 kHz mono | -23.0 | -5.4 | 200 Hz (154–286) | 17 / 112 | [wave](../derived/audio/plots/voice__young-en__waveform.png) · [spec](../derived/audio/plots/voice__young-en__spectrogram.webp) |

### 2.3 Sample-book narration: `assets/share/iris-sparade-platsen/assets/*.mp3`

There are 14 files, one per page ("beat") of *Iris och den sparade platsen* [Iris and the saved place]. All are 48 kHz mono, 128 kb/s CBR, muxer tag `Lavf60.16.100`. Together they last **895.3 s (14 min 55 s)**. One reading path through the book is 6 pages and lasts 6.3–6.6 min (§5.2). The public share page `/share/iris-sparade-platsen` returns 404, but the MP3s are still served (HTTP 200, `content-length: 1073709` for `S1.mp3`). See the full per-beat table in §5.1.

### 2.4 What does not exist

- **No UI sound effects** (no clicks, chimes or page-turn sounds), **no music on the landing page** and **no Web Audio**. A search of all 17 chunks in [`source/js/`](../source/js/) for `AudioContext`, `speechSynthesis`, `.wav`, `.ogg`, `.m4a` and `.aac` finds nothing. The only audio formats referenced anywhere are the `.mp3` files above.
- **No narration of the choice prompts or the ending.** Each beat's MP3 ends with the last sentence of `prose` (machine transcripts, §5.3). The choice question, for example "Det hettade i Iris händer; de ville rycka i stolen. Före sagostunden hinner hon bara rita på ett ställe. Vad gör hon?" [Iris's hands felt hot; they wanted to grab at the chair. Before story time she only has time to draw in one place. What does she do?] (`beats[1].choice.prompt`), is text only. So is "Slut" [The end].
- Real users' books stream their narration from storage outside the app. The CSP allows `media-src 'self' blob: https://snamhqcmfsaqbqcwccqv.supabase.co https://storage.googleapis.com` ([`source/meta/home-response-headers.txt`](../source/meta/home-response-headers.txt)).
- The unlisted Bokmässan [book fair] kiosk has its own reader with a native `<audio controls>` panel "Lyssna på sidan · Berättad av Sanna" [Listen to the page · Narrated by Sanna] and five fair-only voices (Sanna, Brage, Johnny, Mira, Janne) ([05b §11](05b-components-app-and-forms.md#11-discovered-the-unlisted-bokmässan-book-fair-kiosk), [`bokmassan-reader-audio-panel__natt__desktop.png`](../screenshots/components/app/bokmassan-reader-audio-panel__natt__desktop.png)). Its audio files were **not** harvested or measured here (handoff).

---

## 3. How audio is wired in the UI

The chunks are minified one-liners, so citations give the **character offset** of a unique string in the file under [`source/js/`](../source/js/). Prettier-formatted verbatim excerpts are saved in [`derived/audio/js-excerpts/`](../derived/audio/js-excerpts/).

### 3.1 The ambient-bed module (one shared `<audio loop>`)

Excerpt (the block below is condensed from it: whitespace joined, `...` marks elisions, `//` notes are ours): [`ambient-beds.1pgfdvt65g9p-.pretty.js`](../derived/audio/js-excerpts/ambient-beds.1pgfdvt65g9p-.pretty.js) (minified source [`1pgfdvt65g9p-.js`](../source/js/1pgfdvt65g9p-.js) @36419–38272, modules 77147 and 38618).

```js
// module 77147 — the catalogue (verbatim, formatted)
let t = [
  { id: "hearth",   group: "ambience", label: { sv: "Brasa",       en: "Fireplace" } },
  { id: "rain",     group: "ambience", label: { sv: "Fönsterregn", en: "Window rain" } },
  { id: "forest",   group: "ambience", label: { sv: "Sagoskogen",  en: "Enchanted forest" } },
  { id: "musicbox", group: "music",    label: { sv: "Speldosa",    en: "Music box" } },
  { id: "harp",     group: "music",    label: { sv: "Månharpa",    en: "Moonlit harp" } },
  { id: "fire",     group: "music",    label: { sv: "Glödljus",    en: "Ember glow" } },
];
function o(e) { return `/audio/atmosphere/v1/${e}.mp3`; }          // bedUrl
function r(e) { return e ? `tf-bed:${e}` : "tf-bed"; }              // pref key, per child
function i(e) { return e ? `tf-bed-vol:${e}` : "tf-bed-vol"; }      // volume key, per child
function n(e) { return Math.min(0.4, Math.max(0, e)); }             // clampBedVol
e.s(["AMBIENT_BEDS", 0, t, "DEFAULT_BED_VOLUME", 0, 0.18, "bedUrl", 0, o, "isBedId", 0, a], 77147);
// module 38618
e.s(["DEFAULT_WAIT_BED", 0, "hearth", "MAX_BED_VOLUME", 0, 0.4, "claimBed", 0, function () {
      d += 1; let e = !1;
      return () => { e || ((e = !0), (d -= 1), window.setTimeout(() => { 0 === d && s?.pause(); }, 400)); };
    }, ...
    "syncBed", 0, function (e) {
      let t = "u" < typeof document ? null
        : ((s && s.isConnected) || (((s = document.createElement("audio")).loop = !0),
            (s.preload = "none"), s.setAttribute("data-testid", "tf-bed-audio"), document.body.appendChild(s)), s);
      if (t) {
        if (e.bedId) { let l = o(e.bedId); t.getAttribute("src") !== l && (t.src = l); }
        else t.hasAttribute("src") && t.removeAttribute("src");
        if (((t.volume = n(e.volume)), e.bedId && e.play)) { let e = t.play(); e && "function" == typeof e.catch && e.catch(() => {}); }
        else t.pause();
      }
    },
    "writeBedPref", 0, function (e, t) { try { localStorage.setItem(r(t), e ?? "off"); } catch {} },
    "writeBedVol",  0, function (e, t) { try { localStorage.setItem(i(t), String(n(e))); } catch {} },
  ], 38618);
// (our note) readBedVol(): stored number, clamped, else 0.18. readBedPref(): the stored id only if isBedId(), else null, so "off" reads as null.
```

Observed behaviour, read from the code:

- **One element for the whole app.** `syncBed` creates a single `<audio loop preload="none" data-testid="tf-bed-audio">` on `document.body` and reuses it. Switching beds swaps `src` and does **not crossfade**. The new bed starts cold at its first sample.
- **Reference-counted claims.** Each screen that offers sound calls `claimBed()` on mount. When the last claim is released, the bed pauses **400 ms later**. Client-side navigation from one sound screen to another, for example the waiting fire to the reader, therefore never stops the loop.
- **Volume is `HTMLMediaElement.volume`**, a linear gain clamped to 0–0.4. 0.18 = −14.9 dB, 0.4 = −8.0 dB.
- **Preferences are per child.** Both keys take the child id as a suffix when there is one. A bed set to off is stored as the string `"off"`. A `storage` listener re-reads the keys when another tab changes them ([`36tbz-w9v-p8v.js` @4933](../source/js/36tbz-w9v-p8v.js): `"tf-bed"===t.key || "tf-bed-vol"===t.key || t.key?.startsWith("tf-bed:") || t.key?.startsWith("tf-bed-vol:")`).
- `play()` promise rejections from autoplay blocking are swallowed (`.catch(() => {})`). No error appears in the UI.

### 3.2 Reader: "Bakgrundsljud" [Background sound] panel

Code: [`reader-narration-and-sound.36tbz-w9v-p8v.pretty.js`](../derived/audio/js-excerpts/reader-narration-and-sound.36tbz-w9v-p8v.pretty.js) ([`36tbz-w9v-p8v.js` @4682](../source/js/36tbz-w9v-p8v.js)). CSS: [`3q17cp_jgfwol.pretty.css:1948-2032`](../source/css/3q17cp_jgfwol.pretty.css). Visuals and CSS are covered in [05b §7.3](05b-components-app-and-forms.md#73-background-sound-panel).

| Key | sv | en |
|---|---|---|
| `soundTitle` | Bakgrundsljud | Background sound |
| `groupAmbience` | Stämning | Ambience |
| `groupMusic` | Musik | Music |
| `soundOff` | Av | Off |
| `volume` | Volym | Volume |

- The toggle `button.chip.sound-toggle` (speaker icon `M11 5 6 9H3v6h3l5 4V5z` + waves `M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12`) opens `#reader-sound-panel`. **Opening the panel when no bed is chosen starts `hearth`** (`e && null === N && w(m.DEFAULT_WAIT_BED)`).
- Two groups of pill buttons, *Stämning*: Brasa · Fönsterregn · Sagoskogen, and *Musik*: Speldosa · Månharpa · Glödljus. Then "Av" and a range input `min 0, max MAX_BED_VOLUME (0.4), step 0.02`. The slider shows the clamped, linear 0–0.4 range directly, so its full travel covers −∞ to −8 dB.
- On the cover and on the end ceremony the panel renders with `controls: !1`. Its hooks still run, so a chosen bed keeps playing behind the cover and the "Slut" screen.
- Screens: [`recon-reader-beat-sound-open__natt__desktop.webp`](../screenshots/components/app/recon-reader-beat-sound-open__natt__desktop.webp), [`…__morgon__desktop.webp`](../screenshots/components/app/recon-reader-beat-sound-open__morgon__desktop.webp), [`…__natt__mobile.webp`](../screenshots/components/app/recon-reader-beat-sound-open__natt__mobile.webp) (reconstructions from shipped CSS, see 05b).

### 3.3 Waiting screen (Glödvakten): "Eldljud" [Fire sound] chip

Code (condensed below): [`glod-sound-chip.2j_-r8q4tgdka.pretty.js`](../derived/audio/js-excerpts/glod-sound-chip.2j_-r8q4tgdka.pretty.js) ([`2j_-r8q4tgdka.js` @35395](../source/js/2j_-r8q4tgdka.js)). CSS: [`37m388zf6rymp.pretty.css:776-800`](../source/css/37m388zf6rymp.pretty.css).

```js
let p = { sv: { label: "Eldljud" }, en: { label: "Fire sound" } };
// on click: let e = i ? null : ((0, f.readBedPref)(a) ?? f.DEFAULT_WAIT_BED); s(e); writeBedPref(e, a); syncBed({ bedId: e, volume: readBedVol(a), play: null != e });
// while a bed is set: window.addEventListener("pointerdown", () => syncBed({ bedId: n, volume: readBedVol(a), play: !0 }))
```

- The chip is labelled "Fire sound", but it plays **the child's last chosen bed**, falling back to `hearth`. A family that picked *Fönsterregn* in the reader hears rain while the "fire" is burning.
- If a bed preference is stored, the waiting screen tries to start it on mount. It then retries on **every pointer-down** anywhere on the page, which gets around autoplay blocking at the first tap.
- Visuals: [`start-s7-glod-sound-chip__natt__desktop.png`](../screenshots/components/app/start-s7-glod-sound-chip__natt__desktop.png) (off, renders as a light UA button) and [`start-s7-glod-sound-chip--on__natt__desktop.png`](../screenshots/components/app/start-s7-glod-sound-chip--on__natt__desktop.png).

### 3.4 Reader: narration controls and listen mode

Code: [`reader-narration-and-sound.36tbz-w9v-p8v.pretty.js`](../derived/audio/js-excerpts/reader-narration-and-sound.36tbz-w9v-p8v.pretty.js) ([`36tbz-w9v-p8v.js` @2678](../source/js/36tbz-w9v-p8v.js)).

| Key | sv | en |
|---|---|---|
| `playNarration` | Spela berättelsen | Play narration |
| `pauseNarration` | Pausa berättelsen | Pause narration |
| `restartNarration` | Börja om sidan | Restart this page |
| cover `listen` ([@219](../source/js/36tbz-w9v-p8v.js)) | Lyssna-läge | Listen mode |
| cover `read` | Läs sagan | Read the story |

- Each page renders a hidden `<audio data-testid="narration-audio" preload="metadata" hidden>`. The visible controls are two **44 × 44 px, 8 px-radius** square buttons (`.reader-audio-control`, [`3q17cp_jgfwol.pretty.css:2039-2069`](../source/css/3q17cp_jgfwol.pretty.css)): play `M8 5v14l11-7z` / pause (two 4 × 16 rects), and restart (`M4 7v5h5` + `M5.5 16a8 8 0 1 0 .5-9l-2 5`, which sets `currentTime = 0` and plays). The narration element's volume is never set, so it plays at 1.0. There is no scrubber, no speed control and no time display.
- **Listen mode.** The cover offers "Lyssna-läge" only if the page has a `narrationUrl`. It turns on `autoPlay`. When a page's narration ends (`onEnded`), the reader acts on the number of links: if the page has **one** ready link, it moves to the next page after **900 ms** (condensed: `setTimeout(() => { V.current = null; X(e.toPageId) }, 900)`, [@26732](../source/js/36tbz-w9v-p8v.js)); if it has **none**, it shows the ending; if it has **two** (a choice), it stops and waits for the child. Read: the book plays like an audiobook between choices, and only the child's decision stops it.
- The landing page sums it up as "Berättarrösten läser högt, sida för sida. Två gånger i varje bok stannar berättelsen: ert barn väljer…" [The narrator reads aloud, page by page. Twice in every book the story stops: your child chooses…] ([`3d9nxlx1n5pdy.js`](../source/js/3d9nxlx1n5pdy.js) `steps.read.body`).

### 3.5 Landing page: `NarrationPlayPill` ("Hör berättarrösten")

Code: [`landing-play-pill.3d9nxlx1n5pdy.pretty.js`](../derived/audio/js-excerpts/landing-play-pill.3d9nxlx1n5pdy.pretty.js) ([`3d9nxlx1n5pdy.js` @20858](../source/js/3d9nxlx1n5pdy.js) export name, component body around @15185). CSS: [`3q17cp_jgfwol.pretty.css:2798-2852`](../source/css/3q17cp_jgfwol.pretty.css) plus the ≤480 px and reduced-motion overrides at `:3201-3227`.

| Key | sv | en |
|---|---|---|
| `playLabel` | Hör berättarrösten | Hear the narrator |
| `playingLabel` | Spelar... | Playing... |
| `voiceChip` | Morfar | Grandpa Erik |
| `audioSrc` | `/landing/voice/grandpa-sample.mp3` | `/landing/voice/grandpa-sample-en.mp3` |
| `micro` | Inga låtsasval. Båda vägarna är skrivna, målade och inlästa. | No pretend choices. Both paths are written, painted, and narrated. |

```css
/* 3q17cp_jgfwol.pretty.css:2804-2833, 2834-2852 (verbatim, whitespace condensed) */
.hiw-play { cursor: pointer; font-family: var(--ui); min-height: 48px; color: var(--btn-ink); background: var(--btn-grad);
  box-shadow: var(--btn-shadow), inset 0 1px 0 #ffffff73; border: none; border-radius: 999px; align-items: center; gap: 10px;
  padding: 12px 22px; font-size: 0.95rem; font-weight: 700; transition: transform 0.25s cubic-bezier(0.2, 0.7, 0.3, 1.4), box-shadow 0.3s; display: inline-flex; }
.hiw-play:hover { box-shadow: var(--btn-shadow-hover); transform: translateY(-2px); }
.hiw-play svg { flex: none; width: 16px; height: 16px; }
.hiw-voice-chip { font-family: var(--ui); color: var(--chip-ink); background: var(--chip-bg); border: 1px solid var(--chip-line); border-radius: 999px;
  align-items: center; gap: 8px; padding: 5px 12px 5px 5px; font-size: 0.85rem; font-weight: 700; display: inline-flex; }
.hiw-voice-chip img { object-fit: cover; border-radius: 50%; width: 28px; height: 28px; }
```

- The pill is a gold primary button with a filled play triangle (`M8 5.5v13l11-6.5z`) that becomes pause bars (`M7 5h4v14H7zM13 5h4v14h-4z`). Its label flips to "Spelar..." while playing. It sets `aria-pressed`. On play it fires the analytics event `track("cta_clicked", { cta: "hear_voice", surface, lang })`. The `<audio>` has `preload="none"`, so nothing downloads until the click (also in the server HTML: [`source/html/home.sv.html`](../source/html/home.sv.html) `<audio src="/landing/voice/grandpa-sample.mp3" preload="none"`).
- Next to it is the **voice chip**: a 28 px round crop of the narrator painting [`assets/landing/voice/narrator-morfar.webp`](../assets/landing/voice/narrator-morfar.webp) (256 × 256) and the name "Morfar" / "Grandpa Erik". Screens: [`31-hiw-step-4-read__natt__desktop.webp`](../screenshots/components/landing/31-hiw-step-4-read__natt__desktop.webp), [`33-play-pill--focus-visible-tab11__natt__desktop.png`](../screenshots/components/landing/33-play-pill--focus-visible-tab11__natt__desktop.png), voice-chip rest/hover [`07_hiw-voice-chip_Morfar__rest.png`](../screenshots/states/sv__natt/07_hiw-voice-chip_Morfar__rest.png) / [`__hover.png`](../screenshots/states/sv__natt/07_hiw-voice-chip_Morfar__hover.png).
- **The picture and the sound do not match.** The mock reader under the pill shows page S2 of the Iris book: the first two sentences of `S2.prose`, cut with `.split(/(?<=\.)\s+/).slice(0, 2).join(" ")` ([@819](../source/js/3d9nxlx1n5pdy.js)), and the S2 choices. The pill, though, plays the generic voice-picker sample. In Swedish that is "Kevin smög närmare det gamla äppelträdet…" [Kevin crept closer to the old apple tree…]. In English it is "Come close my friend. Tonight, I am telling a story that belongs to you alone…" (machine transcripts, §6). The S2 narration that matches the picture exists ([`S2.mp3`](../assets/share/iris-sparade-platsen/assets/S2.mp3)) but is not used here.

### 3.6 Onboarding: "Berättarröst" [Narrator voice] sheet

Code: [`voice-picker-and-narrator-lines.0ad0wel9cyv30.pretty.js`](../derived/audio/js-excerpts/voice-picker-and-narrator-lines.0ad0wel9cyv30.pretty.js) and [`narrator-voices.390j9gbq0u9ce.pretty.js`](../derived/audio/js-excerpts/narrator-voices.390j9gbq0u9ce.pretty.js).

```js
// 390j9gbq0u9ce.js @32429 — CREATE_VOICES (verbatim values; Lily/Marcus/Saga URL lines elided as ...; full text in the excerpt file)
{ id: "grandpa", nameEn: "Grandpa Erik",     nameSv: "Morfar Erik",
  descriptionEn: "A warm, wise storyteller with a cozy bedtime voice",
  descriptionSv: "En varm, vis berättare med en mysig godnattstämma",
  sampleUrl: "/voices/grandpa.mp3", sampleUrlEn: "/voices/grandpa-en.mp3", portraitUrl: "/voices/portrait-grandpa.jpg" },
{ id: "female",  nameEn: "Storyteller Lily",  nameSv: "Berättaren Lily",
  descriptionEn: "A bright, expressive narrator full of wonder",
  descriptionSv: "En livfull, uttrycksfull berättare fylld av förundran", ... },
{ id: "male",    nameEn: "Narrator Marcus",   nameSv: "Berättaren Marcus",
  descriptionEn: "A steady, adventurous voice for exciting tales",
  descriptionSv: "En trygg, äventyrlig röst för spännande berättelser", ... },
{ id: "young",   nameEn: "Young Saga",        nameSv: "Unga Saga",
  descriptionEn: "An enthusiastic young voice that feels like a friend",
  descriptionSv: "En entusiastisk ung röst som känns som en kompis", ... },
"DEFAULT_CREATE_VOICE_ID", 0, "grandpa",
"voiceSampleUrl", 0, function (e, t) { return "en" === t ? e.sampleUrlEn : e.sampleUrl; }
```

- The sheet ([`start-s6-sheet-voice--panel__natt__desktop.png`](../screenshots/components/app/start-s6-sheet-voice--panel__natt__desktop.png)) shows four `.trait.voice` pills, each with a 13 px play triangle `M7 4.5l12 7.5-12 7.5z` (CSS [`2_gt301v4m-60.pretty.css:736-749`](../source/css/2_gt301v4m-60.pretty.css)). **Selecting a voice plays its sample straight away**: `F.current?.pause(); let t = new Audio(voiceSampleUrl(e, m)); t.play()` ([`0ad0wel9cyv30.js` @42597](../source/js/0ad0wel9cyv30.js)). `m` is the **book's language**, not the UI language, so a Swedish UI choosing an English book hears the English sample. Each tap stops the previous sample.
- The choice goes to the backend as `narratorPersona` in the `/create/enqueue` body ([@41077](../source/js/0ad0wel9cyv30.js)). The recipe line reads it back as a sentence: `${narratorLabel} läser` / `reads`, for example "läses av Morfar Erik på svenska" [read by Grandpa Erik in Swedish] (see [05b](05b-components-app-and-forms.md)).
- Portraits ([`derived/brand/narrators/`](../derived/brand/narrators/), 400 × 400, watercolour) and a cast sheet: [`derived/brand/narrator-cast.webp`](../derived/brand/narrator-cast.webp).

### 3.7 The narrator also speaks in the UI copy (text only)

During onboarding and waiting, the narrator "talks" in first person, in italic serif. These lines are text, not audio:

- `storyteller`: "Vilken hjälte ni har byggt. Jag börjar berätta så fort ni säger till." [What a hero you have built. I start telling the moment you say the word.] ([`0ad0wel9cyv30.js` @12576](../source/js/0ad0wel9cyv30.js))
- `voiceLineLead` + name + `voiceLineTail`: "Jag skriver, målar och övar på att säga {name} precis rätt." [I am writing, painting, and practising saying {name} just right.] ([@14342](../source/js/0ad0wel9cyv30.js)). Read: the product presents correct pronunciation of the child's name as the narrator's own craft.
- Hand-over (`ledeLead` + name + `ledeMid` + name + `ledeTail`): "Härifrån är boken {name}: stora bilder, berättarrösten, och ingenting {name} måste läsa själv." [From here the book is {name}'s: big pictures, the storyteller's voice, and nothing {name} has to read alone.] (as rendered in [05b](05b-components-app-and-forms.md))

### 3.8 Level design: what the listener actually hears

| Signal | File loudness | Element gain | Heard at | Evidence |
|---|---|---|---|---|
| Book narration | −18.5 … −19.9 LUFS (mean −19.4) | 1.0 (never set) | ≈ −19 LUFS | [`audio-specs.csv`](../derived/audio/audio-specs.csv) |
| Bed, default | −24.3 … −24.7 LUFS | 0.18 (−14.9 dB) | ≈ **−39.3 LUFS** | `in_app_level_default_lufs` |
| Bed, slider at max | same | 0.4 (−8.0 dB) | ≈ **−32.4 LUFS** | `in_app_level_max_lufs` |
| Landing / picker Morfar sample | −26.6 (sv), −26.8 (en) | 1.0 | −26.6 / −26.8 | §2.2 |
| Other picker samples | −19.4 … −27.5 | 1.0 | 8 dB spread between voices | §2.2 |

- The beds are normalised to one shared loudness of about −24.4 LUFS, so switching beds keeps the level steady. The code then drops them about 15 dB. At the default setting the bed sits **≈ 20 LU under the narration**, and even at the maximum it sits ≈ 13 LU under. The voice always stays on top.
- Chart: [`derived/audio/loudness-map.png`](../derived/audio/loudness-map.png).
- Caveat (known platform behaviour, not tested here): iOS Safari ignores writes to `HTMLMediaElement.volume`. On an iPhone the bed would play at its file level, about −24 LUFS, only ≈ 5 LU under the narration.

---

## 4. The narrator: Morfar Erik / Grandpa Erik

### 4.1 Identity (literal)

| Field | Value | Source |
|---|---|---|
| id | `grandpa` (default voice) | [`390j9gbq0u9ce.js` @32429](../source/js/390j9gbq0u9ce.js) |
| Swedish name | Morfar Erik. The landing chip shortens it to "Morfar" | ibid., [`3d9nxlx1n5pdy.js` @2336](../source/js/3d9nxlx1n5pdy.js) `voiceChip:"Morfar"` |
| English name | Grandpa Erik (landing chip uses the full name) | ibid., [`3d9nxlx1n5pdy.js` @5162](../source/js/3d9nxlx1n5pdy.js) `voiceChip:"Grandpa Erik"` |
| Description | "En varm, vis berättare med en mysig godnattstämma" / "A warm, wise storyteller with a cozy bedtime voice" | ibid. |
| Portrait | white hair and beard, round glasses, mustard cable-knit cardigan over a blue-check shirt, holding a small book with an acorn on the cover; watercolour and coloured pencil on cream | [`portrait-grandpa.jpg`](../derived/brand/narrators/portrait-grandpa.jpg) (400 × 400), [`narrator-morfar.webp`](../assets/landing/voice/narrator-morfar.webp) (256 × 256, same painting) |
| Persona in the sample book | `"narratorPersona": "grandpa"` | [sample-book JSON](../source/sample-book.iris-och-den-sparade-platsen.json), also embedded at [`3d9nxlx1n5pdy.js` @59519](../source/js/3d9nxlx1n5pdy.js) |

### 4.2 How the narration was made (provenance)

Each beat's audio record in the sample-book JSON (`beats[].assets.audio`) reads:

```json
{ "kind": "audio", "path": "/share/iris-sparade-platsen/assets/S1.mp3",
  "provider": "vertex-gemini-tts:gemini-3.1-flash-tts-preview:Enceladus",
  "meta": { "ms": 34596, "normalization": "ffmpeg-loudnorm:-23LUFS:-2dBTP:11LRA" } }
```

- **Engine and voice.** Google Gemini TTS (`gemini-3.1-flash-tts-preview`) through Vertex AI, prebuilt voice **Enceladus**, on all 14 beats. Google's catalogue describes Enceladus as "breathy" (outside knowledge, not stated on the site). The persona "grandpa" is therefore a direction applied to that voice, probably as a prompt. The prompt itself runs server-side and is not in any harvested file.
- **`meta.ms` is not the duration.** S1 says 34 596 ms, but the file is 67.04 s long. Across the 14 beats `meta.ms` runs 26 155–41 457 while the files run 53.3–72.5 s. The cover image record has the same field (`cover.meta.ms: 57340`). Read: it is most likely generation wall-clock time.
- **The label says −23 LUFS, but the files measure louder.** Measured integrated loudness is −18.5 to −19.9 LUFS. `loudnorm` analysis of S1 gives `input_i −18.85, input_tp −2.15, input_lra 6.00`. True peak, −2.0 to −2.4 dBTP, does match the `-2dBTP` part. The files are **48 kHz** with almost no energy above ≈ 13 kHz (−60 dB bandwidth 11.9–13.3 kHz). Read: a 24 kHz TTS render was resampled, probably by the `loudnorm` step, which outputs 192 kHz internally. The voice samples have kept 24 kHz.

### 4.3 Pace and pauses (all 14 beats, from [`narration-text-match.csv`](../derived/audio/narration-text-match.csv))

| Measure | Range across beats | Mean |
|---|---|---|
| Words per page (source prose) | 100–128 | 108 |
| File duration | 53.28–72.52 s | 63.95 s |
| Words/min, whole file | 86.9–114.6 | 101.8 |
| Words/min, pauses removed (articulation) | 118.2–146.5 | 129.1 |
| Syllables/s while speaking (vowel-group estimate) | 3.60–4.20 | 3.91 |
| Pauses ≥ 0.2 s at −40 dBFS, per page | 13–25 | 19.1 |
| Pause share of the speech span | 13.8–27.1 % | 20.0 % |
| Median pause per page | 0.44–1.17 s | 0.66 s |
| Longest pause | 2.27 s (S5BB) | |
| Silence before the first word | 0–1.47 s | median 0.36 s |

Chart: [`derived/audio/narration-pacing.png`](../derived/audio/narration-pacing.png). Pause positions are shaded violet in every narration waveform, for example [`narration__S1__waveform.png`](../derived/audio/plots/narration__S1__waveform.png).

Read: about 100 wpm with a fifth of the time silent is a **slow, deliberate bedtime read**. For comparison (outside knowledge), adult audiobook narration typically runs about 150–160 wpm and conversational Swedish about 5 syllables/s. A pause of half a second to a second follows almost every sentence, which gives a child time to look at the picture. The last page of the longest path, S6BB, is the slowest (86.9 wpm, 24.6 % pauses), so the reading slows down as the story ends.

### 4.4 Pitch and timbre

- **F0 (pitch)**: medians 93–119 Hz across the 14 beats. The 10th–90th percentile range is 8.9–14.4 semitones. That is a low adult male voice with a wide, sing-song storytelling contour, not a monotone ([`voice-pitch.png`](../derived/audio/voice-pitch.png)).
- **Energy**: 38–66 % of each file's energy lies in 80–250 Hz and 14–38 % in 250–1000 Hz. Very little lies above 4 kHz (4–8 kHz: 2.8–18.1 %; above 8 kHz: 0.7–8.0 %). Spectral centroid medians are 422–1035 Hz. Read: chesty, close and warm, with soft sibilance. The [spectrograms](../derived/audio/plots/narration__S1__spectrogram.webp) show the voice ending at about 12–13 kHz.
- **Acted dialogue.** Aligning the prose quotes to the machine transcript's word timings shows the narrator **changes register for dialogue** ([`narration-dialogue-vs-narration.json`](../derived/audio/narration-dialogue-vs-narration.json)):

| Beat | Quoted words | F0 in dialogue | F0 in narration | Shift | Who speaks (from the prose) |
|---|---|---|---|---|---|
| S1 | 46 | 124.0 Hz | 101.3 Hz | +3.5 st | Amina ("frågade hon"), Mossa ("sa han") |
| S2 | 15 | 163.3 Hz | 114.3 Hz | +6.2 st | Mossa ("sa Mossa"), Amina |
| S3A | 14 | 155.3 Hz | 103.6 Hz | +7.0 st | Amina ("sa hon") |
| S3B | 7 | 81.2 Hz | 96.4 Hz | -3.0 st | Mossa ("sa han") |
| S4A | 10 | 129.0 Hz | 100.0 Hz | +4.4 st | Mossa, Amina |
| S4B | 13 | 103.9 Hz | 117.6 Hz | -2.1 st | Mossa, Amina |
| S5BB | 1 | 183.9 Hz | 117.6 Hz | +7.7 st | Amina, one word ("Vänta", "sa hon") |
| S6AA | 9 | 119.4 Hz | 100.0 Hz | +3.1 st | Mossa ("viskade han") |
| S6AB | 7 | 83.6 Hz | 100.0 Hz | -3.1 st | Iris ("viskade Iris") |
| S6BA | 5 | 113.5 Hz | 117.6 Hz | -0.6 st | Mossa ("sa han") |
| S6BB | 11 | 112.7 Hz | 92.0 Hz | +3.5 st | Mossa ("mumlade han") |
| **all** | | **124.0 Hz** (p10–p90 82.1–187.8) | **106.0 Hz** (p10–p90 80.4–168.4) | **+2.7 st** | |

Read: the narrator voices the characters. Amina's lines go up about a fifth (+7.0 st in S3A, +7.7 st on her single word in S5BB; +6.2 st in S2, where she and Mossa both speak). The mouse Mossa stays within about ±3.5 st of the narrating pitch (S3B −3.0, S6BA −0.6, S6AA +3.1, S6BB +3.5). Iris's one whispered line drops 3.1 st (S6AB). These figures come from few words per beat and an automatic alignment, so treat them as indicative.

### 4.5 Swedish vs English Morfar

The only English Morfar recording is the 12 s sample. No English narrated book was harvested.

| | Swedish sample | English sample |
|---|---|---|
| Text (machine transcript) | "Kevin smög närmare det gamla äppelträdet. Där, mellan två rötter, låg en liten dörr på glänt. Kom, viskade Miro. Den har väntat på oss." [Kevin crept closer to the old apple tree. There, between two roots, a little door stood ajar. Come, whispered Miro. It has been waiting for us.] | "Come close my friend. Tonight, I am telling a story that belongs to you alone, and I will keep every word warm." |
| Kind of text | a story excerpt (the same script all four Swedish voices read) | a direct address to the child, in character |
| Duration / words / wpm | 13.00 s / 24 / 111 | 12.00 s / 22 / 110 |
| F0 median (p10–p90) | 138 Hz (88–175), 12.0 st | 100 Hz (78–153), 11.6 st |
| Loudness | −26.6 LUFS, TP −8.0 | −26.8 LUFS, TP −8.0 |

Read: the English grandpa is pitched like the book narration (≈ 100 Hz). The Swedish sample is pitched higher and more animated (138 Hz), so it may be a different take or a different voice from the Enceladus narration. Both read at about 110 wpm, close to the book's pace. The English line "I will keep every word warm" is the brand promise in the narrator's mouth.

### 4.6 Character description (interpretation)

Morfar Erik sounds like a **man in his late sixties or seventies**, judging by the low F0, the breathy and soft top end, and the portrait the product pairs with him. He reads **slowly and evenly**, about 100 wpm, without rushing to the end of a page. He **breathes between sentences**, with pauses of half a second to a second. He keeps a **gently rising-falling storytelling melody** (≈ 12 st range) and **plays the dialogue**: a lighter, higher voice for Amina, a near-natural one for the mouse. His loudness is controlled, with an LRA of 3.8–7.8 LU, so nothing is shouted and nothing is lost. He is the voice of a grandparent on the edge of the bed, not of a performer. The Swedish *morfar*, specifically the mother's father, makes the persona family-specific and Nordic. "Grandpa Erik" keeps the Scandinavian first name in English.

---

## 5. Narration matched to text, beat by beat

The prose is taken verbatim from [`source/sample-book.iris-och-den-sparade-platsen.json`](../source/sample-book.iris-och-den-sparade-platsen.json) (`beats[].prose`). Words-per-minute uses the **source word count**. The audio was also transcribed with an offline speech recogniser (faster-whisper *medium*, int8, CPU) to check that it says the text. Word error rate against the source is **0.9–10.7 %** (mean 4.0 %). Every difference found is a recognition-level slip: compounds split or joined ("min skog" → "minskog"), near-homophones ("log" → "låg"), or "fågeln" → "fågen". **No sentence was added, dropped or re-ordered.** One possible pronunciation quirk: in S5AA the recogniser heard the companion's name "Mossa" as "mosa" four times, which could mean the TTS lengthens the vowel there. This is unverified.

### 5.1 Per-beat table

Role: *linear* = one next page; *choice point* = the page after which the child chooses (S2, S4A, S4B); *ending* = slot 6. WER = machine-transcript word error rate against the source.

| Beat | Slot / role | Duration | Speech starts | Words | WPM (file) | WPM (articulation) | Syll/s | Pauses ≥0.2 s (share) | Median / max pause | LUFS-I | TP | F0 median | ASR WER | Files |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 | 1 · linear | 67.04 s | 0.31 s | 128 | 115 | 146 | 3.89 | 25 (21 %) | 0.5 / 1.34 s | -18.7 | -2.2 | 109 Hz | 2.3 % | [mp3](../assets/share/iris-sparade-platsen/assets/S1.mp3) · [wave](../derived/audio/plots/narration__S1__waveform.png) · [spec](../derived/audio/plots/narration__S1__spectrogram.webp) · [asr](../derived/audio/asr/assets__S1.asr.json) |
| S2 | 2 · choice point | 67.44 s | 0.48 s | 114 | 101 | 130 | 3.76 | 21 (21 %) | 0.56 / 1.48 s | -19.5 | -2.2 | 119 Hz | 2.6 % | [mp3](../assets/share/iris-sparade-platsen/assets/S2.mp3) · [wave](../derived/audio/plots/narration__S2__waveform.png) · [spec](../derived/audio/plots/narration__S2__spectrogram.webp) · [asr](../derived/audio/asr/assets__S2.asr.json) |
| S3A | 3 · linear | 64.28 s | 0.28 s | 110 | 103 | 127 | 3.84 | 24 (18 %) | 0.44 / 1.0 s | -19.7 | -2.4 | 110 Hz | 0.9 % | [mp3](../assets/share/iris-sparade-platsen/assets/S3A.mp3) · [wave](../derived/audio/plots/narration__S3A__waveform.png) · [spec](../derived/audio/plots/narration__S3A__spectrogram.webp) · [asr](../derived/audio/asr/assets__S3A.asr.json) |
| S3B | 3 · linear | 66.08 s | 1.33 s | 106 | 96 | 126 | 3.98 | 14 (22 %) | 1.03 / 1.9 s | -19.5 | -2.3 | 95 Hz | 0.9 % | [mp3](../assets/share/iris-sparade-platsen/assets/S3B.mp3) · [wave](../derived/audio/plots/narration__S3B__waveform.png) · [spec](../derived/audio/plots/narration__S3B__spectrogram.webp) · [asr](../derived/audio/asr/assets__S3B.asr.json) |
| S4A | 4 · choice point | 53.28 s | 0.30 s | 100 | 113 | 142 | 4.12 | 13 (20 %) | 0.71 / 1.62 s | -18.5 | -2.4 | 105 Hz | 6.0 % | [mp3](../assets/share/iris-sparade-platsen/assets/S4A.mp3) · [wave](../derived/audio/plots/narration__S4A__waveform.png) · [spec](../derived/audio/plots/narration__S4A__spectrogram.webp) · [asr](../derived/audio/asr/assets__S4A.asr.json) |
| S4B | 4 · choice point | 57.24 s | 0.35 s | 102 | 107 | 128 | 3.97 | 18 (15 %) | 0.53 / 0.82 s | -18.9 | -2.4 | 113 Hz | 3.9 % | [mp3](../assets/share/iris-sparade-platsen/assets/S4B.mp3) · [wave](../derived/audio/plots/narration__S4B__waveform.png) · [spec](../derived/audio/plots/narration__S4B__spectrogram.webp) · [asr](../derived/audio/asr/assets__S4B.asr.json) |
| S5AA | 5 · linear | 62.28 s | 0.37 s | 107 | 103 | 121 | 3.6 | 16 (14 %) | 0.52 / 0.93 s | -19.6 | -2.3 | 93 Hz | 6.5 % | [mp3](../assets/share/iris-sparade-platsen/assets/S5AA.mp3) · [wave](../derived/audio/plots/narration__S5AA__waveform.png) · [spec](../derived/audio/plots/narration__S5AA__spectrogram.webp) · [asr](../derived/audio/asr/assets__S5AA.asr.json) |
| S5AB | 5 · linear | 63.20 s | 0.42 s | 103 | 98 | 133 | 4.08 | 22 (25 %) | 0.68 / 1.64 s | -19.8 | -2.3 | 105 Hz | 10.7 % | [mp3](../assets/share/iris-sparade-platsen/assets/S5AB.mp3) · [wave](../derived/audio/plots/narration__S5AB__waveform.png) · [spec](../derived/audio/plots/narration__S5AB__spectrogram.webp) · [asr](../derived/audio/asr/assets__S5AB.asr.json) |
| S5BA | 5 · linear | 69.16 s | 1.09 s | 114 | 99 | 125 | 3.73 | 17 (19 %) | 0.73 / 1.47 s | -19.1 | -2.2 | 99 Hz | 0.9 % | [mp3](../assets/share/iris-sparade-platsen/assets/S5BA.mp3) · [wave](../derived/audio/plots/narration__S5BA__waveform.png) · [spec](../derived/audio/plots/narration__S5BA__spectrogram.webp) · [asr](../derived/audio/asr/assets__S5BA.asr.json) |
| S5BB | 5 · linear | 65.04 s | 0.00 s | 107 | 99 | 136 | 4.2 | 16 (27 %) | 1.17 / 2.27 s | -19.4 | -2.2 | 118 Hz | 0.9 % | [mp3](../assets/share/iris-sparade-platsen/assets/S5BB.mp3) · [wave](../derived/audio/plots/narration__S5BB__waveform.png) · [spec](../derived/audio/plots/narration__S5BB__spectrogram.webp) · [asr](../derived/audio/asr/assets__S5BB.asr.json) |
| S6AA | 6 · ending | 63.60 s | 0.28 s | 110 | 104 | 123 | 3.7 | 17 (15 %) | 0.53 / 1.0 s | -19.3 | -2.0 | 101 Hz | 2.7 % | [mp3](../assets/share/iris-sparade-platsen/assets/S6AA.mp3) · [wave](../derived/audio/plots/narration__S6AA__waveform.png) · [spec](../derived/audio/plots/narration__S6AA__spectrogram.webp) · [asr](../derived/audio/asr/assets__S6AA.asr.json) |
| S6AB | 6 · ending | 65.60 s | 0.31 s | 105 | 96 | 121 | 3.89 | 22 (20 %) | 0.58 / 1.25 s | -19.9 | -2.3 | 99 Hz | 3.8 % | [mp3](../assets/share/iris-sparade-platsen/assets/S6AB.mp3) · [wave](../derived/audio/plots/narration__S6AB__waveform.png) · [spec](../derived/audio/plots/narration__S6AB__spectrogram.webp) · [asr](../derived/audio/asr/assets__S6AB.asr.json) |
| S6BA | 6 · ending | 58.52 s | 0.51 s | 103 | 106 | 131 | 4.14 | 19 (18 %) | 0.55 / 1.11 s | -19.3 | -2.4 | 117 Hz | 7.8 % | [mp3](../assets/share/iris-sparade-platsen/assets/S6BA.mp3) · [wave](../derived/audio/plots/narration__S6BA__waveform.png) · [spec](../derived/audio/plots/narration__S6BA__spectrogram.webp) · [asr](../derived/audio/asr/assets__S6BA.asr.json) |
| S6BB | 6 · ending | 72.52 s | 1.47 s | 105 | 87 | 118 | 3.86 | 23 (25 %) | 0.71 / 2.01 s | -19.9 | -2.4 | 96 Hz | 5.7 % | [mp3](../assets/share/iris-sparade-platsen/assets/S6BB.mp3) · [wave](../derived/audio/plots/narration__S6BB__waveform.png) · [spec](../derived/audio/plots/narration__S6BB__spectrogram.webp) · [asr](../derived/audio/asr/assets__S6BB.asr.json) |

### 5.2 The four reading paths

| Path (6 pages) | Narration total | Words | + listen-mode gaps (3 × 900 ms) |
|---|---|---|---|
| S1 → S2 → S3A → S4A → S5AA → S6AA | 377.9 s (6 min 18 s) | 669 | 380.6 s |
| S1 → S2 → S3A → S4A → S5AB → S6AB | 380.8 s (6 min 21 s) | 660 | 383.5 s |
| S1 → S2 → S3B → S4B → S5BA → S6BA | 385.5 s (6 min 25 s) | 667 | 388.2 s |
| S1 → S2 → S3B → S4B → S5BB → S6BB | 395.4 s (6 min 35 s) | 662 | 398.1 s |

Read: a whole bedtime book is **about six and a half minutes of voice**. The landing copy promises the making takes "ungefär tio minuter" [about ten minutes] and is "Lagom tid för tandborstning och pyjamas." [Just enough time for toothbrushing and pajamas.] ([`3d9nxlx1n5pdy.js`](../source/js/3d9nxlx1n5pdy.js) `steps.adventure`).

### 5.3 Source text and machine transcript per beat

Each block quotes the prose verbatim, then the machine transcript of the audio for comparison. Swedish story text is not glossed line by line; the story summary is in [`source/sample-book.iris-och-den-sparade-platsen.json`](../source/sample-book.iris-och-den-sparade-platsen.json) `throughline`. Dialogue in the prose uses straight double quotes. The recogniser renders it with Swedish dialogue dashes.

<details><summary><b>S1</b> · 128 words · 67.04 s · <a href="../assets/share/iris-sparade-platsen/assets/S1.mp3">S1.mp3</a></summary>

Source text, verbatim (`beats[beatId="S1"].prose`):

> Iris kom till kvartersbiblioteket med ett stort ritpapper under armen. Hon hade sparat fönsterplatsen åt Mossa. Där skulle kvällsljuset räcka över hela deras teckning. Men ett nytt barn hade hunnit sätta sig där först. Flickan hette Amina och höll en grön penna redo.
>
> "Kan vi ta en sista ritstund här i fönsterljuset?" frågade hon.
>
> Mossa kikade fram ur Iris luva och snurrade halsduken ett varv.
>
> "Det var ju platsen vi skulle ha", sa han. Sedan såg han på Amina. "Fast nu sitter du där, och jag vill inte tränga bort dig. Iris, kan vi ta vår sista ritstund på gröna mattan i stället? Där ryms en karta stor som en skog."
>
> Iris såg från den tagna fönsterplatsen till mattan. Före sagostunden fanns det bara tid för en ritstund.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 2.3 %):

> Iris kom till kvartersbiblioteket med ett stort ritpapper under armen. Hon hade sparat fönsterplatsen åt Mossa. Där skulle kvällsljuset räcka över hela deras teckning. Men ett nytt barn hade hunnit sätta sig där först. Flickan heter Amina och höll en grön penna redo. – Kan vi ta en sista ritstund här i fönsterljuset? – frågade hon. Mossa kikade fram ur Iris' luva och snurrade halsduken ett varv. – Det var ju platsen vi skulle ha, sa han. Sedan såg han på Amina. – Fast nu sitter du där och jag vill inte tränga bort dig. Iris, kan vi ta vår sista ritstund på gröna mattan istället, där ryms en karta stor som en skog? Iris såg från den tagna fönsterplatsen till mattan. Före sagostunden fanns det bara tid för en ritstund.

</details>

<details><summary><b>S2</b> · 114 words · 67.44 s · <a href="../assets/share/iris-sparade-platsen/assets/S2.mp3">S2.mp3</a></summary>

Source text, verbatim (`beats[beatId="S2"].prose`):

> Iris gick in mellan fönsterbänken och mattan och lade ritpappret på ett lågt bord. Planen för den sparade platsen gällde inte längre. Nu väntade Mossa på mattan, medan Amina ville rita med Iris i fönsterljuset.
>
> När Iris ritade med någon annan brukade hon börja på ena sidan. Då blev det en riktig plats kvar för den andras idé, inte bara en smal kant. Hon drog fingertoppen genom luften över pappret. Här kunde hennes bild vara. Där kunde någon annans ta vid.
>
> "Kom nu", sa Mossa. "Jag har ju tre krokiga stigar i huvudet."
>
> Amina knackade på fönsterbänken. "Ljuset är fint just här."
>
> Sagoboken låg redan framme. När ritstunden var slut skulle bibliotekarien öppna den.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 2.6 %):

> Iris gick in mellan fönsterbänken och mattan och låg det ritpappret på ett lågt bord. Planen för den sparade platsen gällde inte längre. Nu väntade Mossa på mattan medan Amina ville rita med Iris i fönsterljuset. När Iris ritade med någon annan brukade hon börja på ena sidan. Då blev det en riktig plats kvar för den andras idé, inte bara en smal kant. Hon drog fingertoppen genom luften över pappret. Här kunde hennes bild vara. Där kunde någon annans ta vid. – Kom nu, sa Mossa, jag har ju tre krokiga stigar i huvudet! Amina knackade på fönsterbänken. – Ljuset är fint just här! Sagoboken låg redan fram. När ritstunden var slut skulle bibliotekarien öppna den.

</details>

<details><summary><b>S3A</b> · 110 words · 64.28 s · <a href="../assets/share/iris-sparade-platsen/assets/S3A.mp3">S3A.mp3</a></summary>

Source text, verbatim (`beats[beatId="S3A"].prose`):

> Iris gick med Mossa till den gröna mattan. Hon bar dit ritpappret och lade det mitt framför dem. Amina lämnade fönsterbänken och satte sig vid papprets andra kant.
>
> "Då blir det ingen ritstund i fönsterljuset", sa hon. "Men jag vill gärna hjälpa till här."
>
> Iris ritade gröna mossöar på ena sidan och lämnade öppna platser intill. Mossa ritade kartans stigar. Han ville använda bibliotekets sista tur med silverpennan till en måne. Amina ritade träden och ville använda samma sista tur till en fågel.
>
> Bibliotekarien lade silverpennan bredvid pappret och höll upp ett finger. Efter nästa tecken skulle mosskartan hängas upp. Två tomma platser väntade, men bara en kunde bli silverblank.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 0.9 %):

> Iris gick med mossa till den gröna mattan. Hon bar dit ritpappret och lade det mitt framför dem. Amina lämnade fönsterbänken och satte sig vid papprets andra kant. – Då blir det ingen ritstund i fönsterljuset, sa hon. – Men jag vill gärna hjälpa till här. Iris ritade gröna mossöar på ena sidan och lämnade öppna platser intill. Mossa ritade kartans stikar. Han ville använda bibliotekets sista tur med silverpennan till en måne. Amina ritade träden och ville använda samma sista tur till en fågel. Bibliotekarien lade silverpennan bredvid pappret och höll upp ett finger. Efter nästa tecken skulle mosskartan hängas upp. Två tomma platser väntade, men bara en kunde bli silverblank.

</details>

<details><summary><b>S3B</b> · 106 words · 66.08 s · <a href="../assets/share/iris-sparade-platsen/assets/S3B.mp3">S3B.mp3</a></summary>

Source text, verbatim (`beats[beatId="S3B"].prose`):

> Iris stannade och ritade med Amina i fönsterljuset. Hon lyfte upp ritpappret på fönsterbänken och satte sig bredvid. Mossa kom efter, men den sista ritstunden på gröna mattan var förbi.
>
> "Jaha", sa han och snurrade halsduken. "Då får väl molnen flyga hit."
>
> Iris ritade en rund solfågel på ena sidan och lämnade öppna platser runt den. Mossa ritade molnen. Han ville använda bibliotekets sista tur med silverpennan till en stjärna. Amina ritade solfågelns vingar och ville använda samma sista tur till ett bo.
>
> Bibliotekarien lade silverpennan på fönsterbänken och höll upp ett finger. Efter nästa tecken skulle bilden hängas upp. Bara en idé kunde bli silverblank.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 0.9 %):

> Iris stannade och ritade med Amina i fönsterljuset. Hon lyfte upp ritpappret på fönsterbänken och satte sig bredvid. Mossa kom efter, men den sista ritstunden på gröna mattan var förbi. Jaha, sa han, och snurrade halsduken. Då får väl molnen flyga hit. Iris ritade en rund solfågel på ena sidan och lämnade öppna platser runt den. Mossa ritade molnen. Han ville använda bibliotekets sista tur med silverpennan till en stjärna. Amina ritade solfågens vingar och ville använda samma sista tur till ett bo. Bibliotekarien lade silverpennan på fönsterbänken och höll upp ett finger. Efter nästa tecken skulle bilden hängas upp. Bara en idé kunde bli silverblank.

</details>

<details><summary><b>S4A</b> · 100 words · 53.28 s · <a href="../assets/share/iris-sparade-platsen/assets/S4A.mp3">S4A.mp3</a></summary>

Source text, verbatim (`beats[beatId="S4A"].prose`):

> Bibliotekarien bar mosskartan till det låga bordet vid väggen. Iris lade handen på ena hörnet så att pappret låg stilla. Mossa stod vid platsen ovanför stigarna. Amina satt vid platsen bredvid träden. Silverpennan låg mitt emellan dem.
>
> "Månen visar ju vägen genom min skog", sa Mossa.
>
> "Och fågeln kan visa var träden slutar", sa Amina.
>
> Båda tecknen skulle fylla en hel tur. Bibliotekarien höll redan upp klämmorna som kartan skulle hängas i direkt efter nästa tur. Iris såg de två platser hon lämnat. Det brände i fingertopparna. Hon ville rycka åt sig pennan och försöka hinna allt på en gång.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 6.0 %):

> Bibliotekarien bar mosskartan till det låga bordet vid väggen. Iris lade handen på ena hörnet så att pappret låg stilla. Mossa stod vid platsen ovanför stigarna. Amina satt vid platsen bredvid träden. Silverpennan låg mitt emellan dem. Månen visar ju vägen genom minskog, sa Mossa. Och fågen kan visa vad träden slutar, sa Amina. Båda tecknen skulle fylla en hel tur. Bibliotekarien höll redan upp klämmorna som kartan skulle hänga sig direkt efter nästa tur. Iris såg de två platser hon lämnat. Det brände i fingertopparna. Hon ville rycka åt sig pennan och försöka hinna allt på en gång.

</details>

<details><summary><b>S4B</b> · 102 words · 57.24 s · <a href="../assets/share/iris-sparade-platsen/assets/S4B.mp3">S4B.mp3</a></summary>

Source text, verbatim (`beats[beatId="S4B"].prose`):

> Bibliotekarien bar solfågelbilden till det låga bordet vid väggen. Iris höll pappret stilla. Mossa stod vid den öppna platsen ovanför molnen. Amina satt vid den öppna platsen mellan vingarna. Silverpennan låg mitt emellan dem.
>
> "Min stjärna skulle lysa över molnen", sa Mossa.
>
> "Mitt bo skulle höra ihop med vingarna", sa Amina.
>
> Båda tecknen skulle ta en hel tur. Bibliotekarien väntade med klämmorna och skulle hänga upp bilden direkt efter nästa tecken. Iris hade lämnat plats för båda idéerna, men silverpennan räckte bara till en. Det hettade i händerna. De ville gripa pennan och fara över pappret fortare än någon hann säga stopp.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 3.9 %):

> Bibliotekarien bar solfågelbilden till det låga bordet vid väggen. Iris höll pappret stilla. Mossa stod vid den öppna platsen ovanför molnen. Amina satt vid den öppna platsen mellan vingarna. Silvepennan låg mitt emellan dem. Min stjärna skulle lysa över molnen, sa Mossa. Mitt bo skulle höra ihop med vingarna, sa Amina. Båda tecknen skulle ta en hel tur. Bibliotekarien väntade med klämmorna och skulle hänga upp bilden direkt efter nästa tecken. Iris hade lämnat plats för båda idéerna, men silvepennan räckte bara till en. Det hettade i händerna. De ville gripa pennan och fara över pappret fortare än någon han säger stopp.

</details>

<details><summary><b>S5AA</b> · 107 words · 62.28 s · <a href="../assets/share/iris-sparade-platsen/assets/S5AA.mp3">S5AA.mp3</a></summary>

Source text, verbatim (`beats[beatId="S5AA"].prose`):

> Iris lät Mossa rita månen. Hon sköt silverpennan över bordet tills den låg framför tassarna och pekade på den öppna platsen ovanför stigarna.
>
> Mossa tog pennan med båda tassarna. Halsduken släpade genom mossan medan han ritade en rund måne. Iris höll kartan stilla utan att täcka träden eller platsen bredvid dem.
>
> Amina tittade på den tomma platsen där fågeln kunde ha varit. Hon knackade en gång mot bordet och drog sedan fingret längs sina träd.
>
> Mossa slöt månens ring. Silvermånen blinkade till fast ingen rörde pappret. Iris rätade på ryggen. Hon hade inte ryckt åt sig pennan. Kartan bar Mossas måne, och någon silverfågel fanns inte där.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 6.5 %):

> Iris lät Mosa rita månen. Hon sköt silverpennan över bordet tills den låg framför tassarna och pekade på den öppna platsen ovanför stigarna. Mosa tog pennan med båda tassarna. Hallstuken släpade genom mossan medan han ritade en rund måne. Iris höll kartan stilla, utan att täcka träden eller platsen bredvid dem. Amina tittade på den tomma platsen där fågen kunde ha varit. Hon knackade en gång mot bordet och drog sedan fingret längs sina träd. Mosa slöt månens ring. Silvermånen blinkade till fast ingen rörde pappret. Iris rätade på ryggen. Hon hade inte ryckt åt sig pennan. Kartan bar Mosas mån och någon silverfågel fanns inte där.

</details>

<details><summary><b>S5AB</b> · 103 words · 63.20 s · <a href="../assets/share/iris-sparade-platsen/assets/S5AB.mp3">S5AB.mp3</a></summary>

Source text, verbatim (`beats[beatId="S5AB"].prose`):

> Iris lät Amina rita fågeln. Hon räckte fram silverpennan, men fingrarna knep kvar om mitten. Pennan rörde sig inte. Amina höll i andra änden och väntade.
>
> Mossa snurrade halsduken ett varv. Iris såg platsen bredvid träden, den som hon själv hade lämnat öppen. Hon släppte pennan och lade handflatan på kartans kant i stället.
>
> Amina ritade en liten fågel med utbredda vingar. När näbben blev klar, flaxade silvervingarna en enda gång fast pappret låg stilla.
>
> Mossa tittade upp mot platsen ovanför stigarna. Ingen silvermåne fanns där. Iris drog inte tillbaka pennan. Fågeln fick kartans sista silverstreck, och Amina log så att flätorna gungade.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 10.7 %):

> Iris lät Amina rita fågeln. Hon räckte fram silvepennan, men fingrarna knep kvar om mitten. Pennan rördes inte. Amina höll i andra änden och väntade. Mossa snurrade halstuken ett varv. Iris såg platsen bredvid träden, den som hon skejv hade lämnat öppen. Hon släppte pennan och lade handflatan på kartans kant istället. Amina ritade en liten fågel med utbredda vingar. När näbben blev klar flaxade silvervingarna en enda gång fast pappret låg stilla. Mossa tittade upp mot platsen ovanför stigarna. Ingen silvermåne fanns där. Iris drog inte tillbaka pennan. Fågen fick kartans sista silversträck och Amina låg så att flätona gungade.

</details>

<details><summary><b>S5BA</b> · 114 words · 69.16 s · <a href="../assets/share/iris-sparade-platsen/assets/S5BA.mp3">S5BA.mp3</a></summary>

Source text, verbatim (`beats[beatId="S5BA"].prose`):

> Iris lät Mossa rita stjärnan. Hon vände pappret en aning på det låga bordet så att platsen ovanför molnen låg framför honom. Sedan rullade hon silverpennan över bordet till hans tassar.
>
> Mossa satte ena foten på pennan och styrde med hela kroppen. Först kom ett streck, sedan fem spetsar. Iris höll kvar sin solfågel på ena sidan och lämnade Aminas vingar fria på den andra.
>
> Amina följde den tomma platsen mellan vingarna med blicken. Där blev inget silverbo.
>
> När Mossa ritade sista spetsen, glimmade stjärnan och hoppade till på pappret. Mossa tappade nästan halsduken av förvåning. Iris skrattade till. Hon hade valt utan att knuffa sig före, och stjärnan lyste över deras gemensamma bild.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 0.9 %):

> Iris lät Mossa rita stjärnan. Hon vände pappret en aning på det låga bordet så att platsen ovanför molnen låg framför honom. Sedan rullade hon silverpennan över bordet till hans tassar. Mossa satte ena foten på pennan och styrde med hela kroppen. Först kom ett streck, sedan fem spetsar. Iris höll kvar sin solfågel på ena sidan och lämnade Aminas vingar fria på den andra. Amina följde den tomma platsen mellan vingarna med blicken. Där blev inget silverbo. När Mossa ritade sista spetsen glimmade stjärnan och hoppade till på pappret. Mossa tappade nästan halsduken av förvåning. Iris skrattade till. Hon hade valt utan att knuffa sig före och stjärnan lysste över deras gemensamma bild.

</details>

<details><summary><b>S5BB</b> · 107 words · 65.04 s · <a href="../assets/share/iris-sparade-platsen/assets/S5BB.mp3">S5BB.mp3</a></summary>

Source text, verbatim (`beats[beatId="S5BB"].prose`):

> Iris lät Amina rita boet. Amina sträckte sig efter silverpennan. Då lade Iris snabbt handen över den öppna platsen mellan vingarna.
>
> "Vänta", sa hon.
>
> Händerna ville fortfarande hinna först. Men under handflatan fanns platsen hon hade sparat åt någon annans idé. Iris flyttade handen till papprets kant och sköt pennan mot Amina.
>
> Amina ritade ett runt bo mellan vingarna. Mossa satt vid molnen och såg på platsen där stjärnan inte skulle komma. Han snurrade halsduken långsamt.
>
> När sista kvisten var ritad, puffade silverboet upp sig som om en osynlig fågel landat där. Iris höll pappret stadigt. Boet blev bildens sista silvertecken. Någon silverstjärna fanns inte ovanför molnen.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 0.9 %):

> Iris lät Amina rita boet. Amina sträckte sig efter silverpennan. Då lade Iris snabbt handen över den öppna platsen mellan vingarna. – Vänta! – sa hon. Händerna ville fortfarande hinna först. Men under handflatan fanns platsen hon hade sparat åt någon annans idé. Iris flyttade handen till papprets kant och sköt pennan mot Amina. Amina ritade ett runt bo mellan vingarna. Mossa satt vid molnen och såg på platsen där stjärnan inte skulle komma. Han snurrade halsduken långsamt. När sista kvisten var ritad puffade silverboet upp sig som om en osynlig fågel landat där. Iris höll pappret stadigt. Boet blev bildens sista silvertecken. Någon silverskärna fanns inte ovanför molnen.

</details>

<details><summary><b>S6AA</b> · 110 words · 63.60 s · <a href="../assets/share/iris-sparade-platsen/assets/S6AA.mp3">S6AA.mp3</a></summary>

Source text, verbatim (`beats[beatId="S6AA"].prose`):

> Bibliotekarien hängde upp mosskartan, och sagostunden började. Iris hade fått sin sista ritstund med Mossa på gröna mattan. Ritstunden med Amina i fönsterljuset hade inte blivit av. På kartan lyste Mossas måne. Ingen silverfågel flög över Aminas träd.
>
> Iris satte sig på mattan, men inte mitt på den mjukaste platsen. Hon lämnade en bred bit bredvid knät. Amina slog sig ner där. Mossa klättrade upp på Iris gula stövel.
>
> "Min måne kan nog lysa åt dina träd också", viskade han till Amina.
>
> Amina pekade ut en krokig stig åt honom. Iris höll sagoboken så att alla tre såg. Bakom dem glimmade månen över kartan, och fönsterplatsen stod tom i kvällsljuset.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 2.7 %):

> Bibliotekarien hängde upp mosskartan, och sagostunden började. Iris hade fått sin sista ritstund med mossa på gröna mattan. Ritstunden med Amina i fönsterljuset hade inte blivit av. På kartan lysste mossas måne. Ingen silverfågel flög över Aminas träd. Iris satte sig på mattan, men inte mitt på den mjukaste platsen. Hon lämnade en bredbit bredvid knät. Amina slog sig ner där. Mossa klättrade upp på Iris gula stövel. Min måne kan nog lysa åt dina träd också, viskade han till Amina. Amina pekade ut en krokig stig åt honom. Iris höll sagoboken så att alla tre såg. Bakom dem glimmade månen över kartan, och fönsterplatsen stod tom i kvällsljuset.

</details>

<details><summary><b>S6AB</b> · 105 words · 65.60 s · <a href="../assets/share/iris-sparade-platsen/assets/S6AB.mp3">S6AB.mp3</a></summary>

Source text, verbatim (`beats[beatId="S6AB"].prose`):

> Bibliotekarien hängde upp mosskartan, och sagostunden började. Iris hade ritat med Mossa på gröna mattan. Hon och Amina hade inte fått sin sista ritstund i fönsterljuset. Aminas silverfågel flög över träden, men ingen silvermåne syntes ovanför Mossas stigar.
>
> Iris satte sig på mattan och lämnade en liten plats på den öppna sagobokens kant. Mossa slog sig ner där. Amina satt på andra sidan Iris.
>
> "Du kan välja första stigen i berättelsen", viskade Iris till Mossa.
>
> Han snurrade halsduken och pekade. Amina följde stigen med fingret i luften. Iris lutade sig närmare båda två. Bakom dem blinkade silverfågeln, och på kartan fick natten vara utan måne.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 3.8 %):

> Bibliotekarien hängde upp mosskartan, och sagostunden började. Iris hade ritat med mossa på gröna mattan. Hon och Amina hade inte fått sin sista ritstund i funsterljuset. Aminas silverfågel flög över träden, men ingen silvermåne syntes ovanför mossas stikar. Iris satte sig på mattan och lämnade en liten plats på den öppna sagobokens kant. Mossa slog sig ner där. Amina satt på andra sidan Iris. Du kan välja första stigen i berättelsen, viskade Iris till mossa. Han snurrade halsduken och pekade. Amina följde stigen med fingret i luften. Iris lutade sig närmare båda två. Bakom dem blinkade silverfågen, och på kartan fick nattan vara utan måne.

</details>

<details><summary><b>S6BA</b> · 103 words · 58.52 s · <a href="../assets/share/iris-sparade-platsen/assets/S6BA.mp3">S6BA.mp3</a></summary>

Source text, verbatim (`beats[beatId="S6BA"].prose`):

> Bibliotekarien hängde upp solfågelbilden, och sagostunden började. Iris och Amina hade fått sin sista ritstund i fönsterljuset. Mossa hade inte fått rita med Iris på gröna mattan. Över molnen lyste hans silverstjärna. Mellan Aminas vingar fanns inget silverbo.
>
> Iris gick först till sagomattan. Hon valde en plats nära fönstret och lämnade en liten öppning mellan sig och Amina. Mossa tassade in i den och lutade ryggen mot deras armar.
>
> "Här syns stjärnan ju bäst", sa han.
>
> Amina kupade händerna som ett låtsasbo åt hans svans. Iris log och höll sagoboken öppen. Ovanför dem hoppade silverstjärnan till, precis som när Mossa ritade sista spetsen.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 7.8 %):

> Bibliotekarien hängde upp solfågelbilden och sagostunden började. Iris och Amina hade fått sin sista ritstund i fönsterljuset. Mossa hade inte fått rita med Iris på gröna mattan. Över molnen lysste hans silverskärna. Mellan Aminas vingar fanns inget silverbo. Iris gick först i sagomattan. Hon valde en plats nära fönstret och lämnade en liten öppning mellan sig och Amina. Mossa tassade in i den och lutade ryggen mot deras armar. Här syns stjärnan ju bäst, sa han. Amina kupade händerna som ett låtsas bo åt hans svans. Iris slog och höll sagoboken öppen. Ovanför de hoppade silverskärnan till, precis som när Mossa ritade sista spetsen.

</details>

<details><summary><b>S6BB</b> · 105 words · 72.52 s · <a href="../assets/share/iris-sparade-platsen/assets/S6BB.mp3">S6BB.mp3</a></summary>

Source text, verbatim (`beats[beatId="S6BB"].prose`):

> Bibliotekarien hängde upp solfågelbilden, och sagostunden började. Iris och Amina hade ritat i fönsterljuset. Den sista ritstunden med Mossa på gröna mattan hade inte blivit av. Aminas silverbo låg mellan vingarna. Över Mossas moln fanns ingen silverstjärna.
>
> Iris satte sig vid kanten av sagomattan. Hon lämnade plats på ena knät och höll det andra intill Amina. Mossa hoppade upp, virade halsduken runt tassarna och såg på bilden.
>
> "Moln behöver väl inte alltid en stjärna", mumlade han. "De kan vaka över ett bo."
>
> Amina knackade lätt mot Iris hand. Iris öppnade sagoboken mellan dem. Bakom deras huvuden puffade silverboet till, och fönsterljuset föll över alla tre.

Machine transcript of the audio (faster-whisper medium; recognition errors are the model's, not the narrator's; WER vs source 5.7 %):

> Bibliotekarien hängde upp solfågelbilden och sagostunden började. Iris och Amina hade ritat i fönsterljuset. Den sista ritstunden med mossa på gröna mattan hade inte blivit av. Aminas silverbo låg mellan vingarna. Över mossas mål fanns ingen silverskärna. Iris satte sig vid kanten av sagomattan. Hon lämnade plats på ena knät och höll det andra in till Amina. Mossa hoppade upp, virade halsduken runt tassarna och såg på bilden. Måln behöver väl inte alltid en stjärna, mumlade han. Då kan vaka över ett bo. Amina knackade lätt mot Iris hand. Iris öppnade sagoboken mellan dem. Bakom deras huvuden puffade silverboet till och fönsterljuset föll över alla tre.

</details>


---

## 6. The narrator cast (voice picker)

**All four Swedish samples read the identical script** (the Kevin and Miro apple-tree door), so they can be compared like for like. **Each English sample has its own in-character greeting.** No transcript ships with the site. The texts below are **machine transcripts** (faster-whisper *medium*) and may contain recognition errors. For example, the recogniser wrote "Kev vinsmög … durr" for Unga Saga, who says the same "Kevin smög … dörr" as the others.

- **Morfar Erik** (sv, [grandpa-sample.mp3](../assets/audio/landing-voice/grandpa-sample.mp3), 13.00 s; [asr json](../derived/audio/asr/landing-voice__grandpa-sample.asr.json)): "Kevin smög närmare det gamla äppelträdet. Där, mellan två rötter, låg en liten dörr på glänt. Kom, viskade Miro. Den har väntat på oss."
- **Grandpa Erik** (en, [grandpa-sample-en.mp3](../assets/audio/landing-voice/grandpa-sample-en.mp3), 12.00 s; [asr json](../derived/audio/asr/landing-voice__grandpa-sample-en.asr.json)): "Come close my friend. Tonight, I am telling a story that belongs to you alone, and I will keep every word warm."
- **Berättaren Lily** (sv, [female.mp3](../derived/audio/fetched/voices/female.mp3), 14.64 s; [asr json](../derived/audio/asr/voices__female.asr.json)): "Kevin smög närmare det gamla äppelträdet. Där, mellan två rötter, låg en liten dörr på glänt. Kom, viskade Miro. Den har väntat på oss."
- **Storyteller Lily** (en, [female-en.mp3](../derived/audio/fetched/voices/female-en.mp3), 9.16 s; [asr json](../derived/audio/asr/voices__female-en.asr.json)): "Hello there! I have a brand new story just for you, and I cannot wait to begin. Shall we see where it goes?"
- **Berättaren Marcus** (sv, [male.mp3](../derived/audio/fetched/voices/male.mp3), 14.40 s; [asr json](../derived/audio/asr/voices__male.asr.json)): "Kevin smög närmare det gamla äppelträdet. Där, mellan två rötter, låg en liten dörr på glänt. Kom, viskade Miro. Den har väntat på oss."
- **Narrator Marcus** (en, [male-en.mp3](../derived/audio/fetched/voices/male-en.mp3), 10.24 s; [asr json](../derived/audio/asr/voices__male-en.asr.json)): "Welcome, adventurer. Your story is ready, and it starts the moment you are. Take a breath. Here we go."
- **Unga Saga** (sv, [young.mp3](../derived/audio/fetched/voices/young.mp3), 15.24 s; [asr json](../derived/audio/asr/voices__young.asr.json)): "Kev vinsmög närmare det gamla äppelträdet. Där, mellan två rötter, låg en liten durr på glänt. Kom, viskade Miro. Den har väntat på oss."
- **Young Saga** (en, [young-en.mp3](../derived/audio/fetched/voices/young-en.mp3), 9.12 s; [asr json](../derived/audio/asr/voices__young-en.asr.json)): "Hi! Guess what? This story is all about you. I love this part, right before everything begins."

| Voice (sv / en) | F0 median sv / en | Character in the measurements | Description in the code |
|---|---|---|---|
| Morfar Erik / Grandpa Erik | 138 / 100 Hz | low male; en close to the book narration | "warm, wise … cozy bedtime voice" |
| Berättaren Lily / Storyteller Lily | 192 / 192 Hz | female, mid-high; en fastest of all (151 wpm over the file) | "bright, expressive … full of wonder" |
| Berättaren Marcus / Narrator Marcus | 132 / 117 Hz | male, widest Swedish pitch range (14.8 st); en the loudest sample (−19.4 LUFS, TP −1.8) | "steady, adventurous" |
| Unga Saga / Young Saga | 190 / 200 Hz | high, youthful; sv the slowest and quietest (95 wpm, −27.5 LUFS) | "enthusiastic young voice … like a friend" |

On the identical Swedish script, Morfar is the **shortest read** (13.00 s, against 14.40–15.24 s for the others), so the default voice is not the slowest in its own sample. The samples were not loudness-matched to each other: they span −19.4 to −27.5 LUFS. Pitch chart: [`voice-pitch.png`](../derived/audio/voice-pitch.png). Cast sheet with portraits: [`derived/brand/narrator-cast.webp`](../derived/brand/narrator-cast.webp).

---

## 7. The six ambient beds

Each bed is shown in its labelled waveform and spectrogram in [`derived/audio/plots/`](../derived/audio/plots/) and its long-term spectrum in [`ltas-beds.png`](../derived/audio/ltas-beds.png). Descriptions separate what was measured from how it reads. Content descriptions come from the spectrograms and measurements; the files were not listened to by a person.

### 7.1 `hearth`: "Brasa" [Fireplace] · ambience · the default

- **Measured.** Centroid 277 Hz. 84.8 % of the energy lies below 80 Hz: 10.6 % below 20 Hz and 34.9 % in 20–40 Hz. A dense, steady low rumble with broadband crackle transients (vertical streaks up to 16 kHz in the [spectrogram](../derived/audio/plots/bed__hearth__spectrogram.webp)), about 4.4 transient onsets/s. LRA 2.7 LU, very even. Stereo correlation 0.9997, side −37.8 dB under mid: **effectively mono**. True peak −2.6 dBTP.
- **Read.** A close log fire heard from the rug: a soft roar with sparse crackles, no music. It is the default because it is the most neutral bed and least likely to annoy. The sub-40 Hz content is inaudible on phone and laptop speakers but would eat headroom in a film mix (§10).

### 7.2 `rain`: "Fönsterregn" [Window rain] · ambience

- **Measured.** Centroid 6309 Hz, the brightest bed. 35.4 % of the energy lies above 8 kHz, 33.8 % in 1–4 kHz, under 1.4 % below 250 Hz. Flat broadband noise with a gentle hump around 1 kHz ([LTAS](../derived/audio/ltas-beds.png)). LRA **0.5 LU**, the steadiest file in the set. Stereo correlation 0.31: wide.
- **Read.** Steady rain on glass, heard from inside, with no thunder or drips standing out. It works as pink-ish masking noise. Because it is very bright, it sits in the same band as consonants, which is presumably why all beds play 15 dB down.

### 7.3 `forest`: "Sagoskogen" [Enchanted forest] · ambience

- **Measured.** Centroid 3144 Hz. 39.1 % of the energy lies in 250–1000 Hz, 27.4 % in 1–4 kHz, 22.8 % in 4–8 kHz. A continuous wash (wind or leaves) with **a few short chirps at about 2.5–4 kHz** near 11.5 s, 14.7 s and 23.8 s, plus faint steady tonal lines around 4–6 kHz, perhaps insects. All of these are read off the [spectrogram](../derived/audio/plots/bed__forest__spectrogram.webp). Stereo correlation 0.22: the widest bed. LRA 3.8 LU.
- **Read.** An evening wood with a breeze and the odd bird: open air, not jungle-busy. "Saga" in *Sagoskogen* [the fairy-tale forest] signals magic, but the sound itself is naturalistic.

### 7.4 `musicbox`: "Speldosa" [Music box] · music

- **Measured.** Pitched tines only, no low end: 0 % below 250 Hz, 59.4 % in 1–4 kHz. Register **A4–E7**; the strongest pitches are F#6, E6, A5, G6 and D6. Pitch-class shares: E 24.3 %, F# 22.7 %, G 15.4 %, A 14.9 %, D 12.9 %, C# 7.3 %, B 1.6 %. Key estimate **D major** (Krumhansl correlation 0.64). A steady **0.5 s note grid (120 BPM)**: onsets at 28.456 / 28.955 / 29.455 / 29.954 s, then 0.459 / 0.958 / 1.457 / 1.956 s after the wrap. True peak −11.0 dBTP, the most headroom of all. Stereo correlation 0.75.
- **Read.** A slow wind-up music box lullaby in D major, each note ringing out. Its register is high but the playing is gentle. The 120 BPM pulse at a lullaby dynamic reads as calm, not fast.

### 7.5 `harp`: "Månharpa" [Moonlit harp] · music

- **Measured.** Centroid 339 Hz. 84.9 % of the energy lies in 250–1000 Hz, and the −60 dB bandwidth is only 8.4 kHz: dark and soft. Register **G3–D5**. Pitch-class shares: F 34.9 %, D 21.4 %, C 14.8 %, A 12.2 %, G 9.9 %, E 2.8 %. That is essentially the **F major pentatonic** (F G A C D), key estimate F major (correlation 0.845, the clearest tonality in the set). About 2.2 plucks/s, with a median gap between notes of 0.36 s. True peak −9.3 dBTP.
- **Read.** Low, unhurried harp arpeggios on a pentatonic scale, so no note can clash. A classic lullaby device. "Moonlit" is carried by the dark, rolled-off tone.

### 7.6 `fire`: "Glödljus" [Ember glow] · music

- **Measured.** Two layers. (1) A fire layer: 59.8 % of the energy lies below 80 Hz (peak ≈ 74 Hz), with crackle transients above 4 kHz. (2) **One sustained pure tone at ≈ 740 Hz, which is F#5**, held across the file. In the [spectrogram](../derived/audio/plots/bed__fire__spectrogram.webp) it breaks and re-attacks near 8.3 s, 19.6 s and 26.8 s (read from the image). Stereo correlation **−0.14**, with the side 1.2 dB louder than the mid: the stereo image is decorrelated or partly out of phase. LRA 5.7 LU, the most dynamic bed.
- **Read.** Embers with a single soft "glow" tone hovering above them, more of a mood drone than a melody. That explains why it is filed under *Musik* though it is mostly fire. **Mono warning:** summed to mono, this bed loses level and may comb-filter (§10).

### 7.7 Shared traits

| Trait | Value |
|---|---|
| Length / format | 30.000 s, 128 kb/s CBR MP3, 44.1 kHz stereo, 481 115 bytes, all six |
| Loudness | −24.3 … −24.7 LUFS-I. Peaks −2.6 (hearth) to −11.0 dBTP (musicbox) |
| Dynamics | LRA 0.5–5.7 LU: all flat, no events that would startle |
| Tonality of the music beds | D major (music box), F major pentatonic (harp), F#5 drone (fire). Together they share no key |
| Versioning | `/audio/atmosphere/v1/`: the path has a version number, so the set is expected to be replaced as a whole |

---

## 8. Loop check: do the beds loop seamlessly?

`<audio loop>` jumps from the last sample straight back to the first, with no crossfade. Three tests were run on each file by comparing the wrap with ordinary moment-to-moment changes **inside the same file**: the level step between the 20 ms windows on either side, the log-spectrum change between the 2048-sample frames on either side, and the sample-value jump. A wrap below the 95th percentile of normal internal change should not be audible.

| Bed | RMS step at wrap | (percentile) | Spectral change percentile | Sample-jump percentile | Verdict |
|---|---|---|---|---|---|
| hearth | 1.61 dB | 27th | 43rd | 70th | seamless |
| rain | 2.79 dB | 89th | 34th | 58th | seamless |
| forest | 2.18 dB | 88th | 24th | 88th | seamless |
| musicbox | 0.72 dB | 57th | 86th | 53rd | seamless; the note grid continues across the wrap |
| harp | 0.62 dB | 33rd | 55th | 56th | seamless; the wrap falls in a **2.5 s rest** (last pluck 28.323 s, next 0.836 s after the wrap) |
| fire | 1.31 dB | 33rd | 54th | 70th | seamless |

- Figure: [`derived/audio/loop-seams.png`](../derived/audio/loop-seams.png) shows the last 2 s and first 2 s of each file joined, with the wrap marked.
- Listen for yourself: [`derived/audio/seams/`](../derived/audio/seams/) holds `<bed>__seam-audition_last3s-then-first3s.mp3` for each bed: 6 s, the file's last 3 s butted against its first 3 s (re-encoded at 192 kb/s).
- Each file decodes to exactly 1 323 000 samples, and a LAME header trims the encoder delay and padding, so there is no padding gap in the file itself. Whether a browser loops an MP3 gaplessly depends on the browser (outside knowledge: Chromium usually honours the gapless header, others may insert a few ms of silence). This was not tested in a browser.
- Read: the beds were cut as **designed loops**, not just trimmed. The music box loops on its beat grid and the harp loops inside a musical rest, both signs of deliberate loop editing. A 30 s loop is short, though. The harp's 2.5 s rest and the fire's tone re-attacks recur every 30 s, so on a long listen the repetition becomes noticeable.

---

## 9. Sonic identity (interpretation)

1. **Voice first, everything else under it.** The product's sound is a person reading. Beds are opt-in and play about 20 dB under the voice, and there are no interface sounds. That fits a product whose promise is "nothing {name} has to read alone" and whose screens are full of glowing visuals but silent.
2. **Bedtime tempo.** About 100 wpm, a pause after every sentence, and three-sentence chunks of half a minute to a minute per page. The narration enacts the pace the copy keeps promising ("tandborstning och pyjamas" [toothbrushing and pyjamas]).
3. **A grandparent, not a performer.** Default voice *Morfar Erik*: a low, breathy, unhurried male voice that still acts the children's lines. It matches the watercolour portrait with cardigan, glasses and a little book with an acorn, and the copy's first-person narrator ("Jag skriver, målar och övar på att säga {name} precis rätt").
4. **Hearth and night.** The default bed is a fire; the waiting screen is literally a fire ("Glödvakten", "Eldljud"). Read alongside the *natt* theme, the night palette and the gold "ember" accents ([06](06-theming-and-atmosphere.md)), the sound brief is **warm interior at night**: fire, rain on the window, a music box. The one outdoor bed, *Sagoskogen*, is a calm evening wood.
5. **Nordic and gentle music.** Only plucked and struck sounds (music box, harp) and one sine-like glow tone. No percussion, bass line or vocals. The harp is pentatonic, the music box major, both lullaby conventions.
6. **Honesty about time.** The audio facts match the copy: a whole book is about 6.5 min of narration and is generated in about 10 min.
7. **Weak spots.** The landing pill plays a different story from the picture beside it (§3.5). The voice-picker samples are not loudness-matched to each other (8 dB spread). The "Fire sound" chip can play rain (§3.3). The 30 s loops repeat audibly on a long listen. The fire bed is not mono-safe.

---

## 10. Using these sounds in a film

> **Rights.** These files are Tale Forge's assets. The narration is synthetic speech from Google's Gemini TTS, voice *Enceladus*. Use them as **reference, temp track or pitch material** unless Tale Forge grants a licence. To *emulate* the style, re-create it (recipes below).

### 10.1 Mixing to the studio's delivery spec

The studio's last QC passed at **−15 LUFS integrated, true peak under −1.5 dBFS, voice at −16 LUFS, bed at −27 LUFS** (`/home/user/Video-s/films/robin-bos/storyboard/qc-report.md`, outside this library). To keep Tale Forge's balance:

| Element | Tale Forge in-app | Suggested film level (voice at −16) |
|---|---|---|
| Narration | ≈ −19 LUFS | −16 LUFS (raise by about 3.4 dB; the files have only ≈ 2 dB of peak headroom, so use a true-peak limiter) |
| Bed, "default feel" | 20 LU under the voice | **−36 LUFS** |
| Bed, "slider at max" | 13 LU under the voice | **−29 LUFS**. Do not go louder than this; the studio's usual −27 bed is louder than Tale Forge ever plays a bed |
| Bed alone (no voice, e.g. a title card) | – | −24 to −27 LUFS, as delivered |

### 10.2 Bed handling

- **hearth**: high-pass at about 40–50 Hz. About 45 % of its energy is below 40 Hz and only costs headroom. Its stereo is effectively mono, so widen it or pair it with *rain* if the scene needs space.
- **fire (Glödljus)**: check mono compatibility before use (correlation −0.14). For mono or broadcast deliveries, use M-only or re-pan. The F#5 tone clashes with the music box's D major only lightly (F# is in D major) but sits a semitone away from the harp's F: **do not layer `fire` with `harp`.**
- **musicbox** (D major, 120 BPM grid) and **harp** (F pentatonic, rest at the loop point) are the only beds you can cut to. Cut on the music box's 0.5 s grid. For a picture edit longer than 30 s, loop on the file boundary (already seamless) or crossfade 2–3 s inside the harp's rests.
- **rain**: very bright. Under voice, a gentle high-shelf cut (−3 dB above 6 kHz) imitates the in-app distance.
- Ready-made seam test clips: [`derived/audio/seams/`](../derived/audio/seams/).

### 10.3 ffmpeg recipes (literal)

```sh
# 1. A Tale Forge "page": narration over the default fire bed, levels as in the app (bed × 0.18), looped bed, 1 s bed pre-roll.
ffmpeg -i assets/share/iris-sparade-platsen/assets/S1.mp3 -stream_loop -1 -i assets/audio/atmosphere/v1/hearth.mp3 \
  -filter_complex "[1:a]volume=0.18,afade=t=in:d=1.5[bed];[0:a]adelay=1000:all=1,aresample=44100,pan=stereo|c0=c0|c1=c0[vo];\
[bed][vo]amix=inputs=2:duration=longest:normalize=0,atrim=end=71,afade=t=out:st=68.5:d=2.5" -ar 48000 page-S1.wav
# (tested: 70.95 s output; after recipe 2 it measures −15.0 LUFS-I)

# 2. Re-level that mix to the studio target (−15 LUFS, TP −1.5).
ffmpeg -i page-S1.wav -af loudnorm=I=-15:TP=-1.5:LRA=11 -ar 48000 page-S1_-15LUFS.wav

# 3. High-pass the hearth bed for film use; mono-safe fire bed (mid only).
ffmpeg -i assets/audio/atmosphere/v1/hearth.mp3 -af highpass=f=45 hearth_hp45.wav
ffmpeg -i assets/audio/atmosphere/v1/fire.mp3 -af "pan=mono|c0=0.5*c0+0.5*c1" fire_mid.wav
```

### 10.4 Emulating the voice (if a new read is needed)

- **Casting brief**: a Swedish or Scandinavian man of about 70, a grandfather, low (≈ 100 Hz speaking pitch), breathy-soft, close-miked, smiling. He reads at **95–110 wpm**, pauses 0.5–1 s after every sentence and 1–2 s before a turn in the story. He lifts his voice about a fifth for a little girl's lines and keeps the talking mouse within about three semitones of his own voice. He never projects.
- **Synthetic route** (what Tale Forge does): `gemini-3.1-flash-tts-preview`, voice `Enceladus`, with a style instruction such as "a warm grandfather reading a bedtime story slowly, pausing between sentences". The site's actual instruction is not public. Normalise afterwards (the files here measure −19 LUFS / −2 dBTP).
- **Timing a film to it**: budget **≈ 0.6 s per word** (100 wpm) including pauses, or ≈ 64 s for a 108-word page. Choice moments in the product carry **no narration**: the voice stops and the child decides. In a film, a held beat of silence (bed only) on a choice is on-brand.
- **Transitions**: in the app, consecutive pages are separated by **900 ms** of bed-only sound in listen mode. That is a good default gap between narrated shots.

---

## 11. Derived files index

All files are in [`derived/audio/`](../derived/audio/).

| File | What it shows / contains |
|---|---|
| [`audio-specs.csv`](../derived/audio/audio-specs.csv) | One row per audio file (28): path, role, labels, site URL, md5, bytes, codec, encoder, sample rate, channels, bitrate, durations, integrated LUFS, true peak, LRA (+ low/high), sample peak, RMS, stereo correlation, side/mid, spectral centroid (energy-weighted and median), 85 % roll-off, flatness, −60 dB bandwidth, six band-energy shares, F0 stats (voices), pause stats (voices), key / pitches / onsets / tempo (music beds), seam metrics and verdict (beds), in-app gain and level (beds) |
| [`narration-text-match.csv`](../derived/audio/narration-text-match.csv) | One row per narration beat (14) and voice sample (8): source-text reference, word / sentence / syllable counts, TTS provider, `meta.ms`, normalisation label, speech start/end, pauses, WPM (file, speech span, articulation), syllables/s, ASR words and WER |
| [`narration-dialogue-vs-narration.json`](../derived/audio/narration-dialogue-vs-narration.json) | Per beat: F0 and seconds-per-word inside quoted dialogue vs narration |
| [`asr/`](../derived/audio/asr/) | 22 machine transcripts (faster-whisper medium) with word timestamps, each labelled as machine output |
| [`loudness-map.png`](../derived/audio/loudness-map.png) | Dot plot of the integrated loudness of all 28 files, with each bed's in-app level at volume 0.18 and 0.4, and the −23 LUFS label line |
| [`ltas-beds.png`](../derived/audio/ltas-beds.png) | Six small multiples: each bed's third-octave long-term spectrum (gold) against the other five (grey) |
| [`voice-pitch.png`](../derived/audio/voice-pitch.png) | F0 10th–90th percentile bars and medians for the 8 voice samples and 14 narration beats; gold = the grandpa persona |
| [`narration-pacing.png`](../derived/audio/narration-pacing.png) | Two bar panels per beat: words per minute, and pause share |
| [`loop-seams.png`](../derived/audio/loop-seams.png) | The last 2 s + first 2 s of each bed around the wrap, with RMS track and seam percentiles |
| [`seams/*.mp3`](../derived/audio/seams/) | 6 s audition clips of each bed's loop point (last 3 s → first 3 s) |
| [`plots/bed__<id>__waveform.png`](../derived/audio/plots/bed__hearth__waveform.png), `…__spectrogram.png` | Per bed: labelled stereo waveform (L gold, R violet) and log-frequency spectrogram (magma, 30 Hz–16 kHz, 100 dB range), with spec line in the header |
| [`plots/voice__<id>__waveform.png`](../derived/audio/plots/voice__grandpa-sample__waveform.png), `…__spectrogram.png` | Per voice sample (8): waveform with pauses shaded violet, and spectrogram |
| [`plots/narration__<beat>__waveform.png`](../derived/audio/plots/narration__S1__waveform.png), `…__spectrogram.png` | Per narration beat (14): waveform with pauses shaded, and spectrogram |
| [`fetched/voices/*.mp3`](../derived/audio/fetched/voices/) | The 8 voice-picker samples fetched from `https://tale-forge.app/voices/` (grandpa and grandpa-en are byte-identical to the landing files) |
| [`js-excerpts/*.pretty.js`](../derived/audio/js-excerpts/) | Verbatim, prettier-formatted excerpts of every audio-related module (6 files), each with a header naming its source chunk and line range |

---

## 12. Method, limits and open questions

- **Tools.** `ffprobe` and `ffmpeg` (`ebur128=peak=true`, `loudnorm` analysis, `astats`, `silencedetect=noise=-40dB:d=0.2`, `showwavespic`, `showspectrumpic`). numpy on decoded float PCM: 4096-point Hann FFT for spectra, 40 ms autocorrelation F0 at 16 kHz with octave-error guard, chroma with Krumhansl-Kessler key profiles, spectral-flux onsets. Pillow for the charts. faster-whisper *medium* (CPU, int8, beam 5, language forced) for transcripts. The scripts are kept outside the library (session scratchpad `tools/audio/`).
- **Word counts** are tokens containing a letter or digit in `beats[].prose`. Syllables are vowel groups (`[aeiouyåäöé]+`), an approximation for Swedish.
- **Nobody listened.** Every "Read" about timbre, age or mood is inferred from measurements, spectrograms, transcripts and the product's own descriptions, not from listening. Content claims about the beds (birds, insects, held tone) come from spectrogram reading and are marked as such.
- **The F0 tracker** is simple. Values on breathy or creaky speech can carry octave errors, and the guard keeps 0.55–1.8 × the median. The dialogue analysis rests on 1–46 quoted words per beat.
- **Open questions** (handoffs): the server-side TTS prompt behind "grandpa"; whether Lily, Marcus and Saga are also Gemini voices; the audio of the Bokmässan kiosk (voices Sanna, Brage, Johnny, Mira, Janne); whether real books normalise to −23 LUFS as the label says while the sample book does not; browser gapless-loop behaviour; iOS volume handling.
