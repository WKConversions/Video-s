# Copy deck: /share/iris-sparade-platsen (sample-book link, 404) · Svenska and English

The home page and /uppgradera link "Läs exempelboken" / "Read the sample book" to `/share/iris-sparade-platsen`. On 2026-10-09 that route answered HTTP 404 in both languages.
The server HTML [../../source/html/share_iris-sparade-platsen.404.sv.html](../../source/html/share_iris-sparade-platsen.404.sv.html) is a Next.js error shell (`<html id="__next_error__">`, empty `<body>`, `<meta name="robots" content="noindex">`). The client then renders the standard not-found copy, identical to [404.sv.md](404.sv.md) and [404.en.md](404.en.md).
The text of the sample book itself is in [../sample-book-text.sv.md](../sample-book-text.sv.md), taken from the JSON that the landing bundle carries.

## Head (server error shell)

| Field | Value |
|---|---|
| `<html lang>` | *(absent)* |
| `<title>` | Tale Forge |
| `robots` | noindex |
| `description` | Riktiga bilderböcker, skapade för ditt barn. |
| `tf-release-sha` | 4be07efd68ad299089d33297742e56589f587460 |
| `og:title` | Tale Forge |
| `og:description` | Riktiga bilderböcker, skapade för ditt barn. |
| `og:site_name` | Tale Forge |
| `og:locale` | sv_SE |
| `og:image` | https://tale-forge.app/opengraph-image.png?opengraph-image.2xzm_0q_kwhgm.png |
| `og:image:type` | image/png |
| `og:image:width` | 1200 |
| `og:image:height` | 630 |
| `og:type` | website |
| `twitter:card` | summary_large_image |
| `twitter:title` | Tale Forge |
| `twitter:description` | Riktiga bilderböcker, skapade för ditt barn. |
| `twitter:image` | https://tale-forge.app/twitter-image.png?twitter-image.2xzm_0q_kwhgm.png |
| `twitter:image:type` | image/png |
| `twitter:image:width` | 1200 |
| `twitter:image:height` | 630 |
| `<link rel="manifest">` | /manifest.webmanifest |
| `<link rel="canonical">` | https://tale-forge.app/share/iris-sparade-platsen |
| `<link rel="icon">` | /favicon.ico?favicon.0k8s-ucsp6yre.ico |
| `<link rel="icon">` | /icon.png?icon.1q_fj2hxfdn0a.png |
| `<link rel="apple-touch-icon">` | /apple-icon.png?apple-icon.1qwtxz8ono1wt.png |

No JSON-LD structured data on this page.

## Rendered copy, Svenska (Swedish) (live render, HTTP 404)

Screenshot: [../states/share-iris__sv.png](../states/share-iris__sv.png). `<title>`: Iris och den sparade platsen | Tale Forge; `<html lang>`: sv.
- `img` — alt="" (decorative) · src `/assets/nebula-hero.webp`
- `img` — alt="" (decorative) · src `/assets/morgon-aurora-desktop.webp`
- `a.skip-link` — Hoppa till innehållet · → `#main-content`

#### `nav`

- `a.logo` — Tale Forge · → `/` · translate="no" · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:696-710) · contains decorative img (alt="")
- `a` — Logga in · → `/login` · aria-label="Logga in"
- `a` — Priser · → `/uppgradera` · aria-label="Priser"
- `div.language-switcher` (wrapper) — aria-label="Byt språk" · role="group"
- `button` — SV · aria-pressed="true" · type="button"
- `button` — EN · aria-pressed="false" · type="button"
- `button.tt` — Natt / Morgon · aria-label="Byt tema" · role="switch" · aria-checked="false" · type="button"

#### `main#main-content`


#### `main#main-content › section`


#### `main#main-content › section › div.glass`

- `h2` — Sidan finns inte
- `p.prose-plain` — Den här sidan har vandrat iväg i sagovärlden.
- `a.btn.btn-primary` — Till startsidan · → `/`

#### `div.foot`

- `span` — Tale Forge, sagor som minns er värld.
- `span` — Beta · data-testid="beta-build-label"
- `span` — Version 16ab1756 · 26 sep. 2026 · data-testid="footer-version"
- `span` — Tale Forge AB, org.nr 559543-1122, Värnamo, Sverige
- `a` — Kontakt · → `mailto:…@tale-forge.app`
- `a` — Integritet · → `/integritet`
- `a` — Villkor · → `/villkor`

## Rendered copy, English (live render, HTTP 404)

Screenshot: [../states/share-iris__en.png](../states/share-iris__en.png). `<title>`: Iris och den sparade platsen | Tale Forge; `<html lang>`: en.
- `img` — alt="" (decorative) · src `/assets/nebula-hero.webp`
- `img` — alt="" (decorative) · src `/assets/morgon-aurora-desktop.webp`
- `a.skip-link` — Skip to content · → `#main-content`

#### `nav`

- `a.logo` — Tale Forge · → `/` · translate="no" · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:696-710) · contains decorative img (alt="")
- `a` — Login · → `/login` · aria-label="Login"
- `a` — Pricing · → `/uppgradera` · aria-label="Pricing"
- `div.language-switcher` (wrapper) — aria-label="Change language" · role="group"
- `button` — SV · aria-pressed="false" · type="button"
- `button` — EN · aria-pressed="true" · type="button"
- `button.tt` — Night / Morning · aria-label="Switch theme" · role="switch" · aria-checked="false" · type="button"

#### `main#main-content`


#### `main#main-content › section`


#### `main#main-content › section › div.glass`

- `h2` — Page not found
- `p.prose-plain` — This page wandered off into the story world.
- `a.btn.btn-primary` — Back to start · → `/`

#### `div.foot`

- `span` — Tale Forge, storybooks that remember your world.
- `span` — Beta · data-testid="beta-build-label"
- `span` — Version 16ab1756 · 26 Sep 2026 · data-testid="footer-version"
- `span` — Tale Forge AB, reg. no. 559543-1122, Varnamo, Sweden
- `a` — Contact · → `mailto:…@tale-forge.app`
- `a` — Privacy · → `/integritet`
- `a` — Terms · → `/villkor`
