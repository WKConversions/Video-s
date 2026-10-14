# Brief for the reference analysts

You are measuring a reference promo film so it can be rebuilt pixel for pixel (the client will overlay our frames on the reference's).
Reference: /home/user/Video-s/films/wkc-promo/ref/ref.mp4 (1280x720, 30 fps, 1262 frames, 42.03 s). Every frame is already extracted at full size: /home/user/Video-s/films/wkc-promo/ref/frames/f0000.jpg ... f1261.jpg (frame n = n/30 s).
Overview contact sheets (every 0.25 s): /home/user/Video-s/films/wkc-promo/ref/sheets/s0.jpg (0-6 s) ... s6.jpg (36-42 s).
Our film is 1920x1080 at 30 fps, so convert every measurement to 1920x1080 coordinates (multiply 720p pixel values by 1.5) and say so.
Tools: python3 with numpy, opencv (cv2) and PIL are installed; ffmpeg too. Look at frames with the Read tool (crop and upscale regions with PIL to see detail; tile consecutive frames to see motion). MEASURE, don't guess: bounding boxes of text and shapes from thresholded pixels, cap heights, centres, colours (sample RGB hex), blur radii (edge spread), glow extents, opacity (contrast against the background), and per-frame values of every animated property.

## The WKConversions film that replaces it
Script (time in seconds -> on-screen text), replacing the reference's lines one for one:
0-1.5 "Meet" | 1.5-3 "WKConversions" (logo: the handwritten "wkc" monogram + wordmark) | 3.5-5 "Motion that makes it click" | 5-7.5 "Explain. Engage. Convert." |
7.5-10 "Or just look incredible." | 10-12.5 "Tell us what needs explaining" | 12.5-18 visual demonstration, no headline | 18-19.5 "Export" |
19.5-24 showcase of finished client videos (no headline) | 24-26 "Made for every platform" + "From websites to social ads" | 26-27.5 "Publish anywhere" + "Every format" |
27.5-29 "Multiple versions" + "One project" | 29-30.5 "Detail-driven design" | 30.5-31 "Clear messaging" | 31-31.5 "Smooth transitions" | 31.5-32.5 "Every frame intentional" |
32.5-33.5 "2 Founders, 1 Studio" | 33.5-35.5 "3" + "Formats for your website and socials" | 35.5-38.5 six statements, 0.5 s each: "Built for Your SaaS Product", "Built for E-commerce Brands",
"Built for Your Website Hero", "Built for Advertising", "Built for Marketing", "Built for More Conversions" | 38.5-40 "WKConversions" logo | 39-41.5 "Let's talk" (glowing pill CTA) | 39-42.08 "wkconversions.com".

Client's visual direction: 0-10 s logo reveal and kinetic type: keep the dark background, glowing accents, rapid headline transitions; NeuralSeek's logo becomes the WKC monogram and wordmark.
10-24 s production workflow and portfolio: a project brief transforming into storyboard frames, polished compositions and animated scenes; then a montage of real WKConversions projects and the export action.
24-35 s capabilities and credibility: website, LinkedIn, Instagram and advertising-platform visuals; then design details, the two founders (Raphael Wind and Karl van Kessel, portraits available), and the three aspect ratios 16:9, 1:1, 9:16.
35-42 s rapid use cases and CTA: the six "Built for" statements with the same rhythmic transitions as the reference; end on the WKConversions logo with a glowing "Let's talk" CTA.
WKConversions is a motion-design studio (motion design and video editing for SaaS, e-commerce and brands), so where the reference shows its product UI, the film shows motion-design tools and work: a brief, storyboard frames, an animation timeline with keyframes, compositions, a render/export dialog, finished videos (real client clips are available: ClearScaler, Creoble, K.B, Malaga Hideaway, Robin Bos, Vendom, VoxFlow, Wicflow, bFound — see /home/user/Video-s/films/wkc-promo/film/public/clips/clips.json).
WKC brand: blue #3F8CE8 (blue text on light #1266C9), ink #050F19, page #F7F7F8, soft highlight #E6F0FD, muted #575E68 / #838A94; fonts Inter Tight 800 (headlines, tracking -0.05em) and Inter 400-600; radii 26/34/16/10 px and pills; ease cubic-bezier(.22,1,.36,1). The client wants the reference's look kept (dark backgrounds with glowing accents, the pastel gradient sections) re-coloured into WKC's blues.

Write ONLY inside your scratch dir and your spec file; never edit anything else, never git, never pkill.

## What your spec file must contain
It must let a Remotion developer rebuild the segment frame-exactly at 1920x1080 without looking at the reference again:
1. Shot list for your frames: exact first/last frame of every shot and every transition (and its type: cut, crossfade, blur-through, push, whip, zoom-through, mask...).
2. Background per shot: base colour(s) as hex, gradients (type, stops, positions), glows/light streaks/rings (shape, position, size, colour, blur, how they move per frame), grain/noise, vignette.
3. Every element: what it is, exact text, font look (family guess, weight, case, tracking, approximate size as cap height and font-size in px at 1080p), colour hex, glow/shadow, position (box or centre at 1080p), layering.
4. Animation per element as keyframes: frame -> value for position, scale, opacity, blur, rotation (incl. 3D tilt: rotateX/Y and perspective estimate), letter-by-letter or word-by-word timing, typing speed (chars per frame), cursor paths with frame/position pairs, click frames. Give the measured per-frame values for at least the first 6 frames of every entrance and exit, then identify the easing (e.g. expo-out with half-life N frames, cubic-bezier fit) from the measurements.
5. Camera: global zoom/pan/rotation per frame where the whole picture moves.
6. Motion blur: whether fast moves are blurred and how much (px of smear).
7. Sound sync: the visible events where a sound effect most likely lands (impacts, whooshes, clicks, typing), with frames.
8. WKC ADAPTATION: for each shot, what replaces the reference's content in the WKC film (from the script and direction above), keeping the reference's layout, sizes, positions, timing and motion exactly; be specific and creative where the reference shows a product UI (turn it into motion-design work/tools that fit the line).
Then return a short summary (shots with frame ranges and the 5 most important measurements) as your final answer.
