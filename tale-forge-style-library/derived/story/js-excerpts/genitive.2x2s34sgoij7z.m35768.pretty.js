// EXCERPT (data, not for execution). Verbatim Turbopack module 35768 from source/js/2x2s34sgoij7z.js,
// characters 5275-5386 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: genitive(): Swedish/English possessive helper used in story copy

(35768,
  (e) => {
    "use strict";
    e.s([
      "genitive",
      0,
      function (e, t) {
        return "en" === t ? `${e}'s` : /[sxz]$/i.test(e) ? e : `${e}s`;
      },
    ]);
  });
