// EXCERPT (data, not for execution). Verbatim Turbopack module 99026 from source/js/390j9gbq0u9ce.js,
// characters 32398-33783 of the single-line minified file (UTF-8 decoded string index).
// Wrapped in parentheses and formatted with prettier 3 for reading; no other change.
// Content: CREATE_VOICES (4 narrators), DEFAULT_CREATE_VOICE_ID

(99026,
  (e) => {
    "use strict";
    let t = [
      {
        id: "grandpa",
        nameEn: "Grandpa Erik",
        nameSv: "Morfar Erik",
        descriptionEn: "A warm, wise storyteller with a cozy bedtime voice",
        descriptionSv: "En varm, vis berättare med en mysig godnattstämma",
        sampleUrl: "/voices/grandpa.mp3",
        sampleUrlEn: "/voices/grandpa-en.mp3",
        portraitUrl: "/voices/portrait-grandpa.jpg",
      },
      {
        id: "female",
        nameEn: "Storyteller Lily",
        nameSv: "Berättaren Lily",
        descriptionEn: "A bright, expressive narrator full of wonder",
        descriptionSv: "En livfull, uttrycksfull berättare fylld av förundran",
        sampleUrl: "/voices/female.mp3",
        sampleUrlEn: "/voices/female-en.mp3",
        portraitUrl: "/voices/portrait-female.jpg",
      },
      {
        id: "male",
        nameEn: "Narrator Marcus",
        nameSv: "Berättaren Marcus",
        descriptionEn: "A steady, adventurous voice for exciting tales",
        descriptionSv: "En trygg, äventyrlig röst för spännande berättelser",
        sampleUrl: "/voices/male.mp3",
        sampleUrlEn: "/voices/male-en.mp3",
        portraitUrl: "/voices/portrait-male.jpg",
      },
      {
        id: "young",
        nameEn: "Young Saga",
        nameSv: "Unga Saga",
        descriptionEn: "An enthusiastic young voice that feels like a friend",
        descriptionSv: "En entusiastisk ung röst som känns som en kompis",
        sampleUrl: "/voices/young.mp3",
        sampleUrlEn: "/voices/young-en.mp3",
        portraitUrl: "/voices/portrait-young.jpg",
      },
    ];
    (t.map((e) => e.id),
      e.s([
        "CREATE_VOICES",
        0,
        t,
        "DEFAULT_CREATE_VOICE_ID",
        0,
        "grandpa",
        "voiceSampleUrl",
        0,
        function (e, t) {
          return "en" === t ? e.sampleUrlEn : e.sampleUrl;
        },
      ]));
  });
