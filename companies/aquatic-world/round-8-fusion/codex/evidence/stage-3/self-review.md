# Stage 3 — Bounded Home text-resizing self-review

Result: implemented and rebuilt. Twenty-one focused source/output/integrity assertions passed. Browser acceptance and publication remain pending with the coordinator.

## Change and reason

The coordinator reported collection arrow ink extending beyond 320px after text resizing and an overlong perspective heading word. The test doubles each HTML element's pre-captured computed font-size and numeric line-height once, while viewport remains 390x844 or 320x844; reload restores it. This is injected text-only resizing, not native zoom or physical-device evidence. Element boxes alone missed the ink overflow; no browser, text-node Range measurement or stub rendering was performed here. Shared feedback about the other candidate was not treated as a finding about own source.

Own Home collection outer tracks changed from fixed 28px/24px desktop and 20px/20px phone widths to content-sized minmax tracks with those same minima. The middle track remains minmax(0,1fr). Enlarged numbers/arrows now participate in track sizing; labels/descriptions can wrap in the remaining width. The lower reading zone uses overflow-wrap:anywhere to break an otherwise overlong word when ordinary word boundaries cannot fit. The footer brand specifically retains normal word-boundary wrapping.

Home primary/text links and footer children have bounded widths, normal white-space and shrinkable minimum widths. Action arrows keep their content width; the label can grow vertically. Footer navigation retains its wrapping flex rows and can wrap a label within the container. No DOM/copy changes, new preference, text shrinking, truncation, clipping, overflow-x masking or resize-test detection was introduced.

Existing font sizes, numeric line heights, letter spacing, gaps, minimum control/row heights and hero/menu anchor declarations remain unchanged. Content-sized collection tracks may reserve a few extra pixels even at ordinary size, with corresponding redistribution of label width; ordinary rendered composition is pending review. Source preservation of type/anchor rules is not a claim of pixel-identical rendering.

## Actual verification

| Check | Actual result | Evidence and limit |
| --- | --- | --- |
| python3 -B demo/build.py | PASS, exit 0 | build.log: eight content routes plus 404 rebuilt; no browser/server |
| python3 -B evidence/stage-3/check-source.py | PASS, exit 0; 21 assertions | Retained code, source-checks.log and source-results.json; source/output/hash inspection only |
| Focused patch review | Completed | source-change.patch matches exact pre/post CSS delta; no unrelated rules changed |
| Integrity snapshot | PASS | 163 captured files, 87 protected files; before-sha256.json and before-home-motion.css |

Only root README.md, demo/home-motion.css and its built copy differ among captured files. All newly created worker files stay in evidence/stage-3/. Frozen input, baseline, other root contracts, original evidence and every stage-2 evidence file remain unchanged. Launcher-owned stage-3/process-run.json was read but not edited.

Every generated HTML file is byte-identical to its stage-2 version, including Home and all inner pages/404. Shared styles, both controllers, route/content sources, build/serve tools and assets remain byte-identical. All four runtime films/posters match frozen input bytes in source and built output. Inner pages load no Home film resources. This establishes preserved route/category/Contact implementation, not a new browser journey check. No unrelated controller, Contact, deployment or historical test suite was rerun.

The complete compact header/menu CSS block, including stage-2 flex wrapping, brand word boundaries, absolute panel anchoring and remaining-height scroll constraints, is unchanged. Controller hashes establish unchanged focus-exit, Escape/outside dismissal, nonmodal behavior, measured header geometry, film/policy/manual-pause logic. No actual focus traversal, panel scroll or playback was exercised in this stage.

## Remaining coordinator acceptance

Repeat 390x844 and 320x844 with the identical temporary 200% injection, closed/open/scrolled through all Home chapters/footer. Inspect text-node Range rectangles in addition to element boxes. Verify collection arrows/numbers/labels, the enlarged perspective heading word, both action families, footer brand and all footer destinations remain within the viewport while wrapping/reflowing. Check that the brand wraps at whole-word boundaries and that all enlarged labels remain readable without shrinking or clipping.

Retest the retained stage-2 result: brand/Menu/Close reachable, every disclosure destination reachable by real keyboard and internal scrolling on short panels, focus exit closes, open/closed hero and page-scroll anchors match, correct motion utility and pause/policy restoration. Repeat all 13 ordinary viewport compositions listed in input/design/REVIEW.md, including desktop and normal phone. These are pending tests, not passing source assertions. Inspect the small intrinsic-track redistribution against ordinary composition requirements before accepting/publication.

No browser/OS automation, MCP/network, server, deployment, dependency/configuration/permission/Git change, media edit/generation, outside write or additional model/agent was used. Existing launch metadata requests native Codex gpt-6.1-sol with high effort; no model substitution or new invocation occurred. Serving-backend identity is not independently established by that launcher record. No physical-device, native zoom or assistive-technology evidence was collected.

## Preview

Build: python3 -B demo/build.py. Coordinator-authorized preview: python3 -B demo/serve.py --port 8765, then http://127.0.0.1:8765/ (demo/public/index.html). No server was started here. Root README.md retains preview, route and publication-path instructions. Human/browser acceptance and publication remain coordinator-owned.
