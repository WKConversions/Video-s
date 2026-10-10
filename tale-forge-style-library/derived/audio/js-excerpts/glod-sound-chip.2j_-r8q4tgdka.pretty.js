/* VERBATIM EXCERPT (prettier-formatted) of the minified Turbopack chunk source/js/2j_-r8q4tgdka.js.
 * Formatted copy lines 1990-2075. Read-only data, quoted for reference; not executable on its own.
 * Glödvakten fire-sound chip (Eldljud / Fire sound). */
    var f = e.i(38618);
    let p = { sv: { label: "Eldljud" }, en: { label: "Fire sound" } };
    function y({ locale: e, childId: a }) {
      let [n, s] = (0, r.useState)(() => (0, f.readBedPref)(a));
      ((0, r.useEffect)(() => (0, f.claimBed)(), []),
        (0, r.useEffect)(() => {
          (0, f.syncBed)({
            bedId: n,
            volume: (0, f.readBedVol)(a),
            play: null != n,
          });
        }, [n, a]),
        (0, r.useEffect)(() => {
          if (null == n) return;
          let e = () =>
            (0, f.syncBed)({
              bedId: n,
              volume: (0, f.readBedVol)(a),
              play: !0,
            });
          return (
            window.addEventListener("pointerdown", e),
            () => window.removeEventListener("pointerdown", e)
          );
        }, [n, a]));
      let i = null != n;
      return (0, t.jsxs)("button", {
        type: "button",
        className: "chip glod-sound",
        "data-testid": "glod-sound-toggle",
        "aria-pressed": i,
        onClick: () => {
          let e = i ? null : ((0, f.readBedPref)(a) ?? f.DEFAULT_WAIT_BED);
          (s(e),
            (0, f.writeBedPref)(e, a),
            (0, f.syncBed)({
              bedId: e,
              volume: (0, f.readBedVol)(a),
              play: null != e,
            }));
        },
        children: [
          i
            ? (0, t.jsxs)("svg", {
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
              })
            : (0, t.jsxs)("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": "true",
                children: [
                  (0, t.jsx)("path", { d: "M11 5 6 9H3v6h3l5 4V5z" }),
                  (0, t.jsx)("path", { d: "m16 9 6 6M22 9l-6 6" }),
                ],
              }),
          p[e].label,
        ],
      });
    }
    function v(e) {
      return `tf-next-thread:${e}`;
    }
    function k(e, t, r) {
      let a = {
        version: 1,
        emberId: r.emberId,
        hook: r.hook.slice(0, 500),
        storyTitle: r.storyTitle.slice(0, 500),
        savedAt: new Date().toISOString(),
      };
