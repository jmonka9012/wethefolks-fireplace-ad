# Fireplace Ad — Variant B

A three-part desktop ad built with HTML, SCSS and vanilla JavaScript.
The top creative is 1032 × 250 px; each side is 320 × 975 px.
These are the fixed desktop sizes from the brief. On smaller screens, the preview scrolls horizontally; there is no separate mobile layout.

## Run locally

Requires Node.js 22+ and Python 3.

```sh
npm install
npm start
```

Open [the preview](http://127.0.0.1:5173/preview.html).
Each creative can also be opened separately: `top.html`, `left.html`, `right.html`.

For SCSS changes, run `npm run watch:css` in a second terminal.
Generated CSS is included in the repository.
`npm run check` checks JavaScript syntax and compiles SCSS.

The preview provides **Reload ads** and a **prefers reduced motion** checkbox.

## With more time

- Test more browsers, operating systems and viewport sizes.
- Experiment with alternative animation sequences and easing.
- Separate the product packshots from the background to allow more detailed, independent animation.

## Known issues

- CTA corner cropping is approximate and may differ slightly from the reference.
- The supplied `assets/top/hl.png` has different wording from `design/layout.png`. Both files were verified against the upstream originals; the supplied artwork was kept unchanged.
- I noticed the requirement for incremental commits only partway through the task. This was my oversight; the earlier stages were committed retrospectively.

## AI assistance

Codex helped with the initial scaffold, documentation and a substantial part of the implementation based on my animation direction. I reviewed and iterated on the result.
One correction: using `screen` blending on the blue panels made them too transparent; this was replaced with CSS clipping and shared opacity for each panel and its text.

In my opinion, AI rarely does something incorrectly. It fills the blanks and it does so without reading your mind, it's bound to be mistaken eventually if you are not specific in what you ask of it.
