/*
 * Tale Forge (tale-forge.app): verbatim excerpts of the JavaScript that drives motion, timing and animation.
 * Source: the Next.js/Turbopack chunks in source/js/ (read as text, never executed), formatted with prettier.
 * "L123-140" = line numbers in the prettier-formatted chunk; "anchor" = a string present verbatim in the raw minified
 * file in source/js/, so every excerpt can be located with grep -F. Minified identifiers are kept as shipped.
 * Generated for analysis/09-motion-and-interaction.md.
 */

/* ====================================================================================================
 * source/js/3d9nxlx1n5pdy.js  |  anchor: threshold:.4
 * How-it-works branching map ("hiw-map"): the four endings, lit-path rendering, the IntersectionObserver + 600 ms delay + 4500 ms loop, 300 ms fade hand-off, hover/focus engage and 6 s resume.
 * ==================================================================================================== */
/* --- L221-221 --- */
    let c = ["AA", "AB", "BA", "BB"],
/* --- L416-431 --- */
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
/* --- L566-650 --- */
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
/* --- L680-698 --- */
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

/* ====================================================================================================
 * source/js/0ad0wel9cyv30.js  |  anchor: E(()=>c(2),1100)
 * Onboarding easel unveil (/start s4): veil specks, reduced-motion check, ready-pop 0-460 ms, phase timeline ph1 0 ms / ph2 1100 ms / ph3 2600 ms, 18 random embers, reveal line +700 ms, actions +1500 ms.
 * ==================================================================================================== */
