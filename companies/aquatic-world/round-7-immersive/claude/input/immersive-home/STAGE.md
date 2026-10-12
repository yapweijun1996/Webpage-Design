# Immersive Home staged implementation

The current user goal authorizes completing both websites and publishing them to GitHub Pages for testing. Historical design-only language describes the earlier phase. The coordinator retains delivery ownership.

## Stage 1: implementation while new video authorization is pending

Build the full design and playback controller using identical clean posters and agreed future video paths. Both native CLIs use the same instructions and own immutable round-6 baseline copies. Missing video is an explicitly incomplete media dependency, not a passed motion test. This stage is implementation preparation, not the final video comparison or publishable final delivery.

Read input/immersive-home/BRIEF.md for the complete design. Use input/reference/desktop-v1.png and mobile-v1.png as visual direction, never as runtime images. Inspect clean landscape/portrait generation frames. Preserve eight routes, inner-page layouts and the four-group local Contact journey.

Own runtime filenames: /assets/immersive/landscape.mp4, portrait.mp4, landscape-poster.webp, portrait-poster.webp. Video files are deliberately absent until Stage 2. Copy supplied posters byte-for-byte into your own runtime. Expect a silent inline H.264/24fps film of approximately six seconds per orientation; future loops may be centrally processed to remove jumps. Workers must not generate, repair or substitute media.

The common media selection query is `(min-width: 900px) and (min-aspect-ratio: 6/5)`: landscape when true, portrait otherwise. Both media use centered cover, without transforms. Desktop/tablet and narrow-phone subject margins will be independently checked against moving frames before final acceptance. Header compact transition may happen sooner than the media transition to preserve readable navigation.

Use literal HTML URL attributes for every runtime path, including deferred video paths such as data-landscape-src and data-portrait-src. Do not hard-code root URLs inside JS or CSS. The Pages packager rebases URL attributes; JS reads those already-resolved values. Do not eagerly attach video src when reduced motion, exposed Save-Data or a retained manual pause calls for a poster. No autoplay download in these states. Preserve optional explicit opt-in, menu/tab suspension, no-JS navigation, error fallback and session Pause behavior from the brief.

Typography and content are shared: Georgia display/wordmark, Arial body, exact brief copy, one gold hero CTA. Full Home environment through footer; foreground scrolls normally. Remove the old framed hero and particles. No code or media from another implementation.

Record a design/state plan, implement and build in this same run. Report missing film tests as not run. The coordinator owns actual CUA browser review, not worker browser shell scripts.

## Stage 2 and final delivery

After paid authorization and technical/visual review, the coordinator freezes the identical film bytes and their matching posters as a new input stage. Both candidates receive the same media update and common revision instructions. Historical inputs stay intact. Only final actual-video verification can satisfy COMPARISON.md motion gates. Creative selection by the coordinator is recorded separately from human acceptance, which remains open for the user's public test.

No paid video call has been authorized by this file. Do not publish the incomplete Stage 1 website as the finished immersive-video experience.
