# Acceptance results

Date: 2026-10-11. Implementation: this workspace only. No worker score is assigned. Static checks and handler tests are supporting evidence, not substitutes for browser journeys or full-size screenshots.

## Separate outcomes

- Functional browser verification: **incomplete**. Required browser scenarios are not_run because no permitted live local preview/browser launch could be established.
- Builder visual assessment: **not_run**. No rendered desktop, phone, tablet or open-menu capture was obtained. Source-based design decisions and one preventative spacing correction are recorded below.
- Independent evaluator assessment: **pending**. No evaluator material was read.
- User design acceptance: **pending explicit feedback**.

## Gate coverage

| ID | Browser gate result | Actual supporting evidence |
| --- | --- | --- |
| IA-01 | not_run | Eight static destinations have unique titles/H1/main text; real HTTP handler GET and HEAD checked in-process. Direct live load/reload not exercised |
| IA-02 | not_run | Every generated page contains all five header/footer global destinations with valid real paths. No actual traversal |
| IA-03 | not_run | Three distinct category pages, enquiry category parameters, image sources and useful content exist. No browser journey |
| IA-04 | not_run | Native anchor markup; no router intercepts. New-tab/Back/Forward not exercised |
| IA-05 | not_run | Breadcrumbs, index return, logo and both sibling destinations resolve. No pointer traversal |
| IA-06 | partial supporting check | The actual server handler returned HTTP 404 with distinct recovery content in-process. Browser recovery not exercised |
| NAV-01 | not_run | Solid shared header; explicit 1119px compact breakpoint and narrow-wordmark adjustment. No rendered collision/readability result |
| NAV-02 | not_run | Native details/summary, JS Escape/outside dismissal and desktop transition are present. Pointer, keyboard and focus behavior not exercised |
| NAV-03 | not_run | Skip link first, focus rules, associated labels and no sticky header. Real keyboard journey not exercised |
| NAV-04 | not_run | Core HTML content/navigation and native menu do not need JS; contact has a noscript explanation and disabled initial preview button. Browser with JS disabled not exercised |
| FORM-01 | not_run | Source contains local validation, associated errors, focusable summary, safe text preview, edit return and explicit nothing-sent feedback. No fetch/storage/submission API. Runtime recovery not exercised |
| UI-01 | not_run | Responsive page-specific compositions implemented. All-route desktop/phone and key tablet screenshots absent |
| UI-02 | not_run | Source uses fluid grids and width breakpoints. Actual 320/360/430/1024/1920px overflow/crops not measured |
| UI-03 | not_run | Reduced-motion CSS and wrapping for preview text implemented. Browser long-input/zoom/motion checks absent |
| BUILD-01 | partial supporting check | Repeat build exit 0 and identical output; all rendered-source asset/link targets resolve; real handler serves pages and assets in-process. Live socket denied, browser console unchecked |
| FACT-01 | pass, source audit | Fictional disclosure, illustrative images, no real contact details/stock/prices/certificates/business guarantees; provenance and hashes recorded |

## Executed checks

`python3 -B evidence/verify-static.py`: 537 pass, 0 fail (static source/output plus actual HTTP handler in-process). `node --check demo/script.js` and `node --check evidence/browser-qa.cjs`: exit 0. `python3 -B demo/build.py`: exit 0, repeat output hashes identical. All 59 frozen input/instruction files retain their SHA-256 values. These counts do not establish product or design acceptance.

## Tools and unavailable checks

The terminal server attempt failed with `PermissionError: [Errno 1] Operation not permitted`; Chrome launch failed with SIGABRT. A distinct Node-tool attempt produced the same limits. Browser UI control rejected a file:// URL because its policy permits only HTTP/HTTPS and expressly prohibited workarounds. No permission/global setting was changed and no alternative file-navigation bypass was attempted. No live preview server remains.

Unavailable: all real browser navigation/menu/form checks and captures; Safari/Firefox/WebKit; physical phone/tablet; screen reader; automated accessibility/computed contrast; 200% browser zoom; runtime performance/Core Web Vitals. No fabricated screenshots or successful preview claims are provided.

## Source review and repair

1. Header is on a solid ocean surface, with native page links and a single project CTA. Exact pages and current Collections section have distinct aria-current values. At <=1119px a flow-based menu replaces the desktop links before the planned fit limit.
2. A Georgia font-width measurement identified a potential 360px brand/Menu spacing collision. The phone wordmark was reduced from 20px to 18px at <=430px, with a 30px mark; below 360px the mark is omitted. This is a preventative source fix, not an observed rendered defect. It still needs full-size verification.
3. A browser-dependent promise that entries disappear on reload was removed. The copy now states only that the demo does not save entries or connect to a service.
4. Code/source inspection preserves full-fin fish studies, distinct plant/wood/story compositions and form context. Actual crops, rhythm, text contrast and visual finish remain unknown without captures.

## Reproducible follow-up

In an environment allowing loopback and Chrome launch, start `python3 demo/serve.py --port 4191`, then run `node evidence/browser-qa.cjs` with a locally installed Playwright module. The prepared script traverses actual journeys and captures real viewports into evidence/screenshots. It is not_run here. Inspect those images at full viewport scale, repair specific defects, rerun affected checks, and record results before claiming functional verification. No user approval is needed to finish this already-authorized QA when the environment supports it.
