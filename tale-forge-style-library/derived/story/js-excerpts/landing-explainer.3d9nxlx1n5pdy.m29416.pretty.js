// EXCERPT (data, not for execution). Verbatim Turbopack module 29416 from source/js/3d9nxlx1n5pdy.js,
// characters 620-20891 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: ExplainerChapter: six how-it-works steps, endings-map geometry and copy

(29416,
  (e) => {
    "use strict";
    var a = e.i(43476),
      n = e.i(71645),
      s = e.i(88065);
    let r = e.i(19359).default.beats.find((e) => "S2" === e.beatId),
      t = r?.choice?.options.map((e) => e.label) ?? [],
      i = (r?.prose ?? "")
        .split(/(?<=\.)\s+/)
        .slice(0, 2)
        .join(" "),
      l = "/share/iris-sparade-platsen",
      o = {
        sv: {
          kicker: "Så fungerar det",
          headline: "Äventyr värda att prata om.",
          lede: "Från ett foto till en uppläst bilderbok med fyra olika slut. Så här går en kväll till.",
          steps: {
            hero: {
              title: "Bygg er hjälte",
              body: "Ladda upp en bild och välj det som gör ert barn till ert barn. Vi målar hjälten i bokens stil, och samma ansikte återkommer i varje scen.",
              micro: "Porträttet styr både bilderna och berättelsen.",
              artChip: "Skapad med AI",
              portraitAlt: "Iris, den målade hjälten i exempelboken",
            },
            friend: {
              title: "Ta med en vän",
              body: "En bästa kompis, en kusin eller ett husdjur. Vänner från er vardag kliver in i boken och stannar kvar som en del av världen.",
              micro: "I Alvas värld är Noah och räven Sixten med i varje bok.",
              rows: [
                { name: "Noah", sub: "bästa kompisen · med i 2 böcker" },
                { name: "Sixten", sub: "fjällräven · följer med i varje bok" },
              ],
            },
            adventure: {
              title: "Välj kvällens äventyr",
              body: "Välj tema och känsla. Sedan skriver, målar och läser vi in hela boken på en gång. Det tar ungefär tio minuter, och det säger vi hellre ärligt än låtsas att det går på en sekund.",
              micro: "Lagom tid för tandborstning och pyjamas.",
              bakeLine: "Boken bakas. Ungefär tio minuter kvar.",
            },
            read: {
              title: "Läs och välj",
              body: "Berättarrösten läser högt, sida för sida. Två gånger i varje bok stannar berättelsen: ert barn väljer, och valet ändrar det som händer sedan. På riktigt.",
              micro:
                "Inga låtsasval. Båda vägarna är skrivna, målade och inlästa.",
              playLabel: "Hör berättarrösten",
              playingLabel: "Spelar...",
              voiceChip: "Morfar",
              sceneAlt: "Uppslag ur exempelboken, sidan före det första valet",
              audioSrc: "/landing/voice/grandpa-sample.mp3",
              choiceLabels: t,
              prose: i,
            },
            endings: {
              title: "Fyra olika slut",
              body: "Två val ger fyra vägar genom samma bok. Er kväll kan sluta på ett sätt, och samma bok kan sluta helt annorlunda hemma hos en annan familj. Läs igen, välj annorlunda och hitta en väg ni inte har sett.",
              caption:
                "Kartan över exempelboken Iris och den sparade platsen. Varje prick är en sida, varje guldstjärna ett val, varje medaljong ett slut. Alla fyra finns på riktigt.",
              sampleCta: { label: "Läs exempelboken", href: l },
            },
            memory: {
              title: "Världen minns",
              body: "Nästa bok vet vem hjälten är, vilka vänner som var med och vilka platser ni har varit på. Ni fyller inte en hylla med lösa sagor. Ni bygger en värld.",
              micro:
                "Hjältar, vänner och platser följer med från bok till bok.",
              memoryTag: "Sixten minns tornet",
              memoryTagSub: 'från "Alva och fyraljuset"',
              nextBookLabel: "nästa bok",
            },
          },
          closing: {
            primary: { label: "Skapa er hjälte", href: "/start" },
            sample: { label: "Läs exempelboken", href: l },
          },
          map: {
            hiddenStructure:
              "Boken börjar likadant för alla. Vid två tillfällen väljer barnet mellan två vägar. Två val ger fyra olika slut.",
            endingButtonLabels: [1, 2, 3, 4].map(
              (e) => `Slut ${e} av 4, visa v\xe4gen dit`,
            ),
            choiceNodeLabels: ["Val 1", "Val 2"],
          },
        },
        en: {
          kicker: "How it works",
          headline: "Adventures worth talking about.",
          lede: "From one photo to a narrated picture book with four different endings. Here is how an evening works.",
          steps: {
            hero: {
              title: "Build your hero",
              body: "Upload a photo and pick what makes your child your child. We paint the hero in the book's style, and the same face returns in every scene.",
              micro: "The portrait shapes both the pictures and the story.",
              artChip: "Created with AI",
              portraitAlt: "Iris, the painted hero of the sample book",
            },
            friend: {
              title: "Bring a friend",
              body: "A best friend, a cousin, or a pet. Friends from your everyday life step into the book and stay on as part of its world.",
              micro:
                "In Alva's world, Noah and Sixten the fox are in every book.",
              rows: [
                { name: "Noah", sub: "best friend · in 2 books" },
                {
                  name: "Sixten",
                  sub: "the mountain fox · comes along in every book",
                },
              ],
            },
            adventure: {
              title: "Pick tonight's adventure",
              body: "Pick tonight's theme and mood. Then we write, paint, and narrate the whole book in one go. It takes about ten minutes, and we would rather say that honestly than pretend it takes a second.",
              micro: "Just enough time for toothbrushing and pajamas.",
              bakeLine: "The book is baking. About ten minutes to go.",
            },
            read: {
              title: "Read and choose",
              body: "The narrator reads aloud, page by page. Twice in every book the story stops: your child chooses, and the choice changes what happens next. For real.",
              micro:
                "No pretend choices. Both paths are written, painted, and narrated.",
              playLabel: "Hear the narrator",
              playingLabel: "Playing...",
              voiceChip: "Grandpa Erik",
              sceneAlt:
                "A spread from the sample book, the page before the first choice",
              audioSrc: "/landing/voice/grandpa-sample-en.mp3",
              choiceLabels: [
                "Go with Mossa to the green rug.",
                "Stay and draw with the new child in the window light.",
              ],
              prose:
                "Iris stepped between the windowsill and the rug and placed the drawing paper on a low table. The plan for the saved place no longer applied.",
            },
            endings: {
              title: "Four different endings",
              body: "Two choices make four paths through the same book. Your evening can end one way, and the same book can end differently in another family's home. Read it again, choose differently, and find a path you have not seen.",
              caption:
                "The map of the sample book Iris and the Saved Place. Every dot is a page, every gold star a choice, every medallion an ending. All four really exist.",
              sampleCta: { label: "Read the sample book", href: l },
            },
            memory: {
              title: "The world remembers",
              body: "The next book knows who the hero is, which friends came along, and the places you have been. You are not filling a shelf with loose stories. You are building a world.",
              micro:
                "Heroes, friends, and places carry over from book to book.",
              memoryTag: "Sixten remembers the tower",
              memoryTagSub: 'from "Alva and the Fourth Candle"',
              nextBookLabel: "next book",
            },
          },
          closing: {
            primary: { label: "Create your hero", href: "/start" },
            sample: { label: "Read the sample book", href: l },
          },
          map: {
            hiddenStructure:
              "The book starts the same for everyone. At two points the child chooses between two paths. Two choices make four different endings.",
            endingButtonLabels: [1, 2, 3, 4].map(
              (e) => `Ending ${e} of 4, show the path there`,
            ),
            choiceNodeLabels: ["Choice 1", "Choice 2"],
          },
        },
      },
      d = [
        "/landing/cards/pick-1.webp",
        "/landing/cards/pick-2.webp",
        "/landing/cards/pick-3.webp",
      ],
      h = ["/assets/avatar-noah.jpg", "/assets/avatar-sixten.jpg"];
    var m = e.i(46907);
    let c = ["AA", "AB", "BA", "BB"],
      p = {
        AA: "/landing/iris/ending-1.webp",
        AB: "/landing/iris/ending-2.webp",
        BA: "/landing/iris/ending-3.webp",
        BB: "/landing/iris/ending-4.webp",
      },
      g = {
        viewBox: "0 0 960 540",
        gradAxis: "h",
        cover: { x: 50, y: 236, w: 52, h: 68, rx: 8 },
        dotR: 6,
        haloR: 11,
        dots: [
          [168, 270],
          [236, 270],
          [420, 138],
          [500, 138],
          [420, 402],
          [500, 402],
          [676, 72],
          [676, 204],
          [676, 336],
          [676, 468],
        ],
        diamondHalf: 13,
        diamondRx: 6,
        diamonds: [
          [312, 270],
          [576, 138],
          [576, 402],
        ],
        diamondLabels: [
          [0, 312, 308],
          [1, 576, 176],
          [1, 576, 440],
        ],
        basePaths: [
          "M 76 270 L 312 270",
          "M 312 270 C 355.2 270 376.8 138 420 138",
          "M 420 138 L 576 138",
          "M 312 270 C 355.2 270 376.8 402 420 402",
          "M 420 402 L 576 402",
          "M 576 138 C 616 138 636 72 676 72",
          "M 576 138 C 616 138 636 204 676 204",
          "M 576 402 C 616 402 636 336 676 336",
          "M 576 402 C 616 402 636 468 676 468",
          "M 676 72 L 856 72",
          "M 676 204 L 856 204",
          "M 676 336 L 856 336",
          "M 676 468 L 856 468",
        ],
        litPaths: {
          AA: "M 76 270 L 312 270 C 355.2 270 376.8 138 420 138 L 576 138 C 616 138 636 72 676 72 L 856 72",
          AB: "M 76 270 L 312 270 C 355.2 270 376.8 138 420 138 L 576 138 C 616 138 636 204 676 204 L 856 204",
          BA: "M 76 270 L 312 270 C 355.2 270 376.8 402 420 402 L 576 402 C 616 402 636 336 676 336 L 856 336",
          BB: "M 76 270 L 312 270 C 355.2 270 376.8 402 420 402 L 576 402 C 616 402 636 468 676 468 L 856 468",
        },
        medallions: [
          [856, 72],
          [856, 204],
          [856, 336],
          [856, 468],
        ],
        medallionImageR: 42,
        medallionRingR: 44,
        numChipY: (e) => e + 50,
      },
      u = {
        viewBox: "0 0 360 620",
        gradAxis: "v",
        cover: { x: 160, y: 20, w: 40, h: 52, rx: 8 },
        dotR: 5,
        haloR: 9,
        dots: [
          [180, 108],
          [180, 150],
          [104, 252],
          [104, 296],
          [256, 252],
          [256, 296],
          [52, 404],
          [137, 404],
          [223, 404],
          [308, 404],
        ],
        diamondHalf: 11,
        diamondRx: 5,
        diamonds: [
          [180, 196],
          [104, 342],
          [256, 342],
        ],
        diamondLabels: null,
        basePaths: [
          "M 180 46 L 180 196",
          "M 180 196 C 180 218.4 104 229.6 104 252",
          "M 104 252 L 104 342",
          "M 180 196 C 180 218.4 256 229.6 256 252",
          "M 256 252 L 256 342",
          "M 104 342 C 104 366.8 52 379.2 52 404",
          "M 104 342 C 104 366.8 137 379.2 137 404",
          "M 256 342 C 256 366.8 223 379.2 223 404",
          "M 256 342 C 256 366.8 308 379.2 308 404",
          "M 52 404 L 52 480",
          "M 137 404 L 137 480",
          "M 223 404 L 223 480",
          "M 308 404 L 308 480",
        ],
        litPaths: {
          AA: "M 180 46 L 180 196 C 180 218.4 104 229.6 104 252 L 104 342 C 104 366.8 52 379.2 52 404 L 52 480",
          AB: "M 180 46 L 180 196 C 180 218.4 104 229.6 104 252 L 104 342 C 104 366.8 137 379.2 137 404 L 137 480",
          BA: "M 180 46 L 180 196 C 180 218.4 256 229.6 256 252 L 256 342 C 256 366.8 223 379.2 223 404 L 223 480",
          BB: "M 180 46 L 180 196 C 180 218.4 256 229.6 256 252 L 256 342 C 256 366.8 308 379.2 308 404 L 308 480",
        },
        medallions: [
          [52, 480],
          [137, 480],
          [223, 480],
          [308, 480],
        ],
        medallionImageR: 32,
        medallionRingR: 34,
        numChipY: () => 519,
      };
    function b({
      geom: e,
      idPrefix: n,
      className: s,
      lit: r,
      drawn: t,
      fading: i,
      engaged: l,
      choiceNodeLabels: o,
    }) {
      let d = "h" === e.gradAxis ? { x2: "1", y2: "0" } : { x2: "0", y2: "1" };
      return (0, a.jsxs)("svg", {
        className: s,
        viewBox: e.viewBox,
        width: "100%",
        "aria-hidden": "true",
        focusable: "false",
        children: [
          (0, a.jsxs)("defs", {
            children: [
              (0, a.jsxs)("linearGradient", {
                id: `${n}-path`,
                x1: "0",
                y1: "0",
                x2: d.x2,
                y2: d.y2,
                children: [
                  (0, a.jsx)("stop", { offset: "0", stopColor: "#f5c542" }),
                  (0, a.jsx)("stop", { offset: "1", stopColor: "#9b87f5" }),
                ],
              }),
              (0, a.jsxs)("linearGradient", {
                id: `${n}-ring`,
                x1: "0",
                y1: "0",
                x2: "1",
                y2: "1",
                children: [
                  (0, a.jsx)("stop", { offset: "0", stopColor: "#f5c542" }),
                  (0, a.jsx)("stop", { offset: "1", stopColor: "#6D4FE0" }),
                ],
              }),
              (0, a.jsx)("clipPath", {
                id: `${n}-cover`,
                children: (0, a.jsx)("rect", {
                  x: e.cover.x,
                  y: e.cover.y,
                  width: e.cover.w,
                  height: e.cover.h,
                  rx: e.cover.rx,
                }),
              }),
              e.medallions.map(([s, r], t) =>
                (0, a.jsx)(
                  "clipPath",
                  {
                    id: `${n}-m${t}`,
                    children: (0, a.jsx)("circle", {
                      cx: s,
                      cy: r,
                      r: e.medallionImageR,
                    }),
                  },
                  c[t],
                ),
              ),
            ],
          }),
          e.basePaths.map((e) =>
            (0, a.jsx)("path", { className: "map-path", d: e }, e),
          ),
          c.map((s) => {
            let l = t && r === s ? "lit" : i === s ? "fading" : "off";
            return (0, a.jsx)(
              "path",
              {
                className: `map-path-lit map-path-lit--${l}`,
                d: e.litPaths[s],
                pathLength: 1,
                strokeDasharray: "1",
                strokeDashoffset: +("off" === l),
                stroke: `url(#${n}-path)`,
                opacity: 0.9 * ("lit" === l),
                fill: "none",
              },
              s,
            );
          }),
          (0, a.jsxs)("g", {
            className: "map-cover",
            children: [
              (0, a.jsx)("image", {
                href: "/landing/iris/cover-thumb.webp",
                x: e.cover.x,
                y: e.cover.y,
                width: e.cover.w,
                height: e.cover.h,
                clipPath: `url(#${n}-cover)`,
                preserveAspectRatio: "xMidYMid slice",
              }),
              (0, a.jsx)("rect", {
                x: e.cover.x,
                y: e.cover.y,
                width: e.cover.w,
                height: e.cover.h,
                rx: e.cover.rx,
                fill: "none",
                stroke: "var(--card-line)",
              }),
            ],
          }),
          e.dots.map(([n, s]) =>
            (0, a.jsxs)(
              "g",
              {
                children: [
                  (0, a.jsx)("circle", {
                    className: "map-dot-halo",
                    cx: n,
                    cy: s,
                    r: e.haloR,
                  }),
                  (0, a.jsx)("circle", {
                    className: "map-dot",
                    cx: n,
                    cy: s,
                    r: e.dotR,
                  }),
                ],
              },
              `${n}-${s}`,
            ),
          ),
          e.diamonds.map(([n, s]) =>
            (0, a.jsxs)(
              "g",
              {
                transform: `translate(${n} ${s})`,
                children: [
                  (0, a.jsx)("rect", {
                    className: "map-choice",
                    x: -e.diamondHalf,
                    y: -e.diamondHalf,
                    width: 2 * e.diamondHalf,
                    height: 2 * e.diamondHalf,
                    rx: e.diamondRx,
                    transform: "rotate(45)",
                  }),
                  (0, a.jsx)("path", {
                    className: "map-choice-glyph",
                    d: "M -5 -2 L 0 -7 L 5 -2 M -5 2 L 0 7 L 5 2",
                    fill: "none",
                  }),
                ],
              },
              `${n}-${s}`,
            ),
          ),
          e.diamondLabels?.map(([e, n, s]) =>
            (0, a.jsx)(
              "text",
              {
                className: "map-choice-label",
                x: n,
                y: s,
                textAnchor: "middle",
                children: o[e],
              },
              `${n}-${s}`,
            ),
          ),
          e.medallions.map(([s, i], o) => {
            let d = c[o],
              h = t && r === d,
              m = l && r !== d;
            return (0, a.jsxs)(
              "g",
              {
                className: `map-medallion${h ? " is-active" : ""}${m ? " is-dimmed" : ""}`,
                children: [
                  (0, a.jsx)("image", {
                    href: p[d],
                    x: s - e.medallionImageR,
                    y: i - e.medallionImageR,
                    width: 2 * e.medallionImageR,
                    height: 2 * e.medallionImageR,
                    clipPath: `url(#${n}-m${o})`,
                    preserveAspectRatio: "xMidYMid slice",
                  }),
                  (0, a.jsx)("circle", {
                    className: "map-medallion-ring",
                    cx: s,
                    cy: i,
                    r: e.medallionRingR,
                    fill: "none",
                    stroke: `url(#${n}-ring)`,
                  }),
                  (0, a.jsx)("rect", {
                    className: "map-num-bg",
                    x: s - 11,
                    y: e.numChipY(i),
                    width: 22,
                    height: 18,
                    rx: 9,
                  }),
                  (0, a.jsx)("text", {
                    className: "map-num",
                    x: s,
                    y: e.numChipY(i) + 13,
                    textAnchor: "middle",
                    children: o + 1,
                  }),
                ],
              },
              d,
            );
          }),
        ],
      });
    }
    function k({
      hiddenStructure: e,
      endingButtonLabels: s,
      choiceNodeLabels: r,
    }) {
      let [t, i] = (0, n.useState)("AA"),
        [l, o] = (0, n.useState)(!0),
        [d, h] = (0, n.useState)(null),
        [m, p] = (0, n.useState)(!1),
        v = (0, n.useRef)(null),
        f = (0, n.useRef)("AA"),
        y = (0, n.useRef)(!1),
        w = (0, n.useRef)(!1),
        j = (0, n.useRef)(null),
        x = (0, n.useRef)(null),
        A = (0, n.useRef)(null),
        S = (0, n.useRef)(null),
        B = (e) => {
          if (f.current !== e) {
            let a = f.current;
            ((f.current = e),
              h(a),
              A.current && clearTimeout(A.current),
              (A.current = setTimeout(() => h(null), 300)));
          }
          (i(e), o(!0));
        },
        I = () => {
          j.current && (clearInterval(j.current), (j.current = null));
        },
        M = () => {
          y.current ||
            j.current ||
            (j.current = setInterval(() => {
              w.current || B(c[(c.indexOf(f.current) + 1) % c.length]);
            }, 4500));
        },
        L = (e) => {
          ((w.current = !0),
            p(!0),
            I(),
            x.current && clearTimeout(x.current),
            B(e));
        },
        N = () => {
          if ((x.current && clearTimeout(x.current), y.current)) {
            ((w.current = !1), p(!1));
            return;
          }
          x.current = setTimeout(() => {
            ((w.current = !1), p(!1), M());
          }, 6e3);
        };
      return (
        (0, n.useEffect)(() => {
          if (
            ((y.current =
              "function" == typeof window.matchMedia &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches),
            y.current || "u" < typeof IntersectionObserver)
          )
            return;
          let e = v.current;
          if (!e) return;
          o(!1);
          let a = new IntersectionObserver(
            (e) => {
              e.some((e) => e.isIntersecting) &&
                (a.disconnect(),
                (S.current = setTimeout(() => {
                  (B("AA"), M());
                }, 600)));
            },
            { threshold: 0.4 },
          );
          return (
            a.observe(e),
            () => {
              (a.disconnect(),
                I(),
                x.current && clearTimeout(x.current),
                A.current && clearTimeout(A.current),
                S.current && clearTimeout(S.current));
            }
          );
        }, []),
        (0, a.jsxs)("div", {
          className: "hiw-map glass hiw-card",
          children: [
            (0, a.jsx)("p", { className: "hiw-visually-hidden", children: e }),
            (0, a.jsxs)("div", {
              className: "hiw-map-stage",
              ref: v,
              children: [
                (0, a.jsx)(b, {
                  geom: g,
                  idPrefix: "hiwD",
                  className: "hiw-map-desktop",
                  lit: t,
                  drawn: l,
                  fading: d,
                  engaged: m,
                  choiceNodeLabels: r,
                }),
                (0, a.jsx)(b, {
                  geom: u,
                  idPrefix: "hiwM",
                  className: "hiw-map-mobile",
                  lit: t,
                  drawn: l,
                  fading: d,
                  engaged: m,
                  choiceNodeLabels: r,
                }),
                c.map((e, n) =>
                  (0, a.jsx)(
                    "button",
                    {
                      type: "button",
                      className: `hiw-map-btn hiw-map-btn-${n + 1}`,
                      "aria-label": s[n],
                      "aria-pressed": t === e,
                      onClick: () => L(e),
                      onMouseEnter: () => L(e),
                      onFocus: () => L(e),
                      onMouseLeave: N,
                      onBlur: N,
                    },
                    e,
                  ),
                ),
              ],
            }),
          ],
        })
      );
    }
    function v() {
      return (0, a.jsx)("svg", {
        className: "hiw-star",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        focusable: "false",
        children: (0, a.jsx)("path", {
          d: "M12 2c.7 5.6 4.4 9.3 10 10-5.6.7-9.3 4.4-10 10-.7-5.6-4.4-9.3-10-10 5.6-.7 9.3-4.4 10-10z",
        }),
      });
    }
    function f({ copy: e, surface: r, lang: t }) {
      let i = (0, n.useRef)(null),
        [l, o] = (0, n.useState)(!1);
      return (0, a.jsxs)("div", {
        className: "hiw-playrow",
        children: [
          (0, a.jsxs)("button", {
            type: "button",
            className: "hiw-play",
            onClick: () => {
              let e = i.current;
              if (e) {
                if (l) {
                  try {
                    e.pause();
                  } catch {}
                  o(!1);
                  return;
                }
                ((0, s.track)("cta_clicked", {
                  cta: "hear_voice",
                  surface: r,
                  lang: t,
                }),
                  o(!0));
                try {
                  let a = e.play();
                  a && "function" == typeof a.catch && a.catch(() => o(!1));
                } catch {
                  o(!1);
                }
              }
            },
            "aria-pressed": l,
            children: [
              l
                ? (0, a.jsx)("svg", {
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    "aria-hidden": "true",
                    focusable: "false",
                    children: (0, a.jsx)("path", {
                      d: "M7 5h4v14H7zM13 5h4v14h-4z",
                    }),
                  })
                : (0, a.jsx)("svg", {
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    "aria-hidden": "true",
                    focusable: "false",
                    children: (0, a.jsx)("path", { d: "M8 5.5v13l11-6.5z" }),
                  }),
              (0, a.jsx)("span", {
                children: l ? e.playingLabel : e.playLabel,
              }),
            ],
          }),
          (0, a.jsxs)("span", {
            className: "hiw-voice-chip",
            children: [
              (0, a.jsx)("img", {
                src: "/landing/voice/narrator-morfar.webp",
                alt: "",
                loading: "lazy",
              }),
              e.voiceChip,
            ],
          }),
          (0, a.jsx)("audio", {
            ref: i,
            src: e.audioSrc,
            preload: "none",
            onEnded: () => o(!1),
          }),
        ],
      });
    }
    function y({
      n: e,
      flip: n,
      wide: s,
      last: r,
      title: t,
      body: i,
      micro: l,
      visual: o,
    }) {
      let d = [
        "hiw-step",
        n ? "hiw-step--flip" : "",
        s ? "hiw-step--wide" : "",
        r ? "hiw-step--last" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return (0, a.jsxs)("li", {
        className: d,
        children: [
          (0, a.jsx)("div", {
            className: "hiw-rail-col",
            children: (0, a.jsx)("span", {
              className: "hiw-node",
              "aria-hidden": "true",
              children: e,
            }),
          }),
          (0, a.jsxs)("div", {
            className: "hiw-step-body",
            children: [
              (0, a.jsxs)("div", {
                className: "hiw-step-text",
                children: [
                  (0, a.jsx)("h3", { children: t }),
                  (0, a.jsx)("p", { className: "hiw-step-copy", children: i }),
                  l
                    ? (0, a.jsxs)("p", {
                        className: "hiw-micro",
                        children: [(0, a.jsx)(v, {}), l],
                      })
                    : null,
                ],
              }),
              (0, a.jsx)("div", { className: "hiw-step-visual", children: o }),
            ],
          }),
        ],
      });
    }
    e.s(
      [
        "ExplainerChapter",
        0,
        function ({ locale: e, surface: n }) {
          let s = o[e],
            { steps: r } = s;
          return (0, a.jsxs)("section", {
            id: "sa-funkar-det",
            className: "reveal in hiw",
            children: [
              (0, a.jsx)("span", {
                id: "how-it-works",
                className: "hiw-anchor-alias",
                "aria-hidden": "true",
              }),
              (0, a.jsxs)("div", {
                className: "hiw-head",
                children: [
                  (0, a.jsx)("span", {
                    className: "hiw-kicker",
                    children: s.kicker,
                  }),
                  (0, a.jsx)("h2", {
                    className: "hiw-headline",
                    children: s.headline,
                  }),
                  (0, a.jsx)("p", { className: "hiw-lede", children: s.lede }),
                ],
              }),
              (0, a.jsxs)("ol", {
                className: "hiw-steps",
                children: [
                  (0, a.jsx)(y, {
                    n: 1,
                    title: r.hero.title,
                    body: r.hero.body,
                    micro: r.hero.micro,
                    visual: (0, a.jsx)("div", {
                      className: "glass hiw-card hiw-portrait-card",
                      children: (0, a.jsxs)("div", {
                        className: "hiw-frame",
                        children: [
                          (0, a.jsx)("img", {
                            src: "/landing/iris/hero-portrait.webp",
                            alt: r.hero.portraitAlt,
                          }),
                          (0, a.jsx)("span", {
                            className: "hiw-ai-chip",
                            children: r.hero.artChip,
                          }),
                        ],
                      }),
                    }),
                  }),
                  (0, a.jsx)(y, {
                    n: 2,
                    flip: !0,
                    title: r.friend.title,
                    body: r.friend.body,
                    micro: r.friend.micro,
                    visual: (0, a.jsxs)("div", {
                      className: "glass hiw-card hiw-friend-card",
                      children: [
                        r.friend.rows.map((e, n) =>
                          (0, a.jsxs)(
                            "div",
                            {
                              className: "hiw-friend-row",
                              children: [
                                (0, a.jsx)("img", {
                                  src: h[n],
                                  alt: "",
                                  loading: "lazy",
                                }),
                                (0, a.jsxs)("div", {
                                  children: [
                                    (0, a.jsx)("b", { children: e.name }),
                                    (0, a.jsx)("span", { children: e.sub }),
                                  ],
                                }),
                              ],
                            },
                            e.name,
                          ),
                        ),
                        (0, a.jsx)("div", {
                          className: "hiw-invite-slot",
                          "aria-hidden": "true",
                          children: "+",
                        }),
                      ],
                    }),
                  }),
                  (0, a.jsx)(y, {
                    n: 3,
                    title: r.adventure.title,
                    body: r.adventure.body,
                    micro: r.adventure.micro,
                    visual: (0, a.jsxs)("div", {
                      className: "glass hiw-card hiw-adventure-card",
                      children: [
                        (0, a.jsx)("div", {
                          className: "hiw-fan",
                          "aria-hidden": "true",
                          children: d.map((e, n) =>
                            (0, a.jsx)(
                              "img",
                              {
                                className: `hiw-fan-card hiw-fan-${n + 1}`,
                                src: e,
                                alt: "",
                                loading: "lazy",
                              },
                              e,
                            ),
                          ),
                        }),
                        (0, a.jsxs)("div", {
                          className: "hiw-bake",
                          children: [
                            (0, a.jsx)("div", {
                              className: "hiw-bar",
                              "aria-hidden": "true",
                              children: (0, a.jsx)("i", {}),
                            }),
                            (0, a.jsx)("span", {
                              className: "hiw-bake-line",
                              children: r.adventure.bakeLine,
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  (0, a.jsx)(y, {
                    n: 4,
                    flip: !0,
                    title: r.read.title,
                    body: r.read.body,
                    micro: r.read.micro,
                    visual: (0, a.jsxs)("div", {
                      className: "hiw-read-visual",
                      children: [
                        (0, a.jsx)(f, { copy: r.read, surface: n, lang: e }),
                        (0, a.jsxs)("div", {
                          className: "glass hiw-card hiw-reader-mock",
                          children: [
                            (0, a.jsx)("img", {
                              src: "/landing/iris/scene-choice.webp",
                              alt: r.read.sceneAlt,
                              loading: "lazy",
                            }),
                            (0, a.jsx)("p", {
                              className: "hiw-mock-prose",
                              children: r.read.prose,
                            }),
                            (0, a.jsx)("div", {
                              className: "hiw-mock-choices",
                              children: r.read.choiceLabels.map((e) =>
                                (0, a.jsx)(
                                  "span",
                                  { className: "hiw-choice", children: e },
                                  e,
                                ),
                              ),
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  (0, a.jsx)(y, {
                    n: 5,
                    wide: !0,
                    title: r.endings.title,
                    body: r.endings.body,
                    visual: (0, a.jsxs)(a.Fragment, {
                      children: [
                        (0, a.jsx)(k, {
                          hiddenStructure: s.map.hiddenStructure,
                          endingButtonLabels: s.map.endingButtonLabels,
                          choiceNodeLabels: s.map.choiceNodeLabels,
                        }),
                        (0, a.jsx)("p", {
                          className: "hiw-caption",
                          children: r.endings.caption,
                        }),
                        (0, a.jsx)("div", {
                          className: "hiw-map-cta",
                          children: (0, a.jsx)(m.CtaLink, {
                            cta: "sample_book",
                            surface: n,
                            lang: e,
                            href: r.endings.sampleCta.href,
                            className: "btn btn-ghost",
                            children: r.endings.sampleCta.label,
                          }),
                        }),
                      ],
                    }),
                  }),
                  (0, a.jsx)(y, {
                    n: 6,
                    last: !0,
                    title: r.memory.title,
                    body: r.memory.body,
                    micro: r.memory.micro,
                    visual: (0, a.jsx)("div", {
                      className: "glass hiw-card hiw-memory-card",
                      children: (0, a.jsxs)("div", {
                        className: "hiw-bookfan",
                        children: [
                          (0, a.jsx)("img", {
                            className: "hiw-cover hiw-cover-next",
                            src: "/landing/cover-next-book.webp",
                            alt: "",
                            loading: "lazy",
                          }),
                          (0, a.jsx)("img", {
                            className: "hiw-cover hiw-cover-1",
                            src: "/assets/cover-tornet.webp",
                            alt: "",
                            loading: "lazy",
                          }),
                          (0, a.jsx)("img", {
                            className: "hiw-cover hiw-cover-2",
                            src: "/assets/cover-filten.webp",
                            alt: "",
                            loading: "lazy",
                          }),
                          (0, a.jsx)("span", {
                            className: "hiw-next-label",
                            children: r.memory.nextBookLabel,
                          }),
                          (0, a.jsxs)("div", {
                            className: "hiw-memory-tag",
                            children: [
                              (0, a.jsx)("span", { className: "dotpulse" }),
                              (0, a.jsxs)("div", {
                                children: [
                                  (0, a.jsx)("b", {
                                    children: r.memory.memoryTag,
                                  }),
                                  (0, a.jsx)("span", {
                                    children: r.memory.memoryTagSub,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  }),
                ],
              }),
              (0, a.jsxs)("div", {
                className: "hiw-closing",
                children: [
                  (0, a.jsx)(m.CtaLink, {
                    cta: "explainer_primary",
                    surface: n,
                    lang: e,
                    href: s.closing.primary.href,
                    className: "btn btn-primary",
                    children: s.closing.primary.label,
                  }),
                  (0, a.jsx)(m.CtaLink, {
                    cta: "sample_book",
                    surface: n,
                    lang: e,
                    href: s.closing.sample.href,
                    className: "btn btn-ghost",
                    children: s.closing.sample.label,
                  }),
                ],
              }),
            ],
          });
        },
        "NarrationPlayPill",
        0,
        f,
      ],
      29416,
    );
  });
