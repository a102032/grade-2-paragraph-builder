# Grade 2 Paragraph Builder

An interactive whiteboard lesson that shows Grade 2 students **why** writing is
shaped the way it is — not just that the rules exist.

It runs as an installable Progressive Web App, so once it has been opened once
it works with no internet connection at all.

**Live lesson:** https://a102032.github.io/grade-2-paragraph-builder/

---

## The three lessons

| Chapter | Steps | The idea |
| --- | --- | --- |
| **1 · Indent** | 1–5 | Three groups of children are standing in rows. You cannot tell the groups apart until the first row of each group steps back — that step back is an indent. Steps 4–5 repeat the discovery with a real three-paragraph story. |
| **2 · Full Lines** | 6–9 | Lines that begin in random places make the reader hunt for the start of every line; only the *first* line is indented and every other one begins at the red wall. Then: stopping early chops the sentence into pieces, so write to the green wall and sweep back to the left. |
| **3 · Punctuation** | 10–11 | The periods float away from their sentences and suddenly look like they belong to the *next* sentence. Snapping them back against the last letter shows exactly where a reader should stop and take a breath. |

Each step animates one idea. Nothing moves until you press **Next**, so you can
talk over it for as long as the class needs.

## Using it in class

- **Next / Back** — the big buttons, or <kbd>→</kbd> / <kbd>←</kbd> / <kbd>Space</kbd>
- **Jump to a chapter** — the tabs at the top, or <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>
- **Replay this step's animation** — the ↻ button, or <kbd>R</kbd>
- **Full screen** — the ⛶ button, or <kbd>F</kbd>
- **Teacher notes** — the **?** button
- **Link straight to a step** — add `#7` to the URL

The whole lesson is laid out once at 1280×800 and then scaled to fit the
window, so it never scrolls, the buttons are never off screen, and a line of
writing always wraps in the same place — on a laptop, a tablet, or a 75-inch
smartboard.

## Installing it as an app

Open the live link, then:

- **Chrome / Edge (desktop)** — click the install icon in the address bar, or
  ⋮ → *Cast, save and share* → *Install page as app…*
- **iPad / iPhone (Safari)** — Share → *Add to Home Screen*
- **Android (Chrome)** — ⋮ → *Add to Home screen*

After the first load it is cached, so it opens instantly and works offline.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole lesson — markup, styles and script in one file, no build step and no runtime dependencies |
| `manifest.json` | PWA metadata: name, colours, icons |
| `sw.js` | Service worker: pre-caches the app, caches the web font on first online load |
| `icon.svg` | Vector source for the icon |
| `icon-192.png`, `icon-512.png` | App icons |
| `icon-maskable-512.png` | Icon with safe-zone padding for Android adaptive icons |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

The only network request the lesson makes is for the Nunito web font, and it
falls back to a system font if that is unavailable, so a cold offline start
still looks right.

## Running it locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Serve it over HTTP rather than opening `index.html` directly — service workers
do not register from `file://` URLs.

## Hosting on GitHub Pages

Settings → Pages → **Source: Deploy from a branch**, branch `main`, folder
`/ (root)`.
