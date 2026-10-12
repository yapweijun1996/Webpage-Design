I've revised the Home page in `demo/` to the shared brief, rebuilt it, and checked it without a browser. Both check suites pass: 126/126 source and build checks, and 68/68 controller scenarios. No page has been rendered, so layout, contrast, focus order and playback still need your browser review.

**What changed (Home only)**
- **Desktop:** 32px Georgia wordmark, 16px regular-weight links, a heading capped at 72px, and a 56px gold button sharing one left edge with the text.
- **Phone:** 18px wordmark (17px with 16px side margins below 360px) and an outlined Menu/Close button fixed at 98×44px. The heading is about 39.5px at 390px, with one 52px gold button.
- **Menu (below 1120px):** a solid teal panel directly under the top bar with five 56px rows and a gold marker for the current page. It is not a dialog: no focus trap and no scroll lock (removed on Home). It closes on Escape (focus returns to Menu), a click outside, focus leaving the header, or the window widening past 1120px. On short windows the links scroll inside the panel. Opening it pauses the film and hides the pause control; closing restores the previous state, and a manual Pause or reduced-motion stop persists.
- **Code wiring:** the Home header carries its 1120px switch point and `site.js` reads it. That is a one-line JS change; inner pages fall back to their existing 1100px.

**What ran**
- **Scope:** the eight non-Home pages render byte-for-byte the same as the baseline. CSS outside the Home section is unchanged.
- **Media:** the four films and posters are identical across input, source, build and baseline (`cmp`).
- **Base path:** a build with a GitHub Pages prefix resolves every link.
- **Mutation test:** I deliberately broke the build output (removed Escape focus return; made the panel fixed and put the scroll lock back). The checks failed as they should (2 and 3 failures), and a clean rebuild passed again.
- **Layout arithmetic, not measurement:** using CSS values and assuming two heading lines and two description lines, at 390×844 the open panel ends at about 369px (brief: 360–380), the heading starts at about 513px and the button sits at 692–744px. The button stays fully on screen at 360×800 and 320×800. At 1440×900 the heading starts at about 312px and the button at about 570px.

**Not run:** any rendered viewport, including the 1119/1120 fit, the open menu at 390×844, narrow landscape and 200% text. Also not checked: actual font widths, contrast over moving frames, real Tab order, playback and loop joins, devices and screen readers. The repo's Chrome-driven scripts (`verify.mjs`, `shots.mjs`) were not run, and `verify.mjs` is already out of date for this Home page.

**Known limits:**
- On short phones like 375×667, the open menu temporarily covers the heading; the brief allows this.
- Inner pages share the controller, so they gain the same close behaviour, but their 1100px switch and scroll lock are unchanged.
- Without JavaScript, Home at 1100–1119px shows the full link row with the smaller wordmark. It works, but I haven't checked it visually.

To preview: `cd demo && npm run build && npm run serve` (local at `http://127.0.0.1:4192`). For GitHub Pages, build with `node scripts/build.mjs --base=/<repo>/`.

Files are in `evidence/`:
- design-plan.md
- self-review.md
- check-output.txt
