// EXCERPT (data, not for execution). Verbatim Turbopack module 33570 from source/js/390j9gbq0u9ce.js,
// characters 33844-35179 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: defaultDraft(): ageBand B default, tf-start-draft storage

(33570,
  (e) => {
    "use strict";
    var t = e.i(62971);
    let r = "tf-start-draft";
    function n() {
      return { ageBand: "B", currentScreen: "s0" };
    }
    function a() {
      try {
        return void 0 === globalThis.localStorage
          ? null
          : globalThis.localStorage;
      } catch {
        return null;
      }
    }
    let o = null,
      l = null,
      i = "tf-start-landed-at";
    e.s([
      "INFLIGHT_COOKIE",
      0,
      "tf-start-inflight",
      "clearDraft",
      0,
      function () {
        try {
          a()?.removeItem(r);
        } catch {}
      },
      "defaultDraft",
      0,
      n,
      "draftSnapshot",
      0,
      function () {
        let e;
        try {
          e = a()?.getItem(r) ?? null;
        } catch {
          e = null;
        }
        return (
          (null === l || e !== o) &&
            ((o = e),
            (l = (function () {
              try {
                let e = a()?.getItem(r);
                if (!e) return n();
                let o = JSON.parse(e);
                if ("object" != typeof o || null === o || Array.isArray(o))
                  return n();
                let l = { ...n(), ...o },
                  i = l.generationPreview
                    ? (0, t.parseStoredGenerationPreview)(
                        JSON.stringify(l.generationPreview),
                      )
                    : null;
                return { ...l, generationPreview: i ?? void 0 };
              } catch {
                return n();
              }
            })())),
          l
        );
      },
      "elapsedSinceLanding",
      0,
      function () {
        try {
          let e = globalThis.sessionStorage.getItem(i);
          if (!e) return;
          let t = Number(e);
          if (!Number.isFinite(t) || t <= 0) return;
          return Math.max(0, Date.now() - t);
        } catch {
          return;
        }
      },
      "markLandedAt",
      0,
      function () {
        try {
          let e = globalThis.sessionStorage;
          e.getItem(i) || e.setItem(i, String(Date.now()));
        } catch {}
      },
      "saveDraft",
      0,
      function (e) {
        let t = a();
        if (!t) return !1;
        for (let n of [
          e,
          { ...e, portraitBase64: void 0 },
          { ...e, portraitBase64: void 0, photoBase64: void 0 },
        ])
          try {
            return (t.setItem(r, JSON.stringify(n)), !0);
          } catch {}
        return !1;
      },
    ]);
  });
