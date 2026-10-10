// EXCERPT (data, not for execution). Verbatim Turbopack module 77147 from source/js/1pgfdvt65g9p-.js,
// characters 36382-38276 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: AMBIENT_BEDS: six reader background sounds

(38618,
  77147,
  (e) => {
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
        },
        "clampBedVol",
        0,
        n,
        "readBedPref",
        0,
        function (e) {
          try {
            let t = localStorage.getItem(r(e));
            return a(t) ? t : null;
          } catch {
            return null;
          }
        },
        "readBedVol",
        0,
        function (e) {
          try {
            let t = localStorage.getItem(i(e));
            if (null != t) {
              let e = Number(t);
              if (Number.isFinite(e)) return n(e);
            }
          } catch {}
          return 0.18;
        },
        "syncBed",
        0,
        function (e) {
          let t =
            "u" < typeof document
              ? null
              : ((s && s.isConnected) ||
                  (((s = document.createElement("audio")).loop = !0),
                  (s.preload = "none"),
                  s.setAttribute("data-testid", "tf-bed-audio"),
                  document.body.appendChild(s)),
                s);
          if (t) {
            if (e.bedId) {
              let l = o(e.bedId);
              t.getAttribute("src") !== l && (t.src = l);
            } else t.hasAttribute("src") && t.removeAttribute("src");
            if (((t.volume = n(e.volume)), e.bedId && e.play)) {
              let e = t.play();
              e && "function" == typeof e.catch && e.catch(() => {});
            } else t.pause();
          }
        },
        "writeBedPref",
        0,
        function (e, t) {
          try {
            localStorage.setItem(r(t), e ?? "off");
          } catch {}
        },
        "writeBedVol",
        0,
        function (e, t) {
          try {
            localStorage.setItem(i(t), String(n(e)));
          } catch {}
        },
      ],
      38618,
    );
  });
