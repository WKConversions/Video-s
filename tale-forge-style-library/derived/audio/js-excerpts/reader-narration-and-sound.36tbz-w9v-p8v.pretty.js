/* VERBATIM EXCERPT (prettier-formatted) of the minified Turbopack chunk source/js/36tbz-w9v-p8v.js.
 * Formatted copy lines 1-25, 157-520, 1590-1612. Read-only data, quoted for reference; not executable on its own.
 * StoryReader pieces: cover copy (Lyssna-läge), NarrationControls (play/pause/restart, hidden <audio preload=metadata>), background-sound panel (Bakgrundsljud), listen-mode auto-advance (900 ms). */
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  88374,
  (e) => {
    "use strict";
    var t = e.i(43476),
      a = e.i(71645),
      r = e.i(22016),
      n = e.i(16934);
    let i = {
      sv: {
        read: "Läs sagan",
        listen: "Lyssna-läge",
        madeFor: (e) => `En saga f\xf6r ${e}`,
        madeWithAi: "Skapad med AI.",
        coverArtAlt: (e) => `Omslagsbild till ${e}`,
      },
      en: {
        read: "Read the story",
        listen: "Listen mode",
        madeFor: (e) => `A story for ${e}`,
        madeWithAi: "Made with AI.",
        coverArtAlt: (e) => `Cover illustration for ${e}`,
      },
    };
/* ... */
    }
    function d({ text: e, locale: a }) {
      return (0, t.jsx)("p", {
        className: "prose",
        lang: a,
        "data-testid": "story-prose",
        children: e,
      });
    }
    let c = {
      sv: {
        playNarration: "Spela berättelsen",
        pauseNarration: "Pausa berättelsen",
        restartNarration: "Börja om sidan",
      },
      en: {
        playNarration: "Play narration",
        pauseNarration: "Pause narration",
        restartNarration: "Restart this page",
      },
    };
    function u({
      narrationUrl: e,
      locale: r,
      controls: n = !0,
      autoPlay: i = !1,
      onEnded: s,
    }) {
      let l = c[r],
        o = (0, a.useRef)(null),
        d = (0, a.useRef)(null),
        [p, m] = (0, a.useState)(!1),
        h =
          null === e
            ? null
            : (function (e) {
                try {
                  let t = new URL(e, "http://localhost");
                  return `${t.origin}${t.pathname}`;
                } catch {
                  return e;
                }
              })(e);
      if (
        ((0, a.useEffect)(() => {
          let t = o.current;
          !t ||
            (d.current !== h &&
              ((d.current = h),
              t.pause(),
              m(!1),
              e
                ? ((t.src = e),
                  (t.currentTime = 0),
                  i &&
                    t
                      .play()
                      .then(() => m(!0))
                      .catch(() => {}))
                : t.removeAttribute("src")));
        }, [h, e, i]),
        !e)
      )
        return null;
      let g = (0, t.jsx)("audio", {
        ref: o,
        "data-testid": "narration-audio",
        preload: "metadata",
        hidden: !0,
        onEnded: () => {
          (m(!1), s?.());
        },
      });
      return n
        ? (0, t.jsxs)("div", {
            className: "reader-narration",
            "data-testid": "reader-narration",
            children: [
              g,
              (0, t.jsx)("button", {
                type: "button",
                className: "reader-audio-control",
                "data-testid": "narration-toggle",
                "aria-label": p ? l.pauseNarration : l.playNarration,
                title: p ? l.pauseNarration : l.playNarration,
                onClick: function () {
                  let t = o.current;
                  if (t && e) {
                    if (p) {
                      (t.pause(), m(!1));
                      return;
                    }
                    t.play()
                      .then(() => m(!0))
                      .catch(() => {});
                  }
                },
                children: p
                  ? (0, t.jsxs)("svg", {
                      viewBox: "0 0 24 24",
                      "aria-hidden": "true",
                      children: [
                        (0, t.jsx)("rect", {
                          x: "6",
                          y: "4",
                          width: "4",
                          height: "16",
                          rx: "1",
                        }),
                        (0, t.jsx)("rect", {
                          x: "14",
                          y: "4",
                          width: "4",
                          height: "16",
                          rx: "1",
                        }),
                      ],
                    })
                  : (0, t.jsx)("svg", {
                      viewBox: "0 0 24 24",
                      "aria-hidden": "true",
                      children: (0, t.jsx)("path", { d: "M8 5v14l11-7z" }),
                    }),
              }),
              (0, t.jsx)("button", {
                type: "button",
                className: "reader-audio-control",
                "data-testid": "narration-replay",
                "aria-label": l.restartNarration,
                title: l.restartNarration,
                onClick: function () {
                  let t = o.current;
                  t &&
                    e &&
                    ((t.currentTime = 0),
                    t
                      .play()
                      .then(() => m(!0))
                      .catch(() => {}));
                },
                children: (0, t.jsxs)("svg", {
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  children: [
                    (0, t.jsx)("path", { d: "M4 7v5h5" }),
                    (0, t.jsx)("path", { d: "M5.5 16a8 8 0 1 0 .5-9l-2 5" }),
                  ],
                }),
              }),
            ],
          })
        : g;
    }
    var p = e.i(77147),
      m = e.i(38618);
    let h = {
      sv: {
        soundTitle: "Bakgrundsljud",
        groupAmbience: "Stämning",
        groupMusic: "Musik",
        soundOff: "Av",
        volume: "Volym",
      },
      en: {
        soundTitle: "Background sound",
        groupAmbience: "Ambience",
        groupMusic: "Music",
        soundOff: "Off",
        volume: "Volume",
      },
    };
    function g(e) {
      let t = (t) => {
        (null === t.key ||
          "tf-bed" === t.key ||
          "tf-bed-vol" === t.key ||
          t.key?.startsWith("tf-bed:") ||
          t.key?.startsWith("tf-bed-vol:")) &&
          e();
      };
      return (
        window.addEventListener("storage", t),
        () => window.removeEventListener("storage", t)
      );
    }
    function y() {
      return () => {};
    }
    function f({
      locale: e,
      childId: r,
      initialSoundOpen: n = !1,
      controls: i = !0,
    }) {
      let s = h[e],
        [l, o] = (0, a.useState)(n),
        d = r ?? null,
        c = (0, a.useSyncExternalStore)(
          g,
          () => (0, m.readBedPref)(r),
          () => null,
        ),
        u = (0, a.useSyncExternalStore)(
          g,
          () => (0, m.readBedVol)(r),
          () => p.DEFAULT_BED_VOLUME,
        ),
        b = (0, a.useSyncExternalStore)(
          y,
          () => !0,
          () => !1,
        ),
        [x, v] = (0, a.useState)(null),
        [k, j] = (0, a.useState)(null),
        N = x?.scope === d ? x.value : c,
        S = k?.scope === d ? k.value : u;
      function w(e) {
        (v({ scope: d, value: e }),
          (0, m.writeBedPref)(e, r),
          (0, m.syncBed)({ bedId: e, volume: S, play: null != e }));
      }
      return ((0, a.useEffect)(() => (0, m.claimBed)(), []),
      (0, a.useEffect)(() => {
        b && (0, m.syncBed)({ bedId: N, volume: S, play: null != N });
      }, [N, b, S]),
      i)
        ? (0, t.jsxs)("div", {
            className: "sound",
            "data-testid": "reader-sound",
            children: [
              (0, t.jsxs)("button", {
                type: "button",
                className: "chip sound-toggle",
                "data-testid": "reader-sound-toggle",
                "aria-expanded": l,
                "aria-pressed": null !== N,
                "aria-controls": "reader-sound-panel",
                onClick: function () {
                  let e = !l;
                  (o(e), e && null === N && w(m.DEFAULT_WAIT_BED));
                },
                children: [
                  (0, t.jsxs)("svg", {
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    "aria-hidden": "true",
                    children: [
                      (0, t.jsx)("path", { d: "M11 5 6 9H3v6h3l5 4V5z" }),
                      (0, t.jsx)("path", {
                        d: "M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12",
                      }),
                    ],
                  }),
                  s.soundTitle,
                ],
              }),
              l &&
                (0, t.jsxs)("div", {
                  className: "sound-panel",
                  id: "reader-sound-panel",
                  "data-testid": "reader-sound-panel",
                  role: "group",
                  "aria-label": s.soundTitle,
                  children: [
                    ["ambience", "music"].map((a) =>
                      (0, t.jsxs)(
                        "div",
                        {
                          className: "sound-group",
                          children: [
                            (0, t.jsx)("span", {
                              className: "sound-group-label",
                              children:
                                "ambience" === a
                                  ? s.groupAmbience
                                  : s.groupMusic,
                            }),
                            (0, t.jsx)("div", {
                              className: "sound-beds",
                              children: p.AMBIENT_BEDS.filter(
                                (e) => e.group === a,
                              ).map((a) =>
                                (0, t.jsx)(
                                  "button",
                                  {
                                    type: "button",
                                    className: "sound-bed",
                                    "data-testid": `reader-bed-${a.id}`,
                                    "aria-pressed": N === a.id,
                                    onClick: () => w(a.id),
                                    children: a.label[e],
                                  },
                                  a.id,
                                ),
                              ),
                            }),
                          ],
                        },
                        a,
                      ),
                    ),
                    (0, t.jsxs)("div", {
                      className: "sound-foot",
                      children: [
                        (0, t.jsx)("button", {
                          type: "button",
                          className: "sound-bed sound-off",
                          "data-testid": "reader-sound-off",
                          "aria-pressed": null === N,
                          onClick: () => w(null),
                          children: s.soundOff,
                        }),
                        (0, t.jsxs)("label", {
                          className: "sound-volume",
                          children: [
                            (0, t.jsx)("span", {
                              className: "sound-group-label",
                              children: s.volume,
                            }),
                            (0, t.jsx)("input", {
                              type: "range",
                              min: 0,
                              max: m.MAX_BED_VOLUME,
                              step: 0.02,
                              value: S,
                              "data-testid": "reader-sound-volume",
                              "aria-label": s.volume,
                              onChange: (e) => {
                                var t;
                                let a;
                                return (
                                  (t = Number(e.target.value)),
                                  void (j({
                                    scope: d,
                                    value: (a = (0, m.clampBedVol)(t)),
                                  }),
                                  (0, m.writeBedVol)(a, r))
                                );
                              },
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          })
        : null;
    }
    let b = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      x = [
        {
          tag: "confusing",
          en: "Something was unclear",
          sv: "Något var otydligt",
        },
        {
          tag: "choices_felt_same",
          en: "Choices felt too similar",
/* ... */
                        type: "button",
                        className: "btn btn-ghost reader-replay",
                        "data-testid": "reader-restart-story",
                        disabled: w,
                        onClick: () => void Q(),
                        children: p.restartStory,
                      }),
                      (0, t.jsx)(f, { locale: i }),
                      (0, t.jsx)(u, {
                        narrationUrl: g.narrationUrl,
                        locale: i,
                        autoPlay: P,
                        onEnded: () => {
                          if (!P || $) return;
                          if (0 === g.links.length) return void L(!0);
                          if (1 !== g.links.length) return;
                          let e = g.links[0];
                          e.ready &&
                            (null !== V.current && clearTimeout(V.current),
                            (V.current = setTimeout(() => {
                              ((V.current = null), X(e.toPageId));
                            }, 900)));
                        },
