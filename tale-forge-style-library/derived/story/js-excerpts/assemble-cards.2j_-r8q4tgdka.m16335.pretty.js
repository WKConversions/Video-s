// EXCERPT (data, not for execution). Verbatim Turbopack module 16335 from source/js/2j_-r8q4tgdka.js,
// characters 45377-49536 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: assembleCards(): registers cozy/adventure/silly/wonder, ember/register/competency cards

(16335,
  (e) => {
    "use strict";
    let t = ["cozy", "adventure", "silly", "wonder"],
      r = {
        cozy: {
          title: { en: "A cozy adventure", sv: "Ett mysigt äventyr" },
          invitation: {
            en: "Next time, a quiet, cozy adventure close to home.",
            sv: "Nästa gång, ett lugnt och mysigt äventyr nära hemma.",
          },
        },
        adventure: {
          title: { en: "A big adventure", sv: "Ett stort äventyr" },
          invitation: {
            en: "Next time, a bigger adventure out in the world.",
            sv: "Nästa gång, ett större äventyr ute i världen.",
          },
        },
        silly: {
          title: { en: "A silly adventure", sv: "Ett larvigt äventyr" },
          invitation: {
            en: "Next time, a silly, laugh-out-loud adventure.",
            sv: "Nästa gång, ett larvigt äventyr att skratta åt.",
          },
        },
        wonder: {
          title: {
            en: "A wonder-filled adventure",
            sv: "Ett underbart äventyr",
          },
          invitation: {
            en: "Next time, an adventure full of wonder and magic.",
            sv: "Nästa gång, ett äventyr fullt av under och magi.",
          },
        },
      };
    function a(e, r) {
      let a = ((e.shelf.length % t.length) + r) % t.length;
      return t[a];
    }
    let n = {
      cozy: {
        en: "Same hero, new mood: pick this and the next book turns calm and snug.",
        sv: "Samma hjälte, ny stämning: väljer ni det här blir nästa bok stilla och trygg.",
      },
      adventure: {
        en: "Same hero, new mood: pick this and the next book turns bold and wild.",
        sv: "Samma hjälte, ny stämning: väljer ni det här blir nästa bok modig och vild.",
      },
      silly: {
        en: "Same hero, new mood: pick this and the next book turns silly and full of giggles.",
        sv: "Samma hjälte, ny stämning: väljer ni det här blir nästa bok tokig och full av fniss.",
      },
      wonder: {
        en: "Same hero, new mood: pick this and the next book fills with quiet magic.",
        sv: "Samma hjälte, ny stämning: väljer ni det här fylls nästa bok av stilla magi.",
      },
    };
    function s(e, t, s, i) {
      let l = i ?? a(e, s),
        o = r[l];
      return {
        id: `register:${l}:${s}`,
        kind: "register",
        title: o.title[t],
        invitation: o.invitation[t],
        whyLine: n[l][t],
        register: l,
      };
    }
    function i(e, t, r, n) {
      let s = e.shelf.length > 0 ? e.shelf[e.shelf.length - 1].band : "A",
        i = n ?? a(e, r),
        l = e.child?.firstName?.trim() ?? "",
        o = e.shelf.length > 0 || e.skills.length > 0,
        d = (e) => (l ? (e ? ` f\xf6r ${l}` : ` for ${l}`) : ""),
        c = o
          ? "sv" === t
            ? `N\xe4sta steg${d(!0)}, valt f\xf6r att bygga vidare p\xe5 sagan.`
            : `The next step${d(!1)}, chosen to build on the story so far.`
          : "sv" === t
            ? `Ett f\xf6rsta steg${d(!0)}, sparat till n\xe4sta bok.`
            : `A first step${d(!1)}, saved for the next book.`;
      return {
        id: `competency:${s}:${r}`,
        kind: "competency",
        title: "sv" === t ? "En saga steg längre" : "A story one step further",
        invitation:
          "sv" === t
            ? "Nästa saga smyger in något nytt att öva, mitt i äventyret."
            : "The next story tucks something new to practice inside the adventure.",
        whyLine: c,
        register: i,
      };
    }
    function l(e) {
      return (
        /[åäö]/i.test(e) ||
        /\b(och|att|det|som|hon|han|inte|är|en|ett)\b/i.test(e)
      );
    }
    function o(e, t, r, n) {
      let s = n ?? (r ? a(r, 2) : void 0),
        i = "sv" === t ? l(e.hook) : !l(e.hook),
        o = "sv" === t ? l(e.storyTitle) : !l(e.storyTitle),
        d = i
          ? "sv" === t
            ? `Ur er f\xf6rra saga: "${e.hook}"`
            : `From your last story: "${e.hook}"`
          : "sv" === t
            ? "En tråd från er förra saga kan bli nästa bok."
            : "A thread from your last story could become the next book.",
        c = o
          ? "sv" === t
            ? `H\xe4mtad ur "${e.storyTitle}". V\xe4ljer ni det h\xe4r v\xe4xer n\xe4sta bok ur just den tr\xe5den.`
            : `Drawn from "${e.storyTitle}". Pick this and the next book grows from that very thread.`
          : "sv" === t
            ? "Hämtad ur er förra saga. Väljer ni det här växer nästa bok ur just den tråden."
            : "Drawn from your last story. Pick this and the next book grows from that very thread.";
      return {
        id: `ember:${e.id}`,
        kind: "ember",
        title:
          "sv" === t ? "En saga som spinner vidare" : "A story that carries on",
        invitation: d,
        whyLine: c,
        ...(s ? { register: s } : {}),
        highlighted: !0,
      };
    }
    e.s([
      "assembleCards",
      0,
      function (e, r) {
        let n = r?.locale ?? "en",
          l = [...new Set(r?.completionSignal?.preferredRegisters ?? [])]
            .filter((e) => t.includes(e))
            .slice(0, 2);
        if (l.length > 0) {
          let r = (function (e, r) {
              let n = t.map((t, r) => a(e, r));
              if (0 === r.length) return [n[0], n[1], n[2]];
              let s = n.find((e) => !r.includes(e));
              if (1 === r.length) {
                let e = n.find((e) => e !== r[0] && e !== s);
                return [r[0], s, e];
              }
              return [r[0], s, r[1]];
            })(e, l),
            d = e.embers.length > 0 ? e.embers[e.embers.length - 1] : void 0;
          return d
            ? [o(d, n, e, r[0]), s(e, n, 0, r[1]), i(e, n, 1, r[2])]
            : [s(e, n, 0, r[0]), s(e, n, 1, r[1]), i(e, n, 2, r[2])];
        }
        let d = s(e, n, 0),
          c = e.embers.length > 0 ? e.embers[e.embers.length - 1] : void 0;
        return c ? [o(c, n, e), d, i(e, n, 1)] : [d, s(e, n, 1), i(e, n, 2)];
      },
      "buildEmberCard",
      0,
      o,
      "looksSwedish",
      0,
      l,
    ]);
  });