/* --- L505-522 --- */
          veilPainting: "The portrait is being painted...",
        },
      },
      G = [
        { vl: "24%", vs: "4px", vd: "0s" },
        { vl: "44%", vs: "3px", vd: "1.4s" },
        { vl: "60%", vs: "5px", vd: "0.7s" },
        { vl: "78%", vs: "3px", vd: "2.1s" },
        { vl: "52%", vs: "4px", vd: "3.0s" },
      ];
    function U() {
      try {
        return (
          "function" == typeof window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
      } catch {
        return !1;
/* --- L1470-1495 --- */
                      : null
                  : null;
          ((0, a.useEffect)(() => {
            e.portraitBase64 || e.paintJob?.status === "failed" || T();
          }, [e.portraitBase64, e.paintJob?.status]),
            (0, a.useEffect)(() => {
              if (0 !== d || !e.portraitBase64 || U()) return;
              let t = setTimeout(() => k(!0), 0),
                a = setTimeout(() => k(!1), 460);
              return () => {
                (clearTimeout(t), clearTimeout(a));
              };
            }, [e.portraitBase64, d]),
            (0, a.useEffect)(
              () => () => {
                for (let e of y.current) clearTimeout(e);
              },
              [],
            ));
          let E = (e, t) => {
              y.current.push(setTimeout(e, t));
            },
            P = [
              "easel",
              d >= 1 ? "ph1" : "",
              d >= 2 ? "ph2" : "",
/* --- L1585-1617 --- */
                      onClick: () => {
                        if (x.current || !f) return;
                        x.current = !0;
                        let e = U(),
                          t = () => {
                            (c(3),
                              b(
                                e
                                  ? []
                                  : (function () {
                                      let e = [];
                                      for (let t = 0; t < 18; t += 1)
                                        e.push({
                                          x: `${(220 * Math.random() - 110).toFixed(0)}px`,
                                          y: `${(-120 - 160 * Math.random()).toFixed(0)}px`,
                                          d: `${(0.9 * Math.random()).toFixed(2)}s`,
                                          s: `${(3 + 5 * Math.random()).toFixed(1)}px`,
                                          left: `${(35 + 30 * Math.random()).toFixed(0)}%`,
                                        });
                                      return e;
                                    })(),
                              ));
                            let t = (0, n.elapsedSinceLanding)();
                            ((0, r.track)(
                              "portrait_revealed",
                              void 0 === t ? void 0 : { elapsed_ms: t },
                            ),
                              e
                                ? (u(!0), g(!0))
                                : (E(() => u(!0), 700), E(() => g(!0), 1500)));
                          };
                        e ? t() : (c(1), E(() => c(2), 1100), E(t, 2600));
                      },

/* ====================================================================================================
 * source/js/1pgfdvt65g9p-.js  |  anchor: unlit:0,low:.55,mid:1,high:1.25
 * createGlodScene, the canvas hearth ("glöd") painter: easeInOutQuad helper, ambient variant flag, twinkling stars, flame layer table, fire levels, the requestAnimationFrame loop (28 ms throttle for the ambient variant, dt clamp 0.1 s, fire level slews at 0.35/s), flicker sines, rising sparks, climax state machine, visibility pause.
 * ==================================================================================================== */
/* --- L130-132 --- */
    function n(e) {
      return e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
    }
/* --- L135-160 --- */
        "createGlodScene",
        0,
        function (e, s, d, f) {
          let {
              stage: h,
              canvas: u,
              memWrap: g,
              memEmber: c,
              book: m,
              caption: b,
            } = e,
            p = null;
          try {
            p = u.getContext("2d");
          } catch {
            p = null;
          }
          if (!p) return null;
          let y = p,
            M = f?.variant === "ambient";
          function x(e) {
            return M && "morgon" === e ? a : l[e];
          }
          let S = s,
            v = new Set(),
            C = x(f?.theme ?? "natt"),
/* --- L779-800 --- */
            let p = [];
            if (C.showStars) {
              for (let e = 0; e < 130; e++) {
                let t = c() * w,
                  l = c() * F.horizonY * 0.9,
                  a = 0.5 + 1.3 * c(),
                  o = 0.28 > c(),
                  r = 0.25 + 0.55 * c();
                if (e < 14) {
                  p.push({
                    x: t,
                    y: l,
                    r: a + 0.4,
                    sp: 0.6 + 1.4 * c(),
                    ph: 6.28 * c(),
                    warm: o,
                  });
                  continue;
                }
                ((d.globalAlpha = r),
                  (d.fillStyle = o ? "#ffe3a8" : "#e9e4f5"),
                  d.beginPath(),
/* --- L1389-1470 --- */
          let eT = [
              {
                w: 1,
                h: 1,
                dx: 0,
                asym: 0.06,
                lobe: 0.035,
                col: "#c8441f",
                f1: 2.7,
                f2: 1.6,
              },
              {
                w: 0.74,
                h: 0.8,
                dx: -0.065,
                asym: -0.11,
                lobe: 0.085,
                col: "#ef7527",
                f1: 3.5,
                f2: 2.2,
              },
              {
                w: 0.5,
                h: 0.585,
                dx: 0.045,
                asym: 0.12,
                lobe: -0.06,
                col: "#ffab3d",
                f1: 4.3,
                f2: 2.9,
              },
              {
                w: 0.28,
                h: 0.375,
                dx: 0.015,
                asym: -0.07,
                lobe: 0.05,
                col: "#ffe9b8",
                f1: 5.1,
                f2: 3.4,
              },
            ],
            ew = 0,
            eP = 0,
            ek = 0,
            eF = null,
            eA = 0,
            eB = 0,
            eE = "bake",
            eW = 0,
            e$ = !1,
            eO = { unlit: 0, low: 0.55, mid: 1, high: 1.25 },
            eI = "mid",
            eR = 1,
            eY = !1;
          function eG() {
            return "bake" === eE && F
              ? Math.min(eR, (0.27 * P) / Math.max(1, F.flameH))
              : 1;
          }
          function eH(e) {
            let t, l;
            if (((eF = requestAnimationFrame(eH)), M && !T && e - ek < 28))
              return;
            let a = Math.min((e - ek) / 1e3, 0.1);
            if (((ek = e), (eP += a), !F)) return;
            "bake" !== eE && (eW += a);
            let r = eO[eI];
            T
              ? (eR = r)
              : (eR += Math.max(-(0.35 * a), Math.min(0.35 * a, r - eR)));
            let i = 1;
            if (
              ("flare" === eE && (i = 1 + 1.1 * Math.min(1, eW / 0.8)),
              ("swirl" === eE || "book" === eE) &&
                (i = Math.max(1, 2.1 - 0.6 * eW)),
              "book" === eE
                ? (eB = Math.min(0.38, eB + 0.2 * a))
                : "bake" === eE && (eB = Math.max(0, eB - 0.5 * a)),
              y.clearRect(0, 0, w, P),
              y.drawImage(A, 0, 0, w, P),
              (eA += a) >= 1 &&
/* --- L1503-1508 --- */
            }
            let s = T
              ? 0.5
              : 0.5 +
                0.32 * Math.sin(5.7 * eP) +
                0.18 * Math.sin(2.3 * eP + 1.4);
/* --- L1720-1760 --- */
              (function (e, t) {
                if (!F) return;
                let l = F.s,
                  a = eG();
                if (!T)
                  for (
                    ew += e * ("bake" === eE ? (2.8 + (t - 1) * 4) * a : 5);
                    ew > 1;
                  )
                    ((ew -= 1),
                      eo.length < 38 &&
                        eo.push({
                          x: F.fx + (Math.random() - 0.5) * F.flameW * 0.55,
                          y:
                            F.fy -
                            F.flameH *
                              a *
                              (1 - eB) *
                              (0.5 + 0.45 * Math.random()),
                          vx: (Math.random() - 0.5) * 9 * l,
                          vy: (-32 - 40 * Math.random()) * l,
                          ph: 6.28 * Math.random(),
                          life: 0,
                          ttl: 2.4 + 2.8 * Math.random(),
                          r: (0.9 + 1.4 * Math.random()) * Math.min(l, 1.2),
                        }));
                (y.save(), (y.globalCompositeOperation = "lighter"));
                let o =
                  F.fy - F.flameH * ("bake" === eE ? Math.max(a, 0.3) : 1);
                for (let t = eo.length - 1; t >= 0; t--) {
                  let l = eo[t];
                  l.life += e;
                  let a = 1 - Math.max(0, o - l.y) / (0.7 * F.flameH);
                  if (l.life > l.ttl || a <= 0) {
                    eo.splice(t, 1);
                    continue;
                  }
                  ((l.x += l.vx * e + 7 * Math.sin(l.ph + 2.1 * l.life) * e),
                    (l.y += l.vy * e),
                    (l.vy *= 1 - 0.12 * e));
                  let r = (1 - l.life / l.ttl) * a;
/* --- L1880-1935 --- */
                    ((y.globalAlpha = 0.6 * a),
                      y.drawImage(O, l.x - o, l.y - o, 2 * o, 2 * o));
                  }
                  if (
                    (y.restore(),
                    "flare" === eE && eW > 0.8 && ((eE = "swirl"), (eW = 0)),
                    "swirl" === eE || "book" === eE)
                  ) {
                    let e = !0;
                    (y.save(), (y.globalCompositeOperation = "lighter"));
                    for (let t = 0; t < ep.length; t++) {
                      let l = ep[t],
                        a = T
                          ? 1
                          : Math.max(0, Math.min(1, (eW - l.delay) / l.dur));
                      a < 1 && (e = !1);
                      let o = n(a),
                        r = l.sx + (l.tx - l.sx) * o,
                        i = l.sy + (l.ty - l.sy) * o,
                        s = Math.sin(o * Math.PI) * l.swirl,
                        d = Math.atan2(l.ty - l.sy, l.tx - l.sx) + Math.PI / 2;
                      ((l.x = r + Math.cos(d) * s),
                        (l.y = i + Math.sin(d) * s));
                      let f = a >= 1 ? 0.5 + 0.5 * Math.sin(4 * eP + t) : 0.9,
                        h = "book" === eE ? Math.max(0, 1 - 0.25 * eW) : 1;
                      ((y.globalAlpha = f * h * 0.95),
                        (y.fillStyle = "#ffe3a0"),
                        y.beginPath(),
                        y.arc(l.x, l.y, 0.5 * l.size, 0, 6.2832),
                        y.fill());
                      let u = 2.2 * l.size;
                      ((y.globalAlpha = f * h * 0.55),
                        y.drawImage(O, l.x - u, l.y - u, 2 * u, 2 * u));
                    }
                    (y.restore(),
                      "swirl" === eE &&
                        (eW > (T ? 0.2 : 1.2) &&
                          !ex &&
                          ((ex = !0), d.onBookVisible()),
                        e &&
                          eW > (T ? 0.4 : 2.3) &&
                          ((eE = "book"),
                          (eW = 0),
                          eS || ((eS = !0), d.onCaptionVisible()))));
                  }
                })(a),
              M && T && eL());
          }
          function eq() {
            null !== eF ||
              e$ ||
              ((ek = performance.now()), (eF = requestAnimationFrame(eH)));
          }
          function eL() {
            null !== eF && (cancelAnimationFrame(eF), (eF = null));
          }

/* ====================================================================================================
 * source/js/1pgfdvt65g9p-.js  |  anchor: "decklePages"
 * decklePages / tornScrap: seeded clip-path polygons for deckled page edges and torn parchment (static shapes, not animated).
 * ==================================================================================================== */
/* --- L2094-2141 --- */
        "decklePages",
        0,
        function (e, t) {
          let l = o(t),
            a = ["0% 0%", "86% 0%"];
          for (let e = 1; e < 16; e++)
            a.push(
              (97 - 24 * l()).toFixed(1) +
                "% " +
                ((e / 16) * 100).toFixed(1) +
                "%",
            );
          (a.push("86% 100%", "0% 100%"),
            (e.style.clipPath = "polygon(" + a.join(",") + ")"));
        },
        "tornScrap",
        0,
        function (e, t) {
          let l,
            a = o(t);
          function r(e) {
            let t = a();
            return t < 0.2 ? e * (2 + 1.2 * a()) : e * (0.3 + 0.9 * t);
          }
          let i = [];
          for (l = 0; l <= 8; l++)
            i.push(((l / 8) * 100).toFixed(2) + "% " + r(2.4).toFixed(2) + "%");
          for (l = 1; l <= 8; l++)
            i.push(
              (100 - r(1.7)).toFixed(2) +
                "% " +
                ((l / 8) * 100).toFixed(2) +
                "%",
            );
          for (l = 1; l <= 8; l++)
            i.push(
              ((1 - l / 8) * 100).toFixed(2) +
                "% " +
                (100 - r(2.6)).toFixed(2) +
                "%",
            );
          for (l = 1; l < 8; l++)
            i.push(
              r(1.7).toFixed(2) + "% " + ((1 - l / 8) * 100).toFixed(2) + "%",
            );
          e.style.clipPath = "polygon(" + i.join(",") + ")";
        },
      ],

/* ====================================================================================================
 * source/js/1pgfdvt65g9p-.js  |  anchor: "AMBIENT_BEDS"
 * AMBIENT_BEDS sound beds: ids, labels, default volume 0.18, max 0.4, claimBed 400 ms release grace (no audio fade).
 * ==================================================================================================== */
/* --- L2148-2236 --- */
    "use strict";
    let t = [
        {
          id: "hearth",
          group: "ambience",
          label: { sv: "Brasa", en: "Fireplace" },
        },
        {
          id: "rain",
          group: "ambience",
          label: { sv: "Fönsterregn", en: "Window rain" },
        },
        {
          id: "forest",
          group: "ambience",
          label: { sv: "Sagoskogen", en: "Enchanted forest" },
        },
        {
          id: "musicbox",
          group: "music",
          label: { sv: "Speldosa", en: "Music box" },
        },
        {
          id: "harp",
          group: "music",
          label: { sv: "Månharpa", en: "Moonlit harp" },
        },
        {
          id: "fire",
          group: "music",
          label: { sv: "Glödljus", en: "Ember glow" },
        },
      ],
      l = new Set(t.map((e) => e.id));
    function a(e) {
      return "string" == typeof e && l.has(e);
    }
    function o(e) {
      return `/audio/atmosphere/v1/${e}.mp3`;
    }
    function r(e) {
      return e ? `tf-bed:${e}` : "tf-bed";
    }
    function i(e) {
      return e ? `tf-bed-vol:${e}` : "tf-bed-vol";
    }
    function n(e) {
      return Math.min(0.4, Math.max(0, e));
    }
    e.s(
      [
        "AMBIENT_BEDS",
        0,
        t,
        "DEFAULT_BED_VOLUME",
        0,
        0.18,
        "bedUrl",
        0,
        o,
        "isBedId",
        0,
        a,
      ],
      77147,
    );
    let s = null,
      d = 0;
    e.s(
      [
        "DEFAULT_WAIT_BED",
        0,
        "hearth",
        "MAX_BED_VOLUME",
        0,
        0.4,
        "claimBed",
        0,
        function () {
          d += 1;
          let e = !1;
          return () => {
            e ||
              ((e = !0),
              (d -= 1),
              window.setTimeout(() => {
                0 === d && s?.pause();
              }, 400));
          };

/* ====================================================================================================
 * source/js/2j_-r8q4tgdka.js  |  anchor: setInterval(()=>void r(),2e4)
 * Job status polling (2500 ms), capacity poll (20 s), 1 s settle before opening a finished book; glöd note ember lift after 900 ms, climax start after 500 ms.
 * ==================================================================================================== */
/* --- L140-195 --- */
                      : (T((e) => ("done" === e ? e : "running")),
                        n.storyReady &&
                          n.coverReady &&
                          n.criticalPathReady &&
                          !A.current &&
                          !s &&
                          (s = setTimeout(() => {
                            ((s = null), r(e));
                          }, 1e3))));
                })
                .catch(() => {
                  F.current === t && (a += 1) >= 4 && T("stuck");
                });
            };
          i();
          let l = setInterval(() => {
            if (F.current !== t) return;
            let e = B.current;
            "failed" === e || "gated" === e || "stuck" === e || A.current
              ? clearInterval(l)
              : i();
          }, 2500);
          return () => {
            (F.current === t && (F.current += 1),
              clearInterval(l),
              s && clearTimeout(s));
          };
        }, [e, u, h, y]));
      let [H, $] = (0, r.useState)("queued");
      (0, r.useEffect)(() => {
        if (y || "pending" !== S) return;
        let e = !1,
          t = Date.now(),
          r = async () => {
            let r = null;
            try {
              let e = await (0, n.backendFetch)("/jobs/capacity-health");
              r = (0, s.parseCapacityHealth)(e);
            } catch {
              r = null;
            }
            e ||
              $(
                (0, s.projectJobHealth)({
                  status: "pending",
                  capacity: r,
                  pendingSinceMs: t,
                  nowMs: Date.now(),
                }),
              );
          };
        r();
        let a = setInterval(() => void r(), 2e4);
        return () => {
          ((e = !0), clearInterval(a));
        };
/* --- L2245-2262 --- */
            _(0),
            G(null));
        }, [n]),
        (0, r.useEffect)(() => {
          if (!f) return;
          let e = R.current;
          if ("note" === f) {
            if (e?.isLive()) {
              let t = window.setTimeout(() => e.liftFirstEmber(), 900);
              return () => window.clearTimeout(t);
            }
            (B(et.current.mems[0] ?? null), U(!0));
          } else if ("finale" === f) {
            if (e?.isLive()) {
              let t = window.setTimeout(() => e.startClimax(), 500);
              return () => window.clearTimeout(t);
            }
            (J(!0), Z(!0));

/* ====================================================================================================
 * source/js/36tbz-w9v-p8v.js  |  anchor: X(e.toPageId)},900)
 * StoryReader: page poll every 2500 ms; auto-advance 900 ms after narration ends when a page has exactly one onward link.
 * ==================================================================================================== */
/* --- L1425-1433 --- */
                    .then((e) => {
                      t || !e || (Y.current.pageId === J && y(e));
                    })
                    .catch(() => {});
                };
              r();
              let n = setInterval(r, 2500);
              return () => {
                ((t = !0), clearInterval(n));
/* --- L1600-1612 --- */
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
