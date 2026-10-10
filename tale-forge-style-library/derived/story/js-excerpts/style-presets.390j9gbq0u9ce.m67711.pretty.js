// EXCERPT (data, not for execution). Verbatim Turbopack module 67711 from source/js/390j9gbq0u9ce.js,
// characters 30758-32398 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: CREATE_STYLE_PRESETS (8 art styles), DEFAULT_CREATE_STYLE_ID

(67711,
  (e) => {
    "use strict";
    let t = "neon",
      r = [
        {
          id: "watercolor",
          labelEn: "Soft Watercolor",
          labelSv: "Mjuk akvarell",
          description: "Warm painted scenes like a feature animation",
          previewImageUrl: "/style-previews/create/watercolor.jpg",
        },
        {
          id: "inkaccent",
          labelEn: "New Yorker ink, one accent",
          labelSv: "New Yorker-tusch, en accent",
          description: "Bold black ink on white, one pop of color",
          previewImageUrl: "/style-previews/create/inkaccent.png",
        },
        {
          id: "comic",
          labelEn: "Comic book",
          labelSv: "Seriestil",
          description: "Punchy inked panels with action energy",
          previewImageUrl: "/style-previews/create/comic.png",
        },
        {
          id: "crayon",
          labelEn: "Crayon, drawn by a kid",
          labelSv: "Kritteckning",
          description: "Wobbly wax-crayon charm, taped to the fridge",
          previewImageUrl: "/style-previews/create/crayon.png",
        },
        {
          id: "neon",
          labelEn: "Glowing magic",
          labelSv: "Lysande magi",
          description: "Glowing neon light on any scene",
          previewImageUrl: "/style-previews/create/neon.png",
        },
        {
          id: "pixel",
          labelEn: "Retro game pixel art",
          labelSv: "Retrospel-pixel",
          description: "Chunky 16-bit pixels like a beloved old game",
          previewImageUrl: "/style-previews/create/pixel.png",
        },
        {
          id: "clay",
          labelEn: "Claymation",
          labelSv: "Lera-animation",
          description:
            "Stop-motion clay characters with fingerprints and seams",
          previewImageUrl: "/style-previews/create/clay.png",
        },
        {
          id: "screenprint",
          labelEn: "Vintage screen-print",
          labelSv: "Vintage screentryck",
          description: "1960s poster colors, bold shapes, print texture",
          previewImageUrl: "/style-previews/create/screenprint.png",
        },
      ];
    e.s([
      "CREATE_STYLE_PRESETS",
      0,
      r,
      "DEFAULT_CREATE_STYLE_ID",
      0,
      t,
      "getCreateStylePreset",
      0,
      function (e) {
        let n = r.find((e) => e.id === t);
        return e ? (r.find((t) => t.id === e) ?? n) : n;
      },
    ]);
  });
