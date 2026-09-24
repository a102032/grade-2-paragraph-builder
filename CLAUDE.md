# Grade 2 Paragraph Builder

## What this is

A single-page, offline-capable Progressive Web App that teaches a
whiteboard lesson to Grade 2 students on *why* paragraph formatting rules
exist (indents, filling lines, keeping punctuation attached to its word) —
not just that they exist. It's meant to be projected on a smartboard and
stepped through live in class.

Live site: https://a102032.github.io/grade-2-paragraph-builder/

The lesson is 13 steps across 3 chapters:

1. **Indent** (steps 1–5) — rows of children stepping back to show what an
   indent visually signals, then the same idea shown in a real paragraph.
2. **Full Lines** (steps 6–9) — every line but the first starts at the left
   margin; sentences fill each line to the right margin and simply
   continue past a period rather than starting a new line.
3. **Punctuation** (steps 10–13) — end punctuation must not be stranded
   alone at the start of a line or float away mid-line from the word it
   belongs to.

Nothing animates until the teacher presses **Next**, so a step can be
talked over for as long as needed.

## Files

- `index.html` — the entire app: markup, CSS, and JS in one file. No build
  step, no dependencies, no bundler. This is the only file that changes
  for lesson content/behavior edits.
- `manifest.json` — PWA metadata (name, theme colors, icons).
- `sw.js` — service worker; pre-caches the app shell and caches the Nunito
  web font on first online load so the lesson works fully offline after
  that.
- `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` —
  app icons (maskable variant has safe-zone padding for Android).
- `.nojekyll` — tells GitHub Pages to serve files as-is (no Jekyll
  processing).
- `README.md` — user/teacher-facing docs (controls, installing as an app,
  local dev, GitHub Pages hosting). Keep this in sync with `index.html`
  when lesson behavior changes.

There is no build system and no package.json — this is intentionally a
zero-dependency static site.

## Key decisions / constraints to respect

- **Single file for the app.** `index.html` holds structure, style, and
  script together on purpose — no framework, no bundler. Don't introduce
  a build step or split it into modules unless explicitly asked.
- **Fixed 1280×800 design, scaled to fit.** The whole lesson is laid out
  once at that resolution and CSS-scaled to the viewport, so nothing ever
  scrolls or clips, and line-wrapping is identical on a laptop, tablet,
  or 75" smartboard. Any new scene/step must fit inside that canvas.
- **Must work fully offline after first load.** The service worker
  pre-caches the app shell; the only network dependency is the Nunito
  web font, which has a system-font fallback. Don't add new external
  requests without also handling the offline/fallback case.
- **`text-indent` is inherited and punctuation marks are inline-blocks** —
  a past bug had punctuation elements re-applying the paragraph's indent
  inside their own boxes. Watch for this when touching indent/punctuation
  CSS.
- **`.scene` needs an explicit min-width.** Grid's default
  `min-width: auto` let an overlong line silently widen the scene past
  the paper edge instead of overflowing visibly (where it'd be caught).
  Keep an explicit min-width set.
- **Hand-placed lines (fixed pixel positions) must not wrap**; they're
  scaled down to fit under a fallback font rather than clipped, and that
  pass must repeat since the paragraph indent is a fixed width that
  doesn't shrink with the font.
- Served via `python3 -m http.server` for local dev — service workers
  don't register from `file://`, so always test over HTTP.
- Deployed via GitHub Pages, source = branch `main`, root folder.

## Testing changes

There's no test suite. Verification is manual: open the lesson, step
through the affected chapter, and check at a few window sizes (the last
major change was verified at six window sizes, on both the web font and
the fallback font) that nothing scrolls, clips, or overflows the paper.
