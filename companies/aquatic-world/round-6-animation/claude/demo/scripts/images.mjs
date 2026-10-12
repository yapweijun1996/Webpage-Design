// Deterministic WebP derivatives of the supplied nine-image pack.
// Sources are read from ../input/assets (frozen, never modified) and written to demo/assets/img.
// Requires the `cwebp` binary (libwebp). Run: npm run images
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const demoDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(demoDir, "..", "input", "assets");
const outDir = join(demoDir, "assets", "img");
const QUALITY = "78";

// id: source size and output widths (never upscaled). Optional crops are [x, y, w, h] in source pixels.
const jobs = [
  { id: "hero-angelfish", w: 1882, widths: [1882, 1280, 800] },
  { id: "hero-angelfish", w: 1882, suffix: "fish", crop: [860, 0, 1000, 836], widths: [1000, 640] },
  { id: "heritage-waterfront", w: 1586, widths: [1586, 1024, 640] },
  { id: "collection-ornamental-fish", w: 1448, widths: [1448, 960, 640] },
  { id: "collection-aquatic-plants", w: 1448, widths: [1448, 960, 640] },
  { id: "collection-driftwood", w: 1448, widths: [1448, 960, 640] },
  { id: "highlight-red-betta", w: 1448, widths: [1448, 960, 640] },
  { id: "highlight-angelfish", w: 1448, widths: [1448, 960, 640] },
  { id: "highlight-red-plants", w: 1448, widths: [1448, 960, 640] },
  { id: "enquiry-underwater-school", w: 1983, widths: [1920, 1280, 800] },
];

const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
mkdirSync(outDir, { recursive: true });
const manifest = { generated_by: "demo/scripts/images.mjs", encoder: "cwebp", quality: Number(QUALITY), derivatives: [] };

for (const job of jobs) {
  const src = join(sourceDir, `${job.id}.png`);
  const name = job.suffix ? `${job.id}-${job.suffix}` : job.id;
  for (const width of job.widths) {
    const out = join(outDir, `${name}-${width}.webp`);
    const args = ["-quiet", "-q", QUALITY, "-m", "6", "-metadata", "none"];
    if (job.crop) args.push("-crop", ...job.crop.map(String));
    const baseWidth = job.crop ? job.crop[2] : job.w;
    if (width !== baseWidth) args.push("-resize", String(width), "0");
    execFileSync("cwebp", [...args, src, "-o", out]);
    manifest.derivatives.push({
      file: `assets/img/${name}-${width}.webp`,
      source: `input/assets/${job.id}.png`,
      source_sha256: sha(src),
      crop: job.crop ?? null,
      width,
      bytes: statSync(out).size,
    });
  }
}

writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${manifest.derivatives.length} derivatives to ${outDir}`);
