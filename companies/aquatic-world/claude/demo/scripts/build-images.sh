#!/bin/sh
# Deterministic WebP derivatives from the frozen input image pack.
# Sources are read-only; outputs go to demo/assets/img/<asset-id>-<width>.webp.
# Requires cwebp (libwebp). Derivatives are committed, so a normal preview does not need this step.
set -eu
here=$(cd "$(dirname "$0")/.." && pwd)
src="$here/../input/assets"
out="$here/assets/img"
mkdir -p "$out"

# asset-id  widths...
while read -r id widths; do
  [ -z "$id" ] && continue
  for w in $widths; do
    cwebp -quiet -q 78 -m 6 -metadata none -resize "$w" 0 "$src/$id.png" -o "$out/$id-$w.webp"
  done
done <<LIST
hero-angelfish 720 1280 1882
heritage-waterfront 640 1080 1586
collection-ornamental-fish 480 960
collection-aquatic-plants 480 960
collection-driftwood 480 960
highlight-red-betta 400 800
highlight-angelfish 400 800
highlight-red-plants 400 800
enquiry-underwater-school 960 1600
LIST
echo "WebP derivatives written to $out"
