// EXCERPT (data, not for execution). Verbatim Turbopack module 62971 from source/js/390j9gbq0u9ce.js,
// characters 29546-30758 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: generation preview record: heroName, adventureDirection, companion, styleLabel, narratorLabel, carriedEmberThread

(62971,
  (e) => {
    "use strict";
    function t(e, r = 200) {
      if ("string" != typeof e) return null;
      let n = e.trim();
      return n ? n.slice(0, r) : null;
    }
    (e.i(99026),
      e.i(67711),
      e.s([
        "generationPreviewStorageKey",
        0,
        function (e) {
          return `tf-create-preview-${e}`;
        },
        "parseStoredGenerationPreview",
        0,
        function (e) {
          var r;
          let n;
          if (!e) return null;
          try {
            n = JSON.parse(e);
          } catch {
            return null;
          }
          if (!("object" == typeof (r = n) && null !== r && !Array.isArray(r)))
            return null;
          let a = t(n.heroName),
            o = t(n.adventureDirection),
            l = t(n.companion),
            i = t(n.styleLabel),
            u = t(n.narratorLabel),
            s = null === n.carriedEmberThread ? null : t(n.carriedEmberThread);
          return a && o && l && i && u && (null === n.carriedEmberThread || s)
            ? Object.freeze({
                heroName: a,
                portraitUrl:
                  null === n.portraitUrl
                    ? null
                    : (function (e) {
                        let r = t(e, 2048);
                        if (
                          !r ||
                          /[\u0000-\u001f\u007f]/.test(r) ||
                          r.includes("\\") ||
                          /^(?:data|blob|javascript):/i.test(r)
                        )
                          return null;
                        if (/^\/(?!\/)/.test(r))
                          try {
                            let e = new URL("https://preview.tale-forge.local");
                            return new URL(r, e).origin === e.origin ? r : null;
                          } catch {
                            return null;
                          }
                        try {
                          let e = new URL(r);
                          if (
                            !["http:", "https:"].includes(e.protocol) ||
                            !e.hostname ||
                            e.username ||
                            e.password
                          )
                            return null;
                          return r;
                        } catch {
                          return null;
                        }
                      })(n.portraitUrl),
                adventureDirection: o,
                companion: l,
                styleLabel: i,
                narratorLabel: u,
                carriedEmberThread: s,
              })
            : null;
        },
      ]));
  });
