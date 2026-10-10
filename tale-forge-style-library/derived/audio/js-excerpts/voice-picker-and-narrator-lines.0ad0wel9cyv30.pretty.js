/* VERBATIM EXCERPT (prettier-formatted) of the minified Turbopack chunk source/js/0ad0wel9cyv30.js.
 * Formatted copy lines 535-545, 588-606, 2195-2215, 2268-2320, 2536-2545. Read-only data, quoted for reference; not executable on its own.
 * Start flow: narrator first-person lines, enqueue body with narratorPersona, voice picker that plays the sample in the book language, recipe line. */
          lede: "Hjälten är klar. Välj en dörr så skrivs första boken, den tar {time}.",
          sheetHeading: "Redo att tända glöden?",
          pickedLead: "Vi valde:",
          sheetBody:
            "bok skrivs, målas och läses in när ni trycker på Sätt igång. Det tar {time}, och ni kan stänga sidan under tiden. Boken lägger sig i bokhyllan när den är klar.",
          storyteller:
            "Vilken hjälte ni har byggt. Jag börjar berätta så fort ni säger till.",
          companionHeading: "Vem följer med?",
          companionHelper:
            "Berättelsen väljer vem som följer med om ni inte väljer någon.",
          ignite: "Sätt igång",
/* ... */
      ea = e.i(62971);
    let er = {
        sv: {
          headingTail: "saga växer fram.",
          headingGeneric: "Sagan växer fram.",
          reads: "läser",
          voiceLineLead: "Jag skriver, målar och övar på att säga",
          voiceLineTail: "precis rätt.",
          lostTrace:
            "Den här skärmen tappade bokens spår, men boken är kvar och lägger sig i bokhyllan när den är klar.",
          lostTraceLink: "Tillbaka till skapandet",
        },
        en: {
          headingTail: "story is taking shape.",
          headingGeneric: "The story is taking shape.",
          reads: "reads",
          voiceLineLead: "I am writing, painting, and practicing saying",
          voiceLineTail: "just right.",
          lostTrace:
/* ... */
            $ = async () => {
              if (N || !j) return;
              let t = e.childId;
              if (!t) return void C("generic");
              (I(!0), C(null));
              try {
                var a = await (0, u.backendFetch)("/create/enqueue", {
                  method: "POST",
                  body: {
                    childId: t,
                    ageBand: e.ageBand,
                    language: m,
                    stylePresetId: p,
                    narratorPersona: g,
                    ...(j.surprise
                      ? {}
                      : j.card.premiseId
                        ? {
                            premiseId: j.card.premiseId,
                            ...(j.card.domainId
                              ? { domainId: j.card.domainId }
/* ... */
                    style: {
                      label: "sv" === s ? v.labelSv : v.labelEn,
                      thumbUrl: v.previewImageUrl,
                    },
                    voice: {
                      label: "sv" === s ? k.nameSv : k.nameEn,
                      thumbUrl: k.portraitUrl,
                    },
                    language: { label: "sv" === m ? "svenska" : "English" },
                    companion: y && x ? { label: x } : null,
                    companionAdd: !!x,
                    renderStylePicker: () =>
                      (0, t.jsx)(Y.StylePicker, {
                        selectedId: p,
                        onSelect: (e) => n({ style: e }),
                        locale: s,
                      }),
                    renderVoicePicker: () =>
                      (0, t.jsx)("div", {
                        className: "voices",
                        children: q.CREATE_VOICES.map((e) => {
                          let a = e.id === g;
                          return (0, t.jsxs)(
                            "button",
                            {
                              type: "button",
                              className: a ? "trait voice on" : "trait voice",
                              "aria-pressed": a,
                              onClick: () =>
                                ((e) => {
                                  n({ voice: e.id });
                                  try {
                                    F.current?.pause();
                                    let t = new Audio(
                                      (0, q.voiceSampleUrl)(e, m),
                                    );
                                    ((F.current = t),
                                      t.play()?.catch?.(() => {}));
                                  } catch {}
                                })(e),
                              children: [
                                (0, t.jsx)("svg", {
                                  viewBox: "0 0 24 24",
                                  fill: "currentColor",
                                  "aria-hidden": "true",
                                  children: (0, t.jsx)("path", {
                                    d: "M7 4.5l12 7.5-12 7.5z",
                                  }),
                                }),
                                "sv" === s ? e.nameSv : e.nameEn,
                              ],
                            },
                            e.id,
/* ... */
            },
            u = e.generationPreview ?? null,
            p = u
              ? "sv" === s
                ? `${u.adventureDirection} f\xf6r ${u.heroName} och ${u.companion}, i ${u.styleLabel.toLowerCase()}. ${u.narratorLabel} ${o.reads}.`
                : `${u.adventureDirection} for ${u.heroName} and ${u.companion}, in ${u.styleLabel.toLowerCase()}. ${u.narratorLabel} ${o.reads}.`
              : null;
          return (0, t.jsx)("section", {
            "data-testid": "start-screen-s7",
            className: "start-screen",
