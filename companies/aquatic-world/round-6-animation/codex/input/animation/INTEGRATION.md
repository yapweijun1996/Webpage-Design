# Common Controlled Animation Requirements v1

Prepared on 2026-10-12. Selected direction: original still image with controlled water-light and particle animation. This contract replaces the proposed video direction for a future homepage enhancement; it does not rewrite the historical video experiment or authorize native execution.

## Scope and equal inputs

Both future workers start from independent copies of their own round-5 websites. Home alone receives the enhancement. Preserve all eight distinct page routes, direct loading/refresh/history, current header and route navigation, four-group Contact behavior and page-specific content. Own each implementation's code/assets locally; do not import runtime files from another worker, older workspace or this canonical study.

Supply the same copied source bytes, this contract, common prompt, reference files and frozen manifest to both workers. The study is shared input, not a contestant submission. Workers may integrate independently into their existing HTML/build and typography, but must retain the same scene/motion limits. Record source/build paths and perform real browser checks. Do not compare the reference study against one worker as if it were another model's output.

## Visual contract

| Property | Shared requirement |
| --- | --- |
| Subject | Original 1882×836 source; no fish/body/fin, plant, wood or camera movement |
| Image presentation | Full image, natural aspect ratio; no crop, cover fit, perspective, zoom, parallax, recolor or animated image transforms |
| Desktop composition | Readable opaque copy surface and visible primary action; frame and animation button visible together at 1280×800 |
| Phone composition | Copy/primary action before the landscape frame; retain full fish/fins at 320, 360 and 390px |
| Water light | One layer inside x=3–49%, y=3–88% of the image; translateY 0→6px→0; opacity .04→.09→.04; 18s ease-in-out |
| Particles | Exactly ten 2px round points; static positions/delays from supplied CSS; no random values; x remains in left half |
| Particle movement | translate(0,0)→(5px,-8px)→(0,0); opacity .18→.42→.18; 16/20/22s ease-in-out cycles |
| Loop | Matching endpoints with zero endpoint velocity; continuous CSS animation, no timer reset or frame replacement |
| Containment | Decorative layers clipped to media frame and cannot intercept pointer/keyboard events; no animated layer over copy, controls or fish |
| Layout | Reserve 1882/836 aspect ratio before decode; loading/motion/menu states do not move the frame |

The subject stays still by design. This is ambient webpage motion; do not describe it as generated fish video or realistic fish animation. The copy in the study is schematic. Workers retain their own approved site wording and usable collection destination.

## Motion state and fallback contract

One state owner combines user intent, preference and visibility. Motion runs only when image-ready, in view, document-visible, menu-closed and permitted by user/policy. Temporary suspension never erases a user/policy stop.

| State or event | Required behavior |
| --- | --- |
| JavaScript disabled/unavailable | Original image, readable copy, usable navigation/CTA; moving layers and unavailable buttons hidden |
| Normal visible initial load | Gentle animation starts after valid image readiness; visible Pause animation action |
| Image missing/error | No moving decorations or misleading animation button; visible alternative text and usable main journey |
| User Pause | Pause CSS animations in place; visible Play animation action; remember until document ends |
| User Play | Clear user/policy stop, opt in and play only when other gates permit |
| Hero fully offscreen | Suspend until visible; keep phase and explicit user pause intact |
| Document hidden | Suspend; return resumes only when allowed by remaining gates |
| Mobile menu/modal open | Suspend; correct focus, dismissal and background isolation remain intact |
| Menu close/Escape/backdrop | Restore trigger focus; resume only when allowed, never erase explicit Pause |
| Reduced motion initially | Still image; no moving decorations; offer explicit Play opt-in |
| Reduced motion changes to reduce | Stop immediately and hide moving decorations; changing back alone cannot resume |
| Save-Data exposed and true | Still image until explicit opt-in; unsupported signal must be recorded as unavailable |

Provide a real keyboard button with action label Play animation/Pause animation, at least 44×44px and visible focus. It describes actual running/suspended state. The reduced-motion opt-in is explicit and still respects visibility/menu gates. No repeated announcements during animation. Decorations are `aria-hidden`; source image has concise alternative text. All essential text/links remain ordinary HTML. Keep body/control text at least 16px and contrast readable on opaque surfaces.

No API, key, provider request, video download, paid generation, tracking or new dependency belongs in the visitor runtime. Reference source image is 2.21MB; no performance improvement claim is implied. Any future smaller-image derivative must be prepared once centrally and supplied equally in a declared manifest revision.

## Comparison and acceptance

Evaluate the same dimensions and tasks for each worker: 1280×800 desktop; 768×1024 intermediate; 390×844, 360×800 and 320×800 phone. Inspect actual moving desktop/phone frames, at least one complete light cycle, pause/Play, initial/live reduced motion, fully offscreen and hidden-tab states, open/closed menu, explicit pause after those changes, no-JavaScript fallback, console errors and all required page journeys. Capture full fish framing and control reachability; measure overflow and image/control rectangles.

Separate observed functional results, visual judgment, unavailable browser/device checks and user acceptance. This preview does not establish a model winner. Native execution is pending; perform help/model capability checks and freeze own-baseline conditions before running the exact requested models, Codex `gpt-6.1-sol` and Claude `claude-opus-5-5`. Never silently substitute a model.
