# Copy deck: Privacy notice (/integritet) · English

Long-form privacy notice. Both languages are on the same page: the UI language first, the other language inside a `<details>` disclosure. Reproduced in full.
Every string below is verbatim from the hydrated DOM [source/rendered/dom__integritet__en.html](../../source/rendered/dom__integritet__en.html) (desktop, natt theme, cookie `tf_locale=en`), in document order. The server HTML [source/html/integritet.en.html](../../source/html/integritet.en.html) was compared against it (section 4).
About 1771 words of visible and assistive text. Translation notes and voice analysis: [../../analysis/10-copy-voice-and-tone.md](../../analysis/10-copy-voice-and-tone.md). The other language: [integritet.sv.md](integritet.sv.md).

## Contents

1. [Head and share metadata](#1-head-and-share-metadata)
2. [Body copy in reading order](#2-body-copy-in-reading-order)
3. [Client-side states](#3-client-side-states)
4. [Server HTML vs hydrated DOM](#4-server-html-vs-hydrated-dom)
5. [Screenshots](#5-screenshots)

## 1. Head and share metadata

| Field | Value |
|---|---|
| `<html lang>` | en |
| `<title>` | Privacy notice |
| `description` | How Tale Forge looks after your child's information. |
| `tf-release-sha` | 4be07efd68ad299089d33297742e56589f587460 |
| `og:title` | Tale Forge |
| `og:description` | Real picture books, made for your child. |
| `og:site_name` | Tale Forge |
| `og:locale` | en_US |
| `og:image` | https://tale-forge.app/opengraph-image.png?opengraph-image.2xzm_0q_kwhgm.png |
| `og:image:type` | image/png |
| `og:image:width` | 1200 |
| `og:image:height` | 630 |
| `og:type` | website |
| `twitter:card` | summary_large_image |
| `twitter:title` | Tale Forge |
| `twitter:description` | Real picture books, made for your child. |
| `twitter:image` | https://tale-forge.app/twitter-image.png?twitter-image.2xzm_0q_kwhgm.png |
| `twitter:image:type` | image/png |
| `twitter:image:width` | 1200 |
| `twitter:image:height` | 630 |
| `<link rel="manifest">` | /manifest.webmanifest |
| `<link rel="canonical">` | https://tale-forge.app/integritet |
| `<link rel="icon">` | /favicon.ico?favicon.0k8s-ucsp6yre.ico |
| `<link rel="icon">` | /icon.png?icon.1q_fj2hxfdn0a.png |
| `<link rel="apple-touch-icon">` | /apple-icon.png?apple-icon.1qwtxz8ono1wt.png |

No JSON-LD structured data on this page.

## 2. Body copy in reading order

Legend: `tag.class` is the element; **bold** marks `<b>`/`<strong>` or the gold gradient phrase `span.grad`; `[text](href)` is an inline link; `→` is a link target; " / " separates adjacent child elements with no space between them in the markup; flags in the tail say when CSS shows the text in capitals or when it is hidden from sight or from screen readers. The contact `mailto:` is shortened to `…@tale-forge.app` (it is a personal first-name mailbox; the full address is in the DOM file).
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


#### `main#main-content › section › article.glass`

- `h1.page-title` — Privacy notice
- `p.lede` — How we look after your child's information. The same text appears in English and in Swedish below. Hur vi tar hand om uppgifterna om ert barn; samma text finns på engelska och svenska nedan.
- `span` — English
- `h3` — In short
- `p.prose-plain` — We are Tale Forge AB, a small Swedish company in Värnamo (org. no. 559543-1122). We make personalised picture books for your child.
- `p.prose-plain` — You tell us a first name, an age range and a language, and you can optionally describe how the hero looks and upload a photo. We use AI services to write and illustrate. With a regular account, you can access and erase your data there. The Book Fair quick story uses a separate anonymous account without an email address. Email us about data from such a visit. We never sell your data.
- `h3` — What we collect
- `p.prose-plain` — Your child's first name, an age band (a range, not a birthdate) and preferred language. The hero and friend descriptions you type. A photo you optionally upload (see below). The painted portrait and the finished books. Your email address, for logging in and reaching you. The audio narration of each story is saved with the book.
- `p.prose-plain` — For the Book Fair quick story we ask for the child's and adult's first names, the child's age band, their relationship and, optionally, a story idea. You can create the story without photos or use one photo of each person for illustrated portraits. We create an anonymous account for the visit and attempt four scene illustrations (including both possible endings) and narration for each scene. We store the story and any images, audio and portraits that are completed. No email address is required there.
- `h3` — The photo
- `p.prose-plain` — When you upload a photo, we store the original in Google Cloud Storage while creating an illustrated portrait. Google's image service, or Amazon as a backup, processes the photo for this purpose. After successful portrait generation, we try to delete the original. If portrait creation fails, the original may remain stored. We cannot promise a fixed deletion time. The finished portrait is stored separately. In the Book Fair quick story, both finished portraits are sent as image references to Microsoft Azure when the story scenes are illustrated, or to Google if the Azure image service does not respond. If the portraits cannot be completed, the story remains readable but its scene images may be missing.
- `p.prose-plain` — For the Book Fair quick story, an anonymous account is created before the photos are uploaded. Our recurring clean-up also attempts to delete original photos after failed portrait jobs have finished. The story, scene images, narration and any portraits may remain after you leave the page. If you reload or close the page, you lose access to that anonymous visit; this does not delete the data we hold.
- `h3` — Who processes the data
- `p.prose-plain` — A few companies help us behind the scenes (our sub-processors under GDPR):

#### `section › article.glass › ul.prose-plain`

- `li` — Supabase, database and storage (EU).
- `li` — Microsoft Azure, AI services that write the stories and are the first choice for illustrating quick-story scenes.
- `li` — Google Cloud Storage, where uploaded photos are held during portrait processing, and Google Gemini for portraits, narration and scene images when Azure does not respond.
- `li` — Amazon AWS, a backup that paints the portrait if Google's service does not respond.
- `li` — ElevenLabs, a narration backup if Google's service does not respond.
- `li` — PostHog (EU), statistics about how the app is used. For signed-in accounts the statistics are linked to a pseudonymous code (a one-way hash of the account id), never to a name or email address, and never to the child's data. The code is stored locally in the browser (localStorage, no cookies).
- `p.prose-plain` — A photo or description may be processed outside the EU/EEA, including in the United States. The EU-US Data Privacy Framework applies only to recipients covered by it; the protection for a particular transfer depends on the service used. Contact us for information about that transfer. We process a child's data with consent from a parent or guardian. Consent is given in the regular account flow or with the quick-story checkbox and can be withdrawn by deleting the child's profile or contacting us.
- `h3` — AI content
- `p.prose-plain` — The stories, illustrations and portraits are generated with AI. We say so openly, so you and your child know a computer helped draw and write them.
- `h3` — Your rights
- `p.prose-plain` — You have the right to see, correct and erase your child's data. Seeing and erasing you do yourself from [your account](/konto); for corrections, email us at [kevin@tale-forge.app](mailto:…@tale-forge.app). For data from an anonymous Book Fair quick-story visit, please contact us at the same address, because that account cannot be reopened after the page is closed. If you are not happy with our answer you can complain to the Swedish data protection authority, IMY (imy.se).
- `h3` — Retention
- `p.prose-plain` — The books and your child's world (the hero, the friend and the places that return in the books) are kept so the journey can continue. When you delete your child's profile or your account, everything is removed: the name, the descriptions, the portrait, the books, the audio and the child's world. We are also building an automatic clean-up of old unused data. Before we switch it on, we will state here exactly how long things are kept. That account and story clean-up is not enabled for the Book Fair quick story.
- `p.prose-plain` — The pictures and audio in the books currently live at web addresses that anyone holding the address can open without logging in. We are moving them behind a login, with time-limited links that work only for your family. Until that is finished, only share book links with people you trust.
- `summary` — Läs på svenska
- `span` — Svenska
- `h3` — I korthet
- `p.prose-plain` — Vi är Tale Forge AB, ett litet svenskt företag i Värnamo (org.nr 559543-1122). Vi gör personliga bilderböcker för ert barn.
- `p.prose-plain` — Ni berättar ett förnamn, ett åldersspann och ett språk, och kan om ni vill beskriva hur hjälten ser ut och ladda upp ett foto. Vi använder AI-tjänster för att skriva och illustrera. Med ett vanligt konto kan ni se och radera era uppgifter där. Bokmässans snabb-saga använder ett separat anonymt konto utan e-postadress. För frågor om uppgifter från ett sådant besök kan ni mejla oss. Vi säljer aldrig era uppgifter.
- `h3` — Vad vi samlar in
- `p.prose-plain` — Barnets förnamn, ett åldersspann (ett intervall, inte ett födelsedatum) och önskat språk. De beskrivningar av hjälten och vännen som ni skriver. Ett foto som ni kan välja att ladda upp (se nedan). Det målade porträttet och de färdiga böckerna. Er e-postadress, för inloggning och för att kunna nå er. Ljudet när sagan läses upp sparas i boken.
- `p.prose-plain` — I Bokmässans snabb-saga ber vi om barnets och den vuxnes förnamn, barnets åldersgrupp, deras relation och eventuellt en sagaidé. Ni kan välja att skapa sagan utan foton eller använda ett foto av vardera personen till tecknade porträtt. Vi skapar ett anonymt konto för besöket och försöker skapa fyra scenillustrationer (med båda möjliga sluten) och uppläsning för varje scen. Vi sparar sagan och de bilder, ljudfiler och porträtt som blir klara. Ingen e-postadress krävs där.
- `h3` — Fotot
- `p.prose-plain` — När ni laddar upp ett foto lagras originalfotot hos oss i Google Cloud Storage medan ett tecknat porträtt skapas. Bildtjänsten hos Google, eller Amazon som reserv, behandlar fotot för detta. Efter en lyckad porträttgenerering försöker vi radera originalfotot. Om porträttet misslyckas kan originalet finnas kvar. Vi kan inte lova en bestämd raderingstid. Det färdiga porträttet sparas separat. I Bokmässans snabb-saga skickas båda färdiga porträtten som bildreferenser till Microsoft Azure när sagans scener målas, eller till Google om bildtjänsten hos Azure inte svarar. Om porträtten inte blir klara går sagan fortfarande att läsa, men scenbilderna kan saknas.
- `p.prose-plain` — För Bokmässans snabb-saga skapas ett anonymt konto innan fotona laddas upp. Där försöker vår återkommande städning också radera originalfoton efter avslutade misslyckade porträttjobb. Sagan, scenbilderna, uppläsningen och eventuella porträtt kan finnas kvar efter att ni lämnar sidan. Om sidan laddas om eller stängs förlorar ni åtkomsten till det anonyma besöket; det raderar inte uppgifterna hos oss.
- `h3` — Vem behandlar uppgifterna
- `p.prose-plain` — Några företag hjälper oss bakom kulisserna (våra underbiträden enligt GDPR):

#### `section › article.glass › ul.prose-plain`

- `li` — Supabase, databas och lagring (EU).
- `li` — Microsoft Azure, AI-tjänster som skriver berättelserna och i första hand målar snabb-sagans scenbilder.
- `li` — Google Cloud Storage, där uppladdade foton lagras under porträttarbetet, och Google Gemini för porträtt, uppläsning och scenbilder när Azure inte svarar.
- `li` — Amazon AWS, reserv som målar porträttet om Googles tjänst inte svarar.
- `li` — ElevenLabs, reserv för uppläsningen om Googles tjänst inte svarar.
- `li` — PostHog (EU), statistik om hur appen används. För inloggade konton kopplas statistiken till en pseudonym kod (en envägs-hashning av konto-id:t), aldrig till namn eller e-postadress, och aldrig till barnets uppgifter. Koden sparas lokalt i webbläsaren (localStorage, inga kakor).
- `p.prose-plain` — Ett foto eller en beskrivning kan behandlas utanför EU/EES, bland annat i USA. EU-US Data Privacy Framework gäller bara mottagare som omfattas av ramverket; skyddet för en viss överföring beror på vilken tjänst som används. Kontakta oss för information om den aktuella överföringen. Vi behandlar barnets uppgifter med samtycke från en förälder eller vårdnadshavare. Samtycke ges i det vanliga kontoflödet eller med kryssrutan för snabb-sagan och kan tas tillbaka genom att radera profilen eller kontakta oss.
- `h3` — AI-innehåll
- `p.prose-plain` — Berättelserna, illustrationerna och porträtten skapas med AI. Vi berättar det öppet, så att ni och barnet vet att det är datorn som har hjälpt till att rita och skriva.
- `h3` — Era rättigheter
- `p.prose-plain` — Ni har rätt att se, rätta och radera uppgifterna om ert barn. Se och radera gör ni själva från [ert konto](/konto); för rättelser mejlar ni oss på [kevin@tale-forge.app](mailto:…@tale-forge.app). För uppgifter från Bokmässans anonyma snabb-saga behöver ni kontakta oss via samma adress, eftersom det kontot inte kan öppnas igen efter att sidan stängts. Är ni inte nöjda med vårt svar kan ni klaga hos Integritetsskyddsmyndigheten, imy.se.
- `h3` — Lagring och gallring
- `p.prose-plain` — Böckerna och barnets värld (hjälten, vännen och platserna som återkommer i böckerna) sparas så att resan kan fortsätta. När ni raderar barnets profil eller ert konto tas allt bort: namnet, beskrivningarna, porträttet, böckerna, ljudet och barnets värld. Vi inför också en automatisk städning av gamla oanvända uppgifter. Innan vi slår på den skriver vi här exakt hur länge saker sparas. Den städningen av konton och sagor är inte aktiverad för Bokmässans snabb-saga.
- `p.prose-plain` — Böckernas bilder och ljud ligger i dag på webbadresser som kan öppnas utan inloggning av den som har adressen. Vi håller på att flytta dem bakom inloggning, med tidsbegränsade länkar som bara fungerar för er familj. Tills det är klart: dela bara boklänkar med personer ni litar på.

#### `div.foot`

- `span` — Tale Forge, storybooks that remember your world.
- `span` — Beta · data-testid="beta-build-label"
- `span` — Version 16ab1756 · 26 Sep 2026 · data-testid="footer-version"
- `span` — Tale Forge AB, reg. no. 559543-1122, Varnamo, Sweden
- `a` — Contact · → `mailto:…@tale-forge.app`
- `a` — Privacy · → `/integritet`
- `a` — Terms · → `/villkor`

## 3. Client-side states

No client-side state changes the copy on this page beyond what is listed above (the theme toggle and language switch only swap labels already shown).

## 4. Server HTML vs hydrated DOM

Only in the hydrated DOM (added or changed by client JavaScript):

- `a` — Login · → `/login` · aria-label="Login"
- `a` — Pricing · → `/uppgradera` · aria-label="Pricing"
- `p.prose-plain` — You have the right to see, correct and erase your child's data. Seeing and erasing you do yourself from [your account](/konto); for corrections, email us at [kevin@tale-forge.app](mailto:…@tale-forge.app). For data from an anonymous Book Fair quick-story visit, please contact us at the same address, because that account cannot be reopened after the page is closed. If you are not happy with our answer you can complain to the Swedish data protection authority, IMY (imy.se).
- `p.prose-plain` — Ni har rätt att se, rätta och radera uppgifterna om ert barn. Se och radera gör ni själva från [ert konto](/konto); för rättelser mejlar ni oss på [kevin@tale-forge.app](mailto:…@tale-forge.app). För uppgifter från Bokmässans anonyma snabb-saga behöver ni kontakta oss via samma adress, eftersom det kontot inte kan öppnas igen efter att sidan stängts. Är ni inte nöjda med vårt svar kan ni klaga hos Integritetsskyddsmyndigheten, imy.se.
- `a` — Contact · → `mailto:…@tale-forge.app`

Only in the server HTML (replaced during hydration):

- `p.prose-plain` — You have the right to see, correct and erase your child's data. Seeing and erasing you do yourself from [your account](/konto); for corrections, email us at [[email protected]](/cdn-cgi/l/email-protection#1c77796a75725c687d7079317a736e7b79327d6c6c). For data from an anonymous Book Fair quick-story visit, please contact us at the same address, because that account cannot be reopened after the page is closed. If you are not happy with our answer you can complain to the Swedish data protection authority, IMY (imy.se).
- `p.prose-plain` — Ni har rätt att se, rätta och radera uppgifterna om ert barn. Se och radera gör ni själva från [ert konto](/konto); för rättelser mejlar ni oss på [[email protected]](/cdn-cgi/l/email-protection#c7aca2b1aea987b3a6aba2eaa1a8b5a0a2e9a6b7b7). För uppgifter från Bokmässans anonyma snabb-saga behöver ni kontakta oss via samma adress, eftersom det kontot inte kan öppnas igen efter att sidan stängts. Är ni inte nöjda med vårt svar kan ni klaga hos Integritetsskyddsmyndigheten, imy.se.
- `a` — Contact · → `/cdn-cgi/l/email-protection#640f01120d0a241005080149020b1603014a051414`

## 5. Screenshots

- [integritet__en__morgon__desktop__fold.png](../../screenshots/pages/integritet/integritet__en__morgon__desktop__fold.png)
- [integritet__en__morgon__mobile__fold.png](../../screenshots/pages/integritet/integritet__en__morgon__mobile__fold.png)
- [integritet__en__natt__desktop__fold.png](../../screenshots/pages/integritet/integritet__en__natt__desktop__fold.png)
- [integritet__en__natt__mobile__fold.png](../../screenshots/pages/integritet/integritet__en__natt__mobile__fold.png)
