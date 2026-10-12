# Actual Website Controlled Animation — Results

Evaluated on 2026-10-12. Both native CLIs completed the authorized Home integration in independent copies of their own round-5 websites. **Implementation and exercised acceptance checks are complete; user design acceptance remains pending.** This report evaluates the actual sites, separately from the earlier standalone animation study.

## Deliveries and reproducibility

| | Codex | Claude |
| --- | --- | --- |
| CLI | Codex 0.162.1 | Claude Code 2.1.289 |
| Exact requested model | `gpt-6.1-sol` | `claude-opus-5-5` |
| Model evidence | Local catalog match, explicit argument and successful turn; serving-model identity not exposed in JSON | Actual initialization exposes `claude-opus-5-5`; only Read/Edit/Write/Bash, no MCP |
| Effort | Explicit xhigh, preserving the configured setting | Native default; effort not exposed |
| Native run | Exit 0; 1,009.18 seconds | Exit 0; 446.69 seconds |
| Implementation | [Codex workspace](../../round-6-animation/codex/README.md) | [Claude workspace](../../round-6-animation/claude/README.md) |
| Source/build | Python `demo/build.py`, `home-motion.css`, `home-motion.js`; output `demo/public/` | Native Node `demo/src/`, `demo/scripts/build.mjs`; output `demo/dist/` |
| Exact owned PNG | `demo/assets/hero-angelfish.png` → `public/assets/hero-angelfish.png` | `demo/assets/motion/hero-angelfish.png` → `dist/assets/motion/hero-angelfish.png` |
| Actual local site | [127.0.0.1:4231](http://127.0.0.1:4231/) | [127.0.0.1:4232](http://127.0.0.1:4232/) |

Both source images are exactly 2,205,920 bytes, 1882×836, SHA-256 `8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1`. They are the supplied AI illustration, not verified real-company inventory. Both keep the full frame and stationary fish, fins, plants, wood and camera. Only the same controlled water light and ten deterministic particles move.

The same frozen inputs, task, acceptance requirements, prompt and skill went to both. Their own starting code, CLI permissions, image-delivery method and effort differ. These observations compare the two recorded workflows; they do not establish a general model ranking. Durations are observations from this run, not a speed benchmark.

Independent [delivery checks](evidence/delivery-checks.json) confirm disposable fresh builds reproduce both outputs, eight routes and 404 serve the delivered bytes, all referenced local runtime assets resolve, PNG MIME is correct, and the other seven page bodies remain identical to each own baseline. Claude adds the necessary PNG mapping to its existing server. No runtime imports point into input, baseline, the study or another implementation. The same 364 frozen-input/baseline checks pass and all 1,758 pinned historical files remain unchanged. Historical video preparation/trials are untouched.

## Actual browser verification

The primary evaluator used the same Chrome engine through CUA for both sites. Worker static/Node fixtures are separate evidence and are not counted as browser tests. Five real viewports were inspected: 1280×800, 768×1024, 390×844, 360×800 and 320×800. [Durable browser observations](evidence/browser-acceptance.json) contain 57 passed observation checks per implementation, with remaining coverage limits explicitly recorded.

| Exercised outcome | Result |
| --- | --- |
| Home and Contact at all five sizes | Exact native viewport, stable scroll position zero, no horizontal overflow; full natural-ratio image; four Contact groups |
| Full desktop light cycle | Over 18 seconds of actual light advancement at 1280×800, fixed image geometry; actual decorative keyframe endpoints match |
| Moving phone, Play/Pause and keyboard | Actual phase advancement, phase-preserving pause, readable 16px labels, 44px Codex / 48px Claude controls and visible focus |
| Actual mobile menus | Opening freezes decoration phases; close resumes eligible motion; Escape returns trigger focus; an existing user Pause remains paused |
| Fully offscreen / re-entry | Real scroll removes the frame from view and freezes phases; eligible re-entry resumes, explicit Pause survives |
| Genuine hidden Chrome tabs | Native tab selection, with active-page focus emulation disabled, produces `document.hidden=true` and freezes all eleven decorative phases for 1.3 seconds |
| Genuine visible return | Claude native state/animations report playing; Codex native AX exposes its actual Pause control on eligible return. Both preserve manual Pause after a genuine tab round trip |
| Reduced motion | Native initial and live media-query changes stop motion; explicit Play opts in with the actual 18s timing; a returning preference cannot clear a stop |
| Available Save-Data | Native getter reports true on initial load, static policy works, explicit Play opts in; temporary override and observer are restored |
| No JavaScript | Original image/copy/CTA remain; decorations and dead control are hidden. Native coordinate clicks actually navigate to Collections without JavaScript |
| Image failure | Native blocked request produces zero natural dimensions and the real error handler; reserved image frame/fallback remains, motion and control disappear |
| Site journeys | All eight pages plus 404 directly load and refresh; current navigation state, Home CTA, inner-header links, phone menu destinations, Back/Forward, three category prefills, validation, local preview, Edit and Clear work |
| Browser errors | No site-origin warning/error observed; three extension-module loading errors per site are retained separately |

## Visual comparison

Open the [before/after and size viewer](preview.html). Its after images are native JPEG screenshots with no re-encoding; use the actual sites to experience the animation. Before references are explicitly limited to preserved Home desktop/phone and Contact phone captures.

| Viewport | Codex image size | Codex control bottom | Claude image size | Claude control bottom |
| --- | --- | --- | --- | --- |
| 1280×800 | 721.9×320.7 | 538.0px | 657.8×292.2 | 526.2px |
| 768×1024 | 688×305.6 | 879.1px | 706.6×313.9 | 793.7px |
| 390×844 | 342×151.9 | 809.7px | 350×155.5 | 772.9px |
| 360×800 | 320×142.1 | 784.9px | 320×142.1 | 836.7px |
| 320×800 | 280×124.4 | 765.2px | 280×124.4 | 846.6px |

Evaluator judgment: Codex gives the desktop image more space and keeps its control within the first viewport at the two narrowest phone sizes. Claude is more compact at 390px and the intermediate size, with a succinct caption and separate quality link; its longer copy/action stack puts the control 36.7px and 46.6px beyond the first viewport at 360px and 320px. That requires a small scroll and is a visible composition trade-off, not a broken control or crop. Both use clear opaque copy surfaces and preserve the complete fish. The subtle ambient animation itself is comparable by design; no empirical animation-quality winner or overall model winner is asserted.

The existing header and Contact layouts retain their own prior designs. No subjective score was invented after seeing the deliveries. User preference is still required to determine whether either homepage feels sufficiently impressive.

## Limits and experiment deviations

- This is one Chrome engine with viewport emulation, not physical-phone or cross-browser coverage, complete accessibility compliance, performance profiling or production delivery.
- The native Save-Data override changes the browser getter but emits **zero real `connection.change` events** in both actual sites. No event was manually dispatched. Live physical-network preference delivery remains unverified, rather than being called a passed test or an application defect.
- The Mac locked after the genuine hidden/frozen and manual-Pause return checks completed. An additional Codex post-return phase-advance sample and native foreground-selection restoration could not run. Codex eligible-return proof is limited to its real native UI/state observation. Test overrides were cleared and the two owned Chrome tabs were closed through the available browser API.
- Codex's sandbox denied its worker HTTP binding; the evaluator's real loopback server/HTTP/browser checks supplied the independent verification. Claude reports a stray temporary build-log write outside its workspace, removed in the same run. These differences remain recorded in original worker evidence.
- Early evaluator reads included smooth-scroll transitions, the selected-tab scope of the viewport helper, a stale form-group helper, button hover transitions and incorrectly named JPEG captures. These were corrected without changing either implementation or deleting raw observations; see [method and corrections](METHODOLOGY.md).

## Preview and remaining project scope

Use the [protocol README](README.md) for exact source/build/preview commands. From the repository root, serve the comparison with:

```sh
python3 -m http.server 4170 --bind 127.0.0.1 --directory companies/aquatic-world
```

Open [the comparison](http://127.0.0.1:4170/comparison/round-6-animation/preview.html), [Codex](http://127.0.0.1:4231/) and [Claude](http://127.0.0.1:4232/). Python 3.10+ / Node 22+ suffice; no dependency installation or new provider is needed.

This iteration finishes only the authorized Aquatic World enhancement. The repository's company-folder convention and reusable template remain in place. Further companies still need their own verified company/industry research, briefs, assets and implementations; this fictional case does not supply that research. The case remains `building` while user design acceptance is open. No new paid video generation, publication, credential/permission change, commit, push, PR or deployment occurred.
