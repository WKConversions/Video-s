// EXCERPT (data, not for execution). Verbatim Turbopack module 40070 from source/js/2x2s34sgoij7z.js,
// characters 5386-8113 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: moderateInput: blocked-word list and kind-and-safe messages

(40070,
  (e) => {
    "use strict";
    let t = RegExp(
        "(?<![\\p{L}\\p{N}_])(shit|fuck|damn|hell|crap|ass|bitch|bastard|piss|dick|cock|pussy|slut|whore|kill|murder|death|dead|blood|weapon|gun|knife|fight|war|torture|stab|shoot|bomb|explode|suicide|hang|strangle|poison|sex|nude|naked|porn|erotic|sexual|intercourse|orgasm|genital|breast|penis|vagina|stupid|idiot|dumb|hate|ugly|fat|loser|retard|freak|weirdo|pathetic|worthless|disgusting|drug|cocaine|heroin|meth|marijuana|weed|alcohol|beer|wine|vodka|whiskey|cigarette|vape|fan|jävla|jävlar|helvete|skit|fitta|kuk|hora|knull|knulla|satans|förbannad|döda|mörda|blod|krig|bomba|vapen|kniv|svärdet|skjut|skjuta|sex|naken|porr|erotisk|idiot|hata|patetisk|värdelös|droger|kokain|heroin|marijuana|alkohol|öl|vin|vodka|röka|cigarett|vape)(?![\\p{L}\\p{N}_])",
        "iu",
      ),
      a = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      r = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/,
      s =
        /\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|place|pl)\b/i,
      n =
        /\b(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]|[6-9]\d)[-+]?\d{4}\b|\b\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]|[6-9]\d)[-+]\d{4}\b/,
      i =
        /<\s*(?:script|img|iframe|object|embed|form|input|link|style|svg|math|video|audio|source)\b/i,
      o =
        /\b(?:on(?:error|load|click|mouseover|focus|blur|submit|input|change))\s*=/i,
      d = /(?:javascript|data|vbscript)\s*:/i,
      l = {
        en: {
          injection:
            "Let's keep our stories kind and safe! Please use only plain text.",
          blockedWord:
            "Let's keep our stories kind and safe! Please try different words.",
          email:
            "Let's keep our stories kind and safe! Please don't include email addresses.",
          phone:
            "Let's keep our stories kind and safe! Please don't include phone numbers.",
          address:
            "Let's keep our stories kind and safe! Please don't include addresses.",
          personnummer:
            "Let's keep our stories kind and safe! Please don't include personal ID numbers.",
        },
        sv: {
          injection:
            "Vi håller sagorna snälla och trygga. Skriv gärna med vanlig text.",
          blockedWord:
            "Vi håller sagorna snälla och trygga. Prova gärna andra ord.",
          email:
            "Vi håller sagorna snälla och trygga. Ta inte med e-postadresser.",
          phone:
            "Vi håller sagorna snälla och trygga. Ta inte med telefonnummer.",
          address: "Vi håller sagorna snälla och trygga. Ta inte med adresser.",
          personnummer:
            "Vi håller sagorna snälla och trygga. Ta inte med personnummer.",
        },
      };
    e.s([
      "moderateInput",
      0,
      function (e, u = "en") {
        if (!e || "string" != typeof e) return { safe: !0 };
        let c = l[u],
          m = e.toLowerCase().trim();
        return i.test(e) || o.test(e) || d.test(e)
          ? { safe: !1, reason: c.injection }
          : t.test(m)
            ? { safe: !1, reason: c.blockedWord }
            : a.test(e)
              ? { safe: !1, reason: c.email }
              : r.test(e)
                ? { safe: !1, reason: c.phone }
                : s.test(e)
                  ? { safe: !1, reason: c.address }
                  : n.test(e)
                    ? { safe: !1, reason: c.personnummer }
                    : { safe: !0 };
      },
    ]);
  });
