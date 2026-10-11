# Tool requests

The skill runs in sessions with different tools. Before planning a step that needs one, check what the
session actually has. Never pretend a tool exists, and never describe a search, download, generation
or render as done when it wasn't. When a step needs a tool the session lacks, write a structured
request that a person or a future tool can execute, continue with the step's fallback, and list the
request in the storyboard.

## What sessions usually have

- **A shell** with ffmpeg, Python and Node: frame extraction, crops and resizes, contact sheets, the
  motion check, the coded render (`scripts/`).
- **A browser tool,** when present: screenshots, website harvesting, downloads from inside a page,
  frames from online video.
- **Web search and fetch,** when present: pages as text, not image files.
- **Artifact publishing,** when present: the storyboard page, and this library.

Image search, stock footage search, image generation, background removal and After Effects automation
are available only when the session lists a tool for them.

## Request format

One JSON object per request, collected in `requests.json` in the project folder and shown in the
storyboard's tool-request section. When a tool is available, write the request anyway, execute it, and
record the result, so every asset has a traceable source.

```json
{
  "id": "R07",
  "type": "image_search",
  "scene": 7,
  "asset_id": "S07-A",
  "status": "requested",
  "purpose": "Gives the booking speed a human, emotional context.",
  "input": {
    "asset_type": "Photo cut-out",
    "search_query": "woman relaxed on sofa using smartphone smiling bright living room",
    "subject": "Adult patient at home",
    "action": "Tapping her phone, relaxed",
    "composition": "Full body or three-quarter, clean edges for cut-out",
    "subject_position": "Left third",
    "lighting": "Soft daylight",
    "mood": "Relieved, calm",
    "color_characteristics": "Warm neutrals",
    "camera_angle": "Eye level",
    "aspect_ratio": "any",
    "crop_requirements": "Must survive a 9:16 crop around her",
    "license": "commercial use"
  },
  "output": { "path": "assets/S07-A.png", "min_size": "2000 px tall" },
  "acceptance": ["licensed for commercial use", "not presented as a real customer"],
  "fallback": "Only the phone, held by a simple hand illustration, launches the card.",
  "result": null
}
```

- **status:** `requested`, then `fulfilled` (with `result`: file path, source URL, license) or
  `fallback` (with `result`: what the scene became).
- **input:** an asset request (`design/asset-strategy.md`) becomes the input of an `image_search`,
  `stock_footage_search` or `image_generation` request field for field, with the field names in
  snake_case, so a search tool can consume it without rewriting.

## Types

| Type | Input |
|---|---|
| `image_search` | the asset-request fields |
| `stock_footage_search` | the asset-request fields, plus duration, camera motion, frame rate and resolution |
| `image_download` | url, source page, license note |
| `screenshot` | url, region or selector, viewport, scroll position, what to wait for |
| `image_generation` | prompt, what to avoid, aspect ratio, the chosen style's constraints; illustrative only, never proof |
| `image_crop` | source, subject or box, target aspect ratio and size |
| `background_removal` | source, subject, edge quality, transparent output |
| `frame_extraction` | video, times or sampling rate, size |
| `video_render` | page or project, frame range, size, frame rate, blur samples |
| `video_inspection` | video or frames, and which pass of `evaluation/quality-check.md` to run |
| `ae_automation` | project, composition, and operations (layers, keyframes, expressions) from the scene spec and BUILD NOTES |

## New tools

The MCP servers in `production/mcp-tools.md` fulfil several request types directly: `video-extract` for
`frame_extraction` and reading a reference video, `playwright` for `screenshot` and the site harvest, `exa` for
research, `makemyclip` for a rough cut. Reach them natively or through `scripts/mcp_call.py`.

When a new tool becomes available, note here which request types it fulfils and its limits, and ask
Karl to republish the library. The request format stays the same, so earlier requests stay executable.
