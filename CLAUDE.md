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

## Architecture

Everything lives in one `<script>` block at the bottom of `index.html`,
built around a single data-driven state machine — there's no framework.

- **`STEPS`** — an array of 13 step objects (`{ ch, scene, state, title,
  why }`) that is the entire lesson script. `ch` is the chapter index,
  `scene` names which `.scene` element to show, `state` is the list of
  CSS classes that put that scene into this step's visual state, and
  `title`/`why` are the on-screen instruction text. Adding or reordering
  lesson content means editing this array, not the markup.
- **Scenes** — each chapter's visuals are a handful of `.scene` elements
  in the HTML (children rows, a paragraph, filled/unfilled lines,
  floating/stranded punctuation). Only one is `.on` (visible) at a time.
  A step doesn't build new DOM; it just toggles which scene is visible
  and which state-classes are applied to it, and CSS transitions animate
  the class change.
- **`goTo(index)`** — the only place that changes what's on screen. It
  swaps the visible scene, paints the new state (animated if staying on
  the same scene, instant if switching scenes), updates the instruction
  banner, updates chapter tabs / step dots / Back-Next button state, and
  writes the step number to `location.hash` so a step can be linked to
  directly (`#7`).
- **`paint(scene, state, animate)`** — applies state-classes to a scene,
  either normally (animated) or by forcing a reflow with the `no-anim`
  class first (used when a scene has just become visible, so it doesn't
  animate in from its "before" state).
- **`replay()`** — resets the current scene to its state *before* this
  step, then calls `goTo` again a moment later so the step's animation
  visibly replays.
- **`placeStrays()`** — the one piece of real layout math: it measures
  rendered text-box positions at runtime (so it's correct for whichever
  font actually loaded) to compute how far a "stranded" punctuation mark
  must fly to reach its word, and to shrink hand-placed lines that would
  otherwise overflow under a fallback font. Re-run on font load and
  whenever the "strand" scene is shown.
- **`fit()`** — computes a single CSS scale factor so the fixed
  1280×800 stage fits the current window/viewport, run on load, resize,
  orientation change, and fullscreen toggle.
- Chapter tabs and step dots are generated from `CHAPTERS`/`STEPS` at
  startup, not hand-written in the HTML.
- Input handling (buttons, arrow keys, number keys 1/2/3, R, F) all
  funnels into the same `goTo`/`replay`/fullscreen calls above — there's
  no separate code path for keyboard vs. mouse.

There is no server-side logic at all: the app is static files plus this
client-side state machine, cached by `sw.js` for offline use.

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

## Planned / Not Yet Built

Requested next, not yet designed or started. Flagging up front: all three
sit outside the current architecture (static files, no server, no
accounts), so each is a real scope jump, not a small addition on top of
`index.html`.

1. **Attendance-taking feature.** Needs persistent storage (a roster, and
   who was marked present, that survives across sessions/devices) — the
   app currently has zero persistence of any kind. Needs a decision on
   where that data lives (a backend + database, or a serverless/free-tier
   store like Firebase/Supabase) before any UI work starts.
2. **Google Classroom integration.** Requires registering an OAuth app
   with Google, a Classroom API integration, and (per Google's terms) a
   privacy policy and possibly a verification/review process since it'd
   touch student-roster data. This is the most involved of the three and
   the one most worth scoping carefully given it deals with student data.
3. **Turn this into a real app with teacher login, at no cost to me.**
   Needs (a) authentication and (b) a database to hold accounts and
   whatever attendance/Classroom data logins would gate — neither exists
   today, and a static GitHub Pages site can't provide either on its own.
   "Costs nothing" is achievable at small scale (e.g. Firebase
   Auth + Firestore, or Supabase, both have free tiers) but isn't free at
   unlimited scale, and it's a genuine architecture change: the app stops
   being a zero-dependency static site and gains a backend dependency.
   Worth deciding as its own project before attendance/Classroom work,
   since login would likely gate both of those features anyway.

None of these have an implementation plan yet — this section is a
placeholder for "known wanted, not yet designed" so a future session
doesn't have to be told again.

## Testing changes

There's no test suite. Verification is manual: open the lesson, step
through the affected chapter, and check at a few window sizes (the last
major change was verified at six window sizes, on both the web font and
the fallback font) that nothing scrolls, clips, or overflows the paper.
