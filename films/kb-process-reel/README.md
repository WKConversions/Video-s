# K.B process reel (1080x1920, 60 fps, 23 s)

A vertical reel for a K.B post on how K.B builds software: contract signed -> the agreed scope becomes clear tasks in
the project tools (generic project management, not Jira, as Karl's boss asked) -> AI agents carry them out and
validate -> what we learn updates the documentation and improves the process, double-checked by K.B -> "Do you work
differently? Message us". Karl's script and ElevenLabs VO ("Christina", 21.1 s, placed at 0.3 s); the brief asked for
about 10 s, the VO sets 23 s. New K.B brand (navy, light blue, Manrope, KB monogram on its own logo layer).

- `film/src/Reel.tsx` (the whole film), `film/src/kit.tsx` (the K.B intern films' kit), `film/src/timing.ts` (VO words).
- Motion norm 4% (Karl): met with useful motion: the tasks travel through the board, sparks, an orbiting loop, over a
  constant horizontal camera sway.
- `sound/make_cues.py` -> `sound_mix.py` (effects from Karl's library, bed Mixkit "Tears of Joy", fade ending).
- Render: `bash film/render.sh Reel reel` -> `film/out/reel-all.mp4`.
