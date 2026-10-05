# WKConversions: live brand harvest (5 Oct 2026)

Source: https://wkconversions.com (site.css?v=5644dedfd1), /contact/, screenshots in this folder.
Pixel-measured colours match the CSS custom properties exactly.

## Palette
| Hex | Role (CSS var) | Measured |
|---|---|---|
| `#F7F7F8` | page ground `--page` | ~49% of homepage pixels |
| `#D6D9DE` | dot grid `--dot` (radial-gradient 1.1px dots) | visible on page |
| `#FFFFFF` | cards, secondary button, form card, portrait border | |
| `#EFF0F2` | light grey card `--card-lt` (testimonial cards) | |
| `#E2E3E6` | hairline borders `--line` | |
| `#050F19` | ink: headlines, nav pill, footer, logo ground `--ink` | ~3-6% |
| `#0C1A28` | ink-2 | |
| `#575E68` / `#838A94` | body text / muted `--txt-2/3` | |
| `#F6F6F6` / `#A3ABB6` | text on dark `--on-dark(-2)` | |
| `#3F8CE8` | accent fill: buttons, eyebrow pills, portrait ring `--accent` | 2% |
| `#2F7AD4` | accent hover `--accent-2` | |
| `#1266C9` | accent text on light: h1 "makes it click." `--accent-ink` | 1.4% |
| `#7BB6F5` | accent text on dark | |
| `#E6F0FD` | soft accent `--accent-soft` | |
| `~#9BC2F0` | hero routed line (accent at reduced opacity, soft blue glow under it) | sampled |

## Type
- Display: **Inter Tight** 800 (self-hosted, Google Font available). h1-h4 `letter-spacing:-.045em; line-height:1.0`; hero `.h-hero` `-.05em`, line-height `.96`. Sentence case, ends with a period; last phrase in `#1266C9`.
- Body/UI: **Inter** 400-600, grey `#575E68`, centered under statements.
- Small caps-tracked labels in contact cards ("CONTACT US DIRECTLY", "FOLLOW US").

## Shapes
- Radii: card 26, lg 34, md 16, sm 10, pills 999.
- Nav: floating dark `#050F19` rounded bar (pill-ish) with white "wkc" mark, blue "Start a project" pill with arrow-in-circle icon.
- Blue filled eyebrow pills (white Inter 600 text) above headlines.
- Buttons: blue filled (r~10) + white outlined secondary.
- Founder portraits: circles, 5px white border + 2px `#3F8CE8` outer ring + soft navy shadow, slightly rotated (-8deg / 7deg).
- Partner logos: overlapping white-bordered circles (K.B, ClearScaler infinity, bFound).
- Hero: thin rounded routed outline lines (top corners) + one long blue curve with node dots and soft blue glow sweeping up-right.
- Shadows navy-tinted: `0 18px 44px -26px rgba(5,15,25,.32)`, `0 30px 64px -30px rgba(5,15,25,.40)`.
- Footer: large dark `#050F19` rounded card, blue "Start a project" card with dark sub-cards inside, giant faint "wkc" watermark.
- Easing: `cubic-bezier(.22,1,.36,1)`.

## Logo
`logo.svg` = handwritten brush "wkc" (viewBox 999.08x462.37, single filled path, `currentColor`). `logo-white.svg` for dark. Favicon: white mark on `#050F19` rounded square (rx 8.48/32).

## Tone
Calm, light, airy, lots of white space; precise and premium; statement headlines centered; navy + one blue. Not loud.

## Verbatim copy
- Eyebrow: "Motion design & video editing for SaaS, e-commerce and brands"
- H1: "Motion design that makes it click." (blue: "makes it click.")
- Sub: "We design, animate and edit videos that explain what you do in seconds: website hero explainers, service and product explainers, social media content and social ads. Motion design is our speciality."
- CTAs: "Start a project", "See what we do"; partners caption "Succesfull Collaborations + Partners" (sic)
- H2s: "You know video works. Getting it right is the hard part." / "Two motion designers. One clear story." / "Client stories" / "From brief to final export." / "The people behind the work." / "Two crafts. One team." / "Ready to make your story click?"
- Footer: "Motion design and video editing, made by the two people you talk to."

## /contact
Exists (200, https://wkconversions.com/contact/). Eyebrow pill "Your video starts here"; H1 "Tell us about **your video.**" (blue). Sub: "Ready to have a video made by us? Fill in this project brief with your business, audience, message and the video you have in mind." Embedded Fillout form: Company name, Website, Script (WKC decides / Other), Who is it for?, What should viewers do after watching?, Where will it be used?, Anything to show or avoid?, **"Referal Code"** (sic) field, "Price: €400", blue "Submit". Contact cards: raphael@wkconversions.com, karl@wkconversions.com, "We reply within 24 hours." Code BFOUND50 itself is not shown on the page.

## bFound on WKC site
bFound is listed as a partner and client story ("Emma, Founder, bFound"). Partner logo `bfound.png`: `#3D579C` "b" mark with sparkle on `#ECEFFD` circle.

## Differences vs house guide (live site wins)
- Colours/fonts/radii/ease all match the guide.
- Guide says "page stays light throughout": live site does use dark `#050F19` for the floating nav bar and the footer card.
- Portrait ring is specifically a 5px white border + 2px blue ring (guide: "blue ring").
- Base h2-h4 tracking is -0.045em; only the hero is -0.05em / .96.
