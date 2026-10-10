# App strings (client JS dictionaries), Svenska | English

Every sv/en string table that ships in Tale Forge's client JavaScript, laid out as side-by-side tables in product order: landing explainer, navigation, the /start create flow, option lists, the waiting fire, next-book cards, the reader, sound, auth, moderation and pricing.
75 tables and 522 translated keys. The machine-readable twin, with chunk offsets and the server-rendered page pairs, is [i18n-strings.json](i18n-strings.json); page-by-page decks in reading order are in [pages/](pages/); vocabulary is in [glossary.md](glossary.md); voice analysis is in [../analysis/10-copy-voice-and-tone.md](../analysis/10-copy-voice-and-tone.md).
Strings are verbatim. `{name}`, `{time}`, `{price}`, `{names}`, `{minutes}`, `{title}` are the source's own placeholders; arrow-function templates are shown with `{name}` in place of the argument; `${...}` is a JS expression kept verbatim; `‹x›` is an unresolved reference.
Swedish addresses the family as "ni/er" (plural you) almost everywhere; auth, recovery and feedback screens switch to "du" (singular). See the analysis for counts.

## Contents

1. [Landing: "Så fungerar det / How it works"](#1-landing-så-fungerar-det--how-it-works) (1 table)
2. [Navigation and chrome](#2-navigation-and-chrome) (7 tables)
3. [Create flow (/start) screens](#3-create-flow-start-screens) (14 tables)
4. [Create flow: doors, recipe, world band](#4-create-flow-doors-recipe-world-band) (10 tables)
5. [Create options: ages, friends, keepsakes, art styles, voices](#5-create-options-ages-friends-keepsakes-art-styles-voices) (8 tables)
6. [Waiting fire (book generation)](#6-waiting-fire-book-generation) (7 tables)
7. [Next-book cards](#7-next-book-cards) (10 tables)
8. [Story reader](#8-story-reader) (10 tables)
9. [Ambient sound beds](#9-ambient-sound-beds) (1 table)
10. [Login, signup, recovery](#10-login-signup-recovery) (3 tables)
11. [Input moderation](#11-input-moderation) (1 table)
12. [Upgrade / pricing](#12-upgrade--pricing) (2 tables)
13. [Language helpers](#13-language-helpers) (1 table)

## 1. Landing: "Så fungerar det / How it works"

Landing page explainer chapter (the only landing copy shipped in JS). Key in JSON: `areas.landing`.

### `explainer`

Source: [3d9nxlx1n5pdy.js](../source/js/3d9nxlx1n5pdy.js) offset 875, module 29416 (exports: NarrationPlayPill, ExplainerChapter). Home page "Så fungerar det / How it works" chapter (ExplainerChapter, NarrationPlayPill). The rest of the landing page is server-rendered only (see serverRenderedPages.home). sv.steps.read.choiceLabels/prose are computed at runtime from beat S2 of the sample book (source/sample-book.iris-och-den-sparade-platsen.json beats[S2].choice.options[].label and first two sentences of .prose); resolved here.

| Key | Svenska | English |
|---|---|---|
| `kicker` | Så fungerar det | How it works |
| `headline` | Äventyr värda att prata om. | Adventures worth talking about. |
| `lede` | Från ett foto till en uppläst bilderbok med fyra olika slut. Så här går en kväll till. | From one photo to a narrated picture book with four different endings. Here is how an evening works. |
| `steps.hero.title` | Bygg er hjälte | Build your hero |
| `steps.hero.body` | Ladda upp en bild och välj det som gör ert barn till ert barn. Vi målar hjälten i bokens stil, och samma ansikte återkommer i varje scen. | Upload a photo and pick what makes your child your child. We paint the hero in the book's style, and the same face returns in every scene. |
| `steps.hero.micro` | Porträttet styr både bilderna och berättelsen. | The portrait shapes both the pictures and the story. |
| `steps.hero.artChip` | Skapad med AI | Created with AI |
| `steps.hero.portraitAlt` | Iris, den målade hjälten i exempelboken | Iris, the painted hero of the sample book |
| `steps.friend.title` | Ta med en vän | Bring a friend |
| `steps.friend.body` | En bästa kompis, en kusin eller ett husdjur. Vänner från er vardag kliver in i boken och stannar kvar som en del av världen. | A best friend, a cousin, or a pet. Friends from your everyday life step into the book and stay on as part of its world. |
| `steps.friend.micro` | I Alvas värld är Noah och räven Sixten med i varje bok. | In Alva's world, Noah and Sixten the fox are in every book. |
| `steps.friend.rows.0.name` | Noah | Noah |
| `steps.friend.rows.0.sub` | bästa kompisen · med i 2 böcker | best friend · in 2 books |
| `steps.friend.rows.1.name` | Sixten | Sixten |
| `steps.friend.rows.1.sub` | fjällräven · följer med i varje bok | the mountain fox · comes along in every book |
| `steps.adventure.title` | Välj kvällens äventyr | Pick tonight's adventure |
| `steps.adventure.body` | Välj tema och känsla. Sedan skriver, målar och läser vi in hela boken på en gång. Det tar ungefär tio minuter, och det säger vi hellre ärligt än låtsas att det går på en sekund. | Pick tonight's theme and mood. Then we write, paint, and narrate the whole book in one go. It takes about ten minutes, and we would rather say that honestly than pretend it takes a second. |
| `steps.adventure.micro` | Lagom tid för tandborstning och pyjamas. | Just enough time for toothbrushing and pajamas. |
| `steps.adventure.bakeLine` | Boken bakas. Ungefär tio minuter kvar. | The book is baking. About ten minutes to go. |
| `steps.read.title` | Läs och välj | Read and choose |
| `steps.read.body` | Berättarrösten läser högt, sida för sida. Två gånger i varje bok stannar berättelsen: ert barn väljer, och valet ändrar det som händer sedan. På riktigt. | The narrator reads aloud, page by page. Twice in every book the story stops: your child chooses, and the choice changes what happens next. For real. |
| `steps.read.micro` | Inga låtsasval. Båda vägarna är skrivna, målade och inlästa. | No pretend choices. Both paths are written, painted, and narrated. |
| `steps.read.playLabel` | Hör berättarrösten | Hear the narrator |
| `steps.read.playingLabel` | Spelar... | Playing... |
| `steps.read.voiceChip` | Morfar | Grandpa Erik |
| `steps.read.sceneAlt` | Uppslag ur exempelboken, sidan före det första valet | A spread from the sample book, the page before the first choice |
| `steps.read.audioSrc` | /landing/voice/grandpa-sample.mp3 | /landing/voice/grandpa-sample-en.mp3 |
| `steps.read.choiceLabels.0` | Gå med Mossa till den gröna mattan. | Go with Mossa to the green rug. |
| `steps.read.choiceLabels.1` | Stanna och rita med det nya barnet i fönsterljuset. | Stay and draw with the new child in the window light. |
| `steps.read.prose` | Iris gick in mellan fönsterbänken och mattan och lade ritpappret på ett lågt bord. Planen för den sparade platsen gällde inte längre. | Iris stepped between the windowsill and the rug and placed the drawing paper on a low table. The plan for the saved place no longer applied. |
| `steps.endings.title` | Fyra olika slut | Four different endings |
| `steps.endings.body` | Två val ger fyra vägar genom samma bok. Er kväll kan sluta på ett sätt, och samma bok kan sluta helt annorlunda hemma hos en annan familj. Läs igen, välj annorlunda och hitta en väg ni inte har sett. | Two choices make four paths through the same book. Your evening can end one way, and the same book can end differently in another family's home. Read it again, choose differently, and find a path you have not seen. |
| `steps.endings.caption` | Kartan över exempelboken Iris och den sparade platsen. Varje prick är en sida, varje guldstjärna ett val, varje medaljong ett slut. Alla fyra finns på riktigt. | The map of the sample book Iris and the Saved Place. Every dot is a page, every gold star a choice, every medallion an ending. All four really exist. |
| `steps.endings.sampleCta.label` | Läs exempelboken | Read the sample book |
| `steps.endings.sampleCta.href` | /share/iris-sparade-platsen | /share/iris-sparade-platsen |
| `steps.memory.title` | Världen minns | The world remembers |
| `steps.memory.body` | Nästa bok vet vem hjälten är, vilka vänner som var med och vilka platser ni har varit på. Ni fyller inte en hylla med lösa sagor. Ni bygger en värld. | The next book knows who the hero is, which friends came along, and the places you have been. You are not filling a shelf with loose stories. You are building a world. |
| `steps.memory.micro` | Hjältar, vänner och platser följer med från bok till bok. | Heroes, friends, and places carry over from book to book. |
| `steps.memory.memoryTag` | Sixten minns tornet | Sixten remembers the tower |
| `steps.memory.memoryTagSub` | från "Alva och fyraljuset" | from "Alva and the Fourth Candle" |
| `steps.memory.nextBookLabel` | nästa bok | next book |
| `closing.primary.label` | Skapa er hjälte | Create your hero |
| `closing.primary.href` | /start | /start |
| `closing.sample.label` | Läs exempelboken | Read the sample book |
| `closing.sample.href` | /share/iris-sparade-platsen | /share/iris-sparade-platsen |
| `map.hiddenStructure` | Boken börjar likadant för alla. Vid två tillfällen väljer barnet mellan två vägar. Två val ger fyra olika slut. | The book starts the same for everyone. At two points the child chooses between two paths. Two choices make four different endings. |
| `map.endingButtonLabels` | `[1,2,3,4].map(e=>ˋSlut ${e} av 4, visa v\xe4gen ditˋ)` (code) | `[1,2,3,4].map(e=>ˋEnding ${e} of 4, show the path thereˋ)` (code) |
| `map.choiceNodeLabels.0` | Val 1 | Choice 1 |
| `map.choiceNodeLabels.1` | Val 2 | Choice 2 |


## 2. Navigation and chrome

Navigation, language switcher, theme toggle. Key in JSON: `areas.nav-and-chrome`.

### `navAccount`

Source: [390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) offset 23275, module 3073 (exports: AccountNavLink). AccountNavLink when signed in.

| Key | Svenska | English |
|---|---|---|
| `(string)` | Konto | Account |

### `navBookshelf`

Source: [390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) offset 23303, module 3073 (exports: AccountNavLink).

| Key | Svenska | English |
|---|---|---|
| `(string)` | Bokhylla | Bookshelf |

### `navLogin`

Source: [390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) offset 23336, module 3073 (exports: AccountNavLink). The English nav link reads "Login" (one word) while the /login page heading and button say "Log in".

| Key | Svenska | English |
|---|---|---|
| `(string)` | Logga in | Login |

### `navPricing`

Source: [390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) offset 23365, module 3073 (exports: AccountNavLink).

| Key | Svenska | English |
|---|---|---|
| `(string)` | Priser | Pricing |

### `languageSwitcherAria`

Source: [390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) offset 26642, module 80157 (exports: LanguageSwitcher).

| Key | Svenska | English |
|---|---|---|
| `(string)` | Byt språk | Change language |

### `localeCookie`

Source: [390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) offset 27157, module 80157 (exports: LanguageSwitcher). Cookie written by the language switcher (code, not copy).

Non-language fields: `` = ${n.LOCALE_COOKIE}=${"en"===t?"en":"sv"}; path=/; max-age=31536000; SameSite=Lax

### `themeToggle`

Source: [390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) offset 27839, module 22530 (exports: ThemeToggle).

| Key | Svenska | English |
|---|---|---|
| `aria` | Byt tema | Switch theme |
| `night` | Natt | Night |
| `day` | Morgon | Morning |


## 3. Create flow (/start) screens

/start create flow screens s0..s8 (StartFlow). Key in JSON: `areas.create-flow`.

### `s0Pitch`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 196, module 9181 (exports: SCREEN_ORDER, StartFlow). /start screen s0 (server-rendered pitch). h1 = h1Lead + span.grad(h1Grad) + "."; span.grad is a solid accent colour, not a gradient.

| Key | Svenska | English |
|---|---|---|
| `kicker` | Riktiga bilderböcker, upplästa på svenska | Real picture books, read aloud |
| `h1Lead` | Ikväll är hjälten | Tonight the hero is |
| `h1Grad` | ert barn | your child |
| `lede` | Tale Forge skriver, målar och läser in en riktig bilderbok där ert barn är huvudpersonen. Porträttet ser ni om ett par minuter, den första boken är gratis. | Tale Forge writes, paints and narrates a real picture book where your child is the main character. You see the portrait in a couple of minutes, and the first book is free. |
| `cta` | Skapa er hjälte | Create your hero |
| `gallery` | Läs en exempelbok först | Read a sample book first |
| `badgeTitle` | Exempelbok | Sample book |
| `badgeSub` | Iris och den sparade platsen · på svenska | Iris och den sparade platsen · Swedish |
| `sampleAction` | Läs exempelboken | Read the Swedish sample |
| `sampleCoverAlt` | Omslag till exempelboken Iris och den sparade platsen | Cover of the Swedish sample book Iris och den sparade platsen |

### `s1Hero`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 1291, module 9181 (exports: SCREEN_ORDER, StartFlow). Step 1: name, pronoun.

| Key | Svenska | English |
|---|---|---|
| `heading` | Vem blir hjälten? | Who becomes the hero? |
| `placeholder` | Barnets namn | Your child's name |
| `next` | Vidare | Next |
| `genderHint` | Vilket ord ska sagan använda? | Which word should the story use? |
| `boy` | Han | He |
| `girl` | Hon | She |

### `accountReadyNotice`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 1580, module 9181 (exports: SCREEN_ORDER, StartFlow). Shown after returning from account confirmation.

| Key | Svenska | English |
|---|---|---|
| `(string)` | Kontot är klart. Nu bygger vi er hjälte. | Your account is ready. Now let's build your hero. |

### `s3Company`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 2796, module 9181 (exports: SCREEN_ORDER, StartFlow). Step 3: companion and keepsake.

| Key | Svenska | English |
|---|---|---|
| `companionLead` | Vem följer med | Who comes along with |
| `storyChooses` | Sagan väljer | The story chooses |
| `storyChoosesHint` | Du behöver inte välja en färdig vän. Sagan hittar någon när det passar. | You do not need to pick a ready-made friend. The story finds one when it fits. |
| `starterFriends` | Eller välj en färdig vän | Or choose a ready-made friend |
| `objectHeading` | Något kärt att ta med? | Something dear to bring? |
| `dryPill` | Färgen torkar på porträttet | The paint is drying on the portrait |
| `next` | Vidare | Next |
| `heroCardLabel` | Hjältekortet | The hero card |
| `fallbackName` | Hjälten | The hero |

### `s5Account`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 4573, module 9181 (exports: SCREEN_ORDER, StartFlow). Step 4 of 4: save the hero (account creation inside the flow). Heading = headingLead + {genitive name} + headingTail.

| Key | Svenska | English |
|---|---|---|
| `headingTail` | hjälte och börja den första boken. | hero and start the first book. |
| `headingLead` | Spara | Save |
| `trialLead` | Första boken är gratis. Porträttet, | The first book is free. The portrait, |
| `trialTail` | och allt ni just byggt följer med. | and everything you just built come along. |
| `emailPlaceholder` | Din mejladress | Your email address |
| `passwordPlaceholder` | Ditt lösenord | Your password |
| `showPassword` | Visa lösenord | Show password |
| `hidePassword` | Dölj lösenord | Hide password |
| `submit` | Skapa konto | Create account |
| `submitting` | Skapar konto... | Creating account... |
| `google` | Fortsätt med Google | Continue with Google |
| `savePresent` | Spara hjälten | Save the hero |
| `savingPresent` | Sparar hjälten... | Saving the hero... |
| `attestPrefix` | Jag är barnets förälder eller vårdnadshavare och godkänner | I am the child's parent or guardian and I accept |
| `policyLinkText` | integritetspolicyn | the privacy notice |
| `policyReadLink` | Läs integritetspolicyn | Read the privacy notice |
| `confirmNotice` | Kolla din e-post för att bekräfta kontot, sen fortsätter ni här. | Check your email to confirm the account, then continue here. |
| `claimError` | Något gick fel när hjälten skulle sparas. Allt ni byggt finns kvar, försök igen. | Something went wrong while saving the hero. Everything you built is still here, please try again. |
| `genericError` | Något gick fel. Försök igen. | Something went wrong. Please try again. |
| `moderationFallback` | Vi håller sagorna snälla och trygga. Prova gärna andra ord. | Let's keep our stories kind and safe! Please try different words. |
| `changeDescription` | Ändra beskrivningen | Change the description |
| `fallbackName` | Hjälten | The hero |
| `existingAccountLead` | Du har redan ett konto med den här adressen. Du behöver inte minnas lösenordet, vi mejlar dig en länk som loggar in dig direkt. | You already have an account with this address. You do not need to remember the password, we will email you a link that signs you straight in. |
| `sendLinkCta` | Mejla mig en inloggningslänk | Email me a login link |
| `sendingLink` | Skickar länken... | Sending the link... |
| `linkSentNotice` | Om adressen har ett konto ligger en inloggningslänk i inkorgen om en minut. Öppna den så fortsätter ni precis här, med hjälten ni just byggt. | If that address has an account, a login link is in the inbox within a minute. Open it and you carry on right here, with the hero you just built. |

### `s2Photo`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 8304, module 9181 (exports: SCREEN_ORDER, StartFlow). Step 2: photo upload. Heading = headingLead + {name} + headingTail.

| Key | Svenska | English |
|---|---|---|
| `headingLead` | Gör | Make |
| `headingTail` | till hjälten. | the hero. |
| `fallbackName` | ert barn | your child |
| `uploadTitle` | Välj ett foto | Choose a photo |
| `uploadTitleChosen` | Fint. Det här fotot blir hjälten. | Lovely. This photo becomes the hero. |
| `uploadSub` | Ansiktet räcker, resten målar vi. | The face is enough, we paint the rest. |
| `privacy` | Fotot används bara för att måla porträttet. Det tränar aldrig någon AI, och ni kan radera det när som helst. | The photo is only used to paint the portrait. It never trains any AI, and you can delete it whenever you like. |
| `paintPill` | Porträttet har börjat målas | The portrait has started painting |
| `next` | Vidare | Next |
| `skip` | Hoppa över, måla en hjälte åt oss | Skip, paint a hero for us |
| `decodeFailed` | Vi kunde inte läsa det fotot. Prova en JPEG eller PNG bild. | We could not read that photo. Please try a JPEG or PNG image. |
| `tooLarge` | Det fotot är för stort. Välj ett som är mindre än 6MB. | That photo is too large. Please choose one under 6MB. |
| `uploadLabel` | Välj ett foto | Choose a photo |
| `writeError` | Något gick fel. Försök igen. | Something went wrong. Please try again. |
| `saving` | Sparar... | Saving... |

### `s4Unveil`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 11179, module 9181 (exports: SCREEN_ORDER, StartFlow). Portrait reveal ("unveil") screen.

| Key | Svenska | English |
|---|---|---|
| `unveil` | Avtäck | Unveil |
| `painting` | Målar... | Painting... |
| `save` | Spara hjälten | Save the hero |
| `rename` | Ändra namnet | Change the name |
| `fallbackName` | Hjälten | The hero |
| `paintFailedLead` | Färgen ville inte fastna den här gången. | The colour would not settle this time. |
| `paintFailedHint` | Allt ni byggt är kvar. Vi provar igen. | Everything you built is safe. Let us try again. |
| `retry` | Måla igen | Paint again |
| `veilWaiting` | Er hjälte väntar bakom duken. | Your hero is waiting behind the veil. |
| `veilPainting` | Porträttet målas... | The portrait is being painted... |

### `s6Launch`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 12261, module 9181 (exports: SCREEN_ORDER, StartFlow). Last choice before the book; the launch sheet. {time} = WAIT_PHRASE.

| Key | Svenska | English |
|---|---|---|
| `lede` | Hjälten är klar. Välj en dörr så skrivs första boken, den tar {time}. | The hero is ready. Pick a door and the first book is written, it takes {time}. |
| `sheetHeading` | Redo att tända glöden? | Ready to light the ember? |
| `pickedLead` | Vi valde: | We picked: |
| `sheetBody` | bok skrivs, målas och läses in när ni trycker på Sätt igång. Det tar {time}, och ni kan stänga sidan under tiden. Boken lägger sig i bokhyllan när den är klar. | book will be written, painted and narrated once you press Light it. It takes {time}, and you can close the page meanwhile. The book lands on the bookshelf when it is ready. |
| `storyteller` | Vilken hjälte ni har byggt. Jag börjar berätta så fort ni säger till. | What a hero you have built. I start telling the moment you say the word. |
| `companionHeading` | Vem följer med? | Who comes along? |
| `companionHelper` | Berättelsen väljer vem som följer med om ni inte väljer någon. | The story chooses who comes along if you do not pick anyone. |
| `ignite` | Sätt igång | Light it |
| `igniting` | Glöden tänds... | Lighting the ember... |
| `wait` | Inte än | Not yet |
| `capError` | Er plan har inte plats för fler böcker just nu. Allt ni byggt är kvar. | Your plan has no room for more books right now. Everything you built is safe. |
| `capLink` | Se planer | See plans |
| `busyError` | En bok skapas redan för er. Den lägger sig i bokhyllan när den är klar. | A book is already being made for you. It lands on the bookshelf when it is ready. |
| `genericError` | Något gick fel när boken skulle börja. Försök igen. | Something went wrong starting the book. Please try again. |
| `languageError` | Språket kunde inte sparas. Försök igen. | The language could not be saved. Please try again. |
| `fallbackName` | Hjälten | The hero |

### `s7Forging`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 14257, module 9181 (exports: SCREEN_ORDER, StartFlow). Book being made. Heading = {genitive name} + headingTail.

| Key | Svenska | English |
|---|---|---|
| `headingTail` | saga växer fram. | story is taking shape. |
| `headingGeneric` | Sagan växer fram. | The story is taking shape. |
| `reads` | läser | reads |
| `voiceLineLead` | Jag skriver, målar och övar på att säga | I am writing, painting, and practicing saying |
| `voiceLineTail` | precis rätt. | just right. |
| `lostTrace` | Den här skärmen tappade bokens spår, men boken är kvar och lägger sig i bokhyllan när den är klar. | This screen lost track of the book, but the book is safe and lands on the bookshelf when it is ready. |
| `lostTraceLink` | Tillbaka till skapandet | Back to creating |

### `s8Handover`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 14920, module 9181 (exports: SCREEN_ORDER, StartFlow). Book ready: hand the device to the child.

| Key | Svenska | English |
|---|---|---|
| `headingLead` | Lämna över till | Hand it over to |
| `ledeMid` | stora bilder, berättarrösten, och ingenting | big pictures, the storyteller's voice, and nothing |
| `ledeTail` | måste läsa själv. | has to read alone. |
| `ledeLead` | Härifrån är boken | From here the book is |
| `open` | Öppna boken tillsammans | Open the book together |
| `fallbackName` | Hjälten | The hero |

### `stepHeaders`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 16462, module 9181 (exports: SCREEN_ORDER, StartFlow). Progress header title/sub per screen (null = no header).

| Key | Svenska | English |
|---|---|---|
| `s0` |  |  |
| `s1.step` | `1` | `1` |
| `s1.title` | Steg 1 av 4 · Hjälten | Step 1 of 4 · The hero |
| `s1.sub` | Inget konto och inget kort ännu. Ni börjar med barnet. | No account and no card yet. You start with your child. |
| `s2.step` | `2` | `2` |
| `s2.title` | Steg 2 av 4 · Fotot | Step 2 of 4 · The photo |
| `s2.sub` | Ett foto räcker för porträttet, och det går bra att hoppa över. | One photo is enough for the portrait, and skipping is fine. |
| `s3.step` | `3` | `3` |
| `s3.title` | Steg 3 av 4 · Sällskapet | Step 3 of 4 · The company |
| `s3.sub` | Porträttet målas i bakgrunden medan ni väljer. | The portrait is painted in the background while you choose. |
| `s4` |  |  |
| `s5.step` | `4` | `4` |
| `s5.title` | Steg 4 av 4 · Kontot | Step 4 of 4 · The account |
| `s5.sub` | Hjälten och porträttet sparas i er värld. | The hero and the portrait are saved in your world. |
| `s6.step` | `0` | `0` |
| `s6.title` | Sista valet före boken | The last choice before the book |
| `s6.sub` | Ett äventyrsval startar bygget. Överraska oss går alltid att välja. | Picking an adventure starts the build. Surprise us is always an option. |
| `s7.step` | `0` | `0` |
| `s7.title` | Boken skapas | The book is being made |
| `s7.sub` | Boken lägger sig i bokhyllan när den är klar. | The book lands on the bookshelf when it is ready. |
| `s8` |  |  |

### `backButton`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 17785, module 9181 (exports: SCREEN_ORDER, StartFlow).

| Key | Svenska | English |
|---|---|---|
| `(string)` | Tillbaka | Back |

### `s1Reassurance`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 17814, module 9181 (exports: SCREEN_ORDER, StartFlow).

| Key | Svenska | English |
|---|---|---|
| `(string)` | Ni börjar med barnet. Inget kort behövs. | You start with your child. No card needed. |

### `stepUnderConstruction`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 17913, module 9181 (exports: SCREEN_ORDER, StartFlow). Placeholder for an unfinished step.

| Key | Svenska | English |
|---|---|---|
| `body` | Det här steget byggs just nu. | This step is being built. |
| `next` | Vidare | Next |


## 4. Create flow: doors, recipe, world band

Adventure "doors", recipe line, world band, style picker (DoorGrid, RecipeLine, WorldBand, StylePicker). Key in JSON: `areas.create-flow-doors`.

### `firstRunDoorCards`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 38785, module 9181 (exports: SCREEN_ORDER, StartFlow). The three "doors" (adventure cards) offered for a very first book.

| Key | Svenska | English |
|---|---|---|
| `0.title` | Den försvunna lyktan | The Lost Lantern |
| `0.invitation` | En godnattsaga där kvällens ljus behöver hittas igen. | A bedtime story where tonight's light needs finding again. |
| `0.whyLine` | En mjuk start, vald för er allra första bok. | A gentle start, chosen for your very first book. |
| `1.title` | Tornet i molnen | The Tower in the Clouds |
| `1.invitation` | Ett större äventyr högt uppe bland molnen. | A bigger adventure high up among the clouds. |
| `1.whyLine` | För kvällar när modet vill växa. | For evenings when courage wants to grow. |
| `2.title` | Stjärnnatten | The Starry Night |
| `2.invitation` | En saga om vänskap under natthimlen. | A story about friendship under the night sky. |
| `2.whyLine` | Ett första steg, sparat till nästa bok. | A first step, saved for the next book. |

Non-language fields: `0.id` = first-run-ember; `0.kind` = ember; `0.register` = cozy; `0.premiseId` = lost-lantern-home-lanes; `0.domainId` = sel.self-regulation; `0.highlighted` = `True`; `1.id` = first-run-register; `1.kind` = register; `1.register` = adventure; `1.premiseId` = tower-in-the-clouds-stair; `1.domainId` = sel.self-regulation; `2.id` = first-run-competency; `2.kind` = competency; `2.premiseId` = starry-night-hilltop-meadow; `2.domainId` = sel.self-regulation

### `recipeModel`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 41995, module 9181 (exports: SCREEN_ORDER, StartFlow). Data model handed to the recipe line; labels come from CREATE_STYLE_PRESETS / CREATE_VOICES. Render functions kept as code.

| Key | Svenska | English |
|---|---|---|
| `style.label` | `v.labelSv` (code) | `v.labelEn` (code) |
| `voice.label` | `k.nameSv` (code) | `k.nameEn` (code) |
| `language.label` | svenska | English |

Non-language fields: `locale` = ‹s›; `style.thumbUrl` = `v.previewImageUrl` (code); `voice.thumbUrl` = `k.portraitUrl` (code); `companion` = `y&&x?{label:x}:null` (code); `companionAdd` = `!!x` (code); `renderStylePicker` = `()=>(0,t.jsx)(Y.StylePicker,{selectedId:p,onSelect:e=>n({style:e}),locale:s})` (code); `renderVoicePicker` = `()=>(0,t.jsx)("div",{className:"voices",children:q.CREATE_VOICES.map(e=>{let a=e.id===g;return(0,t.jsxs)("button",{type:"button",className:a?"trait voice on":"t…` (code); `renderLanguagePicker` = `()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"voices","aria-busy":T,children:Z.map(e=>{let a=e.id===m;return(0,t.jsx)("button",{type:"button"…` (code); `renderCompanionPicker` = `x?()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{className:"sec-intro",style:{margin:0},children:o.companionHelper}),(0,t.jsx)("div",{className:"voices",ch…` (code)

### `recipeSentenceTemplate`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 46021, module 9181 (exports: SCREEN_ORDER, StartFlow). Assembled summary sentence on the launch sheet.

| Key | Svenska | English |
|---|---|---|
| `(string)` | ${u.adventureDirection} för ${u.heroName} och ${u.companion}, i ${u.styleLabel.toLowerCase()}. ${u.narratorLabel} ${o.reads}. | ${u.adventureDirection} for ${u.heroName} and ${u.companion}, in ${u.styleLabel.toLowerCase()}. ${u.narratorLabel} ${o.reads}. |

### `doorRegisterLabels`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 14713, module 83876 (exports: DoorGrid, RecipeLine, WorldBand, StylePicker). Small caps register label on each door card.

| Key | Svenska | English |
|---|---|---|
| `godnatt` | Godnatt | Bedtime |
| `aventyr` | Äventyr | Adventure |
| `vanskap` | Vänskap | Friendship |

### `doorChoose`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 14830, module 83876 (exports: DoorGrid, RecipeLine, WorldBand, StylePicker).

| Key | Svenska | English |
|---|---|---|
| `choose` | Välj den här | Pick this one |

### `surpriseDoor`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 15881, module 83876 (exports: DoorGrid, RecipeLine, WorldBand, StylePicker). The fourth door. Body = bodyLead + {genitive name} + bodyTail.

| Key | Svenska | English |
|---|---|---|
| `cap` | Överraska | Surprise |
| `title` | Överraska oss | Surprise us |
| `bodyLead` | Vi väljer äventyr, bildstil och röst utifrån | We pick the adventure, art style and voice for |
| `bodyTail` | ålder. | age. |
| `button` | Överraska oss | Surprise us |

### `doorGridHeading`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 17387, module 83876 (exports: DoorGrid, RecipeLine, WorldBand, StylePicker).

| Key | Svenska | English |
|---|---|---|
| `heading` | Välj kvällens äventyr | Choose tonight's adventure |

### `recipeLine`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 18014, module 83876 (exports: DoorGrid, RecipeLine, WorldBand, StylePicker). "Bokens recept" line under the doors and its edit sheets.

| Key | Svenska | English |
|---|---|---|
| `recipeTitle` | Bokens recept | Book recipe |
| `paintLead` | Ikvällens bok målas i | Tonight's book is painted in |
| `readLead` | läses av | read by |
| `onLanguage` | på | in |
| `withLead` | tillsammans med | together with |
| `addFriend` | + ta med en vän | + bring a friend |
| `styleTitle` | Bildstil | Art style |
| `voiceTitle` | Berättarröst | Narrator voice |
| `languageTitle` | Bokens språk | The book's language |
| `companionTitle` | Vem följer med? | Who comes along? |
| `done` | Klar | Done |
| `close` | Stäng | Close |

### `worldBand`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 22133, module 83876 (exports: DoorGrid, RecipeLine, WorldBand, StylePicker). Band showing the child's story world and what it remembers.

| Key | Svenska | English |
|---|---|---|
| `world` | sagovärld | story world |
| `fallbackTitle` | Er sagovärld | Your storyworld |
| `editHero` | Ändra hjälten | Edit hero |
| `memoryLead` | Världen minns: | The world remembers: |

### `stylePicker`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 23890, module 83876 (exports: DoorGrid, RecipeLine, WorldBand, StylePicker). ARIA strings of the style listbox.

| Key | Svenska | English |
|---|---|---|
| `listboxLabel` | Välj en berättarstil | Choose a story style |
| `selected` | Vald | Selected |


## 5. Create options: ages, friends, keepsakes, art styles, voices

Option lists the flow offers: age groups, starter friends, keepsakes, art styles, narrator voices, default looks. Key in JSON: `areas.create-options`.

### `starterFriends`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 1835, module 9181 (exports: SCREEN_ORDER, StartFlow). Ready-made companions on step 3; clause is appended to the hero-card sentence.

| Key | Svenska | English |
|---|---|---|
| `0.label` | Rufus räven | Rufus the fox |
| `0.clause` | och räven Rufus log | and Rufus the fox smiled |
| `1.label` | Luna ugglan | Luna the owl |
| `1.clause` | och ugglan Luna blinkade långsamt | and Luna the owl blinked slowly |
| `2.label` | Bo draken | Bo the dragon |
| `2.clause` | och draken Bo blåste en liten rökring | and Bo the dragon blew a small smoke ring |

Non-language fields: `0.id` = rufus; `0.short` = Rufus; `1.id` = luna; `1.short` = Luna; `2.id` = bo; `2.short` = Bo

### `keepsakes`

Source: [0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) offset 2289, module 9181 (exports: SCREEN_ORDER, StartFlow). Objects on step 3 ("Something dear to bring?").

| Key | Svenska | English |
|---|---|---|
| `0.label` | Röd halsduk | Red scarf |
| `0.clause` | drog åt sin röda halsduk | pulled the red scarf tight |
| `1.label` | Gammal lykta | Old lantern |
| `1.clause` | höll lyktan högt | held the lantern high |
| `2.label` | Träsvärd | Wooden sword |
| `2.clause` | lyfte träsvärdet mot stjärnorna | raised the wooden sword to the stars |

Non-language fields: `0.id` = halsduk; `1.id` = lykta; `2.id` = svard

### `friendLooks`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 50558, module 2002 (exports: ILLUSTRATED_HERO_LOOK, claimDraft, createChildAndHero, localizeFriendLook). Look and mannerism fed to the illustration/story engine for starter friends.

| Key | Svenska | English |
|---|---|---|
| `rufus.look` | en räv med varm röd päls | a fox with warm red fur |
| `rufus.mannerism` | viftar på svansen när han tänker | flicks his tail when he is thinking |
| `luna.look` | en uggla med mjuka fjädrar | an owl with soft feathers |
| `luna.mannerism` | blinkar långsamt | blinks slowly |
| `bo.look` | en liten drake med gröna fjäll | a small dragon with green scales |
| `bo.mannerism` | blåser små rökringar | blows small smoke rings |

Non-language fields: `rufus.short` = Rufus; `luna.short` = Luna; `bo.short` = Bo

### `keepsakeLooks`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 51048, module 2002 (exports: ILLUSTRATED_HERO_LOOK, claimDraft, createChildAndHero, localizeFriendLook).

| Key | Svenska | English |
|---|---|---|
| `halsduk.name` | röd halsduk | red scarf |
| `halsduk.look` | en mjuk röd halsduk | a soft red scarf |
| `lykta.name` | gammal lykta | old lantern |
| `lykta.look` | en gammal lykta med ett varmt sken | an old lantern with a warm glow |
| `svard.name` | träsvärd | wooden sword |
| `svard.look` | ett träsvärd med slitna kanter | a wooden sword with worn edges |

### `heroLook`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 51415, module 2002 (exports: ILLUSTRATED_HERO_LOOK, claimDraft, createChildAndHero, localizeFriendLook). Hero description used when no photo is given. en resolved from ILLUSTRATED_HERO_LOOK in the same module.

| Key | Svenska | English |
|---|---|---|
| `photo` | ser ut precis som på sitt målade porträtt | looks just like their painted portrait |
| `look` | ett modigt sagobarn med varma ögon och rufsigt hår | A brave storybook child hero with warm eyes and tousled hair |

### `AGE_GROUPS`

Source: [2x2s34sgoij7z.js](../source/js/2x2s34sgoij7z.js) offset 3905, module 32123 (exports: AGE_GROUPS). Age bands A/B/C (step 1 chips).

| Key | Svenska | English |
|---|---|---|
| `2.0.label` | 4 till 5 år | 4 to 5 years |
| `2.1.label` | 6 till 7 år | 6 to 7 years |
| `2.2.label` | 8 till 9 år | 8 to 9 years |

Non-language fields: `0` = AGE_GROUPS; `1` = `0`; `2.0.value` = 4-5; `2.0.band` = A; `2.1.value` = 6-7; `2.1.band` = B; `2.2.value` = 8-9; `2.2.band` = C

### `CREATE_STYLE_PRESETS`

Source: [390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) offset 30796, module 67711 (exports: CREATE_STYLE_PRESETS, DEFAULT_CREATE_STYLE_ID, getCreateStylePreset). Illustration styles. "description" exists only in English (internal).

| Key | Svenska | English |
|---|---|---|
| `0.label` | Mjuk akvarell | Soft Watercolor |
| `1.label` | New Yorker-tusch, en accent | New Yorker ink, one accent |
| `2.label` | Seriestil | Comic book |
| `3.label` | Kritteckning | Crayon, drawn by a kid |
| `4.label` | Lysande magi | Glowing magic |
| `5.label` | Retrospel-pixel | Retro game pixel art |
| `6.label` | Lera-animation | Claymation |
| `7.label` | Vintage screentryck | Vintage screen-print |

Non-language fields: `0.id` = watercolor; `0.description` = Warm painted scenes like a feature animation; `0.previewImageUrl` = /style-previews/create/watercolor.jpg; `1.id` = inkaccent; `1.description` = Bold black ink on white, one pop of color; `1.previewImageUrl` = /style-previews/create/inkaccent.png; `2.id` = comic; `2.description` = Punchy inked panels with action energy; `2.previewImageUrl` = /style-previews/create/comic.png; `3.id` = crayon; `3.description` = Wobbly wax-crayon charm, taped to the fridge; `3.previewImageUrl` = /style-previews/create/crayon.png; `4.id` = neon; `4.description` = Glowing neon light on any scene; `4.previewImageUrl` = /style-previews/create/neon.png; `5.id` = pixel; `5.description` = Chunky 16-bit pixels like a beloved old game; `5.previewImageUrl` = /style-previews/create/pixel.png; `6.id` = clay; `6.description` = Stop-motion clay characters with fingerprints and seams; `6.previewImageUrl` = /style-previews/create/clay.png; `7.id` = screenprint; `7.description` = 1960s poster colors, bold shapes, print texture; `7.previewImageUrl` = /style-previews/create/screenprint.png

### `CREATE_VOICES`

Source: [390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) offset 32427, module 99026 (exports: CREATE_VOICES, DEFAULT_CREATE_VOICE_ID, voiceSampleUrl). Narrator voices; Morfar Erik is the default.

| Key | Svenska | English |
|---|---|---|
| `0.name` | Morfar Erik | Grandpa Erik |
| `0.description` | En varm, vis berättare med en mysig godnattstämma | A warm, wise storyteller with a cozy bedtime voice |
| `1.name` | Berättaren Lily | Storyteller Lily |
| `1.description` | En livfull, uttrycksfull berättare fylld av förundran | A bright, expressive narrator full of wonder |
| `2.name` | Berättaren Marcus | Narrator Marcus |
| `2.description` | En trygg, äventyrlig röst för spännande berättelser | A steady, adventurous voice for exciting tales |
| `3.name` | Unga Saga | Young Saga |
| `3.description` | En entusiastisk ung röst som känns som en kompis | An enthusiastic young voice that feels like a friend |

Non-language fields: `0.id` = grandpa; `0.sampleUrl` = /voices/grandpa.mp3; `0.sampleUrlEn` = /voices/grandpa-en.mp3; `0.portraitUrl` = /voices/portrait-grandpa.jpg; `1.id` = female; `1.sampleUrl` = /voices/female.mp3; `1.sampleUrlEn` = /voices/female-en.mp3; `1.portraitUrl` = /voices/portrait-female.jpg; `2.id` = male; `2.sampleUrl` = /voices/male.mp3; `2.sampleUrlEn` = /voices/male-en.mp3; `2.portraitUrl` = /voices/portrait-male.jpg; `3.id` = young; `3.sampleUrl` = /voices/young.mp3; `3.sampleUrlEn` = /voices/young-en.mp3; `3.portraitUrl` = /voices/portrait-young.jpg


## 6. Waiting fire (book generation)

Waiting screen while a book is generated: job status, "Väntelden" (the waiting fire), Glodvakten. Key in JSON: `areas.waiting-fire`.

### `JOB_STATUS_COPY`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 233, module 78128 (exports: JOB_STATUS_COPY, GLOD_COPY, JobStatus, formatGlod, glodLineFor, glodStateForView). Generation job status copy.

| Key | Svenska | English |
|---|---|---|
| `inProgress` | Din saga växer fram | Your story is coming to life |
| `queuedHeading` | Din saga står i kö | Your story is in line |
| `firstBookQueuedHeading` | {names} allra första saga står i kö | {names} very first story is in line |
| `firstBookHeading` | {names} allra första bok smids nu | {names} very first book is being made |
| `queuedBody` | Er saga väntar på att börja. Den startar av sig själv när sagosmedjan är redo. Ni kan stänga sidan; boken lägger sig i bokhyllan när den är klar. | Your story is waiting to begin. It starts automatically when the forge is ready. You can close this page; the book lands on the bookshelf when it is ready. |
| `expectation` | En riktig bilderbok tar ${i.WAIT_PHRASE.sv}. Du kan stanna här, den öppnas av sig själv när den är klar. Stänger du sidan är boken kvar, den lägger sig i bokhyllan när den är klar. | A real picture book takes ${i.WAIT_PHRASE.en}. You can stay here, it opens by itself when it is ready. If you close this page the book is safe, it lands on the bookshelf when it is ready. |
| `steps.0` | Berättelsen planeras | The story is planned |
| `steps.1` | Orden skrivs | The words are written |
| `steps.2` | Rollerna målas | The cast is painted |
| `steps.3` | Boken görs redo att öppnas | The book is made ready to open |
| `rewriting` | Vår redaktör skickade tillbaka utkastet, så berättaren skriver ett nytt. Bra böcker behöver en omskrivning ibland. | Our editor sent the draft back, so the storyteller is writing a fresh one. Good books take a rewrite or two. |
| `failed` | Den här sagan blev inte klar den här gången. | That story did not come together this time. |
| `gated` | Den här sagan behöver formas om lite innan den är redo. | This story needs a gentle rework before it is ready. |
| `stuck` | Vi kunde inte hitta din färdiga saga. Välj ett annat äventyr. | We could not find your finished story. Please try another adventure. |
| `retry` | Välj ett annat äventyr | Try another adventure |

### `GLOD_COPY`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 7418, module 78128 (exports: JOB_STATUS_COPY, GLOD_COPY, JobStatus, formatGlod, glodLineFor, glodStateForView). "Glöd" = ember. The waiting screen ("Väntelden", the waiting fire) and its memory embers.

| Key | Svenska | English |
|---|---|---|
| `canvasLabel` | Väntelden. Fånga en glöd för att se vad den minns. | The waiting fire. Touch an ember to see what it remembers. |
| `kicker` | Väntelden | The waiting fire |
| `forgeUnavailable.title` | Smedjan är tom just nu | The smithy is empty right now |
| `forgeUnavailable.body` | Er saga står kvar och är sparad. Ingen annan familj står före er; smedjan är bara tom för stunden. Boken börjar av sig själv så snart en smed är tillbaka, och lägger sig i bokhyllan när den är klar. Ni kan stänga sidan. | Your story is saved and still here. No other family is ahead of you; the workshop is simply empty for the moment. The book starts by itself as soon as a smith is back, and lands on the bookshelf when it is ready. You can close this page. |
| `terminal.failed.title` | Elden kunde inte slutföra sagan | The fire could not finish this story |
| `terminal.failed.body` | Den ofärdiga sagan lades inte i bokhyllan. Gå tillbaka och välj ett nytt äventyr, så försöker vi igen. | The unfinished story was not added to the bookshelf. Go back and choose a new adventure, then we will try again. |
| `terminal.failed.action` | Välj ett nytt äventyr | Choose a new adventure |
| `terminal.gated.title` | Den här sagan blev inte redo | This story was not ready |
| `terminal.gated.body` | Vi stoppade den innan den nådde bokhyllan. Välj ett nytt äventyr, så smider vi en helt ny saga. | We stopped it before it reached the bookshelf. Choose a new adventure and we will forge a completely new story. |
| `terminal.gated.action` | Välj ett nytt äventyr | Choose a new adventure |
| `terminal.stuck.title` | Vi letar efter er saga | We are finding your story |
| `terminal.stuck.body` | Den här sidan når inte väntelden just nu. Elden fortsätter att smida er bok hos oss, och boken lägger sig i bokhyllan när den är klar, även om ni stänger sidan. | This page cannot see the waiting fire right now. The fire keeps forging your book on our side, and the book lands on the bookshelf when it is ready, even if you close this page. |
| `terminal.stuck.action` | Kontrollera igen | Check again |
| `terminal.working` | Ett ögonblick... | One moment... |
| `terminal.actionFailed` | Det gick inte att fortsätta just nu. Försök igen. | We could not continue just now. Please try again. |
| `memFrom` | från '{title}' | from '{title}' |
| `carryThread` | Spara till nästa saga | Save for the next book |
| `threadCarried` | Sparat: nästa gång ni skapar en bok är det här minnet det första valet ni ser. | Saved: next time you make a book, this memory is the first choice you see. |
| `catchEmber` | Fånga en gnista som minns en stund ur era böcker | Catch a spark that remembers a moment from your books |
| `catchCue` | Fånga en gnista | Catch a spark |
| `closeMemory` | Stäng minnet | Close the memory |
| `revisitEmber` | Minns igen från '{title}' | Revisit a memory from '{title}' |
| `revisitCue` | Minns igen | Revisit |
| `sourceReturned` | Glöden lyser nu i '{title}'. | The ember now glows in '{title}'. |
| `neutralMemHook` | Den här glöden minns något ur en av era böcker. | This ember remembers something from one of your books. |
| `freshMemHook` | Den allra första gnistan. Den väntar på minnen från er första saga ikväll. | The very first spark. It is waiting for memories from your first story tonight. |
| `freshPreviewHook` | {names} första gnista bär kvällens val: {adventure}, med {companion}. | {name}'s first spark holds tonight's choice: {adventure}, with {companion}. |
| `finaleLine` | Elden har smitt klart din saga. | The fire has forged your story. |
| `finaleOpen` | Öppna boken | Open the book |
| `finaleTitle` | En ny saga om {name} | A new story about {name} |
| `fallbackName` | hjälten | the hero |

### `glodLines`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 11192, module 78128 (exports: JOB_STATUS_COPY, GLOD_COPY, JobStatus, formatGlod, glodLineFor, glodStateForView). Status line tails by job state; "warm" = returning family, "cold" = very first book.

| Key | Svenska | English |
|---|---|---|
| `queued.warm` | er saga har sin plats vid väntelden och startar av sig själv, så ni kan stänga sidan om ni vill. | your story has its place by the waiting fire and starts by itself, so you can close this page if you like. |
| `queued.cold` | {names} allra första saga har sin plats vid väntelden och startar av sig själv, så ni kan stänga sidan om ni vill. | {names} very first story has its place by the waiting fire and starts by itself, so you can close this page if you like. |
| `making.warm` | kvällens bok smids i elden nu och tar {minutes}, och den lägger sig i bokhyllan även om ni stänger sidan. | tonight's book is being made in the fire and takes {minutes}, and it lands on the bookshelf even if you close this page. |
| `making.cold` | {names} allra första bok smids i elden nu och tar {minutes}, och den lägger sig i bokhyllan även om ni stänger sidan. | {names} very first book is being made in the fire and takes {minutes}, and it lands on the bookshelf even if you close this page. |
| `nearlyReady.warm` | boken är nästan färdig och lägger sig i bokhyllan när den är klar, en hel saga tar {minutes} att smida. | the book is nearly ready and lands on the bookshelf when it is done, a whole story takes {minutes} to forge. |
| `nearlyReady.cold` | {names} allra första bok är nästan färdig och lägger sig i bokhyllan när den är klar, en hel saga tar {minutes} att smida. | {names} very first book is nearly ready and lands on the bookshelf when it is done, a whole story takes {minutes} to forge. |
| `ready.warm` | *(empty)* | *(empty)* |
| `unlit.warm` | smedjan är tom just nu, men er saga står kvar och startar av sig själv så snart en smed är tillbaka. | the smithy is empty right now, but your story is safe and starts by itself as soon as a smith is back. |
| `failed.warm` | elden kunde inte slutföra sagan, välj ett nytt äventyr så försöker vi igen. | the fire could not finish this story, choose a new adventure and we will try again. |
| `gated.warm` | den här sagan blev inte redo, välj ett nytt äventyr så smider vi en helt ny. | this story was not ready, choose a new adventure and we will forge a completely new one. |
| `stuck.warm` | den här sidan når inte väntelden just nu, men elden fortsätter att smida er bok hos oss. | this page cannot see the waiting fire right now, but the fire keeps forging your book on our side. |

### `fireSoundToggle`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 35390, module 61094 (exports: saveNextThreadIntent, clearNextThreadIntent, readNextThreadIntent, Glodvakten). Glodvakten (ember watcher) sound chip.

| Key | Svenska | English |
|---|---|---|
| `label` | Eldljud | Fire sound |

### `previewOpenAria`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 37554, module 61094 (exports: saveNextThreadIntent, clearNextThreadIntent, readNextThreadIntent, Glodvakten).

| Key | Svenska | English |
|---|---|---|
| `(string)` | Öppna förhandsvisning av kvällens saga | Open tonight's story preview |

### `previewDialogLabel`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 43201, module 61094 (exports: saveNextThreadIntent, clearNextThreadIntent, readNextThreadIntent, Glodvakten).

| Key | Svenska | English |
|---|---|---|
| `(string)` | Förhandsvisning av kvällens saga | Tonight's story preview |

### `WAIT_PHRASE`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 50290, module 56020 (exports: WAIT_PHRASE, waitPhrase). The only stated duration inside the app; the landing page says "ungefär tio minuter" / "about ten minutes".

| Key | Svenska | English |
|---|---|---|
| `(string)` | några minuter | a few minutes |


## 7. Next-book cards

Cards proposing the next book (assembleCards, buildEmberCard). Key in JSON: `areas.next-book-cards`.

### `registerCards`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 45446, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards). Door cards that change the mood (register) of the next book.

| Key | Svenska | English |
|---|---|---|
| `cozy.title` | Ett mysigt äventyr | A cozy adventure |
| `cozy.invitation` | Nästa gång, ett lugnt och mysigt äventyr nära hemma. | Next time, a quiet, cozy adventure close to home. |
| `adventure.title` | Ett stort äventyr | A big adventure |
| `adventure.invitation` | Nästa gång, ett större äventyr ute i världen. | Next time, a bigger adventure out in the world. |
| `silly.title` | Ett larvigt äventyr | A silly adventure |
| `silly.invitation` | Nästa gång, ett larvigt äventyr att skratta åt. | Next time, a silly, laugh-out-loud adventure. |
| `wonder.title` | Ett underbart äventyr | A wonder-filled adventure |
| `wonder.invitation` | Nästa gång, ett äventyr fullt av under och magi. | Next time, an adventure full of wonder and magic. |

### `registerWhyLines`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 46271, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards).

| Key | Svenska | English |
|---|---|---|
| `cozy` | Samma hjälte, ny stämning: väljer ni det här blir nästa bok stilla och trygg. | Same hero, new mood: pick this and the next book turns calm and snug. |
| `adventure` | Samma hjälte, ny stämning: väljer ni det här blir nästa bok modig och vild. | Same hero, new mood: pick this and the next book turns bold and wild. |
| `silly` | Samma hjälte, ny stämning: väljer ni det här blir nästa bok tokig och full av fniss. | Same hero, new mood: pick this and the next book turns silly and full of giggles. |
| `wonder` | Samma hjälte, ny stämning: väljer ni det här fylls nästa bok av stilla magi. | Same hero, new mood: pick this and the next book fills with quiet magic. |

### `competencyWhyLineNext`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 47326, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards). ${d(!0)} = " för {firstName}" (sv) / " for {firstName}" (en), empty if no name. Used when the shelf already has books.

| Key | Svenska | English |
|---|---|---|
| `(string)` | Nästa steg${d(!0)}, valt för att bygga vidare på sagan. | The next step${d(!1)}, chosen to build on the story so far. |

### `competencyWhyLineFirst`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 47464, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards). As above, used when the shelf is empty.

| Key | Svenska | English |
|---|---|---|
| `(string)` | Ett första steg${d(!0)}, sparat till nästa bok. | A first step${d(!1)}, saved for the next book. |

### `competencyCard`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 47584, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards).

| Key | Svenska | English |
|---|---|---|
| `title` | En saga steg längre | A story one step further |
| `invitation` | Nästa saga smyger in något nytt att öva, mitt i äventyret. | The next story tucks something new to practice inside the adventure. |

Non-language fields: `id` = competency:${s}:${r}; `kind` = competency; `whyLine` = ‹c›; `register` = ‹i›

### `emberInvitationWithHook`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 48088, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards). "Ember" card that continues a thread from the last story; hook = a line from that story.

| Key | Svenska | English |
|---|---|---|
| `(string)` | Ur er förra saga: "${e.hook}" | From your last story: "${e.hook}" |

### `emberInvitationGeneric`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 48168, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards).

| Key | Svenska | English |
|---|---|---|
| `(string)` | En tråd från er förra saga kan bli nästa bok. | A thread from your last story could become the next book. |

### `emberWhyLineWithTitle`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 48289, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards).

| Key | Svenska | English |
|---|---|---|
| `(string)` | Hämtad ur "${e.storyTitle}". Väljer ni det här växer nästa bok ur just den tråden. | Drawn from "${e.storyTitle}". Pick this and the next book grows from that very thread. |

### `emberWhyLineGeneric`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 48490, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards).

| Key | Svenska | English |
|---|---|---|
| `(string)` | Hämtad ur er förra saga. Väljer ni det här växer nästa bok ur just den tråden. | Drawn from your last story. Pick this and the next book grows from that very thread. |

### `emberCard`

Source: [2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) offset 48673, module 16335 (exports: buildEmberCard, looksSwedish, assembleCards).

| Key | Svenska | English |
|---|---|---|
| `title` | En saga som spinner vidare | A story that carries on |

Non-language fields: `id` = ember:${e.id}; `kind` = ember; `invitation` = ‹d›; `whyLine` = ‹c›; `...s?{register:s}:{}` = «spread»; `highlighted` = `True`


## 8. Story reader

StoryReader: cover, page navigation, narration, background sound, ending ceremony, grown-up feedback. Key in JSON: `areas.reader`.

### `readerCover`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 197, module 88374 (exports: StoryReader). StoryReader cover screen.

| Key | Svenska | English |
|---|---|---|
| `read` | Läs sagan | Read the story |
| `listen` | Lyssna-läge | Listen mode |
| `madeFor` | En saga för {name} | A story for {name} |
| `madeWithAi` | Skapad med AI. | Made with AI. |
| `coverArtAlt` | Omslagsbild till {name} | Cover illustration for {name} |

### `readerPictureWait`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 1698, module 88374 (exports: StoryReader).

| Key | Svenska | English |
|---|---|---|
| `pictureWait` | Bilden målas fortfarande. | The picture is still being painted. |

### `narrationControls`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 2673, module 88374 (exports: StoryReader). aria-labels of the narration buttons.

| Key | Svenska | English |
|---|---|---|
| `playNarration` | Spela berättelsen | Play narration |
| `pauseNarration` | Pausa berättelsen | Pause narration |
| `restartNarration` | Börja om sidan | Restart this page |

### `soundMenu`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 4677, module 88374 (exports: StoryReader). Background sound menu.

| Key | Svenska | English |
|---|---|---|
| `soundTitle` | Bakgrundsljud | Background sound |
| `groupAmbience` | Stämning | Ambience |
| `groupMusic` | Musik | Music |
| `soundOff` | Av | Off |
| `volume` | Volym | Volume |

### `feedbackIssueTags`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 7736, module 88374 (exports: StoryReader). Grown-up feedback chips after "Inte än / Not yet".

| Key | Svenska | English |
|---|---|---|
| `0` | Något var otydligt | Something was unclear |
| `1` | Valen kändes för lika | Choices felt too similar |
| `2` | För lång | Too long |
| `3` | Väntan var för lång | The wait was too long |
| `4` | Fångade inte vårt intresse | Did not hold our attention |
| `5` | Problem med en bild | Issue with an image |
| `6` | Problem med ljudet | Issue with the audio |
| `7` | Oro kring trygghet | Safety concern |
| `8` | Oro kring integritet | Privacy concern |
| `9` | Tekniskt problem | Technical problem |
| `10` | Något annat | Something else |

Non-language fields: `0.tag` = confusing; `1.tag` = choices_felt_same; `2.tag` = too_long; `3.tag` = wait_too_long; `4.tag` = not_engaging; `5.tag` = image_issue; `6.tag` = audio_issue; `7.tag` = safety_concern; `8.tag` = privacy_concern; `9.tag` = technical_problem; `10.tag` = other

### `feedbackForm`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 8496, module 88374 (exports: StoryReader).

| Key | Svenska | English |
|---|---|---|
| `grownUp` | Till dig som vuxen | For grown-ups |
| `question` | Skulle er familj välja ett nytt äventyr som det här? | Would your family choose another adventure like this? |
| `yes` | Ja | Yes |
| `yesRetry` | Ja, försök igen | Yes, try again |
| `notYet` | Inte än | Not yet |
| `issueLegend` | Vad gjorde att det inte kändes rätt än? Välj upp till 6 om du vill. | What made it not feel right yet? Choose up to 6, if you like. |
| `commentLabel` | Är det något mer du vill berätta? Valfritt, upp till 1000 tecken. | Anything else you would like to tell us? Optional, up to 1000 characters. |
| `submit` | Skicka feedback | Send feedback |
| `retry` | Försök igen | Try again |
| `sending` | Skickar feedback... | Sending feedback... |
| `thanks` | Tack för att du berättade. | Thank you for telling us. |
| `error` | Det gick inte att skicka din feedback just nu. Försök igen. | We could not send your feedback just now. Please try again. |

### `endingCeremony`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 13796, module 88374 (exports: StoryReader). Shown after the last page.

| Key | Svenska | English |
|---|---|---|
| `carries` | Vad {name} bär med sig | What {name} carries forward |
| `finished` | Läst ända till slutet. Den här boken bor nu i {name}s värld. | Read to the end. This book now lives in {name}'s world. |
| `emberHeading` | Nästa gång, kanske... | Next time, maybe... |
| `nextAdventure` | Nästa äventyr | Next adventure |
| `toBookshelf` | Till bokhyllan | To the bookshelf |
| `readAgain` | Läs igen | Read again |
| `createHero` | Skapa er egen hjälte | Create your own hero |
| `howItWorks` | Så funkar det | How it works |

### `theEnd`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 16138, module 88374 (exports: StoryReader).

| Key | Svenska | English |
|---|---|---|
| `theEnd` | Slut | The End |

### `adventureVote`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 16678, module 88374 (exports: StoryReader). Short variant of the grown-up question.

| Key | Svenska | English |
|---|---|---|
| `grownUp` | Till dig som vuxen | For grown-ups |
| `question` | Skulle er familj välja ett nytt äventyr som det här? | Would your family choose another adventure like this? |
| `yes` | Ja | Yes |
| `yesRetry` | Ja, försök igen | Yes, try again |
| `notYet` | Inte än | Not yet |
| `notYetRetry` | Inte än, försök igen | Not yet, try again |
| `sending` | Skickar... | Sending... |
| `thanks` | Tack för att du berättade. | Thank you for telling us. |
| `error` | Det gick inte att skicka ditt svar just nu. Försök igen. | We could not send your answer just now. Please try again. |

### `readerNav`

Source: [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) offset 20709, module 88374 (exports: StoryReader). Page navigation and page-level waiting/failure states.

| Key | Svenska | English |
|---|---|---|
| `next` | Nästa sida | Next page |
| `restartStory` | Börja om sagan | Replay from the start |
| `viewIllustration` | Visa bara bilden | View illustration |
| `backToStory` | Tillbaka till sagan | Back to story |
| `pictureAlt` | Sagans illustration | Story illustration |
| `loadError` | Sidan gick inte att nå. Försök igen. | That page could not be reached. Please try again. |
| `restartError` | Sagan kunde inte startas om. Försök igen. | We could not restart the story. Please try again. |
| `linkWait` | Nästa sida målas fortfarande. | The next page is still being drawn. |
| `pageWaiting` | Den här sidan målas fortfarande. | This page is still being made. |
| `pageMediaComing` | Bilden och rösten är på väg. | The picture and the voice are still coming. |
| `pageMediaMissing` | Den här sidan har sina ord, men bilden eller rösten kom inte fram. | This page kept its words, but its picture or its voice did not arrive. |
| `pageFailedLead` | Den här sidan blev inte klar. | This page did not come together. |
| `pageFailedHint` | Resten av boken är kvar. | The rest of the book is safe. |
| `toBookshelf` | Tillbaka till bokhyllan | Back to the bookshelf |


## 9. Ambient sound beds

Ambient beds. Key in JSON: `areas.audio`.

### `AMBIENT_BEDS`

Source: [1pgfdvt65g9p-.js](../source/js/1pgfdvt65g9p-.js) offset 36417, module 77147 (exports: AMBIENT_BEDS, bedUrl, isBedId, clampBedVol, DEFAULT_BED_VOLUME, DEFAULT_WAIT_BED, MAX_BED_VOLUME, claimBed, readBedPref, readBedVol, syncBed, writeBedPref, writeBedVol). Background-sound beds (files: assets/audio/atmosphere/v1/<id>.mp3).

| Key | Svenska | English |
|---|---|---|
| `0.label` | Brasa | Fireplace |
| `1.label` | Fönsterregn | Window rain |
| `2.label` | Sagoskogen | Enchanted forest |
| `3.label` | Speldosa | Music box |
| `4.label` | Månharpa | Moonlit harp |
| `5.label` | Glödljus | Ember glow |

Non-language fields: `0.id` = hearth; `0.group` = ambience; `1.id` = rain; `1.group` = ambience; `2.id` = forest; `2.group` = ambience; `3.id` = musicbox; `3.group` = music; `4.id` = harp; `4.group` = music; `5.id` = fire; `5.group` = music


## 10. Login, signup, recovery

Login, signup, password recovery, auth errors. Key in JSON: `areas.auth`.

### `authForms`

Source: [1hcx0qn-qjgfn.js](../source/js/1hcx0qn-qjgfn.js) offset 275, module 33256 (exports: AuthForm). AuthForm: /login and /signup headings, subtitles, foot links.

| Key | Svenska | English |
|---|---|---|
| `login.heading` | Logga in | Log in |
| `login.subtitle` | Välkommen tillbaka. | Welcome back. |
| `login.submit` | Logga in | Log in |
| `login.submitting` | Loggar in... | Logging in... |
| `login.footPrompt` | Har du inget konto? | No account yet? |
| `login.footLink` | Skapa ett | Create one |
| `login.footHref` | /signup | /signup |
| `signup.heading` | Skapa konto | Create account |
| `signup.subtitle` | Personliga sagoböcker där ert barn är hjälten, med bilder och uppläsning. Ett konto för hela familjen; sen bygger ni ert barns hjälte och den första boken. | Personalized picture books where your child is the hero, with art and narration. One account for the whole family; then you build your child's hero and their first book. |
| `signup.submit` | Skapa konto | Create account |
| `signup.submitting` | Skapar konto... | Creating account... |
| `signup.footPrompt` | Har du redan ett konto? | Already have an account? |
| `signup.footLink` | Logga in | Log in |
| `signup.footHref` | /login | /login |

### `authFields`

Source: [1hcx0qn-qjgfn.js](../source/js/1hcx0qn-qjgfn.js) offset 1296, module 33256 (exports: AuthForm). AuthForm: shared field labels, recovery form, attestation, errors.

| Key | Svenska | English |
|---|---|---|
| `googleButton` | Fortsätt med Google | Continue with Google |
| `or` | eller | or |
| `emailLabel` | E-post | Email |
| `passwordLabel` | Lösenord | Password |
| `emailPlaceholder` | du@exempel.se | you@example.com |
| `passwordPlaceholder` | Ditt lösenord | Your password |
| `showPassword` | Visa lösenord | Show password |
| `hidePassword` | Dölj lösenord | Hide password |
| `forgotPassword` | Glömt lösenordet? | Forgot password? |
| `recoveryHeading` | Återställ lösenordet | Reset your password |
| `recoverySubtitle` | Ange e-postadressen till ditt konto så skickar vi en säker återställningslänk. | Enter the email address for your account and we will send a secure reset link. |
| `recoverySubmit` | Skicka återställningslänk | Send reset link |
| `recoverySubmitting` | Skickar... | Sending... |
| `recoveryBack` | Tillbaka till inloggning | Back to login |
| `recoveryNotice` | Om adressen hör till ett konto kommer ett mejl med en återställningslänk. | If the address belongs to an account, an email with a reset link will arrive shortly. |
| `recoveryError` | Det gick inte att starta återställningen. Försök igen om en stund. | We could not start the reset. Please try again in a moment. |
| `invalidEmailError` | Ange en giltig e-postadress. | Enter a valid email address. |
| `attestPrefix` | Jag är barnets förälder eller vårdnadshavare och godkänner | I am the child's parent or guardian and I accept |
| `policyLinkText` | integritetspolicyn | the privacy notice |
| `policyReadLink` | Läs integritetspolicyn | Read the privacy notice |
| `confirmNotice` | Kolla din e-post för att bekräfta kontot. | Check your email to confirm your account. |
| `genericError` | Något gick fel. Försök igen. | Something went wrong. Please try again. |
| `googleError` | Kunde inte starta Google-inloggning. | Could not start Google sign in. |
| `attestRequiredError` | Du behöver godkänna integritetspolicyn för att skapa ett konto. | You need to accept the privacy notice to create an account. |

### `authErrors`

Source: [1hcx0qn-qjgfn.js](../source/js/1hcx0qn-qjgfn.js) offset 13134, module 57128 (exports: localizeAuthError). Also bundled in [2x2s34sgoij7z.js](../source/js/2x2s34sgoij7z.js) @141. localizeAuthError: Supabase error code -> message. Same module (57128) is bundled in two chunks.

| Key | Svenska | English |
|---|---|---|
| `invalid_credentials` | Fel e-postadress eller lösenord. | Wrong email address or password. |
| `email_not_confirmed` | Bekräfta din e-postadress först. Kolla inkorgen efter vårt mejl. | Please confirm your email address first. Check your inbox for our email. |
| `user_already_exists` | Det finns redan ett konto med den här e-postadressen. Logga in istället. | An account with this email already exists. Log in instead. |
| `email_exists` | Det finns redan ett konto med den här e-postadressen. Logga in istället. | An account with this email already exists. Log in instead. |
| `weak_password` | Lösenordet är för svagt. Använd minst 8 tecken. | That password is too weak. Use at least 8 characters. |
| `same_password` | Det nya lösenordet måste skilja sig från det gamla. | The new password needs to be different from the old one. |
| `email_address_invalid` | Ange en giltig e-postadress. | Enter a valid email address. |
| `over_request_rate_limit` | För många försök just nu. Vänta en liten stund och försök igen. | Too many attempts right now. Wait a moment and try again. |
| `over_email_send_rate_limit` | För många mejl har skickats. Vänta en liten stund och försök igen. | Too many emails have been sent. Wait a moment and try again. |
| `signup_disabled` | Det går inte att skapa nya konton just nu. Försök igen senare. | New accounts cannot be created right now. Please try again later. |
| `user_banned` | Det här kontot är tillfälligt avstängt. Kontakta oss om du tror att det är fel. | This account is temporarily suspended. Contact us if you think this is a mistake. |
| `request_timeout` | Anslutningen tog för lång tid. Försök igen. | The connection timed out. Please try again. |


## 11. Input moderation

Client-side input moderation messages. Key in JSON: `areas.moderation`.

### `moderationMessages`

Source: [2x2s34sgoij7z.js](../source/js/2x2s34sgoij7z.js) offset 6764, module 40070 (exports: moderateInput). moderateInput: client-side input filter on names and descriptions.

| Key | Svenska | English |
|---|---|---|
| `injection` | Vi håller sagorna snälla och trygga. Skriv gärna med vanlig text. | Let's keep our stories kind and safe! Please use only plain text. |
| `blockedWord` | Vi håller sagorna snälla och trygga. Prova gärna andra ord. | Let's keep our stories kind and safe! Please try different words. |
| `email` | Vi håller sagorna snälla och trygga. Ta inte med e-postadresser. | Let's keep our stories kind and safe! Please don't include email addresses. |
| `phone` | Vi håller sagorna snälla och trygga. Ta inte med telefonnummer. | Let's keep our stories kind and safe! Please don't include phone numbers. |
| `address` | Vi håller sagorna snälla och trygga. Ta inte med adresser. | Let's keep our stories kind and safe! Please don't include addresses. |
| `personnummer` | Vi håller sagorna snälla och trygga. Ta inte med personnummer. | Let's keep our stories kind and safe! Please don't include personal ID numbers. |


## 12. Upgrade / pricing

Pricing / upgrade panel. Key in JSON: `areas.upgrade`.

### `upgradePanel`

Source: [26ye0kuppitcn.js](../source/js/26ye0kuppitcn.js) offset 15867, module 2739 (exports: UpgradePanel). UpgradePanel on /uppgradera. {price} is formatted by locale.

| Key | Svenska | English |
|---|---|---|
| `heading` | Uppgradera | Upgrade |
| `introBody` | Nya personliga böcker varje månad, i en värld som minns. Ingen bindningstid, avsluta när du vill. | New personalized books every month, in a world that remembers. No lock-in, cancel anytime. |
| `includedHeading` | Det här ingår | What is included |
| `proofIllustratedBooks` | Personliga, illustrerade sagoböcker | Personalized illustrated storybooks |
| `proofNarration` | Uppläsning till varje berättelse | Narration for every story |
| `proofChoices` | Meningsfulla val som formar berättelsen | Meaningful choices that shape the story |
| `proofChildren` | Plats för upp till 4 barn med Familj och 30 i Skola | Space for up to 4 children with Family and 30 with School |
| `proofCancel` | Avsluta när du vill | Cancel anytime |
| `sampleLabel` | Exempelbok | Sample book |
| `sampleLink` | Öppna exempelboken | Open the sample book |
| `sampleCaption` | Exempelbok: Iris och den sparade platsen | Sample book: Iris och den sparade platsen |
| `sampleCoverAlt` | Omslag till exempelboken Iris och den sparade platsen | Cover of the Swedish sample book Iris och den sparade platsen |
| `schools` | För skolor | For schools |
| `monthly` | Månadsvis | Monthly |
| `yearly` | Årsvis | Yearly |
| `perMonth` | {price} per månad | {price} per month |
| `perYear` | {price} per år | {price} per year |
| `perMonthBilledYearly` | {price} per månad vid årsbetalning | {price} per month billed yearly |
| `familyName` | Familj | Family |
| `familyBody` | För familjen som vill fortsätta berätta tillsammans. | For the family that wants to keep telling stories together. |
| `familyTrialLine` | 14 dagar gratis, avsluta när du vill. Kort krävs. | 14 days free, cancel anytime. Card required. |
| `familyCta` | Prova gratis i 14 dagar | Try free for 14 days |
| `schoolName` | Skola | School |
| `schoolBody` | För klassrummet. Samma sagovärld, med plats för hela klassen. | For the classroom. The same story world, with room for the whole class. |
| `schoolLine` | Ingen bindningstid, avsluta när du vill. | No lock-in, cancel anytime. |
| `schoolCta` | Uppgradera till Skola | Upgrade to School |
| `featStories` | 3 nya böcker varje månad, oanvända följer med | 3 new books every month, unused roll over |
| `featChildrenFamily` | Upp till 4 barn | Up to 4 children |
| `featChildrenSchool` | Upp till 30 barn | Up to 30 children |
| `featStoriesSchool` | 6 nya böcker varje månad, oanvända följer med | 6 new books every month, unused roll over |
| `currentPlan` | Din nuvarande plan | Your current plan |
| `includedPlan` | Ingår i er plan | Included in your plan |
| `checkoutError` | Kunde inte öppna kassan. Försök igen. | Could not open checkout. Please try again. |

### `currencyByLocale`

Source: [26ye0kuppitcn.js](../source/js/26ye0kuppitcn.js) offset 22545, module 2739 (exports: UpgradePanel). Currency picked from UI language.

| Key | Svenska | English |
|---|---|---|
| `(string)` | SEK | USD |


## 13. Language helpers

Language helpers. Key in JSON: `areas.helpers`.

### `genitive`

Source: [2x2s34sgoij7z.js](../source/js/2x2s34sgoij7z.js) offset 5336, module 35768 (exports: genitive). Also bundled in [36tbz-w9v-p8v.js](../source/js/36tbz-w9v-p8v.js) @29945. Swedish genitive adds -s unless the name already ends in s/x/z; English adds 's.

| Key | Svenska | English |
|---|---|---|
| `(string)` | `/[sxz]$/i.test(e)?e:ˋ${e}sˋ` (code) | ${e}'s |

