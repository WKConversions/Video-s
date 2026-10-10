// EXCERPT (data, not for execution). Verbatim Turbopack module 78128 from source/js/2j_-r8q4tgdka.js,
// characters 112-14643 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: JOB_STATUS_COPY (4 build steps) + GLOD_COPY (waiting fire / memory embers)

(55845,
  1e4,
  78128,
  (e) => {
    "use strict";
    var t = e.i(43476),
      r = e.i(71645),
      a = e.i(18566),
      n = e.i(16934),
      s = e.i(63500),
      i = e.i(56020);
    let l = {
        en: {
          inProgress: "Your story is coming to life",
          queuedHeading: "Your story is in line",
          firstBookQueuedHeading: "{names} very first story is in line",
          firstBookHeading: "{names} very first book is being made",
          queuedBody:
            "Your story is waiting to begin. It starts automatically when the forge is ready. You can close this page; the book lands on the bookshelf when it is ready.",
          expectation: `A real picture book takes ${i.WAIT_PHRASE.en}. You can stay here, it opens by itself when it is ready. If you close this page the book is safe, it lands on the bookshelf when it is ready.`,
          steps: [
            "The story is planned",
            "The words are written",
            "The cast is painted",
            "The book is made ready to open",
          ],
          rewriting:
            "Our editor sent the draft back, so the storyteller is writing a fresh one. Good books take a rewrite or two.",
          failed: "That story did not come together this time.",
          gated: "This story needs a gentle rework before it is ready.",
          stuck:
            "We could not find your finished story. Please try another adventure.",
          retry: "Try another adventure",
        },
        sv: {
          inProgress: "Din saga växer fram",
          queuedHeading: "Din saga står i kö",
          firstBookQueuedHeading: "{names} allra första saga står i kö",
          firstBookHeading: "{names} allra första bok smids nu",
          queuedBody:
            "Er saga väntar på att börja. Den startar av sig själv när sagosmedjan är redo. Ni kan stänga sidan; boken lägger sig i bokhyllan när den är klar.",
          expectation: `En riktig bilderbok tar ${i.WAIT_PHRASE.sv}. Du kan stanna h\xe4r, den \xf6ppnas av sig sj\xe4lv n\xe4r den \xe4r klar. St\xe4nger du sidan \xe4r boken kvar, den l\xe4gger sig i bokhyllan n\xe4r den \xe4r klar.`,
          steps: [
            "Berättelsen planeras",
            "Orden skrivs",
            "Rollerna målas",
            "Boken görs redo att öppnas",
          ],
          rewriting:
            "Vår redaktör skickade tillbaka utkastet, så berättaren skriver ett nytt. Bra böcker behöver en omskrivning ibland.",
          failed: "Den här sagan blev inte klar den här gången.",
          gated: "Den här sagan behöver formas om lite innan den är redo.",
          stuck:
            "Vi kunde inte hitta din färdiga saga. Välj ett annat äventyr.",
          retry: "Välj ett annat äventyr",
        },
      },
      o = {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "28px 30px",
        maxWidth: "560px",
        fontFamily: "var(--ui)",
        color: "var(--card-ink)",
      },
      d = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px 22px",
        fontFamily: "var(--ui)",
        color: "var(--card-ink)",
      };
    function c({
      jobId: e,
      locale: i = "en",
      initialStatus: u = "pending",
      initialArtifactId: h,
      initialStoryProgress: m,
      initialFoundryProgress: g,
      initialAttempts: f = 1,
      initialSentBack: p = !1,
      static: y = !1,
      onSettled: v,
      onDone: k,
      renderActive: b,
    }) {
      let x = l[i],
        w = x.expectation,
        j = (0, a.useRouter)(),
        N = (0, r.useRef)(j);
      (0, r.useEffect)(() => {
        N.current = j;
      }, [j]);
      let [S, T] = (0, r.useState)(u),
        [I] = (0, r.useState)(g),
        [E] = (0, r.useState)(f),
        [L] = (0, r.useState)(p),
        [C, R] = (0, r.useState)(m ?? null),
        A = (0, r.useRef)(null),
        F = (0, r.useRef)(0),
        B = (0, r.useRef)(S);
      (0, r.useEffect)(() => {
        B.current = S;
      }, [S]);
      let P = (0, r.useRef)(k);
      ((0, r.useEffect)(() => {
        P.current = k;
      }),
        (0, r.useEffect)(() => {
          if (y) return;
          let t = F.current + 1;
          F.current = t;
          let r = (e) => {
            if (F.current !== t || A.current === e) return;
            A.current = e;
            let r = P.current;
            r ? r(e) : N.current.replace(`/reader/${e}?from=create`);
          };
          if ("done" === u && h) return void r(h);
          let a = 0,
            s = null,
            i = () => {
              (0, n.backendFetch)("/jobs/story/{story_id}/progress", {
                params: { story_id: e },
              })
                .then((n) => {
                  F.current !== t ||
                    (((a = 0),
                    R(n),
                    n.outlineFailed ||
                      n.storyFailed ||
                      n.portraitsFailed ||
                      n.coverFailed ||
                      n.criticalPathFailed)
                      ? T("failed")
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
      }, [e, S, y]);
      let O = "pending" === S ? H : "queued",
        D = "done" === S || "failed" === S || "gated" === S || "stuck" === S;
      (0, r.useEffect)(() => {
        D && v?.();
      }, [D, v]);
      let M = (function (e, t) {
        if ("done" === e) return 4;
        if ("pending" === e) return -1;
        if (!t) return 0;
        let r = t.outlineReady,
          a = r && t.storyReady,
          n = a && t.coverReady;
        return n && t.criticalPathReady ? 4 : n ? 3 : a ? 2 : +!!r;
      })(S, C);
      return b
        ? b({
            status: S,
            foundryProgress: I,
            activeStep: M,
            rewrite: E > 1 && L,
            health: O,
          })
        : "failed" === S || "gated" === S || "stuck" === S
          ? (0, t.jsxs)("div", {
              role: "status",
              className: "glass",
              style: d,
              children: [
                (0, t.jsx)("p", {
                  style: { margin: 0, fontSize: ".98rem", lineHeight: 1.55 },
                  children:
                    "failed" === S
                      ? x.failed
                      : "gated" === S
                        ? x.gated
                        : x.stuck,
                }),
                (0, t.jsxs)("a", {
                  href: "/create",
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    fontSize: ".9rem",
                    fontWeight: 700,
                    color: "var(--chip-ink)",
                    textDecoration: "underline",
                  },
                  children: [
                    (0, t.jsxs)("svg", {
                      viewBox: "0 0 24 24",
                      width: "18",
                      height: "18",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2.2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      "aria-hidden": "true",
                      children: [
                        (0, t.jsx)("path", {
                          d: "M3 12a9 9 0 0 1 15-6.7L21 8",
                        }),
                        (0, t.jsx)("path", { d: "M21 3v5h-5" }),
                        (0, t.jsx)("path", {
                          d: "M21 12a9 9 0 0 1-15 6.7L3 16",
                        }),
                        (0, t.jsx)("path", { d: "M3 21v-5h5" }),
                      ],
                    }),
                    x.retry,
                  ],
                }),
              ],
            })
          : (0, t.jsxs)("div", {
              role: "status",
              className: "glass",
              style: o,
              children: [
                (0, t.jsxs)("div", {
                  style: { display: "flex", alignItems: "center", gap: "14px" },
                  children: [
                    (0, t.jsx)("svg", {
                      viewBox: "0 0 24 24",
                      width: "26",
                      height: "26",
                      fill: "none",
                      stroke: "var(--accent)",
                      strokeWidth: "2.4",
                      strokeLinecap: "round",
                      "aria-hidden": "true",
                      children: (0, t.jsx)("path", {
                        d: "M12 3a9 9 0 1 0 9 9",
                        children: (0, t.jsx)("animateTransform", {
                          attributeName: "transform",
                          type: "rotate",
                          from: "0 12 12",
                          to: "360 12 12",
                          dur: "0.8s",
                          repeatCount: "indefinite",
                        }),
                      }),
                    }),
                    (0, t.jsx)("span", {
                      style: {
                        fontFamily: "var(--display)",
                        fontWeight: 700,
                        fontSize: "1.35rem",
                        letterSpacing: "-.01em",
                      },
                      children:
                        "pending" === S ? x.queuedHeading : x.inProgress,
                    }),
                  ],
                }),
                (0, t.jsx)("p", {
                  style: {
                    margin: 0,
                    fontSize: ".95rem",
                    lineHeight: 1.6,
                    color: "var(--card-sub)",
                  },
                  children: "pending" === S ? x.queuedBody : w,
                }),
                E > 1 && L
                  ? (0, t.jsx)("p", {
                      "data-testid": "job-rewriting",
                      style: {
                        margin: 0,
                        fontSize: ".9rem",
                        lineHeight: 1.55,
                        color: "var(--gold-chip-ink)",
                        fontWeight: 600,
                      },
                      children: x.rewriting,
                    })
                  : null,
                (0, t.jsx)("ol", {
                  "data-testid": "job-steps",
                  style: {
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "grid",
                    gap: "10px",
                  },
                  children: x.steps.map((e, r) => {
                    let a = r < M,
                      n = r === M;
                    return (0, t.jsxs)(
                      "li",
                      {
                        "data-active": n || void 0,
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "11px",
                          fontSize: ".95rem",
                          fontWeight: n ? 700 : 400,
                          color: n ? "var(--card-ink)" : "var(--card-sub)",
                        },
                        children: [
                          (0, t.jsx)("span", {
                            "aria-hidden": "true",
                            style: {
                              width: "22px",
                              height: "22px",
                              borderRadius: "999px",
                              flex: "none",
                              display: "grid",
                              placeItems: "center",
                              fontSize: ".72rem",
                              fontWeight: 800,
                              background:
                                a || n ? "var(--btn-grad)" : "var(--chip-bg)",
                              color:
                                a || n ? "var(--btn-ink)" : "var(--chip-ink)",
                              border:
                                a || n ? "none" : "1px solid var(--chip-line)",
                            },
                            children: a ? "✓" : r + 1,
                          }),
                          e,
                        ],
                      },
                      e,
                    );
                  }),
                }),
              ],
            });
    }
    e.s(
      [
        "JOB_STATUS_COPY",
        0,
        l,
        "JobStatus",
        0,
        function (e) {
          return (0, t.jsx)(c, { ...e }, e.jobId);
        },
      ],
      55845,
    );
    var u = e.i(35768);
    let h = {
        sv: {
          canvasLabel: "Väntelden. Fånga en glöd för att se vad den minns.",
          kicker: "Väntelden",
          forgeUnavailable: {
            title: "Smedjan är tom just nu",
            body: "Er saga står kvar och är sparad. Ingen annan familj står före er; smedjan är bara tom för stunden. Boken börjar av sig själv så snart en smed är tillbaka, och lägger sig i bokhyllan när den är klar. Ni kan stänga sidan.",
          },
          terminal: {
            failed: {
              title: "Elden kunde inte slutföra sagan",
              body: "Den ofärdiga sagan lades inte i bokhyllan. Gå tillbaka och välj ett nytt äventyr, så försöker vi igen.",
              action: "Välj ett nytt äventyr",
            },
            gated: {
              title: "Den här sagan blev inte redo",
              body: "Vi stoppade den innan den nådde bokhyllan. Välj ett nytt äventyr, så smider vi en helt ny saga.",
              action: "Välj ett nytt äventyr",
            },
            stuck: {
              title: "Vi letar efter er saga",
              body: "Den här sidan når inte väntelden just nu. Elden fortsätter att smida er bok hos oss, och boken lägger sig i bokhyllan när den är klar, även om ni stänger sidan.",
              action: "Kontrollera igen",
            },
            working: "Ett ögonblick...",
            actionFailed: "Det gick inte att fortsätta just nu. Försök igen.",
          },
          memFrom: "från '{title}'",
          carryThread: "Spara till nästa saga",
          threadCarried:
            "Sparat: nästa gång ni skapar en bok är det här minnet det första valet ni ser.",
          catchEmber: "Fånga en gnista som minns en stund ur era böcker",
          catchCue: "Fånga en gnista",
          closeMemory: "Stäng minnet",
          revisitEmber: "Minns igen från '{title}'",
          revisitCue: "Minns igen",
          sourceReturned: "Glöden lyser nu i '{title}'.",
          neutralMemHook: "Den här glöden minns något ur en av era böcker.",
          freshMemHook:
            "Den allra första gnistan. Den väntar på minnen från er första saga ikväll.",
          freshPreviewHook:
            "{names} första gnista bär kvällens val: {adventure}, med {companion}.",
          finaleLine: "Elden har smitt klart din saga.",
          finaleOpen: "Öppna boken",
          finaleTitle: "En ny saga om {name}",
          fallbackName: "hjälten",
        },
        en: {
          canvasLabel:
            "The waiting fire. Touch an ember to see what it remembers.",
          kicker: "The waiting fire",
          forgeUnavailable: {
            title: "The smithy is empty right now",
            body: "Your story is saved and still here. No other family is ahead of you; the workshop is simply empty for the moment. The book starts by itself as soon as a smith is back, and lands on the bookshelf when it is ready. You can close this page.",
          },
          terminal: {
            failed: {
              title: "The fire could not finish this story",
              body: "The unfinished story was not added to the bookshelf. Go back and choose a new adventure, then we will try again.",
              action: "Choose a new adventure",
            },
            gated: {
              title: "This story was not ready",
              body: "We stopped it before it reached the bookshelf. Choose a new adventure and we will forge a completely new story.",
              action: "Choose a new adventure",
            },
            stuck: {
              title: "We are finding your story",
              body: "This page cannot see the waiting fire right now. The fire keeps forging your book on our side, and the book lands on the bookshelf when it is ready, even if you close this page.",
              action: "Check again",
            },
            working: "One moment...",
            actionFailed: "We could not continue just now. Please try again.",
          },
          memFrom: "from '{title}'",
          carryThread: "Save for the next book",
          threadCarried:
            "Saved: next time you make a book, this memory is the first choice you see.",
          catchEmber: "Catch a spark that remembers a moment from your books",
          catchCue: "Catch a spark",
          closeMemory: "Close the memory",
          revisitEmber: "Revisit a memory from '{title}'",
          revisitCue: "Revisit",
          sourceReturned: "The ember now glows in '{title}'.",
          neutralMemHook:
            "This ember remembers something from one of your books.",
          freshMemHook:
            "The very first spark. It is waiting for memories from your first story tonight.",
          freshPreviewHook:
            "{name}'s first spark holds tonight's choice: {adventure}, with {companion}.",
          finaleLine: "The fire has forged your story.",
          finaleOpen: "Open the book",
          finaleTitle: "A new story about {name}",
          fallbackName: "the hero",
        },
      },
      m = {
        sv: {
          queued: {
            warm: "er saga har sin plats vid väntelden och startar av sig själv, så ni kan stänga sidan om ni vill.",
            cold: "{names} allra första saga har sin plats vid väntelden och startar av sig själv, så ni kan stänga sidan om ni vill.",
          },
          making: {
            warm: "kvällens bok smids i elden nu och tar {minutes}, och den lägger sig i bokhyllan även om ni stänger sidan.",
            cold: "{names} allra första bok smids i elden nu och tar {minutes}, och den lägger sig i bokhyllan även om ni stänger sidan.",
          },
          nearlyReady: {
            warm: "boken är nästan färdig och lägger sig i bokhyllan när den är klar, en hel saga tar {minutes} att smida.",
            cold: "{names} allra första bok är nästan färdig och lägger sig i bokhyllan när den är klar, en hel saga tar {minutes} att smida.",
          },
          ready: { warm: "" },
          unlit: {
            warm: "smedjan är tom just nu, men er saga står kvar och startar av sig själv så snart en smed är tillbaka.",
          },
          failed: {
            warm: "elden kunde inte slutföra sagan, välj ett nytt äventyr så försöker vi igen.",
          },
          gated: {
            warm: "den här sagan blev inte redo, välj ett nytt äventyr så smider vi en helt ny.",
          },
          stuck: {
            warm: "den här sidan når inte väntelden just nu, men elden fortsätter att smida er bok hos oss.",
          },
        },
        en: {
          queued: {
            warm: "your story has its place by the waiting fire and starts by itself, so you can close this page if you like.",
            cold: "{names} very first story has its place by the waiting fire and starts by itself, so you can close this page if you like.",
          },
          making: {
            warm: "tonight's book is being made in the fire and takes {minutes}, and it lands on the bookshelf even if you close this page.",
            cold: "{names} very first book is being made in the fire and takes {minutes}, and it lands on the bookshelf even if you close this page.",
          },
          nearlyReady: {
            warm: "the book is nearly ready and lands on the bookshelf when it is done, a whole story takes {minutes} to forge.",
            cold: "{names} very first book is nearly ready and lands on the bookshelf when it is done, a whole story takes {minutes} to forge.",
          },
          ready: { warm: "" },
          unlit: {
            warm: "the smithy is empty right now, but your story is safe and starts by itself as soon as a smith is back.",
          },
          failed: {
            warm: "the fire could not finish this story, choose a new adventure and we will try again.",
          },
          gated: {
            warm: "this story was not ready, choose a new adventure and we will forge a completely new one.",
          },
          stuck: {
            warm: "this page cannot see the waiting fire right now, but the fire keeps forging your book on our side.",
          },
        },
      };
    ((m.sv.ready.warm = h.sv.finaleLine),
      (m.en.ready.warm = h.en.finaleLine),
      e.s(
        [
          "GLOD_COPY",
          0,
          h,
          "formatGlod",
          0,
          function (e, t) {
            return e
              .replaceAll("{names}", t.names ?? "")
              .replaceAll("{name}", t.name ?? "")
              .replaceAll("{title}", t.title ?? "")
              .replaceAll("{adventure}", t.adventure ?? "")
              .replaceAll("{companion}", t.companion ?? "");
          },
          "glodLineFor",
          0,
          function (e, t) {
            let { locale: r } = t,
              a = m[r][e],
              n = t.cold && a.cold ? a.cold : a.warm,
              s = (0, i.waitPhrase)(r),
              l = (t.heroName ?? "").trim() || h[r].fallbackName,
              o = n
                .replaceAll("{minutes}", s)
                .replaceAll("{names}", (0, u.genitive)(l, r))
                .replaceAll("{name}", l);
            return o.charAt(0).toUpperCase() + o.slice(1);
          },
        ],
        1e4,
      ));
    let g = new Set(["bundle", "media", "promotion"]);
    e.s(
      [
        "glodStateForView",
        0,
        function (e, t) {
          return "failed" === e.status ||
            "gated" === e.status ||
            "stuck" === e.status
            ? e.status
            : "pending" === e.status
              ? "forge-unavailable" === (t ?? e.health ?? "queued")
                ? "unlit"
                : "queued"
              : "done" === e.status
                ? "ready"
                : e.foundryProgress
                  ? "repair" === e.foundryProgress.phase
                    ? "making"
                    : g.has(e.foundryProgress.stage)
                      ? "nearlyReady"
                      : "making"
                  : e.activeStep >= 3
                    ? "nearlyReady"
                    : "making";
        },
      ],
      78128,
    );
  });
