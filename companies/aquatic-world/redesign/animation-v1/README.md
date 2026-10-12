# Aquatic World — Controlled Animation Study v1

Prepared on 2026-10-12 following the user's selection of the original image with controlled webpage animation. This is an independent local motion study and common integration input. It is not a Codex or Claude contestant delivery. The existing ten implementation versions and both Runway trial files remain preserved.

## Preview

From the repository root:

```sh
python3 -m http.server 4170 --bind 127.0.0.1 --directory companies/aquatic-world
```

Open [the motion study](http://127.0.0.1:4170/redesign/animation-v1/preview.html). The relative entry point is [preview.html](preview.html). It needs no installation, API key, provider, generated video or build step. The local server supplies the image, stylesheet, script and review documents.

## Direction and ownership

The original 1882×836 image is copied byte-for-byte into this package. Fish, plants, wood and camera remain still. A low-opacity water-light layer and ten deterministic particles animate only within the quiet left half of the image. The full image aspect ratio is retained on desktop and phone.

[INTEGRATION.md](INTEGRATION.md) owns the common behavior and visual limits. [IMPLEMENTATION-PROMPT.txt](IMPLEMENTATION-PROMPT.txt) is the prepared equal-input task for a later native CLI comparison. [input-manifest.json](input-manifest.json) pins the source and reference implementation. [Verification](VERIFICATION.md) records the observed result and limits.

The native-signal follow-up verifies real Chrome hidden/visible transitions and preservation of user Pause. Initial Save-Data still fallback and explicit opt-in also pass using Chrome's native CDP signal override. A real live network preference change remains unverified; the override did not emit a connection-change event in the bounded observation. No preview code change was needed. See the same verification record for sources, measurements and restoration.

The reference preview uses a self-contained plain HTML/CSS/JavaScript implementation. `motion.js` owns user intent, policy and visibility gates. The native dialog owns modal focus/background isolation. The image is present in base HTML; moving decorations are hidden without JavaScript. Review links lead to real documents and the existing comparisons.

## Provenance

Source: [original company asset pack](../../comparison/assets-v1/asset-manifest.json), asset `hero-angelfish`, generated on 2026-10-10 for this fictional design case. This is AI-generated illustrative aquarium imagery, not evidence of actual inventory or a verified species/company. The authoritative source is `comparison/assets-v1/hero-angelfish.png`, SHA-256 `8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1`, 2,205,920 bytes. This package uses those exact bytes without crop, recolor or re-encoding.

## Execution boundary and rollback

No further paid generation, key-limit changes, native Codex/Claude runs, publication or Git operations are part of this study. That statement describes this standalone study. Subsequent authorized native site integrations are delivered separately in [round-6-animation](../../comparison/round-6-animation/README.md), with [actual-site results](../../comparison/round-6-animation/RESULTS.md) and current previews on 4231/4232. The old [video preparation](../motion-v1/README.md) and its frozen contracts remain historical; this new animation contract owns the selected local motion direction.

To revert the study, remove only this new `animation-v1/` package and its catalog/status references. It has no runtime dependencies in existing site implementations. Native integration is now complete in the independent site workspaces; user acceptance remains pending. Do not treat this study's browser checks as actual-site acceptance: use the separate [comparison evidence](../../comparison/round-6-animation/RESULTS.md).
