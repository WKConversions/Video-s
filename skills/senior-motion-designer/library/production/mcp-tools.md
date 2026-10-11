# MCP tools

The MCP servers Karl installed (October 2026), what each is for in a film, and how to reach them. They add to the
skill's own scripts; they replace none of them.

## Reaching them

- **Native:** a session started after a server was added has its tools as `mcp__<server>__<tool>`. Use those first.
- **Bridge:** a session started before (Claude Code loads servers only at session start), or a script, calls them
  through `scripts/mcp_call.py`, which reads the same configuration (`~/.claude.json`, the repository's `.mcp.json`):
  - `python3 mcp_call.py list` the servers
  - `python3 mcp_call.py tools <server>` a server's tools and their input fields
  - `python3 mcp_call.py call <server> <tool> '<json>'` one call; prints the text answer
  - `python3 mcp_call.py login <server> [scopes]` sign-in for a server that answers 401: prints a link for Karl to
    approve in his own browser and keeps the token outside the repository (`~/.claude/mcp_tokens`, mode 600)
- Each bridge call starts a fresh server process, so tools that keep state between calls (a browser page, an edit
  timeline) need all their steps in one call; use them natively for multi-step work.
- The configuration lives on the machine, not in the repository; a new machine needs the servers added again (the
  commands are at the end).

## What each is for

| Server | Use it for | Step |
|---|---|---|
| `video-extract` | **Reading a reference video, a local file or a URL** (YouTube, Vimeo, X, a page): `resolve_video` first (what it is, its length, nothing downloaded), then `analyze_video` for the transcript and deduplicated key frames, or `frames: "even"` with `maxFrames` for an even sampling of a range. Then measure with the skill's own tools (`motion_check.py`, `ref_lookup.py`). Never set `userCookies` without asking Karl first. | references, step 6, critique |
| `exa` | Web search and page reading as clean text: a client's market, competitors' films, a fact to check before a claim, a royalty-free source. Read the page; never take a claim from a search snippet alone. | 1, 2, 6, 10 |
| `context7` | Current documentation for a library before writing code against it: `resolve-library-id` (e.g. `remotion`, `three.js`, `react-three-fiber`, `drei`), then `query-docs`. Use it when an API in a build is new to the session, or a render fails on an API. | 14 |
| `playwright` | A real browser: harvesting a client's site (colours, type, logo, interface, screenshots at exact sizes), capturing an online reference's frames inside its page, checking the published storyboard page. It complements `site_extract.js`, `grab.js` and `reference_frames.js`. | 2, 10, references |
| `makemyclip` | A local timeline editor with its own FFmpeg (workspace `MAKEMYCLIP_WORKSPACE`): a quick rough cut of delivered pieces, a cut-down (a 15-second version from a 30), stringing renders with a title card. Never the main build: films are designed and animated in Remotion or After Effects. | 14, delivery |
| `memory` | A small knowledge graph on this machine: a client's facts and choices across sessions (brand values, the approved style, what was delivered). Karl's rules stay in `examples/corrections.md`, the source of truth; memory is a cache, never a second rulebook. | 1, 16 |
| `sequential-thinking` | A scratchpad for thinking step by step through a hard planning problem (a film's structure, a revision touching many scenes). Optional; the workflow's own steps come first. | 3–12 |
| `motion` | Mosaic Motion (motion.so), a paid AI text-to-video service; Karl's account, his credits. Only when Karl asks for it on a film, never by default: say what a job will cost in credits before starting one, and treat what comes back as raw material that must fit the film's art direction (core laws), not as the film. The bridge signs in without the purchase and account-management permissions. Tools: `create_video` (a prompt, aspect ratio, duration, a style reference and attachments uploaded with `upload_asset`), `create_followup`, `job_status`, `get_credit_balance`. Never call `purchase_credits`, `subscribe_to_plan`, `set_auto_topup`, `setup_payment_method`, `create_api_key`, `revoke_api_key` or `register_service_account`: those are Karl's to do himself. | only on request |

## Rules

- **Free and local first.** Everything above runs locally or free except `motion` (credits). Don't add API keys or
  paid plans; ask Karl before anything costs money.
- **Truth still holds.** A search result or a transcript is a source to check, not a fact to put in a film.
- **Licences still hold.** Downloaded reference videos are for study only, never in a client film; footage for a
  film comes through the royalty-free sourcing in `design/asset-strategy.md`.
- **Credentials:** OAuth sign-ins go through the person's own browser; nothing secret goes in the repository.

## Setting up a machine

Install the local servers once, at fixed versions, and start them directly: `npx -y …@latest` checks the registry
on every start, and behind a slow proxy that can pass Claude Code's 30-second connect limit (the server then
shows as "failed to connect" for the whole session).

```
npm i -g @playwright/mcp@0.0.83 @makemyclip/editor@0.3.0 @modelcontextprotocol/server-memory@2026.8.31 @modelcontextprotocol/server-sequential-thinking@2026.8.31 @yanlinglabs/video-extract-mcp@0.16.2
claude mcp add --scope user playwright -- playwright-mcp --headless --isolated --executable-path /opt/pw-browsers/chromium --no-sandbox
claude mcp add --scope user video-extract -- video-extract-mcp
claude mcp add --scope user makemyclip -e MAKEMYCLIP_WORKSPACE=$HOME/makemyclip-workspace -- clip mcp
claude mcp add --scope user memory -- mcp-server-memory
claude mcp add --scope user sequential-thinking -- mcp-server-sequential-thinking
claude mcp add --scope user --transport http exa https://mcp.exa.ai/mcp
claude mcp add --scope user --transport http context7 https://mcp.context7.com/mcp
claude mcp add --scope user --transport http motion https://mcp.motion.so/mcp
```

- `video-extract` downloads a runtime from nuget.org while installing; if that download drops, retry, or copy a
  working install (from npx's cache, `~/.npm/_npx/*/node_modules`) and start `node …/video-extract-mcp/dist/mcp.js`.
- `video-extract` needs `ffprobe` on the PATH. A machine with Remotion but no ffprobe can use Remotion's bundled one
  (`node_modules/@remotion/compositor-linux-x64-gnu/ffprobe`, with that folder on `LD_LIBRARY_PATH`) through a
  small wrapper script.
- `playwright` uses the machine's Chromium (`--executable-path`); behind a proxy that inspects HTTPS, the browser's
  certificate store must hold the proxy's current certificate, or pages fail with `ERR_CERT_AUTHORITY_INVALID`.
- `motion` signs in with `/mcp` in an interactive Claude Code session, or `mcp_call.py login motion` (the bridge
  renews its token by itself).
- Check with `claude mcp list` (all "Connected"; `motion` needs its sign-in) and one `tools` call per server.
