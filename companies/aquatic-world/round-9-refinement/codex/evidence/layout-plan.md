# Fusion Home v2 layout plan

## Authority and inspected evidence

Implement now under AGENTS.md and TASK.md; historical design-only language in frozen inputs is superseded. Read the v2 brief, acceptance, reference README, supplied cli-web-design-director Skill and its design-review reference. Read all six native JPEGs and both native posters with the image reader. Only this candidate's demo and immutable baseline source were inspected; they start byte-identical.

The native portrait arrivals show successful fish/fin separation, lower-left copy and full CTA. The scrolled Codex capture shows collection lettering behind the navigation. Menu rows are already readable and appropriately sized. The landscape poster has quiet water at left and the fish at right; retain its existing cover/crop.

The routed investigation/verification modules are absent from this workspace. Use the supplied core and explicit acceptance; no external retrieval, browser, additional model, server or Git is permitted.

## Bounded implementation

1. Make the Home header's default background opaque #041D25, including its entire growing row and safe-area padding. Apply the existing transparent wash only to the explicitly initialized top/closed state. The no-JS fallback remains protected. Open disclosure uses the same opaque color and preserves the existing row/panel layout.
2. Change header state at any positive document scroll (therefore protected by 24px), with no animated opacity or hysteresis at 24px. Synchronize initial state, pageshow/history restoration and return-to-top; restore a closed disclosure on pageshow. Keep scroll handling isolated from video, focus and layout.
3. Preserve the existing live header measurement for menu scrolling. Share that measured bar bottom with the short-landscape arrival so enlarged/wrapped controls cannot cover its offer.
4. Add a narrowly scoped short-landscape adaptation at aspect ratio >=6/5, width <=899px and height <=500px: 60px compact bar; 18–20px wordmark; 16px gap after the live row; 32–38px naturally wrapping heading; 16px body/CTA with 1.5 line-height; 48px minimum CTA; smaller inter-block margins; bottom padding including safe area; omit the optional scroll hint. Keep left-copy/right-fish and existing media positions. Let enlarged copy grow vertically.
5. Leave portrait, near-square, desktop, lower chapters, footer, global inner styles and Contact logic unchanged. Preserve normal five-row menu, focus behavior and film/manual-pause policy.

## Routes and primary journey

| Content/action | Destination |
| --- | --- |
| Brand / Home | / |
| Arrival CTA / Collections | /collections/ |
| Ornamental Fish | /collections/ornamental-fish/ |
| Aquatic Plants | /collections/aquatic-plants/ |
| Driftwood | /collections/driftwood/ |
| Our Story | /our-story/ |
| Quality | /quality/ |
| Contact / project enquiry | /contact/ / /contact/#enquiry |
| Missing destination | /404.html |

Preserve Home → Collections → category → category-context Contact → four-group local preview → Edit / Clear. All links remain independent pages; no-JS destinations stay available.

## Verification and acceptance boundaries

Use the existing Python stdlib build and available JavaScript syntax checker. Verify byte identity of all supplied MP4/posters, independent output destinations, local links, exact arrival copy and unchanged inner-page output against this candidate's baseline. Exercise header restoration and motion/menu intent in a bounded Node mock of the existing controller; this establishes logic only, not browser behavior. Review the final source diff for Home-only scope and preservation of policies.

Short-landscape spacing is designed with substantial normal-text headroom in both required viewports. No layout coordinates are claimed as measured: browser rendering, CTA rectangles/16px clearance, glyph masking, real playback, native text enlargement, physical devices and creative acceptance remain coordinator-owned. Deliver explicit build/preview commands and these gaps in evidence/delivery.md and README.md.
