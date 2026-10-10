// EXCERPT (data, not for execution). Verbatim Turbopack module 83876 from source/js/2j_-r8q4tgdka.js,
// characters 14643-26797 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: Door cards (register to Godnatt/Aventyr/Vanskap), Surprise-us door, DoorGrid, RecipeLine, WorldBand (The world remembers), StylePicker

(42958,
  18149,
  51322,
  80937,
  83876,
  (e) => {
    "use strict";
    var t = e.i(43476);
    let r = {
        godnatt: { sv: "Godnatt", en: "Bedtime" },
        aventyr: { sv: "Äventyr", en: "Adventure" },
        vanskap: { sv: "Vänskap", en: "Friendship" },
      },
      a = { sv: { choose: "Välj den här" }, en: { choose: "Pick this one" } };
    function n({
      card: e,
      art: s,
      locale: i = "sv",
      onPick: l,
      disabled: o = !1,
    }) {
      let d = a[i],
        c =
          "competency" === e.kind
            ? "vanskap"
            : "adventure" === e.register || "wonder" === e.register
              ? "aventyr"
              : "cozy" === e.register || "silly" === e.register
                ? "godnatt"
                : "register" === e.kind
                  ? "aventyr"
                  : "godnatt",
        u = "competency" === e.kind ? e.whyLine : e.invitation;
      return (0, t.jsxs)("article", {
        className: "glass cs-door",
        "data-testid": "door-card",
        "data-card-kind": e.kind,
        children: [
          (0, t.jsx)("span", {
            className: "cs-door-art",
            "aria-hidden": "true",
            children: (0, t.jsx)("img", { src: s.src, alt: s.alt }),
          }),
          (0, t.jsxs)("div", {
            className: "cs-door-foot",
            children: [
              (0, t.jsx)("span", {
                className: `cs-door-reg cs-door-reg--${c}`,
                children: r[c][i],
              }),
              (0, t.jsx)("h3", {
                className: "cs-door-title",
                children: e.title,
              }),
              (0, t.jsx)("p", { className: "cs-door-hook", children: u }),
              (0, t.jsx)("button", {
                type: "button",
                className: "btn btn-primary",
                "data-card-kind": e.kind,
                "aria-label": `${d.choose}: ${e.title}`,
                disabled: o,
                onClick: () => l(e),
                children: d.choose,
              }),
            ],
          }),
        ],
      });
    }
    var s = e.i(35768),
      i = e.i(71645);
    let l = {
      sv: {
        cap: "Överraska",
        title: "Överraska oss",
        bodyLead: "Vi väljer äventyr, bildstil och röst utifrån",
        bodyTail: "ålder.",
        button: "Överraska oss",
      },
      en: {
        cap: "Surprise",
        title: "Surprise us",
        bodyLead: "We pick the adventure, art style and voice for",
        bodyTail: "age.",
        button: "Surprise us",
      },
    };
    function o({ heroName: e, locale: r = "sv", onPick: a, disabled: n = !1 }) {
      let d = l[r],
        [c, u] = (0, i.useState)(!1);
      return (0, t.jsxs)("article", {
        className: "glass cs-door",
        "data-testid": "surprise-door",
        children: [
          (0, t.jsx)("span", {
            className: "cs-door-art cs-door-art--surprise",
            "aria-hidden": "true",
            children: c
              ? (0, t.jsx)("span", {
                  className: "cs-door-face cs-door-face--fallback",
                  "data-testid": "surprise-art-fallback",
                  children: (0, t.jsx)("span", {
                    className: "cs-door-star",
                    children: "✦",
                  }),
                })
              : (0, t.jsx)("img", {
                  src: "/images/create/surprise-us.webp",
                  alt: "",
                  "data-testid": "surprise-art",
                  onError: () => u(!0),
                }),
          }),
          (0, t.jsxs)("div", {
            className: "cs-door-foot",
            children: [
              (0, t.jsx)("span", {
                className: "cs-door-reg cs-door-reg--surprise",
                children: d.cap,
              }),
              (0, t.jsx)("h3", {
                className: "cs-door-title",
                children: d.title,
              }),
              (0, t.jsxs)("p", {
                className: "cs-door-hook",
                children: [
                  d.bodyLead,
                  " ",
                  (0, s.genitive)(e, r),
                  " ",
                  d.bodyTail,
                ],
              }),
              (0, t.jsx)("button", {
                type: "button",
                className: "btn btn-primary",
                disabled: n,
                onClick: a,
                children: d.button,
              }),
            ],
          }),
        ],
      });
    }
    let d = {
        ember: ["/cards/generated/lost-lantern-v1.webp"],
        register: [
          "/cards/generated/tower-clouds-v1.webp",
          "/cards/generated/lost-lantern-v1.webp",
        ],
        competency: [
          "/cards/generated/starry-friendship-v1.webp",
          "/cards/generated/lost-lantern-v1.webp",
        ],
      },
      c = {
        sv: { heading: "Välj kvällens äventyr" },
        en: { heading: "Choose tonight's adventure" },
      };
    e.s(
      [
        "DoorGrid",
        0,
        function ({
          cards: e,
          heroName: r,
          locale: a = "sv",
          onPickCard: s,
          onSurprise: i,
          disabled: l = !1,
        }) {
          let u,
            h = c[a],
            m =
              ((u = new Set()),
              e.map((e) => {
                let t = d[e.kind],
                  r = t.find((e) => !u.has(e)) ?? t[t.length - 1];
                return (u.add(r), { src: r, alt: "" });
              }));
          return (0, t.jsxs)("div", {
            "data-testid": "door-grid",
            children: [
              (0, t.jsx)("h2", { className: "cs-h2", children: h.heading }),
              (0, t.jsxs)("div", {
                className: "cs-doors",
                children: [
                  (0, t.jsx)(o, {
                    heroName: r,
                    locale: a,
                    onPick: i,
                    disabled: l,
                  }),
                  e.map((e, r) =>
                    (0, t.jsx)(
                      n,
                      { card: e, art: m[r], locale: a, onPick: s, disabled: l },
                      e.id,
                    ),
                  ),
                ],
              }),
            ],
          });
        },
      ],
      18149,
    );
    let u = {
      sv: {
        recipeTitle: "Bokens recept",
        paintLead: "Ikvällens bok målas i",
        readLead: "läses av",
        onLanguage: "på",
        withLead: "tillsammans med",
        addFriend: "+ ta med en vän",
        styleTitle: "Bildstil",
        voiceTitle: "Berättarröst",
        languageTitle: "Bokens språk",
        companionTitle: "Vem följer med?",
        done: "Klar",
        close: "Stäng",
      },
      en: {
        recipeTitle: "Book recipe",
        paintLead: "Tonight's book is painted in",
        readLead: "read by",
        onLanguage: "in",
        withLead: "together with",
        addFriend: "+ bring a friend",
        styleTitle: "Art style",
        voiceTitle: "Narrator voice",
        languageTitle: "The book's language",
        companionTitle: "Who comes along?",
        done: "Done",
        close: "Close",
      },
    };
    function h({ thumbUrl: e }) {
      return (0, t.jsx)("span", {
        className: "cs-chip-th",
        "aria-hidden": "true",
        children: e ? (0, t.jsx)("img", { src: e, alt: "" }) : null,
      });
    }
    e.s(
      [
        "RecipeLine",
        0,
        function ({
          locale: e = "sv",
          style: r,
          voice: a,
          language: n,
          companion: s = null,
          companionAdd: l = !1,
          renderStylePicker: o,
          renderVoicePicker: d,
          renderLanguagePicker: c,
          renderCompanionPicker: m,
        }) {
          let g = u[e],
            [f, p] = (0, i.useState)(null),
            y = (0, i.useId)(),
            v = (0, i.useRef)(null),
            k = (0, i.useRef)(null),
            b = () => p(null);
          (0, i.useEffect)(() => {
            if (!f) return;
            let e = document.body.style.overflow,
              t = k.current;
            ((document.body.style.overflow = "hidden"), v.current?.focus());
            let r = (e) => {
              "Escape" === e.key && b();
            };
            return (
              document.addEventListener("keydown", r),
              () => {
                ((document.body.style.overflow = e),
                  document.removeEventListener("keydown", r),
                  t?.isConnected && t.focus());
              }
            );
          }, [f]);
          let x = {
              style: g.styleTitle,
              voice: g.voiceTitle,
              language: g.languageTitle,
              companion: g.companionTitle,
            },
            w = (e, r, a, n, s = !1) =>
              (0, t.jsxs)("button", {
                type: "button",
                className: s ? "cs-chip cs-chip--add" : "cs-chip",
                "aria-label": a,
                "data-testid": n,
                onClick: (t) => {
                  ((k.current = t.currentTarget), p(e));
                },
                children: [(0, t.jsx)(h, { thumbUrl: r.thumbUrl }), r.label],
              }),
            j = null != s;
          return (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsxs)("section", {
                className: "cs-recipe-group",
                role: "group",
                "aria-labelledby": y,
                children: [
                  (0, t.jsx)("h2", {
                    className: "cs-recipe-title",
                    id: y,
                    children: g.recipeTitle,
                  }),
                  (0, t.jsxs)("p", {
                    className: "cs-recipe",
                    "data-testid": "recipe-line",
                    children: [
                      (0, t.jsxs)("span", {
                        className: "cs-clause",
                        children: [
                          g.paintLead,
                          " ",
                          w(
                            "style",
                            r,
                            `${g.styleTitle}: ${r.label}`,
                            "recipe-chip-style",
                          ),
                        ],
                      }),
                      ", ",
                      (0, t.jsxs)("span", {
                        className: "cs-clause",
                        children: [
                          g.readLead,
                          " ",
                          w(
                            "voice",
                            a,
                            `${g.voiceTitle}: ${a.label}`,
                            "recipe-chip-voice",
                          ),
                          " ",
                          g.onLanguage,
                          " ",
                          w(
                            "language",
                            n,
                            `${g.languageTitle}: ${n.label}`,
                            "recipe-chip-language",
                          ),
                        ],
                      }),
                      j
                        ? (0, t.jsxs)(t.Fragment, {
                            children: [
                              ", ",
                              (0, t.jsxs)("span", {
                                className: "cs-clause",
                                children: [
                                  g.withLead,
                                  " ",
                                  w(
                                    "companion",
                                    s,
                                    `${g.companionTitle.replace("?", "")}: ${s.label}`,
                                    "recipe-chip-companion",
                                  ),
                                ],
                              }),
                            ],
                          })
                        : null,
                      !j && l && null != m
                        ? (0, t.jsxs)(t.Fragment, {
                            children: [
                              " ",
                              w(
                                "companion",
                                { label: g.addFriend },
                                g.addFriend,
                                "recipe-chip-add-friend",
                                !0,
                              ),
                            ],
                          })
                        : null,
                    ],
                  }),
                ],
              }),
              f
                ? (0, t.jsx)("div", {
                    className: "cs-sheetwrap",
                    "data-testid": "recipe-sheet",
                    onClick: (e) => {
                      e.target === e.currentTarget && b();
                    },
                    children: (0, t.jsxs)("div", {
                      className: "glass cs-sheet",
                      role: "dialog",
                      "aria-modal": "true",
                      "aria-labelledby": "cs-sheet-title",
                      "data-sheet": f,
                      onKeyDown: (e) => {
                        if ("Tab" !== e.key) return;
                        let t = Array.from(
                          e.currentTarget.querySelectorAll(
                            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                          ),
                        );
                        if (0 === t.length) {
                          (e.preventDefault(), v.current?.focus());
                          return;
                        }
                        let r = t[0],
                          a = t[t.length - 1],
                          n = document.activeElement;
                        n !== v.current && e.currentTarget.contains(n)
                          ? e.shiftKey && n === r
                            ? (e.preventDefault(), a.focus())
                            : e.shiftKey ||
                              n !== a ||
                              (e.preventDefault(), r.focus())
                          : (e.preventDefault(), (e.shiftKey ? a : r).focus());
                      },
                      children: [
                        (0, t.jsxs)("header", {
                          className: "cs-sheet-head",
                          children: [
                            (0, t.jsx)("h3", {
                              ref: v,
                              tabIndex: -1,
                              className: "cs-sheet-title",
                              id: "cs-sheet-title",
                              children: x[f],
                            }),
                            (0, t.jsx)("button", {
                              type: "button",
                              className: "cs-sheet-close",
                              "aria-label": g.close,
                              onClick: b,
                              children: (0, t.jsx)("span", {
                                "aria-hidden": "true",
                                children: "×",
                              }),
                            }),
                          ],
                        }),
                        (0, t.jsx)("div", {
                          className: "cs-sheet-body",
                          children: {
                            style: o,
                            voice: d,
                            language: c,
                            companion: m,
                          }[f]?.(b),
                        }),
                        (0, t.jsx)("footer", {
                          className: "cs-sheet-actions",
                          children: (0, t.jsx)("button", {
                            type: "button",
                            className: "btn btn-ghost cs-sheet-done",
                            onClick: b,
                            children: g.done,
                          }),
                        }),
                      ],
                    }),
                  })
                : null,
            ],
          });
        },
      ],
      51322,
    );
    let m = {
      sv: {
        world: "sagovärld",
        fallbackTitle: "Er sagovärld",
        editHero: "Ändra hjälten",
        memoryLead: "Världen minns:",
      },
      en: {
        world: "story world",
        fallbackTitle: "Your storyworld",
        editHero: "Edit hero",
        memoryLead: "The world remembers:",
      },
    };
    (e.s(
      [
        "WorldBand",
        0,
        function ({
          locale: e = "sv",
          heroName: r = null,
          portraitUrl: a = null,
          portraitAlt: n,
          portraitFallback: i,
          portraitBusy: l = !1,
          lede: o,
          onEditHero: d,
          memoryHook: c = null,
          friends: u = [],
        }) {
          let h = m[e],
            g = r?.trim() ?? "",
            f = g ? `${(0, s.genitive)(g, e)} ${h.world}` : h.fallbackTitle,
            p = !!c || u.length > 0;
          return (0, t.jsxs)("div", {
            className: "cs-band",
            "data-testid": "world-band",
            children: [
              (0, t.jsxs)("div", {
                className: "cs-band-left",
                children: [
                  (0, t.jsx)("div", {
                    className: "cs-portrait",
                    children: a
                      ? (0, t.jsx)("img", {
                          src: a,
                          alt: n ?? "",
                          "data-testid": "hero-portrait",
                          style: l ? { opacity: 0.5 } : void 0,
                        })
                      : (i ??
                        (0, t.jsx)("span", {
                          className: "cs-portrait-initial",
                          "aria-hidden": "true",
                          children: g ? g.charAt(0) : "?",
                        })),
                  }),
                  d
                    ? (0, t.jsx)("button", {
                        type: "button",
                        className: "cs-andra",
                        onClick: d,
                        children: h.editHero,
                      })
                    : null,
                ],
              }),
              (0, t.jsxs)("div", {
                className: "cs-band-who",
                children: [
                  (0, t.jsx)("h1", { className: "cs-h1", children: f }),
                  (0, t.jsx)("p", { className: "cs-lede", children: o }),
                ],
              }),
              p
                ? (0, t.jsxs)("div", {
                    className: "cs-memory",
                    children: [
                      c
                        ? (0, t.jsxs)(t.Fragment, {
                            children: [
                              (0, t.jsx)("span", {
                                className: "cs-spine",
                                "aria-hidden": "true",
                              }),
                              (0, t.jsxs)("p", {
                                className: "cs-memtag",
                                "data-testid": "world-band-memory",
                                children: [h.memoryLead, " ", c],
                              }),
                            ],
                          })
                        : null,
                      u.length > 0
                        ? (0, t.jsx)("div", {
                            className: "cs-coins",
                            "data-testid": "world-band-coins",
                            children: u.map((e) =>
                              (0, t.jsx)(
                                "span",
                                {
                                  className: "cs-coin",
                                  title: e.name,
                                  children: e.portraitUrl
                                    ? (0, t.jsx)("img", {
                                        src: e.portraitUrl,
                                        alt: e.name,
                                      })
                                    : (0, t.jsx)("span", {
                                        "aria-hidden": "true",
                                        children: e.name.charAt(0),
                                      }),
                                },
                                e.name,
                              ),
                            ),
                          })
                        : null,
                    ],
                  })
                : null,
            ],
          });
        },
      ],
      80937,
    ),
      e.s([], 42958));
    var g = e.i(67711);
    let f = {
        en: { listboxLabel: "Choose a story style", selected: "Selected" },
        sv: { listboxLabel: "Välj en berättarstil", selected: "Vald" },
      },
      p = { display: "grid", gap: "14px" },
      y = {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        display: "block",
        padding: "30px 10px 11px",
        textAlign: "center",
        fontFamily: "var(--ui)",
        fontSize: ".92rem",
        fontWeight: 700,
        color: "#fff",
        lineHeight: 1.3,
        background:
          "linear-gradient(180deg, rgba(10,10,20,0) 0%, rgba(10,10,20,.72) 55%)",
        textShadow: "0 1px 3px rgba(0,0,0,.6)",
      },
      v = {
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 2,
        display: "inline-flex",
        alignItems: "center",
        minHeight: "26px",
        padding: "3px 9px",
        border: "1px solid var(--gold)",
        borderRadius: "999px",
        background: "var(--gold-chip-bg)",
        color: "var(--gold-chip-ink)",
        fontFamily: "var(--ui)",
        fontSize: ".72rem",
        fontWeight: 800,
        lineHeight: 1,
        boxShadow: "0 3px 12px rgba(0, 0, 0, .28)",
      };
    e.s(
      [
        "StylePicker",
        0,
        function ({ selectedId: e, onSelect: r, locale: a = "en" }) {
          let n = f[a],
            [s, l] = (0, i.useState)({});
          return (0, t.jsx)("div", {
            role: "listbox",
            "aria-label": n.listboxLabel,
            className: "styles-grid",
            style: p,
            children: g.CREATE_STYLE_PRESETS.map((i) => {
              let o = e === i.id,
                d = "sv" === a ? i.labelSv : i.labelEn;
              return (0, t.jsxs)(
                "button",
                {
                  type: "button",
                  role: "option",
                  "aria-selected": o,
                  "aria-label": d,
                  "data-style-tile": i.id,
                  "data-testid": `style-tile-${i.id}`,
                  onClick: () => r(i.id),
                  style: {
                    position: "relative",
                    aspectRatio: "3 / 2",
                    background: "var(--choice-bg)",
                    fontFamily: "var(--ui)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "18px",
                    overflow: "hidden",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "center",
                    transform: o ? "scale(1.02)" : void 0,
                    boxShadow: o
                      ? "inset 0 0 0 2px var(--gold), 0 4px 20px -10px var(--gold)"
                      : "inset 0 0 0 1px var(--card-line)",
                    transition: "transform .2s ease, box-shadow .3s ease",
                  },
                  children: [
                    (0, t.jsx)("span", {
                      "aria-hidden": "true",
                      style: {
                        position: "absolute",
                        inset: 0,
                        display: "block",
                      },
                      children: s[i.id]
                        ? (0, t.jsx)("span", {
                            style: {
                              display: "grid",
                              placeItems: "center",
                              width: "100%",
                              height: "100%",
                              background: "var(--choice-bg)",
                              color: "var(--card-sub)",
                            },
                            children: (0, t.jsxs)("svg", {
                              viewBox: "0 0 24 24",
                              width: "26",
                              height: "26",
                              fill: "none",
                              stroke: "currentColor",
                              strokeWidth: "1.8",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              "aria-hidden": "true",
                              children: [
                                (0, t.jsx)("path", {
                                  d: "M12 3a9 9 0 1 0 0 18c1 0 1.6-.8 1.6-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-3.9-4-7.3-9-7.3z",
                                }),
                                (0, t.jsx)("circle", {
                                  cx: "7.5",
                                  cy: "10.5",
                                  r: "1",
                                  fill: "currentColor",
                                  stroke: "none",
                                }),
                                (0, t.jsx)("circle", {
                                  cx: "12",
                                  cy: "7.5",
                                  r: "1",
                                  fill: "currentColor",
                                  stroke: "none",
                                }),
                                (0, t.jsx)("circle", {
                                  cx: "16.5",
                                  cy: "10.5",
                                  r: "1",
                                  fill: "currentColor",
                                  stroke: "none",
                                }),
                              ],
                            }),
                          })
                        : (0, t.jsx)("img", {
                            src: i.previewImageUrl,
                            alt: "",
                            style: {
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            },
                            onError: () => l((e) => ({ ...e, [i.id]: !0 })),
                          }),
                    }),
                    o
                      ? (0, t.jsx)("span", {
                          className: "style-selected-badge",
                          "data-testid": "style-selected-badge",
                          "aria-hidden": "true",
                          style: v,
                          children: n.selected,
                        })
                      : null,
                    (0, t.jsx)("span", { style: y, children: d }),
                  ],
                },
                i.id,
              );
            }),
          });
        },
      ],
      83876,
    );
  });
