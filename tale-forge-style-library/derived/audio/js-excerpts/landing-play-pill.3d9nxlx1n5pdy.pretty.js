/* VERBATIM EXCERPT (prettier-formatted) of the minified Turbopack chunk source/js/3d9nxlx1n5pdy.js.
 * Formatted copy lines 49-60, 90-105, 165-180, 713-790. Read-only data, quoted for reference; not executable on its own.
 * Landing how-it-works step 4: S2 prose/choices pulled from the sample book, play-pill copy, NarrationPlayPill component (exported as NarrationPlayPill). */
  },
  29416,
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
/* ... */
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
/* ... */
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
/* ... */
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
